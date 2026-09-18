import os
import re
import json

def strip_module_syntax(code):
    lines = code.split('\n')
    out = []
    in_import = False
    for line in lines:
        stripped = line.strip()
        # Handle multi-line imports
        if in_import:
            if ';' in line or '}' in line or line.startswith('from '):
                in_import = False
            continue

        if stripped.startswith('import ') or stripped.startswith('import{'):
            if not (';' in line or "'" in line or '"' in line):
                in_import = True
            continue

        # Strip exports
        if line.startswith('export const '):
            line = 'const ' + line[len('export const '):]
        elif line.startswith('export let '):
            line = 'let ' + line[len('export let '):]
        elif line.startswith('export function '):
            line = 'function ' + line[len('export function '):]
        elif line.startswith('export class '):
            line = 'class ' + line[len('export class '):]
        elif line.startswith('export default '):
            line = line[len('export default '):]
        elif line.startswith('export '):
            line = '// ' + line

        out.append(line)
    return '\n'.join(out)

def main():
    print("Building standalone bundle.js...")
    base_dir = "d:/Geetha/assets/js"

    # Order of inclusion matters for variable definitions
    files_order = [
        "data/chaptersData.js",
        # 18 chapter datasets
        "data/chapter01.js",
        "data/chapter02.js",
        "data/chapter03.js",
        "data/chapter04.js",
        "data/chapter05.js",
        "data/chapter06.js",
        "data/chapter07.js",
        "data/chapter08.js",
        "data/chapter09.js",
        "data/chapter10.js",
        "data/chapter11.js",
        "data/chapter12.js",
        "data/chapter13.js",
        "data/chapter14.js",
        "data/chapter15.js",
        "data/chapter16.js",
        "data/chapter17.js",
        "data/chapter18.js",
        "data/topicsData.js",
        "data/dailyWisdomData.js",
        "data/chatMockData.js",
        # Language registry (must come before i18n.js)
        "data/languages.js",
        # All 23 i18n dictionaries (must come before i18n.js)
        "data/i18n/en.js",
        "data/i18n/hi.js",
        "data/i18n/te.js",
        "data/i18n/ta.js",
        "data/i18n/kn.js",
        "data/i18n/ml.js",
        "data/i18n/mr.js",
        "data/i18n/bn.js",
        "data/i18n/gu.js",
        "data/i18n/pa.js",
        "data/i18n/or.js",
        "data/i18n/as.js",
        "data/i18n/ur.js",
        "data/i18n/sa.js",
        "data/i18n/ks.js",
        "data/i18n/kok.js",
        "data/i18n/mai.js",
        "data/i18n/mni.js",
        "data/i18n/ne.js",
        "data/i18n/brx.js",
        "data/i18n/sat.js",
        "data/i18n/sd.js",
        "data/i18n/doi.js",
        # Unified i18n system
        "data/i18n.js",
        "utils/storageUtil.js",
        "utils/soundUtil.js",
        "utils/speechUtil.js",
        "utils/quoteCanvas.js",
        "components/Toast.js",
        "components/ShareModal.js",
        "components/SearchBarModal.js",
        # LanguageModal must come before Navbar, Sidebar, MobileNav
        "components/LanguageModal.js",
        "components/Navbar.js",
        "components/Sidebar.js",
        "components/MobileNav.js",
        "components/ChapterCard.js",
        "components/TopicCard.js",
        "components/VerseCard.js",
        "components/ChatMessage.js",
        "pages/HomePage.js",
        "pages/AskGeethaPage.js",
        "pages/ChaptersPage.js",
        "pages/ChapterDetailPage.js",
        "pages/VerseDetailPage.js",
        "pages/TopicsPage.js",
        "pages/TopicDetailPage.js",
        "pages/DailyWisdomPage.js",
        "pages/SavedVersesPage.js",
        "pages/HistoryPage.js",
        "pages/SettingsPage.js",
        "app.js"
    ]

    bundle_parts = [
        "/**\n * Geetha GPT - Standalone Single-File Application Bundle\n * Complete 18 Chapters • 700+ Verses Database • Zero CORS / Works locally in file:// and http://\n */\n(function() {\n  'use strict';\n"
    ]

    # Combine master VERSES_DATA definition right after chapters using Array.concat
    chapter_arrays = [f"CHAPTER_{c:02d}" for c in range(1, 19)]
    verses_data_def = f"\n  const VERSES_DATA = [].concat(\n    " + ",\n    ".join(chapter_arrays) + "\n  );\n"

    inserted_verses_data = False

    for rel_path in files_order:
        full_path = os.path.join(base_dir, rel_path)
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        cleaned = strip_module_syntax(content)
        bundle_parts.append(f"\n  /* ==========================================================================\n     MODULE: {rel_path}\n     ========================================================================== */\n")
        bundle_parts.append(cleaned)

        if rel_path == "data/chapter18.js" and not inserted_verses_data:
            bundle_parts.append(verses_data_def)
            inserted_verses_data = True

    bundle_parts.append("\n  window.GeethaApp = GeethaApp;\n  window.storageManager = storageManager;\n  window.renderAskGeethaPage = renderAskGeethaPage;\n  window.renderHistoryPage = renderHistoryPage;\n})();\n")

    full_bundle = "\n".join(bundle_parts)

    out_file = os.path.join(base_dir, "bundle.js")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(full_bundle)

    size_kb = os.path.getsize(out_file) / 1024
    print(f"SUCCESS: Built bundle.js ({size_kb:.1f} KB)")

if __name__ == "__main__":
    main()
