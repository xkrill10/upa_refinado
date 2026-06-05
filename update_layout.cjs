const fs = require('fs');
const triagePath = 'c:/Users/Jhon/Desktop/upa_final/src/pages/TriageRoom.tsx';
const pediaPath = 'c:/Users/Jhon/Desktop/upa_final/src/pages/PediatriaRoom.tsx';

let tCode = fs.readFileSync(triagePath, 'utf8');
let pCode = fs.readFileSync(pediaPath, 'utf8');

const tStartMarker = '<div className=\"grid grid-cols-1 lg:grid-cols-12 gap-8\">';
const tEndMarker = '{/* Classificação Final */}';

let tStart = -1;
let currentIdx = 0;
while (true) {
    const idx = tCode.indexOf(tStartMarker, currentIdx);
    if (idx === -1) break;
    if (idx > 60000 && idx < 120000) {
        tStart = idx;
        break;
    }
    currentIdx = idx + 1;
}

const tEnd = tCode.indexOf(tEndMarker, tStart);

const pStartMarker = '<div className=\"grid grid-cols-1 lg:grid-cols-12 gap-4\">';
const pEndMarker = '{/* Classificação Final */}';

let pStart = -1;
currentIdx = 0;
while (true) {
    const idx = pCode.indexOf(pStartMarker, currentIdx);
    if (idx === -1) break;
    if (idx > 60000 && idx < 120000) {
        pStart = idx;
        break;
    }
    currentIdx = idx + 1;
}

const pEnd = pCode.indexOf(pEndMarker, pStart);

if (tStart !== -1 && tEnd !== -1 && pStart !== -1 && pEnd !== -1) {
    const tStartFull = tCode.lastIndexOf('\n', tStart) + 1;
    let pediaBlock = pCode.substring(pCode.lastIndexOf('\n', pStart) + 1, pCode.lastIndexOf('\n', pEnd) + 1);
    
    pediaBlock = pediaBlock.replace('className=\"lg:col-span-9\"', 'className=\"lg:col-span-12\"');
    pediaBlock = pediaBlock.replace('<div className=\"grid grid-cols-1 lg:grid-cols-12 gap-4\">', '<div className=\"grid grid-cols-1 lg:grid-cols-12 gap-8\">');
    
    // Cleanly remove the weight card
    const weightComment = '{/* Peso - lado direito dos Sinais Vitais */}';
    const esqComment = '{/* Coluna Esquerda: Medicamentos, Glasgow */}';
    const wStart = pediaBlock.indexOf(weightComment);
    const wEnd = pediaBlock.indexOf(esqComment);
    if (wStart !== -1 && wEnd !== -1) {
        pediaBlock = pediaBlock.substring(0, wStart) + pediaBlock.substring(wEnd);
    }
    
    pediaBlock = pediaBlock.replace(/#8b5cf6/g, '#006699');
    pediaBlock = pediaBlock.replace(/indigo/g, 'sky');
    
    const newTCode = tCode.substring(0, tStartFull) + pediaBlock + tCode.substring(tCode.lastIndexOf('\n', tEnd) + 1);
    fs.writeFileSync(triagePath, newTCode);
    console.log("SUCCESS!");
} else {
    console.log("FAILED TO FIND MARKERS:", {tStart, tEnd, pStart, pEnd});
}
