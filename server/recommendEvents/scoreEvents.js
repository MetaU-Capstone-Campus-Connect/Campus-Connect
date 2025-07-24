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
                  },
                },
              },
            },
          },
        },
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
    const userGroups = user.members.map((member) => member.group);
    const pastTitles = pastEvents.map((event) => event.eventName);
    const pastDescriptions = pastEvents.map((event) => event.eventInfo);
    const pastLocations = pastEvents.map((event) => event.eventLocation);
    const mutualMap = mapMutuals(userName, pastEvents);
    const groupMemberMap = mapGroupMutuals(userName, userGroups);
    const hostMap = mapHosts(userName, pastEvents);
    const dayMap = mapDays(pastEvents);
    const totalPastEvents = pastEvents.length;
    const groupMembersSize = groupMemberMap.size;

    const scoreEvents = nonRsvpEvents
      .map((event) => {
        let titleScore = 0;
        let infoScore = 0;
        let locationScore = 0;

        const eventUserNames = event.eventUsers.map((user) => user.userName);
        const mutualUserScore = scoreMutuals(
          eventUserNames,
          mutualMap,
          userName
        );
        const groupMutualScore = scoreGroupMutuals(
          eventUserNames,
          groupMemberMap,
          userName
        );
        const eventHost = event.eventHost;
        const hostScore = scoreHosts(eventHost, hostMap, totalPastEvents);
        const dayScore = scoreDays(event.eventDate, dayMap, totalPastEvents);
        const availabilityScore = scoreAvailability(event, rsvpEvents);
        if (availabilityScore === 0 && rsvpEvents.length > 0) {
          return null;
        }

        for (const pastTitle of pastTitles) {
          titleScore = Math.max(
            titleScore,
            scoreSimilarity(event.eventName, pastTitle)
          );
        }

        for (const pastDescription of pastDescriptions) {
          infoScore = Math.max(
            infoScore,
            scoreSimilarity(event.eventInfo, pastDescription)
          );
        }

        for (const pastLocation of pastLocations) {
          locationScore = Math.max(
            locationScore,
            scoreSimilarity(event.eventLocation, pastLocation)
          );
        }

        const scoreWeight = getScoreWeight(totalPastEvents, groupMembersSize);
        const weightedTotal =
          scoreWeight.title * titleScore +
          scoreWeight.info * infoScore +
          scoreWeight.location * locationScore +
          scoreWeight.users * mutualUserScore +
          scoreWeight.hosts * hostScore +
          scoreWeight.days * dayScore +
          scoreWeight.availability * availabilityScore +
          scoreWeight.groupMembers * groupMutualScore;

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
      })
      .filter((event) => event !== null);

    res.status(200).json(scoreEvents);
  } catch (error) {
    console.error("Error: Scroing events ", error);
    res.status(500).json({ error: "Error: Scoring event" });
  }
});

module.exports = router;
