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
        userStatus: "ONLINE",
        userBio: "New to Campus Connect!",
      },
    });
    req.session.user = {
      userID: newUser.id,
      userName: newUser.userName,
      accountDate: newUser.accountDate,
      userProfileImg: newUser.userProfileImg,
      userProfileBanner: newUser.userProfileBanner,
      userBio: newUser.userBio,
      userStatus: newUser.userStatus,
    };
    res.status(201).json({
      newUser,
      message: `Welcome ${userName} to Campus Connect!`,
      user: {
        userID: newUser.id,
        userName: newUser.userName,
        accountDate: newUser.accountDate,
        userProfileImg: newUser.userProfileImg,
        userProfileBanner: newUser.userProfileBanner,
        userBio: newUser.userBio,
        userStatus: newUser.userStatus,
      },
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
    const isVerifiedPassword = await verifyPassword(userPwd, user.userPwd);
    if (!isVerifiedPassword) {
      return res.status(401).json({
        error: "User password not found",
        message: "❌ Password is incorrect, please try again!",
      });
    }

    req.session.user = {
      userID: user.userId,
      userName: user.userName,
      accountDate: user.accountDate,
      userProfileImg: user.userProfileImg,
      userProfileBanner: user.userProfileBanner,
      userBio: user.userBio,
      userStatus: user.userStatus,
    };
    res.status(200).json({
      message: `Welcome back, ${userName}`,
      user: {
        userID: user.userID,
        userName: user.userName,
        accountDate: user.accountDate,
        userProfileImg: user.userProfileImg,
        userProfileBanner: user.userProfileBanner,
        userBio: user.userBio,
        userStatus: user.userStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Error: Logging in a new user.",
    });
  }
});

// VERIFY (GET) -> CHECK USER IF IN SESSION
router.get("/verify", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "user is not logged in" });
  }
  try {
    const loggedUser = await prisma.users.findUnique({
      where: {
        userName: req.session.user.userName,
      },
    });
    res.status(200).json({ user: loggedUser });
  } catch (error) {
    console.error("Failed to verify user");
    res.status(500).json({ message: "Server error verifying user" });
  }
});

// LOGOUT (POST) -> LOGS USER OUT FROM USER SESSION
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error ennding session:", err);
      res.send("Error ending session");
    } else {
      res.send("Session ended");
    }
  });
});

module.exports = router;
