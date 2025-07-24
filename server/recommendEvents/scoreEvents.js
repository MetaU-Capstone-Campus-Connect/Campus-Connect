const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  scoreSimilarity,
  mapMutuals,
  scoreMutuals,
  mapHosts,
  scoreHosts,
  mapDays,
  scoreDays,
  scoreAvailability,
  mapGroupMutuals,
  scoreGroupMutuals,
  getScoreWeight,
} = require("./scoringMethods");

router.get("/user/:userName/scoreEvents", async (req, res) => {
  const { userName } = req.params;

  try {
    const currentDate = new Date().toISOString().split("T")[0];

    const user = await prisma.users.findUnique({
      where: { userName },
      include: {
        Events: {
          include: {
            eventUsers: true,
          },
        },
        members: {
          include: {
            group: {
              include: {
                members: {
                  include: {
                    user: true,
                  }
                }
              }
            }
          }
        }
      },
    });

    const upcomingEvents = await prisma.events.findMany({
      where: {
        eventDate: {
          gte: currentDate,
        },
      },
      include: {
        eventUsers: {
          select: { userName: true },
        },
      },
    });

    const rsvpEvents = upcomingEvents.filter((event) =>
      event.eventUsers.some((user) => user.userName === userName)
    );

    const nonRsvpEvents = upcomingEvents.filter((event) =>
      event.eventUsers.every((user) => user.userName !== userName)
    );

    const pastEvents = user.Events.filter(
      (event) => event.eventDate < currentDate
    );
    const allGroupMutuals = user.members.map((member) => member.group);
    const pastTitles = pastEvents.map((event) => event.eventName);
    const pastDescriptions = pastEvents.map((event) => event.eventInfo);
    const pastLocations = pastEvents.map((event) => event.eventLocation);
    const mutualMap = mapMutuals(userName, pastEvents);
    const mutualGroupMembers = mapGroupMutuals(userName, allGroupMutuals);
    const hostMap = mapHosts(userName, pastEvents);
    const dayMap = mapDays(pastEvents);
    const totalPastEvents = pastEvents.length;
    const groupMembersSize = mutualGroupMembers.size;

    const scoreEvents = nonRsvpEvents.map((event) => {
      let titleMax = 0;
      let infoMax = 0;
      let locationMax = 0;
      
      const eventUserList = event.eventUsers.map((user) => user.userName);
      const scoreUsers = scoreMutuals(eventUserList, mutualMap, userName);
      const scoreGroupMembers = scoreGroupMutuals(eventUserList, mutualGroupMembers, userName);
      const eventHost = event.eventHost;
      const scoreHost = scoreHosts(eventHost, hostMap, totalPastEvents);
      const scoreDay = scoreDays(event.eventDate, dayMap, totalPastEvents);
      const scoreAvbl = scoreAvailability(event, rsvpEvents);
      if (scoreAvbl === 0 && rsvpEvents.length > 0) {
        return null;
      }

      for (const pastTitle of pastTitles) {
        titleMax = Math.max(
          titleMax,
          scoreSimilarity(event.eventName, pastTitle)
        );
      }

      for (const pastDescription of pastDescriptions) {
        infoMax = Math.max(
          infoMax,
          scoreSimilarity(event.eventInfo, pastDescription)
        );
      }

      for (const pastLocation of pastLocations) {
        locationMax = Math.max(
          locationMax,
          scoreSimilarity(event.eventLocation, pastLocation)
        );
      }

      const scoreWeight = getScoreWeight(totalPastEvents, groupMembersSize);
      const weightedTotal =
        scoreWeight.title * titleMax +
        scoreWeight.info * infoMax +
        scoreWeight.location * locationMax +
        scoreWeight.users * scoreUsers +
        scoreWeight.hosts * scoreHost +
        scoreWeight.days * scoreDay +
        scoreWeight.availability * scoreAvbl +
        scoreWeight.groupMembers * scoreGroupMembers;

      return {
        eventId: event.eventId,
        eventName: event.eventName,
        eventLocation: event.eventLocation,
        eventLength: event.eventLength,
        eventDate: event.eventDate,
        eventUsers: event.eventUsers,
        eventHost: event.eventHost,
        eventInfo: event.eventInfo,
        eventImg: event.eventImg,
        weightedTotal: weightedTotal,
      };
    }).filter((event) => event !== null);

    res.status(200).json(scoreEvents);
  } catch (error) {
    console.error("Error: Scroing events ", error);
    res.status(500).json({ error: "Error: Scoring event" });
  }
});

module.exports = router;