const session = require("express-session")
const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()
const port = 3000

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
    { id: 1, username: "admin", role: "admin" },
    { id: 2, username: "teacher", role: "teacher" },
    { id: 3, username: "student", role: "student" }
]

let events = [
    { id: 1, title: "Math Lecture", date: "2026-03-25", teacher: "teacher" }
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
        user: user
    })
})

// Event routes

app.get("/api/events", (req, res) => {
    res.json(events)
})

app.post("/api/events", (req, res) => {
    const { title, date, teacher } = req.body

    if (!title || !date || !teacher) {
        return res.status(400).json({ error: "Title, date, and teacher are required" })
    }

    const newEvent = {
        id: events.length + 1,
        title,
        date,
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

    event.title = req.body.title || event.title
    event.date = req.body.date || event.date

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
    const { username, role } = req.body
    const allowedRoles = ["student", "teacher", "admin"]

    if (!username || !role) {
        return res.status(400).json({ error: "Username and role are required" })
    }

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" })
    }

    const usernameExists = users.some((u) => u.username === username)
    if (usernameExists) {
        return res.status(400).json({ error: "Username already exists" })
    }

    const newUser = {
        id: users.length + 1,
        username,
        role
    }

    users.push(newUser)
    res.json(newUser)
})

// NEW: Update user
app.put("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const { username, role } = req.body
    const allowedRoles = ["student", "teacher", "admin"]

    const user = users.find((u) => u.id === id)

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    if (!username || !role) {
        return res.status(400).json({ error: "Username and role are required" })
    }

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" })
    }

    const usernameTaken = users.some(
        (u) => u.username === username && u.id !== id
    )

    if (usernameTaken) {
        return res.status(400).json({ error: "Username already exists" })
    }

    user.username = username
    user.role = role

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