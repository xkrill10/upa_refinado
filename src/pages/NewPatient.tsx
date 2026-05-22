import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, ArrowLeft, Save, MapPin, Info } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "sonner";
import { usePatients } from "@/hooks/use-patients";

export default function NewPatient() {
  const navigate = useNavigate();
  const { addPatient, patients } = usePatients();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    socialName: "",
    cpf: "",
    susCard: "",
    birthDate: "",
    gender: "",
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

  useEffect(() => {
    const cpfParam = searchParams.get("cpf");
    if (cpfParam) {
      const cleanCpf = cpfParam.replace(/\D/g, "");
      const existing = patients.find(p => p.cpf.replace(/\D/g, "") === cleanCpf);
      
      if (existing) {
        setFormData(prev => ({
          ...prev,
          name: existing.name || prev.name,
          socialName: existing.socialName || prev.socialName,
          cpf: maskCPF(existing.cpf),
          susCard: existing.susCard || prev.susCard,
          birthDate: existing.birthDate || prev.birthDate,
          gender: existing.gender || prev.gender,
          phone1: existing.phone1 || prev.phone1,
          phone2: existing.phone2 || prev.phone2,
          email: existing.email || prev.email,
        }));
        toast.info("Dados do pré-cadastro recuperados automaticamente.");
      } else {
        setFormData(prev => ({ ...prev, cpf: maskCPF(cpfParam) }));
      }
    }
  }, [searchParams, patients]);

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

  const validateSUS = (cns: string) => {
    if (cns.length !== 15) return false;
    
    const firstDigit = cns[0];
    if (!['1', '2', '7', '8', '9'].includes(firstDigit)) return false;

    if (['1', '2'].includes(firstDigit)) {
      const pis = cns.substring(0, 11);
      let sum = 0;
      for (let i = 0; i < 11; i++) {
        sum += parseInt(pis[i]) * (15 - i);
      }
      
      const rest = sum % 11;
      let dv = 11 - rest;
      
      if (dv === 11) dv = 0;
      
      if (dv === 10) {
        sum += 2;
        const rest2 = sum % 11;
        const dv2 = 11 - rest2;
        return cns === pis + "001" + dv2.toString();
      } else {
        return cns === pis + "000" + dv.toString();
      }
    }

    if (['7', '8', '9'].includes(firstDigit)) {
      let sum = 0;
      for (let i = 0; i < 15; i++) {
        sum += parseInt(cns[i]) * (15 - i);
      }
      return (sum % 11 === 0);
    }

    return false;
  };

  const formatWords = (text: string) => {
    const skipWords = ["de", "da", "do", "dos", "das", "e", "o", "a"];
    return text
      .split(" ")
      .map((word, index) => {
        const lowerWord = word.toLowerCase();
        if (lowerWord.length === 0) return "";
        if (index === 0 || !skipWords.includes(lowerWord)) {
          return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
        }
        return lowerWord;
      })
      .join(" ");
  };

  const handleChange = (field: string, value: string) => {
    let finalValue = value;
    
    if (field === "name" || field === "socialName" || field === "street" || field === "neighborhood" || field === "city") {
      finalValue = formatWords(value);
    }
    
    if (field === "cpf") finalValue = maskCPF(value);
    if (field === "susCard") finalValue = maskSUS(value);
    if (field === "phone1" || field === "phone2") finalValue = maskPhone(value);
    if (field === "cep") {
      finalValue = maskCEP(value);
      handleCEPLookup(finalValue);
    }

    setFormData(prev => ({ ...prev, [field]: finalValue }));
  };

  const handleCEPLookup = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        const data = await response.json();
        
        if (data.erro) {
          toast.error("CEP não encontrado.");
          return;
        }

        setFormData(prev => ({
          ...prev,
          street: formatWords(data.logradouro),
          neighborhood: formatWords(data.bairro),
          city: formatWords(data.localidade),
          state: data.uf.toUpperCase()
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

    if (formData.susCard && !validateSUS(formData.susCard)) {
      toast.error("Cartão do SUS inválido");
      return;
    }
    
    // Calculate age from birthDate for the mock state
    const birthDate = new Date(formData.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    addPatient({
      name: formData.name,
      age: isNaN(age) ? 0 : age,
      cpf: formData.cpf,
      susCard: formData.susCard,
      status: 'waiting',
      risk: 'not-urgent',
      arrivalTime: new Date().toISOString(),
      mainComplaint: "",
      socialName: formData.socialName,
      birthDate: formData.birthDate,
      gender: formData.gender,
      phone1: formData.phone1,
      phone2: formData.phone2,
      email: formData.email,
      cep: formData.cep,
      street: formData.street,
      number: formData.number,
      complement: formData.complement,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      bloodType: "",
      allergies: "",
      currentMedications: "",
    });
    
    toast.success("Paciente registrado com sucesso! Direcionando para triagem...");
    setTimeout(() => {
      navigate("/triagem");
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-xl border-slate-200 dark:border-slate-800 text-foreground hover:bg-slate-100 dark:hover:bg-slate-850">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[#006699] dark:text-sky-400 uppercase">Admissão de Paciente</h1>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
              <UserPlus className="h-4 w-4 text-primary animate-pulse" />
              CADASTRO INTEGRAL DE PRONTUÁRIO
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DADOS PESSOAIS */}
        <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500 relative">
          <CardHeader className="bg-primary/5 dark:bg-primary/10 border-b border-primary/10 dark:border-primary/20 p-8">
            <CardTitle className="text-xl mission-control-title flex items-center gap-3 text-foreground dark:text-white">
              <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center border border-primary/20 dark:border-primary/30">
                <UserPlus className="h-6 w-6 text-primary dark:text-sky-450" />
              </div>
              DADOS DE IDENTIFICAÇÃO
            </CardTitle>
            <CardDescription className="font-extrabold text-[10px] uppercase tracking-wider text-muted-foreground dark:text-slate-400 mt-2 opacity-80">REGISTRO OBRIGATÓRIO PARA TRIAGEM</CardDescription>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Nome Completo *</Label>
              <Input 
                placeholder="Insira o nome completo sem abreviações" 
                className="h-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Nome Social</Label>
              <Input 
                placeholder="Como o paciente prefere ser chamado" 
                className="h-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300"
                value={formData.socialName}
                onChange={(e) => handleChange("socialName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">CPF *</Label>
              <Input 
                placeholder="000.000.000-00" 
                className="h-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 font-mono text-foreground transition-all duration-300"
                value={formData.cpf}
                onChange={(e) => handleChange("cpf", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Cartão do SUS</Label>
              <Input 
                placeholder="000 0000 0000 0000" 
                className="h-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 font-mono text-foreground transition-all duration-300"
                value={formData.susCard}
                onChange={(e) => handleChange("susCard", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Data de Nascimento *</Label>
              <Input 
                type="date"
                className="h-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300"
                value={formData.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Sexo</Label>
              <Select onValueChange={(v) => handleChange("gender", v)}>
                <SelectTrigger className="h-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 text-foreground transition-all duration-300">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-foreground">
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Celular</Label>
              <Input 
                placeholder="(00) 00000-0000" 
                className="h-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300"
                value={formData.phone1}
                onChange={(e) => handleChange("phone1", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Telefone p/ Contato</Label>
              <Input 
                placeholder="(00) 0000-0000" 
                className="h-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300"
                value={formData.phone2}
                onChange={(e) => handleChange("phone2", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">E-mail</Label>
              <Input 
                type="email"
                placeholder="exemplo@email.com" 
                className="h-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ENDEREÇO */}
        <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500 relative">
          <CardHeader className="bg-slate-105/30 dark:bg-slate-800/30 border-b border-slate-200/40 dark:border-slate-800/40 p-8">
            <CardTitle className="text-xl mission-control-title flex items-center gap-3 text-foreground dark:text-white">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center border border-slate-200 dark:border-slate-700/80">
                <MapPin className="h-6 w-6 text-muted-foreground dark:text-slate-400" />
              </div>
              LOCALIZAÇÃO E CONTATO
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">CEP</Label>
              <Input 
                placeholder="00000-000" 
                className="h-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300"
                value={formData.cep}
                onChange={(e) => handleChange("cep", e.target.value)}
              />
            </div>
            
            <div className="space-y-2 md:col-span-3">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Logradouro</Label>
              <Input 
                placeholder="Rua, Avenida..." 
                className="h-12 rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300"
                value={formData.street}
                onChange={(e) => handleChange("street", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Número</Label>
              <Input 
                placeholder="Nº" 
                className="h-12 rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300"
                value={formData.number}
                onChange={(e) => handleChange("number", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Complemento</Label>
              <Input 
                placeholder="Apto, Bloco, etc." 
                className="h-12 rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300"
                value={formData.complement}
                onChange={(e) => handleChange("complement", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Bairro</Label>
              <Input 
                placeholder="Ex: Centro" 
                className="h-12 rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300"
                value={formData.neighborhood}
                onChange={(e) => handleChange("neighborhood", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Cidade</Label>
              <Input 
                placeholder="Cidade" 
                className="h-12 rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground transition-all duration-300"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">UF</Label>
              <Input 
                placeholder="UF" 
                maxLength={2}
                className="h-12 rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-foreground uppercase transition-all duration-300"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value.toUpperCase())}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
           <div className="flex items-center gap-2 text-muted-foreground dark:text-slate-400">
              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Info className="h-5 w-5 text-[#006699] dark:text-sky-450" />
              </div>
              <p className="text-xs font-medium italic">Confirme as informações antes de finalizar o registro.</p>
           </div>
           <div className="flex gap-3 w-full md:w-auto">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-xl px-8 h-12 font-bold uppercase tracking-wider border-slate-200 dark:border-slate-800 text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 md:flex-none gap-2 rounded-xl px-10 h-12 font-black uppercase tracking-widest bg-[#006699] hover:bg-[#005580] dark:bg-sky-600 dark:hover:bg-sky-500 text-white shadow-lg shadow-sky-500/25 border-0">
                <Save className="h-5 w-5" />
                Cadastrar Paciente
              </Button>
           </div>
        </div>
      </form>
    </motion.div>
  );
}
