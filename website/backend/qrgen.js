const qrButton = document.getElementById("qrButton")
const qrCode = document.getElementById("qrCode")

function generateRandomNumber() {
    return number = Math.floor(Math.random() * 1000000)
}

qrButton.addEventListener("click", (event) => {
    let number = generateRandomNumber()

    qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${number}`
})