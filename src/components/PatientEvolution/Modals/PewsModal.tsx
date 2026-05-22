import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Baby } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PewsModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function PewsModal({ isOpen, onClose, onApply }: PewsModalProps) {
  const [pewsBehavior, setPewsBehavior] = useState("");
  const [pewsCv, setPewsCv] = useState("");
  const [pewsResp, setPewsResp] = useState("");
  const [pewsNeb, setPewsNeb] = useState("");

  const b = parseInt(pewsBehavior) || 0;
  const cv = parseInt(pewsCv) || 0;
  const r = parseInt(pewsResp) || 0;
  const n = pewsNeb === "yes" ? 2 : 0;
  const score = b + cv + r + n;

  let riskClass = "Risco Baixo";
  let riskColor = "bg-emerald-500 text-white";
  if (score >= 3 && score <= 4) {
    riskClass = "Risco Moderado";
    riskColor = "bg-amber-500 text-white";
  } else if (score >= 5) {
    riskClass = "Risco Alto (Urgência Pediátrica)";
    riskColor = "bg-red-500 text-white animate-pulse";
  }

  const isComplete = !!(pewsBehavior && pewsCv && pewsResp && pewsNeb);

  const handleClear = () => {
    setPewsBehavior("");
    setPewsCv("");
    setPewsResp("");
    setPewsNeb("");
    toast.info("Campos da calculadora limpos.");
  };

  const handleConfirm = () => {
    const descText = `- ESCORE PEWS (ALERTA PEDIÁTRICO PRECOCE): ${score} pontos (${riskClass.toUpperCase()}).\n  Conduta sugerida: ${
      score >= 5 
        ? "ALERTA DE EMERGÊNCIA PEDIÁTRICA! Comunicar o pediatra plantonista de imediato, preparar monitorização intensiva e transferir para leito de emergência pediátrica na Sala Vermelha." 
        : score >= 3 
        ? "Comunicar enfermeiro e médico pediatra do setor. Reavaliar sinais vitais e escore PEWS a cada 30 minutos." 
        : "Manter acompanhamento clínico pediátrico de rotina."
    }`;
    onApply(descText, `PEWS: ${score} pts`);
    onClose(false);
    toast.success("Escore PEWS aplicado com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl glass-card-premium shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Baby className="h-6 w-6 text-teal-500 animate-bounce" />
            Escore PEWS (Alerta Pediátrico)
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Pediatric Early Warning Score - Triagem Infantil
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* 1. Comportamento */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">1. Comportamento / Estado Geral</Label>
            <Select value={pewsBehavior} onValueChange={setPewsBehavior}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione o comportamento da criança..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="0">0 - Ativo, responsivo, corado ou brincando</SelectItem>
                <SelectItem value="1">1 - Apático, hipoativo, sonolento</SelectItem>
                <SelectItem value="2">2 - Irritável, choro presumido inconsolável</SelectItem>
                <SelectItem value="3">3 - Letárgico, torporoso ou resposta diminuída à dor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 2. Cardiovascular */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">2. Cardiovascular / Perfusão Periférica</Label>
            <Select value={pewsCv} onValueChange={setPewsCv}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione o estado cardiovascular..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="0">0 - Pele corada, perfusão periférica &lt;= 2s</SelectItem>
                <SelectItem value="1">1 - Pele pálida ou perfusão de 3s</SelectItem>
                <SelectItem value="2">2 - Pele moteada, perfusão de 4s ou taquicardia severa</SelectItem>
                <SelectItem value="3">3 - Cianose activa, perfusão &gt;= 5s ou bradicardia grave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 3. Esforço Respiratório */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">3. Esforço Respiratório / Frequência</Label>
            <Select value={pewsResp} onValueChange={setPewsResp}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione o padrão respiratório..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="0">0 - Padrão e frequência normais para a idade</SelectItem>
                <SelectItem value="1">1 - Taquipneia leve, uso discreto de musculatura acessória</SelectItem>
                <SelectItem value="2">2 - Taquipneia moderada, tiragens evidentes ou gemência</SelectItem>
                <SelectItem value="3">3 - Gemência persistente, batimento de asa de nariz ou apneias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. Nebulização de Resgate */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">4. Nebulização de Resgate Recorrente (a cada 15 min)</Label>
            <Select value={pewsNeb} onValueChange={setPewsNeb}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="no">Não (0 pts)</SelectItem>
                <SelectItem value="yes">Sim (2 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resultado e Ação */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação PEWS</p>
                <p className="text-3xl font-black text-foreground">{isComplete ? score : 0} <span className="text-sm font-bold text-muted-foreground">pts</span></p>
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
                className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-teal-500/40 hover:bg-teal-500/5 hover:text-teal-600 dark:hover:text-teal-400 transition-all"
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
