import { useState } from "react";
import { usePatients, Patient } from "@/hooks/use-patients";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Save,
  MapPin,
  AlertTriangle,
  Users,
  ClipboardList,
  Activity,
  Heart,
  Clock,
  CheckCircle2,
  User,
  DoorOpen,
  CheckSquare,
  LogOut,
  Megaphone,
  Volume2,
  VolumeX,
  X,
  Eraser,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn, formatWords } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


const COUNTERS = [
  { id: "GUICHE_1", name: "Guichê 1", type: "standard", icon: User },
  { id: "GUICHE_2", name: "Guichê 2", type: "standard", icon: User },
  { id: "GUICHE_3", name: "Guichê 3", type: "standard", icon: User },
];

const CHECKLIST_ITEMS = [
  { id: "impressora", category: "Preparação", text: "Conferir bobina de papel da impressora" },
  { id: "leitores", category: "Preparação", text: "Testar leitor de cartão SUS e documentos" },
  { id: "contingencia", category: "Preparação", text: "Organizar formulários físicos de contingência" },
  { id: "espera", category: "Operação", text: "Monitorar fila de triados pendentes de cadastro" },
  { id: "prioridades", category: "Operação", text: "Priorizar atendimento a preferenciais (Lei nº 10.048)" },
  { id: "fechamento", category: "Fechamento", text: "Conferir pendências de cadastro no fim do turno" },
  { id: "organizacao", category: "Fechamento", text: "Organizar e higienizar a bancada para a próxima equipe" },
];

export default function NewPatient() {
  const {
    patients,
    updatePatient,
    callTicket,
    isAudioEnabled,
    setIsAudioEnabled,
  } = usePatients();

  
  
  const [pendingCounter, setPendingCounter] = useState<any>(null);
  const [receptionistName, setReceptionistName] = useState(() => localStorage.getItem("upa_receptionist_name") || "");

  const [receptionistMatricula, setReceptionistMatricula] = useState(() => localStorage.getItem("upa_receptionist_matricula") || "");
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("upa_receptionist_checklist");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  const toggleChecklistItem = (id: string) => {
    const updated = { ...checklist, [id]: !checklist[id] };
    setChecklist(updated);
    localStorage.setItem("upa_receptionist_checklist", JSON.stringify(updated));
  };


  const [selectedCounter, setSelectedCounter] = useState<{id: string, name: string, icon?: any} | null>(() => {
    const saved = localStorage.getItem("upa_active_counter");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleSelectCounter = (counter: any) => {
    setPendingCounter(counter);
  };

  const handleAssumirGuiche = () => {
    if (!pendingCounter || !receptionistName.trim() || !receptionistMatricula.trim()) {
      toast.error("Por favor, preencha seu nome e matrícula.");
      return;
    }
    setSelectedCounter(pendingCounter);
    localStorage.setItem("upa_active_counter", JSON.stringify({id: pendingCounter.id, name: pendingCounter.name}));
    localStorage.setItem("upa_receptionist_name", receptionistName.trim());
    localStorage.setItem("upa_receptionist_matricula", receptionistMatricula.trim());
    setPendingCounter(null);
  };

  const handleExitCounter = () => {
    setSelectedCounter(null);
    localStorage.removeItem("upa_active_counter");
    localStorage.removeItem("upa_receptionist_checklist");
    setChecklist({});
    setIsExitModalOpen(false);
    toast.success("Turno encerrado. Bom descanso!");
  };

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [showCallControl, setShowCallControl] = useState(false);
  const [callingTicket, setCallingTicket] = useState<{
    ticket: string;
    patientName: string;
    risk: Patient["risk"];
    priority: Patient["priority"];
    age?: number;
    cpf?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    socialName: "",
    cpf: "",
    susCard: "",
    rg: "",
    organIssuer: "",
    birthDate: "",
    gender: "",
    motherName: "",
    companionName: "",
    companionRelation: "",
    companionCpf: "",
    companionPhone: "",
    attendanceType: "clinico",
    nationality: "Brasileira",
    birthPlace: "",
    race: "",
    maritalStatus: "",
    profession: "",
    religion: "",
    pcd: "nao",
    phone1: "",
    phone2: "",
    email: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  // Filter patients who are triaged but registration is not complete
  const waitingRegistration = patients
    .filter(
      (p) =>
        p.triaged &&
        !p.registrationComplete &&
        p.status !== "completed" &&
        p.status !== "evasion",
    )
    .sort(
      (a, b) =>
        new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime(),
    );

  const getRiskDetails = (risk: string) => {
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
        return { label: risk, color: "bg-slate-500 text-white" };
    }
  };

  const handleClearAtendimento = () => {
    setFormData((prev) => ({
      ...prev,
      attendanceType: "clinico",
    }));
  };

  const handleClearPessoais = () => {
    if (!selectedPatient) return;
    setFormData((prev) => ({
      ...prev,
      name: selectedPatient.name.includes("Pré-cadastro") ? "" : selectedPatient.name || "",
      socialName: "",
      cpf: selectedPatient.cpf || "",
      susCard: "",
      rg: "",
      organIssuer: "",
      birthDate: selectedPatient.birthDate || "",
      gender: selectedPatient.gender || "",
      motherName: "",
    }));
  };

  const handleClearComplementares = () => {
    setFormData((prev) => ({
      ...prev,
      nationality: "Brasileira",
      birthPlace: "",
      race: "",
      maritalStatus: "",
      profession: "",
      religion: "",
      pcd: "nao",
    }));
  };

  const handleClearAcompanhante = () => {
    setFormData((prev) => ({
      ...prev,
      companionName: "",
      companionRelation: "",
      companionCpf: "",
      companionPhone: "",
    }));
  };

  const handleClearLocalizacao = () => {
    setFormData((prev) => ({
      ...prev,
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      phone1: "",
      phone2: "",
      email: "",
    }));
  };

  const handleOpenRegistration = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name.includes("Pré-cadastro") ? "" : patient.name || "",
      socialName: patient.socialName || "",
      cpf: patient.cpf || "",
      susCard: patient.susCard || "",
      rg: patient.rg || "",
      organIssuer: patient.organIssuer || "",
      birthDate: patient.birthDate || "",
      gender: patient.gender || "",
      motherName: patient.motherName || "",
      companionName: patient.companionName || "",
      companionRelation: patient.companionRelation || "",
      companionCpf: patient.companionCpf || "",
      companionPhone: patient.companionPhone || "",
      attendanceType: patient.attendanceType || "clinico",
      nationality: patient.nationality || "Brasileira",
      birthPlace: patient.birthPlace || "",
      race: patient.race || "",
      maritalStatus: patient.maritalStatus || "",
      profession: patient.profession || "",
      religion: patient.religion || "",
      pcd: patient.pcd || "nao",
      phone1: patient.phone1 || "",
      phone2: patient.phone2 || "",
      email: patient.email || "",
      cep: patient.cep || "",
      street: patient.street || "",
      number: patient.number || "",
      complement: patient.complement || "",
      neighborhood: patient.neighborhood || "",
      city: patient.city || "",
      state: patient.state || "",
    });
    setIsModalOpen(true);
  };

  const handleCallPatient = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    const ticketToUse = patient.ticket || "GERAL";

    setCallingTicket({
      ticket: ticketToUse,
      patientName: patient.name,
      risk: patient.risk || "not-urgent",
      priority: patient.priority || "normal",
      age: patient.age,
      cpf: patient.cpf,
    });
    setShowCallControl(true);
    callTicket(
      ticketToUse,
      selectedCounter ? selectedCounter.name.toUpperCase() : "RECEPÇÃO",
      patient.risk || "not-urgent",
      patient.name,
    );
  };

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  };

  const maskSUS = (value: string) => {
    return value.replace(/\D/g, "").substring(0, 15);
  };

  const handleChange = (field: string, value: string) => {
    let finalValue = value;

    if (
      [
        "name",
        "socialName",
        "street",
        "neighborhood",
        "city",
        "motherName",
        "companionName",
        "companionRelation",
        "nationality",
        "birthPlace",
        "profession",
        "religion",
      ].includes(field)
    ) {
      finalValue = formatWords(value);
    }

    if (field === "cpf" || field === "companionCpf")
      finalValue = maskCPF(value);
    if (field === "susCard") finalValue = maskSUS(value);
    if (field === "phone1" || field === "phone2" || field === "companionPhone")
      finalValue = maskPhone(value);
    if (field === "cep") {
      finalValue = maskCEP(value);
      if (finalValue.length === 9) handleCEPLookup(finalValue);
    }

    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };

  const handleCEPLookup = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCEP}/json/`,
        );
        const data = await response.json();

        if (data.erro) {
          toast.error("CEP não encontrado.");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          street: formatWords(data.logradouro),
          neighborhood: formatWords(data.bairro),
          city: formatWords(data.localidade),
          state: data.uf.toUpperCase(),
        }));
        toast.success("Endereço preenchido automaticamente!");
      } catch (error) {
        console.error("CEP Lookup Error:", error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.cpf) {
      toast.error("Por favor, preencha os campos obrigatórios (*)");
      return;
    }

    if (!selectedPatient) return;

    const birthDate = new Date(formData.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    updatePatient(selectedPatient.id, {
      ...formData,
      age: isNaN(age) ? selectedPatient.age : age,
      registrationComplete: true,
    });

    toast.success(
      "Cadastro completo com sucesso! Paciente encaminhado para atendimento.",
    );
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  if (!selectedCounter) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] p-4 sm:p-8 pt-12 sm:pt-20 relative animate-in fade-in duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#006699]/5 dark:bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl w-full z-10 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] border border-white/50 dark:border-white/10 mb-2">
              <UserPlus className="h-8 w-8 text-[#006699] dark:text-sky-400" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              Painel da Recepção
            </h1>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs max-w-xl mx-auto opacity-80">
              Selecione um guichê disponível para iniciar seu turno de atendimento.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {COUNTERS.map(counter => (
              <motion.div key={counter.id} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                 <Card
                   className="relative overflow-hidden cursor-pointer transition-all duration-300 h-full border-2 border-[#006699]/20 dark:border-sky-500/20 hover:border-[#006699]/40 dark:hover:border-sky-500/40 hover:shadow-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md"
                   onClick={() => handleSelectCounter(counter)}
                 >
                   <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                     <div className="p-4 rounded-2xl bg-[#006699]/10 dark:bg-sky-500/10 text-[#006699] dark:text-sky-400">
                       <counter.icon className="h-8 w-8" />
                     </div>
                     <div className="space-y-1">
                       <h3 className="font-black text-lg uppercase tracking-wider text-foreground">
                         {counter.name.split(" ")[0]}
                         <span className="ml-4 text-[#006699] dark:text-sky-400">
                           {counter.name.split(" ")[1]}
                         </span>
                       </h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Livre para entrada</p>
                     </div>
                   </CardContent>
                 </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <Dialog open={!!pendingCounter} onOpenChange={(open) => !open && setPendingCounter(null)}>
          <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl [&>button]:hidden">
            <div className="p-8 text-center text-white relative shadow-lg backdrop-blur-md transition-colors duration-300 bg-gradient-to-br from-[#006699]/90 to-[#004466]/90 dark:from-sky-600/50 dark:to-sky-900/50">
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <DoorOpen className="h-8 w-8" />
              </div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                Assumir Guichê
              </DialogTitle>
              <DialogDescription className="text-white/80 font-medium text-sm">
                Você está prestes a iniciar os atendimentos no <br/>
                <strong className="text-white">{pendingCounter?.name}</strong>.
              </DialogDescription>
            </div>

            <div className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block text-left">
                  Nome do(a) Recepcionista:
                </label>
                <Input
                  value={receptionistName}
                  onChange={(e) => setReceptionistName(formatWords(e.target.value))}
                  placeholder="Ex: Maria Santos"
                  className="h-12 rounded-xl px-4 text-sm font-bold border-2 focus-visible:ring-2 border-[#006699]/30 focus-visible:ring-[#006699]/20"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block text-left">
                  Matrícula:
                </label>
                <Input
                  value={receptionistMatricula}
                  onChange={(e) => setReceptionistMatricula(e.target.value.toUpperCase())}
                  placeholder="Ex: 12345"
                  className="h-12 rounded-xl px-4 text-sm font-bold border-2 focus-visible:ring-2 border-[#006699]/30 focus-visible:ring-[#006699]/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setPendingCounter(null)}
                  className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAssumirGuiche}
                  className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-[#006699] hover:bg-[#005580] text-white shadow-md shadow-sky-500/20"
                >
                  Entrar no Guichê
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <div className="col-span-1 lg:col-span-3 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg rounded-3xl p-6 relative overflow-hidden flex items-center justify-between">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#006699]/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
          
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white uppercase mb-1">
              Olá, {receptionistName.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Bom plantão no {selectedCounter.name}
            </p>
          </div>

          <div className="flex items-center gap-4 z-10">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Matrícula</p>
              <p className="text-sm font-black text-[#006699] dark:text-sky-400">{receptionistMatricula}</p>
            </div>
            <div className="h-10 w-px bg-border hidden sm:block" />
            <Button variant="outline" size="sm" onClick={() => setIsExitModalOpen(true)} className="h-10 px-4 text-xs font-black uppercase text-red-500 border-red-500/20 bg-red-500/5 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair da Sala
            </Button>
          </div>
        </div>

        <div className="col-span-1 bg-[#006699] text-white rounded-3xl p-6 shadow-lg shadow-[#006699]/20 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Fila Virtual</p>
          <div className="flex items-baseline gap-2 z-10">
            <span className="text-4xl font-black tracking-tighter">{waitingRegistration.length}</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Aguardando</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 mb-2">
         <h2 className="text-lg font-black tracking-tight text-[#006699] dark:text-sky-400 uppercase flex items-center gap-2">
           <ClipboardList className="h-5 w-5" />
           Pacientes para Chamada
         </h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsChecklistOpen(true)}
            className="h-8 text-xs font-black uppercase rounded-xl border border-orange-500/30 dark:border-orange-500/30 bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white dark:hover:text-slate-950 hover:border-orange-500 dark:hover:border-orange-500 transition-all gap-1.5 shadow-sm shadow-orange-500/5 hover:shadow-md"
          >
             <CheckSquare className="h-4 w-4" />
             Checklist do Turno ({CHECKLIST_ITEMS.filter(item => checklist[item.id]).length}/{CHECKLIST_ITEMS.length})
          </Button>
      </div>

        <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200/40 dark:border-slate-800/40">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-center">Senha</TableHead>
                    <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-left">Paciente</TableHead>
                    <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-center">Idade</TableHead>
                    <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-center">Classificação</TableHead>
                    <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-left">Queixa</TableHead>
                    <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-center">Espera</TableHead>
                    <TableHead className="text-[#006699] dark:text-sky-400 h-14 text-[10px] font-black uppercase tracking-widest text-center">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {waitingRegistration.map((patient) => {
                      const risk = getRiskDetails(patient.risk || "not-urgent");
                      const waitTime = Math.floor(
                        (new Date().getTime() - new Date(patient.arrivalTime).getTime()) /
                          60000,
                      );
                      return (
                        <motion.tr
                          key={patient.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="border-b border-slate-200/40 dark:border-slate-800/40 transition-colors h-16 hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                        >
                          <TableCell className="text-center">
                            <Badge variant="outline" className="font-mono text-xs font-black bg-white dark:bg-slate-950 px-2 py-1 shadow-sm">
                              {patient.ticket}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-bold text-sm text-slate-800 dark:text-slate-100 capitalize truncate max-w-[200px]">
                              {formatWords(patient.name)}
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-xs font-medium text-slate-500">
                            {patient.age ? `${patient.age} anos` : "--"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(risk.color, "font-bold text-[10px] px-2 py-1 rounded-md uppercase tracking-wider")}>
                              {risk.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[250px]">
                            {patient.mainComplaint || "Queixa não informada"}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center justify-center gap-0.5">
                              <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                                Há {waitTime}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                min
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenRegistration(patient);
                                }}
                                className="h-8 px-3 text-[10px] uppercase font-black bg-[#006699] hover:bg-[#005580] text-white gap-2 rounded-lg transition-all shadow-sm"
                              >
                                <UserPlus className="h-3.5 w-3.5" />
                                Iniciar Cadastro
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCallPatient(e, patient);
                                }}
                                variant="ghost"
                                className="h-8 px-3 text-[10px] uppercase font-black text-[#006699] hover:bg-[#006699]/10 gap-2 rounded-lg transition-all"
                              >
                                <Megaphone className="h-3.5 w-3.5" />
                                Chamar
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {waitingRegistration.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">
              Fila Vazia
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Todos os pacientes triados já foram cadastrados.
            </p>
          </div>
        )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none bg-slate-50 dark:bg-slate-950">
          <div className="sticky top-0 z-10 bg-[#006699] p-6 text-white shadow-md">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <UserPlus className="h-6 w-6" /> Completar Cadastro
            </DialogTitle>
            <p className="text-xs text-white/70 font-bold uppercase tracking-widest mt-1">
              Paciente: {selectedPatient?.name} • Risco:{" "}
              {getRiskDetails(selectedPatient?.risk || "not-urgent").label}
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* DADOS DO ATENDIMENTO */}
              <Card className="glass-card shadow-sm border-slate-200/50">
                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/50 py-4 border-b border-slate-200/50 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-black uppercase text-[#006699] flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Dados do Atendimento
                  </CardTitle>
                  <Button type="button" variant="ghost" size="icon" onClick={handleClearAtendimento} className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Limpar Atendimento">
                    <Eraser className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Tipo de Atendimento *
                    </Label>
                    <Select
                      value={formData.attendanceType}
                      onValueChange={(v) => handleChange("attendanceType", v)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clinico">
                          Atendimento Clínico Padrão
                        </SelectItem>
                        <SelectItem value="acidente_transito">
                          Acidente de Trânsito
                        </SelectItem>
                        <SelectItem value="acidente_trabalho">
                          Acidente de Trabalho
                        </SelectItem>
                        <SelectItem value="agressao">
                          Vítima de Agressão / Violência
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Queixa (Triagem)
                    </Label>
                    <Input
                      disabled
                      value={selectedPatient?.mainComplaint || ""}
                      className="h-10 bg-slate-100"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* DADOS PESSOAIS */}
              <Card className="glass-card shadow-sm border-slate-200/50">
                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/50 py-4 border-b border-slate-200/50 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-black uppercase text-[#006699] flex items-center gap-2">
                    <User className="h-4 w-4" /> Dados Pessoais e Filiação
                  </CardTitle>
                  <Button type="button" variant="ghost" size="icon" onClick={handleClearPessoais} className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Limpar Dados Pessoais">
                    <Eraser className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Nome Completo *
                    </Label>
                    <Input
                      placeholder="Insira o nome completo sem abreviações"
                      className="h-10"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Nome Social
                    </Label>
                    <Input
                      placeholder="Nome social (se houver)"
                      className="h-10"
                      value={formData.socialName}
                      onChange={(e) =>
                        handleChange("socialName", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      CPF *
                    </Label>
                    <Input
                      placeholder="000.000.000-00"
                      className="h-10 font-mono"
                      value={formData.cpf}
                      onChange={(e) => handleChange("cpf", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      RG
                    </Label>
                    <Input
                      placeholder="0000000"
                      className="h-10 font-mono"
                      value={formData.rg}
                      onChange={(e) => handleChange("rg", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Órgão Emissor / UF
                    </Label>
                    <Input
                      placeholder="SSP/SP"
                      className="h-10 uppercase"
                      value={formData.organIssuer}
                      onChange={(e) =>
                        handleChange(
                          "organIssuer",
                          e.target.value.toUpperCase(),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Cartão do SUS
                    </Label>
                    <Input
                      placeholder="000 0000 0000 0000"
                      className="h-10 font-mono"
                      value={formData.susCard}
                      onChange={(e) => handleChange("susCard", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Data de Nasc. *
                    </Label>
                    <Input
                      type="date"
                      className="h-10"
                      value={formData.birthDate}
                      onChange={(e) =>
                        handleChange("birthDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Sexo
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(v) => handleChange("gender", v)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Nome da Mãe *
                    </Label>
                    <Input
                      placeholder="Nome completo da mãe"
                      className="h-10"
                      value={formData.motherName}
                      onChange={(e) =>
                        handleChange("motherName", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-span-full border-t border-slate-100 dark:border-slate-800 my-2 pt-4 flex items-center justify-between">
                    <p className="text-xs font-black uppercase text-[#006699] mb-4">
                      Informações Complementares
                    </p>
                    <Button type="button" variant="ghost" size="icon" onClick={handleClearComplementares} className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mb-4" title="Limpar Informações Complementares">
                      <Eraser className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Nacionalidade
                    </Label>
                    <Input
                      placeholder="Ex: Brasileira"
                      className="h-10"
                      value={formData.nationality}
                      onChange={(e) =>
                        handleChange("nationality", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Naturalidade
                    </Label>
                    <Input
                      placeholder="Ex: São Paulo"
                      className="h-10"
                      value={formData.birthPlace}
                      onChange={(e) =>
                        handleChange("birthPlace", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Raça / Cor
                    </Label>
                    <Select
                      value={formData.race}
                      onValueChange={(v) => handleChange("race", v)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="branca">Branca</SelectItem>
                        <SelectItem value="preta">Preta</SelectItem>
                        <SelectItem value="parda">Parda</SelectItem>
                        <SelectItem value="amarela">Amarela</SelectItem>
                        <SelectItem value="indigena">Indígena</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Estado Civil
                    </Label>
                    <Select
                      value={formData.maritalStatus}
                      onValueChange={(v) => handleChange("maritalStatus", v)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">
                          Divorciado(a)
                        </SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Profissão
                    </Label>
                    <Input
                      placeholder="Profissão ou Ocupação"
                      className="h-10"
                      value={formData.profession}
                      onChange={(e) =>
                        handleChange("profession", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Religião
                    </Label>
                    <Input
                      placeholder="Religião"
                      className="h-10"
                      value={formData.religion}
                      onChange={(e) => handleChange("religion", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      PCD (Necessidades Especiais)
                    </Label>
                    <Select
                      value={formData.pcd}
                      onValueChange={(v) => handleChange("pcd", v)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Não" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nao">Não possui</SelectItem>
                        <SelectItem value="visual">
                          Deficiência Visual
                        </SelectItem>
                        <SelectItem value="auditiva">
                          Deficiência Auditiva
                        </SelectItem>
                        <SelectItem value="motora">
                          Deficiência Motora
                        </SelectItem>
                        <SelectItem value="intelectual">
                          Deficiência Intelectual / Cognitiva
                        </SelectItem>
                        <SelectItem value="multipla">
                          Deficiência Múltipla
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* ACOMPANHANTE */}
              <Card className="glass-card shadow-sm border-slate-200/50">
                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/50 py-4 border-b border-slate-200/50 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-black uppercase text-[#006699] flex items-center gap-2">
                    <Users className="h-4 w-4" /> Dados do Acompanhante /
                    Responsável
                  </CardTitle>
                  <Button type="button" variant="ghost" size="icon" onClick={handleClearAcompanhante} className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Limpar Acompanhante">
                    <Eraser className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Nome do Acompanhante
                    </Label>
                    <Input
                      placeholder="Opcional se maior de idade"
                      className="h-10"
                      value={formData.companionName}
                      onChange={(e) =>
                        handleChange("companionName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      CPF do Acompanhante
                    </Label>
                    <Input
                      placeholder="000.000.000-00"
                      className="h-10 font-mono"
                      value={formData.companionCpf}
                      onChange={(e) =>
                        handleChange("companionCpf", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Telefone do Acompanhante
                    </Label>
                    <Input
                      placeholder="(00) 00000-0000"
                      className="h-10"
                      value={formData.companionPhone}
                      onChange={(e) =>
                        handleChange("companionPhone", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Grau de Parentesco
                    </Label>
                    <Select
                      value={formData.companionRelation}
                      onValueChange={(v) =>
                        handleChange("companionRelation", v)
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mae">Mãe / Pai</SelectItem>
                        <SelectItem value="filho">Filho(a)</SelectItem>
                        <SelectItem value="conjuge">Cônjuge</SelectItem>
                        <SelectItem value="irmao">Irmão(ã)</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* ENDEREÇO E CONTATO */}
              <Card className="glass-card shadow-sm border-slate-200/50">
                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/50 py-4 border-b border-slate-200/50 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-black uppercase text-[#006699] flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Localização e Contato
                  </CardTitle>
                  <Button type="button" variant="ghost" size="icon" onClick={handleClearLocalizacao} className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Limpar Localização">
                    <Eraser className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      CEP
                    </Label>
                    <Input
                      placeholder="00000-000"
                      className="h-10"
                      value={formData.cep}
                      onChange={(e) => handleChange("cep", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-3">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Logradouro
                    </Label>
                    <Input
                      placeholder="Rua, Avenida..."
                      className="h-10"
                      value={formData.street}
                      onChange={(e) => handleChange("street", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Número
                    </Label>
                    <Input
                      placeholder="Nº"
                      className="h-10"
                      value={formData.number}
                      onChange={(e) => handleChange("number", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-1">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Complemento
                    </Label>
                    <Input
                      placeholder="Apto, Bloco..."
                      className="h-10"
                      value={formData.complement}
                      onChange={(e) =>
                        handleChange("complement", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Bairro
                    </Label>
                    <Input
                      placeholder="Bairro"
                      className="h-10"
                      value={formData.neighborhood}
                      onChange={(e) =>
                        handleChange("neighborhood", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Cidade
                    </Label>
                    <Input
                      placeholder="Cidade"
                      className="h-10"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      UF
                    </Label>
                    <Input
                      placeholder="UF"
                      maxLength={2}
                      className="h-10 uppercase"
                      value={formData.state}
                      onChange={(e) =>
                        handleChange("state", e.target.value.toUpperCase())
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-500">
                      Celular
                    </Label>
                    <Input
                      placeholder="(00) 00000-0000"
                      className="h-10"
                      value={formData.phone1}
                      onChange={(e) => handleChange("phone1", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCancelConfirmOpen(true)}
                    className="px-8 h-12 uppercase font-bold text-xs rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="px-10 h-12 gap-2 bg-[#006699] hover:bg-[#005580] text-white uppercase font-black tracking-widest rounded-xl shadow-lg shadow-sky-500/20"
                >
                  <Save className="h-4 w-4" />
                  Salvar Cadastro Completo
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION CANCEL */}
      <Dialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl [&>button]:hidden">
          <div className="p-8 text-center text-slate-800 dark:text-slate-100 relative shadow-lg backdrop-blur-md bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight mb-2">
              Cancelar Cadastro?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-sm">
              Se você cancelar, todos os dados que você digitou até agora serão perdidos. Deseja mesmo sair?
            </DialogDescription>
          </div>
          <div className="p-8 space-y-5 bg-white/50 dark:bg-slate-950/50">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCancelConfirmOpen(false)}
                className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Voltar
              </Button>
              <Button
                onClick={() => {
                  setIsCancelConfirmOpen(false);
                  setIsModalOpen(false);
                }}
                className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20"
              >
                Sim, Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    

      {/* CALL CONTROL MODAL */}
      <Dialog open={showCallControl} onOpenChange={setShowCallControl}>
        <DialogContent className="sm:max-w-[400px] p-0 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl [&>button]:hidden">
          <DialogHeader className="p-0 border-none m-0">
            <div className="bg-gradient-to-br from-[#006699]/90 to-[#004466]/90 dark:from-sky-600/50 dark:to-sky-900/50 text-white p-6 pb-8 rounded-b-[2rem] flex items-center justify-between relative shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                  <Megaphone className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div className="text-left">
                  <DialogTitle className="text-sm font-black uppercase tracking-widest text-white">
                    Controle de Chamada
                  </DialogTitle>
                  <DialogDescription className="text-white/80 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                    Sincronizado com o Painel
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

          <div className="p-8 space-y-8 text-center">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Chamando agora
              </p>
              <h2
                className={cn(
                  "text-7xl font-black tracking-tighter leading-none mb-4",
                  callingTicket?.risk === "emergency"
                    ? "text-red-600"
                    : callingTicket?.risk === "very-urgent"
                      ? "text-orange-600"
                      : callingTicket?.risk === "urgent"
                        ? "text-black font-black"
                        : callingTicket?.risk === "less-urgent"
                          ? "text-green-600"
                          : callingTicket?.priority === "preferential"
                            ? "text-purple-600"
                            : callingTicket?.priority === "pediatric"
                              ? "text-orange-600"
                              : "text-[#006699]",
                )}
              >
                {callingTicket?.ticket}
              </h2>
              {callingTicket?.patientName
                .toUpperCase()
                .includes("NÃO IDENTIFICADO") ||
              callingTicket?.patientName
                .toUpperCase()
                .includes("PRÉ-CADASTRO") ? (
                <p className="text-sm font-bold text-slate-400 uppercase italic">
                  SENHA {callingTicket?.ticket}
                </p>
              ) : (
                <>
                  <p className="text-sm font-bold text-slate-500 uppercase">
                    {callingTicket?.patientName}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {callingTicket?.age ? callingTicket?.age + " ANOS" : ""}{" "}
                    {callingTicket?.cpf ? "• CPF: " + callingTicket?.cpf : ""}
                  </p>
                </>
              )}
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => {
                  if (callingTicket) {
                    callTicket(
                      callingTicket.ticket,
                      "RECEPÇÃO",
                      callingTicket.risk,
                      callingTicket.patientName,
                    );
                    toast.success("Chamada enviada novamente ao painel.");
                  }
                }}
                className={cn(
                  "w-full h-16 rounded-2xl text-white font-black uppercase tracking-widest text-sm shadow-xl gap-3 transition-all duration-300",
                  callingTicket?.risk === "emergency"
                    ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                    : callingTicket?.risk === "very-urgent"
                      ? "bg-orange-500 hover:bg-orange-600 shadow-orange-600/20"
                      : callingTicket?.risk === "urgent"
                        ? "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20"
                        : callingTicket?.risk === "less-urgent"
                          ? "bg-green-500 hover:bg-green-600 shadow-green-500/20"
                          : "bg-[#006699] hover:bg-[#005580] shadow-[#006699]/20",
                )}
              >
                <Volume2 className="h-6 w-6" />
                Chamar Novamente
              </Button>

              <div
                className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border cursor-pointer hover:bg-muted/70 transition-colors"
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
                    <p className="text-xs font-black uppercase">
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
                    isAudioEnabled ? "bg-green-500" : "bg-slate-400",
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

      <Dialog open={isExitModalOpen} onOpenChange={setIsExitModalOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl [&>button]:hidden">
          <div className="p-8 text-center text-white relative shadow-lg backdrop-blur-md transition-colors duration-300 bg-gradient-to-br from-red-600/90 to-red-800/90 dark:from-red-600/50 dark:to-red-900/50">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <LogOut className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white mb-2">
              Encerrar Turno?
            </DialogTitle>
            <DialogDescription className="text-white/80 font-medium text-sm">
              Deseja mesmo sair do <strong className="text-white">{selectedCounter?.name}</strong>?
            </DialogDescription>
          </div>
          <div className="p-8 space-y-5">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsExitModalOpen(false)}
                className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Voltar
              </Button>
              <Button
                onClick={handleExitCounter}
                className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20"
              >
                Sair
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Checklist Modal */}
      <Dialog open={isChecklistOpen} onOpenChange={setIsChecklistOpen}>
        <DialogContent className="sm:max-w-[480px] max-h-[90vh] flex flex-col p-0 overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl [&>button]:hidden">
          <div className="p-5 text-center text-white relative shadow-lg backdrop-blur-md transition-colors duration-300 bg-gradient-to-br from-[#006699]/90 to-[#004466]/90 dark:from-sky-600/50 dark:to-sky-900/50">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-lg font-black uppercase tracking-tight text-white mb-1">
              Checklist do Turno
            </DialogTitle>
            <DialogDescription className="text-white/80 font-medium text-xs">
              Procedimentos operacionais obrigatórios para a recepção da UPA.
            </DialogDescription>
          </div>

          <div className="p-5 overflow-y-auto max-h-[260px] sm:max-h-[320px] flex-1">
            {/* Progress Bar */}
            <div className="space-y-1.5 mb-6">
              <div className="flex justify-between items-center text-xs font-black uppercase text-muted-foreground tracking-widest">
                <span>Progresso do Checklist</span>
                <span className="text-[#006699] dark:text-sky-400 font-mono font-bold">
                  {Math.round((CHECKLIST_ITEMS.filter(item => checklist[item.id]).length / CHECKLIST_ITEMS.length) * 100) || 0}% ({CHECKLIST_ITEMS.filter(item => checklist[item.id]).length}/{CHECKLIST_ITEMS.length})
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/30 dark:border-slate-700/30 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  style={{ width: `${(CHECKLIST_ITEMS.filter(item => checklist[item.id]).length / CHECKLIST_ITEMS.length) * 100 || 0}%` }}
                />
              </div>
            </div>

            {/* Checklist Groups */}
            <div className="space-y-5">
              {["Preparação", "Operação", "Fechamento"].map((category) => {
                const categoryItems = CHECKLIST_ITEMS.filter(item => item.category === category);
                return (
                  <div key={category} className="space-y-2.5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400 border-b border-slate-100 dark:border-slate-800/60 pb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006699] dark:bg-sky-400 animate-pulse" />
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {categoryItems.map((item) => {
                        const isChecked = !!checklist[item.id];
                        return (
                          <div 
                            key={item.id}
                            onClick={() => toggleChecklistItem(item.id)}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all duration-200 select-none",
                              isChecked
                                ? "bg-emerald-500/5 border-emerald-500/30 dark:border-emerald-500/25 text-slate-750 dark:text-slate-355 text-emerald-800 dark:text-emerald-400"
                                : "bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                            )}
                          >
                            <div className={cn(
                              "h-5 w-5 rounded-lg border flex items-center justify-center transition-all shrink-0",
                              isChecked
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "border-slate-300 dark:border-slate-750"
                            )}>
                              {isChecked && <CheckCircle2 className="h-3.5 w-3.5 stroke-[3px]" />}
                            </div>
                            <span className={cn(
                              "text-xs font-bold leading-tight",
                              isChecked && "line-through text-muted-foreground opacity-60"
                            )}>
                              {item.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-white/20 dark:bg-slate-950/20 flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setChecklist({});
                localStorage.removeItem("upa_receptionist_checklist");
                toast.success("Checklist limpo com sucesso!");
              }}
              className="flex-1 h-10 rounded-xl text-xs font-black uppercase tracking-widest bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 hover:border-red-200 transition-all"
            >
              Limpar
            </Button>
            <Button
              onClick={() => {
                setIsChecklistOpen(false);
                toast.success("Checklist salvo com sucesso!");
              }}
              className="flex-1 h-10 rounded-xl text-xs font-black uppercase tracking-widest bg-[#006699] hover:bg-[#005580] text-white shadow-md shadow-sky-500/20"
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
