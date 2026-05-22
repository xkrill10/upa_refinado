import { usePatientsContext, Patient } from '@/context/PatientsContext';

export type { Patient };

export function usePatients() {
  const context = usePatientsContext();
  return context;
}
