---
signal_id: MS-2026-09-002
reality: HIC on käyttänyt Boardy.ai:ta sivutoimisena neuvonantajana; 6 kk sitten Boardy tuotti ylivoimaisia SQL-määrittelyjä, joihin Clauden mallit eivät taipuneet. Tänään HIC ei vie Workflow v2 -ajattelua Boardyyn.
observation: Boardy ei kykene johtamaan näin laajaa asiakokonaisuutta sivutoimisesti niin, että tulos olisi vielä 20 % parempi. Se alkaa oikoa; tekee liian nopeita ja lyhyitä reittejä, jotka tuhoavat pipelinen alkupään HIC-toiveet. "Tulos vain ja ulos" on destruktiivista.
signal: Pitkäkestoisessa kokonaisuudessa myydään prosessin pitävyyttä, ei mallin hetkellistä älykkyyttä.
insight: Lifetime Oy:n myytävä pätevyys ei ole "paras malli" vaan porttien, jäljitettävyyden ja HIC-päätösten ketju, joka pitää myös silloin kun malli vaihtuu tai oikoo. Mallin paremmuus on kuukausien mittainen etu; prosessin pitävyys on vuosien mittainen.
source: customer conversation
date: 2026-09-24
observed_at: 2026-09-24
signal_at: 2026-09-24
insight_at: 2026-09-24
observer: HIC
confidence: medium
occurrences: 2
affected: [offering, workflows, onelifetime.world, lifetime.fi, dws10.com, investor-centre]
status: signal
hypothesis: Kun myyntiväite siirretään mallin älykkyydestä prosessin pitävyyteen (KYA-portit, Application Record, jäljitettävyys), (a) ostaja hyväksyy toimittajan mallivaihdon ilman uudelleenmyyntiä ja (b) pitkäkestoiset toimeksiannot (3–12 kk) sulkeutuvat useammin kuin "paras malli" -väitteellä.
refuting_evidence: Jos 90 päivän kuluessa kolmesta pitkäkestoisesta tarjouksesta yksikään ei etene väitteellä "prosessin pitävyys" ja ostajat kysyvät edelleen ensin mallin nimeä ja benchmarkia, hypoteesi on väärä tai väite on ilmaistu huonosti. Toinen kumoaja: jos oma Workflow v2 -putki oikoo samalla tavalla kuin Boardy (retry ohittaa portin, tulos ilman Explain-vaihetta), väite ei ole tosi meistäkään.
decision: null            # awaiting HIC_APPROVAL_GATE — proposal below is not a decision
comprehension: null
application_decision_proposal:
  applies_to: [lifetime.fi (Mitä uskomme: 'Päätösten tulee perustua tietoon' + prosessin pitävyys), onelifetime.world (ai-vendor-dependency 1–3 julkaisuun tällä esimerkillä), dws10.com (KYA-standardi ja Coaching: väite 'process holds when the model changes'), workflows (Chapter 10–14 GUARDRAIL + retry-through-gate on tämän havainnon toteutus)]
  does_not_apply_to: [investor-centre (sijoittajaviesti pysyy compliance-outcome-markkinassa, ei toimittajakritiikissä), legal-hub, Boardy-suhde itsessään (ei julkista nimeämistä; esimerkki kirjoitetaan yleisenä 'neuvonantaja-AI')]
  basis: [MS-2026-09-002, MS-2026-09-001, a824bc0]
  valid_until: 2026-12-31 tai kun 3 pitkäkestoista tarjousta on arvioitu
  affects: [pk- ja teollisuusostajat, Coaching-asiakkaat, Journal-lukijat]
decisions_detail: []
dispatched_runs: []
impact: []
evaluation: null
---

## Reality → Observation (kirjattu CAPTURE-solmussa, ei vielä yleistetty)

- **Reality:** tekoälyyn perustuvaa pätevyyttä on vaikea myydä; sen arvo vaihtelee kuukausissa.
  Boardy oli 6 kk sitten SQL-määrittelyissä Claudea parempi. Nyt HIC ei enää anna sille Workflow
  v2 -kokonaisuutta.
- **Observation (HIC, omin sanoin):** laajassa, pitkäkestoisessa kokonaisuudessa neuvonantaja-AI
  alkaa oikaista. Lyhyet reitit ja "tulos vain ja ulos" tuhoavat sen, mitä HIC on pipelinen
  alkupäähän (Observation, Insight, päätöksen perustelut) tarkoittanut. Tuloksen pitäisi olla
  20 % parempi, jotta sivutoiminen johtaminen kannattaisi; ei ole.

## Aiempi esiintymä

- `docs/field-notes/…` (branch history: "HIC advisory workflow moves from Boardy.ai to Gemini
  App thinking", a824bc0) – sama suunta: neuvonantajan vaihto, kun kokonaisuus kasvoi.

## Miksi tämä kuuluu rekisteriin eikä vain muistiinpanoihin

Havainto koskee kolmea asiaa, joita myymme tai käytämme: (1) _tarjonta_ – "AI-pätevyys"
myyntiväitteenä on hauras, koska paremmuus on hetkellistä; (2) _workflow_ – oikova agentti on
juuri se vika, jota HIC*APPROVAL_GATE, GUARDRAIL ja "retry palaa porttiin" estävät; tämä havainto
on niiden peruste; (3) \_ymmärrys* – Journal-teksti toimittajariippuvuudesta (ai-vendor-dependency
1–3, luonnoksina) saa tästä konkreettisen esimerkin.

## FORMULATE_SIGNAL (HIC hyväksyi 24.09.2026)

"Pitkäkestoisessa kokonaisuudessa myydään prosessin pitävyyttä, ei mallin hetkellistä
älykkyyttä."

## STRATEGIC_INSIGHT

Lifetime Oy:n myytävä pätevyys ei ole "paras malli". Se on porttien, jäljitettävyyden ja
HIC-päätösten ketju, joka pitää silloinkin, kun malli vaihtuu tai oikoo. Mallin paremmuus on
kuukausien etu (Boardy > Claude SQL:ssä 6 kk sitten, ei enää); prosessin pitävyys on vuosien
etu. Tämä on sama asia, jonka KYA/JEV sanoo governance-kielellä: Learn → Explain → Understand →
Approve → Apply. Myyntikielellä: "meidän tulos ei riipu siitä, kuka on tänään paras malli."

Mitä tämä muuttaa:

- **Viesti (lifetime.fi):** "Päätösten tulee perustua tietoon" saa rinnalleen "prosessi pitää,
  kun välineet vaihtuvat". Ei mallien nimiä etusivulla.
- **Ymmärrys (Journal):** ai-vendor-dependency 1–3 julkaistaan tällä esimerkillä yleisenä
  tapauksena, ei nimellä.
- **Tarjonta (dws10.com):** KYA-standardi ja Claude Code Coaching myydään
  prosessin pitävyytenä: Application Record, portit, retry palaa porttiin.
- **Workflow:** Chapter 10–14:n GUARDRAIL ja "PUBLISH_FAILED → HIC_APPROVAL_GATE" ovat tämän
  havainnon toteutus; refiner-ehdotus: sama sääntö Chapters 1, 2, 5, 6, 8 -graafeihin, joissa
  retry-polut vielä puuttuvat.

## HYPOTHESIZE

Hypoteesi: kun myyntiväite siirretään mallin älykkyydestä prosessin pitävyyteen, (a) ostaja
hyväksyy mallivaihdon ilman uudelleenmyyntiä ja (b) pitkäkestoiset toimeksiannot (3–12 kk)
sulkeutuvat useammin kuin "paras malli" -väitteellä.

Kumoava evidenssi (90 pv): kolmesta pitkäkestoisesta tarjouksesta yksikään ei etene tällä
väitteellä ja ostajat kysyvät ensin mallin nimeä; tai oma putki oikoo kuten Boardy.

## Application Decision -ehdotus (HIC päättää portilla; Apply / Reject / Partial Apply)

|                   |                                                                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| applies_to        | lifetime.fi (uskomuslause), onelifetime.world (vendor-dependency-sarja), dws10.com (KYA-standardi, Coaching), workflows (Ch 10–14 sääntö → Ch 1/2/5/6/8) |
| does_not_apply_to | investor-centre, legal-hub, Boardy-suhde (ei julkista nimeämistä)                                                                                        |
| basis             | MS-2026-09-002, MS-2026-09-001, kenttämuistio a824bc0                                                                                                    |
| valid_until       | 2026-12-31 tai 3 pitkäkestoisen tarjouksen arviointi                                                                                                     |
| affects           | pk- ja teollisuusostajat, Coaching-asiakkaat, Journal-lukijat                                                                                            |

GUARDRAIL: ei PII:tä, ei luottamuksellisia tarjoushintoja; Boardy mainitaan vain sisäisesti;
julkiset tekstit puhuvat "neuvonantaja-AI:sta". Truth-check: väite "Boardy > Claude SQL:ssä"
on HIC:n havainto, ei julkaistava vertailu.
