import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  BedDouble,
  LogOut,
  Settings,
  Users,
  Stethoscope,
  ClipboardList,
  UserSquare2,
  FlaskConical,
  UserPlus,
  FileText,
  Syringe,
  Ambulance,
  Menu,
  X,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { GlobalClock } from "./GlobalClock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { motion } from "motion/react";
import { usePatients } from "@/hooks/use-patients";
import { Badge } from "@/components/ui/badge";

interface ClinicalLayoutProps {
  children: React.ReactNode;
}

export const ClinicalLayout = ({ children }: ClinicalLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients } = usePatients();
  const { role } = useRole();

  const isPatientRoute = location.pathname.startsWith("/paciente/");
  const isNursingProfile = location.pathname.endsWith("/perfil-enfermagem");
  const [isMenuOpen, setIsMenuOpen] = React.useState(!isPatientRoute);
  const [isNavMenuOpen, setIsNavMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMenuOpen(!isPatientRoute);
  }, [isPatientRoute]);

  React.useEffect(() => {
    setIsNavMenuOpen(false);
  }, [location.pathname]);

  const currentPatientId = location.pathname.match(/\/paciente\/(\d+)/)
    ? location.pathname.match(/\/paciente\/(\d+)/)![1]
    : patients?.find((p) => p.status === "attending")?.id || "3";

  const getMenuItems = () => {
    if (role === "recepcao") {
      return [
        {
          id: "recepcao",
          icon: UserPlus,
          label: "Recepção",
          path: "/novo-paciente",
        },
      ];
    }
    if (role === "medico") {
      return [
        {
          id: "painel",
          icon: UserSquare2,
          label: "Painel Médico",
          path: "/painel-medico",
        },
        {
          id: "fila",
          icon: ClipboardList,
          label: "Fila de Atendimento",
          path: "/fila",
        },
        {
          id: "internacao",
          icon: BedDouble,
          label: "Lista de Internações",
          path: "/lista-internacao",
        },
        {
          id: "leitos",
          icon: BedDouble,
          label: "Gestão de Leitos",
          path: "/leitos",
        },
        {
          id: "evolucoes",
          icon: FileText,
          label: "Evoluções",
          path: `/paciente/${currentPatientId}/evolucao/medica`,
        },
        {
          id: "lab",
          icon: FlaskConical,
          label: "Laboratório",
          path: "/laboratorio",
        },
        { id: "nir", icon: Ambulance, label: "Regulação (NIR)", path: "/nir" },
      ];
    }
    if (role === "tecnico_enfermagem" || role === "auxiliar_enfermagem") {
      return [
        {
          id: "fila_atividades",
          icon: ClipboardList,
          label: "Fila de Atividades",
          path: "/checagem-enfermagem",
        },
        {
          id: "checagem_sala",
          icon: Syringe,
          label: "Visão por Sala",
          path: "/sala/checagem",
        },
      ];
    }
    
    return [
      {
        id: "painel",
        icon: Activity,
        label: "Painel Enfermagem",
        path: "/painel-enfermagem",
      },
      {
        id: "evolucao-enfermagem",
        icon: FileText,
        label: "Evoluções",
        path: `/paciente/${currentPatientId}/perfil-enfermagem`,
      },
      {
        id: "internacao",
        icon: BedDouble,
        label: "Lista de Internações",
        path: "/lista-internacao",
      },
      {
        id: "leitos",
        icon: BedDouble,
        label: "Gestão de Leitos",
        path: "/leitos",
      },
      {
        id: "checagem",
        icon: Syringe,
        label: "Checagem Leito",
        path: "/checagem-enfermagem",
      },
    ];
  };

  const MENU_ITEMS = getMenuItems();

  const admissionQueue = patients.filter(
    (p) => p.admissionRequest?.status === "pending",
  );
  const hasPendingAdmissions = admissionQueue.length > 0;

  const localDoctor =
    typeof window !== "undefined"
      ? localStorage.getItem("upa_active_doctor")
      : null;
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    localDoctor ||
    (role === "tecnico_enfermagem" ? "TÉCNICO DE ENFERMAGEM" : 
     role === "auxiliar_enfermagem" ? "AUXILIAR DE ENFERMAGEM" : 
     "ENFERMAGEM");

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Navigation Rail */}
      <div 
        className={cn(
          "h-full flex-shrink-0 flex flex-col items-center py-6 z-40 relative transition-all duration-300 backdrop-blur-2xl border-r shadow-[4px_0_24px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]",
          isNursingProfile
            ? (isNavMenuOpen 
                ? "w-[72px] bg-sky-500/15 dark:bg-gradient-to-b dark:from-[#004466]/95 dark:to-[#001a33]/95 border-sky-500/20 dark:border-blue-700/30"
                : "w-0 overflow-hidden border-none opacity-0 pointer-events-none")
            : (isMenuOpen 
                ? "w-[72px] bg-sky-500/15 dark:bg-gradient-to-b dark:from-[#004466]/95 dark:to-[#001a33]/95 border-sky-500/20 dark:border-blue-700/30"
                : "w-14 bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50")
        )}
      >
        {isNursingProfile ? (
          <div 
            className={cn(
              "h-full w-full flex flex-col items-center justify-between transition-all duration-500 ease-in-out",
              isNavMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
            )}
          >
            {/* Logo Minimized */}
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center mb-8 border border-sky-500/20 dark:border-sky-400/30 shadow-sm backdrop-blur-md">
              <Activity className="h-5 w-5 text-[#006699] dark:text-sky-300 drop-shadow-[0_0_8px_rgba(0,102,153,0.3)] dark:drop-shadow-[0_0_8px_rgba(14,165,233,0.8)] animate-pulse-slow" />
            </div>

            {/* Menu Items */}
            <nav className="flex-1 w-full flex flex-col items-center gap-4 mt-2">
              <TooltipProvider delayDuration={0}>
                {MENU_ITEMS.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  const Icon = item.icon;
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => navigate(item.path)}
                          className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group relative",
                            isActive
                              ? "bg-white/80 dark:bg-sky-500/25 backdrop-blur-md border border-white/60 dark:border-sky-400/40 shadow-sm dark:shadow-[0_0_20px_rgba(14,165,233,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] text-[#006699] dark:text-white font-black"
                              : "text-slate-500 dark:text-blue-100/70 hover:text-[#006699] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5 border border-transparent",
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[#006699] dark:bg-sky-400 rounded-r-full drop-shadow-[0_0_4px_rgba(0,102,153,0.4)] dark:drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]"
                            />
                          )}
                          {item.id === "internacao" && hasPendingAdmissions && (
                            <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center z-20">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                              <Badge className="relative h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white border border-white/20 dark:border-slate-900/50 text-[9px] font-black pointer-events-none shadow-md">
                                {admissionQueue.length}
                              </Badge>
                            </div>
                          )}
                          <Icon
                            className={cn(
                              "h-5 w-5 transition-all duration-300 group-hover:scale-110",
                              isActive
                                ? "scale-110 text-[#006699] dark:text-sky-300 drop-shadow-[0_0_4px_rgba(0,102,153,0.2)] dark:drop-shadow-[0_0_8px_rgba(14,165,233,0.8)] stroke-[2.5px]"
                                : "",
                            )}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="font-bold text-[10px] uppercase tracking-[0.15em] bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-none ml-2 shadow-xl"
                      >
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </nav>

            {/* Bottom Actions */}
            <div className="w-full flex flex-col items-center gap-4 mt-auto">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-12 flex justify-center pb-2 border-b border-blue-700/30">
                      <ThemeToggle position="bottom" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="font-bold text-[10px] uppercase tracking-[0.15em] bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-none ml-2"
                  >
                    Aparência
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate("/")}
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-500 dark:text-blue-100/70 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-all group"
                    >
                      <LogOut className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="font-bold text-[10px] uppercase tracking-[0.15em] bg-red-600 text-white border-none ml-2"
                  >
                    Sair
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ) : (
          <>
            {!isMenuOpen ? (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#006699] hover:bg-white/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-white/40 dark:hover:border-slate-700 shadow-sm mt-2"
              >
                <Menu className="w-5 h-5" />
              </button>
            ) : (
              <>
                {isPatientRoute && (
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-md text-slate-500 hover:text-[#006699] dark:hover:text-sky-400 z-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                
                {/* Logo Minimized */}
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center mb-8 border border-sky-500/20 dark:border-sky-400/30 shadow-sm backdrop-blur-md">
                  <Activity className="h-5 w-5 text-[#006699] dark:text-sky-300 drop-shadow-[0_0_8px_rgba(0,102,153,0.3)] dark:drop-shadow-[0_0_8px_rgba(14,165,233,0.8)] animate-pulse-slow" />
                </div>

                {/* Menu Items */}
                <nav className="flex-1 w-full flex flex-col items-center gap-4 mt-2">
                  <TooltipProvider delayDuration={0}>
                    {MENU_ITEMS.map((item) => {
                      const isActive = location.pathname.startsWith(item.path);
                      const Icon = item.icon;
                      return (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => navigate(item.path)}
                              className={cn(
                                "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group relative",
                                isActive
                                  ? "bg-white/80 dark:bg-sky-500/25 backdrop-blur-md border border-white/60 dark:border-sky-400/40 shadow-sm dark:shadow-[0_0_20px_rgba(14,165,233,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] text-[#006699] dark:text-white font-black"
                                  : "text-slate-500 dark:text-blue-100/70 hover:text-[#006699] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5 border border-transparent",
                              )}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[#006699] dark:bg-sky-400 rounded-r-full drop-shadow-[0_0_4px_rgba(0,102,153,0.4)] dark:drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]"
                                />
                              )}
                              {item.id === "internacao" && hasPendingAdmissions && (
                                <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center z-20">
                                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                                  <Badge className="relative h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white border border-white/20 dark:border-slate-900/50 text-[9px] font-black pointer-events-none shadow-md">
                                    {admissionQueue.length}
                                  </Badge>
                                </div>
                              )}
                              <Icon
                                className={cn(
                                  "h-5 w-5 transition-all duration-300 group-hover:scale-110",
                                  isActive
                                    ? "scale-110 text-[#006699] dark:text-sky-300 drop-shadow-[0_0_4px_rgba(0,102,153,0.2)] dark:drop-shadow-[0_0_8px_rgba(14,165,233,0.8)] stroke-[2.5px]"
                                    : "",
                                )}
                              />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="font-bold text-[10px] uppercase tracking-[0.15em] bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-none ml-2 shadow-xl"
                          >
                            {item.label}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                </nav>

                {/* Bottom Actions */}
                <div className="w-full flex flex-col items-center gap-4 mt-auto">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-12 flex justify-center pb-2 border-b border-blue-700/30">
                          <ThemeToggle position="bottom" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="font-bold text-[10px] uppercase tracking-[0.15em] bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-none ml-2"
                      >
                        Aparência
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => navigate("/")}
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-500 dark:text-blue-100/70 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-all group"
                        >
                          <LogOut className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="font-bold text-[10px] uppercase tracking-[0.15em] bg-red-600 text-white border-none ml-2"
                      >
                        Sair
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden main-content-bg">
        {/* Simplified Header matching the dark blue theme */}
        <header className="h-20 flex items-center justify-between px-2 sticky top-0 z-20 header-premium-glass">
          <div className="flex items-center gap-4">
            {isNursingProfile && (
              <button
                onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#006699] hover:bg-white/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all border border-slate-200/50 dark:border-slate-800/50 shadow-sm mr-1 shrink-0"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-[0.15em] text-foreground uppercase mission-control-title leading-tight">
                Operação Clínica
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.7)]" />
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.25em] leading-none">
                  Controle Operacional
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <GlobalClock />

            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-slate-900/50 p-1.5 pr-3 rounded-xl border border-white/20 dark:border-slate-800 backdrop-blur-md shadow-sm">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">
                  Perfil Operacional
                </span>
                <span className="text-[12px] font-black text-foreground uppercase tracking-tight leading-none">
                  {displayName}
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xs uppercase shadow-sm">
                {displayName.substring(0, 2)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full overflow-y-auto relative p-2">
          {children}
        </main>
      </div>
    </div>
  );
};
