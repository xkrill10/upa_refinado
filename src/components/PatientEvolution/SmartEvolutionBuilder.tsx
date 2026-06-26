import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Activity, Beaker, ClipboardList, Stethoscope, Syringe, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SmartEvolutionBuilderProps {
  role: "medico" | "enfermeiro" | "diretoria" | string;
  value: string;
  onChange: (val: string) => void;
}

// Categorias para o Enfermeiro
const nursingCategories = [
  { name: "Sinais Vitais & Avaliação", icon: <Activity className="w-4 h-4" />, items: [
    { label: "Eupneico", text: "- Eupneico em ar ambiente." },
    { label: "Padrão Irregular", text: "- Padrão respiratório irregular, cateter de O2." },
    { label: "Normotenso", text: "- Normotenso, FC rítmica." },
    { label: "Consciente", text: "- Consciente, orientado no tempo e espaço." },
    { label: "Sonolento", text: "- Sonolento, hipoativo, responsivo ao toque." },
    { label: "Sem Dor", text: "- Relata ausência de dor no momento." },
  ]},
  { name: "Dispositivos & Cuidados", icon: <Syringe className="w-4 h-4" />, items: [
    { label: "AVP Pérvio", text: "- Acesso venoso periférico pérvio, sem flogística." },
    { label: "Nova Punção", text: "- Realizada nova punção venosa periférica." },
    { label: "Curativo", text: "- Curativo limpo e seco, fixo à pele." },
    { label: "SVD", text: "- Sonda vesical de demora pérvia, débito claro." },
    { label: "Grades", text: "- Grades mantidas elevadas (Prev. Queda)." },
    { label: "Banho", text: "- Realizado banho no leito." },
  ]},
  { name: "Dieta & Eliminações", icon: <Beaker className="w-4 h-4" />, items: [
    { label: "Dieta Zero", text: "- Mantida Dieta Zero." },
    { label: "Aceitou Dieta", text: "- Boa aceitação da dieta oferecida." },
    { label: "Diurese +", text: "- Diurese presente espontânea." },
    { label: "Evacuação -", text: "- Evacuação ausente no plantão." },
  ]},
];

// Categorias para o Médico
const medicalCategories = [
  { name: "Exame Físico", icon: <Stethoscope className="w-4 h-4" />, items: [
    { label: "BEG/Corado", text: "- Bom estado geral, corado, hidratado, acianótico." },
    { label: "REG", text: "- Regular estado geral, descorado, prostrado." },
    { label: "ACV Normal", text: "- ACV: RCR em 2T, BNF, sem sopros." },
    { label: "AR Normal", text: "- AR: MV+ universalmente, sem RA." },
    { label: "Abdome Flácido", text: "- Abdome: Flácido, indolor, RHA+." },
  ]},
  { name: "Conduta", icon: <ClipboardList className="w-4 h-4" />, items: [
    { label: "Alta", text: "- Conduta: Alta hospitalar com orientações." },
    { label: "Observação", text: "- Conduta: Mantido em observação clínica." },
    { label: "Exames", text: "- Solicitado exames laboratoriais/imagem." },
    { label: "Medicação", text: "- Prescrito medicação sintomática EV." },
  ]},
];

export function SmartEvolutionBuilder({ role, value, onChange }: SmartEvolutionBuilderProps) {
  const [activeTab, setActiveTab] = useState(0);

  const categories = role.toLowerCase().includes("medico") ? medicalCategories : nursingCategories;

  const handleAppendText = (text: string) => {
    const newText = value.trim() ? `${value}\n${text}` : text;
    onChange(newText);
  };

  return (
    <div className="space-y-4 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-amber-500" />
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Construtor Inteligente de Evolução (Fast Track)
        </h3>
        <Badge variant="secondary" className="ml-auto text-[10px] bg-[#006699]/10 text-[#006699]">
          Perfil: {role.toLowerCase().includes("medico") ? "Médico" : "Enfermagem"}
        </Badge>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  activeTab === idx
                    ? "bg-[#006699] text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {categories[activeTab].items.map((item, idx) => (
          <Button
            key={idx}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAppendText(item.text)}
            className="text-[11px] h-7 bg-white dark:bg-slate-950 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#006699] hover:text-[#006699] hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            + {item.label}
          </Button>
        ))}
      </div>

      <div className="mt-4">
        <Textarea
          placeholder="A evolução montada aparecerá aqui. Você pode digitar livremente..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[160px] text-sm resize-y font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-[#006699]"
        />
      </div>
    </div>
  );
}
