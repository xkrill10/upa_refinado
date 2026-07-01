import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatients } from "@/hooks/use-patients";
import { useBeds } from "@/context/BedsContext";
import { cn, getPatientProfileUrl } from "@/lib/utils";
import { useRole } from "@/context/RoleContext";
import { Users, Zap, ShieldAlert, Baby } from "lucide-react";

// Ícone SVG inline para Feminino (♀)
const FemaleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="5" />
    <line x1="12" y1="14" x2="12" y2="22" />
    <line x1="9" y1="19" x2="15" y2="19" />
  </svg>
);

// Ícone SVG inline para Masculino (♂)
const MaleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="14" r="5" />
    <line x1="19" y1="5" x2="13.6" y2="10.4" />
    <line x1="15" y1="5" x2="19" y2="5" />
    <line x1="19" y1="5" x2="19" y2="9" />
  </svg>
);

/**
 * Retorna ícone e estilo de cor NEUTRO baseado no SETOR (room),
 * sem usar cores da Classificação de Risco de Manchester
 * (vermelho, laranja, amarelo, verde, azul).
 */
const getSectorBadgeConfig = (room: string) => {
  const r = room.toLowerCase();

  if (r.includes("emergência") || r.includes("box")) {
    return {
      bg: "bg-orange-500 dark:bg-orange-600",
      text: "text-white",
      icon: Zap,
      customIcon: null,
      label: "EMG",
    };
  }
  if (r.includes("feminina")) {
    return {
      bg: "bg-pink-400 dark:bg-pink-500",
      text: "text-white",
      icon: null,
      customIcon: FemaleIcon,
      label: "OBS-F",
    };
  }
  if (r.includes("masculina")) {
    return {
      bg: "bg-blue-400 dark:bg-blue-500",
      text: "text-white",
      icon: null,
      customIcon: MaleIcon,
      label: "OBS-M",
    };
  }
  if (r.includes("pediatria") || r.includes("pediátrica") || r.includes("infantil")) {
    return {
      bg: "bg-violet-500 dark:bg-violet-400",
      text: "text-white",
      icon: Baby,
      customIcon: null,
      label: "PED",
    };
  }
  if (r.includes("isolamento")) {
    return {
      bg: "bg-cyan-500 dark:bg-cyan-600",
      text: "text-white",
      icon: ShieldAlert,
      customIcon: null,
      label: "ISO",
    };
  }
  // Fallback neutro
  return {
    bg: "bg-slate-500 dark:bg-slate-600",
    text: "text-white",
    icon: null,
    customIcon: null,
    label: "LEITO",
  };
};

/** Cor do indicador de risco (bolinha pequena ao lado do nome) */
const getRiskDotColor = (risk: string) => {
  switch (risk) {
    case "emergency":
      return "bg-red-500";
    case "very-urgent":
      return "bg-orange-500";
    case "urgent":
      return "bg-yellow-400";
    case "less-urgent":
      return "bg-green-500";
    case "not-urgent":
      return "bg-blue-500";
    default:
      return "bg-slate-400";
  }
};

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
                const sectorConfig = getSectorBadgeConfig(bed.room);
                const SectorIcon = sectorConfig.icon;
                const CustomSectorIcon = sectorConfig.customIcon;

                return (
                    <button
                      key={bed.id}
                      onClick={() => {
                        navigate(getPatientProfileUrl(patient.id, role || ""));
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 text-left p-2 rounded-xl transition-all border group",
                        isActive
                          ? "bg-white dark:bg-slate-900 border-[#006699]/30 dark:border-sky-500/30 shadow-md ring-1 ring-[#006699]/10 dark:ring-sky-500/10"
                          : "bg-transparent border-transparent hover:bg-white dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700/50 hover:shadow-sm"
                      )}
                    >
                      {/* Leito Badge - cor NEUTRA por setor, com ícone + número */}
                      <div
                        className={cn(
                          "w-[64px] shrink-0 rounded-lg flex flex-col items-center justify-center py-1.5 text-center transition-all font-black shadow-sm gap-0.5",
                          sectorConfig.bg,
                          sectorConfig.text,
                          isActive && "ring-2 ring-inset ring-white/60 dark:ring-white/40 shadow-md"
                        )}
                      >
                        {/* Ícone do setor */}
                        {SectorIcon && <SectorIcon className="w-5 h-5 drop-shadow-sm mb-0.5" />}
                        {CustomSectorIcon && <CustomSectorIcon className="w-5 h-5 drop-shadow-sm mb-0.5" />}
                        {/* Número do leito */}
                        <span className="text-sm leading-none font-black truncate max-w-full px-1">
                          {(() => {
                            const shortName = bed.name.replace("Leito ", "");
                            return shortName === "Maca Extra" ? "M.E" : shortName;
                          })()}
                        </span>
                        {/* Abreviação do setor */}
                        <span className="text-[7px] opacity-80 font-black uppercase tracking-widest leading-none">
                          {sectorConfig.label}
                        </span>
                      </div>

                    {/* Informações do Paciente */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                      <span
                        className={cn(
                          "text-xs font-black leading-tight line-clamp-2",
                          isActive
                            ? "text-[#006699] dark:text-sky-300"
                            : "text-slate-700 dark:text-slate-200 group-hover:text-[#006699] dark:group-hover:text-sky-300"
                        )}
                      >
                        {patient.name}
                      </span>
                      
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        {patient.risk && (
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              getRiskDotColor(patient.risk),
                              patient.risk === "emergency" && "animate-pulse ring-2 ring-red-500/30"
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
