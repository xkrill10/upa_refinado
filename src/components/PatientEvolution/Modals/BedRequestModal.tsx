import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BedDouble, AlertCircle, Activity, Sparkles } from "lucide-react";
import { Patient, usePatientsContext } from "@/context/PatientsContext";
import { cn } from "@/lib/utils";

interface BedRequestModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

export function BedRequestModal({ patient, isOpen, onClose }: BedRequestModalProps) {
  const { requestAdmission } = usePatientsContext();
  const [selectedType, setSelectedType] = useState<'emergency' | 'observation' | null>(null);

  const handleSubmit = () => {
    if (selectedType) {
      const doctorName = localStorage.getItem("upa_stamp_name") || "Médico Assistente";
      requestAdmission(patient.id, selectedType, doctorName);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-0 overflow-hidden glass-card-premium border border-white/40 dark:border-white/10 shadow-2xl">
        <div className="p-6 border-b border-white/20 dark:border-white/5 flex items-center gap-4 bg-white/40 dark:bg-slate-900/40">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-[#006699] flex items-center justify-center text-white shadow-lg">
            <BedDouble className="h-6 w-6" />
          </div>
          <div>
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-foreground">Solicitar Vaga</DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">
              {patient.name}
            </DialogDescription>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-4">Escolha o tipo de leito necessário</p>
          
          <div className="grid grid-cols-1 gap-3">
            <div 
              onClick={() => setSelectedType('emergency')}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4",
                selectedType === 'emergency' 
                  ? "border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
                  : "border-slate-200 dark:border-slate-800 hover:border-red-500/50 hover:bg-red-500/5"
              )}
            >
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", selectedType === 'emergency' ? "bg-red-500 text-white" : "bg-red-500/20 text-red-500")}>
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-tight text-red-600 dark:text-red-400">Leito de Emergência</h4>
                <p className="text-[10px] font-bold text-muted-foreground mt-0.5">Sala Vermelha / Estabilização imediata</p>
              </div>
            </div>

            <div 
              onClick={() => setSelectedType('observation')}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4",
                selectedType === 'observation' 
                  ? "border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]" 
                  : "border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/5"
              )}
            >
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", selectedType === 'observation' ? "bg-amber-500 text-white" : "bg-amber-500/20 text-amber-500")}>
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-tight text-amber-600 dark:text-amber-400">Leito de Observação</h4>
                <p className="text-[10px] font-bold text-muted-foreground mt-0.5">Ala Amarela / Observação clínica</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-white/20 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase text-[10px] tracking-widest">
            Cancelar
          </Button>
          <Button 
            disabled={!selectedType}
            onClick={handleSubmit}
            className="rounded-xl font-black uppercase text-[10px] tracking-widest bg-[#006699] hover:bg-[#004d73] text-white shadow-lg"
          >
            Confirmar Solicitação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
