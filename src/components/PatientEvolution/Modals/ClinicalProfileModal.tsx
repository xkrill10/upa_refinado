import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldAlert,
  Heart,
  Clipboard,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import { Patient } from "@/context/PatientsContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ClinicalProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSave: (id: string, updates: Partial<Patient>) => void;
}

export function ClinicalProfileModal({
  isOpen,
  onClose,
  patient,
  onSave,
}: ClinicalProfileModalProps) {
  const [mainComplaint, setMainComplaint] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergiesText, setAllergiesText] = useState("");
  const [comorbidities, setComorbidities] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [noAllergies, setNoAllergies] = useState(false);

  useEffect(() => {
    if (patient) {
      setMainComplaint(patient.mainComplaint || "");
      setBloodType(patient.bloodType || "");
      setAllergiesText(patient.allergies || "");
      setComorbidities(patient.comorbidities || "");
      setCurrentMedications(patient.currentMedications || "");
      setNoAllergies(
        patient.allergies === "Sem alergias conhecidas" || !patient.allergies,
      );
    }
  }, [patient, isOpen]);

  const handleSave = () => {
    const finalAllergies = noAllergies
      ? "Sem alergias conhecidas"
      : allergiesText.trim();

    onSave(patient.id, {
      mainComplaint: mainComplaint.trim(),
      bloodType,
      allergies: finalAllergies,
      comorbidities: comorbidities.trim(),
      currentMedications: currentMedications.trim(),
    });

    toast.success("Perfil clínico atualizado com sucesso!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] rounded-2xl glass-card-premium border border-white/40 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#006699] dark:text-sky-400 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 dark:bg-sky-500/10 flex items-center justify-center text-blue-500 dark:text-sky-400">
              <Heart className="h-5 w-5" />
            </div>
            Perfil Clínico & Fatores de Risco
          </DialogTitle>
          <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Atualização de Anamnese, Alergias e Condições Crônicas de{" "}
            {patient?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Queixa Principal */}
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Clipboard className="h-3.5 w-3.5 text-blue-500" />
              Queixa Principal
            </Label>
            <Input
              value={mainComplaint}
              onChange={(e) => setMainComplaint(e.target.value)}
              placeholder="Ex: Dor torácica intensa com irradiação para braço esquerdo..."
              className="rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-blue-500"
            />
          </div>

          {/* Duas colunas: Grupo Sanguíneo e Alergias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-red-500" />
                Grupo Sanguíneo
              </Label>
              <Select value={bloodType} onValueChange={setBloodType}>
                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                  <SelectValue placeholder="Selecione o tipo sanguíneo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="rounded-lg font-semibold"
                      >
                        Grupo {type}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-orange-500" />
                  Alergias
                </Label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold uppercase text-slate-500">
                  <input
                    type="checkbox"
                    checked={noAllergies}
                    onChange={(e) => {
                      setNoAllergies(e.target.checked);
                      if (e.target.checked) setAllergiesText("");
                    }}
                    className="rounded border-slate-300 dark:border-slate-800 text-blue-500 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  Sem alergias conhecidas
                </label>
              </div>
              <Input
                disabled={noAllergies}
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="Ex: Dipirona, Penicilina, Corantes..."
                className={cn(
                  "rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-orange-500",
                  noAllergies && "opacity-55 cursor-not-allowed",
                )}
              />
              {!noAllergies && allergiesText && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {allergiesText.split(",").map((alg, index) => {
                    const clean = alg.trim();
                    if (!clean) return null;
                    return (
                      <span
                        key={index}
                        className="text-[10px] font-black uppercase bg-red-500/10 dark:bg-red-500/15 border border-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md"
                      >
                        ⚠️ {clean}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Comorbidades */}
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              Comorbidades & Antecedentes Clínicos
            </Label>
            <Textarea
              value={comorbidities}
              onChange={(e) => setComorbidities(e.target.value)}
              placeholder="Ex: Hipertensão Arterial Sistêmica (HAS), Diabetes Mellitus Tipo 2 (DM2), Asma..."
              className="rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 min-h-[80px]"
            />
          </div>

          {/* Medicamentos de Uso Contínuo */}
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              Medicamentos de Uso Contínuo
            </Label>
            <Textarea
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              placeholder="Ex: Losartana 50mg/dia, Metformina 850mg/dia..."
              className="rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 min-h-[80px]"
            />
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-900">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl font-bold text-xs h-10 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="rounded-xl font-bold text-xs h-10 bg-[#006699] text-white hover:bg-[#005580] px-6 flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
