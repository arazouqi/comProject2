const session = require("express-session")
const express = require("express")
const cors = require("cors")
const path = require("path")
const mongoose = require("mongoose")

const Users = require('./schemas/userSchema')
const Event=require("./schemas/eventSchema")

const app = express()
const port = 3000
const uri = "mongodb+srv://server:cRJjbrmAXke5Og1u@cluster0.kfgtefg.mongodb.net/?appName=Cluster0"

async function start() {
    try {
        mongoose.connect(uri)
        
        console.log("Successfully connected to MongoDB.")
    } catch (err) {
        console.log(err)
    }
}

start().catch(console.dir)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(path.join(__dirname, "../website/frontend")))

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true
}))

app.post('/createuser', async (req, res) => {
    const { name, email, password, role } = req.body

    try {
        await Users.create({
            name,
            email,
            password,
            role,
            classes: {}
        })
    } catch (err) {
        console.log(err)
    }
})

app.post('/login', (req, res) => {
    const { email, password } = req.body

    if (email == "admin") {
        req.session.user = email;
        req.session.role = "admin";

        res.redirect("/admindashboard")
    } else if (email == "teacher") {
        req.session.user = email;
        req.session.role = "teacher";

        res.redirect("/teacherdashboard")
    } else if (email == "student") {
        req.session.user = email;
        req.session.role = "student";

        res.redirect("/studentdashboard")
    } else {
        res.send("Invalid login")
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
    const { email, name, role } = req.body

    try {
        await Users.findOneAndUpdate(
            { email },
            { name, role }
        )
    } catch (err) {
        console.log(err)
    }
})

app.get("/getuser/:email", async (req, res) => {
    const { email } = req.params

    try {
        const user = await Users.findOne({ email })

        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).send("Error")
    }
})

app.get("/users", async (req, res) => {
    try {
        const users = await Users.find().select("name email role")
        res.json(users)
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

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})