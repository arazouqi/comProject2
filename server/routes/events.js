const express = require("express")
const router = express.Router()

const Event = require("../schemas/eventSchema")
const { formatEvent, checkCollisions } = require("../util/eventUtil")
const { allowedClassGroups } = require("../util/constants")

router.get("/", async (req, res) => {
    try {
        const events = await Event.find()
        res.json(events.map(formatEvent))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error fetching events" })
    }
})

router.get("/:id", async (req, res) => {
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

router.post("/", async (req, res) => {
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

        const events = await (await Event.find()).map(formatEvent)

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

        if (checkCollisions(events, event)) {
            res.status(400).json({ error: "There is already an event at this location and time" })
        }

        res.status(201).json(formatEvent(event))
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error creating event" })
    }
})

router.put("/:id", async (req, res) => {
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
            { returnDocument: "after" }
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

router.delete("/:id", async (req, res) => {
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

router.post("/:id/qr", async (req, res) => {
    try {
        const code = Math.floor(100000 + Math.random() * 900000).toString()

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { qrCode: code },
            { returnDocument: "after" }
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

router.post("/checkin", async (req, res) => {
    try {
        const { code, email } = req.body

        if (!code || !email) {
            return res.status(400).json({ error: "Code and email are required" })
        }

        const event = await Event.findOne({ qrCode: code })

        if (!event) {
            return res.status(404).json({ error: "Invalid QR code" })
        }

        if (event.attendees.includes(email)) {
            return res.status(400).json({
                error: "You have already checked in to this event"
            })
        }

        event.attendees.push(email)
        await event.save()

        res.json({ success: true, message: "Checked in successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error checking in" })
    }
})

module.exports = router