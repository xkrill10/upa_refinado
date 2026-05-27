import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WellsScoreModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function WellsScoreModal({ isOpen, onClose, onApply }: WellsScoreModalProps) {
  const [dvtSigns, setDvtSigns] = useState("");
  const [altDiagnosis, setAltDiagnosis] = useState("");
  const [hr, setHr] = useState("");
  const [immobility, setImmobility] = useState("");
  const [prevDvt, setPrevDvt] = useState("");
  const [hemoptysis, setHemoptysis] = useState("");
  const [malignancy, setMalignancy] = useState("");

  const isComplete = !!(dvtSigns && altDiagnosis && hr && immobility && prevDvt && hemoptysis && malignancy);

  let score = 0;
  if (dvtSigns === "3") score += 3;
  if (altDiagnosis === "3") score += 3;
  if (hr === "1.5") score += 1.5;
  if (immobility === "1.5") score += 1.5;
  if (prevDvt === "1.5") score += 1.5;
  if (hemoptysis === "1") score += 1;
  if (malignancy === "1") score += 1;

  let riskClass = "";
  let riskColor = "";
  let conduta = "";

  if (score > 4) {
    riskClass = "TEP PROVÁVEL";
    riskColor = "bg-red-600 text-white animate-pulse";
    conduta = "Considerar solicitação de Angio-TC de Tórax imediatamente.";
  } else {
    riskClass = "TEP IMPROVÁVEL";
    riskColor = "bg-emerald-500 text-white";
    conduta = "Considerar solicitação de D-Dímero para exclusão ou avaliar outros diagnósticos.";
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl glass-card-premium shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Activity className="h-6 w-6 text-red-500" />
            Escore de Wells (TEP)
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Probabilidade Clínica de Tromboembolismo Pulmonar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* DVT Signs */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">Sinais Clínicos de TVP (Edema e dor à palpação)</Label>
            <Select value={dvtSigns} onValueChange={setDvtSigns}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não (0 pts)</SelectItem>
                <SelectItem value="3">Sim (3 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alternative Diagnosis */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">TEP é o diagnóstico mais provável?</Label>
            <Select value={altDiagnosis} onValueChange={setAltDiagnosis}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não (0 pts)</SelectItem>
                <SelectItem value="3">Sim (3 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* HR */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">Frequência Cardíaca &gt; 100 bpm</Label>
            <Select value={hr} onValueChange={setHr}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não (0 pts)</SelectItem>
                <SelectItem value="1.5">Sim (1.5 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Immobility */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">Imobilização (&ge; 3 dias) ou Cirurgia nas últimas 4 semanas</Label>
            <Select value={immobility} onValueChange={setImmobility}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não (0 pts)</SelectItem>
                <SelectItem value="1.5">Sim (1.5 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prev DVT */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">TVP ou TEP prévio diagnosticado</Label>
            <Select value={prevDvt} onValueChange={setPrevDvt}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não (0 pts)</SelectItem>
                <SelectItem value="1.5">Sim (1.5 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hemoptysis */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">Hemoptise</Label>
            <Select value={hemoptysis} onValueChange={setHemoptysis}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não (0 pts)</SelectItem>
                <SelectItem value="1">Sim (1 pt)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Malignancy */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">Malignidade (em tratamento ou paliativo)</Label>
            <Select value={malignancy} onValueChange={setMalignancy}>
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
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação Total</p>
                <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-bold text-muted-foreground">pts</span></p>
              </div>
              {isComplete ? (
                <Badge className={cn("h-7 rounded-lg text-[10px] font-black uppercase px-2", riskColor)}>
                  {riskClass}
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
                  setDvtSigns(""); setAltDiagnosis(""); setHr(""); setImmobility(""); setPrevDvt(""); setHemoptysis(""); setMalignancy("");
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
                  const descText = `- ESCORE DE WELLS PARA TEP: ${score} pontos (${riskClass}).\n  Conduta: ${conduta}`;
                  onApply(descText, `Wells TEP: ${score} pts (${riskClass})`);
                  onClose(false);
                  toast.success("Escore de Wells aplicado!");
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
