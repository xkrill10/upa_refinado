import { useState, useEffect } from "react";
import { Users, Clock, Stethoscope, CheckCircle, AlertTriangle, BedDouble, TrendingUp, Activity, Pill, PackageMinus, Building2, LogOut, Baby, HeartPulse, Sparkles, TerminalSquare } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/StatCard";
import { PatientQueueTable } from "@/components/PatientQueueTable";
import { usePatients } from "@/hooks/use-patients";
import { useBeds } from "@/context/BedsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/components/ThemeProvider";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { beds, getStats, cleaningHistory } = useBeds();
  const { theme } = useTheme();
  
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'waiting' | 'attending' | 'critical' | 'central'>('all');
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [showKpiDialog, setShowKpiDialog] = useState(false);
  const [liveFeed, setLiveFeed] = useState<{id: number, text: string, time: string, type: 'gov' | 'med' | 'alert'}[]>([]);

  // Simulated Live Feed generation based on real context data
  useEffect(() => {
    // Generate initial feed
    const initialFeed = cleaningHistory.slice(0, 3).map((log, i) => ({
      id: Date.now() - i * 1000,
      text: `${log.cleanerName} finalizou a higienização do ${log.bedName}`,
      time: log.finishedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'gov' as const
    }));

    initialFeed.push({ id: Date.now() - 5000, text: 'Ocupação da UTI atingiu 85%', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: 'alert' });
    setLiveFeed(initialFeed);

    // Add new items every few seconds to simulate real-time
    const interval = setInterval(() => {
      const types = ['gov', 'med', 'alert'];
      const randType = types[Math.floor(Math.random() * types.length)] as any;
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      let text = "";
      if (randType === 'gov') text = "Novo leito de Emergência liberado para limpeza.";
      if (randType === 'med') text = `Paciente classificado como ${Math.random() > 0.5 ? 'Vermelho' : 'Laranja'} na Triagem.`;
      if (randType === 'alert') text = "Farmácia: Nível de Dipirona baixo no estoque.";

      setLiveFeed(prev => [{ id: Date.now(), text, time: now, type: randType }, ...prev].slice(0, 10));
    }, 6500);

    return () => clearInterval(interval);
  }, [cleaningHistory]);

  const waiting = patients.filter(p => p.status === 'waiting').length;
  const attending = patients.filter(p => p.status === 'attending').length;
  const emergencies = patients.filter(p => p.risk === 'emergency' || p.risk === 'very-urgent').length;
  
  const filteredPatients = patients.filter(p => {
    if (dashboardFilter === 'waiting') return p.status === 'waiting';
    if (dashboardFilter === 'attending') return p.status === 'attending';
    if (dashboardFilter === 'critical') return p.risk === 'emergency' || p.risk === 'very-urgent';
    if (dashboardFilter === 'central') return p.status === 'waiting' || p.status === 'attending';
    return true;
  });

  const displayPatients = [...filteredPatients].sort((a, b) => a.arrivalTime > b.arrivalTime ? -1 : 1);

  // Beds data from Context!
  const bedStats = getStats();
  const totalBeds = beds.length;

  const chartData = [
    { time: '06:00', atendimentos: 5 }, { time: '08:00', atendimentos: 12 }, { time: '10:00', atendimentos: 15 },
    { time: '12:00', atendimentos: 8 }, { time: '14:00', atendimentos: 20 }, { time: '16:00', atendimentos: 18 },
    { time: '18:00', atendimentos: 25 },
  ];

  const pharmacyConsumptionData = [
    { name: 'Dipirona',  quantidade: 145, fill: '#10b981' }, { name: 'Tramadol',  quantidade: 56, fill: '#a855f7' },
    { name: 'Soro',  quantidade: 230, fill: '#3b82f6' }, { name: 'Ondansetrona', quantidade: 89, fill: '#f59e0b' },
    { name: 'Ceftriaxona', quantidade: 34, fill: '#ef4444' }
  ];

  const [pharmacyData] = useState([
    { time: '10:00', dipirona: 85, tramadol: 40, soro: 120 }, { time: '10:05', dipirona: 84, tramadol: 38, soro: 115 },
    { time: '10:10', dipirona: 82, tramadol: 38, soro: 110 }, { time: '10:15', dipirona: 80, tramadol: 36, soro: 105 },
    { time: '10:20', dipirona: 75, tramadol: 35, soro: 100 }, { time: '10:25', dipirona: 72, tramadol: 33, soro: 95 },
  ]);

  const avgWaitTimeValue = 24; // Mock calculado
  
  // Calcula SLA Medio de Higienizacao
  const avgSla = cleaningHistory.length > 0 
    ? Math.floor(cleaningHistory.reduce((acc, log) => acc + log.durationMinutes, 0) / cleaningHistory.length)
    : 18;

  const kpis = [
    { id: 'wait', label: 'Espera Médica', value: `${avgWaitTimeValue} min`, icon: Clock, color: 'text-orange-500', trend: '-5m', sub: 'vs última hora' },
    { id: 'flow', label: 'Conversão', value: '88%', icon: TrendingUp, color: 'text-emerald-500', trend: '+2%', sub: 'Altas / Entradas' },
    { id: 'sla', label: 'Giro de Leito (SLA)', value: `${avgSla} min`, icon: Sparkles, color: 'text-cyan-500', trend: '-2m', sub: 'Governança' },
    { id: 'evasion', label: 'Evasão', value: '3.5%', icon: LogOut, color: 'text-red-500', trend: '-1%', sub: 'Desistências' },
    { id: 'nps', label: 'Satisfação', value: '9.2', icon: CheckCircle, color: 'text-blue-500', trend: '+0.3', sub: 'NPS' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-[calc(100vh-3.5rem)] space-y-6 pb-12">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 dark:border-slate-800/10 pb-4">
        <div>
          <h1 className="text-3xl mission-control-title bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Centro de Comando</h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
            <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
            Visão Global do Hospital - Tempo Real
          </p>
        </div>
      </motion.div>

      {/* Cards de Triagem/Pacientes */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Pacientes" value={patients.length} icon={Users} variant="primary" trend="Hoje" onClick={() => setDashboardFilter('all')} active={dashboardFilter === 'all'} />
        <StatCard title="Aguardando" value={waiting} icon={Clock} variant="warning" onClick={() => setDashboardFilter('waiting')} active={dashboardFilter === 'waiting'} />
        <StatCard title="Em Atendimento" value={attending} icon={Stethoscope} variant="success" onClick={() => setDashboardFilter('attending')} active={dashboardFilter === 'attending'} />
        <StatCard title="Casos Críticos" value={emergencies} icon={AlertTriangle} variant="danger" onClick={() => setDashboardFilter('critical')} active={dashboardFilter === 'critical'} />
        <StatCard title="Central de Leitos" value={bedStats.occupied} icon={BedDouble} variant="accent" trend="Ocupados" onClick={() => navigate('/beds')} />
      </motion.div>

      {/* KPIs Premium com Gradientes */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <motion.div 
            key={kpi.label} 
            onClick={() => { setSelectedKpi(kpi.id); setShowKpiDialog(true); }}
            whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
            className="glass-card-premium p-4 rounded-xl flex flex-col gap-1 relative overflow-hidden group cursor-pointer transition-all border shadow-sm hover:shadow-lg"
          >
            <div className="absolute right-[-10%] top-[-10%] opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all">
              <kpi.icon className="h-16 w-16" />
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <kpi.icon className={cn("h-4 w-4", kpi.color)} />
              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1 relative z-10">
              <span className="text-xl font-black leading-none">{kpi.value}</span>
              <span className={cn("text-[10px] font-bold", kpi.trend.startsWith('+') ? 'text-emerald-500' : 'text-orange-500')}>{kpi.trend}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel Central de Atendimento */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="glass-card-premium overflow-hidden h-full rounded-xl group transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="p-6 pb-3 border-b border-white/20 dark:border-slate-800/20 bg-muted/30">
              <CardTitle className="text-sm flex items-center justify-between gap-2 uppercase font-black">
                <div className="flex items-center gap-2 text-primary">
                  <Users className="h-4 w-4" />
                  ATENDIMENTOS CLÍNICOS
                </div>
                <Badge variant="outline" className="text-[10px]">{filteredPatients.length} resultados</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[450px] overflow-y-auto scrollbar-thin">
              <PatientQueueTable patients={displayPatients} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Heatmap de Leitos e Live Feed */}
        <motion.div variants={item} className="space-y-6 flex flex-col">
          {/* Mapa de Calor de Leitos */}
          <Card className="glass-card-premium rounded-xl overflow-hidden group transition-all">
            <CardHeader className="p-5 pb-2 border-b border-white/20 bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                <BedDouble className="h-4 w-4" /> MAPA DE CALOR: LEITOS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="h-6 w-full flex rounded-full overflow-hidden shadow-inner border border-border/50">
                {bedStats.occupied > 0 && <div style={{width: `${(bedStats.occupied/totalBeds)*100}%`}} className="bg-red-500 hover:opacity-80 transition-opacity" title="Ocupados" />}
                {bedStats.cleaning > 0 && <div style={{width: `${(bedStats.cleaning/totalBeds)*100}%`}} className="bg-cyan-500 hover:opacity-80 transition-opacity" title="Higienização" />}
                {bedStats.maintenance > 0 && <div style={{width: `${(bedStats.maintenance/totalBeds)*100}%`}} className="bg-orange-500 hover:opacity-80 transition-opacity" title="Manutenção" />}
                {bedStats.available > 0 && <div style={{width: `${(bedStats.available/totalBeds)*100}%`}} className="bg-emerald-500 hover:opacity-80 transition-opacity" title="Livres" />}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="flex items-center justify-between bg-muted/40 p-2 rounded-lg">
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground"><div className="w-2 h-2 rounded-full bg-red-500"/> Ocupados</span>
                  <span className="text-xs font-bold">{bedStats.occupied}</span>
                </div>
                <div className="flex items-center justify-between bg-muted/40 p-2 rounded-lg">
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Livres</span>
                  <span className="text-xs font-bold">{bedStats.available}</span>
                </div>
                <div className="flex items-center justify-between bg-muted/40 p-2 rounded-lg">
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground"><div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"/> Limpeza</span>
                  <span className="text-xs font-bold text-cyan-600">{bedStats.cleaning}</span>
                </div>
                <div className="flex items-center justify-between bg-muted/40 p-2 rounded-lg">
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground"><div className="w-2 h-2 rounded-full bg-orange-500"/> Interdit.</span>
                  <span className="text-xs font-bold">{bedStats.maintenance}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Activity Feed */}
          <Card className="glass-card-premium rounded-xl overflow-hidden flex-1 flex flex-col group border-primary/20">
            <CardHeader className="p-4 pb-2 border-b border-primary/10 bg-primary/5 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                <TerminalSquare className="h-4 w-4" /> SYSTEM FEED
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span>
                <span className="text-[8px] font-black uppercase tracking-widest text-primary">Live</span>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden relative flex-1 min-h-[220px] bg-black/5 dark:bg-black/20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 z-10 pointer-events-none" />
              <div className="p-4 space-y-3 relative z-0">
                <AnimatePresence>
                  {liveFeed.map(item => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex gap-3 text-xs font-mono"
                    >
                      <span className="text-muted-foreground/60 shrink-0">[{item.time}]</span>
                      <span className={cn(
                        "leading-relaxed",
                        item.type === 'alert' ? 'text-red-500 font-bold' : 
                        item.type === 'gov' ? 'text-cyan-600 dark:text-cyan-400' : 'text-foreground/80'
                      )}>
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <motion.div variants={item}>
          <Card className="glass-card-premium rounded-xl overflow-hidden h-full">
            <CardHeader className="p-6 pb-3 border-b border-white/20 bg-muted/30">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Pill className="h-4 w-4 text-emerald-500" /> Estoque de Apoio
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pharmacyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="dipirona" stroke="#10b981" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="soro" stroke="#3b82f6" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-card-premium rounded-xl overflow-hidden h-full">
            <CardHeader className="p-6 pb-3 border-b border-white/20 bg-muted/30">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <PackageMinus className="h-4 w-4 text-purple-500" /> Curva ABC Farmácia
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pharmacyConsumptionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Bar dataKey="quantidade" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
