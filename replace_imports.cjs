const fs = require('fs');
const path = require('path');

function replaceImports(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            replaceImports(fullPath);
        } else if (fullPath.match(/\.(js|jsx|ts|tsx)$/)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('@/')) {
                // We want to replace '@/' with '@/pages/Escala/'
                // Need to be careful not to double replace if it's already '@/pages/Escala/'
                content = content.replace(/@\/(?!pages\/Escala\/)/g, '@/pages/Escala/');
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated imports in ${fullPath}`);
            }
        }
    }
}

replaceImports(path.join(__dirname, 'src', 'pages', 'Escala'));
