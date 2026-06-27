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
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GlasgowModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function GlasgowModal({ isOpen, onClose, onApply }: GlasgowModalProps) {
  const [gcsEye, setGcsEye] = useState("4");
  const [gcsVerbal, setGcsVerbal] = useState("5");
  const [gcsMotor, setGcsMotor] = useState("6");

  const eScore = parseInt(gcsEye) || 4;
  const vScore = parseInt(gcsVerbal) || 5;
  const mScore = parseInt(gcsMotor) || 6;
  const score = eScore + vScore + mScore;

  let riskClass = "Consciência Preservada";
  let riskColor = "bg-emerald-500 text-white";
  if (score >= 13 && score <= 14) {
    riskClass = "TCE Leve";
    riskColor = "bg-green-500 text-white";
  } else if (score >= 9 && score <= 12) {
    riskClass = "TCE Moderado";
    riskColor = "bg-amber-500 text-white";
  } else if (score <= 8) {
    riskClass = "TCE Grave / Coma (Crítico)";
    riskColor = "bg-red-500 text-white animate-pulse";
  }

  const isComplete = !!(gcsEye && gcsVerbal && gcsMotor);

  const handleClear = () => {
    setGcsEye("4");
    setGcsVerbal("5");
    setGcsMotor("6");
    toast.info("Campos da calculadora limpos.");
  };

  const handleConfirm = () => {
    const descText = `- ESCALA DE COMA DE GLASGOW (ECG): ${score}/15 pontos (AO: ${eScore}, RV: ${vScore}, RM: ${mScore}).\n  Classificação: ${riskClass.toUpperCase()}.\n  Conduta sugerida: ${
      score <= 8
        ? "ALERTA NEUROLÓGICO CRÍTICO! Paciente em coma (ECG <= 8). Alto risco de perda de reflexos de via aérea. Preparar intubação imediata e monitoramento avançado na Sala Vermelha."
        : score >= 9 && score <= 12
          ? "Disfunção neurológica moderada. Reavaliar a cada hora, elevar cabeceira a 30 graus e solicitar avaliação neurológica com brevidade."
          : score >= 13 && score <= 14
            ? "Disfunção neurológica leve. Monitorar nível de consciência a cada 2 horas e registrar variações."
            : "Nível de consciência preservado, sem déficits focais evidentes. Manter acompanhamento clínico de rotina."
    }`;
    onApply(descText, `Glasgow: ${score}/15`);
    onClose(false);
    toast.success("Resultado da Escala de Glasgow integrado com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-xl glass-card-premium shadow-2xl max-h-[85vh] flex flex-col !p-0 overflow-hidden gap-0">
        <div className="p-6 shrink-0 border-b border-border/50 bg-slate-50/30 dark:bg-slate-900/30">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-500 animate-pulse" />
              Escala de Coma de Glasgow (GCS)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Avaliação do Nível de Consciência e Reatividade Neurológica
            </DialogDescription>
          </DialogHeader>
        </div>

        <div
          className="flex-1 flex flex-col overflow-y-auto custom-scrollbar overscroll-contain"
          onPointerDown={(e) => e.stopPropagation()}
          style={{ touchAction: "pan-y" }}
        >
          <div className="space-y-4 p-6">
            {/* 1. Abertura Ocular */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">
                1. Abertura Ocular (AO)
              </Label>
              <Select value={gcsEye} onValueChange={setGcsEye}>
                <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                  <SelectValue placeholder="Selecione a abertura ocular..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="4">4 - Espontânea</SelectItem>
                  <SelectItem value="3">
                    3 - Ao estímulo verbal / À ordem
                  </SelectItem>
                  <SelectItem value="2">
                    2 - Ao estímulo doloroso / À pressão
                  </SelectItem>
                  <SelectItem value="1">1 - Sem resposta (Ausente)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Resposta Verbal */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">
                2. Resposta Verbal (RV)
              </Label>
              <Select value={gcsVerbal} onValueChange={setGcsVerbal}>
                <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                  <SelectValue placeholder="Selecione a resposta verbal..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="5">5 - Orientado</SelectItem>
                  <SelectItem value="4">4 - Confuso / Desorientado</SelectItem>
                  <SelectItem value="3">3 - Palavras inapropriadas</SelectItem>
                  <SelectItem value="2">
                    2 - Sons incompreensíveis / Inespecíficos
                  </SelectItem>
                  <SelectItem value="1">1 - Sem resposta (Ausente)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Resposta Motora */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">
                3. Resposta Motora (RM)
              </Label>
              <Select value={gcsMotor} onValueChange={setGcsMotor}>
                <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                  <SelectValue placeholder="Selecione a resposta motora..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="6">6 - Obedece a comandos verbal</SelectItem>
                  <SelectItem value="5">
                    5 - Localiza estímulo doloroso
                  </SelectItem>
                  <SelectItem value="4">
                    4 - Flexão normal / Retirada à dor
                  </SelectItem>
                  <SelectItem value="3">
                    3 - Flexão anormal (Decorticação)
                  </SelectItem>
                  <SelectItem value="2">
                    2 - Extensão anormal (Descerebração)
                  </SelectItem>
                  <SelectItem value="1">1 - Sem resposta (Ausente)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer - Fixo na base */}
        <div className="p-4 border-t border-border/50 bg-slate-50/30 dark:bg-slate-900/30 shrink-0">
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                  Pontuação ECG
                </p>
                <p className="text-3xl font-black text-foreground">
                  {score}{" "}
                  <span className="text-sm font-bold text-muted-foreground">
                    / 15 pts
                  </span>
                </p>
              </div>
              {isComplete ? (
                <Badge
                  className={cn(
                    "h-7 rounded-lg text-xs font-black uppercase tracking-wider",
                    riskColor,
                  )}
                >
                  {riskClass}
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="h-7 rounded-lg text-xs font-black uppercase tracking-wider"
                >
                  Incompleto
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
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
