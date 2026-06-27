import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FlaccModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function FlaccModal({ isOpen, onClose, onApply }: FlaccModalProps) {
  const [face, setFace] = useState("0");
  const [legs, setLegs] = useState("0");
  const [activityVal, setActivityVal] = useState("0");
  const [cry, setCry] = useState("0");
  const [consolability, setConsolability] = useState("0");

  const score = Number(face) + Number(legs) + Number(activityVal) + Number(cry) + Number(consolability);

  let painLevel = "Relaxado e Confortável";
  let painColor = "bg-emerald-500 text-white";
  if (score >= 8) {
    painLevel = "Dor Intensa / Desconforto Severo";
    painColor = "bg-red-600 text-white";
  } else if (score >= 4) {
    painLevel = "Dor Moderada";
    painColor = "bg-amber-500 text-white";
  } else if (score >= 1) {
    painLevel = "Desconforto Leve";
    painColor = "bg-sky-500 text-white";
  }

  const isComplete = true; // all default to 0

  const handleClear = () => {
    setFace("0"); setLegs("0"); setActivityVal("0"); setCry("0"); setConsolability("0");
    toast.info("Campos da calculadora limpos.");
  };

  const handleConfirm = () => {
    const conduct = score >= 8
      ? "Considerar analgesia potente (opioide), reavaliar em 30 min, conforto não-farmacológico."
      : score >= 4
        ? "Analgesia conforme protocolo, medidas de conforto, reavaliar em 1h."
        : "Manter conforto, observação e reavaliação periódica.";
    const descText = `- ESCALA FLACC (DOR PEDIÁTRICA): ${score}/10 (${painLevel.toUpperCase()}).\n  Conduta: ${conduct}`;
    onApply(descText, `${score}/10 (${painLevel.split(" ")[0]})`);
    onClose(false);
    toast.success("Resultado da Escala FLACC inserido no prontuário!");
  };

  const selectTriggerClass = "h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] flex flex-col !p-0 overflow-hidden gap-0">
        <div className="p-6 shrink-0 border-b border-border/50 bg-slate-50/30 dark:bg-slate-900/30 cursor-grab active:cursor-grabbing">
          <DialogHeader>
            <DialogTitle className="text-xl mission-control-title flex items-center gap-2">
              <Heart className="h-6 w-6 text-pink-500" />
              Escala FLACC (Dor Pediátrica)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Face, Legs, Activity, Cry, Consolability — Crianças pré-verbais (0-7 anos)
            </DialogDescription>
          </DialogHeader>
        </div>
        <div
          className="flex-1 flex flex-col overflow-y-auto custom-scrollbar"
          onPointerDown={(e) => e.stopPropagation()}
          style={{ touchAction: "pan-y" }}
        >
          <div className="space-y-2.5 p-6">
            {/* Face */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">1. Face</Label>
              <Select value={face} onValueChange={setFace}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="0">Sem expressão particular, sorriso (0)</SelectItem>
                  <SelectItem value="1">Caretas ou franzimento de testa ocasional, retraído (1)</SelectItem>
                  <SelectItem value="2">Tremor frequente do queixo, mandíbula cerrada (2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Legs */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">2. Pernas (Legs)</Label>
              <Select value={legs} onValueChange={setLegs}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="0">Posição normal ou relaxada (0)</SelectItem>
                  <SelectItem value="1">Inquieto, agitado, tenso (1)</SelectItem>
                  <SelectItem value="2">Chutando ou pernas encolhidas (2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Activity */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">3. Atividade (Activity)</Label>
              <Select value={activityVal} onValueChange={setActivityVal}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="0">Deitado quieto, posição normal, movimentos fáceis (0)</SelectItem>
                  <SelectItem value="1">Contorcendo-se, movendo-se para frente e para trás, tenso (1)</SelectItem>
                  <SelectItem value="2">Arqueado, rígido ou apresenta movimentos bruscos (2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Cry */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">4. Choro (Cry)</Label>
              <Select value={cry} onValueChange={setCry}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="0">Sem choro (acordado ou dormindo) (0)</SelectItem>
                  <SelectItem value="1">Gemidos ou choramingos, queixa ocasional (1)</SelectItem>
                  <SelectItem value="2">Choro constante, gritos ou soluços, queixas frequentes (2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Consolability */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">5. Consolabilidade (Consolability)</Label>
              <Select value={consolability} onValueChange={setConsolability}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="0">Contente, relaxado (0)</SelectItem>
                  <SelectItem value="1">Tranquilizado por toque, abraço ou conversa, distraível (1)</SelectItem>
                  <SelectItem value="2">Difícil de consolar ou confortar (2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resultado */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação Calculada</p>
                  <p className="text-3xl font-black text-foreground">
                    {score}<span className="text-sm font-bold text-muted-foreground">/10</span>
                  </p>
                </div>
                <Badge className={cn("h-7 rounded-lg text-xs font-black uppercase tracking-wider", painColor)}>
                  {painLevel}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button type="button" variant="outline" onClick={handleClear}
                  className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-pink-500/40 hover:bg-pink-500/5 hover:text-pink-600 dark:hover:text-pink-400 transition-all">
                  Limpar
                </Button>
                <Button type="button" disabled={!isComplete} onClick={handleConfirm}
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
