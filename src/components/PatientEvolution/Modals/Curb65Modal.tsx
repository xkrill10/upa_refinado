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
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Curb65ModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function Curb65Modal({ isOpen, onClose, onApply }: Curb65ModalProps) {
  const [confusion, setConfusion] = useState("");
  const [urea, setUrea] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [age65, setAge65] = useState("");

  const isComplete = !!(
    confusion &&
    urea &&
    respiratoryRate &&
    bloodPressure &&
    age65
  );

  let score = 0;
  if (confusion === "1") score += 1;
  if (urea === "1") score += 1;
  if (respiratoryRate === "1") score += 1;
  if (bloodPressure === "1") score += 1;
  if (age65 === "1") score += 1;

  let riskClass = "";
  let riskColor = "";
  let conduta = "";

  if (score >= 3) {
    riskClass = "ALTO RISCO";
    riskColor = "bg-red-600 text-white animate-pulse";
    conduta =
      "Mortalidade estimada de 22%. Internação hospitalar indicada (considerar avaliação para UTI).";
  } else if (score === 2) {
    riskClass = "RISCO MODERADO";
    riskColor = "bg-amber-500 text-white";
    conduta =
      "Mortalidade estimada de 9.2%. Internação hospitalar em enfermaria sugerida.";
  } else {
    riskClass = "BAIXO RISCO";
    riskColor = "bg-emerald-500 text-white";
    conduta =
      "Mortalidade estimada de 1.5%. Tratamento ambulatorial (domiciliar) recomendado, se não houver outras contraindicações.";
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl glass-card-premium shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Activity className="h-6 w-6 text-sky-500" />
            CURB-65
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Estratificação de Risco e Local de Tratamento para Pneumonia
            Adquirida na Comunidade (PAC)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Confusion */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">
              Confusão Mental (C)
            </Label>
            <Select value={confusion} onValueChange={setConfusion}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Ausente (0 pts)</SelectItem>
                <SelectItem value="1">
                  Presente (Desorientação em tempo, espaço ou pessoa) (1 pt)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Urea */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">
              Ureia &gt; 43 mg/dL ou BUN &gt; 19 mg/dL (U)
            </Label>
            <Select value={urea} onValueChange={setUrea}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não (0 pts)</SelectItem>
                <SelectItem value="1">Sim (1 pt)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Respiratory Rate */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">
              Frequência Respiratória &ge; 30 irpm (R)
            </Label>
            <Select value={respiratoryRate} onValueChange={setRespiratoryRate}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não (0 pts)</SelectItem>
                <SelectItem value="1">Sim (1 pt)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Blood Pressure */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">
              Pressão Arterial PAS &lt; 90 ou PAD &le; 60 (B)
            </Label>
            <Select value={bloodPressure} onValueChange={setBloodPressure}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não (0 pts)</SelectItem>
                <SelectItem value="1">Sim (1 pt)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">
              Idade &ge; 65 anos (65)
            </Label>
            <Select value={age65} onValueChange={setAge65}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não (0 pts)</SelectItem>
                <SelectItem value="1">Sim (1 pt)</SelectItem>
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
                    / 5 pts
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
                  setConfusion("");
                  setUrea("");
                  setRespiratoryRate("");
                  setBloodPressure("");
                  setAge65("");
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
                  const descText = `- ESCORE CURB-65 (PAC): ${score}/5 pontos (${riskClass}).\n  Conduta: ${conduta}`;
                  onApply(descText, `CURB-65: ${score} pts (${riskClass})`);
                  onClose(false);
                  toast.success("Escore CURB-65 aplicado!");
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
