const fs = require('fs');

const srcPath = 'C:/Users/Jhon/Desktop/upa_final/src/pages/PatientEvolution.tsx';
const destPath = 'C:/Users/Jhon/Desktop/upa_final/src/pages/PatientEvolution/components/EvolutionFormPanel.tsx';

let file = fs.readFileSync(srcPath, 'utf-8');
const lines = file.split('\n');

const startIdx = lines.findIndex((l, i) => l.includes('<AnimatePresence>') && i > 900);
const endIdx = lines.findIndex((l, i) => l.includes('</AnimatePresence>') && i > 3300);

if (startIdx > -1 && endIdx > -1) {
  const extracted = lines.slice(startIdx, endIdx + 1).join('\n');
  
  const componentContent = `import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { SmartCidSelector } from '@/components/SmartCidSelector';
import { VitalsFormPanel } from './VitalsFormPanel';
import { Plus, X, Activity, ShieldAlert, Brain, Pill, Stethoscope, Droplets, Heart, Syringe, Save, Bed as BedIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { 
  EVOLUTION_TEMPLATES, 
  MEDICAL_NEURO_ITEMS, MEDICAL_SYNDROME_ITEMS, MEDICAL_CONDUCT_ITEMS,
  PED_NEURO_ITEMS, PED_SYNDROME_ITEMS, PED_CONDUCT_ITEMS,
  NURSING_CARE_ITEMS, NURSING_COMFORT_ITEMS, NURSING_MOVEMENT_ITEMS, NURSING_MEDICATION_ITEMS,
  SAE_ADMISSION_ITEMS, SAE_CARE_ITEMS,
  FISIO_ADULT_ITEMS, FISIO_ADULT_PROCEDURES, FISIO_PED_ITEMS, FISIO_PED_PROCEDURES,
  NUTRI_ADULT_ITEMS, NUTRI_ADULT_PROCEDURES, NUTRI_PED_ITEMS, NUTRI_PED_PROCEDURES,
  PSICO_ADULT_ITEMS, PSICO_ADULT_PROCEDURES, PSICO_PED_ITEMS, PSICO_PED_PROCEDURES,
  SOCIAL_ADULT_ITEMS, SOCIAL_ADULT_PROCEDURES, SOCIAL_PED_ITEMS, SOCIAL_PED_PROCEDURES,
  TO_ADULT_ITEMS, TO_ADULT_PROCEDURES, TO_PED_ITEMS, TO_PED_PROCEDURES,
  FONO_ADULT_ITEMS, FONO_ADULT_PROCEDURES, FONO_PED_ITEMS, FONO_PED_PROCEDURES,
  FARMA_ADULT_ITEMS, FARMA_ADULT_PROCEDURES, FARMA_PED_ITEMS, FARMA_PED_PROCEDURES
} from '@/data/evolutionTemplates';

export function EvolutionFormPanel({ 
  form, 
  patient, 
  isChild, 
  modalsState,
  vitals,
  clearVitals,
  handleSaveEvolution,
  renderPanelDropdown,
  toggleCareItem,
  applyTemplate
}: any) {
  const {
    isFormOpen, setIsFormOpen,
    evolutionType, setEvolutionType,
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
    isFarmaProcDropdownOpen, setIsFarmaProcDropdownOpen
  } = form;
  
  const normalizeText = (text: string) => {
    return text.toLowerCase().replace(/\\r\\n/g, "\\n").replace(/\\s+/g, " ").trim();
  };

  const {
    selectedNews2,
    setOpenQsofaCalc, selectedQsofa,
    setOpenGlasgowCalc, selectedGlasgow,
    setOpenMentalCalc, selectedMentalSummary,
    setOpenUrgencyCalc, selectedUrgencySummary,
    setOpenNursingCalc, selectedNursingSummary
  } = modalsState;

  const handleEvolutionTypeChange = (type: string) => {
    setEvolutionType(type);
    if (EVOLUTION_TEMPLATES[type] && !description) {
      setDescription(EVOLUTION_TEMPLATES[type]);
    }
    if (type === "Sinais Vitais") {
      clearVitals();
    }
  };
  
  const handleRemovePrescriptionItem = (idx: number) => {
    const arr = [...prescribedMedications];
    arr.splice(idx, 1);
    setPrescribedMedications(arr);
  };
  
  const handleAddPrescriptionItem = () => {
    if (!prescWizard.medication || !prescWizard.dosage || !prescWizard.route || !prescWizard.frequency) {
      toast.error("Preencha todos os campos do medicamento!");
      return;
    }
    const newItem = {
      id: \`med-\${Date.now()}\`,
      medication: prescWizard.medication,
      dosage: prescWizard.dosage,
      route: prescWizard.route,
      frequency: prescWizard.frequency,
      status: 'awaiting_pharmacy',
      hours: []
    };
    setPrescribedMedications([...prescribedMedications, newItem]);
    setPrescWizard({ medication: "", dosage: "", route: "", frequency: "" });
  };

  return (
    <>
${extracted.replace(/\$/g, '$$$$')}
    </>
  );
}
`;

  fs.writeFileSync(destPath, componentContent);
  console.log('Extracted successfully to ' + destPath);

  const replacement = '      <EvolutionFormPanel \n        form={form} \n        patient={patient} \n        isChild={isChild} \n        modalsState={modalsState} \n        vitals={vitals} \n        clearVitals={clearVitals} \n        handleSaveEvolution={handleSaveEvolution} \n        renderPanelDropdown={renderPanelDropdown} \n        toggleCareItem={toggleCareItem} \n        applyTemplate={applyTemplate} \n      />';
  const newLines = [...lines.slice(0, startIdx), replacement, ...lines.slice(endIdx + 1)];
  
  const newFileStr = newLines.join('\n');
  const finalFileStr = newFileStr.replace('import { ModalsContainer }', 'import { EvolutionFormPanel } from \'./PatientEvolution/components/EvolutionFormPanel\';\nimport { ModalsContainer }');
  
  fs.writeFileSync(srcPath, finalFileStr);
  console.log('Updated PatientEvolution.tsx');
} else {
  console.log('Could not find start or end index.', startIdx, endIdx);
}
