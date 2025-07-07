const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// CREATE EVENT
router.post("/createEvent", async (req, res) => {
  try {
    const { eventName, eventInfo, eventDate, eventImg, eventLocation, userName } = req.body;

    const newEvent = await prisma.events.create({
      data: {
        eventName,
        eventInfo,
        eventDate,
        eventImg,
        eventLocation,
        eventUsers: {
          connect: [{ userName: userName }],
        },
      },
    });
    return res
      .status(201)
      .json({ message: "Event added to system", data: newEvent });
  } catch (error) {
    console.error("Error: Creating a new event", error);
    return res.status(500).json({ error: "Error: Creating a new event" });
  }
});


// SHOW ALL EVENTS
router.get("/events", async (req, res) => {
  try {
    const events = await prisma.events.findMany({
      include: {
        eventUsers: true,
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error: Fetching events", error);
    res.status(500).json({ message: "Error: Fetching events" });
  }
});

// JOIN AN EVENT
router.post("/event/:id/join", async (req, res) => {
  const eventId = parseInt(req.params.id);
  const { userName } = req.body;
  try {
    const updateMembers = await prisma.events.update({
      where: {
        eventId: eventId,
      },
      data: {
        eventUsers: {
          connect: [{ userName: userName }],
        },
      },
      include: {
        eventUsers: true,
      },
    });

    res.status(200).json(updateMembers);
  } catch (error) {
    console.error("Error updating members", error);
    res.status(500).json({ message: "Error: Updating members" });
  }
});


router.get("/user/:userName/events", async (req, res) => {
  const { userName } = req.params;

  try {
    const user = await prisma.users.findUnique({
      where: {
        userName,
      },
      include: {
        Events: {
          include: {
            eventUsers: true,
          },
        },
      },
    });

    res.status(200).json(user.Events);
  } catch (error) {
    console.error("Error: Fething user joined events", error);
    res.status(500).json({ message: "Error: Fetching user joined events" });
  }
});

module.exports = router;