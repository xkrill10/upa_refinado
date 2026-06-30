import React, { useState } from "react";
import { usePatients, Patient } from "@/hooks/use-patients";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Users, ArrowRight, ActivitySquare, Pill } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PatientJourneyTimeline } from "@/components/PatientEvolution/PatientJourneyTimeline";
import { cn, formatWords } from "@/lib/utils";

export default function FlowDashboard() {
  const { patients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Filtros rápidos
  const activePatients = patients.filter(
    (p) => p.status !== "completed" && p.status !== "evasion"
  );
  
  const waitingTriage = activePatients.filter((p) => p.status === "waiting" && !p.risk);
  const waitingDoctor = activePatients.filter((p) => p.status === "waiting" && p.risk);
  const inObservationOrMeds = activePatients.filter(
    (p) => p.status === "waiting-medication" || p.status === "in-observation" || p.sector?.toLowerCase().includes("observação")
  );

  const getRiskDetails = (risk?: string) => {
    switch (risk) {
      case "emergency":
        return { label: "Emergência", color: "bg-red-600 text-white" };
      case "very-urgent":
        return { label: "Muito Urgente", color: "bg-orange-500 text-white" };
      case "urgent":
        return { label: "Urgente", color: "bg-[#FFDE21] text-black" };
      case "less-urgent":
        return { label: "Pouco Urgente", color: "bg-green-500 text-white" };
      case "not-urgent":
        return { label: "Não Urgente", color: "bg-blue-500 text-white" };
      default:
        return { label: "Aguardando", color: "bg-slate-300 text-slate-700" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "waiting": return "Aguardando";
      case "attending": return "Em Atendimento";
      case "waiting-medication": return "Aguardando Medicação";
      case "in-observation": return "Em Observação";
      case "completed": return "Alta";
      default: return status;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#006699] dark:text-sky-400 uppercase tracking-tight flex items-center gap-3">
            <ActivitySquare className="h-8 w-8" /> 
            Dashboard de Fluxo
          </h1>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">
            Controle de Jornada e Gargalos Operacionais
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border border-blue-500/20 bg-blue-500/5 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Ativos</p>
              <h3 className="text-2xl font-black text-blue-700 dark:text-blue-400">{activePatients.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border border-amber-500/20 bg-amber-500/5 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ag. Triagem</p>
              <h3 className="text-2xl font-black text-amber-700 dark:text-amber-400">{waitingTriage.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-orange-500/20 bg-orange-500/5 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
              <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ag. Médico</p>
              <h3 className="text-2xl font-black text-orange-700 dark:text-orange-400">{waitingDoctor.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-purple-500/20 bg-purple-500/5 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <Pill className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Medicação / Obs</p>
              <h3 className="text-2xl font-black text-purple-700 dark:text-purple-400">{inObservationOrMeds.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-slate-100">
            Pacientes em Atendimento
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">Chegada</th>
                <th className="px-6 py-4">Setor</th>
                <th className="px-6 py-4">Risco</th>
                <th className="px-6 py-4">Status / Gargalo</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-semibold">
              {activePatients.map((patient) => {
                const risk = getRiskDetails(patient.risk);
                return (
                  <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs">
                          {formatWords(patient.name)}
                        </span>
                        <span className="text-[10px] text-slate-500">ID: {patient.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {patient.arrivalTime ? new Date(patient.arrivalTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}) : '--:--'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {patient.sector || "Recepção"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn("border-none text-[10px] font-bold uppercase shadow-sm", risk.color)}>
                        {risk.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                        {getStatusLabel(patient.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedPatient(patient)}
                        className="text-[#006699] dark:text-sky-400 hover:text-sky-600 text-xs font-black uppercase tracking-wider flex items-center justify-end gap-1 ml-auto transition-colors"
                      >
                        Ver Jornada <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {activePatients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                    Nenhum paciente ativo no momento
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-2xl">
          <div className="h-[85vh] overflow-y-auto rounded-3xl">
            <PatientJourneyTimeline patient={selectedPatient} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
