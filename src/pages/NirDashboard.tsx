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
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  const transferPatients = patients.filter(p => p.transferRequest);

  const filteredPatients = transferPatients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.cpf.includes(searchTerm);
    const matchesPriority = filterPriority === "all" || p.transferRequest?.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const stats = {
    total: transferPatients.length,
    pending: transferPatients.filter(p => p.transferRequest?.status === 'requested').length,
    accepted: transferPatients.filter(p => p.transferRequest?.status === 'accepted' || p.transferRequest?.status === 'transporting').length,
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
        <CardHeader className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-sm font-black tracking-widest text-orange-500 uppercase">Fila de Regulação</CardTitle>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar paciente..." 
                className="pl-9 h-10 rounded-xl bg-background/50 border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="h-10 w-full md:w-40 rounded-xl bg-background/50 border-white/10">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="emergency">Emergência (Vermelho)</SelectItem>
                <SelectItem value="urgent">Urgência (Amarelo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Paciente</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Motivo / CROSS</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Tempo de Espera</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest pr-6">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.sort((a, b) => new Date(b.transferRequest!.requestedAt).getTime() - new Date(a.transferRequest!.requestedAt).getTime()).map((p) => {
                const req = p.transferRequest!;
                const wait = getWaitTime(req.requestedAt);
                return (
                  <TableRow key={p.id} className="group hover:bg-muted/30">
                    <TableCell className="pl-6">
                      <div className="font-bold text-sm">{formatWords(p.name)}</div>
                      <div className="text-[10px] font-black uppercase text-muted-foreground">{p.cpf} • Idade: {p.age}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[9px] font-black uppercase", req.priority === 'emergency' ? "border-red-500 text-red-500 bg-red-500/5" : req.priority === 'urgent' ? "border-orange-500 text-orange-500 bg-orange-500/5" : "border-emerald-500 text-emerald-500")}>
                        {req.priority === 'emergency' ? 'Emergência' : req.priority === 'urgent' ? 'Urgência' : 'Eletiva'}
                      </Badge>
                      <div className="text-xs font-semibold mt-1 truncate max-w-[200px]">{req.reason}</div>
                      {req.crossCode && <div className="text-[10px] font-mono text-muted-foreground mt-0.5">CROSS: {req.crossCode}</div>}
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
                      {req.status === 'transporting' && <Badge className="bg-blue-500 text-white text-[9px] uppercase font-black animate-pulse">Aguardando SAMU</Badge>}
                      {req.status === 'denied' && <Badge className="bg-red-500 text-white text-[9px] uppercase font-black">Negado</Badge>}
                      {req.hospitalName && <div className="text-[9px] font-bold mt-1 text-emerald-600">{req.hospitalName}</div>}
                      {req.ambulanceType && <div className="text-[9px] font-black uppercase text-blue-500 mt-0.5">{req.ambulanceType}</div>}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {req.status === 'requested' && (
                        <Button variant="outline" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white border-orange-500/50 text-orange-500" onClick={() => setSelectedPatientId(p.id)}>
                          Atualizar CROSS
                        </Button>
                      )}
                      {req.status === 'accepted' && (
                        <Button variant="outline" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest bg-blue-500/10 hover:bg-blue-600 hover:text-white border-blue-500/50 text-blue-600" onClick={() => updateTransferStatus(p.id, 'transporting')}>
                          <Ambulance className="w-3 h-3 mr-2" /> Chamar SAMU
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
          <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const hospital = formData.get('hospital') as string;
              const code = formData.get('crossCode') as string;
              const amb = formData.get('ambulance') as string;
              
              updateTransferStatus(selectedPatient.id, 'accepted', hospital, code, amb);
              setSelectedPatientId(null);
            }}>
              <DialogHeader className="p-8 bg-slate-900 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-black uppercase tracking-tight mission-control-title text-white">Atualizar CROSS</DialogTitle>
                    <DialogDescription className="text-white/60 font-medium text-xs mt-1">Registrar vaga cedida e protocolo</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="p-8 space-y-6">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 mb-1">Paciente Solicitante</p>
                  <div className="h-12 rounded-xl bg-muted/30 flex items-center px-4 border border-border/50">
                    <span className="font-bold text-sm">{formatWords(selectedPatient.name)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Hospital de Destino</Label>
                    <Select name="hospital" required>
                      <SelectTrigger className="h-12 rounded-xl mt-1">
                        <SelectValue placeholder="Selecione o hospital..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hospital das Clínicas (HC)">Hospital das Clínicas (HC)</SelectItem>
                        <SelectItem value="Hospital São Paulo">Hospital São Paulo</SelectItem>
                        <SelectItem value="Santa Casa de Misericórdia">Santa Casa de Misericórdia</SelectItem>
                        <SelectItem value="Hospital do Servidor Público">Hospital do Servidor Público</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Código CROSS</Label>
                      <Input name="crossCode" required placeholder="Ex: CR-89421" className="h-12 rounded-xl mt-1" />
                    </div>
                    <div>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tipo de Viatura</Label>
                      <Select name="ambulance" required>
                        <SelectTrigger className="h-12 rounded-xl mt-1">
                          <SelectValue placeholder="Tipo..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAMU - Básica">Básica (USB)</SelectItem>
                          <SelectItem value="SAMU - Avançada (UTI)">Avançada / UTI (USA)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="p-8 pt-0 flex gap-3">
                <Button type="button" variant="outline" className="rounded-xl h-12 flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors" onClick={() => {
                  updateTransferStatus(selectedPatient.id, 'denied');
                  setSelectedPatientId(null);
                }}>
                  <XCircle className="w-4 h-4 mr-2" /> Negar Vaga
                </Button>
                <Button type="submit" className="rounded-xl h-12 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-600/20">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Confirmar Vaga
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </motion.div>
  );
}
