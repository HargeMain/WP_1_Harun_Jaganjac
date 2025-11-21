// 2025 © Harun Jaganjac

document.querySelectorAll(".card.page-link").forEach(card => {
    card.addEventListener("click", () => {
        const page = card.dataset.page;

        window.parent.postMessage({
            action: "loadPage",
            page: page
        }, "*");
    });
});

console.log("Welcome page script loaded.");