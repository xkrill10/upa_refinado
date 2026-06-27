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

interface GlasgowPediatricModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function GlasgowPediatricModal({ isOpen, onClose, onApply }: GlasgowPediatricModalProps) {
  const [eyeOpening, setEyeOpening] = useState("4");
  const [verbalResponse, setVerbalResponse] = useState("5");
  const [motorResponse, setMotorResponse] = useState("6");

  const score = Number(eyeOpening) + Number(verbalResponse) + Number(motorResponse);

  let severity = "Leve (Normal)";
  let severityColor = "bg-emerald-500 text-white";
  if (score <= 8) {
    severity = "Grave (Coma)";
    severityColor = "bg-red-600 text-white";
  } else if (score <= 12) {
    severity = "Moderado";
    severityColor = "bg-amber-500 text-white";
  }

  const isComplete = !!(eyeOpening && verbalResponse && motorResponse);

  const handleClear = () => {
    setEyeOpening("4"); setVerbalResponse("5"); setMotorResponse("6");
    toast.info("Campos da calculadora limpos.");
  };

  const handleConfirm = () => {
    const conduct = score <= 8
      ? "Nível de consciência grave. Monitorização contínua, via aérea protegida, considerar IOT, avaliação neurocirúrgica."
      : score <= 12
        ? "Moderado. Monitorização neurológica intensiva, reavaliação seriada, considerar TC de crânio."
        : "Nível de consciência preservado. Manter observação e reavaliação periódica.";
    const descText = `- ESCALA DE GLASGOW PEDIÁTRICA: ${score}/15 (${severity.toUpperCase()}).\n  AO: ${eyeOpening} | RV: ${verbalResponse} | RM: ${motorResponse}\n  Conduta: ${conduct}`;
    onApply(
      descText,
      `${score}/15 (${severity.split(" ")[0]})`,
    );
    onClose(false);
    toast.success("Resultado da Glasgow Pediátrica inserido no prontuário!");
  };

  const selectTriggerClass = "h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] flex flex-col !p-0 overflow-hidden gap-0">
        <div className="p-6 shrink-0 border-b border-border/50 bg-slate-50/30 dark:bg-slate-900/30 cursor-grab active:cursor-grabbing">
          <DialogHeader>
            <DialogTitle className="text-xl mission-control-title flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-500" />
              Glasgow Pediátrica (Nível de Consciência)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Escala de Coma de Glasgow adaptada para lactentes e crianças menores de 5 anos
            </DialogDescription>
          </DialogHeader>
        </div>
        <div
          className="flex-1 flex flex-col overflow-y-auto custom-scrollbar"
          onPointerDown={(e) => e.stopPropagation()}
          style={{ touchAction: "pan-y" }}
        >
          <div className="space-y-2.5 p-6">
            {/* 1. Abertura Ocular */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">1. Abertura Ocular (AO)</Label>
              <Select value={eyeOpening} onValueChange={setEyeOpening}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="4">Espontânea (4)</SelectItem>
                  <SelectItem value="3">Ao estímulo verbal / ao som (3)</SelectItem>
                  <SelectItem value="2">Ao estímulo doloroso / pressão (2)</SelectItem>
                  <SelectItem value="1">Ausente (1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 2. Resposta Verbal */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">2. Resposta Verbal (RV) — Adaptada</Label>
              <Select value={verbalResponse} onValueChange={setVerbalResponse}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="5">Balbucia, sorri, acompanha objetos, interage (5)</SelectItem>
                  <SelectItem value="4">Choro consolável, interação diminuída (4)</SelectItem>
                  <SelectItem value="3">Choro persistente inconsolável, gemência (3)</SelectItem>
                  <SelectItem value="2">Gemidos fracos, agitação (2)</SelectItem>
                  <SelectItem value="1">Ausente (1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 3. Resposta Motora */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">3. Resposta Motora (RM)</Label>
              <Select value={motorResponse} onValueChange={setMotorResponse}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="6">Movimentos espontâneos / obedece comandos (6)</SelectItem>
                  <SelectItem value="5">Localiza estímulo doloroso / toque (5)</SelectItem>
                  <SelectItem value="4">Retira ao estímulo doloroso / flexão normal (4)</SelectItem>
                  <SelectItem value="3">Flexão anormal / decorticação (3)</SelectItem>
                  <SelectItem value="2">Extensão anormal / descerebração (2)</SelectItem>
                  <SelectItem value="1">Ausente (1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resultado */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação Calculada</p>
                  <p className="text-3xl font-black text-foreground">
                    {score}<span className="text-sm font-bold text-muted-foreground">/15</span>
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    AO: {eyeOpening} | RV: {verbalResponse} | RM: {motorResponse}
                  </p>
                </div>
                {isComplete ? (
                  <Badge className={cn("h-7 rounded-lg text-xs font-black uppercase tracking-wider", severityColor)}>
                    {severity}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">Incompleto</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button type="button" variant="outline" onClick={handleClear}
                  className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
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
