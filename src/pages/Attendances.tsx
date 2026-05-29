import { useState } from "react";
import { usePatients, Patient } from "@/hooks/use-patients";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stethoscope, User, Calendar, ExternalLink, Activity, Megaphone, X, Volume2, VolumeX, Building2, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn, formatWords, formatPatientNameLGPD } from "@/lib/utils";
import { PatientDetailsModal } from "@/components/PatientDetailsModal";
import { ExamsModal } from "@/components/PatientEvolution/Modals/ExamsModal";
import { useEffect, useRef } from "react";
import { AlertTriangle, FlaskConical } from "lucide-react";

export default function Attendances() {
  const navigate = useNavigate();
  const { 
    patients, 
    callPatient, 
    callTicket, 
    isAudioEnabled, 
    setIsAudioEnabled, 
    updatePatient,
    resetSystem
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
    risk: Patient['risk'];
    priority: Patient['priority'];
    room: string;
    age?: number;
    cpf?: string;
  } | null>(null);

  const getRiskDetails = (risk: string) => {
    switch(risk) {
      case 'emergency': return { label: 'Emergência', color: 'bg-red-600 hover:bg-red-700 text-white' };
      case 'very-urgent': return { label: 'Muito Urgente', color: 'bg-orange-500 hover:bg-orange-600 text-white' };
      case 'urgent': return { label: 'Urgente', color: 'bg-[#FFDE21] hover:bg-[#FFDE21]/90 text-black' };
      case 'less-urgent': return { label: 'Pouco Urgente', color: 'bg-green-500 hover:bg-green-600 text-white' };
      case 'not-urgent': return { label: 'Não Urgente', color: 'bg-blue-500 hover:bg-blue-600 text-white' };
      case 'evasion': return { label: 'Evasão', color: 'bg-slate-400 hover:bg-slate-500 text-white' };
      default: return { label: risk, color: 'bg-slate-500 text-white' };
    }
  };

  const attendingPatients = patients.filter(p => p.status === 'attending');
  const classifiedPatients = patients.filter(p => !attendingPatients.includes(p) && p.status === 'waiting' && p.risk);

  const handleCall = (patient: Patient) => {
    const ticketToUse = patient.ticket || "GERAL";
    
    const roomToUse = patient.sector || 'CONSULTÓRIO MÉDICO';
    
    setCallingTicket({ 
      ticket: ticketToUse, 
      patientName: patient.name,
      risk: patient.risk || 'not-urgent',
      priority: patient.priority || 'normal',
      room: roomToUse,
      age: patient.age,
      cpf: patient.cpf
    });
    setShowCallControl(true);
    callTicket(ticketToUse, roomToUse, patient.risk || 'not-urgent', patient.name);
    
    toast.success(`Chamando: ${formatWords(patient.name)}`, {
      description: "Paciente notificado no painel da sala de espera.",
      duration: 5000,
      icon: <Megaphone className="h-4 w-4 text-primary" />,
    });
  };

  const handleAttend = (patient: Patient) => {
    updatePatient(patient.id, { status: 'attending' });
    toast.success(`Iniciando atendimento: ${formatWords(patient.name)}`, {
      icon: <Stethoscope className="h-4 w-4 text-green-500" />,
    });
  };

  const gravePatients = classifiedPatients.filter(p => p.risk === 'emergency' || p.risk === 'very-urgent');
  const prevGraveCount = useRef(gravePatients.length);

  useEffect(() => {
    if (gravePatients.length > prevGraveCount.current) {
      toast.error('NOVO PACIENTE GRAVE AGUARDANDO!', {
        description: 'Um novo paciente foi classificado com risco Emergência ou Muito Urgente.',
        icon: <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />,
        duration: 8000,
      });
    }
    prevGraveCount.current = gravePatients.length;
  }, [gravePatients.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#006699]/10 dark:bg-sky-400/15 flex items-center justify-center text-[#006699] dark:text-sky-400 shadow-inner">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[#006699] dark:text-sky-400 uppercase leading-none">
              Atendimentos Clínicos
            </h1>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
              Gerenciamento de consultas e procedimentos médicos
            </p>
          </div>
        </div>
      </div>

      {gravePatients.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-red-600 border-2 border-red-500 rounded-2xl p-6 shadow-[0_0_40px_rgba(220,38,38,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 text-white">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse shrink-0">
              <AlertTriangle className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">🚨 Alerta de Risco Grave!</h2>
              <p className="text-xs font-bold tracking-widest uppercase opacity-90 mt-1">
                {gravePatients.length} paciente(s) com classificação Vermelha/Laranja aguardando na fila.
              </p>
            </div>
          </div>
          <Button 
            className="w-full sm:w-auto h-12 bg-white hover:bg-slate-100 text-red-600 font-black uppercase tracking-[0.15em] text-xs shadow-xl rounded-xl transition-all hover:scale-105"
            onClick={() => handleAttend(gravePatients[0])}
          >
            <Stethoscope className="h-4 w-4 mr-2" />
            Atender Imediatamente
          </Button>
        </motion.div>
      )}

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { 
            id: 'attending', 
            label: "Em Atendimento", 
            value: attendingPatients.length, 
            color: "text-[#006699] dark:text-sky-400", 
            bg: "bg-[#006699]/10 dark:bg-sky-400/15", 
            activeClass: "border-[#006699]/55 dark:border-sky-400/55 ring-2 ring-[#006699]/10 dark:ring-sky-400/10 bg-[#006699]/5 dark:bg-sky-400/5",
            icon: Activity 
          },
          { 
            id: 'waiting', 
            label: "Aguardando", 
            value: classifiedPatients.length, 
            color: "text-amber-600 dark:text-amber-400", 
            bg: "bg-amber-500/10 dark:bg-amber-500/20", 
            activeClass: "border-amber-500/55 dark:border-amber-400/70 ring-2 ring-amber-500/10 dark:ring-amber-400/10 bg-amber-500/5 dark:bg-amber-500/10",
            icon: Calendar 
          },
          { 
            id: 'all', 
            label: "Total Geral", 
            value: patients.filter(p => p.status !== 'evasion').length, 
            color: "text-blue-600 dark:text-blue-400", 
            bg: "bg-blue-500/10 dark:bg-blue-500/20", 
            activeClass: "border-blue-500/55 dark:border-blue-400/70 ring-2 ring-blue-500/10 dark:ring-blue-400/10 bg-blue-500/5 dark:bg-blue-500/10",
            icon: Stethoscope 
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
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006699] dark:text-sky-400 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#006699] dark:text-sky-400" />
              Em Atendimento
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {attendingPatients.map((patient) => {
                const risk = getRiskDetails(patient.risk || 'not-urgent');
                return (
                  <Card key={patient.id} className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500 group">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge className={cn(
                          risk.color,
                          "text-[10px] font-bold px-2 py-1.5 border-0 rounded-full shadow-sm min-w-[125px] justify-center transition-transform hover:scale-105 active:scale-95"
                        )}>
                          {risk.label}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                          Iniciado há 15 min
                        </span>
                      </div>
                      <CardTitle className="mt-2 text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{formatWords(patient.name)}</CardTitle>
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                           <Building2 className="h-3 w-3 text-[#006699] dark:text-sky-405" />
                           Setor: <span className="text-slate-800 dark:text-slate-200 font-black">{patient.sector || 'Não definido'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                           <User className="h-3 w-3 text-[#006699] dark:text-sky-405" />
                           Responsável: <span className="text-[#006699] dark:text-sky-400 font-black">{patient.responsibleProfessional || 'Não atribuído'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-2">
                         <span>ID: {patient.id}</span>
                         <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-800"></span>
                         <span>{patient.age} anos</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex justify-end gap-2 pb-4 pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 rounded-xl gap-2 font-black uppercase text-[10px] tracking-wider text-slate-550 dark:text-slate-450 hover:text-primary dark:hover:text-sky-400 hover:bg-primary/5 dark:hover:bg-sky-400/5 cursor-pointer border-0" 
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        <Info className="h-3.5 w-3.5" />
                        Detalhes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 rounded-xl gap-2 font-black uppercase text-[10px] tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer" 
                        onClick={() => navigate(`/paciente/${patient.id}`, { state: { from: '/atendimentos', label: 'Atendimentos' } })}
                      >
                        <User className="h-3.5 w-3.5" />
                        Prontuário
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm" 
                        className="h-9 rounded-xl gap-2 font-black uppercase text-[10px] tracking-wider text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900/20 cursor-pointer" 
                        onClick={() => navigate(`/paciente/${patient.id}`, { state: { from: '/atendimentos', label: 'Atendimentos', activeTab: 'exams' } })}
                      >
                        <FlaskConical className="h-3.5 w-3.5" />
                        Exames
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-9 rounded-xl gap-2 font-black uppercase text-[10px] tracking-wider bg-[#006699] hover:bg-[#005580] dark:bg-sky-600 dark:hover:bg-sky-500 text-white shadow-lg shadow-[#006699]/10 dark:shadow-none border-0 cursor-pointer" 
                        onClick={() => navigate(`/paciente/${patient.id}/evolucao`, { state: { from: '/atendimentos', label: 'Atendimentos' } })}
                      >
                        <Stethoscope className="h-3.5 w-3.5" />
                        Evoluir
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
              {attendingPatients.length === 0 && (
                <div className="p-12 glass-card border border-dashed border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/20 rounded-xl text-center">
                  <div className="flex flex-col items-center gap-2">
                    <User className="h-8 w-8 text-slate-400 dark:text-slate-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Nenhum atendimento em curso</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Aguardando */}
        {(activeFilter === 'all' || activeFilter === 'waiting') && (
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006699] dark:text-sky-450 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#006699] dark:text-sky-400" />
              Aguardando Chamada
            </h2>
            <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800/25">
                  {classifiedPatients.map((patient) => {
                    const risk = getRiskDetails(patient.risk || 'not-urgent');
                    return (
                      <div key={patient.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="min-w-[120px] flex justify-center">
                            <Badge className={cn(
                              risk.color,
                              "text-[10px] font-bold px-2 py-1.5 border-0 rounded-full shadow-sm w-full justify-center"
                            )}>
                              {risk.label}
                            </Badge>
                          </div>
                          <div 
                            className="flex-1 cursor-pointer group/row"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setIsDetailsModalOpen(true);
                            }}
                          >
                            <p className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-tight group-hover/row:text-[#006699] dark:group-hover/row:text-sky-400 transition-colors">{formatWords(patient.name)}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{patient.age} anos</span>
                              <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">ID: {patient.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-9 rounded-xl px-3 gap-2 text-primary dark:text-sky-400 hover:bg-primary/5 dark:hover:bg-sky-400/5 font-black uppercase text-[10px] tracking-wider cursor-pointer border-0"
                            onClick={() => handleCall(patient)}
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                            Chamar Senha
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-9 rounded-xl px-3 gap-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-black uppercase text-[10px] tracking-wider cursor-pointer border-0"
                            onClick={() => handleAttend(patient)}
                          >
                            <Stethoscope className="h-3.5 w-3.5" />
                            Atender
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-9 w-9 rounded-xl p-0 text-slate-500 hover:text-[#006699] dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-0 cursor-pointer"
                            onClick={() => navigate(`/paciente/${patient.id}`, { state: { from: '/atendimentos', label: 'Atendimentos' } })}
                            title="Ver Prontuário"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {classifiedPatients.length === 0 && (
                    <div className="p-12 text-center">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Fila de espera vazia</p>
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
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-xl border-none shadow-2xl bg-white dark:bg-slate-950 [&>button]:hidden">
          <DialogHeader className={cn(
            "p-6 text-white transition-colors duration-500",
            callingTicket?.risk === 'emergency' ? 'bg-red-600' :
            callingTicket?.risk === 'very-urgent' ? 'bg-orange-500' :
            callingTicket?.risk === 'urgent' ? 'bg-[#FFDE21] text-black' :
            callingTicket?.risk === 'less-urgent' ? 'bg-green-500' :
            (callingTicket?.priority === 'preferential' ? 'bg-purple-600' : 
             callingTicket?.priority === 'pediatric' ? 'bg-orange-500' : 'bg-[#006699] dark:bg-sky-950/60')
          )}>
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
              <Button 
                variant="secondary" 
                size="icon" 
                className="bg-white text-black hover:bg-white/90 dark:bg-white/10 dark:text-slate-100 rounded-xl h-10 w-10 shadow-lg border-none cursor-pointer"
                onClick={() => setShowCallControl(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 text-center">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006699] dark:text-sky-400">Chamando agora</p>
              <h2 className={cn(
                "text-7xl font-black tracking-tighter leading-none mb-4",
                callingTicket?.risk === 'emergency' ? 'text-red-655 dark:text-red-400' :
                callingTicket?.risk === 'very-urgent' ? 'text-orange-500 dark:text-orange-400' :
                callingTicket?.risk === 'urgent' ? 'text-black dark:text-slate-100' :
                callingTicket?.risk === 'less-urgent' ? 'text-green-655 dark:text-green-400' :
                (callingTicket?.priority === 'preferential' ? 'text-purple-600 dark:text-purple-400' : 
                 callingTicket?.priority === 'pediatric' ? 'text-orange-500 dark:text-orange-400' : 'text-[#006699] dark:text-sky-400')
              )}>{callingTicket?.ticket}</h2>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">{formatPatientNameLGPD(callingTicket?.patientName || "")}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{callingTicket?.age} ANOS • CPF: {callingTicket?.cpf}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button 
                onClick={() => {
                  if (callingTicket) {
                    callTicket(callingTicket.ticket, callingTicket.room, callingTicket.risk, callingTicket.patientName);
                    toast.success("Chamada enviada novamente ao painel.");
                  }
                }}
                className={cn(
                  "h-16 rounded-xl text-white font-black uppercase tracking-widest text-sm shadow-xl gap-3 transition-all duration-300 border-0 cursor-pointer",
                  callingTicket?.risk === 'emergency' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' :
                  callingTicket?.risk === 'very-urgent' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-600/20' :
                  callingTicket?.risk === 'urgent' ? 'bg-[#FFDE21] hover:bg-[#FFDE21]/90 shadow-[#FFDE21]/20 text-black' :
                  callingTicket?.risk === 'less-urgent' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' :
                  (callingTicket?.priority === 'preferential' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' : 
                   callingTicket?.priority === 'pediatric' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-600/20' : 'bg-[#006699] hover:bg-[#005580] shadow-[#006699]/20 dark:bg-sky-600 dark:hover:bg-sky-550')
                )}
              >
                <Volume2 className="h-6 w-6" />
                Chamar Novamente
              </Button>

              <div 
                className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/85 transition-colors"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={cn("p-2 rounded-lg", isAudioEnabled ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400')}>
                    {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-slate-800 dark:text-slate-100">Áudio do Painel</p>
                    <p className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase">{isAudioEnabled ? 'Ativado (Voz + Chime)' : 'Desativado (Mudo)'}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "h-8 w-14 rounded-full transition-all relative flex items-center shrink-0",
                    isAudioEnabled ? "bg-green-500" : "bg-slate-300 dark:bg-slate-800"
                  )}
                >
                  <div className={cn(
                    "absolute h-6 w-6 rounded-full bg-white transition-all shadow-md",
                    isAudioEnabled ? "right-1" : "left-1"
                  )} />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <PatientDetailsModal 
        patient={selectedPatient}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

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
