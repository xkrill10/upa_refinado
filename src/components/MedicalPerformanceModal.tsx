import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Patient } from "@/hooks/use-patients";
import { formatWords } from "@/lib/utils";
import { Activity, Clock, Stethoscope, Users, User, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DoctorPolarArea } from "@/components/charts/DoctorPolarArea";

interface MedicalPerformanceModalProps {
  patients: Patient[];
  isOpen: boolean;
  onClose: () => void;
  onViewTimeline: (patient: Patient) => void;
}

export function MedicalPerformanceModal({ patients, isOpen, onClose, onViewTimeline }: MedicalPerformanceModalProps) {
  const [expandedDoctor, setExpandedDoctor] = useState<string | null>(null);

  // Agrupar pacientes por médico responsável
  const performanceData = useMemo(() => {
    const data: Record<string, {
      doctorName: string;
      sector: string;
      totalSeen: number;
      inProgress: number;
      completed: number;
      patients: Patient[];
    }> = {};

    if (!patients || !Array.isArray(patients)) return [];

    patients.forEach(p => {
      // Consideramos apenas pacientes que já têm um médico (estão/foram atendidos)
      if (p.responsibleProfessional) {
        const docName = p.responsibleProfessional;
        if (!data[docName]) {
          data[docName] = {
            doctorName: docName,
            sector: p.sector || "Consultório",
            totalSeen: 0,
            inProgress: 0,
            completed: 0,
            patients: []
          };
        }
        
        data[docName].totalSeen++;
        data[docName].patients.push(p);

        if (p.status === 'completed' || p.status === 'evasion') {
          data[docName].completed++;
        } else {
          data[docName].inProgress++;
        }
      }
    });

    return Object.values(data).sort((a, b) => b.totalSeen - a.totalSeen);
  }, [patients]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {isOpen && (
      <DialogContent className="max-w-4xl bg-white dark:bg-slate-950 rounded-2xl border-0 shadow-2xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-white dark:from-slate-900/80 dark:to-slate-950/90 pointer-events-none -z-10" />
        
        <DialogHeader className="p-6 pb-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary dark:bg-sky-400/10 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-slate-100">
                Desempenho Médico e Consultórios
              </DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest mt-1 text-slate-500">
                Visão Geral Operacional
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto flex-1">
          {performanceData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Nenhum atendimento médico registrado no momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <DoctorPolarArea data={performanceData} />
              
              {performanceData.map((doc, idx) => {
                const isExpanded = expandedDoctor === doc.doctorName;

                return (
                  <div key={idx} className="glass-card border border-slate-200 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 rounded-xl overflow-hidden shadow-sm transition-all">
                    {/* Header do Médico */}
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      onClick={() => setExpandedDoctor(isExpanded ? null : doc.doctorName)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-slate-100">{doc.doctorName}</h3>
                          <span className="text-xs text-slate-500 font-medium">{doc.sector}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 text-center">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-0.5">Em Andamento</p>
                            <p className="text-sm font-black text-amber-500">{doc.inProgress}</p>
                          </div>
                          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-0.5">Finalizados</p>
                            <p className="text-sm font-black text-emerald-500">{doc.completed}</p>
                          </div>
                          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-0.5">Total</p>
                            <p className="text-sm font-black text-sky-500">{doc.totalSeen}</p>
                          </div>
                        </div>
                        <div className="text-slate-400">
                          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Lista de Pacientes do Médico */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 p-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Pacientes Atendidos ({doc.patients.length})
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {doc.patients.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 hover:border-sky-500/30 transition-colors">
                              <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{formatWords(p.name)}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                    p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                                    p.status === 'attending' ? 'bg-amber-500/10 text-amber-600' :
                                    'bg-slate-500/10 text-slate-600'
                                  }`}>
                                    {p.status === 'completed' ? 'Finalizado' : p.status === 'attending' ? 'Em Atendimento' : p.status}
                                  </span>
                                  {p.arrivalTime && (
                                    <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      Chegou {format(new Date(p.arrivalTime), "HH:mm", { locale: ptBR })}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewTimeline(p);
                                }}
                                className="h-8 px-3 flex items-center gap-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                              >
                                <Activity className="h-3.5 w-3.5" />
                                Jornada
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
      )}
    </Dialog>
  );
}
