import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Library, 
  Search, 
  FileText, 
  History, 
  Upload, 
  Download, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Printer, 
  ExternalLink,
  ShieldCheck,
  FileScan,
  Database,
  TrendingUp,
  BarChart3,
  Layers,
  Boxes,
  ShieldAlert,
  Eye,
  AlertTriangle,
  ArrowRight,
  Archive,
  X,
  FileType
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { usePatients } from "@/hooks/use-patients";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const statsData = [
  { name: "Jan", records: 400, requests: 240 },
  { name: "Fev", records: 300, requests: 139 },
  { name: "Mar", records: 200, requests: 980 },
  { name: "Abr", records: 278, requests: 390 },
  { name: "Mai", records: 189, requests: 480 },
  { name: "Jun", records: 239, requests: 380 },
  { name: "Jul", records: 349, requests: 430 },
];

const auditLogs = [
  { id: 1, user: "Dr. Ricardo Braga", action: "Acessou Prontuário", target: "Maria Silva", time: "10:45", date: "12/05/2026", severity: "low" },
  { id: 2, user: "Enf. Ana Paula", action: "Digitalizou Exame", target: "João Santos", time: "09:30", date: "12/05/2026", severity: "low" },
  { id: 3, user: "Admin", action: "Alterou Localização", target: "CX-12 / ALA-A", time: "08:15", date: "12/05/2026", severity: "medium" },
  { id: 4, user: "Dr. Paulo Souza", action: "Exportou Prontuário", target: "Ana Oliveira", time: "16:40", date: "11/05/2026", severity: "high" },
];

const storageUnits = [
  { zone: "ALA-A", capacity: 85, used: 72, units: 1200 },
  { zone: "ALA-B", capacity: 90, used: 45, units: 850 },
  { zone: "ALA-C (HISTÓRICO)", capacity: 100, used: 98, units: 3400 },
  { zone: "ARQUIVO MORTO", capacity: 50, used: 48, units: 5000 },
];

export default function Same() {
  const { patients } = usePatients();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("files");
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  const documentRequests = [
    { id: "REQ001", patient: "Maria Silva", type: "Cópia de Prontuário", date: "12/05/2026", status: "Pronto" },
    { id: "REQ002", patient: "João Santos", type: "Laudo Médico", date: "11/05/2026", status: "Em processamento" },
    { id: "REQ003", patient: "Ana Oliveira", type: "Exames de Imagem", date: "10/05/2026", status: "Pronto" },
  ];

  const navigate = useNavigate();

  const handleAction = (type: string, patientId: string, patientName: string) => {
    switch(type) {
      case 'view':
        navigate(`/paciente/${patientId}`, { state: { from: '/same', label: 'SAME' } });
        break;
      case 'print':
        toast.success(`Enviando prontuário de ${patientName} para fila de impressão`, {
          icon: <Printer className="h-4 w-4" />
        });
        break;
      case 'export':
        toast.warning(`Proteção LGPD: Gerando link temporário para exportação de ${patientName}`, {
          icon: <ExternalLink className="h-4 w-4" />
        });
        break;
    }
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Novo registro arquivado com sucesso!", {
      description: "O prontuário foi indexado e está disponível para consulta.",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    });
    setIsNewRecordOpen(false);
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 glass-card-premium p-8 rounded-[2rem] border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
              <Library className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black uppercase text-[10px] tracking-widest px-3">
              Gestão Documental
            </Badge>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mission-control-title uppercase">SAME</h1>
          <p className="text-muted-foreground font-medium max-w-2xl mt-2">
            Serviço de Arquivo Médico e Estatística. Gerenciamento, preservação e rastreabilidade de prontuários.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-w-[240px]">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">
            <span>Uso de Armazenamento Digital</span>
            <span>68%</span>
          </div>
          <div className="h-3 w-full bg-muted/30 rounded-full overflow-hidden border border-border/50 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              className="h-full bg-gradient-to-r from-primary to-blue-600 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Prontuários Arquivados", value: "12,480", icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Digitalizados (Digital SAME)", value: "8,920", icon: FileScan, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pedidos Pendentes", value: "14", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Entregues Hoje", value: "28", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
        ].map((stat, i) => (
          <Card key={i} className="glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden group hover:scale-[1.02] transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <Badge variant="outline" className="text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity uppercase">Ver Detalhes</Badge>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="glass-card-premium p-1 h-14 rounded-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full md:w-auto overflow-x-auto flex-nowrap shrink-0">
          <TabsTrigger value="files" className="px-8 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-lg shrink-0">
            <Database className="h-3 w-3 mr-2" />
            Arquivo
          </TabsTrigger>
          <TabsTrigger value="requests" className="px-8 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-lg shrink-0">
            <History className="h-3 w-3 mr-2" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="digital" className="px-8 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-lg shrink-0">
            <FileScan className="h-3 w-3 mr-2" />
            SAME Digital
          </TabsTrigger>
          <TabsTrigger value="stats" className="px-8 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-lg shrink-0">
            <BarChart3 className="h-3 w-3 mr-2" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="traceability" className="px-8 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-lg shrink-0">
            <ShieldCheck className="h-3 w-3 mr-2" />
            Rastreabilidade
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="files" className="mt-0 outline-none">
              <Card className="glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden rounded-[2rem]">
                <CardHeader className="p-8 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight mission-control-title">Base de Dados Central</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Busca por nome, CPF ou Ticket de Atendimento</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-[350px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Pesquisar prontuário..." 
                        className="pl-10 h-11 rounded-xl border-border/30 bg-white/50 shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="h-11 w-11 rounded-xl p-0 border-border/40">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
                      <DialogTrigger asChild>
                        <Button className="h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                          <Plus className="h-4 w-4 mr-2" />
                          Novo Registro
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                        <form onSubmit={handleCreateRecord}>
                          <DialogHeader className="p-8 bg-primary text-white">
                            <div className="flex items-center justify-between">
                              <DialogTitle className="text-2xl font-black uppercase tracking-tight mission-control-title">Indexar Novo Prontuário</DialogTitle>
                            </div>
                            <DialogDescription className="text-white/70 font-medium mt-2">Preencha os dados técnicos para salvaguarda do documento.</DialogDescription>
                          </DialogHeader>
                          <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome do Paciente</Label>
                                <Input placeholder="Nome completo" className="h-12 rounded-xl" required />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">CPF / Documento</Label>
                                <Input placeholder="000.000.000-00" className="h-12 rounded-xl" required />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tipo de Registro</Label>
                                <Select defaultValue="physical">
                                  <SelectTrigger className="h-12 rounded-xl">
                                    <SelectValue placeholder="Selecione o tipo" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl border-border/50">
                                    <SelectItem value="physical">Arquivo Físico</SelectItem>
                                    <SelectItem value="digital">Digitalizado</SelectItem>
                                    <SelectItem value="hybrid">Híbrido</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Localização (Estante/Ala)</Label>
                                <Input placeholder="Ex: ALA-A/EST-02" className="h-12 rounded-xl" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notas Administrativas</Label>
                              <Input placeholder="Observações sobre preservação..." className="h-12 rounded-xl" />
                            </div>
                          </div>
                          <DialogFooter className="p-8 pt-0 flex gap-3">
                            <Button type="button" variant="ghost" className="rounded-xl h-12 px-6 font-black uppercase tracking-widest text-[10px]" onClick={() => setIsNewRecordOpen(false)}>Cancelar</Button>
                            <Button type="submit" className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 flex-1">Finalizar Indexação</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border/50">
                          <th className="p-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-10">Paciente / Prontuário</th>
                          <th className="p-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Última Atualização</th>
                          <th className="p-5 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status do Arquivo</th>
                          <th className="p-5 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">Localização</th>
                          <th className="p-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground pr-10">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {filteredPatients.map((p, i) => (
                          <tr key={p.id} className="hover:bg-muted/20 transition-all group">
                            <td className="p-5 pl-10">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center font-black text-xs text-primary group-hover:scale-110 transition-transform">
                                  {p.ticket}
                                </div>
                                <div>
                                  <p className="font-black uppercase text-sm tracking-tight">{p.name}</p>
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ID: {p.id.toUpperCase()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-5">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs font-bold text-muted-foreground">12/05/2026 10:45</span>
                              </div>
                            </td>
                            <td className="p-5">
                              <div className="flex justify-center">
                                <Badge variant="outline" className={cn(
                                  "text-[9px] font-black uppercase px-2 shadow-sm rounded-full",
                                  i % 3 === 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"
                                )}>
                                  {i % 3 === 0 ? "Digitalizado" : "Arquivo Físico"}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-5 text-center">
                              <span className="text-xs font-bold font-mono tracking-tighter">ALA-A / EST-04 / CX-12</span>
                            </td>
                            <td className="p-5 text-right pr-10">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 rounded-lg p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                                  onClick={() => handleAction('view', p.id, p.name)}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 rounded-lg p-0 hover:bg-blue-600/10 hover:text-blue-600 transition-colors"
                                  onClick={() => handleAction('print', p.id, p.name)}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 rounded-lg p-0 hover:bg-muted transition-colors"
                                  onClick={() => handleAction('export', p.id, p.name)}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="mt-0 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden rounded-[2rem]">
                  <CardHeader className="p-8 border-b border-border/50">
                    <CardTitle className="text-xl font-black uppercase tracking-tight mission-control-title">Fila de Solicitações</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Gerenciamento de entrega de cópias e laudos</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                              <th className="p-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-10">ID Pedido</th>
                              <th className="p-5 text-left text-[10px) font-black uppercase tracking-widest text-muted-foreground">Paciente</th>
                              <th className="p-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tipo</th>
                              <th className="p-5 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                              <th className="p-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground pr-10">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                            {documentRequests.map((req) => (
                              <tr key={req.id} className="hover:bg-muted/20 transition-all">
                                <td className="p-5 pl-10">
                                  <span className="text-xs font-black font-mono">{req.id}</span>
                                </td>
                                <td className="p-5">
                                  <p className="font-bold text-sm uppercase tracking-tight">{req.patient}</p>
                                  <p className="text-[10px] text-muted-foreground font-medium">{req.date}</p>
                                </td>
                                <td className="p-5 text-xs font-medium uppercase tracking-widest opacity-70">
                                  {req.type}
                                </td>
                                <td className="p-5">
                                  <div className="flex justify-center">
                                    <Badge className={cn(
                                      "text-[9px] font-black uppercase px-2 border-none",
                                      req.status === "Pronto" ? "bg-emerald-500 text-white" : "bg-orange-500 text-white"
                                    )}>
                                      {req.status}
                                    </Badge>
                                  </div>
                                </td>
                                <td className="p-5 text-right pr-10">
                                  <Button size="sm" variant="outline" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/10 transition-all">
                                    {req.status === "Pronto" ? <Download className="h-3 w-3 mr-2" /> : <Clock className="h-3 w-3 mr-2" />}
                                    {req.status === "Pronto" ? "Baixar" : "Processar"}
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-primary text-white overflow-hidden rounded-[2rem] flex flex-col justify-between relative h-full">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Library className="h-40 w-40" />
                  </div>
                  <CardHeader className="p-8 pb-0 relative z-10">
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30 font-black uppercase text-[10px] mb-4 w-fit tracking-widest">
                      Atendimento Externo
                    </Badge>
                    <CardTitle className="text-3xl font-black uppercase tracking-tight leading-tight mission-control-title">Horário de Funcionamento</CardTitle>
                    <p className="mt-4 text-white/80 font-medium">Atendimento ao público para solicitações de prontuários:</p>
                  </CardHeader>
                  <CardContent className="p-8 relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Segunda à Sexta</p>
                          <p className="text-lg font-black tracking-tight uppercase">08:00 — 17:00</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Sábados</p>
                          <p className="text-lg font-black tracking-tight uppercase">08:00 — 12:00</p>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-8 h-12 rounded-xl bg-white text-primary font-black uppercase tracking-widest text-[11px] hover:bg-white/90 shadow-xl transition-all">
                      Nova Solicitação
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="digital" className="mt-0 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden rounded-[2rem] p-10 flex flex-col items-center justify-center text-center gap-6 group">
                  <div className="h-24 w-24 rounded-[2rem] bg-emerald-100 flex items-center justify-center text-emerald-600 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-emerald-500/10">
                    <Upload className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mission-control-title">Digitalizar Novo Documento</h3>
                    <p className="text-muted-foreground font-medium mt-2 max-w-sm mx-auto">
                      Utilize o scanner integrado ou faça o upload de arquivos PDF/JPG para o prontuário digital.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button className="h-12 px-8 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[11px] hover:shadow-lg hover:shadow-primary/30 transition-all">
                      Iniciar Digitalização
                    </Button>
                    <Button variant="outline" className="h-12 px-8 rounded-xl border-border/40 font-black uppercase tracking-widest text-[11px] transition-all">
                      Upload de Arquivo
                    </Button>
                  </div>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                    <ShieldCheck className="h-4 w-4" />
                    Criptografia TLS 1.3 Ativa
                  </div>
                </Card>

                <Card className="glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden rounded-[2rem]">
                  <CardHeader className="p-8 border-b border-border/50">
                    <CardTitle className="text-xl font-black uppercase tracking-tight mission-control-title">Uploads Recentes</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Últimos documentos processados no SAME Digital</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4">
                    {[
                      { name: "Laudo Laboratorial", patient: "CARLOS SOUZA", time: "Há 12 min", size: "1.2 MB" },
                      { name: "Termo de Consentimento", patient: "JULIANA LIMA", time: "Há 25 min", size: "450 KB" },
                      { name: "Histórico Clínico", patient: "ROBERTO PEREIRA", time: "Há 45 min", size: "3.1 MB" },
                      { name: "Receituário Especial", patient: "AMANDA COSTA", time: "Há 1h", size: "820 KB" },
                    ].map((upload, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-all group/upload">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover/upload:bg-primary group-hover/upload:text-white transition-colors">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-tight">{upload.name}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase">{upload.patient} • {upload.size}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{upload.time}</p>
                          <Button variant="ghost" size="sm" className="h-6 text-[9px] font-black uppercase p-0 h-fit hover:bg-transparent text-primary transition-colors">Visualizar</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-0 outline-none space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden rounded-[2rem] p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <CardTitle className="text-xl font-black uppercase tracking-tight mission-control-title">Volume de Atividade</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Prontuários criados vs Pedidos processados</CardDescription>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Prontuários</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-600" />
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Pedidos</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={statsData}>
                        <defs>
                          <linearGradient id="colorRecords" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }} 
                        />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="records" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRecords)" />
                        <Area type="monotone" dataKey="requests" stroke="#2563eb" fillOpacity={1} fill="url(#colorRequests)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card className="border-none shadow-xl bg-primary text-white overflow-hidden rounded-[2rem] p-8">
                    <TrendingUp className="h-8 w-8 mb-4 opacity-50" />
                    <p className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">Previsão Mensal</p>
                    <h3 className="text-4xl font-black tracking-tighter mb-4">+12.4%</h3>
                    <p className="text-xs font-medium text-white/70">Aumento projetado no volume de prontuários digitais para o próximo semestre.</p>
                  </Card>
                  
                  <Card className="glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden rounded-[2rem] p-8">
                    <CardTitle className="text-sm font-black uppercase tracking-tight mb-6">Eficiência de Entrega</CardTitle>
                    <div className="space-y-4">
                      {[
                        { label: "Digital", value: 92 },
                        { label: "Arquivo Físico", value: 65 },
                        { label: "Urgências", value: 88 },
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span>{item.value}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              className="h-full bg-primary"
                              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {storageUnits.map((unit, i) => (
                  <Card key={i} className="glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden rounded-[2rem] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-xl bg-muted/30">
                        <Boxes className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-black uppercase shadow-none border-none",
                        unit.used > 90 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                      )}>
                        {unit.used}% Ocupado
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{unit.zone}</p>
                      <p className="text-xl font-black tracking-tight">{unit.units.toLocaleString()} Prontuários</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="traceability" className="mt-0 outline-none pb-1">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <Card className="md:col-span-3 glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden rounded-[2rem]">
                  <CardHeader className="p-8 border-b border-border/50 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-black uppercase tracking-tight mission-control-title">Log de Auditoria</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Registro cronológico de acessos e modificações</CardDescription>
                    </div>
                    <Button variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-6 border-border/40 transition-all">
                      <Download className="h-3 w-3 mr-2" />
                      Exportar Log
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border/50">
                            <th className="p-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-10">Usuário</th>
                            <th className="p-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ação</th>
                            <th className="p-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Alvo / Registro</th>
                            <th className="p-5 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">Horário</th>
                            <th className="p-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground pr-10">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-muted/20 transition-all group">
                              <td className="p-5 pl-10">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center font-black text-[10px] text-muted-foreground">
                                    {log.user.split(" ").map(n => n[0]).join("")}
                                  </div>
                                  <span className="text-sm font-bold">{log.user}</span>
                                </div>
                              </td>
                              <td className="p-5">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{log.action}</span>
                              </td>
                              <td className="p-5">
                                <span className="text-xs font-bold uppercase tracking-tight">{log.target}</span>
                              </td>
                              <td className="p-5 text-center px-4">
                                <div className="flex flex-col">
                                  <span className="text-xs font-black">{log.time}</span>
                                  <span className="text-[10px] text-muted-foreground font-bold tracking-widest">{log.date}</span>
                                </div>
                              </td>
                              <td className="p-5 text-right pr-10">
                                <div className="flex items-center justify-end">
                                  <div className={cn(
                                    "h-2 w-2 rounded-full",
                                    log.severity === "low" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                                    log.severity === "medium" ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                  )} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden rounded-[2rem] p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <ShieldAlert className="h-5 w-5 text-red-500" />
                      <CardTitle className="text-sm font-black uppercase tracking-tight">Alertas de Segurança</CardTitle>
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: "Múltiplos Acessos", desc: "Dr. Paulo exportou 3 prontuários em 5min.", time: "Há 1h" },
                        { title: "Acesso Não Autorizado", desc: "Tentativa de login bloqueada (IP Externo).", time: "Há 4h" },
                      ].map((alert, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-red-50 border border-red-100 space-y-1">
                          <p className="text-[10px] font-black uppercase text-red-600 tracking-widest">{alert.title}</p>
                          <p className="text-xs font-medium text-red-800/70 leading-relaxed">{alert.desc}</p>
                          <p className="text-[9px] font-bold text-red-400 uppercase pt-1">{alert.time}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden rounded-[2rem] p-8">
                    <CardTitle className="text-sm font-black uppercase tracking-tight mb-6">Controle de Privacidade</CardTitle>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full h-12 rounded-xl justify-between px-6 border-border/40 group hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-3">
                          <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Níveis de Acesso</span>
                        </div>
                        <ArrowRight className="h-3 w-3 opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      </Button>
                      <Button variant="outline" className="w-full h-12 rounded-xl justify-between px-6 border-border/40 group hover:border-emerald-500/50 transition-all">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Criptografia Local</span>
                        </div>
                        <ArrowRight className="h-3 w-3 opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
      
      {/* Informative Footer Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border/50">
        <div className="flex gap-4 group">
          <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
            <ShieldCheck className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">Conformidade LGPD</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">Todos os dados clínicos são tratados sob rigorosos protocolos de proteção de dados sensíveis e anonimização estatística.</p>
          </div>
        </div>
        <div className="flex gap-4 group">
          <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-blue-600/10 transition-colors">
            <Archive className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">Preservação Vitalícia</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">Backup redundante e arquivo físico climatizado para garantir a integridade histórica dos registros produzidos na unidade.</p>
          </div>
        </div>
        <div className="flex gap-4 group">
          <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-orange-500/10 transition-colors">
            <AlertTriangle className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 transition-colors" />
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">Suporte ao SAME</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">Problemas na digitalização ou busca de registros? Contate o suporte interno no ramal 445 ou via chat administrativo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
