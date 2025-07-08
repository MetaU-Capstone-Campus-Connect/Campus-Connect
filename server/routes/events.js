const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE EVENT
router.post("/createEvent", async (req, res) => {
  try {
    const {
      eventName,
      eventInfo,
      eventDate,
      eventImg,
      eventLocation,
      userName,
      groupId,
    } = req.body;

    const eventData = {
      eventName,
      eventInfo,
      eventDate,
      eventImg,
      eventLocation,
      eventUsers: {
        connect: [{ userName }],
      },
    };

    if (groupId) {
      eventData.eventGroups = {
        connect: [{ groupId }],
      };
    }

    const newEvent = await prisma.events.create({ data: eventData });

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
        eventGroups: true,
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

// DISPLAY ADMIN GROUPS
router.get("/user/:userName/admin", async (req, res) => {
  const { userName } = req.params;

  try {
    const user = await prisma.users.findUnique({
      where: { userName },
      include: {
        members: {
          where: {
            rank: "ADMIN",
          },
          include: {
            group: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Error: User not found" });
    }

    const adminGroups = user.members.map((member) => member.group);

    res.status(200).json(adminGroups);
  } catch (error) {
    console.error("Error: fetching admin groups", error);
    res.status(500).json({ error: "Error: to fetch admin groups" });
  }
});

module.exports = router;
