import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePatientsContext } from "@/context/PatientsContext";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Image as ImageIcon } from "lucide-react";

interface ExamHistoryModalProps {
  open: boolean;
  onClose: () => void;
}

export function ExamHistoryModal({ open, onClose }: ExamHistoryModalProps) {
  const { patients } = usePatientsContext();
  const [search, setSearch] = useState("");

  const completedExams = useMemo(() => {
    return patients
      .flatMap((p) =>
        (p.exams || [])
          .filter((e) => e.status === "completed")
          .map((e) => ({ patient: p, exam: e })),
      )
      .sort(
        (a, b) =>
          new Date(b.exam.releasedAt || 0).getTime() -
          new Date(a.exam.releasedAt || 0).getTime(),
      );
  }, [patients]);

  const filteredExams = useMemo(() => {
    return completedExams.filter(({ patient, exam }) => {
      const lowerSearch = search.toLowerCase();
      return (
        patient.name.toLowerCase().includes(lowerSearch) ||
        exam.name.toLowerCase().includes(lowerSearch) ||
        patient.ticket?.toLowerCase().includes(lowerSearch)
      );
    });
  }, [completedExams, search]);

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        if (!openState) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[800px] rounded-[2rem] p-6 glass-card-premium h-[80vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-black uppercase tracking-tight text-foreground">
            Histórico de Laudos (Arquivo Morto)
          </DialogTitle>
          <DialogDescription>
            Lista de todos os exames já laudados e finalizados no sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 shrink-0">
          <Input
            placeholder="Buscar por paciente, exame ou ticket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/50"
          />
        </div>

        <ScrollArea className="flex-1 mt-4 rounded-xl border border-white/10 p-4">
          {filteredExams.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-medium uppercase tracking-widest">
              Nenhum laudo encontrado
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExams.map(({ patient, exam }) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-xl border border-white/5 bg-black/5 dark:bg-white/5 flex flex-col gap-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-[9px] uppercase font-bold tracking-widest ${exam.type === "lab" ? "bg-purple-500/10 text-purple-600" : "bg-teal-500/10 text-teal-600"}`}
                        >
                          {exam.type === "lab" ? "Lab" : "Imagem"}
                        </Badge>
                        <h4 className="font-bold text-sm">{exam.name}</h4>
                        {exam.isCritical && (
                          <Badge className="bg-red-500/20 text-red-600 border-none text-[9px] animate-pulse">
                            VALOR CRÍTICO
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 font-semibold uppercase">
                        {patient.name}{" "}
                        <span className="text-zinc-500">
                          | TICKET: {patient.ticket}
                        </span>
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        Liberado em:{" "}
                        {exam.releasedAt
                          ? format(
                              new Date(exam.releasedAt),
                              "dd 'de' MMMM 'às' HH:mm",
                              { locale: ptBR },
                            )
                          : "N/D"}
                      </p>
                    </div>
                    <div className="max-w-[300px] w-full bg-background p-2 rounded-lg border border-border text-xs text-zinc-600 dark:text-zinc-400 max-h-[60px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {exam.result || "Sem laudo registrado."}
                    </div>
                  </div>
                  {exam.attachmentUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-[10px] uppercase font-bold tracking-widest text-blue-500 border-blue-500/20 hover:bg-blue-500/10 flex items-center justify-center gap-2"
                      onClick={() => window.open(exam.attachmentUrl, "_blank")}
                    >
                      <ImageIcon className="w-4 h-4" /> Visualizar Anexo
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end pt-4 shrink-0">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-10 text-[10px] font-bold uppercase tracking-widest"
          >
            Fechar Histórico
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
