import glob, os
files = glob.glob('c:/Users/user/Desktop/Upa_100/src/pages/**/*.tsx', recursive=True)
files = [f for f in files if 'Evolucao' in f or 'Anotacao' in f or 'PatientEvolution' in f]
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    content = content.replace("navigate(location.state?.from || '/meu-consultorio');", "location.state?.from ? navigate(location.state.from) : window.history.length > 2 ? navigate(-1) : navigate('/pacientes');")
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
