import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PrescriptionStatus = 'awaiting_pharmacy' | 'awaiting_nursing' | 'active' | 'completed' | 'suspended';

export interface AprazamentoHour {
  hour: string; // "08:00"
  status: 'pending' | 'checked' | 'refused' | 'delayed';
  checkedAt?: string;
  nurseName?: string;
  vitalSigns?: {
    bp?: string;
    hr?: string;
    temp?: string;
    glycemia?: string;
  };
  justification?: string;
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
  addPrescriptionOrder: (order: Omit<PrescriptionOrder, 'id' | 'createdAt'>) => void;
  updateMedicationStatus: (orderId: string, medId: string, newStatus: PrescriptionStatus) => void;
  updateMedicationHours: (orderId: string, medId: string, hours: AprazamentoHour[]) => void;
}

const PrescriptionsContext = createContext<PrescriptionsContextType | undefined>(undefined);

// Generate some mock initial data so it's not totally empty, or start empty. Let's start empty.
const initialOrders: PrescriptionOrder[] = [];

export function PrescriptionsProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<PrescriptionOrder[]>(initialOrders);

  const addPrescriptionOrder = (orderData: Omit<PrescriptionOrder, 'id' | 'createdAt'>) => {
    const newOrder: PrescriptionOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateMedicationStatus = (orderId: string, medId: string, newStatus: PrescriptionStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        medications: order.medications.map(med => 
          med.id === medId ? { ...med, status: newStatus } : med
        )
      };
    }));
  };

  const updateMedicationHours = (orderId: string, medId: string, hours: AprazamentoHour[]) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        medications: order.medications.map(med => 
          med.id === medId ? { ...med, hours } : med
        )
      };
    }));
  };

  return (
    <PrescriptionsContext.Provider value={{ orders, addPrescriptionOrder, updateMedicationStatus, updateMedicationHours }}>
      {children}
    </PrescriptionsContext.Provider>
  );
}

export function usePrescriptions() {
  const context = useContext(PrescriptionsContext);
  if (context === undefined) {
    throw new Error('usePrescriptions must be used within a PrescriptionsProvider');
  }
  return context;
}
