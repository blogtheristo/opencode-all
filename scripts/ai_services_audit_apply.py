#!/usr/bin/env python3
"""Atomic catalog update for items 1, 2, 3, 4 of the AI services audit.

Applies the same JSON transformation to both:
  - dws10.com/config/products.json
  - landing-pages/dws10-com/config/products.json

Per CLAUDE.md Dual Folder Sync Rule, both mirrors must be updated in the same
commit. This script is the source of truth for those edits.
"""
import json
from pathlib import Path

ROOT = Path("/home/user/dws6")
TARGETS = [
    ROOT / "dws10.com" / "config" / "products.json",
    ROOT / "landing-pages" / "dws10-com" / "config" / "products.json",
]

# Item 1 — retire _OLD SKUs.
RETIRE = ["expert-services", "LIFETIME-EXP-001"]

# Item 2 — reposition copy on 8 Red-zone SKUs (no price change, no SKU rename).
REPOSITION = {
    "aws-consultancy": {
        "name": "EU-Sovereign AI Engineering & Cloud Consultancy",
        "description": (
            "EU-sovereign AI engineering — 25 hours of senior architect time deploying Claude / Mistral / Llama on Scaleway, OVH, or owned DGX Spark. "
            "ZDR contracts, NIS2-aligned network design, and CLOUD Act exposure assessment included. The Anthropic-aligned US services firms can't ship this; "
            "we can. Multi-cloud across AWS, Azure, GCP for hybrid sovereignty workloads."
        ),
        "features": [
            "EU-sovereign deployment (Scaleway, OVH, owned DGX Spark)",
            "ZDR contracts + CLOUD Act exposure assessment",
            "25h senior architect + 4h strategy workshop",
        ],
    },
    "conversational-agent": {
        "name": "EU-Hosted Conversational Agent",
        "description": (
            "Deploy AI agents on Teams, WhatsApp, Zoom, or secure webhook with EU-sovereign hosting. GDPR + EU AI Act Article 50 (transparency) baked in. "
            "Customer choice of LLM — Claude, Mistral, Groq, or self-hosted on DGX Spark — so you control where the prompt lands. Live in 25 hours."
        ),
        "features": [
            "EU-hosted, GDPR + EU AI Act Art. 50 compliant",
            "Customer-choice LLM (Claude / Mistral / Groq / self-hosted)",
            "Teams, WhatsApp, Zoom, secure webhook — live in 25h",
        ],
    },
    "ai-agent-engineering": {
        "name": "AI & Agent Engineering — Outcome-Backed Hourly",
        "description": (
            "Senior AI engineer on demand — but billed against captain-hat outcomes, not consultant hours. €200/h backstop; we prefer the outcome-priced SKUs "
            "(€49 site safety scan, €499 LCA report, €999 CSRD gap) because you only pay when the artefact ships. Skip the 3-month hiring cycle and the T&M lock-in."
        ),
        "features": [
            "Senior AI engineer (Claude Code, Codex, Azure AI)",
            "Outcome-priced default; €200/h backstop on request",
            "No T&M lock-in — pay per shipped artefact",
        ],
    },
    "lean-project": {
        "name": "EU AI Project Accelerator (Fixed Price)",
        "description": (
            "Fixed-price AI project delivery for EU teams who don't want a Fractional-style T&M engagement. Sovereign deployment, captain-hat-aligned outcomes, "
            "Kanban + roadmap included. Lean AI methodology — 2x delivery speed from sprint 1, with the artefacts mapped to Fit for 55 / CSRD / EU AI Act obligations from day one."
        ),
        "features": [
            "Fixed price — no T&M surprise on month 3",
            "EU-sovereign deployment + captain-hat outcomes",
            "2x delivery speed from sprint 1, regulator-aligned artefacts",
        ],
    },
    "ai-consultant-day": {
        "name": "Captain Day — One-Day AI Outcome",
        "description": (
            "One day, one captain-hat outcome shipped. Senior consultant on-site or remote — frame your AI strategy against the 16-captain-hat operating model, "
            "prototype with Claude / GPT / Gemini / Copilot, and leave with a working artefact (compliance gap report, agent prototype, or sovereignty assessment). "
            "Outcome-first: if we can't ship in a day, you don't pay full rate."
        ),
        "features": [
            "One day → one shipped captain-hat artefact",
            "Claude, GPT, Gemini, Copilot — on-site or remote",
            "Outcome-priced; reduced rate if not shipped same day",
        ],
    },
    "cloud-ready-teams": {
        "name": "EU On-Demand AI & Cloud Engineers (Sovereign)",
        "description": (
            "EU-resident, pre-vetted AI and cloud engineers — no CLOUD Act exposure, no US payroll, no 3-month recruitment cycle. Sovereign by construction: "
            "the engineer, the keyboard, and the data stay in the EU. Skip the recruitment cycle and start building this week."
        ),
        "features": [
            "EU-resident engineers — zero CLOUD Act exposure",
            "Pre-vetted AI & cloud talent, deployed in days",
            "Sovereign by construction — engineer + data both in EU",
        ],
    },
    "ai-consulting-agentic": {
        "name": "Agentic Software Development for EU Teams",
        "description": (
            "Anthropic's Skills paradigm + Claude Code + Codex, deployed inside EU-sovereign perimeter. We assess your codebase, run AGENTS.md workshops, "
            "restructure for agentic development, and set up quality governance — without your IP leaving the jurisdiction. The Anthropic-backed US services firms "
            "can ship the workflow; only we can ship it without data egress to a US-controlled cloud."
        ),
        "features": [
            "Skills paradigm + Claude Code + Codex (EU-sovereign)",
            "AGENTS.md workshops, agentic restructure, quality gates",
            "No IP egress — code and prompts stay in EU",
        ],
    },
    "consulting-hourly": {
        "name": "Senior Compliance Specialist — Retainer + Outcomes",
        "description": (
            "Compliance expertise without long-term lock-in. Retainer model with hours mapped to captain-hat outcomes (CSRD report, EU AI Act gap, NIS2 audit) "
            "across 16 captain hats covering 25+ EU regulated industries. €250/h backstop; default to outcome-priced packages because that's what regulators audit."
        ),
        "features": [
            "Outcomes mapped to 16 captain hats / 25+ EU industries",
            "Retainer + outcome packages; €250/h backstop",
            "Fit for 55, CSRD, EU AI Act, NIS2 specialisation",
        ],
    },
}

# Item 3 — add two outcome-priced SKUs the Anthropic firm structurally can't ship.
NEW_SKUS = {
    "AIS-EU-SOV-OC": {
        "id": "AIS-EU-SOV-OC",
        "gtin": None,
        "mpn": "AIS-EU-SOV-2026",
        "name": "EU-Sovereign AI Migration — Per Workload",
        "price": 4990,
        "currency": "EUR",
        "type": "metered",
        "description": (
            "Move one production AI workload off a US-controlled LLM stack onto EU-sovereign Claude / Mistral / DGX Spark — fixed price per workload. "
            "Includes ZDR contract review, GDPR Article 44–49 documentation, NIS2 control mapping, and EU AI Act Article 13/50 transparency artefacts. "
            "The Anthropic-aligned US services firms cannot ship this outcome — sovereignty is structural, not a feature flag."
        ),
        "features": [
            "Fixed price per workload migrated — no T&M",
            "ZDR + GDPR Art. 44–49 + NIS2 + EU AI Act artefacts",
            "Auditable sovereign artefact at delivery",
        ],
        "priceNote": "Per workload migrated",
        "revolutLink": None,
        "paypalPlanId": None,
        "image": "/static/images/dws_sovereign_db.png",
        "detailsUrl": "../products/skilled-agents.html",
        "featured": True,
        "google": {
            "productCategory": "Business & Industrial > Business Services",
            "condition": "new",
            "availability": "in_stock",
            "brand": "Lifetime",
            "targetCountry": "FI",
            "contentLanguage": "en",
        },
        "storeCategory": "advisory",
        "buyPage": 2,
        "buyPageOrder": 1,
    },
    "AIS-OUTCOME-PILOT": {
        "id": "AIS-OUTCOME-PILOT",
        "gtin": None,
        "mpn": "AIS-OUTCOME-2026",
        "name": "Outcome-Priced Applied-AI Pilot (6 weeks)",
        "price": 9990,
        "currency": "EUR",
        "type": "one-time",
        "description": (
            "Six-week fixed-price applied-AI pilot — refunded if the named KPI does not move. Pick one captain-hat outcome (CSRD report cycle time, "
            "site-safety incident rate, lead-to-quote latency, LCA report turnaround), we ship the agent, you ship the KPI. Built specifically for buyers "
            "tired of T&M decks from generic 'deploy Claude' services firms."
        ),
        "features": [
            "6 weeks, fixed price, single named KPI",
            "Refund if KPI does not move — outcome-guaranteed",
            "One captain-hat outcome shipped end-to-end",
        ],
        "priceNote": "6 weeks fixed; refundable on KPI miss",
        "revolutLink": None,
        "paypalPlanId": None,
        "image": "/static/images/Risto_Malta.png",
        "detailsUrl": "../products/skilled-agents.html",
        "featured": True,
        "google": {
            "productCategory": "Business & Industrial > Business Services",
            "condition": "new",
            "availability": "in_stock",
            "brand": "Lifetime",
            "targetCountry": "FI",
            "contentLanguage": "en",
        },
        "storeCategory": "advisory",
        "buyPage": 2,
        "buyPageOrder": 2,
    },
}

# Item 4 — feature the moat: promote and re-order defensible SKUs.
FEATURE_PROMO = {
    "consulting-fit55":   {"featured": True,  "buyPage": 1, "buyPageOrder": 3},
    "firehorse-coach":    {"featured": True,  "buyPage": 1, "buyPageOrder": 5},
    "LAND-EUAI":          {"featured": True,  "buyPage": 1, "buyPageOrder": 6},
    "LAND-CSRD":          {"featured": True,  "buyPage": 1, "buyPageOrder": 7},
    "LAND-SOV":           {"featured": True,  "buyPage": 1, "buyPageOrder": 9},
    "sovereignty-cloud-consulting": {"featured": True, "buyPage": 1, "buyPageOrder": 10},
}


def apply(path: Path) -> None:
    data = json.loads(path.read_text(encoding="utf-8"))
    products = data["products"]

    # 1. Retire _OLD SKUs.
    for sku in RETIRE:
        if sku in products:
            del products[sku]

    # 2. Reposition Red-zone copy.
    for sku, patch in REPOSITION.items():
        if sku not in products:
            raise KeyError(f"Missing SKU for reposition: {sku}")
        products[sku].update(patch)

    # 3. Add new outcome SKUs.
    for sku, body in NEW_SKUS.items():
        products[sku] = body

    # 4. Feature the moat.
    for sku, patch in FEATURE_PROMO.items():
        if sku not in products:
            raise KeyError(f"Missing SKU for feature promo: {sku}")
        products[sku].update(patch)

    path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    for p in TARGETS:
        apply(p)
        print(f"updated: {p}")
