#!/usr/bin/env python3
"""
build_playbooks.py — render /docs/playbooks/src/<slug>.md → PDF (WeasyPrint).

Inputs:  docs/playbooks/src/<slug>.md   (DWS Document Standard, *** delimiters)
Outputs: dws10.com/playbooks/pdf/<slug>-en.pdf
         landing-pages/dws10-com/playbooks/pdf/<slug>-en.pdf  (mirror)

Usage:
    python scripts/build_playbooks.py              # build all slugs in src/
    python scripts/build_playbooks.py defence      # build one slug

EU-friendly: WeasyPrint only; no third-party SaaS.
"""
from __future__ import annotations

import base64
import io
import re
import sys
from datetime import date
from pathlib import Path

import markdown  # type: ignore
import yaml  # type: ignore
from PIL import Image, ImageDraw  # type: ignore
from weasyprint import HTML  # type: ignore

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "playbooks" / "src"
TARGETS = [
    ROOT / "dws10.com" / "playbooks" / "pdf",
    ROOT / "landing-pages" / "dws10-com" / "playbooks" / "pdf",
]
AEGIS_LOGO = ROOT / "kb" / "raw" / "images" / "products" / "firehorse-aegis-clean.png"
AEGIS_HEAD = ROOT / "dws10.com" / "static" / "images" / "firehorse-aegis-head.png"
PAGE_BADGE_SRC = ROOT / "kb" / "raw" / "images" / "products" / "firehorse-aegis-eu-sovereign.png"
PAGE_BADGE_MM = 22.0  # printed badge size in mm, every page top-right


def page_badge_data_url(path: Path, mm: float = 22.0, dpi: int = 300) -> str:
    """Crop the round EU-Sovereign-by-Design badge out of the rectangular
    source image (center square — the badge sits centred in the wider
    canvas), resize for print resolution, return as base64 PNG."""
    if not path.exists():
        return ""
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    img = img.crop((left, top, left + side, top + side))
    target_px = int(mm / 25.4 * dpi) * 2  # 2× for retina-quality print
    img.thumbnail((target_px, target_px), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/png;base64,{b64}"


def thumb_as_data_url(path: Path, max_px: int = 480) -> str:
    """Thumbnail an image preserving aspect ratio + alpha, return as base64
    PNG data URL."""
    if not path.exists():
        return ""
    img = Image.open(path).convert("RGBA")
    img.thumbnail((max_px, max_px), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/png;base64,{b64}"


def aegis_circular_badge(
    logo_path: Path,
    badge_px: int = 480,
    ring_color: tuple = (0xd4, 0xa8, 0x43, 0xff),
    ring_width_px: int = 14,
) -> str:
    """Composite the Aegis logo onto a circular badge: white-filled circle
    with a gold ring, logo (RGBA) centered inside. Returns base64 PNG of
    the finished square image. WeasyPrint just renders it as an image —
    no CSS clipping required, so the badge is guaranteed clean and round."""
    if not logo_path.exists():
        return ""
    canvas = Image.new("RGBA", (badge_px, badge_px), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((0, 0, badge_px - 1, badge_px - 1), fill=(255, 255, 255, 255))

    inner_pad = int(badge_px * 0.12)
    inner_w = badge_px - 2 * inner_pad
    inner_h = inner_w

    logo = Image.open(logo_path).convert("RGBA")
    logo.thumbnail((inner_w, inner_h), Image.LANCZOS)
    paste_x = (badge_px - logo.width) // 2
    paste_y = (badge_px - logo.height) // 2
    canvas.alpha_composite(logo, dest=(paste_x, paste_y))

    draw.ellipse(
        (0, 0, badge_px - 1, badge_px - 1),
        outline=ring_color,
        width=ring_width_px,
    )

    buf = io.BytesIO()
    canvas.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/png;base64,{b64}"

# DWS brand palette (DWS_BRAND_STANDARD).
GOLD = "#d4a843"
EU_BLUE = "#003399"
NVIDIA_GREEN = "#76B900"

_PAGE_BADGE_DATA = page_badge_data_url(PAGE_BADGE_SRC, mm=PAGE_BADGE_MM, dpi=300)

CSS = f"""
/* Hybrid style: Nokia info-design discipline + DWS palette (gold + EU blue +
   NVIDIA green accents). Conservative whitespace, info-dense tables, vendor
   block + reference number in cover and footer. Inter is the open substitute
   for Nokia Pure; falls back to Helvetica.
   Every page (including cover) carries the EU-Sovereign-by-Design badge in
   the top-right corner via @top-right margin box; no other logos. */
@page {{
  size: A4;
  margin: 30mm 20mm 22mm 20mm;
  @top-right {{
    content: "";
    background-image: url("{_PAGE_BADGE_DATA}");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: right top;
    width: {PAGE_BADGE_MM}mm;
    height: {PAGE_BADGE_MM}mm;
    margin: 4mm 0 0 0;
  }}
  @bottom-left {{
    content: string(docref);
    font-family: "Inter", "Helvetica", "Arial", sans-serif;
    font-size: 8pt;
    color: #666;
  }}
  @bottom-center {{
    content: string(industry);
    font-family: "Inter", "Helvetica", "Arial", sans-serif;
    font-size: 8pt;
    color: #666;
  }}
  @bottom-right {{
    content: "Page " counter(page) " / " counter(pages);
    font-family: "Inter", "Helvetica", "Arial", sans-serif;
    font-size: 8pt;
    color: #666;
  }}
}}
html, body {{
  font-family: "Inter", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  font-size: 10pt;
  line-height: 1.48;
  color: #111;
}}
h1 {{
  color: {EU_BLUE};
  border-bottom: 2px solid {GOLD};
  padding-bottom: 4px;
  font-size: 20pt;
  margin: 8pt 0 4pt 0;
  font-weight: 700;
  letter-spacing: -0.01em;
}}
h2 {{
  color: {EU_BLUE};
  font-size: 13pt;
  margin-top: 20pt;
  margin-bottom: 4pt;
  padding-bottom: 2px;
  border-bottom: 1px solid #ddd;
  font-weight: 600;
}}
h3 {{
  color: #222;
  font-size: 11pt;
  margin-top: 12pt;
  margin-bottom: 2pt;
  font-weight: 600;
}}
p {{ margin: 0 0 8pt 0; }}
ul, ol {{ margin: 0 0 10pt 0; padding-left: 18pt; }}
li {{ margin-bottom: 3pt; }}

/* ============================================================
 * COVER — visual front page. Uses the default @page geometry so the
 * top-right EU-Sovereign badge is consistent with every other page.
 * Visual identity comes from typography, framework chips, and an
 * EU-blue accent rule above the title — no full-bleed strips, no
 * second logo. (User: "ei muita logoja".)
 * ============================================================ */
.cover {{
  string-set: industry attr(data-industry) " · DWS Sovereign Playbook";
  page-break-after: always;
  padding: 0;
}}
.cover-body {{
  padding: 0;
  position: relative;
}}
.cover-row {{ display: block; margin-bottom: 8pt; }}
.cover-left {{ display: block; }}
.cover-num {{
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 11pt;
  color: {GOLD};
  font-weight: 700;
  letter-spacing: 0.12em;
  margin: 0 0 4pt 0;
  text-transform: uppercase;
}}
.cover .industry {{
  font-size: 38pt;
  font-weight: 700;
  color: {EU_BLUE};
  margin: 0;
  line-height: 1.02;
  letter-spacing: -0.02em;
}}
.cover .subtitle {{
  font-size: 11pt;
  color: #333;
  margin: 6pt 0 0 0;
  letter-spacing: 0.01em;
}}
.cover-rule {{
  height: 3pt;
  background: {GOLD};
  width: 60mm;
  margin: 14pt 0 14pt 0;
  border-radius: 1pt;
}}
.cover .docref {{
  string-set: docref content();
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 9.5pt;
  color: #111;
  margin: 0 0 14pt 0;
  letter-spacing: 0.01em;
  background: #f4f4ee;
  padding: 4pt 8pt;
  display: inline-block;
  border-radius: 2px;
  border: 1px solid #e0dfc8;
}}
.cover-promise {{
  font-size: 12pt;
  color: #111;
  margin: 14pt 0 14pt 0;
  font-weight: 500;
  max-width: 130mm;
  line-height: 1.4;
}}
.cover-promise b {{ color: {EU_BLUE}; font-weight: 700; }}

.badges {{ margin: 14pt 0 0 0; }}
.badge {{
  display: inline-block;
  padding: 3pt 9pt;
  margin: 0 5pt 4pt 0;
  font-size: 8.5pt;
  font-weight: 600;
  border-radius: 2px;
  border: 1px solid #ccc;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}}
.badge.eu  {{ background: {EU_BLUE}; color: #fff; border-color: {EU_BLUE}; }}
.badge.nv  {{ background: {NVIDIA_GREEN}; color: #fff; border-color: {NVIDIA_GREEN}; }}
.badge.dws {{ background: {GOLD}; color: #111; border-color: {GOLD}; }}

.framework-chips {{
  margin-top: 18pt;
}}
.framework-chips-label {{
  font-size: 8.5pt;
  color: #555;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0 0 6pt 0;
}}
.framework-chips-row {{
  display: flex;
  flex-wrap: wrap;
  gap: 6pt;
}}
.framework-chip {{
  display: inline-block;
  padding: 4pt 10pt;
  font-size: 9pt;
  font-weight: 600;
  color: {EU_BLUE};
  background: #f0f4ff;
  border-left: 3px solid {EU_BLUE};
  border-radius: 0 3px 3px 0;
}}

.cover-meta-grid {{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8pt 18pt;
  font-size: 8.5pt;
  color: #444;
  margin-top: 22pt;
  padding-top: 12pt;
  border-top: 1px solid #ddd;
}}
.cover-meta-grid b {{
  color: #111;
  font-weight: 600;
  font-size: 7.5pt;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 2pt;
  color: #888;
}}
.cover-meta-grid .v {{ color: #111; font-size: 10pt; font-weight: 500; }}

/* Tables — restrained Nokia-style. Header bar uses EU blue; cells stay clean. */
table {{
  border-collapse: collapse;
  width: 100%;
  margin: 6pt 0 12pt 0;
  font-size: 9pt;
}}
th, td {{
  border-bottom: 1px solid #e2e2e2;
  padding: 5pt 7pt;
  vertical-align: top;
  text-align: left;
}}
thead th {{
  background: {EU_BLUE};
  color: #fff;
  border-bottom: 1px solid {EU_BLUE};
  font-weight: 600;
}}
tbody tr:nth-child(even) td {{ background: #fafafa; }}
code {{
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  background: #f4f4ee;
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 9pt;
}}
hr {{ border: none; border-top: 1px solid #e2e2e2; margin: 12pt 0; }}

/* Killer-hook pull-quotes — isolated and visually obvious, per editorial review */
blockquote {{
  margin: 10pt 0 12pt 0;
  padding: 10pt 14pt;
  border-left: 4px solid {GOLD};
  background: #fff8e6;
  color: #111;
  font-size: 11.5pt;
  font-weight: 600;
  font-style: normal;
  line-height: 1.4;
  page-break-inside: avoid;
}}
blockquote p {{ margin: 0; }}
.callout-believe {{
  margin: 8pt 0 14pt 0;
  padding: 10pt 14pt;
  background: #f0f4ff;
  border-left: 4px solid {EU_BLUE};
  font-size: 9.5pt;
  page-break-inside: avoid;
}}
.callout-believe ul {{ margin: 4pt 0 0 0; padding-left: 16pt; }}
.callout-believe li {{ margin-bottom: 2pt; }}

/* Timeline list for the operational vignette */
.timeline {{
  list-style: none;
  margin: 8pt 0 12pt 0;
  padding: 0;
  border-left: 2px solid {EU_BLUE};
}}
.timeline li {{
  position: relative;
  padding: 2pt 0 6pt 14pt;
  font-size: 9.5pt;
}}
.timeline li b {{ color: {EU_BLUE}; font-family: ui-monospace, Menlo, Consolas, monospace; }}

/* Footer block — vendor identity + classification, every PDF */
.footer-meta {{
  margin-top: 18pt;
  font-size: 8.5pt;
  color: #444;
  border-top: 2px solid {EU_BLUE};
  padding-top: 8pt;
}}
.footer-meta .vendor-block {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3pt 14pt;
}}
.footer-meta .vendor-block b {{ color: #111; }}
"""


def parse_front_matter(text: str) -> tuple[dict, str]:
    """YAML front-matter delimited by '---' at top. Returns (meta, body)."""
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}, text
    raw = text[4:end]
    meta = yaml.safe_load(raw) or {}
    body = text[end + 5 :]
    return meta, body


def strip_history_block(text: str) -> str:
    """Remove the DWS Document Standard *** VERSION AND AGENT HISTORY *** block
    from the rendered PDF body (we re-render it as a footer block)."""
    return re.sub(
        r"\*\*\*\s*\n[\s\S]*?\*\*\*\s*\n",
        "",
        text,
        count=1,
    )


def build_cover_html(meta: dict) -> str:
    industry = meta.get("industry", meta.get("slug", "")).strip()
    slug = meta.get("slug", "").upper()
    industry_no = meta.get("industry_number", "")
    version = meta.get("version", "1.0.0")
    language = (meta.get("language") or "en").upper()
    effective = meta.get("effective", date.today().isoformat())
    status = meta.get("status", "ACTIVE")
    owner = meta.get("owner", "Lifetime Oy")
    docref = f"DWS-PB-{slug}-{language}-{version}"

    flagship_chip = (
        '<span class="badge dws">★ FLAGSHIP</span> '
        if meta.get("flagship")
        else ""
    )
    num_label = f"#{industry_no:02d}" if isinstance(industry_no, int) else (
        f"#{industry_no}" if industry_no else ""
    )

    frameworks = meta.get("frameworks") or []
    paren_re = re.compile(r"\s*\(")

    def chip_label(fw: str) -> str:
        return paren_re.split(fw, maxsplit=1)[0]

    chips_html = "".join(
        f'<span class="framework-chip">{chip_label(fw)}</span>'
        for fw in frameworks
    )

    badges = (
        '<span class="badge dws">DWS Sovereign Stack</span>'
        '<span class="badge nv">NVIDIA Inception</span>'
        '<span class="badge eu">EU Inception</span>'
    )

    return (
        f'<div class="cover" data-industry="{industry}">'
        '<div class="cover-body">'
        f'<p class="cover-num">PLAYBOOK {num_label} · DEFENCE &amp; CRITICAL INFRASTRUCTURE</p>'
        f'<h1 class="industry">{industry}</h1>'
        '<p class="subtitle">DWS Sovereign-Stack Playbook · for EU defence ministries, '
        'dual-use operators, and CER / NIS2 critical entities</p>'
        '<div class="cover-rule"></div>'
        f'<p class="docref">Reference: {docref}</p>'
        '<p class="cover-promise">'
        'The <b>NVIDIA stack on your own hardware</b>, in your own building, '
        'with an <b>Article 12 log</b> your inspector can seal.'
        '</p>'
        f'<div class="badges">{flagship_chip}{badges}</div>'
        '<div class="framework-chips">'
        '<p class="framework-chips-label">Regulatory frameworks covered</p>'
        f'<div class="framework-chips-row">{chips_html}</div>'
        '</div>'
        '<div class="cover-meta-grid">'
        f'<div><b>Version</b><span class="v">{version}</span></div>'
        f'<div><b>Effective</b><span class="v">{effective}</span></div>'
        f'<div><b>Status</b><span class="v">{status}</span></div>'
        '<div><b>Classification</b><span class="v">Public</span></div>'
        f'<div><b>Language</b><span class="v">{language}</span></div>'
        f'<div><b>Owner</b><span class="v">{owner}</span></div>'
        '</div>'
        '</div>'
        '</div>'
    )


def build_footer_html(meta: dict) -> str:
    slug = meta.get("slug", "").upper()
    version = meta.get("version", "1.0.0")
    language = (meta.get("language") or "en").upper()
    docref = f"DWS-PB-{slug}-{language}-{version}"
    return (
        '<div class="footer-meta">'
        '<div class="vendor-block">'
        '<div><b>Vendor</b><br/>Lifetime Oy</div>'
        '<div><b>Y-tunnus / VAT</b><br/>0772407-9 / FI07724079</div>'
        '<div><b>Address</b><br/>Laidunmaanraitti 2 A 25, 02330 Espoo, Finland</div>'
        '<div><b>Contact</b><br/>Risto Anton Paarni · '
        '<a href="mailto:risto.paarni@lifetime.fi">risto.paarni@lifetime.fi</a></div>'
        f'<div><b>Document reference</b><br/>{docref}</div>'
        f'<div><b>Effective</b><br/>{meta.get("effective", date.today().isoformat())}</div>'
        '</div>'
        '</div>'
    )


def render(slug: str) -> Path | None:
    src_path = SRC / f"{slug}.md"
    if not src_path.exists():
        print(f"[skip] no source: {src_path}", file=sys.stderr)
        return None

    text = src_path.read_text(encoding="utf-8")
    meta, body = parse_front_matter(text)
    body = strip_history_block(body)

    md_html = markdown.markdown(
        body,
        extensions=["tables", "fenced_code", "sane_lists"],
        output_format="html5",
    )

    lang_attr = (meta.get("language") or "en")
    full_html = (
        f"<!DOCTYPE html><html lang=\"{lang_attr}\"><head><meta charset=\"utf-8\">"
        f"<title>{meta.get('title','DWS Sovereign Playbook')}</title>"
        f"<style>{CSS}</style></head><body>"
        f"{build_cover_html(meta)}"
        f"{md_html}"
        f"{build_footer_html(meta)}"
        "</body></html>"
    )

    # The file stem IS the storage key (e.g. defence-en, defence-fi). The
    # build never appends a language suffix; the source filename carries it.
    written: list[Path] = []
    for target_dir in TARGETS:
        target_dir.mkdir(parents=True, exist_ok=True)
        out = target_dir / f"{slug}.pdf"
        HTML(string=full_html, base_url=str(ROOT)).write_pdf(str(out))
        written.append(out)
        print(f"[ok ] {out.relative_to(ROOT)}")

    return written[0] if written else None


def main(argv: list[str]) -> int:
    SRC.mkdir(parents=True, exist_ok=True)
    if len(argv) > 1:
        slugs = argv[1:]
    else:
        slugs = sorted(p.stem for p in SRC.glob("*.md"))
    if not slugs:
        print("no playbook source files found", file=sys.stderr)
        return 1
    fail = 0
    for slug in slugs:
        try:
            render(slug)
        except Exception as exc:  # noqa: BLE001
            print(f"[err] {slug}: {exc}", file=sys.stderr)
            fail += 1
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
