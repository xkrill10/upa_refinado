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
import { Brain, ShieldAlert, Activity, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MentalModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function MentalModal({ isOpen, onClose, onApply }: MentalModalProps) {
  const [activeMentalTab, setActiveMentalTab] = useState("rass");

  // RASS
  const [rassVal, setRassVal] = useState("0");

  // SAD PERSONS
  const [sadSex, setSadSex] = useState("no");
  const [sadAge, setSadAge] = useState("no");
  const [sadDepression, setSadDepression] = useState("no");
  const [sadPrevAttempt, setSadPrevAttempt] = useState("no");
  const [sadEthanol, setSadEthanol] = useState("no");
  const [sadRationalLoss, setSadRationalLoss] = useState("no");
  const [sadSocialSupport, setSadSocialSupport] = useState("no");
  const [sadOrganizedPlan, setSadOrganizedPlan] = useState("no");
  const [sadNoSpouse, setSadNoSpouse] = useState("no");
  const [sadSickness, setSadSickness] = useState("no");

  // CIWA-Ar
  const [ciwaNausea, setCiwaNausea] = useState("0");
  const [ciwaTremor, setCiwaTremor] = useState("0");
  const [ciwaSweat, setCiwaSweat] = useState("0");
  const [ciwaAnxiety, setCiwaAnxiety] = useState("0");
  const [ciwaAgitation, setCiwaAgitation] = useState("0");
  const [ciwaTactile, setCiwaTactile] = useState("0");
  const [ciwaAuditory, setCiwaAuditory] = useState("0");
  const [ciwaVisual, setCiwaVisual] = useState("0");
  const [ciwaHeadache, setCiwaHeadache] = useState("0");
  const [ciwaOrientation, setCiwaOrientation] = useState("0");

  // CAGE
  const [cageCut, setCageCut] = useState("no");
  const [cageAnnoyed, setCageAnnoyed] = useState("no");
  const [cageGuilty, setCageGuilty] = useState("no");
  const [cageEyeOpener, setCageEyeOpener] = useState("no");

  // PHQ-9
  const [phq1, setPhq1] = useState("0");
  const [phq2, setPhq2] = useState("0");
  const [phq3, setPhq3] = useState("0");
  const [phq4, setPhq4] = useState("0");
  const [phq5, setPhq5] = useState("0");
  const [phq6, setPhq6] = useState("0");
  const [phq7, setPhq7] = useState("0");
  const [phq8, setPhq8] = useState("0");
  const [phq9, setPhq9] = useState("0");

  // GAD-7
  const [gad1, setGad1] = useState("0");
  const [gad2, setGad2] = useState("0");
  const [gad3, setGad3] = useState("0");
  const [gad4, setGad4] = useState("0");
  const [gad5, setGad5] = useState("0");
  const [gad6, setGad6] = useState("0");
  const [gad7, setGad7] = useState("0");

  // CAM
  const [camAcuteOnset, setCamAcuteOnset] = useState("no");
  const [camInattention, setCamInattention] = useState("no");
  const [camDisorganized, setCamDisorganized] = useState("no");
  const [camAlteredConsciousness, setCamAlteredConsciousness] = useState("no");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] flex flex-col !p-0 overflow-hidden gap-0">
        {/* Cabeçalho atua como área de arrasto (drag handle) */}
        <div className="p-6 shrink-0 border-b border-border/50 bg-slate-50/30 dark:bg-slate-900/30 cursor-grab active:cursor-grabbing">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <Brain className="h-6 w-6 text-violet-500 animate-pulse" />
              Avaliação de Saúde Mental e Triagem Psiquiátrica
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Consolidação de Escalas Clínicas de Risco e Dependência Química
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Área de conteúdo isolada do evento de arrasto */}
        <div 
          className="flex-1 flex flex-col overflow-hidden"
          onPointerDown={(e) => e.stopPropagation()}
          style={{ touchAction: "pan-y" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 h-full min-h-0">
            {/* Coluna Esquerda: Menu Vertical */}
            <div className="md:col-span-4 space-y-3 border-r border-border/60 pr-4 overflow-y-auto custom-scrollbar pb-10">
              <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1.5 mb-2">
                <span>Escalas Clínicas</span>
              </Label>
              <div className="space-y-2">
              {/* RASS */}
              <button
                type="button"
                onClick={() => setActiveMentalTab("rass")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeMentalTab === "rass"
                    ? "bg-violet-500/10 border-violet-500"
                    : "bg-card border-border hover:border-violet-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "rass"
                        ? "bg-violet-500"
                        : "bg-violet-500/15",
                    )}
                  >
                    <Brain
                      className={cn(
                        "h-3.5 w-3.5",
                        activeMentalTab === "rass"
                          ? "text-white"
                          : "text-violet-500",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeMentalTab === "rass"
                        ? "text-violet-600"
                        : "text-foreground/80",
                    )}
                  >
                    RASS (Sedação)
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Richmond Agitation-Sedation Scale
                </p>
              </button>

              {/* SAD PERSONS */}
              <button
                type="button"
                onClick={() => setActiveMentalTab("sad")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeMentalTab === "sad"
                    ? "bg-rose-500/10 border-rose-500"
                    : "bg-card border-border hover:border-rose-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "sad"
                        ? "bg-rose-500"
                        : "bg-rose-500/15",
                    )}
                  >
                    <ShieldAlert
                      className={cn(
                        "h-3.5 w-3.5",
                        activeMentalTab === "sad"
                          ? "text-white"
                          : "text-rose-500",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeMentalTab === "sad"
                        ? "text-rose-600"
                        : "text-foreground/80",
                    )}
                  >
                    SAD PERSONS
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Risco de Suicídio por fatores
                </p>
              </button>

              {/* CIWA-Ar */}
              <button
                type="button"
                onClick={() => setActiveMentalTab("ciwa")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeMentalTab === "ciwa"
                    ? "bg-amber-500/10 border-amber-500"
                    : "bg-card border-border hover:border-amber-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "ciwa"
                        ? "bg-amber-500"
                        : "bg-amber-500/15",
                    )}
                  >
                    <Activity
                      className={cn(
                        "h-3.5 w-3.5",
                        activeMentalTab === "ciwa"
                          ? "text-white"
                          : "text-amber-500",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeMentalTab === "ciwa"
                        ? "text-amber-600"
                        : "text-foreground/80",
                    )}
                  >
                    CIWA-Ar
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Abstinência Alcoólica Clínica
                </p>
              </button>

              {/* CAGE */}
              <button
                type="button"
                onClick={() => setActiveMentalTab("cage")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeMentalTab === "cage"
                    ? "bg-emerald-500/10 border-emerald-500"
                    : "bg-card border-border hover:border-emerald-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "cage"
                        ? "bg-emerald-500"
                        : "bg-emerald-500/15",
                    )}
                  >
                    <Heart
                      className={cn(
                        "h-3.5 w-3.5",
                        activeMentalTab === "cage"
                          ? "text-white"
                          : "text-emerald-500",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeMentalTab === "cage"
                        ? "text-emerald-600"
                        : "text-foreground/80",
                    )}
                  >
                    CAGE (Álcool)
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Rastreamento de Dependência
                </p>
              </button>

              {/* PHQ-9 */}
              <button
                type="button"
                onClick={() => setActiveMentalTab("phq9")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeMentalTab === "phq9"
                    ? "bg-blue-500/10 border-blue-500"
                    : "bg-card border-border hover:border-blue-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "phq9"
                        ? "bg-blue-500"
                        : "bg-blue-500/15",
                    )}
                  >
                    <Brain
                      className={cn(
                        "h-3.5 w-3.5",
                        activeMentalTab === "phq9"
                          ? "text-white"
                          : "text-blue-500",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeMentalTab === "phq9"
                        ? "text-blue-600"
                        : "text-foreground/80",
                    )}
                  >
                    PHQ-9
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Rastreamento de Depressão
                </p>
              </button>

              {/* GAD-7 */}
              <button
                type="button"
                onClick={() => setActiveMentalTab("gad7")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeMentalTab === "gad7"
                    ? "bg-teal-500/10 border-teal-500"
                    : "bg-card border-border hover:border-teal-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "gad7"
                        ? "bg-teal-500"
                        : "bg-teal-500/15",
                    )}
                  >
                    <Activity
                      className={cn(
                        "h-3.5 w-3.5",
                        activeMentalTab === "gad7"
                          ? "text-white"
                          : "text-teal-500",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeMentalTab === "gad7"
                        ? "text-teal-600"
                        : "text-foreground/80",
                    )}
                  >
                    GAD-7
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Rastreamento de Ansiedade
                </p>
              </button>

              {/* CAM */}
              <button
                type="button"
                onClick={() => setActiveMentalTab("cam")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeMentalTab === "cam"
                    ? "bg-orange-500/10 border-orange-500"
                    : "bg-card border-border hover:border-orange-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "cam"
                        ? "bg-orange-500"
                        : "bg-orange-500/15",
                    )}
                  >
                    <ShieldAlert
                      className={cn(
                        "h-3.5 w-3.5",
                        activeMentalTab === "cam"
                          ? "text-white"
                          : "text-orange-500",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeMentalTab === "cam"
                        ? "text-orange-600"
                        : "text-foreground/80",
                    )}
                  >
                    CAM
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Rastreamento de Delirium
                </p>
              </button>
            </div>
          </div>

          {/* Coluna Direita: Formulários */}
          <div className="md:col-span-8 flex flex-col overflow-y-auto custom-scrollbar pr-4 pb-10">
            {/* RASS Tab */}
            {activeMentalTab === "rass" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <Label className="text-xs font-black uppercase text-foreground/80">
                    Richmond Agitation-Sedation Scale (RASS)
                  </Label>
                  <Select value={rassVal} onValueChange={setRassVal}>
                    <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                      <SelectValue placeholder="Selecione o nível RASS..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="+4">
                        +4 - Combativo (Violento, perigo imediato para a equipe)
                      </SelectItem>
                      <SelectItem value="+3">
                        +3 - Muito agitado (Agressivo, tenta remover
                        tubos/cateteres)
                      </SelectItem>
                      <SelectItem value="+2">
                        +2 - Agitado (Movimentos frequentes sem propósito, briga
                        com ventilador)
                      </SelectItem>
                      <SelectItem value="+1">
                        +1 - Inquieto (Ansioso, movimentos discretos sem
                        agressividade)
                      </SelectItem>
                      <SelectItem value="0">0 - Alerta e calmo</SelectItem>
                      <SelectItem value="-1">
                        -1 - Sonolento (Desperta ao chamado verbal, contato
                        visual &gt; 10s)
                      </SelectItem>
                      <SelectItem value="-2">
                        -2 - Sedação leve (Desperta ao chamado verbal, contato
                        visual &lt; 10s)
                      </SelectItem>
                      <SelectItem value="-3">
                        -3 - Sedação moderada (Movimento ou abertura ocular ao
                        chamado, sem contato visual)
                      </SelectItem>
                      <SelectItem value="-4">
                        -4 - Sedação profunda (Sem resposta ao chamado, mas
                        responde a estímulo físico/dor)
                      </SelectItem>
                      <SelectItem value="-5">
                        -5 - Não responsivo (Sem resposta verbal ou física)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(() => {
                  const val = parseInt(rassVal);
                  let classification = "Alerta e calmo";
                  let levelColor = "bg-emerald-500 text-white";
                  let recommendation =
                    "Manter acompanhamento clínico de rotina.";

                  if (val > 0) {
                    levelColor = "bg-amber-500 text-white animate-pulse";
                    if (val === 4) {
                      classification = "Agitação Combativa (Violento/Perigoso)";
                      levelColor = "bg-red-600 text-white animate-pulse";
                      recommendation =
                        "PROTOCOLO DE AGITAÇÃO COMBATIVA! Garantir segurança da equipe e do paciente. Considerar contenção mecânica temporária supervisionada e sedação química imediata conforme prescrição médica. Acionar equipe de segurança se necessário.";
                    } else if (val === 3) {
                      classification =
                        "Muito Agitado (Agressivo/Tenta remover dispositivos)";
                      levelColor = "bg-red-500 text-white animate-pulse";
                      recommendation =
                        "Risco de auto-extubação ou perda de acessos. Oferecer ambiente tranquilo, rever medicação ansiolítica ou antipsicótica conforme prescrição. Vigilância contínua.";
                    } else if (val === 2) {
                      classification =
                        "Agitado (Luta contra ventilação/Movimentos desordenados)";
                      recommendation =
                        "Adequar plano de sedação ou ansiólise. Avaliar causas de dor ou desconforto físico. Monitorizar sinais de delirium.";
                    } else {
                      classification =
                        "Inquieto (Ansioso/Movimentos discretos)";
                      recommendation =
                        "Apoio verbal, reavaliação de queixas álgicas, acompanhamento próximo para evitar escalada de agitação.";
                    }
                  } else if (val < 0) {
                    if (val === -1) {
                      classification = "Sonolento (Contato visual &gt; 10s)";
                      levelColor = "bg-blue-500 text-white";
                      recommendation =
                        "Sedação adequada para a maioria dos pacientes em UTI. Continuar acompanhamento.";
                    } else if (val === -2) {
                      classification = "Sedação Leve (Contato visual &lt; 10s)";
                      levelColor = "bg-indigo-500 text-white";
                      recommendation =
                        "Sedação leve/moderada. Adequado dependendo do plano terapêutico.";
                    } else if (val === -3) {
                      classification = "Sedação Moderada (Sem contato visual)";
                      levelColor = "bg-purple-500 text-white";
                      recommendation =
                        "Sedação moderada. Avaliar necessidade de manter este nível. Realizar despertar diário se aplicável.";
                    } else if (val === -4) {
                      classification =
                        "Sedação Profunda (Apenas resposta física)";
                      levelColor = "bg-slate-700 text-white animate-pulse";
                      recommendation =
                        "Sedação profunda. Avaliar risco de depressão respiratória (se não intubado). Monitorar reflexos protetores de vias aéreas.";
                    } else {
                      classification =
                        "Não Responsivo (Coma Induzido/Profundo)";
                      levelColor = "bg-slate-900 text-white animate-pulse";
                      recommendation =
                        "Sem resposta a estímulos dolorosos. Monitorar parâmetros ventilatórios e hemodinâmicos. Realizar cuidados preventivos de LPP (Braden) e úlcera de córnea.";
                    }
                  }

                  return (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Escore RASS
                          </p>
                          <p className="text-3xl font-black text-foreground">
                            {rassVal}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            levelColor,
                          )}
                        >
                          {classification}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setRassVal("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-violet-500/40 hover:bg-violet-500/5 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- ESCALA DE AGITAÇÃO-SEDAÇÃO DE RICHMOND (RASS): ${rassVal} (${classification}).\n  Conduta sugerida: ${recommendation}`;
                            onApply(descText, `RASS: ${rassVal}`);
                            onClose(false);
                            toast.success(
                              "Resultado RASS integrado com sucesso!",
                            );
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* SAD PERSONS Tab */}
            {activeMentalTab === "sad" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      S - Sexo Masculino
                    </Label>
                    <Select
                      value={sadSex}
                      onValueChange={(sadSex) => setSadSex(sadSex)}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      A - Idade (&lt;19 ou &gt;45 anos)
                    </Label>
                    <Select
                      value={sadAge}
                      onValueChange={(sadAge) => setSadAge(sadAge)}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      D - Depressão ou Desespero
                    </Label>
                    <Select
                      value={sadDepression}
                      onValueChange={(sadDepression) =>
                        setSadDepression(sadDepression)
                      }
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      P - Tentativa Prévia de Suicídio
                    </Label>
                    <Select
                      value={sadPrevAttempt}
                      onValueChange={(sadPrev) => setSadPrevAttempt(sadPrev)}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      E - Abuso de Álcool/Etanol
                    </Label>
                    <Select
                      value={sadEthanol}
                      onValueChange={(sadEthanol) => setSadEthanol(sadEthanol)}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      R - Perda de Razão (Psicose)
                    </Label>
                    <Select
                      value={sadRationalLoss}
                      onValueChange={(sadRat) => setSadRationalLoss(sadRat)}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      S - Sem Suporte Social (Solitário)
                    </Label>
                    <Select
                      value={sadSocialSupport}
                      onValueChange={(sadSoc) => setSadSocialSupport(sadSoc)}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      O - Plano Organizado de Suicídio
                    </Label>
                    <Select
                      value={sadOrganizedPlan}
                      onValueChange={(sadOrg) => setSadOrganizedPlan(sadOrg)}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      N - Sem Cônjuge (Divorciado/Viúvo)
                    </Label>
                    <Select
                      value={sadNoSpouse}
                      onValueChange={(sadNo) => setSadNoSpouse(sadNo)}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      S - Doença Crônica/Grave (Sickness)
                    </Label>
                    <Select
                      value={sadSickness}
                      onValueChange={(sadSick) => setSadSickness(sadSick)}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  let score = 0;
                  if (sadSex === "yes") score++;
                  if (sadAge === "yes") score++;
                  if (sadDepression === "yes") score++;
                  if (sadPrevAttempt === "yes") score++;
                  if (sadEthanol === "yes") score++;
                  if (sadRationalLoss === "yes") score++;
                  if (sadSocialSupport === "yes") score++;
                  if (sadOrganizedPlan === "yes") score++;
                  if (sadNoSpouse === "yes") score++;
                  if (sadSickness === "yes") score++;

                  let riskClass = "Risco Baixo";
                  let riskColor = "bg-emerald-500 text-white";
                  let recommendation =
                    "Alta segura com acompanhamento ambulatorial ou em CAPS de referência. Orientar rede familiar e de apoio.";

                  if (score >= 7) {
                    riskClass = "Risco Muito Alto";
                    riskColor = "bg-red-600 text-white animate-pulse";
                    recommendation =
                      "INTERNAÇÃO PSIQUIÁTRICA IMEDIATA! Vigilância 1:1 rigorosa e ininterrupta da equipe de enfermagem. Retirar pertences perigosos (cordões, cintos, objetos cortantes, lençóis adicionais) e manter sob observação direta em leito de monitoração.";
                  } else if (score >= 5) {
                    riskClass = "Risco Alto";
                    riskColor = "bg-red-500 text-white animate-pulse";
                    recommendation =
                      "Forte indicação de internação / observação. Solicitar avaliação psiquiátrica de urgência. Manter vigilância constante da equipe de enfermagem e restrição de objetos de risco no leito.";
                  } else if (score >= 3) {
                    riskClass = "Risco Moderado";
                    riskColor = "bg-amber-500 text-white";
                    recommendation =
                      "Acompanhamento ambulatorial intensivo ou observação clínica no setor. Solicitar parecer de Saúde Mental/Psiquiatria ou agendamento prioritário em CAPS.";
                  }

                  return (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Pontuação SAD PERSONS
                          </p>
                          <p className="text-3xl font-black text-foreground">
                            {score}{" "}
                            <span className="text-sm font-bold text-muted-foreground">
                              / 10 pts
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            riskColor,
                          )}
                        >
                          {riskClass}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setSadSex("no");
                            setSadAge("no");
                            setSadDepression("no");
                            setSadPrevAttempt("no");
                            setSadEthanol("no");
                            setSadRationalLoss("no");
                            setSadSocialSupport("no");
                            setSadOrganizedPlan("no");
                            setSadNoSpouse("no");
                            setSadSickness("no");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-rose-500/40 hover:bg-rose-500/5 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const itemsList = [];
                            if (sadSex === "yes")
                              itemsList.push("Sexo Masculino");
                            if (sadAge === "yes")
                              itemsList.push("Idade extrema (<19 ou >45)");
                            if (sadDepression === "yes")
                              itemsList.push("Depressão/Desespero");
                            if (sadPrevAttempt === "yes")
                              itemsList.push("Tentativa prévia");
                            if (sadEthanol === "yes")
                              itemsList.push("Abuso de etanol");
                            if (sadRationalLoss === "yes")
                              itemsList.push("Perda da razão/Psicose");
                            if (sadSocialSupport === "yes")
                              itemsList.push("Sem suporte social");
                            if (sadOrganizedPlan === "yes")
                              itemsList.push("Plano organizado");
                            if (sadNoSpouse === "yes")
                              itemsList.push("Sem cônjuge");
                            if (sadSickness === "yes")
                              itemsList.push("Doença grave/crônica");

                            const itemsStr =
                              itemsList.length > 0
                                ? itemsList.join(", ")
                                : "Nenhum fator presente";
                            const descText =
                              `- ESCALA SAD PERSONS (RISCO DE SUICÍDIO): ${score}/10 pontos (${riskClass.toUpperCase()}).\n  ` +
                              `• Fatores Presentes: ${itemsStr}.\n  ` +
                              `Conduta sugerida: ${recommendation}`;
                            onApply(
                              descText,
                              `SAD: ${score} pts (${riskClass.split(" ")[1] || "Baixo"})`,
                            );
                            onClose(false);
                            toast.success(
                              "Escore SAD PERSONS integrado com sucesso!",
                            );
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* CIWA-Ar Tab */}
            {activeMentalTab === "ciwa" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      1. Náuseas e Vômitos
                    </Label>
                    <Select value={ciwaNausea} onValueChange={setCiwaNausea}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Ausente</SelectItem>
                        <SelectItem value="1">
                          1 - Náusea leve, sem vômitos
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Náusea intermitente com vômito seco
                        </SelectItem>
                        <SelectItem value="7">
                          7 - Náuseas constantes, vômitos frequentes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      2. Tremores (Mãos estendidas)
                    </Label>
                    <Select value={ciwaTremor} onValueChange={setCiwaTremor}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Ausente</SelectItem>
                        <SelectItem value="1">
                          1 - Sentido apenas nas pontas dos dedos
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Moderado com braços estendidos
                        </SelectItem>
                        <SelectItem value="7">
                          7 - Grave e constante, mesmo sem estender os braços
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      3. Sudorese Paroxística
                    </Label>
                    <Select value={ciwaSweat} onValueChange={setCiwaSweat}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Ausente</SelectItem>
                        <SelectItem value="1">
                          1 - Umidade palmar apenas perceptível
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Gotas de suor visíveis na testa
                        </SelectItem>
                        <SelectItem value="7">
                          7 - Sudorese profusa, ensopando roupas/lençóis
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      4. Ansiedade / Inquietude
                    </Label>
                    <Select value={ciwaAnxiety} onValueChange={setCiwaAnxiety}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Calmo, sem ansiedade
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Levemente tenso ou ansioso
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Moderadamente ansioso ou apreensivo
                        </SelectItem>
                        <SelectItem value="7">
                          7 - Pânico comparável a episódios psicóticos agudos
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      5. Agitação Psicomotora
                    </Label>
                    <Select
                      value={ciwaAgitation}
                      onValueChange={setCiwaAgitation}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Atividade normal</SelectItem>
                        <SelectItem value="1">
                          1 - Atividade levemente aumentada, se move muito
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Moderadamente inquieto, muda de posição
                          constantemente
                        </SelectItem>
                        <SelectItem value="7">
                          7 - Agitação severa, se debate, requer contenção
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      6. Alterações Tácteis (Coceira/Queimação)
                    </Label>
                    <Select value={ciwaTactile} onValueChange={setCiwaTactile}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Nenhuma</SelectItem>
                        <SelectItem value="1">
                          1 - Parestesia/formigamento leve
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Alucinações tácteis moderadas (sensação de
                          insetos)
                        </SelectItem>
                        <SelectItem value="7">
                          7 - Alucinações tácteis contínuas e graves
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      7. Alterações Auditivas
                    </Label>
                    <Select
                      value={ciwaAuditory}
                      onValueChange={setCiwaAuditory}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Ausente (Sensibilidade normal)
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Leve hipersensibilidade ou ruídos ásperos
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Alucinações auditivas moderadas
                        </SelectItem>
                        <SelectItem value="7">
                          7 - Alucinações auditivas graves e aterrorizantes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      8. Alterações Visuais
                    </Label>
                    <Select value={ciwaVisual} onValueChange={setCiwaVisual}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Ausente (Sensibilidade normal)
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Leve sensibilidade à luz
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Alucinações visuais moderadas (vê vultos)
                        </SelectItem>
                        <SelectItem value="7">
                          7 - Alucinações visuais contínuas e aterrorizantes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      9. Cefaleia / Sensação de Aperto
                    </Label>
                    <Select
                      value={ciwaHeadache}
                      onValueChange={setCiwaHeadache}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Sem cefaleia</SelectItem>
                        <SelectItem value="1">
                          1 - Cefaleia muito leve
                        </SelectItem>
                        <SelectItem value="4">4 - Cefaleia moderada</SelectItem>
                        <SelectItem value="7">
                          7 - Cefaleia severa e incapacitante
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      10. Orientação e Sensório
                    </Label>
                    <Select
                      value={ciwaOrientation}
                      onValueChange={setCiwaOrientation}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Totalmente orientado no tempo e espaço
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Desorientação temporal leve (incerto sobre o dia)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Desorientação temporal grave (errada por &gt; 2
                          dias)
                        </SelectItem>
                        <SelectItem value="3">
                          3 - Desorientado no espaço e/ou em relação a pessoas
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Totalmente desorientado ou não cooperativo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  const score =
                    (parseInt(ciwaNausea) || 0) +
                    (parseInt(ciwaTremor) || 0) +
                    (parseInt(ciwaSweat) || 0) +
                    (parseInt(ciwaAnxiety) || 0) +
                    (parseInt(ciwaAgitation) || 0) +
                    (parseInt(ciwaTactile) || 0) +
                    (parseInt(ciwaAuditory) || 0) +
                    (parseInt(ciwaVisual) || 0) +
                    (parseInt(ciwaHeadache) || 0) +
                    (parseInt(ciwaOrientation) || 0);

                  let severityClass = "Abstinência Leve";
                  let severityColor = "bg-emerald-500 text-white";
                  let recommendation =
                    "Baixo risco de complicações imediatas. Manter monitoramento clínico geral. Não requer benzodiazepínicos de rotina.";

                  if (score > 15) {
                    severityClass = "Abstinência Grave / Delirium Tremens";
                    severityColor = "bg-red-500 text-white animate-pulse";
                    recommendation =
                      "ALERTA CRÍTICO! Alto risco de convulsões e Delirium Tremens. Monitorização contínua na Sala Vermelha. Iniciar Diazepam (ou Lorazepam se insuficiência hepática) conforme protocolo institucional e monitorização rígida de sinais vitais.";
                  } else if (score >= 8) {
                    severityClass = "Abstinência Moderada";
                    severityColor = "bg-amber-500 text-white";
                    recommendation =
                      "Indicação de farmacoterapia profilática com benzodiazepínicos (ex: Diazepam 10mg VO/EV de hora em hora até estabilização do escore CIWA < 8). Reavaliar escore a cada 1-2 horas.";
                  }

                  return (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Pontuação CIWA-Ar
                          </p>
                          <p className="text-3xl font-black text-foreground">
                            {score}{" "}
                            <span className="text-sm font-bold text-muted-foreground">
                              / 67 pts
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            severityColor,
                          )}
                        >
                          {severityClass}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setCiwaNausea("0");
                            setCiwaTremor("0");
                            setCiwaSweat("0");
                            setCiwaAnxiety("0");
                            setCiwaAgitation("0");
                            setCiwaTactile("0");
                            setCiwaAuditory("0");
                            setCiwaVisual("0");
                            setCiwaHeadache("0");
                            setCiwaOrientation("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- PROTOCOLO DE ABSTINÊNCIA CIWA-Ar: ${score} pontos (${severityClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            onApply(
                              descText,
                              `CIWA: ${score} pts (${score > 15 ? "Grave" : score >= 8 ? "Mod" : "Leve"})`,
                            );
                            onClose(false);
                            toast.success(
                              "Escore CIWA-Ar integrado com sucesso!",
                            );
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* CAGE Tab */}
            {activeMentalTab === "cage" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-black uppercase text-foreground/80">
                      1. C - Já sentiu necessidade de diminuir (Cut down) o
                      consumo de álcool?
                    </Label>
                    <Select value={cageCut} onValueChange={setCageCut}>
                      <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-black uppercase text-foreground/80">
                      2. A - As pessoas já o irritaram (Annoyed) ao criticar seu
                      hábito de beber?
                    </Label>
                    <Select value={cageAnnoyed} onValueChange={setCageAnnoyed}>
                      <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-black uppercase text-foreground/80">
                      3. G - Já se sentiu culpado (Guilty) pela maneira como
                      costuma beber?
                    </Label>
                    <Select value={cageGuilty} onValueChange={setCageGuilty}>
                      <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-black uppercase text-foreground/80">
                      4. E - Já precisou beber logo pela manhã para acalmar os
                      nervos ou combater ressaca (Eye-opener)?
                    </Label>
                    <Select
                      value={cageEyeOpener}
                      onValueChange={setCageEyeOpener}
                    >
                      <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  let score = 0;
                  if (cageCut === "yes") score++;
                  if (cageAnnoyed === "yes") score++;
                  if (cageGuilty === "yes") score++;
                  if (cageEyeOpener === "yes") score++;

                  let riskClass = "Baixo Risco de Dependência";
                  let riskColor = "bg-emerald-500 text-white";
                  let recommendation =
                    "Paciente com triagem negativa para alcoolismo. Orientações preventivas de saúde geral.";

                  if (score >= 2) {
                    riskClass = "Triagem Positiva / Risco de Alcoolismo";
                    riskColor = "bg-amber-500 text-white font-bold";
                    recommendation =
                      "Sugestão de dependência de álcool (escore CAGE >= 2). Indicação de avaliação diagnóstica aprofundada, intervenção breve e encaminhamento para CAPS-AD ou grupo de apoio especializado.";
                  }

                  return (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Pontuação CAGE
                          </p>
                          <p className="text-3xl font-black text-foreground">
                            {score}{" "}
                            <span className="text-sm font-bold text-muted-foreground">
                              / 4 pts
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            riskColor,
                          )}
                        >
                          {riskClass}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setCageCut("no");
                            setCageAnnoyed("no");
                            setCageGuilty("no");
                            setCageEyeOpener("no");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-yellow-500/40 hover:bg-yellow-500/5 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- TRIAGEM DE ALCOOLISMO CAGE: ${score}/4 pontos (${riskClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            onApply(
                              descText,
                              `CAGE: ${score}/4 (${score >= 2 ? "Positivo" : "Negativo"})`,
                            );
                            onClose(false);
                            toast.success("Escore CAGE integrado com sucesso!");
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* PHQ-9 Tab */}
            {activeMentalTab === "phq9" &&
              (() => {
                const phqLabels = [
                  "1. Pouco interesse ou prazer em fazer as coisas",
                  "2. Sentir-se triste, deprimido(a) ou sem esperança",
                  "3. Dificuldade para adormecer, manter o sono ou dormir demais",
                  "4. Sentir-se cansado(a) ou com pouca energia",
                  "5. Apetite diminuído ou exagerado",
                  "6. Sentir-se mal consigo mesmo(a) ou que é um fracasso",
                  "7. Dificuldade de se concentrar (ler, assistir TV etc.)",
                  "8. Lentidão ou agitação perceptível pelos outros",
                  "9. Pensamentos de se machucar ou que seria melhor estar morto(a)",
                ];
                const phqVals = [
                  phq1,
                  phq2,
                  phq3,
                  phq4,
                  phq5,
                  phq6,
                  phq7,
                  phq8,
                  phq9,
                ];
                const phqSetters = [
                  setPhq1,
                  setPhq2,
                  setPhq3,
                  setPhq4,
                  setPhq5,
                  setPhq6,
                  setPhq7,
                  setPhq8,
                  setPhq9,
                ];
                const score = phqVals.reduce((s, v) => s + parseInt(v), 0);
                let severity = "Mínima / Sem Depressão";
                let sevColor = "bg-emerald-500 text-white";
                let recommendation =
                  "Sem indicação de tratamento farmacológico. Orientações de estilo de vida e reavaliação em 3 meses.";
                if (score >= 20) {
                  severity = "Depressão Grave";
                  sevColor = "bg-red-600 text-white animate-pulse";
                  recommendation =
                    "Tratamento intensivo com antidepressivo e/ou psicoterapia. Avaliar internação psiquiátrica. Rastrear risco de suicídio (SAD PERSONS).";
                } else if (score >= 15) {
                  severity = "Depressão Moderada-Grave";
                  sevColor = "bg-red-500 text-white animate-pulse";
                  recommendation =
                    "Iniciar antidepressivo + encaminhamento para psiquiatria. Reavaliação em 2 semanas.";
                } else if (score >= 10) {
                  severity = "Depressão Moderada";
                  sevColor = "bg-amber-500 text-white";
                  recommendation =
                    "Considerar antidepressivo e/ou psicoterapia. Encaminhamento para saúde mental. Reavaliação em 4 semanas.";
                } else if (score >= 5) {
                  severity = "Depressão Leve";
                  sevColor = "bg-yellow-500 text-white";
                  recommendation =
                    "Monitoramento em atenção primária, orientações, suporte psicossocial e reavaliação em 4-6 semanas.";
                }
                return (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <Label className="text-xs font-black uppercase text-foreground/80">
                      PHQ-9 — Patient Health Questionnaire
                    </Label>
                    <p className="text-[10px] text-muted-foreground">
                      Nas últimas 2 semanas, com que frequência você foi
                      incomodado(a) pelos seguintes problemas?
                    </p>
                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                      {phqLabels.map((label, i) => (
                        <div key={i} className="space-y-0.5">
                          <Label className="text-[10px] font-bold text-foreground/80">
                            {label}
                          </Label>
                          <Select
                            value={phqVals[i]}
                            onValueChange={phqSetters[i]}
                          >
                            <SelectTrigger className="h-8 rounded-xl text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="0">Nenhuma vez (0)</SelectItem>
                              <SelectItem value="1">Vários dias (1)</SelectItem>
                              <SelectItem value="2">
                                Mais da metade dos dias (2)
                              </SelectItem>
                              <SelectItem value="3">
                                Quase todos os dias (3)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Escore PHQ-9
                          </p>
                          <p className="text-3xl font-black">
                            {score}{" "}
                            <span className="text-sm font-bold text-muted-foreground">
                              / 27 pts
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            sevColor,
                          )}
                        >
                          {severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setPhq1("0");
                            setPhq2("0");
                            setPhq3("0");
                            setPhq4("0");
                            setPhq5("0");
                            setPhq6("0");
                            setPhq7("0");
                            setPhq8("0");
                            setPhq9("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-10 px-4 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- PHQ-9 (DEPRESSÃO): ${score}/27 pts (${severity.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            onApply(
                              descText,
                              `PHQ-9: ${score} pts (${severity.split(" ")[0]})`,
                            );
                            onClose(false);
                            toast.success("PHQ-9 integrado com sucesso!");
                          }}
                          className="flex-1 h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}

            {/* GAD-7 Tab */}
            {activeMentalTab === "gad7" &&
              (() => {
                const gadLabels = [
                  "1. Sentir-se nervoso(a), ansioso(a) ou no limite",
                  "2. Não conseguir parar ou controlar a preocupação",
                  "3. Preocupar-se demais com coisas diferentes",
                  "4. Dificuldade de relaxar",
                  "5. Ficar tão agitado(a) que é difícil ficar quieto(a)",
                  "6. Ficar facilmente irritado(a) ou aborrecido(a)",
                  "7. Sentir medo como se algo terrível pudesse acontecer",
                ];
                const gadVals = [gad1, gad2, gad3, gad4, gad5, gad6, gad7];
                const gadSetters = [
                  setGad1,
                  setGad2,
                  setGad3,
                  setGad4,
                  setGad5,
                  setGad6,
                  setGad7,
                ];
                const score = gadVals.reduce((s, v) => s + parseInt(v), 0);
                let severity = "Ansiedade Mínima";
                let sevColor = "bg-emerald-500 text-white";
                let recommendation =
                  "Sem indicação de tratamento farmacológico. Orientações de controle de estresse e higiene do sono.";
                if (score >= 15) {
                  severity = "Ansiedade Grave";
                  sevColor = "bg-red-600 text-white animate-pulse";
                  recommendation =
                    "Encaminhamento urgente para psiquiatria. Considerar ansiolítico de curto prazo e/ou antidepressivo ISRS. Rastrear risco de suicídio.";
                } else if (score >= 10) {
                  severity = "Ansiedade Moderada";
                  sevColor = "bg-amber-500 text-white";
                  recommendation =
                    "Encaminhamento para saúde mental, psicoterapia cognitivo-comportamental (TCC) e/ou ISRS. Reavaliação em 4 semanas.";
                } else if (score >= 5) {
                  severity = "Ansiedade Leve";
                  sevColor = "bg-yellow-500 text-white";
                  recommendation =
                    "Monitoramento, técnicas de relaxamento, atividade física regular e reavaliação em 4-6 semanas.";
                }
                return (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <Label className="text-xs font-black uppercase text-foreground/80">
                      GAD-7 — Generalized Anxiety Disorder Scale
                    </Label>
                    <p className="text-[10px] text-muted-foreground">
                      Nas últimas 2 semanas, com que frequência você foi
                      incomodado(a) pelos seguintes problemas?
                    </p>
                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                      {gadLabels.map((label, i) => (
                        <div key={i} className="space-y-0.5">
                          <Label className="text-[10px] font-bold text-foreground/80">
                            {label}
                          </Label>
                          <Select
                            value={gadVals[i]}
                            onValueChange={gadSetters[i]}
                          >
                            <SelectTrigger className="h-8 rounded-xl text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="0">Nenhuma vez (0)</SelectItem>
                              <SelectItem value="1">Vários dias (1)</SelectItem>
                              <SelectItem value="2">
                                Mais da metade dos dias (2)
                              </SelectItem>
                              <SelectItem value="3">
                                Quase todos os dias (3)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Escore GAD-7
                          </p>
                          <p className="text-3xl font-black">
                            {score}{" "}
                            <span className="text-sm font-bold text-muted-foreground">
                              / 21 pts
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            sevColor,
                          )}
                        >
                          {severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setGad1("0");
                            setGad2("0");
                            setGad3("0");
                            setGad4("0");
                            setGad5("0");
                            setGad6("0");
                            setGad7("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-10 px-4 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-teal-500/40 hover:bg-teal-500/5 hover:text-teal-600 dark:hover:text-teal-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- GAD-7 (ANSIEDADE): ${score}/21 pts (${severity.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            onApply(
                              descText,
                              `GAD-7: ${score} pts (${severity.split(" ")[1] || "Mín"})`,
                            );
                            onClose(false);
                            toast.success("GAD-7 integrado com sucesso!");
                          }}
                          className="flex-1 h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-teal-600 hover:bg-teal-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}

            {/* CAM Tab */}
            {activeMentalTab === "cam" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <Label className="text-xs font-black uppercase text-foreground/80">
                  CAM — Confusion Assessment Method
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Método de triagem rápida para Delirium. Os critérios 1 e 2 são
                  obrigatórios. O diagnóstico exige (1+2) + (3 ou 4).
                </p>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      🔑 Critério 1 (OBRIGATÓRIO) — Início Agudo e Flutuante
                    </Label>
                    <p className="text-[10px] text-muted-foreground mb-1">
                      Houve mudança aguda no estado mental em relação ao basal?
                      O comportamento flutua ao longo do dia?
                    </p>
                    <Select
                      value={camAcuteOnset}
                      onValueChange={setCamAcuteOnset}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não / Incerto</SelectItem>
                        <SelectItem value="yes">Sim — Presente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      🔑 Critério 2 (OBRIGATÓRIO) — Desatenção
                    </Label>
                    <p className="text-[10px] text-muted-foreground mb-1">
                      O paciente tem dificuldade de manter a atenção? Facilmente
                      distraído? Perde o fio da meada?
                    </p>
                    <Select
                      value={camInattention}
                      onValueChange={setCamInattention}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não / Incerto</SelectItem>
                        <SelectItem value="yes">Sim — Presente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Critério 3 — Pensamento Desorganizado
                    </Label>
                    <p className="text-[10px] text-muted-foreground mb-1">
                      Discurso incoerente, pensamento ilógico ou muda de assunto
                      de forma imprevisível?
                    </p>
                    <Select
                      value={camDisorganized}
                      onValueChange={setCamDisorganized}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não / Incerto</SelectItem>
                        <SelectItem value="yes">Sim — Presente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Critério 4 — Alteração do Nível de Consciência
                    </Label>
                    <p className="text-[10px] text-muted-foreground mb-1">
                      O nível de consciência está alterado (agitado, letárgico,
                      estupor ou coma)?
                    </p>
                    <Select
                      value={camAlteredConsciousness}
                      onValueChange={setCamAlteredConsciousness}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">
                          Não — Alerta e normal
                        </SelectItem>
                        <SelectItem value="yes">Sim — Alterado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {(() => {
                  const hasBase =
                    camAcuteOnset === "yes" && camInattention === "yes";
                  const hasThird =
                    camDisorganized === "yes" ||
                    camAlteredConsciousness === "yes";
                  const positiveCAM = hasBase && hasThird;
                  const recommendation = positiveCAM
                    ? "DELIRIUM CONFIRMADO! Identificar e tratar a causa base (infecção, hipóxia, dor, retenção urinária, fármacos, distúrbio metabólico). Reorientar paciente frequentemente (data, local, equipe). Evitar contenção física e benzodiazepínicos. Manter ciclo sono-vigília. Acionar equipe médica para avaliação e investigação."
                    : !hasBase
                      ? "Critérios obrigatórios (1 e 2) não preenchidos. Delirium improvável. Continuar monitoramento de rotina."
                      : "Critérios 1 e 2 presentes, mas nenhum dos complementares (3 ou 4). Delirium improvável — monitorar.";
                  return (
                    <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Resultado CAM
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            positiveCAM
                              ? "bg-red-600 text-white animate-pulse"
                              : "bg-emerald-500 text-white",
                          )}
                        >
                          {positiveCAM
                            ? "⚠️ DELIRIUM POSITIVO"
                            : "Delirium Negativo"}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {recommendation}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setCamAcuteOnset("no");
                            setCamInattention("no");
                            setCamDisorganized("no");
                            setCamAlteredConsciousness("no");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-10 px-4 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- CAM (DELIRIUM): ${positiveCAM ? "POSITIVO" : "NEGATIVO"}.\n  Conduta: ${recommendation}`;
                            onApply(
                              descText,
                              `CAM: ${positiveCAM ? "DELIRIUM +" : "Negativo"}`,
                            );
                            onClose(false);
                            toast.success(
                              "Avaliação CAM integrada com sucesso!",
                            );
                          }}
                          className="flex-1 h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
