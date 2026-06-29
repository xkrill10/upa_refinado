const fs = require('fs');
const path = require('path');

const apiPath = 'c:/Users/user/Desktop/Upa_100/src/api';
const importedDataPath = path.join(apiPath, 'importedData.js');

let data = fs.readFileSync(importedDataPath, 'utf8');

// Replace any occurrence of the role for Maria Eduarda. 
// We will look for "Maria Eduarda Spadini de Oliviera" (or Oliveira) and the "SUPERVIS..." role around it
// Actually, it's safer to just replace 'role: "SUPERVISǟO"' or 'role: "SUPERVISO"' or 'role: "SUPERVISÃO"'
// when it belongs to Maria Eduarda.
const regex = /(name:\s*["']Maria Eduarda Spadini de Oliv[i]?era["'],\s*role:\s*["'])SUPERVIS[^"']*?(["'])/gi;
let newData = data.replace(regex, "$1LIDERANÇA$2");

fs.writeFileSync(importedDataPath, newData, 'utf8');
console.log('Fixed importedData.js');

const dbClientPath = path.join(apiPath, 'dbClient.js');
let dbData = fs.readFileSync(dbClientPath, 'utf8');

// In dbClient.js, let's inject a small script at the end to patch localStorage directly so the user doesn't have to clear their data.
const patchCode = `
// PATCH: Force update Maria Eduarda's role to LIDERANÇA in LocalStorage if it's currently SUPERVISÃO
try {
  let stored = localStorage.getItem("escala_db_Employee");
  if (stored) {
    let parsed = JSON.parse(stored);
    let modified = false;
    for (let emp of parsed) {
      if (emp.name && emp.name.toLowerCase().includes("maria eduarda")) {
        if (emp.role !== "LIDERANÇA") {
          emp.role = "LIDERANÇA";
          modified = true;
        }
      }
    }
    if (modified) {
      localStorage.setItem("escala_db_Employee", JSON.stringify(parsed));
    }
  }
} catch (e) {}
`;

if (!dbData.includes("Force update Maria Eduarda's role")) {
  fs.writeFileSync(dbClientPath, dbData + patchCode, 'utf8');
  console.log('Patched dbClient.js');
} else {
  console.log('dbClient.js already patched');
}
