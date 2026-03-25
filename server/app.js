const express = require("express")
const cors = require("cors")
const session = require("express-session")
const path = require("path")

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const eventRoutes = require("./routes/events")

const connectDB = require("./config/database")

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

// attach route files
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/events", eventRoutes)

module.exports = app