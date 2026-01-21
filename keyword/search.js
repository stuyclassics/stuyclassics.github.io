const el = (id) => document.getElementById(id);

const STATE = {
  loaded: false,
  items: [],       // { level, categoryKey, categoryLabel, question, answer, source }
  categories: []   // { key, label }
};

document.addEventListener("DOMContentLoaded", async () => {
  el("clear").addEventListener("click", clearFilters);
  el("load-files").addEventListener("click", loadFromFilePicker);

  el("query").addEventListener("input", applyFilters);
  el("level-filter").addEventListener("change", applyFilters);
  el("category-filter").addEventListener("change", applyFilters);
  el("show-source").addEventListener("change", applyFilters);

  setStatus("Loading all questions...");
  setHint("Trying ../certamengame/data/novice.csv, intermediate.csv, advanced.csv ...");

  const ok = await loadAllCSVsByFetch();

  if (!ok) {
    setStatus("Could not fetch CSVs. Use the file picker below to load all questions.");
    setHint("If you opened this with file://, fetch is blocked in most browsers.");
    el("filebox").classList.add("visible");
    return;
  }

  finalizeLoadedState();
});

function setStatus(msg) {
  el("status").textContent = msg;
}

function setHint(msg) {
  el("hint").textContent = msg;
}

function clearFilters() {
  el("query").value = "";
  el("level-filter").value = "";
  el("category-filter").value = "";
  el("show-source").checked = false;
  applyFilters();
}

function finalizeLoadedState() {
  STATE.loaded = true;
  buildCategories();
  populateCategoryDropdown();
  setStatus(`Loaded ${STATE.items.length} questions. Showing all (filters optional).`);
  setHint("Ready.");
  applyFilters(); // show everything by default
}

/* ---------------- Filtering ---------------- */

function applyFilters() {
  if (!STATE.loaded) return;

  const keywordRaw = el("query").value.trim();
  const keyword = keywordRaw.toLowerCase();
  const level = el("level-filter").value.trim().toLowerCase();
  const categoryKey = el("category-filter").value.trim().toLowerCase();
  const showSource = el("show-source").checked;

  const results = STATE.items.filter((it) => {
    if (level && it.level !== level) return false;
    if (categoryKey && it.categoryKey !== categoryKey) return false;

    if (!keyword) return true;

    const q = (it.question || "").toLowerCase();
    const a = (it.answer || "").toLowerCase();
    return q.includes(keyword) || a.includes(keyword);
  });

  renderResults(results, showSource);
  setStatus(`Loaded ${STATE.items.length}. Showing ${results.length} result(s).`);
}

function renderResults(results, showSource) {
  const container = el("results");

  if (!results.length) {
    container.innerHTML = `<div class="result">No matches.</div>`;
    return;
  }

  const MAX = 400;
  const trimmed = results.slice(0, MAX);

  container.innerHTML = trimmed.map((it) => {
    const pills = [
      `<span class="pill">${escapeHTML(it.categoryLabel)}</span>`,
      `<span class="pill">${escapeHTML(it.level)}</span>`
    ];

    if (showSource) pills.push(`<span class="pill">${escapeHTML(it.source)}</span>`);

    return `
      <div class="result">
        <div class="meta">${pills.join("")}</div>
        <div class="qa">
          <div><strong>Q:</strong> ${escapeHTML(it.question)}</div>
          <div><strong>A:</strong> ${escapeHTML(it.answer)}</div>
        </div>
      </div>
    `;
  }).join("");

  if (results.length > MAX) {
    container.innerHTML += `
      <div class="result">
        Showing first ${MAX} of ${results.length} results. Add filters to narrow.
      </div>
    `;
  }
}

function escapeHTML(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ---------------- Category dropdown (fixed) ---------------- */

function canonicalCategoryKey(cat) {
  return String(cat || "").trim().toLowerCase();
}

function displayCategory(cat) {
  const c = String(cat || "").trim();
  if (!c) return "UNKNOWN";
  return c.toUpperCase();
}

function buildCategories() {
  const map = new Map(); // key -> label
  for (const it of STATE.items) {
    if (!map.has(it.categoryKey)) map.set(it.categoryKey, it.categoryLabel);
  }
  const cats = Array.from(map.entries())
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label));

  STATE.categories = cats;
}

function populateCategoryDropdown() {
  const sel = el("category-filter");
  while (sel.firstChild) sel.removeChild(sel.firstChild);

  const allOpt = document.createElement("option");
  allOpt.value = "";
  allOpt.textContent = "All Categories";
  sel.appendChild(allOpt);

  for (const c of STATE.categories) {
    const opt = document.createElement("option");
    opt.value = c.key;         // filter uses canonical key
    opt.textContent = c.label; // display is uppercased
    sel.appendChild(opt);
  }
}

/* ---------------- CSV loading (fetch) ---------------- */

async function loadAllCSVsByFetch() {
  STATE.items = [];

  // Always attempt all three, independently. Load everything that exists.
  const levels = [
    { level: "novice", names: ["novice.csv", "Novice.csv"] },
    { level: "intermediate", names: ["intermediate.csv", "Intermediate.csv"] },
    { level: "advanced", names: ["advanced.csv", "Advanced.csv"] }
  ];

  const baseDirs = [
    "../certamengame/data/",
    "../certamengame/"
  ];

  let loadedAny = false;

  for (const lvl of levels) {
    const found = await fetchFirstAvailableCSV(baseDirs, lvl.names);
    if (!found.text) continue;

    loadedAny = true;

    const rows = parseCSV(found.text);
    const normalized = normalizeRows(rows);

    for (const r of normalized) {
      const key = canonicalCategoryKey(r.category);
      const label = displayCategory(r.category);

      STATE.items.push({
        level: lvl.level,
        categoryKey: key || "unknown",
        categoryLabel: label,
        question: r.question,
        answer: r.answer,
        source: found.usedPath
      });
    }
  }

  return loadedAny;
}

async function fetchFirstAvailableCSV(baseDirs, filenames) {
  for (const base of baseDirs) {
    for (const name of filenames) {
      const path = `${base}${name}`;
      try {
        const res = await fetch(`${path}?v=${Date.now()}`, { cache: "no-store" });
        if (res.ok) return { text: await res.text(), usedPath: path };
      } catch {
        // keep trying
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

  for (const file of files) {
    const text = await readFileAsText(file);
    const rows = parseCSV(text);
    const normalized = normalizeRows(rows);

    const level = guessLevelFromFilename(file.name);

    for (const r of normalized) {
      const key = canonicalCategoryKey(r.category);
      const label = displayCategory(r.category);

      STATE.items.push({
        level,
        categoryKey: key || "unknown",
        categoryLabel: label,
        question: r.question,
        answer: r.answer,
        source: file.name
      });
    }
  }

  finalizeLoadedState();
  el("filebox").classList.remove("visible");
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

/* ---------------- Robust CSV parsing ----------------
   - Handles commas inside quotes
   - Handles doubled quotes "" inside quoted fields
   - Assumes no internal newlines in fields (your "cleaned" constraint)
   - Detects header row if present
----------------------------------------------------- */

function parseCSV(text) {
  const lines = String(text).replace(/\r/g, "").split("\n").filter((l) => l.length > 0);
  if (!lines.length) return [];

  const first = parseCSVLine(lines[0]);
  const start = looksLikeHeader(first) ? 1 : 0;

  const out = [];
  for (let i = start; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length) out.push(row);
  }
  return out;
}

function looksLikeHeader(cells) {
  const joined = cells.map(c => String(c || "").toLowerCase().trim());
  return joined.includes("category") && joined.includes("question") && joined.includes("answer");
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
    return {
      category: (cells[0] || "").trim(),
      question: (cells[1] || "").trim(),
      answer: (cells[2] || "").trim()
    };
  }).filter(r => r.category || r.question || r.answer);
}
