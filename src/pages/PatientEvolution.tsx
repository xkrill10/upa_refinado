import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { usePatients } from "@/hooks/use-patients";
import { EvolutionRecord } from "@/context/PatientsContext";
import { useBeds } from "@/context/BedsContext";
import { usePrescriptions, PrescriptionMedication } from "@/context/PrescriptionsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, MessageSquare, Bed as BedIcon, History, X, CheckCircle2, ChevronLeft, ChevronRight, Activity, Search, Clock, ShieldAlert, Heart, Baby, Brain, Flame, Droplet, Wind, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CID10_DATABASE, CID10Item } from "@/data/cid10";
import { SmartCidSelector } from "@/components/SmartCidSelector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

import {
  EVOLUTION_TEMPLATES,
  CareItem,
  MEDICATION_CARE_ITEMS,
  NURSING_CARE_ITEMS,
  COMFORT_CARE_ITEMS,
  MOVEMENT_CARE_ITEMS,
  ADMISSION_ROUTINE_ITEMS,
  PEDIATRIC_MEDICATION_CARE_ITEMS,
  PEDIATRIC_NURSING_CARE_ITEMS,
  PEDIATRIC_COMFORT_CARE_ITEMS,
  PEDIATRIC_MOVEMENT_CARE_ITEMS,
  PEDIATRIC_ADMISSION_ROUTINE_ITEMS,
  MEDICAL_PHYSICAL_NEURO_ITEMS,
  MEDICAL_SYNDROME_ITEMS,
  MEDICAL_CONDUCT_ITEMS,
  PEDIATRIC_PHYSICAL_NEURO_ITEMS,
  PEDIATRIC_SYNDROME_ITEMS,
  PEDIATRIC_CONDUCT_ITEMS,
  FISIO_ADULT_ITEMS,
  FISIO_ADULT_PROCEDURES,
  FISIO_PED_ITEMS,
  FISIO_PED_PROCEDURES,
  NUTRI_ADULT_ITEMS,
  NUTRI_ADULT_PROCEDURES,
  NUTRI_PED_ITEMS,
  NUTRI_PED_PROCEDURES,
  PSICO_ADULT_ITEMS,
  PSICO_ADULT_PROCEDURES,
  PSICO_PED_ITEMS,
  PSICO_PED_PROCEDURES,
  SOCIAL_ADULT_ITEMS,
  SOCIAL_ADULT_PROCEDURES,
  SOCIAL_PED_ITEMS,
  SOCIAL_PED_PROCEDURES,
  TO_ADULT_ITEMS,
  TO_ADULT_PROCEDURES,
  TO_PED_ITEMS,
  TO_PED_PROCEDURES,
  FONO_ADULT_ITEMS,
  FONO_ADULT_PROCEDURES,
  FONO_PED_ITEMS,
  FONO_PED_PROCEDURES,
  FARMA_ADULT_ITEMS,
  FARMA_ADULT_PROCEDURES,
  FARMA_PED_ITEMS,
  FARMA_PED_PROCEDURES,
  PRESCRIPTION_MEDICATION_ITEMS,
  PRESCRIPTION_DIET_ITEMS,
  DISCHARGE_TYPE_ITEMS,
  DISCHARGE_CONDUCT_ITEMS
} from "@/data/evolutionTemplates";
import { NANDA_DIAGNOSES, NandaDiagnosis } from "@/data/nanda";

import { MorseModal } from "@/components/PatientEvolution/Modals/MorseModal";
import { BradenModal } from "@/components/PatientEvolution/Modals/BradenModal";
import { EvaModal } from "@/components/PatientEvolution/Modals/EvaModal";
import { MewsModal } from "@/components/PatientEvolution/Modals/MewsModal";
import { News2Modal } from "@/components/PatientEvolution/Modals/News2Modal";
import { QsofaModal } from "@/components/PatientEvolution/Modals/QsofaModal";
import { PewsModal } from "@/components/PatientEvolution/Modals/PewsModal";
import { GlasgowModal } from "@/components/PatientEvolution/Modals/GlasgowModal";
import { MentalModal } from "@/components/PatientEvolution/Modals/MentalModal";
import { UrgencyModal } from "@/components/PatientEvolution/Modals/UrgencyModal";
import { FugulinModal } from "@/components/PatientEvolution/Modals/FugulinModal";
import { NandaModal } from "@/components/PatientEvolution/Modals/NandaModal";
import { ClinicalProfileModal } from "@/components/PatientEvolution/Modals/ClinicalProfileModal";
import { VitalsHistoryModal } from "@/components/PatientEvolution/Modals/VitalsHistoryModal";
import { HeartScoreModal } from "@/components/PatientEvolution/Modals/HeartScoreModal";
import { Curb65Modal } from "@/components/PatientEvolution/Modals/Curb65Modal";
import { WellsScoreModal } from "@/components/PatientEvolution/Modals/WellsScoreModal";
import { NihssModal } from "@/components/PatientEvolution/Modals/NihssModal";
import { DehydrationScoreModal } from "@/components/PatientEvolution/Modals/DehydrationScoreModal";
import { WoodDownesModal } from "@/components/PatientEvolution/Modals/WoodDownesModal";
import { ParklandModal } from "@/components/PatientEvolution/Modals/ParklandModal";
import { BedTransferModal } from "@/components/PatientEvolution/Modals/BedTransferModal";
import { BedStatusModal } from "@/components/PatientEvolution/Modals/BedStatusModal";
import { PatientTimelineModal } from "@/components/PatientEvolution/Modals/PatientTimelineModal";
import { BedRequestModal } from "@/components/PatientEvolution/Modals/BedRequestModal";
import { ExamsModal } from "@/components/PatientEvolution/Modals/ExamsModal";

export default function PatientEvolution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, addEvolution, updatePatient } = usePatients();
  const { beds, assignPatient, releaseBed } = useBeds();
  const patient = patients.find(p => p.id === id);

  const isChild = (() => {
    if (patient?.age === undefined) return false;
    // Definição Legal: Criança (0 a 11 anos, 11 meses e 29 dias)
    return patient.age < 12;
  })();

  const medicationItems = isChild ? PEDIATRIC_MEDICATION_CARE_ITEMS : MEDICATION_CARE_ITEMS;
  const careItems = isChild ? PEDIATRIC_NURSING_CARE_ITEMS : NURSING_CARE_ITEMS;
  const comfortItems = isChild ? PEDIATRIC_COMFORT_CARE_ITEMS : COMFORT_CARE_ITEMS;
  const movementItems = isChild ? PEDIATRIC_MOVEMENT_CARE_ITEMS : MOVEMENT_CARE_ITEMS;
  const admissionItems = isChild ? PEDIATRIC_ADMISSION_ROUTINE_ITEMS : ADMISSION_ROUTINE_ITEMS;

  const fromPath = location.state?.from || "/pacientes";
  const fromLabel = location.state?.label || "Pacientes";
  const isExpressMode = location.state?.expressEvolution === true;

  const [isBedDialogOpen, setIsBedDialogOpen] = useState(false);
  const [isClinicalProfileOpen, setIsClinicalProfileOpen] = useState(false);
  const [isVitalsHistoryOpen, setIsVitalsHistoryOpen] = useState(false);
  const [isBedRequestOpen, setIsBedRequestOpen] = useState(false);
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false);
  const patientBed = beds.find(b => b.patientId === id);
  const availableBeds = beds.filter(b => b.status === 'available');

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [evolutionType, setEvolutionType] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "evolutions" | "prescriptions" | "vitals" | "exams" | "discharge">("all");
  const [professional, setProfessional] = useState(() => localStorage.getItem("upa_stamp_name") || "");
  const [description, setDescription] = useState("");
  const [selectedCid, setSelectedCid] = useState<CID10Item | null>(null);

  const cidContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpressMode && !isFormOpen) {
      setIsFormOpen(true);
      setActiveTab("prescriptions");
      setEvolutionType(isChild ? "Evolução Médica (Pediátrica)" : "Evolução Médica");
    }
  }, [isExpressMode, isChild, isFormOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as HTMLElement;

      // if (cidContainerRef.current && !cidContainerRef.current.contains(target)) {
      //   setIsCidDropdownOpen(false);
      // }

      // Fechar todos os dropdowns clínicos/multidisciplinares ao clicar fora
      const clickedDropdown = target.closest('.clinical-dropdown-container');
      if (!clickedDropdown) {
        setIsMedicationDropdownOpen(false);
        setIsCareDropdownOpen(false);
        setIsComfortDropdownOpen(false);
        setIsMovementDropdownOpen(false);
        setIsSaeAdmissionDropdownOpen(false);
        setIsSaeCareDropdownOpen(false);
        setIsPrescMedicationDropdownOpen(false);
        setIsPrescDietDropdownOpen(false);
        setIsDischargeTypeDropdownOpen(false);
        setIsDischargeConductDropdownOpen(false);
        setIsMedicalNeuroDropdownOpen(false);
        setIsMedicalSyndromeDropdownOpen(false);
        setIsMedicalConductDropdownOpen(false);
        setIsPediatricNeuroDropdownOpen(false);
        setIsPediatricSyndromeDropdownOpen(false);
        setIsPediatricConductDropdownOpen(false);
        setIsFisioEvalDropdownOpen(false);
        setIsFisioProcDropdownOpen(false);
        setIsNutriEvalDropdownOpen(false);
        setIsNutriProcDropdownOpen(false);
        setIsPsicoEvalDropdownOpen(false);
        setIsPsicoProcDropdownOpen(false);
        setIsSocialEvalDropdownOpen(false);
        setIsSocialProcDropdownOpen(false);
        setIsToEvalDropdownOpen(false);
        setIsToProcDropdownOpen(false);
        setIsFonoEvalDropdownOpen(false);
        setIsFonoProcDropdownOpen(false);
        setIsFarmaEvalDropdownOpen(false);
        setIsFarmaProcDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Estados para os Dropdowns da Equipe Técnica
  const [isMedicationDropdownOpen, setIsMedicationDropdownOpen] = useState(false);
  const [isCareDropdownOpen, setIsCareDropdownOpen] = useState(false);
  const [isComfortDropdownOpen, setIsComfortDropdownOpen] = useState(false);
  const [isMovementDropdownOpen, setIsMovementDropdownOpen] = useState(false);

  // Estados para as calculadoras clínicas (Enfermagem)
  const [openMorseCalc, setOpenMorseCalc] = useState(false);
  const [selectedMorse, setSelectedMorse] = useState("");

  const [openBradenCalc, setOpenBradenCalc] = useState(false);
  const [selectedBraden, setSelectedBraden] = useState("");

  const [openEvaCalc, setOpenEvaCalc] = useState(false);
  const [selectedEva, setSelectedEva] = useState("");

  const [openMewsCalc, setOpenMewsCalc] = useState(false);
  const [selectedMews, setSelectedMews] = useState("");

  const [openNews2Calc, setOpenNews2Calc] = useState(false);
  const [selectedNews2, setSelectedNews2] = useState("");

  const [openQsofaCalc, setOpenQsofaCalc] = useState(false);
  const [selectedQsofa, setSelectedQsofa] = useState("");

  const [openPewsCalc, setOpenPewsCalc] = useState(false);
  const [selectedPews, setSelectedPews] = useState("");

  const [openGlasgowCalc, setOpenGlasgowCalc] = useState(false);
  const [selectedGlasgow, setSelectedGlasgow] = useState("");

  const [openMentalCalc, setOpenMentalCalc] = useState(false);
  const [selectedMentalSummary, setSelectedMentalSummary] = useState("");

  const [openUrgencyCalc, setOpenUrgencyCalc] = useState(false);
  const [selectedUrgencySummary, setSelectedUrgencySummary] = useState("");

  const [openNandaCalc, setOpenNandaCalc] = useState(false);
  const [activeNandaPlan, setActiveNandaPlan] = useState("");

  const [openNursingCalc, setOpenNursingCalc] = useState(false);
  const [selectedNursingSummary, setSelectedNursingSummary] = useState("");

  // Estados para os Dropdowns do Super Painel SAE (Enfermagem)
  const [isSaeAdmissionDropdownOpen, setIsSaeAdmissionDropdownOpen] = useState(false);
  const [isSaeCareDropdownOpen, setIsSaeCareDropdownOpen] = useState(false);

  // Estados para o Super Painel de Prescrição Médica
  const [prescWizard, setPrescWizard] = useState({ medication: "", dosage: "", route: "", frequency: "" });
  const [prescribedMedications, setPrescribedMedications] = useState<PrescriptionMedication[]>([]);
  const { addPrescriptionOrder } = usePrescriptions();

  const handleAddPrescriptionItem = () => {
    if (!prescWizard.medication || !prescWizard.dosage || !prescWizard.route || !prescWizard.frequency) {
      toast.error("Preencha todos os campos do medicamento!");
      return;
    }
    const newItem: PrescriptionMedication = {
      id: `med-${Date.now()}`,
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

  const handleRemovePrescriptionItem = (idx: number) => {
    const arr = [...prescribedMedications];
    arr.splice(idx, 1);
    setPrescribedMedications(arr);
  };

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

  // Estados Calculadoras Médicas Extras
  const [openHeartCalc, setOpenHeartCalc] = useState(false);
  const [openCurb65Calc, setOpenCurb65Calc] = useState(false);
  const [openWellsCalc, setOpenWellsCalc] = useState(false);
  const [openNihssCalc, setOpenNihssCalc] = useState(false);
  const [openDehydrationCalc, setOpenDehydrationCalc] = useState(false);
  const [openWoodDownesCalc, setOpenWoodDownesCalc] = useState(false);
  const [openParklandCalc, setOpenParklandCalc] = useState(false);

  // Estados Gestão de Leitos
  const [openBedTransfer, setOpenBedTransfer] = useState(false);
  const [openBedStatus, setOpenBedStatus] = useState(false);

  // Estado Linha do Tempo
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

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

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\r\n/g, "\n")
      .replace(/\s+/g, " ")
      .trim();
  };

  const toggleCareItem = (itemText: string, toastMsg: string) => {
    const normDesc = normalizeText(description);
    const normItem = normalizeText(itemText).trim();

    if (normDesc.includes(normItem)) {
      const descLines = description.split(/\r?\n/);
      const itemLines = itemText.split(/\r?\n/).filter(line => line.trim() !== "");

      const filteredLines = descLines.filter(line => {
        const normLine = normalizeText(line);
        if (!normLine) return true;
        return !itemLines.some(itemLine => normalizeText(itemLine) === normLine);
      });

      const newDesc = filteredLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
      setDescription(newDesc);
      toast.info(`${toastMsg} removido(a)`);
    } else {
      setDescription(prev => {
        const trimmedPrev = prev.trim();
        if (!trimmedPrev) return itemText;
        return trimmedPrev + "\n\n" + itemText;
      });
      toast.success(`${toastMsg} adicionado(a)`);

      // Smart CID Logic
      const isSyndrome = MEDICAL_SYNDROME_ITEMS.some(i => i.toastMsg === toastMsg) || PEDIATRIC_SYNDROME_ITEMS.some(i => i.toastMsg === toastMsg);
      if (isSyndrome) {
        if (normItem.includes("infecção") && normItem.includes("urinário") || normItem.includes("itu")) {
          const cid = CID10_DATABASE.find(c => c.code === "N390");
          if (cid) setSelectedCid(cid);
        } else if (normItem.includes("dor torácica") || normItem.includes("iam") || normItem.includes("coronariana")) {
          const cid = CID10_DATABASE.find(c => c.code === "I219");
          if (cid) setSelectedCid(cid);
        } else if (normItem.includes("dengue")) {
          const cid = CID10_DATABASE.find(c => c.code === "A90");
          if (cid) setSelectedCid(cid);
        } else if (normItem.includes("hipertensiva") || normItem.includes("hipertensão")) {
          const cid = CID10_DATABASE.find(c => c.code === "I10");
          if (cid) setSelectedCid(cid);
        }
      }
    }
  };

  // Estados locais para Sinais Vitais & MEWS
  const [vsBloodPressure, setVsBloodPressure] = useState("");
  const [vsHeartRate, setVsHeartRate] = useState("");
  const [vsRespiratoryRate, setVsRespiratoryRate] = useState("");
  const [vsTemperature, setVsTemperature] = useState("");
  const [vsSpO2, setVsSpO2] = useState("");
  const [vsPain, setVsPain] = useState("0");
  const [vsConsciousness, setVsConsciousness] = useState("A"); // A: Alerta, V: Voz, D: Dor, I: Inconsciente

  // Derivação de PAS e PAD baseada em vsBloodPressure
  const vsSystolic = vsBloodPressure.split("/")[0] || "";
  const vsDiastolic = vsBloodPressure.split("/")[1] || "";

  // Estados de parâmetros normais (discretos)
  const isDefaultBloodPressure = vsBloodPressure === "120/080" || vsBloodPressure === "120/80" || vsBloodPressure === "";
  const isDefaultHeartRate = vsHeartRate === "80";
  const isDefaultRespiratoryRate = vsRespiratoryRate === "16";
  const isDefaultTemperature = vsTemperature === "36.5" || vsTemperature === "36,5";
  const isDefaultSpO2 = vsSpO2 === "98";
  const isDefaultPain = vsPain === "0";
  const isDefaultConsciousness = vsConsciousness === "A";

  // Função para aplicar máscara no formato 000/000 para Pressão Arterial
  const handleBloodPressureChange = (val: string) => {
    let clean = val.replace(/[^\d/]/g, "");

    // Deleção suave da barra usando backspace
    const isDeleting = val.length < vsBloodPressure.length;
    if (isDeleting && vsBloodPressure.endsWith("/") && !clean.includes("/")) {
      setVsBloodPressure(clean.slice(0, -1));
      return;
    }

    // Se digitou número contínuo como 12080, injetar a barra automaticamente
    if (!clean.includes("/") && clean.length > 3) {
      clean = clean.slice(0, 3) + "/" + clean.slice(3);
    }

    const parts = clean.split("/");
    const sys = parts[0] ? parts[0].slice(0, 3) : "";
    const dia = parts[1] ? parts[1].slice(0, 3) : "";

    if (clean.includes("/")) {
      setVsBloodPressure(sys + "/" + dia);
    } else {
      if (sys.length >= 3) {
        setVsBloodPressure(sys + "/");
      } else {
        setVsBloodPressure(sys);
      }
    }
  };

  const handleBloodPressureBlur = () => {
    if (!vsBloodPressure) return;

    // Dividir em partes sistólica e diastólica
    const parts = vsBloodPressure.split("/");
    const sysPart = parts[0] ? parts[0].replace(/\D/g, "") : "";
    const diaPart = parts[1] ? parts[1].replace(/\D/g, "") : "";

    if (!sysPart && !diaPart) {
      setVsBloodPressure("");
      return;
    }

    // Pad sistólica para 3 dígitos (ex: 90 -> 090, 120 -> 120)
    const formattedSys = sysPart ? sysPart.padStart(3, "0") : "120";

    // Pad diastólica para 3 dígitos (ex: 80 -> 080, 8 -> 008, vazio -> 080)
    const formattedDia = diaPart ? diaPart.padStart(3, "0") : "080";

    setVsBloodPressure(`${formattedSys}/${formattedDia}`);
  };


  // Estado local para Carimbo / Assinatura persistente
  const [stampName, setStampName] = useState(() => localStorage.getItem("upa_stamp_name") || "");
  const [stampCouncil, setStampCouncil] = useState(() => localStorage.getItem("upa_stamp_council") || "CRM"); // CRM, COREN, Outro
  const [stampNumber, setStampNumber] = useState(() => localStorage.getItem("upa_stamp_number") || "");
  const [stampState, setStampState] = useState(() => localStorage.getItem("upa_stamp_state") || "SP");
  const [isStampConfigOpen, setIsStampConfigOpen] = useState(false);

  // Função para calcular o MEWS
  const calculateMEWS = () => {
    let score = 0;

    // 1. Pressão Arterial Sistólica (PAS)
    const pas = parseInt(vsSystolic);
    if (!isNaN(pas)) {
      if (pas <= 70) score += 3;
      else if (pas <= 80) score += 2;
      else if (pas <= 100) score += 1;
      else if (pas >= 200) score += 2;
    }

    // 2. Frequência Cardíaca (FC)
    const fc = parseInt(vsHeartRate);
    if (!isNaN(fc)) {
      if (fc <= 40) score += 2;
      else if (fc <= 50) score += 1;
      else if (fc >= 101 && fc <= 110) score += 1;
      else if (fc >= 111 && fc <= 129) score += 2;
      else if (fc >= 130) score += 3;
    }

    // 3. Frequência Respiratória (FR)
    const fr = parseInt(vsRespiratoryRate);
    if (!isNaN(fr)) {
      if (fr <= 8) score += 2;
      else if (fr >= 15 && fr <= 20) score += 1;
      else if (fr >= 21 && fr <= 29) score += 2;
      else if (fr >= 30) score += 3;
    }

    // 4. Temperatura (T)
    const temp = parseFloat(vsTemperature.replace(",", "."));
    if (!isNaN(temp)) {
      if (temp <= 34.9) score += 2;
      else if (temp >= 38.5) score += 2;
    }

    // 5. Nível de Consciência (AVDI)
    if (vsConsciousness === "V") score += 1;
    else if (vsConsciousness === "D") score += 2;
    else if (vsConsciousness === "I") score += 3;

    return score;
  };

  const getMEWSClassification = (score: number) => {
    if (score >= 5) return { label: "RISCO IMEDIATO (Grave)", color: "text-red-600 bg-red-500/10 border-red-500/20", alert: "Alta urgência! Chame a equipe médica imediatamente." };
    if (score >= 3) return { label: "ATENÇÃO (Moderado)", color: "text-amber-600 bg-amber-500/10 border-amber-500/20", alert: "Alerta de risco. Monitore o paciente com maior frequência." };
    return { label: "ESTÁVEL (Baixo Risco)", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", alert: "Paciente estável e dentro dos parâmetros normais." };
  };



  const evolutions = patient?.evolutions || [];

  const medicalEvolutionsCount = evolutions.filter(e => e.type.includes("Médica")).length;
  const nursingEvolutionsCount = evolutions.filter(e => e.type.includes("Enfermagem") || e.type.includes("Anotação")).length;
  const multiEvolutionsCount = evolutions.length - medicalEvolutionsCount - nursingEvolutionsCount;

  const filteredEvolutions = (() => {
    if (activeTab === "all") return evolutions;
    if (activeTab === "evolutions") {
      return evolutions.filter(e =>
        e.type.includes("Evolução") ||
        e.type.includes("Anotação")
      );
    }
    if (activeTab === "prescriptions") {
      return evolutions.filter(e => e.type === "Prescrição");
    }
    if (activeTab === "vitals") {
      return evolutions.filter(e => e.type === "Sinais Vitais");
    }
    if (activeTab === "exams") {
      return evolutions.filter(e => e.type === "Procedimento");
    }
    if (activeTab === "discharge") {
      return evolutions.filter(e => e.type === "Alta");
    }
    return evolutions;
  })();

  if (!patient) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <h2 className="text-2xl font-bold">Paciente não encontrado</h2>
      <p className="text-muted-foreground text-center">O registro que você está tentando acessar não existe ou foi removido.</p>
      <Button asChild variant="outline">
        <Link to={fromPath} state={location.state} className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Link>
      </Button>
    </div>
  );

  const getRiskDetails = (risk: string) => {
    switch (risk) {
      case 'emergency': return { label: 'Emergência', color: 'bg-red-600' };
      case 'very-urgent': return { label: 'Muito Urgente', color: 'bg-orange-500' };
      case 'urgent': return { label: 'Urgente', color: 'bg-yellow-500' };
      case 'less-urgent': return { label: 'Pouco Urgente', color: 'bg-green-500' };
      case 'not-urgent': return { label: 'Não Urgente', color: 'bg-blue-500' };
      default: return { label: risk, color: 'bg-slate-500' };
    }
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'waiting': return { label: 'Aguardando', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
      case 'attending': return { label: 'Em Atendimento', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
      case 'completed': return { label: 'Finalizado', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
      default: return { label: status, color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
    }
  };

  const risk = getRiskDetails(patient.risk);
  const status = getStatusDetails(patient.status);

  const handleEvolutionTypeChange = (type: string) => {
    setEvolutionType(type);
    if (EVOLUTION_TEMPLATES[type] && !description) {
      setDescription(EVOLUTION_TEMPLATES[type]);
    }
    if (type === "Sinais Vitais") {
      setVsBloodPressure("120/080");
      setVsHeartRate("80");
      setVsSpO2("98");
      setVsTemperature("36.5");
      setVsRespiratoryRate("16");
      setVsPain("0");
      setVsConsciousness("A");
    }
  };

  const handleSaveEvolution = () => {
    // Para sinais vitais, a descrição é gerada automaticamente se não preenchida
    if (!evolutionType || !professional || (evolutionType !== "Sinais Vitais" && !description)) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Se for Sinais Vitais, validar que pelo menos PA e FC estão preenchidos para gerar o MEWS
    if (evolutionType === "Sinais Vitais" && (!vsSystolic || !vsHeartRate)) {
      toast.error("Preencha pelo menos a Pressão Arterial Sistólica e a Frequência Cardíaca.");
      return;
    }

    let finalDescription = description;
    let finalBloodPressure = vsBloodPressure;

    if (evolutionType === "Sinais Vitais") {
      // Pad to 3 digits on both sides
      const parts = vsBloodPressure.split("/");
      const sysPart = parts[0] ? parts[0].replace(/\D/g, "") : "";
      const diaPart = parts[1] ? parts[1].replace(/\D/g, "") : "";

      const finalSystolic = sysPart ? sysPart.padStart(3, "0") : "120";
      const finalDiastolic = diaPart ? diaPart.padStart(3, "0") : "080";
      finalBloodPressure = `${finalSystolic}/${finalDiastolic}`;

      const mews = calculateMEWS();
      const mewsClass = getMEWSClassification(mews);
      finalDescription =
        `REGISTRO DE SINAIS VITAIS:\n` +
        `- Pressão Arterial (PA): ${finalSystolic}/${finalDiastolic} mmHg\n` +
        `- Frequência Cardíaca (FC): ${vsHeartRate || "--"} bpm\n` +
        `- Saturação de O2 (SpO2): ${vsSpO2 || "--"}%\n` +
        `- Temperatura Corporal: ${vsTemperature || "--"} °C\n` +
        `- Frequência Respiratória (FR): ${vsRespiratoryRate || "--"} irpm\n` +
        `- Escala de Dor: ${vsPain}/10\n` +
        `- Consciência (AVDI): ${vsConsciousness === "A" ? "Alerta" : vsConsciousness === "V" ? "Reage a Voz" : vsConsciousness === "D" ? "Reage a Dor" : "Inconsciente"}\n` +
        `-----------------------------------------\n` +
        `Escore MEWS calculado: ${mews} pontos (${mewsClass.label})`;

      if (description.trim()) {
        finalDescription += `\n\nObservações clínicas adicionais:\n${description}`;
      }
    } else if (evolutionType === "Prescrição" && prescribedMedications.length > 0) {
      finalDescription = "PRESCRIÇÃO MÉDICA ESTRUTURADA:\n\n";
      prescribedMedications.forEach((med, idx) => {
        finalDescription += `${idx + 1}. ${med.medication} - ${med.dosage} (${med.route}) - ${med.frequency}\n`;
        if (med.observation) {
          finalDescription += `   Observação: ${med.observation}\n`;
        }
      });
      if (description.trim()) {
        finalDescription += `\nObservações Adicionais:\n${description}`;
      }
    }

    // Anexar carimbo digital se configurado
    if (stampNumber) {
      const categoryLabel = stampCouncil === "CRM" ? "Dr(a)." : stampCouncil === "COREN" ? "Enf." : "Téc.";
      finalDescription += `\n\n-----------------------------------------\nAssinado Eletronicamente por: ${categoryLabel} ${professional} - ${stampCouncil}/${stampState}: ${stampNumber}`;
    }

    addEvolution(id!, {
      type: evolutionType,
      professional,
      description: finalDescription,
      cid: selectedCid ? `${selectedCid.code} - ${selectedCid.name}` : undefined,
    });

    if (evolutionType === "Sinais Vitais") {
      updatePatient(id!, {
        pa: finalBloodPressure,
        fc: vsHeartRate,
        spo2: vsSpO2,
        temperature: vsTemperature,
        fr: vsRespiratoryRate,
      });
    }

    // AUTOMAÇÃO: Disparo automático de vaga via texto da evolução
    if (finalDescription.includes("SOLICITAÇÃO DE INTERNAÇÃO / LEITO:") || finalDescription.includes("SOLICITAÇÃO DE INTERNAÇÃO PEDIÁTRICA:")) {
      updatePatient(id!, {
        admissionRequest: {
          status: 'pending',
          bedType: 'emergency',
          requestedAt: new Date().toISOString(),
          doctor: professional,
        }
      });
      toast.success("O NIR foi notificado automaticamente do pedido de leito.");
      new BroadcastChannel('upa_sync_channel').postMessage('sync_all');
    } else if (finalDescription.includes("SOLICITAÇÃO DE OBSERVAÇÃO CLÍNICA:") || finalDescription.includes("SOLICITAÇÃO DE OBSERVAÇÃO PEDIÁTRICA:")) {
      updatePatient(id!, {
        admissionRequest: {
          status: 'pending',
          bedType: 'observation',
          requestedAt: new Date().toISOString(),
          doctor: professional,
        }
      });
      toast.success("A Enfermagem foi notificada para providenciar o leito de observação.");
      new BroadcastChannel('upa_sync_channel').postMessage('sync_all');
    }

    if ((evolutionType === "Evolução Médica" || evolutionType === "Evolução Médica (Pediátrica)") && prescribedMedications.length > 0) {
      addPrescriptionOrder({
        patientId: patient.id,
        patientName: patient.name,
        doctorId: professional,
        doctorName: `Dr(a). ${professional}`,
        medications: prescribedMedications.map((m, i) => ({
          ...m,
          id: `med-${Date.now()}-${i}`,
          status: 'awaiting_pharmacy',
          hours: []
        }))
      });
    }

    setIsFormOpen(false);
    setEvolutionType("");
    setProfessional(localStorage.getItem("upa_stamp_name") || "");
    setDescription("");
    setSelectedCid(null);
    setPrescribedMedications([]);
    setPrescWizard({ medication: "", dosage: "", route: "", frequency: "" });

    // Limpar campos de sinais vitais
    setVsBloodPressure("");
    setVsHeartRate("");
    setVsRespiratoryRate("");
    setVsTemperature("");
    setVsSpO2("");
    setVsPain("0");
    setVsConsciousness("A");

    toast.success("Evolução registrada com sucesso!");
  };

  // Helper para renderizar os Dropdowns padronizados dos painéis Multidisciplinares
  const renderPanelDropdown = (
    title: string,
    icon: React.ReactNode,
    theme: 'green' | 'blue' | 'purple' | 'amber' | 'pink',
    items: CareItem[],
    isOpen: boolean,
    toggleOpen: () => void
  ) => {
    let focusRing = "focus:ring-green-500/20";
    let borderOpen = "border-green-500";
    let textMain = "text-green-600";
    let bgLight = "bg-green-500/10";
    let borderLight = "border-green-500/20";
    let bgBadge = "bg-green-600";
    let hoverLight = "bg-green-500/5";
    let textDark = "text-green-700 dark:text-green-400";

    if (theme === 'blue') {
      focusRing = "focus:ring-blue-500/20"; borderOpen = "border-blue-500"; textMain = "text-blue-600"; bgLight = "bg-blue-500/10"; borderLight = "border-blue-500/20"; bgBadge = "bg-blue-600"; hoverLight = "bg-blue-500/5"; textDark = "text-blue-700 dark:text-blue-400";
    } else if (theme === 'purple') {
      focusRing = "focus:ring-purple-500/20"; borderOpen = "border-purple-500"; textMain = "text-purple-600"; bgLight = "bg-purple-500/10"; borderLight = "border-purple-500/20"; bgBadge = "bg-purple-600"; hoverLight = "bg-purple-500/5"; textDark = "text-purple-700 dark:text-purple-400";
    } else if (theme === 'amber') {
      focusRing = "focus:ring-amber-500/20"; borderOpen = "border-amber-500"; textMain = "text-amber-600"; bgLight = "bg-amber-500/10"; borderLight = "border-amber-500/20"; bgBadge = "bg-amber-600"; hoverLight = "bg-amber-500/5"; textDark = "text-amber-700 dark:text-amber-400";
    } else if (theme === 'pink') {
      focusRing = "focus:ring-pink-500/20"; borderOpen = "border-pink-500"; textMain = "text-pink-600"; bgLight = "bg-pink-500/10"; borderLight = "border-pink-500/20"; bgBadge = "bg-pink-600"; hoverLight = "bg-pink-500/5"; textDark = "text-pink-700 dark:text-pink-400";
    }

    return (
      <div className={cn("space-y-2 relative", isOpen ? "z-30" : "z-10")}>
        <span className="text-[9px] font-black uppercase text-muted-foreground block">{title}</span>
        <div className="relative clinical-dropdown-container">
          <button type="button" onClick={toggleOpen} className={cn("flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2", focusRing, isOpen ? `${borderOpen} text-foreground` : "border-white/60 dark:border-white/10 text-muted-foreground")}>
            <div className="flex items-center gap-2">
              <span className={cn("p-1 rounded-lg", bgLight, textMain)}>{icon}</span>
              <span>Selecionar...</span>
            </div>
            <div className="flex items-center gap-2">
              {(() => {
                const count = items.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                return count > 0 ? (
                  <Badge className={cn(bgBadge, "text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200")}>{count}</Badge>
                ) : null;
              })()}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
            </div>
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15, ease: "easeOut" }} className={cn("absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 text-popover-foreground shadow-2xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 backdrop-blur-md", borderLight)}>
                {items.map((item) => {
                  const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                  return (
                    <button key={item.id} type="button" onClick={() => toggleCareItem(item.text, item.toastMsg)} className={cn("group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all", isActive ? `${hoverLight} ${textDark} font-bold border ${borderLight}` : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent")}>
                      <span className="truncate">{item.label}</span>
                      {isActive ? <span className={cn("text-[10px] font-black flex items-center gap-1", textDark)}>Adicionado ✓</span> : <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">+ Inserir</span>}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-muted"
          >
            <Link to={fromPath} state={location.state}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#006699] dark:text-sky-400 uppercase tracking-tight">
                {patient.name.toUpperCase().includes('NÃO IDENTIFICADO') || patient.name.toUpperCase().includes('DESCONHECIDO')
                  ? "PACIENTE NÃO IDENTIFICADO"
                  : patient.name}
              </h1>
              <Badge className={`${risk.color} border-0 text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm`}>
                {risk.label}
              </Badge>
              <Badge variant="outline" className={`${status.color} border-0 text-[10px] uppercase font-bold px-3 py-1 rounded-full`}>
                {status.label}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">
                {patient.age} ANOS · CPF: {patient.cpf || "---.---.---.--"} · NASC: {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-BR') : "--/--/----"}
              </p>
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">SUS: {patient.susCard || "--- --- --- ---"}</p>
              </div>
              {patient.socialName && (
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-wider">NOME SOCIAL: {patient.socialName.toUpperCase()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0 shrink-0">
          {patient.admissionRequest && patient.admissionRequest.status === 'pending' ? (
            <Button
              disabled
              className="rounded-xl gap-2 font-black bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/50 uppercase tracking-widest text-[10px] h-10 px-4"
            >
              ⏳ Vaga Solicitada
            </Button>
          ) : patientBed ? (
            <Button
              disabled
              className="rounded-xl gap-2 font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/50 uppercase tracking-widest text-[10px] h-10 px-4"
            >
              <CheckCircle2 className="h-4 w-4" /> Leito Alocado
            </Button>
          ) : (
            <Button
              onClick={() => setIsBedRequestOpen(true)}
              className="rounded-xl gap-2 font-black bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 uppercase tracking-widest text-[10px] h-10 px-4"
            >
              <BedIcon className="h-4 w-4" />
              Solicitar Vaga
            </Button>
          )}

          <Button
            onClick={() => setIsTimelineOpen(true)}
            className="rounded-xl gap-2 font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 uppercase tracking-widest text-[10px] h-10 px-4"
          >
            <Clock className="h-4 w-4" />
            ⏱️ Jornada
          </Button>

          <Button
            onClick={() => setIsExamsModalOpen(true)}
            className="rounded-xl gap-2 font-black bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 uppercase tracking-widest text-[10px] h-10 px-4"
          >
            <FlaskConical className="h-4 w-4" />
            Apoio Diagnóstico
          </Button>
        </div>
      </div>

      {!isExpressMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Queixa Principal & Alergias */}
        <Card
          className="group glass-card-premium border border-blue-500/15 dark:border-blue-500/20 bg-blue-500/[0.02] dark:bg-blue-500/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-xl overflow-hidden transition-all duration-500 cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:bg-blue-500/[0.07] dark:hover:bg-blue-500/[0.10] hover:border-blue-500/40 hover:shadow-[0_12px_40px_rgba(59,130,246,0.12)]"
          onClick={() => setIsClinicalProfileOpen(true)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-blue-500 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(59,130,246,0.25)]">
              <MessageSquare className="h-5 w-5 text-blue-500 transition-colors duration-300 group-hover:text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-500/80 transition-colors duration-300">Queixa & Alergias</p>
              <p className="text-sm font-bold text-foreground truncate mt-0.5" title={patient.mainComplaint}>
                {patient.mainComplaint || "Não informada"}
              </p>
              <div className="text-[9px] font-bold uppercase mt-1 truncate">
                {patient.allergies && patient.allergies !== "Sem alergias conhecidas" ? (
                  <span className="text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/15 transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500/30">
                    ⚠️ {patient.allergies}
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/15 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500/30">
                    ✅ Sem Alergias
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Leito / Setor (MANTIDO E PROTEGIDO) */}
        <Card
          className={cn(
            "group glass-card-premium border shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-xl overflow-hidden transition-all duration-500 cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
            patientBed
              ? "border-emerald-500/20 dark:border-emerald-500/25 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.06] hover:bg-emerald-500/[0.08] dark:hover:bg-emerald-500/[0.12] hover:border-emerald-500/40 hover:shadow-[0_12px_40px_rgba(16,185,129,0.12)]"
              : "border-amber-500/15 dark:border-amber-500/20 bg-amber-500/[0.02] dark:bg-amber-500/[0.04] hover:bg-amber-500/[0.07] dark:hover:bg-amber-500/[0.10] hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,158,11,0.12)]"
          )}
          onClick={() => setIsBedDialogOpen(true)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105",
              patientBed
                ? "bg-emerald-500/15 dark:bg-emerald-500/25 group-hover:bg-emerald-500 group-hover:shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
                : "bg-amber-500/10 dark:bg-amber-500/20 group-hover:bg-amber-500 group-hover:shadow-[0_4px_12px_rgba(245,158,11,0.25)]"
            )}>
              <BedIcon className={cn(
                "h-5 w-5 transition-colors duration-300",
                patientBed ? "text-emerald-600 group-hover:text-white" : "text-amber-500 group-hover:text-white"
              )} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                patientBed ? "text-slate-500 group-hover:text-emerald-600" : "text-slate-500 group-hover:text-amber-500"
              )}>Leito / Setor</p>
              <p className={cn("text-sm font-bold mt-0.5 truncate", patientBed ? "text-emerald-700 dark:text-emerald-450" : "text-foreground")}>
                {patientBed ? patientBed.name : (patient.sector || "Sem leito")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Status Sinais Vitais */}
        <Card
          className="group glass-card-premium border border-rose-500/15 dark:border-rose-500/20 bg-rose-500/[0.02] dark:bg-rose-500/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-xl overflow-hidden transition-all duration-500 cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:bg-rose-500/[0.07] dark:hover:bg-rose-500/[0.10] hover:border-rose-500/40 hover:shadow-[0_12px_40px_rgba(244,63,94,0.12)] lg:col-span-1"
          onClick={() => setIsVitalsHistoryOpen(true)}
        >
          <CardContent className="p-4 flex flex-col justify-between h-full gap-2 font-black">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-rose-500/80 transition-colors duration-300">Status Sinais Vitais</p>
              <span className="text-[9px] font-black text-rose-500 dark:text-rose-450 uppercase tracking-wider flex items-center gap-0.5 transition-all duration-300 group-hover:scale-105">
                📈 Histórico
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-black text-[#006699] dark:text-sky-300 bg-[#006699]/10 px-2 py-0.5 rounded-md border border-[#006699]/15 transition-all duration-300 group-hover:bg-[#006699] group-hover:text-white group-hover:border-[#006699]/30">
                PA: {patient.pa || '--'}
              </span>
              <span className="text-[11px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/15 transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500/30">
                FC: {patient.fc || '--'}
              </span>
              <span className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/15 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500/30">
                SpO2: {patient.spo2 || '--'}%
              </span>
              <span className="text-[11px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/15 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500/30">
                T: {patient.temperature || '--'}°C
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Histórico de Evoluções */}
        <Card
          className="group glass-card-premium border border-indigo-500/15 dark:border-indigo-500/20 bg-indigo-500/[0.02] dark:bg-indigo-500/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-xl overflow-hidden transition-all duration-500 cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:bg-indigo-500/[0.07] dark:hover:bg-indigo-500/[0.10] hover:border-indigo-500/40 hover:shadow-[0_12px_40px_rgba(99,102,241,0.12)]"
          onClick={() => {
            setActiveTab("evolutions");
            document.getElementById("timeline-section")?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-indigo-500 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(99,102,241,0.25)]">
              <History className="h-5 w-5 text-indigo-500 transition-colors duration-300 group-hover:text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-500/80 transition-colors duration-300">Evoluções</p>
              <p className="text-sm font-bold text-foreground mt-0.5">{evolutions.length} registros</p>
              <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {medicalEvolutionsCount} Méd · {nursingEvolutionsCount} Enf · {multiEvolutionsCount} Multi
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Barra de Sub-Navegação Horizontal Glassmorphic Premium */}
      {isFormOpen && (
        <div id="timeline-section" className="glass-card-premium border border-white/40 dark:border-white/10 p-1.5 rounded-2xl flex flex-wrap gap-1.5 items-center bg-white/20 dark:bg-slate-900/20 backdrop-blur-md shadow-sm animate-in fade-in duration-300">
          {[
            { id: "all", label: "Histórico Geral", icon: <History className="h-3.5 w-3.5" /> },
            { id: "vitals", label: "Sinais Vitais", icon: <Activity className="h-3.5 w-3.5" /> },
            { id: "evolutions", label: "Evoluções", icon: <MessageSquare className="h-3.5 w-3.5" /> },
            { id: "prescriptions", label: "Prescrições", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></svg> },
            { id: "exams", label: "Exames & Procedimentos", icon: <Search className="h-3.5 w-3.5" /> },
            { id: "discharge", label: "Alta & Desfecho", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as 'all' | 'vitals' | 'evolutions' | 'prescriptions' | 'exams' | 'discharge');
                  if (isFormOpen) {
                    if (tab.id === "prescriptions") {
                      handleEvolutionTypeChange(isChild ? "Evolução Médica (Pediátrica)" : "Evolução Médica");
                    } else if (tab.id === "vitals") {
                      handleEvolutionTypeChange("Sinais Vitais");
                    } else if (tab.id === "discharge") {
                      handleEvolutionTypeChange("Alta");
                    } else if (tab.id === "exams") {
                      handleEvolutionTypeChange("Procedimento");
                    } else if (tab.id === "evolutions") {
                      handleEvolutionTypeChange(isChild ? "Evolução Médica (Pediátrica)" : "Evolução Médica");
                    }
                  }
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 relative overflow-hidden active:scale-95",
                  isActive
                    ? "bg-[#006699] text-white dark:bg-sky-500/20 dark:text-sky-400 dark:border dark:border-sky-500/30 shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40"
                )}
              >
                {tab.icon}
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-[#006699]/10 dark:bg-sky-500/10 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-start pb-1">
        {!isFormOpen && !isExpressMode && (
          <Button
            onClick={() => {
              setIsFormOpen(true);
              if (activeTab === "prescriptions") {
                handleEvolutionTypeChange(isChild ? "Evolução Médica (Pediátrica)" : "Evolução Médica");
              } else if (activeTab === "vitals") {
                handleEvolutionTypeChange("Sinais Vitais");
              } else if (activeTab === "discharge") {
                handleEvolutionTypeChange("Alta");
              } else if (activeTab === "exams") {
                handleEvolutionTypeChange("Procedimento");
              } else if (activeTab === "evolutions") {
                handleEvolutionTypeChange(isChild ? "Evolução Médica (Pediátrica)" : "Evolução Médica");
              } else {
                handleEvolutionTypeChange(isChild ? "Evolução Médica (Pediátrica)" : "Evolução Médica");
              }
            }}
            className="bg-[#006699] hover:bg-[#005580] text-white gap-2 px-5 rounded-lg h-9 shadow-sm transition-all active:scale-95 text-xs font-bold uppercase tracking-wider"
          >
            <Plus className="h-4 w-4" />
            Registrar Nova Evolução
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <Card className="glass-card-premium border border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden transition-all duration-500 max-w-6xl mx-auto w-full">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <h2 className="text-xs font-black flex items-center gap-2 text-primary uppercase tracking-wider">
                    <Plus className="h-4 w-4" /> Registrar Evolução Clínica
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)} className="rounded-full h-7 w-7 hover:bg-muted">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Tipo de Registro *</Label>
                    <Select value={evolutionType} onValueChange={handleEvolutionTypeChange}>
                      <SelectTrigger className="h-9 bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-900/60 text-xs rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-primary/20">
                        <SelectValue placeholder="Selecionar tipo" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] overflow-y-auto">
                        <SelectGroup>
                          <SelectLabel className="pl-3 text-[10px] font-black uppercase tracking-widest bg-sky-500/5 dark:bg-sky-500/10 rounded-md py-1 my-1 text-[#006699] dark:text-sky-400">
                            Corpo Clínico
                          </SelectLabel>
                          {!isChild && <SelectItem value="Evolução Médica">Evolução Médica</SelectItem>}
                          {isChild && <SelectItem value="Evolução Médica (Pediátrica)">Evolução Médica (Pediátrica)</SelectItem>}
                          <SelectItem value="Evolução Enfermagem">Evolução Enfermagem (Privativo do Enfermeiro)</SelectItem>
                          <SelectItem value="Anotação de Enfermagem">Anotação de Enfermagem (Técnicos e Equipe)</SelectItem>
                        </SelectGroup>

                        <SelectSeparator className="my-1" />

                        <SelectGroup>
                          <SelectLabel className="pl-3 text-[10px] font-black uppercase tracking-widest bg-sky-500/5 dark:bg-sky-500/10 rounded-md py-1 my-1 text-[#006699] dark:text-sky-400">
                            Equipe Multidisciplinar
                          </SelectLabel>
                          <SelectItem value="Evolução da Fisioterapia">Evolução da Fisioterapia</SelectItem>
                          <SelectItem value="Evolução da Nutrição">Evolução da Nutrição</SelectItem>
                          <SelectItem value="Evolução da Psicologia">Evolução da Psicologia</SelectItem>
                          <SelectItem value="Evolução do Serviço Social">Evolução do Serviço Social</SelectItem>
                          <SelectItem value="Evolução da Terapia Ocupacional">Evolução da Terapia Ocupacional</SelectItem>
                          <SelectItem value="Evolução da Fonoaudiologia">Evolução da Fonoaudiologia</SelectItem>
                          <SelectItem value="Evolução da Farmácia Clínica">Evolução da Farmácia Clínica</SelectItem>
                        </SelectGroup>

                        <SelectSeparator className="my-1" />

                        <SelectGroup>
                          <SelectLabel className="pl-3 text-[10px] font-black uppercase tracking-widest bg-sky-500/5 dark:bg-sky-500/10 rounded-md py-1 my-1 text-[#006699] dark:text-sky-400">
                            Condutas e Registros
                          </SelectLabel>
                          <SelectItem value="Sinais Vitais">Sinais Vitais</SelectItem>
                          <SelectItem value="Procedimento">Procedimento</SelectItem>
                          <SelectItem value="Alta">Alta</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Profissional Responsável *</Label>
                    <Input
                      placeholder="Nome do profissional"
                      className="h-9 bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 text-xs rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-primary/20"
                      value={professional}
                      onChange={(e) => setProfessional(e.target.value)}
                    />
                  </div>
                </div>

                {/* Clinical Guidelines Banner for Nursing */}
                {(evolutionType === "Evolução Enfermagem" || evolutionType === "Anotação de Enfermagem") && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-white/40 dark:border-white/10 bg-white/35 dark:bg-slate-900/35 backdrop-blur-md shadow-sm text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[10px]">
                        {evolutionType === "Evolução Enfermagem"
                          ? "📋 Diretriz: Evolução de Enfermagem (COFEN Res. 564/2017)"
                          : "📝 Diretriz: Anotação de Enfermagem"}
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        Segurança Jurídica & Cuidado
                      </span>
                    </div>
                    {evolutionType === "Evolução Enfermagem" ? (
                      <p className="text-muted-foreground leading-relaxed text-[11px]">
                        <strong>Privativo do Enfermeiro (Ciclo de 24h):</strong> Análise crítica e julgamento clínico do estado do paciente. Deve incluir: nível de consciência, dados neurológicos/cardiorrespiratórios, integridade de pele, funcionamento de dispositivos (acessos/sondas/drenos), eliminações (intestinal/vesical) e resposta às condutas anteriores.
                      </p>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed text-[11px]">
                        <strong>Dados Brutos e Pontuais (Toda a Equipe):</strong> Registro imediato de fatos observados ou executados (ex: administração de medicação com via/dose, banho, curativos, etc.). Serve de subsídio para a evolução do enfermeiro.
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Diagnóstico / CID-10 Autocomplete Input */}
                {(evolutionType === "Evolução Médica" || evolutionType === "Evolução Médica (Pediátrica)") && (
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      Diagnóstico / CID-10 <span className="text-[9px] text-muted-foreground font-medium lowercase italic">(opcional)</span>
                    </Label>
                    <SmartCidSelector
                      selectedCid={selectedCid}
                      onSelectCid={setSelectedCid}
                    />
                  </div>
                )}

                {/* Campos Estruturados de Sinais Vitais & MEWS */}
                {evolutionType === "Sinais Vitais" && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl border border-white/40 dark:border-white/10 bg-white/35 dark:bg-slate-900/35 backdrop-blur-md shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <Activity className="h-4 w-4 animate-pulse text-[#006699]" />
                        Entrada Estruturada de Sinais Vitais (MEWS)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setVsBloodPressure("120/080");
                            setVsHeartRate("80");
                            setVsSpO2("98");
                            setVsTemperature("36.5");
                            setVsRespiratoryRate("16");
                            setVsPain("0");
                            setVsConsciousness("A");
                            toast.success("Parâmetros normais (estáveis) aplicados");
                          }}
                          className="text-[9px] font-extrabold text-[#006699] hover:underline uppercase tracking-wider bg-[#006699]/10 px-2 py-0.5 rounded border border-[#006699]/15 transition-all flex items-center gap-1 shrink-0"
                        >
                          ⚡ Parâmetros Normais
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVsBloodPressure("");
                            setVsHeartRate("");
                            setVsSpO2("");
                            setVsTemperature("");
                            setVsRespiratoryRate("");
                            setVsPain("0");
                            setVsConsciousness("A");
                            toast.info("Campos limpos");
                          }}
                          className="text-[9px] font-extrabold text-red-500 hover:underline uppercase tracking-wider bg-red-500/5 px-2 py-0.5 rounded border border-red-500/15 transition-all"
                        >
                          Limpar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Pressão Arterial (PA)</Label>
                        <Input
                          type="text"
                          placeholder="120/080 mmHg"
                          className={cn(
                            "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20 font-mono text-center",
                            isDefaultBloodPressure
                              ? "text-slate-400 dark:text-slate-500 font-normal italic"
                              : "text-foreground font-semibold"
                          )}
                          value={vsBloodPressure}
                          onChange={(e) => handleBloodPressureChange(e.target.value)}
                          onBlur={handleBloodPressureBlur}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Freq. Cardíaca (FC)</Label>
                        <Input
                          type="number"
                          placeholder="FC bpm"
                          className={cn(
                            "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20",
                            isDefaultHeartRate
                              ? "text-slate-400 dark:text-slate-500 font-normal italic"
                              : "text-foreground font-semibold"
                          )}
                          value={vsHeartRate}
                          onChange={(e) => setVsHeartRate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Saturação (SpO2)</Label>
                        <Input
                          type="number"
                          placeholder="SpO2 %"
                          className={cn(
                            "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20",
                            isDefaultSpO2
                              ? "text-slate-400 dark:text-slate-500 font-normal italic"
                              : "text-foreground font-semibold"
                          )}
                          value={vsSpO2}
                          onChange={(e) => setVsSpO2(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Temperatura (°C)</Label>
                        <Input
                          type="text"
                          placeholder="Temp °C"
                          className={cn(
                            "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20",
                            isDefaultTemperature
                              ? "text-slate-400 dark:text-slate-500 font-normal italic"
                              : "text-foreground font-semibold"
                          )}
                          value={vsTemperature}
                          onChange={(e) => setVsTemperature(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Freq. Resp (FR)</Label>
                        <Input
                          type="number"
                          placeholder="FR irpm"
                          className={cn(
                            "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20",
                            isDefaultRespiratoryRate
                              ? "text-slate-400 dark:text-slate-500 font-normal italic"
                              : "text-foreground font-semibold"
                          )}
                          value={vsRespiratoryRate}
                          onChange={(e) => setVsRespiratoryRate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Escala de Dor</Label>
                        <Select value={vsPain} onValueChange={setVsPain}>
                          <SelectTrigger className={cn(
                            "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20",
                            isDefaultPain
                              ? "text-slate-400 dark:text-slate-500 font-normal italic"
                              : "text-foreground font-semibold"
                          )}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(11).keys()].map(i => (
                              <SelectItem key={i} value={String(i)}>{i} - {i === 0 ? 'Sem Dor' : i === 10 ? 'Dor Máxima' : `Nível ${i}`}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Nível de Consciência (AVDI)</Label>
                        <Select value={vsConsciousness} onValueChange={setVsConsciousness}>
                          <SelectTrigger className={cn(
                            "h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-900/60 rounded-xl backdrop-blur-sm shadow-sm transition-all focus:ring-1 focus:ring-[#006699]/20",
                            isDefaultConsciousness
                              ? "text-slate-400 dark:text-slate-500 font-normal italic"
                              : "text-foreground font-semibold"
                          )}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A - Alerta (Consciente e Orientado)</SelectItem>
                            <SelectItem value="V">V - Voz (Responde a estímulo verbal / sonolento)</SelectItem>
                            <SelectItem value="D">D - Dor (Responde apenas a estímulo doloroso)</SelectItem>
                            <SelectItem value="I">I - Inconsciente (Sem resposta / arresponsivo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Display MEWS Escore in Real Time */}
                      {(() => {
                        const mews = calculateMEWS();
                        const mewsClass = getMEWSClassification(mews);
                        return (
                          <div className={cn("p-3 rounded-xl border flex items-center justify-between shadow-sm transition-all duration-300", mewsClass.color)}>
                            <div className="min-w-0 flex-1">
                              <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Escore Precoce de Deterioração (MEWS)</p>
                              <p className="text-xs font-black uppercase tracking-tight mt-0.5">{mewsClass.label}</p>
                              <p className="text-[9px] opacity-75 font-semibold mt-0.5 truncate leading-tight">{mewsClass.alert}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center shrink-0 border border-black/5 font-black text-xl font-mono">
                              {mews}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}

                {/* Super Painel de Prescrição Médica (Kanban / Estruturada) */}
                {(evolutionType === "Evolução Médica" || evolutionType === "Evolução Médica (Pediátrica)") && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl border border-white/40 dark:border-white/10 bg-white/35 dark:bg-slate-900/35 backdrop-blur-md shadow-sm space-y-4 relative z-20"
                  >
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        ⚡ Super Painel de Prescrição Médica (UPA 24h)
                      </span>
                      <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
                        Prescrição Expressa & Adaptativa
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 1. Formulário de Inserção */}
                      <div className="space-y-3">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          1. Adicionar Item (Fila da Farmácia & Enfermagem)
                        </span>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold">Medicamento</Label>
                            <Input
                              placeholder="Ex: Dipirona"
                              className="h-8 text-xs bg-white/50 dark:bg-black/20"
                              value={prescWizard.medication}
                              onChange={(e) => setPrescWizard({ ...prescWizard, medication: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold">Dose</Label>
                            <Input
                              placeholder="Ex: 1g"
                              className="h-8 text-xs bg-white/50 dark:bg-black/20"
                              value={prescWizard.dosage}
                              onChange={(e) => setPrescWizard({ ...prescWizard, dosage: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold">Via</Label>
                            <Select
                              value={prescWizard.route}
                              onValueChange={(v) => setPrescWizard({ ...prescWizard, route: v })}
                            >
                              <SelectTrigger className="h-8 text-xs bg-white/50 dark:bg-black/20">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="EV">EV (Endovenosa)</SelectItem>
                                <SelectItem value="IM">IM (Intramuscular)</SelectItem>
                                <SelectItem value="VO">VO (Oral)</SelectItem>
                                <SelectItem value="SC">SC (Subcutânea)</SelectItem>
                                <SelectItem value="Inalatória">Inalatória</SelectItem>
                                <SelectItem value="Tópica">Tópica</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold">Frequência</Label>
                            <Select
                              value={prescWizard.frequency}
                              onValueChange={(v) => setPrescWizard({ ...prescWizard, frequency: v })}
                            >
                              <SelectTrigger className="h-8 text-xs bg-white/50 dark:bg-black/20">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Dose única">Dose única</SelectItem>
                                <SelectItem value="Contínuo">Contínuo</SelectItem>
                                <SelectItem value="4/4h">4/4h</SelectItem>
                                <SelectItem value="6/6h">6/6h</SelectItem>
                                <SelectItem value="8/8h">8/8h</SelectItem>
                                <SelectItem value="12/12h">12/12h</SelectItem>
                                <SelectItem value="24/24h">24/24h</SelectItem>
                                <SelectItem value="ACM">ACM (A critério médico)</SelectItem>
                                <SelectItem value="SOS">SOS (Se necessário)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddPrescriptionItem}
                          className="w-full h-8 text-[10px] font-black uppercase tracking-wider bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-blue-500/30"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Adicionar à Prescrição
                        </Button>
                      </div>

                      {/* 2. Lista de Itens Prescritos */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          2. Lista Estruturada
                        </span>
                        <div className="bg-white/40 dark:bg-black/20 rounded-lg border border-white/40 dark:border-white/10 p-2 min-h-[120px] max-h-[160px] overflow-y-auto space-y-1.5">
                          {prescribedMedications.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 py-4">
                              <CheckCircle2 className="h-6 w-6 mb-1 opacity-20" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Nenhum item adicionado</span>
                            </div>
                          ) : (
                            prescribedMedications.map((med, idx) => (
                              <div key={idx} className="flex flex-col bg-white/60 dark:bg-slate-800/60 p-2 rounded-md border border-slate-500/20 text-xs relative group">
                                <button
                                  onClick={() => handleRemovePrescriptionItem(idx)}
                                  className="absolute top-1 right-1 h-5 w-5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <span className="font-bold pr-6">{med.medication} <span className="text-muted-foreground font-normal">({med.dosage})</span></span>
                                <span className="text-[10px] text-muted-foreground">Via: {med.route} • Freq: {med.frequency}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 3. Escalas Clínicas Adicionais para Prescrição */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">3. Escalas Clínicas Úteis (Prescrição Adaptativa)</span>
                        <Badge variant="outline" className="text-[8px] uppercase tracking-wider bg-primary/5 text-primary border-primary/20">Médicas</Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* Card MEWS */}
                        <button
                          type="button"
                          onClick={() => setOpenMewsCalc(true)}
                          className={cn(
                            "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                            selectedMews
                              ? "bg-blue-500/5 border-blue-500/30 dark:bg-blue-500/10"
                              : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5 backdrop-blur-sm shadow-sm"
                          )}
                        >
                          <div className="flex items-center justify-between w-full mb-1.5">
                            <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedMews ? "text-blue-600 dark:text-blue-400" : "text-foreground/80 group-hover:text-blue-600 dark:group-hover:text-blue-400")}>MEWS (Alerta)</span>
                            <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedMews ? "bg-blue-500" : "bg-blue-500/15")}>
                              <Activity className={cn("h-3 w-3", selectedMews ? "text-white" : "text-blue-600")} />
                            </div>
                          </div>
                          {selectedMews ? (
                            <Badge className="h-4 text-[9px] font-bold bg-blue-600 hover:bg-blue-700 border-none text-white px-1.5 rounded truncate max-w-full">
                              {selectedMews}
                            </Badge>
                          ) : (
                            <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                          )}
                        </button>

                        {/* Card NEWS2 */}
                        <button
                          type="button"
                          onClick={() => setOpenNews2Calc(true)}
                          className={cn(
                            "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                            selectedNews2
                              ? "bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-500/10"
                              : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 backdrop-blur-sm shadow-sm"
                          )}
                        >
                          <div className="flex items-center justify-between w-full mb-1.5">
                            <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedNews2 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground/80 group-hover:text-emerald-600 dark:group-hover:text-emerald-400")}>NEWS2</span>
                            <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedNews2 ? "bg-emerald-500" : "bg-emerald-500/15")}>
                              <Activity className={cn("h-3 w-3", selectedNews2 ? "text-white" : "text-emerald-600")} />
                            </div>
                          </div>
                          {selectedNews2 ? (
                            <Badge className="h-4 text-[9px] font-bold bg-emerald-500 hover:bg-emerald-600 border-none text-white px-1.5 rounded truncate max-w-full">
                              {selectedNews2}
                            </Badge>
                          ) : (
                            <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                          )}
                        </button>

                        {/* Card qSOFA */}
                        <button
                          type="button"
                          onClick={() => setOpenQsofaCalc(true)}
                          className={cn(
                            "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                            selectedQsofa
                              ? "bg-purple-500/5 border-purple-500/30 dark:bg-purple-500/10"
                              : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 backdrop-blur-sm shadow-sm"
                          )}
                        >
                          <div className="flex items-center justify-between w-full mb-1.5">
                            <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedQsofa ? "text-purple-600 dark:text-purple-400" : "text-foreground/80 group-hover:text-purple-600 dark:group-hover:text-purple-400")}>qSOFA (Sepse)</span>
                            <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedQsofa ? "bg-purple-500" : "bg-purple-500/15")}>
                              <ShieldAlert className={cn("h-3 w-3", selectedQsofa ? "text-white" : "text-purple-600")} />
                            </div>
                          </div>
                          {selectedQsofa ? (
                            <Badge className="h-4 text-[9px] font-bold bg-purple-600 hover:bg-purple-700 border-none text-white px-1.5 rounded truncate max-w-full">
                              {selectedQsofa}
                            </Badge>
                          ) : (
                            <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                          )}
                        </button>

                        {/* Card Glasgow */}
                        <button
                          type="button"
                          onClick={() => setOpenGlasgowCalc(true)}
                          className={cn(
                            "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                            selectedGlasgow
                              ? "bg-indigo-500/5 border-indigo-500/30 dark:bg-indigo-500/10"
                              : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 backdrop-blur-sm shadow-sm"
                          )}
                        >
                          <div className="flex items-center justify-between w-full mb-1.5">
                            <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedGlasgow ? "text-indigo-600 dark:text-indigo-400" : "text-foreground/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-400")}>Glasgow (GCS)</span>
                            <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedGlasgow ? "bg-indigo-500" : "bg-indigo-500/15")}>
                              <Brain className={cn("h-3 w-3", selectedGlasgow ? "text-white" : "text-indigo-600")} />
                            </div>
                          </div>
                          {selectedGlasgow ? (
                            <Badge className="h-4 text-[9px] font-bold bg-indigo-600 hover:bg-indigo-700 border-none text-white px-1.5 rounded truncate max-w-full">
                              {selectedGlasgow}
                            </Badge>
                          ) : (
                            <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Super Painel de Desfecho Clínico & Alta */}
                {evolutionType === "Alta" && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl border border-white/40 dark:border-white/10 bg-white/35 dark:bg-slate-900/35 backdrop-blur-md shadow-sm space-y-4 relative z-20"
                  >
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        ⚡ Super Painel de Desfecho Clínico & Alta (UPA 24h)
                      </span>
                      <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
                        Fluxo de Alta Expresso & Adaptativo
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 1. Tipo de Desfecho / Alta */}
                      <div className={cn("space-y-2 relative", isDischargeTypeDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          1. Tipo de Desfecho / Alta (Inserir no texto)
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsDischargeTypeDropdownOpen(!isDischargeTypeDropdownOpen);
                              setIsDischargeConductDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#006699]/20",
                              isDischargeTypeDropdownOpen ? "border-[#006699] text-foreground" : "border-white/60 dark:border-white/10 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-square"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                              </span>
                              <span>
                                {(() => {
                                  const selectedItem = DISCHARGE_TYPE_ITEMS.find(item => normalizeText(description).includes(normalizeText(item.text).trim()));
                                  return selectedItem ? selectedItem.label : "Selecionar Tipo de Alta...";
                                })()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = DISCHARGE_TYPE_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-emerald-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    Selecionado ✓
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isDischargeTypeDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isDischargeTypeDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-emerald-500/20 border-white/20 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 text-slate-900 dark:text-slate-100 shadow-2xl backdrop-blur-md z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                              >
                                {DISCHARGE_TYPE_ITEMS.map((item) => {
                                  const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => {
                                        setDescription(item.text);
                                        setIsDischargeTypeDropdownOpen(false);
                                        toast.success(item.toastMsg + " definido");
                                      }}
                                      className={cn(
                                        "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                        isActive
                                          ? "bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20"
                                          : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                      )}
                                    >
                                      <span className="truncate">{item.label}</span>
                                      {isActive ? (
                                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                          Ativo ✓
                                        </span>
                                      ) : (
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-bold transition-all">
                                          + Definir
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 2. Condutas e Orientações Pós-Alta */}
                      <div className={cn("space-y-2 relative", isDischargeConductDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          2. Condutas e Orientações (Inserir no texto)
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsDischargeConductDropdownOpen(!isDischargeConductDropdownOpen);
                              setIsDischargeTypeDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#006699]/20",
                              isDischargeConductDropdownOpen ? "border-[#006699] text-foreground" : "border-white/60 dark:border-white/10 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h4.28" /></svg>
                              </span>
                              <span>Selecionar Orientações...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = DISCHARGE_CONDUCT_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isDischargeConductDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isDischargeConductDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-blue-500/20 border-white/20 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 text-slate-900 dark:text-slate-100 shadow-2xl backdrop-blur-md z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                              >
                                {DISCHARGE_CONDUCT_ITEMS.map((item) => {
                                  const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                      className={cn(
                                        "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                        isActive
                                          ? "bg-blue-500/5 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/20"
                                          : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                      )}
                                    >
                                      <span className="truncate">{item.label}</span>
                                      {isActive ? (
                                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                          Adicionado ✓
                                        </span>
                                      ) : (
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-bold transition-all">
                                          + Inserir
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* 3. Protocolos e Termos Obrigatórios */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">3. Protocolos & Termos Obrigatórios (Desfecho Adaptativo)</span>
                        <Badge variant="outline" className="text-[8px] uppercase tracking-wider bg-primary/5 text-primary border-primary/20">Regulação e Segurança</Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* Termo de Responsabilidade */}
                        <button
                          type="button"
                          onClick={() => {
                            const text = "TERMO DE RESPONSABILIDADE:\nDeclaro que o paciente e/ou responsável legal foram amplamente orientados sobre os riscos clínicos e complicações potenciais decorrentes da interrupção do tratamento proposto nesta data, assinando o termo impresso anexo ao prontuário.";
                            toggleCareItem(text, "Termo de Responsabilidade");
                          }}
                          className={cn(
                            "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                            normalizeText(description).includes("termo de responsabilidade")
                              ? "bg-amber-500/5 border-amber-500/30 dark:bg-amber-500/10"
                              : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5 backdrop-blur-sm shadow-sm"
                          )}
                        >
                          <div className="flex items-center justify-between w-full mb-1.5">
                            <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", normalizeText(description).includes("termo de responsabilidade") ? "text-amber-600 dark:text-amber-400" : "text-foreground/80 group-hover:text-amber-600 dark:group-hover:text-amber-400")}>TERMO ALTA/EVASÃO</span>
                            <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", normalizeText(description).includes("termo de responsabilidade") ? "bg-amber-500" : "bg-amber-500/15")}>
                              <ShieldAlert className={cn("h-3 w-3", normalizeText(description).includes("termo de responsabilidade") ? "text-white" : "text-amber-600")} />
                            </div>
                          </div>
                          <span className="text-[10px] font-bold">Termo de Responsab.</span>
                          <span className="text-[8px] text-muted-foreground mt-0.5">
                            {normalizeText(description).includes("termo de responsabilidade") ? "Anexado ✓" : "Não Inserido"}
                          </span>
                        </button>

                        {/* Solicitação CROSS */}
                        <button
                          type="button"
                          onClick={() => {
                            const text = "REGULAÇÃO CROSS:\n- Paciente regulado sob ID CROSS: [DIGITE AQUI]\n- Status regulatório: Aguardando vaga / Transferência autorizada\n- Condições de transporte: Estável para transporte em ambulância Tipo B / UTI móvel Tipo D com acompanhamento médico.";
                            toggleCareItem(text, "Solicitação CROSS");
                          }}
                          className={cn(
                            "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                            normalizeText(description).includes("regulação cross")
                              ? "bg-blue-500/5 border-blue-500/30 dark:bg-blue-500/10"
                              : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5 backdrop-blur-sm shadow-sm"
                          )}
                        >
                          <div className="flex items-center justify-between w-full mb-1.5">
                            <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", normalizeText(description).includes("regulação cross") ? "text-blue-600 dark:text-blue-400" : "text-foreground/80 group-hover:text-blue-600 dark:group-hover:text-blue-400")}>REGULAÇÃO CROSS</span>
                            <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", normalizeText(description).includes("regulação cross") ? "bg-blue-500" : "bg-blue-500/15")}>
                              <Clock className={cn("h-3 w-3", normalizeText(description).includes("regulação cross") ? "text-white" : "text-blue-600")} />
                            </div>
                          </div>
                          <span className="text-[10px] font-bold">Solicitação CROSS</span>
                          <span className="text-[8px] text-muted-foreground mt-0.5">
                            {normalizeText(description).includes("regulação cross") ? "Regulação Ativa ✓" : "Não Solicitada"}
                          </span>
                        </button>

                        {/* Receituário e Atestado */}
                        <button
                          type="button"
                          onClick={() => {
                            const text = "RECEITUÁRIO E ATESTADO:\n- Receita médica emitida e entregue ao paciente para uso domiciliar.\n- Atestado médico de afastamento de suas atividades laborais por [ ] dias emitido e carimbado conforme resolução do CFM.";
                            toggleCareItem(text, "Receituário e Atestado");
                          }}
                          className={cn(
                            "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                            normalizeText(description).includes("receituário e atestado")
                              ? "bg-purple-500/5 border-purple-500/30 dark:bg-purple-500/10"
                              : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 backdrop-blur-sm shadow-sm"
                          )}
                        >
                          <div className="flex items-center justify-between w-full mb-1.5">
                            <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", normalizeText(description).includes("receituário e atestado") ? "text-purple-600 dark:text-purple-400" : "text-foreground/80 group-hover:text-purple-600 dark:group-hover:text-purple-400")}>RECEITAS & ATESTADOS</span>
                            <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", normalizeText(description).includes("receituário e atestado") ? "bg-purple-500" : "bg-purple-500/15")}>
                              <Activity className={cn("h-3 w-3", normalizeText(description).includes("receituário e atestado") ? "text-white" : "text-purple-600")} />
                            </div>
                          </div>
                          <span className="text-[10px] font-bold">Atestado / Receituário</span>
                          <span className="text-[8px] text-muted-foreground mt-0.5">
                            {normalizeText(description).includes("receituário e atestado") ? "Emitido ✓" : "Não Emitido"}
                          </span>
                        </button>

                        {/* Declaração de Óbito */}
                        <button
                          type="button"
                          onClick={() => {
                            const text = "DECLARAÇÃO DE ÓBITO:\n- Óbito constatado pelo médico assistente conforme critérios clínicos.\n- Declaração de Óbito (DO) número: [DIGITE AQUI] preenchida e entregue aos familiares.\n- Orientações de procedimentos fúnebres e assistência social realizadas.";
                            toggleCareItem(text, "Declaração de Óbito");
                          }}
                          className={cn(
                            "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                            normalizeText(description).includes("declaração de óbito")
                              ? "bg-red-500/5 border-red-500/30 dark:bg-red-500/10"
                              : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-red-500/40 hover:bg-red-500/5 backdrop-blur-sm shadow-sm"
                          )}
                        >
                          <div className="flex items-center justify-between w-full mb-1.5">
                            <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", normalizeText(description).includes("declaração de óbito") ? "text-red-600 dark:text-red-400" : "text-foreground/80 group-hover:text-red-600 dark:group-hover:text-red-400")}>DECLARAÇÃO ÓBITO</span>
                            <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", normalizeText(description).includes("declaração de óbito") ? "bg-red-500" : "bg-red-500/15")}>
                              <X className={cn("h-3 w-3", normalizeText(description).includes("declaração de óbito") ? "text-white" : "text-red-600")} />
                            </div>
                          </div>
                          <span className="text-[10px] font-bold">Declaração de Óbito</span>
                          <span className="text-[8px] text-muted-foreground mt-0.5">
                            {normalizeText(description).includes("declaração de óbito") ? "Preenchida ✓" : "Não Preenchida"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Super Painel Evolução Médica (Adulto) */}
                {evolutionType === "Evolução Médica" && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl border border-white/40 dark:border-white/10 bg-white/35 dark:bg-slate-900/35 backdrop-blur-md shadow-sm space-y-4 relative z-20"
                  >
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🩺 Super Painel Médico (Adulto UPA 24h)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* 1. Exame Físico & Neuro */}
                      <div className={cn("space-y-2 relative", isMedicalNeuroDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          1. Exame Físico & Neuro
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMedicalNeuroDropdownOpen(!isMedicalNeuroDropdownOpen);
                              setIsMedicalSyndromeDropdownOpen(false);
                              setIsMedicalConductDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500/20",
                              isMedicalNeuroDropdownOpen ? "border-green-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-green-500/10 text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                              </span>
                              <span>Selecionar Exame...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = MEDICAL_PHYSICAL_NEURO_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-green-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isMedicalNeuroDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isMedicalNeuroDropdownOpen && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-green-500/20 border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 shadow-2xl backdrop-blur-md z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {MEDICAL_PHYSICAL_NEURO_ITEMS.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive
                                            ? "bg-green-500/5 text-green-700 dark:text-green-400 font-bold border border-green-500/20"
                                            : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-green-600 dark:text-green-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 2. Síndromes Clínicas Comuns */}
                      <div className={cn("space-y-2 relative", isMedicalSyndromeDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          2. Síndromes Clínicas Comuns
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMedicalSyndromeDropdownOpen(!isMedicalSyndromeDropdownOpen);
                              setIsMedicalNeuroDropdownOpen(false);
                              setIsMedicalConductDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20",
                              isMedicalSyndromeDropdownOpen ? "border-red-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-red-500/10 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h4.28" /></svg>
                              </span>
                              <span>Selecionar Síndrome...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = MEDICAL_SYNDROME_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isMedicalSyndromeDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isMedicalSyndromeDropdownOpen && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-red-500/20 border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 shadow-2xl backdrop-blur-md z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {MEDICAL_SYNDROME_ITEMS.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive
                                            ? "bg-red-500/5 text-red-700 dark:text-red-400 font-bold border border-red-500/20"
                                            : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-red-600 dark:text-red-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 3. Solicitações e Condutas Rápidas */}
                      <div className={cn("space-y-2 relative", isMedicalConductDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          3. Solicitações e Condutas Rápidas
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMedicalConductDropdownOpen(!isMedicalConductDropdownOpen);
                              setIsMedicalNeuroDropdownOpen(false);
                              setIsMedicalSyndromeDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                              isMedicalConductDropdownOpen ? "border-blue-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
                              </span>
                              <span>Selecionar Conduta...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = MEDICAL_CONDUCT_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isMedicalConductDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isMedicalConductDropdownOpen && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-blue-500/20 border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 shadow-2xl backdrop-blur-md z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {MEDICAL_CONDUCT_ITEMS.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive
                                            ? "bg-blue-500/5 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/20"
                                            : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Escores e Calculadoras Rápidas */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">4. Escores e Calculadoras Rápidas</span>
                        <Badge variant="outline" className="text-[8px] uppercase tracking-wider bg-primary/5 text-primary border-primary/20">Fast-Track</Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <button type="button" onClick={() => setOpenQsofaCalc(true)} className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-400 text-[10px] font-black uppercase transition-all">
                          <Activity className="h-3 w-3" /> qSOFA
                        </button>
                        <button type="button" onClick={() => setOpenHeartCalc(true)} className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 text-[10px] font-black uppercase transition-all">
                          <Heart className="h-3 w-3" /> HEART Score
                        </button>
                        <button type="button" onClick={() => setOpenCurb65Calc(true)} className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 text-[10px] font-black uppercase transition-all">
                          <Activity className="h-3 w-3" /> CURB-65
                        </button>
                        <button type="button" onClick={() => setOpenWellsCalc(true)} className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-[10px] font-black uppercase transition-all">
                          <Activity className="h-3 w-3" /> Wells (TEP)
                        </button>
                        <button type="button" onClick={() => setOpenNihssCalc(true)} className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase transition-all">
                          <Brain className="h-3 w-3" /> NIHSS (AVC)
                        </button>
                        <button type="button" onClick={() => setOpenParklandCalc(true)} className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-[10px] font-black uppercase transition-all">
                          <Flame className="h-3 w-3" /> Parkland (SCQ)
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Resumo de Evolução Pediátrica */}
                {evolutionType === "Evolução Médica (Pediátrica)" && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl border border-white/40 dark:border-white/10 bg-white/35 dark:bg-slate-900/35 backdrop-blur-md shadow-sm space-y-4 relative z-20"
                  >
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🧸 Super Painel Médico (Pediatria UPA 24h)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* 1. Exame Físico Inicial & Traumas */}
                      <div className={cn("space-y-2 relative", isPediatricNeuroDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          1. Exame Físico Inicial & Traumas
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPediatricNeuroDropdownOpen(!isPediatricNeuroDropdownOpen);
                              setIsPediatricSyndromeDropdownOpen(false);
                              setIsPediatricConductDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500/20",
                              isPediatricNeuroDropdownOpen ? "border-green-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-green-500/10 text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                              </span>
                              <span>Selecionar Exame...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = PEDIATRIC_PHYSICAL_NEURO_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-green-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isPediatricNeuroDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isPediatricNeuroDropdownOpen && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-green-500/20 border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 shadow-2xl backdrop-blur-md z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {PEDIATRIC_PHYSICAL_NEURO_ITEMS.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive
                                            ? "bg-green-500/5 text-green-700 dark:text-green-400 font-bold border border-green-500/20"
                                            : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-green-600 dark:text-green-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 2. Síndromes Pediátricas Comuns */}
                      <div className={cn("space-y-2 relative", isPediatricSyndromeDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          2. Síndromes Pediátricas Comuns
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPediatricSyndromeDropdownOpen(!isPediatricSyndromeDropdownOpen);
                              setIsPediatricNeuroDropdownOpen(false);
                              setIsPediatricConductDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20",
                              isPediatricSyndromeDropdownOpen ? "border-red-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-red-500/10 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h4.28" /></svg>
                              </span>
                              <span>Selecionar Síndrome...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = PEDIATRIC_SYNDROME_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isPediatricSyndromeDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isPediatricSyndromeDropdownOpen && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-red-500/20 border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 shadow-2xl backdrop-blur-md z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {PEDIATRIC_SYNDROME_ITEMS.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive
                                            ? "bg-red-500/5 text-red-700 dark:text-red-400 font-bold border border-red-500/20"
                                            : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-red-600 dark:text-red-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 3. Condutas Rápidas (Pediatria) */}
                      <div className={cn("space-y-2 relative", isPediatricConductDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          3. Condutas Rápidas (Pediatria)
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPediatricConductDropdownOpen(!isPediatricConductDropdownOpen);
                              setIsPediatricNeuroDropdownOpen(false);
                              setIsPediatricSyndromeDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                              isPediatricConductDropdownOpen ? "border-blue-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
                              </span>
                              <span>Selecionar Conduta...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = PEDIATRIC_CONDUCT_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isPediatricConductDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isPediatricConductDropdownOpen && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-blue-500/20 border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 shadow-2xl backdrop-blur-md z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {PEDIATRIC_CONDUCT_ITEMS.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive
                                            ? "bg-blue-500/5 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/20"
                                            : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Escores e Calculadoras Rápidas (Pediatria) */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">4. Escores Pediátricos (Fast-Track)</span>
                        <Badge variant="outline" className="text-[8px] uppercase tracking-wider bg-primary/5 text-primary border-primary/20">Pediatria</Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <button type="button" onClick={() => setOpenPewsCalc(true)} className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 text-[10px] font-black uppercase transition-all">
                          <Activity className="h-3 w-3" /> Escore PEWS
                        </button>
                        <button type="button" onClick={() => setOpenGlasgowCalc(true)} className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase transition-all">
                          <Brain className="h-3 w-3" /> Glasgow
                        </button>
                        <button type="button" onClick={() => setOpenDehydrationCalc(true)} className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 text-[10px] font-black uppercase transition-all">
                          <Droplet className="h-3 w-3" /> Desidratação OMS
                        </button>
                        <button type="button" onClick={() => setOpenWoodDownesCalc(true)} className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-400 text-[10px] font-black uppercase transition-all">
                          <Wind className="h-3 w-3" /> Wood-Downes
                        </button>
                        <button type="button" onClick={() => setOpenParklandCalc(true)} className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-[10px] font-black uppercase transition-all">
                          <Flame className="h-3 w-3" /> Parkland (SCQ)
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Super Painel Equipe Técnica (Anotação de Enfermagem) */}
                {evolutionType === "Anotação de Enfermagem" && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl border border-white/40 dark:border-white/10 bg-white/35 dark:bg-slate-900/35 backdrop-blur-md shadow-sm space-y-4 relative z-20"
                  >
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        💉 Super Painel da Equipe Técnica (Anotações UPA 24h)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 1. Rotinas de Medicação e Acesso */}
                      <div className={cn("space-y-2 relative", isMedicationDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          1. Rotinas de Medicação e Acesso
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMedicationDropdownOpen(!isMedicationDropdownOpen);
                              setIsCareDropdownOpen(false);
                              setIsComfortDropdownOpen(false);
                              setIsMovementDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20",
                              isMedicationDropdownOpen ? "border-red-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-red-500/10 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-syringe"><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-.2.2-.5.3-.7.3H5v-3c0-.3.1-.5.3-.7L15.6 5.6" /><path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="m14 4 6 6" /></svg>
                              </span>
                              <span>Selecionar Rotinas...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = medicationItems.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isMedicationDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isMedicationDropdownOpen && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-red-500/20 border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 shadow-2xl backdrop-blur-md z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {medicationItems.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive
                                            ? "bg-red-500/5 text-red-700 dark:text-red-400 font-bold border border-red-500/20"
                                            : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-red-600 dark:text-red-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 2. Checklist de Cuidados de Enfermagem */}
                      <div className={cn("space-y-2 relative", isCareDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          2. Checklist de Cuidados de Enfermagem
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCareDropdownOpen(!isCareDropdownOpen);
                              setIsMedicationDropdownOpen(false);
                              setIsComfortDropdownOpen(false);
                              setIsMovementDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                              isCareDropdownOpen ? "border-blue-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>
                              </span>
                              <span>Selecionar Cuidados...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = careItems.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isCareDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isCareDropdownOpen && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-blue-500/20 border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 shadow-2xl backdrop-blur-md z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {careItems.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive
                                            ? "bg-blue-500/5 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/20"
                                            : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 3. Cuidados, Conforto e Dieta Padrão */}
                      <div className={cn("space-y-2 relative", isComfortDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          3. Cuidados, Conforto e Dieta Padrão
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsComfortDropdownOpen(!isComfortDropdownOpen);
                              setIsMedicationDropdownOpen(false);
                              setIsCareDropdownOpen(false);
                              setIsMovementDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20",
                              isComfortDropdownOpen ? "border-orange-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-orange-500/10 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bed"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /></svg>
                              </span>
                              <span>Selecionar Conforto...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = comfortItems.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-orange-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isComfortDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isComfortDropdownOpen && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-orange-500/20 border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 shadow-2xl backdrop-blur-md z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {comfortItems.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive
                                            ? "bg-orange-500/5 text-orange-700 dark:text-orange-400 font-bold border border-orange-500/20"
                                            : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 4. Movimentação e Ocorrências */}
                      <div className={cn("space-y-2 relative", isMovementDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          4. Movimentação e Ocorrências
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMovementDropdownOpen(!isMovementDropdownOpen);
                              setIsMedicationDropdownOpen(false);
                              setIsCareDropdownOpen(false);
                              setIsComfortDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                              isMovementDropdownOpen ? "border-indigo-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-indigo-500/10 text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                              </span>
                              <span>Selecionar Ocorrências...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = movementItems.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-indigo-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isMovementDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isMovementDropdownOpen && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-indigo-500/20 border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 shadow-2xl backdrop-blur-md z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {movementItems.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive
                                            ? "bg-indigo-500/5 text-indigo-700 dark:text-indigo-400 font-bold border border-indigo-500/20"
                                            : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ---------------- MULTIDISCIPLINAR PANELS ---------------- */}
                {evolutionType === "Evolução da Fisioterapia" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4 relative z-20">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🫁 Super Painel da Fisioterapia {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação e Rotina", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>, "blue", isChild ? FISIO_PED_ITEMS : FISIO_ADULT_ITEMS, isFisioEvalDropdownOpen, () => { setIsFisioEvalDropdownOpen(!isFisioEvalDropdownOpen); setIsFisioProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Procedimentos e Condutas", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>, "green", isChild ? FISIO_PED_PROCEDURES : FISIO_ADULT_PROCEDURES, isFisioProcDropdownOpen, () => { setIsFisioProcDropdownOpen(!isFisioProcDropdownOpen); setIsFisioEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {evolutionType === "Evolução da Nutrição" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4 relative z-20">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🥗 Super Painel da Nutrição {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação Nutricional", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>, "amber", isChild ? NUTRI_PED_ITEMS : NUTRI_ADULT_ITEMS, isNutriEvalDropdownOpen, () => { setIsNutriEvalDropdownOpen(!isNutriEvalDropdownOpen); setIsNutriProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Condutas e Dietas", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" /><path d="M10 2c1 .5 2 2 2 5" /></svg>, "green", isChild ? NUTRI_PED_PROCEDURES : NUTRI_ADULT_PROCEDURES, isNutriProcDropdownOpen, () => { setIsNutriProcDropdownOpen(!isNutriProcDropdownOpen); setIsNutriEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {evolutionType === "Evolução da Psicologia" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4 relative z-20">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🧠 Super Painel da Psicologia {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação Psicológica", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, "purple", isChild ? PSICO_PED_ITEMS : PSICO_ADULT_ITEMS, isPsicoEvalDropdownOpen, () => { setIsPsicoEvalDropdownOpen(!isPsicoEvalDropdownOpen); setIsPsicoProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Condutas e Manejo", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-handshake"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" /><path d="m18 15-2-2" /><path d="m15 18-2-2" /></svg>, "pink", isChild ? PSICO_PED_PROCEDURES : PSICO_ADULT_PROCEDURES, isPsicoProcDropdownOpen, () => { setIsPsicoProcDropdownOpen(!isPsicoProcDropdownOpen); setIsPsicoEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {evolutionType === "Evolução do Serviço Social" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4 relative z-20">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🤝 Super Painel do Serviço Social {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação Social", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>, "blue", isChild ? SOCIAL_PED_ITEMS : SOCIAL_ADULT_ITEMS, isSocialEvalDropdownOpen, () => { setIsSocialEvalDropdownOpen(!isSocialEvalDropdownOpen); setIsSocialProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Condutas e Encaminhamentos", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" /><path d="M15 5.764v15" /><path d="M9 3.236v15" /></svg>, "amber", isChild ? SOCIAL_PED_PROCEDURES : SOCIAL_ADULT_PROCEDURES, isSocialProcDropdownOpen, () => { setIsSocialProcDropdownOpen(!isSocialProcDropdownOpen); setIsSocialEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {evolutionType === "Evolução da Terapia Ocupacional" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4 relative z-20">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🧩 Super Painel da Terapia Ocupacional {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação Funcional", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>, "amber", isChild ? TO_PED_ITEMS : TO_ADULT_ITEMS, isToEvalDropdownOpen, () => { setIsToEvalDropdownOpen(!isToEvalDropdownOpen); setIsToProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Condutas e Estimulação", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-puzzle"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.611c-.941.941-2.468.941-3.409 0L12 19.828c-.23-.23-.556-.338-.878-.289a2.33 2.33 0 0 1-2.78-2.78c-.049-.322-.157-.648-.387-.878l-1.568-1.568c-.941-.941-.941-2.468 0-3.409l1.61-1.611a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.611c.941-.941 2.468-.941 3.409 0L19.44 7.85Z" /></svg>, "pink", isChild ? TO_PED_PROCEDURES : TO_ADULT_PROCEDURES, isToProcDropdownOpen, () => { setIsToProcDropdownOpen(!isToProcDropdownOpen); setIsToEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {evolutionType === "Evolução da Fonoaudiologia" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4 relative z-20">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🗣️ Super Painel da Fonoaudiologia {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação Fonoaudiológica", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>, "blue", isChild ? FONO_PED_ITEMS : FONO_ADULT_ITEMS, isFonoEvalDropdownOpen, () => { setIsFonoEvalDropdownOpen(!isFonoEvalDropdownOpen); setIsFonoProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Condutas e Disfagia", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-glass-water"><path d="M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.81 17.21A2 2 0 0 1 15.2 22Z" /><path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0" /></svg>, "green", isChild ? FONO_PED_PROCEDURES : FONO_ADULT_PROCEDURES, isFonoProcDropdownOpen, () => { setIsFonoProcDropdownOpen(!isFonoProcDropdownOpen); setIsFonoEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {evolutionType === "Evolução da Farmácia Clínica" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4 relative z-20">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        💊 Super Painel da Farmácia Clínica {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação Farmacêutica", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-plus"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 14h6" /><path d="M12 11v6" /></svg>, "amber", isChild ? FARMA_PED_ITEMS : FARMA_ADULT_ITEMS, isFarmaEvalDropdownOpen, () => { setIsFarmaEvalDropdownOpen(!isFarmaEvalDropdownOpen); setIsFarmaProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Condutas e Reconciliação", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pill"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></svg>, "pink", isChild ? FARMA_PED_PROCEDURES : FARMA_ADULT_PROCEDURES, isFarmaProcDropdownOpen, () => { setIsFarmaProcDropdownOpen(!isFarmaProcDropdownOpen); setIsFarmaEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {/* Super Painel Gestão de Leitos (Enfermagem) */}
                {evolutionType === "Evolução Enfermagem" && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl border border-sky-500/20 dark:border-sky-500/10 bg-gradient-to-r from-sky-500/5 to-transparent dark:from-sky-500/10 backdrop-blur-md shadow-sm space-y-4 relative z-20 mb-4"
                  >
                    <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] dark:text-sky-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <BedIcon className="h-4 w-4" />
                        Gestão de Leitos e Fluxo (Bed Management)
                      </span>
                      <Badge variant="outline" className="text-[8px] uppercase tracking-wider bg-sky-500/10 text-sky-600 border-sky-500/20">
                        Privativo Enfermagem
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Resumo de Vagas */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          Disponibilidade de Vagas (Giro de Leito)
                        </span>
                        {(() => {
                          const stats = beds.reduce((acc, bed) => {
                            if (!acc[bed.ward]) acc[bed.ward] = { available: 0, total: 0 };
                            acc[bed.ward].total++;
                            if (bed.status === 'available') acc[bed.ward].available++;
                            return acc;
                          }, {} as Record<string, { available: number, total: number }>);

                          return (
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(stats).map(([ward, wardStats]) => (
                                <div key={ward} className="p-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 shadow-sm">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold truncate max-w-[70%]">{ward}</span>
                                    <span className={cn(
                                      "text-[9px] font-black",
                                      wardStats.available > 0 ? "text-green-600" : "text-red-500"
                                    )}>
                                      {wardStats.available} Livres
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className={cn("h-full rounded-full transition-all", wardStats.available > 0 ? "bg-green-500" : "bg-red-500")}
                                      style={{ width: `${((wardStats.total - wardStats.available) / wardStats.total) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Ações Rápidas */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          Ações de Movimentação (Lançar na Evolução)
                        </span>
                        <div className="grid grid-cols-2 gap-2 h-[58px]">
                          <button
                            type="button"
                            onClick={() => setOpenBedTransfer(true)}
                            className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 transition-all h-full"
                          >
                            <ArrowLeft className="h-4 w-4 rotate-180" />
                            <span className="text-[9px] font-black uppercase">Alocar / Transferir</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setOpenBedStatus(true)}
                            className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 transition-all h-full"
                          >
                            <ShieldAlert className="h-4 w-4" />
                            <span className="text-[9px] font-black uppercase">Status / Higienização</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Super Painel SAE Enfermagem */}
                {evolutionType === "Evolução Enfermagem" && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl border border-white/40 dark:border-white/10 bg-white/35 dark:bg-slate-900/35 backdrop-blur-md shadow-sm space-y-4 relative z-20"
                  >
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        📋 Super Painel SAE - Processo de Enfermagem (UPA 24h)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 1. Rotinas de Admissão por Setor */}
                      <div className={cn("space-y-2 relative", isSaeAdmissionDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          1. Rotinas de Admissão por Setor
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsSaeAdmissionDropdownOpen(!isSaeAdmissionDropdownOpen);
                              setIsSaeCareDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20",
                              isSaeAdmissionDropdownOpen ? "border-red-500 text-foreground" : "border-white/60 dark:border-white/10 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-red-500/10 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-door-open"><path d="M13 4h3a2 2 0 0 1 2 2v14" /><path d="M2 20h20" /><path d="M13 20V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16" /><path d="M6 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" /></svg>
                              </span>
                              <span>Selecionar Rotinas...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = admissionItems.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isSaeAdmissionDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isSaeAdmissionDropdownOpen && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-red-500/20 bg-white/95 dark:bg-slate-950/95 text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 backdrop-blur-md"
                                >
                                  {admissionItems.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive
                                            ? "bg-red-500/5 text-red-700 dark:text-red-400 font-bold border border-red-500/20"
                                            : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-red-600 dark:text-red-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 2. Checklist de Cuidados de Enfermagem */}
                      <div className={cn("space-y-2 relative", isSaeCareDropdownOpen ? "z-30" : "z-10")}>
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          2. Checklist de Cuidados de Enfermagem (Inserir no text)
                        </span>

                        <div className="relative clinical-dropdown-container">
                          <button
                            type="button"
                            onClick={() => {
                              setIsSaeCareDropdownOpen(!isSaeCareDropdownOpen);
                              setIsSaeAdmissionDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-white/45 dark:bg-slate-900/45 hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-sm text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                              isSaeCareDropdownOpen ? "border-blue-500 text-foreground" : "border-white/60 dark:border-white/10 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h3.16" /></svg>
                              </span>
                              <span>Selecionar Cuidados...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = careItems.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isSaeCareDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isSaeCareDropdownOpen && (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-blue-500/20 bg-white/95 dark:bg-slate-950/95 text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 backdrop-blur-md"
                                >
                                  {careItems.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive
                                            ? "bg-blue-500/5 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/20"
                                            : "hover:bg-muted/70 text-slate-700 dark:text-slate-200 border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-[#006699] dark:group-hover:text-sky-400 font-bold transition-all">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>


                    {/* 3. Escalas Clínicas */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">3. Escalas Clínicas e de Risco</span>
                        <Badge variant="outline" className="text-[8px] uppercase tracking-wider bg-primary/5 text-primary border-primary/20">Adaptativas</Badge>
                      </div>

                      {/* Adult Scales (!isChild) */}
                      {!isChild && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-10 gap-2">
                          {/* Card Morse */}
                          <button
                            type="button"
                            onClick={() => setOpenMorseCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedMorse
                                ? "bg-amber-500/5 border-amber-500/30 dark:bg-amber-500/10"
                                : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5 backdrop-blur-sm shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedMorse ? "text-amber-600 dark:text-amber-400" : "text-foreground/80 group-hover:text-amber-600 dark:group-hover:text-amber-400")}>Morse (Quedas)</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedMorse ? "bg-amber-500" : "bg-amber-500/15")}>
                                <ShieldAlert className={cn("h-3 w-3", selectedMorse ? "text-white" : "text-amber-600")} />
                              </div>
                            </div>
                            {selectedMorse ? (
                              <Badge className="h-4 text-[9px] font-bold bg-amber-500 hover:bg-amber-600 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedMorse}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card Braden */}
                          <button
                            type="button"
                            onClick={() => setOpenBradenCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedBraden
                                ? "bg-orange-500/5 border-orange-500/30 dark:bg-orange-500/10"
                                : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-orange-500/40 hover:bg-orange-500/5 backdrop-blur-sm shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedBraden ? "text-orange-600 dark:text-orange-400" : "text-foreground/80 group-hover:text-orange-600 dark:group-hover:text-orange-400")}>Braden (LPP)</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedBraden ? "bg-orange-500" : "bg-orange-500/15")}>
                                <Activity className={cn("h-3 w-3", selectedBraden ? "text-white" : "text-orange-600")} />
                              </div>
                            </div>
                            {selectedBraden ? (
                              <Badge className="h-4 text-[9px] font-bold bg-orange-500 hover:bg-orange-600 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedBraden}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card EVA */}
                          <button
                            type="button"
                            onClick={() => setOpenEvaCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedEva
                                ? "bg-red-500/5 border-red-500/30 dark:bg-red-500/10"
                                : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-red-500/40 hover:bg-red-500/5 backdrop-blur-sm shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedEva ? "text-red-600 dark:text-red-400" : "text-foreground/80 group-hover:text-red-600 dark:group-hover:text-red-400")}>Dor (EVA)</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedEva ? "bg-red-500" : "bg-red-500/15")}>
                                <Heart className={cn("h-3 w-3", selectedEva ? "text-white" : "text-red-600")} />
                              </div>
                            </div>
                            {selectedEva ? (
                              <Badge className="h-4 text-[9px] font-bold bg-red-500 hover:bg-red-600 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedEva}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card MEWS */}
                          <button
                            type="button"
                            onClick={() => setOpenMewsCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedMews
                                ? "bg-blue-500/5 border-blue-500/30 dark:bg-blue-500/10"
                                : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5 backdrop-blur-sm shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedMews ? "text-blue-600 dark:text-blue-400" : "text-foreground/80 group-hover:text-blue-600 dark:group-hover:text-blue-400")}>MEWS (Alerta)</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedMews ? "bg-blue-500" : "bg-blue-500/15")}>
                                <Activity className={cn("h-3 w-3", selectedMews ? "text-white" : "text-blue-600")} />
                              </div>
                            </div>
                            {selectedMews ? (
                              <Badge className="h-4 text-[9px] font-bold bg-blue-600 hover:bg-blue-700 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedMews}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card NEWS2 */}
                          <button
                            type="button"
                            onClick={() => setOpenNews2Calc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedNews2
                                ? "bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-500/10"
                                : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 backdrop-blur-sm shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedNews2 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground/80 group-hover:text-emerald-600 dark:group-hover:text-emerald-400")}>NEWS2</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedNews2 ? "bg-emerald-500" : "bg-emerald-500/15")}>
                                <Activity className={cn("h-3 w-3", selectedNews2 ? "text-white" : "text-emerald-600")} />
                              </div>
                            </div>
                            {selectedNews2 ? (
                              <Badge className="h-4 text-[9px] font-bold bg-emerald-500 hover:bg-emerald-600 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedNews2}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card qSOFA */}
                          <button
                            type="button"
                            onClick={() => setOpenQsofaCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedQsofa
                                ? "bg-purple-500/5 border-purple-500/30 dark:bg-purple-500/10"
                                : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 backdrop-blur-sm shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedQsofa ? "text-purple-600 dark:text-purple-400" : "text-foreground/80 group-hover:text-purple-600 dark:group-hover:text-purple-400")}>qSOFA (Sepse)</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedQsofa ? "bg-purple-500" : "bg-purple-500/15")}>
                                <ShieldAlert className={cn("h-3 w-3", selectedQsofa ? "text-white" : "text-purple-600")} />
                              </div>
                            </div>
                            {selectedQsofa ? (
                              <Badge className="h-4 text-[9px] font-bold bg-purple-600 hover:bg-purple-700 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedQsofa}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card Glasgow */}
                          <button
                            type="button"
                            onClick={() => setOpenGlasgowCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedGlasgow
                                ? "bg-indigo-500/5 border-indigo-500/30 dark:bg-indigo-500/10"
                                : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 backdrop-blur-sm shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedGlasgow ? "text-indigo-600 dark:text-indigo-400" : "text-foreground/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-400")}>Glasgow (GCS)</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedGlasgow ? "bg-indigo-500" : "bg-indigo-500/15")}>
                                <Brain className={cn("h-3 w-3", selectedGlasgow ? "text-white" : "text-indigo-600")} />
                              </div>
                            </div>
                            {selectedGlasgow ? (
                              <Badge className="h-4 text-[9px] font-bold bg-indigo-600 hover:bg-indigo-700 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedGlasgow}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card Saúde Mental */}
                          <button
                            type="button"
                            onClick={() => setOpenMentalCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedMentalSummary
                                ? "bg-violet-500/5 border-violet-500/30 dark:bg-violet-500/10"
                                : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 backdrop-blur-sm shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedMentalSummary ? "text-violet-600 dark:text-violet-400" : "text-foreground/80 group-hover:text-violet-600 dark:group-hover:text-violet-400")}>Saúde Mental</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedMentalSummary ? "bg-violet-500" : "bg-violet-500/15")}>
                                <Brain className={cn("h-3 w-3", selectedMentalSummary ? "text-white" : "text-violet-600")} />
                              </div>
                            </div>
                            {selectedMentalSummary ? (
                              <Badge className="h-4 text-[9px] font-bold bg-violet-600 hover:bg-violet-700 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedMentalSummary}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card Urgências Clínicas */}
                          <button
                            type="button"
                            onClick={() => setOpenUrgencyCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedUrgencySummary
                                ? "bg-rose-500/5 border-rose-500/30 dark:bg-rose-500/10"
                                : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-rose-500/40 hover:bg-rose-500/5 backdrop-blur-sm shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedUrgencySummary ? "text-rose-600 dark:text-rose-400" : "text-foreground/80 group-hover:text-rose-600 dark:group-hover:text-rose-400")}>Urgências</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedUrgencySummary ? "bg-rose-500" : "bg-rose-500/15")}>
                                <ShieldAlert className={cn("h-3 w-3", selectedUrgencySummary ? "text-white" : "text-rose-600")} />
                              </div>
                            </div>
                            {selectedUrgencySummary ? (
                              <Badge className="h-4 text-[9px] font-bold bg-rose-600 hover:bg-rose-700 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedUrgencySummary}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card Escalas de Enfermagem */}
                          <button
                            type="button"
                            onClick={() => setOpenNursingCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedNursingSummary
                                ? "bg-cyan-500/5 border-cyan-500/30 dark:bg-cyan-500/10"
                                : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 backdrop-blur-sm shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedNursingSummary ? "text-cyan-600 dark:text-cyan-400" : "text-foreground/80 group-hover:text-cyan-600 dark:group-hover:text-cyan-400")}>Enfermagem</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedNursingSummary ? "bg-cyan-500" : "bg-cyan-500/15")}>
                                <Activity className={cn("h-3 w-3", selectedNursingSummary ? "text-white" : "text-cyan-600")} />
                              </div>
                            </div>
                            {selectedNursingSummary ? (
                              <Badge className="h-4 text-[9px] font-bold bg-cyan-600 hover:bg-cyan-700 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedNursingSummary}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Pediatric Scales (isChild) */}
                      {isChild && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Card PEWS */}
                          <button
                            type="button"
                            onClick={() => setOpenPewsCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-3 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedPews
                                ? "bg-teal-500/5 border-teal-500/30 dark:bg-teal-500/10"
                                : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-teal-500/40 hover:bg-teal-500/5 backdrop-blur-sm shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[11px] font-black uppercase tracking-wider transition-colors", selectedPews ? "text-teal-600 dark:text-teal-400" : "text-foreground/80 group-hover:text-teal-600 dark:group-hover:text-teal-400")}>PEWS (Alerta Pediátrico)</span>
                              <div className={cn("w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedPews ? "bg-teal-500" : "bg-teal-500/15")}>
                                <Baby className={cn("h-3.5 w-3.5", selectedPews ? "text-white" : "text-teal-600")} />
                              </div>
                            </div>
                            {selectedPews ? (
                              <Badge className="h-5 text-[10px] font-bold bg-teal-600 hover:bg-teal-700 border-none text-white px-2 rounded truncate max-w-full">
                                {selectedPews}
                              </Badge>
                            ) : (
                              <span className="text-[10px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card EVA */}
                          <button
                            type="button"
                            onClick={() => setOpenEvaCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-3 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedEva
                                ? "bg-red-500/5 border-red-500/30 dark:bg-red-500/10"
                                : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:border-red-500/40 hover:bg-red-500/5 backdrop-blur-sm shadow-sm"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[11px] font-black uppercase tracking-wider transition-colors", selectedEva ? "text-red-600 dark:text-red-400" : "text-foreground/80 group-hover:text-red-600 dark:group-hover:text-red-400")}>Escala de Dor (EVA)</span>
                              <div className={cn("w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedEva ? "bg-red-500" : "bg-red-500/15")}>
                                <Heart className={cn("h-4 w-4", selectedEva ? "text-white" : "text-red-600")} />
                              </div>
                            </div>
                            {selectedEva ? (
                              <Badge className="h-5 text-[10px] font-bold bg-red-500 hover:bg-red-600 border-none text-white px-2 rounded">
                                {selectedEva}
                              </Badge>
                            ) : (
                              <span className="text-[10px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 4. Diagnósticos NANDA/NIC/NOC */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">4. Diagnósticos e Planejamento de Enfermagem (NANDA, NOC, NIC)</span>
                        <Badge variant="outline" className="text-[8px] uppercase tracking-wider bg-primary/5 text-primary border-primary/20">Taxonomia Oficial</Badge>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        <button
                          type="button"
                          onClick={() => setOpenNandaCalc(true)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all hover:border-primary/40 hover:bg-muted/30 group w-full sm:w-auto",
                            activeNandaPlan
                              ? "bg-primary/5 border-primary/30 text-primary"
                              : "bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 backdrop-blur-sm shadow-sm"
                          )}
                        >
                          <Activity className="h-4 w-4 text-primary group-hover:animate-pulse" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground group-hover:text-foreground">Abrir Planejador NANDA-NOC-NIC</span>
                            {activeNandaPlan ? (
                              <span className="text-[9px] font-bold text-primary">{activeNandaPlan}</span>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Planejar cuidados integrados do paciente</span>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>

                  </motion.div>
                )}

                <div className="space-y-1 relative z-10">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      {evolutionType === "Sinais Vitais" ? "Observações Clínicas Adicionais (opcional)" : "Descrição *"}
                    </Label>
                    <div className="flex items-center gap-2">
                      {description && (
                        <button
                          type="button"
                          onClick={() => setDescription("")}
                          className="text-[9px] font-extrabold text-red-500 hover:underline uppercase tracking-wider bg-red-500/5 px-2 py-0.5 rounded border border-red-500/15 transition-all"
                        >
                          Limpar Texto
                        </button>
                      )}
                      {evolutionType && EVOLUTION_TEMPLATES[evolutionType] && (
                        <button
                          type="button"
                          onClick={() => setDescription(EVOLUTION_TEMPLATES[evolutionType])}
                          className="text-[9px] font-extrabold text-[#006699] hover:underline uppercase tracking-wider bg-[#006699]/5 px-2 py-0.5 rounded border border-[#006699]/15 transition-all"
                        >
                          Carregar Modelo Padrão
                        </button>
                      )}
                    </div>
                  </div>
                  <Textarea
                    placeholder={evolutionType === "Sinais Vitais" ? "Observações clínicas, aspecto geral do paciente, queixas, etc." : "Descreva a evolução do paciente..."}
                    className="min-h-[140px] bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 resize-none text-xs leading-relaxed rounded-xl backdrop-blur-sm transition-all shadow-sm focus:ring-1 focus:ring-primary/20"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Carimbo Digital persistent configuration section */}
                <div className="border border-white/40 dark:border-white/10 rounded-xl bg-white/35 dark:bg-slate-900/35 backdrop-blur-md shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsStampConfigOpen(!isStampConfigOpen)}
                    className="w-full px-4 py-2.5 bg-white/20 dark:bg-slate-800/20 hover:bg-white/35 dark:hover:bg-slate-800/35 transition-all flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground"
                  >
                    <span>🖋️ Carimbo Digital & Assinatura (COREN / CRM)</span>
                    <span className="font-mono text-xs">{isStampConfigOpen ? "Recolher ▲" : "Configurar ▼"}</span>
                  </button>
                  {isStampConfigOpen && (
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white/25 dark:bg-slate-950/25 border-t border-white/40 dark:border-white/10">
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Nome Completo</Label>
                        <Input
                          placeholder="Dr(a). / Enf."
                          className="h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm transition-all shadow-sm"
                          value={stampName}
                          onChange={(e) => {
                            setStampName(e.target.value);
                            setProfessional(e.target.value);
                            localStorage.setItem("upa_stamp_name", e.target.value);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Conselho</Label>
                        <Select
                          value={stampCouncil}
                          onValueChange={(val) => {
                            setStampCouncil(val);
                            localStorage.setItem("upa_stamp_council", val);
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-900/60 rounded-xl backdrop-blur-sm transition-all shadow-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CRM">CRM (Médico)</SelectItem>
                            <SelectItem value="COREN">COREN (Enfermeiro)</SelectItem>
                            <SelectItem value="COREN-TEC">COREN (Técnico)</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Número de Registro</Label>
                        <Input
                          placeholder="Apenas números"
                          className="h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm transition-all shadow-sm"
                          value={stampNumber}
                          onChange={(e) => {
                            setStampNumber(e.target.value);
                            localStorage.setItem("upa_stamp_number", e.target.value);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">UF</Label>
                        <Input
                          placeholder="Ex: SP"
                          className="h-8 text-xs bg-white/45 dark:bg-slate-900/45 border-white/60 dark:border-white/10 focus:bg-white/60 dark:focus:bg-slate-900/60 rounded-xl backdrop-blur-sm transition-all shadow-sm uppercase"
                          value={stampState}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase().slice(0, 2);
                            setStampState(val);
                            localStorage.setItem("upa_stamp_state", val);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2.5 pt-1">
                  <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="font-bold uppercase text-[9px] tracking-widest h-8 px-4">
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveEvolution}
                    className="bg-[#006699] hover:bg-[#005580] text-white font-bold uppercase text-[9px] tracking-widest h-8 px-5 rounded-md shadow-sm active:scale-95"
                  >
                    Salvar Registro
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <h2 className="text-sm font-black tracking-widest text-[#006699] dark:text-sky-400 uppercase">Linha do Tempo de Atendimento</h2>

        {filteredEvolutions.length === 0 && !(patient?.exams && patient.exams.length > 0) ? (
          <Card className="glass-card-premium border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-xl overflow-hidden transition-all duration-500">
            <CardContent className="h-36 flex items-center justify-center bg-muted/5">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/30 px-8 text-center leading-relaxed">
                {activeTab === "all"
                  ? "Nenhuma evolução registrada para este paciente."
                  : `Nenhum registro de ${activeTab === "evolutions" ? "Evolução" :
                    activeTab === "prescriptions" ? "Prescrição" :
                      activeTab === "vitals" ? "Sinais Vitais" :
                        activeTab === "exams" ? "Exame/Procedimento" : "Alta"
                  } para este paciente.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-6">
            {(activeTab === "all" || activeTab === "exams") && patient?.exams && patient.exams.map((exam) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-purple-600 dark:border-purple-400 bg-background flex items-center justify-center shadow-sm z-10">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                </div>
                <Card className="glass-card-premium border border-purple-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-xl overflow-hidden hover:scale-[1.01] transition-all duration-300">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                      <div className="flex items-center gap-2.5">
                        <Badge className="bg-purple-600/10 text-purple-600 border-none text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          {exam.type === 'lab' ? 'Laboratório' : 'Imagem'}
                        </Badge>
                        <span className="text-xs font-black text-foreground/90 uppercase tracking-wide">
                          {exam.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("border-none font-bold text-[10px] uppercase py-0.5 px-2 rounded-full shadow-sm", exam.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : exam.status === 'in_analysis' ? 'bg-blue-500/10 text-blue-600' : 'bg-orange-500/10 text-orange-600')}>
                          {exam.status === 'completed' ? 'Concluído' : exam.status === 'in_analysis' ? 'Em Análise' : 'Aguardando Coleta'}
                        </Badge>
                        <span className="text-xs font-bold text-muted-foreground/80">
                          {new Date(exam.requestedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm">
                        <p className="text-muted-foreground font-semibold text-[10px] uppercase">Médico Solicitante: {exam.doctor}</p>
                        {exam.priority === 'urgent' && <p className="text-red-500 font-bold text-[10px] uppercase mt-1">SLA URGENTE (1h)</p>}
                        {exam.result && <p className="mt-2 text-foreground font-medium"><strong>Laudo:</strong> {exam.result}</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {filteredEvolutions.map((record) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#006699] dark:border-sky-400 bg-background flex items-center justify-center shadow-sm z-10">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#006699] dark:bg-sky-400" />
                </div>

                <Card className="glass-card-premium border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-xl overflow-hidden hover:scale-[1.01] active:scale-[0.99] transition-all duration-300">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                      <div className="flex items-center gap-2.5">
                        <Badge className="bg-[#006699]/10 dark:bg-sky-400/10 hover:bg-[#006699]/20 text-[#006699] dark:text-sky-300 border-none text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          {record.type}
                        </Badge>
                        <span className="text-xs font-black text-foreground/90 uppercase tracking-wide">
                          {record.professional.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {record.cid && (
                          <Badge className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border-none font-bold text-[10px] uppercase py-0.5 px-2 rounded-full shadow-sm">
                            CID: {record.cid}
                          </Badge>
                        )}
                        <span className="text-xs font-bold text-muted-foreground/80">
                          {record.timestamp}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-foreground/95 leading-relaxed font-medium whitespace-pre-line">
                      {record.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={isBedDialogOpen} onOpenChange={setIsBedDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 overflow-hidden glass-card-premium bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-[#006699] dark:text-sky-400">Gerenciar Leito</DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-slate-500 dark:text-slate-400 mt-1">
              {patient.name.toUpperCase().includes('NÃO IDENTIFICADO') || patient.name.toUpperCase().includes('DESCONHECIDO')
                ? "PACIENTE NÃO IDENTIFICADO"
                : patient.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            {patientBed ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/25 flex items-center gap-4 shadow-sm backdrop-blur-md">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/20 dark:bg-emerald-500/30 flex items-center justify-center shrink-0">
                    <BedIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 leading-none mb-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Leito Ativo
                    </p>
                    <p className="text-base font-black text-emerald-700 dark:text-emerald-300 leading-tight">{patientBed.name}</p>
                    <p className="text-[10px] font-semibold text-emerald-600/70 dark:text-emerald-400/70 mt-0.5 truncate">{patientBed.ward} · {patientBed.room}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/25 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-650 dark:hover:text-white font-bold uppercase tracking-widest text-[10px] transition-all duration-300 active:scale-95 shadow-sm"
                  onClick={() => {
                    releaseBed(patientBed.id);
                    toast.success("Leito liberado");
                    setIsBedDialogOpen(false);
                  }}
                >
                  Liberar Leito
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Alocar Leito Disponível
                </p>
                <div className="max-h-[250px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                  {availableBeds.length === 0 ? (
                    <div className="py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 opacity-50 bg-slate-50/10 dark:bg-slate-900/10">
                      <BedIcon className="h-8 w-8 text-slate-400 dark:text-slate-600" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Nenhum leito disponível</p>
                    </div>
                  ) : (
                    availableBeds.map(bed => (
                      <button
                        key={bed.id}
                        onClick={() => {
                          assignPatient(bed.id, id!);
                          toast.success(`Paciente alocado no ${bed.name}`);
                          setIsBedDialogOpen(false);
                        }}
                        className="w-full p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 text-left flex items-center justify-between hover:border-primary/50 dark:hover:border-sky-500/50 hover:bg-[#006699]/5 dark:hover:bg-sky-500/10 transition-all duration-300 active:scale-[0.98] group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 flex items-center justify-center shrink-0 border border-slate-200/30 dark:border-slate-800 group-hover:bg-primary/10 dark:group-hover:bg-sky-500/15 group-hover:border-primary/20 dark:group-hover:border-sky-500/25 transition-all">
                            <BedIcon className="h-5 w-5 text-muted-foreground/80 group-hover:text-primary dark:group-hover:text-sky-400 transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-foreground transition-colors group-hover:text-primary dark:group-hover:text-sky-450 truncate">{bed.name}</p>
                            <p className="text-[10px] font-semibold text-muted-foreground/80 mt-0.5 truncate">{bed.ward} · {bed.room}</p>
                          </div>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shrink-0" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isExamsModalOpen} onOpenChange={setIsExamsModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-6 overflow-hidden glass-card-premium bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-purple-600 dark:text-purple-400">Apoio Diagnóstico</DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-slate-500 dark:text-slate-400 mt-1">
              Solicitação de Exames Laboratoriais e de Imagem
            </DialogDescription>
          </DialogHeader>
          <ExamsModal patient={patient} onClose={() => setIsExamsModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIÁLOGOS DE ESCALAS CLÍNICAS E AVALIAÇÕES (MODULARIZADOS)                 */}
      {/* ========================================================================= */}
      <MorseModal
        isOpen={openMorseCalc}
        onClose={setOpenMorseCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
          setSelectedMorse(sum);
        }}
      />
      <BradenModal
        isOpen={openBradenCalc}
        onClose={setOpenBradenCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
          setSelectedBraden(sum);
        }}
      />
      <EvaModal
        isOpen={openEvaCalc}
        onClose={setOpenEvaCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
          setSelectedEva(sum);
        }}
      />
      <MewsModal
        isOpen={openMewsCalc}
        onClose={setOpenMewsCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
          setSelectedMews(sum);
        }}
      />
      <News2Modal
        isOpen={openNews2Calc}
        onClose={setOpenNews2Calc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
          setSelectedNews2(sum);
        }}
      />
      <QsofaModal
        isOpen={openQsofaCalc}
        onClose={setOpenQsofaCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
          setSelectedQsofa(sum);
        }}
      />
      <PewsModal
        isOpen={openPewsCalc}
        onClose={setOpenPewsCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
          setSelectedPews(sum);
        }}
      />
      <GlasgowModal
        isOpen={openGlasgowCalc}
        onClose={setOpenGlasgowCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
          setSelectedGlasgow(sum);
        }}
      />
      <MentalModal
        isOpen={openMentalCalc}
        onClose={setOpenMentalCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
          setSelectedMentalSummary(sum);
        }}
      />
      {/* Modais de Gestão de Leitos */}
      <BedTransferModal
        isOpen={openBedTransfer}
        onClose={setOpenBedTransfer}
        patientId={patient?.id}
        fugulinSummary={selectedNursingSummary}
        onApply={(text) => {
          setDescription(prev => prev ? prev + '\n\n' + text : text);
        }}
      />
      <BedStatusModal
        isOpen={openBedStatus}
        onClose={setOpenBedStatus}
        onApply={(text) => {
          setDescription(prev => prev ? prev + '\n\n' + text : text);
        }}
      />

      <PatientTimelineModal
        isOpen={isTimelineOpen}
        onClose={setIsTimelineOpen}
        patient={patient}
      />
      <BedRequestModal
        patient={patient}
        isOpen={isBedRequestOpen}
        onClose={() => setIsBedRequestOpen(false)}
      />

      {/* Modais Médicos / Pediátricos */}
      <UrgencyModal
        isOpen={openUrgencyCalc}
        onClose={setOpenUrgencyCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
          setSelectedUrgencySummary(sum);
        }}
      />
      <FugulinModal
        isOpen={openNursingCalc}
        onClose={setOpenNursingCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
          setSelectedNursingSummary(sum);
        }}
      />
      <NandaModal
        isOpen={openNandaCalc}
        onClose={setOpenNandaCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
          setActiveNandaPlan(sum);
        }}
      />

      <HeartScoreModal
        isOpen={openHeartCalc}
        onClose={setOpenHeartCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
        }}
      />
      <Curb65Modal
        isOpen={openCurb65Calc}
        onClose={setOpenCurb65Calc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
        }}
      />
      <WellsScoreModal
        isOpen={openWellsCalc}
        onClose={setOpenWellsCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
        }}
      />
      <NihssModal
        isOpen={openNihssCalc}
        onClose={setOpenNihssCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
        }}
      />
      <DehydrationScoreModal
        isOpen={openDehydrationCalc}
        onClose={setOpenDehydrationCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
        }}
      />
      <WoodDownesModal
        isOpen={openWoodDownesCalc}
        onClose={setOpenWoodDownesCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
        }}
      />
      <ParklandModal
        isOpen={openParklandCalc}
        onClose={setOpenParklandCalc}
        onApply={(desc, sum) => {
          setDescription(p => p ? `${p}\n${desc}` : desc);
        }}
      />

      {patient && (
        <>
          <ClinicalProfileModal
            isOpen={isClinicalProfileOpen}
            onClose={() => setIsClinicalProfileOpen(false)}
            patient={patient}
            onSave={(pid, updates) => updatePatient(pid, updates)}
          />
          <VitalsHistoryModal
            isOpen={isVitalsHistoryOpen}
            onClose={() => setIsVitalsHistoryOpen(false)}
            patient={patient}
          />
        </>
      )}
    </motion.div>
  );
}
