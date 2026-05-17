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

import re
import sys
from datetime import date
from pathlib import Path

import markdown  # type: ignore
import yaml  # type: ignore
from weasyprint import HTML  # type: ignore

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "playbooks" / "src"
TARGETS = [
    ROOT / "dws10.com" / "playbooks" / "pdf",
    ROOT / "landing-pages" / "dws10-com" / "playbooks" / "pdf",
]

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

/* Cover block — Nokia-style information panel with reference + classification */
.cover {{
  border-top: 3px solid {EU_BLUE};
  border-bottom: 1px solid #ddd;
  padding: 8pt 0 10pt 0;
  margin: 0 0 14pt 0;
  string-set: industry attr(data-industry) " · DWS Sovereign Playbook";
}}
.cover-meta-grid {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4pt 14pt;
  font-size: 8.5pt;
  color: #444;
  margin-top: 8pt;
  border-top: 1px solid #eee;
  padding-top: 8pt;
}}
.cover-meta-grid b {{ color: #111; font-weight: 600; }}
.cover .industry {{
  font-size: 24pt;
  font-weight: 700;
  color: {EU_BLUE};
  margin: 0;
  letter-spacing: -0.01em;
}}
.cover .subtitle {{
  font-size: 10pt;
  color: #444;
  margin: 4pt 0 0 0;
}}
.cover .docref {{
  string-set: docref content();
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 9pt;
  color: #111;
  margin: 8pt 0 0 0;
  letter-spacing: 0.01em;
}}
.badges {{ margin-top: 8pt; }}
.badge {{
  display: inline-block;
  padding: 2pt 8pt;
  margin-right: 5pt;
  font-size: 8pt;
  font-weight: 600;
  border-radius: 2px;
  border: 1px solid #ccc;
  letter-spacing: 0.02em;
}}
.badge.eu  {{ background: {EU_BLUE}; color: #fff; border-color: {EU_BLUE}; }}
.badge.nv  {{ background: {NVIDIA_GREEN}; color: #fff; border-color: {NVIDIA_GREEN}; }}
.badge.dws {{ background: {GOLD}; color: #111; border-color: {GOLD}; }}
.frameworks {{
  margin-top: 6pt;
  font-size: 9pt;
  color: #333;
}}
.frameworks ul {{ margin: 2pt 0 0 0; padding-left: 16pt; }}

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
    docref = f"DWS-PB-{slug}-{language}-{version}"
    flagship = (
        '<span class="badge dws">★ FLAGSHIP</span> ' if meta.get("flagship") else ""
    )
    industry_no_html = (
        f' <span style="color:#888;font-size:16pt;">· #{industry_no}</span>'
        if industry_no
        else ""
    )
    frameworks = meta.get("frameworks") or []
    fw_html = "".join(f"<li>{fw}</li>" for fw in frameworks)
    badges = (
        '<span class="badge dws">DWS Sovereign Stack</span>'
        '<span class="badge nv">NVIDIA Inception</span>'
        '<span class="badge eu">EU Inception</span>'
    )
    return (
        f'<div class="cover" data-industry="{industry}">'
        f'{flagship}'
        f'<p class="industry">{industry}{industry_no_html}</p>'
        '<p class="subtitle">DWS Sovereign-Stack Playbook</p>'
        f'<p class="docref">Reference: {docref}</p>'
        f'<div class="badges">{badges}</div>'
        '<div class="cover-meta-grid">'
        f'<div><b>Version</b><br/>{version}</div>'
        f'<div><b>Effective</b><br/>{effective}</div>'
        f'<div><b>Status</b><br/>{meta.get("status","ACTIVE")}</div>'
        f'<div><b>Classification</b><br/>Public</div>'
        f'<div><b>Language</b><br/>{language}</div>'
        f'<div><b>Owner</b><br/>{meta.get("owner","Lifetime Oy")}</div>'
        '</div>'
        f'<div class="frameworks"><b>Regulatory frameworks:</b><ul>{fw_html}</ul></div>'
        "</div>"
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
