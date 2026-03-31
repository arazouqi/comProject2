const express = require("express")
const cors = require("cors")
const session = require("express-session")
const path = require("path")

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const eventRoutes = require("./routes/events")

const connectDB = require("./util/database")

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.status(401).json({ error: "Not authenticated" })
        }
        if (roles.length && !roles.includes(req.session.role)) {
            return res.status(403).json({ error: "Forbidden" })
        }
        next()
    }
}

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(path.join(__dirname, "../website/frontend")))

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true
}))

// default page
app.get("/", (req, res) => {
    res.redirect("/signin.html")
})

// static redirects
app.get("/admindashboard", (req, res) => {
    if (!req.session.user || req.session.role !== "admin") {
        return res.redirect("/signin.html")
    }

    res.sendFile(path.join(__dirname, "../website/frontend/admindashboard.html"))
})

app.get("/teacherdashboard", (req, res) => {
    if (!req.session.user || req.session.role !== "teacher") {
        return res.redirect("/signin.html")
    }

    res.sendFile(path.join(__dirname, "../website/frontend/teacherdashboard.html"))
})

app.get("/studentdashboard", (req, res) => {
    if (!req.session.user || req.session.role !== "student") {
        return res.redirect("/signin.html")
    }

    res.sendFile(path.join(__dirname, "../website/frontend/studentdashboard.html"))
})

// logout
app.post("/api/auth/logout", (req, res) => {
    req.session.destroy()
    res.json({ success: true })
})

// attach route files
app.use("/api/auth", authRoutes)
app.use("/api/users", requireRole("admin"), userRoutes)
app.use("/api/events", eventRoutes)

module.exports = app