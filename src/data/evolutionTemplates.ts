export interface CareItem {
  id: string;
  label: string;
  text: string;
  toastMsg: string;
}

export const EVOLUTION_TEMPLATES: Record<string, string> = {
  "Evolução Médica":
    "Paciente em bom estado geral, corado, hidratado, eupneico, afebril, acianótico.\n" +
    "Aparelho Cardiovascular: Ritmo cardíaco regular em 2 tempos, bulhas normofonéticas, sem sopros.\n" +
    "Aparelho Respiratório: Murmúrio vesicular universalmente audível, sem ruídos adventícios.\n" +
    "Abdômen: Flácido, indolor à palpação, ruídos hidroaéreos presentes, sem visceromegalias.\n" +
    "Queixas Atuais: [ ]\n" +
    "Conduta adotada: [ ]",

  "Evolução Médica (Pediátrica)":
    "Criança em bom estado geral, ativa e reativa. Hidratada, corada, acianótica, anictérica.\n" +
    "Acompanhada por: [Mãe/Pai/Responsável].\n" +
    "Aparelho Respiratório: Eupneica, sem esforço respiratório, murmúrio vesicular presente e simétrico.\n" +
    "Aparelho Cardiovascular: Bulhas rítmicas e normofonéticas.\n" +
    "Abdômen: Flácido, indolor, sem massas palpáveis.\n" +
    "Queixas / Observações: [ ]\n" +
    "Conduta: [ ]",

  "Evolução Enfermagem":
    "EVOLUÇÃO DE ENFERMAGEM (Exclusivo do Enfermeiro - Registro de 24h):\n" +
    "1. IDENTIFICAÇÃO: [Data/Hora]\n" +
    "2. ESTADO GERAL:\n" +
    "   - Nível de Consciência: [Consciente / Orientado / Sonolento / Torporoso]\n" +
    "   - Estado Geral: [Bom / Regular / Grave]\n" +
    "   - Sinais Vitais: [PA, FC, SpO2, Temp, FR]\n" +
    "3. PROCEDIMENTOS & DISPOSITIVOS:\n" +
    "   - Acesso Venoso: [Membro, calibre, sem sinais flogísticos]\n" +
    "   - Dispositivos: [Sondagens, drenos, curativos]\n" +
    "4. AVALIAÇÃO CLÍNICA & RACIOCÍNIO:\n" +
    "   - Eliminações: [Intestinal e vesical normais/alterados]\n" +
    "   - Nutrição: [Aceitação da dieta, hidratação]\n" +
    "   - Mobilidade & Pele: [Decúbito, integridade cutânea]\n" +
    "5. INTERCORRÊNCIAS & CONDUTA:\n" +
    "   - Resposta aos Cuidados: [Melhoria/Piora com as condutas ministradas]\n" +
    "   - Planejamento de Cuidados: [Próximos passos da assistência de enfermagem]\n" +
    "--- Assinatura COREN-UF: ",

  "Anotação de Enfermagem":
    "ANOTAÇÃO DE ENFERMAGEM (Dados Brutos, Imediatos e Pontuais da Equipe):\n" +
    "1. Registro do momento: [Ex: 14:00h - Admissão / Medicado / Banho / Curativo]\n" +
    "2. Sinais Vitais anotados no momento: [PA: , FC: , Temp: , SpO2: ]\n" +
    "3. Queixas pontuais referidas: [ ]\n" +
    "4. Intercorrências observadas ou procedimentos executados: [ ]\n" +
    "5. Assinatura do Profissional (Coren Técnico/Enfermeiro): ",

  "Sinais Vitais":
    "REGISTRO DE SINAIS VITAIS:\n" +
    "- Pressão Arterial (PA): [   ] mmHg\n" +
    "- Frequência Cardíaca (FC): [   ] bpm\n" +
    "- Saturação de O2 (SpO2): [   ]%\n" +
    "- Temperatura Corporal: [   ] °C\n" +
    "- Frequência Respiratória (FR): [   ] irpm\n" +
    "- Escala de Dor: [   ]/10",

  Procedimento:
    "Procedimento realizado: [   ]\n" +
    "Materiais utilizados: [   ]\n" +
    "Intercorrências durante o procedimento: [Não houve / Descrever]\n" +
    "Orientações dadas ao paciente: Mantido em repouso e sob observação clínica.",

  Alta:
    "ALTA MÉDICA:\n" +
    "- Condições de alta: Paciente estável, afebril, apresentando melhora clínica significativa das queixas iniciais.\n" +
    "- Orientações fornecidas: [   ]\n" +
    "- Encaminhamentos: [   ]\n" +
    "- Receitas de controle domiciliar e atestado médico entregues em mãos.",

  "Evolução da Fisioterapia":
    "EVOLUÇÃO DA FISIOTERAPIA:\n" +
    "1. Avaliação Respiratória: [ ]\n" +
    "2. Avaliação Motora: [ ]\n" +
    "3. Condutas Realizadas: [ ]\n" +
    "4. Observações: [ ]",

  "Evolução da Nutrição":
    "EVOLUÇÃO DA NUTRIÇÃO:\n" +
    "1. Aceitação da Dieta: [ ]\n" +
    "2. Via de Alimentação: [Oral / SNG / SNE / NPT]\n" +
    "3. Condutas/Alteração de Dieta: [ ]\n" +
    "4. Observações: [ ]",

  "Evolução da Psicologia":
    "EVOLUÇÃO DA PSICOLOGIA:\n" +
    "1. Estado Emocional: [ ]\n" +
    "2. Suporte Familiar: [ ]\n" +
    "3. Condutas: [ ]\n" +
    "4. Observações: [ ]",

  "Evolução do Serviço Social":
    "EVOLUÇÃO DO SERVIÇO SOCIAL:\n" +
    "1. Acolhimento Familiar: [ ]\n" +
    "2. Demandas Sociais Identificadas: [ ]\n" +
    "3. Encaminhamentos: [ ]\n" +
    "4. Observações: [ ]",

  "Evolução da Terapia Ocupacional":
    "EVOLUÇÃO DA TERAPIA OCUPACIONAL:\n" +
    "1. Atividades de Vida Diária (AVD): [ ]\n" +
    "2. Estímulo Sensório-Motor: [ ]\n" +
    "3. Condutas: [ ]\n" +
    "4. Observações: [ ]",

  "Evolução da Fonoaudiologia":
    "EVOLUÇÃO DA FONOAUDIOLOGIA:\n" +
    "1. Avaliação de Deglutição: [ ]\n" +
    "2. Risco de Broncoaspiração: [ ]\n" +
    "3. Condutas/Dieta: [ ]\n" +
    "4. Observações: [ ]",

  "Evolução da Farmácia Clínica":
    "EVOLUÇÃO DA FARMÁCIA CLÍNICA:\n" +
    "1. Reconciliação Medicamentosa: [ ]\n" +
    "2. Interações e Alergias: [ ]\n" +
    "3. Intervenções Realizadas: [ ]\n" +
    "4. Observações: [ ]",
};

export const MEDICATION_CARE_ITEMS: CareItem[] = [
  {
    id: "puncao",
    label: "🩸 Punção Venosa",
    text: "PUNÇÃO VENOSA:\n- Realizada punção venosa periférica em [MSE / MSD] com cateter calibre [20G / 22G / 24G].\n- Acesso pérvio, fixado com curativo transparente e salinizado conforme protocolo. Sem sinais flogísticos.\n",
    toastMsg: "Punção Venosa",
  },
  {
    id: "med_feita",
    label: "✅ Medicação Feita",
    text: "MEDICAÇÃO ADMINISTRADA:\n- Administrada medicação conforme prescrição médica do horário vigente.\n- Paciente não apresentou reações adversas ou intercorrências durante a infusão. Acesso mantido pérvio.\n",
    toastMsg: "Medicação Feita",
  },
  {
    id: "recusa",
    label: "🚫 Recusa Medicação",
    text: "RECUSA DE MEDICAÇÃO:\n- Paciente/Acompanhante recusa a administração da medicação proposta na prescrição.\n- Orientado quanto aos riscos da recusa. Médico plantonista e Enfermeiro comunicados do fato.\n",
    toastMsg: "Recusa de Medicação",
  },
  {
    id: "hgt",
    label: "🩸 Glicemia Capilar (HGT)",
    text: "GLICEMIA CAPILAR (HGT):\n- Realizado teste de glicemia capilar. Resultado: [ ] mg/dL.\n- Administrado insulina regular conforme protocolo/prescrição se aplicável. Médico plantonista ciente caso haja alteração crítica.\n",
    toastMsg: "Glicemia Capilar (HGT)",
  },
  {
    id: "soroterapia",
    label: "💧 Soroterapia / Infusão",
    text: "SOROTERAPIA:\n- Instalado soroterapia / hidratação venosa contínua conforme prescrição.\n- Infusão correndo sob bomba de infusão / gotejamento adequado, sem sinais de infiltração ou extravasamento.\n",
    toastMsg: "Soroterapia / Infusão",
  },
  {
    id: "inalacao",
    label: "🫁 Inalação / Nebulização",
    text: "NEBULIZAÇÃO / INALAÇÃO:\n- Realizada inalação/nebulização com broncodilatador conforme prescrição médica.\n- Paciente tolerou bem o procedimento, referindo melhora do padrão respiratório após término.\n",
    toastMsg: "Inalação / Nebulização",
  },
  {
    id: "retirada_acesso",
    label: "❌ Retirada de Acesso",
    text: "RETIRADA DE ACESSO VENOSO:\n- Retirado acesso venoso periférico devido a alta / término do tratamento / infiltração.\n- Dispositivo retirado íntegro. Realizado curativo compressivo local, sem sangramentos.\n",
    toastMsg: "Retirada de Acesso",
  },
];

export const NURSING_CARE_ITEMS: CareItem[] = [
  {
    id: "banho",
    label: "🚿 Banho no Leito",
    text: "- Realizado banho no leito com troca de roupas de cama.\n",
    toastMsg: "Banho no Leito",
  },
  {
    id: "decubito",
    label: "🔄 Mudança de Decúbito",
    text: "- Realizada mudança de decúbito para prevenção de LPP.\n",
    toastMsg: "Mudança de Decúbito",
  },
  {
    id: "curativo",
    label: "🩹 Troca de Curativo",
    text: "- Realizada troca de curativo em [LOCAL], aspecto limpo e seco.\n",
    toastMsg: "Troca de Curativo",
  },
  {
    id: "dieta_elim",
    label: "🍽️ Dieta e Eliminações",
    text: "- Aceitação parcial/total da dieta oferecida. Diurese e dejeções presentes na fralda/comadre.\n",
    toastMsg: "Dieta e Eliminações",
  },
  {
    id: "grades",
    label: "🛏️ Grades Elevadas",
    text: "- Mantidas grades do leito elevadas para segurança do paciente (prevenção de queda).\n",
    toastMsg: "Grades Elevadas",
  },
  {
    id: "higiene_oral",
    label: "🪥 Higiene Oral",
    text: "- Realizada higiene oral e conforto do paciente.\n",
    toastMsg: "Higiene Oral",
  },
  {
    id: "pele",
    label: "🦶 Cuidados com a Pele",
    text: "- Aplicado hidratante/ácidos graxos essenciais (AGE) em proeminências ósseas.\n",
    toastMsg: "Cuidados com a Pele",
  },
  {
    id: "controle_ssvv",
    label: "📊 Monitoramento SSVV",
    text: "- Aferido e registrado sinais vitais do horário. Parâmetros clínicos sem alterações críticas.\n",
    toastMsg: "Monitoramento SSVV",
  },
  {
    id: "aspiracao_va",
    label: "🌬️ Aspiração de Vias Aéreas",
    text: "- Realizada aspiração de vias aéreas. Retirada de secreção [fluida / espessa] em moderada quantidade.\n",
    toastMsg: "Aspiração de Vias Aéreas",
  },
];

export const COMFORT_CARE_ITEMS: CareItem[] = [
  {
    id: "higiene",
    label: "🛁 Higiene / Banho",
    text: "HIGIENE E CONFORTO:\n- Realizado banho [NO LEITO / ASPERSÃO].\n- Feita a troca de roupas de cama, roupas do paciente e troca de fraldas.\n- Realizada mudança de decúbito para prevenção de lesões. Deixado confortável no leito.\n",
    toastMsg: "Higiene / Banho",
  },
  {
    id: "dieta",
    label: "🍲 Aceitação de Dieta",
    text: "DIETA / ALIMENTAÇÃO:\n- Dieta oferecida pelo serviço de nutrição com [BOA / PARCIAL / MÁ] aceitação pelo paciente.\n- Mantido padrão de hidratação adequada.\n",
    toastMsg: "Aceitação de Dieta",
  },
  {
    id: "curativo_tec",
    label: "🩹 Curativo",
    text: "CURATIVO TÉCNICO:\n- Realizada troca de curativo em [LOCAL DA FERIDA/LESÃO] com técnica asséptica.\n- Ferida apresenta aspecto [LIMPO / HIPEREMIADO / SECREÇÃO]. Curativo fechado oclusivo limpo e seco.\n",
    toastMsg: "Curativo",
  },
  {
    id: "oxigeno",
    label: "💨 Oxigenoterapia",
    text: "OXIGENOTERAPIA:\n- Instalado/Mantido suporte de O2 via [CATETER NASAL / MÁSCARA] a [ ] L/min.\n- Paciente mantendo SpO2 em [ ]%. Boa adaptação ao dispositivo.\n",
    toastMsg: "Oxigenoterapia",
  },
  {
    id: "sondas",
    label: "💧 Controle Sondas/Drenos",
    text: "CONTROLE DE SONDAS / DRENOS:\n- Realizado esvaziamento de bolsa coletora da [SVD / DRENO].\n- Débito: [ ] ml. Aspecto: [CLARO / HEMÁTICO / PURULENTO].\n- Dispositivo mantido fixo e pérvio.\n",
    toastMsg: "Controle Sondas/Drenos",
  },
  {
    id: "sonda_vesical",
    label: "🚽 Cateterismo Vesical",
    text: "CATETERISMO VESICAL:\n- Realizado cateterismo vesical de [DEMORA / ALÍVIO] sob técnica asséptica e estéril.\n- Obtido retorno imediato de diurese de aspecto [claro / colúrico / hematúrico], totalizando [ ] ml.\n",
    toastMsg: "Cateterismo Vesical",
  },
  {
    id: "sonda_nasogastrica",
    label: "👃 Sondagem Gástrica/Enteral",
    text: "SONDAGEM GÁSTRICA / ENTERAL:\n- Realizada introdução de sonda [SNG / SNE] calibre [ ] para [alimentação / drenagem].\n- Teste de posicionamento (ausculta e resíduo) realizado sem intercorrências. Dispositivo fixado.\n",
    toastMsg: "Sondagem Gástrica/Enteral",
  },
];

export const MOVEMENT_CARE_ITEMS: CareItem[] = [
  {
    id: "transporte",
    label: "🩻 Transporte (RX/ECG)",
    text: "TRANSPORTE / EXAMES:\n- Paciente encaminhado para a sala de [RAIO-X / ECG] em [CADEIRA DE RODAS / MACA].\n- Retornou ao setor de observação sem intercorrências durante o transporte.\n",
    toastMsg: "Transporte (RX/ECG)",
  },
  {
    id: "transferencia",
    label: "🚑 Transferência",
    text: "TRANSFERÊNCIA DE SETOR:\n- Paciente transferido para [SALA VERMELHA / OBSERVAÇÃO / ENFERMARIA].\n- Transportado monitorizado, com suporte contínuo e acesso pérvio. Repassado plantão e pertences.\n",
    toastMsg: "Transferência",
  },
  {
    id: "aviso",
    label: "⚠️ Intercorrência (Aviso Médico)",
    text: "AVISO MÉDICO / INTERCORRÊNCIA:\n- Paciente apresenta queixa de [DOR INTENSA / FALTA DE AR / SANGRAMENTO].\n- Aferido Sinais Vitais imediatamente. \n- Enfermeiro e Médico plantonista comunicados do fato para reavaliação.\n",
    toastMsg: "Intercorrência (Aviso Médico)",
  },
  {
    id: "contencao",
    label: "⛓️ Contenção Mecânica",
    text: "CONTENÇÃO MECÂNICA:\n- Realizada contenção mecânica no leito visando proteção do paciente e da equipe, devido à agitação psicomotora.\n- Mantida vigilância contínua. Membros com boa perfusão periférica.\n",
    toastMsg: "Contenção Mecânica",
  },
  {
    id: "orientacao",
    label: "💬 Orientação Familiar",
    text: "ACOLHIMENTO / ORIENTAÇÃO FAMILIAR:\n- Fornecido informações de enfermagem ao familiar/acompanhante presente.\n- Acompanhante ciente das rotinas do setor, riscos (ex: risco de queda) e condutas do plantão.\n",
    toastMsg: "Orientação Familiar",
  },
  {
    id: "admissao",
    label: "🚪 Admissão no Setor",
    text: "ADMISSÃO NO SETOR:\n- Paciente admitido no setor de observação. Acomodado em [leito / poltrona] com grades elevadas.\n- Realizado acolhimento, identificado com pulseira e orientado quanto às normas do setor.\n",
    toastMsg: "Admissão no Setor",
  },
  {
    id: "evasao",
    label: "🏃 Evasão do Setor",
    text: "EVASÃO DO SETOR:\n- Constatada evasão do paciente do setor de observação sem alta médica.\n- Retirado acesso venoso (se aplicável). Comunicado Enfermeiro e Médico plantonista do fato.\n",
    toastMsg: "Evasão do Setor",
  },
];

export const ADMISSION_ROUTINE_ITEMS: CareItem[] = [
  {
    id: "sala_vermelha",
    label: "🚨 Sala Vermelha",
    text: `ADMISSÃO EM SALA VERMELHA (EMERGÊNCIA):\n\nPaciente admitido(a) na sala vermelha em maca, trazido(a) pelo SAMU/Resgate. Rebaixamento de nível de consciência (Glasgow [ ]). \nInstalada monitorização multiparamétrica (ECG contínuo, SpO2 e PANI). Realizado Acesso Venoso Periférico calibroso. Instalado suporte de oxigênio via [CATETER/MÁSCARA]. \nAguarda reavaliação médica e definição de condutas. Mantida vigilância contínua.`,
    toastMsg: "Rotina: Sala Vermelha",
  },
  {
    id: "obs_adulto",
    label: "🛌 Observação Adulto",
    text: `ADMISSÃO EM OBSERVAÇÃO ADULTO:\n\nPaciente admitido(a) no setor de observação proveniente da recepção/triagem, deambulando. Consciente, orientado(a), comunicativo(a). Eupneico(a) em ar ambiente. \nPuncionado Acesso Venoso Periférico (AVP) em [MEMBRO], salinizado e sem sinais flogísticos.\nOrientado(a) quanto às rotinas do setor. Segue sob cuidados de enfermagem.`,
    toastMsg: "Rotina: Obs Adulto",
  },
  {
    id: "obs_pediatrica",
    label: "👶 Observação Pediátrica",
    text: `ADMISSÃO EM OBSERVAÇÃO PEDIÁTRICA:\n\nCriança admitida no setor de observação infantil acompanhada pelo responsável [NOME DO RESPONSÁVEL]. Ativa, reativa, chorosa ao manuseio, mas consolável.\nRealizado Acesso Venoso Periférico (AVP) em [MEMBRO].\nOrientações prestadas ao familiar quanto ao risco de queda (manter grade elevada). Segue sob cuidados.`,
    toastMsg: "Rotina: Obs Pediátrica",
  },
  {
    id: "passagem_plantao",
    label: "📋 Passagem de Plantão",
    text: `PASSAGEM DE PLANTÃO:\n\nRecebo o plantão com paciente no leito, calmo(a). Mantém AVP pérvio e sem sinais de infiltração/flebite. Dieta aceita. Eliminações presentes. Mantidas as prescrições médicas vigentes. Segue sob cuidados da equipe.`,
    toastMsg: "Rotina: Plantão",
  },
];

export const PEDIATRIC_MEDICATION_CARE_ITEMS: CareItem[] = [
  {
    id: "ped_puncao",
    label: "💉 Punção Venosa Pediátrica",
    text: "PUNÇÃO VENOSA PEDIÁTRICA:\n- Realizada punção venosa periférica em membro [MSE / MSD / MIE / MID] com cateter calibre 24G (tipo Gelco/Scalp).\n- Acesso com excelente fluxo, pérvio, fixado com curativo lúdico/infantil adequado e protegido contra tração. Sem sinais flogísticos.\n",
    toastMsg: "Punção Pediátrica",
  },
  {
    id: "ped_med_feita",
    label: "✅ Medicação Feita (Ped)",
    text: "MEDICAÇÃO ADMINISTRADA (PEDIATRIA):\n- Administrada medicação conforme prescrição pediátrica vigente (dose e diluição adequadas para o peso/faixa etária).\n- Criança tolerou bem a medicação, sem intercorrências ou reações adversas imediatas.\n",
    toastMsg: "Medicação Feita",
  },
  {
    id: "ped_soroterapia",
    label: "💧 Soroterapia / Bomba",
    text: "SOROTERAPIA PEDIÁTRICA:\n- Instalado esquema de hidratação venosa contínua / soroterapia em Bomba de Infusão Contínua (BIC) a [ ] mL/h.\n- Controle rigoroso de gotejamento/fluxo, sem sinais de infiltração, extravasamento ou edema local.\n",
    toastMsg: "Soroterapia Pediátrica",
  },
  {
    id: "ped_inalacao",
    label: "🫁 Inalação / Nebulização",
    text: "NEBULIZAÇÃO PEDIÁTRICA:\n- Realizada inalação/nebulização com máscara infantil adequada conforme prescrição médica.\n- Procedimento bem tolerado sob auxílio e acolhimento do responsável, apresentando melhora do desconforto/ruídos respiratórios após término.\n",
    toastMsg: "Inalação Pediátrica",
  },
  {
    id: "ped_hgt",
    label: "🩸 Glicemia Capilar (HGT)",
    text: "GLICEMIA CAPILAR PEDIÁTRICA:\n- Realizado teste de glicemia capilar (HGT) em região calcânea/digital. Resultado: [ ] mg/dL.\n- Médico plantonista / Pediatra ciente do resultado para conduta.\n",
    toastMsg: "Glicemia Capilar (HGT)",
  },
  {
    id: "ped_recusa",
    label: "🚫 Recusa Alimentar/Med",
    text: "RECUSA / DIFICULDADE DE ACEITAÇÃO:\n- Paciente pediátrico apresenta recusa ou dificuldade importante na ingestão de medicação por via oral / dieta.\n- Realizadas tentativas lúdicas, porém sem sucesso imediato. Enfermeiro e Pediatra plantonista comunicados.\n",
    toastMsg: "Recusa Pediátrica",
  },
  {
    id: "ped_retirada_acesso",
    label: "❌ Retirada de Acesso",
    text: "RETIRADA DE ACESSO VENOSO PEDIÁTRICO:\n- Retirado acesso venoso periférico devido a término de tratamento / alta / infiltração.\n- Cateter retirado íntegro. Realizado curativo local compressivo lúdico, sem sangramentos ativos.\n",
    toastMsg: "Retirada de Acesso",
  },
];

export const PEDIATRIC_NURSING_CARE_ITEMS: CareItem[] = [
  {
    id: "ped_higiene_fraldas",
    label: "👶 Troca de Fraldas / Higiene",
    text: "HIGIENE E CONFORTO PEDIÁTRICO:\n- Realizada troca de fraldas com higiene íntima adequada.\n- Aplicado pomada barreira contra assaduras. Pele íntegra, sem sinais de dermatite de fraldas.\n",
    toastMsg: "Troca de Fraldas / Higiene",
  },
  {
    id: "ped_berco_grades",
    label: "🛏️ Grades do Berço Elevadas",
    text: "MEDIDA DE SEGURANÇA PEDIÁTRICA:\n- Mantidas as grades do berço / leito hospitalar elevadas a 100% do tempo.\n- Responsável orientado sobre a proibição de deixar a criança sozinha no leito para prevenção de quedas.\n",
    toastMsg: "Grades Elevadas",
  },
  {
    id: "ped_dieta_formula",
    label: "🍼 Dieta / Aleitamento",
    text: "NUTRIÇÃO PEDIÁTRICA:\n- Dieta oferecida: [leite materno / fórmula infantil / dieta pastosa] com [boa / regular / aceitação recusada].\n- Padrão de sucção efetivo, sem engasgos ou vômitos pós-prandiais.\n",
    toastMsg: "Dieta / Aleitamento",
  },
  {
    id: "ped_controle_termico",
    label: "🌡️ Controle Térmico / Banho",
    text: "CONTROLE TÉRMICO:\n- Aferido temperatura corporal. Apresentando pico febril de [ ] °C.\n- Administrado antitérmico conforme prescrição, associado a banho morno de aspersão / compressas úmidas para controle físico de temperatura.\n",
    toastMsg: "Controle Térmico",
  },
  {
    id: "ped_desobstrucao_nasal",
    label: "🌬️ Lavagem / Lavagem Nasal",
    text: "DESOBSTRUÇÃO DE VIAS AÉREAS:\n- Realizada desobstrução de vias aéreas superiores com lavagem nasal com Soro Fisiológico 0.9% sob técnica suave.\n- Retorno de secreção mucoide em [pequena / moderada] quantidade, com melhora visível do padrão respiratório.\n",
    toastMsg: "Lavagem Nasal",
  },
  {
    id: "ped_curativo_ludico",
    label: "🩹 Curativo Lúdico",
    text: "CURATIVO PEDIÁTRICO:\n- Realizada troca de curativo local em [LOCAL] sob técnica limpa.\n- Ferida operatória/lesão com bom aspecto, sem secreção purulenta. Fixado com cobertura infantil / fita antialérgica.\n",
    toastMsg: "Curativo Lúdico",
  },
  {
    id: "ped_aspiracao_infantil",
    label: "🌬️ Aspiração de Vias (Ped)",
    text: "ASPIRAÇÃO DE VIAS AÉREAS PEDIÁTRICA:\n- Realizada aspiração de vias aéreas superiores / oral com sonda de calibre adequado. Retirada de secreção [fluida / espessa] clara. Criança tolerou bem.\n",
    toastMsg: "Aspiração Pediátrica",
  },
  {
    id: "ped_decubito",
    label: "🔄 Decúbito Pediátrico",
    text: "- Realizada mudança de decúbito do lactente/criança sob auxílio do responsável para alívio de pontos de pressão e conforto.\n",
    toastMsg: "Decúbito Pediátrico",
  },
  {
    id: "ped_ssvv",
    label: "📊 SSVV Pediátrico",
    text: "- Aferido e registrado sinais vitais específicos para a faixa etária pediátrica (FC, FR, Temp, SpO2). Parâmetros clínicos adequados.\n",
    toastMsg: "SSVV Pediátrico",
  },
  {
    id: "ped_higiene_oral",
    label: "🪥 Higiene Oral Infantil",
    text: "- Realizada higiene oral lúdica com gaze/escova adequada para a idade. Conforto do paciente preservado.\n",
    toastMsg: "Higiene Oral Infantil",
  },
];

export const PEDIATRIC_COMFORT_CARE_ITEMS: CareItem[] = [
  {
    id: "ped_acolhimento_brinquedo",
    label: "🧸 Acolhimento Lúdico",
    text: "ACOLHIMENTO LÚDICO:\n- Utilizado técnicas lúdicas (brinquedo terapêutico, desenhos, ambiente descontraído) para redução da ansiedade, choro e medo durante o atendimento.\n- Criança demonstrou-se mais calma e cooperativa com a equipe.\n",
    toastMsg: "Acolhimento Lúdico",
  },
  {
    id: "ped_apoio_responsavel",
    label: "👩 Suporte ao Acompanhante",
    text: "ORIENTAÇÃO AO ACOMPANHANTE:\n- Fornecido orientações completas à mãe/pai/responsável sobre o plano terapêutico, sinais de alerta de piora e importância do repouso no leito.\n- Responsável demonstra entendimento e colabora com os cuidados vigentes.\n",
    toastMsg: "Suporte ao Acompanhante",
  },
  {
    id: "ped_sono_repouso",
    label: "🛌 Sono e Repouso",
    text: "SONO E REPOUSO:\n- Paciente pediátrico mantido em sono tranquilo no berço / colo do responsável. \n- Ambiente mantido com luminosidade e ruídos reduzidos para favorecer o descanso.\n",
    toastMsg: "Sono e Repouso",
  },
  {
    id: "ped_oxigeno",
    label: "💨 Oxigenoterapia Pediátrica",
    text: "OXIGENOTERAPIA PEDIÁTRICA:\n- Instalado/Mantido suporte de O2 sob máscara infantil / cateter nasal infantil a [ ] L/min.\n- Criança calma e adaptada ao dispositivo, mantendo SpO2 em [ ]%.\n",
    toastMsg: "Oxigenoterapia Pediátrica",
  },
  {
    id: "ped_drenos",
    label: "💧 Sondas e Drenos (Ped)",
    text: "CONTROLE DE SONDAS / DRENOS PEDIÁTRICOS:\n- Realizado esvaziamento e medição de débito de sondas/drenos. Débito de [ ] mL. Aspecto [ ].\n- Dispositivos fixados de forma segura contra tração.\n",
    toastMsg: "Sondas and Drenos (Ped)",
  },
  {
    id: "ped_sonda_vesical",
    label: "🚽 Cateterismo Vesical Ped",
    text: "CATETERISMO VESICAL PEDIÁTRICO:\n- Realizado cateterismo vesical [de alívio / de demora] sob técnica estéril com sonda de calibre pediátrico.\n- Retorno imediato de [ ] mL de urina de aspecto [claro / límpido].\n",
    toastMsg: "Cateterismo Vesical Ped",
  },
  {
    id: "ped_sonda_gastrica",
    label: "👃 Sondagem Gástrica (Ped)",
    text: "SONDAGEM GÁSTRICA PEDIÁTRICA:\n- Realizada introdução de sonda [SNG / SNE] calibre infantil para [alimentação / drenagem] sob técnica correta. Posicionamento testado e confirmado. Dispositivo fixado.\n",
    toastMsg: "Sondagem Gástrica (Ped)",
  },
];

export const PEDIATRIC_MOVEMENT_CARE_ITEMS: CareItem[] = [
  {
    id: "ped_transporte_colo",
    label: "🩻 Transporte Colo/Berço",
    text: "TRANSPORTE PEDIÁTRICO:\n- Criança transportada para realização de exames de imagem (Raio-X / ultrassonografia) [no colo do responsável / em berço móvel] de forma segura.\n- Retornou ao setor sem intercorrências durante o trajeto.\n",
    toastMsg: "Transporte Seguro",
  },
  {
    id: "ped_transferencia_infantil",
    label: "🚑 Transferência Setor",
    text: "TRANSFERÊNCIA DE SETOR PEDIÁTRICO:\n- Paciente transferido para a Observação Infantil / Enfermaria Pediátrica / Sala Vermelha Pediátrica.\n- Acompanhado pelo responsável, com acesso venoso protegido e relatórios de enfermagem entregues.\n",
    toastMsg: "Transferência Infantil",
  },
  {
    id: "ped_intercorrencia_ped",
    label: "⚠️ Intercorrência Pediátrica",
    text: "INTERCORRÊNCIA PEDIÁTRICA:\n- Paciente apresentou [pico febril / vômito em jato / piora do esforço respiratório com gemência / prostração intensa].\n- Sinais vitais aferidos imediatamente. Enfermeiro e Pediatra de plantão acionados para avaliação urgente.\n",
    toastMsg: "Aviso Intercorrência",
  },
  {
    id: "ped_seguranca_familiar",
    label: "💬 Orientação de Segurança",
    text: "ORIENTAÇÃO DE SEGURANÇA:\n- Orientado intensamente o familiar/responsável sobre a proibição de ausentar-se da beira do leito sem avisar a equipe, e sobre a obrigatoriedade de manter as grades do berço/leito sempre elevadas.\n",
    toastMsg: "Orientação de Segurança",
  },
  {
    id: "ped_admissao_setor",
    label: "🚪 Admissão Ala Infantil",
    text: "ADMISSÃO NA ALA PEDIÁTRICA:\n- Paciente pediátrico admitido no setor de observação acompanhado por seu responsável. Identificado com pulseira infantil. Grades elevadas e orientações fornecidas.\n",
    toastMsg: "Admissão Ala Infantil",
  },
  {
    id: "ped_evasao_setor",
    label: "🏃 Evasão Ala Infantil",
    text: "EVASÃO DE SETOR PEDIÁTRICO:\n- Constatada evasão/saída não autorizada do paciente pediátrico acompanhado de seu responsável do setor de observação infantil. Comunicado Enfermeiro e Médico de plantão.\n",
    toastMsg: "Evasão Ala Infantil",
  },
  {
    id: "ped_restricao_terapeutica",
    label: "⛓️ Proteção Terapêutica (Ped)",
    text: "RESTRIÇÃO TERAPÊUTICA PEDIÁTRICA:\n- Realizada restrição suave de membros de forma lúdica/protetiva para impedir tração acidental de dispositivos (AVP/SNG). Mantida monitorização da perfusão distal.\n",
    toastMsg: "Proteção Terapêutica",
  },
];

export const PEDIATRIC_ADMISSION_ROUTINE_ITEMS: CareItem[] = [
  {
    id: "ped_adm_obs",
    label: "👶 Admissão Observação Infantil",
    text: "ADMISSÃO EM OBSERVAÇÃO PEDIÁTRICA:\n- Criança admitida na ala de observação pediátrica acompanhada pelo responsável [NOME].\n- Ativa, reativa, corada, hidratada, chorosa ao manuseio, porém de fácil consolo.\n- Puncionado AVP com cateter 24G. Orientado familiar sobre a segurança e permanência de grades elevadas.\n",
    toastMsg: "Admissão Obs Infantil",
  },
  {
    id: "ped_adm_emergencia",
    label: "🚨 Admissão Sala Vermelha Pediátrica",
    text: "ADMISSÃO EM SALA VERMELHA PEDIÁTRICA:\n- Paciente pediátrico grave admitido na Sala Vermelha sob suporte do SAMU/Resgate.\n- Apresentando [rebaixamento de consciência / crise convulsiva ativa / insuficiência respiratória grave].\n- Instalada monitorização multiparamétrica e suporte de O2 de alto fluxo. Equipe médica e de enfermagem em atendimento de emergência.\n",
    toastMsg: "Admissão Emergência Pediátrica",
  },
  {
    id: "ped_passagem_plantao",
    label: "📋 Passagem de Plantão Pediátrico",
    text: "PASSAGEM DE PLANTÃO PEDIÁTRICO:\n- Recebo o plantão com paciente pediátrico no leito/berço acompanhado pelo responsável. Calmo, dormindo/brincando.\n- AVP pérvio, sem infiltrações ou sinais inflamatórios. Dieta e hidratação com boa aceitação. Segue sob observação.\n",
    toastMsg: "Plantão Pediátrico",
  },
];

export const MEDICAL_PHYSICAL_NEURO_ITEMS: CareItem[] = [
  {
    id: "ef_normal",
    label: "✅ EF Padrão Normal",
    text: "EXAME FÍSICO:\n- BEG, LOTE, acianótico, anictérico, afebril.\n- ACV: RCR em 2T, bulhas normofonéticas, sem sopros.\n- AR: Murmúrio vesicular universalmente audível, sem ruídos adventícios.\n- ABD: Flácido, indolor à palpação, RHA presentes.\n- EXT: Sem edemas, panturrilhas livres.\n",
    toastMsg: "Exame Físico Padrão",
  },
  {
    id: "neuro_gcs15",
    label: "🧠 Neuro / Glasgow 15",
    text: "AVALIAÇÃO NEUROLÓGICA:\n- Lúcido e orientado no tempo e espaço (Glasgow 15).\n- Pupilas isocóricas e fotorreagentes.\n- Força motora grau V globalmente preservada.\n- Sem déficits focais aparentes. Sinais meníngeos ausentes.\n",
    toastMsg: "Neuro/Glasgow",
  },
];

export const MEDICAL_SYNDROME_ITEMS: CareItem[] = [
  {
    id: "dor_toracica",
    label: "🫀 Dor Torácica / IAM",
    text: "SÍNDROME CORONARIANA / DOR TORÁCICA:\n- Paciente refere dor precordial [TÍPICA/ATÍPICA], intensidade [ ]/10.\n- ECG de entrada: [SEM SUPRA / COM SUPRA] de segmento ST.\n- Conduta: Protocolo de Dor Torácica. Solicitado marcadores de necrose miocárdica (Troponina). Manter em observação contínua.\n",
    toastMsg: "Protocolo Dor Torácica",
  },
  {
    id: "crise_hipertensiva",
    label: "🩸 Crise Hipertensiva",
    text: "CRISE HIPERTENSIVA:\n- Paciente assintomático, apresentando PA elevada isolada (PA: [ ] mmHg).\n- Nega cefaleia, escotomas, dor torácica ou dispneia.\n- Conduta: Repouso em ambiente calmo. Administrado medicação [ANALGÉSICO/ANSIOLÍTICO/CAPTOPRIL]. Aguardar reavaliação em 1 hora.\n",
    toastMsg: "Crise Hipertensiva",
  },
  {
    id: "dengue_virose",
    label: "🦟 Dengue / Virose",
    text: "SÍNDROME INFECCIOSA / DENGUE:\n- Quadro de mialgia, cefaleia retro-orbital e febre há [ ] dias.\n- Prova do laço: [NEGATIVA / POSITIVA]. Sem sinais de alarme no momento.\n- Conduta: Solicitado Hemograma + Sorologia. Iniciar hidratação venosa/oral e sintomáticos. Notificação compulsória.\n",
    toastMsg: "Síndrome Gripal/Dengue",
  },
];

export const MEDICAL_CONDUCT_ITEMS: CareItem[] = [
  {
    id: "solicitar_labs",
    label: "🧪 Solicitar Labs",
    text: "CONDUTA / EXAMES:\n- Solicitado Laboratório (Hemograma, PCR, Ureia, Creatinina, Na, K, Urina I).",
    toastMsg: "Labs",
  },
  {
    id: "solicitar_rx",
    label: "🩻 Solicitar Raio-X",
    text: "CONDUTA / IMAGEM:\n- Solicitado Raio-X de [TÓRAX / ABDÔMEN / MEMBRO]. Aguardo laudo/imagem.",
    toastMsg: "Raio-X",
  },
  {
    id: "solicitar_ecg",
    label: "📈 Solicitar ECG",
    text: "CONDUTA / ECG:\n- Realizado ECG de 12 derivações. Aguardo avaliação do traçado.",
    toastMsg: "ECG",
  },
  {
    id: "kit_iam",
    label: "⚡ Kit IAM (Fast-Track)",
    text: "CONDUTA PROTOCOLO IAM:\n- Inserido no protocolo de dor torácica/SCA.\n- Prescrito AAS 300mg VO mastigado, Clopidogrel 300mg VO, Isordil 5mg SL, Morfina (se dor refratária) e Enoxaparina.\n- Solicitado curva de Troponina e ECG seriado.",
    toastMsg: "Kit IAM inserido",
  },
  {
    id: "kit_sepse",
    label: "⚡ Kit Sepse (Protocolo)",
    text: "CONDUTA PROTOCOLO SEPSE:\n- Inserido no protocolo de Sepse.\n- Prescrito expansão volêmica imediata (30ml/kg com SF 0,9% ou Ringer).\n- Solicitado Lactato, Gasometria e Hemoculturas (2 amostras).\n- Antibioticoterapia empírica de amplo espectro a ser iniciada na primeira hora.",
    toastMsg: "Kit Sepse inserido",
  },
  {
    id: "kit_asma",
    label: "⚡ Kit Crise Asmática",
    text: "CONDUTA CRISE RESPIRATÓRIA:\n- Prescrito Hidrocortisona EV ou Prednisona VO.\n- NBZ de resgate com Fenoterol + Ipratrópio (3 ciclos).\n- Reavaliação clínica programada após 1 hora.",
    toastMsg: "Kit Asma inserido",
  },
  {
    id: "kit_colica",
    label: "⚡ Kit Cólica Nefrética",
    text: "CONDUTA CÓLICA NEFRÉTICA:\n- Prescrito Analgesia Otimizada (Dipirona 1g + Cetoprofeno 100mg EV).\n- Prescrito Antiemético/Antiespasmódico (Ondansetrona/Buscopan).\n- Hidratação venosa criteriosa.",
    toastMsg: "Kit Cólica inserido",
  },
  {
    id: "check_iot",
    label: "🩺 Checklist IOT (Vias Aéreas)",
    text: "CHECKLIST DE PROCEDIMENTO (IOT):\n- Procedimento: Intubação Orotraqueal via Laringoscopia Direta.\n- Indicação: [Insuficiência Respiratória / Rebaixamento de Nível de Consciência].\n- Medicações (SRI): Fentanil [ ] mcg, Etomidato [ ] mg, Succinilcolina [ ] mg.\n- Tamanho do Tubo: [ ] (Cuff insuflado).\n- Ausculta: Simétrica e bilateral. Tubo fixado e acoplado ao ventilador.",
    toastMsg: "Checklist IOT",
  },
  {
    id: "check_acesso_central",
    label: "🩺 Checklist Acesso Venoso Central",
    text: "CHECKLIST DE PROCEDIMENTO (CVC):\n- Procedimento: Acesso Venoso Central em [Veia Jugular Interna / Subclávia / Femoral] à [Direita / Esquerda].\n- Indicação: [Drogas Vasoativas / Falta de acesso periférico / Hemodiálise].\n- Técnica: Asséptica, guiada por USG [Sim / Não].\n- Número de punções: [ ]. Sem intercorrências agudas evidentes. Solicitado RX de controle.",
    toastMsg: "Checklist Acesso Central",
  },
  {
    id: "check_pcr",
    label: "🩺 Checklist Reanimação (PCR)",
    text: "CHECKLIST DE REANIMAÇÃO (PCR):\n- Início das manobras: [Hora].\n- Ritmo inicial: [Assistolia / AESP / FV / TVSP].\n- Medicações: Adrenalina [ ] ampolas, Amiodarona [ ] ampolas.\n- Desfibrilação: [ ] choques realizados.\n- Tempo total de RCP: [ ] minutos. Retorno da Circulação Espontânea (RCE): [Sim / Não].",
    toastMsg: "Checklist PCR",
  },
  {
    id: "doc_cross",
    label: "📄 Solicitação Vaga CROSS",
    text: "SOLICITAÇÃO DE VAGA / TRANSFERÊNCIA (CROSS):\n- Paciente necessita de transferência emergencial para unidade de maior complexidade para [Avaliação Especializada / Vaga UTI].\n- Caso cadastrado na central de regulação do estado.\n- Relatório de transferência preenchido e assinado.",
    toastMsg: "Doc CROSS",
  },
  {
    id: "doc_recusa",
    label: "📄 Termo de Recusa / Alta a Pedido",
    text: "TERMO DE RECUSA DE TRATAMENTO / ALTA A PEDIDO:\n- O(A) paciente e/ou responsável manifestou desejo de recusar as condutas propostas ou solicitou alta à revelia.\n- Foram amplamente explicados os riscos inerentes a essa decisão, incluindo o risco de complicações e óbito.\n- Paciente/Responsável ciente, assume os riscos e assina o respectivo Termo de Responsabilidade.",
    toastMsg: "Doc Recusa",
  },
  {
    id: "doc_atestado",
    label: "📄 Atestado Médico Padrão",
    text: "ATESTADO MÉDICO:\n- Atesto para os devidos fins que o paciente foi atendido nesta unidade no dia de hoje, necessitando de [ ] dias de afastamento de suas atividades laborais por motivo de doença. (CID em anexo ou impresso na via do paciente).",
    toastMsg: "Doc Atestado",
  },
  {
    id: "solicitar_leito",
    label: "🛌 Solicitar Leito / Internação",
    text: "SOLICITAÇÃO DE INTERNAÇÃO / LEITO:\n- Paciente com indicação de internação hospitalar devido ao quadro clínico.\n- Solicitado leito via NIR (Núcleo Interno de Regulação).\n- Conduta: Manter estabilização clínica na UPA até transferência.",
    toastMsg: "Solicitação de Leito",
  },
  {
    id: "solicitar_sala_obs",
    label: "🛏️ Solicitar Sala de Observação",
    text: "SOLICITAÇÃO DE OBSERVAÇÃO CLÍNICA:\n- Paciente necessita de reavaliação seriada e administração de medicações parenterais.\n- Solicitado alocação em Sala de Observação por até 24h.\n- Conduta: Reavaliar após término da medicação ou exames.",
    toastMsg: "Sala de Observação",
  },
  {
    id: "parecer_especialista",
    label: "👨‍⚕️ Parecer Especializado",
    text: "SOLICITAÇÃO DE PARECER ESPECIALIZADO:\n- Solicitado parecer da equipe de [CIRURGIA / ORTOPEDIA / NEUROLOGIA / PSIQUIATRIA] para avaliação conjunta.\n- Justificativa: [Escrever justificativa do parecer].\n- Aguardando especialista no local.",
    toastMsg: "Parecer Solicitado",
  },
  {
    id: "vaga_zero",
    label: "🚨 Solicitar Vaga ZERO (SAMU)",
    text: "SOLICITAÇÃO DE VAGA ZERO (RISCO DE MORTE):\n- Paciente em estado grave, instável, com risco iminente de morte.\n- Acionado SAMU / Central de Regulação (CROSS) com solicitação de VAGA ZERO para hospital de referência (Alta Complexidade).\n- Mantido suporte avançado de vida na Sala Vermelha.",
    toastMsg: "Vaga ZERO Solicitada",
  },
  {
    id: "uti_movel",
    label: "🚑 Solicitar UTI Móvel",
    text: "SOLICITAÇÃO DE TRANSPORTE UTI MÓVEL:\n- Paciente com indicação de transferência, necessitando de suporte avançado de vida durante o trajeto.\n- Solicitada ambulância tipo UTI Móvel (USA) com equipe médica.\n- Conduta: Mantido monitorizado e estável até a chegada do transporte.",
    toastMsg: "UTI Móvel Solicitada",
  },
  {
    id: "isolamento",
    label: "☣️ Prescrição de Isolamento",
    text: "PRESCRIÇÃO DE ISOLAMENTO:\n- Indicado isolamento de [Contato / Respiratório (Gotículas/Aerossóis)].\n- Justificativa: Suspeita/Confirmação de doença infectocontagiosa [especificar doença].\n- Orientada a equipe quanto ao uso de EPIs adequados (Avental, Luvas, Máscara N95/Cirúrgica).",
    toastMsg: "Isolamento Prescrito",
  },
  {
    id: "encaminhamento_ubs",
    label: "🏥 Encaminhamento UBS",
    text: "ENCAMINHAMENTO ATENÇÃO BÁSICA (DESOSPITALIZAÇÃO):\n- Paciente com quadro clínico resolvido/estabilizado no pronto atendimento.\n- Encaminhado para acompanhamento ambulatorial na UBS de referência (Atenção Básica).\n- Orientações de sinais de alarme e receitas de uso contínuo entregues.",
    toastMsg: "Encaminhado p/ UBS",
  },
  {
    id: "assistente_social",
    label: "🤝 Acionar Serviço Social",
    text: "ACIONAMENTO DO SERVIÇO SOCIAL:\n- Solicitado parecer e intervenção do Serviço Social.\n- Motivo: [Vulnerabilidade Social / Paciente desacompanhado / Situação de abandono / Suspeita de violência].\n- Aguardando avaliação do profissional assistente social plantonista.",
    toastMsg: "Serviço Social Acionado",
  },
];

export const PEDIATRIC_PHYSICAL_NEURO_ITEMS: CareItem[] = [
  {
    id: "ped_ef_normal",
    label: "✅ EF Padrão Normal",
    text: "EXAME FÍSICO (SEM GRAVIDADE):\n- Criança ativa, reativa, corada e hidratada. Sorridente e interagindo bem com o examinador.\n- Mãe/Responsável nega febre nas últimas 12h.\n- Sem esforço respiratório ou tiragens. Boa aceitação alimentar.\n",
    toastMsg: "Exame Normal",
  },
  {
    id: "ped_tce_leve",
    label: "🤕 Queda / TCE Leve",
    text: "TRAUMA INFANTIL / QUEDA:\n- História de queda da própria altura / cama. TCE leve.\n- Mãe nega vômitos, perda de consciência ou sonolência pós-trauma.\n- Ao exame: presença de hematoma/escoriação em [LOCAL]. Sem sinais de fratura aparente.\n",
    toastMsg: "Trauma Infantil",
  },
];

export const PEDIATRIC_SYNDROME_ITEMS: CareItem[] = [
  {
    id: "ped_desconforto",
    label: "🫁 Desconforto Respiratório",
    text: "PEDIATRIA (RESPIRATÓRIO):\n- Sinais de desconforto respiratório: [TIRAGEM SUBCOSTAL / GEMÊNCIA / BATIMENTO DE ASA DE NARIZ]. Taquipneica para a idade.\n- Ausculta com sibilos/roncos difusos e prolongamento de tempo expiratório. Saturação: [ ]%.\n",
    toastMsg: "Resumo Respiratório",
  },
  {
    id: "ped_febre",
    label: "🤒 Síndrome Febril",
    text: "PEDIATRIA (SÍNDROME FEBRIL):\n- Mãe relata febre aferida ([ ] ºC), associada a inapetência e prostração.\n- Ao exame: orofaringe hiperemiada, sem placas purulentas. Otoscopia sem abaulamentos ou hiperemia.\n- Pele sem exantemas patognomônicos. Sinais meníngeos ausentes.\n",
    toastMsg: "Resumo Febril",
  },
  {
    id: "ped_geca",
    label: "🤢 GECA / Desidratação",
    text: "PEDIATRIA (GASTROENTERITE):\n- História de vômitos incoercíveis e diarreia aquosa.\n- Ao exame: criança hipoativa, olhos encovados, mucosa oral seca, choro sem lágrimas, turgor cutâneo pastoso (sinais de desidratação).\n",
    toastMsg: "Resumo GECA",
  },
  {
    id: "ped_alergia",
    label: "🍓 Alergia / Urticária",
    text: "PEDIATRIA (ALERGIA / URTICÁRIA):\n- Apresenta lesões urticariformes pruriginosas difusas. \n- Mãe relata possível ingestão/contato com [ALIMENTO/INSETO/MEDICAMENTO]. \n- Sem edema de glote ou sinais de anafilaxia. Via aérea pérvia.\n",
    toastMsg: "Alergia",
  },
];

export const PEDIATRIC_CONDUCT_ITEMS: CareItem[] = [
  {
    id: "ped_sintomaticos",
    label: "💊 Sintomáticos / NBZ",
    text: "CONDUTA / MEDICAÇÃO:\n- Prescrito [ANTITÉRMICO / NBZ DE RESGATE / HIDRATAÇÃO (TRO)].\n- Aguardando medicação e reavaliação clínica na unidade.",
    toastMsg: "Conduta",
  },
  {
    id: "ped_labs",
    label: "🧪 Solicitar Labs",
    text: "CONDUTA / EXAMES:\n- Solicitado Laboratório (Hemograma, PCR, Urina I).",
    toastMsg: "Labs",
  },
  {
    id: "ped_rx",
    label: "🩻 Solicitar Raio-X",
    text: "CONDUTA / IMAGEM:\n- Solicitado Raio-X de [TÓRAX / CRÂNIO / MEMBRO]. Aguardo filme.",
    toastMsg: "RX",
  },
  {
    id: "ped_solicitar_leito",
    label: "🛌 Solicitar Leito / Internação",
    text: "SOLICITAÇÃO DE INTERNAÇÃO PEDIÁTRICA:\n- Criança com indicação de internação hospitalar devido ao quadro clínico.\n- Solicitado leito via NIR (Núcleo Interno de Regulação).\n- Conduta: Manter estabilização clínica e monitorização na UPA até transferência.",
    toastMsg: "Leito Pediátrico",
  },
  {
    id: "ped_solicitar_sala_obs",
    label: "🛏️ Solicitar Observação",
    text: "SOLICITAÇÃO DE OBSERVAÇÃO PEDIÁTRICA:\n- Criança necessita de hidratação venosa / medicações e reavaliação em algumas horas.\n- Solicitado alocação em Sala de Observação Pediátrica.\n- Conduta: Reavaliar após término da terapia proposta.",
    toastMsg: "Obs. Pediátrica",
  },
  {
    id: "ped_parecer_especialista",
    label: "👨‍⚕️ Parecer Pediátrico Especializado",
    text: "SOLICITAÇÃO DE PARECER ESPECIALIZADO:\n- Solicitado parecer da equipe de [CIRURGIA PEDIÁTRICA / ORTOPEDIA / NEUROPEDIATRIA].\n- Justificativa: [Escrever justificativa do parecer].\n- Aguardando especialista.",
    toastMsg: "Parecer Solicitado",
  },
  {
    id: "ped_uti_movel",
    label: "🚑 Solicitar UTI Móvel Neonatal/Ped",
    text: "SOLICITAÇÃO DE TRANSPORTE UTI MÓVEL PEDIÁTRICA:\n- Criança com indicação de transferência, necessitando de suporte avançado de vida (UTI Pediátrica/Neonatal) no transporte.\n- Acionado SAMU/Regulação. Mantido suporte avançado e monitorização rigorosa.",
    toastMsg: "UTI Móvel Ped Solicitada",
  },
  {
    id: "ped_isolamento",
    label: "☣️ Isolamento Pediátrico",
    text: "PRESCRIÇÃO DE ISOLAMENTO PEDIÁTRICO:\n- Indicado isolamento de [Contato / Respiratório].\n- Justificativa: [Doença Exantemática / Infecção Respiratória].\n- Orientada a equipe e os familiares quanto ao uso restrito e EPIs apropriados.",
    toastMsg: "Isolamento Ped Prescrito",
  },
  {
    id: "ped_encaminhamento_ubs",
    label: "🏥 Encaminhamento Puericultura/UBS",
    text: "DESOSPITALIZAÇÃO / ATENÇÃO BÁSICA:\n- Quadro agudo estabilizado. Encaminhado para seguimento em puericultura / pediatria ambulatorial na UBS de referência.\n- Receitas e orientações de sinais de alarme entregues aos pais/responsáveis.",
    toastMsg: "Encaminhado p/ UBS",
  },
  {
    id: "ped_assistente_social",
    label: "🤝 Acionar Serviço Social / Conselho",
    text: "ACIONAMENTO DO SERVIÇO SOCIAL / CONSELHO TUTELAR:\n- Solicitada intervenção do Serviço Social e/ou Conselho Tutelar.\n- Motivo: [Suspeita de maus-tratos / Negligência / Vulnerabilidade extrema familiar].\n- Criança mantida em proteção na unidade até resolução do caso.",
    toastMsg: "Assistência Social Acionada",
  },
];

// FISIOTERAPIA
export const FISIO_ADULT_ITEMS: CareItem[] = [
  {
    id: "fisio_aval_resp",
    label: "🫁 Avaliação Respiratória",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA (RESPIRATÓRIA):\n- Padrão respiratório: [Eupneico / Taquipneico / Bradipneico / Dispneico]\n- Ausculta pulmonar: [Murmúrio vesicular presente e simétrico, sem RA]\n- Uso de musculatura acessória: [Sim/Não]\n- Saturação de O2: [ ]% em ar ambiente / suporte de O2.\n",
    toastMsg: "Avaliação Respiratória",
  },
  {
    id: "fisio_aval_motora",
    label: "🦵 Avaliação Motora",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA (MOTORA):\n- Força muscular (Grau 0-5): [ ]\n- Tônus Muscular: [Normotonia / Hipertonia / Hipotonia]\n- Amplitude de movimento (ADM): [Preservada / Reduzida]\n- Controle de tronco e cervical: [Preservado / Parcial / Ausente]\n",
    toastMsg: "Avaliação Motora",
  },
  {
    id: "fisio_aval_neuro",
    label: "🧠 Avaliação Neurológica",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA (NEUROLÓGICA):\n- Nível de consciência (Glasgow): [ ]\n- Pupilometria: [Isocóricas / Anisocóricas / Miose / Midríase]\n- Resposta motora a estímulos: [Preservada / Diminuída / Ausente]\n",
    toastMsg: "Avaliação Neurológica",
  },
  {
    id: "fisio_aval_dor",
    label: "😖 Avaliação da Dor",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA (DOR):\n- Escala Visual Analógica (EVA): [0-10]\n- Localização da dor: [ ]\n- Fatores de melhora/piora: [ ]\n",
    toastMsg: "Avaliação da Dor",
  },
  {
    id: "fisio_aval_funcional",
    label: "🚶 Avaliação Funcional",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA (FUNCIONAL):\n- Capacidade funcional prévia: [Independente / Parcialmente dependente / Acamado]\n- Risco de Quedas (Escala de Morse): [Baixo / Médio / Alto]\n- Mobilidade no leito: [Independente / Requer auxílio]\n",
    toastMsg: "Avaliação Funcional",
  },
  {
    id: "fisio_aval_sinais_vitais",
    label: "🫀 Sinais Vitais / Hemodinâmica",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA:\n- FC: [ ] bpm | PA: [ ] mmHg | SpO2: [ ]% | FR: [ ] irpm.\n- Estabilidade hemodinâmica para terapia: [Sim / Não].\n",
    toastMsg: "Sinais Vitais",
  },
  {
    id: "fisio_aval_tosse",
    label: "🗣️ Avaliação da Tosse e Secreção",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA (TOSSE):\n- Eficácia da tosse: [Eficaz / Ineficaz / Úmida / Seca / Ausente].\n- Aspecto da secreção: [Clara / Fluida / Espessa / Purulenta / Hemática].\n- Pico de Fluxo Expiratório (PFE): [ ] L/min.\n",
    toastMsg: "Avaliação da Tosse",
  },
  {
    id: "fisio_aval_vias",
    label: "👃 Avaliação de Vias Aéreas",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA:\n- Via aérea: [Pérvia / Sinais de obstrução / Tubo Orotraqueal / Traqueostomia].\n- Pressão de Cuff: [ ] cmH2O.\n",
    toastMsg: "Vias Aéreas",
  },
  {
    id: "fisio_aval_bronco",
    label: "⚠️ Risco de Broncoaspiração",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA:\n- Risco de broncoaspiração: [Alto / Baixo].\n- Presença de engasgos e tosse durante alimentação: [Sim / Não].\n",
    toastMsg: "Risco de Aspiração",
  },
  {
    id: "fisio_aval_marcha",
    label: "🚶 Capacidade de Marcha",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA:\n- Deambulação: [Independente / Com auxílio de dispositivo / Dependente de terceiros / Não realiza].\n- Padrão de marcha: [Preservado / Claudicante / Atáxico / Espástico].\n",
    toastMsg: "Capacidade de Marcha",
  },
  {
    id: "fisio_aval_forca",
    label: "💪 Força Muscular Periférica",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA (MRC):\n- Medical Research Council (MRC): [ ]/60.\n- Indicativo de fraqueza adquirida na UTI/internação: [Sim / Não].\n",
    toastMsg: "Força Periférica (MRC)",
  },
  {
    id: "fisio_aval_toracica",
    label: "🩻 Avaliação Torácica",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA:\n- Formato do tórax: [Atípico / Tonel / Pectus].\n- Expansibilidade: [Simétrica / Diminuída / Assimétrica].\n- Sinais de trauma/fratura costal: [Sim / Não].\n",
    toastMsg: "Avaliação Torácica",
  },
];

export const FISIO_ADULT_PROCEDURES: CareItem[] = [
  {
    id: "fisio_vni",
    label: "💨 VNI (CPAP/BIPAP)",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Instalado / Ajustado Ventilação Não Invasiva (VNI). \n- Interface: [Máscara Facial / Oronasal / Total Face]\n- Parâmetros: [IPAP: , EPAP: , FiO2: ]\n- Boa adaptação do paciente, melhora do desconforto e troca gasosa.\n",
    toastMsg: "VNI",
  },
  {
    id: "fisio_vmi",
    label: "🫁 Manejo VMI",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Ajuste/Manejo de Ventilação Mecânica Invasiva (VMI).\n- Modo Ventilatório: [PCV / VCV / PSV / SIMV]\n- Parâmetros: [Peep: , Pi: , FR: , FiO2: , Volume Corrente: ]\n- Curvas ventilatórias: [Sem escape, sincrônicas]\n",
    toastMsg: "Manejo VMI",
  },
  {
    id: "fisio_aspiracao",
    label: "💉 Aspiração Traqueal / VAS",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Realizada aspiração traqueal / de vias aéreas superiores.\n- Aspecto da secreção: [Fluida / Espessa / Purulenta / Sanguinolenta]\n- Quantidade: [Pequena / Moderada / Grande]\n- Melhora da ausculta após procedimento.\n",
    toastMsg: "Aspiração Traqueal",
  },
  {
    id: "fisio_ex_resp",
    label: "🌬️ Exercícios Respiratórios",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Realizado exercícios respiratórios (Padrões ventilatórios, frenolabial).\n- Melhora da expansibilidade torácica e ventilação basal.\n",
    toastMsg: "Exercícios Respiratórios",
  },
  {
    id: "fisio_higiene_bron",
    label: "🧹 Higiene Brônquica",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Manobras de higiene brônquica (Vibrocompressão, Tapotagem, ELTGOL).\n- Tosse assistida/estimulada. Eficaz para mobilização de secreções periféricas.\n",
    toastMsg: "Higiene Brônquica",
  },
  {
    id: "fisio_mob",
    label: "🚶 Mobilização Precoce",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Realizada mobilização precoce no leito (Passiva / Ativo-Assistida / Ativa).\n- Sinais vitais mantidos estáveis durante a terapia.\n",
    toastMsg: "Mobilização Precoce",
  },
  {
    id: "fisio_o2",
    label: "💧 Ajuste de O2",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Ajuste/Desmame de oxigenoterapia (Cateter Nasal, Máscara de Venturi, Máscara com Reservatório).\n- Saturação alvo atingida. Paciente mantendo SpO2 > [ ]%.\n",
    toastMsg: "Ajuste de O2",
  },
  {
    id: "fisio_cinesio",
    label: "💪 Cinesioterapia Motora",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Cinesioterapia motora global.\n- Exercícios isométricos e isotônicos para MMSS e MMII.\n- Prevenção de atrofia muscular e complicações do imobilismo.\n",
    toastMsg: "Cinesioterapia",
  },
  {
    id: "fisio_posicionamento",
    label: "🛏️ Posicionamento Terapêutico",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Orientação e realização de mudança de decúbito e posicionamento no leito.\n- Elevação de cabeceira (30-45º) para prevenção de PAV.\n",
    toastMsg: "Posicionamento",
  },
  {
    id: "fisio_extubacao",
    label: "🌬️ Suporte em Extubação",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Participação na extubação orotraqueal em conjunto com equipe médica.\n- Aplicação de VNI preventiva / O2 suplementar pós-extubação.\n- Avaliado risco de estridor laríngeo.\n",
    toastMsg: "Extubação",
  },
  {
    id: "fisio_marcha",
    label: "🚶‍♂️ Treino de Marcha",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Treino de marcha em corredor/quarto com auxílio de [Andador / Muletas / Apoio do terapeuta].\n- Monitoramento contínuo de sinais vitais.\n",
    toastMsg: "Treino de Marcha",
  },
  {
    id: "fisio_sedestacao",
    label: "🪑 Treino de Sedestação",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Posicionamento em sedestação à beira leito / poltrona.\n- Ganho de controle de tronco e desmame de leito.\n",
    toastMsg: "Treino de Sedestação",
  },
  {
    id: "fisio_expansao",
    label: "🎈 Terapia de Expansão Pulmonar",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Utilizados recursos de expansão pulmonar (EPAP, RPPI).\n- Aumento de volumes pulmonares e reversão de atelectasias.\n",
    toastMsg: "Expansão Pulmonar",
  },
  {
    id: "fisio_incentivador",
    label: "🌬️ Incentivador Respiratório",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Treino e orientação do uso de incentivador inspiratório a volume/fluxo (Voldyne, Respiron).\n- Paciente realizou [ ] séries com meta de [ ] ml/L.\n",
    toastMsg: "Incentivador Respiratório",
  },
];

export const FISIO_PED_ITEMS: CareItem[] = [
  {
    id: "fisio_ped_aval",
    label: "👶 Aval. Resp. Pediátrica",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA (PEDIÁTRICA):\n- Sinais de esforço respiratório: [Tiragens intercostais / subcostais / fúrcula / gemência / batimento asa de nariz]\n- Boletim de Silverman-Andersen (BSA): [ ]\n- Ausculta: [MV + com roncos / sibilos / crepitações]\n",
    toastMsg: "Aval. Pediátrica",
  },
  {
    id: "fisio_ped_motora",
    label: "🍼 Aval. Motora Pediátrica",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA (PEDIÁTRICA):\n- Avaliação de marcos do desenvolvimento motor.\n- Tônus e reflexos primitivos.\n- Posição preferencial no berço/colo.\n",
    toastMsg: "Aval. Motora Ped",
  },
  {
    id: "fisio_ped_tosse",
    label: "🗣️ Avaliação de Tosse (Ped)",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA (PEDIÁTRICA):\n- Capacidade e eficácia da tosse na criança: [Presente / Ausente / Fraca / Úmida].\n- Sinais de engasgo com saliva ou dieta.\n",
    toastMsg: "Tosse Pediátrica",
  },
  {
    id: "fisio_ped_sono",
    label: "😴 Padrão de Sono e Respiração",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA (PEDIÁTRICA):\n- Avaliação de apneias durante o sono, roncos e respiração bucal.\n- Saturação de O2 durante o sono: [ ]%.\n",
    toastMsg: "Sono e Respiração",
  },
  {
    id: "fisio_ped_vitais",
    label: "🫀 Sinais Vitais Pediátricos",
    text: "AVALIAÇÃO FISIOTERAPÊUTICA (PEDIÁTRICA):\n- FC e FR de acordo com a faixa etária: [Adequados / Taquicardia / Taquipneia].\n- Saturação alvo: [ ]%.\n",
    toastMsg: "Sinais Vitais Ped",
  },
];

export const FISIO_PED_PROCEDURES: CareItem[] = [
  {
    id: "fisio_ped_aspiracao",
    label: "🌬️ Aspiração de VAS Pediátrica",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Realizada aspiração de Vias Aéreas Superiores (VAS).\n- Retorno de secreção [ ] em quantidade [ ].\n- Melhora da permeabilidade das vias aéreas e padrão respiratório.\n",
    toastMsg: "Aspiração VAS",
  },
  {
    id: "fisio_ped_desobstrucao",
    label: "👃 Desobstrução Rinofaríngea",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Realizada desobstrução rinofaríngea / Lavagem Nasal com SF 0.9%.\n- Remoção de rolhas de secreção.\n- Criança mais calma, redução do esforço e aceitando melhor dieta.\n",
    toastMsg: "Desobstrução",
  },
  {
    id: "fisio_ped_ludico",
    label: "🎈 Terapia Respiratória Lúdica",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Terapia de higiene brônquica/expansão pulmonar utilizando recursos lúdicos (bolhas de sabão, língua de sogra, cata-vento).\n- Excelente engajamento da criança na terapia.\n",
    toastMsg: "Exercício Lúdico",
  },
  {
    id: "fisio_ped_cinesio",
    label: "🪀 Cinesioterapia Pediátrica",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Cinesioterapia motora global adaptada para idade.\n- Estimulação sensório-motora e orientações de posicionamento para familiares.\n",
    toastMsg: "Cinesio Pediátrica",
  },
  {
    id: "fisio_ped_cpap",
    label: "💨 CPAP Pediátrico / VNI",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Suporte ventilatório não invasivo pediátrico instalado/ajustado (CPAP / VNI / CNAF).\n- Interface de tamanho adequado.\n- Parâmetros: [ ]\n- Reversão de hipoxemia/hipercapnia.\n",
    toastMsg: "VNI Pediátrica",
  },
  {
    id: "fisio_ped_higiene",
    label: "🧹 Higiene Brônquica (Ped)",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Manobras desobstrutivas adaptadas à pediatria (Vibração manual, Aceleração de fluxo).\n- Tosse provocada se necessário.\n",
    toastMsg: "Higiene Brônquica Ped",
  },
  {
    id: "fisio_ped_o2",
    label: "💧 Oxigenoterapia Pediátrica",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Ajuste de O2 por [Cateter Nasal / Máscara de Venturi / Tenda / Hood].\n- Saturação mantida em níveis seguros.\n",
    toastMsg: "O2 Pediátrico",
  },
  {
    id: "fisio_ped_orienta",
    label: "👨‍👩‍👦 Orientações aos Pais",
    text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Orientação aos cuidadores sobre lavagem nasal domiciliar e posicionamento antirrefluxo/anti-aspiração.\n",
    toastMsg: "Orientações Pais",
  },
];

// NUTRIÇÃO
export const NUTRI_ADULT_ITEMS: CareItem[] = [
  {
    id: "nutri_aval_triagem",
    label: "📋 Triagem Nutricional",
    text: "AVALIAÇÃO NUTRICIONAL:\n- Triagem de Risco Nutricional (NRS-2002 / MUST): [Baixo / Moderado / Alto Risco].\n- Perda de peso recente: [Não / Sim, X kg em X meses].\n- Ingestão alimentar: [Normal / Reduzida].\n",
    toastMsg: "Triagem Nutricional",
  },
  {
    id: "nutri_aval_antro",
    label: "⚖️ Aval. Antropométrica",
    text: "AVALIAÇÃO NUTRICIONAL:\n- Peso: [ ] kg | Estatura estimada: [ ] cm | IMC: [ ] kg/m².\n- Classificação IMC: [Baixo peso / Eutrofia / Sobrepeso / Obesidade].\n- Circunferência da panturrilha/braço: [ ] cm.\n",
    toastMsg: "Antropometria",
  },
  {
    id: "nutri_aval_clinica",
    label: "🩺 Avaliação Clínica",
    text: "AVALIAÇÃO NUTRICIONAL:\n- Trato Gastrointestinal: [RHA presentes / Náuseas / Vômitos / Diarreia / Constipação].\n- Dentrição: [Preservada / Ausente / Uso de prótese].\n- Sinais de deficiência de micronutrientes: [Ausentes / Presentes: ].\n",
    toastMsg: "Avaliação Clínica",
  },
  {
    id: "nutri_aval_habitos",
    label: "🍏 Hábitos e Preferências",
    text: "AVALIAÇÃO NUTRICIONAL:\n- Recordatório alimentar: [ ]\n- Intolerâncias ou alergias alimentares: [Não / Sim: ]\n- Preferências ou aversões: [ ]\n",
    toastMsg: "Hábitos Alimentares",
  },
  {
    id: "nutri_aval_disfagia",
    label: "🗣️ Risco de Disfagia",
    text: "AVALIAÇÃO NUTRICIONAL:\n- Presença de tosse, engasgo ou dificuldade na deglutição durante alimentação.\n- Necessidade de avaliação conjunta com Fonoaudiologia: [Sim / Não].\n",
    toastMsg: "Risco de Disfagia",
  },
  {
    id: "nutri_aval_hidrata",
    label: "💧 Estado de Hidratação",
    text: "AVALIAÇÃO NUTRICIONAL:\n- Ingestão hídrica relatada: [ ] ml/dia.\n- Sinais clínicos de desidratação ou hipervolemia: [Edema / Mucosas secas / Turgor pele alterado].\n",
    toastMsg: "Hidratação",
  },
  {
    id: "nutri_aval_metabolico",
    label: "🩸 Perfil Glicêmico/Metabólico",
    text: "AVALIAÇÃO NUTRICIONAL:\n- Glicemia capilar média / Jejum: [ ] mg/dL.\n- Necessidade de controle de carboidratos ou restrições de macronutrientes: [Sim / Não].\n",
    toastMsg: "Perfil Metabólico",
  },
  {
    id: "nutri_aval_aceitacao",
    label: "🍽️ Aceitação da Dieta",
    text: "AVALIAÇÃO NUTRICIONAL:\n- Aceitação da dieta hospitalar: [Boa (>75%) / Regular (50-75%) / Ruim (<50%) / Recusa total].\n- Motivo da recusa: [Inapetência / Náuseas / Aversão ao cardápio].\n",
    toastMsg: "Aceitação Dieta",
  },
];

export const NUTRI_ADULT_PROCEDURES: CareItem[] = [
  {
    id: "nutri_dieta_oral",
    label: "🍽️ Prescrição Dieta Oral",
    text: "CONDUTA NUTRICIONAL:\n- Liberada / Progredida dieta ORAL.\n- Consistência: [Líquida / Pastosa / Branda / Geral].\n- Modificações: [Hipossódica / Diabética / Hipogordurosa / Laxativa].\n- Frequência: [ ] fracionamentos/dia.\n",
    toastMsg: "Dieta Oral",
  },
  {
    id: "nutri_sne",
    label: "💧 Terapia Nutricional Enteral (TNE)",
    text: "CONDUTA NUTRICIONAL:\n- Indicada Terapia Nutricional Enteral (Via SNE / SNG / Gastrostomia).\n- Fórmula: [Polimérica padrão / Especializada / Hiperproteica / Hipercalórica].\n- Volume: [ ] ml/dia | Vazão: [ ] ml/h.\n- Bomba de infusão: [Contínua / Intermitente / Gravitacional].\n",
    toastMsg: "Terapia Enteral",
  },
  {
    id: "nutri_suplemento",
    label: "🥤 Suplementação Oral",
    text: "CONDUTA NUTRICIONAL:\n- Prescrição de Suplemento Alimentar Oral (SAO).\n- Tipo: [Hiperproteico / Hipercalórico / Módulo de Proteína].\n- Posologia: [ ] vezes ao dia.\n",
    toastMsg: "Suplementação",
  },
  {
    id: "nutri_jejum",
    label: "⏳ Jejum / NPO",
    text: "CONDUTA NUTRICIONAL:\n- Paciente mantido em Jejum / Nada Por Via Oral (NPO) devido a: [Preparo de exame / Rebaixamento de nível de consciência / Risco de broncoaspiração / Quadro cirúrgico].\n",
    toastMsg: "Jejum/NPO",
  },
  {
    id: "nutri_npt",
    label: "🩸 Nutrição Parenteral (NPT)",
    text: "CONDUTA NUTRICIONAL:\n- Indicação/Acompanhamento de Nutrição Parenteral Total/Periférica (NPT/NPP).\n- Calorias diárias: [ ] kcal | Proteínas: [ ] g/dia.\n- Acompanhamento laboratorial e glicêmico.\n",
    toastMsg: "Nutrição Parenteral",
  },
  {
    id: "nutri_educacao",
    label: "🗣️ Orientação de Alta / Educação",
    text: "CONDUTA NUTRICIONAL:\n- Realizada educação nutricional junto ao paciente/familiar à beira leito.\n- Orientação de alta estruturada entregue.\n- Plano alimentar para seguimento ambulatorial/domiciliar.\n",
    toastMsg: "Orientação de Alta",
  },
  {
    id: "nutri_restricao",
    label: "🚫 Restrição Hídrica/Sódica",
    text: "CONDUTA NUTRICIONAL:\n- Prescrita restrição hídrica severa / moderada ([ ] ml/dia).\n- Orientação para redução drástica de sódio (ICC, DRC, Hepatopatias).\n",
    toastMsg: "Restrição Hídrica",
  },
  {
    id: "nutri_ajuste_consistencia",
    label: "🥣 Ajuste de Consistência",
    text: "CONDUTA NUTRICIONAL:\n- Adequada consistência da dieta (Ex: de livre para pastosa/purê) devido a perda de dentição / cansaço mastigatório / risco de engasgo.\n",
    toastMsg: "Ajuste de Consistência",
  },
  {
    id: "nutri_transicao_oral",
    label: "🔄 Transição TNE para VO",
    text: "CONDUTA NUTRICIONAL:\n- Iniciada transição da dieta por sonda (TNE) para via oral (VO).\n- TNE reduzida em [ ]% e iniciada aceitação fracionada por VO.\n",
    toastMsg: "Transição de Dieta",
  },
  {
    id: "nutri_diabetica",
    label: "📉 Terapia para Diabéticos",
    text: "CONDUTA NUTRICIONAL:\n- Prescrição de dieta padrão para DM (sem adição de sacarose, controle de CHO).\n- Oferta de ceia tardia para evitar hipoglicemia noturna.\n",
    toastMsg: "Dieta para DM",
  },
];

export const NUTRI_PED_ITEMS: CareItem[] = [
  {
    id: "nutri_ped_antro",
    label: "⚖️ Aval. Antropométrica Ped",
    text: "AVALIAÇÃO NUTRICIONAL (PEDIÁTRICA):\n- Peso atual: [ ] kg | Estatura/Comprimento: [ ] cm | Perímetro Cefálico: [ ] cm.\n- Peso de nascimento: [ ] kg.\n- Curvas OMS: Peso/Idade [ ] | Estatura/Idade [ ] | IMC/Idade [ ].\n- Diagnóstico Nutricional: [Eutrofia / Risco Nutricional / Desnutrição / Sobrepeso].\n",
    toastMsg: "Antropometria Pediátrica",
  },
  {
    id: "nutri_ped_amamentacao",
    label: "🤱 Avaliação do Aleitamento",
    text: "AVALIAÇÃO NUTRICIONAL (PEDIÁTRICA):\n- Aleitamento: [Materno Exclusivo / Misto / Artificial].\n- Frequência e duração das mamadas: [ ]\n- Dificuldades relatadas pela mãe: [Nenhuma / Pega Incorreta / Fissura / Baixa Produção].\n",
    toastMsg: "Aval. Aleitamento",
  },
  {
    id: "nutri_ped_habitos",
    label: "🥕 Hábitos e Introdução Alimentar",
    text: "AVALIAÇÃO NUTRICIONAL (PEDIÁTRICA):\n- Fase de introdução alimentar: [Adequada / Inadequada].\n- Consistência aceita: [ ]\n- Aversões / Seletividade alimentar: [ ]\n",
    toastMsg: "Hábitos Pediátricos",
  },
  {
    id: "nutri_ped_aceitacao",
    label: "🍽️ Aceitação da Dieta (Ped)",
    text: "AVALIAÇÃO NUTRICIONAL (PEDIÁTRICA):\n- Aceitação da dieta hospitalar: [Boa / Parcial / Recusa].\n- Preferência por líquidos/doces. Intolerância alimentar suspeitada.\n",
    toastMsg: "Aceitação Dieta Ped",
  },
  {
    id: "nutri_ped_intolerancia",
    label: "🚫 APLV / Intolerâncias",
    text: "AVALIAÇÃO NUTRICIONAL (PEDIÁTRICA):\n- Suspeita ou diagnóstico de Alergia à Proteína do Leite de Vaca (APLV) ou intolerância à lactose.\n- Necessidade de fórmula especializada.\n",
    toastMsg: "APLV / Intolerância",
  },
];

export const NUTRI_PED_PROCEDURES: CareItem[] = [
  {
    id: "nutri_ped_formula",
    label: "🍼 Ajuste de Fórmula Infantil",
    text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Prescrição / Ajuste de Fórmula Infantil [Partida / Seguimento / Especial].\n- Diluição recomendada: [1 medida para 30ml de água].\n- Volume ofertado: [ ]ml a cada [ ]h.\n",
    toastMsg: "Fórmula Infantil",
  },
  {
    id: "nutri_ped_aleitamento",
    label: "🤱 Incentivo ao Aleitamento",
    text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Orientação à mãe quanto à técnica de amamentação (pega, posicionamento).\n- Incentivo ao Aleitamento Materno Exclusivo (AME) até os 6 meses e complementar até 2 anos ou mais.\n- Ordenha e armazenamento de leite materno (se aplicável).\n",
    toastMsg: "Aleitamento Materno",
  },
  {
    id: "nutri_ped_dieta",
    label: "🥣 Dieta Branda / Pastosa Pediátrica",
    text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Liberação de dieta via oral adaptada para a idade (consistência pastosa/branda/livre).\n- Fracionamento e oferta hídrica adequados para a faixa etária.\n",
    toastMsg: "Dieta Pediátrica",
  },
  {
    id: "nutri_ped_educa",
    label: "🗣️ Educação Nutricional Pais",
    text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Orientação nutricional de alta para os pais/responsáveis.\n- Educação sobre introdução alimentar complementar segura (texturas, alimentos permitidos, prevenção de engasgo).\n- Orientações sobre restrição de açúcar e ultraprocessados.\n",
    toastMsg: "Educação aos Pais",
  },
  {
    id: "nutri_ped_tne",
    label: "💧 Terapia Enteral Pediátrica",
    text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Indicada passagem de sonda (SNG/SNE) para alimentação devido à recusa alimentar severa/baixo ganho de peso.\n- Fórmula pediátrica iniciada a [ ] ml/h.\n",
    toastMsg: "TNE Pediátrica",
  },
  {
    id: "nutri_ped_suplemento",
    label: "🥤 Suplementação Infantil",
    text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Introduzido suplemento oral pediátrico para recuperação do estado nutricional.\n- Volume: [ ] ml, [ ] vezes ao dia.\n",
    toastMsg: "Suplementação Pediátrica",
  },
  {
    id: "nutri_ped_sro",
    label: "💧 Hidratação Oral (SRO)",
    text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Prescrição de Terapia de Reidratação Oral (TRO) com soro de reidratação oral.\n- Orientações aos pais sobre hidratação em quadros de diarreia/vômitos.\n",
    toastMsg: "Hidratação Oral",
  },
];

// PSICOLOGIA
export const PSICO_ADULT_ITEMS: CareItem[] = [
  {
    id: "psico_acolhimento",
    label: "💬 Acolhimento e Escuta",
    text: "AVALIAÇÃO PSICOLÓGICA:\n- Realizado acolhimento e escuta qualificada à beira leito.\n- Motivo do atendimento: [Demanda espontânea / Solicitação médica / Solicitação da equipe].\n- Queixa principal emocional: [ ]\n",
    toastMsg: "Acolhimento",
  },
  {
    id: "psico_estado_mental",
    label: "🧠 Exame do Estado Mental",
    text: "AVALIAÇÃO PSICOLÓGICA:\n- Nível de Consciência: [Lúcido / Obnubilado].\n- Atenção e Memória: [Preservadas / Prejudicadas].\n- Orientação (Alopsíquica e Autopsíquica): [Orientado / Desorientado].\n- Pensamento (Curso e Conteúdo): [Lógico, coerente / Delirante, desagregado].\n- Afeto e Humor: [Eutímico / Deprimido / Ansioso / Lábil / Embotado].\n",
    toastMsg: "Estado Mental",
  },
  {
    id: "psico_reacoes",
    label: "🎭 Reações ao Adoecimento",
    text: "AVALIAÇÃO PSICOLÓGICA:\n- Percepção do paciente sobre o próprio diagnóstico e prognóstico: [Adequada / Negada / Distorcida].\n- Reações emocionais observadas: [Medo / Angústia / Agressividade / Resignação / Esperança].\n- Risco de auto/heteroagressão: [Ausente / Presente].\n",
    toastMsg: "Reações Adoecimento",
  },
  {
    id: "psico_ansiedade",
    label: "😰 Avaliação de Ansiedade",
    text: "AVALIAÇÃO PSICOLÓGICA:\n- Nível de ansiedade identificado: [Leve / Moderado / Grave / Pânico].\n- Sintomas somáticos associados: [Palpitações / Dispneia psicogênica / Tremores].\n",
    toastMsg: "Avaliação Ansiedade",
  },
  {
    id: "psico_suicidio",
    label: "⚠️ Risco Suicida / Autolesão",
    text: "AVALIAÇÃO PSICOLÓGICA:\n- Avaliação de ideação, planejamento ou tentativa de suicídio: [Ideação passiva / Planejamento estruturado / Tentativa recente].\n- Fatores de risco e proteção levantados.\n- Paciente em protocolo de vigilância contínua.\n",
    toastMsg: "Risco Suicida",
  },
  {
    id: "psico_dinamica",
    label: "👨‍👩‍👧 Dinâmica Familiar",
    text: "AVALIAÇÃO PSICOLÓGICA:\n- Compreensão da dinâmica e rede de suporte afetivo.\n- Presença de conflitos ou desgaste do cuidador principal.\n",
    toastMsg: "Dinâmica Familiar",
  },
  {
    id: "psico_historico",
    label: "📝 Histórico Psiquiátrico",
    text: "AVALIAÇÃO PSICOLÓGICA:\n- Antecedentes psiquiátricos: [Depressão / TAB / Esquizofrenia / T. Ansiedade].\n- Uso regular de psicofármacos: [ ]. Adesão ao tratamento: [Sim / Não].\n",
    toastMsg: "Histórico Psiquiátrico",
  },
  {
    id: "psico_compreensao",
    label: "🗣️ Capacidade de Decisão",
    text: "AVALIAÇÃO PSICOLÓGICA:\n- Avaliação da capacidade cognitiva e emocional para tomada de decisões sobre o próprio tratamento (Termos de consentimento/recusa).\n",
    toastMsg: "Capacidade Decisão",
  },
];

export const PSICO_ADULT_PROCEDURES: CareItem[] = [
  {
    id: "psico_crise",
    label: "😰 Intervenção em Crise",
    text: "CONDUTA PSICOLÓGICA:\n- Manejo e intervenção em crise (ansiedade aguda, pânico, agitação psicomotora).\n- Utilizadas técnicas de relaxamento, ancoragem (grounding) e respiração diafragmática.\n- Diminuição da sintomatologia emocional após intervenção.\n",
    toastMsg: "Intervenção Crise",
  },
  {
    id: "psico_luto",
    label: "🖤 Suporte em Luto / Terminalidade",
    text: "CONDUTA PSICOLÓGICA:\n- Acompanhamento da equipe médica na comunicação de más notícias (Spikes).\n- Suporte emocional aos familiares em processo de luto agudo / terminalidade.\n- Facilitação de despedidas e fechamento de ciclos.\n",
    toastMsg: "Suporte Luto",
  },
  {
    id: "psico_psicoeduca",
    label: "🧠 Psicoeducação",
    text: "CONDUTA PSICOLÓGICA:\n- Psicoeducação do paciente e familiares sobre o quadro clínico atual, procedimentos hospitalares e rotina da UPA.\n- Fomento à adesão ao tratamento e desmistificação de medos irreais.\n",
    toastMsg: "Psicoeducação",
  },
  {
    id: "psico_rede",
    label: "🤝 Articulação de Rede (RAPS)",
    text: "CONDUTA PSICOLÓGICA:\n- Articulação com a rede de atenção psicossocial (RAPS) para seguimento ambulatorial (CAPS, UBS).\n- Contato com familiares para fortalecimento da rede de apoio emocional.\n",
    toastMsg: "Articulação RAPS",
  },
  {
    id: "psico_familiar",
    label: "👨‍👩‍👧 Suporte Familiar",
    text: "CONDUTA PSICOLÓGICA:\n- Atendimento/mediação de conflitos familiares no contexto hospitalar.\n- Orientações à família sobre como manejar alterações comportamentais do paciente.\n",
    toastMsg: "Suporte Familiar",
  },
  {
    id: "psico_equipe",
    label: "🩺 Suporte à Equipe",
    text: "CONDUTA PSICOLÓGICA:\n- Discussão de caso com equipe multiprofissional.\n- Suporte emocional à equipe assistencial em situação de alto estresse e desgaste.\n",
    toastMsg: "Suporte Equipe",
  },
  {
    id: "psico_preparo",
    label: "💉 Preparo para Procedimentos Invasivos",
    text: "CONDUTA PSICOLÓGICA:\n- Acompanhamento e preparo psicológico antes de procedimentos invasivos (intubação consciente, drenagem, acessos difíceis).\n",
    toastMsg: "Preparo Procedimento",
  },
  {
    id: "psico_mediacao",
    label: "⚖️ Mediação de Conflitos",
    text: "CONDUTA PSICOLÓGICA:\n- Mediação de conflito de comunicação entre a equipe médica e os familiares do paciente, restabelecendo a confiança e clareza da informação.\n",
    toastMsg: "Mediação Conflitos",
  },
  {
    id: "psico_relaxamento",
    label: "🧘 Técnicas de Relaxamento",
    text: "CONDUTA PSICOLÓGICA:\n- Aplicação de técnicas de relaxamento muscular progressivo e visualização guiada para alívio de dor psicogênica/ansiedade.\n",
    toastMsg: "Relaxamento",
  },
  {
    id: "psico_alta",
    label: "🚪 Encaminhamento / Alta",
    text: "CONDUTA PSICOLÓGICA:\n- Entregue formulário de encaminhamento psicológico para rede básica / clínica escola para continuidade da psicoterapia.\n",
    toastMsg: "Alta/Encaminhamento",
  },
];

export const PSICO_PED_ITEMS: CareItem[] = [
  {
    id: "psico_ped_ludico",
    label: "🧸 Acolhimento Lúdico",
    text: "AVALIAÇÃO PSICOLÓGICA (PEDIÁTRICA):\n- Acolhimento da criança por meio de recursos lúdicos (brinquedo, desenho, estórias).\n- Criança demonstrou [medo / curiosidade / choro / esquiva / colaboração] durante o contato.\n",
    toastMsg: "Acolhimento Lúdico",
  },
  {
    id: "psico_ped_desenvolvimento",
    label: "🧩 Avaliação do Comportamento",
    text: "AVALIAÇÃO PSICOLÓGICA (PEDIÁTRICA):\n- Avaliação do comportamento da criança frente à hospitalização.\n- Sinais de regressão comportamental (ex: enurese, fala infantilizada): [Sim / Não].\n- Vinculação com o acompanhante principal: [Seguro / Ansioso / Evitante].\n",
    toastMsg: "Avaliação Comportamento",
  },
  {
    id: "psico_ped_medos",
    label: "👻 Medos e Fobias",
    text: "AVALIAÇÃO PSICOLÓGICA (PEDIÁTRICA):\n- Identificados medos exacerbados / fobia de agulhas e procedimentos de enfermagem.\n- Ansiedade antecipatória evidente.\n",
    toastMsg: "Avaliação de Medos",
  },
  {
    id: "psico_ped_compreensao",
    label: "💡 Nível de Compreensão",
    text: "AVALIAÇÃO PSICOLÓGICA (PEDIÁTRICA):\n- Criança compreende o motivo da internação de acordo com sua fase de desenvolvimento cognitivo.\n- Fantasias de punição ou culpa pela doença desmistificadas.\n",
    toastMsg: "Compreensão da Doença",
  },
  {
    id: "psico_ped_interacao",
    label: "👥 Interação com Equipe",
    text: "AVALIAÇÃO PSICOLÓGICA (PEDIÁTRICA):\n- Resposta da criança aos profissionais de saúde: [Colaborativa / Resistente / Apática / Hostil].\n",
    toastMsg: "Interação com Equipe",
  },
];

export const PSICO_PED_PROCEDURES: CareItem[] = [
  {
    id: "psico_ped_prep",
    label: "💉 Preparo para Procedimentos",
    text: "CONDUTA PSICOLÓGICA (PEDIÁTRICA):\n- Preparo psicológico para procedimento invasivo (punção venosa, curativos, exames) usando ludoterapia.\n- Dessensibilização e distração cognitiva durante o procedimento médico/enfermagem.\n- Criança tolerou bem, redução visível do estresse.\n",
    toastMsg: "Preparo Procedimento",
  },
  {
    id: "psico_ped_agita",
    label: "😭 Manejo de Agitação Infantil",
    text: "CONDUTA PSICOLÓGICA (PEDIÁTRICA):\n- Intervenção comportamental para manejo do choro intenso/agitação/birra na unidade.\n- Regulação emocional conjunta com o cuidador.\n",
    toastMsg: "Manejo Agitação",
  },
  {
    id: "psico_ped_pais",
    label: "👨‍👩‍👧 Suporte aos Pais",
    text: "CONDUTA PSICOLÓGICA (PEDIÁTRICA):\n- Escuta qualificada e suporte emocional aos pais/responsáveis frente ao adoecimento agudo do filho.\n- Redução do nível de ansiedade familiar, promovendo ambiente mais calmo para a criança.\n- Psicoeducação sobre não transmitir medo ou punir a criança no ambiente hospitalar.\n",
    toastMsg: "Suporte aos Pais",
  },
  {
    id: "psico_ped_brincar",
    label: "🪀 Terapia pelo Brincar",
    text: "CONDUTA PSICOLÓGICA (PEDIÁTRICA):\n- Utilização de técnicas de ludoterapia breve para auxiliar na elaboração simbólica do trauma hospitalar e expressão de sentimentos.\n",
    toastMsg: "Ludoterapia",
  },
  {
    id: "psico_ped_luto",
    label: "🖤 Luto Pediátrico",
    text: "CONDUTA PSICOLÓGICA (PEDIÁTRICA):\n- Acolhimento intensivo aos pais em situação de luto ou iminência de morte pediátrica.\n- Facilitação de despedidas, suporte para a criação de memórias e contato com a criança.\n",
    toastMsg: "Luto Pediátrico",
  },
  {
    id: "psico_ped_alta",
    label: "🏠 Orientações de Alta Psicológica",
    text: "CONDUTA PSICOLÓGICA (PEDIÁTRICA):\n- Orientações de alta para os cuidadores sobre como lidar com possíveis alterações de sono/comportamento nos dias seguintes à internação.\n",
    toastMsg: "Orientações de Alta",
  },
];

// SERVIÇO SOCIAL
export const SOCIAL_ADULT_ITEMS: CareItem[] = [
  {
    id: "social_entrevista",
    label: "📋 Entrevista Social",
    text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Realizada entrevista social com o paciente/familiar.\n- Condições de moradia: [Própria / Alugada / Cedida / Situação de Rua / Inadequada].\n- Situação previdenciária e de renda: [Ativo / Aposentado / BPC / Desempregado / Sem renda].\n",
    toastMsg: "Entrevista Social",
  },
  {
    id: "social_rede",
    label: "🤝 Avaliação de Rede de Apoio",
    text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Identificada rede de apoio familiar e comunitária: [Presente e protetiva / Frágil / Ausente / Conflituosa].\n- Cuidador principal identificado: [Nome, Grau de Parentesco].\n",
    toastMsg: "Rede de Apoio",
  },
  {
    id: "social_violencia",
    label: "⚠️ Suspeita de Violência / Negligência",
    text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Identificados possíveis sinais de [Violência física / Psicológica / Patrimonial / Negligência / Abandono].\n- Vítima: [Idoso / Mulher / Pessoa com deficiência].\n- Necessidade de medidas protetivas urgentes.\n",
    toastMsg: "Suspeita de Violência",
  },
  {
    id: "social_alta_complexa",
    label: "🏥 Risco Social para Alta",
    text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Identificados fatores de risco social que dificultam a alta médica segura.\n- Paciente sem condições domiciliares para continuidade do cuidado (ex: necessidade de O2, acamado sem cuidador).\n",
    toastMsg: "Risco para Alta",
  },
  {
    id: "social_drogadicao",
    label: "💊 Dependência Química",
    text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Histórico de dependência química (álcool e/ou outras drogas).\n- Situação atual de vulnerabilidade ligada ao uso. Necessidade de articulação com CAPS-AD.\n",
    toastMsg: "Dependência Química",
  },
  {
    id: "social_rua",
    label: "🛣️ Situação de Rua",
    text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Paciente em situação de rua identificada.\n- Acolhido no sistema e verificação de vínculos com abrigos/Centros Pop.\n",
    toastMsg: "Situação de Rua",
  },
  {
    id: "social_doc",
    label: "🪪 Avaliação de Documentação",
    text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Paciente internado sem identificação (Desconhecido) ou sem documentação civil básica.\n- Necessidade de averiguação papiloscópica/contato com serviço social externo.\n",
    toastMsg: "Falta de Documentação",
  },
];

export const SOCIAL_ADULT_PROCEDURES: CareItem[] = [
  {
    id: "social_busca",
    label: "🔍 Busca Ativa Familiar",
    text: "CONDUTA SERVIÇO SOCIAL:\n- Realizada busca ativa de familiares/contatos de emergência (via telefone ou sistema, contato com UBS).\n- Sucesso no contato: [Sim/Não]. Familiares informados da internação.\n",
    toastMsg: "Busca Ativa",
  },
  {
    id: "social_cras",
    label: "🏢 Articulação e Encaminhamentos",
    text: "CONDUTA SERVIÇO SOCIAL:\n- Realizado contato e encaminhamento do caso para a rede socioassistencial e de saúde (CRAS / CREAS / UBS / CAPS / SAD).\n- Agendamento de visita domiciliar ou retorno programado garantido.\n",
    toastMsg: "Encaminhamentos Rede",
  },
  {
    id: "social_direitos",
    label: "📜 Orientação de Direitos Sociais",
    text: "CONDUTA SERVIÇO SOCIAL:\n- Prestadas orientações ao paciente/família sobre garantia de direitos (BPC, Auxílio Doença, isenções, DPVAT).\n- Entregues formulários ou orientados os fluxos de acesso à previdência/assistência.\n",
    toastMsg: "Direitos Sociais",
  },
  {
    id: "social_notificacao",
    label: "📄 Notificação Compulsória (SINAN)",
    text: "CONDUTA SERVIÇO SOCIAL:\n- Acionados órgãos de proteção e garantia de direitos: [Delegacia do Idoso / Delegacia da Mulher / Ministério Público].\n- Preenchida ficha de notificação compulsória (SINAN) por suspeita/confirmação de violência.\n",
    toastMsg: "Notificação SINAN",
  },
  {
    id: "social_alta_segura",
    label: "🚑 Planejamento de Alta Segura",
    text: "CONDUTA SERVIÇO SOCIAL:\n- Planejamento de alta em conjunto com a equipe multiprofissional.\n- Acionado serviço de transporte (Ambulância / SAMU) devido à incapacidade de locomoção e falta de recursos da família.\n- Garantida a provisão de insumos mínimos (oxigênio, dieta) via secretaria de saúde.\n",
    toastMsg: "Alta Segura",
  },
  {
    id: "social_obito",
    label: "✝️ Orientações de Óbito e Funeral",
    text: "CONDUTA SERVIÇO SOCIAL:\n- Acolhimento da família pós-óbito.\n- Orientações sobre trâmites funerários, serviço de verificação de óbito (SVO) / IML e benefícios eventuais (auxílio funeral municipal).\n",
    toastMsg: "Orientações de Óbito",
  },
  {
    id: "social_abrigo",
    label: "🏠 Acionamento de Abrigo",
    text: "CONDUTA SERVIÇO SOCIAL:\n- Articulação de vaga em instituição de longa permanência (ILPI) ou abrigo municipal para paciente com alta médica mas sem suporte social.\n",
    toastMsg: "Vaga Social",
  },
  {
    id: "social_inss",
    label: "💼 Contato Empregador/INSS",
    text: "CONDUTA SERVIÇO SOCIAL:\n- Fornecida declaração de internação e orientações para entrada em benefício por incapacidade temporária (INSS) junto à empresa do paciente.\n",
    toastMsg: "Orientações INSS",
  },
];

export const SOCIAL_PED_ITEMS: CareItem[] = [
  {
    id: "social_ped_contexto",
    label: "👨‍👩‍👦 Contexto Familiar e Cuidados",
    text: "AVALIAÇÃO SERVIÇO SOCIAL (PEDIÁTRICA):\n- Entrevista com o responsável legal (Mãe/Pai/Tutor) para avaliação do contexto de proteção e cuidados da criança.\n- Condição de vacinação, acompanhamento escolar e de saúde (puericultura): [Adequados / Atrasados / Negligenciados].\n",
    toastMsg: "Contexto Familiar Ped",
  },
  {
    id: "social_ped_vulnera",
    label: "⚠️ Avaliação de Vulnerabilidade",
    text: "AVALIAÇÃO SERVIÇO SOCIAL (PEDIÁTRICA):\n- Sinais de vulnerabilidade social grave ou violação de direitos da criança/adolescente identificados.\n- Suspeita de violência [Física / Sexual / Psicológica / Negligência].\n",
    toastMsg: "Vulnerabilidade Ped",
  },
  {
    id: "social_ped_evasao",
    label: "🏃 Risco de Evasão/Fuga",
    text: "AVALIAÇÃO SERVIÇO SOCIAL (PEDIÁTRICA):\n- Responsável demonstrando impaciência, ameaçando evasão hospitalar ou retirada da criança contra orientação médica.\n- Intervenção imediata solicitada.\n",
    toastMsg: "Risco de Evasão",
  },
  {
    id: "social_ped_protetiva",
    label: "🛡️ Capacidade Protetiva",
    text: "AVALIAÇÃO SERVIÇO SOCIAL (PEDIÁTRICA):\n- Avaliação da capacidade dos pais em prover cuidados pós-alta e seguir o tratamento prescrito.\n- Risco de reincidência de internação por causas evitáveis.\n",
    toastMsg: "Capacidade Protetiva",
  },
];

export const SOCIAL_PED_PROCEDURES: CareItem[] = [
  {
    id: "social_ped_tutelar",
    label: "⚖️ Acionamento Conselho Tutelar",
    text: "CONDUTA SERVIÇO SOCIAL (PEDIÁTRICA):\n- Acionado Conselho Tutelar em caráter de urgência para acompanhamento do caso devido a risco iminente ou violação confirmada.\n- Relatório social enviado ao órgão. Conselheiro [Nome] compareceu à unidade.\n",
    toastMsg: "Conselho Tutelar",
  },
  {
    id: "social_ped_sinan",
    label: "📄 Notificação SINAN (ECA)",
    text: "CONDUTA SERVIÇO SOCIAL (PEDIÁTRICA):\n- Preenchida notificação compulsória (SINAN) de violência interpessoal/autoprovocada.\n- Garantida a aplicação das diretrizes do Estatuto da Criança e do Adolescente (ECA).\n",
    toastMsg: "Notificação SINAN",
  },
  {
    id: "social_ped_escola",
    label: "🎒 Articulação Escolar/Saúde",
    text: "CONDUTA SERVIÇO SOCIAL (PEDIÁTRICA):\n- Contato com a rede de ensino ou UBS de referência para comunicação do quadro clínico/internação prolongada ou acompanhamento de situação de vulnerabilidade.\n",
    toastMsg: "Articulação Escolar",
  },
  {
    id: "social_ped_orienta",
    label: "📜 Direitos da Criança Hospitalizada",
    text: "CONDUTA SERVIÇO SOCIAL (PEDIÁTRICA):\n- Orientação aos responsáveis sobre os direitos da criança hospitalizada (direito a acompanhante 24h, informação clara, ambiente adequado).\n- Orientações de acesso a benefícios sociais (ex: BPC para crianças com deficiência grave descoberta).\n",
    toastMsg: "Direitos da Criança",
  },
  {
    id: "social_ped_abrigo",
    label: "🏠 Articulação de Acolhimento",
    text: "CONDUTA SERVIÇO SOCIAL (PEDIÁTRICA):\n- Acionamento de serviço de acolhimento institucional infantil (abrigo) mediante determinação judicial/Conselho tutelar devido destituição familiar de urgência.\n",
    toastMsg: "Abrigo Infantil",
  },
];

// TERAPIA OCUPACIONAL
export const TO_ADULT_ITEMS: CareItem[] = [
  {
    id: "to_avds",
    label: "👕 Avaliação de AVDs / AIVDs",
    text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Avaliação de Atividades de Vida Diária (AVDs) e Instrumentais (AIVDs).\n- Nível de dependência prévio: [Independente / Parcial / Total].\n- Nível atual no leito: [Necessita assistência máxima / moderada / mínima].\n",
    toastMsg: "Avaliação AVDs",
  },
  {
    id: "to_cognitiva",
    label: "🧩 Avaliação Cognitiva-Funcional",
    text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Rastreio cognitivo (Atenção, Memória, Funções Executivas).\n- Presença de Delirium: [Não / Sim - hipoativo/hiperativo].\n- Compreensão de comandos: [Preservada / Alterada].\n",
    toastMsg: "Avaliação Cognitiva",
  },
  {
    id: "to_sensorial",
    label: "✋ Avaliação Sensório-Motora",
    text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Tônus e trofismo de Membros Superiores (MMSS).\n- Sensibilidade tátil, proprioceptiva e dolorosa em MMSS: [Preservada / Alterada].\n- Risco de deformidades articulares, retrações ou LPPs.\n",
    toastMsg: "Aval. Sensório-Motora",
  },
  {
    id: "to_ocupacional",
    label: "🎭 Histórico Ocupacional",
    text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Coleta do histórico ocupacional, rotina, interesses e papéis sociais do paciente para guiar o plano terapêutico.\n",
    toastMsg: "Histórico Ocupacional",
  },
  {
    id: "to_funcionalidade",
    label: "📊 Funcionalidade Global",
    text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Aplicação de escalas de funcionalidade (Barthel/Katz).\n- Pontuação indica grau de comprometimento e necessidade de adaptações.\n",
    toastMsg: "Funcionalidade Global",
  },
  {
    id: "to_visual",
    label: "👁️ Avaliação Visual/Perceptiva",
    text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Avaliação de déficits perceptivos, heminegligência ou alterações viso-espaciais (ex: pós-AVC).\n",
    toastMsg: "Aval. Visual/Perceptiva",
  },
  {
    id: "to_assistiva",
    label: "♿ Necessidade de Tec. Assistiva",
    text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Levantamento de necessidade de Tecnologia Assistiva (cadeira de rodas adequada, adaptações para alimentação/higiene).\n",
    toastMsg: "Tecnologia Assistiva",
  },
];

export const TO_ADULT_PROCEDURES: CareItem[] = [
  {
    id: "to_orteses",
    label: "✋ Prescrição/Confecção Órteses",
    text: "CONDUTA TERAPIA OCUPACIONAL:\n- Confeccionada ou ajustada órtese de posicionamento em termoplástico/gesso/espuma (ex: repouso palmar, anti-equino).\n- Objetivo: prevenção de deformidades contraturais e manutenção de amplitude de movimento.\n- Orientados paciente e equipe sobre uso e retirada.\n",
    toastMsg: "Órteses / Posicionamento",
  },
  {
    id: "to_delirium",
    label: "🧠 Manejo de Delirium / Cognição",
    text: "CONDUTA TERAPIA OCUPACIONAL:\n- Intervenção para manejo de delirium: reorganização ambiental, ciclo sono-vigília, redução de estímulos excessivos.\n- Estimulação/treino cognitivo e orientação para a realidade (tempo e espaço) à beira leito.\n",
    toastMsg: "Manejo Delirium",
  },
  {
    id: "to_treino_avds",
    label: "🥣 Treino de AVDs no Leito",
    text: "CONDUTA TERAPIA OCUPACIONAL:\n- Treino de Atividades de Vida Diária (AVDs) no leito: alimentação assistida, higiene de face/oral, vestuário.\n- Adaptação de utensílios (engrossadores de talher) para ganho de independência.\n",
    toastMsg: "Treino AVDs",
  },
  {
    id: "to_custom_mmss",
    label: "💪 Reabilitação de MMSS",
    text: "CONDUTA TERAPIA OCUPACIONAL:\n- Exercícios terapêuticos e estimulação sensório-motora direcionados para Membros Superiores (MMSS).\n- Treino de motricidade fina e preensão para readequação funcional.\n",
    toastMsg: "Reabilitação MMSS",
  },
  {
    id: "to_conserva",
    label: "🔋 Conservação de Energia",
    text: "CONDUTA TERAPIA OCUPACIONAL:\n- Orientações sobre técnicas de conservação de energia e simplificação do trabalho para pacientes com fadiga/dispneia.\n",
    toastMsg: "Conservação Energia",
  },
  {
    id: "to_alta",
    label: "🏠 Orientações de Alta / Domicílio",
    text: "CONDUTA TERAPIA OCUPACIONAL:\n- Orientações de alta visando segurança e acessibilidade domiciliar.\n- Prevenção de quedas no domicílio (retirada de tapetes, uso de barras de apoio, iluminação).\n",
    toastMsg: "Orientações de Alta TO",
  },
  {
    id: "to_coxins",
    label: "🛏️ Adequação Postural/Coxins",
    text: "CONDUTA TERAPIA OCUPACIONAL:\n- Prescrição e adaptação de coxins para alinhamento biomecânico no leito/poltrona e alívio de pressão proeminências ósseas.\n",
    toastMsg: "Coxins/Posicionamento",
  },
  {
    id: "to_estimula_sensorial",
    label: "🤲 Estimulação Sensorial",
    text: "CONDUTA TERAPIA OCUPACIONAL:\n- Protocolo de estimulação sensorial (tátil, proprioceptiva, olfativa) para pacientes com rebaixamento de nível de consciência ou lesão neurológica.\n",
    toastMsg: "Estimulação Sensorial",
  },
  {
    id: "to_rotina",
    label: "⏱️ Gerenciamento de Rotina",
    text: "CONDUTA TERAPIA OCUPACIONAL:\n- Estruturação de rotina hospitalar para o paciente, favorecendo engajamento em atividades significativas e diminuindo ociosidade.\n",
    toastMsg: "Gerenciamento Rotina",
  },
];

export const TO_PED_ITEMS: CareItem[] = [
  {
    id: "to_ped_neuro",
    label: "👶 Avaliação Neuropsicomotora",
    text: "AVALIAÇÃO TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Avaliação do Desenvolvimento Neuropsicomotor (DNPM): [Adequado / Atraso global / Atraso motor/cognitivo].\n- Habilidades manuais e coordenação global: [Adequadas para idade / Deficitárias].\n",
    toastMsg: "Aval. DNPM TO",
  },
  {
    id: "to_ped_brincar",
    label: "🪀 Avaliação do Brincar",
    text: "AVALIAÇÃO TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Qualidade e engajamento na atividade lúdica: [Brincar funcional / simbólico / restrito / ausente].\n- Impacto da hospitalização e de dispositivos médicos (acessos, sondas) na exploração do ambiente.\n",
    toastMsg: "Aval. do Brincar",
  },
  {
    id: "to_ped_sensorial",
    label: "🌈 Perfil Sensorial",
    text: "AVALIAÇÃO TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Observação de respostas sensoriais atípicas no ambiente hospitalar (hiper/hiporresponsividade a ruídos, luzes, toques, texturas alimentares).\n",
    toastMsg: "Perfil Sensorial",
  },
  {
    id: "to_ped_atraso",
    label: "⚠️ Risco de Atraso (DNPM)",
    text: "AVALIAÇÃO TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Identificados fatores de risco para atraso no desenvolvimento devido a internação prolongada ou patologia de base.\n",
    toastMsg: "Risco Atraso DNPM",
  },
  {
    id: "to_ped_tea",
    label: "🧩 Sinais de TEA/TDAH",
    text: "AVALIAÇÃO TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Observados comportamentos sugestivos de atipias no neurodesenvolvimento (estereotipias, desregulação sensorial grave, hiperfoco).\n",
    toastMsg: "Atipias Neurodesenv.",
  },
];

export const TO_PED_PROCEDURES: CareItem[] = [
  {
    id: "to_ped_estimula",
    label: "🪀 Estimulação Sensório-Motora",
    text: "CONDUTA TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Realizada intervenção através do brincar terapêutico para estimulação sensório-motora e cognitiva.\n- Promoção de vivências positivas para amenizar o trauma da hospitalização.\n",
    toastMsg: "Estimulação Lúdica",
  },
  {
    id: "to_ped_adaptacao",
    label: "🧸 Adaptação Ambiental / Brinquedos",
    text: "CONDUTA TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Adaptação de brinquedos e recursos para favorecer a interação da criança limitada ao leito ou por dispositivos médicos.\n- Modificação sensorial do ambiente (redução de luz/som) para regulação da criança agitação/espectro autista.\n",
    toastMsg: "Adaptação de Brinquedos",
  },
  {
    id: "to_ped_orteses",
    label: "✋ Posicionamento Pediátrico",
    text: "CONDUTA TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Confecção de órteses ou confecção de coxins para alinhamento biomecânico e prevenção de assimetrias/deformidades cranianas/motoras.\n",
    toastMsg: "Posicionamento Ped",
  },
  {
    id: "to_ped_pais",
    label: "👨‍👩‍👦 Orientações a Pais e Cuidador",
    text: "CONDUTA TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Orientação aos responsáveis sobre formas de estimular o desenvolvimento da criança durante a internação e pós-alta.\n- Prescrição de atividades lúdicas seguras e adequadas ao quadro clínico.\n",
    toastMsg: "Orientação TO Pais",
  },
  {
    id: "to_ped_avds",
    label: "👕 Treino de AVDs Infantis",
    text: "CONDUTA TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Treino de independência para AVDs adaptadas à idade (ex: segurar a mamadeira, comer com colher, vestir a blusa) apesar do contexto hospitalar.\n",
    toastMsg: "Treino AVDs Infantil",
  },
  {
    id: "to_ped_acalento",
    label: "🌙 Manejo Sensorial (Acalento)",
    text: "CONDUTA TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Aplicação de técnicas de integração sensorial e organização proprioceptiva (enrolamento, acalento profundo) para bebês/crianças irritadiças.\n",
    toastMsg: "Manejo Sensorial",
  },
];

// FONOAUDIOLOGIA
export const FONO_ADULT_ITEMS: CareItem[] = [
  {
    id: "fono_disfagia",
    label: "🗣️ Avaliação de Disfagia",
    text: "AVALIAÇÃO FONOAUDIOLÓGICA:\n- Realizada avaliação clínica da deglutição à beira leito.\n- Observados sinais clínicos de broncoaspiração (tosse, engasgo, alteração vocal): [Ausentes / Presentes].\n- Classificação: [Deglutição Segura / Disfagia Leve / Moderada / Grave].\n",
    toastMsg: "Aval. Disfagia",
  },
  {
    id: "fono_blue_dye",
    label: "🔵 Teste do Corante Azul",
    text: "AVALIAÇÃO FONOAUDIOLÓGICA:\n- Realizado Teste do Corante Azul (Blue Dye Test) em paciente traqueostomizado.\n- Resultado: [Negativo / Positivo para aspiração traqueal].\n",
    toastMsg: "Teste Corante Azul",
  },
  {
    id: "fono_voz",
    label: "🎙️ Avaliação de Voz e Fala",
    text: "AVALIAÇÃO FONOAUDIOLÓGICA:\n- Paciente extubado recentemente. Avaliada qualidade vocal.\n- Presença de disfonia, soprosidade ou fadiga ao falar: [Sim / Não].\n",
    toastMsg: "Aval. Voz e Fala",
  },
  {
    id: "fono_cognitivo",
    label: "🧠 Rastreio Cognitivo-Linguístico",
    text: "AVALIAÇÃO FONOAUDIOLÓGICA:\n- Rastreio de linguagem e compreensão.\n- Sinais de afasia ou disartria (pós-AVC/Trauma): [Ausente / Presente].\n",
    toastMsg: "Rastreio Linguagem",
  },
];

export const FONO_ADULT_PROCEDURES: CareItem[] = [
  {
    id: "fono_consistencia",
    label: "🥣 Ajuste de Consistência",
    text: "CONDUTA FONOAUDIOLÓGICA:\n- Definida consistência alimentar segura.\n- Líquidos: [Livre / Néctar / Mel / Pudim].\n- Sólidos: [Branda / Pastosa / Purê / Liquidificada].\n",
    toastMsg: "Ajuste Consistência",
  },
  {
    id: "fono_desmame_tne",
    label: "🔄 Desmame de TNE (Sonda)",
    text: "CONDUTA FONOAUDIOLÓGICA:\n- Iniciado desmame de via alternativa de alimentação (SNE/SNG).\n- Liberada via oral (VO) assistida e fracionada, com resposta positiva do paciente.\n",
    toastMsg: "Desmame Sonda",
  },
  {
    id: "fono_exercicios",
    label: "👅 Treino de Deglutição",
    text: "CONDUTA FONOAUDIOLÓGICA:\n- Realizados exercícios orofaciais isotônicos e isométricos.\n- Manobras protetivas de deglutição (ex: queixo no peito, deglutição com esforço).\n",
    toastMsg: "Treino Deglutição",
  },
  {
    id: "fono_traqueo",
    label: "🌬️ Manejo de Traqueostomia",
    text: "CONDUTA FONOAUDIOLÓGICA:\n- Treino de oclusão digital / adaptação de Válvula de Fala.\n- Preparo fonoterapêutico para decanulação em conjunto com fisioterapia e equipe médica.\n",
    toastMsg: "Manejo Traqueo",
  },
  {
    id: "fono_orientacao",
    label: "📋 Orientações de Alta",
    text: "CONDUTA FONOAUDIOLÓGICA:\n- Orientações de alta repassadas ao familiar/cuidador quanto à oferta de dieta, postura na alimentação e uso de espessante.\n",
    toastMsg: "Orientações Fono",
  },
];

export const FONO_PED_ITEMS: CareItem[] = [
  {
    id: "fono_ped_succao",
    label: "🍼 Aval. Sucção Nutritiva",
    text: "AVALIAÇÃO FONOAUDIOLÓGICA (PEDIÁTRICA):\n- Avaliação do reflexo de busca, sucção e deglutição do lactente.\n- Coordenação sucção-respiração-deglutição: [Adequada / Incoordenada].\n",
    toastMsg: "Aval. Sucção",
  },
  {
    id: "fono_ped_freio",
    label: "👅 Teste da Linguinha",
    text: "AVALIAÇÃO FONOAUDIOLÓGICA (PEDIÁTRICA):\n- Avaliação do frênulo lingual.\n- Indicativo de anquiloglossia dificultando a amamentação: [Sim / Não].\n",
    toastMsg: "Teste Linguinha",
  },
  {
    id: "fono_ped_disfagia",
    label: "🥣 Aval. Deglutição Infantil",
    text: "AVALIAÇÃO FONOAUDIOLÓGICA (PEDIÁTRICA):\n- Avaliação de deglutição na criança.\n- Sinais de engasgo, tosse ou recusa persistente a texturas.\n",
    toastMsg: "Aval. Deglutição Ped",
  },
];

export const FONO_PED_PROCEDURES: CareItem[] = [
  {
    id: "fono_ped_pega",
    label: "🤱 Adequação de Pega",
    text: "CONDUTA FONOAUDIOLÓGICA (PEDIÁTRICA):\n- Intervenção na pega e postura durante o aleitamento materno.\n- Redução de fissuras mamárias e melhor extração de leite pela criança.\n",
    toastMsg: "Adequação de Pega",
  },
  {
    id: "fono_ped_estimulo",
    label: "👶 Estimulação Sensório-Motora",
    text: "CONDUTA FONOAUDIOLÓGICA (PEDIÁTRICA):\n- Estimulação da Sucção Não Nutritiva (SNN) com dedo enluvado/chupeta (se consentido).\n- Exercícios orofaciais para fortalecimento da musculatura perioral.\n",
    toastMsg: "Estimulação SNN",
  },
  {
    id: "fono_ped_transicao",
    label: "🔄 Transição Sonda-Peito",
    text: "CONDUTA FONOAUDIOLÓGICA (PEDIÁTRICA):\n- Início do treino de transição da sonda enteral para a via oral (peito ou mamadeira/copinho).\n",
    toastMsg: "Transição Sonda/VO",
  },
];

// FARMÁCIA CLÍNICA
export const FARMA_ADULT_ITEMS: CareItem[] = [
  {
    id: "farma_reconciliacao",
    label: "📋 Reconciliação Medicamentosa",
    text: "AVALIAÇÃO FARMACÊUTICA:\n- Realizada reconciliação medicamentosa na admissão.\n- Medicamentos de uso contínuo domiciliar identificados e checados com a prescrição atual.\n- Discrepâncias identificadas: [Sim / Não].\n",
    toastMsg: "Reconciliação Med.",
  },
  {
    id: "farma_interacao",
    label: "⚠️ Avaliação de Interações",
    text: "AVALIAÇÃO FARMACÊUTICA:\n- Avaliada a prescrição médica vigente. \n- Interações medicamentosas clinicamente relevantes detectadas: [Não / Sim].\n",
    toastMsg: "Aval. Interações",
  },
  {
    id: "farma_alergias",
    label: "🚫 Checagem de Alergias",
    text: "AVALIAÇÃO FARMACÊUTICA:\n- Investigadas alergias medicamentosas (RAM - Reação Adversa a Medicamento).\n- Paciente relata alergia a: [Nenhuma / Penicilinas / Dipirona / AINES / Outros].\n",
    toastMsg: "Checagem Alergias",
  },
  {
    id: "farma_funcao_renal",
    label: "🩸 Função Renal/Hepática",
    text: "AVALIAÇÃO FARMACÊUTICA:\n- Revisão de exames laboratoriais (Creatinina/Ureia/TGO/TGP).\n- Clearance de Creatinina: [ ] ml/min. Necessidade de ajuste de dose de antimicrobianos/fármacos: [Sim / Não].\n",
    toastMsg: "Aval. Função Renal",
  },
];

export const FARMA_ADULT_PROCEDURES: CareItem[] = [
  {
    id: "farma_ajuste",
    label: "📉 Intervenção: Ajuste de Dose",
    text: "CONDUTA FARMACÊUTICA:\n- Sugerido ajuste de posologia/dose ao prescritor devido a [disfunção renal/hepática, peso, interação].\n- Médico prescritor acatou a intervenção: [Sim / Não].\n",
    toastMsg: "Ajuste de Dose",
  },
  {
    id: "farma_suspensao",
    label: "🛑 Intervenção: Suspensão",
    text: "CONDUTA FARMACÊUTICA:\n- Sugerida suspensão de item na prescrição por duplicidade terapêutica ou risco de RAM.\n- Intervenção acatada.\n",
    toastMsg: "Suspensão Fármaco",
  },
  {
    id: "farma_via",
    label: "🔄 Substituição de Via (EV/VO)",
    text: "CONDUTA FARMACÊUTICA:\n- Avaliada possibilidade de transição sequencial de antimicrobianos/analgésicos (Via Endovenosa para Via Oral).\n- Paciente apto para Terapia Sequencial.\n",
    toastMsg: "Terapia Sequencial",
  },
  {
    id: "farma_diluicao",
    label: "💧 Orientação de Diluição",
    text: "CONDUTA FARMACÊUTICA:\n- Orientação à equipe de enfermagem sobre incompatibilidade em Y, tempo de infusão e diluente adequado para fármacos restritos.\n",
    toastMsg: "Orientação Enfermagem",
  },
  {
    id: "farma_alta",
    label: "🗣️ Orientação de Alta Farmacêutica",
    text: "CONDUTA FARMACÊUTICA:\n- Educação em saúde à beira leito com paciente/familiar no momento da alta.\n- Explicação sobre horários, interações alimento-fármaco e guarda dos medicamentos.\n",
    toastMsg: "Orientação de Alta",
  },
];

export const FARMA_PED_ITEMS: CareItem[] = [
  {
    id: "farma_ped_dose",
    label: "⚖️ Checagem de Dose Pediátrica",
    text: "AVALIAÇÃO FARMACÊUTICA (PEDIÁTRICA):\n- Verificação da prescrição pediátrica.\n- Doses checadas de acordo com peso atual da criança ([ ] kg). Doses estão em faixa terapêutica segura.\n",
    toastMsg: "Checagem Dose Ped",
  },
  {
    id: "farma_ped_adesao",
    label: "👨‍👩‍👦 Avaliação de Adesão",
    text: "AVALIAÇÃO FARMACÊUTICA (PEDIÁTRICA):\n- Entrevista com responsáveis para avaliar o uso correto dos medicamentos inalatórios e orais no domicílio.\n- Erros de administração prévios identificados: [Sim / Não].\n",
    toastMsg: "Aval. Adesão Pais",
  },
];

export const FARMA_PED_PROCEDURES: CareItem[] = [
  {
    id: "farma_ped_intervencao",
    label: "🛑 Intervenção Pediátrica",
    text: "CONDUTA FARMACÊUTICA (PEDIÁTRICA):\n- Notificada prescrição fora do padrão pediátrico (subdose/superdose).\n- Médico contatado para adequação da posologia por mg/kg/dia.\n",
    toastMsg: "Intervenção Pediátrica",
  },
  {
    id: "farma_ped_preparo",
    label: "🥄 Orientação Preparo Soluções",
    text: "CONDUTA FARMACÊUTICA (PEDIÁTRICA):\n- Orientação aos pais sobre o preparo correto de suspensões orais (ex: antibióticos em pó) e uso do dosador (seringa/copinho em ml, não colher).\n",
    toastMsg: "Orientação Suspensão",
  },
  {
    id: "farma_ped_aprazamento",
    label: "⏱️ Aprazamento Pediátrico",
    text: "CONDUTA FARMACÊUTICA (PEDIÁTRICA):\n- Otimização do aprazamento (horários) para respeitar o ciclo de sono da criança sem prejudicar o nível sérico do medicamento.\n",
    toastMsg: "Ajuste Aprazamento",
  },
];

export const PRESCRIPTION_MEDICATION_ITEMS: CareItem[] = [
  {
    id: "presc_dipirona",
    label: "💊 Analgesia Comum (Dipirona)",
    text: "1. Dipirona 1g EV diluído em Soro Fisiológico 0.9% 100ml - correr em 20 minutos (se febre > 37.8°C ou dor moderada/grave).\n",
    toastMsg: "Combo de Analgesia",
  },
  {
    id: "presc_tramal",
    label: "🔥 Analgesia Forte (Tramal+Buscopan)",
    text: "1. Tramadol 50mg EV + Escopolamina (Buscopan) 20mg EV diluídos em Soro Fisiológico 0.9% 100ml - correr lento em 30 minutos (se dor intensa ou cólica).\n",
    toastMsg: "Combo de Analgesia Forte",
  },
  {
    id: "presc_vomito",
    label: "🤢 Combo Anti-vômito",
    text: "1. Ondansetrona 8mg EV diluído em Soro Fisiológico 0.9% 100ml - correr em 20 minutos (se náuseas ou vômitos).\n2. Metoclopramida (Plasil) 10mg EV lento (se refratário).\n",
    toastMsg: "Combo Gastrointestinal",
  },
  {
    id: "presc_alergico",
    label: "🤧 Antialérgico (Fenergan+Dexa)",
    text: "1. Prometazina (Fenergan) 50mg IM profundo.\n2. Dexametasona 10mg EV diluída em SF 0.9% 100ml.\n",
    toastMsg: "Combo Antialérgico",
  },
  {
    id: "presc_hipertensiva",
    label: "❤️ Crise Hipertensiva (Captopril)",
    text: "1. Captopril 25mg Via Oral (se PAS > 180 ou PAD > 110 sem sinais de alarme).\n2. Reavaliar PA em 40 minutos.\n",
    toastMsg: "Combo Crise Hipertensiva",
  },
  {
    id: "presc_hipoglicemia",
    label: "🩸 Hipoglicemia (Glicose 50%)",
    text: "1. Glicose 50% 4 ampolas (40ml) EV em bolus lento.\n2. Reavaliar HGT em 15 minutos.\n",
    toastMsg: "Combo Hipoglicemia",
  },
  {
    id: "presc_nebulizacao",
    label: "🫁 Nebulização (Berotec/Atrovent)",
    text: "1. Inalação com Soro Fisiológico 0.9% 5ml + Fenoterol (Berotec) 5 gotas + Ipratrópio (Atrovent) 10 gotas. Realizar a cada 20 minutos, até 3 vezes se broncoespasmo grave.\n",
    toastMsg: "Combo de Nebulização",
  },
];

export const PRESCRIPTION_DIET_ITEMS: CareItem[] = [
  {
    id: "presc_hidratacao",
    label: "💧 Hidratação Venosa 500ml",
    text: "1. Soro Fisiológico 0.9% 500ml EV - correr em 2 horas em bomba de infusão ou gotejamento rápido para hidratação endovenosa.\n",
    toastMsg: "Combo de Hidratação",
  },
  {
    id: "presc_dieta_geral",
    label: "🍽️ Dieta Geral / Livre",
    text: "1. Dieta livre por via oral (sem restrições alimentares).\n",
    toastMsg: "Dieta Geral",
  },
  {
    id: "presc_dieta_leve",
    label: "🥣 Dieta Leve / Branda",
    text: "1. Dieta leve e branda por via oral, de fácil digestão (pobre em resíduos).\n",
    toastMsg: "Dieta Leve",
  },
  {
    id: "presc_dieta_zero",
    label: "🚫 Dieta Zero (Jejum)",
    text: "1. Dieta zero por via oral (jejum absoluto) devido a procedimento / exames / quadro agudo.\n",
    toastMsg: "Dieta Zero",
  },
  {
    id: "presc_dieta_liquida",
    label: "🥤 Dieta Líquida / Pastosa",
    text: "1. Dieta líquida e pastosa por via oral para melhor deglutição.\n",
    toastMsg: "Dieta Líquida/Pastosa",
  },
  {
    id: "presc_dieta_hiposodica",
    label: "🥬 Dieta Hipossódica / Diabética",
    text: "1. Dieta hipossódica e para diabéticos (pobre em sódio e sem açúcares simples).\n",
    toastMsg: "Dieta Restritiva",
  },
  {
    id: "presc_monitoramento",
    label: "📊 Monitoramento SSVV",
    text: "1. Monitorização contínua de Sinais Vitais (PA, FC, SpO2, Temp, FR) a cada [ ] horas.\n",
    toastMsg: "Monitoramento de Sinais Vitais",
  },
  {
    id: "presc_repouso",
    label: "🛌 Repouso Absoluto",
    text: "1. Repouso absoluto no leito com cabeceira elevada a 30-45 graus.\n",
    toastMsg: "Repouso Absoluto",
  },
];

export const DISCHARGE_TYPE_ITEMS: CareItem[] = [
  {
    id: "alta_medica",
    label: "✅ Alta Médica (Melhorado)",
    text: "DESFECHO: ALTA MÉDICA (MELHORADO)\n\nPaciente evoluiu com melhora clínica após medicações realizadas na unidade. No momento: hemodinamicamente estável, eupneico, acianótico, afebril, consciente e orientado. Sem queixas álgicas agudas.\n\nConduta: Alta com orientações de sinais de alarme e receituário médico em mãos. Orientado a retornar se piora do quadro.",
    toastMsg: "Resumo de Alta Médica",
  },
  {
    id: "alta_pedido",
    label: "📜 Alta a Pedido (Contra Orientação)",
    text: "DESFECHO: ALTA A PEDIDO\n\nPaciente solicita alta a pedido, declarando-se ciente dos riscos de interromper a avaliação/tratamento clínico proposto. Orientado(a) quanto aos sinais de alarme e gravidade. \n\nConduta: Assina o Termo de Responsabilidade (Evasão/Alta a Pedido) que deverá ser anexado ao prontuário impresso.",
    toastMsg: "Resumo de Alta a Pedido",
  },
  {
    id: "alta_transferencia",
    label: "🚑 Transferência Hospitalar",
    text: "DESFECHO: TRANSFERÊNCIA HOSPITALAR\n\nPaciente necessita de avaliação de especialidade / internação não disponível nesta unidade. Vaga solicitada via CROSS/Central de Regulação.\n\nConduta: Transferido via ambulância acompanhado de equipe, monitorizado e com suporte adequado. Prontuário e exames entregues à equipe de transporte.",
    toastMsg: "Resumo de Transferência",
  },
  {
    id: "alta_evasao",
    label: "🏃 Evasão",
    text: "DESFECHO: EVASÃO\n\nPaciente evadiu-se da unidade antes do término do atendimento ou avaliação médica/reavaliação. Retirado acesso venoso (caso aplicável). \n\nComunicado à equipe de enfermagem e recepção. Prontuário encerrado administrativamente por evasão.",
    toastMsg: "Resumo de Evasão",
  },
  {
    id: "alta_obito",
    label: "✝️ Óbito (PCR)",
    text: "DESFECHO: ÓBITO\n\nPaciente apresentou Parada Cardiorrespiratória (PCR). Iniciadas manobras de RCP avançada conforme protocolo ACLS. Sem retorno da circulação espontânea após [COMPLETAR] minutos de reanimação. Constatado óbito às [HORÁRIO].\n\nConduta: Encaminhado corpo para o morgue. Comunicado aos familiares presentes na unidade. Emitida Declaração de Óbito.",
    toastMsg: "Resumo de Óbito",
  },
];

export const DISCHARGE_CONDUCT_ITEMS: CareItem[] = [
  {
    id: "alta_conduta_alarme",
    label: "⚠️ Sinais de Alarme (Geral)",
    text: "ORIENTAÇÃO DE SINAIS DE ALARME:\nOrientado retornar imediatamente à UPA caso apresente febre persistente (>38°C), dor intensa refratária, falta de ar, vômitos incoercíveis, sonolência excessiva, desmaio ou alteração do nível de consciência.\n",
    toastMsg: "Sinais de Alarme",
  },
  {
    id: "alta_conduta_curativo",
    label: "🩹 Cuidados de Enfermagem / Curativos",
    text: "CUIDADOS COM CURATIVOS E FERIDAS:\nOrientado a manter o curativo limpo e seco. Realizar higienização diária com água corrente e sabão neutro, aplicar antisséptico prescrito e refazer cobertura seca. Retirar pontos em [ ] dias na Unidade Básica de Saúde.\n",
    toastMsg: "Cuidados com Curativos",
  },
  {
    id: "alta_conduta_receituario",
    label: "💊 Adesão ao Receituário Médico",
    text: "ORIENTAÇÃO FARMACÊUTICA E ADESÃO:\nOrientado detalhadamente sobre o uso correto das medicações prescritas para uso domiciliar (dosagem, horários e duração do tratamento). Ressaltada a importância de não interromper o tratamento antibiótico antes do prazo.\n",
    toastMsg: "Adesão ao Receituário",
  },
  {
    id: "alta_conduta_isolamento",
    label: "🦠 Isolamento Respiratório Domiciliar",
    text: "RECOMENDAÇÃO DE ISOLAMENTO RESPIRATÓRIO:\nPaciente orientado a manter isolamento respiratório domiciliar por [ ] dias devido a suspeita/confirmação de patologia infectocontagiosa aérea. Uso de máscara descartável, higienização frequente das mãos e não compartilhar utensílios.\n",
    toastMsg: "Isolamento Respiratório",
  },
  {
    id: "alta_conduta_retorno",
    label: "📅 Retorno e Seguimento na UBS",
    text: "SEGUIMENTO E RETORNO:\nPaciente orientado a agendar consulta de seguimento e reavaliação clínica na sua Unidade Básica de Saúde (UBS) de referência em até [ ] dias, portando o resumo de alta desta UPA.\n",
    toastMsg: "Retorno na UBS",
  },
];
