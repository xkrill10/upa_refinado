import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Patient } from "@/hooks/use-patients";
import { formatWords } from "@/lib/utils";
import { Activity, ClipboardList, Clock, FileText, FlaskConical, Stethoscope, Syringe, UserPlus, FileArchive, Building2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PatientTimelineModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PatientTimelineModal({ patient, isOpen, onClose }: PatientTimelineModalProps) {
  if (!patient) return null;

  // Synthesize events based on patient data
  const events = [];

  const addEvent = (dateStr: string | undefined, title: string, desc: string, icon: any, colorClass: string) => {
    if (!dateStr) return;
    events.push({
      date: new Date(dateStr),
      title,
      description: desc,
      icon,
      colorClass
    });
  };

  // 1. Chegada
  addEvent(
    patient.arrivalTime, 
    "Chegada na Recepção", 
    `Paciente ${formatWords(patient.name)} deu entrada na unidade.`, 
    UserPlus, 
    "bg-slate-500 text-white"
  );

  // 2. Triagem (Classificação de risco)
  if (patient.risk && patient.risk !== 'not-urgent') {
    // Simulando tempo de triagem (15 min após a chegada se não houver um dado exato)
    const triageTime = patient.arrivalTime ? new Date(new Date(patient.arrivalTime).getTime() + 15 * 60000).toISOString() : new Date().toISOString();
    
    let riskColor = "bg-blue-500 text-white";
    let riskLabel = "Não Urgente";
    if (patient.risk === 'emergency') { riskColor = "bg-red-600 text-white"; riskLabel = "Emergência"; }
    if (patient.risk === 'very-urgent') { riskColor = "bg-orange-500 text-white"; riskLabel = "Muito Urgente"; }
    if (patient.risk === 'urgent') { riskColor = "bg-[#FFDE21] text-black"; riskLabel = "Urgente"; }
    if (patient.risk === 'less-urgent') { riskColor = "bg-green-500 text-white"; riskLabel = "Pouco Urgente"; }

    addEvent(
      triageTime,
      "Classificação de Risco (Triagem)",
      `Classificado como ${riskLabel}. Queixa principal: ${patient.mainComplaint || "Não informada"}.`,
      ClipboardList,
      riskColor
    );
  }

  // 3. Início de Atendimento Médico
  if (patient.status === 'attending' || patient.status === 'completed') {
    // Simulando tempo de início (30 min após chegada) se não tiver no evolutions
    const attendTime = patient.arrivalTime ? new Date(new Date(patient.arrivalTime).getTime() + 30 * 60000).toISOString() : new Date().toISOString();
    addEvent(
      attendTime,
      "Início do Atendimento Médico",
      `Atendido por ${patient.responsibleProfessional || "Médico Plantonista"} no setor ${patient.sector || "Consultório"}.`,
      Stethoscope,
      "bg-[#006699] text-white"
    );
  }

  // 4. Evoluções Clínicas
  if (patient.evolutions && patient.evolutions.length > 0) {
    patient.evolutions.forEach((ev: any) => {
      // Trying to parse timestamp or use current if invalid
      let evTime = ev.timestamp;
      try {
        if (!evTime.includes('T')) {
          // If it's a pt-BR string like "10/05/2026 10:30", we might need a fallback.
          const parts = evTime.split(' ');
          if (parts.length === 2 && parts[0].includes('/')) {
             const dParts = parts[0].split('/');
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
        "bg-sky-500 text-white"
      );
    });
  }

  // 5. Exames Solicitados
  if (patient.exams && patient.exams.length > 0) {
    patient.exams.forEach((ex: any) => {
      addEvent(
        ex.requestedAt,
        `Solicitação de Exame: ${ex.name}`,
        `Prioridade: ${ex.priority === 'urgent' ? 'Urgente' : 'Normal'}. Status atual: ${ex.status === 'completed' ? 'Concluído' : 'Pendente'}.`,
        FlaskConical,
        "bg-purple-500 text-white"
      );

      if (ex.releasedAt) {
        addEvent(
          ex.releasedAt,
          `Resultado de Exame Liberado: ${ex.name}`,
          `O resultado do exame está disponível para visualização.`,
          FileArchive,
          "bg-emerald-500 text-white"
        );
      }
    });
  }

  // 6. Solicitação de Internação
  if (patient.admissionRequest) {
    addEvent(
      patient.admissionRequest.requestedAt,
      `Solicitação de Internação`,
      `Tipo de leito: ${patient.admissionRequest.bedType === 'emergency' ? 'Emergência' : 'Observação'}. Solicitado por ${patient.admissionRequest.doctor}. Status: ${patient.admissionRequest.status}.`,
      Building2,
      "bg-amber-500 text-white"
    );
  }

  // Sort events chronologically
  events.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white dark:bg-slate-950 rounded-2xl border-0 shadow-2xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-white dark:from-slate-900/80 dark:to-slate-950/90 pointer-events-none -z-10" />
        
        <DialogHeader className="p-6 pb-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#006699]/10 text-[#006699] dark:bg-sky-400/10 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-slate-100">
                Jornada do Paciente
              </DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest mt-1 text-slate-500">
                {formatWords(patient.name)} • ID: {patient.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto flex-1 relative">
          <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800" />
          
          <div className="space-y-8 relative">
            {events.map((event, index) => {
              return (
                <div key={index} className="flex gap-6 relative group">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 z-10 shadow-md ring-4 ring-white dark:ring-slate-950 ${event.colorClass} transition-transform duration-300 group-hover:scale-110`}>
                    <event.icon className="h-5 w-5" />
                  </div>
                  
                  <div className="pt-2 flex-1 pb-2">
                    <div className="glass-card border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/40 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-black uppercase text-slate-800 dark:text-slate-100 tracking-tight">
                          {event.title}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(event.date, "HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {events.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Nenhum evento registrado na jornada.</p>
              </div>
            )}
            
            {patient.status !== 'completed' && patient.status !== 'evasion' && (
              <div className="flex gap-6 relative group opacity-50">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm ring-4 ring-white dark:ring-slate-950 bg-slate-100 dark:bg-slate-800 text-slate-400 border border-dashed border-slate-300 dark:border-slate-700`}>
                  <Clock className="h-5 w-5 animate-pulse" />
                </div>
                <div className="pt-2 flex-1">
                  <div className="p-4">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-tight">
                      Aguardando próximos passos...
                    </h4>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
