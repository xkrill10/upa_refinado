import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, User, MapPin, History, Volume2, VolumeX, Play, Activity, Clock, Stethoscope, Maximize, Minimize, AlertCircle, Baby } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn, formatPatientNameLGPD } from "@/lib/utils";
import { usePatients } from "@/hooks/use-patients";
import { toast } from "sonner";

const UI_COLORS = {
  primary: "bg-gradient-to-br from-[#002B52] via-[#00427A] to-[#005BAB]", 
  secondary: "bg-slate-800",
  accent: "text-white",
  muted: "text-slate-400"
};

export default function CallPanel() {
  const { currentCall, callHistory, isAudioEnabled, setIsAudioEnabled, reCall, resetSystem } = usePatients();
  const [isCalling, setIsCalling] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const lastCallId = useRef<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);


  const initAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setHasInteracted(true);
    return audioContextRef.current;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        toast.error("Erro ao ativar tela cheia: " + err.message);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const speak = useCallback((call: { ticket?: string; patientName: string; room: string }) => {
    if (!isAudioEnabled) return;

    try {
      const ctx = initAudioContext();
      
      const playTone = (freq: number, startTime: number, duration: number) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      const now = ctx?.currentTime || 0;
      playTone(523.25, now, 0.4);
      playTone(659.25, now + 0.25, 0.4);

      // Force cancel any ongoing speech to start fresh
      window.speechSynthesis.cancel();

      setTimeout(() => {
        const patientDisplayName = formatPatientNameLGPD(call.patientName);
        const ticketLetters = (call.ticket || "").split('').join(' ');
        const message = `Atenção. Senha ${ticketLetters}. ${patientDisplayName}. Comparecer ao ${call.room}.`;
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find a PT-BR voice explicitly
        const voices = window.speechSynthesis.getVoices();
        const brVoice = voices.find(v => (v.lang === 'pt-BR' || v.lang === 'pt_BR') && v.localService) || 
                        voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR'));
        
        if (brVoice) utterance.voice = brVoice;

        utterance.onstart = () => setIsCalling(true);
        utterance.onend = () => setIsCalling(false);
        utterance.onerror = (e) => {
          console.error("Speech error:", e);
          setIsCalling(false);
        };
        
        // Final sanity check for double speaking
        window.speechSynthesis.speak(utterance);
      }, 1200); // Slightly longer delay to ensure chime finish
    } catch (e) {
      console.error("Audio error:", e);
      setIsCalling(false);
    }
  }, [isAudioEnabled]);

  // Pre-fetch voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  const testVoice = () => {
    initAudioContext();
    const testCall = { ticket: "T000", patientName: "TESTE DE VOZ DO SISTEMA", room: "SALA DE VOZ" };
    if (!isAudioEnabled) {
      setIsAudioEnabled(true);
      setTimeout(() => speak(testCall), 500);
    } else {
      speak(testCall);
    }
  };

  // Add click listener to unlock audio on first interaction
  useEffect(() => {
    const handleInteraction = () => {
      initAudioContext();
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  // Handle automatic visual effect and audio when currentCall changes
  useEffect(() => {
    if (currentCall && currentCall.id !== lastCallId.current) {
      lastCallId.current = currentCall.id;
      
      // Force visual state reset immediately
      setIsCalling(true);
      
      if (isAudioEnabled) {
        speak(currentCall);
        // Safety timeout to reset isCalling if audio fails to trigger end event
        const timer = setTimeout(() => setIsCalling(false), 8000);
        return () => clearTimeout(timer);
      } else {
        // If audio is disabled, just show visual for a few seconds
        const timer = setTimeout(() => setIsCalling(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentCall, speak, isAudioEnabled]);

  // Handle initial interaction for audio permissions
  const enableAudio = () => {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextClass();
    audioContext.resume();
    if (!isAudioEnabled) setIsAudioEnabled(true);
    toast.success("Áudio do painel ativado com sucesso!");
  };

  const getRoomIcon = (room: string) => {
    const r = room.toUpperCase();
    if (r.includes('VERMELHA') || r.includes('EMERGÊNCIA')) return AlertCircle;
    if (r.includes('AMARELA') || r.includes('OBSERVAÇÃO') || r.includes('MASCULINA') || r.includes('FEMININA')) return Clock;
    if (r.includes('PEDIÁTRICA') || r.includes('CRIANÇA') || r.includes('INFANTIL')) return Baby;
    if (r.includes('TRIAGEM')) return Stethoscope;
    if (r.includes('CONSULTÓRIO')) return Activity;
    return MapPin;
  };

  return (
    <div className={cn(
      "flex-1 flex flex-col gap-4 relative min-h-0 overflow-hidden transition-all duration-500",
      isFullscreen ? "bg-[#00A859] p-8" : "p-6"
    )}>
      {/* Audio Interaction Overlay */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 text-center"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-10 max-w-lg shadow-2xl flex flex-col items-center gap-6"
            >
              <div className="h-24 w-24 rounded-full bg-[#00A859]/10 flex items-center justify-center text-[#00A859]">
                <Volume2 className="h-12 w-12 animate-pulse" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">Painel de Chamada Pronto</h2>
                <p className="text-slate-500 font-medium text-lg">Para que as chamadas por voz funcionem, o navegador exige uma interação inicial.</p>
              </div>
              <Button 
                size="lg" 
                onClick={() => initAudioContext()}
                className="h-20 w-full rounded-2xl bg-[#00A859] hover:bg-[#008F4C] text-white text-xl font-black uppercase tracking-widest shadow-xl shadow-[#00A859]/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                Ativar Áudio do Painel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "bg-white p-5 rounded-[2rem] border-2 border-slate-300 shadow-xl mb-2 relative overflow-hidden shrink-0 transition-transform",
        isFullscreen && "scale-95"
      )}>
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00A859] via-[#005BAB] to-[#E30613]" />
        <div className="flex flex-col items-center gap-4">
          {/* Top Branding Bar: Logos side by side */}
          <div className="w-full flex items-center justify-between px-6">
            {/* Left: Embu das Artes Branding */}
            <div className="flex items-center gap-5 shrink-0">
              <div className="flex flex-col items-start leading-[0.7] select-none scale-90 origin-left">
                <span className="text-[#E30613] font-black text-[12px] uppercase">Cidade de</span>
                <span className="text-[#E30613] text-5xl font-black tracking-tighter">Embu</span>
                <span className="text-[#E30613] font-black text-[12px] uppercase text-right w-full">das Artes</span>
              </div>
              <div className="h-16 w-20 relative flex items-center justify-center scale-90">
                {/* Unified Embu Symbol with correct colors */}
                <div className="w-full h-full flex flex-col rounded-md overflow-hidden border border-slate-100 shadow-sm">
                  <div className="h-1/2 w-full bg-[#00A859]" />
                  <div className="h-1/2 w-full bg-[#E30613]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white border-4 border-white transform rotate-45 flex items-center justify-center overflow-hidden shadow-sm">
                    <div className="w-full h-full bg-[#FFED00]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: UPA 24h Branding */}
            <div className="flex flex-col items-center shrink-0 select-none scale-90 origin-right">
              <div className="flex items-baseline italic">
                <span className="text-[#00A859] text-[58px] font-black tracking-tighter leading-none">U</span>
                <div className="relative inline-block mx-[-2px]">
                  <span className="text-[#00A859] text-[58px] font-black tracking-tighter leading-none">P</span>
                  {/* Brazilian flag circle inside P */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[40%] w-6 h-6 rounded-full border-2 border-white bg-[#005BAB] overflow-hidden shadow-inner">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-[#FFED00] transform rotate-[-20deg]" />
                  </div>
                </div>
                <span className="text-[#00A859] text-[58px] font-black tracking-tighter leading-none">A</span>
                <span className="text-[#005BAB] text-[58px] font-black tracking-tighter leading-none ml-1">24h</span>
                {/* Medical Cross symbol */}
                <div className="relative w-5 h-5 ml-2 mb-4 flex items-center justify-center">
                  <div className="absolute h-full w-1.5 bg-[#E30613] rounded-full" />
                  <div className="absolute w-full h-1.5 bg-[#E30613] rounded-full" />
                </div>
              </div>
              <span className="text-[11px] font-black text-slate-900 tracking-[0.2em] uppercase mt-[-4px]">Unidade de Pronto Atendimento</span>
            </div>
          </div>

          {/* Bottom Branding Bar: Unit Name */}
          <div className="w-full border-t border-slate-100 pt-3 flex items-center justify-between px-4">
            <h1 className="text-2xl lg:text-3xl font-black text-[#00A859] tracking-tight truncate max-w-[80%]">
              UPA – Unidade de Pronto Atendimento Dra. Zilda Arns
            </h1>

            {!isFullscreen && (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="rounded-full h-10 w-10 border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm"
                  title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>

                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm("Deseja realmente RESETAR todo o sistema? Todos os nomes e chamadas serão apagados.")) {
                      resetSystem();
                    }
                  }}
                  className="text-[9px] font-bold uppercase tracking-widest rounded-full h-8 px-4 border border-red-500/20 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 transition-all"
                >
                  Resetar Painel
                </Button>

                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={testVoice}
                  className="text-[9px] font-bold uppercase tracking-widest text-[#00A859] hover:bg-[#00A859]/10 rounded-full h-8 px-4 border border-[#00A859]/20"
                >
                  <Play className="h-3 w-3 mr-2" />
                  Testar Som
                </Button>

                <Button 
                  variant={isAudioEnabled ? "default" : "destructive"} 
                  size="sm"
                  onClick={() => {
                    if (!hasInteracted) {
                      initAudioContext();
                    } else {
                      setIsAudioEnabled(!isAudioEnabled);
                    }
                  }}
                  className={cn(
                    "text-[9px] font-bold uppercase tracking-widest rounded-full h-8 px-5 gap-2 transition-all shadow-sm",
                    isAudioEnabled ? "bg-[#005BAB] hover:bg-[#004A8B]" : "bg-[#E30613] hover:bg-[#C00510]"
                  )}
                >
                  {isAudioEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                  {isAudioEnabled ? "Áudio Ativo" : "Áudio Mudo"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Calling Section */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {!currentCall ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center border-none rounded-[3rem] bg-slate-900 overflow-hidden relative"
              >
                {/* Subtle Geometric Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="relative z-10 flex flex-col items-center space-y-12">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center"
                  >
                    <div className="h-20 w-20 bg-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
                      <Stethoscope className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-[0.3em] uppercase opacity-90">UPA DRA. ZILDA ARNS</h1>
                    <p className="text-blue-400 font-bold text-[10px] tracking-[0.5em] uppercase mt-2">Unidade de Pronto Atendimento - Embu das Artes</p>
                  </motion.div>

                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-slate-500 font-bold text-[11px] tracking-[0.4em] uppercase">Status do Sistema</p>
                    <div className="flex items-center gap-3">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-white font-black text-xl tracking-widest uppercase">Operação Normal</span>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md px-12 py-8 rounded-[2rem] border border-white/10 flex flex-col items-center">
                    <Clock className="h-5 w-5 text-blue-400 mb-4" />
                    <h3 className="text-6xl font-black text-white tracking-widest font-mono">
                      {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </h3>
                    <p className="text-slate-400 font-bold text-[9px] tracking-widest uppercase mt-4">Aguarde sua senha ser anunciada</p>
                  </div>
                </div>

                {/* Bottom Decorative Bar */}
                <div className="absolute bottom-12 w-full flex justify-center">
                  <div className="flex items-center gap-8 opacity-20">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent to-white" />
                    <div className="h-1 w-1 rounded-full bg-white" />
                    <div className="h-px w-24 bg-gradient-to-l from-transparent to-white" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentCall.id}
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-full flex flex-col"
              >
                <Card className={cn(
                  "flex-1 flex flex-col justify-center items-center text-center p-16 border-8 border-white/20 transition-all duration-700 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,43,82,0.5)] overflow-hidden relative",
                  UI_COLORS.primary,
                  isCalling && "ring-[20px] ring-blue-400/20 ring-offset-0"
                )}>
                  {/* Dramatic Call Animation */}
                  <AnimatePresence>
                    {isCalling && (
                      <>
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                          className="absolute inset-0 bg-white rounded-full z-0"
                        />
                        <motion.div 
                          animate={{ opacity: [0.1, 0.3, 0.1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 bg-gradient-to-t from-blue-400/20 to-transparent z-0"
                        />
                      </>
                    )}
                  </AnimatePresence>
                  
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }} />
                  </div>
                  
                  {/* Outer border glow effect */}
                  <div className="absolute inset-0 border-[16px] border-white/5 pointer-events-none rounded-[3.5rem]" />

                  <div className="space-y-6 w-full relative z-10">
                    <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/10 rounded-full border border-white/10 backdrop-blur-md mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Senha de Atendimento</span>
                    </div>
                    
                    <h2 className="text-[14rem] mission-control-title leading-none text-white drop-shadow-2xl mb-8 tracking-tighter">
                      {currentCall.ticket}
                    </h2>
                    
                    <div className="space-y-2">
                      <p className="text-6xl font-black uppercase text-white tracking-tight">
                        {formatPatientNameLGPD(currentCall.patientName)}
                      </p>
                      <div className="h-1 w-24 bg-white/20 mx-auto rounded-full" />
                    </div>
                  </div>

                  <div className="mt-16 w-full flex flex-col md:flex-row items-center justify-center gap-12 relative z-10">
                    <div className="flex flex-col items-center group">
                      <span className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-white/40">Local de Atendimento</span>
                      <div className="flex items-center gap-6 px-12 py-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl group-hover:bg-white/10 transition-colors">
                        {(() => {
                          const Icon = getRoomIcon(currentCall.room);
                          return <Icon className="h-14 w-14 text-blue-400" />;
                        })()}
                        <span className="text-6xl font-black tracking-tight text-white uppercase">{currentCall.room}</span>
                      </div>
                    </div>
                  </div>


                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent History Sidebar - Simplified & Professional */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">CHAMADAS RECENTES</h3>
            <History className={cn("transition-all duration-300", isFullscreen ? "h-8 w-8 text-white" : "h-4 w-4 text-white/50")} />
          </div>
          
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-320px)] pr-2 scrollbar-hide px-2">
            {callHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-[10px] uppercase tracking-widest font-bold bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                Aguardando...
              </div>
            ) : (
              callHistory.map((call) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={call.id} 
                  className="bg-gradient-to-br from-[#002B52] to-[#005BAB] p-5 rounded-[2rem] border-[3px] border-white/10 shadow-lg hover:shadow-2xl hover:border-white/30 transition-all duration-300 relative overflow-hidden flex flex-col gap-4"
                >
                  {/* Left accent bar in bright blue/cyan highlight */}
                  <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-blue-400" />
                  
                  {/* Header Row: Time and Sector Badge */}
                  <div className="flex items-center justify-between pl-2">
                    <span className="text-[11px] font-black text-white bg-white/10 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-blue-200" />
                      {call.time}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-white bg-white/15 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      {(() => {
                        const Icon = getRoomIcon(call.room);
                        return <Icon className="h-3.5 w-3.5 text-blue-200" />;
                      })()}
                      {call.room}
                    </span>
                  </div>
                  
                  {/* Content Row: Large Ticket and Large Patient Name */}
                  <div className="flex items-center gap-4 pl-2">
                    {/* Big Ticket Badge */}
                    <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black text-2xl mission-control-title shrink-0 shadow-md border border-white/20">
                      {call.ticket}
                    </div>
                    {/* Large Legible Patient Name */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest leading-none mb-1">Paciente</p>
                      <p className="text-xl font-black text-white uppercase tracking-tight truncate leading-none drop-shadow-sm">
                        {call.patientName ? formatPatientNameLGPD(call.patientName) : "PACIENTE"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
