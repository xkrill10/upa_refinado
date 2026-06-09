import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, EyeOff, ShieldCheck, Database, ArrowRight } from "lucide-react";

export default function Anonimizacao() {
  const [isExporting, setIsExporting] = useState(false);

  const sampleData = [
    { id: 1, nomeOriginal: "Carlos Eduardo Mendes", cpfOriginal: "123.456.789-00", cid: "J01.9", idade: 45, nomeMascarado: "C***** E****** M*****", cpfMascarado: "***.456.***-**" },
    { id: 2, nomeOriginal: "Juliana Alves Pereira", cpfOriginal: "987.654.321-11", cid: "A09", idade: 28, nomeMascarado: "J****** A**** P******", cpfMascarado: "***.654.***-**" },
    { id: 3, nomeOriginal: "Roberto Silva Santos", cpfOriginal: "456.123.789-22", cid: "I10", idade: 62, nomeMascarado: "R****** S**** S*****", cpfMascarado: "***.123.***-**" },
    { id: 4, nomeOriginal: "Fernanda Costa Souza", cpfOriginal: "321.987.654-33", cid: "J45.9", idade: 19, nomeMascarado: "F******* C**** S****", cpfMascarado: "***.987.***-**" },
  ];

  const simulateExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Aqui seria o local para baixar o arquivo CSV
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full pb-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/20">
          <EyeOff className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
            Anonimização de Dados
          </h1>
          <h2 className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
            Exportação Segura para Pesquisas e Relatórios
          </h2>
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
        Painel de demonstração para a extração de dados clínicos (CID, Idade, Gênero) garantindo a proteção da identidade do paciente (PII) por meio de mascaramento automático, fundamental para auditorias externas e pesquisas de saúde.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Painel Original */}
        <Card className="shadow-md border-red-200 dark:border-red-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-red-100 dark:bg-red-900/50 text-red-600 text-[10px] font-bold uppercase rounded-bl-lg">
            Acesso Restrito
          </div>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Database className="h-5 w-5 text-red-500" />
              Banco de Dados (Visão Real)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3 text-slate-500 font-bold uppercase">Paciente</th>
                  <th className="p-3 text-slate-500 font-bold uppercase">CPF Real</th>
                  <th className="p-3 text-slate-500 font-bold uppercase">Diagnóstico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sampleData.map((row) => (
                  <tr key={`orig-${row.id}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-red-700 dark:text-red-400">{row.nomeOriginal}</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{row.cpfOriginal}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{row.cid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Seta de Conversão (visível apenas em telas grandes) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-900 rounded-full p-2 border border-slate-200 dark:border-slate-800 shadow-lg">
          <ArrowRight className="h-6 w-6 text-cyan-500" />
        </div>

        {/* Painel Anonimizado */}
        <Card className="shadow-md border-cyan-200 dark:border-cyan-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 text-[10px] font-bold uppercase rounded-bl-lg">
            LGPD Compliant
          </div>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="h-5 w-5 text-cyan-500" />
              Relatório Exportado (Visão Mascarada)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3 text-slate-500 font-bold uppercase">Paciente (Mascarado)</th>
                  <th className="p-3 text-slate-500 font-bold uppercase">CPF (Mascarado)</th>
                  <th className="p-3 text-slate-500 font-bold uppercase">Diagnóstico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sampleData.map((row) => (
                  <tr key={`mask-${row.id}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-cyan-700 dark:text-cyan-400">{row.nomeMascarado}</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{row.cpfMascarado}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{row.cid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-6">
        <Button 
          size="lg" 
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold gap-3 shadow-lg px-8 py-6 rounded-full transition-all hover:scale-105"
          onClick={simulateExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <span className="flex items-center gap-2">Aplicando Filtros LGPD...</span>
          ) : (
            <>
              <FileDown className="h-5 w-5" /> 
              Exportar Relatório Anonimizado (.CSV)
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
