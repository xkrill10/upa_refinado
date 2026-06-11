import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar,
  Activity,
  AlertTriangle,
  FileText,
  Pill,
  Stethoscope,
  Droplet,
  CheckCircle2,
  ChevronRight,
  ActivitySquare,
  HeartPulse,
  FlaskConical,
  Trash2,
} from "lucide-react";
import { Patient } from "@/hooks/use-patients";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePatients } from "@/hooks/use-patients";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PatientTimelineModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  patient: Patient;
}

export function PatientTimelineModal({
  isOpen,
  onClose,
  patient,
}: PatientTimelineModalProps) {
  const { updatePatient } = usePatients();

  // Generating a contextual timeline based on the patient's data
  const timelineEvents = useMemo(() => {
    const arrival = new Date(patient.arrivalTime);

    // IF REAL TIMELINE EXISTS (New feature)
    if (patient.timeline && patient.timeline.length > 0) {
      const mappedEvents = [];
      mappedEvents.push({
        id: "arrival",
        title: "Recepção e Abertura de Ficha",
        time: arrival.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: arrival.toLocaleDateString("pt-BR"),
        description: `Paciente deu entrada na unidade.`,
        icon: <Calendar className="h-4 w-4" />,
        color: "bg-blue-500",
        iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        badge: "Recepção",
      });

      patient.timeline.forEach((t) => {
        const tDate = new Date(t.timestamp);
        let icon = <Activity className="h-4 w-4" />;
        let color = "bg-amber-500";
        let iconBg = "bg-amber-500/10 text-amber-600 dark:text-amber-400";

        if (t.iconType === "calendar") {
          icon = <Calendar className="h-4 w-4" />;
          color = "bg-blue-500";
          iconBg = "bg-blue-500/10 text-blue-600 dark:text-blue-400";
        }
        if (t.iconType === "alert") {
          icon = <AlertTriangle className="h-4 w-4" />;
          color = "bg-red-500";
          iconBg = "bg-red-500/10 text-red-600 dark:text-red-400";
        }
        if (t.iconType === "stethoscope") {
          icon = <Stethoscope className="h-4 w-4" />;
          color = "bg-[#006699]";
          iconBg = "bg-[#006699]/10 text-[#006699] dark:text-sky-400";
        }
        if (t.iconType === "pill") {
          icon = <Pill className="h-4 w-4" />;
          color = "bg-emerald-500";
          iconBg = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
        }
        if (t.iconType === "droplet") {
          icon = <Droplet className="h-4 w-4" />;
          color = "bg-indigo-500";
          iconBg = "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400";
        }
        if (t.iconType === "check") {
          icon = <CheckCircle2 className="h-4 w-4" />;
          color = "bg-green-600";
          iconBg = "bg-green-600/10 text-green-600 dark:text-green-400";
        }
        if (t.iconType === "flask") {
          icon = <FlaskConical className="h-4 w-4" />;
          color = "bg-purple-500";
          iconBg = "bg-purple-500/10 text-purple-600 dark:text-purple-400";
        }

        mappedEvents.push({
          id: t.id,
          title: t.title,
          time: tDate.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: tDate.toLocaleDateString("pt-BR"),
          description: t.description,
          icon,
          color,
          iconBg,
          badge: t.badge,
        });
      });

      return mappedEvents.reverse();
    }

    // LEGACY FALLBACK
    const events = [];
    events.push({
      id: "arrival",
      title: "Recepção e Abertura de Ficha",
      time: arrival.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: arrival.toLocaleDateString("pt-BR"),
      description: `Paciente deu entrada na unidade. Setor inicial: ${patient.sector || "Recepção"}.`,
      icon: <Calendar className="h-4 w-4" />,
      color: "bg-blue-500",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      badge: "Recepção",
    });

    // 2. Triage
    if (patient.triaged || patient.pa || patient.fc) {
      const triageTime = new Date(arrival.getTime() + 15 * 60000); // +15 mins simulated
      events.push({
        id: "triage",
        title: "Triagem e Classificação de Risco",
        time: triageTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: triageTime.toLocaleDateString("pt-BR"),
        description: `Sinais vitais aferidos. Risco classificado: ${patient.risk.toUpperCase()}. ${patient.justification ? `Queixa: ${patient.justification}` : ""}`,
        icon: <Activity className="h-4 w-4" />,
        color: "bg-amber-500",
        iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        badge: "Triagem",
      });
    }

    // 3. Allergies Alert
    if (patient.allergies) {
      const allergyTime = new Date(arrival.getTime() + 16 * 60000);
      events.push({
        id: "allergy",
        title: "Alerta de Alergia Registrado",
        time: allergyTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: allergyTime.toLocaleDateString("pt-BR"),
        description: `Alergias relatadas: ${patient.allergies}`,
        icon: <AlertTriangle className="h-4 w-4" />,
        color: "bg-red-500",
        iconBg: "bg-red-500/10 text-red-600 dark:text-red-400",
        badge: "Segurança do Paciente",
      });
    }

    // 4. Medical Care
    if (
      patient.status === "attending" ||
      patient.status === "completed" ||
      patient.sector?.includes("Observação") ||
      patient.sector?.includes("Emergência")
    ) {
      const medicalTime = new Date(arrival.getTime() + 45 * 60000);
      events.push({
        id: "medical",
        title: "Avaliação Médica Inicial",
        time: medicalTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: medicalTime.toLocaleDateString("pt-BR"),
        description:
          "Paciente em atendimento médico. Anamnese e exame físico realizados.",
        icon: <Stethoscope className="h-4 w-4" />,
        color: "bg-[#006699]",
        iconBg: "bg-[#006699]/10 text-[#006699] dark:text-sky-400",
        badge: "Consultório",
      });
    }

    // 5. Medications
    if (patient.currentMedications) {
      const medTime = new Date(arrival.getTime() + 55 * 60000);
      events.push({
        id: "meds",
        title: "Registro de Medicações Contínuas",
        time: medTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: medTime.toLocaleDateString("pt-BR"),
        description: `Medicações em uso: ${patient.currentMedications}`,
        icon: <Pill className="h-4 w-4" />,
        color: "bg-emerald-500",
        iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        badge: "Farmácia Clínica",
      });
    }

    // 6. Current Bed/Sector Transfer
    if (
      patient.sector &&
      patient.sector !== "Triagem" &&
      patient.sector !== "Recepção"
    ) {
      const transferTime = new Date(arrival.getTime() + 65 * 60000);
      events.push({
        id: "transfer",
        title: "Transferência de Setor",
        time: transferTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: transferTime.toLocaleDateString("pt-BR"),
        description: `Paciente encaminhado para: ${patient.sector}`,
        icon: <Droplet className="h-4 w-4" />,
        color: "bg-indigo-500",
        iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        badge: "Fluxo de Leitos",
      });
    }

    // 7. Status Completed
    if (patient.status === "completed") {
      const dischargeTime = new Date(arrival.getTime() + 180 * 60000);
      events.push({
        id: "completed",
        title: "Atendimento Finalizado",
        time: dischargeTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: dischargeTime.toLocaleDateString("pt-BR"),
        description: "Paciente recebeu alta ou foi transferido.",
        icon: <CheckCircle2 className="h-4 w-4" />,
        color: "bg-green-600",
        iconBg: "bg-green-600/10 text-green-600 dark:text-green-400",
        badge: "Alta",
      });
    }

    return events.reverse(); // Newest first
  }, [patient]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[85vh] flex flex-col rounded-[2rem] p-0 overflow-hidden glass-card-premium bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-2xl">
        {/* Header */}
        <div className="shrink-0 p-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-[#006699] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  Jornada do Paciente
                </DialogTitle>
                <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-slate-500 dark:text-slate-400 mt-1">
                  {patient.name} • ID: {patient.id}
                </DialogDescription>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {patient.triaged && (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black uppercase tracking-widest text-[9px]"
                >
                  Em Acompanhamento
                </Badge>
              )}
              {patient.timeline && patient.timeline.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[9px] font-black uppercase tracking-widest text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30 shadow-sm"
                  onClick={() => {
                    updatePatient(patient.id, { timeline: [] });
                    toast.success("Histórico limpo com sucesso!");
                  }}
                >
                  <Trash2 className="h-3 w-3 mr-1.5" />
                  Limpar Sujeira (Teste)
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-8">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, ease: "easeOut" }}
                className="relative pl-8 group"
              >
                {/* Timeline Dot / Icon */}
                <div
                  className={cn(
                    "absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white dark:border-slate-900 shadow-sm transition-transform duration-300 group-hover:scale-110",
                    event.iconBg,
                  )}
                >
                  {event.icon}
                </div>

                {/* Content Card */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full animate-pulse",
                          event.color,
                        )}
                      />
                      <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                        {event.title}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-bold uppercase tracking-widest text-slate-500 border-slate-200 dark:border-slate-800"
                    >
                      {event.badge}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-3">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {event.date}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Visual fade out at the bottom */}
            <div className="absolute bottom-0 left-[-2px] w-1 h-16 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent z-10" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
