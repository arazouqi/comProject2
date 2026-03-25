const session = require("express-session")
const express = require("express")
const cors = require("cors")
const path = require("path")
const mongoose = require("mongoose")

const Users = require("./schemas/userSchema")
const Event = require("./schemas/eventSchema")

const app = express()
const port = 3000
const uri = "mongodb+srv://server:cRJjbrmAXke5Og1u@cluster0.kfgtefg.mongodb.net/?appName=Cluster0"

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

function normalizeClassGroup(value) {
    return value || "none"
}

function buildUsername({ username, email, name }) {
    if (username && username.trim()) return username.trim()
    if (email && email.includes("@")) return email.split("@")[0]
    if (name && name.trim()) return name.trim().toLowerCase().replace(/\s+/g, "-")
    return ""
}

function formatUser(user) {
    return {
        id: user._id?.toString() || user.id?.toString() || "",
        username: user.username || buildUsername(user),
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
        id: event._id?.toString() || event.id?.toString() || "",
        name: event.name || "",
        location: event.location || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        classGroup: event.classGroup || "",
        teacher: event.teacher || "",
        qrCode: event.qrCode || null,
        attendees: event.attendees || []
    }
}


// Website routes
app.post("/createuser", async (req, res) => {
    const { name, email, password, role, classGroup } = req.body
    const username = buildUsername({ email, name })

    try {
        if (!name || !email || !password || !role) {
            return res.redirect("/createuserpage.html?message=Missing required fields&status=error")
        }

        if (!allowedRoles.includes(role)) {
            return res.redirect("/createuserpage.html?message=Invalid role&status=error")
        }

        const normalizedClassGroup = normalizeClassGroup(classGroup)

        if (normalizedClassGroup !== "none" && !allowedClassGroups.includes(normalizedClassGroup)) {
            return res.redirect("/createuserpage.html?message=Invalid class group&status=error")
        }

        const emailExists = await Users.findOne({ email })
        if (emailExists) {
            return res.redirect("/createuserpage.html?message=Email already exists&status=error")
        }

        const usernameExists = await Users.findOne({ username })
        if (usernameExists) {
            return res.redirect("/createuserpage.html?message=Username already exists&status=error")
        }

        await Users.create({
            username,
            name,
            email,
            password,
            role,
            classGroup: normalizedClassGroup,
            attendance: [],
            calendar: []
        })
    } catch (err) {
        console.log(err)
    }
})

app.post("/deleteuser/:email", async (req, res) => {
    const { email } = req.params

    try {
        await Users.findOneAndDelete({ email })
    } catch (err) {
        console.log(err)
    }
})

app.post("/createevent", async (req,res) => {
    const event=await Event.create(req.body)
    res.json(event)
})

app.get("/events", async (req,res) => {
    const events=await Event.find()
    res.json(events)
})

app.get("/getevent/:id", async (req, res) => {
    const id = req.params.id

    const event = await Event.find({ id })

    res.json(event)
})

app.patch("/events/:id", async (req,res) => {
    await Event.findByIdAndUpdate(req.params.id,req.body)
    res.send("updated")
})

app.delete("/events/:id", async (req,res) => {
    await Event.findByIdAndDelete(req.params.id)
    res.send("deleted")
})

app.post("/events/:id/qr", async (req,res) => {
    const code=Math.floor(100000+Math.random()*900000)
    await Event.findByIdAndUpdate(req.params.id,{qrCode:code})
    res.json({code})
})

app.post("/checkin", async (req,res) => {
    const {code,email}=req.body
    const event=await Event.findOne({qrCode:code})

    if(!event) return res.send("Invalid code")

    event.attendees.push(email)
    await event.save()
    res.send("Checked in")
})

app.post("/updateuser", async (req, res) => {
    const { email } = req.query
    const { name, role, classGroup } = req.body

    try {
        await Users.findOneAndUpdate(
            { email },
            { name, role }
        )
    } catch (err) {
        console.log(err)
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        let user = await Users.findOne({ email, password })

        if (!user && (email === "admin" || email === "teacher" || email === "student")) {
            req.session.user = email
            req.session.role = email
            if (email === "admin") return res.redirect("/admindashboard")
            if (email === "teacher") return res.redirect("/teacherdashboard")
            return res.redirect("/studentdashboard")
        }

        if (!user) {
            return res.send("Invalid login")
        }

        req.session.user = user.email
        req.session.role = user.role

        if (user.role === "admin") return res.redirect("/admindashboard")
        if (user.role === "teacher") return res.redirect("/teacherdashboard")
        if (user.role === "student") return res.redirect("/studentdashboard")

        res.send("Invalid login")
    } catch (err) {
        console.log(err)
        res.send("Error logging in")
    }
})

app.get("/getuser/:email", async (req, res) => {
    const { email } = req.params

    try {
        const user = await Users.findOne({ email })
        if (!user) return res.status(404).send("User not found")
        res.json(formatUser(user))
    } catch (err) {
        console.log(err)
        res.status(500).send("Error")
    }
})

app.get("/users", async (req, res) => {
    try {
        const users = await Users.find()
        res.json(users.map(formatUser))
    } catch (err) {
        console.log(err)
        res.status(500).send("Error fetching users")
    }
})

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


// Website + generic event routes


app.post("/events", async (req, res) => {
    try {
        const { name, location, startTime, endTime, classGroup, teacher } = req.body

        if (!name || !location || !startTime || !endTime || !classGroup || !teacher) {
            return res.status(400).json({ error: "Missing required event fields" })
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
            attendees: [],
            qrCode: null
        })

        res.json(formatEvent(event))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error creating event" })
    }
})

app.get("/events", async (req, res) => {
    try {
        const events = await Event.find()
        res.json(events.map(formatEvent))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error fetching events" })
    }
})

app.patch("/events/:id", async (req, res) => {
    try {
        if (req.body.classGroup && !allowedClassGroups.includes(req.body.classGroup)) {
            return res.status(400).json({ error: "Invalid class group" })
        }

        const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updated) return res.status(404).json({ error: "Event not found" })

        res.json(formatEvent(updated))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error updating event" })
    }
})

app.delete("/events/:id", async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id)
        res.send("deleted")
    } catch (err) {
        console.log(err)
        res.status(500).send("Error deleting event")
    }
})

app.post("/events/:id/qr", async (req, res) => {
    try {
        const code = Math.floor(100000 + Math.random() * 900000)
        await Event.findByIdAndUpdate(req.params.id, { qrCode: code })
        res.json({ code })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error generating QR" })
    }
})

app.post("/checkin", async (req, res) => {
    const { code, email } = req.body

    try {
        const event = await Event.findOne({ qrCode: code })

        if (!event) return res.status(400).send("Invalid code")

        if (!Array.isArray(event.attendees)) {
            event.attendees = []
        }

        if (!event.attendees.includes(email)) {
            event.attendees.push(email)
        }

        await event.save()
        res.send("Checked in")
    } catch (err) {
        console.log(err)
        res.status(500).send("Error checking in")
    }
})


// Mobile API routes


app.post("/api/login", async (req, res) => {
    const { username } = req.body

    try {
        let user =
            await Users.findOne({ username }) ||
            await Users.findOne({ email: username })

        if (!user && (username === "admin" || username === "teacher" || username === "student")) {
            user = await Users.findOne({ username })
        }

        if (!user) {
            return res.status(401).json({ error: "Invalid login" })
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

app.get("/api/events", async (req, res) => {
    try {
        const events = await Event.find()
        res.json(events.map(formatEvent))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error fetching events" })
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
            attendees: [],
            qrCode: null
        })

        res.json(formatEvent(event))
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

        const updated = await Event.findByIdAndUpdate(
            req.params.id,
            { name, location, startTime, endTime, classGroup },
            { new: true }
        )

        if (!updated) {
            return res.status(404).json({ error: "Event not found" })
        }

        res.json(formatEvent(updated))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error updating event" })
    }
})

app.delete("/api/events/:id", async (req, res) => {
    try {
        const deleted = await Event.findByIdAndDelete(req.params.id)

        if (!deleted) {
            return res.status(404).json({ error: "Event not found" })
        }

        res.json({ success: true })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error deleting event" })
    }
})

app.get("/api/users", async (req, res) => {
    try {
        const users = await Users.find()
        res.json(users.map(formatUser))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error fetching users" })
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

        if (!allowedClassGroups.includes(classGroup) && classGroup !== "none") {
            return res.status(400).json({ error: "Invalid class group" })
        }

        const usernameExists = await Users.findOne({ username })
        if (usernameExists) {
            return res.status(400).json({ error: "Username already exists" })
        }

        const emailExists = await Users.findOne({ email })
        if (emailExists) {
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

        res.json(formatUser(user))
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

        if (!allowedClassGroups.includes(classGroup) && classGroup !== "none") {
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

        const updated = await Users.findByIdAndUpdate(
            req.params.id,
            { username, name, email, password, role, classGroup },
            { new: true }
        )

        if (!updated) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json(formatUser(updated))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error updating user" })
    }
})

app.delete("/api/users/:id", async (req, res) => {
    try {
        const deleted = await Users.findByIdAndDelete(req.params.id)

        if (!deleted) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json({ success: true })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error deleting user" })
    }
})

app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on ${port}`)
})