Status: DRAFT
Slug: pki-ownership-is-the-modernization-gap
Title: PKI has no owner — and that is the modernization gap
Language: en
Target: onelifetime.world/posts/pki-ownership-is-the-modernization-gap.html
Date: 2026-06-23 (original); re-date on approval
claims_checked: 2026-09-30
Source: Text recovered verbatim from PR #1495 (branch claude/pki-modernization-ownership-dj05oz, HTML never published); byline umlauts restored. Companion to partners-outreach/DIGICERT_PARTNERSHIP_PITCH.md.
Publish gate: HIC reads and approves (Rule 13). Open question for the HIC — the news hook (DigiCert/Omdia webinar 24.06.2026) is three months old: publish as a field note with the original date, or re-angle.

Security · Field Note

# PKI has no owner — and that is the modernization gap

23 June 2026 · by Risto Anton Päärni

The news, in one line

DigiCert and Omdia put research behind a problem every security team already feels: everyone depends on PKI, but ownership is spread across teams, tools, and processes — and that fragmentation is what drives certificate sprawl, outages, and stalled modernization.

Source: 2026 Global PKI Research Report (DigiCert / Omdia) [1]. Live discussion with Adam Strange (Omdia) and Jeremy Rowley (DigiCert), 24 June 2026.

Good research from a serious team.

DigiCert runs digital trust for a living. Omdia counts the market without flinching. So when the two of them say the quiet part out loud — that PKI is everyone’s dependency and no one’s job — we read it carefully, and we agree.

And because nodding along is not a business, here is the part we would add.

## The risk is not the certificate. It is the owner you cannot name.

A certificate that expires at 2 a.m. does not take down a service because the math failed. It takes it down because no one was watching that certificate, because no one had been told it was theirs.

PKI holds up uptime, identity, AI readiness, and operational resilience. Four things the board cares about, resting on an asset class with no clear owner. That is the gap the report names, and it is the right gap to name.

## Four gaps the report puts numbers on

Read the findings and the same four gaps keep surfacing. Each one is an ownership problem wearing a technical costume.

Gap 1 · Ownership

### Everyone depends, no one is accountable

Responsibility is split across security, infrastructure, app teams, and whoever bought the last appliance. When ownership is shared by everyone, it is held by no one.

Gap 2 · Visibility

### You cannot renew what you cannot see

Certificates live in load balancers, containers, scripts, and a spreadsheet someone left when they changed jobs. A blind inventory is the seed of the next outage. Only about a third of organisations report a complete, current view of their certificates [1].

Gap 3 · Sprawl

### More machines, shorter lifetimes, manual hands

Workloads multiply, certificate lifetimes shrink — public TLS certificates to 47 days from March 2029 [2] — and renewal is still often manual. Sprawl plus manual process is a queue that only grows.

Gap 4 · Readiness

### Post-quantum migration needs a map first

You cannot rotate to post-quantum algorithms across an estate you have never fully inventoried. The crypto-agility everyone wants starts with knowing what you have and who owns it [5].

The honest limit — a tool does not create an owner

Discovery scanners, CA platforms, and automation all help. We use them. But a dashboard that lists 40,000 certificates and cannot say who is accountable for each one has moved the problem, not solved it.

Ownership is not a feature you install. It is a binding between an asset and a named, verified human — enforced, logged, and auditable. That is the piece most PKI programs still leave blank.

## Where DWS fits — the identity spine, not another scanner

DigiCert owns the certificate lifecycle. We are not the CA, and we are not trying to be. We sit above it, on the question the report keeps circling: who is accountable, and can you prove it?

- DigiCert’s layer: issuance, lifecycle, discovery, automation — the trust infrastructure the estate runs on.

- DWS’s layer: the KYA identity spine that binds every action — human or agent — to a verified identity, with the event logs EU AI Act Article 12 asks for [3] behind it. An owner the audit can actually read.

- The data layer: sovereignty tiers underneath, so an EU enterprise can place the trust store where its regulators expect it.

The same logic we apply to autonomous agents applies to certificates. An agent with no verified owner is a liability [4]. So is a certificate. Both need a name attached, an action logged, and a leash someone can pull.

## Why we will not sell “PKI in a box”

The fastest way to fail a PKI modernization in 2026 is to buy a platform and skip the org chart. The tool ships, the sprawl stays, and the next outage still has no owner to call.

DigiCert is not selling the org chart away — they are naming it as the problem. We agree, and we build the part that makes ownership enforceable instead of aspirational.

The short version

- The 2026 Global PKI Research Report names the real risk: fragmented ownership, not weak crypto.

- The four gaps — ownership, visibility, sprawl, post-quantum readiness — are one problem in four costumes.

- A tool lists certificates. It does not create an accountable owner.

- DWS adds the KYA identity spine on top, binding each asset and action to a verified human, on a sovereign data layer.

## Read next

- MCP Apps extends the frontier — KYA is the identity spine

- KYA Standard v1 — the original field note

- Red Hat’s EU sovereign move — and the three tiers beneath it

Risto Anton Päärni

CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal

## Sources

[1] DigiCert & Omdia (2026). PKI Under Pressure: The Tipping Point for Modernization — 2026 Global PKI Research Report. DigiCert. <https://www.digicert.com/news/research-reveals-major-certificate-visibility-blind-spot>

[2] CA/Browser Forum (2026). Baseline Requirements for the Issuance and Management of Publicly-Trusted TLS Server Certificates, §6.3.2 Certificate operational periods. CA/Browser Forum. <https://github.com/cabforum/servercert/blob/main/docs/BR.md>

[3] European Parliament and Council (2024). Regulation (EU) 2024/1689 (Artificial Intelligence Act), Art. 12 Record-keeping and Art. 14 Human oversight. Official Journal of the European Union. <https://eur-lex.europa.eu/eli/reg/2024/1689/oj>

[4] Yuan, A., Zhang, H., Li, J., Li, L., Hu, X., Wei, H., Xiao, X., Xiao, C., & Zhao, Y. (2026). Auditable Agents. arXiv preprint arXiv:2604.05485. <https://arxiv.org/abs/2604.05485>

[5] Monetary Authority of Singapore (2024). Advisory on Addressing the Cybersecurity Risks Associated with Quantum (MAS/TCRS/2024/01). MAS circular. <https://www.mas.gov.sg/regulation/circulars/advisory-on-addressing-the-cybersecurity-risks-associated-with-quantum>
