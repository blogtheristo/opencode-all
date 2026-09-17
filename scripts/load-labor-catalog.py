#!/usr/bin/env python3
"""
One-shot merger: loads the labor-anchored SKU catalog into
dws10.com/config/products.json AND its landing-pages mirror.

Reads:    dws10.com/config/products.json
Writes:   dws10.com/config/products.json
          landing-pages/dws10-com/config/products.json

Idempotent — re-running on an up-to-date config is a no-op (SKUs match by key).
Every SKU is loaded deploymentColor="blue" (pilot). No Green flips.

Spec source: docs/marketing/PRODUCT-CATALOG-UPSELL-TIERS-2026.md §2-§4.
"""

import json
import shutil
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SRC = REPO_ROOT / "dws10.com" / "config" / "products.json"
MIRROR = REPO_ROOT / "landing-pages" / "dws10-com" / "config" / "products.json"
PRICE_VERSION = "1.15"

# --- Compact spec --------------------------------------------------------------
# Format per row: (sku, tier, name, price, priceUnit, agents, replaces,
#                  nextUpsellSku, storeCategory, brand, description)
# `replaces` is (role, fteCount, fullyLoadedAnnualCostEUR | None)

SINGLE_AGENT = [
    # CMP — Compliance
    ("CMP-T0", "T0", "Compliance Agent — Pilot (60 days)", 0, "per-month",
     ["compliance"], ("Junior compliance analyst", 0.25, 18000), "CMP-T1",
     "platform", "DWS IQ",
     "60-day pilot of the Compliance Agent. 2 gap analyses, watermarked, no SLA."),
    ("CMP-T1", "T1", "Compliance Agent — Starter", 1499, "per-month",
     ["compliance"], ("Junior compliance analyst", 0.5, 36000), "CMP-T2",
     "platform", "DWS IQ",
     "Up to 3 gap analyses per month, basic SLA, EU residency."),
    ("CMP-T2", "T2", "Compliance Agent — Pro", 2999, "per-month",
     ["compliance"], ("Senior compliance analyst", 0.8, 72000), "ESG-T3",
     "platform", "DWS IQ",
     "Unlimited compliance outcomes, audit pack, EU AI Act co-sign-ready."),
    ("CMP-OC-STD", "meter", "Outcome — CSRD/CBAM/AI Act gap (Standard)", 999, "per-outcome",
     ["compliance"], ("Compliance analyst", 0.05, 3600), "CMP-T1",
     "platform", "DWS IQ",
     "Single-domain compliance gap analysis."),
    ("CMP-OC-ENT", "meter", "Outcome — CSRD/CBAM/AI Act gap (Enterprise)", 2499, "per-outcome",
     ["compliance"], ("Senior compliance analyst", 0.08, 7200), "CMP-T2",
     "platform", "DWS IQ",
     "Audit-pack signed-off compliance gap analysis."),
    # SS — SiteSense
    ("SS-T0", "T0", "SiteSense — Pilot (30 days, 1 site)", 0, "per-month",
     ["sitesense"], ("HSE supervisor", 0.2, 14000), "SS-T1",
     "platform", "DWS IQ",
     "30-day pilot, 5 site-safety assessments, watermarked."),
    ("SS-T1", "T1", "SiteSense — Starter", 1499, "per-month",
     ["sitesense"], ("HSE supervisor", 0.4, 28000), "SS-T2",
     "platform", "DWS IQ",
     "30 site-safety assessments/month, single site."),
    ("SS-T2", "T2", "SiteSense — Pro", 2499, "per-month",
     ["sitesense"], ("HSE supervisor", 0.8, 56000), "CONSTR-T3",
     "platform", "DWS IQ",
     "Unlimited sites, audit trail, EN 13001 crane warnings."),
    ("SS-OC-STD", "meter", "Outcome — Site safety assessment (Standard)", 49, "per-site-per-day",
     ["sitesense"], ("HSE supervisor", 0.01, 700), "SS-T1",
     "platform", "DWS IQ",
     "Daily site safety score, single site."),
    ("SS-OC-ENT", "meter", "Outcome — Site safety assessment (Enterprise)", 99, "per-site-per-day",
     ["sitesense"], ("HSE supervisor", 0.02, 1400), "SS-T2",
     "platform", "DWS IQ",
     "Signed-off insurance-ready daily site safety score."),
    # MO — Material Oracle
    ("MO-T0", "T0", "Material Oracle — Pilot (60 days, 1 project)", 0, "per-month",
     ["material-oracle"], ("LCA analyst", 0.2, 16000), "MO-T1",
     "platform", "DWS IQ",
     "60-day pilot, 1 LCA report, watermarked."),
    ("MO-T1", "T1", "Material Oracle — Starter", 1299, "per-month",
     ["material-oracle"], ("LCA analyst", 0.3, 24000), "MO-T2",
     "platform", "DWS IQ",
     "Up to 2 LCA reports per month."),
    ("MO-T2", "T2", "Material Oracle — Pro", 1999, "per-month",
     ["material-oracle"], ("Senior LCA analyst", 0.6, 54000), "ESG-T3",
     "platform", "DWS IQ",
     "Unlimited LCA reports, EN 15978 A1–D, audit pack."),
    ("MO-OC-STD", "meter", "Outcome — LCA report (Standard)", 499, "per-outcome",
     ["material-oracle"], ("LCA analyst", 0.03, 2400), "MO-T1",
     "platform", "DWS IQ",
     "Single-project EN 15978 LCA report."),
    ("MO-OC-ENT", "meter", "Outcome — LCA report (Enterprise)", 999, "per-outcome",
     ["material-oracle"], ("Senior LCA analyst", 0.05, 4500), "MO-T2",
     "platform", "DWS IQ",
     "Signed and supplier-data-validated EN 15978 LCA report."),
    # ED — Emissions Data
    ("ED-T1", "T1", "Emissions Data — Starter", 999, "per-month",
     ["emissions-data"], ("ESG data analyst", 0.25, 22500), "ED-T2",
     "platform", "DWS IQ",
     "Scope 1/2/3 dataset with monthly variance."),
    ("ED-T2", "T2", "Emissions Data — Pro", 1499, "per-month",
     ["emissions-data"], ("ESG data analyst", 0.5, 45000), "ESG-T3",
     "platform", "DWS IQ",
     "Unlimited datasets, supplier reach."),
    # SG — Schedule Genius
    ("SG-T1", "T1", "Schedule Genius — Starter", 1299, "per-month",
     ["schedule-genius"], ("Project planner", 0.3, 27000), "SG-T2",
     "platform", "DWS IQ",
     "Up to 2 project plans per month."),
    ("SG-T2", "T2", "Schedule Genius — Pro", 1999, "per-month",
     ["schedule-genius"], ("Project planner", 0.6, 54000), "CONSTR-T3",
     "platform", "DWS IQ",
     "Unlimited plans, risk-pass automation."),
    ("CONSTR-T2", "T2", "Construction Agent — Pro (bundle)", 3999, "per-month",
     ["sitesense", "material-oracle", "schedule-genius"], ("Construction PM", 0.7, 70000), "CONSTR-T3",
     "platform", "DWS IQ",
     "Safety + materials + plan in one assessment workflow."),
    # LOG — Logistics
    ("LOG-T1", "T1", "Logistics — Starter", 1299, "per-month",
     ["logistics"], ("Logistics planner", 0.3, 24000), "LOG-T2",
     "platform", "DWS IQ",
     "Up to 5 lanes."),
    ("LOG-T2", "T2", "Logistics — Pro", 1799, "per-month",
     ["logistics"], ("Logistics planner", 0.5, 40000), "CONSTR-T3",
     "platform", "DWS IQ",
     "Unlimited lanes, ETA risk model."),
    # SOV — Sovereignty
    ("SOV-T1", "T1", "Sovereignty Monitor — Starter", 1299, "per-month",
     ["sovereignty"], ("DPO assistant", 0.2, 18000), "SOV-T2",
     "platform", "DWS IQ",
     "Monthly database sovereignty assessment."),
    ("SOV-T2", "T2", "Sovereignty Monitor — Pro", 1999, "per-month",
     ["sovereignty"], ("DPO assistant", 0.5, 45000), "SOV-T3",
     "platform", "DWS IQ",
     "Continuous monitoring, NIS2 reports."),
    # QG — Quality Gate
    ("QG-T1", "T1", "Quality Gate — Starter", 999, "per-month",
     ["quality-gate"], ("QA reviewer", 0.2, 16000), "QG-T2",
     "platform", "DWS IQ",
     "Up to 10k verified outputs/month."),
    ("QG-T2", "T2", "Quality Gate — Pro", 1499, "per-month",
     ["quality-gate"], ("QA reviewer", 0.4, 32000), None,
     "platform", "DWS IQ",
     "Unlimited outputs, schema/citation audit. Attached-only — no upsell ladder."),
    # CSAT — Customer Sat
    ("CSAT-T1", "T1", "Customer Sat — Starter", 599, "per-month",
     ["customer-sat"], ("Customer success analyst", 0.15, 12000), "CSAT-T2",
     "platform", "DWS IQ",
     "1 cohort tracked."),
    ("CSAT-T2", "T2", "Customer Sat — Pro", 999, "per-month",
     ["customer-sat"], ("Customer success analyst", 0.3, 24000), "GTM-T3",
     "platform", "DWS IQ",
     "Unlimited cohorts, churn flag."),
    # LF — Lead Feedback
    ("LF-T1", "T1", "Lead Feedback — Starter", 599, "per-month",
     ["lead-feedback"], ("Sales analyst", 0.15, 12000), "LF-T2",
     "platform", "DWS IQ",
     "Weekly pipeline review."),
    ("LF-T2", "T2", "Lead Feedback — Pro", 999, "per-month",
     ["lead-feedback"], ("Sales analyst", 0.3, 24000), "GTM-T3",
     "platform", "DWS IQ",
     "Continuous review, objection map."),
    # CS — Competitor Surveillance
    ("CS-T1", "T1", "Competitor Surveillance — Starter", 899, "per-month",
     ["competitor-surveillance"], ("Market analyst", 0.2, 18000), "CS-T2",
     "platform", "DWS IQ",
     "Monthly brief, single segment."),
    ("CS-T2", "T2", "Competitor Surveillance — Pro", 1499, "per-month",
     ["competitor-surveillance"], ("Market analyst", 0.4, 36000), "GTM-T3",
     "platform", "DWS IQ",
     "Continuous, multi-segment surveillance."),
    # SEO — SEO Audit
    ("SEO-T1", "T1", "SEO Audit — Starter", 599, "per-month",
     ["seo-audit"], ("SEO specialist", 0.1, 9000), "SEO-T2",
     "platform", "DWS IQ",
     "Quarterly audit."),
    ("SEO-T2", "T2", "SEO Audit — Pro", 999, "per-month",
     ["seo-audit"], ("SEO specialist", 0.25, 22500), "GTM-T3",
     "platform", "DWS IQ",
     "Monthly audit plus recommendations."),
    # DW — Deepwiki Extractor
    ("DW-T1", "T1", "Deepwiki Extractor — Starter", 599, "per-month",
     ["deepwiki-extractor"], ("Research analyst", 0.1, 8000), "DW-T2",
     "platform", "DWS IQ",
     "Up to 5 source packs."),
    ("DW-T2", "T2", "Deepwiki Extractor — Pro", 799, "per-month",
     ["deepwiki-extractor"], ("Research analyst", 0.2, 16000), None,
     "platform", "DWS IQ",
     "Unlimited extractions, structured outputs. Attached-only."),
    # VIA — Viability
    ("VIA-T1", "T1", "Viability — Starter", 999, "per-month",
     ["viability"], ("Strategy analyst", 0.2, 20000), "VIA-T2",
     "platform", "DWS IQ",
     "One go/no-go scoring per quarter."),
    ("VIA-T2", "T2", "Viability — Pro", 1499, "per-month",
     ["viability"], ("Strategy analyst", 0.4, 40000), None,
     "platform", "DWS IQ",
     "Continuous scoring plus sensitivity. Attached-only."),
    # TH — Themis
    ("TH-T2", "T2", "Themis Coordinator — Pro", 2499, "per-month",
     ["themis"], ("Ops coordinator", 0.5, 40000), "WF-T4",
     "platform", "DWS IQ",
     "Case routing, sub-agent assignment, KYA chain."),
]

BUNDLES_T3_T4 = [
    # ── Domain-cut T3 bundles ────────────────────────────────────────────────
    ("ESG-T3", "T3", "ESG Function-as-a-Service", 6999, "per-month",
     ["material-oracle", "emissions-data", "compliance", "themis"],
     ("ESG/Compliance lead", 1.75, 157500), "WF-T4",
     "platform", "DWS IQ",
     "ESG function bundle (Material Oracle + Emissions Data + Compliance + Themis)."),
    ("HSE-T3", "T3", "HSE Function-as-a-Service", 4999, "per-month",
     ["sitesense", "compliance", "themis"],
     ("HSE supervisor", 1.25, 87500), "WF-T4",
     "platform", "DWS IQ",
     "HSE function bundle (SiteSense + Compliance-HSE-scope + Themis)."),
    ("CONSTR-T3", "T3", "Construction Ops Pod", 8499, "per-month",
     ["sitesense", "material-oracle", "schedule-genius", "logistics", "themis"],
     ("Construction PM and planner", 2.0, 180000), "WF-T4",
     "platform", "DWS IQ",
     "Construction function bundle (Construction + Schedule Genius + Logistics + Themis)."),
    ("SOV-T3", "T3", "Sovereignty & Compliance Pack", 5499, "per-month",
     ["sovereignty", "compliance", "quality-gate"],
     ("Compliance + 0.3 DPO", 1.3, 117000), "WF-T4",
     "platform", "DWS IQ",
     "Sovereignty + Compliance + Quality Gate bundle."),
    ("GTM-T3", "T3", "Go-to-Market Pod", 3999, "per-month",
     ["seo-audit", "competitor-surveillance", "lead-feedback", "customer-sat"],
     ("Marketing and CS analysts", 1.5, 120000), "WF-T4",
     "platform", "DWS IQ",
     "GTM bundle (SEO + Competitor Surveillance + Lead Feedback + CSAT)."),
    ("WF-T4", "T4", "Full Skilled Workforce", 19990, "per-month",
     ["all"],
     ("Multi-disciplinary FTE team", 7.0, 700000), None,
     "platform", "DWS IQ",
     "All 16 Skilled Agents under Themis orchestration with premium SLA."),
    # ── Brand-cut T3 bundles (added 14.05.2026) ──────────────────────────────
    # These three sit ALONGSIDE the domain-cut T3 bundles above. They do not
    # replace anything — they package the same underlying Skilled Agents
    # under brand identities tuned to specific channels (Microsoft Agent 365 /
    # Salesforce Agentforce / Agentic Commerce 365).
    ("DWS365-CMP-T3", "T3", "DWS 365 Compliance Agents", 5999, "per-month",
     ["compliance", "sovereignty", "quality-gate", "themis"],
     ("Compliance officer + 0.3 DPO", 1.5, 135000), "WF-T4",
     "platform", "DWS 365",
     "DWS 365 brand bundle — compliance pod packaged for the Microsoft Agent 365 channel. Compliance + Sovereignty + Quality Gate under Themis orchestration."),
    ("FH-SKILL-T3", "T3", "Firehorse Skilled Agents", 5499, "per-month",
     ["lead-feedback", "customer-sat", "competitor-surveillance", "seo-audit", "themis"],
     ("Marketing/CS team lead", 1.4, 112000), "WF-T4",
     "platform", "Firehorse",
     "Firehorse brand bundle — growth pod packaged for Salesforce Agentforce and direct sales. SEO + Competitor Surveillance + Lead Feedback + CSAT under Themis orchestration."),
    ("AC365-T3", "T3", "Agentic Commerce 365 Skilled Agents", 6499, "per-month",
     ["customer-sat", "viability", "schedule-genius", "logistics", "themis"],
     ("Commerce ops lead", 1.5, 120000), "WF-T4",
     "platform", "Agentic Commerce 365",
     "Agentic Commerce 365 brand bundle — commerce/operations pod packaged for the Microsoft Agent 365 channel. CSAT + Viability + Schedule Genius + Logistics under Themis orchestration."),
]

INDUSTRY_PODS = [
    ("IND-MARS", "Mars — Construction industry pod", 999, "construction"),
    ("IND-HELIOS", "Helios — Energy industry pod", 999, "energy"),
    ("IND-VULCAN", "Vulcan — Steel industry pod", 1499, "steel ETS/CBAM"),
    ("IND-TALOS", "Talos — Aluminium industry pod", 1499, "aluminium ETS/CBAM"),
    ("IND-GAIA", "Gaia — Cement industry pod", 1499, "cement ETS/CBAM"),
    ("IND-CERES", "Ceres — Agri / Circular industry pod", 999, "agri/circular"),
    ("IND-NEPTUN", "Neptune — Maritime industry pod", 999, "maritime ops"),
    ("IND-PROM", "Prometheus — Hydrogen industry pod", 1499, "hydrogen"),
    ("IND-BESS", "BESS — Battery storage industry pod", 1499, "battery storage"),
]

LAND_OVERLAY = [
    ("LAND-AIL", "AI Literacy Bridge", 34990, 29990, "CMP-T2",
     "EU AI Act Literacy programme (20 seats) + 12-month T2 Compliance agent.",
     ["compliance"], ("AI literacy programme manager", 0.4, 36000)),
    ("LAND-EUAI", "EU AI Act Compliance Sprint", 39990, 29990, "CMP-T2",
     "5-day senior compliance sprint + 12-month T2 Compliance agent.",
     ["compliance"], ("Senior compliance lead", 0.6, 54000)),
    ("LAND-HSE", "Site Safety Bootcamp", 29990, 24990, "SS-T2",
     "3-day site-safety training + 2-day audit + 12-month T2 SiteSense.",
     ["sitesense"], ("HSE supervisor", 0.7, 49000)),
    ("LAND-CSRD", "CSRD Reporting Accelerator", 89990, 69990, "ESG-T3",
     "10-day ESG accelerator + 12-month T3 ESG bundle.",
     ["material-oracle", "emissions-data", "compliance", "themis"],
     ("ESG reporting lead", 1.5, 135000)),
    ("LAND-LCA", "Carbon Reporting Sprint", 49990, 39990, "MO-T2",
     "5-day LCA sprint + 12-month T2 Material Oracle/Emissions Data.",
     ["material-oracle", "emissions-data"], ("LCA specialist", 0.8, 64000)),
    ("LAND-SOV", "Sovereignty & NIS2 Sprint", 69990, 54990, "SOV-T3",
     "5-day sovereignty audit + 12-month T3 Sovereignty pack.",
     ["sovereignty", "compliance", "quality-gate"], ("Compliance + DPO", 1.0, 90000)),
    ("LAND-OPS", "Construction Ops Pilot", 109990, 84990, "CONSTR-T3",
     "4–8 week site pilot + 12-month T3 Construction Ops Pod.",
     ["sitesense", "material-oracle", "schedule-genius", "logistics", "themis"],
     ("Construction PM and planner", 1.8, 162000)),
    ("LAND-GTM", "Go-to-Market Sprint", 49990, 39990, "GTM-T3",
     "5-day GTM sprint + 12-month T3 GTM pod.",
     ["seo-audit", "competitor-surveillance", "lead-feedback", "customer-sat"],
     ("GTM analyst team", 1.3, 104000)),
    ("LAND-THEMIS", "Themis Coordinator Workshop", 29990, 24990, "TH-T2",
     "3-day Themis workshop + 12-month T2 Themis Coordinator.",
     ["themis"], ("Ops coordinator", 0.5, 40000)),
    ("LAND-WF", "Full Workforce Onboarding", 249990, 199990, "WF-T4",
     "20-day onboarding + 12-month T4 Full Skilled Workforce.",
     ["all"], ("Multi-disciplinary FTE team", 6.5, 650000)),
]


def make_replaces(role: str, fte: float, fully_loaded_eur: int | None) -> dict:
    out = {"role": role, "fteCount": fte}
    if fully_loaded_eur is not None:
        out["fullyLoadedAnnualCostEUR"] = fully_loaded_eur
    return out


def single_agent_entries() -> list[tuple[str, dict]]:
    out = []
    for (sku, tier, name, price, unit, agents, replaces, nxt,
         storeCategory, brand, description) in SINGLE_AGENT:
        out.append((sku, {
            "id": sku,
            "sku": sku,
            "mpn": sku,
            "name": name,
            "price": price,
            "currency": "EUR",
            "type": "subscription" if unit in ("per-month", "per-year") else "metered",
            "priceUnit": unit,
            "tier": tier,
            "agents": list(agents),
            "replaces": make_replaces(*replaces),
            "nextUpsellSku": nxt,
            "deploymentColor": "blue",
            "priceVersion": PRICE_VERSION,
            "description": description,
            "features": [
                f"Replaces {replaces[0]} ≈ {replaces[1]} FTE",
                f"Tier {tier}",
                "Blue/pilot — internal sign-off required before quoting",
            ],
            "priceNote": f"€{price:,.0f} {unit} — Blue/pilot" if price else "Pilot — capped, watermarked",
            "image": "/DWS_IQ2026.png",
            "detailsUrl": "../products/skilled-agents.html",
            "featured": False,
            "storeCategory": storeCategory,
            "brand": brand,
            "version": "1.0",
            "google": {
                "productCategory": "Software > Business & Productivity Software",
                "condition": "new",
                "availability": "in_stock",
                "brand": brand,
                "targetCountry": "FI",
                "contentLanguage": "en",
            },
        }))
    return out


def bundle_entries() -> list[tuple[str, dict]]:
    out = []
    for (sku, tier, name, price, unit, agents, replaces, nxt,
         storeCategory, brand, description) in BUNDLES_T3_T4:
        annual = price * 10  # 10× monthly = 2 months free
        out.append((sku, {
            "id": sku,
            "sku": sku,
            "mpn": sku,
            "name": name,
            "price": price,
            "annualPrice": annual,
            "currency": "EUR",
            "type": "subscription",
            "priceUnit": unit,
            "tier": tier,
            "agents": list(agents),
            "replaces": make_replaces(*replaces),
            "nextUpsellSku": nxt,
            "deploymentColor": "blue",
            "priceVersion": PRICE_VERSION,
            "description": description,
            "features": [
                f"Replaces {replaces[0]} ≈ {replaces[1]} FTE",
                f"Tier {tier} — Function/Workforce bundle",
                "Blue/pilot — internal sign-off required before quoting",
            ],
            "priceNote": f"€{price:,.0f}/mo — annual €{annual:,.0f} (2 months free)",
            "image": "/DWS_IQ2026.png",
            "detailsUrl": "../products/skilled-agents.html",
            "featured": False,
            "storeCategory": storeCategory,
            "brand": brand,
            "version": "1.0",
            "google": {
                "productCategory": "Software > Business & Productivity Software",
                "condition": "new",
                "availability": "in_stock",
                "brand": brand,
                "targetCountry": "FI",
                "contentLanguage": "en",
            },
        }))
    return out


def industry_pod_entries() -> list[tuple[str, dict]]:
    out = []
    for (sku, name, addon, vertical) in INDUSTRY_PODS:
        annual = addon * 10
        out.append((sku, {
            "id": sku,
            "sku": sku,
            "mpn": sku,
            "name": name,
            "price": addon,
            "annualPrice": annual,
            "currency": "EUR",
            "type": "subscription",
            "priceUnit": "per-month",
            "tier": "T3",
            "agents": ["industry-model"],
            "replaces": {"role": f"{vertical} vertical SME", "fteCount": 0.3, "fullyLoadedAnnualCostEUR": 30000},
            "nextUpsellSku": "WF-T4",
            "deploymentColor": "blue",
            "priceVersion": PRICE_VERSION,
            "description": f"Industry-vertical specialisation add-on for {vertical}. Sits on top of a T3 Function bundle. Never sold standalone.",
            "features": [
                f"Vertical: {vertical}",
                "T3 add-on only — requires base T3 bundle",
                "Blue/pilot — internal sign-off required before quoting",
            ],
            "priceNote": f"+€{addon:,.0f}/mo add-on on top of CONSTR-T3 or ESG-T3",
            "image": "/DWS_IQ2026.png",
            "detailsUrl": "../products/skilled-agents.html",
            "featured": False,
            "storeCategory": "platform",
            "brand": "DWS IQ",
            "version": "1.0",
            "industryPodAddOn": True,
            "addsOnTo": ["CONSTR-T3", "ESG-T3"],
            "google": {
                "productCategory": "Software > Business & Productivity Software",
                "condition": "new",
                "availability": "in_stock",
                "brand": "DWS IQ",
                "targetCountry": "FI",
                "contentLanguage": "en",
            },
        }))
    return out


def land_entries() -> list[tuple[str, dict]]:
    out = []
    for (sku, name, y1, y2plus, attached_sku, description, agents, replaces) in LAND_OVERLAY:
        out.append((sku, {
            "id": sku,
            "sku": sku,
            "mpn": sku,
            "name": name,
            "price": y1,
            "currency": "EUR",
            "type": "bundle",
            "priceUnit": "per-year",
            "tier": "land",
            "agents": list(agents),
            "replaces": make_replaces(*replaces),
            "nextUpsellSku": attached_sku,
            "attachedAgentSku": attached_sku,
            "yearOneEUR": y1,
            "yearTwoPlusEUR": y2plus,
            "deploymentColor": "blue",
            "priceVersion": PRICE_VERSION,
            "description": description,
            "features": [
                f"Replaces {replaces[0]} ≈ {replaces[1]} FTE during engagement",
                f"Y1 €{y1:,} · Y2+ €{y2plus:,}/yr",
                "Land overlay — engagement + 12-month agent attach",
            ],
            "priceNote": f"Y1 €{y1:,} · Y2+ €{y2plus:,}/yr — engagement + 12-month {attached_sku}",
            "image": "/static/images/Risto_Malta.png",
            "detailsUrl": "../products/skilled-agents.html",
            "featured": False,
            "storeCategory": "advisory",
            "brand": "Lifetime",
            "version": "1.0",
            "google": {
                "productCategory": "Business & Industrial > Business Services",
                "condition": "new",
                "availability": "in_stock",
                "brand": "Lifetime",
                "targetCountry": "FI",
                "contentLanguage": "en",
            },
        }))
    return out


def main() -> int:
    with open(SRC, encoding="utf-8") as fh:
        data = json.load(fh)

    products = data.setdefault("products", {})

    all_entries = (
        single_agent_entries()
        + bundle_entries()
        + industry_pod_entries()
        + land_entries()
    )

    added = updated = 0
    for sku, payload in all_entries:
        if sku in products:
            updated += 1
        else:
            added += 1
        products[sku] = payload

    # Confirm spec is fully loaded — counts taken from PRODUCT-CATALOG-UPSELL-TIERS-2026 §2-§4
    expected_single = 39  # 5 CMP + 5 SS + 7 MO/ED + 5 Construction line + 4 Sov/QG + 8 Growth line + 5 Knowledge/Orch
    expected_bundles = 9  # 5 domain T3 + 1 T4 Workforce + 3 brand-cut T3 (DWS-365, Firehorse, Agentic Commerce 365)
    expected_industry = 9
    expected_land = 10
    assert len(SINGLE_AGENT) == expected_single, f"single agent rows: {len(SINGLE_AGENT)} (expected {expected_single})"
    assert len(BUNDLES_T3_T4) == expected_bundles, f"bundle rows: {len(BUNDLES_T3_T4)} (expected {expected_bundles})"
    assert len(INDUSTRY_PODS) == expected_industry, f"industry pods: {len(INDUSTRY_PODS)} (expected {expected_industry})"
    assert len(LAND_OVERLAY) == expected_land, f"land overlay: {len(LAND_OVERLAY)} (expected {expected_land})"

    with open(SRC, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    shutil.copy2(SRC, MIRROR)

    print(f"[load-labor-catalog] added={added} updated={updated} total_in_catalog={len(all_entries)}")
    print(f"[load-labor-catalog] mirrored to {MIRROR.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
