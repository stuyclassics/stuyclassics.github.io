const el = (id) => document.getElementById(id);

const STATE = {
  loaded: false,
  loading: false,
  items: [] // { level, category, question, answer, source }
};

document.addEventListener("DOMContentLoaded", async () => {
  el("search").addEventListener("click", runSearchFromUI);
  el("clear").addEventListener("click", clearUI);

  el("query").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearchFromUI();
    }
  });

  el("load-files").addEventListener("click", loadFromFilePicker);

  setStatus("Loading CSVs...");
  setHint("Trying to fetch CSVs from ../certamengame/data/ ...");

  const ok = await loadAllCSVsByFetch();

  if (ok) {
    STATE.loaded = true;
    setStatus(`Loaded ${STATE.items.length} questions.`);
    setHint("Ready.");
    return;
  }

  // Fetch failed: show file picker fallback
  STATE.loaded = false;
  setStatus("Could not fetch CSVs. Use the file picker below.");
  setHint('If you opened this with file://, fetch is blocked. Either run a local server OR use the fallback.');
  el("filebox").classList.add("visible");
});

function clearUI() {
  el("query").value = "";
  el("results").innerHTML = "";
  if (STATE.loaded) setStatus(`Loaded ${STATE.items.length} questions.`);
}

function runSearchFromUI() {
  if (!STATE.loaded) {
    setStatus("Not loaded yet. Use the file picker to load CSVs.");
    return;
  }

  const q = el("query").value.trim();
  const allowEmpty = el("show-empty-query").checked;

  if (!q && !allowEmpty) {
    setStatus("Type a keyword (or enable: Allow empty query).");
    el("results").innerHTML = "";
    return;
  }

  const results = searchItems(q);
  renderResults(results, q);
}

function setStatus(msg) {
  el("status").textContent = msg;
}

function setHint(msg) {
  el("hint").textContent = msg;
}

function searchItems(keyword) {
  const key = String(keyword || "").toLowerCase();
  if (!key) return STATE.items.slice();

  return STATE.items.filter((it) => {
    const q = (it.question || "").toLowerCase();
    const a = (it.answer || "").toLowerCase();
    return q.includes(key) || a.includes(key);
  });
}

function renderResults(results, keyword) {
  const showSource = el("show-source").checked;
  const container = el("results");

  if (!results.length) {
    container.innerHTML = `<div class="muted">No matches.</div>`;
    setStatus(keyword ? `0 matches for "${keyword}".` : "0 results.");
    return;
  }

  const MAX = 400;
  const trimmed = results.slice(0, MAX);

  setStatus(
    keyword
      ? (results.length === trimmed.length
          ? `${results.length} match(es) for "${keyword}".`
          : `${results.length} match(es) for "${keyword}". Showing first ${MAX}.`)
      : (results.length === trimmed.length
          ? `${results.length} result(s).`
          : `${results.length} result(s). Showing first ${MAX}.`)
  );

  container.innerHTML = trimmed.map((it) => {
    const metaBits = [
      `<span class="pill">${escapeHTML(String(it.category || ""))}</span>`,
      `<span class="pill">${escapeHTML(String(it.level || ""))}</span>`
    ];

    if (showSource) metaBits.push(`<span class="pill">${escapeHTML(String(it.source || ""))}</span>`);

    return `
      <div class="result">
        <div class="meta">${metaBits.join("")}</div>
        <div class="qa">
          <div class="q"><strong>Q:</strong> ${escapeHTML(String(it.question || ""))}</div>
          <div class="a"><strong>A:</strong> ${escapeHTML(String(it.answer || ""))}</div>
        </div>
      </div>
    `;
  }).join("");
}

function escapeHTML(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ---------------- Fetch loading ---------------- */

async function loadAllCSVsByFetch() {
  if (STATE.loading) return false;
  STATE.loading = true;
  STATE.items = [];

  const files = [
    { level: "novice", names: ["novice.csv", "Novice.csv"] },
    { level: "intermediate", names: ["intermediate.csv", "Intermediate.csv"] },
    { level: "advanced", names: ["advanced.csv", "Advanced.csv"] }
  ];

  const baseCandidates = [
    "../certamengame/data/",
    "../certamengame/"
  ];

  let loadedCount = 0;

  for (const f of files) {
    const found = await fetchFirstAvailableCSV(baseCandidates, f.names);
    if (!found.text) continue;

    const rows = parseCSV(found.text);
    const normalized = normalizeRows(rows);

    for (const r of normalized) {
      STATE.items.push({
        level: f.level,
        category: r.category,
        question: r.question,
        answer: r.answer,
        source: found.usedPath
      });
    }

    loadedCount++;
  }

  STATE.loading = false;

  // If nothing loaded, treat as failure
  return loadedCount > 0;
}

async function fetchFirstAvailableCSV(baseDirs, filenames) {
  for (const base of baseDirs) {
    for (const name of filenames) {
      const path = `${base}${name}`;
      try {
        const res = await fetch(`${path}?v=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          return { text: await res.text(), usedPath: path };
        }
      } catch {
        // ignore and keep trying
      }
    }
  }
  return { text: "", usedPath: "" };
}

/* ---------------- File picker fallback ---------------- */

async function loadFromFilePicker() {
  const input = el("csvfiles");
  if (!input.files || input.files.length === 0) {
    setStatus("Pick one or more CSV files first.");
    return;
  }

  STATE.items = [];

  const files = Array.from(input.files);
  let totalRows = 0;

  for (const file of files) {
    const text = await readFileAsText(file);
    const rows = parseCSV(text);
    const normalized = normalizeRows(rows);

    const level = guessLevelFromFilename(file.name);
    for (const r of normalized) {
      STATE.items.push({
        level,
        category: r.category,
        question: r.question,
        answer: r.answer,
        source: file.name
      });
      totalRows++;
    }
  }

  STATE.loaded = true;
  setStatus(`Loaded ${STATE.items.length} questions from selected files.`);
  setHint("Ready.");
  el("results").innerHTML = "";
}

function guessLevelFromFilename(name) {
  const n = String(name || "").toLowerCase();
  if (n.includes("novice")) return "novice";
  if (n.includes("intermediate")) return "intermediate";
  if (n.includes("advanced")) return "advanced";
  return "unknown";
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result || ""));
    fr.onerror = () => reject(fr.error);
    fr.readAsText(file);
  });
}

/* ---------------- Robust CSV parser ----------------
   Handles:
   - commas inside quotes
   - doubled quotes "" inside quoted fields
   Assumes:
   - no internal newlines in fields (your cleaned constraint)
----------------------------------------------------- */

function parseCSV(text) {
  const lines = String(text).replace(/\r/g, "").split("\n").filter((l) => l.length > 0);
  if (!lines.length) return [];

  const firstRow = parseCSVLine(lines[0]);
  const hasHeader = looksLikeHeader(firstRow);

  const out = [];
  const start = hasHeader ? 1 : 0;

  for (let i = start; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length === 0) continue;
    out.push(row);
  }

  return out;
}

function looksLikeHeader(cells) {
  const joined = cells.map(c => String(c || "").toLowerCase().trim());
  const hasCategory = joined.some(x => x === "category");
  const hasQuestion = joined.some(x => x === "question");
  const hasAnswer = joined.some(x => x === "answer");
  return hasCategory && hasQuestion && hasAnswer;
}

function parseCSVLine(line) {
  const cells = [];
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
      continue;
    }

    if (ch === "," && !inQuotes) {
      cells.push(cur);
      cur = "";
      continue;
    }

    cur += ch;
  }

  cells.push(cur);
  return cells;
}

function normalizeRows(rows) {
  return rows.map((cells) => {
    const category = (cells[0] || "").trim();
    const question = (cells[1] || "").trim();
    const answer = (cells[2] || "").trim();
    return { category, question, answer };
  }).filter(r => r.category || r.question || r.answer);
}
