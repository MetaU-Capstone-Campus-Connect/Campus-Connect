const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { hashPassword, verifyPassword } = require("../bcrypt");

// USERS/SIGNUP (POST) -> CREATE USER ACCOUNT
router.post("/users/signup", async (req, res) => {
  const { userName, userPwd } = req.body;

  try {
    const activeUser = await prisma.users.findUnique({
      where: {
        userName: userName,
      },
    });

    if (activeUser) {
      res.status(409).json({
        error: "Error: Username already exists.",
        message: "⚠️ Username alreadys exists, please try again!",
      });
      return;
    }

    const hashPwd = await hashPassword(userPwd);
    const newUser = await prisma.users.create({
      data: {
        userName,
        userPwd: hashPwd,
        userProfileImg:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png?20220226140232",
        userProfileBanner:
          "https://www.altavia.hu/wp-content/uploads/2020/11/Hero-Banner-Placeholder-Light-1024x480-1.png",
        userBio: "New to Campus Connect!",
      },
    });
    res.status(201).json({
      newUser,
      message: `Welcome ${userName} to Campus Connect!`,
      user: userName,
    });
  } catch (error) {
    console.error("Error: Creating a new user -> ", error);
    res.status(500).json({
      error: "Error: Creating a new user.",
    });
  }
});

// USERS/LOGIN (POST) -> LOGIN USER ACCOUNT
router.post("/users/login", async (req, res) => {
  const { userName, userPwd } = req.body;
  const user = await prisma.users.findUnique({
    where: {
      userName: userName,
    },
  });

  try {
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "❌ Username is incorrect, please try again!",
      });
    }
    const unHashPwd = await verifyPassword(userPwd, user.userPwd);
    if (!unHashPwd) {
      return res.status(401).json({
        error: "User password not found",
        message: "❌ Password is incorrect, please try again!",
      });
    }

    res.status(200).json({
      message: `Welcome back, ${userName}`,
      user: userName,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error: Logging in a new user.",
    });
  }
});

// GET SELF USER PROFILE
router.get("/users/:name", async (req, res) => {
  const userName = req.params.name;
  try {
    const user = await prisma.users.findUnique({
      where: {
        userName: userName,
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

module.exports = router;
