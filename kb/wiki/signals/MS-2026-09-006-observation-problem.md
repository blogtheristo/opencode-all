---
title: "MS-2026-09-006 — An observation problem, not a content or traffic problem"
signal_id: MS-2026-09-006
learning_delta: LD-2026-09-006
world_model_version: 1.6.0
hic_decision: APPLY
approved_at: 2026-09-24
applies_to: [dws10.com, dws10.com/buy, data-pipeline, workflows]
excluded: [lifetime.fi, investor-centre]
source: docs/market-signals/2026-09-24-havainto-ongelma-ei-sisalto-ongelma.md
---

# Applied learning (world model 1.6.0)

**Old assumption.** We have analytics (Cloudflare, Merchant, Supabase), therefore we have observations.

**New learning.** Traffic and event data are not observations. An observation is data + context +
meaning, and it exists only when a visitor states their situation or the system records what they
were trying to achieve. Reality/Traffic/Content/Products are green; Observation/Signals/Learning
are red. The website must become a sensor, not a publishing machine.

**Evidence (Supabase, 24.09.2026).** construction_leads 0, ted_leads 0, no market_signals table,
gtm_event_log 0, orders 0, blog_subscribers 0, web_leads 1; inbound_emails 309 all automation;
social_posts 127 all draft; booking_reservations 20 of which 3 real needs. The only genuine
customer observations in the whole system are the free-text fields of booking forms.

**How agents must use this.** Treat booking free text and Observation Intake rows as market
signals (Chapter 14 CAPTURE). Do not propose more content or campaigns as the fix for a buying
obstacle; propose ways to hear what the customer is trying to do. Active Ontology is an
Uncertainty Reduction System, not a Recommendation System.
