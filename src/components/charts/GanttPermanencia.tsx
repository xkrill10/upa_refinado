import React from "react";
import Chart from "react-apexcharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function GanttPermanencia() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "rangeBar",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        rangeBarGroupRows: true,
      },
    },
    colors: ["#3b82f6", "#f97316", "#10b981", "#ef4444"],
    fill: { type: "solid" },
    xaxis: {
      type: "datetime",
      labels: { style: { colors: isDark ? "#94a3b8" : "#64748b" } },
    },
    yaxis: { labels: { style: { colors: isDark ? "#94a3b8" : "#64748b" } } },
    legend: { position: "top" },
    theme: { mode: isDark ? "dark" : "light" },
    tooltip: {
      x: { format: "HH:mm" },
    },
  };

  const today = new Date().setHours(0, 0, 0, 0);

  const series = [
    {
      name: "Triagem",
      data: [
        { x: "João S.", y: [today + 3600000 * 8, today + 3600000 * 8.5] },
        { x: "Maria L.", y: [today + 3600000 * 9, today + 3600000 * 9.2] },
        { x: "Carlos P.", y: [today + 3600000 * 10, today + 3600000 * 10.3] },
      ],
    },
    {
      name: "Espera Médica",
      data: [
        { x: "João S.", y: [today + 3600000 * 8.5, today + 3600000 * 10] },
        { x: "Maria L.", y: [today + 3600000 * 9.2, today + 3600000 * 9.5] },
        { x: "Carlos P.", y: [today + 3600000 * 10.3, today + 3600000 * 12] },
      ],
    },
    {
      name: "Atendimento",
      data: [
        { x: "João S.", y: [today + 3600000 * 10, today + 3600000 * 10.5] },
        { x: "Maria L.", y: [today + 3600000 * 9.5, today + 3600000 * 10.2] },
        { x: "Carlos P.", y: [today + 3600000 * 12, today + 3600000 * 12.4] },
      ],
    },
    {
      name: "Medicação/Exames",
      data: [
        { x: "João S.", y: [today + 3600000 * 10.5, today + 3600000 * 12.5] },
        { x: "Maria L.", y: [today + 3600000 * 10.2, today + 3600000 * 11.2] },
        { x: "Carlos P.", y: [0, 0] },
      ],
    },
  ];

  return (
    <Card className="glass-card-premium h-full rounded-xl overflow-hidden shadow-sm">
      <CardHeader className="p-4 pb-0 border-b border-white/10 dark:border-slate-800/20 bg-muted/30">
        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <Clock className="h-4 w-4 text-purple-500" /> Jornada do Paciente (SLA
          de Permanência)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-2 pb-2">
        <div className="h-[280px] w-full">
          <Chart
            options={options}
            series={series}
            type="rangeBar"
            height="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}
