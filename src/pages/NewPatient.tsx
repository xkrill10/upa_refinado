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
  Megaphone,
  Volume2,
  VolumeX,
  X,
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

export default function NewPatient() {
  const {
    patients,
    updatePatient,
    callTicket,
    isAudioEnabled,
    setIsAudioEnabled,
  } = usePatients();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      "RECEPÇÃO",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-[#006699] dark:text-sky-400 uppercase">
          Fila da Recepção
        </h1>
        <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
          <ClipboardList className="h-4 w-4 text-primary animate-pulse" />
          Pacientes Aguardando Cadastro Completo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {waitingRegistration.map((patient) => {
            const risk = getRiskDetails(patient.risk || "not-urgent");
            const waitTime = Math.floor(
              (new Date().getTime() - new Date(patient.arrivalTime).getTime()) /
                60000,
            );

            return (
              <motion.div
                key={patient.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl p-5 cursor-pointer bg-white/70 dark:bg-slate-900/45 hover:shadow-2xl transition-all"
                onClick={() => handleOpenRegistration(patient)}
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge
                    className={cn(
                      risk.color,
                      "font-bold text-[10px] px-2 py-1 rounded-md uppercase tracking-wider",
                    )}
                  >
                    {risk.label}
                  </Badge>
                  <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                    <Clock className="h-3 w-3" />
                    {waitTime} min
                  </div>
                </div>

                <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 uppercase truncate mb-1">
                  {formatWords(patient.name)}
                </h3>

                <div className="space-y-1 mt-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-[#006699]" />
                    {patient.mainComplaint || "Queixa não informada"}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Senha: {patient.ticket}
                    </p>
                    <Button
                      onClick={(e) => handleCallPatient(e, patient)}
                      className="h-8 px-3 text-[10px] uppercase font-black bg-[#006699] hover:bg-[#005580] text-white gap-2 rounded-lg shadow-md shadow-sky-500/20 transition-all hover:scale-105"
                    >
                      <Megaphone className="h-3.5 w-3.5" />
                      Chamar Painel
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

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
      </div>

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
                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/50 py-4 border-b border-slate-200/50">
                  <CardTitle className="text-sm font-black uppercase text-[#006699] flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Dados do Atendimento
                  </CardTitle>
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
                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/50 py-4 border-b border-slate-200/50">
                  <CardTitle className="text-sm font-black uppercase text-[#006699] flex items-center gap-2">
                    <User className="h-4 w-4" /> Dados Pessoais e Filiação
                  </CardTitle>
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

                  <div className="col-span-full border-t border-slate-100 dark:border-slate-800 my-2 pt-4">
                    <p className="text-xs font-black uppercase text-[#006699] mb-4">
                      Informações Complementares
                    </p>
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
                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/50 py-4 border-b border-slate-200/50">
                  <CardTitle className="text-sm font-black uppercase text-[#006699] flex items-center gap-2">
                    <Users className="h-4 w-4" /> Dados do Acompanhante /
                    Responsável
                  </CardTitle>
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
                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/50 py-4 border-b border-slate-200/50">
                  <CardTitle className="text-sm font-black uppercase text-[#006699] flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Localização e Contato
                  </CardTitle>
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

              <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-slate-50 dark:bg-slate-950 pb-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 h-12 uppercase font-bold text-xs rounded-xl"
                >
                  Cancelar
                </Button>
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
    </motion.div>
  );
}
