const fs = require('fs');
const triagePath = 'c:/Users/Jhon/Desktop/upa_final/src/pages/TriageRoom.tsx';
let tCode = fs.readFileSync(triagePath, 'utf8');
const tStartMarker = '<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">';
let tStart = -1;
let currentIdx = 0;
while (true) {
    const idx = tCode.indexOf(tStartMarker, currentIdx);
    if (idx === -1) break;
    if (idx > 60000 && idx < 150000) {
        tStart = idx;
        break;
    }
    currentIdx = idx + 1;
}
console.log({tStart});
