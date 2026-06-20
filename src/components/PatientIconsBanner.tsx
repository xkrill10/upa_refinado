import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Patient } from "@/context/PatientsContext";
import {
  AlertCircle, AlertTriangle, ShieldAlert, CalendarClock,
  Pill, Droplets, Wind, RefreshCw, FileText, FlaskConical, Timer,
  UtensilsCrossed, UserPlus, Stethoscope, Biohazard, HeartPulse, Baby, DoorOpen,
  Siren, Ambulance, Scissors, Brain, Users, ShieldPlus, AlertOctagon,
  HeartHandshake, Flower2, Flame, HelpCircle, Activity, ArrowDown
} from 'lucide-react';

interface PatientIconsBannerProps {
  patient: Patient;
  iconSize?: number;
  gap?: string;
}

// ─── Tooltip Portal ───────────────────────────────────────────────────────────
interface TooltipPortalProps {
  text: string;
  color: string;
  x: number;
  y: number;
}

export const TooltipPortal: React.FC<TooltipPortalProps> = ({ text, color, x, y }) => {
  const style: React.CSSProperties = {
    position: 'fixed',
    left: x,
    top: y - 10,
    transform: 'translate(-50%, -100%)',
    background: `linear-gradient(135deg, #1e3a5f 0%, #1e4976 60%, #164e63 100%)`,
    color: '#f0f9ff',
    padding: '0.42rem 0.8rem',
    borderRadius: '0.55rem',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.01em',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 2147483647,
    boxShadow: `0 8px 28px rgba(0,0,0,0.35), 0 0 0 1px ${color}55, inset 0 1px 0 rgba(255,255,255,0.1)`,
    borderLeft: `3px solid ${color}`,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    animation: 'tooltipFadeIn 0.15s ease-out forwards',
  };

  return ReactDOM.createPortal(
    <>
      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translate(-50%, calc(-100% + 8px)); }
          to   { opacity: 1; transform: translate(-50%, -100%); }
        }
      `}</style>
      <div style={style}>{text}</div>
    </>,
    document.body
  );
};

// ─── Icon with tooltip ────────────────────────────────────────────────────────
interface IconTipProps {
  label: string;
  color: string;
  children: React.ReactNode;
  critical?: boolean;
}

export const IconTip: React.FC<IconTipProps> = ({ label, color, children, critical }) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const handleEnter = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top });
  }, []);

  const handleLeave = useCallback(() => setPos(null), []);

  return (
    <span
      className={critical ? 'critical-pulse-icon' : ''}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ display: 'inline-flex', cursor: 'help', position: 'relative' }}
    >
      {children}
      {pos && <TooltipPortal text={label} color={color} x={pos.x} y={pos.y} />}
    </span>
  );
};

// ─── helpers ──────────────────────────────────────────────────────────────────
export const hasValue = (v?: string | null) => {
  if (!v) return false;
  
  const clean = v.trim().toLowerCase().replace(/[.,;:()]/g, '').replace(/\s+/g, ' ');
  
  if (clean === '') return false;

  const exactNegatives = [
    'não', 'nao',
    'nenhum', 'nenhuma',
    'não tem', 'nao tem',
    'ausente',
    'nega',
    'negativo',
    'não se aplica', 'n/a', 'na',
    'nda',
    '-',
    '0',
    'nada',
    'não realizado / sem informação',
    'não testado',
    'padrão', 'padrao',
    'ar ambiente',
    'não está usando', 'nao esta usando',
    'não está em uso', 'nao esta em uso'
  ];

  if (exactNegatives.includes(clean)) return false;

  const startsWithNegative = [
    'não ', 'nao ',
    'nenhum ', 'nenhuma ',
    'sem ', 
    'nega ',
    'ausência de ', 'ausencia de ',
    'livre '
  ];

  if (startsWithNegative.some(prefix => clean.startsWith(prefix))) {
    return false;
  }

  return true;
};

// ==========================================
// BIBLIOTECA DE SINÔNIMOS (GÍRIAS E JARGÕES)
// ==========================================
export const DICT_CROSS = ['cross', 'transferência', 'transferencia', 'vaga zero', 'regulação', 'regulacao', 'uti'];
export const DICT_CIRURGIA = ['cirurgia', 'cirúrgico', 'cirurgico', 'bloco', 'centro cirúrgico', 'rpa', 'pré-operatório', 'pós-operatório'];
export const DICT_PSIQUIATRIA = ['fuga', 'evasão', 'evasao', 'agitação', 'agitacao', 'psiquiátrico', 'psiquiatrico', 'surtado', 'louco', 'demente', 'desorientado', 'agressivo', 'contido', 'amarrado', 'haldol', 'psicótico', 'psicotico'];
export const DICT_BRONCOASPIRACAO = ['broncoaspiração', 'broncoaspiracao', 'engasgo'];
export const DICT_ACOMPANHANTE = ['acompanhante'];
export const DICT_IMUNOSSUPRIMIDO = ['reverso', 'imunossuprimido', 'imuno', 'oncológico', 'oncologico', 'leucemia', 'neutropenia', 'quimioterapia'];
export const DICT_SOCIAL = ['social', 'rua', 'abrigo', 'mendigo', 'vulnerável', 'vulneravel', 'sem teto', 'abandonado', 'asilo', 'solitário', 'solitario'];
export const DICT_ESCOLTA = ['escolta', 'polícia', 'policia', 'policial', 'presídio', 'presidio', 'custódia', 'custodia', 'detento', 'apenado', 'bandido', 'ladrão', 'ladrao', 'baleado', 'carceragem', 'penitenciária', 'penitenciaria', 'susepe', 'depen'];
export const DICT_MATERNIDADE = ['puérpera', 'puerpera', 'parto', 'cesárea', 'cesarea', 'gestante', 'recém nascido', 'recem nascido', 'trabalho de parto', 'curetagem', 'aborto'];

// Novos Dicionários UPA
export const DICT_NEGATORS = ['não', 'nao', 'negativo', 'descartado', 'sem suspeita', '(-)', 'neg', 'ausente', 'ausencia', 'ausência', 'afastado', 'sem evidencia', 'sem evidência'];
export const DICT_QUEDA = ['queda', 'cair', 'grade elevada', 'maca baixa', 'risco de queda'];
export const DICT_LPP = ['lpp', 'escara', 'lesão por pressão', 'lesao por pressao', 'mudança de decúbito', 'mudanca de decubito', 'braden', 'acamado', 'úlcera', 'ulcera'];
export const DICT_SEPSE = ['sepse', 'protocolo sepse', 'choque séptico', 'choque septico', 'lactato', 'sepse foco'];
export const DICT_IAM_AVC = ['iam', 'infarto', 'avc', 'trombolítico', 'trombolitico', 'dor torácica', 'dor toracica', 'déficit motor', 'deficit motor'];
export const DICT_DESCONHECIDO = ['desconhecido', 'ignorado', 'sem documento', 'sem identificação', 'sem identificacao', 'desconhecida', 'ignorada'];
export const DICT_COVID = ['covid', 'sars', 'corona', 'infeccioso', 'tuberculose', 'h1n1', 'influenza', 'isolamento respiratório', 'isolamento respiratorio'];

export const hasKeyword = (text: string | undefined | null, dictionary: string[]): boolean => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return dictionary.some(kw => lowerText.includes(kw));
};

export const hasSmartKeyword = (text: string | undefined | null, positiveKeywords: string[], negativeKeywords: string[] = DICT_NEGATORS): boolean => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  
  if (!positiveKeywords.some(kw => lowerText.includes(kw))) {
    return false;
  }

  const fragments = lowerText.split(/[.;,\n]/);

  for (const fragment of fragments) {
    if (positiveKeywords.some(kw => fragment.includes(kw))) {
      const isNegated = negativeKeywords.some(neg => fragment.includes(neg));
      if (!isNegated) {
        return true; 
      }
    }
  }

  return false;
};

export const PatientIconsBanner: React.FC<PatientIconsBannerProps> = ({ patient, iconSize = 13, gap = '2px' }) => {
  // Calculando tempo de permanência em dias
  const arrival = new Date(patient.arrivalTime);
  const diffTime = Math.abs(new Date().getTime() - arrival.getTime());
  const stayNum = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
  const isLongStay = stayNum >= 7;

  // Unindo descrições de evoluções para checar keywords
  const evolucaoText = patient.evolutions?.map(e => e.description).join('. ') || '';
  const pendenciasText = patient.subStatus || '';
  const precaucoesText = patient.isolation?.join(', ') || '';
  const examesText = patient.exams?.filter(e => e.status !== 'completed').map(e => e.name).join(', ') || '';
  const queixaText = patient.mainComplaint || '';
  const alergiasText = patient.allergies || '';
  const comorbidadesText = patient.comorbidities || '';
  const medicacoesText = patient.currentMedications || '';

  // Todos os textos clínicos combinados para uma busca universal rápida e eficiente
  const fullClinicalText = [evolucaoText, pendenciasText, precaucoesText, queixaText, alergiasText, comorbidadesText, medicacoesText].join('. ');

  const dietaText = fullClinicalText.toLowerCase().includes('jejum') || fullClinicalText.toLowerCase().includes('npo') ? 'NPO/Jejum' : '';
  const testeCovidText = ''; 
  const dispositivosText = fullClinicalText.toLowerCase().includes('sonda') || fullClinicalText.toLowerCase().includes('cvc') ? 'Sonda/Acesso' : ''; 
  const atbText = medicacoesText.toLowerCase().includes('antibiótico') ? 'Sim' : '';
  const dvaText = fullClinicalText.toLowerCase().includes('noradrenalina') || fullClinicalText.toLowerCase().includes('vasopressina') ? 'Ativa' : ''; 
  const suporteO2Text = fullClinicalText.toLowerCase().includes('vni') || fullClinicalText.toLowerCase().includes('cateter') || fullClinicalText.toLowerCase().includes('vm') ? 'Em uso' : ''; 

  return (
    <>
      <style>{`
        @keyframes criticalPulse {
          0% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 0px currentColor); }
          50% { transform: scale(1.15); opacity: 0.9; filter: drop-shadow(0 0 5px currentColor); }
          100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 0px currentColor); }
        }
        .critical-pulse-icon {
          animation: criticalPulse 1.5s infinite ease-in-out;
        }
      `}</style>
      <div className="patient-icons-banner" style={{ display: 'flex', gap: gap, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Dieta / Jejum */}
      {hasValue(dietaText) && (dietaText!.toLowerCase().includes('jejum') || dietaText!.toLowerCase().includes('npo')) && (
        <IconTip label={`Dieta: ${dietaText}`} color="#ef4444">
          <UtensilsCrossed size={iconSize} color="#ef4444" />
        </IconTip>
      )}

      {/* Admissão no Dia (Recém-chegado) */}
      {stayNum === 0 && (
        <IconTip label="Admitido hoje" color="#10b981">
          <UserPlus size={iconSize} color="#10b981" />
        </IconTip>
      )}

      {/* Dispositivos Invasivos */}
      {hasValue(dispositivosText) && (
        <IconTip label={`Dispositivos: ${dispositivosText}`} color="#d946ef">
          <Stethoscope size={iconSize} color="#d946ef" />
        </IconTip>
      )}

      {/* Teste Covid / Infecção (Smart) */}
      {(hasSmartKeyword(fullClinicalText, DICT_COVID) || (hasValue(testeCovidText) && (testeCovidText!.toLowerCase().includes('positivo') || testeCovidText!.toLowerCase().includes('suspeito')))) && (
        <IconTip label="COVID / Infeccioso Suspeito ou Positivo" color="#dc2626" critical>
          <Biohazard size={iconSize} color="#dc2626" />
        </IconTip>
      )}

      {/* Comorbidades */}
      {hasValue(patient.comorbidities) && (
        <IconTip label={`Comorbidades: ${patient.comorbidities}`} color="#be123c">
          <HeartPulse size={iconSize} color="#be123c" />
        </IconTip>
      )}

      {/* Idades Extremas */}
      {patient.age !== undefined && !isNaN(parseInt(String(patient.age), 10)) && parseInt(String(patient.age), 10) < 12 && (
        <IconTip label={`Pediátrico: ${patient.age}`} color="#10b981">
          <Baby size={iconSize} color="#10b981" />
        </IconTip>
      )}
      {patient.age !== undefined && !isNaN(parseInt(String(patient.age), 10)) && parseInt(String(patient.age), 10) >= 65 && (
        <IconTip label={`Idoso/Vulnerável: ${patient.age}`} color="#f97316">
          <UserPlus size={iconSize} color="#f97316" />
        </IconTip>
      )}

      {/* Alergia */}
      {hasValue(patient.allergies) && patient.allergies!.toLowerCase() !== 'nenhuma' && (
        <IconTip label={`Alergia: ${patient.allergies}`} color="#ef4444" critical>
          <AlertCircle size={iconSize} color="#ef4444" />
        </IconTip>
      )}

      {/* Riscos */}
      {patient.risk && patient.risk !== 'not-urgent' && (
        <IconTip label={`Risco Triagem: ${patient.risk}`} color="#f59e0b">
          <AlertTriangle size={iconSize} color="#f59e0b" />
        </IconTip>
      )}

      {/* Precauções / Isolamento */}
      {hasValue(precaucoesText) && precaucoesText!.toLowerCase() !== 'padrão' && (
        <IconTip label={`Isolamento: ${precaucoesText}`} color="#8b5cf6">
          <ShieldAlert size={iconSize} color="#8b5cf6" />
        </IconTip>
      )}

      {/* ATB - Antibiótico */}
      {(hasValue(atbText) || patient.currentMedications?.toLowerCase().includes('antibiótico')) && (
        <IconTip label={`ATB: Em uso de antibiótico`} color="#06b6d4">
          <Pill size={iconSize} color="#06b6d4" />
        </IconTip>
      )}

      {/* DVA - Droga Vasoativa */}
      {hasValue(dvaText) && (
        <IconTip label={`DVA: ${dvaText}`} color="#f43f5e" critical>
          <Droplets size={iconSize} color="#f43f5e" />
        </IconTip>
      )}

      {/* Suporte de O2 */}
      {hasValue(suporteO2Text) && (
        <IconTip label={`O₂: ${suporteO2Text}`} color="#38bdf8">
          <Wind size={iconSize} color="#38bdf8" />
        </IconTip>
      )}

      {/* Pendências */}
      {hasValue(pendenciasText) && (
        <IconTip label={`Status: ${pendenciasText}`} color="#facc15">
          <FileText size={iconSize} color="#facc15" />
        </IconTip>
      )}

      {/* Exames pendentes */}
      {hasValue(examesText) && (
        <IconTip label={`Exames pendentes: ${examesText}`} color="#a78bfa">
          <FlaskConical size={iconSize} color="#a78bfa" />
        </IconTip>
      )}

      {/* Previsão de Alta */}
      {hasValue(patient.dischargePrediction) && (
        patient.dischargePrediction!.toLowerCase().includes('hoje') ? (
          <IconTip label={`Alta prevista para HOJE!`} color="#84cc16">
            <DoorOpen size={iconSize} color="#84cc16" />
          </IconTip>
        ) : (
          <IconTip label={`Alta prevista: ${patient.dischargePrediction}`} color="#10b981">
            <CalendarClock size={iconSize} color="#10b981" />
          </IconTip>
        )
      )}

      {/* Permanência longa (≥7 dias) */}
      {isLongStay && (
        <IconTip label={`Internação longa: ${stayNum} dias`} color="#f97316">
          <Timer size={iconSize} color="#f97316" />
        </IconTip>
      )}

      {/* Aguardando Transferência (CROSS) */}
      {(hasKeyword(pendenciasText, DICT_CROSS) || 
        hasKeyword(evolucaoText, DICT_CROSS) ||
        hasKeyword(patient.sector, DICT_CROSS) ||
        patient.transferRequest) && (
        <IconTip label="Aguardando Transferência / CROSS" color="#dc2626">
          <Ambulance size={iconSize} color="#dc2626" />
        </IconTip>
      )}

      {/* Cirurgia Programada */}
      {(hasSmartKeyword(fullClinicalText, DICT_CIRURGIA) || hasKeyword(patient.dischargePrediction, DICT_CIRURGIA) || hasKeyword(examesText, DICT_CIRURGIA)) && (
        <IconTip label="Cirurgia Programada" color="#3b82f6">
          <Scissors size={iconSize} color="#3b82f6" />
        </IconTip>
      )}

      {/* Risco de Fuga / Agitação */}
      {(hasSmartKeyword(fullClinicalText, DICT_PSIQUIATRIA) || hasSmartKeyword(patient.risk, DICT_PSIQUIATRIA)) && (
        <IconTip label="Agitação / Risco de Fuga" color="#eab308" critical>
          <Brain size={iconSize} color="#eab308" />
        </IconTip>
      )}

      {/* Risco de Broncoaspiração */}
      {(hasSmartKeyword(fullClinicalText, DICT_BRONCOASPIRACAO) || hasSmartKeyword(patient.risk, DICT_BRONCOASPIRACAO)) && (
        <IconTip label="Risco de Broncoaspiração" color="#ea580c" critical>
          <AlertOctagon size={iconSize} color="#ea580c" />
        </IconTip>
      )}

      {/* Acompanhante Obrigatório */}
      {(
        (patient.age !== undefined && !isNaN(parseInt(String(patient.age), 10)) && (parseInt(String(patient.age), 10) < 12 || parseInt(String(patient.age), 10) >= 65)) ||
        hasKeyword(pendenciasText, DICT_ACOMPANHANTE) ||
        hasKeyword(precaucoesText, DICT_ACOMPANHANTE)
      ) && (
        <IconTip label="Acompanhante Obrigatório (Estatuto)" color="#8b5cf6">
          <Users size={iconSize} color="#8b5cf6" />
        </IconTip>
      )}

      {/* Imunossuprimido (Isolamento Reverso) */}
      {(hasKeyword(precaucoesText, DICT_IMUNOSSUPRIMIDO) ||
        hasKeyword(patient.comorbidities, DICT_IMUNOSSUPRIMIDO)) && (
        <IconTip label="Isolamento Reverso (Imunossuprimido)" color="#06b6d4">
          <ShieldPlus size={iconSize} color="#06b6d4" />
        </IconTip>
      )}

      {/* Vulnerabilidade Social (Assistente Social) */}
      {hasSmartKeyword(fullClinicalText, DICT_SOCIAL) && (
        <IconTip label="Acompanhamento Serviço Social (Vulnerabilidade)" color="#0d9488">
          <HeartHandshake size={iconSize} color="#0d9488" />
        </IconTip>
      )}

      {/* Sob Escolta Policial / Custódia */}
      {hasSmartKeyword(fullClinicalText, DICT_ESCOLTA) && (
        <IconTip label="Paciente sob Escolta Policial / Custódia" color="#dc2626" critical>
          <Siren size={iconSize} color="#dc2626" />
        </IconTip>
      )}

      {/* Gestante / Puérpera (Maternidade) */}
      {(hasSmartKeyword(fullClinicalText, DICT_MATERNIDADE) || (patient.sector && patient.sector.toLowerCase().includes('maternidade'))) && (
        <IconTip label="Gestante / Puérpera" color="#ec4899">
          <Flower2 size={iconSize} color="#ec4899" />
        </IconTip>
      )}

      {/* NOVOS ÍCONES UPA */}
      
      {/* Risco de Queda */}
      {hasSmartKeyword(fullClinicalText, DICT_QUEDA) && (
        <IconTip label="Alto Risco de Queda" color="#f59e0b" critical>
          <ArrowDown size={iconSize} color="#f59e0b" />
        </IconTip>
      )}

      {/* LPP / Escara */}
      {hasSmartKeyword(fullClinicalText, DICT_LPP) && (
        <IconTip label="Risco de LPP / Mudança de Decúbito" color="#8b5cf6">
          <ShieldPlus size={iconSize} color="#8b5cf6" />
        </IconTip>
      )}

      {/* Identidade Desconhecida */}
      {(hasSmartKeyword(patient.name, DICT_DESCONHECIDO) || hasSmartKeyword(fullClinicalText, DICT_DESCONHECIDO)) && (
        <IconTip label="Paciente Desconhecido / Sem Identificação" color="#64748b">
          <HelpCircle size={iconSize} color="#64748b" />
        </IconTip>
      )}

      {/* Protocolo Sepse */}
      {hasSmartKeyword(fullClinicalText, DICT_SEPSE) && (
        <IconTip label="Protocolo de Sepse" color="#ef4444" critical>
          <Flame size={iconSize} color="#ef4444" />
        </IconTip>
      )}

      {/* Protocolo IAM / AVC */}
      {hasSmartKeyword(fullClinicalText, DICT_IAM_AVC) && (
        <IconTip label="Protocolo IAM / AVC Ativo" color="#be123c" critical>
          <Activity size={iconSize} color="#be123c" />
        </IconTip>
      )}

      {/* TESTE DE ESTRESSE: ÍCONES EXTRAS APENAS PARA O PACIENTE DE TESTE CHEGAR A 30+ */}
      {patient.id === 'super-dummy-test' && (
        <>
          <IconTip label="Extra Teste 1 (Para chegar em 30)" color="#3b82f6"><Activity size={iconSize} color="#3b82f6" /></IconTip>
          <IconTip label="Extra Teste 2 (Para chegar em 30)" color="#10b981"><AlertTriangle size={iconSize} color="#10b981" /></IconTip>
          <IconTip label="Extra Teste 3 (Para chegar em 30)" color="#f59e0b"><ShieldAlert size={iconSize} color="#f59e0b" /></IconTip>
          <IconTip label="Extra Teste 4 (Para chegar em 30)" color="#ef4444"><Brain size={iconSize} color="#ef4444" /></IconTip>
          <IconTip label="Extra Teste 5 (Para chegar em 30)" color="#8b5cf6"><Stethoscope size={iconSize} color="#8b5cf6" /></IconTip>
          <IconTip label="Extra Teste 6 (Para chegar em 30)" color="#ec4899"><Flower2 size={iconSize} color="#ec4899" /></IconTip>
          <IconTip label="Extra Teste 7 (Para chegar em 30)" color="#64748b"><Users size={iconSize} color="#64748b" /></IconTip>
        </>
      )}
    </div>
    </>
  );
};
