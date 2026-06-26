import re

file_path = "src/pages/PatientEvolution.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to change the onClick of the "+ REGISTRAR NOVA EVOLUÇÃO" button.
# Currently it is:
#             <Button
#                 onClick={() => {
#                   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
#                 }}

new_click = r"""            <Button
              onClick={() => {
                setIsFormOpen(true);
                setEvolutionType(role === "medico" ? "Evolução Médica" : "Evolução Enfermagem");
                setTimeout(() => window.scrollTo({ top: 300, behavior: 'smooth' }), 100);
              }}"""

content = re.sub(r'<Button\s*onClick=\{\(\) => \{\s*window\.scrollTo\(\{ top: document\.body\.scrollHeight, behavior: \'smooth\' \}\);\s*\}\}', new_click, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Button + REGISTRAR NOVA EVOLUÇÃO fixed to open the form!")
