import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Patient } from "@/context/PatientsContext";
import { Phone, Mail, MapPin, User, Activity, Pill, History, Clock, IdCard, Users } from "lucide-react";
import { cn, formatWords } from "@/lib/utils";

interface PatientDetailsModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PatientDetailsModal({ patient, isOpen, onClose }: PatientDetailsModalProps) {
  if (!patient) return null;

  const riskColor: Record<string, string> = {
    'emergency': 'bg-red-500/15 text-red-700 border border-red-500/20 dark:bg-red-500/25 dark:text-red-300',
    'very-urgent': 'bg-orange-500/15 text-orange-700 border border-orange-500/20 dark:bg-orange-500/25 dark:text-orange-300',
    'urgent': 'bg-amber-500/15 text-amber-700 border border-amber-500/20 dark:bg-amber-500/25 dark:text-amber-300',
    'less-urgent': 'bg-green-500/15 text-green-700 border border-green-500/20 dark:bg-green-500/25 dark:text-green-300',
    'not-urgent': 'bg-blue-500/15 text-blue-700 border border-blue-500/20 dark:bg-blue-500/25 dark:text-blue-300',
    'evasion': 'bg-slate-500/15 text-slate-705 border border-slate-500/20 dark:bg-slate-500/25 dark:text-slate-300',
  };

  const riskLabel: Record<string, string> = {
    'emergency': 'Emergência',
    'very-urgent': 'Muito Urgente',
    'urgent': 'Urgente',
    'less-urgent': 'Pouco Urgente',
    'not-urgent': 'Não Urgente',
    'evasion': 'Evasão',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl border-none shadow-2xl p-0 overflow-hidden glass-card-premium rounded-2xl transition-colors duration-500">
        <DialogHeader className="p-8 pb-4 border-b border-white/20 dark:border-slate-800/15 bg-white/10 dark:bg-slate-950/10">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-foreground border-foreground/20 uppercase tracking-widest text-[9px] font-black">
                  {patient.ticket || 'SEM SENHA'}
                </Badge>
                <Badge className={cn("border-0 text-[10px] uppercase font-black px-2.5 py-0.5", riskColor[patient.risk])}>
                  {riskLabel[patient.risk]}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
                {formatWords(patient.name)}
              </DialogTitle>
              <p className="text-muted-foreground text-xs font-semibold">
                {patient.age} anos • CPF: {patient.cpf} • {patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Feminino' : 'Não informado'}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8">
          <Tabs defaultValue="evolution" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12 bg-white/10 dark:bg-slate-950/25 border border-white/20 dark:border-slate-800/20 p-1 rounded-2xl mb-2">
              <TabsTrigger value="evolution" className="rounded-xl data-[state=active]:bg-[#006699] data-[state=active]:text-white transition-all font-black text-xs gap-2">
                <History className="h-4 w-4" />
                EVOLUÇÃO
              </TabsTrigger>
              <TabsTrigger value="medications" className="rounded-xl data-[state=active]:bg-[#006699] data-[state=active]:text-white transition-all font-black text-xs gap-2">
                <Pill className="h-4 w-4" />
                MEDICAÇÕES
              </TabsTrigger>
              <TabsTrigger value="contact" className="rounded-xl data-[state=active]:bg-[#006699] data-[state=active]:text-white transition-all font-black text-xs gap-2">
                <Phone className="h-4 w-4" />
                CONTATO
              </TabsTrigger>
              <TabsTrigger value="cadastro" className="rounded-xl data-[state=active]:bg-[#006699] data-[state=active]:text-white transition-all font-black text-xs gap-2">
                <IdCard className="h-4 w-4" />
                CADASTRO
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] mt-2 pr-2">
              {/* Evolution History */}
              <TabsContent value="evolution" className="m-0 space-y-4 pt-4">
                {patient.evolutions && patient.evolutions.length > 0 ? (
                  patient.evolutions.map((ev, idx) => (
                    <Card key={ev.id} className="border border-white/40 dark:border-slate-800/20 bg-white/20 dark:bg-slate-900/15 overflow-hidden group rounded-2xl shadow-inner">
                      <div className="h-1 bg-[#006699]/30 group-hover:bg-[#006699] transition-all" />
                      <CardHeader className="py-3 px-5 flex flex-row items-center justify-between space-y-0 border-b border-white/20 dark:border-slate-800/10">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[9px] font-black uppercase bg-white/30 text-foreground dark:bg-slate-850/40">
                            {ev.type}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ev.timestamp}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase">
                          <User className="h-3 w-3" />
                          {ev.professional}
                        </span>
                      </CardHeader>
                      <CardContent className="py-4 px-5">
                        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                          {ev.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <History className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                    <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Nenhuma evolução registrada</p>
                  </div>
                )}
              </TabsContent>

              {/* Medications and Clinical Info */}
              <TabsContent value="medications" className="m-0 space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-white/40 dark:border-slate-800/20 bg-white/20 dark:bg-slate-900/15 rounded-2xl shadow-inner">
                    <CardHeader className="py-4 px-5 border-b border-white/10 dark:border-slate-800/10">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Medicamentos em Uso
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                      <p className="text-sm font-medium">
                        {patient.currentMedications || 'Não informados pelo paciente'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-red-500/20 dark:border-red-500/10 bg-red-500/5 dark:bg-red-500/5 rounded-2xl shadow-inner">
                    <CardHeader className="py-4 px-5 border-b border-red-500/10 dark:border-red-500/10">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Alergias
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                      <p className="text-sm font-black text-red-700 dark:text-red-400">
                        {patient.allergies || 'Sem alergias conhecidas'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Separator className="flex-1" />
                    Últimos Sinais Vitais
                    <Separator className="flex-1" />
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    {[
                      { label: 'FC (bpm)', value: patient.fc },
                      { label: 'PA (mmHg)', value: patient.pa },
                      { label: 'SPO2 (%)', value: patient.spo2 },
                      { label: 'TEMP (°C)', value: patient.temperature }
                    ].map(sig => (
                      <div key={sig.label} className="bg-white/15 dark:bg-slate-950/20 border border-white/30 dark:border-slate-800/20 p-4 rounded-2xl shadow-inner">
                        <p className="text-[9px] font-black text-muted-foreground uppercase">{sig.label}</p>
                        <p className="text-xl font-black text-primary dark:text-sky-400 mt-0.5">{sig.value || '--'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Contact Information */}
              <TabsContent value="contact" className="m-0 space-y-6 pt-4">
                <Card className="border border-white/40 dark:border-slate-800/20 bg-white/20 dark:bg-slate-900/15 rounded-2xl shadow-inner">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 group">
                          <div className="h-10 w-10 rounded-xl bg-[#006699]/10 text-[#006699] dark:bg-sky-505/10 dark:text-sky-400 flex items-center justify-center group-hover:bg-[#006699] group-hover:text-white transition-all">
                            <Phone className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-muted-foreground uppercase">Telefone Principal</p>
                            <p className="text-sm font-bold">{patient.phone1 || 'Não informado'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                          <div className="h-10 w-10 rounded-xl bg-[#006699]/10 text-[#006699] dark:bg-sky-555/10 dark:text-sky-400 flex items-center justify-center group-hover:bg-[#006699] group-hover:text-white transition-all">
                            <Phone className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-muted-foreground uppercase">Telefone Secundário</p>
                            <p className="text-sm font-bold">{patient.phone2 || '-'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 group">
                          <div className="h-10 w-10 rounded-xl bg-[#006699]/10 text-[#006699] dark:bg-sky-505/10 dark:text-sky-400 flex items-center justify-center group-hover:bg-[#006699] group-hover:text-white transition-all">
                            <Mail className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-muted-foreground uppercase">E-mail</p>
                            <p className="text-sm font-bold break-all">{patient.email || 'Não informado'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                          <div className="h-10 w-10 rounded-xl bg-[#006699]/10 text-[#006699] dark:bg-sky-555/10 dark:text-sky-400 flex items-center justify-center group-hover:bg-[#006699] group-hover:text-white transition-all">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-muted-foreground uppercase">Localização</p>
                            <p className="text-sm font-bold">{patient.city ? `${patient.city} - ${patient.state}` : 'Não informada'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/10 dark:bg-slate-800/10" />
                    
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Responsável Legal / Mãe</p>
                       <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-[#006699]/10 text-[#006699] dark:bg-sky-505/10 dark:text-sky-400 flex items-center justify-center">
                           <User className="h-4 w-4" />
                         </div>
                         <p className="text-sm font-black uppercase text-foreground">{patient.motherName || 'Não informado'}</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Demographic & Companion Information */}
              <TabsContent value="cadastro" className="m-0 space-y-6 pt-4">
                <Card className="border border-white/40 dark:border-slate-800/20 bg-white/20 dark:bg-slate-900/15 rounded-2xl shadow-inner">
                  <CardHeader className="py-4 px-6 border-b border-white/10 dark:border-slate-800/10">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400 flex items-center gap-2">
                      <IdCard className="h-4 w-4" />
                      Dados Sócio-Demográficos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase">RG / Órgão</p>
                        <p className="text-sm font-bold">{patient.rg ? `${patient.rg} - ${patient.organIssuer || ''}` : 'Não informado'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase">Raça / Cor</p>
                        <p className="text-sm font-bold capitalize">{patient.race || 'Não informado'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase">Estado Civil</p>
                        <p className="text-sm font-bold capitalize">{patient.maritalStatus || 'Não informado'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase">Nacionalidade / Naturalidade</p>
                        <p className="text-sm font-bold">{patient.nationality || 'Brasil'} / {patient.birthPlace || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[9px] font-black text-muted-foreground uppercase">Profissão</p>
                        <p className="text-sm font-bold">{patient.profession || 'Não informado'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase">Religião</p>
                        <p className="text-sm font-bold">{patient.religion || 'Não informado'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase">PCD</p>
                        <p className="text-sm font-bold capitalize">{patient.pcd === 'nao' ? 'Não possui' : (patient.pcd || 'Não informado')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-white/40 dark:border-slate-800/20 bg-white/20 dark:bg-slate-900/15 rounded-2xl shadow-inner">
                  <CardHeader className="py-4 px-6 border-b border-white/10 dark:border-slate-800/10">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-[#006699] dark:text-sky-400 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Dados do Acompanhante / Responsável
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {patient.companionName ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="col-span-2">
                          <p className="text-[9px] font-black text-muted-foreground uppercase">Nome do Acompanhante</p>
                          <p className="text-sm font-bold uppercase">{patient.companionName}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-muted-foreground uppercase">Parentesco</p>
                          <p className="text-sm font-bold capitalize">{patient.companionRelation || 'Não informado'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-muted-foreground uppercase">Telefone</p>
                          <p className="text-sm font-bold">{patient.companionPhone || 'Não informado'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[9px] font-black text-muted-foreground uppercase">CPF do Acompanhante</p>
                          <p className="text-sm font-bold">{patient.companionCpf || 'Não informado'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p className="text-sm font-bold">Paciente sem acompanhante registrado.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
