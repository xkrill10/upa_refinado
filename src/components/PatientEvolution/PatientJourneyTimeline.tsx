import React from "react";
import { Patient } from "@/hooks/use-patients";
import { formatWords } from "@/lib/utils";
import {
  Activity,
  ClipboardList,
  Clock,
  FileText,
  FlaskConical,
  Stethoscope,
  UserPlus,
  FileArchive,
  Building2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface PatientJourneyTimelineProps {
  patient: Patient | null;
}

export function PatientJourneyTimeline({ patient }: PatientJourneyTimelineProps) {
  const [selectedDateStr, setSelectedDateStr] = React.useState("");
  const timelineRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  
  // Synthesize events based on patient data
  const events: any[] = [];
  let hasExams = false;

  const addEvent = (
    dateStr: string | undefined,
    title: string,
    desc: string,
    icon: any,
    colorClass: string,
  ) => {
    if (!dateStr) return;
    events.push({
      date: new Date(dateStr),
      title,
      description: desc,
      icon,
      colorClass,
    });
  };

  if (patient) {

  // 1. Chegada
  addEvent(
    patient.arrivalTime,
    "Chegada na Recepção",
    `Paciente ${formatWords(patient.name)} deu entrada na unidade.`,
    UserPlus,
    "bg-slate-500 text-white",
  );

  // 2. Triagem (Classificação de risco)
  let riskColor = "bg-blue-500 text-white";
  let riskLabel = "Não Urgente";
  if (patient.risk && patient.risk !== "not-urgent") {
    const triageTime = patient.arrivalTime
      ? new Date(
          new Date(patient.arrivalTime).getTime() + 15 * 60000,
        ).toISOString()
      : new Date().toISOString();

    if (patient.risk === "emergency") {
      riskColor = "bg-red-600 text-white";
      riskLabel = "Emergência";
    }
    if (patient.risk === "very-urgent") {
      riskColor = "bg-orange-500 text-white";
      riskLabel = "Muito Urgente";
    }
    if (patient.risk === "urgent") {
      riskColor = "bg-[#FFDE21] text-black";
      riskLabel = "Urgente";
    }
    if (patient.risk === "less-urgent") {
      riskColor = "bg-green-500 text-white";
      riskLabel = "Pouco Urgente";
    }

    addEvent(
      triageTime,
      "Classificação de Risco (Triagem)",
      `Classificado como ${riskLabel}. Queixa principal: ${patient.mainComplaint || "Não informada"}.`,
      ClipboardList,
      riskColor,
    );
  }

  // 3. Início de Atendimento Médico
  if (patient.status === "attending" || patient.status === "completed" || patient.status === "waiting-medication" || patient.status === "in-observation") {
    const attendTime = patient.arrivalTime
      ? new Date(
          new Date(patient.arrivalTime).getTime() + 30 * 60000,
        ).toISOString()
      : new Date().toISOString();
    addEvent(
      attendTime,
      "Início do Atendimento Médico",
      `Atendido por ${patient.responsibleProfessional || "Médico Plantonista"} no setor ${patient.sector || "Consultório"}.`,
      Stethoscope,
      "bg-[#006699] text-white",
    );
  }

  // 4. Evoluções Clínicas
  if (patient.evolutions && patient.evolutions.length > 0) {
    patient.evolutions.forEach((ev: any) => {
      let evTime = ev.timestamp;
      try {
        if (!evTime.includes("T")) {
          const parts = evTime.split(" ");
          if (parts.length === 2 && parts[0].includes("/")) {
            const dParts = parts[0].split("/");
            evTime = `${dParts[2]}-${dParts[1]}-${dParts[0]}T${parts[1]}:00.000Z`;
          }
        }
        new Date(evTime).toISOString();
      } catch (e) {
        evTime = new Date().toISOString();
      }

      addEvent(
        evTime,
        `Evolução: ${ev.type}`,
        `${ev.description} (Resp: ${ev.professional})`,
        FileText,
        "bg-sky-500 text-white",
      );
    });
  }

  // 5. Exames Solicitados
  if (patient.exams && patient.exams.length > 0) {
    hasExams = true;
    patient.exams.forEach((ex: any) => {
      addEvent(
        ex.requestedAt,
        `Solicitação de Exame: ${ex.name}`,
        `Prioridade: ${ex.priority === "urgent" ? "Urgente" : "Normal"}. Status atual: ${ex.status === "completed" ? "Concluído" : "Pendente"}.`,
        FlaskConical,
        "bg-purple-500 text-white",
      );

      if (ex.releasedAt) {
        addEvent(
          ex.releasedAt,
          `Resultado de Exame Liberado: ${ex.name}`,
          `O resultado do exame está disponível para visualização.`,
          FileArchive,
          "bg-emerald-500 text-white",
        );
      }
    });
  }

  // 6. Solicitação de Internação
  if (patient.admissionRequest) {
    addEvent(
      patient.admissionRequest.requestedAt,
      `Solicitação de Internação`,
      `Tipo de leito: ${patient.admissionRequest.bedType === "emergency" ? "Emergência" : "Observação"}. Solicitado por ${patient.admissionRequest.doctor}. Status: ${patient.admissionRequest.status}.`,
      Building2,
      "bg-amber-500 text-white",
    );
  }
  } // end if (patient)

  // Sort events chronologically
  events.sort((a, b) => a.date.getTime() - b.date.getTime());

  const uniqueDates = Array.from(new Set(events.map(e => format(e.date, "yyyy-MM-dd"))));
  const latestDate = uniqueDates.length > 0 ? uniqueDates[uniqueDates.length - 1] : format(new Date(), "yyyy-MM-dd");

  React.useEffect(() => {
    if (latestDate && selectedDateStr === "") {
      setSelectedDateStr(latestDate);
    }
  }, [latestDate, selectedDateStr]);

  if (!patient) return null;

  const activeDateStr = selectedDateStr || latestDate;

  // Determine Macro Stages
  const stages = [
    { id: 'arrival', label: 'Recepção', completed: true },
    { id: 'triage', label: 'Triagem', completed: !!patient.risk },
    { id: 'attendance', label: 'Atendimento', completed: patient.status !== 'waiting' },
    { id: 'exams', label: 'Exames/Medicação', completed: hasExams || patient.status === 'waiting-medication' || patient.status === 'in-observation', active: patient.status === 'waiting-medication' },
    { id: 'discharge', label: 'Alta/Fim', completed: patient.status === 'completed', active: patient.status === 'completed' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      
      {/* Header Macro Progress */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#006699] dark:text-sky-400" />
          Status da Jornada
        </h3>
        
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 rounded-full z-0 overflow-hidden">
             <div className="h-full bg-emerald-500/50" style={{ width: `${(stages.filter(s => s.completed).length / stages.length) * 100}%` }}></div>
          </div>
          
          {stages.map((stage, idx) => {
            const isCompleted = stage.completed;
            const isActive = stage.active || (!stage.completed && idx > 0 && stages[idx-1].completed);

            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-sm transition-all duration-300",
                  isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-[#006699] dark:bg-sky-500 text-white animate-pulse" : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                )}>
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
                </div>
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  isCompleted ? "text-emerald-600 dark:text-emerald-400" : isActive ? "text-[#006699] dark:text-sky-400" : "text-slate-400"
                )}>{stage.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Time Navigator */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10">
        <div className="flex items-center justify-between px-6 py-2 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
          <button 
            onClick={() => {
               const idx = uniqueDates.indexOf(activeDateStr);
               if(idx > 0) setSelectedDateStr(uniqueDates[idx - 1]);
            }}
            disabled={uniqueDates.indexOf(activeDateStr) <= 0}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">
             {activeDateStr ? format(new Date(activeDateStr + "T00:00:00"), "EEEE, dd 'de' MMM", { locale: ptBR }) : ""}
          </span>
          
          <button 
            onClick={() => {
               const idx = uniqueDates.indexOf(activeDateStr);
               if(idx < uniqueDates.length - 1) setSelectedDateStr(uniqueDates[idx + 1]);
            }}
            disabled={uniqueDates.indexOf(activeDateStr) >= uniqueDates.length - 1}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        <div 
          className="w-full overflow-x-auto hide-scrollbar scroll-smooth"
          onWheel={(e) => {
            const container = e.currentTarget;
            if (Math.abs(e.deltaY) > 0) {
              container.scrollLeft += e.deltaY;
              
              // Verificação de limites para mudar de data
              const isAtLeft = container.scrollLeft <= 0;
              const isAtRight = Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth;
              
              if (isAtLeft && e.deltaY < 0) {
                 const idx = uniqueDates.indexOf(activeDateStr);
                 if(idx > 0) setSelectedDateStr(uniqueDates[idx - 1]);
              } else if (isAtRight && e.deltaY > 0) {
                 const idx = uniqueDates.indexOf(activeDateStr);
                 if(idx < uniqueDates.length - 1) setSelectedDateStr(uniqueDates[idx + 1]);
              }
            }
          }}
        >
          <div className="flex w-max space-x-1 p-3">
             {Array.from({ length: 24 }).map((_, i) => {
                const hourStr = i.toString().padStart(2, "0");
                const timeKey = `${activeDateStr}-${hourStr}`;
                const hasEvent = events.some(e => format(e.date, "yyyy-MM-dd-HH") === timeKey);
                
                return (
                  <div 
                    key={i} 
                    onClick={() => {
                      if (hasEvent && timelineRefs.current[timeKey]) {
                        timelineRefs.current[timeKey]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center w-14 h-16 rounded-xl transition-all select-none",
                      hasEvent 
                        ? "bg-[#006699]/10 dark:bg-sky-500/20 border border-[#006699]/30 dark:border-sky-500/30 cursor-pointer hover:bg-[#006699]/20 hover:-translate-y-1" 
                        : "opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-default"
                    )}
                  >
                    <span className={cn(
                      "text-xs font-black tracking-tighter", 
                      hasEvent ? "text-[#006699] dark:text-sky-400" : "text-slate-400 dark:text-slate-500"
                    )}>{hourStr}:00</span>
                    {hasEvent ? (
                      <div className="h-2 w-2 rounded-full bg-[#006699] dark:bg-sky-400 mt-1 shadow-sm" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-1" />
                    )}
                  </div>
                );
             })}
          </div>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="p-8 overflow-y-auto flex-1 relative bg-slate-50/50 dark:bg-slate-950/50">
        <div className="absolute left-[51px] top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-800" />

        <div className="space-y-8 relative">
          {events.map((event, index) => {
            const eventTimeKey = format(event.date, "yyyy-MM-dd-HH");
            const isFirstOfHour = index === 0 || format(events[index-1].date, "yyyy-MM-dd-HH") !== eventTimeKey;
            
            // Show date separator if day changed
            const isFirstOfDay = index === 0 || format(events[index-1].date, "yyyy-MM-dd") !== format(event.date, "yyyy-MM-dd");

            return (
              <React.Fragment key={index}>
                {isFirstOfDay && (
                  <div className="flex items-center gap-4 relative z-10 py-2">
                    <div className="h-0.5 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400 bg-white dark:bg-slate-900 px-4 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                      {format(event.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                    </span>
                    <div className="h-0.5 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </div>
                )}
                
                <div 
                  className="flex gap-6 relative group"
                  ref={isFirstOfHour ? (el) => (timelineRefs.current[eventTimeKey] = el) : undefined}
                >
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 z-10 shadow-md ring-4 ring-white dark:ring-slate-950 ${event.colorClass} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <event.icon className="h-5 w-5" />
                  </div>

                  <div className="pt-2 flex-1 pb-2">
                    <div className="glass-card border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm hover:shadow-md transition-all group-hover:border-[#006699]/30 dark:group-hover:border-sky-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-black uppercase text-slate-800 dark:text-slate-100 tracking-tight">
                          {event.title}
                        </h4>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                          <Clock className="h-3.5 w-3.5" />
                          {format(event.date, "HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Nenhum evento registrado na jornada.
              </p>
            </div>
          )}

          {patient.status !== "completed" && patient.status !== "evasion" && (
            <div className="flex gap-6 relative group opacity-60">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm ring-4 ring-white dark:ring-slate-950 bg-slate-100 dark:bg-slate-800 text-slate-400 border border-dashed border-slate-300 dark:border-slate-700`}
              >
                <Clock className="h-5 w-5 animate-spin-slow" style={{ animationDuration: '3s' }} />
              </div>
              <div className="pt-2 flex-1">
                <div className="p-5">
                  <h4 className="text-sm font-black uppercase text-slate-400 tracking-tight flex items-center gap-2">
                    Aguardando próximos passos <span className="flex gap-1"><span className="animate-bounce">.</span><span className="animate-bounce" style={{animationDelay: '0.1s'}}>.</span><span className="animate-bounce" style={{animationDelay: '0.2s'}}>.</span></span>
                  </h4>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
