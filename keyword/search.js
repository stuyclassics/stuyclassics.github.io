// Certamen Search (static, no server)
// Loads CSVs from ../certamengame/... and searches QUESTION + ANSWER case-insensitively.
// Adds filters: Category + Level.

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

  // Re-run search when filters change (if those elements exist)
  if (el("filter-category")) el("filter-category").addEventListener("change", runSearchFromUI);
  if (el("filter-level")) el("filter-level").addEventListener("change", runSearchFromUI);

  setStatus("Loading CSVs...");
  await loadAllCSVs();

  // Populate filter dropdowns after load (if present)
  populateFilters();

  setStatus(`Loaded ${STATE.items.length} questions.`);
});

function clearUI() {
  el("query").value = "";
  el("results").innerHTML = "";

  if (el("filter-category")) el("filter-category").value = "";
  if (el("filter-level")) el("filter-level").value = "";

  setStatus(STATE.loaded ? `Loaded ${STATE.items.length} questions.` : "");
}

function runSearchFromUI() {
  if (!STATE.loaded) {
    setStatus("Still loading CSVs...");
    return;
  }

  const q = el("query").value.trim();
  const allowEmpty = el("show-empty-query") ? el("show-empty-query").checked : true;

  if (!q && !allowEmpty) {
    setStatus("Type a keyword (or enable: Allow empty query).");
    el("results").innerHTML = "";
    return;
  }

  const filters = getFiltersFromUI();
  const results = searchItems(q, filters);
  renderResults(results, q, filters);
}

function getFiltersFromUI() {
  const category = (el("filter-category") ? el("filter-category").value : "").trim().toLowerCase();
  const level = (el("filter-level") ? el("filter-level").value : "").trim().toLowerCase();
  return { category, level };
}

function setStatus(msg) {
  el("status").textContent = msg;
}

function searchItems(keyword, filters) {
  const key = String(keyword || "").toLowerCase();
  const wantCat = String(filters.category || "").toLowerCase();
  const wantLvl = String(filters.level || "").toLowerCase();

  return STATE.items.filter((it) => {
    // category filter
    if (wantCat && String(it.category || "").toLowerCase() !== wantCat) return false;

    // level filter
    if (wantLvl && String(it.level || "").toLowerCase() !== wantLvl) return false;

    // keyword search (question + answer)
    if (!key) return true;

    const q = (it.question || "").toLowerCase();
    const a = (it.answer || "").toLowerCase();
    return q.includes(key) || a.includes(key);
  });
}

function renderResults(results, keyword, filters) {
  const showSource = el("show-source") ? el("show-source").checked : false;
  const container = el("results");

  const keyShown = keyword || "";
  const parts = [];

  if (filters.category) parts.push(`category=${filters.category}`);
  if (filters.level) parts.push(`level=${filters.level}`);

  const filterText = parts.length ? ` (${parts.join(", ")})` : "";

  if (!results.length) {
    container.innerHTML = `<div class="muted">No matches.</div>`;
    setStatus(`0 matches for "${keyShown}"${filterText}.`);
    return;
  }

  const MAX = 300;
  const trimmed = results.slice(0, MAX);

  setStatus(
    results.length === trimmed.length
      ? `${results.length} match(es) for "${keyShown}"${filterText}.`
      : `${results.length} match(es) for "${keyShown}"${filterText}. Showing first ${MAX}.`
  );

  container.innerHTML = trimmed
    .map((it) => {
      const metaBits = [
        `<span class="pill">${escapeHTML(String(it.category || "").toLowerCase())}</span>`,
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
    })
    .join("");
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

  for (const f of files) {
    const { text, usedPath } = await fetchFirstAvailableCSV(baseCandidates, f.names);
    if (!text) continue;

    const rows = parseCSV(text);
    const normalized = normalizeRows(rows);

    for (const r of normalized) {
      STATE.items.push({
        level: f.level, // novice/intermediate/advanced
        category: r.category, // history/mythology/culture/language/literature (forced lowercase)
        question: r.question,
        answer: r.answer,
        source: usedPath
      });
    }
  }

  STATE.loaded = true;
  STATE.loading = false;

  if (STATE.items.length === 0) {
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

/* ---------------- Robust CSV Parser ---------------- */

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
  const joined = cells.map((c) => String(c || "").toLowerCase().trim());
  const hasCategory = joined.some((x) => x === "category");
  const hasQuestion = joined.some((x) => x === "question");
  const hasAnswer = joined.some((x) => x === "answer");
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
  // Force category to lowercase so filters are consistent.
  return rows
    .map((cells) => {
      const category = (cells[0] || "").trim().toLowerCase();
      const question = (cells[1] || "").trim();
      const answer = (cells[2] || "").trim();
      return { category, question, answer };
    })
    .filter((r) => r.category || r.question || r.answer);
}

/* ---------------- Filter dropdowns ---------------- */

function populateFilters() {
  // Only run if the dropdowns exist in your HTML
  const catSel = el("filter-category");
  const lvlSel = el("filter-level");
  if (!catSel && !lvlSel) return;

  // Categories: fixed set you want
  const fixedCats = ["history", "mythology", "culture", "language", "literature"];

  if (catSel) {
    catSel.innerHTML =
      `<option value="">All Categories</option>` +
      fixedCats.map((c) => `<option value="${escapeHTML(c)}">${escapeHTML(capitalize(c))}</option>`).join("");
  }

  if (lvlSel) {
    lvlSel.innerHTML =
      `<option value="">All Levels</option>` +
      ["novice", "intermediate", "advanced"]
        .map((l) => `<option value="${escapeHTML(l)}">${escapeHTML(capitalize(l))}</option>`)
        .join("");
  }
}

function capitalize(s) {
  s = String(s || "");
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
