const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// CREATE GROUP
router.post("/createGroup", async (req, res) => {
  try {
    const { groupName, groupInfo, groupImg, userName} = req.body;

    const newGroup = await prisma.groups.create({
      data: {
        groupName,
        groupInfo,
        groupImg,
        groupMembers: {
            connect: [{ userName: userName}]
        }

      },
    });
    return res.status(201).json({ message: "Study Group added to system", data: newGroup });
  } catch (error) {
    console.error("Error: Creating a new study group", error);
    return res.status(500).json({ error: "Error: Creating a new study group" });
  }
});


router.get("/groups", async (req, res) => {
    try {
        const groups = await prisma.groups.findMany({
            include: {
                groupMembers: true,
            },
        });

        res.status(200).json(groups);
    } catch (error) {
        console.error("Error: Fetching groups", error)
        res.status(500).json({message: "Error: Fetching groups"})
    }
})

module.exports = router;