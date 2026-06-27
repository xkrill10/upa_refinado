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
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface HumptyDumptyModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function HumptyDumptyModal({ isOpen, onClose, onApply }: HumptyDumptyModalProps) {
  const [age, setAge] = useState("lt3");
  const [gender, setGender] = useState("male");
  const [diagnosis, setDiagnosis] = useState("neuro");
  const [cognitive, setCognitive] = useState("unaware");
  const [environment, setEnvironment] = useState("history");
  const [response, setResponse] = useState("lt48h");
  const [medication, setMedication] = useState("multiple");

  let score = 0;
  // 1. Idade
  if (age === "lt3") score += 4;
  else if (age === "3to6") score += 3;
  else if (age === "7to12") score += 2;
  else if (age === "gt13") score += 1;
  // 2. Gênero
  if (gender === "male") score += 2;
  else score += 1;
  // 3. Diagnóstico
  if (diagnosis === "neuro") score += 4;
  else if (diagnosis === "oxigen") score += 3;
  else if (diagnosis === "psych") score += 2;
  else if (diagnosis === "other") score += 1;
  // 4. Comprometimento Cognitivo
  if (cognitive === "unaware") score += 3;
  else if (cognitive === "forgetful") score += 2;
  else if (cognitive === "oriented") score += 1;
  // 5. Fatores Ambientais
  if (environment === "history") score += 4;
  else if (environment === "equipment") score += 3;
  else if (environment === "furniture") score += 2;
  else if (environment === "none") score += 1;
  // 6. Resposta à Cirurgia/Sedação/Anestesia
  if (response === "lt24h") score += 3;
  else if (response === "lt48h") score += 2;
  else if (response === "gt48h") score += 1;
  // 7. Uso de Medicamentos
  if (medication === "multiple") score += 3;
  else if (medication === "one") score += 2;
  else if (medication === "none") score += 1;

  let riskClass = "Baixo Risco";
  let riskColor = "bg-emerald-500 text-white";
  if (score >= 12) {
    riskClass = "Alto Risco";
    riskColor = "bg-red-500 text-white";
  } else if (score >= 7) {
    riskClass = "Risco Moderado";
    riskColor = "bg-amber-500 text-white";
  }

  const isComplete = !!(age && gender && diagnosis && cognitive && environment && response && medication);

  const handleClear = () => {
    setAge("lt3");
    setGender("male");
    setDiagnosis("neuro");
    setCognitive("unaware");
    setEnvironment("history");
    setResponse("lt48h");
    setMedication("multiple");
    toast.info("Campos da calculadora limpos.");
  };

  const handleConfirm = () => {
    const conduct = score >= 12
      ? "Protocolo de alto risco: grades elevadas, acompanhante 24h, pulseira laranja, supervisão contínua, ambiente seguro."
      : score >= 7
        ? "Protocolo de risco moderado: grades elevadas, acompanhante orientado, supervisão periódica."
        : "Manter grades elevadas de rotina e orientações gerais ao acompanhante.";
    const descText = `- ESCALA HUMPTY-DUMPTY (QUEDAS PEDIÁTRICAS): ${score} pontos (${riskClass.toUpperCase()}).\n  Conduta: ${conduct}`;
    onApply(
      descText,
      `${score} pts (${riskClass === "Alto Risco" ? "Alto" : riskClass === "Risco Moderado" ? "Mod" : "Baixo"})`,
    );
    onClose(false);
    toast.success("Resultado da Escala Humpty-Dumpty inserido no prontuário!");
  };

  const selectTriggerClass = "h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] flex flex-col !p-0 overflow-hidden gap-0">
        {/* Header – drag handle */}
        <div className="p-6 shrink-0 border-b border-border/50 bg-slate-50/30 dark:bg-slate-900/30 cursor-grab active:cursor-grabbing">
          <DialogHeader>
            <DialogTitle className="text-xl mission-control-title flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-violet-500" />
              Escala Humpty-Dumpty (Quedas Pediátricas)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Avaliação de risco de queda para pacientes pediátricos
            </DialogDescription>
          </DialogHeader>
        </div>
        {/* Content area – independent scroll */}
        <div
          className="flex-1 flex flex-col overflow-y-auto custom-scrollbar"
          onPointerDown={(e) => e.stopPropagation()}
          style={{ touchAction: "pan-y" }}
        >
          <div className="space-y-2.5 p-6">
            {/* 1. Idade */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">1. Idade</Label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="lt3">Menor de 3 anos (4 pts)</SelectItem>
                  <SelectItem value="3to6">3 a 6 anos (3 pts)</SelectItem>
                  <SelectItem value="7to12">7 a 12 anos (2 pts)</SelectItem>
                  <SelectItem value="gt13">13 anos ou mais (1 pt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 2. Gênero */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">2. Gênero</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="male">Masculino (2 pts)</SelectItem>
                  <SelectItem value="female">Feminino (1 pt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 3. Diagnóstico */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">3. Diagnóstico</Label>
              <Select value={diagnosis} onValueChange={setDiagnosis}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="neuro">Neurológico (4 pts)</SelectItem>
                  <SelectItem value="oxigen">Alteração de oxigenação (3 pts)</SelectItem>
                  <SelectItem value="psych">Distúrbio psiquiátrico/comportamental (2 pts)</SelectItem>
                  <SelectItem value="other">Outros diagnósticos (1 pt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 4. Comprometimento Cognitivo */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">4. Comprometimento Cognitivo</Label>
              <Select value={cognitive} onValueChange={setCognitive}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="unaware">Não percebe limitações (3 pts)</SelectItem>
                  <SelectItem value="forgetful">Esquece das limitações (2 pts)</SelectItem>
                  <SelectItem value="oriented">Orientado para capacidade própria (1 pt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 5. Fatores Ambientais */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">5. Fatores Ambientais</Label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="history">Histórico de queda / lactente no leito (4 pts)</SelectItem>
                  <SelectItem value="equipment">Uso de equipamentos auxiliares (3 pts)</SelectItem>
                  <SelectItem value="furniture">Paciente no mobiliário (2 pts)</SelectItem>
                  <SelectItem value="none">Área externa ao leito (1 pt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 6. Resposta à Cirurgia/Sedação/Anestesia */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">6. Resposta à Cirurgia/Sedação/Anestesia</Label>
              <Select value={response} onValueChange={setResponse}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="lt24h">Dentro de 24h (3 pts)</SelectItem>
                  <SelectItem value="lt48h">Dentro de 48h (2 pts)</SelectItem>
                  <SelectItem value="gt48h">Mais de 48h / Nenhum (1 pt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 7. Uso de Medicamentos */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">7. Uso de Medicamentos</Label>
              <Select value={medication} onValueChange={setMedication}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="multiple">Uso múltiplo de sedativos/hipnóticos/barbitúricos/antidepressivos/laxantes/diuréticos/narcóticos (3 pts)</SelectItem>
                  <SelectItem value="one">Um dos medicamentos acima (2 pts)</SelectItem>
                  <SelectItem value="none">Outros medicamentos / nenhum (1 pt)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resultado */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
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
                  <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">
                    Incompleto
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button type="button" variant="outline" onClick={handleClear}
                  className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-violet-500/40 hover:bg-violet-500/5 hover:text-violet-600 dark:hover:text-violet-400 transition-all">
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
