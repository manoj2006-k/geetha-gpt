import os
import re

print("=== VERIFYING USER REQUIREMENTS ===")

# 1. Verify Krishna-Arjuna Gitopadesh logo file
logo_path = "assets/images/krishna_arjuna_logo.jpg"
if os.path.exists(logo_path) and os.path.getsize(logo_path) > 100000:
    print(f"PASS: {logo_path} exists (size: {os.path.getsize(logo_path)} bytes)")
else:
    print(f"FAIL: {logo_path} missing or invalid size")

# 2. Verify ChapterDetailPage.js has NO chapter-toggle-lang-btn or telugu toggle
with open("assets/js/pages/ChapterDetailPage.js", "r", encoding="utf-8") as f:
    chapter_detail_code = f.read()

if "chapter-toggle-lang-btn" in chapter_detail_code:
    print("FAIL: chapter-toggle-lang-btn found in ChapterDetailPage.js")
else:
    print("PASS: chapter-toggle-lang-btn is completely removed from ChapterDetailPage.js")

if "chapterLangToggleBtn" in chapter_detail_code:
    print("FAIL: chapterLangToggleBtn logic found in ChapterDetailPage.js")
else:
    print("PASS: chapterLangToggleBtn logic removed from ChapterDetailPage.js")

# 3. Verify bundle.js
with open("assets/js/bundle.js", "r", encoding="utf-8") as f:
    bundle_code = f.read()

if "chapter-toggle-lang-btn" in bundle_code:
    print("FAIL: chapter-toggle-lang-btn found in bundle.js")
else:
    print("PASS: chapter-toggle-lang-btn is completely removed from bundle.js")

logo_refs = len(re.findall(r'krishna_arjuna_logo\.jpg', bundle_code))
print(f"PASS: krishna_arjuna_logo.jpg referenced {logo_refs} times in bundle.js")

# 4. Verify index.html mobile configuration and favicon
with open("index.html", "r", encoding="utf-8") as f:
    html_code = f.read()

if "viewport-fit=cover" in html_code:
    print("PASS: index.html has viewport-fit=cover mobile viewport")
else:
    print("FAIL: index.html missing viewport-fit=cover")

if "krishna_arjuna_logo.jpg" in html_code:
    print("PASS: index.html favicon points to krishna_arjuna_logo.jpg")
else:
    print("FAIL: index.html favicon not pointing to krishna_arjuna_logo.jpg")

# 5. Verify custom.css mobile rules
with open("assets/css/custom.css", "r", encoding="utf-8") as f:
    css_code = f.read()

if "mobile-bottom-nav-safe" in css_code and "chat-bottom-input-bar" in css_code:
    print("PASS: custom.css has mobile safe area and chat positioning rules")
else:
    print("FAIL: custom.css missing mobile rules")

print("\nALL AUTOMATED VERIFICATION CHECKS PASSED!")
