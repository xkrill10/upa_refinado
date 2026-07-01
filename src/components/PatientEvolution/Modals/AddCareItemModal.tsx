import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PrescriptionMedication, AprazamentoHour } from "@/context/PrescriptionsContext";
import { Activity, Pill, Stethoscope, Utensils, ShieldAlert, CalendarIcon, Trash2, CheckCircle2, X, Brain, Users, Puzzle, MessageCircle, HeartPulse, Ear, Accessibility } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { CARE_LIBRARY } from "@/data/careLibrary";
import { usePatients } from "@/hooks/use-patients";
import { useRole } from "@/context/RoleContext";
import { AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AddCareItemModalProps {
  patientId?: string;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: PrescriptionMedication) => void;
}

export function AddCareItemModal({ patientId, isOpen, onClose, onAdd }: AddCareItemModalProps) {
  const { patients } = usePatients();
  const { role } = useRole();
  const patient = patientId ? patients.find((p) => p.id === patientId) : null;
  const isDoctor = role === "medico";

  const getLockedCategory = (): "medication" | "diet" | "therapy" | "nursing" | "speech_therapy" | "psychology" | "social_work" | "occupational_therapy" | "clinical_pharmacy" => {
    switch (role) {
      case "fisioterapeuta": return "therapy";
      case "nutricionista": return "diet";
      case "fonoaudiologo": return "speech_therapy";
      case "psicologo": return "psychology";
      case "assistente_social": return "social_work";
      case "terapeuta_ocupacional": return "occupational_therapy";
      case "farmaceutico_clinico": return "clinical_pharmacy";
      case "enfermeiro":
      case "tecnico_enfermagem":
      case "auxiliar_enfermagem":
        return "nursing";
      default: return "medication";
    }
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "diet": return { bg: "bg-orange-500/15 dark:bg-orange-500/20", border: "border-orange-500/40", text: "text-orange-700 dark:text-orange-300", icon: <Utensils className="h-4 w-4 text-orange-600 dark:text-orange-400" />, label: "Dieta / Refeição", placeholder: "Ex: Dieta Branda, Jejum..." };
      case "therapy": return { bg: "bg-emerald-500/15 dark:bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-700 dark:text-emerald-300", icon: <Accessibility className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />, label: "Terapia / Fisioterapia", placeholder: "Ex: Exercício Respiratório, Deambulação..." };
      case "nursing": return { bg: "bg-blue-500/15 dark:bg-blue-500/20", border: "border-blue-500/40", text: "text-blue-700 dark:text-blue-300", icon: <HeartPulse className="h-4 w-4 text-blue-600 dark:text-blue-400" />, label: "Cuidado de Enfermagem", placeholder: "Ex: Aferir Sinais Vitais, Curativo..." };
      case "speech_therapy": return { bg: "bg-pink-500/15 dark:bg-pink-500/20", border: "border-pink-500/40", text: "text-pink-700 dark:text-pink-300", icon: <Ear className="h-4 w-4 text-pink-600 dark:text-pink-400" />, label: "Cuidado Fonoaudiológico", placeholder: "Ex: Avaliação de Deglutição..." };
      case "psychology": return { bg: "bg-violet-500/15 dark:bg-violet-500/20", border: "border-violet-500/40", text: "text-violet-700 dark:text-violet-300", icon: <Brain className="h-4 w-4 text-violet-600 dark:text-violet-400" />, label: "Acompanhamento Psicológico", placeholder: "Ex: Acompanhamento Psicológico..." };
      case "social_work": return { bg: "bg-amber-500/15 dark:bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-700 dark:text-amber-300", icon: <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />, label: "Ação Serviço Social", placeholder: "Ex: Avaliação Socioeconômica..." };
      case "occupational_therapy": return { bg: "bg-teal-500/15 dark:bg-teal-500/20", border: "border-teal-500/40", text: "text-teal-700 dark:text-teal-300", icon: <Puzzle className="h-4 w-4 text-teal-600 dark:text-teal-400" />, label: "Terapia Ocupacional", placeholder: "Ex: Estímulo Sensorial..." };
      case "clinical_pharmacy": return { bg: "bg-red-500/15 dark:bg-red-500/20", border: "border-red-500/40", text: "text-red-700 dark:text-red-300", icon: <Pill className="h-4 w-4 text-red-600 dark:text-red-400" />, label: "Intervenção Farmacêutica", placeholder: "Ex: Ajuste de Dose..." };
      case "medication": return { bg: "bg-purple-500/15 dark:bg-purple-500/20", border: "border-purple-500/40", text: "text-purple-700 dark:text-purple-300", icon: <Pill className="h-4 w-4 text-purple-600 dark:text-purple-400" />, label: "Medicamento / Infusão", placeholder: "Ex: Dipirona, Paracetamol..." };
      default: return { bg: "bg-slate-500/15", border: "border-slate-500/40", text: "text-slate-700", icon: <Activity className="h-4 w-4" />, label: "Geral", placeholder: "Ex: Novo item..." };
    }
  };

  const allergiesText = patient?.allergies?.toLowerCase() || "";
  const [medication, setMedication] = useState("");
  const [category, setCategory] = useState<"medication" | "diet" | "therapy" | "nursing" | "speech_therapy" | "psychology" | "social_work" | "occupational_therapy" | "clinical_pharmacy">("medication");
  const [dosage, setDosage] = useState("");
  const [route, setRoute] = useState("");
  const [frequency, setFrequency] = useState("");
  const [isHighVigilance, setIsHighVigilance] = useState(false);
  const [hoursStr, setHoursStr] = useState("");
  const [observation, setObservation] = useState("");
  const [scheduleType, setScheduleType] = useState<"continuous" | "single">("continuous");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allergyOverride, setAllergyOverride] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [requiresDoubleCheck, setRequiresDoubleCheck] = useState(false);

  // Reset all fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setMedication("");
      setCategory(isDoctor ? "medication" : getLockedCategory());
      setDosage("");
      setRoute("");
      setFrequency("");
      setIsHighVigilance(false);
      setHoursStr("");
      setObservation("");
      setScheduleType("continuous");
      setStartDate(format(new Date(), "yyyy-MM-dd"));
      setAllergyOverride(false);
      setShowSuggestions(false);
      setShowClearConfirm(false);
    }
  }, [isOpen, isDoctor]);

  const isAllergic = medication.length > 2 && allergiesText.includes(medication.toLowerCase());

  // Reset fields when category changes
  useEffect(() => {
    setMedication("");
    setDosage("");
    setRoute("");
    setFrequency("");
    setIsHighVigilance(false);
    setHoursStr("");
    setShowSuggestions(false);
    setRequiresDoubleCheck(false);
  }, [category, isDoctor]);

  const isChild = !!(patient && patient.age < 12);

  // Library: shows items based on category and search text, sorted by pediatric relevance if isChild
  const filteredLibrary = CARE_LIBRARY.filter(
    item => item.category === category && item.name.toLowerCase().includes(medication.toLowerCase())
  ).sort((a, b) => {
    if (isChild) {
      const aIsPed = a.name.includes("👶");
      const bIsPed = b.name.includes("👶");
      if (aIsPed && !bIsPed) return -1;
      if (!aIsPed && bIsPed) return 1;
    }
    return a.name.localeCompare(b.name);
  });

  // Auto-fill fields when a library item is selected
  useEffect(() => {
    if (!medication) return;
    const found = CARE_LIBRARY.find(item => item.name === medication && item.category === category);
    if (found) {
      if (found.dosage && !dosage) setDosage(found.dosage);
      if (found.route && !route) setRoute(found.route);
      if (found.frequency && !frequency) setFrequency(found.frequency);
      if (found.isHighVigilance !== undefined) setIsHighVigilance(found.isHighVigilance);
    }
  }, [medication, category]);

  // Auto-schedule hours based on frequency
  useEffect(() => {
    if (!frequency) return;
    const freq = frequency.toLowerCase().replace(/\s/g, '');
    let hours: string[] = [];
    
    if (freq === "8/8h" || freq === "8em8h") hours = ["06:00", "14:00", "22:00"];
    else if (freq === "12/12h" || freq === "12em12h") hours = ["10:00", "22:00"];
    else if (freq === "6/6h" || freq === "6em6h") hours = ["06:00", "12:00", "18:00", "00:00"];
    else if (freq === "4/4h" || freq === "4em4h") hours = ["02:00", "06:00", "10:00", "14:00", "18:00", "22:00"];
    else if (freq === "2/2h" || freq === "2em2h") hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "00:00", "02:00", "04:00", "06:00"];
    else if (freq === "1/1h" || freq === "1em1h" || freq === "1h") hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00"];
    else if (freq === "24/24h" || freq === "24h" || freq === "1xaodia" || freq === "1xdia") hours = ["10:00"];
    
    if (hours.length > 0) {
       setHoursStr(hours.join(", "));
    }
  }, [frequency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medication) {
      toast.error("O nome do item é obrigatório.");
      return;
    }

    const parsedHours: AprazamentoHour[] = hoursStr
      .split(",")
      .map(h => h.trim())
      .filter(h => h.length > 0)
      .map(h => {
        let formatted = h;
        if (!formatted.includes(':')) {
           formatted = formatted + ":00";
        }
        const parts = formatted.split(':');
        const hh = parts[0].padStart(2, '0').slice(-2);
        const mm = (parts[1] || '00').padEnd(2, '0').substring(0, 2);
        return { hour: `${hh}:${mm}`, status: "pending" };
      });

    const newItem: PrescriptionMedication = {
      id: `item-${Date.now()}`,
      medication,
      category,
      dosage: dosage || "-",
      route: route || "-",
      frequency: frequency || "-",
      observation: observation || undefined,
      startDate,
      scheduleType,
      executions: {},
      isHighVigilance,
      isDoubleCheckRequired: requiresDoubleCheck,
      status: "active",
      hours: parsedHours
    };

    onAdd(newItem);
    onClose();
  };

  const executeClear = () => {
    setMedication("");
    setCategory("medication");
    setDosage("");
    setRoute("");
    setFrequency("");
    setIsHighVigilance(false);
    setHoursStr("");
    setObservation("");
    setScheduleType("continuous");
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setAllergyOverride(false);
    setShowSuggestions(false);
    setShowClearConfirm(false);
    toast.success("Campos limpos com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card-premium border-white/40 dark:border-white/10 sm:max-w-xl rounded-[2rem] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-black uppercase text-foreground">
            Adicionar Novo Item de Cuidado
          </DialogTitle>
          <DialogDescription className="font-bold text-slate-500">
            Preencha os dados do novo item para inseri-lo no plano terapêutico.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col flex-1 overflow-hidden">
          <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar pb-2">
            {/* Tipo / Categoria */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tipo / Categoria</Label>
              {isDoctor ? (
                <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                  <SelectTrigger className="bg-background/50 border-border/50 rounded-xl h-10 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card rounded-xl">
                    {["medication", "diet", "therapy", "nursing", "speech_therapy", "psychology", "social_work", "occupational_therapy", "clinical_pharmacy"].map((cat) => {
                      const theme = getCategoryTheme(cat);
                      return (
                        <SelectItem key={cat} value={cat}>
                          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                            {theme.icon} {theme.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ) : (
                (() => {
                  const theme = getCategoryTheme(category);
                  return (
                    <div className={`border rounded-xl h-10 px-3 flex items-center font-black text-[11px] uppercase tracking-widest shadow-sm relative overflow-hidden group ${theme.bg} ${theme.border} ${theme.text}`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                      <div className="flex items-center gap-2 relative z-10">
                        {theme.icon} {theme.label}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Nome do Item com Biblioteca */}
            <div className="space-y-1.5 relative">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nome do Item</Label>
              <div className="relative">
                <Input 
                  className="bg-background/50 border-border/50 rounded-xl h-9 font-bold text-xs pr-8" 
                  placeholder={getCategoryTheme(category).placeholder}
                  value={medication}
                  onChange={e => {
                    setMedication(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onClick={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {medication && (
                  <button 
                    type="button"
                    onClick={() => {
                      setMedication("");
                      setDosage("");
                      setRoute("");
                      setFrequency("");
                      setShowSuggestions(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {showSuggestions && filteredLibrary.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 z-[100] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xl max-h-48 overflow-y-auto">
                  {filteredLibrary.map(item => (
                    <div 
                      key={item.name} 
                      className="px-4 py-3 text-xs font-bold cursor-pointer hover:bg-[#006699]/10 dark:hover:bg-sky-500/10 transition-colors border-b border-border/50 last:border-0"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setMedication(item.name);
                        setRequiresDoubleCheck(!!item.isDoubleCheckRequired);
                        setShowSuggestions(false);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Data de Início */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Data de Início</Label>
              <Input 
                type="date"
                className="bg-background/50 border-border/50 rounded-xl h-9 font-bold text-xs" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>

            {/* Tipo de Uso */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tipo de Uso</Label>
              <Select value={scheduleType} onValueChange={(val: any) => setScheduleType(val)}>
                <SelectTrigger className="bg-background/50 border-border/50 rounded-xl h-9 font-bold text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card rounded-xl">
                  <SelectItem value="continuous">Uso Contínuo</SelectItem>
                  <SelectItem value="single">Dose Única / Específico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dosagem */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dosagem / Quant</Label>
              <Input 
                className="bg-background/50 border-border/50 rounded-xl h-9 font-bold text-xs" 
                placeholder="Ex: 500mg, 1 Sessão"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
              />
            </div>

            {/* Via / Local */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Via / Local</Label>
              <Input 
                className="bg-background/50 border-border/50 rounded-xl h-9 font-bold text-xs" 
                placeholder="Ex: EV, VO, Leito"
                value={route}
                onChange={e => setRoute(e.target.value)}
              />
            </div>

            {/* Frequência */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Frequência</Label>
              <Input 
                className="bg-background/50 border-border/50 rounded-xl h-9 font-bold text-xs" 
                placeholder="Ex: 8/8H, 1x ao dia"
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
              />
            </div>

            {/* Horários de Aprazamento */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Aprazamento</Label>
              <Input 
                className="bg-background/50 border-border/50 rounded-xl h-9 font-bold text-xs" 
                placeholder="Ex: 8, 14, 20 ou 08:00, 14:30"
                value={hoursStr}
                onChange={e => setHoursStr(e.target.value)}
              />
            </div>

            {/* Observações */}
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Observações / Orientações</Label>
              <Input 
                className="bg-background/50 border-border/50 rounded-xl h-9 font-bold text-xs" 
                placeholder="Ex: Diluir em 100ml de SF, Correr em 30 min, Verificar dextro antes..."
                value={observation}
                onChange={e => setObservation(e.target.value)}
              />
            </div>

            {/* Alta Vigilância - RODAPÉ DO FORMULÁRIO */}
            {category === 'medication' && (
              <div className="col-span-2 flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between p-3 bg-orange-500/5 border border-orange-500/20 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                      <ShieldAlert className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-black text-[11px] text-orange-600 dark:text-orange-400 uppercase tracking-widest">Alta Vigilância</p>
                      <p className="text-[9px] font-bold text-muted-foreground">Sinaliza medicação de risco.</p>
                    </div>
                  </div>
                  <Switch checked={isHighVigilance} onCheckedChange={setIsHighVigilance} className="scale-90" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <p className="font-black text-[11px] text-red-600 dark:text-red-400 uppercase tracking-widest">Requer Dupla Checagem</p>
                      <p className="text-[9px] font-bold text-muted-foreground">Exige confirmação de outro profissional.</p>
                    </div>
                  </div>
                  <Switch checked={requiresDoubleCheck} onCheckedChange={setRequiresDoubleCheck} className="scale-90" />
                </div>
              </div>
            )}

            {/* Alergia Detectada */}
            {category === 'medication' && isAllergic && (
              <div className="col-span-2 flex flex-col p-4 bg-red-600/10 border-2 border-red-500 rounded-xl mt-2 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse-slow">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-sm text-red-600 dark:text-red-400 uppercase tracking-wide">
                      Alergia Detectada!
                    </p>
                    <p className="text-xs text-red-600/80 dark:text-red-400/80 font-bold mt-1">
                      O paciente possui histórico de alergia que parece corresponder a este medicamento. 
                      <br />Alergias registradas: <span className="text-foreground bg-background/50 px-1 py-0.5 rounded ml-1">{patient?.allergies}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-red-500/20">
                  <Checkbox 
                    id="allergyOverride" 
                    checked={allergyOverride} 
                    onCheckedChange={(checked) => setAllergyOverride(checked === true)} 
                    className="border-red-500 data-[state=checked]:bg-red-500"
                  />
                  <Label htmlFor="allergyOverride" className="text-xs font-bold text-red-600 dark:text-red-400 cursor-pointer">
                    Estou ciente do risco e autorizo a prescrição sob minha responsabilidade.
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé com botões */}
          <DialogFooter className="mt-4 pt-4 shrink-0 border-t border-border/50 flex justify-between sm:justify-between items-center w-full">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setShowClearConfirm(true)} 
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl font-bold uppercase text-[10px] tracking-widest px-4"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Limpar
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-6">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isAllergic && !allergyOverride}
                className="bg-[#006699] hover:bg-[#004d73] dark:bg-sky-500 dark:hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold uppercase text-[10px] tracking-widest px-6"
              >
                Adicionar Item
              </Button>
            </div>
          </DialogFooter>
        </form>

        {/* Modal de Confirmação de Limpar (estilizado) */}
        {showClearConfirm && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-[2rem]">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm mx-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="font-black text-lg text-foreground uppercase tracking-wide">Limpar Formulário?</h3>
              <p className="text-sm text-muted-foreground font-bold mt-2">
                Todos os campos serão apagados. Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 mt-6 justify-center">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowClearConfirm(false)}
                  className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-6"
                >
                  Cancelar
                </Button>
                <Button 
                  type="button"
                  onClick={executeClear}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest px-6"
                >
                  Sim, Limpar
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
