import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  Hospital, 
  Clock, 
  Activity, 
  Building2,
  Send,
  ArrowRightLeft,
  Truck,
  FileText,
  Plus,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Stethoscope
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface HospitalUnit {
  id: string;
  name: string;
  city: string;
  cnes: string;
  specialty: string;
  bedType: string;
  complexity: 'Média' | 'Alta';
  status: 'Disponível' | 'Indisponível' | 'Restrito';
  distance: string;
  updatedAt: string;
  phone?: string;
  resources?: {
    icuBeds: number;
    ventilators: number;
    oxygenStatus: 'Estável' | 'Crítico' | 'Alerta';
  };
}

interface TransferRequest {
  id: string;
  patientName: string;
  priority: 'Emergência' | 'Urgente' | 'Eletivo';
  targetSpecialty: string;
  currentStatus: 'Aguardando Vaga' | 'Vaga Confirmada' | 'Em Transporte' | 'Concluído';
  requestTime: string;
  destinationHospital?: string;
  notes: string;
}

const mockUnits: HospitalUnit[] = [
  {
    id: "1",
    name: "PS Central de Embu das Artes",
    city: "Embu das Artes/SP",
    cnes: "2077001",
    specialty: "Urgência e Emergência",
    bedType: "Enfermaria",
    complexity: "Média",
    status: "Disponível",
    distance: "0.2 km",
    updatedAt: "10:15",
    phone: "(11) 4785-0100",
    resources: { icuBeds: 0, ventilators: 5, oxygenStatus: 'Estável' }
  },
  {
    id: "2",
    name: "Hospital Municipal de Itapecerica da Serra",
    city: "Itapecerica da Serra/SP",
    cnes: "2077002",
    specialty: "Clínica Médica",
    bedType: "Enfermaria",
    complexity: "Média",
    status: "Disponível",
    distance: "4.8 km",
    updatedAt: "09:45",
    phone: "(11) 4668-9400",
    resources: { icuBeds: 10, ventilators: 8, oxygenStatus: 'Estável' }
  },
  {
    id: "3",
    name: "Hospital Geral de Pirajussara",
    city: "Taboão da Serra/SP",
    cnes: "2705915",
    specialty: "UTI Adulto",
    bedType: "UTI",
    complexity: "Alta",
    status: "Disponível",
    distance: "8.2 km",
    updatedAt: "10:30",
    phone: "(11) 4788-5100",
    resources: { icuBeds: 30, ventilators: 25, oxygenStatus: 'Estável' }
  },
  {
    id: "4",
    name: "PA Antena",
    city: "Taboão da Serra/SP",
    cnes: "2077004",
    specialty: "Clínica Geral",
    bedType: "Observação",
    complexity: "Média",
    status: "Disponível",
    distance: "9.5 km",
    updatedAt: "10:00",
    phone: "(11) 4138-8200",
    resources: { icuBeds: 0, ventilators: 3, oxygenStatus: 'Alerta' }
  },
  {
    id: "5",
    name: "Hospital Municipal de Campo Limpo",
    city: "São Paulo/SP",
    cnes: "2077005",
    specialty: "Cirurgia Geral",
    bedType: "Enfermaria",
    complexity: "Alta",
    status: "Restrito",
    distance: "10.1 km",
    updatedAt: "10:20",
    phone: "(11) 3394-7460",
    resources: { icuBeds: 25, ventilators: 20, oxygenStatus: 'Estável' }
  },
  {
    id: "6",
    name: "Hospital Regional de Cotia",
    city: "Cotia/SP",
    cnes: "2082217",
    specialty: "Cirurgia Geral",
    bedType: "Enfermaria",
    complexity: "Alta",
    status: "Restrito",
    distance: "11.5 km",
    updatedAt: "08:15",
    phone: "(11) 4615-1000",
    resources: { icuBeds: 15, ventilators: 12, oxygenStatus: 'Estável' }
  },
  {
    id: "7",
    name: "Hospital Municipal M'Boi Mirim",
    city: "São Paulo/SP",
    cnes: "6259461",
    specialty: "UTI Adulto",
    bedType: "UTI",
    complexity: "Alta",
    status: "Indisponível",
    distance: "13.2 km",
    updatedAt: "10:45",
    phone: "(11) 5832-2500",
    resources: { icuBeds: 40, ventilators: 35, oxygenStatus: 'Estável' }
  },
  {
    id: "8",
    name: "Hospital Municipal de Parelheiros",
    city: "São Paulo/SP",
    cnes: "2077008",
    specialty: "Clínica Médica",
    bedType: "Enfermaria",
    complexity: "Média",
    status: "Indisponível",
    distance: "15.5 km",
    updatedAt: "09:00",
    phone: "(11) 5922-3000",
    resources: { icuBeds: 20, ventilators: 15, oxygenStatus: 'Estável' }
  },
  {
    id: "9",
    name: "Hospital Geral de Itapevi",
    city: "Itapevi/SP",
    cnes: "2082268",
    specialty: "Neurologia",
    bedType: "Enfermaria",
    complexity: "Alta",
    status: "Disponível",
    distance: "17.8 km",
    updatedAt: "09:20",
    phone: "(11) 4143-9900",
    resources: { icuBeds: 18, ventilators: 15, oxygenStatus: 'Estável' }
  },
  {
    id: "10",
    name: "Santa Casa de Santo Amaro",
    city: "São Paulo/SP",
    cnes: "2077010",
    specialty: "Ortopedia",
    bedType: "Enfermaria",
    complexity: "Média",
    status: "Disponível",
    distance: "18.1 km",
    updatedAt: "10:55",
    phone: "(11) 5683-5000",
    resources: { icuBeds: 0, ventilators: 4, oxygenStatus: 'Estável' }
  },
  {
    id: "11",
    name: "Hospital Geral de Carapicuíba",
    city: "Carapicuíba/SP",
    cnes: "2705907",
    specialty: "Pediatria",
    bedType: "Enfermaria",
    complexity: "Média",
    status: "Disponível",
    distance: "19.5 km",
    updatedAt: "07:55",
    phone: "(11) 4185-7000",
    resources: { icuBeds: 8, ventilators: 6, oxygenStatus: 'Estável' }
  },
  {
    id: "12",
    name: "Hospital Regional de Osasco",
    city: "Osasco/SP",
    cnes: "2082535",
    specialty: "Cardiologia",
    bedType: "UCI Coronária",
    complexity: "Alta",
    status: "Disponível",
    distance: "21.1 km",
    updatedAt: "10:10",
    phone: "(11) 3683-3333",
    resources: { icuBeds: 22, ventilators: 18, oxygenStatus: 'Crítico' }
  },
  {
    id: "13",
    name: "Hospital Universitário USP",
    city: "São Paulo/SP",
    cnes: "2077013",
    specialty: "Clínica Médica",
    bedType: "Enfermaria",
    complexity: "Alta",
    status: "Disponível",
    distance: "22.0 km",
    updatedAt: "08:30",
    phone: "(11) 3091-9200",
    resources: { icuBeds: 12, ventilators: 10, oxygenStatus: 'Estável' }
  },
  {
    id: "14",
    name: "Hospital Municipal de Barueri",
    city: "Barueri/SP",
    cnes: "2077014",
    specialty: "Traumatologia",
    bedType: "Enfermaria",
    complexity: "Alta",
    status: "Disponível",
    distance: "23.4 km",
    updatedAt: "09:50",
    phone: "(11) 2575-3200",
    resources: { icuBeds: 15, ventilators: 12, oxygenStatus: 'Estável' }
  },
  {
    id: "15",
    name: "Hospital do Servidor Público Estadual",
    city: "São Paulo/SP",
    cnes: "2077015",
    specialty: "Multisensorial",
    bedType: "Enfermaria",
    complexity: "Alta",
    status: "Disponível",
    distance: "24.2 km",
    updatedAt: "11:00",
    phone: "(11) 4573-8000",
    resources: { icuBeds: 50, ventilators: 45, oxygenStatus: 'Estável' }
  },
  {
    id: "16",
    name: "Hospital Geral de São Mateus",
    city: "São Paulo/SP",
    cnes: "2077016",
    specialty: "Clínica Médica",
    bedType: "Enfermaria",
    complexity: "Média",
    status: "Disponível",
    distance: "25.2 km",
    updatedAt: "08:10",
    phone: "(11) 2014-5200",
    resources: { icuBeds: 10, ventilators: 8, oxygenStatus: 'Estável' }
  },
  {
    id: "17",
    name: "Hospital São Paulo (UNIFESP)",
    city: "São Paulo/SP",
    cnes: "2077017",
    specialty: "Alta Complexidade",
    bedType: "UTI",
    complexity: "Alta",
    status: "Disponível",
    distance: "25.8 km",
    updatedAt: "09:30",
    phone: "(11) 5576-4000",
    resources: { icuBeds: 60, ventilators: 55, oxygenStatus: 'Estável' }
  },
  {
    id: "18",
    name: "Hospital Geral de Pedreira",
    city: "São Paulo/SP",
    cnes: "2077018",
    specialty: "Urgência",
    bedType: "Observação",
    complexity: "Média",
    status: "Disponível",
    distance: "26.3 km",
    updatedAt: "10:05",
    phone: "(11) 5613-2000",
    resources: { icuBeds: 0, ventilators: 5, oxygenStatus: 'Estável' }
  },
  {
    id: "19",
    name: "Hospital das Clínicas - FMUSP",
    city: "São Paulo/SP",
    cnes: "2078015",
    specialty: "Alta Complexidade",
    bedType: "UTI",
    complexity: "Alta",
    status: "Disponível",
    distance: "28.4 km",
    updatedAt: "08:40",
    phone: "(11) 2661-0000",
    resources: { icuBeds: 100, ventilators: 90, oxygenStatus: 'Estável' }
  },
  {
    id: "20",
    name: "Hospital Geral de Vila Penteado",
    city: "São Paulo/SP",
    cnes: "2077020",
    specialty: "Ortopedia",
    bedType: "Enfermaria",
    complexity: "Alta",
    status: "Disponível",
    distance: "30.1 km",
    updatedAt: "09:15",
    phone: "(11) 3976-1333",
    resources: { icuBeds: 15, ventilators: 12, oxygenStatus: 'Estável' }
  }
];

const mockRequests: TransferRequest[] = [
  {
    id: "REQ-001",
    patientName: "Antônio Carlos Martins",
    priority: "Emergência",
    targetSpecialty: "Neurologia / UTI",
    currentStatus: "Aguardando Vaga",
    requestTime: "02h 15min",
    notes: "Paciente com suspeita de AVC Hemorrágico. Necessita neurocirurgia."
  },
  {
    id: "REQ-002",
    patientName: "Maria Helena Santos",
    priority: "Urgente",
    targetSpecialty: "Cardiologia",
    currentStatus: "Vaga Confirmada",
    requestTime: "04h 20min",
    destinationHospital: "Santa Casa de Misericórdia",
    notes: "Infarto agudo do miocárdio estabilizado. Necessita hemodinâmica."
  },
  {
    id: "REQ-003",
    patientName: "Juvenal Pereira",
    priority: "Urgente",
    targetSpecialty: "Ortopedia / Alta Complexidade",
    currentStatus: "Em Transporte",
    requestTime: "01h 45min",
    destinationHospital: "Hospital Regional do Vale do Paraíba",
    notes: "Politraumatizado, fratura exposta de fêmur."
  }
];

export default function SUSIntegration() {
  const [activeTab, setActiveTab] = useState("mapa");
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isGlobalCensusOpen, setIsGlobalCensusOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<HospitalUnit | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todas");
  const [statusFilter, setStatusFilter] = useState("todas");

  const filteredUnits = useMemo(() => {
    return mockUnits.filter(unit => {
      const matchesSearch = unit.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           unit.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "todas" || unit.bedType.toLowerCase().includes(filterType.toLowerCase());
      const matchesStatus = statusFilter === "todas" || unit.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, filterType, statusFilter]);

  const handleSync = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: 'Sincronizando com CROSS/SISREG...',
      success: 'Base de dados atualizada!',
      error: 'Falha na conexão.',
    });
  };

  const handleRequest = (unit: string) => {
    toast.info(`Solicitação de vaga iniciada para: ${unit}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Integração SUS — Cross Vagas</h1>
          </div>
          <p className="text-muted-foreground text-sm">SISREG · Regulação de vagas e transferências interunidades</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-bold">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Conectado
            <span className="text-muted-foreground font-normal ml-1 border-l pl-2 border-green-500/20">Última sync: 14:59:28</span>
          </div>
          <Button variant="outline" className="gap-2 h-11 px-4 rounded-xl font-bold border-border/40" onClick={handleSync}>
            <RefreshCw className="h-4 w-4" />
            Sincronizar
          </Button>

          <Dialog open={isGlobalCensusOpen} onOpenChange={setIsGlobalCensusOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="gap-2 h-11 px-4 rounded-xl font-bold bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-all">
                <AnimatePresence>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Activity className="h-4 w-4" />
                  </motion.div>
                </AnimatePresence>
                Censo Global
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
              <div className="font-sans">
                <div className="p-10 bg-muted/30 border-b relative">
                  <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                    <Building2 className="h-32 w-32" />
                  </div>
                  <Badge className="bg-primary/20 text-primary border-none text-[9px] font-black uppercase tracking-widest mb-3">Relatório Situacional Regional</Badge>
                  <h2 className="text-3xl font-black uppercase tracking-tight leading-none mb-2">Censo Hospitalar em Tempo Real</h2>
                  <p className="text-sm text-muted-foreground font-medium">Consolidado macro de recursos SUS para a Macrorregião Sudoeste.</p>
                </div>

                <div className="p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Ocupação Enfermaria</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-emerald-600">72%</span>
                        <Badge variant="outline" className="bg-emerald-500 text-white border-none text-[8px] font-bold">ESTÁVEL</Badge>
                      </div>
                      <div className="h-1.5 w-full bg-emerald-200 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '72%' }} />
                      </div>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Ocupação UTI/Críticos</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-amber-600">89%</span>
                        <Badge variant="outline" className="bg-amber-500 text-white border-none text-[8px] font-bold">ALERTA</Badge>
                      </div>
                      <div className="h-1.5 w-full bg-amber-200 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '89%' }} />
                      </div>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Leitos Isolamento</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-red-600">94%</span>
                        <Badge variant="outline" className="bg-red-500 text-white border-none text-[8px] font-bold">CRÍTICO</Badge>
                      </div>
                      <div className="h-1.5 w-full bg-red-200 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <AlertCircle className="h-3 w-3" />
                      Alertas de Rede Crítica
                    </h3>
                    <div className="space-y-3">
                      {[
                        { hospital: 'Regional de Osasco', msg: 'Estoque de Oxigênio abaixo de 15%. Transferências eletivas suspensas.', type: 'critical' },
                        { hospital: 'Mun. Parelheiros', msg: 'Surtos localizados. Leitos de isolamento zerados.', type: 'alert' },
                        { hospital: 'Pedreira', msg: 'Unidade operando em contingência por sobrecarga em Pronto Socorro.', type: 'alert' }
                      ].map((alert, i) => (
                        <div key={i} className={cn(
                          "p-4 rounded-2xl flex items-center gap-4 border",
                          alert.type === 'critical' ? "bg-red-500/5 border-red-500/20" : "bg-amber-500/5 border-amber-500/20"
                        )}>
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                            alert.type === 'critical' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                          )}>
                            {alert.type === 'critical' ? <AlertCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">{alert.hospital}</p>
                            <p className="text-xs font-medium text-muted-foreground leading-snug">{alert.msg}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-10 pt-0 flex justify-end">
                  <Button 
                    className="h-14 rounded-2xl px-10 font-black uppercase text-[11px] tracking-widest bg-primary text-white shadow-xl shadow-primary/20"
                    onClick={() => setIsGlobalCensusOpen(false)}
                  >
                    Fechar Relatório Consolidado
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all">
                <Plus className="h-4 w-4" />
                Novo Pedido de Vaga
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
              <form onSubmit={(e) => { e.preventDefault(); toast.success("Soliitação enviada com sucesso!"); setIsNewRequestOpen(false); }}>
                <DialogHeader className="p-8 bg-primary text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Send className="h-5 w-5 text-white" />
                    </div>
                    <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest">Protocolo CROSS/SISREG</Badge>
                  </div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tight mission-control-title font-sans">Nova Solicitação de Transferência</DialogTitle>
                  <DialogDescription className="text-white/70 font-medium font-sans">Inicie o processo de regulação de vaga interunidades no sistema SUS.</DialogDescription>
                </DialogHeader>
                
                <div className="p-8 space-y-6 max-h-[50vh] overflow-y-auto font-sans">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Paciente</Label>
                      <Input placeholder="Nome completo" className="h-12 rounded-xl border-border/50" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prioridade</Label>
                      <Select defaultValue="urgente">
                        <SelectTrigger className="h-12 rounded-xl border-border/50">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="eletivo">Eletivo</SelectItem>
                          <SelectItem value="urgente">Urgente</SelectItem>
                          <SelectItem value="emergencia">Emergência (P0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Especialidade Destino</Label>
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl border-border/50">
                          <SelectValue placeholder="Selecione o tipo..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="uti-adulto">UTI Adulto</SelectItem>
                          <SelectItem value="uti-pode">UTI Pediátrica</SelectItem>
                          <SelectItem value="clinica">Clínica Médica</SelectItem>
                          <SelectItem value="cardio">Cardiologia</SelectItem>
                          <SelectItem value="neuro">Neurocirurgia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tipo de Leito</Label>
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl border-border/50">
                          <SelectValue placeholder="Selecione o leito..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="enf">Enfermaria</SelectItem>
                          <SelectItem value="uti">UTI</SelectItem>
                          <SelectItem value="uci">UCI</SelectItem>
                          <SelectItem value="isolamento">Isolamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Justificativa Clínica e Observações</Label>
                    <textarea 
                      className="w-full min-h-[100px] rounded-2xl border border-border/50 bg-background p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Detalhes sobre o quadro clínico, exames realizados e necessidade da transferência..."
                    />
                  </div>
                </div>

                <DialogFooter className="p-8 pt-0 flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsNewRequestOpen(false)} className="rounded-xl h-12 font-bold flex-1">Cancelar</Button>
                  <Button type="submit" className="rounded-xl h-12 font-black uppercase text-[11px] tracking-widest flex-1 bg-primary text-white shadow-lg shadow-primary/20">Enviar para Regulação</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="glass-card cursor-pointer hover:shadow-lg hover:border-green-500/40 transition-all group scale-100 hover:scale-[1.02] active:scale-95 duration-200"
          onClick={() => {
            setActiveTab("mapa");
            setFilterType("todas");
            setStatusFilter("Disponível");
            setSearchTerm("");
            toast.success("Filtrando: Leitos Disponíveis");
          }}
        >
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <Hospital className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-green-600 transition-colors">Vagas Disponíveis</p>
              <h3 className="text-2xl font-black text-green-600">{mockUnits.filter(u => u.status === 'Disponível').length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="glass-card cursor-pointer hover:shadow-lg hover:border-yellow-500/40 transition-all group scale-100 hover:scale-[1.02] active:scale-95 duration-200"
          onClick={() => {
            setActiveTab("mapa");
            setFilterType("todas");
            setStatusFilter("Restrito");
            setSearchTerm("");
            toast.info("Filtrando: Vagas com Reserva/Restrição");
          }}
        >
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-yellow-600 transition-colors">Vagas Reservadas</p>
              <h3 className="text-2xl font-black text-yellow-600">{mockUnits.filter(u => u.status === 'Restrito').length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="glass-card cursor-pointer hover:shadow-lg hover:border-red-500/40 transition-all group scale-100 hover:scale-[1.02] active:scale-95 duration-200"
          onClick={() => {
            setActiveTab("solicitacoes");
            toast.warning("Fila de espera para regulação aberta");
          }}
        >
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <ShieldCheck className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-red-600 transition-colors">Solicitações Pendentes</p>
              <h3 className="text-2xl font-black text-red-600">{mockRequests.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="glass-card cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all group scale-100 hover:scale-[1.02] active:scale-95 duration-200"
          onClick={() => {
            setActiveTab("rede");
            toast.info("Painel de rede regional acessado");
          }}
        >
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Transferidos Hoje</p>
              <h3 className="text-2xl font-black text-primary">7</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/50 p-1 w-fit mb-4">
          <TabsTrigger value="mapa" className="px-6 py-2 text-xs font-bold uppercase tracking-wider">Mapa de Vagas</TabsTrigger>
          <TabsTrigger value="solicitacoes" className="px-6 py-2 text-xs font-bold uppercase tracking-wider">Solicitações</TabsTrigger>
          <TabsTrigger value="rede" className="px-6 py-2 text-xs font-bold uppercase tracking-wider">Rede Assistencial</TabsTrigger>
        </TabsList>

        <TabsContent value="mapa" className="space-y-6">
          <Card className="glass-card border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 border-b bg-muted/20 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar unidade ou cidade..." 
                    className="pl-10 h-10 border-muted" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select defaultValue="todas" onValueChange={setFilterType}>
                  <SelectTrigger className="h-10 w-[180px]">
                    <SelectValue placeholder="Tipo Leito" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas...</SelectItem>
                    <SelectItem value="Enfermaria">Enfermaria</SelectItem>
                    <SelectItem value="UTI">UTI</SelectItem>
                    <SelectItem value="UCI">UCI Coronária</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos Status</SelectItem>
                    <SelectItem value="Disponível">Disponível</SelectItem>
                    <SelectItem value="Restrito">Restrito</SelectItem>
                    <SelectItem value="Indisponível">Indisponível</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="todas">
                  <SelectTrigger className="h-10 w-[150px]">
                    <SelectValue placeholder="Disponível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Disponível</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/30 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Unidade</th>
                      <th className="px-6 py-4">Especialidade</th>
                      <th className="px-6 py-4">Tipo Leito</th>
                      <th className="px-6 py-4 text-center">Complexidade</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Distância</th>
                      <th className="px-6 py-4">Atualização</th>
                      <th className="px-6 py-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <AnimatePresence mode="popLayout">
                      {filteredUnits.length > 0 ? (
                        filteredUnits.map((unit) => (
                          <motion.tr 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={unit.id} 
                            className="hover:bg-muted/20 transition-all group cursor-pointer"
                            onClick={() => setSelectedUnit(unit)}
                          >
                            <td className="px-6 py-5">
                              <div className="flex flex-col text-left">
                                <span className="font-bold text-sm leading-tight text-foreground/90 group-hover:text-primary transition-colors">{unit.name}</span>
                                <span className="text-[10px] text-muted-foreground mt-1">
                                  {unit.city} <span className="opacity-30 ml-1 mr-1">|</span> CNES: {unit.cnes}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-left">
                              <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-primary uppercase">{unit.specialty.split(' ')[0]}</span>
                                <span className="text-[11px] text-muted-foreground">{unit.specialty.split(' ').slice(1).join(' ')}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-xs font-medium text-muted-foreground">{unit.bedType}</td>
                            <td className="px-6 py-5 text-center">
                              <Badge variant="outline" className={unit.complexity === 'Alta' ? 'bg-red-500 text-white border-0' : 'bg-muted text-muted-foreground'}>
                                {unit.complexity}
                              </Badge>
                            </td>
                            <td className="px-6 py-5">
                              <Badge className={cn(
                                "border-0 text-[10px] uppercase font-black",
                                unit.status === 'Disponível' ? "bg-green-500/10 text-green-600" :
                                unit.status === 'Restrito' ? "bg-amber-500/10 text-amber-600" :
                                "bg-red-500/10 text-red-600"
                              )}>
                                {unit.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 opacity-50" />
                                {unit.distance}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-xs text-muted-foreground">{unit.updatedAt}</td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                                  onClick={(e) => { e.stopPropagation(); setSelectedUnit(unit); }}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="gap-2 h-9 px-4 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm" 
                                  onClick={(e) => { e.stopPropagation(); handleRequest(unit.name); }}
                                >
                                  <Send className="h-3 w-3" />
                                  Solicitar
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-20 text-center text-muted-foreground text-sm font-medium italic">
                            Nenhum leito encontrado para os filtros selecionados.
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Unit Details Dialog */}
          <Dialog open={!!selectedUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
              {selectedUnit && (
                <div className="font-sans">
                  <div className="p-8 bg-muted/30 border-b">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Hospital className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest mb-1">Unidade Federada</Badge>
                        <h2 className="text-xl font-black uppercase tracking-tight leading-none">{selectedUnit.name}</h2>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">{selectedUnit.city} • CNES {selectedUnit.cnes}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-12 rounded-xl font-bold gap-2 text-xs" onClick={() => toast.info("Localização enviada para o GPS do sistema.")}>
                        <MapPin className="h-4 w-4 text-primary" />
                        Ver no Mapa
                      </Button>
                      <Button variant="outline" className="h-12 rounded-xl font-bold gap-2 text-xs" onClick={() => window.location.href = `tel:${selectedUnit.phone}`}>
                        <Clock className="h-4 w-4 text-primary" />
                        Ligar para Unidade
                      </Button>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Capacidade e Recursos</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Leitos UTI</p>
                          <span className="text-xl font-black">{selectedUnit.resources?.icuBeds ?? 'N/A'}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Respiradores</p>
                          <span className="text-xl font-black">{selectedUnit.resources?.ventilators ?? 'N/A'}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Oxigênio</p>
                          <Badge variant="outline" className={cn(
                            "mt-1 text-[8px] font-black uppercase border-none",
                            selectedUnit.resources?.oxygenStatus === 'Estável' ? "bg-emerald-500 text-white" : 
                            selectedUnit.resources?.oxygenStatus === 'Alerta' ? "bg-amber-500 text-white" : "bg-red-500 text-white"
                          )}>
                            {selectedUnit.resources?.oxygenStatus ?? 'S/ INFO'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-border/50 bg-primary/5">
                        <Truck className="h-5 w-5 text-primary opacity-50" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Estimativa de Transporte</p>
                          <p className="text-xs font-medium text-muted-foreground">Tempo estimado de remoção: <span className="font-bold text-foreground">~{Math.round(parseFloat(selectedUnit.distance) * 2.5 + 10)} min</span></p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                         <div className="flex items-center gap-2 mb-2">
                           <AlertCircle className="h-4 w-4 text-amber-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Observações de Regulação</span>
                         </div>
                         <p className="text-xs text-amber-700/80 leading-relaxed font-medium">
                           Esta unidade está operando em regime de {selectedUnit.complexity === 'Alta' ? 'Prioridade Máxima' : 'Fluxo Contínuo'}. 
                           Solicitações devem incluir termo de responsabilidade de transporte.
                         </p>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="p-8 pt-0">
                    <Button 
                      className="w-full h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest bg-primary text-white shadow-xl shadow-primary/20"
                      onClick={() => handleRequest(selectedUnit.name)}
                    >
                      Processar Vaga para Unidade
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="solicitacoes" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {mockRequests.map((req) => (
              <Card key={req.id} className="glass-card overflow-hidden group hover:shadow-lg transition-all border-none">
                <CardContent className="p-0">
                  <div className={cn(
                    "w-full h-1.5",
                    req.priority === 'Emergência' ? "bg-red-500" : 
                    req.priority === 'Urgente' ? "bg-amber-500" : "bg-blue-500"
                  )} />
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                      <div className="flex gap-4">
                        <div className={cn(
                          "h-12 w-12 rounded-2xl flex items-center justify-center",
                          req.currentStatus === 'Aguardando Vaga' ? "bg-muted text-muted-foreground" :
                          req.currentStatus === 'Concluído' ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                        )}>
                          {req.currentStatus === 'Em Transporte' ? <Truck className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-black uppercase tracking-tight text-lg leading-none">{req.patientName}</h4>
                            <Badge className={cn(
                              "text-[9px] font-black uppercase tracking-widest px-2",
                              req.priority === 'Emergência' ? "bg-red-500" : "bg-amber-500"
                            )}>
                              {req.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">{req.id} • {req.targetSpecialty}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <Badge className="bg-muted text-muted-foreground border-none font-black text-[9px] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {req.requestTime} em espera
                        </Badge>
                        <div className="flex items-center gap-3">
                           <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-xs font-bold gap-2">
                             <Activity className="h-3.5 w-3.5" />
                             Checklist
                           </Button>
                           <Button size="sm" className="h-8 px-4 rounded-lg text-xs font-black uppercase tracking-widest gap-2 bg-muted text-muted-foreground hover:bg-muted/80">
                             Detalhes
                           </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="md:col-span-3">
                        <div className="relative h-20 flex items-center justify-between px-4">
                           {/* Status line Background */}
                           <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-muted/50 z-0" />
                           
                           {/* Steps */}
                           {[
                             { label: 'Aguardando Vaga', icon: Clock, status: 'active' },
                             { label: 'Vaga Confirmada', icon: CheckCircle2, status: req.currentStatus !== 'Aguardando Vaga' ? 'active' : 'pending' },
                             { label: 'Em Transporte', icon: Truck, status: (req.currentStatus === 'Em Transporte' || req.currentStatus === 'Concluído') ? 'active' : 'pending' },
                             { label: 'Concluído', icon: ShieldCheck, status: req.currentStatus === 'Concluído' ? 'active' : 'pending' }
                           ].map((step, idx) => (
                             <div key={idx} className="relative z-10 flex flex-col items-center">
                               <div className={cn(
                                 "h-10 w-10 rounded-full flex items-center justify-center border-4 border-background transition-all",
                                 step.status === 'active' ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                               )}>
                                 <step.icon className="h-4 w-4" />
                               </div>
                               <span className={cn(
                                 "absolute -bottom-6 text-[8px] font-black uppercase tracking-widest whitespace-nowrap",
                                 step.status === 'active' ? "text-primary" : "text-muted-foreground"
                               )}>
                                 {step.label}
                               </span>
                             </div>
                           ))}
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-2xl flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                           <Hospital className="h-4 w-4 text-muted-foreground opacity-50" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Destino</span>
                        </div>
                        <p className="text-[11px] font-bold leading-tight">
                          {req.destinationHospital || "Aguardando definição da central..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="rede">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-all">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black uppercase tracking-tight">Macro Sudeste Grande SP</CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest">DRS I - Sudoeste</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                 <div className="space-y-3">
                   {[
                     { label: 'Hospitais Terciários', val: '12' },
                     { label: 'Unidades de Pronto Atendimento', val: '45' },
                     { label: 'Centrais de Regulação', val: '02' },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-border/50 pb-2">
                       <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                       <span className="text-xs font-black">{item.val}</span>
                     </div>
                   ))}
                 </div>
                 <Button variant="outline" className="w-full h-10 rounded-xl font-black uppercase text-[9px] tracking-widest">
                   Consultar Catálogo CNES
                 </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-all">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black uppercase tracking-tight">Protocolos CROSS</CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Procedimentos Operacionais</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                 <div className="space-y-3">
                   {[
                     { label: 'Urgência Traumática', type: 'PDF' },
                     { label: 'Transferência Neonatal', type: 'DOCX' },
                     { label: 'Fluxo COVID-19/SRAG', type: 'PDF' },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center bg-muted/20 p-2 rounded-lg border border-border/30">
                       <span className="text-[11px] font-bold text-foreground/80">{item.label}</span>
                       <Badge variant="secondary" className="text-[8px] font-black">{item.type}</Badge>
                     </div>
                   ))}
                 </div>
                 <Button className="w-full h-10 rounded-xl font-black uppercase text-[9px] tracking-widest bg-primary text-white">
                   Acessar Intranet
                 </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-none shadow-sm overflow-hidden bg-background border border-border/40 hover:shadow-md transition-all md:col-span-1 lg:col-span-1 group">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black uppercase tracking-tight">Performance de Rede</CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Monitoramento Regional</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-8 pt-0 flex flex-col justify-between">
                <p className="text-muted-foreground text-[10px] leading-snug font-medium mb-6">Indicadores de pressão assistencial na macrorregião sudoeste.</p>
                
                <div className="space-y-6">
                   {[
                     { label: 'Taxa de Ocupação UTI', val: 88, suffix: '%', target: 'Meta: <85%', color: 'red', desc: 'Saturação alta' },
                     { label: 'Tempo Médio de Espera', val: 72, suffix: '%', target: 'Meta: <24h', color: 'emerald', desc: 'Fluxo estável' },
                   ].map((metric, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{metric.label}</p>
                            <p className="text-[9px] font-bold text-primary/60">{metric.target}</p>
                          </div>
                          <div className="text-right">
                             <span className={cn("text-xl font-black italic", `text-${metric.color}-600 dark:text-${metric.color}-400`)}>
                               {metric.val}{metric.suffix}
                             </span>
                             <p className="text-[8px] font-black uppercase text-muted-foreground/50">{metric.desc}</p>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${metric.val}%` }}
                             transition={{ duration: 1, delay: i * 0.2 }}
                             className={cn("h-full", `bg-${metric.color}-500`)} 
                           />
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-8 pt-6 border-t border-dashed border-border/50">
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                     <span>Tendência (24h)</span>
                     <span className="text-red-500 flex items-center gap-1">
                        +12% <Clock className="h-2.5 w-2.5" />
                     </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
