#!/usr/bin/env python3
"""Fix all Northbound demos:
  1. Rename the single top-level *.html in each demo folder to index.html (if missing).
  2. Convert root-absolute asset paths (/styles, /images, /fonts) to relative.
Dry-run by default. Set APPLY = True to write changes."""
import re, shutil
from pathlib import Path

APPLY = True   # <-- set True to actually make changes

DEMOS = Path("demos")
# Only rewrite these asset roots; leaves real external links and #anchors alone.
ASSET_DIRS = ("styles", "images", "fonts", "js", "assets")
# Matches href="/styles/..." or src="/images/..." -> strips the leading slash
pat = re.compile(r'((?:href|src)=")/(' + "|".join(ASSET_DIRS) + r')/')

for demo in sorted(p for p in DEMOS.iterdir() if p.is_dir()):
    # --- Step 1: ensure an index.html exists ---
    index = demo / "index.html"
    if not index.exists():
        htmls = list(demo.glob("*.html"))
        if len(htmls) == 1:
            print(f"[rename] {htmls[0].relative_to(DEMOS)} -> {demo.name}/index.html")
            if APPLY:
                htmls[0].rename(index)
        elif len(htmls) == 0:
            print(f"[WARN] {demo.name}: no .html file at top level!")
        else:
            print(f"[WARN] {demo.name}: multiple .html files, skipping rename: "
                  f"{[h.name for h in htmls]}")

    # --- Step 2: fix asset paths in the (now) index.html ---
    target = demo / "index.html"
    if target.exists():
        src = target.read_text(encoding="utf-8")
        new, n = pat.subn(r'\1\2/', src)
        if n:
            print(f"[paths]  {demo.name}/index.html: {n} root-absolute asset path(s) -> relative")
            if APPLY:
                shutil.copy2(target, str(target) + ".bak")
                target.write_text(new, encoding="utf-8")

print("\nDRY RUN — nothing changed." if not APPLY else "\n✓ Applied.")