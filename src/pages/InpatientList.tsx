import { usePatients } from "@/hooks/use-patients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Bed,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  User,
  Users,
  ArrowRightLeft,
  ClipboardList,
  Stethoscope,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn, formatWords, formatPatientAge } from "@/lib/utils";
import { AllocateBedModal } from "@/components/AllocateBedModal";
import { PatientDetailsModal } from "@/components/PatientDetailsModal";
import { useBeds } from "@/context/BedsContext";
import { Patient } from "@/hooks/use-patients";
import { ActionTooltip } from "@/components/ui/action-tooltip";

export default function InpatientList() {
  const { patients, updatePatient } = usePatients();
  const { assignPatient } = useBeds();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allocatingPatient, setAllocatingPatient] = useState<Patient | null>(null);
  const [detailsPatient, setDetailsPatient] = useState<Patient | null>(null);

  const inpatientWaitlist = patients
    .filter(
      (p) =>
        p.admissionRequest?.status === "pending" ||
        p.status === "interned" // Show those already allocated or pending
    )
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cpf.includes(searchTerm)
    )
    .sort((a, b) => {
      // Pending first
      if (
        a.admissionRequest?.status === "pending" &&
        b.admissionRequest?.status !== "pending"
      )
        return -1;
      if (
        b.admissionRequest?.status === "pending" &&
        a.admissionRequest?.status !== "pending"
      )
        return 1;
      
      const timeA = new Date(a.admissionRequest?.requestedAt || a.arrivalTime).getTime();
      const timeB = new Date(b.admissionRequest?.requestedAt || b.arrivalTime).getTime();
      return timeB - timeA; // newer first
    });

  const getWaitTimeInMinutes = (requestedAt?: string) => {
    if (!requestedAt) return 0;
    const requestTime = new Date(requestedAt);
    const now = new Date();
    const diffInMs = now.getTime() - requestTime.getTime();
    return Math.max(0, Math.floor(diffInMs / 60000));
  };

  const getTimeElapsed = (requestedAt?: string) => {
    const diffInMinutes = getWaitTimeInMinutes(requestedAt);
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleAllocate = (bedId: string) => {
    if (!allocatingPatient) return;
    
    // Aloca o paciente no leito (Contexto de Leitos)
    assignPatient(bedId, allocatingPatient.id);

    // Atualiza o paciente (Contexto de Pacientes)
    updatePatient(allocatingPatient.id, {
      status: "interned",
      admissionRequest: {
        ...allocatingPatient.admissionRequest!,
        status: "allocated",
      },
    });

    toast.success(`Paciente ${formatWords(allocatingPatient.name)} acomodado!`, {
      description: "O paciente foi vinculado ao leito com sucesso.",
    });
    
    setAllocatingPatient(null);
    navigate("/leitos");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-[#006699] dark:text-sky-400 uppercase flex items-center gap-3">
          <Users className="h-10 w-10" />
          Lista de Internações
        </h1>
        <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
          Fila de Espera para Acomodação em Leitos
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente..."
            className="pl-10 h-11 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                    Tipo de Leito
                  </TableHead>
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-center">
                    Solicitante
                  </TableHead>
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest">
                    Tempo de Espera
                  </TableHead>
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-right pr-6">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inpatientWaitlist.map((patient) => {
                  const isPending = patient.admissionRequest?.status === "pending";
                  const overTarget = isPending && getWaitTimeInMinutes(patient.admissionRequest?.requestedAt) > 60;

                  return (
                    <TableRow
                      key={patient.id}
                      className={cn(
                        "border-b border-slate-200/40 dark:border-slate-800/40 transition-colors h-16",
                        isPending
                          ? "bg-orange-500/5 hover:bg-orange-500/10 dark:bg-orange-950/10 dark:hover:bg-orange-950/20"
                          : "hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                      )}
                    >
                      <TableCell className="font-medium text-sm text-slate-800 dark:text-slate-100 pl-6">
                        <div className="flex items-center gap-2">
                          {isPending && overTarget && (
                            <div className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 dark:text-slate-150">
                              {formatWords(patient.name)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatPatientAge(patient.age, patient.birthDate)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-bold text-[10px] uppercase",
                            patient.admissionRequest?.bedType === "emergency"
                              ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20"
                              : "text-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-950/20"
                          )}
                        >
                          {patient.admissionRequest?.bedType === "emergency"
                            ? "Emergência"
                            : "Observação"}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {patient.admissionRequest?.doctor || "Não informado"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-foreground dark:text-slate-200 font-bold text-sm">
                            {patient.admissionRequest?.requestedAt
                              ? new Date(patient.admissionRequest.requestedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : "—"}
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
                              Há {getTimeElapsed(patient.admissionRequest?.requestedAt)}
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
                              "font-bold text-[10px] px-2 py-1 border rounded-lg whitespace-nowrap min-w-[100px] justify-center",
                              isPending
                                ? "text-orange-500 bg-orange-500/10 border-orange-500/20"
                                : "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                            )}
                          >
                            {isPending ? "Aguardando Leito" : "Alocado"}
                          </Badge>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          {isPending && (
                            <ActionTooltip label="Acomodar no Leito" side="top" align="end">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 rounded-xl px-3 gap-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-black uppercase text-[10px] tracking-wider cursor-pointer border-0"
                                onClick={() => setAllocatingPatient(patient)}
                              >
                                <Bed className="h-3.5 w-3.5" />
                                Acomodar
                              </Button>
                            </ActionTooltip>
                          )}
                          <ActionTooltip label="Evolução de Enfermagem" side="top" align="end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-[#006699] dark:hover:text-sky-400 hover:bg-[#006699]/5 dark:hover:bg-sky-400/5 cursor-pointer"
                              onClick={() => navigate(`/paciente/${patient.id}/evolucao/enfermagem`)}
                            >
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                          </ActionTooltip>
                          <ActionTooltip label="Detalhes da Triagem" side="top" align="end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-[#006699] dark:hover:text-sky-400 hover:bg-[#006699]/5 dark:hover:bg-sky-400/5 cursor-pointer"
                              onClick={() => setDetailsPatient(patient)}
                            >
                              <Stethoscope className="h-4 w-4" />
                            </Button>
                          </ActionTooltip>
                          <ActionTooltip label="Ver Prontuário" side="top" align="end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-[#006699] dark:hover:text-sky-400 hover:bg-[#006699]/5 dark:hover:bg-sky-400/5 cursor-pointer"
                              onClick={() =>
                                navigate(`/paciente/${patient.id}`, {
                                  state: {
                                    from: "/lista-internacao",
                                    label: "Lista de Internações",
                                  },
                                })
                              }
                            >
                              <User className="h-4 w-4" />
                            </Button>
                          </ActionTooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {inpatientWaitlist.length === 0 && (
              <div className="p-12 flex flex-col items-center justify-center text-center text-muted-foreground">
                <Bed className="h-12 w-12 text-slate-200 dark:text-slate-800 mb-4" />
                <p className="font-bold text-lg text-slate-400">
                  Nenhum paciente aguardando internação.
                </p>
                <p className="text-sm text-slate-500">
                  Pacientes com prescrição de internação aparecerão aqui.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AllocateBedModal
        isOpen={!!allocatingPatient}
        onClose={() => setAllocatingPatient(null)}
        patient={allocatingPatient}
        onAllocate={handleAllocate}
      />
      
      <PatientDetailsModal
        patient={detailsPatient}
        isOpen={!!detailsPatient}
        onClose={() => setDetailsPatient(null)}
      />
    </motion.div>
  );
}
