bundle = open('/tmp/bundle.js', encoding='utf-8').read()
html = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Pharmacology PH45 — Test Bank</title>
<style>
*,*::before,*::after{{box-sizing:border-box}}
body{{margin:0;padding:0;background:#060913;}}
button{{font-family:inherit}}
</style>
</head>
<body style="margin:0;padding:0;background:#060913;">
<div id="root"></div>
<script>{bundle}</script>
</body></html>"""
open('index.html', 'w', encoding='utf-8').write(html)
print(f"Done — {len(html):,} bytes")
