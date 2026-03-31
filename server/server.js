require("dotenv").config()

const app = require("./app")
const { startLowAttendanceJob } = require("./jobs/lowAttendanceJob")

const port = process.env.PORT || 5000

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`)
    startLowAttendanceJob()
})