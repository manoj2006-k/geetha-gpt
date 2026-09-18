import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

datasets_to_check = [
    "SatyaSanatan/shrimad-bhagavad-gita-dataset-alpaca",
    "AkrGupta/bhagavad-gita-with_life_lesson",
    "suneeldk/bhagavad-gita-life-advice-700",
    "Voider22/bhagavad-gita-verses-sanskrit-translations",
    "JDhruv14/Bhagavad-Gita_Dataset",
    "OEvortex/Bhagavad_Gita",
    "sweatSmile/Bhagavad-Gita-Vyasa-Edwin-Arnold",
    "snskrt/Shrimad_Bhagavad_Gita",
    "p2kalita/The-Bhagavad-Gita-with-a-TWIST"
]

for ds in datasets_to_check:
    url = f"https://huggingface.co/api/datasets/{ds}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            siblings = [s['rfilename'] for s in data.get('siblings', []) if not s['rfilename'].startswith('.')]
            print(f"\n[{ds}]")
            print("  Files:", siblings[:5])
    except Exception as e:
        print(f"\n[{ds}] Error: {e}")
