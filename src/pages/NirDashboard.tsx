import { useState } from "react";
import { Ambulance, Clock, CheckCircle2, XCircle, Search, AlertTriangle, ArrowRight } from "lucide-react";
import { cn, formatWords } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePatientsContext } from "@/context/PatientsContext";
import { motion } from "framer-motion";
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
  DialogFooter,
} from "@/components/ui/dialog";

const getWaitTime = (requestedAt: string) => {
  const diff = Date.now() - new Date(requestedAt).getTime();
  const hours = diff / (1000 * 60 * 60);
  let color = 'text-emerald-500';
  if (hours >= 12) color = 'text-red-500 animate-pulse';
  else if (hours >= 6) color = 'text-amber-500';
  
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return { text: `${h}h ${m}m`, hours, color };
};

export default function NirDashboard() {
  const { patients, updateTransferStatus } = usePatientsContext();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const transferPatients = patients.filter(p => p.transferRequest);

  const stats = {
    total: transferPatients.length,
    pending: transferPatients.filter(p => p.transferRequest?.status === 'requested').length,
    accepted: transferPatients.filter(p => p.transferRequest?.status === 'accepted').length,
    denied: transferPatients.filter(p => p.transferRequest?.status === 'denied').length,
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Ambulance className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Regulação (NIR/CROSS)</h1>
            <p className="text-muted-foreground text-[11px] font-black uppercase tracking-widest mt-0.5">
              Gestão de Transferências e Vagas Externas
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Solicitações</p>
            <p className="text-3xl font-black text-foreground mt-2">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Aguardando Vaga</p>
            <p className="text-3xl font-black text-foreground mt-2">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Vagas Aceitas</p>
            <p className="text-3xl font-black text-foreground mt-2">{stats.accepted}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Negadas</p>
            <p className="text-3xl font-black text-foreground mt-2">{stats.denied}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card-premium border-none shadow-2xl">
        <CardHeader className="p-6 border-b border-white/10">
          <CardTitle className="text-sm font-black tracking-widest text-orange-500 uppercase">Fila de Regulação</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Paciente</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Motivo</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Tempo de Espera</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferPatients.sort((a, b) => new Date(b.transferRequest!.requestedAt).getTime() - new Date(a.transferRequest!.requestedAt).getTime()).map((p) => {
                const req = p.transferRequest!;
                const wait = getWaitTime(req.requestedAt);
                return (
                  <TableRow key={p.id} className="group">
                    <TableCell>
                      <div className="font-bold text-sm">{formatWords(p.name)}</div>
                      <div className="text-[10px] font-black uppercase text-muted-foreground">{p.cpf} • Idade: {p.age}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[9px] font-black uppercase", req.priority === 'emergency' ? "border-red-500 text-red-500" : req.priority === 'urgent' ? "border-orange-500 text-orange-500" : "border-emerald-500 text-emerald-500")}>
                        {req.priority === 'emergency' ? 'Emergência' : req.priority === 'urgent' ? 'Urgência' : 'Eletiva'}
                      </Badge>
                      <div className="text-xs font-semibold mt-1 truncate max-w-[200px]">{req.reason}</div>
                    </TableCell>
                    <TableCell>
                      <div className={cn("flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest", wait.color)}>
                        <Clock className="h-3 w-3" />
                        {wait.text}
                      </div>
                    </TableCell>
                    <TableCell>
                      {req.status === 'requested' && <Badge className="bg-amber-500 text-white text-[9px] uppercase font-black">Aguardando Vaga</Badge>}
                      {req.status === 'accepted' && <Badge className="bg-emerald-500 text-white text-[9px] uppercase font-black">Vaga Aceita</Badge>}
                      {req.status === 'denied' && <Badge className="bg-red-500 text-white text-[9px] uppercase font-black">Negado</Badge>}
                      {req.hospitalName && <div className="text-[9px] font-bold mt-1 text-emerald-600">{req.hospitalName}</div>}
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === 'requested' && (
                        <Button variant="outline" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white border-orange-500/50 text-orange-500" onClick={() => setSelectedPatientId(p.id)}>
                          Atualizar CROSS
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {transferPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-black text-xs uppercase tracking-widest">
                    Nenhum paciente aguardando transferência.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedPatientId} onOpenChange={() => setSelectedPatientId(null)}>
        {selectedPatient && (
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="font-black uppercase tracking-widest text-orange-500">Atualizar Status NIR</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Paciente</p>
                <p className="font-black">{formatWords(selectedPatient.name)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 h-12 flex flex-col items-center justify-center gap-1"
                  onClick={() => {
                    const hospital = prompt("Qual hospital liberou a vaga?");
                    if (hospital) {
                      updateTransferStatus(selectedPatient.id, 'accepted', hospital);
                      setSelectedPatientId(null);
                    }
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Vaga Aceita</span>
                </Button>
                <Button 
                  variant="destructive"
                  className="h-12 flex flex-col items-center justify-center gap-1"
                  onClick={() => {
                    updateTransferStatus(selectedPatient.id, 'denied');
                    setSelectedPatientId(null);
                  }}
                >
                  <XCircle className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Vaga Negada</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </motion.div>
  );
}
