export interface LibraryItem {
  name: string;
  category: "medication" | "diet" | "therapy" | "nursing";
  dosage?: string;
  route?: string;
  frequency?: string;
  isHighVigilance?: boolean;
}

export const CARE_LIBRARY: LibraryItem[] = [
  // DIETS
  { name: "Jejum", category: "diet", dosage: "Total", route: "-", frequency: "Até 2ª ordem" },
  { name: "Dieta Branda", category: "diet", dosage: "Porção Padrão", route: "VO", frequency: "Desjejum / Almoço / Jantar" },
  { name: "Dieta Líquida", category: "diet", dosage: "Porção Padrão", route: "VO", frequency: "Desjejum / Almoço / Jantar" },
  { name: "Dieta para Diabéticos", category: "diet", dosage: "Porção Padrão", route: "VO", frequency: "Desjejum / Almoço / Jantar" },
  { name: "Dieta Livre", category: "diet", dosage: "Porção Padrão", route: "VO", frequency: "Livre demanda" },

  // MEDICATIONS
  { name: "Dipirona Monoidratada", category: "medication", dosage: "1g (2ml)", route: "EV", frequency: "6/6h" },
  { name: "Paracetamol", category: "medication", dosage: "750mg", route: "VO", frequency: "8/8h" },
  { name: "Ondansetrona", category: "medication", dosage: "4mg (2ml)", route: "EV", frequency: "S/N (Náusea/Vômito)" },
  { name: "Plasil (Metoclopramida)", category: "medication", dosage: "10mg (2ml)", route: "EV", frequency: "8/8h" },
  { name: "Bromoprida", category: "medication", dosage: "10mg (2ml)", route: "EV", frequency: "8/8h" },
  { name: "Cetoprofeno", category: "medication", dosage: "100mg", route: "EV", frequency: "12/12h" },
  { name: "Tramadol", category: "medication", dosage: "50mg", route: "EV", frequency: "8/8h", isHighVigilance: true },
  { name: "Dexametasona", category: "medication", dosage: "4mg (1ml)", route: "EV", frequency: "1x ao dia" },
  { name: "Hioscina (Buscopan)", category: "medication", dosage: "20mg (1ml)", route: "EV", frequency: "8/8h" },
  { name: "Captopril", category: "medication", dosage: "25mg", route: "Sublingual", frequency: "S/N (Pico Hipertensivo)" },
  { name: "Soro Fisiológico 0.9%", category: "medication", dosage: "500ml", route: "EV", frequency: "Livremente (Hidratação)" },
  { name: "Soro Glicosado 5%", category: "medication", dosage: "500ml", route: "EV", frequency: "Contínuo" },
  { name: "Ringer Lactato", category: "medication", dosage: "500ml", route: "EV", frequency: "Livremente" },
  { name: "Ceftriaxona", category: "medication", dosage: "1g", route: "EV", frequency: "12/12h", isHighVigilance: false },
  { name: "Omeprazol", category: "medication", dosage: "40mg", route: "EV", frequency: "1x ao dia" },
  { name: "Heparina Sódica", category: "medication", dosage: "5000 UI", route: "SC", frequency: "12/12h", isHighVigilance: true },
  { name: "Insulina Regular", category: "medication", dosage: "Conforme Glicemia", route: "SC", frequency: "S/N", isHighVigilance: true },
  { name: "Morfina", category: "medication", dosage: "2mg", route: "EV", frequency: "S/N (Dor Forte)", isHighVigilance: true },

  // NURSING
  { name: "Acesso Venoso Periférico", category: "nursing", dosage: "-", route: "MSD/MSE", frequency: "Manter pérvio" },
  { name: "Mudança de Decúbito", category: "nursing", dosage: "Padrão", route: "Leito", frequency: "2/2h" },
  { name: "Banho no Leito", category: "nursing", dosage: "Completo", route: "Leito", frequency: "1x ao dia" },
  { name: "Curativo", category: "nursing", dosage: "-", route: "-", frequency: "1x ao dia" },
  { name: "Glicemia Capilar", category: "nursing", dosage: "-", route: "Dedo", frequency: "6/6h" },
  { name: "Sinais Vitais", category: "nursing", dosage: "Pressão, Pulso, Temp, Sat", route: "-", frequency: "4/4h" },

  // THERAPIES
  { name: "Fisioterapia Motora", category: "therapy", dosage: "1 Sessão", route: "Leito", frequency: "1x ao dia" },
  { name: "Fisioterapia Respiratória", category: "therapy", dosage: "1 Sessão", route: "Leito", frequency: "2x ao dia" },
  { name: "Oxigenoterapia", category: "therapy", dosage: "2 L/min", route: "Cateter Nasal", frequency: "Contínuo" },
  { name: "Nebulização com SF 0.9%", category: "therapy", dosage: "5ml", route: "Inalatória", frequency: "6/6h" },
];
