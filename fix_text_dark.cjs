const fs = require('fs');
const path = require('path');

const DIRS_TO_SCAN = [
  path.join(__dirname, 'src', 'pages', 'EscalaApp', 'pages'),
  path.join(__dirname, 'src', 'components', 'dashboard'),
  path.join(__dirname, 'src', 'components', 'schedule')
];

function processFile(filePath) {
  let originalContent = fs.readFileSync(filePath, 'utf8');
  let content = originalContent;

  // 1. Remove forced inline colors
  content = content.replace(/color:\s*'#0f172a'/g, "color: 'inherit'");
  content = content.replace(/color:\s*'#64748b'/g, "color: 'inherit'");
  content = content.replace(/color:\s*'#475569'/g, "color: 'inherit'");

  // 2. Collapse conflicting dark text classes
  // e.g. dark:text-slate-700 dark:text-slate-300 -> dark:text-slate-300
  // dark:text-slate-800 dark:text-slate-200 -> dark:text-slate-200
  content = content.replace(/dark:text-slate-700\s+dark:text-slate-300/g, 'dark:text-slate-300');
  content = content.replace(/dark:text-slate-700\s+dark:text-slate-400/g, 'dark:text-slate-300');
  content = content.replace(/dark:text-slate-800\s+dark:text-slate-200/g, 'dark:text-slate-200');
  content = content.replace(/dark:text-slate-900\s+dark:text-slate-200/g, 'dark:text-slate-200');
  content = content.replace(/dark:text-slate-900\s+dark:text-white/g, 'dark:text-white');
  
  // Collapse duplicated identical classes
  content = content.replace(/dark:text-slate-300\s+dark:text-slate-300/g, 'dark:text-slate-300');
  content = content.replace(/dark:text-slate-200\s+dark:text-slate-200/g, 'dark:text-slate-200');
  content = content.replace(/dark:text-slate-300\s+dark:text-slate-350/g, 'dark:text-slate-300');
  content = content.replace(/dark:text-slate-300\s+dark:text-slate-400/g, 'dark:text-slate-300');

  // Fix text-slate-350 which doesn't exist
  content = content.replace(/text-slate-350/g, 'text-slate-400');

  // 3. Ensure simple text-slate-900 and text-slate-800 have dark mode variants
  // text-slate-800 without dark:
  content = content.replace(/text-slate-800(?!\s+dark:text-)/g, 'text-slate-800 dark:text-slate-200');
  content = content.replace(/text-slate-900(?!\s+dark:text-)/g, 'text-slate-900 dark:text-white');
  content = content.replace(/text-slate-700(?!\s+dark:text-)/g, 'text-slate-700 dark:text-slate-300');

  // 4. Fix specific STATUS_STYLES off-duty
  content = content.replace(/'off-duty':\s*{\s*bg:\s*'bg-transparent',\s*text:\s*'[^']+',\s*border:\s*'border-transparent'\s*}/g, 
    `'off-duty':       { bg: 'bg-transparent',                       text: 'text-slate-400 dark:text-slate-500 font-bold',   border: 'border-transparent' }`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[UPDATED] ${filePath}`);
  }
}

function scanDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && /\.(tsx|jsx|js|ts)$/.test(entry.name)) {
      processFile(fullPath);
    }
  }
}

for (const dir of DIRS_TO_SCAN) {
  scanDir(dir);
}

console.log('✅ Fix Text Dark Script finished.');
