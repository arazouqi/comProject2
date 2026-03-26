const cron = require("node-cron")
const Users = require("../schemas/userSchema")
const Event = require("../schemas/eventSchema")
const { sendLowAttendanceEmail } = require("../util/mailer")

function hasAttended(event, email) {
    return Array.isArray(event.attendees) && event.attendees.includes(email)
}

function shouldCountEvent(event, email, now) {
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)

    const isPast = end < now
    const isOngoing = start <= now && end >= now
    const attended = hasAttended(event, email)

    return isPast || (isOngoing && attended)
}

async function processLowAttendanceWarnings() {
    const now = new Date()

    const students = await Users.find({ role: "student" })

    for (const student of students) {
        if (!student.email || !student.classGroup) continue

        const events = await Event.find({ classGroup: student.classGroup })

        const relevantEvents = events.filter((event) =>
            shouldCountEvent(event, student.email, now)
        )

        const total = relevantEvents.length
        if (total === 0) continue

        const attended = relevantEvents.filter((event) =>
            hasAttended(event, student.email)
        ).length

        const percentage = Math.round((attended / total) * 100)

        if (percentage < 50) {
            await sendLowAttendanceEmail(
                student.email,
                student.username || student.name || "Student",
                percentage
            )

            console.log(
                `Low attendance email sent to ${student.email} (${percentage}%)`
            )
        }
    }
}

function startLowAttendanceJob() {
    cron.schedule("0 9 * * 1", async () => {
        try {
            console.log("Running weekly low attendance check...")
            await processLowAttendanceWarnings()
        } catch (err) {
            console.error("Low attendance job failed:", err)
        }
    })
}

module.exports = {
    startLowAttendanceJob,
    processLowAttendanceWarnings
}