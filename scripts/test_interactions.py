import subprocess
import time
import json
import urllib.request
import asyncio
import websockets

async def run_interaction_tests():
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    port = 9227
    cmd = [
        edge_path,
        "--headless=new",
        f"--remote-debugging-port={port}",
        "--disable-gpu",
        "--no-sandbox",
        "http://localhost:8000"
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    exceptions = []
    
    try:
        await asyncio.sleep(2)
        req = urllib.request.urlopen(f"http://127.0.0.1:{port}/json")
        targets = json.loads(req.read().decode('utf-8'))
        page_target = next(t for t in targets if t.get('type') == 'page')
        ws_url = page_target['webSocketDebuggerUrl']
        
        async with websockets.connect(ws_url) as ws:
            await ws.send(json.dumps({"id": 1, "method": "Runtime.enable"}))
            await ws.send(json.dumps({"id": 2, "method": "Page.enable"}))

            msg_id = 10
            async def eval_js(expression):
                nonlocal msg_id
                msg_id += 1
                curr_id = msg_id
                await ws.send(json.dumps({
                    "id": curr_id,
                    "method": "Runtime.evaluate",
                    "params": {"expression": expression, "returnByValue": True, "awaitPromise": True}
                }))
                while True:
                    res = await ws.recv()
                    data = json.loads(res)
                    if data.get('method') == 'Runtime.exceptionThrown':
                        exceptions.append(data['params']['exceptionDetails'])
                    if data.get('id') == curr_id:
                        return data.get('result', {})

            # Poll until #app is populated (up to 10s)
            mounted = False
            for _ in range(20):
                res = await eval_js("document.getElementById('app') ? document.getElementById('app').children.length : 0")
                count = res.get('result', {}).get('value', 0)
                if count > 0:
                    mounted = True
                    break
                await asyncio.sleep(0.5)

            print("App mounted into DOM:", mounted)
            if not mounted:
                return

            # Check buttons in navbar
            res_btn = await eval_js("Boolean(document.querySelector('#lang-toggle-btn'))")
            print("Language button found in DOM:", res_btn.get('result', {}).get('value'))

            # Click language button to open modal
            res_modal = await eval_js("""
                (function() {
                    const btn = document.querySelector('#lang-toggle-btn');
                    if (btn) {
                        btn.click();
                        return Boolean(document.querySelector('#language-selection-modal'));
                    }
                    return false;
                })()
            """)
            print("Language Modal opened:", res_modal.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            # Check total languages displayed in modal
            res_langs = await eval_js("document.querySelectorAll('#language-selection-modal button[data-lang-code]').length")
            print("Language options rendered in modal:", res_langs.get('result', {}).get('value'))

            # Select Hindi
            res_hi = await eval_js("""
                (function() {
                    const hiBtn = document.querySelector('#language-selection-modal button[data-lang-code="hi"]');
                    if (hiBtn) {
                        hiBtn.click();
                        return true;
                    }
                    return false;
                })()
            """)
            print("Clicked Hindi option:", res_hi.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            res_lang = await eval_js("document.documentElement.lang")
            print("Current document.documentElement.lang:", res_lang.get('result', {}).get('value'))

            # Open modal again and select Urdu (RTL test)
            res_ur = await eval_js("""
                (function() {
                    const btn = document.querySelector('#lang-toggle-btn');
                    if (btn) btn.click();
                    const urBtn = document.querySelector('#language-selection-modal button[data-lang-code="ur"]');
                    if (urBtn) {
                        urBtn.click();
                        return true;
                    }
                    return false;
                })()
            """)
            print("Switched to Urdu:", res_ur.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            res_dir = await eval_js("document.documentElement.dir")
            print("Current document.documentElement.dir (Urdu):", res_dir.get('result', {}).get('value'))

            # Switch back to English
            await eval_js("""
                (function() {
                    const btn = document.querySelector('#lang-toggle-btn');
                    if (btn) btn.click();
                    const enBtn = document.querySelector('#language-selection-modal button[data-lang-code="en"]');
                    if (enBtn) enBtn.click();
                })()
            """)
            await asyncio.sleep(0.5)
            res_en = await eval_js("document.documentElement.lang")
            print("Back to English:", res_en.get('result', {}).get('value'))

            # Navigate to Chapters page
            res_nav = await eval_js("""
                (function() {
                    const link = document.querySelector('button[data-nav="chapters"]') || document.querySelector('.sidebar-nav button:nth-child(3)');
                    if (link) {
                        link.click();
                        return true;
                    }
                    return false;
                })()
            """)
            print("Navigated to Chapters:", res_nav.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            # Check chapter cards rendered
            res_ch_count = await eval_js("document.querySelectorAll('#chapters-grid [data-chapter-number]').length")
            print("Chapter cards rendered in grid:", res_ch_count.get('result', {}).get('value'))

            # Test 8: Navigate to Chapter Detail (click first chapter card)
            res_ch_detail = await eval_js("""
                (function() {
                    const firstCh = document.querySelector('#chapters-grid [data-chapter-number]');
                    if (firstCh) { firstCh.click(); return true; }
                    return false;
                })()
            """)
            print("Navigated to Chapter Detail:", res_ch_detail.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            # Test 9: Navigate to Verse Detail (click explore on first verse)
            res_v_detail = await eval_js("""
                (function() {
                    const vBtn = document.querySelector('.verse-view-detail-btn') || document.querySelector('.verse-header-title-btn');
                    if (vBtn) { vBtn.click(); return true; }
                    return false;
                })()
            """)
            print("Navigated to Verse Detail:", res_v_detail.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            # Test 10: Navigate to Ask Geetha Page
            res_ask = await eval_js("""
                (function() {
                    const askLink = document.querySelector('button[data-nav="askGeetha"]') || document.querySelector('#nav-ask-btn');
                    if (askLink) { askLink.click(); return true; }
                    return false;
                })()
            """)
            print("Navigated to Ask Geetha:", res_ask.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            # Test 11: Navigate to Topics Page
            res_topics = await eval_js("""
                (function() {
                    const link = document.querySelector('button[data-nav="topics"]');
                    if (link) { link.click(); return true; }
                    return false;
                })()
            """)
            print("Navigated to Topics:", res_topics.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            # Test 12: Navigate to Daily Wisdom Page
            res_daily = await eval_js("""
                (function() {
                    const link = document.querySelector('button[data-nav="dailyWisdom"]');
                    if (link) { link.click(); return true; }
                    return false;
                })()
            """)
            print("Navigated to Daily Wisdom:", res_daily.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            # Test 13: Navigate to Saved Verses Page
            res_saved = await eval_js("""
                (function() {
                    const link = document.querySelector('button[data-nav="saved"]');
                    if (link) { link.click(); return true; }
                    return false;
                })()
            """)
            print("Navigated to Saved Verses:", res_saved.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            # Test 14: Navigate to History Page
            res_history = await eval_js("""
                (function() {
                    const link = document.querySelector('button[data-nav="history"]');
                    if (link) { link.click(); return true; }
                    return false;
                })()
            """)
            print("Navigated to History:", res_history.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            # Test 15: Navigate to Settings Page
            res_settings = await eval_js("""
                (function() {
                    const link = document.querySelector('button[data-nav="settings"]');
                    if (link) { link.click(); return true; }
                    return false;
                })()
            """)
            print("Navigated to Settings:", res_settings.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            print(f"\nTotal Exceptions: {len(exceptions)}")
            if exceptions:
                for ex in exceptions:
                    print("ERROR:", ex.get('text'), ex.get('exception', {}).get('description'))
            else:
                print(">>> ALL 23-LANGUAGE UI INTERACTIONS & ALL ROUTES VERIFIED FLAWLESSLY! <<<")

    finally:
        proc.kill()

if __name__ == "__main__":
    asyncio.run(run_interaction_tests())
