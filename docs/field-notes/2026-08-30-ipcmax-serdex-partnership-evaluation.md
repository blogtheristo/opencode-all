# Field Note: iPCMax/Serdex Hardware Partner Evaluation

**Session:** claude/ipcmax-serdex-evaluation-orp38x  
**Date:** 30.08.2026  
**Author:** Claude Code (Haiku 4.5)  
**Status:** READY FOR HIC REVIEW

---

## Summary

Completed a comprehensive technical evaluation of **iPCMax/Serdex** as a hardware partner for dws10.com. The partnership would bridge industrial field sensors and embedded compute with NVIDIA DGX Spark–powered sovereign AI clusters, addressing a critical gap in the current product offering.

**Key Finding:** iPCMax + DGX Spark = complete industrial AI stack. Neither alone covers the field-to-cloud integration layer.

**Overall Assessment:** Strategic fit is strong (4.0/5.0 weighted score). Recommended to proceed with Phase 1 (reference architecture whitepaper).

---

## What Was Evaluated

1. **Architectural Fit:**
   - How iPCMax DIN-rail IPC gateways complement DGX Spark's high-performance inference layer
   - Protocol bridging (Modbus, CAN, IO-Link → MQTT/OPC UA)
   - Kubernetes integration via NVIDIA NGC Helm Charts
   - Sovereign/air-gap operation for GDPR/EU AI Act compliance

2. **Market Positioning:**
   - Competitive differentiation: only bundled sovereign industrial AI stack vs. cloud-only competitors
   - Three-tier product bundle ($8.5K–€50K) targeting SMB to enterprise
   - 12–18 month payback period via downtime avoidance + operational savings

3. **Risk Analysis:**
   - Kubernetes compatibility (requires modern kernel/cgroups v2): **Mitigated by Phase 1 validation**
   - Thermal + power management: **Mitigated by cabinet design + UPS planning**
   - Support SLA mismatch: **Mitigated by iPCMax SLA addendum negotiation**
   - Liability boundaries: **Mitigated by clear terms-of-service responsibility split**

4. **Three-Phase Go-to-Market:**
   - **Phase 1 (4–8 weeks):** Joint reference architecture whitepaper + NGC integration guide
   - **Phase 2 (3–6 months):** Pilot 3 customers (manufacturing, utilities, smart building)
   - **Phase 3 (6–9 months):** Launch Sovereign Industrial AI Bundle on dws10.com

---

## Supporting Documents

- **Primary:** `docs/lut/ipcmax-serdex-hardware-partner-evaluation-2026-08.md` (v1.0, full 8-section evaluation)
- **Reference Architecture:** `docs/assets/images/ipcmax-dgx-spark-reference-architecture-2026-08.png` (SVG source); `docs/Ref_Architecture_iPCMax.jpg` (high-res render, cross-referenced 30.08.2026)
- **Bill of Materials:** Section 5.1 in evaluation doc (Tier 1/2/3 pricing)
- **Kubernetes Architecture:** Section 5.2 (deployment topology + data flow)

---

## Key Decision Points for HIC

### 1. Proceed with Phase 1 (Reference Architecture)?

- **Cost:** ~€15K internal labor
- **Timeline:** 4–8 weeks
- **Outcome:** Ready to approach first 2–3 pilot customers
- **Risk:** Low (architectural validation, no capital commitment)
- **Recommendation:** ✓ **APPROVED**

### 2. Authorize Executive Outreach to iPCMax/Serdex?

- **Scope:** CEO-level introduction to product & BD leadership
- **Framing:** "Joint market opportunity in EU sovereign industrial AI"
- **Goal:** NDA + technical collaboration framework
- **Timeline:** Kickoff within 2 weeks of approval
- **Risk:** Low (exploratory, non-binding)
- **Recommendation:** ✓ **APPROVED**

### 3. Approve Phase 2 Pilot Budget (€38K total)?

- **Breakdown:** 3 pilots (manufacturing €11K, utilities €17K, smart building €10K) over 6 months
- **Expected Outcome:** 3 customer case studies + proof of NVIDIA NGC Helm Chart compatibility
- **Success Metric:** All 3 pilots run 30+ days without unplanned downtime
- **Risk:** Medium (depends on iPCMax + NVIDIA software integration)
- **Recommendation:** ✓ **CONDITIONAL APPROVAL** (subject to Phase 1 whitepaper validation)

---

## Outstanding Questions for HIC Clarification

1. **Partner Selection:** Should we contact iPCMax directly, or seek a channel partner (EU distributor)?
2. **Liability Model:** Is DWS comfortable taking joint responsibility for end-to-end system (hardware + software) in customer deployments?
3. **Pricing Strategy:** Should Tier 1/2/3 bundles be sold as "DWS IQ Industrial" or co-branded "DWS IQ + iPCMax Sovereign AI"?
4. **Support Model:** Should DWS provide Tier 2/3 support directly, or resell iPCMax support + add a DWS IQ software layer?

---

## What Comes Next

1. **HIC Decision (this session):** Approve/conditional/reject Phase 1
2. **If Approved:**
   - DWS engineer assigned to Phase 1 whitepaper (week of Sept 6)
   - Identify 2 pilot customer prospects (manufacturing, utilities)
   - Schedule kickoff call with iPCMax technical team (by Sept 13)
3. **Phase 1 Deliverables (by mid-October):**
   - Joint whitepaper: "Sovereign Industrial AI Reference Architecture"
   - NGC Helm Charts integration guide + deployment scripts
   - Bill of Materials + cost estimates (validated with iPCMax)
   - First customer pitch deck

4. **Checkpoint (week 6–8 of Phase 1):**
   - HIC review of draft whitepaper
   - Kubernetes compatibility test results confirmed
   - Identify 1–2 Phase 2 pilot customers
   - Decide on Phase 2 budget commitment

---

## Evidence & Sources

- NVIDIA NGC Helm Charts documentation: https://docs.nvidia.com/cuda/container-toolkit/
- NVIDIA DGX Spark specs: https://www.nvidia.com/en-us/data-center/dgx-spark/ (price list: dws10.com/price-list)
- iPCMax industrial PC overview: https://www.ipcmax.eu/ (partner validation pending)
- Reference architecture diagram created: `docs/assets/images/ipcmax-dgx-spark-reference-architecture-2026-08.png`
- EU AI Act Article 14 (human oversight): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021PC0206 (§2.3 in evaluation doc)
- GDPR Article 32 (data controller responsibility): https://gdpr-info.eu/art-32-gdpr/

---

## Follow-Up Actions for Next Session

- [ ] HIC decision on Phase 1 approval
- [ ] DWS engineer assignment (if approved)
- [ ] iPCMax executive contact scheduled
- [ ] Pilot customer prospect list compiled
- [ ] Whitepaper outline drafted (by Sept 6)

---

---

**Field Note Version:** 1.0  
**Created:** 30.08.2026  
**Status:** Ready for HIC Review  
**Confidentiality:** Business Confidential — Lifetime Oy

**Next Review:** Post-Phase-1-completion (target: mid-October 2026)

**Contact for Questions:** Risto Anton Päärni, Founder, CEO  
Lifetime Oy · risto.paarni@lifetime.fi · +358 400 319 010
