// === START saveEdit ===
  function saveEdit(index){
    const date=dateInput.value;
    const gatheringType=gatheringTypeSelect.value;
    const key = date+"-"+gatheringType;
    let data=localStorage.getItem(key);
    if(!data) return;
    try { data=JSON.parse(data); } catch(e){ return; }

    // ✅ Get values from textareas (with newlines preserved)
    const verseText=document.getElementById(`edit-verse-${index}`).value;
    const noteText=document.getElementById(`edit-note-${index}`).value;

    data.notes[index].bibleVerse=verseText;
    data.notes[index].note=noteText;
    localStorage.setItem(key,JSON.stringify(data));
    loadNotes();
  }

 // === END saveEdit ===