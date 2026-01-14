// data-checker.js (drop-in replacement)
// Shows only dates that actually have notes; robust date handling + safe event listeners
(function () {
  const btn = document.getElementById("data-checker-btn");
  const resultsDiv = document.getElementById("data-checker-results");
  if (!btn || !resultsDiv) return;

  // Safely try to JSON.parse a value; return null on failure
  function safeParse(raw) {
    if (raw == null) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  // Accepts yyyy-mm-dd, dd/mm/yyyy, or JS date-like string; returns yyyy-mm-dd or null
  function normalizeDateToYMD(dateStr) {
    if (!dateStr) return null;
    dateStr = String(dateStr).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [dd, mm, yyyy] = dateStr.split("/");
      return `${yyyy}-${mm}-${dd}`;
    }
    // try Date parsing (handles "Sep 29 2025", "2025/09/29", etc.)
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return null;
  }

  function formatDateDMY(ymd) {
    if (!ymd) return "-";
    const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return ymd;
    return `${m[3]}/${m[2]}/${m[1]}`;
  }

  // Build the list when the button is clicked
  btn.addEventListener("click", () => {
    resultsDiv.innerHTML = "";
    const map = {}; // map[dateYMD] = { total: n, gatherings: {gType: count} }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const raw = localStorage.getItem(key);
      const parsed = safeParse(raw);
      if (!parsed) continue;

      // Determine notes array and candidate date / gatheringType
      let notes = null;
      let date = null;
      let gatheringType = null;

      if (Array.isArray(parsed)) {
        notes = parsed;
      } else if (Array.isArray(parsed.notes)) {
        notes = parsed.notes;
        date = parsed.date || null;
        gatheringType = parsed.gatheringType || null;
      } else {
        // maybe old format: object with numeric keys? skip
        continue;
      }

      if (!Array.isArray(notes) || notes.length === 0) continue;

      // try to salvage date/gatheringType from the first note if missing
      if (!date && notes[0] && notes[0].date) date = notes[0].date;
      if (!gatheringType && notes[0] && notes[0].gatheringType) gatheringType = notes[0].gatheringType;

      const normalized = normalizeDateToYMD(date);
      if (!normalized) {
        // can't make a valid date - skip this entry (prevents broken date inputs)
        continue;
      }

      const g = (gatheringType || "Unknown").toString().trim();
      if (!map[normalized]) map[normalized] = { total: 0, gatherings: {} };
      map[normalized].total += notes.length;
      map[normalized].gatherings[g] = (map[normalized].gatherings[g] || 0) + notes.length;
    }

   const dates = Object.keys(map).sort().reverse(); // newest first

    if (dates.length === 0) {
      resultsDiv.innerHTML = '<div class="muted">No saved notes found.</div>';
      return;
    }

    const ul = document.createElement("ul");
    ul.style.listStyle = "none";
    ul.style.padding = "0";
    ul.style.margin = "0";

    dates.forEach(date => {
      const item = document.createElement("li");
      item.style.marginBottom = "10px";

      const header = document.createElement("div");
      header.style.fontWeight = "600";
      header.textContent = `${formatDateDMY(date)} — ${map[date].total} note${map[date].total>1 ? "s" : ""}`;
      item.appendChild(header);

      const group = document.createElement("div");
      group.style.marginTop = "6px";

      Object.keys(map[date].gatherings).forEach(g => {
        const b = document.createElement("button");
        b.type = "button";
        b.style.marginRight = "8px";
        b.style.marginBottom = "6px";
        b.style.padding = "6px 8px";
        b.style.borderRadius = "6px";
        b.textContent = `${g} (${map[date].gatherings[g]})`;
        b.addEventListener("click", () => {
          // call the global helper (defined below)
          window.__mcgi_showNotesForDate(date, g);
        });
        group.appendChild(b);
      });

      item.appendChild(group);
      ul.appendChild(item);
    });

    resultsDiv.appendChild(ul);
  });

  // Expose a robust global helper that safely sets the date/gathering and loads notes
  window.__mcgi_showNotesForDate = function (dateYmd, gatheringType) {
    const dateInput = document.getElementById("date");
    const gatheringSelect = document.getElementById("gathering-type");

    const normalized = normalizeDateToYMD(dateYmd) || dateYmd;

    if (dateInput && normalized) {
      dateInput.value = normalized;
      // fire change event if you rely on onchange handlers
      dateInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (gatheringSelect && gatheringType) {
      // if the option exists, select it; otherwise add a temporary option and select it
      let found = false;
      for (let i = 0; i < gatheringSelect.options.length; i++) {
        if (gatheringSelect.options[i].value === gatheringType) {
          gatheringSelect.selectedIndex = i;
          found = true;
          break;
        }
      }
      if (!found) {
        const tmp = document.createElement("option");
        tmp.value = gatheringType;
        tmp.textContent = gatheringType;
        gatheringSelect.appendChild(tmp);
        gatheringSelect.value = gatheringType;
      }
      gatheringSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // finally refresh left pane and search
    if (typeof loadNotes === "function") loadNotes();
    if (typeof searchNotes === "function") searchNotes();
  };
})();
