import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function SankeyFluxoPaciente() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Using a Funnel Chart via ApexCharts as a simplified Sankey for the UI
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        barHeight: '70%',
        isFunnel: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
      },
      dropShadow: { enabled: true }
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
    xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { show: false },
    legend: { show: false },
    theme: { mode: isDark ? 'dark' : 'light' }
  };

  const series = [
    {
      name: 'Pacientes',
      data: [350, 320, 280, 150, 45]
    }
  ];

  const categories = ['Recepção', 'Triagem', 'Atendimento Médico', 'Medicação/Exames', 'Internação/UTI'];
  options.xaxis = { ...options.xaxis, categories };

  return (
    <Card className="glass-card-premium h-full rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="p-4 pb-0 border-b border-white/10 dark:border-slate-800/20 bg-muted/30">
        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-500" /> Funil de Conversão (Sankey Simples)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-2 pb-2">
        <div className="h-[280px] w-full">
          <Chart options={options} series={series} type="bar" height="100%" />
        </div>
      </CardContent>
    </Card>
  );
}
