import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Copy, Check, MessageSquare, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: {
    totalPatients: number;
    waiting: number;
    attending: number;
    emergencies: number;
    occupiedBeds: number;
    totalBeds: number;
  };
}

export function WhatsAppShareModal({ open, onOpenChange, stats }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [copied, setCopied] = useState(false);

  // Auto formats phone input: (XX) XXXXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, "");
    
    // Se o usuário digitou ou colou o DDI 55 no início, removemos automaticamente
    // para formatar o restante como número local de forma limpa (já que o +55 já está no badge)
    if (rawValue.startsWith("55") && rawValue.length > 2) {
      rawValue = rawValue.substring(2);
    }

    if (rawValue.length > 11) {
      return; // Limita ao formato móvel brasileiro padrão (DDD + 9 dígitos)
    }

    let formatted = rawValue;
    if (rawValue.length > 2) {
      const ddd = rawValue.substring(0, 2);
      const rest = rawValue.substring(2);
      if (rest.length > 5) {
        const firstPart = rest.substring(0, 5);
        const secondPart = rest.substring(5);
        formatted = `(${ddd}) ${firstPart}-${secondPart}`;
      } else {
        formatted = `(${ddd}) ${rest}`;
      }
    } else if (rawValue.length > 0) {
      formatted = `(${rawValue}`;
    }

    setPhoneNumber(formatted);
  };

  // Resets state when modal closes
  useEffect(() => {
    if (!open) {
      setPhoneNumber("");
      setCopied(false);
    }
  }, [open]);

  // Builds standard Whatsapp markdown text
  const messageText = `*📊 UPA DIGITAL - Relatório de Ocupação*\n\n` +
    `• *Total de Pacientes:* ${stats.totalPatients} hoje\n` +
    `• *Aguardando Triagem:* ${stats.waiting}\n` +
    `• *Em Atendimento:* ${stats.attending}\n` +
    `• *Casos Críticos:* ${stats.emergencies}\n` +
    `• *Ocupação Leitos:* ${stats.occupiedBeds}/${stats.totalBeds}\n\n` +
    `_Relatório gerado em tempo real pelo painel de monitoramento._`;

  const cleanPhone = phoneNumber.replace(/\D/g, "");
  
  // Format for international Brazilian numbers (DDI 55)
  let finalPhone = cleanPhone;
  if (cleanPhone.length > 0) {
    if (!cleanPhone.startsWith("55") && (cleanPhone.length === 11 || cleanPhone.length === 10)) {
      finalPhone = "55" + cleanPhone;
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      toast.success("Copiado com sucesso!", {
        description: "O relatório foi adicionado à sua área de transferência."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar o texto.");
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    let url = "";
    if (finalPhone) {
      url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(messageText)}`;
    } else {
      url = `https://wa.me/?text=${encodeURIComponent(messageText)}`;
    }
    
    window.open(url, "_blank");
    toast.success("Redirecionando para o WhatsApp...");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem]">
        <form onSubmit={handleSend}>
          <DialogHeader className="p-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <MessageSquare className="absolute right-8 top-1/2 -translate-y-1/2 h-24 w-24 text-white/5 pointer-events-none" />

            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-200 animate-pulse" />
                Relatórios Instantâneos
              </Badge>
            </div>
            
            <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tight mission-control-title">
              Compartilhar no WhatsApp
            </DialogTitle>
            <DialogDescription className="text-emerald-100 font-medium">
              Envie o relatório operacional em tempo real para a gestão ou equipe médica.
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 space-y-6">
            {/* Live Message Preview in Whatsapp Mock Theme */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                <span>Visualização da Mensagem</span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-7 px-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-700 transition-all flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500 animate-bounce" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copiar Mensagem
                    </>
                  )}
                </Button>
              </div>

              {/* Mock WhatsApp bubble preview */}
              <div className="relative rounded-2xl p-4 bg-[#e5ddd5] dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden min-h-[160px] flex flex-col justify-between">
                {/* Whatsapp bubble background pattern for authentic feels */}
                <div className="absolute inset-0 bg-[radial-gradient(#00000003_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                
                <div className="relative self-start max-w-[85%] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl rounded-tl-none p-3 shadow-md text-xs font-mono whitespace-pre-wrap leading-relaxed">
                  {/* Styled simulation of Whatsapp formatting */}
                  <div>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400">📊 UPA DIGITAL - Relatório de Ocupação</span>{"\n\n"}
                    • <span className="font-bold">Total de Pacientes:</span> {stats.totalPatients} hoje{"\n"}
                    • <span className="font-bold">Aguardando Triagem:</span> {stats.waiting}{"\n"}
                    • <span className="font-bold">Em Atendimento:</span> {stats.attending}{"\n"}
                    • <span className="font-bold">Casos Críticos:</span> {stats.emergencies}{"\n"}
                    • <span className="font-bold">Ocupação Leitos:</span> {stats.occupiedBeds}/{stats.totalBeds}{"\n\n"}
                    <span className="italic text-slate-500 dark:text-slate-400">Relatório gerado em tempo real pelo painel de monitoramento.</span>
                  </div>
                  <span className="block text-[8px] text-right text-slate-400 dark:text-slate-500 mt-2 font-sans">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                  </span>
                </div>
              </div>
            </div>


            {/* Input Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Número do Destinatário (Opcional)
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="h-14 pl-4 pr-12 rounded-2xl border-emerald-500/20 focus:border-emerald-500 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-inner text-sm placeholder:text-muted-foreground font-mono focus-visible:ring-emerald-500/20"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-xs font-black text-muted-foreground/60 font-mono">
                  BR +55
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 pt-1 px-1">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                Deixe em branco para selecionar o contato manualmente no WhatsApp.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl h-14 px-6 font-black uppercase tracking-widest text-[10px]"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl h-14 font-black uppercase tracking-widest text-[10px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl shadow-emerald-500/20 group transition-all"
              >
                Enviar via WhatsApp
                <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
