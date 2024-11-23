function startGame(questions) {
  let currentQuestion = {};
  let score = 0;
  let timer;
  let timeRemaining = 60;

  function loadQuestion() {
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    const questionText = currentQuestion.text;

    const formattedText = currentQuestion.hidden.reduce((text, hiddenWord) => {
      const regex = new RegExp(hiddenWord, "g");
      return text.replace(regex, `<span class="hidden">${hiddenWord}</span>`);
    }, questionText);

    document.getElementById("question").innerHTML = formattedText;
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      timeRemaining--;
      document.getElementById("timer").textContent = timeRemaining;
      if (timeRemaining <= 0) {
        clearInterval(timer);
        alert("時間切れ！スコア: " + score);
        document.location.href = "index.html";
      }
    }, 1000);
  }

  document.getElementById("submit-answer").addEventListener("click", () => {
    const userAnswer = document.getElementById("answer").value.trim();
    const hiddenWords = currentQuestion.hidden;
    const isCorrect = hiddenWords.includes(userAnswer);

    if (isCorrect) {
      score += 10;
      alert("正解です！");
    } else {
      alert("不正解です。");
    }

    document.getElementById("score").textContent = score;
    document.getElementById("answer").value = "";
    loadQuestion();
  });

  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = timeRemaining;

  loadQuestion();
  startTimer();
}
