let questionPool = [];
let currentQuestion = null;
let words = [];
let wordIndex = 0;
let timer = 10;  // 10-second answer window
let timerInterval = null;
let readingTimeout = null;
let readingDone = false;

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
  setMessage("");
}

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

    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";

    nextQuestion();
  } catch (e) {
    console.error(e);
    setMessage("Couldn't load questions.");
  }
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
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
  readingDone = false;

  document.getElementById("question-box").innerText = "";
  document.getElementById("answer").value = "";
  document.getElementById("answer-box").style.display = "none";
  setMessage("");

  readNextWord();
}

function readNextWord() {
  if (wordIndex < words.length) {
    document.getElementById("question-box").innerText += words[wordIndex] + " ";
    wordIndex++;
    readingTimeout = setTimeout(readNextWord, 700);
  } else {
    readingDone = true;
    startTimer(10); // start 10s timer after reading finishes
  }
}

function onBuzz() {
  if (readingTimeout) clearTimeout(readingTimeout);
  if (!readingDone) {
    startTimer(10); // start timer immediately if buzzing early
  }
  document.getElementById("answer-box").style.display = "block";
  document.getElementById("answer").focus();
}

function submitAnswer() {
  showAnswer();
}

function showAnswer() {
  const correct = (currentQuestion.answer || "").trim();
  setMessage("Answer: " + correct);
  document.getElementById("answer-box").style.display = "none";
  setTimeout(nextQuestion, 2000);
}

function startTimer(seconds) {
  if (timerInterval) return; 
  timer = seconds;
  timerInterval = setInterval(() => {
    timer--;
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

function setMessage(msg) {
  document.getElementById("message").innerText = msg;
}
