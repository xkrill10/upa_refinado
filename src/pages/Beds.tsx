import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BedDouble, AlertCircle, CheckCircle2, Settings2, Info, UserRound, HeartPulse, Thermometer, Droplets, Activity, Sparkles, Clock3, Timer, Pill, ArrowRightLeft, Stethoscope, ArrowRight, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn, formatWords } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useBeds, BedStatus } from "@/context/BedsContext";
import { usePatients, Patient } from "@/hooks/use-patients";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const RISK_ORDER: Record<string, number> = { 
  'emergency': 0, 
  'very-urgent': 1, 
  'urgent': 2, 
  'less-urgent': 3, 
  'not-urgent': 4 
};

export default function Beds() {
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<BedStatus | 'all'>('all');
  const [selectedRisk, setSelectedRisk] = useState<Patient['risk'] | null>(null);
  const [activeTab, setActiveTab] = useState("census");
  const [editingVitalsPatient, setEditingVitalsPatient] = useState<Patient | null>(null);
  const [summaryPatient, setSummaryPatient] = useState<Patient | null>(null);
  const [timelinePatient, setTimelinePatient] = useState<Patient | null>(null);
  const [transferringBedId, setTransferringBedId] = useState<string | null>(null);
  const [targetBedId, setTargetBedId] = useState<string>("");
  const [localRisk, setLocalRisk] = useState<string | null>(null);
  const [vitalsForm, setVitalsForm] = useState({
    heartRate: "88",
    bloodPressure: "12/8",
    saturation: "98",
    temperature: "36.5"
  });
  const { beds, updateBedStatus, transferPatient, getStats } = useBeds();
  const { patients, updatePatient } = usePatients();
  const stats = getStats();
  const navigate = useNavigate();

  const getBedPatient = (bed: typeof beds[number]) => {
    if (bed.status !== 'occupied') return undefined;
    const linkedPatient = patients.find(patient => patient.id === bed.patientId);
    if (linkedPatient) return linkedPatient;

    if (bed.id.startsWith('e-')) {
      const position = Number(bed.id.replace('e-', '')) - 1;
      return patients[position];
    }

    if (bed.id.startsWith('o-')) {
      const position = Number(bed.id.replace('o-', '')) + 4;
      return patients[position % patients.length];
    }

    return undefined;
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedRisk(null);
  };

  const riskStats = [
    { label: 'Emergência', risk: 'emergency' as const, color: 'bg-red-500', activeColor: 'ring-red-500/50', icon: AlertCircle },
    { label: 'Muito Urgente', risk: 'very-urgent' as const, color: 'bg-orange-500', activeColor: 'ring-orange-500/50', icon: Clock3 },
    { label: 'Urgente', risk: 'urgent' as const, color: 'bg-[#FFDE21]', activeColor: 'ring-[#FFDE21]/50', icon: HeartPulse, iconColor: 'text-black' },
    { label: 'Pouco Urgente', risk: 'less-urgent' as const, color: 'bg-green-500', activeColor: 'ring-green-500/50', icon: Stethoscope },
    { label: 'Não Urgente', risk: 'not-urgent' as const, color: 'bg-blue-600', activeColor: 'ring-blue-600/50', icon: Pill },
  ];

  const occupiedBedsWithPatients = beds
    .filter(b => b.status === 'occupied')
    .map(b => ({ bed: b, patient: getBedPatient(b) }))
    .filter(item => item.patient !== undefined) as { bed: typeof beds[number], patient: Patient }[];

  const handleTransfer = () => {
    if (transferringBedId && targetBedId) {
      transferPatient(transferringBedId, targetBedId);
      const targetBed = beds.find(b => b.id === targetBedId);
      toast.success("Transferência realizada", {
        description: `Paciente transferido com sucesso para o ${targetBed?.name}.`
      });
      setTransferringBedId(null);
      setTargetBedId("");
    }
  };

  const statusConfig: Record<BedStatus, { label: string, color: string, icon: LucideIcon, description: string }> = {
    occupied: { 
      label: 'Ocupado', 
      color: 'bg-red-500/10 text-red-500 border-red-500/20', 
      icon: AlertCircle,
      description: 'Leito em uso por um paciente.'
    },
    available: { 
      label: 'Disponível', 
      color: 'bg-green-500/10 text-green-500 border-green-500/20', 
      icon: CheckCircle2,
      description: 'Pronto para receber novos pacientes.'
    },
    maintenance: { 
      label: 'Manutenção', 
      color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', 
      icon: Settings2,
      description: 'Leito em limpeza ou reparo técnico.'
    },
  };

  const selectedBed = beds.find(b => b.id === selectedBedId);
  const filteredBeds = filter === 'all' ? beds : beds.filter(b => b.status === filter);

  const emergencyBedsTotal = beds.filter(b => b.id.startsWith('e-'));
  const observationBedsTotal = beds.filter(b => b.id.startsWith('o-'));
  
  const emergencyBeds = filteredBeds.filter(b => b.id.startsWith('e-'));
  const observationBeds = filteredBeds.filter(b => b.id.startsWith('o-'));

  const handleStatusChange = (newStatus: BedStatus) => {
    if (selectedBedId) {
      updateBedStatus(selectedBedId, newStatus);
      toast.success("Status atualizado", {
        description: `O ${selectedBed?.name} agora está ${statusConfig[newStatus].label.toLowerCase()}.`
      });
    }
  };

  const toggleFilter = (newFilter: BedStatus) => {
    setFilter(prev => prev === newFilter ? 'all' : newFilter);
  };

  const renderBedCards = (bedsList: typeof beds) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {bedsList.length === 0 ? (
        <div className="col-span-4 py-16 text-center text-muted-foreground italic">
          Nenhum leito encontrado para o status selecionado nesta ala.
        </div>
      ) : bedsList.map((bed) => {
        const config = statusConfig[bed.status];
        const patient = getBedPatient(bed);
        const getPremiumStyles = (risk: string | undefined) => {
          switch (risk) {
            case 'emergency': return 'border-red-500/40 dark:border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.15)] ring-1 ring-red-500/10 dark:ring-red-500/20 bg-white/70 dark:bg-slate-900/45 rounded-xl';
            case 'very-urgent': return 'border-orange-500/40 dark:border-orange-500/50 shadow-[0_0_25px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/10 dark:ring-orange-500/20 bg-white/70 dark:bg-slate-900/45 rounded-xl';
            case 'urgent': return 'border-amber-400/40 dark:border-amber-400/55 shadow-[0_0_25px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/10 dark:ring-amber-400/20 bg-white/70 dark:bg-slate-900/45 rounded-xl';
            case 'less-urgent': return 'border-emerald-500/40 dark:border-emerald-500/55 shadow-[0_0_25px_rgba(34,197,94,0.15)] ring-1 ring-emerald-500/10 dark:ring-emerald-500/20 bg-white/70 dark:bg-slate-900/45 rounded-xl';
            default: return 'border-slate-200/40 dark:border-slate-800/40 shadow-xl bg-white/70 dark:bg-slate-900/45 rounded-xl';
          }
        };

        const getAccentColor = (risk: string | undefined) => {
          switch (risk) {
            case 'emergency': return 'bg-red-500';
            case 'very-urgent': return 'bg-orange-500';
            case 'urgent': return 'bg-[#FFDE21]';
            case 'less-urgent': return 'bg-green-500';
            default: return 'bg-slate-300';
          }
        };

        const premiumStyles = getPremiumStyles(patient?.risk);
        const accentColor = getAccentColor(patient?.risk);

        return (
          <motion.div
            key={bed.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="h-full"
          >
            <Card className={cn(
              "group transition-all duration-500 overflow-hidden h-full flex flex-col relative rounded-xl border-none shadow-none",
              bed.status === 'occupied' ? premiumStyles : "border border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/45 hover:bg-white/90 dark:hover:bg-slate-900/60 shadow-xl"
            )}>
              {/* Premium Top Accent */}
              {bed.status === 'occupied' && (
                <div className={cn("absolute top-0 left-0 right-0 h-1 z-10", accentColor)} />
              )}
              
              {bed.status === 'maintenance' && (
                <div className="absolute top-0 left-0 right-0 h-1 z-10 bg-yellow-500 animate-pulse" />
              )}
              <CardHeader className="pb-3 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                      bed.status === 'occupied' ? "bg-red-500/10 text-red-500" : 
                      bed.status === 'maintenance' ? "bg-yellow-500/10 text-yellow-500" : "bg-emerald-500/10 text-emerald-500"
                    )}>
                      <BedDouble className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-foreground">{bed.name}</CardTitle>
                      <p className="text-[10px] font-medium text-muted-foreground opacity-70">{bed.ward} · {bed.room}</p>
                    </div>
                  </div>
                    <Badge variant="outline" className={cn("text-[9px] font-bold px-2 py-0", config.color)}>
                      {config.label}
                    </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0 space-y-4 flex-1">
                {bed.status === 'occupied' ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/45 border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-sm">
                       <div 
                         className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-[#006699]/5 dark:hover:bg-sky-450/5 p-1 rounded-lg transition-colors group/pname"
                         onClick={(e) => {
                           e.stopPropagation();
                           setSummaryPatient(patient);
                         }}
                       >
                         <UserRound className="h-3 w-3 text-[#006699] dark:text-sky-400 group-hover/pname:scale-110 transition-transform" />
                         <span className="text-[11px] font-bold truncate group-hover/pname:text-[#006699] dark:group-hover/pname:text-sky-300 text-foreground">{formatWords(patient?.name || "")}</span>
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                          <div 
                            className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase cursor-help hover:text-[#006699] dark:hover:text-sky-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTimelinePatient(patient);
                            }}
                          >
                            <Timer className="h-2.5 w-2.5 text-blue-500" /> Permanência: 4h
                          </div>
                          <div 
                            className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase cursor-pointer hover:text-[#006699] dark:hover:text-sky-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingVitalsPatient(patient); // Reusing the modal for now, but we can add risk change there
                            }}
                          >
                            <AlertCircle className={cn(
                              "h-2.5 w-2.5",
                              patient.risk === 'emergency' ? "text-red-500 animate-pulse" : "text-emerald-500"
                            )} /> Risco: {patient.risk === 'emergency' ? 'Crítico' : 'Estável'}
                          </div>
                       </div>
                    </div>

                    <div 
                      className="grid grid-cols-4 gap-2 cursor-pointer hover:opacity-85 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingVitalsPatient(patient);
                        setLocalRisk(patient.risk); // Initialize local risk
                        if (patient.vitals) {
                          setVitalsForm({
                            heartRate: patient.vitals.heartRate || "88",
                            bloodPressure: patient.vitals.bloodPressure || "12/8",
                            saturation: patient.vitals.saturation || "98",
                            temperature: patient.vitals.temperature || "36.5"
                          });
                        }
                      }}
                    >
                       <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/20">
                         <HeartPulse className="h-3 w-3 text-red-500 mb-1" />
                         <span className="text-[9px] font-black text-foreground">{patient.vitals?.heartRate || "88"}</span>
                         <span className="text-[7px] font-bold uppercase text-muted-foreground">FC</span>
                       </div>
                       <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/20">
                         <Activity className="h-3 w-3 text-blue-500 mb-1" />
                         <span className="text-[9px] font-black text-foreground">{patient.vitals?.bloodPressure || "12/8"}</span>
                         <span className="text-[7px] font-bold uppercase text-muted-foreground">PA</span>
                       </div>
                       <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/20">
                         <Droplets className="h-3 w-3 text-emerald-500 mb-1" />
                         <span className="text-[9px] font-black text-foreground">{patient.vitals?.saturation ? patient.vitals.saturation + "%" : "98%"}</span>
                         <span className="text-[7px] font-bold uppercase text-muted-foreground">SAT</span>
                       </div>
                       <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/20">
                         <Thermometer className="h-3 w-3 text-orange-500 mb-1" />
                         <span className="text-[9px] font-black text-foreground">{patient.vitals?.temperature || "36.5"}</span>
                         <span className="text-[7px] font-bold uppercase text-muted-foreground">TEMP</span>
                       </div>
                    </div>
                  </div>
                ) : bed.status === 'maintenance' ? (
                  <div className="py-6 flex flex-col items-center justify-center gap-2 opacity-60">
                    <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-center text-foreground animate-pulse">Aguardando Higienização</p>
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center gap-2 opacity-40">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-center text-foreground">Leito Disponível</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2 mt-auto">
                  <Button
                    variant="outline"
                    className="flex-1 text-[9px] font-black uppercase h-9 rounded-xl border-slate-200/60 dark:border-slate-800"
                    onClick={() => setSelectedBedId(bed.id)}
                  >
                    Gerenciar
                  </Button>
                  {bed.status === 'available' && (
                    <Button
                      variant="secondary"
                      className="flex-1 text-[9px] font-black uppercase h-9 rounded-xl"
                      onClick={() => updateBedStatus(bed.id, 'maintenance')}
                    >
                      <Sparkles className="h-3 w-3 mr-1" /> Limpar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#006699]/10 dark:bg-sky-400/10 flex items-center justify-center text-[#006699] dark:text-sky-400 shrink-0">
            <BedDouble className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">Gestão de Leitos</h1>
            <p className="text-muted-foreground text-[11px] font-black uppercase tracking-widest mt-0.5">
              Capacidade: {emergencyBedsTotal.length} Emergência | {observationBedsTotal.length} Observação
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            type="button"
            onClick={() => toggleFilter('available')}
            className={cn(
              "px-4 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-300",
              filter === 'available' 
                ? "bg-emerald-500 text-white border-emerald-600 shadow-lg scale-105" 
                : "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10"
            )}
          >
            <div className={cn("h-2 w-2 rounded-full", filter === 'available' ? "bg-white animate-pulse" : "bg-emerald-500")} />
            <span className="font-bold text-xs">{stats.available} Disponíveis</span>
          </button>
          
          <button 
            type="button"
            onClick={() => toggleFilter('occupied')}
            className={cn(
              "px-4 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-300",
              filter === 'occupied' 
                ? "bg-red-500 text-white border-red-600 shadow-lg scale-105" 
                : "border-red-500/30 bg-red-500/5 text-red-600 hover:bg-red-500/10"
            )}
          >
            <div className={cn("h-2 w-2 rounded-full", filter === 'occupied' ? "bg-white" : "bg-red-500")} />
            <span className="font-bold text-xs">{stats.occupied} Ocupados</span>
          </button>

          <button 
            type="button"
            onClick={() => toggleFilter('maintenance')}
            className={cn(
              "px-4 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-300",
              filter === 'maintenance' 
                ? "bg-yellow-500 text-white border-yellow-600 shadow-lg scale-105" 
                : "border-yellow-500/30 bg-yellow-500/5 text-yellow-600 hover:bg-yellow-500/10"
            )}
          >
            <div className={cn("h-2 w-2 rounded-full", filter === 'maintenance' ? "bg-white" : "bg-yellow-500")} />
            <span className="font-bold text-xs">{stats.maintenance} Manutenção</span>
          </button>

          {filter !== 'all' && (
            <Button variant="ghost" size="sm" onClick={() => setFilter('all')} className="text-[10px] font-black uppercase tracking-widest h-8 px-2 hover:bg-muted">
              Limpar Filtro
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-1 rounded-xl h-14 mb-8 overflow-x-auto flex-nowrap shrink-0 max-w-full shadow-inner border border-slate-200/40 dark:border-slate-800/45">
          <TabsTrigger 
            value="census" 
            onClick={() => {
              if (activeTab === 'census') setSelectedRisk(null);
            }}
            className="rounded-lg h-12 px-8 font-bold text-sm data-[state=active]:bg-[#006699] dark:data-[state=active]:bg-sky-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Censo Global ({occupiedBedsWithPatients.length})
            </div>
          </TabsTrigger>
          <TabsTrigger value="all" className="rounded-lg h-12 px-8 font-bold text-sm data-[state=active]:bg-slate-700 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
            Todas as Alas ({filteredBeds.length})
          </TabsTrigger>
          <TabsTrigger value="emergency" className="rounded-lg h-12 px-8 font-bold text-sm data-[state=active]:bg-red-500 dark:data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
            Emergência ({emergencyBeds.length})
          </TabsTrigger>
          <TabsTrigger value="observation" className="rounded-lg h-12 px-8 font-bold text-sm data-[state=active]:bg-amber-400 dark:data-[state=active]:bg-amber-500 data-[state=active]:text-black dark:data-[state=active]:text-slate-950 data-[state=active]:shadow-md transition-all">
            Observação ({observationBeds.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0 outline-none">
          {renderBedCards(filteredBeds)}
        </TabsContent>
        <TabsContent value="emergency" className="mt-0 outline-none">
          {renderBedCards(emergencyBeds)}
        </TabsContent>
        <TabsContent value="observation" className="mt-0 outline-none">
          {renderBedCards(observationBeds)}
        </TabsContent>
        <TabsContent value="census" className="mt-0 outline-none">
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {riskStats.map(stat => (
                <Card 
                  key={stat.risk} 
                  className={cn(
                    "glass-card border border-slate-200/40 dark:border-slate-800/40 rounded-xl shadow-lg cursor-pointer transition-all duration-[400ms] hover:scale-[1.01] active:scale-95 overflow-hidden group backdrop-blur-md",
                    selectedRisk === stat.risk 
                      ? cn("bg-white/90 dark:bg-slate-800/80 ring-2 ring-offset-2 ring-offset-background", stat.activeColor) 
                      : "bg-white/60 dark:bg-slate-900/40 grayscale-[0.2] hover:grayscale-0",
                  )}
                  onClick={() => setSelectedRisk(selectedRisk === stat.risk ? null : stat.risk)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg shadow-lg transition-transform group-hover:rotate-6",
                      stat.color,
                      stat.iconColor || "text-white"
                    )}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold text-muted-foreground tracking-tight truncate">{stat.label}</p>
                      <p className="text-xl font-bold text-foreground">{occupiedBedsWithPatients.filter(item => item.patient.risk === stat.risk).length}</p>
                    </div>
                  </CardContent>
                  {selectedRisk === stat.risk && (
                    <motion.div 
                      layoutId="bed-risk-active-indicator"
                      className={cn("h-1 w-full mt-auto", stat.color)}
                    />
                  )}
                </Card>
              ))}
            </div>

            <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500 rounded-xl">
              <CardHeader className="p-6 bg-white/40 dark:bg-slate-950/15 border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-sm font-black tracking-widest text-[#006699] dark:text-sky-400 uppercase">Ocupação Atualizada</CardTitle>
                      {selectedRisk && (
                        <Badge className={cn("text-[9px] font-bold", riskStats.find(r => r.risk === selectedRisk)?.color, riskStats.find(r => r.risk === selectedRisk)?.iconColor || "text-white")}>
                          Filtrando por: {riskStats.find(r => r.risk === selectedRisk)?.label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Todos os pacientes atualmente em leitos</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedRisk && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-[9px] font-black uppercase underline decoration-dotted underline-offset-4"
                        onClick={() => setSelectedRisk(null)}
                      >
                        Limpar Filtro
                      </Button>
                    )}
                    <Badge variant="outline" className="font-black border-slate-200/60 dark:border-slate-800">
                      {selectedRisk ? 'RESULTADOS' : 'TOTAL OCUPADO'}: {
                        occupiedBedsWithPatients.filter(item => !selectedRisk || item.patient.risk === selectedRisk).length
                      } PACIENTES
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 bg-transparent rounded-b-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {occupiedBedsWithPatients
                    .filter(item => !selectedRisk || item.patient.risk === selectedRisk)
                    .sort((a, b) => {
                      const orderA = RISK_ORDER[a.patient.risk] ?? 99;
                      const orderB = RISK_ORDER[b.patient.risk] ?? 99;
                      
                      if (orderA !== orderB) return orderA - orderB;
                      
                      // Secondary sort by arrival time (oldest first)
                      return new Date(a.patient.arrivalTime).getTime() - new Date(b.patient.arrivalTime).getTime();
                    })
                    .map(({ bed, patient }) => (
                      <div key={bed.id} className="glass-card bg-white/70 dark:bg-slate-900/45 border border-slate-200/40 dark:border-slate-800/40 rounded-xl p-4 flex flex-col gap-4 hover:shadow-2xl hover:bg-white/90 dark:hover:bg-slate-900/60 hover:-translate-y-1 transition-all duration-300 group shadow-none">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-100/85 dark:bg-slate-950/80 border border-slate-200/20 dark:border-slate-800/20 shadow-inner flex items-center justify-center font-black text-[10px] text-muted-foreground group-hover:bg-[#006699]/10 group-hover:text-[#006699] dark:group-hover:text-sky-400 transition-all">
                              {patient.ticket}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{formatWords(patient.name)}</p>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">{patient.age} Anos • CPF: {patient.cpf || '***'}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <Badge className={cn("text-[9px] font-bold px-2 py-0.5 shadow-sm", patient.risk === 'emergency' ? "bg-red-500 hover:bg-red-600" : patient.risk === 'very-urgent' ? "bg-orange-500 hover:bg-orange-600" : patient.risk === 'urgent' ? "bg-[#FFDE21] text-black hover:bg-[#FFDE21]/90" : patient.risk === 'less-urgent' ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700")}>
                              {patient.risk === 'emergency' ? 'Emergência' : patient.risk === 'very-urgent' ? 'Muito Urgente' : patient.risk === 'urgent' ? 'Urgente' : patient.risk === 'less-urgent' ? 'Pouco Urgente' : 'Não Urgente'}
                            </Badge>
                            <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                              <div className={cn("h-1.5 w-1.5 rounded-full", patient.risk === 'emergency' ? "bg-red-500 animate-pulse" : patient.risk === 'very-urgent' ? "bg-orange-500 animate-pulse" : patient.risk === 'urgent' ? "bg-[#FFDE21] animate-pulse" : patient.risk === 'less-urgent' ? "bg-green-500" : "bg-blue-600")} />
                              {bed.name} ({bed.ward})
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 bg-slate-50/50 dark:bg-slate-950/50 p-2 rounded-xl border border-slate-200/40 dark:border-slate-800/40 shadow-inner">
                          <div className="flex items-center justify-center gap-2">
                            <HeartPulse className="h-3.5 w-3.5 text-red-500" />
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black leading-none text-foreground">{patient.vitals?.heartRate || "--"}</span>
                              <span className="text-[8px] font-bold text-muted-foreground leading-none mt-0.5">BPM</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-2 border-l border-r border-slate-200/40 dark:border-slate-800/40">
                            <Activity className="h-3.5 w-3.5 text-blue-500" />
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black leading-none text-foreground">{patient.vitals?.bloodPressure || "--"}</span>
                              <span className="text-[8px] font-bold text-muted-foreground leading-none mt-0.5">PA</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Droplets className="h-3.5 w-3.5 text-green-500" />
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black leading-none text-foreground">{patient.vitals?.saturation ? patient.vitals.saturation + "%" : "--"}</span>
                              <span className="text-[8px] font-bold text-muted-foreground leading-none mt-0.5">O2</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-[10px] font-black uppercase tracking-widest rounded-xl h-10 bg-white/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 hover:bg-[#006699] hover:text-white dark:hover:bg-sky-500 dark:hover:text-slate-950 hover:border-transparent transition-all shadow-sm text-foreground" 
                          onClick={() => navigate(`/paciente/${patient.id}`, { state: { from: '/leitos', label: 'Leitos' } })}
                        >
                          Visualizar Prontuário <ArrowRight className="h-3.5 w-3.5 ml-2" />
                        </Button>
                      </div>
                    ))}
                    
                    {occupiedBedsWithPatients.filter(item => !selectedRisk || item.patient.risk === selectedRisk).length === 0 && (
                      <div className="col-span-full py-16 text-center flex flex-col items-center gap-3">
                        <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                          <BedDouble className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Nenhum paciente encontrado com este filtro</p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedBedId} onOpenChange={(open) => !open && setSelectedBedId(null)}>
        {selectedBed && (
          <DialogContent className="sm:max-w-[480px] rounded-xl p-0 overflow-hidden border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl">
            <DialogHeader className="p-8 pb-4 border-b border-slate-200/40 dark:border-slate-800/40 flex-row items-center gap-4 space-y-0 text-left bg-slate-50/30 dark:bg-slate-950/30">
              <div className="h-12 w-12 rounded-xl bg-[#006699]/10 dark:bg-sky-400/10 flex items-center justify-center text-[#006699] dark:text-sky-400 shrink-0">
                <BedDouble className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tight leading-none text-foreground">{selectedBed.name}</DialogTitle>
                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1.5">
                  {selectedBed.ward} · {selectedBed.room}
                </DialogDescription>
              </div>
            </DialogHeader>
            
            <div className="grid gap-6 p-8 py-5">
              <Tabs defaultValue="status" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-lg h-12 border border-slate-200/40 dark:border-slate-800/40">
                  <TabsTrigger value="status" className="rounded-md text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#006699] dark:data-[state=active]:bg-sky-500 data-[state=active]:text-white dark:data-[state=active]:text-slate-950 transition-all">Status</TabsTrigger>
                  <TabsTrigger value="care" className="rounded-md text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#006699] dark:data-[state=active]:bg-sky-500 data-[state=active]:text-white dark:data-[state=active]:text-slate-950 transition-all">Cuidados</TabsTrigger>
                  <TabsTrigger value="meds" className="rounded-md text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#006699] dark:data-[state=active]:bg-sky-500 data-[state=active]:text-white dark:data-[state=active]:text-slate-950 transition-all">Prescrição</TabsTrigger>
                </TabsList>

                <TabsContent value="status" className="space-y-4 outline-none">
                  <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/45 border border-slate-200/40 dark:border-slate-800/30">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400 mb-3 flex items-center gap-2">
                      <Info className="h-3 w-3" />
                      Ocupação do Leito
                    </h4>
                    <Select value={selectedBed.status} onValueChange={(value) => handleStatusChange(value as BedStatus)}>
                      <SelectTrigger className="w-full h-12 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 shadow-sm font-bold text-foreground">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl bg-white dark:bg-slate-950">
                        <SelectItem value="available" className="font-bold text-emerald-600">Disponível</SelectItem>
                        <SelectItem value="occupied" className="font-bold text-red-600">Ocupado</SelectItem>
                        <SelectItem value="maintenance" className="font-bold text-yellow-600">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed italic opacity-70">
                      {statusConfig[selectedBed.status].description}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="care" className="space-y-4 outline-none">
                  <div className="space-y-3">
                    {[
                      { label: 'Ronda Médica Realizada', icon: UserRound, color: 'text-blue-500' },
                      { label: 'Evolução de Enfermagem', icon: Activity, color: 'text-emerald-500' },
                      { label: 'Acesso Venoso (PVP) OK', icon: Droplets, color: 'text-purple-500' },
                      { label: 'Mudança de Decúbito', icon: BedDouble, color: 'text-orange-500' },
                    ].map((care, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/30 dark:bg-slate-900/20 border border-slate-200/40 dark:border-slate-800/20 group hover:border-[#006699]/30 dark:hover:border-sky-400/30 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-8 w-8 rounded-lg bg-white dark:bg-slate-950 flex items-center justify-center border border-slate-205 dark:border-slate-800 shadow-sm")}>
                            <care.icon className={cn("h-4 w-4", care.color)} />
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-tight text-foreground">{care.label}</span>
                        </div>
                        <input type="checkbox" className="h-5 w-5 rounded-md border-slate-300 dark:border-slate-700 accent-[#006699] dark:accent-sky-500 cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="meds" className="space-y-4 outline-none">
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 dark:border-blue-500/30">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Pill className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Soro em Curso</span>
                        </div>
                        <Badge className="bg-blue-500 text-white text-[8px]">80 ml/h</Badge>
                      </div>
                      <p className="text-xs font-bold text-foreground">Soro Fisiológico 0,9% 500ml + Dipirona 2g</p>
                      <div className="mt-3 h-1.5 w-full bg-blue-100 dark:bg-blue-950 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '65%' }}
                          className="h-full bg-blue-500"
                        />
                      </div>
                      <p className="mt-2 text-[9px] text-blue-600/70 dark:text-blue-400/70 font-bold uppercase tracking-tight text-right">Previsão término: 14:30</p>
                    </div>

                    <Button variant="outline" className="w-full h-10 rounded-xl border-dashed border-2 border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest hover:border-[#006699] dark:hover:border-sky-400 hover:text-[#006699] dark:hover:text-sky-400 transition-all text-muted-foreground bg-transparent">
                      + Adicionar Medicação
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-3 pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400 px-1">Atividades Recentes</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/20 text-[11px] flex justify-between items-center text-foreground">
                    <span className="font-medium text-muted-foreground">Status alterado para {statusConfig[selectedBed.status].label}</span>
                    <span className="text-[10px] opacity-50 font-mono">Agora</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-wrap gap-2 p-8 pt-4 border-t border-slate-200/40 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-950/30">
                <Button 
                  type="button" 
                  className="flex-1 h-12 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] bg-slate-900 dark:bg-slate-100 hover:bg-slate-850 text-white dark:text-slate-950"
                  onClick={() => setSelectedBedId(null)}
                >
                  Concluir
                </Button>
                {selectedBed && selectedBed.status === 'occupied' && (
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-500/25 dark:text-amber-400 dark:hover:bg-amber-500/10 bg-transparent"
                    onClick={() => {
                      setTransferringBedId(selectedBed.id);
                      setSelectedBedId(null);
                    }}
                  >
                    <ArrowRightLeft className="h-3 w-3 mr-2" /> Trocar Leito
                  </Button>
                )}
                {selectedBed && (
                  <Button
                    variant="secondary"
                    className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                    onClick={() => {
                      const patient = getBedPatient(selectedBed);
                      if (patient) {
                        navigate(`/paciente/${patient.id}`, { state: { from: '/leitos', label: 'Leitos' } });
                        setSelectedBedId(null);
                      } else {
                        toast.info("Leito não possui paciente associado.");
                      }
                    }}
                  >
                    Prontuário
                  </Button>
                )}
              </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      <Dialog open={!!editingVitalsPatient} onOpenChange={(open) => !open && setEditingVitalsPatient(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-xl p-0 overflow-hidden border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl">
          {editingVitalsPatient && (
            <div>
              <div className="p-8 border-b border-slate-200/40 dark:border-slate-800/40 flex items-center gap-4 bg-slate-50/30 dark:bg-slate-950/30">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black uppercase tracking-tight text-foreground">Atualizar Sinais</DialogTitle>
                  <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {editingVitalsPatient.name.toUpperCase() === editingVitalsPatient.name ? formatWords(editingVitalsPatient.name) : editingVitalsPatient.name} • Ticket: {editingVitalsPatient.ticket}
                  </DialogDescription>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-450 ml-1">Frequência Card. (BPM)</label>
                    <div className="relative">
                      <HeartPulse className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500/50" />
                      <input 
                        type="text" 
                        className="w-full h-12 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl pl-10 pr-4 text-sm font-black text-foreground focus:ring-2 focus:ring-[#006699]/20 dark:focus:ring-sky-55/20 transition-all outline-none"
                        value={vitalsForm.heartRate}
                        onChange={(e) => setVitalsForm({...vitalsForm, heartRate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-450 ml-1">Pressão Art. (PA)</label>
                    <div className="relative">
                      <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500/50" />
                      <input 
                        type="text" 
                        className="w-full h-12 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl pl-10 pr-4 text-sm font-black text-foreground focus:ring-2 focus:ring-[#006699]/20 dark:focus:ring-sky-55/20 transition-all outline-none"
                        value={vitalsForm.bloodPressure}
                        onChange={(e) => setVitalsForm({...vitalsForm, bloodPressure: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-450 ml-1">Saturação (SpO2 %)</label>
                    <div className="relative">
                      <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50" />
                      <input 
                        type="text" 
                        className="w-full h-12 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl pl-10 pr-4 text-sm font-black text-foreground focus:ring-2 focus:ring-[#006699]/20 dark:focus:ring-sky-55/20 transition-all outline-none"
                        value={vitalsForm.saturation}
                        onChange={(e) => setVitalsForm({...vitalsForm, saturation: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-450 ml-1">Temperatura (°C)</label>
                    <div className="relative">
                      <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500/50" />
                      <input 
                        type="text" 
                        className="w-full h-12 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl pl-10 pr-4 text-sm font-black text-foreground focus:ring-2 focus:ring-[#006699]/20 dark:focus:ring-sky-55/20 transition-all outline-none"
                        value={vitalsForm.temperature}
                        onChange={(e) => setVitalsForm({...vitalsForm, temperature: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {localRisk !== editingVitalsPatient.risk && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 mb-2"
                  >
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-300 leading-tight">
                      ATENÇÃO: Você alterou a classificação de risco. 
                      <br/><span className="opacity-70 font-medium tracking-tight">Clique em "Confirmar e Salvar" para aplicar no prontuário.</span>
                    </p>
                  </motion.div>
                )}

                <div className="space-y-2 pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Classificação de Risco (Manchester)</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'emergency', color: 'bg-red-500', label: 'Emergência' },
                      { id: 'very-urgent', color: 'bg-orange-500', label: 'Muito Urgente' },
                      { id: 'urgent', color: 'bg-[#FFDE21]', label: 'Urgente' },
                      { id: 'less-urgent', color: 'bg-green-500', label: 'Pouco Urgente' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setLocalRisk(r.id);
                        }}
                        className={cn(
                          "flex-1 h-8 rounded-lg text-[8px] font-black uppercase text-white transition-all hover:scale-105",
                          r.color,
                          localRisk === r.id ? "ring-2 ring-offset-2 ring-slate-400 scale-110 shadow-lg" : "opacity-45"
                        )}
                      >
                        {r.id.split('-')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-transparent border-slate-200/60 dark:border-slate-800 text-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => setEditingVitalsPatient(null)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-[#006699] hover:bg-[#006699]/95 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950"
                    onClick={() => {
                      if (!editingVitalsPatient) return;
                      updatePatient(editingVitalsPatient.id, { 
                        risk: localRisk as Patient['risk'],
                        vitals: {
                          heartRate: vitalsForm.heartRate,
                          bloodPressure: vitalsForm.bloodPressure,
                          saturation: vitalsForm.saturation,
                          temperature: vitalsForm.temperature
                        }
                      } as Partial<Patient>);
                      toast.success("Dados Sincronizados!", {
                        description: `Risco e sinais de ${editingVitalsPatient.name} atualizados com sucesso.`
                      });
                      setEditingVitalsPatient(null);
                      setLocalRisk(null);
                    }}
                  >
                    Confirmar e Salvar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!summaryPatient} onOpenChange={(open) => !open && setSummaryPatient(null)}>
        <DialogContent className="sm:max-w-[450px] rounded-xl p-0 overflow-hidden border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl">
          {summaryPatient && (
            <div className="relative">
              <div className={cn(
                "h-2 w-full",
                summaryPatient.risk === 'emergency' ? "bg-red-500" : 
                summaryPatient.risk === 'very-urgent' ? "bg-orange-500" :
                summaryPatient.risk === 'urgent' ? "bg-[#FFDE21]" : "bg-blue-500"
              )} />
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-12 w-12 rounded-xl bg-[#006699]/10 dark:bg-sky-450/10 flex items-center justify-center text-[#006699] dark:text-sky-400 shrink-0">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-foreground tracking-tight leading-none">{formatWords(summaryPatient.name)}</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                      Ticket: {summaryPatient.ticket} • {summaryPatient.age} Anos
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-200/40 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-950/20 rounded-lg">
                   <div className="text-center">
                     <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Idade</p>
                     <p className="text-sm font-black text-foreground">{summaryPatient.age} ANOS</p>
                   </div>
                   <div className="text-center border-x border-slate-200/40 dark:border-slate-800/40">
                     <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Sexo</p>
                     <p className="text-sm font-black text-foreground">MASCULINO</p>
                   </div>
                   <div className="text-center">
                     <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Peso</p>
                     <p className="text-sm font-black text-foreground">82 KG</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-[#006699]/10 dark:bg-sky-400/10 flex items-center justify-center shrink-0">
                        <Activity className="h-5 w-5 text-[#006699] dark:text-sky-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Queixa Principal</p>
                        <p className="text-sm font-bold leading-tight text-foreground">{summaryPatient.mainComplaint || 'Não informada'}</p>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Alergias Conhecidas</p>
                        <p className="text-sm font-black text-red-600 dark:text-red-400">NENHUMA INFORMADA</p>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Pill className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-55 text-blue-550">Observação Clínica</p>
                        <p className="text-xs font-medium text-muted-foreground leading-relaxed italic">
                          Paciente aguardando resultados laboratoriais e estabilização de sinais vitais para possível alta.
                        </p>
                      </div>
                   </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
                  <Button 
                    className="flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest bg-transparent border-slate-200/60 dark:border-slate-800 text-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                    variant="outline"
                    onClick={() => setSummaryPatient(null)}
                  >
                    Fechar
                  </Button>
                  <Button 
                    asChild
                    className="flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest bg-[#006699] hover:bg-[#006699]/90 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950"
                  >
                    <Link to={`/paciente/${summaryPatient.id}`} state={{ from: '/leitos', label: 'Leitos' }} onClick={() => setSummaryPatient(null)}>
                      Prontuário Completo
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!timelinePatient} onOpenChange={(open) => !open && setTimelinePatient(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-xl p-0 overflow-hidden border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl">
          {timelinePatient && (
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Clock3 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-xl font-black uppercase tracking-tight leading-none text-foreground">Jornada do Paciente</DialogTitle>
                  <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Rastreamento de Fluxo Operacional
                  </DialogDescription>
                </div>
              </div>

              <div className="space-y-0 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {[
                  { title: 'Admissão / Recepção', time: '08:00', duration: '5 min', status: 'completed', icon: UserRound },
                  { title: 'Classificação de Risco', time: '08:05', duration: '12 min', status: 'completed', icon: AlertCircle },
                  { title: 'Consulta Médica', time: '08:17', duration: '45 min', status: 'completed', icon: Activity },
                  { title: 'Alocação no Leito', time: '09:02', duration: '3h 15min', status: 'current', icon: BedDouble },
                  { title: 'Alta / Transferência', time: '--:--', duration: '--', status: 'pending', icon: CheckCircle2 },
                ].map((step, idx) => (
                  <div key={idx} className="relative pl-12 pb-8 last:pb-0">
                    <div className={cn(
                      "absolute left-0 h-9 w-9 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-sm z-10 transition-all",
                      step.status === 'completed' ? "bg-emerald-500 text-white" : 
                      step.status === 'current' ? "bg-blue-500 text-white animate-pulse" : "bg-slate-100 dark:bg-slate-900 text-muted-foreground border-slate-200 dark:border-slate-800"
                    )}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={cn(
                          "text-xs font-black uppercase tracking-tight",
                          step.status === 'pending' ? "text-muted-foreground opacity-50" : "text-foreground"
                        )}>{step.title}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground opacity-70">
                          {step.status === 'pending' ? 'Aguardando estágio' : `Duração: ${step.duration}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black font-mono bg-slate-105/50 dark:bg-slate-900/60 border border-slate-200/30 dark:border-slate-800/30 px-2 py-0.5 rounded-md text-foreground">
                          {step.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
                 <div className="flex justify-between items-center bg-blue-500/5 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-500/10 dark:border-blue-500/20">
                    <div className="flex items-center gap-2">
                       <Timer className="h-4 w-4 text-blue-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Tempo Total UPA</span>
                    </div>
                    <span className="text-sm font-black text-blue-600 dark:text-blue-400 tracking-tighter">4h 17min</span>
                 </div>
              </div>

              <Button 
                className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-850"
                onClick={() => setTimelinePatient(null)}
              >
                Entendi
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!transferringBedId} onOpenChange={(open) => !open && setTransferringBedId(null)}>
        <DialogContent className="sm:max-w-[450px] rounded-xl p-0 overflow-hidden border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl">
          <div className="p-8 pb-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <ArrowRightLeft className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tight leading-none text-foreground">Trocar Leito</DialogTitle>
                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1.5">
                  Selecione o leito de destino para o paciente
                </DialogDescription>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-11">Paciente em Transferência</p>
                <p className="text-lg font-bold text-foreground">
                  {transferringBedId && getBedPatient(beds.find(b => b.id === transferringBedId)!)?.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-slate-100/40 dark:bg-slate-900/40 text-[10px] font-bold border-slate-200/60 dark:border-slate-800">
                    {beds.find(b => b.id === transferringBedId)?.name}
                  </Badge>
                  <ArrowRightLeft className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Selecionar Destino</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Leitos Disponíveis</label>
                <Select value={targetBedId} onValueChange={setTargetBedId}>
                  <SelectTrigger className="w-full h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-sm font-bold text-foreground">
                    <SelectValue placeholder="Selecione o novo leito" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl max-h-[250px]">
                    {beds.filter(b => b.status === 'available').map(bed => (
                      <SelectItem key={bed.id} value={bed.id} className="font-bold text-foreground">
                        {bed.name} ({bed.ward})
                      </SelectItem>
                    ))}
                    {beds.filter(b => b.status === 'available').length === 0 && (
                      <div className="p-4 text-center text-xs text-muted-foreground italic">
                        Nenhum leito disponível no momento.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 flex gap-3 border-t border-slate-200/40 dark:border-slate-800/40 bg-slate-50/15 dark:bg-slate-950/20">
            <Button 
              variant="outline" 
              className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-transparent border-slate-200/60 dark:border-slate-800 text-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
              onClick={() => {
                setTransferringBedId(null);
                setTargetBedId("");
              }}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-500/20"
              disabled={!targetBedId}
              onClick={handleTransfer}
            >
              Confirmar Troca
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
