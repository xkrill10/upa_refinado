import { LayoutDashboard, Users, UserPlus, Activity, ClipboardList, Building2, BedDouble, Stethoscope, HeartPulse, FileText, Pill, UserCog, Globe, Megaphone, LogIn, Archive, Baby, FlaskConical, PackageOpen, Syringe, DollarSign, Sparkles, UserSquare2, MessageSquare, ArchiveRestore, Ambulance, Droplets, RotateCcw } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { usePatients } from "@/hooks/use-patients";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";

const menuGroups = [
  {
    label: "Operacional",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Senhas", url: "/entrada", icon: LogIn },
      { title: "Triagem", url: "/triagem", icon: Stethoscope },
      { title: "Pediatria", url: "/pediatria", icon: Baby },
      { title: "Recepção", url: "/novo-paciente", icon: UserPlus },
    ]
  },
  {
    label: "Atendimento Clínico",
    items: [
      { title: "Painel Médico", url: "/painel-medico", icon: UserSquare2 },
      { title: "Fila de Atendimento", url: "/fila", icon: ClipboardList },
      { title: "Clínico", url: "/atendimentos", icon: HeartPulse },
      { title: "Pediátrico", url: "/atendimentos-pediatrico", icon: Baby },
      { title: "Laboratório", url: "/laboratorio", icon: FlaskConical },
      { title: "Leitos", url: "/leitos", icon: BedDouble },
      { title: "Checagem Leito", url: "/checagem-enfermagem", icon: Syringe },
      { title: "Regulação (NIR)", url: "/nir", icon: Ambulance },
    ]
  },
  {
    label: "Gestão e Administração",
    items: [
      { title: "Pacientes", url: "/pacientes", icon: Users },
      { title: "Setores", url: "/setores", icon: Building2 },
      { title: "SAME", url: "/same", icon: Archive },
      { title: "Recursos Humanos", url: "/rh", icon: UserCog },
      { title: "Meu RH", url: "/meu-rh", icon: UserSquare2 },
      { title: "Faturamento", url: "/faturamento", icon: DollarSign },
      { title: "Relatórios", url: "/relatorios", icon: FileText },
    ]
  },
  {
    label: "Serviços e Apoio",
    items: [
      { title: "Painel de Chamadas", url: "/painel-chamadas", icon: Megaphone },
      { title: "Farmácia Central", url: "/farmacia", icon: Pill },
      { title: "Farm. Satélite", url: "/farmacia-satelite", icon: ArchiveRestore },
      { title: "Almoxarifado", url: "/almoxarifado", icon: PackageOpen },
      { title: "Governança", url: "/governanca", icon: Sparkles },
      { title: "Higienização", url: "/higiene", icon: Droplets },
      { title: "SUS Cross Vagas", url: "/sus", icon: Globe },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { resetSystem } = usePatients();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar variant="floating" collapsible="icon" className="border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] z-30 [&>div[data-sidebar=sidebar]]:bg-gradient-to-b [&>div[data-sidebar=sidebar]]:from-[#004466]/95 [&>div[data-sidebar=sidebar]]:to-[#001a33]/95 [&>div[data-sidebar=sidebar]]:backdrop-blur-xl [&>div[data-sidebar=sidebar]]:border [&>div[data-sidebar=sidebar]]:border-blue-700/30">
      <SidebarHeader className="p-3 pb-2 bg-transparent border-b border-blue-700/30">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-md relative overflow-hidden group transition-all duration-300 hover:border-white/30 hover:shadow-[0_8px_30px_rgba(14,165,233,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="h-10 w-10 rounded-lg bg-sky-500/20 flex items-center justify-center shrink-0 border border-sky-400/30 shadow-inner backdrop-blur-md z-10 transition-transform group-hover:scale-105 duration-300">
            <Activity className="h-5 w-5 text-sky-300 drop-shadow-[0_0_8px_rgba(14,165,233,0.8)] animate-pulse-slow" />
          </div>
          {!collapsed && (
              <div className="flex flex-col z-10">
                <h1 className="text-lg mission-control-title text-white uppercase font-black tracking-tight drop-shadow-md">UPA Control</h1>
                <div className="flex items-center gap-1.5 leading-none mt-0.5">
                  <span className="text-[9px] text-sky-200/80 font-black uppercase tracking-[0.2em]">Sistema de Gestão</span>
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
             <SidebarGroupContent className={cn("transition-all duration-300", collapsed ? "px-1" : "px-2")}>
               <SidebarMenu className={cn("gap-0.5", collapsed && "items-center")}>
                 {group.items.map((item) => {
                   const active = isActive(item.url);
                   return (
                     <SidebarMenuItem key={item.title} className="w-full flex justify-center py-0">
                           <NavLink 
                             to={item.url} 
                             end 
                             className={({ isActive: linkActive }) => cn(
                                "flex items-center transition-all duration-300 relative group/item rounded-xl",
                                 collapsed 
                                   ? "justify-center h-10 w-10" 
                                   : "w-full gap-3 px-3 py-2.5",
                                 linkActive 
                                   ? "bg-sky-500/25 backdrop-blur-md border border-sky-400/40 shadow-[0_0_20px_rgba(14,165,233,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] text-white font-black" 
                                   : "text-blue-100/70 hover:text-white hover:bg-white/5 border border-transparent"
                             )}
                           >
                             <div className={cn(
                               "flex items-center gap-3 relative z-10",
                               collapsed ? "justify-center" : "w-full"
                             )}>
                               <motion.div 
                                 animate={active ? { scale: 1.05 } : { scale: 1 }}
                                 whileTap={{ scale: 0.95 }}
                                 className={cn(
                                    "flex items-center justify-center shrink-0 transition-all duration-300",
                                   active 
                                     ? "text-sky-300 drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]" 
                                     : "text-blue-100/70 group-hover/item:text-blue-50"
                                 )}
                               >
                                 <item.icon className={cn(
                                    "h-[22px] w-[22px] transition-all duration-300",
                                   active ? "stroke-[2.5px] animate-pulse-slow" : "stroke-[2px]"
                                 )} />
                               </motion.div>
 
                               {!collapsed && (
                                 <span className={cn(
                                   "text-[13px] font-bold tracking-wide transition-all duration-300 whitespace-nowrap",
                                   active ? "text-white" : "text-blue-100/70 group-hover/item:text-blue-50"
                                 )}>
                                   {item.title}
                                 </span>
                               )}
                             </div>
                           </NavLink>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-white/10 bg-transparent">
        <div className="flex items-center justify-between gap-3">
          {!collapsed && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-sidebar-foreground/30 uppercase tracking-widest">Interface</span>
              <span className="text-xs font-semibold text-sidebar-foreground opacity-80">Aparência</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={resetSystem} className="h-8 w-8 text-sidebar-foreground/50 hover:text-red-400 hover:bg-red-400/10" title="Resetar Dados de Teste">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <ThemeToggle position="bottom" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
