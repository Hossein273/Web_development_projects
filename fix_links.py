#!/usr/bin/env python3
"""Fix Northbound hub card links: add /demos/ prefix, correct slug mismatches,
remove the top-car-removal card. Replaces ALL occurrences; asserts >=1 first."""
import re, shutil
from pathlib import Path

f = Path("index.html")
src = f.read_text(encoding="utf-8")

href_map = {
    'href="/almas-receptions/"':  'href="/demos/almas-receptions/"',
    'href="/bloom-and-co/"':      'href="/demos/bloom-co/"',
    'href="/charcoal-and-crust/"':'href="/demos/charcoal-crust/"',
    'href="/petal-and-stem/"':    'href="/demos/petal-stem/"',
    'href="/top-cash-for-cars/"': 'href="/demos/top-cash-for-cars/"',
    'href="/torque-autocare/"':   'href="/demos/torque-autocare/"',
    'href="/brightwater-legal/"': 'href="/demos/law-firm/"',
    'href="/top-real-estate/"':   'href="/demos/real-estate-agency/"',
}

# Assert each old href appears at least once before touching anything
counts = {old: src.count(old) for old in href_map}
missing = [old for old, n in counts.items() if n == 0]
assert not missing, f"These hrefs were not found (aborting): {missing}"
print("Occurrences found:")
for old, n in counts.items():
    print(f"  {n} x {old}")

# Remove every top-car-removal card block (no folder)
card_re = re.compile(r'<a\b[^>]*href="/top-car-removal/"[^>]*>.*?</a>', re.DOTALL)
n_cards = len(card_re.findall(src))
assert n_cards >= 1, "Expected at least 1 top-car-removal card, found 0. Aborting."

out = src
for old, new in href_map.items():
    out = out.replace(old, new)
out = card_re.sub("", out)

shutil.copy2(f, "index.html.bak")
f.write_text(out, encoding="utf-8")
print(f"\n✓ Updated all card links, removed {n_cards} top-car-removal card(s).")
print("  Backup saved as index.html.bak")