import os
def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f: content = f.read()
    orig = content
    # Replace the remaining cyan button in CurrencyConverter
    content = content.replace('bg-gradient-to-r from-cyan-500 to-teal-500 text-gem-beige hover:from-cyan-400 hover:to-teal-400', 'bg-gem-gold text-gem-forest hover:opacity-90')
    content = content.replace('shadow-[0_0_15px_rgba(6,182,212,0.3)]', 'shadow-md')
    
    # Replace hex codes
    content = content.replace('text-[#B8E3E9]', 'text-gem-beige')
    content = content.replace('border-[#4F7C82]/50', 'border-gem-gold/30')
    content = content.replace('border-[#4F7C82]/30', 'border-gem-gold/20')
    content = content.replace('shadow-[0_0_10px_rgba(79,124,130,0.3)]', 'shadow-[0_0_10px_rgba(200,169,106,0.2)]')
    content = content.replace('placeholder-[#4F7C82]', 'placeholder-gem-mist/50')
    content = content.replace('bg-[#4F7C82]/40', 'bg-gem-gold/20')
    content = content.replace('rgba(79,124,130,0.15)', 'rgba(200,169,106,0.15)')
    content = content.replace('rgba(79,124,130,0.1)', 'rgba(200,169,106,0.1)')
    content = content.replace('fill: "#4F7C82"', 'fill: "#C8A96A"')
    
    # Currency Select
    content = content.replace('bg-gem-gold500/20', 'bg-gem-gold/20')
    
    if orig != content:
        with open(filepath, 'w', encoding='utf-8') as f: f.write(content)
        print('Fixed', os.path.basename(filepath))

for root, _, files in os.walk(r'd:\AI_Stuff\Gravity\GlobalSync-AI\frontend\src'):
    for file in files:
        if file.endswith('.js') or file.endswith('.css'):
            replace_in_file(os.path.join(root, file))
