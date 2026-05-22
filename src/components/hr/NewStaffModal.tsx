import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, User, Briefcase, Calendar, CheckCircle2, Phone, Fingerprint, MapPin, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NewStaffModal({ open, onOpenChange, onSuccess }: NewStaffModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    socialName: "",
    cpf: "",
    birth: "",
    gender: "",
    mobile: "",
    phone: "",
    email: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    uf: "",
    role: "",
    specialty: "",
    registry: "",
    shift: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Profissional cadastrado com sucesso!", {
        description: `${formData.name} agora faz parte do corpo clínico.`,
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      });
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "", socialName: "", cpf: "", birth: "", gender: "", mobile: "", phone: "", email: "",
        cep: "", street: "", number: "", complement: "", district: "", city: "", uf: "",
        role: "", specialty: "", registry: "", shift: ""
      });
      
      if (onSuccess) onSuccess();
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem] flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white relative flex-shrink-0">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <UserPlus className="absolute right-8 top-1/2 -translate-y-1/2 h-24 w-24 text-white/10 pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest">
              Admissão
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight">Novo Profissional</DialogTitle>
          <DialogDescription className="text-blue-100 font-medium">
            Cadastre um novo membro no corpo clínico ou administrativo da unidade.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-transparent overflow-y-auto custom-scrollbar">
          
          {/* Section 1: Personal Data */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <User className="h-4 w-4 text-blue-500" />
              Dados de Identificação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nome Completo *</Label>
                <Input 
                  required
                  placeholder="Insira o nome completo sem abreviações" 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nome Social</Label>
                <Input 
                  placeholder="Como o profissional prefere ser chamado" 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.socialName}
                  onChange={(e) => handleChange('socialName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">CPF *</Label>
                <Input 
                  required
                  placeholder="000.000.000-00" 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.cpf}
                  onChange={(e) => handleChange('cpf', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Data de Nascimento *</Label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    type="date"
                    required
                    className="h-12 pr-10 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                    value={formData.birth}
                    onChange={(e) => handleChange('birth', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sexo</Label>
                <Select value={formData.gender} onValueChange={(v) => handleChange('gender', v)}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                    <SelectItem value="O">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Celular</Label>
                <Input 
                  placeholder="(00) 00000-0000" 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Telefone p/ Contato</Label>
                <Input 
                  placeholder="(00) 0000-0000" 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">E-mail</Label>
                <Input 
                  type="email"
                  placeholder="exemplo@email.com" 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Address Data */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              Localização e Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2 md:col-span-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">CEP</Label>
                <Input 
                  placeholder="00000-000" 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.cep}
                  onChange={(e) => handleChange('cep', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Logradouro</Label>
                <Input 
                  placeholder="Rua, Avenida..." 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Número</Label>
                <Input 
                  placeholder="Nº" 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.number}
                  onChange={(e) => handleChange('number', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Complemento</Label>
                <Input 
                  placeholder="Apto, Bloco, etc." 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.complement}
                  onChange={(e) => handleChange('complement', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bairro</Label>
                <Input 
                  placeholder="Ex: Centro" 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cidade</Label>
                <Input 
                  placeholder="Cidade" 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">UF</Label>
                <Input 
                  placeholder="UF" 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.uf}
                  onChange={(e) => handleChange('uf', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Professional Data */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Briefcase className="h-4 w-4 text-blue-500" />
              Dados Profissionais & Contrato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cargo</Label>
                <Select required value={formData.role} onValueChange={(v) => handleChange('role', v)}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                    <SelectItem value="medico">Médico Plantonista</SelectItem>
                    <SelectItem value="enfermeiro">Enfermeiro(a)</SelectItem>
                    <SelectItem value="tecnico">Técnico(a) em Enfermagem</SelectItem>
                    <SelectItem value="recepcao">Recepcionista</SelectItem>
                    <SelectItem value="adm">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Especialidade / Setor</Label>
                <Select required value={formData.specialty} onValueChange={(v) => handleChange('specialty', v)}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm">
                    <SelectValue placeholder="Selecione a área" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                    <SelectItem value="clinica">Clínica Médica</SelectItem>
                    <SelectItem value="pediatria">Pediatria</SelectItem>
                    <SelectItem value="urgencia">Urgência / Emergência</SelectItem>
                    <SelectItem value="triagem">Triagem</SelectItem>
                    <SelectItem value="geral">Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registro (CRM/COREN)</Label>
                <Input 
                  placeholder="000000-XX" 
                  className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm"
                  value={formData.registry}
                  onChange={(e) => handleChange('registry', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Regime de Escala</Label>
                <Select required value={formData.shift} onValueChange={(v) => handleChange('shift', v)}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm">
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                    <SelectItem value="12x36_dia">12x36 (Diurno)</SelectItem>
                    <SelectItem value="12x36_noite">12x36 (Noturno)</SelectItem>
                    <SelectItem value="24h">Plantão 24h</SelectItem>
                    <SelectItem value="diarista">Diarista (8h)</SelectItem>
                    <SelectItem value="sobreaviso">Sobreaviso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              className="rounded-xl h-12 px-6 font-black uppercase tracking-widest text-[10px] text-slate-500" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px] bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex-1"
            >
              {isSubmitting ? "Cadastrando..." : "Confirmar Admissão"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
