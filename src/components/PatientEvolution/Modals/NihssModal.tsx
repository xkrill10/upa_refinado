import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NihssModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function NihssModal({ isOpen, onClose, onApply }: NihssModalProps) {
  const [loc, setLoc] = useState("");
  const [locQ, setLocQ] = useState("");
  const [locC, setLocC] = useState("");
  const [gaze, setGaze] = useState("");
  const [visual, setVisual] = useState("");
  const [facial, setFacial] = useState("");
  const [motorArmL, setMotorArmL] = useState("");
  const [motorArmR, setMotorArmR] = useState("");
  const [motorLegL, setMotorLegL] = useState("");
  const [motorLegR, setMotorLegR] = useState("");
  const [ataxia, setAtaxia] = useState("");
  const [sensory, setSensory] = useState("");
  const [language, setLanguage] = useState("");
  const [dysarthria, setDysarthria] = useState("");
  const [extinction, setExtinction] = useState("");

  const isComplete = !!(loc && locQ && locC && gaze && visual && facial && motorArmL && motorArmR && motorLegL && motorLegR && ataxia && sensory && language && dysarthria && extinction);

  let score = 0;
  if (isComplete) {
    score = Number(loc) + Number(locQ) + Number(locC) + Number(gaze) + Number(visual) + Number(facial) + 
            Number(motorArmL) + Number(motorArmR) + Number(motorLegL) + Number(motorLegR) + 
            Number(ataxia) + Number(sensory) + Number(language) + Number(dysarthria) + Number(extinction);
  }

  let riskClass = "";
  let conduta = "";
  let riskColor = "";

  if (score === 0) {
    riskClass = "SEM DÉFICIT";
    conduta = "Avaliação normal. Considerar outros diagnósticos diferenciais (ex: AIT resolvido).";
    riskColor = "bg-emerald-500 text-white";
  } else if (score >= 1 && score <= 4) {
    riskClass = "AVC LEVE";
    conduta = "Déficit neurológico leve. Avaliar indicação de trombólise dependendo das diretrizes institucionais.";
    riskColor = "bg-blue-500 text-white";
  } else if (score >= 5 && score <= 15) {
    riskClass = "AVC MODERADO";
    conduta = "Candidato potencial para trombólise venosa se dentro da janela terapêutica (< 4,5h). Protocolo AVC agudo urgente.";
    riskColor = "bg-amber-500 text-white";
  } else if (score >= 16 && score <= 20) {
    riskClass = "AVC MODERADO A GRAVE";
    conduta = "Alta probabilidade de oclusão de grandes vasos. Trombólise + avaliar trombectomia mecânica urgente.";
    riskColor = "bg-orange-600 text-white";
  } else {
    riskClass = "AVC GRAVE";
    conduta = "Déficit neurológico extenso. Alto risco de transformação hemorrágica e edema cerebral. Conduta imediata.";
    riskColor = "bg-red-600 text-white animate-pulse";
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-2 shrink-0">
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Brain className="h-6 w-6 text-indigo-500" />
            Escala NIHSS
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            National Institutes of Health Stroke Scale (Avaliação de AVC)
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1A */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">1A. Nível de Consciência</Label>
              <Select value={loc} onValueChange={setLoc}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Alerta</SelectItem>
                  <SelectItem value="1">1 - Sonolento, acorda com estímulo leve</SelectItem>
                  <SelectItem value="2">2 - Estupor, requer estímulo vigoroso</SelectItem>
                  <SelectItem value="3">3 - Coma, irresponsivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 1B */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">1B. Perguntas (Mês e Idade)</Label>
              <Select value={locQ} onValueChange={setLocQ}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Responde ambas corretamente</SelectItem>
                  <SelectItem value="1">1 - Responde uma corretamente</SelectItem>
                  <SelectItem value="2">2 - Nenhuma correta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 1C */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">1C. Comandos (Abrir/fechar olhos)</Label>
              <Select value={locC} onValueChange={setLocC}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Realiza ambos</SelectItem>
                  <SelectItem value="1">1 - Realiza um</SelectItem>
                  <SelectItem value="2">2 - Nenhum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2 */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">2. Melhor Olhar Conjugado</Label>
              <Select value={gaze} onValueChange={setGaze}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Normal</SelectItem>
                  <SelectItem value="1">1 - Paralisia parcial do olhar</SelectItem>
                  <SelectItem value="2">2 - Desvio forçado do olhar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3 */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">3. Campos Visuais</Label>
              <Select value={visual} onValueChange={setVisual}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Normal</SelectItem>
                  <SelectItem value="1">1 - Hemianopsia parcial</SelectItem>
                  <SelectItem value="2">2 - Hemianopsia completa</SelectItem>
                  <SelectItem value="3">3 - Hemianopsia bilateral (Cego)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4 */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">4. Paralisia Facial</Label>
              <Select value={facial} onValueChange={setFacial}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Movimentos normais</SelectItem>
                  <SelectItem value="1">1 - Assimetria leve</SelectItem>
                  <SelectItem value="2">2 - Paralisia parcial (inferior)</SelectItem>
                  <SelectItem value="3">3 - Paralisia completa (superior e inferior)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5L */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">5a. Motor Braço Esquerdo</Label>
              <Select value={motorArmL} onValueChange={setMotorArmL}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Mantém 10s sem cair</SelectItem>
                  <SelectItem value="1">1 - Cai antes de 10s, não bate na cama</SelectItem>
                  <SelectItem value="2">2 - Algum esforço contra gravidade, mas cai</SelectItem>
                  <SelectItem value="3">3 - Sem esforço contra gravidade</SelectItem>
                  <SelectItem value="4">4 - Sem movimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5R */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">5b. Motor Braço Direito</Label>
              <Select value={motorArmR} onValueChange={setMotorArmR}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Mantém 10s sem cair</SelectItem>
                  <SelectItem value="1">1 - Cai antes de 10s, não bate na cama</SelectItem>
                  <SelectItem value="2">2 - Algum esforço contra gravidade, mas cai</SelectItem>
                  <SelectItem value="3">3 - Sem esforço contra gravidade</SelectItem>
                  <SelectItem value="4">4 - Sem movimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 6L */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">6a. Motor Perna Esquerda</Label>
              <Select value={motorLegL} onValueChange={setMotorLegL}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Mantém 5s sem cair</SelectItem>
                  <SelectItem value="1">1 - Cai antes de 5s, não bate na cama</SelectItem>
                  <SelectItem value="2">2 - Algum esforço contra gravidade, mas cai</SelectItem>
                  <SelectItem value="3">3 - Sem esforço contra gravidade</SelectItem>
                  <SelectItem value="4">4 - Sem movimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 6R */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">6b. Motor Perna Direita</Label>
              <Select value={motorLegR} onValueChange={setMotorLegR}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Mantém 5s sem cair</SelectItem>
                  <SelectItem value="1">1 - Cai antes de 5s, não bate na cama</SelectItem>
                  <SelectItem value="2">2 - Algum esforço contra gravidade, mas cai</SelectItem>
                  <SelectItem value="3">3 - Sem esforço contra gravidade</SelectItem>
                  <SelectItem value="4">4 - Sem movimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 7 */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">7. Ataxia Apendicular</Label>
              <Select value={ataxia} onValueChange={setAtaxia}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Ausente</SelectItem>
                  <SelectItem value="1">1 - Presente em um membro</SelectItem>
                  <SelectItem value="2">2 - Presente em dois ou mais membros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 8 */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">8. Sensibilidade</Label>
              <Select value={sensory} onValueChange={setSensory}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Normal</SelectItem>
                  <SelectItem value="1">1 - Perda leve a moderada</SelectItem>
                  <SelectItem value="2">2 - Perda grave a total</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 9 */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">9. Melhor Linguagem</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Normal</SelectItem>
                  <SelectItem value="1">1 - Afasia leve a moderada</SelectItem>
                  <SelectItem value="2">2 - Afasia grave</SelectItem>
                  <SelectItem value="3">3 - Mudo, afasia global</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 10 */}
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase">10. Disartria</Label>
              <Select value={dysarthria} onValueChange={setDysarthria}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Articulação normal</SelectItem>
                  <SelectItem value="1">1 - Disartria leve a moderada</SelectItem>
                  <SelectItem value="2">2 - Disartria grave, anártrico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 11 */}
            <div className="space-y-1 md:col-span-2">
              <Label className="text-[10px] font-black uppercase">11. Extinção / Inatenção (Negligência)</Label>
              <Select value={extinction} onValueChange={setExtinction}>
                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="0">0 - Nenhuma anormalidade</SelectItem>
                  <SelectItem value="1">1 - Inatenção visual, tátil, auditiva ou espacial parcial</SelectItem>
                  <SelectItem value="2">2 - Inatenção total (hemi-inatenção profunda)</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>

        <div className="p-6 pt-0 mt-4 shrink-0">
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Escore Total</p>
                <p className="text-3xl font-black text-foreground">{score} <span className="text-sm font-bold text-muted-foreground">/ 42 pts</span></p>
              </div>
              {isComplete ? (
                <Badge className={cn("h-7 rounded-lg text-[10px] font-black uppercase px-2", riskColor)}>
                  {riskClass}
                </Badge>
              ) : (
                <Badge variant="secondary" className="h-7 rounded-lg text-xs font-black uppercase">
                  Incompleto
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setLoc(""); setLocQ(""); setLocC(""); setGaze(""); setVisual(""); setFacial("");
                  setMotorArmL(""); setMotorArmR(""); setMotorLegL(""); setMotorLegR(""); setAtaxia("");
                  setSensory(""); setLanguage(""); setDysarthria(""); setExtinction("");
                  toast.info("Campos limpos.");
                }}
                className="h-11 px-6 rounded-xl font-bold uppercase text-[10px]"
              >
                Limpar
              </Button>
              <Button
                type="button"
                disabled={!isComplete}
                onClick={() => {
                  const descText = `- ESCORE NIHSS (Avaliação de AVC): ${score} pontos (${riskClass}).\n  Conduta: ${conduta}`;
                  onApply(descText, `NIHSS: ${score} pts (${riskClass})`);
                  onClose(false);
                  toast.success("Escore NIHSS aplicado ao prontuário!");
                }}
                className="flex-1 h-11 rounded-xl font-bold uppercase text-[10px] bg-primary text-primary-foreground"
              >
                Aplicar ao Prontuário
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
