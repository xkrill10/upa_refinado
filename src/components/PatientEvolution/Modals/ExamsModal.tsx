import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePatientsContext, Patient } from "@/context/PatientsContext";
import { Search, FlaskConical, AlertCircle, Activity, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExamsModalProps {
  patient: Patient;
  onClose: () => void;
}

const COMMON_EXAMS = [
  { id: 'ex1', name: 'Hemograma Completo', type: 'lab' },
  { id: 'ex2', name: 'Troponina T', type: 'lab' },
  { id: 'ex3', name: 'Glicemia de Jejum', type: 'lab' },
  { id: 'ex4', name: 'Ureia e Creatinina', type: 'lab' },
  { id: 'ex5', name: 'Sódio e Potássio', type: 'lab' },
  { id: 'ex6', name: 'EAS (Urina Tipo I)', type: 'lab' },
  { id: 'ex7', name: 'PCR (Proteína C Reativa)', type: 'lab' },
  { id: 'ex8', name: 'Coagulograma (TAP, TTPA)', type: 'lab' },
  { id: 'ex9', name: 'Enzimas Cardíacas (CK-MB)', type: 'lab' },
  { id: 'ex10', name: 'Teste Rápido Dengue NS1', type: 'lab' },
  { id: 'ex11', name: 'Teste Rápido Covid/Flu', type: 'lab' },
  { id: 'ex12', name: 'Gasometria Arterial', type: 'lab' },
  { id: 'ex13', name: 'Amilase e Lipase', type: 'lab' },
  { id: 'ex14', name: 'Beta-hCG (Sangue)', type: 'lab' },
  { id: 'ex15', name: 'TGO, TGP e Bilirrubinas', type: 'lab' },
  { id: 'ex16', name: 'Lactato (Ácido Láctico)', type: 'lab' },
  { id: 'ex17', name: 'Tipagem Sanguínea e Fator Rh', type: 'lab' },
  { id: 'ex18', name: 'Teste Rápido HIV / Sífilis', type: 'lab' },
  { id: 'ex19', name: 'Magnésio e Cálcio Ionizado', type: 'lab' },
  { id: 'img1', name: 'Raio-X de Tórax (PA e Perfil)', type: 'image' },
  { id: 'img1b', name: 'Raio-X de Extremidades', type: 'image' },
  { id: 'img1c', name: 'Raio-X de Bacia/Pelve', type: 'image' },
  { id: 'img1d', name: 'Raio-X de Abdome Agudo', type: 'image' },
  { id: 'img2', name: 'Tomografia de Crânio', type: 'image' },
  { id: 'img3', name: 'Tomografia de Tórax', type: 'image' },
  { id: 'img4', name: 'Ultrassonografia Abdominal', type: 'image' },
  { id: 'img5', name: 'Ultrassom Vias Urinárias', type: 'image' },
  { id: 'img6', name: 'Eletrocardiograma (ECG)', type: 'image' },
] as const;

const PROTOCOLS = [
  {
    name: 'Dor Torácica',
    exams: ['Troponina T', 'Enzimas Cardíacas (CK-MB)', 'Raio-X de Tórax (PA e Perfil)', 'Eletrocardiograma (ECG)']
  },
  {
    name: 'Sepse',
    exams: ['Hemograma Completo', 'Lactato (Ácido Láctico)', 'PCR (Proteína C Reativa)', 'Gasometria Arterial']
  },
  {
    name: 'Dengue / Arboviroses',
    exams: ['Hemograma Completo', 'Teste Rápido Dengue NS1', 'TGO, TGP e Bilirrubinas']
  }
];

export function ExamsModal({ patient, onClose }: ExamsModalProps) {
  const { requestExam } = usePatientsContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExams, setSelectedExams] = useState<{name: string, type: 'lab' | 'image'}[]>([]);
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [activeTab, setActiveTab] = useState('lab');
  const [justification, setJustification] = useState("");
  const [lateralityDetails, setLateralityDetails] = useState<Record<string, string>>({});
  
  const scrollRefLab = useRef<HTMLDivElement>(null);
  const scrollRefImg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'lab' && scrollRefLab.current) {
        scrollRefLab.current.scrollTop = 0;
      } else if (activeTab === 'image' && scrollRefImg.current) {
        scrollRefImg.current.scrollTop = 0;
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const applyProtocol = (examsToSelect: string[]) => {
    setSelectedExams(prev => {
      const newExams = [...prev];
      examsToSelect.forEach(examName => {
        if (!newExams.some(e => e.name === examName)) {
          const examData = COMMON_EXAMS.find(e => e.name === examName);
          if (examData) newExams.push({ name: examData.name, type: examData.type });
        }
      });
      return newExams;
    });
  };

  const filteredExams = COMMON_EXAMS.filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleExam = (name: string, type: 'lab' | 'image') => {
    setSelectedExams(prev => {
      const exists = prev.find(e => e.name === name);
      if (exists) return prev.filter(e => e.name !== name);
      return [...prev, { name, type }];
    });
  };

  const handleSave = () => {
    selectedExams.forEach(ex => {
      let finalName = ex.name;
      if (lateralityDetails[ex.name]) {
        finalName = `${ex.name} (${lateralityDetails[ex.name]})`;
      }
      requestExam(patient.id, {
        name: finalName,
        type: ex.type,
        priority,
        doctor: "Dr. Ricardo Braga",
        observations: justification,
      });
    });
    onClose();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
          <Button
            variant={priority === 'normal' ? 'default' : 'outline'}
            className={cn("flex-1", priority === 'normal' && "bg-blue-600 hover:bg-blue-700")}
            onClick={() => setPriority('normal')}
          >
            Rotina
          </Button>
          <Button
            variant={priority === 'urgent' ? 'default' : 'outline'}
            className={cn("flex-1", priority === 'urgent' && "bg-red-600 hover:bg-red-700")}
            onClick={() => setPriority('urgent')}
          >
            <AlertCircle className="w-4 h-4 mr-2" /> Urgente (SLA 1h)
          </Button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {PROTOCOLS.map(proto => (
            <Button
              key={proto.name}
              variant="outline"
              size="sm"
              className="text-xs whitespace-nowrap bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
              onClick={() => applyProtocol(proto.exams)}
            >
              🚀 {proto.name}
            </Button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar exame (ex: Hemograma, Raio-X)..." 
            className="pl-9 h-12 rounded-xl bg-white dark:bg-slate-950"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50 rounded-xl p-1 h-12">
          <TabsTrigger value="lab" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
            <FlaskConical className="h-4 w-4" /> Laboratório
          </TabsTrigger>
          <TabsTrigger value="image" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
            <Activity className="h-4 w-4" /> Imagem
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lab" className="mt-0">
          <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar" ref={scrollRefLab}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredExams.filter(ex => ex.type === 'lab').map(ex => {
                const isSelected = selectedExams.some(e => e.name === ex.name);
                return (
                  <div key={ex.id} className="flex flex-col gap-2">
                    <div 
                      onClick={() => toggleExam(ex.name, ex.type)}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                        isSelected 
                          ? "bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500" 
                          : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                          <FlaskConical className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold">{ex.name}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="image" className="mt-0">
          <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar" ref={scrollRefImg}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredExams.filter(ex => ex.type === 'image').map(ex => {
                const isSelected = selectedExams.some(e => e.name === ex.name);
                const needsDetails = ex.name.includes('Extremidades') || ex.name.includes('Bacia/Pelve');
                return (
                  <div key={ex.id} className="flex flex-col gap-2">
                    <div 
                      onClick={() => toggleExam(ex.name, ex.type)}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                        isSelected 
                          ? "bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500" 
                          : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                          <Activity className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold">{ex.name}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-500" />}
                    </div>
                    {isSelected && needsDetails && (
                      <Input
                        placeholder="Lado/Membro (Ex: Pé Direito)..."
                        value={lateralityDetails[ex.name] || ""}
                        onChange={(e) => setLateralityDetails(prev => ({...prev, [ex.name]: e.target.value}))}
                        className="h-8 text-xs bg-slate-50 dark:bg-slate-900/50"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2 mt-2">
        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Justificativa Clínica / Observações</Label>
        <Textarea 
          placeholder="Descreva brevemente o motivo do pedido, histórico relevante ou suspeita diagnóstica..." 
          className="resize-none h-16 text-xs bg-slate-50 dark:bg-slate-900/50 rounded-xl"
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
        />
      </div>

      <Button 
        className="w-full h-12 font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
        onClick={handleSave}
        disabled={selectedExams.length === 0}
      >
        <FlaskConical className="w-4 h-4 mr-2" />
        Solicitar {selectedExams.length > 0 ? `${selectedExams.length} Exames` : "Exames"}
      </Button>
    </div>
  );
}
