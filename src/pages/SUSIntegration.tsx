import { useState, useMemo } from "react";
import { usePatientsContext } from "@/context/PatientsContext";
import { useBeds } from "@/context/BedsContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Truck,
  FileText,
  Plus,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Wifi,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  PhoneCall,
  Zap,
  BarChart3,
  Globe,
  Radio,
  Navigation,
  ChevronRight,
  Timer,
  Users,
  Heart,
  AlertTriangle,
  X,
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
  complexity: "Média" | "Alta";
  status: "Disponível" | "Indisponível" | "Restrito";
  distance: string;
  updatedAt: string;
  phone?: string;
  occupancy?: number;
  resources?: {
    icuBeds: number;
    ventilators: number;
    oxygenStatus: "Estável" | "Crítico" | "Alerta";
  };
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
    occupancy: 68,
    resources: { icuBeds: 0, ventilators: 5, oxygenStatus: "Estável" },
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
    occupancy: 72,
    resources: { icuBeds: 10, ventilators: 8, oxygenStatus: "Estável" },
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
    occupancy: 81,
    resources: { icuBeds: 30, ventilators: 25, oxygenStatus: "Estável" },
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
    occupancy: 55,
    resources: { icuBeds: 0, ventilators: 3, oxygenStatus: "Alerta" },
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
    occupancy: 89,
    resources: { icuBeds: 25, ventilators: 20, oxygenStatus: "Estável" },
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
    occupancy: 91,
    resources: { icuBeds: 15, ventilators: 12, oxygenStatus: "Estável" },
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
    occupancy: 98,
    resources: { icuBeds: 40, ventilators: 35, oxygenStatus: "Estável" },
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
    occupancy: 97,
    resources: { icuBeds: 20, ventilators: 15, oxygenStatus: "Estável" },
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
    occupancy: 74,
    resources: { icuBeds: 18, ventilators: 15, oxygenStatus: "Estável" },
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
    occupancy: 60,
    resources: { icuBeds: 0, ventilators: 4, oxygenStatus: "Estável" },
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
    occupancy: 66,
    resources: { icuBeds: 8, ventilators: 6, oxygenStatus: "Estável" },
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
    occupancy: 85,
    resources: { icuBeds: 22, ventilators: 18, oxygenStatus: "Crítico" },
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
    occupancy: 77,
    resources: { icuBeds: 12, ventilators: 10, oxygenStatus: "Estável" },
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
    occupancy: 70,
    resources: { icuBeds: 15, ventilators: 12, oxygenStatus: "Estável" },
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
    occupancy: 58,
    resources: { icuBeds: 50, ventilators: 45, oxygenStatus: "Estável" },
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
    occupancy: 63,
    resources: { icuBeds: 10, ventilators: 8, oxygenStatus: "Estável" },
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
    occupancy: 82,
    resources: { icuBeds: 60, ventilators: 55, oxygenStatus: "Estável" },
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
    occupancy: 75,
    resources: { icuBeds: 0, ventilators: 5, oxygenStatus: "Estável" },
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
    occupancy: 88,
    resources: { icuBeds: 100, ventilators: 90, oxygenStatus: "Estável" },
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
    occupancy: 71,
    resources: { icuBeds: 15, ventilators: 12, oxygenStatus: "Estável" },
  },
];

// Micro OccupancyBar component
function OccupancyBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const color =
    value >= 90
      ? "bg-red-500"
      : value >= 80
        ? "bg-amber-500"
        : "bg-emerald-500";
  return (
    <div
      className={cn(
        "h-1.5 w-full bg-muted rounded-full overflow-hidden",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all", color)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function SUSIntegration() {
  const { patients, updatePatient, requestTransfer } = usePatientsContext();
  const { beds, releaseBed } = useBeds();

  const [activeTab, setActiveTab] = useState("mapa");
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isGlobalCensusOpen, setIsGlobalCensusOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<HospitalUnit | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todas");
  const [statusFilter, setStatusFilter] = useState("todas");

  // Form states
  const [formPatientId, setFormPatientId] = useState("");
  const [formPriority, setFormPriority] = useState<
    "normal" | "urgent" | "emergency"
  >("urgent");
  const [formSpecialty, setFormSpecialty] = useState("uti-adulto");
  const [formReason, setFormReason] = useState("");

  // Vacancy Confirmation states
  const [confirmingReq, setConfirmingReq] = useState<any | null>(null);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [crossCodeInput, setCrossCodeInput] = useState("");
  const [selectedAmbulance, setSelectedAmbulance] = useState(
    "USB - Suporte Básico",
  );

  // Real requests from patient context
  const realRequests = useMemo(() => {
    return patients
      .filter((p) => p.transferRequest !== undefined)
      .map((p) => {
        const req = p.transferRequest!;
        let priorityLabel: "Emergência" | "Urgente" | "Eletivo" = "Urgente";
        if (req.priority === "emergency") priorityLabel = "Emergência";
        else if (req.priority === "urgent") priorityLabel = "Urgente";
        else priorityLabel = "Eletivo";

        let statusLabel:
          | "Aguardando Vaga"
          | "Vaga Confirmada"
          | "Em Transporte"
          | "Concluído" = "Aguardando Vaga";
        if (req.status === "requested") statusLabel = "Aguardando Vaga";
        else if (req.status === "accepted") statusLabel = "Vaga Confirmada";
        else if (req.status === "transporting") statusLabel = "Em Transporte";
        else if (req.status === "completed") statusLabel = "Concluído";

        const diffMs = Date.now() - new Date(req.requestedAt).getTime();
        const diffMins = Math.max(1, Math.floor(diffMs / 60000));
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        const requestTimeStr =
          hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;

        return {
          id: `REQ-${p.ticket || p.id.slice(0, 4).toUpperCase()}`,
          patientId: p.id,
          patientName: p.name,
          priority: priorityLabel,
          targetSpecialty: req.reason,
          currentStatus: statusLabel,
          requestTime: requestTimeStr,
          destinationHospital: req.hospitalName,
          notes: req.reason,
          rawRequest: req,
          patientObj: p,
        };
      });
  }, [patients]);

  const pendingRequestsCount = realRequests.filter(
    (r) => r.currentStatus !== "Concluído",
  ).length;
  const completedRequestsCount = realRequests.filter(
    (r) => r.currentStatus === "Concluído",
  ).length;

  const eligiblePatients = useMemo(() => {
    return patients.filter(
      (p) => p.transferRequest === undefined && p.status !== "completed",
    );
  }, [patients]);

  const specialtyLabels: Record<string, string> = {
    "uti-adulto": "UTI Adulto",
    "uti-ped": "UTI Pediátrica",
    clinica: "Clínica Médica",
    cardio: "Cardiologia",
    neuro: "Neurocirurgia",
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatientId) {
      toast.error("Por favor, selecione um paciente.");
      return;
    }
    const specLabel = specialtyLabels[formSpecialty] || formSpecialty;
    const reasonText = formReason ? `${specLabel} - ${formReason}` : specLabel;
    requestTransfer(formPatientId, formPriority, reasonText);
    setFormPatientId("");
    setFormReason("");
    setIsNewRequestOpen(false);
  };

  const filteredUnits = useMemo(() => {
    return mockUnits.filter((unit) => {
      const matchesSearch =
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "todas" ||
        unit.bedType.toLowerCase().includes(filterType.toLowerCase());
      const matchesStatus =
        statusFilter === "todas" || unit.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, filterType, statusFilter]);

  const handleSync = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: "Sincronizando com CROSS/SISREG...",
      success: "Base de dados atualizada!",
      error: "Falha na conexão.",
    });
  };

  const handleRequest = (unit: string) => {
    toast.info(`Solicitação de vaga iniciada para: ${unit}`);
  };

  const availableCount = mockUnits.filter(
    (u) => u.status === "Disponível",
  ).length;
  const restrictedCount = mockUnits.filter(
    (u) => u.status === "Restrito",
  ).length;
  const unavailableCount = mockUnits.filter(
    (u) => u.status === "Indisponível",
  ).length;

  const statusConfig: Record<
    string,
    { color: string; bg: string; dot: string }
  > = {
    "Aguardando Vaga": {
      color: "text-amber-600",
      bg: "bg-amber-500/10 border-amber-500/20",
      dot: "bg-amber-500",
    },
    "Vaga Confirmada": {
      color: "text-emerald-600",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      dot: "bg-emerald-500",
    },
    "Em Transporte": {
      color: "text-blue-600",
      bg: "bg-blue-500/10 border-blue-500/20",
      dot: "bg-blue-500",
    },
    Concluído: {
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
      dot: "bg-primary",
    },
  };

  const priorityConfig: Record<
    string,
    { color: string; bg: string; border: string }
  > = {
    Emergência: {
      color: "text-red-600",
      bg: "bg-red-500",
      border: "border-l-red-500",
    },
    Urgente: {
      color: "text-amber-600",
      bg: "bg-amber-500",
      border: "border-l-amber-500",
    },
    Eletivo: {
      color: "text-blue-600",
      bg: "bg-blue-500",
      border: "border-l-blue-500",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* ── Header Strip ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <Radio className="h-4 w-4 text-primary animate-pulse" />
            <h1 className="text-xl font-black tracking-tight uppercase">
              Integração SUS — Cross Vagas
            </h1>
            {pendingRequestsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-[9px] font-black uppercase tracking-wider text-red-500 animate-pulse">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
                {pendingRequestsCount} Pendente
                {pendingRequestsCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            SISREG · Regulação de vagas e transferências interunidades
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[9px] font-bold border border-emerald-500/20">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            CROSS Online
            <span className="text-muted-foreground font-normal ml-1 border-l pl-2 border-emerald-500/20">
              14:59:28
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-9 px-3 rounded-xl font-bold text-xs border-border/40"
            onClick={handleSync}
          >
            <RefreshCw className="h-3.5 w-3.5" /> Sincronizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-9 px-3 rounded-xl font-bold text-xs bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/25"
            onClick={() => setIsGlobalCensusOpen(true)}
          >
            <BarChart3 className="h-3.5 w-3.5" /> Censo Global
          </Button>
          <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="gap-1.5 h-9 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
              >
                <Plus className="h-3.5 w-3.5" /> Nova Solicitação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px] rounded-[2rem] p-0 overflow-hidden border-white/30 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
              <form onSubmit={handleCreateRequest}>
                <DialogHeader className="p-8 bg-primary text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Send className="h-5 w-5 text-white" />
                    </div>
                    <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest">
                      Protocolo CROSS/SISREG
                    </Badge>
                  </div>
                  <DialogTitle className="text-xl font-black uppercase tracking-tight">
                    Nova Solicitação de Transferência
                  </DialogTitle>
                  <DialogDescription className="text-white/70 font-medium text-sm">
                    Inicie o processo de regulação de vaga interunidades no
                    sistema SUS.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-5 max-h-[50vh] overflow-y-auto text-left">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Paciente
                    </Label>
                    <Select
                      value={formPatientId}
                      onValueChange={setFormPatientId}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Selecione o paciente..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {eligiblePatients.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} ({p.ticket || "Sem Ticket"}) —{" "}
                            {p.sector || "Sem Setor"}
                          </SelectItem>
                        ))}
                        {eligiblePatients.length === 0 && (
                          <div className="p-4 text-center text-xs text-muted-foreground italic">
                            Nenhum paciente elegível.
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Prioridade
                      </Label>
                      <Select
                        value={formPriority}
                        onValueChange={(val: any) => setFormPriority(val)}
                      >
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="normal">
                            Eletivo / Normal
                          </SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                          <SelectItem value="emergency">
                            Emergência (P0)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Especialidade Destino
                      </Label>
                      <Select
                        value={formSpecialty}
                        onValueChange={setFormSpecialty}
                      >
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="uti-adulto">UTI Adulto</SelectItem>
                          <SelectItem value="uti-ped">
                            UTI Pediátrica
                          </SelectItem>
                          <SelectItem value="clinica">
                            Clínica Médica
                          </SelectItem>
                          <SelectItem value="cardio">Cardiologia</SelectItem>
                          <SelectItem value="neuro">Neurocirurgia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Justificativa Clínica
                    </Label>
                    <textarea
                      value={formReason}
                      onChange={(e) => setFormReason(e.target.value)}
                      className="w-full min-h-[90px] rounded-xl border border-border/50 bg-muted/20 p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground resize-none"
                      placeholder="Quadro clínico, exames e necessidade da transferência..."
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="p-8 pt-0 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsNewRequestOpen(false)}
                    className="rounded-xl h-11 font-bold flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl h-11 font-black uppercase text-[10px] tracking-widest flex-1 bg-primary text-white shadow-lg shadow-primary/20"
                    disabled={!formPatientId}
                  >
                    Enviar para Regulação
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Vagas Disponíveis",
            value: availableCount,
            icon: Hospital,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            sub: "Unidades com capacidade",
            onClick: () => {
              setActiveTab("mapa");
              setStatusFilter("Disponível");
            },
          },
          {
            label: "Acesso Restrito",
            value: restrictedCount,
            icon: AlertTriangle,
            color: "text-amber-600",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            sub: "Com restrições de acesso",
            onClick: () => {
              setActiveTab("mapa");
              setStatusFilter("Restrito");
            },
          },
          {
            label: "Regulações Ativas",
            value: pendingRequestsCount,
            icon: ShieldCheck,
            color: "text-red-600",
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            sub: "Aguardando resolução",
            onClick: () => setActiveTab("solicitacoes"),
          },
          {
            label: "Transferidos Hoje",
            value: completedRequestsCount,
            icon: CheckCircle2,
            color: "text-primary",
            bg: "bg-primary/10",
            border: "border-primary/20",
            sub: "Concluídos com sucesso",
            onClick: () => setActiveTab("solicitacoes"),
          },
        ].map((kpi, i) => (
          <motion.button
            key={i}
            onClick={kpi.onClick}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "glass-card-premium rounded-2xl p-4 text-left border transition-all hover:shadow-lg cursor-pointer w-full",
              kpi.border,
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center",
                  kpi.bg,
                )}
              >
                <kpi.icon className={cn("h-4 w-4", kpi.color)} />
              </div>
              <span
                className={cn("text-2xl font-black tabular-nums", kpi.color)}
              >
                {kpi.value}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/80 leading-none mb-0.5">
              {kpi.label}
            </p>
            <p className="text-[9px] text-muted-foreground font-medium">
              {kpi.sub}
            </p>
          </motion.button>
        ))}
      </div>

      {/* ── Main Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass-card-premium p-1 h-11 rounded-xl border border-white/30 dark:border-white/10 w-fit mb-4">
          <TabsTrigger
            value="mapa"
            className="px-5 py-1.5 text-[11px] font-bold uppercase tracking-wider"
          >
            <Globe className="h-3.5 w-3.5 mr-1.5" /> Mapa de Vagas
          </TabsTrigger>
          <TabsTrigger
            value="solicitacoes"
            className="px-5 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Regulações (
            {pendingRequestsCount})
            {pendingRequestsCount > 0 && (
              <span className="relative flex h-1.5 w-1.5 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="rede"
            className="px-5 py-1.5 text-[11px] font-bold uppercase tracking-wider"
          >
            <Building2 className="h-3.5 w-3.5 mr-1.5" /> Rede Assistencial
          </TabsTrigger>
        </TabsList>

        {/* ── TAB: Mapa de Vagas ── */}
        <TabsContent value="mapa" className="space-y-3">
          {/* Filter bar */}
          <div className="glass-card-premium rounded-2xl border border-white/30 dark:border-white/10 p-3 flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar unidade ou cidade..."
                className="pl-9 h-9 text-sm rounded-xl border-muted"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="todas" onValueChange={setFilterType}>
              <SelectTrigger className="h-9 w-[150px] text-xs rounded-xl">
                <SelectValue placeholder="Tipo de Leito" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="todas">Todos os Tipos</SelectItem>
                <SelectItem value="Enfermaria">Enfermaria</SelectItem>
                <SelectItem value="UTI">UTI</SelectItem>
                <SelectItem value="UCI">UCI Coronária</SelectItem>
                <SelectItem value="Observação">Observação</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[140px] text-xs rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="todas">Todos Status</SelectItem>
                <SelectItem value="Disponível">Disponível</SelectItem>
                <SelectItem value="Restrito">Restrito</SelectItem>
                <SelectItem value="Indisponível">Indisponível</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 ml-auto text-[10px] font-bold text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>{" "}
                {availableCount} Disp.
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>{" "}
                {restrictedCount} Rest.
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>{" "}
                {unavailableCount} Indisp.
              </span>
            </div>
          </div>

          {/* Units list — compact rows */}
          <div className="glass-card-premium rounded-2xl border border-white/30 dark:border-white/10 overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_80px_100px_90px_auto] text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-muted/30 px-4 py-3 border-b border-border/30">
              <span>Unidade / Cidade</span>
              <span>Especialidade</span>
              <span>Leito</span>
              <span className="text-center">Ocup.</span>
              <span>Status</span>
              <span>Distância</span>
              <span className="text-right">Ação</span>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredUnits.length > 0 ? (
                filteredUnits.map((unit, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    key={unit.id}
                    transition={{ delay: idx * 0.02 }}
                    className="grid grid-cols-[2fr_1fr_1fr_80px_100px_90px_auto] items-center px-4 py-2.5 border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors group cursor-pointer"
                    onClick={() => setSelectedUnit(unit)}
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-[12px] leading-tight text-foreground/90 group-hover:text-primary transition-colors truncate pr-2">
                        {unit.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {unit.city} · CNES {unit.cnes}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase leading-tight">
                        {unit.specialty.split("/")[0].trim()}
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {unit.bedType}
                    </p>
                    <div className="text-center">
                      <span
                        className={cn(
                          "text-xs font-black tabular-nums",
                          (unit.occupancy ?? 0) >= 90
                            ? "text-red-600"
                            : (unit.occupancy ?? 0) >= 80
                              ? "text-amber-600"
                              : "text-emerald-600",
                        )}
                      >
                        {unit.occupancy ?? "—"}%
                      </span>
                      <OccupancyBar
                        value={unit.occupancy ?? 0}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide",
                          unit.status === "Disponível"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : unit.status === "Restrito"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-red-500/10 text-red-600",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            unit.status === "Disponível"
                              ? "bg-emerald-500"
                              : unit.status === "Restrito"
                                ? "bg-amber-500"
                                : "bg-red-500",
                          )}
                        />
                        {unit.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Navigation className="h-2.5 w-2.5 opacity-40" />
                      {unit.distance}
                    </div>
                    <div
                      className="flex items-center gap-1 justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg hover:text-primary hover:bg-primary/10"
                        onClick={() => setSelectedUnit(unit)}
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2.5 rounded-lg text-[10px] font-bold gap-1 hover:bg-primary hover:text-white transition-all"
                        onClick={() => handleRequest(unit.name)}
                      >
                        <Send className="h-3 w-3" /> Solicitar
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-16 text-center text-muted-foreground text-sm font-medium italic">
                  Nenhum leito encontrado para os filtros selecionados.
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Unit Details Dialog */}
          <Dialog
            open={!!selectedUnit}
            onOpenChange={(open) => !open && setSelectedUnit(null)}
          >
            <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-0 overflow-hidden border-white/30 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
              {selectedUnit && (
                <div>
                  <div className="p-7 bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border/30">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Hospital className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest mb-1.5">
                          Unidade Federada
                        </Badge>
                        <h2 className="text-lg font-black uppercase tracking-tight leading-tight">
                          {selectedUnit.name}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {selectedUnit.city} · CNES {selectedUnit.cnes}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-7 space-y-5">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        {
                          label: "Leitos UTI",
                          val: selectedUnit.resources?.icuBeds ?? "—",
                        },
                        {
                          label: "Resp.",
                          val: selectedUnit.resources?.ventilators ?? "—",
                        },
                        {
                          label: "O₂",
                          val: selectedUnit.resources?.oxygenStatus ?? "—",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="bg-muted/20 rounded-xl p-3 border border-border/30"
                        >
                          <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                            {item.label}
                          </p>
                          <span
                            className={cn(
                              "text-sm font-black",
                              item.label === "O₂" &&
                                selectedUnit.resources?.oxygenStatus ===
                                  "Crítico"
                                ? "text-red-600"
                                : item.label === "O₂" &&
                                    selectedUnit.resources?.oxygenStatus ===
                                      "Alerta"
                                  ? "text-amber-600"
                                  : "",
                            )}
                          >
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Ocupação Atual
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-2xl font-black",
                            (selectedUnit.occupancy ?? 0) >= 90
                              ? "text-red-600"
                              : (selectedUnit.occupancy ?? 0) >= 80
                                ? "text-amber-600"
                                : "text-emerald-600",
                          )}
                        >
                          {selectedUnit.occupancy ?? "—"}%
                        </span>
                        <OccupancyBar
                          value={selectedUnit.occupancy ?? 0}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30">
                      <Truck className="h-4 w-4 text-primary opacity-50 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          Tempo Estimado de Remoção
                        </p>
                        <p className="text-sm font-bold">
                          ~
                          {Math.round(
                            parseFloat(selectedUnit.distance) * 2.5 + 10,
                          )}{" "}
                          min · {selectedUnit.distance}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="h-10 rounded-xl font-bold gap-2 text-xs"
                        onClick={() =>
                          toast.info("Localização enviada para o GPS.")
                        }
                      >
                        <MapPin className="h-4 w-4 text-primary" /> Ver no Mapa
                      </Button>
                      <Button
                        variant="outline"
                        className="h-10 rounded-xl font-bold gap-2 text-xs"
                        onClick={() =>
                          (window.location.href = `tel:${selectedUnit.phone}`)
                        }
                      >
                        <PhoneCall className="h-4 w-4 text-primary" /> Ligar
                      </Button>
                    </div>
                    <Button
                      className="w-full h-11 rounded-xl font-black uppercase text-[10px] tracking-widest bg-primary text-white shadow-lg shadow-primary/20"
                      onClick={() => handleRequest(selectedUnit.name)}
                    >
                      Processar Vaga para Unidade
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ── TAB: Regulações ── */}
        <TabsContent value="solicitacoes" className="space-y-2">
          {realRequests.length === 0 ? (
            <div className="glass-card-premium rounded-2xl border border-white/30 dark:border-white/10 py-20 flex flex-col items-center justify-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-muted/20 flex items-center justify-center">
                <FileText className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <div className="text-center">
                <h3 className="font-black text-foreground mb-1">
                  Nenhuma Regulação Ativa
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Não há pacientes aguardando regulação ou em processo de
                  transferência CROSS.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Compact header row */}
              <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-x-4 items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground px-4 pb-1">
                <span className="w-1.5"></span>
                <span>Paciente / Protocolo</span>
                <span>Especialidade / Destino</span>
                <span>Fase</span>
                <span>Ação</span>
              </div>

              <AnimatePresence mode="popLayout">
                {realRequests.map((req, idx) => {
                  const pCfg =
                    priorityConfig[req.priority] || priorityConfig["Eletivo"];
                  const sCfg =
                    statusConfig[req.currentStatus] ||
                    statusConfig["Aguardando Vaga"];
                  const steps = [
                    "Aguardando Vaga",
                    "Vaga Confirmada",
                    "Em Transporte",
                    "Concluído",
                  ];
                  const stepIdx = steps.indexOf(req.currentStatus);

                  return (
                    <motion.div
                      layout
                      key={req.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className={cn(
                        "glass-card-premium rounded-2xl border border-white/30 dark:border-white/10 border-l-4 overflow-hidden",
                        pCfg.border,
                      )}
                    >
                      <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-x-4 items-center p-4">
                        {/* Priority dot */}
                        <span className={cn("h-2 w-2 rounded-full", pCfg.bg)} />

                        {/* Patient info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm leading-tight truncate">
                              {req.patientName}
                            </h4>
                            <Badge
                              className={cn(
                                "text-[8px] font-black uppercase px-1.5 py-0 border-0",
                                pCfg.bg,
                                "text-white",
                              )}
                            >
                              {req.priority}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {req.id} · Setor: {req.patientObj.sector || "—"}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Timer className="h-3 w-3 text-muted-foreground opacity-50" />
                            <span className="text-[10px] font-bold text-muted-foreground">
                              {req.requestTime} em espera
                            </span>
                          </div>
                        </div>

                        {/* Specialty / destination */}
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-foreground/80 truncate">
                            {req.targetSpecialty}
                          </p>
                          {req.destinationHospital && (
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                              <Hospital className="h-2.5 w-2.5 shrink-0" />
                              {req.destinationHospital}
                            </p>
                          )}
                          {!req.destinationHospital && (
                            <p className="text-[10px] text-muted-foreground italic mt-0.5">
                              Aguardando regulação...
                            </p>
                          )}
                          {req.rawRequest.crossCode && (
                            <p className="text-[9px] text-primary font-bold mt-0.5">
                              CROSS: {req.rawRequest.crossCode}
                            </p>
                          )}
                        </div>

                        {/* Phase stepper — compact */}
                        <div className="hidden md:flex items-center gap-0.5">
                          {steps.map((step, i) => {
                            const done = i <= stepIdx;
                            return (
                              <div
                                key={i}
                                className="flex items-center gap-0.5"
                              >
                                <div
                                  className={cn(
                                    "h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-black transition-all",
                                    done
                                      ? "bg-primary text-white"
                                      : "bg-muted text-muted-foreground",
                                  )}
                                >
                                  {done ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <span>{i + 1}</span>
                                  )}
                                </div>
                                {i < steps.length - 1 && (
                                  <div
                                    className={cn(
                                      "h-0.5 w-5",
                                      done && stepIdx > i
                                        ? "bg-primary"
                                        : "bg-muted",
                                    )}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Action */}
                        <div className="flex items-center gap-1.5">
                          {req.currentStatus === "Aguardando Vaga" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setConfirmingReq(req);
                                setSelectedHospital(mockUnits[0].name);
                                setCrossCodeInput(
                                  `CROSS-${Math.floor(100000 + Math.random() * 900000)}`,
                                );
                              }}
                              className="h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-wide bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
                              Confirmar Vaga
                            </Button>
                          )}
                          {req.currentStatus === "Vaga Confirmada" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                updatePatient(req.patientId, {
                                  transferRequest: {
                                    ...req.rawRequest,
                                    status: "transporting",
                                  },
                                });
                                toast.success(
                                  `Ambulância despachada para ${req.patientName}.`,
                                );
                              }}
                              className="h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-wide bg-blue-600 hover:bg-blue-700 text-white border-0 shadow"
                            >
                              <Truck className="w-3 h-3 mr-1" /> Despachar
                            </Button>
                          )}
                          {req.currentStatus === "Em Transporte" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                const patientBed = beds.find(
                                  (b) => b.patientId === req.patientId,
                                );
                                if (patientBed)
                                  releaseBed(
                                    patientBed.id,
                                    "normal",
                                    patientBed.isIsolation,
                                  );
                                updatePatient(req.patientId, {
                                  status: "completed",
                                  sector: "Transferido",
                                  transferRequest: {
                                    ...req.rawRequest,
                                    status: "completed",
                                  },
                                });
                                toast.success(
                                  `Transferência de ${req.patientName} concluída. Leito liberado.`,
                                );
                              }}
                              className="h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-wide bg-purple-600 hover:bg-purple-700 text-white border-0 shadow"
                            >
                              <ShieldCheck className="w-3 h-3 mr-1" /> Concluir
                            </Button>
                          )}
                          {req.currentStatus === "Concluído" && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Concluído
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Inline ambulance info if in transport */}
                      {req.rawRequest.ambulanceType &&
                        req.currentStatus !== "Concluído" && (
                          <div className="px-4 pb-3 pt-0 flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground">
                            <Truck className="h-3 w-3 opacity-50" />
                            <span>Viatura: {req.rawRequest.ambulanceType}</span>
                          </div>
                        )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </>
          )}
        </TabsContent>

        {/* ── TAB: Rede Assistencial ── */}
        <TabsContent value="rede">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Regional Network */}
            <div className="glass-card-premium rounded-2xl border border-white/30 dark:border-white/10 overflow-hidden">
              <div className="p-5 border-b border-border/30">
                <div className="flex items-center gap-2.5 mb-0.5">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-[11px] uppercase tracking-tight">
                      Macro Sudeste Grande SP
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      DRS I — Sudoeste
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-2">
                {[
                  { label: "Hospitais Terciários", val: "12" },
                  { label: "Unidades de Pronto Atendimento", val: "45" },
                  { label: "Centrais de Regulação", val: "02" },
                  { label: "Leitos Habilitados (SUS)", val: "4.820" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-1.5 border-b border-border/20 last:border-0"
                  >
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {item.label}
                    </span>
                    <span className="text-[11px] font-black">{item.val}</span>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-9 rounded-xl font-bold uppercase text-[9px] tracking-widest mt-2"
                >
                  Consultar Catálogo CNES
                </Button>
              </div>
            </div>

            {/* CROSS Protocols */}
            <div className="glass-card-premium rounded-2xl border border-white/30 dark:border-white/10 overflow-hidden">
              <div className="p-5 border-b border-border/30">
                <div className="flex items-center gap-2.5 mb-0.5">
                  <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-black text-[11px] uppercase tracking-tight">
                      Protocolos CROSS
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      Procedimentos Operacionais
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-2">
                {[
                  { label: "Urgência Traumática", type: "PDF", date: "2024" },
                  {
                    label: "Transferência Neonatal",
                    type: "DOCX",
                    date: "2024",
                  },
                  { label: "Fluxo COVID-19/SRAG", type: "PDF", date: "2023" },
                  { label: "Regulação UTI Adulto", type: "PDF", date: "2024" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-1.5 border-b border-border/20 last:border-0 gap-2"
                  >
                    <span className="text-[11px] text-foreground/80 font-medium truncate">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[8px] text-muted-foreground">
                        {item.date}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[8px] font-black px-1.5"
                      >
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button
                  size="sm"
                  className="w-full h-9 rounded-xl font-bold uppercase text-[9px] tracking-widest bg-primary text-white mt-2"
                >
                  Acessar Intranet
                </Button>
              </div>
            </div>

            {/* Performance */}
            <div className="glass-card-premium rounded-2xl border border-white/30 dark:border-white/10 overflow-hidden">
              <div className="p-5 border-b border-border/30">
                <div className="flex items-center gap-2.5 mb-0.5">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-[11px] uppercase tracking-tight">
                      Performance de Rede
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      Monitoramento Regional
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {[
                  {
                    label: "Ocupação UTI",
                    val: 88,
                    color: "red",
                    meta: "Meta: <85%",
                    trend: "+2%",
                  },
                  {
                    label: "Tempo Médio Espera",
                    val: 72,
                    color: "amber",
                    meta: "Meta: <60%",
                    trend: "-5%",
                  },
                  {
                    label: "Taxa de Transferência",
                    val: 61,
                    color: "emerald",
                    meta: "Meta: >50%",
                    trend: "+8%",
                  },
                ].map((m, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/80">
                          {m.label}
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                          {m.meta}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={cn(
                            "text-lg font-black",
                            m.color === "red"
                              ? "text-red-600"
                              : m.color === "amber"
                                ? "text-amber-600"
                                : "text-emerald-600",
                          )}
                        >
                          {m.val}%
                        </span>
                        <span
                          className={cn(
                            "ml-1 text-[9px] font-bold",
                            m.trend.startsWith("+")
                              ? "text-red-500"
                              : "text-emerald-500",
                          )}
                        >
                          {m.trend}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.val}%` }}
                        transition={{ duration: 0.8, delay: i * 0.15 }}
                        className={cn(
                          "h-full rounded-full",
                          m.color === "red"
                            ? "bg-red-500"
                            : m.color === "amber"
                              ? "bg-amber-500"
                              : "bg-emerald-500",
                        )}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-dashed border-border/40">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "Alertas Críticos",
                        val: "3",
                        icon: AlertCircle,
                        color: "text-red-500",
                      },
                      {
                        label: "Unidades Online",
                        val: "18/20",
                        icon: Wifi,
                        color: "text-emerald-500",
                      },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="bg-muted/20 rounded-xl p-3 text-center"
                      >
                        <s.icon
                          className={cn("h-4 w-4 mx-auto mb-1", s.color)}
                        />
                        <p className="text-sm font-black">{s.val}</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Network alerts row */}
          <div className="mt-4 glass-card-premium rounded-2xl border border-white/30 dark:border-white/10 overflow-hidden">
            <div className="p-4 border-b border-border/30 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Alertas de Rede Crítica
              </p>
            </div>
            <div className="divide-y divide-border/20">
              {[
                {
                  hospital: "Regional de Osasco",
                  msg: "Estoque de Oxigênio abaixo de 15%. Transferências eletivas suspensas.",
                  type: "critical",
                  time: "10:32",
                },
                {
                  hospital: "Mun. Parelheiros",
                  msg: "Surtos localizados. Leitos de isolamento zerados. Capacidade: 0%.",
                  type: "alert",
                  time: "09:14",
                },
                {
                  hospital: "Pedreira",
                  msg: "Unidade operando em contingência por sobrecarga em Pronto Socorro.",
                  type: "alert",
                  time: "08:55",
                },
              ].map((alert, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-4">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-white",
                      alert.type === "critical" ? "bg-red-500" : "bg-amber-500",
                    )}
                  >
                    {alert.type === "critical" ? (
                      <AlertCircle className="h-3.5 w-3.5" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest mr-2">
                      {alert.hospital}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {alert.msg}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground shrink-0">
                    {alert.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Global Census Dialog ── */}
      <Dialog open={isGlobalCensusOpen} onOpenChange={setIsGlobalCensusOpen}>
        <DialogContent className="sm:max-w-[720px] rounded-[2rem] p-0 overflow-hidden border-white/30 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
          <div className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/30">
            <Badge className="bg-primary/20 text-primary border-none text-[9px] font-black uppercase tracking-widest mb-2">
              Relatório Situacional Regional
            </Badge>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-1">
              Censo Hospitalar em Tempo Real
            </h2>
            <p className="text-xs text-muted-foreground">
              Consolidado macro de recursos SUS — Macrorregião Sudoeste.
            </p>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Ocupação Enfermaria",
                  val: 72,
                  color: "emerald",
                  badge: "ESTÁVEL",
                },
                {
                  label: "Ocupação UTI/Críticos",
                  val: 89,
                  color: "amber",
                  badge: "ALERTA",
                },
                {
                  label: "Leitos Isolamento",
                  val: 94,
                  color: "red",
                  badge: "CRÍTICO",
                },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => toast.info(`Gerando relatório: ${m.label}`)}
                  className={cn(
                    "p-5 rounded-2xl border cursor-pointer transition-shadow hover:shadow-lg text-center",
                    m.color === "emerald"
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : m.color === "amber"
                        ? "bg-amber-500/5 border-amber-500/20"
                        : "bg-red-500/5 border-red-500/20",
                  )}
                >
                  <p
                    className={cn(
                      "text-[9px] font-black uppercase tracking-widest mb-2",
                      m.color === "emerald"
                        ? "text-emerald-600"
                        : m.color === "amber"
                          ? "text-amber-600"
                          : "text-red-600",
                    )}
                  >
                    {m.label}
                  </p>
                  <span
                    className={cn(
                      "text-4xl font-black",
                      m.color === "emerald"
                        ? "text-emerald-600"
                        : m.color === "amber"
                          ? "text-amber-600"
                          : "text-red-600",
                    )}
                  >
                    {m.val}%
                  </span>
                  <div
                    className={cn(
                      "h-1.5 w-full rounded-full mt-3 overflow-hidden",
                      m.color === "emerald"
                        ? "bg-emerald-200"
                        : m.color === "amber"
                          ? "bg-amber-200"
                          : "bg-red-200",
                    )}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.val}%` }}
                      transition={{ duration: 0.9, delay: i * 0.1 }}
                      className={cn(
                        "h-full",
                        m.color === "emerald"
                          ? "bg-emerald-500"
                          : m.color === "amber"
                            ? "bg-amber-500"
                            : "bg-red-500",
                      )}
                    />
                  </div>
                  <Badge
                    className={cn(
                      "mt-3 text-[8px] font-black border-none text-white",
                      m.color === "emerald"
                        ? "bg-emerald-500"
                        : m.color === "amber"
                          ? "bg-amber-500"
                          : "bg-red-500",
                    )}
                  >
                    {m.badge}
                  </Badge>
                </motion.div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-red-500" /> Alertas de Rede
                Crítica
              </p>
              <div className="rounded-2xl border border-border/30 overflow-hidden divide-y divide-border/20">
                {[
                  {
                    hospital: "Regional de Osasco",
                    msg: "Estoque de Oxigênio abaixo de 15%.",
                    type: "critical",
                  },
                  {
                    hospital: "Mun. Parelheiros",
                    msg: "Surtos localizados. Leitos de isolamento zerados.",
                    type: "alert",
                  },
                  {
                    hospital: "Pedreira",
                    msg: "Operando em contingência por sobrecarga no PS.",
                    type: "alert",
                  },
                ].map((alert, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 p-3",
                      alert.type === "critical"
                        ? "bg-red-500/5"
                        : "bg-amber-500/5",
                    )}
                  >
                    <div
                      className={cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-white text-xs",
                        alert.type === "critical"
                          ? "bg-red-500"
                          : "bg-amber-500",
                      )}
                    >
                      {alert.type === "critical" ? (
                        <AlertCircle className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {alert.hospital}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        {alert.msg}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-8 pb-8 flex justify-end">
            <Button
              size="sm"
              className="h-10 rounded-xl px-6 font-black uppercase text-[10px] tracking-widest bg-primary text-white"
              onClick={() => setIsGlobalCensusOpen(false)}
            >
              Fechar Relatório
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Confirm Vacancy Dialog ── */}
      <Dialog
        open={!!confirmingReq}
        onOpenChange={(open) => !open && setConfirmingReq(null)}
      >
        {confirmingReq && (
          <DialogContent className="sm:max-w-md p-0 rounded-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden [&>button]:hidden">
            <div className="p-7 bg-emerald-500/5 border-b border-emerald-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Protocolo CROSS
                  </p>
                  <h3 className="font-black text-base uppercase tracking-tight">
                    Confirmar Vaga
                  </h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Confirme a vaga para:{" "}
                <strong className="text-foreground">
                  {confirmingReq.patientName}
                </strong>
              </p>
            </div>
            <div className="p-7 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
                  Hospital de Destino
                </label>
                <Select
                  value={selectedHospital}
                  onValueChange={setSelectedHospital}
                >
                  <SelectTrigger className="w-full h-11 rounded-xl font-bold">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-[200px]">
                    {mockUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.name}>
                        {unit.name} ({unit.city})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
                  Código CROSS / Protocolo
                </label>
                <Input
                  value={crossCodeInput}
                  onChange={(e) => setCrossCodeInput(e.target.value)}
                  className="h-11 rounded-xl font-bold border-2"
                  placeholder="Ex: CROSS-884920"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
                  Tipo de Transporte
                </label>
                <Select
                  value={selectedAmbulance}
                  onValueChange={setSelectedAmbulance}
                >
                  <SelectTrigger className="w-full h-11 rounded-xl font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="USB - Suporte Básico">
                      USB — Suporte Básico (SAMU)
                    </SelectItem>
                    <SelectItem value="USA - UTI Avançada">
                      USA — UTI Avançada (SAMU)
                    </SelectItem>
                    <SelectItem value="Transporte Próprio Municipal">
                      Transporte Próprio Municipal
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="px-7 pb-7 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl font-bold"
                onClick={() => setConfirmingReq(null)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl font-black uppercase text-[10px] tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg shadow-emerald-500/20"
                onClick={() => {
                  if (confirmingReq && selectedHospital && crossCodeInput) {
                    updatePatient(confirmingReq.patientId, {
                      transferRequest: {
                        ...confirmingReq.rawRequest,
                        status: "accepted",
                        hospitalName: selectedHospital,
                        crossCode: crossCodeInput,
                        ambulanceType: selectedAmbulance,
                      },
                    });
                    toast.success(
                      `Vaga confirmada para ${confirmingReq.patientName}`,
                    );
                    setConfirmingReq(null);
                  } else {
                    toast.error("Por favor, preencha todos os campos.");
                  }
                }}
              >
                Confirmar Vaga
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </motion.div>
  );
}
