import sys

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('className="flex flex-col flex-1 p-6 space-y-6"', 'className="flex flex-col flex-1 p-2 space-y-4"')
    content = content.replace('gap-8', 'gap-4')
    content = content.replace('gap-6', 'gap-4')
    content = content.replace('glass-card border-none', 'glass-card-premium border-white/40 dark:border-white/10')
    content = content.replace('glass-card ', 'glass-card-premium ')
    content = content.replace('rounded-[2rem]', 'rounded-xl')
    content = content.replace('rounded-2xl', 'rounded-xl')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

process_file('src/pages/TriageRoom.tsx')
print('TriageRoom.tsx formatted!')
