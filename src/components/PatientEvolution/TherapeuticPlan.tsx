import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Pill, Utensils, Activity, Stethoscope, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrescriptions, PrescriptionMedication, AprazamentoHour, PrescriptionStatus } from "@/context/PrescriptionsContext";
import { DoubleCheckModal } from "./Modals/DoubleCheckModal";
import { AddCareItemModal } from "./Modals/AddCareItemModal";
import { toast } from "sonner";
import { format, addDays, subDays, isToday, differenceInDays, startOfDay, isBefore, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePatients } from "@/hooks/use-patients";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface TherapeuticPlanProps {
  patientId: string;
}

export function TherapeuticPlan({ patientId }: TherapeuticPlanProps) {
  const { orders, updateMedicationHours, updateMedicationExecution, addCareItem } = usePrescriptions();
  const { addEvolution } = usePatients();
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const isUserScrolling = useRef(false);
  const previousDateRef = useRef(new Date());
  const activeOrder = orders.find((o) => o.patientId === patientId) || orders[0];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMed, setSelectedMed] = useState<{med: PrescriptionMedication, hour: any} | null>(null);
  const [isDoubleCheckOpen, setIsDoubleCheckOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{med: PrescriptionMedication, hour: any} | null>(null);
  const [justificationModal, setJustificationModal] = useState<{med: PrescriptionMedication, hour: any, action: 'delayed' | 'refused'} | null>(null);
  const [justificationText, setJustificationText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const currentHourNum = new Date().getHours();
  const currentHourStr = currentHourNum.toString().padStart(2, "0") + ":00";
  const isCurrentDay = isToday(currentDate);

  // Generate 72 hours (Yesterday, Today, Tomorrow relative to currentDate)
  const timelineDays = [subDays(currentDate, 1), currentDate, addDays(currentDate, 1)];
  const HOURS_72 = timelineDays.flatMap(date => 
    Array.from({ length: 24 }, (_, i) => ({
      date: date,
      timeStr: `${i.toString().padStart(2, "0")}:00`,
      isCurrentDay: isToday(date),
      isCurrentHour: isToday(date) && i === currentHourNum,
      id: `${format(date, "yyyy-MM-dd")}-${i.toString().padStart(2, "0")}:00`
    }))
  );

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const SCROLL_STEP = 50; // Smooth 1-hour jump
    
    if (direction === 'right') {
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        isUserScrolling.current = true;
        setCurrentDate(prev => addDays(prev, 1));
      } else {
        scrollRef.current.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
      }
    } else {
      if (scrollLeft <= 10) {
        isUserScrolling.current = true;
        setCurrentDate(prev => subDays(prev, 1));
      } else {
        scrollRef.current.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
      }
    }
  };

  useLayoutEffect(() => {
    if (scrollRef.current && isUserScrolling.current) {
      const diff = differenceInDays(currentDate, previousDateRef.current);
      if (Math.abs(diff) === 1) {
        const dayWidth = (scrollRef.current.scrollWidth - 250) / 3;
        if (diff > 0) {
          scrollRef.current.scrollLeft -= dayWidth;
        } else {
          scrollRef.current.scrollLeft += dayWidth;
        }
      }
    }
    previousDateRef.current = currentDate;
  }, [currentDate]);

  useEffect(() => {
    const headerEl = headerRef.current;
    const scrollEl = scrollRef.current;
    if (!headerEl || !scrollEl) return;

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept if user is pressing shift (native horizontal) or scrolling horizontally natively
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      
      if (e.deltaY !== 0) {
        e.preventDefault();
        
        const { scrollLeft, scrollWidth, clientWidth } = scrollEl;
        
        // Edge detection for infinite scroll
        if (e.deltaY > 0 && scrollLeft + clientWidth >= scrollWidth - 10) {
          isUserScrolling.current = true;
          setCurrentDate(prev => addDays(prev, 1));
        } else if (e.deltaY < 0 && scrollLeft <= 10) {
          isUserScrolling.current = true;
          setCurrentDate(prev => subDays(prev, 1));
        } else {
          scrollEl.scrollBy({ left: e.deltaY, behavior: 'auto' });
        }
      }
    };

    // passive: false is needed to call preventDefault
    headerEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => headerEl.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    if (isUserScrolling.current) {
      setTimeout(() => { isUserScrolling.current = false; }, 50);
      return;
    }

    if (scrollRef.current) {
      // Find the column for currentDate at the current hour
      const targetHourEl = document.getElementById(`hour-col-${format(currentDate, "yyyy-MM-dd")}-${currentHourStr}`);
      const fallbackEl = document.getElementById(`hour-col-${format(currentDate, "yyyy-MM-dd")}-08:00`);
      
      const elToScroll = targetHourEl || fallbackEl;
      if (elToScroll) {
        scrollRef.current.scrollTo({
          left: elToScroll.offsetLeft - 300,
          behavior: 'smooth'
        });
      }
    }
  }, [currentDate, currentHourStr]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'ArrowLeft') {
        scrollTimeline('left');
      } else if (e.key === 'ArrowRight') {
        scrollTimeline('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!activeOrder) {
    return (
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Clock className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-foreground">Nenhuma Prescrição Ativa</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-2">
            O paciente não possui um plano terapêutico definido.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleHourAction = (med: PrescriptionMedication, hour: any, action: 'checked' | 'delayed' | 'refused' | 'suspended') => {
    if (hour.status === "checked") {
      toast.info(`Já administrado por ${hour.nurseName || 'Profissional'}`);
      return;
    }

    if (action === 'checked') {
      if (med.isHighVigilance) {
        setSelectedMed({ med, hour });
        setIsDoubleCheckOpen(true);
      } else {
        setConfirmModalData({ med, hour });
      }
    } else if (action === 'suspended') {
      executeAction(med, hour, 'suspended', "Enf. Principal");
    } else {
      setJustificationModal({ med, hour, action });
      setJustificationText("");
    }
  };

  const handleDoubleCheckSuccess = (checkerName: string) => {
    if (selectedMed) {
      executeAction(selectedMed.med, selectedMed.hour, 'checked', "Enf. Principal", checkerName);
      setIsDoubleCheckOpen(false);
      setSelectedMed(null);
    }
  };

  const executeAction = (
    med: PrescriptionMedication, 
    hour: any, 
    action: 'checked' | 'delayed' | 'refused' | 'suspended',
    nurseName: string, 
    doubleCheckedBy?: string,
    justification?: string
  ) => {
    const executionData: any = {
      status: action,
      checkedAt: new Date().toISOString(),
      nurseName,
      doubleCheckedBy,
      doubleCheckedAt: doubleCheckedBy ? new Date().toISOString() : undefined,
      justification
    };

    updateMedicationExecution(activeOrder.id, med.id, hour.executionKey, executionData);
    
    // Auto-generate evolution record
    let actionStr = "";
    if (action === 'checked') actionStr = "realizado/administrado";
    else if (action === 'delayed') actionStr = "adiado";
    else if (action === 'refused') actionStr = "recusado pelo paciente";
    else actionStr = "suspenso";

    const evolutionText = `[SISTEMA - PLANO TERAPÊUTICO]\nItem: ${med.medication} (${med.dosage} - ${med.route})\nHorário: ${hour.hour}\nAção: Item ${actionStr}.\n${justification ? `Justificativa: ${justification}\n` : ''}${doubleCheckedBy ? `Dupla Checagem por: ${doubleCheckedBy}` : ''}`;

    addEvolution(patientId, {
      type: "Evolução Enfermagem",
      description: evolutionText,
      professional: nurseName,
    });

    if (action === 'checked') toast.success(`Realizado com sucesso!`);
    else if (action === 'delayed') toast.warning(`Horário Adiado gravado.`);
    else if (action === 'refused') toast.error(`Recusa do paciente gravada.`);
    else toast.info(`Horário Suspenso.`);
  };

  const submitJustification = () => {
    if (!justificationText.trim()) {
      toast.error("A justificativa é obrigatória.");
      return;
    }
    if (justificationModal) {
      executeAction(
        justificationModal.med, 
        justificationModal.hour, 
        justificationModal.action, 
        "Enf. Principal", 
        undefined, 
        justificationText
      );
      setJustificationModal(null);
    }
  };

  const groupedMeds = {
    medication: activeOrder.medications.filter(m => !m.category || m.category === 'medication'),
    diet: activeOrder.medications.filter(m => m.category === 'diet'),
    therapy: activeOrder.medications.filter(m => m.category === 'therapy'),
    nursing: activeOrder.medications.filter(m => m.category === 'nursing'),
  };

  const renderGroup = (meds: PrescriptionMedication[], title: string, icon: React.ReactNode, bgColor: string, textColor: string) => {
    if (meds.length === 0) return null;
    return (
      <>
        <tr>
          <td colSpan={73} className={cn("px-4 py-2 uppercase text-[10px] font-black tracking-widest flex items-center gap-2 sticky left-0 z-20 border-b border-white/20 dark:border-white/5 backdrop-blur-sm", bgColor, textColor)}>
            {icon} {title}
          </td>
        </tr>
        {meds.map((med) => (
          <tr key={med.id} className={cn(
            "border-b border-white/20 dark:border-white/5 hover:bg-white/20 dark:hover:bg-slate-800/40 transition-colors",
            med.isHighVigilance && "bg-red-500/5 hover:bg-red-500/10"
          )}>
            <td className="px-4 py-3 sticky left-0 z-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-r border-b border-white/30 dark:border-white/10 w-[250px] shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
              <div className="flex flex-col gap-1 w-[230px]">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-bold text-sm truncate",
                    med.isHighVigilance ? "text-red-600 dark:text-red-400" : "text-foreground"
                  )} title={med.medication}>
                    {med.medication}
                  </span>
                  {med.isHighVigilance && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ShieldAlert className="h-3.5 w-3.5 text-red-500 animate-pulse shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-red-500/10 border-red-500/20 text-red-500 font-bold">
                        Alta Vigilância - Requer Dupla Checagem
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold uppercase text-muted-foreground">
                  {[med.dosage, med.route, med.frequency]
                    .filter(item => item && item !== "-")
                    .map((item, idx, arr) => (
                      <React.Fragment key={idx}>
                        <span className="truncate max-w-[100px]" title={item}>{item}</span>
                        {idx < arr.length - 1 && <span>&bull;</span>}
                      </React.Fragment>
                    ))}
                </div>
                {med.observation && (
                  <p className="text-[9px] uppercase font-bold text-amber-600 dark:text-amber-500 italic mt-0.5 leading-tight truncate" title={med.observation}>
                    Obs: {med.observation}
                  </p>
                )}
              </div>
            </td>
            {HOURS_72.map((h, i) => {
              const executionKey = h.id;
              const hasSchedule = med.hours.find(mh => mh.hour === h.timeStr);
              
              let showHour = !!hasSchedule;
              
              if (showHour && med.startDate) {
                const medStart = startOfDay(new Date(med.startDate + 'T00:00:00'));
                const cellDay = startOfDay(h.date);
                
                if (isBefore(cellDay, medStart)) {
                  showHour = false;
                } else if (med.scheduleType === 'single' && !isSameDay(cellDay, medStart)) {
                  showHour = false;
                }
              }

              let hourData = null;
              if (showHour) {
                const exec = med.executions?.[executionKey];
                hourData = {
                  hour: h.timeStr,
                  status: exec ? exec.status : "pending",
                  checkedAt: exec?.checkedAt,
                  nurseName: exec?.nurseName,
                  justification: exec?.justification,
                  doubleCheckedBy: exec?.doubleCheckedBy,
                  executionKey: executionKey
                };
              }
              return (
                <td key={h.id} className={cn(
                  "px-1 py-3 text-center align-middle transition-colors border-r border-b border-white/20 dark:border-white/5",
                  h.isCurrentHour ? "bg-[#006699]/15 dark:bg-sky-500/15 shadow-[inset_0_0_20px_rgba(0,102,153,0.15)] backdrop-blur-sm" : (h.isCurrentDay ? "bg-transparent" : "bg-slate-500/5 dark:bg-slate-800/30")
                )}>
                  {hourData ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="inline-block">
                          <Tooltip delayDuration={200}>
                            <TooltipTrigger asChild>
                              <button
                                className={cn(
                                  "w-6 h-6 mx-auto rounded-full inline-flex items-center justify-center transition-all cursor-pointer relative outline-none ring-0 hover:scale-110",
                                  hourData.status === "pending" && "bg-amber-500/20 text-amber-500 border border-amber-500/50 hover:bg-amber-500 hover:text-white shadow-[0_0_10px_rgba(245,158,11,0.2)]",
                                  hourData.status === "checked" && "bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
                                  hourData.status === "refused" && "bg-red-500/20 text-red-500 border border-red-500/50",
                                  hourData.status === "delayed" && "bg-orange-500/20 text-orange-500 border border-orange-500/50",
                                  hourData.status === "suspended" && "bg-slate-500/20 text-slate-500 border border-slate-500/50",
                                )}
                              >
                                {hourData.status === "pending" && <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
                                {hourData.status === "checked" && <CheckCircle2 className="h-3 w-3" />}
                                {hourData.status === "refused" && <XCircle className="h-3 w-3" />}
                                {hourData.status === "delayed" && <Clock className="h-3 w-3" />}
                                {hourData.status === "suspended" && <Ban className="h-3 w-3" />}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="glass-card-premium border-white/20 dark:border-white/10 p-3 min-w-[220px] shadow-xl z-[60]">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-2">
                                  <div className="flex items-center gap-1.5 text-xs font-black text-foreground">
                                    <Clock className="h-3.5 w-3.5 text-[#006699] dark:text-sky-400" /> 
                                    {h.timeStr}
                                  </div>
                                  <Badge variant="outline" className={cn(
                                    "text-[9px] uppercase font-black border",
                                    hourData.status === "pending" && "bg-amber-500/10 text-amber-500 border-amber-500/30",
                                    hourData.status === "checked" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
                                    hourData.status === "refused" && "bg-red-500/10 text-red-500 border-red-500/30",
                                    hourData.status === "delayed" && "bg-orange-500/10 text-orange-500 border-orange-500/30",
                                    hourData.status === "suspended" && "bg-slate-500/10 text-slate-500 border-slate-500/30"
                                  )}>
                                    {hourData.status === "pending" && "Aguardando"}
                                    {hourData.status === "checked" && "Realizado"}
                                    {hourData.status === "refused" && "Recusado"}
                                    {hourData.status === "delayed" && "Adiado"}
                                    {hourData.status === "suspended" && "Suspenso"}
                                  </Badge>
                                </div>
                                
                                <div>
                                  <p className="font-bold text-sm text-foreground leading-tight">
                                    {med.medication}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase font-bold text-muted-foreground mt-0.5">
                                    {[med.dosage, med.route, med.frequency]
                                      .filter(item => item && item !== "-")
                                      .map((item, idx, arr) => (
                                        <React.Fragment key={idx}>
                                          <span>{item}</span>
                                          {idx < arr.length - 1 && <span>&bull;</span>}
                                        </React.Fragment>
                                      ))}
                                  </div>
                                  {med.observation && (
                                    <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-500 italic mt-1 leading-tight bg-amber-500/10 p-1.5 rounded-md border border-amber-500/20">
                                      Obs: {med.observation}
                                    </p>
                                  )}
                                </div>

                                {hourData.status === "pending" ? (
                                  <div className="bg-muted/30 rounded-md p-1.5 mt-2">
                                    <p className="text-[10px] text-muted-foreground text-center font-medium">
                                      Clique para registrar ação
                                    </p>
                                  </div>
                                ) : (
                                  <div className="bg-muted/20 rounded-md p-2 border border-border/30 mt-2 space-y-1">
                                    <div className="flex items-center gap-1">
                                      <CheckCircle2 className={cn("h-3 w-3", hourData.status === "checked" ? "text-emerald-500" : "text-muted-foreground")} />
                                      <span className="text-[10px] font-black uppercase text-muted-foreground">Responsável:</span>
                                    </div>
                                    <p className="text-xs font-bold text-foreground pl-4">{hourData.nurseName}</p>
                                    
                                    {hourData.justification && (
                                      <div className="mt-1.5 pl-4 border-l-2 border-orange-500/30">
                                        <p className="text-[10px] font-black uppercase text-orange-500/70 mb-0.5">Justificativa:</p>
                                        <p className="text-[10px] italic text-foreground/80 leading-tight">"{hourData.justification}"</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </DropdownMenuTrigger>
                      {hourData.status === "pending" && (
                        <DropdownMenuContent align="center" className="w-56 glass-card border-border/50">
                          <DropdownMenuLabel className="font-bold text-xs uppercase text-muted-foreground flex justify-between">
                            Ações para {h.timeStr}
                            {med.isHighVigilance && <ShieldAlert className="h-3 w-3 text-red-500" />}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleHourAction(med, hourData, 'checked')} className="font-bold cursor-pointer text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Realizar / Administrar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleHourAction(med, hourData, 'delayed')} className="font-bold cursor-pointer text-orange-500">
                            <Clock className="mr-2 h-4 w-4" /> Adiar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleHourAction(med, hourData, 'refused')} className="font-bold cursor-pointer text-red-500">
                            <XCircle className="mr-2 h-4 w-4" /> Recusado pelo Paciente
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleHourAction(med, hourData, 'suspended')} className="font-bold cursor-pointer text-slate-500">
                            <Ban className="mr-2 h-4 w-4" /> Suspender
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      )}
                      {hourData.status !== "pending" && (
                        <DropdownMenuContent align="center" className="w-64 glass-card border-border/50 p-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {hourData.status === "checked" && <Badge className="bg-emerald-500 hover:bg-emerald-600">Realizado</Badge>}
                              {hourData.status === "refused" && <Badge variant="destructive">Recusado</Badge>}
                              {hourData.status === "delayed" && <Badge className="bg-orange-500 hover:bg-orange-600">Adiado</Badge>}
                              {hourData.status === "suspended" && <Badge variant="secondary">Suspenso</Badge>}
                            </div>
                            <p className="text-xs font-bold text-foreground">Por: {hourData.nurseName}</p>
                            {hourData.doubleCheckedBy && (
                              <p className="text-xs text-amber-500 font-bold flex items-center gap-1">
                                <ShieldAlert className="h-3 w-3" /> Dupla Checagem: {hourData.doubleCheckedBy}
                              </p>
                            )}
                            {hourData.justification && (
                              <div className="mt-2 bg-muted/50 p-2 rounded-md border border-border/50">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Justificativa:</p>
                                <p className="text-xs italic text-foreground/80">"{hourData.justification}"</p>
                              </div>
                            )}
                          </div>
                        </DropdownMenuContent>
                      )}
                    </DropdownMenu>
                  ) : (
                    <div className="w-6 h-6 mx-auto rounded-full bg-muted/20 border border-border/30 opacity-30" />
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black tracking-tighter uppercase text-foreground">Painel de Cuidados</h2>
            <Button 
              size="sm" 
              onClick={() => setIsAddModalOpen(true)}
              className="h-8 rounded-full bg-[#006699] hover:bg-[#004d73] dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 shadow-lg shadow-[#006699]/20"
            >
              + Novo Item
            </Button>
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
            Plano Terapêutico Multidisciplinar
          </p>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-2 bg-background/50 border border-border/50 rounded-full p-1 backdrop-blur-md">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setCurrentDate(subDays(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3 text-sm font-bold text-foreground uppercase tracking-widest min-w-[200px] justify-center hover:bg-muted/50 rounded-full cursor-pointer h-8">
                <CalendarIcon className="h-4 w-4 text-[#006699] dark:text-sky-400" />
                {format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })} {isCurrentDay && <span className="text-[#006699] dark:text-sky-400 ml-1">(Hoje)</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => {
                  if (date) setCurrentDate(date);
                }}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setCurrentDate(addDays(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {!isCurrentDay && (
            <Button variant="secondary" size="sm" className="h-8 rounded-full px-3 text-[10px] font-bold uppercase ml-2" onClick={() => setCurrentDate(new Date())}>
              Voltar p/ Hoje
            </Button>
          )}
        </div>
      </div>

      <Card className="glass-card-premium overflow-hidden border-white/30 dark:border-white/10 flex flex-col h-[calc(100vh-220px)] min-h-[500px] shadow-2xl bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl">
        <div className="overflow-auto overscroll-contain custom-scrollbar flex-1 relative" ref={scrollRef}>
          <table className="w-full text-sm text-left min-w-[3600px] border-separate border-spacing-0">
            <thead ref={headerRef} className="text-[10px] uppercase font-black tracking-widest text-muted-foreground sticky top-0 z-40">
              <tr>
                <th rowSpan={2} className="px-4 py-3 min-w-[250px] max-w-[250px] sticky left-0 top-0 z-50 bg-[#006699]/10 dark:bg-sky-500/10 backdrop-blur-xl border-r border-b border-white/30 dark:border-white/10 shadow-[2px_2px_15px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.4)] align-bottom text-[#006699] dark:text-sky-300">
                  Item de Cuidado
                </th>
                {timelineDays.map(date => (
                  <th 
                    key={date.toISOString()} 
                    colSpan={24} 
                    className={cn(
                      "py-2 border-r border-b border-white/20 dark:border-white/5 text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-300 bg-[#006699]/10 dark:bg-sky-500/10 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]",
                      isToday(date) ? "font-extrabold" : ""
                    )}
                  >
                    <div className="sticky left-[280px] right-4 w-fit mx-auto px-4">
                      {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })} {isToday(date) && "(Hoje)"}
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                {HOURS_72.map(h => (
                  <th 
                    key={h.id} 
                    id={`hour-col-${h.id}`}
                    className={cn(
                      "px-1 py-3 text-center min-w-[50px] transition-colors border-r border-b border-white/20 dark:border-white/5 text-[#006699] dark:text-sky-300",
                      h.isCurrentHour ? "bg-amber-300/90 text-black font-black animate-pulse shadow-md backdrop-blur-xl" : "bg-[#006699]/5 dark:bg-sky-500/5 backdrop-blur-xl",
                      !h.isCurrentDay && !h.isCurrentHour ? "opacity-70" : ""
                    )}
                  >
                    {h.timeStr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <TooltipProvider delayDuration={100}>
                {renderGroup(groupedMeds.medication, "Medicamentos e Infusões", <Pill className="h-3.5 w-3.5" />, "bg-purple-500/10", "text-purple-600 dark:text-purple-400")}
                {renderGroup(groupedMeds.diet, "Dietas e Refeições", <Utensils className="h-3.5 w-3.5" />, "bg-orange-500/10", "text-orange-600 dark:text-orange-400")}
                {renderGroup(groupedMeds.therapy, "Terapias e Reabilitação", <Activity className="h-3.5 w-3.5" />, "bg-emerald-500/10", "text-emerald-600 dark:text-emerald-400")}
                {renderGroup(groupedMeds.nursing, "Cuidados de Enfermagem", <Stethoscope className="h-3.5 w-3.5" />, "bg-[#006699]/10 dark:bg-sky-500/10", "text-[#006699] dark:text-sky-400")}
              </TooltipProvider>
            </tbody>
          </table>
        </div>
        <div className="bg-muted/10 border-t border-border/50 p-2 flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">
            Deslize para ver todos os horários
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 rounded-full px-4 text-[10px] font-bold uppercase flex items-center gap-2" 
              onClick={() => scrollTimeline('left')}
            >
              <ChevronLeft className="h-3 w-3" /> Horários Anteriores
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 rounded-full px-4 text-[10px] font-bold uppercase flex items-center gap-2" 
              onClick={() => scrollTimeline('right')}
            >
              Próximos Horários <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Legends */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          </div> Pendente
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="h-2 w-2 text-emerald-500" />
          </div> Realizado
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center">
            <Clock className="h-2 w-2 text-orange-500" />
          </div> Adiado
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center">
            <XCircle className="h-2 w-2 text-red-500" />
          </div> Recusado
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <ShieldAlert className="h-3 w-3 text-red-500" /> Alta Vigilância
        </div>
      </div>

      {selectedMed && (
        <DoubleCheckModal
          isOpen={isDoubleCheckOpen}
          onClose={() => {
            setIsDoubleCheckOpen(false);
            setSelectedMed(null);
          }}
          onSuccess={handleDoubleCheckSuccess}
          medicationName={selectedMed.med.medication}
        />
      )}

      {/* Simple Confirmation Modal */}
      <AlertDialog open={!!confirmModalData} onOpenChange={(open) => !open && setConfirmModalData(null)}>
        <AlertDialogContent className="glass-card-premium border-white/40 dark:border-white/10 sm:max-w-md rounded-[2rem]">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <AlertDialogTitle className="text-center text-xl font-black uppercase">
              Confirmar Realização
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center font-bold text-slate-500">
              Confirmar a realização de{" "}
              <span className="text-[#006699] dark:text-sky-400">{confirmModalData?.med.medication}</span>{" "}
              às {confirmModalData?.hour.hour}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-6">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest px-6"
              onClick={() => {
                if (confirmModalData) {
                  executeAction(confirmModalData.med, confirmModalData.hour, 'checked', "Enf. Principal");
                  setConfirmModalData(null);
                }
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Justification Modal */}
      <Dialog open={!!justificationModal} onOpenChange={(open) => !open && setJustificationModal(null)}>
        <DialogContent className="glass-card-premium border-white/40 dark:border-white/10 sm:max-w-md rounded-[2rem]">
          <DialogHeader>
            <div className={cn(
              "mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4",
              justificationModal?.action === 'refused' ? "bg-red-500/10" : "bg-orange-500/10"
            )}>
              {justificationModal?.action === 'refused' ? (
                <XCircle className="h-6 w-6 text-red-500" />
              ) : (
                <Clock className="h-6 w-6 text-orange-500" />
              )}
            </div>
            <DialogTitle className="text-center text-xl font-black uppercase">
              {justificationModal?.action === 'refused' ? 'Recusa do Paciente' : 'Adiar Horário'}
            </DialogTitle>
            <DialogDescription className="text-center font-bold text-slate-500">
              Justifique o motivo para o item{" "}
              <span className="text-foreground">{justificationModal?.med.medication}</span>{" "}
              às {justificationModal?.hour.hour}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Textarea 
              placeholder="Digite o motivo aqui... (ex: paciente dormindo, paciente recusou a dieta)"
              className="bg-background/50 border-border/50 resize-none rounded-xl h-24 focus-visible:ring-1 focus-visible:ring-orange-500"
              value={justificationText}
              onChange={e => setJustificationText(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setJustificationModal(null)} className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-6">
              Cancelar
            </Button>
            <Button 
              className={cn(
                "rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 text-white",
                justificationModal?.action === 'refused' ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"
              )}
              onClick={submitJustification}
            >
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddCareItemModal 
        patientId={patientId}
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={(item) => {
          if (activeOrder) {
            addCareItem(activeOrder.id, item);
            toast.success("Novo item de cuidado adicionado com sucesso!");
          }
        }} 
      />
    </div>
  );
}
