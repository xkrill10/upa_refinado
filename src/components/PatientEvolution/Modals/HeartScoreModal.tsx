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

interface HeartScoreModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function HeartScoreModal({
  isOpen,
  onClose,
  onApply,
}: HeartScoreModalProps) {
  const [history, setHistory] = useState("");
  const [ecg, setEcg] = useState("");
  const [age, setAge] = useState("");
  const [riskFactors, setRiskFactors] = useState("");
  const [troponin, setTroponin] = useState("");

  const isComplete = !!(history && ecg && age && riskFactors && troponin);

  let score = 0;
  if (history === "2") score += 2;
  if (history === "1") score += 1;
  if (ecg === "2") score += 2;
  if (ecg === "1") score += 1;
  if (age === "2") score += 2;
  if (age === "1") score += 1;
  if (riskFactors === "2") score += 2;
  if (riskFactors === "1") score += 1;
  if (troponin === "2") score += 2;
  if (troponin === "1") score += 1;

  let riskClass = "";
  let riskColor = "";
  let conduta = "";

  if (score >= 7) {
    riskClass = "ALTO RISCO";
    riskColor = "bg-red-600 text-white animate-pulse";
    conduta =
      "Risco de MACE (Eventos Cardíacos Adversos Maiores) em 6 semanas é de 50-65%. Internação urgente e estratificação invasiva precoce indicada.";
  } else if (score >= 4) {
    riskClass = "RISCO MODERADO";
    riskColor = "bg-amber-500 text-white";
    conduta =
      "Risco de MACE de 12-16.6%. Admissão para observação clínica e estratificação não invasiva sugerida.";
  } else {
    riskClass = "BAIXO RISCO";
    riskColor = "bg-emerald-500 text-white";
    conduta =
      "Risco de MACE de 0.9-1.7%. Considerar alta hospitalar precoce se não houver outros achados.";
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl glass-card-premium shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            HEART Score
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Estratificação de Risco em Dor Torácica / SCA
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* History */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">
              História Clínica (H)
            </Label>
            <Select value={history} onValueChange={setHistory}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Pouco suspeita (0 pts)</SelectItem>
                <SelectItem value="1">Moderadamente suspeita (1 pt)</SelectItem>
                <SelectItem value="2">Altamente suspeita (2 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ECG */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">
              Eletrocardiograma (E)
            </Label>
            <Select value={ecg} onValueChange={setEcg}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Normal (0 pts)</SelectItem>
                <SelectItem value="1">
                  Alteração inespecífica da repolarização (1 pt)
                </SelectItem>
                <SelectItem value="2">
                  Depressão significativa do segmento ST (2 pts)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">
              Idade (A)
            </Label>
            <Select value={age} onValueChange={setAge}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">&lt; 45 anos (0 pts)</SelectItem>
                <SelectItem value="1">45 a 64 anos (1 pt)</SelectItem>
                <SelectItem value="2">&ge; 65 anos (2 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Risk Factors */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">
              Fatores de Risco (R)
            </Label>
            <Select value={riskFactors} onValueChange={setRiskFactors}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Nenhum (0 pts)</SelectItem>
                <SelectItem value="1">
                  1 ou 2 fatores de risco (1 pt)
                </SelectItem>
                <SelectItem value="2">
                  &ge; 3 fatores ou doença aterosclerótica prévia (2 pts)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Troponin */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">
              Troponina (T)
            </Label>
            <Select value={troponin} onValueChange={setTroponin}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">&le; Limite normal (0 pts)</SelectItem>
                <SelectItem value="1">1 a 3x o limite normal (1 pt)</SelectItem>
                <SelectItem value="2">
                  &ge; 3x o limite normal (2 pts)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resultado */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                  Pontuação Total
                </p>
                <p className="text-3xl font-black text-foreground">
                  {score}{" "}
                  <span className="text-sm font-bold text-muted-foreground">
                    / 10 pts
                  </span>
                </p>
              </div>
              {isComplete ? (
                <Badge
                  className={cn(
                    "h-7 rounded-lg text-[10px] font-black uppercase px-2",
                    riskColor,
                  )}
                >
                  {riskClass}
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="h-7 rounded-lg text-xs font-black uppercase"
                >
                  Incompleto
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setHistory("");
                  setEcg("");
                  setAge("");
                  setRiskFactors("");
                  setTroponin("");
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
                  const descText = `- HEART SCORE (Dor Torácica): ${score}/10 pontos (${riskClass}).\n  Conduta: ${conduta}`;
                  onApply(descText, `HEART: ${score} pts (${riskClass})`);
                  onClose(false);
                  toast.success("HEART Score aplicado!");
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
