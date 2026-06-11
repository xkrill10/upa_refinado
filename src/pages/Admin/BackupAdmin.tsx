import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DatabaseBackup,
  HardDrive,
  ShieldAlert,
  Cloud,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function BackupAdmin() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [progress, setProgress] = useState(0);

  const startBackup = () => {
    setIsBackingUp(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const backupHistory = [
    {
      id: "BK-882",
      date: "09/06/2026 23:00",
      size: "2.4 GB",
      type: "Automático",
      status: "success",
    },
    {
      id: "BK-881",
      date: "08/06/2026 23:00",
      size: "2.3 GB",
      type: "Automático",
      status: "success",
    },
    {
      id: "BK-880",
      date: "07/06/2026 23:00",
      size: "2.3 GB",
      type: "Automático",
      status: "success",
    },
    {
      id: "BK-879",
      date: "06/06/2026 14:20",
      size: "2.1 GB",
      type: "Manual",
      status: "warning",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full pb-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
          <DatabaseBackup className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
            Gestão de Backups
          </h1>
          <h2 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Segurança de Dados e Continuidade
          </h2>
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
        Painel de demonstração para a configuração de rotinas de backup
        automático (Bicapo) e espelhamento em nuvem, garantindo disponibilidade
        de dados LGPD.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-slate-200/60 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Último Backup
              </p>
              <p className="text-lg font-black text-slate-800 dark:text-white">
                Há 12 horas
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200/60 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Armazenamento Cloud
              </p>
              <p className="text-lg font-black text-slate-800 dark:text-white">
                45.2 GB Usados
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Retenção Ativa
              </p>
              <p className="text-lg font-black text-amber-700 dark:text-amber-400">
                30 Dias (Diários)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-slate-200/60 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-emerald-500" />
              Executar Backup Manual
            </CardTitle>
            <CardDescription>
              Inicie uma cópia de segurança imediata de todo o banco de dados e
              arquivos anexos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            {!isBackingUp && progress === 0 ? (
              <Button
                onClick={startBackup}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold px-8 py-6 rounded-full shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105"
              >
                <DatabaseBackup className="h-5 w-5" /> INICIAR BACKUP AGORA
              </Button>
            ) : (
              <div className="w-full max-w-md flex flex-col items-center gap-4">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {progress < 100
                    ? `Copiando dados sensíveis... ${progress}%`
                    : "Backup concluído com sucesso!"}
                </p>
                {progress === 100 && (
                  <Button
                    variant="outline"
                    onClick={() => setProgress(0)}
                    className="mt-2"
                  >
                    Novo Backup
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200/60 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Histórico de Backups
            </CardTitle>
            <CardDescription>
              Últimas rotinas de salvamento executadas no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backupHistory.map((bkp) => (
                <div
                  key={bkp.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <div className="flex items-center gap-3">
                    {bkp.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                        {bkp.id}
                      </span>
                      <span className="text-xs text-slate-500">{bkp.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-bold"
                    >
                      {bkp.type}
                    </Badge>
                    <span className="text-sm font-mono text-slate-600 dark:text-slate-400">
                      {bkp.size}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
