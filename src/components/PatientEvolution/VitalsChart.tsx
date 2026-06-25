import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subHours } from 'date-fns';
import { Activity } from 'lucide-react';
import { Patient } from '@/context/PatientsContext';

interface VitalsChartProps {
  patient: Patient;
}

export function VitalsChart({ patient }: VitalsChartProps) {
  // Gera uma curva realista baseada no valor atual (último) para simular o histórico das últimas 12 horas.
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    // Parse current values (fallback to normal if empty)
    const currentTemp = parseFloat(patient.temperature?.replace(',', '.') || "36.5");
    const currentFc = parseInt(patient.fc || "80");
    const currentSpo2 = parseInt(patient.spo2 || "98");

    // Simular pontos 12h atrás, 9h, 6h, 3h, e Agora
    for (let i = 4; i >= 0; i--) {
      const pointTime = subHours(now, i * 3);
      
      // Criar variações suaves
      let tempVariation = 0;
      let fcVariation = 0;
      
      if (i > 0) {
        // Se tinha febre (>37.8), simular que antes estava mais alto
        if (currentTemp > 37.8) tempVariation = i * 0.2; 
        else tempVariation = (Math.random() * 0.6) - 0.3;
        
        if (currentFc > 100) fcVariation = i * 5;
        else fcVariation = Math.floor(Math.random() * 10) - 5;
      }

      data.push({
        time: format(pointTime, "HH:mm"),
        Temperatura: +(currentTemp + tempVariation).toFixed(1),
        FC: currentFc + fcVariation,
        SpO2: Math.min(100, currentSpo2 - (i > 0 ? Math.floor(Math.random() * 2) : 0))
      });
    }
    
    return data;
  }, [patient.temperature, patient.fc, patient.spo2]);

  return (
    <Card className="glass-card-premium border-white/40 dark:border-white/10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-black uppercase text-foreground tracking-widest">
          <Activity className="h-4 w-4 text-emerald-500" />
          Curva de Sinais Vitais (Últimas 12h)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="currentColor" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                className="opacity-50 font-bold"
              />
              <YAxis 
                yAxisId="left" 
                stroke="currentColor" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                className="opacity-50 font-bold" 
                domain={['auto', 'auto']} 
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="currentColor" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                className="opacity-50 font-bold" 
                domain={[35, 41]} 
              />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#000', fontWeight: 'bold' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
              
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="FC" 
                stroke="#f43f5e" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 6 }} 
                name="Frequência Cardíaca (bpm)"
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="Temperatura" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 6 }} 
                name="Temperatura (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
