import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Calendar, 
  Clock, 
  Award, 
  ShieldAlert, 
  MoreHorizontal, 
  Plus, 
  Search, 
  CheckCircle2, 
  UserPlus,
  Stethoscope,
  Briefcase,
  User,
  History,
  ArrowRight,
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TimeTracker } from "@/components/hr/TimeTracker";
import { NewStaffModal } from "@/components/hr/NewStaffModal";

export default function HR() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");
  
  const [staff, setStaff] = useState([
    { id: 1, name: 'Dr. João Mendes', role: 'Médico Plantonista', status: 'In-Shift', shift: '07:00 - 19:00', specialty: 'Clínica Médica', category: 'medico', docStatus: 'active', training: 90 },
    { id: 2, name: 'Dra. Maria Clara', role: 'Médico Plantonista', status: 'Off-Shift', shift: 'N/A', specialty: 'Pediatria', category: 'medico', docStatus: 'warning', training: 45 },
    { id: 3, name: 'Ricardo Silva', role: 'Enfermeiro Triagem', status: 'In-Shift', shift: '13:00 - 01:00', specialty: 'Emergência', category: 'enfermagem', docStatus: 'active', training: 100 },
    { id: 4, name: 'Amanda Lemos', role: 'Técnico Enfermagem', status: 'On-Call', specialty: 'Geral', shift: 'Sobreaviso', category: 'enfermagem', docStatus: 'active', training: 85 },
    { id: 5, name: 'Soraia Alves', role: 'Gestão/Adm', status: 'In-Shift', shift: '08:00 - 18:00', specialty: 'Recursos Humanos', category: 'administrativo', docStatus: 'active', training: 100 },
  ]);

  const swapRequests = [
    { id: 1, from: "Dr. João Mendes", to: "Dra. Maria Clara", date: "15/05/2030", shift: "Diurno", status: "pending" },
    { id: 2, from: "Ricardo Silva", to: "Ana Paula", date: "18/05/2030", shift: "Noturno", status: "pending" }
  ];

  const notifications = [
    { id: 1, text: "CRM vencendo em 15 dias: Dra. Maria Clara", type: "warning" },
    { id: 2, text: "Atraso registrado: Ricardo Silva (15 min)", type: "info" }
  ];

  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    specialty: "",
    shift: "07:00 - 19:00"
  });

  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           member.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "todos" || member.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [staff, searchTerm, activeCategory]);

  const handleUpdateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Escala atualizada!", {
      description: "As alterações foram publicadas para o corpo clínico.",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    });
    setIsScheduleOpen(false);
  };

  const handleAddStaff = () => {
    if (!newStaff.name) {
      toast.error("Selecione um profissional");
      return;
    }
    
    // In a real app we'd get the actual staff data
    const memberNames: Record<string, string> = {
      "1": "Dr. Carlos Souza",
      "2": "Enf. Ana Paula",
      "3": "Dra. Beatriz Lima"
    };

    const roles: Record<string, string> = {
      "1": "Médico Plantonista",
      "2": "Enfermeiro",
      "3": "Médico Plantonista"
    };

    const specialties: Record<string, string> = {
      "1": "Clínica",
      "2": "Urgência",
      "3": "Pediatria"
    };

    const id = Date.now();
    const name = memberNames[newStaff.name] || "Novo Profissional";
    const role = roles[newStaff.name] || "Plantonista";
    const specialty = specialties[newStaff.name] || "Geral";
    const shift = newStaff.shift === 'day' ? "07:00 - 19:00" : (newStaff.shift === 'night' ? "19:00 - 07:00" : "24h");

    setStaff(prev => [...prev, {
      id,
      name,
      role,
      specialty,
      status: 'On-Call',
      shift
    }]);

    toast.success(`${name} adicionado à escala.`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recursos Humanos</h1>
          <p className="text-muted-foreground font-medium">Gestão de escalas, plantões e corpo clínico</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 h-11 px-4 rounded-xl font-bold border-border/40"
            onClick={() => setIsNewStaffModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Novo Profissional
          </Button>
          <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all">
                <Calendar className="h-4 w-4" />
                Gerenciar Escala
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] rounded-[2rem] p-0 overflow-hidden glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
              <form onSubmit={handleUpdateSchedule}>
                <DialogHeader className="p-8 bg-primary text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest">Painel Administrativo Próximo Período</Badge>
                  </div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tight mission-control-title">Gestão de Escalas e Plantões</DialogTitle>
                  <DialogDescription className="text-white/70 font-medium">Configure a cobertura médica e assistencial para as próximas 24 horas.</DialogDescription>
                </DialogHeader>
              
              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                      <Stethoscope className="h-3 w-3" />
                      Novo Plantonista
                    </div>
                    <div className="space-y-4 rounded-3xl border border-border/50 bg-white/5 dark:bg-slate-900/5 backdrop-blur-sm p-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Profissional</Label>
                        <Select onValueChange={(val) => setNewStaff(p => ({ ...p, name: val }))}>
                          <SelectTrigger className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm">
                            <SelectValue placeholder="Selecione o membro" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm">
                            <SelectItem value="1">Dr. Carlos Souza (Clínica)</SelectItem>
                            <SelectItem value="2">Enf. Ana Paula (Urgência)</SelectItem>
                            <SelectItem value="3">Dra. Beatriz Lima (Pediatria)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Turno de Trabalho</Label>
                        <Select defaultValue="day" onValueChange={(val) => setNewStaff(p => ({ ...p, shift: val }))}>
                          <SelectTrigger className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm">
                            <SelectValue placeholder="Selecione o turno" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm">
                            <SelectItem value="day">Diurno (07:00 - 19:00)</SelectItem>
                            <SelectItem value="night">Noturno (19:00 - 07:00)</SelectItem>
                            <SelectItem value="special">Especial / 24h</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full h-12 rounded-xl border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary/5"
                        onClick={handleAddStaff}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Adicionar à Escala
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                        <Briefcase className="h-3 w-3" />
                        Visualização Rápida
                      </div>
                      <Badge variant="outline" className="text-[9px] font-black">2 Pedidos de Troca</Badge>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: "Dr. João Mendes", time: "07:00 - 19:00", active: true },
                        { name: "Ricardo Silva", time: "13:00 - 01:00", active: true },
                        { name: "Dra. Maria Clara", time: "19:00 - 07:00", active: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-border/50 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className={cn("h-2 w-2 rounded-full", item.active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
                            <span className="text-xs font-bold uppercase tracking-tight">{item.name}</span>
                          </div>
                          <span className="text-[10px] font-black font-mono text-muted-foreground bg-muted p-1 px-2 rounded-lg">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 backdrop-blur-sm p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600">
                    <ShieldAlert className="h-4 w-4" />
                    Zonas de Atenção / Déficits
                  </div>
                  <p className="text-xs text-red-800/70 leading-relaxed font-medium">
                    A ala de **Urgência 2** está com cobertura parcial para o turno noturno. É necessário remanejar ou convocar um profissional de sobreaviso.
                  </p>
                </div>
              </div>

              <DialogFooter className="p-8 pt-0 flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="rounded-xl h-12 px-6 font-black uppercase tracking-widest text-[10px]" 
                  onClick={() => setIsScheduleOpen(false)}
                >
                  Descartar Alterações
                </Button>
                <Button 
                  type="submit" 
                  className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 flex-1"
                >
                  Confirmar e Notificar Equipe
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>

      <div className="mb-8">
        <TimeTracker />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
        <Card className="glass-card-premium rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex justify-between items-center">
              Em Plantão (Agora)
              <Users className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 font-black text-xl border border-green-500/20 shadow-inner">12</div>
              <p className="text-sm font-medium text-foreground/80">Profissionais ativos na unidade</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card-premium rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex justify-between items-center">
              Déficit de Escala
              <ShieldAlert className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 font-black text-xl border border-red-500/20 shadow-inner">2</div>
              <p className="text-sm font-medium text-foreground/80">Postos sem cobertura p/ noite</p>
            </div>
            <ShieldAlert className="h-6 w-6 text-red-500 animate-pulse" />
          </CardContent>
        </Card>

        <Card className="glass-card-premium rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex justify-between items-center">
              Especialidades
              <Award className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl border border-blue-500/20 shadow-inner">6</div>
              <p className="text-sm font-medium text-foreground/80">Áreas cobertas no plantão</p>
            </div>
            <Award className="h-6 w-6 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="glass-card-premium overflow-hidden rounded-xl">
            <CardHeader className="p-8 border-b border-border/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-black uppercase tracking-tight mission-control-title flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Corpo Clínico & Equipe
                  </CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Status operacional em tempo real</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Filtrar equipe..." 
                      className="pl-10 h-10 rounded-xl border-white/40 dark:border-slate-800/20 bg-white/30 dark:bg-slate-950/40 backdrop-blur-sm shadow-inner"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="h-10 rounded-xl font-black uppercase text-[9px] tracking-widest border-border/40">
                    Exportar
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'medico', label: 'Médicos' },
                  { id: 'enfermagem', label: 'Enfermagem' },
                  { id: 'administrativo', label: 'Administração' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                      activeCategory === cat.id 
                        ? "bg-primary text-white shadow-md shadow-primary/20" 
                        : "bg-white/30 dark:bg-slate-800/30 text-muted-foreground hover:bg-white/65 dark:hover:bg-slate-800/60 border border-white/40 dark:border-slate-700/20 backdrop-blur-sm"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-none">
                    <TableHead className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-10">Profissional</TableHead>
                    <TableHead className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cargo/Especialidade</TableHead>
                    <TableHead className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Treinamento</TableHead>
                    <TableHead className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Documentos</TableHead>
                    <TableHead className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                    <TableHead className="p-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground pr-10">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredStaff.map((member) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={member.id} 
                        className="hover:bg-muted/20 transition-all border-border/50 group"
                      >
                        <TableCell className="p-5 pl-10">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center font-black text-[10px] text-muted-foreground border border-border/50 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="text-sm font-bold uppercase tracking-tight">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-tight text-foreground/80">{member.role}</span>
                            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{member.specialty}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-5">
                          <div className="flex flex-col items-center gap-1 min-w-[80px]">
                            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full transition-all",
                                  member.training > 80 ? "bg-emerald-500" : member.training > 50 ? "bg-amber-500" : "bg-red-500"
                                )} 
                                style={{ width: `${member.training}%` }}
                              />
                            </div>
                            <span className="text-[8px] font-black text-muted-foreground">{member.training}% Concluído</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-5 text-center">
                          <div className="flex justify-center">
                            {member.docStatus === 'active' ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <ShieldAlert className="h-4 w-4 text-amber-500 animate-pulse" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="p-5">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[9px] font-black uppercase px-2 shadow-sm rounded-full border-none",
                              member.status === 'In-Shift' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 
                              member.status === 'On-Call' ? 'bg-amber-500 text-white shadow-amber-500/20' : 
                              'bg-slate-400 text-white'
                            )}
                          >
                            {member.status === 'In-Shift' ? 'Em Plantão' : 
                             member.status === 'On-Call' ? 'Sobreaviso' : 'Off-Shift'}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-5 text-right pr-10">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted transition-colors opacity-40 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-xl p-2" align="end">
                              <DropdownMenuItem className="rounded-lg font-bold text-xs uppercase" onClick={() => toast.info(`Perfil: ${member.name}`)}>
                                <User className="h-3 w-3 mr-2" /> Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg font-bold text-xs uppercase">
                                <History className="h-3 w-3 mr-2" /> Histórico
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg font-bold text-xs uppercase text-red-600">
                                <ShieldAlert className="h-3 w-3 mr-2" /> Documentação
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card-premium rounded-xl overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className={cn(
                  "p-3 rounded-2xl text-[10px] font-bold border flex gap-2 items-start transition-all",
                  n.type === 'warning' ? "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400 backdrop-blur-sm" : "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400 backdrop-blur-sm"
                )}>
                  <ShieldAlert className="h-3 w-3 mt-0.5" />
                  {n.text}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card-premium rounded-xl overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                Trocas Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              {swapRequests.map((req) => (
                <div key={req.id} className="p-3 rounded-2xl bg-white/40 dark:bg-slate-800/25 border border-white/40 dark:border-slate-800/30 hover:bg-white/70 dark:hover:bg-slate-700/40 transition-all hover:shadow-lg hover:shadow-sky-500/5 group/req relative backdrop-blur-sm">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Ref #{req.id}</span>
                      <Badge variant="secondary" className="text-[8px] font-black bg-white/50 dark:bg-slate-800">{req.shift}</Badge>
                    </div>
                    <div className="text-[11px] font-bold">
                      {req.from.split(" ")[1]} <ArrowRight className="inline h-2 w-2 opacity-30" /> {req.to.split(" ")[1]}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Button variant="outline" className="h-7 px-2 text-[8px] font-black uppercase flex-1 border-white/50 dark:border-slate-700 bg-white/35 dark:bg-slate-800/35 hover:bg-white/60 dark:hover:bg-slate-700" onClick={() => toast.success("Troca aprovada!")}>Aprovar</Button>
                      <Button variant="ghost" className="h-7 px-2 text-[8px] font-black uppercase flex-1 text-red-500 hover:bg-red-500/10" onClick={() => toast.error("Troca rejeitada")}>Negar</Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full h-8 text-[9px] font-black uppercase tracking-widest hover:bg-primary/5">
                Ver Todas ({swapRequests.length + 3})
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card-premium border border-blue-500/20 dark:border-blue-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl overflow-hidden group relative">
            {/* Ambient glows */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-400/10 dark:bg-cyan-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all duration-700 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/10 dark:bg-blue-500/10 rounded-full blur-3xl group-hover:bg-indigo-400/20 transition-all duration-700 pointer-events-none" />

            <CardHeader className="p-6 pb-2 relative z-10">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Award className="h-3.5 w-3.5 text-blue-500" />
                Taxa de Adesão
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 relative z-10">
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tabular-nums tracking-tighter text-blue-950 dark:text-white drop-shadow-sm">94</span>
                    <span className="text-xl font-bold text-blue-500">%</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-50/50 dark:bg-white/10 flex items-center justify-center border border-blue-100 dark:border-white/20 backdrop-blur-md shadow-inner group-hover:bg-blue-100 dark:group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                    <Award className="h-5 w-5 text-blue-600 dark:text-cyan-300" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden shadow-inner backdrop-blur-sm border border-slate-200 dark:border-white/5">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-blue-400 dark:to-cyan-300 w-[94%] shadow-[0_0_15px_rgba(56,189,248,0.4)] rounded-full" />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex justify-between">
                    <span>Escalas preenchidas</span>
                    <span className="text-blue-600 dark:text-cyan-400">Meta: 90%</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <NewStaffModal 
        open={isNewStaffModalOpen} 
        onOpenChange={setIsNewStaffModalOpen} 
      />
    </motion.div>
  );
}
