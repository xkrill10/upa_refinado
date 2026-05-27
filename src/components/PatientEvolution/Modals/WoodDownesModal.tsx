import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WoodDownesModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function WoodDownesModal({ isOpen, onClose, onApply }: WoodDownesModalProps) {
  const [wheezing, setWheezing] = useState("");
  const [retractions, setRetractions] = useState("");
  const [airEntry, setAirEntry] = useState("");
  const [cyanosis, setCyanosis] = useState("");
  const [consciousness, setConsciousness] = useState("");

  const isComplete = !!(wheezing && retractions && airEntry && cyanosis && consciousness);

  let score = 0;
  if (isComplete) {
    score = Number(wheezing) + Number(retractions) + Number(airEntry) + Number(cyanosis) + Number(consciousness);
  }

  let riskClass = "";
  let riskColor = "";
  let conduta = "";

  if (score >= 8) {
    riskClass = "CRISE GRAVE";
    riskColor = "bg-red-600 text-white animate-pulse";
    conduta = "Risco de insuficiência respiratória. O2 contínuo, broncodilatador contínuo ou contínuo, corticoide IV, sulfato de magnésio. Considerar UTI/Suporte Ventilatório.";
  } else if (score >= 4) {
    riskClass = "CRISE MODERADA";
    riskColor = "bg-amber-500 text-white";
    conduta = "O2 se SatO2 < 92%. Broncodilatador de horário (a cada 20 min x3), corticoide oral ou IV. Reavaliação constante.";
  } else {
    riskClass = "CRISE LEVE";
    riskColor = "bg-emerald-500 text-white";
    conduta = "Broncodilatador sob demanda ou a cada 4-6h, corticoide oral. Alta após observação com melhora clínica.";
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl glass-card-premium shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Wind className="h-6 w-6 text-sky-500" />
            Escore de Wood-Downes
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Gravidade da Crise de Asma / Bronquiolite
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Sibilância */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">Sibilância</Label>
            <Select value={wheezing} onValueChange={setWheezing}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - Ausente</SelectItem>
                <SelectItem value="1">1 - Expiratória</SelectItem>
                <SelectItem value="2">2 - Inspiratória e Expiratória</SelectItem>
                <SelectItem value="3">3 - Audível sem esteto / Tórax silencioso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tiragem */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">Tiragem (Retrações)</Label>
            <Select value={retractions} onValueChange={setRetractions}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - Ausente</SelectItem>
                <SelectItem value="1">1 - Intercostal leve</SelectItem>
                <SelectItem value="2">2 - Generalizada (intercostal/subcostal)</SelectItem>
                <SelectItem value="3">3 - Grave (supraclavicular, batimento aleta)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Entrada de Ar */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">Entrada de Ar (Murmúrio Vesicular)</Label>
            <Select value={airEntry} onValueChange={setAirEntry}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - Normal / Boa</SelectItem>
                <SelectItem value="1">1 - Simétrica, mas levemente diminuída</SelectItem>
                <SelectItem value="2">2 - Muito diminuída</SelectItem>
                <SelectItem value="3">3 - Ausente (tórax silencioso)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cianose */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">Cianose</Label>
            <Select value={cyanosis} onValueChange={setCyanosis}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - Nenhuma</SelectItem>
                <SelectItem value="1">1 - Em ar ambiente (melhora com O2)</SelectItem>
                <SelectItem value="2">2 - Com O2 a 40%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nível de Consciência */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">Nível de Consciência</Label>
            <Select value={consciousness} onValueChange={setConsciousness}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - Normal / Alerta</SelectItem>
                <SelectItem value="1">1 - Agitado / Irritado</SelectItem>
                <SelectItem value="2">2 - Letárgico / Comatoso</SelectItem>
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
                  setWheezing(""); setRetractions(""); setAirEntry(""); setCyanosis(""); setConsciousness("");
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
                  const descText = `- ESCORE DE WOOD-DOWNES (Asma/Bronquiolite): ${score} pontos (${riskClass}).\n  Conduta: ${conduta}`;
                  onApply(descText, `Wood-Downes: ${score} pts (${riskClass})`);
                  onClose(false);
                  toast.success("Escore de Wood-Downes aplicado!");
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
