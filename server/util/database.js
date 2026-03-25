const mongoose = require("mongoose")

const uri = "mongodb://server:cRJjbrmAXke5Og1u@ac-3bjmlva-shard-00-00.kfgtefg.mongodb.net:27017,ac-3bjmlva-shard-00-01.kfgtefg.mongodb.net:27017,ac-3bjmlva-shard-00-02.kfgtefg.mongodb.net:27017/?ssl=true&replicaSet=atlas-g0hk75-shard-0&authSource=admin&appName=Cluster0"

async function connectDB() {
    try {
        await mongoose.connect(uri)
        console.log("Successfully connected to MongoDB.")
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB