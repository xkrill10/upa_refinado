import {
  Shield,
  LayoutDashboard,
  Users,
  UserPlus,
  Activity,
  ClipboardList,
  Building2,
  BedDouble,
  Stethoscope,
  HeartPulse,
  FileText,
  Pill,
  UserCog,
  Globe,
  Megaphone,
  LogIn,
  Archive,
  Baby,
  FlaskConical,
  PackageOpen,
  Syringe,
  DollarSign,
  Sparkles,
  UserSquare2,
  MessageSquare,
  ArchiveRestore,
  Ambulance,
  Droplets,
  RotateCcw,
  CalendarDays,
  Server,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useRole } from "@/context/RoleContext";
import { usePatients } from "@/hooks/use-patients";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";

export function AppSidebar() {
  const { state } = useSidebar();
  const { role } = useRole();
  const { resetSystem, patients } = usePatients();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    "Evoluções": role === "enfermeiro" || role === "medico",
  });

  const admissionQueue = patients.filter((p) => p.admissionRequest?.status === "pending");
  const hasPendingAdmissions = admissionQueue.length > 0;

  const toggleSubMenu = (title: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Extrair o ID do paciente da rota atual ou buscar um paciente em atendimento / fallback padrão
  const match = location.pathname.match(/^\/paciente\/([^/]+)/);
  const currentPatientId = match
    ? match[1]
    : patients?.find((p) => p.status === "attending")?.id || "3";

  const menuGroupsRaw = [
    {
      label: "Operacional",
      items: [
        { title: "Dashboard", url: "/", icon: LayoutDashboard },
        { title: "Senhas", url: "/entrada", icon: LogIn },
        { title: "Triagem", url: "/triagem", icon: Stethoscope },
        { title: "Pediatria", url: "/pediatria", icon: Baby },
        { title: "Recepção", url: "/novo-paciente", icon: UserPlus },
      ],
    },
    {
      label: "Atendimento Clínico",
      items: [
        { title: "Fila de Atendimento", url: "/fila", icon: ClipboardList },
        { title: "Painel Médico", url: "/painel-medico", icon: UserSquare2 },
        {
          title: "Painel Enfermagem",
          url: "/painel-enfermagem",
          icon: Activity,
        },
        { title: "Clínico", url: "/atendimentos", icon: HeartPulse },
        {
          title: "Evoluções",
          icon: FileText,
          subItems: [
            {
              title: "Geral (Pesquisa)",
              url: `/paciente/${currentPatientId}/evolucao`,
            },
            {
              title: "Médica",
              url: `/paciente/${currentPatientId}/evolucao/medica`,
            },
            {
              title: "Enfermagem",
              url: `/paciente/${currentPatientId}/evolucao/enfermagem`,
            },
            {
              title: "Anotação Técnica",
              url: `/paciente/${currentPatientId}/evolucao/anotacao-enfermagem`,
            },
            {
              title: "Fisioterapia",
              url: `/paciente/${currentPatientId}/evolucao/fisioterapia`,
            },
            {
              title: "Nutrição",
              url: `/paciente/${currentPatientId}/evolucao/nutricao`,
            },
            {
              title: "Psicologia",
              url: `/paciente/${currentPatientId}/evolucao/psicologia`,
            },
            {
              title: "Serviço Social",
              url: `/paciente/${currentPatientId}/evolucao/servico-social`,
            },
            {
              title: "Terapia Ocupacional",
              url: `/paciente/${currentPatientId}/evolucao/terapia-ocupacional`,
            },
            {
              title: "Fonoaudiologia",
              url: `/paciente/${currentPatientId}/evolucao/fonoaudiologia`,
            },
            {
              title: "Farmácia Clínica",
              url: `/paciente/${currentPatientId}/evolucao/farmacia-clinica`,
            },
          ],
        },
        { title: "Pediátrico", url: "/atendimentos-pediatricos", icon: Baby },
        { title: "Laboratório", url: "/laboratorio", icon: FlaskConical },
        { title: "Lista de Internações", url: "/lista-internacao", icon: BedDouble },
        { title: "Leitos", url: "/leitos", icon: BedDouble },
        { title: "Checagem Leito", url: "/checagem-enfermagem", icon: Syringe },
        { title: "Regulação (NIR)", url: "/nir", icon: Ambulance },
      ],
    },
    {
      label: "Gestão e Administração",
      items: [
        { title: "Pacientes", url: "/pacientes", icon: Users },
        {
          title: "Central de Integrações",
          url: "/admin/integracoes",
          icon: Server,
        },
        { title: "Setores", url: "/setores", icon: Building2 },
        { title: "SAME", url: "/same", icon: Archive },
        { title: "Recursos Humanos", url: "/rh", icon: UserCog },
        {
          title: "Segurança e LGPD",
          icon: Shield,
          subItems: [
            { title: "Auditoria de Acessos", url: "/admin/auditoria" },
            { title: "Backups Automáticos", url: "/admin/backups" },
            { title: "Termos e Consentimento", url: "/admin/consentimentos" },
            { title: "Retenção de Dados", url: "/admin/retencao" },
            { title: "Anonimização de Dados", url: "/admin/anonimizacao" },
          ],
        },
        {
          title: "Escala de Plantão",
          icon: CalendarDays,
          subItems: [
            { title: "Dashboard", url: "/escala/dashboard" },
            { title: "Escala Control", url: "/escala" },
            { title: "Novo Colaborador", url: "/escala/novo" },
            { title: "Pesquisar", url: "/escala/pesquisar" },
            { title: "Gerenciamento", url: "/escala/gerenciamento" },
            { title: "Atestados", url: "/escala/atestados" },
            { title: "Relatórios", url: "/escala/relatorios" },
          ],
        },
        { title: "Meu RH", url: "/meu-rh", icon: UserSquare2 },
        { title: "Faturamento", url: "/faturamento", icon: DollarSign },
        { title: "Relatórios", url: "/relatorios", icon: FileText },
      ],
    },
    {
      label: "Serviços e Apoio",
      items: [
        {
          title: "Painel de Chamadas",
          url: "/painel-chamadas",
          icon: Megaphone,
        },
        { title: "Farmácia Central", url: "/farmacia", icon: Pill },
        {
          title: "Farm. Satélite",
          url: "/farmacia-satelite",
          icon: ArchiveRestore,
        },
        { title: "Almoxarifado", url: "/almoxarifado", icon: PackageOpen },
        { title: "Governança", url: "/governanca", icon: Sparkles },
        { title: "Higienização", url: "/higiene", icon: Droplets },
        { title: "SUS Cross Vagas", url: "/sus", icon: Globe },
      ],
    },
  ];

  let menuGroups = menuGroupsRaw;
  if (role === "enfermeiro") {
    menuGroups = [
      {
        label: "Atendimento Clínico",
        items: menuGroupsRaw[1].items
          .map((item) => {
            if (item.title === "Evoluções") {
              return {
                ...item,
                subItems: item.subItems?.filter(
                  (sub) => sub.title === "Enfermagem",
                ),
              };
            }
            return item;
          })
          .filter((item) =>
            [
              "Painel Enfermagem",
              "Evoluções",
              "Lista de Internações",
              "Leitos",
              "Checagem Leito",
            ].includes(item.title),
          ),
      },
    ];
  } else if (role === "medico") {
    menuGroups = [
      {
        label: "Atendimento Clínico",
        items: menuGroupsRaw[1].items
          .map((item) => {
            if (item.title === "Evoluções") {
              return {
                ...item,
                subItems: item.subItems?.filter(
                  (sub) => sub.title === "Médica",
                ),
              };
            }
            return item;
          })
          .filter((item) =>
            [
              "Painel Médico",
              "Fila de Atendimento",
              "Lista de Internações",
              "Leitos",
              "Evoluções",
              "Laboratório",
              "Regulação (NIR)",
            ].includes(item.title),
          ),
      },
    ];
  }

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] z-30 [&>div[data-sidebar=sidebar]]:bg-gradient-to-b [&>div[data-sidebar=sidebar]]:from-[#004466]/95 [&>div[data-sidebar=sidebar]]:to-[#001a33]/95 [&>div[data-sidebar=sidebar]]:backdrop-blur-xl [&>div[data-sidebar=sidebar]]:border [&>div[data-sidebar=sidebar]]:border-blue-700/30"
    >
      <SidebarHeader className="p-3 pb-2 bg-transparent border-b border-blue-700/30">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-md relative overflow-hidden group transition-all duration-300 hover:border-white/30 hover:shadow-[0_8px_30px_rgba(14,165,233,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="h-10 w-10 rounded-lg bg-sky-500/20 flex items-center justify-center shrink-0 border border-sky-400/30 shadow-inner backdrop-blur-md z-10 transition-transform group-hover:scale-105 duration-300">
            <Activity className="h-5 w-5 text-sky-300 drop-shadow-[0_0_8px_rgba(14,165,233,0.8)] animate-pulse-slow" />
          </div>
          {!collapsed && (
            <div className="flex flex-col z-10">
              <h1 className="text-lg mission-control-title text-white uppercase font-black tracking-tight drop-shadow-md">
                UPA Control
              </h1>
              <div className="flex items-center gap-1.5 leading-none mt-0.5">
                <span className="text-[9px] text-sky-200/80 font-black uppercase tracking-[0.2em]">
                  Sistema de Gestão
                </span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-transparent no-scrollbar py-0">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-0">
            {!collapsed && (
              <SidebarGroupLabel className="px-5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/50 mt-1.5">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent
              className={cn(
                "transition-all duration-300",
                collapsed ? "px-1" : "px-2",
              )}
            >
              <SidebarMenu
                className={cn("gap-0.5", collapsed && "items-center")}
              >
                {group.items.map((item) => {
                  const active = isActive(item.url);
                  const hasSubItems = !!item.subItems;
                  const isSubOpen = !!openMenus[item.title];
                  const isAnySubActive =
                    hasSubItems &&
                    item.subItems.some((sub) => isActive(sub.url));

                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className="w-full flex flex-col justify-center py-0"
                    >
                      {hasSubItems ? (
                        <div
                          className={cn(
                            "flex items-center cursor-pointer transition-all duration-300 relative group/item rounded-xl w-full",
                            collapsed
                              ? "justify-center h-10 w-10 px-0"
                              : "gap-3 px-3 py-2.5",
                            isAnySubActive
                              ? "bg-sky-500/10 text-white font-bold"
                              : "text-blue-100/70 hover:text-white hover:bg-white/5",
                          )}
                          onClick={(e) => toggleSubMenu(item.title, e)}
                        >
                          <div
                            className={cn(
                              "flex items-center gap-3 relative z-10 w-full",
                              collapsed && "justify-center",
                            )}
                          >
                            <div
                              className={cn(
                                "flex items-center justify-center shrink-0 transition-all duration-300",
                                isAnySubActive
                                  ? "text-sky-300"
                                  : "text-blue-100/70 group-hover/item:text-blue-50",
                              )}
                            >
                              <item.icon
                                className={cn(
                                  "h-[22px] w-[22px] transition-all duration-300",
                                  isAnySubActive
                                    ? "stroke-[2.5px]"
                                    : "stroke-[2px]",
                                )}
                              />
                            </div>
                            {!collapsed && (
                              <span
                                className={cn(
                                  "text-[13px] font-bold tracking-wide transition-all duration-300 whitespace-nowrap flex-1",
                                  isAnySubActive
                                    ? "text-white"
                                    : "text-blue-100/70 group-hover/item:text-blue-50",
                                )}
                              >
                                {item.title}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <NavLink
                          to={item.url!}
                          end
                          className={({ isActive: linkActive }) =>
                            cn(
                              "flex items-center transition-all duration-300 relative group/item rounded-xl",
                              collapsed
                                ? "justify-center h-10 w-10"
                                : "w-full gap-3 px-3 py-2.5",
                              linkActive
                                ? "bg-sky-500/25 backdrop-blur-md border border-sky-400/40 shadow-[0_0_20px_rgba(14,165,233,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] text-white font-black"
                                : "text-blue-100/70 hover:text-white hover:bg-white/5 border border-transparent",
                            )
                          }
                        >
                          <div
                            className={cn(
                              "flex items-center gap-3 relative z-10",
                              collapsed ? "justify-center" : "w-full",
                            )}
                          >
                            <motion.div
                              animate={active ? { scale: 1.05 } : { scale: 1 }}
                              whileTap={{ scale: 0.95 }}
                              className={cn(
                                "flex items-center justify-center shrink-0 transition-all duration-300",
                                active
                                  ? "text-sky-300 drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]"
                                  : "text-blue-100/70 group-hover/item:text-blue-50",
                              )}
                            >
                              <item.icon
                                className={cn(
                                  "h-[22px] w-[22px] transition-all duration-300",
                                  active
                                    ? "stroke-[2.5px] animate-pulse-slow"
                                    : "stroke-[2px]",
                                )}
                              />
                            </motion.div>

                            {!collapsed && (
                              <span
                                className={cn(
                                  "text-[13px] font-bold tracking-wide transition-all duration-300 whitespace-nowrap",
                                  active
                                    ? "text-white"
                                    : "text-blue-100/70 group-hover/item:text-blue-50",
                                )}
                              >
                                {item.title}
                              </span>
                            )}
                            
                            {/* ADMISSION QUEUE BADGE */}
                            {item.url === "/lista-internacao" && hasPendingAdmissions && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                                <Badge className="relative h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white border-0 text-[10px] font-black pointer-events-none">
                                  {admissionQueue.length}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </NavLink>
                      )}

                      {!collapsed && hasSubItems && (
                        <AnimatePresence>
                          {isSubOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden ml-6 pl-3 border-l border-white/10 flex flex-col gap-1 mt-1"
                            >
                              {item.subItems.map((subItem) => (
                                <NavLink
                                  key={subItem.title}
                                  to={subItem.url}
                                  end
                                  className={({ isActive: subActive }) =>
                                    cn(
                                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                                      subActive
                                        ? "text-sky-300 bg-sky-500/10"
                                        : "text-blue-100/60 hover:text-white hover:bg-white/5",
                                    )
                                  }
                                >
                                  {subItem.title}
                                </NavLink>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup className="mt-auto px-4 pb-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Gestão de Acessos">
                  <NavLink
                    to="/admin/usuarios"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl transition-all w-full",
                      location.pathname === "/admin/usuarios"
                        ? "bg-[#006699] text-white shadow-lg shadow-[#006699]/30"
                        : "text-blue-100 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Shield className="h-4 w-4" />
                    <span className="font-semibold tracking-wide text-[11px] uppercase">
                      Acessos
                    </span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-white/10 bg-transparent">
        <div className="flex items-center justify-between gap-3">
          {!collapsed && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-sidebar-foreground/30 uppercase tracking-widest">
                Interface
              </span>
              <span className="text-xs font-semibold text-sidebar-foreground opacity-80">
                Aparência
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={resetSystem}
              className="h-8 w-8 text-sidebar-foreground/50 hover:text-red-400 hover:bg-red-400/10"
              title="Resetar Dados de Teste"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <ThemeToggle position="bottom" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
