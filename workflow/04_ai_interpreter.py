#!/usr/bin/env python3
"""
04_ai_interpreter.py — Use Anthropic API to interpret ML results and generate actions.

Steps:
  A. Interpret ML results (model performance + feature importances)
  B. Generate next actions (immediate, 30-day, 90-day)
  C. Draft stakeholder emails (technical + executive variants)

Requires ANTHROPIC_API_KEY in environment or .env file.
Supports --dry-run flag for offline demos (rule-based fallback).
"""

import json
import sys
import time
from pathlib import Path

# Load .env before importing anthropic
from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent.parent
REPORTS_DIR = PROJECT_ROOT / "reports"

DRY_RUN = "--dry-run" in sys.argv


def load_metrics() -> dict:
    path = REPORTS_DIR / "metrics.json"
    if not path.exists():
        print(f"ERROR: {path} not found. Run 03_model_train.py first.")
        sys.exit(1)
    with open(path) as f:
        return json.load(f)


def get_client():
    """Initialize Anthropic client, or None if dry-run."""
    if DRY_RUN:
        return None
    try:
        import anthropic

        return anthropic.Anthropic()
    except Exception as e:
        print(f"WARNING: Could not initialize Anthropic client: {e}")
        print("Falling back to rule-based output.")
        return None


def call_claude(client, prompt: str, model: str = "claude-haiku-4-5-20250512") -> str:
    """Call Claude API with fallback handling."""
    if client is None:
        return None
    try:
        response = client.messages.create(
            model=model,
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text
    except Exception as e:
        print(f"  API call failed: {e}")
        return None


# ── Step A: Interpret ML Results ──────────────────────────────────────────────


def interpret_results_prompt(metrics: dict) -> str:
    best = metrics["best_model"]
    f1 = metrics["best_f1"]
    ranking = metrics["feature_ranking"]
    top5 = ranking[:5]
    all_results = metrics["all_results"]

    features_text = "\n".join(
        f"  {i + 1}. {f['feature']}: {f['importance']:.4f}" for i, f in enumerate(top5)
    )
    models_text = "\n".join(
        f"  - {name}: F1={r['f1_mean']:.4f} ± {r['f1_std']:.4f}"
        for name, r in all_results.items()
    )

    return f"""You are a senior data science consultant analyzing ML model results for a
logistics/construction company operating in the EU.

MODEL PERFORMANCE:
{models_text}

Best model: {best} (F1={f1:.4f})

TOP 5 FEATURE IMPORTANCES:
{features_text}

BUSINESS CONTEXT:
- Domain: logistics fleet management and construction project delivery
- Key KPIs: on-time delivery rate, CO2 per delivery, fuel cost per km
- Regulatory environment: EU AI Act (transparency), NIS2 (audit trails), Fit for 55 (emissions)

Return ONLY valid JSON (no markdown, no code blocks) with this structure:
{{
  "plain_english_summary": "2-3 sentence summary a non-technical executive can understand",
  "top_3_insights": ["insight 1", "insight 2", "insight 3"],
  "confidence_assessment": "high/medium/low — with 1-sentence reason",
  "regulatory_flags": ["any EU AI Act transparency issues to note"],
  "recommended_next_experiment": "one concrete next step for the data team"
}}"""


def fallback_interpretation(metrics: dict) -> dict:
    """Rule-based fallback when API is unavailable."""
    best = metrics["best_model"]
    f1 = metrics["best_f1"]
    top_feature = metrics["feature_ranking"][0]["feature"]
    return {
        "plain_english_summary": (
            f"The {best} model predicts on-time delivery with {f1:.0%} accuracy (F1-score). "
            f"The strongest predictor is {top_feature}, suggesting operational improvements "
            f"should focus there first."
        ),
        "top_3_insights": [
            f"{top_feature} is the dominant factor in delivery timeliness",
            "Weather delays have a measurable but secondary impact — worth monitoring but not the primary lever",
            "Route efficiency shows potential for optimization — even small gains compound across fleet",
        ],
        "confidence_assessment": f"medium — F1={f1:.4f} is solid for logistics prediction, but real-world validation needed",
        "regulatory_flags": [
            "EU AI Act Article 13: Model decisions must be explainable to affected parties",
            "Feature importance ranking provides basic transparency but may need SHAP values for compliance",
        ],
        "recommended_next_experiment": (
            "Collect 2 weeks of real operational data and validate model predictions against actual outcomes"
        ),
    }


# ── Step B: Generate Next Actions ─────────────────────────────────────────────


def next_actions_prompt(insights: dict) -> str:
    insights_text = json.dumps(insights, indent=2)
    return f"""You are an operations strategy consultant. Based on the following ML analysis
insights, generate actionable recommendations.

ANALYSIS INSIGHTS:
{insights_text}

COMPANY CONTEXT:
- company_type: "logistics_operator" (fleet of 50+ vehicles, EU routes)
- current_kpis: {{"on_time_rate": "82%", "co2_per_delivery": "12.4 kg", "cost_per_km": "€1.85"}}
- decision_makers: ["ops_manager", "cfo", "sustainability_lead"]

Return ONLY valid JSON (no markdown, no code blocks) with this structure:
{{
  "immediate_actions": [
    {{"action": "description", "owner": "role", "expected_roi": "quantified estimate"}}
  ],
  "30_day_actions": [
    {{"action": "description", "owner": "role", "expected_roi": "quantified estimate"}}
  ],
  "90_day_roadmap": "2-3 sentence strategic direction"
}}

Generate 2-3 items per action category. Be specific and quantitative."""


def fallback_actions() -> dict:
    return {
        "immediate_actions": [
            {
                "action": "Implement real-time weather delay alerts for dispatchers",
                "owner": "ops_manager",
                "expected_roi": "3-5% improvement in on-time rate within 2 weeks",
            },
            {
                "action": "Review top 10 routes by fuel cost and identify optimization candidates",
                "owner": "ops_manager",
                "expected_roi": "€2,000-4,000/month fuel savings",
            },
        ],
        "30_day_actions": [
            {
                "action": "Deploy predictive model in shadow mode alongside human dispatchers",
                "owner": "ops_manager",
                "expected_roi": "Validate model accuracy on live data before full deployment",
            },
            {
                "action": "Set up CO2 tracking dashboard with Fit-for-55 compliance thresholds",
                "owner": "sustainability_lead",
                "expected_roi": "Avoid potential €50K+ in carbon penalty costs",
            },
        ],
        "90_day_roadmap": (
            "Move from reactive to predictive fleet management. Integrate model predictions "
            "into dispatch workflow, automate route optimization based on weather/traffic, "
            "and establish monthly sustainability reporting for EU compliance."
        ),
    }


# ── Step C: Draft Stakeholder Emails ──────────────────────────────────────────


def email_prompt(insights: dict, actions: dict) -> str:
    return f"""You are a communications specialist drafting internal emails about AI/analytics results.

ANALYSIS INSIGHTS:
{json.dumps(insights, indent=2)}

RECOMMENDED ACTIONS:
{json.dumps(actions, indent=2)}

Draft 2 email variants. Return ONLY valid JSON (no markdown, no code blocks):

{{
  "technical_email": {{
    "subject": "subject line",
    "body": "full email body with markdown formatting"
  }},
  "executive_email": {{
    "subject": "subject line",
    "body": "full email body with markdown formatting"
  }}
}}

REQUIREMENTS:
- Technical email: for data/IT lead, include model metrics, feature importances, next experiments
- Executive email: for CEO/CFO, no jargon, ROI-first, 3 sentences max summary then actions
- Both must include: subject line, 3-sentence summary, top 2 actions with owners, placeholder [LINK TO FULL REPORT]
- Keep each under 300 words"""


def fallback_emails(insights: dict, actions: dict) -> dict:
    summary = insights.get("plain_english_summary", "ML analysis complete.")
    top_action = (
        actions["immediate_actions"][0]
        if actions["immediate_actions"]
        else {"action": "Review results", "owner": "team"}
    )
    return {
        "technical_email": {
            "subject": "ML Pipeline Results: On-Time Delivery Prediction Model Ready for Review",
            "body": (
                f"Hi team,\n\n"
                f"The automated ML pipeline has completed analysis of our delivery data. "
                f"{summary}\n\n"
                f"**Key Metrics:**\n"
                f"- Best model F1-score: see attached metrics.json\n"
                f"- Top predictive features: delivery time, weather delay, route efficiency\n\n"
                f"**Immediate Actions:**\n"
                f"1. {top_action['action']} (Owner: {top_action['owner']})\n"
                f"2. Validate model on 2 weeks of live data before production deployment\n\n"
                f"**EU Compliance Note:** Model explainability documentation required under AI Act Article 13. "
                f"SHAP analysis recommended before customer-facing deployment.\n\n"
                f"Full report: [LINK TO FULL REPORT]\n\n"
                f"Let me know if you have questions about the methodology or want to discuss next steps.\n\n"
                f"Best regards"
            ),
        },
        "executive_email": {
            "subject": "Fleet Analytics: Quick Wins Identified — Action Items Inside",
            "body": (
                f"Hi,\n\n"
                f"Our analytics team has identified concrete opportunities to improve delivery performance. "
                f"{summary} "
                f"The analysis points to specific operational changes that can deliver measurable ROI.\n\n"
                f"**Top 2 Actions This Week:**\n"
                f"1. {top_action['action']} → Owner: {top_action['owner']}, "
                f"Expected impact: {top_action.get('expected_roi', 'measurable improvement')}\n"
                f"2. Review route optimization opportunities → Owner: Ops Manager, "
                f"Expected savings: €2,000-4,000/month\n\n"
                f"**Bottom Line:** These changes require minimal investment and can improve "
                f"on-time delivery by 3-5% while reducing fuel costs.\n\n"
                f"Full report: [LINK TO FULL REPORT]\n\n"
                f"Happy to walk through the numbers at your convenience.\n\n"
                f"Best regards"
            ),
        },
    }


def save_emails(emails: dict) -> None:
    """Save stakeholder emails to markdown file."""
    tech = emails["technical_email"]
    exec_ = emails["executive_email"]

    content = f"""# Stakeholder Communication — AI/ML Analysis Results

Generated: {time.strftime("%Y-%m-%d %H:%M:%S")}

---

## Variant A: Technical (Data/IT Lead)

**Subject:** {tech["subject"]}

{tech["body"]}

---

## Variant B: Executive (CEO/CFO)

**Subject:** {exec_["subject"]}

{exec_["body"]}

---

*Generated by DWS IQ 6 AI/DS Workflow Accelerator*
"""
    path = REPORTS_DIR / "stakeholder_emails.md"
    with open(path, "w") as f:
        f.write(content)
    print(f"  Saved: {path}")


def main():
    start = time.time()

    if DRY_RUN:
        print("DRY RUN MODE — using rule-based fallbacks (no API calls)\n")

    print("Loading model metrics...")
    metrics = load_metrics()
    print(f"  Best model: {metrics['best_model']} (F1={metrics['best_f1']:.4f})\n")

    client = get_client()

    # Step A: Interpret results
    print("Step A: Interpreting ML results...")
    prompt_a = interpret_results_prompt(metrics)
    response_a = call_claude(client, prompt_a)
    if response_a:
        try:
            insights = json.loads(response_a)
            print("  Got AI interpretation")
        except json.JSONDecodeError:
            print("  API returned invalid JSON, using fallback")
            insights = fallback_interpretation(metrics)
    else:
        insights = fallback_interpretation(metrics)
        print("  Using rule-based interpretation")

    # Save interpretation
    interp_path = REPORTS_DIR / "interpretation.json"
    with open(interp_path, "w") as f:
        json.dump(insights, f, indent=2)
    print(f"  Saved: {interp_path}\n")

    # Step B: Generate actions
    print("Step B: Generating next actions...")
    prompt_b = next_actions_prompt(insights)
    response_b = call_claude(client, prompt_b)
    if response_b:
        try:
            actions = json.loads(response_b)
            print("  Got AI-generated actions")
        except json.JSONDecodeError:
            print("  API returned invalid JSON, using fallback")
            actions = fallback_actions()
    else:
        actions = fallback_actions()
        print("  Using rule-based actions")

    # Save actions
    actions_path = REPORTS_DIR / "actions.json"
    with open(actions_path, "w") as f:
        json.dump(actions, f, indent=2)
    print(f"  Saved: {actions_path}\n")

    # Step C: Draft emails
    print("Step C: Drafting stakeholder emails...")
    prompt_c = email_prompt(insights, actions)
    # Use sonnet for email quality (as specified in requirements)
    response_c = call_claude(client, prompt_c, model="claude-sonnet-4-20250514")
    if response_c:
        try:
            emails = json.loads(response_c)
            print("  Got AI-drafted emails")
        except json.JSONDecodeError:
            print("  API returned invalid JSON, using fallback")
            emails = fallback_emails(insights, actions)
    else:
        emails = fallback_emails(insights, actions)
        print("  Using rule-based emails")

    save_emails(emails)

    elapsed = time.time() - start
    print(f"\nAI interpretation completed in {elapsed:.1f}s")

    return 0


if __name__ == "__main__":
    sys.exit(main())
