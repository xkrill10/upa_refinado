const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'EscalaApp', 'pages', 'EscalaControl.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replacements
content = content.replace(/backgroundColor: '#f1f5f9'/g, "backgroundColor: 'transparent'");
content = content.replace(/backgroundColor: '#ffffff'/g, "backgroundColor: 'transparent'");
content = content.replace(/borderBottom: '1px solid #e2e8f0'/g, "borderBottom: '1px solid rgba(148, 163, 184, 0.2)'");
content = content.replace(/borderRight: '1px solid #e2e8f0'/g, "borderRight: '1px solid rgba(148, 163, 184, 0.2)'");
content = content.replace(/borderRight: '1.5px solid #94a3b8'/g, "borderRight: '1.5px solid rgba(148, 163, 184, 0.4)'");
content = content.replace(/color: '#64748b'/g, "color: 'inherit'");
content = content.replace(/color: isWeekend \? '#dc2626' : '#475569'/g, "color: isWeekend ? '#ef4444' : 'inherit'");
content = content.replace(/backgroundColor: isWeekend \? 'rgba\(239,68,68,0\.04\)' : '#f1f5f9'/g, "backgroundColor: isWeekend ? 'rgba(239,68,68,0.1)' : 'transparent'");
content = content.replace(/className="bg-card colaborador-cell"/g, 'className="glass-panel colaborador-cell text-slate-800 dark:text-slate-200"');
content = content.replace(/className="bg-muted colaborador-header"/g, 'className="glass-panel colaborador-header text-slate-800 dark:text-slate-200"');
content = content.replace(/className="bg-muted text-center/g, 'className="glass-panel text-center');

// Table styling that forces dark text in dark mode:
// "text-slate-900" or similar inside the table should be "text-slate-800 dark:text-slate-200"
content = content.replace(/text-slate-900/g, 'text-slate-800 dark:text-slate-200');
content = content.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-300');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ EscalaControl.tsx fixed for dark mode!');
