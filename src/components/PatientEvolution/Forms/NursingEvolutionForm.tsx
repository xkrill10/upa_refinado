import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShieldAlert, Activity, ClipboardList } from "lucide-react";
import { BradenModal } from "@/components/PatientEvolution/Modals/BradenModal";
import { MorseModal } from "@/components/PatientEvolution/Modals/MorseModal";
import { EvaModal } from "@/components/PatientEvolution/Modals/EvaModal";
import { MewsModal } from "@/components/PatientEvolution/Modals/MewsModal";
import { NandaModal } from "@/components/PatientEvolution/Modals/NandaModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  patientName: string;
};

export function NursingEvolutionForm({ isOpen, onClose, onSave, patientName }: Props) {
  const [content, setContent] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

  const [isBradenOpen, setIsBradenOpen] = useState(false);
  const [isMorseOpen, setIsMorseOpen] = useState(false);
  const [isEvaOpen, setIsEvaOpen] = useState(false);
  const [isMewsOpen, setIsMewsOpen] = useState(false);
  const [isNandaOpen, setIsNandaOpen] = useState(false);

  const handleAppendText = (text: string) => {
    setContent((prev) => prev ? prev + "\n\n" + text : text);
  };


  const handleSave = () => {
    // Removendo a trava para permitir testes: if (!content.trim()) return;
    onSave(`[Horário do Registro: ${time}]\n\n${content || "(Evolução em branco para teste)"}`);
    setContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-800 flex items-center gap-2">
            Anotação e SAE (Enfermagem)
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {patientName}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 py-4">
          
          {/* LADO ESQUERDO: CALCULADORAS ESCONDIDAS AQUI */}
          <div className="col-span-1 border-r pr-6 space-y-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4" />
              Avaliações de Risco
            </h3>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left font-normal text-slate-600 bg-slate-50 hover:bg-slate-100" onClick={() => setIsBradenOpen(true)}>
                Escala de Braden (LPP)
              </Button>
              <Button variant="outline" className="w-full justify-start text-left font-normal text-slate-600 bg-slate-50 hover:bg-slate-100" onClick={() => setIsMorseOpen(true)}>
                Escala de Morse (Quedas)
              </Button>
              <Button variant="outline" className="w-full justify-start text-left font-normal text-slate-600 bg-slate-50 hover:bg-slate-100" onClick={() => setIsEvaOpen(true)}>
                Escala de Dor (EVA)
              </Button>
              <Button variant="outline" className="w-full justify-start text-left font-normal text-slate-600 bg-slate-50 hover:bg-slate-100" onClick={() => setIsMewsOpen(true)}>
                MEWS (Alerta Clínico)
              </Button>
            </div>
            
            <div className="pt-4 border-t">
               <h3 className="font-semibold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider mb-4">
                <Activity className="h-4 w-4" />
                Sistematização (SAE)
              </h3>
              <Button variant="outline" className="w-full justify-start text-left font-normal border-dashed border-[#006699] text-[#006699] bg-sky-50" onClick={() => setIsNandaOpen(true)}>
                Planejador NANDA/NIC
              </Button>
            </div>
          </div>

          {/* LADO DIREITO: TEXTO DA EVOLUÇÃO */}
          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="font-medium text-slate-700">
                Horário do Registro
              </Label>
              <Input 
                id="time" 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                className="col-span-2"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-slate-700">Anotação de Enfermagem</Label>
              <Textarea 
                placeholder="Ex: Recebo paciente no leito, consciente, contactuando, eupnéico em ar ambiente. Mantém acesso venoso periférico em MSE salinizado, sem sinais flogísticos..." 
                className="min-h-[250px] resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-[#006699] hover:bg-[#005580]">
            Salvar Evolução
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Modals das Ferramentas */}
      <BradenModal 
        isOpen={isBradenOpen} 
        onClose={setIsBradenOpen} 
        onApply={(descText) => handleAppendText(descText)} 
      />
      <MorseModal 
        isOpen={isMorseOpen} 
        onClose={setIsMorseOpen} 
        onApply={(descText) => handleAppendText(descText)} 
      />
      <EvaModal 
        isOpen={isEvaOpen} 
        onClose={setIsEvaOpen} 
        onApply={(descText) => handleAppendText(descText)} 
      />
      <MewsModal 
        isOpen={isMewsOpen} 
        onClose={setIsMewsOpen} 
        onApply={(descText) => handleAppendText(descText)} 
      />
      <NandaModal 
        isOpen={isNandaOpen} 
        onClose={setIsNandaOpen} 
        onApply={(descText) => handleAppendText(descText)} 
      />
    </Dialog>

  );
}
