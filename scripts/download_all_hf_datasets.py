import urllib.request
import os
import json
import time

dest_base = 'd:/Geetha/dataset/external'
os.makedirs(dest_base, exist_ok=True)

hf_downloads = [
    {
        'folder': 'SatyaSanatan_alpaca',
        'files': [
            ('https://huggingface.co/datasets/SatyaSanatan/shrimad-bhagavad-gita-dataset-alpaca/raw/main/Shrimad-bhagvad-gita.json', 'Shrimad-bhagvad-gita.json'),
            ('https://huggingface.co/datasets/SatyaSanatan/shrimad-bhagavad-gita-dataset-alpaca/raw/main/Shrimad-bhagvad-gita-hindi.csv', 'Shrimad-bhagvad-gita-hindi.csv'),
        ]
    },
    {
        'folder': 'AkrGupta_life_lesson',
        'files': [
            ('https://huggingface.co/datasets/AkrGupta/bhagavad-gita-with_life_lesson/raw/main/bhagavad-gita-lifelesson.csv', 'bhagavad-gita-lifelesson.csv'),
        ]
    },
    {
        'folder': 'suneeldk_life_advice',
        'files': [
            ('https://huggingface.co/datasets/suneeldk/bhagavad-gita-life-advice-700/raw/main/gita_700_life_advice.json', 'gita_700_life_advice.json'),
        ]
    },
    {
        'folder': 'Voider22_verses_translations',
        'files': [
            ('https://huggingface.co/datasets/Voider22/bhagavad-gita-verses-sanskrit-translations/raw/main/data/gita.jsonl', 'gita.jsonl'),
        ]
    },
    {
        'folder': 'JDhruv14_geeta_dataset',
        'files': [
            ('https://huggingface.co/datasets/JDhruv14/Bhagavad-Gita_Dataset/raw/main/geeta_dataset.csv', 'geeta_dataset.csv'),
        ]
    },
    {
        'folder': 'OEvortex_Bhagavad_Gita',
        'files': [
            ('https://huggingface.co/datasets/OEvortex/Bhagavad_Gita/raw/main/bhagavad-gita.csv', 'bhagavad-gita.csv'),
        ]
    },
    {
        'folder': 'sweatSmile_Edwin_Arnold_QA',
        'files': [
            ('https://huggingface.co/datasets/sweatSmile/Bhagavad-Gita-Vyasa-Edwin-Arnold/raw/main/bhagavad_gita_qa.csv', 'bhagavad_gita_qa.csv'),
        ]
    },
    {
        'folder': 'snskrt_Shrimad_Bhagavad_Gita',
        'files': [
            ('https://huggingface.co/datasets/snskrt/Shrimad_Bhagavad_Gita/raw/main/Shrimad_Bhagavad_Gita.csv', 'Shrimad_Bhagavad_Gita.csv'),
        ]
    },
    {
        'folder': 'p2kalita_krishna_qa',
        'files': [
            ('https://huggingface.co/datasets/p2kalita/The-Bhagavad-Gita-with-a-TWIST/raw/main/krishna_qa.csv', 'krishna_qa.csv'),
        ]
    }
]

headers = {'User-Agent': 'Mozilla/5.0'}

for item in hf_downloads:
    folder_path = os.path.join(dest_base, item['folder'])
    os.makedirs(folder_path, exist_ok=True)
    for url, filename in item['files']:
        file_dest = os.path.join(folder_path, filename)
        if os.path.exists(file_dest) and os.path.getsize(file_dest) > 100:
            print(f"[SKIP] {item['folder']}/{filename} already exists ({os.path.getsize(file_dest)} bytes)")
            continue
        print(f"[DOWNLOADING] {url} -> {file_dest}")
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as resp, open(file_dest, 'wb') as out_f:
                out_f.write(resp.read())
            print(f"[SUCCESS] Saved {filename} ({os.path.getsize(file_dest)} bytes)")
        except Exception as e:
            print(f"[ERROR] Failed {filename}: {e}")
        time.sleep(0.5)

print("\nAll Hugging Face downloads complete!")
