import csv
import html as html_module
import json
import os
import re
from xml.etree.ElementTree import Element, SubElement, tostring

import markdown
import yaml

# Use defusedxml to prevent XXE attacks
try:
    from defusedxml import minidom
except ImportError:
    # Fallback to standard minidom (less secure - install defusedxml for production)
    import warnings
    from xml.dom import minidom

    warnings.warn(
        "Using standard minidom - install 'defusedxml' for XXE protection",
        UserWarning,
        stacklevel=2,
    )

# Configuration
STORE_DIR = "Store"
PRODUCTS_JSON = "dws10.com/config/products.json"

# Output goes to the SOURCE folder, never the landing-pages mirror.
# Writing to the mirror is what caused the 2026-07-31 drift incident: this
# generator emitted 121+ pages that existed only under landing-pages/, while
# sync-dws6-landing-pages.yml rsyncs source -> mirror with --delete. The two
# fought, and 94 product pages survived only because that sync had not run.
# See docs/field-notes/2026-07-31-post-mass-merge-investor-and-store-sync-audit.md
SITE_DIR = "dws10.com"
OUTPUT_HTML_DIR = f"{SITE_DIR}/products"
OUTPUT_FEED_FILE = f"{SITE_DIR}/products.xml"
OUTPUT_CSV_FILE = f"{SITE_DIR}/products.csv"
BASE_URL = "https://dws10.com"

# DWS IQ product email (CLAUDE.md sender-identity table). Never a noreply@.
PRODUCT_EMAIL = "risto@onelifetime.world"

# ── Hand-authored pages: generation SKIPS these ──────────────────────────────
# These carry bespoke bodies (175-1060 lines, some gamma-styled) that the
# generated template would flatten. The generator leaves their HTML alone but
# STILL enforces products.json as the pricing source of truth against them --
# see check_handauthored_prices(). Shrink this set as the template improves;
# a page only belongs here while its body is genuinely richer than a generated
# one would be.
HAND_AUTHORED = {
    "ai-agent-engineering",
    "ai-consultant-day",
    "ai-consulting-agentic",
    "ai-koulutus-3d",
    "aws-consultancy",
    "business-mentor-30",
    "cloud-ready-teams",
    "consulting-fit55",
    "consulting-hourly",
    "conversational-agent",
    "devops-lead",
    "dws-iq-006",
    "edge-node-gn100",
    "fh-auto-001",
    "fh-cms-001",
    "fh-omni-001",
    "fh-rpt-001",
    "firehorse-coach",
    "firehorse-data-services",
    "firehorse-flow",
    "firehorse-mobile",
    "lean-project",
    "lifetime-bundle-2026",
    "m365-consultancy",
    "omnichannel-multimodal",
    "professional-web-pages",
    "secure-email-proton",
    "sovereignty-cloud-consulting",
}

# Hand-authored pages whose displayed price does not match products.json and
# which the HIC has not yet reconciled. Listed so the build reports them every
# run instead of failing the pipeline on a pricing decision no script can make.
# Empty this set as each is resolved; do not add to it to silence a new drift.
PRICE_REVIEW_PENDING = {
    # slug: (products.json price, what the page shows, why unresolved)
    "ai-agent-engineering": (200, "€99", "page undercuts catalog"),
    "ai-consultant-day": (1200, "€699", "page undercuts catalog"),
    "aws-consultancy": (3750, "€1500 / day", "day rate vs flat catalog price"),
    # Found by this check on first run, not by the manual audit that preceded
    # it -- the manual pass matched a EUR 3000 mention elsewhere in the page's
    # 1060 lines and read it as agreement. Same class of drift as the two above.
    "consulting-fit55": (3000, "€1,500", "page undercuts catalog by half"),
}
# RESOLVED 2026-09-09 — edge-node-gn100. Found by this check on its first run
# against the current catalog, then ruled by the HIC: EUR 8,008 is real. The
# page had carried three mutually inconsistent hardware figures (a EUR 3,999
# line item, a EUR 4,299 figure inside a EUR 5,294 "turnkey" total, against the
# catalog's EUR 8,008) and its own breakdown did not sum to its own total. Page
# corrected to EUR 8,008 hardware; turnkey restated as EUR 9,003 (8,008 + 995
# install) per the catalog priceNote, which is the authority under
# DWS_TRUTH_STANDARD §3. The spec-table row quoting EUR 3,999 as Acer's EMEA
# launch price is left alone -- it is attributed third-party MSRP, not our
# sell price, and rewriting it would make it a false claim about Acer.
# Dropped 2026-09-09, both no longer in dws10.com/config/products.json so the
# generator can never reach them: "digital-design-gold" (page also gone from
# main) and "cloud-ready-teams" (page remains, but is now hand-maintained
# outside the catalog and so is not held to it).

# Ensure output directory exists
os.makedirs(OUTPUT_HTML_DIR, exist_ok=True)


def get_footer():
    """Reads footer from privacy-policy/footer.txt and converts JSX className to HTML class."""
    try:
        # Assuming footer.txt is in privacy-policy directory relative to repo root
        # Script run from repo root
        footer_path = os.path.join("privacy-policy", "footer.txt")
        if not os.path.exists(footer_path):
            # Fallback if running from scripts/
            footer_path = os.path.join("..", "privacy-policy", "footer.txt")

        with open(footer_path, encoding="utf-8") as f:
            content = f.read()

        # Convert JSX className to HTML class
        content = content.replace("className=", "class=")

        # Add default styling if not present, to match previous look
        if "style=" not in content and "<footer" in content:
            content = content.replace(
                "<footer",
                '<footer style="text-align: center; padding: 40px; color: #64748b; font-size: 0.9rem; background: #1e293b; border-top: 1px solid #334155;"',
            )

        return content
    except Exception as e:
        print(f"Warning: Could not read footer.txt: {e}")
        # Fallback to hardcoded footer
        return """<footer style="text-align: center; padding: 40px; color: #64748b; font-size: 0.9rem;">
        <p><strong>LEGAL NOTICE</strong></p>
        <p><strong>Data Controller:</strong> Lifetime Oy (Laidunmaanraitti 2 A 25, 02330 Espoo, Finland).</p>
        <p><strong>Regulatory Framework:</strong> As of December 2025, our operations strictly adhere to the EU General Data Protection Regulation (GDPR), the Digital Services Act (DSA), the NIS2 Directive, and the EU AI Act.</p>
        <p style="margin-top: 20px;">Copyright © 2025 Lifetime Oy. All Rights Reserved.</p>
    </footer>"""


def load_products_json():
    """Load products from dws10.com/config/products.json (primary source)."""
    if not os.path.exists(PRODUCTS_JSON):
        print(f"Warning: {PRODUCTS_JSON} not found, skipping JSON products.")
        return []

    with open(PRODUCTS_JSON, encoding="utf-8") as f:
        data = json.load(f)

    products = []
    for pid, p in data.get("products", {}).items():
        slug = pid.lower().replace("_", "-")
        google = p.get("google", {})
        # Build description HTML from features list
        features_html = ""
        if p.get("features"):
            features_html = (
                "<ul>" + "".join(f"<li>{f}</li>" for f in p["features"]) + "</ul>"
            )
        html_content = f"<p>{p.get('description', '')}</p>{features_html}"

        product = {
            "title": p.get("name", ""),
            "price": str(p.get("price", "0")),
            "currency": p.get("currency", "EUR"),
            "sku": p.get("id", pid),
            "availability": google.get("availability", "in_stock"),
            "condition": google.get("condition", "new"),
            "google_product_category": google.get(
                "productCategory", "Software > Business & Productivity Software"
            ),
            "image_link": p.get(
                "image", f"{BASE_URL}/static/images/Firehorse_Store.jpg"
            ),
            "brand": google.get("brand", "Lifetime"),
            "slug": slug,
            "html_content": html_content,
            "priceNote": p.get("priceNote", ""),
            "storeCategory": p.get("storeCategory", ""),
            # Tranche 2 managed delivery contract — additive, generated by
            # scripts/truth/apply-product-delivery-contracts.mjs. Never
            # fabricated here; only read through.
            "checkoutUrl": p.get("checkoutUrl", f"/checkout/?product={p.get('id', pid)}"),
            "checkoutMode": p.get("checkoutMode", ""),
            "acceptanceKpi": p.get("acceptanceKpi"),
            "exclusions": p.get("exclusions"),
            "fulfilment": p.get("fulfilment"),
        }
        # Fix relative image paths to absolute
        if product["image_link"].startswith("/"):
            product["image_link"] = BASE_URL + product["image_link"]

        products.append(product)

    print(f"Loaded {len(products)} products from {PRODUCTS_JSON}")
    return products


def parse_product(filename):
    with open(os.path.join(STORE_DIR, filename), encoding="utf-8") as f:
        content = f.read()

    # Split YAML frontmatter and Markdown content
    parts = content.split("---", 2)
    if len(parts) < 3:
        print(f"Skipping {filename}: No valid YAML frontmatter found.")
        return None

    try:
        metadata = yaml.safe_load(parts[1])
    except yaml.YAMLError as e:
        print(f"Skipping {filename}: YAML parse error: {e}")
        return None

    if (
        not isinstance(metadata, dict)
        or "title" not in metadata
        or "price" not in metadata
    ):
        print(
            f"Skipping {filename}: missing required 'title' or 'price' in frontmatter."
        )
        return None

    md_content = parts[2].strip()
    html_content = markdown.markdown(md_content)

    # Derive slug from filename
    slug = filename.replace(".md", "").replace("_", "-")
    metadata["slug"] = slug
    metadata["html_content"] = html_content

    return metadata


def _write_html(path, html):
    """Write generated HTML with no trailing whitespace on any line.

    Optional template sections (acceptance/exclusions/fulfilment/price-note) are interpolated
    on their own indented line and render as an empty string when the field is absent, which
    would otherwise leave whitespace-only lines in the committed output. Stripping here — once,
    at every write site — keeps the fix in the generator instead of requiring a one-off output
    edit that the next regeneration would immediately undo.
    """
    normalised = re.sub(r"[ \t]+$", "", html, flags=re.MULTILINE)
    with open(path, "w", encoding="utf-8") as f:
        f.write(normalised)


def generate_html(product):
    # Simple template for product page
    footer_html = get_footer()

    # Derive the head metadata from the catalog entry rather than leaving the
    # page bare: these pages are the Google Merchant landing targets, so a
    # missing description or price is a feed-quality problem, not just SEO.
    canonical = f"{BASE_URL}/products/{product['slug']}.html"
    title_attr = html_module.escape(product["title"], quote=True)
    plain = re.sub(r"<[^>]+>", " ", product.get("html_content", ""))
    plain = re.sub(r"\s+", " ", html_module.unescape(plain)).strip()
    meta_desc = html_module.escape(plain[:300].rstrip(), quote=True)
    # Respect the catalog currency instead of hardcoding a euro sign, and read
    # "0" as free rather than printing "EUR 0".
    currency = product.get("currency", "EUR")
    symbol = {"EUR": "€", "USD": "$", "GBP": "£"}.get(currency, currency + " ")
    try:
        price_num = float(product["price"])
    except (TypeError, ValueError):
        price_num = None
    if price_num == 0:
        price_display = "Free"
    elif price_num is not None:
        price_display = f"{symbol}{price_num:,.0f}".replace(",", " ")
    else:
        price_display = f"{symbol}{product['price']}"

    price_note = product.get("priceNote") or ""
    price_note_html = (
        f'<div class="price-note">{html_module.escape(price_note)}</div>'
        if price_note
        else ""
    )

    # Tranche 2 managed delivery contract sections. Every field here is read
    # from products.json (populated by
    # scripts/truth/apply-product-delivery-contracts.mjs) — nothing is
    # invented in this generator.
    acceptance = product.get("acceptanceKpi")
    acceptance_html = ""
    if acceptance:
        outcomes_html = "".join(
            f"<li>{html_module.escape(o)}</li>" for o in acceptance.get("requiredOutcomes", [])
        )
        acceptance_html = f"""
        <div class="delivery-section">
            <h2>Acceptance criteria</h2>
            <p>{html_module.escape(acceptance.get("condition", ""))}</p>
            <ul>{outcomes_html}</ul>
            <p class="fine-print">{html_module.escape(acceptance.get("rule", ""))}</p>
        </div>"""

    exclusions = product.get("exclusions")
    exclusions_html = ""
    if exclusions:
        items_html = "".join(f"<li>{html_module.escape(e)}</li>" for e in exclusions)
        exclusions_html = f"""
        <div class="delivery-section">
            <h2>Not included</h2>
            <ul>{items_html}</ul>
        </div>"""

    fulfilment = product.get("fulfilment")
    fulfilment_html = ""
    if fulfilment:
        fulfilment_html = f"""
        <div class="delivery-section">
            <h2>Delivery</h2>
            <ul>
                <li>Delivered by: {html_module.escape(fulfilment.get("owner", ""))}</li>
                <li>Acknowledged within: {html_module.escape(fulfilment.get("acknowledgementSla", ""))}</li>
                <li>{html_module.escape(fulfilment.get("deliveryMode", ""))}</li>
            </ul>
        </div>"""

    checkout_url = html_module.escape(
        product.get("checkoutUrl") or f"/checkout/?product={product['sku']}", quote=True
    )
    buy_button_html = f'<a href="{checkout_url}" class="buy-btn" data-product-sku="{html_module.escape(product["sku"], quote=True)}">Buy now — {price_display}</a>'
    contact_link_html = f'<a href="mailto:{PRODUCT_EMAIL}?subject=Question: {product["title"]} ({product["sku"]})" class="back-link">Questions before you buy? Contact sales</a>'
    structured_data = json.dumps(
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product["title"],
            "sku": product["sku"],
            "description": plain[:500],
            "image": product["image_link"],
            "brand": {"@type": "Brand", "name": product.get("brand", "Lifetime")},
            "offers": {
                "@type": "Offer",
                "url": canonical,
                "price": str(product["price"]),
                "priceCurrency": product.get("currency", "EUR"),
                "availability": f"https://schema.org/{'InStock' if product.get('availability') == 'in_stock' else 'PreOrder'}",
                "seller": {"@type": "Organization", "name": "Lifetime Oy"},
            },
        },
        indent=2,
        ensure_ascii=False,
    )
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{product["title"]} | Lifetime Firehorse™Store</title>
    <meta name="description" content="{meta_desc}">
    <meta name="author" content="Lifetime Oy">
    <link rel="canonical" href="{canonical}" />
    <link rel="icon" type="image/png" href="/DWS_IQ2026.png">
    <meta property="og:type" content="product">
    <meta property="og:title" content="{title_attr}">
    <meta property="og:description" content="{meta_desc}">
    <meta property="og:url" content="{canonical}">
    <meta property="og:image" content="{product["image_link"]}">
    <script type="application/ld+json">
{structured_data}
    </script>
    <style>
        body {{ font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; margin: 0; padding: 0; display: flex; flex-direction: column; min-height: 100vh; }}
        .container {{ max-width: 800px; margin: 40px auto; background: rgba(30, 41, 59, 0.5); padding: 40px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); flex-grow: 1; }}
        h1 {{ color: #60a5fa; }}
        .price {{ font-size: 2rem; color: #4ade80; font-weight: bold; margin-bottom: 4px; }}
        .price-note {{ font-size: 0.9rem; color: #94a3b8; margin-bottom: 20px; }}
        .content ul {{ padding-left: 20px; }}
        .content li {{ margin-bottom: 6px; }}
        a.buy-btn {{ display: inline-block; background: #2563eb; color: white; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 20px; }}
        a.back-link {{ color: #94a3b8; text-decoration: none; display: block; margin-bottom: 20px; }}

        .nav-header {{ background: #1e293b; padding: 20px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }}
        .nav-brand {{ font-size: 1.5rem; font-weight: bold; color: white; text-decoration: none; display: flex; align-items: center; gap: 10px; }}
        .nav-links {{ display: flex; gap: 20px; }}
        .nav-links a {{ color: #cbd5e1; text-decoration: none; font-weight: 500; transition: color 0.2s; }}
        .nav-links a:hover {{ color: #60a5fa; }}
        .delivery-section {{ margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }}
        .delivery-section h2 {{ color: #93c5fd; font-size: 1.15rem; margin-bottom: 10px; }}
        .delivery-section ul {{ padding-left: 20px; }}
        .delivery-section li {{ margin-bottom: 6px; }}
        .fine-print {{ font-size: 0.85rem; color: #94a3b8; }}
    </style>
</head>
<body>
    <div class="nav-header">
        <a href="../../" class="nav-brand">
            DWS IQ Platform
        </a>
        <div class="nav-links">
            <a href="../../">Home</a>
            <a href="../../buy/">Store</a>
        </div>
    </div>
    <div class="container">
        <a href="../" class="back-link">← Back to Store</a>
        <h1>{product["title"]}</h1>
        <div class="price">{price_display}</div>
        {price_note_html}
        <div class="content">
            {product["html_content"]}
        </div>
        {acceptance_html}
        {exclusions_html}
        {fulfilment_html}
        <div style="margin-top: 24px;">
            {buy_button_html}
        </div>
        {contact_link_html}
    </div>
    <script src="/shared-assets/nav/product-actions.js" defer></script>
    {footer_html}
</body>
</html>"""

    _write_html(os.path.join(OUTPUT_HTML_DIR, f"{product['slug']}.html"), html)


def page_price(path):
    """Return the page's OWN displayed price: the first element carrying a
    'price' class. Later ones are cross-referenced products (an aws-consultancy
    page lists Jetson hardware, for example) and must not be read as its price."""
    try:
        with open(path, encoding="utf-8", errors="replace") as f:
            text = f.read()
    except OSError:
        return None, None
    # Walk every price-ish element and return the first that yields a NUMBER.
    # Taking literally the first match is wrong: pages wrap the real figure in
    # empty containers ('price-block') and follow it with labels
    # ('price-suffix'), so a naive first-match reads '' and the page slips
    # through unchecked.
    for m in re.finditer(r'class="[^"]*\bprice\b[^"]*"[^>]*>\s*([^<]{1,40})<', text):
        shown = html_module.unescape(m.group(1)).strip()
        digits = re.sub(r"[^\d.,]", "", shown).replace(" ", "")
        if not digits:
            continue
        if "," in digits and "." in digits:
            digits = digits.replace(",", "")
        elif re.search(r",\d{3}\b", digits):
            digits = digits.replace(",", "")
        else:
            digits = digits.replace(",", ".")
        digits = re.sub(r"\.(?=\d{3}\b)", "", digits)
        try:
            return shown, float(digits)
        except ValueError:
            continue
    return None, None


def check_handauthored_prices(products):
    """products.json is the single pricing source (CLAUDE.md, Source-of-Truth
    Rules). Hand-authored pages are exempt from generation, NOT from that rule.
    Fails the build on any NEW divergence; already-known ones are reported
    loudly every run via PRICE_REVIEW_PENDING rather than silently passing."""
    known, fresh, unreadable = [], [], []
    for p in products:
        slug = p["slug"]
        if slug not in HAND_AUTHORED:
            continue
        path = os.path.join(OUTPUT_HTML_DIR, f"{slug}.html")
        if not os.path.exists(path):
            continue
        shown, value = page_price(path)
        if value is None:
            # Never pass silently: an unreadable price is an unverified price.
            unreadable.append((slug, float(p["price"])))
            continue
        if abs(value - float(p["price"])) < 0.01:
            continue
        # products.json prices arrive as strings via load_products_json().
        (known if slug in PRICE_REVIEW_PENDING else fresh).append(
            (slug, float(p["price"]), shown)
        )

    if known:
        print(
            f"\n  !! {len(known)} hand-authored page(s) priced against an unreconciled "
            f"catalog value -- awaiting an HIC pricing decision:"
        )
        for slug, want, shown in known:
            why = PRICE_REVIEW_PENDING[slug][2]
            print(
                f"       {slug:30s} products.json=EUR {want:<9,.0f} "
                f"page={shown:<14s} ({why})"
            )

    if unreadable:
        print(
            f"\n  ?? {len(unreadable)} hand-authored page(s) with no machine-readable "
            f"price -- cannot be verified against products.json:"
        )
        for slug, want in unreadable:
            print(f"       {slug:30s} products.json=EUR {want:<9,.0f} page=<unparsed>")

    if fresh:
        print(f"\n  XX BUILD FAILED -- {len(fresh)} NEW price divergence(s):")
        for slug, want, shown in fresh:
            print(f"       {slug:30s} products.json=EUR {want:<9,.0f} page={shown}")
        print(
            "     products.json is the single pricing source. Either correct the page,\n"
            "     correct products.json, or -- if this is a deliberate unit difference\n"
            "     (a day rate against a flat price) -- add it to PRICE_REVIEW_PENDING\n"
            "     with a reason so it stays visible."
        )
        raise SystemExit(1)


def generate_policy(filename, output_subdir, title_override=None):
    filepath = os.path.join(STORE_DIR, filename)
    if not os.path.exists(filepath):
        print(f"Skipping policy '{filename}': file not found at {filepath}")
        return
    with open(filepath, encoding="utf-8") as f:
        content = f.read()

    # Split frontmatter if exists
    if content.startswith("---"):
        parts = content.split("---", 2)
        raw_md = parts[2].strip() if len(parts) >= 3 else content
    else:
        raw_md = content

    html_content = markdown.markdown(raw_md)
    footer_html = get_footer()

    # Policy Template
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title_override if title_override else filename.replace(".md", "").replace("_", " ")} | Lifetime DWS IQ</title>
    <link rel="stylesheet" href="../../static/css/style.css">
    <style>
        body {{ font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; margin: 0; padding: 0; display: flex; flex-direction: column; min-height: 100vh; }}
        .container {{ max-width: 900px; margin: 40px auto; background: rgba(30, 41, 59, 0.5); padding: 40px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); flex-grow: 1; }}
        h1, h2, h3 {{ color: #60a5fa; margin-top: 1.5em; }}
        h1 {{ border-bottom: 2px solid #334155; padding-bottom: 0.5em; }}
        a {{ color: #60a5fa; }}
        ul {{ padding-left: 20px; }}
        li {{ margin-bottom: 10px; }}
        strong {{ color: #e2e8f0; }}
        .nav-header {{ background: #1e293b; padding: 20px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }}
        .nav-brand {{ font-size: 1.5rem; font-weight: bold; color: white; text-decoration: none; display: flex; align-items: center; gap: 10px; }}
        .nav-links {{ display: flex; gap: 20px; align-items: center; }}
        .nav-links a {{ color: #cbd5e1; text-decoration: none; font-weight: 500; transition: color 0.2s; }}
        .nav-links a:hover {{ color: #60a5fa; }}

        /* Dropdown */
        .nav-dropdown {{ position: relative; }}
        .nav-dropdown-content {{ display: none; position: absolute; top: 100%; right: 0; background: #1e293b; min-width: 220px; box-shadow: 0 8px 16px rgba(0,0,0,0.5); z-index: 50; border: 1px solid #334155; border-radius: 4px; padding: 8px 0; }}
        .nav-dropdown:hover .nav-dropdown-content {{ display: block; }}
        .nav-dropdown-content a {{ color: #cbd5e1; padding: 10px 16px; text-decoration: none; display: block; font-size: 0.95rem; }}
        .nav-dropdown-content a:hover {{ background-color: #334155; color: #60a5fa; }}
    </style>
</head>
<body>
    <div class="nav-header">
        <a href="../../" class="nav-brand">
            DWS IQ Platform
        </a>
        <div class="nav-links">
            <a href="../../">Home</a>
            <a href="../../buy/">Store</a>
            <div class="nav-dropdown">
                <a href="../../legal/" style="font-weight: bold;">Legal Hub ▾</a>
                <div class="nav-dropdown-content">
                    <a href="../../legal/"><strong>Legal Hub (Start Here)</strong></a>
                    <a href="../../regulatory-notice/">Investor Notice</a>
                    <hr style="border:0; border-top:1px solid #334155; margin:5px 0;">
                    <a href="../../privacy-policy/">Privacy Policy</a>
                    <a href="../../terms/">Professional Services Terms</a>
                    <a href="../../terms-dws-iq/">DWS IQ Terms</a>
                    <a href="../../terms-firehorse/">Firehorse Terms</a>
                    <a href="../../terms-lifetime-fleet/">Fleet Terms</a>
                    <a href="../../terms-professional/">Professional Terms</a>
                    <a href="../../return-policy/">Return Policy</a>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        {html_content}
    </div>
    {footer_html}
</body>
</html>"""

    # Output dir
    out_dir = os.path.join(SITE_DIR, output_subdir)
    os.makedirs(out_dir, exist_ok=True)

    _write_html(os.path.join(out_dir, "index.html"), html)
    print(f"Generated {out_dir}/index.html")


def generate_csv(products):
    filename = OUTPUT_CSV_FILE
    fieldnames = [
        "id",
        "title",
        "description",
        "link",
        "image_link",
        "availability",
        "price",
        "brand",
        "google_product_category",
        "identifier_exists",
    ]

    with open(filename, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for p in products:
            row = {
                "id": p.get("sku", ""),
                "title": p.get("title", ""),
                "description": p.get("html_content", "")[:5000].replace("\n", " "),
                "link": f"{BASE_URL}/products/{p['slug']}.html",
                "image_link": p.get(
                    "image_link", f"{BASE_URL}/static/images/Firehorse_Store.jpg"
                ),
                "availability": p.get("availability", "in_stock"),
                "price": f"{p['price']} {p.get('currency', 'EUR')}",
                "brand": p.get("brand", "Lifetime"),
                "google_product_category": p.get(
                    "google_product_category",
                    "Software > Business & Productivity Software",
                ),
                "identifier_exists": "no",
            }
            writer.writerow(row)
    print(f"CSV generated at {filename}")


def generate_store_page(products):
    # Generates the main /buy/ index page with a grid layout
    footer_html = get_footer()
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lifetime Firehorse™Store | DWS IQ</title>
    <link rel="stylesheet" href="../../static/css/style.css">
    <style>
        body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; margin: 0; padding: 0; display: flex; flex-direction: column; min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; flex-grow: 1; }
        h1 { color: #60a5fa; text-align: center; margin-bottom: 40px; font-size: 2.5rem; }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .product-card { background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; transition: transform 0.2s; display: flex; flex-direction: column; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .product-image { width: 100%; height: 200px; object-fit: cover; background: #1e293b; }
        .product-content { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }
        .product-title { font-size: 1.4rem; color: #e2e8f0; margin: 0 0 10px 0; }
        .product-price { font-size: 1.2rem; color: #4ade80; font-weight: bold; margin-bottom: 15px; }
        .product-excerpt { font-size: 0.9rem; color: #94a3b8; margin-bottom: 20px; flex-grow: 1; }
        .buy-btn { display: block; text-align: center; background: #2563eb; color: white; padding: 10px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: auto; }
        .buy-btn:hover { background: #1d4ed8; }

        .nav-header { background: #1e293b; padding: 20px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand { font-size: 1.5rem; font-weight: bold; color: white; text-decoration: none; display: flex; align-items: center; gap: 10px; }
        .nav-links { display: flex; gap: 20px; align-items: center; }
        .nav-links a { color: #cbd5e1; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .nav-links a:hover { color: #60a5fa; }

        /* Dropdown */
        .nav-dropdown { position: relative; }
        .nav-dropdown-content { display: none; position: absolute; top: 100%; right: 0; background: #1e293b; min-width: 220px; box-shadow: 0 8px 16px rgba(0,0,0,0.5); z-index: 50; border: 1px solid #334155; border-radius: 4px; padding: 8px 0; }
        .nav-dropdown:hover .nav-dropdown-content { display: block; }
        .nav-dropdown-content a { color: #cbd5e1; padding: 10px 16px; text-decoration: none; display: block; font-size: 0.95rem; }
        .nav-dropdown-content a:hover { background-color: #334155; color: #60a5fa; }
    </style>
</head>
<body>
    <div class="nav-header">
        <a href="../../" class="nav-brand">
            DWS IQ Platform
        </a>
        <div class="nav-links">
            <a href="../../">Home</a>
            <a href="../../buy/">Store</a>
            <div class="nav-dropdown">
                <a href="../../legal/" style="font-weight: bold;">Legal Hub ▾</a>
                <div class="nav-dropdown-content">
                    <a href="../../legal/"><strong>Legal Hub (Start Here)</strong></a>
                    <a href="../../regulatory-notice/">Investor Notice</a>
                    <hr style="border:0; border-top:1px solid #334155; margin:5px 0;">
                    <a href="../../privacy-policy/">Privacy Policy</a>
                    <a href="../../terms/">Professional Services Terms</a>
                    <a href="../../terms-dws-iq/">DWS IQ Terms</a>
                    <a href="../../terms-firehorse/">Firehorse Terms</a>
                    <a href="../../terms-lifetime-fleet/">Fleet Terms</a>
                    <a href="../../terms-professional/">Professional Terms</a>
                    <a href="../../return-policy/">Return Policy</a>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <h1>Lifetime Firehorse™Store</h1>
        <div class="product-grid">
"""
    for p in products:
        # Extract a short excerpt (first paragraph or first 150 chars)
        description = p.get("html_content", "")
        clean_text = re.sub("<[^<]+?>", "", description)
        excerpt = clean_text[:150] + "..." if len(clean_text) > 150 else clean_text

        html += f"""
            <div class="product-card">
                <img src="{p.get("image_link", "../../static/images/Firehorse_Store.jpg")}" alt="{p["title"]}" class="product-image">
                <div class="product-content">
                    <h2 class="product-title">{p["title"]}</h2>
                    <div class="product-price">€{p["price"]}</div>
                    <div class="product-excerpt">{excerpt}</div>
                    <a href="../products/{p["slug"]}.html" class="buy-btn">View Details</a>
                </div>
            </div>
"""
    html += f"""
        </div>
    </div>
    {footer_html}
</body>
</html>"""

    out_dir = os.path.join(SITE_DIR, "buy")
    os.makedirs(out_dir, exist_ok=True)

    _write_html(os.path.join(out_dir, "index.html"), html)
    print(f"Store page generated at {out_dir}/index.html")


def generate_feed(products):
    rss = Element("rss", {"version": "2.0", "xmlns:g": "http://base.google.com/ns/1.0"})
    channel = SubElement(rss, "channel")

    SubElement(channel, "title").text = "Lifetime Firehorse™Store"
    SubElement(channel, "link").text = BASE_URL
    SubElement(
        channel, "description"
    ).text = "Industrial AI and Climate Reporting Products"

    for p in products:
        item = SubElement(channel, "item")
        SubElement(item, "g:id").text = p.get("sku", "")
        SubElement(item, "g:title").text = p.get("title", "")
        SubElement(item, "g:description").text = p.get("html_content", "")[
            :5000
        ]  # Limit text
        SubElement(item, "g:link").text = f"{BASE_URL}/products/{p['slug']}.html"
        SubElement(item, "g:image_link").text = p.get(
            "image_link", f"{BASE_URL}/static/images/Firehorse_Store.jpg"
        )
        SubElement(item, "g:condition").text = p.get("condition", "new")
        SubElement(item, "g:availability").text = p.get("availability", "in_stock")
        SubElement(item, "g:price").text = f"{p['price']} {p.get('currency', 'EUR')}"
        SubElement(item, "g:brand").text = p.get("brand", "Lifetime")
        SubElement(item, "g:google_product_category").text = p.get(
            "google_product_category", "Software > Business & Productivity Software"
        )

        # Required for custom goods without GTIN
        SubElement(item, "g:identifier_exists").text = "no"

    # Format XML
    xml_str = minidom.parseString(tostring(rss)).toprettyxml(indent="  ")  # noqa: S318

    with open(OUTPUT_FEED_FILE, "w", encoding="utf-8") as f:
        f.write(xml_str)
    print(f"Feed generated at {OUTPUT_FEED_FILE}")


def main():
    # Generate Policies
    generate_policy(
        "../privacy-policy/privacy-policy_V1.md", "privacy-policy", "Privacy Policy"
    )
    generate_policy(
        "../privacy-policy/Agreement_Project_Terms.md",
        "terms",
        "Professional Services Terms",
    )

    # New Hubs & Notices
    generate_policy("../privacy-policy/Legal_Hub.md", "legal", "Legal & Compliance Hub")
    generate_policy(
        "../privacy-policy/Regulatory_Notice_Investors.md",
        "regulatory-notice",
        "Regulatory Notice for Investors",
    )
    generate_policy(
        "../privacy-policy/InvestmentSafety.md",
        "investment-safety",
        "Investment Security",
    )

    # New Terms
    generate_policy(
        "../privacy-policy/TermsofServiceforDWSIQ.md",
        "terms-dws-iq",
        "DWS IQ Terms of Service",
    )
    generate_policy(
        "../privacy-policy/TermsofServiceforFirehorse.md",
        "terms-firehorse",
        "Firehorse Terms of Service",
    )
    generate_policy(
        "../privacy-policy/TermsofServiceforLifetimeFleet.md",
        "terms-lifetime-fleet",
        "Lifetime Fleet Terms of Service",
    )
    generate_policy(
        "../privacy-policy/TermsofServiceforProfessional.md",
        "terms-professional",
        "Professional Services Terms",
    )

    generate_policy("RETURN_POLICY.md", "return-policy", "Return Policy")

    # Load products from products.json (primary source, ~30 products)
    products = load_products_json()
    seen_skus = {p["sku"] for p in products}

    # Load Store/*.md files — merge extended descriptions or add new products
    skip_files = {"RETURN_POLICY.md", "GOOGLE_MERCHANT_SETUP.md", "PRIVACY_POLICY.md"}
    if os.path.isdir(STORE_DIR):
        for filename in os.listdir(STORE_DIR):
            if (
                filename.endswith(".md")
                and filename not in skip_files
                and "GoogleLegal" not in filename
            ):
                print(f"Processing {filename}...")
                md_product = parse_product(filename)
                if not md_product:
                    continue
                sku = md_product.get("sku", "")
                if sku in seen_skus:
                    # Merge: replace html_content with richer Store/*.md version
                    for p in products:
                        if p["sku"] == sku:
                            p["html_content"] = md_product["html_content"]
                            print(f"  Merged extended description for {sku}")
                            break
                else:
                    # New product only in Store/*.md
                    products.append(md_product)
                    seen_skus.add(sku)
                    print(f"  Added new product {sku} from {filename}")

    print(f"\nTotal products: {len(products)}")

    # Generate outputs.
    # Hand-authored pages are skipped for the same reason generate_store_page()
    # is not called below: generating over them replaces a bespoke body with the
    # template. Their prices are still held to products.json afterwards.
    generated = skipped = 0
    for p in products:
        if p["slug"] in HAND_AUTHORED:
            skipped += 1
            continue
        generate_html(p)
        generated += 1
    print(f"\nProduct pages: {generated} generated, {skipped} hand-authored (skipped)")

    check_handauthored_prices(products)

    generate_feed(products)
    generate_csv(products)
    # NOTE: Do NOT call generate_store_page() here.
    # The store page (landing-pages/dws10-com/buy/index.html) is maintained
    # manually in dws10.com/buy/index.html and synced by the
    # sync-dws6-landing-pages workflow. Running generate_store_page() would
    # overwrite the hand-crafted page with hero section, 4-category nav,
    # and Revolut/PayPal payment integration.


if __name__ == "__main__":
    main()
