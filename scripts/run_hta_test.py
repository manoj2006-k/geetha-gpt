import subprocess
import os

html_test = """<!DOCTYPE html>
<html>
<head>
<script>
window.onerror = function(msg, url, line, col, error) {
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var f = fso.CreateTextFile("d:/Geetha/error_log.txt", true);
  f.WriteLine("ERROR: " + msg + " at line " + line + ":" + col);
  f.Close();
  window.close();
};
</script>
<script src="d:/Geetha/assets/js/bundle.js"></script>
<script>
var fso = new ActiveXObject("Scripting.FileSystemObject");
var f = fso.CreateTextFile("d:/Geetha/error_log.txt", true);
f.WriteLine("SUCCESS: No syntax error in bundle.js");
f.Close();
window.close();
</script>
</head>
<body></body>
</html>"""

with open("d:/Geetha/test_runner.hta", "w", encoding="utf-8") as f:
    f.write(html_test)

if os.path.exists("d:/Geetha/error_log.txt"):
    os.remove("d:/Geetha/error_log.txt")

subprocess.run(["mshta", "d:\\Geetha\\test_runner.hta"], timeout=10)

if os.path.exists("d:/Geetha/error_log.txt"):
    with open("d:/Geetha/error_log.txt", "r", encoding="utf-8") as f:
        print(f.read())
else:
    print("No log generated.")
