#!/usr/bin/env python3
"""
Generate pilot customer price list HTML from Green (products.json) and
Blue (pilot-blue-prices.json) pricing sources.

Usage:
    python3 scripts/generate-pilot-pricelist.py

Outputs:
    Learn/pilot-pricelist-v1.0-YYYY-MM-DD.html  (timestamped)
    Learn/pilot-pricelist-latest.html             (static alias, overwritten each run)
"""

import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths (always relative to repo root, not cwd)
# ---------------------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_JSON = REPO_ROOT / "dws10.com" / "config" / "products.json"
BLUE_JSON = REPO_ROOT / "config" / "pilot-blue-prices.json"
LEARN_DIR = REPO_ROOT / "Learn"

VERSION = "1.0"


def fmt_eur(value, suffix=""):
    """Format a numeric value as a Euro price string."""
    if value is None:
        return "—"
    if value == 0:
        return "€0" + (f"/{suffix}" if suffix else "")
    return f"€{value:,.0f}" + (f"/{suffix}" if suffix else "")


def load_json(path: Path) -> dict:
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def build_html(products: dict, subscriptions: dict, blue: dict, gen_date: str) -> str:
    green_ver = products.get("lastUpdated", "unknown")
    blue_ver = blue.get("version", "unknown") + " / " + blue.get("lastUpdated", "unknown")
    blue_products = blue.get("products", {})

    # -----------------------------------------------------------------------
    # Colour palette
    # -----------------------------------------------------------------------
    CLR_BLUE_HDR = "#3b82f6"
    CLR_GREEN_HDR = "#16a34a"
    CLR_BANNER_BG = "#fef2f2"
    CLR_BANNER_BORDER = "#fca5a5"
    CLR_BANNER_TXT = "#991b1b"
    CLR_SECTION_HDR = "#1e3a5f"
    CLR_ROW_ALT = "#f8fafc"
    CLR_BORDER = "#e2e8f0"

    def th_green(text):
        return f'<th style="background:{CLR_GREEN_HDR};color:#fff;padding:8px 12px;text-align:left;">{text}</th>'

    def th_blue(text):
        return f'<th style="background:{CLR_BLUE_HDR};color:#fff;padding:8px 12px;text-align:left;">{text}</th>'

    def th_neutral(text):
        return f'<th style="background:#475569;color:#fff;padding:8px 12px;text-align:left;">{text}</th>'

    def td(text, mono=False, bold=False):
        style = "padding:7px 12px;vertical-align:top;"
        if mono:
            style += "font-family:monospace,Courier New,Courier;"
        if bold:
            style += "font-weight:600;"
        return f'<td style="{style}">{text}</td>'

    def section_header(title):
        return (
            f'<h2 style="color:{CLR_SECTION_HDR};margin:2em 0 0.5em 0;'
            f'font-size:1.15rem;border-bottom:2px solid {CLR_SECTION_HDR};'
            f'padding-bottom:4px;">{title}</h2>'
        )

    def table_open():
        return (
            f'<table style="width:100%;border-collapse:collapse;'
            f'border:1px solid {CLR_BORDER};margin-bottom:1.5em;font-size:0.9rem;">'
        )

    def table_close():
        return "</table>"

    def row(cells, alt=False):
        bg = f'background:{CLR_ROW_ALT};' if alt else ""
        return f'<tr style="{bg}border-bottom:1px solid {CLR_BORDER};">{"".join(cells)}</tr>'

    # -----------------------------------------------------------------------
    # Helper: look up a product's Green price string
    # -----------------------------------------------------------------------
    def green_price(pid, all_products, subs):
        p = all_products.get(pid) or subs.get(pid)
        if not p:
            return "—"
        price = p.get("price")
        ptype = p.get("type", "")
        if price is None:
            return p.get("priceNote", "—")
        if ptype in ("monthly",):
            return f"€{price:,.0f}/mo"
        if ptype in ("hourly",):
            return f"€{price:,.0f}/hr"
        if ptype == "subscription":
            period = p.get("billingPeriod", "monthly")
            return f"€{price:,.0f}/{period}"
        return f"€{price:,.0f}"

    def green_name(pid, all_products, subs):
        p = all_products.get(pid) or subs.get(pid)
        return p.get("name", pid) if p else pid

    all_p = products.get("products", {})

    # -----------------------------------------------------------------------
    # Section 1 — DWS IQ Platform
    # -----------------------------------------------------------------------
    iq_ids = ["DWS-IQ-006", "DWS-EU-STARTER", "DWS-EU-PILOT", "DWS-US-STARTER", "DWS-US-PILOT", "DWS-CLIMATE-001"]

    iq_rows = []
    for i, pid in enumerate(iq_ids):
        bp = blue_products.get(pid, {})
        bprice = bp.get("bluePrice")
        bsetup = bp.get("bluePriceSetup")
        btype = bp.get("blueType", "")
        bnote = bp.get("blueNote", "")
        max_m = bp.get("maxPilotMonths", 12)

        gp = green_price(pid, all_p, {})
        name = green_name(pid, all_p, {})

        # Compose Blue price display
        if btype == "free":
            blue_free_val = "€0/mo + €0 setup"
            blue_red_val = "—"
        else:
            monthly = fmt_eur(bprice, "mo") if bprice is not None else "—"
            setup = (f" + {fmt_eur(bsetup)} setup") if bsetup is not None and bsetup > 0 else ""
            blue_free_val = "—"
            blue_red_val = monthly + setup

        iq_rows.append(row([
            td(name),
            td(gp, mono=True),
            td(blue_free_val if btype == "free" else "—", mono=True),
            td(blue_red_val if btype == "reduced" else "—", mono=True),
            td(bnote),
            td(f"{max_m} mo"),
        ], alt=(i % 2 == 1)))

    iq_table = (
        table_open()
        + "<thead><tr>"
        + th_neutral("Product")
        + th_green("Green (List)")
        + th_blue("Blue Free")
        + th_blue("Blue Reduced")
        + th_neutral("Notes")
        + th_neutral("Max Pilot")
        + "</tr></thead><tbody>"
        + "".join(iq_rows)
        + "</tbody>"
        + table_close()
    )

    # -----------------------------------------------------------------------
    # Section 2 — Firehorse
    # -----------------------------------------------------------------------
    fh_ids = ["FH-AUTO-001", "FH-CMS-001", "FH-RPT-001", "FH-OMNI-001"]

    fh_rows = []
    for i, pid in enumerate(fh_ids):
        bp = blue_products.get(pid, {})
        bprice = bp.get("bluePrice")
        btype = bp.get("blueType", "")
        bnote = bp.get("blueNote", "")
        max_m = bp.get("maxPilotMonths", 12)

        gp = green_price(pid, all_p, {})
        name = green_name(pid, all_p, {})

        if btype == "free":
            blue_free_val = "€0"
            blue_red_val = "—"
        else:
            blue_free_val = "—"
            blue_red_val = fmt_eur(bprice)

        fh_rows.append(row([
            td(name),
            td(gp, mono=True),
            td(blue_free_val if btype == "free" else "—", mono=True),
            td(blue_red_val if btype == "reduced" else "—", mono=True),
            td(bnote),
            td(f"{max_m} mo"),
        ], alt=(i % 2 == 1)))

    fh_table = (
        table_open()
        + "<thead><tr>"
        + th_neutral("Product")
        + th_green("Green (List)")
        + th_blue("Blue Free")
        + th_blue("Blue Reduced")
        + th_neutral("Notes")
        + th_neutral("Max Pilot")
        + "</tr></thead><tbody>"
        + "".join(fh_rows)
        + "</tbody>"
        + table_close()
    )

    # -----------------------------------------------------------------------
    # Section 3 — Monthly Subscriptions
    # -----------------------------------------------------------------------
    sub_ids = ["DWS-IQ-SUB-001", "FH-SUB-001"]
    all_subs = products.get("subscriptions", {})

    sub_rows = []
    for i, pid in enumerate(sub_ids):
        bp = blue_products.get(pid, {})
        bprice = bp.get("bluePrice")
        bnote = bp.get("blueNote", "")

        gp = green_price(pid, {}, all_subs)
        name = green_name(pid, {}, all_subs)

        sub_rows.append(row([
            td(name),
            td(gp, mono=True),
            td(fmt_eur(bprice, "mo"), mono=True),
            td('<strong style="color:#b45309;">Always required — cannot be waived</strong><br>' + bnote),
        ], alt=(i % 2 == 1)))

    sub_table = (
        table_open()
        + "<thead><tr>"
        + th_neutral("Product")
        + th_green("Green (List)")
        + th_blue("Blue")
        + th_neutral("Notes")
        + "</tr></thead><tbody>"
        + "".join(sub_rows)
        + "</tbody>"
        + table_close()
    )

    # -----------------------------------------------------------------------
    # Section 4 — Consultations
    # -----------------------------------------------------------------------
    consult_ids = ["consulting-hourly", "ai-agent-engineering", "ai-consultant-day", "expert-services"]

    consult_rows = []
    for i, pid in enumerate(consult_ids):
        bp = blue_products.get(pid, {})
        bprice = bp.get("bluePrice")
        btype = bp.get("blueType", "contractor")
        bnote = bp.get("blueNote", "")

        p = all_p.get(pid, {})
        name = p.get("name", pid)
        green_val = green_price(pid, all_p, {})

        ptype = p.get("type", "")
        if bprice is not None:
            if ptype == "hourly":
                blue_val = f"€{bprice}/hr"
            elif pid == "ai-consultant-day":
                blue_val = f"€{bprice}/day"
            else:
                blue_val = fmt_eur(bprice)
        else:
            blue_val = "—"

        consult_rows.append(row([
            td(name),
            td(green_val, mono=True),
            td(blue_val, mono=True),
            td(bnote),
        ], alt=(i % 2 == 1)))

    consult_table = (
        table_open()
        + "<thead><tr>"
        + th_neutral("Service")
        + th_green("Green (Client Rate)")
        + th_blue("Blue (Contractor Floor)")
        + th_neutral("Notes")
        + "</tr></thead><tbody>"
        + "".join(consult_rows)
        + "</tbody>"
        + table_close()
    )

    # -----------------------------------------------------------------------
    # Section 5 — Hardware
    # -----------------------------------------------------------------------
    hw_ids = ["edge-node-gn100"]

    hw_rows = []
    for i, pid in enumerate(hw_ids):
        bp = blue_products.get(pid, {})
        btype = bp.get("blueType", "procurement")
        bnote = bp.get("blueNote", "")

        p = all_p.get(pid, {})
        name = p.get("name", pid)
        green_val = green_price(pid, all_p, {})

        blue_val = "Contact procurement" if btype == "procurement" else "—"

        hw_rows.append(row([
            td(name),
            td(green_val, mono=True),
            td(blue_val),
            td('<em>Blue = buy-in price — contact procurement for current landed cost before quoting.</em><br>' + bnote),
        ], alt=(i % 2 == 1)))

    hw_table = (
        table_open()
        + "<thead><tr>"
        + th_neutral("Product")
        + th_green("Green (Retail)")
        + th_blue("Blue")
        + th_neutral("Notes")
        + "</tr></thead><tbody>"
        + "".join(hw_rows)
        + "</tbody>"
        + table_close()
    )

    # -----------------------------------------------------------------------
    # Assemble full HTML
    # -----------------------------------------------------------------------
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DWS Pilot Customer Price List — Sales Negotiation Guide</title>
<style>
  @media print {{
    body {{ font-size: 10pt; margin: 10mm; }}
    .no-print {{ display: none; }}
    table {{ page-break-inside: avoid; }}
    h2 {{ page-break-before: auto; }}
  }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px 20px;
    color: #1e293b;
    background: #fff;
    line-height: 1.5;
  }}
  table td, table th {{ border: 1px solid #e2e8f0; }}
</style>
</head>
<body>

<!-- INTERNAL ONLY BANNER -->
<div style="background:{CLR_BANNER_BG};border:2px solid {CLR_BANNER_BORDER};
     color:{CLR_BANNER_TXT};padding:12px 18px;border-radius:6px;margin-bottom:20px;
     font-weight:700;font-size:1rem;text-align:center;">
  &#9888;&#65039; INTERNAL ONLY &mdash; NOT FOR DISTRIBUTION TO CLIENTS &#9888;&#65039;
</div>

<h1 style="color:{CLR_SECTION_HDR};margin:0 0 4px 0;font-size:1.5rem;">
  DWS Pilot Customer Price List &mdash; Sales Negotiation Guide
</h1>
<p style="color:#64748b;margin:0 0 16px 0;font-size:0.9rem;">
  Generated: {gen_date} &nbsp;|&nbsp;
  products.json: {green_ver} &nbsp;|&nbsp;
  pilot-blue-prices.json v{blue_ver}
</p>

<div style="background:#eff6ff;border-left:4px solid {CLR_BLUE_HDR};
     padding:10px 14px;margin-bottom:24px;font-size:0.88rem;color:#1e40af;">
  <strong>Blue vs Green:</strong>
  <strong style="color:{CLR_GREEN_HDR};">Green</strong> is the published list price visible to all customers on dws10.com.
  <strong style="color:{CLR_BLUE_HDR};">Blue</strong> is an internal pilot price used only in direct enterprise negotiations &mdash;
  never published, never shown in quotes unless the account lead has approved the tier.
  Blue Free = €0 during pilot period. Blue Reduced = discounted rate, typically ~50% of Green.
  Blue Contractor = internal floor rate for consulting engagements.
</div>

{section_header("1. DWS IQ Platform")}
{iq_table}

{section_header("2. Firehorse")}
{fh_table}

{section_header("3. Monthly Subscriptions")}
<p style="font-size:0.85rem;color:#b45309;margin:0 0 8px 0;">
  Monthly subscriptions are <strong>always required</strong> even during Blue pilot periods. They may not be waived.
</p>
{sub_table}

{section_header("4. Consultations")}
<p style="font-size:0.85rem;color:#475569;margin:0 0 8px 0;">
  Blue rates are contractor floor rates. Never publish or share externally.
  Multi-day bookings preferred &mdash; single-hour Blue rates require account lead approval.
</p>
{consult_table}

{section_header("5. Hardware")}
<p style="font-size:0.85rem;color:#475569;margin:0 0 8px 0;">
  Blue price is the internal buy-in cost. Always contact procurement for current landed cost before quoting.
</p>
{hw_table}

<!-- Footer -->
<hr style="border:none;border-top:1px solid #cbd5e1;margin:2em 0 1em 0;">
<p style="font-size:0.8rem;color:#64748b;line-height:1.8;margin:0;">
  <strong>Source:</strong> dws10.com/config/products.json + config/pilot-blue-prices.json<br>
  <strong>Regenerate:</strong> <code>python3 scripts/generate-pilot-pricelist.py</code><br>
  <strong>All prices EUR, VAT excl.</strong><br>
  Blue prices are negotiation starting points. <strong>Final terms require CEO or account lead sign-off.</strong>
</p>

</body>
</html>"""

    return html


def main():
    print(f"[generate-pilot-pricelist] Reading {PRODUCTS_JSON}")
    products = load_json(PRODUCTS_JSON)

    print(f"[generate-pilot-pricelist] Reading {BLUE_JSON}")
    blue = load_json(BLUE_JSON)

    LEARN_DIR.mkdir(parents=True, exist_ok=True)

    now = datetime.now(timezone.utc)
    gen_date = now.strftime("%Y-%m-%d %H:%M UTC")
    date_slug = now.strftime("%Y-%m-%d")

    print(f"[generate-pilot-pricelist] Building HTML...")
    html = build_html(
        products=products,
        subscriptions=products.get("subscriptions", {}),
        blue=blue,
        gen_date=gen_date,
    )

    versioned_name = f"pilot-pricelist-v{blue.get('version', '1.0')}-{date_slug}.html"
    versioned_path = LEARN_DIR / versioned_name
    latest_path = LEARN_DIR / "pilot-pricelist-latest.html"

    versioned_path.write_text(html, encoding="utf-8")
    print(f"[generate-pilot-pricelist] Written: {versioned_path}")

    shutil.copy2(versioned_path, latest_path)
    print(f"[generate-pilot-pricelist] Updated alias: {latest_path}")
    print("[generate-pilot-pricelist] Done.")


if __name__ == "__main__":
    main()
