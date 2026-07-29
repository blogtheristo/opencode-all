from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

INK   = RGBColor(0x0F,0x1B,0x2D)
MUTED = RGBColor(0x5A,0x6B,0x7E)
BRAND = RGBColor(0x0B,0x6B,0x5B)
BRAND2= RGBColor(0x0E,0x7C,0x9B)
ACCENT= RGBColor(0xB8,0x86,0x2A)
GOOD  = RGBColor(0x1F,0x7A,0x44)
WARN  = RGBColor(0x9A,0x3B,0x1B)
SOFT  = RGBColor(0xF4,0xF7,0xFA)
WHITE = RGBColor(0xFF,0xFF,0xFF)
WINBG = RGBColor(0xF6,0xFA,0xF8)
LINE  = RGBColor(0xDF,0xE6,0xEE)

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
SW, SH = prs.slide_width, prs.slide_height
BLANK = prs.slide_layouts[6]

def slide():
    return prs.slides.add_slide(BLANK)

def rect(s, x, y, w, h, fill, line=None):
    from pptx.enum.shapes import MSO_SHAPE
    sp = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, h)
    sp.fill.solid(); sp.fill.fore_color.rgb = fill
    if line is None:
        sp.line.fill.background()
    else:
        sp.line.color.rgb = line; sp.line.width = Pt(0.75)
    sp.shadow.inherit = False
    return sp

def txt(s, x, y, w, h, runs, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, space=4):
    tb = s.shapes.add_textbox(x, y, w, h); tf = tb.text_frame
    tf.word_wrap = True; tf.vertical_anchor = anchor
    tf.margin_left=0; tf.margin_right=0; tf.margin_top=0; tf.margin_bottom=0
    first=True
    for line in runs:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first=False
        p.alignment = align; p.space_after = Pt(space); p.space_before = Pt(0)
        if isinstance(line, tuple): line=[line]
        for seg in line:
            text, size, color, bold = seg
            r = p.add_run(); r.text = text
            r.font.size = Pt(size); r.font.color.rgb = color; r.font.bold = bold
            r.font.name = "Calibri"
    return tb

def bullets(s, x, y, w, h, items, size=15, color=INK, gap=7, bullet="—  "):
    tb = s.shapes.add_textbox(x, y, w, h); tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left=0; tf.margin_right=0; tf.margin_top=0; tf.margin_bottom=0
    first=True
    for it in items:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first=False
        p.space_after = Pt(gap); p.space_before = Pt(0)
        segs = it if isinstance(it, list) else [(it, size, color, False)]
        rb = p.add_run(); rb.text = bullet
        rb.font.size = Pt(size); rb.font.color.rgb = BRAND; rb.font.bold = True; rb.font.name="Calibri"
        for seg in segs:
            text, sz, col, bold = seg
            r = p.add_run(); r.text = text
            r.font.size = Pt(sz); r.font.color.rgb = col; r.font.bold = bold; r.font.name="Calibri"
    return tb

def footer(s, dark=False):
    c = MUTED if not dark else RGBColor(0xAF,0xBE,0xCE)
    txt(s, Inches(0.55), Inches(7.05), Inches(12.2), Inches(0.4),
        [[("Lifetime Oy  ·  risto.paarni@lifetime.fi  ·  Business ID 0772407-9  ·  Confidential — prepared 24 June 2026 for Kemira Oyj", 9, c, False)]])

def kicker(s, text, color=BRAND):
    txt(s, Inches(0.6), Inches(0.45), Inches(12), Inches(0.4),
        [[(text.upper(), 12, color, True)]])

def title(s, text, y=0.8, size=30, color=INK, w=12.1):
    txt(s, Inches(0.6), Inches(y), Inches(w), Inches(1.0), [[(text, size, color, True)]])

def tag(s, x, y, text, col):
    w = Inches(0.95 if len(text)<=8 else 1.15)
    box = rect(s, x, y, w, Inches(0.28), WHITE, line=col)
    tf = box.text_frame; tf.margin_top=Pt(1); tf.margin_bottom=Pt(1)
    p=tf.paragraphs[0]; p.alignment=PP_ALIGN.CENTER
    r=p.add_run(); r.text=text; r.font.size=Pt(9); r.font.bold=True; r.font.color.rgb=col; r.font.name="Calibri"
    return box

# ---------- Slide 1 — Title ----------
s = slide()
rect(s, 0,0, SW, SH, BRAND)
rect(s, 0,0, SW, Inches(0.18), ACCENT)
txt(s, Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.4),
    [[("CONFIDENTIAL BOARD MATERIAL  ·  PREPARED BY LIFETIME OY FOR KEMIRA", 12, RGBColor(0xCF,0xE6,0xE1), True)]])
txt(s, Inches(0.8), Inches(2.2), Inches(11.7), Inches(2.0),
    [[("Carbon compliance as a", 40, WHITE, True)],
     [("sovereign advantage", 40, WHITE, True)]])
txt(s, Inches(0.8), Inches(4.2), Inches(11.0), Inches(1.2),
    [[("A board business case for ", 18, RGBColor(0xEAF,0xF6,0xF3) if False else RGBColor(0xE7,0xF2,0xEF), False),
      ("DWS IQ Aegis Defence", 18, WHITE, True),
      (" — turning Kemira's SBTi-validated", 18, RGBColor(0xE7,0xF2,0xEF), False)],
     [("carbon targets and first-year CSRD reporting into an auditable, EU-sovereign capability.", 18, RGBColor(0xE7,0xF2,0xEF), False)]])
txt(s, Inches(0.8), Inches(6.2), Inches(11.7), Inches(0.9),
    [[("Prepared for: Maria (Hintikka) Sederholm — VP, Fiber Essentials   ·   Mikko Pohjala — VP, Strategy", 13, WHITE, True)],
     [("Kemira Oyj   ·   Version 1.0   ·   24 June 2026   ·   Risto Päärni, Lifetime Oy", 12, RGBColor(0xCF,0xE6,0xE1), False)]])

# ---------- Slide 2 — Executive summary ----------
s = slide(); footer(s)
kicker(s, "0 · Executive summary")
title(s, "The opportunity in one line")
# headline band
band = rect(s, Inches(0.6), Inches(1.85), Inches(12.13), Inches(1.55), RGBColor(0xFB,0xF6,0xEA), line=ACCENT)
txt(s, Inches(0.85), Inches(2.0), Inches(11.6), Inches(1.3),
    [[("DWS IQ Aegis Defence turns Kemira's carbon-compliance work into an attestable advantage — ", 16, INK, True)],
     [("KYA-governed AI agents and EU AI Act Article 12 audit on Finnish-hosted, CLOUD Act-free infrastructure — so CBAM, CSRD and customer PCF demands are met faster, with the audit trail regulators and customers ask for, and Kemira's process data stays sovereign.", 14, INK, False)]])
# two cards
c1 = rect(s, Inches(0.6), Inches(3.7), Inches(5.95), Inches(2.9), SOFT, line=LINE)
txt(s, Inches(0.85), Inches(3.9), Inches(5.5), Inches(2.6),
    [[("The ask", 16, INK, True)],
     [("A free 1–2 week scoping → pilot on one Fiber Essentials product line, aligned to Aegis GA (Sep 2026), measuring carbon-declaration cycle time, audit coverage and hours reclaimed.", 14, INK, False)]])
c2 = rect(s, Inches(6.78), Inches(3.7), Inches(5.95), Inches(2.9), SOFT, line=LINE)
txt(s, Inches(7.03), Inches(3.9), Inches(5.5), Inches(2.6),
    [[("The offer", 16, INK, True)],
     [("Aegis Defence", 22, BRAND, True), (" — promised tier", 13, MUTED, False)],
     [("€89,990 onboarding + €1,999 / month.", 15, INK, True)],
     [("Standard tier (€59,990 + €999/mo) is the fallback if the dual-use / EDIP layer proves out of scope.", 13, MUTED, False)]])

# ---------- Slide 3 — Company profile ----------
s = slide(); footer(s)
kicker(s, "1 · Kemira company profile")
title(s, "Researched & verified", size=28)
tag(s, Inches(6.5), Inches(0.92), "verified", GOOD)
rows = [
 ("Listing / HQ", "Kemira Oyj — Nasdaq Helsinki (KEMIRA), HQ Helsinki", "Verified", GOOD),
 ("FY2024 revenue", "≈ €2.95 billion (€2,948.1m)", "Confirm", WARN),
 ("Employees", "≈ 4,700", "Confirm", WARN),
 ("Footprint", "≈ 58 production sites, ~37 countries; sales in 100+", "Confirm", WARN),
 ("President & CEO", "Antti Salminen (since 12 Feb 2024)", "Verified", GOOD),
]
y = 1.95
rect(s, Inches(0.6), Inches(y), Inches(12.13), Inches(0.0001), LINE)
for i,(k,v,t,col) in enumerate(rows):
    yy = Inches(y + i*0.62)
    if i%2==0: rect(s, Inches(0.6), yy, Inches(12.13), Inches(0.6), SOFT)
    txt(s, Inches(0.8), Emu(int(yy)+Emu(Inches(0.12))), Inches(3.0), Inches(0.4), [[(k,13,MUTED,True)]])
    txt(s, Inches(3.9), Emu(int(yy)+Emu(Inches(0.12))), Inches(7.2), Inches(0.4), [[(v,13.5,INK,False)]])
    tag(s, Inches(11.5), Emu(int(yy)+Emu(Inches(0.10))), t, col)
txt(s, Inches(0.6), Inches(5.35), Inches(12.1), Inches(1.5),
    [[("Organisation — three business units since 1 Jan 2025 (corrects an earlier two-unit assumption):", 14, INK, True)],
     [[("Fiber Essentials", 13.5, BRAND, True),(" — EVP Antti Matula (Maria's unit)   ·   ", 13, INK, False),
       ("Water Solutions", 13.5, BRAND, True),(" — EVP Tuija Pohjolainen-Hiltunen", 13, INK, False)][0] if False else ("Fiber Essentials — EVP Antti Matula (Maria's unit)   ·   Water Solutions — EVP Tuija Pohjolainen-Hiltunen", 13, INK, False)],
     [("Packaging & Hygiene Solutions — EVP Harri Eronen   ·   Strategy & Sustainability combined under EVP Linus Hildebrandt", 13, INK, False)]])

# ---------- Slide 4 — Carbon spine ----------
s = slide(); footer(s)
kicker(s, "2 · Carbon compliance — the verified spine")
title(s, "Hard, externally-validated commitments", size=26)
cards = [
 ("Scope 1 & 2 — near term", "−51.23%", "by 2030 vs 2018. SBTi-validated, 1.5°C-aligned.", "Verified", GOOD),
 ("Scope 3 — goods & transport", "−32.5%", "by 2033 vs 2021. SBTi-validated near-term target.", "Verified", GOOD),
 ("Long-term ambition", "2045", "carbon neutral for Scopes 1 & 2.", "Verified", GOOD),
 ("CSRD / ESRS", "FY2024", "first sustainability statement — now under assurance.", "Confirm", WARN),
]
x0 = 0.6; cw = 2.95; gap=0.18
for i,(h,big,sub,t,col) in enumerate(cards):
    x = Inches(x0 + i*(cw+gap))
    rect(s, x, Inches(1.95), Inches(cw), Inches(2.5), SOFT, line=LINE)
    txt(s, Emu(int(x)+Emu(Inches(0.18))), Inches(2.1), Inches(cw-0.36), Inches(0.7), [[(h,12.5,INK,True)]])
    txt(s, Emu(int(x)+Emu(Inches(0.18))), Inches(2.75), Inches(cw-0.36), Inches(0.6), [[(big,30,BRAND,True)]])
    txt(s, Emu(int(x)+Emu(Inches(0.18))), Inches(3.45), Inches(cw-0.36), Inches(0.9), [[(sub,11.5,INK,False)]])
    tag(s, Emu(int(x)+Emu(Inches(0.18))), Inches(4.05), t, col)
# why it's a data problem
rect(s, Inches(0.6), Inches(4.75), Inches(12.13), Inches(1.95), WINBG, line=LINE)
bullets(s, Inches(0.85), Inches(4.95), Inches(11.6), Inches(1.7), [
  [("Scope 3 is the hard 32.5% — it depends on supplier and product-level data. Kemira already runs a Supplier PCF Reporting Guideline (Apr 2025): the same engine that ingests supplier PCFs produces customer-facing PCFs.", 13, INK, False)],
  [("Customers demand embedded-emissions data — per-product carbon footprints and EPDs in tenders, today manual and inconsistent.", 13, INK, False)],
  [("CSRD/ESRS raises the bar — first-year statement must be reproducible to source under assurance; AI used to compute it falls under EU AI Act audit-log expectations.", 13, INK, False)],
], size=13, gap=6)

# ---------- Slide 5 — Honesty box ----------
s = slide(); footer(s)
kicker(s, "2b · What we verified — and did not", WARN)
title(s, "Board-grade honesty", size=28)
rect(s, Inches(0.6), Inches(1.9), Inches(5.95), Inches(4.6), RGBColor(0xEE,0xF8,0xF1), line=GOOD)
txt(s, Inches(0.85), Inches(2.05), Inches(5.5), Inches(0.5), [[("VERIFIED (3/3 votes)", 13, GOOD, True)]])
bullets(s, Inches(0.85), Inches(2.55), Inches(5.5), Inches(3.8), [
  "3 business units + EVP leadership; CEO Salminen",
  "SBTi targets: −51.23%/2030, −32.5%/2033, neutral 2045",
  "Sustainability under EVP Strategy & Sustainability",
  "2019 sustainability-linked €400m RCF (KPIs)",
], size=13, gap=8, bullet="✓  ")
rect(s, Inches(6.78), Inches(1.9), Inches(5.95), Inches(4.6), RGBColor(0xFB,0xF1,0xEC), line=WARN)
txt(s, Inches(7.03), Inches(2.05), Inches(5.5), Inches(0.5), [[("CONFIRM IN SCOPING (not asserted)", 13, WARN, True)]])
bullets(s, Inches(7.03), Inches(2.55), Inches(5.5), Inches(3.8), [
  "Specific EU ETS Phase 4 installations",
  "CBAM precursor-import / downstream exposure",
  "Absolute Scope 1/2/3 tonnages (only % targets confirmed)",
  "CER Directive / NIS2 / dual-use export-control scope",
  "→ the dual-use angle behind the Defence tier is a hypothesis to test",
], size=13, gap=8, bullet="•  ")

# ---------- Slide 6 — Gap → Aegis ----------
s = slide(); footer(s)
kicker(s, "3 · The gap → what Aegis does")
title(s, "From manual burden to governed pipeline", size=26)
pairs = [
 ("CBAM & carbon declarations done manually, no consistent audit trail",
  "Carbon-declaration engine (VulcanAgent) + Article 12 logging on every figure"),
 ("Scope 3 / PCF data in fragmented spreadsheets, up- and downstream",
  "CrossVerticalIntel — bidirectional PCF ingest/produce on one governed pipeline"),
 ("AI tools run on US clouds → CLOUD Act exposure + EU AI Act gap",
  "100% EU-owned, Finnish-hosted; SovereigntyMonitor flags non-EU exposure"),
 ("No verifiable governance over AI actions on regulated disclosures",
  "KYA — verified agent identity, MicroVM isolation, real-time kill authority"),
 ("CSRD/ESRS must be reproducible to source under assurance",
  "Article 12 audit + reasoning lineage = audit-ready evidence chain"),
]
y=1.95; rh=0.92
txt(s, Inches(0.8), Inches(y-0.0), Inches(5.9), Inches(0.35), [[("Kemira's carbon-compliance gap", 12, MUTED, True)]])
txt(s, Inches(6.95), Inches(y-0.0), Inches(5.7), Inches(0.35), [[("Aegis capability", 12, MUTED, True)]])
y=2.35
for i,(g,a) in enumerate(pairs):
    yy=Inches(y+i*rh)
    rect(s, Inches(0.6), yy, Inches(5.9), Inches(rh-0.12), WHITE, line=LINE)
    txt(s, Inches(0.78), Emu(int(yy)+Emu(Inches(0.1))), Inches(5.55), Inches(rh-0.2), [[(g,11.5,INK,False)]], anchor=MSO_ANCHOR.MIDDLE)
    rect(s, Inches(6.83), yy, Inches(5.9), Inches(rh-0.12), WINBG, line=LINE)
    txt(s, Inches(7.01), Emu(int(yy)+Emu(Inches(0.1))), Inches(5.55), Inches(rh-0.2), [[(a,11.5,INK,True)]], anchor=MSO_ANCHOR.MIDDLE)

# ---------- Slide 7 — Four roles ----------
s = slide(); footer(s)
kicker(s, "4 · The board case — four roles, one headline")
title(s, "Each role wins; each win creates the next", size=25)
roles = [
 ("Strategy / board bridge", "Mikko Pohjala (VP Strategy) → EVP Hildebrandt",
  "Carbon compliance reframed from cost to a sovereign, defensible capability that strengthens the CSRD & SBTi narrative."),
 ("Commercial / line — door #1", "Maria Sederholm (VP, Fiber Essentials) → EVP Matula",
  "Per-product PCFs & CBAM data in minutes; sovereign attestation becomes a tender differentiator in Scope-3-audited accounts."),
 ("Security / IT approver", "CISO / Head of IT",
  "EU-sovereign by construction; KYA governance, kill authority, Article 12 audit; zero CLOUD Act / discovery surface."),
 ("Executive sign-off", "CEO Antti Salminen / CFO",
  "One platform moves revenue, cost and risk; one EU jurisdiction, one auditable story for board & capital markets."),
]
y=1.95; rh=1.18
for i,(role,who,win) in enumerate(roles):
    yy=Inches(y+i*rh)
    rect(s, Inches(0.6), yy, Inches(4.1), Inches(rh-0.12), SOFT, line=LINE)
    txt(s, Inches(0.78), Emu(int(yy)+Emu(Inches(0.12))), Inches(3.8), Inches(rh-0.2),
        [[(role,13,INK,True)],[(who,10.5,MUTED,False)]], anchor=MSO_ANCHOR.MIDDLE)
    rect(s, Inches(4.85), yy, Inches(7.88), Inches(rh-0.12), WINBG, line=LINE)
    txt(s, Inches(5.05), Emu(int(yy)+Emu(Inches(0.1))), Inches(7.5), Inches(rh-0.2), [[(win,12.5,INK,False)]], anchor=MSO_ANCHOR.MIDDLE)

# ---------- Slide 8 — Pricing ----------
s = slide(); footer(s)
kicker(s, "5 · Commercial offer & pricing", BRAND)
title(s, "Three tiers — Defence promised", size=27)
tag(s, Inches(6.0), Inches(0.95), "canonical", GOOD)
cols = [("","Onboarding","Monthly","Included")]
data = [
 ("Aegis Standard","€59,990","€999/mo","Skilled agents · 21 dual-use industries · K8s cluster · Article 12 · KYA", False),
 ("Aegis Defence  (promised)","€89,990","€1,999/mo","Standard + NVIDIA L40S GPU · ArgusAgent SAR · 4h SLA · EDIP reporting", True),
 ("Aegis Sovereign","Custom","€4,999/mo","Defence + air-gapped/on-prem · clearance support · dedicated team", False),
]
# header
hy=Inches(1.95)
widths=[3.4,1.9,1.7,5.13]; xs=[0.6]; 
for w in widths[:-1]: xs.append(xs[-1]+w)
rect(s, Inches(0.6), hy, Inches(12.13), Inches(0.5), INK)
for (lab),x,w in zip(["Tier","Onboarding","Monthly","Included"], xs, widths):
    txt(s, Inches(x+0.15), Emu(int(hy)+Emu(Inches(0.12))), Inches(w-0.2), Inches(0.4), [[(lab,12.5,WHITE,True)]])
ry=2.45; rh=0.82
for r,(tier,onb,mon,inc,hl) in enumerate(data):
    yy=Inches(ry+r*rh)
    bg = RGBColor(0xFB,0xF6,0xEA) if hl else (SOFT if r%2==0 else WHITE)
    rect(s, Inches(0.6), yy, Inches(12.13), Inches(rh-0.06), bg, line=LINE)
    vals=[tier,onb,mon,inc]
    for v,x,w,j in zip(vals,xs,widths,range(4)):
        bold = hl and j<3
        sz = 13.5 if j<3 else 12
        col = BRAND if (j==0 and hl) else INK
        txt(s, Inches(x+0.15), Emu(int(yy)+Emu(Inches(0.16))), Inches(w-0.2), Inches(rh-0.2), [[(v,sz,col,bold or j==0)]], anchor=MSO_ANCHOR.MIDDLE)
txt(s, Inches(0.6), Inches(5.25), Inches(12.1), Inches(1.4),
    [[("Software-only (GPU is UpCloud Helsinki inference capacity). Single-tenant Kubernetes on UpCloud — Finnish-owned, ISO 27001, zero CLOUD Act. Platform GA: September 2026.", 12.5, MUTED, False)],
     [("Said openly: if scoping shows pure carbon / critical-infrastructure value (no dual-use/EDIP), Aegis Standard carries the same sovereignty, KYA governance and Article 12 audit — we won't force Defence if Standard fits.", 12.5, WARN, True)]])

# ---------- Slide 9 — Next steps ----------
s = slide(); footer(s)
kicker(s, "6 · Next steps")
title(s, "From here to a pilot", size=28)
steps = [
 ("Confirm scope (call with Maria)","Which Fiber Essentials lines carry the heaviest CBAM / customer-PCF / CSRD load; confirm titles & reporting lines; decide Defence vs Standard."),
 ("Loop in Mikko (Strategy) early","He carries the board narrative and connects to EVP Strategy & Sustainability — the executive sponsor for a sovereign-compliance mandate."),
 ("Free scoping, 1–2 weeks","Lock the product line, the measurement set (cycle time, audit coverage, hours reclaimed) and the data sources."),
 ("Pilot aligned to GA (Aug 2026)","One product line, KYA-governed carbon-declaration pipeline, Article 12 audit, sovereign hosting. Commercial conversion on agreed KPIs."),
]
y=2.0; rh=1.18
for i,(h,b) in enumerate(steps):
    yy=Inches(y+i*rh)
    circ = s.shapes.add_shape(__import__("pptx").enum.shapes.MSO_SHAPE.OVAL, Inches(0.6), yy, Inches(0.6), Inches(0.6))
    circ.fill.solid(); circ.fill.fore_color.rgb=BRAND; circ.line.fill.background(); circ.shadow.inherit=False
    ctf=circ.text_frame; cp=ctf.paragraphs[0]; cp.alignment=PP_ALIGN.CENTER
    cr=cp.add_run(); cr.text=str(i+1); cr.font.size=Pt(18); cr.font.bold=True; cr.font.color.rgb=WHITE; cr.font.name="Calibri"
    txt(s, Inches(1.45), Emu(int(yy)+Emu(Inches(0.02))), Inches(11.2), Inches(rh-0.1),
        [[(h,16,INK,True)],[(b,13,MUTED,False)]])

# ---------- Slide 10 — Close / sources ----------
s = slide()
rect(s,0,0,SW,SH,BRAND)
rect(s,0,0,SW,Inches(0.18),ACCENT)
txt(s, Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.4), [[("SOURCES & METHOD", 12, RGBColor(0xCF,0xE6,0xE1), True)]])
txt(s, Inches(0.8), Inches(1.25), Inches(11.7), Inches(1.0),
    [[("Verified, not vibed", 30, WHITE, True)]])
bullets(s, Inches(0.8), Inches(2.3), Inches(11.7), Inches(2.4), [
  [("Method: 5-angle web research → 21 sources → 13 falsifiable claims → 3-vote adversarial verification (12 confirmed, 1 refuted) → synthesis.", 14, WHITE, False)],
  [("Company facts: Kemira newsroom releases + Annual Report 2024 (reorg, SBTi targets, Supplier PCF Guideline, sustainability-linked RCF).", 14, WHITE, False)],
  [("Product & pricing: canonical Store/PRODUCT_AEGIS.md and products.json (DWS-AEGIS-001).", 14, WHITE, False)],
  [("Single-source figures tagged \"Confirm\" — validate with Kemira before board circulation.", 14, WHITE, False)],
], size=14, gap=10)
txt(s, Inches(0.8), Inches(5.3), Inches(11.7), Inches(1.6),
    [[("DWS IQ Aegis Defence", 20, WHITE, True),(" — sovereign industrial intelligence, Finnish-hosted, CLOUD Act-free.", 16, RGBColor(0xE7,0xF2,0xEF), False)],
     [("Risto Anton Päärni · Founder & CEO, Lifetime Oy · risto.paarni@lifetime.fi", 14, WHITE, True)],
     [("Laidunmaanraitti 2 A 25, 02330 Espoo · Business ID 0772407-9 · VAT FI07724079 · dws10.com", 12, RGBColor(0xCF,0xE6,0xE1), False)]])

out = "/home/user/dws6/sales-outreach/KEMIRA_AEGIS_BOARD_DECK.pptx"
prs.save(out)
print("saved", out, len(prs.slides.__iter__.__self__._sldIdLst), "slides")
