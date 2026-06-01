import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "sonner";

export interface Patient {
  id: string;
  name: string;
  age: number;
  cpf: string;
  status: 'waiting' | 'attending' | 'completed' | 'evasion';
  subStatus?: 'reaval' | 'exam_pending' | 'medication_pending';
  risk: 'emergency' | 'very-urgent' | 'urgent' | 'less-urgent' | 'not-urgent' | 'evasion';
  arrivalTime: string;
  sector?: string;
  mainComplaint?: string;
  socialName?: string;
  birthDate?: string;
  gender?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  bloodType?: string;
  allergies?: string;
  currentMedications?: string;
  motherName?: string;
  susCard?: string;
  ticket?: string;
  priority?: 'normal' | 'preferential' | 'pediatric' | 'emergency';
  triaged?: boolean;
  responsibleProfessional?: string;
  registrationComplete?: boolean;
  motherName?: string;
  companionName?: string;
  companionRelation?: string;
  companionCpf?: string;
  companionPhone?: string;
  attendanceType?: string;
  
  // Novos Campos Complementares (Sócio-demográficos)
  rg?: string;
  organIssuer?: string;
  nationality?: string;
  birthPlace?: string;
  race?: string;
  maritalStatus?: string;
  profession?: string;
  religion?: string;
  pcd?: string;

  // Sinais Vitais
  fc?: string;
  pa?: string;
  fr?: string;
  spo2?: string;
  temperature?: string;
  glasgow?: string;
  glicemia?: string;
  weight?: string | number;
  // Anamnese
  evolutionTime?: string;
  comorbidities?: string;
  vaccination?: string;
  justification?: string;
  // Exame Visual
  skinColor?: string;
  hydration?: string;
  painPattern?: string;
  evolutions?: EvolutionRecord[];
  admissionRequest?: {
    status: 'pending' | 'allocated';
    bedType: 'emergency' | 'observation';
    requestedAt: string;
    doctor: string;
  };
  exams?: ExamRequest[];
  dischargePrediction?: string;
  isolation?: ('contact' | 'droplet' | 'airborne')[];
  transferRequest?: {
    status: 'requested' | 'accepted' | 'denied';
    hospitalName?: string;
    requestedAt: string;
    reason: string;
    priority: 'normal' | 'urgent' | 'emergency';
  };
}

export type ExamStatus = 'pending_collection' | 'in_analysis' | 'completed';

export interface ExamRequest {
  id: string;
  type: 'lab' | 'image';
  name: string;
  priority: 'normal' | 'urgent';
  status: ExamStatus;
  requestedAt: string;
  doctor: string;
  result?: string;
  releasedAt?: string;
  deadline?: string; // ISO timestamp for SLA countdown
  isCritical?: boolean;
  attachmentUrl?: string;
  observations?: string;
}

export interface EvolutionRecord {
  id: string;
  type: string;
  professional: string;
  description: string;
  timestamp: string;
  cid?: string;
}

export interface Call {
  id: string;
  patientName: string;
  room: string;
  time: string;
  risk: Patient['risk'];
  ticket?: string;
}

const now = new Date();
const getPastTime = (minutes: number) => new Date(now.getTime() - minutes * 60000).toISOString();

const mockPatients: Patient[] = [
  { 
    id: '1', 
    name: 'Maria Silva', 
    age: 45, 
    cpf: '123.456.789-01', 
    susCard: '700000000000001', 
    status: 'attending', 
    risk: 'emergency', 
    arrivalTime: getPastTime(15), 
    sector: 'Emergência 1', 
    responsibleProfessional: 'Dr. Ricardo Braga', 
    mainComplaint: 'Dor torácica intensa', 
    ticket: 'E001', 
    priority: 'emergency',
    phone1: '(11) 98765-4321',
    email: 'maria.silva@example.com',
    currentMedications: 'Enalapril 20mg, Metformina 850mg',
    allergies: 'Dipirona',
    city: 'São Paulo',
    state: 'SP',
    evolutions: [
      { id: 'ev-1', type: 'Triagem', professional: 'Enf. Juliana', description: 'Paciente apresenta dor precordial súbita, escala de dor 8/10.', timestamp: getPastTime(10) }
    ]
  },
  { 
    id: '15', 
    name: 'Dr. Ricardo Braga', 
    age: 42, 
    cpf: '999.888.777-66', 
    status: 'attending', 
    risk: 'urgent', 
    arrivalTime: getPastTime(10), 
    sector: 'Consultório Clínico 1', 
    responsibleProfessional: 'Dr. Marcos Vale', 
    mainComplaint: 'Dor no peito', 
    ticket: 'N015', 
    priority: 'normal', 
    phone1: '(11) 99999-8888',
    currentMedications: 'Nenhum',
    evolutions: [
      {
        id: 'e1',
        type: 'Conduta Médica',
        professional: 'Dr. Marcos Vale',
        description: 'Encaminhamento para exames de emergência cardiológica. Exames sugeridos: Eletrocardiograma (ECG) e Exames Cardiológicos.',
        timestamp: new Date().toLocaleString('pt-BR')
      }
    ] 
  },
  { id: '2', name: 'Antônio Rocha', age: 60, cpf: '012.345.678-99', susCard: '700000000000002', status: 'waiting', risk: 'emergency', arrivalTime: getPastTime(5), sector: 'Emergência 1', mainComplaint: 'AVC - sinais neuological signals', ticket: 'E002', priority: 'emergency' },
  { id: '3', name: 'João Santos', age: 32, cpf: '234.567.890-11', susCard: '700000000000003', status: 'waiting', risk: 'very-urgent', arrivalTime: getPastTime(25), sector: 'Emergência 2', mainComplaint: 'Febre alta e convulsão', ticket: 'P001', priority: 'preferential' },
  { id: '4', name: 'Pedro Almeida', age: 72, cpf: '987.654.321-02', susCard: '700000000000004', status: 'attending', risk: 'very-urgent', arrivalTime: getPastTime(45), sector: 'Emergência 2', responsibleProfessional: 'Dra. Claudia Ramos', mainComplaint: 'Dispneia severa', ticket: 'P002', priority: 'preferential' },
  { id: '5', name: 'Ana Oliveira', age: 67, cpf: '345.678.901-22', susCard: '700000000000005', status: 'waiting', risk: 'urgent', arrivalTime: getPastTime(20), sector: 'Consultório Clínico 1', mainComplaint: 'Dor abdominal aguda', ticket: 'N001', priority: 'normal' },
  { id: '6', name: 'Lucia Ferreira', age: 38, cpf: '222.333.444-55', status: 'completed', risk: 'urgent', arrivalTime: getPastTime(120), sector: 'Consultório Clínico 1', mainComplaint: 'Crise asmática', ticket: 'N002', priority: 'normal' },
  { id: '7', name: 'Carlos Souza', age: 28, cpf: '444.555.666-77', status: 'attending', risk: 'less-urgent', arrivalTime: getPastTime(35), sector: 'Consultório Clínico 2', responsibleProfessional: 'Dr. Marcos Vale', mainComplaint: 'Entorse no tornozelo', ticket: 'N003', priority: 'normal' },
  { id: '8', name: 'Roberto Costa', age: 50, cpf: '890.123.456-77', status: 'waiting', risk: 'less-urgent', arrivalTime: getPastTime(40), sector: 'Consultório Clínico 2', mainComplaint: 'Dor lombar', ticket: 'N004', priority: 'normal' },
  { id: '9', name: 'Beatriz Lima', age: 55, cpf: '567.890.123-44', status: 'waiting', risk: 'not-urgent', arrivalTime: getPastTime(60), sector: 'Consultório Clínico 3', mainComplaint: 'Receita médica', ticket: 'N005', priority: 'normal' },
  { id: '10', name: 'Fernanda Dias', age: 24, cpf: '888.999.000-11', status: 'completed', risk: 'not-urgent', arrivalTime: getPastTime(180), sector: 'Consultório Clínico 3', mainComplaint: 'Gripe', ticket: 'N006', priority: 'normal' },
  { id: '11', name: 'Ricardo Oliveira', age: 40, cpf: '555.666.777-88', status: 'waiting', risk: 'not-urgent', arrivalTime: getPastTime(10), ticket: 'N007', priority: 'normal', triaged: false },
  { id: '12', name: 'Juliana Mendes', age: 29, cpf: '111.222.333-44', status: 'waiting', risk: 'less-urgent', arrivalTime: getPastTime(15), ticket: 'P003', priority: 'preferential', triaged: false },
  { id: '13', name: 'Enrico Ferreira', age: 5, cpf: '222.333.444-55', status: 'waiting', risk: 'not-urgent', arrivalTime: getPastTime(3), ticket: 'C013', priority: 'pediatric', triaged: false, sector: 'Triagem Pediatria' },
  { id: '14', name: 'Valentina Lima', age: 2, cpf: '777.888.999-00', status: 'waiting', risk: 'urgent', arrivalTime: getPastTime(5), ticket: 'C014', priority: 'pediatric', triaged: false, sector: 'Triagem Pediatria' },
  { id: 'p-1', name: 'Ana Beatriz Souza Costa', age: 10, cpf: '100.200.300-44', status: 'waiting', risk: 'less-urgent', arrivalTime: getPastTime(2), ticket: 'C020', priority: 'pediatric', triaged: false },
  { id: 'p-2', name: 'João Pedro Lima Oliveira', age: 8, cpf: '200.300.400-55', status: 'waiting', risk: 'urgent', arrivalTime: getPastTime(1), ticket: 'C021', priority: 'pediatric', triaged: false },
  { id: 'p-3', name: 'Maria Eduarda Silva Santos', age: 12, cpf: '300.400.500-66', status: 'waiting', risk: 'not-urgent', arrivalTime: getPastTime(0), ticket: 'N030', priority: 'normal', triaged: false },
  { id: 'p-4', name: 'Luiz Felipe Gomes Pereira', age: 25, cpf: '400.500.600-77', status: 'waiting', risk: 'less-urgent', arrivalTime: getPastTime(4), ticket: 'N031', priority: 'normal', triaged: false },
  { id: 'p-5', name: 'Carlos Eduardo Souza Rodrigues', age: 30, cpf: '500.600.700-88', status: 'waiting', risk: 'urgent', arrivalTime: getPastTime(8), ticket: 'N032', priority: 'normal', triaged: false },
  { id: 'p-6', name: 'Larissa Mendes Ferreira Lima', age: 19, cpf: '600.700.800-99', status: 'waiting', risk: 'not-urgent', arrivalTime: getPastTime(12), ticket: 'N033', priority: 'normal', triaged: false },
  { id: 'p-7', name: 'André Luis Castro Nunes Rocha', age: 44, cpf: '700.800.900-11', status: 'waiting', risk: 'urgent', arrivalTime: getPastTime(15), ticket: 'N034', priority: 'normal', triaged: false },
  { id: 'p-8', name: 'Téo Gabriel Souza', age: 7, cpf: '800.900.000-22', status: 'waiting', risk: 'less-urgent', arrivalTime: getPastTime(18), ticket: 'C025', priority: 'pediatric', triaged: false },
  { id: 'p-9', name: 'Bia Silva Ramos', age: 5, cpf: '900.000.100-33', status: 'waiting', risk: 'not-urgent', arrivalTime: getPastTime(22), ticket: 'C026', priority: 'pediatric', triaged: false },
  { id: 'p-10', name: 'Ian Costa Pereira', age: 15, cpf: '010.111.222-44', status: 'waiting', risk: 'less-urgent', arrivalTime: getPastTime(26), ticket: 'N035', priority: 'normal', triaged: false },
  { id: 'p-11', name: 'Lia Ferreira Neto', age: 22, cpf: '121.222.333-55', status: 'waiting', risk: 'urgent', arrivalTime: getPastTime(30), ticket: 'N036', priority: 'normal', triaged: false },
  { id: 'p-12', name: 'Sol Moraes Lima', age: 28, cpf: '232.333.444-66', status: 'waiting', risk: 'less-urgent', arrivalTime: getPastTime(35), ticket: 'N037', priority: 'normal', triaged: false },
];

interface PatientsContextType {
  patients: Patient[];
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  addPatient: (patient: Omit<Patient, "id">) => void;
  currentCall: Call | null;
  callHistory: Call[];
  callPatient: (patient: Patient) => void;
  registerArrival: (data: { cpf: string; birthDate: string; motherName: string; susCard?: string; priority: 'normal' | 'preferential' | 'pediatric' | 'emergency'; name?: string }) => { ticket: string; patient: Patient };
  callTicket: (ticket: string, room: string, risk?: Patient['risk'], name?: string) => void;
  reCall: () => void;
  addEvolution: (patientId: string, evolution: Omit<EvolutionRecord, "id" | "timestamp">) => void;
  isAudioEnabled: boolean;
  setIsAudioEnabled: (enabled: boolean) => void;
  isAnnouncing: boolean;
  setIsAnnouncing: (is: boolean) => void;
  resetSystem: () => void;
  requestAdmission: (patientId: string, bedType: 'emergency' | 'observation', doctor: string) => void;
  requestExam: (patientId: string, exam: Omit<ExamRequest, "id" | "status" | "requestedAt">) => void;
  updateExamStatus: (patientId: string, examId: string, status: ExamStatus, result?: string, isCritical?: boolean, attachmentUrl?: string) => void;
  cancelExam: (patientId: string, examId: string) => void;
  recollectExam: (patientId: string, examId: string, reason: string) => void;
  requestTransfer: (patientId: string, priority: 'normal' | 'urgent' | 'emergency', reason: string) => void;
  updateTransferStatus: (patientId: string, status: 'accepted' | 'denied', hospitalName?: string) => void;
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('upa_patients');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Patient[];
        // Merge mock patients that might be missing (like the new pediatric ones)
        const missingMock = mockPatients.filter(mp => !parsed.some(p => p.id === mp.id));
        if (missingMock.length > 0) {
          return [...parsed, ...missingMock];
        }
        return parsed;
      } catch (e) {
        return mockPatients;
      }
    }
    return mockPatients;
  });
  const [currentCall, setCurrentCall] = useState<Call | null>(() => {
    const saved = localStorage.getItem('upa_current_call');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [callHistory, setCallHistory] = useState<Call[]>(() => {
    const saved = localStorage.getItem('upa_call_history');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('upa_audio_enabled_v6');
    try {
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });
  const [isAnnouncing, setIsAnnouncing] = useState(false);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('upa_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('upa_current_call', JSON.stringify(currentCall));
  }, [currentCall]);

  useEffect(() => {
    localStorage.setItem('upa_call_history', JSON.stringify(callHistory));
  }, [callHistory]);

  useEffect(() => {
    localStorage.setItem('upa_audio_enabled_v6', JSON.stringify(isAudioEnabled));
  }, [isAudioEnabled]);

  // Listen for changes from other tabs and sync context state
  useEffect(() => {
    const channel = new BroadcastChannel('upa_sync_channel');
    
    const syncAll = () => {
      try {
        const pSavedStr = localStorage.getItem('upa_patients');
        const cSavedStr = localStorage.getItem('upa_current_call');
        const hSavedStr = localStorage.getItem('upa_call_history');
        const aSavedStr = localStorage.getItem('upa_audio_enabled_v6');
        const coSavedStr = localStorage.getItem('upa_counters');

        if (pSavedStr) {
          const newVal = JSON.parse(pSavedStr);
          setPatients(prev => (JSON.stringify(prev) !== pSavedStr) ? newVal : prev);
        } else if (!pSavedStr && localStorage.length === 0) {
          // If storage is empty, it was likely reset
          setPatients(mockPatients);
          setCurrentCall(null);
          setCallHistory([]);
          setCounters({ normal: 0, preferential: 0, pediatric: 0, emergency: 0 });
          return;
        }

        if (!cSavedStr) {
          setCurrentCall(null);
        } else {
          try {
            const newVal = JSON.parse(cSavedStr);
            setCurrentCall(prev => (!prev || JSON.stringify(prev) !== cSavedStr) ? newVal : prev);
          } catch (e) {
            setCurrentCall(null);
          }
        }

        if (hSavedStr) {
          const newVal = JSON.parse(hSavedStr);
          setCallHistory(prev => (JSON.stringify(prev) !== hSavedStr) ? newVal : prev);
        } else {
          setCallHistory([]);
        }

        if (aSavedStr) {
          const newVal = JSON.parse(aSavedStr);
          setIsAudioEnabled(prev => prev !== newVal ? newVal : prev);
        }

        if (coSavedStr) {
          const newVal = JSON.parse(coSavedStr);
          setCounters(prev => (JSON.stringify(prev) !== coSavedStr) ? newVal : prev);
        }
      } catch (err) {
        console.error("Sync error:", err);
      }
    };

    channel.onmessage = (event) => {
      if (event.data === 'sync_all' || event.data === 'new_call') {
        syncAll();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('upa_')) {
        syncAll();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', syncAll);
    
    // Frequent interval check as a robust fallback for cross-tab sync
    const interval = setInterval(syncAll, 1000);

    return () => {
      channel.close();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', syncAll);
      clearInterval(interval);
    };
  }, []);
  
  // Persistence and Daily Rotation logic
  const [counters, setCounters] = useState<{ normal: number; preferential: number; pediatric: number; emergency: number }>(() => {
    const saved = localStorage.getItem('upa_counters');
    const today = new Date().toISOString().split('T')[0];
    const lastReset = localStorage.getItem('upa_last_reset');

    if (saved && lastReset === today) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure pediatric counter exists for older saves
        return { normal: 0, preferential: 0, pediatric: 0, emergency: 0, ...parsed };
      } catch (e) {
        return { normal: 0, preferential: 0, pediatric: 0, emergency: 0 };
      }
    }
    
    // New day or first run
    localStorage.setItem('upa_last_reset', today);
    const initial = { normal: 0, preferential: 0, pediatric: 0, emergency: 0 };
    localStorage.setItem('upa_counters', JSON.stringify(initial));
    return initial;
  });

  const saveCounters = (newCounters: typeof counters) => {
    setCounters(newCounters);
    localStorage.setItem('upa_counters', JSON.stringify(newCounters));
    localStorage.setItem('upa_last_reset', new Date().toISOString().split('T')[0]);
  };

  /**
   * Returns true if birthDate corresponds to a child aged 0 to 11 years, 11 months and 29 days.
   * (i.e., strictly less than 12 years old on today's date)
   */
  const isChild = (birthDate: string): boolean => {
    if (!birthDate) return false;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return false;
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    return years >= 0 && years < 12;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addPatient = (patient: Omit<Patient, "id">) => {
    const newPatient: Patient = {
      ...patient,
      id: Math.random().toString(36).substring(2, 11),
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const callPatient = (patient: Patient) => {
    const displayName = (patient.socialName && patient.socialName.trim()) || patient.name;
    const newCall: Call = {
      id: Math.random().toString(36).substring(2, 11),
      patientName: displayName.toUpperCase(),
      room: patient.sector?.toUpperCase() || "TRIAGEM",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      risk: patient.risk,
      ticket: patient.ticket,
    };

    setCurrentCall(newCall);
    localStorage.setItem('upa_current_call', JSON.stringify(newCall));

    setCallHistory(prev => {
      const newHistory = [newCall, ...prev.filter(c => c.ticket !== newCall.ticket)].slice(0, 8);
      localStorage.setItem('upa_call_history', JSON.stringify(newHistory));
      return newHistory;
    });
    
    // Broadcast change
    new BroadcastChannel('upa_sync_channel').postMessage('new_call');
    
    if (patient.status === 'waiting') {
      updatePatient(patient.id, { status: 'attending' });
    }
  };

  const generateTicket = (priority: 'normal' | 'preferential' | 'pediatric' | 'emergency') => {
    let prefix = 'N';
    if (priority === 'emergency') prefix = 'E';
    else if (priority === 'preferential') prefix = 'P';
    else if (priority === 'pediatric') prefix = 'C';
    else prefix = 'N';

    const next = counters[priority] + 1;
    saveCounters({ ...counters, [priority]: next });
    
    // Simple sequential numeric format (e.g., N001, P001, I001)
    const numericPart = String(next).padStart(3, '0');
    return `${prefix}${numericPart}`;
  };

  const registerArrival: PatientsContextType['registerArrival'] = ({ cpf, birthDate, motherName, susCard, priority, name }) => {
    // Auto-upgrade to pediatric if patient is a child (0–11y 11m 29d),
    // but only if it's not an unidentified case where birthDate defaults to today.
    const effectivePriority = (priority !== 'emergency' && !name?.includes('DESCONHECIDO') && isChild(birthDate)) ? 'pediatric' : priority;
    const ticket = generateTicket(effectivePriority);
    // Try to find existing patient by CPF
    const existing = patients.find(p => p.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, ''));
    
    // Emergency tickets should still go through triage to collect clinical data
    const isEmergencyPriority = effectivePriority === 'emergency';
    const isPediatricPriority = effectivePriority === 'pediatric';
    const autoRisk = isEmergencyPriority ? 'emergency' : undefined;
    const autoSector = isEmergencyPriority ? 'SALA VERMELHA' : (isPediatricPriority ? 'Triagem Pediatria' : undefined);
    const autoStatus = 'waiting';
    const autoTriaged = isEmergencyPriority ? true : false;

    if (existing) {
      const updates: Partial<Patient> = {
        ticket,
        priority: effectivePriority,
        motherName: motherName || existing.motherName,
        birthDate: existing.birthDate || birthDate,
        susCard: susCard || existing.susCard,
        status: autoStatus,
        risk: autoRisk,
        sector: autoSector,
        triaged: autoTriaged,
        arrivalTime: new Date().toISOString(),
      };
      updatePatient(existing.id, updates);
      const updated = { ...existing, ...updates } as Patient;
      return { ticket, patient: updated };
    }
    // Pre-register new patient (minimal data)
    const age = (() => {
      const d = new Date(birthDate);
      if (isNaN(d.getTime())) return 0;
      return new Date().getFullYear() - d.getFullYear();
    })();
    const newPatient: Patient = {
      id: Math.random().toString(36).substring(2, 11),
      name: name || `Pré-cadastro ${ticket}`,
      age,
      cpf,
      status: autoStatus,
      risk: autoRisk,
      sector: autoSector,
      arrivalTime: new Date().toISOString(),
      birthDate,
      motherName,
      susCard,
      ticket,
      priority: effectivePriority,
      triaged: autoTriaged,
      registrationComplete: false,
    };
    setPatients(prev => [...prev, newPatient]);
    return { ticket, patient: newPatient };
  };

  const callTicket: PatientsContextType['callTicket'] = (ticket, room, risk = 'not-urgent', name) => {
    let patientName = name;
    if (!patientName) {
      const patient = patients.find(p => p.ticket === ticket);
      if (patient) {
        patientName = (patient.socialName && patient.socialName.trim()) || patient.name;
      }
    }

    const normalizedName = patientName?.toUpperCase() || "";
    const isUnidentified = normalizedName.includes('NÃO IDENTIFICADO') || normalizedName.includes('DESCONHECIDO');
    const finalName = isUnidentified ? "PACIENTE NÃO IDENTIFICADO" : (patientName ? patientName.toUpperCase() : "PACIENTE");

    const newCall: Call = {
      id: Math.random().toString(36).substring(2, 11),
      patientName: finalName,
      room: room.toUpperCase(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      risk,
      ticket: ticket.toUpperCase(),
    };

    setCurrentCall(newCall);
    localStorage.setItem('upa_current_call', JSON.stringify(newCall));

    setCallHistory(prev => {
      const newHistory = [newCall, ...prev.filter(c => c.ticket !== newCall.ticket)].slice(0, 8);
      localStorage.setItem('upa_call_history', JSON.stringify(newHistory));
      return newHistory;
    });

    // Broadcast change
    new BroadcastChannel('upa_sync_channel').postMessage('new_call');
  };

  const reCall = () => {
    if (!currentCall) return;
    const refreshedCall: Call = {
      ...currentCall,
      id: Math.random().toString(36).substring(2, 11),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCurrentCall(refreshedCall);
    localStorage.setItem('upa_current_call', JSON.stringify(refreshedCall));
    
    // Broadcast change
    new BroadcastChannel('upa_sync_channel').postMessage('new_call');
  };

  const resetSystem = () => {
    // Clear all UPA related data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('upa_')) {
        localStorage.removeItem(key);
      }
    });
    // Reset state to defaults
    setPatients(mockPatients);
    setCurrentCall(null);
    setCallHistory([]);
    setCounters({ normal: 0, preferential: 0, pediatric: 0, emergency: 0 });
    
    // Broadcast reset
    new BroadcastChannel('upa_sync_channel').postMessage('sync_all');
    
    toast.success("Sistema resetado com sucesso.");
    window.location.reload(); // Refresh to ensure all tabs start fresh
  };

  const addEvolution = (patientId: string, evolution: Omit<EvolutionRecord, "id" | "timestamp">) => {
    const newEvolution: EvolutionRecord = {
      ...evolution,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toLocaleString('pt-BR'),
    };

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          evolutions: [newEvolution, ...(p.evolutions || [])]
        };
      }
      return p;
    }));
  };

  const requestAdmission = (patientId: string, bedType: 'emergency' | 'observation', doctor: string) => {
    updatePatient(patientId, {
      admissionRequest: {
        status: 'pending',
        bedType,
        requestedAt: new Date().toISOString(),
        doctor,
      }
    });
    toast.success("Vaga solicitada com sucesso!", {
      description: `O NIR foi notificado para providenciar um leito de ${bedType === 'emergency' ? 'Emergência' : 'Observação'}.`
    });
    new BroadcastChannel('upa_sync_channel').postMessage('sync_all');
  };

  const requestExam = (patientId: string, exam: Omit<ExamRequest, "id" | "status" | "requestedAt">) => {
    const collectionSlaMinutes = 15; // collection deadline
    const newExam: ExamRequest = {
      ...exam,
      id: Math.random().toString(36).substring(2, 11),
      status: 'pending_collection',
      requestedAt: new Date().toISOString(),
      deadline: new Date(Date.now() + collectionSlaMinutes * 60 * 1000).toISOString(),
    };
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          exams: [newExam, ...(p.exams || [])]
        };
      }
      return p;
    }));
    toast.success(`Exame ${exam.name} solicitado com sucesso!`);
    new BroadcastChannel('upa_sync_channel').postMessage('sync_all');
  };

  const analysisSlaMinutes = 30; // analysis deadline
  const updateExamStatus = (patientId: string, examId: string, status: ExamStatus, result?: string, isCritical?: boolean, attachmentUrl?: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const updatedExams = (p.exams || []).map(e => {
          if (e.id === examId) {
            const updated: ExamRequest = {
              ...e,
              status,
              result: result !== undefined ? result : e.result,
              releasedAt: status === 'completed' ? new Date().toISOString() : e.releasedAt,
              isCritical: isCritical !== undefined ? isCritical : e.isCritical,
              attachmentUrl: attachmentUrl !== undefined ? attachmentUrl : e.attachmentUrl,
            };
            // Set new deadline when moving to analysis
            if (status === 'in_analysis') {
              updated.deadline = new Date(Date.now() + analysisSlaMinutes * 60 * 1000).toISOString();
            }
            // Remove deadline when completed
            if (status === 'completed') {
              delete updated.deadline;
            }
            return updated;
          }
          return e;
        });
        return { ...p, exams: updatedExams };
      }
      return p;
    }));
    new BroadcastChannel('upa_sync_channel').postMessage('sync_all');
  };

  const cancelExam = (patientId: string, examId: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, exams: (p.exams || []).filter(e => e.id !== examId) };
      }
      return p;
    }));
    toast.info('Exame cancelado.');
    new BroadcastChannel('upa_sync_channel').postMessage('sync_all');
  };

  const recollectExam = (patientId: string, examId: string, reason: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const updatedExams = (p.exams || []).map(e =>
          e.id === examId
            ? { ...e, status: 'pending_collection' as ExamStatus, result: undefined, releasedAt: undefined, requestedAt: new Date().toISOString() }
            : e
        );
        return { ...p, exams: updatedExams };
      }
      return p;
    }));
    toast.error(`Amostra rejeitada. Motivo: ${reason}. Nova coleta solicitada.`);
    new BroadcastChannel('upa_sync_channel').postMessage('sync_all');
  };

  const requestTransfer = (patientId: string, priority: 'normal' | 'urgent' | 'emergency', reason: string) => {
    updatePatient(patientId, {
      transferRequest: {
        status: 'requested',
        requestedAt: new Date().toISOString(),
        priority,
        reason
      }
    });
    toast.success("Solicitação enviada ao NIR/CROSS.");
    new BroadcastChannel('upa_sync_channel').postMessage('sync_all');
  };

  const updateTransferStatus = (patientId: string, status: 'accepted' | 'denied', hospitalName?: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId && p.transferRequest) {
        return {
          ...p,
          transferRequest: {
            ...p.transferRequest,
            status,
            hospitalName: hospitalName || p.transferRequest.hospitalName
          }
        };
      }
      return p;
    }));
    if (status === 'accepted') toast.success(`Transferência aceita para: ${hospitalName}`);
    else toast.error("Transferência negada pela regulação.");
    new BroadcastChannel('upa_sync_channel').postMessage('sync_all');
  };

  return (
    <PatientsContext.Provider value={{ 
      patients, 
      updatePatient, 
      addPatient, 
      currentCall, 
      callHistory, 
      callPatient, 
      registerArrival, 
      callTicket,
      reCall,
      addEvolution,
      isAudioEnabled,
      setIsAudioEnabled,
      isAnnouncing,
      setIsAnnouncing,
      resetSystem,
      requestAdmission,
      requestExam,
      updateExamStatus,
      cancelExam,
      recollectExam,
      requestTransfer,
      updateTransferStatus,
    }}>
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatientsContext() {
  const context = useContext(PatientsContext);
  if (context === undefined) {
    throw new Error('usePatientsContext must be used within a PatientsProvider');
  }
  return context;
}
