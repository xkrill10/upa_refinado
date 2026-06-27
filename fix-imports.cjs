const fs = require('fs');
let c = fs.readFileSync('src/pages/PatientEvolution.tsx', 'utf8');
c = c.replace(/}\s*from\s*['"]lucide-react['"];/, '  AlertTriangle,\n  Smile,\n  FileHeart,\n} from "lucide-react";');
fs.writeFileSync('src/pages/PatientEvolution.tsx', c);
