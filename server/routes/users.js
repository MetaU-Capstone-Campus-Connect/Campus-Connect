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
        message: "Sorry, that username alreadys exists please try again!",
      });
      return;
    }

    const hashPwd = await hashPassword(userPwd);
    const newUser = await prisma.users.create({
      data: {
        userName,
        userPwd: hashPwd,
      },
    });
    res.status(201).json({
      newUser,
      message: `Welcome ${userName} to Campus Connect!`,
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
        message: "Username is incorrect, please try again!",
      });
    }
    const unHashPwd = await verifyPassword(userPwd, user.userPwd);
    if (!unHashPwd) {
      return res.status(401).json({
        error: "User password not found",
        message: "Password is incorrect, try again.",
      });
    }

    res.status(200).json({
      message: `Welcome back, ${userName}`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error: Logging in a new user.",
    });
  }
});

// USERS/ID (GET) -> GET A USER ACCOUNT FROM USER UNIQUE ID
router.get("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Error: Fetching a unique user -> ", error);
    res.status(500).json({
      error: "Error: Fetching a uniuque user.",
    });
  }
});

module.exports = router;
