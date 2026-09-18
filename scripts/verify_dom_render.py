import subprocess
import os

html_test = """<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta charset="UTF-8" />
<script>
window.onerror = function(msg, url, line, col, error) {
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var f = fso.CreateTextFile("d:/Geetha/render_log.txt", true);
  f.WriteLine("RUNTIME ERROR: " + msg + " at " + url + " line " + line + ":" + col);
  f.Close();
  window.close();
};
</script>
</head>
<body>
<div id="app"></div>
<script src="d:/Geetha/assets/js/bundle.js"></script>
<script>
setTimeout(function() {
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var f = fso.CreateTextFile("d:/Geetha/render_log.txt", true);
  var appEl = document.getElementById("app");
  if (appEl && appEl.children.length > 0) {
    f.WriteLine("SUCCESS: App rendered " + appEl.children.length + " root elements. InnerHTML length: " + appEl.innerHTML.length);
  } else {
    f.WriteLine("FAILURE: #app has 0 children!");
  }
  f.Close();
  window.close();
}, 200);
</script>
</body>
</html>"""

with open("d:/Geetha/test_render.hta", "w", encoding="utf-8") as f:
    f.write(html_test)

if os.path.exists("d:/Geetha/render_log.txt"):
    os.remove("d:/Geetha/render_log.txt")

subprocess.run(["mshta", "d:\\Geetha\\test_render.hta"], timeout=10)

if os.path.exists("d:/Geetha/render_log.txt"):
    with open("d:/Geetha/render_log.txt", "r", encoding="utf-8") as f:
        print(f.read())
else:
    print("No render log generated.")
