const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    role: String,
    classGroup: String,
    attendance: [String],
    calendar: [String]
})

const Users = mongoose.model("Users", userSchema)

module.exports = Users