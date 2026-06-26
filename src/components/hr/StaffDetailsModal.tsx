import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  History,
  MapPin,
  Phone,
  Mail,
  Award,
  Clock,
  CalendarDays,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: {
    name: string;
    role: string;
    specialty: string;
    status: string;
    shift: string;
  } | null;
  defaultTab?: "details" | "history";
}

export function StaffDetailsModal({
  open,
  onOpenChange,
  staff,
  defaultTab = "details",
}: Props) {
  const [activeTab, setActiveTab] = useState<"details" | "history">(defaultTab);

  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden glass-card-premium border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem]">
        <DialogHeader className="p-8 bg-gradient-to-r from-blue-600 to-sky-500 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <User className="absolute right-8 top-1/2 -translate-y-1/2 h-32 w-32 text-white/5 pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border-2 border-white/40 shadow-xl text-2xl font-black text-white">
              {staff.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex flex-col">
              <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest w-fit mb-1">
                Ficha do Profissional
              </Badge>
              <DialogTitle className="text-2xl font-black tracking-tight text-white">
                {staff.name}
              </DialogTitle>
              <DialogDescription className="text-blue-100 font-bold uppercase tracking-widest text-[10px] mt-1 flex items-center gap-2">
                <Stethoscope className="h-3 w-3" /> {staff.role} •{" "}
                {staff.specialty}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-muted/30 border-b border-border/50 flex px-2 pt-4 gap-6">
          <button
            onClick={() => setActiveTab("details")}
            className={cn(
              "pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
              activeTab === "details"
                ? "text-blue-600 dark:text-blue-400"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Dados Cadastrais
            {activeTab === "details" && (
              <motion.div
                layoutId="tabIndicator"
                className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
              activeTab === "history"
                ? "text-blue-600 dark:text-blue-400"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Histórico & Frequência
            {activeTab === "history" && (
              <motion.div
                layoutId="tabIndicator"
                className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full"
              />
            )}
          </button>
        </div>

        <div className="p-8 h-[400px] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === "details" ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Turno Padrão
                      </span>
                    </div>
                    <p className="font-bold text-sm">{staff.shift}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Award className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Status Atual
                      </span>
                    </div>
                    <Badge
                      variant={
                        staff.status === "In-Shift" ? "default" : "secondary"
                      }
                      className="uppercase text-[9px] font-black"
                    >
                      {staff.status === "In-Shift"
                        ? "Em Plantão"
                        : staff.status === "On-Call"
                          ? "Sobreaviso"
                          : "Off-Shift"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Contato e Endereço
                  </h4>
                  <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/30 dark:bg-slate-900/30 overflow-hidden backdrop-blur-sm">
                    <div className="flex items-center gap-3 p-4 border-b border-border/50">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        (11) 98888-7777
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-4 border-b border-border/50">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {staff.name.split(" ")[0].toLowerCase()}@hospital.com.br
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-4">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Av. Paulista, 1000 - São Paulo, SP
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Últimos Plantões
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-black uppercase"
                  >
                    Maio / 2030
                  </Badge>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      date: "21/05/2030",
                      shift: "Diurno",
                      hours: "12h",
                      status: "Concluído",
                    },
                    {
                      date: "19/05/2030",
                      shift: "Diurno",
                      hours: "12h",
                      status: "Concluído",
                    },
                    {
                      date: "17/05/2030",
                      shift: "Noturno",
                      hours: "12h",
                      status: "Atraso 15m",
                    },
                    {
                      date: "15/05/2030",
                      shift: "Diurno",
                      hours: "12h",
                      status: "Concluído",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 backdrop-blur-sm group hover:border-blue-500/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <CalendarDays className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{item.date}</span>
                          <span className="text-[10px] uppercase font-black text-muted-foreground">
                            {item.shift} • {item.hours}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[9px] font-black uppercase",
                            item.status.includes("Atraso")
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                          )}
                        >
                          {item.status}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
