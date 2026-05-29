import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePatients, Patient } from "@/hooks/use-patients";
import { Building2, Users, AlertCircle, Clock, Stethoscope, Pill, ShieldCheck, HeartPulse, Baby, Globe, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";
import { cn, formatWords } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const sectorGroups = [
  {
    id: 'emergency',
    label: 'Emergência',
    icon: AlertCircle,
    color: 'text-red-500 dark:text-red-400',
    borderColor: 'border-red-500/40 dark:border-red-500/30',
    bgColor: 'bg-red-500/10 dark:bg-red-500/15',
    progressBarColor: 'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600/90 dark:to-red-500/90',
    activeTab: 'data-[state=active]:text-red-650 dark:data-[state=active]:text-red-400 data-[state=active]:border-red-500 dark:data-[state=active]:border-red-500/50 data-[state=active]:bg-red-500/10 dark:data-[state=active]:bg-red-500/15 shadow-[0_0_15px_rgba(239,68,68,0.12)]',
    sectors: [
      { 
        name: 'SALA VERMELHA', 
        max: 6, 
        description: 'SALA DE RESSUSCITAÇÃO - CUIDADOS CRÍTICOS',
        structure: 'Equipada com respiradores, monitores multiparâmetros, desfibrilador e carrinho de emergência.'
      },
      { name: 'SALA DE EMERGÊNCIA 1', max: 1, description: 'SUPORTE AVANÇADO (RESPIRADORES)', structure: 'Monitorização constante e ventilação mecânica.' },
      { name: 'SALA DE EMERGÊNCIA 2', max: 1, description: 'SUPORTE AVANÇADO (RESPIRADORES)', structure: 'Monitorização constante e ventilação mecânica.' },
      { name: 'SALA DE EMERGÊNCIA 3', max: 1, description: 'SUPORTE AVANÇADO (RESPIRADORES)', structure: 'Monitorização constante e ventilação mecânica.' },
      { name: 'RECON 1', max: 1, description: 'ESTABILIZAÇÃO IMEDIATA', structure: 'Área de manobras rápidas e ressuscitação.' },
      { name: 'RECON 2', max: 1, description: 'ESTABILIZAÇÃO IMEDIATA', structure: 'Área de manobras rápidas e ressuscitação.' }
    ]
  },
  {
    id: 'observation',
    label: 'Observação',
    icon: Clock,
    color: 'text-amber-500 dark:text-amber-400',
    borderColor: 'border-amber-400/40 dark:border-amber-500/30',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/15',
    progressBarColor: 'bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-400/80 dark:to-amber-500/80',
    activeTab: 'data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-400 data-[state=active]:border-amber-400 dark:data-[state=active]:border-amber-500/50 data-[state=active]:bg-amber-500/10 dark:data-[state=active]:bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.12)]',
    sectors: [
      { 
        name: 'SALA AMARELA', 
        max: 15, 
        description: 'URGÊNCIA / ÁREA DE MEDICAÇÃO ADULTO',
        structure: 'Posto de enfermagem próximo, equipamentos de monitorização básica e medicação intravenosa.'
      },
      { name: 'SALA MASCULINA', max: 10, description: 'OBSERVAÇÃO COLETIVA', structure: 'Banheiro (BWC) exclusivo para pacientes masculinos.' },
      { name: 'SALA FEMININA', max: 10, description: 'OBSERVAÇÃO COLETIVA', structure: 'Banheiro (BWC) exclusivo para pacientes femininas.' },
      { name: 'QUARTO DE ATENÇÃO 1', max: 1, description: 'INTERNAÇÃO CURTA / ISOLAMENTO', structure: 'Acomodação privada para casos de observação prolongada ou isolamento.' },
      { name: 'QUARTO DE ATENÇÃO 2', max: 1, description: 'INTERNAÇÃO CURTA / ISOLAMENTO', structure: 'Acomodação privada para casos de observação prolongada ou isolamento.' },
      ...Array.from({ length: 5 }, (_, i) => ({ 
        name: `LEITO DE OBSERVAÇÃO ${i + 1}`, 
        max: 1, 
        description: 'MONITORAMENTO BÁSICO',
        structure: 'Leito individual com ponto de oxigênio e vácuo.'
      }))
    ]
  },
  {
    id: 'pediatric',
    label: 'Pediatria',
    icon: Baby,
    color: 'text-blue-500 dark:text-blue-400',
    borderColor: 'border-blue-500/40 dark:border-blue-400/30',
    bgColor: 'bg-blue-500/10 dark:bg-blue-450/15',
    progressBarColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
    activeTab: 'data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-500/50 data-[state=active]:bg-blue-500/10 dark:data-[state=active]:bg-blue-500/15 shadow-[0_0_15px_rgba(59,130,246,0.12)]',
    sectors: [
      { 
        name: 'OBSERVAÇÃO PEDIÁTRICA', 
        max: 8, 
        description: 'SALA PEDIÁTRICA',
        structure: 'Leitos adequados, poltronas para acompanhantes e banheiro exclusivo para pediatria.'
      },
      { name: 'ACOLHIMENTO INFANTIL', max: 4, description: 'AMBIENTE HUMANIZADO', structure: 'Área lúdica e acolhedora para triagem pediátrica.' },
      { name: 'MEDICAÇÃO INFANTIL', max: 6, description: 'SALA DE PROCEDIMENTOS', structure: 'Equipamentos pediátricos para administração segura de medicamentos.' }
    ]
  },
  {
    id: 'services',
    label: 'Atendimento',
    icon: Stethoscope,
    color: 'text-emerald-500 dark:text-emerald-400',
    borderColor: 'border-emerald-500/40 dark:border-emerald-400/30',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-450/15',
    progressBarColor: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    activeTab: 'data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500 dark:data-[state=active]:border-emerald-500/50 data-[state=active]:bg-emerald-500/10 dark:data-[state=active]:bg-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.12)]',
    sectors: [
      { name: 'TRIAGEM 1', max: 1, description: 'TRIAGEM INICIAL', structure: 'Equipamentos de aferição de sinais vitais e sistema de senhas.' },
      { name: 'TRIAGEM 2', max: 1, description: 'TRIAGEM INICIAL', structure: 'Equipamentos de aferição de sinais vitais e sistema de senhas.' },
      { name: 'SALA DE COLETA', max: 6, description: 'EXAMES LABORATORIAIS', structure: 'Box de coleta individualizado e área de processamento rápido.' },
      { name: 'SALA DE SUTURA', max: 2, description: 'PROCEDIMENTOS RÁPIDOS', structure: 'Macas de procedimento e foco cirúrgico.' },
      { name: 'SALA DE CURATIVOS', max: 2, description: 'PROCEDIMENTOS RÁPIDOS', structure: 'Materiais esterilizados e pia cirúrgica.' },
      ...Array.from({ length: 8 }, (_, i) => ({ 
        name: `CONSULTÓRIO MÉDICO ${i + 1}`, 
        max: 2, 
        description: 'ATENDIMENTO CLÍNICO',
        structure: 'Maca de exame, mesa administrativa e equipamentos básicos de diagnóstico.'
      }))
    ]
  },
  {
    id: 'support',
    label: 'Apoio / NIR',
    icon: ShieldCheck,
    color: 'text-purple-500 dark:text-purple-400',
    borderColor: 'border-purple-500/40 dark:border-purple-400/30',
    bgColor: 'bg-purple-500/10 dark:bg-purple-450/15',
    progressBarColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
    activeTab: 'data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:border-purple-500 dark:data-[state=active]:border-purple-500/50 data-[state=active]:bg-purple-500/10 dark:data-[state=active]:bg-purple-500/15 shadow-[0_0_15px_rgba(168,85,247,0.12)]',
    sectors: [
      { name: 'FARMÁCIA', max: 50, description: 'DISPENSAÇÃO DE MEDICAMENTOS' },
      { name: 'ASSISTÊNCIA SOCIAL', max: 2, description: 'ACOLHIMENTO AO FAMILIAR' },
      { name: 'SALA DE NIR', max: 4, description: 'REGULAÇÃO DE VAGAS EXTERNAS' },
      { name: 'RADIOLOGIA / RAIO-X', max: 2, description: 'IMAGEM E DIAGNÓSTICO' }
    ]
  }
];

interface Sector {
  name: string;
  max: number;
  description: string;
  structure?: string;
  group: typeof sectorGroups[number];
}

const RISK_ORDER: Record<string, number> = { 
  'emergency': 0, 
  'very-urgent': 1, 
  'urgent': 2, 
  'less-urgent': 3, 
  'not-urgent': 4 
};

// Mock de profissionais em cada sala para o Mapa de Setores
const DEFAULT_PROFESSIONALS: Record<string, string> = {
  'TRIAGEM 1': 'ENF. MARINA COSTA',
  'TRIAGEM 2': 'ENF. PAULO SOUZA',
  'SALA VERMELHA': 'DR. CARLOS ANDRÉ',
  'SALA AMARELA': 'ENF. JULIANA LIMA',
  'SALA MASCULINA': 'TEC. ROBERTO ALVES',
  'SALA FEMININA': 'TEC. ANA PAULA',
  'OBSERVAÇÃO PEDIÁTRICA': 'ENF. CLARA NEVES',
};

export default function Sectors() {
  const { patients: allPatients, callPatient, updatePatient, isAudioEnabled, setIsAudioEnabled } = usePatients();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("census");
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [showSectorDialog, setShowSectorDialog] = useState(false);
  const [transferringPatientId, setTransferringPatientId] = useState<string | null>(null);
  const [searchSector, setSearchSector] = useState("");
  const [selectedRisk, setSelectedRisk] = useState<Patient['risk'] | null>(null);
  const [now, setNow] = useState(new Date());

  // Atualiza o relógio para os alertas de tempo real
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000); // 30s
    return () => clearInterval(timer);
  }, []);

  const getProfessionalInRoom = (roomName: string) => {
    const activeFromTriage = localStorage.getItem('selectedTriageRoom');
    if (roomName === activeFromTriage) {
      return "DR. RICARDO BRAGA"; // Usuário "logado" no sistema
    }
    return DEFAULT_PROFESSIONALS[roomName] || null;
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedRisk(null);
  };

  const allSectors = sectorGroups.flatMap(g => g.sectors.map(s => ({ ...s, groupIcon: g.icon, groupColor: g.color })));
  const filteredSectors = allSectors.filter(s => 
    s.name.toLowerCase().includes(searchSector.toLowerCase()) && 
    s.name !== selectedSector?.name
  );

  const getRiskDetails = (risk: string) => {
    switch(risk) {
      case 'emergency': return { label: 'Emergência', color: 'bg-red-500 text-white dark:bg-red-650 dark:bg-red-600/90 shadow-[0_0_15px_rgba(239,68,68,0.25)]' };
      case 'very-urgent': return { label: 'Muito Urgente', color: 'bg-orange-500 text-white dark:bg-orange-600/90 shadow-[0_0_15px_rgba(249,115,22,0.25)]' };
      case 'urgent': return { label: 'Urgente', color: 'bg-amber-400 text-slate-950 dark:bg-amber-500/90 shadow-[0_0_15px_rgba(251,191,36,0.18)]' };
      case 'less-urgent': return { label: 'Pouco Urgente', color: 'bg-emerald-500 text-white dark:bg-emerald-600/90 shadow-[0_0_15px_rgba(16,185,129,0.18)]' };
      case 'not-urgent': return { label: 'Não Urgente', color: 'bg-blue-500 text-white dark:bg-blue-600/90 shadow-[0_0_15px_rgba(59,130,246,0.18)]' };
      default: return { label: risk, color: 'bg-slate-500 text-white' };
    }
  };

  const riskStats = [
    { label: 'Emergência', risk: 'emergency' as const, color: 'bg-red-500 dark:bg-red-600/90', activeBorder: 'border-red-500/40 dark:border-red-500/40 ring-1 ring-red-500/10 dark:ring-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.12)]', icon: AlertCircle },
    { label: 'Muito Urgente', risk: 'very-urgent' as const, color: 'bg-orange-500 dark:bg-orange-600/90', activeBorder: 'border-orange-500/40 dark:border-orange-600/40 ring-1 ring-orange-500/10 dark:ring-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.12)]', icon: Clock },
    { label: 'Urgente', risk: 'urgent' as const, color: 'bg-amber-400 dark:bg-amber-500/90 text-slate-950', activeBorder: 'border-amber-400/40 dark:border-amber-500/40 ring-1 ring-amber-400/10 dark:ring-amber-500/10 shadow-[0_0_20px_rgba(251,191,36,0.1)]', icon: HeartPulse, iconColor: 'text-slate-950 dark:text-amber-500' },
    { label: 'Pouco Urgente', risk: 'less-urgent' as const, color: 'bg-emerald-500 dark:bg-emerald-600/90', activeBorder: 'border-emerald-500/40 dark:border-emerald-600/40 ring-1 ring-emerald-500/10 dark:ring-emerald-600/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]', icon: Stethoscope },
    { label: 'Não Urgente', risk: 'not-urgent' as const, color: 'bg-blue-500 dark:bg-blue-600/90', activeBorder: 'border-blue-500/40 dark:border-blue-600/40 ring-1 ring-blue-500/10 dark:ring-blue-600/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]', icon: Pill },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#006699]/10 dark:bg-sky-400/10 flex items-center justify-center text-[#006699] dark:text-sky-400 shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">Mapa de Setores</h1>
            <p className="text-muted-foreground text-[11px] font-black uppercase tracking-widest mt-0.5">
              Ocupação da Unidade em Tempo Real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant={isAudioEnabled ? "default" : "outline"}
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            size="sm"
            className={cn(
              "h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border-none",
              isAudioEnabled 
                ? "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-sm" 
                : "border border-white/40 dark:border-white/10 text-foreground glass-card-premium hover:text-[#006699] dark:hover:text-sky-400"
            )}
          >
            {isAudioEnabled ? "Áudio do Painel: ATIVO" : "Áudio do Painel: INATIVO"}
          </Button>
          <div className="h-8 w-[1px] bg-slate-200/40 dark:bg-slate-800/40 mx-1 hidden md:block" />
          <Badge variant="outline" className="h-9 px-4 font-black uppercase tracking-widest border border-slate-200/40 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/40 text-foreground shadow-sm">
            CENSO TOTAL: {allPatients.filter(p => p.status !== 'completed').length}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="glass-card-premium p-1 h-14 rounded-xl border border-white/40 dark:border-white/10 w-full md:w-auto overflow-x-auto flex-nowrap shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <TabsTrigger 
            value="census"
            onClick={() => {
              if (activeTab === 'census') setSelectedRisk(null);
            }}
            className="px-6 rounded-lg transition-all border-b-2 border-transparent data-[state=active]:bg-white/95 dark:data-[state=active]:bg-slate-900/60 data-[state=active]:shadow-md data-[state=active]:text-[#006699] dark:data-[state=active]:text-sky-400 data-[state=active]:border-[#006699]/30 dark:data-[state=active]:border-sky-500/30"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-tight">Censo Global</span>
            </div>
          </TabsTrigger>
          {sectorGroups.map(group => {
            const criticalCount = allPatients.filter(p => 
              group.sectors.some(s => s.name === p.sector) && 
              (p.risk === 'emergency' || p.risk === 'very-urgent') &&
              p.status !== 'completed'
            ).length;

            return (
              <TabsTrigger 
                key={group.id} 
                value={group.id}
                className={cn(
                  "px-6 rounded-lg transition-all border-b-2 border-transparent data-[state=active]:bg-white/95 dark:data-[state=active]:bg-slate-900/60 data-[state=active]:shadow-md",
                  group.activeTab
                )}
              >
                <div className="flex items-center gap-2">
                  <group.icon className={cn("h-4 w-4", group.color)} />
                  <span className="text-xs font-black uppercase tracking-tight">{group.label}</span>
                  {criticalCount > 0 && (
                    <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[8px] bg-red-500 dark:bg-red-650 animate-pulse border-none text-white">
                      {criticalCount}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="census" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {riskStats.map(stat => (
              <Card 
                key={stat.risk} 
                className={cn(
                  "rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden group select-none",
                  selectedRisk === stat.risk 
                    ? cn("glass-card-premium font-black ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-600 shadow-2xl scale-[1.02] relative z-10", stat.activeBorder) 
                    : "border-white/40 dark:border-white/10 glass-card-premium opacity-80 hover:opacity-100 hover:scale-[1.02] shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-xl"
                )}
                onClick={() => setSelectedRisk(selectedRisk === stat.risk ? null : stat.risk)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-xl shadow-lg transition-transform group-hover:rotate-6",
                    stat.color,
                    stat.iconColor || "text-white"
                  )}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-black uppercase text-muted-foreground/80 tracking-tighter truncate">{stat.label}</p>
                    <p className="text-xl font-black">{allPatients.filter(p => p.risk === stat.risk && p.status !== 'completed').length}</p>
                  </div>
                </CardContent>
                {selectedRisk === stat.risk && (
                  <motion.div 
                    layoutId="risk-active-indicator"
                    className={cn("h-1 w-full mt-auto", stat.color)}
                  />
                )}
              </Card>
            ))}
          </div>

          <Card className="glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden rounded-2xl transition-colors duration-500">
            <CardHeader className="p-6 bg-gradient-to-r from-white/40 to-white/10 dark:from-slate-900/40 dark:to-slate-900/10 backdrop-blur-md border-b border-white/40 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-sm font-black uppercase tracking-tight">Censo Atualizado</CardTitle>
                    {selectedRisk && (
                      <Badge className={cn("text-[8px] font-black uppercase px-2 py-0.5 border-none", getRiskDetails(selectedRisk).color)}>
                        Filtrando por: {getRiskDetails(selectedRisk).label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Todos os pacientes ativos na unidade</p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedRisk && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-[9px] font-black uppercase underline decoration-dotted underline-offset-4 text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedRisk(null)}
                    >
                      Limpar Filtro
                    </Button>
                  )}
                  <Badge variant="outline" className="font-black border-slate-200/50 dark:border-slate-800/45 text-[9px] tracking-wider uppercase px-3 py-1 bg-white/40 dark:bg-slate-950/20">
                    {selectedRisk ? 'RESULTADOS' : 'TOTAL'}: {
                      allPatients.filter(p => p.status !== 'completed' && (!selectedRisk || p.risk === selectedRisk)).length
                    } PACIENTES
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 bg-transparent">
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                {allPatients
                  .filter(p => {
                    const isNotCompleted = p.status !== 'completed';
                    const matchesRisk = !selectedRisk || p.risk === selectedRisk;
                    return isNotCompleted && matchesRisk;
                  })
                  .sort((a, b) => {
                    const orderA = RISK_ORDER[a.risk] ?? 99;
                    const orderB = RISK_ORDER[b.risk] ?? 99;
                    if (orderA !== orderB) return orderA - orderB;
                    return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
                  }).map(patient => {
                    const pDiff = (now.getTime() - new Date(patient.arrivalTime).getTime()) / 60000;
                    return (
                      <div key={patient.id} className="rounded-2xl border border-white/40 dark:border-white/10 glass-card-premium p-4 flex flex-col gap-4 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 group relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-slate-100/50 dark:bg-slate-900/40 flex items-center justify-center font-black text-[10px] text-slate-550 dark:text-slate-400 border border-slate-200/30 dark:border-slate-850 transition-colors group-hover:bg-[#006699]/10 group-hover:text-[#006699] dark:group-hover:text-sky-400 group-hover:border-[#006699]/10 dark:group-hover:border-sky-500/10 shrink-0">
                              {patient.ticket}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold truncate">
                                {patient.name.toUpperCase().includes('NÃO IDENTIFICADO') || patient.name.toUpperCase().includes('DESCONHECIDO') 
                                  ? "PACIENTE NÃO IDENTIFICADO" 
                                  : formatWords(patient.name)}
                              </p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{patient.age} Anos • CPF: {patient.cpf || '***'}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <Badge className={cn("text-[9px] font-black uppercase px-2 py-0.5 shadow-sm border-none", getRiskDetails(patient.risk).color)}>
                              {getRiskDetails(patient.risk).label}
                            </Badge>
                            <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5">
                              <div className={cn("h-1.5 w-1.5 rounded-full", patient.risk === 'emergency' ? "bg-red-500 animate-pulse" : patient.risk === 'very-urgent' ? "bg-orange-500 animate-pulse" : patient.risk === 'urgent' ? "bg-amber-400 animate-pulse" : patient.risk === 'less-urgent' ? "bg-emerald-500" : "bg-blue-600")} />
                              {patient.sector || 'TRIAGEM'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between bg-white/30 dark:bg-slate-950/40 px-3 py-2 rounded-xl border border-white/40 dark:border-white/10 text-[10px] font-bold text-muted-foreground uppercase shadow-inner">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-[#006699] dark:text-sky-400" />
                            Entrada: {format(new Date(patient.arrivalTime), "HH:mm", { locale: ptBR })}
                          </span>
                          <span className={cn(pDiff > 15 ? "text-amber-600 dark:text-amber-400 font-extrabold animate-pulse" : "text-muted-foreground/80")}>
                            Há {Math.floor(pDiff)} min
                          </span>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-[10px] font-black uppercase tracking-widest rounded-xl h-10 border border-white/40 dark:border-white/10 glass-card-premium hover:text-[#006699] dark:hover:text-sky-400 transition-all shadow-sm hover:scale-[1.02]"
                          onClick={() => navigate(`/paciente/${patient.id}`, { state: { from: '/setores', label: 'Setores' } })}
                        >
                          Visualizar Prontuário <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </div>
                    );
                  })}
                  {allPatients.filter(p => p.status !== 'completed' && (!selectedRisk || p.risk === selectedRisk)).length === 0 && (
                    <div className="col-span-full py-16 text-center flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                        <Users className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Nenhum paciente encontrado com este filtro</p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {sectorGroups.map(group => (
          <TabsContent key={group.id} value={group.id} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {group.sectors.map((sector, idx) => {
                const sectorPatients = allPatients.filter(p => p.sector === sector.name && p.status !== 'completed');
                const occupancy = (sectorPatients.length / sector.max) * 100;
                
                // Cálculo de tempo para alertas visuais
                const maxTimeInMinutes = sectorPatients.reduce((max, p) => {
                   const diff = (now.getTime() - new Date(p.arrivalTime).getTime()) / 60000;
                   return Math.max(max, diff);
                }, 0);

                const isRedAlert = maxTimeInMinutes > 30; // Mais de 30 min (Crítico)
                const isAmberAlert = maxTimeInMinutes > 15; // Mais de 15 min (Alerta)
                const professional = getProfessionalInRoom(sector.name);

                return (
                  <motion.div
                    key={sector.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => {
                      setSelectedSector({ ...sector, group });
                      setShowSectorDialog(true);
                    }}
                    className="cursor-pointer h-full"
                  >
                    <Card 
                      className={cn(
                        "group hover:shadow-xl transition-all duration-300 border overflow-hidden rounded-2xl border-l-[4px] h-full flex flex-col glass-card-premium",
                        group.borderColor,
                        occupancy >= 100 ? "bg-red-500/10 dark:bg-red-500/10 border-white/40" : "border-white/40 dark:border-white/10 opacity-90 hover:opacity-100 hover:scale-[1.02]",
                        isRedAlert ? "animate-blink-red border-red-500 dark:border-red-500/50 shadow-md shadow-red-500/10" : 
                        isAmberAlert ? "animate-blink-amber border-amber-400 dark:border-amber-500/50 shadow-md shadow-amber-400/10" : ""
                      )}
                    >
                      <CardHeader className="p-4 pb-3 space-y-0 shrink-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex flex-col">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-[10px] font-black tracking-widest uppercase border-0 p-0",
                                occupancy >= 100 ? "text-red-500" : 
                                occupancy >= 80 ? "text-orange-500" : 
                                occupancy > 0 ? "text-emerald-500" : "text-muted-foreground"
                              )}
                            >
                              {occupancy >= 100 ? 'LOTADO' : occupancy > 0 ? 'OCUPADO' : 'LIVRE'}
                            </Badge>
                            {isAmberAlert && (
                              <span className={cn(
                                "text-[8px] font-black uppercase mt-0.5",
                                isRedAlert ? "text-red-500 dark:text-red-400" : "text-amber-500 dark:text-amber-400"
                              )}>
                                {isRedAlert ? "Atraso Crítico" : "No Limite"}
                              </span>
                            )}
                          </div>
                          <div className={cn("flex flex-col items-end")}>
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border border-slate-200/30 dark:border-slate-800/40 bg-slate-100/30 dark:bg-slate-950/20">
                              <Users className={cn("h-3 w-3", group.color)} />
                              <span className={cn("text-[10px] font-black", group.color)}>
                                {sectorPatients.length}/{sector.max}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CardTitle className={cn(
                          "text-sm font-black uppercase tracking-tight transition-colors truncate", 
                          isRedAlert ? "text-red-500 dark:text-red-450 text-red-500" : isAmberAlert ? "text-amber-500 dark:text-amber-450 text-amber-500" : group.color
                        )}>
                          {sector.name}
                        </CardTitle>
                        <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">{sector.description}</p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
                        <div className="h-1.5 bg-slate-205/50 dark:bg-slate-800/40 rounded-full overflow-hidden mb-4 p-0 shrink-0">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(occupancy, 100)}%` }}
                            className={cn(
                              "h-full rounded-full transition-all",
                              occupancy >= 100 ? "bg-gradient-to-r from-red-500 to-red-650" : 
                              isRedAlert ? "bg-gradient-to-r from-red-400 to-red-500" : 
                              isAmberAlert ? "bg-gradient-to-r from-amber-400 to-amber-500" : 
                              group.progressBarColor || "bg-[#006699]"
                            )}
                          />
                        </div>

                        <div className="space-y-2 flex-1">
                          {sectorPatients.length > 0 ? (
                            <div className="space-y-2">
                              {sectorPatients
                            .sort((a, b) => {
                              const orderA = RISK_ORDER[a.risk] ?? 99;
                              const orderB = RISK_ORDER[b.risk] ?? 99;
                              if (orderA !== orderB) return orderA - orderB;
                              return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
                            })
                            .map(p => {
                                const pDiff = (now.getTime() - new Date(p.arrivalTime).getTime()) / 60000;
                                return (
                                  <div 
                                    key={p.id} 
                                    className="flex items-center justify-between group/p cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/paciente/${p.id}`, { state: { from: '/setores', label: 'Setores' } });
                                    }}
                                  >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                       <div className={cn(
                                         "h-1.5 w-1.5 rounded-full",
                                         p.risk === 'emergency' ? "bg-red-500 animate-pulse" : 
                                         p.risk === 'very-urgent' ? "bg-orange-500 animate-pulse" :
                                         p.risk === 'urgent' ? "bg-amber-400 animate-pulse" : 
                                         p.risk === 'less-urgent' ? "bg-emerald-500" : "bg-blue-600"
                                       )} />
                                       <span className={cn(
                                         "text-[11px] font-bold truncate group-hover/p:text-[#006699] dark:group-hover/p:text-sky-400 transition-colors tracking-tight",
                                         pDiff > 15 ? "text-amber-500 dark:text-amber-400 underline decoration-amber-305 decoration-wavy underline-offset-2" : ""
                                       )}>
                                         {formatWords(`${p.name.split(' ')[0]} ${p.name.split(' ').pop()}`)}
                                       </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {pDiff > 15 && <Clock className="h-2 w-2 text-amber-500 dark:text-amber-400 animate-pulse" />}
                                      <Badge variant="outline" className="h-4 text-[8px] font-bold px-1.5 opacity-50 border-slate-200/50 dark:border-slate-800">{p.ticket}</Badge>
                                    </div>
                                  </div>
                                );
                            })}
                            </div>
                          ) : (
                            <div className="py-2 h-[44px] border border-dashed border-slate-200/40 dark:border-slate-850 rounded-lg flex items-center justify-center opacity-40">
                               <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Livre</span>
                            </div>
                          )}
                        </div>

                        {professional && (
                          <div className="mt-4 pt-3 border-t border-slate-200/30 dark:border-slate-800/40 flex items-center gap-2">
                             <div className="p-1 rounded bg-slate-100/50 dark:bg-slate-900/40">
                               <UserCheck className="h-3 w-3 text-primary" />
                             </div>
                             <div className="flex flex-col">
                               <span className="text-[8px] font-black text-muted-foreground uppercase leading-none mb-0.5">Responsável</span>
                               <span className="text-[9px] font-black text-foreground uppercase tracking-tight truncate">{professional}</span>
                             </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <Dialog open={showSectorDialog} onOpenChange={setShowSectorDialog}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl">
          {selectedSector && (
            <>
              <div className={cn("h-1.5 w-full", selectedSector.group.progressBarColor)} />
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/30")}>
                      <selectedSector.group.icon className={cn("h-5 w-5", selectedSector.group.color)} />
                    </div>
                    <div>
                      <DialogTitle className="text-lg font-black uppercase tracking-tight text-foreground">
                        {selectedSector.name}
                      </DialogTitle>
                      <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400 mt-0.5">
                        {selectedSector.description} • {selectedSector.group.label}
                      </DialogDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-black px-3 py-1 border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-950/10 text-foreground text-[10px]">
                    OCUPAÇÃO: {allPatients.filter(p => p.sector === selectedSector.name && p.status !== 'completed').length}/{selectedSector.max}
                  </Badge>
                </div>

                {(() => {
                  const prof = getProfessionalInRoom(selectedSector.name);
                  if (prof) {
                    return (
                      <div className="mt-4 p-3 rounded-lg bg-[#006699]/5 dark:bg-sky-400/5 border border-[#006699]/15 dark:border-sky-500/15 flex items-center gap-3">
                        <div className="p-2 rounded bg-[#006699]/10 dark:bg-sky-400/10">
                          <UserCheck className="h-4 w-4 text-[#006699] dark:text-sky-400" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Profissional Responsável</p>
                          <p className="text-xs font-black text-[#006699] dark:text-sky-450 uppercase tracking-tight">{prof}</p>
                        </div>
                        <Badge className="ml-auto bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30 text-[8px] font-black uppercase tracking-widest">
                          Em Atividade
                        </Badge>
                      </div>
                    );
                  }
                  return null;
                })()}

                {selectedSector.structure && (
                  <div className="mt-4 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/35 dark:border-slate-800/40 relative group">
                    <div className="flex items-center gap-2 mb-2 bg-transparent">
                      <Stethoscope className="h-3.5 w-3.5 text-[#006699] dark:text-sky-450  text-sky-400" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Função e Estrutura</span>
                      {selectedSector.name.includes('TRIAGEM') && (
                        <Badge className="ml-auto bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[8px] font-black uppercase tracking-widest">
                          Acesso Restrito: Enfermagem
                        </Badge>
                      )}
                    </div>
                    <div className="italic text-[10px] text-muted-foreground font-semibold leading-relaxed">
                      {selectedSector.structure}
                    </div>
                    {selectedSector.name.includes('TRIAGEM') && (
                      <div className="mt-3 pt-3 border-t border-slate-200/30 dark:border-slate-800/35">
                        <p className="text-[9px] font-semibold text-muted-foreground/85 leading-normal">
                          Utilizada para aferição de sinais vitais, classificação de risco pelo Protocolo de Manchester e encaminhamento ao fluxo clínico adequado.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </DialogHeader>

              <div className="p-6 pt-4 space-y-6">
                <AnimatePresence mode="wait">
                  {!transferringPatientId ? (
                    <motion.div 
                      key="list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" /> Pacientes no Local
                      </h3>
                      
                      <div className="space-y-3">
                        {(() => {
                          const patients = allPatients
                            .filter(p => p.sector === selectedSector.name && p.status !== 'completed')
                            .sort((a, b) => {
                              const orderA = RISK_ORDER[a.risk] ?? 99;
                              const orderB = RISK_ORDER[b.risk] ?? 99;
                              if (orderA !== orderB) return orderA - orderB;
                              return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
                            });
                          
                          if (patients.length === 0) {
                            return (
                              <div className="py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex flex-col items-center justify-center gap-2 opacity-50 bg-slate-50/10 dark:bg-slate-900/10">
                                <Users className="h-8 w-8 text-slate-400 dark:text-slate-600" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Sem pacientes alocados</p>
                              </div>
                            );
                          }

                          const isTriage = selectedSector.name.includes('TRIAGEM');

                          return patients.map(patient => (
                            <div key={patient.id} className="p-4 rounded-xl border border-slate-200/45 dark:border-slate-800/45 bg-slate-50/30 dark:bg-slate-900/20 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors group/row">
                              <div className="flex items-center justify-between mb-3 bg-transparent">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "h-3 w-3 rounded-full animate-pulse",
                                    patient.risk === 'emergency' ? "bg-red-500" : 
                                    patient.risk === 'very-urgent' ? "bg-orange-500" :
                                    patient.risk === 'urgent' ? "bg-[#FFDE21]" : 
                                    patient.risk === 'less-urgent' ? "bg-green-500" : "bg-blue-600"
                                  )} />
                                  <div>
                                    <p className="text-sm font-bold text-foreground">
                                      {patient.name.toUpperCase().includes('NÃO IDENTIFICADO') || patient.name.toUpperCase().includes('DESCONHECIDO') 
                                        ? "PACIENTE NÃO IDENTIFICADO" 
                                        : formatWords(patient.name)}
                                    </p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                      {patient.age} anos • Ticket: {patient.ticket}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                  {isTriage ? (
                                    <Button 
                                      variant="default" 
                                      size="sm" 
                                      className="h-7 px-2 text-[8px] font-black uppercase bg-[#006699] hover:bg-[#005580] dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-white border-none"
                                      onClick={() => navigate('/triagem')}
                                    >
                                      Ir para Triagem
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-7 px-2 text-[8px] font-black uppercase text-muted-foreground hover:text-[#006699] dark:hover:text-sky-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                                      onClick={() => navigate(`/paciente/${patient.id}`, { state: { from: '/setores', label: 'Setores' } })}
                                    >
                                      Prontuário
                                    </Button>
                                  )}
                                  <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="h-7 px-2 text-[8px] font-black uppercase border border-slate-200/50 dark:border-slate-800 text-foreground"
                                    onClick={() => setTransferringPatientId(patient.id)}
                                  >
                                    Transferir
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Tempo em sala: {(() => {
                                    const diff = Math.floor((new Date().getTime() - new Date(patient.arrivalTime).getTime()) / 60000);
                                    return diff > 60 ? `${Math.floor(diff/60)}h ${diff%60}min` : `${diff} min`;
                                  })()}</span>
                                </div>
                              </div>

                              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-205 dark:border-slate-800">
                                <Button 
                                  className="flex-1 h-9 text-[10px] font-black uppercase bg-[#006699] hover:bg-[#005580] dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 text-white border-none shadow-sm"
                                  onClick={() => {
                                    callPatient(patient);
                                    setShowSectorDialog(false);
                                  }}
                                >
                                  Chamar Senha
                                </Button>
                                <Button 
                                  variant="outline"
                                  className="flex-1 h-9 text-[10px] font-black uppercase border border-red-200/70 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                                  onClick={() => {
                                    updatePatient(patient.id, { status: 'completed' });
                                    setShowSectorDialog(false);
                                  }}
                                >
                                  Liberar Vaga
                                </Button>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="transfer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-4 bg-transparent">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400 flex items-center gap-2">
                          <HeartPulse className="h-3.5 w-3.5 text-red-500" /> Selecionar Destino
                        </h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-[8px] font-black uppercase text-muted-foreground hover:text-foreground hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                          onClick={() => setTransferringPatientId(null)}
                        >
                          Voltar
                        </Button>
                      </div>

                      <div className="relative mb-4">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                        <Input 
                          placeholder="BUSCAR SETOR..." 
                          className="pl-10 h-10 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-200/50 dark:border-slate-850 bg-white/70 dark:bg-slate-900/30 backdrop-blur-md"
                          value={searchSector}
                          onChange={(e) => setSearchSector(e.target.value)}
                        />
                      </div>

                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-2">
                          {filteredSectors.map((s) => (
                            <button
                              key={s.name}
                              onClick={() => {
                                updatePatient(transferringPatientId!, { sector: s.name });
                                setTransferringPatientId(null);
                                setShowSectorDialog(false);
                              }}
                              className="w-full p-4 rounded-xl border border-slate-205 dark:border-slate-800/45 hover:border-[#006699]/40 dark:hover:border-sky-500/30 hover:bg-[#006699]/5 dark:hover:bg-sky-400/5 transition-all flex items-center justify-between group bg-white/40 dark:bg-slate-900/10 text-left"
                            >
                              <div className="flex items-center gap-3 text-left">
                                <div className={cn("p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/70 border border-slate-200/30 dark:border-slate-800/30", s.groupColor)}>
                                  <s.groupIcon className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                  <p className="text-[11px] font-black uppercase tracking-tight text-foreground">{s.name}</p>
                                  <p className="text-[8px] font-bold text-muted-foreground uppercase">{s.description}</p>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-all text-[#006699] dark:text-sky-400" />
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!transferringPatientId && (
                  <div className="pt-4 border-t border-slate-200/45 dark:border-slate-800/45">
                    <Button 
                      className="w-full font-black uppercase text-[10px] h-12 bg-slate-100 dark:bg-slate-800 border-none hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground"
                      variant="secondary"
                      onClick={() => setShowSectorDialog(false)}
                    >
                      Fechar Detalhes
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
