#!/usr/bin/env python3
"""Localise remote (http) images in a demo's index.html:
download each to the demo's images/ folder and rewrite src to the local path.
Dry-run by default; set APPLY = True to download + rewrite."""
import re, shutil, hashlib, urllib.request
from pathlib import Path

APPLY = True
DEMO = Path("demos/charcoal-crust")   # change per demo

html = DEMO / "index.html"
imgdir = DEMO / "images"
src = html.read_text(encoding="utf-8")

# Find all src="http..." image URLs
remote = re.findall(r'src="(https?://[^"]+)"', src)
remote = [u for u in remote if re.search(r'\.(jpe?g|png|webp|svg)', u, re.I) or "pexels" in u]

print(f"Found {len(remote)} remote image(s) in {DEMO.name}/index.html\n")

out = src
for url in dict.fromkeys(remote):          # dedupe, preserve order
    # Build a stable local filename from the URL
    m = re.search(r'photos/(\d+)/', url)
    stem = f"pexels-{m.group(1)}" if m else "img-" + hashlib.md5(url.encode()).hexdigest()[:8]
    ext = ".jpg"                            # pexels serves jpeg
    fname = stem + ext
    local_rel = f"images/{fname}"
    print(f"  {url[:60]}...\n    -> {local_rel}")
    if APPLY:
        imgdir.mkdir(exist_ok=True)
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as r, open(imgdir / fname, "wb") as f:
            f.write(r.read())
        out = out.replace(f'src="{url}"', f'src="{local_rel}"')

if APPLY:
    shutil.copy2(html, str(html) + ".bak")
    html.write_text(out, encoding="utf-8")
    print("\n✓ Downloaded and rewrote paths.")
else:
    print("\nDRY RUN — nothing downloaded or changed.")