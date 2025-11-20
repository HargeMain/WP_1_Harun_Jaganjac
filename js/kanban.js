const board = document.getElementById("kanbanBoard");
const notify = document.getElementById("notify");


function alertMsg(msg) {
    notify.textContent = msg;
    notify.classList.add("show");
    setTimeout(() => notify.classList.remove("show"), 1800);
}


const taskModal = document.getElementById("taskModal");
const taskName = document.getElementById("taskName");
const taskDesc = document.getElementById("taskDesc");

document.getElementById("btnAdd").onclick = () => {
    taskName.value = "";
    taskDesc.value = "";
    taskModal.classList.remove("hidden");
};

document.getElementById("taskAddCancel").onclick = () =>
    taskModal.classList.add("hidden");

document.getElementById("taskAddConfirm").onclick = () => {
    if (!taskName.value.trim()) return alertMsg("Unesite naziv!");

    createTask("todo", taskName.value.trim(), taskDesc.value.trim());
    taskModal.classList.add("hidden");
    alertMsg("Zadatak dodat.");
};

function createTask(column, title, desc) {
    const div = document.createElement("div");
    div.className = "task";
    div.draggable = true;
    div.innerHTML = `
        <strong>${title}</strong><br>
        <span>${desc}</span>
    `;

    div.addEventListener("dragstart", dragStart);
    div.addEventListener("dragend", dragEnd);

    document
        .querySelector(`[data-col='${column}'] .col-content`)
        .appendChild(div);
}

let dragged = null;

function dragStart(e) {
    dragged = this;
    setTimeout(() => this.style.opacity = "0.4", 0);
}

function dragEnd() {
    this.style.opacity = "1";
    dragged = null;
}

document.querySelectorAll(".col-content").forEach(col => {
    col.addEventListener("dragover", e => e.preventDefault());

    col.addEventListener("drop", function () {
        this.appendChild(dragged);
        alertMsg("Premješteno.");
    });
});

const saveModal = document.createElement("div");
saveModal.className = "modal hidden";
saveModal.innerHTML = `
    <div class="modal-content">
        <h2>Ime snimka</h2>
        <input type="text" id="saveName">
        <div class="modal-buttons">
            <button id="saveConfirm">Sačuvaj</button>
            <button class="cancel" id="saveCancel">Poništi</button>
        </div>
    </div>
`;
document.body.appendChild(saveModal);

document.getElementById("btnSave").onclick = () => {
    document.getElementById("saveName").value = "";
    saveModal.classList.remove("hidden");
};

document.getElementById("saveCancel").onclick = () =>
    saveModal.classList.add("hidden");

document.getElementById("saveConfirm").onclick = () => {
    const name = document.getElementById("saveName").value.trim();
    if (!name) return alertMsg("Unesite ime!");

    const all = JSON.parse(localStorage.getItem("kanbanBoards") || "[]");

    const boardData = [];

    board.querySelectorAll(".task").forEach(task => {
        boardData.push({
            col: task.parentElement.parentElement.dataset.col,
            title: task.querySelector("strong").textContent,
            desc: task.querySelector("span").textContent
        });
    });

    all.push({ name, data: boardData });

    localStorage.setItem("kanbanBoards", JSON.stringify(all));

    saveModal.classList.add("hidden");
    alertMsg("Sačuvano!");
};


const loadModal = document.getElementById("loadModal");
const loadSelect = document.getElementById("loadSelect");

document.getElementById("btnLoad").onclick = () => {
    const saves = JSON.parse(localStorage.getItem("kanbanBoards") || "[]");

    loadSelect.innerHTML = "";
    saves.forEach((s, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${i + 1}) ${s.name}`;
        loadSelect.appendChild(opt);
    });

    loadModal.classList.remove("hidden");
};

document.getElementById("loadCancel").onclick = () =>
    loadModal.classList.add("hidden");

document.getElementById("loadConfirm").onclick = () => {
    const saves = JSON.parse(localStorage.getItem("kanbanBoards") || "[]");
    const chosen = saves[loadSelect.value];

    board.querySelectorAll(".col-content").forEach(c => c.innerHTML = "");

    chosen.data.forEach(item => createTask(item.col, item.title, item.desc));

    loadModal.classList.add("hidden");
    alertMsg("Učitano!");
};

document.getElementById("btnClear").onclick = () => {
    board.querySelectorAll(".col-content").forEach(c => c.innerHTML = "");
    alertMsg("Očišćeno.");
};


document.getElementById("btnPDF").onclick = async () => {
    const canvas = await html2canvas(board);
    const img = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);

    pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("kanban.pdf");

    alertMsg("PDF kreiran.");
};

document.getElementById("btnPNG").onclick = async () => {
    const canvas = await html2canvas(board);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "kanban.png";
    a.click();
    alertMsg("PNG spremljen.");
};


document.getElementById("btnPrint").onclick = async () => {
    const canvas = await html2canvas(board);
    const img = canvas.toDataURL("image/png");

    const win = window.open("", "_blank");

    win.document.write(`
        <html>
        <body style="margin:0; padding:0;">
            <img id="printImg" src="${img}" style="width:100%; height:auto;">
            <script>
                const imgEl = document.getElementById('printImg');
                imgEl.onload = function () {
                    setTimeout(() => {
                        window.print();
                        window.close();
                    }, 300); 
                };
            <\/script>
        </body>
        </html>
    `);

    win.document.close();
};


const emailModal = document.getElementById("emailModal");
const confirmModal = document.getElementById("confirmModal");
const emailField = document.getElementById("emailField");

document.getElementById("btnMail").onclick = () =>
    emailModal.classList.remove("hidden");

document.getElementById("emailCancel").onclick = () => {
    emailModal.classList.add("hidden");
    emailField.value = "";
};

document.getElementById("emailNext").onclick = () => {
    if (!emailField.value.trim())
        return alertMsg("Unesite email!");

    emailModal.classList.add("hidden");
    confirmModal.classList.remove("hidden");
};

document.getElementById("confirmCancel").onclick = () =>
    confirmModal.classList.add("hidden");

document.getElementById("confirmSend").onclick = async () => {
    const email = emailField.value.trim();

    const canvas = await html2canvas(board);
    const img = canvas.toDataURL("image/png");

    const body = encodeURIComponent("Kanban board:\n\n" + img);

    window.location.href = `mailto:${email}?subject=Kanban Board&body=${body}`;

    confirmModal.classList.add("hidden");
    emailField.value = "";
    alertMsg("Otvaram mail klijent...");
};
