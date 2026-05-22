import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EvaModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function EvaModal({ isOpen, onClose, onApply }: EvaModalProps) {
  const [evaScore, setEvaScore] = useState<number | null>(null);
  const [evaLocation, setEvaLocation] = useState("");
  const [evaCharacteristics, setEvaCharacteristics] = useState("");

  const handleClear = () => {
    setEvaScore(null);
    setEvaLocation("");
    setEvaCharacteristics("");
    toast.info("Campos da calculadora limpos.");
  };

  const handleConfirm = () => {
    const painClass = evaScore === 0 ? "SEM DOR" : evaScore! <= 3 ? "DOR LEVE" : evaScore! <= 7 ? "DOR MODERADA" : "DOR INTENSA";
    const details = [];
    if (evaLocation) details.push(`Local: ${evaLocation}`);
    if (evaCharacteristics) details.push(`Aspecto: ${evaCharacteristics}`);
    const detailsStr = details.length > 0 ? ` [${details.join(" · ")}]` : "";

    const descText = `- ESCALA DE DOR (EVA): ${evaScore}/10 (${painClass})${detailsStr}.\n  Conduta: ${
      evaScore! >= 8 
        ? "Notificar equipe médica, administrar analgesia prescrita de resgate e reavaliar sinais vitais." 
        : evaScore! >= 4 
        ? "Administrar analgesia prescrita, manter paciente em repouso e sob observação." 
        : "Manter observação clínica geral."
    }`;
    onApply(descText, `EVA: ${evaScore}/10`);
    onClose(false);
    toast.success("Escala de Dor EVA aplicada com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-xl glass-card-premium shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500 animate-pulse" />
            Escala de Dor (EVA)
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Avaliação Visual Analógica da Dor em Tempo Real
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Seletor Rápido de 0 a 10 */}
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-foreground/80">Selecione o Nível de Dor (0 a 10)</Label>
            <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => {
                let btnColor = "border-border text-foreground hover:bg-muted";
                if (evaScore === val) {
                  if (val === 0) btnColor = "bg-emerald-500 text-white border-emerald-600";
                  else if (val <= 3) btnColor = "bg-green-500 text-white border-green-600";
                  else if (val <= 7) btnColor = "bg-amber-500 text-white border-amber-600";
                  else btnColor = "bg-red-500 text-white border-red-600";
                }
                
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setEvaScore(val)}
                    className={cn(
                      "h-10 rounded-xl border font-black text-sm flex items-center justify-center transition-all hover:scale-105",
                      btnColor
                    )}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wong-Baker Faces e Caracterização */}
          {evaScore !== null ? (
            <div className="p-4 rounded-xl bg-muted/20 border border-border flex items-center gap-4 transition-all">
              <span className="text-4xl">
                {evaScore === 0 ? "😃" : evaScore <= 3 ? "🙂" : evaScore <= 7 ? "😐" : evaScore <= 8 ? "🙁" : evaScore === 9 ? "😩" : "😭"}
              </span>
              <div>
                <p className="text-xs font-black uppercase text-muted-foreground">Classificação da Dor</p>
                <p className="text-lg font-black text-foreground uppercase tracking-wide">
                  {evaScore === 0 ? "0 - Sem Dor" : evaScore <= 3 ? `${evaScore} - Dor Leve` : evaScore <= 7 ? `${evaScore} - Dor Moderada` : `${evaScore} - Dor Intensa/Máxima`}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-muted/10 border border-dashed border-border flex items-center gap-4 transition-all opacity-50">
              <span className="text-4xl grayscale">😶</span>
              <div>
                <p className="text-xs font-black uppercase text-muted-foreground">Classificação da Dor</p>
                <p className="text-lg font-black text-muted-foreground uppercase tracking-wide">
                  Não Avaliada
                </p>
              </div>
            </div>
          )}

          {/* Campos Auxiliares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">Localização da Dor (Opcional)</Label>
              <Input
                type="text"
                placeholder="Ex: Abdomen, Cabeça, Costas"
                value={evaLocation}
                onChange={(e) => setEvaLocation(e.target.value)}
                className="rounded-xl h-10 text-xs font-bold"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase text-muted-foreground">Característica da Dor (Opcional)</Label>
              <Input
                type="text"
                placeholder="Ex: Pontada, Queimação, Pulsátil"
                value={evaCharacteristics}
                onChange={(e) => setEvaCharacteristics(e.target.value)}
                className="rounded-xl h-10 text-xs font-bold"
              />
            </div>
          </div>

          {/* Ação */}
          <div className="flex items-center gap-2 mt-4 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-600 dark:hover:text-red-400 transition-all"
            >
              Limpar
            </Button>
            <Button
              type="button"
              disabled={evaScore === null}
              onClick={handleConfirm}
              className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
            >
              Aplicar ao Prontuário
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
