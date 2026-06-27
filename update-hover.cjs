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
    badgeHover: "hover:bg-orange-50/50 hover:border-orange-200 dark:hover:bg-orange-900/10 dark:hover:border-orange-800",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    textTitle: "text-amber-700 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500",
    textSub: "text-amber-600 dark:text-amber-300",
    iconDefault: "bg-amber-50/80 dark:bg-amber-900/20 text-amber-500 dark:text-amber-500 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40",
    badgeHover: "hover:bg-amber-50/50 hover:border-amber-200 dark:hover:bg-amber-900/10 dark:hover:border-amber-800",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    textTitle: "text-red-700 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-500",
    textSub: "text-red-600 dark:text-red-300",
    iconDefault: "bg-red-50/80 dark:bg-red-900/20 text-red-400 dark:text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/40",
    badgeHover: "hover:bg-red-50/50 hover:border-red-200 dark:hover:bg-red-900/10 dark:hover:border-red-800",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    textTitle: "text-blue-700 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500",
    textSub: "text-blue-600 dark:text-blue-300",
    iconDefault: "bg-blue-50/80 dark:bg-blue-900/20 text-blue-400 dark:text-blue-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40",
    badgeHover: "hover:bg-blue-50/50 hover:border-blue-200 dark:hover:bg-blue-900/10 dark:hover:border-blue-800",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
    textTitle: "text-indigo-700 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-500",
    textSub: "text-indigo-600 dark:text-indigo-300",
    iconDefault: "bg-indigo-50/80 dark:bg-indigo-900/20 text-indigo-400 dark:text-indigo-500 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40",
    badgeHover: "hover:bg-indigo-50/50 hover:border-indigo-200 dark:hover:bg-indigo-900/10 dark:hover:border-indigo-800",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-200 dark:border-teal-800",
    textTitle: "text-teal-700 dark:text-teal-400",
    iconBg: "bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-500",
    textSub: "text-teal-600 dark:text-teal-300",
    iconDefault: "bg-teal-50/80 dark:bg-teal-900/20 text-teal-400 dark:text-teal-500 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40",
    badgeHover: "hover:bg-teal-50/50 hover:border-teal-200 dark:hover:bg-teal-900/10 dark:hover:border-teal-800",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-800",
    textTitle: "text-violet-700 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-500",
    textSub: "text-violet-600 dark:text-violet-300",
    iconDefault: "bg-violet-50/80 dark:bg-violet-900/20 text-violet-400 dark:text-violet-500 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40",
    badgeHover: "hover:bg-violet-50/50 hover:border-violet-200 dark:hover:bg-violet-900/10 dark:hover:border-violet-800",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-200 dark:border-pink-800",
    textTitle: "text-pink-700 dark:text-pink-400",
    iconBg: "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-500",
    textSub: "text-pink-600 dark:text-pink-300",
    iconDefault: "bg-pink-50/80 dark:bg-pink-900/20 text-pink-400 dark:text-pink-500 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/40",
    badgeHover: "hover:bg-pink-50/50 hover:border-pink-200 dark:hover:bg-pink-900/10 dark:hover:border-pink-800",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-200 dark:border-rose-800",
    textTitle: "text-rose-700 dark:text-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-500",
    textSub: "text-rose-600 dark:text-rose-300",
    iconDefault: "bg-rose-50/80 dark:bg-rose-900/20 text-rose-400 dark:text-rose-500 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40",
    badgeHover: "hover:bg-rose-50/50 hover:border-rose-200 dark:hover:bg-rose-900/10 dark:hover:border-rose-800",
  },
};
`;
c = c.replace(oldThemeClassesRegex, newThemeClasses);

c = c.replace(/: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"/m, ': `bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${t.badgeHover}`');

fs.writeFileSync('src/pages/PatientEvolution.tsx', c);
