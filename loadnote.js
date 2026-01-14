// === START loadNotes ===
    function loadNotes(){
    const date=dateInput.value;
    const gatheringType=gatheringTypeSelect.value;
    const key = date && gatheringType ? (date+"-"+gatheringType) : null;

    notesBody.innerHTML="";

    if(!key){ document.getElementById("print-button").style.display="none"; return; }

    let data=localStorage.getItem(key);
    if(!data){ document.getElementById("print-button").style.display="none"; return; }

    try { data = JSON.parse(data); } catch(e){ data=null; }
    if(!data || !Array.isArray(data.notes) || data.notes.length===0){
      document.getElementById("print-button").style.display="none";
      return;
    }

    data.notes.forEach((note,index)=>{
      const row=document.createElement("tr");
      const verseHtml = nl2brSafe(note.bibleVerse || "");
      const noteHtml  = nl2brSafe(note.note || "");
      row.innerHTML=`
        <td class="verse-cell" id="bible-verse-${index}">${verseHtml}</td>
        <td id="note-${index}">${noteHtml}</td>
        <td>
          <button class="edit" id="edit-button-${index}" onclick="editNote(${index})">Edit</button>
          <button class="delete" onclick="deleteNote(${index})">Delete</button>
        </td>`;
      notesBody.appendChild(row);
    });
    document.getElementById("print-button").style.display="inline-block";
  }
function checkDateForNotes() {
  const date = dateInput.value;
  if (!date) return dateInput.classList.remove("date-has-notes");

  // Check all localStorage keys
  let hasNotes = false;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(date + "-")) {
      hasNotes = true;
      break;
    }
  }

  if (hasNotes) {
    dateInput.classList.add("date-has-notes");
  } else {
    dateInput.classList.remove("date-has-notes");
  }
}

// Run when the date changes
dateInput.addEventListener("change", checkDateForNotes);

// Also run after notes are loaded or saved
window.addEventListener("load", checkDateForNotes);
window.addEventListener("storage", checkDateForNotes);
// === END loadNotes ===