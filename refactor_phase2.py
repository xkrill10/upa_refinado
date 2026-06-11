import re

with open('src/pages/PatientEvolution.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import { useEvolutionCalculators } from "@/hooks/useEvolutionCalculators";',
    'import { useEvolutionCalculators } from "@/hooks/useEvolutionCalculators";\nimport { useEvolutionPrescriptions } from "@/hooks/useEvolutionPrescriptions";'
)

hook_call = """  const {
    prescWizard, setPrescWizard,
    prescribedMedications, setPrescribedMedications,
    handleAddPrescriptionItem,
    handleRemovePrescriptionItem
  } = useEvolutionPrescriptions();
"""

content = content.replace(
    '} = useEvolutionCalculators();',
    '} = useEvolutionCalculators();\n\n' + hook_call
)

start_marker = "  // Estados para o Super Painel de Prescrição Médica"
end_marker = "  const normalizeText = (text: string) => {"
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)
if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

with open('src/pages/PatientEvolution.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("done")
