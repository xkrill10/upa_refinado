import React, { createContext, useContext, useState, ReactNode } from 'react';

export type BedStatus = 'available' | 'occupied' | 'maintenance';

export interface Bed {
  id: string;
  name: string;
  status: BedStatus;
  ward: string;
  room: string;
  lastUpdated: string;
  patientId?: string;
}

interface BedsContextType {
  beds: Bed[];
  updateBedStatus: (id: string, status: BedStatus) => void;
  assignPatient: (bedId: string, patientId: string) => void;
  releaseBed: (bedId: string) => void;
  transferPatient: (sourceBedId: string, targetBedId: string) => void;
  getStats: () => { available: number, occupied: number, maintenance: number };
}

const generateBeds = () => {
  // IDs de pacientes existentes (PatientsContext) atribuídos aos leitos ocupados
  const occupiedPatientIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];

  const emergencyBeds: Bed[] = Array.from({ length: 10 }, (_, i) => ({
    id: `e-${i + 1}`,
    name: `Leito Emergência ${i + 1}`,
    status: i < 4 ? 'occupied' : i === 4 ? 'maintenance' : 'available',
    ward: 'Emergência',
    room: `Box ${i + 1}`,
    lastUpdated: '15min',
    patientId: i < 4 ? occupiedPatientIds[i] : undefined,
  }));

  const observationBeds: Bed[] = Array.from({ length: 17 }, (_, i) => ({
    id: `o-${i + 1}`,
    name: `Leito Observação ${i + 1}`,
    status: i < 8 ? 'occupied' : i === 8 ? 'maintenance' : 'available',
    ward: 'Observação',
    room: `Quarto ${Math.floor(i / 4) + 1}`,
    lastUpdated: '45min',
    patientId: i < 8 ? occupiedPatientIds[(i + 4) % occupiedPatientIds.length] : undefined,
  }));

  return [...emergencyBeds, ...observationBeds];
};

const initialBeds: Bed[] = generateBeds();

const BedsContext = createContext<BedsContextType | undefined>(undefined);

export function BedsProvider({ children }: { children: ReactNode }) {
  const [beds, setBeds] = useState<Bed[]>(initialBeds);

  const updateBedStatus = (id: string, status: BedStatus) => {
    setBeds(prev => prev.map(bed => 
      bed.id === id ? { ...bed, status, lastUpdated: 'Agora' } : bed
    ));
  };

  const assignPatient = (bedId: string, patientId: string) => {
    setBeds(prev => prev.map(bed => 
      bed.id === bedId ? { ...bed, status: 'occupied', patientId, lastUpdated: 'Agora' } : bed
    ));
  };

  const releaseBed = (bedId: string) => {
    setBeds(prev => prev.map(bed => 
      bed.id === bedId ? { ...bed, status: 'available', patientId: undefined, lastUpdated: 'Agora' } : bed
    ));
  };
  
  const transferPatient = (sourceBedId: string, targetBedId: string) => {
    setBeds(prev => {
      const sourceBed = prev.find(b => b.id === sourceBedId);
      if (!sourceBed || !sourceBed.patientId) return prev;
      
      const patientId = sourceBed.patientId;
      
      return prev.map(bed => {
        if (bed.id === sourceBedId) {
          return { ...bed, status: 'available', patientId: undefined, lastUpdated: 'Agora' };
        }
        if (bed.id === targetBedId) {
          return { ...bed, status: 'occupied', patientId, lastUpdated: 'Agora' };
        }
        return bed;
      });
    });
  };

  const getStats = () => {
    return beds.reduce((acc, bed) => {
      acc[bed.status]++;
      return acc;
    }, { available: 0, occupied: 0, maintenance: 0 });
  };

  return (
    <BedsContext.Provider value={{ beds, updateBedStatus, assignPatient, releaseBed, transferPatient, getStats }}>
      {children}
    </BedsContext.Provider>
  );
}

export function useBeds() {
  const context = useContext(BedsContext);
  if (context === undefined) {
    throw new Error('useBeds must be used within a BedsProvider');
  }
  return context;
}
