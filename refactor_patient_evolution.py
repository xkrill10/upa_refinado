import re

file_path = "src/pages/PatientEvolution.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Step 1: Add import for SmartEvolutionBuilder
import_statement = 'import { SmartEvolutionBuilder } from "@/components/PatientEvolution/SmartEvolutionBuilder";'
if import_statement not in content:
    content = content.replace(
        'import { NANDA_DIAGNOSES, NandaDiagnosis } from "@/data/nanda";',
        'import { NANDA_DIAGNOSES, NandaDiagnosis } from "@/data/nanda";\n' + import_statement
    )

# Step 2: Remove the "Super Painel SAE Enfermagem"
# The painel starts at "{/* Super Painel SAE Enfermagem */}" and ends right before "{/* Título Descrição e Modelo Padrão */}"
painel_regex = r'\{\/\* Super Painel SAE Enfermagem \*\/\}.*?(?=\{\/\* Título Descrição e Modelo Padrão \*\/\})'
content = re.sub(painel_regex, '', content, flags=re.DOTALL)

# Step 3: Replace the Textarea and the title with SmartEvolutionBuilder
# We need to find "{/* Título Descrição e Modelo Padrão */}" and everything up to the end of the Textarea block.
textarea_regex = r'\{\/\* Título Descrição e Modelo Padrão \*\/\}.*?<Textarea[^>]*/>'
smart_builder_code = """
                <SmartEvolutionBuilder 
                  role={professional?.toLowerCase().includes("dr") ? "medico" : "enfermeiro"}
                  value={description}
                  onChange={setDescription}
                />
"""
content = re.sub(textarea_regex, smart_builder_code, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("PatientEvolution refactored to use SmartEvolutionBuilder!")
