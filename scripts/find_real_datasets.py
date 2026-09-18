import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("Searching Hugging Face for Bhagavad Gita datasets...")

queries = ["bhagavad gita", "bhagavad-gita", "gita qa", "shrimad bhagavad"]
found = {}

for q in queries:
    url = f"https://huggingface.co/api/datasets?search={urllib.parse.quote(q)}&limit=50"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            items = json.loads(resp.read().decode('utf-8'))
            for item in items:
                ds_id = item.get('id')
                if ds_id and ds_id not in found:
                    found[ds_id] = {
                        "downloads": item.get('downloads', 0),
                        "likes": item.get('likes', 0),
                        "tags": item.get('tags', [])
                    }
    except Exception as e:
        print(f"Error querying '{q}': {e}")

print(f"\nTotal unique Hugging Face datasets discovered: {len(found)}\n")

# Sort by downloads/popularity
sorted_ds = sorted(found.items(), key=lambda x: (x[1]['downloads'], x[1]['likes']), reverse=True)

for ds_id, meta in sorted_ds[:30]:
    print(f"- {ds_id} | Downloads: {meta['downloads']} | Likes: {meta['likes']}")
