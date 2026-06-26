import re

file_path = "src/pages/PatientEvolution.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Pattern starts with {/* Super Painel SAE Enfermagem */}
# and ends with onChange={(e) => setDescription(e.target.value)} /> or similar block ending before {/* Carimbo Digital persistent configuration section */}

pattern = r'\{\/\* Super Painel SAE Enfermagem \*\/\}.*?(?=\{\/\* Carimbo Digital persistent configuration section \*\/\})'

smart_builder = """
                <SmartEvolutionBuilder 
                  role={professional?.toLowerCase().includes("dr") ? "medico" : "enfermeiro"}
                  value={description}
                  onChange={setDescription}
                />
                
                {/* Ferramentas Clínicas Extras */}
                <div className="mt-4 pt-4 mb-4 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                    Ferramentas Opcionais
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setOpenBradenCalc(true)} className="px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-orange-600 hover:bg-orange-50">
                      Braden (LPP)
                    </button>
                    <button type="button" onClick={() => setOpenMorseCalc(true)} className="px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-amber-600 hover:bg-amber-50">
                      Morse (Queda)
                    </button>
                    <button type="button" onClick={() => setOpenEvaCalc(true)} className="px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-red-600 hover:bg-red-50">
                      Dor (EVA)
                    </button>
                    <button type="button" onClick={() => setOpenMewsCalc(true)} className="px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-blue-600 hover:bg-blue-50">
                      MEWS (Alerta)
                    </button>
                    <button type="button" onClick={() => setOpenNandaCalc(true)} className="px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-indigo-600 hover:bg-indigo-50">
                      NANDA/NIC
                    </button>
                  </div>
                </div>
                """

new_content = re.sub(pattern, smart_builder, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Super Painel finally replaced by SmartEvolutionBuilder")
