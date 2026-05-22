import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, XCircle, ArrowRight, CalendarDays, UserSquare2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface SwapRequest {
  id: number;
  from: string;
  to: string;
  date: string;
  shift: string;
  status: 'pending' | 'approved' | 'denied';
  reason: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requests: SwapRequest[];
  onUpdateStatus: (id: number, status: 'approved' | 'denied') => void;
}

export function SwapRequestsModal({ open, onOpenChange, requests, onUpdateStatus }: Props) {
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  
  const filteredRequests = requests.filter(r => filter === 'all' || r.status === 'pending');

  const handleAction = (id: number, status: 'approved' | 'denied') => {
    onUpdateStatus(id, status);
    if (status === 'approved') {
      toast.success(`Troca #${id} aprovada com sucesso!`);
    } else {
      toast.error(`Troca #${id} negada pelo RH.`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem]">
        <DialogHeader className="p-8 bg-gradient-to-r from-amber-500 to-amber-700 text-white relative">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <Clock className="absolute right-8 top-1/2 -translate-y-1/2 h-24 w-24 text-white/10 pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest">
              Fluxo Assistencial
            </Badge>
          </div>
          <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tight mission-control-title">
            Gestão de Repasses
          </DialogTitle>
          <DialogDescription className="text-amber-100 font-medium">
            Avalie e aprove as solicitações de troca de plantão do corpo clínico.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Solicitações Registradas</h3>
            <div className="flex gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setFilter('pending')}
                className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", filter === 'pending' ? "bg-white dark:bg-slate-800 shadow-sm" : "text-muted-foreground")}
              >
                Pendentes
              </button>
              <button 
                onClick={() => setFilter('all')}
                className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", filter === 'all' ? "bg-white dark:bg-slate-800 shadow-sm" : "text-muted-foreground")}
              >
                Histórico
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredRequests.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center border-2 border-dashed border-border/50 rounded-3xl">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500/50 mx-auto mb-3" />
                  <p className="text-sm font-bold text-muted-foreground">Nenhuma troca pendente na fila.</p>
                </motion.div>
              ) : (
                filteredRequests.map((req) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                    key={req.id} 
                    className="p-6 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group"
                  >
                    {req.status === 'approved' && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />}
                    {req.status === 'denied' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />}
                    {req.status === 'pending' && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />}

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-[10px] font-black uppercase bg-background shadow-sm">Ref #{req.id}</Badge>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {req.date}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                            <Clock className="h-3.5 w-3.5" />
                            {req.shift}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
                          <div className="flex-1 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                              <UserSquare2 className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase text-red-500/80">Cede Plantão</span>
                              <span className="font-bold text-sm">{req.from}</span>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
                          <div className="flex-1 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                              <UserSquare2 className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase text-emerald-500/80">Assume Plantão</span>
                              <span className="font-bold text-sm">{req.to}</span>
                            </div>
                          </div>
                        </div>

                        {req.reason && (
                          <div className="text-xs text-muted-foreground bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 flex gap-2">
                             <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                             <span className="italic">"{req.reason}"</span>
                          </div>
                        )}
                      </div>

                      {req.status === 'pending' ? (
                        <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-32">
                          <Button onClick={() => handleAction(req.id, 'approved')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 font-black uppercase tracking-widest text-[10px] rounded-xl h-12">
                            Aprovar
                          </Button>
                          <Button onClick={() => handleAction(req.id, 'denied')} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 font-black uppercase tracking-widest text-[10px] rounded-xl h-12 dark:border-red-900/50 dark:hover:bg-red-900/20">
                            Negar
                          </Button>
                        </div>
                      ) : (
                        <div className="shrink-0 w-full md:w-32 flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 rounded-2xl h-full py-6">
                          {req.status === 'approved' ? (
                            <>
                              <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Aprovada</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-8 w-8 text-red-500 mb-2" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Negada</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
