import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type PrescriptionStatus =
  | "awaiting_pharmacy"
  | "awaiting_nursing"
  | "active"
  | "completed"
  | "suspended";

export interface AprazamentoHour {
  hour: string; // "08:00"
  status: "pending" | "checked" | "refused" | "delayed" | "suspended";
  checkedAt?: string;
  nurseName?: string;
  vitalSigns?: {
    bp?: string;
    hr?: string;
    temp?: string;
    glycemia?: string;
    spo2?: string;
    fr?: string;
    pain?: string;
    consciousness?: string;
  };
  justification?: string;
  doubleCheckedBy?: string;
  doubleCheckedAt?: string;
}

export interface ExecutionRecord {
  status: "checked" | "refused" | "delayed" | "suspended";
  checkedAt?: string;
  nurseName?: string;
  justification?: string;
  doubleCheckedBy?: string;
  doubleCheckedAt?: string;
  vitalSigns?: {
    bp?: string;
    hr?: string;
    temp?: string;
    spo2?: string;
    fr?: string;
    pain?: string;
    consciousness?: string;
  };
}

export interface PrescriptionMedication {
  id: string;
  medication: string;
  dosage: string;
  route: string;
  frequency: string;
  observation?: string;
  status: PrescriptionStatus;
  hours: AprazamentoHour[];
  startDate?: string;
  scheduleType?: "continuous" | "single";
  executions?: Record<string, ExecutionRecord>;
  isHighVigilance?: boolean;
  isDoubleCheckRequired?: boolean;
  category?: "medication" | "diet" | "therapy" | "nursing";
}

export interface PrescriptionOrder {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  createdAt: string;
  medications: PrescriptionMedication[];
}

interface PrescriptionsContextType {
  orders: PrescriptionOrder[];
  addPrescriptionOrder: (
    order: Omit<PrescriptionOrder, "id" | "createdAt">,
  ) => void;
  updateMedicationStatus: (
    orderId: string,
    medId: string,
    newStatus: PrescriptionStatus,
  ) => void;
  updateMedicationHours: (
    orderId: string,
    medId: string,
    hours: AprazamentoHour[],
  ) => void;
  updateMedicationExecution: (
    orderId: string,
    medId: string,
    executionKey: string,
    data: ExecutionRecord,
  ) => void;
  addCareItem: (orderId: string, item: PrescriptionMedication) => void;
  removeCareItem: (orderId: string, medId: string) => void;
}

const PrescriptionsContext = createContext<
  PrescriptionsContextType | undefined
>(undefined);

// Mock initial data so the therapeutic plan isn't empty when testing
const initialOrders: PrescriptionOrder[] = [
  {
    id: "mock-order-1",
    patientId: "2", // Assuming patient with ID 2 exists in context
    patientName: "João Souza",
    doctorId: "doc-1",
    doctorName: "Dr. Carlos",
    createdAt: new Date().toISOString(),
    medications: [
      {
        id: "med-1",
        medication: "Dipirona Monoidratada",
        dosage: "1g (2ml)",
        route: "EV",
        frequency: "6/6h",
        status: "active",
        isHighVigilance: false,
        hours: [
          { hour: "06:00", status: "checked", nurseName: "Maria Silva" },
          { hour: "12:00", status: "pending" },
          { hour: "18:00", status: "pending" },
          { hour: "00:00", status: "pending" },
        ],
      },
      {
        id: "med-2",
        medication: "Heparina Sódica",
        dosage: "5000 UI/0.25ml",
        route: "SC",
        frequency: "12/12h",
        status: "active",
        isHighVigilance: true,
        hours: [
          { hour: "08:00", status: "pending" },
          { hour: "20:00", status: "pending" },
        ],
      },
      {
        id: "med-3",
        medication: "Insulina Regular",
        dosage: "Conforme Glicemia",
        route: "SC",
        frequency: "S/N",
        status: "active",
        isHighVigilance: true,
        hours: [
          { hour: "10:00", status: "pending" },
        ],
        category: "medication"
      },
      {
        id: "med-4",
        medication: "Dieta Branda para Diabéticos",
        dosage: "Porção Padrão",
        route: "VO",
        frequency: "Desjejum / Almoço / Jantar",
        status: "active",
        category: "diet",
        hours: [
          { hour: "08:00", status: "pending" },
          { hour: "12:00", status: "pending" },
          { hour: "18:00", status: "pending" },
        ],
      },
      {
        id: "med-5",
        medication: "Fisioterapia Motora",
        dosage: "1 Sessão",
        route: "Leito",
        frequency: "2x ao dia",
        status: "active",
        category: "therapy",
        hours: [
          { hour: "10:00", status: "pending" },
          { hour: "16:00", status: "pending" },
        ],
      },
      {
        id: "med-6",
        medication: "Mudança de Decúbito",
        dosage: "Padrão",
        route: "Leito",
        frequency: "2/2h",
        status: "active",
        category: "nursing",
        hours: [
          { hour: "08:00", status: "checked", nurseName: "Maria Silva" },
          { hour: "10:00", status: "pending" },
          { hour: "12:00", status: "pending" },
          { hour: "14:00", status: "pending" },
          { hour: "16:00", status: "pending" },
        ],
      }
    ],
  },
  {
    id: "mock-order-jose",
    patientId: "jose-doente",
    patientName: "José Doente",
    doctorId: "doc-1",
    doctorName: "Dr. Carlos",
    createdAt: new Date().toISOString(),
    medications: [
      {
        id: "med-j1",
        medication: "AAS (Ácido Acetilsalicílico)",
        dosage: "100mg",
        route: "VO",
        frequency: "1x ao dia",
        status: "active",
        isHighVigilance: false,
        category: "medication",
        hours: [
          { hour: "12:00", status: "checked", nurseName: "Enf. João" },
          { hour: "08:00", status: "pending" },
        ],
      },
      {
        id: "med-j2",
        medication: "Insulina Regular",
        dosage: "Conforme Glicemia",
        route: "SC",
        frequency: "S/N",
        status: "active",
        isHighVigilance: true,
        category: "medication",
        hours: [
          { hour: "10:00", status: "pending" },
          { hour: "16:00", status: "pending" },
        ],
      },
      {
        id: "med-j3",
        medication: "Dieta Leve Hipossódica",
        dosage: "Porção Padrão",
        route: "VO",
        frequency: "Desjejum / Almoço / Jantar",
        status: "active",
        category: "diet",
        hours: [
          { hour: "08:00", status: "checked", nurseName: "Copa" },
          { hour: "12:00", status: "checked", nurseName: "Copa" },
          { hour: "18:00", status: "pending" },
        ],
      },
      {
        id: "med-j4",
        medication: "Fisioterapia Respiratória",
        dosage: "1 Sessão",
        route: "Leito",
        frequency: "2x ao dia",
        status: "active",
        category: "therapy",
        hours: [
          { hour: "10:00", status: "pending" },
          { hour: "16:00", status: "pending" },
        ],
      },
      {
        id: "med-j5",
        medication: "Monitoramento de Sinais Vitais",
        dosage: "Contínuo",
        route: "Monitor",
        frequency: "2/2h",
        status: "active",
        category: "nursing",
        hours: [
          { hour: "08:00", status: "checked", nurseName: "Enf. João" },
          { hour: "10:00", status: "checked", nurseName: "Enf. João" },
          { hour: "12:00", status: "checked", nurseName: "Enf. João" },
          { hour: "14:00", status: "pending" },
          { hour: "16:00", status: "pending" },
          { hour: "18:00", status: "pending" },
        ],
      }
    ],
  }
];

export function PrescriptionsProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<PrescriptionOrder[]>(() => {
    const saved = localStorage.getItem("upa_prescriptions_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse prescriptions context", e);
      }
    }
    return initialOrders;
  });

  // Sync to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem("upa_prescriptions_v2", JSON.stringify(orders));
  }, [orders]);

  const addPrescriptionOrder = (
    orderData: Omit<PrescriptionOrder, "id" | "createdAt">,
  ) => {
    const newOrder: PrescriptionOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, newOrder]);
  };

  const updateMedicationStatus = (
    orderId: string,
    medId: string,
    newStatus: PrescriptionStatus,
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          medications: order.medications.map((med) =>
            med.id === medId ? { ...med, status: newStatus } : med,
          ),
        };
      }),
    );
  };

  const updateMedicationHours = (
    orderId: string,
    medId: string,
    hours: AprazamentoHour[],
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          medications: order.medications.map((med) =>
            med.id === medId ? { ...med, hours } : med,
          ),
        };
      }),
    );
  };

  const addCareItem = (orderId: string, item: PrescriptionMedication) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          medications: [...order.medications, item],
        };
      }),
    );
  };

  const removeCareItem = (orderId: string, medId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          medications: order.medications.filter((med) => med.id !== medId),
        };
      }),
    );
  };

  const updateMedicationExecution = (
    orderId: string,
    medId: string,
    executionKey: string,
    data: ExecutionRecord,
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          medications: order.medications.map((med) => {
            if (med.id !== medId) return med;
            return {
              ...med,
              executions: {
                ...(med.executions || {}),
                [executionKey]: data,
              },
            };
          }),
        };
      }),
    );
  };

  return (
    <PrescriptionsContext.Provider
      value={{
        orders,
        addPrescriptionOrder,
        updateMedicationStatus,
        updateMedicationHours,
        updateMedicationExecution,
        addCareItem,
        removeCareItem,
      }}
    >
      {children}
    </PrescriptionsContext.Provider>
  );
}

export function usePrescriptions() {
  const context = useContext(PrescriptionsContext);
  if (context === undefined) {
    throw new Error(
      "usePrescriptions must be used within a PrescriptionsProvider",
    );
  }
  return context;
}
