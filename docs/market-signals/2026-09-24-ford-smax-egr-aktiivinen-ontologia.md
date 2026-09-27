---
signal_id: MS-2026-09-003
reality: Ford S-Max 2.0 diesel. Oire: pakokaasua konetilaan; ECU ei hyväksy resetointia; EGR-arvo alueen ulkopuolella. Mahdollisia syitä: EGR-putki, EGR-tiiviste, pakosarja, vaihdettu EGR viallinen, turbon ja EGR-putken liitos, sähkövika, johtosarja. HIC etsi osaa: Googlaus → Aeromotors (ei varmuutta oikeasta osasta) → soitto Ford Store Konalaan → OEM-osanumero → yhteensopivuuksien selvitys → sama osa Mondeo/Galaxy/S-Max → Ovoko (käytetty 26 €) ja Ford Saksa löydetty → ostopäätös. Aeromotorsin uusi osa 92 € jäi ostamatta.
observation: Asiakas ei ollut ostamassa EGR-putkea vaan hypoteesia: hän ei tiennyt osaa eikä edes sitä, mikä komponentti on rikki, ja halusi varmistua, että korjaa oikean ongelman. Verkkokauppa sanoi käytännössä 'tule takaisin kun tiedät vastauksen'. Kaikki järjestelmät pakottivat asiakkaan asiantuntijaksi ennen ostoa; asiakas teki ontologisen päättelyn (tunnistus, yhteensopivuus, riski, vaihtoehdot) itse. Aeromotors ei hävinnyt hinnan vaan tiedon vuoksi; todellinen kilpailija oli asiakkaan käyttämä aika.
signal: Kauppa ei ratkea halvimpaan hintaan eikä saatavuuteen vaan vähäisimpään epävarmuuteen; kauppias, joka ei tee diagnostiikkaa, häviää diagnostiikkaan.
insight: Asiakas ei halunnut ostaa EGR-putkea. Hän halusi varmistua siitä, että korjaa oikean ongelman. Agentic Commerce v2:n tärkein ominaisuus ei ole ostaminen vaan Diagnostic Compression: epävarmuuden poistaminen + tarpeen ymmärtäminen + päättely asiakkaan puolesta + ostaminen sivutuotteena. Aktiivinen ontologia lähtee oireesta, ei osasta: Observation → Candidate causes → Evidence → Likelihood → Repair paths → Required parts → Purchase options. Passiivinen ontologia näyttää tuotteita; aktiivinen ontologia vastaa "mitä asiakas yrittää saada aikaan" ja johtaa ratkaisuun. Asiakas ei osta hakua, katalogia eikä ontologiaa; hän ostaa sen, ettei hänen tarvitse päätellä itse.
source: customer conversation
date: 2026-09-24
observed_at: 2026-09-24
signal_at: 2026-09-24
insight_at: 2026-09-24
decided_at: 2026-09-24
kb_updated_at: 2026-09-24
observer: HIC
confidence: high
occurrences: 1
evidence: {cases: 1, lost_sale_eur: 92, alternative_used_eur: 26, manual_steps: 9, models_sharing_part: 3}
affected: [dws10.com, dws10.com/buy, offering, workflows, onelifetime.world]
status: accepted
hypothesis: Kun dws10.com:n katalogi (136 tuotetta) muutetaan passiivisesta hinnastosta aktiiviseksi ontologiaksi (tarve → tilanne → toimiala → tavoite → riskit → 3 relevanttia vaihtoehtoa → ostopolku), ostopolun keskeytykset vähenevät ja keskikauppa nousee, koska kauppa ratkeaa epävarmuuden vähenemiseen eikä hintaan. Tuotteita ei tarvitse poistaa; näkymästä tehdään älykäs.
refuting_evidence: Jos 60 päivän kuluessa aktiivisen tarve-näkymän julkaisusta dws10.com:lla ostopolun keskeytykset (buy → checkout) eivät laske tai ostajat pyytävät edelleen ensin hinnastoa, hypoteesi on väärä tai näkymä ei ole aidosti aktiivinen. Toinen kumoaja: suositus osoittautuu väärin päätellyksi (väärä osa / väärä tuote) useammin kuin 1/20 tapauksessa.
learning_delta:
  id: LD-2026-09-003
  old_assumption: "Agentic Commerce auttaa ostamaan (= tuotesuositus). Verkkokaupan tehtävä on näyttää tuotteet."
  new_learning: "Agentic Commerce auttaa päättämään; ostaminen on seuraus. Turvallisuus syntyy, kun epävarmuus vähenee riittävästi, jotta päätös voidaan tehdä luottavaisesti. Asiakas ei tarvitse enemmän tietoa vaan vähemmän epävarmuutta. Agentic Commerce = tarpeen tunnistaminen ja epävarmuuden poistaminen riippumatta käyttöliittymästä; ei AI-chat. Aktiivinen ontologia on päättelykerros, joka voi näkyä kyselynä, diagnostiikkapuuna, hakuna, suosittelijana, verkkokauppana, asiantuntijana tai chatina. Passiivinen ontologia → aktiivinen ontologia, joka lähtee oireesta eikä osasta."
  ontology_change: "Lisätään käsitteet Oire, Ehdokassyy, Todennäköisyys, Korjauspolku ja Ostoskori-suositus (todennäköinen / mahdollinen / tarkistettava). Asiakas–tuote-suhde: vanha oletus 'asiakas valitsee tuotteen katalogista'; uusi 'asiakas ilmaisee tavoitteen; ontologia päättelee tilanteen, toimialan, riskit ja kolme vaihtoehtoa'. Lisätään käsitteet Tarve, Tavoite, Epävarmuus ja Ostosuositus; tuote on niiden seuraus, ei lähtökohta."
  hic_decision: APPLY
  decision_reasoning: "HIC 24.09.2026: APPLY. Scope dws10.com ja dws10.com/buy. Asiakas ei tarvitse lisää tuotteita eikä lisää blogitekstejä; hän tarvitsee vähemmän epävarmuutta. Aktiivinen ontologia ei näytä tuotteita: se ymmärtää tilanteen, vähentää epävarmuutta ja ohjaa oikeaan päätökseen. Ostaminen on seuraus, ei tavoite. Ei chat-first: Need → Context → Understanding → Recommendation → Action."
  applied_to: [dws10.com, dws10.com/buy]
  excluded: [lifetime.fi, investor-centre, merchant-public-naming]
  approved_by: HIC
  approved_at: 2026-09-24
  effective_from: 2026-09-24
  world_model_version: 1.3.0
decision: active_ontology_buy_layer_v1
comprehension: "HIC 24.09.2026: en ollut ostamassa osaa vaan hypoteesia; kauppias hävisi diagnostiikkaan; sama pätee DWS IQ:iin — asiakas haluaa varmistua, että ratkaisee oikean ongelman."
application_decision:
  applies_to: [dws10.com (tarve-näkymä: 'Miten vähennän raportointia / täytän NIS2:n / saan lisää liidejä / automatisoin tarjoukset' → 3 vaihtoehtoa), dws10.com/buy (suositus + perustelu ennen hintaa), offering (Agentic Commerce 365 -positiointi: 'vähäisin epävarmuus, ei halvin hinta'), workflows (Chapter 0/1 funnel: tarve ennen tuotetta), onelifetime.world (Journal-teksti 'Passiivisesta aktiiviseen ontologiaan' Ford S-Max -esimerkillä)]
  does_not_apply_to: [lifetime.fi (WHY-kerros ei näytä tuotteita), investor-centre (erillinen päätös), Aeromotors/Ovoko julkinen nimeäminen (esimerkki kirjoitetaan 'varaosakauppa A / käytettyjen osien alusta B')]
  basis: [MS-2026-09-003, products.json v1.30 (136 tuotetta), Agentic Commerce 365 (AC365-T3)]
  valid_until: 2026-12-31 tai ensimmäisen aktiivisen tarve-näkymän 60 pv arviointi
  affects: [dws10.com-ostajat pk ja teollisuus, Agentic Commerce -asiakkaat]
dispatched_runs:
  - docs/specs/active-ontology-ux-v2.md (UX-spesifikaatio, Kemira-case; toteutus dws10.com seuraava)
impact:
  - {target: dws10.com, status: in progress, note: spec docs/specs/active-ontology-ux-v2.md; tarve-näkymä valintapolkuna (ei chat) 'Mikä kuvaa tilannettasi parhaiten?' → 'Mikä on tärkeintä?' → 3 vaihtoehtoa; katalogi taustalle}
  - {target: dws10.com/buy, status: not started, note: suositus ja perustelu ennen hintaa; ostoskori-suositus todennäköinen/mahdollinen/tarkistettava}
  - {target: offering, status: proposal, note: ei HIC:n applied_to-listalla 24.09; Agentic Commerce 365 -positiointi vaatii erillisen päätöksen}
  - {target: workflows, status: proposal, note: ei applied_to-listalla; Chapter 0/1 funnel tarve ennen tuotetta refiner-ehdotuksena}
  - {target: onelifetime.world, status: proposal, note: ei applied_to-listalla; Journal-teksti vaatii erillisen päätöksen}
  - {target: lifetime.fi, status: excluded}
  - {target: investor-centre, status: excluded}
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

## Tarkennus (HIC 24.09.2026): ostettiin hypoteesia, ei osaa

Alkuperäinen ketju Tarve → Oikea osa → Osta oli liian yksinkertainen. Todellinen tilanne:

```
Oire: pakokaasua konetilaan
→ Ehdokassyyt: EGR-putki · EGR-tiiviste · pakosarja · vaihdettu EGR viallinen
  · turbon ja EGR-putken liitos · sähkövika · johtosarja
→ Lisähavainto: ECU ei hyväksy resetointia, EGR-arvo alueen ulkopuolella
→ Todennäköisyydet muuttuvat → tarvittavat osat muuttuvat → vasta sitten ostaminen
```

Aktiivinen ontologia olisi vastannut: "Havaitut oireet viittaavat useimmiten EGR-putkeen tai
sen liitoksiin. Suosittelemme samalla vaihtamaan tiivisteen. Koska ECU ilmoittaa EGR-arvon
olevan alueen ulkopuolella, tarkista myös johtosarja ja venttiilin sähköliitännät ennen
lopullista osatilausta." Suositeltu ostoskori: ✓ EGR-putki ✓ EGR-tiiviste ✓ johtosarja
? pakosarja (tarkistettava). Varaosakauppa A ei hävinnyt hintaan eikä saatavuuteen; se hävisi
diagnostiikkaan. Jos se olisi tehnyt tämän työn, koko korjauspaketti olisi ostettu sieltä:
"aikani on rahaa".

## Tarkennus 2 (HIC + Copilot 24.09.2026): oire tarkoittaa keskustelua, ja ihmiset vihaavat chattiä

Asiakas ei osta tuotetta, kun hän ymmärtää tuotteen. Asiakas ostaa, kun hän ymmärtää ongelmansa
riittävän hyvin tehdäkseen päätöksen. Aktiivisen ontologian tehtävä ei ole opettaa kaikkea vaan
lyhentää matkaa: En tiedä → Ymmärrän riittävästi → Uskallan päättää → Ostan.

Käyttöliittymä ei ole chat, ellei chat ole todella hyvin toteutettu. Todellinen käyttäytyminen
on: oire → turhautuminen → 10 välilehteä → Google → YouTube → foorumi → puhelu asiantuntijalle →
vastaus → osto. Aktiivinen ontologia näyttää diagnostiikkapolulta, ei keskustelulta:

```
Mikä ongelma sinulla on?     ○ Pakokaasun haju ○ Vikavalo ○ Tehon puute ○ Katsastusvika
Milloin se esiintyy?         ○ Kylmänä ○ Lämpimänä ○ Kiihtyessä ○ Tyhjäkäynnillä
Onko vikakoodi?              ○ Kyllä ○ Ei
```

DWS IQ:ssa sama: ei "Kerro liiketoimintaongelmasi" vaan

```
Mikä kuvaa tilannettasi parhaiten?
○ Raportointiin menee liikaa aikaa ○ Tarjouksia tehdään käsin ○ NIS2 huolestuttaa
○ Asiakastieto on hajallaan ○ Verkkonäkyvyys ei riitä ○ Copilot ei riitä
Mikä on tärkeintä?
○ Säästää aikaa ○ Kasvaa ○ Vähentää riskiä ○ Täyttää velvoitteet
```

Asiakas ei koe olevansa keskustelussa. Hän kokee saavansa apua. Chat kysyy "kerro ongelmastasi";
aktiivinen ontologia kysyy "auta minua tunnistamaan tilanteesi". Vastaus blogilla "Mikä on
NIS2?" ei poista ostamisen estettä; asiakas tarvitsee tilanteen ymmärtämisen → vaihtoehdot →
vaikutukset → suosituksen → ostopolun. Tässä blogi, ontologia, agentit ja commerce ovat sama
putki.

## DWS IQ -sovellus (sama ilmiö B2B:ssä)

Asiakas ei halua ostaa Compliance Agentia. Asiakas haluaa varmistua, että ratkaisee oikean
ongelman. Kun järjestelmä pienentää epävarmuuden riittävästi, ostopäätös syntyy helpommin kuin
hinnastoa yksinkertaistamalla tai tuotteita poistamalla.

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
