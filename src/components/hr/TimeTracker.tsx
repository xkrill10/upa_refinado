import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  LogIn,
  LogOut,
  Coffee,
  ArrowRightCircle,
  CheckCircle2,
  Fingerprint,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type LogEntry = {
  id: string;
  type: "entrada" | "pausa" | "retorno" | "saida";
  time: Date;
};

export function TimeTracker() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = (type: LogEntry["type"]) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      type,
      time: new Date(),
    };

    setLogs((prev) => [newLog, ...prev]);

    const messages = {
      entrada: "Jornada de trabalho iniciada.",
      pausa: "Pausa para descanso/refeição registrada.",
      retorno: "Retorno da pausa registrado.",
      saida: "Jornada de trabalho finalizada.",
    };

    toast.success(`Ponto registrado: ${type.toUpperCase()}`, {
      description: messages[type],
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    });
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case "entrada":
        return "bg-emerald-500 text-white";
      case "pausa":
        return "bg-amber-500 text-white";
      case "retorno":
        return "bg-blue-500 text-white";
      case "saida":
        return "bg-red-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "entrada":
        return <LogIn className="h-4 w-4" />;
      case "pausa":
        return <Coffee className="h-4 w-4" />;
      case "retorno":
        return <ArrowRightCircle className="h-4 w-4" />;
      case "saida":
        return <LogOut className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Determine which buttons should be enabled based on last log
  const lastLogType = logs.length > 0 ? logs[0].type : null;
  const canEntrada = !lastLogType || lastLogType === "saida";
  const canPausa = lastLogType === "entrada" || lastLogType === "retorno";
  const canRetorno = lastLogType === "pausa";
  const canSaida = lastLogType === "entrada" || lastLogType === "retorno";

  return (
    <Card className="border border-white/70 dark:border-slate-800/50 shadow-2xl glass-card-premium text-blue-950 dark:text-slate-100 rounded-xl overflow-hidden relative transition-colors duration-500">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Biometric Icon Accent */}
      <Fingerprint
        className="absolute right-[50%] top-8 h-56 w-56 text-blue-500/10 dark:text-slate-700/30 -mr-28 pointer-events-none"
        strokeWidth={1}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Left Side: Clock & Buttons */}
        <div className="p-8 space-y-8 flex flex-col justify-center">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-slate-800/80 border border-blue-500/20 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-blue-800 dark:text-blue-400 mb-4 shadow-sm backdrop-blur-sm">
              <Clock className="h-3 w-3 text-blue-600 dark:text-blue-500" />
              Terminal de Ponto Virtual
            </div>
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter font-mono tabular-nums text-blue-950 dark:text-white drop-shadow-sm">
              {currentTime.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </h2>
            <p className="text-blue-600/70 dark:text-slate-400 font-bold tracking-widest uppercase text-sm">
              {currentTime.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              onClick={() => handleRegister("entrada")}
              disabled={!canEntrada}
              className={cn(
                "h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all border border-transparent",
                canEntrada
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white"
                  : "bg-white/50 dark:bg-slate-800/50 border-blue-100 dark:border-slate-700/50 text-blue-400 dark:text-slate-500",
              )}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Entrada
            </Button>

            <Button
              onClick={() => handleRegister("pausa")}
              disabled={!canPausa}
              className={cn(
                "h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all border border-transparent",
                canPausa
                  ? "bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 text-white"
                  : "bg-white/50 dark:bg-slate-800/50 border-blue-100 dark:border-slate-700/50 text-blue-400 dark:text-slate-500",
              )}
            >
              <Coffee className="mr-2 h-5 w-5" />
              Pausa
            </Button>

            <Button
              onClick={() => handleRegister("retorno")}
              disabled={!canRetorno}
              className={cn(
                "h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all border border-transparent",
                canRetorno
                  ? "bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/20 text-white"
                  : "bg-white/50 dark:bg-slate-800/50 border-blue-100 dark:border-slate-700/50 text-blue-400 dark:text-slate-500",
              )}
            >
              <ArrowRightCircle className="mr-2 h-5 w-5" />
              Retorno
            </Button>

            <Button
              onClick={() => handleRegister("saida")}
              disabled={!canSaida}
              className={cn(
                "h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all border border-transparent",
                canSaida
                  ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 text-white"
                  : "bg-white/50 dark:bg-slate-800/50 border-blue-100 dark:border-slate-700/50 text-blue-400 dark:text-slate-500",
              )}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Saída
            </Button>
          </div>
        </div>

        {/* Right Side: Log History */}
        <div className="bg-white/15 dark:bg-slate-950/25 p-8 border-l border-white/30 dark:border-slate-800/25 flex flex-col backdrop-blur-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-blue-800/60 dark:text-slate-400 mb-6 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Registros de Hoje
          </h3>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {logs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60"
                >
                  <div className="h-16 w-16 rounded-full bg-blue-50/20 dark:bg-slate-900/40 flex items-center justify-center border border-white/30 dark:border-slate-800">
                    <Clock className="h-6 w-6 text-blue-400/50 dark:text-slate-600" />
                  </div>
                  <p className="text-sm font-bold text-blue-800/50 dark:text-slate-500">
                    Nenhum registro encontrado hoje
                  </p>
                </motion.div>
              ) : (
                logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-white/50 dark:border-slate-800/35 shadow-sm backdrop-blur-sm"
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                        getStatusColor(log.type),
                      )}
                    >
                      {getStatusIcon(log.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black uppercase tracking-wider text-blue-950 dark:text-slate-200">
                        {log.type}
                      </p>
                      <p className="text-[10px] font-medium text-blue-600/60 dark:text-slate-500 uppercase tracking-widest mt-1">
                        Registrado com sucesso
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black tabular-nums text-blue-900 dark:text-white">
                        {log.time.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Card>
  );
}
