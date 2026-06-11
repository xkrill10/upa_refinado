import re

with open('src/pages/PatientEvolution.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Vamos injetar as variáveis que sumiram logo abaixo do hook useEvolutionPrescriptions
injecao = """
  const { addPrescriptionOrder } = usePrescriptions();
  const [openBedTransfer, setOpenBedTransfer] = useState(false);
  const [openBedStatus, setOpenBedStatus] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
"""

# Procuramos onde o hook de prescrição é fechado
content = content.replace(
    '} = useEvolutionPrescriptions();',
    '} = useEvolutionPrescriptions();\n' + injecao
)

with open('src/pages/PatientEvolution.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("restaurado")
