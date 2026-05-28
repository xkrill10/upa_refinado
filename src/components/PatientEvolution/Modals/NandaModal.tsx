import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { NANDA_DIAGNOSES } from "@/data/nanda";

interface NandaModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, activePlan: string) => void;
}

export function NandaModal({ isOpen, onClose, onApply }: NandaModalProps) {
  const [viewedNanda, setViewedNanda] = useState<string | null>(null);
  const [activePlans, setActivePlans] = useState<Record<string, { nocs: string[], nics: string[] }>>({});

  useEffect(() => {
    if (isOpen) {
      setViewedNanda(null);
      setActivePlans({});
    }
  }, [isOpen]);

  const handleClear = () => {
    if (viewedNanda) {
      setActivePlans(prev => ({
        ...prev,
        [viewedNanda]: { nocs: [], nics: [] }
      }));
      toast.info("Seleções limpas apenas para este diagnóstico.");
    }
  };

  const toggleNoc = (noc: string) => {
    if (!viewedNanda) return;
    setActivePlans(prev => {
      const plan = prev[viewedNanda] || { nocs: [], nics: [] };
      const newNocs = plan.nocs.includes(noc) ? plan.nocs.filter(n => n !== noc) : [...plan.nocs, noc];
      return { ...prev, [viewedNanda]: { ...plan, nocs: newNocs } };
    });
  };

  const toggleNic = (nic: string) => {
    if (!viewedNanda) return;
    setActivePlans(prev => {
      const plan = prev[viewedNanda] || { nocs: [], nics: [] };
      const newNics = plan.nics.includes(nic) ? plan.nics.filter(n => n !== nic) : [...plan.nics, nic];
      return { ...prev, [viewedNanda]: { ...plan, nics: newNics } };
    });
  };

  const handleConfirm = () => {
    let finalDesc = "- PROCESSO DE ENFERMAGEM INTEGRADO (NANDA NOC NIC):";
    let hasAny = false;
    let summaryTitles = [];

    for (const [diagId, plan] of Object.entries(activePlans)) {
      if (plan.nocs.length === 0 && plan.nics.length === 0) continue;
      
      const matchedDiag = NANDA_DIAGNOSES.find(d => d.id === diagId);
      if (matchedDiag) {
        hasAny = true;
        summaryTitles.push(matchedDiag.title);
        finalDesc += `\n\n  · NANDA: ${matchedDiag.title} (${matchedDiag.definition})`;
        if (plan.nocs.length > 0) {
          finalDesc += `\n  · NOC (Resultados Esperados):\n    ${plan.nocs.map(noc => `- ${noc}`).join("\n    ")}`;
        }
        if (plan.nics.length > 0) {
          finalDesc += `\n  · NIC (Intervenções Prescritas):\n    ${plan.nics.map(nic => `- ${nic}`).join("\n    ")}`;
        }
      }
    }

    if (!hasAny) {
      toast.error("Selecione ao menos um NOC ou NIC em algum diagnóstico.");
      return;
    }
    
    const activePlanSummary = summaryTitles.length > 1 
      ? `Múltiplos Diagnósticos (${summaryTitles.length})`
      : summaryTitles[0];

    onApply(finalDesc, activePlanSummary);
    onClose(false);
    toast.success("Plano NANDA-NOC-NIC inserido no prontuário!");
  };

  const viewedDiag = NANDA_DIAGNOSES.find(d => d.id === viewedNanda);
  const currentPlan = viewedNanda ? (activePlans[viewedNanda] || { nocs: [], nics: [] }) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Planejador de Enfermagem (NANDA · NOC · NIC)
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Planejamento de Cuidados e Processo de Enfermagem Integrado
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
          {/* Coluna 1: Diagnósticos NANDA (5 cols) */}
          <div className="md:col-span-5 space-y-3 border-r border-border/60 pr-4">
            <Label className="text-xs font-black uppercase text-foreground/80 flex items-center justify-between mb-2">
              <span>1. Diagnósticos (NANDA)</span>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {Object.values(activePlans).filter(p => p.nocs.length > 0 || p.nics.length > 0).length} Ativos
              </span>
            </Label>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {NANDA_DIAGNOSES.map(diag => {
                const isViewed = viewedNanda === diag.id;
                const plan = activePlans[diag.id];
                const isActive = plan && (plan.nocs.length > 0 || plan.nics.length > 0);

                let btnClass = "bg-card border-border hover:bg-muted/40";
                if (isViewed) {
                  btnClass = "bg-primary/5 border-primary text-primary animate-pulse";
                } else if (isActive) {
                  btnClass = "bg-emerald-500/5 border-emerald-500/40 text-foreground hover:bg-emerald-500/10";
                }

                return (
                  <button
                    key={diag.id}
                    type="button"
                    onClick={() => {
                      setViewedNanda(diag.id);
                      if (!activePlans[diag.id]) {
                        setActivePlans(prev => ({
                          ...prev,
                          [diag.id]: { nocs: [], nics: [] }
                        }));
                      }
                    }}
                    className={cn(
                      "w-full p-3 rounded-xl border text-left transition-all relative",
                      btnClass
                    )}
                  >
                    {isActive && !isViewed && (
                      <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-emerald-500" />
                    )}
                    <p className={cn("font-bold text-xs pr-6", isViewed ? "text-primary" : isActive ? "text-emerald-600 dark:text-emerald-400" : "")}>
                      {diag.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{diag.definition}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coluna 2: NOC & NIC (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between min-h-[400px]">
            {viewedDiag && currentPlan ? (
              <div className="space-y-5">
                {/* NOC */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1">
                      <span>2. Resultados Esperados (NOC)</span>
                    </Label>
                    <span className="text-[10px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
                      {currentPlan.nocs.length} / {viewedDiag.nocs.length}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-1">
                    {viewedDiag.nocs.map((noc, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all border",
                          currentPlan.nocs.includes(noc) 
                            ? "bg-emerald-500/10 border-emerald-500/30" 
                            : "bg-transparent border-transparent hover:bg-muted/50"
                        )}
                        onClick={() => toggleNoc(noc)}
                      >
                        <CheckCircle2 className={cn(
                          "h-4 w-4 mt-0.5 shrink-0 transition-colors",
                          currentPlan.nocs.includes(noc) ? "text-emerald-500" : "text-muted-foreground/40"
                        )} />
                        <span className={cn(
                          "text-[11px] font-medium leading-relaxed transition-colors",
                          currentPlan.nocs.includes(noc) ? "text-foreground/90" : "text-muted-foreground/60"
                        )}>{noc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NIC */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1">
                      <span>3. Intervenções de Enfermagem (NIC)</span>
                    </Label>
                    <span className="text-[10px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
                      {currentPlan.nics.length} / {viewedDiag.nics.length}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-1">
                    {viewedDiag.nics.map((nic, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all border",
                          currentPlan.nics.includes(nic) 
                            ? "bg-primary/10 border-primary/30" 
                            : "bg-transparent border-transparent hover:bg-muted/50"
                        )}
                        onClick={() => toggleNic(nic)}
                      >
                        <CheckCircle2 className={cn(
                          "h-4 w-4 mt-0.5 shrink-0 transition-colors",
                          currentPlan.nics.includes(nic) ? "text-primary" : "text-muted-foreground/40"
                        )} />
                        <span className={cn(
                          "text-[11px] font-medium leading-relaxed transition-colors",
                          currentPlan.nics.includes(nic) ? "text-foreground/90" : "text-muted-foreground/60"
                        )}>{nic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 text-center text-muted-foreground bg-muted/5">
                <Activity className="h-10 w-10 text-muted-foreground/30 mb-2 animate-pulse" />
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground/60">Aguardando Seleção</p>
                <p className="text-[10px] text-muted-foreground/40 mt-1 max-w-[240px]">Selecione um diagnóstico de enfermagem na coluna esquerda para planejar os cuidados NOC/NIC.</p>
              </div>
            )}

            {/* Botão de Confirmação */}
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={!viewedNanda}
                onClick={handleClear}
                className="rounded-xl font-bold h-10 text-xs px-4 border-muted-foreground/20 text-muted-foreground hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              >
                Limpar Atual
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose(false)}
                className="rounded-xl font-bold h-10 text-xs px-4"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={Object.values(activePlans).every(p => p.nocs.length === 0 && p.nics.length === 0)}
                onClick={handleConfirm}
                className="rounded-xl font-bold h-10 text-xs px-6 bg-primary text-primary-foreground animate-shimmer disabled:opacity-50 disabled:animate-none"
              >
                Confirmar e Aplicar ao Prontuário
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
