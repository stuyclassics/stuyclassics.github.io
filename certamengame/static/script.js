let currentQuestion = null;
let words = [];
let wordIndex = 0;
let timer = 30;
let interval;
let level = "novice";
let categories = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start").addEventListener("click", () => {
    // get selected level
    level = document.querySelector('input[name="level"]:checked').value;

    // get selected categories
    categories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.value);

    // switch to game view
    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";

    // start first question
    fetchQuestion();
  });

  document.getElementById("buzz").addEventListener("click", () => {
    clearInterval(interval);
    document.getElementById("answer-box").style.display = "block";
  });

  document.getElementById("submit-answer").addEventListener("click", async () => {
    let answer = document.getElementById("answer").value;
    let res = await fetch("/submit_answer", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({answer: answer, correct: currentQuestion.answer})
    });
    let data = await res.json();

    if (data.result === "correct") {
      alert("✅ Correct!");
      fetchQuestion();
    } else {
      alert("❌ Wrong! Keep listening...");
      readNextWord();
    }
    document.getElementById("answer-box").style.display = "none";
    document.getElementById("answer").value = "";
  });

  document.getElementById("skip").addEventListener("click", fetchQuestion);
});

async function fetchQuestion() {
  const res = await fetch("/get_question", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({level: level, categories: categories})
  });
  currentQuestion = await res.json();
  words = currentQuestion.question.split(" ");
  wordIndex = 0;
  document.getElementById("question-box").innerText = "";
  readNextWord();
  startTimer();
}

function readNextWord() {
  if (wordIndex < words.length) {
    document.getElementById("question-box").innerText += words[wordIndex] + " ";
    wordIndex++;
    setTimeout(readNextWord, 700);
  }
}

function startTimer() {
  timer = 30;
  document.getElementById("timer").innerText = timer;
  clearInterval(interval);
  interval = setInterval(() => {
    timer--;
    document.getElementById("timer").innerText = timer;
    if (timer <= 0) {
      clearInterval(interval);
      fetchQuestion();
    }
  }, 1000);
}
