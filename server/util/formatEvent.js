function formatEvent(event) {
    return {
        id: event._id.toString(),
        name: event.name || "",
        location: event.location || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        classGroup: event.classGroup || "",
        teacher: event.teacher || "",
        qrCode: event.qrCode || "",
        attendees: event.attendees || []
    }
}

module.exports = formatEvent