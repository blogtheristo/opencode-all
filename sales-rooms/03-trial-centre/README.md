# Room 3 — Trial Centre

**Noux title:** `Trial Centre | DWS IQ tuoteperhe | Firehorse tuoteperhe | Customer Support`
**Noux tags:** `Boardy.ai`
**Noux status:** **Aktiivinen** / Käynnissä — 1 visitor, 1 invite, 0 attachments (2026-08-30)
**Room owner:** Risto Anton Päärni, Founder, CEO · Lifetime Oy

---

## Purpose

The buying room for **trial and pilot customers**. This is the room the demo phase actually runs through:
a prospect gets an invite, lands in the room, and one click away is their own populated demo tenant
(`dev.<customer>@dws10.com`).

**This room is already live with a visitor and 0 attachments.** That is the gap to close first — a room
with a visitor and nothing to open wastes the only visit we have had.

## Audience (roles per `DWS_ROLES_REGISTRY.md`)

| Stage       | Role in the customer org               | What the room must answer                             |
| ----------- | -------------------------------------- | ----------------------------------------------------- |
| First touch | Sustainability / compliance lead       | "Does this cover CSRD / ETS / CBAM for my industry?"  |
| Evaluation  | Head of operations, plant/site manager | "What changes in my daily work?"                      |
| Technical   | CIO / IT security / data protection    | Sovereignty, RLS, EU hosting, NIS2, EU AI Act posture |
| Decision    | CFO / CEO                              | Price, pilot scope, time-to-value, exit terms         |

## Visitor journey (demo phase)

1. Invite (Boardy intro, outbound, or inbound from the sites) → room link.
2. Industry-relevant proof: the case closest to their sector.
3. **Demo tenant CTA** → `dev.<customer>@dws10.com`, provisioned with their name and industry data.
4. Trial scope one-pager: what a 30-day trial includes, what it costs, what happens after.
5. Pilot agreement + DPA for signature.

## Demo-stage checklist

- [ ] **At least 3 attachments live before the next invite goes out** (currently 0)
- [ ] Trial scope + pricing one-pager (price resolves from `dws10.com/config/products.json`)
- [ ] Two industry cases (steel/materials + construction) exported to PDF
- [ ] Sovereignty & security one-pager for the technical gate
- [ ] DPA attached
- [ ] Demo tenant provisioned and linked per `../DEMO_TENANTS.md`
- [ ] Trial expiry event in Google Calendar at provisioning time
- [ ] Identify the existing visitor and follow up (see `OUTREACH.md`)

## Guardrails

- Demo tenant data is **synthetic**. Real customer data means NDA + pilot, not demo.
- No `.md` uploaded raw; exports only.
- Support promises in the room match what Customer Support can actually deliver — do not advertise an
  SLA that does not exist.
