import re
import sys

with open("src/pages/NewPatient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add new icons if not present (CheckSquare, LogOut)
content = content.replace("  DoorOpen,", "  DoorOpen,\n  CheckSquare,\n  LogOut,")

# 2. Add new states
states_insertion = """
  const [receptionistMatricula, setReceptionistMatricula] = useState(() => localStorage.getItem("upa_receptionist_matricula") || "");
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
"""
content = content.replace("const [receptionistName, setReceptionistName] = useState(() => localStorage.getItem(\"upa_receptionist_name\") || \"\");", "const [receptionistName, setReceptionistName] = useState(() => localStorage.getItem(\"upa_receptionist_name\") || \"\");\n" + states_insertion)

# 3. Update handleAssumirGuiche
old_handle_assumir = """  const handleAssumirGuiche = () => {
    if (!pendingCounter || !receptionistName.trim()) {
      toast.error("Por favor, insira seu nome.");
      return;
    }
    setSelectedCounter(pendingCounter);
    localStorage.setItem("upa_active_counter", JSON.stringify({id: pendingCounter.id, name: pendingCounter.name}));
    localStorage.setItem("upa_receptionist_name", receptionistName.trim());
    setPendingCounter(null);
  };"""

new_handle_assumir = """  const handleAssumirGuiche = () => {
    if (!pendingCounter || !receptionistName.trim() || !receptionistMatricula.trim()) {
      toast.error("Por favor, preencha seu nome e matrícula.");
      return;
    }
    setSelectedCounter(pendingCounter);
    localStorage.setItem("upa_active_counter", JSON.stringify({id: pendingCounter.id, name: pendingCounter.name}));
    localStorage.setItem("upa_receptionist_name", receptionistName.trim());
    localStorage.setItem("upa_receptionist_matricula", receptionistMatricula.trim());
    setPendingCounter(null);
  };"""
content = content.replace(old_handle_assumir, new_handle_assumir)

# 4. Update handleExitCounter
old_handle_exit = """  const handleExitCounter = () => {
    setSelectedCounter(null);
    localStorage.removeItem("upa_active_counter");
  };"""
new_handle_exit = """  const handleExitCounter = () => {
    setSelectedCounter(null);
    localStorage.removeItem("upa_active_counter");
    setIsExitModalOpen(false);
  };"""
content = content.replace(old_handle_exit, new_handle_exit)

# 5. Add Matricula input to Assumir Guiche Dialog
old_dialog_inputs = """              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                  Nome do(a) Recepcionista:
                </label>
                <Input
                  value={receptionistName}
                  onChange={(e) => setReceptionistName(formatWords(e.target.value))}
                  placeholder="Seu nome"
                  className="h-12 rounded-xl px-4 text-sm font-bold border-2 focus-visible:ring-2 border-[#006699]/30 focus-visible:ring-[#006699]/20"
                  autoFocus
                />
              </div>"""

new_dialog_inputs = """              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block text-left">
                  Nome do(a) Recepcionista:
                </label>
                <Input
                  value={receptionistName}
                  onChange={(e) => setReceptionistName(formatWords(e.target.value))}
                  placeholder="Ex: Maria Santos"
                  className="h-12 rounded-xl px-4 text-sm font-bold border-2 focus-visible:ring-2 border-[#006699]/30 focus-visible:ring-[#006699]/20"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block text-left">
                  Matrícula:
                </label>
                <Input
                  value={receptionistMatricula}
                  onChange={(e) => setReceptionistMatricula(e.target.value.toUpperCase())}
                  placeholder="Ex: 12345"
                  className="h-12 rounded-xl px-4 text-sm font-bold border-2 focus-visible:ring-2 border-[#006699]/30 focus-visible:ring-[#006699]/20"
                />
              </div>"""
content = content.replace(old_dialog_inputs, new_dialog_inputs)

# 6. Replace header of Fila da Recepção
old_header = """      <div className="flex flex-col gap-1">
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

new_header = """      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <div className="col-span-1 lg:col-span-3 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg rounded-3xl p-6 relative overflow-hidden flex items-center justify-between">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#006699]/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
          
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white uppercase mb-1">
              Olá, {receptionistName.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Bom plantão no {selectedCounter.name}
            </p>
          </div>

          <div className="flex items-center gap-4 z-10">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Matrícula</p>
              <p className="text-sm font-black text-[#006699] dark:text-sky-400">{receptionistMatricula}</p>
            </div>
            <div className="h-10 w-px bg-border hidden sm:block" />
            <Button variant="outline" size="sm" onClick={() => setIsExitModalOpen(true)} className="h-10 px-4 text-xs font-black uppercase text-red-500 border-red-500/20 bg-red-500/5 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair da Sala
            </Button>
          </div>
        </div>

        <div className="col-span-1 bg-[#006699] text-white rounded-3xl p-6 shadow-lg shadow-[#006699]/20 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Fila Virtual</p>
          <div className="flex items-baseline gap-2 z-10">
            <span className="text-4xl font-black tracking-tighter">{waitingRegistration.length}</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Aguardando</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 mb-2">
         <h2 className="text-lg font-black tracking-tight text-[#006699] dark:text-sky-400 uppercase flex items-center gap-2">
           <ClipboardList className="h-5 w-5" />
           Pacientes para Chamada
         </h2>
         <Button variant="outline" size="sm" className="h-8 text-xs font-bold uppercase rounded-lg border-dashed text-slate-500 hover:text-[#006699]">
            <CheckSquare className="h-4 w-4 mr-2" />
            Checklist do Turno
         </Button>
      </div>"""
content = content.replace(old_header, new_header)

# 7. Add Exit Dialog at the end
exit_dialog = """
      <Dialog open={isExitModalOpen} onOpenChange={setIsExitModalOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl [&>button]:hidden">
          <div className="p-8 text-center text-white relative shadow-lg backdrop-blur-md transition-colors duration-300 bg-gradient-to-br from-red-600/90 to-red-800/90 dark:from-red-600/50 dark:to-red-900/50">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <LogOut className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white mb-2">
              Encerrar Turno?
            </DialogTitle>
            <DialogDescription className="text-white/80 font-medium text-sm">
              Deseja mesmo sair do <strong className="text-white">{selectedCounter?.name}</strong>?
              <br/>Bom descanso!
            </DialogDescription>
          </div>
          <div className="p-8 space-y-5">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsExitModalOpen(false)}
                className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Voltar
              </Button>
              <Button
                onClick={handleExitCounter}
                className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20"
              >
                Sair
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
"""
content = content.replace("    </motion.div>\n  );\n}\n", "    </motion.div>\n" + exit_dialog + "  );\n}\n")

with open("src/pages/NewPatient.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied for Reception Dashboard (Salinha)")
