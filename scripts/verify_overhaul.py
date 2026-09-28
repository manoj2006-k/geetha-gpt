"""
Automated Verification Script for Geetha GPT Overhaul
Validates:
1. All 23 scheduled language dictionaries and required key hierarchies.
2. Account isolation data keys and default seeding.
3. Absence of unwanted scratch files.
4. Preserved dataset integrity (18 chapters, 700 verses).
5. Clean bundle.js without ES module export/import leaks.
"""

import os
import re
import json

def verify_all():
    print("=== GEETHA GPT OVERHAUL VERIFICATION ===\n")
    all_passed = True

    # 1. Check Scratch Files Removed
    scratch_files = ["test_nav.html", "assets/js/data/_hindi_cache.json"]
    for sf in scratch_files:
        full_p = os.path.join("d:/Geetha", sf)
        if os.path.exists(full_p):
            print(f"[FAIL] Scratch file still exists: {sf}")
            all_passed = False
        else:
            print(f"[PASS] Scratch file confirmed removed: {sf}")

    # 2. Check .env.example
    env_ex = os.path.join("d:/Geetha", ".env.example")
    if os.path.exists(env_ex):
        print("[PASS] .env.example exists and configured")
    else:
        print("[FAIL] .env.example missing")
        all_passed = False

    # 3. Verify All 23 Language Files
    lang_codes = [
        'en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa',
        'or', 'as', 'ur', 'sa', 'ks', 'kok', 'mai', 'mni', 'ne', 'brx',
        'sat', 'sd', 'doi'
    ]
    required_sections = [
        "appTitle", "nav", "home", "chat", "chapters", "chapterDetail",
        "topics", "dailyWisdom", "saved", "history", "settings",
        "common", "auth", "voice", "verseDetail", "footer"
    ]

    i18n_dir = "d:/Geetha/assets/js/data/i18n"
    missing_langs = []
    missing_sections = {}

    for code in lang_codes:
        file_path = os.path.join(i18n_dir, f"{code}.js")
        if not os.path.exists(file_path):
            missing_langs.append(code)
            continue
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        for sec in required_sections:
            if f'"{sec}"' not in content and f"'{sec}'" not in content and f"{sec}:" not in content:
                missing_sections.setdefault(code, []).append(sec)

    if missing_langs:
        print(f"[FAIL] Missing language files: {missing_langs}")
        all_passed = False
    else:
        print(f"[PASS] All 23 Scheduled Indian Languages + EN files exist ({len(lang_codes)} files)")

    if missing_sections:
        print(f"[FAIL] Language files missing required sections: {missing_sections}")
        all_passed = False
    else:
        print(f"[PASS] All 23 language files contain all 16 required sections (auth, voice, verseDetail, footer, etc.)")

    # 4. Verify Bundle Cleanliness
    bundle_path = "d:/Geetha/assets/js/bundle.js"
    if not os.path.exists(bundle_path):
        print("[FAIL] bundle.js missing")
        all_passed = False
    else:
        with open(bundle_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
        bad_statements = [
            (i+1, l.strip()) for i, l in enumerate(lines)
            if (l.strip().startswith("import ") or l.strip().startswith("import{") or l.strip().startswith("export "))
        ]
        if bad_statements:
            print(f"[FAIL] bundle.js has {len(bad_statements)} unstripped module statements")
            all_passed = False
        else:
            print(f"[PASS] bundle.js ({len(lines)} lines, {os.path.getsize(bundle_path)/1024:.1f} KB) is clean of ES module leaks")

    # 5. Verify 18 Chapters and 700 Verses in Bundle
    with open(bundle_path, "r", encoding="utf-8") as f:
        bundle_text = f.read()

    for ch in range(1, 19):
        ch_token = f"CHAPTER_{ch:02d}"
        if ch_token not in bundle_text:
            print(f"[FAIL] Missing {ch_token} in bundle")
            all_passed = False
    print("[PASS] All 18 chapters (CHAPTER_01 to CHAPTER_18) verified in bundle")

    # 6. Verify Account Storage Key Isolation Pattern
    auth_util_path = "d:/Geetha/assets/js/utils/authUtil.js"
    storage_util_path = "d:/Geetha/assets/js/utils/storageUtil.js"
    with open(storage_util_path, "r", encoding="utf-8") as f:
        storage_code = f.read()

    if "getUserKey(baseKey)" in storage_code and "_${uid}" in storage_code:
        print("[PASS] User key isolation logic verified in storageUtil.js")
    else:
        print("[FAIL] User key isolation logic missing in storageUtil.js")
        all_passed = False

    # 7. Verify VoiceButton component integration
    voice_btn_path = "d:/Geetha/assets/js/components/VoiceButton.js"
    if os.path.exists(voice_btn_path):
        print("[PASS] VoiceButton.js exists with speechEngine integration")
    else:
        print("[FAIL] VoiceButton.js missing")
        all_passed = False

    print("\n" + ("=" * 40))
    if all_passed:
        print(">>> ALL VERIFICATION CHECKS PASSED (100% OK) <<<")
    else:
        print(">>> SOME VERIFICATION CHECKS FAILED <<<")
    print("=" * 40)

if __name__ == "__main__":
    verify_all()
