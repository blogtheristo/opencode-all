# Kypsyysnäyte — Puhujan storyboard (suomenkielinen esitysversio)

## Firehorse-tuotevalmistuksen toimintamalli — 20 minuutin esityksen puhe

***

# VERSION AND AGENT HISTORY

| Versio | Päivämäärä | Tekijä | Muutos |
|---|---|---|---|
| 1.0 | 2026-05-31 | Risto Anton Päärni + Claude Code | Suomenkielinen puhe-storyboard ("selventävä teksti") 20 kalvon kypsyysnäyte-esitykseen `V3Thesis_FI_Kypsyysnaytteen_Esitys`. Englanninkielinen työversio: `V3Thesis_Kypsyysnayte_Storyboard_EN.md`. Kaikki luvut vastaavat kalvoja; uusia väitteitä ei ole lisätty. |

**Lähdekalvot:** `docs/metropolia/master-thesis/fi/V3Thesis_FI_Kypsyysnaytteen_Esitys.{md,html}`
**Tarkoitus:** Kalvokohtainen puhe ("selventävä teksti"). Esitys pidetään suomeksi — tämä on ääneen luettava versio; englanninkielinen storyboard on työversio.
**Tahti:** 20 kalvoa · ~20 min · ~1 min/kalvo. Aikaleimat ovat kumulatiivisia tavoitteita.

***

## Storyboardin käyttöohje

- Jokaisessa kohdassa on **[Kalvolla]** (mitä lautakunta näkee) ja **[Sano]** (puhuttava teksti).
- Älä lue taulukoita ääneen — osoita niitä ja kerro *merkitys*. **[Sano]**-teksti mainitsee luvun kerran ja selittää, mitä se todistaa.
- Pidä noin minuutti per kalvo. Jos aika venyy, tiivistä kalvoja 9, 11 ja 15.

---

## Kalvo 1 — Otsikko *(0:00–0:30)*

**[Kalvolla]** Firehorse-tuotevalmistuksen toimintamalli — hybridi AI-edge-arkkitehtuuri; tekijä, Metropolia, Espoo 28.5.2026.

**[Sano]** "Hyvää päivää ja kiitos, että olette täällä. Olen Risto Anton Päärni, ja tämä on opinnäytetyöni kypsyysnäyte: *Firehorse-tuotevalmistuksen toimintamalli — hybridi AI-edge-arkkitehtuuri ilmastoälykkäille teollisille alustoille*. Seuraavan kahdenkymmenen minuutin aikana käyn läpi tutkimusongelman, sen ratkaisuksi rakennetun arkkitehtuurin sekä tulokset elävästä, maksavasta järjestelmästä — ei prototyypistä. Aloitan siitä, mitä esitys sisältää."

---

## Kalvo 2 — Esityksen rakenne *(0:30–1:00)*

**[Kalvolla]** 18-kohtainen sisällys.

**[Sano]** "Esitys etenee kolmessa osassa. Ensin *miksi* — tausta, tutkimusongelma ja teoreettinen viitekehys. Toiseksi *mitä* — Solution Factory -malli, DWS6:n Aivot–Muisti–Keho–Kädet-arkkitehtuuri, Lifetime Scope Signals -protokolla ja AI-avusteinen kehitysmalli, mukaan lukien verkkokauppa- ja sääntelykerros. Kolmanneksi *todisteet* — toiminnallinen tehokkuus, vaatimustenmukaisuus ja kustannustulokset, vastaukset tutkimuskysymyksiin, SWOT, kontribuutiot ja tuleva työ. Pidän suunnilleen minuutin per kalvo ja jätän aikaa kysymyksille."

---

## Kalvo 3 — §1 Tutkimuksen tausta *(1:00–2:00)*

**[Kalvolla]** Kaksoissiirtymä; perinteisen SaaSin ongelmat; henkilökohtainen ajuri.

**[Sano]** "Eurooppalaiset teollisuuden pk-yritykset ovat *kaksoissiirtymässä*: digitaalisessa — tekoäly, automaatio, reaaliaikainen päätöksenteko — ja vihreässä, jota ajaa EU:n Fit for 55, sen 55 prosentin päästövähennys vuoteen 2030 ja sisältyvän hiilen raportointi vuonna 2028. Ongelma on, etteivät perinteiset SaaS-alustat palvele näitä yrityksiä: ne maksavat yli 1 400 euroa kuussa, ovat pelkkää pilveä korkealla latenssilla ja korkeilla käyttökustannuksilla, eikä niissä ole toimialakohtaista compliance-työnkulkua. Taustalla oli myös henkilökohtainen ajuri. Kun Microsoft for Startups -ohjelmani päättyi helmikuussa 2025, tarvitsin radikaalisti edullisemman tavan *rakentaa ja ajaa* ohjelmistoa. Cloudflaren, Cursor AI:n ja Claude Coden yhdistelmä mahdollisti uuden toimintamallin elokuusta 2025 alkaen. Tämä malli on opinnäytetyöni aihe."

---

## Kalvo 4 — §2 Tutkimusongelma *(2:00–3:00)*

**[Kalvolla]** Päätutkimuskysymys + viisi alakysymystä.

**[Sano]** "Tästä seuraa päätutkimuskysymys: *miten AI-avusteisesti kehitetty teollinen AI-alusta voi saavuttaa tuote–markkinasopivuuden hybridissä pilvi–edge-toimintamallissa säilyttäen alle 400 euron kuukausikustannukset?* Jaan sen viiteen alakysymykseen. Yksi — *tuote ja liiketoiminta*: miten luodaan kansainvälisesti skaalautuva asiakaslupaus? Kaksi — *teknologia*: miten rakennetaan palvelu, joka toimii pilvessä, reunalla ja verkkokaupassa? Kolme — *tekninen arviointi*: mikä arkkitehtuuri tukee parhaiten liiketoimintatavoitteita? Neljä — *yritysturvallisuus*: miten täytetään NIS2, EU AI Act, GDPR ja Cybersecurity Act? Ja viisi, lisätty versiossa kolme — *verkkokauppavalidointi*: voiko automatisoitu kauppa toimia tuote–markkinasopivuuden validaattorina? Jokainen myöhempi kalvo vastaa yhteen näistä todistein."

---

## Kalvo 5 — §3 Teoreettinen viitekehys *(3:00–4:00)*

**[Kalvolla]** Viisirivinen teoriataulukko.

**[Sano]** "Työ nojaa viiteen teoreettiseen pilariin. *Lean Startup* antaa Build–Measure–Learn-syklin, jonka toteutan vaiheittaisena käyttöönottona — Hiljainen, sitten Neuvonantaja, sitten Autonominen. *Alustatalous* kehystää Firehorsen monitahoiseksi alustaksi: asiakkaat, agenttitoimittajat ja datatuottajat. *Teollisuus 5.0* tuo arvot — ihmiskeskeisyyden, kestävyyden ja resilienssin. *Reunalaskennan taloustiede* selittää alle sadan millisekunnin latenssin ja 82 prosentin kustannusedun pelkkään pilveen verrattuna. Ja *moniagenttijärjestelmien* teoria on se, mihin oma kontribuutioni sijoittuu — Lifetime Scope Signals -koordinointiprotokolla. Näiden viiden käsitteellinen synteesi on Firehorse Solution Factory, joka on seuraavalla kalvolla."

---

## Kalvo 6 — §4 Firehorse Solution Factory *(4:00–5:00)*

**[Kalvolla]** Kolmikerroksinen kaavio: Strateginen / Operatiivinen / Suoritus.

**[Sano]** "Solution Factory on kolmikerroksinen malli. *Strateginen kerros* on liiketoimintamalli: Lifetime World Model ristivertikaalitietona, kahdeksan uudelleenkäytettävää vertikaalimallia, AI-avusteinen kehitys 15 viikon syklissä ja EU-vaatimustenmukaisuusvalli. *Operatiivinen kerros* on se, miten agentteja todella ajetaan: YAML-pohjaiset agenttikonfiguraatiot, MCP Hub moniagenttiorkestrointiin ja vaiheittainen käyttöönotto. *Suorituskerros* on ajoympäristö — Aivot–Muisti–Keho–Kädet-arkkitehtuuri toteutettuna pilven ja reunan hybridinä. Ydinajatus on *toistettavuus*: tämä on tehdas teollisten AI-ratkaisujen rakentamiseen, ei yksittäinen tuote. Seuraava kalvo avaa suorituskerroksen."

---

## Kalvo 7 — §5 DWS6-arkkitehtuuri: Aivot–Muisti–Keho–Kädet *(5:00–6:00)*

**[Kalvolla]** Nelirivinen komponenttitaulukko + kaksitasoinen HTAP.

**[Sano]** "DWS6 jakautuu neljään kerrokseen. *Aivot* on DWS IQ 6 -alusta — Groq, Claude ja Gemini yhden MCP Hubin takana. *Muisti* on Lifetime World Model ja EMPO²-agenttimuisti, tallennettuna PostgreSQL-HTAP-kantaan Aivenissa TimescaleDB:n kanssa. *Keho* on kahdeksan toimialasovellusta ja 13-agenttinen Climate IQ Pantheon. Ja *Kädet* ovat fyysiset toimilaitteet — NVIDIA Jetson ja Acer GN100 -reunasolmu sekä IoT — jotka tuottavat päättelyn alle sadassa millisekunnissa, noin 25 kertaa nopeammin kuin pilvikierros. Arkkitehtonisesti tärkein kohta on *kaksitasoinen HTAP*: hallittu Aiven-taso ja GN100-reunataso painavat V1:n käyttökustannuksen 280 euroon kuussa, alle 350 euron tavoitteen."

---

## Kalvo 8 — §6 Lifetime Scope Signals -protokolla *(6:00–7:00)*

**[Kalvolla]** Signaalisanasto + neljä työnkulkumallia.

**[Sano]** "Tämä on työn keskeisin *teoreettinen* kontribuutio. Monen agentin luotettava koordinointi on vaikeaa. Lifetime Scope Signals on deklaratiivinen koordinointiprotokolla: agentit julkaisevat deterministisiä riippuvuussignaaleja — READY, COMPLETE, ERROR, BLOCKED — jolloin käynnistysjärjestys optimoituu itsestään sen sijaan, että se kytkettäisiin käsin. Sen päällä MCP Hub ajaa neljää työnkulkumallia: Fan-Out rinnakkaiseen työhön, Sequential järjestettyihin ketjuihin, Reflection itsekorjaaviin silmukoihin ja Pipeline vaiheistettuun käsittelyyn. Tämä on tärkeää eleganssia syvemmin — hallinnan vuoksi: deterministiset, lokitetut signaalit tuottavat *toistettavan ja auditoitavan* agenttiorkestraation, juuri sitä, mitä EU AI Actin artikla 12:n lokitus edellyttää."

---

## Kalvo 9 — §7 AI-avusteinen kehitysmalli *(7:00–8:00)*

**[Kalvolla]** Työkalut + Human-in-Command + mittakaavaluvut.

**[Sano]** "Miten tämän kokoluokan alusta rakennettiin käytännössä yhden kehittäjän voimin? 15 viikon MVP-sykli Cursor Prolla, Claude Code Maxilla ja GitHub Copilotilla — tiukan *Human-in-Command* -periaatteen alla: jokainen muutos on ihmisen hyväksymä, mikä on sekä EU AI Actin vaatimus että turvallisuusperiaate, ja repositorio on yksityinen varovaisuussyistä. Olennaista on, että tekoälyä *ohjaa* 15 kirjoitettua DWS-standardia — Document, Brand, Security ja niin edelleen — `CLAUDE.md` pysyvänä projektimuistina sekä uudelleenkäytettävät skillit ja koukut työnkulkukomponentteina. Mittakaava, 28. toukokuuta: noin 4 604 commitia, noin 1 400 pull requestia, 3 576 markdown-tiedostoa, lähes 2 000 TypeScript-tiedostoa ja 113 tuotteen katalogi. Tämä on menetelmän empiirinen mittari."

---

## Kalvo 10 — §8 DWS10.com-verkkokauppa *(8:00–9:00)*

**[Kalvolla]** Tekninen toteutus + katalogi + kehityskanava.

**[Sano]** "Verkkokauppa DWS10.com on se, missä liiketoimintamalli muuttuu ajavaksi koodiksi. Teknisesti se pyörii Cloudflare Pagesilla ja Workersilla — nolla euroa kuussa, 99,95 prosentin käytettävyys — yhdellä totuuden lähteellä, `products.json`-konfiguraatiolla, hierarkkisella kategoria-arkkitehtuurilla konversiota ja hakukonenäkyvyyttä varten, sekä dual-folder-peilauksella, joka pitää julkaistun kopion synkronissa samassa commitissa. Katalogissa on 113 tuotetta tuotuna, 112 ostettavissa, alusta-, ohjelmisto- ja palvelukategorioissa, AI-generoiduin ja A/B-testatuin kuvauksin. Ja kehityskanava itse on ihminen-silmukassa-oppimisputki: viikoittainen rutiini ja 15 minuutin PR-katselmointi."

---

## Kalvo 11 — §9 Google Merchant Center + Revolut *(9:00–10:00)*

**[Kalvolla]** Merchant Center -luvut; Agentic Commerce; Revolut.

**[Sano]** "Kaksi integraatiota tekee kaupasta oikeaa kauppaa. Google Merchant Center, tili 8496329, kaikki 30 tuotetta hyväksytty — sata prosenttia — alle 24 tunnin syötteen käsittelyllä; noin 33 kilotavun XML-syöte ladataan automaattisesti SFTP:llä. Kun Googlen Agentic Commerce -protokollat kypsyivät keväällä 2026, tästä tuli dynaaminen yhteys kohti Google Merchant Nextiä. Maksut hoituvat Revolut Businessilla: kassa konvertoituu suoraan maksuun, kyseessä on EU-pankki, joka on kustannustehokas pienelle toimijalle, ja valuutta- sekä monikielikäsittely ovat sisäänrakennettuja. Pointti lautakunnalle: tämä on täydellinen, EU:ssa sijaitseva kaupallinen kierto — ei demo-kassa."

---

## Kalvo 12 — §10 EU-sääntelyvalli *(10:00–11:00)*

**[Kalvolla]** 16 toimialan Fit-for-55-analyysi; viisi seurattua säädöstä; Omnibus.

**[Sano]** "Sääntely ei ole täällä taakka — se on valli. Analysoin 16 EU-toimialaa Fit for 55:ä vasten, kahdessa tasossa: kahdeksan suoran ETS:n ja CBAM:n piirissä — sähkö, teräs, sementti, kemia, lento, meri, maantie ja rakentaminen — ja kahdeksan epäsuoran ETS:n ja taakanjakoasetuksen piirissä. Alusta seuraa aktiivisesti viittä säädöstä: EU AI Act, GDPR, NIS2, CSRD ja EU Data Act. Helmikuun 2025 Omnibus-paketti itse asiassa *auttoi* meitä: se kavensi CSRD:n laajuuden 50 000 yrityksestä 10 000:een ja teki pk-yritysten raportoinnista vapaaehtoista, mutta jätti ilmastotavoitteet ennalleen — mikä tekee 0–350 euron hinnasta erityisen kilpailukykyisen nyt vapaaehtoisilla markkinoilla. Sääntely-TAM on noin 2,68 miljardia euroa Pohjoismaissa ja 15–20 miljardia EU:ssa kymmenessä vuodessa."

---

## Kalvo 13 — §11 Tulokset: toiminnallinen tehokkuus *(11:00–12:15)*

**[Kalvolla]** Ennen/jälkeen-taulukko; harness-vertailuarvo.

**[Sano]** "Nyt todisteet. Toiminnallisessa tehokkuudessa hyödyt ovat suuria ja mitattuja: tuotepäivitykset kahdesta tunnista viiteen minuuttiin — 96 prosenttia; dokumentaatio viikosta tuntiin — 99 prosenttia; virheprosentti viidestä alle yhteen; PR-katselmointi tunneista 15 minuuttiin; ja agenttilaivue nollasta kolmeentoista. Mutta rivi, jota pyydän painottamaan, on viimeinen. Kiinteällä harness-vertailuarvolla *sama malli* nousi 52,8 prosentista 66,5 prosenttiin — 26 prosentin parannus — puhtaasti järjestelmätason suunnittelusta: prompt-scaffolding, reititys, orkestrointi. Tämä löydös on arkkitehtuuriargumentin ydin: hyöty tuli harnessista, ei mallin vaihtamisesta."

---

## Kalvo 14 — §12 Tulokset: vaatimustenmukaisuus *(12:15–13:15)*

**[Kalvolla]** Valmiusastetaulukko v3.15 → v3.26.

**[Sano]** "Vaatimustenmukaisuutta seurataan mitattuna valmiusasteena, versio versiolta. Versiosta 3.15 versioon 3.26: EU AI Act nousi 92 prosenttiin, todisteena artikla 12:n lokitus, Pantheon-agentit ja SOUL.md-malli; GDPR 97:ään Protonin, Supabasen rivitason tietoturvan ja EU-north-isännöinnin varassa; Fit for 55 93:een 20-toimialaisen hiililaskurin avulla; NIS2 85:een RC2–RC4-koventamisella ja Snyk-skannauksella; CSRD 88:aan raportointipohjilla ja viennillä; ja EU Data Act tulee mukaan 80 prosentilla DWS-tietostandardin ja HTAP-arkkitehtuurin tukemana. Cybersecurity Actiin vastataan ISO 27001 -sertifiointitavoitteella Q3 2026. Viesti: vaatimustenmukaisuus on täällä seurattu tekninen mittari, ei markkinointiväite."

---

## Kalvo 15 — §13 Tulokset: kustannusmallin validointi *(13:15–14:15)*

**[Kalvolla]** Kustannusvaihetaulukko; kustannusedut; asiakasvalidointi.

**[Sano]** "Kustannushypoteesi piti. MVP toteutui nollassa eurossa kuussa tavoitteen mukaisesti; Alpha 75 eurossa; ja V1 280 eurossa 350 euron tavoitetta vasten — edellä suunnitelmaa. Taustalla olevat rakenteelliset edut ovat 82 prosentin säästö pelkkään pilveen verrattuna, 1,95 kuukauden takaisinmaksuaika laitteistolle ja kaksitasoinen HTAP, joka siirtää työkuormia reunalle. Eikä tämä ole teoriaa: maksavat pilottiasiakkaat — Uber, Bolt ja Kela — validoivat noin 10 000 euron kuukausittaisen toistuvan liikevaihdon pilotin aikana. Tutkimuskysymyksen keskeinen kustannusväite siis täyttyy oikealla rahalla oikealla laskulla."

---

## Kalvo 16 — §14 Tutkimuskysymyksiin vastaaminen *(14:15–15:15)*

**[Kalvolla]** TK1–TK5-vastaustaulukko.

**[Sano]** "Palataan viiteen kysymykseen. Kysymys yksi, tuote ja liiketoiminta: vastattu — 10 000 euroa toistuvaa, kahdeksan vertikaalia, takaisinmaksu alle kaksi kuukautta. Kaksi, teknologia: pilvi Groqilla, reuna Jetsonilla ja GN100:lla sekä DWS10-kauppa toimivat yhdessä. Kolme, tekninen arviointi: harness-optimoitu arkkitehtuuri tuottaa suuremman nopeuden ja vähemmän virheitä 25–280 euron kuukausihinnalla. Neljä, turvallisuus: viisi säädöstä 80–97 prosentin valmiusasteella. Viisi, verkkokauppavalidointi: sadan prosentin hyväksyntäaste Merchant Centerissä ja 18 prosenttia korkeampi klikkausprosentti AI:n kirjoittamille kuvauksille manuaalisiin verrattuna. Keskeinen havainto kaikkien viiden osalta: hypoteesit validoituivat *elävällä järjestelmällä*, ei prototyypillä."

---

## Kalvo 17 — §15 SWOT-analyysi v3.26 *(15:15–16:15)*

**[Kalvolla]** Nelikenttä-SWOT.

**[Sano]** "Rehellinen SWOT. *Vahvuudet*: elävä järjestelmä 10 000 euron toistuvalla liikevaihdolla, 13-agenttinen Pantheon, kustannusjohtajuus, sisäänrakennettu EU-vaatimustenmukaisuus, validoitu harness-hyöty sekä kumppanuudet NVIDIAn, Siemensin, ABB:n, xAI:n, Mistralin ja Red Hatin kanssa. *Heikkoudet*, suoraan sanottuna: riippuvuus yhdestä kehittäjästä — nyt lievennetty automaatioagenteilla — rajallinen ulkoinen validointi ja riippuvuus reunalaitteistosta. *Mahdollisuudet*: 15–20 miljardin euron Fit-for-55-markkina, noin 644 miljardin dollarin generatiivisen tekoälyn markkina ja toimialan siirtymä kohti inferenssiä. *Uhat*: isojen teknologiayritysten markkinatulo ja EU AI Actin aikataulu elokuussa 2026. Pidän heikkouksien yhtä rehellistä nimeämistä kuin vahvuuksien osana kontribuutiota."

---

## Kalvo 18 — §16 Keskeiset kontribuutiot *(16:15–17:15)*

**[Kalvolla]** Käytännön (1–5) ja teorian (6–8) kontribuutiot.

**[Sano]** "Kontribuutiot jakautuvat kahteen ryhmään. *Käytäntöön*: Firehorse-toimintamalli itse; uudelleenkäytettävät Google Merchant- ja Revolut-integraatiomallit EU-pk-yrityksille; nelivaiheinen äänichatin kehityssuunnitelma hiililaskurin integraatiolla; 16 toimialan EU-vaatimustenmukaisuuskartoitus; ja tuotesuositusmoottorin arkkitehtuuri EU-toimialoille. *Teoriaan*: Lifetime Scope Signals uutena kontribuutiona moniagenttijärjestelmien teoriaan; Solution Factory -malli, joka yhdistää Lean Startupin, alustatalouden, Teollisuus 5.0:n ja reunalaskennan yhdeksi viitekehykseksi; ja Learn Thinking, joka laajentaa Build–Measure–Learn-syklin tekoälyn aikakaudelle. Nämä kolme teoreettista tekevät tästä opinnäytetyön eikä pelkkää rakennuslokia."

---

## Kalvo 19 — §17 Toistettavuus ja tuleva työ *(17:15–18:15)*

**[Kalvolla]** Kolmivaiheinen toistettavuus; 2026-tiekartta; pitkä horisontti.

**[Sano]** "Onko malli toistettava? Suunnitelma on selkeä kolmessa vaiheessa: 15 viikon MVP, kuuden kuukauden validointi kohti 5 000–15 000 euron toistuvaa liikevaihtoa ja 12 kuukauden skaalaus kohti 50 000:ta plus, kahta–kolmea vertikaalia ja Series A:ta. Vuoden 2026 tiekartta on konkreettinen: äänichat Q1:llä, toimialan hiililaskuri Scope 1–3 Q2:lla, sääntelytietoisuusmoottori Q3:lla ja kumppaniekosysteemi Q4:llä. Pidemmällä horisontilla: laajennus Ruotsiin, Norjaan, Tanskaan ja Saksaan 2027; DWS7:n agenttiarkkitehtuurin modernisointi; ja väitöskirja, Firehorse LUT:ssa, joka kantaa tieteellisen kehystyksen ja markkinasignaalitutkimuksen, jotka tarkoituksella jäävät *tämän* tuotekeskeisen maisterityön ulkopuolelle."

---

## Kalvo 20 — §18 Yhteenveto *(18:15–20:00)*

**[Kalvolla]** Kuusi tulosotsikkoa; loppusitaatti; kiitokset.

**[Sano]** "Lopuksi. Firehorse-toimintamalli on validoitu elävällä järjestelmällä: 96 prosentin toiminnallisen tehokkuuden parannus; 82 prosentin kustannussäästö pilviarkkitehtuuriin verrattuna; viisi EU-säädöstä 80–97 prosentin valmiusasteella; 10 000 euroa toistuvaa liikevaihtoa maksavilta pilottiasiakkailta; 26 prosentin harness-hyöty ilman mallin vaihtamista; ja toistettava malli muille teollisuusstartupeille. Opinnäytetyö yhdessä lauseessa: *tekoälyavusteinen verkkokaupan ja agenttien hallinta voi vähentää toiminnallista ylikuormitusta yli 90 prosenttia, varmistaa EU-vaatimustenmukaisuuden ja mahdollistaa nopean iteroinnin — yhden kehittäjän vetämänä.* Kiitos. Vastaan mielelläni kysymyksiinne."

*(Pysähdy. Pidä tauko ja anna lautakunnan aloittaa.)*

---

## Liite — lukujen alkuperä

Jokainen edellä puhuttu luku on otettu suoraan lähdekalvoista `V3Thesis_FI_Kypsyysnaytteen_Esitys.{md,html}` (PR #1415), jotka puolestaan viittaavat v3.26-aikakauden V3-opinnäytetyöhön ja elävän järjestelmän validointiin. Tähän storyboardiin ei ole lisätty yhtään lukua kalvojen näyttämän ulkopuolelta. Mikäli kalvot ja laajempi repositorio käyttävät eriaikaisia mittareita (esimerkiksi 10 k€ pilotin MRR tässä vs. myöhemmät käyttöluvut muualla), tämä storyboard noudattaa **kalvoja**, jotta puhe ja heijastettava kuva ovat aina yhtenevät.
