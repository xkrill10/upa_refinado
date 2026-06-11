import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ShieldCheck,
  Activity,
  AlertTriangle,
  FileText,
  Download,
  Filter,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type ActionType =
  | "VISUALIZAÇÃO"
  | "EDIÇÃO"
  | "EXCLUSÃO"
  | "EXPORTAÇÃO"
  | "LOGIN";
type ModuleType = "Prontuário" | "Escala" | "Faturamento" | "RH" | "Sistema";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: ActionType;
  module: ModuleType;
  details: string;
  ip: string;
}

const mockLogs: AuditLog[] = [
  {
    id: "LOG-001",
    timestamp: "10/06/2026 14:30:12",
    user: "Enf. Maria Oliveira",
    role: "Enfermeira",
    action: "VISUALIZAÇÃO",
    module: "Prontuário",
    details: "Acessou ficha médica do paciente Silva (ID: 4589)",
    ip: "192.168.1.45",
  },
  {
    id: "LOG-002",
    timestamp: "10/06/2026 14:28:05",
    user: "Dr. Ricardo Braga",
    role: "Médico",
    action: "EDIÇÃO",
    module: "Prontuário",
    details: "Adicionou evolução médica (Evolução Clínica) para paciente Lima",
    ip: "192.168.1.112",
  },
  {
    id: "LOG-003",
    timestamp: "10/06/2026 14:15:22",
    user: "Carlos Souza",
    role: "Coordenador",
    action: "EXCLUSÃO",
    module: "Escala",
    details: "Removeu turno Noturno B do colaborador Pedro Santos",
    ip: "192.168.1.88",
  },
  {
    id: "LOG-004",
    timestamp: "10/06/2026 13:50:00",
    user: "Admin Sistema",
    role: "Administrador",
    action: "EXPORTAÇÃO",
    module: "Faturamento",
    details: "Exportou relatório consolidado do mês de Junho em PDF",
    ip: "192.168.1.10",
  },
  {
    id: "LOG-005",
    timestamp: "10/06/2026 13:45:10",
    user: "Enf. Juliana",
    role: "Enfermeira",
    action: "VISUALIZAÇÃO",
    module: "Escala",
    details: "Acessou o painel de Escala Global",
    ip: "192.168.1.47",
  },
  {
    id: "LOG-006",
    timestamp: "10/06/2026 13:30:00",
    user: "Desconhecido",
    role: "N/A",
    action: "LOGIN",
    module: "Sistema",
    details: "Tentativa de login falha repetida (3x)",
    ip: "172.16.0.45",
  },
];

const getActionColor = (action: ActionType) => {
  switch (action) {
    case "VISUALIZAÇÃO":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "EDIÇÃO":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    case "EXCLUSÃO":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
    case "EXPORTAÇÃO":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    case "LOGIN":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState<string>("all");

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm);
    const matchesModule = filterModule === "all" || log.module === filterModule;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
                Registro de Auditoria
              </h1>
              <h2 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                Conformidade LGPD & Monitoramento
              </h2>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Rastreabilidade completa de acessos, alterações e exportações de
            dados sensíveis no sistema UPA Control, garantindo total
            conformidade com a Lei Geral de Proteção de Dados.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 font-semibold">
            <Download className="h-4 w-4" /> Exportar Logs (.CSV)
          </Button>
          <Button className="gap-2 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
            <FileText className="h-4 w-4" /> Gerar Relatório LGPD
          </Button>
        </div>
      </div>

      {/* Stats/Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-slate-200/60 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Acessos Hoje
              </p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">
                1,284
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200/60 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Edições Críticas
              </p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">
                42
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200/60 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Exportações
              </p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">
                8
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Alertas de Segurança
              </p>
              <p className="text-2xl font-black text-red-700 dark:text-red-400">
                3
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-md border-slate-200/60 dark:border-slate-800 overflow-hidden flex flex-col flex-1">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Filter className="h-4 w-4 text-indigo-500" /> Trilha de Eventos
              (Audit Trail)
            </CardTitle>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por usuário, ação ou IP..."
                  className="pl-9 h-9 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger className="w-[180px] h-9 text-sm font-medium">
                  <SelectValue placeholder="Todos os Módulos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Módulos</SelectItem>
                  <SelectItem value="Prontuário">
                    Prontuário Eletrônico
                  </SelectItem>
                  <SelectItem value="Escala">Escala de Plantão</SelectItem>
                  <SelectItem value="Faturamento">Faturamento</SelectItem>
                  <SelectItem value="Sistema">
                    Sistema (Login/Acesso)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                  Data / Hora
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                  Ação
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                  Módulo
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                  Detalhes Técnicos
                </th>
                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                  Endereço IP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {log.timestamp.split(" ")[0]}
                    </span>
                    <span className="text-slate-400 ml-2 text-xs">
                      {log.timestamp.split(" ")[1]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <User className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "font-bold",
                            log.user === "Desconhecido"
                              ? "text-red-600"
                              : "text-slate-800 dark:text-slate-200",
                          )}
                        >
                          {log.user}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                          {log.role}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] uppercase font-bold px-2 py-0.5",
                        getActionColor(log.action),
                      )}
                    >
                      {log.action}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {log.module}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 max-w-[300px] truncate text-slate-600 dark:text-slate-400"
                    title={log.details}
                  >
                    {log.details}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-xs">
                    {log.ip}
                  </td>
                </motion.tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Nenhum registro encontrado para os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
