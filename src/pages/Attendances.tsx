import { useState } from "react";
import { usePatients, Patient } from "@/hooks/use-patients";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stethoscope, User, Calendar, ExternalLink, Activity, Megaphone, X, Volume2, VolumeX, Building2, Info, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn, formatWords, formatPatientNameLGPD } from "@/lib/utils";
import { PatientDetailsModal } from "@/components/PatientDetailsModal";
import { ExamsModal } from "@/components/PatientEvolution/Modals/ExamsModal";
import { PatientTimelineModal } from "@/components/PatientTimelineModal";
import { MedicalPerformanceModal } from "@/components/MedicalPerformanceModal";
import { useEffect, useRef } from "react";
import { AlertTriangle, FlaskConical, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PatientRecord from "@/pages/PatientRecord";
import { QuickConsultModal } from "@/components/QuickConsultModal";

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
  
  const [activeDoctor, setActiveDoctor] = useState<string | null>(null);
  
  const [selectedRoom, setSelectedRoom] = useState<string>(() => {
    return localStorage.getItem('upa_active_room') || localStorage.getItem('selectedClinicalRoom') || "CONSULTÓRIO MÉDICO 1";
  });

  useEffect(() => {
    localStorage.setItem('selectedClinicalRoom', selectedRoom);
    const doc = localStorage.getItem('upa_active_doctor');
    if (doc) setActiveDoctor(doc);
  }, [selectedRoom]);

  const handleEndShift = () => {
    localStorage.removeItem("upa_active_room");
    localStorage.removeItem("upa_active_doctor");
    navigate("/painel-medico");
  };

  const [showCallControl, setShowCallControl] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [fastConsultPatient, setFastConsultPatient] = useState<Patient | null>(null);
  const [recordPatientId, setRecordPatientId] = useState<number | null>(null);
  const [queueFilterMode, setQueueFilterMode] = useState<'all' | 'my-room'>('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [timelinePatient, setTimelinePatient] = useState<Patient | null>(null);
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
  const [evasaoPatient, setEvasaoPatient] = useState<{id: string, name: string} | null>(null);
  const [evasaoReason, setEvasaoReason] = useState<string>("");

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

  const riskRank: Record<string, number> = {
    'emergency': 0,
    'very-urgent': 1,
    'urgent': 2,
    'less-urgent': 3,
    'not-urgent': 4,
    'evasion': 5,
  };

  const attendingPatients = patients
    .filter(p => p.status === 'attending')
    .sort((a, b) => {
      const riskA = riskRank[a.risk || 'not-urgent'] ?? 99;
      const riskB = riskRank[b.risk || 'not-urgent'] ?? 99;
      return riskA - riskB;
    });
  const classifiedPatients = patients.filter(p => !attendingPatients.includes(p) && p.status === 'waiting' && p.risk && (p.registrationComplete !== false || p.risk === 'emergency'));
  const displayedWaitingPatients = queueFilterMode === 'all'
    ? classifiedPatients
    : classifiedPatients.filter(p => p.sector === selectedRoom);

  const handleCall = (patient: Patient) => {
    const ticketToUse = patient.ticket || "GERAL";
    
    const roomToUse = selectedRoom;
    
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
    updatePatient(patient.id, { status: 'attending', sector: selectedRoom });
    toast.success(`Iniciando atendimento: ${formatWords(patient.name)}`, {
      icon: <Stethoscope className="h-4 w-4 text-green-500" />,
    });
  };

  const handleFinishFastConsult = (patientId: string, outcome: string) => {
    // Atualiza paciente para completed ou o status de acordo com o outcome
    let newStatus: Patient['status'] = 'completed';
    if (outcome === 'observacao') newStatus = 'observation';
    else if (outcome === 'internacao') newStatus = 'observation'; // ou admitted
    
    updatePatient(patientId, { status: newStatus });
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#006699]/10 dark:bg-sky-400/15 flex items-center justify-center text-[#006699] dark:text-sky-400 shadow-inner">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
              <h1 className="text-4xl font-black tracking-tight text-[#006699] dark:text-sky-400 uppercase leading-none">
                Atendimentos Clínicos
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                Gerenciamento de consultas e procedimentos médicos
              </p>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              onClick={() => setIsPerformanceModalOpen(true)}
              variant="outline"
              className="border-sky-200 dark:border-sky-900/50 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-sky-700 dark:text-sky-400 font-black uppercase tracking-wider rounded-xl gap-2 shadow-sm"
            >
              <Stethoscope className="h-4 w-4" />
              Desempenho Médico
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/40 p-2 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#006699]/10 text-[#006699] dark:bg-sky-400/10 dark:text-sky-400 shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          
          <div className="flex flex-col gap-1 pr-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Visão de Gestão</span>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="h-7 w-[220px] border-none bg-transparent shadow-none p-0 focus:ring-0 text-sm font-black text-foreground">
                <SelectValue placeholder="Filtrar por consultório" />
              </SelectTrigger>
              <SelectContent className="glass-card-premium rounded-xl border-white/20">
                {Array.from({ length: 9 }, (_, i) => (
                  <SelectItem key={i} value={`CONSULTÓRIO CLÍNICO ${i + 1}`} className="font-bold text-xs">
                    CONSULTÓRIO CLÍNICO {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <div key={patient.id} className="p-4 glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-md hover:shadow-lg rounded-xl bg-white/70 dark:bg-slate-900/45 transition-all duration-300 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="min-w-[120px] flex justify-center shrink-0">
                        <Badge className={cn(
                          risk.color,
                          "text-[10px] font-bold px-2 py-1.5 border-0 rounded-full shadow-sm w-full justify-center transition-transform hover:scale-105 active:scale-95"
                        )}>
                          {risk.label}
                        </Badge>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-sm text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">{formatWords(patient.name)}</p>
                          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase shrink-0 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                            Iniciado há 15 min
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                            <User className="h-3 w-3 text-[#006699] dark:text-sky-400" />
                            Resp: <span className="text-slate-700 dark:text-slate-300 font-black">{patient.responsibleProfessional || 'Não atribuído'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                            <Building2 className="h-3 w-3 text-[#006699] dark:text-sky-400" />
                            Setor: <span className="text-slate-700 dark:text-slate-300 font-black">{patient.sector || 'Não definido'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                            <span>ID: {patient.id}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                            <span>{patient.age} anos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-end shrink-0 pt-2 xl:pt-0 border-t xl:border-0 border-slate-100 dark:border-slate-800/50 mt-2 xl:mt-0">
                      <Button 
                        size="sm" 
                        className="h-8 rounded-lg gap-1.5 font-black uppercase text-[9px] tracking-wider bg-[#006699] hover:bg-[#005580] dark:bg-sky-600 dark:hover:bg-sky-500 text-white cursor-pointer border-0 px-3 shadow-md" 
                        onClick={(e) => {
                           e.stopPropagation();
                           setFastConsultPatient(patient);
                        }}
                      >
                        <Stethoscope className="h-3.5 w-3.5" />
                        Continuar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 rounded-lg gap-1.5 font-black uppercase text-[9px] tracking-wider text-slate-550 dark:text-slate-450 hover:text-sky-500 hover:bg-sky-500/5 cursor-pointer border-0 px-2" 
                        onClick={() => setTimelinePatient(patient)}
                      >
                        <Activity className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Jornada</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 rounded-lg gap-1.5 font-black uppercase text-[9px] tracking-wider text-slate-550 dark:text-slate-450 hover:text-primary dark:hover:text-sky-400 hover:bg-primary/5 dark:hover:bg-sky-400/5 cursor-pointer border-0 px-2" 
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        <Info className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Detalhes</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 rounded-lg gap-1.5 font-black uppercase text-[9px] tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer px-2" 
                        onClick={() => setRecordPatientId(patient.id)}
                      >
                        <User className="h-3.5 w-3.5" />
                        Prontuário
                      </Button>
                    </div>
                  </div>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 bg-transparent">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006699] dark:text-sky-400 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#006699] dark:text-sky-400" />
                Aguardando Chamada
              </h2>
              <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-0.5 rounded-xl self-start sm:self-auto shrink-0 shadow-sm">
                <button
                  onClick={() => setQueueFilterMode('all')}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-0",
                    queueFilterMode === 'all' 
                      ? "bg-[#006699] text-white shadow-sm font-black" 
                      : "text-slate-500 hover:text-slate-705 dark:text-slate-400 dark:hover:text-slate-200 bg-transparent"
                  )}
                >
                  Fila Geral
                </button>
                <button
                  onClick={() => setQueueFilterMode('my-room')}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-0",
                    queueFilterMode === 'my-room' 
                      ? "bg-[#006699] text-white shadow-sm font-black" 
                      : "text-slate-500 hover:text-slate-705 dark:text-slate-400 dark:hover:text-slate-200 bg-transparent"
                  )}
                >
                  Minha Sala
                </button>
              </div>
            </div>
            <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800/25">
                  {displayedWaitingPatients.map((patient) => {
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
                              <span className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase">{patient.age} anos</span>
                              <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">ID: {patient.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            className="h-9 px-3 rounded-xl gap-1.5 font-black uppercase text-[10px] tracking-widest bg-[#006699] hover:bg-[#005580] dark:bg-sky-600 dark:hover:bg-sky-500 text-white shadow-md border-0 mr-2"
                            onClick={(e) => {
                               e.stopPropagation();
                               handleAttend(patient);
                               setFastConsultPatient(patient);
                            }}
                          >
                            <Stethoscope className="h-3.5 w-3.5" />
                            Atender
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-9 w-9 rounded-xl p-0 text-slate-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 cursor-pointer border-0"
                            onClick={() => setTimelinePatient(patient)}
                            title="Ver Jornada do Paciente"
                          >
                            <Activity className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-9 w-9 rounded-xl p-0 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer border-0"
                            onClick={() => setEvasaoPatient({ id: patient.id, name: patient.name })}
                            title="Registrar Evasão"
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>

                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-9 w-9 rounded-xl p-0 text-slate-500 hover:text-[#006699] dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-0 cursor-pointer"
                            onClick={() => setRecordPatientId(patient.id)}
                            title="Ver Prontuário"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {displayedWaitingPatients.length === 0 && (
                    <div className="p-12 text-center">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">
                         {queueFilterMode === 'all' ? 'Fila de espera vazia' : 'Nenhum paciente direcionado para esta sala'}
                       </p>
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
      <Dialog open={!!evasaoPatient} onOpenChange={(open) => {
        if (!open) {
          setEvasaoPatient(null);
          setEvasaoReason("");
        }
      }}>
        <DialogContent className="sm:max-w-[450px] rounded-xl p-8 border-none shadow-2xl bg-white dark:bg-slate-950 text-foreground">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center text-red-550 dark:text-red-400 animate-pulse">
              <LogOut className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white">Confirmar Evasão?</DialogTitle>
              <DialogDescription className="text-sm font-medium leading-relaxed px-2 text-slate-500 dark:text-slate-400">
                Você está registrando que o paciente <strong className="text-red-550 dark:text-red-400">{formatWords(evasaoPatient?.name || "")}</strong> se retirou da unidade sem concluir o atendimento clínico.
              </DialogDescription>
            </div>
            
            <div className="w-full text-left mt-2 mb-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-2">
                Motivo da Evasão (Opcional)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Demora no atendimento",
                  "Melhora dos sintomas",
                  "Procurou outro serviço",
                  "Desistência voluntária",
                  "Ausente após 3 chamadas"
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setEvasaoReason(reason === evasaoReason ? "" : reason)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl border-2 transition-all flex items-center justify-between group cursor-pointer",
                      evasaoReason === reason 
                        ? "border-red-500 bg-red-500/5 font-bold text-red-600 dark:text-red-400" 
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40"
                    )}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-tight truncate">{reason}</span>
                    <div className={cn(
                      "h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                      evasaoReason === reason ? "border-red-500 bg-red-500" : "border-slate-300 dark:border-slate-700"
                    )}>
                      {evasaoReason === reason && <div className="h-1.5 w-1.5 rounded-full bg-white dark:bg-slate-950" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full pt-2">
              <Button 
                variant="outline" 
                className="h-12 rounded-xl font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                onClick={() => {
                  setEvasaoPatient(null);
                  setEvasaoReason("");
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="h-12 rounded-xl bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white font-black uppercase tracking-widest shadow-lg shadow-red-200 dark:shadow-none border-0 cursor-pointer"
                onClick={() => {
                  if (evasaoPatient) {
                    updatePatient(evasaoPatient.id, { 
                      status: 'evasao',
                      justification: evasaoReason ? `Motivo da evasão: ${evasaoReason}` : undefined
                    });
                    toast.warning(evasaoReason ? `Evasão registrada: ${evasaoReason}` : `Evasão registrada: ${evasaoPatient.name}`);
                    setEvasaoPatient(null);
                    setEvasaoReason("");
                  }
                }}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <PatientDetailsModal 
        patient={selectedPatient}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
      <PatientTimelineModal 
        patient={timelinePatient}
        isOpen={!!timelinePatient}
        onClose={() => setTimelinePatient(null)}
      />
      <MedicalPerformanceModal 
        patients={patients}
        isOpen={isPerformanceModalOpen}
        onClose={() => setIsPerformanceModalOpen(false)}
        onViewTimeline={(p) => setTimelinePatient(p)}
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

      {/* Patient Record Modal (Quick View) */}
      <Dialog open={!!recordPatientId} onOpenChange={(open) => !open && setRecordPatientId(null)}>
        <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 overflow-y-auto glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem] flex flex-col bg-white dark:bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-900/80 dark:to-slate-950/90 pointer-events-none -z-10" />
          <div className="p-4 sm:p-6 sticky top-0 z-50 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10 flex justify-between items-center shrink-0 shadow-sm rounded-t-[2rem]">
            <h2 className="text-xl font-black uppercase tracking-widest text-foreground flex items-center gap-3 drop-shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#006699]/20 to-[#006699]/5 dark:from-sky-400/20 dark:to-sky-400/5 flex items-center justify-center border border-[#006699]/20 dark:border-sky-400/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                <FileText className="h-5 w-5 text-[#006699] dark:text-sky-400 drop-shadow-[0_0_8px_rgba(0,102,153,0.5)] dark:drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
              </div>
              Prontuário Completo
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10">
            {recordPatientId && <PatientRecord patientId={String(recordPatientId)} />}
          </div>
        </DialogContent>
      </Dialog>
      
      <QuickConsultModal 
        patient={fastConsultPatient}
        isOpen={!!fastConsultPatient}
        onClose={() => setFastConsultPatient(null)}
        onComplete={handleFinishFastConsult}
        hidePediatricOptions={true}
      />
    </motion.div>
  );
}
