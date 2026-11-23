"""Regenerate the web assets in public/ from the originals in source/.

Run from the recharge-site folder:  python tools/build_assets.py
Needs: pip install pillow fonttools brotli

It never changes anything in source/. Videos are copied byte for byte (renamed only).
"""
import math
import shutil
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "source"
PUB = ROOT / "public"
A = PUB / "assets"

PLUM = (0x2F, 0x1A, 0x36)
VIOLET = (0x7A, 0x47, 0x9D)
RED = (0xE3, 0x08, 0x0B)
WHITE = (255, 255, 255)

# filename in source/ -> id used in config.js
SPEAKER_FILES = {
    "bishop migwi": "bishop-migwi",
    "pst. muinde": "pastor-muinde",
    "Pst. chege": "pastor-chege",
    "bsp. gibson": "bishop-gibson",
    "rev. kiseli": "reverend-kiseli",
    "apst. makosi": "apostle-makosi",
}

UNICODES = (
    "U+0020-007E,U+00A0-00FF,U+0100-017F,U+0300-0303,U+0308,"
    "U+2018-201E,U+2022,U+2026,U+2039-203A,U+20AC,U+2192,U+2197"
)


def fonts():
    out = A / "fonts"
    for src, name in [
        (SRC / "fonts" / "Anton-Regular.ttf", "anton-400"),
        (SRC / "fonts" / "AlegreyaSans-Regular.ttf", "alegreya-sans-400"),
        (SRC / "fonts" / "AlegreyaSans-Bold.ttf", "alegreya-sans-700"),
    ]:
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk", "tnum", "lnum", "pnum"]
        opts.name_IDs = ["*"]
        opts.notdef_outline = True
        font = TTFont(src)
        sub = subset.Subsetter(opts)
        sub.populate(unicodes=subset.parse_unicodes(UNICODES))
        sub.subset(font)
        dest = out / f"{name}.woff2"
        font.flavor = "woff2"
        font.save(dest)
        print("font", dest.name, dest.stat().st_size)


def stills():
    for stem, sid in SPEAKER_FILES.items():
        png = SRC / "speaker-cards" / f"{stem}.png"
        if png.exists():
            im = Image.open(png).convert("RGB")
            for w in (296, im.width):
                h = round(im.height * w / im.width)
                r = im if w == im.width else im.resize((w, h), Image.LANCZOS)
                r.save(A / "speakers" / f"{sid}-{w}.webp", quality=86, method=6)
                r.save(A / "speakers" / f"{sid}-{w}.avif", quality=62, speed=4)
        mp4 = SRC / "speaker-videos" / f"{stem}.mp4"
        if mp4.exists():
            shutil.copyfile(mp4, A / "video" / f"{sid}.mp4")
    for p in sorted((A / "speakers").iterdir()):
        print("still", p.name, p.stat().st_size)


def church_logo():
    im = Image.open(SRC / "church-logo.png").convert("RGBA")
    for w in (160, 480):
        r = im.resize((w, w), Image.LANCZOS)
        r.save(A / "img" / f"church-logo-{w}.webp", quality=90, method=6)
    for p in sorted((A / "img").iterdir()):
        print("logo", p.name, p.stat().st_size)


def draw_mark(size, bg, ring, bar, level=0.62, scale=1.0):
    """The Recharge mark on a 64 unit grid, drawn 8x and scaled down."""
    k = 8
    S = size * k
    img = Image.new("RGBA", (S, S), bg)
    d = ImageDraw.Draw(img)
    u = S / 64 * scale
    off = (S - 64 * u) / 2

    def p(x, y):
        return (off + x * u, off + y * u)

    cx, cy, r, sw = 32, 35, 21, 7
    # open ring, gap at the top (240deg..300deg)
    box = [p(cx - r - sw / 2, cy - r - sw / 2), p(cx + r + sw / 2, cy + r + sw / 2)]
    d.arc([box[0], box[1]], start=300, end=240 + 360, fill=ring, width=round(sw * u))
    # fill disc, clipped to the level
    disc = Image.new("L", (S, S), 0)
    dd = ImageDraw.Draw(disc)
    ri = 13.5
    dd.ellipse([p(cx - ri, cy - ri), p(cx + ri, cy + ri)], fill=255)
    clip = Image.new("L", (S, S), 0)
    top = cy + ri - level * 2 * ri
    ImageDraw.Draw(clip).rectangle([p(0, top), p(64, 64)], fill=255)
    from PIL import ImageChops
    mask = ImageChops.multiply(disc, clip)
    img.paste(Image.new("RGBA", (S, S), ring), (0, 0), mask)
    # rising bar
    d.rectangle([p(28.5, 4), p(35.5, 28)], fill=bar)
    return img.resize((size, size), Image.LANCZOS)


def icons():
    out = A / "icons"
    draw_mark(192, PLUM + (255,), WHITE, RED, scale=0.9).save(out / "icon-192.png", optimize=True)
    draw_mark(512, PLUM + (255,), WHITE, RED, scale=0.9).save(out / "icon-512.png", optimize=True)
    draw_mark(512, PLUM + (255,), WHITE, RED, scale=0.62).save(out / "icon-maskable-512.png", optimize=True)
    draw_mark(180, PLUM + (255,), WHITE, RED, scale=0.8).convert("RGB").save(out / "apple-touch-icon.png", optimize=True)
    share_image(out / "share.png")
    for p in sorted(out.iterdir()):
        print("icon", p.name, p.stat().st_size)


def share_image(dest):
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), PLUM)
    d = ImageDraw.Draw(img)
    # violet arch rising from the bottom right, cut by the edge
    d.ellipse([700, 160, 1340, 800], fill=(0x4A, 0x27, 0x66))
    d.rectangle([700, 480, 1340, 630], fill=(0x4A, 0x27, 0x66))
    anton = str(SRC / "fonts" / "Anton-Regular.ttf")
    sans = str(SRC / "fonts" / "AlegreyaSans-Bold.ttf")
    f_big = ImageFont.truetype(anton, 210)
    f_mid = ImageFont.truetype(anton, 64)
    f_small = ImageFont.truetype(sans, 36)
    mark = draw_mark(120, (0, 0, 0, 0), WHITE, RED)
    img.paste(mark, (64, 52), mark)
    d.text((200, 84), "ANNUAL CONFERENCE", font=ImageFont.truetype(anton, 44), fill=WHITE)
    d.text((56, 170), "THE", font=f_mid, fill=WHITE)
    d.text((50, 222), "RECHARGE", font=f_big, fill=WHITE)
    d.rectangle([60, 486, 200, 496], fill=RED)
    d.text((60, 514), "Promoting Slaves to Sons  ·  2 to 6 December 2026  ·  Kerugoya", font=f_small, fill=WHITE)
    img.save(dest, optimize=True)


def svg_files():
    out = A / "icons"
    favicon = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#2F1A36"/>
<g transform="translate(3.2 3.2) scale(.9)">
<path d="M42.5 16.81A21 21 0 1 1 21.5 16.81" fill="none" stroke="#fff" stroke-width="7"/>
<path d="M18.5 35a13.5 13.5 0 0 0 27 0z" fill="#fff"/>
<rect x="28.5" y="4" width="7" height="24" fill="#E3080B"/>
</g>
</svg>
"""
    (out / "favicon.svg").write_text(favicon, encoding="utf-8")
    for name, ring, bar in [("mark-white", "#fff", "#E3080B"), ("mark-purple", "#2F1A36", "#E3080B"), ("mark-one-colour", "#2F1A36", "#2F1A36")]:
        (out / f"{name}.svg").write_text(
            f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<path d="M42.5 16.81A21 21 0 1 1 21.5 16.81" fill="none" stroke="{ring}" stroke-width="7"/>
<path d="M18.5 35a13.5 13.5 0 0 0 27 0z" fill="{ring}"/>
<rect x="28.5" y="4" width="7" height="24" fill="{bar}"/>
</svg>
""",
            encoding="utf-8",
        )


if __name__ == "__main__":
    fonts()
    stills()
    church_logo()
    svg_files()
    icons()
