import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Archive, Clock, Trash2, ShieldAlert, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function RetencaoDados() {
  const [isDeleting, setIsDeleting] = useState(false);

  const regras = [
    { tipo: "Prontuários Médicos", retencao: "20 Anos", status: "Legal", registrosAvencer: 0 },
    { tipo: "Logs de Acesso do Sistema", retencao: "6 Meses", status: "Operacional", registrosAvencer: 14520 },
    { tipo: "Câmeras de Segurança", retencao: "30 Dias", status: "Operacional", registrosAvencer: 450 },
    { tipo: "Faturamento e Guias", retencao: "5 Anos", status: "Financeiro", registrosAvencer: 120 },
  ];

  const limparRegistrosVencidos = () => {
    setIsDeleting(true);
    setTimeout(() => setIsDeleting(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full pb-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/20">
          <Archive className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
            Retenção e Descarte
          </h1>
          <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-widest">
            Minimização de Dados (LGPD)
          </h2>
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
        A LGPD exige que dados pessoais sejam mantidos apenas pelo tempo necessário. Este painel (demonstração) gerencia as regras de expiração e expurgo seguro dos dados armazenados no sistema.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Card className="shadow-md border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Atenção: Expurgo Pendente
            </CardTitle>
            <CardDescription>
              Existem registros de logs e câmeras que já ultrapassaram o tempo legal de retenção e precisam ser anonimizados ou apagados.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mx-4 mb-4">
            <div>
              <p className="text-2xl font-black text-red-700 dark:text-red-400">14.970</p>
              <p className="text-xs font-semibold text-red-600 dark:text-red-300 uppercase">Registros Vencidos</p>
            </div>
            <Button 
              variant="destructive" 
              className="gap-2 font-bold shadow-md"
              onClick={limparRegistrosVencidos}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" /> 
              {isDeleting ? "Expurgando..." : "Executar Expurgo Seguro"}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200/60 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-500" />
              Políticas de Retenção Configuradas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {regras.map((regra, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4">
                      <div className="font-bold text-slate-700 dark:text-slate-200">{regra.tipo}</div>
                      <Badge variant="outline" className="mt-1 text-[10px] uppercase">{regra.status}</Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{regra.retencao}</span>
                    </td>
                    <td className="p-4 text-right">
                      {regra.registrosAvencer > 0 ? (
                        <span className="text-red-500 font-bold text-xs">{regra.registrosAvencer} a expurgar</span>
                      ) : (
                        <span className="text-emerald-500 font-bold text-xs">Ok</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
