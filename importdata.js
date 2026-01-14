// === START ImportData ===
  function importData(){
    const input=document.createElement("input");
    input.type="file"; input.accept="application/json";
    input.onchange=function(e){
      const file=e.target.files[0]; const reader=new FileReader();
      reader.onload=function(e){
        let data;
        try { data=JSON.parse(e.target.result); } catch(err){ alert("Invalid JSON"); return; }
        for(let key in data){
          localStorage.setItem(key,data[key]);
        }
        loadNotes();
        searchNotes();
      }
      reader.readAsText(file);
    }
    input.click();
  }
// === End ImportData ===
