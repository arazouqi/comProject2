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

app.post('/login', (req, res) => {
    const { username, password } = req.body

    if (username == "admin") {
        req.session.user = username;
        req.session.role = "admin";

        res.redirect("/admindashboard")
    } else if (username == "teacher") {
        req.session.user = username;
        req.session.role = "teacher";

        res.redirect("/teacherdashboard")
    } else if (username == "student") {
        req.session.user = username;
        req.session.role = "student";

        res.redirect("/studentdashboard")
    } else {
        res.send("Invalid login")
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

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})