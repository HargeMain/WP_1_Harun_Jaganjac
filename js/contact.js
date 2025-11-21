// 2025 © Harun Jaganjac

const sendBtn = document.getElementById("sendBtn");
const notify = document.getElementById("notify");

sendBtn.onclick = validateForm;

function validateForm() {
    let valid = true;

    const name = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const message = document.getElementById("message");

    clearErrors();

    if (name.value.trim() === "") {
        showError(name, "Unesite ime i prezime.");
        valid = false;
    }

    if (!validateEmail(email.value.trim())) {
        showError(email, "Unesite ispravnu email adresu.");
        valid = false;
    }

    if (phone.value.trim() === "") {
        showError(phone, "Unesite broj telefona.");
        valid = false;
    }

    if (message.value.trim() === "") {
        showError(message, "Poruka ne može biti prazna.");
        valid = false;
    }

    if (!valid) return;

    const mailBody = encodeURIComponent(
        `Ime i prezime: ${name.value}\n` +
        `Email: ${email.value}\n` +
        `Telefon: ${phone.value}\n\n` +
        `Poruka:\n${message.value}`
    );

    window.location.href =
        `mailto:${email.value}?subject=Kontakt sa web forme&body=${mailBody}`;

    showNotify("Poruka uspješno poslana!");
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showError(input, msg) {
    input.classList.add("error");

    const small = document.createElement("div");
    small.className = "error-text";
    small.textContent = msg;

    input.parentElement.appendChild(small);
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(e => e.classList.remove("error"));
    document.querySelectorAll(".error-text").forEach(e => e.remove());
}

function showNotify(msg) {
    notify.textContent = msg;
    notify.classList.add("show");

    setTimeout(() => notify.classList.remove("show"), 2000);
}