#!/usr/bin/env python3
"""Generate 116 unique branded product card images for dws10.com.

Reads dws10.com/config/products.json and writes one 1024x1024 PNG per product to
dws10.com/static/images/products/<id>.png. Uses DWS Gamma Brand Standard v3.9
gold palette with category-specific accent colors.
"""

import json
import math
import os
import random
import textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(ROOT, "dws10.com", "config", "products.json")
OUT = os.path.join(ROOT, "dws10.com", "static", "images", "products")
SIZE = 1024

# DWS Gamma Brand Standard v3.9 — Nordic Industrial Palette + Gold
CATEGORY_STYLE = {
    "platform": ((10, 15, 30), (37, 99, 235), "PLATFORM"),      # --nordic-navy + blue
    "advisory": ((15, 12, 30), (168, 85, 247), "ADVISORY"),      # purple
    "ai-cloud": ((10, 20, 30), (74, 222, 128), "AI & CLOUD"),    # green
    "hardware": ((20, 15, 10), (245, 158, 11), "HARDWARE"),      # gold (#f59e0b)
    "digital": ((15, 18, 28), (96, 165, 250), "DIGITAL"),        # blue accent
    "add-on": ((18, 18, 22), (148, 163, 184), "ADD-ON"),         # slate
}

# Gold standard: #f59e0b → #d97706
GOLD_TOP = (245, 158, 11)
GOLD_BOTTOM = (217, 119, 6)

try:
    FONT_BOLD = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 56
    )
    FONT_SMALL = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28
    )
    FONT_TINY = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22
    )
    FONT_TITLE = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 44
    )
except Exception:
    FONT_BOLD = ImageFont.load_default()
    FONT_SMALL = ImageFont.load_default()
    FONT_TINY = ImageFont.load_default()
    FONT_TITLE = ImageFont.load_default()


def gradient(size, top, bottom):
    img = Image.new("RGB", size)
    d = ImageDraw.Draw(img)
    for y in range(size[1]):
        t = y / size[1]
        color = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        d.line([(0, y), (size[0], y)], fill=color)
    return img


def grid_pattern(base, accent, alpha=22):
    img = base.copy()
    d = ImageDraw.Draw(img, "RGBA")
    step = 128
    for x in range(0, img.width, step):
        d.line([(x, 0), (x, img.height)], fill=accent + (alpha,), width=2)
    for y in range(0, img.height, step):
        d.line([(0, y), (img.width, y)], fill=accent + (alpha,), width=2)
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
    return lines[:5]


def make_card(product):
    pid = product["id"]
    name = product.get("name", pid)
    cat = product.get("storeCategory", "platform")
    bg, accent, cat_label = CATEGORY_STYLE.get(cat, CATEGORY_STYLE["platform"])
    price = product.get("price", 0)
    currency = product.get("currency", "EUR")
    cap_class = product.get("capacityClass", "")

    rng = random.Random(hash(pid) & 0xFFFFFFFF)
    bg2 = tuple(max(0, min(255, c + rng.randint(-8, 8))) for c in bg)

    # Gradient background
    img = gradient((SIZE, SIZE), bg, bg2)
    img = grid_pattern(img, accent, alpha=12)
    img = img.filter(ImageFilter.GaussianBlur(0.3))

    d = ImageDraw.Draw(img)

    # Gold accent sidebar (brand standard)
    d.rectangle([0, 0, 12, SIZE], fill=GOLD_TOP)

    # Brand mark top-left — gold rounded rect
    d.rounded_rectangle([56, 48, 56 + 76, 48 + 76], radius=16, fill=GOLD_TOP)
    d.text((56 + 38, 48 + 38), "DWS", fill=(255, 255, 255), font=FONT_TINY, anchor="mm")

    d.text((150, 86), "DWS IQ", fill=(255, 255, 255), font=FONT_SMALL, anchor="lm")

    # Category badge — gold outline style
    label_w = d.textlength(cat_label, font=FONT_TINY) + 40
    cat_x = SIZE - 56 - label_w
    d.rounded_rectangle(
        [cat_x, 48, SIZE - 56, 48 + 38], radius=19,
        fill=None, outline=GOLD_TOP, width=2
    )
    d.text(
        (cat_x + label_w / 2, 67),
        cat_label,
        fill=GOLD_TOP,
        font=FONT_TINY,
        anchor="mm",
    )

    # Capacity class badge (if present)
    if cap_class:
        cap_label = cap_class.upper()
        cap_w = d.textlength(cap_label, font=FONT_TINY) + 32
        cap_colors = {
            "Core": (34, 197, 94),
            "Production": (59, 130, 246),
            "Enterprise": (168, 85, 247),
            "Sovereign": (249, 115, 22),
        }
        cap_color = cap_colors.get(cap_class, GOLD_TOP)
        cap_x = SIZE - 56 - cap_w
        d.rounded_rectangle(
            [cap_x, 94, SIZE - 56, 94 + 30], radius=15,
            fill=cap_color + (40,), outline=cap_color, width=1
        )
        d.text(
            (cap_x + cap_w / 2, 109),
            cap_label,
            fill=cap_color,
            font=FONT_TINY,
            anchor="mm",
        )

    # Product name — centered, no black box, gold underline
    lines = wrap_text(d, name, FONT_TITLE, 780)
    total_h = len(lines) * 58
    y_start = (SIZE - total_h) // 2 - 20

    for i, line in enumerate(lines):
        d.text((SIZE / 2, y_start + i * 58), line, fill=(255, 255, 255), font=FONT_TITLE, anchor="mm")

    # Gold underline beneath title
    underline_w = min(400, max(200, total_h * 2))
    ux = (SIZE - underline_w) / 2
    uy = y_start + total_h + 16
    d.rounded_rectangle(
        [ux, uy, ux + underline_w, uy + 4], radius=2, fill=GOLD_TOP
    )

    # Price — gold text
    if price and price > 0:
        price_str = f"{price:,.2f} {currency}"
        d.text(
            (SIZE / 2, uy + 48),
            price_str,
            fill=GOLD_TOP,
            font=FONT_SMALL,
            anchor="mm",
        )

    # Footer
    d.text((56, SIZE - 48), "Lifetime Group", fill=(148, 163, 184), font=FONT_TINY)
    d.text(
        (SIZE - 56, SIZE - 48),
        "dws10.com",
        fill=(148, 163, 184),
        font=FONT_TINY,
        anchor="rm",
    )

    return img


def main():
    with open(CONFIG, encoding="utf-8") as f:
        data = json.load(f)
    products = data["products"] if isinstance(data, dict) else data

    os.makedirs(OUT, exist_ok=True)
    written = 0
    for pid, product in products.items():
        img = make_card(product)
        path = os.path.join(OUT, f"{pid}.png")
        img.save(path, "PNG", optimize=True)
        written += 1
    print(f"generated {written} cards -> {OUT}")


if __name__ == "__main__":
    main()