"""Downloads the menu photos listed in tools/kamiqr-photos.json into menu-img/.

For every item it writes two JPEGs named by the menu item id (the menu on the
server already points at these paths):
  menu-img/<id>.jpg    - full size, longest side <= 1280 px  (photo viewer)
  menu-img/<id>-t.jpg  - thumbnail, longest side <= 400 px   (menu list)
Already-downloaded photos are skipped, so the workflow can be re-run safely.
Run by .github/workflows/import-photos.yml; can also be run locally.
"""
import io, json, os, sys, time
import requests
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "menu-img")
SRC = os.path.join(ROOT, "tools", "kamiqr-photos.json")
FORCE = "--force" in sys.argv

def fetch(url):
    for attempt in range(3):
        try:
            r = requests.get(url, timeout=30)
            if r.status_code == 200 and r.content:
                return r.content
            if r.status_code in (403, 404):
                return None
        except requests.RequestException:
            pass
        time.sleep(2 * (attempt + 1))
    return None

def save(img, path, max_side, quality):
    im = img.copy()
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    im.save(path, "JPEG", quality=quality, optimize=True, progressive=True)

def to_rgb(data):
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(data)))
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        return bg
    return im.convert("RGB")

def main():
    os.makedirs(OUT, exist_ok=True)
    photos = json.load(open(SRC, encoding="utf-8"))
    ok = skipped = failed = 0
    for p in photos:
        full_path = os.path.join(OUT, f"{p['id']}.jpg")
        thumb_path = os.path.join(OUT, f"{p['id']}-t.jpg")
        if not FORCE and os.path.exists(full_path) and os.path.exists(thumb_path):
            skipped += 1
            continue
        data = fetch(p["full"]) or fetch(p["thumb"])
        if not data:
            failed += 1
            print(f"FAILED  {p['id']}  {p['full']}")
            continue
        try:
            img = to_rgb(data)
            save(img, full_path, 1280, 82)
            save(img, thumb_path, 400, 78)
            ok += 1
        except Exception as e:
            failed += 1
            print(f"BAD IMAGE  {p['id']}: {e}")
    size = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT)) / 1024 / 1024
    print(f"done: {ok} downloaded, {skipped} already there, {failed} failed; menu-img = {size:.1f} MB")

if __name__ == "__main__":
    main()
