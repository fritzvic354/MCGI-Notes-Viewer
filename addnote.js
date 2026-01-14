// === START addNote ===
checkDateForNotes();
function addNote() {
  const date = dateInput.value;
  const gatheringType = gatheringTypeSelect.value;
  const bibleVerseEl = document.getElementById("bible-verse");
  const noteEl = document.getElementById("note");
  const bibleVerseRaw = bibleVerseEl.value.trim();
  const noteText = noteEl.value.trim();

  if (!date || !gatheringType || (!bibleVerseRaw && !noteText)) {
    alert("Please select date, gathering type, and enter a verse or note.");
    return;
  }

  // Split verses by newlines (ignore blank lines)
  const verses = bibleVerseRaw.split(/\n+/).map(v => v.trim()).filter(v => v);

  const key = `${date}-${gatheringType}`;
  let existingData = localStorage.getItem(key);
  try {
    existingData = existingData ? JSON.parse(existingData) : null;
  } catch (e) {
    existingData = null;
  }

  if (!existingData || typeof existingData !== "object") {
    existingData = { date, gatheringType, notes: [] };
  }
  if (!Array.isArray(existingData.notes)) existingData.notes = [];

  if (verses.length > 1) {
    if (confirm("You pasted multiple verses. Do you want to group them into one row with shared notes?")) {
      existingData.notes.push({ date, gatheringType, bibleVerse: verses.join("\n"), note: noteText });
    } else {
      verses.forEach(v => {
        existingData.notes.push({ date, gatheringType, bibleVerse: v, note: noteText });
      });
    }
  } else {
    existingData.notes.push({ date, gatheringType, bibleVerse: bibleVerseRaw, note: noteText });
  }

  // Save back
  localStorage.setItem(key, JSON.stringify(existingData));

  // ✅ Clear textareas after saving
  bibleVerseEl.value = "";
  noteEl.value = "";

  // Refresh display
  loadNotes();
  searchNotes();
}
// === END addNote ===
