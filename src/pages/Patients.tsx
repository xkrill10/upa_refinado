import { usePatients, Patient } from "@/hooks/use-patients";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, ClipboardList, Eye, User, Bell, Megaphone, X, Volume2, VolumeX, Ban, Info, Users, Activity, CheckCircle2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn, formatWords } from "@/lib/utils";
import { PatientDetailsModal } from "@/components/PatientDetailsModal";

export default function Patients() {
  const navigate = useNavigate();
  const { patients, callPatient, updatePatient, isAudioEnabled, setIsAudioEnabled } = usePatients();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCallControl, setShowCallControl] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [patientForModal, setPatientForModal] = useState<Patient | null>(null);
  
  // New States for Filters and Pagination
  const [activeFilter, setActiveFilter] = useState<'all' | 'attending' | 'waiting' | 'completed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.cpf.includes(searchTerm);
    const matchesBase = p.status !== 'evasion';
    
    const matchesCardFilter = 
      activeFilter === 'all' ? true :
      activeFilter === 'attending' ? p.status === 'attending' :
      activeFilter === 'waiting' ? p.status === 'waiting' :
      activeFilter === 'completed' ? p.status === 'completed' : true;

    return matchesSearch && matchesBase && matchesCardFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / itemsPerPage));
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Garantir que a página atual não fique além do limite ao filtrar
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const getRiskDetails = (risk: string) => {
    switch(risk) {
      case 'emergency': return { label: 'Emergência', color: 'bg-red-500 text-white dark:bg-red-600/90 shadow-[0_0_15px_rgba(239,68,68,0.25)]' };
      case 'very-urgent': return { label: 'Muito Urgente', color: 'bg-orange-500 text-white dark:bg-orange-600/90 shadow-[0_0_15px_rgba(249,115,22,0.25)]' };
      case 'urgent': return { label: 'Urgente', color: 'bg-amber-400 text-slate-950 dark:bg-amber-500/90 shadow-[0_0_15px_rgba(251,191,36,0.18)]' };
      case 'less-urgent': return { label: 'Pouco Urgente', color: 'bg-emerald-500 text-white dark:bg-emerald-600/90 shadow-[0_0_15px_rgba(16,185,129,0.18)]' };
      case 'not-urgent': return { label: 'Não Urgente', color: 'bg-blue-500 text-white dark:bg-blue-600/90 shadow-[0_0_15px_rgba(59,130,246,0.18)]' };
      case 'evasion': return { label: 'Evasão', color: 'bg-slate-400 text-white dark:bg-slate-500/90' };
      default: return { label: risk, color: 'bg-slate-500 text-white' };
    }
  };

  const getStatusDetails = (status: string) => {
    switch(status) {
      case 'waiting': return { label: 'Aguardando', color: 'text-orange-600 bg-orange-500/10 border-orange-500/20 dark:text-orange-400 dark:bg-orange-550/15 dark:border-orange-500/30' };
      case 'attending': return { label: 'Em Atendimento', color: 'text-[#006699] bg-[#006699]/10 border-[#006699]/20 dark:text-sky-400 dark:bg-sky-500/15 dark:border-sky-500/30' };
      case 'completed': return { label: 'Finalizado', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15 dark:border-emerald-500/30' };
      case 'evasion': return { label: 'Evasão', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20 dark:text-slate-400 dark:bg-slate-500/15 dark:border-slate-500/30' };
      default: return { label: status, color: 'text-slate-550 bg-slate-500/10 border-slate-500/20 dark:text-slate-400 dark:bg-slate-500/15' };
    }
  };

  const handleCallPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowCallControl(true);
    callPatient(patient);
  };

  const exportToCSV = () => {
    const headers = ["Nome", "CPF", "Idade", "Risco", "Setor", "Status"];
    const csvContent = [
      headers.join(";"),
      ...filteredPatients.map(p => {
        const risk = getRiskDetails(p.risk).label;
        const status = getStatusDetails(p.status).label;
        const name = p.name.toUpperCase().includes('NÃO IDENTIFICADO') ? 'PACIENTE NÃO IDENTIFICADO' : p.name;
        return `"${name}";"${p.cpf}";"${p.age}";"${risk}";"${p.sector || 'Triagem'}";"${status}"`;
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pacientes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Arquivo exportado com sucesso!");
  };

  const activePatients = patients.filter(p => p.status !== 'evasion');
  const attendingCount = patients.filter(p => p.status === 'attending').length;
  const waitingCount = patients.filter(p => p.status === 'waiting').length;
  const completedCount = patients.filter(p => p.status === 'completed').length;
  const totalCount = activePatients.length;

  const statsConfig = [
    { 
      id: 'all', 
      label: "Total Ativos", 
      value: totalCount, 
      textStyle: "text-[#006699] dark:text-sky-400", 
      bgStyle: "bg-[#006699]/10 dark:bg-sky-400/10",
      activeBorder: "border-[#006699]/40 dark:border-sky-500/40 ring-1 ring-[#006699]/10 dark:ring-sky-500/10 shadow-[0_0_20px_rgba(0,102,153,0.1)]",
      icon: Users 
    },
    { 
      id: 'attending', 
      label: "Em Atendimento", 
      value: attendingCount, 
      textStyle: "text-blue-500 dark:text-blue-400", 
      bgStyle: "bg-blue-500/10 dark:bg-blue-405/10",
      activeBorder: "border-blue-500/40 dark:border-blue-500/40 ring-1 ring-blue-500/10 dark:ring-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]",
      icon: Activity 
    },
    { 
      id: 'waiting', 
      label: "Aguardando", 
      value: waitingCount, 
      textStyle: "text-amber-500 dark:text-amber-400", 
      bgStyle: "bg-amber-500/10 dark:bg-amber-405/10",
      activeBorder: "border-amber-500/40 dark:border-amber-550/40 ring-1 ring-amber-500/10 dark:ring-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.1)]",
      icon: ClipboardList 
    },
    { 
      id: 'completed', 
      label: "Finalizados", 
      value: completedCount, 
      textStyle: "text-emerald-500 dark:text-emerald-400", 
      bgStyle: "bg-emerald-500/10 dark:bg-emerald-405/10",
      activeBorder: "border-emerald-500/40 dark:border-emerald-500/40 ring-1 ring-emerald-500/10 dark:ring-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
      icon: CheckCircle2 
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#006699]/10 dark:bg-sky-400/10 flex items-center justify-center text-[#006699] dark:text-sky-400 shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">
              Controle de Pacientes
            </h1>
            <p className="text-muted-foreground text-[11px] font-black uppercase tracking-widest mt-0.5">
              Gestão centralizada de atendimentos e histórico clínico
            </p>
          </div>
        </div>
      </div>

      {/* Stats rápidas (Filtros Interativos) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => (
          <div 
            key={stat.id} 
            onClick={() => {
              setActiveFilter(stat.id as 'all' | 'attending' | 'waiting' | 'completed');
              setCurrentPage(1);
            }}
            className={cn(
              "rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer select-none",
              activeFilter === stat.id 
                ? cn("glass-card-premium font-black ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-600 shadow-2xl scale-[1.02] relative z-10", stat.activeBorder) 
                : "border-white/40 dark:border-white/10 glass-card-premium opacity-80 hover:opacity-100 hover:scale-[1.02] shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-xl"
            )}
          >
            <div className={cn("p-2.5 rounded-lg transition-transform duration-300 flex items-center justify-center shrink-0", stat.bgStyle, stat.textStyle, activeFilter === stat.id && "scale-110")}>
              <stat.icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className={cn("text-[10px] font-bold uppercase tracking-wider text-muted-foreground")}>{stat.label}</p>
              <p className={cn("text-xl font-black mt-0.5", stat.textStyle)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-[#006699] dark:group-focus-within:text-sky-400" />
          <Input 
            placeholder="Buscar por nome ou CPF..." 
            className="pl-10 h-11 glass-card-premium border-white/40 dark:border-white/10 focus-visible:ring-[#006699]/40 dark:focus-visible:ring-sky-500/40 text-foreground transition-all rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] placeholder:text-muted-foreground/60" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={exportToCSV}
          className="w-full md:w-auto h-11 rounded-xl font-bold gap-2 text-foreground border-white/40 dark:border-white/10 glass-card-premium hover:text-[#006699] dark:hover:text-sky-400 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:scale-[1.02]"
        >
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      <Card className="glass-card-premium border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden rounded-2xl transition-colors duration-500">
        <CardContent className="p-0">
          <TooltipProvider>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gradient-to-r from-white/40 to-white/10 dark:from-slate-900/40 dark:to-slate-900/10 backdrop-blur-md border-b border-white/40 dark:border-white/10">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-[#006699] dark:text-sky-400 h-12 text-[10px] font-black uppercase tracking-widest pl-6">Paciente</TableHead>
                    <TableHead className="text-[#006699] dark:text-sky-400 h-12 text-[10px] font-black uppercase tracking-widest text-center">Idade</TableHead>
                    <TableHead className="text-[#006699] dark:text-sky-400 h-12 text-[10px] font-black uppercase tracking-widest text-center">Risco</TableHead>
                    <TableHead className="text-[#006699] dark:text-sky-400 h-12 text-[10px] font-black uppercase tracking-widest">Setor</TableHead>
                    <TableHead className="text-[#006699] dark:text-sky-400 h-12 text-[10px] font-black uppercase tracking-widest text-center">Status</TableHead>
                    <TableHead className="text-[#006699] dark:text-sky-400 h-12 text-[10px] font-black uppercase tracking-widest text-right pr-6">Ações Rápidas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-semibold">
                        Nenhum paciente encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPatients.map((patient) => {
                      const risk = getRiskDetails(patient.risk);
                      const status = getStatusDetails(patient.status);
                      
                      return (
                        <TableRow key={patient.id} className="border-b border-slate-200/30 dark:border-slate-800/30 hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors group">
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-xl bg-slate-100/50 dark:bg-slate-900/30 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200/30 dark:border-slate-800/30 transition-colors group-hover:bg-[#006699]/10 group-hover:text-[#006699] dark:group-hover:text-sky-400 group-hover:border-[#006699]/20 dark:group-hover:border-sky-500/20">
                                <User className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <button 
                                  onClick={() => navigate(`/paciente/${patient.id}/evolucao`, { state: { from: '/pacientes', label: 'Pacientes' } })}
                                  className="font-bold text-sm text-foreground hover:text-[#006699] dark:hover:text-sky-400 transition-all text-left"
                                >
                                  {patient.name.toUpperCase().includes('NÃO IDENTIFICADO') || patient.name.toUpperCase().includes('DESCONHECIDO') 
                                    ? "PACIENTE NÃO IDENTIFICADO" 
                                    : formatWords(patient.name)}
                                </button>
                                <span className="text-xs text-muted-foreground font-semibold">CPF: {patient.cpf}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-sm font-black text-foreground">
                            {patient.age}a
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Badge className={cn(risk.color, "text-[10px] font-black uppercase tracking-wider w-28 h-7 flex items-center justify-center border-0 rounded-lg shadow-sm whitespace-nowrap transition-transform hover:scale-105")}>
                                {risk.label}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-bold text-muted-foreground/90 uppercase tracking-wider">
                            {patient.sector || "Triagem"}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Badge variant="outline" className={cn(status.color, "font-black text-[10px] px-0 py-1 border rounded-lg whitespace-nowrap w-28 justify-center h-7")}>
                                {status.label}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-6 py-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-muted-foreground transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/40"
                                    onClick={() => {
                                      setPatientForModal(patient);
                                      setIsDetailsModalOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Informações Detalhadas</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 text-muted-foreground transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/40"
                                    onClick={() => handleCallPatient(patient)}
                                  >
                                    <Bell className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Chamar Senha</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-600 dark:hover:text-sky-400 text-muted-foreground transition-all border border-transparent hover:border-sky-100 dark:hover:border-sky-900/40"
                                    onClick={() => navigate(`/paciente/${patient.id}`, { state: { from: '/pacientes', label: 'Pacientes' } })}
                                  >
                                    <ClipboardList className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Exame Físico / Prontuário</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-red-550 dark:hover:text-red-400 text-muted-foreground transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                                    onClick={() => {
                                      updatePatient(patient.id, { risk: 'evasion', status: 'evasion' });
                                      toast.info("Paciente sinalizado como Evasão");
                                    }}
                                  >
                                    <Ban className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Sinalizar Evasão</TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-white/40 dark:border-white/10 bg-white/20 dark:bg-slate-900/30 backdrop-blur-md text-foreground">
                <p className="text-xs font-bold text-muted-foreground">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredPatients.length)} de {filteredPatients.length} pacientes
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg font-black uppercase text-[10px] tracking-wider border border-white/40 dark:border-white/10 text-foreground glass-card-premium hover:text-[#006699] dark:hover:text-sky-400"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                  </Button>
                  <p className="text-xs font-bold px-2 text-foreground">
                    Página {currentPage} de {totalPages}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg font-black uppercase text-[10px] tracking-wider border border-white/40 dark:border-white/10 text-foreground glass-card-premium hover:text-[#006699] dark:hover:text-sky-400"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próximo <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
            
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Call Control Dialog */}
      <Dialog open={showCallControl} onOpenChange={setShowCallControl}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] [&>button]:hidden">
          <DialogHeader className={cn(
            "p-6 text-white transition-colors duration-500 border-b border-slate-200/20 dark:border-slate-800/20",
            selectedPatient?.risk === 'emergency' ? 'bg-red-650 bg-red-600' :
            selectedPatient?.risk === 'very-urgent' ? 'bg-orange-500' :
            selectedPatient?.risk === 'urgent' ? 'bg-amber-400 text-slate-950' :
            selectedPatient?.risk === 'less-urgent' ? 'bg-emerald-600' :
            (selectedPatient?.priority === 'preferential' ? 'bg-purple-650 bg-purple-600' : 
             selectedPatient?.priority === 'pediatric' ? 'bg-orange-600' : 'bg-[#006699]')
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Megaphone className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black uppercase tracking-tight text-white">Controle de Chamada</DialogTitle>
                  <DialogDescription className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mt-1.5",
                    selectedPatient?.risk === 'urgent' ? 'text-black/60' : 'text-white/70'
                  )}>Sincronizado com o Painel Central</DialogDescription>
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

          <div className="p-8 space-y-8 bg-transparent text-center">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Chamando agora</p>
              <h2 className={cn(
                "text-6.5xl text-6xl sm:text-7xl font-black tracking-tighter leading-none mb-4",
                selectedPatient?.risk === 'emergency' ? 'text-red-500' :
                selectedPatient?.risk === 'very-urgent' ? 'text-orange-500' :
                selectedPatient?.risk === 'urgent' ? 'text-amber-500' :
                selectedPatient?.risk === 'less-urgent' ? 'text-emerald-550 text-emerald-500' :
                (selectedPatient?.priority === 'preferential' ? 'text-purple-600' : 
                 selectedPatient?.priority === 'pediatric' ? 'text-orange-600' : 'text-[#006699] dark:text-sky-400')
              )}>{selectedPatient?.ticket || "S/N"}</h2>
              <p className="text-sm font-bold text-foreground uppercase">
                {selectedPatient?.name.toUpperCase().includes('NÃO IDENTIFICADO') || selectedPatient?.name.toUpperCase().includes('DESCONHECIDO') 
                  ? "PACIENTE NÃO IDENTIFICADO" 
                  : formatWords(selectedPatient?.name || "")}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">{selectedPatient?.age} ANOS • CPF: {selectedPatient?.cpf}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button 
                onClick={() => {
                  if (selectedPatient) {
                    callPatient(selectedPatient);
                    toast.success("Chamada enviada novamente ao painel.");
                  }
                }}
                className={cn(
                  "h-16 rounded-xl text-white font-black uppercase tracking-widest text-sm shadow-xl gap-3 transition-all duration-300 border-none",
                  selectedPatient?.risk === 'emergency' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' :
                  selectedPatient?.risk === 'very-urgent' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' :
                  selectedPatient?.risk === 'urgent' ? 'bg-amber-400 hover:bg-amber-500/90 shadow-amber-400/20 text-slate-950' :
                  selectedPatient?.risk === 'less-urgent' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' :
                  'bg-[#006699] hover:bg-[#005580] dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 shadow-[#006699]/15'
                )}
              >
                <Volume2 className="h-6 w-6" />
                Chamar Novamente
              </Button>

              <div 
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-all shadow-sm"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`p-2 rounded-lg ${isAudioEnabled ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600'}`}>
                    {isAudioEnabled ? <Volume2 className="h-5 w-5 text-emerald-500" /> : <VolumeX className="h-5 w-5 text-red-500" />}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-foreground">Áudio do Painel</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">{isAudioEnabled ? 'Ativado (Voz + Chime)' : 'Desativado (Mudo)'}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "h-8 w-14 rounded-full transition-all relative flex items-center shrink-0",
                    isAudioEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-800"
                  )}
                >
                  <div className={cn(
                    "absolute h-6 w-6 rounded-full bg-white transition-all shadow-md",
                    isAudioEnabled ? "right-1" : "left-1"
                  )} />
                </div>
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
      <PatientDetailsModal 
        patient={patientForModal}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </motion.div>
  );
}
