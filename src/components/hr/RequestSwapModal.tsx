import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRightLeft,
  CalendarDays,
  Clock,
  Send,
  ShieldAlert,
  ArrowRight,
  UserSquare2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestSwapModal({ open, onOpenChange }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    myShift: "",
    colleague: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.myShift || !formData.colleague) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      setStep(2);
      return;
    }

    toast.success("Solicitação enviada com sucesso!", {
      description:
        "Sua solicitação de troca foi enviada para aprovação da coordenação/RH.",
    });
    setTimeout(() => {
      onOpenChange(false);
      setStep(1);
      setFormData({ myShift: "", colleague: "", reason: "" });
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) setStep(1);
      }}
    >
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <ArrowRightLeft className="absolute right-8 top-1/2 -translate-y-1/2 h-24 w-24 text-white/5 pointer-events-none" />

            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10">
                <ArrowRightLeft className="h-5 w-5 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest">
                Portal do Colaborador
              </Badge>
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tight mission-control-title">
              Solicitar Troca / Repasse
            </DialogTitle>
            <DialogDescription className="text-indigo-100 font-medium">
              Transfira seu plantão para outro profissional. Sujeito à aprovação
              da gestão.
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 space-y-8">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div
                className={cn(
                  "h-2 w-12 rounded-full transition-colors",
                  step >= 1
                    ? "bg-indigo-500"
                    : "bg-slate-200 dark:bg-slate-800",
                )}
              />
              <div
                className={cn(
                  "h-2 w-12 rounded-full transition-colors",
                  step >= 2
                    ? "bg-indigo-500"
                    : "bg-slate-200 dark:bg-slate-800",
                )}
              />
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      <CalendarDays className="h-4 w-4" />
                      1. Selecione seu Plantão
                    </div>
                    <Select
                      onValueChange={(val) =>
                        setFormData((p) => ({ ...p, myShift: val }))
                      }
                      value={formData.myShift}
                    >
                      <SelectTrigger className="h-14 rounded-2xl border-indigo-500/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm text-sm">
                        <SelectValue placeholder="Escolha qual plantão você deseja repassar" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-white/40 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                        <SelectItem value="25/05">
                          Sábado, 25/05/2030 - Diurno (07:00 - 19:00)
                        </SelectItem>
                        <SelectItem value="27/05">
                          Segunda, 27/05/2030 - Noturno (19:00 - 07:00)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      <UserSquare2 className="h-4 w-4" />
                      2. Profissional Substituto
                    </div>
                    <Select
                      onValueChange={(val) =>
                        setFormData((p) => ({ ...p, colleague: val }))
                      }
                      value={formData.colleague}
                    >
                      <SelectTrigger className="h-14 rounded-2xl border-indigo-500/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm text-sm">
                        <SelectValue placeholder="Quem irá assumir o seu plantão?" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-white/40 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                        <SelectItem value="dr_joao">
                          Dr. João Mendes (Clínico Geral)
                        </SelectItem>
                        <SelectItem value="dra_maria">
                          Dra. Maria Clara (Clínico Geral)
                        </SelectItem>
                        <SelectItem value="dr_carlos">
                          Dr. Carlos Souza (Pediatria)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex gap-3 text-indigo-800 dark:text-indigo-300">
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    <p className="text-xs font-medium leading-relaxed">
                      Ao prosseguir, você confirma que o colega selecionado{" "}
                      <strong>já aceitou</strong> cobrir este plantão. A troca
                      só será efetivada após a aprovação da Coordenação/RH.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      <ArrowRightLeft className="h-4 w-4" />
                      Revisão da Solicitação
                    </div>

                    <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
                      <div className="flex-1 flex flex-col">
                        <span className="text-[10px] font-black uppercase text-red-500/80">
                          Você cede
                        </span>
                        <span className="font-bold text-sm">Seu Plantão</span>
                        <span className="text-xs text-muted-foreground">
                          {formData.myShift === "25/05"
                            ? "25/05/2030 (Diurno)"
                            : "27/05/2030 (Noturno)"}
                        </span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mx-4" />
                      <div className="flex-1 flex flex-col items-end text-right">
                        <span className="text-[10px] font-black uppercase text-emerald-500/80">
                          Colega assume
                        </span>
                        <span className="font-bold text-sm">
                          {formData.colleague === "dr_joao"
                            ? "Dr. João Mendes"
                            : formData.colleague === "dra_maria"
                              ? "Dra. Maria Clara"
                              : "Dr. Carlos Souza"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Clínico Geral
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      3. Justificativa (Opcional)
                    </Label>
                    <Textarea
                      placeholder="Motivo da solicitação de troca..."
                      className="resize-none h-24 rounded-2xl border-indigo-500/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm"
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, reason: e.target.value }))
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 pt-4 border-t border-border/50">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl h-14 px-6 font-black uppercase tracking-widest text-[10px]"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 rounded-xl h-14 font-black uppercase tracking-widest text-[10px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/20 group transition-all"
              >
                {step === 1 ? (
                  <>
                    Continuar{" "}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    Enviar Solicitação{" "}
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
