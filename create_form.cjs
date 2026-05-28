const fs = require('fs');

const srcLines = fs.readFileSync('C:/Users/Jhon/Desktop/upa_final/src/pages/PatientEvolution.tsx', 'utf-8').split('\n');

const jsxLines = srcLines.slice(1084, 3709 + 1);

const destructuring = `
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
  } = vitals;

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
`;

const finalContent = `import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Stethoscope, Activity, FileText, Pill, Plus, Trash2, Shield, Calendar, Scale,
  User, Printer, CheckCircle2, AlertCircle, RefreshCw, Save, Clock, Copy, Brain, History, Heart, UserPlus, Lungs, Flame, Droplets, Bone, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  CID10_DATABASE, EVOLUTION_TEMPLATES, 
  MEDICAL_PHYSICAL_NEURO_ITEMS, MEDICAL_PHYSICAL_SYNDROME_ITEMS, MEDICAL_CONDUCT_ITEMS,
  PEDIATRIC_NEURO_ITEMS, PEDIATRIC_SYNDROME_ITEMS, PEDIATRIC_CONDUCT_ITEMS,
  FISIO_EVAL_ITEMS, FISIO_PROC_ITEMS, NUTRI_EVAL_ITEMS, NUTRI_PROC_ITEMS,
  PSICO_EVAL_ITEMS, PSICO_PROC_ITEMS, SOCIAL_EVAL_ITEMS, SOCIAL_PROC_ITEMS,
  TO_EVAL_ITEMS, TO_PROC_ITEMS, FONO_EVAL_ITEMS, FONO_PROC_ITEMS,
  FARMA_EVAL_ITEMS, FARMA_PROC_ITEMS,
  NURSING_SAE_ADMISSION_ITEMS, NURSING_SAE_CARE_ITEMS,
  MEDICATION_ITEMS, CARE_ITEMS, COMFORT_ITEMS, MOVEMENT_ITEMS,
  PRESC_DIET_ITEMS, DISCHARGE_TYPE_ITEMS, DISCHARGE_CONDUCT_ITEMS
} from "@/data/evolutionTemplates";

export function EvolutionFormPanel({ 
  form, vitals, modalsState, patient, isChild, 
  patientAge, handleEvolutionTypeChange, toggleCareItem, 
  normalizeText, toast, isStampConfigOpen, setIsStampConfigOpen,
  stampName, setStampName, stampCouncil, setStampCouncil, 
  stampNumber, setStampNumber, stampState, setStampState,
  handleEvolutionSubmit, saveEvolutionAsPdf, isSubmitting
}: any) {
  const evolutionTextRef = useRef<HTMLTextAreaElement>(null);
  
${destructuring}

  return (
    <>
${jsxLines.join('\n')}
    </>
  );
}
`;

fs.writeFileSync('C:/Users/Jhon/Desktop/upa_final/src/pages/PatientEvolution/components/EvolutionFormPanel.tsx', finalContent);
console.log('Successfully created EvolutionFormPanel.tsx');
