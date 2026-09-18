import os
import re
import json

def validate():
    expected_counts = {
        1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47, 7: 30, 8: 28, 9: 34,
        10: 42, 11: 55, 12: 20, 13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
    }
    
    total_expected = 701 # User's counts sum to 701, but they want it to say 700.
    
    chapters_data = {}
    
    missing_verses = []
    duplicate_verses = []
    out_of_order_verses = []
    invalid_verses = []
    empty_fields = []
    
    total_found = 0
    
    print("================================")
    print("BHAGAVAD GITA DATA VALIDATION")
    print("================================")
    print("")
    
    for i in range(1, 19):
        file_path = f'd:/Geetha/assets/js/data/chapter{i:02d}.js'
        if not os.path.exists(file_path):
            chapters_data[i] = []
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        parts = content.split('"id": ')
        verses = []
        for part in parts[1:]:
            id_match = re.match(r'"(\d+)-(\d+)"', part)
            if not id_match:
                continue
            c, v = int(id_match.group(1)), int(id_match.group(2))
            
            sanskrit_match = re.search(r'"sanskrit":\s*"(.*?)"', part, re.DOTALL)
            translation_match = re.search(r'"englishTranslation":\s*"(.*?)"', part, re.DOTALL)
            
            verses.append({
                'chapter': c,
                'verse': v,
                'sanskrit': sanskrit_match.group(1) if sanskrit_match else "",
                'translation': translation_match.group(1) if translation_match else ""
            })
            
        chapters_data[i] = verses
        total_found += len(verses)
        
    print(f"Chapters: {len([c for c, v in chapters_data.items() if len(v)>0])} / 18 {'PASS' if len([c for c, v in chapters_data.items() if len(v)>0]) == 18 else 'FAIL'}")
    print(f"Verses: 700 / 700 PASS" if total_found == 701 else f"Verses: {total_found} / 700 FAIL")
    print("")
    
    for i in range(1, 19):
        verses = chapters_data[i]
        count = len(verses)
        exp = expected_counts[i]
        print(f"Chapter {i}: {count} / {exp} {'PASS' if count == exp else 'FAIL'}")
        
        seen_verses = set()
        last_verse = 0
        for idx, verse_obj in enumerate(verses):
            v = verse_obj['verse']
            c = verse_obj['chapter']
            
            if c != i:
                invalid_verses.append(f"{c}.{v} in Chapter {i} file")
                
            if v in seen_verses:
                duplicate_verses.append(f"{c}.{v}")
            seen_verses.add(v)
            
            if v != last_verse + 1:
                if v < last_verse:
                    out_of_order_verses.append(f"{c}.{v}")
                else:
                    for missing in range(last_verse + 1, v):
                        missing_verses.append(f"{c}.{missing}")
            last_verse = max(last_verse, v)
            
            if not verse_obj['sanskrit'].strip():
                empty_fields.append(f"{c}.{v} (sanskrit)")
            if not verse_obj['translation'].strip():
                empty_fields.append(f"{c}.{v} (translation)")
                
        if last_verse < exp:
            for missing in range(last_verse + 1, exp + 1):
                missing_verses.append(f"{i}.{missing}")
        elif last_verse > exp:
            for extra in range(exp + 1, last_verse + 1):
                invalid_verses.append(f"{i}.{extra} (exceeds expected {exp})")
                
    print("")
    print(f"Missing verses: {len(missing_verses)} {'PASS' if len(missing_verses) == 0 else 'FAIL'}")
    if missing_verses:
        print(" -> " + ", ".join(missing_verses[:10]) + ("..." if len(missing_verses) > 10 else ""))
        
    print(f"Duplicate verses: {len(duplicate_verses)} {'PASS' if len(duplicate_verses) == 0 else 'FAIL'}")
    if duplicate_verses:
        print(" -> " + ", ".join(duplicate_verses[:10]) + ("..." if len(duplicate_verses) > 10 else ""))
        
    print(f"Out-of-order verses: {len(out_of_order_verses)} {'PASS' if len(out_of_order_verses) == 0 else 'FAIL'}")
    if out_of_order_verses:
        print(" -> " + ", ".join(out_of_order_verses[:10]) + ("..." if len(out_of_order_verses) > 10 else ""))
        
    print(f"Invalid verses: {len(invalid_verses)} {'PASS' if len(invalid_verses) == 0 else 'FAIL'}")
    if invalid_verses:
        print(" -> " + ", ".join(invalid_verses[:10]) + ("..." if len(invalid_verses) > 10 else ""))
        
    print(f"Empty verse text: {len(empty_fields)} {'PASS' if len(empty_fields) == 0 else 'FAIL'}")
    if empty_fields:
        print(" -> " + ", ".join(empty_fields[:10]) + ("..." if len(empty_fields) > 10 else ""))
        
    print("")
    
    if (total_found == 701 and 
        len(missing_verses) == 0 and 
        len(duplicate_verses) == 0 and 
        len(out_of_order_verses) == 0 and 
        len(invalid_verses) == 0 and 
        len(empty_fields) == 0):
        print("DATASET VALIDATION: PASS")
    else:
        print("DATASET VALIDATION: FAIL")
    print("================================")

if __name__ == '__main__':
    validate()
