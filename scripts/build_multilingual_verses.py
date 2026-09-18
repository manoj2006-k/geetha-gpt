"""
Geetha GPT - Build Multilingual Verses Dataset
Preserves Sanskrit, IAST, English, Telugu, and adds authentic Hindi, Sanskrit, and Gujarati translations.
Explicitly marks missing translations as null to power honest fallback display.
"""

import os
import json
import re
import sys
import pandas as pd

sys.stdout.reconfigure(encoding='utf-8')

def clean_hindi_text(text):
    if not text:
        return ""
    # Remove markers like ।।1.1।। at the start
    text = re.sub(r'^[।\s\d\.]+बोले\s*[-–]?\s*', '', text)
    text = re.sub(r'^[।\s\d\.]+', '', text)
    # Remove notes like (टिप्पणी प0 1.2)
    text = re.sub(r'\(टिप्पणी[^\)]*\)', '', text)
    return text.strip()

def main():
    print("Loading datasets for multilingual verse integration...")
    with open('data/gita_verses.json', 'r', encoding='utf-8') as f:
        verses = json.load(f)

    # 1. Load github_gita_gita mappings
    with open('dataset/external/github_gita_gita/verse.json', 'r', encoding='utf-8') as f:
        v_raw = json.load(f)

    with open('dataset/external/github_gita_gita/translation.json', 'r', encoding='utf-8') as f:
        t_raw = json.load(f)

    cv_to_id = {}
    for v in v_raw:
        cv_to_id[(v['chapter_number'], v['verse_number'])] = v['id']

    hindi_map = {}
    for t in t_raw:
        if t.get('lang') == 'hindi':
            vid = t['verse_id']
            desc = t.get('description', '').strip()
            author = t.get('authorName', '')
            if vid not in hindi_map or author == 'Swami Ramsukhdas':
                hindi_map[vid] = desc

    # 2. Load Gujarati dataset
    gujarati_map = {}
    gu_csv = 'dataset/external/JDhruv14_Bhagavad_Gita_QA/Gujarati/gujarati.csv'
    if os.path.exists(gu_csv):
        df_gu = pd.read_csv(gu_csv)
        for _, row in df_gu.iterrows():
            c = int(row['chapter_no'])
            v = int(row['verse_no'])
            ans = str(row['answer']).strip()
            if (c, v) not in gujarati_map and ans:
                gujarati_map[(c, v)] = ans

    # 3. Integrate translations into all verses
    updated_verses = []
    chapter_groups = {i: [] for i in range(1, 19)}

    for item in verses:
        c = int(item['chapter'])
        v = int(item['verse'])
        vid = cv_to_id.get((c, v))

        hindi_text = ""
        if vid and vid in hindi_map:
            hindi_text = clean_hindi_text(hindi_map[vid])
        elif 'hindiMeaning' in item and item['hindiMeaning']:
            hindi_text = clean_hindi_text(item['hindiMeaning'])

        gujarati_text = gujarati_map.get((c, v), "")

        # Canonical translations dictionary for 23 languages
        # Only verified genuine translations are included; others are None/null
        translations = {
            "en": item.get('englishTranslation') or item.get('translation', ''),
            "te": item.get('teluguTranslation', ''),
            "hi": hindi_text,
            "sa": item.get('sanskrit', '').strip(),
            "gu": gujarati_text if gujarati_text else None,
            "ta": None,
            "kn": None,
            "ml": None,
            "mr": None,
            "bn": None,
            "pa": None,
            "or": None,
            "as": None,
            "ur": None,
            "ks": None,
            "kok": None,
            "mai": None,
            "mni": None,
            "ne": None,
            "brx": None,
            "sat": None,
            "sd": None,
            "doi": None
        }

        # Preserve every single existing field
        item['iast'] = item.get('transliteration', '')
        item['translations'] = translations
        if hindi_text and not item.get('hindiMeaning'):
            item['hindiMeaning'] = hindi_text

        # Ensure englishTranslation is consistent
        if not item.get('englishTranslation') and item.get('translation'):
            item['englishTranslation'] = item['translation']

        updated_verses.append(item)
        chapter_groups[c].append(item)

    # Save data/gita_verses.json
    with open('data/gita_verses.json', 'w', encoding='utf-8') as f:
        json.dump(updated_verses, f, ensure_ascii=False, indent=2)
    print(f"SUCCESS: Updated data/gita_verses.json with {len(updated_verses)} verses.")

    # Update individual assets/js/data/chapter01.js ... chapter18.js
    for c in range(1, 19):
        c_verses = chapter_groups[c]
        file_path = f"d:/Geetha/assets/js/data/chapter{c:02d}.js"
        js_code = f"// Chapter {c} — Complete {len(c_verses)} Verses with Canonical Multilingual Translations\n"
        js_code += f"export const CHAPTER_{c:02d} = {json.dumps(c_verses, ensure_ascii=False, indent=2)};\n"

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(js_code)

    print("SUCCESS: Updated all 18 chapter files in assets/js/data/")

if __name__ == "__main__":
    main()
