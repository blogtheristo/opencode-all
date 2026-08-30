# Session: v128-price-list-capacity-class-2026-08-30
Saved: 2026-08-30T18:00:00Z
Branch: feat/lifetime-positioning-research
Last commit: 2a00399d7 feat: add DWS Capacity Class Standard v1.1 with Secure Model Execution Boundary

## In progress
V1.28 hinnoittelun tarkistus ja Capacity Class -standardi. Tehty:
- DWS Capacity Class Standard v1.1 luotu (Secure Model Execution Boundary §3.3)
- 18 products.json tuotetta päivitetty capacityClass -data (DWS-IQ-006, Cloud Tiers, Aegis, K8S, DOCA, NIM, GOV, Hardware, Subscriptions)
- Governance chain: KYA (what) + Capacity Class (where) + Themis (verify) + Dev Model (test)
- OpenAI/Hugging Face incident (July 2026) ja capabilityt addressoitu
- Boardy'n ehdotus: "secure model execution boundary" yleisenä kolmannen osapuolen AI-artifaktien suojauksena

## Next step
1. Lisää capacityClass 98 jäljellä olevaan products.json tuotteeseen (AC365, AIS, CMP, CONSTR, CS, CSAT, DW, ESG, FH, GTM, HSE, IND, LAND, LF, LIFETIME, LOG, MO, QG, SEO, SG, SOV, SS, TH, VIA, WF, ai, aws, business, claude, consulting, conversational, devops, firehorse, lean, omnichannel, professional, sovereignty)
2. Päivitä product details pages (dwsiq.html, aegis.html, cloud-pricing.html, K8s/NIM/DOCA pages) capacity reference -osioilla
3. Sync muutokset landing-pages/dws10-com/ mirroriin

## Blockers
none

## Open PR
none

## Dirty files
 clean (kaikki committed)
