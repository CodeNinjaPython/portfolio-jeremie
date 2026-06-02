"""
Télécharge et optimise les miniatures YouTube référencées dans les fichiers HTML.
Crée des miniatures en 1280, 480 et 320px dans `images/optimized/yt/`.
Usage: python tools/download_youtube_thumbs.py [path/to/html ...]
"""
import sys
import re
from pathlib import Path
import requests
try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

OUTDIR = Path('images/optimized/yt')
OUTDIR.mkdir(parents=True, exist_ok=True)

YOUTUBE_URLS = [
    'maxresdefault.jpg',
    'hqdefault.jpg',
    'mqdefault.jpg'
]

VIDEO_RE = re.compile(r'vi/([\w-]{6,})/')


def find_video_ids_in_file(p):
    txt = p.read_text(encoding='utf-8')
    return set(m.group(1) for m in VIDEO_RE.finditer(txt))


def download_image(url):
    r = requests.get(url, timeout=20)
    r.raise_for_status()
    return r.content


def write_and_resize(img_bytes, outpath, width):
    if not PIL_AVAILABLE:
        outpath.write_bytes(img_bytes)
        return
    from io import BytesIO
    im = Image.open(BytesIO(img_bytes)).convert('RGB')
    # calculate height maintaining 16:9
    h = int(width * 9 / 16)
    im = im.resize((width, h), Image.LANCZOS)
    im.save(outpath, format='JPEG', quality=85, optimize=True)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python tools/download_youtube_thumbs.py path/to/file.html [more files]')
        sys.exit(1)
    files = [Path(p) for p in sys.argv[1:]]
    ids = set()
    for f in files:
        if not f.exists():
            print('Fichier introuvable:', f)
            continue
        ids |= find_video_ids_in_file(f)
    if not ids:
        print('Aucun id YouTube trouvé.')
        sys.exit(0)
    print('Found', len(ids), 'videos')
    for vid in sorted(ids):
        print('\nProcessing', vid)
        # try best-to-worst sources
        best_bytes = None
        for name in YOUTUBE_URLS:
            url = f'https://i.ytimg.com/vi/{vid}/{name}'
            try:
                print('  download', url)
                b = download_image(url)
                if b:
                    best_bytes = b
                    break
            except Exception as e:
                print('   -> failed', e)
        if not best_bytes:
            print('  Aucun thumbnail disponible pour', vid)
            continue
        # save original as 1280
        try:
            write_and_resize(best_bytes, OUTDIR / f'{vid}-1280.jpg', 1280)
            write_and_resize(best_bytes, OUTDIR / f'{vid}-480.jpg', 480)
            write_and_resize(best_bytes, OUTDIR / f'{vid}-320.jpg', 320)
            print('  saved optimized images for', vid)
        except Exception as e:
            print('  erreur lors de l\'ecriture:', e)
            # fallback write raw
            (OUTDIR / f'{vid}-1280.jpg').write_bytes(best_bytes)
    print('\nTerminé.')
