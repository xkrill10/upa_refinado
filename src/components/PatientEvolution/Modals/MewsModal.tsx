import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MewsModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function MewsModal({ isOpen, onClose, onApply }: MewsModalProps) {
  const [mewsPas, setMewsPas] = useState("0");
  const [mewsFc, setMewsFc] = useState("0");
  const [mewsFr, setMewsFr] = useState("0");
  const [mewsTemp, setMewsTemp] = useState("0");
  const [mewsAvdi, setMewsAvdi] = useState("0");

  const getPasScore = () => {
    if (mewsPas === "2_high") return 2;
    return parseInt(mewsPas) || 0;
  };
  const getFcScore = () => {
    if (mewsFc === "2_low" || mewsFc === "2_high") return 2;
    if (mewsFc === "1_low" || mewsFc === "1_high") return 1;
    if (mewsFc === "3_high") return 3;
    return 0;
  };
  const getFrScore = () => {
    if (mewsFr === "2_low" || mewsFr === "2_high") return 2;
    if (mewsFr === "1_high") return 1;
    if (mewsFr === "3_high") return 3;
    return 0;
  };
  const getTempScore = () => {
    if (mewsTemp === "2_low" || mewsTemp === "2_high") return 2;
    return 0;
  };
  const getAvdiScore = () => {
    return parseInt(mewsAvdi) || 0;
  };

  const score = getPasScore() + getFcScore() + getFrScore() + getTempScore() + getAvdiScore();

  let mewsClass = "Baixo Risco";
  let mewsColor = "bg-emerald-500 text-white";
  if (score >= 3 && score <= 4) {
    mewsClass = "Risco Moderado";
    mewsColor = "bg-amber-500 text-white";
  } else if (score >= 5) {
    mewsClass = "Risco Alto (Alerta Clínico)";
    mewsColor = "bg-red-500 text-white animate-pulse";
  }

  const isComplete = !!(mewsPas && mewsFc && mewsFr && mewsTemp && mewsAvdi);

  const handleClear = () => {
    setMewsPas("0");
    setMewsFc("0");
    setMewsFr("0");
    setMewsTemp("0");
    setMewsAvdi("0");
    toast.info("Campos da calculadora limpos.");
  };

  const handleConfirm = () => {
    const descText = `- ESCORE MEWS (ALERTA DE DETERIORAÇÃO): ${score} pontos (${mewsClass.toUpperCase()}).\n  Conduta sugerida: ${
      score >= 5 
        ? "ALERTA CLÍNICO IMEDIATO! Notificar médico assistente do setor, preparar monitor cardíaco contínuo e leito de suporte avançado (Sala Vermelha)." 
        : score >= 3 
        ? "Deterioração clínica moderada. Comunicar enfermeiro supervisor e equipe médica para avaliação do paciente. Registrar sinais vitais a cada hora." 
        : "Baixo risco de deterioração fisiológica. Manter monitoramento de rotina do paciente."
    }`;
    onApply(descText, `MEWS: ${score} pts`);
    onClose(false);
    toast.success("Escore MEWS integrado ao prontuário com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-500" />
            Escore MEWS (Alerta Fisiológico)
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Modified Early Warning Score - Triagem Adulta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* 1. PAS (Pressão Arterial Sistólica) */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">1. Pressão Arterial Sistólica (mmHg)</Label>
            <Select value={mewsPas} onValueChange={setMewsPas}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Selecione a faixa de PAS..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="3">&lt;= 70 mmHg (3 pts)</SelectItem>
                <SelectItem value="2">71 - 80 mmHg (2 pts)</SelectItem>
                <SelectItem value="1">81 - 100 mmHg (1 pt)</SelectItem>
                <SelectItem value="0">101 - 199 mmHg (0 pts)</SelectItem>
                <SelectItem value="2_high">&gt;= 200 mmHg (2 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 2. FC (Frequência Cardíaca) */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">2. Frequência Cardíaca (bpm)</Label>
            <Select value={mewsFc} onValueChange={setMewsFc}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Selecione a faixa de FC..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="2_low">&lt;= 40 bpm (2 pts)</SelectItem>
                <SelectItem value="1_low">41 - 50 bpm (1 pt)</SelectItem>
                <SelectItem value="0">51 - 100 bpm (0 pts)</SelectItem>
                <SelectItem value="1_high">101 - 110 bpm (1 pt)</SelectItem>
                <SelectItem value="2_high">111 - 129 bpm (2 pts)</SelectItem>
                <SelectItem value="3_high">&gt;= 130 bpm (3 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 3. FR (Frequência Respiratória) */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">3. Frequência Respiratória (irpm)</Label>
            <Select value={mewsFr} onValueChange={setMewsFr}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Selecione a faixa de FR..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="2_low">&lt;= 8 irpm (2 pts)</SelectItem>
                <SelectItem value="0">9 - 14 irpm (0 pts)</SelectItem>
                <SelectItem value="1_high">15 - 20 irpm (1 pt)</SelectItem>
                <SelectItem value="2_high">21 - 29 irpm (2 pts)</SelectItem>
                <SelectItem value="3_high">&gt;= 30 irpm (3 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. Temperatura */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">4. Temperatura Corporal (°C)</Label>
            <Select value={mewsTemp} onValueChange={setMewsTemp}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Selecione a faixa de temperatura..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="2_low">&lt; 35.0 °C (2 pts)</SelectItem>
                <SelectItem value="0">35.0 - 38.4 °C (0 pts)</SelectItem>
                <SelectItem value="2_high">&gt;= 38.5 °C (2 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 5. Nível de Consciência (AVDI) */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">5. Nível de Consciência (Escala AVDI)</Label>
            <Select value={mewsAvdi} onValueChange={setMewsAvdi}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Selecione o estado neurológico..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="0">A - Alerta / Responsivo (0 pts)</SelectItem>
                <SelectItem value="1">V - Responsivo à Voz (1 pt)</SelectItem>
                <SelectItem value="2">D - Responsivo à Dor (2 pts)</SelectItem>
                <SelectItem value="3">I - Inconsciente / Sem resposta (3 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resultado e Ação */}
          <div className="mt-6 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação Calculada</p>
                <p className="text-3xl font-black text-foreground">{isComplete ? score : 0} <span className="text-sm font-bold text-muted-foreground">pts</span></p>
              </div>
              {isComplete ? (
                <Badge className={cn("h-7 rounded-lg text-xs font-black uppercase tracking-wider", mewsColor)}>
                  {mewsClass}
                </Badge>
              ) : (
                <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">
                  Incompleto
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
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
