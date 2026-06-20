import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Calendar, X, Activity as ActivityIcon, 
  AlertTriangle, Clock, RefreshCw, LogIn, FileText, Activity 
} from 'lucide-react';
import { Patient } from "@/context/PatientsContext";
import { PatientIconsBanner } from './PatientIconsBanner';
import { formatWords } from '@/lib/utils';

export interface BedManagementModalProps {
  patient: Patient | null;
  bedName: string;
  bedSector: string;
  bedRoom: string;
  bedStatus: string;
  onClose: () => void;
}

export function BedManagementModal({ patient, bedName, bedSector, bedRoom, bedStatus, onClose }: BedManagementModalProps) {
  // Drag states for modal
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - modalPos.x, y: e.clientY - modalPos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setModalPos({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const admissionDateStr = patient?.arrivalTime ? new Date(patient.arrivalTime).toLocaleString('pt-BR') : '';

  // Generate historical events from patient's evolutions
  const events = [];
  if (patient) {
    if (patient.evolutions && patient.evolutions.length > 0) {
      patient.evolutions.forEach((evo, idx) => {
        events.push({
          id: `evo-${idx}`,
          timestamp: evo.timestamp || new Date().toLocaleString('pt-BR'),
          type: 'evolution',
          title: evo.type || 'Evolução',
          note: evo.description
        });
      });
    }

    // Add admission event at the end
    events.push({
      id: 'adm',
      timestamp: admissionDateStr,
      type: 'admission',
      title: `Admissão no setor ${patient.sector || bedSector}`,
      note: ''
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60" style={{ zIndex: 9999999 }} onClick={onClose}>
      <div 
        className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem] text-slate-900 dark:text-slate-100" 
        onClick={e => e.stopPropagation()}
        style={{ 
          transform: `translate(${modalPos.x}px, ${modalPos.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease',
          maxWidth: '650px', 
          width: '95%', 
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          margin: '5vh auto', // To center it nicely
          position: 'relative'
        }}
      >
        <div className="flex flex-col h-full overflow-hidden" style={{ minHeight: 0 }}>
        {/* CABEÇALHO */}
        <div 
          className="modal-header border-b border-slate-200 dark:border-slate-800"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ 
            padding: '1.25rem 1.5rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: isDragging ? 'grabbing' : 'grab', 
            userSelect: 'none', 
            touchAction: 'none' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: patient ? '#3b82f6' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 700, color: 'var(--foreground)' }}>
                {patient ? formatWords(patient.name) : 'Leito Disponível'}
              </h2>
              {patient && patient.arrivalTime && (
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={12} /> Internado em: {admissionDateStr}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose} 
            onPointerDown={(e) => e.stopPropagation()} 
            className="hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-300 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
            style={{ border: 'none', background: 'transparent' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {patient ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* LOCALIZAÇÃO E STATUS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Localização</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2px', marginBottom: '10px' }}>
                    {bedSector} — {bedRoom ? `${bedRoom} | ` : ''}{bedName}
                  </div>
                  
                  {/* PatientIconsBanner DENTRO DO MODAL */}
                  <div style={{ marginTop: '1rem' }}>
                    <PatientIconsBanner 
                      iconSize={18}
                      gap="6px"
                      patient={patient} 
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/30">
                    Ocupado
                  </span>
                </div>
              </div>

              {/* CARD: DADOS CLÍNICOS E ESTRUTURA */}
              <div className="bg-white dark:bg-slate-950 shadow-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-5">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Nascimento (DN)</span>
                    <div style={{ fontWeight: 600 }}>{patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-BR') : '-'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Idade / Sexo</span>
                    <div style={{ fontWeight: 600 }}>{patient.age || '-'} anos ({patient.gender || '-'})</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}><ActivityIcon size={12} style={{display:'inline', marginRight: '4px'}}/> Hipótese Diagnóstica (HD)</span>
                    <div style={{ fontWeight: 600 }}>{patient.mainComplaint || 'Não informada'}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}><ActivityIcon size={12} style={{display:'inline', marginRight: '4px'}}/> Comorbidades</span>
                    <div style={{ fontWeight: 600 }}>{patient.comorbidities || 'Nenhuma informada'}</div>
                  </div>
                  {patient.allergies && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ fontSize: '0.75rem', color: '#ef4444', textTransform: 'uppercase' }}><AlertTriangle size={12} color="#ef4444" style={{display:'inline', marginRight: '4px'}}/> Alergias</span>
                      <div style={{ fontWeight: 600, color: '#ef4444' }}>{patient.allergies}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* CARD: PAINEL CLÍNICO ATUAL */}
              <div className="bg-white dark:bg-slate-950 shadow-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-5">
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Painel Clínico</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Antibióticos (ATB)</span>
                    <div style={{ fontWeight: 600 }}>{patient.currentMedications?.toLowerCase().includes('antibiótico') ? 'Em uso' : '-'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Medicações Atuais</span>
                    <div style={{ fontWeight: 600 }}>{patient.currentMedications || '-'}</div>
                  </div>
                </div>
              </div>

              {/* CARD: GESTÃO E RISCOS */}
              <div className="bg-white dark:bg-slate-950 shadow-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-5">
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Condutas & Gestão do Leito</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Exames Pendentes / Realizados</span>
                    <div style={{ fontWeight: 600 }}>{patient.exams?.map(e => `${e.name} (${e.status})`).join(', ') || '-'}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Pendências Atuais</span>
                    <div style={{ fontWeight: 600 }}>{patient.subStatus || '-'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Precauções / Isolamento</span>
                    <div style={{ fontWeight: 600 }}>{patient.isolation?.join(', ') || '-'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Risco (Triagem)</span>
                    <div style={{ fontWeight: 600 }}>{patient.risk || '-'}</div>
                  </div>
                </div>
              </div>

              {/* CARD: EVOLUÇÕES DA ENFERMAGEM / HISTÓRICO */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
                  <Clock size={16} color="#3b82f6" />
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#3b82f6', fontWeight: 600 }}>Histórico de Evoluções</h3>
                </div>
                
                {(() => {
                  if (events.length === 0) {
                    return <div style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', fontStyle: 'italic', padding: '10px 0' }}>Nenhuma evolução registrada.</div>;
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '24px', marginTop: '10px' }}>
                      <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '15px', width: '2px', borderLeft: '2px dashed var(--border)' }} />
                      
                      {events.map((ev, index) => {
                        const isFirst = index === 0;
                        let icon, iconBg;
                        if (ev.type === 'admission') {
                          icon = <LogIn size={10} color="#fff" />;
                          iconBg = '#10b981'; // status-livre color equivalent
                        } else {
                          icon = <FileText size={7} color="#fff" />;
                          iconBg = '#3b82f6';
                        }

                        return (
                          <div key={ev.id} style={{ position: 'relative', marginBottom: '1.25rem' }}>
                            <div style={{ position: 'absolute', left: '-24px', top: '3px', width: '16px', height: '16px', borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                              {icon}
                            </div>
                            
                            <div style={{ paddingLeft: '8px' }}>
                              {ev.type === 'evolution' ? (
                                <details open={isFirst} className="bg-white dark:bg-slate-950 shadow-sm rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
                                  <summary style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '8px', outline: 'none' }}>
                                    {ev.timestamp && <strong style={{ color: 'var(--muted-foreground)' }}>{ev.timestamp}</strong>}
                                    <span style={{ opacity: 0.8 }}>— {ev.title}</span>
                                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.5, fontStyle: 'italic' }}>{isFirst ? '(Mais recente)' : '(Expandir)'}</span>
                                  </summary>
                                  <div style={{ padding: '0 14px 14px 14px', fontSize: '0.9rem', color: 'var(--foreground)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px' }}>
                                      {ev.note}
                                    </div>
                                  </div>
                                </details>
                              ) : (
                                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-lg text-sm text-foreground flex items-center gap-2 p-2.5">
                                  {ev.timestamp && <strong style={{ color: 'var(--muted-foreground)' }}>{ev.timestamp}</strong>}
                                  <span style={{ opacity: 0.9 }}>— {ev.title}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {patient.dischargePrediction && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-5">
                  <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Previsão de Alta / Desfecho</span>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{patient.dischargePrediction}</span>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="empty-sector" style={{ margin: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div className="p-3.5 bg-emerald-100 dark:bg-emerald-950/40 rounded-full text-emerald-500">
                <Activity size={32} />
              </div>
              <h3 style={{ margin: 0, color: 'var(--foreground)' }}>Leito Desocupado</h3>
              <p style={{ color: 'var(--muted-foreground)' }}>Este leito não possui paciente no momento.</p>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
