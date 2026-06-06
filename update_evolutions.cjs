const fs = require('fs');
const dir = 'c:/Users/user/Desktop/Upa_100/src/pages/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Evolucao') || f === 'PatientEvolution.tsx');

files.forEach(file => {
  if (!file.endsWith('.tsx')) return;
  const filePath = dir + file;
  let content = fs.readFileSync(filePath, 'utf8');

  // Add markExamsAsRead to usePatients
  content = content.replace(
    /const \{ patients, addEvolution, updatePatient \} = usePatients\(\);/g,
    'const { patients, addEvolution, updatePatient, markExamsAsRead } = usePatients();'
  );

  // Add unreadExamsCount
  if (!content.includes('const unreadExamsCount =')) {
    content = content.replace(
      /const patient = patients\.find\(p => p\.id === id\);/g,
      'const patient = patients.find(p => p.id === id);\n  const unreadExamsCount = patient?.exams?.filter(e => e.status === \'completed\' && !e.readAt).length || 0;'
    );
  }

  // Add badge to the exams tab object
  content = content.replace(
    /\{ id: \"exams\", label: \"Exames & Procedimentos\", icon: <Search className=\"h-3\.5 w-3\.5\" \/> \},/g,
    '{ id: "exams", label: "Exames & Procedimentos", icon: <Search className="h-3.5 w-3.5" />, badge: unreadExamsCount },'
  );

  // Render the badge in the tab
  if (!content.includes('tab.badge ? <Badge')) {
    content = content.replace(
      /\{tab\.label\}\s*\{isActive && \(/g,
      '{tab.label}\n                {tab.badge ? <Badge className="ml-1 bg-red-500 text-white border-none px-1.5 py-0.5 text-[10px] font-black h-4 min-w-[18px] flex items-center justify-center animate-pulse shadow-sm">{tab.badge}</Badge> : null}\n                {isActive && ('
    );
  }

  // Trigger markExamsAsRead when clicking the tab
  if (!content.includes('markExamsAsRead(')) {
    content = content.replace(
      /\} else if \(tab\.id === \"exams\"\) \{\s*handleEvolutionTypeChange\(/g,
      `} else if (tab.id === "exams") {\n                      if (unreadExamsCount > 0 && id) markExamsAsRead(id);\n                      handleEvolutionTypeChange(`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed ' + file);
});
