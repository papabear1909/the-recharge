"""Extra assets for the poster look: Montserrat and Arizonia subsets, a paper texture and a torn edge.

Run from the recharge-site-poster folder:  python tools/poster_assets.py
"""
from pathlib import Path

import numpy as np
from fontTools import subset
from fontTools.ttLib import TTFont
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "source" / "fonts"
A = ROOT / "public" / "assets"
UNICODES = "U+0020-007E,U+00A0-00FF,U+0100-017F,U+0300-0303,U+0308,U+2018-201E,U+2022,U+2026,U+2039-203A"


def fonts():
    for src, name in [
        ("Montserrat-Black.ttf", "montserrat-900"),
        ("Montserrat-ExtraBold.ttf", "montserrat-800"),
        ("Arizonia-Regular.ttf", "arizonia-400"),
    ]:
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk"]
        font = TTFont(SRC / src)
        sub = subset.Subsetter(opts)
        sub.populate(unicodes=subset.parse_unicodes(UNICODES))
        sub.subset(font)
        font.flavor = "woff2"
        dest = A / "fonts" / f"{name}.woff2"
        font.save(dest)
        print(dest.name, dest.stat().st_size)


def periodic_noise(n, scale, rng):
    """Smooth noise that tiles seamlessly (filtered in frequency space)."""
    white = rng.standard_normal((n, n))
    f = np.fft.fft2(white)
    ky = np.fft.fftfreq(n)[:, None]
    kx = np.fft.fftfreq(n)[None, :]
    k = np.sqrt(kx**2 + ky**2)
    f *= np.exp(-((k * scale) ** 2))
    out = np.real(np.fft.ifft2(f))
    return (out - out.mean()) / (out.std() + 1e-9)


def paper():
    rng = np.random.default_rng(11)
    n = 512
    creases = periodic_noise(n, 60, rng)
    folds = np.abs(periodic_noise(n, 22, rng))  # ridge lines read as crumples
    grain = rng.standard_normal((n, n))
    v = 240 + creases * 3.0 - folds * 2.2 + grain * 2.0
    v = np.clip(v, 0, 255).astype(np.uint8)
    rgb = np.stack([v, v, np.clip(v.astype(int) - 1, 0, 255).astype(np.uint8)], axis=-1)
    Image.fromarray(rgb, "RGB").save(A / "img" / "paper.webp", quality=72, method=6)
    print("paper.webp", (A / "img" / "paper.webp").stat().st_size)


def tear():
    """A white torn-paper edge, used as a mask so any colour can be torn."""
    rng = np.random.default_rng(5)
    w, h = 1200, 40
    xs = np.arange(0, w + 1, 12)
    ys = 18 + np.cumsum(rng.normal(0, 3.2, len(xs)))
    ys = ys - np.linspace(0, ys[-1] - ys[0], len(xs))  # ends meet so it tiles
    ys = np.clip(ys, 4, h - 6)
    pts = " ".join(f"{x},{y:.1f}" for x, y in zip(xs, ys))
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" preserveAspectRatio="none"><polygon points="0,{h} {pts} {w},{h}" fill="#fff"/></svg>\n'
    (A / "img" / "tear.svg").write_text(svg, encoding="utf-8")
    print("tear.svg", len(svg))


if __name__ == "__main__":
    fonts()
    paper()
    tear()
