import { motion } from "motion/react";
import { Syringe, CheckCircle2, Clock, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NursingCheck() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Syringe className="h-5 w-5" />
          </div>
          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-rose-500 border-rose-500/20">
            Beira do Leito
          </Badge>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Checagem de Enfermagem</h1>
        <p className="text-muted-foreground font-medium mt-1">
          Aprazamento e controle de medicações administradas.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Medicações no Horário", icon: Clock, value: "24", color: "text-amber-500", bg: "bg-amber-500/10" },
          { title: "Checadas (Última Hora)", icon: CheckCircle2, value: "18", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { title: "Sinais Vitais Pendentes", icon: Activity, value: "5", color: "text-rose-500", bg: "bg-rose-500/10" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="p-6 glass-card border-white/20 dark:border-white/5 relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.title}</span>
                  <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
                </div>
                <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-8 glass-card border-white/20 flex flex-col items-center justify-center text-center min-h-[300px]">
        <Syringe className="h-16 w-16 text-muted-foreground/20 mb-4" />
        <h3 className="text-xl font-bold tracking-tight mb-2">Painel de Checagem em Construção</h3>
        <p className="text-muted-foreground max-w-md text-sm mb-6">
          Esta tela conectará a prescrição do médico (Dipirona 1g) com o tablet da enfermeira para dar o "visto" no horário exato da aplicação.
        </p>
        <Button className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20">
          Simular Aprazamento
        </Button>
      </Card>
    </div>
  );
}
