const session = require("express-session")
const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()
const port = 3000

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

// Mock data (temporary)

let users = [
    {
        id: 1,
        username: "admin",
        name: "Admin User",
        email: "admin@gold.ac.uk",
        password: "admin123",
        role: "admin",
        classGroup: "none",
        attendance: [],
        calendar: []
    },
    {
        id: 2,
        username: "teacher",
        name: "Teacher User",
        email: "teacher@gold.ac.uk",
        password: "teacher123",
        role: "teacher",
        classGroup: "computer-science-year-1",
        attendance: [],
        calendar: []
    },
    {
        id: 3,
        username: "student",
        name: "Student User",
        email: "student@gold.ac.uk",
        password: "student123",
        role: "student",
        classGroup: "computer-science-year-1",
        attendance: [],
        calendar: []
    }
]

let events = [
    {
        id: 1,
        name: "Math Lecture",
        location: "Room B201",
        startTime: "2026-03-25 10:00",
        endTime: "2026-03-25 12:00",
        classGroup: "computer-science-year-1",
        teacher: "teacher"
    }
]

// Login (modified for mobile)

app.post("/api/login", (req, res) => {
    const { username } = req.body

    const user = users.find((u) => u.username === username)

    if (!user) {
        return res.status(401).json({ error: "Invalid login" })
    }

    res.json({
        success: true,
        user
    })
})

// Event routes

app.get("/api/events", (req, res) => {
    res.json(events)
})

app.post("/api/events", (req, res) => {
    const { name, location, startTime, endTime, classGroup, teacher } = req.body

    if (!name || !location || !startTime || !endTime || !classGroup || !teacher) {
        return res.status(400).json({
            error: "Name, location, startTime, endTime, classGroup, and teacher are required"
        })
    }

    if (!allowedClassGroups.includes(classGroup)) {
        return res.status(400).json({ error: "Invalid class group" })
    }

    const newEvent = {
        id: events.length + 1,
        name,
        location,
        startTime,
        endTime,
        classGroup,
        teacher
    }

    events.push(newEvent)
    res.json(newEvent)
})

app.put("/api/events/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const event = events.find((e) => e.id === id)

    if (!event) {
        return res.status(404).json({ error: "Event not found" })
    }

    const { name, location, startTime, endTime, classGroup } = req.body

    if (!name || !location || !startTime || !endTime || !classGroup) {
        return res.status(400).json({
            error: "Name, location, startTime, endTime, and classGroup are required"
        })
    }

    if (!allowedClassGroups.includes(classGroup)) {
        return res.status(400).json({ error: "Invalid class group" })
    }

    event.name = name
    event.location = location
    event.startTime = startTime
    event.endTime = endTime
    event.classGroup = classGroup

    res.json(event)
})

app.delete("/api/events/:id", (req, res) => {
    const id = parseInt(req.params.id)
    events = events.filter((e) => e.id !== id)

    res.json({ success: true })
})

// User routes (ADMIN)

app.get("/api/users", (req, res) => {
    res.json(users)
})

app.post("/api/users", (req, res) => {
    const { username, name, email, password, role, classGroup } = req.body
    const allowedRoles = ["student", "teacher", "admin"]

    if (!username || !name || !email || !password || !role || !classGroup) {
        return res.status(400).json({
            error: "Username, name, email, password, role, and classGroup are required"
        })
    }

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" })
    }

    if (!allowedClassGroups.includes(classGroup) && classGroup !== "none") {
        return res.status(400).json({ error: "Invalid class group" })
    }

    const usernameExists = users.some((u) => u.username === username)
    if (usernameExists) {
        return res.status(400).json({ error: "Username already exists" })
    }

    const emailExists = users.some((u) => u.email === email)
    if (emailExists) {
        return res.status(400).json({ error: "Email already exists" })
    }

    const newUser = {
        id: users.length + 1,
        username,
        name,
        email,
        password,
        role,
        classGroup,
        attendance: [],
        calendar: []
    }

    users.push(newUser)
    res.json(newUser)
})

app.put("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const { username, name, email, password, role, classGroup } = req.body
    const allowedRoles = ["student", "teacher", "admin"]

    const user = users.find((u) => u.id === id)

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    if (!username || !name || !email || !password || !role || !classGroup) {
        return res.status(400).json({
            error: "Username, name, email, password, role, and classGroup are required"
        })
    }

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" })
    }

    if (!allowedClassGroups.includes(classGroup) && classGroup !== "none") {
        return res.status(400).json({ error: "Invalid class group" })
    }

    const usernameTaken = users.some((u) => u.username === username && u.id !== id)
    if (usernameTaken) {
        return res.status(400).json({ error: "Username already exists" })
    }

    const emailTaken = users.some((u) => u.email === email && u.id !== id)
    if (emailTaken) {
        return res.status(400).json({ error: "Email already exists" })
    }

    user.username = username
    user.name = name
    user.email = email
    user.password = password
    user.role = role
    user.classGroup = classGroup

    res.json(user)
})

app.delete("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const userExists = users.some((u) => u.id === id)

    if (!userExists) {
        return res.status(404).json({ error: "User not found" })
    }

    users = users.filter((u) => u.id !== id)
    res.json({ success: true })
})

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}`)
})