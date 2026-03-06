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
    console.log(req.body)
    const { username, password } = req.body

    if (username == "admin") {
        req.session.user = username;
        res.redirect("/dashboard")
    } else {
        res.send("Invalid login")
    }
})

app.get("/dashboard", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login.html")
    }

    res.sendFile(path.join(__dirname, "../website/frontend/dashboard.html"))
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})