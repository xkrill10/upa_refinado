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
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface QsofaModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function QsofaModal({ isOpen, onClose, onApply }: QsofaModalProps) {
  const [sepsisTab, setSepsisTab] = useState<"qsofa" | "sirs">("qsofa");

  // qSOFA States
  const [qsofaFr, setQsofaFr] = useState("no");
  const [qsofaMental, setQsofaMental] = useState("no");
  const [qsofaPas, setQsofaPas] = useState("no");

  // SIRS States
  const [sirsTemp, setSirsTemp] = useState("no");
  const [sirsHr, setSirsHr] = useState("no");
  const [sirsRr, setSirsRr] = useState("no");
  const [sirsWbc, setSirsWbc] = useState("no");
  const [sirsFocus, setSirsFocus] = useState("no");
  const [sirsDysfunction, setSirsDysfunction] = useState("no");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-xl glass-card-premium shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-purple-500 animate-bounce" />
            Protocolo de Triagem de Sepse
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Diretrizes Integradas Sepsis-3 (qSOFA) e ILAS (SIRS)
          </DialogDescription>
        </DialogHeader>

        {/* Abas Personalizadas */}
        <div className="flex p-1 bg-muted/60 dark:bg-muted/30 rounded-xl border border-border mb-4">
          <button
            type="button"
            onClick={() => setSepsisTab("qsofa")}
            className={cn(
              "flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all",
              sepsisTab === "qsofa"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            qSOFA (Sepsis-3)
          </button>
          <button
            type="button"
            onClick={() => setSepsisTab("sirs")}
            className={cn(
              "flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all",
              sepsisTab === "sirs"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            SIRS (Diretriz ILAS)
          </button>
        </div>

        <div className="space-y-4 py-1">
          {sepsisTab === "qsofa" ? (
            <>
              {/* 1. FR >= 22 irpm */}
              <div className="space-y-1">
                <Label className="text-xs font-black uppercase text-foreground/80">
                  1. Frequência Respiratória &gt;= 22 irpm
                </Label>
                <Select value={qsofaFr} onValueChange={setQsofaFr}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="no">Não (0 pts)</SelectItem>
                    <SelectItem value="yes">Sim (1 pt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 2. Alteração do Estado Mental */}
              <div className="space-y-1">
                <Label className="text-xs font-black uppercase text-foreground/80">
                  2. Alteração do Estado Mental (Glasgow &lt; 15 ou
                  Desorientação)
                </Label>
                <Select value={qsofaMental} onValueChange={setQsofaMental}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="no">Não (0 pts)</SelectItem>
                    <SelectItem value="yes">Sim (1 pt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 3. PAS <= 100 mmHg */}
              <div className="space-y-1">
                <Label className="text-xs font-black uppercase text-foreground/80">
                  3. Pressão Arterial Sistólica &lt;= 100 mmHg
                </Label>
                <Select value={qsofaPas} onValueChange={setQsofaPas}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="no">Não (0 pts)</SelectItem>
                    <SelectItem value="yes">Sim (1 pt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resultado qSOFA */}
              {(() => {
                let score = 0;
                if (qsofaFr === "yes") score += 1;
                if (qsofaMental === "yes") score += 1;
                if (qsofaPas === "yes") score += 1;

                let riskClass = "Triagem Negativa para Sepse";
                let riskColor = "bg-emerald-500 text-white";
                if (score >= 2) {
                  riskClass = "ALTA SUSPEITA DE SEPSE (CRÍTICO)";
                  riskColor = "bg-purple-600 text-white animate-pulse";
                }

                const isComplete = !!(qsofaFr && qsofaMental && qsofaPas);

                return (
                  <div className="mt-6 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                          Pontuação qSOFA
                        </p>
                        <p className="text-3xl font-black text-foreground">
                          {score}{" "}
                          <span className="text-sm font-bold text-muted-foreground">
                            / 3 pts
                          </span>
                        </p>
                      </div>
                      {isComplete ? (
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[10px] font-black uppercase tracking-wider px-2",
                            riskColor,
                          )}
                        >
                          {riskClass}
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="h-7 rounded-lg text-xs font-black uppercase tracking-wider"
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
                          setQsofaFr("no");
                          setQsofaMental("no");
                          setQsofaPas("no");
                          toast.info("Campos da calculadora limpos.");
                        }}
                        className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-purple-500/40 hover:bg-purple-500/5 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                      >
                        Limpar
                      </Button>
                      <Button
                        type="button"
                        disabled={!isComplete}
                        onClick={() => {
                          const descText = `- ESCORE qSOFA (RISCO DE SEPSE): ${score}/3 pontos (${riskClass}).\n  Conduta sugerida: ${
                            score >= 2
                              ? "ALERTA PROTOCOLO SEPSE IMEDIATO! Notificar equipe médica com urgência, solicitar exames laboratoriais (incluindo lactato venoso e hemoculturas pareadas) e monitoramento cardíaco contínuo."
                              : "Manter acompanhamento clínico e observações de rotina do paciente."
                          }`;
                          onApply(
                            descText,
                            score >= 2
                              ? `qSOFA: ${score} (ALERTA)`
                              : `qSOFA: ${score} pts`,
                          );
                          onClose(false);
                          toast.success("Escore qSOFA integrado com sucesso!");
                        }}
                        className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                      >
                        Confirmar e Aplicar ao Prontuário
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            <>
              {/* SIRS Items */}
              {/* 1. Temp < 36 ou > 38 */}
              <div className="space-y-1">
                <Label className="text-xs font-black uppercase text-foreground/80">
                  1. Temperatura corporal &lt; 36°C ou &gt; 38°C
                </Label>
                <Select value={sirsTemp} onValueChange={setSirsTemp}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="no">Não (0 pts)</SelectItem>
                    <SelectItem value="yes">Sim (1 pt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 2. FC > 90 bpm */}
              <div className="space-y-1">
                <Label className="text-xs font-black uppercase text-foreground/80">
                  2. Frequência Cardíaca &gt; 90 bpm
                </Label>
                <Select value={sirsHr} onValueChange={setSirsHr}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="no">Não (0 pts)</SelectItem>
                    <SelectItem value="yes">Sim (1 pt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 3. FR > 20 irpm */}
              <div className="space-y-1">
                <Label className="text-xs font-black uppercase text-foreground/80">
                  3. Frequência Respiratória &gt; 20 irpm ou PaCO2 &lt; 32 mmHg
                </Label>
                <Select value={sirsRr} onValueChange={setSirsRr}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="no">Não (0 pts)</SelectItem>
                    <SelectItem value="yes">Sim (1 pt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 4. Leucócitos */}
              <div className="space-y-1">
                <Label className="text-xs font-black uppercase text-foreground/80">
                  4. Leucócitos &lt; 4000 ou &gt; 12000 ou &gt; 10% de Bastões
                </Label>
                <Select value={sirsWbc} onValueChange={setSirsWbc}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="no">Não (0 pts)</SelectItem>
                    <SelectItem value="yes">Sim (1 pt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 5. Foco Infeccioso */}
              <div className="space-y-1">
                <Label className="text-xs font-black uppercase text-purple-600 dark:text-purple-400">
                  5. Suspeita de Foco Infeccioso Ativo?
                </Label>
                <Select value={sirsFocus} onValueChange={setSirsFocus}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="no">Não / Indefinido</SelectItem>
                    <SelectItem value="yes">
                      Sim (Suspeito/Confirmado)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 6. Disfunção Orgânica */}
              <div className="space-y-1">
                <Label className="text-xs font-black uppercase text-purple-600 dark:text-purple-400">
                  6. Evidência de Disfunção Orgânica de Início Recente?
                </Label>
                <Select
                  value={sirsDysfunction}
                  onValueChange={setSirsDysfunction}
                >
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="no">Não (Ausente)</SelectItem>
                    <SelectItem value="yes">
                      Sim (Hipotensão PAS &lt; 90, Lactato &gt; 2.0, Plaquetas
                      &lt; 100k, Glasgow &lt; 15, rebaixamento sensorial ou
                      oligúria)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resultado SIRS */}
              {(() => {
                const tVal = sirsTemp === "yes" ? 1 : 0;
                const hVal = sirsHr === "yes" ? 1 : 0;
                const rVal = sirsRr === "yes" ? 1 : 0;
                const wVal = sirsWbc === "yes" ? 1 : 0;
                const sirsScore = tVal + hVal + rVal + wVal;
                const hasFocus = sirsFocus === "yes";
                const hasDysfunction = sirsDysfunction === "yes";

                let riskClass = "SIRS Negativo (Baixo Risco)";
                let riskColor = "bg-emerald-500 text-white";
                if (sirsScore >= 2) {
                  if (hasFocus) {
                    if (hasDysfunction) {
                      riskClass = "PROTOCOLO SEPSE ATIVO (CRÍTICO / ILAS)";
                      riskColor = "bg-purple-600 text-white animate-pulse";
                    } else {
                      riskClass = "SEPSE SUSPEITA (ALERTA ILAS)";
                      riskColor = "bg-red-500 text-white animate-pulse";
                    }
                  } else {
                    riskClass = "SIRS POSITIVO (AVALIAR FOCO)";
                    riskColor = "bg-amber-500 text-white";
                  }
                } else if (hasFocus && hasDysfunction) {
                  riskClass = "SEPSE CRITÉRIO SOFA POSITIVO (CRÍTICO)";
                  riskColor = "bg-purple-600 text-white animate-pulse";
                }

                const isComplete = !!(
                  sirsTemp &&
                  sirsHr &&
                  sirsRr &&
                  sirsWbc &&
                  sirsFocus &&
                  sirsDysfunction
                );

                return (
                  <div className="mt-6 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                          Critérios SIRS
                        </p>
                        <p className="text-3xl font-black text-foreground">
                          {sirsScore}{" "}
                          <span className="text-sm font-bold text-muted-foreground">
                            / 4 pts
                          </span>
                        </p>
                      </div>
                      {isComplete ? (
                        <Badge
                          className={cn(
                            "h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2",
                            riskColor,
                          )}
                        >
                          {riskClass}
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="h-7 rounded-lg text-xs font-black uppercase tracking-wider"
                        >
                          Incompleto
                        </Badge>
                      )}
                    </div>

                    <Button
                      type="button"
                      disabled={!isComplete}
                      onClick={() => {
                        const descText =
                          `- AVALIAÇÃO DE SEPSE (CRITÉRIOS SIRS - DIRETRIZ ILAS):\n  ` +
                          `• Critérios SIRS Presentes: ${sirsScore}/4. ` +
                          `• Foco Infeccioso Ativo Suspeito/Confirmado: ${hasFocus ? "SIM" : "NÃO"}.\n  ` +
                          `• Sinais de Disfunção Orgânica: ${hasDysfunction ? "SIM" : "NÃO"}.\n  ` +
                          `• Classificação: ${riskClass.toUpperCase()}.\n  ` +
                          `Conduta sugerida: ${
                            (sirsScore >= 2 && hasFocus && hasDysfunction) ||
                            (hasFocus && hasDysfunction)
                              ? "ABRIR PROTOCOLO DE SEPSE IMEDIATO (CRÍTICO)! Colher 2 pares de hemoculturas e lactato arterial imediato. Iniciar antibioticoterapia de amplo espectro na primeira hora ('Golden Hour'). Realizar expansão volêmica imediata (30 mL/kg de cristaloide) se hipotensão ou lactato >= 4.0 mmol/L, e monitorar débito urinário rigoroso."
                              : sirsScore >= 2 && hasFocus
                                ? "ABRIR PROTOCOLO DE SEPSE! Colher hemoculturas pareadas, dosar lactato (e repetir de 2/2h se > 2.0). Iniciar antibiótico guiado na primeira hora e monitorizar sinais vitais continuamente."
                                : sirsScore >= 2
                                  ? "SIRS positivo sem foco infeccioso evidente. Avaliar cuidadosamente foco infeccioso oculto (urocultura, radiografia de tórax, hemograma completo). Monitorar de 2/2h."
                                  : "Baixa suspeita pelo SIRS. Manter acompanhamento clínico de rotina."
                          }`;
                        onApply(
                          descText,
                          (sirsScore >= 2 && hasFocus && hasDysfunction) ||
                            (hasFocus && hasDysfunction)
                            ? "SEPSE: PROTOCOLO ATIVO (CRÍTICO)"
                            : sirsScore >= 2 && hasFocus
                              ? "SEPSE: PROTOCOLO ATIVO"
                              : `SIRS: ${sirsScore} pts`,
                        );
                        onClose(false);
                        toast.success(
                          "Escore SIRS integrado ao prontuário com sucesso!",
                        );
                      }}
                      className="w-full h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                    >
                      Confirmar e Aplicar ao Prontuário
                    </Button>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
