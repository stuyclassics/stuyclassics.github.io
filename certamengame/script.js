let questionPool = [];
let currentQuestion = null;
let words = [];
let wordIndex = 0;

let timer = 10;
let timerInterval = null;
let readingTimeout = null;
let readingDone = false;

let readDelay = 700; // ms per word, controlled by slider

const el = (id) => document.getElementById(id);
const qBox = () => el("question-box");

document.addEventListener("DOMContentLoaded", () => {
  el("start").addEventListener("click", startGame);
  el("buzz").addEventListener("click", onBuzz);
  el("skip").addEventListener("click", nextQuestion);
  el("submit-answer").addEventListener("click", submitAnswer);
  el("back").addEventListener("click", backToSetup);

  // ENTER submits answer
  el("answer").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitAnswer();
    }
  });

  // Read-speed slider
  const speed = el("speed");
  const label = el("speed-label");

  readDelay = Number(speed.value);
  label.innerText = `${readDelay} ms/word`;

  speed.addEventListener("input", () => {
    readDelay = Number(speed.value);
    label.innerText = `${readDelay} ms/word`;
  });
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

  const { text } = await fetchLevelCSV(level);
  const allQs = parseCSV(text);

  questionPool = categories.length
    ? allQs.filter(q => categories.includes(q.category.toLowerCase()))
    : allQs.slice();

  if (!questionPool.length) {
    setMessage("No questions found.");
    return;
  }

  el("setup").style.display = "none";
  el("game").style.display = "block";
  el("timer-card").style.display = "none";

  nextQuestion();
}

/* ---------- CSV ---------- */
async function fetchLevelCSV(level) {
  const res = await fetch(`${level}.csv?v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("CSV load failed");
  return { text: await res.text() };
}

function parseCSV(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = [];
    let cur = "";
    let inQuotes = false;

    for (let ch of lines[i]) {
      if (ch === '"') inQuotes = !inQuotes;
      else if (ch === "," && !inQuotes) {
        cells.push(cur);
        cur = "";
      } else cur += ch;
    }
    cells.push(cur);

    rows.push({
      category: (cells[0] || "").trim(),
      question: (cells[1] || "").trim(),
      answer: (cells[2] || "").trim()
    });
  }
  return rows;
}

/* ---------- Question Flow ---------- */
function nextQuestion() {
  clearAllTimers();
  hideTimer();

  currentQuestion =
    questionPool[Math.floor(Math.random() * questionPool.length)];

  words = currentQuestion.question.split(" ");
  wordIndex = 0;
  readingDone = false;

  qBox().innerHTML = "";
  el("answer").value = "";
  el("answer-box").style.display = "none";
  setMessage("");

  readNextWord();
}

function readNextWord() {
  if (wordIndex < words.length) {
    qBox().innerHTML += escapeHTML(words[wordIndex]) + "&nbsp;";
    wordIndex++;
    readingTimeout = setTimeout(readNextWord, readDelay);
  } else {
    readingDone = true;
    startTimer(10);
  }
}

/* ---------- Buzz / Answer ---------- */
function onBuzz() {
  if (readingTimeout) clearTimeout(readingTimeout);
  if (!readingDone) startTimer(10);
  el("answer-box").style.display = "flex";
  el("answer").focus();
}

function submitAnswer() {
  showAnswer();
}

function showAnswer() {
  setMessage("Answer: " + currentQuestion.answer);
  el("answer-box").style.display = "none";
  setTimeout(nextQuestion, 2000);
}

/* ---------- Timer ---------- */
function startTimer(seconds) {
  if (timerInterval) return;
  timer = seconds;
  showTimer();
  updateTimer();

  timerInterval = setInterval(() => {
    timer--;
    updateTimer();
    if (timer <= 0) {
      clearAllTimers();
      showAnswer();
    }
  }, 1000);
}

function updateTimer() {
  el("timer").innerText = timer;
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

/* ---------- Utils ---------- */
function setMessage(msg) {
  el("message").innerText = msg;
}

function escapeHTML(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
