import { describe, expect, it } from "vitest";
import {
  CustomerSignalsSchema,
  FALLBACK_NEXT_UPSELL,
  recommendUpsell,
} from "../services/upsell-rules.js";

describe("upsell-rules / CustomerSignalsSchema", () => {
  it("rejects payloads with unknown keys", () => {
    expect(() =>
      CustomerSignalsSchema.parse({
        currentSku: "CMP-T1",
        currentTier: "T1",
        approvedOutputsTotal: 0,
        nonsense: true,
      }),
    ).toThrow();
  });

  it("rejects invalid tier value", () => {
    expect(() =>
      CustomerSignalsSchema.parse({ currentSku: "CMP-T1", currentTier: "T9" }),
    ).toThrow();
  });

  it("accepts the minimal valid payload", () => {
    const parsed = CustomerSignalsSchema.parse({
      currentSku: "CMP-T1",
      currentTier: "T1",
    });
    expect(parsed.monthlyOutcomes).toEqual([]);
    expect(parsed.sameDomainActiveSkus).toBe(1);
  });
});

describe("upsell-rules / trigger logic (§5)", () => {
  it("T0 → T1: fires on first approved output", () => {
    const r = recommendUpsell({
      currentSku: "CMP-T0",
      currentTier: "T0",
      approvedOutputsTotal: 1,
    });
    expect(r).not.toBeNull();
    expect(r?.nextSku).toBe("CMP-T1");
    expect(r?.rule).toBe("T0_TO_T1_FIRST_APPROVED_OUTPUT");
  });

  it("T0 → T1: does not fire with zero approved outputs", () => {
    const r = recommendUpsell({
      currentSku: "CMP-T0",
      currentTier: "T0",
      approvedOutputsTotal: 0,
    });
    expect(r).toBeNull();
  });

  it("T1 → T2: fires on ≥3 outcomes/mo for 2 consecutive months", () => {
    const r = recommendUpsell({
      currentSku: "CMP-T1",
      currentTier: "T1",
      monthlyOutcomes: [4, 3],
    });
    expect(r?.nextSku).toBe("CMP-T2");
    expect(r?.rule).toBe("T1_TO_T2_THREE_OUTCOMES_TWO_MONTHS");
  });

  it("T1 → T2: does NOT fire when only one month meets threshold", () => {
    const r = recommendUpsell({
      currentSku: "CMP-T1",
      currentTier: "T1",
      monthlyOutcomes: [5, 2],
    });
    expect(r).toBeNull();
  });

  it("T2 → T3: fires when a second agent in the same domain is attached", () => {
    const r = recommendUpsell({
      currentSku: "MO-T2",
      currentTier: "T2",
      sameDomainActiveSkus: 2,
    });
    expect(r?.nextSku).toBe("ESG-T3");
    expect(r?.rule).toBe("T2_TO_T3_SECOND_AGENT_SAME_DOMAIN");
  });

  it("T3 → Industry Pod: fires on vertical keyword (steel)", () => {
    const r = recommendUpsell({
      currentSku: "ESG-T3",
      currentTier: "T3",
      verticalSignals: ["customer asked about steel ETS impact"],
    });
    expect(r?.nextSku).toBe("IND-VULCAN");
    expect(r?.rule).toBe("T3_TO_INDUSTRY_POD_VERTICAL_SIGNAL");
  });

  it("T3 → T4: fires when CFO/CEO is in the conversation", () => {
    const r = recommendUpsell({
      currentSku: "ESG-T3",
      currentTier: "T3",
      cfoOrCeoInvolved: true,
    });
    expect(r?.nextSku).toBe("WF-T4");
    expect(r?.rule).toBe("T3_TO_T4_CFO_CEO_OR_THREE_T3");
  });

  it("T3 → T4: fires on ≥3 T3 bundles attached", () => {
    const r = recommendUpsell({
      currentSku: "CONSTR-T3",
      currentTier: "T3",
      t3BundleCount: 3,
    });
    expect(r?.nextSku).toBe("WF-T4");
  });

  it("T3 → T4 outranks T3 → Industry Pod when both fire", () => {
    const r = recommendUpsell({
      currentSku: "ESG-T3",
      currentTier: "T3",
      verticalSignals: ["steel"],
      cfoOrCeoInvolved: true,
    });
    expect(r?.nextSku).toBe("WF-T4");
  });

  it("Land overlay fires ONLY on explicit AI-capability pushback", () => {
    const noPush = recommendUpsell({
      currentSku: "CMP-T2",
      currentTier: "T2",
    });
    // No other trigger fired → null. Land overlay never offered by default.
    expect(noPush).toBeNull();

    const withPush = recommendUpsell({
      currentSku: "CMP-T2",
      currentTier: "T2",
      aiCapabilityPushback: true,
    });
    expect(withPush?.nextSku).toBe("LAND-EUAI");
    expect(withPush?.rule).toBe("ANY_TO_LAND_AI_CAPABILITY_PUSHBACK");
  });

  it("returns null when no trigger fires", () => {
    const r = recommendUpsell({
      currentSku: "MO-T1",
      currentTier: "T1",
      approvedOutputsTotal: 0,
      monthlyOutcomes: [1],
    });
    expect(r).toBeNull();
  });

  it("FALLBACK_NEXT_UPSELL covers every domain ladder used in §5", () => {
    // Smoke: ensure each rule path has a target in the fallback table.
    expect(FALLBACK_NEXT_UPSELL["CMP-T0"]).toBe("CMP-T1");
    expect(FALLBACK_NEXT_UPSELL["CMP-T1"]).toBe("CMP-T2");
    expect(FALLBACK_NEXT_UPSELL["CMP-T2"]).toBe("ESG-T3");
    expect(FALLBACK_NEXT_UPSELL["ESG-T3"]).toBe("WF-T4");
  });
});
