const fs = require('fs');

const srcPath = 'C:/Users/Jhon/Desktop/upa_final/src/pages/PatientEvolution.tsx';
let lines = fs.readFileSync(srcPath, 'utf-8').split('\n');

// 1. Add Imports
const importModalsIdx = lines.findIndex(l => l.includes('import { useModalsState }'));
if (importModalsIdx > -1) {
  lines.splice(importModalsIdx, 0, 
    "import { useVitals } from './PatientEvolution/hooks/useVitals';",
    "import { EvolutionFormPanel } from './PatientEvolution/components/EvolutionFormPanel';"
  );
}

// 2. Add useVitals initialization
const initIdx = lines.findIndex(l => l.includes('const modalsState = useModalsState();'));
if (initIdx > -1) {
  lines.splice(initIdx, 0, 
    "  const { vitals, handleVitalsChange, clearVitals } = useVitals();",
    "  const applyTemplate = (template: string) => {",
    "    setDescription(template);",
    "  };"
  );
}

// 3. Remove raw vitals state (lines like const [vsBloodPressure, setVsBloodPressure] = useState("");)
const v1 = lines.findIndex(l => l.includes('const [vsBloodPressure, setVsBloodPressure] = useState("");'));
const v2 = lines.findIndex(l => l.includes('const [vsConsciousness, setVsConsciousness] = useState("A");'));
if (v1 > -1 && v2 > -1) {
  lines.splice(v1, v2 - v1 + 1);
}

// Re-write file
fs.writeFileSync(srcPath, lines.join('\n'));
console.log('Restored Phase 1!');
