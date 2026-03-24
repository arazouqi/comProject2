const mongoose=require("mongoose")

const eventSchema=new mongoose.Schema({
    name:String,
    location:String,
    startTime:Date,
    endTime:Date,
    classGroup:String,
    qrCode:String,
    attendees:[String]
})

module.exports=mongoose.model("Event", eventSchema)