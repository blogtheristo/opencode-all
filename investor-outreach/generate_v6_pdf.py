#!/usr/bin/env python3
"""
DWS IQ 6 — Investor Deck V6 PDF Generator
Brand: DWS Gamma Brand Standard v3.9 · Nordic Industrial Palette
Style: Nokia-grade investor deck — clean, minimal, authoritative
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, Color
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ─── DWS Brand Colors ───────────────────────────────────────────────
NAVY       = HexColor("#0A2463")
NAVY_LIGHT = HexColor("#0e3080")
NAVY_DARK  = HexColor("#071a4a")
STEEL      = HexColor("#3E3E3E")
PINE       = HexColor("#3A5A40")
PINE_LIGHT = HexColor("#4a7a52")
BIRCH      = HexColor("#F5F0E8")
SNOW       = HexColor("#FAFBFC")
GOLD       = HexColor("#FFD166")
GOLD_DARK  = HexColor("#d4a843")
RED        = HexColor("#D62828")
ICE        = HexColor("#B8D4E3")
TEXT_SEC   = HexColor("#94a3b8")
DARK_BG    = HexColor("#0f172a")
SURFACE    = HexColor("#1e293b")

# ─── Page Setup ──────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN = 22 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

# ─── Styles ──────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

# Cover styles
style_cover_company = ParagraphStyle(
    "CoverCompany", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=11, leading=14,
    textColor=GOLD, spaceAfter=4 * mm,
    letterSpacing=3,
)

style_cover_title = ParagraphStyle(
    "CoverTitle", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=28, leading=34,
    textColor=white, spaceAfter=6 * mm,
)

style_cover_subtitle = ParagraphStyle(
    "CoverSubtitle", parent=styles["Normal"],
    fontName="Helvetica", fontSize=13, leading=18,
    textColor=ICE, spaceAfter=4 * mm,
)

style_cover_date = ParagraphStyle(
    "CoverDate", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10, leading=13,
    textColor=TEXT_SEC,
)

# Section styles
style_section_num = ParagraphStyle(
    "SectionNum", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=10, leading=13,
    textColor=GOLD, spaceAfter=2 * mm,
    letterSpacing=2,
)

style_section_title = ParagraphStyle(
    "SectionTitle", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=18, leading=23,
    textColor=NAVY, spaceAfter=4 * mm,
)

style_body = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10, leading=15,
    textColor=STEEL, spaceAfter=3 * mm,
    alignment=TA_JUSTIFY,
)

style_body_bold = ParagraphStyle(
    "BodyBold", parent=style_body,
    fontName="Helvetica-Bold", textColor=NAVY_DARK,
)

style_bullet = ParagraphStyle(
    "Bullet", parent=style_body,
    leftIndent=12 * mm, bulletIndent=6 * mm,
    spaceBefore=1 * mm, spaceAfter=1 * mm,
)

style_label = ParagraphStyle(
    "Label", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=9, leading=12,
    textColor=GOLD_DARK, spaceAfter=1.5 * mm,
    letterSpacing=1,
)

style_footer = ParagraphStyle(
    "Footer", parent=styles["Normal"],
    fontName="Helvetica", fontSize=7.5, leading=10,
    textColor=TEXT_SEC, alignment=TA_CENTER,
)

style_confidential = ParagraphStyle(
    "Confidential", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=8, leading=10,
    textColor=RED, alignment=TA_CENTER, spaceAfter=2 * mm,
)

style_legal = ParagraphStyle(
    "Legal", parent=styles["Normal"],
    fontName="Helvetica", fontSize=7.5, leading=10,
    textColor=TEXT_SEC, alignment=TA_CENTER,
)

style_hypothesis_tag = ParagraphStyle(
    "HypothesisTag", parent=styles["Normal"],
    fontName="Helvetica-BoldOblique", fontSize=8, leading=11,
    textColor=HexColor("#b45309"), spaceAfter=2 * mm,
    borderWidth=1, borderColor=GOLD, borderPadding=4,
)

style_metric = ParagraphStyle(
    "Metric", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=11, leading=15,
    textColor=NAVY, leftIndent=8 * mm, spaceAfter=1.5 * mm,
)

style_metric_desc = ParagraphStyle(
    "MetricDesc", parent=style_body,
    fontSize=9, leading=13, leftIndent=8 * mm,
    spaceAfter=3 * mm,
)


# ─── Helpers ─────────────────────────────────────────────────────────
def gold_rule():
    return HRFlowable(
        width="100%", thickness=0.8, color=GOLD,
        spaceBefore=2 * mm, spaceAfter=4 * mm,
    )

def navy_rule():
    return HRFlowable(
        width="100%", thickness=0.4, color=HexColor("#cbd5e1"),
        spaceBefore=2 * mm, spaceAfter=4 * mm,
    )

def section(num, title):
    return [
        Spacer(1, 6 * mm),
        Paragraph(f"SECTION {num}", style_section_num),
        Paragraph(title, style_section_title),
        gold_rule(),
    ]

def bullet(text):
    return Paragraph(f"<bullet>&bull;</bullet> {text}", style_bullet)

def metric_block(number, desc):
    return [
        Paragraph(number, style_metric),
        Paragraph(desc, style_metric_desc),
    ]

def hypothesis_tag(text):
    return Paragraph(text, style_hypothesis_tag)


# ─── Cover Page ──────────────────────────────────────────────────────
def build_cover():
    """Full-bleed navy cover with gold accent."""
    elements = []

    # Top gold accent line
    elements.append(Spacer(1, 30 * mm))
    elements.append(HRFlowable(width="40%", thickness=2, color=GOLD, spaceAfter=8 * mm))

    elements.append(Paragraph("LIFETIME OY", style_cover_company))
    elements.append(Spacer(1, 4 * mm))
    elements.append(Paragraph("INVESTOR DECK", style_cover_title))
    elements.append(Paragraph("V6 · 2026 Q3", ParagraphStyle(
        "CoverVersion", parent=style_cover_title,
        fontSize=22, leading=28, textColor=GOLD,
    )))
    elements.append(Spacer(1, 10 * mm))
    elements.append(HRFlowable(width="60%", thickness=0.5, color=ICE, spaceAfter=6 * mm))
    elements.append(Paragraph("A governed system of action<br/>for regulated European industry.", style_cover_subtitle))
    elements.append(Spacer(1, 20 * mm))
    elements.append(Paragraph("CONFIDENTIAL — DRAFT FOR HIC APPROVAL", style_confidential))
    elements.append(Spacer(1, 8 * mm))
    elements.append(Paragraph("Lifetime Oy · Business ID 0772407-9 · VAT ID FI07724079", style_cover_date))
    elements.append(Paragraph("Risto Anton Päärni, Founder CEO", style_cover_date))
    elements.append(Paragraph("risto.paarni@lifetime.fi · +358 400 319 010", style_cover_date))

    elements.append(PageBreak())
    return elements


# ─── Section Pages ──────────────────────────────────────────────────
def build_thesis():
    els = []
    els += section("01", "THESIS")
    els.append(Paragraph(
        "Lifetime is building <b>DWS IQ</b>, a governed system of action for regulated European industry. "
        "It turns industrial workflows into controlled execution, signed evidence and reviewable outputs.",
        style_body
    ))
    els.append(Spacer(1, 4 * mm))
    els.append(Paragraph(
        "The company is <b>testing two routes to revenue</b>. Enterprise engagements are the current "
        "commercial focus. Nordic industrial SMEs are a second, <font color='#b45309'>unvalidated</font> entry scenario.",
        style_body
    ))
    els.append(PageBreak())
    return els


def build_commercial_question():
    els = []
    els += section("02", "THE COMMERCIAL QUESTION")
    els.append(Paragraph(
        "<b>Which route produces the first repeatable paid customer motion?</b>",
        ParagraphStyle("BigQuestion", parent=style_body, fontSize=13, leading=19,
                       textColor=NAVY, fontName="Helvetica-Bold", spaceAfter=6*mm)
    ))

    # Scenario box
    box_data = [
        [Paragraph("<b>SCENARIO A</b>", ParagraphStyle("BoxLabel", parent=style_body,
                    fontSize=9, textColor=GOLD_DARK, spaceAfter=1*mm))],
        [Paragraph("Enterprise-led deployment through a narrow, production-relevant workflow.", style_body)],
    ]
    box = Table(box_data, colWidths=[CONTENT_W - 4*mm])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), HexColor("#f0f4f8")),
        ("BOX", (0,0), (-1,-1), 0.5, HexColor("#cbd5e1")),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
        ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ]))
    els.append(box)
    els.append(Spacer(1, 3*mm))

    box_data2 = [
        [Paragraph("<b>SCENARIO B</b>", ParagraphStyle("BoxLabel2", parent=style_body,
                    fontSize=9, textColor=GOLD_DARK, spaceAfter=1*mm))],
        [Paragraph("SME entry through DWS IQ Essentials, followed by expansion to Pro and Enterprise.", style_body)],
    ]
    box2 = Table(box_data2, colWidths=[CONTENT_W - 4*mm])
    box2.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), HexColor("#f0f4f8")),
        ("BOX", (0,0), (-1,-1), 0.5, HexColor("#cbd5e1")),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
        ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ]))
    els.append(box2)
    els.append(Spacer(1, 5*mm))

    els.append(Paragraph(
        "Both scenarios use the same evidence architecture, control plane and contract model. "
        "<b>Neither is presented as validated</b> until a paid customer produces measurable evidence.",
        style_body
    ))
    els.append(PageBreak())
    return els


def build_enterprise_wedge():
    els = []
    els += section("03", "SCENARIO A · ENTERPRISE WEDGE")
    els.append(Paragraph(
        "<b>Target:</b> regulated industrial companies with a defined operational, compliance or evidence problem.",
        style_body
    ))
    els.append(Spacer(1, 2*mm))
    els.append(Paragraph(
        "Current commercial conversations include <b>Outokumpu</b> and <b>Kemira</b>. "
        "These are enterprise prospects and examples of customer-specific discovery, "
        "<font color='#b45309'>not booked revenue or validated repeatability</font>.",
        style_body
    ))
    els.append(Spacer(1, 4*mm))
    els.append(Paragraph("ENTRY MOTION", style_label))

    entries = [
        "one business owner",
        "one site, process or workflow",
        "one defined data boundary",
        "one measurable output",
        "one paid pilot decision",
    ]
    for e in entries:
        els.append(bullet(e))

    els.append(Spacer(1, 3*mm))
    els.append(Paragraph(
        "The product is adapted to the customer's problem. Partner products and infrastructure "
        "appear only when they solve a stated customer requirement.",
        style_body
    ))
    els.append(PageBreak())
    return els


def build_outokumpu():
    els = []
    els += section("04", "OUTOKUMPU EXAMPLE")
    els.append(Paragraph(
        "<b>Potential wedge:</b> signed, machine-readable emissions evidence for downstream "
        "customer and CBAM workflows.",
        style_body
    ))
    els.append(Spacer(1, 2*mm))
    els.append(Paragraph(
        "The hypothesis is that Outokumpu-sourced data could be delivered as an evidence packet "
        "that procurement, filing and audit systems can consume directly. The initial test is "
        "whether this replaces or improves an existing customer evidence package.",
        style_body
    ))
    els.append(Spacer(1, 4*mm))
    els.append(hypothesis_tag("HYPOTHESIS — NOT YET VALIDATED"))
    els.append(Spacer(1, 2*mm))
    els.append(Paragraph("VALIDATION REQUIRED", style_label))
    for item in [
        "customer-owned workflow confirmed",
        "data source and verification authority confirmed",
        "measurable time, cost or acceptance benefit",
        "paid pilot scope and buyer identified",
    ]:
        els.append(bullet(item))
    els.append(PageBreak())
    return els


def build_kemira():
    els = []
    els += section("05", "KEMIRA EXAMPLE")
    els.append(Paragraph(
        "<b>Potential wedge:</b> chemical process compliance recording using a customer-specific "
        "demo and controlled data upload.",
        style_body
    ))
    els.append(Spacer(1, 2*mm))
    els.append(Paragraph(
        "The demonstration should use a defined scenario, such as process compliance recording, "
        "with a bounded CSV or approved sample dataset. The output must show the evidence produced, "
        "who reviews it and what a paid pilot would prove.",
        style_body
    ))
    els.append(Spacer(1, 4*mm))
    els.append(hypothesis_tag("HYPOTHESIS — NOT YET VALIDATED"))
    els.append(Spacer(1, 2*mm))
    els.append(Paragraph("VALIDATION REQUIRED", style_label))
    for item in [
        "real process and pain point confirmed",
        "data boundary approved",
        "output reviewed by the responsible operator or compliance owner",
        "pilot benefit and acceptance criteria agreed",
    ]:
        els.append(bullet(item))
    els.append(PageBreak())
    return els


def build_sme_hypothesis():
    els = []
    els += section("06", "SCENARIO B · SME ENTRY HYPOTHESIS")
    els.append(hypothesis_tag("HYPOTHESIS — UNVALIDATED SCENARIO"))
    els.append(Spacer(1, 2*mm))
    els.append(Paragraph(
        "<b>Target scenario:</b> Nordic industrial SME with multiple services or sites, "
        "a small IT team and a concrete need for safe updates, operational inventory or evidence.",
        style_body
    ))
    els.append(Spacer(1, 2*mm))
    els.append(Paragraph(
        "DWS IQ Essentials is planned as the low-friction entry tier. The target customer profile, "
        "budget, decision cycle and Q4 timing are <font color='#b45309'>hypotheses, not traction</font>.",
        style_body
    ))
    els.append(Spacer(1, 4*mm))
    els.append(Paragraph("ESSENTIALS WOULD INCLUDE", style_label))
    for item in [
        "inventory and service visibility",
        "evidence and audit export",
        "safe updates, health checks and rollback",
        "CLI and managed deployment",
        "GitHub and one operational runtime connector",
    ]:
        els.append(bullet(item))
    els.append(PageBreak())
    return els


def build_sme_ladder():
    els = []
    els += section("07", "SME LADDER HYPOTHESIS")
    els.append(Paragraph(
        "<b>Essentials → Pro → Enterprise.</b>",
        ParagraphStyle("Ladder", parent=style_body, fontSize=14, leading=19,
                       textColor=NAVY, fontName="Helvetica-Bold", spaceAfter=4*mm)
    ))
    els.append(Paragraph(
        "The test is whether a customer first buys operational risk reduction, then asks for "
        "governance, analytics or broader deployment capability.",
        style_body
    ))
    els.append(Spacer(1, 4*mm))
    els.append(hypothesis_tag("PLANNED TESTS — NOT CURRENT PERFORMANCE"))
    els.append(Spacer(1, 2*mm))
    els.append(Paragraph("VALIDATION METRICS", style_label))

    metrics = [
        (">50%", "of beta customers deploy within two weeks"),
        (">80%", "connect both launch connectors"),
        (">30%", "buy Pro within 90 days"),
    ]
    for num, desc in metrics:
        els.extend(metric_block(num, f"of beta customers — {desc}" if "beta" in desc else f"{desc}"))

    els.append(Spacer(1, 2*mm))
    els.append(Paragraph(
        "<i>Upgrade reason is governance or analytics, not missing core functionality.</i>",
        ParagraphStyle("Italic", parent=style_body, fontSize=9, textColor=TEXT_SEC)
    ))
    els.append(PageBreak())
    return els


def build_proven():
    els = []
    els += section("08", "WHAT IS PROVEN TODAY")
    els.append(Paragraph(
        "These are the factual foundations of the business:",
        style_body
    ))
    els.append(Spacer(1, 2*mm))
    for item in [
        "Lifetime has industrial software and compliance experience.",
        "DWS IQ is being structured around governed execution and evidence.",
        "Outokumpu and Kemira provide concrete enterprise discovery contexts.",
        "The current commercial work is narrowing toward customer-specific workflows and paid pilots.",
    ]:
        els.append(bullet(item))

    els.append(Spacer(1, 6*mm))

    # "Not claimed" box
    not_data = [
        [Paragraph("<b>NOT CLAIMED</b>", ParagraphStyle("NotClaimedLabel", parent=style_body,
                    fontSize=9, textColor=RED, spaceAfter=1*mm))],
        [Paragraph(
            "Validated SME demand · Essentials revenue · Repeatable enterprise conversion · "
            "Retention · Churn · Software revenue beyond the canonical register",
            ParagraphStyle("NotClaimedBody", parent=style_body, fontSize=9, leading=13, textColor=STEEL)
        )],
    ]
    not_box = Table(not_data, colWidths=[CONTENT_W - 4*mm])
    not_box.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), HexColor("#fef2f2")),
        ("BOX", (0,0), (-1,-1), 0.5, HexColor("#fca5a5")),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
        ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ]))
    els.append(not_box)
    els.append(PageBreak())
    return els


def build_business_model():
    els = []
    els += section("09", "BUSINESS MODEL")
    els.append(Paragraph(
        "<b>Enterprise:</b> paid discovery or pilot, followed by production deployment and expansion.",
        style_body
    ))
    els.append(Paragraph(
        "<b>SME scenario:</b> Essentials entry, modular Pro expansion and eventual Enterprise path.",
        style_body
    ))
    els.append(Spacer(1, 4*mm))
    els.append(Paragraph("REVENUE SOURCES REMAIN SEPARATE", style_label))
    for item in [
        "software and governance",
        "deployment and integration",
        "recurring support",
    ]:
        els.append(bullet(item))
    els.append(Spacer(1, 3*mm))
    els.append(Paragraph(
        "The product architecture is shared. Commercial validation is separate by scenario.",
        style_body
    ))
    els.append(PageBreak())
    return els


def build_execution():
    els = []
    els += section("10", "EXECUTION PLAN")
    steps = [
        "Convert one enterprise conversation into a paid, bounded pilot.",
        "Produce a measurable customer-owned outcome for Outokumpu or Kemira.",
        "Complete the Essentials launch gate before selling it.",
        "Run the first SME beta only after deployment, rollback, evidence export, isolation and support controls pass.",
        "Compare both motions by time to paid commitment, delivery effort, referenceability and expansion signal.",
    ]
    for i, step in enumerate(steps, 1):
        num_style = ParagraphStyle("ExecNum", parent=style_body, fontName="Helvetica-Bold",
                                    fontSize=22, leading=26, textColor=GOLD, spaceAfter=0)
        text_style = ParagraphStyle("ExecText", parent=style_body, spaceBefore=0)
        row = Table(
            [[Paragraph(f"{i}", num_style), Paragraph(step, text_style)]],
            colWidths=[14*mm, CONTENT_W - 18*mm],
        )
        row.setStyle(TableStyle([
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("TOPPADDING", (0,0), (-1,-1), 2),
            ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ]))
        els.append(row)
    els.append(PageBreak())
    return els


def build_funding():
    els = []
    els += section("11", "FUNDING ASK")

    # Big number
    els.append(Paragraph(
        "€650k SAFE",
        ParagraphStyle("BigNumber", parent=style_body, fontName="Helvetica-Bold",
                       fontSize=30, leading=36, textColor=NAVY, alignment=TA_CENTER, spaceAfter=6*mm)
    ))

    # Terms table
    terms = [
        ["Valuation cap", "€3.8M post-money"],
        ["Discount", "20%"],
        ["Maturity", "24 months"],
    ]
    t = Table(terms, colWidths=[50*mm, 80*mm])
    t.setStyle(TableStyle([
        ("FONTNAME", (0,0), (0,-1), "Helvetica-Bold"),
        ("FONTNAME", (1,0), (1,-1), "Helvetica"),
        ("FONTSIZE", (0,0), (-1,-1), 11),
        ("TEXTCOLOR", (0,0), (0,-1), NAVY),
        ("TEXTCOLOR", (1,0), (1,-1), STEEL),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("LINEBELOW", (0,0), (-1,-2), 0.3, HexColor("#e2e8f0")),
        ("ALIGN", (0,0), (-1,-1), "LEFT"),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ]))
    els.append(t)
    els.append(Spacer(1, 6*mm))

    els.append(Paragraph("USE OF FUNDS", style_label))
    els.append(Paragraph(
        "Enterprise pilot execution and conversion, Essentials launch-gate completion, "
        "EU sovereignty and evidence controls, and customer delivery capacity.",
        style_body
    ))
    els.append(Spacer(1, 3*mm))
    els.append(Paragraph(
        "<i>The purpose of the round is to test and convert the two GTM scenarios, "
        "not to imply that either is already proven.</i>",
        ParagraphStyle("Disclaimer", parent=style_body, fontSize=9, textColor=TEXT_SEC)
    ))
    els.append(PageBreak())
    return els


def build_decision():
    els = []
    els += section("12", "INVESTOR DECISION")
    els.append(Paragraph(
        "Back Lifetime's ability to turn narrow regulated-industrial workflows into "
        "repeatable paid deployments, while treating the SME ladder as a measured scenario "
        "rather than established traction.",
        ParagraphStyle("DecisionText", parent=style_body, fontSize=13, leading=19,
                       textColor=NAVY, fontName="Helvetica-Bold", spaceAfter=8*mm)
    ))

    els.append(gold_rule())
    els.append(Spacer(1, 4*mm))
    els.append(Paragraph("Lifetime Oy", ParagraphStyle("EndName", parent=style_body,
        fontName="Helvetica-Bold", fontSize=12, textColor=NAVY, alignment=TA_CENTER)))
    els.append(Paragraph("Business ID 0772407-9 · VAT ID FI07724079", style_legal))
    els.append(Spacer(1, 2*mm))
    els.append(Paragraph("Risto Anton Päärni, Founder CEO", style_legal))
    els.append(Paragraph("risto.paarni@lifetime.fi · +358 400 319 010", style_legal))
    els.append(Spacer(1, 6*mm))
    els.append(Paragraph("CONFIDENTIAL — DRAFT FOR HIC APPROVAL", style_confidential))
    return els


# ─── Page Templates ─────────────────────────────────────────────────
def cover_bg(canvas, doc):
    """Draw full-bleed navy background on cover page."""
    canvas.saveState()
    canvas.setFillColor(NAVY_DARK)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # Gold accent stripe at bottom
    canvas.setFillColor(GOLD)
    canvas.rect(0, 0, PAGE_W, 3 * mm, fill=1, stroke=0)
    canvas.restoreState()

def page_bg(canvas, doc):
    """Draw standard page background with subtle header rule."""
    canvas.saveState()
    # Light background
    canvas.setFillColor(SNOW)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # Top gold accent line
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1.5)
    canvas.line(MARGIN, PAGE_H - 14*mm, PAGE_W - MARGIN, PAGE_H - 14*mm)
    # Header text
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(TEXT_SEC)
    canvas.drawString(MARGIN, PAGE_H - 12*mm, "LIFETIME OY · CONFIDENTIAL")
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 12*mm, "INVESTOR DECK V6 · 2026 Q3")
    # Footer
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(TEXT_SEC)
    canvas.drawCentredString(PAGE_W / 2, 10*mm, f"Page {doc.page}")
    canvas.restoreState()


# ─── Build PDF ──────────────────────────────────────────────────────
OUTPUT = "/home/admin100/dws6/investor-outreach/V6-DWS-IQ6-InvestorPD_2026.pdf"

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    leftMargin=MARGIN,
    rightMargin=MARGIN,
    topMargin=20 * mm,
    bottomMargin=18 * mm,
)

story = []
story.extend(build_cover())
story.extend(build_thesis())
story.extend(build_commercial_question())
story.extend(build_enterprise_wedge())
story.extend(build_outokumpu())
story.extend(build_kemira())
story.extend(build_sme_hypothesis())
story.extend(build_sme_ladder())
story.extend(build_proven())
story.extend(build_business_model())
story.extend(build_execution())
story.extend(build_funding())
story.extend(build_decision())

# Build with page templates
doc.build(story, onFirstPage=cover_bg, onLaterPages=page_bg)
print(f"PDF generated: {OUTPUT}")
print(f"Size: {os.path.getsize(OUTPUT) / 1024:.0f} KB")
