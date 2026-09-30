import subprocess
import time
import json
import urllib.request
import asyncio
import websockets
import sys

sys.stdout.reconfigure(encoding='utf-8')

async def run_options_test():
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    port = 9335
    cmd = [
        edge_path,
        "--headless=new",
        f"--remote-debugging-port={port}",
        "--disable-gpu",
        "--no-sandbox",
        "file:///d:/Geetha/index.html"
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    try:
        await asyncio.sleep(2)
        req = urllib.request.urlopen(f"http://127.0.0.1:{port}/json")
        targets = json.loads(req.read().decode('utf-8'))
        page_target = next(t for t in targets if t.get('type') == 'page')
        ws_url = page_target['webSocketDebuggerUrl']
        
        async with websockets.connect(ws_url) as ws:
            await ws.send(json.dumps({"id": 1, "method": "Runtime.enable"}))
            await ws.send(json.dumps({"id": 2, "method": "Log.enable"}))
            
            console_errors = []
            
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
                    if data.get('method') == 'Runtime.consoleAPICalled':
                        params = data.get('params', {})
                        if params.get('type') in ['error', 'warning']:
                            args = [str(a.get('value', a.get('description', ''))) for a in params.get('args', [])]
                            console_errors.append(f"CONSOLE {params.get('type').upper()}: {' '.join(args)}")
                    if data.get('method') == 'Runtime.exceptionThrown':
                        ex = data.get('params', {}).get('exceptionDetails', {})
                        console_errors.append(f"EXCEPTION: {ex.get('text', '')} {ex.get('exception', {}).get('description', '')}")
                    if data.get('id') == curr_id:
                        res_obj = data.get('result', {})
                        if 'exceptionDetails' in res_obj:
                            console_errors.append(f"EVAL EXCEPTION: {res_obj['exceptionDetails']}")
                            return None
                        return res_obj.get('result', {}).get('value')
            
            print("=== TESTING ALL NAVIGATION AND INTERACTION OPTIONS ===")
            
            # Test 1: Test all nav links
            routes = ['home', 'askGeetha', 'chapters', 'topics', 'dailyWisdom', 'saved', 'history', 'settings']
            for r in routes:
                res = await eval_js(f"""
                    (() => {{
                        try {{
                            window.app.navigate('{r}');
                            return 'NAV_OK: ' + window.app.currentRoute;
                        }} catch (e) {{
                            return 'NAV_ERR: ' + e.message;
                        }}
                    }})()
                """)
                print(f"Nav to {r}: {res}")
            
            # Test 2: Test Settings Page options
            await eval_js("window.app.navigate('settings');")
            settings_check = await eval_js("""
                (() => {
                    const results = [];
                    // Theme buttons
                    const themeBtns = document.querySelectorAll('.theme-opt-btn');
                    results.push('themeBtns: ' + themeBtns.length);
                    if (themeBtns.length >= 2) {
                        themeBtns[1].click(); // click dark
                        results.push('themeDark: ' + document.documentElement.classList.contains('dark'));
                        themeBtns[0].click(); // click light
                        results.push('themeLight: ' + !document.documentElement.classList.contains('dark'));
                    }
                    
                    // Script buttons
                    const scriptBtns = document.querySelectorAll('.script-opt-btn');
                    results.push('scriptBtns: ' + scriptBtns.length);
                    if (scriptBtns.length >= 3) {
                        scriptBtns[1].click(); // translit
                        results.push('scriptTranslit: ' + window.app.settings.sanskritDisplay);
                        scriptBtns[0].click(); // devanagari
                    }
                    
                    // Font size buttons
                    const fontSizeBtns = document.querySelectorAll('.font-size-opt-btn');
                    results.push('fontSizeBtns: ' + fontSizeBtns.length);
                    if (fontSizeBtns.length >= 3) {
                        fontSizeBtns[0].click(); // small
                        results.push('fontSizeSmall: ' + window.app.settings.fontSize);
                        fontSizeBtns[2].click(); // large
                        results.push('fontSizeLarge: ' + window.app.settings.fontSize);
                        fontSizeBtns[1].click(); // medium
                        results.push('fontSizeMedium: ' + window.app.settings.fontSize);
                    }

                    // Sound toggle
                    const soundInput = document.getElementById('sound-toggle-input');
                    if (soundInput) {
                        soundInput.checked = false;
                        soundInput.dispatchEvent(new Event('change'));
                        results.push('soundDisabled: ' + window.app.settings.soundEnabled);
                        soundInput.checked = true;
                        soundInput.dispatchEvent(new Event('change'));
                        results.push('soundEnabled: ' + window.app.settings.soundEnabled);
                    } else {
                        results.push('soundInput missing');
                    }
                    
                    // Notifications toggle
                    const notifInput = document.getElementById('notif-toggle-input');
                    if (notifInput) {
                        notifInput.checked = false;
                        notifInput.dispatchEvent(new Event('change'));
                        results.push('notifDisabled: ' + window.app.settings.notificationsEnabled);
                        notifInput.checked = true;
                        notifInput.dispatchEvent(new Event('change'));
                    } else {
                        results.push('notifInput missing');
                    }
                    
                    // Quick language buttons
                    const qlBtns = document.querySelectorAll('.quick-lang-btn');
                    results.push('qlBtns: ' + qlBtns.length);
                    if (qlBtns.length > 0) {
                        const first = qlBtns[1]; // Telugu or Hindi
                        const langCode = first.dataset.lang;
                        first.click();
                        results.push('qlSwitched: ' + window.app.settings.language);
                    }
                    
                    // Switch back to en
                    window.app.settings.language = 'en';
                    window.storageManager.saveSettings(window.app.settings);
                    window.app.applyLanguage('en');
                    window.app.render();

                    return results;
                })()
            """)
            print("Settings options check:", settings_check)
            
            # Test 3: Test Chapter Detail filters & options
            await eval_js("window.app.navigate('chapterDetail', { chapterNumber: 2 });")
            ch_filter_check = await eval_js("""
                (() => {
                    const results = [];
                    const tabs = document.querySelectorAll('.verse-tab-btn');
                    results.push('tabsCount: ' + tabs.length);
                    tabs.forEach(t => {
                        t.click();
                        const vCards = document.querySelectorAll('#chapter-verses-mount [data-verse-id]');
                        results.push(t.dataset.filter + ' -> cards: ' + vCards.length);
                    });
                    
                    // Test verse card options on first card
                    const firstCard = document.querySelector('#chapter-verses-mount [data-verse-id]');
                    if (firstCard) {
                        const explainBtn = firstCard.querySelector('.verse-explain-btn');
                        const shareBtn = firstCard.querySelector('.verse-share-btn');
                        const saveBtn = firstCard.querySelector('.verse-save-btn');
                        const voiceBtn = firstCard.querySelector('.verse-voice-slot button');
                        const detailBtn = firstCard.querySelector('.verse-view-detail-btn');
                        results.push('firstCard explainBtn: ' + !!explainBtn);
                        results.push('firstCard shareBtn: ' + !!shareBtn);
                        results.push('firstCard saveBtn: ' + !!saveBtn);
                        results.push('firstCard voiceBtn: ' + !!voiceBtn);
                        results.push('firstCard detailBtn: ' + !!detailBtn);
                        
                        if (explainBtn) explainBtn.click();
                        if (saveBtn) saveBtn.click(); // toggle save
                        if (shareBtn) shareBtn.click(); // open share modal
                        const shareModal = document.getElementById('share-modal-container');
                        results.push('shareModal opened: ' + !!shareModal);
                        if (shareModal) {
                            const closeBtn = document.getElementById('close-share-modal-btn');
                            if (closeBtn) closeBtn.click();
                            results.push('shareModal closed: ' + !document.getElementById('share-modal-container'));
                        }
                    }
                    return results;
                })()
            """)
            print("Chapter Detail options check:", ch_filter_check)
            
            # Test 4: Test Verse Detail page options
            await eval_js("window.app.navigate('verseDetail', { chapterNumber: 2, verseNumber: 47 });")
            verse_detail_check = await eval_js("""
                (() => {
                    const results = [];
                    const saveBtn = document.getElementById('detail-save-btn');
                    const shareBtn = document.getElementById('detail-share-btn');
                    const langBtn = document.getElementById('detail-translate-btn');
                    const prevBtn = document.getElementById('prev-verse-btn');
                    const nextBtn = document.getElementById('next-verse-btn');
                    
                    results.push('saveBtn: ' + !!saveBtn);
                    results.push('shareBtn: ' + !!shareBtn);
                    results.push('langBtn: ' + !!langBtn);
                    results.push('prevBtn: ' + !!prevBtn);
                    results.push('nextBtn: ' + !!nextBtn);
                    
                    if (saveBtn) saveBtn.click();
                    if (shareBtn) {
                        shareBtn.click();
                        const modal = document.getElementById('share-modal-container');
                        results.push('detail shareModal opened: ' + !!modal);
                        if (modal) modal.remove();
                    }
                    
                    return results;
                })()
            """)
            print("Verse Detail options check:", verse_detail_check)
            
            # Test 5: Test Ask Geetha page options
            await eval_js("window.app.navigate('askGeetha');")
            chat_check = await eval_js("""
                (() => {
                    const results = [];
                    const newChatBtn = document.getElementById('new-chat-btn');
                    const clearChatBtn = document.getElementById('clear-chat-btn');
                    const chips = document.querySelectorAll('.chat-sug-chip');
                    const sendBtn = document.getElementById('chat-send-btn');
                    const micBtn = document.getElementById('chat-mic-btn');
                    const input = document.getElementById('chat-user-input');
                    
                    results.push('newChatBtn: ' + !!newChatBtn);
                    results.push('clearChatBtn: ' + !!clearChatBtn);
                    results.push('chipsCount: ' + chips.length);
                    results.push('sendBtn: ' + !!sendBtn);
                    results.push('micBtn: ' + !!micBtn);
                    results.push('input: ' + !!input);
                    
                    return results;
                })()
            """)
            print("Ask Geetha options check:", chat_check)

            # Test 6: Check History page options
            await eval_js("window.app.navigate('history');")
            history_check = await eval_js("""
                (() => {
                    const results = [];
                    const clearBtn = document.getElementById('clear-all-history-btn');
                    const emptyStartBtn = document.getElementById('history-start-chat-btn');
                    results.push('clearBtn: ' + !!clearBtn);
                    results.push('emptyStartBtn: ' + !!emptyStartBtn);
                    const resumeBtns = document.querySelectorAll('.resume-btn');
                    const deleteBtns = document.querySelectorAll('.delete-btn');
                    results.push('resumeBtns: ' + resumeBtns.length);
                    results.push('deleteBtns: ' + deleteBtns.length);
                    return results;
                })()
            """)
            print("History page options check:", history_check)

            # Test 7: Check Saved Verses page options
            await eval_js("window.app.navigate('saved');")
            saved_check = await eval_js("""
                (() => {
                    const results = [];
                    const exportBtn = document.getElementById('export-saved-btn');
                    const clearBtn = document.getElementById('clear-saved-btn');
                    const openBtns = document.querySelectorAll('.open-verse-btn');
                    const removeBtns = document.querySelectorAll('.remove-saved-btn');
                    results.push('exportBtn: ' + !!exportBtn);
                    results.push('clearBtn: ' + !!clearBtn);
                    results.push('openBtns: ' + openBtns.length);
                    results.push('removeBtns: ' + removeBtns.length);
                    return results;
                })()
            """)
            print("Saved Verses options check:", saved_check)
            
            # Test 8: Check Spotlight Search Modal options
            search_check = await eval_js("""
                (() => {
                    const results = [];
                    const searchBtn = document.getElementById('global-search-btn');
                    results.push('globalSearchBtn: ' + !!searchBtn);
                    if (searchBtn) {
                        searchBtn.click();
                        const modal = document.getElementById('spotlight-search-modal');
                        results.push('searchModal opened: ' + !!modal);
                        if (modal) {
                            const input = document.getElementById('spotlight-input');
                            results.push('searchInput: ' + !!input);
                            if (input) {
                                input.value = 'karma';
                                input.dispatchEvent(new Event('input'));
                                const resItems = document.querySelectorAll('.search-result-item');
                                results.push('karma results: ' + resItems.length);
                            }
                            const closeBtn = document.getElementById('close-spotlight-modal');
                            if (closeBtn) closeBtn.click();
                            results.push('searchModal closed: ' + !document.getElementById('spotlight-search-modal'));
                        }
                    }
                    return results;
                })()
            """)
            print("Spotlight Search options check:", search_check)
            
            # Test 9: Language Modal options (Selecting each language)
            lang_modal_check = await eval_js("""
                (async () => {
                    const results = [];
                    const langBtn = document.getElementById('lang-toggle-btn');
                    results.push('langToggleBtn: ' + !!langBtn);
                    if (langBtn) {
                        langBtn.click();
                        const modal = document.getElementById('language-selection-modal');
                        results.push('langModal opened: ' + !!modal);
                        if (modal) {
                            const cards = modal.querySelectorAll('.lang-select-card');
                            results.push('langCardsCount: ' + cards.length);
                            const searchInput = document.getElementById('lang-search-input');
                            results.push('langSearchInput: ' + !!searchInput);
                            const closeBtn = document.getElementById('lang-modal-close-btn');
                            if (closeBtn) {
                                closeBtn.click();
                                await new Promise(r => setTimeout(r, 250));
                            }
                            results.push('langModal closed: ' + !document.getElementById('language-selection-modal'));
                        }
                    }
                    return results;
                })()
            """)
            print("Language Modal options check:", lang_modal_check)

            print("\n=== CONSOLE ERRORS & EXCEPTIONS ===")
            if console_errors:
                for err in console_errors:
                    print(err)
            else:
                print("None! 0 errors caught.")
                
    finally:
        proc.kill()

if __name__ == "__main__":
    asyncio.run(run_options_test())
