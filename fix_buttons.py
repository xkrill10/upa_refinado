import re

file_path = "src/components/PatientEvolution/Forms/NursingEvolutionForm.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(
    r'(<Button[^>]+?)(>[\s]*Escala de Braden \(LPP\))',
    r'\1 onClick={() => setIsBradenOpen(true)}\2',
    content
)

content = re.sub(
    r'(<Button[^>]+?)(>[\s]*Escala de Morse \(Quedas\))',
    r'\1 onClick={() => setIsMorseOpen(true)}\2',
    content
)

content = re.sub(
    r'(<Button[^>]+?)(>[\s]*Escala de Dor \(EVA\))',
    r'\1 onClick={() => setIsEvaOpen(true)}\2',
    content
)

content = re.sub(
    r'(<Button[^>]+?)(>[\s]*MEWS \(Alerta Clínico\))',
    r'\1 onClick={() => setIsMewsOpen(true)}\2',
    content
)

content = re.sub(
    r'(<Button[^>]+?)(>[\s]*Planejador NANDA/NIC)',
    r'\1 onClick={() => setIsNandaOpen(true)}\2',
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Buttons fixed with onClick!")
