import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function BoxPlotEspera() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'boxPlot',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#008FFB', '#FEB019'],
    title: {
      text: 'Dispersão em Minutos',
      align: 'left',
      style: { color: isDark ? '#94a3b8' : '#64748b', fontSize: '10px', fontWeight: 'bold' }
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: '#ef4444',
          lower: '#3b82f6'
        }
      }
    },
    xaxis: { labels: { style: { colors: isDark ? '#94a3b8' : '#64748b' } } },
    yaxis: { labels: { style: { colors: isDark ? '#94a3b8' : '#64748b' } } },
    theme: { mode: isDark ? 'dark' : 'light' }
  };

  const series = [
    {
      type: 'boxPlot',
      data: [
        { x: 'Emergência', y: [0, 0, 0, 2, 5] },
        { x: 'M. Urgente', y: [2, 5, 8, 12, 18] },
        { x: 'Urgente', y: [15, 25, 40, 55, 90] },
        { x: 'Pouco Urgente', y: [30, 45, 80, 110, 180] },
        { x: 'Não Urgente', y: [60, 90, 120, 180, 240] }
      ]
    }
  ];

  return (
    <Card className="glass-card-premium h-full rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="p-4 pb-0 border-b border-white/10 dark:border-slate-800/20 bg-muted/30">
        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500" /> Variação do Tempo de Espera (Outliers)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-2 pb-2">
        <div className="h-[280px] w-full">
          <Chart options={options} series={series} type="boxPlot" height="100%" />
        </div>
      </CardContent>
    </Card>
  );
}
