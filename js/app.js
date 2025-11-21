// 2025 © Harun Jaganjac

const frame = document.getElementById("mainFrame");
const errorPanel = document.getElementById("errorPanel");


window.addEventListener("message", e => {
    if (e.data.action === "loadPage") {
        const page = e.data.page;
        loadPage(`pages/${page}.html`);
        setActiveNav(null, page);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        loadPage("pages/welcome.html");
        setActiveNav("home");
    }, 50);
});

document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
        const page = item.dataset.page;
        if (!page) return;

        if (page === "welcome") {
            loadPage("pages/welcome.html");
            setActiveNav("home");
        }

        if (page === "contact") {
            loadPage("pages/contact.html");
            setActiveNav("contact");
        }

        if (page === "documentation") {
            loadPage("pages/documentation.html");
            setActiveNav("documentation");
        }

    });
});

document.querySelectorAll(".page-link").forEach(link => {
    link.addEventListener("click", () => {
        const page = link.dataset.page;
        loadPage(`pages/${page}.html`);
        setActiveNav(null, page);
    });
});

function setActiveNav(main = null, sub = null) {
    document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));

    if (main === "home") {
        document.getElementById("nav-home")?.classList.add("active");
    }

    if (main === "contact") {
        document.getElementById("nav-contact")?.classList.add("active");
    }

    if (sub) {
        document.querySelector(".dropdown-btn").classList.add("active");
    }
}

function loadPage(url) {
    errorPanel.classList.add("hidden");
    frame.classList.remove("hidden");
    frame.src = url;

    setTimeout(validateFrame, 200);
}

function updateClock() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    document.getElementById("clock").textContent = `${hours}:${minutes}:${seconds}`;

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const yearFull = now.getFullYear();
    document.getElementById("date").textContent = `${day}.${month}.${yearFull}.`;


    document.getElementById("year").textContent = yearFull;
}

function validateFrame() {
    let doc;

    try {
        doc = frame.contentDocument || frame.contentWindow.document;
    } catch {
        return showError();
    }

    if (!doc || !doc.body) return showError();

    const html = doc.body.innerHTML.trim();

    if (html.length < 5 || html.includes("Cannot GET") || html.includes("404")) {
        showError();
    }
}

function showError() {
    frame.classList.add("hidden");
    errorPanel.classList.remove("hidden");
}
setInterval(updateClock, 1000);
updateClock();
