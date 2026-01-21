const el = (id) => document.getElementById(id);

const STATE = {
  loaded: false,
  items: [] // { level, category, question, answer }
};

document.addEventListener("DOMContentLoaded", async () => {
  el("search").addEventListener("click", runSearch);
  el("clear").addEventListener("click", clearUI);

  el("query").addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });

  await loadAllCSVs();
  populateCategoryFilter();
  setStatus(`Loaded ${STATE.items.length} questions.`);
});

function setStatus(msg) {
  el("status").textContent = msg;
}

function clearUI() {
  el("query").value = "";
  el("level-filter").value = "";
  el("category-filter").value = "";
  el("results").innerHTML = "";
  setStatus(`Loaded ${STATE.items.length} questions.`);
}

function runSearch() {
  const keyword = el("query").value.trim().toLowerCase();
  const level = el("level-filter").value;
  const category = el("category-filter").value;

  const results = STATE.items.filter(item => {
    if (level && item.level !== level) return false;
    if (category && item.category !== category) return false;
    if (!keyword) return true;

    return (
      item.question.toLowerCase().includes(keyword) ||
      item.answer.toLowerCase().includes(keyword)
    );
  });

  renderResults(results);
  setStatus(`${results.length} result(s).`);
}

function renderResults(results) {
  const box = el("results");

  if (!results.length) {
    box.innerHTML = "<div>No matches.</div>";
    return;
  }

  box.innerHTML = results.map(r => `
    <div class="result">
      <div class="meta">
        <span class="pill">${escapeHTML(r.category)}</span>
        <span class="pill">${escapeHTML(r.level)}</span>
      </div>
      <div class="qa">
        <div><strong>Q:</strong> ${escapeHTML(r.question)}</div>
        <div><strong>A:</strong> ${escapeHTML(r.answer)}</div>
      </div>
    </div>
  `).join("");
}

function populateCategoryFilter() {
  const sel = el("category-filter");
  const cats = [...new Set(STATE.items.map(i => i.category))].sort();
  for (const c of cats) {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c.toUpperCase();
    sel.appendChild(opt);
  }
}

/* ---------- CSV loading ---------- */

async function loadAllCSVs() {
  const levels = ["novice", "intermediate", "advanced"];

  for (const lvl of levels) {
    const res = await fetch(`../certamengame/data/${lvl}.csv`);
    if (!res.ok) continue;

    const text = await res.text();
    const rows = parseCSV(text);

    for (const r of rows) {
      STATE.items.push({
        level: lvl,
        category: r.category.toLowerCase(),
        question: r.question,
        answer: r.answer
      });
    }
  }

  STATE.loaded = true;
}

/* ---------- CSV parser ---------- */

function parseCSV(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = [];
    let cur = "";
    let inQuotes = false;

    for (let j = 0; j < lines[i].length; j++) {
      const ch = lines[i][j];
      if (ch === '"') {
        if (inQuotes && lines[i][j + 1] === '"') {
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

function escapeHTML(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
