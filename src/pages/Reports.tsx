import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Calendar, Download, FileSpreadsheet, FileArchive, Info, Users, Clock, Globe, HeartPulse, Activity, ClipboardList, Stethoscope } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const attendanceWeeklyData = [
  { name: 'Seg', total: 110 },
  { name: 'Ter', total: 135 },
  { name: 'Qua', total: 95 },
  { name: 'Qui', total: 145 },
  { name: 'Sex', total: 170 },
  { name: 'Sáb', total: 185 },
  { name: 'Dom', total: 140 },
];

const riskDistributionData = [
  { name: 'Vermelho', value: 8, color: '#ef4444' },
  { name: 'Laranja', value: 15, color: '#f97316' },
  { name: 'Amarelo', value: 32, color: '#eab308' },
  { name: 'Verde', value: 25, color: '#22c55e' },
  { name: 'Azul', value: 20, color: '#3b82f6' },
];

const actionComparisonData = [
  { name: 'Triagem (Entradas)', value: 156 },
  { name: 'Altas Médicas', value: 114 },
  { name: 'Exames Raio-X', value: 95 },
  { name: 'Observação (24h)', value: 24 },
  { name: 'Transferências', value: 12 },
];

const consolidatedMetrics = [
  { label: "Total de Entradas na Triagem", value: "156", icon: ClipboardList },
  { label: "Pacientes em Observação (24h)", value: "24", icon: Clock },
  { label: "Transferências Realizadas (Cross/Sisreg)", value: "12", icon: Globe },
  { label: "Altas Médicas Concedidas", value: "114", icon: HeartPulse },
  { label: "Óbitos Confirmados", value: "0", icon: Activity },
  { label: "Exames Laboratoriais Coletados", value: "340", icon: ClipboardList },
  { label: "Exames de Raio-X Realizados", value: "95", icon: Stethoscope },
];

export default function Reports() {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black mission-control-title">Relatório do Ministério da Saúde</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">{currentDate}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100 dark:bg-red-950/20 dark:border-red-900/30">
            <FileText className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" size="sm" className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> EXCEL
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30">
            <FileArchive className="mr-2 h-4 w-4" /> WORD
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Atendimentos do Dia", value: "142", sub: "+20% em relação a ontem", subColor: "text-emerald-500" },
          { label: "Taxa de Ocupação Geral", value: "85%", sub: "32/38 leitos ocupados", subColor: "text-muted-foreground" },
          { label: "Casos de Urgência (Vermelho)", value: "8", sub: "Encaminhados para estabilização/UTI", subColor: "text-red-500", highlight: true },
          { label: "Tempo Médio de Espera", value: "45 min", sub: "Classificação Verde/Azul", subColor: "text-muted-foreground" },
        ].map((kpi, i) => (
          <Card key={i} className="glass-card card-highlight">
            <CardContent className="pt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{kpi.label}</p>
              <div className="flex flex-col">
                <span className={`text-4xl font-black tabular-nums ${kpi.highlight ? 'text-red-500' : ''}`}>{kpi.value}</span>
                <p className={`text-[10px] font-bold mt-1 ${kpi.subColor}`}>
                  {kpi.sub}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Attendance Bar Chart */}
        <Card className="lg:col-span-8 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-black mission-control-title">Atendimentos por Dia (Última Semana)</CardTitle>
            <CardDescription className="text-xs uppercase font-bold tracking-widest">Volume diário de pacientes acolhidos na unidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceWeeklyData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontWeight: 600}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10}} 
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent', opacity: 0.1}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
                  />
                  <Bar 
                    dataKey="total" 
                    fill="url(#barGradient)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={60} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Classification Donut Chart */}
        <Card className="lg:col-span-4 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-black mission-control-title">Classificação de Risco</CardTitle>
            <CardDescription className="text-xs uppercase font-bold tracking-widest">Distribuição de pacientes por prioridade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                {riskDistributionData.map((risk) => (
                  <div key={risk.name} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: risk.color }} />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{risk.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Consolidated Data Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black mission-control-title">Dados Consolidados da Unidade</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground -mt-2">Informações detalhadas das últimas 24 horas para o e-SUS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 glass-card">
          <CardContent className="pt-6">
            <div className="divide-y divide-border/50">
              {consolidatedMetrics.map((metric, i) => (
                <div key={i} className="flex items-center justify-between py-4 group hover:bg-primary/5 px-2 transition-colors rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <metric.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-wide text-foreground/80">{metric.label}</span>
                  </div>
                  <span className="text-lg font-black tabular-nums text-primary">{metric.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 glass-card">
          <CardHeader>
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground text-center">Comparativo de Ações e Desfechos (Últimas 24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={actionComparisonData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={110}
                    tick={{ fontSize: 9, fontWeight: 900, fill: 'currentColor' }}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent', opacity: 0.1}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-6">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5 opacity-60">
                <Info className="h-3 w-3" />
                DADOS EM TEMPO REAL VIA API E-SUS
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}


