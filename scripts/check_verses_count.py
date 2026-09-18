import json
import re

total_verses = 0
expected_verses = [0, 47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78]

for i in range(1, 19):
    file_path = f'd:/Geetha/assets/js/data/chapter{i:02d}.js'
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            matches = re.findall(rf'\"id\":\s*\"{i}-\d+\"', content)
            count = len(matches)
            total_verses += count
            if count != expected_verses[i]:
                print(f'Chapter {i} has {count} verses. Expected: {expected_verses[i]}')
    except Exception as e:
        print(f'Error reading {file_path}: {e}')

print(f'Total verses found: {total_verses}')
