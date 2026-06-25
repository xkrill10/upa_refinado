import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BedDouble,
  AlertCircle,
  CheckCircle2,
  Settings2,
  Info,
  UserRound,
  HeartPulse,
  Thermometer,
  Droplets,
  Activity,
  Sparkles,
  Clock3,
  Timer,
  Pill,
  ArrowRightLeft,
  Stethoscope,
  ArrowRight,
  Globe,
  FlaskConical,
  PackagePlus,
  X,
  XCircle,
  FileText,
  ShieldAlert,
  Biohazard,
  Clock,
  CalendarClock,
  History,
  Ambulance,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  cn,
  formatWords,
  getEvolutionStatus,
  formatPatientAge,
} from "@/lib/utils";
import { ExamsModal } from "@/components/PatientEvolution/Modals/ExamsModal";
import PatientRecord from "@/pages/PatientRecord";
import { PatientIconsBanner } from "@/components/PatientIconsBanner";
import { BedManagementModal } from "@/components/BedManagementModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useBeds, BedStatus } from "@/context/BedsContext";
import { usePatientsContext } from "@/context/PatientsContext";
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
import { ActionTooltip } from "@/components/ui/action-tooltip";
import { toast } from "sonner";

import { useRole } from "@/context/RoleContext";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RISK_ORDER: Record<string, number> = {
  emergency: 0,
  "very-urgent": 1,
  urgent: 2,
  "less-urgent": 3,
  "not-urgent": 4,
};

const getTimeInBed = (arrivalTime?: string) => {
  if (!arrivalTime) return { text: "--", hours: 0, color: "text-slate-500" };
  const diff = Date.now() - new Date(arrivalTime).getTime();
  const hours = diff / (1000 * 60 * 60);
  let color = "text-emerald-500";
  if (hours >= 12) color = "text-red-500 animate-pulse";
  else if (hours >= 6) color = "text-amber-500";

  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return { text: `${h}h ${m}m`, hours, color };
};

const isBedCompatibleWithPatient = (
  bed: { room?: string },
  patient: Patient | null | undefined,
) => {
  if (!patient || !patient.gender) return true;
  const room = bed.room || "";
  const isFemaleRoom = room.toLowerCase().includes("fem");
  const isMaleRoom = room.toLowerCase().includes("masc");
  if (!isFemaleRoom && !isMaleRoom) return true;

  const patientGender = patient.gender.toLowerCase();
  if (isFemaleRoom && (patientGender === "feminino" || patientGender === "f"))
    return true;
  if (isMaleRoom && (patientGender === "masculino" || patientGender === "m"))
    return true;

  return false;
};

const getBedGenderIcon = (room?: string) => {
  if (!room) return "";
  if (room.toLowerCase().includes("fem")) return "♀";
  if (room.toLowerCase().includes("masc")) return "♂";
  return false;
};

const riskConfig: Record<string, { label: string; color: string }> = {
  emergency: {
    label: "Emergência",
    color: "text-red-500 border-red-500 bg-red-500/10",
  },
  "very-urgent": {
    label: "Muito Urgente",
    color: "text-orange-500 border-orange-500 bg-orange-500/10",
  },
  urgent: {
    label: "Urgente",
    color: "text-yellow-500 border-yellow-500 bg-yellow-500/10",
  },
  "less-urgent": {
    label: "Pouco Urgente",
    color: "text-green-500 border-green-500 bg-green-500/10",
  },
  "not-urgent": {
    label: "Não Urgente",
    color: "text-blue-500 border-blue-500 bg-blue-500/10",
  },
};

export default function Beds() {
  const { role } = useRole();
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const [showBedManagementModal, setShowBedManagementModal] = useState<
    string | null
  >(null);
  const [filter, setFilter] = useState<
    "all" | "occupied" | "available" | "maintenance" | "cleaning" | "reserved"
  >("all");
  const [selectedRisk, setSelectedRisk] = useState<Patient["risk"] | null>(
    null,
  );
  const [advancedFilter, setAdvancedFilter] = useState<
    "sla" | "isolation" | "discharge" | null
  >(null);
  const [activeTab, setActiveTab] = useState("census");
  const [editingVitalsPatient, setEditingVitalsPatient] =
    useState<Patient | null>(null);
  const [allocatingPatientId, setAllocatingPatientId] = useState<string | null>(
    null,
  );
  const [summaryPatient, setSummaryPatient] = useState<Patient | null>(null);
  const [timelinePatient, setTimelinePatient] = useState<Patient | null>(null);
  const [transferringBedId, setTransferringBedId] = useState<string | null>(
    null,
  );
  const [targetBedId, setTargetBedId] = useState<string>("");
  const [localRisk, setLocalRisk] = useState<string | null>(null);
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false);
  const [patientForExams, setPatientForExams] = useState<Patient | null>(null);
  const [vitalsForm, setVitalsForm] = useState({
    heartRate: "",
    bloodPressure: "",
    saturation: "",
    temperature: "",
  });

  /* ─── Satellite Pharmacy Flow State ─── */
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [patientForPharmacy, setPatientForPharmacy] = useState<Patient | null>(
    null,
  );
  const [pharmacyRequest, setPharmacyRequest] = useState({
    item: "",
    amount: "1",
    priority: "normal",
  });

  /* ─── Quick Record Modal Flow State ─── */
  const [recordPatientId, setRecordPatientId] = useState<number | null>(null);

  /* ─── Transfer Request Modal Flow State ─── */
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [patientForTransfer, setPatientForTransfer] = useState<Patient | null>(
    null,
  );
  const [transferRequestForm, setTransferRequestForm] = useState<{
    priority: "normal" | "urgent" | "emergency";
    reason: string;
  }>({ priority: "normal", reason: "" });

  useEffect(() => {
    if (!editingVitalsPatient) return;

    // Only calculate if the user has entered at least one parameter
    if (
      !vitalsForm.heartRate &&
      !vitalsForm.bloodPressure &&
      !vitalsForm.saturation &&
      !vitalsForm.temperature
    ) {
      setLocalRisk(null);
      return;
    }

    const hr = parseInt(vitalsForm.heartRate) || 80;
    const temp = parseFloat(vitalsForm.temperature) || 36.5;
    const sat = parseFloat(vitalsForm.saturation) || 98;

    let sys = 120;
    let dia = 80;
    const bp = vitalsForm.bloodPressure;
    if (bp && bp.includes("/")) {
      const parts = bp.split("/");
      let parsedSys = parseInt(parts[0]);
      let parsedDia = parseInt(parts[1]);
      if (parsedSys < 30) parsedSys = parsedSys * 10;
      if (parsedDia < 15 && parsedDia > 0) parsedDia = parsedDia * 10;
      sys = parsedSys || 120;
      dia = parsedDia || 80;
    } else if (bp) {
      let parsedSys = parseInt(bp);
      if (parsedSys < 30) parsedSys = parsedSys * 10;
      sys = parsedSys || 120;
    }

    let calculatedRisk = "less-urgent";

    // EMERGÊNCIA (Vermelho)
    if (
      hr > 130 ||
      hr < 40 ||
      temp > 40 ||
      temp < 35 ||
      sat < 90 ||
      sys >= 180 ||
      dia >= 120 ||
      sys < 80
    ) {
      calculatedRisk = "emergency";
    }
    // MUITO URGENTE (Laranja)
    else if (
      (hr >= 120 && hr <= 130) ||
      (hr >= 40 && hr <= 50) ||
      (temp >= 39 && temp <= 40) ||
      (sat >= 90 && sat <= 94) ||
      (sys >= 160 && sys < 180) ||
      (dia >= 100 && dia < 120) ||
      (sys >= 80 && sys < 90)
    ) {
      calculatedRisk = "very-urgent";
    }
    // URGENTE (Amarelo)
    else if (
      (hr >= 100 && hr < 120) ||
      (temp >= 37.5 && temp < 39) ||
      (sat >= 95 && sat <= 97) ||
      (sys >= 140 && sys < 160) ||
      (dia >= 90 && dia < 100)
    ) {
      calculatedRisk = "urgent";
    }
    // NÃO URGENTE (Azul) - Sinais perfeitamente normais e excelentes
    else if (
      hr >= 60 &&
      hr <= 100 &&
      temp >= 36 &&
      temp <= 37.5 &&
      sat >= 95 &&
      sys >= 100 &&
      sys <= 130 &&
      dia >= 60 &&
      dia <= 85
    ) {
      calculatedRisk = "not-urgent";
    }
    // Caso contrário cai no POUCO URGENTE (Verde) como padrão para leve alteração ou valores normais abrangentes

    setLocalRisk(calculatedRisk);
  }, [vitalsForm, editingVitalsPatient]);

  const {
    beds,
    updateBedStatus,
    getStats,
    releaseBed,
    transferPatient,
    assignPatient,
  } = useBeds();
  const { patients, updatePatient, requestTransfer } = usePatientsContext();

  const getBedPatient = (bed: (typeof beds)[number]) => {
    const linkedPatient = patients.find(
      (patient) => patient.id === bed.patientId,
    );
    if (linkedPatient) return linkedPatient;

    if (bed.id.startsWith("e-")) {
      const position = Number(bed.id.replace("e-", "")) - 1;
      return patients[position];
    }

    if (bed.id.startsWith("o-")) {
      const position = Number(bed.id.replace("o-", "")) + 4;
      return patients[position % patients.length];
    }

    return undefined;
  };

  const getPatientAssignedBed = (patientId: string) => {
    return beds.find((b) => b.patientId === patientId);
  };

  const admissionQueue = patients.filter(
    (p) => p.admissionRequest?.status === "pending",
  );
  const stats = getStats();
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedRisk(null);
  };

  const riskStats = [
    {
      label: "Emergência",
      risk: "emergency" as const,
      color: "bg-red-500",
      activeColor: "ring-red-500/50",
      icon: AlertCircle,
    },
    {
      label: "Muito Urgente",
      risk: "very-urgent" as const,
      color: "bg-orange-500",
      activeColor: "ring-orange-500/50",
      icon: Clock3,
    },
    {
      label: "Urgente",
      risk: "urgent" as const,
      color: "bg-[#FFDE21]",
      activeColor: "ring-[#FFDE21]/50",
      icon: HeartPulse,
      iconColor: "text-black",
    },
    {
      label: "Pouco Urgente",
      risk: "less-urgent" as const,
      color: "bg-green-500",
      activeColor: "ring-green-500/50",
      icon: Stethoscope,
    },
    {
      label: "Não Urgente",
      risk: "not-urgent" as const,
      color: "bg-blue-600",
      activeColor: "ring-blue-600/50",
      icon: Pill,
    },
  ];

  const occupiedBedsWithPatients = beds
    .filter((b) => b.status === "occupied")
    .map((b) => ({ bed: b, patient: getBedPatient(b) }))
    .filter((item) => item.patient) as {
    bed: (typeof beds)[number];
    patient: Patient;
  }[];

  const handleTransfer = () => {
    if (transferringBedId && targetBedId) {
      const sourceBed = beds.find((b) => b.id === transferringBedId);
      const targetBed = beds.find((b) => b.id === targetBedId);
      const patient = sourceBed ? getBedPatient(sourceBed) : null;

      if (targetBed && !isBedCompatibleWithPatient(targetBed, patient)) {
        toast.error("Transferência bloqueada", {
          description:
            "O leito de destino é incompatível com o sexo do paciente.",
        });
        return;
      }

      transferPatient(transferringBedId, targetBedId);
      toast.success("Transferência realizada", {
        description: `Paciente transferido com sucesso para o ${targetBed?.name}.`,
      });
      setTransferringBedId(null);
      setTargetBedId("");
    }
  };

  const statusConfig: Record<
    BedStatus,
    { label: string; color: string; icon: LucideIcon; description: string }
  > = {
    occupied: {
      label: "Ocupado",
      color: "bg-red-500/10 text-red-500 border-red-500/20",
      icon: AlertCircle,
      description: "Leito em uso por um paciente.",
    },
    available: {
      label: "Disponível",
      color: "bg-green-500/10 text-green-500 border-green-500/20",
      icon: CheckCircle2,
      description: "Pronto para receber novos pacientes.",
    },
    maintenance: {
      label: "Manutenção",
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      icon: Settings2,
      description: "Leito em reparo técnico.",
    },
    cleaning: {
      label: "Higienização",
      color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      icon: Sparkles,
      description: "Aguardando higienização.",
    },
    reserved: {
      label: "Reservado",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      icon: Clock,
      description: "Leito reservado para um paciente.",
    },
  };

  const selectedBed = beds.find((b) => b.id === selectedBedId);
  const filteredBeds =
    filter === "all" ? beds : beds.filter((b) => b.status === filter);

  const emergencyBedsTotal = beds.filter((b) => b.id.startsWith("e-"));
  const observationBedsTotal = beds.filter((b) => b.id.startsWith("o-"));

  const emergencyBeds = filteredBeds.filter((b) => b.id.startsWith("e-"));
  const observationBeds = filteredBeds.filter((b) => b.id.startsWith("o-"));

  const handleStatusChange = (newStatus: BedStatus) => {
    if (selectedBedId) {
      updateBedStatus(selectedBedId, newStatus);
      toast.success("Status atualizado", {
        description: `O ${selectedBed?.name} agora está ${statusConfig[newStatus].label.toLowerCase()}.`,
      });
    }
  };

  const toggleFilter = (newFilter: BedStatus) => {
    setFilter((prev) => (prev === newFilter ? "all" : newFilter));
  };

  const renderBedCards = (bedsList: typeof beds) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {bedsList.length === 0 ? (
        <div className="col-span-4 py-16 text-center text-muted-foreground italic">
          Nenhum leito encontrado para o status selecionado nesta ala.
        </div>
      ) : (
        bedsList.map((bed) => {
          const config = statusConfig[bed.status];
          const patient = getBedPatient(bed);
          const getPremiumStyles = (risk: string | undefined) => {
            switch (risk) {
              case "emergency":
                return "border-red-500/40 dark:border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.15)] ring-1 ring-red-500/10 dark:ring-red-500/20 glass-card rounded-xl";
              case "very-urgent":
                return "border-orange-500/40 dark:border-orange-500/50 shadow-[0_0_25px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/10 dark:ring-orange-500/20 glass-card rounded-xl";
              case "urgent":
                return "border-amber-400/40 dark:border-amber-400/55 shadow-[0_0_25px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/10 dark:ring-amber-400/20 glass-card rounded-xl";
              case "less-urgent":
                return "border-emerald-500/40 dark:border-emerald-500/55 shadow-[0_0_25px_rgba(34,197,94,0.15)] ring-1 ring-emerald-500/10 dark:ring-emerald-500/20 glass-card rounded-xl";
              default:
                return "border-slate-200/40 dark:border-slate-800/40 shadow-xl glass-card rounded-xl";
            }
          };

          const getAccentColor = (risk: string | undefined) => {
            switch (risk) {
              case "emergency":
                return "bg-red-500";
              case "very-urgent":
                return "bg-orange-500";
              case "urgent":
                return "bg-[#FFDE21]";
              case "less-urgent":
                return "bg-green-500";
              default:
                return "bg-slate-300";
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
              <Card
                className={cn(
                  "group transition-all duration-500 overflow-hidden h-full flex flex-col relative rounded-xl border-none shadow-none",
                  bed.status === "occupied"
                    ? premiumStyles
                    : "glass-card hover:brightness-110 dark:hover:brightness-125 shadow-xl",
                )}
              >
                {/* Premium Top Accent */}
                {bed.status === "occupied" && (
                  <div
                    className={cn(
                      "absolute top-0 left-0 right-0 h-1 z-10",
                      accentColor,
                    )}
                  />
                )}

                {bed.status === "maintenance" && (
                  <div className="absolute top-0 left-0 right-0 h-1 z-10 bg-yellow-500" />
                )}
                {bed.status === "cleaning" && (
                  <div className="absolute top-0 left-0 right-0 h-1 z-10 bg-orange-500 animate-pulse" />
                )}
                {bed.status === "reserved" && (
                  <div className="absolute top-0 left-0 right-0 h-1 z-10 bg-blue-500" />
                )}
                <CardHeader className="pb-3 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                          bed.status === "occupied"
                            ? "bg-red-500/10 text-red-500"
                            : bed.status === "maintenance"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : bed.status === "cleaning"
                                ? "bg-orange-500/10 text-orange-500"
                                : bed.status === "reserved"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-emerald-500/10 text-emerald-500",
                        )}
                      >
                        <BedDouble className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-foreground">
                          {bed.name}
                        </CardTitle>
                        <p className="text-[10px] font-medium text-muted-foreground opacity-70">
                          {bed.ward} · {bed.room}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-bold px-2 py-0",
                        config.color,
                      )}
                    >
                      {config.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-4 flex-1 relative z-10">
                  {bed.status === "occupied" ? (
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white/50 to-white/20 dark:from-slate-900/50 dark:to-slate-800/20 border border-white/50 dark:border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] backdrop-blur-md">
                        <div
                          className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-white/40 dark:hover:bg-slate-800/50 p-1.5 rounded-xl transition-all group/pname shadow-sm border border-transparent hover:border-white/50 dark:hover:border-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSummaryPatient(patient);
                          }}
                        >
                          <UserRound className="h-3.5 w-3.5 text-[#006699] dark:text-sky-400 group-hover/pname:scale-110 transition-transform drop-shadow-sm shrink-0" />
                          <span className="text-[12px] font-black truncate group-hover/pname:text-[#006699] dark:group-hover/pname:text-sky-300 text-foreground flex items-center gap-1">
                            {formatWords(patient?.name || "")}
                            {["feminino", "f"].includes(
                              patient?.gender?.toLowerCase() || "",
                            ) && (
                              <span
                                className="text-pink-500 text-[14px]"
                                title="Feminino"
                              >
                                ♀
                              </span>
                            )}
                            {["masculino", "m"].includes(
                              patient?.gender?.toLowerCase() || "",
                            ) && (
                              <span
                                className="text-blue-500 text-[14px]"
                                title="Masculino"
                              >
                                ♂
                              </span>
                            )}
                          </span>
                        </div>
                        {patient && (
                          <div className="mt-2 mb-3 px-1">
                            <PatientIconsBanner
                              patient={patient}
                              iconSize={14}
                              gap="4px"
                            />
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div
                            className="flex items-center justify-center gap-1.5 bg-white/40 dark:bg-slate-950/40 py-2 rounded-xl text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase cursor-help hover:text-[#006699] dark:hover:text-sky-300 transition-colors border border-white/40 dark:border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTimelinePatient(patient);
                            }}
                          >
                            <Timer className="h-3 w-3 text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />{" "}
                            Perm: 4h
                          </div>
                          <div
                            className="flex items-center justify-center gap-1.5 bg-white/40 dark:bg-slate-950/40 py-2 rounded-xl text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase cursor-pointer hover:text-[#006699] dark:hover:text-sky-300 transition-colors border border-white/40 dark:border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingVitalsPatient(patient);
                              setLocalRisk(null);
                              setVitalsForm({
                                heartRate: "",
                                bloodPressure: "",
                                saturation: "",
                                temperature: "",
                              });
                            }}
                          >
                            <AlertCircle
                              className={cn(
                                "h-3 w-3 drop-shadow-[0_0_5px_currentColor]",
                                patient.risk === "emergency"
                                  ? "text-red-500 animate-pulse-slow"
                                  : "text-emerald-500",
                              )}
                            />{" "}
                            {patient.risk === "emergency"
                              ? "Crítico"
                              : "Estável"}
                          </div>
                          <div
                            className="flex items-center justify-center gap-1.5 bg-white/40 dark:bg-slate-950/40 py-2 rounded-xl text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors border border-white/40 dark:border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPatientForExams(patient);
                              setIsExamsModalOpen(true);
                            }}
                          >
                            <FlaskConical className="h-3 w-3 text-purple-500 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />{" "}
                            Exames
                          </div>
                          <div
                            className="flex items-center justify-center gap-1.5 bg-white/40 dark:bg-slate-950/40 py-2 rounded-xl text-[9px] font-black text-sky-600 dark:text-sky-400 uppercase cursor-pointer hover:text-sky-700 dark:hover:text-sky-300 transition-colors border border-sky-400/30 dark:border-sky-400/20 shadow-[inset_0_1px_1px_rgba(14,165,233,0.1)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPatientForPharmacy(patient);
                              setShowPharmacyModal(true);
                            }}
                          >
                            <PackagePlus className="h-3 w-3 text-sky-500 drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]" />{" "}
                            Insumos
                          </div>
                        </div>
                      </div>

                      <div
                        className="grid grid-cols-4 gap-2 cursor-pointer group/vitals"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingVitalsPatient(patient);
                          setLocalRisk(null);
                          setVitalsForm({
                            heartRate: patient.fc || "",
                            bloodPressure: patient.pa || "",
                            saturation: patient.spo2 || "",
                            temperature: patient.temperature || "",
                          });
                        }}
                      >
                        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-white/5 shadow-sm group-hover/vitals:bg-white/60 dark:group-hover/vitals:bg-slate-800/50 transition-colors">
                          <HeartPulse className="h-3.5 w-3.5 text-red-500 mb-1 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                          <span className="text-[11px] font-black text-foreground leading-none">
                            {patient.fc || "88"}
                          </span>
                          <span className="text-[7px] font-black uppercase text-slate-500 dark:text-slate-400 mt-0.5">
                            FC
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-white/5 shadow-sm group-hover/vitals:bg-white/60 dark:group-hover/vitals:bg-slate-800/50 transition-colors">
                          <Activity className="h-3.5 w-3.5 text-blue-500 mb-1 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                          <span className="text-[11px] font-black text-foreground leading-none">
                            {patient.pa || "12/8"}
                          </span>
                          <span className="text-[7px] font-black uppercase text-slate-500 dark:text-slate-400 mt-0.5">
                            PA
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-white/5 shadow-sm group-hover/vitals:bg-white/60 dark:group-hover/vitals:bg-slate-800/50 transition-colors">
                          <Droplets className="h-3.5 w-3.5 text-emerald-500 mb-1 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                          <span className="text-[11px] font-black text-foreground leading-none">
                            {patient.spo2 ? patient.spo2 + "%" : "98%"}
                          </span>
                          <span className="text-[7px] font-black uppercase text-slate-500 dark:text-slate-400 mt-0.5">
                            SAT
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-white/5 shadow-sm group-hover/vitals:bg-white/60 dark:group-hover/vitals:bg-slate-800/50 transition-colors">
                          <Thermometer className="h-3.5 w-3.5 text-orange-500 mb-1 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                          <span className="text-[11px] font-black text-foreground leading-none">
                            {patient.temperature || "36.5"}
                          </span>
                          <span className="text-[7px] font-black uppercase text-slate-500 dark:text-slate-400 mt-0.5">
                            TEMP
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : bed.status === "maintenance" ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-2 opacity-60">
                      <Settings2 className="h-8 w-8 text-yellow-500 animate-spin-slow" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-center text-foreground">
                        Em Manutenção
                      </p>
                    </div>
                  ) : bed.status === "cleaning" ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-2 opacity-80">
                      <Sparkles className="h-8 w-8 text-orange-500 animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-center text-orange-500 animate-pulse">
                        Aguardando Higienização
                      </p>
                    </div>
                  ) : bed.status === "reserved" ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-2 opacity-80">
                      <Clock className="h-8 w-8 text-blue-500 animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-center text-blue-500">
                        Leito Reservado
                      </p>
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center justify-center gap-2 opacity-40">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-center text-foreground">
                        Leito Disponível
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 mt-auto">
                    <Button
                      variant="outline"
                      className="flex-1 px-1 text-[9px] font-black uppercase tracking-widest h-10 rounded-xl bg-gradient-to-b from-white/60 to-white/30 dark:from-slate-800/60 dark:to-slate-900/60 border border-white/60 dark:border-white/10 hover:from-[#006699] hover:to-[#004d73] hover:text-white dark:hover:from-sky-500 dark:hover:to-sky-600 dark:hover:text-slate-950 transition-all shadow-sm text-foreground hover:shadow-lg"
                      onClick={() => setSelectedBedId(bed.id)}
                    >
                      Gerenciar
                    </Button>
                    {bed.status === "occupied" && (
                      <Button
                        variant="default"
                        className="flex-1 px-1 text-[9px] font-black uppercase tracking-widest h-10 rounded-xl shadow-lg transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowBedManagementModal(bed.id);
                        }}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" /> Ficha
                      </Button>
                    )}
                    {bed.status === "available" && role !== "medico" && (
                      <Button
                        variant="secondary"
                        className="flex-1 px-1 text-[9px] font-black uppercase tracking-widest h-10 rounded-xl bg-white/40 dark:bg-slate-800/40 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 transition-all border border-white/50 dark:border-white/10 backdrop-blur-md shadow-sm"
                        onClick={() => releaseBed(bed.id, "normal", false)}
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-1" /> Solicitar
                        Limpeza
                      </Button>
                    )}
                    {bed.status === "cleaning" && role !== "medico" && (
                      <Button
                        variant="secondary"
                        className="flex-1 px-1 text-[9px] font-black uppercase tracking-widest h-10 rounded-xl bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white transition-all border border-orange-500/30 backdrop-blur-md shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateBedStatus(bed.id, "available");
                        }}
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-1" /> Limpeza
                        Concluída
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })
      )}
    </div>
  );

  const getParameterRisk = (
    type: "hr" | "bp" | "sat" | "temp",
    value: string,
  ) => {
    if (!value) return null;

    if (type === "hr") {
      const hr = parseInt(value);
      if (isNaN(hr)) return null;
      if (hr > 130 || hr < 40) return "emergency";
      if ((hr >= 120 && hr <= 130) || (hr >= 40 && hr <= 50))
        return "very-urgent";
      if (hr >= 100 && hr < 120) return "urgent";
      if (hr >= 60 && hr <= 100) return "not-urgent";
      return "less-urgent";
    }

    if (type === "temp") {
      const temp = parseFloat(value);
      if (isNaN(temp)) return null;
      if (temp > 40 || temp < 35) return "emergency";
      if (temp >= 39 && temp <= 40) return "very-urgent";
      if (temp >= 37.5 && temp < 39) return "urgent";
      if (temp >= 36 && temp <= 37.5) return "not-urgent";
      return "less-urgent";
    }

    if (type === "sat") {
      const sat = parseFloat(value);
      if (isNaN(sat)) return null;
      if (sat < 90) return "emergency";
      if (sat >= 90 && sat <= 94) return "very-urgent";
      if (sat >= 95 && sat <= 97) return "urgent";
      if (sat > 97) return "not-urgent";
      return "less-urgent";
    }

    if (type === "bp") {
      if (!value.includes("/")) return null;
      const parts = value.split("/");
      let sys = parseInt(parts[0]);
      let dia = parseInt(parts[1]);
      if (isNaN(sys) || isNaN(dia)) return null;
      if (sys < 30) sys = sys * 10;
      if (dia < 15 && dia > 0) dia = dia * 10;

      if (sys >= 180 || dia >= 120 || sys < 80) return "emergency";
      if (
        (sys >= 160 && sys < 180) ||
        (dia >= 100 && dia < 120) ||
        (sys >= 80 && sys < 90)
      )
        return "very-urgent";
      if ((sys >= 140 && sys < 160) || (dia >= 90 && dia < 100))
        return "urgent";
      if (sys >= 100 && sys <= 130 && dia >= 60 && dia <= 85)
        return "not-urgent";
      return "less-urgent";
    }
    return null;
  };

  const getStylesForRisk = (risk: string | null) => {
    const iconColor =
      risk === "emergency"
        ? "text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
        : risk === "very-urgent"
          ? "text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]"
          : risk === "urgent"
            ? "text-[#FFDE21] drop-shadow-[0_0_5px_rgba(255,222,33,0.5)]"
            : risk === "less-urgent"
              ? "text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]"
              : risk === "not-urgent"
                ? "text-blue-600 drop-shadow-[0_0_5px_rgba(37,99,235,0.5)]"
                : "text-muted-foreground/50";

    const borderColor =
      risk === "emergency"
        ? "focus:ring-red-500/20 border-red-500/50 bg-red-500/5"
        : risk === "very-urgent"
          ? "focus:ring-orange-500/20 border-orange-500/50 bg-orange-500/5"
          : risk === "urgent"
            ? "focus:ring-[#FFDE21]/20 border-[#FFDE21]/50 bg-[#FFDE21]/5"
            : risk === "less-urgent"
              ? "focus:ring-emerald-500/20 border-emerald-500/50 bg-emerald-500/5"
              : risk === "not-urgent"
                ? "focus:ring-blue-600/20 border-blue-600/50 bg-blue-600/5"
                : "border-slate-200/60 dark:border-slate-800/60 focus:ring-[#006699]/20 dark:focus:ring-sky-500/20 bg-slate-50/50 dark:bg-slate-900/40";

    return { iconColor, borderColor };
  };

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
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">
              Gestão de Leitos
            </h1>
            <p className="text-muted-foreground text-[11px] font-black uppercase tracking-widest mt-0.5">
              Capacidade: {emergencyBedsTotal.length} Emergência |{" "}
              {observationBedsTotal.length} Observação
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toggleFilter("available")}
            className={cn(
              "px-4 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-300",
              filter === "available"
                ? "bg-emerald-500 text-white border-emerald-600 shadow-lg scale-105"
                : "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10",
            )}
          >
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                filter === "available"
                  ? "bg-white animate-pulse"
                  : "bg-emerald-500",
              )}
            />
            <span className="font-bold text-xs">
              {stats.available} Disponíveis
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleFilter("occupied")}
            className={cn(
              "px-4 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-300",
              filter === "occupied"
                ? "bg-red-500 text-white border-red-600 shadow-lg scale-105"
                : "border-red-500/30 bg-red-500/5 text-red-600 hover:bg-red-500/10",
            )}
          >
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                filter === "occupied" ? "bg-white" : "bg-red-500",
              )}
            />
            <span className="font-bold text-xs">{stats.occupied} Ocupados</span>
          </button>

          <button
            type="button"
            onClick={() => toggleFilter("maintenance")}
            className={cn(
              "px-4 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-300",
              filter === "maintenance"
                ? "bg-yellow-500 text-white border-yellow-600 shadow-lg scale-105"
                : "border-yellow-500/30 bg-yellow-500/5 text-yellow-600 hover:bg-yellow-500/10",
            )}
          >
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                filter === "maintenance" ? "bg-white" : "bg-yellow-500",
              )}
            />
            <span className="font-bold text-xs">
              {stats.maintenance} Manutenção
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleFilter("cleaning")}
            className={cn(
              "px-4 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-300",
              filter === "cleaning"
                ? "bg-orange-500 text-white border-orange-600 shadow-lg scale-105"
                : "border-orange-500/30 bg-orange-500/5 text-orange-600 hover:bg-orange-500/10",
            )}
          >
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                filter === "cleaning"
                  ? "bg-white animate-pulse"
                  : "bg-orange-500",
              )}
            />
            <span className="font-bold text-xs">
              {stats.cleaning || 0} Higienização
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleFilter("reserved")}
            className={cn(
              "px-4 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-300",
              filter === "reserved"
                ? "bg-blue-500 text-white border-blue-600 shadow-lg scale-105"
                : "border-blue-500/30 bg-blue-500/5 text-blue-600 hover:bg-blue-500/10",
            )}
          >
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                filter === "reserved"
                  ? "bg-white animate-pulse"
                  : "bg-blue-500",
              )}
            />
            <span className="font-bold text-xs">
              {stats.reserved || 0} Reservados
            </span>
          </button>

          {filter !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter("all")}
              className="text-[10px] font-black uppercase tracking-widest h-8 px-2 hover:bg-muted"
            >
              Limpar Filtro
            </Button>
          )}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-1 rounded-xl h-14 mb-8 overflow-x-auto flex-nowrap shrink-0 max-w-full shadow-inner border border-slate-200/40 dark:border-slate-800/45">
          <TabsTrigger
            value="census"
            onClick={() => {
              if (activeTab === "census") setSelectedRisk(null);
            }}
            className="rounded-lg h-12 px-8 font-bold text-sm data-[state=active]:bg-[#006699] dark:data-[state=active]:bg-sky-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Censo Global ({occupiedBedsWithPatients.length})
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="map"
            className="rounded-lg h-12 px-8 font-bold text-sm data-[state=active]:bg-[#006699] dark:data-[state=active]:bg-sky-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
          >
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Mapa da Unidade
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="rounded-lg h-12 px-8 font-bold text-sm data-[state=active]:bg-slate-700 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
          >
            Todas as Alas ({filteredBeds.length})
          </TabsTrigger>
          <TabsTrigger
            value="emergency"
            className="rounded-lg h-12 px-8 font-bold text-sm data-[state=active]:bg-red-500 dark:data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
          >
            Emergência ({emergencyBeds.length})
          </TabsTrigger>
          <TabsTrigger
            value="observation"
            className="rounded-lg h-12 px-8 font-bold text-sm data-[state=active]:bg-amber-400 dark:data-[state=active]:bg-amber-500 data-[state=active]:text-black dark:data-[state=active]:text-slate-950 data-[state=active]:shadow-md transition-all"
          >
            Observação ({observationBeds.length})
          </TabsTrigger>
          <TabsTrigger
            value="queue"
            className="rounded-lg h-12 px-8 font-bold text-sm data-[state=active]:bg-red-500 dark:data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all relative"
          >
            Fila de Internação
            {admissionQueue.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {admissionQueue.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="map" className="mt-0 outline-none">
          <Card className="glass-card-premium border-none shadow-2xl overflow-hidden rounded-xl">
            <CardHeader className="p-6 border-b border-white/20 dark:border-white/5">
              <CardTitle className="text-sm font-black tracking-widest text-[#006699] dark:text-sky-400 uppercase">
                Planta Baixa
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-transparent">
              <div className="flex flex-col gap-8">
                {[
                  {
                    name: "Emergência",
                    beds: filteredBeds.filter((b) => b.room === "Emergência"),
                    containerClass: "border-red-500/20 bg-red-500/5",
                    titleClass: "text-red-500",
                    icon: null,
                  },
                  {
                    name: "Observação Feminina",
                    beds: filteredBeds.filter(
                      (b) => b.room === "Observação Feminina",
                    ),
                    containerClass: "border-pink-500/20 bg-pink-500/5",
                    titleClass: "text-pink-500",
                    icon: "♀",
                  },
                  {
                    name: "Observação Masculina",
                    beds: filteredBeds.filter(
                      (b) => b.room === "Observação Masculina",
                    ),
                    containerClass: "border-blue-500/20 bg-blue-500/5",
                    titleClass: "text-blue-500",
                    icon: "♂",
                  },
                  {
                    name: "Pediatria",
                    beds: filteredBeds.filter((b) => b.room === "Pediatria"),
                    containerClass: "border-amber-500/20 bg-amber-500/5",
                    titleClass: "text-amber-500",
                    icon: null,
                  },
                  {
                    name: "Isolamento",
                    beds: filteredBeds.filter((b) => b.room === "Isolamento"),
                    containerClass: "border-purple-500/20 bg-purple-500/5",
                    titleClass: "text-purple-500",
                    icon: null,
                  },
                ].map((roomLayout, idx) => {
                  if (roomLayout.beds.length === 0) return null;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "p-6 rounded-2xl border-2 relative",
                        roomLayout.containerClass,
                      )}
                    >
                      <div
                        className={cn(
                          "absolute -top-3 left-6 px-2 bg-background font-black text-xs uppercase tracking-widest flex items-center gap-1",
                          roomLayout.titleClass,
                        )}
                      >
                        Bloco: {roomLayout.name}
                        {roomLayout.icon && (
                          <span className="text-[14px] leading-none">
                            {roomLayout.icon}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-2">
                        {roomLayout.beds.map((bed) => {
                          const p = getBedPatient(bed);
                          const evoStatus = p ? getEvolutionStatus(p) : null;

                          const tooltipContent = p ? (
                            <div className="flex flex-col gap-2 p-1 min-w-[200px]">
                              <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm text-white flex items-center gap-1">
                                    {formatWords(p.name)}
                                    {["feminino", "f"].includes(
                                      p.gender?.toLowerCase() || "",
                                    ) && (
                                      <span className="text-pink-300 font-bold text-base leading-none drop-shadow-sm">
                                        ♀
                                      </span>
                                    )}
                                    {["masculino", "m"].includes(
                                      p.gender?.toLowerCase() || "",
                                    ) && (
                                      <span className="text-sky-300 font-bold text-base leading-none drop-shadow-sm">
                                        ♂
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-xs text-sky-100">
                                    {formatPatientAge(p.age, p.birthDate)}
                                  </span>
                                </div>
                                {p.risk && (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[10px] uppercase font-black ml-2 shadow-sm",
                                      riskConfig[p.risk].color,
                                    )}
                                  >
                                    {riskConfig[p.risk].label}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-sky-200 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Internado desde{" "}
                                {new Date(
                                  p.admissionRequest?.requestedAt ||
                                    p.arrivalTime,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              {p.mainComplaint && (
                                <div className="text-xs mt-1 border-t pt-2 border-sky-400/30 text-white">
                                  <span className="font-bold text-sky-200">
                                    Queixa:
                                  </span>{" "}
                                  {p.mainComplaint}
                                </div>
                              )}
                              {evoStatus && evoStatus.status !== "normal" && (
                                <div
                                  className={cn(
                                    "text-[10px] font-bold mt-1 px-2 py-1 rounded-md text-center border",
                                    evoStatus.status === "overdue"
                                      ? "bg-red-500/20 text-red-200 border-red-500/50"
                                      : "bg-orange-500/20 text-orange-200 border-orange-500/50",
                                  )}
                                >
                                  {evoStatus.status === "overdue"
                                    ? "Evolução Atrasada!"
                                    : "Evolução Próxima"}
                                </div>
                              )}
                            </div>
                          ) : bed.status === "available" && roomLayout.icon ? (
                            <div className="text-xs font-bold text-center flex flex-col items-center gap-1 text-white">
                              <Lock className="w-4 h-4 mb-1 text-sky-200" />
                              Leito restrito ao sexo{" "}
                              {roomLayout.name.includes("Feminina")
                                ? "Feminino"
                                : "Masculino"}
                            </div>
                          ) : null;

                          const bedCard = (
                            <div
                              key={bed.id}
                              className={cn(
                                "p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer hover:scale-105 shadow-sm relative",
                                bed.status === "occupied"
                                  ? "bg-[#006699]/10 border-[#006699]/30"
                                  : bed.status === "available"
                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                    : bed.status === "cleaning"
                                      ? "bg-orange-500/10 border-orange-500/30 animate-pulse"
                                      : "bg-yellow-500/10 border-yellow-500/30",
                              )}
                              onClick={() => setSelectedBedId(bed.id)}
                              draggable={bed.status === "occupied"}
                              onDragStart={(e) => {
                                e.dataTransfer.setData("sourceBedId", bed.id);
                              }}
                              onDragOver={(e) => {
                                if (bed.status === "available")
                                  e.preventDefault();
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                const sourceBedId =
                                  e.dataTransfer.getData("sourceBedId");
                                if (sourceBedId && sourceBedId !== bed.id) {
                                  transferPatient(sourceBedId, bed.id);
                                }
                              }}
                            >
                              {bed.status === "available" &&
                                roomLayout.icon && (
                                  <Lock
                                    className={cn(
                                      "absolute top-2 right-2 h-3 w-3 opacity-40",
                                      roomLayout.titleClass,
                                    )}
                                  />
                                )}
                              {p &&
                                evoStatus &&
                                evoStatus.status === "overdue" && (
                                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse ring-2 ring-background shadow-md"></div>
                                )}
                              <BedDouble
                                className={cn(
                                  "h-6 w-6",
                                  bed.status === "occupied"
                                    ? "text-[#006699]"
                                    : bed.status === "available"
                                      ? "text-emerald-500"
                                      : bed.status === "cleaning"
                                        ? "text-orange-500"
                                        : "text-yellow-500",
                                )}
                              />
                              <span className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1">
                                {bed.name}
                              </span>
                              {p && (
                                <span className="text-[9px] font-bold text-muted-foreground truncate w-full pointer-events-none flex justify-center items-center gap-1">
                                  {formatWords(p.name)}
                                  {["feminino", "f"].includes(
                                    p.gender?.toLowerCase() || "",
                                  ) && (
                                    <span className="text-pink-500 font-bold leading-none">
                                      ♀
                                    </span>
                                  )}
                                  {["masculino", "m"].includes(
                                    p.gender?.toLowerCase() || "",
                                  ) && (
                                    <span className="text-blue-500 font-bold leading-none">
                                      ♂
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>
                          );

                          return tooltipContent ? (
                            <ActionTooltip
                              key={bed.id}
                              label={tooltipContent}
                              side="top"
                            >
                              {bedCard}
                            </ActionTooltip>
                          ) : (
                            bedCard
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="all" className="mt-0 outline-none">
          {renderBedCards(filteredBeds)}
        </TabsContent>
        <TabsContent value="emergency" className="mt-0 outline-none">
          {renderBedCards(emergencyBeds)}
        </TabsContent>
        <TabsContent value="observation" className="mt-0 outline-none">
          {renderBedCards(observationBeds)}
        </TabsContent>
        <TabsContent value="queue" className="mt-0 outline-none">
          {admissionQueue.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground">
                  Fila Vazia
                </h3>
                <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  Nenhum paciente aguardando leito no momento.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admissionQueue.map((patient) => (
                <Card
                  key={patient.id}
                  className="glass-card-premium border-2 border-red-500/30 dark:border-red-500/40 bg-red-500/5 dark:bg-red-500/10 shadow-[0_10px_30px_rgba(239,68,68,0.1)] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-500 text-white shadow-sm flex items-center gap-1 animate-pulse">
                      <Clock3 className="h-3 w-3" /> Aguardando{" "}
                      {patient.admissionRequest?.bedType === "emergency"
                        ? "Emergência"
                        : "Observação"}
                    </span>
                  </div>

                  <CardHeader className="pb-3 p-5">
                    <div className="flex items-center gap-4 mt-2">
                      <div className="h-12 w-12 rounded-xl bg-white/50 dark:bg-slate-900/50 flex items-center justify-center text-red-500 border border-red-500/20 shadow-sm backdrop-blur-sm">
                        <UserRound className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-tight text-foreground">
                          {patient.name}
                        </h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 flex items-center gap-1">
                          <Activity className="h-3 w-3" />{" "}
                          {patient.mainComplaint || "Não informado"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="bg-white/40 dark:bg-slate-900/40 p-3 rounded-xl border border-white/50 dark:border-white/5 mb-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Solicitado por
                      </p>
                      <p className="text-xs font-black uppercase tracking-tight text-foreground">
                        {patient.admissionRequest?.doctor}
                      </p>
                    </div>
                    <Button
                      className="w-full h-12 rounded-xl font-black uppercase tracking-[0.15em] text-[11px] bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all border border-red-500"
                      onClick={() => setAllocatingPatientId(patient.id)}
                    >
                      <BedDouble className="h-4 w-4 mr-2" />
                      Alocar Leito
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="census" className="mt-0 outline-none">
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {riskStats.map((stat) => (
                <Card
                  key={stat.risk}
                  className={cn(
                    "glass-card border border-slate-200/40 dark:border-slate-800/40 rounded-xl shadow-lg cursor-pointer transition-all duration-[400ms] hover:scale-[1.01] active:scale-95 overflow-hidden group backdrop-blur-md",
                    selectedRisk === stat.risk
                      ? cn(
                          "ring-2 ring-offset-2 ring-offset-background brightness-110",
                          stat.activeColor,
                        )
                      : "grayscale-[0.2] hover:grayscale-0",
                  )}
                  onClick={() =>
                    setSelectedRisk(
                      selectedRisk === stat.risk ? null : stat.risk,
                    )
                  }
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg shadow-lg transition-transform group-hover:rotate-6",
                        stat.color,
                        stat.iconColor || "text-white",
                      )}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold text-muted-foreground tracking-tight truncate">
                        {stat.label}
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {
                          occupiedBedsWithPatients.filter(
                            (item) => item.patient.risk === stat.risk,
                          ).length
                        }
                      </p>
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

            <Card className="glass-card-premium border-none shadow-2xl overflow-hidden transition-all duration-500 rounded-xl">
              <CardHeader className="p-6 border-b border-white/20 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-sm font-black tracking-widest text-[#006699] dark:text-sky-400 uppercase">
                        Ocupação Atualizada
                      </CardTitle>
                      {selectedRisk && (
                        <Badge
                          className={cn(
                            "text-[9px] font-bold",
                            riskStats.find((r) => r.risk === selectedRisk)
                              ?.color,
                            riskStats.find((r) => r.risk === selectedRisk)
                              ?.iconColor || "text-white",
                          )}
                        >
                          Filtrando por:{" "}
                          {
                            riskStats.find((r) => r.risk === selectedRisk)
                              ?.label
                          }
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium mt-1">
                      Todos os pacientes atualmente em leitos
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-7 text-[10px] font-black uppercase tracking-widest",
                          advancedFilter === "sla"
                            ? "bg-red-500 text-white border-red-500 hover:bg-red-600 hover:text-white"
                            : "border-red-500/30 text-red-500",
                        )}
                        onClick={() =>
                          setAdvancedFilter(
                            advancedFilter === "sla" ? null : "sla",
                          )
                        }
                      >
                        🚨 SLA Estourado (
                        {
                          occupiedBedsWithPatients.filter(
                            (i) =>
                              getTimeInBed(i.patient.arrivalTime).hours >= 12,
                          ).length
                        }
                        )
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-7 text-[10px] font-black uppercase tracking-widest",
                          advancedFilter === "isolation"
                            ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:text-white"
                            : "border-orange-500/30 text-orange-500",
                        )}
                        onClick={() =>
                          setAdvancedFilter(
                            advancedFilter === "isolation" ? null : "isolation",
                          )
                        }
                      >
                        ⚠️ Isolamento (
                        {
                          occupiedBedsWithPatients.filter(
                            (i) =>
                              i.patient.isolation &&
                              i.patient.isolation.length > 0,
                          ).length
                        }
                        )
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-7 text-[10px] font-black uppercase tracking-widest",
                          advancedFilter === "discharge"
                            ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600 hover:text-white"
                            : "border-emerald-500/30 text-emerald-500",
                        )}
                        onClick={() =>
                          setAdvancedFilter(
                            advancedFilter === "discharge" ? null : "discharge",
                          )
                        }
                      >
                        ✅ Altas Hoje (
                        {
                          occupiedBedsWithPatients.filter((i) => {
                            if (!i.patient.dischargePrediction) return false;
                            return (
                              new Date(
                                i.patient.dischargePrediction,
                              ).toDateString() === new Date().toDateString()
                            );
                          }).length
                        }
                        )
                      </Button>
                      {(selectedRisk || advancedFilter) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800"
                          onClick={() => {
                            setSelectedRisk(null);
                            setAdvancedFilter(null);
                          }}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Limpar Filtros
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Badge
                      variant="outline"
                      className="font-black border-slate-200/60 dark:border-slate-800"
                    >
                      {selectedRisk ? "RESULTADOS" : "TOTAL OCUPADO"}:{" "}
                      {
                        occupiedBedsWithPatients.filter(
                          (item) =>
                            !selectedRisk || item.patient.risk === selectedRisk,
                        ).length
                      }{" "}
                      PACIENTES
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 sm:p-0 bg-transparent rounded-b-xl overflow-x-auto">
                <Table className="w-full">
                  <TableHeader className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                    <TableRow className="border-b border-white/20 dark:border-white/5 hover:bg-transparent">
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 w-[150px]">
                        Leito
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">
                        Paciente
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 w-[120px]">
                        Idade / SLA
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 w-[160px]">
                        Risco & Alta
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 w-[200px]">
                        Sinais Vitais
                      </TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 text-right w-[150px]">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {occupiedBedsWithPatients
                      .filter(
                        (item) =>
                          !selectedRisk || item.patient.risk === selectedRisk,
                      )
                      .filter((item) => {
                        if (advancedFilter === "sla")
                          return (
                            getTimeInBed(item.patient.arrivalTime).hours >= 12
                          );
                        if (advancedFilter === "isolation")
                          return (
                            item.patient.isolation &&
                            item.patient.isolation.length > 0
                          );
                        if (advancedFilter === "discharge")
                          return (
                            item.patient.dischargePrediction &&
                            new Date(
                              item.patient.dischargePrediction,
                            ).toDateString() === new Date().toDateString()
                          );
                        return true;
                      })
                      .sort((a, b) => {
                        const orderA = RISK_ORDER[a.patient.risk] ?? 99;
                        const orderB = RISK_ORDER[b.patient.risk] ?? 99;
                        if (orderA !== orderB) return orderA - orderB;
                        return (
                          new Date(a.patient.arrivalTime).getTime() -
                          new Date(b.patient.arrivalTime).getTime()
                        );
                      })
                      .map(({ bed, patient }) => (
                        <TableRow
                          key={bed.id}
                          className="border-b border-white/10 dark:border-slate-800/50 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors group"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 bg-white/40 dark:bg-slate-900/40 px-2.5 py-1 rounded-full border border-white/40 dark:border-slate-700/50 backdrop-blur-sm">
                                <div
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full shadow-[0_0_5px_currentColor]",
                                    patient.risk === "emergency"
                                      ? "bg-red-500 text-red-500 animate-pulse-slow"
                                      : patient.risk === "very-urgent"
                                        ? "bg-orange-500 text-orange-500 animate-pulse-slow"
                                        : patient.risk === "urgent"
                                          ? "bg-[#FFDE21] text-[#FFDE21] animate-pulse-slow"
                                          : patient.risk === "less-urgent"
                                            ? "bg-emerald-500 text-emerald-500"
                                            : "bg-blue-600 text-blue-600",
                                  )}
                                />
                                {bed.name} ({bed.ward})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-white/80 to-white/30 dark:from-slate-800/80 dark:to-slate-900/40 border border-white/60 dark:border-white/10 shadow-sm flex items-center justify-center font-black text-[9px] text-slate-700 dark:text-slate-300 relative">
                                {patient.ticket}
                                {patient.isolation &&
                                  patient.isolation.length > 0 && (
                                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                                      <Biohazard className="h-2 w-2 text-white" />
                                    </div>
                                  )}
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[13px] font-black text-foreground tracking-tight group-hover:text-[#006699] dark:group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                                  {formatWords(patient.name)}
                                  {patient.isolation?.includes("contact") && (
                                    <ActionTooltip label="Precaução de Contato">
                                      <span className="flex items-center">
                                        <ShieldAlert className="h-3 w-3 text-orange-500" />
                                      </span>
                                    </ActionTooltip>
                                  )}
                                  {patient.isolation?.includes("droplet") && (
                                    <ActionTooltip label="Gotículas">
                                      <span className="flex items-center">
                                        <Droplets className="h-3 w-3 text-blue-500" />
                                      </span>
                                    </ActionTooltip>
                                  )}
                                </p>
                                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                                  CPF: {patient.cpf || "***"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="text-[12px] font-bold text-slate-600 dark:text-slate-400 leading-none">
                                {patient.age} Anos
                              </span>
                              <div
                                className={cn(
                                  "flex items-center gap-1 text-[9px] font-black uppercase tracking-widest",
                                  getTimeInBed(patient.arrivalTime).color,
                                )}
                              >
                                <Clock className="h-2.5 w-2.5" />
                                {getTimeInBed(patient.arrivalTime).text}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col items-start gap-1">
                              <Badge
                                className={cn(
                                  "text-[9px] font-black px-2 py-0.5 shadow-sm border border-white/20",
                                  patient.risk === "emergency"
                                    ? "bg-red-500 hover:bg-red-600"
                                    : patient.risk === "very-urgent"
                                      ? "bg-orange-500 hover:bg-orange-600"
                                      : patient.risk === "urgent"
                                        ? "bg-[#FFDE21] text-black hover:bg-[#FFDE21]/90"
                                        : patient.risk === "less-urgent"
                                          ? "bg-emerald-500 hover:bg-emerald-600"
                                          : "bg-blue-600 hover:bg-blue-700",
                                )}
                              >
                                {patient.risk === "emergency"
                                  ? "Emergência"
                                  : patient.risk === "very-urgent"
                                    ? "Muito Urgente"
                                    : patient.risk === "urgent"
                                      ? "Urgente"
                                      : patient.risk === "less-urgent"
                                        ? "Pouco Urgente"
                                        : "Não Urgente"}
                              </Badge>
                              {patient.dischargePrediction ? (
                                <Badge
                                  variant="outline"
                                  className="text-[8px] font-black border-blue-500 text-blue-500 bg-blue-500/10 px-1.5 py-0 flex items-center gap-1 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updatePatient(patient.id, {
                                      dischargePrediction: undefined,
                                    });
                                  }}
                                >
                                  <CalendarClock className="h-2 w-2" /> ALTA:{" "}
                                  {new Date(
                                    patient.dischargePrediction,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </Badge>
                              ) : (
                                <button
                                  className="text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-1 mt-0.5"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updatePatient(patient.id, {
                                      dischargePrediction: new Date(
                                        Date.now() + 2 * 60 * 60 * 1000,
                                      ).toISOString(),
                                    });
                                  }}
                                >
                                  + Previsão de Alta
                                </button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-white/30 dark:bg-slate-900/50 px-2 py-1 rounded-lg border border-white/40 dark:border-white/5">
                                <HeartPulse className="h-3 w-3 text-red-500" />
                                <span className="text-[10px] font-black">
                                  {patient.fc || "--"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 bg-white/30 dark:bg-slate-900/50 px-2 py-1 rounded-lg border border-white/40 dark:border-white/5">
                                <Activity className="h-3 w-3 text-sky-500" />
                                <span className="text-[10px] font-black">
                                  {patient.pa || "--"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 bg-white/30 dark:bg-slate-900/50 px-2 py-1 rounded-lg border border-white/40 dark:border-white/5">
                                <Droplets className="h-3 w-3 text-emerald-500" />
                                <span className="text-[10px] font-black">
                                  {patient.spo2 ? patient.spo2 + "%" : "--"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2.5 text-[9px] font-black uppercase tracking-widest rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-[#006699] hover:text-white border-white/60 dark:border-white/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRecordPatientId(patient.id as any);
                                }}
                              >
                                <FileText className="h-3 w-3 mr-1.5" />
                                Prontuário
                              </Button>
                              {!patient.transferRequest && (
                                <ActionTooltip
                                  label="Registrar Transferência"
                                  align="end"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2 text-[9px] font-black uppercase tracking-widest rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-orange-500 hover:text-white border-orange-500/30 text-orange-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPatientForTransfer(patient);
                                      setTransferRequestForm({
                                        priority: "normal",
                                        reason: "",
                                      });
                                      setShowTransferModal(true);
                                    }}
                                  >
                                    <Ambulance className="h-3 w-3" />
                                  </Button>
                                </ActionTooltip>
                              )}
                              <ActionTooltip
                                label="Solicitar Insumos"
                                align="end"
                              >
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-lg bg-sky-500 hover:bg-sky-600 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPatientForPharmacy(patient);
                                    setShowPharmacyModal(true);
                                  }}
                                >
                                  <PackagePlus className="h-3.5 w-3.5" />
                                </Button>
                              </ActionTooltip>
                              <ActionTooltip
                                label="Timeline / Auditoria"
                                align="end"
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBedId(bed.id);
                                  }}
                                >
                                  <History className="h-3.5 w-3.5" />
                                </Button>
                              </ActionTooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}

                    {occupiedBedsWithPatients
                      .filter(
                        (item) =>
                          !selectedRisk || item.patient.risk === selectedRisk,
                      )
                      .filter((item) => {
                        if (advancedFilter === "sla")
                          return (
                            getTimeInBed(item.patient.arrivalTime).hours >= 12
                          );
                        if (advancedFilter === "isolation")
                          return (
                            item.patient.isolation &&
                            item.patient.isolation.length > 0
                          );
                        if (advancedFilter === "discharge")
                          return (
                            item.patient.dischargePrediction &&
                            new Date(
                              item.patient.dischargePrediction,
                            ).toDateString() === new Date().toDateString()
                          );
                        return true;
                      }).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center">
                              <BedDouble className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                              Nenhum paciente encontrado
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!selectedBedId}
        onOpenChange={(open) => !open && setSelectedBedId(null)}
      >
        {selectedBed && (
          <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-900/80 dark:to-slate-950/90 pointer-events-none" />

            <div className="relative z-10">
              <DialogHeader className="p-8 pb-5 border-b border-white/20 dark:border-white/5 flex-row items-center gap-5 space-y-0 text-left">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#006699]/20 to-[#006699]/5 dark:from-sky-400/20 dark:to-sky-400/5 flex items-center justify-center text-[#006699] dark:text-sky-400 shrink-0 border border-[#006699]/20 dark:border-sky-400/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md">
                  <BedDouble className="h-7 w-7 drop-shadow-[0_0_8px_rgba(0,102,153,0.5)] dark:drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tight leading-none text-foreground drop-shadow-sm">
                    {selectedBed.name}
                  </DialogTitle>
                  <DialogDescription className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80 mt-2 text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/40 dark:bg-slate-800/50 border border-white/50 dark:border-white/5">
                      {selectedBed.ward}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/40 dark:bg-slate-800/50 border border-white/50 dark:border-white/5">
                      {selectedBed.room}
                    </span>
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="grid gap-6 p-8 py-6">
                <Tabs defaultValue="status" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/30 dark:bg-slate-900/40 p-1.5 rounded-xl h-14 border border-white/50 dark:border-white/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-md">
                    <TabsTrigger
                      value="status"
                      className="rounded-lg text-[10px] font-black uppercase tracking-[0.15em] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#006699] data-[state=active]:to-[#004d73] dark:data-[state=active]:from-sky-500 dark:data-[state=active]:to-sky-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                    >
                      Status
                    </TabsTrigger>
                    <TabsTrigger
                      value="care"
                      className="rounded-lg text-[10px] font-black uppercase tracking-[0.15em] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#006699] data-[state=active]:to-[#004d73] dark:data-[state=active]:from-sky-500 dark:data-[state=active]:to-sky-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                    >
                      Cuidados
                    </TabsTrigger>
                    <TabsTrigger
                      value="meds"
                      className="rounded-lg text-[10px] font-black uppercase tracking-[0.15em] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#006699] data-[state=active]:to-[#004d73] dark:data-[state=active]:from-sky-500 dark:data-[state=active]:to-sky-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                    >
                      Prescrição
                    </TabsTrigger>
                    <TabsTrigger
                      value="audit"
                      className="rounded-lg text-[10px] font-black uppercase tracking-[0.15em] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#006699] data-[state=active]:to-[#004d73] dark:data-[state=active]:from-sky-500 dark:data-[state=active]:to-sky-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                    >
                      Auditoria
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="status"
                    className="space-y-4 outline-none overflow-y-auto h-[180px] pr-2 custom-scrollbar"
                  >
                    <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] backdrop-blur-sm">
                      <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#006699] dark:text-sky-400 mb-4 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Ocupação do Leito
                      </h4>
                      {role === "medico" ? (
                        <div className="w-full h-12 flex items-center justify-between px-4 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 shadow-sm font-bold text-foreground backdrop-blur-md">
                          <span>Status do Leito</span>
                          <Badge
                            className={cn(
                              "text-[10px] font-bold px-2.5 py-0.5 border-0",
                              statusConfig[selectedBed.status].color,
                            )}
                          >
                            {statusConfig[selectedBed.status].label}
                          </Badge>
                        </div>
                      ) : (
                        <Select
                          value={selectedBed.status}
                          onValueChange={(value) =>
                            handleStatusChange(value as BedStatus)
                          }
                        >
                          <SelectTrigger className="w-full h-12 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 shadow-sm font-bold text-foreground backdrop-blur-md hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border border-white/40 dark:border-white/10 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
                            <SelectItem
                              value="available"
                              className="font-bold text-emerald-600 dark:text-emerald-400"
                            >
                              Disponível
                            </SelectItem>
                            <SelectItem
                              value="occupied"
                              className="font-bold text-red-600 dark:text-red-400"
                            >
                              Ocupado
                            </SelectItem>
                            <SelectItem
                              value="maintenance"
                              className="font-bold text-yellow-600 dark:text-yellow-400"
                            >
                              Manutenção
                            </SelectItem>
                            <SelectItem
                              value="cleaning"
                              className="font-bold text-orange-600 dark:text-orange-400"
                            >
                              Higienização
                            </SelectItem>
                            <SelectItem
                              value="reserved"
                              className="font-bold text-blue-600 dark:text-blue-400"
                            >
                              Reservado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <p className="mt-4 text-[12px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        {statusConfig[selectedBed.status].description}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="care"
                    className="space-y-4 outline-none overflow-y-auto h-[180px] pr-2 custom-scrollbar"
                  >
                    <div className="space-y-3 pb-2">
                      {[
                        {
                          label: "Ronda Médica Realizada",
                          icon: UserRound,
                          color: "text-blue-500",
                        },
                        {
                          label: "Evolução de Enfermagem",
                          icon: Activity,
                          color: "text-emerald-500",
                        },
                        {
                          label: "Acesso Venoso (PVP) OK",
                          icon: Droplets,
                          color: "text-purple-500",
                        },
                        {
                          label: "Mudança de Decúbito",
                          icon: BedDouble,
                          color: "text-orange-500",
                        },
                        {
                          label: "Troca de Curativo",
                          icon: ShieldAlert,
                          color: "text-red-500",
                        },
                        {
                          label: "Controle de Diurese",
                          icon: Droplets,
                          color: "text-sky-400",
                        },
                        {
                          label: "Higiene Oral",
                          icon: Activity,
                          color: "text-teal-500",
                        },
                        {
                          label: "Administração de Medicação",
                          icon: PackagePlus,
                          color: "text-indigo-500",
                        },
                        {
                          label: "Verificação de Sinais Vitais",
                          icon: HeartPulse,
                          color: "text-rose-500",
                        },
                      ].map((care, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50/30 dark:bg-slate-900/20 border border-slate-200/40 dark:border-slate-800/20 group hover:border-[#006699]/30 dark:hover:border-sky-400/30 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "h-8 w-8 rounded-lg bg-white dark:bg-slate-950 flex items-center justify-center border border-slate-205 dark:border-slate-800 shadow-sm",
                              )}
                            >
                              <care.icon
                                className={cn("h-4 w-4", care.color)}
                              />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-tight text-foreground">
                              {care.label}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded-md border-slate-300 dark:border-slate-700 accent-[#006699] dark:accent-sky-500 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="meds"
                    className="space-y-4 outline-none overflow-y-auto h-[180px] pr-2 custom-scrollbar"
                  >
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 dark:border-blue-500/30">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Pill className="h-3.5 w-3.5 text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                              Soro em Curso
                            </span>
                          </div>
                          <Badge className="bg-blue-500 text-white text-[8px]">
                            80 ml/h
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-foreground">
                          Soro Fisiológico 0,9% 500ml + Dipirona 2g
                        </p>
                        <div className="mt-3 h-1.5 w-full bg-blue-100 dark:bg-blue-950 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                        <p className="mt-2 text-[9px] text-blue-600/70 dark:text-blue-400/70 font-bold uppercase tracking-tight text-right">
                          Previsão término: 14:30
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full h-10 rounded-xl border-dashed border-2 border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest hover:border-[#006699] dark:hover:border-sky-400 hover:text-[#006699] dark:hover:text-sky-400 transition-all text-muted-foreground bg-transparent"
                      >
                        + Adicionar Medicação
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="audit"
                    className="space-y-4 outline-none overflow-y-auto h-[180px] pr-2 custom-scrollbar"
                  >
                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                      {!selectedBed.bedHistory ||
                      selectedBed.bedHistory.length === 0 ? (
                        <div className="text-center py-6 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                          Nenhum histórico disponível
                        </div>
                      ) : (
                        selectedBed.bedHistory.map((record, i) => {
                          const patient = patients.find(
                            (p) => p.id === record.patientId,
                          );
                          return (
                            <div
                              key={i}
                              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                            >
                              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-sky-500 dark:bg-sky-400 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <History className="h-4 w-4" />
                              </div>
                              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-sm hover:scale-[1.02] transition-transform">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-500">
                                    {new Date(
                                      record.admittedAt,
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    {new Date(
                                      record.admittedAt,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                                  {patient
                                    ? patient.name
                                    : "Paciente Desconhecido"}
                                </p>
                                {record.dischargedAt && (
                                  <div className="mt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                      Saída/Alta
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-500">
                                      {new Date(
                                        record.dischargedAt,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-3 pt-5 border-t border-white/20 dark:border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#006699] dark:text-sky-400 px-1">
                    Atividades Recentes
                  </h4>
                  <div className="space-y-2">
                    <div className="p-4 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-white/5 text-[12px] flex justify-between items-center text-foreground backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Status alterado para{" "}
                        <span className="font-black text-[#006699] dark:text-sky-400">
                          {statusConfig[selectedBed.status].label}
                        </span>
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
                        Agora
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-wrap gap-3 p-8 pt-5 border-t border-white/20 dark:border-white/5 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md relative z-10">
                <Button
                  type="button"
                  className="flex-1 h-12 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-200 dark:to-white hover:from-slate-700 hover:to-slate-800 dark:hover:from-white dark:hover:to-slate-200 text-white dark:text-slate-950 shadow-lg border border-slate-700 dark:border-white/20 transition-all"
                  onClick={() => setSelectedBedId(null)}
                >
                  Concluir
                </Button>
                {selectedBed && selectedBed.status === "occupied" && (
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] border border-amber-400/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm transition-all"
                    onClick={() => {
                      setTransferringBedId(selectedBed.id);
                      setSelectedBedId(null);
                    }}
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" /> Trocar Leito
                  </Button>
                )}
                {selectedBed && (
                  <Button
                    variant="secondary"
                    className="flex-1 h-12 rounded-xl font-black uppercase tracking-[0.15em] text-[10px] bg-gradient-to-r from-[#006699] to-[#004d73] dark:from-sky-500 dark:to-sky-600 hover:brightness-110 text-white shadow-lg border border-white/20 transition-all"
                    onClick={() => {
                      const patient = getBedPatient(selectedBed);
                      if (patient) {
                        setRecordPatientId(patient.id as any);
                      } else {
                        toast.info("Leito não possui paciente associado.");
                      }
                    }}
                  >
                    Prontuário <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </DialogFooter>
            </div>
          </DialogContent>
        )}
      </Dialog>
      <Dialog
        open={!!editingVitalsPatient}
        onOpenChange={(open) => !open && setEditingVitalsPatient(null)}
      >
        <DialogContent className="sm:max-w-[420px] rounded-xl p-0 overflow-hidden border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl">
          {editingVitalsPatient && (
            <div>
              <div className="p-8 border-b border-slate-200/40 dark:border-slate-800/40 flex items-center gap-4 bg-slate-50/30 dark:bg-slate-950/30">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black uppercase tracking-tight text-foreground">
                    Atualizar Sinais
                  </DialogTitle>
                  <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {editingVitalsPatient.name.toUpperCase() ===
                    editingVitalsPatient.name
                      ? formatWords(editingVitalsPatient.name)
                      : editingVitalsPatient.name}{" "}
                    • Ticket: {editingVitalsPatient.ticket}
                  </DialogDescription>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-450 ml-1">
                      Frequência Card. (BPM)
                    </label>
                    <div className="relative">
                      <HeartPulse
                        className={cn(
                          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                          getStylesForRisk(
                            getParameterRisk("hr", vitalsForm.heartRate),
                          ).iconColor,
                        )}
                      />
                      <input
                        type="text"
                        placeholder="Ex: 88"
                        className={cn(
                          "w-full h-12 border rounded-xl pl-10 pr-4 text-sm font-black text-foreground placeholder:text-muted-foreground/50 focus:ring-2 transition-all outline-none",
                          getStylesForRisk(
                            getParameterRisk("hr", vitalsForm.heartRate),
                          ).borderColor,
                        )}
                        value={vitalsForm.heartRate}
                        onChange={(e) =>
                          setVitalsForm({
                            ...vitalsForm,
                            heartRate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-450 ml-1">
                      Pressão Art. (PA)
                    </label>
                    <div className="relative">
                      <Activity
                        className={cn(
                          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                          getStylesForRisk(
                            getParameterRisk("bp", vitalsForm.bloodPressure),
                          ).iconColor,
                        )}
                      />
                      <input
                        type="text"
                        placeholder="Ex: 120/80"
                        className={cn(
                          "w-full h-12 border rounded-xl pl-10 pr-4 text-sm font-black text-foreground placeholder:text-muted-foreground/50 focus:ring-2 transition-all outline-none",
                          getStylesForRisk(
                            getParameterRisk("bp", vitalsForm.bloodPressure),
                          ).borderColor,
                        )}
                        value={vitalsForm.bloodPressure}
                        onChange={(e) => {
                          const val = e.target.value;

                          // Permite apagar livremente
                          if (val.length < vitalsForm.bloodPressure.length) {
                            setVitalsForm({
                              ...vitalsForm,
                              bloodPressure: val,
                            });
                            return;
                          }

                          // Remove tudo que não for número
                          let v = val.replace(/\D/g, "");

                          // Aplica a máscara dinâmica
                          if (v.length === 3) {
                            v = v.replace(/(\d{2})(\d{1})/, "$1/$2"); // 128 -> 12/8
                          } else if (v.length === 4) {
                            v = v.replace(/(\d{3})(\d{1})/, "$1/$2"); // 1208 -> 120/8
                          } else if (v.length >= 5) {
                            v = v
                              .slice(0, 6)
                              .replace(/(\d{3})(\d{2,3})/, "$1/$2"); // 12080 -> 120/80
                          }

                          // Se o usuário digitou a barra manualmente no final, a gente respeita
                          if (val.endsWith("/") && !v.includes("/")) {
                            v = v + "/";
                          }

                          setVitalsForm({ ...vitalsForm, bloodPressure: v });
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-450 ml-1">
                      Saturação (SpO2 %)
                    </label>
                    <div className="relative">
                      <Droplets
                        className={cn(
                          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                          getStylesForRisk(
                            getParameterRisk("sat", vitalsForm.saturation),
                          ).iconColor,
                        )}
                      />
                      <input
                        type="text"
                        placeholder="Ex: 98"
                        className={cn(
                          "w-full h-12 border rounded-xl pl-10 pr-4 text-sm font-black text-foreground placeholder:text-muted-foreground/50 focus:ring-2 transition-all outline-none",
                          getStylesForRisk(
                            getParameterRisk("sat", vitalsForm.saturation),
                          ).borderColor,
                        )}
                        value={vitalsForm.saturation}
                        onChange={(e) =>
                          setVitalsForm({
                            ...vitalsForm,
                            saturation: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-450 ml-1">
                      Temperatura (°C)
                    </label>
                    <div className="relative">
                      <Thermometer
                        className={cn(
                          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                          getStylesForRisk(
                            getParameterRisk("temp", vitalsForm.temperature),
                          ).iconColor,
                        )}
                      />
                      <input
                        type="text"
                        placeholder="Ex: 36.5"
                        className={cn(
                          "w-full h-12 border rounded-xl pl-10 pr-4 text-sm font-black text-foreground placeholder:text-muted-foreground/50 focus:ring-2 transition-all outline-none",
                          getStylesForRisk(
                            getParameterRisk("temp", vitalsForm.temperature),
                          ).borderColor,
                        )}
                        value={vitalsForm.temperature}
                        onChange={(e) =>
                          setVitalsForm({
                            ...vitalsForm,
                            temperature: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {localRisk !== editingVitalsPatient.risk && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 mb-2"
                  >
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-300 leading-tight">
                      ATENÇÃO: Você alterou a classificação de risco.
                      <br />
                      <span className="opacity-70 font-medium tracking-tight">
                        Clique em "Confirmar e Salvar" para aplicar no
                        prontuário.
                      </span>
                    </p>
                  </motion.div>
                )}

                <div className="space-y-2 pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Classificação de Risco
                  </label>
                  <div className="flex gap-2">
                    {[
                      {
                        id: "emergency",
                        color: "bg-red-500 text-white",
                        label: "Emergência",
                      },
                      {
                        id: "very-urgent",
                        color: "bg-orange-500 text-white",
                        label: "Muito Urgente",
                      },
                      {
                        id: "urgent",
                        color: "bg-[#FFDE21] text-black",
                        label: "Urgente",
                      },
                      {
                        id: "less-urgent",
                        color: "bg-green-500 text-white",
                        label: "Pouco Urgente",
                      },
                      {
                        id: "not-urgent",
                        color: "bg-blue-600 text-white",
                        label: "Não Urgente",
                      },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setLocalRisk(r.id);
                        }}
                        className={cn(
                          "flex-1 h-8 rounded-lg text-[8px] font-black uppercase transition-all hover:scale-105 flex items-center justify-center px-0.5 leading-none text-center",
                          r.color,
                          localRisk === r.id
                            ? "ring-2 ring-offset-2 ring-slate-400 scale-105 shadow-lg"
                            : "opacity-45",
                        )}
                      >
                        {r.label}
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
                        risk: localRisk as Patient["risk"],
                        fc: vitalsForm.heartRate,
                        pa: vitalsForm.bloodPressure,
                        spo2: vitalsForm.saturation,
                        temperature: vitalsForm.temperature,
                      });
                      toast.success("Dados Sincronizados!", {
                        description: `Risco e sinais de ${editingVitalsPatient.name} atualizados com sucesso.`,
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
      <Dialog
        open={!!summaryPatient}
        onOpenChange={(open) => !open && setSummaryPatient(null)}
      >
        <DialogContent className="sm:max-w-[450px] rounded-xl p-0 overflow-hidden border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl">
          {summaryPatient && (
            <div className="relative">
              <div
                className={cn(
                  "h-2 w-full",
                  summaryPatient.risk === "emergency"
                    ? "bg-red-500"
                    : summaryPatient.risk === "very-urgent"
                      ? "bg-orange-500"
                      : summaryPatient.risk === "urgent"
                        ? "bg-[#FFDE21]"
                        : "bg-blue-500",
                )}
              />
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-12 w-12 rounded-xl bg-[#006699]/10 dark:bg-sky-450/10 flex items-center justify-center text-[#006699] dark:text-sky-400 shrink-0">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-foreground tracking-tight leading-none">
                      {formatWords(summaryPatient.name)}
                    </h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                      Ticket: {summaryPatient.ticket} • {summaryPatient.age}{" "}
                      Anos
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-200/40 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-950/20 rounded-lg">
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
                      Idade
                    </p>
                    <p className="text-sm font-black text-foreground">
                      {summaryPatient.age} ANOS
                    </p>
                  </div>
                  <div className="text-center border-x border-slate-200/40 dark:border-slate-800/40">
                    <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
                      Sexo
                    </p>
                    <p className="text-sm font-black text-foreground">
                      MASCULINO
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">
                      Peso
                    </p>
                    <p className="text-sm font-black text-foreground">82 KG</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[#006699]/10 dark:bg-sky-400/10 flex items-center justify-center shrink-0">
                      <Activity className="h-5 w-5 text-[#006699] dark:text-sky-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">
                        Queixa Principal
                      </p>
                      <p className="text-sm font-bold leading-tight text-foreground">
                        {summaryPatient.mainComplaint || "Não informada"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                        Alergias Conhecidas
                      </p>
                      <p className="text-sm font-black text-red-600 dark:text-red-400">
                        NENHUMA INFORMADA
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Pill className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-55 text-blue-550">
                        Observação Clínica
                      </p>
                      <p className="text-xs font-medium text-muted-foreground leading-relaxed italic">
                        Paciente aguardando resultados laboratoriais e
                        estabilização de sinais vitais para possível alta.
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
                    <Link
                      to={`/paciente/${summaryPatient.id}`}
                      state={{ from: "/leitos", label: "Leitos" }}
                      onClick={() => setSummaryPatient(null)}
                    >
                      Prontuário Completo
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!timelinePatient}
        onOpenChange={(open) => !open && setTimelinePatient(null)}
      >
        <DialogContent className="sm:max-w-[400px] rounded-xl p-0 overflow-hidden border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl">
          {timelinePatient && (
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Clock3 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-xl font-black uppercase tracking-tight leading-none text-foreground">
                    Jornada do Paciente
                  </DialogTitle>
                  <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Rastreamento de Fluxo Operacional
                  </DialogDescription>
                </div>
              </div>

              <div className="space-y-0 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {[
                  {
                    title: "Admissão / Recepção",
                    time: "08:00",
                    duration: "5 min",
                    status: "completed",
                    icon: UserRound,
                  },
                  {
                    title: "Classificação de Risco",
                    time: "08:05",
                    duration: "12 min",
                    status: "completed",
                    icon: AlertCircle,
                  },
                  {
                    title: "Consulta Médica",
                    time: "08:17",
                    duration: "45 min",
                    status: "completed",
                    icon: Activity,
                  },
                  {
                    title: "Alocação no Leito",
                    time: "09:02",
                    duration: "3h 15min",
                    status: "current",
                    icon: BedDouble,
                  },
                  {
                    title: "Alta / Transferência",
                    time: "--:--",
                    duration: "--",
                    status: "pending",
                    icon: CheckCircle2,
                  },
                ].map((step, idx) => (
                  <div key={idx} className="relative pl-12 pb-8 last:pb-0">
                    <div
                      className={cn(
                        "absolute left-0 h-9 w-9 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-sm z-10 transition-all",
                        step.status === "completed"
                          ? "bg-emerald-500 text-white"
                          : step.status === "current"
                            ? "bg-blue-500 text-white animate-pulse"
                            : "bg-slate-100 dark:bg-slate-900 text-muted-foreground border-slate-200 dark:border-slate-800",
                      )}
                    >
                      <step.icon className="h-4 w-4" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4
                          className={cn(
                            "text-xs font-black uppercase tracking-tight",
                            step.status === "pending"
                              ? "text-muted-foreground opacity-50"
                              : "text-foreground",
                          )}
                        >
                          {step.title}
                        </h4>
                        <p className="text-[10px] font-bold text-muted-foreground opacity-70">
                          {step.status === "pending"
                            ? "Aguardando estágio"
                            : `Duração: ${step.duration}`}
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
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                      Tempo Total UPA
                    </span>
                  </div>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400 tracking-tighter">
                    4h 17min
                  </span>
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

      <Dialog
        open={!!transferringBedId}
        onOpenChange={(open) => !open && setTransferringBedId(null)}
      >
        <DialogContent className="sm:max-w-[450px] rounded-xl p-0 overflow-hidden border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl">
          <div className="p-8 pb-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <ArrowRightLeft className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tight leading-none text-foreground">
                  Trocar Leito
                </DialogTitle>
                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1.5">
                  Selecione o leito de destino para o paciente
                </DialogDescription>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-11">
                  Paciente em Transferência
                </p>
                <p className="text-lg font-bold text-foreground">
                  {transferringBedId &&
                    getBedPatient(beds.find((b) => b.id === transferringBedId)!)
                      ?.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="bg-slate-100/40 dark:bg-slate-900/40 text-[10px] font-bold border-slate-200/60 dark:border-slate-800"
                  >
                    {beds.find((b) => b.id === transferringBedId)?.name}
                  </Badge>
                  <ArrowRightLeft className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                    Selecionar Destino
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Leitos Disponíveis
                </label>
                <Select value={targetBedId} onValueChange={setTargetBedId}>
                  <SelectTrigger className="w-full h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-sm font-bold text-foreground">
                    <SelectValue placeholder="Selecione o novo leito" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl max-h-[350px]">
                    {(() => {
                      if (beds.length === 0) {
                        return (
                          <div className="p-4 text-center text-xs text-muted-foreground italic">
                            Nenhum leito cadastrado.
                          </div>
                        );
                      }

                      const currentPatient = transferringBedId
                        ? getBedPatient(
                            beds.find((b) => b.id === transferringBedId)!,
                          )
                        : null;

                      return beds.map((bed) => {
                        const isAvailable = bed.status === "available";
                        const isCompatible = isAvailable
                          ? isBedCompatibleWithPatient(bed, currentPatient)
                          : false;
                        const room = bed.room || "";
                        const isFemale = room.toLowerCase().includes("fem");
                        const isMale = room.toLowerCase().includes("masc");

                        let statusConfig = { text: "", color: "" };
                        if (bed.status === "available")
                          statusConfig = {
                            text: "Livre",
                            color: "text-emerald-500 dark:text-emerald-400",
                          };
                        if (bed.status === "occupied")
                          statusConfig = {
                            text: "Ocupado",
                            color: "text-red-500 dark:text-red-400",
                          };
                        if (bed.status === "cleaning")
                          statusConfig = {
                            text: "Higienização",
                            color: "text-amber-500 dark:text-amber-400",
                          };
                        if (bed.status === "maintenance")
                          statusConfig = {
                            text: "Manutenção",
                            color: "text-slate-500 dark:text-slate-400",
                          };

                        return (
                          <SelectItem
                            key={bed.id}
                            value={bed.id}
                            disabled={!isAvailable}
                            className={cn(
                              "font-bold text-[11px] md:text-sm",
                              isAvailable && !isCompatible && "text-red-500",
                            )}
                          >
                            <span className="flex items-center gap-1.5">
                              {isFemale && (
                                <span
                                  className={cn(
                                    "font-black text-sm",
                                    isAvailable ? "text-red-500" : "opacity-50",
                                  )}
                                >
                                  ♀
                                </span>
                              )}
                              {isMale && (
                                <span
                                  className={cn(
                                    "font-black text-sm",
                                    isAvailable
                                      ? "text-blue-500"
                                      : "opacity-50",
                                  )}
                                >
                                  ♂
                                </span>
                              )}
                              <span>
                                {bed.name} -{" "}
                                <span className={statusConfig.color}>
                                  {statusConfig.text}
                                </span>
                              </span>
                              {isAvailable && !isCompatible && (
                                <span className="text-red-500 text-[9px] ml-1">
                                  ⛔
                                </span>
                              )}
                            </span>
                          </SelectItem>
                        );
                      });
                    })()}
                  </SelectContent>
                </Select>

                {/* Warning when incompatible bed is selected */}
                {(() => {
                  if (!targetBedId || !transferringBedId) return null;
                  const targetBed = beds.find((b) => b.id === targetBedId);
                  const currentPatient = getBedPatient(
                    beds.find((b) => b.id === transferringBedId)!,
                  );
                  if (
                    !targetBed ||
                    isBedCompatibleWithPatient(targetBed, currentPatient)
                  )
                    return null;

                  const room = targetBed.room || "";
                  const isFemale = room.toLowerCase().includes("fem");
                  const genderLabel = isFemale ? "Feminino" : "Masculino";

                  return (
                    <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                          ⚠️ Atenção — Leito Incompatível
                        </p>
                        <p className="text-[10px] text-red-500/80 mt-1">
                          Este leito é permitido somente ao sexo{" "}
                          <strong>{genderLabel}</strong>. Selecione outro leito
                          compatível.
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 flex gap-3 border-t border-slate-200/40 dark:border-slate-800/40 bg-slate-50/15 dark:bg-slate-950/20">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-transparent border-slate-200/60 dark:border-slate-800 text-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
              onClick={() => {
                if (targetBedId) {
                  setTargetBedId(""); // Limpar apenas a seleção
                } else {
                  setTransferringBedId(null); // Fechar o modal
                  setTargetBedId("");
                }
              }}
            >
              {targetBedId ? "Limpar Seleção" : "Fechar"}
            </Button>
            <Button
              className={cn(
                "flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg",
                (() => {
                  if (!targetBedId || !transferringBedId)
                    return "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20";
                  const tBed = beds.find((b) => b.id === targetBedId);
                  const tPatient = getBedPatient(
                    beds.find((b) => b.id === transferringBedId)!,
                  );
                  if (tBed && !isBedCompatibleWithPatient(tBed, tPatient))
                    return "bg-red-500/30 text-red-300 cursor-not-allowed shadow-none";
                  return "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20";
                })(),
              )}
              disabled={
                !targetBedId ||
                (() => {
                  if (!targetBedId || !transferringBedId) return true;
                  const tBed = beds.find((b) => b.id === targetBedId);
                  const tPatient = getBedPatient(
                    beds.find((b) => b.id === transferringBedId)!,
                  );
                  return tBed
                    ? !isBedCompatibleWithPatient(tBed, tPatient)
                    : false;
                })()
              }
              onClick={handleTransfer}
            >
              Confirmar Troca
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!allocatingPatientId}
        onOpenChange={(open) => !open && setAllocatingPatientId(null)}
      >
        <DialogContent className="sm:max-w-[600px] rounded-2xl p-0 overflow-hidden glass-card-premium shadow-2xl border-white/40 dark:border-white/10">
          <div className="p-6 border-b border-white/20 dark:border-white/5 flex items-center gap-4 bg-white/40 dark:bg-slate-900/40">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#006699] to-[#004d73] flex items-center justify-center text-white shadow-lg">
              <BedDouble className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-foreground">
                Selecionar Leito Livre
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">
                Escolha onde alocar o paciente
              </DialogDescription>
            </div>
          </div>
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
            {(() => {
              const allocatingPatient = allocatingPatientId
                ? patients.find((p) => p.id === allocatingPatientId)
                : null;
              const availableBeds = beds.filter(
                (b) => b.status === "available",
              );

              if (availableBeds.length === 0) {
                return (
                  <div className="text-center py-8 text-muted-foreground font-bold text-sm">
                    Nenhum leito disponível no momento.
                  </div>
                );
              }

              return availableBeds.map((bed) => {
                const isCompatible = isBedCompatibleWithPatient(
                  bed,
                  allocatingPatient,
                );
                const genderIcon = getBedGenderIcon(bed.room);

                if (!isCompatible) {
                  return (
                    <div
                      key={bed.id}
                      className="p-4 rounded-xl border-2 border-slate-200/50 dark:border-slate-800/50 opacity-60 cursor-not-allowed flex justify-between items-center bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                          <XCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-black uppercase tracking-tight text-slate-500 flex items-center gap-1">
                            {bed.name}{" "}
                            {genderIcon && (
                              <span className="text-xl leading-none">
                                {genderIcon}
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] font-bold text-rose-500 tracking-widest mt-0.5">
                            ⛔ INCOMPATÍVEL COM O SEXO DO PACIENTE
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={bed.id}
                    onClick={() => {
                      if (allocatingPatientId) {
                        assignPatient(bed.id, allocatingPatientId);
                        const patient = patients.find(
                          (p) => p.id === allocatingPatientId,
                        );
                        if (patient && patient.admissionRequest) {
                          updatePatient(allocatingPatientId, {
                            admissionRequest: {
                              ...patient.admissionRequest,
                              status: "allocated",
                            },
                            status: "attending",
                            sector: bed.name,
                          });
                        }
                        setAllocatingPatientId(null);
                        toast.success(`Paciente alocado no ${bed.name}`);
                      }
                    }}
                    className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer flex justify-between items-center transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-black uppercase tracking-tight text-foreground flex items-center gap-1">
                          {bed.name}{" "}
                          {genderIcon && (
                            <span className="text-xl leading-none text-emerald-600">
                              {genderIcon}
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest mt-0.5">
                          {bed.ward} • {bed.room}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isExamsModalOpen} onOpenChange={setIsExamsModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] h-[85vh] flex flex-col overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border-0 shadow-2xl p-6">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-blue-600" /> Solicitar
              Exames
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden min-h-0 pt-2">
            {patientForExams && (
              <ExamsModal
                patient={patientForExams}
                onClose={() => setIsExamsModalOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Pharmacy Satellite Modal */}
      {showPharmacyModal && patientForPharmacy && (
        <Dialog open={showPharmacyModal} onOpenChange={setShowPharmacyModal}>
          <DialogContent className="max-w-lg glass-card-premium border-border/50 rounded-[2rem] shadow-2xl p-0 overflow-hidden">
            <div className="p-6 border-b border-border/50 flex items-center justify-between bg-sky-500/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                  <PackagePlus className="h-5 w-5 text-sky-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-wide text-foreground">
                    Farmácia Satélite
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Solicitação Expressa •{" "}
                    {patientForPharmacy.sector || "Leito"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/50 dark:bg-slate-900/50 flex items-center justify-center text-sky-500 border border-sky-500/20 shrink-0">
                  <UserRound className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Para o Leito de
                  </p>
                  <p className="text-sm font-black text-foreground uppercase">
                    {patientForPharmacy.name}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                    Item Necessário
                  </label>
                  <input
                    type="text"
                    value={pharmacyRequest.item}
                    onChange={(e) =>
                      setPharmacyRequest({
                        ...pharmacyRequest,
                        item: e.target.value,
                      })
                    }
                    placeholder="Ex: Soro Fisiológico, Seringa 10ml..."
                    className="w-full h-12 bg-background/50 border border-border/50 rounded-xl px-4 text-sm focus:outline-none focus:border-sky-500/50 text-foreground"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="w-1/3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                      Qtd
                    </label>
                    <input
                      type="number"
                      value={pharmacyRequest.amount}
                      onChange={(e) =>
                        setPharmacyRequest({
                          ...pharmacyRequest,
                          amount: e.target.value,
                        })
                      }
                      className="w-full h-12 bg-background/50 border border-border/50 rounded-xl px-4 text-sm focus:outline-none focus:border-sky-500/50 text-foreground text-center"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                      Prioridade
                    </label>
                    <div className="flex bg-background/50 border border-border/50 rounded-xl p-1 h-12">
                      <button
                        onClick={() =>
                          setPharmacyRequest({
                            ...pharmacyRequest,
                            priority: "normal",
                          })
                        }
                        className={cn(
                          "flex-1 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all",
                          pharmacyRequest.priority === "normal"
                            ? "bg-muted text-foreground shadow"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() =>
                          setPharmacyRequest({
                            ...pharmacyRequest,
                            priority: "urgency",
                          })
                        }
                        className={cn(
                          "flex-1 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all",
                          pharmacyRequest.priority === "urgency"
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                            : "text-rose-500/50 hover:text-rose-500",
                        )}
                      >
                        Urgência
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border/50 bg-muted/10 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowPharmacyModal(false)}
                className="px-5 h-12 rounded-xl font-bold text-sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (!pharmacyRequest.item) {
                    toast.error("Por favor, informe o item necessário.");
                    return;
                  }
                  setShowPharmacyModal(false);
                  toast.success(
                    "Solicitação enviada para a Farmácia Satélite!",
                  );
                  setPharmacyRequest({
                    item: "",
                    amount: "1",
                    priority: "normal",
                  });
                }}
                className="px-6 h-12 rounded-xl font-black text-[11px] uppercase tracking-wider bg-sky-500 text-white hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/25 flex items-center gap-2"
              >
                Enviar Pedido <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Transfer Request Modal */}
      {showTransferModal && patientForTransfer && (
        <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
          <DialogContent className="max-w-lg bg-background dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-0 overflow-hidden">
            <div className="p-6 border-b border-border/50 flex items-center justify-between bg-orange-500/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                  <Ambulance className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-wide text-foreground">
                    Solicitar Transferência
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Regulação NIR / CROSS •{" "}
                    {patientForTransfer.sector || "Leito"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-orange-500 border border-orange-500/20 shrink-0 shadow-sm">
                  <UserRound className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Paciente
                  </p>
                  <p className="text-sm font-black text-foreground uppercase">
                    {patientForTransfer.name}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                    Motivo da Transferência
                  </label>
                  <input
                    type="text"
                    value={transferRequestForm.reason}
                    onChange={(e) =>
                      setTransferRequestForm({
                        ...transferRequestForm,
                        reason: e.target.value,
                      })
                    }
                    placeholder="Ex: Vaga de UTI, Especialidade, Agravamento..."
                    className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm focus:outline-none focus:border-orange-500/50 text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                    Prioridade
                  </label>
                  <div className="flex bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 h-12">
                    <button
                      onClick={() =>
                        setTransferRequestForm({
                          ...transferRequestForm,
                          priority: "normal",
                        })
                      }
                      className={cn(
                        "flex-1 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all",
                        transferRequestForm.priority === "normal"
                          ? "bg-white dark:bg-slate-800 text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() =>
                        setTransferRequestForm({
                          ...transferRequestForm,
                          priority: "urgent",
                        })
                      }
                      className={cn(
                        "flex-1 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all",
                        transferRequestForm.priority === "urgent"
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                          : "text-orange-500/50 hover:text-orange-500",
                      )}
                    >
                      Urgente
                    </button>
                    <button
                      onClick={() =>
                        setTransferRequestForm({
                          ...transferRequestForm,
                          priority: "emergency",
                        })
                      }
                      className={cn(
                        "flex-1 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all",
                        transferRequestForm.priority === "emergency"
                          ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                          : "text-red-500/50 hover:text-red-500",
                      )}
                    >
                      Emergência
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowTransferModal(false)}
                className="px-5 h-12 rounded-xl font-bold text-sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  requestTransfer(
                    patientForTransfer.id,
                    transferRequestForm.priority,
                    transferRequestForm.reason ||
                      "Solicitação via Censo Global",
                  );
                  setShowTransferModal(false);
                  setPatientForTransfer(null);
                }}
                className="px-6 h-12 rounded-xl font-black uppercase tracking-widest text-[11px] bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 flex items-center gap-2"
              >
                Solicitar Vaga <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Patient Record Modal (Quick View) */}
      <Dialog
        open={!!recordPatientId}
        onOpenChange={(open) => !open && setRecordPatientId(null)}
      >
        <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 overflow-y-auto glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem] flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-900/80 dark:to-slate-950/90 pointer-events-none -z-10" />
          <div className="p-4 sm:p-6 sticky top-0 z-50 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10 flex justify-between items-center shrink-0 shadow-sm rounded-t-[2rem]">
            <h2 className="text-xl font-black uppercase tracking-widest text-foreground flex items-center gap-3 drop-shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#006699]/20 to-[#006699]/5 dark:from-sky-400/20 dark:to-sky-400/5 flex items-center justify-center border border-[#006699]/20 dark:border-sky-400/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                <FileText className="h-5 w-5 text-[#006699] dark:text-sky-400 drop-shadow-[0_0_8px_rgba(0,102,153,0.5)] dark:drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
              </div>
              Prontuário Rápido
            </h2>
            {/* Ocultamos o botão X manual pois o DialogContent já traz o dele por padrão */}
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10">
            {recordPatientId && (
              <PatientRecord patientId={String(recordPatientId)} />
            )}
          </div>
        </DialogContent>
      </Dialog>
      {showBedManagementModal && (
        <BedManagementModal
          patient={
            getBedPatient(beds.find((b) => b.id === showBedManagementModal)!)!
          }
          bedName={
            beds.find((b) => b.id === showBedManagementModal)?.name || ""
          }
          bedRoom={
            beds.find((b) => b.id === showBedManagementModal)?.room || ""
          }
          bedSector={
            beds.find((b) => b.id === showBedManagementModal)?.ward || ""
          }
          bedStatus={
            beds.find((b) => b.id === showBedManagementModal)?.status || ""
          }
          onClose={() => setShowBedManagementModal(null)}
        />
      )}
    </motion.div>
  );
}
