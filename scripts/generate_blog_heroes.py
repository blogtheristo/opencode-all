#!/usr/bin/env python3
"""Generate unique hero images for Lifetime Scope Journal blog posts.

Reads onelifetime.world/posts/**/*.html, extracts og:title + og:url + og:description,
and writes a branded 1200x630 PNG hero per post to:
  onelifetime.world/static/images/blog/heroes/<slug>.png

Posts that already reference a dedicated blog image (anything under
/static/images/blog/, excluding heroes/ and the DWS_IQ2026 placeholder) keep it.

Run: .venv/bin/python scripts/generate_blog_heroes.py
"""

import json
import os
import random
import re
import textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_DIR = os.path.join(ROOT, "onelifetime.world", "posts")
BLOG_IMG_DIR = os.path.join(ROOT, "onelifetime.world", "static", "images", "blog")
OUT_DIR = os.path.join(BLOG_IMG_DIR, "heroes")
SITE = "https://onelifetime.world"
SIZE = (1200, 630)

PALETTES = [
    ((10, 24, 47), (30, 58, 138), (56, 189, 248)),   # deep navy / sky
    ((20, 40, 35), (6, 95, 70), (52, 211, 153)),     # forest / emerald
    ((36, 16, 48), (109, 40, 217), (192, 132, 252)), # violet
    ((40, 20, 16), (155, 44, 24), (251, 146, 60)),   # ember
    ((16, 32, 40), (14, 116, 144), (45, 212, 191)),  # teal
    ((28, 28, 38), (100, 116, 139), (203, 213, 225)),# slate
]

try:
    FONT_BOLD = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 58
    )
    FONT_SUB = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 26
    )
    FONT_TINY = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24
    )
except Exception:
    FONT_BOLD = ImageFont.load_default()
    FONT_SUB = ImageFont.load_default()
    FONT_TINY = ImageFont.load_default()


def gradient(size, top, bottom):
    img = Image.new("RGB", size)
    d = ImageDraw.Draw(img)
    for y in range(size[1]):
        t = y / size[1]
        color = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        d.line([(0, y), (size[0], y)], fill=color)
    return img


def dot_pattern(base, accent, alpha=26):
    img = base.copy()
    d = ImageDraw.Draw(img, "RGBA")
    step = 60
    r = 2
    for x in range(20, img.width, step):
        for y in range(20, img.height, step):
            d.ellipse([x - r, y - r, x + r, y + r], fill=accent + (alpha,))
    return img


def wrap_text(draw, text, font, max_width):
    words = text.split()
    lines = []
    cur = ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=font) <= max_width:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines[:4]


def make_hero(slug, title, url, desc):
    seed = random.Random(hash(slug) & 0xFFFFFFFF)
    top, bottom, accent = PALETTES[seed.randrange(len(PALETTES))]

    img = gradient(SIZE, top, bottom)
    img = dot_pattern(img, accent, alpha=22)
    img = img.filter(ImageFilter.GaussianBlur(0.3))
    d = ImageDraw.Draw(img)

    # top brand row
    d.rounded_rectangle([48, 40, 48 + 66, 40 + 66], radius=14, fill=accent)
    d.text((81, 73), "LSJ", fill=(255, 255, 255), font=FONT_SUB, anchor="mm")
    d.text((128, 73), "Lifetime Scope Journal", fill=(235, 235, 240), font=FONT_TINY, anchor="lm")

    # issue marker right
    d.text((SIZE[0] - 48, 73), "Issue 2026", fill=accent, font=FONT_TINY, anchor="rm")

    # centered title
    lines = wrap_text(d, title, FONT_BOLD, 1000)
    y = 270
    d.rectangle([48, y - 30, SIZE[0] - 48, y + len(lines) * 76 + 30], fill=(0, 0, 0))
    yy = y
    for line in lines:
        d.text((SIZE[0] / 2, yy), line, fill=(255, 255, 255), font=FONT_BOLD, anchor="mm")
        yy += 76

    # description
    if desc:
        sub = desc if len(desc) <= 110 else desc[:107].rsplit(" ", 1)[0] + "..."
        d.text((SIZE[0] / 2, yy + 46), sub, fill=(205, 210, 220), font=FONT_SUB, anchor="mm")

    # bottom url
    d.text((SIZE[0] / 2, SIZE[1] - 42), url, fill=(235, 235, 240), font=FONT_TINY, anchor="mm")

    return img


def extract_meta(html):
    def get(prop):
        m = re.search(rf'property="{prop}"\s+content="([^"]*)"', html)
        if m:
            return m.group(1).strip()
        m = re.search(rf'content="([^"]*)"\s+property="{prop}"', html)
        return m.group(1).strip() if m else None
    return get("og:title"), get("og:url"), get("og:description")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    posts = []
    for root, _dirs, files in os.walk(POSTS_DIR):
        for f in files:
            if not f.endswith(".html"):
                continue
            full = os.path.join(root, f)
            rel = os.path.relpath(full, POSTS_DIR).replace(os.sep, "/")
            slug = rel[:-5]
            if "_template" in slug or "DRAFT" in slug or "RETIRED" in slug:
                continue
            html = open(full, encoding="utf-8").read()
            title, url, desc = extract_meta(html)
            if not title:
                continue
            img = re.search(r'property="og:image"\s+content="([^"]*)"', html)
            has_dedicated = img and "/static/images/blog/" in img.group(1) and "heroes/" not in img.group(1)
            posts.append({
                "slug": slug,
                "title": title,
                "url": url or f"{SITE}/posts/{rel}",
                "desc": desc or "",
                "keep": has_dedicated,
            })

    generated = 0
    for p in posts:
        if p["keep"]:
            continue
        hero = make_hero(p["slug"], p["title"], p["url"], p["desc"])
        out = os.path.join(OUT_DIR, p["slug"].replace("/", "__") + ".png")
        hero.save(out, "PNG", optimize=True)
        generated += 1

    print(f"posts: {len(posts)} | kept existing: {len(posts) - generated} | generated: {generated}")
    print(f"output: {OUT_DIR}")


if __name__ == "__main__":
    main()