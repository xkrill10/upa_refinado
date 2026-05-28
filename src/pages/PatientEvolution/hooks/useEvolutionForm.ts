import { useState } from "react";
import { CID10Item } from "@/data/cid10";

export interface PrescriptionMedication {
  id: string;
  medication: string;
  dosage: string;
  route: string;
  frequency: string;
  status: 'awaiting_pharmacy' | 'dispensed' | 'administered';
  hours: string[];
}

export function useEvolutionForm() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [evolutionType, setEvolutionType] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "evolutions" | "prescriptions" | "vitals" | "exams" | "discharge">("all");
  const [professional, setProfessional] = useState(() => localStorage.getItem("upa_stamp_name") || "");
  const [description, setDescription] = useState("");
  const [selectedCid, setSelectedCid] = useState<CID10Item | null>(null);

  // Estados para os Dropdowns da Equipe Técnica
  const [isMedicationDropdownOpen, setIsMedicationDropdownOpen] = useState(false);
  const [isCareDropdownOpen, setIsCareDropdownOpen] = useState(false);
  const [isComfortDropdownOpen, setIsComfortDropdownOpen] = useState(false);
  const [isMovementDropdownOpen, setIsMovementDropdownOpen] = useState(false);

  // Estados para os Dropdowns do Super Painel SAE (Enfermagem)
  const [isSaeAdmissionDropdownOpen, setIsSaeAdmissionDropdownOpen] = useState(false);
  const [isSaeCareDropdownOpen, setIsSaeCareDropdownOpen] = useState(false);

  // Estados para o Super Painel de Prescrição Médica
  const [prescWizard, setPrescWizard] = useState({ medication: "", dosage: "", route: "", frequency: "" });
  const [prescribedMedications, setPrescribedMedications] = useState<PrescriptionMedication[]>([]);

  // Estados para os Dropdowns do Super Painel de Prescrição Médica
  const [isPrescMedicationDropdownOpen, setIsPrescMedicationDropdownOpen] = useState(false);
  const [isPrescDietDropdownOpen, setIsPrescDietDropdownOpen] = useState(false);

  // Estados para os Dropdowns do Super Painel de Alta
  const [isDischargeTypeDropdownOpen, setIsDischargeTypeDropdownOpen] = useState(false);
  const [isDischargeConductDropdownOpen, setIsDischargeConductDropdownOpen] = useState(false);

  // Estados para os Dropdowns do Super Painel Médico (Evolução Médica)
  const [isMedicalNeuroDropdownOpen, setIsMedicalNeuroDropdownOpen] = useState(false);
  const [isMedicalSyndromeDropdownOpen, setIsMedicalSyndromeDropdownOpen] = useState(false);
  const [isMedicalConductDropdownOpen, setIsMedicalConductDropdownOpen] = useState(false);

  // Estados para os Dropdowns do Super Painel Médico Pediátrico
  const [isPediatricNeuroDropdownOpen, setIsPediatricNeuroDropdownOpen] = useState(false);
  const [isPediatricSyndromeDropdownOpen, setIsPediatricSyndromeDropdownOpen] = useState(false);
  const [isPediatricConductDropdownOpen, setIsPediatricConductDropdownOpen] = useState(false);

  // Estados para os Dropdowns da Equipe Multidisciplinar
  const [isFisioEvalDropdownOpen, setIsFisioEvalDropdownOpen] = useState(false);
  const [isFisioProcDropdownOpen, setIsFisioProcDropdownOpen] = useState(false);
  const [isNutriEvalDropdownOpen, setIsNutriEvalDropdownOpen] = useState(false);
  const [isNutriProcDropdownOpen, setIsNutriProcDropdownOpen] = useState(false);
  const [isPsicoEvalDropdownOpen, setIsPsicoEvalDropdownOpen] = useState(false);
  const [isPsicoProcDropdownOpen, setIsPsicoProcDropdownOpen] = useState(false);
  const [isSocialEvalDropdownOpen, setIsSocialEvalDropdownOpen] = useState(false);
  const [isSocialProcDropdownOpen, setIsSocialProcDropdownOpen] = useState(false);
  const [isToEvalDropdownOpen, setIsToEvalDropdownOpen] = useState(false);
  const [isToProcDropdownOpen, setIsToProcDropdownOpen] = useState(false);
  const [isFonoEvalDropdownOpen, setIsFonoEvalDropdownOpen] = useState(false);
  const [isFonoProcDropdownOpen, setIsFonoProcDropdownOpen] = useState(false);
  const [isFarmaEvalDropdownOpen, setIsFarmaEvalDropdownOpen] = useState(false);
  const [isFarmaProcDropdownOpen, setIsFarmaProcDropdownOpen] = useState(false);

  const resetForm = () => {
    setIsFormOpen(false);
    setEvolutionType("");
    setProfessional(localStorage.getItem("upa_stamp_name") || "");
    setDescription("");
    setSelectedCid(null);
    setPrescribedMedications([]);
    setPrescWizard({ medication: "", dosage: "", route: "", frequency: "" });
  };

  return {
    isFormOpen, setIsFormOpen,
    evolutionType, setEvolutionType,
    activeTab, setActiveTab,
    professional, setProfessional,
    description, setDescription,
    selectedCid, setSelectedCid,
    
    prescWizard, setPrescWizard,
    prescribedMedications, setPrescribedMedications,

    isMedicationDropdownOpen, setIsMedicationDropdownOpen,
    isCareDropdownOpen, setIsCareDropdownOpen,
    isComfortDropdownOpen, setIsComfortDropdownOpen,
    isMovementDropdownOpen, setIsMovementDropdownOpen,
    
    isSaeAdmissionDropdownOpen, setIsSaeAdmissionDropdownOpen,
    isSaeCareDropdownOpen, setIsSaeCareDropdownOpen,
    
    isPrescMedicationDropdownOpen, setIsPrescMedicationDropdownOpen,
    isPrescDietDropdownOpen, setIsPrescDietDropdownOpen,
    
    isDischargeTypeDropdownOpen, setIsDischargeTypeDropdownOpen,
    isDischargeConductDropdownOpen, setIsDischargeConductDropdownOpen,
    
    isMedicalNeuroDropdownOpen, setIsMedicalNeuroDropdownOpen,
    isMedicalSyndromeDropdownOpen, setIsMedicalSyndromeDropdownOpen,
    isMedicalConductDropdownOpen, setIsMedicalConductDropdownOpen,
    
    isPediatricNeuroDropdownOpen, setIsPediatricNeuroDropdownOpen,
    isPediatricSyndromeDropdownOpen, setIsPediatricSyndromeDropdownOpen,
    isPediatricConductDropdownOpen, setIsPediatricConductDropdownOpen,
    
    isFisioEvalDropdownOpen, setIsFisioEvalDropdownOpen,
    isFisioProcDropdownOpen, setIsFisioProcDropdownOpen,
    isNutriEvalDropdownOpen, setIsNutriEvalDropdownOpen,
    isNutriProcDropdownOpen, setIsNutriProcDropdownOpen,
    isPsicoEvalDropdownOpen, setIsPsicoEvalDropdownOpen,
    isPsicoProcDropdownOpen, setIsPsicoProcDropdownOpen,
    isSocialEvalDropdownOpen, setIsSocialEvalDropdownOpen,
    isSocialProcDropdownOpen, setIsSocialProcDropdownOpen,
    isToEvalDropdownOpen, setIsToEvalDropdownOpen,
    isToProcDropdownOpen, setIsToProcDropdownOpen,
    isFonoEvalDropdownOpen, setIsFonoEvalDropdownOpen,
    isFonoProcDropdownOpen, setIsFonoProcDropdownOpen,
    isFarmaEvalDropdownOpen, setIsFarmaEvalDropdownOpen,
    isFarmaProcDropdownOpen, setIsFarmaProcDropdownOpen,
    
    resetForm
  };
}
