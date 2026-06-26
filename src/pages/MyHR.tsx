import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ShieldAlert,
  FileText,
  ArrowRightLeft,
  CheckCircle2,
  UserSquare2,
  FilePlus2,
  Bell,
  AlertCircle,
  CalendarDays,
  Activity,
  Plane,
  Plus,
  Download,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";
import { RequestSwapModal } from "@/components/hr/RequestSwapModal";
import { UploadCertificateModal } from "@/components/hr/UploadCertificateModal";
import { TimeTracker } from "@/components/hr/TimeTracker";
import { cn } from "@/lib/utils";
import { useHR } from "@/context/HRContext";
import { toast } from "sonner";

export default function MyHR() {
  const { activeEmployee, myShifts, swapRequests, pendingSwapsCount } = useHR();
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Derive shifts with pending swap flag from swapRequests context
  const enrichedShifts = myShifts.map((shift) => {
    const hasPendingSwap = swapRequests.some(
      (r) =>
        r.from === (activeEmployee?.name ?? "") &&
        r.status === "pending" &&
        r.sector === shift.sector,
    );
    return {
      ...shift,
      status: hasPendingSwap ? ("swap_pending" as const) : shift.status,
    };
  });

  const myDocuments = [
    { name: "CRM Ativo", expiry: "15/06/2026", status: "warning" },
    { name: "Certificado BLS", expiry: "10/12/2027", status: "valid" },
    { name: "Treinamento NR-32", status: "missing" },
  ];

  const profile = activeEmployee ?? {
    name: "Dr. João Mendes",
    role: "Médico Plantonista",
    specialty: "Clínica Médica",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header Profile */}
      <div className="relative rounded-xl overflow-hidden glass-card-premium border-white/40 dark:border-white/10 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-sky-500/90 dark:from-blue-900/90 dark:to-sky-800/90 backdrop-blur-md z-0" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none z-0 translate-x-1/3 -translate-y-1/3" />

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="h-24 w-24 rounded-xl bg-white/20 border-2 border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-inner shrink-0 overflow-hidden relative group cursor-pointer">
            <UserSquare2 className="h-10 w-10 opacity-80 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-black uppercase tracking-widest text-white">
                Editar Foto
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left text-white">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">
                {profile.name}
              </h1>
              <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-500/30 font-black uppercase tracking-widest text-[9px] backdrop-blur-sm">
                Ativo na Escala
              </Badge>
            </div>
            <p className="text-blue-100 font-bold uppercase tracking-widest text-sm mb-6 opacity-90">
              {profile.role} • {profile.specialty}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="bg-black/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-200" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-200/70">
                    Horas Mês
                  </span>
                  <span className="text-sm font-bold">144h</span>
                </div>
              </div>
              <div className="bg-black/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-200" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-200/70">
                    Produtividade
                  </span>
                  <span className="text-sm font-bold">R$ 18.500</span>
                </div>
              </div>
              <div className="bg-amber-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-amber-500/30 flex items-center gap-2 cursor-pointer hover:bg-amber-500/30 transition-colors">
                <ShieldAlert className="h-4 w-4 text-amber-200" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-200/70">
                    Atenção
                  </span>
                  <span className="text-sm font-bold text-amber-100">
                    1 Doc. Vencendo
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <Button
              onClick={() => setIsSwapModalOpen(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 font-black uppercase tracking-widest text-[10px] h-12 rounded-xl shadow-lg"
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Solicitar Troca de Plantão
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsCertModalOpen(true)}
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 font-black uppercase tracking-widest text-[10px] h-12 rounded-xl backdrop-blur-sm"
              >
                <FilePlus2 className="h-4 w-4 mr-2" />
                Atestado
              </Button>
              <Button
                onClick={() =>
                  toast.info("Funcionalidade em desenvolvimento", {
                    description:
                      "Em breve você poderá solicitar férias por aqui.",
                  })
                }
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 font-black uppercase tracking-widest text-[10px] h-12 rounded-xl backdrop-blur-sm"
              >
                <Plane className="h-4 w-4 mr-2" />
                Férias
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <TimeTracker />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card-premium rounded-xl overflow-hidden border-white/40 dark:border-white/10 shadow-lg">
            <CardHeader className="p-6 border-b border-border/50 flex flex-row items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
              <div>
                <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Minha Escala
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">
                  Próximos Plantões Confirmados
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="font-black uppercase tracking-widest text-[10px] border-border/50"
                onClick={() => toast.info("Visualização mensal abrindo...")}
              >
                Ver Mês Completo
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {enrichedShifts.map((shift, i) => (
                  <div
                    key={i}
                    className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                        <span className="text-[10px] font-black uppercase text-primary/70">
                          {shift.day.slice(0, 3)}
                        </span>
                        <span className="text-lg font-black text-primary">
                          {shift.date.split("/")[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">{shift.sector}</span>
                          {shift.status === "swap_pending" && (
                            <Badge
                              variant="outline"
                              className="text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 border-amber-500/20"
                            >
                              Troca em Análise
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {shift.time}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-muted/50 border border-border/50 uppercase text-[9px] tracking-widest">
                            {shift.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    {shift.status !== "swap_pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-black uppercase tracking-widest text-[10px] w-full md:w-auto text-primary border-primary/30 hover:bg-primary hover:text-white transition-all shadow-sm"
                        onClick={() => setIsSwapModalOpen(true)}
                      >
                        Repassar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="glass-card-premium rounded-xl border-border/50 group">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Contracheque</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                    Disponível ref. Abril
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-[10px] font-black uppercase tracking-widest mt-2 border-border/50"
                  onClick={() => {
                    toast.success("Download iniciado", {
                      description:
                        "O contracheque será salvo no seu dispositivo.",
                    });
                  }}
                >
                  <Download className="h-3 w-3 mr-2" /> Baixar PDF
                </Button>
              </CardContent>
            </Card>
            <Card className="glass-card-premium rounded-xl border-border/50 group">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 transition-transform">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Avaliação de Desempenho</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                    Nenhuma pendência
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-[10px] font-black uppercase tracking-widest mt-2 border-border/50"
                  onClick={() =>
                    toast.info("Redirecionando para o portal de avaliação...")
                  }
                >
                  <ExternalLink className="h-3 w-3 mr-2" /> Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Docs & Notifications */}
        <div className="space-y-6">
          <Card className="glass-card-premium rounded-xl overflow-hidden border-white/40 dark:border-white/10 shadow-lg">
            <CardHeader className="p-6 border-b border-border/50 bg-black/[0.02] dark:bg-white/[0.02] flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-500" />
                Meus Documentos
              </CardTitle>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-lg"
                onClick={() => setIsCertModalOpen(true)}
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {myDocuments.map((doc, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-4 rounded-xl border flex items-start gap-3 transition-colors",
                    doc.status === "valid"
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : doc.status === "warning"
                        ? "bg-amber-500/5 border-amber-500/20"
                        : "bg-red-500/5 border-red-500/20",
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                      doc.status === "valid"
                        ? "bg-emerald-500/20 text-emerald-600"
                        : doc.status === "warning"
                          ? "bg-amber-500/20 text-amber-600"
                          : "bg-red-500/20 text-red-600",
                    )}
                  >
                    {doc.status === "valid" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <ShieldAlert className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{doc.name}</h4>
                    {doc.expiry && (
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                        Validade: {doc.expiry}
                      </p>
                    )}
                    {doc.status !== "valid" && (
                      <Button
                        variant="link"
                        className="p-0 h-auto text-[10px] font-black uppercase tracking-widest mt-2"
                      >
                        Atualizar agora
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card-premium rounded-xl overflow-hidden border-white/40 dark:border-white/10 shadow-lg relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            <CardHeader className="p-6 pb-2 relative z-10">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Mural de Avisos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 relative z-10 space-y-4">
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl">
                <p className="text-xs font-bold leading-relaxed text-foreground/80">
                  <span className="text-primary mr-1">📣 RH Informa:</span>A
                  escala de Junho será fechada na próxima sexta-feira.
                  Regularizem suas solicitações de repasse.
                </p>
              </div>
              <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 p-4 rounded-xl">
                <p className="text-xs font-bold leading-relaxed text-foreground/80">
                  <span className="text-amber-500 mr-1">🎯 Treinamento:</span>
                  Nova turma de NR-32 disponível na plataforma EAD. Inscrições
                  abertas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <RequestSwapModal
        open={isSwapModalOpen}
        onOpenChange={setIsSwapModalOpen}
      />
      <UploadCertificateModal
        open={isCertModalOpen}
        onOpenChange={setIsCertModalOpen}
      />
    </motion.div>
  );
}
