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
    for (const e of events) {
        if (e.location === newEvent.location && e.id !== newEvent.id) {
            const overlap =
                (e.startTime < newEvent.endTime && e.endTime > newEvent.startTime)
            if (overlap) return true
        }
    }

    return false
}

module.exports = { formatEvent, checkCollisions }