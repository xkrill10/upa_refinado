import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface RadialGaugeProps {
  occupied: number;
  available: number;
  cleaning: number;
  maintenance: number;
  total: number;
  pure?: boolean;
}

export function RadialGaugeLeitos({ occupied, available, cleaning, maintenance, total, pure }: RadialGaugeProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const occupiedPct = total > 0 ? Math.round((occupied / total) * 100) : 0;
  const availablePct = total > 0 ? Math.round((available / total) * 100) : 0;
  const cleaningPct = total > 0 ? Math.round((cleaning / total) * 100) : 0;

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'radialBar',
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
    },
    colors: ['#ef4444', '#10b981', '#06b6d4'],
    plotOptions: {
      radialBar: {
        hollow: { size: '30%', background: 'transparent' },
        track: {
          background: isDark ? '#1e293b' : '#e2e8f0',
          strokeWidth: '100%',
        },
        dataLabels: {
          name: { fontSize: '10px', color: isDark ? '#94a3b8' : '#64748b' },
          value: { fontSize: '16px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' },
          total: {
            show: true,
            label: 'Ocupação',
            color: isDark ? '#f8fafc' : '#0f172a',
            formatter: function (w) {
              return occupiedPct + '%'
            }
          }
        }
      }
    },
    labels: ['Ocupados', 'Livres', 'Limpeza'],
    stroke: { lineCap: 'round' },
    theme: { mode: isDark ? 'dark' : 'light' },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '10px',
      labels: { colors: isDark ? '#94a3b8' : '#64748b' }
    }
  };

  const series = [occupiedPct, availablePct, cleaningPct];

  const chartContent = (
    <div className="w-full h-[260px] flex items-center justify-center">
      <Chart options={options} series={series} type="radialBar" height="100%" width="100%" />
    </div>
  );

  if (pure) return chartContent;

  return (
    <Card className="glass-card-premium rounded-xl overflow-hidden group transition-all hover:shadow-xl">
      <CardHeader className="p-5 pb-0 border-b border-white/20 bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
          <BedDouble className="h-4 w-4" /> MAPA DE LEITOS (TEMPO REAL)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-0 flex items-center justify-center">
        {chartContent}
      </CardContent>
    </Card>
  );
}
