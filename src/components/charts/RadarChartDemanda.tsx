import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitySquare } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function RadarChartDemanda() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'radar',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      dropShadow: { enabled: true, blur: 4, left: 1, top: 1, opacity: 0.1 }
    },
    colors: ['#3b82f6', '#f59e0b'],
    stroke: { width: 2, curve: 'smooth' },
    fill: { opacity: 0.4 },
    markers: { size: 4, hover: { size: 6 } },
    xaxis: {
      categories: ['Triagem', 'Consultório Pediátrico', 'Consultório Clínico', 'Emergência', 'Medicação', 'Exames'],
      labels: {
        style: { colors: [isDark ? '#94a3b8' : '#64748b', isDark ? '#94a3b8' : '#64748b', isDark ? '#94a3b8' : '#64748b', isDark ? '#94a3b8' : '#64748b', isDark ? '#94a3b8' : '#64748b', isDark ? '#94a3b8' : '#64748b'], fontSize: '9px', fontWeight: 600 }
      }
    },
    yaxis: { show: false },
    theme: { mode: isDark ? 'dark' : 'light' },
    legend: { position: 'bottom', fontSize: '10px' }
  };

  const series = [
    { name: 'Demanda Atual', data: [80, 50, 90, 40, 60, 30] },
    { name: 'Média Histórica', data: [60, 40, 70, 35, 50, 45] }
  ];

  return (
    <Card className="glass-card-premium h-full rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="p-4 pb-0 border-b border-white/10 dark:border-slate-800/20 bg-muted/30">
        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <ActivitySquare className="h-4 w-4 text-blue-500" /> Demanda por Setor (Spider)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-2 pb-2 flex items-center justify-center">
        <div className="h-[250px] w-full">
          <Chart options={options} series={series} type="radar" height="100%" />
        </div>
      </CardContent>
    </Card>
  );
}
