import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BradenModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function BradenModal({ isOpen, onClose, onApply }: BradenModalProps) {
  const [bradenSensory, setBradenSensory] = useState("4");
  const [bradenMoisture, setBradenMoisture] = useState("4");
  const [bradenActivity, setBradenActivity] = useState("4");
  const [bradenMobility, setBradenMobility] = useState("4");
  const [bradenNutrition, setBradenNutrition] = useState("4");
  const [bradenFriction, setBradenFriction] = useState("3");

  const s1 = parseInt(bradenSensory) || 0;
  const s2 = parseInt(bradenMoisture) || 0;
  const s3 = parseInt(bradenActivity) || 0;
  const s4 = parseInt(bradenMobility) || 0;
  const s5 = parseInt(bradenNutrition) || 0;
  const s6 = parseInt(bradenFriction) || 0;
  const score = s1 + s2 + s3 + s4 + s5 + s6;

  let riskClass = "Sem Risco";
  let riskColor = "bg-emerald-500 text-white";
  
  if (score > 0) {
    if (score <= 9) {
      riskClass = "Risco Muito Alto";
      riskColor = "bg-red-800 text-white";
    } else if (score >= 10 && score <= 12) {
      riskClass = "Risco Alto";
      riskColor = "bg-red-500 text-white";
    } else if (score >= 13 && score <= 14) {
      riskClass = "Risco Moderado";
      riskColor = "bg-amber-500 text-white";
    } else if (score >= 15 && score <= 18) {
      riskClass = "Risco Baixo";
      riskColor = "bg-emerald-400 text-slate-900";
    }
  }

  const isComplete = !!(bradenSensory && bradenMoisture && bradenActivity && bradenMobility && bradenNutrition && bradenFriction);

  const handleClear = () => {
    setBradenSensory("4");
    setBradenMoisture("4");
    setBradenActivity("4");
    setBradenMobility("4");
    setBradenNutrition("4");
    setBradenFriction("3");
    toast.info("Campos da calculadora limpos.");
  };

  const handleConfirm = () => {
    const descText = `- ESCALA DE BRADEN (LPP): ${score} pontos (${riskClass.toUpperCase()}).\n  Conduta recomendada: ${
      score <= 12 
        ? "Colchão pneumático/piramidal instalado, mudança de decúbito estrita de 2/2h, hidratação profunda da pele, proteção de calcâneos." 
        : score <= 14 
        ? "Mudança de decúbito programada de 3/3h, aplicação de película protetora de pele, manter pele seca e limpa." 
        : "Manter mobilização activa/passiva no leito, hidratação regular da pele e observação diária."
    }`;
    onApply(descText, `${score} pts (${riskClass === "Risco Alto" || riskClass === "Risco Muito Alto" ? "Alto" : riskClass === "Risco Moderado" ? "Mod" : "Baixo"})`);
    onClose(false);
    toast.success("Resultado da Escala de Braden inserido no prontuário!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-2xl glass-card-premium shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Activity className="h-6 w-6 text-orange-500" />
            Escala de Braden (Risco de LPP)
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Avaliação do Risco de Lesão por Pressão em Adulto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* 1. Percepção Sensorial */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">1. Percepção Sensorial</Label>
            <Select value={bradenSensory} onValueChange={setBradenSensory}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione o nível de percepção..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1">1 - Totalmente Limitado</SelectItem>
                <SelectItem value="2">2 - Muito Limitado</SelectItem>
                <SelectItem value="3">3 - Levemente Limitado</SelectItem>
                <SelectItem value="4">4 - Nenhuma Limitação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 2. Umidade */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">2. Umidade da Pele</Label>
            <Select value={bradenMoisture} onValueChange={setBradenMoisture}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione o nível de umidade..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1">1 - Constantemente Úmida</SelectItem>
                <SelectItem value="2">2 - Muito Úmida</SelectItem>
                <SelectItem value="3">3 - Ocasionalmente Úmida</SelectItem>
                <SelectItem value="4">4 - Raramente Úmida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 3. Atividade */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">3. Atividade Física</Label>
            <Select value={bradenActivity} onValueChange={setBradenActivity}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione a atividade física..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1">1 - Acamado</SelectItem>
                <SelectItem value="2">2 - Em Cadeira de Rodas</SelectItem>
                <SelectItem value="3">3 - Deambula Ocasionalmente</SelectItem>
                <SelectItem value="4">4 - Deambula Frequentemente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. Mobilidade */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">4. Mobilidade (Capacidade de mudar posição)</Label>
            <Select value={bradenMobility} onValueChange={setBradenMobility}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione o nível de mobilidade..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1">1 - Totalmente Imóvel</SelectItem>
                <SelectItem value="2">2 - Muito Limitada</SelectItem>
                <SelectItem value="3">3 - Levemente Limitada</SelectItem>
                <SelectItem value="4">4 - Nenhuma Limitação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 5. Nutrição */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">5. Padrão de Nutrição</Label>
            <Select value={bradenNutrition} onValueChange={setBradenNutrition}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione o padrão nutricional..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1">1 - Muito Pobre</SelectItem>
                <SelectItem value="2">2 - Provavelmente Inadequada</SelectItem>
                <SelectItem value="3">3 - Adequada</SelectItem>
                <SelectItem value="4">4 - Excelente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 6. Fricção e Cisalhamento */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">6. Fricção e Cisalhamento</Label>
            <Select value={bradenFriction} onValueChange={setBradenFriction}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                <SelectValue placeholder="Selecione fricção/cisalhamento..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1">1 - Problema Constante</SelectItem>
                <SelectItem value="2">2 - Problema Potencial</SelectItem>
                <SelectItem value="3">3 - Sem Problema Aparente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resultado e Ação */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação Calculada</p>
                <p className="text-3xl font-black text-foreground">{isComplete ? score : 0} <span className="text-sm font-bold text-muted-foreground">pts</span></p>
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
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
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
