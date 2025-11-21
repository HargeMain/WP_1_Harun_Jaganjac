// 2025 © Harun Jaganjac

document.getElementById("checkBtn").onclick = checkAnswers;
document.getElementById("scoreRetry").onclick = resetQuiz;

function checkAnswers() {
    let score = 0;
    const total = 5;

    const answers = {
        q1: ["a"],
        q2: ["a", "b"],
        q3: ["b"],
        q4: ["a", "b", "d"],
        q5: ["b"]
    };

    for (let i = 1; i <= total; i++) {
        const inputs = document.querySelectorAll(`input[name="q${i}"]`);
        const selected = Array.from(inputs)
            .filter(i => i.checked)
            .map(i => i.value);

        if (
            selected.length === answers[`q${i}`].length &&
            selected.every(v => answers[`q${i}`].includes(v))
        ) {
            score++;
        }
    }

    const history = JSON.parse(localStorage.getItem("kvizScores") || "[]");
    history.push({ score, date: new Date().toLocaleString() });
    localStorage.setItem("kvizScores", JSON.stringify(history));

    openScoreModal(score, total);
}

function openScoreModal(score, total) {
    const modal = document.getElementById("scoreModal");
    const emoji = document.getElementById("scoreEmoji");
    const text = document.getElementById("scoreText");

    text.textContent = `Osvojili ste ${score}/${total} poena`;

    if (score <= 1) emoji.textContent = "😢";
    else if (score === 2) emoji.textContent = "😐";
    else if (score === 3 || score === 4) emoji.textContent = "🙂";
    else emoji.textContent = "🤩";

    modal.classList.remove("hidden");
}

function resetQuiz() {
    document.querySelectorAll("input").forEach(i => (i.checked = false));
    document.getElementById("scoreModal").classList.add("hidden");
}
