import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DailyStaffChart({ scheduleEntries, daysInMonth = 31 }) {
  const data = useMemo(() => {
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      let present = 0;
      let absent = 0;
      scheduleEntries.forEach(entry => {
        const val = entry.days?.[String(d)];
        if (val === 'P') present++;
        else if (val && val !== '') absent++;
      });
      days.push({ day: d, presentes: present, ausentes: absent });
    }
    return days;
  }, [scheduleEntries, daysInMonth]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-card rounded-xl border border-border p-5"
    >
      <h3 className="text-sm font-semibold mb-4">Dimensionamento Diário — Presentes vs Ausentes</h3>
      <div className="h-72" style={{ width: '100%' }}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPresent_v2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAbsent_v2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Area type="monotone" dataKey="presentes" stroke="#0ea5e9" fill="url(#colorPresent_v2)" strokeWidth={3} isAnimationActive={false} />
            <Area type="monotone" dataKey="ausentes" stroke="#ef4444" fill="url(#colorAbsent_v2)" strokeWidth={3} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}