const fs = require('fs');

const srcPath = 'C:/Users/Jhon/Desktop/upa_final/src/pages/PatientEvolution.tsx';
// Reset file first
require('child_process').execSync('git checkout src/pages/PatientEvolution.tsx', { cwd: 'C:/Users/Jhon/Desktop/upa_final' });

let file = fs.readFileSync(srcPath, 'utf-8');

// 1. Add Imports
file = file.replace(
  'import { Link } from "react-router-dom";',
  `import { Link } from "react-router-dom";
import { useVitals } from "./PatientEvolution/hooks/useVitals";
import { useEvolutionForm } from "./PatientEvolution/hooks/useEvolutionForm";
import { useModalsState } from "./PatientEvolution/hooks/useModalsState";
import { EvolutionFormPanel } from "./PatientEvolution/components/EvolutionFormPanel";
import { ModalsContainer } from "./PatientEvolution/components/ModalsContainer";`
);

// 2. Replace Modals State
const modalsStateStr = `  const modalsState = useModalsState();
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
  } = modalsState;

  const { vitals, handleVitalsChange, clearVitals } = useVitals();
`;

// Extract from isBedDialogOpen down to isBedRequestOpen
const bedDialogStart = file.indexOf('const [isBedDialogOpen, setIsBedDialogOpen] = useState(false);');
const bedDialogEnd = file.indexOf('const [isBedRequestOpen, setIsBedRequestOpen] = useState(false);');
const afterBedDialog = file.indexOf('\n', bedDialogEnd) + 1;

file = file.substring(0, bedDialogStart) + modalsStateStr + file.substring(afterBedDialog);

// 3. Replace Evolution Form State
const formStateStr = `  const form = useEvolutionForm();
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
  } = form;

  const applyTemplate = (template: string) => {
    setDescription(template);
  };
`;

const formOpenStart = file.indexOf('const [isFormOpen, setIsFormOpen] = useState(false);');
const cidEnd = file.indexOf('const [selectedCid, setSelectedCid] = useState<CID10Item | null>(null);');
const afterCidEnd = file.indexOf('\n', cidEnd) + 1;

file = file.substring(0, formOpenStart) + formStateStr + file.substring(afterCidEnd);

// 4. Remove leftover Dropdowns and Vitals States!
// Vitals:
const vitalsStart = file.indexOf('const [vsBloodPressure, setVsBloodPressure] = useState("");');
const vitalsEnd = file.indexOf('const [vsConsciousness, setVsConsciousness] = useState("A");');
const afterVitals = file.indexOf('\n', vitalsEnd) + 1;
if (vitalsStart > -1 && vitalsEnd > -1) {
  file = file.substring(0, vitalsStart) + file.substring(afterVitals);
}

// Tech Team Dropdowns:
const techStart = file.indexOf('// Estados para os Dropdowns da Equipe Técnica');
const medStart = file.indexOf('// Estados para o Super Painel de Prescrição Médica');
if (techStart > -1 && medStart > -1) {
  file = file.substring(0, techStart) + file.substring(medStart);
}

// Med Dropdowns:
const medDropStart = file.indexOf('// Estados para os Dropdowns do Super Painel de Prescrição Médica');
const farmaEnd = file.indexOf('const [isFarmaProcDropdownOpen, setIsFarmaProcDropdownOpen] = useState(false);');
const afterFarma = file.indexOf('\n', farmaEnd) + 1;
if (medDropStart > -1 && farmaEnd > -1) {
  file = file.substring(0, medDropStart) + file.substring(afterFarma);
}

// 5. Replace Evolution Form with <EvolutionFormPanel />
const formStartMarker = '<AnimatePresence>';
const formEndMarker = '</AnimatePresence>';

let formStartIdx = file.indexOf(formStartMarker);
// We want the SECOND AnimatePresence, which wraps the form! The first one might wrap the timeline or something?
// Actually wait, there is only one AnimatePresence in the main block? Let's check where it is.
// The form is inside AnimatePresence > motion.div
if (formStartIdx > -1) {
  // To be safe, let's find the AnimatePresence that appears AFTER `return (`
  const returnIdx = file.indexOf('return (');
  formStartIdx = file.indexOf(formStartMarker, returnIdx);
  
  if (formStartIdx > -1) {
    // Find the matching </AnimatePresence>
    const formEndIdx = file.lastIndexOf(formEndMarker);
    if (formEndIdx > formStartIdx) {
      const panelStr = `      <EvolutionFormPanel 
        form={form} 
        patient={patient} 
        isChild={isChild} 
        modalsState={modalsState} 
        vitals={vitals} 
        clearVitals={clearVitals} 
        handleSaveEvolution={handleSaveEvolution} 
        renderPanelDropdown={renderPanelDropdown} 
        toggleCareItem={toggleCareItem} 
        applyTemplate={applyTemplate} 
      />`;
      
      file = file.substring(0, formStartIdx) + panelStr + file.substring(formEndIdx + formEndMarker.length);
    }
  }
}

// 6. Replace Modals with <ModalsContainer />
const firstModalIdx = file.indexOf('<MorseModal');
const lastDivIdx = file.lastIndexOf('</motion.div>');
if (firstModalIdx > -1 && lastDivIdx > -1) {
  const modalsStr = `      <ModalsContainer 
        modalsState={modalsState} 
        description={description} 
        setDescription={setDescription} 
        patient={patient} 
        updatePatient={updatePatient} 
      />\n    `;
  file = file.substring(0, firstModalIdx) + modalsStr + file.substring(lastDivIdx);
}

fs.writeFileSync(srcPath, file);
console.log('Master script completed successfully!');
