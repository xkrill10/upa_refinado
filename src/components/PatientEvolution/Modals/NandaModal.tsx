import React, { useState } from "react";
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
  const [selectedNanda, setSelectedNanda] = useState<string | null>(null);
  const [selectedNandaNocList, setSelectedNandaNocList] = useState<string[]>([]);
  const [selectedNandaNicList, setSelectedNandaNicList] = useState<string[]>([]);

  const handleClear = () => {
    setSelectedNanda(null);
    setSelectedNandaNocList([]);
    setSelectedNandaNicList([]);
    toast.info("Diagnóstico de Enfermagem limpo.");
  };

  const handleConfirm = () => {
    const matchedDiag = NANDA_DIAGNOSES.find(diag => diag.id === selectedNanda);

    if (matchedDiag) {
      const descText = `- PROCESSO DE ENFERMAGEM INTEGRADO (NANDA NOC NIC):\n  · NANDA: ${matchedDiag.title} (${matchedDiag.definition})\n  · NOC (Resultados Esperados):\n    ${matchedDiag.nocs.map(noc => `- ${noc}`).join("\n    ")}\n  · NIC (Intervenções Prescritas):\n    ${matchedDiag.nics.map(nic => `- ${nic}`).join("\n    ")}`;
      
      onApply(descText, matchedDiag.title);
      onClose(false);
      toast.success("Plano NANDA-NOC-NIC inserido no prontuário!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-2xl max-h-[90vh] overflow-y-auto">
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
            <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1.5 mb-2">
              <span>1. Selecionar Diagnóstico (NANDA)</span>
            </Label>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {NANDA_DIAGNOSES.map(diag => {
                const isSelected = selectedNanda === diag.id;
                return (
                  <button
                    key={diag.id}
                    type="button"
                    onClick={() => {
                      setSelectedNanda(diag.id);
                      setSelectedNandaNocList(diag.nocs);
                      setSelectedNandaNicList(diag.nics);
                    }}
                    className={cn(
                      "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                      isSelected 
                        ? "bg-primary/5 border-primary text-primary animate-pulse" 
                        : "bg-card border-border"
                    )}
                  >
                    <p className="font-bold text-xs">{diag.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{diag.definition}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coluna 2: NOC & NIC (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between min-h-[400px]">
            {selectedNanda ? (
              <div className="space-y-5">
                {/* NOC */}
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1">
                    <span>2. Resultados Esperados (NOC)</span>
                  </Label>
                  <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 space-y-2.5">
                    {selectedNandaNocList.map((noc, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-[11px] font-medium text-foreground/90 leading-relaxed">{noc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NIC */}
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1">
                    <span>3. Intervenções de Enfermagem (NIC)</span>
                  </Label>
                  <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 space-y-2.5">
                    {selectedNandaNicList.map((nic, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-[11px] font-medium text-foreground/90 leading-relaxed">{nic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-6 text-center text-muted-foreground bg-muted/5">
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
                onClick={handleClear}
                className="rounded-xl font-bold h-10 text-xs px-4 border-muted-foreground/20 text-muted-foreground hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              >
                Limpar
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
                disabled={!selectedNanda}
                onClick={handleConfirm}
                className="rounded-xl font-bold h-10 text-xs px-6 bg-primary text-primary-foreground animate-shimmer"
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
