const form = document.getElementById("signInForm")

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    if (username.toLowerCase() == "admin" && password.toLowerCase() == "admin") {
        window.location.href = "qrgen.html"
    }
})