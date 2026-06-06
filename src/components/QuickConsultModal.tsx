import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Patient } from "@/hooks/use-patients";
import { toast } from "sonner";
import { Stethoscope, ClipboardCheck, Activity, AlertTriangle, FileText, Pill, Baby, User, CheckCircle2, Plus, X, Brain, ShieldAlert, ExternalLink, FlaskConical } from "lucide-react";
import { SmartCidSelector } from "@/components/SmartCidSelector";
import { SmartMedicationSelector } from "@/components/SmartMedicationSelector";
import { DocumentGenerator } from "@/components/DocumentGenerator";
import { FastTrackExamsModal } from "@/components/FastTrackExamsModal";
import { usePrescriptions } from "@/context/PrescriptionsContext";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface QuickConsultModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (patientId: string, outcome: string) => void;
  isPediatric?: boolean;
  hidePediatricOptions?: boolean;
}

export function QuickConsultModal({ patient, isOpen, onClose, onComplete, isPediatric, hidePediatricOptions }: QuickConsultModalProps) {
  const [anamnesis, setAnamnesis] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [outcome, setOutcome] = useState<string>("");
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false);
  
  // Super Painel State
  const [prescWizard, setPrescWizard] = useState({
    medication: "", dosage: "", route: "", frequency: ""
  });
  const [prescribedMedications, setPrescribedMedications] = useState<{medication: string, dosage: string, route: string, frequency: string}[]>([]);
  const { user } = useAuth();
  const { addPrescriptionOrder } = usePrescriptions();
  
  const [professional, setProfessional] = useState("");
  const [crmNumber, setCrmNumber] = useState("");
  const [crmState, setCrmState] = useState("SP");

  useEffect(() => {
    if (isOpen) {
      setProfessional(user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || localStorage.getItem("upa_active_doctor") || "");
      setCrmNumber(localStorage.getItem("upa_stamp_number") || "");
      setCrmState(localStorage.getItem("upa_stamp_state") || "SP");
    }
  }, [isOpen, user]);

  const handleAddPrescriptionItem = () => {
    if (prescWizard.medication && prescWizard.dosage) {
      setPrescribedMedications([...prescribedMedications, prescWizard]);
      setPrescWizard({ medication: "", dosage: "", route: "", frequency: "" });
    }
  };

  const handleRemovePrescriptionItem = (index: number) => {
    setPrescribedMedications(prescribedMedications.filter((_, i) => i !== index));
  };

  if (!patient) return null;

  const handleFinish = () => {
    if (!outcome) {
      toast.error("Selecione um desfecho para o paciente!");
      return;
    }

    if (prescribedMedications.length > 0) {
      addPrescriptionOrder({
        patientId: patient.id,
        patientName: patient.name,
        doctorId: "doc-1",
        doctorName: professional,
        medications: prescribedMedications.map(med => ({
          id: `med-${Math.random().toString(36).substr(2, 9)}`,
          medication: med.medication,
          dosage: med.dosage,
          route: med.route,
          frequency: med.frequency,
          status: 'awaiting_pharmacy',
          hours: []
        }))
      });
    }

    toast.success("Atendimento finalizado com sucesso!");
    onComplete(patient.id, outcome);
    setAnamnesis("");
    setDiagnosis("");
    setPrescribedMedications([]);
    setOutcome("");
    onClose();
  };

  const riskColors: Record<string, string> = {
    'emergency': 'bg-red-500 text-white',
    'very-urgent': 'bg-orange-500 text-white',
    'urgent': 'bg-[#FFDE21] text-black',
    'less-urgent': 'bg-green-500 text-white',
    'not-urgent': 'bg-blue-500 text-white',
  };

  const riskLabels: Record<string, string> = {
    'emergency': 'Emergência',
    'very-urgent': 'Muito Urgente',
    'urgent': 'Urgente',
    'less-urgent': 'Pouco Urgente',
    'not-urgent': 'Não Urgente',
  };

  const themeColor = isPediatric ? 'orange' : '[#006699]';
  const iconBg = isPediatric ? 'bg-orange-500/10' : 'bg-[#006699]/10';
  const iconColor = isPediatric ? 'text-orange-500' : 'text-[#006699]';
  const btnColor = isPediatric ? 'bg-orange-500 hover:bg-orange-600' : 'bg-[#006699] hover:bg-[#005580]';

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-[1200px] w-[95vw] max-h-[95vh] p-0 overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-950 border-0 shadow-2xl rounded-2xl">
        <DialogHeader className={cn("p-4 sm:p-6 text-white shrink-0 border-b border-white/20", btnColor)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                {isPediatric ? <Baby className="h-6 w-6 text-white" /> : <Stethoscope className="h-6 w-6 text-white" />}
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                  Atendimento {isPediatric ? 'Pediátrico' : 'Clínico'}
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 font-bold tracking-widest text-[10px]">FAST-TRACK</Badge>
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/80 font-bold uppercase text-sm">{patient.name}</span>
                  <span className="text-white/60">•</span>
                  <span className="text-white/80 font-medium text-xs">{patient.age} ANOS</span>
                  <span className="text-white/60">•</span>
                  <span className="text-white/80 font-medium text-xs uppercase">ID: {patient.id}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 hidden md:flex pr-8">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Tempo Restante Alvo</p>
                <p className="text-lg font-black font-mono">14:59</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Coluna Esquerda: Resumo Triagem */}
          <div className="w-full lg:w-[350px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto shrink-0 flex flex-col">
            <div className="p-5 space-y-6">
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" /> Classificação
                </Label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <Badge className={cn("px-3 py-1 font-black uppercase text-[10px]", riskColors[patient.risk || 'not-urgent'])}>
                    {riskLabels[patient.risk || 'not-urgent']}
                  </Badge>
                  <span className="text-[10px] font-bold text-muted-foreground">Senha: {patient.ticket || '--'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5" /> Sinais Vitais
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-red-600/70 uppercase">Pressão</p>
                    <p className="font-black text-red-600 dark:text-red-400">{patient.pa || '--'}</p>
                  </div>
                  <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-orange-600/70 uppercase">FC</p>
                    <p className="font-black text-orange-600 dark:text-orange-400">{patient.fc || '--'}</p>
                  </div>
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-blue-600/70 uppercase">O2</p>
                    <p className="font-black text-blue-600 dark:text-blue-400">{patient.spo2 ? `${patient.spo2}%` : '--'}</p>
                  </div>
                  <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-amber-600/70 uppercase">Temp</p>
                    <p className="font-black text-amber-600 dark:text-amber-400">{patient.temperature ? `${patient.temperature}°` : '--'}</p>
                  </div>
                </div>
                {isPediatric && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center flex items-center justify-center gap-3">
                    <p className="text-xs font-black text-green-700 dark:text-green-400 uppercase tracking-widest">Peso Atual:</p>
                    <p className="text-xl font-black text-green-700 dark:text-green-400">{patient.weight || '--'} kg</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> Queixa Principal
                </Label>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-sm font-medium leading-relaxed text-foreground">
                    {patient.mainComplaint || <span className="text-muted-foreground italic">Não informada</span>}
                  </p>
                </div>
              </div>

              {patient.allergies && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5" /> Alergias
                  </Label>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                      {patient.allergies}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Coluna Direita: Ação (Vapt-Vupt) */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-4">
              
              {/* TIPO E PROFISSIONAL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Tipo de Registro *</Label>
                  <Input 
                    value={isPediatric ? "Atendimento Médico (Pediátrico)" : "Atendimento Médico"} 
                    disabled 
                    className="h-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs rounded-xl shadow-sm opacity-100 text-foreground disabled:opacity-100 disabled:bg-slate-50 dark:disabled:bg-slate-900" 
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Profissional Responsável *</Label>
                  <Input
                    className="h-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs rounded-xl shadow-sm"
                    value={professional}
                    onChange={(e) => setProfessional(e.target.value)}
                  />
                </div>
              </div>

              {/* ANAMNESE E DIAGNÓSTICO */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FileText className={cn("h-4 w-4", iconColor)} /> Evolução / Anamnese
                  </Label>
                  <Textarea 
                    className="min-h-[80px] resize-none rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 shadow-sm bg-white dark:bg-slate-950" 
                    placeholder="Relato clínico..."
                    value={anamnesis}
                    onChange={(e) => setAnamnesis(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    Diagnóstico / CID-10 <span className="text-[9px] text-muted-foreground font-medium lowercase italic">(opcional)</span>
                  </Label>
                  <SmartCidSelector 
                    selectedCid={diagnosis}
                    onSelectCid={(cid) => setDiagnosis(cid)}
                  />
                </div>
              </div>

              {/* EXAMES CLÍNICOS E DE IMAGEM */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-purple-50/30 dark:bg-purple-900/10 shadow-sm space-y-3 mt-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-extrabold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                    Exames Clínicos e de Imagem
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">Solicitação de Exames Laboratoriais e de Imagem</span>
                  <Button
                    variant="outline"
                    className="h-10 text-[10px] font-black uppercase tracking-wider border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-900/40 dark:text-purple-400 dark:hover:bg-purple-900/20 shadow-sm"
                    onClick={() => setIsExamsModalOpen(true)}
                  >
                    <FlaskConical className="h-4 w-4 mr-1.5" /> Pedir Exames
                  </Button>
                </div>
              </div>

              {/* PAINEL DE PRESCRIÇÃO */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-blue-50/30 dark:bg-slate-900/50 shadow-sm space-y-4 mt-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className={cn("font-extrabold uppercase tracking-wider text-[11px] flex items-center gap-1.5", isPediatric ? "text-orange-600" : "text-[#006699]")}>
                    Painel de Prescrição Médica
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Form Inserção */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase text-muted-foreground block">
                      1. Adicionar Item (Fila da Farmácia & Enfermagem)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold">Medicamento</Label>
                        <SmartMedicationSelector
                          value={prescWizard.medication}
                          onChange={(val) => setPrescWizard({ ...prescWizard, medication: val })}
                          onSelectFull={(med) => {
                            if (med.routes.length === 1) {
                              setPrescWizard(prev => ({ ...prev, route: med.routes[0] }));
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold">Dose</Label>
                        <Input
                          placeholder="Ex: 1g"
                          className="h-8 text-xs bg-white dark:bg-slate-950"
                          value={prescWizard.dosage}
                          onChange={(e) => setPrescWizard({ ...prescWizard, dosage: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold">Via</Label>
                        <Select value={prescWizard.route} onValueChange={(v) => setPrescWizard({ ...prescWizard, route: v })}>
                          <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-950">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EV">EV (Endovenosa)</SelectItem>
                            <SelectItem value="IM">IM (Intramuscular)</SelectItem>
                            <SelectItem value="VO">VO (Oral)</SelectItem>
                            <SelectItem value="SC">SC (Subcutânea)</SelectItem>
                            <SelectItem value="Inalatória">Inalatória</SelectItem>
                            <SelectItem value="Tópica">Tópica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold">Frequência</Label>
                        <Select value={prescWizard.frequency} onValueChange={(v) => setPrescWizard({ ...prescWizard, frequency: v })}>
                          <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-950">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dose única">Dose única</SelectItem>
                            <SelectItem value="Contínuo">Contínuo</SelectItem>
                            <SelectItem value="4/4h">4/4h</SelectItem>
                            <SelectItem value="6/6h">6/6h</SelectItem>
                            <SelectItem value="8/8h">8/8h</SelectItem>
                            <SelectItem value="12/12h">12/12h</SelectItem>
                            <SelectItem value="24/24h">24/24h</SelectItem>
                            <SelectItem value="ACM">ACM (A critério médico)</SelectItem>
                            <SelectItem value="SOS">SOS (Se necessário)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddPrescriptionItem}
                      className={cn("w-full h-8 text-[10px] font-black uppercase tracking-wider", 
                        isPediatric ? "bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border-orange-500/30" : "bg-[#006699]/10 hover:bg-[#006699]/20 text-[#006699] border-[#006699]/30"
                      )}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Adicionar à Prescrição
                    </Button>
                  </div>

                  {/* Lista Estruturada */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-muted-foreground block">
                      2. Lista Estruturada
                    </span>
                    <div className="bg-white/80 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-2 min-h-[120px] max-h-[160px] overflow-y-auto space-y-1.5">
                      {prescribedMedications.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 py-4">
                          <CheckCircle2 className="h-6 w-6 mb-1 opacity-20" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Nenhum item adicionado</span>
                        </div>
                      ) : (
                        prescribedMedications.map((med, idx) => (
                          <div key={idx} className="flex flex-col bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-800 text-xs relative group">
                            <button
                              onClick={() => handleRemovePrescriptionItem(idx)}
                              className="absolute top-1 right-1 h-5 w-5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <span className="font-bold pr-6">{med.medication} <span className="text-muted-foreground font-normal">({med.dosage})</span></span>
                            <span className="text-[10px] text-muted-foreground">Via: {med.route} • Freq: {med.frequency}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <DocumentGenerator 
                  patient={patient!}
                  medications={prescribedMedications}
                  doctorName={professional}
                  crmNumber={crmNumber}
                  crmState={crmState}
                  hidePediatricOptions={hidePediatricOptions}
                  anamnesis={anamnesis}
                  diagnosis={diagnosis}
                  outcome={outcome}
                />
              </div>
            </div>

            {/* FIXED FOOTER */}
            <div className="shrink-0 p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] z-10 w-full relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 max-w-4xl mx-auto w-full">
                <div className="w-full sm:w-[300px] space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <ClipboardCheck className="h-3.5 w-3.5" /> Desfecho do Atendimento *
                  </Label>
                  <Select value={outcome} onValueChange={setOutcome}>
                    <SelectTrigger className={cn("h-12 rounded-xl font-bold border-2 focus:ring-0", outcome ? "border-green-500" : "border-slate-200 dark:border-slate-800")}>
                      <SelectValue placeholder="Selecione o destino" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl font-bold">
                      <SelectGroup>
                        <SelectLabel className="text-[10px] uppercase tracking-widest text-slate-500">Altas e Liberações</SelectLabel>
                        <SelectItem value="alta">Alta Médica (Melhora)</SelectItem>
                        <SelectItem value="encaminhamento">Alta com Encaminhamento (UBS/Especialista)</SelectItem>
                        <SelectItem value="alta_pedido">Alta a Pedido (Recusa/Evasão)</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-[10px] uppercase tracking-widest text-slate-500 mt-2">Retenção na Unidade</SelectLabel>
                        <SelectItem value="observacao">Sala de Medicação / Observação</SelectItem>
                        <SelectItem value="exames">Aguardar Exames (Retorno)</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-[10px] uppercase tracking-widest text-slate-500 mt-2">Desfechos Críticos</SelectLabel>
                        <SelectItem value="internacao">Internação (Leito UPA)</SelectItem>
                        <SelectItem value="transferencia">Transferência Hospitalar (Regulação/SAMU)</SelectItem>
                        <SelectItem value="obito">Óbito</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.open('https://siresp.saude.sp.gov.br/index.php', '_blank')}
                    className="h-12 px-5 rounded-xl font-bold uppercase tracking-wider gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 w-full sm:w-auto"
                  >
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                    SIRESP (Regulação)
                  </Button>
                  <Button 
                    onClick={handleFinish}
                    className={cn("h-12 px-8 rounded-xl font-black uppercase tracking-widest gap-2 shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto", btnColor)}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Finalizar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* MODAL DE EXAMES (FAST-TRACK) */}
    <Dialog open={isExamsModalOpen} onOpenChange={setIsExamsModalOpen}>
      <DialogContent className="sm:max-w-[700px] rounded-[1.5rem] p-0 overflow-hidden glass-card-premium bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col max-h-[95vh] z-[100]">
        <div className="px-5 py-4 border-b border-white/30 dark:border-slate-700/50 bg-transparent shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-purple-600 dark:text-purple-400" /> Exames Clínicos e de Imagem
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col bg-transparent">
          <FastTrackExamsModal patient={patient} onClose={() => setIsExamsModalOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
