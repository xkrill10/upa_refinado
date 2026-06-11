import React from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@/components/ThemeProvider";

interface DoctorData {
  doctorName: string;
  totalSeen: number;
}

interface DoctorPolarAreaProps {
  data: DoctorData[];
}

export function DoctorPolarArea({ data }: DoctorPolarAreaProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data || data.length === 0) return null;

  // Extract top 6 doctors to not overcrowd the chart
  const topDoctors = [...data]
    .sort((a, b) => b.totalSeen - a.totalSeen)
    .slice(0, 6);

  const series = topDoctors.map((d) => d.totalSeen);
  const labels = topDoctors.map((d) => d.doctorName);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "polarArea",
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    stroke: { colors: [isDark ? "#1e293b" : "#ffffff"] },
    fill: { opacity: 0.8 },
    labels: labels,
    theme: { mode: isDark ? "dark" : "light" },
    yaxis: { show: false },
    legend: {
      position: "right",
      fontSize: "11px",
      labels: { colors: isDark ? "#94a3b8" : "#64748b" },
    },
    plotOptions: {
      polarArea: {
        rings: { strokeWidth: 1, strokeColor: isDark ? "#334155" : "#e2e8f0" },
        spokes: {
          strokeWidth: 1,
          connectorColors: isDark ? "#334155" : "#e2e8f0",
        },
      },
    },
  };

  return (
    <div className="w-full flex justify-center pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
      <div className="w-full max-w-lg h-[250px]">
        <Chart
          options={options}
          series={series}
          type="polarArea"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}
