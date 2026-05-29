import React, { useState, useMemo } from "react";
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  Activity, 
  X,
  Heart,
  Wind,
  Brain,
  ClipboardList,
  Thermometer,
  ShieldAlert,
  Bone,
  Pill,
  Stethoscope
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CID10_DATABASE, CID10Item } from "@/data/cid10";
import { cn } from "@/lib/utils";

interface SmartCidSelectorProps {
  selectedCid: CID10Item | null;
  onSelectCid: (cid: CID10Item | null) => void;
}

interface CategoryMeta {
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  bgGradient: string;
  borderClass: string;
  glowClass: string;
  iconColor: string;
  inactiveBg: string;
  inactiveBorder: string;
  inactiveIconColor: string;
  hoverBg: string;
  hoverBorder: string;
  hoverIconColor: string;
}

// Dynamic medical visual metadata mapping using Lucide React icons styled inside premium glassy containers
function getCategoryMeta(category: string): CategoryMeta {
  switch (category) {
    case "Cardiovascular":
      return { 
        icon: Heart, 
        description: "Doenças cardíacas, hipertensão e vasos",
        color: "#ef4444",
        bgGradient: "from-red-500/20 to-rose-500/5 dark:from-red-500/25 dark:to-rose-500/10",
        borderClass: "border-red-500/30 dark:border-red-500/20",
        glowClass: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
        iconColor: "text-red-500 dark:text-red-400",
        inactiveBg: "bg-red-500/[0.03] dark:bg-red-500/[0.06]",
        inactiveBorder: "border-red-500/10 dark:border-red-500/10",
        inactiveIconColor: "text-red-500/40 dark:text-red-400/40",
        hoverBg: "hover:bg-red-500/[0.08] dark:hover:bg-red-500/[0.12]",
        hoverBorder: "hover:border-red-500/25 dark:hover:border-red-500/20",
        hoverIconColor: "group-hover:text-red-500 dark:group-hover:text-red-400"
      };
    case "Gastrointestinal":
      return { 
        icon: Pill, 
        description: "Estômago, fígado, vesícula e intestinos",
        color: "#10b981",
        bgGradient: "from-emerald-500/20 to-teal-500/5 dark:from-emerald-500/25 dark:to-teal-500/10",
        borderClass: "border-emerald-500/30 dark:border-emerald-500/20",
        glowClass: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
        iconColor: "text-emerald-500 dark:text-emerald-400",
        inactiveBg: "bg-emerald-500/[0.03] dark:bg-emerald-500/[0.06]",
        inactiveBorder: "border-emerald-500/10 dark:border-emerald-500/10",
        inactiveIconColor: "text-emerald-500/40 dark:text-emerald-400/40",
        hoverBg: "hover:bg-emerald-500/[0.08] dark:hover:bg-emerald-500/[0.12]",
        hoverBorder: "hover:border-emerald-500/25 dark:hover:border-emerald-500/20",
        hoverIconColor: "group-hover:text-emerald-500 dark:group-hover:text-emerald-400"
      };
    case "Geral/Outros":
      return { 
        icon: Stethoscope, 
        description: "Virose, exames, check-ups e profilaxia",
        color: "#3b82f6",
        bgGradient: "from-blue-500/20 to-indigo-500/5 dark:from-blue-500/25 dark:to-indigo-500/10",
        borderClass: "border-blue-500/30 dark:border-blue-500/20",
        glowClass: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
        iconColor: "text-blue-500 dark:text-blue-400",
        inactiveBg: "bg-blue-500/[0.03] dark:bg-blue-500/[0.06]",
        inactiveBorder: "border-blue-500/10 dark:border-blue-500/10",
        inactiveIconColor: "text-blue-500/40 dark:text-blue-400/40",
        hoverBg: "hover:bg-blue-500/[0.08] dark:hover:bg-blue-500/[0.12]",
        hoverBorder: "hover:border-blue-500/25 dark:hover:border-blue-500/20",
        hoverIconColor: "group-hover:text-blue-500 dark:group-hover:text-blue-400"
      };
    case "Psiquiatria/Geral":
      return { 
        icon: Brain, 
        description: "Saúde mental, ansiedade, depressão e sono",
        color: "#a855f7",
        bgGradient: "from-purple-500/20 to-fuchsia-500/5 dark:from-purple-500/25 dark:to-fuchsia-500/10",
        borderClass: "border-purple-500/30 dark:border-purple-500/20",
        glowClass: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
        iconColor: "text-purple-500 dark:text-purple-400",
        inactiveBg: "bg-purple-500/[0.03] dark:bg-purple-500/[0.06]",
        inactiveBorder: "border-purple-500/10 dark:border-purple-500/10",
        inactiveIconColor: "text-purple-500/40 dark:text-purple-400/40",
        hoverBg: "hover:bg-purple-500/[0.08] dark:hover:bg-purple-500/[0.12]",
        hoverBorder: "hover:border-purple-500/25 dark:hover:border-purple-500/20",
        hoverIconColor: "group-hover:text-purple-500 dark:group-hover:text-purple-400"
      };
    case "Respiratório":
      return { 
        icon: Wind, 
        description: "Gripe, asma, pneumonia e vias aéreas",
        color: "#06b6d4",
        bgGradient: "from-cyan-500/20 to-sky-500/5 dark:from-cyan-500/25 dark:to-sky-500/10",
        borderClass: "border-cyan-500/30 dark:border-cyan-500/20",
        glowClass: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
        iconColor: "text-cyan-500 dark:text-cyan-400",
        inactiveBg: "bg-cyan-500/[0.03] dark:bg-cyan-500/[0.06]",
        inactiveBorder: "border-cyan-500/10 dark:border-cyan-500/10",
        inactiveIconColor: "text-cyan-500/40 dark:text-cyan-400/40",
        hoverBg: "hover:bg-cyan-500/[0.08] dark:hover:bg-cyan-500/[0.12]",
        hoverBorder: "hover:border-cyan-500/25 dark:hover:border-cyan-500/20",
        hoverIconColor: "group-hover:text-cyan-500 dark:group-hover:text-cyan-400"
      };
    case "Sintomas Gerais":
      return { 
        icon: Thermometer, 
        description: "Febre, dores, tontura, náusea e mal-estar",
        color: "#f59e0b",
        bgGradient: "from-amber-500/20 to-orange-500/5 dark:from-amber-500/25 dark:to-orange-500/10",
        borderClass: "border-amber-500/30 dark:border-amber-500/20",
        glowClass: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
        iconColor: "text-amber-500 dark:text-amber-400",
        inactiveBg: "bg-amber-500/[0.03] dark:bg-amber-500/[0.06]",
        inactiveBorder: "border-amber-500/10 dark:border-amber-500/10",
        inactiveIconColor: "text-amber-500/40 dark:text-amber-400/40",
        hoverBg: "hover:bg-amber-500/[0.08] dark:hover:bg-amber-500/[0.12]",
        hoverBorder: "hover:border-amber-500/25 dark:hover:border-amber-500/20",
        hoverIconColor: "group-hover:text-amber-500 dark:group-hover:text-amber-400"
      };
    case "Trauma / Causas Externas":
      return { 
        icon: ShieldAlert, 
        description: "Acidentes, queimaduras e lesões",
        color: "#ef4444",
        bgGradient: "from-red-500/20 to-orange-500/5 dark:from-red-500/25 dark:to-orange-500/10",
        borderClass: "border-red-500/30 dark:border-red-500/20",
        glowClass: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
        iconColor: "text-red-500 dark:text-red-400",
        inactiveBg: "bg-red-500/[0.03] dark:bg-red-500/[0.06]",
        inactiveBorder: "border-red-500/10 dark:border-red-500/10",
        inactiveIconColor: "text-red-500/40 dark:text-red-400/40",
        hoverBg: "hover:bg-red-500/[0.08] dark:hover:bg-red-500/[0.12]",
        hoverBorder: "hover:border-red-500/25 dark:hover:border-red-500/20",
        hoverIconColor: "group-hover:text-red-500 dark:group-hover:text-red-400"
      };
    case "Trauma / Externas":
      return { 
        icon: Bone, 
        description: "Fraturas, entorses, mialgias e traumas",
        color: "#64748b",
        bgGradient: "from-slate-500/20 to-zinc-500/5 dark:from-slate-500/25 dark:to-zinc-500/10",
        borderClass: "border-slate-500/30 dark:border-slate-500/20",
        glowClass: "shadow-[0_0_15px_rgba(100,116,139,0.15)]",
        iconColor: "text-slate-500 dark:text-slate-400",
        inactiveBg: "bg-slate-500/[0.03] dark:bg-slate-500/[0.06]",
        inactiveBorder: "border-slate-500/10 dark:border-slate-500/10",
        inactiveIconColor: "text-slate-500/40 dark:text-slate-400/40",
        hoverBg: "hover:bg-slate-500/[0.08] dark:hover:bg-slate-500/[0.12]",
        hoverBorder: "hover:border-slate-500/25 dark:hover:border-slate-500/20",
        hoverIconColor: "group-hover:text-slate-500 dark:group-hover:text-slate-400"
      };
    default:
      return { 
        icon: ClipboardList, 
        description: "Consultas e diagnósticos gerais",
        color: "#0ea5e9",
        bgGradient: "from-sky-500/20 to-blue-500/5 dark:from-sky-500/25 dark:to-blue-500/10",
        borderClass: "border-sky-500/30 dark:border-sky-500/20",
        glowClass: "shadow-[0_0_15px_rgba(14,165,233,0.15)]",
        iconColor: "text-sky-500 dark:text-sky-400",
        inactiveBg: "bg-sky-500/[0.03] dark:bg-sky-500/[0.06]",
        inactiveBorder: "border-sky-500/10 dark:border-sky-500/10",
        inactiveIconColor: "text-sky-500/40 dark:text-sky-400/40",
        hoverBg: "hover:bg-sky-500/[0.08] dark:hover:bg-sky-500/[0.12]",
        hoverBorder: "hover:border-sky-500/25 dark:hover:border-sky-500/20",
        hoverIconColor: "group-hover:text-sky-500 dark:group-hover:text-sky-400"
      };
  }
}

export function SmartCidSelector({ selectedCid, onSelectCid }: SmartCidSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(CID10_DATABASE.map(item => item.category));
    return Array.from(cats).sort();
  }, []);

  const [activeTab, setActiveTab] = useState<string>(categories[0] || "");

  const filteredItems = useMemo(() => {
    if (!search.trim()) return [];
    const lowerSearch = search.toLowerCase();
    return CID10_DATABASE.filter(item => 
      item.searchTerms.includes(lowerSearch) || 
      item.code.toLowerCase().includes(lowerSearch) || 
      item.name.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  const getItemsByCategory = (cat: string) => {
    return CID10_DATABASE.filter(item => item.category === cat);
  };

  const handleSelect = (item: CID10Item) => {
    onSelectCid(item);
    setOpen(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full h-13 px-4.5 rounded-2xl border border-white/50 dark:border-white/10 bg-white/45 dark:bg-slate-900/45 backdrop-blur-md text-left flex items-center justify-between hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:scale-[1.005] group"
        >
          {selectedCid ? (
            <div className="flex items-center gap-2.5 truncate">
              <span className="font-extrabold text-xs uppercase tracking-wider px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-sm shrink-0">
                {selectedCid.code}
              </span>
              <span className="text-sm font-semibold text-foreground truncate">{selectedCid.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Search className="w-4.5 h-4.5 text-muted-foreground/50 group-hover:text-primary transition-colors duration-300" />
              <span className="text-sm font-medium">Buscar e selecionar CID-10...</span>
            </div>
          )}
          {selectedCid ? (
            <div 
              role="button"
              className="p-1.5 hover:bg-red-500/10 dark:hover:bg-red-500/20 text-muted-foreground hover:text-red-500 rounded-lg z-10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCid(null);
              }}
            >
              <X className="w-4 h-4" />
            </div>
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors duration-300" />
          )}
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden flex flex-col h-[85vh] sm:h-[600px] rounded-2xl glass-card-premium border border-white/40 dark:border-white/10 bg-transparent shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
        <DialogHeader className="p-5 border-b border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
          <DialogTitle className="text-lg font-black uppercase tracking-wider flex items-center gap-2 text-foreground">
            <Activity className="w-5.5 h-5.5 text-primary animate-pulse" />
            Diagnóstico / CID-10
          </DialogTitle>
          <div className="relative mt-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Digite o código ou nome da doença (ex: Hipertensão, I10)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-slate-800/60 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm text-foreground placeholder-muted-foreground/75"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-row bg-white/5 dark:bg-slate-950/5">
          {search.trim() ? (
            <div className="flex-1 overflow-hidden bg-white/10 dark:bg-slate-950/10 backdrop-blur-sm">
              <ScrollArea className="h-full">
                <div className="p-3.5 space-y-1.5 pb-8">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <button
                        key={item.code}
                        onClick={() => handleSelect(item)}
                        className="w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between border border-transparent hover:border-white/35 dark:hover:border-slate-800/40 hover:bg-white/45 dark:hover:bg-slate-900/45 text-foreground hover:shadow-[0_10px_20px_-8px_rgba(0,0,0,0.04)] group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all duration-300 shadow-sm shrink-0">
                            {item.code}
                          </span>
                          <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors duration-300">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground bg-white/40 dark:bg-slate-800/40 px-2.5 py-1 rounded-full border border-border/40">
                            {item.category}
                          </span>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-muted/40 opacity-0 group-hover:opacity-100 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-16 text-muted-foreground flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center border border-dashed border-muted-foreground/30">
                        <Search className="w-5 h-5 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm font-medium">Nenhum resultado encontrado para "{search}".</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <>
              {/* Left Column: Category Sidebar with Premium Interactive Glassmorphic Icon Buttons */}
              <div className="w-[325px] shrink-0 border-r border-white/20 dark:border-white/5 flex flex-col bg-white/20 dark:bg-slate-950/20 backdrop-blur-md">
                <ScrollArea className="flex-1">
                  <div className="flex flex-col gap-2.5 p-4 w-full">
                    {categories.map(cat => {
                      const { 
                        icon: CategoryIcon, 
                        description, 
                        color, 
                        bgGradient, 
                        borderClass, 
                        glowClass, 
                        iconColor,
                        inactiveBg,
                        inactiveBorder,
                        inactiveIconColor,
                        hoverBg,
                        hoverBorder,
                        hoverIconColor
                      } = getCategoryMeta(cat);
                      const isActive = activeTab === cat;
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setActiveTab(cat)}
                          className={cn(
                            "w-full p-3.5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden",
                            isActive
                              ? "bg-white/75 dark:bg-slate-900/80 border-primary text-primary shadow-[0_15px_30px_-10px_rgba(0,102,153,0.15)] dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)] z-10 scale-[1.01]"
                              : cn(
                                  "bg-white/20 dark:bg-slate-900/20 border-white/25 dark:border-slate-800/15 text-foreground/80",
                                  inactiveBg,
                                  inactiveBorder,
                                  hoverBg,
                                  hoverBorder
                                )
                          )}
                        >
                          {/* Active Indicating Glowing Line */}
                          {isActive && (
                            <span 
                              className="absolute left-0 top-3.5 bottom-3.5 w-1 rounded-r-full shadow-lg"
                              style={{ 
                                backgroundColor: color,
                                boxShadow: `0 0 10px ${color}`
                              }}
                            />
                          )}

                          {/* Glossy / 3D Specular Glass Icon Container */}
                          <div className={cn(
                            "relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 overflow-hidden border shadow-sm",
                            isActive 
                              ? `bg-gradient-to-br ${bgGradient} ${borderClass} ${glowClass} scale-110 rotate-3` 
                              : cn(
                                  "bg-white/40 dark:bg-slate-800/10 border-white/50 dark:border-white/5",
                                  inactiveBorder
                                )
                          )}>
                            {/* Specular Diagonal Reflection Glare */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none rounded-xl" />
                            
                            <CategoryIcon className={cn(
                              "w-5 h-5 transition-all duration-500",
                              isActive 
                                ? `${iconColor} scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]` 
                                : `${inactiveIconColor} ${hoverIconColor} group-hover:scale-110`
                            )} />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-center leading-tight">
                            <span className={cn(
                              "font-black text-[11px] uppercase tracking-wider text-left truncate w-full transition-colors duration-300",
                              isActive ? "text-primary" : "text-foreground/80"
                            )}>
                              {cat}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 text-left font-normal normal-case line-clamp-2 leading-tight">
                              {description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Right Column: Diagnosis List matching the active category with glossy layout items */}
              <div className="flex-1 overflow-hidden bg-white/10 dark:bg-slate-950/10 backdrop-blur-sm">
                <ScrollArea className="h-full">
                  <div className="p-3.5 space-y-1.5 pb-8">
                    {getItemsByCategory(activeTab).map(item => (
                      <button
                        key={item.code}
                        onClick={() => handleSelect(item)}
                        className="w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between border border-transparent hover:border-white/35 dark:hover:border-slate-800/40 hover:bg-white/45 dark:hover:bg-slate-900/45 text-foreground hover:shadow-[0_10px_20px_-8px_rgba(0,0,0,0.04)] group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all duration-300 shadow-sm shrink-0">
                            {item.code}
                          </span>
                          <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors duration-300">
                            {item.name}
                          </span>
                        </div>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-muted/40 opacity-0 group-hover:opacity-100 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
