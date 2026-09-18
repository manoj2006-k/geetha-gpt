import subprocess
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [edge_path, "--headless=new", "--disable-gpu", "--dump-dom", "http://localhost:8080"]
res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
dom = res.stdout

print(f"Total rendered DOM size: {len(dom)} bytes\n")

checks = [
    ('<div id="app"', "App root mount element"),
    ('<aside', "Sidebar on desktop"),
    ('<header', "Top Navbar"),
    ('<main', "Main content canvas (Right side)"),
    ('Geetha GPT', "Branding header"),
    ('Bhagavad Gita 2.47', "Daily Wisdom Verse 2.47"),
    ('कर्मण्येवाधिकारस्ते', "Sacred Sanskrit Shloka"),
    ('Spiritual Psychology', "Life topics section"),
    ('Explore the Bhagavad Gita', "Chapters section preview or link"),
    ('18 Chapters', "18 Chapters statistic indicator")
]

for pattern, desc in checks:
    if pattern in dom:
        print(f"[PASS] Found: {desc}")
    else:
        print(f"[FAIL] Missing: {desc}")

print("\nBrowser DOM Verification Complete!")
