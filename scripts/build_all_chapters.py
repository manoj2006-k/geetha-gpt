import urllib.request
import json
import os
import re

def get_json(url):
    print(f"Fetching {url}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.loads(res.read().decode('utf-8'))

def clean_text(t):
    if not t:
        return ""
    # Normalize whitespace and linebreaks
    t = t.strip()
    return t

def main():
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    
    print("Downloading authentic Bhagavad Gita sources...")
    verses_raw = get_json('https://raw.githubusercontent.com/gita/gita/master/data/verse.json')
    translations_raw = get_json('https://raw.githubusercontent.com/gita/gita/master/data/translation.json')
    commentaries_raw = get_json('https://raw.githubusercontent.com/gita/gita/master/data/commentary.json')
    
    # Organize translations by verse_id -> author -> text
    trans_map = {}
    for t in translations_raw:
        vid = t['verse_id']
        author = t.get('authorName', '')
        lang = t.get('lang', '')
        desc = t.get('description', '')
        if vid not in trans_map:
            trans_map[vid] = {}
        trans_map[vid][(author, lang)] = desc

    # Organize commentaries by verse_id -> author -> text
    comm_map = {}
    for c in commentaries_raw:
        vid = c['verse_id']
        author = c.get('authorName', '')
        lang = c.get('lang', '')
        desc = c.get('description', '')
        if vid not in comm_map:
            comm_map[vid] = {}
        comm_map[vid][(author, lang)] = desc

    # Chapter topic mapping for practical application & topic tags
    chapter_topics = {
        1: ["Dharma", "Moral Dilemma", "Attachment", "Grief", "Duty", "Courage"],
        2: ["Sankhya", "Soul", "Karma Yoga", "Equanimity", "Self-Realization", "Peace", "Discipline"],
        3: ["Karma Yoga", "Duty", "Selfless Action", "Leadership", "Service", "Sacrifice"],
        4: ["Jnana", "Divine Wisdom", "Action in Inaction", "Guru", "Sacred Fire", "Knowledge"],
        5: ["Renunciation", "True Sannyasa", "Inner Peace", "Equanimity", "Brahman", "Freedom"],
        6: ["Dhyana Yoga", "Meditation", "Mind Control", "Self-Discipline", "Zen", "Inner Stillness"],
        7: ["Jnana Vijnana", "Divine Nature", "Maya", "Surrender", "Cosmic Order", "Faith"],
        8: ["Akshara Brahma", "Eternal Reality", "Path of Liberation", "Remembering God", "End of Life"],
        9: ["Raja Vidya", "Sovereign Secret", "Devotion", "Unconditional Grace", "Divine Protection"],
        10: ["Vibhuti", "Divine Splendor", "Cosmic Manifestation", "Presence of God", "Awe"],
        11: ["Vishvarupa", "Cosmic Vision", "Universal Form", "Humility", "Transcendence", "Time"],
        12: ["Bhakti Yoga", "Love & Devotion", "Qualities of a Devotee", "Compassion", "Equanimity"],
        13: ["Kshetra & Kshetrajna", "Field & Knower", "Consciousness", "Body & Soul", "True Knowledge"],
        14: ["Three Gunas", "Sattva Rajas Tamas", "Psychology", "Transcending Modes", "Inner Balance"],
        15: ["Purushottama", "Tree of Life", "Supreme Divine", "Cosmic Order", "Transcendence"],
        16: ["Divine & Demonic Qualities", "Character", "Virtue & Ego", "Gates to Ruin", "Integrity"],
        17: ["Shraddha", "Threefold Faith", "Mindful Living", "Sacrifice", "Speech & Mind", "OM TAT SAT"],
        18: ["Moksha", "Supreme Renunciation", "Swadharma", "Surrender", "Ultimate Liberation", "Success"]
    }

    # Group verses by chapter
    chapters_dict = {c: [] for c in range(1, 19)}

    for v in verses_raw:
        ch = v['chapter_number']
        vnum = v['verse_number']
        vid = v['id']
        sanskrit = clean_text(v.get('text', ''))
        translit = clean_text(v.get('transliteration', ''))
        word_meanings = clean_text(v.get('word_meanings', ''))

        # Get English translation: priority: Sivananda -> Gambhirananda -> Adidevananda -> Purohit
        v_trans = trans_map.get(vid, {})
        eng_trans = ""
        for (author, lang), desc in v_trans.items():
            if lang == 'english':
                if 'Sivananda' in author:
                    eng_trans = desc
                    break
        if not eng_trans:
            for (author, lang), desc in v_trans.items():
                if lang == 'english' and ('Gambirananda' in author or 'Gambhirananda' in author):
                    eng_trans = desc
                    break
        if not eng_trans:
            for (author, lang), desc in v_trans.items():
                if lang == 'english':
                    eng_trans = desc
                    break

        eng_trans = clean_text(eng_trans)

        # Get English commentary: priority: Sivananda -> default
        v_comm = comm_map.get(vid, {})
        eng_comm = ""
        for (author, lang), desc in v_comm.items():
            if lang == 'english' and 'Sivananda' in author:
                eng_comm = desc
                break
        if not eng_comm:
            for (author, lang), desc in v_comm.items():
                if lang == 'english':
                    eng_comm = desc
                    break

        eng_comm = clean_text(eng_comm)
        if not eng_comm or len(eng_comm) < 10:
            eng_comm = f"In this verse of Chapter {ch}, Sri Krishna illuminates the timeless truth of duty, knowledge, and inner steadfastness for the sincere seeker."

        # Truncate overly long commentary to keep bundle sleek while rich
        if len(eng_comm) > 450:
            eng_comm = eng_comm[:450].rsplit('.', 1)[0] + "."

        # Practical life application
        practical_app = f"Reflect on the sacred principle of Chapter {ch}, Verse {vnum}: apply integrity, focus on duty without anxiety over outcomes, and cultivate inner peace."

        topics = chapter_topics.get(ch, ["Wisdom", "Duty", "Peace"])

        verse_obj = {
            "id": f"{ch}-{vnum}",
            "chapter": ch,
            "verse": vnum,
            "sanskrit": sanskrit,
            "transliteration": translit,
            "wordMeanings": word_meanings,
            "englishTranslation": eng_trans,
            "englishExplanation": eng_comm,
            "practicalApplication": practical_app,
            "topics": topics
        }
        chapters_dict[ch].append(verse_obj)

    # Sort each chapter by verse number
    for c in range(1, 19):
        chapters_dict[c].sort(key=lambda x: x['verse'])

    # Write each chapter file
    out_dir = "d:/Geetha/assets/js/data"
    os.makedirs(out_dir, exist_ok=True)

    all_verses_list = []

    for c in range(1, 19):
        ch_verses = chapters_dict[c]
        all_verses_list.extend(ch_verses)
        ch_file = os.path.join(out_dir, f"chapter{c:02d}.js")
        var_name = f"CHAPTER_{c:02d}"
        
        js_code = f"// Chapter {c} — {len(ch_verses)} Verses\nexport const {var_name} = "
        js_code += json.dumps(ch_verses, ensure_ascii=False, indent=2)
        js_code += ";\n"

        with open(ch_file, "w", encoding="utf-8") as f:
            f.write(js_code)
        print(f"Wrote {ch_file} ({len(ch_verses)} verses)")

    # Write master gitaData.js
    gita_data_file = os.path.join(out_dir, "gitaData.js")
    imports = []
    arrays = []
    for c in range(1, 19):
        imports.append(f"import {{ CHAPTER_{c:02d} }} from './chapter{c:02d}.js';")
        arrays.append(f"CHAPTER_{c:02d}")

    gita_js = "// Master Bhagavad Gita Dataset (All 18 Chapters • 700+ Verses)\n"
    gita_js += "\n".join(imports) + "\n\n"
    gita_js += "export const GITA_DATA = [\n  " + ",\n  ".join([f"...{a}" for a in arrays]) + "\n];\n\n"
    gita_js += "export const CHAPTERS_DATASET = {\n"
    for c in range(1, 19):
        gita_js += f"  {c}: CHAPTER_{c:02d},\n"
    gita_js += "};\n"

    with open(gita_data_file, "w", encoding="utf-8") as f:
        f.write(gita_js)
    print(f"Wrote {gita_data_file} with total {len(all_verses_list)} verses")

    # Update versesData.js
    verses_data_file = os.path.join(out_dir, "versesData.js")
    verses_js = "// Geetha GPT — Complete Bhagavad Gita Verses Dataset\n"
    verses_js += "import { GITA_DATA } from './gitaData.js';\n\n"
    verses_js += "export const VERSES_DATA = GITA_DATA;\n"

    with open(verses_data_file, "w", encoding="utf-8") as f:
        f.write(verses_js)
    print(f"Updated {verses_data_file}")

    print("SUCCESS: All chapter files generated!")

if __name__ == "__main__":
    main()
