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
import { UserPlus, User, Briefcase, Calendar, CheckCircle2, Phone, Fingerprint, Award, CreditCard } from "lucide-react";
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
    cpf: "",
    phone: "",
    birth: "",
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
        name: "", cpf: "", phone: "", birth: "", role: "", specialty: "", registry: "", shift: ""
      });
      
      if (onSuccess) onSuccess();
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white relative">
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

        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950">
          
          {/* Section 1: Personal Data */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <User className="h-4 w-4 text-blue-500" />
              Dados Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    required
                    placeholder="Ex: João da Silva Santos" 
                    className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">CPF</Label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    required
                    placeholder="000.000.000-00" 
                    className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                    value={formData.cpf}
                    onChange={(e) => handleChange('cpf', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nascimento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    type="date"
                    required
                    className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                    value={formData.birth}
                    onChange={(e) => handleChange('birth', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Telefone / WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    required
                    placeholder="(00) 00000-0000" 
                    className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Professional Data */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Briefcase className="h-4 w-4 text-blue-500" />
              Dados Profissionais & Contrato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cargo</Label>
                <Select required value={formData.role} onValueChange={(v) => handleChange('role', v)}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
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
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
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
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="000000-XX" 
                    className="pl-10 h-12 rounded-xl border-slate-200 bg-white shadow-sm"
                    value={formData.registry}
                    onChange={(e) => handleChange('registry', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Regime de Escala</Label>
                <Select required value={formData.shift} onValueChange={(v) => handleChange('shift', v)}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
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
