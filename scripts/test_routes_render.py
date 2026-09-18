import subprocess
import json

script = """
(() => {
  const app = new GeethaApp();
  console.log('INITIAL ROUTE:', app.currentRoute);
  
  // Test navigation to chapters
  app.navigate('chapters');
  const chGrid = document.querySelector('#chapters-grid');
  console.log('CHAPTERS COUNT:', chGrid ? chGrid.children.length : 0);
  
  // Test navigation to chapter detail (Chapter 2)
  app.navigate('chapterDetail', { chapterNumber: 2 });
  const vMount = document.querySelector('#chapter-verses-mount');
  console.log('CH 2 VERSES COUNT:', vMount ? vMount.children.length : 0);
  
  // Test navigation to verse detail (Verse 2.47)
  app.navigate('verseDetail', { chapterNumber: 2, verseNumber: 47 });
  const h1 = document.querySelector('h1');
  console.log('VERSE DETAIL TITLE:', h1 ? h1.innerText : 'none');
  
  // Test navigation to verse detail (Verse 18.78)
  app.navigate('verseDetail', { chapterNumber: 18, verseNumber: 78 });
  const h1_18 = document.querySelector('h1');
  console.log('VERSE 18.78 TITLE:', h1_18 ? h1_18.innerText : 'none');
})();
"""

html = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<div id="app"></div>
<script src="http://localhost:8080/assets/js/bundle.js"></script>
<script>
window.addEventListener('DOMContentLoaded', () => {{
  {script}
}});
</script>
</body>
</html>"""

with open("d:/Geetha/test_nav.html", "w", encoding="utf-8") as f:
    f.write(html)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [edge_path, "--headless=new", "--disable-gpu", "--dump-dom", "http://localhost:8080/test_nav.html"]
res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
dom = res.stdout

print("DOM length for navigation test:", len(dom))
if "Chapter 18 • Verse 78" in dom:
    print("[PASS] Successfully navigated to Chapter 18 • Verse 78 detail page!")
if "यत्र योगेश्वरः" in dom:
    print("[PASS] Verse 18.78 Sanskrit text rendered in DOM!")
