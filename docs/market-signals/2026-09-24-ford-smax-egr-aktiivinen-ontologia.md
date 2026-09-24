---
signal_id: MS-2026-09-003
reality: Ford S-Max 2.0 diesel, EGR-putki rikki. HIC etsi osaa: Googlaus → Aeromotors (ei varmuutta oikeasta osasta) → soitto Ford Store Konalaan → OEM-osanumero → yhteensopivuuksien selvitys → sama osa Mondeo/Galaxy/S-Max → Ovoko (käytetty 26 €) ja Ford Saksa löydetty → ostopäätös. Aeromotorsin uusi osa 92 € jäi ostamatta.
observation: Asiakas ei etsinyt EGR-putkea vaan halusi auton takaisin liikenteeseen. Kaikki järjestelmät pakottivat asiakkaan asiantuntijaksi ennen ostoa; asiakas teki ontologisen päättelyn (tunnistus, yhteensopivuus, riski, vaihtoehdot) itse. Aeromotors ei hävinnyt hinnan vaan tiedon vuoksi; todellinen kilpailija oli asiakkaan käyttämä aika.
signal: Kauppa ei ratkea halvimpaan hintaan vaan vähäisimpään epävarmuuteen; passiivinen katalogi siirtää ontologisen päättelyn asiakkaalle.
insight: Agentic Commerce ei ole parempi verkkokauppa vaan järjestelmä, joka tekee asiakkaan puolesta sen ontologisen päättelyn, jonka asiakas nyt tekee itse. Passiivinen ontologia näyttää tuotteita; aktiivinen ontologia vastaa "mitä asiakas yrittää saada aikaan" ja johtaa ratkaisuun. Asiakas ei osta hakua, katalogia eikä ontologiaa; hän ostaa sen, ettei hänen tarvitse päätellä itse.
source: customer conversation
date: 2026-09-24
observed_at: 2026-09-24
signal_at: 2026-09-24
insight_at: 2026-09-24
observer: HIC
confidence: high
occurrences: 1
evidence: {cases: 1, lost_sale_eur: 92, alternative_used_eur: 26, manual_steps: 9, models_sharing_part: 3}
affected: [dws10.com, dws10.com/buy, offering, workflows, onelifetime.world]
status: signal
hypothesis: Kun dws10.com:n katalogi (136 tuotetta) muutetaan passiivisesta hinnastosta aktiiviseksi ontologiaksi (tarve → tilanne → toimiala → tavoite → riskit → 3 relevanttia vaihtoehtoa → ostopolku), ostopolun keskeytykset vähenevät ja keskikauppa nousee, koska kauppa ratkeaa epävarmuuden vähenemiseen eikä hintaan. Tuotteita ei tarvitse poistaa; näkymästä tehdään älykäs.
refuting_evidence: Jos 60 päivän kuluessa aktiivisen tarve-näkymän julkaisusta dws10.com:lla ostopolun keskeytykset (buy → checkout) eivät laske tai ostajat pyytävät edelleen ensin hinnastoa, hypoteesi on väärä tai näkymä ei ole aidosti aktiivinen. Toinen kumoaja: suositus osoittautuu väärin päätellyksi (väärä osa / väärä tuote) useammin kuin 1/20 tapauksessa.
learning_delta:
  id: LD-2026-09-003
  old_assumption: "Verkkokaupan tehtävä on näyttää tuotteet."
  new_learning: "Verkkokaupan tehtävä on ymmärtää tarve ja johtaa asiakas ratkaisuun. Passiivinen ontologia → aktiivinen ontologia."
  ontology_change: "Asiakas–tuote-suhde: vanha oletus 'asiakas valitsee tuotteen katalogista'; uusi 'asiakas ilmaisee tavoitteen; ontologia päättelee tilanteen, toimialan, riskit ja kolme vaihtoehtoa'. Lisätään käsitteet Tarve, Tavoite, Epävarmuus ja Ostosuositus; tuote on niiden seuraus, ei lähtökohta."
  hic_decision: PENDING
  applied_to: []
  excluded: []
decision: null
comprehension: null
application_decision_proposal:
  applies_to: [dws10.com (tarve-näkymä: 'Miten vähennän raportointia / täytän NIS2:n / saan lisää liidejä / automatisoin tarjoukset' → 3 vaihtoehtoa), dws10.com/buy (suositus + perustelu ennen hintaa), offering (Agentic Commerce 365 -positiointi: 'vähäisin epävarmuus, ei halvin hinta'), workflows (Chapter 0/1 funnel: tarve ennen tuotetta), onelifetime.world (Journal-teksti 'Passiivisesta aktiiviseen ontologiaan' Ford S-Max -esimerkillä)]
  does_not_apply_to: [lifetime.fi (WHY-kerros ei näytä tuotteita), investor-centre (erillinen päätös), Aeromotors/Ovoko julkinen nimeäminen (esimerkki kirjoitetaan 'varaosakauppa A / käytettyjen osien alusta B')]
  basis: [MS-2026-09-003, products.json v1.30 (136 tuotetta), Agentic Commerce 365 (AC365-T3)]
  valid_until: 2026-12-31 tai ensimmäisen aktiivisen tarve-näkymän 60 pv arviointi
  affects: [dws10.com-ostajat pk ja teollisuus, Agentic Commerce -asiakkaat]
dispatched_runs: []
impact: []
evaluation: null
---

## Reality → Observation → Signal → Insight

**Reality.** Ford S-Max 2.0 diesel, EGR-putki rikki. Yhdeksän manuaalista askelta ennen
ostopäätöstä: Googlaus, varaosakauppa A ilman varmuutta, soitto merkkiliikkeeseen, OEM-numero,
yhteensopivuudet, kolme mallia joissa sama osa, käytettyjen osien alusta B (26 €), Ford Saksa,
päätös. Varaosakauppa A:n uusi osa (92 €, toimitus 2 pv) jäi ostamatta.

**Observation (HIC).** Asiakas ei etsinyt EGR-putkea. Hän etsi: "Autoni on rikki. Tarvitsen
oikean osan. Haluan että auto toimii taas. En halua käyttää iltaa osanumeroiden metsästämiseen."
Kaikki järjestelmät pakottivat asiakkaan asiantuntijaksi ennen kuin hän sai ostaa. Ontologinen
työ (tunnistus, yhteensopivuusanalyysi, riskianalyysi, vaihtoehtojen kartoitus) tehtiin käsin.

**Market signal.** Kauppa ei ratkea halvimpaan hintaan vaan vähäisimpään epävarmuuteen.
Varaosakauppa A ei hävinnyt hinnan vaan tiedon vuoksi; todellinen kilpailija ei ollut alusta B
vaan asiakkaan käyttämä aika.

**Strategic insight.** Agentic Commerce ei ole parempi verkkokauppa. Se on järjestelmä, joka
tekee asiakkaan puolesta ontologisen päättelyn:

```
Ajoneuvo → Moottori → Vikakomponentti → OEM-numero → Yhteensopivat osat
→ Yhteensopivat mallit → Varastosaatavuus → Toimitusajat → Ostosuositus
```

ja vastaa: "Tarvitset osan XXXXXXX. Sama osa: Mondeo, Galaxy, S-Max. Uusi 92 € / 2 pv.
Käytetty 26 € / 5 pv, kunto tuntematon. Suositus: uusi, koska 66 € säästö ei kata mahdollista
uutta vaihtotyötä. Osta nyt." Asiakas olisi todennäköisesti maksanut 92 € enemmän mielellään
kuin tunnin selvitystyön.

## DWS IQ -sovellus (sama ilmiö B2B:ssä)

Asiakas ei etsi CMP-T1:tä, DWS-EU-STARTERia tai Climate Intelligenceä. Hän kysyy: miten
vähennän raportointiin kuluvaa aikaa, miten täytän NIS2:n, miten saan lisää liidejä, miten
automatisoin tarjoukset. Aktiivinen ontologia muuntaa: Tarve → Tilanne → Toimiala → Tavoite →
Riskit → Ratkaisut → Ostopolku. Passiivinen hinnasto sanoo "136 tuotetta"; aktiivinen ontologia
sanoo "ymmärrän tarpeesi, tässä kolme relevanttia vaihtoehtoa, muun katalogin pidän
taustalla". Tuotteita ei tarvitse poistaa; näkymästä tehdään älykäs.

## Yhteys aiempiin signaaleihin

- MS-2026-09-001: asiakas ostaa merkityksen ennen tuotetta → tämä signaali on sen BUY-kerroksen
  vastine: asiakas ostaa päättelyn, ei katalogia.
- MS-2026-09-002: prosessin pitävyys, ei mallin älykkyys → aktiivinen ontologia on
  malliriippumaton päättelyketju; malli vaihtuu, ontologia ei.
- Chapter 14 KB_UPDATE/WORLD_MODEL_UPDATE: "Construction → Waste Reduction → Competitiveness"
  on jo esimerkki aktiivisesta ontologiasta (tarve → merkitys), ei hakutermeistä.

## Seuraava solmu

HYPOTHESIZE tehty yllä → GUARDRAIL (ei PII: ostajan nimi ei kirjattu; kauppiaiden nimet
sisäisesti, julkisesti anonymisoituina) → SHOW_TO_HIC → HIC_APPROVAL_GATE (vaikutukset) →
APPLY_LEARNING_GATE (LD-2026-09-003).
