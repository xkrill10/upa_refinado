import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import { usePatients, Patient } from "@/hooks/use-patients";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Heart, Wind, AlertCircle, Thermometer, Activity, Brain, ShieldAlert, Zap, X, Check, CheckCircle2, Bone, Stethoscope, RotateCcw, ArrowLeft, ArrowRight, UserPlus, Save, MapPin, ClipboardList, Info, Palette, Droplets, Pill, SearchCode, History, Syringe, FileText, Plus, Volume2, Megaphone, VolumeX, MessageSquare, Ban, ChevronRight, Eye, Sparkles, Scale, Clock, HeartPulse, Wrench, Settings2, Users, LayoutGrid, XCircle, FlaskConical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn, formatWords } from "@/lib/utils";

interface TriageStep {
  question: string;
  level: 'emergency' | 'very-urgent' | 'urgent' | 'less-urgent' | 'not-urgent';
}

interface Flowchart {
  id: string;
  name: string;
  disc: number;
  icon: React.ElementType;
  color: string;
  steps: TriageStep[];
}

const flowcharts: Flowchart[] = [
  { id: 'chest-pain', name: 'DOR TORÁCICA', disc: 9, icon: Heart, color: 'text-red-500', steps: [
    { question: "Obstrução de vias aéreas?", level: "emergency" },
    { question: "Respiração inadequada?", level: "emergency" },
    { question: "Choque ou Sinais de Hipoperfusão?", level: "emergency" },
    { question: "Hemorragia exanguinante?", level: "emergency" },
    { question: "Alteração súbita de consciência?", level: "emergency" },
    { question: "Dor Cardíaca atual?", level: "very-urgent" },
    { question: "Início súbito de dor?", level: "urgent" },
    { question: "Dor pleurítica ou ventilatório-dependente?", level: "urgent" },
    { question: "Dor leve recente?", level: "less-urgent" },
  ]},
  { id: 'dyspnea', name: 'DISPNEIA / FALTA DE AR', disc: 8, icon: Wind, color: 'text-blue-500', steps: [
    { question: "Paciente com via aérea obstruída?", level: "emergency" },
    { question: "Paciente com estridor ou sibilância intensa?", level: "emergency" },
    { question: "Saturação de O2 abaixo de 90%?", level: "emergency" },
    { question: "Uso de musculatura acessória?", level: "very-urgent" },
    { question: "Paciente com histórico de asma/DPOC em crise?", level: "urgent" },
  ]},
  { id: 'abd-pain', name: 'DOR ABDOMINAL', disc: 9, icon: AlertCircle, color: 'text-emerald-500', steps: [
    { question: "Sinais de choque ou exsanguinação?", level: "emergency" },
    { question: "Dor abdominal súbita e intensa?", level: "very-urgent" },
    { question: "Gravidez suspeita com dor intensa?", level: "very-urgent" },
    { question: "Vômitos persistentes?", level: "urgent" },
  ]},
  { id: 'fever', name: 'FEBRE', disc: 9, icon: Thermometer, color: 'text-orange-500', steps: [
    { question: "Convulsão ativa?", level: "emergency" },
    { question: "Sinais de meningismo (rigidez de nuca)?", level: "very-urgent" },
    { question: "Petéquias ou púrpura?", level: "very-urgent" },
    { question: "Temperatura acima de 39°C?", level: "urgent" },
  ]},
  { id: 'trauma', name: 'TRAUMA / LESÃO', disc: 9, icon: Bone, color: 'text-slate-500', steps: [
    { question: "Hemorragia exanguinante?", level: "emergency" },
    { question: "Trauma craniano com perda de consciência?", level: "very-urgent" },
    { question: "Hemorragia incontrolável?", level: "very-urgent" },
    { question: "Deformidade evidente em membro?", level: "urgent" },
  ]},
  { id: 'neuro', name: 'PROBLEMA NEUROLÓGICO', disc: 9, icon: Brain, color: 'text-purple-500', steps: [
    { question: "Convulsão no momento?", level: "emergency" },
    { question: "Inconsciente?", level: "emergency" },
    { question: "Déficit focal súbito?", level: "very-urgent" },
    { question: "Cefaleia súbita e intensa?", level: "very-urgent" },
  ]},
  { id: 'allergy', name: 'ERUPÇÃO CUTÂNEA / ALERGIA', disc: 7, icon: ShieldAlert, color: 'text-pink-500', steps: [
    { question: "Edema de glote ou estridor?", level: "emergency" },
    { question: "Urticária generalizada com hipotensão?", level: "very-urgent" },
    { question: "Reação alérgica moderada?", level: "urgent" },
  ]},
  { id: 'general', name: 'MAL-ESTAR GERAL / OUTROS', disc: 8, icon: Stethoscope, color: 'text-amber-500', steps: [
    { question: "Inconsciente ou não responsivo?", level: "emergency" },
    { question: "Sinais de choque séptico?", level: "very-urgent" },
    { question: "Sinais de desidratação severa?", level: "very-urgent" },
  ]},
];


const getVitalSeverity = (key: string, value: string): 'normal' | 'caution' | 'emergency' => {
  if (!value) return 'normal';
  const num = parseFloat(value);
  if (isNaN(num)) return 'normal';

  switch (key) {
    case 'fc':
      if (num < 40 || num > 150) return 'emergency';
      if (num < 60 || num > 100) return 'caution';
      return 'normal';
    case 'spo2':
      if (num < 90) return 'emergency';
      if (num < 95) return 'caution';
      return 'normal';
    case 'temperature':
      if (num > 39 || num < 35) return 'emergency';
      if (num > 37.5) return 'caution';
      return 'normal';
    case 'fr':
      if (num > 30 || num < 8) return 'emergency';
      if (num > 20 || num < 12) return 'caution';
      return 'normal';
    case 'pa': {
      const [systolic] = value.split('/').map(n => parseInt(n));
      if (isNaN(systolic)) return 'normal';
      if (systolic < 80 || systolic > 200) return 'emergency';
      if (systolic < 90 || systolic > 140) return 'caution';
      return 'normal';
    }
    case 'glicemia':
      if (num < 50 || num > 400) return 'emergency';
      if (num < 70 || num > 250) return 'caution';
      return 'normal';
    default:
      return 'normal';
  }
};

import { PatientDetailsModal } from "@/components/PatientDetailsModal";
import { ExamsModal } from "@/components/PatientEvolution/Modals/ExamsModal";

export default function Triage() {
  const { patients, updatePatient, addPatient, callTicket, isAudioEnabled, setIsAudioEnabled } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientForModal, setPatientForModal] = useState<Patient | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [showCallControl, setShowCallControl] = useState(false);
  const [callingTicket, setCallingTicket] = useState<{ 
    ticket: string; 
    patientName: string; 
    risk: Patient['risk'];
    priority: Patient['priority'];
    age?: number;
    cpf?: string;
  } | null>(null);
  const [selectedTriageRoom, setSelectedTriageRoom] = useState<string>(() => {
    return localStorage.getItem('selectedTriageRoom') || "TRIAGEM 1";
  });
  const [autoCallNext, setAutoCallNext] = useState<boolean>(() => {
    return localStorage.getItem('autoCallNext') === 'true';
  });
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('selectedTriageRoom', selectedTriageRoom);
  }, [selectedTriageRoom]);

  useEffect(() => {
    localStorage.setItem('autoCallNext', autoCallNext.toString());
  }, [autoCallNext]);

  const [equipmentStatus, setEquipmentStatus] = useState<Record<string, Record<string, boolean>>>({
    'TRIAGEM 1': { 'Termômetro': true, 'Esfignomanômetro': true, 'Oxímetro': true, 'Glicosímetro': true, 'Estetoscópio': true },
    'TRIAGEM 2': { 'Termômetro': true, 'Esfignomanômetro': true, 'Oxímetro': true, 'Glicosímetro': true, 'Estetoscópio': true },
  });

  const toggleEquipment = (room: string, item: string) => {
    setEquipmentStatus(prev => {
      if (!prev[room]) return prev;
      return {
        ...prev,
        [room]: { ...prev[room], [item]: !prev[room][item] }
      };
    });
  };

  const [showFlowcharts, setShowFlowcharts] = useState(false);
  const [activeFlowchart, setActiveFlowchart] = useState<Flowchart | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [openGlasgowCalc, setOpenGlasgowCalc] = useState(false);
  const [openMedicationSelector, setOpenMedicationSelector] = useState(false);
  const [medSearch, setMedSearch] = useState("");

  const [glasgowValues, setGlasgowValues] = useState({ eye: 4, verbal: 5, motor: 6 });
  const [selectedRisk, setSelectedRisk] = useState<Patient['risk'] | null>(null);
  const [lastCalculatedRisk, setLastCalculatedRisk] = useState<Patient['risk'] | null>(null);
  const [susDiscriminators, setSusDiscriminators] = useState<string[]>([]);
  const initialClinicalData = {
    mainComplaint: "",
    bloodType: "",
    allergies: "",
    currentMedications: "",
    fc: "",
    pa: "",
    fr: "",
    spo2: "",
    temperature: "",
    glasgow: "",
    glicemia: "",
    weight: "",
    evolutionTime: "",
    comorbidities: "",
    vaccination: "",
    justification: "",
  };

  const [clinicalData, setClinicalData] = useState(initialClinicalData);

  // New patient form state
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    socialName: "",
    cpf: "",
    susCard: "",
    birthDate: "",
    gender: "",
    phone1: "",
    phone2: "",
    email: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (showNewPatientModal) {
      setFormData({
        name: "",
        socialName: "",
        cpf: "",
        susCard: "",
        birthDate: "",
        gender: "",
        phone1: "",
        phone2: "",
        email: "",
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      });
    }
  }, [showNewPatientModal]);

  const maskCPF = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");

  const maskSUS = (value: string) =>
    value.replace(/\D/g, "").substring(0, 15);

  const validateSUS = (cns: string) => {
    if (cns.length !== 15) return false;
    
    const firstDigit = cns[0];
    if (!['1', '2', '7', '8', '9'].includes(firstDigit)) return false;

    if (['1', '2'].includes(firstDigit)) {
      const pis = cns.substring(0, 11);
      let sum = 0;
      for (let i = 0; i < 11; i++) {
        sum += parseInt(pis[i]) * (15 - i);
      }
      
      const rest = sum % 11;
      let dv = 11 - rest;
      
      if (dv === 11) dv = 0;
      
      if (dv === 10) {
        sum += 2;
        const rest2 = sum % 11;
        const dv2 = 11 - rest2;
        return cns === pis + "001" + dv2.toString();
      } else {
        return cns === pis + "000" + dv.toString();
      }
    }

    if (['7', '8', '9'].includes(firstDigit)) {
      let sum = 0;
      for (let i = 0; i < 15; i++) {
        sum += parseInt(cns[i]) * (15 - i);
      }
      return (sum % 11 === 0);
    }

    return false;
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  };

  const maskPA = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length <= 2) return cleanValue;
    if (cleanValue.length <= 3) return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`;
    if (cleanValue.length <= 4) {
      if (parseInt(cleanValue.slice(0, 3)) > 300) { // Likely old style or typo
         return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`;
      }
      return `${cleanValue.slice(0, 3)}/${cleanValue.slice(3)}`;
    }
    if (cleanValue.length <= 5) {
      return `${cleanValue.slice(0, 3)}/${cleanValue.slice(3)}`;
    }
    return `${cleanValue.slice(0, 3)}/${cleanValue.slice(3, 6)}`;
  };

  const maskNumbers = (value: string, limit?: number) => {
    const clean = value.replace(/\D/g, "");
    return limit ? clean.substring(0, limit) : clean;
  };

  const maskSPO2 = (value: string) => {
    const clean = value.replace(/\D/g, "").substring(0, 3);
    const num = parseInt(clean);
    if (num > 100) return "100";
    return clean;
  };

  const maskTemp = (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length <= 2) return clean;
    return `${clean.slice(0, 2)}.${clean.slice(2, 3)}`;
  };

  const maskFC = (value: string) => maskNumbers(value, 3);
  const maskGlicemia = (value: string) => maskNumbers(value, 4);
  const maskFR = (value: string) => maskNumbers(value, 2);

  const GLASGOW_EYE = [
    { label: "Espontânea", value: 4 },
    { label: "À voz", value: 3 },
    { label: "À dor", value: 2 },
    { label: "Nenhuma", value: 1 },
  ];

  const GLASGOW_VERBAL = [
    { label: "Orientado", value: 5 },
    { label: "Confuso", value: 4 },
    { label: "Palavras inapropriadas", value: 3 },
    { label: "Sons incompreensíveis", value: 2 },
    { label: "Nenhuma", value: 1 },
  ];

  const GLASGOW_MOTOR = [
    { label: "Obedece comandos", value: 6 },
    { label: "Localiza dor", value: 5 },
    { label: "Flexão normal (retirada)", value: 4 },
    { label: "Flexão anormal (decorticação)", value: 3 },
    { label: "Extensão anormal (descerebração)", value: 2 },
    { label: "Nenhuma", value: 1 },
  ];

  const complaintMetadata: Record<string, { icon: React.ElementType, description: string, color: string, bgColor: string }> = {
    "Dor Torácica": { icon: Heart, description: "Desconforto ou dor na região do peito", color: "text-red-500", bgColor: "bg-red-50 text-red-500" },
    "Cefaleia": { icon: Brain, description: "Dor de cabeça intensa ou persistente", color: "text-purple-500", bgColor: "bg-purple-50 text-purple-500" },
    "Febre": { icon: Thermometer, description: "Temperatura corporal elevada", color: "text-orange-500", bgColor: "bg-orange-50 text-orange-500" },
    "Dispneia": { icon: Wind, description: "Dificuldade para respirar", color: "text-blue-500", bgColor: "bg-blue-50 text-blue-500" },
    "Dor Abdominal": { icon: AlertCircle, description: "Desconforto na região do abdômen", color: "text-emerald-500", bgColor: "bg-emerald-50 text-emerald-500" },
    "Vômitos": { icon: Droplets, description: "Náuseas e vômitos frequentes", color: "text-blue-400", bgColor: "bg-blue-50 text-blue-400" },
    "Diarreia": { icon: Droplets, description: "Aumento na frequência de evacuações", color: "text-amber-600", bgColor: "bg-amber-50 text-amber-600" },
    "Tosse": { icon: Activity, description: "Tosse seca ou com secreção", color: "text-slate-500", bgColor: "bg-slate-50 text-slate-500" },
    "Síncope": { icon: Zap, description: "Desmaio ou perda súbita de consciência", color: "text-yellow-500", bgColor: "bg-yellow-50 text-yellow-500" },
    "Trauma": { icon: Bone, description: "Lesões causadas por impacto físico", color: "text-slate-700", bgColor: "bg-slate-100 text-slate-700" },
    "Lombalgia": { icon: Bone, description: "Dor na região lombar (costas)", color: "text-orange-700", bgColor: "bg-orange-100 text-orange-700" },
    "Disúria": { icon: Droplets, description: "Dor ou ardor ao urinar", color: "text-blue-300", bgColor: "bg-blue-50 text-blue-300" },
  };

  const COMPLAINT_OPTIONS = ["Dor torácica", "Cefaleia", "Febre", "Dispneia", "Dor abdominal", "Vômitos", "Diarreia", "Tosse", "Síncope", "Trauma", "Lombalgia", "Disúria"];
  const HISTORY_OPTIONS = ["HAS (Hipertensão)", "DM (Diabetes)", "Asma", "DPOC", "Cardiopatia", "IRC (Insuficiência Renal)", "AVC Prévio", "HIV", "Obesidade", "Etilismo", "Tabagismo", "Nega"];
  const ALLERGY_OPTIONS = ["Dipirona", "AINEs", "Penicilina", "Látex", "Contraste", "Sulfa", "Iodo", "Nega"];

  const MEDICATION_CATEGORIES = [
    {
      name: "Hipertensão / Coração",
      items: ["Losartana", "Enalapril", "Atenolol", "Hidroclorotiazida", "Anlodipino", "Captopril", "Espironolactona", "Carvedilol"]
    },
    {
      name: "Diabetes",
      items: ["Metformina", "Glibenclamida", "Gliclazida", "Insulina NPH", "Insulina Regular", "Dapagliflozina"]
    },
    {
      name: "Controlados (Psicotrópicos)",
      items: ["Clonazepam (Rivotril)", "Fluoxetina", "Sertralina", "Amitriptilina", "Carbamazepina", "Diazepam", "Valproato", "Risperidona", "Quetiapina"]
    },
    {
      name: "Estômago / Outros",
      items: ["Omeprazol", "Pantoprazol", "Simvastatina", "Atorvastatina", "Levotiroxina", "Varfarina (Marevan)", "AAS"]
    }
  ];


  const formatMedicalText = (text: string) => {
    if (!text) return "";
    
    // Sentence Case logic: Capitaliza apenas a primeira letra e mantém o resto,
    // a menos que o usuário tenha digitado tudo em CAPS.
    const isAllCaps = text.length > 3 && text === text.toUpperCase();
    const working = isAllCaps ? text.toLowerCase() : text;
    
    const acronyms = ["SUS", "UPA", "SAMU", "AVC", "IAM", "HAS", "DM", "DPOC", "IRC", "HIV", "AAS", "PA", "FC", "FR", "SPO2", "UTI", "UCO", "GCS", "TC", "RM", "ECG", "EEG", "HGT"];

    let result = working.charAt(0).toUpperCase() + (isAllCaps ? working.slice(1).toLowerCase() : working.slice(1));
    
    // Forçar siglas em maiúsculo
    acronyms.forEach(acr => {
      const regex = new RegExp(`\\b${acr}\\b`, 'gi');
      result = result.replace(regex, acr);
    });
    
    return result;
  };

  const handleChange = (field: string, value: string) => {
    let finalValue = value;

    if (field === "name" || field === "socialName" || field === "street" || field === "neighborhood" || field === "city" || field === "complement") {
      finalValue = formatWords(value);
    }

    if (field === "cpf") finalValue = maskCPF(value);
    if (field === "susCard") finalValue = maskSUS(value);
    if (field === "phone1" || field === "phone2") finalValue = maskPhone(value);
    if (field === "cep") {
      finalValue = maskCEP(value);
      handleCEPLookup(finalValue);
    }

    setFormData(prev => ({ ...prev, [field]: finalValue }));
  };

  const handleCEPLookup = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        const data = await response.json();

        if (data.erro) {
          toast.error("CEP não encontrado.");
          return;
        }

        setFormData(prev => ({
          ...prev,
          street: formatWords(data.logradouro),
          neighborhood: formatWords(data.bairro),
          city: formatWords(data.localidade),
          state: data.uf.toUpperCase()
        }));
        toast.success("Endre\xE7o preenchido automaticamente!");
      } catch (error) {
        console.error("CEP Lookup Error:", error);
      }
    }
  };

  const handleNewPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.cpf) {
      toast.error("Por favor, preencha os campos obrigatórios (*)");
      return;
    }

    if (formData.susCard && !validateSUS(formData.susCard)) {
      toast.error("Cartão do SUS inválido");
      return;
    }

    const birthDate = new Date(formData.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    addPatient({
      name: formData.name,
      age: isNaN(age) ? 0 : age,
      cpf: formData.cpf,
      susCard: formData.susCard,
      status: 'waiting',
      risk: 'not-urgent',
      arrivalTime: new Date().toISOString(),
      mainComplaint: "",
      socialName: formData.socialName,
      birthDate: formData.birthDate,
      gender: formData.gender,
      phone1: formData.phone1,
      phone2: formData.phone2,
      email: formData.email,
      cep: formData.cep,
      street: formData.street,
      number: formData.number,
      complement: formData.complement,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      bloodType: "",
      allergies: "",
      currentMedications: "",
    });

    toast.success("Paciente registrado com sucesso!");
    setShowNewPatientModal(false);
  };

  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isFillingClinical, setIsFillingClinical] = useState(false);
  const [identificationData, setIdentificationData] = useState({
    name: "",
    socialName: "",
    cpf: "",
    birthDate: "",
    susCard: "",
    motherName: ""
  });

  // Filter patients waiting for triage
  const priorityRank: Record<string, number> = { emergency: 0, preferential: 1, pediatric: 1, normal: 2 };
  const waitingForTriage = patients
    .filter(p => p.status === 'waiting' && !p.triaged && !p.sector)
    .sort((a, b) => {
      const pa = priorityRank[a.priority || 'normal'];
      const pb = priorityRank[b.priority || 'normal'];
      if (pa !== pb) return pa - pb;
      return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
    });

  const inTriage = patients
    .filter(p => !p.triaged && (p.sector === "TRIAGEM 1" || p.sector === "TRIAGEM 2"))
    .sort((a, b) => a.sector!.localeCompare(b.sector!));

  const handleStartTriage = (patient: Patient) => {
    setSelectedPatient(patient);
    // Move patient to the selected room in the sectors map
    updatePatient(patient.id, { sector: selectedTriageRoom });
    
    setIdentificationData({
      name: patient.name.startsWith("Pré-cadastro") ? "" : patient.name,
      socialName: patient.socialName || "",
      cpf: patient.cpf || "",
      birthDate: patient.birthDate || "",
      susCard: patient.susCard || "",
      motherName: patient.motherName || ""
    });
    setClinicalData({
      ...initialClinicalData,
      mainComplaint: patient.mainComplaint || "",
      bloodType: patient.bloodType || "",
      allergies: patient.allergies || "",
      currentMedications: patient.currentMedications || "",
      fc: patient.fc || "",
      pa: patient.pa || "",
      fr: patient.fr || "",
      spo2: patient.spo2 || "",
      temperature: patient.temperature || "",
      glasgow: patient.glasgow || "",
      glicemia: patient.glicemia || "",
      evolutionTime: patient.evolutionTime || "",
      comorbidities: patient.comorbidities || "",
      vaccination: patient.vaccination || "",
    });
    setSelectedRisk(null);
    setLastCalculatedRisk(null);
    setSusDiscriminators([]);
    setGlasgowValues({ eye: 4, verbal: 5, motor: 6 }); // Reset Glasgow values
    const isUnidentified = patient.name.toUpperCase().includes('DESCONHECIDO') || 
                          patient.name.toUpperCase().includes('NÃO IDENTIFICADO') ||
                          patient.cpf === "000.000.000-00";

    setIsIdentifying(!isUnidentified);
    setIsFillingClinical(isUnidentified);
    setShowFlowcharts(true);
    setActiveFlowchart(null);
    setCurrentStep(0);
  };

  const handleSelectFlowchart = (flowId: string) => {
    const flow = flowcharts.find(f => f.id === flowId);
    if (flow) {
      setActiveFlowchart(flow);
      setCurrentStep(0);
    }
  };

  const handleAnswer = (answer: boolean) => {
    if (!selectedPatient || !activeFlowchart) return;

    if (answer) {
      const level = activeFlowchart.steps[currentStep].level;
      completeTriage(level);
    } else {
      if (currentStep < activeFlowchart.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        completeTriage('not-urgent');
      }
    }
  };

  const calculateSuggestedRisk = useCallback(() => {
    const { fc, pa, fr, spo2, temperature, glasgow, mainComplaint, glicemia } = clinicalData;
    
    const nFc = parseInt(fc);
    const nFr = parseInt(fr);
    const nSpo2 = parseInt(spo2);
    const nTemp = parseFloat(temperature);
    const nGlasgow = parseInt(glasgow.split('/')[0]) || 15;
    const nGlicemia = parseInt(glicemia);
    const [systodic] = pa.split('/').map(n => parseInt(n));

    // Emergência (Vermelho)
    if (
      (nGlasgow > 0 && nGlasgow <= 8) ||
      (nSpo2 > 0 && nSpo2 < 90) ||
      (nGlicemia > 0 && nGlicemia < 50) ||
      (systodic > 0 && (systodic < 80 || systodic > 220)) ||
      (nFc > 0 && (nFc < 40 || nFc > 150)) ||
      (nFr > 0 && (nFr < 8 || nFr > 30)) ||
      mainComplaint.toUpperCase().includes("PARADA") ||
      mainComplaint.toUpperCase().includes("INCONSCIENTE") ||
      mainComplaint.toUpperCase().includes("CHOQUE")
    ) {
      return 'emergency';
    }

    // Muito Urgente (Laranja)
    if (
      (nGlasgow >= 9 && nGlasgow <= 12) ||
      (nGlicemia >= 50 && nGlicemia <= 70) ||
      (nGlicemia > 400) ||
      (systodic > 200) ||
      (nTemp >= 39) ||
      (nFc > 120) ||
      (nFr > 24) ||
      mainComplaint.toUpperCase().includes("DOR TOR\xC1CICA") ||
      mainComplaint.toUpperCase().includes("AVC") ||
      mainComplaint.toUpperCase().includes("HEMORRAGIA") ||
      mainComplaint.toUpperCase().includes("DISPN\xC9IA")
    ) {
      return 'very-urgent';
    }

    // Urgente (Amarelo)
    if (
      (nGlasgow >= 13 && nGlasgow <= 14) ||
      (nTemp >= 38 && nTemp < 39) ||
      (nGlicemia >= 250 && nGlicemia <= 400) ||
      (systodic > 160 && systodic <= 200) ||
      (nFc > 100 && nFc <= 120) ||
      mainComplaint.toUpperCase().includes("DOR ABDOMINAL") ||
      mainComplaint.toUpperCase().includes("VÔMITO") ||
      mainComplaint.toUpperCase().includes("DESMAIO")
    ) {
      return 'urgent';
    }

    // Pouco Urgente (Verde)
    if (
      mainComplaint.length > 0 || 
      (nTemp >= 37 && nTemp < 38) || 
      (nGlicemia > 140 && nGlicemia < 250)
    ) {
      return 'less-urgent';
    }

    return 'not-urgent';
  }, [clinicalData]);

  useEffect(() => {
    if (isFillingClinical) {
      const suggested = calculateSuggestedRisk();
      if (suggested !== lastCalculatedRisk) {
        setLastCalculatedRisk(suggested);
        // Sempre sincroniza a seleção com a sugestão do sistema para feedback em tempo real
        setSelectedRisk(suggested);
      }
    }
  }, [isFillingClinical, calculateSuggestedRisk, lastCalculatedRisk]);

  const completeTriage = (risk: string) => {
    if (!selectedPatient) return;

    updatePatient(selectedPatient.id, {
      ...clinicalData,
      risk: risk as Patient['risk'],
      status: 'waiting',
      sector: 'Aguardando Médico',
      triaged: true,
    });



    const riskLabels: Record<string, string> = {
      'emergency': 'Emerg\xEAncia (Vermelho)',
      'very-urgent': 'Muito Urgente (Laranja)',
      'urgent': 'Urgente (Amarelo)',
      'less-urgent': 'Pouco Urgente (Verde)',
      'not-urgent': 'Não Urgente (Azul)'
    };

    toast.success(`${formatWords(selectedPatient.name)} classificado como ${riskLabels[risk] || risk}`);
    setSelectedPatient(null);
    setShowFlowcharts(false);
    setActiveFlowchart(null);

    // Auto-Call Next logic
    if (autoCallNext) {
      setTimeout(() => {
        const next = waitingForTriage.find(p => p.id !== selectedPatient.id);
        if (next) {
          handleCall(next);
          toast.info(`Auto-chamada: ${formatWords(next.name)}`);
        }
      }, 1500);
    }
  };

  const handleCall = (patient: Patient) => {
    if (patient.ticket) {
      setCallingTicket({ 
        ticket: patient.ticket, 
        patientName: patient.name,
        risk: patient.risk || 'not-urgent',
        priority: patient.priority || 'normal',
        age: patient.age,
        cpf: patient.cpf
      });
      setShowCallControl(true);
      callTicket(patient.ticket, selectedTriageRoom, patient.risk || 'not-urgent', patient.name);
    }
  };

  const resetFlow = () => {
    setActiveFlowchart(null);
    setCurrentStep(0);
  };

  const getTicketColor = (ticket: string) => {
    const prefix = ticket.charAt(0).toUpperCase();
    if (prefix === 'E') return "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20";
    if (prefix === 'C' || prefix === 'I') return "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20";
    if (prefix === 'P') return "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20";
    return "bg-[#006699] text-white border-[#006699] shadow-lg shadow-sky-500/20";
  };

  const getTicketColorLight = (ticket: string) => {
    const prefix = ticket.charAt(0).toUpperCase();
    if (prefix === 'E') return "bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/20";
    if (prefix === 'C' || prefix === 'I') return "bg-orange-50 dark:bg-orange-950/20 text-orange-500 dark:text-orange-400 border-orange-100 dark:border-orange-900/20";
    if (prefix === 'P') return "bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400 border-amber-100 dark:border-amber-900/20";
    return "bg-[#006699]/5 dark:bg-[#006699]/10 text-[#006699] dark:text-[#3399cc] border-[#006699]/10 dark:border-[#006699]/20";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#006699] dark:text-sky-400 flex items-center gap-2">
            <ClipboardList className="h-6 w-6" /> TRIAGEM
          </h1>
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">Classificação de Risco (Ministério da Saúde)</p>
        </div>

        <div className="flex items-center gap-3 bg-white/70 dark:bg-slate-900/45 p-2 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 shadow-sm self-start md:self-auto transition-colors duration-500">
          <div className="hidden lg:flex items-center gap-4 px-4 border-r border-slate-200 dark:border-slate-800/60 mr-2">
            <div className="flex gap-4">
              {["TRIAGEM 1", "TRIAGEM 2"].map(roomName => {
                const isOccupied = patients.some(p => !p.triaged && p.sector === roomName);
                return (
                  <div key={roomName} className="flex flex-col">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.1em]">{roomName}</span>
                    <div className="flex items-center gap-1.5">
                      <div className={cn("h-2 w-2 rounded-full", isOccupied ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]")} />
                      <span className={cn("text-[9px] font-black uppercase tracking-tight", isOccupied ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400")}>
                        {isOccupied ? "OCUPADO" : "LIVRE"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Sua Produtividade</span>
              <span className="text-sm font-black text-[#006699] dark:text-sky-400">
                {patients.filter(p => p.triaged && p.sector === selectedTriageRoom).length} PACIENTES
              </span>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Sua Sala:</span>
          <div className="flex gap-1">
            {["TRIAGEM 1", "TRIAGEM 2"].map((room) => (
              <button
                key={room}
                onClick={() => setSelectedTriageRoom(room)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer",
                  selectedTriageRoom === room 
                    ? "bg-[#006699] dark:bg-sky-600 text-white shadow-md scale-105" 
                    : "bg-muted dark:bg-slate-800 text-muted-foreground hover:bg-muted/80 dark:hover:bg-slate-700/85"
                )}
              >
                {room}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="glass-card border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-xl overflow-hidden transition-all duration-300 relative">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-red-500/10 dark:bg-red-500/20 rounded-2xl">
                <AlertCircle className="h-6 w-6 text-red-650 dark:text-red-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Próximo Crítico</p>
                <p className="text-lg font-black text-red-700 dark:text-red-400">
                  {waitingForTriage.find(p => p.priority === 'emergency')?.ticket || "NENHUM"}
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full font-black text-[10px] uppercase tracking-widest h-9 rounded-xl shadow-lg hover:shadow-red-500/10 active:scale-[0.98] transition-all border-0"
                disabled={!waitingForTriage.find(p => p.priority === 'emergency')}
                onClick={() => {
                  const p = waitingForTriage.find(p => p.priority === 'emergency');
                  if (p) handleCall(p);
                }}
              >
                Chamada Imediata
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-xl overflow-hidden transition-all duration-300 relative">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Próximo Preferencial</p>
                <p className="text-lg font-black text-amber-750 dark:text-amber-400">
                  {waitingForTriage.find(p => p.priority === 'preferential')?.ticket || "NENHUM"}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 font-black text-[10px] uppercase tracking-widest h-9 rounded-xl active:scale-[0.98] transition-all bg-transparent"
                disabled={!waitingForTriage.find(p => p.priority === 'preferential')}
                onClick={() => {
                  const p = waitingForTriage.find(p => p.priority === 'preferential');
                  if (p) handleCall(p);
                }}
              >
                Chamar Preferencial
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-xl overflow-hidden transition-all duration-300 relative">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl">
                <Users className="h-6 w-6 text-[#006699] dark:text-sky-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Aguardando Geral</p>
                <p className="text-lg font-black text-[#006699] dark:text-sky-400">
                  {waitingForTriage.length} PACIENTES
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-blue-500/30 text-[#006699] dark:text-sky-400 hover:bg-[#006699]/5 dark:hover:bg-sky-500/10 font-black text-[10px] uppercase tracking-widest h-9 rounded-xl active:scale-[0.98] transition-all bg-transparent"
                disabled={waitingForTriage.length === 0}
                onClick={() => {
                  if (waitingForTriage.length > 0) handleCall(waitingForTriage[0]);
                }}
              >
                Chamar Próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="glass-card border-none shadow-xl rounded-xl overflow-hidden transition-all duration-500">
          <CardHeader className="pb-4 border-b border-slate-200/40 dark:border-slate-800/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-[#006699] dark:text-sky-400" />
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Pacientes Aguardando Triagem</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100/10 dark:divide-slate-800/20">
              {waitingForTriage.map((patient) => (
                <div 
                  key={patient.id} 
                  onClick={() => handleStartTriage(patient)}
                  className="p-6 flex items-center justify-between hover:bg-slate-100/35 dark:hover:bg-slate-900/25 border-b border-slate-250/20 dark:border-slate-850/10 last:border-b-0 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {patient.ticket && (
                        <span className={`px-4 py-1.5 rounded-xl font-mono font-bold text-xs transition-all border ${getTicketColorLight(patient.ticket)} group-hover:scale-105 w-20 text-center shrink-0`}>
                          {patient.ticket}
                        </span>
                      )}
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="font-bold text-base text-foreground group-hover:text-[#006699] dark:group-hover:text-sky-450 transition-colors truncate">
                          {patient.name.toUpperCase().includes('NÃO IDENTIFICADO') || patient.name.toUpperCase().includes('DESCONHECIDO') 
                            ? "PACIENTE NÃO IDENTIFICADO" 
                            : formatWords(patient.name)}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 opacity-70 truncate">
                          {patient.age} anos · CPF: {patient.cpf} {patient.susCard && ` · SUS: ${patient.susCard}`} · Chegada: {new Date(patient.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                    <div className="w-48 flex justify-center shrink-0">
                      {patient.risk ? (
                        <Badge className={cn("text-[10px] font-bold px-3 py-1 border-0 rounded-full w-32 justify-center", 
                          patient.risk === 'emergency' ? "bg-red-600 hover:bg-red-700 text-white" :
                          patient.risk === 'very-urgent' ? "bg-orange-500 hover:bg-orange-600 text-white" :
                          patient.risk === 'urgent' ? "bg-[#FFDE21] hover:bg-[#FFDE21]/90 text-black" :
                          patient.risk === 'less-urgent' ? "bg-green-500 hover:bg-green-600 text-white" :
                          "bg-blue-500 hover:bg-blue-600 text-white"
                        )}>
                          {patient.risk === 'emergency' ? 'Emergência' :
                           patient.risk === 'very-urgent' ? 'Muito Urgente' :
                           patient.risk === 'urgent' ? 'Urgente' :
                           patient.risk === 'less-urgent' ? 'Pouco Urgente' :
                           patient.risk === 'not-urgent' ? 'Não Urgente' : patient.risk}
                        </Badge>
                      ) : (
                        <Badge className="text-[10px] font-black px-3 py-1 bg-slate-100/60 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 uppercase tracking-widest w-32 justify-center h-7 rounded-full border border-slate-200 dark:border-slate-800/80 transition-all">Aguardando</Badge>
                      )}
                    </div>

                  <div className="w-[300px] flex items-center justify-end gap-2 shrink-0">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCall(patient);
                      }}
                      variant="outline"
                      className="border-[#006699] dark:border-sky-500/50 text-[#006699] dark:text-sky-400 hover:bg-[#006699]/5 dark:hover:bg-sky-500/10 rounded-xl h-10 px-4 font-bold text-xs gap-2 transition-all bg-transparent"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      Chamar Senha
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartTriage(patient);
                      }}
                      className="bg-[#006699] dark:bg-sky-600 hover:bg-[#005580] dark:hover:bg-sky-700 text-white rounded-xl h-10 px-6 font-bold text-xs gap-2 shadow-sm transition-all group-hover:scale-105 border-0"
                    >
                      <Stethoscope className="h-3.5 w-3.5" />
                      Iniciar Triagem
                    </Button>
                  </div>
                </div>
              ))}
              {waitingForTriage.length === 0 && (
                <div className="p-32 text-center flex flex-col items-center justify-center gap-4">
                  <div className="hidden">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-10" />
                  </div>
                  <p className="text-sm font-bold text-muted-foreground/30">Nenhum paciente na fila de triagem</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {inTriage.length > 0 && (
          <Card className="glass-card border-none shadow-xl rounded-xl overflow-hidden transition-all duration-500">
            <CardHeader className="pb-4 border-b border-emerald-100/20 dark:border-emerald-800/20 bg-emerald-500/5 dark:bg-emerald-950/10">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Pacientes em Atendimento (Triagem)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-emerald-100/10 dark:divide-emerald-805/10">
                {inTriage.map((patient) => (
                  <div 
                    key={patient.id} 
                    className="p-6 flex items-center justify-between hover:bg-emerald-50/10 dark:hover:bg-emerald-950/5 transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-20 flex justify-center shrink-0">
                          <Badge className="bg-emerald-600 text-white border-0 w-full justify-center text-[10px] py-1 rounded-xl">
                            {patient.ticket || "—"}
                          </Badge>
                        </div>
                        <div className="space-y-1 min-w-0">
                          <p className="font-bold text-base text-foreground truncate">
                            {patient.name.toUpperCase().includes('NÃO IDENTIFICADO') || patient.name.toUpperCase().includes('DESCONHECIDO') 
                              ? "PACIENTE NÃO IDENTIFICADO" 
                              : formatWords(patient.name)}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 opacity-70">
                            Ticket: {patient.ticket} · Início: {new Date(patient.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-40 flex justify-center shrink-0">
                      <Badge className="bg-emerald-100/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-0 text-[10px] font-bold px-3 py-1 rounded-full w-32 justify-center">
                        {patient.sector}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        onClick={() => handleStartTriage(patient)}
                        className="bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-800 text-white rounded-xl h-10 px-6 font-bold text-xs gap-2 shadow-sm transition-all border-0"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Retomar Triagem
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none shadow-xl rounded-xl overflow-hidden transition-all duration-500">
            <CardHeader className="pb-3 border-b border-slate-200/40 dark:border-slate-800/40">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-[#006699] dark:text-sky-400" />
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Configurações da Sala</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/20 rounded-xl transition-colors">
                <div>
                  <p className="text-[10px] font-bold uppercase text-foreground">Auto-Chamada</p>
                  <p className="text-[8px] text-muted-foreground uppercase">Próximo após concluir</p>
                </div>
                <button 
                  onClick={() => setAutoCallNext(!autoCallNext)}
                  className={cn(
                    "w-10 h-5 rounded-full transition-all relative cursor-pointer",
                    autoCallNext ? "bg-[#006699] dark:bg-sky-600" : "bg-slate-300 dark:bg-slate-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                    autoCallNext ? "right-0.5" : "left-0.5"
                  )} />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400 flex items-center gap-1.5">
                  Check-list Equipamentos
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(equipmentStatus[selectedTriageRoom] || {}).map(([item, checked]) => (
                    <button
                      key={item}
                      onClick={() => toggleEquipment(selectedTriageRoom, item)}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border text-[9px] font-black uppercase transition-all cursor-pointer",
                        checked 
                          ? "bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-250/20 dark:border-emerald-800/20 text-emerald-600 dark:text-emerald-400" 
                          : "bg-red-500/10 dark:bg-red-950/20 border-red-250/20 dark:border-red-800/20 text-red-600 dark:text-red-400 opacity-60"
                      )}
                    >
                      {item}
                      {checked ? <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-450" /> : <AlertCircle className="h-3 w-3 text-red-500 dark:text-red-450" />}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-xl rounded-xl overflow-hidden transition-all duration-500">
            <CardHeader className="pb-3 border-b border-slate-200/40 dark:border-slate-800/40">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-[#006699] dark:text-sky-400" />
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-[#006699] dark:text-sky-400">Histórico Recente</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {patients
                  .filter(p => p.triaged && p.sector === "Aguardando Médico")
                  .sort((a, b) => new Date(b.arrivalTime).getTime() - new Date(a.arrivalTime).getTime())
                  .slice(0, 3)
                  .map((p) => (
                    <div key={p.id} className="flex flex-col p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/30 dark:border-slate-800/30 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className={cn("w-1.5 h-1.5 rounded-full",
                          p.risk === 'emergency' ? "bg-red-500" :
                          p.risk === 'very-urgent' ? "bg-orange-500" :
                          p.risk === 'urgent' ? "bg-amber-500" :
                          p.risk === 'less-urgent' ? "bg-green-500" :
                          "bg-blue-500"
                        )} />
                        <span className="text-[8px] font-bold text-muted-foreground">{p.ticket}</span>
                      </div>
                      <p className="text-[10px] font-bold text-foreground truncate uppercase">{formatWords(p.name)}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

        {/* Triage Modal - Modern Popup Experience */}
        <Dialog open={showFlowcharts} onOpenChange={(open) => {
          if (!open) {
            setShowFlowcharts(false);
            setSelectedPatient(null);
          }
        }}>
          <DialogContent className="max-w-[1280px] w-[95vw] p-0 overflow-hidden border-none shadow-2xl bg-transparent [&>button]:hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>Triagem de Paciente - {formatWords(selectedPatient?.name || "")}</DialogTitle>
              <DialogDescription>Processo de classificação de risco e coleta de dados clínicos.</DialogDescription>
            </DialogHeader>
            <AnimatePresence mode="wait">
              {selectedPatient && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                >
                  <Card className="glass-card shadow-2xl border-primary/20 overflow-hidden h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col">
                    <CardHeader className="bg-[#006699]/5 p-8 md:p-10 pb-6 md:pb-8 shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-black mission-control-title uppercase tracking-tight flex items-center gap-2">
                            {activeFlowchart ? (
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const Icon = activeFlowchart.icon;
                                  return <Icon className={`h-5 w-5 ${activeFlowchart.color}`} />;
                                })()}
                                {activeFlowchart.name}
                              </div>
                            ) : isIdentifying ? (
                              <>
                                <Brain className="h-5 w-5 text-[#006699]" />
                                Identificação do Paciente
                              </>
                            ) : isFillingClinical ? (
                              <>
                                <ClipboardList className="h-5 w-5 text-red-500" />
                                Informações Clínicas
                              </>
                            ) : (
                              <>
                                <Stethoscope className="h-5 w-5 text-[#006699]" />
                                Classificação de Risco
                              </>
                            )}
                          </CardTitle>
                          <CardDescription className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            {activeFlowchart
                              ? `Protocolo em curso para ${formatWords(selectedPatient.name)}`
                              : isIdentifying
                              ? `Confirme a identidade de ${formatWords(selectedPatient.name) || 'novo paciente'}`
                              : isFillingClinical
                              ? `Preencha os dados clínicos de ${formatWords(selectedPatient.name)}`
                              : `Escolha o fluxograma baseado na queixa principal do paciente`
                            }
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          {activeFlowchart && (
                            <Badge variant="outline" className="font-black text-xs px-3 py-1 bg-white">
                              Passo {currentStep + 1} de {activeFlowchart.steps.length}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setShowFlowcharts(false);
                              setSelectedPatient(null);
                            }}
                            className="rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                      <div className="p-8 md:p-10">
                        <AnimatePresence mode="wait">
                          {!activeFlowchart && isIdentifying ? (
                            <motion.div
                              key="identification"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="space-y-6"
                            >
                              <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                <div className="space-y-2 md:col-span-2">
                                  <Label className="text-xs font-black uppercase tracking-widest text-[#006699]">Nome Completo *</Label>
                                  <Input
                                    placeholder="Insira o nome completo"
                                    className="h-12 rounded-xl border-primary/20 bg-background/50 text-base font-medium"
                                    value={identificationData.name}
                                    onChange={(e) => setIdentificationData(prev => ({ ...prev, name: formatWords(e.target.value) }))}
                                  />
                                </div>
                                
                                <div className="space-y-2 md:col-span-1">
                                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nome Social</Label>
                                  <Input
                                    placeholder="Como prefere ser chamado"
                                    className="h-12 rounded-xl border-primary/20 bg-background/50 text-base font-medium"
                                    value={identificationData.socialName || ""}
                                    onChange={(e) => setIdentificationData(prev => ({ ...prev, socialName: formatWords(e.target.value) }))}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-xs font-black uppercase tracking-widest text-[#006699]">CPF *</Label>
                                  <Input
                                    placeholder="000.000.000-00"
                                    className="h-12 rounded-xl border-primary/20 bg-background/50 font-mono text-base"
                                    value={identificationData.cpf}
                                    onChange={(e) => setIdentificationData(prev => ({ ...prev, cpf: maskCPF(e.target.value) }))}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs font-black uppercase tracking-widest text-[#006699]">Data de Nascimento *</Label>
                                  <Input
                                    type="date"
                                    className="h-12 rounded-xl border-primary/20 bg-background/50 text-base"
                                    value={identificationData.birthDate}
                                    onChange={(e) => setIdentificationData(prev => ({ ...prev, birthDate: e.target.value }))}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Cartão do SUS</Label>
                                  <Input
                                    placeholder="000 0000 0000 0000"
                                    className="h-12 rounded-xl border-primary/20 bg-background/50 font-mono"
                                    value={identificationData.susCard}
                                    onChange={(e) => setIdentificationData(prev => ({ ...prev, susCard: maskSUS(e.target.value) }))}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nome da Mãe</Label>
                                  <Input
                                    placeholder="Nome completo da mãe"
                                    className="h-12 rounded-xl border-primary/20 bg-background/50"
                                    value={identificationData.motherName}
                                    onChange={(e) => setIdentificationData(prev => ({ ...prev, motherName: formatWords(e.target.value) }))}
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
                                <Button
                                  variant="ghost"
                                  onClick={() => {
                                    setShowFlowcharts(false);
                                    setSelectedPatient(null);
                                  }}
                                  className="rounded-xl h-12 px-6 font-bold text-xs uppercase tracking-widest hover:bg-muted transition-all text-muted-foreground"
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  onClick={() => {
                                    if (!identificationData.name || !identificationData.cpf || !identificationData.birthDate) {
                                      toast.error("Por favor, preencha os campos obrigatórios (*)");
                                      return;
                                    }
                                    if (identificationData.susCard && !validateSUS(identificationData.susCard)) {
                                      toast.error("Cartão do SUS inválido");
                                      return;
                                    }
                                    
                                    const birthDate = new Date(identificationData.birthDate);
                                    const age = new Date().getFullYear() - birthDate.getFullYear();
                                    
                                    const updatedPatient = { 
                                      ...selectedPatient, 
                                      ...identificationData, 
                                      age: isNaN(age) ? selectedPatient.age : age 
                                    } as Patient;
                                    
                                    updatePatient(selectedPatient.id, updatedPatient);
                                    setSelectedPatient(updatedPatient);
                                    setIsIdentifying(false);
                                    setIsFillingClinical(true);
                                  }}
                                  className="rounded-xl h-14 px-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 bg-[#006699] hover:bg-[#005580] text-white gap-2 transition-all hover:scale-[1.02]"
                                >
                                  <CheckCircle2 className="h-5 w-5" />
                                  Confirmar e Prosseguir
                                </Button>
                              </div>
                            </motion.div>
                          ) : !activeFlowchart && isFillingClinical ? (
                            <motion.div
                              key="clinical-info"
                              initial={{ opacity: 0, scale: 0.98, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.98, y: -10 }}
                              className="space-y-10"
                            >
                              {/* Header Card Premium */}
                              <div className="bg-gradient-to-r from-[#006699] to-[#004466] rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-[#006699]/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                  <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                                      <Stethoscope className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                      <h3 className="text-xl font-black tracking-tight mission-control-title leading-tight">Coleta de Dados Clínicos</h3>
                                      <div className="flex items-center gap-3 mt-1.5">
                                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3">{formatWords(selectedPatient.name)}</Badge>
                                        <div className="flex items-center gap-2 opacity-70">
                                          <div className="h-1 w-1 rounded-full bg-white" />
                                          <span className="text-[10px] font-bold uppercase tracking-widest">Senha: {selectedPatient.ticket || "N/A"}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    {activeFlowchart && (
                                      <Badge variant="outline" className="font-black text-xs px-3 py-1 bg-white">
                                        Passo {currentStep + 1} de {activeFlowchart.steps.length}
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-4 bg-black/15 p-1 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                                    <div className="text-right px-4 py-1">
                                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5 whitespace-nowrap">Status da Sessão</p>
                                      <div className="flex items-center gap-2.5 justify-end">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse shrink-0" />
                                        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-400 whitespace-nowrap">Em Atendimento</span>
                                      </div>
                                    </div>
                                    <div className="h-10 w-px bg-white/10" />
                                    <div className="px-5 h-12 flex items-center justify-center bg-white/5 rounded-[1rem] border border-white/5 shadow-inner">
                                      <span className="text-xl font-black tracking-tighter text-white/90">
                                        {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Bento Lado Esquerdo: Neurologia e Sinais Vitais */}
                                <div className="lg:col-span-4 space-y-8">
                                  {/* Sinais Vitais */}
                                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-border shadow-soft relative overflow-hidden flex flex-col">
                                    <div className="flex items-center justify-between mb-10 shrink-0">
                                      <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-[1.25rem] bg-[#006699]/10 flex items-center justify-center text-[#006699]">
                                          <Activity className="h-5 w-5" />
                                        </div>
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#006699]">Sinais Vitais</h4>
                                      </div>
                                      
                                      {lastCalculatedRisk && lastCalculatedRisk !== 'not-urgent' && (
                                        <motion.div 
                                          initial={{ opacity: 0, x: 20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          className={cn(
                                            "flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm transition-all",
                                            lastCalculatedRisk === 'emergency' ? "bg-red-500 text-white border-red-600" :
                                            lastCalculatedRisk === 'very-urgent' ? "bg-orange-600 text-white border-orange-700" :
                                            lastCalculatedRisk === 'urgent' ? "bg-[#FFDE21] text-black border-yellow-400" :
                                            lastCalculatedRisk === 'less-urgent' ? "bg-green-500 text-white border-green-600" : "bg-blue-600 text-white border-blue-700"
                                          )}
                                        >
                                          <AlertCircle className={cn("h-3.5 w-3.5", (lastCalculatedRisk === 'emergency' || lastCalculatedRisk === 'very-urgent') && "animate-pulse")} />
                                          <span className="text-[9px] font-black uppercase tracking-widest">Risco Detectado</span>
                                        </motion.div>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-12 gap-4 grow content-start">
                                        {[
                                          { label: "PA (mmHg)", key: "pa", icon: Droplets, placeholder: "120/80", color: "text-sky-500", bgColor: "bg-sky-500/10", borderColor: "border-sky-500/20", mask: maskPA, span: "col-span-6" },
                                          { label: "FC (BPM)", key: "fc", icon: Heart, placeholder: "000", color: "text-red-500", bgColor: "bg-red-500/10", borderColor: "border-red-500/20", mask: maskFC, span: "col-span-6" },
                                          { label: "SpO2 (%)", key: "spo2", icon: Zap, placeholder: "90", color: "text-amber-500", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20", mask: maskSPO2, span: "col-span-6" },
                                          { label: "Temp (°C)", key: "temperature", icon: Thermometer, placeholder: "36.5", color: "text-orange-500", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/20", mask: maskTemp, span: "col-span-6" },
                                          { label: "Glicemia", key: "glicemia", icon: Syringe, placeholder: "100", color: "text-emerald-500", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20", mask: maskGlicemia, span: "col-span-6" },
                                          { label: "FR (irpm)", key: "fr", icon: Wind, placeholder: "18", color: "text-indigo-500", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500/20", mask: maskFR, span: "col-span-6" },
                                        ].map((vit) => {
                                          const value = clinicalData[vit.key as keyof typeof clinicalData] as string;
                                          const hasValue = value && value.trim() !== "";
                                          const severity = getVitalSeverity(vit.key, value);
                                          
                                          return (
                                            <div key={vit.key} className={cn("space-y-2 group", vit.span)}>
                                              <div className="flex items-center justify-between px-1">
                                                <Label className={cn(
                                                  "text-[9px] font-black uppercase tracking-[0.2em] transition-colors",
                                                  hasValue ? "text-foreground" : "text-muted-foreground/50 group-focus-within:text-[#006699]"
                                                )}>
                                                  {vit.label}
                                                </Label>
                                                {severity !== 'normal' && (
                                                  <motion.span
                                                    animate={{ opacity: [1, 0.5, 1] }}
                                                    className={cn(
                                                      "text-[8px] font-black uppercase tracking-widest",
                                                      severity === 'emergency' ? "text-red-600" : "text-orange-500"
                                                    )}
                                                  >
                                                    {severity === 'emergency' ? 'Grave' : 'Alerta'}
                                                  </motion.span>
                                                )}
                                              </div>
                                              <div className="relative">
                                                <div className={cn(
                                                  "absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center transition-all z-20 pointer-events-none shadow-sm",
                                                  hasValue ? (severity === 'emergency' ? 'bg-red-500 shadow-red-200' : severity === 'caution' ? 'bg-orange-500 shadow-orange-200' : vit.bgColor) : "bg-muted/30 group-focus-within:bg-[#006699]/10"
                                                )}>
                                                  <vit.icon className={cn(
                                                    "h-4 w-4 transition-all",
                                                    hasValue ? (severity !== 'normal' ? 'text-white' : vit.color) : "text-muted-foreground/30 group-focus-within:text-[#006699]"
                                                  )} />
                                                </div>
                                                <Input
                                                  value={value}
                                                  onChange={(e) => {
                                                    const masked = vit.mask(e.target.value);
                                                    setClinicalData(prev => ({ ...prev, [vit.key]: masked }));
                                                  }}
                                                  placeholder={vit.placeholder}
                                                  className={cn(
                                                    "h-16 rounded-2xl border-2 font-black text-xl text-center transition-all shadow-inner placeholder:text-muted-foreground/40 pr-4 pl-4",
                                                    hasValue 
                                                      ? (severity === 'emergency' ? "bg-red-50 border-red-200 text-red-900 focus-visible:ring-red-200" : severity === 'caution' ? "bg-orange-50 border-orange-200 text-orange-900 focus-visible:ring-orange-200" : `bg-white dark:bg-slate-900 ${vit.borderColor} border-opacity-70 text-foreground ring-1 ring-offset-0 ${vit.borderColor.replace('border-', 'ring-')}/20`)
                                                      : "bg-muted/10 border-transparent hover:bg-muted/20 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#006699]/10 focus-visible:border-[#006699]/30"
                                                  )}
                                                />
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  </div>

                                  {/* Novo Card Glasgow Premium */}
                                  <div 
                                    onClick={() => setOpenGlasgowCalc(true)}
                                    className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-border shadow-soft relative overflow-hidden group cursor-pointer hover:border-[#006699]/30 transition-all active:scale-[0.98]"
                                  >
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                      <Brain className="h-24 w-24 -mr-8 -mt-8" />
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10">
                                      <div className="h-14 w-14 rounded-2xl bg-[#006699]/10 flex items-center justify-center text-[#006699] shadow-inner group-hover:scale-110 transition-transform">
                                        <Brain className="h-7 w-7" />
                                      </div>
                                      <div className="flex flex-col grow">
                                        <div className="flex items-center justify-between">
                                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006699]">Neurologia</Label>
                                          <div className={cn(
                                            "h-2 w-2 rounded-full animate-pulse",
                                            (() => {
                                              const score = parseInt(clinicalData.glasgow.split('/')[0]) || 15;
                                              if (!clinicalData.glasgow) return "bg-slate-300";
                                              if (score <= 8) return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
                                              if (score <= 12) return "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]";
                                              if (score <= 14) return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]";
                                              return "bg-emerald-500";
                                            })()
                                          )} />
                                        </div>
                                        <h4 className="text-lg font-black uppercase tracking-tight text-foreground mt-0.5">Escala de Glasgow</h4>
                                        <div className="flex items-center gap-2 mt-2">
                                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 bg-muted/20 px-2 py-1 rounded-md">Status:</span>
                                          <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                                            (() => {
                                              const score = parseInt(clinicalData.glasgow.split('/')[0]) || 15;
                                              if (!clinicalData.glasgow) return "text-[#006699] bg-sky-500/5";
                                              if (score <= 8) return "text-red-600 bg-red-500/10";
                                              if (score <= 12) return "text-orange-600 bg-orange-500/10";
                                              if (score <= 14) return "text-amber-600 bg-amber-500/10";
                                              return "text-emerald-600 bg-emerald-500/10";
                                            })()
                                          )}>
                                            {clinicalData.glasgow ? (
                                              (() => {
                                                const score = parseInt(clinicalData.glasgow.split('/')[0]) || 15;
                                                let label = "Normal";
                                                if (score <= 8) label = "Grave / Emergência";
                                                else if (score <= 12) label = "Moderado / Muito Urgente";
                                                else if (score <= 14) label = "Leve / Urgente";
                                                return `${label} (${score} pts)`;
                                              })()
                                            ) : "Aguardando Avaliação"}
                                          </span>
                                        </div>
                                      </div>
                                      <ChevronRight className="h-5 w-5 text-[#006699]/40 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                  </div>
                                </div>

                                {/* Bento Lado Direito: Anamnese e Avaliação */}
                                <div className="lg:col-span-8 space-y-8">
                                  {/* Queixa e Perfil Clínico */}
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                    <div className="md:col-span-12 lg:col-span-7 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-border shadow-soft">
                                      <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                          <div className="h-10 w-10 rounded-[1.25rem] bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                            <MessageSquare className="h-5 w-5" />
                                          </div>
                                          <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">Relato e Histórico</h4>
                                        </div>
                                      </div>

                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between px-1">
                                          <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Queixa Principal *</Label>
                                        </div>
                                        <div className="relative group">
                                          <Textarea
                                            placeholder="Descreva detalhadamente os sintomas que trouxeram o paciente..."
                                            className="min-h-[220px] rounded-[2rem] border-none bg-muted/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-medium tracking-tight p-6 resize-none shadow-inner leading-relaxed"
                                            value={clinicalData.mainComplaint}
                                            onChange={(e) => setClinicalData(prev => ({ ...prev, mainComplaint: formatMedicalText(e.target.value) }))}
                                          />
                                          <div className="absolute right-4 bottom-4">
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="outline" className="h-12 w-12 rounded-2xl bg-white shadow-xl shadow-indigo-100 border-none text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                                                  <Plus className="h-5 w-5" />
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end" className="w-[420px] p-2 rounded-2xl bg-white/95 backdrop-blur-xl border-border/50 shadow-2xl">
                                                <div className="px-3 py-2.5 border-b border-border/50 mb-2">
                                                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006699]">Seletor de Queixas (UPA/SUS)</h5>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1.5">
                                                  {COMPLAINT_OPTIONS.map(opt => {
                                                    const isSelected = clinicalData.mainComplaint.split(",").map(i => i.trim()).includes(opt);
                                                    return (
                                                      <button
                                                        key={opt}
                                                        onClick={() => {
                                                          const currentItems = clinicalData.mainComplaint.split(",").map(i => i.trim()).filter(i => i !== "");
                                                          let newItems;
                                                          if (isSelected) {
                                                            newItems = currentItems.filter(i => i !== opt);
                                                          } else {
                                                            newItems = [...currentItems, opt];
                                                          }
                                                          setClinicalData(prev => ({ ...prev, mainComplaint: newItems.join(", ") }));
                                                        }}
                                                        className={cn(
                                                          "flex items-center gap-2.5 p-2 rounded-xl transition-all group text-left",
                                                          isSelected ? "bg-indigo-50 border-indigo-200" : "hover:bg-muted border-transparent"
                                                        )}
                                                      >
                                                        <div className={cn(
                                                          "h-1.5 w-1.5 rounded-full transition-colors",
                                                          isSelected ? "bg-indigo-500" : "bg-indigo-200 group-hover:bg-indigo-400"
                                                        )} />
                                                        <span className={cn(
                                                          "text-[11px] font-bold transition-colors",
                                                          isSelected ? "text-indigo-700" : "text-muted-foreground group-hover:text-foreground"
                                                        )}>{opt}</span>
                                                        {isSelected && <Check className="h-3 w-3 ml-auto text-indigo-500" />}
                                                      </button>
                                                    );
                                                  })}
                                                </div>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="md:col-span-12 lg:col-span-5 space-y-6">
                                      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-border shadow-soft">
                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-2.5">
                                              <div className="h-7 w-7 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                                                <Stethoscope className="h-4 w-4" />
                                              </div>
                                              <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Comorbidades</Label>
                                            </div>
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <button className="text-[9px] font-black uppercase tracking-widest text-[#006699] hover:opacity-70 transition-opacity flex items-center gap-1">
                                                  <Plus className="h-3 w-3" /> Sugestões
                                                </button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end" className="w-[300px] p-2 rounded-2xl bg-white shadow-2xl border-border/50">
                                                <div className="grid grid-cols-2 gap-1">
                                                  {HISTORY_OPTIONS.map(opt => {
                                                    const isSelected = clinicalData.comorbidities.split(",").map(i => i.trim()).includes(opt);
                                                    return (
                                                      <button
                                                        key={opt}
                                                        onClick={() => {
                                                          const currentItems = clinicalData.comorbidities.split(",").map(i => i.trim()).filter(i => i !== "");
                                                          let newItems;
                                                          if (isSelected) {
                                                            newItems = currentItems.filter(i => i !== opt);
                                                          } else {
                                                            newItems = [...currentItems, opt];
                                                          }
                                                          setClinicalData(prev => ({ ...prev, comorbidities: newItems.join(", ") }));
                                                        }}
                                                        className={cn(
                                                          "flex items-center gap-2 p-2 rounded-xl transition-all group text-left",
                                                          isSelected ? "bg-sky-50 border-sky-100" : "hover:bg-muted border-transparent"
                                                        )}
                                                      >
                                                        <div className={cn(
                                                          "h-1.5 w-1.5 rounded-full transition-colors",
                                                          isSelected ? "bg-sky-500" : "bg-border group-hover:bg-[#006699]"
                                                        )} />
                                                        <span className={cn(
                                                          "text-[10px] font-bold transition-colors",
                                                          isSelected ? "text-sky-700" : "text-muted-foreground group-hover:text-foreground"
                                                        )}>{opt}</span>
                                                        {isSelected && <Check className="h-3 w-3 ml-auto text-sky-500" />}
                                                      </button>
                                                    );
                                                  })}
                                                </div>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>
                                          <Input
                                            placeholder="Ex: HAS, DM, Asma..."
                                            className="h-[60px] rounded-2xl border-none bg-muted/40 font-bold px-5"
                                            value={clinicalData.comorbidities}
                                            onChange={(e) => setClinicalData(prev => ({ ...prev, comorbidities: formatMedicalText(e.target.value) }))}
                                          />
                                        </div>
                                      </div>
                                      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-border shadow-soft">
                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-2.5">
                                              <div className="h-7 w-7 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
                                                <ShieldAlert className="h-4 w-4" />
                                              </div>
                                              <Label className="text-[10px] font-black uppercase text-red-500 tracking-widest">Alergias Relatadas</Label>
                                            </div>
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <button className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:opacity-70 transition-opacity flex items-center gap-1">
                                                  <Plus className="h-3 w-3" /> Sugestões
                                                </button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end" className="w-[200px] p-2 rounded-2xl bg-white shadow-2xl border-border/50">
                                                <div className="grid grid-cols-1 gap-1">
                                                  {ALLERGY_OPTIONS.map(opt => {
                                                    const isSelected = clinicalData.allergies.split(",").map(i => i.trim()).includes(opt);
                                                    return (
                                                      <button
                                                        key={opt}
                                                        onClick={() => {
                                                          const currentItems = clinicalData.allergies.split(",").map(i => i.trim()).filter(i => i !== "");
                                                          let newItems;
                                                          if (isSelected) {
                                                            newItems = currentItems.filter(i => i !== opt);
                                                          } else {
                                                            newItems = [...currentItems, opt];
                                                          }
                                                          setClinicalData(prev => ({ ...prev, allergies: newItems.join(", ") }));
                                                        }}
                                                        className={cn(
                                                          "flex items-center gap-2 p-2 rounded-xl transition-all group text-left",
                                                          isSelected ? "bg-red-50 border-red-200" : "hover:bg-muted border-transparent"
                                                        )}
                                                      >
                                                        <div className={cn(
                                                          "h-1.5 w-1.5 rounded-full transition-colors",
                                                          isSelected ? "bg-red-500" : "bg-red-200 group-hover:bg-red-500"
                                                        )} />
                                                        <span className={cn(
                                                          "text-[10px] font-bold transition-colors",
                                                          isSelected ? "text-red-700" : "text-muted-foreground group-hover:text-red-700"
                                                        )}>{opt}</span>
                                                        {isSelected && <Check className="h-3 w-3 ml-auto text-red-500" />}
                                                      </button>
                                                    );
                                                  })}
                                                </div>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>
                                          <Input
                                            placeholder="Ex: Alimentos, Medicamentos..."
                                            className="h-[60px] rounded-2xl border-none bg-red-500/5 font-bold px-5 focus-visible:bg-white text-red-700 placeholder:text-red-200"
                                            value={clinicalData.allergies}
                                            onChange={(e) => setClinicalData(prev => ({ ...prev, allergies: formatMedicalText(e.target.value) }))}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Weight & Medications Row */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-border shadow-soft flex items-center gap-6">
                                      <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                                        <Scale className="h-6 w-6" />
                                      </div>
                                      <div className="grow space-y-2">
                                        <div className="flex items-center justify-between px-1">
                                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Peso (kg)</Label>
                                          <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-mono opacity-40 uppercase">Aferição Infantil/Geral</span>
                                          </div>
                                        </div>
                                        <div className="relative group">
                                          <Input 
                                            placeholder="Ex: 12.500 ou 75.0"
                                            className="h-12 rounded-[1.25rem] border-none bg-muted/30 font-bold px-4"
                                            value={clinicalData.weight}
                                            onChange={(e) => {
                                              const val = e.target.value.replace(/[^0-9.]/g, '');
                                              setClinicalData(prev => ({ ...prev, weight: val }));
                                            }}
                                          />
                                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/40 pointer-events-none">
                                            KG
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-border shadow-soft flex items-center gap-6">
                                      <div className="h-12 w-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
                                        <Pill className="h-6 w-6" />
                                      </div>
                                      <div className="grow min-w-0 space-y-2">
                                        <div className="flex items-center justify-between gap-4 px-1">
                                          <Label className="text-[10px] font-black uppercase tracking-widest text-[#006699]/60 truncate">Medicamentos Contínuos</Label>
                                          <div className="flex items-center gap-3 shrink-0">
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <button className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-[#006699] transition-colors flex items-center gap-1">
                                                  <Plus className="h-3 w-3" /> Sugestões
                                                </button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border-border/50">
                                                {["Losartana", "Metformina", "Atenolol", "Anlodipino", "Enalapril", "Hidroclorotiazida", "Dipirona", "Paracetamol", "Aspirina", "Nega"].map(opt => {
                                                  const isSelected = clinicalData.currentMedications.split(",").map(i => i.trim()).includes(opt);
                                                  return (
                                                    <button
                                                      key={opt}
                                                      onClick={() => {
                                                        const currentItems = clinicalData.currentMedications.split(",").map(i => i.trim()).filter(i => i !== "");
                                                        let newItems;
                                                        if (isSelected) {
                                                          newItems = currentItems.filter(i => i !== opt);
                                                        } else {
                                                          newItems = [...currentItems, opt];
                                                        }
                                                        setClinicalData(prev => ({ ...prev, currentMedications: newItems.join(", ") }));
                                                      }}
                                                      className={cn(
                                                        "w-full text-left p-2 rounded-lg transition-all text-[10px] font-bold flex items-center justify-between",
                                                        isSelected ? "bg-sky-50 text-sky-700" : "hover:bg-muted text-muted-foreground"
                                                      )}
                                                    >
                                                      {opt}
                                                      {isSelected && <Check className="h-3 w-3 text-sky-500" />}
                                                    </button>
                                                  );
                                                })}
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                            <button 
                                              onClick={() => setOpenMedicationSelector(true)}
                                              className="text-[9px] font-black uppercase tracking-widest text-[#006699] hover:opacity-70 transition-opacity flex items-center gap-1.5"
                                            >
                                              <Sparkles className="h-3 w-3" /> Biblioteca
                                            </button>
                                          </div>
                                        </div>
                                        <Input placeholder="Em uso..." className="h-12 rounded-[1.25rem] border-none bg-sky-500/5 font-bold px-4 focus-visible:bg-white transition-all shadow-inner" value={clinicalData.currentMedications} onChange={(e) => setClinicalData(prev => ({ ...prev, currentMedications: formatMedicalText(e.target.value)}))} />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Classificação Final */}
                                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-border shadow-soft space-y-8">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-[1.25rem] bg-rose-500/10 flex items-center justify-center text-rose-500">
                                          <AlertCircle className="h-5 w-5" />
                                        </div>
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">Nível de Severidade</h4>
                                      </div>
                                      
                                      {lastCalculatedRisk && (
                                        <motion.div 
                                          initial={{ opacity: 0, x: 20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          className="flex items-center gap-3 bg-muted/30 px-5 py-2 rounded-2xl border border-border/50 relative"
                                        >
                                          {/* Efeito de brilho sincronizado se for urgente */}
                                          {lastCalculatedRisk !== 'not-urgent' && (
                                            <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
                                              <motion.div 
                                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className={cn(
                                                  "absolute inset-0 bg-gradient-to-r",
                                                  lastCalculatedRisk === 'emergency' ? "from-red-500/10 to-transparent" :
                                                  "from-amber-500/10 to-transparent"
                                                )}
                                              />
                                            </div>
                                          )}

                                          {lastCalculatedRisk && (
                                            <div className="text-right z-10">
                                              <div className="flex items-center gap-2 justify-end mb-0.5">
                                                {lastCalculatedRisk !== 'not-urgent' && (
                                                  <motion.span 
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" 
                                                  />
                                                )}
                                                <p className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest">Sugestão do Sistema</p>
                                              </div>
                                              <p className={cn(
                                                "text-[10px] font-black uppercase tracking-tight",
                                              lastCalculatedRisk === 'emergency' ? "text-red-500" :
                                              lastCalculatedRisk === 'very-urgent' ? "text-orange-500" :
                                              lastCalculatedRisk === 'urgent' ? "text-amber-500" :
                                              lastCalculatedRisk === 'less-urgent' ? "text-green-600" : "text-blue-600"
                                              )}>
                                                {lastCalculatedRisk === 'emergency' ? 'Emergência' : lastCalculatedRisk === 'very-urgent' ? 'Muito Urgente' : lastCalculatedRisk === 'urgent' ? 'Urgente' : lastCalculatedRisk === 'less-urgent' ? 'Pouco Urgente' : 'Não Urgente'}
                                              </p>
                                            </div>
                                          )}
                                          {lastCalculatedRisk && (
                                            <>
                                              <Badge className={cn(
                                                "h-10 w-10 rounded-xl border-none p-0 flex items-center justify-center shadow-lg transition-transform active:scale-95 z-10",
                                                lastCalculatedRisk === 'emergency' ? "bg-red-500 shadow-red-500/20" :
                                                lastCalculatedRisk === 'very-urgent' ? "bg-orange-500 shadow-orange-500/20" :
                                                lastCalculatedRisk === 'urgent' ? "bg-[#FFDE21] shadow-[#FFDE21]/20" :
                                                lastCalculatedRisk === 'less-urgent' ? "bg-green-500 shadow-green-500/20" : "bg-blue-600 shadow-blue-500/20"
                                              )}>
                                                <Activity className="h-5 w-5 text-white" />
                                              </Badge>

                                              {/* Popup dinâmico adjacente */}
                                              {lastCalculatedRisk && lastCalculatedRisk !== 'not-urgent' && (
                                                <motion.div
                                                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                                  className={cn(
                                                    "absolute -top-6 -left-2 text-white text-[7px] font-black uppercase px-2 py-1 rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 tracking-widest pointer-events-none",
                                                    lastCalculatedRisk === 'emergency' ? "bg-red-500" :
                                                    lastCalculatedRisk === 'very-urgent' ? "bg-orange-600" :
                                                    lastCalculatedRisk === 'urgent' ? "bg-yellow-400 text-black border-yellow-500" :
                                                    lastCalculatedRisk === 'less-urgent' ? "bg-green-500" : "bg-blue-600"
                                                  )}
                                                >
                                                  Protocolo Detectado
                                                  <div className={cn(
                                                    "absolute bottom-[-4px] left-3 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px]",
                                                    lastCalculatedRisk === 'emergency' ? "border-t-red-500" :
                                                    lastCalculatedRisk === 'very-urgent' ? "border-t-orange-600" :
                                                    lastCalculatedRisk === 'urgent' ? "border-t-yellow-400" :
                                                    lastCalculatedRisk === 'less-urgent' ? "border-t-green-500" : "border-t-blue-600"
                                                  )} />
                                                </motion.div>
                                              )}
                                            </>
                                          )}
                                        </motion.div>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                      {[
                                        { id: 'emergency', label: 'Emergência', color: 'bg-red-500', icon: AlertCircle, shadow: 'shadow-red-500/30' },
                                        { id: 'very-urgent', label: 'Muito Urgente', color: 'bg-orange-500', icon: Clock, shadow: 'shadow-orange-500/30' },
                                        { id: 'urgent', label: 'Urgente', color: 'bg-[#FFDE21]', icon: HeartPulse, shadow: 'shadow-[#FFDE21]/30', iconColor: 'text-black' },
                                        { id: 'less-urgent', label: 'Pouco Urgente', color: 'bg-green-500', icon: Stethoscope, shadow: 'shadow-green-500/30' },
                                        { id: 'not-urgent', label: 'Não Urgente', color: 'bg-blue-600', icon: Pill, shadow: 'shadow-blue-500/30' },
                                        { id: 'evasion', label: 'Evasão', color: 'bg-slate-400', icon: Ban, shadow: 'shadow-slate-400/30' },
                                      ].map((risk) => (
                                        <button
                                          key={risk.id}
                                          onClick={() => setSelectedRisk(risk.id as 'emergency' | 'very-urgent' | 'urgent' | 'less-urgent' | 'not-urgent')}
                                          className={cn(
                                            "flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border-2 transition-all group relative overflow-hidden",
                                            selectedRisk === risk.id 
                                              ? `${risk.color} border-transparent ${risk.iconColor || 'text-white'} ${risk.shadow} scale-[1.04] z-10 shadow-2xl` 
                                              : lastCalculatedRisk === risk.id
                                                ? "bg-white border-dashed border-2 grow-0 border-current"
                                                : "bg-muted/10 border-transparent text-muted-foreground/40 hover:bg-muted/20"
                                          )}
                                          style={selectedRisk !== risk.id && lastCalculatedRisk === risk.id ? { 
                                            borderColor: risk.id === 'emergency' ? '#ef4444' : 
                                                        risk.id === 'very-urgent' ? '#f97316' :
                                                        risk.id === 'urgent' ? '#facc15' :
                                                        risk.id === 'less-urgent' ? '#22c55e' : '#2563eb'
                                          } : {}}
                                        >
                                          {/* Indicador de Sugestão se não selecionado */}
                                          {selectedRisk !== risk.id && lastCalculatedRisk === risk.id && (
                                            <motion.div 
                                              initial={{ y: -20 }}
                                              animate={{ y: 0 }}
                                              className="absolute top-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow-sm border border-current flex items-center gap-1"
                                              style={{ color: risk.id === 'emergency' ? '#ef4444' : 
                                                              risk.id === 'very-urgent' ? '#f97316' :
                                                              risk.id === 'urgent' ? '#facc15' :
                                                              risk.id === 'less-urgent' ? '#22c55e' : '#2563eb' }}
                                            >
                                              <Sparkles className="h-2 w-2" />
                                              <span className="text-[6px] font-black uppercase">Sugestão</span>
                                            </motion.div>
                                          )}
                                          <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center transition-all",
                                            selectedRisk === risk.id ? "bg-white/20 scale-110" : "bg-muted/30 group-hover:bg-muted/50"
                                          )}>
                                            <risk.icon className={cn("h-8 w-8 transition-transform group-hover:scale-110", selectedRisk === risk.id ? (risk.iconColor || "text-white") : "text-muted-foreground/20")} />
                                          </div>
                                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center leading-tight">{risk.label}</span>
                                          {selectedRisk === risk.id && (
                                            <div className="absolute top-4 right-4">
                                              <CheckCircle2 className="h-5 w-5 text-white/50" />
                                            </div>
                                          )}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-dashed">
                                      <div className="flex items-center gap-2 mb-2 px-1">
                                        <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] uppercase px-3">Enfermeiro(a)</Badge>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Justificativa da Decisão Clínica</span>
                                      </div>
                                      <div className="grid grid-cols-1 gap-6">
                                        <div className="col-span-full">
                                          <Textarea
                                            placeholder="Descreva fundamentadamente os critérios que definiram esta classificação..."
                                            className="min-h-[140px] rounded-[1.5rem] border-none bg-muted/30 focus:bg-white focus:ring-4 focus:ring-[#006699]/5 transition-all text-sm font-medium p-5 shadow-inner"
                                            value={clinicalData.justification}
                                            onChange={(e) => setClinicalData(prev => ({ ...prev, justification: formatMedicalText(e.target.value) }))}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Footer Actions Premium */}
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-border/40">
                                <div className="flex gap-4">
                                  <Button
                                    variant="ghost"
                                    onClick={() => { setIsIdentifying(true); setIsFillingClinical(false); }}
                                    className="h-16 px-8 rounded-2xl font-black text-xs uppercase tracking-widest bg-muted/30 hover:bg-muted text-muted-foreground transition-all group"
                                  >
                                    <ArrowLeft className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                                    Dados do Paciente
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsExamsModalOpen(true)}
                                    className="h-16 px-8 rounded-2xl font-black text-xs uppercase tracking-widest text-purple-600 border-purple-200 hover:bg-purple-50 transition-all dark:text-purple-400 dark:border-purple-900/50 dark:hover:bg-purple-900/20"
                                  >
                                    <FlaskConical className="h-5 w-5 mr-3" />
                                    Solicitar Exames
                                  </Button>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                  <Button
                                    variant="ghost"
                                    onClick={() => { setShowFlowcharts(false); setSelectedPatient(null); }}
                                    className="h-16 px-8 rounded-2xl font-black text-xs uppercase tracking-widest text-muted-foreground hover:text-red-500 hover:bg-red-50/50 transition-all flex-1 sm:flex-none"
                                  >
                                    Descartar
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      if (!clinicalData.mainComplaint) { toast.error("Preencha a queixa principal"); return; }
                                      if (!selectedRisk) { toast.error("Selecione uma cor de classificação"); return; }
                                      completeTriage(selectedRisk);
                                    }}
                                    className="h-16 px-12 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-[#006699] hover:bg-[#005580] text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex-1 sm:flex-none shadow-blue-200"
                                  >
                                    <CheckCircle2 className="h-5 w-5 mr-3" />
                                    Finalizar Atendimento
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ) : null}
                  </AnimatePresence>
                </div>
              </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>


      {/* Novo Paciente Modal */}
      <Dialog open={showNewPatientModal} onOpenChange={setShowNewPatientModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <DialogHeader className="p-8 pb-0">
            <div className="flex items-center gap-3">
              <div>
                <DialogTitle className="text-2xl mission-control-title bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Admiss\xE3o de Paciente</DialogTitle>
                <DialogDescription className="font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
                  <UserPlus className="h-4 w-4 text-primary animate-pulse" />
                  CADASTRO INTEGRAL DE PRONTU\xC1RIO
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleNewPatientSubmit} className="space-y-6 p-8">
            {/* DADOS PESSOAIS */}
            <Card className="glass-card border-0 shadow-xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10 p-8">
                <CardTitle className="text-xl mission-control-title flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <UserPlus className="h-6 w-6 text-primary" />
                  </div>
                  DADOS DE IDENTIFICA\xC7\xC3O
                </CardTitle>
                <CardDescription className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground mt-2 opacity-60">REGISTRO OBRIGAT\xD3RIO PARA TRIAGEM</CardDescription>
              </CardHeader>
              <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nome Completo *</Label>
                  <Input
                    placeholder="Insira o nome completo sem abrevia\xE7\xF5es"
                    className="h-12 rounded-xl border-primary/20 bg-background/50"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nome Social</Label>
                  <Input
                    placeholder="Como o paciente prefere ser chamado"
                    className="h-12 rounded-xl border-primary/20 bg-background/50"
                    value={formData.socialName}
                    onChange={(e) => handleChange("socialName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">CPF *</Label>
                  <Input
                    placeholder="000.000.000-00"
                    className="h-12 rounded-xl border-primary/20 bg-background/50 font-mono"
                    value={formData.cpf}
                    onChange={(e) => handleChange("cpf", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Cartão do SUS</Label>
                  <Input
                    placeholder="000 0000 0000 0000"
                    className="h-12 rounded-xl border-primary/20 bg-background/50 font-mono"
                    value={formData.susCard}
                    onChange={(e) => handleChange("susCard", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Data de Nascimento *</Label>
                  <Input
                    type="date"
                    className="h-12 rounded-xl border-primary/20 bg-background/50"
                    value={formData.birthDate}
                    onChange={(e) => handleChange("birthDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sexo</Label>
                  <Select onValueChange={(v) => handleChange("gender", v)}>
                    <SelectTrigger className="h-12 rounded-xl border-primary/20 bg-background/50">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Celular</Label>
                  <Input
                    placeholder="(00) 00000-0000"
                    className="h-12 rounded-xl border-primary/20 bg-background/50"
                    value={formData.phone1}
                    onChange={(e) => handleChange("phone1", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Telefone p/ Contato</Label>
                  <Input
                    placeholder="(00) 0000-0000"
                    className="h-12 rounded-xl border-primary/20 bg-background/50"
                    value={formData.phone2}
                    onChange={(e) => handleChange("phone2", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">E-mail</Label>
                  <Input
                    type="email"
                    placeholder="exemplo@email.com"
                    className="h-12 rounded-xl border-primary/20 bg-background/50"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* ENDERE\xC7O */}
            <Card className="glass-card border-0 shadow-xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border p-8">
                <CardTitle className="text-xl mission-control-title flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                    <MapPin className="h-6 w-6 text-muted-foreground" />
                  </div>
                  LOCALIZA\xC7\xC3O E CONTATO
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">CEP</Label>
                  <Input
                    placeholder="00000-000"
                    className="h-12 rounded-xl border-border bg-background/50"
                    value={formData.cep}
                    onChange={(e) => handleChange("cep", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Logradouro</Label>
                  <Input
                    placeholder="Rua, Avenida..."
                    className="h-12 rounded-xl border-border bg-background/50"
                    value={formData.street}
                    onChange={(e) => handleChange("street", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">N\xFAmero</Label>
                  <Input
                    placeholder="N\xBA"
                    className="h-12 rounded-xl border-border bg-background/50"
                    value={formData.number}
                    onChange={(e) => handleChange("number", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Complemento</Label>
                  <Input
                    placeholder="Apto, Bloco, etc."
                    className="h-12 rounded-xl border-border bg-background/50"
                    value={formData.complement}
                    onChange={(e) => handleChange("complement", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Bairro</Label>
                  <Input
                    placeholder="Ex: Centro"
                    className="h-12 rounded-xl border-border bg-background/50"
                    value={formData.neighborhood}
                    onChange={(e) => handleChange("neighborhood", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Cidade</Label>
                  <Input
                    placeholder="Cidade"
                    className="h-12 rounded-xl border-border bg-background/50"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">UF</Label>
                  <Input
                    placeholder="UF"
                    maxLength={2}
                    className="h-12 rounded-xl border-border bg-background/50 uppercase"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value.toUpperCase())}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
               <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Info className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium italic">Confirme as informações antes de finalizar o registro.</p>
               </div>
               <div className="flex gap-3 w-full md:w-auto">
                  <Button type="button" variant="outline" onClick={() => setShowNewPatientModal(false)} className="rounded-xl px-8 h-12 font-bold uppercase tracking-wider">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 md:flex-none gap-2 rounded-xl px-10 h-12 font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                    <Save className="h-5 w-5" />
                    Cadastrar Paciente
                  </Button>
               </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Glasgow Calculator Dialog */}
      <Dialog open={openGlasgowCalc} onOpenChange={setOpenGlasgowCalc}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-none shadow-2xl [&>button]:hidden">
          <DialogHeader className="bg-[#006699] p-6 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Brain className="h-24 w-24 rotate-12" />
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black uppercase tracking-tight leading-none">Escala de Glasgow</DialogTitle>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 mt-1">Avaliação de nível de consciência</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpenGlasgowCalc(false)}
                className="text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#006699]">Abertura Ocular (AO)</Label>
                <Select 
                  value={glasgowValues.eye.toString()} 
                  onValueChange={(v) => setGlasgowValues(prev => ({ ...prev, eye: parseInt(v) }))}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-2 border-[#006699]/10 bg-white shadow-sm font-bold text-sm focus:ring-[#006699]/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-[#006699]/10 shadow-xl p-2">
                    {GLASGOW_EYE.map(item => (
                      <SelectItem key={item.value} value={item.value.toString()} className="rounded-xl font-bold text-xs py-3">{item.value} - {item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#006699]">Resposta Verbal (RV)</Label>
                <Select 
                  value={glasgowValues.verbal.toString()} 
                  onValueChange={(v) => setGlasgowValues(prev => ({ ...prev, verbal: parseInt(v) }))}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-2 border-[#006699]/10 bg-white shadow-sm font-bold text-sm focus:ring-[#006699]/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-[#006699]/10 shadow-xl p-2">
                    {GLASGOW_VERBAL.map(item => (
                      <SelectItem key={item.value} value={item.value.toString()} className="rounded-xl font-bold text-xs py-3">{item.value} - {item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#006699]">Resposta Motora (RM)</Label>
                <Select 
                  value={glasgowValues.motor.toString()} 
                  onValueChange={(v) => setGlasgowValues(prev => ({ ...prev, motor: parseInt(v) }))}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-2 border-[#006699]/10 bg-white shadow-sm font-bold text-sm focus:ring-[#006699]/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-[#006699]/10 shadow-xl p-2">
                    {GLASGOW_MOTOR.map(item => (
                      <SelectItem key={item.value} value={item.value.toString()} className="rounded-xl font-bold text-xs py-3">{item.value} - {item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-[#006699]/5 rounded-xl p-6 flex items-center justify-between border border-[#006699]/10">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#006699]/60">Pontuação Total</p>
                <h3 className="text-4xl font-black tracking-tighter text-[#006699]">
                  {glasgowValues.eye + glasgowValues.verbal + glasgowValues.motor}
                </h3>
              </div>
              <Badge style={{
                background:
                  glasgowValues.eye + glasgowValues.verbal + glasgowValues.motor <= 8 ? '#dc2626' :
                  glasgowValues.eye + glasgowValues.verbal + glasgowValues.motor <= 12 ? '#f97316' :
                  glasgowValues.eye + glasgowValues.verbal + glasgowValues.motor <= 14 ? '#f59e0b' :
                  '#10b981'
              }} className="h-14 px-6 rounded-2xl font-black text-xs uppercase tracking-widest border-none shadow-xl text-white">
                {glasgowValues.eye + glasgowValues.verbal + glasgowValues.motor <= 8 ? 'Alerta / Crítico' :
                 glasgowValues.eye + glasgowValues.verbal + glasgowValues.motor <= 12 ? 'Urgente / Moderado' :
                 glasgowValues.eye + glasgowValues.verbal + glasgowValues.motor <= 14 ? 'Alerta / Leve' :
                 'Alerta / Normal'}
              </Badge>
            </div>

            <Button
              onClick={() => {
                const total = glasgowValues.eye + glasgowValues.verbal + glasgowValues.motor;
                let status = 'Alerta';
                if (total < 15) status = total >= 13 ? 'Leve' : total >= 9 ? 'Moderada' : 'Grave';
                setClinicalData(prev => ({ ...prev, glasgow: `${total} / ${status} (AO:${glasgowValues.eye} RV:${glasgowValues.verbal} RM:${glasgowValues.motor})` }));
                setOpenGlasgowCalc(false);
              }}
              className="w-full h-16 rounded-xl bg-[#006699] hover:bg-[#005580] text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-[#006699]/20 group transition-all"
            >
              Aplicar ao Prontuário
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Medication Selector Dialog */}
      <Dialog open={openMedicationSelector} onOpenChange={setOpenMedicationSelector}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border-none shadow-3xl bg-slate-50 dark:bg-slate-950 max-h-[90vh] flex flex-col [&>button]:hidden">
          <div className="bg-[#006699] p-6 text-white relative shrink-0">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Pill className="h-32 w-32 rotate-12" />
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
                  <Pill className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black uppercase tracking-tight leading-none">Biblioteca de Medicamentos</DialogTitle>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 mt-1">Selecione os medicamentos de uso contínuo</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {clinicalData.currentMedications && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-1.5 border border-white/10"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Itens:</span>
                    <span className="text-lg font-black leading-none">{clinicalData.currentMedications.split(',').filter(Boolean).length}</span>
                  </motion.div>
                )}

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setClinicalData(prev => ({ ...prev, currentMedications: "" }));
                    toast.info("Lista de medicamentos limpa");
                  }}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-10 px-4 gap-2 font-black text-[9px] uppercase tracking-widest transition-all border border-white/10 backdrop-blur-sm"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Limpar
                </Button>

                <button 
                  onClick={() => setOpenMedicationSelector(false)}
                  className="h-10 w-10 rounded-xl bg-black/20 hover:bg-black/30 flex items-center justify-center text-white/50 hover:text-white transition-all shadow-lg backdrop-blur-sm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative group max-w-xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-white transition-all" />
              <Input 
                placeholder="Busca rápida por nome..." 
                className="h-12 pl-12 pr-6 rounded-xl bg-white/10 border-white/10 text-white text-base font-bold placeholder:text-white/30 focus-visible:bg-white/20 focus-visible:ring-0 focus-visible:border-white/30 transition-all shadow-inner backdrop-blur-md"
                value={medSearch}
                onChange={(e) => setMedSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="max-w-2xl mx-auto space-y-4 pb-4">
              {medSearch && MEDICATION_CATEGORIES.every(cat => !cat.items.some(i => i.toLowerCase().includes(medSearch.toLowerCase()))) && (
                <div className="py-24 text-center">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                    <div className="h-20 w-20 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center mx-auto shadow-inner">
                      <SearchCode className="h-10 w-10 text-slate-400" />
                    </div>
                    <p className="text-lg font-black text-slate-600 dark:text-slate-400 uppercase tracking-tight">Sem resultados</p>
                  </motion.div>
                </div>
              )}

              {MEDICATION_CATEGORIES.map((category) => {
                const filteredItems = category.items.filter(item => 
                  item.toLowerCase().includes(medSearch.toLowerCase())
                );

                if (medSearch && filteredItems.length === 0) return null;

                const categoryData = {
                  "Hipertensão / Coração": { icon: Heart, color: "text-rose-500 bg-rose-500/10" },
                  "Diabetes": { icon: Activity, color: "text-emerald-500 bg-emerald-500/10" },
                  "Controlados (Psicotrópicos)": { icon: Brain, color: "text-indigo-500 bg-indigo-500/10" },
                  "Estômago / Outros": { icon: Pill, color: "text-orange-500 bg-orange-500/10" }
                }[category.name] || { icon: Pill, color: "text-sky-500 bg-sky-500/10" };

                return (
                  <div key={category.name} className="space-y-3">
                    <div className="flex items-center gap-3 px-1">
                      <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", categoryData.color)}>
                        <categoryData.icon className="h-4 w-4" />
                      </div>
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                        {category.name}
                      </Label>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-4 shadow-sm">
                      <div className="flex flex-wrap gap-2">
                        {filteredItems.map((med) => {
                          const isSelected = clinicalData.currentMedications.split(",").map(i => i.trim()).includes(med);
                          return (
                            <button
                              key={med}
                              type="button"
                              onClick={() => {
                                const current = clinicalData.currentMedications;
                                if (isSelected) {
                                  const list = current.split(",").map(i => i.trim()).filter(i => i !== med);
                                  setClinicalData(prev => ({ ...prev, currentMedications: list.join(", ") }));
                                } else {
                                  const newValue = current ? `${current}, ${med}` : med;
                                  setClinicalData(prev => ({ ...prev, currentMedications: newValue }));
                                }
                              }}
                              className={cn(
                                "text-[10px] font-bold px-4 py-3 rounded-xl border transition-all duration-300 uppercase tracking-tight flex items-center gap-2",
                                isSelected
                                  ? 'bg-[#006699] text-white border-[#006699] shadow-lg shadow-[#006699]/20 scale-[0.98]'
                                  : 'bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 border-transparent hover:bg-white dark:hover:bg-slate-800 hover:border-[#006699]/30 hover:text-[#006699] hover:shadow-md'
                              )}
                            >
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                              {med}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 relative shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="hidden sm:block">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Lista Provisória</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-foreground">Salvo automaticamente</span>
                </div>
              </div>
              
              <Button 
                className="h-16 flex-1 sm:flex-none sm:w-80 rounded-2xl bg-[#006699] hover:bg-[#005580] text-white font-black uppercase tracking-[0.2em] text-lg shadow-xl shadow-[#006699]/30 transition-all active:scale-[0.98] group flex items-center justify-center p-0 overflow-hidden"
                onClick={() => {
                  setOpenMedicationSelector(false);
                  toast.success("Medicamentos atualizados");
                }}
              >
                <div className="bg-white/10 h-full px-6 flex items-center justify-center border-r border-white/10">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="px-6 grow text-center">Concluir</div>
                <ChevronRight className="h-5 w-5 mr-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Call Control Dialog */}
      <Dialog open={showCallControl} onOpenChange={setShowCallControl}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl [&>button]:hidden">
          <DialogHeader className={cn(
            "p-6 text-white transition-colors duration-500",
            callingTicket?.risk === 'emergency' ? 'bg-red-600' :
            callingTicket?.risk === 'very-urgent' ? 'bg-orange-500' :
            callingTicket?.risk === 'urgent' ? 'bg-yellow-500 text-black' :
            callingTicket?.risk === 'less-urgent' ? 'bg-green-500' :
            (callingTicket?.priority === 'preferential' ? 'bg-purple-600' : 
             callingTicket?.priority === 'pediatric' ? 'bg-orange-500' : 'bg-[#006699]')
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Megaphone className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black uppercase tracking-tight text-white">Controle de Chamada</DialogTitle>
                  <DialogDescription className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mt-0.5",
                    callingTicket?.risk === 'urgent' ? 'text-black/60' : 'text-white/70'
                  )}>Sincronizado com o Painel Central</DialogDescription>
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="icon" 
                className="bg-white text-black hover:bg-white/90 rounded-xl h-10 w-10 shadow-lg border-none"
                onClick={() => setShowCallControl(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-8 bg-background text-center">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Chamando agora</p>
              <h2 className={cn(
                "text-7xl font-black tracking-tighter leading-none mb-4",
                callingTicket?.risk === 'emergency' ? 'text-red-600' :
                callingTicket?.risk === 'very-urgent' ? 'text-orange-600' :
                callingTicket?.risk === 'urgent' ? 'text-black font-black' :
                callingTicket?.risk === 'less-urgent' ? 'text-green-600' :
                (callingTicket?.priority === 'preferential' ? 'text-purple-600' : 
                 callingTicket?.priority === 'pediatric' ? 'text-orange-600' : 'text-[#006699]')
              )}>{callingTicket?.ticket}</h2>
              {callingTicket?.patientName.toUpperCase().includes('NÃO IDENTIFICADO') || callingTicket?.patientName.toUpperCase().includes('DESCONHECIDO') ? (
                <p className="text-sm font-bold text-slate-400 uppercase italic">SENHA {callingTicket?.ticket}</p>
              ) : (
                <>
                  <p className="text-sm font-bold text-slate-500 uppercase">{callingTicket?.patientName}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{callingTicket?.age} ANOS • CPF: {callingTicket?.cpf}</p>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Local de Chamada</p>
                <div className="flex p-1 bg-muted rounded-2xl w-full max-w-xs border border-border shadow-inner">
                  {["TRIAGEM 1", "TRIAGEM 2"].map((room) => (
                    <button
                      key={room}
                      onClick={() => setSelectedTriageRoom(room)}
                      className={cn(
                        "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                        selectedTriageRoom === room 
                          ? "bg-white text-[#006699] shadow-lg scale-100" 
                          : "text-muted-foreground hover:text-foreground scale-95"
                      )}
                    >
                      {room}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => {
                  if (callingTicket) {
                    callTicket(callingTicket.ticket, selectedTriageRoom, callingTicket.risk, callingTicket.patientName);
                    toast.success("Chamada enviada novamente ao painel.");
                  }
                }}
                className={cn(
                  "h-16 rounded-2xl text-white font-black uppercase tracking-widest text-sm shadow-xl gap-3 transition-all duration-300",
                  callingTicket?.risk === 'emergency' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' :
                  callingTicket?.risk === 'very-urgent' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-600/20' :
                  callingTicket?.risk === 'urgent' ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20' :
                  callingTicket?.risk === 'less-urgent' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' :
                  'bg-[#006699] hover:bg-[#005580] shadow-[#006699]/20'
                )}
              >
                <Volume2 className="h-6 w-6" />
                Chamar Novamente
              </Button>

              <div 
                className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`p-2 rounded-lg ${isAudioEnabled ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                    {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase">Áudio do Painel</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">{isAudioEnabled ? 'Ativado (Voz + Chime)' : 'Desativado (Mudo)'}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "h-8 w-14 rounded-full transition-all relative flex items-center shrink-0",
                    isAudioEnabled ? "bg-green-500" : "bg-slate-400"
                  )}
                >
                  <div className={cn(
                    "absolute h-6 w-6 rounded-full bg-white transition-all shadow-md",
                    isAudioEnabled ? "right-1" : "left-1"
                  )} />
                </div>
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
      <PatientDetailsModal 
        patient={patientForModal}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
      {/* Exams Modal Dialog */}
      <Dialog open={isExamsModalOpen} onOpenChange={setIsExamsModalOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border-0 shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-blue-600" /> Solicitar Exames
            </DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <ExamsModal patient={selectedPatient} onClose={() => setIsExamsModalOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
