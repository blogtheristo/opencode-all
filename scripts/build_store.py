import csv
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
OUTPUT_HTML_DIR = "landing-pages/dws10-com/products"
OUTPUT_FEED_FILE = "landing-pages/dws10-com/products.xml"
BASE_URL = "https://dws10.com"

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


def generate_html(product):
    # Simple template for product page
    footer_html = get_footer()
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{product["title"]} | Lifetime Firehorse™Store</title>
    <link rel="stylesheet" href="../static/css/style.css">
    <style>
        body {{ font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; margin: 0; padding: 0; display: flex; flex-direction: column; min-height: 100vh; }}
        .container {{ max-width: 800px; margin: 40px auto; background: rgba(30, 41, 59, 0.5); padding: 40px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); flex-grow: 1; }}
        h1 {{ color: #60a5fa; }}
        .price {{ font-size: 2rem; color: #4ade80; font-weight: bold; margin-bottom: 20px; }}
        a.buy-btn {{ display: inline-block; background: #2563eb; color: white; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 20px; }}
        a.back-link {{ color: #94a3b8; text-decoration: none; display: block; margin-bottom: 20px; }}

        .nav-header {{ background: #1e293b; padding: 20px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }}
        .nav-brand {{ font-size: 1.5rem; font-weight: bold; color: white; text-decoration: none; display: flex; align-items: center; gap: 10px; }}
        .nav-links {{ display: flex; gap: 20px; }}
        .nav-links a {{ color: #cbd5e1; text-decoration: none; font-weight: 500; transition: color 0.2s; }}
        .nav-links a:hover {{ color: #60a5fa; }}
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
        <div class="price">€{product["price"]}</div>
        <div class="content">
            {product["html_content"]}
        </div>
        <a href="https://dws10.com/contact/?subject=Order Inquiry: {product["title"]} ({product["sku"]})" class="buy-btn">Contact Sales to Order</a>
    </div>
    {footer_html}
</body>
</html>"""

    with open(
        os.path.join(OUTPUT_HTML_DIR, f"{product['slug']}.html"), "w", encoding="utf-8"
    ) as f:
        f.write(html)


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
    out_dir = os.path.join("landing-pages/dws10-com", output_subdir)
    os.makedirs(out_dir, exist_ok=True)

    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Generated {out_dir}/index.html")


def generate_csv(products):
    filename = "landing-pages/dws10-com/products.csv"
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

    out_dir = os.path.join("landing-pages/dws10-com", "buy")
    os.makedirs(out_dir, exist_ok=True)

    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
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

    # Generate outputs
    for p in products:
        generate_html(p)
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
