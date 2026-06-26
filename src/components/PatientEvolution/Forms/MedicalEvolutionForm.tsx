import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  patientName: string;
};

export function MedicalEvolutionForm({ isOpen, onClose, onSave, patientName }: Props) {
  const [content, setContent] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

  const handleSave = () => {
    // Removendo a trava para permitir testes: if (!content.trim()) return;
    onSave(`[Horário do Atendimento: ${time}]\n\n${content || "(Evolução em branco para teste)"}`);
    setContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-800 flex items-center gap-2">
            Evolução Médica
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {patientName}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right font-medium">
              Horário do Atendimento
            </Label>
            <Input 
              id="time" 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              className="col-span-1"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-slate-700">Subjetivo (Queixa / Anamnese)</Label>
            <Textarea 
              placeholder="Descreva o que o paciente relata..." 
              className="min-h-[100px] resize-none"
              onChange={(e) => setContent(prev => {
                // Lógica simples para demonstrar no mock. No real, separaríamos os campos no state.
                return e.target.value; 
              })}
              value={content}
            />
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border text-sm text-slate-500">
            <p>💡 <b>Dica de Design:</b> Aqui colocaremos futuramente os atalhos para CID, templates rápidos (SOAP completo), calculadoras médicas (ex: HEART Score) e afins.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-[#006699] hover:bg-[#005580]">
            Salvar Evolução
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
