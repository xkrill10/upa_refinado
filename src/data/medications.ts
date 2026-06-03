export interface MedicationItem {
  id: string;
  name: string;
  description: string;
  category: string;
  routes: string[];
}

export const MEDICATIONS_DATABASE: MedicationItem[] = [
  // 🟢 Analgésicos e antitérmicos
  { id: "med-1", name: "Dipirona", description: "Dor e febre", category: "Analgésicos e antitérmicos", routes: ["VO", "IV", "IM"] },
  { id: "med-2", name: "Paracetamol", description: "Dor leve e febre", category: "Analgésicos e antitérmicos", routes: ["VO"] },
  { id: "med-3", name: "Ibuprofeno", description: "Dor e inflamação", category: "Analgésicos e antitérmicos", routes: ["VO"] },
  { id: "med-4", name: "Cetoprofeno", description: "Dor moderada e inflamação", category: "Analgésicos e antitérmicos", routes: ["VO", "IV", "IM"] },
  { id: "med-5", name: "Tramadol", description: "Dor moderada a intensa", category: "Analgésicos e antitérmicos", routes: ["VO", "IV", "IM"] },

  // 🟡 Anti-inflamatórios (AINEs)
  { id: "med-6", name: "Diclofenaco", description: "Inflamação agudizada", category: "Anti-inflamatórios (AINEs)", routes: ["VO", "IM"] },
  { id: "med-7", name: "Nimesulida", description: "Inflamação leve a moderada", category: "Anti-inflamatórios (AINEs)", routes: ["VO"] },
  { id: "med-8", name: "Meloxicam", description: "Inflamação crônica e aguda", category: "Anti-inflamatórios (AINEs)", routes: ["VO", "IM"] },
  { id: "med-9", name: "Tenoxicam", description: "Inflamação e dor musculoesquelética", category: "Anti-inflamatórios (AINEs)", routes: ["VO", "IV", "IM"] },

  // 🔵 Antieméticos (náuseas e vômitos)
  { id: "med-10", name: "Ondansetrona", description: "Náuseas e vômitos severos", category: "Antieméticos", routes: ["VO", "IV", "IM"] },
  { id: "med-11", name: "Metoclopramida (Plasil)", description: "Procinético e antiemético", category: "Antieméticos", routes: ["VO", "IV", "IM"] },
  { id: "med-12", name: "Dimenidrinato (Dramin)", description: "Náuseas, tontura e cinetose", category: "Antieméticos", routes: ["VO", "IV", "IM"] },

  // 🟣 Antialérgicos / Corticoides
  { id: "med-13", name: "Prometazina", description: "Antialérgico e sedativo leve", category: "Antialérgicos / Corticoides", routes: ["VO", "IM"] },
  { id: "med-14", name: "Loratadina", description: "Antialérgico não sedante", category: "Antialérgicos / Corticoides", routes: ["VO"] },
  { id: "med-15", name: "Dexclorfeniramina", description: "Antialérgico comum", category: "Antialérgicos / Corticoides", routes: ["VO"] },
  { id: "med-16", name: "Hidrocortisona", description: "Corticoide de ação rápida (emergência)", category: "Antialérgicos / Corticoides", routes: ["IV", "IM"] },
  { id: "med-17", name: "Dexametasona", description: "Corticoide de ação prolongada", category: "Antialérgicos / Corticoides", routes: ["VO", "IV", "IM"] },

  // 🔴 Antibióticos
  { id: "med-18", name: "Amoxicilina", description: "Infecções bacterianas simples", category: "Antibióticos", routes: ["VO"] },
  { id: "med-19", name: "Amoxicilina + Clavulanato", description: "Infecções resistentes", category: "Antibióticos", routes: ["VO", "IV"] },
  { id: "med-20", name: "Azitromicina", description: "Infecções respiratórias/DSTs", category: "Antibióticos", routes: ["VO", "IV"] },
  { id: "med-21", name: "Cefalexina", description: "Infecções de pele e urinárias simples", category: "Antibióticos", routes: ["VO"] },
  { id: "med-22", name: "Ciprofloxacino", description: "Infecções urinárias e gastrointestinais", category: "Antibióticos", routes: ["VO", "IV"] },

  // 🟠 Medicações respiratórias
  { id: "med-23", name: "Salbutamol", description: "Broncodilatador de alívio rápido", category: "Medicações respiratórias", routes: ["Inalação"] },
  { id: "med-24", name: "Ipratrópio (Atrovent)", description: "Broncodilatador anticolinérgico", category: "Medicações respiratórias", routes: ["Inalação"] },
  { id: "med-25", name: "Prednisona", description: "Corticoide oral para asma/DPOC", category: "Medicações respiratórias", routes: ["VO"] },

  // ⚫ Gastrointestinais
  { id: "med-26", name: "Omeprazol", description: "Protetor gástrico", category: "Gastrointestinais", routes: ["VO", "IV"] },
  { id: "med-27", name: "Pantoprazol", description: "Protetor gástrico", category: "Gastrointestinais", routes: ["VO", "IV"] },
  { id: "med-28", name: "Buscopan (Butilbrometo de escopolamina)", description: "Antiespasmódico (cólicas)", category: "Gastrointestinais", routes: ["VO", "IV", "IM"] },
  { id: "med-29", name: "Soro de Reidratação Oral", description: "Reposição hidroeletrolítica", category: "Gastrointestinais", routes: ["VO"] },

  // 🟤 Sedativos leves / ansiolíticos
  { id: "med-30", name: "Diazepam", description: "Ansiedade e crise convulsiva", category: "Sedativos / Ansiolíticos", routes: ["VO", "IV"] },
  { id: "med-31", name: "Clonazepam", description: "Ansiedade e controle de pânico", category: "Sedativos / Ansiolíticos", routes: ["VO", "SL"] },

  // 🔶 Outros muito usados
  { id: "med-32", name: "Soro Fisiológico 0,9%", description: "Hidratação e diluição", category: "Outros", routes: ["IV"] },
  { id: "med-33", name: "Glicose 50%", description: "Correção de hipoglicemia", category: "Outros", routes: ["IV"] },
  { id: "med-34", name: "Adrenalina", description: "Anafilaxia e PCR", category: "Outros", routes: ["IV", "IM", "SC"] },
];
