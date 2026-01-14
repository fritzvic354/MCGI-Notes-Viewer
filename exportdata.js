// === START exportData ===
  function exportData(){
    let data={};
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      data[k]=localStorage.getItem(k);
    }
    const blob=new Blob([JSON.stringify(data)],{type:"application/json"});
    const link=document.createElement("a");
    link.href=URL.createObjectURL(blob);
    link.download="data.json"; link.click();
  }

// === END exportData ===
