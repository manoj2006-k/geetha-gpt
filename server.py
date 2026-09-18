#!/usr/bin/env python3
"""
Geetha GPT - Local Static Web Server
Launches a lightweight HTTP server with UTF-8 encoding support.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def run_server(port=PORT):
    for test_port in range(port, port + 20):
        try:
            with socketserver.TCPServer(("127.0.0.1", test_port), Handler) as httpd:
                url = f"http://localhost:{test_port}"
                print("============================================================")
                print(f"[*] Geetha GPT is running locally at: {url}")
                print(f"[*] Serving files from: {DIRECTORY}")
                print("============================================================")
                print("Press Ctrl+C to stop the server.")
                
                if "--open" in sys.argv:
                    webbrowser.open(url)
                    
                httpd.serve_forever()
                break
        except OSError:
            continue

if __name__ == "__main__":
    run_server()
