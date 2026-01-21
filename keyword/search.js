// Certamen Search
// Loads all CSVs on page load and renders everything immediately.
// Keyword, category, and difficulty filters are optional.

const el = (id) => document.getElementById(id);

const STATE = {
  loaded: false,
  items: [] // { level, category, question, answer, source }
};

document.addEventListener("DOMContentLoaded", async () => {
  el("search").addEventListener("click", runSearch);
  el("clear").addEventListener("click", clearUI);

  el("query").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch();
    }
  });

  el("filter-category").addEventListener("change", runSearch);
  el("filter-level").addEventListener("change", runSearch);

  setStatus("Loading CSVs...");
  await loadAllCSVs();

  STATE.loaded = true;
  setStatus(`Loaded ${STATE.items.length} questions.`);
  runSearch(); // show everything immediately
});

function clearUI() {
  el("query").value = "";
  el("filter-category").value = "";
  el("filter-level").value = "";
  runSearch();
}

function runSearch() {
  if (!STATE.loaded) return;

  const keyword = el("query").value.trim().toLowerCase();
  const category = el("filter-category").value;
  const level = el("filter-level").value;

  const results = STATE.items.filter((it) => {
    if (category && it.category !== category) return false;
    if (level && it.level !== level) return false;

    if (!keyword) return true;

    return (
      it.question.toLowerCase().includes(keyword) ||
      it.answer.toLowerCase().includes(keyword)
    );
  });

  renderResults(results);
}

function renderResults(results) {
  const container = el("results");
  const showSource = el("show-source").checked;

  if (!results.length) {
    container.innerHTML = `<div class="muted">No matches.</div>`;
    setStatus("0 matches");
    return;
  }

  setStatus(`${results.length} match(es)`);

  container.innerHTML = results.slice(0, 300).map((it) => `
    <div class="result">
      <div class="meta">
        <span class="pill">${escapeHTML(it.category)}</span>
        <span class="pill">${escapeHTML(it.level)}</span>
        ${showSource ? `<span class="pill">${escapeHTML(it.source)}</span>` : ""}
      </div>
      <div class="qa">
        <div class="q"><strong>Q:</strong> ${escapeHTML(it.question)}</div>
        <div class="a"><strong>A:</strong> ${escapeHTML(it.answer)}</div>
      </div>
    </div>
  `).join("");
}

function setStatus(msg) {
  el("status").textContent = msg;
}

function escapeHTML(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ---------- CSV LOADING ---------- */

async function loadAllCSVs() {
  const files = [
    { level: "novice", names: ["novice.csv", "Novice.csv"] },
    { level: "intermediate", names: ["intermediate.csv", "Intermediate.csv"] },
    { level: "advanced", names: ["advanced.csv", "Advanced.csv"] }
  ];

  const bases = [
    "../certamengame/data/",
    "../certamengame/",
    "../certamengame/csv/"
  ];

  for (const f of files) {
    const { text, usedPath } = await fetchCSV(bases, f.names);
    if (!text) continue;

    const rows = parseCSV(text);
    for (const r of rows) {
      STATE.items.push({
        level: f.level,
        category: r.category,
        question: r.question,
        answer: r.answer,
        source: usedPath
      });
    }
  }
}

async function fetchCSV(bases, names) {
  for (const base of bases) {
    for (const name of names) {
      const path = base + name;
      try {
        const res = await fetch(`${path}?v=${Date.now()}`, { cache: "no-store" });
        if (res.ok) return { text: await res.text(), usedPath: path };
      } catch {}
    }
  }
  return { text: "", usedPath: "" };
}

/* ---------- CSV PARSING ---------- */

function parseCSV(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  const rows = [];

  const start = looksLikeHeader(lines[0]) ? 1 : 0;

  for (let i = start; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);
    rows.push({
      category: (cells[0] || "").trim().toLowerCase(),
      question: (cells[1] || "").trim(),
      answer: (cells[2] || "").trim()
    });
  }

  return rows.filter(r => r.category || r.question || r.answer);
}

function looksLikeHeader(line) {
  const l = line.toLowerCase();
  return l.includes("category") && l.includes("question") && l.includes("answer");
}

function parseCSVLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }

  out.push(cur);
  return out;
}
