const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    name: String,
    location: String,
    startTime: String,
    endTime: String,
    classGroup: String,
    teacher: String,
    qrCode: String,
    attendees: [String]
})

module.exports = mongoose.model("Event", eventSchema)