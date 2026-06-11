import React, { useState, useMemo } from "react";
import { Search, Pill, ChevronDown, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MEDICATIONS_DATABASE, MedicationItem } from "@/data/medications";
import { cn } from "@/lib/utils";

interface SmartMedicationSelectorProps {
  value: string;
  onChange: (medicationName: string) => void;
  onSelectFull?: (medication: MedicationItem) => void;
}

export function SmartMedicationSelector({
  value,
  onChange,
  onSelectFull,
}: SmartMedicationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredMedications = useMemo(() => {
    if (!search) return MEDICATIONS_DATABASE;
    const lower = search.toLowerCase();
    return MEDICATIONS_DATABASE.filter(
      (med) =>
        med.name.toLowerCase().includes(lower) ||
        med.category.toLowerCase().includes(lower) ||
        med.description.toLowerCase().includes(lower),
    );
  }, [search]);

  // Group by category for rendering
  const grouped = useMemo(() => {
    return filteredMedications.reduce(
      (acc, med) => {
        if (!acc[med.category]) acc[med.category] = [];
        acc[med.category].push(med);
        return acc;
      },
      {} as Record<string, MedicationItem[]>,
    );
  }, [filteredMedications]);

  const handleSelect = (med: MedicationItem) => {
    onChange(med.name);
    if (onSelectFull) onSelectFull(med);
    setOpen(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-8 justify-between rounded-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-left text-xs font-normal shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900"
        >
          <div className="flex items-center gap-2 truncate text-slate-700 dark:text-slate-300">
            <Pill className="h-3 w-3 shrink-0 text-emerald-500" />
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value || "Buscar..."}
            </span>
          </div>
          <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[350px] sm:w-[450px] p-0 rounded-2xl border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden [&>button]:hidden">
        <div className="flex flex-col bg-white dark:bg-slate-950">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                className="w-full h-10 pl-9 pr-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 font-medium"
                placeholder="Pesquisar por nome, categoria ou indicação..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[350px]">
            {Object.keys(grouped).length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center">
                <Pill className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-sm font-bold text-slate-500">
                  Nenhum medicamento encontrado.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Você pode digitar o nome livremente caso não esteja na lista.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-lg text-xs font-bold"
                  onClick={() => {
                    onChange(search);
                    setOpen(false);
                  }}
                >
                  Usar "{search}" mesmo assim
                </Button>
              </div>
            ) : (
              <div className="p-2">
                {Object.entries(grouped).map(([category, meds]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm z-10 px-3 py-1.5 mb-1 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {category}
                      </h4>
                    </div>
                    <div className="space-y-1">
                      {meds.map((med) => (
                        <button
                          key={med.id}
                          className="w-full text-left px-3 py-2.5 rounded-xl flex items-start gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors group"
                          onClick={() => handleSelect(med)}
                        >
                          <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-900 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 flex items-center justify-center shrink-0 transition-colors">
                            <Pill className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                              {med.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {med.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {med.routes.map((route) => (
                                <span
                                  key={route}
                                  className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                >
                                  {route}
                                </span>
                              ))}
                            </div>
                          </div>
                          {value === med.name && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-2 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
