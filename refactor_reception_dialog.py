import re
import sys

with open("src/pages/NewPatient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Import DoorOpen
content = content.replace("  CheckCircle2,\n  User,", "  CheckCircle2,\n  User,\n  DoorOpen,")

# 2. Add states for pendingCounter and receptionistName
states_insertion = """
  const [pendingCounter, setPendingCounter] = useState<any>(null);
  const [receptionistName, setReceptionistName] = useState(() => localStorage.getItem("upa_receptionist_name") || "");
"""
content = content.replace("const [selectedCounter, setSelectedCounter]", states_insertion + "\n  const [selectedCounter, setSelectedCounter]")

# 3. Change handleSelectCounter to handle click and open modal
old_handle = """  const handleSelectCounter = (counter: any) => {
    setSelectedCounter(counter);
    localStorage.setItem("upa_active_counter", JSON.stringify({id: counter.id, name: counter.name}));
  };"""

new_handle = """  const handleSelectCounter = (counter: any) => {
    setPendingCounter(counter);
  };

  const handleAssumirGuiche = () => {
    if (!pendingCounter || !receptionistName.trim()) {
      toast.error("Por favor, insira seu nome.");
      return;
    }
    setSelectedCounter(pendingCounter);
    localStorage.setItem("upa_active_counter", JSON.stringify({id: pendingCounter.id, name: pendingCounter.name}));
    localStorage.setItem("upa_receptionist_name", receptionistName.trim());
    setPendingCounter(null);
  };"""

content = content.replace(old_handle, new_handle)

# 4. Insert the Dialog before the closing </div> of the selection screen
dialog_code = """
        <Dialog open={!!pendingCounter} onOpenChange={(open) => !open && setPendingCounter(null)}>
          <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl [&>button]:hidden">
            <div className="p-8 text-center text-white relative shadow-lg backdrop-blur-md transition-colors duration-300 bg-gradient-to-br from-[#006699]/90 to-[#004466]/90 dark:from-sky-600/50 dark:to-sky-900/50">
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <DoorOpen className="h-8 w-8" />
              </div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                Assumir Guichê
              </DialogTitle>
              <DialogDescription className="text-white/80 font-medium text-sm">
                Você está prestes a iniciar os atendimentos no <br/>
                <strong className="text-white">{pendingCounter?.name}</strong>.
              </DialogDescription>
            </div>

            <div className="p-8 space-y-5">
              <div className="space-y-2">
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
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setPendingCounter(null)}
                  className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAssumirGuiche}
                  className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-[#006699] hover:bg-[#005580] text-white shadow-md shadow-sky-500/20"
                >
                  Entrar no Guichê
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
"""

content = content.replace("        </div>\n      </div>\n    );\n  }", "        </div>\n" + dialog_code + "\n      </div>\n    );\n  }")

with open("src/pages/NewPatient.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied for Reception Dialog")
