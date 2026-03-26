function formatUser(user) {
    return {
        id: user._id.toString(),
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        password: user.password || "",
        role: user.role || "student",
        classGroup: user.classGroup || "none",
        attendance: user.attendance || [],
        calendar: user.calendar || []
    }
}

module.exports = { formatUser }