import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/context/PatientsContext";
import { cn, formatWords } from "@/lib/utils";
import { PatientDetailsModal } from "./PatientDetailsModal";

export function PatientQueueTable({ patients }: { patients: Patient[] }) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };
  const riskLabel: Record<string, string> = {
    emergency: "Emergência",
    "very-urgent": "Muito Urgente",
    urgent: "Urgente",
    "less-urgent": "Pouco Urgente",
    "not-urgent": "Não Urgente",
  };

  const riskColor: Record<string, string> = {
    emergency: "bg-red-500 hover:bg-red-600 text-white",
    "very-urgent": "bg-orange-500 hover:bg-orange-600 text-white",
    urgent: "bg-yellow-400 hover:bg-yellow-500 text-black",
    "less-urgent": "bg-green-500 hover:bg-green-600 text-white",
    "not-urgent": "bg-blue-600 hover:bg-blue-700 text-white",
  };

  const statusLabel: Record<string, string> = {
    waiting: "EM ESPERA",
    attending: "EM ATENDIMENTO",
    completed: "FINALIZADO",
  };

  const statusStyles: Record<
    string,
    { bg: string; text: string; border: string; dot: string }
  > = {
    waiting: {
      bg: "bg-amber-500/8 dark:bg-amber-500/12",
      text: "text-amber-700 dark:text-amber-400 font-extrabold",
      border: "border-amber-500/20 dark:border-amber-500/15",
      dot: "bg-amber-500/80 animate-pulse",
    },
    attending: {
      bg: "bg-emerald-500/8 dark:bg-emerald-500/12",
      text: "text-emerald-700 dark:text-emerald-400 font-extrabold",
      border: "border-emerald-500/20 dark:border-emerald-500/15",
      dot: "bg-emerald-500/80 animate-pulse",
    },
    completed: {
      bg: "bg-blue-500/8 dark:bg-blue-500/12",
      text: "text-blue-700 dark:text-blue-400 font-extrabold",
      border: "border-blue-500/20 dark:border-blue-500/15",
      dot: "bg-blue-500/80",
    },
  };

  return (
    <div className="rounded-xl border border-border/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/10">
            <TableHead className="data-label py-4">Paciente</TableHead>
            <TableHead className="data-label py-4">Classificação</TableHead>
            <TableHead className="data-label py-4">Setor / Local</TableHead>
            <TableHead className="data-label py-4">
              Profissional Resp.
            </TableHead>
            <TableHead className="data-label py-4 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient.id}
              className="hover:bg-primary/5 transition-colors group cursor-pointer"
              onClick={() => handleRowClick(patient)}
            >
              <TableCell>
                <div>
                  <p className="font-bold tracking-tight text-sm">
                    {formatWords(patient.name)}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-70">
                    {new Date(patient.arrivalTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    • ID: {patient.id}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${riskColor[patient.risk] || "bg-slate-400"} animate-pulse`}
                  />
                  <Badge
                    className={`${riskColor[patient.risk] || "bg-slate-400"} text-[9px] font-black tracking-widest uppercase py-0.5 border-0 shadow-sm w-28 justify-center`}
                  >
                    {riskLabel[patient.risk] || patient.risk}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-[10px] font-black uppercase text-muted-foreground">
                {patient.sector ||
                  (patient.status === "waiting" && !patient.triaged
                    ? "AGUARD. TRIAGEM"
                    : "-")}
              </TableCell>
              <TableCell className="text-[10px] font-bold uppercase text-primary">
                {patient.responsibleProfessional ||
                  (patient.status === "attending"
                    ? "Dr(a). NÃO ATRIBUÍDO"
                    : "-")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] tracking-[0.06em] select-none transition-all duration-300",
                      statusStyles[patient.status]?.bg || "bg-secondary",
                      statusStyles[patient.status]?.text || "text-foreground",
                      statusStyles[patient.status]?.border || "border-border",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        statusStyles[patient.status]?.dot || "bg-slate-400",
                      )}
                    />
                    {statusLabel[patient.status] || patient.status}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PatientDetailsModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
