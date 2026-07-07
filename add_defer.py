#!/usr/bin/env python3
"""Add defer to script.js tags across all demos so DOM-dependent JS
(reveal animations, filters) runs after the HTML is parsed. Dry-run first."""
import re
from pathlib import Path

APPLY = True
for html in sorted(Path("demos").glob("*/index.html")):
    src = html.read_text(encoding="utf-8")
    # add defer only to script.js tags that don't already have it
    new = re.sub(
        r'<script src="script\.js"(?!\s+defer)([^>]*)></script>',
        r'<script src="script.js" defer\1></script>',
        src,
    )
    if new != src:
        print(f"[defer] {html.parent.name}/index.html")
        if APPLY:
            html.write_text(new, encoding="utf-8")
print("\nDRY RUN — nothing changed." if not APPLY else "\n✓ Applied.")