import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface PatientBubble {
  id: string;
  name: string;
  age: number;
  waitTime: number;
  risk: 'emergency' | 'very-urgent' | 'urgent' | 'less-urgent' | 'not-urgent';
}

interface TriageBubbleChartProps {
  patientsWaiting: PatientBubble[];
}

export function TriageBubbleChart({ patientsWaiting }: TriageBubbleChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'emergency': return '#ef4444'; // Red
      case 'very-urgent': return '#f97316'; // Orange
      case 'urgent': return '#eab308'; // Yellow
      case 'less-urgent': return '#22c55e'; // Green
      default: return '#3b82f6'; // Blue
    }
  };

  const getRiskValue = (risk: string) => {
    switch (risk) {
      case 'emergency': return 50; 
      case 'very-urgent': return 40; 
      case 'urgent': return 30; 
      case 'less-urgent': return 20; 
      default: return 15; 
    }
  };

  // Mapear pacientes para o formato do gráfico: [x (tempo), y (idade), z (tamanho da bolha baseado no risco)]
  const dataSeries = patientsWaiting.map(p => ({
    name: p.name,
    data: [[p.waitTime, p.age, getRiskValue(p.risk)]],
    fillColor: getRiskColor(p.risk)
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bubble',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      animations: { enabled: true, easing: 'easeinout', speed: 800 }
    },
    dataLabels: { enabled: false },
    fill: { opacity: 0.8 },
    xaxis: {
      title: { text: 'Tempo de Espera (minutos)', style: { color: isDark ? '#94a3b8' : '#64748b' } },
      labels: { style: { colors: isDark ? '#94a3b8' : '#64748b' } },
      min: 0,
      max: Math.max(120, ...patientsWaiting.map(p => p.waitTime)) + 20,
    },
    yaxis: {
      title: { text: 'Idade (anos)', style: { color: isDark ? '#94a3b8' : '#64748b' } },
      labels: { style: { colors: isDark ? '#94a3b8' : '#64748b' } },
      min: 0,
      max: 100
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    legend: { show: false },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const patientName = w.config.series[seriesIndex].name;
        const data = w.config.series[seriesIndex].data[0];
        const waitTime = data[0];
        const age = data[1];
        return `
          <div style="padding: 8px; border-radius: 8px; font-family: Inter, sans-serif;">
            <div style="font-weight: 800; font-size: 12px; margin-bottom: 4px;">${patientName}</div>
            <div style="font-size: 11px;">Espera: <b style="color: #ef4444">${waitTime} min</b></div>
            <div style="font-size: 11px;">Idade: <b>${age} anos</b></div>
          </div>
        `;
      }
    }
  };

  return (
    <Card className="glass-card-premium rounded-xl overflow-hidden shadow-sm mb-6 border border-white/20 dark:border-slate-800/40">
      <CardHeader className="p-4 pb-0 border-b border-white/10 dark:border-slate-800/20 bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-indigo-500">
            <Users className="h-4 w-4" /> Radar de Triagem (Tempo x Idade x Risco)
          </CardTitle>
          {patientsWaiting.length > 0 && (
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
              <AlertTriangle className="h-3 w-3" /> Fila Ativa
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-2 pb-2">
        {patientsWaiting.length === 0 ? (
          <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest font-bold">
            Nenhum paciente aguardando triagem
          </div>
        ) : (
          <div className="h-[250px] w-full">
            <Chart options={options} series={dataSeries} type="bubble" height="100%" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
