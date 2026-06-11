import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

const data = [
  { time: "00:00", entradas: 12, altas: 5 },
  { time: "04:00", entradas: 8, altas: 15 },
  { time: "08:00", entradas: 45, altas: 10 },
  { time: "12:00", entradas: 60, altas: 35 },
  { time: "16:00", entradas: 55, altas: 40 },
  { time: "20:00", entradas: 30, altas: 50 },
  { time: "23:59", entradas: 15, altas: 25 },
];

interface Props {
  onClick?: () => void;
  expanded?: boolean;
}

export function AreaChartFluxo({ onClick, expanded }: Props) {
  const chartContent = (
    <div className={`w-full ${expanded ? "h-[500px]" : "h-[250px]"}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAltas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: expanded ? 14 : 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: expanded ? 14 : 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              fontSize: expanded ? "16px" : "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="entradas"
            name="Entradas (Triagem)"
            stroke="#3b82f6"
            strokeWidth={expanded ? 4 : 3}
            fillOpacity={1}
            fill="url(#colorEntradas)"
          />
          <Area
            type="monotone"
            dataKey="altas"
            name="Altas Médicas"
            stroke="#10b981"
            strokeWidth={expanded ? 4 : 3}
            fillOpacity={1}
            fill="url(#colorAltas)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  if (expanded) return chartContent;

  return (
    <Card
      className={`glass-card-premium h-full rounded-xl overflow-hidden shadow-sm ${onClick ? "cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2 border-b border-white/10 dark:border-slate-800/20 bg-muted/30">
        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-500" /> Fluxo de Atendimentos
          vs Altas
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-2 pb-4">{chartContent}</CardContent>
    </Card>
  );
}
