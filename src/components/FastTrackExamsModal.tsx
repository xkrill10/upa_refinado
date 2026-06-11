import { useState, useRef, useEffect } from "react";
import { Patient } from "@/hooks/use-patients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Plus,
  CheckCircle2,
  Trash2,
  TestTube2,
  ActivitySquare,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { usePatientsContext } from "@/context/PatientsContext";

interface FastTrackExamsModalProps {
  patient: Patient | null;
  onClose: () => void;
}

const EXTENSIVE_EXAMS = [
  // LABORATÓRIO - HEMATOLOGIA & COAGULAÇÃO
  { name: "Hemograma Completo", type: "lab" },
  { name: "Coagulograma (TAP, TTPA)", type: "lab" },
  { name: "D-Dímero", type: "lab" },
  { name: "Tipagem Sanguínea e Fator Rh", type: "lab" },

  // LABORATÓRIO - BIOQUÍMICA & MARCADORES
  { name: "Glicemia de Jejum", type: "lab" },
  { name: "Glicemia Capilar (HGT)", type: "lab" },
  { name: "Ureia e Creatinina", type: "lab" },
  { name: "Sódio e Potássio", type: "lab" },
  { name: "Cálcio Iônico", type: "lab" },
  { name: "Magnésio", type: "lab" },
  { name: "PCR (Proteína C Reativa)", type: "lab" },
  { name: "Troponina T", type: "lab" },
  { name: "Troponina I", type: "lab" },
  { name: "CK-MB", type: "lab" },
  { name: "CPK (Creatinofosfoquinase)", type: "lab" },
  { name: "TGO (AST) e TGP (ALT)", type: "lab" },
  { name: "Amilase e Lipase", type: "lab" },
  { name: "Bilirrubinas (Total e Frações)", type: "lab" },

  // LABORATÓRIO - INFECTOLOGIA & SOROLOGIAS
  { name: "Teste Rápido Dengue (NS1/IgG/IgM)", type: "lab" },
  { name: "Teste Rápido Covid-19 (Antígeno)", type: "lab" },
  { name: "Teste Rápido Influenza A/B", type: "lab" },
  { name: "Teste Rápido HIV", type: "lab" },
  { name: "Teste Rápido Sífilis (VDRL)", type: "lab" },
  { name: "Sorologia para Citomegalovírus", type: "lab" },
  { name: "Sorologia para Toxoplasmose", type: "lab" },

  // LABORATÓRIO - URINÁLISE & CULTURAS
  { name: "EAS (Urina Tipo I)", type: "lab" },
  { name: "Urocultura com Antibiograma", type: "lab" },
  { name: "Hemocultura", type: "lab" },
  { name: "Coprocultura", type: "lab" },

  // IMAGEM - RAIO-X
  { name: "Radiografia de Tórax (PA/Perfil)", type: "image" },
  { name: "Radiografia de Abdome Agudo", type: "image" },
  { name: "Radiografia de Bacia", type: "image" },
  { name: "Radiografia de Coluna Cervical", type: "image" },
  { name: "Radiografia de Coluna Lombo-Sacra", type: "image" },
  { name: "Radiografia de Membro Superior", type: "image" },
  { name: "Radiografia de Membro Inferior", type: "image" },
  { name: "Radiografia de Seios da Face", type: "image" },

  // IMAGEM - TOMOGRAFIA
  { name: "Tomografia Computadorizada de Crânio", type: "image" },
  { name: "Tomografia Computadorizada de Tórax", type: "image" },
  { name: "Tomografia Computadorizada de Abdome Total", type: "image" },

  // IMAGEM - ULTRASSONOGRAFIA
  { name: "Ultrassonografia de Abdome Total", type: "image" },
  { name: "Ultrassonografia de Vias Urinárias", type: "image" },
  { name: "Ultrassonografia Pélvica", type: "image" },

  // OUTROS / CLÍNICOS
  { name: "Eletrocardiograma (ECG)", type: "lab" },
];

export function FastTrackExamsModal({
  patient,
  onClose,
}: FastTrackExamsModalProps) {
  const { requestExam } = usePatientsContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [customExam, setCustomExam] = useState("");
  const [selectedExams, setSelectedExams] = useState<
    { name: string; type: "lab" | "image" | "custom" }[]
  >([]);
  const [activeTab, setActiveTab] = useState<"lab" | "image">("lab");

  // Filtragem
  const filteredExams = EXTENSIVE_EXAMS.filter(
    (ex) =>
      ex.type === activeTab &&
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleExam = (name: string, type: "lab" | "image" | "custom") => {
    if (selectedExams.some((e) => e.name === name)) {
      setSelectedExams((prev) => prev.filter((e) => e.name !== name));
    } else {
      setSelectedExams((prev) => [...prev, { name, type }]);
    }
  };

  const handleAddCustomExam = () => {
    if (!customExam.trim()) return;
    if (
      selectedExams.some(
        (e) => e.name.toLowerCase() === customExam.toLowerCase(),
      )
    ) {
      toast.error("Este exame já foi adicionado.");
      return;
    }
    setSelectedExams((prev) => [
      ...prev,
      { name: customExam.trim(), type: "custom" },
    ]);
    setCustomExam("");
    toast.success("Exame manual adicionado à lista!");
  };

  const handleConfirm = () => {
    if (selectedExams.length === 0) {
      toast.error("Selecione pelo menos um exame para confirmar.");
      return;
    }

    if (patient) {
      // Registrar cada exame selecionado
      selectedExams.forEach((ex) => {
        requestExam(patient.id, {
          name: ex.name,
          type: ex.type as "lab" | "image",
          priority: "normal",
          doctor: "Fast-Track",
          observations: "Solicitado via Fast-Track",
        });
      });
      toast.success(
        `${selectedExams.length} exame(s) solicitado(s) com sucesso!`,
      );
    }
    onClose();
  };

  return (
    <div className="flex flex-col h-[650px] max-h-[85vh] gap-4 bg-transparent rounded-b-2xl">
      {/* Abas e Busca */}
      <div className="flex flex-col gap-3 shrink-0 p-4 pb-0">
        <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
          <button
            className={cn(
              "flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2",
              activeTab === "lab"
                ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-700",
            )}
            onClick={() => setActiveTab("lab")}
          >
            <TestTube2 className="h-4 w-4" /> Laboratório / Clínico
          </button>
          <button
            className={cn(
              "flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2",
              activeTab === "image"
                ? "bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-purple-400"
                : "text-slate-500 hover:text-slate-700",
            )}
            onClick={() => setActiveTab("image")}
          >
            <ActivitySquare className="h-4 w-4" /> Imagem
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Buscar exames de ${activeTab === "lab" ? "laboratório" : "imagem"}...`}
            className="pl-9 h-11 rounded-xl bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Exames */}
      <div className="flex-1 overflow-hidden px-4">
        <ScrollArea className="h-full pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4">
            {filteredExams.map((exam) => {
              const isSelected = selectedExams.some(
                (e) => e.name === exam.name,
              );
              const isLab = exam.type === "lab";

              return (
                <div
                  key={exam.name}
                  onClick={() =>
                    toggleExam(exam.name, exam.type as "lab" | "image")
                  }
                  className={cn(
                    "flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 group",
                    isSelected
                      ? isLab
                        ? "bg-blue-50 border-blue-400 dark:bg-blue-900/30 dark:border-blue-500 shadow-sm"
                        : "bg-purple-50 border-purple-400 dark:bg-purple-900/30 dark:border-purple-500 shadow-sm"
                      : isLab
                        ? "bg-white/60 border-white/40 hover:border-blue-200 hover:bg-blue-50/50 dark:bg-slate-800/40 dark:border-slate-700/50 dark:hover:border-blue-800 dark:hover:bg-blue-900/30 backdrop-blur-sm"
                        : "bg-white/60 border-white/40 hover:border-purple-200 hover:bg-purple-50/50 dark:bg-slate-800/40 dark:border-slate-700/50 dark:hover:border-purple-800 dark:hover:bg-purple-900/30 backdrop-blur-sm",
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-md border flex items-center justify-center mr-3 shrink-0 transition-colors",
                      isSelected
                        ? isLab
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-purple-500 border-purple-500 text-white"
                        : isLab
                          ? "border-slate-200 bg-slate-50 text-slate-400 group-hover:border-blue-300 group-hover:text-blue-400 dark:border-slate-600 dark:bg-slate-900"
                          : "border-slate-200 bg-slate-50 text-slate-400 group-hover:border-purple-300 group-hover:text-purple-400 dark:border-slate-600 dark:bg-slate-900",
                    )}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isLab ? (
                      <TestTube2 className="h-3.5 w-3.5" />
                    ) : (
                      <ActivitySquare className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      isSelected
                        ? isLab
                          ? "text-blue-800 dark:text-blue-300"
                          : "text-purple-800 dark:text-purple-300"
                        : "text-slate-600 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white",
                    )}
                  >
                    {exam.name}
                  </span>
                </div>
              );
            })}
            {filteredExams.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                <AlertCircle className="h-8 w-8 opacity-20" />
                <p>Nenhum exame padrão encontrado com "{searchTerm}".</p>
                <p className="text-xs">
                  Use o campo abaixo para adicionar manualmente.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Exame Manual e Rodapé */}
      <div className="shrink-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border-t border-white/50 dark:border-slate-800 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Adicionar Exame Manualmente (Não listado)
              </label>
              <Input
                placeholder="Ex: Sorologia para Citomegalovírus"
                className="h-10 rounded-lg border-slate-300 dark:border-slate-700"
                value={customExam}
                onChange={(e) => setCustomExam(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomExam()}
              />
            </div>
            <Button
              type="button"
              onClick={handleAddCustomExam}
              className="h-10 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <Plus className="h-4 w-4 mr-2" /> Adicionar
            </Button>
          </div>

          {selectedExams.length > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                  Exames Selecionados ({selectedExams.length})
                </span>
                <button
                  onClick={() => setSelectedExams([])}
                  className="text-[10px] text-red-500 hover:underline uppercase font-bold"
                >
                  Limpar Tudo
                </button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto custom-scrollbar pr-2 pb-1">
                {selectedExams.map((ex) => {
                  const isLab = ex.type === "lab";
                  const isCustom = ex.type === "custom";
                  return (
                    <span
                      key={ex.name}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5",
                        isLab
                          ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-300"
                          : isCustom
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-300"
                            : "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800/50 dark:text-purple-300",
                      )}
                    >
                      {isLab ? (
                        <TestTube2 className="h-3 w-3 opacity-70" />
                      ) : isCustom ? (
                        <Plus className="h-3 w-3 opacity-70" />
                      ) : (
                        <ActivitySquare className="h-3 w-3 opacity-70" />
                      )}
                      {ex.name}
                      <button
                        onClick={() => toggleExam(ex.name, ex.type)}
                        className="ml-1 opacity-50 hover:opacity-100 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end mt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="font-bold uppercase h-11 px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              className="font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 h-11 px-8 shadow-md"
            >
              Confirmar Solicitação
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
