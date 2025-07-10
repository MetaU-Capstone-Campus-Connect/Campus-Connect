const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  scoreSimilarity,
  mapMutuals,
  scoreMutuals,
} = require("./scoringMethods");

const scoreWeight = {
  title: 0.25,
  users: 0.25,
  info: 0.15,
  dateTime: 0.15,
  location: 0.05,
  groups: 0.05,
};

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
      },
    });

    const upcomingEvents = await prisma.events.findMany({
      where: {
        eventDate: {
          gte: currentDate,
        },
        eventUsers: {
          none: {
            userName,
          },
        },
      },
      include: {
        eventUsers: { 
          select:{ 
            userName: true 
          } 
        },
      },
    });

    const pastEvents = user.Events.filter(
      (event) => event.eventDate < currentDate
    );
    const pastTitles = pastEvents.map((event) => event.eventName);
    const pastDescriptions = pastEvents.map((event) => event.eventInfo);
    const pastLocations = pastEvents.map((event) => event.eventLocation);
    const mutualMap = mapMutuals(userName, pastEvents);

    const scoreEvents = upcomingEvents.map((event) => {
      let titleMax = 0;
      let infoMax = 0;
      let locationMax = 0;
      
      const eventUserList = event.eventUsers.map((user) => user.userName);
      const scoreUsers = scoreMutuals(eventUserList, mutualMap, userName);

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

      const weightedTotal =
        (scoreWeight.title * titleMax) +
        (scoreWeight.info * infoMax) +
        (scoreWeight.location * locationMax) +
        (scoreWeight.users * scoreUsers);

      return {
        eventId: event.eventId,
        eventName: event.eventName,
        scoreTitle: titleMax,
        scoreInfo: infoMax,
        scoreLocation: locationMax,
        scoreUsers: scoreUsers,
        weightedTotal: weightedTotal,
      };
    });

    res.status(200).json(scoreEvents);
  } catch (error) {
    console.error("Error: Scroing events ", error);
    res.status(500).json({ error: "Error: Scoring event" });
  }
});

module.exports = router;