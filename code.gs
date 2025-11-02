// NOM DU FICHIER : Code.gs

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('MEMO')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getTasks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Taches");
  const data = sheet.getDataRange().getValues();
  data.shift(); // retire l'en-tête

  return data.map(r => ({
    id: r[0],
    tache: r[1],
    date: r[2] || ""
  }));
}

function addTask(tache) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Taches");
  const lastRow = sheet.getLastRow();
  const newId = lastRow >= 2 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;

  const today = new Date();
  const day = String(today.getDate()).padStart(2,"0");
  const month = String(today.getMonth()+1).padStart(2,"0");
  const dateStr = `${day}/${month}`;

  sheet.appendRow([newId, tache, dateStr]);
  return { ok: true };
}

function deleteTask(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Taches");
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == id) {
      sheet.deleteRow(i+1);
      return { ok: true };
    }
  }
  return { ok: false, error: "id not found" };
}
