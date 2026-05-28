import { motion } from "motion/react";
import { Activity } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Tipagem para as props baseadas no retorno de useVitals
interface VitalsFormPanelProps {
  vitals: any; // Em produção idealmente tiparíamos com o retorno exato do useVitals
}

export function VitalsFormPanel({ vitals }: VitalsFormPanelProps) {
  const {
    vsBloodPressure,
    vsHeartRate,
    vsSpO2,
    vsTemperature,
    vsRespiratoryRate,
    vsPain,
    vsConsciousness,
    isDefaultBloodPressure,
    isDefaultHeartRate,
    isDefaultSpO2,
    isDefaultTemperature,
    isDefaultRespiratoryRate,
    isDefaultPain,
    isDefaultConsciousness,
    handleBloodPressureChange,
    handleBloodPressureBlur,
    setVsHeartRate,
    setVsSpO2,
    setVsTemperature,
    setVsRespiratoryRate,
    setVsPain,
    setVsConsciousness,
    calculateMEWS,
    getMEWSClassification,
    clearVitals,
    setInitialVitals
  } = vitals;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl border border-white/40 dark:border-white/10 bg-white/35 dark:bg-slate-900/35 backdrop-blur-md shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between border-b pb-2">
        <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
          <Activity className="h-4 w-4 animate-pulse text-[#006699]" />
          Entrada Estruturada de Sinais Vitais (MEWS)
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setInitialVitals();
              toast.success("Parâmetros normais (estáveis) aplicados");
            }}
            className="text-[9px] font-extrabold text-[#006699] hover:underline uppercase tracking-wider bg-[#006699]/10 px-2 py-0.5 rounded border border-[#006699]/15 transition-all flex items-center gap-1 shrink-0"
          >
            ⚡ Parâmetros Normais
          </button>
          <button
            type="button"
            onClick={() => {
              clearVitals();
              toast.info("Campos limpos");
            }}
            className="text-[9px] font-extrabold text-red-500 hover:underline uppercase tracking-wider bg-red-500/5 px-2 py-0.5 rounded border border-red-500/15 transition-all"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="space-y-1">
          <Label className="text-[9px] font-black uppercase text-muted-foreground">Pressão Arterial (PA)</Label>
          <Input 
            type="text"
            placeholder="120/080 mmHg" 
            className={cn(
              "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20 font-mono text-center",
              isDefaultBloodPressure 
                ? "text-slate-400 dark:text-slate-500 font-normal italic" 
                : "text-foreground font-semibold"
            )}
            value={vsBloodPressure}
            onChange={(e) => handleBloodPressureChange(e.target.value)}
            onBlur={handleBloodPressureBlur}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[9px] font-black uppercase text-muted-foreground">Freq. Cardíaca (FC)</Label>
          <Input 
            type="number"
            placeholder="FC bpm" 
            className={cn(
              "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20",
              isDefaultHeartRate 
                ? "text-slate-400 dark:text-slate-500 font-normal italic" 
                : "text-foreground font-semibold"
            )}
            value={vsHeartRate}
            onChange={(e) => setVsHeartRate(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[9px] font-black uppercase text-muted-foreground">Saturação (SpO2)</Label>
          <Input 
            type="number"
            placeholder="SpO2 %" 
            className={cn(
              "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20",
              isDefaultSpO2 
                ? "text-slate-400 dark:text-slate-500 font-normal italic" 
                : "text-foreground font-semibold"
            )}
            value={vsSpO2}
            onChange={(e) => setVsSpO2(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[9px] font-black uppercase text-muted-foreground">Temperatura (°C)</Label>
          <Input 
            type="text"
            placeholder="Temp °C" 
            className={cn(
              "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20",
              isDefaultTemperature 
                ? "text-slate-400 dark:text-slate-500 font-normal italic" 
                : "text-foreground font-semibold"
            )}
            value={vsTemperature}
            onChange={(e) => setVsTemperature(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[9px] font-black uppercase text-muted-foreground">Freq. Resp (FR)</Label>
          <Input 
            type="number"
            placeholder="FR irpm" 
            className={cn(
              "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20",
              isDefaultRespiratoryRate 
                ? "text-slate-400 dark:text-slate-500 font-normal italic" 
                : "text-foreground font-semibold"
            )}
            value={vsRespiratoryRate}
            onChange={(e) => setVsRespiratoryRate(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[9px] font-black uppercase text-muted-foreground">Escala de Dor</Label>
          <Select value={vsPain} onValueChange={setVsPain}>
            <SelectTrigger className={cn(
              "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20",
              isDefaultPain 
                ? "text-slate-400 dark:text-slate-500 font-normal italic" 
                : "text-foreground font-semibold"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[...Array(11).keys()].map(i => (
                <SelectItem key={i} value={String(i)}>{i} - {i === 0 ? 'Sem Dor' : i === 10 ? 'Dor Máxima' : `Nível ${i}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1">
          <Label className="text-[9px] font-black uppercase text-muted-foreground">Nível de Consciência (AVDI)</Label>
          <Select value={vsConsciousness} onValueChange={setVsConsciousness}>
            <SelectTrigger className={cn(
              "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20",
              isDefaultConsciousness 
                ? "text-slate-400 dark:text-slate-500 font-normal italic" 
                : "text-foreground font-semibold"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A - Alerta (Consciente e Orientado)</SelectItem>
              <SelectItem value="V">V - Voz (Responde a estímulo verbal / sonolento)</SelectItem>
              <SelectItem value="D">D - Dor (Responde apenas a estímulo doloroso)</SelectItem>
              <SelectItem value="I">I - Inconsciente (Sem resposta / arresponsivo)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Display MEWS Escore in Real Time */}
        {(() => {
          const mews = calculateMEWS();
          const mewsClass = getMEWSClassification(mews);
          return (
            <div className={cn("p-3 rounded-xl border flex items-center justify-between shadow-sm transition-all duration-300", mewsClass.color)}>
              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Escore Precoce de Deterioração (MEWS)</p>
                <p className="text-xs font-black uppercase tracking-tight mt-0.5">{mewsClass.label}</p>
                <p className="text-[9px] opacity-75 font-semibold mt-0.5 truncate leading-tight">{mewsClass.alert}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center shrink-0 border border-black/5 font-black text-xl font-mono">
                {mews}
              </div>
            </div>
          );
        })()}
      </div>
    </motion.div>
  );
}
