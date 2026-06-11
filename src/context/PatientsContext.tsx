import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "sonner";

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  iconType:
    | "calendar"
    | "activity"
    | "alert"
    | "stethoscope"
    | "pill"
    | "droplet"
    | "check"
    | "flask";
  badge: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  cpf: string;
  status:
    | "waiting"
    | "attending"
    | "completed"
    | "evasion"
    | "evasao"
    | "observation"
    | "interned";
  subStatus?: "reaval" | "exam_pending" | "medication_pending";
  risk:
    | "emergency"
    | "very-urgent"
    | "urgent"
    | "less-urgent"
    | "not-urgent"
    | "evasion";
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
  priority?: "normal" | "preferential" | "pediatric" | "emergency";
  triaged?: boolean;
  responsibleProfessional?: string;
  registrationComplete?: boolean;
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
    status: "pending" | "allocated";
    bedType: "emergency" | "observation";
    requestedAt: string;
    doctor: string;
  };
  exams?: ExamRequest[];
  dischargePrediction?: string;
  isolation?: ("contact" | "droplet" | "airborne")[];
  transferRequest?: {
    status: "requested" | "accepted" | "denied" | "transporting" | "completed";
    hospitalName?: string;
    crossCode?: string;
    ambulanceType?: string;
    requestedAt: string;
    reason: string;
    priority: "normal" | "urgent" | "emergency";
  };
  timeline?: TimelineEvent[];
}

export type ExamStatus = "pending_collection" | "in_analysis" | "completed";

export interface ExamRequest {
  id: string;
  type: "lab" | "image";
  name: string;
  priority: "normal" | "urgent";
  status: ExamStatus;
  requestedAt: string;
  doctor: string;
  result?: string;
  releasedAt?: string;
  deadline?: string; // ISO timestamp for SLA countdown
  isCritical?: boolean;
  attachmentUrl?: string;
  observations?: string;
  readAt?: string;
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
  risk: Patient["risk"];
  ticket?: string;
}

const now = new Date();
const getPastTime = (minutes: number) =>
  new Date(now.getTime() - minutes * 60000).toISOString();

const mockPatients: Patient[] = [
  {
    id: "baby-1",
    name: "Noah Almeida",
    age: 0,
    birthDate: "2026-03-10T10:00:00.000Z",
    cpf: "111.111.111-11",
    susCard: "700000000000002",
    status: "waiting",
    risk: "urgent",
    arrivalTime: getPastTime(10),
    sector: "Consultório Pediátrico",
    mainComplaint: "Febre alta (39.5) e choro persistente",
    ticket: "PED-01",
    priority: "pediatric",
    motherName: "Ana Almeida",
    gender: "M",
  },
  {
    id: "baby-2",
    name: "Helena Santos",
    age: 0,
    birthDate: "2026-05-17T10:00:00.000Z",
    cpf: "222.222.222-22",
    susCard: "700000000000003",
    status: "waiting",
    risk: "very-urgent",
    arrivalTime: getPastTime(5),
    sector: "Emergência Pediátrica",
    mainComplaint: "Desconforto respiratório",
    ticket: "PED-02",
    priority: "pediatric",
    motherName: "Carla Santos",
    gender: "F",
    exams: [
      {
        id: "ex-3",
        type: "lab",
        name: "Hemograma Completo",
        priority: "normal",
        status: "completed",
        requestedAt: getPastTime(60),
        doctor: "Dra. Claudia Ramos",
        releasedAt: getPastTime(10),
        result: "Leucocitose moderada (12.000 mm3). Sem desvio à esquerda.",
      },
    ],
  },
  {
    id: "1",
    name: "Maria Silva",
    age: 45,
    cpf: "123.456.789-01",
    susCard: "700000000000001",
    status: "attending",
    risk: "emergency",
    arrivalTime: getPastTime(15),
    sector: "Emergência 1",
    responsibleProfessional: "Dr. Ricardo Braga",
    mainComplaint: "Dor torácica intensa",
    ticket: "E001",
    priority: "emergency",
    phone1: "(11) 98765-4321",
    email: "maria.silva@example.com",
    currentMedications: "Enalapril 20mg, Metformina 850mg",
    allergies: "Dipirona",
    city: "São Paulo",
    state: "SP",
    evolutions: [
      {
        id: "ev-1",
        type: "Triagem",
        professional: "Enf. Juliana",
        description:
          "Paciente apresenta dor precordial súbita, escala de dor 8/10.",
        timestamp: getPastTime(10),
      },
    ],
    exams: [
      {
        id: "ex-1",
        type: "lab",
        name: "Marcadores Cardíacos (Troponina / CK-MB)",
        priority: "urgent",
        status: "pending_collection",
        requestedAt: getPastTime(5),
        doctor: "Dr. Ricardo Braga",
        deadline: new Date(now.getTime() + 45 * 60000).toISOString(),
        isCritical: true,
      },
      {
        id: "ex-2",
        type: "image",
        name: "Raio-X de Tórax (PA/Perfil)",
        priority: "urgent",
        status: "in_analysis",
        requestedAt: getPastTime(10),
        doctor: "Dr. Ricardo Braga",
        deadline: new Date(now.getTime() + 15 * 60000).toISOString(),
      },
    ],
  },
  {
    id: "15",
    name: "Dr. Ricardo Braga",
    age: 42,
    cpf: "999.888.777-66",
    status: "attending",
    risk: "urgent",
    arrivalTime: getPastTime(10),
    sector: "Consultório Clínico 1",
    responsibleProfessional: "Dr. Marcos Vale",
    mainComplaint: "Dor no peito",
    ticket: "N015",
    priority: "normal",
    phone1: "(11) 99999-8888",
    currentMedications: "Nenhum",
    evolutions: [
      {
        id: "e1",
        type: "Conduta Médica",
        professional: "Dr. Marcos Vale",
        description:
          "Encaminhamento para exames de emergência cardiológica. Exames sugeridos: Eletrocardiograma (ECG) e Exames Cardiológicos.",
        timestamp: new Date().toLocaleString("pt-BR"),
      },
    ],
  },
  {
    id: "2",
    name: "Antônio Rocha",
    age: 60,
    cpf: "012.345.678-99",
    susCard: "700000000000002",
    status: "waiting",
    risk: "emergency",
    arrivalTime: getPastTime(5),
    sector: "Emergência 1",
    mainComplaint: "AVC - sinais neurológicos",
    ticket: "E002",
    priority: "emergency",
    transferRequest: {
      status: "requested",
      requestedAt: getPastTime(140),
      reason: "Vaga de UTI Neurológica - AVC Isquêmico Extenso",
      priority: "emergency",
    },
  },
  {
    id: "3",
    name: "João Santos",
    age: 32,
    cpf: "234.567.890-11",
    susCard: "700000000000003",
    status: "waiting",
    risk: "very-urgent",
    arrivalTime: getPastTime(25),
    sector: "Emergência 2",
    mainComplaint: "Febre alta e convulsão",
    ticket: "P001",
    priority: "preferential",
  },
  {
    id: "4",
    name: "Pedro Almeida",
    age: 72,
    cpf: "987.654.321-02",
    susCard: "700000000000004",
    status: "attending",
    risk: "very-urgent",
    arrivalTime: getPastTime(45),
    sector: "Emergência 2",
    responsibleProfessional: "Dra. Claudia Ramos",
    mainComplaint: "Dispneia severa",
    ticket: "P002",
    priority: "preferential",
  },
  {
    id: "5",
    name: "Ana Oliveira",
    age: 67,
    cpf: "345.678.901-22",
    susCard: "700000000000005",
    status: "waiting",
    risk: "urgent",
    arrivalTime: getPastTime(20),
    sector: "Consultório Clínico 1",
    mainComplaint: "Dor abdominal aguda",
    ticket: "N001",
    priority: "normal",
  },
  {
    id: "6",
    name: "Lucia Ferreira",
    age: 38,
    cpf: "222.333.444-55",
    status: "completed",
    risk: "urgent",
    arrivalTime: getPastTime(120),
    sector: "Consultório Clínico 1",
    mainComplaint: "Crise asmática",
    ticket: "N002",
    priority: "normal",
  },
  {
    id: "12",
    name: "Juliana Mendes",
    age: 29,
    cpf: "111.222.333-44",
    status: "waiting",
    risk: "less-urgent",
    arrivalTime: getPastTime(15),
    ticket: "P003",
    priority: "preferential",
    triaged: false,
  },
  {
    id: "blue-1",
    name: "Carlos Eduardo",
    age: 34,
    cpf: "444.555.666-77",
    susCard: "700000000000006",
    status: "waiting",
    risk: "not-urgent",
    arrivalTime: getPastTime(5),
    sector: "Consultório Clínico 2",
    mainComplaint: "Dor de cabeça leve e coriza",
    ticket: "N020",
    priority: "normal",
    triaged: true,
  },
  {
    id: "blue-2",
    name: "Beatriz Lima",
    age: 22,
    cpf: "888.999.000-11",
    susCard: "700000000000007",
    status: "waiting",
    risk: "not-urgent",
    arrivalTime: getPastTime(2),
    sector: "Consultório Clínico 2",
    mainComplaint: "Renovação de receita médica",
    ticket: "N021",
    priority: "normal",
    triaged: true,
  },
];

interface PatientsContextType {
  patients: Patient[];
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  addPatient: (patient: Omit<Patient, "id">) => void;
  currentCall: Call | null;
  callHistory: Call[];
  callPatient: (patient: Patient) => void;
  registerArrival: (data: {
    cpf: string;
    birthDate: string;
    motherName: string;
    susCard?: string;
    priority: "normal" | "preferential" | "pediatric" | "emergency";
    name?: string;
  }) => { ticket: string; patient: Patient };
  callTicket: (
    ticket: string,
    room: string,
    risk?: Patient["risk"],
    name?: string,
  ) => void;
  reCall: () => void;
  addEvolution: (
    patientId: string,
    evolution: Omit<EvolutionRecord, "id" | "timestamp">,
  ) => void;
  isAudioEnabled: boolean;
  setIsAudioEnabled: (enabled: boolean) => void;
  isAnnouncing: boolean;
  setIsAnnouncing: (is: boolean) => void;
  resetSystem: () => void;
  requestAdmission: (
    patientId: string,
    bedType: "emergency" | "observation",
    doctor: string,
  ) => void;
  requestExam: (
    patientId: string,
    exam: Omit<ExamRequest, "id" | "status" | "requestedAt">,
  ) => void;
  updateExamStatus: (
    patientId: string,
    examId: string,
    status: ExamStatus,
    result?: string,
    isCritical?: boolean,
    attachmentUrl?: string,
  ) => void;
  cancelExam: (patientId: string, examId: string) => void;
  recollectExam: (patientId: string, examId: string, reason: string) => void;
  requestTransfer: (
    patientId: string,
    priority: "normal" | "urgent" | "emergency",
    reason: string,
  ) => void;
  updateTransferStatus: (
    patientId: string,
    status: "accepted" | "denied" | "transporting" | "completed",
    hospitalName?: string,
    crossCode?: string,
    ambulanceType?: string,
  ) => void;
  markExamsAsRead: (patientId: string) => void;
}

const PatientsContext = createContext<PatientsContextType | undefined>(
  undefined,
);

export function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem("upa_patients");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Patient[];

        // Healing step: merge updated properties from mock patients if missing in cache
        const healedParsed = parsed.map((p) => {
          const mock = mockPatients.find((mp) => mp.id === p.id);
          if (mock) {
            const merged = { ...p };
            if (mock.transferRequest && !p.transferRequest) {
              merged.transferRequest = mock.transferRequest;
            }
            if (mock.exams && (!p.exams || p.exams.length === 0)) {
              merged.exams = mock.exams;
            }
            return merged;
          }
          return p;
        });

        // Merge mock patients that might be missing entirely
        const missingMock = mockPatients.filter(
          (mp) => !healedParsed.some((p) => p.id === mp.id),
        );
        if (missingMock.length > 0) {
          return [...healedParsed, ...missingMock];
        }
        return healedParsed;
      } catch (e) {
        return mockPatients;
      }
    }
    return mockPatients;
  });
  const [currentCall, setCurrentCall] = useState<Call | null>(() => {
    const saved = localStorage.getItem("upa_current_call");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [callHistory, setCallHistory] = useState<Call[]>(() => {
    const saved = localStorage.getItem("upa_call_history");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("upa_audio_enabled_v6");
    try {
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });
  const [isAnnouncing, setIsAnnouncing] = useState(false);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("upa_patients", JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem("upa_current_call", JSON.stringify(currentCall));
  }, [currentCall]);

  useEffect(() => {
    localStorage.setItem("upa_call_history", JSON.stringify(callHistory));
  }, [callHistory]);

  useEffect(() => {
    localStorage.setItem(
      "upa_audio_enabled_v6",
      JSON.stringify(isAudioEnabled),
    );
  }, [isAudioEnabled]);

  // Listen for changes from other tabs and sync context state
  useEffect(() => {
    const channel = new BroadcastChannel("upa_sync_channel");

    const syncAll = () => {
      try {
        const pSavedStr = localStorage.getItem("upa_patients");
        const cSavedStr = localStorage.getItem("upa_current_call");
        const hSavedStr = localStorage.getItem("upa_call_history");
        const aSavedStr = localStorage.getItem("upa_audio_enabled_v6");
        const coSavedStr = localStorage.getItem("upa_counters");

        if (pSavedStr) {
          const newVal = JSON.parse(pSavedStr);
          setPatients((prev) =>
            JSON.stringify(prev) !== pSavedStr ? newVal : prev,
          );
        } else if (!pSavedStr && localStorage.length === 0) {
          // If storage is empty, it was likely reset
          setPatients(mockPatients);
          setCurrentCall(null);
          setCallHistory([]);
          setCounters({
            normal: 0,
            preferential: 0,
            pediatric: 0,
            emergency: 0,
          });
          return;
        }

        if (!cSavedStr) {
          setCurrentCall(null);
        } else {
          try {
            const newVal = JSON.parse(cSavedStr);
            setCurrentCall((prev) =>
              !prev || JSON.stringify(prev) !== cSavedStr ? newVal : prev,
            );
          } catch (e) {
            setCurrentCall(null);
          }
        }

        if (hSavedStr) {
          const newVal = JSON.parse(hSavedStr);
          setCallHistory((prev) =>
            JSON.stringify(prev) !== hSavedStr ? newVal : prev,
          );
        } else {
          setCallHistory([]);
        }

        if (aSavedStr) {
          const newVal = JSON.parse(aSavedStr);
          setIsAudioEnabled((prev) => (prev !== newVal ? newVal : prev));
        }

        if (coSavedStr) {
          const newVal = JSON.parse(coSavedStr);
          setCounters((prev) =>
            JSON.stringify(prev) !== coSavedStr ? newVal : prev,
          );
        }
      } catch (err) {
        console.error("Sync error:", err);
      }
    };

    channel.onmessage = (event) => {
      if (event.data === "sync_all" || event.data === "new_call") {
        syncAll();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("upa_")) {
        syncAll();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", syncAll);

    // Frequent interval check as a robust fallback for cross-tab sync
    const interval = setInterval(syncAll, 1000);

    return () => {
      channel.close();
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", syncAll);
      clearInterval(interval);
    };
  }, []);

  // Escuta alertas de exames globais
  useEffect(() => {
    const alertChannel = new BroadcastChannel("upa_exam_alerts");
    alertChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { patientId, examName, isCritical } = data;

        // Verifica se a aba atual está na tela deste paciente específico
        const match = window.location.pathname.match(/^\/paciente\/([^/]+)/);
        const currentPatientId = match ? match[1] : null;

        if (currentPatientId === patientId) {
          // Play beep
          try {
            const AudioContext =
              window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.type = "sine";
              osc.frequency.setValueAtTime(
                isCritical ? 880 : 660,
                ctx.currentTime,
              );
              gain.gain.setValueAtTime(0.1, ctx.currentTime);
              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + 0.2);

              if (isCritical) {
                setTimeout(() => {
                  const osc2 = ctx.createOscillator();
                  const gain2 = ctx.createGain();
                  osc2.connect(gain2);
                  gain2.connect(ctx.destination);
                  osc2.type = "sine";
                  osc2.frequency.setValueAtTime(1046, ctx.currentTime);
                  gain2.gain.setValueAtTime(0.1, ctx.currentTime);
                  osc2.start(ctx.currentTime);
                  osc2.stop(ctx.currentTime + 0.3);
                }, 250);
              }
            }
          } catch (e) {
            console.error("Audio playback failed", e);
          }

          if (isCritical) {
            toast.error(`🚨 ALERTA CRÍTICO: Laudo de ${examName} liberado!`, {
              description:
                "Verifique a aba de Exames & Procedimentos imediatamente.",
              duration: 10000,
            });
          } else {
            toast.info(`🔔 Novo Laudo: ${examName} liberado.`, {
              description: "O resultado já está disponível na aba de Exames.",
            });
          }
        }
      } catch (err) {}
    };
    return () => alertChannel.close();
  }, []);

  // Persistence and Daily Rotation logic
  const [counters, setCounters] = useState<{
    normal: number;
    preferential: number;
    pediatric: number;
    emergency: number;
  }>(() => {
    const saved = localStorage.getItem("upa_counters");
    const today = new Date().toISOString().split("T")[0];
    const lastReset = localStorage.getItem("upa_last_reset");

    if (saved && lastReset === today) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure pediatric counter exists for older saves
        return {
          normal: 0,
          preferential: 0,
          pediatric: 0,
          emergency: 0,
          ...parsed,
        };
      } catch (e) {
        return { normal: 0, preferential: 0, pediatric: 0, emergency: 0 };
      }
    }

    // New day or first run
    localStorage.setItem("upa_last_reset", today);
    const initial = { normal: 0, preferential: 0, pediatric: 0, emergency: 0 };
    localStorage.setItem("upa_counters", JSON.stringify(initial));
    return initial;
  });

  const saveCounters = (newCounters: typeof counters) => {
    setCounters(newCounters);
    localStorage.setItem("upa_counters", JSON.stringify(newCounters));
    localStorage.setItem(
      "upa_last_reset",
      new Date().toISOString().split("T")[0],
    );
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
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      years--;
    }
    return years >= 0 && years < 12;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };

          // --- TIMELINE LOGIC ---
          const newTimeline = [...(p.timeline || [])];
          let timelineChanged = false;

          // Sector change
          if (updates.sector !== undefined && updates.sector !== p.sector) {
            if (updates.sector === undefined || updates.sector === "") {
              newTimeline.push({
                id: Math.random().toString(36).substring(2, 11),
                title: "Transferência para Fila Geral",
                description: `Paciente liberado para a fila geral de atendimento.`,
                timestamp: new Date().toISOString(),
                iconType: "droplet",
                badge: "Fluxo de Leitos",
              });
            } else {
              newTimeline.push({
                id: Math.random().toString(36).substring(2, 11),
                title: "Transferência de Setor",
                description: `Paciente encaminhado para: ${updates.sector}`,
                timestamp: new Date().toISOString(),
                iconType: "droplet",
                badge: "Fluxo de Leitos",
              });
            }
            timelineChanged = true;
          }

          // Status change
          if (updates.status === "attending" && p.status !== "attending") {
            newTimeline.push({
              id: Math.random().toString(36).substring(2, 11),
              title: "Início do Atendimento",
              description: `Atendimento médico iniciado no setor: ${updated.sector || "Consultório"}`,
              timestamp: new Date().toISOString(),
              iconType: "stethoscope",
              badge: "Consultório",
            });
            timelineChanged = true;
          }

          if (updates.subStatus === "reaval" && p.subStatus !== "reaval") {
            newTimeline.push({
              id: Math.random().toString(36).substring(2, 11),
              title: "Aguardando Exames / Reavaliação",
              description: `Atendimento pausado. Paciente aguarda resultados de exames.`,
              timestamp: new Date().toISOString(),
              iconType: "flask",
              badge: "Reavaliação",
            });
            timelineChanged = true;
          }

          if (updates.status === "completed" && p.status !== "completed") {
            newTimeline.push({
              id: Math.random().toString(36).substring(2, 11),
              title: "Atendimento Finalizado",
              description: `Paciente finalizado no sistema.`,
              timestamp: new Date().toISOString(),
              iconType: "check",
              badge: "Alta",
            });
            timelineChanged = true;
          }

          if (timelineChanged) {
            updated.timeline = newTimeline;
          }
          // ----------------------

          return updated;
        }
        return p;
      }),
    );
  };

  const addPatient = (patient: Omit<Patient, "id">) => {
    const newPatient: Patient = {
      ...patient,
      id: Math.random().toString(36).substring(2, 11),
    };
    setPatients((prev) => [...prev, newPatient]);
  };

  const callPatient = (patient: Patient) => {
    const displayName =
      (patient.socialName && patient.socialName.trim()) || patient.name;
    const newCall: Call = {
      id: Math.random().toString(36).substring(2, 11),
      patientName: displayName.toUpperCase(),
      room: patient.sector?.toUpperCase() || "TRIAGEM",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      risk: patient.risk,
      ticket: patient.ticket,
    };

    setCurrentCall(newCall);
    localStorage.setItem("upa_current_call", JSON.stringify(newCall));

    setCallHistory((prev) => {
      const newHistory = [
        newCall,
        ...prev.filter((c) => c.ticket !== newCall.ticket),
      ].slice(0, 8);
      localStorage.setItem("upa_call_history", JSON.stringify(newHistory));
      return newHistory;
    });

    // Broadcast change
    new BroadcastChannel("upa_sync_channel").postMessage("new_call");

    if (patient.status === "waiting") {
      updatePatient(patient.id, { status: "attending" });
    }
  };

  const generateTicket = (
    priority: "normal" | "preferential" | "pediatric" | "emergency",
  ) => {
    let prefix = "N";
    if (priority === "emergency") prefix = "E";
    else if (priority === "preferential") prefix = "P";
    else if (priority === "pediatric") prefix = "C";
    else prefix = "N";

    const next = counters[priority] + 1;
    saveCounters({ ...counters, [priority]: next });

    // Simple sequential numeric format (e.g., N001, P001, I001)
    const numericPart = String(next).padStart(3, "0");
    return `${prefix}${numericPart}`;
  };

  const registerArrival: PatientsContextType["registerArrival"] = ({
    cpf,
    birthDate,
    motherName,
    susCard,
    priority,
    name,
  }) => {
    // Auto-upgrade to pediatric if patient is a child (0–11y 11m 29d),
    // but only if it's not an unidentified case where birthDate defaults to today.
    const effectivePriority =
      priority !== "emergency" &&
      !name?.includes("DESCONHECIDO") &&
      isChild(birthDate)
        ? "pediatric"
        : priority;
    const ticket = generateTicket(effectivePriority);
    // Try to find existing patient by CPF
    const existing = patients.find(
      (p) => p.cpf.replace(/\D/g, "") === cpf.replace(/\D/g, ""),
    );

    // Emergency tickets should still go through triage to collect clinical data
    const isEmergencyPriority = effectivePriority === "emergency";
    const isPediatricPriority = effectivePriority === "pediatric";
    const autoRisk = isEmergencyPriority ? "emergency" : undefined;
    const autoSector = isEmergencyPriority
      ? "SALA VERMELHA"
      : isPediatricPriority
        ? "Triagem Pediatria"
        : undefined;
    const autoStatus = "waiting";
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
    setPatients((prev) => [...prev, newPatient]);
    return { ticket, patient: newPatient };
  };

  const callTicket: PatientsContextType["callTicket"] = (
    ticket,
    room,
    risk = "not-urgent",
    name,
  ) => {
    let patientName = name;
    if (!patientName) {
      const patient = patients.find((p) => p.ticket === ticket);
      if (patient) {
        patientName =
          (patient.socialName && patient.socialName.trim()) || patient.name;
      }
    }

    const normalizedName = patientName?.toUpperCase() || "";
    const isUnidentified =
      normalizedName.includes("NÃO IDENTIFICADO") ||
      normalizedName.includes("DESCONHECIDO");
    const finalName = isUnidentified
      ? "PACIENTE NÃO IDENTIFICADO"
      : patientName
        ? patientName.toUpperCase()
        : "PACIENTE";

    const newCall: Call = {
      id: Math.random().toString(36).substring(2, 11),
      patientName: finalName,
      room: room.toUpperCase(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      risk,
      ticket: ticket.toUpperCase(),
    };

    setCurrentCall(newCall);
    localStorage.setItem("upa_current_call", JSON.stringify(newCall));

    setCallHistory((prev) => {
      const newHistory = [
        newCall,
        ...prev.filter((c) => c.ticket !== newCall.ticket),
      ].slice(0, 8);
      localStorage.setItem("upa_call_history", JSON.stringify(newHistory));
      return newHistory;
    });

    // Broadcast change
    new BroadcastChannel("upa_sync_channel").postMessage("new_call");
  };

  const reCall = () => {
    if (!currentCall) return;
    const refreshedCall: Call = {
      ...currentCall,
      id: Math.random().toString(36).substring(2, 11),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setCurrentCall(refreshedCall);
    localStorage.setItem("upa_current_call", JSON.stringify(refreshedCall));

    // Broadcast change
    new BroadcastChannel("upa_sync_channel").postMessage("new_call");
  };

  const resetSystem = () => {
    // Clear all UPA related data
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("upa_")) {
        localStorage.removeItem(key);
      }
    });
    // Reset state to defaults
    setPatients(mockPatients);
    setCurrentCall(null);
    setCallHistory([]);
    setCounters({ normal: 0, preferential: 0, pediatric: 0, emergency: 0 });

    // Broadcast reset
    new BroadcastChannel("upa_sync_channel").postMessage("sync_all");

    toast.success("Sistema resetado com sucesso.");
    window.location.reload(); // Refresh to ensure all tabs start fresh
  };

  const addEvolution = (
    patientId: string,
    evolution: Omit<EvolutionRecord, "id" | "timestamp">,
  ) => {
    const newEvolution: EvolutionRecord = {
      ...evolution,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toLocaleString("pt-BR"),
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            evolutions: [newEvolution, ...(p.evolutions || [])],
          };
        }
        return p;
      }),
    );
  };

  const requestAdmission = (
    patientId: string,
    bedType: "emergency" | "observation",
    doctor: string,
  ) => {
    updatePatient(patientId, {
      admissionRequest: {
        status: "pending",
        bedType,
        requestedAt: new Date().toISOString(),
        doctor,
      },
    });
    toast.success("Vaga solicitada com sucesso!", {
      description: `O NIR foi notificado para providenciar um leito de ${bedType === "emergency" ? "Emergência" : "Observação"}.`,
    });
    new BroadcastChannel("upa_sync_channel").postMessage("sync_all");
  };

  const requestExam = (
    patientId: string,
    exam: Omit<ExamRequest, "id" | "status" | "requestedAt">,
  ) => {
    const collectionSlaMinutes = 15; // collection deadline
    const newExam: ExamRequest = {
      ...exam,
      id: Math.random().toString(36).substring(2, 11),
      status: "pending_collection",
      requestedAt: new Date().toISOString(),
      deadline: new Date(
        Date.now() + collectionSlaMinutes * 60 * 1000,
      ).toISOString(),
    };
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            exams: [newExam, ...(p.exams || [])],
          };
        }
        return p;
      }),
    );
    toast.success(`Exame ${exam.name} solicitado com sucesso!`);
    new BroadcastChannel("upa_sync_channel").postMessage("sync_all");
  };

  const analysisSlaMinutes = 30; // analysis deadline
  const updateExamStatus = (
    patientId: string,
    examId: string,
    status: ExamStatus,
    result?: string,
    isCritical?: boolean,
    attachmentUrl?: string,
  ) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          const updatedExams = (p.exams || []).map((e) => {
            if (e.id === examId) {
              const updated: ExamRequest = {
                ...e,
                status,
                result: result !== undefined ? result : e.result,
                releasedAt:
                  status === "completed"
                    ? new Date().toISOString()
                    : e.releasedAt,
                isCritical:
                  isCritical !== undefined ? isCritical : e.isCritical,
                attachmentUrl:
                  attachmentUrl !== undefined ? attachmentUrl : e.attachmentUrl,
              };
              // Set new deadline when moving to analysis
              if (status === "in_analysis") {
                updated.deadline = new Date(
                  Date.now() + analysisSlaMinutes * 60 * 1000,
                ).toISOString();
              }
              // Remove deadline when completed
              if (status === "completed") {
                delete updated.deadline;
                new BroadcastChannel("upa_exam_alerts").postMessage(
                  JSON.stringify({
                    patientId,
                    examName: updated.name,
                    isCritical: updated.isCritical,
                  }),
                );
              }
              return updated;
            }
            return e;
          });
          return { ...p, exams: updatedExams };
        }
        return p;
      }),
    );
    new BroadcastChannel("upa_sync_channel").postMessage("sync_all");
  };

  const cancelExam = (patientId: string, examId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            exams: (p.exams || []).filter((e) => e.id !== examId),
          };
        }
        return p;
      }),
    );
    toast.info("Exame cancelado.");
    new BroadcastChannel("upa_sync_channel").postMessage("sync_all");
  };

  const recollectExam = (patientId: string, examId: string, reason: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          const updatedExams = (p.exams || []).map((e) =>
            e.id === examId
              ? {
                  ...e,
                  status: "pending_collection" as ExamStatus,
                  result: undefined,
                  releasedAt: undefined,
                  requestedAt: new Date().toISOString(),
                }
              : e,
          );
          return { ...p, exams: updatedExams };
        }
        return p;
      }),
    );
    toast.error(
      `Amostra rejeitada. Motivo: ${reason}. Nova coleta solicitada.`,
    );
    new BroadcastChannel("upa_sync_channel").postMessage("sync_all");
  };

  const requestTransfer = (
    patientId: string,
    priority: "normal" | "urgent" | "emergency",
    reason: string,
  ) => {
    updatePatient(patientId, {
      transferRequest: {
        status: "requested",
        requestedAt: new Date().toISOString(),
        priority,
        reason,
      },
    });
    toast.success("Solicitação enviada ao NIR/CROSS.");
    new BroadcastChannel("upa_sync_channel").postMessage("sync_all");
  };

  const updateTransferStatus = (
    patientId: string,
    status: "accepted" | "denied" | "transporting" | "completed",
    hospitalName?: string,
    crossCode?: string,
    ambulanceType?: string,
  ) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId && p.transferRequest) {
          return {
            ...p,
            transferRequest: {
              ...p.transferRequest,
              status,
              hospitalName: hospitalName || p.transferRequest.hospitalName,
              crossCode: crossCode || p.transferRequest.crossCode,
              ambulanceType: ambulanceType || p.transferRequest.ambulanceType,
            },
          };
        }
        return p;
      }),
    );
    if (status === "accepted")
      toast.success(`Transferência aceita para: ${hospitalName}`);
    else if (status === "denied")
      toast.error("Transferência negada pela regulação.");
    else if (status === "transporting")
      toast.success("Ambulância do SAMU em deslocamento.");
    else if (status === "completed")
      toast.success("Transferência concluída com sucesso.");
    new BroadcastChannel("upa_sync_channel").postMessage("sync_all");
  };

  const markExamsAsRead = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId && p.exams) {
          let changed = false;
          const updatedExams = p.exams.map((e) => {
            if (e.status === "completed" && !e.readAt) {
              changed = true;
              return { ...e, readAt: new Date().toISOString() };
            }
            return e;
          });
          if (changed) {
            new BroadcastChannel("upa_sync_channel").postMessage("sync_all");
            return { ...p, exams: updatedExams };
          }
        }
        return p;
      }),
    );
  };

  return (
    <PatientsContext.Provider
      value={{
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
        markExamsAsRead,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatientsContext() {
  const context = useContext(PatientsContext);
  if (context === undefined) {
    throw new Error(
      "usePatientsContext must be used within a PatientsProvider",
    );
  }
  return context;
}
