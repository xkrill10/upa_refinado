const fs = require('fs');

const srcPath = 'C:/Users/Jhon/Desktop/upa_final/src/pages/PatientEvolution.tsx';
let lines = fs.readFileSync(srcPath, 'utf-8').split('\n');

// 1. Add imports
const importIdx = lines.findIndex(l => l.includes('import { Link } from "react-router-dom";'));
if (importIdx > -1) {
  lines.splice(importIdx + 1, 0, 
    'import { useVitals } from "./PatientEvolution/hooks/useVitals";',
    'import { useEvolutionForm } from "./PatientEvolution/hooks/useEvolutionForm";',
    'import { useModalsState } from "./PatientEvolution/hooks/useModalsState";'
  );
}

// 2. Modals state
const modalsStart = lines.findIndex(l => l.includes('const [isBedDialogOpen, setIsBedDialogOpen] = useState(false);'));
const modalsEnd = lines.findIndex(l => l.includes('const [isTimelineOpen, setIsTimelineOpen] = useState(false);'));
if (modalsStart > -1 && modalsEnd > -1) {
  lines.splice(modalsStart, modalsEnd - modalsStart + 1, 
    `  const modalsState = useModalsState();
  const {
    openMorseCalc, setOpenMorseCalc, selectedMorse, setSelectedMorse,
    openBradenCalc, setOpenBradenCalc, selectedBraden, setSelectedBraden,
    openEvaCalc, setOpenEvaCalc, selectedEva, setSelectedEva,
    openMewsCalc, setOpenMewsCalc, selectedMews, setSelectedMews,
    openNews2Calc, setOpenNews2Calc, selectedNews2, setSelectedNews2,
    openQsofaCalc, setOpenQsofaCalc, selectedQsofa, setSelectedQsofa,
    openPewsCalc, setOpenPewsCalc, selectedPews, setSelectedPews,
    openGlasgowCalc, setOpenGlasgowCalc, selectedGlasgow, setSelectedGlasgow,
    openMentalCalc, setOpenMentalCalc, selectedMentalSummary, setSelectedMentalSummary,
    openUrgencyCalc, setOpenUrgencyCalc, selectedUrgencySummary, setSelectedUrgencySummary,
    openNandaCalc, setOpenNandaCalc, activeNandaPlan, setActiveNandaPlan,
    openNursingCalc, setOpenNursingCalc, selectedNursingSummary, setSelectedNursingSummary,
    openHeartCalc, setOpenHeartCalc,
    openCurb65Calc, setOpenCurb65Calc,
    openWellsCalc, setOpenWellsCalc,
    openNihssCalc, setOpenNihssCalc,
    openDehydrationCalc, setOpenDehydrationCalc,
    openWoodDownesCalc, setOpenWoodDownesCalc,
    openParklandCalc, setOpenParklandCalc,
    isBedDialogOpen, setIsBedDialogOpen,
    isClinicalProfileOpen, setIsClinicalProfileOpen,
    isVitalsHistoryOpen, setIsVitalsHistoryOpen,
    isBedRequestOpen, setIsBedRequestOpen,
    openBedTransfer, setOpenBedTransfer,
    openBedStatus, setOpenBedStatus,
    isTimelineOpen, setIsTimelineOpen
  } = modalsState;`
  );
}

// 3. Form state
const formStart = lines.findIndex(l => l.includes('const [isFormOpen, setIsFormOpen] = useState(false);'));
const formEnd = lines.findIndex(l => l.includes('const [isFarmaProcDropdownOpen, setIsFarmaProcDropdownOpen] = useState(false);'));
if (formStart > -1 && formEnd > -1) {
  lines.splice(formStart, formEnd - formStart + 1,
    `  const form = useEvolutionForm();
  const {
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
  } = form;`
  );
}

// 4. Vitals state
const vitalsStart = lines.findIndex(l => l.includes('const [vsBloodPressure, setVsBloodPressure] = useState("");'));
const vitalsEnd = lines.findIndex(l => l.includes('const [vsConsciousness, setVsConsciousness] = useState("A");'));
if (vitalsStart > -1 && vitalsEnd > -1) {
  lines.splice(vitalsStart, vitalsEnd - vitalsStart + 1,
    `  const vitals = useVitals();
  const {
    vsBloodPressure, setVsBloodPressure,
    vsHeartRate, setVsHeartRate,
    vsRespiratoryRate, setVsRespiratoryRate,
    vsTemperature, setVsTemperature,
    vsSpO2, setVsSpO2,
    vsPain, setVsPain,
    vsConsciousness, setVsConsciousness,
    isDefaultBloodPressure, isDefaultHeartRate, isDefaultRespiratoryRate,
    isDefaultTemperature, isDefaultSpO2, isDefaultPain, isDefaultConsciousness,
    handleBloodPressureChange, handleBloodPressureBlur,
    calculateMEWS, getMEWSClassification, clearVitals, setInitialVitals
  } = vitals;`
  );
}

// 5. Delete Vitals methods that are now in hook
const vitalsMethodsStart = lines.findIndex(l => l.includes('// Derivação de PAS e PAD baseada em vsBloodPressure'));
const vitalsMethodsEnd = lines.findIndex(l => l.includes('// Limpar campos de sinais vitais')) - 1; 
if (vitalsMethodsStart > -1 && vitalsMethodsEnd > -1) {
  lines.splice(vitalsMethodsStart, vitalsMethodsEnd - vitalsMethodsStart + 1);
}

fs.writeFileSync(srcPath, lines.join('\n'));
console.log('States replaced properly with correct newlines!');
