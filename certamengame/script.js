let questionPool = [];
let currentQuestion = null;
let words = [];
let wordIndex = 0;
let timer = 30;
let timerInterval = null;
let readingTimeout = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start").addEventListener("click", startGame);
  document.getElementById("buzz").addEventListener("click", onBuzz);
  document.getElementById("skip").addEventListener("click", nextQuestion);
  document.getElementById("submit-answer").addEventListener("click", submitAnswer);
  document.getElementById("back").addEventListener("click", backToSetup);
});

function backToSetup() {
  clearAllTimers();
  document.getElementById("game").style.display = "none";
  document.getElementById("setup").style.display = "block";
  document.getElementById("question-box").innerText = "";
  document.getElementById("answer").value = "";
  document.getElementById("answer-box").style.display = "none";
}

async function startGame() {
  clearAllTimers();

  const level = document.querySelector('input[name="level"]:checked').value;
  const categories = Array.from(
    document.querySelectorAll('#setup input[type="checkbox"]:checked')
  ).map(cb => cb.value.toLowerCase());

  try {
    // Load CSV file directly (flat repo)
    const res = await fetch(`${level}.csv`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load questions");
    const text = await res.text();
    const allQs = parseCSV(text);

    questionPool = categories.length
      ? allQs.filter(q => categories.includes(q.category.toLowerCase()))
      : allQs.slice();

    if (!questionPool.length) {
      alert("No questions found for that selection.");
      return;
    }

    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";

    nextQuestion();
  } catch (e) {
    console.error(e);
    alert("Couldn't load questions. Make sure CSV files are in the repo root.");
  }
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    return {
      category: values[0].trim(),
      question: values[1].trim(),
      answer: values[2].trim()
    };
  });
}

function nextQuestion() {
  clearAllTimers();

  currentQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];
  words = currentQuestion.question.split(" ");
  wordIndex = 0;

  document.getElementById("question-box").innerText = "";
  document.getElementById("answer").value = "";
  document.getElementById("answer-box").style.display = "none";

  readNextWord();
  startTimer(30);
}

function readNextWord() {
  if (wordIndex < words.length) {
    document.getElementById("question-box").innerText += words[wordIndex] + " ";
    wordIndex++;
    readingTimeout = setTimeout(readNextWord, 700);
  }
}

function onBuzz() {
  clearInterval(timerInterval);
  if (readingTimeout) clearTimeout(readingTimeout);
  document.getElementById("answer-box").style.display = "block";
  document.getElementById("answer").focus();
}

function submitAnswer() {
  const user = (document.getElementById("answer").value || "").trim().toLowerCase();
  const correct = (currentQuestion.answer || "").trim().toLowerCase();

  if (!user) return;

  if (user === correct) {
    alert("✅ Correct!");
    nextQuestion();
  } else {
    alert("❌ Wrong! Keep listening...");
    document.getElementById("answer-box").style.display = "none";
    readNextWord();
    if (!timerInterval) startTimer(parseInt(document.getElementById("timer").innerText, 10) || 0);
  }
}

function startTimer(seconds) {
  timer = seconds;
  updateTimerUI();
  timerInterval = setInterval(() => {
    timer--;
    updateTimerUI();
    if (timer <= 0) {
      clearAllTimers();
      nextQuestion();
    }
  }, 1000);
}

function updateTimerUI() {
  document.getElementById("timer").innerText = timer;
}

function clearAllTimers() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  if (readingTimeout) clearTimeout(readingTimeout);
  readingTimeout = null;
}
