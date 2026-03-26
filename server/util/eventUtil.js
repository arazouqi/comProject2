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

function checkCollisions(events, newEvent) {
    for (e in events) {
        if (e.location == newEvent.location) {
            return ((e.startTime > newEvent.startTime && e.startTime < newEvent.endTime) ||
                    (newEvent.startTime > e.startTime && newEvent.startTime < e.endTime))
        }
    }

    return false
}

module.exports = { formatEvent, checkCollisions }