#!/usr/bin/env python3
"""Build DWS whitepapers as A4 .docx (Aegis logo header, version line, 3-zone footer).

Implements DWS_DOCUMENT_STANDARD.md §20 (Whitepaper Standard):
  - A4 portrait, Aegis logo top-right, small-font version line at top
  - Justified 12pt body (mobile-readable), headings left
  - Per-page footer: left=classification · center=copyright · right=big page number
  - Output filenames carry a numeric VERSION_TAG prefix (NN_WPn_...) so the
    latest build sorts together / is easy to find on Google Drive.

Sources: Learn/*.html (existing) + docs/lifetime-fleet/*.md (new).
Output:  build/whitepapers/  (git-ignored). Drag the .docx into Google Drive
         to get Google Docs with all formatting preserved.

Usage:   python3 scripts/build-whitepapers.py
         VERSION_TAG=03 python3 scripts/build-whitepapers.py   # bump the prefix
Requires: python-docx  (pip install python-docx)
"""
import re, html, os
from html.parser import HTMLParser
from docx import Document
from docx.shared import Mm, Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = os.path.join(REPO, "scripts/assets/aegis-logo.jpg")
OUT = os.path.join(REPO, "build/whitepapers")
VERSION_TAG = os.environ.get("VERSION_TAG", "02")   # leading number → latest sorts together on Drive
COPYRIGHT = "© 2026 Lifetime Oy · Y-tunnus 0772407-9 · All rights reserved."
CLASSIFICATION = os.environ.get("CLASSIFICATION", "Confidential")
GREY = RGBColor(0x60, 0x60, 0x60)

# ---------- block model: ('h',lvl,t) | ('p',t) | ('li',t,ordered) | ('table',rows) | ('hr',) ----------
class WPHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.blocks=[]; self.cur=None; self.buf=[]; self.skip=0; self.in_body=False; self.list_stack=[]
        self.in_table=False; self.rows=None; self.row=None; self.cell=None
    def handle_starttag(self, tag, attrs):
        if tag in ('style','script'): self.skip+=1; return
        if tag=='body': self.in_body=True; return
        if not self.in_body: return
        if tag in ('h1','h2','h3','h4'): self._flush(); self.cur=('h',int(tag[1])); self.buf=[]
        elif tag=='p': self._flush(); self.cur=('p',); self.buf=[]
        elif tag in ('ul','ol'): self.list_stack.append(tag=='ol')
        elif tag=='li': self._flush(); self.cur=('li',); self.buf=[]
        elif tag=='table': self._flush(); self.in_table=True; self.rows=[]
        elif tag=='tr' and self.in_table: self.row=[]
        elif tag in ('td','th') and self.in_table: self.cell=[]
        elif tag=='br' and self.cur: self.buf.append('\n')
    def handle_endtag(self, tag):
        if tag in ('style','script'): self.skip=max(0,self.skip-1); return
        if not self.in_body: return
        if tag in ('h1','h2','h3','h4','p','li'): self._flush()
        elif tag in ('ul','ol') and self.list_stack: self.list_stack.pop()
        elif tag in ('td','th') and self.in_table: self.row.append(self._clean(''.join(self.cell))); self.cell=None
        elif tag=='tr' and self.in_table and self.row is not None:
            if any(c.strip() for c in self.row): self.rows.append(self.row)
            self.row=None
        elif tag=='table' and self.in_table:
            if self.rows: self.blocks.append(('table',self.rows))
            self.in_table=False; self.rows=None
    def handle_data(self, data):
        if self.skip or not self.in_body: return
        if self.cell is not None: self.cell.append(data)
        elif self.cur: self.buf.append(data)
    def _clean(self, s):
        s=html.unescape(s).replace('\xa0',' '); s=re.sub(r'[ \t]+',' ',s); s=re.sub(r'\s*\n\s*','\n',s); return s.strip()
    def _flush(self):
        if not self.cur: return
        text=self._clean(''.join(self.buf)); kind=self.cur[0]
        if text:
            if kind=='h': self.blocks.append(('h',self.cur[1],text))
            elif kind=='p': self.blocks.append(('p',text))
            elif kind=='li': self.blocks.append(('li',text, self.list_stack[-1] if self.list_stack else False))
        self.cur=None; self.buf=[]

def parse_html(path):
    with open(path,encoding='utf-8') as f: src=f.read()
    p=WPHTMLParser(); p.feed(src); return p.blocks

def md_inline(s):
    s=re.sub(r'\*\*([^*]+)\*\*',r'\1',s); s=re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)',r'\1',s)
    s=re.sub(r'`([^`]+)`',r'\1',s); s=re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',s); return s.strip()

def parse_markdown(path):
    with open(path,encoding='utf-8') as f: lines=f.read().split('\n')
    blocks=[]; i=0
    while i<len(lines):
        ln=lines[i].rstrip()
        if not ln.strip(): i+=1; continue
        if re.match(r'^#{1,4}\s',ln):
            lvl=len(ln)-len(ln.lstrip('#')); blocks.append(('h',min(lvl,4),md_inline(ln.lstrip('# ').strip()))); i+=1; continue
        if re.match(r'^---+\s*$',ln) or re.match(r'^\*\*\*+\s*$',ln): blocks.append(('hr',)); i+=1; continue
        if ln.lstrip().startswith('|') and '|' in ln:
            tbl=[]
            while i<len(lines) and lines[i].lstrip().startswith('|'):
                row=lines[i].strip().strip('|')
                if re.match(r'^[\s:|-]+$',row): i+=1; continue
                tbl.append([md_inline(c.strip()) for c in row.split('|')]); i+=1
            if tbl: blocks.append(('table',tbl)); continue
        m=re.match(r'^(\s*)([-*]|\d+\.)\s+(.*)',ln)
        if m: blocks.append(('li',md_inline(m.group(3)),bool(re.match(r'\d+\.',m.group(2))))); i+=1; continue
        para=[ln]; i+=1
        while i<len(lines) and lines[i].strip() and not re.match(r'^(#{1,4}\s|\s*[-*]\s|\d+\.\s|\|)',lines[i]) and not re.match(r'^(---+|\*\*\*+)\s*$',lines[i]):
            para.append(lines[i].rstrip()); i+=1
        blocks.append(('p',md_inline(' '.join(para))))
    return blocks

# ---------- docx rendering ----------
def add_page_field(par, size_pt):
    fld=OxmlElement('w:fldSimple'); fld.set(qn('w:instr'),'PAGE')
    r=OxmlElement('w:r'); rpr=OxmlElement('w:rPr')
    sz=OxmlElement('w:sz'); sz.set(qn('w:val'),str(int(size_pt*2))); rpr.append(sz)
    color=OxmlElement('w:color'); color.set(qn('w:val'),'404040'); rpr.append(color)
    rpr.append(OxmlElement('w:b')); r.append(rpr)
    t=OxmlElement('w:t'); t.text='1'; r.append(t); fld.append(r); par._p.append(fld)

def style_doc(doc, classification):
    n=doc.styles['Normal']; n.font.name='Calibri'; n.font.size=Pt(12)
    n.paragraph_format.line_spacing=1.15; n.paragraph_format.space_after=Pt(6)
    sec=doc.sections[0]; sec.orientation=WD_ORIENT.PORTRAIT
    sec.page_width=Mm(210); sec.page_height=Mm(297)
    sec.top_margin=Mm(22); sec.bottom_margin=Mm(20); sec.left_margin=Mm(22); sec.right_margin=Mm(22)
    sec.header_distance=Mm(12); sec.footer_distance=Mm(10)
    hp=sec.header.paragraphs[0]; hp.alignment=WD_ALIGN_PARAGRAPH.RIGHT
    hp.add_run().add_picture(LOGO, width=Inches(1.15))
    fp=sec.footer.paragraphs[0]; fp.alignment=WD_ALIGN_PARAGRAPH.LEFT
    ts=fp.paragraph_format.tab_stops
    ts.add_tab_stop(Mm(83), WD_TAB_ALIGNMENT.CENTER); ts.add_tab_stop(Mm(166), WD_TAB_ALIGNMENT.RIGHT)
    rc=fp.add_run(classification); rc.font.size=Pt(7.5); rc.font.color.rgb=GREY; rc.bold=True
    fp.add_run('\t'); rcp=fp.add_run(COPYRIGHT); rcp.font.size=Pt(7.5); rcp.font.color.rgb=GREY
    fp.add_run('\t'); add_page_field(fp, 13)

def render(blocks, out, version, classification):
    doc=Document(); style_doc(doc, classification)
    vp=doc.add_paragraph(); rr=vp.add_run(version); rr.font.size=Pt(8); rr.font.color.rgb=RGBColor(0x80,0x80,0x80)
    for b in blocks:
        if b[0]=='h': doc.add_heading(b[2], level=min(b[1],4))
        elif b[0]=='p': p=doc.add_paragraph(b[1]); p.alignment=WD_ALIGN_PARAGRAPH.JUSTIFY
        elif b[0]=='li': p=doc.add_paragraph(b[1], style='List Number' if b[2] else 'List Bullet'); p.alignment=WD_ALIGN_PARAGRAPH.JUSTIFY
        elif b[0]=='hr':
            p=doc.add_paragraph(); p.add_run('—'*30).font.color.rgb=RGBColor(0xC0,0xC0,0xC0); p.alignment=WD_ALIGN_PARAGRAPH.CENTER
        elif b[0]=='table':
            rows=b[1]; ncol=max(len(r) for r in rows); t=doc.add_table(rows=0,cols=ncol); t.style='Light Grid Accent 1'
            for ri,row in enumerate(rows):
                cells=t.add_row().cells
                for ci in range(ncol):
                    cells[ci].text=row[ci] if ci<len(row) else ''
                    if ri==0:
                        for para in cells[ci].paragraphs:
                            for run in para.runs: run.bold=True
    doc.save(out); return out

# Per-document config: (source, kind, WPnum, slug, version-line-template{cls}, classification)
JOBS = [
  ("Learn/sovereign-industrial-intelligence-whitepaper-v1.0.html","html",1,"Sovereign_Industrial_Intelligence",
   "Whitepaper · Version 1.0 · 2026 · Lifetime Oy · Classification: {cls}", "Confidential"),
  ("Learn/KYA-IDV-CERT-Whitepaper-v1.0.html","html",2,"KYA_IDV_CERT",
   "Whitepaper · KYA-IDV-CERT · Version 1.0 · 2026 · Lifetime Oy · Classification: {cls}", "Confidential"),
  ("Learn/2026-03-17-shufti-kya-whitepaper_v1.0.html","html",3,"Shufti_KYA",
   "Whitepaper · Version 1.0 · 2026-03-17 · Lifetime Oy · Classification: {cls}", "Confidential"),
  ("docs/lifetime-fleet/WHITEPAPER_COMPLIANT_BY_CONSTRUCTION.md","md",4,"Compliant_by_Construction",
   "Whitepaper · Version 1.0 · 2026-06-24 · Lifetime Oy / DWS IQ 6 · Classification: {cls}", "Public"),
]

def main():
    os.makedirs(OUT, exist_ok=True)
    for src,kind,num,slug,vtmpl,classification in JOBS:
        path=os.path.join(REPO, src)
        blocks=parse_html(path) if kind=='html' else parse_markdown(path)
        version=vtmpl.format(cls=classification)
        name=f"{VERSION_TAG}_WP{num}_{slug}_A4.docx"
        outp=os.path.join(OUT, name)
        render(blocks, outp, version, classification)
        print(f"{name}: {len(blocks)} blocks, {classification}, {os.path.getsize(outp)} bytes")

if __name__ == "__main__":
    main()
