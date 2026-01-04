let questionPool = [];
let currentQuestion = null;
let words = [];
let wordIndex = 0;

let timer = 10;
let timerInterval = null;
let readingTimeout = null;
let readingDone = false;

// Slider controls words per second
let wordsPerSecond = 1.4;

const REVIEW_KEY = "certamen_review_log_v1";

const el = (id) => document.getElementById(id);
const qBox = () => el("question-box");

document.addEventListener("DOMContentLoaded", () => {
  el("start").addEventListener("click", startGame);
  el("buzz").addEventListener("click", onBuzz);
  el("skip").addEventListener("click", nextQuestion);
  el("submit-answer").addEventListener("click", submitAnswer);
  el("back").addEventListener("click", backToSetup);

  el("review-log").addEventListener("click", openReview);
  el("close-review").addEventListener("click", closeReview);
  el("clear-review").addEventListener("click", clearReviewLog);
  el("mark-review").addEventListener("click", markCurrentForReview);

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const inGame = el("game").style.display !== "none";
    if (!inGame) return;

    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();

    const answerBoxVisible = el("answer-box").style.display !== "none";
    if (answerBoxVisible) submitAnswer();
    else onBuzz();
  }, true);

  const speed = el("speed");
  const label = el("speed-label");

  function syncSpeedUI() {
    wordsPerSecond = Number(speed.value) || 1.4;
    label.textContent = `${wordsPerSecond.toFixed(1)} words/sec`;
  }
  syncSpeedUI();
  speed.addEventListener("input", syncSpeedUI);
});

/* ---------- Review Log Storage ---------- */
function loadReviewLog() {
  try {
    const raw = localStorage.getItem(REVIEW_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveReviewLog(arr) {
  localStorage.setItem(REVIEW_KEY, JSON.stringify(arr));
}

function makeReviewId(q) {
  const s = `${q.category}||${q.question}||${q.answer}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return String(h);
}

function prettyCategory(cat) {
  const c = String(cat || "").trim();
  if (!c) return "";
  // Capitalize each word, keep the rest lowercase
  return c
    .toLowerCase()
    .split(/\s+/)
    .map(w => w ? (w[0].toUpperCase() + w.slice(1)) : "")
    .join(" ");
}

function addToReviewLog(q) {
  if (!q) return;

  const log = loadReviewLog();
  const id = makeReviewId(q);

  if (log.some(item => item.id === id)) return;

  log.unshift({
    id,
    category: prettyCategory(q.category),
    question: String(q.question || "").trim(),
    answer: String(q.answer || "").trim(), // SAVED ANSWER
    addedAt: Date.now()
  });

  saveReviewLog(log);
}

function renderReviewLog() {
  const list = el("review-list");
  const log = loadReviewLog();

  if (!log.length) {
    list.innerHTML = `<div class="review-empty">No saved questions yet.</div>`;
    return;
  }

  const html = log.map(item => {
    const cat = escapeHTML(item.category || "");
    const q = escapeHTML(item.question || "");
    const a = escapeHTML(item.answer || "");
    return `
      <div class="review-item">
        <div class="review-meta">${cat}</div>
        <div class="review-q">${q}</div>
        <div class="review-a"><span class="review-a-label">Answer:</span> ${a}</div>
      </div>
    `;
  }).join("");

  list.innerHTML = html;
}

function clearReviewLog() {
  localStorage.removeItem(REVIEW_KEY);
  renderReviewLog();
}

/* ---------- Navigation ---------- */
function backToSetup() {
  clearAllTimers();
  el("review").style.display = "none";
  el("game").style.display = "none";
  el("setup").style.display = "block";
  el("timer-card").style.display = "none";
  qBox().innerHTML = "";
  el("answer").value = "";
  el("answer-box").style.display = "none";
  el("post-reveal").style.display = "none";
  setMessage("");
}

function openReview() {
  el("setup").style.display = "none";
  el("game").style.display = "none";
  el("timer-card").style.display = "none";
  el("review").style.display = "block";
  renderReviewLog();
}

function closeReview() {
  el("review").style.display = "none";

  const hasGame = questionPool.length > 0;
  if (hasGame) {
    el("game").style.display = "block";
    el("timer-card").style.display = timerInterval ? "block" : "none";
  } else {
    el("setup").style.display = "block";
  }
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
  el("review").style.display = "none";
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

  currentQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];

  words = (currentQuestion.question || "").split(" ");
  wordIndex = 0;
  readingDone = false;

  qBox().innerHTML = "";
  el("answer").value = "";
  el("answer-box").style.display = "none";
  el("post-reveal").style.display = "none";
  setMessage("");

  readNextWord();
}

function readNextWord() {
  if (wordIndex < words.length) {
    qBox().innerHTML += escapeHTML(words[wordIndex]) + "&nbsp;";
    wordIndex++;

    const delayMs = Math.max(50, Math.round(1000 / (wordsPerSecond || 1)));
    readingTimeout = setTimeout(readNextWord, delayMs);
  } else {
    readingDone = true;
    startTimer(10);
  }
}

/* ---------- Buzz / Answer ---------- */
function onBuzz() {
  if (readingTimeout) {
    clearTimeout(readingTimeout);
    readingTimeout = null;
  }
  if (!readingDone) startTimer(10);
  el("answer-box").style.display = "flex";
  el("post-reveal").style.display = "none";
  el("answer").focus();
}

function submitAnswer() {
  showAnswer();
}

function markCurrentForReview() {
  addToReviewLog(currentQuestion);
  setMessage("Saved to Review Log.");
}

function showAnswer() {
  const correct = (currentQuestion && currentQuestion.answer) ? currentQuestion.answer : "";
  setMessage("Answer: " + correct);

el("answer-box").style.display = "none";

  el("post-reveal").style.display = "block";

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

/* ---------- Utils ---------- */
function setMessage(msg) {
  el("message").innerText = msg;
}

function escapeHTML(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
