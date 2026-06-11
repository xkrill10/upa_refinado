import re

with open('src/pages/PatientEvolution.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Imports
content = content.replace(
    'import { Link } from "react-router-dom";',
    'import { Link } from "react-router-dom";\nimport { useEvolutionDropdowns } from "@/hooks/useEvolutionDropdowns";\nimport { useEvolutionCalculators } from "@/hooks/useEvolutionCalculators";'
)

# 1. Replace the first block with BOTH hooks destructuring
hooks_str = """  const {
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
    isFarmaProcDropdownOpen, setIsFarmaProcDropdownOpen
  } = useEvolutionDropdowns();

  const {
    openMorseCalc, setOpenMorseCalc,
    selectedMorse, setSelectedMorse,
    openBradenCalc, setOpenBradenCalc,
    selectedBraden, setSelectedBraden,
    openEvaCalc, setOpenEvaCalc,
    selectedEva, setSelectedEva,
    openMewsCalc, setOpenMewsCalc,
    selectedMews, setSelectedMews,
    openNews2Calc, setOpenNews2Calc,
    selectedNews2, setSelectedNews2,
    openQsofaCalc, setOpenQsofaCalc,
    selectedQsofa, setSelectedQsofa,
    openPewsCalc, setOpenPewsCalc,
    selectedPews, setSelectedPews,
    openGlasgowCalc, setOpenGlasgowCalc,
    selectedGlasgow, setSelectedGlasgow,
    openMentalCalc, setOpenMentalCalc,
    selectedMentalSummary, setSelectedMentalSummary,
    openUrgencyCalc, setOpenUrgencyCalc,
    selectedUrgencySummary, setSelectedUrgencySummary,
    openNandaCalc, setOpenNandaCalc,
    activeNandaPlan, setActiveNandaPlan,
    openNursingCalc, setOpenNursingCalc,
    selectedNursingSummary, setSelectedNursingSummary,
    openHeartCalc, setOpenHeartCalc,
    openCurb65Calc, setOpenCurb65Calc,
    openWellsCalc, setOpenWellsCalc,
    openNihssCalc, setOpenNihssCalc,
    openDehydrationCalc, setOpenDehydrationCalc,
    openWoodDownesCalc, setOpenWoodDownesCalc,
    openParklandCalc, setOpenParklandCalc
  } = useEvolutionCalculators();"""

chunk_tec = """  // Estados para os Dropdowns da Equipe Técnica
  const [isMedicationDropdownOpen, setIsMedicationDropdownOpen] =
    useState(false);
  const [isCareDropdownOpen, setIsCareDropdownOpen] = useState(false);
  const [isComfortDropdownOpen, setIsComfortDropdownOpen] = useState(false);
  const [isMovementDropdownOpen, setIsMovementDropdownOpen] = useState(false);"""

content = content.replace(chunk_tec, hooks_str)

# 2. Delete the rest using safe regular expressions (matching explicitly by comment block to comment block)

def remove_between(start_str, end_str, text):
    start_idx = text.find(start_str)
    end_idx = text.find(end_str)
    if start_idx != -1 and end_idx != -1:
        return text[:start_idx] + text[end_idx:]
    return text

# Remove Calculadoras
content = remove_between(
    "  // Estados para as calculadoras clínicas (Enfermagem)",
    "  // Estados para os Dropdowns do Super Painel SAE (Enfermagem)",
    content
)

# Remove SAE
content = remove_between(
    "  // Estados para os Dropdowns do Super Painel SAE (Enfermagem)",
    "  // Estados para o Super Painel de Prescrição Médica",
    content
)

# Remove Prescrição Dropdowns
content = remove_between(
    "  // Estados para os Dropdowns do Super Painel de Prescrição Médica",
    "  // Estados para os Dropdowns do Super Painel de Alta",
    content
)

# Remove Alta e Medico
content = remove_between(
    "  // Estados para os Dropdowns do Super Painel de Alta",
    "  // Estados Calculadoras Médicas Extras",
    content
)

# Remove Calc Extras
content = remove_between(
    "  // Estados Calculadoras Médicas Extras",
    "  // Estados Gestão de Leitos",
    content
)

# Remove Multidisciplinar
content = remove_between(
    "  // Estados para os Dropdowns da Equipe Multidisciplinar",
    "  const normalizeText = (text: string) => {",
    content
)

with open('src/pages/PatientEvolution.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("done")
