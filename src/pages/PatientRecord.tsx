import { useParams, useLocation } from "react-router-dom";
import { usePatients } from "@/hooks/use-patients";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ClipboardList, History, FlaskConical, Pill, User, Droplet, AlertTriangle, Activity, Calendar, Stethoscope, Printer, ChevronLeft, Clock, Syringe } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PatientTimelineModal } from "@/components/PatientEvolution/Modals/PatientTimelineModal";

export default function PatientRecord({ patientId }: { patientId?: string }) {
  const { id: paramId } = useParams();
  const id = patientId || paramId;
  const location = useLocation();
  const { patients } = usePatients();
  const patient = patients.find(p => String(p.id) === String(id));
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  const fromPath = location.state?.from || "/leitos";
  const fromLabel = location.state?.label || "Leitos";
  const activeTab = location.state?.activeTab || "clinical";

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Paciente não encontrado</h2>
        <p className="text-muted-foreground text-center">O prontuário que você está tentando acessar não existe ou foi removido.</p>
        {!patientId && (
          <Button asChild variant="outline">
            <Link to={fromPath} state={location.state} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        )}
      </div>
    );
  }

  const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
    <div className="flex flex-col gap-1 py-2 border-b border-border/30 last:border-0">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
      <span className="text-sm font-medium">{value || <span className="italic text-muted-foreground">Não informado</span>}</span>
    </div>
  );

  // Derive contextual data from patient record
  const arrivalDate = new Date(patient.arrivalTime);
  const medicationsList = (patient.currentMedications || "")
    .split(/[,;\n]/)
    .map(m => m.trim())
    .filter(Boolean);

  // Suggested exams based on main complaint keywords
  const complaint = (patient.mainComplaint || "").toLowerCase();
  const suggestedExams: { name: string; reason: string }[] = [];
  if (/febre|infec|dor/.test(complaint)) suggestedExams.push({ name: "Hemograma Completo", reason: "Investigação de processo infeccioso/inflamatório" });
  if (/dor.*peito|tora|cardia|palpita/.test(complaint)) suggestedExams.push({ name: "Eletrocardiograma (ECG)", reason: "Avaliação cardiológica" });
  if (/abdom|barriga|náuse|vomito|vômito/.test(complaint)) suggestedExams.push({ name: "Ultrassom Abdominal", reason: "Investigação de queixa abdominal" });
  if (/respira|tosse|falta.*ar|dispne/.test(complaint)) suggestedExams.push({ name: "Raio-X de Tórax", reason: "Avaliação respiratória" });
  if (/cabeça|cefal|tontura|desmai/.test(complaint)) suggestedExams.push({ name: "Tomografia de Crânio", reason: "Investigação neurológica" });
  if (suggestedExams.length === 0 && patient.mainComplaint) {
    suggestedExams.push({ name: "Avaliação Clínica Geral", reason: "Triagem inicial conforme queixa" });
  }

  const riskLabels: Record<string, string> = {
    'emergency': 'Emergência',
    'very-urgent': 'Muito Urgente',
    'urgent': 'Urgente',
    'less-urgent': 'Pouco Urgente',
    'not-urgent': 'Não Urgente',
    'evasion': 'Evasão'
  };

  const statusLabels: Record<string, string> = {
    'waiting': 'Aguardando',
    'attending': 'Em Atendimento',
    'completed': 'Finalizado',
    'evasion': 'Evasão'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary/5 p-6 rounded-3xl border border-primary/10">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {patient.name.toUpperCase().includes('NÃO IDENTIFICADO') || patient.name.toUpperCase().includes('DESCONHECIDO') 
                ? "PACIENTE NÃO IDENTIFICADO" 
                : patient.name}
            </h1>
            {patient.socialName && (
              <p className="text-xs text-muted-foreground italic">Nome social: {patient.socialName}</p>
            )}
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-muted-foreground font-mono uppercase">ID: {patient.id}</span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{patient.age} ANOS</span>
              <Badge className="text-[10px] uppercase font-bold tracking-tighter">PRONTUÁRIO ATIVO</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          {!patientId && (
            <Button 
              asChild 
              variant="ghost" 
              className="rounded-xl gap-2 font-bold text-muted-foreground hover:text-foreground"
            >
              <Link to={fromPath} state={location.state}>
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => window.print()}
            className="rounded-xl gap-2 font-bold border-primary/20 hover:bg-primary/5 hidden sm:flex"
          >
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button 
            onClick={() => setIsTimelineOpen(true)}
            className="rounded-xl gap-2 font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 uppercase tracking-widest text-[10px]"
          >
            <Clock className="h-4 w-4" />
            ⏱️ Jornada
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-xl mb-8">
          <TabsTrigger value="clinical" className="rounded-lg gap-2"><FileText className="h-4 w-4" /> Clínica</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2"><History className="h-4 w-4" /> Histórico</TabsTrigger>
          <TabsTrigger value="exams" className="rounded-lg gap-2"><FlaskConical className="h-4 w-4" /> Exames</TabsTrigger>
          <TabsTrigger value="meds" className="rounded-lg gap-2"><Pill className="h-4 w-4" /> Medicamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="clinical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Queixa Principal & Observações
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                      <p className="text-sm font-medium leading-relaxed">{patient.mainComplaint || "Nenhuma queixa registrada no cadastro."}</p>
                      <span className="text-[10px] text-muted-foreground mt-2 block italic font-bold">
                        Registrado em: {new Date(patient.arrivalTime).toLocaleString()} — Setor: {patient.sector || "Triagem"}
                      </span>
                    </div>

                    {patient.comorbidities && (
                      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Stethoscope className="h-4 w-4 text-amber-600" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Comorbidades</span>
                        </div>
                        <p className="text-sm font-bold text-amber-900">{patient.comorbidities}</p>
                      </div>
                    )}

                    {patient.justification && (
                      <div className="p-4 rounded-xl border border-[#006699]/20 bg-[#006699]/5">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-[#006699]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#006699]">Justificativa da Classificação (Triagem)</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-relaxed italic">"{patient.justification}"</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {patient.evolutionTime && (
                        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Tempo de Evolução</span>
                          </div>
                          <p className="text-sm font-bold text-blue-900">{patient.evolutionTime}</p>
                        </div>
                      )}
                      {patient.vaccination && (
                        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Syringe className="h-4 w-4 text-emerald-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Vacinação</span>
                          </div>
                          <p className="text-sm font-bold text-emerald-900">{patient.vaccination}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Alergias</span>
                        </div>
                        <p className="text-sm font-bold text-red-900">{patient.allergies || <span className="italic text-slate-400 font-normal">Nenhuma alergia registrada</span>}</p>
                      </div>
                      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Medicamentos em Uso</span>
                        </div>
                        <p className="text-sm font-bold text-primary">{patient.currentMedications || <span className="italic text-slate-400 font-normal">Nenhum medicamento informado</span>}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sinais Vitais Card */}
              <Card className="glass-card">
                <CardHeader className="border-b bg-muted/20">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-[#006699]" />
                      Sinais Vitais (Triagem)
                    </CardTitle>
                    {patient.triaged && (
                      <Badge className="bg-emerald-500 text-white border-0 text-[10px] uppercase font-bold">Triagem Concluída</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">PA</p>
                      <p className="text-lg font-black text-foreground">{patient.pa || '--'}</p>
                      <p className="text-[8px] text-muted-foreground uppercase font-bold">mmHg</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">FC</p>
                      <p className="text-lg font-black text-foreground">{patient.fc || '--'}</p>
                      <p className="text-[8px] text-muted-foreground uppercase font-bold">BPM</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">SpO2</p>
                      <p className="text-lg font-black text-foreground">{patient.spo2 ? `${patient.spo2}%` : '--'}</p>
                      <p className="text-[8px] text-muted-foreground uppercase font-bold">Saturação</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Temp</p>
                      <p className="text-lg font-black text-foreground">{patient.temperature ? `${patient.temperature}°C` : '--'}</p>
                      <p className="text-[8px] text-muted-foreground uppercase font-bold">Axilar</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Glicemia</p>
                      <p className="text-lg font-black text-foreground">{patient.glicemia || '--'}</p>
                      <p className="text-[8px] text-muted-foreground uppercase font-bold">mg/dL</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">FR</p>
                      <p className="text-lg font-black text-foreground">{patient.fr || '--'}</p>
                      <p className="text-[8px] text-muted-foreground uppercase font-bold">irpm</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Glasgow</p>
                      <p className="text-lg font-black text-foreground">{patient.glasgow || '--'}</p>
                      <p className="text-[8px] text-muted-foreground uppercase font-bold">Escala</p>
                    </div>
                    {patient.weight && (
                      <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Peso</p>
                        <p className="text-lg font-black text-foreground">{patient.weight}kg</p>
                        <p className="text-[8px] text-muted-foreground uppercase font-bold">Aferido</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card h-fit">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-red-500" />
                  Resumo Clínico
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <InfoRow label="Cartão do SUS" value={patient.susCard} />
                <InfoRow label="Nome da Mãe" value={patient.motherName} />
                <InfoRow label="CPF" value={patient.cpf} />
                <InfoRow label="Data de Nascimento" value={patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-BR') : undefined} />
                <InfoRow label="Sexo" value={patient.gender?.toUpperCase()} />
                <InfoRow label="Telefone" value={patient.phone1 || patient.phone2} />
                <InfoRow label="E-mail" value={patient.email} />
                <InfoRow label="Tipo Sanguíneo" value={patient.bloodType} />
                <InfoRow label="Classificação de Risco" value={riskLabels[patient.risk] || patient.risk} />
                <InfoRow label="Status" value={statusLabels[patient.status] || patient.status} />
                <InfoRow label="Setor de Atendimento" value={patient.sector} />
                {patient.priority !== 'normal' && (
                  <InfoRow label="Prioridade de Atendimento" value={patient.priority === 'emergency' ? 'EMERGÊNCIA' : 'PREFERENCIAL'} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="glass-card">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Linha do Tempo do Atendimento
              </CardTitle>
              <CardDescription>Eventos gerados a partir do cadastro do paciente.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ol className="relative border-l border-border/60 ml-2 space-y-6">
                <li className="ml-6">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 ring-4 ring-background">
                    <Calendar className="h-3 w-3 text-primary" />
                  </span>
                  <h3 className="text-sm font-bold">Entrada na unidade</h3>
                  <time className="block text-[11px] text-muted-foreground uppercase tracking-widest">{arrivalDate.toLocaleString()}</time>
                  <p className="text-sm mt-1">Paciente registrado no setor <strong>{patient.sector || "Triagem"}</strong>.</p>
                </li>
                <li className="ml-6">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 ring-4 ring-background">
                    <Activity className="h-3 w-3 text-amber-500" />
                  </span>
                  <h3 className="text-sm font-bold">Classificação de risco</h3>
                  <time className="block text-[11px] text-muted-foreground uppercase tracking-widest">Triagem</time>
                  <p className="text-sm mt-1">Risco classificado como <strong className="uppercase">{riskLabels[patient.risk] || patient.risk}</strong>.</p>
                </li>
                <li className="ml-6">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 ring-4 ring-background">
                    <Stethoscope className="h-3 w-3 text-primary" />
                  </span>
                  <h3 className="text-sm font-bold">Queixa relatada</h3>
                  <p className="text-sm mt-1">{patient.mainComplaint || <span className="italic text-muted-foreground">Sem queixa registrada.</span>}</p>
                </li>
                {patient.allergies && (
                  <li className="ml-6">
                    <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15 ring-4 ring-background">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    </span>
                    <h3 className="text-sm font-bold">Alerta de alergias declaradas</h3>
                    <p className="text-sm mt-1">{patient.allergies}</p>
                  </li>
                )}
                <li className="ml-6">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-500/15 ring-4 ring-background">
                    <FileText className="h-3 w-3 text-green-500" />
                  </span>
                  <h3 className="text-sm font-bold">Status atual</h3>
                  <p className="text-sm mt-1 uppercase">{statusLabels[patient.status] || patient.status}</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
          <Card className="glass-card">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-primary" />
                Exames Sugeridos
              </CardTitle>
              <CardDescription>Sugestões automáticas com base na queixa principal informada no cadastro.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {suggestedExams.length === 0 ? (
                <p className="text-sm italic text-muted-foreground">Nenhuma queixa registrada — não há exames sugeridos.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedExams.map((exam, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border/50 bg-muted/20">
                      <div className="flex items-center gap-2 mb-1">
                        <FlaskConical className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-bold">{exam.name}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">{exam.reason}</p>
                      <Badge variant="outline" className="mt-2 text-[10px]">SOLICITAÇÃO PENDENTE</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meds">
          <Card className="glass-card">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Medicamentos em Uso
              </CardTitle>
              <CardDescription>Lista derivada do cadastro do paciente.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {medicationsList.length === 0 ? (
                <p className="text-sm italic text-muted-foreground">Nenhuma medicação registrada no cadastro.</p>
              ) : (
                <div className="space-y-3">
                  {medicationsList.map((med, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Pill className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{med}</p>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-widest">Uso contínuo declarado</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">CADASTRO</Badge>
                    </div>
                  ))}
                </div>
              )}

              {patient.allergies && (
                <div className="mt-6 p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-red-500">Atenção — Alergias</span>
                  </div>
                  <p className="text-sm">{patient.allergies}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Patient Timeline Modal */}
      {patient && (
        <PatientTimelineModal 
          isOpen={isTimelineOpen} 
          onClose={setIsTimelineOpen} 
          patient={patient} 
        />
      )}
    </motion.div>
  );
}
