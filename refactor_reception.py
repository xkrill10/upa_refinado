import re
import sys

with open("src/pages/NewPatient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add COUNTERS constant at the top
counters_const = """
const COUNTERS = [
  { id: "GUICHE_1", name: "Guichê 1", type: "standard", icon: User },
  { id: "GUICHE_2", name: "Guichê 2", type: "standard", icon: User },
  { id: "GUICHE_3", name: "Guichê 3", type: "standard", icon: User },
  { id: "GUICHE_PREF", name: "Guichê Preferencial", type: "priority", icon: Users },
];
"""

content = content.replace("export default function NewPatient() {", counters_const + "\nexport default function NewPatient() {")

# 2. Add selectedCounter state
states_insertion = """
  const [selectedCounter, setSelectedCounter] = useState<{id: string, name: string, icon?: any} | null>(() => {
    const saved = localStorage.getItem("upa_active_counter");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleSelectCounter = (counter: any) => {
    setSelectedCounter(counter);
    localStorage.setItem("upa_active_counter", JSON.stringify({id: counter.id, name: counter.name}));
  };

  const handleExitCounter = () => {
    setSelectedCounter(null);
    localStorage.removeItem("upa_active_counter");
  };
"""

content = content.replace("const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);", states_insertion + "\n  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);")

# 3. Modify handleCallPatient
old_call = """callTicket(
      ticketToUse,
      "RECEPÇÃO",
      patient.risk || "not-urgent",
      patient.name,
    );"""

new_call = """callTicket(
      ticketToUse,
      selectedCounter ? selectedCounter.name.toUpperCase() : "RECEPÇÃO",
      patient.risk || "not-urgent",
      patient.name,
    );"""

content = content.replace(old_call, new_call)

# 4. Modify return to split into selection vs queue
old_return = """  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-[#006699] dark:text-sky-400 uppercase">
          Fila da Recepção
        </h1>
        <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
          <ClipboardList className="h-4 w-4 text-primary animate-pulse" />
          Pacientes Aguardando Cadastro Completo
        </p>
      </div>"""

new_return = """  if (!selectedCounter) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] p-4 sm:p-8 pt-12 sm:pt-20 relative animate-in fade-in duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#006699]/5 dark:bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl w-full z-10 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] border border-white/50 dark:border-white/10 mb-2">
              <UserPlus className="h-8 w-8 text-[#006699] dark:text-sky-400" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              Painel da Recepção
            </h1>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs max-w-xl mx-auto opacity-80">
              Selecione um guichê disponível para iniciar seu turno de atendimento.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {COUNTERS.map(counter => (
              <motion.div key={counter.id} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                 <Card
                   className="relative overflow-hidden cursor-pointer transition-all duration-300 h-full border-2 border-[#006699]/20 dark:border-sky-500/20 hover:border-[#006699]/40 dark:hover:border-sky-500/40 hover:shadow-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md"
                   onClick={() => handleSelectCounter(counter)}
                 >
                   <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                     <div className="p-4 rounded-2xl bg-[#006699]/10 dark:bg-sky-500/10 text-[#006699] dark:text-sky-400">
                       <counter.icon className="h-8 w-8" />
                     </div>
                     <div className="space-y-1">
                       <h3 className="font-black text-lg uppercase tracking-tight text-foreground">{counter.name}</h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Livre para entrada</p>
                     </div>
                   </CardContent>
                 </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-4xl font-black tracking-tight text-[#006699] dark:text-sky-400 uppercase">
            Fila da Recepção
          </h1>
          <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/50 p-1.5 pr-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
             <Badge className="bg-[#006699]/10 text-[#006699] dark:bg-sky-500/10 dark:text-sky-400 border-[#006699]/20 dark:border-sky-500/20 hover:bg-[#006699]/20 px-3 py-1.5 text-xs font-black uppercase rounded-lg">
               {selectedCounter.name}
             </Badge>
             <Button variant="ghost" size="sm" onClick={handleExitCounter} className="h-7 text-[10px] font-black uppercase text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-md px-2">
               Sair
             </Button>
          </div>
        </div>
        <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
          <ClipboardList className="h-4 w-4 text-primary animate-pulse" />
          Pacientes Aguardando Cadastro Completo
        </p>
      </div>"""

content = content.replace(old_return, new_return)

with open("src/pages/NewPatient.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied to NewPatient.tsx")
