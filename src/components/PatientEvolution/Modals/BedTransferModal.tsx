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
  ArrowRightLeft,
  BedDouble,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBeds } from "@/context/BedsContext";
import { usePatientsContext } from "@/context/PatientsContext";

interface BedTransferModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  patientId?: string;
  fugulinSummary?: string;
  onApply: (descText: string) => void;
}

export function BedTransferModal({
  isOpen,
  onClose,
  patientId,
  fugulinSummary,
  onApply,
}: BedTransferModalProps) {
  const { beds, assignPatient, transferPatient } = useBeds();
  const { patients } = usePatientsContext();
  const [selectedBedId, setSelectedBedId] = useState<string>("");
  const [reason, setReason] = useState("");

  const targetPatient = patients.find((p) => p.id === patientId);
  const patientGender = targetPatient?.gender || "";

  const currentBed = beds.find((b) => b.patientId === patientId);
  const availableBeds = beds.filter((b) => b.status === "available");

  const isBedBlockedByGender = (bedRoom: string, gender: string) => {
    if (!gender) return false;
    const roomLower = bedRoom.toLowerCase();
    const genderLower = gender.toLowerCase();

    if (roomLower.includes("feminina") || roomLower.includes("feminino")) {
      return genderLower !== "feminino" && genderLower !== "f";
    }
    if (roomLower.includes("masculina") || roomLower.includes("masculino")) {
      return genderLower !== "masculino" && genderLower !== "m";
    }
    return false;
  };

  // Agrupar leitos por setor
  const bedsByWard = availableBeds.reduce(
    (acc, bed) => {
      if (!acc[bed.ward]) acc[bed.ward] = [];
      acc[bed.ward].push(bed);
      return acc;
    },
    {} as Record<string, typeof beds>,
  );

  // Detecta se Fugulin sugere UTI/Emergência
  const isIntensive =
    fugulinSummary?.toLowerCase().includes("intensivo") ||
    fugulinSummary?.toLowerCase().includes("semi-intensivo");
  const suggestedWard = isIntensive ? "Emergência" : "Observação";

  const handleTransfer = () => {
    if (!patientId || !selectedBedId) return;

    const targetBed = beds.find((b) => b.id === selectedBedId);
    if (!targetBed) return;

    if (currentBed) {
      transferPatient(currentBed.id, selectedBedId);
    } else {
      assignPatient(selectedBedId, patientId);
    }

    const actionText = currentBed ? "Transferido do" : "Alocado no";
    const originText = currentBed
      ? ` ${currentBed.name} (${currentBed.room}) para o`
      : "";

    let descText = `- GESTÃO DE LEITOS (BED MANAGEMENT):\n`;
    descText += `  • Ação: ${actionText}${originText} ${targetBed.name} (${targetBed.room} - ${targetBed.ward}).\n`;
    if (fugulinSummary) {
      descText += `  • Classificação de Risco/Dependência: ${fugulinSummary}.\n`;
    }
    if (reason) {
      descText += `  • Motivo/Justificativa: ${reason}.\n`;
    }

    onApply(descText);
    onClose(false);
    toast.success(
      `Paciente ${currentBed ? "transferido" : "alocado"} com sucesso!`,
    );

    // Limpar estados
    setSelectedBedId("");
    setReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <ArrowRightLeft className="h-6 w-6 text-blue-500" />
            Transferência Expressa de Leito
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Alocação Privativa da Enfermagem
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 py-2 pr-2 custom-scrollbar">
          {/* Informações Atuais */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-slate-100/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
              <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">
                Leito Atual
              </p>
              <div className="flex items-center gap-2">
                <BedDouble
                  className={cn(
                    "h-5 w-5",
                    currentBed ? "text-blue-500" : "text-slate-400",
                  )}
                />
                <span className="font-bold text-foreground">
                  {currentBed
                    ? `${currentBed.name} (${currentBed.ward})`
                    : "Sem Leito Atribuído"}
                </span>
              </div>
            </div>

            {fugulinSummary && (
              <div className="flex-1 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                <p className="text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Fator de Dependência
                  (Fugulin)
                </p>
                <p className="font-bold text-sm text-orange-700 dark:text-orange-300">
                  {fugulinSummary}
                </p>
                {isIntensive && (
                  <p className="text-[10px] font-bold text-orange-600 mt-1">
                    Sugestão de Alocação: Sala Vermelha / Emergência
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Seleção de Destino */}
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase text-foreground/80">
              Selecione o Leito de Destino ({availableBeds.length} Livres)
            </Label>

            <ScrollArea className="h-[250px] rounded-xl border border-border/50 bg-background/50 p-3">
              {Object.keys(bedsByWard).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <AlertTriangle className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm font-bold">
                    Nenhum leito disponível no momento.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(bedsByWard).map(([ward, wardBeds]) => (
                    <div key={ward} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] uppercase font-black",
                            ward === suggestedWard
                              ? "border-green-500 text-green-600 bg-green-500/10"
                              : "",
                          )}
                        >
                          Ala: {ward}
                        </Badge>
                        {ward === suggestedWard && (
                          <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Recomendado
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {wardBeds.map((bed) => {
                          const isBlocked = isBedBlockedByGender(
                            bed.room,
                            patientGender,
                          );
                          return (
                            <button
                              key={bed.id}
                              type="button"
                              disabled={isBlocked}
                              onClick={() => setSelectedBedId(bed.id)}
                              title={
                                isBlocked
                                  ? `Leito restrito ao sexo ${bed.room.toLowerCase().includes("masculin") ? "Masculino" : "Feminino"}`
                                  : undefined
                              }
                              className={cn(
                                "flex flex-col items-start p-2.5 rounded-lg border text-left transition-all relative overflow-hidden",
                                isBlocked
                                  ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed grayscale"
                                  : selectedBedId === bed.id
                                    ? "bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400 ring-1 ring-blue-500 ring-offset-1 ring-offset-background"
                                    : "bg-card hover:bg-muted/50 border-border/60 hover:border-blue-500/30",
                              )}
                            >
                              <div className="flex items-center justify-between w-full gap-2">
                                <span className="text-xs font-black truncate">
                                  {bed.name}
                                </span>
                                {isBlocked && (
                                  <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                                )}
                              </div>
                              <span className="text-[9px] text-muted-foreground mt-0.5 w-full truncate flex items-center gap-1">
                                {bed.room}
                                {bed.room
                                  .toLowerCase()
                                  .includes("masculin") && (
                                  <span className="text-blue-500 font-black text-[11px] leading-none">
                                    ♂
                                  </span>
                                )}
                                {bed.room.toLowerCase().includes("feminin") && (
                                  <span className="text-pink-500 font-black text-[11px] leading-none">
                                    ♀
                                  </span>
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Motivo da Transferência */}
          <div className="space-y-1">
            <Label className="text-xs font-black uppercase text-foreground/80">
              Motivo / Conduta (Opcional)
            </Label>
            <Input
              placeholder="Ex: Piora clínica, indicação de isolamento, alta da emergência..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50"
            />
          </div>
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
            onClick={handleTransfer}
            className="flex-[2] h-11 rounded-xl font-bold uppercase text-[10px] bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
          >
            {currentBed ? "Confirmar Transferência" : "Confirmar Alocação"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
