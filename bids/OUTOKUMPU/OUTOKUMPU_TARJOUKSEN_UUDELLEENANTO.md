<!--
VERSION AND AGENT HISTORY
Document: OUTOKUMPU_TARJOUKSEN_UUDELLEENANTO.md
Version: 1.0
Last-Updated: 2026-07-30
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (Opus 5), session claude/enterprise-ai-harness-0anl7s
Purpose: Tarjouksen uudelleenanto muuttumattomin ehdoin, voimassaolo 31.12.2026
         saakka. HIC-päätös 30.7.2026.
         27.6.2026 annettu tarjous oli voimassa 30 päivää eli 27.7.2026 saakka ja
         on siten RAUENNUT. Rauennutta tarjousta ei voi yksipuolisesti "jatkaa" —
         se annetaan uudelleen. Ehdot ovat muuttumattomat; ainoastaan
         voimassaoloaika on uusi.
         EI MUUTA HINTAA EIKÄ LAAJUUTTA. Lähetetyt asiakirjat
         (OUTOKUMPU_TARJOUSKIRJE.md, OUTOKUMPU_HINTALOMAKE.md, 27.6.2026)
         ovat muuttumattomia.
Status: LUONNOS — tarkista §4 kapasiteettivaraus ja §5 todistusten voimassaolo
        ennen lähetystä.
-->

---

Espoo, 30.7.2026

**Ari Hirvonen**
Patent IP Director
Outokumpu Oyj
Salmisaarenranta 11
00180 Helsinki

---

# Tarjouksen uudelleenanto — DWS IQ 6 -pilotti, voimassa 31.12.2026 saakka

**Viite:** Tarjouskirje ja hintalomake 27.6.2026

Hei Ari,

27.6.2026 antamamme pilottitarjous oli voimassa 30 päivää ja **raukesi 27.7.2026**. Koska hankinnan käsittely on kesken, **annamme tarjouksen uudelleen täsmälleen samoin ehdoin**. Uusi voimassaoloaika on **31.12.2026 saakka**.

Emme jatka rauennutta tarjousta vaan annamme sen uudelleen — muotoseikka, mutta se pitää asiakirjaketjun siistinä, jos hankinta tarkastaa sen myöhemmin.

---

## 1. Mikä pysyy muuttumattomana

| Erä | Arvo | Muutos |
| :--- | :--- | :--- |
| Pilottihinta (toimittajan työpanos) | **€24 000 (alv 0 %)** | Ei muutosta |
| Maksuaikataulu | 50 % allekirjoituksella, 50 % loppuraportilla | Ei muutosta |
| Kesto | 3 kk sopimuksen allekirjoituksesta | Ei muutosta |
| Laajuus | Yksi Forta-alatuotelinja | Ei muutosta |
| Vaihe 0 — laajuuden määrittely | Maksuton, 1–2 vk | Ei muutosta |
| NVIDIA-laitteisto | Asiakkaan CAPEX, jää asiakkaalle | Ei muutosta |
| EU-pilvipalvelut | Läpilaskutus omakustannushintaan, ei katetta | Ei muutosta |
| Jatkotyön tuntihinta | €120/h (alv 0 %) | Ei muutosta |

**Hinta on kiinteä koko voimassaoloajan.** Se ei ole sidottu indeksiin eikä sitä tarkisteta, vaikka allekirjoitus tapahtuisi vasta joulukuussa.

---

## 2. Valinnainen lisäosa — paikallisen jatkuvuuden moduuli

Tarjouksen ydinlaajuus on ennallaan: KYA-hallittu julkistusputki, IP-funktion vetooikeuspolku, Art. 12 -auditointiloki ja mittausraportti. **Alla oleva on valinnainen eikä muuta hintaa, laajuutta eikä maksuehtoja.**

> **Kohteille, joissa verkon käytettävyydelle tai eristykselle on tiukat vaatimukset — kuten Tornion valvomotoiminnot — pilottiin voidaan sisällyttää DWS:n viisivaiheinen paikallisen jatkuvuuden protokolla ja verkkokatkovalidointi (KPI 4). Tämä määritellään ja sovitaan maksuttomassa Vaihe 0 -laajuuden määrittelyssä.**

Lyhyesti, mistä siinä on kyse: kun yhteys ulkomaailmaan katkaistaan sovitussa ikkunassa, (i) julkistustyönkulku suoriutuu loppuun, (ii) EU AI Act Art. 12 -tietue kirjoittuu edelleen paikallisesti ilman katkoa, ja (iii) operaattori pystyy pysäyttämään ajossa olevan agentin. Kaikki kolme, tai tulos raportoidaan kielteisenä — mikä on pätevä lopputulos, ei tuotevirhe.

**Kolme huomiota, jotta tämä ei aiheuta turhaa työtä Outokummun päässä:**

1. **Katkoa ei tarvitse tehdä fyysisesti.** Käytännössä käytetään VLAN-eristystä tai reunareitittimen egress-estoa; menetelmä valitaan Vaihe 0:ssa yhdessä verkosta vastaavan tahon kanssa. Tuotantoverkkoa ei kosketa.
2. **Tämä on Operations- ja tietoturva-aihe, ei IP-aihe.** Jos moduuli kiinnostaa, luontevin keskustelukumppani on Tornion tuotanto-/laitosjohto ja CISO — voimme tulla mukaan siihen keskusteluun.
3. **Jos moduuli halutaan mukaan, se on sovittava ennen allekirjoitusta.** Hyväksyntäkriteerin lisääminen kesken toimituksen muuttaisi sitä, mitä "valmis" tarkoittaa.

Toimitamme pyynnöstä myös: viisivaiheisen toteutussuunnitelman hyväksyntäportteineen ja **tuntiraportin** (`OUTOKUMPU_TUNTIRAPORTTI.md`), jossa €24 000 on purettu vaiheittaisiksi tunneiksi.

---

## 3. Miksi pidennetty voimassaolo on perusteltu

CBAM-määräaikojen ja EU AI Act -velvoitteiden aikataulu ei ole muuttunut, mutta Outokummun kokoluokan hankinnassa 30 päivää on lyhyt aika viedä asia IP-funktion, hankinnan, tietoturvan ja talouden läpi. Pidennetty voimassaolo poistaa keinotekoisen aikapaineen päätöksestä, jonka pitäisi perustua sisältöön eikä kalenteriin.

---

## 4. Yksi varaus, joka on rehellistä sanoa etukäteen: kapasiteetti

Pilotti sitoo noin 1,5 henkilötyökuukautta senior-tason työtä kolmen kuukauden aikana. **Voimassaoloaika ei ole kapasiteettivaraus.** Aloitusaika sovitaan allekirjoitusjärjestyksessä.

| Allekirjoitus | Pilotin valmistuminen |
| :--- | :--- |
| 30.9.2026 mennessä | Vuoden 2026 puolella |
| Q4/2026 (1.10.–31.12.) | Q1/2027 |

Jos aloitusajankohta on Outokummulle olennainen, se kannattaa kiinnittää sopimukseen erikseen. Sanomme tämän nyt, koska joulukuussa allekirjoitettu sopimus ja tammikuussa alkava pilotti on hallittu lopputulos vain, jos se on tiedossa etukäteen.

---

## 5. Tilaajavastuuasiakirjat — huomioitava pidennetyssä aikataulussa

Tarjouksen liitteenä toimitetut viranomaistodistukset vanhenevat ennen uutta voimassaolon päättymispäivää. **Toimitamme päivitetyt todistukset veloituksetta allekirjoitushetkellä**:

| Asiakirja | Nykyinen | Vanhenee | Toimenpide |
| :--- | :--- | :--- | :--- |
| Kaupparekisteriote (PRH) | OTE 27.6.2026 | 27.9.2026 | Uusi ote allekirjoitushetkellä |
| Verovelkatodistus | 05/2026 | Yli 3 kk -kynnys ylittyy | Päivitetty ote OmaVerosta |
| YEL-todistus | Avataan sopimuksen yhteydessä | — | Toimitetaan allekirjoituksen yhteydessä |

Tämä on tilaajavastuulain rutiinia, ei poikkeama — mutta se on syytä olla kirjattuna, jotta se ei yllätä hankintaa joulukuussa.

---

## 6. Seuraavat askeleet — muuttumattomat

1. Tarjouksen käsittely Outokummun puolella
2. Vaihtoehto: esittelykokous (Demo + Q&A) — Salmisaarenrannassa tai etäyhteydellä
3. Vaihtoehtoinen reitti: yhteinen NDA → Vaihe 0 laajuuden määrittely käynnistyy välittömästi (maksuton)

**Tarjous on voimassa 31.12.2026 saakka.**

Olen käytettävissä sopiaksemme tapaamisen tai vastatakseni kysymyksiin suoraan.

Yhteistyöterveisin,

**Risto Anton Päärni**
Toimitusjohtaja, Lifetime Oy
risto.paarni@lifetime.fi · +358 400 319 010
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland
Y-tunnus: 0772407-9 | VAT: FI07724079

---

## Asiakirjan hallinta

- **Tämä asiakirja ei muuta lähetettyjä asiakirjoja.** `OUTOKUMPU_TARJOUSKIRJE.md` ja `OUTOKUMPU_HINTALOMAKE.md` (27.6.2026) ovat muuttumattomia; ne kuvaavat rauennutta tarjousta ja säilytetään sellaisenaan.
- Uusi voimassaolo 31.12.2026 korvaa hintalomakkeen §7 määräajan 27.7.2026 **vain tämän uudelleenannon osalta**.
- Liite pyynnöstä: `OUTOKUMPU_TUNTIRAPORTTI.md` v1.0 (tuntierittely).
- Liite pyynnöstä: `sales-outreach/PILOT_SHEET_OUTOKUMPU_FORTA.md` v2.0 (viisivaiheinen suunnitelma, KPI 4).
- HIC-päätös voimassaolosta: 30.7.2026.
