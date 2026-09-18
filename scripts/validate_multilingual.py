import sys, json, re, os
sys.stdout.reconfigure(encoding='utf-8')

# 1. Check 23 languages in languages.js
with open('assets/js/data/languages.js', 'r', encoding='utf-8') as f:
    content = f.read()
codes = re.findall(r"code:\s*'([^']+)'", content)
print(f'Languages in languages.js: {len(codes)} -> {codes}')

# 2. Check all 23 i18n files
i18n_files = os.listdir('assets/js/data/i18n')
print(f'i18n files: {len(i18n_files)} -> {sorted(i18n_files)}')

# 3. Check verses count in gita_verses.json
with open('data/gita_verses.json', 'r', encoding='utf-8') as f:
    verses = json.load(f)
print(f'Total verses in gita_verses.json: {len(verses)}')

# 4. Check sample verse has translations field
v1 = verses[0]
has_translations = 'translations' in v1
has_hi = bool(v1.get('translations', {}).get('hi', ''))
has_en = bool(v1.get('translations', {}).get('en', ''))
has_te = bool(v1.get('translations', {}).get('te', ''))
print(f'Verse 1.1 has translations field: {has_translations}, en: {has_en}, hi: {has_hi}, te: {has_te}')

# 5. Check bundle size
bundle_size = os.path.getsize('assets/js/bundle.js')
print(f'bundle.js size: {bundle_size/1024:.1f} KB')

# 6. Check key symbols in bundle
with open('assets/js/bundle.js', 'r', encoding='utf-8') as f:
    bundle = f.read()

symbols = ['LANGUAGES', 'I18N', 'LanguageModal', 'languageModal', 'getLanguage', 'isRTL', 'applyLanguage', 'EN =', 'HI =', 'TE =', 'TA =']
for s in symbols:
    found = s in bundle
    status = 'OK' if found else 'MISSING'
    print(f'  {s}: {status}')

# 7. Hindi translation coverage
hi_count = sum(1 for v in verses if v.get('translations', {}).get('hi'))
gu_count = sum(1 for v in verses if v.get('translations', {}).get('gu'))
en_count = sum(1 for v in verses if v.get('translations', {}).get('en'))
te_count = sum(1 for v in verses if v.get('translations', {}).get('te'))
print(f'Translation coverage: en={en_count}, hi={hi_count}, te={te_count}, gu={gu_count} out of {len(verses)}')
