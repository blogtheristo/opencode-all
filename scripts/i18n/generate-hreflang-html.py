#!/usr/bin/env python3
"""
Generate hreflang-enabled HTML files for each language variant.
Usage: python3 scripts/i18n/generate-hreflang-html.py

Reads the JSON translation files and generates HTML with proper:
- hreflang tags for SEO
- og:locale metadata
- Language selector UI
- SEO-friendly structure
"""

import json
import os
from pathlib import Path

# Configuration
BASE_DIR = Path("scripts/i18n/aegis-products")
OUTPUT_DIR = Path("dws10.com/products")
LANDING_PAGES_DIR = Path("landing-pages/dws10-com/products")
DOMAIN = "https://dws10.com"
PRODUCT_NAME = "aegis"

# Language metadata
LANGUAGES = {
    "en": {"name": "English", "flag": "🇬🇧", "locale": "en_US", "is_default": True},
    "fi": {"name": "Suomi", "flag": "🇫🇮", "locale": "fi_FI", "is_default": False},
    "sv": {"name": "Svenska", "flag": "🇸🇪", "locale": "sv_SE", "is_default": False},
    "de": {"name": "Deutsch", "flag": "🇩🇪", "locale": "de_DE", "is_default": False},
    "fr": {"name": "Français", "flag": "🇫🇷", "locale": "fr_FR", "is_default": False},
}

def load_json_translations(lang):
    """Load translation JSON for a language."""
    file_path = BASE_DIR / f"{lang}-strings.json"
    if not file_path.exists():
        raise FileNotFoundError(f"Translation file not found: {file_path}")

    with open(file_path) as f:
        return json.load(f)

def generate_hreflang_tags(current_lang):
    """Generate hreflang link tags."""
    tags = []
    for lang in LANGUAGES.keys():
        url = f"{DOMAIN}/products/{PRODUCT_NAME}.{lang}.html"
        tags.append(f'    <link rel="alternate" hreflang="{lang}" href="{url}" />')

    # Add x-default
    tags.append(f'    <link rel="alternate" hreflang="x-default" href="{DOMAIN}/products/{PRODUCT_NAME}.en.html" />')

    return "\n".join(tags)

def generate_og_locale_tags(current_lang):
    """Generate Open Graph locale tags."""
    tags = []
    lang_info = LANGUAGES[current_lang]

    # Primary locale
    tags.append(f'    <meta property="og:locale" content="{lang_info["locale"]}" />')

    # Alternate locales
    for lang, info in LANGUAGES.items():
        if lang != current_lang:
            tags.append(f'    <meta property="og:locale:alternate" content="{info["locale"]}" />')

    return "\n".join(tags)

def generate_language_selector():
    """Generate language selector UI."""
    selector = '    <nav class="language-selector" aria-label="Select language">\n'
    for lang, info in LANGUAGES.items():
        selector += f'      <a href="/products/{PRODUCT_NAME}.{lang}.html" lang="{lang}" title="{info["name"]}">'
        selector += f'{info["flag"]} {info["name"]}</a>\n'
    selector += '    </nav>'
    return selector

def generate_html(lang, translations):
    """Generate full HTML page for a language."""
    meta = translations.get("meta", {})
    seo = translations.get("seo", {})

    # Build the HTML
    html = f'''<!DOCTYPE html>
<html lang="{lang}" dir="ltr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="{seo.get("description", "")}" />
    <meta name="keywords" content="{seo.get("keywords", "")}" />

    <title>{seo.get("title", "DWS IQ Aegis")}</title>

    <!-- Language alternates for SEO -->
{generate_hreflang_tags(lang)}

    <!-- Open Graph metadata -->
    <meta property="og:title" content="{seo.get("og_title", "")}" />
    <meta property="og:description" content="{seo.get("og_description", "")}" />
    <meta property="og:url" content="{DOMAIN}/products/{PRODUCT_NAME}.{lang}.html" />
{generate_og_locale_tags(lang)}

    <!-- Twitter / X metadata -->
    <meta name="twitter:title" content="{seo.get("twitter_title", "")}" />
    <meta name="twitter:description" content="{seo.get("twitter_description", "")}" />
    <meta name="twitter:card" content="summary_large_image" />

    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 1200px; margin: 0 auto; padding: 20px; }}
        .language-selector {{ display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap; }}
        .language-selector a {{ padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; text-decoration: none; color: #007bff; }}
        .language-selector a:hover {{ background-color: #f0f0f0; }}
        h1 {{ margin: 30px 0 15px; font-size: 2.5em; }}
        h2 {{ margin: 20px 0 10px; font-size: 2em; }}
        section {{ margin: 40px 0; padding: 20px; border-left: 4px solid #007bff; }}
        table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }}
        th {{ background-color: #f8f9fa; font-weight: bold; }}
        .metadata {{ font-size: 0.85em; color: #666; }}
    </style>
</head>
<body>
    <div class="container">
        <!-- Language Selector -->
{generate_language_selector()}

        <!-- Metadata -->
        <p class="metadata">
            Language: {LANGUAGES[lang]["name"]} |
            Version: {meta.get("version", "1.0")} |
            Updated: {meta.get("date", "")}
        </p>

        <!-- Hero Section -->
        <section>
            <h1>{translations.get("hero", {}).get("h1", "DWS IQ Aegis")}</h1>
            <p><strong>{translations.get("hero", {}).get("tagline", "")}</strong></p>
            <p>{translations.get("hero", {}).get("intro", "")}</p>
        </section>

        <!-- EDIP Section -->
        <section>
            <h2>{translations.get("edip", {}).get("h2", "")}</h2>
            <p>{translations.get("edip", {}).get("intro", "")}</p>
        </section>

        <!-- Why Aegis -->
        <section>
            <h2>{translations.get("why_aegis", {}).get("h2", "")}</h2>
            <ul>
'''

    # Add why_aegis items
    for key, value in translations.get("why_aegis", {}).get("items", {}).items():
        html += f"                <li><strong>{key}:</strong> {value}</li>\n"

    html += '''            </ul>
        </section>

        <!-- Financial Engine -->
        <section>
            <h2>{}</h2>
            <p>{}</p>
        </section>

        <!-- Footer -->
        <footer style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p class="metadata">
                Page: {page_version} |
                Language code: {lang} |
                Generated: {date}
            </p>
        </footer>
    </div>
</body>
</html>
'''.format(
        translations.get("financial_engine", {}).get("h2", ""),
        translations.get("financial_engine", {}).get("p1", ""),
        translations.get("page_version", "DWS IQ Aegis — product page v1.0"),
        lang,
        meta.get("date", "2026-09-13")
    )

    return html

def main():
    """Generate HTML files for all languages."""
    # Create output directories if needed
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    LANDING_PAGES_DIR.mkdir(parents=True, exist_ok=True)

    print("Generating hreflang-enabled HTML files...\n")

    for lang in LANGUAGES.keys():
        try:
            print(f"Processing {lang}...", end=" ")

            # Load translations
            translations = load_json_translations(lang)

            # Generate HTML
            html_content = generate_html(lang, translations)

            # Write to main directory
            output_file = OUTPUT_DIR / f"{PRODUCT_NAME}.{lang}.html"
            with open(output_file, "w") as f:
                f.write(html_content)

            # Mirror to landing-pages
            mirror_file = LANDING_PAGES_DIR / f"{PRODUCT_NAME}.{lang}.html"
            with open(mirror_file, "w") as f:
                f.write(html_content)

            print(f"✓ Generated {output_file} and mirrored to landing-pages")

        except Exception as e:
            print(f"✗ Error: {e}")
            return 1

    print("\n✓ All HTML files generated successfully!")
    print(f"  Main files:    {OUTPUT_DIR}/{PRODUCT_NAME}.*.html")
    print(f"  Mirror files:  {LANDING_PAGES_DIR}/{PRODUCT_NAME}.*.html")
    print("\nNext steps:")
    print("  1. Verify HTML files in browser")
    print("  2. Commit all changes: git add dws10.com/ landing-pages/")
    print("  3. Run: git commit -m 'feat: complete aegis-products HTML with hreflang'")

    return 0

if __name__ == "__main__":
    exit(main())
