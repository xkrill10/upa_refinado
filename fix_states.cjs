const fs = require('fs');

const srcPath = 'C:/Users/Jhon/Desktop/upa_final/src/pages/PatientEvolution.tsx';
let text = fs.readFileSync(srcPath, 'utf-8');

// Replace Modals State
const modalsStart = '  const [isBedDialogOpen, setIsBedDialogOpen] = useState(false);';
const modalsEnd = '  const [isTimelineOpen, setIsTimelineOpen] = useState(false);';

const modalsStateReplacement = `  const modalsState = useModalsState();
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
  } = modalsState;`;

let startIdx = text.indexOf(modalsStart);
let endIdx = text.indexOf(modalsEnd) + modalsEnd.length;
text = text.slice(0, startIdx) + modalsStateReplacement + text.slice(endIdx);

// Replace Form State
const formStart = '  const [isFormOpen, setIsFormOpen] = useState(false);';
const formEnd = '  const [isFarmaProcDropdownOpen, setIsFarmaProcDropdownOpen] = useState(false);';

const formStateReplacement = `  const form = useEvolutionForm();
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
  } = form;`;

startIdx = text.indexOf(formStart);
endIdx = text.indexOf(formEnd) + formEnd.length;
text = text.slice(0, startIdx) + formStateReplacement + text.slice(endIdx);

// Replace Vitals State
const vitalsStart = '  const [vsBloodPressure, setVsBloodPressure] = useState("");';
const vitalsEnd = '  const [vsConsciousness, setVsConsciousness] = useState("A");';

const vitalsReplacement = `  const {
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
  } = useVitals();`;

startIdx = text.indexOf(vitalsStart);
endIdx = text.indexOf(vitalsEnd) + vitalsEnd.length;
text = text.slice(0, startIdx) + vitalsReplacement + text.slice(endIdx);

// Delete Vitals methods that are now in hook
const vitalsMethodsStart = '  // Derivação de PAS e PAD baseada em vsBloodPressure';
const vitalsMethodsEnd = '    setVsConsciousness("A");\n  };';
startIdx = text.indexOf(vitalsMethodsStart);
endIdx = text.indexOf(vitalsMethodsEnd) + vitalsMethodsEnd.length;
text = text.slice(0, startIdx) + text.slice(endIdx);

fs.writeFileSync(srcPath, text);
console.log('States replaced properly!');
