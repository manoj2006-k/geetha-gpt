import asyncio
import websockets
import json
import subprocess
import urllib.request
import sys

sys.stdout.reconfigure(encoding='utf-8')

async def check_verse_render():
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    port = 9229
    cmd = [edge_path, "--headless=new", f"--remote-debugging-port={port}", "--disable-gpu", "--no-sandbox", "http://localhost:8000"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    await asyncio.sleep(2)
    req = urllib.request.urlopen(f"http://127.0.0.1:{port}/json")
    targets = json.loads(req.read().decode('utf-8'))
    page_target = next(t for t in targets if t.get('type') == 'page')
    ws_url = page_target['webSocketDebuggerUrl']
    
    async with websockets.connect(ws_url) as ws:
        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.enable'}))
        
        async def eval_js(expr):
            await ws.send(json.dumps({'id': 2, 'method': 'Runtime.evaluate', 'params': {'expression': expr, 'returnByValue': True, 'awaitPromise': True}}))
            while True:
                data = json.loads(await ws.recv())
                if data.get('id') == 2:
                    return data.get('result', {}).get('result', {}).get('value')

        await asyncio.sleep(1)
        
        # Navigate to Verse Detail for 1-1 in Telugu
        await eval_js("window.GeethaApp.setLanguage('te'); window.GeethaApp.navigate('verseDetail', { chapterNumber: 1, verseNumber: 1 });")
        await asyncio.sleep(1)
        te_1_1_title = await eval_js("document.querySelector('h1')?.textContent?.trim()")
        te_1_1_exp = await eval_js("document.querySelector('p.whitespace-pre-line')?.textContent?.trim()")
        print(f"=== Telugu 1.1 ===\nTitle: {te_1_1_title}\nExplanation:\n{te_1_1_exp[:180]}...\n")

        # Navigate to Verse Detail for 1-2 in Telugu
        await eval_js("window.GeethaApp.navigate('verseDetail', { chapterNumber: 1, verseNumber: 2 });")
        await asyncio.sleep(1)
        te_1_2_title = await eval_js("document.querySelector('h1')?.textContent?.trim()")
        te_1_2_exp = await eval_js("document.querySelector('p.whitespace-pre-line')?.textContent?.trim()")
        print(f"=== Telugu 1.2 ===\nTitle: {te_1_2_title}\nExplanation:\n{te_1_2_exp[:180]}...\n")

        # Check in Tamil
        await eval_js("window.GeethaApp.setLanguage('ta'); window.GeethaApp.navigate('verseDetail', { chapterNumber: 1, verseNumber: 1 });")
        await asyncio.sleep(1)
        ta_1_1_title = await eval_js("document.querySelector('h1')?.textContent?.trim()")
        ta_1_1_trans = await eval_js("document.querySelector('.verse-translation-text')?.textContent?.trim()")
        print(f"=== Tamil 1.1 ===\nTitle: {ta_1_1_title}\nTranslation:\n{ta_1_1_trans[:150]}...\n")

        # Check in Hindi
        await eval_js("window.GeethaApp.setLanguage('hi'); window.GeethaApp.navigate('verseDetail', { chapterNumber: 2, verseNumber: 47 });")
        await asyncio.sleep(1)
        hi_2_47_title = await eval_js("document.querySelector('h1')?.textContent?.trim()")
        hi_2_47_exp = await eval_js("document.querySelector('p.whitespace-pre-line')?.textContent?.trim()")
        print(f"=== Hindi 2.47 ===\nTitle: {hi_2_47_title}\nExplanation:\n{hi_2_47_exp[:180]}...\n")

    proc.terminate()

asyncio.run(check_verse_render())
