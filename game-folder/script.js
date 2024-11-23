let cases = [];
let currentCase = null;
let score = 0;
let timeLeft = 60;
let interval;

const questionElement = document.getElementById("question");
const inputElement = document.getElementById("input");
const scoreElement = document.getElementById("score-value");
const timerElement = document.getElementById("time");

// ゲーム開始
function startGame() {
    fetch("game_data.json")
        .then(response => response.json())
        .then(data => {
            cases = data;
            nextCase();
            inputElement.disabled = false;
            inputElement.focus();
            interval = setInterval(updateTimer, 1000);
        })
        .catch(error => {
            questionElement.textContent = "判例データの読み込みに失敗しました。";
            console.error(error);
        });
}

// タイマー更新
function updateTimer() {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
        endGame();
    }
}

// ゲーム終了
function endGame() {
    clearInterval(interval);
    inputElement.disabled = true;
    questionElement.textContent = "ゲーム終了！お疲れ様でした！";
}

// 次の問題を出題
function nextCase() {
    if (cases.length === 0) {
        endGame();
        return;
    }
    currentCase = cases.pop();
    questionElement.textContent = currentCase.problem;
    inputElement.value = "";
}

// 解答チェック
inputElement.addEventListener("input", () => {
    if (inputElement.value.trim() === currentCase.original) {
        score += 10;
        scoreElement.textContent = score;
        nextCase();
    }
});

// ゲーム開始を初期化
startGame();
