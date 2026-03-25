const express = require("express")
const router = express.Router()

const Users = require('../schemas/userSchema')
const formatUser = require('../util/formatUser')
const { allowedClassGroups, allowedRoles } = require("../util/constants")

router.get("/", async (req, res) => {
    try {
        const users = await Users.find()
        res.json(users.map(formatUser))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error fetching users" })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json(formatUser(user))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error fetching user" })
    }
})

router.post("/", async (req, res) => {
    try {
        const { username, name, email, password, role, classGroup } = req.body

        if (!username || !name || !email || !password || !role || !classGroup) {
            return res.status(400).json({
                error: "Username, name, email, password, role, and classGroup are required"
            })
        }

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ error: "Invalid role" })
        }

        if (classGroup !== "none" && !allowedClassGroups.includes(classGroup)) {
            return res.status(400).json({ error: "Invalid class group" })
        }

        const existingUsername = await Users.findOne({ username })
        if (existingUsername) {
            return res.status(400).json({ error: "Username already exists" })
        }

        const existingEmail = await Users.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" })
        }

        const user = await Users.create({
            username,
            name,
            email,
            password,
            role,
            classGroup,
            attendance: [],
            calendar: []
        })

        res.status(201).json(formatUser(user))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error creating user" })
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { username, name, email, password, role, classGroup } = req.body

        if (!username || !name || !email || !password || !role || !classGroup) {
            return res.status(400).json({
                error: "Username, name, email, password, role, and classGroup are required"
            })
        }

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ error: "Invalid role" })
        }

        if (classGroup !== "none" && !allowedClassGroups.includes(classGroup)) {
            return res.status(400).json({ error: "Invalid class group" })
        }

        const existingUsername = await Users.findOne({ username })
        if (existingUsername && existingUsername._id.toString() !== req.params.id) {
            return res.status(400).json({ error: "Username already exists" })
        }

        const existingEmail = await Users.findOne({ email })
        if (existingEmail && existingEmail._id.toString() !== req.params.id) {
            return res.status(400).json({ error: "Email already exists" })
        }

        const updatedUser = await Users.findByIdAndUpdate(
            req.params.id,
            { username, name, email, password, role, classGroup },
            { returnDocument: "after" }
        )

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json(formatUser(updatedUser))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error updating user" })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await Users.findByIdAndDelete(req.params.id)

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json({ success: true })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error deleting user" })
    }
})

module.exports = router