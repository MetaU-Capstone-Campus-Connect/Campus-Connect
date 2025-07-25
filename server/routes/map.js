const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/setLocation", async (req, res) => {
  try {
    const { mapUserName, mapLong, mapLat, message } = req.body;

    await prisma.map.updateMany({
      where: {
        mapUserName,
        status: "ACTIVE",
      },
      data: {
        status: "PAST",
      },
    });

    const newLocation = await prisma.map.create({
      data: {
        mapUserName,
        mapLong,
        mapLat,
        message,
        status: "ACTIVE",
      },
    });
    return res
      .status(201)
      .json({ message: "Location added", data: newLocation });
  } catch (error) {
    console.error("Error: Adding new map location", error);
    return res.status(500).json({ error: "Error: Adding new map location" });
  }
});

router.get("/getLocations", async (req, res) => {
  try {
    const locations = await prisma.map.findMany({
      where: {
        status: "ACTIVE",
      },
    });
    return res.status(200).json(locations);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error: Fetching all the set map locations", error });
  }
});

router.delete("/deleteLocation", async (req, res) => {
  try {
    const { mapUserName } = req.body;

    await prisma.map.updateMany({
      where: {
        mapUserName,
        status: "ACTIVE",
      },
      data: {
        status: "PAST",
      },
    });
    return res.status(200).json({ message: "Delete user location" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error: Deleting user location", error });
  }
});

module.exports = router;
