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
from PIL import Image  # type: ignore
from weasyprint import HTML  # type: ignore

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "playbooks" / "src"
TARGETS = [
    ROOT / "dws10.com" / "playbooks" / "pdf",
    ROOT / "landing-pages" / "dws10-com" / "playbooks" / "pdf",
]
AEGIS_LOGO = ROOT / "dws10.com" / "static" / "images" / "firehorse-aegis-head.png"


def thumb_as_data_url(path: Path, size_px: int = 240) -> str:
    """Resize image to size_px square and return as base64 PNG data URL.
    Keeps the cover lightweight (DWS_DOCUMENT_STANDARD downloadable rule)."""
    if not path.exists():
        return ""
    img = Image.open(path).convert("RGBA")
    img.thumbnail((size_px, size_px), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/png;base64,{b64}"

# DWS brand palette (DWS_BRAND_STANDARD).
GOLD = "#d4a843"
EU_BLUE = "#003399"
NVIDIA_GREEN = "#76B900"

CSS = f"""
/* Hybrid style: Nokia info-design discipline + DWS palette (gold + EU blue +
   NVIDIA green accents). Conservative whitespace, info-dense tables, vendor
   block + reference number in cover and footer. Inter is the open substitute
   for Nokia Pure; falls back to Helvetica. */
@page {{
  size: A4;
  margin: 24mm 20mm 22mm 20mm;
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
 * COVER — visual front page.
 * Full-bleed top gold strip, industry number + huge title, Aegis
 * head badge in the top-right, framework chips, meta grid, then
 * page-break before section 0. Designed to look like a defence
 * advisory deliverable, not a brochure.
 * ============================================================ */
.cover {{
  page: cover;
  string-set: industry attr(data-industry) " · DWS Sovereign Playbook";
  page-break-after: always;
}}
@page cover {{
  size: A4;
  margin: 0;
  @bottom-left  {{ content: none; }}
  @bottom-center{{ content: none; }}
  @bottom-right {{ content: none; }}
}}
.cover-strip-top {{
  height: 8mm;
  background: linear-gradient(90deg, {GOLD} 0%, #e6c068 60%, {GOLD} 100%);
}}
.cover-strip-bottom {{
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 8mm;
  background: linear-gradient(90deg, {EU_BLUE} 0%, #00277a 50%, {EU_BLUE} 100%);
}}
.cover-body {{
  padding: 22mm 22mm 16mm 22mm;
  position: relative;
  min-height: 240mm;
}}
.cover-row {{
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16mm;
  margin-bottom: 18pt;
}}
.cover-left {{ flex: 1 1 auto; min-width: 0; }}
.cover-aegis {{
  flex: 0 0 auto;
  width: 32mm;
  height: 32mm;
  border-radius: 50%;
  border: 2px solid {GOLD};
  background: #fff;
  padding: 3mm;
  box-sizing: border-box;
  text-align: center;
  line-height: 0;
}}
.cover-aegis img {{
  width: 100%;
  height: 100%;
  object-fit: contain;
}}
.cover-aegis-label {{
  margin-top: 2mm;
  text-align: center;
  font-size: 7.5pt;
  color: #555;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  width: 32mm;
}}
.cover-aegis-wrap {{ display: inline-block; }}
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

    aegis_data = thumb_as_data_url(AEGIS_LOGO, size_px=240)
    aegis_html = (
        f'<div class="cover-aegis-wrap">'
        f'<div class="cover-aegis"><img src="{aegis_data}" alt="DWS Aegis"/></div>'
        f'<div class="cover-aegis-label">DWS Aegis</div>'
        f'</div>'
        if aegis_data
        else ""
    )

    return (
        f'<div class="cover" data-industry="{industry}">'
        '<div class="cover-strip-top"></div>'
        '<div class="cover-body">'
        '<div class="cover-row">'
        '<div class="cover-left">'
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
        f'<div class="cover-right">{aegis_html}</div>'
        '</div>'
        '</div>'
        '<div class="cover-strip-bottom"></div>'
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

    full_html = (
        "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\">"
        f"<title>{meta.get('title','DWS Sovereign Playbook')}</title>"
        f"<style>{CSS}</style></head><body>"
        f"{build_cover_html(meta)}"
        f"{md_html}"
        f"{build_footer_html(meta)}"
        "</body></html>"
    )

    written: list[Path] = []
    for target_dir in TARGETS:
        target_dir.mkdir(parents=True, exist_ok=True)
        out = target_dir / f"{slug}-en.pdf"
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
