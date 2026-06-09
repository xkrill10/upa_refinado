const fs = require('fs');
const path = require('path');

const DIRS_TO_SCAN = [
  path.join(__dirname, 'src', 'pages', 'EscalaApp', 'pages'),
  path.join(__dirname, 'src', 'components', 'dashboard'),
  path.join(__dirname, 'src', 'components', 'schedule')
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Substituir <Card> puro
  content = content.replace(/<Card>/g, '<Card className="glass-card-premium">');

  // 2. Substituir <Card className="..."> para injetar glass-card-premium
  // Usar uma Regex segura que não adicione múltiplos glass-card-premium se já existir
  content = content.replace(/<Card\s+className="/g, '<Card className="glass-card-premium ');

  // Evitar duplicatas acidentais
  content = content.replace(/glass-card-premium\s+glass-card-premium/g, 'glass-card-premium');

  // 3. Modais bg-card
  content = content.replace(/bg-card border border-border/g, 'glass-card-premium');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${path.basename(filePath)}`);
  }
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.match(/\.(js|jsx|ts|tsx)$/)) {
      processFile(fullPath);
    }
  }
}

console.log('🔄 Iniciando injeção de Glassmorphism...');
DIRS_TO_SCAN.forEach(dir => scanDir(dir));
console.log('✅ Injeção em massa concluída!');
