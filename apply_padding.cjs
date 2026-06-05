const fs = require('fs');
const filePath = 'c:/Users/Jhon/Desktop/upa_final/src/pages/TriageRoom.tsx';
const backupPath = 'c:/Users/Jhon/Desktop/upa_final/src/pages/TriageRoom.backup.tsx';

// 1. Criar o ponto de restauração (backup exato)
fs.copyFileSync(filePath, backupPath);

// 2. Ler o arquivo atual
let content = fs.readFileSync(filePath, 'utf8');

// 3. Substituir APENAS a string exata do container da Classificação Final
const oldString = 'className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-border shadow-soft space-y-8"';
const newString = 'className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-soft space-y-6 relative overflow-hidden"';

content = content.replace(oldString, newString);

// 4. Salvar
fs.writeFileSync(filePath, content);
console.log('Feito e backup salvo!');
