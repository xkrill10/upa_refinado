import React, { createContext, useContext, useState, ReactNode } from "react";

export type BedStatus = "available" | "occupied" | "maintenance" | "cleaning" | "reserved";
export type CleaningStatus = "waiting" | "in_progress";
export type PriorityLevel = "normal" | "high" | "urgent";

export interface Cleaner {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface BedHistoryRecord {
  patientId: string;
  admittedAt: string;
  dischargedAt?: string;
}

export interface Bed {
  id: string;
  name: string;
  status: BedStatus;
  ward: string;
  room: string;
  lastUpdated: string;
  patientId?: string;

  // Governance / Cleaning extra fields
  cleaningStatus?: CleaningStatus;
  assignedCleaner?: Cleaner;
  requestedAt?: Date;
  startedAt?: Date;
  priority?: PriorityLevel;
  isIsolation?: boolean;
  maintenanceReason?: string;
  bedHistory?: BedHistoryRecord[];
}

export interface CleaningLog {
  id: string;
  bedId: string;
  bedName: string;
  ward: string;
  room: string;
  cleanerName: string;
  cleanerAvatar: string;
  cleanerColor: string;
  supplies: string[];
  observations: string;
  durationMinutes: number;
  ccihConfirmed: boolean;
  finishedAt: Date;
  requestedAt?: Date;
  startedAt?: Date;
}

interface BedsContextType {
  beds: Bed[];
  cleaners: Cleaner[];
  cleaningHistory: CleaningLog[];
  updateBedStatus: (id: string, status: BedStatus) => void;
  assignPatient: (bedId: string, patientId: string) => void;
  releaseBed: (
    bedId: string,
    priority?: PriorityLevel,
    isIsolation?: boolean,
  ) => void;
  transferPatient: (sourceBedId: string, targetBedId: string) => void;
  getStats: () => {
    available: number;
    occupied: number;
    maintenance: number;
    cleaning: number;
    reserved: number;
  };

  // Governance functions
  startCleaning: (bedId: string, cleaner: Cleaner) => void;
  finishCleaning: (
    bedId: string,
    logDetails: {
      supplies: string[];
      observations: string;
      ccihConfirmed: boolean;
    },
  ) => void;
  reportBedDefect: (bedId: string, reason: string) => void;
}

const MOCK_CLEANERS: Cleaner[] = [
  { id: "1", name: "Maria Silva", avatar: "MS", color: "bg-pink-500" },
  { id: "2", name: "João Souza", avatar: "JS", color: "bg-indigo-500" },
  { id: "3", name: "Ana Clara", avatar: "AC", color: "bg-emerald-500" },
];

const generateBeds = (): Bed[] => {
  const occupiedPatientIds = [
    "super-dummy-test", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"
  ];
  let nextPatientIdx = 0;

  const createBed = (id: string, name: string, ward: string, room: string, defaultStatus: BedStatus = "available"): Bed => {
    let status = defaultStatus;
    let patientId: string | undefined = undefined;

    if (status === "occupied" && nextPatientIdx < occupiedPatientIds.length) {
      patientId = occupiedPatientIds[nextPatientIdx++];
    }

    return {
      id,
      name,
      status,
      ward,
      room,
      lastUpdated: "Agora",
      patientId,
      bedHistory: patientId
        ? [
            {
              patientId,
              admittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            },
          ]
        : undefined,
    };
  };

  const beds: Bed[] = [
    // UPA - Emergência
    createBed("e-1", "Leito 01", "Emergência", "Emergência", "available"),
    createBed("e-2", "Leito 02", "Emergência", "Emergência", "occupied"),
    createBed("e-3", "Leito 03", "Emergência", "Emergência", "available"),
    createBed("e-4", "Leito 04", "Emergência", "Emergência", "occupied"),
    createBed("e-5", "Leito 05", "Emergência", "Emergência", "cleaning"),
    createBed("e-6", "Leito 06", "Emergência", "Emergência", "available"),
    createBed("e-7", "Leito 07", "Emergência", "Emergência", "available"),
    createBed("e-8", "Maca de Parada", "Emergência", "Emergência", "available"),

    // UPA - Observação Feminina
    createBed("o-of1", "Leito 01", "Observação", "Observação Feminina", "available"),
    createBed("o-of2", "Leito 02", "Observação", "Observação Feminina", "occupied"),
    createBed("o-of3", "Leito 03", "Observação", "Observação Feminina", "available"),
    createBed("o-of4", "Leito 04", "Observação", "Observação Feminina", "available"),
    createBed("o-of5", "Leito 05", "Observação", "Observação Feminina", "maintenance"),

    // UPA - Observação Masculina
    createBed("o-om1", "Leito 01", "Observação", "Observação Masculina", "available"),
    createBed("o-om2", "Leito 02", "Observação", "Observação Masculina", "occupied"),
    createBed("o-om3", "Leito 03", "Observação", "Observação Masculina", "available"),
    createBed("o-om4", "Leito 04", "Observação", "Observação Masculina", "available"),

    // UPA - Pediatria
    createBed("o-ped1", "Leito 01", "Observação", "Pediatria", "available"),
    createBed("o-ped2", "Leito 02", "Observação", "Pediatria", "occupied"),
    createBed("o-ped3", "Leito 03", "Observação", "Pediatria", "available"),
    createBed("o-ped4", "Leito 04", "Observação", "Pediatria", "cleaning"),

    // UPA - Isolamento
    createBed("o-iso1", "Isolamento 01", "Observação", "Isolamento", "available"),
    createBed("o-iso2", "Isolamento 02", "Observação", "Isolamento", "occupied"),

    // UPA - Retaguarda
    createBed("o-ret1", "Retaguarda 01", "Observação", "Retaguarda", "available"),
  ];

  return beds;
};

const initialBeds: Bed[] = generateBeds();

// Histórico de auditoria fake inicial
const initialHistory: CleaningLog[] = [
  {
    id: "log-1",
    bedId: "e-9",
    bedName: "Leito Emergência 9",
    ward: "Emergência",
    room: "Box 9",
    cleanerName: "Maria Silva",
    cleanerAvatar: "MS",
    cleanerColor: "bg-pink-500",
    supplies: ["soap", "towel"],
    observations: "Limpeza padrão realizada com sucesso.",
    durationMinutes: 14,
    ccihConfirmed: true,
    finishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
  },
];

const BedsContext = createContext<BedsContextType | undefined>(undefined);

export function BedsProvider({ children }: { children: ReactNode }) {
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [cleaners] = useState<Cleaner[]>(MOCK_CLEANERS);
  const [cleaningHistory, setCleaningHistory] =
    useState<CleaningLog[]>(initialHistory);

  const updateBedStatus = (id: string, status: BedStatus) => {
    setBeds((prev) =>
      prev.map((bed) =>
        bed.id === id ? { ...bed, status, lastUpdated: "Agora" } : bed,
      ),
    );
  };

  const assignPatient = (bedId: string, patientId: string) => {
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.id === bedId) {
          const newHistoryRecord: BedHistoryRecord = {
            patientId,
            admittedAt: new Date().toISOString(),
          };
          const updatedHistory = [newHistoryRecord, ...(bed.bedHistory || [])];
          return {
            ...bed,
            status: "occupied",
            patientId,
            lastUpdated: "Agora",
            bedHistory: updatedHistory,
          };
        }
        return bed;
      }),
    );
  };

  const releaseBed = (
    bedId: string,
    priority: PriorityLevel = "normal",
    isIsolation = false,
  ) => {
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.id === bedId) {
          let updatedHistory = bed.bedHistory || [];
          if (updatedHistory.length > 0 && !updatedHistory[0].dischargedAt) {
            updatedHistory = [
              { ...updatedHistory[0], dischargedAt: new Date().toISOString() },
              ...updatedHistory.slice(1),
            ];
          }
          return {
            ...bed,
            status: "cleaning",
            patientId: undefined,
            lastUpdated: "Agora",
            cleaningStatus: "waiting",
            requestedAt: new Date(),
            priority,
            isIsolation,
            bedHistory: updatedHistory,
          };
        }
        return bed;
      }),
    );
  };

  const transferPatient = (sourceBedId: string, targetBedId: string) => {
    setBeds((prev) => {
      const sourceBed = prev.find((b) => b.id === sourceBedId);
      if (!sourceBed || !sourceBed.patientId) return prev;

      const patientId = sourceBed.patientId;

      return prev.map((bed) => {
        if (bed.id === sourceBedId) {
          let updatedHistory = bed.bedHistory || [];
          if (updatedHistory.length > 0 && !updatedHistory[0].dischargedAt) {
            updatedHistory = [
              { ...updatedHistory[0], dischargedAt: new Date().toISOString() },
              ...updatedHistory.slice(1),
            ];
          }
          return {
            ...bed,
            status: "cleaning",
            patientId: undefined,
            lastUpdated: "Agora",
            cleaningStatus: "waiting",
            requestedAt: new Date(),
            priority: "normal",
            isIsolation: false,
            bedHistory: updatedHistory,
          };
        }
        if (bed.id === targetBedId) {
          const newHistoryRecord: BedHistoryRecord = {
            patientId,
            admittedAt: new Date().toISOString(),
          };
          const updatedHistory = [newHistoryRecord, ...(bed.bedHistory || [])];
          return {
            ...bed,
            status: "occupied",
            patientId,
            lastUpdated: "Agora",
            bedHistory: updatedHistory,
          };
        }
        return bed;
      });
    });
  };

  const getStats = () => {
    return beds.reduce(
      (acc, bed) => {
        acc[bed.status]++;
        return acc;
      },
      { available: 0, occupied: 0, maintenance: 0, cleaning: 0, reserved: 0 },
    );
  };

  const startCleaning = (bedId: string, cleaner: Cleaner) => {
    setBeds((prev) =>
      prev.map((bed) =>
        bed.id === bedId
          ? {
              ...bed,
              cleaningStatus: "in_progress",
              startedAt: new Date(),
              assignedCleaner: cleaner,
              lastUpdated: "Agora",
            }
          : bed,
      ),
    );
  };

  const finishCleaning = (
    bedId: string,
    logDetails: {
      supplies: string[];
      observations: string;
      ccihConfirmed: boolean;
    },
  ) => {
    setBeds((prev) => {
      let targetBed: Bed | undefined;
      const newBeds = prev.map((bed) => {
        if (bed.id === bedId) {
          targetBed = bed;
          const {
            cleaningStatus,
            assignedCleaner,
            requestedAt,
            startedAt,
            priority,
            isIsolation,
            maintenanceReason,
            ...cleanBed
          } = bed;
          return {
            ...cleanBed,
            status: "available" as BedStatus,
            lastUpdated: "Agora",
          };
        }
        return bed;
      });

      if (targetBed && targetBed.assignedCleaner) {
        const durationMinutes = targetBed.startedAt
          ? Math.floor((Date.now() - targetBed.startedAt.getTime()) / 60000)
          : 0;
        const newLog: CleaningLog = {
          id: `log-${Date.now()}`,
          bedId: targetBed.id,
          bedName: targetBed.name,
          ward: targetBed.ward,
          room: targetBed.room,
          cleanerName: targetBed.assignedCleaner.name,
          cleanerAvatar: targetBed.assignedCleaner.avatar,
          cleanerColor: targetBed.assignedCleaner.color,
          supplies: logDetails.supplies,
          observations: logDetails.observations,
          durationMinutes,
          ccihConfirmed: logDetails.ccihConfirmed,
          finishedAt: new Date(),
          requestedAt: targetBed.requestedAt,
          startedAt: targetBed.startedAt,
        };
        setCleaningHistory((h) => [newLog, ...h]);
      }

      return newBeds;
    });
  };

  const reportBedDefect = (bedId: string, reason: string) => {
    setBeds((prev) =>
      prev.map((bed) =>
        bed.id === bedId
          ? {
              ...bed,
              status: "maintenance",
              maintenanceReason: reason,
              lastUpdated: "Agora",
            }
          : bed,
      ),
    );
  };

  return (
    <BedsContext.Provider
      value={{
        beds,
        cleaners,
        cleaningHistory,
        updateBedStatus,
        assignPatient,
        releaseBed,
        transferPatient,
        getStats,
        startCleaning,
        finishCleaning,
        reportBedDefect,
      }}
    >
      {children}
    </BedsContext.Provider>
  );
}

export function useBeds() {
  const context = useContext(BedsContext);
  if (context === undefined) {
    throw new Error("useBeds must be used within a BedsProvider");
  }
  return context;
}
