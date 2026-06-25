import { useState } from "react";

export function useEvolutionDropdowns() {
  // Equipe Técnica
  const [isMedicationDropdownOpen, setIsMedicationDropdownOpen] =
    useState(false);
  const [isCareDropdownOpen, setIsCareDropdownOpen] = useState(false);
  const [isComfortDropdownOpen, setIsComfortDropdownOpen] = useState(false);
  const [isMovementDropdownOpen, setIsMovementDropdownOpen] = useState(false);

  // Super Painel SAE (Enfermagem)
  const [isSaeAdmissionDropdownOpen, setIsSaeAdmissionDropdownOpen] =
    useState(false);
  const [isSaeCareDropdownOpen, setIsSaeCareDropdownOpen] = useState(false);

  // Super Painel de Prescrição Médica
  const [isPrescMedicationDropdownOpen, setIsPrescMedicationDropdownOpen] =
    useState(false);
  const [isPrescDietDropdownOpen, setIsPrescDietDropdownOpen] = useState(false);

  // Super Painel de Alta
  const [isDischargeTypeDropdownOpen, setIsDischargeTypeDropdownOpen] =
    useState(false);
  const [isDischargeConductDropdownOpen, setIsDischargeConductDropdownOpen] =
    useState(false);

  // Super Painel Médico (Evolução Médica)
  const [isMedicalNeuroDropdownOpen, setIsMedicalNeuroDropdownOpen] =
    useState(false);
  const [isMedicalSyndromeDropdownOpen, setIsMedicalSyndromeDropdownOpen] =
    useState(false);
  const [isMedicalConductDropdownOpen, setIsMedicalConductDropdownOpen] =
    useState(false);

  // Super Painel Médico Pediátrico
  const [isPediatricNeuroDropdownOpen, setIsPediatricNeuroDropdownOpen] =
    useState(false);
  const [isPediatricSyndromeDropdownOpen, setIsPediatricSyndromeDropdownOpen] =
    useState(false);
  const [isPediatricConductDropdownOpen, setIsPediatricConductDropdownOpen] =
    useState(false);

  // Equipe Multidisciplinar
  const [isFisioEvalDropdownOpen, setIsFisioEvalDropdownOpen] = useState(false);
  const [isFisioProcDropdownOpen, setIsFisioProcDropdownOpen] = useState(false);
  const [isNutriEvalDropdownOpen, setIsNutriEvalDropdownOpen] = useState(false);
  const [isNutriProcDropdownOpen, setIsNutriProcDropdownOpen] = useState(false);
  const [isPsicoEvalDropdownOpen, setIsPsicoEvalDropdownOpen] = useState(false);
  const [isPsicoProcDropdownOpen, setIsPsicoProcDropdownOpen] = useState(false);
  const [isSocialEvalDropdownOpen, setIsSocialEvalDropdownOpen] =
    useState(false);
  const [isSocialProcDropdownOpen, setIsSocialProcDropdownOpen] =
    useState(false);
  const [isToEvalDropdownOpen, setIsToEvalDropdownOpen] = useState(false);
  const [isToProcDropdownOpen, setIsToProcDropdownOpen] = useState(false);
  const [isFonoEvalDropdownOpen, setIsFonoEvalDropdownOpen] = useState(false);
  const [isFonoProcDropdownOpen, setIsFonoProcDropdownOpen] = useState(false);
  const [isFarmaEvalDropdownOpen, setIsFarmaEvalDropdownOpen] = useState(false);
  const [isFarmaProcDropdownOpen, setIsFarmaProcDropdownOpen] = useState(false);

  return {
    isMedicationDropdownOpen,
    setIsMedicationDropdownOpen,
    isCareDropdownOpen,
    setIsCareDropdownOpen,
    isComfortDropdownOpen,
    setIsComfortDropdownOpen,
    isMovementDropdownOpen,
    setIsMovementDropdownOpen,
    isSaeAdmissionDropdownOpen,
    setIsSaeAdmissionDropdownOpen,
    isSaeCareDropdownOpen,
    setIsSaeCareDropdownOpen,
    isPrescMedicationDropdownOpen,
    setIsPrescMedicationDropdownOpen,
    isPrescDietDropdownOpen,
    setIsPrescDietDropdownOpen,
    isDischargeTypeDropdownOpen,
    setIsDischargeTypeDropdownOpen,
    isDischargeConductDropdownOpen,
    setIsDischargeConductDropdownOpen,
    isMedicalNeuroDropdownOpen,
    setIsMedicalNeuroDropdownOpen,
    isMedicalSyndromeDropdownOpen,
    setIsMedicalSyndromeDropdownOpen,
    isMedicalConductDropdownOpen,
    setIsMedicalConductDropdownOpen,
    isPediatricNeuroDropdownOpen,
    setIsPediatricNeuroDropdownOpen,
    isPediatricSyndromeDropdownOpen,
    setIsPediatricSyndromeDropdownOpen,
    isPediatricConductDropdownOpen,
    setIsPediatricConductDropdownOpen,
    isFisioEvalDropdownOpen,
    setIsFisioEvalDropdownOpen,
    isFisioProcDropdownOpen,
    setIsFisioProcDropdownOpen,
    isNutriEvalDropdownOpen,
    setIsNutriEvalDropdownOpen,
    isNutriProcDropdownOpen,
    setIsNutriProcDropdownOpen,
    isPsicoEvalDropdownOpen,
    setIsPsicoEvalDropdownOpen,
    isPsicoProcDropdownOpen,
    setIsPsicoProcDropdownOpen,
    isSocialEvalDropdownOpen,
    setIsSocialEvalDropdownOpen,
    isSocialProcDropdownOpen,
    setIsSocialProcDropdownOpen,
    isToEvalDropdownOpen,
    setIsToEvalDropdownOpen,
    isToProcDropdownOpen,
    setIsToProcDropdownOpen,
    isFonoEvalDropdownOpen,
    setIsFonoEvalDropdownOpen,
    isFonoProcDropdownOpen,
    setIsFonoProcDropdownOpen,
    isFarmaEvalDropdownOpen,
    setIsFarmaEvalDropdownOpen,
    isFarmaProcDropdownOpen,
    setIsFarmaProcDropdownOpen,
  };
}
