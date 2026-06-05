const fs = require('fs');
const file = 'src/pages/TriageRoom.tsx';
let content = fs.readFileSync(file, 'utf8');

const weightComment = '{/* Peso - lado direito dos Sinais Vitais */}';
const esqComment = '{/* Coluna Esquerda: Medicamentos, Glasgow */}';
const wStart = content.indexOf(weightComment);
const wEnd = content.indexOf(esqComment);

if (wStart !== -1 && wEnd !== -1) {
    const divStart = content.lastIndexOf('<div className="lg:col-span-3">', wStart);
    if (divStart !== -1) {
        content = content.substring(0, divStart) + content.substring(wEnd);
    }
}

// Adjust padding and border radius
content = content.replace(
    '<div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-border shadow-soft space-y-8">',
    '<div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-soft space-y-6 relative overflow-hidden">'
);

// Adjust Textarea height
content = content.replace(
    'className="min-h-[140px] rounded-[1.5rem] border-none bg-muted/30 focus:bg-white focus:ring-4 focus:ring-[#006699]/5 transition-all text-sm font-medium p-5 shadow-inner"',
    'className="min-h-[80px] rounded-[1.5rem] border-none bg-muted/30 focus:bg-white focus:ring-4 focus:ring-[#006699]/5 transition-all text-sm font-medium p-5 shadow-inner"'
);

fs.writeFileSync(file, content);
