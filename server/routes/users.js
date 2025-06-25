const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

// USERS(POST) -> CREATE A USER ACCOUNT 
router.post('/users/register', async (req, res) => {
    const { userName, userPwd } = req.body;
    try {
        const newUser = await prisma.users.create({
            data: {
                userName, 
                userPwd
            }
        })
        res.status(201).json(newUser)
    } catch (error) {
        console.error("Error: Creating a new user -> ", error)
        res.status(500).json({ error: "Error: Creating a new user." })
    }
});

// USERS(GET) -> GET A USER ACCOUNT FROM USER UNIQUE ID
router.get('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await prisma.users.findUnique({
        where: {
            userId: userId
        }
    });
    res.json(user);
    } catch (error) {
    console.error("Error: Fetching a unique user -> ", error)
    res.status(500).json({ error: "Error: Fetching a uniuque user." })
    }
});

module.exports = router