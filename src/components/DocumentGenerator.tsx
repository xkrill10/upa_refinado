import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, FileText, FileBadge2, CheckCircle2, FileSignature, QrCode, ClipboardCheck } from "lucide-react";
import { Patient } from "@/hooks/use-patients";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DocumentGeneratorProps {
  patient: Patient;
  medications: { medication: string; dosage: string; route: string; frequency: string; duration?: string; recommendations?: string }[];
  doctorName: string;
  crmNumber: string;
  crmState: string;
  hidePediatricOptions?: boolean;
  anamnesis?: string;
  diagnosis?: string;
  outcome?: string;
}

export function DocumentGenerator({ patient, medications, doctorName, crmNumber, crmState, hidePediatricOptions, anamnesis, diagnosis, outcome }: DocumentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [docType, setDocType] = useState<"receita" | "atestado" | "resumo_alta">("receita");
  const [atestadoTemplate, setAtestadoTemplate] = useState<string>("padrao");
  const [receitaTemplate, setReceitaTemplate] = useState<string>("padrao");
  const [atestadoDays, setAtestadoDays] = useState<string>("1");
  const [printCid, setPrintCid] = useState<boolean>(true);
  const [savedAtestadoModels, setSavedAtestadoModels] = useState<{id: string, name: string, content: string}[]>([]);
  const [customAtestadoText, setCustomAtestadoText] = useState("");
  const [newAtestadoModelName, setNewAtestadoModelName] = useState("");
  const [savedReceitaModels, setSavedReceitaModels] = useState<{id: string, name: string, content: string}[]>([]);
  const [customReceitaText, setCustomReceitaText] = useState("");
  const [newReceitaModelName, setNewReceitaModelName] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  // Auto-select pediatric templates if the patient is a child
  React.useEffect(() => {
    if (patient && patient.age !== undefined && patient.age < 12) {
      setReceitaTemplate("pediatrico");
      setAtestadoTemplate("acompanhante");
    } else {
      setReceitaTemplate("padrao");
      setAtestadoTemplate("padrao");
    }
  }, [patient]);

  React.useEffect(() => {
    try {
      const savedAtestados = localStorage.getItem('upa_doctor_atestado_models');
      if (savedAtestados) setSavedAtestadoModels(JSON.parse(savedAtestados));
      const savedReceitas = localStorage.getItem('upa_doctor_receita_models');
      if (savedReceitas) setSavedReceitaModels(JSON.parse(savedReceitas));
    } catch(e) {}
  }, []);

  const handleSaveAtestadoModel = () => {
    if (!newAtestadoModelName || !customAtestadoText) return;
    const newModel = {
      id: Math.random().toString(36).substr(2, 9),
      name: newAtestadoModelName,
      content: customAtestadoText
    };
    const updated = [...savedAtestadoModels, newModel];
    setSavedAtestadoModels(updated);
    localStorage.setItem('upa_doctor_atestado_models', JSON.stringify(updated));
    setNewAtestadoModelName("");
    toast.success("Modelo salvo com sucesso!");
    setAtestadoTemplate(newModel.id);
  };

  const handleSaveReceitaModel = () => {
    if (!newReceitaModelName || !customReceitaText) return;
    const newModel = {
      id: Math.random().toString(36).substr(2, 9),
      name: newReceitaModelName,
      content: customReceitaText
    };
    const updated = [...savedReceitaModels, newModel];
    setSavedReceitaModels(updated);
    localStorage.setItem('upa_doctor_receita_models', JSON.stringify(updated));
    setNewReceitaModelName("");
    toast.success("Modelo salvo com sucesso!");
    setReceitaTemplate(newModel.id);
  };

  const generatePDF = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);
    toast.info("Gerando documento, por favor aguarde...");

    try {
      // Small delay to ensure rendering
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(printRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      
      // A4 format: 210 x 297 mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", margin, margin, contentWidth, contentHeight);
      
      // Open in a new tab for printing
      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");
      
      toast.success("Documento gerado com sucesso!");
      setPreviewOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar o documento.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  // Simulated digital signature hash
  const signatureHash = `${Math.random().toString(36).substring(2, 15).toUpperCase()}-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

  return (
    <>
      <div className="flex gap-2 w-full mt-4">
        <Button 
          type="button"
          variant="outline"
          className="flex-1 bg-white dark:bg-slate-900 border-dashed border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          onClick={() => { setDocType("receita"); setPreviewOpen(true); }}
        >
          <FileText className="h-4 w-4 mr-2 text-emerald-600" /> 
          Gerar Receita
        </Button>
        <Button 
          type="button"
          variant="outline"
          className="flex-1 bg-white dark:bg-slate-900 border-dashed border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          onClick={() => { setDocType("atestado"); setPreviewOpen(true); }}
        >
          <FileBadge2 className="h-4 w-4 mr-2 text-blue-600" /> 
          Gerar Atestado
        </Button>
        <Button 
          type="button"
          variant="outline"
          className="flex-1 bg-white dark:bg-slate-900 border-dashed border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          onClick={() => { setDocType("resumo_alta"); setPreviewOpen(true); }}
        >
          <ClipboardCheck className="h-4 w-4 mr-2 text-orange-600" /> 
          Resumo de Alta
        </Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl w-[95vw] bg-slate-100 dark:bg-slate-900 p-0 border-0 overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="p-4 bg-white dark:bg-slate-950 border-b flex flex-col xl:flex-row items-start xl:items-center justify-between shrink-0 gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center flex-wrap gap-4 w-full xl:w-auto pb-2 xl:pb-0">
              <DialogTitle className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 whitespace-nowrap">
                Visualização de Impressão: {docType === "receita" ? "Receituário" : docType === "atestado" ? "Atestado Médico" : "Resumo de Alta"}
              </DialogTitle>
              {docType === "atestado" && (
                 <div className="flex flex-wrap items-center gap-2">
                   <select 
                     className="text-xs p-2 border rounded-xl border-slate-300 font-bold bg-slate-50 text-slate-700 outline-none focus:border-emerald-500 transition-colors"
                     value={atestadoTemplate}
                     onChange={(e) => setAtestadoTemplate(e.target.value as any)}
                   >
                     <optgroup label="Atestados e Declarações">
                       <option value="padrao">Modelo Padrão (Repouso)</option>
                       <option value="comparecimento">Declaração de Comparecimento</option>
                       {!hidePediatricOptions && <option value="acompanhante">Atestado para Acompanhante / Pediátrico</option>}
                       <option value="fasttrack">Atestado Fast Track (Sintomáticos)</option>
                       <option value="isolamento">Isolamento Sanitário (Infectocontagiosas)</option>
                     </optgroup>
                     <optgroup label="Relatórios e Encaminhamentos">
                       <option value="encaminhamento">Encaminhamento Médico (UBS/Especialista)</option>
                       <option value="transferencia">Relatório de Transferência (Sala Vermelha)</option>
                       <option value="recusa">Termo de Alta a Pedido / Recusa Médica</option>
                     </optgroup>
                     {savedAtestadoModels.length > 0 && (
                       <optgroup label="Meus Modelos Salvos">
                         {savedAtestadoModels.map(model => (
                           <option key={model.id} value={model.id}>{model.name}</option>
                         ))}
                       </optgroup>
                     )}
                     <optgroup label="Personalizado">
                       <option value="custom">➕ Criar Novo Modelo...</option>
                     </optgroup>
                   </select>
                   {atestadoTemplate === "custom" && (
                      <div className="flex items-center gap-2 ml-2">
                        <input 
                          type="text" 
                          placeholder="Nome do Modelo..." 
                          value={newAtestadoModelName} 
                          onChange={e => setNewAtestadoModelName(e.target.value)} 
                          className="h-8 text-xs font-bold border rounded-lg border-slate-300 outline-none px-2 w-32" 
                        />
                        <Button size="sm" className="h-8 text-[10px] px-2 py-0" onClick={handleSaveAtestadoModel}>Salvar</Button>
                      </div>
                   )}
                   {(atestadoTemplate === "padrao" || atestadoTemplate === "acompanhante" || atestadoTemplate === "fasttrack" || atestadoTemplate === "isolamento" || savedAtestadoModels.some(m => m.id === atestadoTemplate)) && (
                     <>
                       <div className="flex items-center gap-2 ml-2">
                         <span className="text-xs font-bold text-slate-500 uppercase">Dias:</span>
                         <input 
                           type="number" 
                           min="1" 
                           value={atestadoDays} 
                           onChange={(e) => setAtestadoDays(e.target.value)} 
                           className="w-16 h-8 text-xs font-bold text-center border rounded-lg border-slate-300 outline-none" 
                         />
                       </div>
                       <label className="flex items-center gap-2 ml-2 cursor-pointer">
                         <input 
                           type="checkbox" 
                           checked={printCid} 
                           onChange={(e) => setPrintCid(e.target.checked)} 
                           className="rounded border-slate-300 text-emerald-600 w-4 h-4"
                         />
                         <span className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Imprimir CID</span>
                       </label>
                     </>
                   )}
                 </div>
              )}
              {docType === "receita" && (
                 <div className="flex flex-wrap items-center gap-2">
                   <select 
                     className="text-xs p-2 border rounded-xl border-slate-300 font-bold bg-slate-50 text-slate-700 outline-none focus:border-emerald-500 transition-colors"
                     value={receitaTemplate}
                     onChange={(e) => setReceitaTemplate(e.target.value)}
                   >
                     <optgroup label="Receituários">
                       <option value="padrao">Receituário Padrão (Branca)</option>
                       {!hidePediatricOptions && <option value="pediatrico">Receituário Pediátrico</option>}
                       <option value="uso_continuo">Receituário de Uso Contínuo</option>
                     </optgroup>
                     <optgroup label="Retenção de Receita (2 Vias)">
                       <option value="antimicrobiano">Receita de Antimicrobianos</option>
                       <option value="controle_especial">Controle Especial</option>
                     </optgroup>
                     <optgroup label="Instruções">
                       <option value="orientacoes">Orientações de Alta / Sinais de Alarme</option>
                     </optgroup>
                     {savedReceitaModels.length > 0 && (
                       <optgroup label="Meus Modelos Salvos">
                         {savedReceitaModels.map(model => (
                           <option key={model.id} value={model.id}>{model.name}</option>
                         ))}
                       </optgroup>
                     )}
                     <optgroup label="Personalizado">
                       <option value="custom">➕ Criar Novo Modelo...</option>
                     </optgroup>
                   </select>
                   {receitaTemplate === "custom" && (
                      <div className="flex items-center gap-2 ml-2">
                        <input 
                          type="text" 
                          placeholder="Nome do Modelo..." 
                          value={newReceitaModelName} 
                          onChange={e => setNewReceitaModelName(e.target.value)} 
                          className="h-8 text-xs font-bold border rounded-lg border-slate-300 outline-none px-2 w-32" 
                        />
                        <Button size="sm" className="h-8 text-[10px] px-2 py-0" onClick={handleSaveReceitaModel}>Salvar</Button>
                      </div>
                   )}
                 </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-end xl:mr-10">
              <Button onClick={generatePDF} disabled={isGenerating} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-black uppercase">
                <Printer className="h-4 w-4" />
                {isGenerating ? "Gerando PDF..." : "Imprimir / PDF"}
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-200 dark:bg-slate-800">
            {/* A4 Paper Container */}
            <div 
              className="bg-white shadow-2xl relative" 
              style={{ 
                width: "210mm", 
                minHeight: "297mm", 
                padding: "20mm" 
              }}
            >
              {/* Reference wrapper for html2canvas */}
              <div ref={printRef} className="w-full h-full bg-white text-black flex flex-col font-sans" style={{ width: "170mm", minHeight: "257mm" }}>
                
                {/* Cabeçalho */}
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-[#006699] rounded-xl flex items-center justify-center text-white">
                      <span className="font-black text-2xl">UPA</span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-none">Unidade de Pronto Atendimento</h1>
                      <p className="text-sm font-medium text-slate-500 mt-1">Serviço de Pronto Atendimento 24h</p>
                      <p className="text-xs text-slate-400">Av. Principal, 1000 - Centro - SUS</p>
                    </div>
                  </div>
                </div>

                {/* Dados do Paciente */}
                <div className="bg-slate-50 p-4 rounded-lg mb-8 border border-slate-200">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Paciente</p>
                  <h2 className="text-xl font-black uppercase text-slate-900">{patient.name}</h2>
                  <div className="flex gap-6 mt-2 text-sm text-slate-600 font-medium">
                    <p>Idade: {patient.age} anos</p>
                    <p>CPF: {patient.cpf || "Não informado"}</p>
                    <p>Data do Atendimento: {currentDate}</p>
                  </div>
                </div>

                {/* Conteúdo Dinâmico */}
                <div className="flex-1">
                  {docType === "receita" && (
                    <>
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-black uppercase text-slate-800 pb-2 border-b border-slate-200 inline-block px-12">
                          {receitaTemplate === "padrao" && "Receituário Médico"}
                          {receitaTemplate === "pediatrico" && "Receituário Pediátrico"}
                          {receitaTemplate === "uso_continuo" && "Receituário de Uso Contínuo"}
                          {receitaTemplate === "antimicrobiano" && "Receituário de Antimicrobianos"}
                          {receitaTemplate === "controle_especial" && "Receituário de Controle Especial"}
                          {receitaTemplate === "orientacoes" && "Orientações de Alta Médica"}
                          {receitaTemplate === "custom" && "Receituário Médico"}
                          {savedReceitaModels.find(m => m.id === receitaTemplate) && "Receituário Médico"}
                        </h3>
                        {(receitaTemplate === "antimicrobiano" || receitaTemplate === "controle_especial") && (
                          <p className="text-xs font-bold text-slate-500 mt-2 tracking-widest uppercase">
                            1ª Via: Retida na Farmácia / 2ª Via: Paciente
                          </p>
                        )}
                        {receitaTemplate === "uso_continuo" && (
                          <p className="text-xs font-bold text-slate-500 mt-2 tracking-widest uppercase">
                            Validade de 6 meses a partir da data de emissão
                          </p>
                        )}
                        {receitaTemplate === "orientacoes" && (
                          <p className="text-xs font-bold text-red-500 mt-2 tracking-widest uppercase">
                            Em caso de piora, retorne imediatamente à Unidade
                          </p>
                        )}
                      </div>
                      
                      {receitaTemplate === "custom" || savedReceitaModels.find(m => m.id === receitaTemplate) ? (
                        <div className="w-full mt-8">
                          {receitaTemplate === "custom" ? (
                            <textarea 
                              className="w-full min-h-[400px] text-lg leading-relaxed text-slate-800 font-medium bg-transparent border-none resize-none focus:outline-none placeholder:text-slate-300 overflow-hidden"
                              placeholder="Digite a sua receita livremente aqui.&#10;Este texto será impresso exatamente como você digitar, sem formatação da lista estruturada."
                              value={customReceitaText}
                              onChange={(e) => setCustomReceitaText(e.target.value)}
                            />
                          ) : (
                            <div className="text-lg leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                              {savedReceitaModels.find(m => m.id === receitaTemplate)?.content}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {medications.length === 0 ? (
                            <p className="text-center text-slate-400 font-medium italic">Nenhum medicamento prescrito para uso externo.</p>
                          ) : (
                            medications.map((med, idx) => (
                              <div key={idx} className={`flex gap-4 p-4 hover:bg-slate-50 rounded-lg transition-colors border-l-4 ${
                                receitaTemplate === "pediatrico" ? "border-purple-500" :
                                receitaTemplate === "antimicrobiano" ? "border-red-500" :
                                receitaTemplate === "controle_especial" ? "border-blue-500" :
                                receitaTemplate === "uso_continuo" ? "border-teal-500" :
                                receitaTemplate === "orientacoes" ? "border-orange-500" :
                                "border-emerald-500"
                              }`}>
                                <div className={`font-black text-lg w-6 ${
                                  receitaTemplate === "pediatrico" ? "text-purple-700" :
                                  receitaTemplate === "antimicrobiano" ? "text-red-700" :
                                  receitaTemplate === "controle_especial" ? "text-blue-700" :
                                  receitaTemplate === "uso_continuo" ? "text-teal-700" :
                                  receitaTemplate === "orientacoes" ? "text-orange-700" :
                                  "text-emerald-700"
                                }`}>
                                  {idx + 1}.
                                </div>
                                <div>
                                  <p className="font-black text-lg uppercase text-slate-900 mb-1">{med.medication}</p>
                                  <div className="text-sm font-medium text-slate-700 space-y-1">
                                    <p><strong>Dose:</strong> {med.dosage}</p>
                                    <p><strong>Via de Administração:</strong> {med.route}</p>
                                    <p><strong>Frequência:</strong> {med.frequency}</p>
                                    {med.duration && <p><strong>Duração:</strong> {med.duration}</p>}
                                    {med.recommendations && <p className="mt-2 text-slate-600 bg-slate-50 p-2 rounded border border-slate-100"><strong>Orientações:</strong> {med.recommendations}</p>}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {docType === "atestado" && (
                    <>
                      <h3 className="text-2xl font-black uppercase text-slate-800 text-center mb-8 pb-2 border-b border-slate-200 inline-block px-12 mx-auto">
                        {atestadoTemplate === "comparecimento" ? "Declaração de Comparecimento" : 
                         atestadoTemplate === "encaminhamento" ? "Encaminhamento Médico" : 
                         atestadoTemplate === "transferencia" ? "Relatório de Transferência" : 
                         atestadoTemplate === "recusa" ? "Termo de Alta a Pedido" : 
                         "Atestado Médico"}
                      </h3>
                      
                      {atestadoTemplate === "padrao" && (
                        <>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-8 text-justify indent-8">
                            Atesto para os devidos fins que o(a) paciente <strong>{patient.name}</strong>, inscrito(a) no CPF sob o nº <strong>{patient.cpf || "não informado"}</strong>, esteve sob meus cuidados médicos nesta unidade de pronto atendimento na data de <strong>{currentDate}</strong>.
                          </div>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-4 text-justify indent-8">
                            Necessita de <strong>{atestadoDays} dia(s)</strong> de repouso absoluto a partir desta data, por motivo de saúde{printCid ? (diagnosis ? ` (CID-10: ${diagnosis})` : ` (CID-10: _____)`) : ""}, não podendo exercer suas atividades laborais e/ou acadêmicas durante este período.
                          </div>
                        </>
                      )}
                      
                      {atestadoTemplate === "comparecimento" && (
                        <>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-8 text-justify indent-8">
                            Declaro para os devidos fins que o(a) paciente <strong>{patient.name}</strong>, inscrito(a) no CPF sob o nº <strong>{patient.cpf || "não informado"}</strong>, esteve presente nesta Unidade de Pronto Atendimento na data de <strong>{currentDate}</strong>, no período das <strong>[ __:__ ] às [ __:__ ]</strong>, para atendimento médico.
                          </div>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-4 text-justify indent-8">
                            Esta declaração não justifica ausência prolongada ao trabalho, limitando-se apenas às horas em que o paciente esteve na unidade.
                          </div>
                        </>
                      )}
                      
                      {atestadoTemplate === "acompanhante" && (
                        <>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-8 text-justify indent-8">
                            Atesto para os devidos fins que o(a) Sr(a). <strong>___________________________________</strong>, inscrito(a) no CPF/RG sob o nº <strong>__________________</strong>, esteve nesta unidade de pronto atendimento na data de <strong>{currentDate}</strong> acompanhando o(a) paciente menor/incapaz <strong>{patient.name}</strong>.
                          </div>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-4 text-justify indent-8">
                            O(A) paciente necessita de <strong>{atestadoDays} dia(s)</strong> de repouso por motivo de saúde{printCid ? (diagnosis ? ` (CID-10: ${diagnosis})` : ` (CID-10: _____)`) : ""}, sendo indispensável o acompanhamento do responsável legal durante todo este período.
                          </div>
                        </>
                      )}
                      
                      {atestadoTemplate === "fasttrack" && (
                        <>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-8 text-justify indent-8">
                            Atesto para os devidos fins, após avaliação médica simplificada no fluxo Fast Track (Sintomáticos), que o(a) paciente <strong>{patient.name}</strong>, inscrito(a) no CPF sob o nº <strong>{patient.cpf || "não informado"}</strong>, compareceu a esta unidade na data de <strong>{currentDate}</strong>.
                          </div>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-4 text-justify indent-8">
                            Necessita de <strong>{atestadoDays} dia(s)</strong> de repouso domiciliar a partir desta data para tratamento e observação de quadro viral / sintomático leve{printCid ? (diagnosis ? ` (CID-10: ${diagnosis})` : ` (CID-10: _____)`) : ""}.
                          </div>
                        </>
                      )}

                      {atestadoTemplate === "isolamento" && (
                        <>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-8 text-justify indent-8">
                            Atesto para os devidos fins que o(a) paciente <strong>{patient.name}</strong>, portador(a) do CPF <strong>{patient.cpf || "não informado"}</strong>, foi avaliado(a) nesta unidade com suspeita clínica ou confirmação de doença infectocontagiosa{printCid ? (diagnosis ? ` (CID-10: ${diagnosis})` : ` (CID-10: _____)`) : ""}.
                          </div>
                          <div className="text-lg leading-relaxed text-red-700 font-bold mt-4 text-justify indent-8">
                            Por determinação sanitária, o paciente necessita de <strong>{atestadoDays} dia(s)</strong> de isolamento domiciliar rigoroso a partir de <strong>{currentDate}</strong>, estando expressamente impedido(a) de frequentar ambientes laborais, acadêmicos ou aglomerações.
                          </div>
                        </>
                      )}

                      {atestadoTemplate === "encaminhamento" && (
                        <>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-8 text-justify indent-8">
                            Encaminho o(a) paciente <strong>{patient.name}</strong>, {patient.age} anos, para avaliação e seguimento na especialidade de <strong>[ ___________________________ ]</strong> na rede de atenção secundária/primária.
                          </div>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-4 text-justify indent-8">
                            <strong>Motivo / Resumo Clínico:</strong> Paciente apresentou quadro de [ _________________________________ ] sendo realizado atendimento inicial nesta UPA. Solicito avaliação especializada para conduta definitiva.
                          </div>
                        </>
                      )}

                      {atestadoTemplate === "transferencia" && (
                        <>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-8 text-justify indent-8">
                            O(A) paciente <strong>{patient.name}</strong>, {patient.age} anos, encontra-se internado(a) nesta UPA na data de <strong>{currentDate}</strong> devido a quadro de [ _________________________________ ].
                          </div>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-4 text-justify indent-8">
                            <strong>Situação Atual:</strong> Paciente estabilizado, porém com indicação absoluta de transferência via SAMU/CROSS para hospital de referência nível terciário para avaliação com cirurgia geral / neurocirurgia / UTI.
                          </div>
                        </>
                      )}

                      {atestadoTemplate === "recusa" && (
                        <>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-8 text-justify indent-8">
                            Eu, <strong>{patient.name}</strong> (ou responsável), inscrito no CPF <strong>{patient.cpf || "não informado"}</strong>, declaro ter sido amplamente informado(a) pelo corpo clínico desta UPA sobre a gravidade do meu quadro clínico e os riscos inerentes de interrupção do tratamento (incluindo risco de morte ou sequelas graves).
                          </div>
                          <div className="text-lg leading-relaxed text-slate-800 font-medium mt-4 text-justify indent-8">
                            Ainda assim, decido por minha livre e espontânea vontade solicitar <strong>ALTA A PEDIDO / EVASÃO</strong>, assumindo inteira responsabilidade civil e criminal por esta decisão e isentando a equipe médica e a instituição de qualquer responsabilidade futura.
                          </div>
                          <div className="mt-12 w-full flex justify-center">
                             <div className="w-80 border-b border-slate-400 text-center pb-1 text-xs font-bold text-slate-500">
                               Assinatura do Paciente / Responsável
                             </div>
                          </div>
                        </>
                      )}

                      {atestadoTemplate === "custom" && (
                        <div className="w-full">
                          <textarea 
                            className="w-full min-h-[200px] text-lg leading-relaxed text-slate-800 font-medium mt-8 text-justify indent-8 bg-transparent border-none resize-none focus:outline-none placeholder:text-slate-300 overflow-hidden"
                            placeholder="Digite o texto do seu atestado aqui.&#10;DICA: Você pode usar variáveis como [DIAS] ou [CID].&#10;&#10;Ao imprimir ou salvar, este será o texto exibido no corpo do documento. O cabeçalho (dados do paciente) e o rodapé (sua assinatura) serão inseridos automaticamente pelo sistema."
                            value={customAtestadoText}
                            onChange={(e) => setCustomAtestadoText(e.target.value)}
                          />
                        </div>
                      )}
                      
                      {savedAtestadoModels.find(m => m.id === atestadoTemplate) && (
                        <div className="text-lg leading-relaxed text-slate-800 font-medium mt-8 text-justify indent-8 whitespace-pre-wrap">
                          {savedAtestadoModels.find(m => m.id === atestadoTemplate)?.content
                            .replace(/\[DIAS\]/g, atestadoDays)
                            .replace(/\[CID\]/g, diagnosis || "_____")
                          }
                        </div>
                      )}
                    </>
                  )}


              {docType === "resumo_alta" && (
                <div className="space-y-8 flex-1 pb-32">
                  <h3 className="text-2xl font-black uppercase text-slate-800 text-center mb-8 pb-2 border-b border-slate-200 inline-block px-12 mx-auto flex items-center justify-center">
                    Resumo de Atendimento / Alta
                  </h3>

                  <div className="space-y-6 px-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1">Anamnese / Evolução Clínica</h4>
                      <div className="text-sm text-slate-800 whitespace-pre-wrap">{anamnesis || "Nenhuma evolução registrada para este atendimento."}</div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1">Diagnóstico Principal / CID</h4>
                      <div className="text-sm text-slate-800 whitespace-pre-wrap">{diagnosis || "Não especificado."}</div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1">Desfecho Clínico</h4>
                      <div className="text-sm font-bold text-slate-800 uppercase bg-slate-100 p-2 rounded-lg inline-block">
                        {outcome === "alta" ? "Alta Médica (Liberação / Melhora)" : 
                         outcome === "encaminhamento" ? "Alta com Encaminhamento (Rede Básica / Especialidade)" :
                         outcome === "alta_pedido" ? "Alta a Pedido (Termo de Responsabilidade / Evasão)" :
                         outcome === "observacao" ? "Retenção: Sala de Medicação / Observação" :
                         outcome === "exames" ? "Retenção: Aguardar Exames (Retorno)" :
                         outcome === "internacao" ? "Internação (Leito UPA)" :
                         outcome === "transferencia" ? "Transferência Hospitalar (Vaga CROSS / SAMU)" :
                         outcome === "obito" ? "Óbito" : "Não informado no sistema"}
                      </div>
                    </div>

                    <div className="space-y-2 mt-8">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1">Prescrição Médica na Unidade</h4>
                      {medications && medications.length > 0 ? (
                        <div className="space-y-3 mt-2">
                          {medications.map((med, idx) => (
                            <div key={idx} className="flex gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="font-black text-sm text-slate-400">{idx + 1}.</div>
                              <div>
                                <div className="font-bold text-sm text-slate-800 uppercase">{med.medication}</div>
                                <div className="text-xs text-slate-500 flex gap-4 mt-1 font-medium">
                                  <span>Dose: {med.dosage}</span>
                                  <span>Via: {med.route}</span>
                                  <span>Freq: {med.frequency}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 italic">Nenhuma medicação registrada no sistema durante o atendimento.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé e Assinaturas */}
                <div className="mt-16 pt-8 flex flex-col items-center justify-end">
                  
                  {/* Opção 1: Assinatura Digital / ICP Brasil (Simulada) */}
                  <div className="w-full flex items-center justify-between border border-slate-200 bg-slate-50 p-4 rounded-xl mb-12">
                    <div className="flex items-center gap-3">
                      <QrCode className="h-16 w-16 text-slate-800" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Documento Assinado Digitalmente
                        </p>
                        <p className="text-xs font-bold text-slate-700 mt-1">Validação ICP-Brasil</p>
                        <p className="text-[9px] font-mono text-slate-500 mt-1">HASH: {signatureHash}</p>
                        <p className="text-[8px] font-bold text-slate-400 mt-1">Acesse validar.iti.gov.br para confirmar a autenticidade.</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black uppercase text-slate-900">{doctorName || "Médico Não Identificado"}</p>
                      <p className="text-xs font-bold text-slate-600">CRM {crmState} {crmNumber || "---"}</p>
                    </div>
                  </div>

                  {/* Opção 2: Linha para Assinatura Física */}
                  <div className="flex flex-col items-center w-80 mb-8">
                    <div className="w-full border-b border-slate-800 mb-2 relative">
                       <FileSignature className="h-6 w-6 text-slate-300 absolute -top-8 left-1/2 -translate-x-1/2 opacity-50" />
                    </div>
                    <p className="text-sm font-black uppercase text-slate-900 text-center">{doctorName || "Assinatura do Médico"}</p>
                    <p className="text-xs font-bold text-slate-600 text-center">CRM {crmState} {crmNumber || "---"}</p>
                  </div>

                  <p className="text-[10px] text-slate-400 font-medium w-full text-center border-t border-slate-100 pt-4">
                    Este documento é válido em todo o território nacional. A falsificação é crime previsto em lei.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
