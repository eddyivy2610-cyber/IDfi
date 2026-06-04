const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ProjectSupervision-1.xlsx');
try {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
  // Output just the first 3 rows to understand structure
  console.log("Headers/Structure:");
  console.log(JSON.stringify(data.slice(0, 3), null, 2));
  
  // Also output total count
  console.log(`Total rows: ${data.length}`);
} catch (err) {
  console.error("Error reading file:", err);
}
