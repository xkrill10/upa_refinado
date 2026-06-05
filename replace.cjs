const fs = require('fs');

let content = fs.readFileSync('src/pages/TriageRoom.tsx', 'utf8');

// Replace the roundness of the main container (line 2263 approx)
content = content.replace(
  'className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-border shadow-soft space-y-8"',
  'className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-soft space-y-6"'
);

// Remove the "Solicitar Exames" button
const btnRegex = /<Button\s+variant="outline"\s+onClick=\{\(\) => setIsExamsModalOpen\(true\)\}[\s\S]*?Solicitar Exames\s+<\/Button>/;
content = content.replace(btnRegex, '');

fs.writeFileSync('src/pages/TriageRoom.tsx', content, 'utf8');
console.log("Replacement complete!");
