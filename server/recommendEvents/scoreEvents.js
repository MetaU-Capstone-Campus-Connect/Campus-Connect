const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { scoreSimilarity } = require("./scoringMethods");

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
      include: { Events: true },
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
    });

    const pastEvents = user.Events.filter(
      (event) => event.eventDate < currentDate
    );
    const pastTitles = pastEvents.map((event) => event.eventName);
    const pastDescriptions = pastEvents.map((event) => event.eventInfo);
    const pastLocations = pastEvents.map((event) => event.eventLocation);

    const scoreEvents = upcomingEvents.map((event) => {
      let titleMax = 0;
      let infoMax = 0;
      let locationMax = 0;

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

      const total = titleMax + infoMax + locationMax;
      const weightedTotal = (scoreWeight.title * titleMax) + (scoreWeight.info * infoMax) + (scoreWeight.location * locationMax);

      return {
        eventId: event.eventId,
        eventName: event.eventName,
        scoreTitle: titleMax,
        scoreInfo: infoMax,
        scoreLocation: locationMax,
        unweightedTotal: total,
        weightedTotal: weightedTotal,
      };
    });

    res.status(200).json(scoreEvents);
  } catch (error) {
    console.error("Error: Scroing events ", error);
    res.status(500).json({ error: "Error: Scoring eventw" });
  }
});

module.exports = router;