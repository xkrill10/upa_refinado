const fs = require('fs');
let c = fs.readFileSync('src/pages/PatientEvolution.tsx', 'utf8');

const oldThemeClassesRegex = /const themeClasses = \{[\s\S]*?\n\};\n/m;
const newThemeClasses = `const themeClasses = {
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    textTitle: "text-orange-700 dark:text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-500",
    textSub: "text-orange-600 dark:text-orange-300",
    iconDefault: "bg-orange-50/80 dark:bg-orange-900/20 text-orange-400 dark:text-orange-500 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    textTitle: "text-amber-700 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500",
    textSub: "text-amber-600 dark:text-amber-300",
    iconDefault: "bg-amber-50/80 dark:bg-amber-900/20 text-amber-500 dark:text-amber-500 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    textTitle: "text-red-700 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-500",
    textSub: "text-red-600 dark:text-red-300",
    iconDefault: "bg-red-50/80 dark:bg-red-900/20 text-red-400 dark:text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/40",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    textTitle: "text-blue-700 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500",
    textSub: "text-blue-600 dark:text-blue-300",
    iconDefault: "bg-blue-50/80 dark:bg-blue-900/20 text-blue-400 dark:text-blue-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
    textTitle: "text-indigo-700 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-500",
    textSub: "text-indigo-600 dark:text-indigo-300",
    iconDefault: "bg-indigo-50/80 dark:bg-indigo-900/20 text-indigo-400 dark:text-indigo-500 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-200 dark:border-teal-800",
    textTitle: "text-teal-700 dark:text-teal-400",
    iconBg: "bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-500",
    textSub: "text-teal-600 dark:text-teal-300",
    iconDefault: "bg-teal-50/80 dark:bg-teal-900/20 text-teal-400 dark:text-teal-500 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-800",
    textTitle: "text-violet-700 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-500",
    textSub: "text-violet-600 dark:text-violet-300",
    iconDefault: "bg-violet-50/80 dark:bg-violet-900/20 text-violet-400 dark:text-violet-500 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-200 dark:border-pink-800",
    textTitle: "text-pink-700 dark:text-pink-400",
    iconBg: "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-500",
    textSub: "text-pink-600 dark:text-pink-300",
    iconDefault: "bg-pink-50/80 dark:bg-pink-900/20 text-pink-400 dark:text-pink-500 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/40",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-200 dark:border-rose-800",
    textTitle: "text-rose-700 dark:text-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-500",
    textSub: "text-rose-600 dark:text-rose-300",
    iconDefault: "bg-rose-50/80 dark:bg-rose-900/20 text-rose-400 dark:text-rose-500 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40",
  },
};
`;
c = c.replace(oldThemeClassesRegex, newThemeClasses);

c = c.replace(/className=\{cn\([\s\n]*"flex flex-col items-start gap-1 p-2.5 rounded-xl border transition-all text-left w-\[145px\] shadow-sm hover:-translate-y-0.5 duration-200",/m, 'className={cn(\n        "group flex flex-col items-start gap-1 p-2.5 rounded-xl border transition-all text-left w-[145px] shadow-sm hover:-translate-y-0.5 duration-200",');

c = c.replace(/<div className=\{cn\("p-1 rounded-md shrink-0", isEvaluated \? t\.iconBg : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"\)\}>/m, '<div className={cn("p-1 rounded-md shrink-0 transition-colors duration-300", isEvaluated ? t.iconBg : t.iconDefault)}>');

fs.writeFileSync('src/pages/PatientEvolution.tsx', c);
