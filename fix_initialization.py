import re

file_path = "src/pages/PatientEvolution.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# The problematic code:
problem = """  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isNursingModalOpen, setIsNursingModalOpen] = useState(false);

  // The feed is now generated from the real patient.evolutions array
  const feed: MockEvolution[] = (patient?.evolutions || []).map(ev => ({
    id: ev.id,
    timestamp: new Date(ev.timestamp),
    role: ev.professional.toLowerCase().includes('dr') ? 'medico' : 'enfermeiro',
    professionalName: ev.professional,
    content: ev.description,
    type: ev.type,
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const handleSaveUnifiedEvolution = (content: string, type: string) => {
    if (id) {
      addEvolution(id, {
        type: type,
        professional: role === "medico" ? "Dra. Maria (Teste)" : "Enf. João (Teste)",
        description: content,
      });
    }
    setIsMedicalModalOpen(false);
    setIsNursingModalOpen(false);
  };"""

# We just remove the feed and handleSaveUnifiedEvolution from the top
new_top = """  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isNursingModalOpen, setIsNursingModalOpen] = useState(false);"""

# And put them AFTER `const patient = patients.find((p) => p.id === id);`
# But let's find `const patient = patients.find((p) => p.id === id);`
target_line = "const patient = patients.find((p) => p.id === id);"

if problem in content:
    content = content.replace(problem, new_top)
    
    feed_logic = """
  // The feed is now generated from the real patient.evolutions array
  const feed: MockEvolution[] = (patient?.evolutions || []).map(ev => ({
    id: ev.id,
    timestamp: new Date(ev.timestamp),
    role: ev.professional?.toLowerCase().includes('dr') ? 'medico' : 'enfermeiro',
    professionalName: ev.professional || 'Profissional',
    content: ev.description,
    type: ev.type,
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const handleSaveUnifiedEvolution = (content: string, type: string) => {
    if (id) {
      addEvolution(id, {
        type: type,
        professional: role === "medico" ? "Dra. Maria (Teste)" : "Enf. João (Teste)",
        description: content,
      });
    }
    setIsMedicalModalOpen(false);
    setIsNursingModalOpen(false);
  };
"""
    content = content.replace(target_line, target_line + feed_logic)
    print("Fixed initialization order.")
else:
    print("Problem logic not found.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
