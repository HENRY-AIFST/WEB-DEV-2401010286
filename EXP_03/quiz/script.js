// Hardcoded quiz questions (no backend needed)
const questions = [
    { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: 2 },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: 1 },
    { question: "What is 5 + 3?", options: ["6", "7", "8", "9"], answer: 2 }
];

let currentIndex = 0;
let score = 0;

// Load questions (no fetch needed)
function loadQuestions() {
    loadQuestion();
}

function loadQuestion() {
    if (currentIndex >= questions.length) {
        showResult();
        return;
    }
    const q = questions[currentIndex];
    document.getElementById('question').innerHTML = `<i class="fas fa-question-circle"></i> ${q.question}`;
    const optionsEl = document.getElementById('options');
    optionsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.onclick = () => selectAnswer(i);
        optionsEl.appendChild(btn);
    });
    document.getElementById('next-btn').style.display = 'none';
    // Update progress bar
    const progress = ((currentIndex + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

function selectAnswer(i) {
    if (i === questions[currentIndex].answer) score++;
    document.getElementById('next-btn').style.display = 'block';
}

document.getElementById('next-btn').onclick = () => {
    currentIndex++;
    loadQuestion();
};

function showResult() {
    document.getElementById('question').style.display = 'none';
    document.getElementById('options').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('result').textContent = `Your score: ${score}/${questions.length}`;
    document.getElementById('result').style.display = 'block';
    document.getElementById('restart-btn').style.display = 'block';
}

document.getElementById('restart-btn').onclick = () => {
    currentIndex = 0;
    score = 0;
    document.getElementById('result').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('question').style.display = 'block';
    document.getElementById('options').style.display = 'block';
    loadQuestion();
};

// Simple about toggle
document.querySelector('nav a').onclick = () => {
    const about = document.getElementById('about-section');
    about.style.display = about.style.display === 'none' ? 'block' : 'none';
};

loadQuestions();