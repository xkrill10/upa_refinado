const fs = require('fs');
let text = fs.readFileSync('C:/Users/Jhon/Desktop/upa_final/src/pages/PatientEvolution.tsx', 'utf-8');

const s1 = '  const [prescWizard, setPrescWizard] = useState({ medication: "", dosage: "", route: "", frequency: "" });';
const s2 = '  const [prescribedMedications, setPrescribedMedications] = useState<PrescriptionMedication[]>([]);';

text = text.replace(s1, '');
text = text.replace(s2, '');

fs.writeFileSync('C:/Users/Jhon/Desktop/upa_final/src/pages/PatientEvolution.tsx', text);
console.log('Fixed PatientEvolution prescWizard');
