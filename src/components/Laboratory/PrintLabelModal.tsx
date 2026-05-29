import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import Barcode from "react-barcode";
import { Patient, ExamRequest } from "@/context/PatientsContext";

interface PrintLabelModalProps {
  open: boolean;
  onClose: () => void;
  patient: Patient;
  exam: ExamRequest;
}

export function PrintLabelModal({ open, onClose, patient, exam }: PrintLabelModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const getTubeType = (examName: string) => {
    const name = examName.toLowerCase();
    if (name.includes("hemograma") || name.includes("hba1c")) return "Tampa Roxa (EDTA)";
    if (name.includes("coagulograma") || name.includes("tap")) return "Tampa Azul (Citrato)";
    if (name.includes("glicose") || name.includes("glicemia")) return "Tampa Cinza (Fluoreto)";
    if (name.includes("urina") || name.includes("eas")) return "Pote Estéril";
    return "Tampa Vermelha/Amarela (Soro)";
  };

  return (
    <Dialog open={open} onOpenChange={(openState) => { if (!openState) onClose(); }}>
      <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-6 glass-card-premium print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        <DialogHeader className="print:hidden">
          <DialogTitle className="text-xl font-black uppercase tracking-tight text-purple-600 dark:text-purple-400">
            Etiqueta de Coleta
          </DialogTitle>
          <DialogDescription>
            Confira os dados antes de enviar para a impressora térmica.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-100 rounded-xl mt-4 print:mt-0 print:p-2 border border-dashed border-zinc-300">
          <div className="text-center mb-2 w-full">
            <h3 className="font-bold text-black text-sm uppercase truncate max-w-full">{patient.name}</h3>
            <p className="text-xs text-zinc-600 font-mono">ID: {patient.ticket} | {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div className="bg-white p-2 rounded">
            <Barcode 
              value={exam.id} 
              width={1.5} 
              height={40} 
              displayValue={true} 
              fontSize={12} 
              margin={0}
              background="#ffffff"
              lineColor="#000000"
            />
          </div>

          <div className="mt-3 text-center w-full">
            <p className="text-xs font-bold text-black uppercase">{exam.name}</p>
            {exam.type === 'lab' && (
              <p className="text-[10px] font-black text-purple-700 uppercase mt-1 px-2 py-0.5 bg-purple-100 rounded-full inline-block">
                {getTubeType(exam.name)}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 print:hidden">
          <Button variant="ghost" onClick={onClose} className="h-10 text-[10px] font-bold uppercase tracking-widest">
            Fechar
          </Button>
          <Button
            onClick={handlePrint}
            className="h-10 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
