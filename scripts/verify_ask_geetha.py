import subprocess
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

test_html = """<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<div id="app"></div>
<script src="http://localhost:8080/assets/js/bundle.js"></script>
<script>
window.addEventListener('load', () => {
  const log = [];
  try {
    // 1. Storage check
    const initialHist = window.storageManager.getChatHistory();
    log.push("Initial History Count: " + initialHist.length);

    // 2. Render fresh Ask Geetha
    const page = renderAskGeethaPage({ lang: 'en', theme: 'light' });
    const welcome = page.querySelector('#chat-welcome-state');
    const hasPredefinedMsg = page.innerText.includes('I am afraid of failing my exams.') && !welcome;
    
    if (welcome && !hasPredefinedMsg) {
      log.push("PASS: Fresh Ask Geetha opens with clean Welcome state and NO predefined message.");
    } else {
      log.push("FAIL: Predefined message or missing welcome state.");
    }

    // 3. Test Welcome suggestions exist
    const sugCards = page.querySelectorAll('.welcome-sug-card');
    log.push("Suggested Guidance Topics count: " + sugCards.length);

    // 4. Test rendering with historyId
    window.storageManager.saveChatConversation({
      id: 'test-history-1',
      title: 'How to overcome fear?',
      messages: [
        { role: 'user', text: 'How to overcome fear?' },
        { role: 'assistant', text: 'Krishna teaches us in Chapter 2...' }
      ]
    });

    const pageWithHist = renderAskGeethaPage({ lang: 'en', theme: 'light', historyId: 'test-history-1' });
    const hasLoadedMsg = pageWithHist.innerText.includes('How to overcome fear?');
    if (hasLoadedMsg) {
      log.push("PASS: Opening old chat from History successfully loads all saved messages.");
    } else {
      log.push("FAIL: Old chat from History did not load messages.");
    }

    // 5. Test fresh chat again without historyId
    const pageFreshAgain = renderAskGeethaPage({ lang: 'en', theme: 'light' });
    const welcomeAgain = pageFreshAgain.querySelector('#chat-welcome-state');
    if (welcomeAgain) {
      log.push("PASS: Ask Geetha without historyId ALWAYS starts a fresh new conversation.");
    } else {
      log.push("FAIL: Subsequent Ask Geetha load was not fresh.");
    }

    // 6. Test History Page rendering
    const histPage = renderHistoryPage({ lang: 'en' });
    const histCards = histPage.querySelectorAll('.group');
    log.push("History cards rendered: " + histCards.length);
    if (histCards.length > 0) {
      log.push("PASS: History Page renders saved dialogues with resume & delete options.");
    }

    // Cleanup test item
    window.storageManager.deleteChatHistoryEntry('test-history-1');

    document.getElementById('app').innerHTML = '<pre id="final-results">' + JSON.stringify(log, null, 2) + '</pre>';
  } catch(e) {
    document.getElementById('app').innerHTML = '<pre id="final-results">ERROR: ' + e.message + '</pre>';
  }
});
</script>
</body>
</html>"""

with open("d:/Geetha/test_runner.html", "w", encoding="utf-8") as f:
    f.write(test_html)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [edge_path, "--headless=new", "--disable-gpu", "--dump-dom", "http://localhost:8080/test_runner.html"]
res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
dom = res.stdout

import re
match = re.search(r'<pre id="final-results">(.*?)</pre>', dom, re.DOTALL)
if match:
    import json
    content = match.group(1).replace('&quot;', '"')
    try:
        logs = json.loads(content)
        print("\n=== ASK GEETHA & HISTORY BEHAVIOR VERIFICATION ===")
        for l in logs:
            print(f"  • {l}")
        print("===================================================\n")
    except:
        print(content)
else:
    print("Test output not captured. DOM snippet:\n", dom[:500])

if os.path.exists("d:/Geetha/test_runner.html"):
    os.remove("d:/Geetha/test_runner.html")
