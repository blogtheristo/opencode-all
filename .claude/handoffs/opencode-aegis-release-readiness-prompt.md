# OpenCode handoff: Aegis release-readiness audit

Status: READY TO RUN in OpenCode. Not executed in this Claude Code session —
scope requires a separate git worktree/branch, isolated from
`claude/sisu-case-sales-route-bon1fh` (PR #1858) and from `main`.

Created: 2026-08-19, HIC request.

## Prompt (verbatim, run in OpenCode)

TARKOITUS
Tarkista DWS IQ Aegis -tuotteen tekninen julkaisukelpoisuus. Toteutus on syntynyt vanhoilla Sonnet-versioilla. TODOjen poistaminen ei ole näyttö valmiudesta. Korjaa ensin nykyinen toteutus oikeaksi, testaa sitten Playwrightilla ja vasta lopuksi HIC-tasolla.

SÄÄNNÖT

- Luo erillinen git worktree ja branch. Älä muokkaa mainia tai muiden töiden worktreeja.
- Älä lisää uusia ominaisuuksia tai laajenna scopea.
- Älä luota aiempaan agenttiraporttiin, TODOjen puuttumiseen tai vihreään buildiin.
- Älä kutsu ominaisuutta valmiiksi, turvalliseksi, compliantiksi, auditoitavaksi tai tuotantokelpoiseksi ilman koodiin ja testitulokseen perustuvaa näyttöä.
- Puuttuva ympäristö, salaisuus, data tai integraatio merkitään BLOCKEDiksi. Älä keksi korvaavaa näyttöä.
- Tee pienet, jäljitettävät commitit.

VAIHE 1: KOODIN OIKEELLISUUS
Kartoita koko Aegis-toteutus ja tarkista:

1. build, lint, typecheck, riippuvuudet ja runtime-konfiguraatio
2. reitit, sivut, komponentit ja server/client boundaryt
3. lomakkeet, validointi, navigaatio, kieliversiot ja error/loading/empty states
4. API-kutsut, auth, käyttöoikeudet, session-käsittely ja fallbackit
5. secretit, data leakage, XSS, CSRF, SSRF, injektiot ja input/output-suojaus
6. state management, retryt, timeoutit, race conditionit ja katkostilanteet
7. demo/orientation → pilot → proposal/order -polku
8. hinnat, tuotenimet ja juridiset/compliance-väitteet suhteessa canonical source of truthiin
9. saavutettavuus, responsiivisuus, suorituskyky, dead code, debug-polut ja rikkinäiset importit.

Jokaisesta löydöstä raportoi ID, tiedosto/rivit, severity BLOCKER/HIGH/MEDIUM/LOW, havainto, vaikutus, täsmällinen korjaus ja testi jolla korjaus todistetaan. Korjaa kaikki BLOCKER- ja HIGH-löydöt. Jos väite ei ole todennettavissa, rajaa se tai merkitse sisältö-/legal-blockeriksi.

Aja puhtaassa worktreessä install lockfilen mukaan, lint, typecheck, unit/integration-testit, production build ja preview/runtime smoke test. Tuota CODE-QUALITY-REPORT.md. Jatka vaiheeseen 2 vain, jos pakolliset tarkistukset ovat vihreitä tai poikkeamat on nimetty avoimiksi blockereiksi. Tämä vaihe ei vielä tarkoita tuotteen julkaisukelpoisuutta.

VAIHE 2: PLAYWRIGHT
Käynnistä tuotantoa vastaava ympäristö ja testaa selaimella, ei pelkkää HTTP:tä:

- kaikki Aegis-kieliversiot ja julkiset entry pointit
- navigaatio, back/forward, demo/orientation-flow
- lomakkeet validilla, puuttuvalla ja virheellisellä datalla
- auth/session-polut, responsive viewportit ja keyboard/accessibility
- loading/error/empty states
- console errors, failed requests ja uncaught exceptions
- kriittisten näkymien screenshotit, linkkien status ja kohteet.
  Älä hyväksy mockia todisteeksi, jos oikea backend kuuluu polkuun. Tuota PLAYWRIGHT-REPORT.md, screenshotit ja trace:t. Korjaa blockerit ja high-riskit ja aja koko sessio uudelleen. Jatka HIC:iin vasta kriittisen polun ollessa vihreä.

VAIHE 3: HIC
Määrittele ensin HIC:n vaatimukset ja mikä on oikeasti toteutettu. Testaa vähintään identiteetti ja valtuudet, capability/permission-rajat, bounded execution ja fail-closed, human approval/kill-switch, evidence/provenance, replay/nonce/version-binding/TOCTOU mikäli toteutettu, timeoutit, katkokset ja degraded mode, scope-rajojen ylityksen esto sekä lokien eheys ja audit trail.

Erota raportissa: toteutettu koodissa, paikallisesti testattu, Playwrightilla testattu, HIC-testillä testattu ja riippumattomasti validoitu. Tuota HIC-REPORT.md. Jos vaatimukset tai testiympäristö puuttuvat, status on PARTIAL tai BLOCKED, ei PASS.

LOPPURAPORTTI
Tuota RELEASE-READINESS.md:

- Code correctness: PASS / PARTIAL / BLOCKED
- Playwright: PASS / PARTIAL / BLOCKED
- HIC: PASS / PARTIAL / BLOCKED
- julkaisuun estävät blockerit, tunnetut riskit ja hyväksymättömät oletukset
- tarvittavat manuaaliset tarkistukset
- tarkka branch/worktree/commit
- toistettavat komennot
- suositus RELEASE / NO RELEASE.

RELEASE on sallittu vain, jos kaikki kolme vaihetta on tehty, evidence on tallessa eikä julkaisuun vaikuttavaa BLOCKER- tai HIGH-riskiä ole avoinna. Muussa tapauksessa NO RELEASE ja seuraavat korjaavat työpaketit tärkeysjärjestyksessä.

## Handoff notes

- Scope: DWS IQ Aegis product implementation only. Does not touch
  `sales-outreach/`, the Sisu case, or PR #1858.
- Run in its own worktree/branch (e.g. `feature/aegis-release-readiness-audit`)
  per Runtime Policy — OpenCode primary, Claude Code stays standby.
- Outputs expected in repo root or a scoped subfolder: `CODE-QUALITY-REPORT.md`,
  `PLAYWRIGHT-REPORT.md`, `HIC-REPORT.md`, `RELEASE-READINESS.md`.
