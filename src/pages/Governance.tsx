import { motion } from "motion/react";
import { Bed, Sparkles, AlertCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Governance() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-cyan-600 border-cyan-500/20">
            Hotelaria Hospitalar
          </Badge>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Governança & Higienização</h1>
        <p className="text-muted-foreground font-medium mt-1">
          Painel de controle de limpeza e liberação de leitos.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Aguardando Limpeza", icon: AlertCircle, value: "4", color: "text-amber-500", bg: "bg-amber-500/10" },
          { title: "Em Higienização", icon: Clock, value: "1", color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Leitos Livres", icon: Bed, value: "12", color: "text-emerald-500", bg: "bg-emerald-500/10" },
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
        <Sparkles className="h-16 w-16 text-muted-foreground/20 mb-4" />
        <h3 className="text-xl font-bold tracking-tight mb-2">Painel de Governança em Construção</h3>
        <p className="text-muted-foreground max-w-md text-sm mb-6">
          Nesta tela a equipe de limpeza verá os leitos desocupados que precisam ser higienizados antes de liberar o status de "Livre" na tela da Recepção.
        </p>
        <Button className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8 bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20">
          Simular Liberação de Leito
        </Button>
      </Card>
    </div>
  );
}
