// Element References
const startBtn = document.getElementById("start-btn");
const quizScreen = document.getElementById("quiz-screen");
const startScreen = document.getElementById("start-screen");
const resultScreen = document.getElementById("result-screen");

const questionBox = document.getElementById("question-box");
const optionBox = document.getElementById("options-box");
const categorySelect = document.getElementById("category-select");
const scoreBox = document.getElementById("score");
const leaderboard = document.getElementById("leaderboard");
const progressBar = document.getElementById("progress-bar");
const themeToggle = document.getElementById("theme-toggle");
const timerText = document.getElementById("time");

let currentIndex = 0;
let score = 0;
let quizQuestions = [];
let timer;
let timeLeft = 10;

// Start Quiz
startBtn.addEventListener("click", () => {
    const category = categorySelect.value;
    if (!category) return alert("Please select a category");

    applyCategoryTheme(category);

    quizQuestions = questions.filter(q => q.category === category);
    quizQuestions = quizQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);

    if (quizQuestions.length === 0) {
        alert("No questions available for this category!");
        return;
    }

    currentIndex = 0;
    score = 0;

    startScreen.style.display = "none";
    quizScreen.style.display = "block";
    resultScreen.style.display = "none";
    showQuestion();
});

// Show Question
function showQuestion() {
    clearInterval(timer);
    timeLeft = 10;
    timerText.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);

    const q = quizQuestions[currentIndex];
    questionBox.innerText = `Q${currentIndex + 1}: ${q.question}`;
    optionBox.innerHTML = "";

    q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.innerText = option;
        btn.onclick = () => {
            if (option === q.answer) score++;
            nextQuestion();
        };
        optionBox.appendChild(btn);
    });

    updateProgress(currentIndex + 1, quizQuestions.length);
}

// Next Question or Show Result
function nextQuestion() {
    currentIndex++;
    if (currentIndex < quizQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

// Show Result
function showResult() {
    clearInterval(timer);
    quizScreen.style.display = "none";
    resultScreen.style.display = "block";
    scoreBox.innerText = `${score}/${quizQuestions.length}`;

    // Leaderboard Logic
    let oldScores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    oldScores.push(score);
    oldScores = oldScores.sort((a, b) => b - a).slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(oldScores));

    leaderboard.innerHTML = "";
    oldScores.forEach((s, i) => {
        const li = document.createElement("li");
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
        li.innerText = `${medal} - ${s} points`;
        leaderboard.appendChild(li);
    });
}

// Update Progress Bar
function updateProgress(current, total) {
    const percent = (current / total) * 100;
    progressBar.style.width = `${percent}%`;
}

// Theme by Category
function applyCategoryTheme(category) {
    let color;
    switch (category.toLowerCase()) {
        case 'html': color = '#e44d26'; break;
        case 'css': color = '#264de4'; break;
        case 'javascript': color = '#f0db4f'; break;
        case 'general': color = '#6f42c1'; break;
        default: color = '#28a745';
    }
    progressBar.style.backgroundColor = color;
}

// Theme Toggle
themeToggle?.addEventListener("change", () => {
    document.body.classList.toggle("dark");
});
