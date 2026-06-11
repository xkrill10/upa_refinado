import { usePatients } from "@/hooks/use-patients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Clock,
  Baby,
  Stethoscope,
  ShieldCheck,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTOR_GROUPS = [
  {
    id: "emergency",
    label: "Emergência",
    icon: AlertCircle,
    color: "text-red-500 dark:text-red-400",
    progressColor: "bg-red-500",
    max: 6 + 1 + 1 + 1 + 1 + 1, // 11
    sectors: [
      "SALA VERMELHA",
      "SALA DE EMERGÊNCIA 1",
      "SALA DE EMERGÊNCIA 2",
      "SALA DE EMERGÊNCIA 3",
      "RECON 1",
      "RECON 2",
    ],
  },
  {
    id: "observation",
    label: "Observação",
    icon: Clock,
    color: "text-amber-500 dark:text-amber-400",
    progressColor: "bg-amber-500",
    max: 15 + 10 + 10 + 1 + 1 + 5, // 42
    sectors: [
      "SALA AMARELA",
      "SALA MASCULINA",
      "SALA FEMININA",
      "QUARTO DE ATENÇÃO 1",
      "QUARTO DE ATENÇÃO 2",
      "LEITO DE OBSERVAÇÃO 1",
      "LEITO DE OBSERVAÇÃO 2",
      "LEITO DE OBSERVAÇÃO 3",
      "LEITO DE OBSERVAÇÃO 4",
      "LEITO DE OBSERVAÇÃO 5",
    ],
  },
  {
    id: "pediatric",
    label: "Pediatria",
    icon: Baby,
    color: "text-blue-500 dark:text-blue-400",
    progressColor: "bg-blue-500",
    max: 8 + 4 + 4 + 6 + 3, // 25
    sectors: [
      "OBSERVAÇÃO PEDIÁTRICA",
      "TRIAGEM INFANTIL 1",
      "TRIAGEM INFANTIL 2",
      "MEDICAÇÃO INFANTIL",
      "CONSULTÓRIO PEDIÁTRICO 1",
      "CONSULTÓRIO PEDIÁTRICO 2",
      "CONSULTÓRIO PEDIÁTRICO 3",
    ],
  },
  {
    id: "services",
    label: "Atendimento",
    icon: Stethoscope,
    color: "text-emerald-500 dark:text-emerald-400",
    progressColor: "bg-emerald-500",
    max: 1 + 1 + 1 + 6 + 2 + 2 + 6, // 19
    sectors: [
      "TRIAGEM 1",
      "TRIAGEM 2",
      "TRIAGEM 3",
      "SALA DE COLETA",
      "SALA DE SUTURA",
      "SALA DE CURATIVOS",
      "FAST TRACK",
      "CONSULTÓRIO CLÍNICO 1",
      "CONSULTÓRIO CLÍNICO 2",
      "CONSULTÓRIO CLÍNICO 3",
      "CONSULTÓRIO CLÍNICO 4",
      "CONSULTÓRIO CLÍNICO 5",
    ],
  },
  {
    id: "support",
    label: "Apoio / NIR",
    icon: ShieldCheck,
    color: "text-purple-500 dark:text-purple-400",
    progressColor: "bg-purple-500",
    max: 50 + 2 + 4 + 2, // 58
    sectors: [
      "FARMÁCIA",
      "ASSISTÊNCIA SOCIAL",
      "SALA DE NIR",
      "RADIOLOGIA / RAIO-X",
    ],
  },
];

export function MiniMapaSatores({ onClick }: { onClick?: () => void }) {
  const { patients } = usePatients();

  return (
    <Card
      className="glass-card-premium rounded-xl overflow-hidden h-full cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
      onClick={onClick}
    >
      <CardHeader className="p-6 pb-3 border-b border-white/20 bg-muted/30">
        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <Map className="h-4 w-4 text-[#006699]" /> Mini Mapa de Setores
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {SECTOR_GROUPS.map((group) => {
            // Conta os pacientes não finalizados que estão nos setores deste grupo
            const currentCount = patients.filter(
              (p) =>
                p.status !== "completed" && group.sectors.includes(p.sector),
            ).length;

            const percentage =
              Math.min(100, Math.round((currentCount / group.max) * 100)) || 0;

            return (
              <div key={group.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase">
                  <div className="flex items-center gap-1.5">
                    <group.icon className={cn("h-3.5 w-3.5", group.color)} />
                    <span className="text-muted-foreground">{group.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        percentage > 80
                          ? "text-red-500"
                          : percentage > 50
                            ? "text-amber-500"
                            : "text-emerald-500",
                      )}
                    >
                      {percentage}%
                    </span>
                    <span className="text-[9px] text-muted-foreground opacity-60">
                      ({currentCount}/{group.max})
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/5">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      group.progressColor,
                      percentage > 90 ? "animate-pulse" : "",
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
