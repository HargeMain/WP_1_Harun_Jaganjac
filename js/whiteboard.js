// 2025 © Harun Jaganjac

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 80;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let drawing = false;
let tool = "pencil"; 
let color = "#0b428c";
let lineWidth = 4;

const btnPencil = document.getElementById("btnPencil");
const btnEraser = document.getElementById("btnEraser");

function activateTool(t) {
    tool = t;
    btnPencil.classList.remove("active");
    btnEraser.classList.remove("active");

    if (t === "pencil") btnPencil.classList.add("active");
    if (t === "eraser") btnEraser.classList.add("active");
}

btnPencil.onclick = () => activateTool("pencil");
btnEraser.onclick = () => activateTool("eraser");

document.getElementById("colorPicker").onchange = e => {
    color = e.target.value;
    activateTool("pencil");
};

document.getElementById("lineWidth").oninput = e => {
    lineWidth = e.target.value;
};

canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY - 80);
});

canvas.addEventListener("mouseup", () => drawing = false);

canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";

    if (tool === "eraser") {
        ctx.strokeStyle = "white";
    } else {
        ctx.strokeStyle = color;
    }

    ctx.lineTo(e.clientX, e.clientY - 80);
    ctx.stroke();
});

document.getElementById("btnClear").onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

document.getElementById("btnPNG").onclick = () => {
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "whiteboard.png";
    a.click();
};

document.getElementById("btnPDF").onclick = async () => {
    const snapshot = await html2canvas(canvas);
    const img = snapshot.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
    pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("whiteboard.pdf");
};

document.getElementById("btnPrint").onclick = () => {
    const url = canvas.toDataURL();

    const win = window.open("", "_blank");
    win.document.write(`<img src="${url}" style="width:100%;height:auto;">`);
    win.print();
};

const modal = document.getElementById("emailModal");
const confirmModal = document.getElementById("confirmModal");
const emailInput = document.getElementById("emailInput");

document.getElementById("btnMail").onclick = () => modal.classList.remove("hidden");
document.getElementById("cancelMail").onclick = () => modal.classList.add("hidden");

document.getElementById("sendMail").onclick = () => {
    if (!emailInput.value.trim()) return alert("Unesite email.");
    modal.classList.add("hidden");
    confirmModal.classList.remove("hidden");
};

document.getElementById("cancelConfirm").onclick = () => {
    confirmModal.classList.add("hidden");
};

document.getElementById("confirmSend").onclick = () => {
    const email = emailInput.value.trim();
    const img = canvas.toDataURL();
    const body = encodeURIComponent("Whiteboard slika:\n\n" + img);

    window.location.href = `mailto:${email}?subject=Whiteboard&body=${body}`;

    confirmModal.classList.add("hidden");
    emailInput.value = "";
};
