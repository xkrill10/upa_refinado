import re

file_path = "src/pages/PatientEvolution.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to find the <SmartEvolutionBuilder /> block and append a small tools row below it.
smart_builder_code = r"""(                <SmartEvolutionBuilder 
                  role=\{professional\?\.toLowerCase\(\)\.includes\("dr"\) \? "medico" : "enfermeiro"\}
                  value=\{description\}
                  onChange=\{setDescription\}
                />)"""

tools_code = r"""\1
                {/* Ferramentas Clínicas Extras */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                    Ferramentas Opcionais
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setOpenBradenCalc(true)} className="px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-amber-600 hover:bg-amber-50">
                      Braden
                    </button>
                    <button type="button" onClick={() => setOpenMorseCalc(true)} className="px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-orange-600 hover:bg-orange-50">
                      Morse
                    </button>
                    <button type="button" onClick={() => setOpenEvaCalc(true)} className="px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-red-600 hover:bg-red-50">
                      Dor (EVA)
                    </button>
                    <button type="button" onClick={() => setOpenMewsCalc(true)} className="px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-blue-600 hover:bg-blue-50">
                      MEWS
                    </button>
                    <button type="button" onClick={() => setOpenNandaCalc(true)} className="px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-indigo-600 hover:bg-indigo-50">
                      NANDA/NIC
                    </button>
                  </div>
                </div>
"""

content = re.sub(smart_builder_code, tools_code, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Added Clinical Tools to PatientEvolution.tsx!")
