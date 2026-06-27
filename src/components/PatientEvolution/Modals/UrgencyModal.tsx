import React, { useState } from "react";
import {
  Dialog,
  DialogDragHandle, DialogContent,
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
import { ShieldAlert, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UrgencyModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function UrgencyModal({ isOpen, onClose, onApply }: UrgencyModalProps) {
  const [activeUrgencyTab, setActiveUrgencyTab] = useState("heart");

  // HEART
  const [heartHistory, setHeartHistory] = useState("0");
  const [heartEcg, setHeartEcg] = useState("0");
  const [heartAge, setHeartAge] = useState("0");
  const [heartRisk, setHeartRisk] = useState("0");
  const [heartTroponin, setHeartTroponin] = useState("0");

  // NIHSS
  const [nihLoc, setNihLoc] = useState("0");
  const [nihQuestions, setNihQuestions] = useState("0");
  const [nihCommands, setNihCommands] = useState("0");
  const [nihGaze, setNihGaze] = useState("0");
  const [nihVisual, setNihVisual] = useState("0");
  const [nihFacial, setNihFacial] = useState("0");
  const [nihArmL, setNihArmL] = useState("0");
  const [nihArmR, setNihArmR] = useState("0");
  const [nihLegL, setNihLegL] = useState("0");
  const [nihLegR, setNihLegR] = useState("0");
  const [nihAtaxia, setNihAtaxia] = useState("0");
  const [nihSensory, setNihSensory] = useState("0");
  const [nihLanguage, setNihLanguage] = useState("0");
  const [nihDysarthria, setNihDysarthria] = useState("0");
  const [nihNeglect, setNihNeglect] = useState("0");

  // CRB-65
  const [crbConfusion, setCrbConfusion] = useState("0");
  const [crbRate, setCrbRate] = useState("0");
  const [crbBp, setCrbBp] = useState("0");
  const [crbAge, setCrbAge] = useState("0");

  // Wells (TEP)
  const [wellsTvp, setWellsTvp] = useState("0");
  const [wellsAlternative, setWellsAlternative] = useState("0");
  const [wellsHr, setWellsHr] = useState("0");
  const [wellsImmobility, setWellsImmobility] = useState("0");
  const [wellsPrev, setWellsPrev] = useState("0");
  const [wellsHemoptysis, setWellsHemoptysis] = useState("0");
  const [wellsCancer, setWellsCancer] = useState("0");

  // Alvarado
  const [alvaradoMigration, setAlvaradoMigration] = useState("0");
  const [alvaradoAnorexia, setAlvaradoAnorexia] = useState("0");
  const [alvaradoNausea, setAlvaradoNausea] = useState("0");
  const [alvaradoTenderness, setAlvaradoTenderness] = useState("0");
  const [alvaradoRebound, setAlvaradoRebound] = useState("0");
  const [alvaradoFever, setAlvaradoFever] = useState("0");
  const [alvaradoLeukocytosis, setAlvaradoLeukocytosis] = useState("0");
  const [alvaradoShift, setAlvaradoShift] = useState("0");

  // GRACE (SCA)
  const [graceAge, setGraceAge] = useState("0");
  const [graceHr, setGraceHr] = useState("0");
  const [graceSbp, setGraceSbp] = useState("0");
  const [graceCreatinine, setGraceCreatinine] = useState("0");
  const [graceKillip, setGraceKillip] = useState("0");
  const [graceCardiacArrest, setGraceCardiacArrest] = useState("0");
  const [graceStDeviation, setGraceStDeviation] = useState("0");
  const [graceEnzymes, setGraceEnzymes] = useState("0");

  // Ranson (Pancreatite)
  const [ransonAge, setRansonAge] = useState("0");
  const [ransonWbc, setRansonWbc] = useState("0");
  const [ransonGlucose, setRansonGlucose] = useState("0");
  const [ransonLdh, setRansonLdh] = useState("0");
  const [ransonAst, setRansonAst] = useState("0");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] flex flex-col !p-0 overflow-hidden gap-0">
        {/* Cabeçalho atua como área de arrasto (drag handle) */}
        <DialogDragHandle className="p-6 shrink-0 border-b border-border/50 bg-slate-50/30 dark:bg-slate-900/30">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-rose-500 animate-pulse" />
              Central de Urgências Clínicas e Triagem Rápida
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Calculadoras Clínicas de Emergência, AVC, Pneumonia, TEP e Apendicite
            </DialogDescription>
          </DialogHeader>
        </DialogDragHandle>

        {/* Área de conteúdo isolada do evento de arrasto */}
        <div 
          className="flex-1 flex flex-col overflow-hidden"
          onPointerDown={(e) => e.stopPropagation()}
          style={{ touchAction: "pan-y" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 h-full min-h-0">
            {/* Coluna Esquerda: Menu Vertical */}
            <div className="md:col-span-4 space-y-3 border-r border-border/60 pr-4 overflow-y-auto custom-scrollbar overscroll-contain pb-10">
              <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1.5 mb-2">
                <span>Calculadoras Clínicas</span>
              </Label>
              <div className="space-y-2">
              {/* HEART */}
              <button
                type="button"
                onClick={() => setActiveUrgencyTab("heart")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeUrgencyTab === "heart"
                    ? "bg-rose-500/10 border-rose-500"
                    : "bg-card border-border hover:border-rose-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "heart"
                        ? "bg-rose-500"
                        : "bg-rose-500/15",
                    )}
                  >
                    <span>🫀</span>
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeUrgencyTab === "heart"
                        ? "text-rose-600"
                        : "text-foreground/80",
                    )}
                  >
                    HEART
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Dor Torácica Aguda
                </p>
              </button>

              {/* NIHSS */}
              <button
                type="button"
                onClick={() => setActiveUrgencyTab("nihss")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeUrgencyTab === "nihss"
                    ? "bg-violet-500/10 border-violet-500"
                    : "bg-card border-border hover:border-violet-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "nihss"
                        ? "bg-violet-500"
                        : "bg-violet-500/15",
                    )}
                  >
                    <span>🧠</span>
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeUrgencyTab === "nihss"
                        ? "text-violet-600"
                        : "text-foreground/80",
                    )}
                  >
                    NIHSS (AVC)
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Déficit Neurológico do AVC
                </p>
              </button>

              {/* CRB-65 */}
              <button
                type="button"
                onClick={() => setActiveUrgencyTab("crb65")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeUrgencyTab === "crb65"
                    ? "bg-sky-500/10 border-sky-500"
                    : "bg-card border-border hover:border-sky-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "crb65"
                        ? "bg-sky-500"
                        : "bg-sky-500/15",
                    )}
                  >
                    <span>🫁</span>
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeUrgencyTab === "crb65"
                        ? "text-sky-600"
                        : "text-foreground/80",
                    )}
                  >
                    CRB-65 (PAC)
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Pneumonia Adquirida na Comunidade
                </p>
              </button>

              {/* Wells TEP */}
              <button
                type="button"
                onClick={() => setActiveUrgencyTab("wells")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeUrgencyTab === "wells"
                    ? "bg-orange-500/10 border-orange-500"
                    : "bg-card border-border hover:border-orange-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "wells"
                        ? "bg-orange-500"
                        : "bg-orange-500/15",
                    )}
                  >
                    <span>🦵</span>
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeUrgencyTab === "wells"
                        ? "text-orange-600"
                        : "text-foreground/80",
                    )}
                  >
                    Wells (TEP)
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Tromboembolismo Pulmonar
                </p>
              </button>

              {/* Alvarado */}
              <button
                type="button"
                onClick={() => setActiveUrgencyTab("alvarado")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeUrgencyTab === "alvarado"
                    ? "bg-emerald-500/10 border-emerald-500"
                    : "bg-card border-border hover:border-emerald-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "alvarado"
                        ? "bg-emerald-500"
                        : "bg-emerald-500/15",
                    )}
                  >
                    <span>🔪</span>
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeUrgencyTab === "alvarado"
                        ? "text-emerald-600"
                        : "text-foreground/80",
                    )}
                  >
                    Alvarado
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Suspeita de Apendicite Aguda
                </p>
              </button>

              {/* GRACE */}
              <button
                type="button"
                onClick={() => setActiveUrgencyTab("grace")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeUrgencyTab === "grace"
                    ? "bg-red-500/10 border-red-500"
                    : "bg-card border-border hover:border-red-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "grace"
                        ? "bg-red-500"
                        : "bg-red-500/15",
                    )}
                  >
                    <span>❤️‍🔥</span>
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeUrgencyTab === "grace"
                        ? "text-red-600"
                        : "text-foreground/80",
                    )}
                  >
                    GRACE
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Risco em Infarto / SCA
                </p>
              </button>

              {/* Ranson */}
              <button
                type="button"
                onClick={() => setActiveUrgencyTab("ranson")}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                  activeUrgencyTab === "ranson"
                    ? "bg-yellow-500/10 border-yellow-500"
                    : "bg-card border-border hover:border-yellow-400/50",
                )}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "ranson"
                        ? "bg-yellow-500"
                        : "bg-yellow-500/15",
                    )}
                  >
                    <span>🩸</span>
                  </div>
                  <p
                    className={cn(
                      "font-black text-xs uppercase tracking-wider",
                      activeUrgencyTab === "ranson"
                        ? "text-yellow-600"
                        : "text-foreground/80",
                    )}
                  >
                    Ranson
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">
                  Pancreatite Aguda
                </p>
              </button>
            </div>
          </div>

          {/* Coluna Direita: Formulários */}
          <div className="md:col-span-8 flex flex-col overflow-y-auto custom-scrollbar overscroll-contain pr-4 pb-10">
            {/* HEART Tab */}
            {activeUrgencyTab === "heart" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      H - História Clínica
                    </Label>
                    <Select
                      value={heartHistory}
                      onValueChange={setHeartHistory}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Inespecífica / Pouco suspeita
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Moderadamente suspeita
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Altamente suspeita
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      E - Eletrocardiograma (ECG)
                    </Label>
                    <Select value={heartEcg} onValueChange={setHeartEcg}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Normal</SelectItem>
                        <SelectItem value="1">
                          1 - Repolarização inespecífica / BR / HVE / Alteração
                          prévia
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Depressão de ST significativa / Inversão de T
                          dinâmica
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      A - Idade (Anos)
                    </Label>
                    <Select value={heartAge} onValueChange={setHeartAge}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - &lt; 45 anos</SelectItem>
                        <SelectItem value="1">1 - 45 a 64 anos</SelectItem>
                        <SelectItem value="2">2 - &gt;= 65 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      R - Fatores de Risco
                    </Label>
                    <Select value={heartRisk} onValueChange={setHeartRisk}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Nenhum fator de risco ativo
                        </SelectItem>
                        <SelectItem value="1">
                          1 - 1 a 2 fatores de risco (HAS, DM, DLP, Fumo,
                          Obesidade, Hist. Fam)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - &gt;= 3 fatores de risco ou Aterosclerose
                          documentada
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      T - Troponina inicial
                    </Label>
                    <Select
                      value={heartTroponin}
                      onValueChange={setHeartTroponin}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Normal (abaixo do limite superior de normalidade)
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Elevada entre 1 a 3 vezes o limite superior
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Altamente elevada ( &gt; 3 vezes o limite
                          superior)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  const score =
                    parseInt(heartHistory) +
                    parseInt(heartEcg) +
                    parseInt(heartAge) +
                    parseInt(heartRisk) +
                    parseInt(heartTroponin);
                  let riskClass = "Baixo Risco";
                  let levelColor = "bg-emerald-500 text-white";
                  let recommendation =
                    "Alta segura da emergência com orientações. Agendar acompanhamento com Cardiologista ambulatorial em até 72 horas.";

                  if (score >= 7) {
                    riskClass = "Alto Risco";
                    levelColor = "bg-red-600 text-white animate-pulse";
                    recommendation =
                      "Internação em Unidade Coronariana/Monitoreamento Intensivo. Terapia anti-isquêmica plena (Dupla Antiagregação Plaquetária + Anticoagulação). Solicitação de Cineangiocoronariografia (CATE) de urgência.";
                  } else if (score >= 4) {
                    riskClass = "Risco Moderado";
                    levelColor = "bg-amber-500 text-white";
                    recommendation =
                      "Admissão para protocolo de dor torácica sob observação na UPA. Realizar monitorização contínua por ECG e colher nova Troponina de curva (0h, 3h). Avaliar exames adicionais.";
                  }

                  return (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Escore HEART
                          </p>
                          <p className="text-3xl font-black text-foreground">
                            {score}{" "}
                            <span className="text-sm font-medium text-muted-foreground">
                              / 10 pts
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            levelColor,
                          )}
                        >
                          {riskClass}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-muted-foreground p-3 rounded-xl bg-white/80 dark:bg-slate-950/40 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/50">
                        <span className="font-bold text-foreground">
                          Conduta sugerida:
                        </span>{" "}
                        {recommendation}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setHeartHistory("0");
                            setHeartEcg("0");
                            setHeartAge("0");
                            setHeartRisk("0");
                            setHeartTroponin("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-rose-500/40 hover:bg-rose-500/5 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- ESCORE HEART (TRIAGEM DE DOR TORÁCICA): ${score}/10 pontos (${riskClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            onApply(
                              descText,
                              `HEART: ${score} pts (${score >= 7 ? "Alto" : score >= 4 ? "Mod" : "Baixo"})`,
                            );
                            onClose(false);
                            toast.success(
                              "Escore HEART integrado com sucesso!",
                            );
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* NIHSS Tab */}
            {activeUrgencyTab === "nihss" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                  Protocolo Completo NIHSS - Avaliação de Déficit Neurológico no
                  AVC
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[30vh] overflow-y-auto pr-2 pb-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      1a. Nível de Consciência (LOC)
                    </Label>
                    <Select value={nihLoc} onValueChange={setNihLoc}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Alerta</SelectItem>
                        <SelectItem value="1">
                          1 - Sonolento (Desperta ao verbal leve)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Torporoso (Requer estímulo vigoroso/doloroso)
                        </SelectItem>
                        <SelectItem value="3">
                          3 - Coma (Apenas resposta reflexa ou arresponsivo)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      1b. LOC Perguntas (Mês e Idade)
                    </Label>
                    <Select
                      value={nihQuestions}
                      onValueChange={setNihQuestions}
                    >
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Acerta ambas as perguntas
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Acerta uma pergunta
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Erra ambas / Afásico / Estuporoso
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      1c. LOC Comandos (Olhos e Mão)
                    </Label>
                    <Select value={nihCommands} onValueChange={setNihCommands}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Executa ambos corretamente
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Executa um corretamente
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Não executa nenhum corretamente
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      2. Olhar Conjugado Horizontal
                    </Label>
                    <Select value={nihGaze} onValueChange={setNihGaze}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Normal</SelectItem>
                        <SelectItem value="1">
                          1 - Paralisia parcial do olhar horizontal
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Desvio conjugado forçado / Paralisia total
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      3. Campos Visuais (Hemianopsia)
                    </Label>
                    <Select value={nihVisual} onValueChange={setNihVisual}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Sem perda visual</SelectItem>
                        <SelectItem value="1">
                          1 - Hemianopsia parcial (quadrantanopsia)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Hemianopsia completa contralateral
                        </SelectItem>
                        <SelectItem value="3">
                          3 - Cegueira bilateral / Amaurose completa
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      4. Paralisia Facial
                    </Label>
                    <Select value={nihFacial} onValueChange={setNihFacial}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Movimentos normais / Simétricos
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Paralisia facial leve (apagamento sulco
                          nasolabial)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Paralisia parcial (metade inferior da face)
                        </SelectItem>
                        <SelectItem value="3">
                          3 - Paralisia facial completa (unilateral total)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      5a. Motor MS Esquerdo (Braço)
                    </Label>
                    <Select value={nihArmL} onValueChange={setNihArmL}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Sem queda (mantém 90º por 10s)
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Queda leve (cai antes de 10s, sem tocar na cama)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Esforço contra gravidade (braço cai na cama)
                        </SelectItem>
                        <SelectItem value="3">
                          3 - Sem esforço contra gravidade (move no plano)
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Sem movimento voluntário
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      5b. Motor MS Direito (Braço)
                    </Label>
                    <Select value={nihArmR} onValueChange={setNihArmR}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Sem queda (mantém 90º por 10s)
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Queda leve (cai antes de 10s, sem tocar na cama)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Esforço contra gravidade (braço cai na cama)
                        </SelectItem>
                        <SelectItem value="3">
                          3 - Sem esforço contra gravidade (move no plano)
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Sem movimento voluntário
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      6a. Motor MI Esquerdo (Perna)
                    </Label>
                    <Select value={nihLegL} onValueChange={setNihLegL}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Sem queda (mantém 30º por 5s)
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Queda leve (cai antes de 5s, sem tocar na cama)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Algum esforço (perna cai na cama mas tenta erguer)
                        </SelectItem>
                        <SelectItem value="3">
                          3 - Sem esforço contra gravidade (move no plano)
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Sem movimento voluntário
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      6b. Motor MI Direito (Perna)
                    </Label>
                    <Select value={nihLegR} onValueChange={setNihLegR}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Sem queda (mantém 30º por 5s)
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Queda leve (cai antes de 5s, sem tocar na cama)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Algum esforço (perna cai na cama mas tenta erguer)
                        </SelectItem>
                        <SelectItem value="3">
                          3 - Sem esforço contra gravidade (move no plano)
                        </SelectItem>
                        <SelectItem value="4">
                          4 - Sem movimento voluntário
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      7. Ataxia Apendicular (Coordenação)
                    </Label>
                    <Select value={nihAtaxia} onValueChange={setNihAtaxia}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Ausente / Normal</SelectItem>
                        <SelectItem value="1">
                          1 - Presente em um membro
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Presente em 2 ou mais membros
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      8. Sensibilidade (Dor/Táctil)
                    </Label>
                    <Select value={nihSensory} onValueChange={setNihSensory}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Normal (sem perda sensitiva)
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Perda leve a moderada (sente menos do lado
                          afetado)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Perda grave ou total / Anestesia completa
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      9. Linguagem (Afasia)
                    </Label>
                    <Select value={nihLanguage} onValueChange={setNihLanguage}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Normal (sem afasia)
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Afasia leve a moderada (alguma dificuldade)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Afasia grave (compreensão/expressão limitada)
                        </SelectItem>
                        <SelectItem value="3">
                          3 - Afasia global / Mudez completa
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      10. Disartria (Articulação da fala)
                    </Label>
                    <Select
                      value={nihDysarthria}
                      onValueChange={setNihDysarthria}
                    >
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Normal</SelectItem>
                        <SelectItem value="1">
                          1 - Disartria leve a moderada (arrastada, mas
                          compreensível)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Disartria grave / Fala ininteligível ou afásico
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      11. Extinção e Desatenção (Negligência)
                    </Label>
                    <Select value={nihNeglect} onValueChange={setNihNeglect}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          0 - Sem negligência / Normal
                        </SelectItem>
                        <SelectItem value="1">
                          1 - Negligência parcial (inatenção sensorial/visual
                          contralateral)
                        </SelectItem>
                        <SelectItem value="2">
                          2 - Negligência completa (profunda inatenção
                          multimodal)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  const score =
                    parseInt(nihLoc) +
                    parseInt(nihQuestions) +
                    parseInt(nihCommands) +
                    parseInt(nihGaze) +
                    parseInt(nihVisual) +
                    parseInt(nihFacial) +
                    parseInt(nihArmL) +
                    parseInt(nihArmR) +
                    parseInt(nihLegL) +
                    parseInt(nihLegR) +
                    parseInt(nihAtaxia) +
                    parseInt(nihSensory) +
                    parseInt(nihLanguage) +
                    parseInt(nihDysarthria) +
                    parseInt(nihNeglect);

                  let severity = "Normal";
                  let levelColor = "bg-emerald-500 text-white";
                  let recommendation =
                    "Manter acompanhamento clínico de rotina. Avaliar causas não vasculares.";

                  if (score >= 21) {
                    severity = "AVC Grave";
                    levelColor =
                      "bg-red-950 text-white animate-pulse border border-red-500";
                    recommendation =
                      "AVC Grave! Acionar imediatamente a equipe de Neurologia/Neurocirurgia. Risco elevado de hemorragia e edema cerebral grave. Avaliar janelas e contraindicações de trombólise/trombectomia mecânica urgente.";
                  } else if (score >= 16) {
                    severity = "AVC Moderadamente Grave";
                    levelColor = "bg-red-600 text-white animate-pulse";
                    recommendation =
                      "AVC Moderadamente Grave! Acionar Protocolo de AVC. Transferir em regime de prioridade para a Unidade de Trombólise/Neuro. Monitoramento rigoroso de vias aéreas e hemodinâmica.";
                  } else if (score >= 5) {
                    severity = "AVC Moderado";
                    levelColor = "bg-amber-500 text-white";
                    recommendation =
                      "Déficit moderado. Acionar protocolo AVC com prioridade. Se início dos sintomas < 4.5 horas e sem contraindicações, paciente tem alta indicação de Trombólise Química com rtPA.";
                  } else if (score >= 1) {
                    severity = "AVC Leve";
                    levelColor = "bg-blue-500 text-white";
                    recommendation =
                      "Déficit leve. Realizar investigação diagnóstica com neuroimagem (TC/RM de crânio) urgente para descartar isquemia aguda ou AIT.";
                  }

                  return (
                    <div className="mt-4 p-4 mb-6 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Pontuação Total NIHSS
                          </p>
                          <p className="text-3xl font-black text-foreground">
                            {score}{" "}
                            <span className="text-sm font-medium text-muted-foreground">
                              / 42 pts
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            levelColor,
                          )}
                        >
                          {severity}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-muted-foreground p-3 rounded-xl bg-white/80 dark:bg-slate-950/40 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/50">
                        <span className="font-bold text-foreground">
                          Conduta sugerida:
                        </span>{" "}
                        {recommendation}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setNihLoc("0");
                            setNihQuestions("0");
                            setNihCommands("0");
                            setNihGaze("0");
                            setNihVisual("0");
                            setNihFacial("0");
                            setNihArmL("0");
                            setNihArmR("0");
                            setNihLegL("0");
                            setNihLegR("0");
                            setNihAtaxia("0");
                            setNihSensory("0");
                            setNihLanguage("0");
                            setNihDysarthria("0");
                            setNihNeglect("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-violet-500/40 hover:bg-violet-500/5 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- PROTOCOLO DE AVC - ESCALA NIHSS: ${score}/42 pontos (${severity.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            onApply(
                              descText,
                              `NIHSS: ${score} pts (${score >= 21 ? "Grave" : score >= 5 ? "Mod" : "Leve"})`,
                            );
                            onClose(false);
                            toast.success(
                              "Escore NIHSS integrado com sucesso!",
                            );
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* CRB-65 Tab */}
            {activeUrgencyTab === "crb65" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      C - Confusão Mental aguda
                    </Label>
                    <Select
                      value={crbConfusion}
                      onValueChange={setCrbConfusion}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      R - Frequência Respiratória (FR &gt;= 30 irpm)
                    </Label>
                    <Select value={crbRate} onValueChange={setCrbRate}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">
                          Não / FR &lt; 30 irpm (0)
                        </SelectItem>
                        <SelectItem value="1">
                          Sim / FR &gt;= 30 irpm (1)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      B - Pressão Baixa (PAS &lt; 90 ou PAD &le; 60)
                    </Label>
                    <Select value={crbBp} onValueChange={setCrbBp}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não / PA Estável (0)</SelectItem>
                        <SelectItem value="1">
                          Sim / Hipotensão severa (1)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      65 - Idade &gt;= 65 anos
                    </Label>
                    <Select value={crbAge} onValueChange={setCrbAge}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  const score =
                    parseInt(crbConfusion) +
                    parseInt(crbRate) +
                    parseInt(crbBp) +
                    parseInt(crbAge);
                  let risk = "Grupo 1 - Baixo Risco";
                  let levelColor = "bg-emerald-500 text-white";
                  let recommendation =
                    "Tratamento domiciliar (Ambulatorial). Prescrever antibiótico via oral (ex: Amoxicilina ou Macrolídeo) e orientar sinais de alerta para retorno imediato.";

                  if (score >= 3) {
                    risk = "Grupo 3 - Alto Risco";
                    levelColor = "bg-red-600 text-white animate-pulse";
                    recommendation =
                      "Internação hospitalar urgente. Avaliar necessidade imediata de suporte em Unidade de Terapia Intensiva (UTI) devido ao alto risco de insuficiência respiratória e choque séptico.";
                  } else if (score >= 1) {
                    risk = "Grupo 2 - Risco Intermediário";
                    levelColor = "bg-amber-500 text-white";
                    recommendation =
                      "Considerar internação em enfermaria ou observação clínica curta na UPA. Realizar exames de imagem e laboratoriais. Terapia antibiótica empírica adequada.";
                  }

                  return (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Pontuação CRB-65
                          </p>
                          <p className="text-3xl font-black text-foreground">
                            {score}{" "}
                            <span className="text-sm font-medium text-muted-foreground">
                              / 4 pts
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            levelColor,
                          )}
                        >
                          {risk}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-muted-foreground p-3 rounded-xl bg-white/80 dark:bg-slate-950/40 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/50">
                        <span className="font-bold text-foreground">
                          Conduta sugerida:
                        </span>{" "}
                        {recommendation}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setCrbConfusion("0");
                            setCrbRate("0");
                            setCrbBp("0");
                            setCrbAge("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-sky-500/40 hover:bg-sky-500/5 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- GRAVIDADE DA PNEUMONIA - ESCORE CRB-65: ${score}/4 pontos (${risk.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            onApply(
                              descText,
                              `CRB-65: ${score} pts (${score >= 3 ? "Grave" : score >= 1 ? "Mod" : "Ambulat"})`,
                            );
                            onClose(false);
                            toast.success(
                              "Escore CRB-65 integrado com sucesso!",
                            );
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Wells Tab */}
            {activeUrgencyTab === "wells" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[35vh] overflow-y-auto pr-1">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Sinais clínicos ou sintomas de TVP
                    </Label>
                    <Select value={wellsTvp} onValueChange={setWellsTvp}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="3">Sim (+3.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Outro diagnóstico menos provável que TEP
                    </Label>
                    <Select
                      value={wellsAlternative}
                      onValueChange={setWellsAlternative}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="3">Sim (+3.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Frequência Cardíaca &gt; 100 bpm
                    </Label>
                    <Select value={wellsHr} onValueChange={setWellsHr}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1.5">Sim (+1.5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Imobilização ( &ge; 3d) ou Cirurgia ( &le; 4s)
                    </Label>
                    <Select
                      value={wellsImmobility}
                      onValueChange={setWellsImmobility}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1.5">Sim (+1.5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Episódio prévio documentado de TVP ou TEP
                    </Label>
                    <Select value={wellsPrev} onValueChange={setWellsPrev}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1.5">Sim (+1.5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Hemoptise
                    </Label>
                    <Select
                      value={wellsHemoptysis}
                      onValueChange={setWellsHemoptysis}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Cânser / Neoplasia ativa (em tratamento ou paliativo)
                    </Label>
                    <Select value={wellsCancer} onValueChange={setWellsCancer}>
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  const score =
                    parseFloat(wellsTvp) +
                    parseFloat(wellsAlternative) +
                    parseFloat(wellsHr) +
                    parseFloat(wellsImmobility) +
                    parseFloat(wellsPrev) +
                    parseFloat(wellsHemoptysis) +
                    parseFloat(wellsCancer);

                  let probability = "Baixa Probabilidade";
                  let levelColor = "bg-emerald-500 text-white";
                  let recommendation =
                    "TEP Improvável. Solicitar D-Dímero. Se negativo, exclui TEP com alta segurança.";

                  if (score >= 7) {
                    probability = "Alta Probabilidade";
                    levelColor = "bg-red-600 text-white animate-pulse";
                    recommendation =
                      "TEP Provável! Indicação direta de Angiotomografia Computadorizada (Angio-TC) de tórax. Iniciar anticoagulação terapêutica empírica se não houver contraindicações graves.";
                  } else if (score >= 2) {
                    probability = "Moderada Probabilidade";
                    levelColor = "bg-amber-500 text-white";
                    recommendation =
                      "Probabilidade clínica moderada. Solicitar D-Dímero de alta sensibilidade ou considerar Angio-TC conforme estabilidade clínica.";
                  }

                  const twoTierClass =
                    score > 4 ? "TEP Provável" : "TEP Improvável";

                  return (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Escore de Wells
                          </p>
                          <p className="text-3xl font-black text-foreground">
                            {score}{" "}
                            <span className="text-sm font-medium text-muted-foreground">
                              pts ({twoTierClass})
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            levelColor,
                          )}
                        >
                          {probability}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-muted-foreground p-3 rounded-xl bg-white/80 dark:bg-slate-950/40 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/50">
                        <span className="font-bold text-foreground">
                          Conduta sugerida:
                        </span>{" "}
                        {recommendation}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setWellsTvp("0");
                            setWellsAlternative("0");
                            setWellsHr("0");
                            setWellsImmobility("0");
                            setWellsPrev("0");
                            setWellsHemoptysis("0");
                            setWellsCancer("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- PROBABILIDADE DE TEP (ESCORE DE WELLS): ${score} pontos (${probability.toUpperCase()} - ${twoTierClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            onApply(
                              descText,
                              `Wells: ${score} pts (${score > 4 ? "Provável" : "Improv"})`,
                            );
                            onClose(false);
                            toast.success(
                              "Escore de Wells integrado com sucesso!",
                            );
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Alvarado Tab */}
            {activeUrgencyTab === "alvarado" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[35vh] overflow-y-auto pr-1">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Migração da dor para fossa ilíaca direita (FID)
                    </Label>
                    <Select
                      value={alvaradoMigration}
                      onValueChange={setAlvaradoMigration}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Anorexia (Perda de apetite)
                    </Label>
                    <Select
                      value={alvaradoAnorexia}
                      onValueChange={setAlvaradoAnorexia}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Náuseas ou Vômitos
                    </Label>
                    <Select
                      value={alvaradoNausea}
                      onValueChange={setAlvaradoNausea}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Defesa / Palpação muito dolorosa em FID
                    </Label>
                    <Select
                      value={alvaradoTenderness}
                      onValueChange={setAlvaradoTenderness}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="2">Sim (+2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Descompressão dolorosa em FID (Blumberg)
                    </Label>
                    <Select
                      value={alvaradoRebound}
                      onValueChange={setAlvaradoRebound}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Elevação da Temperatura corporal (&ge; 37.3°C)
                    </Label>
                    <Select
                      value={alvaradoFever}
                      onValueChange={setAlvaradoFever}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Leucocitose (&ge; 10.000 /mm³ no Hemograma)
                    </Label>
                    <Select
                      value={alvaradoLeukocytosis}
                      onValueChange={setAlvaradoLeukocytosis}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="2">Sim (+2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Desvia à esquerda de neutrófilos (&gt; 75%)
                    </Label>
                    <Select
                      value={alvaradoShift}
                      onValueChange={setAlvaradoShift}
                    >
                      <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  const score =
                    parseInt(alvaradoMigration) +
                    parseInt(alvaradoAnorexia) +
                    parseInt(alvaradoNausea) +
                    parseInt(alvaradoTenderness) +
                    parseInt(alvaradoRebound) +
                    parseInt(alvaradoFever) +
                    parseInt(alvaradoLeukocytosis) +
                    parseInt(alvaradoShift);

                  let riskClass = "Baixa Probabilidade";
                  let levelColor = "bg-emerald-500 text-white";
                  let recommendation =
                    "Apendicite improvável. Alta segura com orientações de retorno se piora dos sintomas ou febre.";

                  if (score >= 7) {
                    riskClass = "Alta Probabilidade";
                    levelColor = "bg-red-600 text-white animate-pulse";
                    recommendation =
                      "Alta probabilidade de Apendicite Aguda. Deixar em jejum imediato, iniciar hidratação venosa e acionar avaliação urgente da equipe de Cirurgia Geral para conduta cirúrgica (Apendicectomia).";
                  } else if (score >= 5) {
                    riskClass = "Consistente com Apendicite (Risco Moderado)";
                    levelColor = "bg-amber-500 text-white";
                    recommendation =
                      "Caso suspeito moderado. Manter paciente sob observação clínica na UPA, jejum temporário, realizar exames adicionais e exames de imagem (Ultrassonografia ou Tomografia de abdômen).";
                  }

                  return (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Escore de Alvarado
                          </p>
                          <p className="text-3xl font-black text-foreground">
                            {score}{" "}
                            <span className="text-sm font-medium text-muted-foreground">
                              / 10 pts
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            levelColor,
                          )}
                        >
                          {riskClass}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-muted-foreground p-3 rounded-xl bg-white/80 dark:bg-slate-950/40 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/50">
                        <span className="font-bold text-foreground">
                          Conduta sugerida:
                        </span>{" "}
                        {recommendation}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setAlvaradoMigration("0");
                            setAlvaradoAnorexia("0");
                            setAlvaradoNausea("0");
                            setAlvaradoTenderness("0");
                            setAlvaradoRebound("0");
                            setAlvaradoFever("0");
                            setAlvaradoLeukocytosis("0");
                            setAlvaradoShift("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- TRIAGEM DE APENDICITE (ESCORE DE ALVARADO): ${score}/10 pontos (${riskClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            onApply(
                              descText,
                              `Alvarado: ${score} pts (${score >= 7 ? "Cirúrgico" : score >= 5 ? "Obs" : "Baixo"})`,
                            );
                            onClose(false);
                            toast.success(
                              "Escore de Alvarado integrado com sucesso!",
                            );
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* GRACE Tab */}
            {activeUrgencyTab === "grace" &&
              (() => {
                const score =
                  parseInt(graceAge) +
                  parseInt(graceHr) +
                  parseInt(graceSbp) +
                  parseInt(graceCreatinine) +
                  parseInt(graceKillip) +
                  parseInt(graceCardiacArrest) +
                  parseInt(graceStDeviation) +
                  parseInt(graceEnzymes);
                let riskClass = "Baixo Risco";
                let recommendation =
                  "Mortalidade intra-hospitalar estimada < 1%. Manejo conservador inicial, monitorização e estratificação não invasiva podem ser considerados dependendo do quadro clínico.";
                let badgeColor = "bg-emerald-500";
                if (score >= 140) {
                  riskClass = "Alto Risco";
                  recommendation =
                    "Mortalidade intra-hospitalar estimada > 3%. Indicação de estratégia invasiva precoce (cateterismo em < 24h). Terapia anti-isquêmica e antitrombótica intensiva.";
                  badgeColor = "bg-rose-600 animate-pulse";
                } else if (score >= 109) {
                  riskClass = "Risco Intermediário";
                  recommendation =
                    "Mortalidade intra-hospitalar estimada entre 1-3%. Estratégia invasiva (cateterismo em < 72h) dependendo da evolução clínica e outros marcadores de risco.";
                  badgeColor = "bg-amber-500";
                }
                return (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          Idade
                        </Label>
                        <Select value={graceAge} onValueChange={setGraceAge}>
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">&lt; 30 anos (0)</SelectItem>
                            <SelectItem value="8">30-39 anos (8)</SelectItem>
                            <SelectItem value="25">40-49 anos (25)</SelectItem>
                            <SelectItem value="41">50-59 anos (41)</SelectItem>
                            <SelectItem value="58">60-69 anos (58)</SelectItem>
                            <SelectItem value="75">70-79 anos (75)</SelectItem>
                            <SelectItem value="91">80-89 anos (91)</SelectItem>
                            <SelectItem value="100">
                              &ge; 90 anos (100)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          Frequência Cardíaca
                        </Label>
                        <Select value={graceHr} onValueChange={setGraceHr}>
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">&lt; 50 bpm (0)</SelectItem>
                            <SelectItem value="3">50-69 bpm (3)</SelectItem>
                            <SelectItem value="9">70-89 bpm (9)</SelectItem>
                            <SelectItem value="15">90-109 bpm (15)</SelectItem>
                            <SelectItem value="24">110-149 bpm (24)</SelectItem>
                            <SelectItem value="38">150-199 bpm (38)</SelectItem>
                            <SelectItem value="46">
                              &ge; 200 bpm (46)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          Pressão Sistólica
                        </Label>
                        <Select value={graceSbp} onValueChange={setGraceSbp}>
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="58">
                              &lt; 80 mmHg (58)
                            </SelectItem>
                            <SelectItem value="53">80-99 mmHg (53)</SelectItem>
                            <SelectItem value="43">
                              100-119 mmHg (43)
                            </SelectItem>
                            <SelectItem value="34">
                              120-139 mmHg (34)
                            </SelectItem>
                            <SelectItem value="24">
                              140-159 mmHg (24)
                            </SelectItem>
                            <SelectItem value="10">
                              160-199 mmHg (10)
                            </SelectItem>
                            <SelectItem value="0">&ge; 200 mmHg (0)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          Creatinina (mg/dL)
                        </Label>
                        <Select
                          value={graceCreatinine}
                          onValueChange={setGraceCreatinine}
                        >
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="1">0 - 0.39 (1)</SelectItem>
                            <SelectItem value="4">0.4 - 0.79 (4)</SelectItem>
                            <SelectItem value="7">0.8 - 1.19 (7)</SelectItem>
                            <SelectItem value="10">1.2 - 1.59 (10)</SelectItem>
                            <SelectItem value="13">1.6 - 1.99 (13)</SelectItem>
                            <SelectItem value="21">2.0 - 3.99 (21)</SelectItem>
                            <SelectItem value="28">&ge; 4.0 (28)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          Classe Killip
                        </Label>
                        <Select
                          value={graceKillip}
                          onValueChange={setGraceKillip}
                        >
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">I - Sem IC (0)</SelectItem>
                            <SelectItem value="20">
                              II - B3, estertores basais (20)
                            </SelectItem>
                            <SelectItem value="39">
                              III - Edema Agudo de Pulmão (39)
                            </SelectItem>
                            <SelectItem value="59">
                              IV - Choque Cardiogênico (59)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          Parada Cardíaca na Admissão
                        </Label>
                        <Select
                          value={graceCardiacArrest}
                          onValueChange={setGraceCardiacArrest}
                        >
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">Não (0)</SelectItem>
                            <SelectItem value="39">Sim (39)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          Desvio de ST no ECG
                        </Label>
                        <Select
                          value={graceStDeviation}
                          onValueChange={setGraceStDeviation}
                        >
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">Não (0)</SelectItem>
                            <SelectItem value="28">Sim (28)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          Marcadores de Necrose Elevados
                        </Label>
                        <Select
                          value={graceEnzymes}
                          onValueChange={setGraceEnzymes}
                        >
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">Não (0)</SelectItem>
                            <SelectItem value="14">Sim (14)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Escore GRACE
                          </p>
                          <p className="text-3xl font-black">
                            {score}{" "}
                            <span className="text-sm font-bold text-muted-foreground">
                              pts
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2 text-white",
                            badgeColor,
                          )}
                        >
                          {riskClass}
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
                            setGraceAge("0");
                            setGraceHr("0");
                            setGraceSbp("58");
                            setGraceCreatinine("1");
                            setGraceKillip("0");
                            setGraceCardiacArrest("0");
                            setGraceStDeviation("0");
                            setGraceEnzymes("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-600 dark:hover:text-red-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- ESCORE GRACE (SCA): ${score} pontos (${riskClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            onApply(
                              descText,
                              `GRACE: ${score} pts (${riskClass.split(" ")[0]})`,
                            );
                            onClose(false);
                            toast.success(
                              "Escore GRACE integrado com sucesso!",
                            );
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-red-600 hover:bg-red-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}

            {/* Ranson Tab */}
            {activeUrgencyTab === "ranson" &&
              (() => {
                const score =
                  parseInt(ransonAge) +
                  parseInt(ransonWbc) +
                  parseInt(ransonGlucose) +
                  parseInt(ransonLdh) +
                  parseInt(ransonAst);
                let riskClass = "Mortalidade Leve (~1%)";
                let recommendation =
                  "Pancreatite leve. Jejum, hidratação venosa vigorosa e analgesia.";
                let badgeColor = "bg-emerald-500";
                if (score >= 5) {
                  riskClass = "Mortalidade Alta (>40%)";
                  recommendation =
                    "Pancreatite grave com altíssima taxa de complicação/mortalidade. Terapia intensiva (UTI). Monitoramento invasivo e provável necessidade de suporte orgânico.";
                  badgeColor = "bg-rose-600 animate-pulse";
                } else if (score >= 3) {
                  riskClass = "Mortalidade Moderada (~15%)";
                  recommendation =
                    "Pancreatite grave inicial. Monitoramento contínuo em UTI ou emergência avançada. Reposição volêmica agressiva.";
                  badgeColor = "bg-amber-500";
                }
                return (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">
                      Critérios de Admissão (0 horas)
                    </Label>
                    <p className="text-[10px] text-muted-foreground">
                      Avalie estes critérios no momento da admissão na
                      emergência.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          Idade
                        </Label>
                        <Select value={ransonAge} onValueChange={setRansonAge}>
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">&lt; 55 anos</SelectItem>
                            <SelectItem value="1">&ge; 55 anos (+1)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          Leucócitos
                        </Label>
                        <Select value={ransonWbc} onValueChange={setRansonWbc}>
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">&lt; 16.000 /mm³</SelectItem>
                            <SelectItem value="1">
                              &ge; 16.000 /mm³ (+1)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          Glicemia
                        </Label>
                        <Select
                          value={ransonGlucose}
                          onValueChange={setRansonGlucose}
                        >
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">&lt; 200 mg/dL</SelectItem>
                            <SelectItem value="1">
                              &ge; 200 mg/dL (+1)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          LDH
                        </Label>
                        <Select value={ransonLdh} onValueChange={setRansonLdh}>
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">&lt; 350 UI/L</SelectItem>
                            <SelectItem value="1">
                              &ge; 350 UI/L (+1)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">
                          AST / TGO
                        </Label>
                        <Select value={ransonAst} onValueChange={setRansonAst}>
                          <SelectTrigger className="h-9 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">&lt; 250 UI/L</SelectItem>
                            <SelectItem value="1">
                              &ge; 250 UI/L (+1)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            Escore de Ranson
                          </p>
                          <p className="text-3xl font-black">
                            {score}{" "}
                            <span className="text-sm font-bold text-muted-foreground">
                              / 5 pts (Admissão)
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2 text-white",
                            badgeColor,
                          )}
                        >
                          {riskClass}
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
                            setRansonAge("0");
                            setRansonWbc("0");
                            setRansonGlucose("0");
                            setRansonLdh("0");
                            setRansonAst("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-yellow-500/40 hover:bg-yellow-500/5 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- CRITÉRIOS DE RANSON (PANCREATITE NA ADMISSÃO): ${score}/5 pontos (${riskClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            onApply(
                              descText,
                              `Ranson: ${score} pts (${riskClass.split(" ")[1]})`,
                            );
                            onClose(false);
                            toast.success(
                              "Escore de Ranson integrado com sucesso!",
                            );
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
