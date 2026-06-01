import { useState, useEffect } from 'react';

export function GlobalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${dayName}, ${day} de ${month} ${year} • ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="hidden lg:flex flex-col items-end px-5 border-r border-border/30">
      <span className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1 opacity-60">
        Data e Hora Atual
      </span>
      <span className="text-xs md:text-[13px] font-black text-foreground tracking-tight mission-control-title font-mono">
        {formatDateTime(time)}
      </span>
    </div>
  );
}
