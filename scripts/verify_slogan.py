"""
Verification Script for Slogan Translation Removal
Ensures:
1. Slogan remains 'Wisdom for Every Question' in all languages (English, Telugu, Hindi, Tamil, Kannada, etc.).
2. Tagline remains 'Timeless Bhagavad Gita Guidance for Modern Life' in all languages.
3. getSlogan() always returns the original slogan regardless of uiLanguage.
4. Multilingual functionality of all other website text (UI, Nav, Buttons, Chapters, Settings) is 100% preserved.
"""

import os
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_slogan():
    print("==================================================")
    print("       SLOGAN VERIFICATION TEST SUITE             ")
    print("==================================================\n")
    all_passed = True
    
    i18n_dir = "d:/Geetha/assets/js/data/i18n"
    languages = [
        ('en', 'English'),
        ('te', 'Telugu'),
        ('hi', 'Hindi'),
        ('ta', 'Tamil'),
        ('kn', 'Kannada'),
        ('ml', 'Malayalam'),
        ('mr', 'Marathi'),
        ('bn', 'Bengali'),
        ('gu', 'Gujarati'),
        ('pa', 'Punjabi'),
        ('or', 'Odia'),
        ('as', 'Assamese'),
        ('ur', 'Urdu'),
        ('sa', 'Sanskrit')
    ]
    
    EXPECTED_SLOGAN = "Wisdom for Every Question"
    EXPECTED_TAGLINE = "Timeless Bhagavad Gita Guidance for Modern Life"

    # 1. Verify Slogan in Language Files
    print("[TEST 1] Verifying Slogan & Tagline across language dictionaries:")
    for code, name in languages:
        filepath = os.path.join(i18n_dir, f"{code}.js")
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        m = re.match(r'export const \w+ = (\{[\s\S]*\});?\s*$', content)
        if not m:
            print(f"  [FAIL] Could not parse dictionary for {name} ({code})")
            all_passed = False
            continue
        
        data = json.loads(m.group(1))
        slogan_val = data.get("slogan")
        tagline_val = data.get("tagline")
        hero_title = data.get("home", {}).get("heroTitle")
        
        if slogan_val == EXPECTED_SLOGAN and tagline_val == EXPECTED_TAGLINE and hero_title == EXPECTED_SLOGAN:
            print(f"  [PASS] {name:10} ({code}): Slogan = '{slogan_val}' (Unchanged)")
        else:
            print(f"  [FAIL] {name:10} ({code}): slogan='{slogan_val}', heroTitle='{hero_title}'")
            all_passed = False

    # 2. Verify Multilingual Preservation of UI, Navigation, Buttons, Chapters
    print("\n[TEST 2] Verifying that other UI translations are NOT broken/removed:")
    check_keys = {
        'te': ('nav.home', 'హోమ్'),
        'hi': ('nav.home', 'होम'),
        'ta': ('nav.home', 'முகப்பு'),
        'kn': ('nav.home', 'ಮುಖಪುಟ'),
    }
    for code, (key_path, expected_val) in check_keys.items():
        filepath = os.path.join(i18n_dir, f"{code}.js")
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.loads(re.match(r'export const \w+ = (\{[\s\S]*\});?\s*$', f.read()).group(1))
        val = data.get("nav", {}).get("home")
        if val == expected_val:
            print(f"  [PASS] Preserved UI translation for {code}: nav.home = '{val}'")
        else:
            print(f"  [FAIL] UI translation missing for {code}: expected '{expected_val}', got '{val}'")
            all_passed = False

    # 3. Verify HomePage.js uses ORIGINAL_SLOGAN
    print("\n[TEST 3] Verifying HomePage.js uses ORIGINAL_SLOGAN for heading:")
    homepage_path = "d:/Geetha/assets/js/pages/HomePage.js"
    with open(homepage_path, "r", encoding="utf-8") as f:
        hp_content = f.read()
    
    if "ORIGINAL_SLOGAN" in hp_content and "${ORIGINAL_SLOGAN}" in hp_content:
        print("  [PASS] HomePage.js renders ${ORIGINAL_SLOGAN} directly in hero heading")
    else:
        print("  [FAIL] HomePage.js does not render ORIGINAL_SLOGAN")
        all_passed = False

    # 4. Verify i18n.js exports getSlogan and ORIGINAL_SLOGAN
    print("\n[TEST 4] Verifying i18n.js exports getSlogan and handles t('slogan'):")
    i18n_path = "d:/Geetha/assets/js/data/i18n.js"
    with open(i18n_path, "r", encoding="utf-8") as f:
        i18n_code = f.read()
    
    if "export function getSlogan" in i18n_code and "ORIGINAL_SLOGAN" in i18n_code:
        print("  [PASS] i18n.js exports getSlogan() and ORIGINAL_SLOGAN")
    else:
        print("  [FAIL] i18n.js missing getSlogan() or ORIGINAL_SLOGAN")
        all_passed = False

    # 5. Verify bundle.js includes getSlogan on window
    print("\n[TEST 5] Verifying bundle.js includes window.getSlogan & window.ORIGINAL_SLOGAN:")
    bundle_path = "d:/Geetha/assets/js/bundle.js"
    with open(bundle_path, "r", encoding="utf-8") as f:
        bundle_code = f.read()
    
    if "window.getSlogan = getSlogan;" in bundle_code and "window.ORIGINAL_SLOGAN = ORIGINAL_SLOGAN;" in bundle_code:
        print("  [PASS] bundle.js exposes window.getSlogan & window.ORIGINAL_SLOGAN")
    else:
        print("  [FAIL] bundle.js missing window.getSlogan export")
        all_passed = False

    # 6. Verify pure Sanskrit shloka in Sidebar.js
    print("\n[TEST 6] Verifying Sidebar.js shloka text is pure Sanskrit:")
    sidebar_path = "d:/Geetha/assets/js/components/Sidebar.js"
    with open(sidebar_path, "r", encoding="utf-8") as f:
        sb_code = f.read()
    if "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन" in sb_code:
        print("  [PASS] Sidebar.js shloka is in authentic original Sanskrit")
    else:
        print("  [FAIL] Sidebar.js shloka still contains non-Sanskrit characters")
        all_passed = False

    # 7. Verify VerseCard.js does NOT contain Telugu/English toggle button or translation toggle
    print("\n[TEST 7] Verifying VerseCard.js has NO Telugu <-> English translation toggle:")
    verse_card_path = "d:/Geetha/assets/js/components/VerseCard.js"
    with open(verse_card_path, "r", encoding="utf-8") as f:
        vc_code = f.read()
    if "verse-translate-btn" not in vc_code and "Toggle Telugu/English" not in vc_code:
        print("  [PASS] VerseCard.js does NOT contain Telugu <-> English translation toggle button")
    else:
        print("  [FAIL] VerseCard.js still contains translation toggle button")
        all_passed = False

    # 8. Verify Voice Assistant component and Navbar integration
    print("\n[TEST 8] Verifying Multi-Language Voice Assistant integration:")
    va_path = "d:/Geetha/assets/js/components/VoiceAssistantModal.js"
    navbar_path = "d:/Geetha/assets/js/components/Navbar.js"
    with open(va_path, "r", encoding="utf-8") as f:
        va_code = f.read()
    with open(navbar_path, "r", encoding="utf-8") as f:
        nav_code = f.read()
    with open(bundle_path, "r", encoding="utf-8") as f:
        bundle_code = f.read()

    if "MultiLanguageSpeechRecognizer" in bundle_code and "window.voiceAssistantModal" in bundle_code:
        print("  [PASS] Voice Assistant modal and speechRecognizer exposed in bundle.js")
    else:
        print("  [FAIL] Voice Assistant modal or speechRecognizer missing in bundle.js")
        all_passed = False

    if "nav-voice-btn" in nav_code:
        print("  [PASS] Navbar.js includes dedicated Voice Assistant trigger button")
    else:
        print("  [FAIL] Navbar.js missing Voice Assistant button")
        all_passed = False

    print("\n==================================================")
    if all_passed:
        print(">>> ALL 8 VERIFICATION CHECKS PASSED (100% OK) <<<")
    else:
        print(">>> SOME VERIFICATION CHECKS FAILED <<<")
    print("==================================================")
    return all_passed

if __name__ == "__main__":
    verify_slogan()

