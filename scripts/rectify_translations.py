import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("Starting rectification of translations...")

# 1. Update Chapter 10
ch10_path = "d:/Geetha/assets/js/data/chapter10.js"
with open(ch10_path, "r", encoding="utf-8") as f:
    text10 = f.read()

v10_33_te = "అక్షరాలలో నేను మొదటి అక్షరమైన 'అ' కారమును, సమాసాలలో ద్వంద్వ సమాసమును. అక్షయమైన కాలస్వరూపుడను నేనే, సర్వతోముఖుడైన జగద్విధాతను (కర్మఫల ప్రదాతను) నేనే."
verses10 = json.loads(text10[text10.find('['):text10.rfind(']')+1])
for v in verses10:
    if v['verse'] == 33:
        v['teluguTranslation'] = v10_33_te
        v['teluguMeaning'] = v10_33_te
        print("Rectified Chapter 10 Verse 33")

js_code10 = f"// Chapter 10 — Complete {len(verses10)} Verses with Telugu & English Translations\nexport const CHAPTER_10 = {json.dumps(verses10, ensure_ascii=False, indent=2)};\n"
with open(ch10_path, "w", encoding="utf-8") as f:
    f.write(js_code10)


# 2. Update Chapter 12
ch12_path = "d:/Geetha/assets/js/data/chapter12.js"
with open(ch12_path, "r", encoding="utf-8") as f:
    text12 = f.read()

v12_6_te = "కానీ ఎవరైతే సమస్త కర్మలను నాకే అర్పించి, నన్నే పరమగతిగా భావించి, అనన్యమైన భక్తియోగంతో నన్ను ధ్యానిస్తూ ఉపాసిస్తారో..."
verses12 = json.loads(text12[text12.find('['):text12.rfind(']')+1])
for v in verses12:
    if v['verse'] == 6:
        v['teluguTranslation'] = v12_6_te
        v['teluguMeaning'] = v12_6_te
        print("Rectified Chapter 12 Verse 6")

js_code12 = f"// Chapter 12 — Complete {len(verses12)} Verses with Telugu & English Translations\nexport const CHAPTER_12 = {json.dumps(verses12, ensure_ascii=False, indent=2)};\n"
with open(ch12_path, "w", encoding="utf-8") as f:
    f.write(js_code12)


# 3. Update Chapter 18
ch18_path = "d:/Geetha/assets/js/data/chapter18.js"
with open(ch18_path, "r", encoding="utf-8") as f:
    text18 = f.read()

v18_5_te = "యజ్ఞము, దానము, తపస్సు అనే కర్మలను ఎన్నడూ విడిచిపెట్టరాదు, వాటిని తప్పక ఆచరించాలి. ఎందుకంటే యజ్ఞము, దానము, తపస్సు అనేవి వివేకవంతులైన జ్ఞానుల అంతఃకరణను పవిత్రం చేసేవి."
verses18 = json.loads(text18[text18.find('['):text18.rfind(']')+1])
for v in verses18:
    if v['verse'] == 5:
        v['teluguTranslation'] = v18_5_te
        v['teluguMeaning'] = v18_5_te
        print("Rectified Chapter 18 Verse 5")

js_code18 = f"// Chapter 18 — Complete {len(verses18)} Verses with Telugu & English Translations\nexport const CHAPTER_18 = {json.dumps(verses18, ensure_ascii=False, indent=2)};\n"
with open(ch18_path, "w", encoding="utf-8") as f:
    f.write(js_code18)


# 4. Update dataset/gita_verses.json
dataset_json_path = "d:/Geetha/dataset/gita_verses.json"
if os.path.exists(dataset_json_path):
    with open(dataset_json_path, "r", encoding="utf-8") as f:
        ds_verses = json.load(f)
    for v in ds_verses:
        if v['id'] == "10-33":
            v['telugu_translation'] = v10_33_te
        elif v['id'] == "12-6":
            v['telugu_translation'] = v12_6_te
        elif v['id'] == "18-5":
            v['telugu_translation'] = v18_5_te
    with open(dataset_json_path, "w", encoding="utf-8") as f:
        json.dump(ds_verses, f, ensure_ascii=False, indent=2)
    print("Rectified dataset/gita_verses.json")


# 5. Build master map from all 18 chapter files to update data/gita_verses.json
all_chapter_verses_map = {}
for ch in range(1, 19):
    fpath = f"d:/Geetha/assets/js/data/chapter{ch:02d}.js"
    with open(fpath, "r", encoding="utf-8") as f:
        t = f.read()
    c_verses = json.loads(t[t.find('['):t.rfind(']')+1])
    for v in c_verses:
        all_chapter_verses_map[v['id']] = v

# Update data/gita_verses.json
data_json_path = "d:/Geetha/data/gita_verses.json"
with open(data_json_path, "r", encoding="utf-8") as f:
    data_verses = json.load(f)

rectified_in_gita_json = 0
for v in data_verses:
    vid = v.get('id')
    if vid in all_chapter_verses_map:
        source_v = all_chapter_verses_map[vid]
        # Update teluguTranslation and teluguMeaning
        v['teluguTranslation'] = source_v.get('teluguTranslation', '')
        v['teluguMeaning'] = source_v.get('teluguMeaning', '')
        v['teluguExplanation'] = source_v.get('teluguExplanation', '')
        rectified_in_gita_json += 1

with open(data_json_path, "w", encoding="utf-8") as f:
    json.dump(data_verses, f, ensure_ascii=False, indent=2)
print(f"Rectified data/gita_verses.json: {rectified_in_gita_json} verses synchronized with authentic Telugu translations!")

print("All source data files successfully rectified.")
