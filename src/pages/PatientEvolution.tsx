import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { usePatients } from "@/hooks/use-patients";
import { EvolutionRecord } from "@/context/PatientsContext";
import { useBeds } from "@/context/BedsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, MessageSquare, Bed as BedIcon, History, X, CheckCircle2, ChevronLeft, ChevronRight, Activity, Search, Clock, ShieldAlert, Heart, Baby, Brain } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CID10_DATABASE, CID10Item } from "@/data/cid10";
import { SmartCidSelector } from "@/components/SmartCidSelector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

const EVOLUTION_TEMPLATES: Record<string, string> = {
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
    
  "Prescrição": 
    "PRESCRIÇÃO CLÍNICA:\n" +
    "1. Dieta: [   ]\n" +
    "2. Hidratação Venosa: Soro Fisiológico 0.9% 500ml EV a correr em [   ] horas\n" +
    "3. Sintomáticos:\n" +
    "   - Dipirona 1g EV (se febre > 37.8°C ou dor)\n" +
    "   - Ondansetrona 8mg EV (se náuseas ou vômitos)\n" +
    "4. Monitorização de Sinais Vitais de [   ] em [   ] horas.",
    
  "Procedimento": 
    "Procedimento realizado: [   ]\n" +
    "Materiais utilizados: [   ]\n" +
    "Intercorrências durante o procedimento: [Não houve / Descrever]\n" +
    "Orientações dadas ao paciente: Mantido em repouso e sob observação clínica.",
    
  "Alta": 
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
    "4. Observações: [ ]"
};

interface CareItem {
  id: string;
  label: string;
  text: string;
  toastMsg: string;
}

const MEDICATION_CARE_ITEMS: CareItem[] = [
  {
    id: "puncao",
    label: "🩸 Punção Venosa",
    text: "PUNÇÃO VENOSA:\n- Realizada punção venosa periférica em [MSE / MSD] com cateter calibre [20G / 22G / 24G].\n- Acesso pérvio, fixado com curativo transparente e salinizado conforme protocolo. Sem sinais flogísticos.\n",
    toastMsg: "Punção Venosa"
  },
  {
    id: "med_feita",
    label: "✅ Medicação Feita",
    text: "MEDICAÇÃO ADMINISTRADA:\n- Administrada medicação conforme prescrição médica do horário vigente.\n- Paciente não apresentou reações adversas ou intercorrências durante a infusão. Acesso mantido pérvio.\n",
    toastMsg: "Medicação Feita"
  },
  {
    id: "recusa",
    label: "🚫 Recusa Medicação",
    text: "RECUSA DE MEDICAÇÃO:\n- Paciente/Acompanhante recusa a administração da medicação proposta na prescrição.\n- Orientado quanto aos riscos da recusa. Médico plantonista e Enfermeiro comunicados do fato.\n",
    toastMsg: "Recusa de Medicação"
  },
  {
    id: "hgt",
    label: "🩸 Glicemia Capilar (HGT)",
    text: "GLICEMIA CAPILAR (HGT):\n- Realizado teste de glicemia capilar. Resultado: [ ] mg/dL.\n- Administrado insulina regular conforme protocolo/prescrição se aplicável. Médico plantonista ciente caso haja alteração crítica.\n",
    toastMsg: "Glicemia Capilar (HGT)"
  },
  {
    id: "soroterapia",
    label: "💧 Soroterapia / Infusão",
    text: "SOROTERAPIA:\n- Instalado soroterapia / hidratação venosa contínua conforme prescrição.\n- Infusão correndo sob bomba de infusão / gotejamento adequado, sem sinais de infiltração ou extravasamento.\n",
    toastMsg: "Soroterapia / Infusão"
  },
  {
    id: "inalacao",
    label: "🫁 Inalação / Nebulização",
    text: "NEBULIZAÇÃO / INALAÇÃO:\n- Realizada inalação/nebulização com broncodilatador conforme prescrição médica.\n- Paciente tolerou bem o procedimento, referindo melhora do padrão respiratório após término.\n",
    toastMsg: "Inalação / Nebulização"
  },
  {
    id: "retirada_acesso",
    label: "❌ Retirada de Acesso",
    text: "RETIRADA DE ACESSO VENOSO:\n- Retirado acesso venoso periférico devido a alta / término do tratamento / infiltração.\n- Dispositivo retirado íntegro. Realizado curativo compressivo local, sem sangramentos.\n",
    toastMsg: "Retirada de Acesso"
  }
];

const NURSING_CARE_ITEMS: CareItem[] = [
  {
    id: "banho",
    label: "🚿 Banho no Leito",
    text: "- Realizado banho no leito com troca de roupas de cama.\n",
    toastMsg: "Banho no Leito"
  },
  {
    id: "decubito",
    label: "🔄 Mudança de Decúbito",
    text: "- Realizada mudança de decúbito para prevenção de LPP.\n",
    toastMsg: "Mudança de Decúbito"
  },
  {
    id: "curativo",
    label: "🩹 Troca de Curativo",
    text: "- Realizada troca de curativo em [LOCAL], aspecto limpo e seco.\n",
    toastMsg: "Troca de Curativo"
  },
  {
    id: "dieta_elim",
    label: "🍽️ Dieta e Eliminações",
    text: "- Aceitação parcial/total da dieta oferecida. Diurese e dejeções presentes na fralda/comadre.\n",
    toastMsg: "Dieta e Eliminações"
  },
  {
    id: "grades",
    label: "🛏️ Grades Elevadas",
    text: "- Mantidas grades do leito elevadas para segurança do paciente (prevenção de queda).\n",
    toastMsg: "Grades Elevadas"
  },
  {
    id: "higiene_oral",
    label: "🪥 Higiene Oral",
    text: "- Realizada higiene oral e conforto do paciente.\n",
    toastMsg: "Higiene Oral"
  },
  {
    id: "pele",
    label: "🦶 Cuidados com a Pele",
    text: "- Aplicado hidratante/ácidos graxos essenciais (AGE) em proeminências ósseas.\n",
    toastMsg: "Cuidados com a Pele"
  },
  {
    id: "controle_ssvv",
    label: "📊 Monitoramento SSVV",
    text: "- Aferido e registrado sinais vitais do horário. Parâmetros clínicos sem alterações críticas.\n",
    toastMsg: "Monitoramento SSVV"
  },
  {
    id: "aspiracao_va",
    label: "🌬️ Aspiração de Vias Aéreas",
    text: "- Realizada aspiração de vias aéreas. Retirada de secreção [fluida / espessa] em moderada quantidade.\n",
    toastMsg: "Aspiração de Vias Aéreas"
  }
];

const COMFORT_CARE_ITEMS: CareItem[] = [
  {
    id: "higiene",
    label: "🛁 Higiene / Banho",
    text: "HIGIENE E CONFORTO:\n- Realizado banho [NO LEITO / ASPERSÃO].\n- Feita a troca de roupas de cama, roupas do paciente e troca de fraldas.\n- Realizada mudança de decúbito para prevenção de lesões. Deixado confortável no leito.\n",
    toastMsg: "Higiene / Banho"
  },
  {
    id: "dieta",
    label: "🍲 Aceitação de Dieta",
    text: "DIETA / ALIMENTAÇÃO:\n- Dieta oferecida pelo serviço de nutrição com [BOA / PARCIAL / MÁ] aceitação pelo paciente.\n- Mantido padrão de hidratação adequada.\n",
    toastMsg: "Aceitação de Dieta"
  },
  {
    id: "curativo_tec",
    label: "🩹 Curativo",
    text: "CURATIVO TÉCNICO:\n- Realizada troca de curativo em [LOCAL DA FERIDA/LESÃO] com técnica asséptica.\n- Ferida apresenta aspecto [LIMPO / HIPEREMIADO / SECREÇÃO]. Curativo fechado oclusivo limpo e seco.\n",
    toastMsg: "Curativo"
  },
  {
    id: "oxigeno",
    label: "💨 Oxigenoterapia",
    text: "OXIGENOTERAPIA:\n- Instalado/Mantido suporte de O2 via [CATETER NASAL / MÁSCARA] a [ ] L/min.\n- Paciente mantendo SpO2 in [ ]%. Boa adaptação ao dispositivo.\n",
    toastMsg: "Oxigenoterapia"
  },
  {
    id: "sondas",
    label: "💧 Controle Sondas/Drenos",
    text: "CONTROLE DE SONDAS / DRENOS:\n- Realizado esvaziamento de bolsa coletora da [SVD / DRENO].\n- Débito: [ ] ml. Aspecto: [CLARO / HEMÁTICO / PURULENTO].\n- Dispositivo mantido fixo e pérvio.\n",
    toastMsg: "Controle Sondas/Drenos"
  },
  {
    id: "sonda_vesical",
    label: "🚽 Cateterismo Vesical",
    text: "CATETERISMO VESICAL:\n- Realizado cateterismo vesical de [DEMORA / ALÍVIO] sob técnica asséptica e estéril.\n- Obtido retorno imediato de diurese de aspecto [claro / colúrico / hematúrico], totalizando [ ] ml.\n",
    toastMsg: "Cateterismo Vesical"
  },
  {
    id: "sonda_nasogastrica",
    label: "👃 Sondagem Gástrica/Enteral",
    text: "SONDAGEM GÁSTRICA / ENTERAL:\n- Realizada introdução de sonda [SNG / SNE] calibre [ ] para [alimentação / drenagem].\n- Teste de posicionamento (ausculta e resíduo) realizado sem intercorrências. Dispositivo fixado.\n",
    toastMsg: "Sondagem Gástrica/Enteral"
  }
];

const MOVEMENT_CARE_ITEMS: CareItem[] = [
  {
    id: "transporte",
    label: "🩻 Transporte (RX/ECG)",
    text: "TRANSPORTE / EXAMES:\n- Paciente encaminhado para a sala de [RAIO-X / ECG] in [CADEIRA DE RODAS / MACA].\n- Retornou ao setor de observação sem intercorrências durante o transporte.\n",
    toastMsg: "Transporte (RX/ECG)"
  },
  {
    id: "transferencia",
    label: "🚑 Transferência",
    text: "TRANSFERÊNCIA DE SETOR:\n- Paciente transferido para [SALA VERMELHA / OBSERVAÇÃO / ENFERMARIA].\n- Transportado monitorizado, com suporte contínuo e acesso pérvio. Repassado plantão e pertences.\n",
    toastMsg: "Transferência"
  },
  {
    id: "aviso",
    label: "⚠️ Intercorrência (Aviso Médico)",
    text: "AVISO MÉDICO / INTERCORRÊNCIA:\n- Paciente apresenta queixa de [DOR INTENSA / FALTA DE AR / SANGRAMENTO].\n- Aferido Sinais Vitais imediatamente. \n- Enfermeiro e Médico plantonista comunicados do fato para reavaliação.\n",
    toastMsg: "Intercorrência (Aviso Médico)"
  },
  {
    id: "contencao",
    label: "⛓️ Contenção Mecânica",
    text: "CONTENÇÃO MECÂNICA:\n- Realizada contenção mecânica no leito visando proteção do paciente e da equipe, devido à agitação psicomotora.\n- Mantida vigilância contínua. Membros com boa perfusão periférica.\n",
    toastMsg: "Contenção Mecânica"
  },
  {
    id: "orientacao",
    label: "💬 Orientação Familiar",
    text: "ACOLHIMENTO / ORIENTAÇÃO FAMILIAR:\n- Fornecido informações de enfermagem ao familiar/acompanhante presente.\n- Acompanhante ciente das rotinas do setor, riscos (ex: risco de queda) e condutas do plantão.\n",
    toastMsg: "Orientação Familiar"
  },
  {
    id: "admissao",
    label: "🚪 Admissão no Setor",
    text: "ADMISSÃO NO SETOR:\n- Paciente admitido no setor de observação. Acomodado em [leito / poltrona] com grades elevadas.\n- Realizado acolhimento, identificado com pulseira e orientado quanto às normas do setor.\n",
    toastMsg: "Admissão no Setor"
  },
  {
    id: "evasao",
    label: "🏃 Evasão do Setor",
    text: "EVASÃO DO SETOR:\n- Constatada evasão do paciente do setor de observação sem alta médica.\n- Retirado acesso venoso (se aplicável). Comunicado Enfermeiro e Médico plantonista do fato.\n",
    toastMsg: "Evasão do Setor"
  }
];

const ADMISSION_ROUTINE_ITEMS: CareItem[] = [
  {
    id: "sala_vermelha",
    label: "🚨 Sala Vermelha",
    text: `ADMISSÃO EM SALA VERMELHA (EMERGÊNCIA):\n\nPaciente admitido(a) na sala vermelha em maca, trazido(a) pelo SAMU/Resgate. Rebaixamento de nível de consciência (Glasgow [ ]). \nInstalada monitorização multiparamétrica (ECG contínuo, SpO2 e PANI). Realizado Acesso Venoso Periférico calibroso. Instalado suporte de oxigênio via [CATETER/MÁSCARA]. \nAguarda reavaliação médica e definição de condutas. Mantida vigilância contínua.`,
    toastMsg: "Rotina: Sala Vermelha"
  },
  {
    id: "obs_adulto",
    label: "🛌 Observação Adulto",
    text: `ADMISSÃO EM OBSERVAÇÃO ADULTO:\n\nPaciente admitido(a) no setor de observação proveniente da recepção/triagem, deambulando. Consciente, orientado(a), comunicativo(a). Eupneico(a) em ar ambiente. \nPuncionado Acesso Venoso Periférico (AVP) em [MEMBRO], salinizado e sem sinais flogísticos.\nOrientado(a) quanto às rotinas do setor. Segue sob cuidados de enfermagem.`,
    toastMsg: "Rotina: Obs Adulto"
  },
  {
    id: "obs_pediatrica",
    label: "👶 Observação Pediátrica",
    text: `ADMISSÃO EM OBSERVAÇÃO PEDIÁTRICA:\n\nCriança admitida no setor de observação infantil acompanhada pelo responsável [NOME DO RESPONSÁVEL]. Ativa, reativa, chorosa ao manuseio, mas consolável.\nRealizado Acesso Venoso Periférico (AVP) em [MEMBRO].\nOrientações prestadas ao familiar quanto ao risco de queda (manter grade elevada). Segue sob cuidados.`,
    toastMsg: "Rotina: Obs Pediátrica"
  },
  {
    id: "passagem_plantao",
    label: "📋 Passagem de Plantão",
    text: `PASSAGEM DE PLANTÃO:\n\nRecebo o plantão com paciente no leito, calmo(a). Mantém AVP pérvio e sem sinais de infiltração/flebite. Dieta aceita. Eliminações presentes. Mantidas as prescrições médicas vigentes. Segue sob cuidados da equipe.`,
    toastMsg: "Rotina: Plantão"
  }
];

const PEDIATRIC_MEDICATION_CARE_ITEMS: CareItem[] = [
  {
    id: "ped_puncao",
    label: "💉 Punção Venosa Pediátrica",
    text: "PUNÇÃO VENOSA PEDIÁTRICA:\n- Realizada punção venosa periférica em membro [MSE / MSD / MIE / MID] com cateter calibre 24G (tipo Gelco/Scalp).\n- Acesso com excelente fluxo, pérvio, fixado com curativo lúdico/infantil adequado e protegido contra tração. Sem sinais flogísticos.\n",
    toastMsg: "Punção Pediátrica"
  },
  {
    id: "ped_med_feita",
    label: "✅ Medicação Feita (Ped)",
    text: "MEDICAÇÃO ADMINISTRADA (PEDIATRIA):\n- Administrada medicação conforme prescrição pediátrica vigente (dose e diluição adequadas para o peso/faixa etária).\n- Criança tolerou bem a medicação, sem intercorrências ou reações adversas imediatas.\n",
    toastMsg: "Medicação Feita"
  },
  {
    id: "ped_soroterapia",
    label: "💧 Soroterapia / Bomba",
    text: "SOROTERAPIA PEDIÁTRICA:\n- Instalado esquema de hidratação venosa contínua / soroterapia em Bomba de Infusão Contínua (BIC) a [ ] mL/h.\n- Controle rigoroso de gotejamento/fluxo, sem sinais de infiltração, extravasamento ou edema local.\n",
    toastMsg: "Soroterapia Pediátrica"
  },
  {
    id: "ped_inalacao",
    label: "🫁 Inalação / Nebulização",
    text: "NEBULIZAÇÃO PEDIÁTRICA:\n- Realizada inalação/nebulização com máscara infantil adequada conforme prescrição médica.\n- Procedimento bem tolerado sob auxílio e acolhimento do responsável, apresentando melhora do desconforto/ruídos respiratórios após término.\n",
    toastMsg: "Inalação Pediátrica"
  },
  {
    id: "ped_hgt",
    label: "🩸 Glicemia Capilar (HGT)",
    text: "GLICEMIA CAPILAR PEDIÁTRICA:\n- Realizado teste de glicemia capilar (HGT) em região calcânea/digital. Resultado: [ ] mg/dL.\n- Médico plantonista / Pediatra ciente do resultado para conduta.\n",
    toastMsg: "Glicemia Capilar (HGT)"
  },
  {
    id: "ped_recusa",
    label: "🚫 Recusa Alimentar/Med",
    text: "RECUSA / DIFICULDADE DE ACEITAÇÃO:\n- Paciente pediátrico apresenta recusa ou dificuldade importante na ingestão de medicação por via oral / dieta.\n- Realizadas tentativas lúdicas, porém sem sucesso imediato. Enfermeiro e Pediatra plantonista comunicados.\n",
    toastMsg: "Recusa Pediátrica"
  },
  {
    id: "ped_retirada_acesso",
    label: "❌ Retirada de Acesso",
    text: "RETIRADA DE ACESSO VENOSO PEDIÁTRICO:\n- Retirado acesso venoso periférico devido a término de tratamento / alta / infiltração.\n- Cateter retirado íntegro. Realizado curativo local compressivo lúdico, sem sangramentos ativos.\n",
    toastMsg: "Retirada de Acesso"
  }
];

const PEDIATRIC_NURSING_CARE_ITEMS: CareItem[] = [
  {
    id: "ped_higiene_fraldas",
    label: "👶 Troca de Fraldas / Higiene",
    text: "HIGIENE E CONFORTO PEDIÁTRICO:\n- Realizada troca de fraldas com higiene íntima adequada.\n- Aplicado pomada barreira contra assaduras. Pele íntegra, sem sinais de dermatite de fraldas.\n",
    toastMsg: "Troca de Fraldas / Higiene"
  },
  {
    id: "ped_berco_grades",
    label: "🛏️ Grades do Berço Elevadas",
    text: "MEDIDA DE SEGURANÇA PEDIÁTRICA:\n- Mantidas as grades do berço / leito hospitalar elevadas a 100% do tempo.\n- Responsável orientado sobre a proibição de deixar a criança sozinha no leito para prevenção de quedas.\n",
    toastMsg: "Grades Elevadas"
  },
  {
    id: "ped_dieta_formula",
    label: "🍼 Dieta / Aleitamento",
    text: "NUTRIÇÃO PEDIÁTRICA:\n- Dieta oferecida: [leite materno / fórmula infantil / dieta pastosa] com [boa / regular / aceitação recusada].\n- Padrão de sucção efetivo, sem engasgos ou vômitos pós-prandiais.\n",
    toastMsg: "Dieta / Aleitamento"
  },
  {
    id: "ped_controle_termico",
    label: "🌡️ Controle Térmico / Banho",
    text: "CONTROLE TÉRMICO:\n- Aferido temperatura corporal. Apresentando pico febril de [ ] °C.\n- Administrado antitérmico conforme prescrição, associado a banho morno de asproc / compressas úmidas para controle físico de temperatura.\n",
    toastMsg: "Controle Térmico"
  },
  {
    id: "ped_desobstrucao_nasal",
    label: "🌬️ Lavagem / Lavagem Nasal",
    text: "DESOBSTRUÇÃO DE VIAS AÉREAS:\n- Realizada desobstrução de vias aéreas superiores com lavagem nasal com Soro Fisiológico 0.9% sob técnica suave.\n- Retorno de secreção mucoide em [pequena / moderada] quantidade, com melhora visível do padrão respiratório.\n",
    toastMsg: "Lavagem Nasal"
  },
  {
    id: "ped_curativo_ludico",
    label: "🩹 Curativo Lúdico",
    text: "CURATIVO PEDIÁTRICO:\n- Realizada troca de curativo local em [LOCAL] sob técnica limpa.\n- Ferida operatória/lesão com bom aspect, sem secreção purulenta. Fixado com cobertura infantil / fita antialérgica.\n",
    toastMsg: "Curativo Lúdico"
  },
  {
    id: "ped_aspiracao_infantil",
    label: "🌬️ Aspiração de Vias (Ped)",
    text: "ASPIRAÇÃO DE VIAS AÉREAS PEDIÁTRICA:\n- Realizada aspiração de vias aéreas superiores / oral com sonda de calibre adequado. Retirada de secreção [fluida / espessa] clara. Criança tolerou bem.\n",
    toastMsg: "Aspiração Pediátrica"
  },
  {
    id: "ped_decubito",
    label: "🔄 Decúbito Pediátrico",
    text: "- Realizada mudança de decúbito do lactente/criança sob auxílio do responsável para alívio de pontos de pressão e conforto.\n",
    toastMsg: "Decúbito Pediátrico"
  },
  {
    id: "ped_ssvv",
    label: "📊 SSVV Pediátrico",
    text: "- Aferido e registrado sinais vitais específicos para a faixa etária pediátrica (FC, FR, Temp, SpO2). Parâmetros clínicos adequados.\n",
    toastMsg: "SSVV Pediátrico"
  },
  {
    id: "ped_higiene_oral",
    label: "🪥 Higiene Oral Infantil",
    text: "- Realizada higiene oral lúdica com gaze/escova adequada para a idade. Conforto do paciente preservado.\n",
    toastMsg: "Higiene Oral Infantil"
  }
];

const PEDIATRIC_COMFORT_CARE_ITEMS: CareItem[] = [
  {
    id: "ped_acolhimento_brinquedo",
    label: "🧸 Acolhimento Lúdico",
    text: "ACOLHIMENTO LÚDICO:\n- Utilizado técnicas lúdicas (brinquedo terapêutico, desenhos, ambiente descontraído) para redução da ansiedade, choro e medo durante o atendimento.\n- Criança demonstrou-se mais calma e cooperativa com a equipe.\n",
    toastMsg: "Acolhimento Lúdico"
  },
  {
    id: "ped_apoio_responsavel",
    label: "👩 Suporte ao Acompanhante",
    text: "ORIENTAÇÃO AO ACOMPANHANTE:\n- Fornecido orientações completas à mãe/pai/responsável sobre o plano terapêutico, sinais de alerta de piora e importância do repouso no leito.\n- Responsável demonstra entendimento e colabora com os cuidados vigentes.\n",
    toastMsg: "Suporte ao Acompanhante"
  },
  {
    id: "ped_sono_repouso",
    label: "🛌 Sono e Repouso",
    text: "SONO E REPOUSO:\n- Paciente pediátrico mantido em sono tranquilo no berço / colo do responsável. \n- Ambiente mantido com luminosidade e ruídos reduzidos para favorecer o descanso.\n",
    toastMsg: "Sono e Repouso"
  },
  {
    id: "ped_oxigeno",
    label: "💨 Oxigenoterapia Pediátrica",
    text: "OXIGENOTERAPIA PEDIÁTRICA:\n- Instalado/Mantido suporte de O2 sob máscara infantil / cateter nasal infantil a [ ] L/min.\n- Criança calma e adaptada ao dispositivo, mantendo SpO2 em [ ]%.\n",
    toastMsg: "Oxigenoterapia Pediátrica"
  },
  {
    id: "ped_drenos",
    label: "💧 Sondas e Drenos (Ped)",
    text: "CONTROLE DE SONDAS / DRENOS PEDIÁTRICOS:\n- Realizado esvaziamento e medição de débito de sondas/drenos. Débito de [ ] mL. Aspecto [ ].\n- Dispositivos fixados de forma segura contra tração.\n",
    toastMsg: "Sondas e Drenos (Ped)"
  },
  {
    id: "ped_sonda_vesical",
    label: "🚽 Cateterismo Vesical Ped",
    text: "CATETERISMO VESICAL PEDIÁTRICO:\n- Realizado cateterismo vesical [de alívio / de demora] sob técnica estéril com sonda de calibre pediátrico.\n- Retorno imediato de [ ] mL de urina de aspecto [claro / límpido].\n",
    toastMsg: "Cateterismo Vesical Ped"
  },
  {
    id: "ped_sonda_gastrica",
    label: "👃 Sondagem Gástrica (Ped)",
    text: "SONDAGEM GÁSTRICA PEDIÁTRICA:\n- Realizada introdução de sonda [SNG / SNE] calibre infantil para [alimentação / drenagem] sob técnica correta. Posicionamento testado e confirmado. Dispositivo fixado.\n",
    toastMsg: "Sondagem Gástrica (Ped)"
  }
];

const PEDIATRIC_MOVEMENT_CARE_ITEMS: CareItem[] = [
  {
    id: "ped_transporte_colo",
    label: "🩻 Transporte Colo/Berço",
    text: "TRANSPORTE PEDIÁTRICO:\n- Criança transportada para realização de exames de imagem (Raio-X / ultrassonografia) [no colo do responsável / em berço móvel] de forma segura.\n- Retornou ao setor sem intercorrências durante o trajeto.\n",
    toastMsg: "Transporte Seguro"
  },
  {
    id: "ped_transferencia_infantil",
    label: "🚑 Transferência Setor",
    text: "TRANSFERÊNCIA DE SETOR PEDIÁTRICO:\n- Paciente transferido para a Observação Infantil / Enfermaria Pediátrica / Sala Vermelha Pediátrica.\n- Acompanhado pelo responsável, com acesso venoso protegido e relatórios de enfermagem entregues.\n",
    toastMsg: "Transferência Infantil"
  },
  {
    id: "ped_intercorrencia_ped",
    label: "⚠️ Intercorrência Pediátrica",
    text: "INTERCORRÊNCIA PEDIÁTRICA:\n- Paciente apresentou [pico febril / vômito em jato / piora do esforço respiratório com gemência / prostração intensa].\n- Sinais vitais aferidos imediatamente. Enfermeiro e Pediatra de plantão acionados para avaliação urgente.\n",
    toastMsg: "Aviso Intercorrência"
  },
  {
    id: "ped_seguranca_familiar",
    label: "💬 Orientação de Segurança",
    text: "ORIENTAÇÃO DE SEGURANÇA:\n- Orientado intensamente o familiar/responsável sobre a proibição de ausentar-se da beira do leito sem avisar a equipe, e sobre a obrigatoriedade de manter as grades do berço/leito sempre elevadas.\n",
    toastMsg: "Orientação de Segurança"
  },
  {
    id: "ped_admissao_setor",
    label: "🚪 Admissão Ala Infantil",
    text: "ADMISSÃO NA ALA PEDIÁTRICA:\n- Paciente pediátrico admitido no setor de observação acompanhado por seu responsável. Identificado com pulseira infantil. Grades elevadas e orientações fornecidas.\n",
    toastMsg: "Admissão Ala Infantil"
  },
  {
    id: "ped_evasao_setor",
    label: "🏃 Evasão Ala Infantil",
    text: "EVASÃO DE SETOR PEDIÁTRICO:\n- Constatada evasão/saída não autorizada do paciente pediátrico acompanhado de seu responsável do setor de observação infantil. Comunicado Enfermeiro e Médico de plantão.\n",
    toastMsg: "Evasão Ala Infantil"
  },
  {
    id: "ped_restricao_terapeutica",
    label: "⛓️ Proteção Terapêutica (Ped)",
    text: "RESTRIÇÃO TERAPÊUTICA PEDIÁTRICA:\n- Realizada restrição suave de membros de forma lúdica/protetiva para impedir tração acidental de dispositivos (AVP/SNG). Mantida monitorização da perfusão distal.\n",
    toastMsg: "Proteção Terapêutica"
  }
];

const PEDIATRIC_ADMISSION_ROUTINE_ITEMS: CareItem[] = [
  {
    id: "ped_adm_obs",
    label: "👶 Admissão Observação Infantil",
    text: "ADMISSÃO EM OBSERVAÇÃO PEDIÁTRICA:\n- Criança admitida na ala de observação pediátrica acompanhada pelo responsável [NOME].\n- Ativa, reativa, corada, hidratada, chorosa ao manuseio, porém de fácil consolo.\n- Puncionado AVP com cateter 24G. Orientado familiar sobre a segurança e permanência de grades elevadas.\n",
    toastMsg: "Admissão Obs Infantil"
  },
  {
    id: "ped_adm_emergencia",
    label: "🚨 Admissão Sala Vermelha Pediátrica",
    text: "ADMISSÃO EM SALA VERMELHA PEDIÁTRICA:\n- Paciente pediátrico grave admitido na Sala Vermelha sob suporte do SAMU/Resgate.\n- Apresentando [rebaixamento de consciência / crise convulsiva ativa / insuficiência respiratória grave].\n- Instalada monitorização multiparamétrica e suporte de O2 de alto fluxo. Equipe médica e de enfermagem em atendimento de emergência.\n",
    toastMsg: "Admissão Emergência Pediátrica"
  },
  {
    id: "ped_passagem_plantao",
    label: "📋 Passagem de Plantão Pediátrico",
    text: "PASSAGEM DE PLANTÃO PEDIÁTRICO:\n- Recebo o plantão com paciente pediátrico no leito/berço acompanhado pelo responsável. Calmo, dormindo/brincando.\n- AVP pérvio, sem infiltrações ou sinais inflamatórios. Dieta e hidratação com boa aceitação. Segue sob observação.\n",
    toastMsg: "Plantão Pediátrico"
  }
];

const MEDICAL_PHYSICAL_NEURO_ITEMS: CareItem[] = [
  {
    id: "ef_normal",
    label: "✅ EF Padrão Normal",
    text: "EXAME FÍSICO:\n- BEG, LOTE, acianótico, anictérico, afebril.\n- ACV: RCR em 2T, bulhas normofonéticas, sem sopros.\n- AR: Murmúrio vesicular universalmente audível, sem ruídos adventícios.\n- ABD: Flácido, indolor à palpação, RHA presentes.\n- EXT: Sem edemas, panturrilhas livres.\n",
    toastMsg: "Exame Físico Padrão"
  },
  {
    id: "neuro_gcs15",
    label: "🧠 Neuro / Glasgow 15",
    text: "AVALIAÇÃO NEUROLÓGICA:\n- Lúcido e orientado no tempo e espaço (Glasgow 15).\n- Pupilas isocóricas e fotorreagentes.\n- Força motora grau V globalmente preservada.\n- Sem déficits focais aparentes. Sinais meníngeos ausentes.\n",
    toastMsg: "Neuro/Glasgow"
  }
];

const MEDICAL_SYNDROME_ITEMS: CareItem[] = [
  {
    id: "dor_toracica",
    label: "🫀 Dor Torácica / IAM",
    text: "SÍNDROME CORONARIANA / DOR TORÁCICA:\n- Paciente refere dor precordial [TÍPICA/ATÍPICA], intensidade [ ]/10.\n- ECG de entrada: [SEM SUPRA / COM SUPRA] de segmento ST.\n- Conduta: Protocolo de Dor Torácica. Solicitado marcadores de necrose miocárdica (Troponina). Manter em observação contínua.\n",
    toastMsg: "Protocolo Dor Torácica"
  },
  {
    id: "crise_hipertensiva",
    label: "🩸 Crise Hipertensiva",
    text: "CRISE HIPERTENSIVA:\n- Paciente assintomático, apresentando PA elevada isolada (PA: [ ] mmHg).\n- Nega cefaleia, escotomas, dor torácica ou dispneia.\n- Conduta: Repouso em ambiente calmo. Administrado medicação [ANALGÉSICO/ANSIOLÍTICO/CAPTOPRIL]. Aguardar reavaliação em 1 hora.\n",
    toastMsg: "Crise Hipertensiva"
  },
  {
    id: "dengue_virose",
    label: "🦟 Dengue / Virose",
    text: "SÍNDROME INFECCIOSA / DENGUE:\n- Quadro de mialgia, cefaleia retro-orbital e febre há [ ] dias.\n- Prova do laço: [NEGATIVA / POSITIVA]. Sem sinais de alarme no momento.\n- Conduta: Solicitado Hemograma + Sorologia. Iniciar hidratação venosa/oral e sintomáticos. Notificação compulsória.\n",
    toastMsg: "Síndrome Gripal/Dengue"
  }
];

const MEDICAL_CONDUCT_ITEMS: CareItem[] = [
  {
    id: "solicitar_labs",
    label: "🧪 Solicitar Labs",
    text: "CONDUTA / EXAMES:\n- Solicitado Laboratório (Hemograma, PCR, Ureia, Creatinina, Na, K, Urina I).",
    toastMsg: "Labs"
  },
  {
    id: "solicitar_rx",
    label: "🩻 Solicitar Raio-X",
    text: "CONDUTA / IMAGEM:\n- Solicitado Raio-X de [TÓRAX / ABDÔMEN / MEMBRO]. Aguardo laudo/imagem.",
    toastMsg: "Raio-X"
  },
  {
    id: "solicitar_ecg",
    label: "📈 Solicitar ECG",
    text: "CONDUTA / ECG:\n- Realizado ECG de 12 derivações. Aguardo avaliação do traçado.",
    toastMsg: "ECG"
  }
];

const PEDIATRIC_PHYSICAL_NEURO_ITEMS: CareItem[] = [
  {
    id: "ped_ef_normal",
    label: "✅ EF Padrão Normal",
    text: "EXAME FÍSICO (SEM GRAVIDADE):\n- Criança ativa, reativa, corada e hidratada. Sorridente e interagindo bem com o examinador.\n- Mãe/Responsável nega febre nas últimas 12h.\n- Sem esforço respiratório ou tiragens. Boa aceitação alimentar.\n",
    toastMsg: "Exame Normal"
  },
  {
    id: "ped_tce_leve",
    label: "🤕 Queda / TCE Leve",
    text: "TRAUMA INFANTIL / QUEDA:\n- História de queda da própria altura / cama. TCE leve.\n- Mãe nega vômitos, perda de consciência ou sonolência pós-trauma.\n- Ao exame: presença de hematoma/escoriação em [LOCAL]. Sem sinais de fratura aparente.\n",
    toastMsg: "Trauma Infantil"
  }
];

const PEDIATRIC_SYNDROME_ITEMS: CareItem[] = [
  {
    id: "ped_desconforto",
    label: "🫁 Desconforto Respiratório",
    text: "PEDIATRIA (RESPIRATÓRIO):\n- Sinais de desconforto respiratório: [TIRAGEM SUBCOSTAL / GEMÊNCIA / BATIMENTO DE ASA DE NARIZ]. Taquipneica para a idade.\n- Ausculta com sibilos/roncos difusos e prolongamento de tempo expiratório. Saturação: [ ]%.\n",
    toastMsg: "Resumo Respiratório"
  },
  {
    id: "ped_febre",
    label: "🤒 Síndrome Febril",
    text: "PEDIATRIA (SÍNDROME FEBRIL):\n- Mãe relata febre aferida ([ ] ºC), associada a inapetência e prostração.\n- Ao exame: orofaringe hiperemiada, sem placas purulentas. Otoscopia sem abaulamentos ou hiperemia.\n- Pele sem exantemas patognomônicos. Sinais meníngeos ausentes.\n",
    toastMsg: "Resumo Febril"
  },
  {
    id: "ped_geca",
    label: "🤢 GECA / Desidratação",
    text: "PEDIATRIA (GASTROENTERITE):\n- História de vômitos incoercíveis e diarreia aquosa.\n- Ao exame: criança hipoativa, olhos encovados, mucosa oral seca, choro sem lágrimas, turgor cutâneo pastoso (sinais de desidratação).\n",
    toastMsg: "Resumo GECA"
  },
  {
    id: "ped_alergia",
    label: "🍓 Alergia / Urticária",
    text: "PEDIATRIA (ALERGIA / URTICÁRIA):\n- Apresenta lesões urticariformes pruriginosas difusas. \n- Mãe relata possível ingestão/contato com [ALIMENTO/INSETO/MEDICAMENTO]. \n- Sem edema de glote ou sinais de anafilaxia. Via aérea pérvia.\n",
    toastMsg: "Alergia"
  }
];

const PEDIATRIC_CONDUCT_ITEMS: CareItem[] = [
  {
    id: "ped_sintomaticos",
    label: "💊 Sintomáticos / NBZ",
    text: "CONDUTA / MEDICAÇÃO:\n- Prescrito [ANTITÉRMICO / NBZ DE RESGATE / HIDRATAÇÃO (TRO)].\n- Aguardando medicação e reavaliação clínica na unidade.",
    toastMsg: "Conduta"
  },
  {
    id: "ped_labs",
    label: "🧪 Solicitar Labs",
    text: "CONDUTA / EXAMES:\n- Solicitado Laboratório (Hemograma, PCR, Urina I).",
    toastMsg: "Labs"
  },
  {
    id: "ped_rx",
    label: "🩻 Solicitar Raio-X",
    text: "CONDUTA / IMAGEM:\n- Solicitado Raio-X de [TÓRAX / CRÂNIO / MEMBRO]. Aguardo filme.",
    toastMsg: "RX"
  }
];

// -------------------------------------------------------------
// MULTIDISCIPLINARY ITEMS
// -------------------------------------------------------------

// FISIOTERAPIA
const FISIO_ADULT_ITEMS: CareItem[] = [
  { id: "fisio_aval_resp", label: "🫁 Avaliação Respiratória", text: "AVALIAÇÃO FISIOTERAPÊUTICA (RESPIRATÓRIA):\n- Padrão respiratório: [Eupneico / Taquipneico / Bradipneico / Dispneico]\n- Ausculta pulmonar: [Murmúrio vesicular presente e simétrico, sem RA]\n- Uso de musculatura acessória: [Sim/Não]\n- Saturação de O2: [ ]% em ar ambiente / suporte de O2.\n", toastMsg: "Avaliação Respiratória" },
  { id: "fisio_aval_motora", label: "🦵 Avaliação Motora", text: "AVALIAÇÃO FISIOTERAPÊUTICA (MOTORA):\n- Força muscular (Grau 0-5): [ ]\n- Tônus Muscular: [Normotonia / Hipertonia / Hipotonia]\n- Amplitude de movimento (ADM): [Preservada / Reduzida]\n- Controle de tronco e cervical: [Preservado / Parcial / Ausente]\n", toastMsg: "Avaliação Motora" },
  { id: "fisio_aval_neuro", label: "🧠 Avaliação Neurológica", text: "AVALIAÇÃO FISIOTERAPÊUTICA (NEUROLÓGICA):\n- Nível de consciência (Glasgow): [ ]\n- Pupilometria: [Isocóricas / Anisocóricas / Miose / Midríase]\n- Resposta motora a estímulos: [Preservada / Diminuída / Ausente]\n", toastMsg: "Avaliação Neurológica" },
  { id: "fisio_aval_dor", label: "😖 Avaliação da Dor", text: "AVALIAÇÃO FISIOTERAPÊUTICA (DOR):\n- Escala Visual Analógica (EVA): [0-10]\n- Localização da dor: [ ]\n- Fatores de melhora/piora: [ ]\n", toastMsg: "Avaliação da Dor" },
  { id: "fisio_aval_funcional", label: "🚶 Avaliação Funcional", text: "AVALIAÇÃO FISIOTERAPÊUTICA (FUNCIONAL):\n- Capacidade funcional prévia: [Independente / Parcialmente dependente / Acamado]\n- Risco de Quedas (Escala de Morse): [Baixo / Médio / Alto]\n- Mobilidade no leito: [Independente / Requer auxílio]\n", toastMsg: "Avaliação Funcional" },
  { id: "fisio_aval_sinais_vitais", label: "🫀 Sinais Vitais / Hemodinâmica", text: "AVALIAÇÃO FISIOTERAPÊUTICA:\n- FC: [ ] bpm | PA: [ ] mmHg | SpO2: [ ]% | FR: [ ] irpm.\n- Estabilidade hemodinâmica para terapia: [Sim / Não].\n", toastMsg: "Sinais Vitais" },
  { id: "fisio_aval_tosse", label: "🗣️ Avaliação da Tosse e Secreção", text: "AVALIAÇÃO FISIOTERAPÊUTICA (TOSSE):\n- Eficácia da tosse: [Eficaz / Ineficaz / Úmida / Seca / Ausente].\n- Aspecto da secreção: [Clara / Fluida / Espessa / Purulenta / Hemática].\n- Pico de Fluxo Expiratório (PFE): [ ] L/min.\n", toastMsg: "Avaliação da Tosse" },
  { id: "fisio_aval_vias", label: "👃 Avaliação de Vias Aéreas", text: "AVALIAÇÃO FISIOTERAPÊUTICA:\n- Via aérea: [Pérvia / Sinais de obstrução / Tubo Orotraqueal / Traqueostomia].\n- Pressão de Cuff: [ ] cmH2O.\n", toastMsg: "Vias Aéreas" },
  { id: "fisio_aval_bronco", label: "⚠️ Risco de Broncoaspiração", text: "AVALIAÇÃO FISIOTERAPÊUTICA:\n- Risco de broncoaspiração: [Alto / Baixo].\n- Presença de engasgos e tosse durante alimentação: [Sim / Não].\n", toastMsg: "Risco de Aspiração" },
  { id: "fisio_aval_marcha", label: "🚶 Capacidade de Marcha", text: "AVALIAÇÃO FISIOTERAPÊUTICA:\n- Deambulação: [Independente / Com auxílio de dispositivo / Dependente de terceiros / Não realiza].\n- Padrão de marcha: [Preservado / Claudicante / Atáxico / Espástico].\n", toastMsg: "Capacidade de Marcha" },
  { id: "fisio_aval_forca", label: "💪 Força Muscular Periférica", text: "AVALIAÇÃO FISIOTERAPÊUTICA (MRC):\n- Medical Research Council (MRC): [ ]/60.\n- Indicativo de fraqueza adquirida na UTI/internação: [Sim / Não].\n", toastMsg: "Força Periférica (MRC)" },
  { id: "fisio_aval_toracica", label: "🩻 Avaliação Torácica", text: "AVALIAÇÃO FISIOTERAPÊUTICA:\n- Formato do tórax: [Atípico / Tonel / Pectus].\n- Expansibilidade: [Simétrica / Diminuída / Assimétrica].\n- Sinais de trauma/fratura costal: [Sim / Não].\n", toastMsg: "Avaliação Torácica" }
];
const FISIO_ADULT_PROCEDURES: CareItem[] = [
  { id: "fisio_vni", label: "💨 VNI (CPAP/BIPAP)", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Instalado / Ajustado Ventilação Não Invasiva (VNI). \n- Interface: [Máscara Facial / Oronasal / Total Face]\n- Parâmetros: [IPAP: , EPAP: , FiO2: ]\n- Boa adaptação do paciente, melhora do desconforto e troca gasosa.\n", toastMsg: "VNI" },
  { id: "fisio_vmi", label: "🫁 Manejo VMI", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Ajuste/Manejo de Ventilação Mecânica Invasiva (VMI).\n- Modo Ventilatório: [PCV / VCV / PSV / SIMV]\n- Parâmetros: [Peep: , Pi: , FR: , FiO2: , Volume Corrente: ]\n- Curvas ventilatórias: [Sem escape, sincrônicas]\n", toastMsg: "Manejo VMI" },
  { id: "fisio_aspiracao", label: "💉 Aspiração Traqueal / VAS", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Realizada aspiração traqueal / de vias aéreas superiores.\n- Aspecto da secreção: [Fluida / Espessa / Purulenta / Sanguinolenta]\n- Quantidade: [Pequena / Moderada / Grande]\n- Melhora da ausculta após procedimento.\n", toastMsg: "Aspiração Traqueal" },
  { id: "fisio_ex_resp", label: "🌬️ Exercícios Respiratórios", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Realizado exercícios respiratórios (Padrões ventilatórios, frenolabial).\n- Melhora da expansibilidade torácica e ventilação basal.\n", toastMsg: "Exercícios Respiratórios" },
  { id: "fisio_higiene_bron", label: "🧹 Higiene Brônquica", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Manobras de higiene brônquica (Vibrocompressão, Tapotagem, ELTGOL).\n- Tosse assistida/estimulada. Eficaz para mobilização de secreções periféricas.\n", toastMsg: "Higiene Brônquica" },
  { id: "fisio_mob", label: "🚶 Mobilização Precoce", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Realizada mobilização precoce no leito (Passiva / Ativo-Assistida / Ativa).\n- Sinais vitais mantidos estáveis durante a terapia.\n", toastMsg: "Mobilização Precoce" },
  { id: "fisio_o2", label: "💧 Ajuste de O2", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Ajuste/Desmame de oxigenoterapia (Cateter Nasal, Máscara de Venturi, Máscara com Reservatório).\n- Saturação alvo atingida. Paciente mantendo SpO2 > [ ]%.\n", toastMsg: "Ajuste de O2" },
  { id: "fisio_cinesio", label: "💪 Cinesioterapia Motora", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Cinesioterapia motora global.\n- Exercícios isométricos e isotônicos para MMSS e MMII.\n- Prevenção de atrofia muscular e complicações do imobilismo.\n", toastMsg: "Cinesioterapia" },
  { id: "fisio_posicionamento", label: "🛏️ Posicionamento Terapêutico", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Orientação e realização de mudança de decúbito e posicionamento no leito.\n- Elevação de cabeceira (30-45º) para prevenção de PAV.\n", toastMsg: "Posicionamento" },
  { id: "fisio_extubacao", label: "🌬️ Suporte em Extubação", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Participação na extubação orotraqueal em conjunto com equipe médica.\n- Aplicação de VNI preventiva / O2 suplementar pós-extubação.\n- Avaliado risco de estridor laríngeo.\n", toastMsg: "Extubação" },
  { id: "fisio_marcha", label: "🚶‍♂️ Treino de Marcha", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Treino de marcha em corredor/quarto com auxílio de [Andador / Muletas / Apoio do terapeuta].\n- Monitoramento contínuo de sinais vitais.\n", toastMsg: "Treino de Marcha" },
  { id: "fisio_sedestacao", label: "🪑 Treino de Sedestação", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Posicionamento em sedestação à beira leito / poltrona.\n- Ganho de controle de tronco e desmame de leito.\n", toastMsg: "Treino de Sedestação" },
  { id: "fisio_expansao", label: "🎈 Terapia de Expansão Pulmonar", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Utilizados recursos de expansão pulmonar (EPAP, RPPI).\n- Aumento de volumes pulmonares e reversão de atelectasias.\n", toastMsg: "Expansão Pulmonar" },
  { id: "fisio_incentivador", label: "🌬️ Incentivador Respiratório", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Treino e orientação do uso de incentivador inspiratório a volume/fluxo (Voldyne, Respiron).\n- Paciente realizou [ ] séries com meta de [ ] ml/L.\n", toastMsg: "Incentivador Respiratório" }
];
const FISIO_PED_ITEMS: CareItem[] = [
  { id: "fisio_ped_aval", label: "👶 Aval. Resp. Pediátrica", text: "AVALIAÇÃO FISIOTERAPÊUTICA (PEDIÁTRICA):\n- Sinais de esforço respiratório: [Tiragens intercostais / subcostais / fúrcula / gemência / batimento asa de nariz]\n- Boletim de Silverman-Andersen (BSA): [ ]\n- Ausculta: [MV + com roncos / sibilos / crepitações]\n", toastMsg: "Aval. Pediátrica" },
  { id: "fisio_ped_motora", label: "🍼 Aval. Motora Pediátrica", text: "AVALIAÇÃO FISIOTERAPÊUTICA (PEDIÁTRICA):\n- Avaliação de marcos do desenvolvimento motor.\n- Tônus e reflexos primitivos.\n- Posição preferencial no berço/colo.\n", toastMsg: "Aval. Motora Ped" },
  { id: "fisio_ped_tosse", label: "🗣️ Avaliação de Tosse (Ped)", text: "AVALIAÇÃO FISIOTERAPÊUTICA (PEDIÁTRICA):\n- Capacidade e eficácia da tosse na criança: [Presente / Ausente / Fraca / Úmida].\n- Sinais de engasgo com saliva ou dieta.\n", toastMsg: "Tosse Pediátrica" },
  { id: "fisio_ped_sono", label: "😴 Padrão de Sono e Respiração", text: "AVALIAÇÃO FISIOTERAPÊUTICA (PEDIÁTRICA):\n- Avaliação de apneias durante o sono, roncos e respiração bucal.\n- Saturação de O2 durante o sono: [ ]%.\n", toastMsg: "Sono e Respiração" },
  { id: "fisio_ped_vitais", label: "🫀 Sinais Vitais Pediátricos", text: "AVALIAÇÃO FISIOTERAPÊUTICA (PEDIÁTRICA):\n- FC e FR de acordo com a faixa etária: [Adequados / Taquicardia / Taquipneia].\n- Saturação alvo: [ ]%.\n", toastMsg: "Sinais Vitais Ped" }
];
const FISIO_PED_PROCEDURES: CareItem[] = [
  { id: "fisio_ped_aspiracao", label: "🌬️ Aspiração de VAS Pediátrica", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Realizada aspiração de Vias Aéreas Superiores (VAS).\n- Retorno de secreção [ ] em quantidade [ ].\n- Melhora da permeabilidade das vias aéreas e padrão respiratório.\n", toastMsg: "Aspiração VAS" },
  { id: "fisio_ped_desobstrucao", label: "👃 Desobstrução Rinofaríngea", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Realizada desobstrução rinofaríngea / Lavagem Nasal com SF 0.9%.\n- Remoção de rolhas de secreção.\n- Criança mais calma, redução do esforço e aceitando melhor dieta.\n", toastMsg: "Desobstrução" },
  { id: "fisio_ped_ludico", label: "🎈 Terapia Respiratória Lúdica", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Terapia de higiene brônquica/expansão pulmonar utilizando recursos lúdicos (bolhas de sabão, língua de sogra, cata-vento).\n- Excelente engajamento da criança na terapia.\n", toastMsg: "Exercício Lúdico" },
  { id: "fisio_ped_cinesio", label: "🪀 Cinesioterapia Pediátrica", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Cinesioterapia motora global adaptada para idade.\n- Estimulação sensório-motora e orientações de posicionamento para familiares.\n", toastMsg: "Cinesio Pediátrica" },
  { id: "fisio_ped_cpap", label: "💨 CPAP Pediátrico / VNI", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Suporte ventilatório não invasivo pediátrico instalado/ajustado (CPAP / VNI / CNAF).\n- Interface de tamanho adequado.\n- Parâmetros: [ ]\n- Reversão de hipoxemia/hipercapnia.\n", toastMsg: "VNI Pediátrica" },
  { id: "fisio_ped_higiene", label: "🧹 Higiene Brônquica (Ped)", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Manobras desobstrutivas adaptadas à pediatria (Vibração manual, Aceleração de fluxo).\n- Tosse provocada se necessário.\n", toastMsg: "Higiene Brônquica Ped" },
  { id: "fisio_ped_o2", label: "💧 Oxigenoterapia Pediátrica", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Ajuste de O2 por [Cateter Nasal / Máscara de Venturi / Tenda / Hood].\n- Saturação mantida em níveis seguros.\n", toastMsg: "O2 Pediátrico" },
  { id: "fisio_ped_orienta", label: "👨‍👩‍👦 Orientações aos Pais", text: "PROCEDIMENTO FISIOTERAPÊUTICO:\n- Orientação aos cuidadores sobre lavagem nasal domiciliar e posicionamento antirrefluxo/anti-aspiração.\n", toastMsg: "Orientações Pais" }
];

// NUTRIÇÃO
const NUTRI_ADULT_ITEMS: CareItem[] = [
  { id: "nutri_aval_triagem", label: "📋 Triagem Nutricional", text: "AVALIAÇÃO NUTRICIONAL:\n- Triagem de Risco Nutricional (NRS-2002 / MUST): [Baixo / Moderado / Alto Risco].\n- Perda de peso recente: [Não / Sim, X kg em X meses].\n- Ingestão alimentar: [Normal / Reduzida].\n", toastMsg: "Triagem Nutricional" },
  { id: "nutri_aval_antro", label: "⚖️ Aval. Antropométrica", text: "AVALIAÇÃO NUTRICIONAL:\n- Peso: [ ] kg | Estatura estimada: [ ] cm | IMC: [ ] kg/m².\n- Classificação IMC: [Baixo peso / Eutrofia / Sobrepeso / Obesidade].\n- Circunferência da panturrilha/braço: [ ] cm.\n", toastMsg: "Antropometria" },
  { id: "nutri_aval_clinica", label: "🩺 Avaliação Clínica", text: "AVALIAÇÃO NUTRICIONAL:\n- Trato Gastrointestinal: [RHA presentes / Náuseas / Vômitos / Diarreia / Constipação].\n- Dentrição: [Preservada / Ausente / Uso de prótese].\n- Sinais de deficiência de micronutrientes: [Ausentes / Presentes: ].\n", toastMsg: "Avaliação Clínica" },
  { id: "nutri_aval_habitos", label: "🍏 Hábitos e Preferências", text: "AVALIAÇÃO NUTRICIONAL:\n- Recordatório alimentar: [ ]\n- Intolerâncias ou alergias alimentares: [Não / Sim: ]\n- Preferências ou aversões: [ ]\n", toastMsg: "Hábitos Alimentares" },
  { id: "nutri_aval_disfagia", label: "🗣️ Risco de Disfagia", text: "AVALIAÇÃO NUTRICIONAL:\n- Presença de tosse, engasgo ou dificuldade na deglutição durante alimentação.\n- Necessidade de avaliação conjunta com Fonoaudiologia: [Sim / Não].\n", toastMsg: "Risco de Disfagia" },
  { id: "nutri_aval_hidrata", label: "💧 Estado de Hidratação", text: "AVALIAÇÃO NUTRICIONAL:\n- Ingestão hídrica relatada: [ ] ml/dia.\n- Sinais clínicos de desidratação ou hipervolemia: [Edema / Mucosas secas / Turgor pele alterado].\n", toastMsg: "Hidratação" },
  { id: "nutri_aval_metabolico", label: "🩸 Perfil Glicêmico/Metabólico", text: "AVALIAÇÃO NUTRICIONAL:\n- Glicemia capilar média / Jejum: [ ] mg/dL.\n- Necessidade de controle de carboidratos ou restrições de macronutrientes: [Sim / Não].\n", toastMsg: "Perfil Metabólico" },
  { id: "nutri_aval_aceitacao", label: "🍽️ Aceitação da Dieta", text: "AVALIAÇÃO NUTRICIONAL:\n- Aceitação da dieta hospitalar: [Boa (>75%) / Regular (50-75%) / Ruim (<50%) / Recusa total].\n- Motivo da recusa: [Inapetência / Náuseas / Aversão ao cardápio].\n", toastMsg: "Aceitação Dieta" }
];
const NUTRI_ADULT_PROCEDURES: CareItem[] = [
  { id: "nutri_dieta_oral", label: "🍽️ Prescrição Dieta Oral", text: "CONDUTA NUTRICIONAL:\n- Liberada / Progredida dieta ORAL.\n- Consistência: [Líquida / Pastosa / Branda / Geral].\n- Modificações: [Hipossódica / Diabética / Hipogordurosa / Laxativa].\n- Frequência: [ ] fracionamentos/dia.\n", toastMsg: "Dieta Oral" },
  { id: "nutri_sne", label: "💧 Terapia Nutricional Enteral (TNE)", text: "CONDUTA NUTRICIONAL:\n- Indicada Terapia Nutricional Enteral (Via SNE / SNG / Gastrostomia).\n- Fórmula: [Polimérica padrão / Especializada / Hiperproteica / Hipercalórica].\n- Volume: [ ] ml/dia | Vazão: [ ] ml/h.\n- Bomba de infusão: [Contínua / Intermitente / Gravitacional].\n", toastMsg: "Terapia Enteral" },
  { id: "nutri_suplemento", label: "🥤 Suplementação Oral", text: "CONDUTA NUTRICIONAL:\n- Prescrição de Suplemento Alimentar Oral (SAO).\n- Tipo: [Hiperproteico / Hipercalórico / Módulo de Proteína].\n- Posologia: [ ] vezes ao dia.\n", toastMsg: "Suplementação" },
  { id: "nutri_jejum", label: "⏳ Jejum / NPO", text: "CONDUTA NUTRICIONAL:\n- Paciente mantido em Jejum / Nada Por Via Oral (NPO) devido a: [Preparo de exame / Rebaixamento de nível de consciência / Risco de broncoaspiração / Quadro cirúrgico].\n", toastMsg: "Jejum/NPO" },
  { id: "nutri_npt", label: "🩸 Nutrição Parenteral (NPT)", text: "CONDUTA NUTRICIONAL:\n- Indicação/Acompanhamento de Nutrição Parenteral Total/Periférica (NPT/NPP).\n- Calorias diárias: [ ] kcal | Proteínas: [ ] g/dia.\n- Acompanhamento laboratorial e glicêmico.\n", toastMsg: "Nutrição Parenteral" },
  { id: "nutri_educacao", label: "🗣️ Orientação de Alta / Educação", text: "CONDUTA NUTRICIONAL:\n- Realizada educação nutricional junto ao paciente/familiar à beira leito.\n- Orientação de alta estruturada entregue.\n- Plano alimentar para seguimento ambulatorial/domiciliar.\n", toastMsg: "Orientação de Alta" },
  { id: "nutri_restricao", label: "🚫 Restrição Hídrica/Sódica", text: "CONDUTA NUTRICIONAL:\n- Prescrita restrição hídrica severa / moderada ([ ] ml/dia).\n- Orientação para redução drástica de sódio (ICC, DRC, Hepatopatias).\n", toastMsg: "Restrição Hídrica" },
  { id: "nutri_ajuste_consistencia", label: "🥣 Ajuste de Consistência", text: "CONDUTA NUTRICIONAL:\n- Adequada consistência da dieta (Ex: de livre para pastosa/purê) devido a perda de dentição / cansaço mastigatório / risco de engasgo.\n", toastMsg: "Ajuste de Consistência" },
  { id: "nutri_transicao_oral", label: "🔄 Transição TNE para VO", text: "CONDUTA NUTRICIONAL:\n- Iniciada transição da dieta por sonda (TNE) para via oral (VO).\n- TNE reduzida em [ ]% e iniciada aceitação fracionada por VO.\n", toastMsg: "Transição de Dieta" },
  { id: "nutri_diabetica", label: "📉 Terapia para Diabéticos", text: "CONDUTA NUTRICIONAL:\n- Prescrição de dieta padrão para DM (sem adição de sacarose, controle de CHO).\n- Oferta de ceia tardia para evitar hipoglicemia noturna.\n", toastMsg: "Dieta para DM" }
];
const NUTRI_PED_ITEMS: CareItem[] = [
  { id: "nutri_ped_antro", label: "⚖️ Aval. Antropométrica Ped", text: "AVALIAÇÃO NUTRICIONAL (PEDIÁTRICA):\n- Peso atual: [ ] kg | Estatura/Comprimento: [ ] cm | Perímetro Cefálico: [ ] cm.\n- Peso de nascimento: [ ] kg.\n- Curvas OMS: Peso/Idade [ ] | Estatura/Idade [ ] | IMC/Idade [ ].\n- Diagnóstico Nutricional: [Eutrofia / Risco Nutricional / Desnutrição / Sobrepeso].\n", toastMsg: "Antropometria Pediátrica" },
  { id: "nutri_ped_amamentacao", label: "🤱 Avaliação do Aleitamento", text: "AVALIAÇÃO NUTRICIONAL (PEDIÁTRICA):\n- Aleitamento: [Materno Exclusivo / Misto / Artificial].\n- Frequência e duração das mamadas: [ ]\n- Dificuldades relatadas pela mãe: [Nenhuma / Pega Incorreta / Fissura / Baixa Produção].\n", toastMsg: "Aval. Aleitamento" },
  { id: "nutri_ped_habitos", label: "🥕 Hábitos e Introdução Alimentar", text: "AVALIAÇÃO NUTRICIONAL (PEDIÁTRICA):\n- Fase de introdução alimentar: [Adequada / Inadequada].\n- Consistência aceita: [ ]\n- Aversões / Seletividade alimentar: [ ]\n", toastMsg: "Hábitos Pediátricos" },
  { id: "nutri_ped_aceitacao", label: "🍽️ Aceitação da Dieta (Ped)", text: "AVALIAÇÃO NUTRICIONAL (PEDIÁTRICA):\n- Aceitação da dieta hospitalar: [Boa / Parcial / Recusa].\n- Preferência por líquidos/doces. Intolerância alimentar suspeitada.\n", toastMsg: "Aceitação Dieta Ped" },
  { id: "nutri_ped_intolerancia", label: "🚫 APLV / Intolerâncias", text: "AVALIAÇÃO NUTRICIONAL (PEDIÁTRICA):\n- Suspeita ou diagnóstico de Alergia à Proteína do Leite de Vaca (APLV) ou intolerância à lactose.\n- Necessidade de fórmula especializada.\n", toastMsg: "APLV / Intolerância" }
];
const NUTRI_PED_PROCEDURES: CareItem[] = [
  { id: "nutri_ped_formula", label: "🍼 Ajuste de Fórmula Infantil", text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Prescrição / Ajuste de Fórmula Infantil [Partida / Seguimento / Especial].\n- Diluição recomendada: [1 medida para 30ml de água].\n- Volume ofertado: [ ]ml a cada [ ]h.\n", toastMsg: "Fórmula Infantil" },
  { id: "nutri_ped_aleitamento", label: "🤱 Incentivo ao Aleitamento", text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Orientação à mãe quanto à técnica de amamentação (pega, posicionamento).\n- Incentivo ao Aleitamento Materno Exclusivo (AME) até os 6 meses e complementar até 2 anos ou mais.\n- Ordenha e armazenamento de leite materno (se aplicável).\n", toastMsg: "Aleitamento Materno" },
  { id: "nutri_ped_dieta", label: "🥣 Dieta Branda / Pastosa Pediátrica", text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Liberação de dieta via oral adaptada para a idade (consistência pastosa/branda/livre).\n- Fracionamento e oferta hídrica adequados para a faixa etária.\n", toastMsg: "Dieta Pediátrica" },
  { id: "nutri_ped_educa", label: "🗣️ Educação Nutricional Pais", text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Orientação nutricional de alta para os pais/responsáveis.\n- Educação sobre introdução alimentar complementar segura (texturas, alimentos permitidos, prevenção de engasgo).\n- Orientações sobre restrição de açúcar e ultraprocessados.\n", toastMsg: "Educação aos Pais" },
  { id: "nutri_ped_tne", label: "💧 Terapia Enteral Pediátrica", text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Indicada passagem de sonda (SNG/SNE) para alimentação devido à recusa alimentar severa/baixo ganho de peso.\n- Fórmula pediátrica iniciada a [ ] ml/h.\n", toastMsg: "TNE Pediátrica" },
  { id: "nutri_ped_suplemento", label: "🥤 Suplementação Infantil", text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Introduzido suplemento oral pediátrico para recuperação do estado nutricional.\n- Volume: [ ] ml, [ ] vezes ao dia.\n", toastMsg: "Suplementação Pediátrica" },
  { id: "nutri_ped_sro", label: "💧 Hidratação Oral (SRO)", text: "CONDUTA NUTRICIONAL (PEDIÁTRICA):\n- Prescrição de Terapia de Reidratação Oral (TRO) com soro de reidratação oral.\n- Orientações aos pais sobre hidratação em quadros de diarreia/vômitos.\n", toastMsg: "Hidratação Oral" }
];

// PSICOLOGIA
const PSICO_ADULT_ITEMS: CareItem[] = [
  { id: "psico_acolhimento", label: "💬 Acolhimento e Escuta", text: "AVALIAÇÃO PSICOLÓGICA:\n- Realizado acolhimento e escuta qualificada à beira leito.\n- Motivo do atendimento: [Demanda espontânea / Solicitação médica / Solicitação da equipe].\n- Queixa principal emocional: [ ]\n", toastMsg: "Acolhimento" },
  { id: "psico_estado_mental", label: "🧠 Exame do Estado Mental", text: "AVALIAÇÃO PSICOLÓGICA:\n- Nível de Consciência: [Lúcido / Obnubilado].\n- Atenção e Memória: [Preservadas / Prejudicadas].\n- Orientação (Alopsíquica e Autopsíquica): [Orientado / Desorientado].\n- Pensamento (Curso e Conteúdo): [Lógico, coerente / Delirante, desagregado].\n- Afeto e Humor: [Eutímico / Deprimido / Ansioso / Lábil / Embotado].\n", toastMsg: "Estado Mental" },
  { id: "psico_reacoes", label: "🎭 Reações ao Adoecimento", text: "AVALIAÇÃO PSICOLÓGICA:\n- Percepção do paciente sobre o próprio diagnóstico e prognóstico: [Adequada / Negada / Distorcida].\n- Reações emocionais observadas: [Medo / Angústia / Agressividade / Resignação / Esperança].\n- Risco de auto/heteroagressão: [Ausente / Presente].\n", toastMsg: "Reações Adoecimento" },
  { id: "psico_ansiedade", label: "😰 Avaliação de Ansiedade", text: "AVALIAÇÃO PSICOLÓGICA:\n- Nível de ansiedade identificado: [Leve / Moderado / Grave / Pânico].\n- Sintomas somáticos associados: [Palpitações / Dispneia psicogênica / Tremores].\n", toastMsg: "Avaliação Ansiedade" },
  { id: "psico_suicidio", label: "⚠️ Risco Suicida / Autolesão", text: "AVALIAÇÃO PSICOLÓGICA:\n- Avaliação de ideação, planejamento ou tentativa de suicídio: [Ideação passiva / Planejamento estruturado / Tentativa recente].\n- Fatores de risco e proteção levantados.\n- Paciente em protocolo de vigilância contínua.\n", toastMsg: "Risco Suicida" },
  { id: "psico_dinamica", label: "👨‍👩‍👧 Dinâmica Familiar", text: "AVALIAÇÃO PSICOLÓGICA:\n- Compreensão da dinâmica e rede de suporte afetivo.\n- Presença de conflitos ou desgaste do cuidador principal.\n", toastMsg: "Dinâmica Familiar" },
  { id: "psico_historico", label: "📝 Histórico Psiquiátrico", text: "AVALIAÇÃO PSICOLÓGICA:\n- Antecedentes psiquiátricos: [Depressão / TAB / Esquizofrenia / T. Ansiedade].\n- Uso regular de psicofármacos: [ ]. Adesão ao tratamento: [Sim / Não].\n", toastMsg: "Histórico Psiquiátrico" },
  { id: "psico_compreensao", label: "🗣️ Capacidade de Decisão", text: "AVALIAÇÃO PSICOLÓGICA:\n- Avaliação da capacidade cognitiva e emocional para tomada de decisões sobre o próprio tratamento (Termos de consentimento/recusa).\n", toastMsg: "Capacidade Decisão" }
];
const PSICO_ADULT_PROCEDURES: CareItem[] = [
  { id: "psico_crise", label: "😰 Intervenção em Crise", text: "CONDUTA PSICOLÓGICA:\n- Manejo e intervenção em crise (ansiedade aguda, pânico, agitação psicomotora).\n- Utilizadas técnicas de relaxamento, ancoragem (grounding) e respiração diafragmática.\n- Diminuição da sintomatologia emocional após intervenção.\n", toastMsg: "Intervenção Crise" },
  { id: "psico_luto", label: "🖤 Suporte em Luto / Terminalidade", text: "CONDUTA PSICOLÓGICA:\n- Acompanhamento da equipe médica na comunicação de más notícias (Spikes).\n- Suporte emocional aos familiares em processo de luto agudo / terminalidade.\n- Facilitação de despedidas e fechamento de ciclos.\n", toastMsg: "Suporte Luto" },
  { id: "psico_psicoeduca", label: "🧠 Psicoeducação", text: "CONDUTA PSICOLÓGICA:\n- Psicoeducação do paciente e familiares sobre o quadro clínico atual, procedimentos hospitalares e rotina da UPA.\n- Fomento à adesão ao tratamento e desmistificação de medos irreais.\n", toastMsg: "Psicoeducação" },
  { id: "psico_rede", label: "🤝 Articulação de Rede (RAPS)", text: "CONDUTA PSICOLÓGICA:\n- Articulação com a rede de atenção psicossocial (RAPS) para seguimento ambulatorial (CAPS, UBS).\n- Contato com familiares para fortalecimento da rede de apoio emocional.\n", toastMsg: "Articulação RAPS" },
  { id: "psico_familiar", label: "👨‍👩‍👧 Suporte Familiar", text: "CONDUTA PSICOLÓGICA:\n- Atendimento/mediação de conflitos familiares no contexto hospitalar.\n- Orientações à família sobre como manejar alterações comportamentais do paciente.\n", toastMsg: "Suporte Familiar" },
  { id: "psico_equipe", label: "🩺 Suporte à Equipe", text: "CONDUTA PSICOLÓGICA:\n- Discussão de caso com equipe multiprofissional.\n- Suporte emocional à equipe assistencial em situação de alto estresse e desgaste.\n", toastMsg: "Suporte Equipe" },
  { id: "psico_preparo", label: "💉 Preparo para Procedimentos Invasivos", text: "CONDUTA PSICOLÓGICA:\n- Acompanhamento e preparo psicológico antes de procedimentos invasivos (intubação consciente, drenagem, acessos difíceis).\n", toastMsg: "Preparo Procedimento" },
  { id: "psico_mediacao", label: "⚖️ Mediação de Conflitos", text: "CONDUTA PSICOLÓGICA:\n- Mediação de conflito de comunicação entre a equipe médica e os familiares do paciente, restabelecendo a confiança e clareza da informação.\n", toastMsg: "Mediação Conflitos" },
  { id: "psico_relaxamento", label: "🧘 Técnicas de Relaxamento", text: "CONDUTA PSICOLÓGICA:\n- Aplicação de técnicas de relaxamento muscular progressivo e visualização guiada para alívio de dor psicogênica/ansiedade.\n", toastMsg: "Relaxamento" },
  { id: "psico_alta", label: "🚪 Encaminhamento / Alta", text: "CONDUTA PSICOLÓGICA:\n- Entregue formulário de encaminhamento psicológico para rede básica / clínica escola para continuidade da psicoterapia.\n", toastMsg: "Alta/Encaminhamento" }
];
const PSICO_PED_ITEMS: CareItem[] = [
  { id: "psico_ped_ludico", label: "🧸 Acolhimento Lúdico", text: "AVALIAÇÃO PSICOLÓGICA (PEDIÁTRICA):\n- Acolhimento da criança por meio de recursos lúdicos (brinquedo, desenho, estórias).\n- Criança demonstrou [medo / curiosidade / choro / esquiva / colaboração] durante o contato.\n", toastMsg: "Acolhimento Lúdico" },
  { id: "psico_ped_desenvolvimento", label: "🧩 Avaliação do Comportamento", text: "AVALIAÇÃO PSICOLÓGICA (PEDIÁTRICA):\n- Avaliação do comportamento da criança frente à hospitalização.\n- Sinais de regressão comportamental (ex: enurese, fala infantilizada): [Sim / Não].\n- Vinculação com o acompanhante principal: [Seguro / Ansioso / Evitante].\n", toastMsg: "Avaliação Comportamento" },
  { id: "psico_ped_medos", label: "👻 Medos e Fobias", text: "AVALIAÇÃO PSICOLÓGICA (PEDIÁTRICA):\n- Identificados medos exacerbados / fobia de agulhas e procedimentos de enfermagem.\n- Ansiedade antecipatória evidente.\n", toastMsg: "Avaliação de Medos" },
  { id: "psico_ped_compreensao", label: "💡 Nível de Compreensão", text: "AVALIAÇÃO PSICOLÓGICA (PEDIÁTRICA):\n- Criança compreende o motivo da internação de acordo com sua fase de desenvolvimento cognitivo.\n- Fantasias de punição ou culpa pela doença desmistificadas.\n", toastMsg: "Compreensão da Doença" },
  { id: "psico_ped_interacao", label: "👥 Interação com Equipe", text: "AVALIAÇÃO PSICOLÓGICA (PEDIÁTRICA):\n- Resposta da criança aos profissionais de saúde: [Colaborativa / Resistente / Apática / Hostil].\n", toastMsg: "Interação com Equipe" }
];
const PSICO_PED_PROCEDURES: CareItem[] = [
  { id: "psico_ped_prep", label: "💉 Preparo para Procedimentos", text: "CONDUTA PSICOLÓGICA (PEDIÁTRICA):\n- Preparo psicológico para procedimento invasivo (punção venosa, curativos, exames) usando ludoterapia.\n- Dessensibilização e distração cognitiva durante o procedimento médico/enfermagem.\n- Criança tolerou bem, redução visível do estresse.\n", toastMsg: "Preparo Procedimento" },
  { id: "psico_ped_agita", label: "😭 Manejo de Agitação Infantil", text: "CONDUTA PSICOLÓGICA (PEDIÁTRICA):\n- Intervenção comportamental para manejo do choro intenso/agitação/birra na unidade.\n- Regulação emocional conjunta com o cuidador.\n", toastMsg: "Manejo Agitação" },
  { id: "psico_ped_pais", label: "👨‍👩‍👧 Suporte aos Pais", text: "CONDUTA PSICOLÓGICA (PEDIÁTRICA):\n- Escuta qualificada e suporte emocional aos pais/responsáveis frente ao adoecimento agudo do filho.\n- Redução do nível de ansiedade familiar, promovendo ambiente mais calmo para a criança.\n- Psicoeducação sobre não transmitir medo ou punir a criança no ambiente hospitalar.\n", toastMsg: "Suporte aos Pais" },
  { id: "psico_ped_brincar", label: "🪀 Terapia pelo Brincar", text: "CONDUTA PSICOLÓGICA (PEDIÁTRICA):\n- Utilização de técnicas de ludoterapia breve para auxiliar na elaboração simbólica do trauma hospitalar e expressão de sentimentos.\n", toastMsg: "Ludoterapia" },
  { id: "psico_ped_luto", label: "🖤 Luto Pediátrico", text: "CONDUTA PSICOLÓGICA (PEDIÁTRICA):\n- Acolhimento intensivo aos pais em situação de luto ou iminência de morte pediátrica.\n- Facilitação de despedidas, suporte para a criação de memórias e contato com a criança.\n", toastMsg: "Luto Pediátrico" },
  { id: "psico_ped_alta", label: "🏠 Orientações de Alta Psicológica", text: "CONDUTA PSICOLÓGICA (PEDIÁTRICA):\n- Orientações de alta para os cuidadores sobre como lidar com possíveis alterações de sono/comportamento nos dias seguintes à internação.\n", toastMsg: "Orientações de Alta" }
];

// SERVIÇO SOCIAL
const SOCIAL_ADULT_ITEMS: CareItem[] = [
  { id: "social_entrevista", label: "📋 Entrevista Social", text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Realizada entrevista social com o paciente/familiar.\n- Condições de moradia: [Própria / Alugada / Cedida / Situação de Rua / Inadequada].\n- Situação previdenciária e de renda: [Ativo / Aposentado / BPC / Desempregado / Sem renda].\n", toastMsg: "Entrevista Social" },
  { id: "social_rede", label: "🤝 Avaliação de Rede de Apoio", text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Identificada rede de apoio familiar e comunitária: [Presente e protetiva / Frágil / Ausente / Conflituosa].\n- Cuidador principal identificado: [Nome, Grau de Parentesco].\n", toastMsg: "Rede de Apoio" },
  { id: "social_violencia", label: "⚠️ Suspeita de Violência / Negligência", text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Identificados possíveis sinais de [Violência física / Psicológica / Patrimonial / Negligência / Abandono].\n- Vítima: [Idoso / Mulher / Pessoa com deficiência].\n- Necessidade de medidas protetivas urgentes.\n", toastMsg: "Suspeita de Violência" },
  { id: "social_alta_complexa", label: "🏥 Risco Social para Alta", text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Identificados fatores de risco social que dificultam a alta médica segura.\n- Paciente sem condições domiciliares para continuidade do cuidado (ex: necessidade de O2, acamado sem cuidador).\n", toastMsg: "Risco para Alta" },
  { id: "social_drogadicao", label: "💊 Dependência Química", text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Histórico de dependência química (álcool e/ou outras drogas).\n- Situação atual de vulnerabilidade ligada ao uso. Necessidade de articulação com CAPS-AD.\n", toastMsg: "Dependência Química" },
  { id: "social_rua", label: "🛣️ Situação de Rua", text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Paciente em situação de rua identificada.\n- Acolhido no sistema e verificação de vínculos com abrigos/Centros Pop.\n", toastMsg: "Situação de Rua" },
  { id: "social_doc", label: "🪪 Avaliação de Documentação", text: "AVALIAÇÃO SERVIÇO SOCIAL:\n- Paciente internado sem identificação (Desconhecido) ou sem documentação civil básica.\n- Necessidade de averiguação papiloscópica/contato com serviço social externo.\n", toastMsg: "Falta de Documentação" }
];
const SOCIAL_ADULT_PROCEDURES: CareItem[] = [
  { id: "social_busca", label: "🔍 Busca Ativa Familiar", text: "CONDUTA SERVIÇO SOCIAL:\n- Realizada busca ativa de familiares/contatos de emergência (via telefone ou sistema, contato com UBS).\n- Sucesso no contato: [Sim/Não]. Familiares informados da internação.\n", toastMsg: "Busca Ativa" },
  { id: "social_cras", label: "🏢 Articulação e Encaminhamentos", text: "CONDUTA SERVIÇO SOCIAL:\n- Realizado contato e encaminhamento do caso para a rede socioassistencial e de saúde (CRAS / CREAS / UBS / CAPS / SAD).\n- Agendamento de visita domiciliar ou retorno programado garantido.\n", toastMsg: "Encaminhamentos Rede" },
  { id: "social_direitos", label: "📜 Orientação de Direitos Sociais", text: "CONDUTA SERVIÇO SOCIAL:\n- Prestadas orientações ao paciente/família sobre garantia de direitos (BPC, Auxílio Doença, isenções, DPVAT).\n- Entregues formulários ou orientados os fluxos de acesso à previdência/assistência.\n", toastMsg: "Direitos Sociais" },
  { id: "social_notificacao", label: "📄 Notificação Compulsória (SINAN)", text: "CONDUTA SERVIÇO SOCIAL:\n- Acionados órgãos de proteção e garantia de direitos: [Delegacia do Idoso / Delegacia da Mulher / Ministério Público].\n- Preenchida ficha de notificação compulsória (SINAN) por suspeita/confirmação de violência.\n", toastMsg: "Notificação SINAN" },
  { id: "social_alta_segura", label: "🚑 Planejamento de Alta Segura", text: "CONDUTA SERVIÇO SOCIAL:\n- Planejamento de alta em conjunto com a equipe multiprofissional.\n- Acionado serviço de transporte (Ambulância / SAMU) devido à incapacidade de locomoção e falta de recursos da família.\n- Garantida a provisão de insumos mínimos (oxigênio, dieta) via secretaria de saúde.\n", toastMsg: "Alta Segura" },
  { id: "social_obito", label: "✝️ Orientações de Óbito e Funeral", text: "CONDUTA SERVIÇO SOCIAL:\n- Acolhimento da família pós-óbito.\n- Orientações sobre trâmites funerários, serviço de verificação de óbito (SVO) / IML e benefícios eventuais (auxílio funeral municipal).\n", toastMsg: "Orientações de Óbito" },
  { id: "social_abrigo", label: "🏠 Acionamento de Abrigo", text: "CONDUTA SERVIÇO SOCIAL:\n- Articulação de vaga em instituição de longa permanência (ILPI) ou abrigo municipal para paciente com alta médica mas sem suporte social.\n", toastMsg: "Vaga Social" },
  { id: "social_inss", label: "💼 Contato Empregador/INSS", text: "CONDUTA SERVIÇO SOCIAL:\n- Fornecida declaração de internação e orientações para entrada em benefício por incapacidade temporária (INSS) junto à empresa do paciente.\n", toastMsg: "Orientações INSS" }
];
const SOCIAL_PED_ITEMS: CareItem[] = [
  { id: "social_ped_contexto", label: "👨‍👩‍👦 Contexto Familiar e Cuidados", text: "AVALIAÇÃO SERVIÇO SOCIAL (PEDIÁTRICA):\n- Entrevista com o responsável legal (Mãe/Pai/Tutor) para avaliação do contexto de proteção e cuidados da criança.\n- Condição de vacinação, acompanhamento escolar e de saúde (puericultura): [Adequados / Atrasados / Negligenciados].\n", toastMsg: "Contexto Familiar Ped" },
  { id: "social_ped_vulnera", label: "⚠️ Avaliação de Vulnerabilidade", text: "AVALIAÇÃO SERVIÇO SOCIAL (PEDIÁTRICA):\n- Sinais de vulnerabilidade social grave ou violação de direitos da criança/adolescente identificados.\n- Suspeita de violência [Física / Sexual / Psicológica / Negligência].\n", toastMsg: "Vulnerabilidade Ped" },
  { id: "social_ped_evasao", label: "🏃 Risco de Evasão/Fuga", text: "AVALIAÇÃO SERVIÇO SOCIAL (PEDIÁTRICA):\n- Responsável demonstrando impaciência, ameaçando evasão hospitalar ou retirada da criança contra orientação médica.\n- Intervenção imediata solicitada.\n", toastMsg: "Risco de Evasão" },
  { id: "social_ped_protetiva", label: "🛡️ Capacidade Protetiva", text: "AVALIAÇÃO SERVIÇO SOCIAL (PEDIÁTRICA):\n- Avaliação da capacidade dos pais em prover cuidados pós-alta e seguir o tratamento prescrito.\n- Risco de reincidência de internação por causas evitáveis.\n", toastMsg: "Capacidade Protetiva" }
];
const SOCIAL_PED_PROCEDURES: CareItem[] = [
  { id: "social_ped_tutelar", label: "⚖️ Acionamento Conselho Tutelar", text: "CONDUTA SERVIÇO SOCIAL (PEDIÁTRICA):\n- Acionado Conselho Tutelar em caráter de urgência para acompanhamento do caso devido a risco iminente ou violação confirmada.\n- Relatório social enviado ao órgão. Conselheiro [Nome] compareceu à unidade.\n", toastMsg: "Conselho Tutelar" },
  { id: "social_ped_sinan", label: "📄 Notificação SINAN (ECA)", text: "CONDUTA SERVIÇO SOCIAL (PEDIÁTRICA):\n- Preenchida notificação compulsória (SINAN) de violência interpessoal/autoprovocada.\n- Garantida a aplicação das diretrizes do Estatuto da Criança e do Adolescente (ECA).\n", toastMsg: "Notificação SINAN" },
  { id: "social_ped_escola", label: "🎒 Articulação Escolar/Saúde", text: "CONDUTA SERVIÇO SOCIAL (PEDIÁTRICA):\n- Contato com a rede de ensino ou UBS de referência para comunicação do quadro clínico/internação prolongada ou acompanhamento de situação de vulnerabilidade.\n", toastMsg: "Articulação Escolar" },
  { id: "social_ped_orienta", label: "📜 Direitos da Criança Hospitalizada", text: "CONDUTA SERVIÇO SOCIAL (PEDIÁTRICA):\n- Orientação aos responsáveis sobre os direitos da criança hospitalizada (direito a acompanhante 24h, informação clara, ambiente adequado).\n- Orientações de acesso a benefícios sociais (ex: BPC para crianças com deficiência grave descoberta).\n", toastMsg: "Direitos da Criança" },
  { id: "social_ped_abrigo", label: "🏠 Articulação de Acolhimento", text: "CONDUTA SERVIÇO SOCIAL (PEDIÁTRICA):\n- Acionamento de serviço de acolhimento institucional infantil (abrigo) mediante determinação judicial/Conselho tutelar devido destituição familiar de urgência.\n", toastMsg: "Abrigo Infantil" }
];

// TERAPIA OCUPACIONAL
const TO_ADULT_ITEMS: CareItem[] = [
  { id: "to_avds", label: "👕 Avaliação de AVDs / AIVDs", text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Avaliação de Atividades de Vida Diária (AVDs) e Instrumentais (AIVDs).\n- Nível de dependência prévio: [Independente / Parcial / Total].\n- Nível atual no leito: [Necessita assistência máxima / moderada / mínima].\n", toastMsg: "Avaliação AVDs" },
  { id: "to_cognitiva", label: "🧩 Avaliação Cognitiva-Funcional", text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Rastreio cognitivo (Atenção, Memória, Funções Executivas).\n- Presença de Delirium: [Não / Sim - hipoativo/hiperativo].\n- Compreensão de comandos: [Preservada / Alterada].\n", toastMsg: "Avaliação Cognitiva" },
  { id: "to_sensorial", label: "✋ Avaliação Sensório-Motora", text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Tônus e trofismo de Membros Superiores (MMSS).\n- Sensibilidade tátil, proprioceptiva e dolorosa em MMSS: [Preservada / Alterada].\n- Risco de deformidades articulares, retrações ou LPPs.\n", toastMsg: "Aval. Sensório-Motora" },
  { id: "to_ocupacional", label: "🎭 Histórico Ocupacional", text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Coleta do histórico ocupacional, rotina, interesses e papéis sociais do paciente para guiar o plano terapêutico.\n", toastMsg: "Histórico Ocupacional" },
  { id: "to_funcionalidade", label: "📊 Funcionalidade Global", text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Aplicação de escalas de funcionalidade (Barthel/Katz).\n- Pontuação indica grau de comprometimento e necessidade de adaptações.\n", toastMsg: "Funcionalidade Global" },
  { id: "to_visual", label: "👁️ Avaliação Visual/Perceptiva", text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Avaliação de déficits perceptivos, heminegligência ou alterações viso-espaciais (ex: pós-AVC).\n", toastMsg: "Aval. Visual/Perceptiva" },
  { id: "to_assistiva", label: "♿ Necessidade de Tec. Assistiva", text: "AVALIAÇÃO TERAPIA OCUPACIONAL:\n- Levantamento de necessidade de Tecnologia Assistiva (cadeira de rodas adequada, adaptações para alimentação/higiene).\n", toastMsg: "Tecnologia Assistiva" }
];
const TO_ADULT_PROCEDURES: CareItem[] = [
  { id: "to_orteses", label: "✋ Prescrição/Confecção Órteses", text: "CONDUTA TERAPIA OCUPACIONAL:\n- Confeccionada ou ajustada órtese de posicionamento em termoplástico/gesso/espuma (ex: repouso palmar, anti-equino).\n- Objetivo: prevenção de deformidades contraturais e manutenção de amplitude de movimento.\n- Orientados paciente e equipe sobre uso e retirada.\n", toastMsg: "Órteses / Posicionamento" },
  { id: "to_delirium", label: "🧠 Manejo de Delirium / Cognição", text: "CONDUTA TERAPIA OCUPACIONAL:\n- Intervenção para manejo de delirium: reorganização ambiental, ciclo sono-vigília, redução de estímulos excessivos.\n- Estimulação/treino cognitivo e orientação para a realidade (tempo e espaço) à beira leito.\n", toastMsg: "Manejo Delirium" },
  { id: "to_treino_avds", label: "🥣 Treino de AVDs no Leito", text: "CONDUTA TERAPIA OCUPACIONAL:\n- Treino de Atividades de Vida Diária (AVDs) no leito: alimentação assistida, higiene de face/oral, vestuário.\n- Adaptação de utensílios (engrossadores de talher) para ganho de independência.\n", toastMsg: "Treino AVDs" },
  { id: "to_mmss", label: "💪 Reabilitação de MMSS", text: "CONDUTA TERAPIA OCUPACIONAL:\n- Exercícios terapêuticos e estimulação sensório-motora direcionados para Membros Superiores (MMSS).\n- Treino de motricidade fina e preensão para readequação funcional.\n", toastMsg: "Reabilitação MMSS" },
  { id: "to_conserva", label: "🔋 Conservação de Energia", text: "CONDUTA TERAPIA OCUPACIONAL:\n- Orientações sobre técnicas de conservação de energia e simplificação do trabalho para pacientes com fadiga/dispneia.\n", toastMsg: "Conservação Energia" },
  { id: "to_alta", label: "🏠 Orientações de Alta / Domicílio", text: "CONDUTA TERAPIA OCUPACIONAL:\n- Orientações de alta visando segurança e acessibilidade domiciliar.\n- Prevenção de quedas no domicílio (retirada de tapetes, uso de barras de apoio, iluminação).\n", toastMsg: "Orientações de Alta TO" },
  { id: "to_coxins", label: "🛏️ Adequação Postural/Coxins", text: "CONDUTA TERAPIA OCUPACIONAL:\n- Prescrição e adaptação de coxins para alinhamento biomecânico no leito/poltrona e alívio de pressão proeminências ósseas.\n", toastMsg: "Coxins/Posicionamento" },
  { id: "to_estimula_sensorial", label: "🤲 Estimulação Sensorial", text: "CONDUTA TERAPIA OCUPACIONAL:\n- Protocolo de estimulação sensorial (tátil, proprioceptiva, olfativa) para pacientes com rebaixamento de nível de consciência ou lesão neurológica.\n", toastMsg: "Estimulação Sensorial" },
  { id: "to_rotina", label: "⏱️ Gerenciamento de Rotina", text: "CONDUTA TERAPIA OCUPACIONAL:\n- Estruturação de rotina hospitalar para o paciente, favorecendo engajamento em atividades significativas e diminuindo ociosidade.\n", toastMsg: "Gerenciamento Rotina" }
];
const TO_PED_ITEMS: CareItem[] = [
  { id: "to_ped_neuro", label: "👶 Avaliação Neuropsicomotora", text: "AVALIAÇÃO TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Avaliação do Desenvolvimento Neuropsicomotor (DNPM): [Adequado / Atraso global / Atraso motor/cognitivo].\n- Habilidades manuais e coordenação global: [Adequadas para idade / Deficitárias].\n", toastMsg: "Aval. DNPM TO" },
  { id: "to_ped_brincar", label: "🪀 Avaliação do Brincar", text: "AVALIAÇÃO TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Qualidade e engajamento na atividade lúdica: [Brincar funcional / simbólico / restrito / ausente].\n- Impacto da hospitalização e de dispositivos médicos (acessos, sondas) na exploração do ambiente.\n", toastMsg: "Aval. do Brincar" },
  { id: "to_ped_sensorial", label: "🌈 Perfil Sensorial", text: "AVALIAÇÃO TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Observação de respostas sensoriais atípicas no ambiente hospitalar (hiper/hiporresponsividade a ruídos, luzes, toques, texturas alimentares).\n", toastMsg: "Perfil Sensorial" },
  { id: "to_ped_atraso", label: "⚠️ Risco de Atraso (DNPM)", text: "AVALIAÇÃO TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Identificados fatores de risco para atraso no desenvolvimento devido a internação prolongada ou patologia de base.\n", toastMsg: "Risco Atraso DNPM" },
  { id: "to_ped_tea", label: "🧩 Sinais de TEA/TDAH", text: "AVALIAÇÃO TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Observados comportamentos sugestivos de atipias no neurodesenvolvimento (estereotipias, desregulação sensorial grave, hiperfoco).\n", toastMsg: "Atipias Neurodesenv." }
];
const TO_PED_PROCEDURES: CareItem[] = [
  { id: "to_ped_estimula", label: "🪀 Estimulação Sensório-Motora", text: "CONDUTA TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Realizada intervenção através do brincar terapêutico para estimulação sensório-motora e cognitiva.\n- Promoção de vivências positivas para amenizar o trauma da hospitalização.\n", toastMsg: "Estimulação Lúdica" },
  { id: "to_ped_adaptacao", label: "🧸 Adaptação Ambiental / Brinquedos", text: "CONDUTA TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Adaptação de brinquedos e recursos para favorecer a interação da criança limitada ao leito ou por dispositivos médicos.\n- Modificação sensorial do ambiente (redução de luz/som) para regulação da criança agitação/espectro autista.\n", toastMsg: "Adaptação de Brinquedos" },
  { id: "to_ped_orteses", label: "✋ Posicionamento Pediátrico", text: "CONDUTA TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Confecção de órteses ou confecção de coxins para alinhamento biomecânico e prevenção de assimetrias/deformidades cranianas/motoras.\n", toastMsg: "Posicionamento Ped" },
  { id: "to_ped_pais", label: "👨‍👩‍👦 Orientações a Pais e Cuidador", text: "CONDUTA TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Orientação aos responsáveis sobre formas de estimular o desenvolvimento da criança durante a internação e pós-alta.\n- Prescrição de atividades lúdicas seguras e adequadas ao quadro clínico.\n", toastMsg: "Orientação TO Pais" },
  { id: "to_ped_avds", label: "👕 Treino de AVDs Infantis", text: "CONDUTA TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Treino de independência para AVDs adaptadas à idade (ex: segurar a mamadeira, comer com colher, vestir a blusa) apesar do contexto hospitalar.\n", toastMsg: "Treino AVDs Infantil" },
  { id: "to_ped_acalento", label: "🌙 Manejo Sensorial (Acalento)", text: "CONDUTA TERAPIA OCUPACIONAL (PEDIÁTRICA):\n- Aplicação de técnicas de integração sensorial e organização proprioceptiva (enrolamento, acalento profundo) para bebês/crianças irritadiças.\n", toastMsg: "Manejo Sensorial" }
];

// FONOAUDIOLOGIA
const FONO_ADULT_ITEMS: CareItem[] = [
  { id: "fono_disfagia", label: "🗣️ Avaliação de Disfagia", text: "AVALIAÇÃO FONOAUDIOLÓGICA:\n- Realizada avaliação clínica da deglutição à beira leito.\n- Observados sinais clínicos de broncoaspiração (tosse, engasgo, alteração vocal): [Ausentes / Presentes].\n- Classificação: [Deglutição Segura / Disfagia Leve / Moderada / Grave].\n", toastMsg: "Aval. Disfagia" },
  { id: "fono_blue_dye", label: "🔵 Teste do Corante Azul", text: "AVALIAÇÃO FONOAUDIOLÓGICA:\n- Realizado Teste do Corante Azul (Blue Dye Test) em paciente traqueostomizado.\n- Resultado: [Negativo / Positivo para aspiração traqueal].\n", toastMsg: "Teste Corante Azul" },
  { id: "fono_voz", label: "🎙️ Avaliação de Voz e Fala", text: "AVALIAÇÃO FONOAUDIOLÓGICA:\n- Paciente extubado recentemente. Avaliada qualidade vocal.\n- Presença de disfonia, soprosidade ou fadiga ao falar: [Sim / Não].\n", toastMsg: "Aval. Voz e Fala" },
  { id: "fono_cognitivo", label: "🧠 Rastreio Cognitivo-Linguístico", text: "AVALIAÇÃO FONOAUDIOLÓGICA:\n- Rastreio de linguagem e compreensão.\n- Sinais de afasia ou disartria (pós-AVC/Trauma): [Ausente / Presente].\n", toastMsg: "Rastreio Linguagem" }
];
const FONO_ADULT_PROCEDURES: CareItem[] = [
  { id: "fono_consistencia", label: "🥣 Ajuste de Consistência", text: "CONDUTA FONOAUDIOLÓGICA:\n- Definida consistência alimentar segura.\n- Líquidos: [Livre / Néctar / Mel / Pudim].\n- Sólidos: [Branda / Pastosa / Purê / Liquidificada].\n", toastMsg: "Ajuste Consistência" },
  { id: "fono_desmame_tne", label: "🔄 Desmame de TNE (Sonda)", text: "CONDUTA FONOAUDIOLÓGICA:\n- Iniciado desmame de via alternativa de alimentação (SNE/SNG).\n- Liberada via oral (VO) assistida e fracionada, com resposta positiva do paciente.\n", toastMsg: "Desmame Sonda" },
  { id: "fono_exercicios", label: "👅 Treino de Deglutição", text: "CONDUTA FONOAUDIOLÓGICA:\n- Realizados exercícios orofaciais isotônicos e isométricos.\n- Manobras protetivas de deglutição (ex: queixo no peito, deglutição com esforço).\n", toastMsg: "Treino Deglutição" },
  { id: "fono_traqueo", label: "🌬️ Manejo de Traqueostomia", text: "CONDUTA FONOAUDIOLÓGICA:\n- Treino de oclusão digital / adaptação de Válvula de Fala.\n- Preparo fonoterapêutico para decanulação em conjunto com fisioterapia e equipe médica.\n", toastMsg: "Manejo Traqueo" },
  { id: "fono_orientacao", label: "📋 Orientações de Alta", text: "CONDUTA FONOAUDIOLÓGICA:\n- Orientações de alta repassadas ao familiar/cuidador quanto à oferta de dieta, postura na alimentação e uso de espessante.\n", toastMsg: "Orientações Fono" }
];
const FONO_PED_ITEMS: CareItem[] = [
  { id: "fono_ped_succao", label: "🍼 Aval. Sucção Nutritiva", text: "AVALIAÇÃO FONOAUDIOLÓGICA (PEDIÁTRICA):\n- Avaliação do reflexo de busca, sucção e deglutição do lactente.\n- Coordenação sucção-respiração-deglutição: [Adequada / Incoordenada].\n", toastMsg: "Aval. Sucção" },
  { id: "fono_ped_freio", label: "👅 Teste da Linguinha", text: "AVALIAÇÃO FONOAUDIOLÓGICA (PEDIÁTRICA):\n- Avaliação do frênulo lingual.\n- Indicativo de anquiloglossia dificultando a amamentação: [Sim / Não].\n", toastMsg: "Teste Linguinha" },
  { id: "fono_ped_disfagia", label: "🥣 Aval. Deglutição Infantil", text: "AVALIAÇÃO FONOAUDIOLÓGICA (PEDIÁTRICA):\n- Avaliação de deglutição na criança.\n- Sinais de engasgo, tosse ou recusa persistente a texturas.\n", toastMsg: "Aval. Deglutição Ped" }
];
const FONO_PED_PROCEDURES: CareItem[] = [
  { id: "fono_ped_pega", label: "🤱 Adequação de Pega", text: "CONDUTA FONOAUDIOLÓGICA (PEDIÁTRICA):\n- Intervenção na pega e postura durante o aleitamento materno.\n- Redução de fissuras mamárias e melhor extração de leite pela criança.\n", toastMsg: "Adequação de Pega" },
  { id: "fono_ped_estimulo", label: "👶 Estimulação Sensório-Motora", text: "CONDUTA FONOAUDIOLÓGICA (PEDIÁTRICA):\n- Estimulação da Sucção Não Nutritiva (SNN) com dedo enluvado/chupeta (se consentido).\n- Exercícios orofaciais para fortalecimento da musculatura perioral.\n", toastMsg: "Estimulação SNN" },
  { id: "fono_ped_transicao", label: "🔄 Transição Sonda-Peito", text: "CONDUTA FONOAUDIOLÓGICA (PEDIÁTRICA):\n- Início do treino de transição da sonda enteral para a via oral (peito ou mamadeira/copinho).\n", toastMsg: "Transição Sonda/VO" }
];

// FARMÁCIA CLÍNICA
const FARMA_ADULT_ITEMS: CareItem[] = [
  { id: "farma_reconciliacao", label: "📋 Reconciliação Medicamentosa", text: "AVALIAÇÃO FARMACÊUTICA:\n- Realizada reconciliação medicamentosa na admissão.\n- Medicamentos de uso contínuo domiciliar identificados e checados com a prescrição atual.\n- Discrepâncias identificadas: [Sim / Não].\n", toastMsg: "Reconciliação Med." },
  { id: "farma_interacao", label: "⚠️ Avaliação de Interações", text: "AVALIAÇÃO FARMACÊUTICA:\n- Avaliada a prescrição médica vigente. \n- Interações medicamentosas clinicamente relevantes detectadas: [Não / Sim].\n", toastMsg: "Aval. Interações" },
  { id: "farma_alergias", label: "🚫 Checagem de Alergias", text: "AVALIAÇÃO FARMACÊUTICA:\n- Investigadas alergias medicamentosas (RAM - Reação Adversa a Medicamento).\n- Paciente relata alergia a: [Nenhuma / Penicilinas / Dipirona / AINES / Outros].\n", toastMsg: "Checagem Alergias" },
  { id: "farma_funcao_renal", label: "🩸 Função Renal/Hepática", text: "AVALIAÇÃO FARMACÊUTICA:\n- Revisão de exames laboratoriais (Creatinina/Ureia/TGO/TGP).\n- Clearance de Creatinina: [ ] ml/min. Necessidade de ajuste de dose de antimicrobianos/fármacos: [Sim / Não].\n", toastMsg: "Aval. Função Renal" }
];
const FARMA_ADULT_PROCEDURES: CareItem[] = [
  { id: "farma_ajuste", label: "📉 Intervenção: Ajuste de Dose", text: "CONDUTA FARMACÊUTICA:\n- Sugerido ajuste de posologia/dose ao prescritor devido a [disfunção renal/hepática, peso, interação].\n- Médico prescritor acatou a intervenção: [Sim / Não].\n", toastMsg: "Ajuste de Dose" },
  { id: "farma_suspensao", label: "🛑 Intervenção: Suspensão", text: "CONDUTA FARMACÊUTICA:\n- Sugerida suspensão de item na prescrição por duplicidade terapêutica ou risco de RAM.\n- Intervenção acatada.\n", toastMsg: "Suspensão Fármaco" },
  { id: "farma_via", label: "🔄 Substituição de Via (EV/VO)", text: "CONDUTA FARMACÊUTICA:\n- Avaliada possibilidade de transição sequencial de antimicrobianos/analgésicos (Via Endovenosa para Via Oral).\n- Paciente apto para Terapia Sequencial.\n", toastMsg: "Terapia Sequencial" },
  { id: "farma_diluicao", label: "💧 Orientação de Diluição", text: "CONDUTA FARMACÊUTICA:\n- Orientação à equipe de enfermagem sobre incompatibilidade em Y, tempo de infusão e diluente adequado para fármacos restritos.\n", toastMsg: "Orientação Enfermagem" },
  { id: "farma_alta", label: "🗣️ Orientação de Alta Farmacêutica", text: "CONDUTA FARMACÊUTICA:\n- Educação em saúde à beira leito com paciente/familiar no momento da alta.\n- Explicação sobre horários, interações alimento-fármaco e guarda dos medicamentos.\n", toastMsg: "Orientação de Alta" }
];
const FARMA_PED_ITEMS: CareItem[] = [
  { id: "farma_ped_dose", label: "⚖️ Checagem de Dose Pediátrica", text: "AVALIAÇÃO FARMACÊUTICA (PEDIÁTRICA):\n- Verificação da prescrição pediátrica.\n- Doses checadas de acordo com peso atual da criança ([ ] kg). Doses estão em faixa terapêutica segura.\n", toastMsg: "Checagem Dose Ped" },
  { id: "farma_ped_adesao", label: "👨‍👩‍👦 Avaliação de Adesão", text: "AVALIAÇÃO FARMACÊUTICA (PEDIÁTRICA):\n- Entrevista com responsáveis para avaliar o uso correto dos medicamentos inalatórios e orais no domicílio.\n- Erros de administração prévios identificados: [Sim / Não].\n", toastMsg: "Aval. Adesão Pais" }
];
const FARMA_PED_PROCEDURES: CareItem[] = [
  { id: "farma_ped_intervencao", label: "🛑 Intervenção Pediátrica", text: "CONDUTA FARMACÊUTICA (PEDIÁTRICA):\n- Notificada prescrição fora do padrão pediátrico (subdose/superdose).\n- Médico contatado para adequação da posologia por mg/kg/dia.\n", toastMsg: "Intervenção Pediátrica" },
  { id: "farma_ped_preparo", label: "🥄 Orientação Preparo Soluções", text: "CONDUTA FARMACÊUTICA (PEDIÁTRICA):\n- Orientação aos pais sobre o preparo correto de suspensões orais (ex: antibióticos em pó) e uso do dosador (seringa/copinho em ml, não colher).\n", toastMsg: "Orientação Suspensão" },
  { id: "farma_ped_aprazamento", label: "⏱️ Aprazamento Pediátrico", text: "CONDUTA FARMACÊUTICA (PEDIÁTRICA):\n- Otimização do aprazamento (horários) para respeitar o ciclo de sono da criança sem prejudicar o nível sérico do medicamento.\n", toastMsg: "Ajuste Aprazamento" }
];






export default function PatientEvolution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, addEvolution } = usePatients();
  const { beds, assignPatient, releaseBed } = useBeds();
  const patient = patients.find(p => p.id === id);

  const isChild = (() => {
    if (patient?.age === undefined) return false;
    // Definição Legal: Criança (0 a 11 anos, 11 meses e 29 dias)
    return patient.age < 12;
  })();

  const medicationItems = isChild ? PEDIATRIC_MEDICATION_CARE_ITEMS : MEDICATION_CARE_ITEMS;
  const careItems = isChild ? PEDIATRIC_NURSING_CARE_ITEMS : NURSING_CARE_ITEMS;
  const comfortItems = isChild ? PEDIATRIC_COMFORT_CARE_ITEMS : COMFORT_CARE_ITEMS;
  const movementItems = isChild ? PEDIATRIC_MOVEMENT_CARE_ITEMS : MOVEMENT_CARE_ITEMS;
  const admissionItems = isChild ? PEDIATRIC_ADMISSION_ROUTINE_ITEMS : ADMISSION_ROUTINE_ITEMS;

  const fromPath = location.state?.from || "/pacientes";
  const fromLabel = location.state?.label || "Pacientes";

  const [isBedDialogOpen, setIsBedDialogOpen] = useState(false);
  const patientBed = beds.find(b => b.patientId === id);
  const availableBeds = beds.filter(b => b.status === 'available');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [evolutionType, setEvolutionType] = useState("");
  const [professional, setProfessional] = useState(() => localStorage.getItem("upa_stamp_name") || "");
  const [description, setDescription] = useState("");
  const [selectedCid, setSelectedCid] = useState<CID10Item | null>(null);

  const cidContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (cidContainerRef.current && !cidContainerRef.current.contains(event.target as Node)) {
        setIsCidDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Estados para os Dropdowns da Equipe Técnica
  const [isMedicationDropdownOpen, setIsMedicationDropdownOpen] = useState(false);
  const [isCareDropdownOpen, setIsCareDropdownOpen] = useState(false);
  const [isComfortDropdownOpen, setIsComfortDropdownOpen] = useState(false);
  const [isMovementDropdownOpen, setIsMovementDropdownOpen] = useState(false);

  // Estados para os Dropdowns do Super Painel SAE (Enfermagem)
  const [isSaeAdmissionDropdownOpen, setIsSaeAdmissionDropdownOpen] = useState(false);
  const [isSaeCareDropdownOpen, setIsSaeCareDropdownOpen] = useState(false);
  // Estados para os Dropdowns do Super Painel Médico (Evolução Médica)
  const [isMedicalNeuroDropdownOpen, setIsMedicalNeuroDropdownOpen] = useState(false);
  const [isMedicalSyndromeDropdownOpen, setIsMedicalSyndromeDropdownOpen] = useState(false);
  const [isMedicalConductDropdownOpen, setIsMedicalConductDropdownOpen] = useState(false);

  // Estados para os Dropdowns do Super Painel Médico Pediátrico
  const [isPediatricNeuroDropdownOpen, setIsPediatricNeuroDropdownOpen] = useState(false);
  const [isPediatricSyndromeDropdownOpen, setIsPediatricSyndromeDropdownOpen] = useState(false);
  const [isPediatricConductDropdownOpen, setIsPediatricConductDropdownOpen] = useState(false);

  // Estados para os Dropdowns da Equipe Multidisciplinar
  const [isFisioEvalDropdownOpen, setIsFisioEvalDropdownOpen] = useState(false);
  const [isFisioProcDropdownOpen, setIsFisioProcDropdownOpen] = useState(false);
  const [isNutriEvalDropdownOpen, setIsNutriEvalDropdownOpen] = useState(false);
  const [isNutriProcDropdownOpen, setIsNutriProcDropdownOpen] = useState(false);
  const [isPsicoEvalDropdownOpen, setIsPsicoEvalDropdownOpen] = useState(false);
  const [isPsicoProcDropdownOpen, setIsPsicoProcDropdownOpen] = useState(false);
  const [isSocialEvalDropdownOpen, setIsSocialEvalDropdownOpen] = useState(false);
  const [isSocialProcDropdownOpen, setIsSocialProcDropdownOpen] = useState(false);
  const [isToEvalDropdownOpen, setIsToEvalDropdownOpen] = useState(false);
  const [isToProcDropdownOpen, setIsToProcDropdownOpen] = useState(false);
  const [isFonoEvalDropdownOpen, setIsFonoEvalDropdownOpen] = useState(false);
  const [isFonoProcDropdownOpen, setIsFonoProcDropdownOpen] = useState(false);
  const [isFarmaEvalDropdownOpen, setIsFarmaEvalDropdownOpen] = useState(false);
  const [isFarmaProcDropdownOpen, setIsFarmaProcDropdownOpen] = useState(false);




  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\r\n/g, "\n")
      .replace(/\s+/g, " ")
      .trim();
  };

  const toggleCareItem = (itemText: string, toastMsg: string) => {
    const normDesc = normalizeText(description);
    const normItem = normalizeText(itemText).trim();

    if (normDesc.includes(normItem)) {
      const descLines = description.split(/\r?\n/);
      const itemLines = itemText.split(/\r?\n/).filter(line => line.trim() !== "");

      const filteredLines = descLines.filter(line => {
        const normLine = normalizeText(line);
        if (!normLine) return true;
        return !itemLines.some(itemLine => normalizeText(itemLine) === normLine);
      });

      const newDesc = filteredLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
      setDescription(newDesc);
      toast.info(`${toastMsg} removido(a)`);
    } else {
      setDescription(prev => {
        const trimmedPrev = prev.trim();
        if (!trimmedPrev) return itemText;
        return trimmedPrev + "\n\n" + itemText;
      });
      toast.success(`${toastMsg} adicionado(a)`);
    }
  };

  // Estados locais para Sinais Vitais & MEWS
  const [vsSystolic, setVsSystolic] = useState("");
  const [vsDiastolic, setVsDiastolic] = useState("");
  const [vsHeartRate, setVsHeartRate] = useState("");
  const [vsRespiratoryRate, setVsRespiratoryRate] = useState("");
  const [vsTemperature, setVsTemperature] = useState("");
  const [vsSpO2, setVsSpO2] = useState("");
  const [vsPain, setVsPain] = useState("0");
  const [vsConsciousness, setVsConsciousness] = useState("A"); // A: Alerta, V: Voz, D: Dor, I: Inconsciente
  // Estados para as calculadoras clínicas (Enfermagem)
  const [openMorseCalc, setOpenMorseCalc] = useState(false);
  const [morseScore, setMorseScore] = useState<number | null>(null);
  const [selectedMorse, setSelectedMorse] = useState("");
  const [morseHistory, setMorseHistory] = useState("no");
  const [morseDiagnosis, setMorseDiagnosis] = useState("no");
  const [morseAmbulation, setMorseAmbulation] = useState("none");
  const [morseIv, setMorseIv] = useState("no");
  const [morseGait, setMorseGait] = useState("normal");
  const [morseMental, setMorseMental] = useState("oriented");

  const [openBradenCalc, setOpenBradenCalc] = useState(false);
  const [bradenScore, setBradenScore] = useState<number | null>(null);
  const [selectedBraden, setSelectedBraden] = useState("");
  const [bradenSensory, setBradenSensory] = useState("4");
  const [bradenMoisture, setBradenMoisture] = useState("4");
  const [bradenActivity, setBradenActivity] = useState("4");
  const [bradenMobility, setBradenMobility] = useState("4");
  const [bradenNutrition, setBradenNutrition] = useState("4");
  const [bradenFriction, setBradenFriction] = useState("3");

  const [openEvaCalc, setOpenEvaCalc] = useState(false);
  const [evaScore, setEvaScore] = useState<number | null>(0);
  const [selectedEva, setSelectedEva] = useState("");
  const [evaLocation, setEvaLocation] = useState("");
  const [evaCharacteristics, setEvaCharacteristics] = useState("");

  const [openMewsCalc, setOpenMewsCalc] = useState(false);
  const [mewsScore, setMewsScore] = useState<number | null>(null);
  const [selectedMews, setSelectedMews] = useState("");
  const [mewsPas, setMewsPas] = useState("0");
  const [mewsFc, setMewsFc] = useState("0");
  const [mewsFr, setMewsFr] = useState("0");
  const [mewsTemp, setMewsTemp] = useState("0");
  const [mewsAvdi, setMewsAvdi] = useState("0");

  const [openNews2Calc, setOpenNews2Calc] = useState(false);
  const [news2Score, setNews2Score] = useState<number | null>(null);
  const [selectedNews2, setSelectedNews2] = useState("");
  const [news2Scale, setNews2Scale] = useState("1");
  const [news2Fr, setNews2Fr] = useState("0");
  const [news2Spo2, setNews2Spo2] = useState("0");
  const [news2O2, setNews2O2] = useState("0");
  const [news2Pas, setNews2Pas] = useState("0");
  const [news2Fc, setNews2Fc] = useState("0");
  const [news2Acvpu, setNews2Acvpu] = useState("0");
  const [news2Temp, setNews2Temp] = useState("0");

  const [openQsofaCalc, setOpenQsofaCalc] = useState(false);
  const [qsofaScore, setQsofaScore] = useState<number | null>(null);
  const [selectedQsofa, setSelectedQsofa] = useState("");
  const [qsofaFr, setQsofaFr] = useState("no");
  const [qsofaMental, setQsofaMental] = useState("no");
  const [qsofaPas, setQsofaPas] = useState("no");

  const [openPewsCalc, setOpenPewsCalc] = useState(false);
  const [pewsScore, setPewsScore] = useState<number | null>(null);
  const [selectedPews, setSelectedPews] = useState("");
  const [pewsBehavior, setPewsBehavior] = useState("0");
  const [pewsCv, setPewsCv] = useState("0");
  const [pewsResp, setPewsResp] = useState("0");
  const [pewsNeb, setPewsNeb] = useState("no");

  const [openGlasgowCalc, setOpenGlasgowCalc] = useState(false);
  const [glasgowScore, setGlasgowScore] = useState<number | null>(null);
  const [selectedGlasgow, setSelectedGlasgow] = useState("");
  const [gcsEye, setGcsEye] = useState("4");
  const [gcsVerbal, setGcsVerbal] = useState("5");
  const [gcsMotor, setGcsMotor] = useState("6");

  const [sepsisTab, setSepsisTab] = useState("qsofa");
  const [sirsTemp, setSirsTemp] = useState("no");
  const [sirsHr, setSirsHr] = useState("no");
  const [sirsRr, setSirsRr] = useState("no");
  const [sirsWbc, setSirsWbc] = useState("no");
  const [sirsFocus, setSirsFocus] = useState("no");
  const [sirsDysfunction, setSirsDysfunction] = useState("no");

  // Saúde Mental State
  const [openMentalCalc, setOpenMentalCalc] = useState(false);
  const [activeMentalTab, setActiveMentalTab] = useState("rass");
  const [selectedMentalSummary, setSelectedMentalSummary] = useState("");

  // RASS
  const [rassVal, setRassVal] = useState("0");

  // SAD PERSONS
  const [sadSex, setSadSex] = useState("no");
  const [sadAge, setSadAge] = useState("no");
  const [sadDepression, setSadDepression] = useState("no");
  const [sadPrevAttempt, setSadPrevAttempt] = useState("no");
  const [sadEthanol, setSadEthanol] = useState("no");
  const [sadRationalLoss, setSadRationalLoss] = useState("no");
  const [sadSocialSupport, setSadSocialSupport] = useState("no");
  const [sadOrganizedPlan, setSadOrganizedPlan] = useState("no");
  const [sadNoSpouse, setSadNoSpouse] = useState("no");
  const [sadSickness, setSadSickness] = useState("no");

  // CIWA-Ar
  const [ciwaNausea, setCiwaNausea] = useState("0");
  const [ciwaTremor, setCiwaTremor] = useState("0");
  const [ciwaSweat, setCiwaSweat] = useState("0");
  const [ciwaAnxiety, setCiwaAnxiety] = useState("0");
  const [ciwaAgitation, setCiwaAgitation] = useState("0");
  const [ciwaTactile, setCiwaTactile] = useState("0");
  const [ciwaAuditory, setCiwaAuditory] = useState("0");
  const [ciwaVisual, setCiwaVisual] = useState("0");
  const [ciwaHeadache, setCiwaHeadache] = useState("0");
  const [ciwaOrientation, setCiwaOrientation] = useState("0");

  // CAGE
  const [cageCut, setCageCut] = useState("no");
  const [cageAnnoyed, setCageAnnoyed] = useState("no");
  const [cageGuilty, setCageGuilty] = useState("no");
  const [cageEyeOpener, setCageEyeOpener] = useState("no");

  // PHQ-9 (Depressão)
  const [phq1, setPhq1] = useState("0");
  const [phq2, setPhq2] = useState("0");
  const [phq3, setPhq3] = useState("0");
  const [phq4, setPhq4] = useState("0");
  const [phq5, setPhq5] = useState("0");
  const [phq6, setPhq6] = useState("0");
  const [phq7, setPhq7] = useState("0");
  const [phq8, setPhq8] = useState("0");
  const [phq9, setPhq9] = useState("0");

  // GAD-7 (Ansiedade)
  const [gad1, setGad1] = useState("0");
  const [gad2, setGad2] = useState("0");
  const [gad3, setGad3] = useState("0");
  const [gad4, setGad4] = useState("0");
  const [gad5, setGad5] = useState("0");
  const [gad6, setGad6] = useState("0");
  const [gad7, setGad7] = useState("0");

  // CAM (Delirium)
  const [camAcuteOnset, setCamAcuteOnset] = useState("no");
  const [camInattention, setCamInattention] = useState("no");
  const [camDisorganized, setCamDisorganized] = useState("no");
  const [camAlteredConsciousness, setCamAlteredConsciousness] = useState("no");

  // Urgências Clínicas State
  const [openUrgencyCalc, setOpenUrgencyCalc] = useState(false);
  const [activeUrgencyTab, setActiveUrgencyTab] = useState("heart");
  const [selectedUrgencySummary, setSelectedUrgencySummary] = useState("");

  // HEART
  const [heartHistory, setHeartHistory] = useState("0");
  const [heartEcg, setHeartEcg] = useState("0");
  const [heartAge, setHeartAge] = useState("0");
  const [heartRisk, setHeartRisk] = useState("0");
  const [heartTroponin, setHeartTroponin] = useState("0");

  // NIHSS
  const [nihLoc, setNihLoc] = useState("0");
  const [nihQuestions, setNihQuestions] = useState("0");
  const [nihCommands, setNihCommands] = useState("0");
  const [nihGaze, setNihGaze] = useState("0");
  const [nihVisual, setNihVisual] = useState("0");
  const [nihFacial, setNihFacial] = useState("0");
  const [nihArmL, setNihArmL] = useState("0");
  const [nihArmR, setNihArmR] = useState("0");
  const [nihLegL, setNihLegL] = useState("0");
  const [nihLegR, setNihLegR] = useState("0");
  const [nihAtaxia, setNihAtaxia] = useState("0");
  const [nihSensory, setNihSensory] = useState("0");
  const [nihLanguage, setNihLanguage] = useState("0");
  const [nihDysarthria, setNihDysarthria] = useState("0");
  const [nihNeglect, setNihNeglect] = useState("0");

  // CRB-65
  const [crbConfusion, setCrbConfusion] = useState("0");
  const [crbRate, setCrbRate] = useState("0");
  const [crbBp, setCrbBp] = useState("0");
  const [crbAge, setCrbAge] = useState("0");

  // Wells (TEP)
  const [wellsTvp, setWellsTvp] = useState("0");
  const [wellsAlternative, setWellsAlternative] = useState("0");
  const [wellsHr, setWellsHr] = useState("0");
  const [wellsImmobility, setWellsImmobility] = useState("0");
  const [wellsPrev, setWellsPrev] = useState("0");
  const [wellsHemoptysis, setWellsHemoptysis] = useState("0");
  const [wellsCancer, setWellsCancer] = useState("0");

  // Alvarado
  const [alvaradoMigration, setAlvaradoMigration] = useState("0");
  const [alvaradoAnorexia, setAlvaradoAnorexia] = useState("0");
  const [alvaradoNausea, setAlvaradoNausea] = useState("0");
  const [alvaradoTenderness, setAlvaradoTenderness] = useState("0");
  const [alvaradoRebound, setAlvaradoRebound] = useState("0");
  const [alvaradoFever, setAlvaradoFever] = useState("0");
  const [alvaradoLeukocytosis, setAlvaradoLeukocytosis] = useState("0");
  const [alvaradoShift, setAlvaradoShift] = useState("0");

  // GRACE (SCA)
  const [graceAge, setGraceAge] = useState("0");
  const [graceHr, setGraceHr] = useState("0");
  const [graceSbp, setGraceSbp] = useState("0");
  const [graceCreatinine, setGraceCreatinine] = useState("0");
  const [graceKillip, setGraceKillip] = useState("0");
  const [graceCardiacArrest, setGraceCardiacArrest] = useState("0");
  const [graceStDeviation, setGraceStDeviation] = useState("0");
  const [graceEnzymes, setGraceEnzymes] = useState("0");

  // Ranson (Pancreatite)
  const [ransonAge, setRansonAge] = useState("0");
  const [ransonWbc, setRansonWbc] = useState("0");
  const [ransonGlucose, setRansonGlucose] = useState("0");
  const [ransonLdh, setRansonLdh] = useState("0");
  const [ransonAst, setRansonAst] = useState("0");


  const [openNandaCalc, setOpenNandaCalc] = useState(false);
  const [selectedNanda, setSelectedNanda] = useState("");
  const [selectedNandaNocList, setSelectedNandaNocList] = useState<string[]>([]);
  const [selectedNandaNicList, setSelectedNandaNicList] = useState<string[]>([]);
  const [activeNandaPlan, setActiveNandaPlan] = useState("");

  // Escalas de Enfermagem State
  const [openNursingCalc, setOpenNursingCalc] = useState(false);
  const [activeNursingTab, setActiveNursingTab] = useState("fugulin");
  const [selectedNursingSummary, setSelectedNursingSummary] = useState("");

  // Fugulin (Dependência de Enfermagem)
  const [fugulinMental, setFugulinMental] = useState("1");
  const [fugulinOxy, setFugulinOxy] = useState("1");
  const [fugulinVitals, setFugulinVitals] = useState("1");
  const [fugulinMotility, setFugulinMotility] = useState("1");
  const [fugulinAmbulation, setFugulinAmbulation] = useState("1");
  const [fugulinFeeding, setFugulinFeeding] = useState("1");
  const [fugulinBodyCare, setFugulinBodyCare] = useState("1");
  const [fugulinElimination, setFugulinElimination] = useState("1");
  const [fugulinTherapy, setFugulinTherapy] = useState("1");

  // Estado local para Carimbo / Assinatura persistente
  const [stampName, setStampName] = useState(() => localStorage.getItem("upa_stamp_name") || "");
  const [stampCouncil, setStampCouncil] = useState(() => localStorage.getItem("upa_stamp_council") || "CRM"); // CRM, COREN, Outro
  const [stampNumber, setStampNumber] = useState(() => localStorage.getItem("upa_stamp_number") || "");
  const [stampState, setStampState] = useState(() => localStorage.getItem("upa_stamp_state") || "SP");
  const [isStampConfigOpen, setIsStampConfigOpen] = useState(false);

  // Função para calcular o MEWS
  const calculateMEWS = () => {
    let score = 0;
    
    // 1. Pressão Arterial Sistólica (PAS)
    const pas = parseInt(vsSystolic);
    if (!isNaN(pas)) {
      if (pas <= 70) score += 3;
      else if (pas <= 80) score += 2;
      else if (pas <= 100) score += 1;
      else if (pas >= 200) score += 2;
    }

    // 2. Frequência Cardíaca (FC)
    const fc = parseInt(vsHeartRate);
    if (!isNaN(fc)) {
      if (fc <= 40) score += 2;
      else if (fc <= 50) score += 1;
      else if (fc >= 101 && fc <= 110) score += 1;
      else if (fc >= 111 && fc <= 129) score += 2;
      else if (fc >= 130) score += 3;
    }

    // 3. Frequência Respiratória (FR)
    const fr = parseInt(vsRespiratoryRate);
    if (!isNaN(fr)) {
      if (fr <= 8) score += 2;
      else if (fr >= 15 && fr <= 20) score += 1;
      else if (fr >= 21 && fr <= 29) score += 2;
      else if (fr >= 30) score += 3;
    }

    // 4. Temperatura (T)
    const temp = parseFloat(vsTemperature.replace(",", "."));
    if (!isNaN(temp)) {
      if (temp <= 34.9) score += 2;
      else if (temp >= 38.5) score += 2;
    }

    // 5. Nível de Consciência (AVDI)
    if (vsConsciousness === "V") score += 1;
    else if (vsConsciousness === "D") score += 2;
    else if (vsConsciousness === "I") score += 3;

    return score;
  };

  const getMEWSClassification = (score: number) => {
    if (score >= 5) return { label: "RISCO IMEDIATO (Grave)", color: "text-red-600 bg-red-500/10 border-red-500/20", alert: "Alta urgência! Chame a equipe médica imediatamente." };
    if (score >= 3) return { label: "ATENÇÃO (Moderado)", color: "text-amber-600 bg-amber-500/10 border-amber-500/20", alert: "Alerta de risco. Monitore o paciente com maior frequência." };
    return { label: "ESTÁVEL (Baixo Risco)", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", alert: "Paciente estável e dentro dos parâmetros normais." };
  };



  const evolutions = patient?.evolutions || [];

  if (!patient) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <h2 className="text-2xl font-bold">Paciente não encontrado</h2>
      <p className="text-muted-foreground text-center">O registro que você está tentando acessar não existe ou foi removido.</p>
      <Button asChild variant="outline">
        <Link to={fromPath} className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Link>
      </Button>
    </div>
  );

  const getRiskDetails = (risk: string) => {
    switch(risk) {
      case 'emergency': return { label: 'Emergência', color: 'bg-red-600' };
      case 'very-urgent': return { label: 'Muito Urgente', color: 'bg-orange-500' };
      case 'urgent': return { label: 'Urgente', color: 'bg-yellow-500' };
      case 'less-urgent': return { label: 'Pouco Urgente', color: 'bg-green-500' };
      case 'not-urgent': return { label: 'Não Urgente', color: 'bg-blue-500' };
      default: return { label: risk, color: 'bg-slate-500' };
    }
  };

  const getStatusDetails = (status: string) => {
    switch(status) {
      case 'waiting': return { label: 'Aguardando', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
      case 'attending': return { label: 'Em Atendimento', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
      case 'completed': return { label: 'Finalizado', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
      default: return { label: status, color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
    }
  };

  const risk = getRiskDetails(patient.risk);
  const status = getStatusDetails(patient.status);

  const handleEvolutionTypeChange = (type: string) => {
    setEvolutionType(type);
    if (EVOLUTION_TEMPLATES[type] && !description) {
      setDescription(EVOLUTION_TEMPLATES[type]);
    }
  };

  const handleSaveEvolution = () => {
    // Para sinais vitais, a descrição é gerada automaticamente se não preenchida
    if (!evolutionType || !professional || (evolutionType !== "Sinais Vitais" && !description)) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Se for Sinais Vitais, validar que pelo menos PA e FC estão preenchidos para gerar o MEWS
    if (evolutionType === "Sinais Vitais" && (!vsSystolic || !vsHeartRate)) {
      toast.error("Preencha pelo menos a Pressão Arterial Sistólica e a Frequência Cardíaca.");
      return;
    }

    let finalDescription = description;
    if (evolutionType === "Sinais Vitais") {
      const mews = calculateMEWS();
      const mewsClass = getMEWSClassification(mews);
      finalDescription = 
        `REGISTRO DE SINAIS VITAIS:\n` +
        `- Pressão Arterial (PA): ${vsSystolic || "--"}/${vsDiastolic || "--"} mmHg\n` +
        `- Frequência Cardíaca (FC): ${vsHeartRate || "--"} bpm\n` +
        `- Saturação de O2 (SpO2): ${vsSpO2 || "--"}%\n` +
        `- Temperatura Corporal: ${vsTemperature || "--"} °C\n` +
        `- Frequência Respiratória (FR): ${vsRespiratoryRate || "--"} irpm\n` +
        `- Escala de Dor: ${vsPain}/10\n` +
        `- Consciência (AVDI): ${vsConsciousness === "A" ? "Alerta" : vsConsciousness === "V" ? "Reage a Voz" : vsConsciousness === "D" ? "Reage a Dor" : "Inconsciente"}\n` +
        `-----------------------------------------\n` +
        `Escore MEWS calculado: ${mews} pontos (${mewsClass.label})`;
        
      if (description.trim()) {
        finalDescription += `\n\nObservações clínicas adicionais:\n${description}`;
      }
    }

    // Anexar carimbo digital se configurado
    if (stampNumber) {
      const categoryLabel = stampCouncil === "CRM" ? "Dr(a)." : stampCouncil === "COREN" ? "Enf." : "Téc.";
      finalDescription += `\n\n-----------------------------------------\nAssinado Eletronicamente por: ${categoryLabel} ${professional} - ${stampCouncil}/${stampState}: ${stampNumber}`;
    }

    addEvolution(id!, {
      type: evolutionType,
      professional,
      description: finalDescription,
      cid: selectedCid ? `${selectedCid.code} - ${selectedCid.name}` : undefined,
    });

    setIsFormOpen(false);
    setEvolutionType("");
    setProfessional(localStorage.getItem("upa_stamp_name") || "");
    setDescription("");
    setSelectedCid(null);
    
    // Limpar campos de sinais vitais
    setVsSystolic("");
    setVsDiastolic("");
    setVsHeartRate("");
    setVsRespiratoryRate("");
    setVsTemperature("");
    setVsSpO2("");
    setVsPain("0");
    setVsConsciousness("A");
    
    toast.success("Evolução registrada com sucesso!");
  };

  // Helper para renderizar os Dropdowns padronizados dos painéis Multidisciplinares
  const renderPanelDropdown = (
    title: string,
    icon: React.ReactNode,
    theme: 'green' | 'blue' | 'purple' | 'amber' | 'pink',
    items: CareItem[],
    isOpen: boolean,
    toggleOpen: () => void
  ) => {
    let focusRing = "focus:ring-green-500/20";
    let borderOpen = "border-green-500";
    let textMain = "text-green-600";
    let bgLight = "bg-green-500/10";
    let borderLight = "border-green-500/20";
    let bgBadge = "bg-green-600";
    let hoverLight = "bg-green-500/5";
    let textDark = "text-green-700 dark:text-green-400";

    if (theme === 'blue') {
      focusRing = "focus:ring-blue-500/20"; borderOpen = "border-blue-500"; textMain = "text-blue-600"; bgLight = "bg-blue-500/10"; borderLight = "border-blue-500/20"; bgBadge = "bg-blue-600"; hoverLight = "bg-blue-500/5"; textDark = "text-blue-700 dark:text-blue-400";
    } else if (theme === 'purple') {
      focusRing = "focus:ring-purple-500/20"; borderOpen = "border-purple-500"; textMain = "text-purple-600"; bgLight = "bg-purple-500/10"; borderLight = "border-purple-500/20"; bgBadge = "bg-purple-600"; hoverLight = "bg-purple-500/5"; textDark = "text-purple-700 dark:text-purple-400";
    } else if (theme === 'amber') {
      focusRing = "focus:ring-amber-500/20"; borderOpen = "border-amber-500"; textMain = "text-amber-600"; bgLight = "bg-amber-500/10"; borderLight = "border-amber-500/20"; bgBadge = "bg-amber-600"; hoverLight = "bg-amber-500/5"; textDark = "text-amber-700 dark:text-amber-400";
    } else if (theme === 'pink') {
      focusRing = "focus:ring-pink-500/20"; borderOpen = "border-pink-500"; textMain = "text-pink-600"; bgLight = "bg-pink-500/10"; borderLight = "border-pink-500/20"; bgBadge = "bg-pink-600"; hoverLight = "bg-pink-500/5"; textDark = "text-pink-700 dark:text-pink-400";
    }

    return (
      <div className="space-y-2 relative">
        <span className="text-[9px] font-black uppercase text-muted-foreground block">{title}</span>
        <div className="relative">
          <button type="button" onClick={toggleOpen} className={cn("flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2", focusRing, isOpen ? `${borderOpen} text-foreground` : "border-muted-foreground/20 text-muted-foreground")}>
            <div className="flex items-center gap-2">
              <span className={cn("p-1 rounded-lg", bgLight, textMain)}>{icon}</span>
              <span>Selecionar...</span>
            </div>
            <div className="flex items-center gap-2">
              {(() => {
                const count = items.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                return count > 0 ? (
                  <Badge className={cn(bgBadge, "text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200")}>{count}</Badge>
                ) : null;
              })()}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </button>
          <AnimatePresence>
            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={toggleOpen} />
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15, ease: "easeOut" }} className={cn("absolute left-0 right-0 mt-2 p-1.5 rounded-xl border bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted", borderLight)}>
                  {items.map((item) => {
                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                    return (
                      <button key={item.id} type="button" onClick={() => toggleCareItem(item.text, item.toastMsg)} className={cn("flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all", isActive ? `${hoverLight} ${textDark} font-bold border ${borderLight}` : "hover:bg-muted/70 text-foreground border border-transparent")}>
                        <span className="truncate">{item.label}</span>
                        {isActive ? <span className={cn("text-[10px] font-black flex items-center gap-1", textDark)}>Adicionado ✓</span> : <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">+ Inserir</span>}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-6">
        <Button 
          asChild
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-full hover:bg-muted"
        >
          <Link to={fromPath}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#006699] dark:text-sky-400 uppercase tracking-tight">
              {patient.name.toUpperCase().includes('NÃO IDENTIFICADO') || patient.name.toUpperCase().includes('DESCONHECIDO') 
                ? "PACIENTE NÃO IDENTIFICADO" 
                : patient.name}
            </h1>
            <Badge className={`${risk.color} border-0 text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm`}>
              {risk.label}
            </Badge>
            <Badge variant="outline" className={`${status.color} border-0 text-[10px] uppercase font-bold px-3 py-1 rounded-full`}>
              {status.label}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">
              {patient.age} ANOS · CPF: {patient.cpf || "---.---.---.--"} · NASC: {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-BR') : "--/--/----"}
            </p>
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">SUS: {patient.susCard || "--- --- --- ---"}</p>
            </div>
            {patient.socialName && (
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-wider">NOME SOCIAL: {patient.socialName.toUpperCase()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5 text-blue-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Queixa Principal</p>
              <p className="text-sm font-bold text-foreground truncate mt-0.5" title={patient.mainComplaint}>{patient.mainComplaint || "Não informada"}</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={cn(
            "glass-card border shadow-xl rounded-xl overflow-hidden transition-all duration-500 cursor-pointer active:scale-98",
            patientBed 
              ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30" 
              : "bg-white/70 dark:bg-slate-900/45 border-slate-200/40 dark:border-slate-800/40 hover:bg-muted/50"
          )}
          onClick={() => setIsBedDialogOpen(true)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
              patientBed ? "bg-emerald-500/15" : "bg-blue-500/10"
            )}>
              <BedIcon className={cn("h-5 w-5", patientBed ? "text-emerald-600 animate-pulse" : "text-blue-500")} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Leito / Setor</p>
              <p className={cn("text-sm font-bold mt-0.5 truncate", patientBed ? "text-emerald-700 dark:text-emerald-400" : "text-foreground")}>
                {patientBed ? patientBed.name : (patient.sector || "Sem leito")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500 lg:col-span-1 border-slate-200/40 dark:border-slate-800/40">
          <CardContent className="p-4 flex flex-col justify-between h-full gap-2 font-black">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status Sinais Vitais</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-black text-[#006699] dark:text-sky-300 bg-[#006699]/10 px-2 py-0.5 rounded-md border border-[#006699]/15">
                PA: {patient.pa || '--'}
              </span>
              <span className="text-[11px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/15">
                FC: {patient.fc || '--'}
              </span>
              <span className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/15">
                SpO2: {patient.spo2 || '--'}%
              </span>
              <span className="text-[11px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/15">
                T: {patient.temperature || '--'}°C
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <History className="h-5 w-5 text-blue-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Evoluções</p>
              <p className="text-sm font-bold text-foreground mt-0.5">{evolutions.length} registros</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-start pb-1">
        {!isFormOpen && (
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-[#006699] hover:bg-[#005580] text-white gap-2 px-5 rounded-lg h-9 shadow-sm transition-all active:scale-95 text-xs font-bold uppercase tracking-wider"
          >
            <Plus className="h-4 w-4" />
            Registrar Nova Evolução
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-2xl rounded-xl overflow-hidden bg-white/80 dark:bg-slate-950/45 backdrop-blur-md transition-colors duration-500 max-w-6xl mx-auto w-full">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <h2 className="text-xs font-black flex items-center gap-2 text-primary uppercase tracking-wider">
                    <Plus className="h-4 w-4" /> Registrar Evolução Clínica
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)} className="rounded-full h-7 w-7 hover:bg-muted">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Tipo de Registro *</Label>
                    <Select value={evolutionType} onValueChange={handleEvolutionTypeChange}>
                      <SelectTrigger className="h-9 bg-background border-muted-foreground/20 text-xs">
                        <SelectValue placeholder="Selecionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {!isChild && <SelectItem value="Evolução Médica">Evolução Médica</SelectItem>}
                        {isChild && <SelectItem value="Evolução Médica (Pediátrica)">Evolução Médica (Pediátrica)</SelectItem>}
                        <SelectItem value="Evolução Enfermagem">Evolução Enfermagem (Privativo do Enfermeiro)</SelectItem>
                        <SelectItem value="Anotação de Enfermagem">Anotação de Enfermagem (Técnicos e Equipe)</SelectItem>
                        <SelectItem value="Evolução da Fisioterapia">Evolução da Fisioterapia</SelectItem>
                        <SelectItem value="Evolução da Nutrição">Evolução da Nutrição</SelectItem>
                        <SelectItem value="Evolução da Psicologia">Evolução da Psicologia</SelectItem>
                        <SelectItem value="Evolução do Serviço Social">Evolução do Serviço Social</SelectItem>
                        <SelectItem value="Evolução da Terapia Ocupacional">Evolução da Terapia Ocupacional</SelectItem>
                        <SelectItem value="Evolução da Fonoaudiologia">Evolução da Fonoaudiologia</SelectItem>
                        <SelectItem value="Evolução da Farmácia Clínica">Evolução da Farmácia Clínica</SelectItem>
                        <SelectItem value="Sinais Vitais">Sinais Vitais</SelectItem>
                        <SelectItem value="Prescrição">Prescrição</SelectItem>
                        <SelectItem value="Procedimento">Procedimento</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Profissional Responsável *</Label>
                    <Input 
                      placeholder="Nome do profissional" 
                      className="h-9 bg-background border-muted-foreground/20 text-xs" 
                      value={professional}
                      onChange={(e) => setProfessional(e.target.value)}
                    />
                  </div>
                </div>

                {/* Clinical Guidelines Banner for Nursing */}
                {(evolutionType === "Evolução Enfermagem" || evolutionType === "Anotação de Enfermagem") && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[10px]">
                        {evolutionType === "Evolução Enfermagem" 
                          ? "📋 Diretriz: Evolução de Enfermagem (COFEN Res. 564/2017)" 
                          : "📝 Diretriz: Anotação de Enfermagem"}
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        Segurança Jurídica & Cuidado
                      </span>
                    </div>
                    {evolutionType === "Evolução Enfermagem" ? (
                      <p className="text-muted-foreground leading-relaxed text-[11px]">
                        <strong>Privativo do Enfermeiro (Ciclo de 24h):</strong> Análise crítica e julgamento clínico do estado do paciente. Deve incluir: nível de consciência, dados neurológicos/cardiorrespiratórios, integridade de pele, funcionamento de dispositivos (acessos/sondas/drenos), eliminações (intestinal/vesical) e resposta às condutas anteriores.
                      </p>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed text-[11px]">
                        <strong>Dados Brutos e Pontuais (Toda a Equipe):</strong> Registro imediato de fatos observados ou executados (ex: administração de medicação com via/dose, banho, curativos, etc.). Serve de subsídio para a evolução do enfermeiro.
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Diagnóstico / CID-10 Autocomplete Input */}
                {(evolutionType === "Evolução Médica" || evolutionType === "Evolução Médica (Pediátrica)") && (
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      Diagnóstico / CID-10 <span className="text-[9px] text-muted-foreground font-medium lowercase italic">(opcional)</span>
                    </Label>
                    <SmartCidSelector 
                      selectedCid={selectedCid} 
                      onSelectCid={setSelectedCid} 
                    />
                  </div>
                )}

                {/* Campos Estruturados de Sinais Vitais & MEWS */}
                {evolutionType === "Sinais Vitais" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <Activity className="h-4 w-4 animate-pulse text-[#006699]" />
                        Entrada Estruturada de Sinais Vitais (MEWS)
                      </span>
                      <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
                        Protocolo de Alerta Precoce
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">PA Sistólica (PAS)</Label>
                        <Input 
                          type="number"
                          placeholder="PAS mmHg" 
                          className="h-8 text-xs bg-background"
                          value={vsSystolic}
                          onChange={(e) => setVsSystolic(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">PA Diastólica (PAD)</Label>
                        <Input 
                          type="number"
                          placeholder="PAD mmHg" 
                          className="h-8 text-xs bg-background"
                          value={vsDiastolic}
                          onChange={(e) => setVsDiastolic(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Freq. Cardíaca (FC)</Label>
                        <Input 
                          type="number"
                          placeholder="FC bpm" 
                          className="h-8 text-xs bg-background"
                          value={vsHeartRate}
                          onChange={(e) => setVsHeartRate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Saturação (SpO2)</Label>
                        <Input 
                          type="number"
                          placeholder="SpO2 %" 
                          className="h-8 text-xs bg-background"
                          value={vsSpO2}
                          onChange={(e) => setVsSpO2(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Temperatura (°C)</Label>
                        <Input 
                          type="text"
                          placeholder="Temp °C" 
                          className="h-8 text-xs bg-background"
                          value={vsTemperature}
                          onChange={(e) => setVsTemperature(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Freq. Resp (FR)</Label>
                        <Input 
                          type="number"
                          placeholder="FR irpm" 
                          className="h-8 text-xs bg-background"
                          value={vsRespiratoryRate}
                          onChange={(e) => setVsRespiratoryRate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Escala de Dor</Label>
                        <Select value={vsPain} onValueChange={setVsPain}>
                          <SelectTrigger className="h-8 text-xs bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(11).keys()].map(i => (
                              <SelectItem key={i} value={String(i)}>{i} - {i === 0 ? 'Sem Dor' : i === 10 ? 'Dor Máxima' : `Nível ${i}`}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Nível de Consciência (AVDI)</Label>
                        <Select value={vsConsciousness} onValueChange={setVsConsciousness}>
                          <SelectTrigger className="h-8 text-xs bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A - Alerta (Consciente e Orientado)</SelectItem>
                            <SelectItem value="V">V - Voz (Responde a estímulo verbal / sonolento)</SelectItem>
                            <SelectItem value="D">D - Dor (Responde apenas a estímulo doloroso)</SelectItem>
                            <SelectItem value="I">I - Inconsciente (Sem resposta / arresponsivo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Display MEWS Escore in Real Time */}
                      {(() => {
                        const mews = calculateMEWS();
                        const mewsClass = getMEWSClassification(mews);
                        return (
                          <div className={cn("p-3 rounded-xl border flex items-center justify-between shadow-sm transition-all duration-300", mewsClass.color)}>
                            <div className="min-w-0 flex-1">
                              <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Escore Precoce de Deterioração (MEWS)</p>
                              <p className="text-xs font-black uppercase tracking-tight mt-0.5">{mewsClass.label}</p>
                              <p className="text-[9px] opacity-75 font-semibold mt-0.5 truncate leading-tight">{mewsClass.alert}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center shrink-0 border border-black/5 font-black text-xl font-mono">
                              {mews}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}

                {/* Atalhos rápidos de Prescrição Médica */}
                {evolutionType === "Prescrição" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[10px]">
                        ⚡ Prescrição Expressa: Inserir Combos Rápidos (UPA 24h)
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        Medicamentos Padronizados
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/5"
                        onClick={() => {
                          const combo = `1. Dipirona 1g EV diluído em Soro Fisiológico 0.9% 100ml - correr em 20 minutos (se febre > 37.8°C ou dor moderada/grave).`;
                          setDescription(prev => prev ? `${prev}\n${combo}` : combo);
                          toast.success("Combo de Analgesia inserido");
                        }}
                      >
                        💊 + Analgesia Comum (Dipirona)
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-red-500/20 hover:border-red-500 hover:bg-red-500/5"
                        onClick={() => {
                          const combo = `1. Tramadol 50mg EV + Escopolamina (Buscopan) 20mg EV diluídos em Soro Fisiológico 0.9% 100ml - correr lento em 30 minutos (se dor intensa ou cólica).`;
                          setDescription(prev => prev ? `${prev}\n${combo}` : combo);
                          toast.success("Combo de Analgesia Forte inserido");
                        }}
                      >
                        🔥 + Analgesia Forte (Tramal+Buscopan)
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/5"
                        onClick={() => {
                          const combo = `1. Ondansetrona 8mg EV diluído em Soro Fisiológico 0.9% 100ml - correr em 20 minutos (se náuseas ou vômitos).\n2. Metoclopramida (Plasil) 10mg EV lento (se refratário).`;
                          setDescription(prev => prev ? `${prev}\n${combo}` : combo);
                          toast.success("Combo Gastrointestinal inserido");
                        }}
                      >
                        🤢 + Combo Anti-vômito
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-pink-500/20 hover:border-pink-500 hover:bg-pink-500/5"
                        onClick={() => {
                          const combo = `1. Prometazina (Fenergan) 50mg IM profundo.\n2. Dexametasona 10mg EV diluída em SF 0.9% 100ml.`;
                          setDescription(prev => prev ? `${prev}\n${combo}` : combo);
                          toast.success("Combo Antialérgico inserido");
                        }}
                      >
                        🤧 + Antialérgico (Fenergan+Dexa)
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-orange-500/20 hover:border-orange-500 hover:bg-orange-500/5"
                        onClick={() => {
                          const combo = `1. Captopril 25mg Via Oral (se PAS > 180 ou PAD > 110 sem sinais de alarme).\n2. Reavaliar PA em 40 minutos.`;
                          setDescription(prev => prev ? `${prev}\n${combo}` : combo);
                          toast.success("Combo Crise Hipertensiva inserido");
                        }}
                      >
                        ❤️ + Crise Hipertensiva (Captopril)
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-yellow-500/20 hover:border-yellow-500 hover:bg-yellow-500/5"
                        onClick={() => {
                          const combo = `1. Glicose 50% 4 ampolas (40ml) EV em bolus lento.\n2. Reavaliar HGT em 15 minutos.`;
                          setDescription(prev => prev ? `${prev}\n${combo}` : combo);
                          toast.success("Combo Hipoglicemia inserido");
                        }}
                      >
                        🩸 + Hipoglicemia (Glicose 50%)
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-amber-500/20 hover:border-amber-500 hover:bg-amber-500/5"
                        onClick={() => {
                          const combo = `1. Soro Fisiológico 0.9% 500ml EV - correr em 2 horas em bomba de infusão ou gotejamento rápido para hidratação endovenosa.`;
                          setDescription(prev => prev ? `${prev}\n${combo}` : combo);
                          toast.success("Combo de Hidratação inserido");
                        }}
                      >
                        💧 + Hidratação Venosa 500ml
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-purple-500/20 hover:border-purple-500 hover:bg-purple-500/5"
                        onClick={() => {
                          const combo = `1. Inalação com Soro Fisiológico 0.9% 5ml + Fenoterol (Berotec) 5 gotas + Ipratrópio (Atrovent) 10 gotas. Realizar a cada 20 minutos, até 3 vezes se broncoespasmo grave.`;
                          setDescription(prev => prev ? `${prev}\n${combo}` : combo);
                          toast.success("Combo de Nebulização inserido");
                        }}
                      >
                        🫁 + Nebulização (Berotec/Atrovent)
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Resumo de Alta Médica / Desfechos */}
                {evolutionType === "Alta" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[10px]">
                        👋 Desfecho Clínico: Resumos Padrão de Alta (UPA 24h)
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        Modelos Estruturados
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/5"
                        onClick={() => {
                          const combo = `DESFECHO: ALTA MÉDICA (MELHORADO)\n\nPaciente evoluiu com melhora clínica após medicações realizadas na unidade. No momento: hemodinamicamente estável, eupneico, acianótico, afebril, consciente e orientado. Sem queixas álgicas agudas.\n\nConduta: Alta com orientações de sinais de alarme e receituário médico em mãos. Orientado a retornar se piora do quadro.`;
                          setDescription(combo);
                          toast.success("Resumo de Alta inserido");
                        }}
                      >
                        ✅ + Alta Médica (Melhorado)
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-amber-500/20 hover:border-amber-500 hover:bg-amber-500/5"
                        onClick={() => {
                          const combo = `DESFECHO: ALTA A PEDIDO\n\nPaciente solicita alta a pedido, declarando-se ciente dos riscos de interromper a avaliação/tratamento clínico proposto. Orientado(a) quanto aos sinais de alarme e gravidade. \n\nConduta: Assina o Termo de Responsabilidade (Evasão/Alta a Pedido) que deverá ser anexado ao prontuário impresso.`;
                          setDescription(combo);
                          toast.success("Resumo de Alta a Pedido inserido");
                        }}
                      >
                        📜 + Alta a Pedido (Contra Orientação)
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/5"
                        onClick={() => {
                          const combo = `DESFECHO: TRANSFERÊNCIA HOSPITALAR\n\nPaciente necessita de avaliação de especialidade / internação não disponível nesta unidade. Vaga solicitada via CROSS/Central de Regulação.\n\nConduta: Transferido via ambulância acompanhado de equipe, monitorizado e com suporte adequado. Prontuário e exames entregues à equipe de transporte.`;
                          setDescription(combo);
                          toast.success("Resumo de Transferência inserido");
                        }}
                      >
                        🚑 + Transferência Hospitalar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-red-500/20 hover:border-red-500 hover:bg-red-500/5"
                        onClick={() => {
                          const combo = `DESFECHO: EVASÃO\n\nPaciente evadiu-se da unidade antes do término do atendimento ou avaliação médica/reavaliação. Retirado acesso venoso (caso aplicável). \n\nComunicado à equipe de enfermagem e recepção. Prontuário encerrado administrativamente por evasão.`;
                          setDescription(combo);
                          toast.success("Resumo de Evasão inserido");
                        }}
                      >
                        🏃 + Evasão
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-[10px] font-bold border-stone-500/20 hover:border-stone-500 hover:bg-stone-500/5"
                        onClick={() => {
                          const combo = `DESFECHO: ÓBITO\n\nPaciente apresentou Parada Cardiorrespiratória (PCR). Iniciadas manobras de RCP avançada conforme protocolo ACLS. Sem retorno da circulação espontânea após [COMPLETAR] minutos de reanimação. Constatado óbito às [HORÁRIO].\n\nConduta: Encaminhado corpo para o morgue. Comunicado aos familiares presentes na unidade. Emitida Declaração de Óbito.`;
                          setDescription(combo);
                          toast.success("Resumo de Óbito inserido");
                        }}
                      >
                        ✝️ + Óbito (PCR)
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Super Painel Evolução Médica (Adulto) */}
                {evolutionType === "Evolução Médica" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🩺 Super Painel Médico (Adulto UPA 24h)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* 1. Exame Físico & Neuro */}
                      <div className="space-y-2 relative">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          1. Exame Físico & Neuro
                        </span>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMedicalNeuroDropdownOpen(!isMedicalNeuroDropdownOpen);
                              setIsMedicalSyndromeDropdownOpen(false);
                              setIsMedicalConductDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500/20",
                              isMedicalNeuroDropdownOpen ? "border-green-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-green-500/10 text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                              </span>
                              <span>Selecionar Exame...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = MEDICAL_PHYSICAL_NEURO_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-green-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isMedicalNeuroDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isMedicalNeuroDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMedicalNeuroDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-green-500/20 bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {MEDICAL_PHYSICAL_NEURO_ITEMS.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive 
                                            ? "bg-green-500/5 text-green-700 dark:text-green-400 font-bold border border-green-500/20" 
                                            : "hover:bg-muted/70 text-foreground border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-green-600 dark:text-green-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 2. Síndromes Clínicas Comuns */}
                      <div className="space-y-2 relative">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          2. Síndromes Clínicas Comuns
                        </span>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMedicalSyndromeDropdownOpen(!isMedicalSyndromeDropdownOpen);
                              setIsMedicalNeuroDropdownOpen(false);
                              setIsMedicalConductDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20",
                              isMedicalSyndromeDropdownOpen ? "border-red-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-red-500/10 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h4.28"/></svg>
                              </span>
                              <span>Selecionar Síndrome...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = MEDICAL_SYNDROME_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isMedicalSyndromeDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isMedicalSyndromeDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMedicalSyndromeDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-red-500/20 bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {MEDICAL_SYNDROME_ITEMS.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive 
                                            ? "bg-red-500/5 text-red-700 dark:text-red-400 font-bold border border-red-500/20" 
                                            : "hover:bg-muted/70 text-foreground border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-red-600 dark:text-red-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 3. Solicitações e Condutas Rápidas */}
                      <div className="space-y-2 relative">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          3. Solicitações e Condutas Rápidas
                        </span>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMedicalConductDropdownOpen(!isMedicalConductDropdownOpen);
                              setIsMedicalNeuroDropdownOpen(false);
                              setIsMedicalSyndromeDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                              isMedicalConductDropdownOpen ? "border-blue-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                              </span>
                              <span>Selecionar Conduta...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = MEDICAL_CONDUCT_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isMedicalConductDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isMedicalConductDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMedicalConductDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-blue-500/20 bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {MEDICAL_CONDUCT_ITEMS.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive 
                                            ? "bg-blue-500/5 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/20" 
                                            : "hover:bg-muted/70 text-foreground border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Resumo de Evolução Pediátrica */}
                {evolutionType === "Evolução Médica (Pediátrica)" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🧸 Super Painel Médico (Pediatria UPA 24h)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* 1. Exame Físico Inicial & Traumas */}
                      <div className="space-y-2 relative">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          1. Exame Físico Inicial & Traumas
                        </span>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPediatricNeuroDropdownOpen(!isPediatricNeuroDropdownOpen);
                              setIsPediatricSyndromeDropdownOpen(false);
                              setIsPediatricConductDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500/20",
                              isPediatricNeuroDropdownOpen ? "border-green-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-green-500/10 text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                              </span>
                              <span>Selecionar Exame...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = PEDIATRIC_PHYSICAL_NEURO_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-green-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isPediatricNeuroDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isPediatricNeuroDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsPediatricNeuroDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-green-500/20 bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {PEDIATRIC_PHYSICAL_NEURO_ITEMS.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive 
                                            ? "bg-green-500/5 text-green-700 dark:text-green-400 font-bold border border-green-500/20" 
                                            : "hover:bg-muted/70 text-foreground border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-green-600 dark:text-green-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 2. Síndromes Pediátricas Comuns */}
                      <div className="space-y-2 relative">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          2. Síndromes Pediátricas Comuns
                        </span>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPediatricSyndromeDropdownOpen(!isPediatricSyndromeDropdownOpen);
                              setIsPediatricNeuroDropdownOpen(false);
                              setIsPediatricConductDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20",
                              isPediatricSyndromeDropdownOpen ? "border-red-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-red-500/10 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h4.28"/></svg>
                              </span>
                              <span>Selecionar Síndrome...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = PEDIATRIC_SYNDROME_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isPediatricSyndromeDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isPediatricSyndromeDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsPediatricSyndromeDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-red-500/20 bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {PEDIATRIC_SYNDROME_ITEMS.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive 
                                            ? "bg-red-500/5 text-red-700 dark:text-red-400 font-bold border border-red-500/20" 
                                            : "hover:bg-muted/70 text-foreground border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-red-600 dark:text-red-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 3. Condutas Rápidas (Pediatria) */}
                      <div className="space-y-2 relative">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          3. Condutas Rápidas (Pediatria)
                        </span>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPediatricConductDropdownOpen(!isPediatricConductDropdownOpen);
                              setIsPediatricNeuroDropdownOpen(false);
                              setIsPediatricSyndromeDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                              isPediatricConductDropdownOpen ? "border-blue-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                              </span>
                              <span>Selecionar Conduta...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = PEDIATRIC_CONDUCT_ITEMS.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isPediatricConductDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isPediatricConductDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsPediatricConductDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-blue-500/20 bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {PEDIATRIC_CONDUCT_ITEMS.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive 
                                            ? "bg-blue-500/5 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/20" 
                                            : "hover:bg-muted/70 text-foreground border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Super Painel Equipe Técnica (Anotação de Enfermagem) */}
                {evolutionType === "Anotação de Enfermagem" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        💉 Super Painel da Equipe Técnica (Anotações UPA 24h)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 1. Rotinas de Medicação e Acesso */}
                      <div className="space-y-2 relative">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          1. Rotinas de Medicação e Acesso
                        </span>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMedicationDropdownOpen(!isMedicationDropdownOpen);
                              setIsCareDropdownOpen(false);
                              setIsComfortDropdownOpen(false);
                              setIsMovementDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20",
                              isMedicationDropdownOpen ? "border-red-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-red-500/10 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-syringe"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-.2.2-.5.3-.7.3H5v-3c0-.3.1-.5.3-.7L15.6 5.6"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>
                              </span>
                              <span>Selecionar Rotinas...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = medicationItems.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isMedicationDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isMedicationDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMedicationDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-red-500/20 bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {medicationItems.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive 
                                            ? "bg-red-500/5 text-red-700 dark:text-red-400 font-bold border border-red-500/20" 
                                            : "hover:bg-muted/70 text-foreground border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-red-600 dark:text-red-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 2. Checklist de Cuidados de Enfermagem */}
                      <div className="space-y-2 relative">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          2. Checklist de Cuidados de Enfermagem
                        </span>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCareDropdownOpen(!isCareDropdownOpen);
                              setIsMedicationDropdownOpen(false);
                              setIsComfortDropdownOpen(false);
                              setIsMovementDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                              isCareDropdownOpen ? "border-blue-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
                              </span>
                              <span>Selecionar Cuidados...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = careItems.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isCareDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isCareDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsCareDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-blue-500/20 bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {careItems.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive 
                                            ? "bg-blue-500/5 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/20" 
                                            : "hover:bg-muted/70 text-foreground border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 3. Cuidados, Conforto e Dieta Padrão */}
                      <div className="space-y-2 relative">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          3. Cuidados, Conforto e Dieta Padrão
                        </span>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsComfortDropdownOpen(!isComfortDropdownOpen);
                              setIsMedicationDropdownOpen(false);
                              setIsCareDropdownOpen(false);
                              setIsMovementDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20",
                              isComfortDropdownOpen ? "border-orange-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-orange-500/10 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bed"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
                              </span>
                              <span>Selecionar Conforto...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = comfortItems.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-orange-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isComfortDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isComfortDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsComfortDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-orange-500/20 bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {comfortItems.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive 
                                            ? "bg-orange-500/5 text-orange-700 dark:text-orange-400 font-bold border border-orange-500/20" 
                                            : "hover:bg-muted/70 text-foreground border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 4. Movimentação e Ocorrências */}
                      <div className="space-y-2 relative">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          4. Movimentação e Ocorrências
                        </span>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMovementDropdownOpen(!isMovementDropdownOpen);
                              setIsMedicationDropdownOpen(false);
                              setIsCareDropdownOpen(false);
                              setIsComfortDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                              isMovementDropdownOpen ? "border-indigo-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-indigo-500/10 text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                              </span>
                              <span>Selecionar Ocorrências...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = movementItems.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-indigo-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isMovementDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isMovementDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMovementDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-indigo-500/20 bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {movementItems.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive 
                                            ? "bg-indigo-500/5 text-indigo-700 dark:text-indigo-400 font-bold border border-indigo-500/20" 
                                            : "hover:bg-muted/70 text-foreground border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ---------------- MULTIDISCIPLINAR PANELS ---------------- */}
                {evolutionType === "Evolução da Fisioterapia" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🫁 Super Painel da Fisioterapia {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação e Rotina", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>, "blue", isChild ? FISIO_PED_ITEMS : FISIO_ADULT_ITEMS, isFisioEvalDropdownOpen, () => { setIsFisioEvalDropdownOpen(!isFisioEvalDropdownOpen); setIsFisioProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Procedimentos e Condutas", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, "green", isChild ? FISIO_PED_PROCEDURES : FISIO_ADULT_PROCEDURES, isFisioProcDropdownOpen, () => { setIsFisioProcDropdownOpen(!isFisioProcDropdownOpen); setIsFisioEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {evolutionType === "Evolução da Nutrição" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🥗 Super Painel da Nutrição {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação Nutricional", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>, "amber", isChild ? NUTRI_PED_ITEMS : NUTRI_ADULT_ITEMS, isNutriEvalDropdownOpen, () => { setIsNutriEvalDropdownOpen(!isNutriEvalDropdownOpen); setIsNutriProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Condutas e Dietas", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>, "green", isChild ? NUTRI_PED_PROCEDURES : NUTRI_ADULT_PROCEDURES, isNutriProcDropdownOpen, () => { setIsNutriProcDropdownOpen(!isNutriProcDropdownOpen); setIsNutriEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {evolutionType === "Evolução da Psicologia" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🧠 Super Painel da Psicologia {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação Psicológica", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, "purple", isChild ? PSICO_PED_ITEMS : PSICO_ADULT_ITEMS, isPsicoEvalDropdownOpen, () => { setIsPsicoEvalDropdownOpen(!isPsicoEvalDropdownOpen); setIsPsicoProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Condutas e Manejo", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-handshake"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>, "pink", isChild ? PSICO_PED_PROCEDURES : PSICO_ADULT_PROCEDURES, isPsicoProcDropdownOpen, () => { setIsPsicoProcDropdownOpen(!isPsicoProcDropdownOpen); setIsPsicoEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {evolutionType === "Evolução do Serviço Social" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🤝 Super Painel do Serviço Social {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação Social", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>, "blue", isChild ? SOCIAL_PED_ITEMS : SOCIAL_ADULT_ITEMS, isSocialEvalDropdownOpen, () => { setIsSocialEvalDropdownOpen(!isSocialEvalDropdownOpen); setIsSocialProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Condutas e Encaminhamentos", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>, "amber", isChild ? SOCIAL_PED_PROCEDURES : SOCIAL_ADULT_PROCEDURES, isSocialProcDropdownOpen, () => { setIsSocialProcDropdownOpen(!isSocialProcDropdownOpen); setIsSocialEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {evolutionType === "Evolução da Terapia Ocupacional" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🧩 Super Painel da Terapia Ocupacional {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação Funcional", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>, "amber", isChild ? TO_PED_ITEMS : TO_ADULT_ITEMS, isToEvalDropdownOpen, () => { setIsToEvalDropdownOpen(!isToEvalDropdownOpen); setIsToProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Condutas e Estimulação", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-puzzle"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.611c-.941.941-2.468.941-3.409 0L12 19.828c-.23-.23-.556-.338-.878-.289a2.33 2.33 0 0 1-2.78-2.78c-.049-.322-.157-.648-.387-.878l-1.568-1.568c-.941-.941-.941-2.468 0-3.409l1.61-1.611a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.611c.941-.941 2.468-.941 3.409 0L19.44 7.85Z"/></svg>, "pink", isChild ? TO_PED_PROCEDURES : TO_ADULT_PROCEDURES, isToProcDropdownOpen, () => { setIsToProcDropdownOpen(!isToProcDropdownOpen); setIsToEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {evolutionType === "Evolução da Fonoaudiologia" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        🗣️ Super Painel da Fonoaudiologia {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação Fonoaudiológica", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>, "blue", isChild ? FONO_PED_ITEMS : FONO_ADULT_ITEMS, isFonoEvalDropdownOpen, () => { setIsFonoEvalDropdownOpen(!isFonoEvalDropdownOpen); setIsFonoProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Condutas e Disfagia", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-glass-water"><path d="M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.81 17.21A2 2 0 0 1 15.2 22Z"/><path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0"/></svg>, "green", isChild ? FONO_PED_PROCEDURES : FONO_ADULT_PROCEDURES, isFonoProcDropdownOpen, () => { setIsFonoProcDropdownOpen(!isFonoProcDropdownOpen); setIsFonoEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {evolutionType === "Evolução da Farmácia Clínica" && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        💊 Super Painel da Farmácia Clínica {isChild && "(Pediatria)"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderPanelDropdown("1. Avaliação Farmacêutica", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-plus"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 14h6"/><path d="M12 11v6"/></svg>, "amber", isChild ? FARMA_PED_ITEMS : FARMA_ADULT_ITEMS, isFarmaEvalDropdownOpen, () => { setIsFarmaEvalDropdownOpen(!isFarmaEvalDropdownOpen); setIsFarmaProcDropdownOpen(false); })}
                      {renderPanelDropdown("2. Condutas e Reconciliação", <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pill"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>, "pink", isChild ? FARMA_PED_PROCEDURES : FARMA_ADULT_PROCEDURES, isFarmaProcDropdownOpen, () => { setIsFarmaProcDropdownOpen(!isFarmaProcDropdownOpen); setIsFarmaEvalDropdownOpen(false); })}
                    </div>
                  </motion.div>
                )}

                {/* Super Painel SAE Enfermagem */}
                {evolutionType === "Evolução Enfermagem" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-500/20 pb-2">
                      <span className="font-extrabold text-[#006699] uppercase tracking-wider text-[11px]">
                        📋 Super Painel SAE - Processo de Enfermagem (UPA 24h)
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 1. Rotinas de Admissão por Setor */}
                      <div className="space-y-2 relative">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          1. Rotinas de Admissão por Setor
                        </span>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsSaeAdmissionDropdownOpen(!isSaeAdmissionDropdownOpen);
                              setIsSaeCareDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20",
                              isSaeAdmissionDropdownOpen ? "border-red-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-red-500/10 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-door-open"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h20"/><path d="M13 20V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16"/><path d="M6 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>
                              </span>
                              <span>Selecionar Rotinas...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = admissionItems.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isSaeAdmissionDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isSaeAdmissionDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsSaeAdmissionDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-red-500/20 bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {admissionItems.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive 
                                            ? "bg-red-500/5 text-red-700 dark:text-red-400 font-bold border border-red-500/20" 
                                            : "hover:bg-muted/70 text-foreground border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-red-600 dark:text-red-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* 2. Checklist de Cuidados de Enfermagem */}
                      <div className="space-y-2 relative">
                        <span className="text-[9px] font-black uppercase text-muted-foreground block">
                          2. Checklist de Cuidados de Enfermagem (Inserir no text)
                        </span>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsSaeCareDropdownOpen(!isSaeCareDropdownOpen);
                              setIsSaeAdmissionDropdownOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between w-full px-4 py-2.5 rounded-xl border bg-background hover:bg-muted/50 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                              isSaeCareDropdownOpen ? "border-blue-500 text-foreground" : "border-muted-foreground/20 text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h3.16"/></svg>
                              </span>
                              <span>Selecionar Cuidados...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const count = careItems.filter(item => normalizeText(description).includes(normalizeText(item.text).trim())).length;
                                return count > 0 ? (
                                  <Badge className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-none shadow-sm animate-in zoom-in-50 duration-200">
                                    {count}
                                  </Badge>
                                ) : null;
                              })()}
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down text-muted-foreground/60 transition-transform duration-200", isSaeCareDropdownOpen && "transform rotate-180")}><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isSaeCareDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsSaeCareDropdownOpen(false)} />
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl border border-blue-500/20 bg-popover text-popover-foreground shadow-xl z-50 max-h-[280px] overflow-y-auto overflow-x-hidden space-y-1 scrollbar-thin scrollbar-thumb-muted"
                                >
                                  {careItems.map((item) => {
                                    const isActive = normalizeText(description).includes(normalizeText(item.text).trim());
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCareItem(item.text, item.toastMsg)}
                                        className={cn(
                                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-all",
                                          isActive 
                                            ? "bg-blue-500/5 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/20" 
                                            : "hover:bg-muted/70 text-foreground border border-transparent"
                                        )}
                                      >
                                        <span className="truncate">{item.label}</span>
                                        {isActive ? (
                                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                            Adicionado ✓
                                          </span>
                                        ) : (
                                          <span className="text-[10px] text-muted-foreground/40 font-semibold group-hover:text-muted-foreground/60 transition-colors">
                                            + Inserir
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>


                    {/* 3. Escalas Clínicas */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">3. Escalas Clínicas e de Risco</span>
                        <Badge variant="outline" className="text-[8px] uppercase tracking-wider bg-primary/5 text-primary border-primary/20">Adaptativas</Badge>
                      </div>

                      {/* Adult Scales (!isChild) */}
                      {!isChild && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-10 gap-2">
                          {/* Card Morse */}
                          <button
                            type="button"
                            onClick={() => setOpenMorseCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedMorse 
                                ? "bg-amber-500/5 border-amber-500/30 dark:bg-amber-500/10" 
                                : "bg-card border-border hover:border-amber-500/40 hover:bg-amber-500/5"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedMorse ? "text-amber-600 dark:text-amber-400" : "text-foreground/80 group-hover:text-amber-600 dark:group-hover:text-amber-400")}>Morse (Quedas)</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedMorse ? "bg-amber-500" : "bg-amber-500/15")}>
                                <ShieldAlert className={cn("h-3 w-3", selectedMorse ? "text-white" : "text-amber-600")} />
                              </div>
                            </div>
                            {selectedMorse ? (
                              <Badge className="h-4 text-[9px] font-bold bg-amber-500 hover:bg-amber-600 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedMorse}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card Braden */}
                          <button
                            type="button"
                            onClick={() => setOpenBradenCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedBraden 
                                ? "bg-orange-500/5 border-orange-500/30 dark:bg-orange-500/10" 
                                : "bg-card border-border hover:border-orange-500/40 hover:bg-orange-500/5"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedBraden ? "text-orange-600 dark:text-orange-400" : "text-foreground/80 group-hover:text-orange-600 dark:group-hover:text-orange-400")}>Braden (LPP)</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedBraden ? "bg-orange-500" : "bg-orange-500/15")}>
                                <Activity className={cn("h-3 w-3", selectedBraden ? "text-white" : "text-orange-600")} />
                              </div>
                            </div>
                            {selectedBraden ? (
                              <Badge className="h-4 text-[9px] font-bold bg-orange-500 hover:bg-orange-600 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedBraden}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card EVA */}
                          <button
                            type="button"
                            onClick={() => setOpenEvaCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedEva 
                                ? "bg-red-500/5 border-red-500/30 dark:bg-red-500/10" 
                                : "bg-card border-border hover:border-red-500/40 hover:bg-red-500/5"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedEva ? "text-red-600 dark:text-red-400" : "text-foreground/80 group-hover:text-red-600 dark:group-hover:text-red-400")}>Dor (EVA)</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedEva ? "bg-red-500" : "bg-red-500/15")}>
                                <Heart className={cn("h-3 w-3", selectedEva ? "text-white" : "text-red-600")} />
                              </div>
                            </div>
                            {selectedEva ? (
                              <Badge className="h-4 text-[9px] font-bold bg-red-500 hover:bg-red-600 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedEva}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card MEWS */}
                          <button
                            type="button"
                            onClick={() => setOpenMewsCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedMews 
                                ? "bg-blue-500/5 border-blue-500/30 dark:bg-blue-500/10" 
                                : "bg-card border-border hover:border-blue-500/40 hover:bg-blue-500/5"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedMews ? "text-blue-600 dark:text-blue-400" : "text-foreground/80 group-hover:text-blue-600 dark:group-hover:text-blue-400")}>MEWS (Alerta)</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedMews ? "bg-blue-500" : "bg-blue-500/15")}>
                                <Activity className={cn("h-3 w-3", selectedMews ? "text-white" : "text-blue-600")} />
                              </div>
                            </div>
                            {selectedMews ? (
                              <Badge className="h-4 text-[9px] font-bold bg-blue-600 hover:bg-blue-700 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedMews}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card NEWS2 */}
                          <button
                            type="button"
                            onClick={() => setOpenNews2Calc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedNews2 
                                ? "bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-500/10" 
                                : "bg-card border-border hover:border-emerald-500/40 hover:bg-emerald-500/5"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedNews2 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground/80 group-hover:text-emerald-600 dark:group-hover:text-emerald-400")}>NEWS2</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedNews2 ? "bg-emerald-500" : "bg-emerald-500/15")}>
                                <Activity className={cn("h-3 w-3", selectedNews2 ? "text-white" : "text-emerald-600")} />
                              </div>
                            </div>
                            {selectedNews2 ? (
                              <Badge className="h-4 text-[9px] font-bold bg-emerald-500 hover:bg-emerald-600 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedNews2}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card qSOFA */}
                          <button
                            type="button"
                            onClick={() => setOpenQsofaCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedQsofa 
                                ? "bg-purple-500/5 border-purple-500/30 dark:bg-purple-500/10" 
                                : "bg-card border-border hover:border-purple-500/40 hover:bg-purple-500/5"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedQsofa ? "text-purple-600 dark:text-purple-400" : "text-foreground/80 group-hover:text-purple-600 dark:group-hover:text-purple-400")}>qSOFA (Sepse)</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedQsofa ? "bg-purple-500" : "bg-purple-500/15")}>
                                <ShieldAlert className={cn("h-3 w-3", selectedQsofa ? "text-white" : "text-purple-600")} />
                              </div>
                            </div>
                            {selectedQsofa ? (
                              <Badge className="h-4 text-[9px] font-bold bg-purple-600 hover:bg-purple-700 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedQsofa}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card Glasgow */}
                          <button
                            type="button"
                            onClick={() => setOpenGlasgowCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedGlasgow 
                                ? "bg-indigo-500/5 border-indigo-500/30 dark:bg-indigo-500/10" 
                                : "bg-card border-border hover:border-indigo-500/40 hover:bg-indigo-500/5"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedGlasgow ? "text-indigo-600 dark:text-indigo-400" : "text-foreground/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-400")}>Glasgow (GCS)</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedGlasgow ? "bg-indigo-500" : "bg-indigo-500/15")}>
                                <Brain className={cn("h-3 w-3", selectedGlasgow ? "text-white" : "text-indigo-600")} />
                              </div>
                            </div>
                            {selectedGlasgow ? (
                              <Badge className="h-4 text-[9px] font-bold bg-indigo-600 hover:bg-indigo-700 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedGlasgow}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card Saúde Mental */}
                          <button
                            type="button"
                            onClick={() => setOpenMentalCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedMentalSummary 
                                ? "bg-violet-500/5 border-violet-500/30 dark:bg-violet-500/10" 
                                : "bg-card border-border hover:border-violet-500/40 hover:bg-violet-500/5"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedMentalSummary ? "text-violet-600 dark:text-violet-400" : "text-foreground/80 group-hover:text-violet-600 dark:group-hover:text-violet-400")}>Saúde Mental</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedMentalSummary ? "bg-violet-500" : "bg-violet-500/15")}>
                                <Brain className={cn("h-3 w-3", selectedMentalSummary ? "text-white" : "text-violet-600")} />
                              </div>
                            </div>
                            {selectedMentalSummary ? (
                              <Badge className="h-4 text-[9px] font-bold bg-violet-600 hover:bg-violet-700 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedMentalSummary}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card Urgências Clínicas */}
                          <button
                            type="button"
                            onClick={() => setOpenUrgencyCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedUrgencySummary 
                                ? "bg-rose-500/5 border-rose-500/30 dark:bg-rose-500/10" 
                                : "bg-card border-border hover:border-rose-500/40 hover:bg-rose-500/5"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedUrgencySummary ? "text-rose-600 dark:text-rose-400" : "text-foreground/80 group-hover:text-rose-600 dark:group-hover:text-rose-400")}>Urgências</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedUrgencySummary ? "bg-rose-500" : "bg-rose-500/15")}>
                                <ShieldAlert className={cn("h-3 w-3", selectedUrgencySummary ? "text-white" : "text-rose-600")} />
                              </div>
                            </div>
                            {selectedUrgencySummary ? (
                              <Badge className="h-4 text-[9px] font-bold bg-rose-600 hover:bg-rose-700 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedUrgencySummary}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card Escalas de Enfermagem */}
                          <button
                            type="button"
                            onClick={() => setOpenNursingCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedNursingSummary 
                                ? "bg-cyan-500/5 border-cyan-500/30 dark:bg-cyan-500/10" 
                                : "bg-card border-border hover:border-cyan-500/40 hover:bg-cyan-500/5"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[9px] font-black uppercase tracking-wider transition-colors", selectedNursingSummary ? "text-cyan-600 dark:text-cyan-400" : "text-foreground/80 group-hover:text-cyan-600 dark:group-hover:text-cyan-400")}>Enfermagem</span>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedNursingSummary ? "bg-cyan-500" : "bg-cyan-500/15")}>
                                <Activity className={cn("h-3 w-3", selectedNursingSummary ? "text-white" : "text-cyan-600")} />
                              </div>
                            </div>
                            {selectedNursingSummary ? (
                              <Badge className="h-4 text-[9px] font-bold bg-cyan-600 hover:bg-cyan-700 border-none text-white px-1.5 rounded truncate max-w-full">
                                {selectedNursingSummary}
                              </Badge>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Pediatric Scales (isChild) */}
                      {isChild && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Card PEWS */}
                          <button
                            type="button"
                            onClick={() => setOpenPewsCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-3 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedPews 
                                ? "bg-teal-500/5 border-teal-500/30 dark:bg-teal-500/10" 
                                : "bg-card border-border hover:border-teal-500/40 hover:bg-teal-500/5"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[11px] font-black uppercase tracking-wider transition-colors", selectedPews ? "text-teal-600 dark:text-teal-400" : "text-foreground/80 group-hover:text-teal-600 dark:group-hover:text-teal-400")}>PEWS (Alerta Pediátrico)</span>
                              <div className={cn("w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedPews ? "bg-teal-500" : "bg-teal-500/15")}>
                                <Baby className={cn("h-3.5 w-3.5", selectedPews ? "text-white" : "text-teal-600")} />
                              </div>
                            </div>
                            {selectedPews ? (
                              <Badge className="h-5 text-[10px] font-bold bg-teal-600 hover:bg-teal-700 border-none text-white px-2 rounded truncate max-w-full">
                                {selectedPews}
                              </Badge>
                            ) : (
                              <span className="text-[10px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>

                          {/* Card EVA */}
                          <button
                            type="button"
                            onClick={() => setOpenEvaCalc(true)}
                            className={cn(
                              "flex flex-col items-start p-3 rounded-xl border text-left transition-all relative overflow-hidden group",
                              selectedEva 
                                ? "bg-red-500/5 border-red-500/30 dark:bg-red-500/10" 
                                : "bg-card border-border hover:border-red-500/40 hover:bg-red-500/5"
                            )}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <span className={cn("text-[11px] font-black uppercase tracking-wider transition-colors", selectedEva ? "text-red-600 dark:text-red-400" : "text-foreground/80 group-hover:text-red-600 dark:group-hover:text-red-400")}>Escala de Dor (EVA)</span>
                              <div className={cn("w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-colors", selectedEva ? "bg-red-500" : "bg-red-500/15")}>
                                <Heart className={cn("h-4 w-4", selectedEva ? "text-white" : "text-red-600")} />
                              </div>
                            </div>
                            {selectedEva ? (
                              <Badge className="h-5 text-[10px] font-bold bg-red-500 hover:bg-red-600 border-none text-white px-2 rounded">
                                {selectedEva}
                              </Badge>
                            ) : (
                              <span className="text-[10px] font-bold text-muted-foreground/60">Não Avaliado</span>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 4. Diagnósticos NANDA/NIC/NOC */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">4. Diagnósticos e Planejamento de Enfermagem (NANDA, NOC, NIC)</span>
                        <Badge variant="outline" className="text-[8px] uppercase tracking-wider bg-primary/5 text-primary border-primary/20">Taxonomia Oficial</Badge>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        <button
                          type="button"
                          onClick={() => setOpenNandaCalc(true)}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all hover:border-primary/40 hover:bg-muted/30 group w-full sm:w-auto",
                            activeNandaPlan 
                              ? "bg-primary/5 border-primary/30 text-primary" 
                              : "bg-card border-border"
                          )}
                        >
                          <Activity className="h-4 w-4 text-primary group-hover:animate-pulse" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground group-hover:text-foreground">Abrir Planejador NANDA-NOC-NIC</span>
                            {activeNandaPlan ? (
                              <span className="text-[9px] font-bold text-primary">{activeNandaPlan}</span>
                            ) : (
                              <span className="text-[9px] font-bold text-muted-foreground/60">Planejar cuidados integrados do paciente</span>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>

                  </motion.div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      {evolutionType === "Sinais Vitais" ? "Observações Clínicas Adicionais (opcional)" : "Descrição *"}
                    </Label>
                    <div className="flex items-center gap-2">
                      {description && (
                        <button
                          type="button"
                          onClick={() => setDescription("")}
                          className="text-[9px] font-extrabold text-red-500 hover:underline uppercase tracking-wider bg-red-500/5 px-2 py-0.5 rounded border border-red-500/15 transition-all"
                        >
                          Limpar Texto
                        </button>
                      )}
                      {evolutionType && EVOLUTION_TEMPLATES[evolutionType] && (
                        <button
                          type="button"
                          onClick={() => setDescription(EVOLUTION_TEMPLATES[evolutionType])}
                          className="text-[9px] font-extrabold text-[#006699] hover:underline uppercase tracking-wider bg-[#006699]/5 px-2 py-0.5 rounded border border-[#006699]/15 transition-all"
                        >
                          Carregar Modelo Padrão
                        </button>
                      )}
                    </div>
                  </div>
                  <Textarea 
                    placeholder={evolutionType === "Sinais Vitais" ? "Observações clínicas, aspecto geral do paciente, queixas, etc." : "Descreva a evolução do paciente..."} 
                    className="min-h-[140px] bg-background border-muted-foreground/20 resize-none text-xs leading-relaxed"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Carimbo Digital persistent configuration section */}
                <div className="border border-border/50 rounded-xl bg-slate-500/5 dark:bg-slate-500/10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsStampConfigOpen(!isStampConfigOpen)}
                    className="w-full px-4 py-2.5 bg-muted/40 hover:bg-muted/60 transition-colors flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground"
                  >
                    <span>🖋️ Carimbo Digital & Assinatura (COREN / CRM)</span>
                    <span className="font-mono text-xs">{isStampConfigOpen ? "Recolher ▲" : "Configurar ▼"}</span>
                  </button>
                  {isStampConfigOpen && (
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 bg-card border-t border-border/50">
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Nome Completo</Label>
                        <Input 
                          placeholder="Dr(a). / Enf." 
                          className="h-8 text-xs bg-background"
                          value={stampName}
                          onChange={(e) => {
                            setStampName(e.target.value);
                            setProfessional(e.target.value);
                            localStorage.setItem("upa_stamp_name", e.target.value);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Conselho</Label>
                        <Select 
                          value={stampCouncil} 
                          onValueChange={(val) => {
                            setStampCouncil(val);
                            localStorage.setItem("upa_stamp_council", val);
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CRM">CRM (Médico)</SelectItem>
                            <SelectItem value="COREN">COREN (Enfermeiro)</SelectItem>
                            <SelectItem value="COREN-TEC">COREN (Técnico)</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">Número de Registro</Label>
                        <Input 
                          placeholder="Apenas números" 
                          className="h-8 text-xs bg-background"
                          value={stampNumber}
                          onChange={(e) => {
                            setStampNumber(e.target.value);
                            localStorage.setItem("upa_stamp_number", e.target.value);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground">UF</Label>
                        <Input 
                          placeholder="Ex: SP" 
                          className="h-8 text-xs bg-background uppercase"
                          value={stampState}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase().slice(0, 2);
                            setStampState(val);
                            localStorage.setItem("upa_stamp_state", val);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2.5 pt-1">
                  <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="font-bold uppercase text-[9px] tracking-widest h-8 px-4">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveEvolution}
                    className="bg-[#006699] hover:bg-[#005580] text-white font-bold uppercase text-[9px] tracking-widest h-8 px-5 rounded-md shadow-sm active:scale-95"
                  >
                    Salvar Registro
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <h2 className="text-sm font-black tracking-widest text-[#006699] dark:text-sky-400 uppercase">Linha do Tempo de Atendimento</h2>
        
        {evolutions.length === 0 ? (
          <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 transition-colors duration-500">
            <CardContent className="h-36 flex items-center justify-center bg-muted/5">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/30 px-8 text-center leading-relaxed">Nenhuma evolução registrada para este paciente.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-6">
            {evolutions.map((record) => (
              <motion.div 
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#006699] dark:border-sky-400 bg-background flex items-center justify-center shadow-sm z-10">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#006699] dark:bg-sky-400" />
                </div>

                <Card className="glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-xl rounded-xl overflow-hidden bg-white/70 dark:bg-slate-900/45 hover:bg-white/90 dark:hover:bg-slate-900/60 transition-all duration-300">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                      <div className="flex items-center gap-2.5">
                        <Badge className="bg-[#006699]/10 dark:bg-sky-400/10 hover:bg-[#006699]/20 text-[#006699] dark:text-sky-300 border-none text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          {record.type}
                        </Badge>
                        <span className="text-xs font-black text-foreground/90 uppercase tracking-wide">
                          {record.professional.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {record.cid && (
                          <Badge className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border-none font-bold text-[10px] uppercase py-0.5 px-2 rounded-full shadow-sm">
                            CID: {record.cid}
                          </Badge>
                        )}
                        <span className="text-xs font-bold text-muted-foreground/80">
                          {record.timestamp}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-foreground/95 leading-relaxed font-medium whitespace-pre-line">
                      {record.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={isBedDialogOpen} onOpenChange={setIsBedDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title">Gerenciar Leito</DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest">
              {patient.name.toUpperCase().includes('NÃO IDENTIFICADO') || patient.name.toUpperCase().includes('DESCONHECIDO') 
                ? "PACIENTE NÃO IDENTIFICADO" 
                : patient.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {patientBed ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Leito Atual</p>
                  <p className="text-lg font-bold">{patientBed.name}</p>
                  <p className="text-[10px] text-muted-foreground">{patientBed.ward} · {patientBed.room}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-red-500/30 text-red-600 hover:bg-red-500/5 font-bold uppercase tracking-widest text-[10px]"
                  onClick={() => {
                    releaseBed(patientBed.id);
                    toast.success("Leito liberado");
                    setIsBedDialogOpen(false);
                  }}
                >
                  Liberar Leito
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Selecionar Leito Disponível</p>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                  {availableBeds.length === 0 ? (
                    <p className="text-sm text-center py-8 text-muted-foreground italic">Nenhum leito disponível no momento.</p>
                  ) : (
                    availableBeds.map(bed => (
                      <button
                        key={bed.id}
                        onClick={() => {
                          assignPatient(bed.id, id!);
                          toast.success(`Paciente alocado no ${bed.name}`);
                          setIsBedDialogOpen(false);
                        }}
                        className="w-full p-4 rounded-xl border border-border/50 hover:border-primary hover:bg-primary/5 transition-all text-left flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-bold text-sm group-hover:text-primary transition-colors">{bed.name}</p>
                          <p className="text-[10px] text-muted-foreground">{bed.ward} · {bed.room}</p>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 1. DIÁLOGO ESCALA DE MORSE (QUEDAS)                                       */}
      {/* ========================================================================= */}
      <Dialog open={openMorseCalc} onOpenChange={setOpenMorseCalc}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-amber-500" />
              Escala de Morse (Risco de Quedas)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Avaliação do Risco de Quedas em Paciente Adulto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* 1. Histórico de Quedas */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">1. Histórico de Quedas nos últimos 3 meses</Label>
              <Select value={morseHistory} onValueChange={setMorseHistory}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="no">Não (0 pts)</SelectItem>
                  <SelectItem value="yes">Sim (25 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Diagnóstico Secundário */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">2. Diagnóstico Secundário no prontuário</Label>
              <Select value={morseDiagnosis} onValueChange={setMorseDiagnosis}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="no">Não (0 pts)</SelectItem>
                  <SelectItem value="yes">Sim (15 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Auxílio na Deambulação */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">3. Auxílio na Deambulação</Label>
              <Select value={morseAmbulation} onValueChange={setMorseAmbulation}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o auxílio..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="none">Nenhum / Acamado / Cadeira de Rodas (0 pts)</SelectItem>
                  <SelectItem value="crutches">Muletas / Bengala / Andador (15 pts)</SelectItem>
                  <SelectItem value="furniture">Apoia-se em móveis ou paredes (30 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Terapia Intravenosa */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">4. Terapia Intravenosa / Dispositivo Endovenoso (Soro, Acesso)</Label>
              <Select value={morseIv} onValueChange={setMorseIv}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="no">Não (0 pts)</SelectItem>
                  <SelectItem value="yes">Sim (20 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. Marcha */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">5. Marcha / Transferência</Label>
              <Select value={morseGait} onValueChange={setMorseGait}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o padrão de marcha..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="normal">Normal / Acamado / Cadeira de Rodas (0 pts)</SelectItem>
                  <SelectItem value="weak">Fraca / Ligeiramente alterada (10 pts)</SelectItem>
                  <SelectItem value="impaired">Limitada / Com esforço ou passos curtos (20 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 6. Estado Mental */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">6. Estado Mental</Label>
              <Select value={morseMental} onValueChange={setMorseMental}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o estado mental..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="oriented">Orientado / Limites próprios (0 pts)</SelectItem>
                  <SelectItem value="forgetful">Superestima limites / Esquecido (15 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resultado e Ação */}
            {(() => {
              let score = 0;
              if (morseHistory === "yes") score += 25;
              if (morseDiagnosis === "yes") score += 15;
              if (morseAmbulation === "crutches") score += 15;
              if (morseAmbulation === "furniture") score += 30;
              if (morseIv === "yes") score += 20;
              if (morseGait === "weak") score += 10;
              if (morseGait === "impaired") score += 20;
              if (morseMental === "forgetful") score += 15;

              let riskClass = "Baixo Risco";
              let riskColor = "bg-emerald-500 text-white";
              if (score >= 25 && score <= 44) {
                riskClass = "Risco Moderado";
                riskColor = "bg-amber-500 text-white";
              } else if (score >= 45) {
                riskClass = "Risco Alto";
                riskColor = "bg-red-500 text-white";
              }

              const isComplete = morseHistory && morseDiagnosis && morseAmbulation && morseIv && morseGait && morseMental;

              return (
                <div className="mt-6 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação Calculada</p>
                      <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-bold text-muted-foreground">pts</span></p>
                    </div>
                    {isComplete ? (
                      <Badge className={cn("h-7 rounded-lg text-xs font-black uppercase tracking-wider", riskColor)}>
                        {riskClass}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">
                        Incompleto
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setMorseHistory("no");
                        setMorseDiagnosis("no");
                        setMorseAmbulation("none");
                        setMorseIv("no");
                        setMorseGait("normal");
                        setMorseMental("oriented");
                        setSelectedMorse("");
                        toast.info("Campos da calculadora limpos.");
                      }}
                      className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                    >
                      Limpar
                    </Button>
                    <Button
                      type="button"
                      disabled={!isComplete}
                      onClick={() => {
                        const descText = `- ESCALA DE MORSE (QUEDAS): ${score} pontos (${riskClass.toUpperCase()}).\n  Conduta: ${
                          score >= 45 
                            ? "Grades do leito elevadas, campainha de fácil acesso, pulseira de risco de queda, acompanhante orientado." 
                            : score >= 25 
                            ? "Grades elevadas, auxílio na deambulação e supervisão periódica." 
                            : "Manter grades elevadas de rotina e orientações gerais."
                        }`;
                        setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                        setSelectedMorse(`${score} pts (${riskClass === "Risco Alto" ? "Alto" : riskClass === "Risco Moderado" ? "Mod" : "Baixo"})`);
                        setOpenMorseCalc(false);
                        toast.success("Resultado da Escala de Morse inserido no prontuário!");
                      }}
                      className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                    >
                      Confirmar e Aplicar ao Prontuário
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 2. DIÁLOGO ESCALA DE BRADEN (LESÃO POR PRESSÃO)                           */}
      {/* ========================================================================= */}
      <Dialog open={openBradenCalc} onOpenChange={setOpenBradenCalc}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <Activity className="h-6 w-6 text-orange-500" />
              Escala de Braden (Risco de LPP)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Avaliação do Risco de Lesão por Pressão em Adulto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* 1. Percepção Sensorial */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">1. Percepção Sensorial</Label>
              <Select value={bradenSensory} onValueChange={setBradenSensory}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o nível de percepção..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">1 - Totalmente Limitado</SelectItem>
                  <SelectItem value="2">2 - Muito Limitado</SelectItem>
                  <SelectItem value="3">3 - Levemente Limitado</SelectItem>
                  <SelectItem value="4">4 - Nenhuma Limitação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Umidade */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">2. Umidade da Pele</Label>
              <Select value={bradenMoisture} onValueChange={setBradenMoisture}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o nível de umidade..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">1 - Constantemente Úmida</SelectItem>
                  <SelectItem value="2">2 - Muito Úmida</SelectItem>
                  <SelectItem value="3">3 - Ocasionalmente Úmida</SelectItem>
                  <SelectItem value="4">4 - Raramente Úmida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Atividade */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">3. Atividade Física</Label>
              <Select value={bradenActivity} onValueChange={setBradenActivity}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione a atividade física..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">1 - Acamado</SelectItem>
                  <SelectItem value="2">2 - Em Cadeira de Rodas</SelectItem>
                  <SelectItem value="3">3 - Deambula Ocasionalmente</SelectItem>
                  <SelectItem value="4">4 - Deambula Frequentemente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Mobilidade */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">4. Mobilidade (Capacidade de mudar posição)</Label>
              <Select value={bradenMobility} onValueChange={setBradenMobility}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o nível de mobilidade..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">1 - Totalmente Imóvel</SelectItem>
                  <SelectItem value="2">2 - Muito Limitada</SelectItem>
                  <SelectItem value="3">3 - Levemente Limitada</SelectItem>
                  <SelectItem value="4">4 - Nenhuma Limitação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. Nutrição */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">5. Padrão de Nutrição</Label>
              <Select value={bradenNutrition} onValueChange={setBradenNutrition}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o padrão nutricional..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">1 - Muito Pobre</SelectItem>
                  <SelectItem value="2">2 - Provavelmente Inadequada</SelectItem>
                  <SelectItem value="3">3 - Adequada</SelectItem>
                  <SelectItem value="4">4 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 6. Fricção e Cisalhamento */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">6. Fricção e Cisalhamento</Label>
              <Select value={bradenFriction} onValueChange={setBradenFriction}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione fricção/cisalhamento..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">1 - Problema Constante</SelectItem>
                  <SelectItem value="2">2 - Problema Potencial</SelectItem>
                  <SelectItem value="3">3 - Sem Problema Aparente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resultado e Ação */}
            {(() => {
              const s1 = parseInt(bradenSensory) || 0;
              const s2 = parseInt(bradenMoisture) || 0;
              const s3 = parseInt(bradenActivity) || 0;
              const s4 = parseInt(bradenMobility) || 0;
              const s5 = parseInt(bradenNutrition) || 0;
              const s6 = parseInt(bradenFriction) || 0;
              const score = s1 + s2 + s3 + s4 + s5 + s6;

              let riskClass = "Sem Risco";
              let riskColor = "bg-emerald-500 text-white";
              
              if (score > 0) {
                if (score <= 9) {
                  riskClass = "Risco Muito Alto";
                  riskColor = "bg-red-800 text-white";
                } else if (score >= 10 && score <= 12) {
                  riskClass = "Risco Alto";
                  riskColor = "bg-red-500 text-white";
                } else if (score >= 13 && score <= 14) {
                  riskClass = "Risco Moderado";
                  riskColor = "bg-amber-500 text-white";
                } else if (score >= 15 && score <= 18) {
                  riskClass = "Risco Baixo";
                  riskColor = "bg-emerald-400 text-slate-900";
                }
              }

              const isComplete = bradenSensory && bradenMoisture && bradenActivity && bradenMobility && bradenNutrition && bradenFriction;

              return (
                <div className="mt-6 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação Calculada</p>
                      <p className="text-3xl font-black text-foreground">{isComplete ? score : 0} <span className="text-sm font-bold text-muted-foreground">pts</span></p>
                    </div>
                    {isComplete ? (
                      <Badge className={cn("h-7 rounded-lg text-xs font-black uppercase tracking-wider", riskColor)}>
                        {riskClass}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">
                        Incompleto
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setBradenSensory("4");
                        setBradenMoisture("4");
                        setBradenActivity("4");
                        setBradenMobility("4");
                        setBradenNutrition("4");
                        setBradenFriction("3");
                        setSelectedBraden("");
                        toast.info("Campos da calculadora limpos.");
                      }}
                      className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
                    >
                      Limpar
                    </Button>
                    <Button
                      type="button"
                      disabled={!isComplete}
                      onClick={() => {
                        const descText = `- ESCALA DE BRADEN (LPP): ${score} pontos (${riskClass.toUpperCase()}).\n  Conduta recomendada: ${
                          score <= 12 
                            ? "Colchão pneumático/piramidal instalado, mudança de decúbito estrita de 2/2h, hidratação profunda da pele, proteção de calcâneos." 
                            : score <= 14 
                            ? "Mudança de decúbito programada de 3/3h, aplicação de película protetora de pele, manter pele seca e limpa." 
                            : "Manter mobilização activa/passiva no leito, hidratação regular da pele e observação diária."
                        }`;
                        setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                        setSelectedBraden(`${score} pts (${riskClass === "Risco Alto" || riskClass === "Risco Muito Alto" ? "Alto" : riskClass === "Risco Moderado" ? "Mod" : "Baixo"})`);
                        setOpenBradenCalc(false);
                        toast.success("Resultado da Escala de Braden inserido no prontuário!");
                      }}
                      className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                    >
                      Confirmar e Aplicar ao Prontuário
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 3. DIÁLOGO ESCALA DE DOR (EVA - VISUAL ANALÓGICA)                          */}
      {/* ========================================================================= */}
      <Dialog open={openEvaCalc} onOpenChange={setOpenEvaCalc}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 animate-pulse" />
              Escala de Dor (EVA)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Avaliação Visual Analógica da Dor em Tempo Real
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Seletor Rápido de 0 a 10 */}
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-foreground/80">Selecione o Nível de Dor (0 a 10)</Label>
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => {
                  let btnColor = "border-border text-foreground hover:bg-muted";
                  if (evaScore === val) {
                    if (val === 0) btnColor = "bg-emerald-500 text-white border-emerald-600";
                    else if (val <= 3) btnColor = "bg-green-500 text-white border-green-600";
                    else if (val <= 7) btnColor = "bg-amber-500 text-white border-amber-600";
                    else btnColor = "bg-red-500 text-white border-red-600";
                  }
                  
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEvaScore(val)}
                      className={cn(
                        "h-10 rounded-xl border font-black text-sm flex items-center justify-center transition-all hover:scale-105",
                        btnColor
                      )}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wong-Baker Faces e Caracterização */}
            {evaScore !== null ? (
              <div className="p-4 rounded-2xl bg-muted/20 border border-border flex items-center gap-4 transition-all">
                <span className="text-4xl">
                  {evaScore === 0 ? "😃" : evaScore <= 3 ? "🙂" : evaScore <= 7 ? "😐" : evaScore <= 8 ? "🙁" : evaScore === 9 ? "😩" : "😭"}
                </span>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground">Classificação da Dor</p>
                  <p className="text-lg font-black text-foreground uppercase tracking-wide">
                    {evaScore === 0 ? "0 - Sem Dor" : evaScore <= 3 ? `${evaScore} - Dor Leve` : evaScore <= 7 ? `${evaScore} - Dor Moderada` : `${evaScore} - Dor Intensa/Máxima`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-muted/10 border border-dashed border-border flex items-center gap-4 transition-all opacity-50">
                <span className="text-4xl grayscale">😶</span>
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground">Classificação da Dor</p>
                  <p className="text-lg font-black text-muted-foreground uppercase tracking-wide">
                    Não Avaliada
                  </p>
                </div>
              </div>
            )}

            {/* Campos Auxiliares */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Localização da Dor (Opcional)</Label>
                <Input
                  type="text"
                  placeholder="Ex: Abdomen, Cabeça, Costas"
                  value={evaLocation}
                  onChange={(e) => setEvaLocation(e.target.value)}
                  className="rounded-xl h-10 text-xs font-bold"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Característica da Dor (Opcional)</Label>
                <Input
                  type="text"
                  placeholder="Ex: Pontada, Queimação, Pulsátil"
                  value={evaCharacteristics}
                  onChange={(e) => setEvaCharacteristics(e.target.value)}
                  className="rounded-xl h-10 text-xs font-bold"
                />
              </div>
            </div>

            {/* Ação */}
            <div className="flex items-center gap-2 mt-4 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEvaScore(null);
                  setEvaLocation("");
                  setEvaCharacteristics("");
                  setSelectedEva("");
                  toast.info("Campos da calculadora limpos.");
                }}
                className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-600 dark:hover:text-red-400 transition-all"
              >
                Limpar
              </Button>
              <Button
                type="button"
                disabled={evaScore === null}
                onClick={() => {
                  const painClass = evaScore === 0 ? "SEM DOR" : evaScore! <= 3 ? "DOR LEVE" : evaScore! <= 7 ? "DOR MODERADA" : "DOR INTENSA";
                  const details = [];
                  if (evaLocation) details.push(`Local: ${evaLocation}`);
                  if (evaCharacteristics) details.push(`Aspecto: ${evaCharacteristics}`);
                  const detailsStr = details.length > 0 ? ` [${details.join(" · ")}]` : "";

                  const descText = `- ESCALA DE DOR (EVA): ${evaScore}/10 (${painClass})${detailsStr}.\n  Conduta: ${
                    evaScore! >= 8 
                      ? "Notificar equipe médica, administrar analgesia prescrita de resgate e reavaliar sinais vitais." 
                      : evaScore! >= 4 
                      ? "Administrar analgesia prescrita, manter paciente em repouso e sob observação." 
                      : "Manter observação clínica geral."
                  }`;
                  setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                  setSelectedEva(`EVA: ${evaScore}/10`);
                  setOpenEvaCalc(false);
                  toast.success("Escala de Dor EVA aplicada com sucesso!");
                }}
                className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
              >
                Aplicar ao Prontuário
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 4. DIÁLOGO ESCORE MEWS (ALERTA ADULTO PRECOCE)                           */}
      {/* ========================================================================= */}
      <Dialog open={openMewsCalc} onOpenChange={setOpenMewsCalc}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-500" />
              Escore MEWS (Alerta Fisiológico)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Modified Early Warning Score - Triagem Adulta
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* 1. PAS (Pressão Arterial Sistólica) */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">1. Pressão Arterial Sistólica (mmHg)</Label>
              <Select value={mewsPas} onValueChange={setMewsPas}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione a faixa de PAS..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="3">&lt;= 70 mmHg (3 pts)</SelectItem>
                  <SelectItem value="2">71 - 80 mmHg (2 pts)</SelectItem>
                  <SelectItem value="1">81 - 100 mmHg (1 pt)</SelectItem>
                  <SelectItem value="0">101 - 199 mmHg (0 pts)</SelectItem>
                  <SelectItem value="2_high">&gt;= 200 mmHg (2 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. FC (Frequência Cardíaca) */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">2. Frequência Cardíaca (bpm)</Label>
              <Select value={mewsFc} onValueChange={setMewsFc}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione a faixa de FC..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="2_low">&lt;= 40 bpm (2 pts)</SelectItem>
                  <SelectItem value="1_low">41 - 50 bpm (1 pt)</SelectItem>
                  <SelectItem value="0">51 - 100 bpm (0 pts)</SelectItem>
                  <SelectItem value="1_high">101 - 110 bpm (1 pt)</SelectItem>
                  <SelectItem value="2_high">111 - 129 bpm (2 pts)</SelectItem>
                  <SelectItem value="3_high">&gt;= 130 bpm (3 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. FR (Frequência Respiratória) */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">3. Frequência Respiratória (irpm)</Label>
              <Select value={mewsFr} onValueChange={setMewsFr}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione a faixa de FR..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="2_low">&lt;= 8 irpm (2 pts)</SelectItem>
                  <SelectItem value="0">9 - 14 irpm (0 pts)</SelectItem>
                  <SelectItem value="1_high">15 - 20 irpm (1 pt)</SelectItem>
                  <SelectItem value="2_high">21 - 29 irpm (2 pts)</SelectItem>
                  <SelectItem value="3_high">&gt;= 30 irpm (3 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Temperatura */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">4. Temperatura Corporal (°C)</Label>
              <Select value={mewsTemp} onValueChange={setMewsTemp}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione a faixa de temperatura..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="2_low">&lt; 35.0 °C (2 pts)</SelectItem>
                  <SelectItem value="0">35.0 - 38.4 °C (0 pts)</SelectItem>
                  <SelectItem value="2_high">&gt;= 38.5 °C (2 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. Nível de Consciência (AVDI) */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">5. Nível de Consciência (Escala AVDI)</Label>
              <Select value={mewsAvdi} onValueChange={setMewsAvdi}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o estado neurológico..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="0">A - Alerta / Responsivo (0 pts)</SelectItem>
                  <SelectItem value="1">V - Responsivo à Voz (1 pt)</SelectItem>
                  <SelectItem value="2">D - Responsivo à Dor (2 pts)</SelectItem>
                  <SelectItem value="3">I - Inconsciente / Sem resposta (3 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resultado e Ação */}
            {(() => {
              const getPasScore = () => {
                if (mewsPas === "2_high") return 2;
                return parseInt(mewsPas) || 0;
              };
              const getFcScore = () => {
                if (mewsFc === "2_low" || mewsFc === "2_high") return 2;
                if (mewsFc === "1_low" || mewsFc === "1_high") return 1;
                if (mewsFc === "3_high") return 3;
                return 0;
              };
              const getFrScore = () => {
                if (mewsFr === "2_low" || mewsFr === "2_high") return 2;
                if (mewsFr === "1_high") return 1;
                if (mewsFr === "3_high") return 3;
                return 0;
              };
              const getTempScore = () => {
                if (mewsTemp === "2_low" || mewsTemp === "2_high") return 2;
                return 0;
              };
              const getAvdiScore = () => {
                return parseInt(mewsAvdi) || 0;
              };

              const score = getPasScore() + getFcScore() + getFrScore() + getTempScore() + getAvdiScore();

              let mewsClass = "Baixo Risco";
              let mewsColor = "bg-emerald-500 text-white";
              if (score >= 3 && score <= 4) {
                mewsClass = "Risco Moderado";
                mewsColor = "bg-amber-500 text-white";
              } else if (score >= 5) {
                mewsClass = "Risco Alto (Alerta Clínico)";
                mewsColor = "bg-red-500 text-white animate-pulse";
              }

              const isComplete = mewsPas && mewsFc && mewsFr && mewsTemp && mewsAvdi;

              return (
                <div className="mt-6 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação Calculada</p>
                      <p className="text-3xl font-black text-foreground">{isComplete ? score : 0} <span className="text-sm font-bold text-muted-foreground">pts</span></p>
                    </div>
                    {isComplete ? (
                      <Badge className={cn("h-7 rounded-lg text-xs font-black uppercase tracking-wider", mewsColor)}>
                        {mewsClass}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">
                        Incompleto
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setMewsPas("0");
                        setMewsFc("0");
                        setMewsFr("0");
                        setMewsTemp("0");
                        setMewsAvdi("0");
                        toast.info("Campos da calculadora limpos.");
                      }}
                      className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    >
                      Limpar
                    </Button>
                    <Button
                      type="button"
                      disabled={!isComplete}
                      onClick={() => {
                        const descText = `- ESCORE MEWS (ALERTA DE DETERIORAÇÃO): ${score} pontos (${mewsClass.toUpperCase()}).\n  Conduta sugerida: ${
                          score >= 5 
                            ? "ALERTA CLÍNICO IMEDIATO! Notificar médico assistente do setor, preparar monitor cardíaco contínuo e leito de suporte avançado (Sala Vermelha)." 
                            : score >= 3 
                            ? "Deterioração clínica moderada. Comunicar enfermeiro supervisor e equipe médica para avaliação do paciente. Registrar sinais vitais a cada hora." 
                            : "Baixo risco de deterioração fisiológica. Manter monitoramento de rotina do paciente."
                        }`;
                        setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                        setSelectedMews(`MEWS: ${score} pts`);
                        setOpenMewsCalc(false);
                        toast.success("Escore MEWS integrado ao prontuário com sucesso!");
                      }}
                      className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                    >
                      Confirmar e Aplicar ao Prontuário
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL NEWS2 */}
      <Dialog open={openNews2Calc} onOpenChange={setOpenNews2Calc}>
        <DialogContent className="sm:max-w-[750px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <Activity className="h-6 w-6 text-emerald-500" />
              Escore NEWS2
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              National Early Warning Score 2
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 py-3">
            {/* O paciente retém CO2? */}
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs font-black uppercase text-foreground/80">O paciente tem DPOC / Retém CO2 crônico?</Label>
              <Select value={news2Scale} onValueChange={(val) => {
                setNews2Scale(val);
                setNews2Spo2("0");
              }}>
                <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-dashed">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">Não - Usar Escala 1 (Padrão)</SelectItem>
                  <SelectItem value="2">Sim - Usar Escala 2 (Alvo 88-92%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 1. FR */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">1. Frequência Respiratória (irpm)</Label>
              <Select value={news2Fr} onValueChange={setNews2Fr}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione a faixa de FR..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="3_low">&lt;= 8 irpm (3 pts)</SelectItem>
                  <SelectItem value="1_low">9 - 11 irpm (1 pt)</SelectItem>
                  <SelectItem value="0">12 - 20 irpm (0 pts)</SelectItem>
                  <SelectItem value="2_high">21 - 24 irpm (2 pts)</SelectItem>
                  <SelectItem value="3_high">&gt;= 25 irpm (3 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Saturação O2 */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">2. Saturação de Oxigênio (SpO2 %)</Label>
              <Select value={news2Spo2} onValueChange={setNews2Spo2}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder={`Selecione SpO2 (Escala ${news2Scale})...`} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {news2Scale === "1" ? (
                    <>
                      <SelectItem value="3">&lt;= 91% (3 pts)</SelectItem>
                      <SelectItem value="2">92 - 93% (2 pts)</SelectItem>
                      <SelectItem value="1">94 - 95% (1 pt)</SelectItem>
                      <SelectItem value="0">&gt;= 96% (0 pts)</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="3">&lt;= 83% (3 pts)</SelectItem>
                      <SelectItem value="2">84 - 85% (2 pts)</SelectItem>
                      <SelectItem value="1">86 - 87% (1 pt)</SelectItem>
                      <SelectItem value="0">88 - 92% ou &gt;=93% ar ambiente (0 pts)</SelectItem>
                      <SelectItem value="1_high">93 - 94% c/ O2 (1 pt)</SelectItem>
                      <SelectItem value="2_high">95 - 96% c/ O2 (2 pts)</SelectItem>
                      <SelectItem value="3_high">&gt;= 97% c/ O2 (3 pts)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* 3. Uso de O2 Suplementar */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">3. Uso de Oxigênio Suplementar</Label>
              <Select value={news2O2} onValueChange={setNews2O2}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o uso de O2..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="0">Ar Ambiente (0 pts)</SelectItem>
                  <SelectItem value="2">Uso de O2 Suplementar (2 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. PAS */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">4. Pressão Arterial Sistólica (mmHg)</Label>
              <Select value={news2Pas} onValueChange={setNews2Pas}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione a faixa de PAS..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="3">&lt;= 90 mmHg (3 pts)</SelectItem>
                  <SelectItem value="2">91 - 100 mmHg (2 pts)</SelectItem>
                  <SelectItem value="1">101 - 110 mmHg (1 pt)</SelectItem>
                  <SelectItem value="0">111 - 219 mmHg (0 pts)</SelectItem>
                  <SelectItem value="3_high">&gt;= 220 mmHg (3 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. FC */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">5. Frequência Cardíaca (bpm)</Label>
              <Select value={news2Fc} onValueChange={setNews2Fc}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione a faixa de FC..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="3">&lt;= 40 bpm (3 pts)</SelectItem>
                  <SelectItem value="1">41 - 50 bpm (1 pt)</SelectItem>
                  <SelectItem value="0">51 - 90 bpm (0 pts)</SelectItem>
                  <SelectItem value="1_high">91 - 110 bpm (1 pt)</SelectItem>
                  <SelectItem value="2_high">111 - 130 bpm (2 pts)</SelectItem>
                  <SelectItem value="3_high">&gt;= 131 bpm (3 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 6. Nível de Consciência (ACVPU) */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">6. Nível de Consciência (ACVPU)</Label>
              <Select value={news2Acvpu} onValueChange={setNews2Acvpu}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o nível de consciência..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="0">A - Alerta / Orientado (0 pts)</SelectItem>
                  <SelectItem value="3_c">C - Confusão Nova (3 pts)</SelectItem>
                  <SelectItem value="3_v">V - Responde à Voz (3 pts)</SelectItem>
                  <SelectItem value="3_p">P - Responde à Dor (3 pts)</SelectItem>
                  <SelectItem value="3_u">U - Não Responsivo (3 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 7. Temperatura */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">7. Temperatura Corporal (°C)</Label>
              <Select value={news2Temp} onValueChange={setNews2Temp}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione a faixa de temperatura..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="3">&lt;= 35.0 °C (3 pts)</SelectItem>
                  <SelectItem value="1">35.1 - 36.0 °C (1 pt)</SelectItem>
                  <SelectItem value="0">36.1 - 38.0 °C (0 pts)</SelectItem>
                  <SelectItem value="1_high">38.1 - 39.0 °C (1 pt)</SelectItem>
                  <SelectItem value="2_high">&gt;= 39.1 °C (2 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* RESULT */}
            <div className="sm:col-span-2 mt-2">
              {(() => {
                const score = parseInt(news2Fr) + parseInt(news2Spo2) + parseInt(news2O2) + parseInt(news2Temp) + parseInt(news2Pas) + parseInt(news2Fc) + parseInt(news2Acvpu);
                const hasRedScore = [news2Fr, news2Spo2, news2O2, news2Temp, news2Pas, news2Fc, news2Acvpu].some(val => parseInt(val || "0") === 3);

                let newsClass = "Risco Baixo";
                let colorClass = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
                let actionText = "Monitorar a cada 12 horas. Resposta baseada na enfermaria.";

                if (score >= 7) {
                  newsClass = "Risco Alto (Emergência)";
                  colorClass = "bg-red-500/10 text-red-600 border-red-500/20";
                  actionText = "Resposta de Emergência (Sala Vermelha). Acionar médico imediatamente. Monitorização contínua.";
                } else if (score >= 5) {
                  newsClass = "Risco Médio (Urgente)";
                  colorClass = "bg-orange-500/10 text-orange-600 border-orange-500/20";
                  actionText = "Resposta Urgente. Avaliação médica rápida. Monitorização no mínimo a cada 1 hora.";
                } else if (hasRedScore) {
                  newsClass = "Risco Baixo-Médio (Avaliar)";
                  colorClass = "bg-amber-500/10 text-amber-600 border-amber-500/20";
                  actionText = "Requer revisão urgente pelo médico ou enfermeiro sênior para decidir se escalona o cuidado.";
                } else if (score >= 1) {
                  newsClass = "Risco Baixo";
                  colorClass = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
                  actionText = "Monitorar a cada 4-6 horas.";
                }

                return (
                  <div className="pt-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className={cn("p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2", colorClass)}>
                    <h4 className="font-black text-xs uppercase tracking-wider">Pontuação NEWS2</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black">{score}</span>
                      <span className="text-sm font-bold opacity-70">pts</span>
                    </div>
                    <Badge variant="outline" className={cn("font-bold uppercase text-[10px] tracking-wider", colorClass.replace("bg-", "bg-transparent").replace("text-", "text-").replace("border-", "border-"))}>
                      {newsClass}
                    </Badge>
                    <p className="text-[10px] mt-1 font-semibold opacity-80 max-w-[90%]">
                      {actionText}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setNews2Scale("1");
                        setNews2Fr("0");
                        setNews2Spo2("0");
                        setNews2O2("0");
                        setNews2Pas("0");
                        setNews2Fc("0");
                        setNews2Acvpu("0");
                        setNews2Temp("0");
                        toast.info("Campos da calculadora limpos.");
                      }}
                      className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                    >
                      Limpar
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => {
                        const descText = `- ESCORE NEWS2 (ALERTA): ${score} pontos (${newsClass.toUpperCase()}).\n  Conduta sugerida: ${actionText}`;
                        setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                        setSelectedNews2(`NEWS2: ${score} pts`);
                        setOpenNews2Calc(false);
                        toast.success("Escore NEWS2 integrado ao prontuário com sucesso!");
                      }}
                      className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                    >
                      Confirmar e Aplicar ao Prontuário
                    </Button>
                  </div>
                </div>
              );
            })()}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openQsofaCalc} onOpenChange={setOpenQsofaCalc}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-purple-500 animate-bounce" />
              Protocolo de Triagem de Sepse
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Diretrizes Integradas Sepsis-3 (qSOFA) e ILAS (SIRS)
            </DialogDescription>
          </DialogHeader>

          {/* Abas Personalizadas */}
          <div className="flex p-1 bg-muted/60 dark:bg-muted/30 rounded-2xl border border-border mb-4">
            <button
              type="button"
              onClick={() => setSepsisTab("qsofa")}
              className={cn(
                "flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all",
                sepsisTab === "qsofa"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              qSOFA (Sepsis-3)
            </button>
            <button
              type="button"
              onClick={() => setSepsisTab("sirs")}
              className={cn(
                "flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all",
                sepsisTab === "sirs"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              SIRS (Diretriz ILAS)
            </button>
          </div>

          <div className="space-y-4 py-1">
            {sepsisTab === "qsofa" ? (
              <>
                {/* 1. FR >= 22 irpm */}
                <div className="space-y-1">
                  <Label className="text-xs font-black uppercase text-foreground/80">1. Frequência Respiratória &gt;= 22 irpm</Label>
                  <Select value={qsofaFr} onValueChange={setQsofaFr}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="no">Não (0 pts)</SelectItem>
                      <SelectItem value="yes">Sim (1 pt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Alteração do Estado Mental */}
                <div className="space-y-1">
                  <Label className="text-xs font-black uppercase text-foreground/80">2. Alteração do Estado Mental (Glasgow &lt; 15 ou Desorientação)</Label>
                  <Select value={qsofaMental} onValueChange={setQsofaMental}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="no">Não (0 pts)</SelectItem>
                      <SelectItem value="yes">Sim (1 pt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. PAS <= 100 mmHg */}
                <div className="space-y-1">
                  <Label className="text-xs font-black uppercase text-foreground/80">3. Pressão Arterial Sistólica &lt;= 100 mmHg</Label>
                  <Select value={qsofaPas} onValueChange={setQsofaPas}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="no">Não (0 pts)</SelectItem>
                      <SelectItem value="yes">Sim (1 pt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resultado qSOFA */}
                {(() => {
                  let score = 0;
                  if (qsofaFr === "yes") score += 1;
                  if (qsofaMental === "yes") score += 1;
                  if (qsofaPas === "yes") score += 1;

                  let riskClass = "Triagem Negativa para Sepse";
                  let riskColor = "bg-emerald-500 text-white";
                  if (score >= 2) {
                    riskClass = "ALTA SUSPEITA DE SEPSE (CRÍTICO)";
                    riskColor = "bg-purple-600 text-white animate-pulse";
                  }

                  const isComplete = qsofaFr && qsofaMental && qsofaPas;

                  return (
                    <div className="mt-6 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação qSOFA</p>
                          <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-bold text-muted-foreground">/ 3 pts</span></p>
                        </div>
                        {isComplete ? (
                          <Badge className={cn("h-7 rounded-lg text-[10px] font-black uppercase tracking-wider px-2", riskColor)}>
                            {riskClass}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">
                            Incompleto
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setQsofaFr("no");
                            setQsofaMental("no");
                            setQsofaPas("no");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-purple-500/40 hover:bg-purple-500/5 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          disabled={!isComplete}
                          onClick={() => {
                            const descText = `- ESCORE qSOFA (RISCO DE SEPSE): ${score}/3 pontos (${riskClass}).\n  Conduta sugerida: ${
                              score >= 2 
                                ? "ALERTA PROTOCOLO SEPSE IMEDIATO! Notificar equipe médica com urgência, solicitar exames laboratoriais (incluindo lactato venoso e hemoculturas pareadas) e monitoramento cardíaco contínuo." 
                                : "Manter acompanhamento clínico e observações de rotina do paciente."
                            }`;
                            setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                            setSelectedQsofa(score >= 2 ? `qSOFA: ${score} (ALERTA)` : `qSOFA: ${score} pts`);
                            setOpenQsofaCalc(false);
                            toast.success("Escore qSOFA integrado com sucesso!");
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </>
            ) : (
              <>
                {/* SIRS Items */}
                {/* 1. Temp < 36 ou > 38 */}
                <div className="space-y-1">
                  <Label className="text-xs font-black uppercase text-foreground/80">1. Temperatura corporal &lt; 36°C ou &gt; 38°C</Label>
                  <Select value={sirsTemp} onValueChange={setSirsTemp}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="no">Não (0 pts)</SelectItem>
                      <SelectItem value="yes">Sim (1 pt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. FC > 90 bpm */}
                <div className="space-y-1">
                  <Label className="text-xs font-black uppercase text-foreground/80">2. Frequência Cardíaca &gt; 90 bpm</Label>
                  <Select value={sirsHr} onValueChange={setSirsHr}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="no">Não (0 pts)</SelectItem>
                      <SelectItem value="yes">Sim (1 pt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. FR > 20 irpm */}
                <div className="space-y-1">
                  <Label className="text-xs font-black uppercase text-foreground/80">3. Frequência Respiratória &gt; 20 irpm ou PaCO2 &lt; 32 mmHg</Label>
                  <Select value={sirsRr} onValueChange={setSirsRr}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="no">Não (0 pts)</SelectItem>
                      <SelectItem value="yes">Sim (1 pt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Leucócitos */}
                <div className="space-y-1">
                  <Label className="text-xs font-black uppercase text-foreground/80">4. Leucócitos &lt; 4000 ou &gt; 12000 ou &gt; 10% de Bastões</Label>
                  <Select value={sirsWbc} onValueChange={setSirsWbc}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="no">Não (0 pts)</SelectItem>
                      <SelectItem value="yes">Sim (1 pt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 5. Foco Infeccioso */}
                <div className="space-y-1">
                  <Label className="text-xs font-black uppercase text-purple-600 dark:text-purple-400">5. Suspeita de Foco Infeccioso Ativo?</Label>
                  <Select value={sirsFocus} onValueChange={setSirsFocus}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="no">Não / Indefinido</SelectItem>
                      <SelectItem value="yes">Sim (Suspeito/Confirmado)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 6. Disfunção Orgânica */}
                <div className="space-y-1">
                  <Label className="text-xs font-black uppercase text-purple-600 dark:text-purple-400">6. Evidência de Disfunção Orgânica de Início Recente?</Label>
                  <Select value={sirsDysfunction} onValueChange={setSirsDysfunction}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="no">Não (Ausente)</SelectItem>
                      <SelectItem value="yes">Sim (Hipotensão PAS &lt; 90, Lactato &gt; 2.0, Plaquetas &lt; 100k, Glasgow &lt; 15, rebaixamento sensorial ou oligúria)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resultado SIRS */}
                {(() => {
                  const tVal = sirsTemp === "yes" ? 1 : 0;
                  const hVal = sirsHr === "yes" ? 1 : 0;
                  const rVal = sirsRr === "yes" ? 1 : 0;
                  const wVal = sirsWbc === "yes" ? 1 : 0;
                  const sirsScore = tVal + hVal + rVal + wVal;
                  const hasFocus = sirsFocus === "yes";
                  const hasDysfunction = sirsDysfunction === "yes";

                  let riskClass = "SIRS Negativo (Baixo Risco)";
                  let riskColor = "bg-emerald-500 text-white";
                  if (sirsScore >= 2) {
                    if (hasFocus) {
                      if (hasDysfunction) {
                        riskClass = "PROTOCOLO SEPSE ATIVO (CRÍTICO / ILAS)";
                        riskColor = "bg-purple-600 text-white animate-pulse";
                      } else {
                        riskClass = "SEPSE SUSPEITA (ALERTA ILAS)";
                        riskColor = "bg-red-500 text-white animate-pulse";
                      }
                    } else {
                      riskClass = "SIRS POSITIVO (AVALIAR FOCO)";
                      riskColor = "bg-amber-500 text-white";
                    }
                  } else if (hasFocus && hasDysfunction) {
                    riskClass = "SEPSE CRITÉRIO SOFA POSITIVO (CRÍTICO)";
                    riskColor = "bg-purple-600 text-white animate-pulse";
                  }

                  const isComplete = sirsTemp && sirsHr && sirsRr && sirsWbc && sirsFocus && sirsDysfunction;

                  return (
                    <div className="mt-6 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Critérios SIRS</p>
                          <p className="text-3xl font-black text-foreground">{sirsScore} <span className="text-sm font-bold text-muted-foreground">/ 4 pts</span></p>
                        </div>
                        {isComplete ? (
                          <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", riskColor)}>
                            {riskClass}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">
                            Incompleto
                          </Badge>
                        )}
                      </div>

                      <Button
                        type="button"
                        disabled={!isComplete}
                        onClick={() => {
                          const descText = `- AVALIAÇÃO DE SEPSE (CRITÉRIOS SIRS - DIRETRIZ ILAS):\n  ` +
                            `• Critérios SIRS Presentes: ${sirsScore}/4. ` +
                            `• Foco Infeccioso Ativo Suspeito/Confirmado: ${hasFocus ? "SIM" : "NÃO"}.\n  ` +
                            `• Sinais de Disfunção Orgânica: ${hasDysfunction ? "SIM" : "NÃO"}.\n  ` +
                            `• Classificação: ${riskClass.toUpperCase()}.\n  ` +
                            `Conduta sugerida: ${
                              (sirsScore >= 2 && hasFocus && hasDysfunction) || (hasFocus && hasDysfunction)
                                ? "ABRIR PROTOCOLO DE SEPSE IMEDIATO (CRÍTICO)! Colher 2 pares de hemoculturas e lactato arterial imediato. Iniciar antibioticoterapia de amplo espectro na primeira hora ('Golden Hour'). Realizar expansão volêmica imediata (30 mL/kg de cristaloide) se hipotensão ou lactato >= 4.0 mmol/L, e monitorar débito urinário rigoroso."
                                : sirsScore >= 2 && hasFocus
                                ? "ABRIR PROTOCOLO DE SEPSE! Colher hemoculturas pareadas, dosar lactato (e repetir de 2/2h se > 2.0). Iniciar antibiótico guiado na primeira hora e monitorizar sinais vitais continuamente."
                                : sirsScore >= 2
                                ? "SIRS positivo sem foco infeccioso evidente. Avaliar cuidadosamente foco infeccioso oculto (urocultura, radiografia de tórax, hemograma completo). Monitorar de 2/2h."
                                : "Baixa suspeita pelo SIRS. Manter acompanhamento clínico de rotina."
                            }`;
                          setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                          setSelectedQsofa(
                            (sirsScore >= 2 && hasFocus && hasDysfunction) || (hasFocus && hasDysfunction)
                              ? "SEPSE: PROTOCOLO ATIVO (CRÍTICO)"
                              : sirsScore >= 2 && hasFocus
                              ? "SEPSE: PROTOCOLO ATIVO"
                              : `SIRS: ${sirsScore} pts`
                          );
                          setOpenQsofaCalc(false);
                          toast.success("Escore SIRS integrado ao prontuário com sucesso!");
                        }}
                        className="w-full h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                      >
                        Confirmar e Aplicar ao Prontuário
                      </Button>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 6. DIÁLOGO ESCORE PEWS (ALERTA PEDIÁTRICO PRECOCE)                        */}
      {/* ========================================================================= */}
      <Dialog open={openPewsCalc} onOpenChange={setOpenPewsCalc}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <Baby className="h-6 w-6 text-teal-500 animate-bounce" />
              Escore PEWS (Alerta Pediátrico)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Pediatric Early Warning Score - Triagem Infantil
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* 1. Comportamento */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">1. Comportamento / Estado Geral</Label>
              <Select value={pewsBehavior} onValueChange={setPewsBehavior}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o comportamento da criança..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="0">0 - Ativo, responsivo, corado ou brincando</SelectItem>
                  <SelectItem value="1">1 - Apático, hipoativo, sonolento</SelectItem>
                  <SelectItem value="2">2 - Irritável, choro presumido inconsolável</SelectItem>
                  <SelectItem value="3">3 - Letárgico, torporoso ou resposta diminuída à dor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Cardiovascular */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">2. Cardiovascular / Perfusão Periférica</Label>
              <Select value={pewsCv} onValueChange={setPewsCv}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o estado cardiovascular..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="0">0 - Pele corada, perfusão periférica &lt;= 2s</SelectItem>
                  <SelectItem value="1">1 - Pele pálida ou perfusão de 3s</SelectItem>
                  <SelectItem value="2">2 - Pele moteada, perfusão de 4s ou taquicardia severa</SelectItem>
                  <SelectItem value="3">3 - Cianose ativa, perfusão &gt;= 5s ou bradicardia grave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Esforço Respiratório */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">3. Esforço Respiratório / Frequência</Label>
              <Select value={pewsResp} onValueChange={setPewsResp}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione o padrão respiratório..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="0">0 - Padrão e frequência normais para a idade</SelectItem>
                  <SelectItem value="1">1 - Taquipneia leve, uso discreto de musculatura acessória</SelectItem>
                  <SelectItem value="2">2 - Taquipneia moderada, tiragens evidentes ou gemência</SelectItem>
                  <SelectItem value="3">3 - Gemência persistente, batimento de asa de nariz ou apneias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Nebulização de Resgate */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">4. Nebulização de Resgate Recorrente (a cada 15 min)</Label>
              <Select value={pewsNeb} onValueChange={setPewsNeb}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="no">Não (0 pts)</SelectItem>
                  <SelectItem value="yes">Sim (2 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resultado e Ação */}
            {(() => {
              const b = parseInt(pewsBehavior) || 0;
              const cv = parseInt(pewsCv) || 0;
              const r = parseInt(pewsResp) || 0;
              const n = pewsNeb === "yes" ? 2 : 0;
              const score = b + cv + r + n;

              let riskClass = "Risco Baixo";
              let riskColor = "bg-emerald-500 text-white";
              if (score >= 3 && score <= 4) {
                riskClass = "Risco Moderado";
                riskColor = "bg-amber-500 text-white";
              } else if (score >= 5) {
                riskClass = "Risco Alto (Urgência Pediátrica)";
                riskColor = "bg-red-500 text-white animate-pulse";
              }

              const isComplete = pewsBehavior && pewsCv && pewsResp && pewsNeb;

              return (
                <div className="mt-6 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação PEWS</p>
                      <p className="text-3xl font-black text-foreground">{isComplete ? score : 0} <span className="text-sm font-bold text-muted-foreground">pts</span></p>
                    </div>
                    {isComplete ? (
                      <Badge className={cn("h-7 rounded-lg text-xs font-black uppercase tracking-wider", riskColor)}>
                        {riskClass}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">
                        Incompleto
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPewsBehavior("");
                        setPewsCv("");
                        setPewsResp("");
                        setPewsNeb("");
                        setSelectedPews("");
                        toast.info("Campos da calculadora limpos.");
                      }}
                      className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-teal-500/40 hover:bg-teal-500/5 hover:text-teal-600 dark:hover:text-teal-400 transition-all"
                    >
                      Limpar
                    </Button>
                    <Button
                      type="button"
                      disabled={!isComplete}
                      onClick={() => {
                        const descText = `- ESCORE PEWS (ALERTA PEDIÁTRICO PRECOCE): ${score} pontos (${riskClass.toUpperCase()}).\n  Conduta sugerida: ${
                          score >= 5 
                            ? "ALERTA DE EMERGÊNCIA PEDIÁTRICA! Comunicar o pediatra plantonista de imediato, preparar monitorização intensiva e transferir para leito de emergência pediátrica na Sala Vermelha." 
                            : score >= 3 
                            ? "Comunicar enfermeiro e médico pediatra do setor. Reavaliar sinais vitais e escore PEWS a cada 30 minutos." 
                            : "Manter acompanhamento clínico pediátrico de rotina."
                        }`;
                        setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                        setSelectedPews(`PEWS: ${score} pts`);
                        setOpenPewsCalc(false);
                        toast.success("Escore PEWS aplicado com sucesso!");
                      }}
                      className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                    >
                      Confirmar e Aplicar ao Prontuário
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 6.5. DIÁLOGO ESCALA DE GLASGOW (GCS)                                      */}
      {/* ========================================================================= */}
      <Dialog open={openGlasgowCalc} onOpenChange={setOpenGlasgowCalc}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-500 animate-pulse" />
              Escala de Coma de Glasgow (GCS)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Avaliação do Nível de Consciência e Reatividade Neurológica
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* 1. Abertura Ocular */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">1. Abertura Ocular (AO)</Label>
              <Select value={gcsEye} onValueChange={setGcsEye}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione a abertura ocular..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="4">4 - Espontânea</SelectItem>
                  <SelectItem value="3">3 - Ao estímulo verbal / À ordem</SelectItem>
                  <SelectItem value="2">2 - Ao estímulo doloroso / À pressão</SelectItem>
                  <SelectItem value="1">1 - Sem resposta (Ausente)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Resposta Verbal */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">2. Resposta Verbal (RV)</Label>
              <Select value={gcsVerbal} onValueChange={setGcsVerbal}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione a resposta verbal..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="5">5 - Orientado</SelectItem>
                  <SelectItem value="4">4 - Confuso / Desorientado</SelectItem>
                  <SelectItem value="3">3 - Palavras inapropriadas</SelectItem>
                  <SelectItem value="2">2 - Sons incompreensíveis / Inespecíficos</SelectItem>
                  <SelectItem value="1">1 - Sem resposta (Ausente)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Resposta Motora */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">3. Resposta Motora (RM)</Label>
              <Select value={gcsMotor} onValueChange={setGcsMotor}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Selecione a resposta motora..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="6">6 - Obedece a comandos verbais</SelectItem>
                  <SelectItem value="5">5 - Localiza estímulo doloroso</SelectItem>
                  <SelectItem value="4">4 - Flexão normal / Retirada à dor</SelectItem>
                  <SelectItem value="3">3 - Flexão anormal (Decorticação)</SelectItem>
                  <SelectItem value="2">2 - Extensão anormal (Descerebração)</SelectItem>
                  <SelectItem value="1">1 - Sem resposta (Ausente)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resultado e Ação */}
            {(() => {
              const eScore = parseInt(gcsEye) || 4;
              const vScore = parseInt(gcsVerbal) || 5;
              const mScore = parseInt(gcsMotor) || 6;
              const score = eScore + vScore + mScore;

              let riskClass = "Consciência Preservada";
              let riskColor = "bg-emerald-500 text-white";
              if (score >= 13 && score <= 14) {
                riskClass = "TCE Leve";
                riskColor = "bg-green-500 text-white";
              } else if (score >= 9 && score <= 12) {
                riskClass = "TCE Moderado";
                riskColor = "bg-amber-500 text-white";
              } else if (score <= 8) {
                riskClass = "TCE Grave / Coma (Crítico)";
                riskColor = "bg-red-500 text-white animate-pulse";
              }

              const isComplete = gcsEye && gcsVerbal && gcsMotor;

              return (
                <div className="mt-6 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação ECG</p>
                      <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-bold text-muted-foreground">/ 15 pts</span></p>
                    </div>
                    {isComplete ? (
                      <Badge className={cn("h-7 rounded-lg text-xs font-black uppercase tracking-wider", riskColor)}>
                        {riskClass}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase tracking-wider">
                        Incompleto
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setGcsEye("4");
                        setGcsVerbal("5");
                        setGcsMotor("6");
                        toast.info("Campos da calculadora limpos.");
                      }}
                      className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                    >
                      Limpar
                    </Button>
                    <Button
                      type="button"
                      disabled={!isComplete}
                      onClick={() => {
                        const descText = `- ESCALA DE COMA DE GLASGOW (ECG): ${score}/15 pontos (AO: ${eScore}, RV: ${vScore}, RM: ${mScore}).\n  Classificação: ${riskClass.toUpperCase()}.\n  Conduta sugerida: ${
                          score <= 8 
                            ? "ALERTA NEUROLÓGICO CRÍTICO! Paciente em coma (ECG <= 8). Alto risco de perda de reflexos de via aérea. Preparar intubação imediata e monitoramento avançado na Sala Vermelha." 
                            : score >= 9 && score <= 12 
                            ? "Disfunção neurológica moderada. Reavaliar a cada hora, elevar cabeceira a 30 graus e solicitar avaliação neurológica com brevidade." 
                            : score >= 13 && score <= 14 
                            ? "Disfunção neurológica leve. Monitorar nível de consciência a cada 2 horas e registrar variações." 
                            : "Nível de consciência preservado, sem déficits focais evidentes. Manter acompanhamento clínico de rotina."
                        }`;
                        setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                        setSelectedGlasgow(`Glasgow: ${score}/15`);
                        setOpenGlasgowCalc(false);
                        toast.success("Resultado da Escala de Glasgow integrado com sucesso!");
                      }}
                      className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                    >
                      Confirmar e Aplicar ao Prontuário
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 6.6. DIÁLOGO SAÚDE MENTAL (RASS, SAD PERSONS, CIWA-Ar, CAGE)               */}
      {/* ========================================================================= */}
      <Dialog open={openMentalCalc} onOpenChange={setOpenMentalCalc}>
        <DialogContent className="sm:max-w-[800px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <Brain className="h-6 w-6 text-violet-500 animate-pulse" />
              Avaliação de Saúde Mental e Triagem Psiquiátrica
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Consolidação de Escalas Clínicas de Risco e Dependência Química
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
            {/* Coluna Esquerda: Menu Vertical */}
            <div className="md:col-span-4 space-y-3 border-r border-border/60 pr-4">
              <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1.5 mb-2">
                <span>Escalas Clínicas</span>
              </Label>
              <div className="space-y-2">
                {/* RASS */}
                <button
                  type="button"
                  onClick={() => setActiveMentalTab("rass")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeMentalTab === "rass"
                      ? "bg-violet-500/10 border-violet-500"
                      : "bg-card border-border hover:border-violet-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "rass" ? "bg-violet-500" : "bg-violet-500/15"
                    )}>
                      <Brain className={cn("h-3.5 w-3.5", activeMentalTab === "rass" ? "text-white" : "text-violet-500")} />
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeMentalTab === "rass" ? "text-violet-600" : "text-foreground/80")}>RASS (Sedação)</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Agitação e Sedação de Richmond</p>
                </button>

                {/* SAD PERSONS */}
                <button
                  type="button"
                  onClick={() => setActiveMentalTab("sad")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeMentalTab === "sad"
                      ? "bg-rose-500/10 border-rose-500"
                      : "bg-card border-border hover:border-rose-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "sad" ? "bg-rose-500" : "bg-rose-500/15"
                    )}>
                      <ShieldAlert className={cn("h-3.5 w-3.5", activeMentalTab === "sad" ? "text-white" : "text-rose-500")} />
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeMentalTab === "sad" ? "text-rose-600" : "text-foreground/80")}>SAD PERSONS</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Risco de Suicídio por fatores</p>
                </button>

                {/* CIWA-Ar */}
                <button
                  type="button"
                  onClick={() => setActiveMentalTab("ciwa")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeMentalTab === "ciwa"
                      ? "bg-amber-500/10 border-amber-500"
                      : "bg-card border-border hover:border-amber-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "ciwa" ? "bg-amber-500" : "bg-amber-500/15"
                    )}>
                      <Activity className={cn("h-3.5 w-3.5", activeMentalTab === "ciwa" ? "text-white" : "text-amber-500")} />
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeMentalTab === "ciwa" ? "text-amber-600" : "text-foreground/80")}>CIWA-Ar</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Abstinência Alcoólica Clínica</p>
                </button>

                {/* CAGE */}
                <button
                  type="button"
                  onClick={() => setActiveMentalTab("cage")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeMentalTab === "cage"
                      ? "bg-emerald-500/10 border-emerald-500"
                      : "bg-card border-border hover:border-emerald-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "cage" ? "bg-emerald-500" : "bg-emerald-500/15"
                    )}>
                      <Heart className={cn("h-3.5 w-3.5", activeMentalTab === "cage" ? "text-white" : "text-emerald-500")} />
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeMentalTab === "cage" ? "text-emerald-600" : "text-foreground/80")}>CAGE (Álcool)</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Rastreamento de Dependência</p>
                </button>

                {/* PHQ-9 */}
                <button
                  type="button"
                  onClick={() => setActiveMentalTab("phq9")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeMentalTab === "phq9"
                      ? "bg-blue-500/10 border-blue-500"
                      : "bg-card border-border hover:border-blue-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "phq9" ? "bg-blue-500" : "bg-blue-500/15"
                    )}>
                      <Brain className={cn("h-3.5 w-3.5", activeMentalTab === "phq9" ? "text-white" : "text-blue-500")} />
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeMentalTab === "phq9" ? "text-blue-600" : "text-foreground/80")}>PHQ-9</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Rastreamento de Depressão</p>
                </button>

                {/* GAD-7 */}
                <button
                  type="button"
                  onClick={() => setActiveMentalTab("gad7")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeMentalTab === "gad7"
                      ? "bg-teal-500/10 border-teal-500"
                      : "bg-card border-border hover:border-teal-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "gad7" ? "bg-teal-500" : "bg-teal-500/15"
                    )}>
                      <Activity className={cn("h-3.5 w-3.5", activeMentalTab === "gad7" ? "text-white" : "text-teal-500")} />
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeMentalTab === "gad7" ? "text-teal-600" : "text-foreground/80")}>GAD-7</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Rastreamento de Ansiedade</p>
                </button>

                {/* CAM */}
                <button
                  type="button"
                  onClick={() => setActiveMentalTab("cam")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeMentalTab === "cam"
                      ? "bg-orange-500/10 border-orange-500"
                      : "bg-card border-border hover:border-orange-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      activeMentalTab === "cam" ? "bg-orange-500" : "bg-orange-500/15"
                    )}>
                      <ShieldAlert className={cn("h-3.5 w-3.5", activeMentalTab === "cam" ? "text-white" : "text-orange-500")} />
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeMentalTab === "cam" ? "text-orange-600" : "text-foreground/80")}>CAM</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Rastreamento de Delirium</p>
                </button>
              </div>
            </div>

            {/* Coluna Direita: Formulários */}
            <div className="md:col-span-8 flex flex-col min-h-[400px]">
              {/* RASS Tab */}
            {activeMentalTab === "rass" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <Label className="text-xs font-black uppercase text-foreground/80">Richmond Agitation-Sedation Scale (RASS)</Label>
                  <Select value={rassVal} onValueChange={setRassVal}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Selecione o nível RASS..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="+4">+4 - Combativo (Violento, perigo imediato para a equipe)</SelectItem>
                      <SelectItem value="+3">+3 - Muito agitado (Agressivo, tenta remover tubos/cateteres)</SelectItem>
                      <SelectItem value="+2">+2 - Agitado (Movimentos frequentes sem propósito, briga com ventilador)</SelectItem>
                      <SelectItem value="+1">+1 - Inquieto (Ansioso, movimentos discretos sem agressividade)</SelectItem>
                      <SelectItem value="0">0 - Alerta e calmo</SelectItem>
                      <SelectItem value="-1">-1 - Sonolento (Desperta ao chamado verbal, contato visual &gt; 10s)</SelectItem>
                      <SelectItem value="-2">-2 - Sedação leve (Desperta ao chamado verbal, contato visual &lt; 10s)</SelectItem>
                      <SelectItem value="-3">-3 - Sedação moderada (Movimento ou abertura ocular ao chamado, sem contato visual)</SelectItem>
                      <SelectItem value="-4">-4 - Sedação profunda (Sem resposta ao chamado, mas responde a estímulo físico/dor)</SelectItem>
                      <SelectItem value="-5">-5 - Não responsivo (Sem resposta verbal ou física)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(() => {
                  const val = parseInt(rassVal);
                  let classification = "Alerta e calmo";
                  let levelColor = "bg-emerald-500 text-white";
                  let recommendation = "Manter acompanhamento clínico de rotina.";

                  if (val > 0) {
                    levelColor = "bg-amber-500 text-white animate-pulse";
                    if (val === 4) {
                      classification = "Agitação Combativa (Violento/Perigoso)";
                      levelColor = "bg-red-600 text-white animate-pulse";
                      recommendation = "PROTOCOLO DE AGITAÇÃO COMBATIVA! Garantir segurança da equipe e do paciente. Considerar contenção mecânica temporária supervisionada e sedação química imediata conforme prescrição médica. Acionar equipe de segurança se necessário.";
                    } else if (val === 3) {
                      classification = "Muito Agitado (Agressivo/Tenta remover dispositivos)";
                      levelColor = "bg-red-500 text-white animate-pulse";
                      recommendation = "Risco de auto-extubação ou perda de acessos. Oferecer ambiente tranquilo, rever medicação ansiolítica ou antipsicótica conforme prescrição. Vigilância contínua.";
                    } else if (val === 2) {
                      classification = "Agitado (Luta contra ventilação/Movimentos desordenados)";
                      recommendation = "Adequar plano de sedação ou ansiólise. Avaliar causas de dor ou desconforto físico. Monitorizar sinais de delirium.";
                    } else {
                      classification = "Inquieto (Ansioso/Movimentos discretos)";
                      recommendation = "Apoio verbal, reavaliação de queixas álgicas, acompanhamento próximo para evitar escalada de agitação.";
                    }
                  } else if (val < 0) {
                    if (val === -1) {
                      classification = "Sonolento (Contato visual &gt; 10s)";
                      levelColor = "bg-blue-500 text-white";
                      recommendation = "Sedação adequada para a maioria dos pacientes em UTI. Continuar acompanhamento.";
                    } else if (val === -2) {
                      classification = "Sedação Leve (Contato visual &lt; 10s)";
                      levelColor = "bg-indigo-500 text-white";
                      recommendation = "Sedação leve/moderada. Adequado dependendo do plano terapêutico.";
                    } else if (val === -3) {
                      classification = "Sedação Moderada (Sem contato visual)";
                      levelColor = "bg-purple-500 text-white";
                      recommendation = "Sedação moderada. Avaliar necessidade de manter este nível. Realizar despertar diário se aplicável.";
                    } else if (val === -4) {
                      classification = "Sedação Profunda (Apenas resposta física)";
                      levelColor = "bg-slate-700 text-white animate-pulse";
                      recommendation = "Sedação profunda. Avaliar risco de depressão respiratória (se não intubado). Monitorar reflexos protetores de vias aéreas.";
                    } else {
                      classification = "Não Responsivo (Coma Induzido/Profundo)";
                      levelColor = "bg-slate-900 text-white animate-pulse";
                      recommendation = "Sem resposta a estímulos dolorosos. Monitorar parâmetros ventilatórios e hemodinâmicos. Realizar cuidados preventivos de LPP (Braden) e úlcera de córnea.";
                    }
                  }

                  return (
                    <div className="mt-4 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Escore RASS</p>
                          <p className="text-3xl font-black text-foreground">{rassVal}</p>
                        </div>
                        <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", levelColor)}>
                          {classification}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setRassVal("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-violet-500/40 hover:bg-violet-500/5 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- ESCALA DE AGITAÇÃO-SEDAÇÃO DE RICHMOND (RASS): ${rassVal} (${classification}).\n  Conduta sugerida: ${recommendation}`;
                            setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                            setSelectedMentalSummary(`RASS: ${rassVal}`);
                            setOpenMentalCalc(false);
                            toast.success("Resultado RASS integrado com sucesso!");
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* SAD PERSONS Tab */}
            {activeMentalTab === "sad" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">S - Sexo Masculino</Label>
                    <Select value={sadSex} onValueChange={setSadSex}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">A - Idade (&lt;19 ou &gt;45 anos)</Label>
                    <Select value={sadAge} onValueChange={setSadAge}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">D - Depressão ou Desespero</Label>
                    <Select value={sadDepression} onValueChange={setSadDepression}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">P - Tentativa Prévia de Suicídio</Label>
                    <Select value={sadPrevAttempt} onValueChange={setSadPrevAttempt}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">E - Abuso de Álcool/Etanol</Label>
                    <Select value={sadEthanol} onValueChange={setSadEthanol}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">R - Perda de Razão (Psicose)</Label>
                    <Select value={sadRationalLoss} onValueChange={setSadRationalLoss}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">S - Sem Suporte Social (Solitário)</Label>
                    <Select value={sadSocialSupport} onValueChange={setSadSocialSupport}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">O - Plano Organizado de Suicídio</Label>
                    <Select value={sadOrganizedPlan} onValueChange={setSadOrganizedPlan}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">N - Sem Cônjuge (Divorciado/Viúvo)</Label>
                    <Select value={sadNoSpouse} onValueChange={setSadNoSpouse}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">S - Doença Crônica/Grave (Sickness)</Label>
                    <Select value={sadSickness} onValueChange={setSadSickness}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  let score = 0;
                  if (sadSex === "yes") score++;
                  if (sadAge === "yes") score++;
                  if (sadDepression === "yes") score++;
                  if (sadPrevAttempt === "yes") score++;
                  if (sadEthanol === "yes") score++;
                  if (sadRationalLoss === "yes") score++;
                  if (sadSocialSupport === "yes") score++;
                  if (sadOrganizedPlan === "yes") score++;
                  if (sadNoSpouse === "yes") score++;
                  if (sadSickness === "yes") score++;

                  let riskClass = "Risco Baixo";
                  let riskColor = "bg-emerald-500 text-white";
                  let recommendation = "Alta segura com acompanhamento ambulatorial ou em CAPS de referência. Orientar rede familiar e de apoio.";

                  if (score >= 7) {
                    riskClass = "Risco Muito Alto";
                    riskColor = "bg-red-600 text-white animate-pulse";
                    recommendation = "INTERNAÇÃO PSIQUIÁTRICA IMEDIATA! Vigilância 1:1 rigorosa e ininterrupta da equipe de enfermagem. Retirar pertences perigosos (cordões, cintos, objetos cortantes, lençóis adicionais) e manter sob observação direta em leito de monitoração.";
                  } else if (score >= 5) {
                    riskClass = "Risco Alto";
                    riskColor = "bg-red-500 text-white animate-pulse";
                    recommendation = "Forte indicação de internação / observação. Solicitar avaliação psiquiátrica de urgência. Manter vigilância constante da equipe de enfermagem e restrição de objetos de risco no leito.";
                  } else if (score >= 3) {
                    riskClass = "Risco Moderado";
                    riskColor = "bg-amber-500 text-white";
                    recommendation = "Acompanhamento ambulatorial intensivo ou observação clínica no setor. Solicitar parecer de Saúde Mental/Psiquiatria ou agendamento prioritário em CAPS.";
                  }

                  return (
                    <div className="mt-4 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação SAD PERSONS</p>
                          <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-bold text-muted-foreground">/ 10 pts</span></p>
                        </div>
                        <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", riskColor)}>
                          {riskClass}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setSadSex("no"); setSadAge("no"); setSadDepression("no"); setSadPrevAttempt("no"); setSadEthanol("no"); setSadRationalLoss("no"); setSadSocialSupport("no"); setSadOrganizedPlan("no"); setSadNoSpouse("no"); setSadSickness("no");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-rose-500/40 hover:bg-rose-500/5 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const itemsList = [];
                            if (sadSex === "yes") itemsList.push("Sexo Masculino");
                            if (sadAge === "yes") itemsList.push("Idade extrema (<19 ou >45)");
                            if (sadDepression === "yes") itemsList.push("Depressão/Desespero");
                            if (sadPrevAttempt === "yes") itemsList.push("Tentativa prévia");
                            if (sadEthanol === "yes") itemsList.push("Abuso de etanol");
                            if (sadRationalLoss === "yes") itemsList.push("Perda da razão/Psicose");
                            if (sadSocialSupport === "yes") itemsList.push("Sem suporte social");
                            if (sadOrganizedPlan === "yes") itemsList.push("Plano organizado");
                            if (sadNoSpouse === "yes") itemsList.push("Sem cônjuge");
                            if (sadSickness === "yes") itemsList.push("Doença grave/crônica");

                            const itemsStr = itemsList.length > 0 ? itemsList.join(", ") : "Nenhum fator presente";
                            const descText = `- ESCALA SAD PERSONS (RISCO DE SUICÍDIO): ${score}/10 pontos (${riskClass.toUpperCase()}).\n  ` +
                              `• Fatores Presentes: ${itemsStr}.\n  ` +
                              `Conduta sugerida: ${recommendation}`;
                            setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                            setSelectedMentalSummary(`SAD: ${score} pts (${riskClass.split(" ")[1] || "Baixo"})`);
                            setOpenMentalCalc(false);
                            toast.success("Escore SAD PERSONS integrado com sucesso!");
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* CIWA-Ar Tab */}
            {activeMentalTab === "ciwa" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">1. Náuseas e Vômitos</Label>
                    <Select value={ciwaNausea} onValueChange={setCiwaNausea}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Ausente</SelectItem>
                        <SelectItem value="1">1 - Náusea leve, sem vômitos</SelectItem>
                        <SelectItem value="4">4 - Náusea intermitente com vômito seco</SelectItem>
                        <SelectItem value="7">7 - Náuseas constantes, vômitos frequentes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">2. Tremores (Mãos estendidas)</Label>
                    <Select value={ciwaTremor} onValueChange={setCiwaTremor}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Ausente</SelectItem>
                        <SelectItem value="1">1 - Sentido apenas nas pontas dos dedos</SelectItem>
                        <SelectItem value="4">4 - Moderado com braços estendidos</SelectItem>
                        <SelectItem value="7">7 - Grave e constante, mesmo sem estender os braços</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">3. Sudorese Paroxística</Label>
                    <Select value={ciwaSweat} onValueChange={setCiwaSweat}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Ausente</SelectItem>
                        <SelectItem value="1">1 - Umidade palmar apenas perceptível</SelectItem>
                        <SelectItem value="4">4 - Gotas de suor visíveis na testa</SelectItem>
                        <SelectItem value="7">7 - Sudorese profusa, ensopando roupas/lençóis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">4. Ansiedade / Inquietude</Label>
                    <Select value={ciwaAnxiety} onValueChange={setCiwaAnxiety}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Calmo, sem ansiedade</SelectItem>
                        <SelectItem value="1">1 - Levemente tenso ou ansioso</SelectItem>
                        <SelectItem value="4">4 - Moderadamente ansioso ou apreensivo</SelectItem>
                        <SelectItem value="7">7 - Pânico comparável a episódios psicóticos agudos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">5. Agitação Psicomotora</Label>
                    <Select value={ciwaAgitation} onValueChange={setCiwaAgitation}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Atividade normal</SelectItem>
                        <SelectItem value="1">1 - Atividade levemente aumentada, se move muito</SelectItem>
                        <SelectItem value="4">4 - Moderadamente inquieto, muda de posição constantemente</SelectItem>
                        <SelectItem value="7">7 - Agitação severa, se debate, requer contenção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">6. Alterações Tácteis (Coceira/Queimação)</Label>
                    <Select value={ciwaTactile} onValueChange={setCiwaTactile}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Nenhuma</SelectItem>
                        <SelectItem value="1">1 - Parestesia/formigamento leve</SelectItem>
                        <SelectItem value="4">4 - Alucinações tácteis moderadas (sensação de insetos)</SelectItem>
                        <SelectItem value="7">7 - Alucinações tácteis contínuas e graves</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">7. Alterações Auditivas</Label>
                    <Select value={ciwaAuditory} onValueChange={setCiwaAuditory}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Ausente (Sensibilidade normal)</SelectItem>
                        <SelectItem value="1">1 - Leve hipersensibilidade ou ruídos ásperos</SelectItem>
                        <SelectItem value="4">4 - Alucinações auditivas moderadas</SelectItem>
                        <SelectItem value="7">7 - Alucinações auditivas graves e aterrorizantes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">8. Alterações Visuais</Label>
                    <Select value={ciwaVisual} onValueChange={setCiwaVisual}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Ausente (Sensibilidade normal)</SelectItem>
                        <SelectItem value="1">1 - Leve sensibilidade à light</SelectItem>
                        <SelectItem value="4">4 - Alucinações visuais moderadas (vê vultos)</SelectItem>
                        <SelectItem value="7">7 - Alucinações visuais contínuas e aterrorizantes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">9. Cefaleia / Sensação de Aperto</Label>
                    <Select value={ciwaHeadache} onValueChange={setCiwaHeadache}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Sem cefaleia</SelectItem>
                        <SelectItem value="1">1 - Cefaleia muito leve</SelectItem>
                        <SelectItem value="4">4 - Cefaleia moderada</SelectItem>
                        <SelectItem value="7">7 - Cefaleia severa e incapacitante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">10. Orientação e Sensório</Label>
                    <Select value={ciwaOrientation} onValueChange={setCiwaOrientation}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Totalmente orientado no tempo e espaço</SelectItem>
                        <SelectItem value="1">1 - Desorientação temporal leve (incerto sobre o dia)</SelectItem>
                        <SelectItem value="2">2 - Desorientação temporal grave (errada por &gt; 2 dias)</SelectItem>
                        <SelectItem value="3">3 - Desorientado no espaço e/ou em relação a pessoas</SelectItem>
                        <SelectItem value="4">4 - Totalmente desorientado ou não cooperativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  const score = (parseInt(ciwaNausea) || 0) +
                    (parseInt(ciwaTremor) || 0) +
                    (parseInt(ciwaSweat) || 0) +
                    (parseInt(ciwaAnxiety) || 0) +
                    (parseInt(ciwaAgitation) || 0) +
                    (parseInt(ciwaTactile) || 0) +
                    (parseInt(ciwaAuditory) || 0) +
                    (parseInt(ciwaVisual) || 0) +
                    (parseInt(ciwaHeadache) || 0) +
                    (parseInt(ciwaOrientation) || 0);

                  let severityClass = "Abstinência Leve";
                  let severityColor = "bg-emerald-500 text-white";
                  let recommendation = "Baixo risco de complicações imediatas. Manter monitoramento clínico geral. Não requer benzodiazepínicos de rotina.";

                  if (score > 15) {
                    severityClass = "Abstinência Grave / Delirium Tremens";
                    severityColor = "bg-red-500 text-white animate-pulse";
                    recommendation = "ALERTA CRÍTICO! Alto risco de convulsões e Delirium Tremens. Monitorização contínua na Sala Vermelha. Iniciar Diazepam (ou Lorazepam se insuficiência hepática) conforme protocolo institucional e monitorização rígida de sinais vitais.";
                  } else if (score >= 8) {
                    severityClass = "Abstinência Moderada";
                    severityColor = "bg-amber-500 text-white";
                    recommendation = "Indicação de farmacoterapia profilática com benzodiazepínicos (ex: Diazepam 10mg VO/EV de hora em hora até estabilização do escore CIWA < 8). Reavaliar escore a cada 1-2 horas.";
                  }

                  return (
                    <div className="mt-4 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação CIWA-Ar</p>
                          <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-bold text-muted-foreground">/ 67 pts</span></p>
                        </div>
                        <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", severityColor)}>
                          {severityClass}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setCiwaNausea("0"); setCiwaTremor("0"); setCiwaSweat("0"); setCiwaAnxiety("0"); setCiwaAgitation("0"); setCiwaTactile("0"); setCiwaAuditory("0"); setCiwaVisual("0"); setCiwaHeadache("0"); setCiwaOrientation("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- PROTOCOLO DE ABSTINÊNCIA CIWA-Ar: ${score} pontos (${severityClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                            setSelectedMentalSummary(`CIWA: ${score} pts (${score > 15 ? 'Grave' : score >= 8 ? 'Mod' : 'Leve'})`);
                            setOpenMentalCalc(false);
                            toast.success("Escore CIWA-Ar integrado com sucesso!");
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* CAGE Tab */}
            {activeMentalTab === "cage" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-black uppercase text-foreground/80">1. C - Já sentiu necessidade de diminuir (Cut down) o consumo de álcool?</Label>
                    <Select value={cageCut} onValueChange={setCageCut}>
                      <SelectTrigger className="h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-black uppercase text-foreground/80">2. A - As pessoas já o irritaram (Annoyed) ao criticar seu hábito de beber?</Label>
                    <Select value={cageAnnoyed} onValueChange={setCageAnnoyed}>
                      <SelectTrigger className="h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-black uppercase text-foreground/80">3. G - Já se sentiu culpado (Guilty) pela maneira como costuma beber?</Label>
                    <Select value={cageGuilty} onValueChange={setCageGuilty}>
                      <SelectTrigger className="h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-black uppercase text-foreground/80">4. E - Já precisou beber logo pela manhã para acalmar os nervos ou combater ressaca (Eye-opener)?</Label>
                    <Select value={cageEyeOpener} onValueChange={setCageEyeOpener}>
                      <SelectTrigger className="h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não (0)</SelectItem>
                        <SelectItem value="yes">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  let score = 0;
                  if (cageCut === "yes") score++;
                  if (cageAnnoyed === "yes") score++;
                  if (cageGuilty === "yes") score++;
                  if (cageEyeOpener === "yes") score++;

                  let riskClass = "Baixo Risco de Dependência";
                  let riskColor = "bg-emerald-500 text-white";
                  let recommendation = "Paciente com triagem negativa para alcoolismo. Orientações preventivas de saúde geral.";

                  if (score >= 2) {
                    riskClass = "Triagem Positiva / Risco de Alcoolismo";
                    riskColor = "bg-amber-500 text-white font-bold";
                    recommendation = "Sugestão de dependência de álcool (escore CAGE >= 2). Indicação de avaliação diagnóstica aprofundada, intervenção breve e encaminhamento para CAPS-AD ou grupo de apoio especializado.";
                  }

                  return (
                    <div className="mt-4 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação CAGE</p>
                          <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-bold text-muted-foreground">/ 4 pts</span></p>
                        </div>
                        <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", riskColor)}>
                          {riskClass}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setCageCut("no"); setCageAnnoyed("no"); setCageGuilty("no"); setCageEyeOpener("no");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-yellow-500/40 hover:bg-yellow-500/5 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- TRIAGEM DE ALCOOLISMO CAGE: ${score}/4 pontos (${riskClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                            setSelectedMentalSummary(`CAGE: ${score}/4 (${score >= 2 ? 'Positivo' : 'Negativo'})`);
                            setOpenMentalCalc(false);
                            toast.success("Escore CAGE integrated com sucesso!");
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-primary text-primary-foreground"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* PHQ-9 Tab */}
            {activeMentalTab === "phq9" && (() => {
              const phqLabels = [
                "1. Pouco interesse ou prazer em fazer as coisas",
                "2. Sentir-se triste, deprimido(a) ou sem esperança",
                "3. Dificuldade para adormecer, manter o sono ou dormir demais",
                "4. Sentir-se cansado(a) ou com pouca energia",
                "5. Apetite diminuído ou exagerado",
                "6. Sentir-se mal consigo mesmo(a) ou que é um fracasso",
                "7. Dificuldade de se concentrar (ler, assistir TV etc.)",
                "8. Lentidão ou agitação perceptível pelos outros",
                "9. Pensamentos de se machucar ou que seria melhor estar morto(a)",
              ];
              const phqVals = [phq1, phq2, phq3, phq4, phq5, phq6, phq7, phq8, phq9];
              const phqSetters = [setPhq1, setPhq2, setPhq3, setPhq4, setPhq5, setPhq6, setPhq7, setPhq8, setPhq9];
              const score = phqVals.reduce((s, v) => s + parseInt(v), 0);
              let severity = "Mínima / Sem Depressão"; let sevColor = "bg-emerald-500 text-white";
              let recommendation = "Sem indicação de tratamento farmacológico. Orientações de estilo de vida e reavaliação em 3 meses.";
              if (score >= 20) { severity = "Depressão Grave"; sevColor = "bg-red-600 text-white animate-pulse"; recommendation = "Tratamento intensivo com antidepressivo e/ou psicoterapia. Avaliar internação psiquiátrica. Rastrear risco de suicídio (SAD PERSONS)."; }
              else if (score >= 15) { severity = "Depressão Moderada-Grave"; sevColor = "bg-red-500 text-white animate-pulse"; recommendation = "Iniciar antidepressivo + encaminhamento para psiquiatria. Reavaliação em 2 semanas."; }
              else if (score >= 10) { severity = "Depressão Moderada"; sevColor = "bg-amber-500 text-white"; recommendation = "Considerar antidepressivo e/ou psicoterapia. Encaminhamento para saúde mental. Reavaliação em 4 semanas."; }
              else if (score >= 5) { severity = "Depressão Leve"; sevColor = "bg-yellow-500 text-white"; recommendation = "Monitoramento em atenção primária, orientações, suporte psicossocial e reavaliação em 4-6 semanas."; }
              return (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <Label className="text-xs font-black uppercase text-foreground/80">PHQ-9 — Patient Health Questionnaire</Label>
                  <p className="text-[10px] text-muted-foreground">Nas últimas 2 semanas, com que frequência você foi incomodado(a) pelos seguintes problemas?</p>
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {phqLabels.map((label, i) => (
                      <div key={i} className="space-y-0.5">
                        <Label className="text-[10px] font-bold text-foreground/80">{label}</Label>
                        <Select value={phqVals[i]} onValueChange={phqSetters[i]}>
                          <SelectTrigger className="h-8 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">Nenhuma vez (0)</SelectItem>
                            <SelectItem value="1">Vários dias (1)</SelectItem>
                            <SelectItem value="2">Mais da metade dos dias (2)</SelectItem>
                            <SelectItem value="3">Quase todos os dias (3)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div><p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Escore PHQ-9</p><p className="text-3xl font-black">{score} <span className="text-sm font-bold text-muted-foreground">/ 27 pts</span></p></div>
                      <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", sevColor)}>{severity}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" onClick={() => { setPhq1("0"); setPhq2("0"); setPhq3("0"); setPhq4("0"); setPhq5("0"); setPhq6("0"); setPhq7("0"); setPhq8("0"); setPhq9("0"); setPhqDifficulty("0"); toast.info("Campos da calculadora limpos."); }} className="h-10 px-4 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-600 dark:hover:text-blue-400 transition-all">Limpar</Button>
                      <Button type="button" onClick={() => { const descText = `- PHQ-9 (DEPRESS\u00c3O): ${score}/27 pts (${severity.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`; setDescription(prev => prev ? `${prev}\n${descText}` : descText); setSelectedMentalSummary(`PHQ-9: ${score} pts (${severity.split(" ")[0]})`); setOpenMentalCalc(false); toast.success("PHQ-9 integrado com sucesso!"); }} className="flex-1 h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-blue-600 hover:bg-blue-700 text-white">Confirmar e Aplicar ao Prontuário</Button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* GAD-7 Tab */}
            {activeMentalTab === "gad7" && (() => {
              const gadLabels = [
                "1. Sentir-se nervoso(a), ansioso(a) ou no limite",
                "2. Não conseguir parar ou controlar a preocupação",
                "3. Preocupar-se demais com coisas diferentes",
                "4. Dificuldade de relaxar",
                "5. Ficar tão agitado(a) que é difícil ficar quieto(a)",
                "6. Ficar facilmente irritado(a) ou aborrecido(a)",
                "7. Sentir medo como se algo terrível pudesse acontecer",
              ];
              const gadVals = [gad1, gad2, gad3, gad4, gad5, gad6, gad7];
              const gadSetters = [setGad1, setGad2, setGad3, setGad4, setGad5, setGad6, setGad7];
              const score = gadVals.reduce((s, v) => s + parseInt(v), 0);
              let severity = "Ansiedade Mínima"; let sevColor = "bg-emerald-500 text-white";
              let recommendation = "Sem indicação de tratamento farmacológico. Orientações de controle de estresse e higiene do sono.";
              if (score >= 15) { severity = "Ansiedade Grave"; sevColor = "bg-red-600 text-white animate-pulse"; recommendation = "Encaminhamento urgente para psiquiatria. Considerar ansiolítico de curto prazo e/ou antidepressivo ISRS. Rastrear risco de suicídio."; }
              else if (score >= 10) { severity = "Ansiedade Moderada"; sevColor = "bg-amber-500 text-white"; recommendation = "Encaminhamento para saúde mental, psicoterapia cognitivo-comportamental (TCC) e/ou ISRS. Reavaliação em 4 semanas."; }
              else if (score >= 5) { severity = "Ansiedade Leve"; sevColor = "bg-yellow-500 text-white"; recommendation = "Monitoramento, técnicas de relaxamento, atividade física regular e reavaliação em 4-6 semanas."; }
              return (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <Label className="text-xs font-black uppercase text-foreground/80">GAD-7 — Generalized Anxiety Disorder Scale</Label>
                  <p className="text-[10px] text-muted-foreground">Nas últimas 2 semanas, com que frequência você foi incomodado(a) pelos seguintes problemas?</p>
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {gadLabels.map((label, i) => (
                      <div key={i} className="space-y-0.5">
                        <Label className="text-[10px] font-bold text-foreground/80">{label}</Label>
                        <Select value={gadVals[i]} onValueChange={gadSetters[i]}>
                          <SelectTrigger className="h-8 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="0">Nenhuma vez (0)</SelectItem>
                            <SelectItem value="1">Vários dias (1)</SelectItem>
                            <SelectItem value="2">Mais da metade dos dias (2)</SelectItem>
                            <SelectItem value="3">Quase todos os dias (3)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div><p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Escore GAD-7</p><p className="text-3xl font-black">{score} <span className="text-sm font-bold text-muted-foreground">/ 21 pts</span></p></div>
                      <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", sevColor)}>{severity}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" onClick={() => { setGad1("0"); setGad2("0"); setGad3("0"); setGad4("0"); setGad5("0"); setGad6("0"); setGad7("0"); setGadDifficulty("0"); toast.info("Campos da calculadora limpos."); }} className="h-10 px-4 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-teal-500/40 hover:bg-teal-500/5 hover:text-teal-600 dark:hover:text-teal-400 transition-all">Limpar</Button>
                      <Button type="button" onClick={() => { const descText = `- GAD-7 (ANSIEDADE): ${score}/21 pts (${severity.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`; setDescription(prev => prev ? `${prev}\n${descText}` : descText); setSelectedMentalSummary(`GAD-7: ${score} pts (${severity.split(" ")[1] || "Mín"})`); setOpenMentalCalc(false); toast.success("GAD-7 integrado com sucesso!"); }} className="flex-1 h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-teal-600 hover:bg-teal-700 text-white">Confirmar e Aplicar ao Prontuário</Button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CAM Tab */}
            {activeMentalTab === "cam" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <Label className="text-xs font-black uppercase text-foreground/80">CAM — Confusion Assessment Method</Label>
                <p className="text-[10px] text-muted-foreground">Método de triagem rápida para Delirium. Os critérios 1 e 2 são obrigatórios. O diagnóstico exige (1+2) + (3 ou 4).</p>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">🔑 Critério 1 (OBRIGATÓRIO) — Início Agudo e Flutuante</Label>
                    <p className="text-[10px] text-muted-foreground mb-1">Houve mudança aguda no estado mental em relação ao basal? O comportamento flutua ao longo do dia?</p>
                    <Select value={camAcuteOnset} onValueChange={setCamAcuteOnset}>
                      <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não / Incerto</SelectItem>
                        <SelectItem value="yes">Sim — Presente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">🔑 Critério 2 (OBRIGATÓRIO) — Desatenção</Label>
                    <p className="text-[10px] text-muted-foreground mb-1">O paciente tem dificuldade de manter a atenção? Facilmente distraído? Perde o fio da meada?</p>
                    <Select value={camInattention} onValueChange={setCamInattention}>
                      <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não / Incerto</SelectItem>
                        <SelectItem value="yes">Sim — Presente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Critério 3 — Pensamento Desorganizado</Label>
                    <p className="text-[10px] text-muted-foreground mb-1">Discurso incoerente, pensamento ilógico ou muda de assunto de forma imprevisível?</p>
                    <Select value={camDisorganized} onValueChange={setCamDisorganized}>
                      <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não / Incerto</SelectItem>
                        <SelectItem value="yes">Sim — Presente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Critério 4 — Alteração do Nível de Consciência</Label>
                    <p className="text-[10px] text-muted-foreground mb-1">O nível de consciência está alterado (agitado, letárgico, estupor ou coma)?</p>
                    <Select value={camAlteredConsciousness} onValueChange={setCamAlteredConsciousness}>
                      <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="no">Não — Alerta e normal</SelectItem>
                        <SelectItem value="yes">Sim — Alterado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {(() => {
                  const hasBase = camAcuteOnset === "yes" && camInattention === "yes";
                  const hasThird = camDisorganized === "yes" || camAlteredConsciousness === "yes";
                  const positiveCAM = hasBase && hasThird;
                  const recommendation = positiveCAM
                    ? "DELIRIUM CONFIRMADO! Identificar e tratar a causa base (infecção, hipóxia, dor, retenção urinária, fármacos, distúrbio metabólico). Reorientar paciente frequentemente (data, local, equipe). Evitar contenção física e benzodiazepínicos. Manter ciclo sono-vigília. Acionar equipe médica para avaliação e investigação."
                    : !hasBase
                    ? "Critérios obrigatórios (1 e 2) não preenchidos. Delirium improvável. Continuar monitoramento de rotina."
                    : "Critérios 1 e 2 presentes, mas nenhum dos complementares (3 ou 4). Delirium improvável — monitorar.";
                  return (
                    <div className="p-3 rounded-2xl bg-muted/30 border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <div><p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Resultado CAM</p></div>
                        <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", positiveCAM ? "bg-red-600 text-white animate-pulse" : "bg-emerald-500 text-white")}>
                          {positiveCAM ? "⚠️ DELIRIUM POSITIVO" : "Delirium Negativo"}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{recommendation}</p>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" onClick={() => { setCam1("no"); setCam2("no"); setCam3("no"); setCam4("no"); toast.info("Campos da calculadora limpos."); }} className="h-10 px-4 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-600 dark:hover:text-orange-400 transition-all">Limpar</Button>
                        <Button type="button" onClick={() => { const descText = `- CAM (DELIRIUM): ${positiveCAM ? "POSITIVO" : "NEGATIVO"}.\n  Conduta: ${recommendation}`; setDescription(prev => prev ? `${prev}\n${descText}` : descText); setSelectedMentalSummary(`CAM: ${positiveCAM ? "DELIRIUM +" : "Negativo"}`); setOpenMentalCalc(false); toast.success("Avaliação CAM integrada com sucesso!"); }} className="flex-1 h-10 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-orange-600 hover:bg-orange-700 text-white">Confirmar e Aplicar ao Prontuário</Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 6.7. DIÁLOGO URGÊNCIAS CLÍNICAS (HEART, NIHSS, CRB-65, WELLS, ALVARADO)    */}
      {/* ========================================================================= */}
      <Dialog open={openUrgencyCalc} onOpenChange={setOpenUrgencyCalc}>
        <DialogContent className="sm:max-w-[850px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-rose-500 animate-pulse" />
              Central de Urgências Clínicas e Triagem Rápida
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Calculadoras Clínicas de Emergência, AVC, Pneumonia, TEP e Apendicite
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
            {/* Coluna Esquerda: Menu Vertical */}
            <div className="md:col-span-4 space-y-3 border-r border-border/60 pr-4">
              <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1.5 mb-2">
                <span>Calculadoras Clínicas</span>
              </Label>
              <div className="space-y-2">
                {/* HEART */}
                <button
                  type="button"
                  onClick={() => setActiveUrgencyTab("heart")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeUrgencyTab === "heart"
                      ? "bg-rose-500/10 border-rose-500"
                      : "bg-card border-border hover:border-rose-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "heart" ? "bg-rose-500" : "bg-rose-500/15"
                    )}>
                      <span>🫀</span>
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeUrgencyTab === "heart" ? "text-rose-600" : "text-foreground/80")}>HEART</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Dor Torácica Aguda</p>
                </button>

                {/* NIHSS */}
                <button
                  type="button"
                  onClick={() => setActiveUrgencyTab("nihss")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeUrgencyTab === "nihss"
                      ? "bg-violet-500/10 border-violet-500"
                      : "bg-card border-border hover:border-violet-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "nihss" ? "bg-violet-500" : "bg-violet-500/15"
                    )}>
                      <span>🧠</span>
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeUrgencyTab === "nihss" ? "text-violet-600" : "text-foreground/80")}>NIHSS (AVC)</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Déficit Neurológico do AVC</p>
                </button>

                {/* CRB-65 */}
                <button
                  type="button"
                  onClick={() => setActiveUrgencyTab("crb65")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeUrgencyTab === "crb65"
                      ? "bg-sky-500/10 border-sky-500"
                      : "bg-card border-border hover:border-sky-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "crb65" ? "bg-sky-500" : "bg-sky-500/15"
                    )}>
                      <span>🫁</span>
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeUrgencyTab === "crb65" ? "text-sky-600" : "text-foreground/80")}>CRB-65 (PAC)</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Pneumonia Adquirida na Comunidade</p>
                </button>

                {/* Wells TEP */}
                <button
                  type="button"
                  onClick={() => setActiveUrgencyTab("wells")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeUrgencyTab === "wells"
                      ? "bg-orange-500/10 border-orange-500"
                      : "bg-card border-border hover:border-orange-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "wells" ? "bg-orange-500" : "bg-orange-500/15"
                    )}>
                      <span>🦵</span>
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeUrgencyTab === "wells" ? "text-orange-600" : "text-foreground/80")}>Wells (TEP)</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Tromboembolismo Pulmonar</p>
                </button>

                {/* Alvarado */}
                <button
                  type="button"
                  onClick={() => setActiveUrgencyTab("alvarado")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeUrgencyTab === "alvarado"
                      ? "bg-emerald-500/10 border-emerald-500"
                      : "bg-card border-border hover:border-emerald-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "alvarado" ? "bg-emerald-500" : "bg-emerald-500/15"
                    )}>
                      <span>🔪</span>
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeUrgencyTab === "alvarado" ? "text-emerald-600" : "text-foreground/80")}>Alvarado</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Suspeita de Apendicite Aguda</p>
                </button>

                {/* GRACE */}
                <button
                  type="button"
                  onClick={() => setActiveUrgencyTab("grace")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeUrgencyTab === "grace"
                      ? "bg-red-500/10 border-red-500"
                      : "bg-card border-border hover:border-red-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "grace" ? "bg-red-500" : "bg-red-500/15"
                    )}>
                      <span>❤️‍🔥</span>
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeUrgencyTab === "grace" ? "text-red-600" : "text-foreground/80")}>GRACE</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Risco em Infarto / SCA</p>
                </button>

                {/* Ranson */}
                <button
                  type="button"
                  onClick={() => setActiveUrgencyTab("ranson")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeUrgencyTab === "ranson"
                      ? "bg-yellow-500/10 border-yellow-500"
                      : "bg-card border-border hover:border-yellow-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeUrgencyTab === "ranson" ? "bg-yellow-500" : "bg-yellow-500/15"
                    )}>
                      <span>🩸</span>
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeUrgencyTab === "ranson" ? "text-yellow-600" : "text-foreground/80")}>Ranson</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Pancreatite Aguda</p>
                </button>
              </div>
            </div>

              {/* Coluna Direita: Formulários */}
            <div className="md:col-span-8 flex flex-col min-h-[400px]">
              {/* HEART Tab */}
            {activeUrgencyTab === "heart" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">H - História Clínica</Label>
                    <Select value={heartHistory} onValueChange={setHeartHistory}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Inespecífica / Pouco suspeita</SelectItem>
                        <SelectItem value="1">1 - Moderadamente suspeita</SelectItem>
                        <SelectItem value="2">2 - Altamente suspeita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">E - Eletrocardiograma (ECG)</Label>
                    <Select value={heartEcg} onValueChange={setHeartEcg}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Normal</SelectItem>
                        <SelectItem value="1">1 - Repolarização inespecífica / BR / HVE / Alteração prévia</SelectItem>
                        <SelectItem value="2">2 - Depressão de ST significativa / Inversão de T dinâmica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">A - Idade (Anos)</Label>
                    <Select value={heartAge} onValueChange={setHeartAge}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - &lt; 45 anos</SelectItem>
                        <SelectItem value="1">1 - 45 a 64 anos</SelectItem>
                        <SelectItem value="2">2 - &gt;= 65 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">R - Fatores de Risco</Label>
                    <Select value={heartRisk} onValueChange={setHeartRisk}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Nenhum fator de risco ativo</SelectItem>
                        <SelectItem value="1">1 - 1 a 2 fatores de risco (HAS, DM, DLP, Fumo, Obesidade, Hist. Fam)</SelectItem>
                        <SelectItem value="2">2 - &gt;= 3 fatores de risco ou Aterosclerose documentada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">T - Troponina inicial</Label>
                    <Select value={heartTroponin} onValueChange={setHeartTroponin}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Normal (abaixo do limite superior de normalidade)</SelectItem>
                        <SelectItem value="1">1 - Elevada entre 1 a 3 vezes o limite superior</SelectItem>
                        <SelectItem value="2">2 - Altamente elevada ( &gt; 3 vezes o limite superior)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  const score = parseInt(heartHistory) + parseInt(heartEcg) + parseInt(heartAge) + parseInt(heartRisk) + parseInt(heartTroponin);
                  let riskClass = "Baixo Risco";
                  let levelColor = "bg-emerald-500 text-white";
                  let recommendation = "Alta segura da emergência com orientações. Agendar acompanhamento com Cardiologista ambulatorial em até 72 horas.";

                  if (score >= 7) {
                    riskClass = "Alto Risco";
                    levelColor = "bg-red-600 text-white animate-pulse";
                    recommendation = "Internação em Unidade Coronariana/Monitoreamento Intensivo. Terapia anti-isquêmica plena (Dupla Antiagregação Plaquetária + Anticoagulação). Solicitação de Cineangiocoronariografia (CATE) de urgência.";
                  } else if (score >= 4) {
                    riskClass = "Risco Moderado";
                    levelColor = "bg-amber-500 text-white";
                    recommendation = "Admissão para protocolo de dor torácica sob observação na UPA. Realizar monitorização contínua por ECG e colher nova Troponina de curva (0h, 3h). Avaliar exames adicionais.";
                  }

                  return (
                    <div className="mt-4 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Escore HEART</p>
                          <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-medium text-muted-foreground">/ 10 pts</span></p>
                        </div>
                        <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", levelColor)}>
                          {riskClass}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-muted-foreground p-3 rounded-xl bg-card border border-border">
                        <span className="font-bold text-foreground">Conduta sugerida:</span> {recommendation}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setHeartHistory("0"); setHeartEcg("0"); setHeartAge("0"); setHeartRisk("0"); setHeartTroponin("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-rose-500/40 hover:bg-rose-500/5 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- ESCORE HEART (TRIAGEM DE DOR TORÁCICA): ${score}/10 pontos (${riskClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                            setSelectedUrgencySummary(`HEART: ${score} pts (${score >= 7 ? 'Alto' : score >= 4 ? 'Mod' : 'Baixo'})`);
                            setOpenUrgencyCalc(false);
                            toast.success("Escore HEART integrado com sucesso!");
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* NIHSS Tab */}
            {activeUrgencyTab === "nihss" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center">Protocolo Completo NIHSS - Avaliação de Déficit Neurológico no AVC</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[30vh] overflow-y-auto pr-2 pb-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">1a. Nível de Consciência (LOC)</Label>
                    <Select value={nihLoc} onValueChange={setNihLoc}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Alerta</SelectItem>
                        <SelectItem value="1">1 - Sonolento (Desperta ao verbal leve)</SelectItem>
                        <SelectItem value="2">2 - Torporoso (Requer estímulo vigoroso/doloroso)</SelectItem>
                        <SelectItem value="3">3 - Coma (Apenas resposta reflexa ou arresponsivo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">1b. LOC Perguntas (Mês e Idade)</Label>
                    <Select value={nihQuestions} onValueChange={setNihQuestions}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Acerta ambas as perguntas</SelectItem>
                        <SelectItem value="1">1 - Acerta uma pergunta</SelectItem>
                        <SelectItem value="2">2 - Erra ambas / Afásico / Estuporoso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">1c. LOC Comandos (Olhos e Mão)</Label>
                    <Select value={nihCommands} onValueChange={setNihCommands}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Executa ambos corretamente</SelectItem>
                        <SelectItem value="1">1 - Executa um corretamente</SelectItem>
                        <SelectItem value="2">2 - Não executa nenhum corretamente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">2. Olhar Conjugado Horizontal</Label>
                    <Select value={nihGaze} onValueChange={setNihGaze}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Normal</SelectItem>
                        <SelectItem value="1">1 - Paralisia parcial do olhar horizontal</SelectItem>
                        <SelectItem value="2">2 - Desvio conjugado forçado / Paralisia total</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">3. Campos Visuais (Hemianopsia)</Label>
                    <Select value={nihVisual} onValueChange={setNihVisual}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Sem perda visual</SelectItem>
                        <SelectItem value="1">1 - Hemianopsia parcial (quadrantanopsia)</SelectItem>
                        <SelectItem value="2">2 - Hemianopsia completa contralateral</SelectItem>
                        <SelectItem value="3">3 - Cegueira bilateral / Amaurose completa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">4. Paralisia Facial</Label>
                    <Select value={nihFacial} onValueChange={setNihFacial}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Movimentos normais / Simétricos</SelectItem>
                        <SelectItem value="1">1 - Paralisia facial leve (apagamento sulco nasolabial)</SelectItem>
                        <SelectItem value="2">2 - Paralisia parcial (metade inferior da face)</SelectItem>
                        <SelectItem value="3">3 - Paralisia facial completa (unilateral total)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">5a. Motor MS Esquerdo (Braço)</Label>
                    <Select value={nihArmL} onValueChange={setNihArmL}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Sem queda (mantém 90º por 10s)</SelectItem>
                        <SelectItem value="1">1 - Queda leve (cai antes de 10s, sem tocar na cama)</SelectItem>
                        <SelectItem value="2">2 - Esforço contra gravidade (braço cai na cama)</SelectItem>
                        <SelectItem value="3">3 - Sem esforço contra gravidade (move no plano)</SelectItem>
                        <SelectItem value="4">4 - Sem movimento voluntário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">5b. Motor MS Direito (Braço)</Label>
                    <Select value={nihArmR} onValueChange={setNihArmR}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Sem queda (mantém 90º por 10s)</SelectItem>
                        <SelectItem value="1">1 - Queda leve (cai antes de 10s, sem tocar na cama)</SelectItem>
                        <SelectItem value="2">2 - Esforço contra gravidade (braço cai na cama)</SelectItem>
                        <SelectItem value="3">3 - Sem esforço contra gravidade (move no plano)</SelectItem>
                        <SelectItem value="4">4 - Sem movimento voluntário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">6a. Motor MI Esquerdo (Perna)</Label>
                    <Select value={nihLegL} onValueChange={setNihLegL}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Sem queda (mantém 30º por 5s)</SelectItem>
                        <SelectItem value="1">1 - Queda leve (cai antes de 5s, sem tocar na cama)</SelectItem>
                        <SelectItem value="2">2 - Algum esforço (perna cai na cama mas tenta erguer)</SelectItem>
                        <SelectItem value="3">3 - Sem esforço contra gravidade (move no plano)</SelectItem>
                        <SelectItem value="4">4 - Sem movimento voluntário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">6b. Motor MI Direito (Perna)</Label>
                    <Select value={nihLegR} onValueChange={setNihLegR}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Sem queda (mantém 30º por 5s)</SelectItem>
                        <SelectItem value="1">1 - Queda leve (cai antes de 5s, sem tocar na cama)</SelectItem>
                        <SelectItem value="2">2 - Algum esforço (perna cai na cama mas tenta erguer)</SelectItem>
                        <SelectItem value="3">3 - Sem esforço contra gravidade (move no plano)</SelectItem>
                        <SelectItem value="4">4 - Sem movimento voluntário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">7. Ataxia Apendicular (Coordenação)</Label>
                    <Select value={nihAtaxia} onValueChange={setNihAtaxia}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Ausente / Normal</SelectItem>
                        <SelectItem value="1">1 - Presente em um membro</SelectItem>
                        <SelectItem value="2">2 - Presente em 2 ou mais membros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">8. Sensibilidade (Dor/Táctil)</Label>
                    <Select value={nihSensory} onValueChange={setNihSensory}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Normal (sem perda sensitiva)</SelectItem>
                        <SelectItem value="1">1 - Perda leve a moderada (sente menos do lado afetado)</SelectItem>
                        <SelectItem value="2">2 - Perda grave ou total / Anestesia completa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">9. Linguagem (Afasia)</Label>
                    <Select value={nihLanguage} onValueChange={setNihLanguage}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Normal (sem afasia)</SelectItem>
                        <SelectItem value="1">1 - Afasia leve a moderada (alguma dificuldade)</SelectItem>
                        <SelectItem value="2">2 - Afasia grave (compreensão/expressão limitada)</SelectItem>
                        <SelectItem value="3">3 - Afasia global / Mudez completa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">10. Disartria (Articulação da fala)</Label>
                    <Select value={nihDysarthria} onValueChange={setNihDysarthria}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Normal</SelectItem>
                        <SelectItem value="1">1 - Disartria leve a moderada (arrastada, mas compreensível)</SelectItem>
                        <SelectItem value="2">2 - Disartria grave / Fala ininteligível ou afásico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">11. Extinção e Desatenção (Negligência)</Label>
                    <Select value={nihNeglect} onValueChange={setNihNeglect}>
                      <SelectTrigger className="h-8 rounded-xl text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">0 - Sem negligência / Normal</SelectItem>
                        <SelectItem value="1">1 - Negligência parcial (inatenção sensorial/visual contralateral)</SelectItem>
                        <SelectItem value="2">2 - Negligência completa (profunda inatenção multimodal)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  const score = parseInt(nihLoc) + parseInt(nihQuestions) + parseInt(nihCommands) + 
                    parseInt(nihGaze) + parseInt(nihVisual) + parseInt(nihFacial) + 
                    parseInt(nihArmL) + parseInt(nihArmR) + parseInt(nihLegL) + parseInt(nihLegR) + 
                    parseInt(nihAtaxia) + parseInt(nihSensory) + parseInt(nihLanguage) + 
                    parseInt(nihDysarthria) + parseInt(nihNeglect);

                  let severity = "Normal";
                  let levelColor = "bg-emerald-500 text-white";
                  let recommendation = "Manter acompanhamento clínico de rotina. Avaliar causas não vasculares.";

                  if (score >= 21) {
                    severity = "AVC Grave";
                    levelColor = "bg-red-950 text-white animate-pulse border border-red-500";
                    recommendation = "AVC Grave! Acionar imediatamente a equipe de Neurologia/Neurocirurgia. Risco elevado de hemorragia e edema cerebral grave. Avaliar janelas e contraindicações de trombólise/trombectomia mecânica urgente.";
                  } else if (score >= 16) {
                    severity = "AVC Moderadamente Grave";
                    levelColor = "bg-red-600 text-white animate-pulse";
                    recommendation = "AVC Moderadamente Grave! Acionar Protocolo de AVC. Transferir em regime de prioridade para a Unidade de Trombólise/Neuro. Monitoramento rigoroso de vias aéreas e hemodinâmica.";
                  } else if (score >= 5) {
                    severity = "AVC Moderado";
                    levelColor = "bg-amber-500 text-white";
                    recommendation = "Déficit moderado. Acionar protocolo AVC com prioridade. Se início dos sintomas < 4.5 horas e sem contraindicações, paciente tem alta indicação de Trombólise Química com rtPA.";
                  } else if (score >= 1) {
                    severity = "AVC Leve";
                    levelColor = "bg-blue-500 text-white";
                    recommendation = "Déficit leve. Realizar investigação diagnóstica com neuroimagem (TC/RM de crânio) urgente para descartar isquemia aguda ou AIT.";
                  }

                  return (
                    <div className="mt-4 p-4 mb-6 rounded-2xl bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação Total NIHSS</p>
                          <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-medium text-muted-foreground">/ 42 pts</span></p>
                        </div>
                        <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", levelColor)}>
                          {severity}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-muted-foreground p-3 rounded-xl bg-card border border-border">
                        <span className="font-bold text-foreground">Conduta sugerida:</span> {recommendation}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setNihLoc("0"); setNihQuestions("0"); setNihCommands("0"); setNihGaze("0"); setNihVisual("0"); setNihFacial("0"); setNihArmL("0"); setNihArmR("0"); setNihLegL("0"); setNihLegR("0"); setNihAtaxia("0"); setNihSensory("0"); setNihLanguage("0"); setNihDysarthria("0"); setNihNeglect("0");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-violet-500/40 hover:bg-violet-500/5 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- PROTOCOLO DE AVC - ESCALA NIHSS: ${score}/42 pontos (${severity.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                            setSelectedUrgencySummary(`NIHSS: ${score} pts (${score >= 21 ? 'Grave' : score >= 5 ? 'Mod' : 'Leve'})`);
                            setOpenUrgencyCalc(false);
                            toast.success("Escore NIHSS integrado com sucesso!");
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* CRB-65 Tab */}
            {activeUrgencyTab === "crb65" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">C - Confusão Mental aguda</Label>
                    <Select value={crbConfusion} onValueChange={setCrbConfusion}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">R - Frequência Respiratória (FR &gt;= 30 irpm)</Label>
                    <Select value={crbRate} onValueChange={setCrbRate}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não / FR &lt; 30 irpm (0)</SelectItem>
                        <SelectItem value="1">Sim / FR &gt;= 30 irpm (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">B - Pressão Baixa (PAS &lt; 90 ou PAD &le; 60)</Label>
                    <Select value={crbBp} onValueChange={setCrbBp}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não / PA Estável (0)</SelectItem>
                        <SelectItem value="1">Sim / Hipotensão severa (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">65 - Idade &gt;= 65 anos</Label>
                    <Select value={crbAge} onValueChange={setCrbAge}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  const score = parseInt(crbConfusion) + parseInt(crbRate) + parseInt(crbBp) + parseInt(crbAge);
                  let risk = "Grupo 1 - Baixo Risco";
                  let levelColor = "bg-emerald-500 text-white";
                  let recommendation = "Tratamento domiciliar (Ambulatorial). Prescrever antibiótico via oral (ex: Amoxicilina ou Macrolídeo) e orientar sinais de alerta para retorno imediato.";

                  if (score >= 3) {
                    risk = "Grupo 3 - Alto Risco";
                    levelColor = "bg-red-600 text-white animate-pulse";
                    recommendation = "Internação hospitalar urgente. Avaliar necessidade imediata de suporte em Unidade de Terapia Intensiva (UTI) devido ao alto risco de insuficiência respiratória e choque séptico.";
                  } else if (score >= 1) {
                    risk = "Grupo 2 - Risco Intermediário";
                    levelColor = "bg-amber-500 text-white";
                    recommendation = "Considerar internação em enfermaria ou observação clínica curta na UPA. Realizar exames de imagem e laboratoriais. Terapia antibiótica empírica adequada.";
                  }

                  return (
                    <div className="mt-4 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Pontuação CRB-65</p>
                          <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-medium text-muted-foreground">/ 4 pts</span></p>
                        </div>
                        <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", levelColor)}>
                          {risk}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-muted-foreground p-3 rounded-xl bg-card border border-border">
                        <span className="font-bold text-foreground">Conduta sugerida:</span> {recommendation}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setCrbConfusion("no"); setCrbResp("no"); setCrbBp("no"); setCrbAge("no");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-sky-500/40 hover:bg-sky-500/5 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- GRAVIDADE DA PNEUMONIA - ESCORE CRB-65: ${score}/4 pontos (${risk.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                            setSelectedUrgencySummary(`CRB-65: ${score} pts (${score >= 3 ? 'Grave' : score >= 1 ? 'Mod' : 'Ambulat'})`);
                            setOpenUrgencyCalc(false);
                            toast.success("Escore CRB-65 integrado com sucesso!");
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Wells Tab */}
            {activeUrgencyTab === "wells" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[35vh] overflow-y-auto pr-1">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Sinais clínicos ou sintomas de TVP</Label>
                    <Select value={wellsTvp} onValueChange={setWellsTvp}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="3">Sim (+3.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Outro diagnóstico menos provável que TEP</Label>
                    <Select value={wellsAlternative} onValueChange={setWellsAlternative}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="3">Sim (+3.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Frequência Cardíaca &gt; 100 bpm</Label>
                    <Select value={wellsHr} onValueChange={setWellsHr}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1.5">Sim (+1.5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Imobilização ( &ge; 3d) ou Cirurgia ( &le; 4s)</Label>
                    <Select value={wellsImmobility} onValueChange={setWellsImmobility}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1.5">Sim (+1.5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Episódio prévio documentado de TVP ou TEP</Label>
                    <Select value={wellsPrev} onValueChange={setWellsPrev}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1.5">Sim (+1.5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Hemoptise</Label>
                    <Select value={wellsHemoptysis} onValueChange={setWellsHemoptysis}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Cânser / Neoplasia ativa (em tratamento ou paliativo)</Label>
                    <Select value={wellsCancer} onValueChange={setWellsCancer}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  const score = parseFloat(wellsTvp) + parseFloat(wellsAlternative) + parseFloat(wellsHr) + 
                    parseFloat(wellsImmobility) + parseFloat(wellsPrev) + parseFloat(wellsHemoptysis) + parseFloat(wellsCancer);

                  let probability = "Baixa Probabilidade";
                  let levelColor = "bg-emerald-500 text-white";
                  let recommendation = "TEP Improvável. Solicitar D-Dímero. Se negativo, exclui TEP com alta segurança.";

                  if (score >= 7) {
                    probability = "Alta Probabilidade";
                    levelColor = "bg-red-600 text-white animate-pulse";
                    recommendation = "TEP Provável! Indicação direta de Angiotomografia Computadorizada (Angio-TC) de tórax. Iniciar anticoagulação terapêutica empírica se não houver contraindicações graves.";
                  } else if (score >= 2) {
                    probability = "Moderada Probabilidade";
                    levelColor = "bg-amber-500 text-white";
                    recommendation = "Probabilidade clínica moderada. Solicitar D-Dímero de alta sensibilidade ou considerar Angio-TC conforme estabilidade clínica.";
                  }

                  const twoTierClass = score > 4 ? "TEP Provável" : "TEP Improvável";

                  return (
                    <div className="mt-4 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Escore de Wells</p>
                          <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-medium text-muted-foreground">pts ({twoTierClass})</span></p>
                        </div>
                        <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", levelColor)}>
                          {probability}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-muted-foreground p-3 rounded-xl bg-card border border-border">
                        <span className="font-bold text-foreground">Conduta sugerida:</span> {recommendation}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setWellsDvt("no"); setWellsHr("no"); setWellsImmob("no"); setWellsPrev("no"); setWellsHemop("no"); setWellsCancer("no"); setWellsAlt("no");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- PROBABILIDADE DE TEP (ESCORE DE WELLS): ${score} pontos (${probability.toUpperCase()} - ${twoTierClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                            setSelectedUrgencySummary(`Wells: ${score} pts (${score > 4 ? 'Provável' : 'Improv'})`);
                            setOpenUrgencyCalc(false);
                            toast.success("Escore de Wells integrado com sucesso!");
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Alvarado Tab */}
            {activeUrgencyTab === "alvarado" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[35vh] overflow-y-auto pr-1">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Migração da dor para fossa ilíaca direita (FID)</Label>
                    <Select value={alvaradoMigration} onValueChange={setAlvaradoMigration}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Anorexia (Perda de apetite)</Label>
                    <Select value={alvaradoAnorexia} onValueChange={setAlvaradoAnorexia}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Náuseas ou Vômitos</Label>
                    <Select value={alvaradoNausea} onValueChange={setAlvaradoNausea}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Defesa / Palpação muito dolorosa em FID</Label>
                    <Select value={alvaradoTenderness} onValueChange={setAlvaradoTenderness}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="2">Sim (+2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Descompressão dolorosa em FID (Blumberg)</Label>
                    <Select value={alvaradoRebound} onValueChange={setAlvaradoRebound}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Elevação da Temperatura corporal (&ge; 37.3°C)</Label>
                    <Select value={alvaradoFever} onValueChange={setAlvaradoFever}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Leucocitose (&ge; 10.000 /mm³ no Hemograma)</Label>
                    <Select value={alvaradoLeukocytosis} onValueChange={setAlvaradoLeukocytosis}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="2">Sim (+2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-foreground/80">Desvia à esquerda de neutrófilos (&gt; 75%)</Label>
                    <Select value={alvaradoShift} onValueChange={setAlvaradoShift}>
                      <SelectTrigger className="h-9 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Não (0)</SelectItem>
                        <SelectItem value="1">Sim (+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(() => {
                  const score = parseInt(alvaradoMigration) + parseInt(alvaradoAnorexia) + parseInt(alvaradoNausea) + 
                    parseInt(alvaradoTenderness) + parseInt(alvaradoRebound) + parseInt(alvaradoFever) + 
                    parseInt(alvaradoLeukocytosis) + parseInt(alvaradoShift);

                  let riskClass = "Baixa Probabilidade";
                  let levelColor = "bg-emerald-500 text-white";
                  let recommendation = "Apendicite improvável. Alta segura com orientações de retorno se piora dos sintomas ou febre.";

                  if (score >= 7) {
                    riskClass = "Alta Probabilidade";
                    levelColor = "bg-red-600 text-white animate-pulse";
                    recommendation = "Alta probabilidade de Apendicite Aguda. Deixar em jejum imediato, iniciar hidratação venosa e acionar avaliação urgente da equipe de Cirurgia Geral para conduta cirúrgica (Apendicectomia).";
                  } else if (score >= 5) {
                    riskClass = "Consistente com Apendicite (Risco Moderado)";
                    levelColor = "bg-amber-500 text-white";
                    recommendation = "Caso suspeito moderado. Manter paciente sob observação clínica na UPA, jejum temporário, realizar exames adicionais e exames de imagem (Ultrassonografia ou Tomografia de abdômen).";
                  }

                  return (
                    <div className="mt-4 p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Escore de Alvarado</p>
                          <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-medium text-muted-foreground">/ 10 pts</span></p>
                        </div>
                        <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2", levelColor)}>
                          {riskClass}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-muted-foreground p-3 rounded-xl bg-card border border-border">
                        <span className="font-bold text-foreground">Conduta sugerida:</span> {recommendation}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setAlvaMigr("no"); setAlvaAnor("no"); setAlvaNausea("no"); setAlvaTend("no"); setAlvaRebound("no"); setAlvaTemp("no"); setAlvaLeuko("no"); setAlvaShift("no");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- TRIAGEM DE APENDICITE (ESCORE DE ALVARADO): ${score}/10 pontos (${riskClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                            setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                            setSelectedUrgencySummary(`Alvarado: ${score} pts (${score >= 7 ? 'Cirúrgico' : score >= 5 ? 'Obs' : 'Baixo'})`);
                            setOpenUrgencyCalc(false);
                            toast.success("Escore de Alvarado integrado com sucesso!");
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* GRACE Tab */}
            {activeUrgencyTab === "grace" && (() => {
              const score = parseInt(graceAge) + parseInt(graceHr) + parseInt(graceSbp) + parseInt(graceCreatinine) + parseInt(graceKillip) + parseInt(graceCardiacArrest) + parseInt(graceStDeviation) + parseInt(graceEnzymes);
              let riskClass = "Baixo Risco";
              let recommendation = "Mortalidade intra-hospitalar estimada < 1%. Manejo conservador inicial, monitorização e estratificação não invasiva podem ser considerados dependendo do quadro clínico.";
              let badgeColor = "bg-emerald-500";
              if (score >= 140) {
                riskClass = "Alto Risco";
                recommendation = "Mortalidade intra-hospitalar estimada > 3%. Indicação de estratégia invasiva precoce (cateterismo em < 24h). Terapia anti-isquêmica e antitrombótica intensiva.";
                badgeColor = "bg-rose-600 animate-pulse";
              } else if (score >= 109) {
                riskClass = "Risco Intermediário";
                recommendation = "Mortalidade intra-hospitalar estimada entre 1-3%. Estratégia invasiva (cateterismo em < 72h) dependendo da evolução clínica e outros marcadores de risco.";
                badgeColor = "bg-amber-500";
              }
              return (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">Idade</Label>
                      <Select value={graceAge} onValueChange={setGraceAge}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="0">&lt; 30 anos (0)</SelectItem>
                          <SelectItem value="8">30-39 anos (8)</SelectItem>
                          <SelectItem value="25">40-49 anos (25)</SelectItem>
                          <SelectItem value="41">50-59 anos (41)</SelectItem>
                          <SelectItem value="58">60-69 anos (58)</SelectItem>
                          <SelectItem value="75">70-79 anos (75)</SelectItem>
                          <SelectItem value="91">80-89 anos (91)</SelectItem>
                          <SelectItem value="100">&ge; 90 anos (100)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">Frequência Cardíaca</Label>
                      <Select value={graceHr} onValueChange={setGraceHr}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="0">&lt; 50 bpm (0)</SelectItem>
                          <SelectItem value="3">50-69 bpm (3)</SelectItem>
                          <SelectItem value="9">70-89 bpm (9)</SelectItem>
                          <SelectItem value="15">90-109 bpm (15)</SelectItem>
                          <SelectItem value="24">110-149 bpm (24)</SelectItem>
                          <SelectItem value="38">150-199 bpm (38)</SelectItem>
                          <SelectItem value="46">&ge; 200 bpm (46)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">Pressão Sistólica</Label>
                      <Select value={graceSbp} onValueChange={setGraceSbp}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="58">&lt; 80 mmHg (58)</SelectItem>
                          <SelectItem value="53">80-99 mmHg (53)</SelectItem>
                          <SelectItem value="43">100-119 mmHg (43)</SelectItem>
                          <SelectItem value="34">120-139 mmHg (34)</SelectItem>
                          <SelectItem value="24">140-159 mmHg (24)</SelectItem>
                          <SelectItem value="10">160-199 mmHg (10)</SelectItem>
                          <SelectItem value="0">&ge; 200 mmHg (0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">Creatinina (mg/dL)</Label>
                      <Select value={graceCreatinine} onValueChange={setGraceCreatinine}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="1">0 - 0.39 (1)</SelectItem>
                          <SelectItem value="4">0.4 - 0.79 (4)</SelectItem>
                          <SelectItem value="7">0.8 - 1.19 (7)</SelectItem>
                          <SelectItem value="10">1.2 - 1.59 (10)</SelectItem>
                          <SelectItem value="13">1.6 - 1.99 (13)</SelectItem>
                          <SelectItem value="21">2.0 - 3.99 (21)</SelectItem>
                          <SelectItem value="28">&ge; 4.0 (28)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">Classe Killip</Label>
                      <Select value={graceKillip} onValueChange={setGraceKillip}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="0">I - Sem IC (0)</SelectItem>
                          <SelectItem value="20">II - B3, estertores basais (20)</SelectItem>
                          <SelectItem value="39">III - Edema Agudo de Pulmão (39)</SelectItem>
                          <SelectItem value="59">IV - Choque Cardiogênico (59)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">Parada Cardíaca na Admissão</Label>
                      <Select value={graceCardiacArrest} onValueChange={setGraceCardiacArrest}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="0">Não (0)</SelectItem>
                          <SelectItem value="39">Sim (39)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">Desvio de ST no ECG</Label>
                      <Select value={graceStDeviation} onValueChange={setGraceStDeviation}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="0">Não (0)</SelectItem>
                          <SelectItem value="28">Sim (28)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">Marcadores de Necrose Elevados</Label>
                      <Select value={graceEnzymes} onValueChange={setGraceEnzymes}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="0">Não (0)</SelectItem>
                          <SelectItem value="14">Sim (14)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Escore GRACE</p>
                        <p className="text-3xl font-black">{score} <span className="text-sm font-bold text-muted-foreground">pts</span></p>
                      </div>
                      <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2 text-white", badgeColor)}>{riskClass}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{recommendation}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setGraceAge("0"); setGraceHr("0"); setGracePas("0"); setGraceCreat("0"); setGraceKillip("1"); setGraceArrest("no"); setGraceBiomarker("no"); setGraceSt("no");
                          toast.info("Campos da calculadora limpos.");
                        }}
                        className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-600 dark:hover:text-red-400 transition-all"
                      >
                        Limpar
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          const descText = `- ESCORE GRACE (SCA): ${score} pontos (${riskClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                          setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                          setSelectedUrgencySummary(`GRACE: ${score} pts (${riskClass.split(" ")[0]})`);
                          setOpenUrgencyCalc(false);
                          toast.success("Escore GRACE integrado com sucesso!");
                        }}
                        className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-red-600 hover:bg-red-700 text-white"
                      >
                        Confirmar e Aplicar ao Prontuário
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Ranson Tab */}
            {activeUrgencyTab === "ranson" && (() => {
              const score = parseInt(ransonAge) + parseInt(ransonWbc) + parseInt(ransonGlucose) + parseInt(ransonLdh) + parseInt(ransonAst);
              let riskClass = "Mortalidade Leve (~1%)";
              let recommendation = "Pancreatite leve. Jejum, hidratação venosa vigorosa e analgesia.";
              let badgeColor = "bg-emerald-500";
              if (score >= 5) {
                riskClass = "Mortalidade Alta (>40%)";
                recommendation = "Pancreatite grave com altíssima taxa de complicação/mortalidade. Terapia intensiva (UTI). Monitoramento invasivo e provável necessidade de suporte orgânico.";
                badgeColor = "bg-rose-600 animate-pulse";
              } else if (score >= 3) {
                riskClass = "Mortalidade Moderada (~15%)";
                recommendation = "Pancreatite grave inicial. Monitoramento contínuo em UTI ou emergência avançada. Reposição volêmica agressiva.";
                badgeColor = "bg-amber-500";
              }
              return (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <Label className="text-[10px] font-black uppercase text-foreground/80">Critérios de Admissão (0 horas)</Label>
                  <p className="text-[10px] text-muted-foreground">Avalie estes critérios no momento da admissão na emergência.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">Idade</Label>
                      <Select value={ransonAge} onValueChange={setRansonAge}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="0">&lt; 55 anos</SelectItem>
                          <SelectItem value="1">&ge; 55 anos (+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">Leucócitos</Label>
                      <Select value={ransonWbc} onValueChange={setRansonWbc}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="0">&lt; 16.000 /mm³</SelectItem>
                          <SelectItem value="1">&ge; 16.000 /mm³ (+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">Glicemia</Label>
                      <Select value={ransonGlucose} onValueChange={setRansonGlucose}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="0">&lt; 200 mg/dL</SelectItem>
                          <SelectItem value="1">&ge; 200 mg/dL (+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">LDH</Label>
                      <Select value={ransonLdh} onValueChange={setRansonLdh}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="0">&lt; 350 UI/L</SelectItem>
                          <SelectItem value="1">&ge; 350 UI/L (+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-foreground/80">AST / TGO</Label>
                      <Select value={ransonAst} onValueChange={setRansonAst}>
                        <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="0">&lt; 250 UI/L</SelectItem>
                          <SelectItem value="1">&ge; 250 UI/L (+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Escore de Ranson</p>
                        <p className="text-3xl font-black">{score} <span className="text-sm font-bold text-muted-foreground">/ 5 pts (Admissão)</span></p>
                      </div>
                      <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2 text-white", badgeColor)}>{riskClass}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{recommendation}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setRansonAge("0"); setRansonWbc("0"); setRansonGlucose("0"); setRansonLdh("0"); setRansonAst("0");
                          toast.info("Campos da calculadora limpos.");
                        }}
                        className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-yellow-500/40 hover:bg-yellow-500/5 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all"
                      >
                        Limpar
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          const descText = `- CRITÉRIOS DE RANSON (PANCREATITE NA ADMISSÃO): ${score}/5 pontos (${riskClass.toUpperCase()}).\n  Conduta sugerida: ${recommendation}`;
                          setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                          setSelectedUrgencySummary(`Ranson: ${score} pts (${riskClass.split(" ")[1]})`);
                          setOpenUrgencyCalc(false);
                          toast.success("Escore de Ranson integrado com sucesso!");
                        }}
                        className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        Confirmar e Aplicar ao Prontuário
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 7. DIÁLOGO ESCALAS DE ENFERMAGEM (FUGULIN)                                */}
      {/* ========================================================================= */}
      <Dialog open={openNursingCalc} onOpenChange={setOpenNursingCalc}>
        <DialogContent className="sm:max-w-[900px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <Activity className="h-6 w-6 text-cyan-500 animate-pulse" />
              Escalas de Avaliação de Enfermagem
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Sistematização da Assistência e Grau de Dependência
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
            {/* Coluna Esquerda: Menu Vertical */}
            <div className="md:col-span-4 space-y-3 border-r border-border/60 pr-4">
              <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1.5 mb-2">
                <span>Escalas de Enfermagem</span>
              </Label>
              <div className="space-y-2">
                {/* Fugulin */}
                <button
                  type="button"
                  onClick={() => setActiveNursingTab("fugulin")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                    activeNursingTab === "fugulin"
                      ? "bg-cyan-500/10 border-cyan-500"
                      : "bg-card border-border hover:border-cyan-400/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                      activeNursingTab === "fugulin" ? "bg-cyan-500" : "bg-cyan-500/15"
                    )}>
                      <span>📋</span>
                    </div>
                    <p className={cn("font-black text-xs uppercase tracking-wider", activeNursingTab === "fugulin" ? "text-cyan-600" : "text-foreground/80")}>Fugulin</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-9">Grau de Dependência do Paciente</p>
                </button>
              </div>
            </div>

            {/* Coluna Direita: Formulários */}
            <div className="md:col-span-8 flex flex-col min-h-[400px]">
              {/* Fugulin Tab */}
              {activeNursingTab === "fugulin" && (() => {
                const score = parseInt(fugulinMental) + parseInt(fugulinOxy) + parseInt(fugulinVitals) + parseInt(fugulinMotility) + parseInt(fugulinAmbulation) + parseInt(fugulinFeeding) + parseInt(fugulinBodyCare) + parseInt(fugulinElimination) + parseInt(fugulinTherapy);
                let riskClass = "Cuidados Mínimos";
                let recommendation = "Paciente estável clinica e hemodinamicamente, requerendo mínima supervisão. Observação de rotina.";
                let badgeColor = "bg-emerald-500";
                if (score >= 32) {
                  riskClass = "Cuidados Intensivos";
                  recommendation = "Paciente grave, sujeito a instabilidade severa ou risco iminente de morte. Requer assistência contínua e especializada de enfermagem (UTI ou Sala Vermelha).";
                  badgeColor = "bg-rose-600 animate-pulse";
                } else if (score >= 27) {
                  riskClass = "Cuidados Semi-intensivos";
                  recommendation = "Paciente grave, recuperável, com risco iminente de instabilidade. Requer assistência de enfermagem contínua e monitorização intensiva.";
                  badgeColor = "bg-orange-500";
                } else if (score >= 21) {
                  riskClass = "Alta Dependência";
                  recommendation = "Paciente crônico ou com estabilidade limítrofe. Requer assistência de enfermagem contínua para manutenção de vida/funções vitais.";
                  badgeColor = "bg-amber-500";
                } else if (score >= 15) {
                  riskClass = "Cuidados Intermediários";
                  recommendation = "Paciente estável, mas dependente para autocuidado ou com dependência parcial para necessidades básicas.";
                  badgeColor = "bg-yellow-500";
                }
                
                return (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <Label className="text-xs font-black uppercase text-foreground/80">Escala de Fugulin — Carga de Trabalho em Enfermagem</Label>
                    <p className="text-[10px] text-muted-foreground">Classifique as áreas de necessidade básica do paciente. Usado para dimensionamento e planejamento da assistência de enfermagem.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 pb-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">Estado Mental</Label>
                        <Select value={fugulinMental} onValueChange={setFugulinMental}>
                          <SelectTrigger className="h-9 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="1">Lúcido, Orientado no Tempo/Espaço (1)</SelectItem>
                            <SelectItem value="2">Períodos de Desorientação/Confusão (2)</SelectItem>
                            <SelectItem value="3">Inconsciente / Sem resposta a dor (3)</SelectItem>
                            <SelectItem value="4">Coma / Avaliação Neurológica Frequente (4)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">Oxigenação</Label>
                        <Select value={fugulinOxy} onValueChange={setFugulinOxy}>
                          <SelectTrigger className="h-9 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="1">Não depende de O2 / Ar ambiente (1)</SelectItem>
                            <SelectItem value="2">Uso Intermitente de O2 (Máscara/Cateter) (2)</SelectItem>
                            <SelectItem value="3">Uso Contínuo de O2 (3)</SelectItem>
                            <SelectItem value="4">Ventilação Mecânica (Tubo/Traqueo) (4)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">Sinais Vitais</Label>
                        <Select value={fugulinVitals} onValueChange={setFugulinVitals}>
                          <SelectTrigger className="h-9 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="1">Rotina / A cada 12h ou 24h (1)</SelectItem>
                            <SelectItem value="2">A cada 6 horas (2)</SelectItem>
                            <SelectItem value="3">A cada 4 horas (3)</SelectItem>
                            <SelectItem value="4">A cada 2 horas ou Monitorização Contínua (4)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">Motilidade</Label>
                        <Select value={fugulinMotility} onValueChange={setFugulinMotility}>
                          <SelectTrigger className="h-9 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="1">Move todos os membros livremente (1)</SelectItem>
                            <SelectItem value="2">Limitação de movimentos / Dor (2)</SelectItem>
                            <SelectItem value="3">Dificuldade de mobilização (Paresia/Plegia) (3)</SelectItem>
                            <SelectItem value="4">Imóvel (Não movimenta ou Coma) (4)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">Deambulação</Label>
                        <Select value={fugulinAmbulation} onValueChange={setFugulinAmbulation}>
                          <SelectTrigger className="h-9 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="1">Ambulante (Caminha sem auxílio) (1)</SelectItem>
                            <SelectItem value="2">Necessita de auxílio (Andador, muleta, apoio) (2)</SelectItem>
                            <SelectItem value="3">Uso de Cadeira de Rodas (3)</SelectItem>
                            <SelectItem value="4">Restrito ao leito / Acamado (4)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">Alimentação</Label>
                        <Select value={fugulinFeeding} onValueChange={setFugulinFeeding}>
                          <SelectTrigger className="h-9 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="1">Alimenta-se sozinho / Independente (1)</SelectItem>
                            <SelectItem value="2">Necessita de auxílio para se alimentar (2)</SelectItem>
                            <SelectItem value="3">Uso de Sonda (SNE/SNG) (3)</SelectItem>
                            <SelectItem value="4">Nutrição Parenteral Total (NPT) ou Jejum estrito (4)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">Cuidado Corporal</Label>
                        <Select value={fugulinBodyCare} onValueChange={setFugulinBodyCare}>
                          <SelectTrigger className="h-9 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="1">Banho de chuveiro sozinho (1)</SelectItem>
                            <SelectItem value="2">Banho de chuveiro com auxílio da enfermagem (2)</SelectItem>
                            <SelectItem value="3">Banho no leito com supervisão ou auxílio parcial (3)</SelectItem>
                            <SelectItem value="4">Banho no leito realizado 100% pela equipe (4)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">Eliminação</Label>
                        <Select value={fugulinElimination} onValueChange={setFugulinElimination}>
                          <SelectTrigger className="h-9 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="1">Usa o banheiro sozinho (1)</SelectItem>
                            <SelectItem value="2">Uso de comadre/papagaio com auxílio (2)</SelectItem>
                            <SelectItem value="3">Uso de fraldas / Evacua no leito (3)</SelectItem>
                            <SelectItem value="4">Sonda Vesical de Demora e Fraldas ou SVD/Ostomias (4)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-[10px] font-black uppercase text-foreground/80">Terapêutica / Medicamentos</Label>
                        <Select value={fugulinTherapy} onValueChange={setFugulinTherapy}>
                          <SelectTrigger className="h-9 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="1">Uso de medicações IM, SC, VO ou Inalatório (1)</SelectItem>
                            <SelectItem value="2">Acesso Venoso Periférico Intermitente (2)</SelectItem>
                            <SelectItem value="3">Acesso Venoso com Infusão Contínua (3)</SelectItem>
                            <SelectItem value="4">Drogas Vasoativas / Sangue e Hemoderivados / CVC (4)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-2xl bg-muted/30 border border-border space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Escore de Fugulin</p>
                          <p className="text-3xl font-black">{score} <span className="text-sm font-bold text-muted-foreground">pts</span></p>
                        </div>
                        <Badge className={cn("h-7 rounded-lg text-[9px] font-black uppercase tracking-wider px-2 text-white", badgeColor)}>{riskClass}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{recommendation}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setFugulinMental("1"); setFugulinOxy("1"); setFugulinVital("1"); setFugulinMotility("1"); setFugulinWalk("1"); setFugulinFeed("1"); setFugulinCare("1"); setFugulinSkin("1"); setFugulinDress("1");
                            toast.info("Campos da calculadora limpos.");
                          }}
                          className="h-11 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] border-muted-foreground/20 text-muted-foreground hover:border-sky-500/40 hover:bg-sky-500/5 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
                        >
                          Limpar
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            const descText = `- GRAU DE DEPENDÊNCIA (FUGULIN): ${score} pontos — ${riskClass.toUpperCase()}.\n  Avaliação: ${recommendation}`;
                            setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                            setSelectedNursingSummary(`Fugulin: ${score} pts (${riskClass.split(" ")[1] || riskClass.split(" ")[0]})`);
                            setOpenNursingCalc(false);
                            toast.success("Escore de Fugulin integrado com sucesso!");
                          }}
                          className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                          Confirmar e Aplicar ao Prontuário
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 8. DIÁLOGO PLANEJADOR DE ENFERMAGEM (NANDA, NOC, NIC)                     */}
      {/* ========================================================================= */}
      <Dialog open={openNandaCalc} onOpenChange={setOpenNandaCalc}>
        <DialogContent className="sm:max-w-[800px] rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              Planejador de Enfermagem (NANDA · NOC · NIC)
            </DialogTitle>
            <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
              Planejamento de Cuidados e Processo de Enfermagem Integrado
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
            {/* Coluna 1: Diagnósticos NANDA (5 cols) */}
            <div className="md:col-span-5 space-y-3 border-r border-border/60 pr-4">
              <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1.5 mb-2">
                <span>1. Selecionar Diagnóstico (NANDA)</span>
              </Label>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {[
                  {
                    id: "dor_aguda",
                    title: "⚡ Dor Aguda",
                    definition: "Relacionada a agentes lesivos (químicos, físicos ou biológicos) evidenciada por relato verbal, expressão facial ou comportamento protetor.",
                    nocs: [
                      "Meta: Dor leve ou ausente (escore de dor <= 3)",
                      "Meta: Controle da Dor (Paciente refere alívio após intervenção)",
                      "Meta: Nível de Conforto Físico e bem-estar geral restabelecido"
                    ],
                    nics: [
                      "NIC: Monitorar dor a cada 2 horas e aplicar compressas frias/quentes",
                      "NIC: Administrar analgésicos e medicamentos prescritos em tempo hábil",
                      "NIC: Minimizar estímulos ambientais nocivos (luminosos/sonoros)"
                    ]
                  },
                  {
                    id: "resp_ineficaz",
                    title: "🫁 Padrão Respiratório Ineficaz",
                    definition: "Relacionado a fadiga muscular respiratória ou espasmo brônquico, evidenciado por dispneia, taquipneia ou uso de musculatura acessória.",
                    nocs: [
                      "Meta: Estado Respiratório: Ventilação estável e FR normal",
                      "Meta: Saturação de Oxigênio (Manter SpO2 >= 94% em ar ambiente)",
                      "Meta: Vias Aéreas Pérveas, sem ruídos adventícios"
                    ],
                    nics: [
                      "NIC: Monitorar padrão ventilatório, frequência respiratória e ausculta",
                      "NIC: Administrar Oxigenoterapia conforme protocolo ou prescrição",
                      "NIC: Posicionar o paciente em Fowler/Semi-Fowler (cabeceira a 45°)"
                    ]
                  },
                  {
                    id: "risco_infeccao",
                    title: "🦠 Risco de Infecção",
                    definition: "Relacionado a procedimentos invasivos como punção de acesso venoso periférico, sondagem vesical ou aspiração de vias aéreas.",
                    nocs: [
                      "Meta: Severidade da Infecção (Ausência de febre, calafrios ou secreções)",
                      "Meta: Integridade de Acesso Venoso (Sem dor, calor, rubor ou edema)",
                      "Meta: Sinais vitais de rotina estáveis e dentro da normalidade"
                    ],
                    nics: [
                      "NIC: Higienização rigorosa das mãos e antissepsia alcoólica antes de manipular",
                      "NIC: Cuidados com Acesso Venoso: Monitorar local de inserção e trocar curativos",
                      "NIC: Aplicar técnica estéril/asséptica estrita em todos os procedimentos"
                    ]
                  },
                  {
                    id: "troca_gases",
                    title: "🫁 Troca de Gases Prejudicada",
                    definition: "Relacionada a desequilíbrio na ventilação-perfusão, evidenciada por hipoxemia, cianose periférica/central, dispneia ou agitação.",
                    nocs: [
                      "Meta: Estado Respiratório: Troca de Gases (Ausência de cianose, gasometria estável)",
                      "Meta: Perfusão Tecidual periférica normalizada (perfusão periférica <= 2s)"
                    ],
                    nics: [
                      "NIC: Controle Ácido-Básico (Monitorar gasometria arterial e eletrólitos)",
                      "NIC: Controle de Vias Aéreas: Estimular tosse e aspirar se necessário",
                      "NIC: Auxiliar e monitorar na Ventilação Não Invasiva (VNI) ou alto fluxo"
                    ]
                  },
                  {
                    id: "vol_liquidos_def",
                    title: "💧 Volume de Líquidos Deficiente",
                    definition: "Relacionado a perdas ativas (vômitos, diarreia, hemorragia), evidenciado por mucosas secas, turgor cutâneo diminuído ou taquicardia.",
                    nocs: [
                      "Meta: Equilíbrio Hídrico (Turgor cutâneo preservado, mucosas úmidas)",
                      "Meta: Status de Hidratação (Diurese espontânea adequada > 0.5 ml/kg/h)"
                    ],
                    nics: [
                      "NIC: Controle de Líquidos/Eletrólitos: Monitorar balanço hídrico rigoroso",
                      "NIC: Ressuscitação Volêmica: Infundir cristaloides conforme prescrição",
                      "NIC: Avaliar hemodinâmica: Verificar PA, FC e perfusão tecidual"
                    ]
                  },
                  {
                    id: "pele_prejudicada",
                    title: "🩹 Integridade da Pele Prejudicada",
                    definition: "Relacionada a pressão prolongada, umidade ou cisalhamento, evidenciada por rompimento de epiderme/derme (Lesão por Pressão).",
                    nocs: [
                      "Meta: Integridade Tisular: Pele e Mucosas (Cicatrização de lesão)",
                      "Meta: Cura de Feridas por Segunda Intenção (Formação de tecido de granulação)"
                    ],
                    nics: [
                      "NIC: Prevenção de Lesões: Mudança de decúbito de 2/2h e colchão pneumático",
                      "NIC: Cuidados com a Pele: Manter pele limpa, seca e intensamente hidratada",
                      "NIC: Cuidados com Feridas: Realizar curativos prescritos com técnica asséptica"
                    ]
                  }
                ].map(diag => {
                  const isSelected = selectedNanda === diag.id;
                  return (
                    <button
                      key={diag.id}
                      type="button"
                      onClick={() => {
                        setSelectedNanda(diag.id);
                        setSelectedNandaNocList(diag.nocs);
                        setSelectedNandaNicList(diag.nics);
                      }}
                      className={cn(
                        "w-full p-3 rounded-xl border text-left transition-all hover:bg-muted/40",
                        isSelected 
                          ? "bg-primary/5 border-primary text-primary animate-pulse" 
                          : "bg-card border-border"
                      )}
                    >
                      <p className="font-bold text-xs">{diag.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{diag.definition}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coluna 2: NOC & NIC (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between min-h-[400px]">
              {selectedNanda ? (
                <div className="space-y-5">
                  {/* NOC */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1">
                      <span>2. Resultados Esperados (NOC)</span>
                    </Label>
                    <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 space-y-2.5">
                      {selectedNandaNocList.map((noc, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-[11px] font-medium text-foreground/90 leading-relaxed">{noc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NIC */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-foreground/80 flex items-center gap-1">
                      <span>3. Intervenções de Enfermagem (NIC)</span>
                    </Label>
                    <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 space-y-2.5">
                      {selectedNandaNicList.map((nic, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span className="text-[11px] font-medium text-foreground/90 leading-relaxed">{nic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2rem p-6 text-center text-muted-foreground bg-muted/5">
                  <Activity className="h-10 w-10 text-muted-foreground/30 mb-2 animate-pulse" />
                  <p className="text-xs font-black uppercase tracking-wider text-muted-foreground/60">Aguardando Seleção</p>
                  <p className="text-[10px] text-muted-foreground/40 mt-1 max-w-[240px]">Selecione um diagnóstico de enfermagem na coluna esquerda para planejar os cuidados NOC/NIC.</p>
                </div>
              )}

              {/* Botão de Confirmação */}
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedNanda(null);
                    setSelectedNandaDiag("");
                    setNandaDomain("");
                    setSelectedNandaClass2("");
                    setNandaInterventions([]);
                    toast.info("Diagnóstico de Enfermagem limpo.");
                  }}
                  className="rounded-xl font-bold h-10 text-xs px-4 border-muted-foreground/20 text-muted-foreground hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                  Limpar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenNandaCalc(false)}
                  className="rounded-xl font-bold h-10 text-xs px-4"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  disabled={!selectedNanda}
                  onClick={() => {
                    const matchedDiag = [
                      {
                        id: "dor_aguda",
                        title: "⚡ Dor Aguda",
                        definition: "Relacionada a agentes lesivos (químicos, físicos ou biológicos) evidenciada por relato verbal, expressão facial ou comportamento protetor.",
                        nocs: [
                          "Meta: Dor leve ou ausente (escore de dor <= 3)",
                          "Meta: Controle da Dor (Paciente refere alívio após intervenção)",
                          "Meta: Nível de Conforto Físico e bem-estar geral restabelecido"
                        ],
                        nics: [
                          "NIC: Monitorar dor a cada 2 horas e aplicar compressas frias/quentes",
                          "NIC: Administrar analgésicos e medicamentos prescritos em tempo hábil",
                          "NIC: Minimizar estímulos ambientais nocivos (luminosos/sonoros)"
                        ]
                      },
                      {
                        id: "resp_ineficaz",
                        title: "🫁 Padrão Respiratório Ineficaz",
                        definition: "Relacionado a fadiga muscular respiratória ou espasmo brônquico, evidenciado por dispneia, taquipneia ou uso de musculatura acessória.",
                        nocs: [
                          "Meta: Estado Respiratório: Ventilação estável e FR normal",
                          "Meta: Saturação de Oxigênio (Manter SpO2 >= 94% em ar ambiente)",
                          "Meta: Vias Aéreas Pérveas, sem ruídos adventícios"
                        ],
                        nics: [
                          "NIC: Monitorar padrão ventilatório, frequência respiratória e ausculta",
                          "NIC: Administrar Oxigenoterapia conforme protocolo ou prescrição",
                          "NIC: Posicionar o paciente em Fowler/Semi-Fowler (cabeceira a 45°)"
                        ]
                      },
                      {
                        id: "risco_infeccao",
                        title: "🦠 Risco de Infecção",
                        definition: "Relacionado a procedimentos invasivos como punção de acesso venoso periférico, sondagem vesical ou aspiração de vias aéreas.",
                        nocs: [
                          "Meta: Severidade da Infecção (Ausência de febre, calafrios ou secreções)",
                          "Meta: Integridade de Acesso Venoso (Sem dor, calor, rubor ou edema)",
                          "Meta: Sinais vitais de rotina estáveis e dentro da normalidade"
                        ],
                        nics: [
                          "NIC: Higienização rigorosa das mãos e antissepsia alcoólica antes de manipular",
                          "NIC: Cuidados com Acesso Venoso: Monitorar local de inserção e trocar curativos",
                          "NIC: Aplicar técnica estéril/asséptica estrita em todos os procedimentos"
                        ]
                      },
                      {
                        id: "troca_gases",
                        title: "🫁 Troca de Gases Prejudicada",
                        definition: "Relacionada a desequilíbrio na ventilação-perfusão, evidenciada por hipoxemia, cianose periférica/central, dispneia ou agitação.",
                        nocs: [
                          "Meta: Estado Respiratório: Troca de Gases (Ausência de cianose, gasometria estável)",
                          "Meta: Perfusão Tecidual periférica normalizada (perfusão periférica <= 2s)"
                        ],
                        nics: [
                          "NIC: Controle Ácido-Básico (Monitorar gasometria arterial e eletrólitos)",
                          "NIC: Controle de Vias Aéreas: Estimular tosse e aspirar se necessário",
                          "NIC: Auxiliar e monitorar na Ventilação Não Invasiva (VNI) ou alto fluxo"
                        ]
                      },
                      {
                        id: "vol_liquidos_def",
                        title: "💧 Volume de Líquidos Deficiente",
                        definition: "Relacionado a perdas ativas (vômitos, diarreia, hemorragia), evidenciado por mucosas secas, turgor cutâneo diminuído ou taquicardia.",
                        nocs: [
                          "Meta: Equilíbrio Hídrico (Turgor cutâneo preservado, mucosas úmidas)",
                          "Meta: Status de Hidratação (Diurese espontânea adequada > 0.5 ml/kg/h)"
                        ],
                        nics: [
                          "NIC: Controle de Líquidos/Eletrólitos: Monitorar balanço hídrico rigoroso",
                          "NIC: Ressuscitação Volêmica: Infundir cristaloides conforme prescrição",
                          "NIC: Avaliar hemodinâmica: Verificar PA, FC e perfusão tecidual"
                        ]
                      },
                      {
                        id: "pele_prejudicada",
                        title: "🩹 Integridade da Pele Prejudicada",
                        definition: "Relacionada a pressão prolongada, umidade ou cisalhamento, evidenciada por rompimento de epiderme/derme (Lesão por Pressão).",
                        nocs: [
                          "Meta: Integridade Tisular: Pele e Mucosas (Cicatrização de lesão)",
                          "Meta: Cura de Feridas por Segunda Intenção (Formação de tecido de granulação)"
                        ],
                        nics: [
                          "NIC: Prevenção de Lesões: Mudança de decúbito de 2/2h e colchão pneumático",
                          "NIC: Cuidados com a Pele: Manter pele limpa, seca e intensamente hidratada",
                          "NIC: Cuidados com Feridas: Realizar curativos prescritos com técnica asséptica"
                        ]
                      }
                    ].find(diag => diag.id === selectedNanda);

                    if (matchedDiag) {
                      const descText = `- PROCESSO DE ENFERMAGEM INTEGRADO (NANDA NOC NIC):\n  · NANDA: ${matchedDiag.title} (${matchedDiag.definition})\n  · NOC (Resultados Esperados):\n    ${matchedDiag.nocs.map(noc => `- ${noc}`).join("\n    ")}\n  · NIC (Intervenções Prescritas):\n    ${matchedDiag.nics.map(nic => `- ${nic}`).join("\n    ")}`;
                      
                      setDescription(prev => prev ? `${prev}\n${descText}` : descText);
                      setActiveNandaPlan(matchedDiag.title);
                      setOpenNandaCalc(false);
                      toast.success("Plano NANDA-NOC-NIC inserido no prontuário!");
                    }
                  }}
                  className="rounded-xl font-bold h-10 text-xs px-6 bg-primary text-primary-foreground animate-shimmer"
                >
                  Confirmar e Aplicar ao Prontuário
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
