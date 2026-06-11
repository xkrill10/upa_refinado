import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { GlobalClock } from "@/components/GlobalClock";
import { useAuth } from "./context/AuthContext";
import { RoleProvider, useRole, Role } from "./context/RoleContext";
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Pharmacy = React.lazy(() => import("./pages/Pharmacy"));
const SatellitePharmacy = React.lazy(() => import("./pages/SatellitePharmacy"));
const Sectors = React.lazy(() => import("./pages/Sectors"));
const Queue = React.lazy(() => import("./pages/Queue"));
const NewPatient = React.lazy(() => import("./pages/NewPatient"));
const Triage = React.lazy(() => import("./pages/Triage"));
const Arrival = React.lazy(() => import("./pages/Arrival"));
const Attendances = React.lazy(() => import("./pages/Attendances"));
const Beds = React.lazy(() => import("./pages/Beds"));
const PatientRecord = React.lazy(() => import("./pages/PatientRecord"));
const SUSIntegration = React.lazy(() => import("./pages/SUSIntegration"));
const Patients = React.lazy(() => import("./pages/Patients"));
const CallPanel = React.lazy(() => import("./pages/CallPanel"));
const PatientEvolution = React.lazy(() => import("./pages/PatientEvolution"));
const EvolucaoMedica = React.lazy(() => import("./pages/EvolucaoMedica"));
const EvolucaoEnfermagem = React.lazy(
  () => import("./pages/EvolucaoEnfermagem"),
);
const AnotacaoEnfermagem = React.lazy(
  () => import("./pages/AnotacaoEnfermagem"),
);
const EvolucaoFisioterapia = React.lazy(
  () => import("./pages/EvolucaoFisioterapia"),
);
const EvolucaoNutricao = React.lazy(() => import("./pages/EvolucaoNutricao"));
const EvolucaoPsicologia = React.lazy(
  () => import("./pages/EvolucaoPsicologia"),
);
const EvolucaoServicoSocial = React.lazy(
  () => import("./pages/EvolucaoServicoSocial"),
);
const EvolucaoTerapiaOcupacional = React.lazy(
  () => import("./pages/EvolucaoTerapiaOcupacional"),
);
const EvolucaoFonoaudiologia = React.lazy(
  () => import("./pages/EvolucaoFonoaudiologia"),
);
const EvolucaoFarmaciaClinica = React.lazy(
  () => import("./pages/EvolucaoFarmaciaClinica"),
);
const UserManagement = React.lazy(() => import("./pages/Admin/UserManagement"));
const AuditLogs = React.lazy(() => import("./pages/Admin/AuditLogs"));
const BackupAdmin = React.lazy(() => import("./pages/Admin/BackupAdmin"));
const Consentimentos = React.lazy(() => import("./pages/Admin/Consentimentos"));
const RetencaoDados = React.lazy(() => import("./pages/Admin/RetencaoDados"));
const Anonimizacao = React.lazy(() => import("./pages/Admin/Anonimizacao"));
const CentralIntegracoes = React.lazy(
  () => import("./pages/Admin/CentralIntegracoes"),
);
const Reports = React.lazy(() => import("./pages/Reports"));
const HR = React.lazy(() => import("./pages/HR"));
const Same = React.lazy(() => import("./pages/Same"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Pediatria = React.lazy(() => import("./pages/Pediatria"));
const AtendimentosPediatrico = React.lazy(
  () => import("./pages/AtendimentosPediatrico"),
);
const MyHR = React.lazy(() => import("./pages/MyHR"));
const DoctorDashboard = React.lazy(() => import("./pages/DoctorDashboard"));
const NurseDashboard = React.lazy(() => import("./pages/NurseDashboard"));
const MyWorkspace = React.lazy(() => import("./pages/MyWorkspace"));

// Novas Telas
const EscalaAppRouting = React.lazy(
  () => import("./pages/EscalaApp/EscalaAppRouting"),
);
const Laboratory = React.lazy(() => import("./pages/Laboratory"));
const Inventory = React.lazy(() => import("./pages/Inventory"));
const NursingCheck = React.lazy(() => import("./pages/NursingCheck"));
const TriageRoom = React.lazy(() => import("./pages/TriageRoom"));
const PediatriaRoom = React.lazy(() => import("./pages/PediatriaRoom"));
const NursingCheckRoom = React.lazy(() => import("./pages/NursingCheckRoom"));
const Billing = React.lazy(() => import("./pages/Billing"));
const Governance = React.lazy(() => import("./pages/Governance"));
const Login = React.lazy(() => import("./pages/Login"));
const NirDashboard = React.lazy(() => import("./pages/NirDashboard"));
const CleaningDashboard = React.lazy(() => import("./pages/CleaningDashboard"));

import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import { PatientsProvider } from "@/context/PatientsContext";
import { BedsProvider } from "@/context/BedsContext";
import { AuthProvider } from "@/context/AuthContext";
import { PrescriptionsProvider } from "@/context/PrescriptionsContext";
import { SameProvider } from "@/context/SameContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { HRProvider } from "@/context/HRContext";
import { CallAnnouncer } from "./components/CallAnnouncer";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const isCallPanel = location.pathname === "/painel-chamadas";
  const isCleaning = location.pathname === "/higiene";
  const isLogin = location.pathname === "/login";

  const { user } = useAuth();
  const { role, setRole } = useRole();
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
    role !== "medico";

  return (
    <SidebarProvider defaultOpen={true}>
      <CallAnnouncer />
      <div className="min-h-screen flex w-full">
        {showSidebar && <AppSidebar />}
        <div
          className={cn(
            "flex-1 flex flex-col",
            !isLogin && !isCleaning && "main-content-bg",
          )}
        >
          {!isCallPanel && !isLogin && !isCleaning && (
            <header className="h-24 flex items-center justify-between px-8 sticky top-0 z-20 header-premium-glass">
              <div className="flex items-center gap-6">
                <SidebarTrigger className="h-12 w-12 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-xl" />
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
              "flex-1",
              !isCallPanel && !isLogin && !isCleaning && "p-6",
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
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<Dashboard />} />
                <Route path="/fila" element={<Queue />} />
                <Route path="/novo-paciente" element={<NewPatient />} />
                <Route path="/triagem" element={<Triage />} />
                <Route path="/entrada" element={<Arrival />} />
                <Route path="/atendimentos" element={<Attendances />} />
                <Route path="/painel-chamadas" element={<CallPanel />} />
                <Route path="/pacientes" element={<Patients />} />
                <Route path="/leitos" element={<Beds />} />
                <Route path="/setores" element={<Sectors />} />
                <Route path="/farmacia" element={<Pharmacy />} />
                <Route
                  path="/farmacia-satelite"
                  element={<SatellitePharmacy />}
                />
                <Route path="/rh" element={<HR />} />
                <Route path="/meu-rh" element={<MyHR />} />
                <Route path="/escala/*" element={<EscalaAppRouting />} />
                <Route path="/sus" element={<SUSIntegration />} />
                <Route path="/relatorios" element={<Reports />} />
                <Route path="/same" element={<Same />} />
                <Route path="/paciente/:id" element={<PatientRecord />} />
                <Route
                  path="/paciente/:id/evolucao"
                  element={<PatientEvolution />}
                />
                <Route
                  path="/paciente/:id/evolucao/medica"
                  element={<EvolucaoMedica />}
                />
                <Route
                  path="/paciente/:id/evolucao/enfermagem"
                  element={<EvolucaoEnfermagem />}
                />
                <Route
                  path="/paciente/:id/evolucao/anotacao-enfermagem"
                  element={<AnotacaoEnfermagem />}
                />
                <Route
                  path="/paciente/:id/evolucao/fisioterapia"
                  element={<EvolucaoFisioterapia />}
                />
                <Route
                  path="/paciente/:id/evolucao/nutricao"
                  element={<EvolucaoNutricao />}
                />
                <Route
                  path="/paciente/:id/evolucao/psicologia"
                  element={<EvolucaoPsicologia />}
                />
                <Route
                  path="/paciente/:id/evolucao/servico-social"
                  element={<EvolucaoServicoSocial />}
                />
                <Route
                  path="/paciente/:id/evolucao/terapia-ocupacional"
                  element={<EvolucaoTerapiaOcupacional />}
                />
                <Route
                  path="/paciente/:id/evolucao/fonoaudiologia"
                  element={<EvolucaoFonoaudiologia />}
                />
                <Route
                  path="/paciente/:id/evolucao/farmacia-clinica"
                  element={<EvolucaoFarmaciaClinica />}
                />
                <Route path="/admin/usuarios" element={<UserManagement />} />
                <Route path="/admin/auditoria" element={<AuditLogs />} />
                <Route path="/admin/backups" element={<BackupAdmin />} />
                <Route
                  path="/admin/consentimentos"
                  element={<Consentimentos />}
                />
                <Route path="/admin/retencao" element={<RetencaoDados />} />
                <Route path="/admin/anonimizacao" element={<Anonimizacao />} />
                <Route
                  path="/admin/integracoes"
                  element={<CentralIntegracoes />}
                />
                <Route path="/pediatria" element={<Pediatria />} />
                <Route path="/sala/triagem" element={<TriageRoom />} />
                <Route path="/sala/pediatria" element={<PediatriaRoom />} />
                <Route path="/sala/checagem" element={<NursingCheckRoom />} />
                <Route
                  path="/atendimentos-pediatricos"
                  element={<AtendimentosPediatrico />}
                />
                <Route path="/painel-medico" element={<DoctorDashboard />} />
                <Route path="/painel-enfermagem" element={<NurseDashboard />} />
                <Route path="/meu-consultorio" element={<MyWorkspace />} />

                {/* Novas Rotas (Esqueletos) */}
                <Route path="/laboratorio" element={<Laboratory />} />
                <Route path="/almoxarifado" element={<Inventory />} />
                <Route path="/checagem-enfermagem" element={<NursingCheck />} />
                <Route path="/faturamento" element={<Billing />} />
                <Route path="/governanca" element={<Governance />} />

                <Route path="/nir" element={<NirDashboard />} />
                <Route path="/higiene" element={<CleaningDashboard />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AuthProvider>
          <RoleProvider>
            <PatientsProvider>
              <BedsProvider>
                <PrescriptionsProvider>
                  <SameProvider>
                    <InventoryProvider>
                      <HRProvider>
                        <TooltipProvider>
                          <Sonner />
                          <AppContent />
                        </TooltipProvider>
                      </HRProvider>
                    </InventoryProvider>
                  </SameProvider>
                </PrescriptionsProvider>
              </BedsProvider>
            </PatientsProvider>
          </RoleProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
