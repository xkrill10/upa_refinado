import React, { Suspense } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { GlobalClock } from "@/components/GlobalClock";
import { ThemeToggle } from "./components/ThemeToggle";
import { CallAnnouncer } from "./components/CallAnnouncer";
import { useAuth } from "./context/AuthContext";
import { useRole, Role } from "./context/RoleContext";
import { cn } from "@/lib/utils";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./AppRoutes";
import { ClinicalLayout } from "./components/ClinicalLayout";

const AppContent = () => {
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const isCallPanel = location.pathname === "/painel-chamadas";
  const isCleaning = location.pathname === "/higiene";
  const isLogin = location.pathname === "/login";
  const { user } = useAuth();
  const { role, setRole } = useRole();

  const isClinicalPanel =
    (role === "enfermeiro" || role === "medico" || role === "recepcao") &&
    (location.pathname.startsWith("/painel-enfermagem") ||
      location.pathname.startsWith("/painel-medico") ||
      location.pathname.startsWith("/fila") ||
      location.pathname.startsWith("/laboratorio") ||
      location.pathname.startsWith("/paciente") ||
      location.pathname.startsWith("/lista-internacao") ||
      location.pathname.startsWith("/leitos") ||
      location.pathname.startsWith("/novo-paciente"));
  const isClinicalRoom = location.pathname.startsWith("/sala/");

  const localDoctor =
    typeof window !== "undefined"
      ? localStorage.getItem("upa_active_doctor")
      : null;

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    localDoctor ||
    "OPERADOR DO SISTEMA";

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const showSidebar =
    !isFullscreen &&
    !isCallPanel &&
    !isLogin &&
    !isCleaning &&
    !isClinicalPanel &&
    !isClinicalRoom;

  if (isClinicalPanel) {
    return (
      <SidebarProvider defaultOpen={false} key="clinical-layout">
        <CallAnnouncer />
        <ClinicalLayout>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-[#006699] dark:text-sky-400 font-bold tracking-widest uppercase text-xs">
                  Carregando Operação Clínica...
                </div>
              </div>
            }
          >
            <AppRoutes />
          </Suspense>
        </ClinicalLayout>
      </SidebarProvider>
    );
  }

  if (isClinicalRoom) {
    return (
      <SidebarProvider defaultOpen={false} key="room-layout">
        <CallAnnouncer />
        <div className="min-h-screen flex w-full transition-all duration-300 relative main-content-bg">
          <main className="flex-1 flex flex-col min-w-0 w-full relative">
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-pulse text-[#006699] dark:text-sky-400 font-bold tracking-widest uppercase text-xs">
                    Iniciando Modo Foco...
                  </div>
                </div>
              }
            >
              <AppRoutes />
            </Suspense>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={true} key="main-layout">
      <CallAnnouncer />
      <div className="min-h-screen flex w-full">
        {showSidebar && <AppSidebar />}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0",
            !isLogin && !isCleaning && "main-content-bg",
          )}
        >
          {!isCallPanel && !isLogin && !isCleaning && (
            <header className="h-24 flex items-center justify-between px-8 sticky top-0 z-20 header-premium-glass">
              <div className="flex items-center gap-6">
                {showSidebar && (
                  <SidebarTrigger className="h-12 w-12 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-xl" />
                )}
                <div className="flex flex-col">
                  <span className="text-base md:text-[18px] font-black tracking-[0.15em] text-foreground uppercase mission-control-title leading-tight">
                    UPA · Unidade de Pronto Atendimento
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.7)]" />
                    <span className="text-xs md:text-[12px] text-muted-foreground font-black uppercase tracking-[0.25em] leading-none">
                      SISTEMA DE CONTROLE OPERACIONAL
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-900/50 p-1.5 pr-3 rounded-xl border border-white/20 dark:border-slate-800 backdrop-blur-md shadow-sm transition-all hover:bg-white/80 dark:hover:bg-slate-900/80">
                  <span className="text-[10px] font-black uppercase text-muted-foreground ml-2 tracking-widest">
                    Perfil:
                  </span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="bg-transparent text-xs font-black border-none outline-none cursor-pointer focus:ring-0 text-foreground"
                  >
                    <option value="diretoria">👔 DIRETORIA</option>
                    <option value="enfermeiro">👩‍⚕️ ENFERMAGEM</option>
                    <option value="medico">👨‍⚕️ MÉDICO</option>
                    <option value="recepcao">🙋‍♀️ RECEPÇÃO</option>
                  </select>
                </div>
                <GlobalClock />
                {(user || localDoctor) && (
                  <div className="hidden md:flex flex-col items-end px-5 border-r border-border/30">
                    <span className="text-[11px] md:text-[12px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1 opacity-60">
                      Operador do Sistema
                    </span>
                    <span className="text-sm md:text-[15px] font-black text-foreground tracking-tight mission-control-title uppercase">
                      {displayName}
                    </span>
                  </div>
                )}
                <ThemeToggle position="top" />
              </div>
            </header>
          )}
          <main
            className={cn(
              "flex-1 min-w-0 w-full",
              !isCallPanel && !isLogin && !isCleaning && "p-2",
            )}
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="animate-pulse text-muted-foreground font-bold tracking-widest uppercase text-xs">
                    Carregando...
                  </div>
                </div>
              }
            >
              <AppRoutes />
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <AppProviders>
    <AppContent />
  </AppProviders>
);

export default App;
