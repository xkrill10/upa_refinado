import { useState, useEffect } from "react";
import {
  Users,
  Clock,
  Stethoscope,
  CheckCircle,
  AlertTriangle,
  BedDouble,
  TrendingUp,
  Activity,
  Pill,
  PackageMinus,
  Building2,
  LogOut,
  Baby,
  HeartPulse,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { PatientQueueTable } from "@/components/PatientQueueTable";
import { usePatients } from "@/hooks/use-patients";
import { useBeds } from "@/context/BedsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/components/ThemeProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChartFluxo } from "@/components/charts/AreaChartFluxo";
import { PieChartRiscos } from "@/components/charts/PieChartRiscos";
import { HeatmapOcupacao } from "@/components/charts/HeatmapOcupacao";
import { GanttPermanencia } from "@/components/charts/GanttPermanencia";
import { BoxPlotEspera } from "@/components/charts/BoxPlotEspera";
import { ParetoProblemas } from "@/components/charts/ParetoProblemas";
import { SankeyFluxoPaciente } from "@/components/charts/SankeyFluxoPaciente";
import { RadialGaugeLeitos } from "@/components/charts/RadialGaugeLeitos";
import { RadarChartDemanda } from "@/components/charts/RadarChartDemanda";
import { MiniMapaSatores } from "@/components/charts/MiniMapaSatores";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { beds, getStats, cleaningHistory } = useBeds();
  const { theme } = useTheme();

  const [dashboardFilter, setDashboardFilter] = useState<
    "all" | "waiting" | "attending" | "critical" | "central"
  >("all");
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);
  const [showKpiDialog, setShowKpiDialog] = useState(false);
  const [liveFeed, setLiveFeed] = useState<
    { id: number; text: string; time: string; type: "gov" | "med" | "alert" }[]
  >([]);

  // Modal States
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
  const [isFeedOpen, setIsFeedOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [isAbcOpen, setIsAbcOpen] = useState(false);
  const [isDemandaOpen, setIsDemandaOpen] = useState(false);
  const [isRiscosOpen, setIsRiscosOpen] = useState(false);
  const [isFluxoOpen, setIsFluxoOpen] = useState(false);

  // Simulated Live Feed generation based on real context data
  useEffect(() => {
    // Generate initial feed
    const initialFeed: {
      id: number;
      text: string;
      time: string;
      type: "gov" | "med" | "alert";
    }[] = cleaningHistory.slice(0, 3).map((log, i) => ({
      id: Date.now() - i * 1000,
      text: `${log.cleanerName} finalizou a higienização do ${log.bedName}`,
      time: log.finishedAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "gov" as const,
    }));

    initialFeed.push({
      id: Date.now() - 5000,
      text: "Ocupação da UTI atingiu 85%",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "alert",
    });
    setLiveFeed(initialFeed);

    // Add new items every few seconds to simulate real-time
    const interval = setInterval(() => {
      const types = ["gov", "med", "alert"];
      const randType = types[Math.floor(Math.random() * types.length)] as
        | "gov"
        | "med"
        | "alert";
      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      let text = "";
      if (randType === "gov")
        text = "Novo leito de Emergência liberado para limpeza.";
      if (randType === "med")
        text = `Paciente classificado como ${Math.random() > 0.5 ? "Vermelho" : "Laranja"} na Triagem.`;
      if (randType === "alert")
        text = "Farmácia: Nível de Dipirona baixo no estoque.";

      setLiveFeed((prev) =>
        [{ id: Date.now(), text, time: now, type: randType }, ...prev].slice(
          0,
          10,
        ),
      );
    }, 6500);

    return () => clearInterval(interval);
  }, [cleaningHistory]);

  const waiting = patients.filter((p) => p.status === "waiting").length;
  const attending = patients.filter((p) => p.status === "attending").length;
  const emergencies = patients.filter(
    (p) => p.risk === "emergency" || p.risk === "very-urgent",
  ).length;

  const filteredPatients = patients.filter((p) => {
    if (dashboardFilter === "waiting") return p.status === "waiting";
    if (dashboardFilter === "attending") return p.status === "attending";
    if (dashboardFilter === "critical")
      return p.risk === "emergency" || p.risk === "very-urgent";
    if (dashboardFilter === "central")
      return p.status === "waiting" || p.status === "attending";
    return true;
  });

  const displayPatients = [...filteredPatients].sort((a, b) =>
    a.arrivalTime > b.arrivalTime ? -1 : 1,
  );

  // Beds data from Context!
  const bedStats = getStats();
  const totalBeds = beds.length;

  const pharmacyConsumptionData = [
    { name: "Dipirona", quantidade: 145, fill: "#10b981" },
    { name: "Tramadol", quantidade: 56, fill: "#a855f7" },
    { name: "Soro", quantidade: 230, fill: "#3b82f6" },
    { name: "Ondansetrona", quantidade: 89, fill: "#f59e0b" },
    { name: "Ceftriaxona", quantidade: 34, fill: "#ef4444" },
  ];

  const predictiveDemandData = [
    { hour: "12:00", real: 15, previsto: 14 },
    { hour: "14:00", real: 20, previsto: 18 },
    { hour: "16:00", real: 18, previsto: 19 },
    { hour: "18:00", real: 25, previsto: 23 },
    { hour: "20:00", real: 22, previsto: 24 },
    { hour: "22:00", real: 15, previsto: 16 },
    { hour: "00:00", real: undefined, previsto: 10 },
    { hour: "02:00", real: undefined, previsto: 6 },
    { hour: "04:00", real: undefined, previsto: 5 },
    { hour: "06:00", real: undefined, previsto: 8 },
    { hour: "08:00", real: undefined, previsto: 13 },
    { hour: "10:00", real: undefined, previsto: 17 },
  ];

  const [pharmacyData] = useState([
    { time: "10:00", dipirona: 85, tramadol: 40, soro: 120 },
    { time: "10:05", dipirona: 84, tramadol: 38, soro: 115 },
    { time: "10:10", dipirona: 82, tramadol: 38, soro: 110 },
    { time: "10:15", dipirona: 80, tramadol: 36, soro: 105 },
    { time: "10:20", dipirona: 75, tramadol: 35, soro: 100 },
    { time: "10:25", dipirona: 72, tramadol: 33, soro: 95 },
  ]);

  const avgWaitTimeValue = 24; // Mock calculado

  // Calcula SLA Medio de Higienizacao
  const avgSla =
    cleaningHistory.length > 0
      ? Math.floor(
          cleaningHistory.reduce((acc, log) => acc + log.durationMinutes, 0) /
            cleaningHistory.length,
        )
      : 18;

  const kpis = [
    {
      id: "wait",
      label: "Espera Médica",
      value: `${avgWaitTimeValue} min`,
      icon: Clock,
      color: "text-orange-500",
      trend: "-5m",
      sub: "vs última hora",
    },
    {
      id: "flow",
      label: "Conversão",
      value: "88%",
      icon: TrendingUp,
      color: "text-emerald-500",
      trend: "+2%",
      sub: "Altas / Entradas",
    },
    {
      id: "sla",
      label: "Giro de Leito (SLA)",
      value: `${avgSla} min`,
      icon: Sparkles,
      color: "text-cyan-500",
      trend: "-2m",
      sub: "Governança",
    },
    {
      id: "evasion",
      label: "Evasão",
      value: "3.5%",
      icon: LogOut,
      color: "text-red-500",
      trend: "-1%",
      sub: "Desistências",
    },
    {
      id: "nps",
      label: "Satisfação",
      value: "9.2",
      icon: CheckCircle,
      color: "text-blue-500",
      trend: "+0.3",
      sub: "NPS",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-[calc(100vh-3.5rem)] space-y-6 pb-12"
    >
      <motion.div
        variants={item}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 dark:border-slate-800/10 pb-4"
      >
        <div>
          <h1 className="text-3xl mission-control-title bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Centro de Comando
          </h1>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
            <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
            Visão Global do Hospital - Tempo Real
          </p>
        </div>
      </motion.div>

      <Tabs defaultValue="operacional" className="w-full space-y-6">
        <div className="flex justify-center w-full mb-2">
          <TabsList className="grid w-full max-w-xl grid-cols-3 bg-black/10 dark:bg-black/40 border border-white/10 p-1 rounded-xl h-10 shadow-sm">
            <TabsTrigger
              value="operacional"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase tracking-widest text-[10px] h-8"
            >
              Visão Operacional
            </TabsTrigger>
            <TabsTrigger
              value="gestao"
              className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] h-8"
            >
              Visão Estratégica
            </TabsTrigger>
            <TabsTrigger
              value="preditiva"
              className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] h-8"
            >
              Visão Preditiva (IA)
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="operacional"
          className="space-y-6 mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          {/* Barra de Telemetria Consolidada - Alta Densidade */}
          <motion.div
            variants={item}
            className="glass-card-premium rounded-xl p-6 border border-white/20 dark:border-white/5 shadow-lg bg-gradient-to-r from-white/10 to-white/5 dark:from-slate-900/40 dark:to-slate-900/10 backdrop-blur-xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border/30 gap-y-4 md:gap-y-0 text-left">
              {/* Coluna 1: Total Pacientes */}
              <div className="px-6 flex flex-col justify-center first:pl-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Pacientes Ativos
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3.5xl font-black tracking-tight">
                    {patients.length}
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-sky-500/10 text-sky-600 border-none text-[8px] font-bold"
                  >
                    TOTAL
                  </Badge>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">
                  Registrados na UPA hoje
                </p>
              </div>

              {/* Coluna 2: Aguardando */}
              <div className="px-6 flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Aguardando Atendimento
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3.5xl font-black tracking-tight">
                    {waiting}
                  </span>
                  {waiting > 0 && (
                    <span className="flex h-2 w-2 relative -top-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">
                  Fila da triagem concluída
                </p>
              </div>

              {/* Coluna 3: Em Atendimento */}
              <div className="px-6 flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Em Consulta
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3.5xl font-black tracking-tight">
                    {attending}
                  </span>
                  {attending > 0 && (
                    <span className="flex h-2 w-2 relative -top-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">
                  Consultas em andamento
                </p>
              </div>

              {/* Coluna 4: Casos Críticos */}
              <div className="px-6 flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Casos Críticos (P0/P1)
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3.5xl font-black tracking-tight text-red-500">
                    {emergencies}
                  </span>
                  {emergencies > 0 && (
                    <span className="flex h-2 w-2 relative -top-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">
                  Emergência / Muito Urgente
                </p>
              </div>

              {/* Coluna 5: Ocupação Leitos */}
              <div className="px-6 flex flex-col justify-center last:pr-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Ocupação de Leitos
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3.5xl font-black tracking-tight">
                    {totalBeds > 0
                      ? Math.round((bedStats.occupied / totalBeds) * 100)
                      : 0}
                    %
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-none text-[8px] font-bold",
                      bedStats.occupied / totalBeds > 0.8
                        ? "bg-red-500/10 text-red-500"
                        : "bg-emerald-500/10 text-emerald-500",
                    )}
                  >
                    {bedStats.occupied}/{totalBeds} LEITOS
                  </Badge>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">
                  Emergência e observação
                </p>
              </div>
            </div>
          </motion.div>

          {/* Área Principal de Trabalho: Fila (Esquerda) e Hub de Recursos (Direita) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Esquerda: Fila de Atendimento */}
            <motion.div variants={item} className="lg:col-span-8">
              <Card className="glass-card-premium overflow-hidden h-full rounded-xl border border-white/20 dark:border-white/5 shadow-lg">
                <CardHeader className="p-8 pb-4 border-b border-border/20 bg-muted/10 flex flex-row items-center justify-between flex-wrap gap-4">
                  <div className="text-left">
                    <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary animate-pulse" />
                      Fila de Atendimento UPA
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      Controle de fluxo de pacientes triados e consultas médicas
                    </p>
                  </div>

                  {/* Filtro inline em formato de pílulas premium */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "all", label: "Todos" },
                      { id: "waiting", label: "Aguardando" },
                      { id: "attending", label: "Em Consulta" },
                      { id: "critical", label: "Críticos" },
                    ].map((filterOpt) => (
                      <Button
                        key={filterOpt.id}
                        variant="ghost"
                        onClick={() => setDashboardFilter(filterOpt.id as any)}
                        className={cn(
                          "h-8 px-3 rounded-md text-[10px] font-black uppercase tracking-wider transition-all",
                          dashboardFilter === filterOpt.id
                            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                            : "text-muted-foreground hover:bg-muted/50",
                        )}
                      >
                        {filterOpt.label}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto max-h-[500px]">
                  <PatientQueueTable patients={displayPatients} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Direita: Hub de Recursos e Analytics em abas */}
            <motion.div variants={item} className="lg:col-span-4 h-full">
              <Card className="glass-card-premium rounded-xl border border-white/20 dark:border-white/5 shadow-lg overflow-hidden flex flex-col">
                <Tabs defaultValue="leitos" className="w-full flex flex-col">
                  <div className="p-6 pb-2 border-b border-border/20 bg-muted/15">
                    <TabsList className="grid w-full grid-cols-4 bg-black/10 dark:bg-black/40 border border-white/10 p-0.5 rounded-lg h-11 shadow-inner">
                      <TabsTrigger
                        value="leitos"
                        className="rounded-md text-[8px] font-black uppercase tracking-wider h-9"
                      >
                        Leitos
                      </TabsTrigger>
                      <TabsTrigger
                        value="insumos"
                        className="rounded-md text-[8px] font-black uppercase tracking-wider h-9"
                      >
                        Insumos
                      </TabsTrigger>
                      <TabsTrigger
                        value="operacional"
                        className="rounded-md text-[8px] font-black uppercase tracking-wider h-9"
                      >
                        Gráficos
                      </TabsTrigger>
                      <TabsTrigger
                        value="feed"
                        className="rounded-md text-[8px] font-black uppercase tracking-wider h-9 flex items-center gap-1"
                      >
                        Feed
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6 flex-1 min-h-[420px] flex flex-col justify-between">
                    {/* Tab 1: Censo de Leitos */}
                    <TabsContent
                      value="leitos"
                      className="space-y-6 mt-0 focus-visible:outline-none focus-visible:ring-0 text-left flex-1 flex flex-col justify-between"
                    >
                      <div className="flex-1 flex items-center justify-center">
                        <RadialGaugeLeitos
                          occupied={bedStats.occupied}
                          available={bedStats.available}
                          cleaning={bedStats.cleaning}
                          maintenance={bedStats.maintenance}
                          total={totalBeds}
                          pure={true}
                        />
                      </div>
                      <div className="bg-muted/20 p-4 rounded-2xl border border-border/40 text-xs">
                        <div className="flex justify-between items-center mb-2 font-bold">
                          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                            Status de Giro
                          </span>
                          <span className="text-sky-500 font-extrabold">
                            {avgSla} min
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[10px] leading-relaxed">
                          Higienização operacional estável. {bedStats.cleaning}{" "}
                          leito(s) aguardando limpeza.
                        </p>
                      </div>
                    </TabsContent>

                    {/* Tab 2: Farmácia e Insumos */}
                    <TabsContent
                      value="insumos"
                      className="space-y-6 mt-0 focus-visible:outline-none focus-visible:ring-0 text-left flex-1 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Demanda Farmácia (ABC)
                          </h4>
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[8px] font-bold">
                            CONSUMO
                          </Badge>
                        </div>
                        <div className="h-[140px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={pharmacyConsumptionData.slice(0, 4)}
                            >
                              <XAxis
                                dataKey="name"
                                fontSize={8}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis
                                fontSize={8}
                                tickLine={false}
                                axisLine={false}
                              />
                              <Tooltip
                                contentStyle={{
                                  borderRadius: "8px",
                                  fontSize: 10,
                                }}
                              />
                              <Bar
                                dataKey="quantidade"
                                fill="#10b981"
                                radius={[3, 3, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-dashed border-border/40">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Nível Crítico Almoxarifado
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-semibold">
                            <span>Seringas 10ml</span>
                            <span className="text-red-500 font-bold">
                              12% (Crítico)
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500"
                              style={{ width: "12%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tab 3: Graficos Rápidos */}
                    <TabsContent
                      value="operacional"
                      className="space-y-4 mt-0 focus-visible:outline-none focus-visible:ring-0 text-left flex-1 flex flex-col justify-center"
                    >
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        Classificação de Riscos Atual
                      </h4>
                      <div className="h-[250px] w-full flex items-center justify-center">
                        <PieChartRiscos expanded={true} />
                      </div>
                    </TabsContent>

                    {/* Tab 4: Live Activity Feed */}
                    <TabsContent
                      value="feed"
                      className="space-y-4 mt-0 focus-visible:outline-none focus-visible:ring-0 text-left flex-1 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Logs Operacionais Recentes
                        </h4>
                        <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          CONECTADO
                        </span>
                      </div>

                      <div className="bg-slate-950/80 dark:bg-black/40 border border-white/5 p-4 rounded-lg h-[240px] overflow-y-auto font-mono text-[10px] leading-relaxed text-slate-300 scrollbar-thin">
                        <AnimatePresence>
                          {liveFeed.slice(0, 8).map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex gap-2 mb-2 last:mb-0"
                            >
                              <span className="text-slate-500/80">
                                [{item.time}]
                              </span>
                              <span
                                className={cn(
                                  item.type === "alert"
                                    ? "text-red-400 font-bold"
                                    : item.type === "gov"
                                      ? "text-cyan-400"
                                      : "text-slate-200",
                                )}
                              >
                                {item.text}
                              </span>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      <p className="text-[8px] text-muted-foreground text-center">
                        Registro de auditoria operacional em tempo real
                      </p>
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
            </motion.div>
          </div>

          {/* Gráfico de Tendência de Fluxo Macro no Final */}
          <div className="grid grid-cols-1 gap-6 mt-6">
            <motion.div variants={item}>
              <AreaChartFluxo onClick={() => setIsFluxoOpen(true)} />
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent
          value="gestao"
          className="space-y-6 mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={item}>
              <HeatmapOcupacao />
            </motion.div>
            <motion.div variants={item}>
              <SankeyFluxoPaciente />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={item}>
              <MiniMapaSatores onClick={() => navigate("/setores")} />
            </motion.div>
            <motion.div variants={item}>
              <ParetoProblemas />
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent
          value="preditiva"
          className="space-y-6 mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={item} className="lg:col-span-2">
              <Card className="glass-card-premium rounded-xl overflow-hidden h-full">
                <CardHeader className="p-6 pb-3 border-b border-white/20 bg-muted/30 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500 animate-pulse" />{" "}
                    Previsão de Demanda por IA (Próximas 24h)
                  </CardTitle>
                  <Badge className="bg-purple-500/10 text-purple-600 border border-purple-500/20 text-[9px] font-black uppercase tracking-wider">
                    Algoritmo preditivo ativo
                  </Badge>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predictiveDemandData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          opacity={0.2}
                        />
                        <XAxis
                          dataKey="hour"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            background: "rgba(0,0,0,0.8)",
                            border: "none",
                            color: "#fff",
                          }}
                        />
                        <Legend
                          verticalAlign="top"
                          height={36}
                          iconType="circle"
                        />
                        <Line
                          type="monotone"
                          name="Demanda Real"
                          dataKey="real"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          name="Previsão (IA)"
                          dataKey="previsto"
                          stroke="#a855f7"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-4 text-center leading-relaxed">
                    O modelo calcula a admissão futura com base no histórico de
                    feriados, sazonalidade de temperatura (
                    {new Date().toLocaleDateString("pt-BR")}) e fila de triagem
                    atual.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={item} className="lg:col-span-1">
              <BoxPlotEspera />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <motion.div variants={item}>
              <GanttPermanencia />
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>

      {/* MODALS */}
      <Dialog open={isHeatmapOpen} onOpenChange={setIsHeatmapOpen}>
        <DialogContent className="max-w-4xl glass-panel border-white/10 dark:border-slate-800 p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 bg-muted/30 border-b border-white/10">
            <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase text-primary">
              <BedDouble className="h-6 w-6" /> Mapa de Calor de Leitos (Visão
              Expandida)
            </DialogTitle>
            <DialogDescription>
              Visão detalhada da ocupação de leitos da unidade.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-6">
            <div className="h-8 w-full flex rounded-full overflow-hidden shadow-inner border border-border/50">
              {bedStats.occupied > 0 && (
                <div
                  style={{ width: `${(bedStats.occupied / totalBeds) * 100}%` }}
                  className="bg-red-500 flex items-center justify-center text-[10px] font-bold text-white shadow-inner"
                  title="Ocupados"
                >
                  {bedStats.occupied}
                </div>
              )}
              {bedStats.cleaning > 0 && (
                <div
                  style={{ width: `${(bedStats.cleaning / totalBeds) * 100}%` }}
                  className="bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-white shadow-inner"
                  title="Higienização"
                >
                  {bedStats.cleaning}
                </div>
              )}
              {bedStats.maintenance > 0 && (
                <div
                  style={{
                    width: `${(bedStats.maintenance / totalBeds) * 100}%`,
                  }}
                  className="bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-inner"
                  title="Manutenção"
                >
                  {bedStats.maintenance}
                </div>
              )}
              {bedStats.available > 0 && (
                <div
                  style={{
                    width: `${(bedStats.available / totalBeds) * 100}%`,
                  }}
                  className="bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-inner"
                  title="Livres"
                >
                  {bedStats.available}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-red-500/10 border-red-500/20">
                <CardContent className="p-4 flex flex-col items-center">
                  <span className="text-3xl font-black text-red-500">
                    {bedStats.occupied}
                  </span>
                  <span className="text-xs font-bold uppercase text-red-600/70">
                    Ocupados
                  </span>
                </CardContent>
              </Card>
              <Card className="bg-cyan-500/10 border-cyan-500/20">
                <CardContent className="p-4 flex flex-col items-center">
                  <span className="text-3xl font-black text-cyan-500">
                    {bedStats.cleaning}
                  </span>
                  <span className="text-xs font-bold uppercase text-cyan-600/70">
                    Higienização
                  </span>
                </CardContent>
              </Card>
              <Card className="bg-orange-500/10 border-orange-500/20">
                <CardContent className="p-4 flex flex-col items-center">
                  <span className="text-3xl font-black text-orange-500">
                    {bedStats.maintenance}
                  </span>
                  <span className="text-xs font-bold uppercase text-orange-600/70">
                    Manutenção
                  </span>
                </CardContent>
              </Card>
              <Card className="bg-emerald-500/10 border-emerald-500/20">
                <CardContent className="p-4 flex flex-col items-center">
                  <span className="text-3xl font-black text-emerald-500">
                    {bedStats.available}
                  </span>
                  <span className="text-xs font-bold uppercase text-emerald-600/70">
                    Livres
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isFeedOpen} onOpenChange={setIsFeedOpen}>
        <DialogContent className="max-w-2xl glass-panel border-white/10 dark:border-slate-800 p-0 overflow-hidden h-[600px] flex flex-col">
          <DialogHeader className="p-6 pb-4 bg-muted/30 border-b border-white/10">
            <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase text-primary">
              <TerminalSquare className="h-6 w-6" /> System Feed (Histórico
              Completo)
            </DialogTitle>
            <DialogDescription>
              Todos os eventos recentes registrados pelo sistema operacional da
              unidade.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/5 dark:bg-black/20">
            {liveFeed.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="flex gap-4 text-sm font-mono p-3 rounded-lg bg-background/50 border border-white/10"
              >
                <span className="text-muted-foreground/60 shrink-0">
                  [{item.time}]
                </span>
                <span
                  className={cn(
                    "leading-relaxed",
                    item.type === "alert"
                      ? "text-red-500 font-bold"
                      : item.type === "gov"
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-foreground/80",
                  )}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isStockOpen} onOpenChange={setIsStockOpen}>
        <DialogContent className="max-w-5xl glass-panel border-white/10 dark:border-slate-800 p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 bg-muted/30 border-b border-white/10">
            <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase text-emerald-500">
              <Pill className="h-6 w-6" /> Estoque de Apoio (Visão Expandida)
            </DialogTitle>
            <DialogDescription>
              Variação de estoque de medicamentos críticos ao longo das últimas
              2 horas.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pharmacyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis dataKey="time" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Line
                  type="monotone"
                  name="Dipirona"
                  dataKey="dipirona"
                  stroke="#10b981"
                  strokeWidth={4}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  name="Tramadol"
                  dataKey="tramadol"
                  stroke="#a855f7"
                  strokeWidth={4}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  name="Soro Fisiológico"
                  dataKey="soro"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAbcOpen} onOpenChange={setIsAbcOpen}>
        <DialogContent className="max-w-5xl glass-panel border-white/10 dark:border-slate-800 p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 bg-muted/30 border-b border-white/10">
            <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase text-purple-500">
              <PackageMinus className="h-6 w-6" /> Curva ABC Farmácia
              (Detalhado)
            </DialogTitle>
            <DialogDescription>
              Consumo de itens da curva A, B e C para otimização de compras e
              reposição.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pharmacyConsumptionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  }}
                />
                <Bar dataKey="quantidade" name="Unidades Consumidas">
                  {pharmacyConsumptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDemandaOpen} onOpenChange={setIsDemandaOpen}>
        <DialogContent className="max-w-4xl glass-panel border-white/10 dark:border-slate-800 p-0 overflow-hidden bg-background">
          <DialogHeader className="p-6 pb-4 bg-muted/30 border-b border-white/10">
            <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase text-blue-500">
              <Activity className="h-6 w-6" /> Demanda por Setor (Visão
              Expandida)
            </DialogTitle>
            <DialogDescription>
              Análise detalhada da demanda atual comparada à média histórica por
              setor.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 h-[500px] flex items-center justify-center">
            <RadarChartDemanda expanded />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRiscosOpen} onOpenChange={setIsRiscosOpen}>
        <DialogContent className="max-w-4xl glass-panel border-white/10 dark:border-slate-800 p-0 overflow-hidden bg-background">
          <DialogHeader className="p-6 pb-4 bg-muted/30 border-b border-white/10">
            <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase text-orange-500">
              <AlertTriangle className="h-6 w-6" /> Distribuição de Riscos
              (Visão Expandida)
            </DialogTitle>
            <DialogDescription>
              Proporção de pacientes aguardando atendimento por classificação de
              risco.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 h-[500px]">
            <PieChartRiscos expanded />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isFluxoOpen} onOpenChange={setIsFluxoOpen}>
        <DialogContent className="max-w-5xl glass-panel border-white/10 dark:border-slate-800 p-0 overflow-hidden bg-background">
          <DialogHeader className="p-6 pb-4 bg-muted/30 border-b border-white/10">
            <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase text-blue-500">
              <Activity className="h-6 w-6" /> Fluxo de Atendimentos vs Altas
              (Visão Expandida)
            </DialogTitle>
            <DialogDescription>
              Acompanhamento detalhado do volume de entradas na triagem versus
              altas médicas ao longo do dia.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 h-[500px]">
            <AreaChartFluxo expanded />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
