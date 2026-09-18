import re

with open('d:/Geetha/assets/js/bundle.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

top_level_vars = {}
for i, line in enumerate(lines):
    m = re.match(r'^[ ]{0,4}(?:const|let|var|class|function)\s+([a-zA-Z0-9_$]+)', line)
    if m:
        name = m.group(1)
        if name not in top_level_vars:
            top_level_vars[name] = []
        top_level_vars[name].append((i + 1, line.strip()[:70]))

top_level_dupes = {k: v for k, v in top_level_vars.items() if len(v) > 1}
print(f"Total top-level duplicated identifiers: {len(top_level_dupes)}")
for name, occurrences in top_level_dupes.items():
    print(f"\nIdentifier '{name}':")
    for line_num, snippet in occurrences:
        print(f"   Line {line_num}: {snippet}")
