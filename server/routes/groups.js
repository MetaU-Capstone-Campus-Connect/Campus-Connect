const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE GROUP
router.post("/createGroup", async (req, res) => {
  try {
    const { groupName, groupInfo, groupImg, userName } = req.body;

    const user = await prisma.users.findUnique({
      where: { userName },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newGroup = await prisma.groups.create({
      data: {
        groupName,
        groupInfo,
        groupImg,
        members: {
          create: {
            user: {
              connect: { userId: user.userId },
            },
            rank: "ADMIN",
          },
        },
      },
      include: {
        members: {
          include: { user: true },
        },
      },
    });

    return res
      .status(201)
      .json({ message: "Study Group added to system", data: newGroup });
  } catch (error) {
    console.error("Error: Creating a new study group", error);
    return res.status(500).json({ error: "Error: Creating a new study group" });
  }
});

// SHOW ALL GROUPS
router.get("/groups", async (req, res) => {
  try {
    const groups = await prisma.groups.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
        groupEvents: true,
      },
    });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error: Fetching groups", error);
    res.status(500).json({ message: "Error: Fetching groups" });
  }
});

// USER JOIN GROUP
router.post("/group/:id/join", async (req, res) => {
  const groupId = parseInt(req.params.id);
  const { userName } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: { userName },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const member = await prisma.groupMembers.create({
      data: {
        userId: user.userId,
        groupId: groupId,
        rank: "MEMBER",
      },
    });

    return res.status(200).json({ message: "User joined group", member });
  } catch (error) {
    console.error("Error: updating members", error);
    res.status(500).json({ error: "Error: Updating members" });
  }
});

// SHOW ALL USER GROUPS
router.get("/user/:userName/groups", async (req, res) => {
  const { userName } = req.params;

  try {
    const user = await prisma.users.findUnique({
      where: { userName },
      include: {
        members: {
          include: {
            group: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const groupsWithRoles = user.members.map((member) => ({
      group: member.group,
      rank: member.rank,
    }));

    res.status(200).json(groupsWithRoles);
  } catch (error) {
    console.error("Error: Fething user joined groups", error);
    res.status(500).json({ message: "Error: Fetching user joined groups" });
  }
});

module.exports = router;
