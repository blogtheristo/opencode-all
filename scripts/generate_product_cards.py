#!/usr/bin/env python3
"""Generate 116 unique branded product card images for dws10.com.

Reads dws10.com/config/products.json and writes one 1024x1024 PNG per product to
dws10.com/static/images/products/<id>.png. Accent color is chosen by storeCategory.
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

CATEGORY_STYLE = {
    "platform": ((20, 22, 40), (52, 152, 219), "PLATFORM"),
    "advisory": ((24, 20, 40), (155, 89, 182), "ADVISORY"),
    "ai-cloud": ((20, 34, 40), (46, 204, 113), "AI & CLOUD"),
    "hardware": ((34, 24, 20), (230, 126, 34), "HARDWARE"),
    "digital": ((26, 30, 38), (241, 196, 15), "DIGITAL"),
    "add-on": ((30, 30, 30), (127, 140, 141), "ADD-ON"),
}

try:
    FONT_BOLD = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 64
    )
    FONT_SMALL = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 32
    )
    FONT_TINY = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 26
    )
except Exception:
    FONT_BOLD = ImageFont.load_default()
    FONT_SMALL = ImageFont.load_default()
    FONT_TINY = ImageFont.load_default()


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

    rng = random.Random(hash(pid) & 0xFFFFFFFF)
    bg2 = tuple(max(0, min(255, c + rng.randint(-14, 14))) for c in bg)

    img = gradient((SIZE, SIZE), bg, bg2)
    img = grid_pattern(img, accent, alpha=18)
    img = img.filter(ImageFilter.GaussianBlur(0.4))

    d = ImageDraw.Draw(img)

    # accent side bar
    d.rectangle([0, 0, 14, SIZE], fill=accent)

    # brand mark top-left
    d.rounded_rectangle([64, 56, 64 + 84, 56 + 84], radius=18, fill=accent)
    d.text((64 + 42, 56 + 42), "DWS", fill=(255, 255, 255), font=FONT_SMALL, anchor="mm")

    d.text((170, 98), "DWS IQ", fill=(255, 255, 255), font=FONT_SMALL, anchor="lm")

    # category badge
    label_w = d.textlength(cat_label, font=FONT_TINY) + 48
    d.rounded_rectangle(
        [SIZE - 64 - label_w, 56, SIZE - 64, 56 + 44], radius=22, fill=accent + (220,)
    )
    d.text(
        (SIZE - 64 - label_w / 2, 78),
        cat_label,
        fill=(255, 255, 255),
        font=FONT_TINY,
        anchor="mm",
    )

    # centered product name
    lines = wrap_text(d, name, FONT_BOLD, 820)
    y = 460
    d.rectangle([64, y - 34, SIZE - 64, y + len(lines) * 78 + 34], fill=(0, 0, 0))
    yy = y
    for line in lines:
        d.text((SIZE / 2, yy), line, fill=(255, 255, 255), font=FONT_BOLD, anchor="mm")
        yy += 78

    # price
    if price and price > 0:
        price_str = f"{price:,.2f} {currency}"
        d.text(
            (SIZE / 2, yy + 56),
            price_str,
            fill=accent,
            font=FONT_SMALL,
            anchor="mm",
        )

    # footer
    d.text((64, SIZE - 56), "Lifetime Group", fill=(200, 200, 200), font=FONT_TINY)
    d.text(
        (SIZE - 64, SIZE - 56),
        "dws10.com",
        fill=(200, 200, 200),
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