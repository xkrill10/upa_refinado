import React, { useState } from "react";
import {
  Dialog,
  DialogDragHandle, DialogContent,
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
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BradenQModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function BradenQModal({ isOpen, onClose, onApply }: BradenQModalProps) {
  const [mobility, setMobility] = useState("1");
  const [activity, setActivity] = useState("1");
  const [sensory, setSensory] = useState("1");
  const [moisture, setMoisture] = useState("1");
  const [friction, setFriction] = useState("1");
  const [nutrition, setNutrition] = useState("1");
  const [perfusion, setPerfusion] = useState("1");

  const score =
    Number(mobility) + Number(activity) + Number(sensory) +
    Number(moisture) + Number(friction) + Number(nutrition) + Number(perfusion);

  let riskClass = "Risco Muito Alto";
  let riskColor = "bg-red-600 text-white";
  if (score >= 25) {
    riskClass = "Sem Risco";
    riskColor = "bg-emerald-500 text-white";
  } else if (score >= 21) {
    riskClass = "Baixo Risco";
    riskColor = "bg-sky-500 text-white";
  } else if (score >= 16) {
    riskClass = "Risco Moderado";
    riskColor = "bg-amber-500 text-white";
  } else if (score >= 11) {
    riskClass = "Alto Risco";
    riskColor = "bg-orange-500 text-white";
  }

  const isComplete = !!(mobility && activity && sensory && moisture && friction && nutrition && perfusion);

  const handleClear = () => {
    setMobility("1"); setActivity("1"); setSensory("1");
    setMoisture("1"); setFriction("1"); setNutrition("1"); setPerfusion("1");
    toast.info("Campos da calculadora limpos.");
  };

  const handleConfirm = () => {
    const conduct = score <= 15
      ? "Mudança de decúbito a cada 2h, colchão pneumático, pele hidratada, supervisão intensiva de pele."
      : score <= 20
        ? "Mudança de decúbito a cada 2h, hidratação da pele, avaliação nutricional."
        : "Manter cuidados preventivos de rotina e avaliação periódica da pele.";
    const descText = `- ESCALA BRADEN-Q (LPP PEDIÁTRICA): ${score} pontos (${riskClass.toUpperCase()}).\n  Conduta: ${conduct}`;
    onApply(
      descText,
      `${score} pts (${riskClass === "Risco Muito Alto" ? "M.Alto" : riskClass === "Alto Risco" ? "Alto" : riskClass === "Risco Moderado" ? "Mod" : riskClass === "Baixo Risco" ? "Baixo" : "Sem"})`,
    );
    onClose(false);
    toast.success("Resultado da Escala Braden-Q inserido no prontuário!");
  };

  const selectTriggerClass = "h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] flex flex-col !p-0 overflow-hidden gap-0">
        <DialogDragHandle className="p-6 shrink-0 border-b border-border/50 bg-slate-50/30 dark:bg-slate-900/30">
          <DialogHeader>
            <DialogTitle className="text-xl mission-control-title flex items-center gap-2">
              <Activity className="h-6 w-6 text-orange-500" />
              Escala Braden-Q (LPP Pediátrica)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Avaliação de risco de lesão por pressão em pacientes pediátricos
            </DialogDescription>
          </DialogHeader>
        </DialogDragHandle>
        <div
          className="flex-1 flex flex-col overflow-y-auto custom-scrollbar overscroll-contain"
          onPointerDown={(e) => e.stopPropagation()}
          style={{ touchAction: "pan-y" }}
        >
          <div className="space-y-2.5 p-6">
            {/* 1. Mobilidade */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">1. Mobilidade</Label>
              <Select value={mobility} onValueChange={setMobility}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">Completamente imóvel (1 pt)</SelectItem>
                  <SelectItem value="2">Muito limitada (2 pts)</SelectItem>
                  <SelectItem value="3">Levemente limitada (3 pts)</SelectItem>
                  <SelectItem value="4">Sem limitação (4 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 2. Atividade */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">2. Atividade</Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">Acamado (1 pt)</SelectItem>
                  <SelectItem value="2">Restrito à cadeira (2 pts)</SelectItem>
                  <SelectItem value="3">Deambula ocasionalmente (3 pts)</SelectItem>
                  <SelectItem value="4">Deambula c/ frequência / própria da idade (4 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 3. Percepção Sensorial */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">3. Percepção Sensorial</Label>
              <Select value={sensory} onValueChange={setSensory}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">Completamente limitada (1 pt)</SelectItem>
                  <SelectItem value="2">Muito limitada (2 pts)</SelectItem>
                  <SelectItem value="3">Levemente limitada (3 pts)</SelectItem>
                  <SelectItem value="4">Sem limitação (4 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 4. Umidade */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">4. Umidade</Label>
              <Select value={moisture} onValueChange={setMoisture}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">Constantemente úmida (1 pt)</SelectItem>
                  <SelectItem value="2">Frequentemente úmida (2 pts)</SelectItem>
                  <SelectItem value="3">Ocasionalmente úmida (3 pts)</SelectItem>
                  <SelectItem value="4">Raramente úmida (4 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 5. Fricção e Cisalhamento */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">5. Fricção e Cisalhamento</Label>
              <Select value={friction} onValueChange={setFriction}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">Problema significante (1 pt)</SelectItem>
                  <SelectItem value="2">Problema (2 pts)</SelectItem>
                  <SelectItem value="3">Problema potencial (3 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 6. Nutrição */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">6. Nutrição</Label>
              <Select value={nutrition} onValueChange={setNutrition}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">Muito pobre (1 pt)</SelectItem>
                  <SelectItem value="2">Inadequada (2 pts)</SelectItem>
                  <SelectItem value="3">Adequada (3 pts)</SelectItem>
                  <SelectItem value="4">Excelente (4 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 7. Perfusão Tecidual e Oxigenação */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">7. Perfusão Tecidual e Oxigenação</Label>
              <Select value={perfusion} onValueChange={setPerfusion}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">Extremamente comprometida (1 pt)</SelectItem>
                  <SelectItem value="2">Comprometida (2 pts)</SelectItem>
                  <SelectItem value="3">Adequada (3 pts)</SelectItem>
                  <SelectItem value="4">Excelente (4 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer - Fixo na base */}
        <div className="p-4 border-t border-border/50 bg-slate-50/30 dark:bg-slate-900/30 shrink-0">
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação Calculada</p>
                <p className="text-3xl font-black text-foreground">
                  {score} <span className="text-sm font-bold text-muted-foreground">pts</span>
                </p>
              </div>
              {isComplete ? (
                <Badge className={cn("h-7 rounded-lg text-xs font-black uppercase tracking-wider", riskColor)}>
                  {riskClass}
                </Badge>
              ) : (
                <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">Incompleto</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button type="button" variant="outline" onClick={handleClear}
                className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-600 dark:hover:text-orange-400 transition-all">
                Limpar
              </Button>
              <Button type="button" disabled={!isComplete} onClick={handleConfirm}
                className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground">
                Confirmar e Aplicar ao Prontuário
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
