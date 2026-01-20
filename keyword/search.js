// Certamen Search (static, no server)
// Loads CSVs from ../certamengame/... and searches QUESTION + ANSWER case-insensitively.

const el = (id) => document.getElementById(id);

const STATE = {
  loaded: false,
  loading: false,
  items: [], // { level, category, question, answer, source }
  sourcesTried: []
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

  setStatus("Loading CSVs...");
  await loadAllCSVs();
  setStatus(`Loaded ${STATE.items.length} questions.`);
});

function clearUI() {
  el("query").value = "";
  el("results").innerHTML = "";
  setStatus(STATE.loaded ? `Loaded ${STATE.items.length} questions.` : "");
}

function runSearchFromUI() {
  if (!STATE.loaded) {
    setStatus("Still loading CSVs...");
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
    setStatus(`0 matches for "${keyword}".`);
    return;
  }

  // Keep it simple: limit rendering if someone does empty-query on huge data
  const MAX = 300;
  const trimmed = results.slice(0, MAX);

  setStatus(
    results.length === trimmed.length
      ? `${results.length} match(es) for "${keyword}".`
      : `${results.length} match(es) for "${keyword}". Showing first ${MAX}.`
  );

  container.innerHTML = trimmed.map((it) => {
    const metaBits = [
      `<span class="pill">${escapeHTML(String(it.category || ""))}</span>`,
      `<span class="pill">${escapeHTML(String(it.level || ""))}</span>`
    ];

    if (showSource) {
      metaBits.push(`<span class="pill">${escapeHTML(String(it.source || ""))}</span>`);
    }

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

/* ---------------- CSV Loading ---------------- */

async function loadAllCSVs() {
  if (STATE.loading) return;
  STATE.loading = true;

  // You can add more filenames here if you create more levels later.
  const files = [
    { level: "novice", names: ["novice.csv", "Novice.csv"] },
    { level: "intermediate", names: ["intermediate.csv", "Intermediate.csv"] },
    { level: "advanced", names: ["advanced.csv", "Advanced.csv"] }
  ];

  const baseCandidates = [
    "../certamengame/data/",
    "../certamengame/",
    "../certamengame/csv/",
    "../certamengame/questions/",
    "../certamengame/data/csv/"
  ];

  const loadedAny = [];

  for (const f of files) {
    const { text, usedPath } = await fetchFirstAvailableCSV(baseCandidates, f.names);
    if (!text) {
      loadedAny.push({ level: f.level, ok: false, usedPath: "" });
      continue;
    }

    const rows = parseCSV(text);
    const normalized = normalizeRows(rows);

    for (const r of normalized) {
      STATE.items.push({
        level: f.level,
        category: r.category,
        question: r.question,
        answer: r.answer,
        source: usedPath
      });
    }

    loadedAny.push({ level: f.level, ok: true, usedPath });
  }

  STATE.loaded = true;
  STATE.loading = false;

  const okCount = loadedAny.filter(x => x.ok).length;
  if (okCount === 0) {
    setStatus("Could not load any CSVs. Check paths: ../certamengame/data/novice.csv etc.");
  }
}

async function fetchFirstAvailableCSV(baseDirs, filenames) {
  let lastErr = null;

  for (const base of baseDirs) {
    for (const name of filenames) {
      const path = `${base}${name}`;
      try {
        const res = await fetch(`${path}?v=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const text = await res.text();
          return { text, usedPath: path };
        }
        lastErr = new Error(`HTTP ${res.status} for ${path}`);
      } catch (e) {
        lastErr = e;
      }
    }
  }

  console.warn("CSV not found. Last error:", lastErr);
  return { text: "", usedPath: "" };
}

/* ---------------- Robust CSV Parser ----------------
   - Handles commas in quotes
   - Handles doubled quotes "" inside quoted fields
   - Assumes no internal newlines in fields (your cleaned constraint), but still parses safely line-by-line.
----------------------------------------------------- */

function parseCSV(text) {
  const lines = String(text).replace(/\r/g, "").split("\n").filter((l) => l.length > 0);
  if (!lines.length) return [];

  // If there is a header, we skip it. If not, we still parse all lines and normalize later.
  // We detect header loosely by checking if the first row contains "category" and "question".
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
  // Expected columns: category, question, answer
  // If a CSV line has extra trailing columns, we ignore them.
  // If it has fewer, we fill with empty.
  return rows.map((cells) => {
    const category = (cells[0] || "").trim();
    const question = (cells[1] || "").trim();
    const answer = (cells[2] || "").trim();
    return { category, question, answer };
  }).filter(r => r.category || r.question || r.answer);
}
