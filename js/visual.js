const board = document.getElementById("board");
const notify = document.getElementById("notify");

function alertMsg(msg) {
    notify.textContent = msg;
    notify.classList.add("show");

    setTimeout(() => notify.classList.remove("show"), 1800);
}


document.getElementById("newNote").onclick = () => addNote(false);
document.getElementById("newQuote").onclick = () => addNote(true);

function addNote(isQuote) {
    const div = document.createElement("div");
    div.className = isQuote ? "note quote" : "note";
    div.style.left = "100px";
    div.style.top = "100px";
    div.innerHTML = `<textarea>${isQuote ? "Inspirativni citat..." : "Nova bilješka..."}</textarea>`;
    board.appendChild(div);
    dragElement(div);
    alertMsg("Element dodan.");
}


function dragElement(el) {
    let x = 0, y = 0, prevX = 0, prevY = 0;

    el.onmousedown = e => {
        prevX = e.clientX;
        prevY = e.clientY;

        document.onmousemove = drag;
        document.onmouseup = stopDrag;
    };

    function drag(e) {
        x = prevX - e.clientX;
        y = prevY - e.clientY;

        prevX = e.clientX;
        prevY = e.clientY;

        el.style.top = el.offsetTop - y + "px";
        el.style.left = el.offsetLeft - x + "px";
    }

    function stopDrag() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}


document.getElementById("imageUpload").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const r = new FileReader();

    r.onload = ev => {
        const img = document.createElement("img");
        img.src = ev.target.result;
        img.className = "board-img";
        img.style.left = "150px";
        img.style.top = "150px";

        board.appendChild(img);
        dragElement(img);
        alertMsg("Slika dodana.");
    };

    r.readAsDataURL(file);
};


document.getElementById("saveBoard").onclick = () => {
    const saves = JSON.parse(localStorage.getItem("visionBoards") || "[]");

    const current = [];

    board.querySelectorAll(".note, .board-img").forEach(el => {
        current.push({
            type: el.className.includes("img") ? "img" : "note",
            class: el.className,
            left: el.style.left,
            top: el.style.top,
            content: el.tagName === "IMG"
                ? el.src
                : el.querySelector("textarea").value
        });
    });

    saves.push({ date: new Date().toLocaleString(), data: current });

    localStorage.setItem("visionBoards", JSON.stringify(saves));

    alertMsg("Sačuvano.");
};


const loadModal = document.getElementById("loadModal");
const loadSelect = document.getElementById("loadSelect");

document.getElementById("loadBoard").onclick = () => {
    const saves = JSON.parse(localStorage.getItem("visionBoards") || "[]");

    loadSelect.innerHTML = "";

    saves.forEach((s, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${i+1}) ${s.date}`;
        loadSelect.appendChild(opt);
    });

    loadModal.classList.remove("hidden");
};

document.getElementById("loadCancel").onclick = () =>
    loadModal.classList.add("hidden");

document.getElementById("loadConfirm").onclick = () => {

    board.innerHTML = "";

    const saves = JSON.parse(localStorage.getItem("visionBoards") || "[]");
    const load = saves[loadSelect.value].data;

    load.forEach(item => {
        if (item.type === "img") {
            const img = document.createElement("img");
            img.src = item.content;
            img.className = "board-img";
            img.style.left = item.left;
            img.style.top = item.top;
            board.appendChild(img);
            dragElement(img);
        } else {
            const div = document.createElement("div");
            div.className = item.class;
            div.style.left = item.left;
            div.style.top = item.top;
            div.innerHTML = `<textarea>${item.content}</textarea>`;
            board.appendChild(div);
            dragElement(div);
        }
    });

    loadModal.classList.add("hidden");
    alertMsg("Board učitan.");
};


document.getElementById("clearBoard").onclick = () => {
    board.innerHTML = "";
    alertMsg("Očišćeno.");
};


document.getElementById("exportPDF").onclick = async () => {
    const canvas = await html2canvas(board);
    const img = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);

    pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("vision-board.pdf");

    alertMsg("PDF spremljen.");
};


document.getElementById("printBoard").onclick = async () => {
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

document.getElementById("sendMail").onclick = () =>
    emailModal.classList.remove("hidden");

document.getElementById("emailCancel").onclick = () => {
    emailModal.classList.add("hidden");
    document.getElementById("emailField").value = "";
};

document.getElementById("emailNext").onclick = () => {
    if (!document.getElementById("emailField").value.trim())
        return alertMsg("Unesite email.");

    emailModal.classList.add("hidden");
    confirmModal.classList.remove("hidden");
};

document.getElementById("confirmCancel").onclick = () =>
    confirmModal.classList.add("hidden");

document.getElementById("confirmSend").onclick = async () => {
    const email = document.getElementById("emailField").value.trim();

    const canvas = await html2canvas(board);
    const img = canvas.toDataURL("image/png");

    const body = encodeURIComponent("Vision Board:\n\n" + img);

    window.location.href = `mailto:${email}?subject=Vision Board&body=${body}`;

    confirmModal.classList.add("hidden");
    alertMsg("Otvaram mail klijent...");
};
