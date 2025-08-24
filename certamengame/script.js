let questionPool = [];
let currentQuestion = null;
let words = [];
let wordIndex = 0;
let timer = 10;                 // 10-second answer window
let timerInterval = null;
let readingTimeout = null;
let readingDone = false;

const el = (id) => document.getElementById(id);
const qBox = () => el("question-box");

document.addEventListener("DOMContentLoaded", () => {
  el("start").addEventListener("click", startGame);
  el("buzz").addEventListener("click", onBuzz);
  el("skip").addEventListener("click", nextQuestion);
  el("submit-answer").addEventListener("click", submitAnswer);
  el("back").addEventListener("click", backToSetup);
});

/* ---------- Navigation ---------- */
function backToSetup() {
  clearAllTimers();
  el("game").style.display = "none";
  el("setup").style.display = "block";
  el("timer-card").style.display = "none";
  qBox().innerHTML = "";
  el("answer").value = "";
  el("answer-box").style.display = "none";
  setMessage("");
}

/* ---------- Start ---------- */
async function startGame() {
  clearAllTimers();

  const level = document.querySelector('input[name="level"]:checked').value;
  const categories = Array.from(
    document.querySelectorAll('#setup input[type="checkbox"]:checked')
  ).map(cb => cb.value.toLowerCase());

  try {
    const res = await fetch(`${level}.csv`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load questions");
    const text = await res.text();
    const allQs = parseCSV(text);

    questionPool = categories.length
      ? allQs.filter(q => categories.includes(q.category.toLowerCase()))
      : allQs.slice();

    if (!questionPool.length) {
      setMessage("No questions found for that selection.");
      return;
    }

    el("setup").style.display = "none";
    el("game").style.display = "block";
    el("timer-card").style.display = "none";

    nextQuestion();
  } catch (e) {
    console.error(e);
    setMessage("Couldn't load questions. Ensure CSVs are in the same folder as index.html.");
  }
}

/* ---------- CSV ---------- */
function parseCSV(text) {
  const lines = text.trim().split("\n");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    return {
      category: (values[0] || "").trim(),
      question: (values[1] || "").trim(),
      answer: (values[2] || "").trim()
    };
  });
}

/* ---------- Question Flow ---------- */
function nextQuestion() {
  clearAllTimers();
  hideTimer();

  currentQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];

  // Split by spaces (simple) and we will FORCE a space after each chunk when rendering.
  words = currentQuestion.question.split(" ");
  wordIndex = 0;
  readingDone = false;

  qBox().innerHTML = "";                  // using innerHTML so we can append &nbsp;
  el("answer").value = "";
  el("answer-box").style.display = "none";
  setMessage("");

  readNextWord();
}

function readNextWord() {
  if (wordIndex < words.length) {
    const word = words[wordIndex] ?? "";
    // FORCE a space after every chunk using &nbsp; to guarantee visual spacing in all fonts
    qBox().innerHTML += escapeHTML(word) + "&nbsp;";
    wordIndex++;
    readingTimeout = setTimeout(readNextWord, 700);
  } else {
    readingDone = true;
    startTimer(10); // start once reading completes
  }
}

/* ---------- Buzz / Answer ---------- */
function onBuzz() {
  if (readingTimeout) clearTimeout(readingTimeout);
  if (!readingDone) startTimer(10);      // start immediately on early buzz
  el("answer-box").style.display = "flex";
  el("answer").focus();
}

function submitAnswer() {
  showAnswer();
}

function showAnswer() {
  const correct = (currentQuestion.answer || "").trim();
  setMessage("Answer: " + correct);
  el("answer-box").style.display = "none";
  setTimeout(nextQuestion, 2000);
}

/* ---------- Timer ---------- */
function startTimer(seconds) {
  if (timerInterval) return;            // don’t double-start
  timer = seconds;
  showTimer();
  updateTimerUI();
  timerInterval = setInterval(() => {
    timer--;
    updateTimerUI();
    if (timer <= 0) {
      clearAllTimers();
      showAnswer();
    }
  }, 1000);
}

function updateTimerUI() {
  el("timer").innerText = String(timer);
}

function clearAllTimers() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  if (readingTimeout) clearTimeout(readingTimeout);
  readingTimeout = null;
}

function showTimer() {
  el("timer-card").style.display = "block";
}

function hideTimer() {
  el("timer-card").style.display = "none";
}

/* ---------- UI helpers ---------- */
function setMessage(msg) {
  el("message").innerText = msg;
}

// Escape HTML to safely use innerHTML when we append &nbsp;
function escapeHTML(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
