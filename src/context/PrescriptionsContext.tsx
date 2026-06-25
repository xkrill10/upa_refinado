import React, { createContext, useContext, useState, ReactNode } from "react";

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
  };
  justification?: string;
  doubleCheckedBy?: string;
  doubleCheckedAt?: string;
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
  isHighVigilance?: boolean;
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
  addCareItem: (orderId: string, item: PrescriptionMedication) => void;
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
  }
];

export function PrescriptionsProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<PrescriptionOrder[]>(initialOrders);

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

  return (
    <PrescriptionsContext.Provider
      value={{
        orders,
        addPrescriptionOrder,
        updateMedicationStatus,
        updateMedicationHours,
        addCareItem,
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
