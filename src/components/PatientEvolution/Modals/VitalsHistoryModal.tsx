import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Calendar, User, TrendingUp, AlertTriangle } from "lucide-react";
import { Patient } from "@/context/PatientsContext";
import { cn } from "@/lib/utils";

interface VitalsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

interface ParsedVitals {
  id: string;
  timestamp: string;
  professional: string;
  pa: string;
  fc: string;
  spo2: string;
  temp: string;
  fr: string;
  pain: string;
  mews: number | null;
  isTriage: boolean;
}

const formatSafeTime = (timestamp: string) => {
  if (!timestamp) return "--:--";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

const formatSafeDateTime = (timestamp: string) => {
  if (!timestamp) return "--/-- --:--";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "--/-- --:--";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export function VitalsHistoryModal({ isOpen, onClose, patient }: VitalsHistoryModalProps) {
  if (!patient) return null;

  // 1. Função para extrair dados dos Sinais Vitais da descrição com fallbacks ultra-defensivos
  const parseVitalsText = (text: string, id: string, timestamp: string, professional: string): ParsedVitals => {
    const safeText = text || "";
    const paMatch = safeText.match(/- Pressão Arterial \(PA\):\s*([^\s]+)\s*mmHg/);
    const fcMatch = safeText.match(/- Frequência Cardíaca \(FC\):\s*([^\s]+)\s*bpm/);
    const spo2Match = safeText.match(/- Saturação de O2 \(SpO2\):\s*([^\s%]+)%?/);
    const tempMatch = safeText.match(/- Temperatura Corporal:\s*([^\s]+)\s*°C/);
    const frMatch = safeText.match(/- Frequência Respiratória \(FR\):\s*([^\s]+)\s*irpm/);
    const painMatch = safeText.match(/- Escala de Dor:\s*([^\s/]+)\/10/);
    const mewsMatch = safeText.match(/Escore MEWS calculado:\s*(\d+)/);

    return {
      id: id || Math.random().toString(),
      timestamp: timestamp || new Date().toISOString(),
      professional: professional || "Profissional",
      pa: paMatch ? paMatch[1] : "",
      fc: fcMatch ? fcMatch[1] : "",
      spo2: spo2Match ? spo2Match[1] : "",
      temp: tempMatch ? tempMatch[1] : "",
      fr: frMatch ? frMatch[1] : "",
      pain: painMatch ? painMatch[1] : "0",
      mews: mewsMatch ? parseInt(mewsMatch[1]) : null,
      isTriage: false
    };
  };

  // 2. Coletar sinais vitais da Triagem Inicial (caso existam)
  const list: ParsedVitals[] = [];
  
  if (patient.pa || patient.fc || patient.spo2 || patient.temperature) {
    list.push({
      id: "triage",
      timestamp: patient.arrivalTime || new Date().toISOString(),
      professional: patient.responsibleProfessional || "Triagem Inicial",
      pa: patient.pa || "",
      fc: patient.fc || "",
      spo2: patient.spo2 || "",
      temp: patient.temperature || "",
      fr: patient.fr || "",
      pain: patient.painPattern || "0",
      mews: null, // Não calculado na triagem padrão
      isTriage: true
    });
  }

  // 3. Coletar dos registros de evolução de tipo "Sinais Vitais"
  const vitalsEvolutions = (patient.evolutions || []).filter(e => e.type === "Sinais Vitais");
  
  vitalsEvolutions.forEach(ev => {
    list.push(parseVitalsText(ev.description || "", ev.id, ev.timestamp, ev.professional));
  });

  // Ordenar cronologicamente (da mais antiga para a mais recente)
  const sortedList = [...list].sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());

  // Obter o último registro (mais recente)
  const latestVitals = sortedList[sortedList.length - 1];

  // Helper para obter escore MEWS e classificação
  const calculateMEWSForParsed = (item: ParsedVitals) => {
    if (item.mews !== null) return item.mews;
    
    // Algoritmo MEWS simplificado
    let score = 0;
    const paVal = item.pa || "";
    const pas = parseInt(paVal.split("/")[0]);
    if (!isNaN(pas)) {
      if (pas <= 70) score += 3;
      else if (pas <= 80) score += 2;
      else if (pas <= 100) score += 1;
      else if (pas >= 200) score += 2;
    }
    const fc = parseInt(item.fc || "");
    if (!isNaN(fc)) {
      if (fc <= 40) score += 2;
      else if (fc <= 50) score += 1;
      else if (fc >= 101 && fc <= 110) score += 1;
      else if (fc >= 111 && fc <= 129) score += 2;
      else if (fc >= 130) score += 3;
    }
    const fr = parseInt(item.fr || "");
    if (!isNaN(fr)) {
      if (fr <= 8) score += 2;
      else if (fr >= 15 && fr <= 20) score += 1;
      else if (fr >= 21 && fr <= 29) score += 2;
      else if (fr >= 30) score += 3;
    }
    const tempVal = item.temp || "";
    const temp = parseFloat(tempVal.replace(",", "."));
    if (!isNaN(temp)) {
      if (temp <= 34.9) score += 2;
      else if (temp >= 38.5) score += 2;
    }
    return score;
  };

  const getMEWSDetails = (score: number) => {
    if (score >= 5) return { label: "Crítico", color: "text-red-500 bg-red-500/10 border-red-500/20" };
    if (score >= 3) return { label: "Moderado", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" };
    return { label: "Estável", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
  };

  // 4. Renderizar Gráfico de Tendência (SVG)
  const renderTrendChart = (type: "temp" | "spo2" | "fc", title: string, colorClass: string, strokeColor: string) => {
    const dataPoints = sortedList
      .map(item => {
        let val: number;
        if (type === "temp") {
          const tempVal = item.temp || "";
          val = parseFloat(tempVal.replace(",", "."));
        } else {
          const rawVal = type === "spo2" ? (item.spo2 || "") : (item.fc || "");
          val = parseInt(rawVal);
        }
        return {
          time: formatSafeTime(item.timestamp || ""),
          value: isNaN(val) ? null : val
        };
      })
      .filter(p => p.value !== null) as { time: string; value: number }[];

    if (dataPoints.length < 2) {
      return (
        <div className="h-28 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
          <Activity className="h-6 w-6 text-slate-300 dark:text-slate-700 animate-pulse mb-1.5" />
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Registros insuficientes</p>
          <p className="text-[9px] text-slate-400/80">Requer ao menos 2 aferições para traçar tendências.</p>
        </div>
      );
    }

    const values = dataPoints.map(d => d.value);
    const minVal = Math.min(...values) - (type === "temp" ? 0.5 : 5);
    const maxVal = Math.max(...values) + (type === "temp" ? 0.5 : 5);
    const range = maxVal - minVal || 1;

    const width = 320;
    const height = 90;
    const padding = 15;

    const points = dataPoints.map((dp, idx) => {
      const x = padding + (idx / (dataPoints.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((dp.value - minVal) / range) * (height - 2 * padding);
      return { x, y, ...dp };
    });

    const pathD = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const areaD = points.length > 0 
      ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : "";

    return (
      <div className="p-3 rounded-xl border border-white/40 dark:border-white/10 glass-card-premium shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{title}</p>
          <span className={cn("text-xs font-black", colorClass)}>
            {latestVitals ? (type === "temp" ? `${latestVitals.temp || "--"}°C` : type === "spo2" ? `${latestVitals.spo2 || "--"}%` : `${latestVitals.fc || "--"} bpm`) : "--"}
          </span>
        </div>
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
            <defs>
              <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            
            {/* Linhas de Grade de Fundo */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" className="text-slate-100 dark:text-slate-900" strokeWidth="1" strokeDasharray="3" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="currentColor" className="text-slate-100 dark:text-slate-900" strokeWidth="1" strokeDasharray="3" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-slate-100 dark:text-slate-900" strokeWidth="1" strokeDasharray="3" />

            {/* Área Sombreada */}
            {areaD && <path d={areaD} fill={`url(#grad-${type})`} />}

            {/* Linha de Conexão */}
            <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Nós de Medição */}
            {points.map((p, idx) => (
              <g key={idx} className="group/node">
                <circle cx={p.x} cy={p.y} r="4" fill={strokeColor} className="transition-all duration-300 hover:r-6 cursor-pointer" />
                <circle cx={p.x} cy={p.y} r="8" stroke={strokeColor} fill="none" strokeWidth="1.5" className="opacity-0 group-hover/node:opacity-100 transition-opacity" />
                <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor" className="hidden group-hover/node:block text-slate-700 dark:text-slate-300">
                  {p.value}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="flex justify-between px-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
          <span>{points[0]?.time}</span>
          <span>Curva de Tendência</span>
          <span>{points[points.length - 1]?.time}</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] rounded-2xl glass-card-premium border border-white/40 dark:border-white/10 shadow-2xl max-h-[95vh] overflow-y-auto bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#006699] dark:text-sky-400 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 dark:bg-sky-500/10 flex items-center justify-center text-blue-500 dark:text-sky-400">
              <Activity className="h-5 w-5" />
            </div>
            Painel Histórico de Sinais Vitais
          </DialogTitle>
          <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Acompanhamento Cronológico e Tendências Hemodinâmicas de {patient?.name}
          </DialogDescription>
        </DialogHeader>

        {/* Dashboards e Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3">
          {renderTrendChart("fc", "Frequência Cardíaca", "text-red-500", "#ef4444")}
          {renderTrendChart("spo2", "Saturação O2 (SpO2)", "text-emerald-500", "#10b981")}
          {renderTrendChart("temp", "Temperatura Corporal", "text-orange-500", "#f97316")}
        </div>

        <div className="space-y-4 mt-2">
          <Label className="text-xs font-black uppercase text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-blue-500" />
            Histórico Completo de Medições
          </Label>

          {sortedList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
              <Activity className="h-10 w-10 text-slate-300 dark:text-slate-700 animate-pulse mb-2" />
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Sem registros clínicos</p>
              <p className="text-[10px] text-slate-400/80 mt-0.5">Nenhum sinal vital foi aferido ou importado para este paciente.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-900 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-900">
                    <th className="p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Horário</th>
                    <th className="p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">PA (mmHg)</th>
                    <th className="p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">FC (bpm)</th>
                    <th className="p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">SpO2 (%)</th>
                    <th className="p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">T (°C)</th>
                    <th className="p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">FR (irpm)</th>
                    <th className="p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Dor</th>
                    <th className="p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">MEWS</th>
                    <th className="p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Aferidor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-xs font-semibold">
                  {[...sortedList].reverse().map((item, index) => {
                    const mewsVal = calculateMEWSForParsed(item);
                    const mewsObj = getMEWSDetails(mewsVal);
                    
                    return (
                      <tr
                        key={(item.id || "") + index}
                        className={cn(
                          "hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors",
                          item.isTriage && "bg-blue-500/5 dark:bg-blue-500/10"
                        )}
                      >
                        <td className="p-3 text-[10px] text-slate-500">
                          {formatSafeDateTime(item.timestamp || "")}
                          {item.isTriage && (
                            <span className="block text-[8px] font-black text-blue-500 uppercase mt-0.5">Triagem</span>
                          )}
                        </td>
                        <td className="p-3 font-bold text-[#006699] dark:text-sky-400">{item.pa || "--"}</td>
                        <td className="p-3 font-bold text-red-500">{item.fc || "--"}</td>
                        <td className="p-3 font-bold text-emerald-500">{item.spo2 ? `${item.spo2}%` : "--"}</td>
                        <td className="p-3 font-bold text-orange-500">{item.temp ? `${item.temp}°C` : "--"}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{item.fr || "--"}</td>
                        <td className="p-3 text-slate-500">{item.pain || "0"}/10</td>
                        <td className="p-3">
                          {item.isTriage ? (
                            <span className="text-[10px] text-slate-400 italic">--</span>
                          ) : (
                            <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-black border uppercase", mewsObj.color)}>
                              {mewsVal} pt ({mewsObj.label})
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500 flex items-center gap-1.5 max-w-[120px] truncate">
                          <User className="h-3 w-3 shrink-0" />
                          <span className="truncate">{item.professional || "Profissional"}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-900 mt-4">
          <Button
            type="button"
            onClick={onClose}
            className="rounded-xl font-bold text-xs h-10 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 px-6"
          >
            Fechar Painel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
