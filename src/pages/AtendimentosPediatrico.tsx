import { useState } from "react";
import { usePatients, Patient } from "@/hooks/use-patients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Baby, Stethoscope, User, Calendar, ExternalLink, Activity, Megaphone, X, Volume2, VolumeX, Building2, Info, FlaskConical } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn, formatWords, formatPatientNameLGPD } from "@/lib/utils";
import { PatientDetailsModal } from "@/components/PatientDetailsModal";
import { ExamsModal } from "@/components/PatientEvolution/Modals/ExamsModal";

export default function AtendimentosPediatrico() {
  const navigate = useNavigate();
  const {
    patients,
    callPatient,
    callTicket,
    isAudioEnabled,
    setIsAudioEnabled,
    updatePatient,
  } = usePatients();
  const [showCallControl, setShowCallControl] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false);
  const [patientForExams, setPatientForExams] = useState<Patient | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'attending' | 'waiting'>('all');
  const [callingTicket, setCallingTicket] = useState<{
    ticket: string;
    patientName: string;
    risk: Patient["risk"];
    priority: Patient["priority"];
    room: string;
    age?: number;
    cpf?: string;
  } | null>(null);

  // Filtra apenas pacientes pediátricos (priority === 'pediatric' ou age <= 14)
  const pediatricPatients = patients.filter(
    (p) => p.priority === "pediatric" || (p.age !== undefined && p.age <= 14)
  );

  const attendingPatients = pediatricPatients.filter((p) => p.status === "attending");
  const waitingPatients = pediatricPatients.filter(
    (p) => p.status === "waiting" && p.risk && !attendingPatients.includes(p)
  );

  const getRiskDetails = (risk: string) => {
    switch (risk) {
      case "emergency": return { label: "Emergência", color: "bg-red-600 text-white" };
      case "very-urgent": return { label: "Muito Urgente", color: "bg-orange-500 text-white" };
      case "urgent": return { label: "Urgente", color: "bg-[#FFDE21] text-black" };
      case "less-urgent": return { label: "Pouco Urgente", color: "bg-green-500 text-white" };
      case "not-urgent": return { label: "Não Urgente", color: "bg-blue-500 text-white" };
      default: return { label: risk, color: "bg-slate-500 text-white" };
    }
  };

  const handleCall = (patient: Patient) => {
    const ticketToUse = patient.ticket || "PED";
    const roomToUse = patient.sector || "TRIAGEM PEDIÁTRICA";
    setCallingTicket({
      ticket: ticketToUse,
      patientName: patient.name,
      risk: patient.risk || "not-urgent",
      priority: patient.priority || "pediatric",
      room: roomToUse,
      age: patient.age,
      cpf: patient.cpf,
    });
    setShowCallControl(true);
    callTicket(ticketToUse, roomToUse, patient.risk || "not-urgent", patient.name);
    toast.success(`Chamando: ${formatWords(patient.name)}`, {
      description: "Paciente notificado no painel da sala de espera.",
      duration: 5000,
      icon: <Megaphone className="h-4 w-4 text-orange-500" />,
    });
  };

  const handleAttend = (patient: Patient) => {
    updatePatient(patient.id, { status: "attending" });
    toast.success(`Iniciando atendimento: ${formatWords(patient.name)}`, {
      icon: <Baby className="h-4 w-4 text-orange-500" />,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Baby className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">
              Atendimentos Pediátrico
            </h1>
            <p className="text-muted-foreground text-[11px] font-black uppercase tracking-widest mt-0.5">
              Gerenciamento de consultas e procedimentos pediátricos
            </p>
          </div>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { 
            id: 'attending', 
            label: "Em Atendimento", 
            value: attendingPatients.length, 
            color: "text-orange-500 dark:text-orange-400", 
            bg: "bg-orange-500/10 dark:bg-orange-500/20", 
            activeClass: "border-orange-500/55 dark:border-orange-400/55 ring-2 ring-orange-500/10 dark:ring-orange-400/10 bg-orange-500/5 dark:bg-orange-500/10",
            icon: Activity 
          },
          { 
            id: 'waiting', 
            label: "Aguardando", 
            value: waitingPatients.length, 
            color: "text-amber-600 dark:text-amber-400", 
            bg: "bg-amber-500/10 dark:bg-amber-500/20", 
            activeClass: "border-amber-500/55 dark:border-amber-400/70 ring-2 ring-amber-500/10 dark:ring-amber-400/10 bg-amber-500/5 dark:bg-amber-500/10",
            icon: Calendar 
          },
          { 
            id: 'all', 
            label: "Total Pediátrico", 
            value: pediatricPatients.length, 
            color: "text-blue-600 dark:text-blue-400", 
            bg: "bg-blue-500/10 dark:bg-blue-500/20", 
            activeClass: "border-blue-500/55 dark:border-blue-400/70 ring-2 ring-blue-500/10 dark:ring-blue-400/10 bg-blue-500/5 dark:bg-blue-500/10",
            icon: Baby 
          },
        ].map((stat) => {
          const isActive = activeFilter === stat.id;
          return (
            <motion.div 
              key={stat.id} 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter(stat.id as 'all' | 'attending' | 'waiting')}
              className={cn(
                "glass-card border shadow-xl rounded-xl p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer select-none",
                isActive 
                  ? stat.activeClass
                  : "border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/45 hover:shadow-2xl"
              )}
            >
              <div className={cn("p-3 rounded-2xl transition-transform duration-300", stat.bg, stat.color, isActive && "scale-110")}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className={cn(
        "grid gap-8",
        activeFilter === 'all' ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"
      )}>
        {/* Em Atendimento */}
        {(activeFilter === 'all' || activeFilter === 'attending') && (
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-500" />
            Em Atendimento
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {attendingPatients.map((patient) => {
              const risk = getRiskDetails(patient.risk || "not-urgent");
              return (
                <Card key={patient.id} className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500 group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className={cn(risk.color, "text-[10px] font-bold px-2 py-1.5 border-0 rounded-full shadow-sm min-w-[120px] justify-center")}>
                        {risk.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium">Iniciado há 15 min</span>
                    </div>
                    <CardTitle className="mt-2 text-sm font-bold text-foreground">{formatWords(patient.name)}</CardTitle>
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
                        <Building2 className="h-3 w-3" />
                        Setor: <span className="text-foreground">{patient.sector || "Não definido"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
                        <User className="h-3 w-3" />
                        Responsável: <span className="text-orange-500">{patient.responsibleProfessional || "Não atribuído"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium mt-2">
                      <span>ID: {patient.id}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span>{patient.age} anos</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-end gap-2 pb-4 pt-2">
                    <Button variant="ghost" size="sm" className="h-9 rounded-xl gap-2 font-bold text-muted-foreground hover:text-orange-500 hover:bg-orange-500/5"
                       onClick={() => { setSelectedPatient(patient); setIsDetailsModalOpen(true); }}>
                      <Info className="h-3.5 w-3.5" /> Detalhes
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 rounded-xl gap-2 font-bold border-slate-200"
                       onClick={() => navigate(`/paciente/${patient.id}`, { state: { from: "/atendimentos-pediatrico", label: "Pediátrico" } })}>
                      <User className="h-3.5 w-3.5" /> Prontuário
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 rounded-xl gap-2 font-black uppercase text-[10px] tracking-wider text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-900/50 dark:hover:bg-purple-900/20 cursor-pointer" 
                       onClick={() => navigate(`/paciente/${patient.id}`, { state: { from: "/atendimentos-pediatrico", label: "Pediátrico", activeTab: 'exams' } })}>
                      <FlaskConical className="h-3.5 w-3.5" /> Exames
                    </Button>
                    <Button size="sm" className="h-9 rounded-xl gap-2 font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                       onClick={() => navigate(`/paciente/${patient.id}/evolucao`, { state: { from: "/atendimentos-pediatrico", label: "Pediátrico" } })}>
                      <Stethoscope className="h-3.5 w-3.5" /> Evoluir
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            {attendingPatients.length === 0 && (
              <div className="p-12 bg-white/30 dark:bg-slate-900/20 border border-dashed border-slate-200/50 dark:border-slate-800/40 rounded-xl text-center">
                <div className="flex flex-col items-center gap-2">
                  <Baby className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nenhum atendimento pediátrico em curso</p>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Aguardando */}
        {(activeFilter === 'all' || activeFilter === 'waiting') && (
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Aguardando Chamada
          </h2>
          <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500">
            <CardContent className="p-0">
              <div className="divide-y divide-border/30">
                {waitingPatients.map((patient) => {
                  const risk = getRiskDetails(patient.risk || "not-urgent");
                  return (
                    <div key={patient.id} className="p-4 flex items-center justify-between hover:bg-muted/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="min-w-[120px] flex justify-center">
                          <Badge className={cn(risk.color, "text-[10px] font-bold px-2 py-1.5 border-0 rounded-full shadow-sm w-full justify-center")}>
                            {risk.label}
                          </Badge>
                        </div>
                        <div className="flex-1 cursor-pointer group/row" onClick={() => { setSelectedPatient(patient); setIsDetailsModalOpen(true); }}>
                          <p className="font-bold text-sm text-foreground group-hover/row:text-orange-500 transition-colors">{formatWords(patient.name)}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase">{patient.age} anos</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">ID: {patient.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="h-9 rounded-xl px-3 gap-2 text-orange-500 hover:bg-orange-500/5 font-black uppercase text-[10px] tracking-wider" onClick={() => handleCall(patient)}>
                          <Volume2 className="h-3.5 w-3.5" /> Chamar Senha
                        </Button>
                        <Button size="sm" variant="ghost" className="h-9 rounded-xl px-3 gap-2 text-emerald-600 hover:bg-emerald-50 font-black uppercase text-[10px] tracking-wider" onClick={() => handleAttend(patient)}>
                          <Stethoscope className="h-3.5 w-3.5" /> Atender
                        </Button>
                        <Button size="sm" variant="ghost" className="h-9 w-9 rounded-xl p-0 text-muted-foreground hover:text-orange-500"
                          onClick={() => navigate(`/paciente/${patient.id}`, { state: { from: "/atendimentos-pediatrico", label: "Pediátrico" } })}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {waitingPatients.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fila pediátrica vazia</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        )}
      </div>

      {/* Call Control Dialog */}
      <Dialog open={showCallControl} onOpenChange={setShowCallControl}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl [&>button]:hidden">
          <DialogHeader className="bg-orange-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Megaphone className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black uppercase tracking-tight text-white">Controle de Chamada</DialogTitle>
                  <DialogDescription className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-0.5">Sincronizado com o Painel Central</DialogDescription>
                </div>
              </div>
              <Button variant="secondary" size="icon" className="bg-white text-black hover:bg-white/90 rounded-xl h-10 w-10 shadow-lg border-none" onClick={() => setShowCallControl(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-8 bg-background text-center">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Chamando agora</p>
              <h2 className="text-7xl font-black tracking-tighter leading-none mb-4 text-orange-500">{callingTicket?.ticket}</h2>
              <p className="text-sm font-bold text-slate-500 uppercase">{formatPatientNameLGPD(callingTicket?.patientName || "")}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{callingTicket?.age} ANOS • CPF: {callingTicket?.cpf}</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Button onClick={() => { if (callingTicket) { callTicket(callingTicket.ticket, callingTicket.room, callingTicket.risk, callingTicket.patientName); toast.success("Chamada enviada novamente ao painel."); } }}
                className="h-16 rounded-2xl text-white font-black uppercase tracking-widest text-sm shadow-xl gap-3 bg-orange-500 hover:bg-orange-600 shadow-orange-500/20">
                <Volume2 className="h-6 w-6" /> Chamar Novamente
              </Button>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border cursor-pointer hover:bg-muted/70 transition-colors" onClick={() => setIsAudioEnabled(!isAudioEnabled)}>
                <div className="flex items-center gap-3 text-left">
                  <div className={`p-2 rounded-lg ${isAudioEnabled ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                    {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase">Áudio do Painel</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">{isAudioEnabled ? "Ativado (Voz + Chime)" : "Desativado (Mudo)"}</p>
                  </div>
                </div>
                <div className={cn("h-8 w-14 rounded-full transition-all relative flex items-center shrink-0", isAudioEnabled ? "bg-green-500" : "bg-slate-400")}>
                  <div className={cn("absolute h-6 w-6 rounded-full bg-white transition-all shadow-md", isAudioEnabled ? "right-1" : "left-1")} />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PatientDetailsModal patient={selectedPatient} isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} />
      
      {/* Exams Modal Dialog */}
      <Dialog open={isExamsModalOpen} onOpenChange={setIsExamsModalOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border-0 shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-blue-600" /> Solicitar Exames
            </DialogTitle>
          </DialogHeader>
          {patientForExams && (
            <ExamsModal patient={patientForExams} onClose={() => setIsExamsModalOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
