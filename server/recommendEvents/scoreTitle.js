const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { scoreSimilarity } = require("./scoringMethods")

router.get("/user/:userName/scoreTitle", async (req, res) => {
  const { userName } = req.params;

  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const user = await prisma.users.findUnique({
      where: { userName },
      include: { Events: true },
    });

    const pastEvents = user.Events.filter(
      (event) => event.eventDate < currentDate
    ).map((event) => event.eventName);

    const upcomingEvents = await prisma.events.findMany({
      where: {
        eventDate: { 
          gte: currentDate
        },
        eventUsers: {
          none: { 
            userName
          },
        },
      },
    });

    const scoreTitle = upcomingEvents.map((event) => {
      let maxScore = 0;

      for (const pastTitle of pastEvents) {
        const score = scoreSimilarity(event.eventName, pastTitle);
        if (score > maxScore) {
          maxScore = score;
        }
      }

      return {
        eventId: event.eventId,
        eventName: event.eventName,
        score: maxScore,
      };
    });

    res.status(200).json(scoreTitle);
  } catch (error) {
    console.error("Error: Scroing event titles ", error);
    res.status(500).json({ error: "Error: Scoring event titles" });
  }
});

module.exports = router;