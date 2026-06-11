import { useEffect, useState } from "react";
import { Droplets, Sparkles, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBeds } from "@/context/BedsContext";
import { motion, AnimatePresence } from "framer-motion";

const getTimeElapsed = (requestedAt?: Date) => {
  if (!requestedAt) return { text: "0m", isLate: false };
  const diff = Date.now() - new Date(requestedAt).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  return {
    text: `${minutes}m`,
    isLate: minutes > 15,
  };
};

export default function CleaningDashboard() {
  const { beds, updateBedStatus } = useBeds();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  const cleaningBeds = beds.filter((b) => b.status === "cleaning");

  return (
    <div className="fixed inset-0 bg-slate-950 text-white z-50 overflow-auto p-8 flex flex-col">
      <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-3xl bg-orange-500/20 flex items-center justify-center border border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            <Droplets className="h-8 w-8 text-orange-500 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-widest text-orange-500 drop-shadow-lg">
              Painel de Higienização
            </h1>
            <p className="text-xl font-bold text-slate-400 mt-1 uppercase tracking-[0.2em]">
              Prioridade de Leitos
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-6xl font-black tracking-tighter text-white drop-shadow-md">
            {new Date(now).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="flex-1">
        {cleaningBeds.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-6 opacity-50">
            <Sparkles className="h-32 w-32 text-emerald-500" />
            <h2 className="text-4xl font-black uppercase tracking-widest text-emerald-500 text-center">
              Nenhum leito
              <br />
              aguardando limpeza
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {cleaningBeds
                .sort(
                  (a, b) =>
                    new Date(a.requestedAt || 0).getTime() -
                    new Date(b.requestedAt || 0).getTime(),
                )
                .map((bed) => {
                  const elapsed = getTimeElapsed(bed.requestedAt);
                  return (
                    <motion.div
                      key={bed.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1, filter: "brightness(2)" }}
                      className={cn(
                        "p-8 rounded-[2rem] border-4 flex flex-col justify-between shadow-2xl transition-all relative overflow-hidden",
                        elapsed.isLate
                          ? "bg-red-500/10 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-pulse-slow"
                          : "bg-orange-500/10 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.2)]",
                      )}
                    >
                      {bed.isIsolation && (
                        <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-2 rounded-bl-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> Isolamento
                        </div>
                      )}
                      <div>
                        <h3 className="text-5xl font-black tracking-tighter text-white drop-shadow-md">
                          {bed.name}
                        </h3>
                        <p className="text-xl font-bold text-slate-300 uppercase tracking-widest mt-2">
                          {bed.room}
                        </p>
                      </div>

                      <div className="mt-12 mb-8 flex items-center gap-3">
                        <Clock
                          className={cn(
                            "h-6 w-6",
                            elapsed.isLate ? "text-red-400" : "text-orange-400",
                          )}
                        />
                        <span
                          className={cn(
                            "text-3xl font-black",
                            elapsed.isLate ? "text-red-400" : "text-orange-400",
                          )}
                        >
                          {elapsed.text}
                        </span>
                      </div>

                      <button
                        onClick={() => updateBedStatus(bed.id, "available")}
                        className="w-full h-20 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-2xl uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-3"
                      >
                        <Sparkles className="h-6 w-6" /> Liberar Leito
                      </button>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
