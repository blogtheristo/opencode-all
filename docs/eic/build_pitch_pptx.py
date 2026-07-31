#!/usr/bin/env python3
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

NAVY  = RGBColor(0x0A, 0x18, 0x30)
NAVY2 = RGBColor(0x0E, 0x22, 0x44)
INK   = RGBColor(0xEA, 0xF1, 0xFB)
MUTE  = RGBColor(0x9F, 0xB3, 0xD1)
GOLD  = RGBColor(0xE8, 0xB6, 0x4C)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]
SW, SH = prs.slide_width, prs.slide_height

def bg(slide, color=NAVY):
    f = slide.background.fill; f.solid(); f.fore_color.rgb = color

def bar(slide):
    # gold accent bar top
    from pptx.enum.shapes import MSO_SHAPE
    s = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SW, Pt(6))
    s.fill.solid(); s.fill.fore_color.rgb = GOLD; s.line.fill.background()

def foot(slide, n):
    tb = slide.shapes.add_textbox(Inches(0.6), Inches(7.0), Inches(12.1), Inches(0.4))
    p = tb.text_frame.paragraphs[0]
    r = p.add_run(); r.text = "LIFETIME OY · DWS IQ AEGIS"
    r.font.size = Pt(10); r.font.bold = True; r.font.color.rgb = GOLD; r.font.name = "Arial"
    r2 = p.add_run(); r2.text = f"      {n} / 10"
    r2.font.size = Pt(10); r2.font.color.rgb = MUTE; r2.font.name = "Arial"

def txt(slide, l, t, w, h, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(l, t, w, h); tf = tb.text_frame
    tf.word_wrap = True; tf.vertical_anchor = anchor
    return tf

def set_run(p, text, size, color, bold=False, italic=False):
    r = p.add_run(); r.text = text
    r.font.size = Pt(size); r.font.color.rgb = color; r.font.bold = bold
    r.font.italic = italic; r.font.name = "Arial"
    return r

def kicker(slide, text):
    tf = txt(slide, Inches(0.7), Inches(0.55), Inches(12), Inches(0.5))
    set_run(tf.paragraphs[0], text.upper(), 12, GOLD, bold=True)

def title(slide, text, size=40, color=WHITE):
    tf = txt(slide, Inches(0.7), Inches(1.05), Inches(12), Inches(1.6))
    p = tf.paragraphs[0]; p.line_spacing = 1.0
    set_run(p, text, size, color, bold=True)

def bullets(slide, items, top=2.7, size=20, gap=8):
    tf = txt(slide, Inches(0.7), Inches(top), Inches(11.9), Inches(4.0))
    for i, it in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(gap); p.line_spacing = 1.12
        set_run(p, "▪  ", size, GOLD, bold=True)
        # allow **bold** segments
        parts = it.split("**")
        for j, seg in enumerate(parts):
            if seg == "": continue
            set_run(p, seg, size, INK if j % 2 == 0 else WHITE, bold=(j % 2 == 1))

def content(n, k, t, items, tsize=40):
    s = prs.slides.add_slide(BLANK); bg(s); bar(s)
    kicker(s, k); title(s, t, tsize); bullets(s, items); foot(s, n); return s

# 1 — Title
s = prs.slides.add_slide(BLANK); bg(s); bar(s)
kicker(s, "Lifetime Oy · Espoo, Finland · EIC Accelerator")
tf = txt(s, Inches(0.7), Inches(1.7), Inches(12), Inches(2.6))
set_run(tf.paragraphs[0], "AEGIS", 72, GOLD, bold=True)
p = tf.add_paragraph(); p.line_spacing = 1.0
set_run(p, "Sovereign AI agents that act for regulated Europe.", 34, WHITE, bold=True)
tf2 = txt(s, Inches(0.7), Inches(4.7), Inches(11.5), Inches(1.4))
set_run(tf2.paragraphs[0],
    "KYA — Know Your Agent — running in production. Aegis, the sovereign dual-use tier, GA September 2026.  €2.5M grant-only · TRL 5→8.",
    20, MUTE)
tfb = txt(s, Inches(0.7), Inches(6.15), Inches(12), Inches(0.6))
set_run(tfb.paragraphs[0],
    "NVIDIA Connect ISV Partner    ·    IBM Business Partner    ·    Amazon (AWS) Consulting Partner",
    13, GOLD, bold=True)
foot(s, 1)

content(2, "The problem", "Who is in control?", [
    "AI agents are starting to **act and pay** for enterprises.",
    "Europe regulates the **humans** and the **models** — nothing regulates the **agent**.",
    "Every answer today (x402, Google AP2, Stripe) is **US-custodial** and binds the human, not the agent.",
    "From **Dec 2027**, the EU AI Act makes getting this wrong an enforceable violation.",
])

content(3, "The solution · KYA running in production", "DWS IQ Aegis", [
    "**KYA — Know Your Agent:** identity binding · live trust score · Leash Snap revocation · Article-12 audit. **Running today.**",
    "Agent fleet across the **21 EU-regulated dual-use industries** in Aegis scope (25 platform-wide).",
    "Runs on the customer's **own NVIDIA DGX** — on-prem, weights stay on customer hardware.",
    "**Aegis GA September 2026** — pre-revenue today. The grant funds the leap.",
])

content(4, "The innovation · what the EIC funds", "From gating actions → acting under mandate", [
    "A signed, revocable **mandate credential** + a **selective-disclosure proof**.",
    "**Tier-aware Sovereignty Profile** (cloud · on-prem DGX · hybrid).",
    "**Signed Sovereignty Attestation** → EU AI Act compliance **machine-verifiable** across cloud, edge, air-gap.",
    "Deep tech (zero-knowledge cryptography). **TRL 6→8.** The lead patent claim.",
], tsize=34)

content(5, "Why now", "Regulation creates the demand", [
    "EU AI Act Articles 12/14/72 enforce for high-risk systems **Dec 2027**.",
    "EU sovereign rails: **EUDI Wallet** (law 12/2026), **ECB Digital Euro** pilot H2 2027.",
    "Agents transacting on EU rails need an **EU-sovereign trust layer**. US card-rail answers can't plug in.",
])

content(6, "Market", "Regulated EU industry — and beyond", [
    "Energy, manufacturing, construction, logistics, finance, healthcare — **25 verticals**.",
    "Carbon/compliance software: **~$24B (2025) → ~$191B (2035)**, 22.9% CAGR.",
    "Cross-domain pull: **EDA** — NVIDIA & Si2 DAC 2026 panel \"Agentic AI: Who's in Control?\"",
])

content(7, "Business model · traction", "A model that already prices", [
    "Aegis **€59,990** + subscriptions (€499–€2,999/mo) + outcome SKUs + grant-enabled **action tier**.",
    "**Cash break-even** on founder transport + consulting revenue; **2 enterprise pilots contracted Q1/26**; Outokumpu + Kemira in discussion.",
    "Every conformant third-party agent becomes a **channel**, not a competitor.",
])

content(8, "Competition · the sovereignty wedge", "Only one platform ticks all four", [
    "**EU-sovereign × agent-native × compliance-native × dual-use** = DWS IQ Aegis.",
    "x402 / AP2 / Stripe: US, card/crypto rails. Shufti/Onfido: verify humans, not agents.",
    "US players **can't** run inference in your building (CLOUD Act) or settle on EU rails. Aegis can.",
])

content(9, "Team", "Founder-led · partner-delivered · agent-multiplied", [
    "**Risto Anton Päärni** — Founder & CEO; architect of DWS IQ + KYA; NVIDIA/IBM/AWS partner; doctoral discussions with LUT.",
    "**Cubet Techno Labs** — CEO John Lovegin: standing bench ~20 engineers, no key-person risk, NDA in force.",
    "Academic anchoring: **LUT** (quantum-safe KYA research) · **KTH TECoSA** (safety assurance) · **Metropolia** (talent, 5/5 master's). **€650K SAFE** in progress.",
    "**Two-person core** + contracted engineering bench under NDA + our own agent fleet. Grant funds the key hires.",
], tsize=32)

content(10, "The ask", "€2.5M grant-only · 24 months · TRL 5→8", [
    "**M6** spec v1.0 + Sovereignty Profile · **M12** Signed Attestation in production.",
    "**M18** cross-border pilots (FI + SE) · **M24** certification path + €60k+ MRR.",
    "Fund the European answer for agents that transact — before the default is set elsewhere.",
])

out = "/home/user/dws6/docs/eic/EIC_STEP1_PITCH_DECK.pptx"
prs.save(out)
print("saved", out)
