import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplet } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DehydrationScoreModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function DehydrationScoreModal({ isOpen, onClose, onApply }: DehydrationScoreModalProps) {
  const [general, setGeneral] = useState("");
  const [eyes, setEyes] = useState("");
  const [thirst, setThirst] = useState("");
  const [skinFold, setSkinFold] = useState("");

  const isComplete = !!(general && eyes && thirst && skinFold);

  let countB = 0;
  let countC = 0;

  if (general === "B") countB++;
  if (general === "C") countC++;
  if (eyes === "B") countB++;
  if (eyes === "C") countC++;
  if (thirst === "B") countB++;
  if (thirst === "C") countC++;
  if (skinFold === "B") countB++;
  if (skinFold === "C") countC++;

  let riskClass = "";
  let riskColor = "";
  let conduta = "";

  if (countC >= 2 || (countC === 1 && countB >= 1 && countC + countB >= 2 && general === "C")) {
    // Simplificando a regra: se tem 2 ou mais sinais da coluna C
    // O general "C" é muito grave, mas vamos usar a regra clássica: >= 2 sinais C.
  }
  
  // Regra Exata OMS
  if (countC >= 2) {
    riskClass = "DESIDRATAÇÃO GRAVE";
    riskColor = "bg-red-600 text-white animate-pulse";
    conduta = "Plano C: Hidratação Venosa (Fase Rápida). Encaminhar para sala de emergência. Iniciar expansão com SF 0,9% ou Ringer Lactato conforme faixa etária.";
  } else if (countB >= 2 || (countB + countC >= 2)) {
    riskClass = "ALGUMA DESIDRATAÇÃO";
    riskColor = "bg-amber-500 text-white";
    conduta = "Plano B: Terapia de Reidratação Oral (TRO) na unidade de saúde. Soro de reidratação oral (SRO) 50-100 mL/kg em 4 horas. Avaliação contínua.";
  } else {
    riskClass = "SEM DESIDRATAÇÃO CLÍNICA";
    riskColor = "bg-emerald-500 text-white";
    conduta = "Plano A: Tratamento domiciliar. Aumentar a oferta de líquidos, manter alimentação, orientar sinais de alerta e retorno se necessário.";
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl glass-card-premium shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Droplet className="h-6 w-6 text-sky-500" />
            Escore de Desidratação (OMS)
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Avaliação de Desidratação em Crianças
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Condição Geral */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">1. Condição Geral</Label>
            <Select value={general} onValueChange={setGeneral}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A - Bem, alerta</SelectItem>
                <SelectItem value="B">B - Inquieto, irritado</SelectItem>
                <SelectItem value="C">C - Letárgico ou inconsciente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Olhos */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">2. Olhos</Label>
            <Select value={eyes} onValueChange={setEyes}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A - Normais</SelectItem>
                <SelectItem value="B">B - Fundos</SelectItem>
                <SelectItem value="C">C - Muito fundos e secos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sede */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">3. Sede (oferecer líquido)</Label>
            <Select value={thirst} onValueChange={setThirst}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A - Bebe normalmente, sem sede</SelectItem>
                <SelectItem value="B">B - Sedento, bebe avidamente</SelectItem>
                <SelectItem value="C">C - Bebe mal ou não é capaz de beber</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sinal da Prega */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">4. Sinal da Prega</Label>
            <Select value={skinFold} onValueChange={setSkinFold}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A - Desaparece rapidamente</SelectItem>
                <SelectItem value="B">B - Desaparece lentamente ( &lt; 2s )</SelectItem>
                <SelectItem value="C">C - Desaparece muito lentamente ( &gt; 2s )</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resultado */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Classificação</p>
                <p className={cn("text-xl sm:text-2xl font-black mt-1", 
                  riskClass.includes("GRAVE") ? "text-red-600 dark:text-red-400" :
                  riskClass.includes("ALGUMA") ? "text-amber-600 dark:text-amber-400" :
                  "text-emerald-600 dark:text-emerald-400"
                )}>
                  {riskClass || "---"}
                </p>
              </div>
              {isComplete ? (
                <Badge className={cn("h-7 rounded-lg text-[10px] font-black uppercase px-2", riskColor)}>
                  {riskClass.includes("GRAVE") ? "PLANO C" : riskClass.includes("ALGUMA") ? "PLANO B" : "PLANO A"}
                </Badge>
              ) : (
                <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase">
                  Incompleto
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setGeneral(""); setEyes(""); setThirst(""); setSkinFold("");
                  toast.info("Campos limpos.");
                }}
                className="h-11 px-6 rounded-xl font-bold uppercase text-[10px]"
              >
                Limpar
              </Button>
              <Button
                type="button"
                disabled={!isComplete}
                onClick={() => {
                  const plano = riskClass.includes("GRAVE") ? "PLANO C" : riskClass.includes("ALGUMA") ? "PLANO B" : "PLANO A";
                  const descText = `- AVALIAÇÃO DE DESIDRATAÇÃO (OMS): ${riskClass}.\n  Conduta: ${conduta}`;
                  onApply(descText, `Desidratação: ${plano}`);
                  onClose(false);
                  toast.success("Avaliação de Desidratação aplicada!");
                }}
                className="flex-1 h-11 rounded-xl font-bold uppercase text-[10px] bg-primary text-primary-foreground"
              >
                Aplicar ao Prontuário
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
