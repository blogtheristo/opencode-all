# Handoff — claude/sarkain-oy-vendor-gddyf0

## What happened

Inbound vendor message from Kalle Sonninen (Sarkain Oy, Turku, Y-tunnus 3180183-9) expressing
interest in the ORK/1462/2026 (Tekoälyn asiantuntijapalvelut) subcontractor network — he called
this "Nerot-palvelun tarjouspyyntö." No prior NDA with Sarkain; he gave a phone number
(0451237465) but no email address.

## What I did

1. Created `bids/ORK160826/ORK160826_SARKAIN_KIRJEENVAIHTO.md` — records the inbound message, a
   drafted Finnish reply (NOT sent — outbound email is RED-zone, human must send), and a due
   diligence section.
2. Due diligence: tried to fetch www.sarkain.fi via Playwright (`scripts/screenshot.mjs`, after
   `npm install playwright --no-save` since the package wasn't installed locally) and via
   WebFetch — both were blocked by this session's egress policy (403 from the proxy, not the
   site — see `curl $HTTPS_PROXY/__agentproxy/status`). Fell back to WebSearch: company founded
   ~2011 as a student project, registered as Oy in 2020, Turku, **registered headcount 1**,
   revenue €593.1k (FY2024), CEO Kalle Sonninen. Services: web/mobile/backend dev, AI
   (ChatGPT integrations, RPA, chatbots). References: a taxi-dispatch platform, ecoCauco
   (IoT temp/humidity monitoring). Flagged as a **capacity risk** given the tender needs named
   CVs committing to up to 400 person-days/role across the 2+1+1-year term — the draft reply
   asks directly whether Sarkain delivers with own staff or a partner/freelancer network.
3. Added Sarkain Oy as row 13 in the Group B (kotimaiset potentiaaliset kumppanit) table in
   `bids/ORK160826/ORK160826_ALIHANKINTALOMAKE.md`, bumped its version header to 2.1.
4. Committed and pushed to `claude/sarkain-oy-vendor-gddyf0`.

## Still open / next steps

- **The drafted reply has not been sent.** Risto needs to send it (email address is unknown —
  the draft's first ask is for Sarkain to confirm an email so the NDA can go out).
- **EOI deadline is 11.7.2026** — 2 days out from when this was drafted (9.7.2026). Time-sensitive.
- If Sarkain responds with capacity/pricing, update the KIRJEENVAIHTO file with the next round
  (same pattern as `ORK160826_CUBET_KIRJEENVAIHTO.md`) and reassess whether they get promoted to
  Group A (NDA signed) or excluded on capacity grounds.
- `playwright` was installed locally via `npm install playwright --no-save` (not persisted to
  package-lock since `--no-save`); if browsing sarkain.fi or other public sites is needed again in
  this kind of session, expect the same egress-policy 403 and rely on WebSearch instead.
