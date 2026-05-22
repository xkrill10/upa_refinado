import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogIn, Ticket, User, Accessibility, AlertTriangle, Printer, Baby } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { usePatients } from "@/hooks/use-patients";
import { cn } from "@/lib/utils";

type Priority = "normal" | "preferential" | "pediatric" | "emergency";

const priorityMeta: Record<Priority, { label: string; description: string; color: string; icon: React.ElementType }> = {
  normal: { label: "Normal (N)", description: "Atendimento padrão", color: "bg-blue-500 hover:bg-blue-600", icon: User },
  preferential: { label: "Preferencial (P)", description: "Idoso, gestante, PCD, etc", color: "bg-amber-500 hover:bg-amber-600", icon: Accessibility },
  pediatric: { label: "Pediatria (C)", description: "Criança até 12 anos", color: "bg-orange-500 hover:bg-orange-600", icon: Baby },
  emergency: { label: "Emergência (E)", description: "Risco imediato à vida", color: "bg-red-600 hover:bg-red-700", icon: AlertTriangle },
};

export default function Arrival() {
  const { registerArrival, patients } = usePatients();
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [motherName, setMotherName] = useState("");
  const [susCard, setSusCard] = useState("");
   const [priority, setPriority] = useState<Priority>("normal");
   const [isUnidentified, setIsUnidentified] = useState(false);
   const [issuedTicket, setIssuedTicket] = useState<string | null>(null);

    useEffect(() => {
    if (cpf.length === 14 && !isUnidentified) {
      const cleanCPF = cpf.replace(/\D/g, '');
      const existing = patients.find(p => p.cpf.replace(/\D/g, '') === cleanCPF);
      
      if (existing) {
        setBirthDate(existing.birthDate || "");
        setMotherName(existing.motherName || "");
        setSusCard(existing.susCard || "");
        toast.info(`Dados de ${existing.name.split(' ')[0]} carregados automaticamente.`);
      }
    }
  }, [cpf, patients, isUnidentified]);

  const maskCPF = (value: string) =>
    value.replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");

  const formatWords = (text: string) => {
    const skipWords = ["de", "da", "do", "dos", "das", "e", "o", "a"];
    return text
      .toLowerCase()
      .split(" ")
      .map((word, index) => {
        if (word.length === 0) return "";
        if (index === 0 || !skipWords.includes(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(" ");
  };

  const maskSUS = (value: string) =>
    value.replace(/\D/g, "").substring(0, 15);

  const validateSUS = (cns: string) => {
    if (cns.length !== 15) return false;
    
    const firstDigit = cns[0];
    if (!['1', '2', '7', '8', '9'].includes(firstDigit)) return false;

    if (['1', '2'].includes(firstDigit)) {
      const pis = cns.substring(0, 11);
      let sum = 0;
      for (let i = 0; i < 11; i++) {
        sum += parseInt(pis[i]) * (15 - i);
      }
      
      const rest = sum % 11;
      let dv = 11 - rest;
      
      if (dv === 11) dv = 0;
      
      if (dv === 10) {
        sum += 2;
        const rest2 = sum % 11;
        const dv2 = 11 - rest2;
        return cns === pis + "001" + dv2.toString();
      } else {
        return cns === pis + "000" + dv.toString();
      }
    }

    if (['7', '8', '9'].includes(firstDigit)) {
      let sum = 0;
      for (let i = 0; i < 15; i++) {
        sum += parseInt(cns[i]) * (15 - i);
      }
      return (sum % 11 === 0);
    }

    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isUnidentified) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const { ticket } = registerArrival({ 
        cpf: "000.000.000-00", 
        birthDate: new Date().toISOString().split('T')[0], 
        motherName: "DESCONHECIDA", 
        priority,
        name: `PACIENTE DESCONHECIDO (${time})`
      });
      setIssuedTicket(ticket);
      toast.success(`Senha emitida para paciente não identificado: ${ticket}`);
      return;
    }

    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11) return toast.error("CPF inválido");
    if (!birthDate) return toast.error("Informe a data de nascimento");
    if (!motherName.trim()) return toast.error("Informe o nome da mãe");
    
    if (susCard && !validateSUS(susCard)) {
      return toast.error("Cartão do SUS inválido");
    }

    const { ticket } = registerArrival({ cpf, birthDate, motherName: motherName.trim(), susCard, priority });
    setIssuedTicket(ticket);
    toast.success(`Senha emitida: ${ticket}`);
  };

  const reset = () => {
    setIssuedTicket(null);
    setCpf("");
    setBirthDate("");
    setMotherName("");
    setSusCard("");
    setPriority("normal");
    setIsUnidentified(false);
  };

  const getTicketColor = (ticket: string) => {
    const prefix = ticket.charAt(0).toUpperCase();
    if (prefix === 'E') return "bg-red-500 text-white shadow-[0_10px_30px_rgba(239,68,68,0.3)] border-red-500";
    if (prefix === 'P') return "bg-amber-500 text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)] border-amber-500";
    if (prefix === 'C') return "bg-orange-500 text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)] border-orange-500";
    return "bg-[#006699] text-white shadow-[0_10px_30px_rgba(0,102,153,0.3)] border-[#006699]";
  };

  const getTicketColorLight = (ticket: string) => {
    const prefix = ticket.charAt(0).toUpperCase();
    if (prefix === 'E') return "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20";
    if (prefix === 'P') return "text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20";
    if (prefix === 'C') return "text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20";
    return "text-[#006699] dark:text-[#3399cc] bg-[#006699]/5 dark:bg-[#006699]/10";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-10"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase flex items-center gap-2">
          <LogIn className="h-6 w-6 text-primary" /> Identificação / Senhas
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Pré-cadastro do paciente e emissão de senha para classificação de risco
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!issuedTicket ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <Card className="glass-card-premium border-none shadow-2xl rounded-xl overflow-hidden transition-all duration-500">
              <CardHeader className="pt-8 px-8 pb-4">
                <CardTitle className="text-xl md:text-2xl font-black uppercase mission-control-title text-foreground">Identificação do Paciente</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Se o CPF já estiver cadastrado, os dados serão reaproveitados automaticamente.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-4 p-5 rounded-2xl glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-4 transition-all group cursor-pointer hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)]" onClick={() => setIsUnidentified(!isUnidentified)}>
                    <button
                      type="button"
                      className={cn(
                        "h-6 w-11 rounded-full transition-all relative flex items-center shrink-0 shadow-inner",
                        isUnidentified ? "bg-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" : "bg-black/10 dark:bg-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                      )}
                    >
                      <div className={cn(
                        "absolute h-4 w-4 rounded-full bg-white transition-all shadow-md",
                        isUnidentified ? "right-1" : "left-1"
                      )} />
                    </button>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground transition-colors">Paciente Não Identificado</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider transition-colors">Ativação para casos de emergência sem documentos</span>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {!isUnidentified && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-4 px-1">
                          <div className="space-y-2">
                            <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">CPF *</Label>
                            <Input
                              placeholder="000.000.000-00"
                              value={cpf}
                              onChange={(e) => setCpf(maskCPF(e.target.value))}
                              className="h-14 font-mono text-lg focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] focus:bg-white/40 dark:focus:bg-slate-900/40 rounded-2xl placeholder:text-muted-foreground/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">Data de Nascimento *</Label>
                            <Input
                              type="date"
                              value={birthDate}
                              onChange={(e) => setBirthDate(e.target.value)}
                              className="h-14 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] focus:bg-white/40 dark:focus:bg-slate-900/40 rounded-2xl placeholder:text-muted-foreground/50"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                             <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">Cartão do SUS (Opcional)</Label>
                             <Input
                               placeholder="000 0000 0000 0000"
                               value={susCard}
                               onChange={(e) => setSusCard(maskSUS(e.target.value))}
                               className="h-14 font-mono focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] focus:bg-white/40 dark:focus:bg-slate-900/40 rounded-2xl placeholder:text-muted-foreground/50"
                             />
                             <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Necessário para atendimento gratuito (SUS)</p>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">Nome da Mãe *</Label>
                            <Input
                              placeholder="Nome completo da mãe"
                              value={motherName}
                              onChange={(e) => setMotherName(formatWords(e.target.value))}
                              className="h-14 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] focus:bg-white/40 dark:focus:bg-slate-900/40 rounded-2xl placeholder:text-muted-foreground/50"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-3">
                    <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider">Tipo de Atendimento</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {(Object.keys(priorityMeta) as Priority[]).map((key) => {
                        const meta = priorityMeta[key];
                        const Icon = meta.icon;
                        const active = priority === key;
                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => setPriority(key)}
                            className={cn(
                              "p-5 rounded-xl border-2 transition-all duration-500 flex flex-col gap-3 text-left group cursor-pointer relative overflow-hidden backdrop-blur-md",
                              !active && "border-transparent bg-white/40 dark:bg-slate-900/40 hover:bg-white/70 dark:hover:bg-slate-800/70 text-muted-foreground shadow-sm",
                              !active && key === 'normal' && "hover:border-blue-400 hover:shadow-[0_8px_20px_rgba(59,130,246,0.15)]",
                              !active && key === 'preferential' && "hover:border-amber-400 hover:shadow-[0_8px_20px_rgba(245,158,11,0.15)]",
                              !active && key === 'pediatric' && "hover:border-orange-400 hover:shadow-[0_8px_20px_rgba(249,115,22,0.15)]",
                              !active && key === 'emergency' && "hover:border-red-400 hover:shadow-[0_8px_20px_rgba(239,68,68,0.15)]",
                              active && "scale-[1.02] text-foreground font-medium",
                              active && key === 'normal' && "border-blue-500 shadow-[0_10px_30px_rgba(59,130,246,0.3)] bg-blue-50/80 dark:bg-blue-900/30",
                              active && key === 'preferential' && "border-amber-500 shadow-[0_10px_30px_rgba(245,158,11,0.3)] bg-amber-50/80 dark:bg-amber-900/30",
                              active && key === 'pediatric' && "border-orange-500 shadow-[0_10px_30px_rgba(249,115,22,0.3)] bg-orange-50/80 dark:bg-orange-900/30",
                              active && key === 'emergency' && "border-red-500 shadow-[0_10px_30px_rgba(239,68,68,0.3)] bg-red-50/80 dark:bg-red-900/30"
                            )}
                          >
                            <div className={cn("absolute top-0 right-0 p-12 transform translate-x-12 -translate-y-12 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none",
                              active && key === 'normal' ? "bg-blue-400/40 dark:bg-blue-500/30" : "",
                              active && key === 'preferential' ? "bg-amber-400/40 dark:bg-amber-500/30" : "",
                              active && key === 'pediatric' ? "bg-orange-400/40 dark:bg-orange-500/30" : "",
                              active && key === 'emergency' ? "bg-red-400/40 dark:bg-red-500/30" : "",
                            )} />
                            <div className={cn("h-10 w-10 rounded-xl text-white flex items-center justify-center transition-transform group-hover:scale-110 duration-300", meta.color)}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className={cn("font-bold text-sm transition-colors", active ? "text-foreground" : "text-foreground/85 group-hover:text-foreground")}>{meta.label}</span>
                            <span className="text-xs text-muted-foreground group-hover:text-muted-foreground/90 transition-colors leading-normal">{meta.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full h-16 text-lg font-black uppercase tracking-widest gap-2 bg-[#006699] hover:bg-[#005580] rounded-xl shadow-xl hover:shadow-sky-500/20 active:scale-[0.98] transition-all text-white">
                    <Ticket className="h-5 w-5" />
                    Emitir Senha
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="ticket"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="glass-card border-none shadow-2xl rounded-xl overflow-hidden transition-colors duration-500">
              <CardContent className="p-12 flex flex-col items-center text-center gap-6">
                {/* Print-only Container (Hidden on screen) */}
                <div className="hidden print-only">
                  <div className="font-bold text-lg mb-2">UPA - UNIDADE DE PRONTO ATENDIMENTO</div>
                  <div className="text-sm mb-4">SISTEMA DE CONTROLE OPERACIONAL</div>
                  <hr className="border-t border-black border-dashed my-4 w-full" />
                  <div className="text-xs uppercase tracking-widest mb-2 font-bold">Sua senha de atendimento</div>
                  <div className="text-6xl font-black my-6">{issuedTicket}</div>
                  <div className="text-sm font-bold mb-1 uppercase">
                    {priority === 'emergency' ? 'ATENÇÃO: EMERGÊNCIA' : 
                     priority === 'preferential' ? 'PREFERENCIAL' : 
                     priority === 'pediatric' ? 'PEDIATRIA' : 'NORMAL'}
                  </div>
                  <div className="text-xs mb-6">Local: {priority === 'emergency' ? 'SALA VERMELHA' : (priority === 'pediatric' ? 'Triagem Pediatria' : 'Classificação de Risco')}</div>
                  <hr className="border-t border-black border-dashed mt-4 w-full" />
                  <div className="text-[10px] mt-4">
                    {new Date().toLocaleDateString('pt-BR')} - {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-[9px] mt-2 opacity-70">Aguarde ser chamado no painel</div>
                </div>

                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sua senha de atendimento</span>
                <div className={cn(
                  "text-8xl md:text-9xl font-black mission-control-title p-12 rounded-xl shadow-2xl border-4 tracking-tighter transition-all duration-500 px-20",
                  issuedTicket ? getTicketColor(issuedTicket) : "text-primary"
                )}>
                  {issuedTicket}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{priority === 'emergency' ? 'ATENÇÃO: RISCO DE VIDA' : 'Aguarde a chamada'}</p>
                  <p className="text-base text-foreground font-medium">Local: <strong className={cn(
                    issuedTicket?.startsWith('E') ? "text-red-500 dark:text-red-400 animate-pulse" : 
                    issuedTicket?.startsWith('P') ? "text-amber-500 dark:text-amber-400" :
                    issuedTicket?.startsWith('C') ? "text-orange-500 dark:text-orange-400" :
                    "text-[#006699] dark:text-sky-450"
                  )}>{priority === 'emergency' ? 'SALA VERMELHA (IMEDIATO)' : (priority === 'pediatric' ? 'Triagem Pediatria' : 'Classificação de Risco')}</strong></p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6 print:hidden w-full max-w-sm">
                  <Button 
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.print();
                      }
                    }} 
                    variant="default" 
                    size="lg" 
                    className="flex-1 bg-[#006699] hover:bg-[#005580] text-white font-bold h-14 rounded-xl gap-2 shadow-lg active:scale-95 transition-all text-white"
                  >
                    <Printer className="h-5 w-5" />
                    Imprimir Senha
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg" className="flex-1 h-14 rounded-xl font-bold active:scale-95 transition-all border-border/80 dark:border-slate-800/80 bg-transparent">
                    Nova Identificação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}