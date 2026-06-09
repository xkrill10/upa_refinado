const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const SOURCE_DIR = path.join(ROOT_DIR, 'Upa_escala');
const DEST_PAGES = path.join(ROOT_DIR, 'src', 'pages', 'EscalaApp', 'pages');

// Função para copiar diretórios recursivamente
function copyRecursiveSync(src, dest, exclude = []) {
    if (!fs.existsSync(src)) return;
    const stats = fs.statSync(src);
    const isDirectory = stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach((childItemName) => {
            if (!exclude.includes(childItemName)) {
                copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName), exclude);
            }
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

console.log('🔄 Iniciando sincronização da Escala...');

try {
    // 1. Copiar as páginas para dentro do EscalaApp
    console.log('📂 Copiando páginas (Dashboard, EscalaControl, etc)...');
    copyRecursiveSync(path.join(SOURCE_DIR, 'src', 'pages'), DEST_PAGES);

    // 2. Copiar API e Hooks para a raiz do projeto principal
    console.log('📂 Copiando api/ e hooks/ ...');
    copyRecursiveSync(path.join(SOURCE_DIR, 'src', 'api'), path.join(ROOT_DIR, 'src', 'api'));
    copyRecursiveSync(path.join(SOURCE_DIR, 'src', 'hooks'), path.join(ROOT_DIR, 'src', 'hooks'));

    // 3. Copiar componentes específicos da escala (dashboard e schedule)
    console.log('📂 Copiando componentes internos...');
    copyRecursiveSync(path.join(SOURCE_DIR, 'src', 'components', 'dashboard'), path.join(ROOT_DIR, 'src', 'components', 'dashboard'));
    copyRecursiveSync(path.join(SOURCE_DIR, 'src', 'components', 'schedule'), path.join(ROOT_DIR, 'src', 'components', 'schedule'));

    // 4. Sincronizar componentes UI que faltam (sem sobrescrever os .tsx do UPA Control)
    console.log('🔧 Sincronizando componentes de UI...');
    const srcUiDir = path.join(SOURCE_DIR, 'src', 'components', 'ui');
    const destUiDir = path.join(ROOT_DIR, 'src', 'components', 'ui');
    if (fs.existsSync(srcUiDir)) {
        const files = fs.readdirSync(srcUiDir).filter(f => f.endsWith('.jsx'));
        files.forEach(file => {
            const baseName = path.basename(file, '.jsx');
            const tsxPath = path.join(destUiDir, `${baseName}.tsx`);
            if (!fs.existsSync(tsxPath)) {
                fs.copyFileSync(path.join(srcUiDir, file), path.join(destUiDir, file));
            }
        });
    }

    // Nota de Segurança: O diretório "layout" propositalmente NÃO É COPIADO 
    // porque o menu foi fundido no menu principal sanfona do sistema.

    console.log('✅ Escala sincronizada com sucesso! Suas atualizações da pasta Upa_escala foram aplicadas sem quebrar o layout mestre.');
} catch (error) {
    console.error('❌ Erro ao sincronizar a escala:', error);
}
