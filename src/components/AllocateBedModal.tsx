import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bed, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBeds } from "@/context/BedsContext";
import { toast } from "sonner";
import { Patient } from "@/hooks/use-patients";

interface AllocateBedModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onAllocate: (bedId: string) => void;
}

export function AllocateBedModal({
  isOpen,
  onClose,
  patient,
  onAllocate,
}: AllocateBedModalProps) {
  const { beds } = useBeds();
  const [selectedBedId, setSelectedBedId] = useState<string>("");

  const patientGender = patient?.gender || "";

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

  // Apenas leitos disponíveis
  const availableBeds = beds.filter((b) => b.status === "available" || b.status === "cleaning");

  const bedsByWard = availableBeds.reduce(
    (acc, bed) => {
      if (!acc[bed.ward]) acc[bed.ward] = [];
      acc[bed.ward].push(bed);
      return acc;
    },
    {} as Record<string, typeof beds>
  );

  const handleConfirm = () => {
    if (!selectedBedId) return;
    onAllocate(selectedBedId);
    setSelectedBedId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-xl glass-card-premium shadow-2xl flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl flex items-center gap-2 text-[#006699] dark:text-sky-400 font-black uppercase">
            <Bed className="h-6 w-6" />
            Acomodar Paciente
          </DialogTitle>
          <DialogDescription className="font-bold text-sm text-slate-500 flex items-center">
            Selecione um leito disponível para alocar {patient?.name}
            {['feminino', 'f'].includes(patientGender) && <span className="text-pink-500 font-black ml-1 text-base leading-none">♀</span>}
            {['masculino', 'm'].includes(patientGender) && <span className="text-blue-500 font-black ml-1 text-base leading-none">♂</span>}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-2 custom-scrollbar max-h-[50vh]">
          {Object.keys(bedsByWard).length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Bed className="h-10 w-10 mb-2 opacity-50" />
              <p className="font-bold">Nenhum leito disponível no momento.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(bedsByWard).map(([ward, wardBeds]) => (
                <div key={ward} className="space-y-2">
                  <Badge variant="outline" className="text-[10px] uppercase font-black bg-slate-100 dark:bg-slate-800">
                    {ward}
                  </Badge>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {wardBeds.map((bed) => {
                      const isBlocked = isBedBlockedByGender(bed.room, patientGender);
                      return (
                      <button
                        key={bed.id}
                        type="button"
                        disabled={isBlocked}
                        title={isBlocked ? `Leito restrito ao sexo ${bed.room.toLowerCase().includes('masculin') ? 'Masculino' : 'Feminino'}` : undefined}
                        onClick={() => setSelectedBedId(bed.id)}
                        className={cn(
                          "flex flex-col items-start p-3 rounded-lg border text-left transition-all relative overflow-hidden",
                          isBlocked
                            ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed"
                            : selectedBedId === bed.id
                            ? "bg-[#006699]/10 dark:bg-sky-500/10 border-[#006699] dark:border-sky-400 ring-1 ring-[#006699] dark:ring-sky-400"
                            : bed.room.toLowerCase().includes('feminin')
                              ? "bg-pink-50/80 hover:bg-pink-100 dark:bg-pink-950/20 dark:hover:bg-pink-900/40 border-pink-200 dark:border-pink-900/50"
                              : bed.room.toLowerCase().includes('masculin')
                                ? "bg-sky-50/80 hover:bg-sky-100 dark:bg-sky-950/20 dark:hover:bg-sky-900/40 border-sky-200 dark:border-sky-900/50"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                        )}
                      >
                        <div className={cn("flex items-center justify-between w-full gap-2", isBlocked ? "text-slate-500" : "text-foreground")}>
                          <span className="text-xs font-black truncate">{bed.name}</span>
                          {isBlocked && <Lock className="h-3 w-3 text-red-400/80 shrink-0" />}
                        </div>
                        <span className={cn("text-[10px] mt-1 w-full truncate flex items-center gap-1 font-semibold", isBlocked ? "text-slate-400" : "text-muted-foreground")}>
                          {bed.room}
                          {bed.room.toLowerCase().includes('masculin') && <span className="text-blue-500 font-black text-[12px] leading-none">♂</span>}
                          {bed.room.toLowerCase().includes('feminin') && <span className="text-pink-500 font-black text-[12px] leading-none">♀</span>}
                        </span>
                        {bed.status === "cleaning" && (
                          <Badge className="mt-2 text-[8px] px-1 py-0 h-4 bg-orange-500/10 text-orange-600 border-none">
                            Higienização
                          </Badge>
                        )}
                      </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t flex justify-end gap-2 shrink-0">
          <Button variant="outline" onClick={onClose} className="rounded-xl font-bold">
            Cancelar
          </Button>
          <Button
            disabled={!selectedBedId}
            onClick={handleConfirm}
            className="rounded-xl font-bold bg-[#006699] hover:bg-[#004d73] text-white dark:bg-sky-600 dark:hover:bg-sky-700"
          >
            Confirmar Alocação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
