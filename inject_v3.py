import os

file_path = "src/pages/PatientEvolution.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add imports
import_statement = """import { MedicalEvolutionForm } from "@/components/PatientEvolution/Forms/MedicalEvolutionForm";
import { NursingEvolutionForm } from "@/components/PatientEvolution/Forms/NursingEvolutionForm";
import { EvolutionFeed, MockEvolution } from "@/components/PatientEvolution/EvolutionFeed";
import { useRole } from "@/context/RoleContext";
"""
content = content.replace('import { useState, useRef, useEffect } from "react";', 'import { useState, useRef, useEffect } from "react";\n' + import_statement)

# 2. Add state
state_block = """  const { role } = useRole();
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isNursingModalOpen, setIsNursingModalOpen] = useState(false);
  const [feed, setFeed] = useState<MockEvolution[]>([
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

  const handleSaveEvolution = (content: string, type: string) => {
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
  };
"""
content = content.replace("export default function EvolucaoEnfermagem() {", "export default function EvolucaoEnfermagem() {\n" + state_block)

# 3. Change button onClick
old_onclick = """          <Button
            onClick={() => {
              setIsFormOpen(true);
              if (activeTab === "prescriptions") {
                handleEvolutionTypeChange("Evolução Enfermagem");
              } else if (activeTab === "vitals") {
                handleEvolutionTypeChange("Sinais Vitais");
              } else if (activeTab === "discharge") {
                handleEvolutionTypeChange("Alta");
              } else if (activeTab === "exams") {
                handleEvolutionTypeChange("Procedimento");
              } else if (activeTab === "evolutions") {
                handleEvolutionTypeChange("Evolução Enfermagem");
              } else {
                handleEvolutionTypeChange("Evolução Enfermagem");
              }
            }}"""
new_onclick = """          <Button
            onClick={() => {
              if (role === "medico") {
                setIsMedicalModalOpen(true);
              } else {
                setIsNursingModalOpen(true);
              }
            }}"""
content = content.replace(old_onclick, new_onclick)

# 4. Inject Modals AT THE VERY END
modals = """
      <MedicalEvolutionForm 
        isOpen={isMedicalModalOpen} 
        onClose={() => setIsMedicalModalOpen(false)}
        onSave={(content) => handleSaveEvolution(content, "Evolução Médica")}
        patientName={patient?.name || ""}
      />
      
      <NursingEvolutionForm 
        isOpen={isNursingModalOpen} 
        onClose={() => setIsNursingModalOpen(false)}
        onSave={(content) => handleSaveEvolution(content, "Anotação/SAE")}
        patientName={patient?.name || ""}
      />
"""
content = content.replace("</motion.div>\n  );\n}", modals + "\n</motion.div>\n  );\n}")

# 5. Inject Feed Rendering
search_str = """          {!isFormOpen && !isExpressMode && (
            <div className="space-y-4 mt-6">"""

replace_str = """          {!isFormOpen && !isExpressMode && activeTab === "evolutions" && (
            <div className="mt-6">
              <EvolutionFeed feed={feed} />
            </div>
          )}
          
          {!isFormOpen && !isExpressMode && activeTab !== "evolutions" && (
            <div className="space-y-4 mt-6">"""

if search_str in content:
    content = content.replace(search_str, replace_str)
else:
    search_2 = '<div id="timeline-content" className="scroll-mt-24">'
    replace_2 = '<div id="timeline-content" className="scroll-mt-24">\n        {activeTab === "evolutions" && !isFormOpen && <EvolutionFeed feed={feed} />}\n'
    if search_2 in content:
        content = content.replace(search_2, replace_2)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Modification complete.")
