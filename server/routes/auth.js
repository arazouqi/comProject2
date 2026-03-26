const express = require("express")
const router = express.Router()

const Users = require("../schemas/userSchema")
const { formatUser } = require("../util/userUtil")

// Website login (JSON now)
router.post("/login", async (req, res) => {
    const { login, email, password } = req.body
    const loginValue = login || email

    try {
        if (!loginValue || !password) {
            return res.status(400).json({ error: "Login and password are required" })
        }

        const user =
            await Users.findOne({ username: loginValue, password }) ||
            await Users.findOne({ email: loginValue, password })

        if (!user) {
            return res.status(401).json({ error: "Invalid login details" })
        }

        req.session.user = user.email
        req.session.role = user.role
        req.session.classgroup = user.classGroup
        
        res.json({
            success: true,
            user: formatUser(user)
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Login failed" })
    }
})

// Mobile login
router.post("/mobile", async (req, res) => {
    const { login, password } = req.body
    console.log("Login body:", req.body)

    try {
        if (!login || !password) {
            return res.status(400).json({ error: "Login and password are required" })
        }

        const user =
            await Users.findOne({ username: login, password }) ||
            await Users.findOne({ email: login, password })

        console.log("Found user:", user)

        if (!user) {
            return res.status(401).json({ error: "Invalid login details" })
        }

        res.json({
            success: true,
            user: formatUser(user)
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Login failed" })
    }
})

router.get("/getloggedin", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "User not logged in" })
    }

    res.json({
        success: true,
        email: req.session.user,
        classgroup: req.session.classgroup
    })
})

module.exports = router