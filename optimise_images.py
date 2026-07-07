#!/usr/bin/env python3
"""Convert referenced images to WebP. cwebp primary, ffmpeg fallback for
AVIF/HEIC mislabeled files. Skips + logs anything unreadable. Backs up originals.
Dry-run by default; set APPLY = True to run."""
import re, shutil, subprocess
from pathlib import Path

APPLY = True          # <-- set True to actually convert + rewrite
QUALITY = 82
MAX_W = 1600
BACKUP = Path("_image_backups")

IMG_DIRS = [Path("images")] + sorted(Path("demos").glob("*/images"))
EXTS = (".jpg", ".jpeg", ".png")
SKIP_KEEP = ("favicon", "apple-touch-icon")
DEAD = ("Screenshot", "Top_car_removal", "topCarRemoval")

sources, dead_files, failed, done = [], [], [], []
for d in IMG_DIRS:
    if not d.exists():
        continue
    for f in d.rglob("*"):
        if f.suffix.lower() not in EXTS or not f.is_file():
            continue
        if any(k in f.name.lower() for k in SKIP_KEEP):
            continue
        if any(s in f.name for s in DEAD):
            dead_files.append(f)
            continue
        sources.append(f)

print(f"Convert: {len(sources)}  |  Dead->backup: {len(dead_files)}\n")


def convert(src, webp):
    """Try cwebp; fall back to ffmpeg (handles AVIF/HEIC). True on success."""
    try:
        subprocess.run(
            ["cwebp", "-q", str(QUALITY), "-resize", str(MAX_W), "0",
             "-mt", str(src), "-o", str(webp)],
            check=True, capture_output=True, text=True,
        )
        return True
    except subprocess.CalledProcessError:
        try:
            subprocess.run(
                ["ffmpeg", "-y", "-i", str(src),
                 "-vf", f"scale='min({MAX_W},iw)':-2",
                 "-quality", str(QUALITY), str(webp)],
                check=True, capture_output=True, text=True,
            )
            return True
        except subprocess.CalledProcessError as e:
            tail = (e.stderr or "").strip().splitlines()
            print(f"  FAILED: {src} -- {tail[-1] if tail else 'unreadable'}")
            return False


if APPLY:
    for src in sources:
        webp = src.with_suffix(".webp")
        BACKUP.mkdir(exist_ok=True)
        bdest = BACKUP / src
        bdest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, bdest)
        if convert(src, webp):
            done.append(src)
        else:
            failed.append(src)
    for f in dead_files:
        bdest = BACKUP / f
        bdest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(f), str(bdest))
    print(f"\nConverted: {len(done)}  |  Failed: {len(failed)}")
    for f in failed:
        print(f"    FAILED: {f}")
else:
    for src in sources:
        print(f"  [convert] {src.name}")
    print("\nDRY RUN -- set APPLY = True to run.")

if APPLY:
    ok_stems = {f.stem for f in done}
    html_files = [Path("index.html")] + sorted(Path("demos").glob("*/index.html"))

    def repl(m):
        path = m.group(2)
        if any(k in path.lower() for k in SKIP_KEEP):
            return m.group(0)
        if Path(path).name not in ok_stems:
            return m.group(0)
        return f'{m.group(1)}="{path}.webp"'

    for html in html_files:
        if not html.exists():
            continue
        txt = html.read_text(encoding="utf-8")
        new = re.sub(r'(src|href)="([^"]+?)\.(jpe?g|png)"', repl, txt, flags=re.I)
        if new != txt:
            shutil.copy2(html, str(html) + ".bak")
            html.write_text(new, encoding="utf-8")
            print(f"  [html] {html} updated")
    print("\nDone.")