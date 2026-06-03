import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Syringe, 
  CheckCircle2, 
  Clock, 
  Activity, 
  User, 
  Plus, 
  AlertTriangle, 
  Check, 
  X, 
  Search, 
  FileText, 
  HeartPulse, 
  Sparkles, 
  RotateCcw,
  AlertOctagon,
  Trash2,
  Stethoscope,
  Info,
  QrCode,
  UserCheck,
  PenTool,
  Droplet,
  PackagePlus,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePatients } from "@/hooks/use-patients";
import { useBeds } from "@/context/BedsContext";
import { usePrescriptions, AprazamentoHour as ContextAprazamentoHour } from "@/context/PrescriptionsContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ─── Types and Interfaces ─── */
interface AprazamentoHour {
  hour: string; // e.g., "08:00"
  status: 'pending' | 'checked' | 'refused' | 'delayed';
  checkedAt?: string;
  nurseName?: string;
  vitalSigns?: {
    bp?: string; // Pressão Arterial
    hr?: string; // Frequência Cardíaca
    temp?: string; // Temperatura
    glycemia?: string; // Glicemia
  };
  justification?: string;
}

interface PrescriptionItem {
  id: string;
  orderId?: string;
  medication: string;
  dosage: string;
  route: string;
  frequency: string; // "4/4h", "6/6h", "8/8h", "12/12h", "Contínuo"
  hours: AprazamentoHour[];
}

interface ExtendedPrescriptionItem extends PrescriptionItem {
  hasAllergyConflict?: boolean;
}

interface PatientCheckData {
  prescriptions: PrescriptionItem[];
}

const getPatientAvatar = (name?: string, gender?: string, age?: number): string => {
  if (!name) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120";
  
  if (age !== undefined) {
    const isMale = gender?.toUpperCase() === 'M' || name.toLowerCase().includes('joão') || name.toLowerCase().includes('pedro');
    const isFemale = gender?.toUpperCase() === 'F' || name.toLowerCase().includes('maria') || name.toLowerCase().includes('helena');
    
    // Baby (0-2 years)
    if (age <= 2) {
      return isFemale 
        ? "https://images.unsplash.com/photo-1513254921616-6c17e3381a17?auto=format&fit=crop&q=80&w=120" // baby girl
        : "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=120"; // baby boy
    }
    // Child (3-12 years)
    if (age <= 12) {
      return isFemale
        ? "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&q=80&w=120" // girl
        : "https://images.unsplash.com/photo-1519340241574-2c6f10c1f5de?auto=format&fit=crop&q=80&w=120"; // boy
    }
    // Elderly (60+ years)
    if (age >= 60) {
      return isFemale
        ? "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=120" // elderly woman
        : "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?auto=format&fit=crop&q=80&w=120"; // elderly man
    }
    // Adult (default)
    return isFemale
      ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120" // adult woman
      : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"; // adult man
  }

  // Default fallback if age is missing
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`;
};

/* ─── Safe Time Formatter Helper ─── */
const formatArrivalTime = (timeStr?: string): string => {
  if (!timeStr) return "08:00";
  try {
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return "08:00";
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return "08:00";
  }
};

export default function NursingCheck() {
  const { patients } = usePatients();
  const { beds } = useBeds();
  const { orders, updateMedicationHours } = usePrescriptions();
  
  const [filterSector, setFilterSector] = useState<string>("all");

  // Map active hospitalized/triaged patients with their beds
  const activePatients = patients
    .filter(p => p.status === 'attending' || p.status === 'waiting')
    .map(p => {
      const assignedBed = beds.find(b => b.patientId === p.id);
      return {
        ...p,
        computedSector: assignedBed ? assignedBed.ward : "Sala de Medicação",
        computedRoom: assignedBed ? assignedBed.name : "Recepção / Poltronas"
      };
    })
    .filter(p => filterSector === "all" || p.computedSector === filterSector);
  
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  
  // Safely initialize patientData directly from localStorage using a fresh key to prevent cache corruption
  const [patientData, setPatientData] = useState<Record<string, PatientCheckData>>(() => {
    const saved = localStorage.getItem("upa_nursing_checks_v4");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse initial nursing checks", e);
      }
    }
    return {};
  });
  
  // Modal/Check details state (For inputting checks)
  const [activeCheckItem, setActiveCheckItem] = useState<{
    prescriptionId: string;
    orderId?: string;
    hourIdx: number;
    hourData: AprazamentoHour;
    medName: string;
  } | null>(null);

  // Viewing already checked bubble details state
  const [viewingCheckDetails, setViewingCheckDetails] = useState<{
    prescriptionId: string;
    orderId?: string;
    hourIdx: number;
    hourData: AprazamentoHour;
    medName: string;
    route?: string;
    dosage?: string;
  } | null>(null);

  // Viewing detailed Prescription Sheet state
  const [viewingPrescription, setViewingPrescription] = useState<ExtendedPrescriptionItem | null>(null);
  
  // Form fields for checking medication
  const [checkAction, setCheckAction] = useState<'check' | 'refuse'>('check');
  const [vitals, setVitals] = useState({ bp: "", hr: "", temp: "", glycemia: "" });
  const [justification, setJustification] = useState("");
  const [nurseName, setNurseName] = useState("Enf. Cláudia Ramos");

  // Prescribing wizard state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardData, setWizardData] = useState({
    medication: "",
    dosage: "",
    route: "EV",
    frequency: "6/6h",
    startHour: "08:00"
  });

  const [allergyAlert, setAllergyAlert] = useState<{ med: string; patientName: string } | null>(null);

  /* ─── Occurrences State ─── */
  interface OccurrenceItem {
    id: string;
    patientId: string;
    category: string;
    reportedAt: string;
    nurseName: string;
    observation?: string;
  }

  const [occurrences, setOccurrences] = useState<OccurrenceItem[]>(() => {
    const saved = localStorage.getItem("upa_nursing_occurrences_v4");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse occurrences", e);
      }
    }
    return [
      { id: "occ-1", patientId: "1", category: "Dor Intensa", reportedAt: "2026-05-23 10:45", nurseName: "Enf. Ricardo Braga", observation: "Paciente relatou cefaleia súbita e intensa. Administrado repouso." }
    ];
  });

  const saveOccurrences = (newOccs: OccurrenceItem[]) => {
    setOccurrences(newOccs);
    localStorage.setItem("upa_nursing_occurrences_v4", JSON.stringify(newOccs));
  };

  const [showOccurrenceLogger, setShowOccurrenceLogger] = useState(false);
  const [newOccurrence, setNewOccurrence] = useState({
    category: "Dor Intensa",
    observation: ""
  });

  /* ─── Barcode Scanner HUD State ─── */
  const [showScanner, setShowScanner] = useState(false);
  const [scannedPatient, setScannedPatient] = useState(false);
  const [scannedMed, setScannedMed] = useState(false);
  const [scanTarget, setScanTarget] = useState<{ medName: string; patientName: string } | null>(null);

  /* ─── Satellite Pharmacy Flow State ─── */
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [pharmacyRequest, setPharmacyRequest] = useState({ item: "", amount: "1", priority: "normal" });

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 120);
    } catch (e) {
      console.error("Web Audio failed", e);
    }
  };

  /* ─── Pump Settings State ─── */
  interface PumpSettings {
    velocity: number;
    vtbi: number;
    infused: number;
    status: 'running' | 'paused' | 'stopped';
  }

  const [pumpSettings, setPumpSettings] = useState<Record<string, PumpSettings>>(() => {
    const saved = localStorage.getItem("upa_pump_settings_v4");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (_e) {
        // silent fail - use fallback
      }
    }
    return {
      "pr-3": { velocity: 80, vtbi: 500, infused: 120, status: "running" }
    };
  });

  const savePumpSettings = (newSettings: Record<string, PumpSettings>) => {
    setPumpSettings(newSettings);
    localStorage.setItem("upa_pump_settings_v4", JSON.stringify(newSettings));
  };

  /* ─── Co-Signature Flow State ─── */
  const [coSignatureRequired, setCoSignatureRequired] = useState(false);
  const [coSigningNurse, setCoSigningNurse] = useState("");
  const [coSignatureSuccess, setCoSignatureSuccess] = useState(false);

  // Selected patient entity
  const selectedPatient = activePatients.find(p => p.id === selectedPatientId) || activePatients[0];

  // Auto-select first active patient
  useEffect(() => {
    if (activePatients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(activePatients[0].id);
    }
  }, [activePatients, selectedPatientId]);

  // Sync state helper
  const saveChecks = (newData: Record<string, PatientCheckData>) => {
    setPatientData(newData);
    localStorage.setItem("upa_nursing_checks_v4", JSON.stringify(newData));
  };

  // Dynamic mapping from PrescriptionsContext
  const getPatientCheckSheet = (patientId: string): PatientCheckData => {
    const patientOrders = orders.filter(o => o.patientId === patientId);
    
    const prescriptionsFromContext: PrescriptionItem[] = [];
    patientOrders.forEach(order => {
      order.medications.forEach(med => {
        if (med.status !== 'suspended' && med.status !== 'awaiting_pharmacy') {
          prescriptionsFromContext.push({
            id: med.id,
            orderId: order.id,
            medication: med.medication,
            dosage: med.dosage,
            route: med.route,
            frequency: med.frequency,
            hours: (med.hours as AprazamentoHour[]) || []
          });
        }
      });
    });

    if (prescriptionsFromContext.length > 0) {
      return { prescriptions: prescriptionsFromContext };
    }

    if (patientData[patientId]) {
      return patientData[patientId];
    }
    
    return { prescriptions: [] };
  };

  const currentSheet = selectedPatient ? getPatientCheckSheet(selectedPatient.id) : { prescriptions: [] };
  
  // Defensive array mapping to prevent TypeError: Cannot read properties of undefined
  const prescriptions = currentSheet?.prescriptions || [];

  // Calculate dynamic stats
  const totalPrescribed = prescriptions.reduce((acc, curr) => acc + (curr?.hours?.length || 0), 0);
  const totalChecked = prescriptions.reduce(
    (acc, curr) => acc + (curr?.hours?.filter(h => h.status === 'checked')?.length || 0), 0
  );
  const totalDelayed = prescriptions.reduce(
    (acc, curr) => acc + (curr?.hours?.filter(h => h.status === 'delayed')?.length || 0), 0
  );
  const totalRefused = prescriptions.reduce(
    (acc, curr) => acc + (curr?.hours?.filter(h => h.status === 'refused')?.length || 0), 0
  );
  const totalPending = prescriptions.reduce(
    (acc, curr) => acc + (curr?.hours?.filter(h => h.status === 'pending')?.length || 0), 0
  );

  // Trigger administration or review details modal
  const handleHourClick = (prescriptionItem: PrescriptionItem, hourIdx: number, hourData: AprazamentoHour) => {
    if (hourData.status === 'checked' || hourData.status === 'refused') {
      setViewingCheckDetails({ prescriptionId: prescriptionItem.id, orderId: prescriptionItem.orderId, hourIdx, hourData, medName: prescriptionItem.medication, route: prescriptionItem.route, dosage: prescriptionItem.dosage });
      return;
    }
    setActiveCheckItem({ prescriptionId: prescriptionItem.id, orderId: prescriptionItem.orderId, hourIdx, hourData, medName: prescriptionItem.medication });
    // Reset form states
    setCheckAction('check');
    setJustification("");
    setVitals({ bp: "", hr: "", temp: "", glycemia: "" });
  };

  // Submit check (dar o visto / recusar)
  const submitCheck = () => {
    if (!activeCheckItem || !selectedPatient) return;
    const { prescriptionId, orderId, hourIdx } = activeCheckItem;
    
    let isContextPrescription = false;

    const updatedPrescriptions = prescriptions.map(p => {
      if (p.id === prescriptionId) {
        if (p.orderId) isContextPrescription = true;

        const updatedHours = [...(p.hours || [])];
        
        let finalDosage = p.dosage;
        if (p.medication.includes("Insulina") && vitals.glycemia) {
          const gVal = parseInt(vitals.glycemia);
          let ui = 0;
          if (isNaN(gVal) || gVal < 150) ui = 0;
          else if (gVal <= 200) ui = 2;
          else if (gVal <= 250) ui = 4;
          else if (gVal <= 300) ui = 6;
          else if (gVal <= 350) ui = 8;
          else ui = 10;
          finalDosage = `${ui} UI (Calculado da Glicemia: ${gVal} mg/dL)`;
        }

        updatedHours[hourIdx] = {
          ...updatedHours[hourIdx],
          status: checkAction === 'check' ? 'checked' : 'refused',
          checkedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          nurseName: coSignatureSuccess ? `${nurseName} (Dupla Checagem: ${coSigningNurse})` : nurseName,
          vitalSigns: (vitals.bp || vitals.hr || vitals.temp || vitals.glycemia) ? { ...vitals } : undefined,
          justification: justification.trim() ? justification : undefined
        };
        
        // Se for prescrição via contexto, atualiza direto no contexto
        if (orderId) {
          updateMedicationHours(orderId, prescriptionId, updatedHours);
        }

        return { ...p, hours: updatedHours, dosage: finalDosage };
      }
      return p;
    });

    // Só salva localmente se for prescrição legada
    if (!isContextPrescription) {
      saveChecks({
        ...patientData,
        [selectedPatient.id]: {
          ...currentSheet,
          prescriptions: updatedPrescriptions
        }
      });
    }

    toast.success(checkAction === 'check' ? 'Medicação checada com sucesso!' : 'Medicação recusada.');
    setActiveCheckItem(null);
    setCoSignatureRequired(false);
    setCoSignatureSuccess(false);
  };

  // Revert check (Undo administration / set bubble back to pending)
  const handleUndoCheck = () => {
    if (!viewingCheckDetails || !selectedPatient) return;
    const { prescriptionId, orderId, hourIdx } = viewingCheckDetails;

    const updatedPrescriptions = prescriptions.map(p => {
      if (p.id === prescriptionId) {
        const updatedHours = [...(p.hours || [])];
        updatedHours[hourIdx] = {
          hour: updatedHours[hourIdx].hour,
          status: 'pending' // Set back to pending
        };
        
        if (orderId) {
          updateMedicationHours(orderId, prescriptionId, updatedHours);
        }
        
        return { ...p, hours: updatedHours };
      }
      return p;
    });

    if (!orderId) {
      const updatedData = {
        ...patientData,
        [selectedPatient.id]: { prescriptions: updatedPrescriptions }
      };
      saveChecks(updatedData);
    }

    toast.success(`Administração de ${viewingCheckDetails.medName} revertida com sucesso.`);
    setViewingCheckDetails(null);
  };

  /* ─── Occurrences Submission ─── */
  const handleReportOccurrence = () => {
    if (!selectedPatient) return;
    const newOcc: OccurrenceItem = {
      id: `occ-${Date.now()}`,
      patientId: selectedPatient.id,
      category: newOccurrence.category,
      reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      nurseName,
      observation: newOccurrence.observation || "Nenhuma observação informada."
    };
    saveOccurrences([newOcc, ...occurrences]);
    toast.warning(`Ocorrência de ${newOccurrence.category} reportada no leito de ${selectedPatient.name}!`);
    setShowOccurrenceLogger(false);
    setNewOccurrence({ category: "Dor Intensa", observation: "" });
  };

  // Suspend dynamic prescription (remove from list)
  const handleSuspendPrescription = (prescriptionId?: string) => {
    const targetId = prescriptionId || viewingPrescription?.id;
    if (!targetId || !selectedPatient) return;

    const targetPresc = prescriptions.find(p => p.id === targetId);

    const updatedPrescriptions = prescriptions.filter(p => p.id !== targetId);
    
    if (targetPresc?.orderId) {
       // Ideally we suspend in context, but for simplicity let's just update hours to 'refused' or suspended status
       // Actually `updateMedicationStatus` can suspend the whole med
       // Assuming we have that in usePrescriptions? Oh, updateMedicationStatus exists!
       toast.error("Suspensão de medicamento do contexto não está implementada nesta view, precisa de permissão médica.");
    } else {
       const updatedData = {
         ...patientData,
         [selectedPatient.id]: { prescriptions: updatedPrescriptions }
       };
       saveChecks(updatedData);
       toast.warning(`Prescrição suspensa e removida.`);
    }

    setViewingPrescription(null);
  };

  // Add dynamic SOS extra dose to prescription
  const handleAddExtraDose = (prescriptionId?: string) => {
    const targetId = prescriptionId || viewingPrescription?.id;
    if (!targetId || !selectedPatient) return;

    const currentHourStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let isContextPrescription = false;
    let targetOrder: string | undefined;

    const updatedPrescriptions = prescriptions.map(p => {
      if (p.id === targetId) {
        if (p.orderId) {
          isContextPrescription = true;
          targetOrder = p.orderId;
        }
        const updatedHours = [...(p.hours || [])];
        updatedHours.push({
          hour: currentHourStr,
          status: 'pending'
        });
        // Sort chronologically
        updatedHours.sort((a, b) => a.hour.localeCompare(b.hour));
        
        if (targetOrder) {
          updateMedicationHours(targetOrder, targetId, updatedHours);
        }
        return { ...p, hours: updatedHours };
      }
      return p;
    });

    if (!isContextPrescription) {
      const updatedData = {
        ...patientData,
        [selectedPatient.id]: { prescriptions: updatedPrescriptions }
      };
      saveChecks(updatedData);
    }

    toast.success(`Dose extra programada para às ${currentHourStr}!`);
    setViewingPrescription(null);
  };

  // Generate hours array dynamically based on start hour and frequency
  const calculateHours = (startHour: string, frequency: string): string[] => {
    const hours: string[] = [];
    const [startH, startM] = startHour.split(":").map(Number);
    let interval = 6;
    
    if (frequency === "4/4h") interval = 4;
    else if (frequency === "6/6h") interval = 6;
    else if (frequency === "8/8h") interval = 8;
    else if (frequency === "12/12h") interval = 12;
    else if (frequency === "Contínuo" || frequency === "Dose única") return [startHour];

    for (let i = 0; i < 24; i += interval) {
      const nextH = (startH + i) % 24;
      hours.push(`${String(nextH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`);
    }
    
    return hours.sort();
  };

  // Add prescription dynamically (Simulação de Aprazamento)
  const addPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    const { medication, dosage, route, frequency, startHour } = wizardData;
    if (!medication || !dosage) {
      toast.error("Por favor, preencha a medicação e a dosagem.");
      return;
    }

    // Check allergy!
    const isAllergic = selectedPatient.allergies?.toLowerCase().includes(medication.toLowerCase());
    if (isAllergic) {
      setAllergyAlert({ med: medication, patientName: selectedPatient.name });
      return;
    }

    executePrescriptionSave();
  };

  const executePrescriptionSave = () => {
    if (!selectedPatient) return;
    const { medication, dosage, route, frequency, startHour } = wizardData;

    const scheduledHours = calculateHours(startHour, frequency);
    const newPrescription: PrescriptionItem = {
      id: `pr-${Date.now()}`,
      medication,
      dosage,
      route,
      frequency,
      hours: scheduledHours.map(h => ({ hour: h, status: 'pending' }))
    };

    const updatedPrescriptions = [...prescriptions, newPrescription];
    const updatedData = {
      ...patientData,
      [selectedPatient.id]: { prescriptions: updatedPrescriptions }
    };
    saveChecks(updatedData);

    toast.success(`Nova prescrição de ${medication} gerada e aprazada!`);
    setShowWizard(false);
    setAllergyAlert(null);
    setWizardData({ medication: "", dosage: "", route: "EV", frequency: "6/6h", startHour: "08:00" });
  };

  // Reset check data for current patient
  const resetPatientChecks = () => {
    if (!selectedPatient) return;
    const updatedData = { ...patientData };
    delete updatedData[selectedPatient.id];
    saveChecks(updatedData);
    toast.info("Dados de checagem reiniciados para este paciente.");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Syringe className="h-5 w-5 animate-pulse" />
            </div>
            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-rose-500 border-rose-500/20">
              Beira do Leito
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mission-control-title">Checagem de Enfermagem</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Aprazamento eletrônico e controle de segurança de medicações aplicadas.
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => setShowWizard(true)} 
            className="gap-2 h-12 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-500/15 bg-rose-600 hover:bg-rose-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Simular Aprazamento
          </Button>
          <Button 
            onClick={resetPatientChecks} 
            variant="outline" 
            className="gap-2 h-12 px-4 rounded-2xl border-white/20 dark:border-white/10 text-muted-foreground hover:text-foreground"
            title="Reiniciar checagens do paciente atual"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { title: "Aprazamentos Hoje", icon: Clock, value: totalPrescribed, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Medicações Aplicadas", icon: CheckCircle2, value: totalChecked, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { title: "Checagens Pendentes", icon: Sparkles, value: totalPending, color: "text-slate-400", bg: "bg-slate-400/10" },
          { title: "Sinais Pendentes", icon: Activity, value: selectedPatient?.triaged ? "0" : "5", color: "text-purple-500", bg: "bg-purple-500/10" },
          { title: "Atrasadas / Alertas", icon: AlertTriangle, value: totalDelayed, color: totalDelayed > 0 ? "text-amber-500" : "text-muted-foreground/40", bg: totalDelayed > 0 ? "bg-amber-500/10 animate-pulse" : "bg-muted/5" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 glass-card-premium border-white/40 dark:border-white/10 shadow-lg relative overflow-hidden flex flex-col justify-between h-28 group hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-tight">{stat.title}</span>
              <div className={`h-8 w-8 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-black tracking-tighter mt-2">{stat.value}</div>
          </Card>
        ))}
      </div>

      {/* MAIN CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PATIENT LIST (COL-SPAN-4) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="glass-card-premium border-white/40 dark:border-white/10 shadow-xl overflow-hidden rounded-xl">
            <CardHeader className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-border/50 py-5 px-6">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    <CardTitle className="text-sm font-black uppercase tracking-widest">Pacientes na Assistência</CardTitle>
                  </div>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-wider mt-1">Diretório ativo na rede beira-leito</CardDescription>
                </div>
                
                <Select value={filterSector} onValueChange={setFilterSector}>
                  <SelectTrigger className="h-10 border-border/50 bg-background shadow-sm rounded-xl text-xs font-bold w-full uppercase tracking-widest">
                    <SelectValue placeholder="FILTRAR POR SETOR" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="font-bold text-xs">TODOS OS SETORES</SelectItem>
                    <SelectItem value="Emergência" className="font-bold text-xs">EMERGÊNCIA</SelectItem>
                    <SelectItem value="Amarela" className="font-bold text-xs">OBS. AMARELA</SelectItem>
                    <SelectItem value="Verde" className="font-bold text-xs">OBS. VERDE</SelectItem>
                    <SelectItem value="Sala de Medicação" className="font-bold text-xs">SALA DE MEDICAÇÃO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {activePatients.map(p => {
                const isSelected = p.id === selectedPatient?.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={cn(
                      "p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between border group",
                      isSelected
                        ? "bg-rose-500/10 border-rose-500/30 shadow-md scale-[1.01]"
                        : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "h-10 w-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-inner border border-white/10",
                        isSelected ? "ring-2 ring-rose-500 bg-rose-500/10" : "bg-muted"
                      )}>
                        <img 
                          src={getPatientAvatar(p.name, p.gender, p.age)} 
                          alt={p.name} 
                          className="h-full w-full object-cover transition-transform group-hover:scale-105" 
                          onError={(e) => {
                            e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.name}`;
                          }}
                        />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-black uppercase leading-tight truncate">{p.name}</p>
                        <p className="text-[9px] font-bold text-muted-foreground mt-1 uppercase tracking-wider truncate">
                          {p.computedSector} • {p.computedRoom}
                        </p>
                      </div>
                    </div>
                    
                    {p.allergies && (
                      <Badge 
                        variant="outline" 
                        className="bg-red-500/10 text-red-500 border-red-500/20 text-[8px] font-black uppercase tracking-wider py-0.5 px-2 animate-pulse shrink-0 ml-2"
                      >
                        Alergia
                      </Badge>
                    )}
                  </div>
                );
              })}
              {activePatients.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <User className="h-10 w-10 mx-auto mb-2 opacity-25 animate-bounce" />
                  <p className="text-xs">Nenhum paciente ativo no momento.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {selectedPatient ? (
            <Card className="glass-card-premium border-white/40 dark:border-white/10 shadow-xl overflow-hidden rounded-xl">
              
              {/* SELECTED PATIENT SUMMARY */}
              <div className="p-6 bg-gradient-to-r from-rose-600/90 to-red-500/80 backdrop-blur-xl border-b border-white/20 dark:border-white/5 text-white relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white/30 shadow-lg">
                    <img 
                      src={getPatientAvatar(selectedPatient.name, selectedPatient.gender, selectedPatient.age)} 
                      alt={selectedPatient.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedPatient.name}`;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-white/20 border-none text-white text-[9px] font-black uppercase tracking-widest">
                        {selectedPatient.computedSector} • {selectedPatient.computedRoom}
                      </Badge>
                      {selectedPatient.risk === 'emergency' && (
                        <Badge className="bg-red-900 border-none text-white text-[9px] font-black uppercase tracking-widest animate-bounce">
                          Emergência
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">{selectedPatient.name}</h2>
                    <p className="text-xs text-rose-100 font-bold mt-1 uppercase tracking-wider">
                      Idade: {selectedPatient.age} anos • CPF: {selectedPatient.cpf}
                    </p>
                  </div>
                  
                  {/* Allergy Warning Plate */}
                  {selectedPatient.allergies && (
                    <div className="bg-red-950/40 border border-red-500/30 p-3 rounded-2xl flex items-center gap-3 backdrop-blur-sm shadow-lg max-w-xs animate-pulse">
                      <AlertOctagon className="h-6 w-6 text-red-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-red-300">ALERGIA DETECTADA!</p>
                        <p className="text-xs font-bold text-white uppercase mt-0.5">{selectedPatient.allergies}</p>
                      </div>
                    </div>
                  )}

                  {/* Occurrence & Pharmacy buttons */}
                  <div className="flex flex-col gap-2 shrink-0 relative z-20">
                    <Button
                      type="button"
                      onClick={() => setShowPharmacyModal(true)}
                      className="bg-sky-500/20 hover:bg-sky-500/30 text-sky-100 rounded-2xl h-10 px-4 font-black uppercase tracking-wider text-[10px] border border-sky-400/30 backdrop-blur-sm transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)]"
                    >
                      <PackagePlus className="h-4 w-4" />
                      Solicitar Insumo (Farm. Satélite)
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowOccurrenceLogger(true)}
                      className="bg-white/10 hover:bg-white/20 text-white rounded-2xl h-10 px-4 font-black uppercase tracking-wider text-[10px] border border-white/20 backdrop-blur-sm transition-all flex items-center gap-1.5"
                    >
                      <AlertOctagon className="h-4 w-4" />
                      Reportar Ocorrência
                    </Button>
                  </div>
                </div>
              </div>

              {/* PRESCRIPTION LIST */}
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-rose-600" />
                    <span className="text-xs font-black uppercase tracking-wider">Prontuário de Aprazamentos Vigente</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground border-border">
                    {prescriptions.length} Prescrições Ativas
                  </Badge>
                </div>

                <div className="space-y-4">
                  {prescriptions.map(p => {
                    const hasAllergyConflict = selectedPatient.allergies?.toLowerCase().includes(p.medication.toLowerCase());
                    return (
                      <div 
                        key={p.id} 
                        className={cn(
                          "p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6",
                          hasAllergyConflict && "border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
                        )}
                      >
                        {/* Interactive Medication Row details button click */}
                        <div 
                          onClick={() => setViewingPrescription({ ...p, hasAllergyConflict })}
                          className="space-y-2 max-w-xs cursor-pointer hover:bg-white/5 p-3 rounded-2xl transition-all border border-transparent hover:border-white/10 group/med"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black uppercase tracking-tight leading-none text-foreground group-hover/med:text-rose-500 transition-colors flex items-center gap-1">
                              {p.medication}
                              <Info className="h-3 w-3 opacity-30 group-hover/med:opacity-100 transition-opacity" />
                            </span>
                            <Badge className="bg-rose-500/20 text-rose-600 dark:text-rose-400 border-none font-bold text-[8px] uppercase tracking-wider h-5 px-2">
                              {p.route}
                            </Badge>
                          </div>
                          
                          <div className="text-xs font-bold text-muted-foreground flex flex-col gap-0.5">
                            <span>Dosagem: {p.dosage}</span>
                            <span>Frequência: {p.frequency}</span>
                          </div>

                          {hasAllergyConflict && (
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-red-500 uppercase tracking-widest mt-2">
                              <AlertTriangle className="h-3.5 w-3.5 animate-bounce" />
                              Risco de Choque Alérgico!
                            </div>
                          )}
                        </div>

                        {/* APRAZAMENTO HOUR TIMELINE GRID */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          {p.hours?.map((h, hourIdx) => {
                            // Check if current hour bubble is delayed
                            const isDelayed = h.status === 'delayed';
                            const isChecked = h.status === 'checked';
                            const isRefused = h.status === 'refused';
                            const isPending = h.status === 'pending';

                            return (
                              <div
                                key={hourIdx}
                                onClick={() => handleHourClick(p, hourIdx, h)}
                                className={cn(
                                  "h-12 w-12 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border group relative shadow-inner select-none",
                                  isChecked && "bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 scale-[0.98] hover:bg-emerald-500/30",
                                  isRefused && "bg-red-500/20 border-red-500/40 text-red-500 scale-[0.98] hover:bg-red-500/30",
                                  isDelayed && "bg-amber-500/25 border-amber-500/50 text-amber-600 dark:text-amber-400 animate-pulse hover:scale-105",
                                  isPending && "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-rose-500/30 hover:text-rose-500 hover:scale-105"
                                )}
                              >
                                <span className="text-[9px] font-black tracking-tight">{h.hour}</span>
                                
                                <div className="mt-0.5">
                                  {isChecked && <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
                                  {isRefused && <X className="h-3 w-3 text-red-500" />}
                                  {isDelayed && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                                  {isPending && <Clock className="h-3 w-3 text-muted-foreground/40 group-hover:text-rose-500/60" />}
                                </div>

                                {/* Custom HTML hover tooltip for details */}
                                {(isChecked || isRefused) && (
                                  <div className="absolute z-30 bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-xl p-3 text-[10px] w-48 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all border border-white/10 flex flex-col gap-1">
                                    <p className="font-black uppercase tracking-wider text-rose-400">{isChecked ? "ADMINISTRADO" : "RECUSADO/NÃO ADM"}</p>
                                    <p className="opacity-80">Por: {h.nurseName}</p>
                                    <p className="opacity-80">Em: {h.checkedAt}</p>
                                    {h.vitalSigns?.glycemia && <p className="text-emerald-400 font-bold">Glicemia: {h.vitalSigns.glycemia} mg/dL</p>}
                                    {h.vitalSigns?.bp && <p className="text-blue-400 font-bold">PA: {h.vitalSigns.bp} mmHg</p>}
                                    {h.justification && <p className="text-red-400 font-medium leading-relaxed italic">" {h.justification} "</p>}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-white/10" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  
                  {prescriptions.length === 0 && (
                    <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl text-center text-muted-foreground flex flex-col items-center">
                      <Syringe className="h-12 w-12 opacity-20 mb-3" />
                      <p className="font-bold text-sm">Nenhuma medicação aprazada para este paciente.</p>
                      <p className="text-xs opacity-75 mt-1">Utilize o botão superior para simular aprazamentos e gerar os horários.</p>
                    </div>
                  )}

                  {/* Bedside Occurrence Log Feed */}
                  <div className="pt-6 border-t border-border/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertOctagon className="h-5 w-5 text-amber-500" />
                        <span className="text-xs font-black uppercase tracking-wider">Feed de Ocorrências Clínicas Beira-Leito</span>
                      </div>
                      <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold text-[9px] uppercase tracking-widest">
                        {occurrences.filter(o => o.patientId === selectedPatient.id).length} Ocorrências
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {occurrences.filter(o => o.patientId === selectedPatient.id).map(o => (
                        <div key={o.id} className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-1.5 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                              ⚠️ {o.category}
                            </span>
                            <span className="text-[9px] text-muted-foreground font-mono font-bold">
                              {o.reportedAt}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-foreground/95 leading-relaxed">
                            {o.observation}
                          </p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            Reportado por: {o.nurseName}
                          </p>
                        </div>
                      ))}

                      {occurrences.filter(o => o.patientId === selectedPatient.id).length === 0 && (
                        <p className="text-center py-6 text-xs text-muted-foreground font-medium bg-muted/25 rounded-2xl border border-dashed border-border/55">
                          Sem intercorrências registradas neste leito para o plantão atual.
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 border-2 border-dashed rounded-3xl text-center text-muted-foreground flex flex-col items-center justify-center min-h-[400px] glass-card">
              <User className="h-16 w-16 opacity-10 mb-4" />
              <h3 className="text-xl font-bold tracking-tight">Nenhum Paciente Selecionado</h3>
              <p className="text-sm max-w-sm mt-2">Selecione um paciente ativo da lista lateral para ver sua ficha clínica de checagem beira-leito.</p>
            </Card>
          )}
        </div>
      </div>

      {/* INTERACTIVE APRAZAMENTO SIMULATOR WIZARD MODAL */}
      <AnimatePresence>
        {showWizard && (
          <>
            <div 
              className="fixed inset-0 z-50 bg-slate-900/15 dark:bg-black/55 backdrop-blur-[5px]" 
              onClick={() => setShowWizard(false)} 
            />
            <motion.div 
              drag
              dragMomentum={false}
              dragElastic={0}
              dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
              whileDrag={{ cursor: "grabbing" }}
              style={{ x: "-50%", y: "-50%", touchAction: "none", transitionProperty: "none" }}
              initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
              className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white/95 dark:bg-slate-950/95 border border-slate-200/50 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              <form onSubmit={addPrescription}>
                <div className="p-8 bg-gradient-to-br from-rose-500 to-rose-600 dark:from-rose-600/90 dark:to-rose-700/90 text-white relative border-b border-rose-450 dark:border-rose-950/20">
                  <button 
                    type="button" 
                    onClick={() => setShowWizard(false)}
                    className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest">
                      Prescrição & Aprazamento
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">Prescrever Nova Medicação</h3>
                  <p className="text-xs text-rose-100 font-bold mt-1 uppercase tracking-wider">
                    Gerador automático de horários para a beira do leito
                  </p>
                </div>

                <div className="p-8 space-y-6">
                  {/* MEDICATION NAME */}
                  <div className="space-y-2">
                    <Label htmlFor="medication" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">
                      Medicação Comercial / Princípio Ativo <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="medication"
                      value={wizardData.medication}
                      onChange={e => setWizardData(prev => ({ ...prev, medication: e.target.value }))}
                      placeholder="Ex: Ceftriaxona, Dipirona, Plasil, Insulina Regular"
                      className="h-11 border-primary/20 font-bold uppercase"
                      required
                    />
                  </div>

                  {/* DOSAGE */}
                  <div className="space-y-2">
                    <Label htmlFor="dosage" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">
                      Dosagem / Concentração <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="dosage"
                      value={wizardData.dosage}
                      onChange={e => setWizardData(prev => ({ ...prev, dosage: e.target.value }))}
                      placeholder="Ex: 1g, 500mg, 1 ampola, 10 UI"
                      className="h-11 border-primary/20"
                      required
                    />
                  </div>

                  {/* ROUTE & FREQUENCY */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Via</Label>
                      <Select value={wizardData.route} onValueChange={v => setWizardData(prev => ({ ...prev, route: v }))}>
                        <SelectTrigger className="h-11 border-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EV">Via Endovenosa (EV)</SelectItem>
                          <SelectItem value="IM">Via Intramuscular (IM)</SelectItem>
                          <SelectItem value="SC">Via Subcutânea (SC)</SelectItem>
                          <SelectItem value="VO">Via Oral (VO)</SelectItem>
                          <SelectItem value="Inalatória">Via Inalatória</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Frequência</Label>
                      <Select value={wizardData.frequency} onValueChange={v => setWizardData(prev => ({ ...prev, frequency: v }))}>
                        <SelectTrigger className="h-11 border-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4/4h">A cada 4 horas (4/4h)</SelectItem>
                          <SelectItem value="6/6h">A cada 6 horas (6/6h)</SelectItem>
                          <SelectItem value="8/8h">A cada 8 horas (8/8h)</SelectItem>
                          <SelectItem value="12/12h">A cada 12 horas (12/12h)</SelectItem>
                          <SelectItem value="Contínuo">Infundindo Contínuo</SelectItem>
                          <SelectItem value="Dose única">Dose única</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* START TIME */}
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">
                      Horário Inicial da Aplicação
                    </Label>
                    <Input 
                      type="time" 
                      id="startTime"
                      value={wizardData.startHour}
                      onChange={e => setWizardData(prev => ({ ...prev, startHour: e.target.value }))}
                      className="h-11 border-primary/20 text-center font-mono font-bold text-lg"
                    />
                  </div>

                  {/* WARNING ACTION */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-rose-500/20"
                  >
                    Gerar Aprazamento Automático
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ALLERGY INTERCEPT ALARM DIALOG */}
      <AnimatePresence>
        {allergyAlert && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.9, rotate: 2 }}
              className="w-full max-w-md overflow-hidden rounded-[2.5rem] border-4 border-red-500 bg-red-950/90 text-white shadow-2xl p-8 relative flex flex-col items-center text-center gap-6 backdrop-blur-md"
            >
              <div className="h-16 w-16 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-500 animate-bounce">
                <AlertOctagon className="h-8 w-8" />
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400">ALERTA CRÍTICO DE SEGURANÇA</p>
                <h3 className="text-2xl font-black uppercase tracking-tight">Risco de Choque Alérgico!</h3>
              </div>

              <p className="text-sm font-bold text-red-100 leading-relaxed max-w-sm">
                O paciente <span className="text-white underline">{allergyAlert.patientName}</span> possui alergia grave catalogada a <span className="text-white underline font-black">{allergyAlert.med}</span>!
              </p>

              <div className="bg-black/40 border border-red-500/20 p-4 rounded-2xl text-[10px] uppercase font-black tracking-widest text-red-300 w-full">
                Protocole de barreira à beira do leito bloqueado.
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <Button 
                  onClick={() => setAllergyAlert(null)}
                  variant="outline"
                  className="bg-transparent border-red-500/40 text-red-200 hover:bg-white/5 h-12 rounded-xl font-bold uppercase tracking-wider text-xs"
                >
                  Abortar
                </Button>
                <Button 
                  onClick={() => {
                    executePrescriptionSave();
                    setAllergyAlert(null);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white h-12 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg"
                >
                  Forçar Prescrição
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BEDSIDE NURSING CHECK VALIDATION MODAL */}
      <AnimatePresence>
        {activeCheckItem && (
          <>
            <div 
              className="fixed inset-0 z-50 bg-slate-900/15 dark:bg-black/55 backdrop-blur-[5px]" 
              onClick={() => setActiveCheckItem(null)} 
            />
            <motion.div 
              drag
              dragMomentum={false}
              dragElastic={0}
              dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
              whileDrag={{ cursor: "grabbing" }}
              style={{ x: "-50%", y: "-50%", touchAction: "none", transitionProperty: "none" }}
              initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
              className="fixed left-[50%] top-[50%] z-50 w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white/95 dark:bg-slate-950/95 border border-slate-200/50 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              <div className="p-8 bg-gradient-to-br from-rose-500 to-rose-600 dark:from-rose-600/90 dark:to-rose-700/90 text-white relative border-b border-rose-450 dark:border-rose-950/20">
                <button 
                  type="button" 
                  onClick={() => setActiveCheckItem(null)}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10 animate-pulse">
                    <Syringe className="h-5 w-5 text-white" />
                  </div>
                  <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest">
                    Validação Beira de Leito
                  </Badge>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight leading-none truncate text-white">{activeCheckItem.medName}</h3>
                <p className="text-xs text-rose-100 font-bold mt-2 uppercase tracking-wider">
                  Horário Aprazado: {activeCheckItem.hourData.hour}
                </p>
              </div>

              <div className="p-8 space-y-6">
                
                {/* SELECT ACTION TYPE */}
                <div className="grid grid-cols-2 gap-2 bg-muted/40 p-1.5 rounded-2xl border">
                  <button 
                    type="button"
                    onClick={() => setCheckAction('check')}
                    className={cn(
                      "py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all",
                      checkAction === 'check' ? "bg-white dark:bg-slate-900 shadow-md text-emerald-600 dark:text-emerald-400" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Check className="h-4 w-4" />
                    Dar Visto (Aplicar)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCheckAction('refuse')}
                    className={cn(
                      "py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all",
                      checkAction === 'refuse' ? "bg-white dark:bg-slate-900 shadow-md text-red-500" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <X className="h-4 w-4" />
                    Recusar / Pular
                  </button>
                </div>

                {/* BARCODE SCANNER SECURITY SECTION */}
                {checkAction === 'check' && (
                  <div className="p-4 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1.5 animate-pulse">
                        <QrCode className="h-4 w-4" />
                        Barreira de Segurança: Código de Barras
                      </span>
                      <Badge className={cn(
                        "border-none text-[8px] font-black uppercase tracking-widest px-2 h-5",
                        scannedPatient && scannedMed ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse"
                      )}>
                        {scannedPatient && scannedMed ? "✓ VALIDADO" : "⏳ AGUARDANDO BIPI"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className={cn(
                        "p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all select-none",
                        scannedPatient ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "bg-muted/40 border-border text-muted-foreground"
                      )}>
                        <span className="text-[8px] font-black uppercase tracking-widest">Pulseira Paciente</span>
                        <span className="text-[10px] font-bold">{scannedPatient ? "✓ BIPADO" : "PENDENTE"}</span>
                      </div>
                      <div className={cn(
                        "p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all select-none",
                        scannedMed ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" : "bg-muted/40 border-border text-muted-foreground"
                      )}>
                        <span className="text-[8px] font-black uppercase tracking-widest">Ampola / Frasco</span>
                        <span className="text-[10px] font-bold">{scannedMed ? "✓ BIPADO" : "PENDENTE"}</span>
                      </div>
                    </div>

                    <Button 
                      type="button"
                      onClick={() => {
                        setScanTarget({ medName: activeCheckItem.medName, patientName: selectedPatient.name });
                        setScannedPatient(false);
                        setScannedMed(false);
                        setShowScanner(true);
                      }}
                      className="w-full bg-amber-550 hover:bg-amber-600 text-white rounded-xl h-10 font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2"
                    >
                      <QrCode className="h-4 w-4" />
                      {scannedPatient && scannedMed ? "Refazer Leitura Beira-Leito" : "Iniciar Escaneamento HUD"}
                    </Button>
                  </div>
                )}

                {/* NURSING CO-SIGNATURE (DUPLA CHECAGEM) FOR HIGH ALERT MEDS */}
                {checkAction === 'check' && (activeCheckItem.medName.includes("Ceftriaxona") || activeCheckItem.medName.includes("Insulina") || activeCheckItem.medName.includes("Soro")) && (
                  <div className="p-4 rounded-3xl bg-purple-500/5 border border-purple-500/10 space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                        <UserCheck className="h-4 w-4" />
                        Co-Assinatura Obrigatória (Dupla Checagem)
                      </span>
                      <Badge className={cn(
                        "border-none text-[8px] font-black uppercase tracking-widest px-2 h-5",
                        coSignatureSuccess ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-purple-500/10 text-purple-600 dark:text-purple-400 animate-pulse"
                      )}>
                        {coSignatureSuccess ? "✓ LIBERADO" : "🔒 BLOQUEADO"}
                      </Badge>
                    </div>

                    {!coSignatureSuccess ? (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-[9px] font-bold text-muted-foreground">Selecionar Enfermeira Co-Responsável</Label>
                          <Select value={coSigningNurse} onValueChange={setCoSigningNurse}>
                            <SelectTrigger className="h-10 text-xs border-purple-200/50 dark:border-purple-950/20 bg-transparent">
                              <SelectValue placeholder="Selecione o profissional..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Enf. Amanda Lemos (COREN 44521)">Enf. Amanda Lemos (COREN 44521)</SelectItem>
                              <SelectItem value="Enf. Rodrigo Silva (COREN 12245)">Enf. Rodrigo Silva (COREN 12245)</SelectItem>
                              <SelectItem value="Enf. Juliana Lemos (COREN 88523)">Enf. Juliana Lemos (COREN 88523)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          disabled={!coSigningNurse}
                          onClick={() => {
                            playBeep();
                            setCoSignatureSuccess(true);
                            toast.success(`Co-assinatura efetuada por ${coSigningNurse}!`);
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10 font-bold uppercase tracking-wider text-[10px]"
                        >
                          Efetuar Co-Assinatura Beira-Leito
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-600 text-[10px] font-bold animate-in zoom-in duration-300">
                        <span>Co-assinado por: {coSigningNurse}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setCoSignatureSuccess(false);
                            setCoSigningNurse("");
                          }}
                          className="h-6 text-red-500 hover:bg-red-500/10 text-[9px] font-black uppercase"
                        >
                          Remover
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* RESPONSIBLE PROFESSIONAL */}
                <div className="space-y-2">
                  <Label htmlFor="nurseName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Profissional de Enfermagem Responsável
                  </Label>
                  <Input 
                    id="nurseName"
                    value={nurseName}
                    onChange={e => setNurseName(e.target.value)}
                    placeholder="Nome e COREN"
                    className="h-11 border-primary/20"
                  />
                </div>

                {/* DYNAMIC FORM VIEWS */}
                {checkAction === 'check' ? (
                  <div className="space-y-4 p-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                      <Activity className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Sinais Vitais Recomendados</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="bp" className="text-[9px] font-bold text-muted-foreground">Pressão Arterial (PA)</Label>
                        <Input 
                          id="bp" 
                          placeholder="Ex: 120/80" 
                          value={vitals.bp} 
                          onChange={e => setVitals(prev => ({ ...prev, bp: e.target.value }))}
                          className="h-9 font-bold text-xs" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="hr" className="text-[9px] font-bold text-muted-foreground">Freq. Cardíaca (FC)</Label>
                        <Input 
                          id="hr" 
                          placeholder="Ex: 78 bpm" 
                          value={vitals.hr} 
                          onChange={e => setVitals(prev => ({ ...prev, hr: e.target.value }))}
                          className="h-9 font-bold text-xs" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="temp" className="text-[9px] font-bold text-muted-foreground">Temperatura (Temp)</Label>
                        <Input 
                          id="temp" 
                          placeholder="Ex: 36.5 ºC" 
                          value={vitals.temp} 
                          onChange={e => setVitals(prev => ({ ...prev, temp: e.target.value }))}
                          className="h-9 font-bold text-xs" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="glycemia" className="text-[9px] font-bold text-muted-foreground">Glicemia Capilar</Label>
                        <Input 
                          id="glycemia" 
                          placeholder="Ex: 140 mg/dL" 
                          value={vitals.glycemia} 
                          onChange={e => setVitals(prev => ({ ...prev, glycemia: e.target.value }))}
                          className="h-9 font-bold text-xs" 
                        />
                      </div>
                    </div>

                    {activeCheckItem.medName.includes("Insulina") && vitals.glycemia && (
                      (() => {
                        const gVal = parseInt(vitals.glycemia);
                        let ui = 0;
                        if (isNaN(gVal) || gVal < 150) ui = 0;
                        else if (gVal <= 200) ui = 2;
                        else if (gVal <= 250) ui = 4;
                        else if (gVal <= 300) ui = 6;
                        else if (gVal <= 350) ui = 8;
                        else ui = 10;

                        return (
                          <div className={cn(
                            "mt-3 p-3 rounded-2xl border flex flex-col gap-1 text-[10px] font-black uppercase tracking-widest text-center transition-all animate-in zoom-in duration-300",
                            ui > 0 ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          )}>
                            <span>Calculadora de Protocolo Móvel de Glicemia</span>
                            <span className="text-xs font-black">
                              Dosagem Recomendada: {ui} UI {ui >= 10 && "⚠️ (AVISAR MÉDICO DO SETOR)"}
                            </span>
                          </div>
                        );
                      })()
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <Label htmlFor="justification" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">
                      Justificativa Clínico-Administrativa <span className="text-red-500">*</span>
                    </Label>
                    <Select value={justification} onValueChange={setJustification}>
                      <SelectTrigger className="h-11 border-primary/20 text-xs">
                        <SelectValue placeholder="Selecione o motivo..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paciente recusou a medicação">Paciente recusou a medicação</SelectItem>
                        <SelectItem value="Paciente dormindo">Paciente dormindo</SelectItem>
                        <SelectItem value="Medicação indisponível na farmácia">Medicação indisponível na farmácia</SelectItem>
                        <SelectItem value="Acesso venoso perdido - pendente novo acesso">Acesso venoso perdido</SelectItem>
                        <SelectItem value="Paciente em jejum para exames">Paciente em jejum para exames</SelectItem>
                        <SelectItem value="Suspenso sob conduta médica">Suspenso sob conduta médica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* ACTION SUBMIT */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveCheckItem(null)}
                    className="h-12 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Fechar
                  </Button>
                  <Button 
                    type="button" 
                    onClick={submitCheck}
                    disabled={
                      (checkAction === 'refuse' && !justification) ||
                      (checkAction === 'check' && (
                        (!scannedPatient || !scannedMed) ||
                        ((activeCheckItem.medName.includes("Ceftriaxona") || activeCheckItem.medName.includes("Insulina") || activeCheckItem.medName.includes("Soro")) && !coSignatureSuccess)
                      ))
                    }
                    className={cn(
                      "h-12 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg text-white",
                      checkAction === 'check' 
                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10 disabled:opacity-50" 
                        : "bg-red-600 hover:bg-red-700 shadow-red-500/10"
                    )}
                  >
                    Confirmar Checagem
                  </Button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* VIEWING CHECKED BUBBLE DETAILS & REVERT ACTION MODAL */}
      <AnimatePresence>
        {viewingCheckDetails && (
          <>
            <div 
              className="fixed inset-0 z-50 bg-slate-900/15 dark:bg-black/55 backdrop-blur-[5px]" 
              onClick={() => setViewingCheckDetails(null)} 
            />
            <motion.div 
              drag
              dragMomentum={false}
              dragElastic={0}
              dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
              whileDrag={{ cursor: "grabbing" }}
              style={{ x: "-50%", y: "-50%", touchAction: "none", transitionProperty: "none" }}
              initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
              className="fixed left-[50%] top-[50%] z-50 w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white/95 dark:bg-slate-950/95 border border-slate-200/50 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              <div className={cn(
                "p-8 text-white relative border-b",
                viewingCheckDetails.hourData.status === 'checked' 
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600/90 dark:to-emerald-700/90 border-emerald-450 dark:border-emerald-950/20" 
                  : "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600/90 dark:to-red-700/90 border-red-500 dark:border-red-950/20"
              )}>
                <button 
                  type="button" 
                  onClick={() => setViewingCheckDetails(null)}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest">
                    Histórico do Aprazamento
                  </Badge>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight truncate leading-none mb-1 text-white">{viewingCheckDetails.medName}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-white/20 border-none text-white text-[9px] font-black uppercase tracking-wider py-0.5 px-2">
                    {viewingCheckDetails.dosage} {viewingCheckDetails.route}
                  </Badge>
                  <span className="text-xs font-bold text-white/90">Horário Aprazado: {viewingCheckDetails.hourData.hour}</span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                
                {/* STATUS CARD */}
                <div className={cn(
                  "p-4 rounded-2xl border flex items-center gap-3",
                  viewingCheckDetails.hourData.status === 'checked' 
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                    : "bg-red-500/5 border-red-500/20 text-red-500"
                )}>
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shadow-inner",
                    viewingCheckDetails.hourData.status === 'checked' ? "bg-emerald-500/25" : "bg-red-500/25"
                  )}>
                    {viewingCheckDetails.hourData.status === 'checked' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">STATUS DA DOSE</p>
                    <p className="text-sm font-black uppercase tracking-tight mt-1">
                      {viewingCheckDetails.hourData.status === 'checked' ? "ADMINISTRADO" : "RECUSADO / SUSPENSO"}
                    </p>
                  </div>
                </div>

                {/* DETAILS METRICS */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/40 rounded-xl">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-0.5">Profissional</span>
                      <span className="text-xs font-bold text-foreground leading-tight block">{viewingCheckDetails.hourData.nurseName}</span>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-xl">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-0.5">Data/Hora Real</span>
                      <span className="text-xs font-mono font-bold text-foreground block">{viewingCheckDetails.hourData.checkedAt}</span>
                    </div>
                  </div>

                  {/* Vitals or Justification */}
                  {viewingCheckDetails.hourData.status === 'checked' ? (
                    viewingCheckDetails.hourData.vitalSigns && (
                      <div className="p-4 rounded-2xl bg-muted/40 border space-y-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Parâmetros de Controle Coletados</span>
                        <div className="grid grid-cols-2 gap-3">
                          {viewingCheckDetails.hourData.vitalSigns.bp && (
                            <div className="text-xs">
                              <span className="text-muted-foreground mr-1">P.A:</span>
                              <span className="font-black text-foreground">{viewingCheckDetails.hourData.vitalSigns.bp} mmHg</span>
                            </div>
                          )}
                          {viewingCheckDetails.hourData.vitalSigns.hr && (
                            <div className="text-xs">
                              <span className="text-muted-foreground mr-1">F.C:</span>
                              <span className="font-black text-foreground">{viewingCheckDetails.hourData.vitalSigns.hr} bpm</span>
                            </div>
                          )}
                          {viewingCheckDetails.hourData.vitalSigns.temp && (
                            <div className="text-xs">
                              <span className="text-muted-foreground mr-1">Temp:</span>
                              <span className="font-black text-foreground">{viewingCheckDetails.hourData.vitalSigns.temp} ºC</span>
                            </div>
                          )}
                          {viewingCheckDetails.hourData.vitalSigns.glycemia && (
                            <div className="text-xs">
                              <span className="text-muted-foreground mr-1">Glicemia:</span>
                              <span className="font-black text-emerald-600 dark:text-emerald-400">{viewingCheckDetails.hourData.vitalSigns.glycemia} mg/dL</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    viewingCheckDetails.hourData.justification && (
                      <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-red-500 block">Motivo do Não Aprazamento</span>
                        <p className="text-xs font-bold text-foreground italic leading-relaxed">
                          " {viewingCheckDetails.hourData.justification} "
                        </p>
                      </div>
                    )
                  )}
                </div>

                {/* MODAL ACTIONS AND UNDO BUTTON */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setViewingCheckDetails(null)}
                    className="h-12 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleUndoCheck}
                    className="bg-transparent hover:bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:border-amber-500/50 h-12 rounded-xl text-xs font-black uppercase tracking-widest gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reverter Visto
                  </Button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* VIEWING MEDICATION DETAILS & ACTIONS SHEET MODAL */}
      <AnimatePresence>
        {viewingPrescription && (
          <>
            <div 
              className="fixed inset-0 z-50 bg-slate-900/15 dark:bg-black/55 backdrop-blur-[5px]" 
              onClick={() => setViewingPrescription(null)} 
            />
            <motion.div 
              drag
              dragMomentum={false}
              dragElastic={0}
              dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
              whileDrag={{ cursor: "grabbing" }}
              style={{ x: "-50%", y: "-50%", touchAction: "none", transitionProperty: "none" }}
              initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
              className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white/95 dark:bg-slate-950/95 border border-slate-200/50 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-foreground dark:text-white relative border-b border-slate-200 dark:border-white/10">
                <button 
                  type="button" 
                  onClick={() => setViewingPrescription(null)}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-slate-200/50 dark:bg-white/10 hover:bg-slate-300/50 dark:hover:bg-white/20 text-slate-800 dark:text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-slate-300 dark:border-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 dark:bg-white/10 flex items-center justify-center backdrop-blur-sm border border-primary/20 dark:border-white/5">
                    <FileText className="h-5 w-5 text-primary dark:text-white" />
                  </div>
                  <Badge className="bg-primary/15 dark:bg-white/10 text-primary dark:text-white border-none uppercase text-[9px] font-black tracking-widest">
                    Prontuário de Prescrição
                  </Badge>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight truncate leading-none mb-1 text-foreground dark:text-white">{viewingPrescription.medication}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border-none font-bold text-[8px] uppercase tracking-wider h-5 px-2">
                    {viewingPrescription.route}
                  </Badge>
                  <span className="text-xs font-bold text-muted-foreground dark:text-slate-300">Dosagem: {viewingPrescription.dosage} • Frequência: {viewingPrescription.frequency}</span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                
                {/* CLINICAL NOTE CARD */}
                <div className="p-4 rounded-2xl bg-muted/40 border space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Stethoscope className="h-3.5 w-3.5 text-primary" />
                    Orientações e Diretrizes Clínicas
                  </span>
                  <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                    Prescrito por **Dr. Ricardo Braga (CRM 12345)** às {formatArrivalTime(selectedPatient?.arrivalTime)}. 
                    Diluir em Soro Fisiológico se aplicável, e correr conforme orientações. Em caso de Insulinas, monitorar glicemia capilar e reportar taxas extremas.
                  </p>
                </div>

                {/* SCHEDULED HOURS RESUME */}
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Cronograma de Horários de Hoje</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {viewingPrescription.hours?.map((h, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "p-2.5 rounded-xl border flex items-center justify-between text-[10px] font-bold",
                          h.status === 'checked' ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                          h.status === 'refused' ? "bg-red-500/5 border-red-500/20 text-red-500" :
                          h.status === 'delayed' ? "bg-amber-500/5 border-amber-500/20 text-amber-600" :
                          "bg-muted/30 border-border/50 text-muted-foreground"
                        )}
                      >
                        <span className="font-mono">{h.hour}</span>
                        <span className="uppercase text-[8px] font-black shrink-0 ml-1.5">
                          {h.status === 'checked' ? "Ok" :
                           h.status === 'refused' ? "X" :
                           h.status === 'delayed' ? "Atr" : "Pend"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INFINITE DROP INFUSION PUMP CONTROLS */}
                {(viewingPrescription.frequency === "Contínuo" || viewingPrescription.medication.includes("Soro")) && (
                  (() => {
                    const settings = pumpSettings[viewingPrescription.id] || { velocity: 80, vtbi: 500, infused: 120, status: "stopped" };
                    
                    const handleUpdatePump = (updates: Partial<PumpSettings>) => {
                      const updated = {
                        ...pumpSettings,
                        [viewingPrescription.id]: { ...settings, ...updates }
                      };
                      savePumpSettings(updated);
                      toast.success(`Configuração da Bomba de Infusão atualizada!`);
                    };

                    return (
                      <div className="p-5 rounded-[2rem] bg-slate-900 border border-white/10 text-white space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Bomba de Infusão Beira-Leito</span>
                          </div>
                          <Badge className={cn(
                            "border-none text-[8px] font-black uppercase tracking-widest px-2 h-5",
                            settings.status === 'running' ? "bg-emerald-500/20 text-emerald-400" :
                            settings.status === 'paused' ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                          )}>
                            {settings.status === 'running' ? "Em Curso" :
                             settings.status === 'paused' ? "Pausada" : "Desligada"}
                          </Badge>
                        </div>

                        {/* DRIP CHAMBER ANIMATION DISPLAY */}
                        <div className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Taxa de Infusão</span>
                            <span className="text-3xl font-mono font-black text-white">{settings.velocity} <span className="text-xs">ml/h</span></span>
                          </div>
                          
                          {/* Liquid drop graphic representation */}
                          <div className="h-16 w-8 rounded-xl bg-slate-800/40 border border-white/5 flex flex-col items-center justify-between py-1 relative overflow-hidden shrink-0">
                            <div className="h-2 w-2 rounded-full bg-white/20" />
                            
                            {settings.status === 'running' ? (
                              <motion.div 
                                animate={{ y: [0, 45], opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeIn" }}
                                className="absolute top-3"
                              >
                                <Droplet className="h-3 w-3 text-sky-400 fill-sky-400 animate-bounce" />
                              </motion.div>
                            ) : (
                              <Droplet className="h-3 w-3 text-white/10 absolute top-3" />
                            )}
                            
                            <div className="h-4 w-full bg-sky-500/20 border-t border-sky-400/30 rounded-b-lg relative" />
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Infundido</span>
                            <span className="text-xl font-mono font-bold text-sky-400">{settings.infused} <span className="text-xs text-white">/ {settings.vtbi}ml</span></span>
                          </div>
                        </div>

                        {/* VELOCITY & VOLUME MANUAL DIALS */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Velocidade (ml/h)</Label>
                            <div className="flex items-center gap-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUpdatePump({ velocity: Math.max(10, settings.velocity - 10) })}
                                className="h-8 w-8 bg-white/5 hover:bg-white/10 text-white rounded-lg border-white/10"
                              >
                                -
                              </Button>
                              <span className="flex-1 text-center font-mono font-bold text-xs">{settings.velocity}</span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUpdatePump({ velocity: Math.min(250, settings.velocity + 10) })}
                                className="h-8 w-8 bg-white/5 hover:bg-white/10 text-white rounded-lg border-white/10"
                              >
                                +
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Limite VTBI (ml)</Label>
                            <div className="flex items-center gap-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUpdatePump({ vtbi: Math.max(100, settings.vtbi - 50) })}
                                className="h-8 w-8 bg-white/5 hover:bg-white/10 text-white rounded-lg border-white/10"
                              >
                                -
                              </Button>
                              <span className="flex-1 text-center font-mono font-bold text-xs">{settings.vtbi}</span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUpdatePump({ vtbi: Math.min(1000, settings.vtbi + 50) })}
                                className="h-8 w-8 bg-white/5 hover:bg-white/10 text-white rounded-lg border-white/10"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* PUMP ACTIONS CONTROL BAR */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                          <Button
                            onClick={() => handleUpdatePump({ status: "running" })}
                            className={cn(
                              "flex-1 h-9 rounded-xl text-[9px] font-black uppercase tracking-wider text-white border border-transparent shadow-lg",
                              settings.status === 'running' ? "bg-emerald-600 border-emerald-500" : "bg-white/5 hover:bg-white/10 border-white/10"
                            )}
                          >
                            Iniciar
                          </Button>
                          <Button
                            onClick={() => handleUpdatePump({ status: "paused" })}
                            className={cn(
                              "flex-1 h-9 rounded-xl text-[9px] font-black uppercase tracking-wider text-white border border-transparent shadow-lg",
                              settings.status === 'paused' ? "bg-amber-600 border-amber-500" : "bg-white/5 hover:bg-white/10 border-white/10"
                            )}
                          >
                            Pausar
                          </Button>
                          <Button
                            onClick={() => handleUpdatePump({ status: "stopped", infused: 0 })}
                            className="flex-1 h-9 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-wider"
                          >
                            Resetar
                          </Button>
                        </div>
                      </div>
                    );
                  })()
                )}

                {/* INTERACTIVE CLINICAL ACTIONS */}
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      type="button"
                      onClick={() => handleAddExtraDose()}
                      className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 font-black uppercase tracking-wider text-xs shadow-lg shadow-rose-500/10 flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Prescrever Dose SOS
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleSuspendPrescription()}
                      className="bg-transparent hover:bg-red-500/10 text-red-500 border border-red-500/30 hover:border-red-500/50 h-12 rounded-xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Suspender Medicação
                    </Button>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setViewingPrescription(null)}
                    className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Fechar Prontuário
                  </Button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SCANNER HUD VIEWVIEWER MODAL */}
      <AnimatePresence>
        {showScanner && scanTarget && (
          <>
            <div 
              className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md" 
              onClick={() => setShowScanner(false)} 
            />
            <motion.div 
              drag
              dragMomentum={false}
              dragElastic={0}
              dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
              whileDrag={{ cursor: "grabbing" }}
              style={{ x: "-50%", y: "-50%", touchAction: "none", transitionProperty: "none" }}
              initial={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
              className="fixed left-[50%] top-[50%] z-[70] w-full max-w-md overflow-hidden rounded-[2.5rem] bg-slate-950 border border-white/20 shadow-2xl p-8 flex flex-col items-center gap-6"
            >
              {/* view finder HUD element */}
              <div className="w-full aspect-[4/3] rounded-3xl bg-slate-900 border border-white/10 relative overflow-hidden flex items-center justify-center">
                {/* Neon scanning laser line */}
                <div className="absolute left-0 right-0 h-0.5 bg-amber-500 shadow-[0_0_15px_#f59e0b] animate-pulse top-1/2 -translate-y-1/2 z-10" />
                
                {/* Viewfinder borders */}
                <div className="absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-amber-500 rounded-tl-lg" />
                <div className="absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-amber-500 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-amber-500 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-amber-500 rounded-br-lg" />
                
                <div className="text-center p-6 space-y-2 z-20">
                  <QrCode className="h-10 w-10 text-amber-500 mx-auto animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">DISPOSITIVO DE SEGURANÇA ATIVO</p>
                  <p className="text-xs font-bold text-white uppercase">{scanTarget.medName} • {scanTarget.patientName}</p>
                </div>
              </div>

              <div className="w-full space-y-3">
                <Button
                  type="button"
                  onClick={() => {
                    playBeep();
                    setScannedPatient(true);
                    toast.success("Pulseira do Paciente validada com sucesso!");
                  }}
                  className={cn(
                    "w-full h-12 rounded-xl text-xs font-black uppercase tracking-wider text-white",
                    scannedPatient ? "bg-emerald-600 border border-emerald-500" : "bg-white/10 hover:bg-white/25 border border-white/10"
                  )}
                >
                  {scannedPatient ? "✓ Pulseira Bipada" : "Simular Bipar Pulseira"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    playBeep();
                    setScannedMed(true);
                    toast.success("Código da Medicação validada com sucesso!");
                  }}
                  className={cn(
                    "w-full h-12 rounded-xl text-xs font-black uppercase tracking-wider text-white",
                    scannedMed ? "bg-emerald-600 border border-emerald-500" : "bg-white/10 hover:bg-white/25 border border-white/10"
                  )}
                >
                  {scannedMed ? "✓ Medicamento Bipado" : "Simular Bipar Ampola"}
                </Button>
              </div>

              {scannedPatient && scannedMed && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center"
                >
                  🎉 Validação de Segurança Concluída!
                </motion.div>
              )}

              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowScanner(false)}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white"
              >
                {scannedPatient && scannedMed ? "Confirmar e Fechar Scanner" : "Abortar Validação"}
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* BEDSIDE OCCURRENCE LOGGER MODAL */}
      <AnimatePresence>
        {showOccurrenceLogger && (
          <>
            <div 
              className="fixed inset-0 z-50 bg-slate-900/15 dark:bg-black/55 backdrop-blur-[5px]" 
              onClick={() => setShowOccurrenceLogger(false)} 
            />
            <motion.div 
              drag
              dragMomentum={false}
              dragElastic={0}
              dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
              whileDrag={{ cursor: "grabbing" }}
              style={{ x: "-50%", y: "-50%", touchAction: "none", transitionProperty: "none" }}
              initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
              className="fixed left-[50%] top-[50%] z-50 w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white/95 dark:bg-slate-950/95 border border-slate-200/50 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              <div className="p-8 bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600/90 dark:to-amber-700/90 text-white relative border-b border-amber-450 dark:border-amber-950/20">
                <button 
                  type="button" 
                  onClick={() => setShowOccurrenceLogger(false)}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <AlertOctagon className="h-5 w-5 text-white" />
                  </div>
                  <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest">
                    Segurança do Paciente
                  </Badge>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Reportar Ocorrência Leito</h3>
                <p className="text-xs text-amber-100 font-bold mt-1 uppercase tracking-wider">
                  Notificar intercorrência imediata à beira do leito
                </p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categoria da Intercorrência</Label>
                  <Select 
                    value={newOccurrence.category} 
                    onValueChange={(val) => setNewOccurrence(prev => ({ ...prev, category: val }))}
                  >
                    <SelectTrigger className="h-11 text-xs border-amber-250 dark:border-amber-950/20 bg-transparent">
                      <SelectValue placeholder="Selecione a categoria..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dor Intensa">Dor Intensa (Escala de Dor)</SelectItem>
                      <SelectItem value="Febre / Hipertermia">Febre / Hipertermia</SelectItem>
                      <SelectItem value="Vômito / Náusea">Vômito / Náusea</SelectItem>
                      <SelectItem value="Perda de Acesso Venoso">Perda de Acesso Venoso</SelectItem>
                      <SelectItem value="Suspeita de Reação Adversa">Suspeita de Reação Adversa</SelectItem>
                      <SelectItem value="Agitação Psicomotora">Agitação Psicomotora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Observação Clínica / Conduta Tomada</Label>
                  <textarea 
                    value={newOccurrence.observation}
                    onChange={(e) => setNewOccurrence(prev => ({ ...prev, observation: e.target.value }))}
                    placeholder="Descreva detalhadamente a intercorrência identificada e se alguma equipe ou conduta médica foi acionada..."
                    className="w-full min-h-[100px] p-3 rounded-2xl bg-muted/40 border border-border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowOccurrenceLogger(false)}
                    className="h-12 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleReportOccurrence}
                    className="h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/10"
                  >
                    Registrar Ocorrência
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
