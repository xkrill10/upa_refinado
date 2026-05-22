export type MedicationCategory = 
  | 'antibiotic' 
  | 'analgesic' 
  | 'anti-inflammatory' 
  | 'cardiovascular' 
  | 'emergency' 
  | 'respiratory' 
  | 'gastrointestinal' 
  | 'solution' 
  | 'supply'
  | 'allergy'
  | 'corticoid'
  | 'endocrine'
  | 'psychotropic'
  | 'narcotic'
  | 'thermolabile'
  | 'high-alert'
  | 'chemotherapy'
  | 'enteral'
  | 'non-standard'
  | 'general'
  | 'obstetric'
  | 'other'
  | 'pediatric';

export type MovementType = 'entry' | 'exit' | 'dispensing' | 'expired';

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category: MedicationCategory;
  presentation: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  lot: string;
  expirationDate: string;
  location: string;
  controlled: boolean;
}

export interface Movement {
  id: string;
  medicationId: string;
  type: MovementType;
  quantity: number;
  date: string;
  userId: string;
  professional: string;
  patientId?: string;
  patientName?: string;
  observation?: string;
}

export const categoryLabels: Record<MedicationCategory, string> = {
  antibiotic: 'Antibiótico',
  analgesic: 'Analgésico',
  'anti-inflammatory': 'Anti-inflamatório',
  cardiovascular: 'Cardiovascular',
  emergency: 'Emergência',
  respiratory: 'Respiratório',
  gastrointestinal: 'Gastrointestinal',
  solution: 'Solução',
  supply: 'Insumo',
  allergy: 'Antialérgico',
  corticoid: 'Corticoide',
  endocrine: 'Endócrino',
  psychotropic: 'Psicotrópicos',
  narcotic: 'Narcóticos',
  thermolabile: 'Termolábil (Geladeira)',
  'high-alert': 'Alta Vigilância / Alerta',
  chemotherapy: 'Quimioterapia',
  enteral: 'Uso Enteral',
  'non-standard': 'Não Padronizado',
  general: 'Geral / Rotina',
  obstetric: 'Obstétrico',
  pediatric: 'Pediatria',
  other: 'Outros'
};

export const movementLabels: Record<MovementType, string> = {
  entry: 'Entrada',
  exit: 'Saída',
  dispensing: 'Dispensação',
  expired: 'Vencido'
};
