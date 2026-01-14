// === START editNote ===
  function editNote(index){
    const verseCell=document.getElementById(`bible-verse-${index}`);
    const noteCell=document.getElementById(`note-${index}`);
    const editBtn=document.getElementById(`edit-button-${index}`);

    // Convert current HTML (with <br>) to plain text for editing (newlines retained)
    const currentVerseText = verseCell.innerText;
    const currentNoteText  = noteCell.innerText;

    // ✅ Use <textarea> instead of contentEditable so newlines are preserved
    verseCell.innerHTML = `<textarea id="edit-verse-${index}" style="width:100%; height:60px;">${currentVerseText}</textarea>`;
    noteCell.innerHTML  = `<textarea id="edit-note-${index}" style="width:100%; height:60px;">${currentNoteText}</textarea>`;

    editBtn.innerText="Save";
    editBtn.onclick=function(){saveEdit(index);};
  }
// === END editNote ===
