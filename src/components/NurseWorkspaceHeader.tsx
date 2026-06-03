import { useState, useMemo } from "react";
import { LogOut, Stethoscope, Baby, Syringe, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface NurseWorkspaceHeaderProps {
  activeRoom: string;
  activeNurse: string;
  corenNumber: string;
  corenState: string;
  defaultTitle?: string;
  defaultTheme?: "blue" | "emerald" | "orange";
}

export function NurseWorkspaceHeader({ activeRoom, activeNurse, corenNumber, corenState, defaultTitle, defaultTheme }: NurseWorkspaceHeaderProps) {
  const [isEndShiftModalOpen, setIsEndShiftModalOpen] = useState(false);
  const navigate = useNavigate();

  const isConsultationMode = !activeRoom || activeRoom.trim() === "";
  const displayRoom = isConsultationMode ? (defaultTitle || "MODO CONSULTA") : activeRoom;
  const displayNurse = isConsultationMode ? "Modo Consulta / Visualização" : activeNurse;

  const isPediatric = displayRoom.toUpperCase().includes("PEDIÁTRICA");
  const isMedication = displayRoom.toUpperCase().includes("MEDICAÇÃO") || displayRoom.toUpperCase().includes("OBSERVAÇÃO");
  
  // Define themes
  const isBlueTheme = isConsultationMode ? defaultTheme === "blue" : (!isPediatric && !isMedication);
  const isEmeraldTheme = isConsultationMode ? defaultTheme === "emerald" : (isMedication && !isPediatric); 
  const isOrangeTheme = isConsultationMode ? defaultTheme === "orange" : isPediatric;

  // Generate a consistent avatar ID (1-8) based on nurse's name
  const avatarId = useMemo(() => {
    if (!activeNurse || activeNurse.trim() === "") {
      return Math.floor(Math.random() * 8) + 1;
    }
    let hash = 0;
    for (let i = 0; i < activeNurse.length; i++) {
      hash = activeNurse.charCodeAt(i) + ((hash << 5) - hash);
    }
    return (Math.abs(hash) % 8) + 1;
  }, [activeNurse]);

  const handleEndShiftConfirm = () => {
    localStorage.removeItem("upa_active_room");
    localStorage.removeItem("upa_active_nurse");
    localStorage.removeItem("upa_stamp_number");
    localStorage.removeItem("upa_stamp_state");
    setIsEndShiftModalOpen(false);
    navigate("/painel-enfermagem");
  };

  return (
    <>
      <div className={cn(
        "sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b shadow-[0_4px_32px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl mb-6",
        "bg-white/60 dark:bg-slate-900/40 border-white/50 dark:border-white/10"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner",
            isBlueTheme ? "bg-[#006699]/10 text-[#006699] dark:bg-sky-500/15 dark:text-sky-400" : 
            isEmeraldTheme ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" :
            "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
          )}>
            {isPediatric ? <Baby className="h-6 w-6" /> : isMedication ? <Syringe className="h-6 w-6" /> : <Stethoscope className="h-6 w-6" />}
          </div>

          <div className="relative group shrink-0">
            <div className={cn(
              "absolute inset-0 rounded-2xl blur-[1px] opacity-45",
              isBlueTheme ? "bg-gradient-to-r from-sky-400 to-blue-600" : 
              isEmeraldTheme ? "bg-gradient-to-r from-emerald-400 to-teal-600" :
              "bg-gradient-to-r from-orange-400 to-amber-500"
            )} />
            <div className="relative h-20 w-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md transition-transform duration-300 group-hover:scale-105 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
               <img 
                 src={`/src/assets/images/nurse_avatar_${avatarId}.png`}
                 alt="Foto do Profissional"
                 className="w-full h-full object-cover"
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                   (e.target as HTMLImageElement).className = "w-10 h-10 object-contain";
                 }}
               />
            </div>
            <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm animate-pulse" />
          </div>

          <div>
            <h1 className={cn(
              "text-2xl font-black uppercase tracking-tight leading-none",
              isBlueTheme ? "text-[#006699] dark:text-sky-400" : 
              isEmeraldTheme ? "text-emerald-600 dark:text-emerald-500" :
              "text-orange-600 dark:text-orange-500"
            )}>
              {displayRoom}
            </h1>
            <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
              {isConsultationMode ? displayNurse : `Operando: ${displayNurse} ${corenNumber ? `• COREN: ${corenNumber}${corenState ? `/${corenState}` : ''}` : ''}`}
            </p>
          </div>
        </div>

        {!isConsultationMode && (
          <Button 
            variant="outline" 
            className="h-10 rounded-xl gap-2 text-red-500 border-red-200 hover:text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30 px-4 font-black uppercase text-xs tracking-wider shadow-sm"
            onClick={() => setIsEndShiftModalOpen(true)}
          >
            <LogOut className="h-4 w-4" /> Sair / Encerrar
          </Button>
        )}
      </div>

      <Dialog open={isEndShiftModalOpen} onOpenChange={setIsEndShiftModalOpen}>
        <DialogContent className="sm:max-w-md p-8 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl [&>button]:hidden">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center shadow-inner">
              <LogOut className="h-8 w-8 text-red-500" />
            </div>
            
            <div className="space-y-2">
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-slate-100">
                Encerrar Plantão?
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Tem certeza que deseja encerrar os atendimentos nesta sala? A sala ficará livre para outro colega.
                <br /><br />
                <strong className="text-slate-700 dark:text-slate-300">Bom descanso!</strong>
              </DialogDescription>
            </div>

            <div className="flex gap-3 w-full pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800"
                onClick={() => setIsEndShiftModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive"
                className="flex-1 h-12 rounded-xl text-white font-black uppercase tracking-widest shadow-lg shadow-red-500/20"
                onClick={handleEndShiftConfirm}
              >
                Sim, Encerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
