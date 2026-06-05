const fs = require('fs');

let content = fs.readFileSync('src/pages/TriageRoom.tsx', 'utf8');

content = content.replace(
  'className="bg-gradient-to-r from-[#006699] to-[#004466] rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-[#006699]/20 relative overflow-hidden group"',
  'className="bg-gradient-to-r from-[#006699] to-[#004466] rounded-2xl p-8 md:p-10 text-white shadow-2xl shadow-[#006699]/20 relative overflow-hidden group"'
);

fs.writeFileSync('src/pages/TriageRoom.tsx', content, 'utf8');
console.log("Replacement complete!");
