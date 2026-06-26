import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRole } from "@/context/RoleContext";
import { usePatients } from "@/hooks/use-patients";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft, Clock, User, Activity } from "lucide-react";
import { MedicalEvolutionForm } from "@/components/PatientEvolution/Forms/MedicalEvolutionForm";
import { NursingEvolutionForm } from "@/components/PatientEvolution/Forms/NursingEvolutionForm";
import { format } from "date-fns";

// Tipo para dados mockados do Feed
type MockEvolution = {
  id: string;
  timestamp: Date;
  role: string;
  professionalName: string;
  content: string;
  type: string;
};

const MOCK_EVOLUTIONS: MockEvolution[] = [
  {
    id: "1",
    timestamp: new Date(new Date().getTime() - 1000 * 60 * 30), // 30 mins ago
    role: "enfermeiro",
    professionalName: "Enf. João Silva",
    type: "Avaliação de Risco (SAE)",
    content: "Paciente consciente, orientado. Acesso venoso pérvio em MSE. Sinais vitais estáveis. Risco de queda moderado (Morse 35).",
  },
  {
    id: "2",
    timestamp: new Date(new Date().getTime() - 1000 * 60 * 60), // 1 hour ago
    role: "medico",
    professionalName: "Dra. Maria Santos",
    type: "Evolução Médica",
    content: "Paciente refere melhora da dor torácica após analgesia. Mantém quadro estável. Aguardando resultado de exames laboratoriais (Troponina). Conduta: Manter observação clínica.",
  },
];

export default function UnifiedEvolution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useRole();
  const { patients } = usePatients();
  
  const patient = patients.find((p) => p.id === id);
  
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isNursingModalOpen, setIsNursingModalOpen] = useState(false);
  const [feed, setFeed] = useState<MockEvolution[]>(MOCK_EVOLUTIONS);

  const handleNewEvolutionClick = () => {
    if (role === "medico") {
      setIsMedicalModalOpen(true);
    } else if (role === "enfermeiro") {
      setIsNursingModalOpen(true);
    } else {
      // Default to nursing or generic for now
      setIsNursingModalOpen(true);
    }
  };

  const handleSaveEvolution = (content: string, type: string) => {
    const newRecord: MockEvolution = {
      id: Math.random().toString(),
      timestamp: new Date(), // Pega a hora atual (ou do form no futuro)
      role: role,
      professionalName: role === "medico" ? "Dr. Teste" : "Enf. Teste",
      type: type,
      content: content,
    };
    
    setFeed([newRecord, ...feed]);
    setIsMedicalModalOpen(false);
    setIsNursingModalOpen(false);
  };

  if (!patient) return <div className="p-8">Paciente não encontrado.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50/50">
      {/* HEADER */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Prontuário Unificado
              <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {patient.name}
              </span>
            </h1>
            <p className="text-sm text-slate-500">Histórico cronológico de evoluções e anotações</p>
          </div>
        </div>
        
        {/* SMART BUTTON */}
        <Button onClick={handleNewEvolutionClick} className="bg-[#006699] hover:bg-[#005580]">
          <Plus className="h-4 w-4 mr-2" />
          Nova Evolução
        </Button>
      </div>

      {/* TIMELINE FEED */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {feed.map((ev) => (
            <Card key={ev.id} className="border-l-4 shadow-sm" style={{ borderLeftColor: ev.role === 'medico' ? '#10b981' : '#3b82f6' }}>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{ev.type}</CardTitle>
                    <div className="text-sm text-slate-500 font-medium">
                      {ev.professionalName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-slate-500 gap-1 bg-slate-100 px-2 py-1 rounded-md">
                  <Clock className="h-4 w-4" />
                  {format(ev.timestamp, "dd/MM/yyyy HH:mm")}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{ev.content}</p>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex items-center gap-4 text-slate-400 py-4 justify-center">
            <Activity className="h-5 w-5" />
            <span className="text-sm font-medium">Fim do Histórico</span>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <MedicalEvolutionForm 
        isOpen={isMedicalModalOpen} 
        onClose={() => setIsMedicalModalOpen(false)}
        onSave={(content) => handleSaveEvolution(content, "Evolução Médica")}
        patientName={patient.name}
      />
      
      <NursingEvolutionForm 
        isOpen={isNursingModalOpen} 
        onClose={() => setIsNursingModalOpen(false)}
        onSave={(content) => handleSaveEvolution(content, "Anotação/SAE")}
        patientName={patient.name}
      />
    </div>
  );
}
