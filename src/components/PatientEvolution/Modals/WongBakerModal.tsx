import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WongBakerModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

const faces = [
  { value: 0, emoji: "😊", label: "Sem dor", color: "bg-emerald-500 hover:bg-emerald-600 border-emerald-400" },
  { value: 2, emoji: "🙂", label: "Dói um pouco", color: "bg-lime-500 hover:bg-lime-600 border-lime-400" },
  { value: 4, emoji: "😐", label: "Dói um pouco mais", color: "bg-yellow-500 hover:bg-yellow-600 border-yellow-400" },
  { value: 6, emoji: "🙁", label: "Dói ainda mais", color: "bg-orange-500 hover:bg-orange-600 border-orange-400" },
  { value: 8, emoji: "😢", label: "Dói muito", color: "bg-red-500 hover:bg-red-600 border-red-400" },
  { value: 10, emoji: "😭", label: "Pior dor possível", color: "bg-red-700 hover:bg-red-800 border-red-600" },
];

export function WongBakerModal({ isOpen, onClose, onApply }: WongBakerModalProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const selectedFace = faces.find((f) => f.value === selected);

  let painLevel = "Sem Dor";
  let painColor = "bg-emerald-500 text-white";
  if (selected !== null) {
    if (selected >= 8) { painLevel = "Dor Intensa"; painColor = "bg-red-600 text-white"; }
    else if (selected >= 6) { painLevel = "Dor Moderada-Intensa"; painColor = "bg-orange-500 text-white"; }
    else if (selected >= 4) { painLevel = "Dor Moderada"; painColor = "bg-amber-500 text-white"; }
    else if (selected >= 2) { painLevel = "Dor Leve"; painColor = "bg-sky-500 text-white"; }
    else { painLevel = "Sem Dor"; painColor = "bg-emerald-500 text-white"; }
  }

  const handleClear = () => {
    setSelected(null);
    toast.info("Seleção limpa.");
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const conduct = selected >= 8
      ? "Analgesia potente conforme protocolo, reavaliação em 30 min, medidas de conforto não-farmacológicas."
      : selected >= 4
        ? "Analgesia conforme protocolo, conforto e reavaliação em 1h."
        : "Manter observação e medidas de conforto.";
    const descText = `- ESCALA WONG-BAKER (DOR PEDIÁTRICA): ${selected}/10 (${painLevel.toUpperCase()}).\n  Conduta: ${conduct}`;
    onApply(descText, `${selected}/10 (${painLevel.split(" ")[0]})`);
    onClose(false);
    toast.success("Resultado da Escala Wong-Baker inserido no prontuário!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] flex flex-col !p-0 overflow-hidden gap-0">
        <div className="p-6 shrink-0 border-b border-border/50 bg-slate-50/30 dark:bg-slate-900/30 cursor-grab active:cursor-grabbing">
          <DialogHeader>
            <DialogTitle className="text-xl mission-control-title flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500" />
              Escala Wong-Baker FACES® (Dor Pediátrica)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Avaliação de dor para crianças a partir de 3 anos — Selecione a face correspondente
            </DialogDescription>
          </DialogHeader>
        </div>
        <div
          className="flex-1 flex flex-col overflow-y-auto custom-scrollbar"
          onPointerDown={(e) => e.stopPropagation()}
          style={{ touchAction: "pan-y" }}
        >
          <div className="space-y-4 p-6">
            <Label className="text-xs font-black uppercase text-foreground/80">
              Selecione a face que melhor descreve a dor do paciente:
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {faces.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setSelected(f.value)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:scale-105",
                    selected === f.value
                      ? `${f.color} text-white shadow-lg scale-105`
                      : "bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/60 hover:border-slate-400",
                  )}
                >
                  <span className="text-4xl mb-1">{f.emoji}</span>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-wider",
                    selected === f.value ? "text-white" : "text-foreground/80",
                  )}>
                    {f.value}
                  </span>
                  <span className={cn(
                    "text-[9px] font-bold mt-0.5",
                    selected === f.value ? "text-white/90" : "text-muted-foreground",
                  )}>
                    {f.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Resultado */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação</p>
                  <p className="text-3xl font-black text-foreground">
                    {selected !== null ? selected : "—"}<span className="text-sm font-bold text-muted-foreground">/10</span>
                  </p>
                </div>
                {selected !== null ? (
                  <Badge className={cn("h-7 rounded-lg text-xs font-black uppercase tracking-wider", painColor)}>
                    {painLevel}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">
                    Selecione
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button type="button" variant="outline" onClick={handleClear}
                  className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-rose-500/40 hover:bg-rose-500/5 hover:text-rose-600 dark:hover:text-rose-400 transition-all">
                  Limpar
                </Button>
                <Button type="button" disabled={selected === null} onClick={handleConfirm}
                  className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground">
                  Confirmar e Aplicar ao Prontuário
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
