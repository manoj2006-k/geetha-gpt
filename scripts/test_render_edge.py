import http.server
import socketserver
import threading
import subprocess
import time
import re
import sys

PORT = 8899
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='d:/Geetha', **kwargs)
    def log_message(self, format, *args):
        pass

httpd = socketserver.TCPServer(('127.0.0.1', PORT), Handler)
t = threading.Thread(target=httpd.serve_forever, daemon=True)
t.start()
print(f"HTTP Server started on http://127.0.0.1:{PORT}")

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [edge, "--headless=new", "--disable-gpu", "--dump-dom", f"http://127.0.0.1:{PORT}/index.html"]
res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
dom = res.stdout
print(f"HTTP Rendered DOM total size: {len(dom)} bytes")

cmd_file = [edge, "--headless=new", "--disable-gpu", "--dump-dom", "file:///d:/Geetha/index.html"]
res_file = subprocess.run(cmd_file, capture_output=True, text=True, encoding='utf-8')
dom_file = res_file.stdout
print(f"FILE:// Rendered DOM total size: {len(dom_file)} bytes")


m = re.search(r'<div id="app"[^>]*>([\s\S]*?)</div>\s*<!-- Standalone', dom)
if m:
    inner = m.group(1).strip()
    print(f"Inner content length of #app: {len(inner)}")
    if len(inner) == 0:
        print("ALERT: #app is COMPLETELY EMPTY!")
    else:
        print("Success! First 300 chars:")
        print(inner[:300])
else:
    print("Could not locate #app boundary in DOM. Searching for <div id=\"app\">:")
    idx = dom.find('id="app"')
    if idx != -1:
        print(dom[idx:idx+500])
    else:
        print("id='app' not found at all!")

httpd.shutdown()
