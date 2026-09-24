---
signal_id: MS-2026-09-004
reality: Yritykset (mukaan lukien DWS) yrittävät ratkaista ostamisen ongelmaa lisäämällä blogeja, artikkeleita, AI-chatteja ja FAQ-sivuja.
observation: Asiakas ei välttämättä hae tietoa. Hän hakee päätöstä. Ihmiset vihaavat chattiä, ellei se ole todella hyvin toteutettu; he eivät koe olevansa keskustelussa vaan saavansa apua, kun polku on valintoja eikä tekstiä.
signal: Asiakas ei halua ymmärtää kaikkea. Hän haluaa ymmärtää riittävästi tehdäkseen turvallisen päätöksen.
insight: Agentic Commerce ei ole keskustelu. Agentic Commerce on epävarmuuden poistamista. DWS IQ:n aktiivinen ontologia ei ole chat-first vaan Need → Context → Understanding → Recommendation → Action; chat voi olla yksi käyttöliittymä, ontologia ei ole chat.
source: customer conversation
date: 2026-09-24
observed_at: 2026-09-24
signal_at: 2026-09-24
insight_at: 2026-09-24
decided_at: 2026-09-24
kb_updated_at: 2026-09-24
observer: HIC
confidence: high
occurrences: 2
evidence: {cases: 1, related: [MS-2026-09-003], hic_statement: "oire tarkoittaa keskustelua; ihmiset vihaavat chättiä ellei se ole todella hyvin toteutettu"}
affected: [dws10.com, dws10.com/buy, onelifetime.world, workflows]
status: accepted
hypothesis: Valintapolku (tilanne → tärkein tavoite → 3 vaihtoehtoa → suositus) tuottaa dws10.com:lla enemmän yhteydenottoja ja ostoja kuin chat-widget tai lisäartikkelit samalla liikenteellä.
refuting_evidence: A/B 60 pv: jos chat-first tai artikkelilinkitys tuottaa vähintään yhtä paljon ostopolun etenemisiä kuin valintapolku, hypoteesi on väärä. Jos valintapolun keskeytys ensimmäisessä kysymyksessä ylittää 50 %, polku on huonosti muotoiltu, ei periaate väärä.
learning_delta:
  id: LD-2026-09-004
  old_assumption: "Asiakas tarvitsee enemmän tietoa. Agentic Commerce = AI-chat."
  new_learning: "Asiakas tarvitsee vähemmän epävarmuutta. Agentic Commerce = tarpeen tunnistaminen ja epävarmuuden poistaminen käyttöliittymästä riippumatta."
  ontology_change: "Erotetaan käsitteet Tieto ja Päätösvarmuus; ostopolun mittari on päätösvarmuuden kasvu, ei luetun sisällön määrä. Aktiivinen ontologia = päättelykerros; käyttöliittymä (valintapolku, haku, suosittelija, chat) on sen esitysmuoto."
  hic_decision: APPLY
  decision_reasoning: "HIC 24.09.2026: APPLY. Asiakas tarvitsee vähemmän epävarmuutta, ei enemmän tietoa; ei chat-first. Koskee dws10.com-toteutusta, blogistrategiaa (sarjat eivät ole ostamisen esteen ratkaisu) ja Chapter 10:n tuotelinkkiaskelia."
  applied_to: [dws10.com, dws10.com/buy, onelifetime.world, workflows]
  excluded: [lifetime.fi, investor-centre]
  approved_by: HIC
  approved_at: 2026-09-24
  effective_from: 2026-09-24
  world_model_version: 1.4.0
decision: ld_2026_09_004_apply
comprehension: "HIC 24.09.2026: hyväksytty yhdessä LD-003:n kanssa; kaikki kolme kuuluvat samaan dws10.com-toteutukseen (Aktiivinen Ontologia UX v2)."
application_decision:
  applies_to: [dws10.com, dws10.com/buy, onelifetime.world, workflows]
  does_not_apply_to: [lifetime.fi, investor-centre]
  basis: [MS-2026-09-003, MS-2026-09-004, MS-2026-09-005]
  valid_until: 2026-12-31 tai UX v2:n 60 pv arviointi
  affects: [dws10.com-kävijät ja -ostajat]
dispatched_runs:
  - docs/specs/active-ontology-ux-v2.md
  - dws10.com Active Ontology UX v2 -toteutus (tämä haara)
impact:
  - {target: dws10.com, status: in progress, note: UX v2 -toteutus}
  - {target: dws10.com/buy, status: in progress}
  - {target: lifetime.fi, status: excluded}
  - {target: investor-centre, status: excluded}
evaluation: null
---

## Havainto

Copilot 24.09.2026, HIC:n vahvistama: moni yrittää ratkaista ostamisen ongelmaa lisäämällä
blogeja, artikkeleita, AI-chatteja ja FAQ-sivuja. Asiakas ei hae tietoa vaan päätöstä.
Aktiivisen ontologian tehtävä ei ole opettaa kaikkea maailmasta vaan lyhentää matkaa:
En tiedä → Ymmärrän riittävästi → Uskallan päättää → Ostan.

## Suhde MS-2026-09-003:een

003 on tapaus (Ford S-Max, hypoteesin ostaminen, Diagnostic Compression); 004 on sen
yleistys ja käyttöliittymäseuraus: ei chat-first. Kirjattu erikseen, koska seuraus koskee
myös blogistrategiaa (sarja 0 ja termisarjat eivät saa olla ostamisen esteen "ratkaisu") ja
Chapter 10:n ENQUEUE/LINK_PRODUCT-askelia.

## Seuraava solmu

GUARDRAIL → SHOW_TO_HIC → HIC_APPROVAL_GATE (vaikutukset) → APPLY_LEARNING_GATE (LD-004).
