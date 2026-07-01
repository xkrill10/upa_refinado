const fs = require('fs');

const replacements = {
  'src/pages/PerfilPsicologia.tsx': '<Brain className="h-3.5 w-3.5" />',
  'src/pages/PerfilNutricao.tsx': '<Apple className="h-3.5 w-3.5" />',
  'src/pages/PerfilFisioterapia.tsx': '<Bone className="h-3.5 w-3.5" />',
  'src/pages/PerfilServicoSocial.tsx': '<HeartHandshake className="h-3.5 w-3.5" />',
  'src/pages/PerfilTerapiaOcupacional.tsx': '<Puzzle className="h-3.5 w-3.5" />',
  'src/pages/PerfilFonoaudiologia.tsx': '<Ear className="h-3.5 w-3.5" />',
  'src/pages/PerfilFarmaciaClinica.tsx': '<Pill className="h-3.5 w-3.5" />',
  'src/pages/PerfilEnfermagem.tsx': '<Stethoscope className="h-3.5 w-3.5" />'
};

for (const [file, iconStr] of Object.entries(replacements)) {
  if (!fs.existsSync(file)) {
    console.log('File not found: ' + file);
    continue;
  }
  let content = fs.readFileSync(file, 'utf8');

  // Add the icon to the import list if missing
  const iconMatch = iconStr.match(/<([A-Za-z]+)/);
  if (iconMatch) {
    const iconName = iconMatch[1];
    content = content.replace(/import \{(.*?)\} from "lucide-react";/, (match, p1) => {
      if (p1.includes(iconName)) return match;
      return \import {\, \} from "lucide-react";\;
    });
  }

  // Replace <svg> block for Plano Terapêutico
  // First we find the block for 'prescriptions'
  // The block starts with id: "prescriptions", and ends with },
  content = content.replace(/(id:\s*"prescriptions",\s*label:\s*".*?",\s*icon:\s*)(?:\(|\<Syringe|<svg)([\s\S]*?)(?:<\/svg>\s*\)|\/>)/, \\\\);
  
  fs.writeFileSync(file, content, 'utf8');
  console.log('Processed ' + file);
}
