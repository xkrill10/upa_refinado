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

  const [activeSector, setActiveSector] = React.useState(() => {
    return localStorage.getItem("upa_active_sector") || "Todas";
  });

  // Escutar atualizações do localStorage para garantir sincronismo se o usuário mudar de sala
  React.useEffect(() => {
    const handleStorageChange = () => {
      const currentSector = localStorage.getItem("upa_active_sector") || "Todas";
      setActiveSector(currentSector);
    };

    window.addEventListener("storage", handleStorageChange);
    // Também podemos escutar um custom event ou simplesmente atualizar se o localStorage mudar
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSectorChange = (sector: string) => {
    setActiveSector(sector);
    localStorage.setItem("upa_active_sector", sector);
  };

  const getRiskColorClass = (risk: string) => {
    switch (risk) {
      case "emergency":
        return "bg-red-500 text-white dark:bg-red-600";
      case "very-urgent":
        return "bg-orange-500 text-white dark:bg-orange-600";
      case "urgent":
        return "bg-yellow-400 text-amber-950 dark:bg-yellow-500 dark:text-amber-950";
      case "less-urgent":
        return "bg-green-500 text-white dark:bg-green-600";
      case "not-urgent":
        return "bg-blue-500 text-white dark:bg-blue-600";
      default:
        return "bg-slate-400 text-white dark:bg-slate-600";
    }
  };

  const occupiedBeds = beds.filter((b) => b.status === "occupied" && b.patientId);

  const filteredBeds = occupiedBeds.filter((bed) => {
    if (activeSector === "Todas") return true;
    return bed.ward === activeSector;
  });

  const bedsByWard = filteredBeds.reduce((acc, bed) => {
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

      {/* Seletor de Setores */}
      <div className="px-3 py-2 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 flex gap-1 select-none shrink-0">
        {["Todas", "Emergência", "Observação"].map((sec) => (
          <button
            key={sec}
            onClick={() => handleSectorChange(sec)}
            className={cn(
              "flex-1 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all border",
              activeSector === sec
                ? "bg-[#006699] text-white border-[#006699] dark:bg-sky-500/25 dark:text-sky-300 dark:border-sky-500/40 shadow-sm"
                : "bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            {sec}
          </button>
        ))}
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
                      "w-full flex items-center gap-3 text-left p-2 rounded-xl transition-all border group",
                      isActive
                        ? "bg-sky-50/50 dark:bg-sky-900/10 border-sky-200 dark:border-sky-800/50 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/20 hover:border-slate-200 dark:hover:border-slate-700/30"
                    )}
                  >
                    {/* Leito Badge */}
                    <div
                      className={cn(
                        "w-[64px] shrink-0 rounded-lg flex flex-col items-center justify-center py-2 text-center transition-all font-black text-[10px] uppercase tracking-wider shadow-sm",
                        getRiskColorClass(patient.risk),
                        isActive && "ring-2 ring-inset ring-white/60 dark:ring-white/40 shadow-md"
                      )}
                    >
                      <span className="text-[7px] opacity-75 font-black uppercase tracking-widest block mb-0.5 leading-none">Leito</span>
                      <span className="text-xs leading-none font-black truncate max-w-full px-1">
                        {(() => {
                          const shortName = bed.name.replace("Leito ", "");
                          return shortName === "Maca Extra" ? "M. Extra" : shortName;
                        })()}
                      </span>
                    </div>

                    {/* Informações do Paciente */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                      <span
                        className={cn(
                          "text-xs font-black leading-tight line-clamp-2",
                          isActive
                            ? "text-[#006699] dark:text-sky-300"
                            : "text-slate-700 dark:text-slate-200"
                        )}
                      >
                        {patient.name}
                      </span>
                      
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        {patient.risk && (
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              patient.risk === "emergency" ? "bg-red-500 animate-pulse" : "bg-emerald-500"
                            )} />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {patient.risk === "emergency" ? "Crítico" : "Estável"}
                            </span>
                          </div>
                        )}
                        <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {bed.room.replace("Observação ", "Obs. ")}
                        </span>
                      </div>
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
