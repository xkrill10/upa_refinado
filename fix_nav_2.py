import glob
files = glob.glob('c:/Users/user/Desktop/Upa_100/src/pages/**/*.tsx', recursive=True)
files = [f for f in files if 'Evolucao' in f or 'Anotacao' in f or 'PatientEvolution' in f]
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    # Replace the history back logic with a direct navigate to the patient evolution timeline view
    content = content.replace("navigate(location.state?.from || '/meu-consultorio');", "navigate(location.state?.from || `/paciente/${id}/evolucao`);")
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
