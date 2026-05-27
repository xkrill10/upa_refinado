import { useState, useEffect } from "react";
import { Users, Clock, Stethoscope, CheckCircle, AlertTriangle, BedDouble, TrendingUp, Activity, Pill, PackageMinus, Building2, LogOut, Baby, HeartPulse } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/StatCard";
import { PatientQueueTable } from "@/components/PatientQueueTable";
import { usePatients } from "@/hooks/use-patients";
import { mockBeds } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useTheme } from "@/components/ThemeProvider";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { theme } = useTheme();
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'waiting' | 'attending' | 'critical' | 'central'>('all');
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [showKpiDialog, setShowKpiDialog] = useState(false);

  const waiting = patients.filter(p => p.status === 'waiting').length;
  const attending = patients.filter(p => p.status === 'attending').length;
  const completed = patients.filter(p => p.status === 'completed').length;
  const emergencies = patients.filter(p => p.risk === 'emergency' || p.risk === 'very-urgent').length;
  
  const filteredPatients = patients.filter(p => {
    if (dashboardFilter === 'waiting') return p.status === 'waiting';
    if (dashboardFilter === 'attending') return p.status === 'attending';
    if (dashboardFilter === 'critical') return p.risk === 'emergency' || p.risk === 'very-urgent';
    if (dashboardFilter === 'central') return p.status === 'waiting' || p.status === 'attending';
    return true;
  });

  const displayPatients = [...filteredPatients].sort((a, b) => a.arrivalTime > b.arrivalTime ? -1 : 1);

  const pediatricCount = patients.filter(p => p.priority === 'pediatric' || (p.ticket && p.ticket.startsWith('I'))).length;

  const totalBeds = mockBeds.length;
  const availableBeds = mockBeds.filter(b => b.status === 'available').length;
  const occupiedBeds = mockBeds.filter(b => b.status === 'occupied').length;
  const maintenanceBeds = mockBeds.filter(b => b.status === 'maintenance').length;

  const chartData = [
    { time: '06:00', atendimentos: 5 },
    { time: '08:00', atendimentos: 12 },
    { time: '10:00', atendimentos: 15 },
    { time: '12:00', atendimentos: 8 },
    { time: '14:00', atendimentos: 20 },
    { time: '16:00', atendimentos: 18 },
    { time: '18:00', atendimentos: 25 },
  ];

  const pharmacyConsumptionData = [
    { name: 'Dipirona',  quantidade: 145, fill: '#10b981' },
    { name: 'Tramadol',  quantidade: 56, fill: '#a855f7' },
    { name: 'Soro',  quantidade: 230, fill: '#3b82f6' },
    { name: 'Ondansetrona', quantidade: 89, fill: '#f59e0b' },
    { name: 'Ceftriaxona', quantidade: 34, fill: '#ef4444' }
  ];

  const [pharmacyData, setPharmacyData] = useState([
    { time: '10:00', dipirona: 85, tramadol: 40, soro: 120 },
    { time: '10:05', dipirona: 84, tramadol: 38, soro: 115 },
    { time: '10:10', dipirona: 82, tramadol: 38, soro: 110 },
    { time: '10:15', dipirona: 80, tramadol: 36, soro: 105 },
    { time: '10:20', dipirona: 75, tramadol: 35, soro: 100 },
    { time: '10:25', dipirona: 72, tramadol: 33, soro: 95 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPharmacyData(prev => {
        const last = prev[prev.length - 1];
        const [h, m] = last.time.split(':').map(Number);
        
        let newM = m + 5;
        let newH = h;
        if (newM >= 60) {
          newM = 0;
          newH++;
        }
        
        const nextTime = `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
        
        const newDipirona = Math.max(0, last.dipirona - Math.floor(Math.random() * 5));
        const newTramadol = Math.max(0, last.tramadol - Math.floor(Math.random() * 3));
        const newSoro = Math.max(0, last.soro - Math.floor(Math.random() * 8));

        return [...prev.slice(1), { 
          time: nextTime, 
          dipirona: newDipirona, 
          tramadol: newTramadol, 
          soro: newSoro 
        }];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const waitingPatients = patients.filter(p => p.status === 'waiting');
  
  const getWaitTimeInMinutes = (arrivalTime: string) => {
    const arrival = new Date(arrivalTime);
    const now = new Date();
    const diffInMs = now.getTime() - arrival.getTime();
    let diffInMinutes = Math.floor(diffInMs / 60000);
    
    // Se for dado mock muito antigo (> 4h) ou no futuro, gera um valor fixo realista para a demo
    if (diffInMinutes > 240 || diffInMinutes < 0 || isNaN(diffInMinutes)) {
      const seed = Math.abs(arrival.getTime() % 40);
      diffInMinutes = 10 + (isNaN(seed) ? 5 : seed);
    }
    
    // Cap absoluto de segurança para evitar valores irreais em qualquer circunstância
    return Math.min(Math.max(0, diffInMinutes), 300);
  };

  const avgWaitTimeValue = waitingPatients.length > 0 
    ? Math.floor(waitingPatients.reduce((acc, p) => acc + getWaitTimeInMinutes(p.arrivalTime), 0) / waitingPatients.length)
    : 0;

  const kpis = [
    { id: 'wait', label: 'T. Médio Espera', value: `${avgWaitTimeValue} min`, icon: Clock, color: 'text-orange-500', trend: '-5m', sub: 'vs última hora' },
    { id: 'flow', label: 'Conversão Fluxo', value: '88%', icon: TrendingUp, color: 'text-emerald-500', trend: '+2%', sub: 'Altas / Entradas' },
    { id: 'evasion', label: 'Índice Evasão', value: '3.5%', icon: LogOut, color: 'text-red-500', trend: '-1%', sub: 'Desistências' },
    { id: 'nps', label: 'NPS (Satisfação)', value: '9.2', icon: CheckCircle, color: 'text-blue-500', trend: '+0.3', sub: 'Avaliação Média' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-[calc(100vh-3.5rem)] space-y-6 pb-12"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 dark:border-slate-800/10 pb-4">
        <div>
          <h1 className="text-3xl mission-control-title bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Sistema de Monitoramento</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
            <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
            Unidade de Pronto Atendimento - Status Real-Time
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Total Pacientes" 
          value={patients.length} 
          icon={Users} 
          variant="primary" 
          trend="Hoje" 
          onClick={() => setDashboardFilter('all')} 
          active={dashboardFilter === 'all'}
        />
        <StatCard 
          title="Aguardando" 
          value={waiting} 
          icon={Clock} 
          variant="warning" 
          onClick={() => setDashboardFilter('waiting')}
          active={dashboardFilter === 'waiting'}
        />
        <StatCard 
          title="Em Atendimento" 
          value={attending} 
          icon={Stethoscope} 
          variant="success" 
          onClick={() => setDashboardFilter('attending')}
          active={dashboardFilter === 'attending'}
        />
        <StatCard 
          title="Casos Críticos" 
          value={emergencies} 
          icon={AlertTriangle} 
          variant="danger" 
          onClick={() => setDashboardFilter('critical')}
          active={dashboardFilter === 'critical'}
        />
        <StatCard 
          title="Central de Atendimento" 
          value={waiting + attending} 
          icon={HeartPulse} 
          variant="accent" 
          trend="Painel Clínico" 
          onClick={() => setDashboardFilter('central')}
          active={dashboardFilter === 'central'}
        />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(() => {
          // Glass shadows, border and title colors custom styled, with exact real-time premium background gradient styles
          const kpiStyles: Record<string, string> = {
            wait: "border-amber-200/50 dark:border-amber-500/15 text-amber-950 dark:text-amber-100 shadow-[0_4px_12px_rgba(245,158,11,0.02)] hover:shadow-[0_12px_30px_rgba(245,158,11,0.2)]",
            flow: "border-emerald-200/50 dark:border-emerald-500/15 text-emerald-950 dark:text-emerald-100 shadow-[0_4px_12px_rgba(16,185,129,0.02)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.2)]",
            evasion: "border-red-200/50 dark:border-red-500/15 text-red-950 dark:text-red-100 shadow-[0_4px_12px_rgba(239,68,68,0.02)] hover:shadow-[0_12px_30px_rgba(239,68,68,0.2)]",
            nps: "border-blue-200/50 dark:border-blue-500/15 text-blue-950 dark:text-blue-100 shadow-[0_4px_12px_rgba(59,130,246,0.02)] hover:shadow-[0_12px_30px_rgba(59,130,246,0.2)]"
          };
          
          const labelColors: Record<string, string> = {
            wait: "text-amber-700/80 dark:text-amber-300/85 font-extrabold",
            flow: "text-emerald-700/80 dark:text-emerald-300/85 font-extrabold",
            evasion: "text-red-700/80 dark:text-red-300/85 font-extrabold",
            nps: "text-blue-700/80 dark:text-blue-300/85 font-extrabold"
          };

          const kpiGradientsLight: Record<string, string> = {
            wait: "linear-gradient(135deg, rgba(245, 158, 11, 0.17) 0%, rgba(245, 158, 11, 0.05) 50%, rgba(255, 255, 255, 0.38) 100%)",
            flow: "linear-gradient(135deg, rgba(16, 185, 129, 0.17) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(255, 255, 255, 0.38) 100%)",
            evasion: "linear-gradient(135deg, rgba(239, 68, 68, 0.17) 0%, rgba(239, 68, 68, 0.05) 50%, rgba(255, 255, 255, 0.38) 100%)",
            nps: "linear-gradient(135deg, rgba(59, 130, 246, 0.17) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(255, 255, 255, 0.38) 100%)"
          };

          const kpiGradientsDark: Record<string, string> = {
            wait: "linear-gradient(135deg, rgba(146, 64, 14, 0.32) 0%, rgba(120, 53, 4, 0.12) 50%, rgba(15, 24, 42, 0.48) 100%)",
            flow: "linear-gradient(135deg, rgba(6, 95, 70, 0.32) 0%, rgba(4, 120, 87, 0.12) 50%, rgba(15, 24, 42, 0.48) 100%)",
            evasion: "linear-gradient(135deg, rgba(153, 27, 27, 0.32) 0%, rgba(127, 29, 29, 0.12) 50%, rgba(15, 24, 42, 0.48) 100%)",
            nps: "linear-gradient(135deg, rgba(30, 64, 175, 0.32) 0%, rgba(30, 58, 138, 0.12) 50%, rgba(15, 24, 42, 0.48) 100%)"
          };

          return kpis.map((kpi) => (
            <motion.div 
              key={kpi.label} 
              onClick={() => {
                setSelectedKpi(kpi.id);
                setShowKpiDialog(true);
              }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "glass-card-premium p-5 rounded-xl flex flex-col gap-1 relative overflow-hidden group cursor-pointer transition-all duration-300 border select-none outline-none focus:outline-none focus:ring-0",
                kpiStyles[kpi.id]
              )}
              style={{
                background: theme === 'dark' ? kpiGradientsDark[kpi.id] : kpiGradientsLight[kpi.id]
              }}
            >
              {/* Background Glow Circle */}
              <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              
              {/* Dot Backplate pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

              {/* Large floating backdrop icon */}
              <div className="absolute right-[-10%] top-[-10%] opacity-5 group-hover:opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                <kpi.icon className="h-16 w-16" />
              </div>

              {/* Card Contents */}
              <div className="flex items-center gap-2 relative z-10">
                <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                <span className={cn("text-[9px] font-black uppercase tracking-wider", labelColors[kpi.id])}>{kpi.label}</span>
              </div>
              
              <div className="flex items-baseline gap-2 mt-1 relative z-10">
                <span className="text-xl font-black leading-none">{kpi.value}</span>
                <span className={cn("text-[10px] font-bold", kpi.trend.startsWith('+') ? 'text-emerald-500' : 'text-orange-500')}>
                  {kpi.trend}
                </span>
              </div>
              
              <span className={cn("text-[9px] font-semibold opacity-70 relative z-10", labelColors[kpi.id])}>{kpi.sub}</span>
            </motion.div>
          ));
        })()}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="glass-card-premium overflow-hidden h-full rounded-xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5">
            <CardHeader className="p-6 pb-3 border-b border-white/20 dark:border-slate-800/20 bg-white/10 dark:bg-slate-950/10">
              <CardTitle className="text-sm data-label flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  CENTRAL DE ATENDIMENTO / {
                    dashboardFilter === 'all' ? 'FILA RECENTE' :
                    dashboardFilter === 'waiting' ? 'PACIENTES AGUARDANDO' :
                    dashboardFilter === 'attending' ? 'EM ATENDIMENTO' :
                    dashboardFilter === 'central' ? 'TODOS EM ATENDIMENTO / AGUARDANDO' : 'CASOS CRÍTICOS'
                  }
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-black">
                  {filteredPatients.length} resultados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[580px] overflow-y-auto scrollbar-thin">
              <PatientQueueTable patients={displayPatients} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <Card className="glass-card-premium rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5">
            <CardHeader className="p-6 pb-3 border-b border-white/20 dark:border-slate-800/20 bg-white/10 dark:bg-slate-950/10">
              <CardTitle className="data-label flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                OCUPAÇÃO POR SETOR
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              {[
                { name: 'Emergência 1', count: 2, max: 1, color: 'bg-red-600' },
                { name: 'Emergência 2', count: 2, max: 1, color: 'bg-orange-500' },
                { name: 'Consultório Clínico 1', count: 1, max: 2, color: 'bg-yellow-500' },
                { name: 'Consultório Clínico 2', count: 2, max: 2, color: 'bg-green-500' },
                { name: 'Observação 1', count: 0, max: 1, color: 'bg-blue-500' },
              ].map(sector => (
                <div key={sector.name} className="group">
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
                    <span className="group-hover:text-primary transition-colors">{sector.name}</span>
                    <span className="text-muted-foreground font-mono">{sector.count}/{sector.max}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border/50 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(sector.count / sector.max) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${sector.color} shadow-sm`}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card-premium rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5">
            <CardHeader className="p-6 pb-3 border-b border-white/20 dark:border-slate-850/20 bg-white/10 dark:bg-slate-950/10">
              <CardTitle className="data-label flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-primary" />
                SITUAÇÃO DOS LEITOS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                  <span className="text-[hsl(var(--risk-emergency))]">OCUPADOS</span>
                  <span className="font-mono">{occupiedBeds}/{totalBeds}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border/50 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(occupiedBeds / totalBeds) * 100}%` }}
                    className="h-full rounded-full bg-[hsl(var(--risk-emergency))] opacity-90 shadow-lg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                  <span className="text-primary">DISPONÍVEIS</span>
                  <span className="font-mono">{availableBeds}/{totalBeds}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border/50 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(availableBeds / totalBeds) * 100}%` }}
                    className="h-full rounded-full bg-primary opacity-90 shadow-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="glass-card-premium rounded-xl overflow-hidden h-full group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5">
            <CardHeader className="p-6 pb-3 border-b border-white/20 dark:border-slate-800/20 bg-white/10 dark:bg-slate-950/10">
              <CardTitle className="text-xs data-label flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  ANALÍTICO / FLUXO DIÁRIO
                </div>
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                   <span className="text-[9px] font-bold opacity-50">AO VIVO</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAtendimentos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <filter id="shadow" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                        <feOffset dx="0" dy="4" result="offsetblur" />
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="0.5" />
                        </feComponentTransfer>
                        <feMerge>
                          <feMergeNode />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '16px', border: '1px solid hsl(var(--primary)/0.2)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="atendimentos" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorAtendimentos)" 
                      style={{ filter: 'url(#shadow)' }}
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-card-premium rounded-xl overflow-hidden h-full group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5">
            <CardHeader className="p-6 pb-3 border-b border-white/20 dark:border-slate-850/20 bg-white/10 dark:bg-slate-950/10">
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                OCUPAÇÃO GERAL
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="30%" 
                    outerRadius="100%" 
                    barSize={15} 
                    data={[
                      { name: 'Total', value: patients.length, fill: 'hsl(var(--primary))' },
                      { name: 'Espera', value: waiting, fill: '#eab308' },
                      { name: 'Atend.', value: attending, fill: '#10b981' },
                      { name: 'Críticos', value: emergencies, fill: '#ef4444' },
                    ]}
                  >
                    <RadialBar
                      label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
                      background
                      dataKey="value"
                      cornerRadius={10}
                      animationDuration={1500}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: 'none' }}
                    />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ top: '50%', right: 0, transform: 'translate(0, -50%)', fontSize: '10px', fontWeight: 'bold' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <motion.div variants={item}>
          <Card className="glass-card-premium rounded-xl overflow-hidden h-full group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5">
            <CardHeader className="p-6 pb-3 border-b border-white/20 dark:border-slate-800/20 bg-white/10 dark:bg-slate-950/10 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Pill className="h-5 w-5 text-emerald-500" />
                Estoque da Farmácia
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pharmacyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Line type="monotone" dataKey="dipirona" name="Dipirona" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="soro" name="Soro Fisiológico" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-card-premium rounded-xl overflow-hidden h-full group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5">
            <CardHeader className="p-6 pb-3 border-b border-white/20 dark:border-slate-850/20 bg-white/10 dark:bg-slate-950/10 mb-2">
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <PackageMinus className="h-5 w-5 text-purple-500" />
                CONSUMO DE MEDICAMENTOS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pharmacyConsumptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      {pharmacyConsumptionData.map((entry, index) => (
                        <linearGradient key={`grad-${index}`} id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={entry.fill} stopOpacity={1}/>
                          <stop offset="100%" stopColor={entry.fill} stopOpacity={0.6}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="quantidade" radius={[10, 10, 0, 0]} barSize={35} animationDuration={2000}>
                      {pharmacyConsumptionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Dialog open={showKpiDialog} onOpenChange={setShowKpiDialog}>
        <DialogContent className="sm:max-w-[600px] border-none shadow-2xl p-0 overflow-hidden glass-card-premium rounded-2xl transition-colors duration-500">
          <DialogHeader className="p-8 pb-2">
            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              {selectedKpi === 'wait' && <><Clock className="text-orange-500" /> Detalhamento de Espera</>}
              {selectedKpi === 'flow' && <><TrendingUp className="text-emerald-500" /> Eficiência de Fluxo</>}
              {selectedKpi === 'evasion' && <><LogOut className="text-red-500" /> Analítico de Evasão</>}
              {selectedKpi === 'nps' && <><CheckCircle className="text-blue-500" /> Feedback de Pacientes</>}
            </DialogTitle>
            <DialogDescription className="font-extrabold text-[10px] uppercase tracking-widest text-muted-foreground/80">
              Dados consolidados das últimas 24 horas
            </DialogDescription>
          </DialogHeader>

          <div className="px-8 py-4">
            {selectedKpi === 'wait' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Emergência', time: '0 min', color: 'bg-red-500' },
                    { label: 'Muito Urgente', time: '8 min', color: 'bg-orange-500' },
                    { label: 'Urgente', time: '22 min', color: 'bg-yellow-500' },
                    { label: 'Pouco Urgente', time: '45 min', color: 'bg-emerald-500' },
                  ].map(item => (
                    <div key={item.label} className="p-4 rounded-xl border border-white/45 dark:border-slate-800/30 bg-white/20 dark:bg-slate-950/20 shadow-inner backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", item.color)} />
                        <span className="text-[10px] font-black uppercase tracking-[0.05em] text-muted-foreground/85">{item.label}</span>
                      </div>
                      <span className="text-xl font-black">{item.time}</span>
                    </div>
                  ))}
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: '08h', wait: 15 }, { name: '10h', wait: 25 }, { name: '12h', wait: 40 }, { name: '14h', wait: 30 }, { name: '16h', wait: 20 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} stroke="currentColor" />
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'rgba(255,255,255,0.92)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
                      <Bar dataKey="wait" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {selectedKpi === 'flow' && (
              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 dark:border-emerald-500/20 flex items-center justify-between backdrop-blur-sm shadow-inner transition-colors">
                  <div>
                    <p className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400">Taxa de Alta</p>
                    <p className="text-3xl font-black text-emerald-800 dark:text-emerald-300">88.4%</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-emerald-500 opacity-60" />
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { time: '06h', in: 10, out: 8 }, { time: '09h', in: 15, out: 12 }, { time: '12h', in: 25, out: 20 }, { time: '15h', in: 18, out: 22 }, { time: '18h', in: 30, out: 25 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} stroke="currentColor" />
                      <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'rgba(255,255,255,0.92)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
                      <Area type="monotone" dataKey="in" name="Entradas" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2.5} />
                      <Area type="monotone" dataKey="out" name="Altas" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {selectedKpi === 'evasion' && (
              <div className="space-y-5">
                <div className="bg-red-500/10 dark:bg-red-500/15 p-4 rounded-xl border border-red-500/30 dark:border-red-500/20 flex items-center gap-3 backdrop-blur-sm shadow-inner">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" /> 
                  <p className="text-xs font-black text-red-800 dark:text-red-400">
                    3 Pacientes desistiram na última hora
                  </p>
                </div>
                <div className="space-y-4 pt-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80 mb-2">Principais Motivos</p>
                  {[
                    { reason: 'Tempo de espera excedido', count: 12, pct: 75 },
                    { reason: 'Melhora espontânea', count: 3, pct: 18 },
                    { reason: 'Outros motivos', count: 1, pct: 7 },
                  ].map(item => (
                    <div key={item.reason} className="space-y-2">
                      <div className="flex justify-between text-xs font-black tracking-tight">
                        <span>{item.reason}</span>
                        <span className="text-muted-foreground">{item.count}</span>
                      </div>
                      <div className="h-2 w-full bg-white/20 dark:bg-slate-950/45 border border-white/30 dark:border-slate-800/20 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500/85 shadow-[0_0_10px_rgba(239,68,68,0.3)] rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedKpi === 'nps' && (
              <div className="space-y-5">
                <div className="flex items-center gap-5 p-4 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 dark:border-blue-500/20 shadow-inner backdrop-blur-sm">
                  <div className="h-16 w-16 rounded-full border-4 border-blue-500 flex items-center justify-center bg-white/40 dark:bg-slate-900/40">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">9.2</span>
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-blue-800 dark:text-blue-300">Excelente</p>
                    <p className="text-xs text-muted-foreground font-semibold">Baseado em 145 avaliações hoje</p>
                  </div>
                </div>
                <div className="space-y-3 pt-1">
                  {[
                    { user: 'Maria S.', comment: 'Atendimento muito rápido na triagem, enfermeiros atenciosos.', score: 10 },
                    { user: 'João P.', comment: 'O ar condicionado da recepção estava muito forte, mas o médico foi ótimo.', score: 8 },
                    { user: 'Carla M.', comment: 'Sistema de senhas muito organizado.', score: 9 },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl border border-white/40 dark:border-slate-800/30 bg-white/20 dark:bg-slate-950/20 shadow-inner backdrop-blur-sm">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">{item.user}</span>
                        <span className="text-[10px] font-black">⭐ {item.score}/10</span>
                      </div>
                      <p className="text-xs text-muted-foreground/90 font-medium italic">"{item.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-8 pt-2">
            <Button 
              className="w-full bg-[#006699] hover:bg-[#005580] text-white shadow-lg shadow-sky-500/10 rounded-xl h-12 font-black uppercase text-xs tracking-widest transition-all duration-300 hover:scale-[1.01]"
              onClick={() => setShowKpiDialog(false)}
            >
              Fechar Detalhamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

