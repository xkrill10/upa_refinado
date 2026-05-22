import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Activity, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CID10_DATABASE, CID10Item } from "@/data/cid10";

interface SmartCidSelectorProps {
  selectedCid: CID10Item | null;
  onSelectCid: (cid: CID10Item | null) => void;
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
          className="w-full h-12 px-4 rounded-xl border border-input bg-background/50 text-left flex items-center justify-between hover:border-primary/50 transition-colors"
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
      
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden flex flex-col h-[85vh] sm:h-[600px]">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
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
              className="w-full h-10 pl-9 pr-4 rounded-lg bg-muted/50 border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-background">
          {search.trim() ? (
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <button
                      key={item.code}
                      onClick={() => handleSelect(item)}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted/60 transition-colors flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
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
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="px-4 pt-2 border-b">
                <ScrollArea className="w-full pb-2">
                  <TabsList className="h-10 bg-transparent p-0 flex justify-start w-max space-x-2">
                    {categories.map(cat => (
                      <TabsTrigger 
                        key={cat} 
                        value={cat}
                        className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-4 border border-transparent data-[state=active]:border-primary/20"
                      >
                        {cat}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </ScrollArea>
              </div>
              <div className="flex-1 overflow-hidden p-2">
                {categories.map(cat => (
                  <TabsContent key={cat} value={cat} className="h-full m-0 data-[state=inactive]:hidden">
                    <ScrollArea className="h-full">
                      <div className="space-y-1 pb-4">
                        {getItemsByCategory(cat).map(item => (
                          <button
                            key={item.code}
                            onClick={() => handleSelect(item)}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted/60 transition-colors flex items-center gap-3"
                          >
                            <span className="font-bold text-primary w-14 shrink-0">{item.code}</span>
                            <span className="text-sm font-medium">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
