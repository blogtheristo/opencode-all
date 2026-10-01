# Aegis-pilotti suomeksi ja ostajan määrittely

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Date: 01.10.2026 | Changes: FI-osio Store-sivulle, ensikontaktiluonnos, ostajan määrittelyehdotus. | Harness: Claude Code + CLAUDE.md

Document Status:

- Created: 01.10.2026
- Status: PENDING_REVIEW

---

## Mitä tehtiin

- `Store/PRODUCT_AEGIS_PILOT.md`: lisätty `## Suomeksi` (kiristetty teksti). Englanninkielinen sisältö ei muuttunut.
- `sales-outreach/AEGIS_PILOT_FIRST_TOUCH_FI.md`: ensikontaktiluonnos. Ei lähetetty.
- Truth lint: 0 fail, 0 warn kummallekin tiedostolle.

## Korjaukset HIC:n alkuperäiseen tekstiin (vastaan oikeaan lähteeseen)

| Alkuperäinen väite                                  | Korjaus                                                                                                                                                                                                                | Lähde                                                                                                                           |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| "Yksi tuote on myynnissä"                           | Aegis on ennakkotilauksessa (preorder, pre-revenue). Coaching ja Climate Intelligence ovat `in_stock`.                                                                                                                 | `Store/PRODUCT_AEGIS.md:6,27`; `Store/PRODUCT_CLAUDE_CODE_COACHING.md:6`                                                        |
| "Agentti tekee töitä tuotannossa"                   | Lisätty: agentti suosittelee, ihminen päättää, ei fyysistä ohjausta.                                                                                                                                                   | `Store/PRODUCT_AEGIS_PILOT.md` "No physical control"                                                                            |
| "Ostaja ei ole IT-osasto"                           | Korvattu funktiolla. Datakeskus-kaistalla ostaja voi olla CISO tai CTO, joten kategorinen väite ei pidä.                                                                                                               | `DWS_ROLES_REGISTRY.md` §4; `docs/sales/2026-09-28-aegis-pilot-market-research.md:141`                                          |
| "Pysäytys todistetaan lokista"                      | Tuettu: operaattori allekirjoittaa komennon, avain ei ole tilahakemistossa, `authority` johdetaan vain allekirjoitetusta lokista.                                                                                      | `scripts/aegis-pilot.ts` (`stop`, `authority`); `aegis-pilot` SKILL.md hard rules                                               |
| "Päätöshistoria säilyttää hylätyt ja keskeytyneet"  | Tuettu pilottipaketissa (`human.decide` accept/reject/modify/defer, `abandonedShare`). Laajempi `decision_journey`-skeema (migraatio 094) on kirjoitettu mutta ei sovellettu (RED). Teksti puhuu vain pilotin lokista. | `docs/field-notes/2026-09-29-aegis-c5-operator-decision-event.md`; `docs/plans/2026-09-24-decision-journey-outcome-evidence.md` |
| "Reititys ongelmasta seuraavaan oikeaan päätökseen" | Jätetty pois asiakastekstistä. Vain speksi (`PATH_TRANSFERRED`), ei todennettu toimivaksi. Lisätään, kun on ajettu tapaus.                                                                                             | decision-journey §2.2                                                                                                           |
| "DWS IQ 7 Aegis"                                    | Käytetty `DWS IQ Aegis`. "DWS IQ 7" on alustasukupolven nimi (`DWS7_ROADMAP.md`), ei tuotenimi Truth Standardissa.                                                                                                     | `DWS_TRUTH_STANDARD.md`                                                                                                         |

## Ehdotus: ostaja määräytyy tehtävästä, ei tittelistä

**Ongelma.** Päätöksentekijä on oikea termi, mutta kuka se on, riippuu organisaatiosta, tittelistä ja tehtävien jaosta. Kiinteä titteli ("tehtaanjohtaja", "ei IT") on joillekin kohteille väärä.

**Periaate.** Roolirekisteri sanoo jo: sovita rooli toimintaan, ei organisaatiokaavioon, ja johda siitä, jolla on vipu tulokseen (`DWS_ROLES_REGISTRY.md` §5 "Lead with the revenue lever"). Decision Journey -speksi määrittelee ostajan samoin: se, joka kantaa vastuun ja vastaa kysymykseen "miten tähän päätökseen päädyttiin" (§2.1).

**Kolmen kysymyksen testi** (esitetään ensikontaktissa ja Phase 0:ssa):

1. Kenen nimissä tämän työnkulun päätökset tehdään?
2. Kuka vastaa jälkikäteen kysymykseen "miten tähän päädyttiin"?
3. Kenen tuloksesta tai budjetista työnkulun häiriö maksaa?

- Sama henkilö kaikissa kolmessa: hän on ostaja.
- Eri henkilöt: ostaja on kohdan 2 henkilö. Kohdan 1 henkilö on työnkulun omistaja ja puolustaja, IT ja tietoturva ovat teknisiä hyväksyjiä (R13–R16), talous ja hankinta allekirjoittavat (R20–R23).

**Lähtöoletus per kaista** (hypoteesi, ei fakta; varmistetaan ensimmäisessä keskustelussa):

| Kaista         | Todennäköinen ostaja                            | Lähde                                              |
| -------------- | ----------------------------------------------- | -------------------------------------------------- |
| A, valmistus   | R11 Plant Director tai R12 Operations Director  | Roolirekisteri §4; market research                 |
| B, datakeskus  | R15 CISO, pienemmissä R04 CTO                   | Roolirekisteri §4 (Data centres); research, Glesys |
| C, kaksikäyttö | R11 projektijohtaja, rinnalla R16 OT-tietoturva | Market research, Forcit                            |

**Mekanismi, ei vain sanamuoto.** Phase 0:n allekirjoitettu rajaus nimeää jo työnkulun omistajan, operaattorin ja teknisen yhteyshenkilön. Lisäys: nimetään myös päätösvastuun kantaja. Julkinen teksti puhuu funktiosta, tittelit näkyvät vain kaistakohtaisessa viestinnässä.

## Ohitetut vaiheet

- KB, Learn-HTML, Drive-vienti: N/A. Luonnosvaihe, ei hyväksyttyä lopputulosta vielä.
- Kalenteri: N/A. Ei päivättyjä sitoumuksia.
- Roolirekisterin päivitys: ei tehty. Ehdotus odottaa HIC:n päätöstä (Status: PENDING_REVIEW).

## HIC-päätöskysymys

Lisätäänkö kolmen kysymyksen testi `DWS_ROLES_REGISTRY.md` §5:een pysyvänä sääntönä ja Phase 0:n rajaukseen neljänneksi rooliksi "päätösvastuun kantaja"?

## Lisäys 01.10.2026 (sama istunto)

- HIC: agenttiparvi, tuotantohuone (control room), toimittamamme dedikoitu laitteisto, syötteet ja tulostavoitteet. Teksti päivitetty Store-sivun FI-osioon ja ensikontaktiin.
- HIC: pilotti on kokonaistoimitus. Laitekaavio hinnaston tuotteista: `docs/sales/AEGIS_PILOT_LAITEKAAVIO_FI.md`. Yhdeksän puuttuvaa osaa nimetty (operaattorin laiteavain ja työasema, kestotallennus, kytkin, palomuuri, aikalähde, UPS, teline, vain-luku OT-yhdyskäytävä).
- Ristiriita: EN Store-sivu sanoo "Hardware: None purchased" ja rajaa laitetoimituksen hyvityksen ulkopuolelle. Vaihtoehdot A/B kaaviotiedoston lopussa. Ei ratkaistu tässä PR:ssä; `products.json` ei muutettu.
- "Ohjaustiedot" kirjoitettu muotoon "ohjaussuositukset", koska "No physical control" on voimassa.
- HIC: pilotti toimitetaan meidän laitteillamme tai 100 % NVIDIA DGX -yhteensopivalla laitteistolla. Hinnaston 1x (`edge-node-gn100`, `LF-DGX-SPARK`) ja 2x (`LF-SITROOM-001`) GB10-solmut ovat laskentakerros. IGX Orin poistettu kaaviosta, ei DGX-yhteensopiva.

## Boardyn kommentit 01.10.2026 klo 20.02 (HIC välitti)

Sovellettu tekstiin: "yksi pullonkaula ratkaistuna yhdessä tuotantohuoneessa, valvonta tilannehuoneessa"; työnkulku asiakkaan pullonkaulasta, ei katalogista; asiakas ajaa hyväksymistestin itse; hylätty testi on tulos; myyvät luvut = päätöspolun kattavuus ja operaattorin aika per päätös (molemmat jo mitattavia: `journey` coverage/`abandonedShare`, `decision_latency_ms`); compliance on perustelu, ei syy; CIO/CISO saavat uskottavan arkkitehtuurin mutta eivät ole ostaja. "Parvi" poistettu kaikista teksteistä.

Ei sovellettu, odottaa HIC:tä: "ennakkotilaus". Truth-rajoite: Aegis on pre-revenue eikä sitä saa kuvata tuotantokäytössä olevaksi (`Store/PRODUCT_AEGIS.md:27`). Ehdotus korvaavaksi lauseeksi: "Aegis ei ole vielä kenelläkään tuotantokäytössä; pilotti on ensimmäinen toimitus." Kuluttajamainen "ennakkotilaus" pois, totuus säilyy.

GTM-reitti (Boardy): 2–3 rahaston operating partneria, kultakin yksi nimetty portfolio-kontakti, datakeskusoperaattorit ensin. Halvempi kuin 25 kylmää teollisuuskontaktia. Sopii kaistaan B. Ei kirjattu pipelineen ennen HIC:n päätöstä rahastoista.

Toimituslistat Outokumpu (Azure, Hybrid, 2 solmua) ja Kemira (Local/Edge, 1 solmu, IT-infra aukkoina): `docs/sales/AEGIS_PILOT_TOIMITUSLISTA_OUTOKUMPU_KEMIRA_FI.md`.

## HIC 01.10.2026, toimitusvaiheen rajaus

Sovellettu Store-sivun FI-osioon: laitteet eivät hyvity ja jäävät tilaajan omaisuudeksi; työnkulku asiakkaan prosessitarpeesta (erätason hiilijalanjälki, suvereenin tuotannon pullonkaula); aloituskatselmointi ja pilotointiprojektin asettaminen; toimitusvaiheen sopimuksen sisältö; suvereeniteetin mittaus; syötteiden rajat toimialan, standardien ja asiakkaan laatuvaatimusten mukaan.

Kaksi ristiriitaa, ei ratkaistu tässä:

1. **LWM.** HIC: Lifetime World Model -koulutus asiakasympäristöön kuuluu toimitusvaiheen sopimukseen. EN Store-sivu: "Outside the credit: LWM integration". FI-teksti sanoo nyt HIC:n mukaan; EN-rajausta ei muutettu. HIC päättää, kuuluuko LWM-koulutus 19 990 euron pilottiin vai vasta käyttöönottoon.
2. **"Parvi".** HIC:n teksti käyttää sanaa "agenttiparven koulutus"; Boardy 01.10.2026 pyysi pudottamaan "parvi"-sanan. Kirjoitettu "agenttien koulutus". HIC päättää.

HIC 01.10.2026: LWM v2 -koulutus asiakasympäristöön kuuluu pilottiin, koska se on joka tapauksessa tehtävä toimitukseen. EN Store-sivun rajaus "LWM integration" poistettu hyvityksen ulkopuolelta ja lisätty "includes"-listaan; sama `products.json`-huomautukseen ja landing-pages-peiliin samassa commitissa. Tuotesivujen HTML generoituu `update-store`-workflowssa mergessä.

HIC 01.10.2026: "ennakkotilaus" poistetaan, kun tuote alkaa olla valmis. FI-teksteissä (Store-osio, ensikontakti) sanaa ei enää ole. `availability: preorder` -kentät (`Store/PRODUCT_AEGIS*.md`, `products.json`) ja EN "Product status: preorder" (`Store/PRODUCT_AEGIS.md:27`) jäävät, kunnes HIC ilmoittaa GA:n; silloin ne vaihdetaan samassa commitissa Truth-säännön mukaan.

HIC 01.10.2026: toimitusvaiheen vastuut jaettu (asiakas: CIO/CISO-hyväksynnät, projektinjohtaja; Lifetime: agenttien, LWM v2:n ja käyttöhenkilöstön koulutus, sensoriliitynnät, DGX-laitteiston toimitus/asennus/käyttöönotto). HIC käytti sanaa "skilled agents -parvi" Boardyn huomautuksen jälkeen; tulkittu HIC:n päätökseksi, "parvi" palautettu tähän kohtaan.

## Boardy 01.10.2026: DGX-rivi kantaa riskin

Kolme väitettä tarkistettu:

1. **Ei NVIDIA-sopimusta.** Pitää. Repossa on vain NVIDIA Inception -jäsenyys (`docs/HIL_Risto.md:79`). Laite-SKU:t myydään jälleenmyyjämarginaalilla Acer/NVIDIA EU-kanavan päältä (`products.json` priceHistory), ja jokaisen SKU:n `exclusions` rajaa jo "extended warranty or on-site support beyond the standard manufacturer term" ulos. FI-teksti sanoo nyt saman ääneen.
2. **Fyysinen asennustyö.** Pitää. `LF-NVIDIA-INSTALL` on jo oma palvelurivi; `exclusions`: "Site preparation (power, network, rack space) not supplied by the buyer". Kirjattu asiakkaan valmisteluksi.
3. **TPM 2.0 / mitattu käynnistysketju.** Väite ei vastaa nykyistä toteutusta: pysäytyksen allekirjoitus nojaa Ed25519-avaimiin, operaattorin avain laitteen ulkopuolella, site-avain tiedostossa `state/site/site.key` (0600, `src/aegis/pilot/doctor.ts:51`). TPM:ää ei käytetä, joten vaiheen 0 portti ei kaadu DGX:n TPM-tukeen. Todellinen aukko on toinen: site-avain on ohjelmistoavain, ei laitteeseen sidottu. DGX Spark / GN100 TPM 2.0 -tuki on edelleen varmistamatta (ei lähdettä repossa). Vaiheen 0 laitekatselmointi kirjaa eheysominaisuudet todettuina tai puuttuvina, ei hyväksymisehtona.

Tekstimuutos: DGX-tuotenimi pois sopimusrivistä ("GB10-luokan solmu"), laitevalinta vaiheen 0 laitekatselmointiin. v1.9.

## Korjaus 01.10.2026: x86-only oli virhe

Tulkitsin kaksi viestiä HIC:n päätöksiksi: "pysy x86:ssa, ARM:lla testattu pino ei päde" (Boardyn linja, ei HIC:n) ja "emme käytä NIM/CUDA:ta, punainen vaate joillekin?" (kysymys, ei kielto). HIC 01.10.2026: "pysymme NIM/CUDA:ssa". Korjattu versiossa v2.0: portti on NVIDIA CUDA -alusta (GB10 tai x86 + NVIDIA). Kaikki versiot arkistoitu `docs/sales/aegis-pilot-versions/`. Oppi: viestin, jossa on kysymysmerkki tai toisen henkilön väite, ei saa kirjata päätökseksi ilman vahvistusta.
