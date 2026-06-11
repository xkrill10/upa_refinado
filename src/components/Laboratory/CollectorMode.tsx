import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScanLine, CheckCircle2, User, Beaker } from "lucide-react";
import { Patient, ExamRequest } from "@/context/PatientsContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CollectorModeProps {
  pendingExams: { patient: Patient; exam: ExamRequest }[];
  onConfirmCollection: (
    patientId: string,
    examId: string,
    examType: "lab" | "image",
  ) => void;
  onExit: () => void;
}

export function CollectorMode({
  pendingExams,
  onConfirmCollection,
  onExit,
}: CollectorModeProps) {
  const [ticket, setTicket] = useState("");
  const [foundExam, setFoundExam] = useState<{
    patient: Patient;
    exam: ExamRequest;
  } | null>(null);

  const handleScan = () => {
    if (!ticket.trim()) return;
    const found = pendingExams.find(
      (e) =>
        e.patient.ticket.toLowerCase() === ticket.toLowerCase() ||
        e.patient.name.toLowerCase().includes(ticket.toLowerCase()),
    );
    if (found) {
      setFoundExam(found);
      toast.success("Paciente localizado!");
    } else {
      setFoundExam(null);
      toast.error("Paciente não encontrado na fila de coleta.");
    }
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onExit();
      }}
    >
      <DialogContent className="sm:max-w-[700px] rounded-[2rem] p-8 glass-card-premium border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)] flex flex-col items-center">
        <DialogHeader className="w-full flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
            <ScanLine className="w-8 h-8" />
          </div>
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter mb-2 text-center text-foreground">
            Modo Coletor
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-semibold text-center mb-4">
            Escaneie a pulseira do paciente ou digite o ticket
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full gap-2 mt-4 mb-8">
          <Input
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            placeholder="Ex: P001 ou Nome do Paciente"
            className="h-14 text-lg text-center font-bold tracking-widest uppercase rounded-2xl bg-black/5 dark:bg-white/5 border-white/10"
            autoFocus
          />
          <Button
            onClick={handleScan}
            className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20"
          >
            Buscar
          </Button>
        </div>

        {foundExam && (
          <Card className="w-full p-6 glass-card border-blue-500/30 bg-blue-500/5 relative overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3 text-blue-500">
                  <User className="w-6 h-6" />
                  <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                    {foundExam.patient.name}
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-foreground/80">
                  <Beaker className="w-5 h-5" />
                  <span className="font-bold text-md uppercase">
                    {foundExam.exam.name}
                  </span>
                </div>
                <div className="inline-block px-3 py-1 rounded-md bg-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-widest">
                  TICKET: {foundExam.patient.ticket}
                </div>
              </div>

              <Button
                onClick={() => {
                  onConfirmCollection(
                    foundExam.patient.id,
                    foundExam.exam.id,
                    foundExam.exam.type,
                  );
                  setFoundExam(null);
                  setTicket("");
                }}
                className="h-16 w-full md:w-auto px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-black uppercase tracking-widest">
                    Confirmar Coleta
                  </span>
                </div>
              </Button>
            </div>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
