import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function HeatmapOcupacao() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'heatmap',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    dataLabels: { enabled: false },
    colors: ['#008FFB'],
    xaxis: {
      categories: ['00h', '04h', '08h', '12h', '16h', '20h'],
      labels: { style: { colors: isDark ? '#94a3b8' : '#64748b' } }
    },
    yaxis: {
      labels: { style: { colors: isDark ? '#94a3b8' : '#64748b' } }
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 4,
        useFillColorAsStroke: false,
        colorScale: {
          ranges: [
            { from: 0, to: 20, color: '#10b981', name: 'Baixa (Verde)' },
            { from: 21, to: 60, color: '#eab308', name: 'Média (Amarelo)' },
            { from: 61, to: 100, color: '#ef4444', name: 'Alta (Vermelho)' }
          ]
        }
      }
    },
    theme: { mode: isDark ? 'dark' : 'light' }
  };

  const series = [
    { name: 'Seg', data: [15, 10, 45, 80, 75, 40] },
    { name: 'Ter', data: [10, 8, 50, 85, 90, 55] },
    { name: 'Qua', data: [20, 15, 60, 95, 85, 60] },
    { name: 'Qui', data: [18, 12, 55, 70, 65, 45] },
    { name: 'Sex', data: [30, 25, 75, 100, 95, 80] },
    { name: 'Sáb', data: [50, 40, 65, 80, 70, 85] },
    { name: 'Dom', data: [45, 35, 55, 60, 50, 65] }
  ];

  return (
    <Card className="glass-card-premium h-full rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="p-4 pb-0 border-b border-white/10 dark:border-slate-800/20 bg-muted/30">
        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <BedDouble className="h-4 w-4 text-cyan-500" /> Matriz Térmica de Ocupação (Dia x Hora)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-2 pb-2">
        <div className="h-[280px] w-full">
          <Chart options={options} series={series} type="heatmap" height="100%" />
        </div>
      </CardContent>
    </Card>
  );
}
