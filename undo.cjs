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
fs.writeFileSync(file, content);
