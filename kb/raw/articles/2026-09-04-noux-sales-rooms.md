# KB — Noux sales rooms, demo tenants, investor deck V6 (2026-09-04)

**Source:** `docs/field-notes/2026-09-04-noux-sales-rooms-and-investor-deck-v6.md`
**Branch:** `claude/noux-sales-rooms-setup-wu73bq` (PR #1826)

## Facts registered

- **Sales rooms have a repo home:** `sales-rooms/{01-certified-partners-centre,02-investor-centre,03-trial-centre}/`,
  each with `README.md` (room card), `DOCUMENTS.md` (asset manifest), `OUTREACH.md` (pipeline + signal→action loop).
  Repo is master; the Noux room is the published copy.
- **Demo tenant convention:** `dev.<customer-slug>@dws10.com`, synthetic data only, expiry enforced.
  Plan and workflows: `sales-rooms/DEMO_AUTOMATION_PLAN.md` (W1 provision · W2 daily expiry · W3 room doc sync · W4 room signals).
- **Deck of record:** `investor-outreach/DWS-INVESTOR-DECK-V6-2026Q3.md` — two GTM scenarios,
  A (SME Essentials) = untested hypothesis, B (enterprise workforce) = the only contracted software revenue.
  V4 and V5 retained and superseded.
- **Essentials pricing (single source, products.json priceVersion 1.29):** `DWS-IQ-ESS-SETUP` €799 one-time,
  `DWS-IQ-ESS-SUB-SELF` €49/mo, `DWS-IQ-ESS-SUB-MANAGED` €249/mo. The roadmap's "€750/mo + €200 hosting"
  beta wording is retired (roadmap v1.1).
- **Themis is not a product name.** `TH-T2` and `LAND-THEMIS` are discontinued (`discontinuedProducts`).
  Customers buy DWS IQ Essentials / Pro / Enterprise.
- **Round record (DWS_TRUTH_STANDARD.md v5.0):** €650k SAFE, €3.8M post-money cap, 20% discount, 24-month
  maturity, 1 Admiral allocation €250k + 8 Captain allocations €50k. **Captain = investor position**, not a
  board seat, client position or "captain hat". The 22.08.2026 sweep row calling the same terms unverified is
  **superseded**. Not yet a closed round; instrument language awaits counsel confirmation.

## Reusable lessons

1. **A deck is a canon consumer.** Every contradiction it exposed (self-contradicting price, discontinued
   brand still sellable, two registry rows disagreeing about one round) had been in the repo for weeks and
   only surfaced when one document depended on all of them at once.
2. **Label hypotheses as hypotheses.** V5 was accurate and still unshippable because it voiced an untested
   commercial hypothesis like contracted revenue. The fix was labelling plus a stated failure condition,
   not new data.
3. **Environment fact:** `scripts/render-doc.sh` cannot run from a Claude Code cloud session — it shells out
   over SSH to a LAN host and the container has no `ssh`/`scp`. Use the Chromium fallback there; run pandoc
   from Win11 or the DGX.
