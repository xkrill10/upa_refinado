import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  FlaskConical,
  Beaker,
  Microscope,
  FileSignature,
  Clock,
  Printer,
  XCircle,
  History,
  AlertTriangle,
  Cpu,
  Thermometer,
  Package,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/Laboratory/SearchBar";
import LabResultModal from "@/components/Laboratory/LabResultModal";
import { PrintLabelModal } from "@/components/Laboratory/PrintLabelModal";
import { ExamHistoryModal } from "@/components/Laboratory/ExamHistoryModal";
import { CollectorMode } from "@/components/Laboratory/CollectorMode";
import { useSlaTimer } from "@/hooks/useSlaTimer";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
} from "recharts";
import { toast } from "sonner";
import {
  usePatientsContext,
  Patient,
  ExamRequest,
} from "@/context/PatientsContext";
import { useInventory } from "@/context/InventoryContext";
function SlaTimer({ deadline }: { deadline?: string }) {
  const timeRemaining = useSlaTimer(deadline || new Date().toISOString());
  if (!deadline) {
    return null;
  }
  return (
    <span
      className={cn(
        "ml-auto",
        timeRemaining.startsWith("-") ? "text-red-500" : "text-amber-500",
      )}
    >
      {timeRemaining}
    </span>
  );
}

export default function Laboratory() {
  const { patients, updateExamStatus, recollectExam } = usePatientsContext();
  const { decrementStockDirectly } = useInventory();
  const [selectedExam, setSelectedExam] = useState<{
    patient: Patient;
    exam: ExamRequest;
  } | null>(null);
  const [printExam, setPrintExam] = useState<{
    patient: Patient;
    exam: ExamRequest;
  } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [collectorMode, setCollectorMode] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "", priority: "" });

  const sparklineProd = useMemo(
    () => [
      { time: "08:00", val: 5 },
      { time: "10:00", val: 12 },
      { time: "12:00", val: 8 },
      { time: "14:00", val: 15 },
      { time: "16:00", val: 22 },
      { time: "18:00", val: 18 },
    ],
    [],
  );

  const sparklineTAT = useMemo(
    () => [
      { time: "08:00", val: 40 },
      { time: "10:00", val: 35 },
      { time: "12:00", val: 45 },
      { time: "14:00", val: 30 },
      { time: "16:00", val: 20 },
      { time: "18:00", val: 25 },
    ],
    [],
  );

  const allExams = patients.flatMap((p) =>
    (p.exams || []).map((e) => ({ patient: p, exam: e })),
  );

  const filteredExams = useMemo(() => {
    return allExams.filter(({ patient, exam }) => {
      const matchesQuery =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filters.status
        ? exam.status === filters.status
        : true;
      const matchesPriority = filters.priority
        ? exam.priority === filters.priority
        : true;
      const matchesTab = activeTab === "all" || exam.type === activeTab;
      return matchesQuery && matchesStatus && matchesPriority && matchesTab;
    });
  }, [allExams, searchQuery, filters, activeTab]);

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false;
    return new Date() > new Date(deadline);
  };

  const pendingExams = filteredExams
    .filter((e) => e.exam.status === "pending_collection")
    .sort((a, b) => {
      const aOverdue = isOverdue(a.exam.deadline);
      const bOverdue = isOverdue(b.exam.deadline);
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return (
        new Date(a.exam.requestedAt).getTime() -
        new Date(b.exam.requestedAt).getTime()
      );
    });

  const inAnalysisExams = filteredExams
    .filter((e) => e.exam.status === "in_analysis")
    .sort((a, b) => {
      const aOverdue = isOverdue(a.exam.deadline);
      const bOverdue = isOverdue(b.exam.deadline);
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return (
        new Date(a.exam.requestedAt).getTime() -
        new Date(b.exam.requestedAt).getTime()
      );
    });

  const completedExams = filteredExams.filter(
    (e) => e.exam.status === "completed",
  );

  const dashboardData = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayExams = allExams.filter(
      (e) =>
        e.exam.status === "completed" && e.exam.releasedAt?.startsWith(today),
    );
    const labCount = todayExams.filter((e) => e.exam.type === "lab").length;
    const imgCount = todayExams.filter((e) => e.exam.type === "image").length;

    return {
      totalToday: todayExams.length,
      pieData: [
        { name: "Laboratório", value: labCount, color: "#8b5cf6" },
        { name: "Imagem", value: imgCount, color: "#14b8a6" },
      ],
    };
  }, [allExams]);

  const handleStatusChange = (
    patientId: string,
    examId: string,
    newStatus: ExamRequest["status"],
    examType?: "lab" | "image",
  ) => {
    updateExamStatus(patientId, examId, newStatus);
    if (newStatus === "in_analysis") {
      const itemName =
        examType === "lab" ? "Tubo de Coleta" : "Filme de Raio-X";
      decrementStockDirectly(itemName, 1);
      toast.success(
        `Almoxarifado: Baixa de 1 ${itemName} realizada com sucesso.`,
      );
    }
  };

  const getTubeColor = (examName: string) => {
    const name = examName.toLowerCase();
    if (name.includes("hemograma") || name.includes("tipagem"))
      return { color: "bg-purple-500", label: "Tubo Roxo (EDTA)" };
    if (name.includes("coagulograma") || name.includes("dímero"))
      return { color: "bg-blue-400", label: "Tubo Azul (Citrato)" };
    if (
      name.includes("glicemia") ||
      name.includes("ureia") ||
      name.includes("creatinina") ||
      name.includes("sódio") ||
      name.includes("potássio") ||
      name.includes("cálcio") ||
      name.includes("magnésio") ||
      name.includes("pcr") ||
      name.includes("troponina") ||
      name.includes("ck-mb") ||
      name.includes("cpk") ||
      name.includes("tgo") ||
      name.includes("tgp") ||
      name.includes("amilase") ||
      name.includes("lipase") ||
      name.includes("bilirrubina")
    )
      return { color: "bg-yellow-500", label: "Tubo Amarelo (Gel)" };
    if (
      name.includes("urina") ||
      name.includes("eas") ||
      name.includes("urocultura")
    )
      return { color: "bg-amber-700", label: "Pote Estéril (Urina)" };
    if (name.includes("fezes") || name.includes("copro"))
      return { color: "bg-amber-900", label: "Pote Coletor (Fezes)" };
    if (name.includes("teste rápido") || name.includes("sorologia"))
      return { color: "bg-red-500", label: "Tubo Vermelho (Soro)" };
    if (name.includes("cultura"))
      return { color: "bg-emerald-600", label: "Frasco Hemocultura" };
    return null;
  };

  const renderExamCard = (item: { patient: Patient; exam: ExamRequest }) => {
    const overdue =
      item.exam.status !== "completed" && isOverdue(item.exam.deadline);

    return (
      <Card
        key={item.exam.id}
        className={cn(
          "p-4 glass-card border transition-all shadow-sm group relative overflow-hidden",
          item.exam.isCritical
            ? "border-red-500/50"
            : overdue
              ? "border-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-red-500/5"
              : "border-white/20 dark:border-white/10 hover:border-purple-500/30",
        )}
      >
        {overdue && (
          <div className="absolute top-0 right-0 w-full h-1 bg-red-500 animate-pulse" />
        )}
        <div className="flex justify-between items-start mb-2">
          <div>
            <Badge
              className={`border-none text-[9px] uppercase font-bold tracking-widest ${item.exam.type === "lab" ? "bg-purple-500/10 text-purple-600" : "bg-teal-500/10 text-teal-600"}`}
            >
              {item.exam.type === "lab" ? "Laboratório" : "Imagem"}
            </Badge>
            <h4 className="font-bold text-sm mt-1">{item.exam.name}</h4>
            {item.exam.type === "lab" &&
              item.exam.status === "pending_collection" &&
              (() => {
                const tube = getTubeColor(item.exam.name);
                if (!tube) return null;
                return (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${tube.color} shadow-sm border border-black/10`}
                    />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      {tube.label}
                    </span>
                  </div>
                );
              })()}
          </div>
          {item.exam.priority === "urgent" && (
            <Badge className="bg-red-500 text-white border-none shadow-sm text-[9px] animate-pulse">
              URGENTE
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">
          {item.patient.name}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold">
          <Clock className="w-3 h-3" />
          {new Date(item.exam.requestedAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          <SlaTimer deadline={item.exam.deadline} />
        </div>

        <div className="mt-4 flex gap-2">
          {item.exam.status === "pending_collection" && (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2">
                <Button
                  className="flex-1 h-8 text-[9px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() =>
                    handleStatusChange(
                      item.patient.id,
                      item.exam.id,
                      "in_analysis",
                      item.exam.type,
                    )
                  }
                >
                  Análise
                </Button>
                <Button
                  className="flex-1 h-8 text-[9px] font-black uppercase tracking-widest bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setPrintExam(item)}
                >
                  <Printer className="w-3 h-3 mr-1" /> Etiqueta
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full h-8 text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 border-red-500/20 hover:bg-red-500/10"
                onClick={() =>
                  recollectExam(
                    item.patient.id,
                    item.exam.id,
                    "Amostra inviável / Coleta inadequada",
                  )
                }
              >
                <XCircle className="w-3 h-3 mr-1" /> Rejeitar
              </Button>
            </div>
          )}
          {item.exam.status === "in_analysis" && (
            <div className="flex flex-col gap-2 w-full">
              <Button
                className="w-full h-8 text-[10px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setSelectedExam(item)}
              >
                Concluir & Laudar
              </Button>
              <Button
                variant="outline"
                className="w-full h-8 text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 border-red-500/20 hover:bg-red-500/10"
                onClick={() =>
                  recollectExam(
                    item.patient.id,
                    item.exam.id,
                    "Falha na análise / Amostra insuficiente",
                  )
                }
              >
                <XCircle className="w-3 h-3 mr-1" /> Rejeitar Amostra
              </Button>
            </div>
          )}
          {item.exam.status === "completed" && (
            <div className="w-full flex flex-col gap-2">
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 rounded-md p-2 border border-emerald-500/20 text-center uppercase tracking-widest">
                Laudo Enviado
              </div>
              {item.exam.isCritical && (
                <div className="text-[10px] font-black text-red-600 bg-red-500/20 rounded-md p-2 border border-red-500/30 text-center uppercase animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  VALOR CRÍTICO
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {collectorMode && (
        <CollectorMode
          pendingExams={pendingExams}
          onExit={() => setCollectorMode(false)}
          onConfirmCollection={(pId, eId, type) =>
            handleStatusChange(pId, eId, "in_analysis", type)
          }
        />
      )}
      <header className="mb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
            <FlaskConical className="h-5 w-5" />
          </div>
          <Badge
            variant="outline"
            className="text-[9px] font-black uppercase tracking-widest text-purple-600 border-purple-500/20"
          >
            Apoio Diagnóstico
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase mt-4">
              Laboratório & Imagem
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              Gestão de pedidos de exames e emissão de laudos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setCollectorMode(true)}
              className="font-bold text-xs uppercase tracking-widest gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-500/20"
            >
              Ativar Modo Coletor
            </Button>
            <Button
              onClick={() => setShowHistory(true)}
              variant="outline"
              className="font-bold text-xs uppercase tracking-widest gap-2 bg-background/50 backdrop-blur-sm border-white/20"
            >
              <History className="w-4 h-4" /> Arquivo Morto
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-4 glass-card border-white/20 dark:border-white/5 flex items-center gap-6 overflow-hidden relative min-h-[140px]">
          <div className="flex-1 min-w-0 pl-2 relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
              Produtividade Hoje
            </h3>
            <div className="text-5xl font-black tracking-tighter text-foreground">
              {dashboardData.totalToday}
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1 mb-2">
              Laudos Liberados
            </p>
          </div>
          <div className="h-28 w-28 shrink-0 z-10">
            {dashboardData.totalToday > 0 ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full transform -rotate-90"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-border opacity-20"
                  />
                  {dashboardData.pieData.map((slice, i) => {
                    const total = dashboardData.pieData.reduce(
                      (acc, curr) => acc + curr.value,
                      0,
                    );
                    const prevTotal = dashboardData.pieData
                      .slice(0, i)
                      .reduce((acc, curr) => acc + curr.value, 0);
                    const percent = total > 0 ? (slice.value / total) * 100 : 0;
                    const prevPercent =
                      total > 0 ? (prevTotal / total) * 100 : 0;
                    const dashArray = `${(percent * 251.2) / 100} 251.2`;
                    const dashOffset = -((prevPercent * 251.2) / 100);
                    return (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={slice.color}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                        className="transition-all duration-1000"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black">
                    {dashboardData.totalToday}
                  </span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">
                    Total
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center rounded-full border-4 border-dashed border-border text-muted-foreground text-[10px] font-bold text-center uppercase">
                Sem
                <br />
                dados
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5 glass-card border-white/20 dark:border-white/5 relative overflow-hidden flex flex-col justify-center min-h-[140px]">
          <div className="absolute top-1/2 -translate-y-1/2 right-0 p-4 opacity-[0.03]">
            <Clock className="w-32 h-32" />
          </div>

          <div className="relative z-10 w-full">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
              Turnaround Time (TAT)
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
                    Sangue / Urina
                  </span>
                </div>
                <div className="text-4xl font-black tracking-tighter text-foreground">
                  45{" "}
                  <span className="text-sm font-bold text-muted-foreground">
                    min
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">
                    Raio-X / Imagem
                  </span>
                </div>
                <div className="text-4xl font-black tracking-tighter text-foreground">
                  20{" "}
                  <span className="text-sm font-bold text-muted-foreground">
                    min
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SLA dentro da meta institucional
              </p>
            </div>
          </div>
        </Card>
      </div>

      <SearchBar onSearch={setSearchQuery} onFilter={setFilters} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-black/5 dark:bg-white/5 border border-white/10 p-1 w-full justify-start overflow-x-auto">
          <TabsTrigger
            value="all"
            className="text-[10px] font-black uppercase tracking-widest"
          >
            Todos
          </TabsTrigger>
          <TabsTrigger
            value="lab"
            className="text-[10px] font-black uppercase tracking-widest text-purple-600 data-[state=active]:bg-purple-500/10"
          >
            Análises Clínicas
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className="text-[10px] font-black uppercase tracking-widest text-teal-600 data-[state=active]:bg-teal-500/10"
          >
            Imagem
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <h3 className="font-bold uppercase tracking-wider text-sm">
                Fila de Coleta
              </h3>
              <Badge className="ml-auto bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 border-none">
                {pendingExams.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {pendingExams.map(renderExamCard)}
              {pendingExams.length === 0 && (
                <p className="text-center text-xs text-muted-foreground font-semibold py-8 uppercase tracking-widest">
                  Nenhum exame pendente
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <h3 className="font-bold uppercase tracking-wider text-sm">
                Análise Técnica
              </h3>
              <Badge className="ml-auto bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 border-none">
                {inAnalysisExams.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {inAnalysisExams.map(renderExamCard)}
              {inAnalysisExams.length === 0 && (
                <p className="text-center text-xs text-muted-foreground font-semibold py-8 uppercase tracking-widest">
                  Nenhum exame em análise
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="font-bold uppercase tracking-wider text-sm">
                Laudos Prontos
              </h3>
              <Badge className="ml-auto bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30 border-none">
                {completedExams.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {completedExams.map(renderExamCard)}
              {completedExams.length === 0 && (
                <p className="text-center text-xs text-muted-foreground font-semibold py-8 uppercase tracking-widest">
                  Nenhum laudo liberado
                </p>
              )}
            </div>
          </div>
        </div>
      </Tabs>

      {selectedExam && (
        <LabResultModal
          open={true}
          onClose={() => setSelectedExam(null)}
          patientId={selectedExam.patient.id}
          exam={selectedExam.exam}
        />
      )}

      {printExam && (
        <PrintLabelModal
          open={true}
          onClose={() => setPrintExam(null)}
          patient={printExam.patient}
          exam={printExam.exam}
        />
      )}

      {showHistory && (
        <ExamHistoryModal
          open={showHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
