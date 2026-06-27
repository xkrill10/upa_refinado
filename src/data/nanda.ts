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
    title: "🩹 Dor Aguda",
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

export const NANDA_PEDIATRIC_DIAGNOSES: NandaDiagnosis[] = [
  {
    id: "ped_respiratorio",
    title: "🫁 Padrão Respiratório Ineficaz (Pediátrico)",
    definition:
      "Relacionado a imaturidade pulmonar, infecção (bronquiolite/asma) ou fadiga muscular, evidenciado por tiragem subcostal, gemência, batimento de asa de nariz ou taquipneia.",
    nocs: [
      "Meta: Padrão respiratório estável com FR adequada para a idade",
      "Meta: Ausência de tiragens, gemência ou cianose central",
      "Meta: Saturação de O2 >= 94% em ar ambiente",
    ],
    nics: [
      "NIC: Monitorar FR, esforço respiratório, coloração da pele e saturação",
      "NIC: Realizar aspiração de vias aéreas e lavagem nasal se necessário",
      "NIC: Manter cabeceira elevada (fowler/semi-fowler) e administrar O2 se prescrito",
    ],
  },
  {
    id: "ped_desidratacao",
    title: "💧 Risco de Volume de Líquidos Deficiente",
    definition:
      "Relacionado a perdas ativas (vômitos/diarreia) e ingestão insuficiente (recusa alimentar/hídrica).",
    nocs: [
      "Meta: Hidratação adequada (mucosas úmidas, turgor elástico)",
      "Meta: Débito urinário normal para a idade (fraldas pesadas)",
      "Meta: Fontanela normotensa (se lactente)",
    ],
    nics: [
      "NIC: Pesar fraldas para controle rigoroso de diurese (Balanço Hídrico)",
      "NIC: Oferecer SRO (Soro de Rehidratação Oral) em pequenas montas e frequente",
      "NIC: Iniciar e manter hidratação venosa contínua se prescrito",
    ],
  },
  {
    id: "ped_hipertermia",
    title: "🌡️ Hipertermia",
    definition:
      "Relacionada a processo infeccioso/inflamatório, evidenciada por temperatura axilar aumentada, taquicardia, pele quente ao toque ou irritabilidade.",
    nocs: [
      "Meta: Temperatura axilar mantida em níveis normais (36,5 - 37,2°C)",
      "Meta: Conforto restaurado sem agitação ou calafrios",
      "Meta: Ausência de episódios de convulsão febril",
    ],
    nics: [
      "NIC: Monitorar temperatura axilar a cada 1-2 horas rigorosamente",
      "NIC: Administrar antitérmicos conforme prescrição médica e orientar os pais",
      "NIC: Promover resfriamento mecânico (banho morno, retirar excesso de roupas)",
    ],
  },
  {
    id: "ped_ansiedade",
    title: "🧸 Medo / Ansiedade Infantil",
    definition:
      "Relacionado à separação do ambiente familiar, procedimentos dolorosos ou pessoas estranhas, evidenciado por choro inconsolável, agitação ou agressividade.",
    nocs: [
      "Meta: Ansiedade reduzida: Criança permite aproximação e exame",
      "Meta: Pais/responsáveis demonstram segurança no cuidado",
      "Meta: Ausência de trauma psicológico relacionado à internação",
    ],
    nics: [
      "NIC: Permitir e encorajar a presença do acompanhante em tempo integral",
      "NIC: Utilizar técnicas de distração (brinquedos, telas) durante procedimentos",
      "NIC: Explicar os procedimentos à criança de forma simples e lúdica antes de tocar",
    ],
  },
  {
    id: "ped_dor",
    title: "🩹 Dor Aguda (Pediátrica)",
    definition:
      "Relacionada a processo inflamatório ou procedimentos invasivos, evidenciada por choro persistente, expressão facial contraída e agitação motora.",
    nocs: [
      "Meta: Escala de dor pediátrica (FLACC/Wong-Baker) <= 3",
      "Meta: Sinais vitais normalizados após analgesia",
      "Meta: Criança calma e capaz de dormir/brincar",
    ],
    nics: [
      "NIC: Avaliar dor usando escalas pediátricas validadas (FLACC ou Wong-Baker)",
      "NIC: Administrar analgésicos sob prescrição médica rigorosamente por peso",
      "NIC: Promover medidas não farmacológicas (colo, sucção não nutritiva, ambiente calmo)",
    ],
  }
];
