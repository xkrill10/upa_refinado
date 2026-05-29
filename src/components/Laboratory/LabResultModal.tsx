import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileImage, Cpu } from "lucide-react";
import { usePatientsContext } from "@/context/PatientsContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { jsPDF } from "jspdf";
import { Clock } from "lucide-react";

interface Exam {
  id: string;
  name: string;
  type: "lab" | "image";
  priority: "normal" | "urgent";
  status: string;
}

interface LabResultModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  exam: Exam;
}

export function LabResultModal({ open, onClose, patientId, exam }: LabResultModalProps) {
  const { updateExamStatus, addEvolution } = usePatientsContext();
  const [result, setResult] = useState("");
  const [isCritical, setIsCritical] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleRelease = () => {
    if (!result.trim()) return;
    
    let url = undefined;
    if (attachment) {
      url = URL.createObjectURL(attachment);
    }
    
    // Update exam status to completed and store result
    updateExamStatus(patientId, exam.id, "completed", result, isCritical, url);
    
    // Injetar evolução médica
    addEvolution(patientId, {
      type: "Resultado de Exame",
      description: `Exame: ${exam.name}\n\nLaudo:\n${result}${isCritical ? '\n\nATENÇÃO: VALOR CRÍTICO / PÂNICO' : ''}`,
      professional: "Laboratório e Imagem",
      professionalType: "Médico"
    });
    
    onClose();
  };

  const applyTemplate = (templateId: string) => {
    if (templateId === 'rx_normal') {
      setResult("Radiografia de tórax PA e Perfil:\n- Ausência de consolidações focais ou derrames pleurais.\n- Área cardíaca dentro dos limites da normalidade.\n- Cúpulas diafragmáticas livres.\n- Arcabouço ósseo íntegro.\n\nCONCLUSÃO: Estudo radiológico do tórax dentro dos limites da normalidade.");
    } else if (templateId === 'ecg_normal') {
      setResult("Eletrocardiograma:\n- Ritmo sinusal regular.\n- FC: 75 bpm.\n- Onda P, complexo QRS e onda T com morfologia e amplitude normais.\n- Segmento ST isoelelétrico.\n\nCONCLUSÃO: ECG dentro dos limites da normalidade.");
    } else if (templateId === 'hemo_normal') {
      setResult("Hemograma Completo:\n- Série Vermelha: Eritrócitos, Hemoglobina e Hematócrito normais.\n- Série Branca: Leucócitos totais e contagem diferencial normais. Sem desvios.\n- Plaquetas: Contagem normal.\n\nCONCLUSÃO: Hemograma sem alterações.");
    }
  };

  const handleInterfaceamento = () => {
    setIsImporting(true);
    toast.info("Conectando ao equipamento LIS...", { icon: <Cpu className="w-4 h-4 text-indigo-500 animate-pulse" /> });
    setTimeout(() => {
      setIsImporting(false);
      setResult("RESULTADOS RECEBIDOS VIA INTERFACEAMENTO LIS/HIS:\n- Equipamento: Roche Cobas 8000\n- Status da Análise: Concluído com Sucesso\n\n- Hemoglobina: 14.5 g/dL (Valor Ref: 13.5 a 17.5)\n- Leucócitos: 7.200 /mm³ (Valor Ref: 4.500 a 11.000)\n- Plaquetas: 250.000 /mm³ (Valor Ref: 150.000 a 450.000)\n\nLaudo validado e assinado eletronicamente pelo equipamento.");
      toast.success("Resultados importados com sucesso da máquina!");
    }, 1500);
  };

  // Export PDF of the result
  const { patients } = usePatientsContext();
  const handleExportPdf = () => {
    const patient = patients.find(p => p.id === patientId);
    const doc = new jsPDF();
    const lineHeight = 7;
    let y = 10;
    doc.setFontSize(16);
    doc.text("Laudo de Exame", 105, y, { align: "center" });
    y += lineHeight * 2;
    doc.setFontSize(12);
    doc.text(`Paciente: ${patient?.name ?? ""}`, 20, y);
    y += lineHeight;
    doc.text(`Ticket: ${patient?.ticket ?? ""}`, 20, y);
    y += lineHeight;
    doc.text(`Risco: ${patient?.risk ?? ""}`, 20, y);
    y += lineHeight;
    doc.text(`Exame: ${exam.name}`, 20, y);
    y += lineHeight;
    doc.text(`Prioridade: ${exam.priority}`, 20, y);
    y += lineHeight;
    doc.text(`Resultado: ${result}`, 20, y);
    y += lineHeight;
    doc.text(`Liberado em: ${new Date().toLocaleString('pt-BR')}`, 20, y);
    doc.save(`laudo_${exam.id}.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={(openState) => { if (!openState) onClose(); }}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-6 glass-card-premium">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight text-purple-600 dark:text-purple-400">
            Laudo – {exam.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-1">
            <Badge className={cn(
              "px-2 py-1 text-xs font-bold",
              exam.priority === "urgent" ? "bg-red-600 text-white" : "bg-blue-600 text-white"
            )}>
              {exam.priority === "urgent" ? "Urgente" : "Rotina"}
            </Badge>
            <Clock className="w-4 h-4" />
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => applyTemplate('hemo_normal')} className="text-[10px] h-7">Template: Hemograma</Button>
            <Button variant="outline" size="sm" onClick={() => applyTemplate('rx_normal')} className="text-[10px] h-7">Template: RX Tórax</Button>
            <Button variant="outline" size="sm" onClick={() => applyTemplate('ecg_normal')} className="text-[10px] h-7">Template: ECG</Button>
            {exam.type === 'lab' && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleInterfaceamento} 
                disabled={isImporting}
                className="text-[10px] h-7 font-black tracking-widest uppercase bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 ml-auto border border-indigo-500/20 shadow-sm"
              >
                <Cpu className={cn("w-3 h-3 mr-1", isImporting && "animate-pulse")} /> 
                {isImporting ? "Importando..." : "Importar da Máquina"}
              </Button>
            )}
          </div>
          <Textarea
            placeholder="Digite o laudo ou resultado do exame..."
            className="min-h-[150px] rounded-xl"
            value={result}
            onChange={(e) => setResult(e.target.value)}
          />
          <div className="flex flex-col gap-2">
             <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Mini-PACS (Anexar Imagem DICOM / PDF)</Label>
             <div className="flex items-center gap-2">
                <input type="file" id="exam-upload" className="hidden" accept="image/*,.pdf" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                <Label htmlFor="exam-upload" className="flex items-center justify-center gap-2 border border-dashed border-white/20 hover:border-purple-500/50 hover:bg-purple-500/10 transition-colors w-full p-4 rounded-xl cursor-pointer">
                   {attachment ? (
                     <span className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                       <FileImage className="w-4 h-4" /> {attachment.name}
                     </span>
                   ) : (
                     <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                       <UploadCloud className="w-4 h-4" /> Clique para anexar arquivo
                     </span>
                   )}
                </Label>
             </div>
          </div>
          <div className="flex items-center space-x-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <Switch 
              id="critical-mode" 
              checked={isCritical}
              onCheckedChange={setIsCritical}
              className="data-[state=checked]:bg-red-600"
            />
            <Label htmlFor="critical-mode" className="text-red-700 dark:text-red-400 font-bold text-xs uppercase tracking-widest cursor-pointer">
              Sinalizar como Valor Crítico / Pânico
            </Label>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} className="h-10 text-[10px] font-bold uppercase tracking-widest">
            Cancelar
          </Button>
            <Button
              onClick={handleRelease}
              disabled={!result.trim()}
              className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
            >
              Liberar Laudo
            </Button>
            <Button
              onClick={handleExportPdf}
              className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl ml-2"
            >
              Exportar PDF
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default LabResultModal;
