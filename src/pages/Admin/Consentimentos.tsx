import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileSignature,
  Search,
  UserCheck,
  ShieldAlert,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function Consentimentos() {
  const [searchTerm, setSearchTerm] = useState("");

  const consentimentos = [
    {
      paciente: "Maria Aparecida Silva",
      cpf: "123.***.***-00",
      data: "09/06/2026",
      status: "Assinado",
      tipo: "Geral e Compartilhamento",
    },
    {
      paciente: "João Carlos de Oliveira",
      cpf: "456.***.***-11",
      data: "08/06/2026",
      status: "Assinado",
      tipo: "Apenas Atendimento",
    },
    {
      paciente: "Ana Paula de Souza",
      cpf: "789.***.***-22",
      data: "05/06/2026",
      status: "Pendente",
      tipo: "Atualização Cadastral",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full pb-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/20">
          <FileSignature className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
            Termos e Consentimentos
          </h1>
          <h2 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Gestão de Aceite LGPD
          </h2>
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
        Painel de demonstração para a gestão dos Termos de Consentimento Livre e
        Esclarecido (TCLE) assinados pelos pacientes, conforme exigência da
        LGPD.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-slate-200/60 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pacientes com Aceite
              </p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">
                1.458
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200/60 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pendentes de Aceite
              </p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">
                32
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md border-slate-200/60 dark:border-slate-800 mt-4">
        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              Histórico de Consentimentos
            </CardTitle>
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome ou CPF..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                  Paciente / CPF
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                  Tipo de Termo
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-right">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {consentimentos.map((c, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700 dark:text-slate-200">
                      {c.paciente}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      {c.cpf}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                    {c.tipo}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{c.data}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={
                        c.status === "Assinado"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-amber-100 text-amber-700 border-amber-200"
                      }
                    >
                      {c.status === "Assinado" && (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      )}
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    >
                      Visualizar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
