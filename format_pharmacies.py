import sys
import re

def format_pharmacy(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Paddings
    content = content.replace('className="p-8', 'className="p-3')
    content = content.replace('className="p-6', 'className="p-3')
    content = content.replace(' p-8 ', ' p-3 ')
    content = content.replace(' p-6 ', ' p-3 ')
    content = content.replace('px-6 pb-6', 'px-2 pb-2')
    content = content.replace('mx-6', 'mx-2')

    # Gaps and spaces
    content = content.replace('gap-8', 'gap-4')
    content = content.replace('gap-6', 'gap-4')
    content = content.replace('space-y-6', 'space-y-4')
    content = content.replace('space-y-8', 'space-y-4')

    # Glass and borders
    content = content.replace('glass-card border-none', 'glass-card-premium border-white/40 dark:border-white/10')
    content = content.replace('glass-card ', 'glass-card-premium ')
    
    # Border radius
    content = content.replace('rounded-[2rem]', 'rounded-xl')
    content = content.replace('rounded-2xl', 'rounded-xl')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"{filepath} formatted!")

format_pharmacy('src/pages/Pharmacy.tsx')
format_pharmacy('src/pages/SatellitePharmacy.tsx')
