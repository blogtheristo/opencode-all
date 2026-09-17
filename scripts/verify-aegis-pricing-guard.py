#!/usr/bin/env python3
"""Assert the Aegis pilot / implementation pricing guard still holds.

Why this exists. DWS-AEGIS-PILOT-001 shipped at EUR 45,000 because the April 2026
THREE-PHASE PROGRAMME total (Audit 5k + agent-in-production 15k + LWM integration 25k,
additive to licence) was read as if it were a pilot line. Only the middle phase is a
pilot. The correction split the two apart and attached a wording guard so the scope
cannot be silently re-widened later. That guard is prose, and prose drifts — this
turns each element into an assertion.

Run: python3 scripts/verify-aegis-pricing-guard.py
Exit 0 = guard intact. Exit 1 = something regressed, with the failing checks named.
"""
import json
import sys

CONFIG = "dws10.com/config/products.json"
MIRROR = "landing-pages/dws10-com/config/products.json"
PILOT_MD = "Store/PRODUCT_AEGIS_PILOT.md"
IMPL_MD = "Store/PRODUCT_AEGIS_IMPLEMENTATION.md"

PILOT_ID = "DWS-AEGIS-PILOT-001"
IMPL_ID = "DWS-AEGIS-IMPL-001"
PILOT_PRICE = 19990
IMPL_PRICE = 45000
ONBOARDING = 59990

# Identity fields only. Prose in the implementation doc may point a buyer at the pilot
# as the cheaper starting point — that cross-reference prevents mis-purchase and is
# deliberate. What must never recur is "pilot" in a field that names the SKU.
IDENTITY_FIELDS = ("id", "sku", "mpn", "name", "title", "detailsUrl")

failures = []


def check(label, condition, detail=""):
    if not condition:
        failures.append(f"{label}{('  — ' + detail) if detail else ''}")
    print(f"{'PASS' if condition else 'FAIL'}  {label}")


def main():
    with open(CONFIG, encoding="utf-8") as fh:
        config = json.load(fh)
    with open(MIRROR, encoding="utf-8") as fh:
        mirror = json.load(fh)

    pilot = config["products"][PILOT_ID]
    impl = config["products"][IMPL_ID]

    check("pilot priced at EUR 19,990", pilot["price"] == PILOT_PRICE, str(pilot["price"]))
    check("implementation priced at EUR 45,000", impl["price"] == IMPL_PRICE, str(impl["price"]))
    check("pilot is credited", pilot.get("credited") is True)
    check("implementation is NOT credited", impl.get("credited") is False)
    check(
        "credit arithmetic: pilot + balance == onboarding",
        PILOT_PRICE + 40000 == ONBOARDING,
    )
    check(
        "pricing mirror is in sync",
        json.dumps(config, sort_keys=True) == json.dumps(mirror, sort_keys=True),
        "landing-pages mirror has drifted from the source config",
    )

    # --- the wording guard: scope / acceptance KPI / exclusions -------------------
    check("guard: scope is enumerated", len(pilot.get("includes", [])) >= 4)

    kpi = pilot.get("acceptanceKpi") or {}
    check("guard: acceptance KPI names a severed uplink", "sever" in kpi.get("condition", "").lower())
    check("guard: acceptance KPI is three binary outcomes", len(kpi.get("requiredOutcomes", [])) == 3)
    check(
        "guard: a failing pilot is a negative result, not a defect",
        "negative result" in kpi.get("rule", "").lower(),
    )

    exclusions = json.dumps(pilot.get("exclusions", []))
    for term in ("LWM", "hardware", "Multi-site", "SCADA", IMPL_ID, "6 months"):
        check(f"guard: exclusions cover {term}", term in exclusions)

    check("implementation phases enumerated", len(impl.get("phases", [])) == 3)

    # --- the name safeguard -------------------------------------------------------
    identity = {k: impl.get(k) for k in IDENTITY_FIELDS}
    check(
        "no 'pilot' in any implementation SKU identity field (config)",
        "pilot" not in json.dumps(identity).lower(),
        json.dumps(identity),
    )

    with open(IMPL_MD, encoding="utf-8") as fh:
        impl_frontmatter = fh.read().split("---")[1]
    check(
        "no 'pilot' in the implementation Store frontmatter",
        "pilot" not in impl_frontmatter.lower(),
    )

    # --- the guard must also survive in the customer-facing doc --------------------
    with open(PILOT_MD, encoding="utf-8") as fh:
        pilot_md = fh.read()
    check('Store doc carries the price', f'price: "{PILOT_PRICE}.00"' in pilot_md)
    for label, needle in (
        ("scope", "one control-room workflow"),
        ("acceptance KPI", "acceptance KPI is binary"),
        ("exclusions", "Outside the credit"),
        ("SCADA", "SCADA"),
    ):
        check(f"Store doc states the {label}", needle in pilot_md)

    if failures:
        print(f"\n{len(failures)} check(s) FAILED:")
        for line in failures:
            print(f"  - {line}")
        print(
            "\nThe Aegis pricing guard has regressed. Do not ship. Context: "
            "docs/field-notes/2026-07-30-network-independent-critical-operation.md v1.2"
        )
        return 1

    print("\nAegis pricing guard intact.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
