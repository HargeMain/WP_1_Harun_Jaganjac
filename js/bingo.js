const notify = document.getElementById("notify");

function alertMsg(msg) {
    notify.textContent = msg;
    notify.classList.add("show");
    setTimeout(() => notify.classList.remove("show"), 1800);
}


const cells = document.querySelectorAll(".cell");

cells.forEach(cell => {
    let state = 0; 

    cell.addEventListener("click", () => {
        const existing = cell.querySelector(".mark");
        if (existing) existing.remove();

        state = (state + 1) % 3;

        cell.classList.remove("checked", "crossed");

        if (state === 1) {
            cell.classList.add("checked");
            const m = document.createElement("div");
            m.className = "mark";
            m.textContent = "✔";
            cell.appendChild(m);

        } else if (state === 2) {
            cell.classList.add("crossed");
            const m = document.createElement("div");
            m.className = "mark";
            m.textContent = "✖";
            cell.appendChild(m);
        }
    });
});


document.getElementById("exportPDF").onclick = async () => {
    const element = document.getElementById("contentToConvert");

    const opt = {
        margin: 5,
        filename: "bingo.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(opt).from(element).save();

    alertMsg("PDF spremljen.");
};


const emailModal = document.getElementById("emailModal");

document.getElementById("sendMail").onclick = () =>
    emailModal.classList.remove("hidden");

document.getElementById("emailCancel").onclick = () =>
    emailModal.classList.add("hidden");


document.getElementById("emailSend").onclick = async () => {
    const email = document.getElementById("emailField").value.trim();
    if (!email) return alertMsg("Unesite email.");

    const canvas = await html2canvas(document.getElementById("contentToConvert"));
    const img = canvas.toDataURL("image/png");

    const body = encodeURIComponent("Bingo board:\n\n" + img);
    window.location.href = `mailto:${email}?subject=Bingo&body=${body}`;

    emailModal.classList.add("hidden");
    alertMsg("Otvaram mail klijent...");
};
