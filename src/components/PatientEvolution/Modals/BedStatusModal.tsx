import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShieldAlert,
  PaintBucket,
  Bed,
  ActivitySquare,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBeds, BedStatus } from "@/context/BedsContext";

interface BedStatusModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string) => void;
}

export function BedStatusModal({
  isOpen,
  onClose,
  onApply,
}: BedStatusModalProps) {
  const { beds, updateBedStatus } = useBeds();
  const [selectedBedId, setSelectedBedId] = useState<string>("");
  const [newStatus, setNewStatus] = useState<BedStatus>("maintenance");
  const [reason, setReason] = useState("");

  const selectedBed = beds.find((b) => b.id === selectedBedId);

  // Agrupar leitos por setor
  const bedsByWard = beds.reduce(
    (acc, bed) => {
      if (!acc[bed.ward]) acc[bed.ward] = [];
      acc[bed.ward].push(bed);
      return acc;
    },
    {} as Record<string, typeof beds>,
  );

  const handleUpdate = () => {
    if (!selectedBedId) return;

    updateBedStatus(selectedBedId, newStatus);

    let statusText = "";
    if (newStatus === "maintenance")
      statusText = "Aguardando Higienização / Bloqueado";
    else if (newStatus === "available") statusText = "Liberado para Uso";
    else statusText = "Ocupado";

    let descText = `- GESTÃO DE LEITOS (STATUS):\n`;
    descText += `  • Leito: ${selectedBed?.name} (${selectedBed?.room} - ${selectedBed?.ward}).\n`;
    descText += `  • Novo Status: ${statusText}.\n`;
    if (reason) {
      descText += `  • Observação/Isolamento: ${reason}.\n`;
    }

    onApply(descText);
    onClose(false);
    toast.success(`Status do leito atualizado com sucesso!`);

    // Limpar estados
    setSelectedBedId("");
    setReason("");
    setNewStatus("maintenance");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "occupied":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "maintenance":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "reserved":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "cleaning":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      default:
        return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Livre";
      case "occupied":
        return "Ocupado";
      case "maintenance":
        return "Bloqueado";
      case "reserved":
        return "Reservado";
      case "cleaning":
        return "Higienização";
      default:
        return "Desconhecido";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <PaintBucket className="h-6 w-6 text-red-500" />
            Controle de Status e Higienização
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Gestão de Giro de Leitos e Bloqueios
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 py-2 pr-2 custom-scrollbar">
          {/* Seleção de Leito */}
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase text-foreground/80">
              1. Selecione o Leito para Gerenciar
            </Label>

            <ScrollArea className="h-[200px] rounded-xl border border-border/50 bg-background/50 p-3">
              <div className="space-y-4">
                {Object.entries(bedsByWard).map(([ward, wardBeds]) => (
                  <div key={ward} className="space-y-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-black bg-muted/50"
                    >
                      Ala: {ward}
                    </Badge>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {wardBeds.map((bed) => (
                        <button
                          key={bed.id}
                          type="button"
                          onClick={() => setSelectedBedId(bed.id)}
                          className={cn(
                            "flex flex-col items-start p-2.5 rounded-lg border text-left transition-all relative overflow-hidden",
                            selectedBedId === bed.id
                              ? "bg-slate-100 dark:bg-slate-800 border-slate-400 ring-1 ring-slate-400 ring-offset-1 ring-offset-background"
                              : "bg-card hover:bg-muted/50 border-border/60 hover:border-slate-400/30",
                          )}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-xs font-black truncate max-w-[80%]">
                              {bed.name}
                            </span>
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                getStatusColor(bed.status)
                                  .split(" ")[0]
                                  .replace("text", "bg"),
                              )}
                            />
                          </div>
                          <span className="text-[9px] text-muted-foreground">
                            {bed.room}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "mt-1 text-[8px] font-bold py-0 h-4 border-none px-1",
                              getStatusColor(bed.status),
                            )}
                          >
                            {getStatusLabel(bed.status)}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Ação de Status */}
          {selectedBedId && (
            <div className="space-y-4 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-xl border border-border/50 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-2">
                <Bed className="h-5 w-5 text-muted-foreground" />
                <span className="font-bold">{selectedBed?.name}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px]",
                    getStatusColor(selectedBed?.status || ""),
                  )}
                >
                  Status Atual: {getStatusLabel(selectedBed?.status || "")}
                </Badge>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase text-foreground/80">
                  2. Definir Novo Status
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus("maintenance")}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all",
                      newStatus === "maintenance"
                        ? "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 ring-1 ring-red-500/50"
                        : "bg-background border-border/60 hover:border-red-500/30",
                    )}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Bloquear p/ Higienização
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus("available")}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all",
                      newStatus === "available"
                        ? "bg-green-500/10 border-green-500 text-green-600 dark:text-green-400 ring-1 ring-green-500/50"
                        : "bg-background border-border/60 hover:border-green-500/30",
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Liberar Leito (Limpo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus("reserved")}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all",
                      newStatus === "reserved"
                        ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/50"
                        : "bg-background border-border/60 hover:border-blue-500/30",
                    )}
                  >
                    <ActivitySquare className="h-4 w-4" />
                    Reservar Leito
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus("cleaning")}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all",
                      newStatus === "cleaning"
                        ? "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/50"
                        : "bg-background border-border/60 hover:border-orange-500/30",
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                    Higienização
                  </button>
                </div>
              </div>

              {/* Observação / Isolamento */}
              <div className="space-y-1 mt-4">
                <Label className="text-xs font-black uppercase text-foreground/80">
                  3. Tipo de Isolamento / Observação
                </Label>
                <Input
                  placeholder="Ex: Isolamento de Contato / Precaução por Gotículas..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-10 rounded-xl bg-background border-border/60"
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border/50 flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose(false)}
            className="flex-1 h-11 rounded-xl font-bold uppercase text-[10px]"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!selectedBedId}
            onClick={handleUpdate}
            className="flex-[2] h-11 rounded-xl font-bold uppercase text-[10px] bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
          >
            Atualizar Status do Leito
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
