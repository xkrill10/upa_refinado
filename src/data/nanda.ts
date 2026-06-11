export interface NandaDiagnosis {
  id: string;
  title: string;
  definition: string;
  nocs: string[];
  nics: string[];
}

export const NANDA_DIAGNOSES: NandaDiagnosis[] = [
  {
    id: "dor_aguda",
    title: "⚡ Dor Aguda",
    definition:
      "Relacionada a agentes lesivos (químicos, físicos ou biológicos) evidenciada por relato verbal, expressão facial ou comportamento protetor.",
    nocs: [
      "Meta: Dor leve ou ausente (escore de dor <= 3)",
      "Meta: Controle da Dor (Paciente refere alívio após intervenção)",
      "Meta: Nível de Conforto Físico e bem-estar geral restabelecido",
    ],
    nics: [
      "NIC: Monitorar dor a cada 2 horas e aplicar compressas frias/quentes",
      "NIC: Administrar analgésicos e medicamentos prescritos em tempo hábil",
      "NIC: Minimizar estímulos ambientais nocivos (luminosos/sonoros)",
    ],
  },
  {
    id: "resp_ineficaz",
    title: "🫁 Padrão Respiratório Ineficaz",
    definition:
      "Relacionado a fadiga muscular respiratória ou espasmo brônquico, evidenciado por dispneia, taquipneia ou uso de musculatura acessória.",
    nocs: [
      "Meta: Estado Respiratório: Ventilação estável e FR normal",
      "Meta: Saturação de Oxigênio (Manter SpO2 >= 94% em ar ambiente)",
      "Meta: Vias Aéreas Pérveas, sem ruídos adventícios",
    ],
    nics: [
      "NIC: Monitorar padrão ventilatório, frequência respiratória e ausculta",
      "NIC: Administrar Oxigenoterapia conforme protocolo ou prescrição",
      "NIC: Posicionar o paciente em Fowler/Semi-Fowler (cabeceira a 45°)",
    ],
  },
  {
    id: "risco_infeccao",
    title: "🦠 Risco de Infecção",
    definition:
      "Relacionado a procedimentos invasivos como punção de acesso venoso periférico, sondagem vesical ou aspiração de vias aéreas.",
    nocs: [
      "Meta: Severidade da Infecção (Ausência de febre, calafrios ou secreções)",
      "Meta: Integridade de Acesso Venoso (Sem dor, calor, rubor ou edema)",
      "Meta: Sinais vitais de rotina estáveis e dentro da normalidade",
    ],
    nics: [
      "NIC: Higienização rigorosa das mãos e antissepsia alcoólica antes de manipular",
      "NIC: Cuidados com Acesso Venoso: Monitorar local de inserção e trocar curativos",
      "NIC: Aplicar técnica estéril/asséptica estrita em todos os procedimentos",
    ],
  },
  {
    id: "troca_gases",
    title: "🫁 Troca de Gases Prejudicada",
    definition:
      "Relacionada a desequilíbrio na ventilação-perfusão, evidenciada por hipoxemia, cianose periférica/central, dispneia ou agitação.",
    nocs: [
      "Meta: Estado Respiratório: Troca de Gases (Ausência de cianose, gasometria estável)",
      "Meta: Perfusão Tecidual periférica normalizada (perfusão periférica <= 2s)",
    ],
    nics: [
      "NIC: Controle Ácido-Básico (Monitorar gasometria arterial e eletrólitos)",
      "NIC: Controle de Vias Aéreas: Estimular tosse e aspirar se necessário",
      "NIC: Auxiliar e monitorar na Ventilação Não Invasiva (VNI) ou alto fluxo",
    ],
  },
  {
    id: "vol_liquidos_def",
    title: "💧 Volume de Líquidos Deficiente",
    definition:
      "Relacionado a perdas ativas (vômitos, diarreia, hemorragia), evidenciado por mucosas secas, turgor cutâneo diminuído ou taquicardia.",
    nocs: [
      "Meta: Equilíbrio Hídrico (Turgor cutâneo preservado, mucosas úmidas)",
      "Meta: Status de Hidratação (Diurese espontânea adequada > 0.5 ml/kg/h)",
    ],
    nics: [
      "NIC: Controle de Líquidos/Eletrólitos: Monitorar balanço hídrico rigoroso",
      "NIC: Ressuscitação Volêmica: Infundir cristaloides conforme prescrição",
      "NIC: Avaliar hemodinâmica: Verificar PA, FC e perfusão tecidual",
    ],
  },
  {
    id: "pele_prejudicada",
    title: "🩹 Integridade da Pele Prejudicada",
    definition:
      "Relacionada a pressão prolongada, umidade ou cisalhamento, evidenciada por rompimento de epiderme/derme (Lesão por Pressão).",
    nocs: [
      "Meta: Integridade Tisular: Pele e Mucosas (Cicatrização de lesão)",
      "Meta: Cura de Feridas por Segunda Intenção (Formação de tecido de granulação)",
    ],
    nics: [
      "NIC: Prevenção de Lesões: Mudança de decúbito de 2/2h e colchão pneumático",
      "NIC: Cuidados com a Pele: Manter pele limpa, seca e intensamente hidratada",
      "NIC: Cuidados com Feridas: Realizar curativos prescritos com técnica asséptica",
    ],
  },
];
