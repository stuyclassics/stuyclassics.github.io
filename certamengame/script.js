let questionPool = [];
let currentQuestion = null;
let words = [];
let wordIndex = 0;

let timer = 10;
let timerInterval = null;
let readingTimeout = null;
let readingDone = false;

let wordsPerSecond = 1.4;

// Stores your response for the CURRENT question only.
// This is NOT saved unless you click Mark for Review.
let lastUserResponse = "";

const REVIEW_KEY = "certamen_review_log_v3";

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

  // Enter in game:
  // - if answer box visible -> submit
  // - else -> buzz
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (el("game").style.display === "none") return;

    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();

    const answerBoxVisible = el("answer-box").style.display !== "none";
    if (answerBoxVisible) submitAnswer();
    else onBuzz();
  }, true);

  // Read-speed slider (words/sec)
  const speed = el("speed");
  const label = el("speed-label");

  function syncSpeedUI() {
    wordsPerSecond = Number(speed.value) || 1.4;
    label.textContent = `${wordsPerSecond.toFixed(1)} words/sec`;
  }
  syncSpeedUI();
  speed.addEventListener("input", syncSpeedUI);
});

/* ---------- Review Log ---------- */
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

function prettyCategory(cat) {
  const c = String(cat || "").trim();
  if (!c) return "";
  return c
    .toLowerCase()
    .split(/\s+/)
    .map(w => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

function makeReviewId(q) {
  const s = `${q.category}||${q.question}||${q.answer}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return String(h);
}

function addToReviewLog(q, response) {
  if (!q) return;
  const log = loadReviewLog();
  const id = makeReviewId(q);
  if (log.some(item => item.id === id)) return;

  log.unshift({
    id,
    category: prettyCategory(q.category),
    question: String(q.question || "").trim(),
    answer: String(q.answer || "").trim(),
    response: (response && response.trim()) ? response.trim() : "(no response)",
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

  list.innerHTML = log.map(item => `
    <div class="review-item">
      <div class="review-meta">${escapeHTML(item.category)}</div>
      <div class="review-q">${escapeHTML(item.question)}</div>
      <div class="review-r"><span class="review-a-label">Your response:</span> ${escapeHTML(item.response)}</div>
      <div class="review-a"><span class="review-a-label">Answer:</span> ${escapeHTML(item.answer)}</div>
    </div>
  `).join("");
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
  if (questionPool.length) {
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

  try {
    const { text } = await fetchLevelCSV(level);
    const allQs = parseCSV(text);

    questionPool = categories.length
      ? allQs.filter(q => categories.includes(q.category.toLowerCase()))
      : allQs.slice();

    if (!questionPool.length) {
      setMessage("No questions found for that selection.");
      return;
    }

    el("setup").style.display = "none";
    el("review").style.display = "none";
    el("game").style.display = "block";
    el("timer-card").style.display = "none";

    nextQuestion();
  } catch (err) {
    console.error(err);
    setMessage("Couldn't load questions. Ensure novice.csv/intermediate.csv/advanced.csv are next to index.html.");
  }
}

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
      if (res.ok) return { text: await res.text(), usedPath: path };
      lastErr = new Error(`HTTP ${res.status} for ${path}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("CSV not found");
}

/* ---------- CSV parsing (quotes-safe) ---------- */
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
        if (inQuotes && line[j + 1] === '"') {
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

  // reset per-question response (NOT saved unless Mark for Review is pressed)
  lastUserResponse = "";

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
  lastUserResponse = el("answer").value.trim();
  showAnswer();
}

function showAnswer() {
  // If timer runs out while you're typing (no submit), capture whatever is currently typed
  if (!lastUserResponse) lastUserResponse = el("answer").value.trim();

  const correct = (currentQuestion && currentQuestion.answer) ? currentQuestion.answer : "";
  setMessage("Answer: " + correct);

  el("answer-box").style.display = "none";
  el("post-reveal").style.display = "block";

  setTimeout(nextQuestion, 2000);
}

function markCurrentForReview() {
  addToReviewLog(currentQuestion, lastUserResponse);
  setMessage("Saved to Review Log.");
}

/* ---------- Timer ---------- */
function startTimer(seconds) {
  if (timerInterval) return;
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

/* ---------- Utils ---------- */
function setMessage(msg) {
  el("message").innerText = msg;
}

function escapeHTML(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
