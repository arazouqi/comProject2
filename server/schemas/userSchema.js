const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    classes: Object,
})

const Users = mongoose.model("Users", user)

module.exports = Users