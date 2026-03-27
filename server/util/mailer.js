const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

async function sendLowAttendanceEmail(to, name, percentage) {
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: "Attendance Warning",
        text: `Hello ${name},

Your attendance is currently ${percentage}%, which is below 50%.

Please attend future sessions to improve your attendance.

Regards,
Seats 2 Attendance System`
    })
}

module.exports = {
    sendLowAttendanceEmail
}