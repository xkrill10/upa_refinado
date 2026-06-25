import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PrescriptionMedication, AprazamentoHour } from "@/context/PrescriptionsContext";
import { Activity, Pill, Stethoscope, Utensils, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface AddCareItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: PrescriptionMedication) => void;
}

export function AddCareItemModal({ isOpen, onClose, onAdd }: AddCareItemModalProps) {
  const [medication, setMedication] = useState("");
  const [category, setCategory] = useState<"medication" | "diet" | "therapy" | "nursing">("medication");
  const [dosage, setDosage] = useState("");
  const [route, setRoute] = useState("");
  const [frequency, setFrequency] = useState("");
  const [isHighVigilance, setIsHighVigilance] = useState(false);
  const [hoursStr, setHoursStr] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medication) {
      toast.error("O nome do item é obrigatório.");
      return;
    }

    // Parse hours: "08:00, 14:00" -> [{ hour: "08:00", status: "pending" }, ...]
    const parsedHours: AprazamentoHour[] = hoursStr
      .split(",")
      .map(h => h.trim())
      .filter(h => h.length === 5 && h.includes(":")) // basic validation
      .map(h => ({ hour: h, status: "pending" }));

    const newItem: PrescriptionMedication = {
      id: `item-${Date.now()}`,
      medication,
      category,
      dosage: dosage || "-",
      route: route || "-",
      frequency: frequency || "-",
      isHighVigilance,
      status: "active",
      hours: parsedHours
    };

    onAdd(newItem);
    
    // Reset form
    setMedication("");
    setCategory("medication");
    setDosage("");
    setRoute("");
    setFrequency("");
    setIsHighVigilance(false);
    setHoursStr("");
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card-premium border-white/40 dark:border-white/10 sm:max-w-xl rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase text-foreground">
            Adicionar Novo Item de Cuidado
          </DialogTitle>
          <DialogDescription className="font-bold text-slate-500">
            Preencha os dados do novo item para inseri-lo no plano terapêutico.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tipo / Categoria</Label>
              <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                <SelectTrigger className="bg-background/50 border-border/50 rounded-xl h-10 font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card rounded-xl">
                  <SelectItem value="medication">
                    <div className="flex items-center gap-2"><Pill className="h-4 w-4 text-purple-500" /> Medicamento / Infusão</div>
                  </SelectItem>
                  <SelectItem value="diet">
                    <div className="flex items-center gap-2"><Utensils className="h-4 w-4 text-orange-500" /> Dieta / Refeição</div>
                  </SelectItem>
                  <SelectItem value="therapy">
                    <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-500" /> Terapia / Fisioterapia</div>
                  </SelectItem>
                  <SelectItem value="nursing">
                    <div className="flex items-center gap-2"><Stethoscope className="h-4 w-4 text-[#006699]" /> Cuidado de Enfermagem</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nome do Item</Label>
              <Input 
                className="bg-background/50 border-border/50 rounded-xl h-10 font-bold" 
                placeholder="Ex: Dipirona, Fisioterapia Motora..."
                value={medication}
                onChange={e => setMedication(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dosagem / Quantidade</Label>
              <Input 
                className="bg-background/50 border-border/50 rounded-xl h-10 font-bold" 
                placeholder="Ex: 500mg, 1 Sessão"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Via / Local</Label>
              <Input 
                className="bg-background/50 border-border/50 rounded-xl h-10 font-bold" 
                placeholder="Ex: EV, VO, Leito"
                value={route}
                onChange={e => setRoute(e.target.value)}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Frequência</Label>
              <Input 
                className="bg-background/50 border-border/50 rounded-xl h-10 font-bold" 
                placeholder="Ex: 8/8H, 1x ao dia"
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Horários de Aprazamento</Label>
              <Input 
                className="bg-background/50 border-border/50 rounded-xl h-10 font-bold" 
                placeholder="Ex: 08:00, 14:00, 20:00 (separados por vírgula)"
                value={hoursStr}
                onChange={e => setHoursStr(e.target.value)}
              />
            </div>

            {category === 'medication' && (
              <div className="col-span-2 flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <ShieldAlert className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-red-600 dark:text-red-400">Alta Vigilância?</p>
                    <p className="text-xs text-muted-foreground">Exige dupla checagem para administração.</p>
                  </div>
                </div>
                <Switch checked={isHighVigilance} onCheckedChange={setIsHighVigilance} />
              </div>
            )}
          </div>

          <DialogFooter className="mt-8">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-6">
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#006699] hover:bg-[#004d73] dark:bg-sky-500 dark:hover:bg-sky-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest px-6">
              Adicionar Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
