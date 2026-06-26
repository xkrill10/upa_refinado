import re

file_path = "src/AppRoutes.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make all Evolucao imports point to PatientEvolution
import_replacements = [
    "EvolucaoMedica", "EvolucaoEnfermagem", "AnotacaoEnfermagem",
    "EvolucaoFisioterapia", "EvolucaoNutricao", "EvolucaoPsicologia",
    "EvolucaoServicoSocial", "EvolucaoTerapiaOcupacional",
    "EvolucaoFonoaudiologia", "EvolucaoFarmaciaClinica"
]

for name in import_replacements:
    # Match `const Name = React.lazy(() => import("./pages/Name"));`
    pattern = rf'const {name} = React.lazy\(\s*\(\) => import\("\./pages/{name}"\),?\s*\);'
    replacement = f'const {name} = React.lazy(() => import("./pages/PatientEvolution"));'
    content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

# Also fix PatientEvolution if we pointed it to UnifiedEvolution earlier
content = content.replace('import("./pages/UnifiedEvolution")', 'import("./pages/PatientEvolution")')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated AppRoutes.tsx")
