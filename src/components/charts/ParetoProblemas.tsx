import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const data = [
  { name: "Demora Medicação", casos: 120, percentual: 35 },
  { name: "Superlotação", casos: 85, percentual: 60 },
  { name: "Falta de Leito", casos: 60, percentual: 78 },
  { name: "Demora Exame", casos: 40, percentual: 90 },
  { name: "Evasão", casos: 25, percentual: 97 },
  { name: "Outros", casos: 10, percentual: 100 },
];

export function ParetoProblemas() {
  return (
    <Card className="glass-card-premium h-full rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="p-4 pb-2 border-b border-white/10 dark:border-slate-800/20 bg-muted/30">
        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" /> Pareto de Problemas
          (80/20)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-2 pb-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.2}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                yAxisId="left"
                dataKey="casos"
                name="Volume de Casos"
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index < 2 ? "#ef4444" : "#3b82f6"}
                  />
                ))}
              </Bar>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentual"
                name="% Acumulada"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
