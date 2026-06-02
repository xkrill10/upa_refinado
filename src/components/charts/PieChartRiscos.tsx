import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const data = [
  { name: 'Vermelho (Emergência)', value: 12, color: '#ef4444' },
  { name: 'Laranja (M. Urgente)', value: 25, color: '#f97316' },
  { name: 'Amarelo (Urgente)', value: 45, color: '#eab308' },
  { name: 'Verde (Pouco Urgente)', value: 60, color: '#22c55e' },
  { name: 'Azul (Não Urgente)', value: 18, color: '#3b82f6' },
];

interface Props {
  onClick?: () => void;
  expanded?: boolean;
}

export function PieChartRiscos({ onClick, expanded }: Props) {
  const chartContent = (
    <div className={`w-full ${expanded ? 'h-[500px]' : 'h-[250px]'}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={expanded ? 120 : 60}
            outerRadius={expanded ? 160 : 80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: expanded ? '16px' : '12px' }}
            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
          />
          <Legend verticalAlign="bottom" height={expanded ? 60 : 36} wrapperStyle={{ fontSize: expanded ? '14px' : '10px', paddingTop: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  if (expanded) return chartContent;

  return (
    <Card 
      className={`glass-card-premium h-full rounded-xl overflow-hidden shadow-sm ${onClick ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2 border-b border-white/10 dark:border-slate-800/20 bg-muted/30">
        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" /> Distribuição de Riscos
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-4">
        {chartContent}
      </CardContent>
    </Card>
  );
}
