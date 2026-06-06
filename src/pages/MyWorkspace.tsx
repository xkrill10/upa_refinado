import React, { useState, useEffect, useRef } from "react";
import { usePatients, Patient } from "@/hooks/use-patients";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Clock, Users, ArrowRight, User, Baby, Activity, LogOut, CheckCircle2, PauseCircle, Megaphone, AlertTriangle, X, Volume2, VolumeX, FileText, Info, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn, formatWords, formatPatientNameLGPD, formatPatientAge } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PatientRecord from "@/pages/PatientRecord";
import { PatientDetailsModal } from "@/components/PatientDetailsModal";
import { QuickConsultModal } from "@/components/QuickConsultModal";

const RISK_ORDER: Record<string, number> = { 
  'emergency': 0, 
  'very-urgent': 1, 
  'urgent': 2, 
  'less-urgent': 3, 
  'not-urgent': 4,
  'evasion': 5
};

export default function MyWorkspace() {
  const navigate = useNavigate();
  const { patients, updatePatient, callTicket, isAudioEnabled, setIsAudioEnabled } = usePatients();
  
  const [activeRoom, setActiveRoom] = useState<string>("");
  const [activeDoctor, setActiveDoctor] = useState<string>("");
  const [crmNumber, setCrmNumber] = useState("");
  const [crmState, setCrmState] = useState("");
  const [showCallControl, setShowCallControl] = useState(false);
  const [recordPatientId, setRecordPatientId] = useState<string | null>(null);
  const [isEndShiftModalOpen, setIsEndShiftModalOpen] = useState(false);
  const [finishingPatient, setFinishingPatient] = useState<Patient | null>(null);
  const [detailsPatient, setDetailsPatient] = useState<Patient | null>(null);
  const [fastConsultPatient, setFastConsultPatient] = useState<Patient | null>(null);
  const [callingTicket, setCallingTicket] = useState<{
    ticket: string;
    patientName: string;
    risk: Patient["risk"];
    priority: Patient["priority"];
    room: string;
    age?: number;
    cpf?: string;
  } | null>(null);

  useEffect(() => {
    const room = localStorage.getItem("upa_active_room");
    const doctor = localStorage.getItem("upa_active_doctor");
    
    if (!room || !doctor) {
      toast.error("Acesso negado", { description: "Por favor, assuma um consultório primeiro." });
      navigate("/painel-medico");
      return;
    }
    
    setActiveRoom(room);
    setActiveDoctor(doctor);
    setCrmNumber(localStorage.getItem("upa_stamp_number") || "");
    setCrmState(localStorage.getItem("upa_stamp_state") || "");
  }, [navigate]);

  const prevPatientsRef = useRef<Patient[]>([]);

  useEffect(() => {
    if (prevPatientsRef.current.length > 0) {
      patients.forEach(newPatient => {
        const oldPatient = prevPatientsRef.current.find(p => p.id === newPatient.id);
        if (oldPatient) {
          newPatient.exams?.forEach(newExam => {
            const oldExam = oldPatient.exams?.find(e => e.id === newExam.id);
            if (oldExam && oldExam.status !== 'completed' && newExam.status === 'completed') {
              // Verifica se o paciente está associado a este médico
              if (newPatient.sector === activeRoom || newPatient.subStatus === 'reaval') {
                toast.success(`Exame Pronto: ${newExam.name}`, {
                  description: `O resultado de ${formatWords(newPatient.name)} já está disponível no prontuário!`,
                  duration: 8000,
                  icon: <FlaskConical className="h-4 w-4 text-emerald-500 animate-pulse" />
                });
              }
            }
          });
        }
      });
    }
    prevPatientsRef.current = patients;
  }, [patients, activeRoom]);

  const isEmergencyRoom = activeRoom.toUpperCase().includes("VERMELHA");
  const isPediatric = activeRoom.toUpperCase().includes("PEDIÁTRICO") || activeRoom.toUpperCase().includes("PEDIATRIA");
  const isAdultClinical = !isPediatric && !isEmergencyRoom;

  // Filter patients for this specific queue
  const relevantPatients = patients.filter(p => {
    if (p.status === 'completed' || p.status === 'evasion') return false;
    const isPatientPediatric = p.priority === "pediatric" || (p.age !== undefined && p.age < 12);
    const isCritical = p.risk === 'emergency';

    // Se o médico estiver na Sala Vermelha: Só atende os críticos (Vermelho)
    if (isEmergencyRoom) {
      if (!isCritical) return false;
      
      // Se a sala especifica o tipo, filtramos. Senão, aceita todas as idades.
      if (activeRoom.toUpperCase().includes("PEDIATRIA") || activeRoom.toUpperCase().includes("PEDIÁTRIC")) {
          return isPatientPediatric;
      }
      if (activeRoom.toUpperCase().includes("ADULTO")) {
          return !isPatientPediatric;
      }
      return true;
    }

    // Se o médico estiver no Consultório Clínico Normal: Só atende Laranja, Amarelo, Verde, Azul
    if (isCritical) return false;

    return isPediatric ? isPatientPediatric : !isPatientPediatric;
  });

  const myAttendingPatients = relevantPatients.filter(
    p => p.status === 'attending' && p.sector === activeRoom
  ).sort((a, b) => new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime());

  const waitingPatients = relevantPatients.filter(
    p => p.status === 'waiting' && p.risk && (p.registrationComplete !== false || p.risk === 'emergency')
  ).sort((a, b) => {
    // Reavaliações do PRÓPRIO médico vão pro topo
    const aIsReaval = a.subStatus === 'reaval' && a.sector === activeRoom;
    const bIsReaval = b.subStatus === 'reaval' && b.sector === activeRoom;
    if (aIsReaval && !bIsReaval) return -1;
    if (!aIsReaval && bIsReaval) return 1;

    const orderA = RISK_ORDER[a.risk] ?? 99;
    const orderB = RISK_ORDER[b.risk] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
  });

  const handleEndShift = () => {
    localStorage.removeItem("upa_active_room");
    localStorage.removeItem("upa_active_doctor");
    navigate("/painel-medico");
  };

  const handleCall = (patient: Patient) => {
    const ticketToUse = patient.ticket || (isPediatric ? "PED" : "GERAL");
    
    setCallingTicket({ 
      ticket: ticketToUse, 
      patientName: patient.name,
      risk: patient.risk || 'not-urgent',
      priority: patient.priority || 'normal',
      room: activeRoom,
      age: patient.age,
      cpf: patient.cpf
    });
    setShowCallControl(true);
    
    // Move immediately to attending in this room
    updatePatient(patient.id, { 
      status: 'attending', 
      sector: activeRoom,
      subStatus: undefined // clear reaval status if any
    });
    
    callTicket(ticketToUse, activeRoom, patient.risk || 'not-urgent', patient.name);
    
    toast.success(`Chamando: ${formatWords(patient.name)}`, {
      description: "Paciente notificado no painel da sala de espera.",
      duration: 5000,
      icon: <Megaphone className="h-4 w-4 text-primary" />,
    });
  };

  const handlePause = (patient: Patient) => {
    updatePatient(patient.id, { 
      status: 'waiting', 
      subStatus: 'reaval',
      sector: activeRoom // Keep the room so we know it belongs to this doctor
    });
    toast.info(`Paciente ${formatWords(patient.name)} em reavaliação.`, {
      description: "Movido de volta para a fila de espera (Aguardando Exames)."
    });
  };

  const handleFinish = (patient: Patient) => {
    updatePatient(patient.id, { status: 'completed' });
    toast.success(`Atendimento Finalizado!`, {
      description: `Vaga de ${formatWords(patient.name)} liberada no sistema.`
    });
  };

  const handleFinishFastConsult = (patientId: string, outcome: string) => {
    const finalStatus = outcome === 'alta' ? 'completed' : 
                        outcome === 'observacao' ? 'observation' :
                        outcome === 'internacao' ? 'interned' :
                        outcome === 'exames' ? 'waiting' :
                        'completed';
    
    updatePatient(patientId, { 
      status: finalStatus,
      subStatus: outcome === 'exames' ? 'reaval' : undefined
    });
    
    toast.success(`Atendimento Finalizado!`, {
      description: `Destino: ${outcome.toUpperCase()}`
    });
  };

  if (!activeRoom) return null;

  const isBlueTheme = !isPediatric;
  const themeColor = isBlueTheme ? "blue" : "orange";

  return (
    <div className="flex-1 w-full flex flex-col min-h-[calc(100vh-6rem)] relative overflow-hidden bg-transparent">
      {/* Background Decor */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none",
        isBlueTheme ? "bg-[#006699]/5 dark:bg-sky-500/5" : "bg-orange-500/5 dark:bg-orange-500/5"
      )} />
      
      {/* Header Fixo */}
      <div className={cn(
        "sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b shadow-[0_4px_32px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl",
        isBlueTheme 
          ? "bg-white/60 dark:bg-slate-900/40 border-white/50 dark:border-white/10" 
          : "bg-white/60 dark:bg-slate-900/40 border-white/50 dark:border-white/10"
      )}>
        {isEmergencyRoom ? (
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner bg-red-600/10 text-red-600 dark:bg-red-500/15 dark:text-red-400">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
            </div>
            
            {/* Avatar do médico maior e destacado */}
            <div className="relative group shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 to-orange-600 blur-[1px] opacity-40" />
              <img 
                src="/doctor_avatar.png" 
                className="relative h-20 w-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md transition-transform duration-300 group-hover:scale-105"
                alt="Foto do Médico"
              />
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm animate-pulse" />
            </div>

            <div className="flex flex-col justify-center items-start">
              <h1 className="text-2xl font-black uppercase tracking-tight leading-none text-red-600 dark:text-red-400">
                {activeRoom}
              </h1>
              <div className="grid grid-cols-[auto_1fr] mt-1.5 gap-x-1 gap-y-0.5 text-muted-foreground text-[11px] font-black uppercase tracking-[0.2em]">
                <div>Operando:</div>
                <div>{activeDoctor}</div>
                {crmNumber && (
                  <>
                    <div></div>
                    <div>CRM: {crmNumber}{crmState ? `/${crmState}` : ''}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner",
              isBlueTheme ? "bg-[#006699]/10 text-[#006699] dark:bg-sky-500/15 dark:text-sky-400" : "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
            )}>
              {isPediatric ? <Baby className="h-6 w-6" /> : <Stethoscope className="h-6 w-6" />}
            </div>

            {/* Avatar do médico maior e destacado */}
            <div className="relative group shrink-0">
              <div className={cn(
                "absolute inset-0 rounded-2xl blur-[1px] opacity-45",
                isBlueTheme ? "bg-gradient-to-r from-sky-400 to-blue-600" : "bg-gradient-to-r from-orange-400 to-amber-500"
              )} />
              <img 
                src="/doctor_avatar.png" 
                className="relative h-20 w-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md transition-transform duration-300 group-hover:scale-105"
                alt="Foto do Médico"
              />
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm animate-pulse" />
            </div>

            <div className="flex flex-col justify-center items-start">
              <h1 className={cn(
                "text-2xl font-black uppercase tracking-tight leading-none",
                isBlueTheme ? "text-[#006699] dark:text-sky-400" : "text-orange-600 dark:text-orange-500"
              )}>
                {activeRoom}
              </h1>
              <div className="grid grid-cols-[auto_1fr] mt-1.5 gap-x-1 gap-y-0.5 text-muted-foreground text-[11px] font-black uppercase tracking-[0.2em]">
                <div>Operando:</div>
                <div>{activeDoctor}</div>
                {crmNumber && (
                  <>
                    <div></div>
                    <div>CRM: {crmNumber}{crmState ? `/${crmState}` : ''}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <Button 
          variant="outline" 
          className="h-10 rounded-xl gap-2 text-red-500 border-red-200 hover:text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30 px-4 font-black uppercase text-xs tracking-wider shadow-sm"
          onClick={() => setIsEndShiftModalOpen(true)}
        >
          <LogOut className="h-4 w-4" /> Sair / Encerrar
        </Button>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto max-w-[1400px] mx-auto w-full pb-24">
        
        {/* TOP: Pacientes no Consultório */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Dentro do Consultório
            </h2>
            <div className="bg-slate-200/50 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
              {myAttendingPatients.length} Ocupando Sala
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {myAttendingPatients.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={cn(
                    "col-span-full py-16 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]",
                    isBlueTheme 
                      ? "border-white/50 bg-white/40 dark:border-white/10 dark:bg-slate-900/20" 
                      : "border-white/50 bg-white/40 dark:border-white/10 dark:bg-slate-900/20"
                  )}
                >
                  <div className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center shadow-inner",
                    isBlueTheme ? "bg-[#006699]/10 text-[#006699] dark:bg-sky-500/10 dark:text-sky-400" : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                  )}>
                    {isPediatric ? <Baby className="h-8 w-8 animate-pulse" /> : isEmergencyRoom ? <AlertTriangle className="h-8 w-8 animate-pulse text-red-600" /> : <Stethoscope className="h-8 w-8 animate-pulse" />}
                  </div>
                  <div className="text-center space-y-1">
                    <p className={cn(
                      "text-sm font-black uppercase tracking-widest",
                      isBlueTheme ? "text-[#006699] dark:text-sky-400" : "text-orange-600 dark:text-orange-400"
                    )}>
                      Sala Livre para Atendimento
                    </p>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Aguardando você chamar o próximo paciente da fila.
                    </p>
                  </div>
                </motion.div>
              ) : (
                myAttendingPatients.map(patient => (
                  <motion.div 
                    key={patient.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  >
                    <Card className={cn(
                      "overflow-hidden transition-all duration-300 backdrop-blur-xl bg-white/60 dark:bg-slate-900/40 border border-white/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_0_rgba(0,102,153,0.15)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]",
                      isBlueTheme ? "" : "hover:shadow-[0_8px_32px_0_rgba(249,115,22,0.15)] dark:hover:shadow-[0_8px_32px_0_rgba(249,115,22,0.2)]"
                    )}>
                      <div className={cn(
                        "h-1.5 w-full",
                        patient.risk === 'emergency' ? "bg-red-500" : 
                        patient.risk === 'very-urgent' ? "bg-orange-500" :
                        patient.risk === 'urgent' ? "bg-[#FFDE21]" : 
                        patient.risk === 'less-urgent' ? "bg-green-500" : "bg-blue-600"
                      )} />
                      <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                        <div className="p-5 flex-1 min-w-[250px] flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-200/50 dark:border-slate-800/50">
                          <div>
                            <h3 className="text-lg font-black text-foreground leading-tight tracking-tight">
                              {formatWords(patient.name)}
                            </h3>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                              {formatPatientAge(patient.age, patient.birthDate)} • Ticket: {patient.ticket}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-4">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                Tempo em sala: {(() => {
                                  const diff = Math.floor((new Date().getTime() - new Date(patient.arrivalTime).getTime()) / 60000);
                                  return diff > 60 ? `${Math.floor(diff/60)}h ${diff%60}m` : `${diff} min`;
                                })()}
                              </span>
                            </div>
                            {patient.exams && patient.exams.length > 0 && (
                              <div className={cn(
                                "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border",
                                patient.exams.filter(e => e.status === 'completed').length === patient.exams.length
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              )}>
                                <FlaskConical className={cn("h-3 w-3", patient.exams.filter(e => e.status === 'completed').length === patient.exams.length ? "animate-pulse" : "")} />
                                {patient.exams.filter(e => e.status === 'completed').length}/{patient.exams.length} Exames
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-5 flex flex-col justify-center gap-3 border-b md:border-b-0 md:border-r border-slate-200/50 dark:border-slate-800/50 flex-1 md:max-w-[250px]">
                          <Button 
                            variant="outline"
                            className="h-10 text-[10px] font-black uppercase border-[#006699]/20 text-[#006699] hover:bg-[#006699]/5 dark:border-sky-400/20 dark:text-sky-400 dark:hover:bg-sky-400/5 w-full transition-all"
                            onClick={() => setDetailsPatient(patient)}
                          >
                            <Info className="h-3.5 w-3.5 mr-1.5" /> Detalhes da Triagem
                          </Button>
                          <Button 
                            variant="outline"
                            className="h-10 text-[10px] font-black uppercase border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 w-full transition-all text-slate-600 dark:text-slate-300"
                            onClick={() => setRecordPatientId(patient.id)}
                          >
                            <User className="h-3.5 w-3.5 mr-1.5" /> Ver Prontuário
                          </Button>
                        </div>

                        <div className="p-5 flex-1 min-w-[300px] flex flex-col justify-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
                          <Button 
                            className="h-12 text-xs font-black uppercase bg-[#006699] hover:bg-[#005580] dark:bg-sky-600 dark:hover:bg-sky-500 text-white shadow-md shadow-[#006699]/20 dark:shadow-sky-900/20 w-full transition-all border-0"
                            onClick={() => setFastConsultPatient(patient)}
                          >
                            <Stethoscope className="h-4 w-4 mr-2" /> Iniciar Atendimento
                          </Button>
                          <div className="grid grid-cols-2 gap-3 w-full">
                            <Button 
                              variant="outline"
                              className="h-10 text-[10px] font-black uppercase border-amber-200 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                              onClick={() => handlePause(patient)}
                            >
                              <PauseCircle className="h-3.5 w-3.5 mr-1.5" /> Pausar (Exame)
                            </Button>
                            <Button 
                              className="h-10 text-[10px] font-black uppercase bg-emerald-500 hover:bg-emerald-600 text-white shadow-md border-0"
                              onClick={() => setFinishingPatient(patient)}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Dar Alta
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* BOTTOM: Fila de Espera */}
        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Sala de Espera (Aguardando)
            </h2>
            <div className="bg-slate-200/50 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
              {waitingPatients.length} Na Fila
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] overflow-hidden">
            {waitingPatients.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-16 text-center"
              >
                <div className="h-20 w-20 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Coffee className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-2">Fila Zerada!</h3>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest max-w-[300px]">
                  Excelente trabalho. Nenhum paciente aguardando no momento.
                </p>
              </motion.div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {waitingPatients.map(patient => {
                  const isReaval = patient.subStatus === 'reaval' && patient.sector === activeRoom;
                  return (
                    <div key={patient.id} className={cn(
                      "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-white/80 dark:hover:bg-slate-800/60",
                      isReaval && "bg-amber-50/50 dark:bg-amber-950/20"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-center min-w-[120px] shadow-sm",
                          patient.risk === 'emergency' ? "bg-red-600 text-white" : 
                          patient.risk === 'very-urgent' ? "bg-orange-500 text-white animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.5)] ring-2 ring-orange-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900" :
                          patient.risk === 'urgent' ? "bg-[#FFDE21] text-black" : 
                          patient.risk === 'less-urgent' ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                        )}>
                          {patient.risk === 'emergency' ? 'Emergência' : 
                           patient.risk === 'very-urgent' ? 'Muito Urgente' :
                           patient.risk === 'urgent' ? 'Urgente' : 
                           patient.risk === 'less-urgent' ? 'Pouco Urgente' : 'Não Urgente'}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-foreground">{formatWords(patient.name)}</h4>
                            {isReaval && (
                              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800">
                                Retorno Exame
                              </span>
                            )}
                            {patient.exams && patient.exams.length > 0 && (
                              <span className={cn(
                                "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border flex items-center gap-1",
                                patient.exams.filter(e => e.status === 'completed').length === patient.exams.length
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              )}>
                                <FlaskConical className={cn("h-2.5 w-2.5", patient.exams.filter(e => e.status === 'completed').length === patient.exams.length ? "animate-pulse" : "")} />
                                {patient.exams.filter(e => e.status === 'completed').length}/{patient.exams.length}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                            {formatPatientAge(patient.age, patient.birthDate)} • {patient.ticket || 'GERAL'} • Aguardando há {Math.floor((new Date().getTime() - new Date(patient.arrivalTime).getTime()) / 60000)}m
                          </p>
                        </div>
                      </div>

                      <Button 
                        className={cn(
                          "h-10 px-6 font-black uppercase tracking-widest text-[10px] shadow-md border-0 w-full sm:w-auto",
                          isBlueTheme ? "bg-[#006699] hover:bg-[#005580] text-white" : "bg-orange-500 hover:bg-orange-600 text-white"
                        )}
                        onClick={() => handleCall(patient)}
                      >
                        <Megaphone className="h-3.5 w-3.5 mr-2" /> Chamar Próximo
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Painel de Chamada Sonoro */}
      {/* Call Control Dialog */}
      <Dialog open={showCallControl} onOpenChange={setShowCallControl}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl [&>button]:hidden">
          <DialogHeader className={cn(
            "p-6 text-white transition-colors duration-500 backdrop-blur-md shadow-lg",
            callingTicket?.risk === 'emergency' ? 'bg-red-600/90' :
            callingTicket?.risk === 'very-urgent' ? 'bg-orange-500/90' :
            callingTicket?.risk === 'urgent' ? 'bg-[#FFDE21]/90 text-black' :
            callingTicket?.risk === 'less-urgent' ? 'bg-green-500/90' :
            (callingTicket?.priority === 'preferential' ? 'bg-purple-600/90' : 
             callingTicket?.priority === 'pediatric' ? 'bg-orange-500/90' : 'bg-gradient-to-br from-[#006699]/90 to-[#004466]/90 dark:from-sky-600/50 dark:to-sky-900/50')
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

          <div className="p-8 space-y-8 text-center">
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
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{formatPatientAge(callingTicket?.age)} • CPF: {callingTicket?.cpf || 'N/A'}</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Local de Chamada</p>
              <div className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-inner",
                isBlueTheme 
                  ? "bg-[#006699]/10 text-[#006699] dark:bg-sky-500/10 dark:text-sky-400 border-[#006699]/20 dark:border-sky-500/20" 
                  : "bg-orange-500/10 text-orange-600 dark:bg-orange-550/15 dark:text-orange-400 border-orange-500/20 dark:border-orange-500/25"
              )}>
                {activeRoom}
              </div>
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
            {recordPatientId && <PatientRecord patientId={recordPatientId} />}
          </div>
        </DialogContent>
      </Dialog>

      {/* End Shift Confirmation Modal */}
      <Dialog open={isEndShiftModalOpen} onOpenChange={setIsEndShiftModalOpen}>
        <DialogContent className="sm:max-w-[425px] border-red-100 dark:border-red-900/30 shadow-2xl rounded-3xl p-6">
          <DialogHeader>
            <div className="mx-auto w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <LogOut className="h-7 w-7 text-red-500 dark:text-red-400" />
            </div>
            <DialogTitle className="text-center text-xl font-black uppercase tracking-tight text-foreground">
              Encerrar Plantão?
            </DialogTitle>
            <DialogDescription className="text-center font-medium text-slate-600 dark:text-slate-400 mt-3 text-sm">
              Tem certeza que deseja encerrar os atendimentos nesta sala? A sala ficará livre para outro colega.
              <br /><br />
              <span className="font-bold text-slate-800 dark:text-slate-200">Bom descanso!</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl h-12 font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800"
              onClick={() => setIsEndShiftModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 rounded-xl h-12 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest shadow-lg shadow-red-500/20 border-0"
              onClick={() => {
                setIsEndShiftModalOpen(false);
                handleEndShift();
              }}
            >
              Sim, Encerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Finish Patient Confirmation Modal */}
      <Dialog open={!!finishingPatient} onOpenChange={(open) => !open && setFinishingPatient(null)}>
        <DialogContent className="sm:max-w-[425px] border-emerald-100 dark:border-emerald-900/30 shadow-2xl rounded-3xl p-6 glass-card-premium bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl">
          <DialogHeader>
            <div className="mx-auto w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-800">
              <CheckCircle2 className="h-7 w-7 text-emerald-500 dark:text-emerald-400" />
            </div>
            <DialogTitle className="text-center text-xl font-black uppercase tracking-tight text-foreground flex items-center justify-center gap-2">
              ⚠️ Confirmar Alta?
            </DialogTitle>
            <DialogDescription className="text-center font-medium text-slate-600 dark:text-slate-400 mt-3 text-sm">
              Você está prestes a finalizar o atendimento de <strong className="text-slate-800 dark:text-slate-200">{finishingPatient?.name}</strong>.
              <br /><br />
              Deseja realmente dar alta?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl h-12 font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
              onClick={() => setFinishingPatient(null)}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 rounded-xl h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 border-0"
              onClick={() => {
                if (finishingPatient) {
                  handleFinish(finishingPatient);
                  setFinishingPatient(null);
                }
              }}
            >
              Sim, Dar Alta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PatientDetailsModal 
        patient={detailsPatient} 
        isOpen={!!detailsPatient} 
        onClose={() => setDetailsPatient(null)} 
      />

      <QuickConsultModal 
        patient={fastConsultPatient}
        isOpen={!!fastConsultPatient}
        onClose={() => setFastConsultPatient(null)}
        onComplete={handleFinishFastConsult}
        isPediatric={isPediatric}
        hidePediatricOptions={isAdultClinical}
      />
    </div>
  );
}

// Helper icon
function DoorOpenIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 4h3a2 2 0 0 1 2 2v14" />
      <path d="M2 20h3" />
      <path d="M13 20h9" />
      <path d="M10 12v.01" />
      <path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z" />
    </svg>
  )
}
