#!/usr/bin/env python3
"""
Generate public Green price list HTML from products.json.

Usage:
    python3 scripts/generate-green-pricelist.py

Outputs:
    Learn/green-pricelist-v{priceVersion}-{date}.html  (timestamped)
    Learn/green-pricelist-latest.html                   (static alias)

READ-ONLY CONTRACT: Reads from dws10.com/config/products.json only.
Writes only to Learn/. Never writes to any config file.
Contains NO Blue pricing, NO contractor rates — safe to share with clients.
"""

import json
import shutil
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_JSON = REPO_ROOT / "dws10.com" / "config" / "products.json"
LEARN_DIR = REPO_ROOT / "Learn"

# SKUs to include, in display order
IQ_IDS = ["DWS-IQ-006", "DWS-EU-STARTER", "DWS-EU-PILOT",
          "DWS-US-STARTER", "DWS-US-PILOT", "DWS-CLIMATE-001", "DWS-AEGIS-001"]
FH_IDS = ["FH-AUTO-001", "FH-CMS-001", "FH-RPT-001", "FH-OMNI-001"]
SUB_IDS = ["DWS-IQ-SUB-001", "FH-SUB-001"]
CONSULT_IDS = ["consulting-hourly", "ai-consultant-day", "aws-consultancy",
               "ai-agent-engineering", "m365-consultancy", "conversational-agent",
               "consulting-fit55"]
HW_IDS = ["edge-node-gn100"]


def load_json(path: Path) -> dict:
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def fmt_price(p: dict) -> str:
    price = p.get("price")
    ptype = p.get("type", "")
    unit = p.get("priceUnit") or ""
    note = p.get("priceNote", "")
    if price is None:
        return note or "Contact sales"
    if unit:
        # New labor-anchored SKUs render by priceUnit, not legacy type
        suffix_map = {
            "per-month": "/mo",
            "per-year": "/yr",
            "per-day": "/day",
            "per-outcome": "/outcome",
            "per-site-per-day": "/site/day",
            "hourly": "/hr",
            "one-time": "",
        }
        base = f"€{price:,.0f}{suffix_map.get(unit, '')}"
        return base
    if ptype == "monthly":
        base = f"€{price:,.0f}/mo"
    elif ptype == "hourly":
        base = f"€{price:,.0f}/hr"
    elif ptype == "subscription":
        period = p.get("billingPeriod", "monthly")
        base = f"€{price:,.0f}/{period}"
    elif price == 0:
        return note or "Free"
    else:
        base = f"€{price:,.0f}"
    return base


_TIER_COLOR = {
    "T0": "#94a3b8",
    "T1": "#0ea5e9",
    "T2": "#16a34a",
    "T3": "#7c3aed",
    "T4": "#dc2626",
    "land": "#ea580c",
    "meter": "#475569",
}


def tier_badge(tier: str | None) -> str:
    if not tier:
        return ""
    label = tier if tier not in ("land", "meter") else tier.capitalize()
    color = _TIER_COLOR.get(tier, "#475569")
    return (
        f'<span style="display:inline-block;background:{color};color:#fff;'
        f'font-size:0.7rem;font-weight:700;padding:2px 7px;border-radius:4px;'
        f'margin-right:6px;letter-spacing:0.05em;">{label}</span>'
    )


def replaces_line(p: dict) -> str:
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
    return (
        f'<div style="font-size:0.78rem;color:#0f766e;margin-top:4px;font-style:italic;">'
        f'Replaces {role} ≈ {fte_str} FTE{tail}.</div>'
    )


def upsell_line(p: dict) -> str:
    nxt = p.get("nextUpsellSku")
    if not nxt:
        return ""
    return (
        f'<div style="font-size:0.78rem;color:#64748b;margin-top:2px;">'
        f'Next upsell: <strong>{nxt}</strong></div>'
    )


def ver_badge(version: str | None) -> str:
    if not version:
        return ""
    return f'<br><small style="font-size:0.78rem;color:#64748b;">Stable <span style="color:#16a34a;font-weight:600;">v{version}</span> &nbsp;/&nbsp; Pilot <span style="color:#3b82f6;font-weight:600;">v{_next_ver(version)}</span></small>'


def _next_ver(v: str) -> str:
    try:
        return f"{float(v) + 0.1:.1f}"
    except ValueError:
        return v + ".1"


def build_html(products: dict, gen_date: str) -> str:
    price_ver = products.get("priceVersion", "—")
    last_updated = products.get("lastUpdated", "—")[:10]
    all_p = products.get("products", {})
    all_subs = products.get("subscriptions", {})

    CLR_GREEN_HDR = "#16a34a"
    CLR_SECTION_HDR = "#1e3a5f"
    CLR_ROW_ALT = "#f8fafc"
    CLR_BORDER = "#e2e8f0"

    def th_green(text):
        return f'<th style="background:{CLR_GREEN_HDR};color:#fff;padding:8px 12px;text-align:left;">{text}</th>'

    def th_neutral(text):
        return f'<th style="background:#475569;color:#fff;padding:8px 12px;text-align:left;">{text}</th>'

    def td(text, mono=False):
        style = "padding:7px 12px;vertical-align:top;"
        if mono:
            style += "font-family:monospace,Courier New,Courier;"
        return f'<td style="{style}">{text}</td>'

    def section_header(title):
        return (
            f'<h2 style="color:{CLR_SECTION_HDR};margin:2em 0 0.5em 0;'
            f'font-size:1.15rem;border-bottom:2px solid {CLR_SECTION_HDR};'
            f'padding-bottom:4px;">{title}</h2>'
        )

    def table_wrap(header_row, body_rows):
        return (
            f'<table style="width:100%;border-collapse:collapse;border:1px solid {CLR_BORDER};'
            f'margin-bottom:1.5em;font-size:0.9rem;">'
            f'<thead><tr>{header_row}</tr></thead>'
            f'<tbody>{"".join(body_rows)}</tbody></table>'
        )

    def row(cells, alt=False):
        bg = f'background:{CLR_ROW_ALT};' if alt else ""
        return f'<tr style="{bg}border-bottom:1px solid {CLR_BORDER};">{"".join(cells)}</tr>'

    def product_rows(ids, source, subs):
        rows = []
        idx = 0
        for pid in ids:
            p = source.get(pid) or subs.get(pid)
            if not p:
                continue
            # Green price list never shows Blue (pilot) rows
            if p.get("deploymentColor") == "blue":
                continue
            name = p.get("name", pid)
            if "_OLD" in name:
                continue
            version = p.get("version")
            tier = p.get("tier")
            note = p.get("priceNote", p.get("description", "")[:120] + ("…" if len(p.get("description", "")) > 120 else ""))
            name_cell = tier_badge(tier) + name + ver_badge(version) + replaces_line(p) + upsell_line(p)
            rows.append(row([
                td(name_cell),
                td(pid, mono=True),
                td(fmt_price(p), mono=True),
                td(note),
            ], alt=(idx % 2 == 1)))
            idx += 1
        return rows

    def labor_anchored_rows(all_products):
        """Render Green labor-anchored SKUs (anything with tier set and color=green)."""
        rows = []
        idx = 0
        # Sort by tier then sku
        items = []
        for sku, p in all_products.items():
            if not isinstance(p, dict):
                continue
            if not p.get("tier"):
                continue
            if p.get("deploymentColor") != "green":
                continue
            items.append((sku, p))
        items.sort(key=lambda kv: (kv[1].get("tier", ""), kv[0]))
        for sku, p in items:
            tier = p.get("tier")
            name = p.get("name", sku)
            note = p.get("description", "")[:140]
            name_cell = tier_badge(tier) + name + replaces_line(p) + upsell_line(p)
            rows.append(row([
                td(name_cell),
                td(sku, mono=True),
                td(fmt_price(p), mono=True),
                td(note),
            ], alt=(idx % 2 == 1)))
            idx += 1
        return rows

    hdr = th_neutral("Product / Tier / Replaces") + th_neutral("SKU") + th_green("Price (EUR, VAT excl.)") + th_neutral("Notes")

    iq_table = table_wrap(hdr, product_rows(IQ_IDS, all_p, {}))
    fh_table = table_wrap(hdr, product_rows(FH_IDS, all_p, {}))
    sub_table = table_wrap(hdr, product_rows(SUB_IDS, {}, all_subs))
    consult_table = table_wrap(hdr, product_rows(CONSULT_IDS, all_p, {}))
    hw_table = table_wrap(hdr, product_rows(HW_IDS, all_p, {}))
    labor_rows = labor_anchored_rows(all_p)
    labor_table = table_wrap(hdr, labor_rows) if labor_rows else ""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DWS Green Price List — {last_updated}</title>
<style>
  @media print {{
    body {{ font-size: 10pt; margin: 10mm; }}
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

<div style="background:#f0fdf4;border:2px solid {CLR_GREEN_HDR};
     color:#14532d;padding:10px 18px;border-radius:6px;margin-bottom:20px;
     font-weight:700;font-size:0.95rem;text-align:center;">
  DWS Official Green Price List &mdash; All prices are published stable (Green) rates
</div>

<div style="background:#ecfdf5;border-left:4px solid {CLR_GREEN_HDR};
     padding:14px 18px;border-radius:4px;margin-bottom:24px;">
  <div style="font-size:1.05rem;font-weight:700;color:#064e3b;margin-bottom:4px;">
    Price AI like labor, not like a tool.
  </div>
  <div style="font-size:0.85rem;color:#065f46;">
    Every SKU below is anchored to the human role it replaces. We do not publish
    SaaS-tool comparisons.
  </div>
</div>

<h1 style="color:{CLR_SECTION_HDR};margin:0 0 4px 0;font-size:1.5rem;">
  DWS Price List
</h1>
<div style="color:#64748b;font-size:0.88rem;margin:0 0 20px 0;line-height:1.8;">
  Generated: <strong>{gen_date}</strong><br>
  Source: products.json &nbsp;
  <strong style="color:{CLR_GREEN_HDR};">priceVersion {price_ver}</strong>
  &nbsp;&mdash;&nbsp; last updated <strong>{last_updated}</strong><br>
  Version column: <strong style="color:{CLR_GREEN_HDR};">Stable Green version</strong>
  / <strong style="color:#3b82f6;">Pilot Blue version</strong> (next release track)
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
  + Monthly subscription (Section 3) required separately — covers all Firehorse products.
</p>

{section_header("3. Monthly Subscriptions — Required on All Contracts")}
{sub_table}

{section_header("4. Consulting")}
{consult_table}

{section_header("5. Hardware")}
{hw_table}

{section_header("6. Skilled Agents Catalog (Green-ratified labor-anchored SKUs)")}
<p style="font-size:0.82rem;color:#475569;margin:-0.5em 0 0.8em 0;">
  Only SKUs explicitly ratified as Green appear here. Blue/pilot SKUs are on
  the internal pilot price list. Every row shows the human role it replaces.
</p>
{labor_table or '<p style="color:#94a3b8;font-style:italic;">No labor-anchored SKUs have been ratified Green yet — see internal pilot price list.</p>'}

<hr style="border:none;border-top:1px solid #cbd5e1;margin:2em 0 1em 0;">
<p style="font-size:0.8rem;color:#64748b;line-height:1.8;margin:0;">
  <strong>Source of truth:</strong> dws10.com/config/products.json — priceVersion {price_ver}<br>
  <strong>Regenerate:</strong> <code>python3 scripts/generate-green-pricelist.py</code><br>
  All prices EUR, VAT excl. Prices subject to change — always verify priceVersion before quoting.
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


def _check_version_guard(price_ver: str, latest_path: Path) -> None:
    """Refuse to overwrite a price list generated from a newer priceVersion."""
    if not latest_path.exists():
        return
    import re
    content = latest_path.read_text(encoding="utf-8")
    m = re.search(r"priceVersion\s+([\d.]+)", content)
    if not m:
        return
    existing_ver = m.group(1)
    if _ver_tuple(existing_ver) > _ver_tuple(price_ver):
        raise SystemExit(
            f"[generate-green-pricelist] BLOCKED: existing latest ({existing_ver}) "
            f"> products.json priceVersion ({price_ver}). "
            f"Update products.json priceVersion before regenerating."
        )


def main():
    print(f"[generate-green-pricelist] Reading {PRODUCTS_JSON}")
    products = load_json(PRODUCTS_JSON)

    price_ver = products.get("priceVersion", "1.10")
    LEARN_DIR.mkdir(parents=True, exist_ok=True)

    latest_path = LEARN_DIR / "green-pricelist-latest.html"
    _check_version_guard(price_ver, latest_path)

    now = datetime.now(timezone.utc)
    gen_date = now.strftime("%Y-%m-%d %H:%M UTC")
    date_slug = now.strftime("%Y-%m-%d")

    print("[generate-green-pricelist] Building HTML...")
    html = build_html(products=products, gen_date=gen_date)

    versioned_path = LEARN_DIR / f"green-pricelist-v{price_ver}-{date_slug}.html"

    if versioned_path.exists():
        raise SystemExit(
            f"[generate-green-pricelist] BLOCKED: {versioned_path.name} already exists. "
            f"Bump priceVersion in products.json before regenerating."
        )
    versioned_path.write_text(html, encoding="utf-8")
    print(f"[generate-green-pricelist] Written: {versioned_path}")

    shutil.copy2(versioned_path, latest_path)
    print(f"[generate-green-pricelist] Updated alias: {latest_path}")
    print("[generate-green-pricelist] Done.")


if __name__ == "__main__":
    main()
