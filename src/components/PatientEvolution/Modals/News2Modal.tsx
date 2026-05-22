import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface News2ModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function News2Modal({ isOpen, onClose, onApply }: News2ModalProps) {
  const [news2Scale, setNews2Scale] = useState("1");
  const [news2Fr, setNews2Fr] = useState("0");
  const [news2Spo2, setNews2Spo2] = useState("0");
  const [news2O2, setNews2O2] = useState("0");
  const [news2Pas, setNews2Pas] = useState("0");
  const [news2Fc, setNews2Fc] = useState("0");
  const [news2Acvpu, setNews2Acvpu] = useState("0");
  const [news2Temp, setNews2Temp] = useState("0");

  const score = parseInt(news2Fr) + parseInt(news2Spo2) + parseInt(news2O2) + parseInt(news2Temp) + parseInt(news2Pas) + parseInt(news2Fc) + parseInt(news2Acvpu);
  const hasRedScore = [news2Fr, news2Spo2, news2O2, news2Temp, news2Pas, news2Fc, news2Acvpu].some(val => parseInt(val || "0") === 3);

  let newsClass = "Risco Baixo";
  let colorClass = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  let actionText = "Monitorar a cada 12 horas. Resposta baseada na enfermaria.";

  if (score >= 7) {
    newsClass = "Risco Alto (Emergência)";
    colorClass = "bg-red-500/10 text-red-600 border-red-500/20";
    actionText = "Resposta de Emergência (Sala Vermelha). Acionar médico imediatamente. Monitorização contínua.";
  } else if (score >= 5) {
    newsClass = "Risco Médio (Urgente)";
    colorClass = "bg-orange-500/10 text-orange-600 border-orange-500/20";
    actionText = "Resposta Urgente. Avaliação médica rápida. Monitorização no mínimo a cada 1 hora.";
  } else if (hasRedScore) {
    newsClass = "Risco Baixo-Médio (Avaliar)";
    colorClass = "bg-amber-500/10 text-amber-600 border-amber-500/20";
    actionText = "Requer revisão urgente pelo médico ou enfermeiro sênior para decidir se escalona o cuidado.";
  } else if (score >= 1) {
    newsClass = "Risco Baixo";
    colorClass = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    actionText = "Monitorar a cada 4-6 horas.";
  }

  const handleClear = () => {
    setNews2Scale("1");
    setNews2Fr("0");
    setNews2Spo2("0");
    setNews2O2("0");
    setNews2Pas("0");
    setNews2Fc("0");
    setNews2Acvpu("0");
    setNews2Temp("0");
    toast.info("Campos da calculadora limpos.");
  };

  const handleConfirm = () => {
    const descText = `- ESCORE NEWS2 (ALERTA): ${score} pontos (${newsClass.toUpperCase()}).\n  Conduta sugerida: ${actionText}`;
    onApply(descText, `NEWS2: ${score} pts`);
    onClose(false);
    toast.success("Escore NEWS2 integrado ao prontuário com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-500" />
            Escore NEWS2
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            National Early Warning Score 2
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 py-3">
          {/* O paciente retém CO2? */}
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs font-black uppercase text-foreground/80">O paciente tem DPOC / Retém CO2 crônico?</Label>
            <Select value={news2Scale} onValueChange={(val) => {
              setNews2Scale(val);
              setNews2Spo2("0");
            }}>
              <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-dashed">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1">Não - Usar Escala 1 (Padrão)</SelectItem>
                <SelectItem value="2">Sim - Usar Escala 2 (Alvo 88-92%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 1. FR */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">1. Frequência Respiratória (irpm)</Label>
            <Select value={news2Fr} onValueChange={setNews2Fr}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione a faixa de FR..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="3_low">&lt;= 8 irpm (3 pts)</SelectItem>
                <SelectItem value="1_low">9 - 11 irpm (1 pt)</SelectItem>
                <SelectItem value="0">12 - 20 irpm (0 pts)</SelectItem>
                <SelectItem value="2_high">21 - 24 irpm (2 pts)</SelectItem>
                <SelectItem value="3_high">&gt;= 25 irpm (3 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 2. Saturação O2 */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">2. Saturação de Oxigênio (SpO2 %)</Label>
            <Select value={news2Spo2} onValueChange={setNews2Spo2}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder={`Selecione SpO2 (Escala ${news2Scale})...`} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {news2Scale === "1" ? (
                  <>
                    <SelectItem value="3">&lt;= 91% (3 pts)</SelectItem>
                    <SelectItem value="2">92 - 93% (2 pts)</SelectItem>
                    <SelectItem value="1">94 - 95% (1 pt)</SelectItem>
                    <SelectItem value="0">&gt;= 96% (0 pts)</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="3">&lt;= 83% (3 pts)</SelectItem>
                    <SelectItem value="2">84 - 85% (2 pts)</SelectItem>
                    <SelectItem value="1">86 - 87% (1 pt)</SelectItem>
                    <SelectItem value="0">88 - 92% ou &gt;=93% ar ambiente (0 pts)</SelectItem>
                    <SelectItem value="1_high">93 - 94% c/ O2 (1 pt)</SelectItem>
                    <SelectItem value="2_high">95 - 96% c/ O2 (2 pts)</SelectItem>
                    <SelectItem value="3_high">&gt;= 97% c/ O2 (3 pts)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Uso de O2 Suplementar */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">3. Uso de Oxigênio Suplementar</Label>
            <Select value={news2O2} onValueChange={setNews2O2}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione o uso de O2..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="0">Ar Ambiente (0 pts)</SelectItem>
                <SelectItem value="2">Uso de O2 Suplementar (2 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. PAS */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">4. Pressão Arterial Sistólica (mmHg)</Label>
            <Select value={news2Pas} onValueChange={setNews2Pas}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione a faixa de PAS..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="3">&lt;= 90 mmHg (3 pts)</SelectItem>
                <SelectItem value="2">91 - 100 mmHg (2 pts)</SelectItem>
                <SelectItem value="1">101 - 110 mmHg (1 pt)</SelectItem>
                <SelectItem value="0">111 - 219 mmHg (0 pts)</SelectItem>
                <SelectItem value="3_high">&gt;= 220 mmHg (3 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 5. FC */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">5. Frequência Cardíaca (bpm)</Label>
            <Select value={news2Fc} onValueChange={setNews2Fc}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione a faixa de FC..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="3">&lt;= 40 bpm (3 pts)</SelectItem>
                <SelectItem value="1">41 - 50 bpm (1 pt)</SelectItem>
                <SelectItem value="0">51 - 90 bpm (0 pts)</SelectItem>
                <SelectItem value="1_high">91 - 110 bpm (1 pt)</SelectItem>
                <SelectItem value="2_high">111 - 130 bpm (2 pts)</SelectItem>
                <SelectItem value="3_high">&gt;= 131 bpm (3 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 6. Nível de Consciência (ACVPU) */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">6. Nível de Consciência (ACVPU)</Label>
            <Select value={news2Acvpu} onValueChange={setNews2Acvpu}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione o nível de consciência..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="0">A - Alerta / Orientado (0 pts)</SelectItem>
                <SelectItem value="3_c">C - Confusão Nova (3 pts)</SelectItem>
                <SelectItem value="3_v">V - Responde à Voz (3 pts)</SelectItem>
                <SelectItem value="3_p">P - Responde à Dor (3 pts)</SelectItem>
                <SelectItem value="3_u">U - Não Responsivo (3 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 7. Temperatura */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">7. Temperatura Corporal (°C)</Label>
            <Select value={news2Temp} onValueChange={setNews2Temp}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione a faixa de temperatura..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="3">&lt;= 35.0 °C (3 pts)</SelectItem>
                <SelectItem value="1">35.1 - 36.0 °C (1 pt)</SelectItem>
                <SelectItem value="0">36.1 - 38.0 °C (0 pts)</SelectItem>
                <SelectItem value="1_high">38.1 - 39.0 °C (1 pt)</SelectItem>
                <SelectItem value="2_high">&gt;= 39.1 °C (2 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* RESULT */}
          <div className="sm:col-span-2 mt-2">
            <div className="pt-2 animate-in fade-in slide-in-from-bottom-2">
              <div className={cn("p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2", colorClass)}>
                <h4 className="font-black text-xs uppercase tracking-wider">Pontuação NEWS2</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{score}</span>
                  <span className="text-sm font-bold opacity-70">pts</span>
                </div>
                <Badge variant="outline" className={cn("font-bold uppercase text-[10px] tracking-wider", colorClass.replace("bg-", "bg-transparent").replace("text-", "text-").replace("border-", "border-"))}>
                  {newsClass}
                </Badge>
                <p className="text-[10px] mt-1 font-semibold opacity-80 max-w-[90%]">
                  {actionText}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                >
                  Limpar
                </Button>
                <Button 
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                >
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
