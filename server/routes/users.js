const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET USER PROFILE
router.get("/users/:name", async (req, res) => {
  const userName = req.params.name;
  try {
    const user = await prisma.users.findUnique({
      where: {
        userName: userName,
      },
      include: {
        Events: true,
        members: {
          include: {
            group: true,
          },
        },
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Error: Fetching a unique user -> ", error);
    res.status(500).json({
      error: "Error: Fetching a unique user.",
    });
  }
});

router.put("/users/:name/banner", async (req, res) => {
  const userName = req.params.name;
  const { userProfileBanner } = req.body;

  try {
    const updateUser = await prisma.users.update({
      where: {
        userName: userName,
      },
      data: {
        userProfileBanner,
      },
    });
    res.status(200).json({ message: "Banner Updated", user: updateUser });
  } catch (error) {
    console.error("Error updating profile banner");
    res.status(500).json({
      error: "Error: Updating user profile banner.",
    });
  }
});

router.put("/users/:name/profile", async (req, res) => {
  const userName = req.params.name;
  const { userProfileImg } = req.body;

  try {
    const updateUser = await prisma.users.update({
      where: {
        userName: userName,
      },
      data: {
        userProfileImg,
      },
    });
    res.status(200).json({ message: "Profile IMG Updated", user: updateUser });
  } catch (error) {
    console.error("Error updating profile img");
    res.status(500).json({
      error: "Error: Updating user profile img.",
    });
  }
});

router.put("/users/:name/status", async (req, res) => {
  const userName = req.params.name;
  const { userStatus } = req.body;

  try {
    const updateUser = await prisma.users.update({
      where: {
        userName: userName,
      },
      data: {
        userStatus,
      },
    });
    res.status(200).json({ message: "User Status Updated", user: updateUser });
  } catch (error) {
    console.error("Error updating status");
    res.status(500).json({
      error: "Error: Updating user status.",
    });
  }
});

router.put("/users/:name/bio", async (req, res) => {
  const userName = req.params.name;
  const { userBio } = req.body;

  try {
    const updateUser = await prisma.users.update({
      where: {
        userName: userName,
      },
      data: {
        userBio,
      },
    });
    res.status(200).json({ message: "User Bio Updated", user: updateUser });
  } catch (error) {
    console.error("Error updating bio.");
    res.status(500).json({
      error: "Error: Updating user bio.",
    });
  }
});

module.exports = router;
