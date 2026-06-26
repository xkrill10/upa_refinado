import { useState, useEffect } from "react";
import {
  Pill,
  Search,
  Plus,
  ArrowRight,
  PackageOpen,
  ClipboardList,
  Activity,
  ArrowDownToLine,
  ArchiveRestore,
  X,
  Check,
  Clock,
  User,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BellRing,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function SatellitePharmacy() {
  const [activeTab, setActiveTab] = useState("estoque");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [dispenseItem, setDispenseItem] = useState<{
    name: string;
    amount: number;
    unit: string;
  } | null>(null);

  const inventoryItems = [
    {
      name: "Dipirona 500mg/ml",
      amount: 120,
      unit: "Ampola",
      critical: false,
      trend: "up",
      history: [20, 30, 45, 80, 100, 115, 120],
    },
    {
      name: "Adrenalina 1mg/ml",
      amount: 8,
      unit: "Ampola",
      critical: true,
      trend: "down",
      history: [25, 25, 20, 15, 12, 10, 8],
    },
    {
      name: "Soro Fisiológico 0.9% 500ml",
      amount: 45,
      unit: "Frasco",
      critical: false,
      trend: "up",
      history: [10, 15, 22, 30, 35, 40, 45],
    },
    {
      name: "Ondansetrona 2mg/ml",
      amount: 5,
      unit: "Ampola",
      critical: true,
      trend: "down",
      history: [18, 18, 15, 10, 8, 6, 5],
    },
  ];

  const criticalItemsCount = inventoryItems.filter((i) => i.critical).length;
  const filteredInventory = inventoryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    if (criticalItemsCount > 0) {
      toast.error(
        `Atenção: Você possui ${criticalItemsCount} medicamento(s) com estoque crítico.`,
        {
          icon: <AlertTriangle className="h-4 w-4 text-rose-500" />,
        },
      );
    }
  }, [criticalItemsCount]);

  const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * 60;
        const y = 20 - ((val - min) / range) * 20;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width="60" height="24" className="overflow-visible">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="drop-shadow-[0_0_3px_currentColor]"
        />
        <polygon fill={`url(#grad-${color})`} points={`0,24 ${points} 60,24`} />
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Critical Alert Banner */}
      {criticalItemsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 mx-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 flex items-center justify-between shadow-[0_0_20px_rgba(225,29,72,0.1)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent animate-pulse" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/40 shrink-0">
              <BellRing className="h-5 w-5 text-rose-500 animate-[bounce_2s_infinite]" />
            </div>
            <div>
              <h4 className="text-rose-600 dark:text-rose-400 font-bold tracking-wide">
                Alerta de Estoque Crítico
              </h4>
              <p className="text-sm text-rose-600/80 dark:text-rose-200/80 mt-0.5">
                {criticalItemsCount} item(s) atingiram a quantidade mínima.
                Solicite ressuprimento imediato.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="h-9 px-5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-rose-500/25 relative z-10"
          >
            Solicitar Agora
          </button>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center border border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Pill className="h-7 w-7 text-sky-500 drop-shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3 mission-control-title">
              Farmácia Satélite
              <div className="px-2.5 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-[10px] uppercase tracking-widest text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500"></span>
                </span>
                Operacional
              </div>
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              Gestão de estoque avançado para setores críticos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wide transition-all shadow-lg hover:shadow-primary/25 flex items-center gap-2 group border border-transparent hover:border-foreground/10"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
            Solicitar Transferência
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex gap-4 flex-1 min-h-0 px-2 pb-2">
        {/* Sidebar Tabs */}
        <div className="w-64 flex flex-col gap-2 shrink-0">
          {[
            {
              id: "estoque",
              label: "Estoque Satélite",
              icon: PackageOpen,
              desc: "Visualizar itens no setor",
            },
            {
              id: "pedidos",
              label: "Meus Pedidos",
              icon: ClipboardList,
              desc: "Status de requisições",
            },
            {
              id: "consumo",
              label: "Consumo Beira-Leito",
              icon: Activity,
              desc: "Histórico de saídas",
            },
            {
              id: "transferencias",
              label: "Recebimentos",
              icon: ArrowDownToLine,
              desc: "Itens a receber",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-start w-full text-left p-4 rounded-xl transition-all duration-300 relative group overflow-hidden",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-sky-500/10 to-sky-500/5 border border-sky-500/30 shadow-[0_4px_20px_rgba(14,165,233,0.1)]"
                  : "bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-border",
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.8)]"
                />
              )}
              <div className="flex items-center gap-3 mb-1 relative z-10">
                <tab.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    activeTab === tab.id
                      ? "text-sky-500"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span
                  className={cn(
                    "font-bold tracking-wide transition-colors",
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {tab.label}
                </span>
              </div>
              <span
                className={cn(
                  "text-xs ml-8 relative z-10",
                  activeTab === tab.id
                    ? "text-sky-600/70 dark:text-sky-200/70"
                    : "text-muted-foreground/60",
                )}
              >
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 rounded-xl border glass-card-premium overflow-hidden flex flex-col min-w-0 shadow-lg">
          {/* Header Bar */}
          <div className="h-16 border-b border-border/50 bg-muted/30 flex items-center justify-between px-6 shrink-0">
            <h2 className="text-lg font-black tracking-wide flex items-center gap-2">
              <ArchiveRestore className="h-5 w-5 text-sky-500" />
              {activeTab === "estoque" && "Estoque Atual da Unidade"}
              {activeTab === "pedidos" && "Histórico de Solicitações"}
              {activeTab === "consumo" && "Consumo Registrado"}
              {activeTab === "transferencias" && "Transferências Pendentes"}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-64 rounded-lg bg-background/50 border border-border/50 pl-9 pr-4 text-sm focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all placeholder:text-muted-foreground/50 text-foreground font-medium"
              />
            </div>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-auto p-3 flex flex-col gap-4 custom-scrollbar">
            {activeTab === "estoque" && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                    <div className="h-12 w-12 rounded-lg bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                      <PackageOpen className="h-6 w-6 text-sky-500" />
                    </div>
                    <div>
                      <span className="text-2xl font-black text-foreground font-mono">
                        {inventoryItems.length}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest block mt-0.5">
                        Itens Diferentes
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-4 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-0 transition-opacity",
                        criticalItemsCount > 0 && "opacity-100 animate-pulse",
                      )}
                    />
                    <div className="h-12 w-12 rounded-lg bg-rose-500/20 flex items-center justify-center border border-rose-500/30 relative z-10">
                      <AlertTriangle className="h-6 w-6 text-rose-500" />
                    </div>
                    <div className="relative z-10">
                      <span className="text-2xl font-black text-foreground font-mono">
                        {criticalItemsCount}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest block mt-0.5">
                        Em Falta
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                    <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                      <Activity className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <span className="text-2xl font-black text-foreground font-mono">
                        18
                      </span>
                      <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest block mt-0.5">
                        Saídas Hoje
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {filteredInventory.map((item, i) => (
                    <div
                      key={i}
                      className="group relative flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-border transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 w-1/3">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center border shrink-0",
                            item.critical
                              ? "bg-rose-500/20 border-rose-500/30"
                              : "bg-emerald-500/20 border-emerald-500/30",
                          )}
                        >
                          <PackageOpen
                            className={cn(
                              "h-5 w-5",
                              item.critical
                                ? "text-rose-500"
                                : "text-emerald-500",
                            )}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-foreground tracking-wide block truncate">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground font-medium">
                              {item.unit}
                            </span>
                            {item.critical && (
                              <span className="text-[10px] bg-rose-500/20 text-rose-600 dark:text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30 uppercase font-bold tracking-wider">
                                Crítico
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Trend Graph */}
                      <div className="flex-1 flex flex-col items-center justify-center border-l border-r border-border/50 px-6">
                        <div className="flex items-center gap-4 w-full max-w-[200px]">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
                              Tendência 24h
                            </span>
                            <div className="flex items-center gap-1">
                              {item.trend === "up" ? (
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-rose-500" />
                              )}
                              <span
                                className={cn(
                                  "text-xs font-bold",
                                  item.trend === "up"
                                    ? "text-emerald-500"
                                    : "text-rose-500",
                                )}
                              >
                                {item.trend === "up" ? "+12%" : "-8%"}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 flex justify-end">
                            <Sparkline
                              data={item.history}
                              color={
                                item.trend === "up" ? "#10b981" : "#f43f5e"
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-1/3 justify-end pl-6">
                        <div className="flex flex-col items-end">
                          <span
                            className={cn(
                              "text-2xl font-black font-mono",
                              item.critical
                                ? "text-rose-500"
                                : "text-foreground",
                            )}
                          >
                            {item.amount}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                            Qtd.
                          </span>
                        </div>
                        <button
                          onClick={() => setDispenseItem(item)}
                          className="h-9 px-4 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 hover:border-sky-500/40 text-sky-600 dark:text-sky-400 font-bold text-sm tracking-wide flex items-center gap-2 transition-all"
                        >
                          Baixar
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "pedidos" && (
              <>
                {[
                  {
                    id: "REQ-0042",
                    date: "Hoje, 14:30",
                    items: 3,
                    status: "pending",
                  },
                  {
                    id: "REQ-0041",
                    date: "Ontem, 09:15",
                    items: 12,
                    status: "completed",
                  },
                ].map((req, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-background/50 flex items-center justify-center border border-border/50">
                        <ClipboardList className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground tracking-wide block">
                          {req.id}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {req.date} • {req.items} itens
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {req.status === "pending" ? (
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> Em Separação
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Check className="h-3 w-3" /> Finalizado
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === "consumo" && (
              <>
                {[
                  {
                    item: "Adrenalina 1mg/ml",
                    patient: "João da Silva",
                    bed: "Leito 04 (Vermelha)",
                    time: "14:15",
                  },
                  {
                    item: "Soro Fisiológico 0.9% 500ml",
                    patient: "Maria Souza",
                    bed: "Leito 02 (Amarela)",
                    time: "12:30",
                  },
                ].map((consumo, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                        <Activity className="h-5 w-5 text-rose-500" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground tracking-wide block">
                          {consumo.item}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <User className="h-3 w-3" /> {consumo.patient} •{" "}
                          {consumo.bed}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-muted-foreground font-mono">
                      {consumo.time}
                    </span>
                  </div>
                ))}
              </>
            )}

            {activeTab === "transferencias" && (
              <>
                <div className="flex items-center justify-between p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 relative overflow-hidden hover:bg-sky-500/20 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-sky-500" />
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                      <ArrowDownToLine className="h-5 w-5 text-sky-500" />
                    </div>
                    <div>
                      <span className="font-bold text-foreground tracking-wide block">
                        Malote de Reposição #229
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Origem: Farmácia Central • 14 itens
                      </span>
                    </div>
                  </div>
                  <button className="h-9 px-4 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-sky-500/25">
                    Confirmar Recebimento
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsRequestModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-card-premium border-border/50 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-border/50 flex items-center justify-between bg-muted/30">
                <h3 className="text-xl font-black tracking-wide text-foreground flex items-center gap-2">
                  <Plus className="h-5 w-5 text-sky-500" />
                  Nova Solicitação
                </h3>
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="h-8 w-8 rounded-lg hover:bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-3 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    Medicamento / Material
                  </label>
                  <input
                    type="text"
                    placeholder="Digite para buscar no estoque central..."
                    className="w-full h-11 bg-background/50 border border-border/50 rounded-xl px-4 text-sm focus:outline-none focus:border-sky-500/50 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    Quantidade Desejada
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 50"
                    className="w-full h-11 bg-background/50 border border-border/50 rounded-xl px-4 text-sm focus:outline-none focus:border-sky-500/50 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    Prioridade
                  </label>
                  <div className="flex gap-2">
                    <button className="flex-1 h-10 rounded-lg bg-muted/30 border border-border/50 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                      Normal
                    </button>
                    <button className="flex-1 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 text-sm font-bold text-rose-500 hover:bg-rose-500/20 transition-colors">
                      Urgência
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-border/50 bg-muted/10 flex justify-end gap-3">
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setIsRequestModalOpen(false);
                    toast.success("Solicitação enviada com sucesso!");
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                >
                  Enviar Pedido
                </button>
              </div>
            </motion.div>
          </>
        )}

        {dispenseItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setDispenseItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-card-premium border-border/50 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-border/50 flex items-center justify-between bg-muted/30">
                <h3 className="text-xl font-black tracking-wide text-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5 text-rose-500" />
                  Registrar Consumo
                </h3>
                <button
                  onClick={() => setDispenseItem(null)}
                  className="h-8 w-8 rounded-lg hover:bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-3 flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50 mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                    Item Selecionado
                  </span>
                  <span className="text-lg font-black text-foreground">
                    {dispenseItem.name}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    Leito / Paciente
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar paciente na fila ou leito..."
                    className="w-full h-11 bg-background/50 border border-border/50 rounded-xl px-4 text-sm focus:outline-none focus:border-sky-500/50 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    Quantidade Administrada
                  </label>
                  <input
                    type="number"
                    defaultValue="1"
                    className="w-full h-11 bg-background/50 border border-border/50 rounded-xl px-4 text-sm focus:outline-none focus:border-sky-500/50 text-foreground"
                  />
                </div>
              </div>
              <div className="p-3 border-t border-border/50 bg-muted/10 flex justify-end gap-3">
                <button
                  onClick={() => setDispenseItem(null)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setDispenseItem(null);
                    toast.success(`${dispenseItem.name} baixado com sucesso!`);
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/25"
                >
                  Confirmar Baixa
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
