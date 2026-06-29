import { Card, CardContent } from "@/components/ui/card";
import { Activity, HeartPulse, Droplet, Thermometer, Timer } from "lucide-react";
import { Patient } from "@/context/PatientsContext";

interface PatientVitalsCardProps {
  patient: Patient;
  onClick: () => void;
}

export function PatientVitalsCard({ patient, onClick }: PatientVitalsCardProps) {
  return (
    <Card
      className="group glass-card-premium border border-rose-500/15 dark:border-rose-500/20 bg-rose-500/[0.02] dark:bg-rose-500/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-xl overflow-hidden transition-all duration-500 cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:bg-rose-500/[0.07] dark:hover:bg-rose-500/[0.10] hover:border-rose-500/40 hover:shadow-[0_12px_40px_rgba(244,63,94,0.12)] lg:col-span-1"
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col justify-between h-full gap-2 font-black">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-rose-500/80 transition-colors duration-300">
            Status Sinais Vitais
          </p>
          <span className="text-[9px] font-black text-rose-500 dark:text-rose-450 uppercase tracking-wider flex items-center gap-0.5 transition-all duration-300 group-hover:scale-105">
            📈 Histórico
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#006699] dark:text-sky-300 bg-[#006699]/10 px-2 py-0.5 rounded-md border border-[#006699]/15 transition-all duration-300 group-hover:bg-[#006699] group-hover:text-white group-hover:border-[#006699]/30">
            <Activity className="h-3 w-3" />
            PA: {patient.pa || "--"}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/15 transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500/30">
            <HeartPulse className="h-3 w-3 animate-pulse" />
            FC: {patient.fc || "--"}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/15 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500/30">
            <Droplet className="h-3 w-3" />
            SpO2: {patient.spo2 ? `${patient.spo2}%` : "--"}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/15 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500/30">
            <Thermometer className="h-3 w-3" />
            T: {patient.temperature ? `${patient.temperature}°C` : "--"}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-black text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/15 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500/30">
            <Timer className="h-3 w-3" />
            FR: {patient.fr || "--"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
