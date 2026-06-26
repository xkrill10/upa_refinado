import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, HeartPulse, Droplets, Thermometer, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const getParameterRisk = (
  type: "hr" | "bp" | "sat" | "temp" | "fr",
  value: string,
) => {
  if (!value) return null;

  if (type === "hr") {
    const hr = parseInt(value);
    if (isNaN(hr)) return null;
    if (hr > 130 || hr < 40) return "emergency";
    if ((hr >= 120 && hr <= 130) || (hr >= 40 && hr <= 50))
      return "very-urgent";
    if (hr >= 100 && hr < 120) return "urgent";
    if (hr >= 60 && hr <= 100) return "not-urgent";
    return "less-urgent";
  }

  if (type === "temp") {
    const temp = parseFloat(value);
    if (isNaN(temp)) return null;
    if (temp > 40 || temp < 35) return "emergency";
    if (temp >= 39 && temp <= 40) return "very-urgent";
    if (temp >= 37.5 && temp < 39) return "urgent";
    if (temp >= 36 && temp <= 37.5) return "not-urgent";
    return "less-urgent";
  }

  if (type === "sat") {
    const sat = parseFloat(value);
    if (isNaN(sat)) return null;
    if (sat < 90) return "emergency";
    if (sat >= 90 && sat <= 94) return "very-urgent";
    if (sat >= 95 && sat <= 97) return "urgent";
    if (sat > 97) return "not-urgent";
    return "less-urgent";
  }

  if (type === "bp") {
    if (!value.includes("/")) return null;
    const parts = value.split("/");
    let sys = parseInt(parts[0]);
    let dia = parseInt(parts[1]);
    if (isNaN(sys) || isNaN(dia)) return null;
    if (sys < 30) sys = sys * 10;
    if (dia < 15 && dia > 0) dia = dia * 10;

    if (sys >= 180 || dia >= 120 || sys < 80) return "emergency";
    if (
      (sys >= 160 && sys < 180) ||
      (dia >= 100 && dia < 120) ||
      (sys >= 80 && sys < 90)
    )
      return "very-urgent";
    if ((sys >= 140 && sys < 160) || (dia >= 90 && dia < 100))
      return "urgent";
    if (sys >= 100 && sys <= 130 && dia >= 60 && dia <= 85)
      return "not-urgent";
    return "less-urgent";
  }

  if (type === "fr") {
    const fr = parseInt(value);
    if (isNaN(fr)) return null;
    if (fr > 30 || fr < 10) return "emergency";
    if (fr >= 25 && fr <= 30) return "very-urgent";
    if (fr >= 21 && fr <= 24) return "urgent";
    if (fr >= 12 && fr <= 20) return "not-urgent";
    return "less-urgent";
  }

  return null;
};

const getStylesForRisk = (risk: string | null) => {
  const iconColor =
    risk === "emergency"
      ? "text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
      : risk === "very-urgent"
        ? "text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]"
        : risk === "urgent"
          ? "text-[#FFDE21] drop-shadow-[0_0_5px_rgba(255,222,33,0.5)]"
          : risk === "less-urgent"
            ? "text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]"
            : risk === "not-urgent"
              ? "text-blue-600 drop-shadow-[0_0_5px_rgba(37,99,235,0.5)]"
              : "text-sky-500/50";

  const borderColor =
    risk === "emergency"
      ? "focus:ring-red-500/20 border-red-500/50 bg-red-500/5"
      : risk === "very-urgent"
        ? "focus:ring-orange-500/20 border-orange-500/50 bg-orange-500/5"
        : risk === "urgent"
          ? "focus:ring-[#FFDE21]/20 border-[#FFDE21]/50 bg-[#FFDE21]/5"
          : risk === "less-urgent"
            ? "focus:ring-emerald-500/20 border-emerald-500/50 bg-emerald-500/5"
            : risk === "not-urgent"
              ? "focus:ring-blue-600/20 border-blue-600/50 bg-blue-600/5"
              : "border-sky-500/20 focus:ring-sky-500/20 bg-sky-500/5";

  return { iconColor, borderColor };
};

interface VitalSignsData {
  bp: string;
  hr: string;
  spo2: string;
  temp: string;
  fr: string;
}

interface VitalSignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VitalSignsData) => void;
  initialData?: VitalSignsData;
  timeStr: string;
}

export function VitalSignsModal({ isOpen, onClose, onSave, initialData, timeStr }: VitalSignsModalProps) {
  const [data, setData] = useState<VitalSignsData>({
    bp: "",
    hr: "",
    spo2: "",
    temp: "",
    fr: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setData(initialData);
      } else {
        setData({ bp: "", hr: "", spo2: "", temp: "", fr: "" });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-card-premium border-sky-500/30 sm:max-w-md rounded-[2rem]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center mb-2">
            <Activity className="h-6 w-6 text-sky-500" />
          </div>
          <DialogTitle className="text-xl font-black text-center text-foreground uppercase tracking-widest">
            Sinais Vitais
          </DialogTitle>
          <DialogDescription className="text-center font-bold text-slate-500">
            Registrar sinais vitais aprazados para as <span className="text-sky-500 font-black">{timeStr}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-sky-600 ml-1">Pressão Arterial</Label>
              <div className="relative">
                <Activity 
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    getStylesForRisk(getParameterRisk("bp", data.bp)).iconColor
                  )} 
                />
                <input 
                  placeholder="Ex: 120/80" 
                  className={cn(
                    "w-full h-12 border rounded-xl pl-10 pr-4 text-sm font-black text-foreground placeholder:text-muted-foreground/50 focus:ring-2 transition-all outline-none",
                    getStylesForRisk(getParameterRisk("bp", data.bp)).borderColor
                  )}
                  value={data.bp}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val.length < data.bp.length) {
                      setData({ ...data, bp: val });
                      return;
                    }
                    let v = val.replace(/\D/g, "").slice(0, 6);
                    if (v.length === 3) v = v.replace(/(\d{2})(\d{1})/, "$1/$2");
                    else if (v.length === 4) v = v.replace(/(\d{3})(\d{1})/, "$1/$2");
                    else if (v.length >= 5) v = v.replace(/(\d{3})(\d{2,3})/, "$1/$2");
                    if (val.endsWith("/") && !v.includes("/")) v = v + "/";
                    setData({ ...data, bp: v });
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-sky-600 ml-1">Freq. Cardíaca</Label>
              <div className="relative">
                <HeartPulse 
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    getStylesForRisk(getParameterRisk("hr", data.hr)).iconColor
                  )} 
                />
                <input 
                  placeholder="Ex: 80 bpm" 
                  className={cn(
                    "w-full h-12 border rounded-xl pl-10 pr-4 text-sm font-black text-foreground placeholder:text-muted-foreground/50 focus:ring-2 transition-all outline-none",
                    getStylesForRisk(getParameterRisk("hr", data.hr)).borderColor
                  )}
                  value={data.hr}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "").slice(0, 3);
                    if (parseInt(val) > 300) val = "300";
                    setData({ ...data, hr: val });
                  }}
                  type="text"
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-sky-600 ml-1">Saturação (SpO2 %)</Label>
              <div className="relative">
                <Droplets 
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    getStylesForRisk(getParameterRisk("sat", data.spo2)).iconColor
                  )} 
                />
                <input 
                  placeholder="Ex: 98%" 
                  className={cn(
                    "w-full h-12 border rounded-xl pl-10 pr-4 text-sm font-black text-foreground placeholder:text-muted-foreground/50 focus:ring-2 transition-all outline-none",
                    getStylesForRisk(getParameterRisk("sat", data.spo2)).borderColor
                  )}
                  value={data.spo2}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "").slice(0, 3);
                    if (parseInt(val) > 100) val = "100";
                    setData({ ...data, spo2: val });
                  }}
                  type="text"
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-sky-600 ml-1">Temp. (°C)</Label>
              <div className="relative">
                <Thermometer 
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    getStylesForRisk(getParameterRisk("temp", data.temp)).iconColor
                  )} 
                />
                <input 
                  placeholder="Ex: 36.5" 
                  className={cn(
                    "w-full h-12 border rounded-xl pl-10 pr-4 text-sm font-black text-foreground placeholder:text-muted-foreground/50 focus:ring-2 transition-all outline-none",
                    getStylesForRisk(getParameterRisk("temp", data.temp)).borderColor
                  )}
                  value={data.temp}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                    const dots = val.match(/\./g);
                    if (dots && dots.length > 1) val = val.slice(0, val.lastIndexOf("."));
                    if (val.includes(".")) {
                      const parts = val.split(".");
                      val = parts[0].slice(0, 2) + "." + parts[1].slice(0, 1);
                    } else {
                      val = val.slice(0, 2);
                    }
                    setData({ ...data, temp: val });
                  }}
                  type="text"
                  inputMode="decimal"
                />
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-sky-600 ml-1">Freq. Respiratória</Label>
              <div className="relative">
                <Timer 
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    getStylesForRisk(getParameterRisk("fr", data.fr)).iconColor
                  )} 
                />
                <input 
                  placeholder="Ex: 16 irpm" 
                  className={cn(
                    "w-full h-12 border rounded-xl pl-10 pr-4 text-sm font-black text-foreground placeholder:text-muted-foreground/50 focus:ring-2 transition-all outline-none",
                    getStylesForRisk(getParameterRisk("fr", data.fr)).borderColor
                  )}
                  value={data.fr}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "").slice(0, 3);
                    if (parseInt(val) > 100) val = "100";
                    setData({ ...data, fr: val });
                  }}
                  type="text"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto font-bold rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl">
              Salvar Registro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
