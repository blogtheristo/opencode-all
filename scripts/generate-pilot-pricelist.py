#!/usr/bin/env python3
"""
Generate pilot customer price list HTML from Green (products.json) and
Blue (pilot-blue-prices.json) pricing sources.

Usage:
    python3 scripts/generate-pilot-pricelist.py

Outputs:
    Learn/pilot-pricelist-v{version}-{date}.html  (timestamped)
    Learn/pilot-pricelist-latest.html              (static alias, overwritten each run)

READ-ONLY CONTRACT: This script reads from config files and writes only to Learn/.
It must NEVER write to products.json, pilot-blue-prices.json, or any other config.
"""

import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_JSON = REPO_ROOT / "dws10.com" / "config" / "products.json"
BLUE_JSON = REPO_ROOT / "config" / "pilot-blue-prices.json"
LEARN_DIR = REPO_ROOT / "Learn"


def fmt_eur(value, suffix=""):
    if value is None:
        return "—"
    if value == 0:
        return "€0" + (f"/{suffix}" if suffix else "")
    return f"€{value:,.0f}" + (f"/{suffix}" if suffix else "")


def load_json(path: Path) -> dict:
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def ver_badge(green_ver, blue_ver):
    """Return an HTML version badge: Green v6 / Blue v6.1"""
    g = f'<span style="color:#16a34a;font-weight:600;">v{green_ver}</span>' if green_ver else ""
    b = f'<span style="color:#3b82f6;font-weight:600;">v{blue_ver}</span>' if blue_ver else ""
    if g and b:
        return f'<br><small style="font-size:0.78rem;color:#64748b;">Green {g} &nbsp;/&nbsp; Blue {b}</small>'
    if g:
        return f'<br><small style="font-size:0.78rem;color:#64748b;">Green {g}</small>'
    return ""


def build_html(products: dict, blue: dict, gen_date: str) -> str:
    price_ver = products.get("priceVersion", "—")
    last_updated = products.get("lastUpdated", "—")[:10]
    blue_ver = blue.get("version", "—")
    blue_updated = blue.get("lastUpdated", "—")[:10]
    blue_products = blue.get("products", {})
    all_p = products.get("products", {})
    all_subs = products.get("subscriptions", {})

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

    _TIER_COLOR = {
        "T0": "#94a3b8", "T1": "#0ea5e9", "T2": "#16a34a",
        "T3": "#7c3aed", "T4": "#dc2626", "land": "#ea580c",
        "meter": "#475569",
    }

    def tier_badge(tier):
        if not tier:
            return ""
        label = tier if tier not in ("land", "meter") else tier.capitalize()
        color = _TIER_COLOR.get(tier, "#475569")
        return (
            f'<span style="display:inline-block;background:{color};color:#fff;'
            f'font-size:0.7rem;font-weight:700;padding:2px 7px;border-radius:4px;'
            f'margin-right:6px;letter-spacing:0.05em;">{label}</span>'
        )

    def replaces_text(p):
        r = p.get("replaces")
        if not r or not isinstance(r, dict):
            return ""
        role = r.get("role", "human role")
        fte = r.get("fteCount")
        cost = r.get("fullyLoadedAnnualCostEUR")
        pct = None
        price = p.get("price") or 0
        unit = p.get("priceUnit") or ""
        if cost and price:
            annual = price * 12 if unit == "per-month" else price if unit == "per-year" else None
            if annual:
                try:
                    pct = round((annual / cost) * 100)
                except ZeroDivisionError:
                    pct = None
        tail = f" at ~{pct}% of fully loaded cost" if pct is not None else ""
        fte_str = f"{fte:g}" if fte is not None else "?"
        return f"Replaces {role} ≈ {fte_str} FTE{tail}."

    def fmt_unit(p):
        suffix_map = {
            "per-month": "/mo",
            "per-year": "/yr",
            "per-day": "/day",
            "per-outcome": "/outcome",
            "per-site-per-day": "/site/day",
            "hourly": "/hr",
            "one-time": "",
        }
        unit = p.get("priceUnit") or ""
        price = p.get("price")
        if price is None:
            return p.get("priceNote", "—")
        return f"€{price:,.0f}{suffix_map.get(unit, '')}"

    def green_price_str(pid, source, subs):
        p = source.get(pid) or subs.get(pid)
        if not p:
            return "—"
        price = p.get("price")
        ptype = p.get("type", "")
        if price is None:
            return p.get("priceNote", "—")
        if ptype == "monthly":
            return f"€{price:,.0f}/mo"
        if ptype == "hourly":
            return f"€{price:,.0f}/hr"
        if ptype == "subscription":
            period = p.get("billingPeriod", "monthly")
            return f"€{price:,.0f}/{period}"
        return f"€{price:,.0f}"

    def product_name_cell(pid, source, subs, bp):
        p = source.get(pid) or subs.get(pid)
        name = p.get("name", pid) if p else pid
        gv = p.get("version") if p else None
        bv = bp.get("blueVersion")
        return name + ver_badge(gv, bv)

    # ── Section 1: DWS IQ Platform ──────────────────────────────────────────
    iq_ids = ["DWS-IQ-006", "DWS-EU-STARTER", "DWS-EU-PILOT",
              "DWS-US-STARTER", "DWS-US-PILOT", "DWS-CLIMATE-001"]

    iq_rows = []
    for i, pid in enumerate(iq_ids):
        bp = blue_products.get(pid, {})
        bprice = bp.get("bluePrice")
        bsetup = bp.get("bluePriceSetup")
        btype = bp.get("blueType", "")
        bnote = bp.get("blueNote", "")
        max_m = bp.get("maxPilotMonths", 12)

        p = all_p.get(pid, {})
        gp = green_price_str(pid, all_p, {})
        ptype = p.get("type", "")
        name_cell = product_name_cell(pid, all_p, {}, bp)

        if btype == "free":
            blue_free_val = "€0" if ptype == "one-time" else "€0/mo"
            blue_red_val = "—"
        else:
            blue_free_val = "—"
            monthly = fmt_eur(bprice, "mo") if ptype not in ("one-time",) else fmt_eur(bprice)
            setup = (f" + {fmt_eur(bsetup)} setup") if bsetup else ""
            blue_red_val = monthly + setup

        iq_rows.append(row([
            td(name_cell),
            td(gp, mono=True),
            td(blue_free_val, mono=True),
            td(blue_red_val, mono=True),
            td(bnote),
            td(f"{max_m} mo"),
        ], alt=(i % 2 == 1)))

    iq_table = (
        table_open()
        + "<thead><tr>"
        + th_neutral("Product / Version")
        + th_green("Green (List)")
        + th_blue("Blue Free")
        + th_blue("Blue Reduced")
        + th_neutral("Notes")
        + th_neutral("Max Pilot")
        + "</tr></thead><tbody>"
        + "".join(iq_rows)
        + "</tbody>" + table_close()
    )

    # ── Section 2: Firehorse ─────────────────────────────────────────────────
    fh_ids = ["FH-AUTO-001", "FH-CMS-001", "FH-RPT-001", "FH-OMNI-001"]

    fh_rows = []
    for i, pid in enumerate(fh_ids):
        bp = blue_products.get(pid, {})
        bprice = bp.get("bluePrice")
        btype = bp.get("blueType", "")
        bnote = bp.get("blueNote", "")
        max_m = bp.get("maxPilotMonths", 12)

        gp = green_price_str(pid, all_p, {})
        name_cell = product_name_cell(pid, all_p, {}, bp)

        blue_free_val = "€0" if btype == "free" else "—"
        blue_red_val = fmt_eur(bprice) if btype == "reduced" else "—"

        fh_rows.append(row([
            td(name_cell),
            td(gp, mono=True),
            td(blue_free_val, mono=True),
            td(blue_red_val, mono=True),
            td(bnote),
            td(f"{max_m} mo"),
        ], alt=(i % 2 == 1)))

    fh_table = (
        table_open()
        + "<thead><tr>"
        + th_neutral("Product / Version")
        + th_green("Green (List)")
        + th_blue("Blue Free")
        + th_blue("Blue Reduced")
        + th_neutral("Notes")
        + th_neutral("Max Pilot")
        + "</tr></thead><tbody>"
        + "".join(fh_rows)
        + "</tbody>" + table_close()
    )

    # ── Section 3: Subscriptions ─────────────────────────────────────────────
    sub_ids = ["DWS-IQ-SUB-001", "FH-SUB-001"]

    sub_rows = []
    for i, pid in enumerate(sub_ids):
        bp = blue_products.get(pid, {})
        bprice = bp.get("bluePrice")
        bnote = bp.get("blueNote", "")

        gp = green_price_str(pid, {}, all_subs)
        name_cell = product_name_cell(pid, {}, all_subs, bp)

        sub_rows.append(row([
            td(name_cell),
            td(gp, mono=True),
            td(fmt_eur(bprice, "mo"), mono=True),
            td('<strong style="color:#b45309;">Always required — cannot be waived</strong><br>' + bnote),
        ], alt=(i % 2 == 1)))

    sub_table = (
        table_open()
        + "<thead><tr>"
        + th_neutral("Product / Version")
        + th_green("Green (List)")
        + th_blue("Blue")
        + th_neutral("Notes")
        + "</tr></thead><tbody>"
        + "".join(sub_rows)
        + "</tbody>" + table_close()
    )

    # ── Section 5: Labor-Anchored Skilled Agents Catalog (Blue/pilot) ────────
    labor_blue = []
    for sku, p in all_p.items():
        if not isinstance(p, dict):
            continue
        if p.get("deploymentColor") != "blue":
            continue
        if not p.get("tier"):
            continue
        labor_blue.append((sku, p))

    # Sort by tier then SKU
    _tier_rank = {"T0": 0, "T1": 1, "T2": 2, "T3": 3, "T4": 4, "land": 5, "meter": 6}
    labor_blue.sort(key=lambda kv: (_tier_rank.get(kv[1].get("tier", ""), 99), kv[0]))

    labor_rows = []
    for i, (sku, p) in enumerate(labor_blue):
        tier = p.get("tier")
        name_cell = tier_badge(tier) + p.get("name", sku)
        replaces = replaces_text(p)
        nxt = p.get("nextUpsellSku") or "—"
        agents = ", ".join(p.get("agents", [])) or "—"
        labor_rows.append(row([
            td(name_cell),
            td(sku, mono=True),
            td(fmt_unit(p), mono=True),
            td(replaces),
            td(nxt, mono=True),
            td(agents),
        ], alt=(i % 2 == 1)))

    labor_table = (
        table_open()
        + "<thead><tr>"
        + th_neutral("Product / Tier")
        + th_neutral("SKU")
        + th_blue("Blue Price")
        + th_neutral("Labor Anchor")
        + th_neutral("Next Upsell")
        + th_neutral("Agents")
        + "</tr></thead><tbody>"
        + "".join(labor_rows)
        + "</tbody>" + table_close()
    )

    # ── Section 4: Hardware ──────────────────────────────────────────────────
    hw_ids = ["edge-node-gn100"]

    hw_rows = []
    for i, pid in enumerate(hw_ids):
        bp = blue_products.get(pid, {})
        btype = bp.get("blueType", "procurement")
        bnote = bp.get("blueNote", "")

        p = all_p.get(pid, {})
        green_val = green_price_str(pid, all_p, {})
        name_cell = product_name_cell(pid, all_p, {}, bp)
        blue_val = "Contact procurement" if btype == "procurement" else "—"

        hw_rows.append(row([
            td(name_cell),
            td(green_val, mono=True),
            td(blue_val),
            td('<em>Blue = buy-in price — contact procurement before quoting.</em><br>' + bnote),
        ], alt=(i % 2 == 1)))

    hw_table = (
        table_open()
        + "<thead><tr>"
        + th_neutral("Product / Version")
        + th_green("Green (Retail)")
        + th_blue("Blue")
        + th_neutral("Notes")
        + "</tr></thead><tbody>"
        + "".join(hw_rows)
        + "</tbody>" + table_close()
    )

    # ── Assemble ─────────────────────────────────────────────────────────────
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,nofollow">
<title>DWS Pilot Price List — Internal Sales Negotiation</title>
<style>
  @media print {{
    body {{ font-size: 10pt; margin: 10mm; }}
    .no-print {{ display: none; }}
    table {{ page-break-inside: avoid; }}
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

<div style="background:{CLR_BANNER_BG};border:2px solid {CLR_BANNER_BORDER};
     color:{CLR_BANNER_TXT};padding:12px 18px;border-radius:6px;margin-bottom:20px;
     font-weight:700;font-size:1rem;text-align:center;">
  &#9888; INTERNAL ONLY &mdash; NOT FOR DISTRIBUTION TO CLIENTS &#9888;
</div>

<h1 style="color:{CLR_SECTION_HDR};margin:0 0 4px 0;font-size:1.5rem;">
  DWS Pilot Price List &mdash; Sales Negotiation Guide
</h1>
<div style="color:#64748b;font-size:0.88rem;margin:0 0 6px 0;line-height:1.8;">
  Generated: <strong>{gen_date}</strong><br>
  Green price source: products.json &nbsp;
  <strong style="color:{CLR_GREEN_HDR};">priceVersion {price_ver}</strong>
  &nbsp;last updated <strong>{last_updated}</strong><br>
  Blue price source: pilot-blue-prices.json &nbsp;
  <strong style="color:{CLR_BLUE_HDR};">v{blue_ver}</strong>
  &nbsp;last updated <strong>{blue_updated}</strong>
</div>

<div style="background:#eff6ff;border-left:4px solid {CLR_BLUE_HDR};
     padding:10px 14px;margin:16px 0 24px 0;font-size:0.88rem;color:#1e40af;">
  <strong>Blue vs Green:</strong>
  <strong style="color:{CLR_GREEN_HDR};">Green</strong> = published list price on dws10.com. &nbsp;
  <strong style="color:{CLR_BLUE_HDR};">Blue</strong> = internal pilot price for direct enterprise negotiation only — never published.
  Version column shows <strong style="color:{CLR_GREEN_HDR};">stable Green version</strong>
  / <strong style="color:{CLR_BLUE_HDR};">pilot Blue version</strong>.
</div>

{section_header("1. DWS IQ Platform")}
{iq_table}
<p style="font-size:0.82rem;color:#b45309;background:#fffbeb;border:1px solid #fcd34d;
   padding:6px 12px;border-radius:4px;margin:-1em 0 1.5em 0;">
  + Monthly subscription (Section 3) required separately on every contract.
</p>

{section_header("2. Firehorse")}
{fh_table}
<p style="font-size:0.82rem;color:#b45309;background:#fffbeb;border:1px solid #fcd34d;
   padding:6px 12px;border-radius:4px;margin:-1em 0 1.5em 0;">
  + Monthly subscription (Section 3) required separately — one subscription covers all Firehorse products.
</p>

{section_header("3. Monthly Subscriptions — Required on All Contracts")}
<p style="font-size:0.85rem;color:#b45309;margin:0 0 8px 0;">
  Cannot be waived. Blue pilot reduces the product price, not the subscription.
</p>
{sub_table}

{section_header("4. Hardware")}
{hw_table}

{section_header("5. Labor-Anchored Skilled Agents Catalog (Blue/pilot)")}
<p style="font-size:0.82rem;color:#1e40af;margin:0 0 8px 0;">
  Every row is anchored to the human role it replaces. Tier badges:
  T0 Pilot · T1 Starter · T2 Pro · T3 Function · T4 Workforce · Land · Meter.
  All rows are <strong>Blue/pilot</strong> until Risto signs them Green.
</p>
{labor_table}

<div style="background:#fef2f2;border:1px solid #fca5a5;padding:10px 14px;
     border-radius:4px;font-size:0.82rem;color:#991b1b;margin-top:1em;">
  <strong>Consultation contractor rates are held separately.</strong>
  Not part of this list. Contact account lead for internal floor rates.
</div>

<hr style="border:none;border-top:1px solid #cbd5e1;margin:2em 0 1em 0;">
<p style="font-size:0.8rem;color:#64748b;line-height:1.8;margin:0;">
  <strong>Source:</strong> dws10.com/config/products.json (priceVersion {price_ver}) + config/pilot-blue-prices.json (v{blue_ver})<br>
  <strong>Regenerate:</strong> <code>python3 scripts/generate-pilot-pricelist.py</code><br>
  <strong>All prices EUR, VAT excl. &nbsp;|&nbsp; Final terms require CEO or account lead sign-off.</strong>
</p>

</body>
</html>"""

    return html


def _ver_tuple(v: str) -> tuple:
    """Convert version string to comparable tuple: '1.10' → (1, 10), '1.9' → (1, 9)."""
    try:
        return tuple(int(x) for x in v.split("."))
    except (ValueError, TypeError):
        return (0,)


def _check_version_guard(price_ver: str, blue_ver: str, latest_path: Path) -> None:
    """Refuse to overwrite a price list generated from a newer priceVersion or blue version."""
    if not latest_path.exists():
        return
    import re
    content = latest_path.read_text(encoding="utf-8")
    m_green = re.search(r"priceVersion\s+([\d.]+)", content)
    m_blue = re.search(r"pilot-blue-prices\.json.*?v([\d.]+)", content)
    if m_green and _ver_tuple(m_green.group(1)) > _ver_tuple(price_ver):
        raise SystemExit(
            f"[generate-pilot-pricelist] BLOCKED: existing Green priceVersion "
            f"({m_green.group(1)}) > products.json ({price_ver}). "
            f"Bump priceVersion in products.json before regenerating."
        )
    if m_blue and _ver_tuple(m_blue.group(1)) > _ver_tuple(blue_ver):
        raise SystemExit(
            f"[generate-pilot-pricelist] BLOCKED: existing Blue version "
            f"({m_blue.group(1)}) > pilot-blue-prices.json ({blue_ver}). "
            f"Bump version in pilot-blue-prices.json before regenerating."
        )


def main():
    print(f"[generate-pilot-pricelist] Reading {PRODUCTS_JSON}")
    products = load_json(PRODUCTS_JSON)

    print(f"[generate-pilot-pricelist] Reading {BLUE_JSON}")
    blue = load_json(BLUE_JSON)

    LEARN_DIR.mkdir(parents=True, exist_ok=True)

    latest_path = LEARN_DIR / "pilot-pricelist-latest.html"
    _check_version_guard(
        products.get("priceVersion", "0"),
        blue.get("version", "0"),
        latest_path,
    )

    now = datetime.now(timezone.utc)
    gen_date = now.strftime("%Y-%m-%d %H:%M UTC")
    date_slug = now.strftime("%Y-%m-%d")

    print("[generate-pilot-pricelist] Building HTML...")
    html = build_html(products=products, blue=blue, gen_date=gen_date)

    version = blue.get("version", "1.0")
    versioned_path = LEARN_DIR / f"pilot-pricelist-v{version}-{date_slug}.html"
    latest_path = LEARN_DIR / "pilot-pricelist-latest.html"

    if versioned_path.exists():
        raise SystemExit(
            f"[generate-pilot-pricelist] BLOCKED: {versioned_path.name} already exists. "
            f"Bump version in pilot-blue-prices.json before regenerating."
        )
    versioned_path.write_text(html, encoding="utf-8")
    print(f"[generate-pilot-pricelist] Written: {versioned_path}")

    shutil.copy2(versioned_path, latest_path)
    print(f"[generate-pilot-pricelist] Updated alias: {latest_path}")
    print("[generate-pilot-pricelist] Done.")


if __name__ == "__main__":
    main()
