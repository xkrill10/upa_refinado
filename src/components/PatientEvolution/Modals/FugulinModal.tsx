import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FugulinModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function FugulinModal({ isOpen, onClose, onApply }: FugulinModalProps) {
  const [activeNursingTab, setActiveNursingTab] = useState("fugulin");
  const [fugulinMental, setFugulinMental] = useState("1");
  const [fugulinOxy, setFugulinOxy] = useState("1");
  const [fugulinVitals, setFugulinVitals] = useState("1");
  const [fugulinMotility, setFugulinMotility] = useState("1");
  const [fugulinAmbulation, setFugulinAmbulation] = useState("1");
  const [fugulinFeeding, setFugulinFeeding] = useState("1");
  const [fugulinBodyCare, setFugulinBodyCare] = useState("1");
  const [fugulinElimination, setFugulinElimination] = useState("1");
  const [fugulinTherapy, setFugulinTherapy] = useState("1");

  const score =
    parseInt(fugulinMental) +
    parseInt(fugulinOxy) +
    parseInt(fugulinVitals) +
    parseInt(fugulinMotility) +
    parseInt(fugulinAmbulation) +
    parseInt(fugulinFeeding) +
    parseInt(fugulinBodyCare) +
    parseInt(fugulinElimination) +
    parseInt(fugulinTherapy);

  let riskClass = "Cuidados Mínimos";
  let recommendation =
    "Paciente estável clinica e hemodinamicamente, requerendo mínima supervisão. Observação de rotina.";
  let badgeColor = "bg-emerald-500 text-white";

  if (score >= 32) {
    riskClass = "Cuidados Intensivos";
    recommendation =
      "Paciente grave, sujeito a instabilidade severa ou risco iminente de morte. Requer assistência contínua e especializada de enfermagem (UTI ou Sala Vermelha).";
    badgeColor = "bg-rose-600 animate-pulse text-white";
  } else if (score >= 27) {
    riskClass = "Cuidados Semi-intensivos";
    recommendation =
      "Paciente grave, recuperável, com risco iminente de instabilidade. Requer assistência de enfermagem contínua e monitorização intensiva.";
    badgeColor = "bg-orange-500 text-white";
  } else if (score >= 21) {
    riskClass = "Alta Dependência";
    recommendation =
      "Paciente crônico ou com estabilidade limítrofe. Requer assistência de enfermagem contínua para manutenção de vida/funções vitais.";
    badgeColor = "bg-amber-500 text-white";
  } else if (score >= 15) {
    riskClass = "Cuidados Intermediários";
    recommendation =
      "Paciente estável, mas dependente para autocuidado ou com dependência parcial para necessidades básicas.";
    badgeColor = "bg-yellow-500 text-white";
  }

  const handleClear = () => {
    setFugulinMental("1");
    setFugulinOxy("1");
    setFugulinVitals("1");
    setFugulinMotility("1");
    setFugulinAmbulation("1");
    setFugulinFeeding("1");
    setFugulinBodyCare("1");
    setFugulinElimination("1");
    setFugulinTherapy("1");
    toast.info("Campos da calculadora limpos.");
  };

  const handleConfirm = () => {
    const descText = `- GRAU DE DEPENDÊNCIA (FUGULIN): ${score} pontos — ${riskClass.toUpperCase()}.\n  Avaliação: ${recommendation}`;
    const abbrevClass = riskClass.split(" ")[1] || riskClass.split(" ")[0];
    onApply(descText, `Fugulin: ${score} pts (${abbrevClass})`);
    onClose(false);
    toast.success("Escore de Fugulin integrado com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Activity className="h-6 w-6 text-cyan-500 animate-pulse" />
            Escalas de Avaliação de Enfermagem
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Sistematização da Assistência e Grau de Dependência
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
          {/* Coluna Esquerda: Menu Vertical */}
          <div className="md:col-span-4 space-y-3 border-r border-border/60 pr-4">
            <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1.5 mb-2">
              <span>Escalas de Enfermagem</span>
            </Label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setActiveNursingTab("fugulin")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeNursingTab === "fugulin"
                    ? "bg-cyan-500/10 border-cyan-500"
                    : "bg-card border-border hover:border-cyan-400/50"
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeNursingTab === "fugulin" ? "bg-cyan-500 text-white" : "bg-cyan-500/15 text-cyan-500"
                    )}
                  >
                    <span>📋</span>
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeNursingTab === "fugulin" ? "text-cyan-600" : "text-foreground/80"
                    )}
                  >
                    Fugulin
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Grau de Dependência do Paciente
                </p>
              </button>
            </div>
          </div>

          {/* Coluna Direita: Formulários */}
          <div className="md:col-span-8 flex flex-col min-h-[400px]">
            {activeNursingTab === "fugulin" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <Label className="text-xs font-black uppercase text-foreground/80">
                  Escala de Fugulin — Carga de Trabalho em Enfermagem
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Classifique as áreas de necessidade básica do paciente. Usado para dimensionamento e planejamento da
                  assistência de enfermagem.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 pb-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Estado Mental</Label>
                    <Select value={fugulinMental} onValueChange={setFugulinMental}>
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1">Lúcido, Orientado no Tempo/Espaço (1)</SelectItem>
                        <SelectItem value="2">Períodos de Desorientação/Confusão (2)</SelectItem>
                        <SelectItem value="3">Inconsciente / Sem resposta a dor (3)</SelectItem>
                        <SelectItem value="4">Coma / Avaliação Neurológica Frequente (4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Oxigenação</Label>
                    <Select value={fugulinOxy} onValueChange={setFugulinOxy}>
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1">Não depende de O2 / Ar ambiente (1)</SelectItem>
                        <SelectItem value="2">Uso Intermitente de O2 (Máscara/Cateter) (2)</SelectItem>
                        <SelectItem value="3">Uso Contínuo de O2 (3)</SelectItem>
                        <SelectItem value="4">Ventilação Mecânica (Tubo/Traqueo) (4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Sinais Vitais</Label>
                    <Select value={fugulinVitals} onValueChange={setFugulinVitals}>
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1">Rotina / A cada 12h ou 24h (1)</SelectItem>
                        <SelectItem value="2">A cada 6 horas (2)</SelectItem>
                        <SelectItem value="3">A cada 4 horas (3)</SelectItem>
                        <SelectItem value="4">A cada 2 horas ou Monitorização Contínua (4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Motilidade</Label>
                    <Select value={fugulinMotility} onValueChange={setFugulinMotility}>
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1">Move todos os membros livremente (1)</SelectItem>
                        <SelectItem value="2">Limitação de movimentos / Dor (2)</SelectItem>
                        <SelectItem value="3">Dificuldade de mobilização (Paresia/Plegia) (3)</SelectItem>
                        <SelectItem value="4">Imóvel (Não movimenta ou Coma) (4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Deambulação</Label>
                    <Select value={fugulinAmbulation} onValueChange={setFugulinAmbulation}>
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1">Ambulante (Caminha sem auxílio) (1)</SelectItem>
                        <SelectItem value="2">Necessita de auxílio (Andador, muleta, apoio) (2)</SelectItem>
                        <SelectItem value="3">Uso de Cadeira de Rodas (3)</SelectItem>
                        <SelectItem value="4">Restrito ao leito / Acamado (4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Alimentação</Label>
                    <Select value={fugulinFeeding} onValueChange={setFugulinFeeding}>
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1">Alimenta-se sozinho / Independente (1)</SelectItem>
                        <SelectItem value="2">Necessita de auxílio para se alimentar (2)</SelectItem>
                        <SelectItem value="3">Uso de Sonda (SNE/SNG) (3)</SelectItem>
                        <SelectItem value="4">Nutrição Parenteral Total (NPT) ou Jejum estrito (4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Cuidado Corporal</Label>
                    <Select value={fugulinBodyCare} onValueChange={setFugulinBodyCare}>
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1">Banho de chuveiro sozinho (1)</SelectItem>
                        <SelectItem value="2">Banho de chuveiro com auxílio da enfermagem (2)</SelectItem>
                        <SelectItem value="3">Banho no leito com supervisão ou auxílio parcial (3)</SelectItem>
                        <SelectItem value="4">Banho no leito realizado 100% pela equipe (4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Eliminação</Label>
                    <Select value={fugulinElimination} onValueChange={setFugulinElimination}>
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1">Usa o banheiro sozinho (1)</SelectItem>
                        <SelectItem value="2">Uso de comadre/papagaio com auxílio (2)</SelectItem>
                        <SelectItem value="3">Uso de fraldas / Evacua no leito (3)</SelectItem>
                        <SelectItem value="4">Sonda Vesical de Demora e Fraldas ou SVD/Ostomias (4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Terapêutica / Medicamentos
                    </Label>
                    <Select value={fugulinTherapy} onValueChange={setFugulinTherapy}>
                      <SelectTrigger className="h-9 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1">Uso de medicações IM, SC, VO ou Inalatório (1)</SelectItem>
                        <SelectItem value="2">Acesso Venoso Periférico Intermitente (2)</SelectItem>
                        <SelectItem value="3">Acesso Venoso com Infusão Contínua (3)</SelectItem>
                        <SelectItem value="4">Drogas Vasoativas / Sangue e Hemoderivados / CVC (4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                        Escore de Fugulin
                      </p>
                      <p className="text-3xl font-black">
                        {score} <span className="text-sm font-bold text-muted-foreground">pts</span>
                      </p>
                    </div>
                    <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", badgeColor)}>
                      {riskClass}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{recommendation}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClear}
                      className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                    >
                      Limpar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleConfirm}
                      className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      Confirmar e Aplicar ao Prontuário
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
