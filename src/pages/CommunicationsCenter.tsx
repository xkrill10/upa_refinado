import { useState } from "react";
import { motion } from "motion/react";
import { MessageSquare, BellRing, Smartphone, Send, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { sendPushNotification } from "@/lib/api-communications";
import { cn } from "@/lib/utils";
import { requestFirebaseNotificationPermission } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const SECTORS = [
  { id: "all", name: "Todos os Setores (Geral)" },
  { id: "emergencia", name: "Emergência" },
  { id: "triagem", name: "Triagem" },
  { id: "recepcao", name: "Recepção" },
  { id: "pediatria", name: "Pediatria" },
  { id: "uti", name: "UTI" },
  { id: "laboratorio", name: "Laboratório" },
];

export default function CommunicationsCenter() {
  const [targetSector, setTargetSector] = useState<string>("emergencia");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [messageType, setMessageType] = useState<'push' | 'sms' | 'whatsapp'>("push");
  const [messageContent, setMessageContent] = useState("");
  const [priority, setPriority] = useState<'normal' | 'high' | 'critical'>("normal");
  const [isSending, setIsSending] = useState(false);
  const [isActivatingPush, setIsActivatingPush] = useState(false);
  const { user } = useAuth();

  const currentSectorName = SECTORS.find(s => s.id === targetSector)?.name || "Setor";

  const handleActivatePush = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para ativar notificações.");
      return;
    }

    setIsActivatingPush(true);
    try {
      const token = await requestFirebaseNotificationPermission();
      if (token) {
        // Save token to user_devices
        const { error } = await supabase.from('user_devices').upsert({
          user_id: user.id,
          sector: targetSector, // Vincula ao setor atualmente selecionado na tela
          push_token: token,
          platform: 'web'
        }, { onConflict: 'push_token' });
        
        if (error) throw error;
        toast.success("Notificações ativadas para este aparelho!");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao ativar notificações.");
    } finally {
      setIsActivatingPush(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      toast.error("A mensagem não pode estar vazia.");
      return;
    }

    setIsSending(true);

    try {
      const response = await sendPushNotification({
        targetSector,
        messageType,
        content: messageContent,
        priority
      });

      if (response.success) {
        toast.success(`Mensagem enviada com sucesso`, {
          description: messageType === 'push' 
            ? `ID: ${response.messageId} | Setor: ${currentSectorName}`
            : `ID: ${response.messageId} | Número: ${phoneNumber || 'Não informado'}`
        });
        setMessageContent(""); // clear after sending
      }
    } catch (error: unknown) {
      toast.error("Erro ao enviar mensagem", {
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido."
      });
    } finally {
      setIsSending(false);
    }
  };

  const getPriorityColor = () => {
    if (priority === 'critical') return "bg-red-500 text-white border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
    if (priority === 'high') return "bg-amber-500 text-white border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
    return "bg-sky-500 text-white border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.5)]";
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-[calc(100vh-3.5rem)] space-y-6 pb-12"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 dark:border-slate-800/10 pb-4">
        <div>
          <h1 className="text-3xl mission-control-title bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-3">
            <BellRing className="h-8 w-8 text-primary" />
            Central de Comunicações
          </h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
            <MessageSquare className="h-3.5 w-3.5 text-primary opacity-70" />
            Disparo de Notificações Intersetoriais
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleActivatePush}
          disabled={isActivatingPush}
          className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"
        >
          {isActivatingPush ? "Ativando..." : "Ativar Recebimento PUSH"}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <Card className="glass-card-premium overflow-hidden border-sky-500/20">
            <CardHeader className="bg-sky-500/5 border-b border-sky-500/10 pb-4">
              <CardTitle className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
                <Send className="h-5 w-5 text-sky-500" />
                Nova Mensagem
              </CardTitle>
              <CardDescription className="text-xs font-semibold">
                Configure os parâmetros e o conteúdo da notificação a ser disparada.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Setor de Destino</label>
                  <Select value={targetSector} onValueChange={setTargetSector}>
                    <SelectTrigger className="h-12 bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-slate-800/50 backdrop-blur-md rounded-xl text-sm font-bold shadow-inner">
                      <SelectValue placeholder="Selecione o setor..." />
                    </SelectTrigger>
                    <SelectContent className="glass-card-premium border-white/20 rounded-xl">
                      {SECTORS.map(s => (
                        <SelectItem key={s.id} value={s.id} className="font-bold cursor-pointer">
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Prioridade</label>
                  <Select value={priority} onValueChange={(val: 'normal' | 'high' | 'critical') => setPriority(val)}>
                    <SelectTrigger className={cn("h-12 border-white/20 dark:border-slate-800/50 backdrop-blur-md rounded-xl text-sm font-bold transition-colors", 
                      priority === 'critical' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30' : 
                      priority === 'high' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' : 
                      'bg-white/50 dark:bg-slate-900/50 text-foreground'
                    )}>
                      <SelectValue placeholder="Prioridade..." />
                    </SelectTrigger>
                    <SelectContent className="glass-card-premium border-white/20 rounded-xl">
                      <SelectItem value="normal" className="font-bold cursor-pointer">Normal</SelectItem>
                      <SelectItem value="high" className="font-bold cursor-pointer text-amber-600 dark:text-amber-400">Alta</SelectItem>
                      <SelectItem value="critical" className="font-bold cursor-pointer text-red-600 dark:text-red-400">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Canal de Envio</label>
                <Tabs value={messageType} onValueChange={(v: 'push' | 'sms' | 'whatsapp') => {
                  setMessageType(v);
                  if (v === 'push') setPhoneNumber(''); // Clear phone if switching back to push
                }} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-12 bg-black/5 dark:bg-white/5 rounded-xl p-1">
                    <TabsTrigger value="push" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md">
                      <BellRing className="w-4 h-4 mr-2" /> Push App
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md">
                      <MessageSquare className="w-4 h-4 mr-2" /> SMS
                    </TabsTrigger>
                    <TabsTrigger value="whatsapp" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md text-emerald-600 dark:text-emerald-400">
                      <Smartphone className="w-4 h-4 mr-2" /> WhatsApp
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Conditional Phone Number Field for SMS/WhatsApp */}
              {(messageType === 'sms' || messageType === 'whatsapp') && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Número do Celular</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Smartphone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800/50 rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all shadow-inner"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Se preenchido, a mensagem será enviada diretamente para este número ao invés do setor inteiro.
                  </p>
                </motion.div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Conteúdo da Mensagem</label>
                  <span className={cn("text-xs font-bold", messageContent.length > 250 ? "text-red-500" : "text-muted-foreground/50")}>
                    {messageContent.length}/250
                  </span>
                </div>
                <Textarea 
                  placeholder="Digite sua mensagem aqui..."
                  className="min-h-[150px] resize-none bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-slate-800/50 backdrop-blur-md rounded-xl text-sm font-medium shadow-inner p-4 focus-visible:ring-sky-500/50"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  maxLength={250}
                />
                
                {/* Quick replies */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setMessageContent(`Atenção equipe da ${currentSectorName}: Necessitamos de suporte imediato.`)}
                    className="h-7 text-[10px] font-bold uppercase rounded-full border-white/20 dark:border-slate-800/50 bg-white/30 dark:bg-slate-800/30 hover:bg-sky-500/20 hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    Suporte Imediato
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setMessageContent(`Aviso: O setor de ${currentSectorName} está operando acima da capacidade.`)}
                    className="h-7 text-[10px] font-bold uppercase rounded-full border-white/20 dark:border-slate-800/50 bg-white/30 dark:bg-slate-800/30 hover:bg-sky-500/20 hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    Alerta de Capacidade
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setMessageContent(`Atualização de protocolo: Favor verificar sistema para novas diretrizes no setor.`)}
                    className="h-7 text-[10px] font-bold uppercase rounded-full border-white/20 dark:border-slate-800/50 bg-white/30 dark:bg-slate-800/30 hover:bg-sky-500/20 hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    Atualização Protocolo
                  </Button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  size="lg"
                  disabled={isSending || messageContent.trim().length === 0}
                  onClick={handleSendMessage}
                  className={cn(
                    "rounded-xl font-black uppercase tracking-widest text-xs px-8 transition-all duration-300",
                    isSending ? "opacity-70 cursor-not-allowed" : "hover:scale-105",
                    getPriorityColor()
                  )}
                >
                  {isSending ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" /> Disparar Mensagem
                    </span>
                  )}
                </Button>
              </div>

            </CardContent>
          </Card>
        </motion.div>

        {/* Live Preview / Mockup */}
        <motion.div variants={item} className="flex justify-center items-start pt-4 lg:pt-0">
          <div className="relative w-[300px] h-[600px] rounded-[40px] border-[8px] border-slate-900 bg-slate-950 shadow-2xl overflow-hidden shadow-sky-900/20">
            {/* Notch */}
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center">
              <div className="w-32 h-6 bg-slate-900 rounded-b-2xl"></div>
            </div>
            
            {/* Screen Content */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-950 flex flex-col p-4 pt-12">
              <div className="flex justify-between items-center text-white/50 text-[10px] font-medium px-2 mb-8">
                <span>9:41</span>
                <div className="flex gap-1.5 items-center">
                  <div className="w-4 h-3 bg-white/50 rounded-sm"></div>
                  <div className="w-4 h-3 bg-white/50 rounded-sm"></div>
                  <div className="w-5 h-3 bg-white/50 rounded-sm"></div>
                </div>
              </div>

              {/* Push Notification Preview */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  "rounded-2xl p-4 backdrop-blur-xl border shadow-2xl transition-all duration-500",
                  priority === 'critical' ? "bg-red-950/80 border-red-500/50" :
                  priority === 'high' ? "bg-amber-950/80 border-amber-500/50" :
                  "bg-slate-800/80 border-slate-700/50"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("p-1.5 rounded-lg", 
                    priority === 'critical' ? "bg-red-500 text-white" :
                    priority === 'high' ? "bg-amber-500 text-white" :
                    "bg-sky-500 text-white"
                  )}>
                    {priority === 'critical' ? <ShieldAlert className="h-3 w-3" /> :
                     priority === 'high' ? <AlertTriangle className="h-3 w-3" /> :
                     <BellRing className="h-3 w-3" />}
                  </div>
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">UPA Control</span>
                  <span className="text-[10px] text-white/40 ml-auto">agora</span>
                </div>
                <h4 className={cn("text-xs font-bold mb-1", 
                  priority === 'critical' ? "text-red-400" :
                  priority === 'high' ? "text-amber-400" :
                  "text-white"
                )}>
                  Aviso para {currentSectorName}
                </h4>
                <p className="text-xs text-white/70 line-clamp-4 leading-relaxed">
                  {messageContent || "Sua mensagem aparecerá aqui..."}
                </p>
              </motion.div>

              {/* Lockscreen visual elements */}
              <div className="mt-auto mb-8 flex flex-col items-center gap-4">
                <div className="text-white/30 text-5xl font-extralight tracking-tighter">09:41</div>
                <div className="text-white/20 text-xs font-medium">Segunda, 25 de Maio</div>
              </div>
              <div className="h-1 w-24 bg-white/20 rounded-full mx-auto mb-2"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
