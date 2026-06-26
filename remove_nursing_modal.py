import re

file_path = "src/pages/PatientEvolution.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove the import of NursingEvolutionForm
content = re.sub(r'import \{ NursingEvolutionForm \}.*?\n', '', content)

# Remove the NursingEvolutionForm component rendering
content = re.sub(r'<NursingEvolutionForm.*?\/>', '', content, flags=re.DOTALL)

# Change the onClick of the Registrar Nova Evolução button
# It currently is:
#             <Button
#               onClick={() => {
#                 if (role === "medico") {
#                   setIsMedicalModalOpen(true);
#                 } else {
#                   setIsNursingModalOpen(true);
#                 }
#               }}
# We change it to just do nothing or maybe just scroll. Since it's a "Registrar" button, maybe we don't need it to open a modal anymore.
# Let's just make it focus a specific element or scroll down.
new_click = r"""<Button
              onClick={() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }}"""

content = re.sub(r'<Button\s*onClick=\{\(\) => \{\s*if \(role === "medico"\) \{\s*setIsMedicalModalOpen\(true\);\s*\} else \{\s*setIsNursingModalOpen\(true\);\s*\}\s*\}\}', new_click, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Nursing modal removed completely!")
