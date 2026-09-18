with open('d:/Geetha/assets/js/bundle.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's run a test with Python's node / browser engine or check with Windows cscript/mshta/powershell
import subprocess

ps_script = """
Add-Type -AssemblyName System.Web
$js = Get-Content -Raw -Encoding UTF8 'd:/Geetha/assets/js/bundle.js'
Write-Host "Bundle length: " $js.Length
"""
result = subprocess.run(["powershell", "-Command", ps_script], capture_output=True, text=True)
print("PS test:", result.stdout, result.stderr)
