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
    const { text, usedPath } = await fetchLevelCSV(level);
    console.log("Loaded CSV from:", usedPath);

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
    setMessage("Couldn't load questions. Ensure CSVs are in the same folder as index.html and named novice.csv, intermediate.csv, advanced.csv.");
  }
}

/* ---------- CSV fetching (robust, cache-busted) ---------- */
async function fetchLevelCSV(level) {
  const cap = level.charAt(0).toUpperCase() + level.slice(1);
  const candidates = [
    `./${level}.csv`,
    `${level}.csv`,
    `./${cap}.csv`,
    `${cap}.csv`,
    `./data/${level}.csv`,
    `data/${level}.csv`
  ];
  let lastErr = null;
  for (const path of candidates) {
    try {
      const res = await fetch(`${path}?v=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const text = await res.text();
        return { text, usedPath: path };
      } else {
        lastErr = new Error(`HTTP ${res.status} for ${path}`);
      }
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("CSV not found.");
}

/* ---------- CSV parsing (handles commas inside quotes) ---------- */
function parseCSV(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  if (lines.length <= 1) return [];

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const cells = [];
    let cur = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"') {
        if (inQuotes && line[j + 1] === '"') { // escaped quote
          cur += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        cells.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
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

  currentQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];

  // Split by spaces; we will FORCE spacing when rendering.
  words = (currentQuestion.question || "").split(" ");
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
    const chunk = words[wordIndex] ?? "";
    // FORCE a visible space after every chunk with &nbsp;
    qBox().innerHTML += escapeHTML(chunk) + "&nbsp;";
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
