import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bed, Sparkles, AlertCircle, Clock, CheckCircle2, Play, 
  UserPlus, Check, Droplets, SprayCan, ShieldAlert, AlertTriangle, 
  Wrench, Trophy, Timer, FlaskConical, ScrollText, Droplet, MessageSquare,
  History, UserCircle, Search, Users, Activity, BellRing
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBeds, Bed as ContextBed, Cleaner, PriorityLevel, CleaningLog } from "@/context/BedsContext";

// --- Hook do Cronômetro ---
function TaskTimer({ startTime, maxMinutesAlert = 15, isRunning = true }: { startTime: Date, maxMinutesAlert?: number, isRunning?: boolean }) {
  const [elapsed, setElapsed] = useState(() => Math.floor((Date.now() - startTime.getTime()) / 1000));
  const [playedSound, setPlayedSound] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
      setElapsed(currentElapsed);
      
      // Alarme Sonoro de SLA Estourado (apenas uma vez)
      if (currentElapsed >= maxMinutesAlert * 60 && !playedSound) {
        setPlayedSound(true);
        // Descomente se quiser som real:
        // const audio = new Audio('/alert.mp3');
        // audio.play().catch(e => console.log('Áudio bloqueado'));
        toast.warning(`SLA de ${maxMinutesAlert}min estourado!`, {
          icon: <BellRing className="h-4 w-4 animate-bounce text-amber-500" />
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isRunning, maxMinutesAlert, playedSound]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const isAlert = minutes >= maxMinutesAlert;

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-black tracking-widest",
      isAlert && isRunning
        ? "bg-red-500/10 text-red-500 animate-pulse border border-red-500/20" 
        : "bg-muted text-muted-foreground"
    )}>
      <Clock className="h-3 w-3" />
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

function calculateElapsedTime(startedAt?: Date) {
  if (!startedAt) return "0 min";
  const minutes = Math.floor((Date.now() - startedAt.getTime()) / 60000);
  return `${minutes} min`;
}

// --- Componentes Auxiliares ---
const PriorityBadge = ({ priority }: { priority?: PriorityLevel }) => {
  if (!priority || priority === 'normal') return null;
  switch (priority) {
    case 'urgent': return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 text-[9px] uppercase tracking-wider"><AlertTriangle className="h-3 w-3 mr-1" /> Urgente</Badge>;
    case 'high': return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] uppercase tracking-wider">Alta</Badge>;
    default: return null;
  }
};

const IsolationBadge = () => (
  <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[9px] uppercase tracking-wider font-bold animate-pulse">
    <ShieldAlert className="h-3 w-3 mr-1" /> Isolamento
  </Badge>
);

// --- Componente Principal ---
export default function Governance() {
  const { beds, cleaners, cleaningHistory, startCleaning, finishCleaning, reportBedDefect } = useBeds();
  
  // Modals state
  const [assignModalTask, setAssignModalTask] = useState<ContextBed | null>(null);
  const [finishModalTask, setFinishModalTask] = useState<ContextBed | null>(null);
  const [maintenanceModalTask, setMaintenanceModalTask] = useState<ContextBed | null>(null);
  const [historyModalTask, setHistoryModalTask] = useState<CleaningLog | null>(null);
  const [maintenanceReason, setMaintenanceReason] = useState("Grade da cama emperrada / quebrada");

  // Filtros Avançados
  const [filterSector, setFilterSector] = useState<"ALL" | "Emergência" | "Observação">("ALL");

  // States para o modal de Finalização
  const [supplies, setSupplies] = useState<string[]>([]);
  const [observations, setObservations] = useState("");
  const [ccihConfirmed, setCcihConfirmed] = useState(false);

  useEffect(() => {
    if (finishModalTask) {
      setSupplies([]);
      setObservations("");
      setCcihConfirmed(false);
    }
  }, [finishModalTask]);

  const toggleSupply = (supply: string) => {
    setSupplies(prev => prev.includes(supply) ? prev.filter(s => s !== supply) : [...prev, supply]);
  };

  const handleStartTask = (bed: ContextBed, cleaner: Cleaner) => {
    startCleaning(bed.id, cleaner);
    setAssignModalTask(null);
    toast.success(`Leito atribuído para ${cleaner.name}`);
  };

  const handleFinishTask = (bed: ContextBed) => {
    if (!ccihConfirmed) return;
    finishCleaning(bed.id, { supplies, observations, ccihConfirmed });
    setFinishModalTask(null);
    toast.success(`Limpeza finalizada e documentada com sucesso!`);
  };

  const handleReportMaintenance = (bed: ContextBed) => {
    reportBedDefect(bed.id, maintenanceReason);
    setMaintenanceModalTask(null);
    toast.error(`Defeito reportado no ${bed.name}. O.S. enviada à Engenharia Clínica.`);
  };

  // Aplicação de Filtros
  const filteredBeds = filterSector === "ALL" ? beds : beds.filter(b => b.ward === filterSector);
  const filteredHistory = filterSector === "ALL" ? cleaningHistory : cleaningHistory.filter(h => h.ward === filterSector);

  const waitingTasks = filteredBeds.filter(b => b.status === 'cleaning' && b.cleaningStatus === 'waiting');
  const inProgressTasks = filteredBeds.filter(b => b.status === 'cleaning' && b.cleaningStatus === 'in_progress');
  const maintenanceTasks = filteredBeds.filter(b => b.status === 'maintenance');
  const completedToday = cleaningHistory.length;

  const sortedWaitingTasks = [...waitingTasks].sort((a, b) => {
    const pWeight = { 'urgent': 3, 'high': 2, 'normal': 1 };
    const wA = pWeight[a.priority || 'normal'];
    const wB = pWeight[b.priority || 'normal'];
    if (wA !== wB) return wB - wA;
    return (a.requestedAt?.getTime() || 0) - (b.requestedAt?.getTime() || 0);
  });

  return (
    <div className="flex h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Área Principal (Esquerda) */}
      <div className="flex-1 flex flex-col min-w-0 space-y-6">
        <header className="shrink-0 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-cyan-600 border-cyan-500/20">
                Gestão Avançada de Governança
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Hotelaria & CCIH</h1>
          </div>

          <div className="flex gap-2 bg-muted/40 p-1.5 rounded-xl border border-border/50">
            {["ALL", "Emergência", "Observação"].map(sec => (
              <Button 
                key={sec} 
                variant={filterSector === sec ? "secondary" : "ghost"} 
                size="sm" 
                className={cn("text-xs font-bold", filterSector === sec ? "shadow-sm" : "opacity-50")}
                onClick={() => setFilterSector(sec as 'ALL' | 'Emergência' | 'Observação')}
              >
                {sec === "ALL" ? "Todos os Setores" : sec}
              </Button>
            ))}
          </div>
        </header>

        {/* Kanban Board - 4 Colunas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 min-h-[550px]">
          {/* Fila de Espera */}
          <div className="flex flex-col bg-muted/30 rounded-3xl p-3 border border-border/50">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="font-black uppercase text-xs tracking-widest text-foreground/80 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Aguardando
              </h3>
              <Badge variant="secondary">{waitingTasks.length}</Badge>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1 pr-1 pb-4">
              <AnimatePresence>
                {sortedWaitingTasks.map(task => (
                  <motion.div key={task.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Card className={cn("p-3.5 shadow-sm transition-all border", task.priority === 'urgent' ? "border-red-500/40 bg-red-500/5" : "bg-card border-border/50 hover:shadow-md")}>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-base leading-none">{task.name}</h4>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">{task.ward} - {task.room}</p>
                          </div>
                          {task.requestedAt && <TaskTimer startTime={task.requestedAt} maxMinutesAlert={15} />}
                        </div>
                        <div className="flex flex-wrap gap-1.5 my-1">
                          <PriorityBadge priority={task.priority} />
                          {task.isIsolation && <IsolationBadge />}
                        </div>
                        <Button onClick={() => setAssignModalTask(task)} className="w-full text-[10px] font-black uppercase tracking-widest bg-cyan-600 hover:bg-cyan-700 h-8 mt-1">
                          <Play className="h-3 w-3 mr-2" /> Iniciar
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Em Higienização */}
          <div className="flex flex-col bg-cyan-500/5 rounded-3xl p-3 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="font-black uppercase text-xs tracking-widest text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
                <SprayCan className="h-4 w-4" />
                Limpando
              </h3>
              <Badge className="bg-cyan-500">{inProgressTasks.length}</Badge>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1 pr-1 pb-4">
              <AnimatePresence>
                {inProgressTasks.map(task => (
                  <motion.div key={task.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Card className="p-3.5 bg-card border-cyan-500/30 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                      <div className="flex justify-between items-start pl-2">
                        <div>
                          <h4 className="font-bold text-base leading-none">{task.name}</h4>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">{task.ward} - {task.room}</p>
                        </div>
                        {task.startedAt && <TaskTimer startTime={task.startedAt} maxMinutesAlert={30} />}
                      </div>
                      <div className="flex flex-wrap gap-1.5 my-2 pl-2">
                        {task.isIsolation && <IsolationBadge />}
                      </div>
                      <div className="flex items-center gap-2 pl-2 mt-3 mb-3 bg-muted/50 p-1.5 rounded-lg border border-border/50">
                        <div className={`h-6 w-6 rounded-md ${task.assignedCleaner?.color} text-[9px] font-black flex items-center justify-center text-white`}>
                          {task.assignedCleaner?.avatar}
                        </div>
                        <span className="text-xs font-bold">{task.assignedCleaner?.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pl-2 border-t border-border/40 pt-3">
                        <Button size="sm" variant="outline" onClick={() => setMaintenanceModalTask(task)} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 h-7 px-1">
                          Defeito
                        </Button>
                        <Button size="sm" onClick={() => setFinishModalTask(task)} className="text-[9px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 h-7 px-1">
                          Concluir
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Interditados / O.S. Aberta */}
          <div className="flex flex-col bg-red-500/5 rounded-3xl p-3 border border-red-500/20">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="font-black uppercase text-xs tracking-widest text-red-700 dark:text-red-400 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Interditados
              </h3>
              <Badge variant="outline" className="text-red-600 border-red-500/20">{maintenanceTasks.length}</Badge>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1 pr-1 pb-4">
              <AnimatePresence>
                {maintenanceTasks.map(task => (
                  <motion.div key={task.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Card className="p-3.5 bg-card border-red-500/30 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-base leading-none text-red-600 dark:text-red-400">{task.name}</h4>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">{task.ward} - {task.room}</p>
                        </div>
                        <Badge variant="outline" className="text-[9px] bg-red-500/10 text-red-500 border-red-500/20">O.S. Aberta</Badge>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground mt-3 p-2 bg-red-500/5 rounded-lg border border-red-500/10">
                        {task.maintenanceReason || 'Aguardando liberação da Engenharia Clínica.'}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Auditoria / Livres Hoje (Cleaning History) */}
          <div className="flex flex-col bg-emerald-500/5 rounded-3xl p-3 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="font-black uppercase text-xs tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Concluídos
              </h3>
              <Badge className="bg-emerald-500/20 text-emerald-700 border-none">{filteredHistory.length}</Badge>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1 pr-1 pb-4 opacity-90">
              <AnimatePresence>
                {filteredHistory.map(log => (
                  <motion.div key={log.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Card className="p-3 bg-card border-emerald-500/20 flex flex-col gap-3 group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 leading-none">{log.bedName}</h4>
                          <p className="text-[9px] uppercase font-bold text-muted-foreground mt-1">{log.ward} - {log.room}</p>
                        </div>
                        <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-600 bg-emerald-500/5 px-1 py-0 h-4">
                          {log.finishedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" variant="ghost" 
                        onClick={() => setHistoryModalTask(log)}
                        className="w-full h-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 hover:bg-emerald-500/10 hover:text-emerald-600 border border-border/50"
                      >
                        <History className="h-3 w-3 mr-1" /> Ver Auditoria
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Direita - Equipe de Plantão (Somente Telas Grandes) */}
      <div className="w-72 shrink-0 hidden xl:flex flex-col gap-4">
        {/* Card Analytics Topo */}
        <Card className="p-5 glass-card border-border/40 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">SLA Médio Hoje</p>
            <p className="text-xl font-black tracking-tighter">18<span className="text-xs text-muted-foreground ml-1">min</span></p>
          </div>
        </Card>

        {/* Lista da Equipe */}
        <Card className="flex-1 glass-card border-border/40 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-500" /> Plantão Atual
            </h3>
            <Badge variant="secondary" className="text-[10px]">{cleaners.length} na escala</Badge>
          </div>

          <div className="space-y-4 overflow-y-auto pr-1">
            {cleaners.map(cleaner => {
              // Descobrir se ele está ocupado
              const activeTask = inProgressTasks.find(t => t.assignedCleaner?.id === cleaner.id);
              // Quantos leitos limpou hoje
              const cleanedCount = cleaningHistory.filter(h => h.cleanerName === cleaner.name).length;

              return (
                <div key={cleaner.id} className="p-3 rounded-2xl bg-card border border-border/50 shadow-sm relative overflow-hidden">
                  {/* Indicador lateral */}
                  <div className={cn("absolute left-0 top-0 w-1.5 h-full", activeTask ? "bg-cyan-500 animate-pulse" : "bg-emerald-500")} />
                  
                  <div className="flex items-center gap-3 pl-2">
                    <div className={`h-10 w-10 shrink-0 rounded-xl ${cleaner.color} text-sm font-black flex items-center justify-center text-white shadow-inner`}>
                      {cleaner.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{cleaner.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className={cn("text-[9px] font-black uppercase tracking-widest flex items-center gap-1", activeTask ? "text-cyan-600" : "text-emerald-600")}>
                          <Activity className="h-3 w-3" />
                          {activeTask ? 'Ocupado' : 'Disponível'}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground">{cleanedCount} leitos</span>
                      </div>
                    </div>
                  </div>

                  {activeTask && (
                    <div className="mt-3 ml-2 pl-3 border-l-2 border-border/50">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Limpando agora:</p>
                      <p className="text-xs font-bold text-cyan-700 dark:text-cyan-400 truncate">{activeTask.name}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* --- MODALS --- */}

      {/* Modal: Atribuir Limpeza */}
      <Dialog open={!!assignModalTask} onOpenChange={(open) => !open && setAssignModalTask(null)}>
        <DialogContent className="sm:max-w-[400px] glass-card-premium border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-cyan-500" />
              Atribuir Leito
            </DialogTitle>
            <DialogDescription>
              Selecione quem fará a higienização do <strong>{assignModalTask?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {cleaners.map(cleaner => {
              const isBusy = beds.some(b => b.cleaningStatus === 'in_progress' && b.assignedCleaner?.id === cleaner.id);
              return (
                <Button
                  key={cleaner.id}
                  variant="outline"
                  disabled={isBusy}
                  className={cn("justify-start h-14 relative overflow-hidden group", isBusy && "opacity-50")}
                  onClick={() => assignModalTask && handleStartTask(assignModalTask, cleaner)}
                >
                  <div className={`absolute left-0 top-0 h-full w-1.5 ${cleaner.color}`} />
                  <div className={`h-8 w-8 rounded-full ${cleaner.color} text-xs font-black flex items-center justify-center text-white mr-3`}>
                    {cleaner.avatar}
                  </div>
                  <div className="text-left">
                    <span className="font-bold block leading-none mb-1">{cleaner.name}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{isBusy ? 'Já está ocupado' : 'Disponível'}</span>
                  </div>
                </Button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Finalizar Limpeza COMPLETÃO */}
      <Dialog open={!!finishModalTask} onOpenChange={(open) => !open && setFinishModalTask(null)}>
        <DialogContent className="sm:max-w-[550px] glass-card-premium border-white/10 overflow-hidden">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  Finalizar Higienização
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Checklist e registro de insumos para liberar o <strong>{finishModalTask?.name}</strong>.
                </DialogDescription>
              </div>
              <div className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-center">
                <span className="block text-[8px] font-black uppercase tracking-widest mb-0.5">Tempo Gasto</span>
                <span className="font-black text-sm flex items-center gap-1 justify-center">
                  <Timer className="h-3 w-3" /> {calculateElapsedTime(finishModalTask?.startedAt)}
                </span>
              </div>
            </div>
            {finishModalTask?.isIsolation && (
              <div className="mt-3 p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-xs text-purple-700 dark:text-purple-400 font-bold flex items-center gap-2 animate-pulse">
                <ShieldAlert className="h-4 w-4 shrink-0" /> Este leito requer Desinfecção de Alto Nível (Isolamento).
              </div>
            )}
          </DialogHeader>

          <div className="py-2 space-y-5 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tipo de Limpeza</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" className={cn("h-10 justify-start gap-2", finishModalTask?.isIsolation ? "border-purple-500/50 bg-purple-500/10 text-purple-700" : "border-cyan-500/30 bg-cyan-500/5 text-cyan-700")}>
                    <Droplets className="h-4 w-4" />
                    <span className="text-xs font-bold">Terminal / Pesada</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reposição de Insumos</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Álcool Gel', label: 'Álcool', icon: FlaskConical },
                    { id: 'Sabonete Líquido', label: 'Sabonete', icon: Droplet },
                    { id: 'Papel Toalha', label: 'Papel Toalha', icon: ScrollText },
                    { id: 'Papel Higiênico', label: 'Papel Higi.', icon: ScrollText },
                  ].map(item => (
                    <Button
                      key={item.id} variant="outline" size="sm"
                      onClick={() => toggleSupply(item.id)}
                      className={cn("h-10 px-2 justify-start gap-1.5 transition-all text-[10px]", supplies.includes(item.id) ? "bg-primary/10 border-primary text-primary" : "text-muted-foreground")}
                    >
                      <item.icon className="h-3 w-3 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Observações da Equipe</Label>
              <textarea 
                value={observations} onChange={(e) => setObservations(e.target.value)}
                placeholder="Ex: Faltou travesseiro extra no enxoval..."
                className="w-full text-xs p-3 rounded-xl border border-border bg-muted/30 focus:bg-background resize-none h-16 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-border/50 space-y-4">
            <label className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl cursor-pointer hover:bg-amber-500/10 transition-colors">
              <input 
                type="checkbox" checked={ccihConfirmed} onChange={(e) => setCcihConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-amber-500/50 text-amber-600 focus:ring-amber-500" 
              />
              <span className="text-xs font-medium text-amber-900 dark:text-amber-200/80 leading-relaxed">
                Declaro sob minha responsabilidade que todos os protocolos da <strong>CCIH</strong> foram rigorosamente cumpridos na higienização deste leito.
              </span>
            </label>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setFinishModalTask(null)}>Cancelar</Button>
              <Button 
                disabled={!ccihConfirmed}
                className={cn("font-bold transition-all", ccihConfirmed ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-muted text-muted-foreground")}
                onClick={() => finishModalTask && handleFinishTask(finishModalTask)}
              >
                Liberar Leito no Sistema
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Histórico de Auditoria */}
      <Dialog open={!!historyModalTask} onOpenChange={(open) => !open && setHistoryModalTask(null)}>
        <DialogContent className="sm:max-w-[450px] glass-card-premium border-emerald-500/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-500">
              <History className="h-5 w-5" />
              Auditoria de Higienização
            </DialogTitle>
            <DialogDescription>
              Registro imutável da limpeza do <strong>{historyModalTask?.bedName}</strong>.
            </DialogDescription>
          </DialogHeader>
          {historyModalTask && (
            <div className="py-4">
              <div className="relative border-l-2 border-border/50 ml-3 space-y-6 pb-2">
                
                {/* Evento 1: Requisição */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-background border-2 border-amber-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {historyModalTask.requestedAt?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || '--:--'}
                  </p>
                  <p className="text-sm font-bold">Leito Liberado</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Enfermagem sinalizou desocupação.</p>
                </div>

                {/* Evento 2: Início */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-background border-2 border-cyan-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {historyModalTask.startedAt?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || '--:--'}
                  </p>
                  <p className="text-sm font-bold">Início da Higienização</p>
                  <div className="flex items-center gap-2 mt-1.5 bg-muted/40 p-2 rounded-lg border border-border/50 w-fit">
                    <div className={`h-6 w-6 rounded-md ${historyModalTask.cleanerColor} text-[8px] font-black flex items-center justify-center text-white`}>
                      {historyModalTask.cleanerAvatar}
                    </div>
                    <span className="text-xs font-bold">{historyModalTask.cleanerName}</span>
                  </div>
                </div>

                {/* Evento 3: Fim */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-background border-2 border-emerald-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {historyModalTask.finishedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Leito Pronto e Liberado</p>
                  
                  <div className="mt-2 space-y-2">
                    <Badge variant="outline" className="text-[9px]"><Timer className="h-3 w-3 mr-1" /> Duração: {historyModalTask.durationMinutes} min</Badge>
                    
                    {historyModalTask.supplies.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-bold">Insumos Repostos:</span> {historyModalTask.supplies.join(', ')}
                      </p>
                    )}
                    
                    {historyModalTask.observations && (
                      <p className="text-xs bg-muted/50 p-2 rounded-md border border-border/50 italic text-foreground/80">
                        "{historyModalTask.observations}"
                      </p>
                    )}
                    
                    {historyModalTask.ccihConfirmed && (
                      <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-2">
                        <CheckCircle2 className="h-3 w-3" /> Protocolo CCIH validado.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
