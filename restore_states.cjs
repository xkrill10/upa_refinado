const fs = require('fs');

const srcPath = 'C:/Users/Jhon/Desktop/upa_final/src/pages/PatientEvolution.tsx';
let lines = fs.readFileSync(srcPath, 'utf-8').split('\n');

const importIdx = lines.findIndex(l => l.includes('import { ModalsContainer }'));
if (importIdx > -1) {
  lines.splice(importIdx, 0, 
    "import { useEvolutionForm } from './PatientEvolution/hooks/useEvolutionForm';",
    "import { useModalsState } from './PatientEvolution/hooks/useModalsState';"
  );
}

const replaceStart = lines.findIndex(l => l.includes('const [isBedDialogOpen, setIsBedDialogOpen] = useState(false);'));
const replaceEnd1 = lines.findIndex(l => l.includes('const patientBed = beds.find(b => b.patientId === id);'));

if (replaceStart > -1 && replaceEnd1 > -1) {
  const replacement = `  const modalsState = useModalsState();
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
  
  lines.splice(replaceStart, replaceEnd1 - replaceStart, replacement);
}

const formStart = lines.findIndex(l => l.includes('const [isFormOpen, setIsFormOpen] = useState(false);'));
const formEnd1 = lines.findIndex(l => l.includes('const cidContainerRef = useRef<HTMLDivElement>(null);'));

if (formStart > -1 && formEnd1 > -1) {
  const replacementForm = `  const form = useEvolutionForm();
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
  lines.splice(formStart, formEnd1 - formStart, replacementForm);
}

const midStart = lines.findIndex(l => l.includes('// Estados para os Dropdowns da Equipe Técnica'));
const midEnd = lines.findIndex(l => l.includes('// Estados para o Super Painel de Prescrição Médica'));
if (midStart > -1 && midEnd > -1) {
  lines.splice(midStart, midEnd - midStart);
}

const lateStart = lines.findIndex(l => l.includes('// Estados para os Dropdowns do Super Painel de Prescrição Médica'));
const lateEnd = lines.findIndex(l => l.includes('const [isFarmaProcDropdownOpen, setIsFarmaProcDropdownOpen] = useState(false);'));
if (lateStart > -1 && lateEnd > -1) {
  lines.splice(lateStart, lateEnd - lateStart + 1);
}

// Re-write file
fs.writeFileSync(srcPath, lines.join('\n'));
console.log('Restored states precisely!');
