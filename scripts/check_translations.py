"""
Geetha GPT — Fetch Telugu translations from gita/gita repo and check availability.
"""
import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

url = 'https://raw.githubusercontent.com/gita/gita/master/data/translation.json'
print(f"Fetching {url}...")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=60) as res:
    data = json.loads(res.read().decode('utf-8'))

# Check available languages
langs = set()
for t in data:
    langs.add(t.get('lang', 'unknown'))

print(f"\nAvailable languages: {sorted(langs)}")
print(f"Total translation entries: {len(data)}")

# Count per language
from collections import Counter
lang_counts = Counter(t.get('lang', 'unknown') for t in data)
for lang, count in sorted(lang_counts.items()):
    print(f"  {lang}: {count} entries")

# Check Telugu specifically
telugu_entries = [t for t in data if t.get('lang') == 'telugu']
print(f"\nTelugu entries found: {len(telugu_entries)}")
if telugu_entries:
    print("Sample Telugu entry:", json.dumps(telugu_entries[0], ensure_ascii=False, indent=2))

# Also check Hindi entries and their authors
hindi_entries = [t for t in data if t.get('lang') == 'hindi']
hindi_authors = set(t.get('authorName', '') for t in hindi_entries)
print(f"\nHindi entries: {len(hindi_entries)}, Authors: {hindi_authors}")
