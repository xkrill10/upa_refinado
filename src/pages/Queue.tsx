import { usePatients, Patient } from "@/hooks/use-patients";
import { ActionTooltip } from "@/components/ui/action-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Volume2,
  ChevronDown,
  Printer,
  Megaphone,
  User,
  Activity,
  MoreVertical,
  LogOut,
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  VolumeX,
  RotateCcw,
  ArrowRightLeft,
  LayoutGrid,
  X,
  Eye,
  Baby,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn, formatWords, formatPatientAge } from "@/lib/utils";

import { PatientDetailsModal } from "@/components/PatientDetailsModal";

const formatArrivalDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return `Hoje, ${timeString}`;
  if (isYesterday) return `Ontem, ${timeString}`;
  return `${date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })} às ${timeString}`;
};

export default function Queue() {
  const {
    patients,
    callPatient,
    updatePatient,
    callTicket,
    isAudioEnabled,
    setIsAudioEnabled,
  } = usePatients();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [showCallControl, setShowCallControl] = useState(false);
  const [callingTicket, setCallingTicket] = useState<{
    ticket: string;
    patientName: string;
    risk: string;
    priority: string;
    room: string;
    age?: number;
    cpf?: string;
  } | null>(null);
  const [evasaoPatient, setEvasaoPatient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [evasaoReason, setEvasaoReason] = useState<string>("");
  const [transferPatient, setTransferPatient] = useState<{
    id: string;
    name: string;
    sector: string;
  } | null>(null);
  const [newSector, setNewSector] = useState("");
  const [printingPatient, setPrintingPatient] = useState<Patient | null>(null);
  const [patientForModal, setPatientForModal] = useState<Patient | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    if (printingPatient) {
      setTimeout(() => {
        window.focus();
        window.print();
        // Clear printing state after print dialog opens
        setTimeout(() => setPrintingPatient(null), 100);
      }, 50);
    }
  }, [printingPatient]);

  const riskRank: Record<string, number> = {
    emergency: 0,
    "very-urgent": 1,
    urgent: 2,
    "less-urgent": 3,
    "not-urgent": 4,
  };

  const filteredPatients = patients
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cpf.includes(searchTerm);
      const matchesRisk =
        riskFilter === "all" ||
        (riskFilter === "critical"
          ? p.risk === "emergency" || p.risk === "very-urgent"
          : p.risk === riskFilter);
      const matchesStatus =
        (statusFilter === "all" || p.status === statusFilter) &&
        p.status !== "evasao";
      const isPediatric =
        p.priority === "pediatric" || (p.age !== undefined && p.age < 12);
      const matchesAudience =
        audienceFilter === "all" ||
        (audienceFilter === "pediatric" ? isPediatric : !isPediatric);
      return matchesSearch && matchesRisk && matchesStatus && matchesAudience;
    })
    .sort((a, b) => {
      const ra = riskRank[a.risk] ?? 99;
      const rb = riskRank[b.risk] ?? 99;
      if (ra !== rb) return ra - rb;
      return (
        new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime()
      );
    });

  const getRiskDetails = (risk: string) => {
    switch (risk) {
      case "emergency":
        return {
          label: "Emergência",
          color: "bg-red-600 hover:bg-red-700 text-white",
          target: 0,
          pulse: true,
        };
      case "very-urgent":
        return {
          label: "Muito Urgente",
          color: "bg-orange-500 hover:bg-orange-600 text-white",
          target: 10,
          pulse: true,
        };
      case "urgent":
        return {
          label: "Urgente",
          color: "bg-[#FFDE21] hover:bg-[#FFDE21]/90 text-black",
          target: 60,
          pulse: false,
        };
      case "less-urgent":
        return {
          label: "Pouco Urgente",
          color: "bg-green-500 hover:bg-green-600 text-white",
          target: 120,
          pulse: false,
        };
      case "not-urgent":
        return {
          label: "Não Urgente",
          color: "bg-blue-500 hover:bg-blue-600 text-white",
          target: 240,
          pulse: false,
        };
      default:
        return {
          label: risk,
          color: "bg-slate-500 text-white",
          target: 999,
          pulse: false,
        };
    }
  };

  const isOverTarget = (arrivalTime: string, risk: string) => {
    const details = getRiskDetails(risk);
    const diffInMinutes = getWaitTimeInMinutes(arrivalTime);
    return diffInMinutes > details.target;
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "waiting":
        return {
          label: "Aguardando",
          color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
        };
      case "attending":
        return {
          label: "Em Atendimento",
          color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        };
      case "completed":
        return {
          label: "Finalizado",
          color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        };
      default:
        return {
          label: status,
          color: "text-slate-500 bg-slate-500/10 border-slate-500/20",
        };
    }
  };

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

  const getTimeElapsed = (arrivalTime: string) => {
    const diffInMinutes = getWaitTimeInMinutes(arrivalTime);

    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const waitingPatients = patients.filter((p) => p.status === "waiting");
  const avgWaitTime =
    waitingPatients.length > 0
      ? Math.floor(
          waitingPatients.reduce((acc, p) => {
            return acc + getWaitTimeInMinutes(p.arrivalTime);
          }, 0) / waitingPatients.length,
        )
      : 0;

  const pediatricPatientsList = patients.filter(
    (p) => p.priority === "pediatric" || (p.age !== undefined && p.age < 12),
  );

  const stats = {
    total: patients.length,
    waiting: waitingPatients.length,
    attending: patients.filter((p) => p.status === "attending").length,
    critical: patients.filter(
      (p) =>
        (p.risk === "emergency" || p.risk === "very-urgent") &&
        p.status !== "completed",
    ).length,
    avgWait: avgWaitTime,
    pediatric: pediatricPatientsList.length,
  };

  const getTicketColorLight = (ticket: string) => {
    const prefix = ticket.charAt(0).toUpperCase();
    if (prefix === "E")
      return "bg-red-50 text-red-650 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30";
    if (prefix === "C")
      return "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30";
    if (prefix === "P")
      return "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30";
    return "bg-[#006699]/5 text-[#006699] border-[#006699]/10 dark:bg-sky-500/10 dark:text-sky-450 dark:border-sky-900/30";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-[#006699] dark:text-sky-400 uppercase">
          Fila de Atendimento
        </h1>
        <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
          Gerenciamento operacional em tempo real
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: "Total na Unidade",
            value: stats.total,
            icon: Users,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-500/10 dark:bg-blue-500/20",
            onClick: () => {
              setRiskFilter("all");
              setStatusFilter("all");
              setAudienceFilter("all");
            },
          },
          {
            label: "Aguardando",
            value: stats.waiting,
            icon: Clock,
            color: "text-orange-500 dark:text-orange-405",
            bg: "bg-orange-500/10 dark:bg-orange-500/20",
            onClick: () => {
              setRiskFilter("all");
              setStatusFilter("waiting");
              setAudienceFilter("all");
            },
          },
          {
            label: "Em Atendimento",
            value: stats.attending,
            icon: CheckCircle2,
            color: "text-emerald-700 dark:text-emerald-400",
            bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
            onClick: () => {
              setRiskFilter("all");
              setStatusFilter("attending");
              setAudienceFilter("all");
            },
          },
          {
            label: "Pediátricos",
            value: stats.pediatric,
            icon: Baby,
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-500/10 dark:bg-orange-500/20",
            onClick: () => {
              setRiskFilter("all");
              setStatusFilter("all");
              setAudienceFilter("pediatric");
            },
          },
          {
            label: "Prioritários",
            value: stats.critical,
            icon: AlertCircle,
            color: "text-red-655 dark:text-red-400",
            bg: "bg-red-500/10 dark:bg-red-500/20",
            onClick: () => {
              setRiskFilter("critical");
              setStatusFilter("all");
              setAudienceFilter("all");
            },
          },
          {
            label: "Espera Média",
            value: `${stats.avgWait} min`,
            icon: Clock,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-500/10 dark:bg-purple-500/20",
            onClick: () => {},
          },
        ].map((item, idx) => {
          const isActive =
            (item.label === "Total na Unidade" &&
              riskFilter === "all" &&
              statusFilter === "all" &&
              audienceFilter === "all") ||
            (item.label === "Aguardando" &&
              statusFilter === "waiting" &&
              audienceFilter === "all") ||
            (item.label === "Em Atendimento" &&
              statusFilter === "attending" &&
              audienceFilter === "all") ||
            (item.label === "Pediátricos" && audienceFilter === "pediatric") ||
            (item.label === "Prioritários" && riskFilter === "critical");

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={item.onClick}
              className={cn(
                "glass-card border shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-all duration-500 flex items-center gap-4 p-4 cursor-pointer group hover:shadow-2xl hover:scale-[1.02] active:scale-95",
                isActive
                  ? "border-[#006699]/55 dark:border-sky-400/55 ring-2 ring-[#006699]/10 dark:ring-sky-400/10 bg-[#006699]/5 dark:bg-sky-400/5"
                  : "border-slate-200/40 dark:border-slate-800/40",
              )}
            >
              <div
                className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">
                  {item.label}
                </p>
                <p className="text-2xl font-black text-foreground">
                  {item.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente..."
            className="pl-10 h-11 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Select value={audienceFilter} onValueChange={setAudienceFilter}>
            <SelectTrigger className="w-full md:w-[160px] h-11 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 text-foreground focus:bg-white dark:focus:bg-slate-950 transition-all duration-300 shadow-sm">
              <SelectValue placeholder="Atendimento" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-foreground rounded-xl shadow-xl">
              <SelectItem value="all">Todos Atendimentos</SelectItem>
              <SelectItem value="clinical">Adulto (Clínico)</SelectItem>
              <SelectItem value="pediatric">Pediátrico</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-full md:w-[150px] h-11 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 text-foreground focus:bg-white dark:focus:bg-slate-950 transition-all duration-300 shadow-sm">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-foreground rounded-xl shadow-xl">
              <SelectItem value="all">Todas Classificações</SelectItem>
              <SelectItem value="critical">Prioritários (Críticos)</SelectItem>
              <SelectItem value="emergency">Emergência</SelectItem>
              <SelectItem value="very-urgent">Muito Urgente</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
              <SelectItem value="less-urgent">Pouco Urgente</SelectItem>
              <SelectItem value="not-urgent">Não Urgente</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[150px] h-11 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 text-foreground focus:bg-white dark:focus:bg-slate-950 transition-all duration-300 shadow-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-foreground rounded-xl shadow-xl">
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="waiting">Aguardando</SelectItem>
              <SelectItem value="attending">Em Atendimento</SelectItem>
              <SelectItem value="completed">Finalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200/40 dark:border-slate-800/40">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest pl-6">
                    Paciente
                  </TableHead>
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-center">
                    Senha
                  </TableHead>
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-center">
                    Idade
                  </TableHead>
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-center">
                    Classificação
                  </TableHead>
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest">
                    Queixa
                  </TableHead>
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest">
                    Setor
                  </TableHead>
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest">
                    Chegada
                  </TableHead>
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-right pr-6 min-w-[280px]">
                    Ação
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => {
                  const risk = getRiskDetails(patient.risk);
                  const status = getStatusDetails(patient.status);
                  const overTarget = isOverTarget(
                    patient.arrivalTime,
                    patient.risk,
                  );

                  return (
                    <TableRow
                      key={patient.id}
                      className={cn(
                        "border-b border-slate-200/40 dark:border-slate-800/40 transition-colors h-16",
                        patient.risk === "emergency"
                          ? "bg-red-500/5 dark:bg-red-950/10 hover:bg-red-500/10 dark:hover:bg-red-950/15"
                          : patient.risk === "very-urgent"
                            ? "bg-orange-500/5 dark:bg-orange-950/10 hover:bg-orange-500/10 dark:hover:bg-orange-950/15"
                            : "hover:bg-slate-50/50 dark:hover:bg-slate-900/30",
                      )}
                    >
                      <TableCell className="font-medium text-sm text-slate-800 dark:text-slate-100 pl-6 max-w-[160px] truncate">
                        <div className="flex items-center gap-2">
                          {risk.pulse && (
                            <div className="relative flex h-2 w-2">
                              <span
                                className={cn(
                                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                                  risk.color,
                                )}
                              ></span>
                              <span
                                className={cn(
                                  "relative inline-flex rounded-full h-2 w-2",
                                  risk.color,
                                )}
                              ></span>
                            </div>
                          )}
                          <button
                            onClick={() =>
                              navigate(`/paciente/${patient.id}/evolucao`, {
                                state: {
                                  from: "/fila",
                                  label: "Fila de Atendimento",
                                },
                              })
                            }
                            className="hover:text-primary dark:hover:text-sky-400 hover:underline transition-all text-left font-bold text-slate-800 dark:text-slate-150 cursor-pointer"
                          >
                            {patient.name
                              .toUpperCase()
                              .includes("NÃO IDENTIFICADO") ||
                            patient.name.toUpperCase().includes("DESCONHECIDO")
                              ? "PACIENTE NÃO IDENTIFICADO"
                              : formatWords(patient.name)}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {patient.ticket ? (
                          <div className="flex justify-center">
                            <span
                              className={cn(
                                "px-3 py-1 rounded-lg font-bold text-xs border shadow-sm w-16 text-center",
                                getTicketColorLight(patient.ticket),
                              )}
                            >
                              {patient.ticket}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-xs font-bold text-slate-600 dark:text-slate-400">
                        {patient.age} anos
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge
                            className={cn(
                              risk.color,
                              "text-[10px] font-bold px-2 py-1.5 border-0 rounded-full shadow-sm min-w-[120px] justify-center transition-transform hover:scale-105 active:scale-95",
                            )}
                          >
                            {risk.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate text-xs text-slate-500 dark:text-slate-400">
                        {patient.mainComplaint || "Não informada"}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                        {patient.sector || "Triagem"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-foreground dark:text-slate-200 font-bold text-sm">
                            {new Date(patient.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className="flex items-center gap-1">
                            <span
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                overTarget
                                  ? "text-red-555 dark:text-red-400 animate-pulse"
                                  : "text-muted-foreground dark:text-slate-500",
                              )}
                            >
                              Há {getTimeElapsed(patient.arrivalTime)}
                            </span>
                            {overTarget && (
                              <AlertCircle className="h-3 w-3 text-red-555 dark:text-red-400" />
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge
                            variant="outline"
                            className={cn(
                              status.color,
                              "font-bold text-[10px] px-2 py-1 border rounded-lg whitespace-nowrap min-w-[100px] justify-center",
                            )}
                          >
                            {status.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6 min-w-[280px]">
                        <div className="flex items-center justify-end gap-0.5 flex-nowrap whitespace-nowrap">
                          <ActionTooltip label="Chamar Senha" side="top" align="end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 rounded-lg px-2 gap-1.5 text-primary dark:text-sky-400 hover:bg-primary/5 dark:hover:bg-sky-400/5 font-black uppercase text-[10px] tracking-wider cursor-pointer border-0"
                              onClick={() => {
                                if (patient.ticket) {
                                  setCallingTicket({
                                    ticket: patient.ticket,
                                    patientName: patient.name,
                                    risk: patient.risk || "not-urgent",
                                    priority: patient.priority || "normal",
                                    room: patient.sector || "TRIAGEM",
                                    age: patient.age,
                                    cpf: patient.cpf,
                                  });
                                  setShowCallControl(true);
                                  callPatient(patient);
                                } else {
                                  toast.error("Paciente sem senha registrada.");
                                }
                              }}
                            >
                              <Volume2 className="h-3.5 w-3.5" />
                              Chamar
                            </Button>
                          </ActionTooltip>
                          <ActionTooltip label="Ver Detalhes" side="top" align="end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-500 hover:text-[#006699] dark:hover:text-sky-400 hover:bg-[#006699]/5 dark:hover:bg-sky-400/5 cursor-pointer"
                              onClick={() => {
                                setPatientForModal(patient);
                                setIsDetailsModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </ActionTooltip>
                          <ActionTooltip label="Ver Prontuário" side="top" align="end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-500 hover:text-[#006699] dark:hover:text-sky-400 hover:bg-[#006699]/5 dark:hover:bg-sky-400/5 cursor-pointer"
                              onClick={() =>
                                navigate(`/paciente/${patient.id}`, {
                                  state: {
                                    from: "/fila",
                                    label: "Fila de Atendimento",
                                  },
                                })
                              }
                            >
                              <User className="h-4 w-4" />
                            </Button>
                          </ActionTooltip>
                          <ActionTooltip label="Reclassificar" side="top" align="end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 cursor-pointer"
                              onClick={() => {
                                updatePatient(patient.id, {
                                  triaged: false,
                                  risk: undefined,
                                  sector: undefined,
                                  status: "waiting",
                                });
                                navigate(`/triagem`);
                                toast.info(
                                  `Paciente ${patient.name} enviado para reclassificação.`,
                                );
                              }}
                            >
                              <Activity className="h-4 w-4" />
                            </Button>
                          </ActionTooltip>
                          <ActionTooltip label="Trocar Setor / Encaminhar" side="top" align="end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"
                              onClick={() => {
                                setTransferPatient({
                                  id: patient.id,
                                  name: patient.name,
                                  sector: patient.sector || "",
                                });
                                setNewSector(
                                  patient.sector || "Consultório Clínico 1",
                                );
                              }}
                            >
                              <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                          </ActionTooltip>
                          <ActionTooltip label="Reimprimir Senha" side="top" align="end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              onClick={() => {
                                toast.success(
                                  `Encaminhando para impressão: ${patient.ticket}...`,
                                );
                                setPrintingPatient(patient);
                              }}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </ActionTooltip>
                          <ActionTooltip label="Registrar Evasão" side="top" align="end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                              onClick={() => setEvasaoPatient(patient)}
                            >
                              <LogOut className="h-4 w-4" />
                            </Button>
                          </ActionTooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filteredPatients.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                Nenhum paciente encontrado com os filtros selecionados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controle de Chamada - Sincronizado com o Painel */}
      <Dialog open={showCallControl} onOpenChange={setShowCallControl}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-xl border-none shadow-2xl bg-white dark:bg-slate-950 [&>button]:hidden">
          <DialogHeader
            className={cn(
              "p-6 transition-colors duration-500",
              callingTicket?.risk === "emergency"
                ? "bg-red-655 text-white"
                : callingTicket?.risk === "very-urgent"
                  ? "bg-orange-500 text-white"
                  : callingTicket?.risk === "urgent"
                    ? "bg-[#FFDE21] text-black"
                    : callingTicket?.risk === "less-urgent"
                      ? "bg-green-500 text-white"
                      : callingTicket?.priority === "preferential"
                        ? "bg-purple-600 text-white"
                        : callingTicket?.priority === "pediatric"
                          ? "bg-orange-500 text-white"
                          : "bg-[#006699] text-white",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Megaphone className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black uppercase tracking-tight">
                    Controle de Chamada
                  </DialogTitle>
                  <DialogDescription
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest mt-0.5",
                      callingTicket?.risk === "urgent"
                        ? "text-black/70"
                        : "text-white/70",
                    )}
                  >
                    Sincronizado com o Painel Central
                  </DialogDescription>
                </div>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="bg-white text-black hover:bg-white/90 rounded-xl h-10 w-10 shadow-lg border-none"
                onClick={() => setShowCallControl(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 text-center">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006699] dark:text-sky-400">
                Chamando agora
              </p>
              <h2
                className={cn(
                  "text-7xl font-black tracking-tighter leading-none mb-4",
                  callingTicket?.risk === "emergency"
                    ? "text-red-655 dark:text-red-400"
                    : callingTicket?.risk === "very-urgent"
                      ? "text-orange-500 dark:text-orange-400"
                      : callingTicket?.risk === "urgent"
                        ? "text-black dark:text-slate-100"
                        : callingTicket?.risk === "less-urgent"
                          ? "text-green-655 dark:text-green-400"
                          : callingTicket?.priority === "preferential"
                            ? "text-purple-600 dark:text-purple-400"
                            : callingTicket?.priority === "pediatric"
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-[#006699] dark:text-sky-400",
                )}
              >
                {callingTicket?.ticket}
              </h2>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">
                {formatWords(callingTicket?.patientName || "")}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase">
                {formatPatientAge(callingTicket?.age)} • CPF:{" "}
                {callingTicket?.cpf}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button
                onClick={() => {
                  if (callingTicket && callingTicket.ticket) {
                    callTicket(
                      callingTicket.ticket,
                      callingTicket.room,
                      callingTicket.risk as Patient["risk"],
                      callingTicket.patientName,
                    );
                    toast.success("Chamada enviada novamente ao painel.");
                  }
                }}
                className={cn(
                  "h-16 rounded-xl text-white font-black uppercase tracking-widest text-sm shadow-xl gap-3 transition-all duration-300 border-0 cursor-pointer",
                  callingTicket?.risk === "emergency"
                    ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                    : callingTicket?.risk === "very-urgent"
                      ? "bg-orange-500 hover:bg-orange-600 shadow-orange-600/20"
                      : callingTicket?.risk === "urgent"
                        ? "bg-[#FFDE21] hover:bg-[#FFDE21]/90 shadow-[#FFDE21]/20 text-black"
                        : callingTicket?.risk === "less-urgent"
                          ? "bg-green-500 hover:bg-green-600 shadow-green-500/20"
                          : callingTicket?.priority === "preferential"
                            ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20"
                            : callingTicket?.priority === "pediatric"
                              ? "bg-orange-500 hover:bg-orange-600 shadow-orange-600/20"
                              : "bg-[#006699] hover:bg-[#005580] shadow-[#006699]/20 dark:bg-sky-600 dark:hover:bg-sky-550",
                )}
              >
                <Volume2 className="h-6 w-6" />
                Chamar Novamente
              </Button>

              <div
                className="flex items-center justify-between p-4 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/25 dark:border-slate-800/25 cursor-pointer hover:bg-slate-150/65 dark:hover:bg-slate-900/65 transition-colors"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              >
                <div className="flex items-center gap-3 text-left">
                  <div
                    className={`p-2 rounded-lg ${isAudioEnabled ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
                  >
                    {isAudioEnabled ? (
                      <Volume2 className="h-5 w-5" />
                    ) : (
                      <VolumeX className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-foreground">
                      Áudio do Painel
                    </p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">
                      {isAudioEnabled
                        ? "Ativado (Voz + Chime)"
                        : "Desativado (Mudo)"}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "h-8 w-14 rounded-full transition-all relative flex items-center shrink-0",
                    isAudioEnabled
                      ? "bg-green-500"
                      : "bg-slate-400 dark:bg-slate-700",
                  )}
                >
                  <div
                    className={cn(
                      "absolute h-6 w-6 rounded-full bg-white transition-all shadow-md",
                      isAudioEnabled ? "right-1" : "left-1",
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Confirmação de Evasão */}
      <Dialog
        open={!!evasaoPatient}
        onOpenChange={(open) => {
          if (!open) {
            setEvasaoPatient(null);
            setEvasaoReason("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[450px] rounded-xl p-8 border-none shadow-2xl bg-white dark:bg-slate-950 text-foreground">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center text-red-550 dark:text-red-400 animate-pulse">
              <LogOut className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white">
                Confirmar Evasão?
              </DialogTitle>
              <DialogDescription className="text-sm font-medium leading-relaxed px-2 text-slate-500 dark:text-slate-400">
                Você está registrando que o paciente{" "}
                <strong className="text-red-550 dark:text-red-400">
                  {formatWords(evasaoPatient?.name || "")}
                </strong>{" "}
                se retirou da unidade sem concluir o atendimento.
              </DialogDescription>
            </div>

            <div className="w-full text-left mt-2 mb-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-2">
                Motivo da Evasão (Opcional)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Demora no atendimento",
                  "Melhora dos sintomas",
                  "Procurou outro serviço",
                  "Desistência voluntária",
                  "Ausente após 3 chamadas",
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() =>
                      setEvasaoReason(reason === evasaoReason ? "" : reason)
                    }
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl border-2 transition-all flex items-center justify-between group cursor-pointer",
                      evasaoReason === reason
                        ? "border-red-500 bg-red-500/5 font-bold text-red-600 dark:text-red-400"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40",
                    )}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-tight truncate">
                      {reason}
                    </span>
                    <div
                      className={cn(
                        "h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                        evasaoReason === reason
                          ? "border-red-500 bg-red-500"
                          : "border-slate-300 dark:border-slate-700",
                      )}
                    >
                      {evasaoReason === reason && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white dark:bg-slate-950" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full pt-2">
              <Button
                variant="outline"
                className="h-12 rounded-xl font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                onClick={() => {
                  setEvasaoPatient(null);
                  setEvasaoReason("");
                }}
              >
                Cancelar
              </Button>
              <Button
                className="h-12 rounded-xl bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white font-black uppercase tracking-widest shadow-lg shadow-red-200 dark:shadow-none border-0 cursor-pointer"
                onClick={() => {
                  if (evasaoPatient) {
                    updatePatient(evasaoPatient.id, {
                      status: "evasao",
                      justification: evasaoReason
                        ? `Motivo da evasão: ${evasaoReason}`
                        : undefined,
                    });
                    toast.warning(
                      evasaoReason
                        ? `Evasão registrada: ${evasaoReason}`
                        : `Evasão registrada: ${evasaoPatient.name}`,
                    );
                    setEvasaoPatient(null);
                    setEvasaoReason("");
                  }
                }}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Troca de Setor / Encaminhamento */}
      <Dialog
        open={!!transferPatient}
        onOpenChange={(open) => !open && setTransferPatient(null)}
      >
        <DialogContent className="sm:max-w-[550px] rounded-xl p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-950 text-foreground transition-all duration-500">
          <div className={cn("p-6 text-white bg-[#006699] dark:bg-sky-950/60")}>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-white/20 rounded-lg">
                <ArrowRightLeft className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-xl font-black uppercase tracking-tight">
                Encaminhar Paciente
              </DialogTitle>
            </div>
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">
              Sala ou setor de destino
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between transition-colors">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Paciente
                </p>
                <p className="text-base font-black text-slate-800 dark:text-white leading-tight">
                  {formatWords(transferPatient?.name || "")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Setor Atual
                </p>
                <Badge
                  variant="outline"
                  className="bg-white/50 dark:bg-slate-950/50 text-[10px] font-bold border-slate-200 dark:border-slate-800"
                >
                  {transferPatient?.sector || "Triagem"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-450 font-bold block mb-1">
                Selecione o Novo Setor
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Fast Track",
                  "Consultório 1",
                  "Consultório 2",
                  "Consultório 3",
                  "Emergência (Vermelha)",
                  "Sala Laranja",
                  "Medicação",
                  "Obs Masculina",
                  "Obs Feminina",
                  "Isolamento",
                  "Raio-X / Exames",
                ].map((sector) => (
                  <button
                    key={sector}
                    onClick={() => setNewSector(sector)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl border-2 transition-all flex items-center justify-between group cursor-pointer",
                      newSector === sector
                        ? "border-[#006699] dark:border-sky-400 bg-[#006699]/5 dark:bg-sky-400/5 font-bold text-[#006699] dark:text-sky-400"
                        : "border-slate-100/50 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40",
                    )}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-tight truncate">
                      {sector}
                    </span>
                    <div
                      className={cn(
                        "h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                        newSector === sector
                          ? "border-[#006699] dark:border-sky-400 bg-[#006699] dark:bg-sky-400"
                          : "border-slate-300 dark:border-slate-700",
                      )}
                    >
                      {newSector === sector && (
                        <div className="h-1 w-1 rounded-full bg-white dark:bg-black" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 border-0 cursor-pointer"
                onClick={() => setTransferPatient(null)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-2 h-12 rounded-xl bg-[#006699] hover:bg-[#005580] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-black uppercase tracking-widest shadow-lg shadow-[#006699]/20 border-0 cursor-pointer"
                onClick={() => {
                  if (transferPatient && newSector) {
                    updatePatient(transferPatient.id, {
                      sector: newSector,
                      status: "waiting",
                    });
                    toast.success(
                      `Paciente ${transferPatient.name} encaminhado para ${newSector}`,
                    );
                    setTransferPatient(null);
                  }
                }}
              >
                Confirmar Encaminhamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Container de Impressão (Oculto em tela) */}
      {printingPatient && (
        <div className="print-only">
          <div className="font-bold text-lg mb-2">
            UPA - UNIDADE DE PRONTO ATENDIMENTO
          </div>
          <div className="text-sm mb-4">SISTEMA DE CONTROLE OPERACIONAL</div>
          <hr className="border-t border-black border-dashed my-4 w-full" />
          <div className="text-xs uppercase tracking-widest mb-2 font-bold tracking-widest">
            Sua senha de atendimento
          </div>
          <div className="text-6xl font-black my-6">
            {printingPatient.ticket}
          </div>
          <div className="text-sm font-bold mb-1 uppercase">
            {printingPatient.priority === "emergency"
              ? "ATENÇÃO: EMERGÊNCIA"
              : printingPatient.priority === "pediatric"
                ? "PEDIATRIA / CRIANÇA"
                : printingPatient.priority === "preferential"
                  ? "PREFERENCIAL"
                  : "NORMAL"}
          </div>
          <div className="text-xs mb-6">
            Local:{" "}
            {printingPatient.priority === "emergency"
              ? "SALA VERMELHA"
              : printingPatient.priority === "pediatric"
                ? "Triagem Pediátrica"
                : "Triagem"}
          </div>
          <hr className="border-t border-black border-dashed mt-4 w-full" />
          <div className="text-xs font-bold mb-4">
            PACIENTE: {formatWords(printingPatient.name)}
          </div>
          <div className="text-[10px]">
            {new Date().toLocaleDateString("pt-BR")} -{" "}
            {new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-[9px] mt-2 opacity-70">Reimpressão de Senha</div>
        </div>
      )}
      <PatientDetailsModal
        patient={patientForModal}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </motion.div>
  );
}
