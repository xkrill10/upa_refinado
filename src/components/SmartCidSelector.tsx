import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Activity, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CID10_DATABASE, CID10Item } from "@/data/cid10";
import { cn } from "@/lib/utils";

interface SmartCidSelectorProps {
  selectedCid: CID10Item | null;
  onSelectCid: (cid: CID10Item | null) => void;
}

// Function to return medical emojis and description subtitles for CID-10 categories
function getCategoryMeta(category: string) {
  switch (category) {
    case "Cardiovascular":
      return { emoji: "🫀", description: "Doenças cardíacas, hipertensão e vasos" };
    case "Gastrointestinal":
      return { emoji: "🍏", description: "Estômago, fígado, vesícula e intestinos" };
    case "Geral/Outros":
      return { emoji: "📋", description: "Virose, exames, check-ups e profilaxia" };
    case "Psiquiatria/Geral":
      return { emoji: "🧠", description: "Saúde mental, ansiedade, depressão e sono" };
    case "Respiratório":
      return { emoji: "🫁", description: "Gripe, asma, pneumonia e vias aéreas" };
    case "Sintomas Gerais":
      return { emoji: "🤒", description: "Febre, dores, tontura, náusea e mal-estar" };
    case "Trauma / Causas Externas":
      return { emoji: "🩹", description: "Acidentes, queimaduras e lesões" };
    case "Trauma / Externas":
      return { emoji: "🦴", description: "Fraturas, entorses, mialgias e traumas" };
    default:
      return { emoji: "🩺", description: "Consultas e diagnósticos gerais" };
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
          className="w-full h-12 px-4 rounded-xl border border-border bg-background/40 dark:bg-background/20 backdrop-blur-md text-left flex items-center justify-between hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
        >
          {selectedCid ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-primary">{selectedCid.code}</span>
              <span className="text-foreground truncate">{selectedCid.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">
              Buscar e selecionar CID-10...
            </span>
          )}
          {selectedCid ? (
            <div 
              role="button"
              className="p-1 hover:bg-muted rounded-md z-10"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCid(null);
              }}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </div>
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
          )}
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden flex flex-col h-[85vh] sm:h-[600px] rounded-2xl glass-card-premium border border-white/40 dark:border-white/10 bg-transparent shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
        <DialogHeader className="p-4 border-b border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
          <DialogTitle className="text-lg font-black uppercase tracking-wider flex items-center gap-2 text-foreground">
            <Activity className="w-5 h-5 text-primary" />
            Diagnóstico / CID-10
          </DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Digite o código ou nome da doença (ex: Hipertensão, I10)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-lg bg-white/30 dark:bg-slate-900/30 border border-white/30 dark:border-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm text-foreground placeholder-muted-foreground"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-row">
          {search.trim() ? (
            <div className="flex-1 overflow-hidden bg-white/10 dark:bg-slate-950/10 backdrop-blur-sm">
              <ScrollArea className="h-full">
                <div className="p-3 space-y-1 pb-6">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <button
                        key={item.code}
                        onClick={() => handleSelect(item)}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 border border-transparent hover:border-white/30 dark:hover:border-slate-800/40 text-foreground"
                      >
                        <span className="font-bold text-primary w-14 shrink-0">{item.code}</span>
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider sm:ml-auto shrink-0 bg-muted px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <p className="text-sm">Nenhum resultado encontrado para "{search}".</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <>
              {/* Coluna Esquerda: Menu Lateral de Categorias */}
              <div className="w-[320px] shrink-0 border-r border-white/20 dark:border-white/5 flex flex-col bg-white/20 dark:bg-slate-950/20 backdrop-blur-md">
                <ScrollArea className="flex-1">
                  <div className="flex flex-col gap-2 p-3 w-full">
                    {categories.map(cat => {
                      const { emoji, description } = getCategoryMeta(cat);
                      const isActive = activeTab === cat;
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setActiveTab(cat)}
                          className={cn(
                            "w-full p-3 rounded-xl border text-left flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.01] hover:bg-white/40 dark:hover:bg-slate-800/40",
                            isActive
                              ? "bg-primary/10 dark:bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                              : "bg-white/40 dark:bg-slate-900/40 border-white/40 dark:border-slate-800/40 text-foreground/80 hover:border-primary/30"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl transition-all shadow-sm",
                            isActive ? "bg-primary text-white" : "bg-primary/10 dark:bg-primary/15 text-primary"
                          )}>
                            <span>{emoji}</span>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center leading-tight">
                            <span className={cn(
                              "font-black text-xs uppercase tracking-wider text-left truncate w-full",
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

              {/* Coluna Direita: Lista de Diagnósticos da Categoria Ativa */}
              <div className="flex-1 overflow-hidden bg-white/10 dark:bg-slate-950/10 backdrop-blur-sm">
                <ScrollArea className="h-full">
                  <div className="p-3 space-y-1 pb-6">
                    {getItemsByCategory(activeTab).map(item => (
                      <button
                        key={item.code}
                        onClick={() => handleSelect(item)}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors flex items-center gap-3 border border-transparent hover:border-white/30 dark:hover:border-slate-800/40 text-foreground"
                      >
                        <span className="font-bold text-primary w-14 shrink-0">{item.code}</span>
                        <span className="text-sm font-medium">{item.name}</span>
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
