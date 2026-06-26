import re

file_path = "src/components/PatientEvolution/Forms/NursingEvolutionForm.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
imports = """import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, Activity, ClipboardList } from "lucide-react";
import { BradenModal } from "@/components/PatientEvolution/Modals/BradenModal";
import { MorseModal } from "@/components/PatientEvolution/Modals/MorseModal";
import { EvaModal } from "@/components/PatientEvolution/Modals/EvaModal";
import { MewsModal } from "@/components/PatientEvolution/Modals/MewsModal";
import { NandaModal } from "@/components/PatientEvolution/Modals/NandaModal";
"""

content = re.sub(
    r'import { Dialog, DialogContent.*?\n.*?lucide-react";\n',
    imports,
    content,
    flags=re.DOTALL
)

# 2. State
state_str = """  const [content, setContent] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

  const [isBradenOpen, setIsBradenOpen] = useState(false);
  const [isMorseOpen, setIsMorseOpen] = useState(false);
  const [isEvaOpen, setIsEvaOpen] = useState(false);
  const [isMewsOpen, setIsMewsOpen] = useState(false);
  const [isNandaOpen, setIsNandaOpen] = useState(false);

  const handleAppendText = (text: string) => {
    setContent((prev) => prev ? prev + "\\n\\n" + text : text);
  };
"""

content = content.replace(
    '  const [content, setContent] = useState("");\n  const [time, setTime] = useState(new Date().toLocaleTimeString(\'pt-BR\', { hour: \'2-digit\', minute: \'2-digit\' }));',
    state_str
)

# 3. Add onClick to buttons
content = content.replace(
    '<Button variant="outline" className="w-full justify-start text-left font-normal text-muted-foreground hover:text-primary">',
    '<Button variant="outline" className="w-full justify-start text-left font-normal text-muted-foreground hover:text-primary"'
)
content = content.replace(
    '>\n              Escala de Braden (LPP)',
    ' onClick={() => setIsBradenOpen(true)}>\n              Escala de Braden (LPP)'
)

content = content.replace(
    '>\n              Escala de Morse (Quedas)',
    ' onClick={() => setIsMorseOpen(true)}>\n              Escala de Morse (Quedas)'
)

content = content.replace(
    '>\n              Escala de Dor (EVA)',
    ' onClick={() => setIsEvaOpen(true)}>\n              Escala de Dor (EVA)'
)

content = content.replace(
    '>\n              MEWS (Alerta Clínico)',
    ' onClick={() => setIsMewsOpen(true)}>\n              MEWS (Alerta Clínico)'
)

content = content.replace(
    '<Button variant="outline" className="w-full justify-start text-left font-normal text-[#006699] border-[#006699] border-dashed hover:bg-[#006699]/10">',
    '<Button variant="outline" onClick={() => setIsNandaOpen(true)} className="w-full justify-start text-left font-normal text-[#006699] border-[#006699] border-dashed hover:bg-[#006699]/10">'
)

# 4. Inject Modals
modals_str = """
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
"""

content = content.replace("    </Dialog>", modals_str)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("NursingEvolutionForm.tsx updated with modals.")
