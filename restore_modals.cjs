const fs = require('fs');

const srcPath = 'C:/Users/Jhon/Desktop/upa_final/src/pages/PatientEvolution.tsx';
let lines = fs.readFileSync(srcPath, 'utf-8').split('\n');

const importIdx = lines.findIndex(l => l.includes('import { useVitals }'));
if (importIdx > -1) {
  lines.splice(importIdx, 0, "import { ModalsContainer } from './PatientEvolution/components/ModalsContainer';");
}

const startIdx = lines.findIndex(l => l.includes('<MorseModal'));
const endIdx = lines.findIndex(l => l.includes('</motion.div>')); // The last div before export default function PatientEvolution

if (startIdx > -1 && endIdx > -1) {
  const replacement = `      <ModalsContainer 
        modalsState={modalsState} 
        description={description} 
        setDescription={setDescription} 
        patient={patient} 
        updatePatient={updatePatient} 
      />`;
      
  // we want to keep </motion.div> which is at endIdx
  lines.splice(startIdx, endIdx - startIdx, replacement);
}

fs.writeFileSync(srcPath, lines.join('\n'));
console.log('Modals replaced successfully');
