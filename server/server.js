const session = require("express-session")
const express = require("express")
const cors = require("cors")
const path = require("path")
const mongoose = require("mongoose")

const Users = require("./schemas/userSchema")
const Event = require("./schemas/eventSchema")

const app = express()
const port = 3000

const uri = "mongodb://server:cRJjbrmAXke5Og1u@ac-3bjmlva-shard-00-00.kfgtefg.mongodb.net:27017,ac-3bjmlva-shard-00-01.kfgtefg.mongodb.net:27017,ac-3bjmlva-shard-00-02.kfgtefg.mongodb.net:27017/?ssl=true&replicaSet=atlas-g0hk75-shard-0&authSource=admin&appName=Cluster0"

const allowedRoles = ["student", "teacher", "admin"]

const allowedClassGroups = [
    "computer-science-year-1",
    "computer-science-year-2",
    "computer-science-year-3",
    "mathematics-year-1",
    "mathematics-year-2",
    "mathematics-year-3",
    "psychology-year-1",
    "psychology-year-2",
    "psychology-year-3",
    "business-year-1",
    "business-year-2",
    "business-year-3",
    "music-studies-year-1",
    "music-studies-year-2",
    "music-studies-year-3"
]

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(path.join(__dirname, "../website/frontend")))

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true
}))

async function start() {
    try {
        await mongoose.connect(uri)
        console.log("Successfully connected to MongoDB.")
    } catch (err) {
        console.log(err)
    }
}

start().catch(console.dir)

function formatUser(user) {
    return {
        id: user._id.toString(),
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        password: user.password || "",
        role: user.role || "student",
        classGroup: user.classGroup || "none",
        attendance: user.attendance || [],
        calendar: user.calendar || []
    }
}

function formatEvent(event) {
    return {
        id: event._id.toString(),
        name: event.name || "",
        location: event.location || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        classGroup: event.classGroup || "",
        teacher: event.teacher || "",
        qrCode: event.qrCode || "",
        attendees: event.attendees || []
    }
}

// Website page routes

app.get("/admindashboard", (req, res) => {
    if ((!req.session.user) || (req.session.role !== "admin")) {
        return res.redirect("/signin.html")
    }

    res.sendFile(path.join(__dirname, "../website/frontend/admindashboard.html"))
})

app.get("/teacherdashboard", (req, res) => {
    if ((!req.session.user) || (req.session.role !== "teacher")) {
        return res.redirect("/signin.html")
    }

    res.sendFile(path.join(__dirname, "../website/frontend/teacherdashboard.html"))
})

app.get("/studentdashboard", (req, res) => {
    if ((!req.session.user) || (req.session.role !== "student")) {
        return res.redirect("/signin.html")
    }

    res.sendFile(path.join(__dirname, "../website/frontend/studentdashboard.html"))
})

// Login routes

// Website login (JSON now)
app.post("/login", async (req, res) => {
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
app.post("/api/login", async (req, res) => {
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

// test to see what users are currently in the MongoDB database
app.get("/api/debug-users", async (req, res) => {
    try {
        const users = await Users.find()
        res.json(users)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Could not fetch users" })
    }
})

// User API routes

app.get("/api/users", async (req, res) => {
    try {
        const users = await Users.find()
        res.json(users.map(formatUser))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error fetching users" })
    }
})

app.get("/api/users/:id", async (req, res) => {
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

app.post("/api/users", async (req, res) => {
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

app.put("/api/users/:id", async (req, res) => {
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
            { new: true }
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

app.delete("/api/users/:id", async (req, res) => {
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

// Event API routes

app.get("/api/events", async (req, res) => {
    try {
        const events = await Event.find()
        res.json(events.map(formatEvent))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error fetching events" })
    }
})

app.get("/api/events/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)

        if (!event) {
            return res.status(404).json({ error: "Event not found" })
        }

        res.json(formatEvent(event))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error fetching event" })
    }
})

app.post("/api/events", async (req, res) => {
    try {
        const { name, location, startTime, endTime, classGroup, teacher } = req.body

        if (!name || !location || !startTime || !endTime || !classGroup || !teacher) {
            return res.status(400).json({
                error: "Name, location, startTime, endTime, classGroup, and teacher are required"
            })
        }

        if (!allowedClassGroups.includes(classGroup)) {
            return res.status(400).json({ error: "Invalid class group" })
        }

        const event = await Event.create({
            name,
            location,
            startTime,
            endTime,
            classGroup,
            teacher,
            qrCode: "",
            attendees: []
        })

        res.status(201).json(formatEvent(event))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error creating event" })
    }
})

app.put("/api/events/:id", async (req, res) => {
    try {
        const { name, location, startTime, endTime, classGroup } = req.body

        if (!name || !location || !startTime || !endTime || !classGroup) {
            return res.status(400).json({
                error: "Name, location, startTime, endTime, and classGroup are required"
            })
        }

        if (!allowedClassGroups.includes(classGroup)) {
            return res.status(400).json({ error: "Invalid class group" })
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { name, location, startTime, endTime, classGroup },
            { new: true }
        )

        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" })
        }

        res.json(formatEvent(updatedEvent))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error updating event" })
    }
})

app.delete("/api/events/:id", async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id)

        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" })
        }

        res.json({ success: true })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error deleting event" })
    }
})

app.post("/api/events/:id/qr", async (req, res) => {
    try {
        const code = Math.floor(100000 + Math.random() * 900000).toString()

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { qrCode: code },
            { new: true }
        )

        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" })
        }

        res.json({ code })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error generating QR code" })
    }
})

app.post("/api/checkin", async (req, res) => {
    try {
        const { code, email } = req.body

        if (!code || !email) {
            return res.status(400).json({ error: "Code and email are required" })
        }

        const event = await Event.findOne({ qrCode: code })

        if (!event) {
            return res.status(404).json({ error: "Invalid QR code" })
        }

        if (!event.attendees.includes(email)) {
            event.attendees.push(email)
            await event.save()
        }

        res.json({ success: true, message: "Checked in successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error checking in" })
    }
})

app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on ${port}`)
})