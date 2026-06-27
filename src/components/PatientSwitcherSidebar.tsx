import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatients } from "@/hooks/use-patients";
import { useBeds } from "@/context/BedsContext";
import { cn } from "@/lib/utils";
import { useRole } from "@/context/RoleContext";
import { Users, AlertCircle } from "lucide-react";

export const PatientSwitcherSidebar = () => {
  const { beds } = useBeds();
  const { patients } = usePatients();
  const navigate = useNavigate();
  const { id: currentPatientId } = useParams<{ id: string }>();
  const { role } = useRole();

  const occupiedBeds = beds.filter((b) => b.status === "occupied" && b.patientId);

  const bedsByWard = occupiedBeds.reduce((acc, bed) => {
    const ward = bed.ward || "Outros";
    if (!acc[ward]) acc[ward] = [];
    acc[ward].push(bed);
    return acc;
  }, {} as Record<string, typeof beds>);

  return (
    <div className="w-[260px] flex-shrink-0 border-r border-slate-200 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md h-full flex flex-col shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)] z-20">
      <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2">
        <Users className="w-4 h-4 text-[#006699] dark:text-sky-400" />
        <h3 className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">
          Meus Pacientes
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {Object.entries(bedsByWard).map(([ward, wardBeds]) => (
          <div key={ward}>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 px-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              {ward}
            </h4>
            <div className="space-y-1.5">
              {wardBeds.map((bed) => {
                const patient = patients.find((p) => p.id === bed.patientId);
                if (!patient) return null;
                const isActive = patient.id === currentPatientId;
                
                return (
                  <button
                    key={bed.id}
                    onClick={() => {
                      if (role === "medico") {
                        navigate(`/paciente/${patient.id}/evolucao/medica`);
                      } else {
                        navigate(`/paciente/${patient.id}/perfil-enfermagem`);
                      }
                    }}
                    className={cn(
                      "w-full flex flex-col text-left p-2.5 rounded-xl transition-all border group",
                      isActive
                        ? "bg-gradient-to-r from-sky-50 to-white dark:from-sky-900/20 dark:to-slate-900/40 border-sky-200 dark:border-sky-800/50 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700/50"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1.5 gap-2">
                      <span
                        className={cn(
                          "text-xs font-black truncate leading-tight",
                          isActive
                            ? "text-[#006699] dark:text-sky-300"
                            : "text-slate-700 dark:text-slate-300 group-hover:text-[#006699] dark:group-hover:text-sky-300 transition-colors"
                        )}
                      >
                        {patient.name}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-black uppercase tracking-widest shrink-0 px-1.5 py-0.5 rounded-md",
                          isActive
                            ? "bg-sky-100 dark:bg-sky-900/40 text-[#006699] dark:text-sky-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        )}
                      >
                        {bed.room}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {patient.risk && (
                        <div className="flex items-center gap-1">
                          <AlertCircle
                            className={cn(
                              "w-3 h-3",
                              patient.risk === "emergency"
                                ? "text-red-500"
                                : "text-emerald-500"
                            )}
                          />
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            {patient.risk === "emergency" ? "Crítico" : "Estável"}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
