#!/usr/bin/env python3
"""Inject og:image / twitter:image into blog post HTML files.

For each onelifetime.world/posts/**/*.html without a dedicated og:image:
  - generated hero lives at /static/images/blog/heroes/<slug__.png>
  - og:image + twitter:image are injected into <head>.

Existing dedicated blog images (under /static/images/blog/ excluding heroes/)
and the DWS_IQ2026 placeholder are replaced by the per-post hero.

Run: .venv/bin/python scripts/inject_blog_hero_og.py
"""

import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_DIR = os.path.join(ROOT, "onelifetime.world", "posts")
SITE = "https://onelifetime.world"
HEROES_SUBDIR = "static/images/blog/heroes"


def slug_to_hero_name(slug):
    return slug.replace("/", "__") + ".png"


def main():
    changed = 0
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

            img_match = re.search(r'property="og:image"\s+content="([^"]*)"', html)
            if img_match and "/static/images/blog/" in img_match.group(1) and "heroes/" not in img_match.group(1):
                continue

            hero_url = f"{SITE}/{HEROES_SUBDIR}/{slug_to_hero_name(slug)}"

            if img_match:
                html = html.replace(img_match.group(0), f'property="og:image" content="{hero_url}"')
            else:
                anchor = re.search(r'<meta name="twitter:card"[^>]*>', html)
                if not anchor:
                    anchor = re.search(r'property="og:url"[^>]*>', html)
                if not anchor:
                    anchor = re.search(r"</head>", html)
                if not anchor:
                    continue
                insert = f'    <meta property="og:image" content="{hero_url}" />\n'
                html = html[: anchor.end()] + "\n" + insert + html[anchor.end():]

            tw_match = re.search(r'<meta name="twitter:image"[^>]*>', html)
            if tw_match:
                html = html.replace(tw_match.group(0), f'<meta name="twitter:image" content="{hero_url}">')
            else:
                anchor = re.search(r'<meta name="twitter:card"[^>]*>', html)
                if anchor:
                    insert = f'    <meta name="twitter:image" content="{hero_url}">\n'
                    html = html[: anchor.end()] + "\n" + insert + html[anchor.end():]

            open(full, "w", encoding="utf-8").write(html)
            changed += 1

    print(f"updated: {changed} posts")


if __name__ == "__main__":
    main()