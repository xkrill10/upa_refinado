import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface VitalSignsTimelineProps {
  currentHr?: string | number;
  currentSpo2?: string | number;
  currentTemp?: string | number;
}

export function VitalSignsTimeline({ currentHr, currentSpo2, currentTemp }: VitalSignsTimelineProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Gerador de dados mock baseado nos valores atuais para desenhar uma onda realista
  const { series, categories } = useMemo(() => {
    const hr = parseInt(String(currentHr)) || 80;
    const spo2 = parseInt(String(currentSpo2)) || 98;
    const temp = parseFloat(String(currentTemp)) || 36.5;

    const dataHr = [];
    const dataSpo2 = [];
    const dataTemp = [];
    const cats = [];
    
    const now = new Date();
    
    // Gerar 6 pontos de dados (últimas 6 horas) terminando no valor atual
    for (let i = 5; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      cats.push(`${time.getHours().toString().padStart(2, '0')}:00`);
      
      if (i === 0) {
        // Último ponto é exatamente o valor atual da triagem
        dataHr.push(hr);
        dataSpo2.push(spo2);
        dataTemp.push(temp);
      } else {
        // Valores anteriores oscilam ligeiramente
        dataHr.push(Math.max(40, hr + (Math.random() * 10 - 5)));
        dataSpo2.push(Math.min(100, spo2 + (Math.random() * 2 - 1)));
        dataTemp.push(temp + (Math.random() * 0.6 - 0.3));
      }
    }

    return {
      categories: cats,
      series: [
        { name: 'FC (BPM)', data: dataHr.map(n => Math.round(n)) },
        { name: 'SpO2 (%)', data: dataSpo2.map(n => Math.round(n)) },
        { name: 'Temp (°C)', data: dataTemp.map(n => parseFloat(n.toFixed(1))) }
      ]
    };
  }, [currentHr, currentSpo2, currentTemp]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#ef4444', '#3b82f6', '#f59e0b'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: [3, 3, 3] },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: categories,
      labels: { style: { colors: isDark ? '#94a3b8' : '#64748b', fontSize: '10px' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: [
      {
        seriesName: 'FC (BPM)',
        labels: { style: { colors: isDark ? '#ef4444' : '#b91c1c' }, formatter: (val) => val.toFixed(0) }
      },
      {
        seriesName: 'SpO2 (%)',
        opposite: true,
        labels: { style: { colors: isDark ? '#3b82f6' : '#1d4ed8' }, formatter: (val) => val.toFixed(0) }
      },
      {
        seriesName: 'Temp (°C)',
        show: false
      }
    ],
    theme: { mode: isDark ? 'dark' : 'light' },
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '11px' },
    tooltip: { theme: isDark ? 'dark' : 'light' }
  };

  return (
    <Card className="glass-card-premium rounded-xl overflow-hidden mt-6">
      <CardHeader className="p-4 pb-0 border-b border-white/10 dark:border-slate-800/20 bg-muted/30">
        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
          <Activity className="h-4 w-4" /> Evolução de Sinais Vitais (Últimas 6 horas)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-2 pb-2">
        <div className="h-[280px] w-full">
          <Chart options={options} series={series} type="area" height="100%" />
        </div>
      </CardContent>
    </Card>
  );
}
