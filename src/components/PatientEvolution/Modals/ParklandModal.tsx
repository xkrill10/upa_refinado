import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ParklandModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onApply: (descText: string, summary: string) => void;
}

export function ParklandModal({
  isOpen,
  onClose,
  onApply,
}: ParklandModalProps) {
  const [patientType, setPatientType] = useState("adult");
  const [weight, setWeight] = useState("");
  const [tbsa, setTbsa] = useState(""); // % SCQ
  const [factor, setFactor] = useState("2"); // ATLS 10th Ed: 2mL for adult, 3mL for ped, 4mL for electrical

  const isComplete = !!(patientType && weight && tbsa && factor);

  // Parse values
  const weightNum = parseFloat(weight) || 0;
  const tbsaNum = parseFloat(tbsa) || 0;
  const factorNum = parseFloat(factor) || 0;

  // Calculando Parkland
  let totalFluid = 0;
  let first8Hours = 0;
  let next16Hours = 0;

  if (isComplete && weightNum > 0 && tbsaNum > 0) {
    totalFluid = factorNum * weightNum * tbsaNum;
    first8Hours = totalFluid / 2;
    next16Hours = totalFluid / 2;
  }

  // Calculando Holliday-Segar (Manutenção para Pediatria)
  let maintenance24h = 0;
  if (patientType === "pediatric" && weightNum > 0) {
    if (weightNum <= 10) {
      maintenance24h = weightNum * 100;
    } else if (weightNum <= 20) {
      maintenance24h = 1000 + (weightNum - 10) * 50;
    } else {
      maintenance24h = 1500 + (weightNum - 20) * 20;
    }
  }

  const hasMaintenance = patientType === "pediatric" && maintenance24h > 0;
  const maintenance8h = hasMaintenance ? maintenance24h / 3 : 0; // Aproximadamente 1/3 para 8 horas
  const maintenance16h = hasMaintenance ? (maintenance24h / 3) * 2 : 0;

  const totalFirst8 = first8Hours + maintenance8h;
  const totalNext16 = next16Hours + maintenance16h;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-xl glass-card-premium shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl mission-control-title flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            Regra de Parkland (SCQ)
          </DialogTitle>
          <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">
            Cálculo de Hidratação para Grandes Queimados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            {/* Tipo de Paciente */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">
                Tipo de Paciente
              </Label>
              <Select
                value={patientType}
                onValueChange={(val) => {
                  setPatientType(val);
                  if (val === "pediatric" && factor === "2") setFactor("3"); // Ajusta fator sugerido ATLS
                }}
              >
                <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Adulto (&ge; 14 anos)</SelectItem>
                  <SelectItem value="pediatric">
                    Pediátrico (&lt; 14 anos)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fator (mL) */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">
                Fator (mL/kg/%SCQ)
              </Label>
              <Select value={factor} onValueChange={setFactor}>
                <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">
                    2 mL (ATLS - Adulto Térmica)
                  </SelectItem>
                  <SelectItem value="3">
                    3 mL (ATLS - Pediátrico Térmica)
                  </SelectItem>
                  <SelectItem value="4">
                    4 mL (ATLS - Elétrica / Parkland Clássico)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Peso */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">
                Peso Estimado (kg)
              </Label>
              <Input
                type="number"
                placeholder="Ex: 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 font-bold"
              />
            </div>

            {/* % SCQ */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase text-foreground/80">
                Superfície Queimada (% SCQ)
              </Label>
              <Input
                type="number"
                placeholder="Ex: 25"
                value={tbsa}
                onChange={(e) => setTbsa(e.target.value)}
                className="h-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 font-bold"
              />
            </div>
          </div>

          {/* Resultado */}
          {isComplete && weightNum > 0 && tbsaNum > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50 space-y-4">
              <div className="flex flex-col gap-2 border-b border-border/50 pb-3">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                  Volume Total de Reposição (24h)
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-black text-orange-600 dark:text-orange-400">
                    {totalFluid.toFixed(0)}{" "}
                    <span className="text-sm font-bold text-muted-foreground">
                      mL (Ringer Lactato)
                    </span>
                  </p>
                </div>
                {hasMaintenance && (
                  <div className="bg-sky-500/10 p-2 rounded-lg border border-sky-500/20 mt-1">
                    <p className="text-[10px] font-black uppercase text-sky-700 dark:text-sky-400">
                      + Necessidade Hídrica de Manutenção (Holliday-Segar):{" "}
                      {maintenance24h.toFixed(0)} mL/24h
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      Na pediatria, o soro de manutenção deve ser prescrito em
                      paralelo ao volume de reposição da queimadura.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">
                    Metade nas primeiras 8h
                  </p>
                  <p className="text-xl font-black text-foreground">
                    {first8Hours.toFixed(0)}{" "}
                    <span className="text-xs font-bold text-muted-foreground">
                      mL
                    </span>
                  </p>
                  <p className="text-[9px] font-bold text-orange-600 mt-1">
                    Vazão: {(first8Hours / 8).toFixed(0)} mL/h
                  </p>
                  {hasMaintenance && (
                    <p className="text-[9px] font-bold text-sky-600 mt-0.5">
                      + Manutenção: {(maintenance8h / 8).toFixed(0)} mL/h
                    </p>
                  )}
                </div>

                <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">
                    Metade nas próximas 16h
                  </p>
                  <p className="text-xl font-black text-foreground">
                    {next16Hours.toFixed(0)}{" "}
                    <span className="text-xs font-bold text-muted-foreground">
                      mL
                    </span>
                  </p>
                  <p className="text-[9px] font-bold text-orange-600 mt-1">
                    Vazão: {(next16Hours / 16).toFixed(0)} mL/h
                  </p>
                  {hasMaintenance && (
                    <p className="text-[9px] font-bold text-sky-600 mt-0.5">
                      + Manutenção: {(maintenance16h / 16).toFixed(0)} mL/h
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setWeight("");
                setTbsa("");
                toast.info("Campos limpos.");
              }}
              className="h-11 px-6 rounded-xl font-bold uppercase text-[10px]"
            >
              Limpar
            </Button>
            <Button
              type="button"
              disabled={!(isComplete && weightNum > 0 && tbsaNum > 0)}
              onClick={() => {
                let descText = `- REGRA DE PARKLAND (Queimadura ${tbsaNum}% SCQ):\n`;
                descText += `  • Volume de Reposição (Ringer Lactato): ${totalFluid.toFixed(0)} mL em 24h.\n`;
                descText += `  • Primeiras 8h: ${first8Hours.toFixed(0)} mL (Vazão: {(first8Hours / 8).toFixed(0)} mL/h).\n`;
                descText += `  • Próximas 16h: ${next16Hours.toFixed(0)} mL (Vazão: {(next16Hours / 16).toFixed(0)} mL/h).\n`;

                if (hasMaintenance) {
                  descText += `  • Manutenção Pediátrica (Holliday-Segar): ${maintenance24h.toFixed(0)} mL/24h adicionais em via de acesso separada.`;
                }

                onApply(descText, `Parkland: ${totalFluid.toFixed(0)}mL / 24h`);
                onClose(false);
                toast.success("Cálculo de Parkland aplicado ao prontuário!");
              }}
              className="flex-1 h-11 rounded-xl font-bold uppercase text-[10px] bg-primary text-primary-foreground"
            >
              Aplicar ao Prontuário
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
