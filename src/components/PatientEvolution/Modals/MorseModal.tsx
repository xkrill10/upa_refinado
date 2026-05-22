import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MorseModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function MorseModal({ isOpen, onClose, onApply }: MorseModalProps) {
  const [morseHistory, setMorseHistory] = useState("no");
  const [morseDiagnosis, setMorseDiagnosis] = useState("no");
  const [morseAmbulation, setMorseAmbulation] = useState("none");
  const [morseIv, setMorseIv] = useState("no");
  const [morseGait, setMorseGait] = useState("normal");
  const [morseMental, setMorseMental] = useState("oriented");

  let score = 0;
  if (morseHistory === "yes") score += 25;
  if (morseDiagnosis === "yes") score += 15;
  if (morseAmbulation === "crutches") score += 15;
  if (morseAmbulation === "furniture") score += 30;
  if (morseIv === "yes") score += 20;
  if (morseGait === "weak") score += 10;
  if (morseGait === "impaired") score += 20;
  if (morseMental === "forgetful") score += 15;

  let riskClass = "Baixo Risco";
  let riskColor = "bg-emerald-500 text-white";
  if (score >= 25 && score <= 44) {
    riskClass = "Risco Moderado";
    riskColor = "bg-amber-500 text-white";
  } else if (score >= 45) {
    riskClass = "Risco Alto";
    riskColor = "bg-red-500 text-white";
  }

  const isComplete = !!(morseHistory && morseDiagnosis && morseAmbulation && morseIv && morseGait && morseMental);

  const handleClear = () => {
    setMorseHistory("no");
    setMorseDiagnosis("no");
    setMorseAmbulation("none");
    setMorseIv("no");
    setMorseGait("normal");
    setMorseMental("oriented");
    toast.info("Campos da calculadora limpos.");
  };

  const handleConfirm = () => {
    const descText = `- ESCALA DE MORSE (QUEDAS): ${score} pontos (${riskClass.toUpperCase()}).\n  Conduta: ${
      score >= 45 
        ? "Grades do leito elevadas, campainha de fácil acesso, pulseira de risco de queda, acompanhante orientado." 
        : score >= 25 
        ? "Grades elevadas, auxílio na deambulação e supervisão periódica." 
        : "Manter grades elevadas de rotina e orientações gerais."
    }`;
    onApply(descText, `${score} pts (${riskClass === "Risco Alto" ? "Alto" : riskClass === "Risco Moderado" ? "Mod" : "Baixo"})`);
    onClose(false);
    toast.success("Resultado da Escala de Morse inserido no prontuário!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl glass-card-premium shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-amber-500" />
            Escala de Morse (Risco de Quedas)
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Avaliação do Risco de Quedas em Paciente Adulto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* 1. Histórico de Quedas */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">1. Histórico de Quedas nos últimos 3 meses</Label>
            <Select value={morseHistory} onValueChange={setMorseHistory}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="no">Não (0 pts)</SelectItem>
                <SelectItem value="yes">Sim (25 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 2. Diagnóstico Secundário */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">2. Diagnóstico Secundário no prontuário</Label>
            <Select value={morseDiagnosis} onValueChange={setMorseDiagnosis}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="no">Não (0 pts)</SelectItem>
                <SelectItem value="yes">Sim (15 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 3. Auxílio na Deambulação */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">3. Auxílio na Deambulação</Label>
            <Select value={morseAmbulation} onValueChange={setMorseAmbulation}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione o auxílio..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="none">Nenhum / Acamado / Cadeira de Rodas (0 pts)</SelectItem>
                <SelectItem value="crutches">Muletas / Bengala / Andador (15 pts)</SelectItem>
                <SelectItem value="furniture">Apoia-se em móveis ou paredes (30 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. Terapia Intravenosa */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">4. Terapia Intravenosa / Dispositivo Endovenoso (Soro, Acesso)</Label>
            <Select value={morseIv} onValueChange={setMorseIv}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="no">Não (0 pts)</SelectItem>
                <SelectItem value="yes">Sim (20 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 5. Marcha */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">5. Marcha / Transferência</Label>
            <Select value={morseGait} onValueChange={setMorseGait}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione o padrão de marcha..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="normal">Normal / Acamado / Cadeira de Rodas (0 pts)</SelectItem>
                <SelectItem value="weak">Fraca / Ligeiramente alterada (10 pts)</SelectItem>
                <SelectItem value="impaired">Limitada / Com esforço ou passos curtos (20 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 6. Estado Mental */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">6. Estado Mental</Label>
            <Select value={morseMental} onValueChange={setMorseMental}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione o estado mental..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="oriented">Orientado / Limites próprios (0 pts)</SelectItem>
                <SelectItem value="forgetful">Superestima limites / Esquecido (15 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resultado e Ação */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação Calculada</p>
                <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-bold text-muted-foreground">pts</span></p>
              </div>
              {isComplete ? (
                <Badge className={cn("h-7 rounded-lg text-xs font-black uppercase tracking-wider", riskColor)}>
                  {riskClass}
                </Badge>
              ) : (
                <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">
                  Incompleto
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
              >
                Limpar
              </Button>
              <Button
                type="button"
                disabled={!isComplete}
                onClick={handleConfirm}
                className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
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
