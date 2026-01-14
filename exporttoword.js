// === START exportToWord ===
 function exportToWord(){
  const date = dateInput.value;
  const gatheringType = gatheringTypeSelect.value;
  const key = date + "-" + gatheringType;

  let data = localStorage.getItem(key);
  if(!data) return;
  try { data = JSON.parse(data); } catch(e){ return; }

  // Convert yyyy-mm-dd → dd/mm/yyyy
  let dateParts = date.split("-");
  let formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

  // Build Word-compatible HTML
  let html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Export</title>
      <style>
        @page {
          margin: 1cm;
        }
        body {
          font-family: Tahoma;
          font-size: 12pt;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          font-family: Tahoma;
          font-size: 12pt;
        }
        th {
          background: #eee;
          text-align: center;
          font-weight: bold;
        }
        td {
          text-align: left;
          vertical-align: top;
        }
      </style>
    </head>
    <body>
      <h2 style="text-align:center;">${gatheringType} - ${formattedDate}</h2>
      <table border="1" cellspacing="0" cellpadding="5">
        <tr>
          <th>Bible Verse</th>
          <th>Notes</th>
        </tr>`;

  data.notes.forEach(note=>{
    html += `
        <tr>
          <td>${note.bibleVerse.replace(/\n/g,"<br>")}</td>
          <td>${note.note.replace(/\n/g,"<br>")}</td>
        </tr>`;
  });

  html += `
      </table>
    </body>
    </html>`;

  // Save as .doc
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${gatheringType} - ${formattedDate}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// === END exportToWord ===
