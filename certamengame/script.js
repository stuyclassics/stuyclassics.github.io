let questionPool = [];
let currentQuestion = null;
let words = [];
let wordIndex = 0;

let lastUserResponse = ""; // ONLY stored temporarily for current question

let timer = 10;
let timerInterval = null;
let readingTimeout = null;
let readingDone = false;

let wordsPerSecond = 1.4;

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

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (el("game").style.display === "none") return;

    e.preventDefault();
    e.stopPropagation();

    if (el("answer-box").style.display !== "none") submitAnswer();
    else onBuzz();
  }, true);

  const speed = el("speed");
  const label = el("speed-label");

  function syncSpeed() {
    wordsPerSecond = Number(speed.value) || 1.4;
    label.textContent = `${wordsPerSecond.toFixed(1)} words/sec`;
  }
  syncSpeed();
  speed.addEventListener("input", syncSpeed);
});

/* ---------- Review Storage ---------- */
function loadReviewLog() {
  try {
    return JSON.parse(localStorage.getItem(REVIEW_KEY)) || [];
  } catch {
    return [];
  }
}

function saveReviewLog(arr) {
  localStorage.setItem(REVIEW_KEY, JSON.stringify(arr));
}

function prettyCategory(cat) {
  return String(cat || "")
    .toLowerCase()
    .split(/\s+/)
    .map(w => w ? w[0].toUpperCase() + w.slice(1) : "")
    .join(" ");
}

function addToReviewLog(q, response) {
  const log = loadReviewLog();

  const id = `${q.category}||${q.question}||${q.answer}`;
  if (log.some(x => x.id === id)) return;

  log.unshift({
    id,
    category: prettyCategory(q.category),
    question: q.question,
    answer: q.answer,
    response: response || "(no response)",
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
      <div class="review-r"><strong>Your response:</strong> ${escapeHTML(item.response)}</div>
      <div class="review-a"><strong>Answer:</strong> ${escapeHTML(item.answer)}</div>
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
  el("game").style.display = "block";
}

/* ---------- Game ---------- */
async function startGame() {
  clearAllTimers();

  const level = document.querySelector('input[name="level"]:checked').value;
  const categories = Array.from(
    document.querySelectorAll('#setup input[type="checkbox"]:checked')
  ).map(cb => cb.value.toLowerCase());

  const res = await fetch(`${level}.csv?v=${Date.now()}`);
  const text = await res.text();
  const allQs = parseCSV(text);

  questionPool = categories.length
    ? allQs.filter(q => categories.includes(q.category.toLowerCase()))
    : allQs.slice();

  el("setup").style.display = "none";
  el("game").style.display = "block";

  nextQuestion();
}

function nextQuestion() {
  clearAllTimers();
  lastUserResponse = ""; // RESET unless explicitly saved
  hideTimer();

  currentQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];
  words = currentQuestion.question.split(" ");
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
    const delay = Math.max(50, Math.round(1000 / wordsPerSecond));
    readingTimeout = setTimeout(readNextWord, delay);
  } else {
    readingDone = true;
    startTimer(10);
  }
}

function onBuzz() {
  if (readingTimeout) clearTimeout(readingTimeout);
  if (!readingDone) startTimer(10);
  el("answer-box").style.display = "flex";
  el("answer").focus();
}

function submitAnswer() {
  lastUserResponse = el("answer").value.trim();
  showAnswer();
}

function showAnswer() {
  setMessage("Answer: " + currentQuestion.answer);
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

  timerInterval = setInterval(() => {
    timer--;
    el("timer").innerText = timer;
    if (timer <= 0) {
      clearAllTimers();
      showAnswer();
    }
  }, 1000);
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
