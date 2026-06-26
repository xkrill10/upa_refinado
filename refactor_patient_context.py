import os
import re

file_path = "src/pages/PatientEvolution.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the state feed and handleSaveUnifiedEvolution with the real context logic

old_logic = """  const [feed, setFeed] = useState<MockEvolution[]>([
    {
      id: "1",
      timestamp: new Date(new Date().getTime() - 1000 * 60 * 30),
      role: "enfermeiro",
      professionalName: "Enf. João Silva",
      type: "Avaliação de Risco (SAE)",
      content: "Paciente consciente, orientado. Acesso venoso pérvio em MSE. Sinais vitais estáveis. Risco de queda moderado (Morse 35).",
    },
    {
      id: "2",
      timestamp: new Date(new Date().getTime() - 1000 * 60 * 60),
      role: "medico",
      professionalName: "Dra. Maria Santos",
      type: "Evolução Médica",
      content: "Paciente refere melhora da dor torácica após analgesia. Mantém quadro estável. Aguardando resultado de exames laboratoriais (Troponina). Conduta: Manter observação clínica.",
    },
  ]);

  const handleSaveUnifiedEvolution = (content: string, type: string) => {
    const newRecord: MockEvolution = {
      id: Math.random().toString(),
      timestamp: new Date(),
      role: role || "enfermeiro",
      professionalName: role === "medico" ? "Dr. Teste" : "Enf. Teste",
      type: type,
      content: content,
    };
    setFeed([newRecord, ...feed]);
    setIsMedicalModalOpen(false);
    setIsNursingModalOpen(false);
  };"""

new_logic = """  // The feed is now generated from the real patient.evolutions array
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

if old_logic in content:
    content = content.replace(old_logic, new_logic)
    print("Replaced feed logic successfully.")
else:
    print("WARNING: Could not find old feed logic. Maybe it was formatted differently?")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("PatientEvolution.tsx refactored.")
