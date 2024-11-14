// script.js

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let highScore = localStorage.getItem('highScore') || 0;
document.getElementById('high-score').textContent = highScore;

const startBtn = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const scoreContainer = document.getElementById('score-container');
const categorySelect = document.getElementById('category');
const difficultySelect = document.getElementById('difficulty');
const restartBtn = document.getElementById('restart-btn');

startBtn.addEventListener('click', startQuiz);

async function startQuiz() {
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;

    // Fetch questions based on selected category and difficulty
    const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
    const response = await fetch(url);
    const data = await response.json();
    questions = data.results;

    score = 0;
    currentQuestionIndex = 0;
    quizContainer.innerHTML = ''; // Clear previous quiz data

    showQuestion();
    scoreContainer.style.display = 'none';
    quizContainer.style.display = 'block';
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const question = questions[currentQuestionIndex];
    const questionText = question.question;
    const answers = [...question.incorrect_answers, question.correct_answer];
    shuffle(answers);

    const questionElement = document.createElement('div');
    questionElement.classList.add('question');

    const questionTitle = document.createElement('h2');
    questionTitle.innerHTML = questionText;
    questionElement.appendChild(questionTitle);

    answers.forEach(answer => {
        const answerButton = document.createElement('button');
        answerButton.textContent = answer;
        answerButton.addEventListener('click', () => checkAnswer(answer));
        questionElement.appendChild(answerButton);
    });

    quizContainer.appendChild(questionElement);
}

function checkAnswer(selectedAnswer) {
    const correctAnswer = questions[currentQuestionIndex].correct_answer;

    if (selectedAnswer === correctAnswer) {
        score++;
    }

    currentQuestionIndex++;
    quizContainer.innerHTML = ''; // Clear current question
    showQuestion(); // Show the next question
}

function endQuiz() {
    quizContainer.style.display = 'none';
    scoreContainer.style.display = 'block';
    document.getElementById('score').textContent = score;

    // Update high score if necessary
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('high-score').textContent = highScore;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}
