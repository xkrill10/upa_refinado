export interface LibraryItem {
  name: string;
  category: "medication" | "diet" | "therapy" | "nursing";
  dosage?: string;
  route?: string;
  frequency?: string;
  isHighVigilance?: boolean;
  isDoubleCheckRequired?: boolean;
}

export const CARE_LIBRARY: LibraryItem[] = [
  // DIETS
  { name: "Jejum", category: "diet", dosage: "Total", route: "-", frequency: "AtÃ© 2Âª ordem" },
  { name: "Dieta Branda", category: "diet", dosage: "PorÃ§Ã£o PadrÃ£o", route: "VO", frequency: "Desjejum / AlmoÃ§o / Jantar" },
  { name: "Dieta LÃ­quida", category: "diet", dosage: "PorÃ§Ã£o PadrÃ£o", route: "VO", frequency: "Desjejum / AlmoÃ§o / Jantar" },
  { name: "Dieta para DiabÃ©ticos", category: "diet", dosage: "PorÃ§Ã£o PadrÃ£o", route: "VO", frequency: "Desjejum / AlmoÃ§o / Jantar" },
  { name: "Dieta Livre", category: "diet", dosage: "PorÃ§Ã£o PadrÃ£o", route: "VO", frequency: "Livre demanda" },

  // MEDICATIONS
  { name: "Dipirona Monoidratada", category: "medication", dosage: "1g (2ml)", route: "EV", frequency: "6/6h" },
  { name: "Paracetamol", category: "medication", dosage: "750mg", route: "VO", frequency: "8/8h" },
  { name: "Ondansetrona", category: "medication", dosage: "4mg (2ml)", route: "EV", frequency: "S/N (NÃ¡usea/VÃ´mito)" },
  { name: "Plasil (Metoclopramida)", category: "medication", dosage: "10mg (2ml)", route: "EV", frequency: "8/8h" },
  { name: "Bromoprida", category: "medication", dosage: "10mg (2ml)", route: "EV", frequency: "8/8h" },
  { name: "Cetoprofeno", category: "medication", dosage: "100mg", route: "EV", frequency: "12/12h" },
  { name: "Tramadol", category: "medication", dosage: "50mg", route: "EV", frequency: "8/8h", isHighVigilance: true, isDoubleCheckRequired: true },
  { name: "Dexametasona", category: "medication", dosage: "4mg (1ml)", route: "EV", frequency: "1x ao dia" },
  { name: "Hioscina (Buscopan)", category: "medication", dosage: "20mg (1ml)", route: "EV", frequency: "8/8h" },
  { name: "Captopril", category: "medication", dosage: "25mg", route: "Sublingual", frequency: "S/N (Pico Hipertensivo)" },
  { name: "Soro FisiolÃ³gico 0.9%", category: "medication", dosage: "500ml", route: "EV", frequency: "Livremente (HidrataÃ§Ã£o)" },
  { name: "Soro Glicosado 5%", category: "medication", dosage: "500ml", route: "EV", frequency: "ContÃ­nuo" },
  { name: "Ringer Lactato", category: "medication", dosage: "500ml", route: "EV", frequency: "Livremente" },
  { name: "Ceftriaxona", category: "medication", dosage: "1g", route: "EV", frequency: "12/12h", isHighVigilance: false },
  { name: "Omeprazol", category: "medication", dosage: "40mg", route: "EV", frequency: "1x ao dia" },
  { name: "Heparina SÃ³dica", category: "medication", dosage: "5000 UI", route: "SC", frequency: "12/12h", isHighVigilance: true },
  { name: "Insulina Regular", category: "medication", dosage: "Conforme Glicemia", route: "SC", frequency: "S/N", isHighVigilance: true },
  { name: "Morfina", category: "medication", dosage: "2mg", route: "EV", frequency: "S/N (Dor Forte)", isHighVigilance: true },

  // NURSING
  { name: "Acesso Venoso PerifÃ©rico", category: "nursing", dosage: "-", route: "MSD/MSE", frequency: "Manter pÃ©rvio" },
  { name: "MudanÃ§a de DecÃºbito", category: "nursing", dosage: "PadrÃ£o", route: "Leito", frequency: "2/2h" },
  { name: "Banho no Leito", category: "nursing", dosage: "Completo", route: "Leito", frequency: "1x ao dia" },
  { name: "Curativo", category: "nursing", dosage: "-", route: "-", frequency: "1x ao dia" },
  { name: "Glicemia Capilar", category: "nursing", dosage: "-", route: "Dedo", frequency: "6/6h" },
  { name: "Aferir Sinais Vitais", category: "nursing", dosage: "PA, FC, SpO2, Temp, FR", route: "-", frequency: "4/4h" },
  { name: "Monitoramento de Sinais Vitais", category: "nursing", dosage: "PA, FC, SpO2, Temp, FR", route: "-", frequency: "4/4h" },

  // THERAPIES
  { name: "Fisioterapia Motora", category: "therapy", dosage: "1 SessÃ£o", route: "Leito", frequency: "1x ao dia" },
  { name: "Fisioterapia RespiratÃ³ria", category: "therapy", dosage: "1 SessÃ£o", route: "Leito", frequency: "2x ao dia" },
  { name: "Oxigenoterapia", category: "therapy", dosage: "2 L/min", route: "Cateter Nasal", frequency: "ContÃ­nuo" },
  { name: "NebulizaÃ§Ã£o com SF 0.9%", category: "therapy", dosage: "5ml", route: "InalatÃ³ria", frequency: "6/6h" },

  // PEDIATRIC NURSING
  { name: "👶 Manter grades do berço ou maca elevadas", category: "nursing", dosage: "-", route: "-", frequency: "Tempo integral" },
  { name: "👶 Pesar fraldas (Balanço Hídrico)", category: "nursing", dosage: "-", route: "-", frequency: "A cada troca" },
  { name: "👶 Controle Rigoroso de Temperatura", category: "nursing", dosage: "-", route: "-", frequency: "2/2h" },
  { name: "👶 Permitir acompanhante", category: "nursing", dosage: "-", route: "-", frequency: "Tempo integral" },
  { name: "👶 Inalação / O2 Terapia", category: "therapy", dosage: "Conforme protocolo", route: "Inalatória", frequency: "S/N" }
];
