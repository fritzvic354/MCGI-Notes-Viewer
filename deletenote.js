// === START deleteNote ===
checkDateForNotes();
  function deleteNote(index){
    if(!confirm("Are you sure you want to delete this note?")) return;
    const date=dateInput.value;
    const gatheringType=gatheringTypeSelect.value;
    const key = date+"-"+gatheringType;

    let data=localStorage.getItem(key);
    if(!data) return;
    try { data=JSON.parse(data); } catch(e){ return; }

    data.notes.splice(index,1);
    localStorage.setItem(key,JSON.stringify(data));
    loadNotes();
    searchNotes(); // refresh search view too
  }
// === END deleteNote ===