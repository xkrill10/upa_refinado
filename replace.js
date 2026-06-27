const fs = require('fs');
let content = fs.readFileSync('src/pages/PatientEvolution.tsx', 'utf-8');

const importTarget =     FlaskConical,
    Syringe,
} from "lucide-react";;
const importReplacement =     FlaskConical,
    Syringe,
    AlertTriangle,
    Smile,
    FileHeart,
} from "lucide-react";;
content = content.replace(importTarget, importReplacement);

const badgeCode = 
interface SmartBadgeProps {
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  selectedValue: string;
  color: "orange" | "amber" | "red" | "blue" | "indigo" | "teal" | "violet" | "pink" | "rose";
}

const themeClasses = {
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    textTitle: "text-orange-700 dark:text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-500",
    textSub: "text-orange-600 dark:text-orange-300",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    textTitle: "text-amber-700 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500",
    textSub: "text-amber-600 dark:text-amber-300",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    textTitle: "text-red-700 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-500",
    textSub: "text-red-600 dark:text-red-300",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    textTitle: "text-blue-700 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500",
    textSub: "text-blue-600 dark:text-blue-300",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
    textTitle: "text-indigo-700 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-500",
    textSub: "text-indigo-600 dark:text-indigo-300",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-200 dark:border-teal-800",
    textTitle: "text-teal-700 dark:text-teal-400",
    iconBg: "bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-500",
    textSub: "text-teal-600 dark:text-teal-300",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-800",
    textTitle: "text-violet-700 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-500",
    textSub: "text-violet-600 dark:text-violet-300",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-200 dark:border-pink-800",
    textTitle: "text-pink-700 dark:text-pink-400",
    iconBg: "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-500",
    textSub: "text-pink-600 dark:text-pink-300",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-200 dark:border-rose-800",
    textTitle: "text-rose-700 dark:text-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-500",
    textSub: "text-rose-600 dark:text-rose-300",
  },
};

function SmartBadge({ onClick, title, icon, selectedValue, color }: SmartBadgeProps) {
  const isEvaluated = selectedValue && selectedValue.trim() !== "";
  const t = themeClasses[color];

  let displayValue = "Não Avaliado";
  if (isEvaluated) {
    displayValue = selectedValue.split('\\n')[0].replace("Risco ", "Risco: ");
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 p-2.5 rounded-xl border transition-all text-left w-[145px] shadow-sm hover:-translate-y-0.5 duration-200",
        isEvaluated
          ? \\ \\
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      )}
    >
      <div className="flex items-center gap-1.5 w-full">
         <div className={cn("p-1 rounded-md shrink-0", isEvaluated ? t.iconBg : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500")}>
           {icon}
         </div>
         <span className={cn("text-[10px] font-bold uppercase truncate flex-1 tracking-wider", isEvaluated ? t.textTitle : "text-slate-500 dark:text-slate-400")}>
           {title}
         </span>
      </div>
      <div className={cn("text-[9px] font-semibold mt-1 w-full pl-0.5 line-clamp-1 leading-tight", isEvaluated ? t.textSub : "text-slate-400 dark:text-slate-500")}>
        {displayValue}
      </div>
    </button>
  );
}

export default function EvolucaoEnfermagem() {
;
content = content.replace("export default function EvolucaoEnfermagem() {", badgeCode);

const newButtons =                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      Ferramentas Opcionais {isChild ? "(Pediátricas)" : "(Adulto)"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {!isChild ? (
                        <>
                          <SmartBadge onClick={() => setOpenBradenCalc(true)} title="Braden (LPP)" icon={<Activity className="w-3.5 h-3.5" />} selectedValue={selectedBraden} color="orange" />
                          <SmartBadge onClick={() => setOpenMorseCalc(true)} title="Morse (Queda)" icon={<AlertTriangle className="w-3.5 h-3.5" />} selectedValue={selectedMorse} color="amber" />
                          <SmartBadge onClick={() => setOpenEvaCalc(true)} title="Dor (EVA)" icon={<Activity className="w-3.5 h-3.5" />} selectedValue={selectedEva} color="red" />
                          <SmartBadge onClick={() => setOpenMewsCalc(true)} title="MEWS (Alerta)" icon={<Activity className="w-3.5 h-3.5" />} selectedValue={selectedMews} color="blue" />
                          <SmartBadge onClick={() => setOpenNandaCalc(true)} title="NANDA/NIC" icon={<FileHeart className="w-3.5 h-3.5" />} selectedValue={activeNandaPlan} color="indigo" />
                        </>
                      ) : (
                        <>
                          <SmartBadge onClick={() => setOpenPewsCalc(true)} title="PEWS (Alerta)" icon={<Baby className="w-3.5 h-3.5" />} selectedValue={selectedPews} color="teal" />
                          <SmartBadge onClick={() => setOpenHumptyDumptyCalc(true)} title="Humpty-Dumpty" icon={<AlertTriangle className="w-3.5 h-3.5" />} selectedValue={selectedHumptyDumpty} color="violet" />
                          <SmartBadge onClick={() => setOpenBradenQCalc(true)} title="Braden-Q" icon={<Activity className="w-3.5 h-3.5" />} selectedValue={selectedBradenQ} color="orange" />
                          <SmartBadge onClick={() => setOpenFlaccCalc(true)} title="FLACC (Dor)" icon={<Smile className="w-3.5 h-3.5" />} selectedValue={selectedFlacc} color="pink" />
                          <SmartBadge onClick={() => setOpenWongBakerCalc(true)} title="Wong-Baker" icon={<Smile className="w-3.5 h-3.5" />} selectedValue={selectedWongBaker} color="rose" />
                          <SmartBadge onClick={() => setOpenGlasgowPedCalc(true)} title="Glasgow Ped." icon={<Brain className="w-3.5 h-3.5" />} selectedValue={selectedGlasgowPed} color="indigo" />
                          <SmartBadge onClick={() => setOpenEvaCalc(true)} title="Dor (EVA)" icon={<Activity className="w-3.5 h-3.5" />} selectedValue={selectedEva} color="red" />
                          <SmartBadge onClick={() => setOpenNandaCalc(true)} title="NANDA/NIC" icon={<FileHeart className="w-3.5 h-3.5" />} selectedValue={activeNandaPlan} color="indigo" />
                        </>
                      )}
                    </div>;
                    
const regex = /<span className="text-\[10px\] font-bold text-slate-500 uppercase tracking-wider mb-2 block">[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(regex, newButtons + "\n                  </div>");

fs.writeFileSync('src/pages/PatientEvolution.tsx', content, 'utf-8');
console.log('Done');
