# DWS-NOTE-2026-03-19 — Qantic BESS Integration Discovery

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: GitHub Copilot | Session: 2026-03-19 | Date: 19.03.2026 | Changes: Initial creation

Session Links & References:
  - GitHub Copilot (2026-03-19): notes/2026-03-19-qantic-bess-integration.md

Document Status:
  - Created: 19.03.2026
  - Last Modified: 19.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

|Field  |Value                                              |
|-------|---------------------------------------------------|
|Date   |2026-03-19                                         |
|Author |Risto Päärni                                       |
|Status |Active — Meeting booked                            |
|Contact|Thomas Kalitzky, Managing Director, Qantic GmbH    |
|Meeting|https://calendly.com/qantic-t-kalitzky/30min       |
|Tags   |energy, BESS, ETS, CSRD, CBAM, partner, integration|

-----

## Summary

Identified Qantic GmbH (Berlin) as a strategic data integration partner for the DWS IQ 6 energy vertical. Qantic's Q-System is a SaaS platform for BESS revenue modelling — it produces exactly the operational data (dispatch schedules, cycle counts, SoC history, throughput per market) that DWS IQ 6 ETS/CSRD/CBAM agents need as input.

Contact initiated via LinkedIn following analysis of Qantic's white paper: *"Success Factors in Revenue Modelling for Large-Scale Energy Storage"* (June 2025). Thomas responded positively and booked a 30-minute discovery call.

-----

## Source Material

White paper: `BESS_Modelling.pdf` (Qantic GmbH, June 2025)

Key findings from the white paper relevant to DWS IQ 6:

- Degradation-blind model inflates revenues by **+41%** vs degradation-aware model (Model B 141% vs Model A 100%)
- Perfect foresight intraday model inflates revenues by **+25%** vs limited foresight (backtested <5% deviation from real portfolio)
- Market liquidity ceiling for aFRR: unlimited liquidity assumption inflates revenues by **+57%** for 100 MW system
- Grid curtailment impact: standalone BESS loses **-15.9%** revenue under realistic curtailment; hybrid PV+BESS loses **-13.0%**
- Hybrid PV-battery co-location partially mitigates grid restriction losses

-----

## Integration Hypothesis

Q-System optimises BESS dispatch for revenue. DWS IQ 6 translates the same dispatch into compliance currency (ETS allowances, CSRD lifecycle emissions, CBAM carbon intensity). The models are complementary — same data, two use cases.

### Data Field Mapping

|Q-System Field                         |DWS IQ 6 Agent                               |Regulation    |
|---------------------------------------|---------------------------------------------|--------------|
|`dispatch_schedule[]` (MW, 15-min)     |ETS Agent — allowance obligation per interval|ETS Phase IV  |
|`cycle_count_daily` (int, DoD%)        |CSRD Agent — asset lifecycle degradation cost|CSRD ESRS E1-6|
|`capacity_fade_pct` (float, cumulative)|CSRD Agent — remaining useful life           |CSRD ESRS E1  |
|`mwh_throughput_market` (MWh/market)   |CBAM Agent — carbon intensity per MWh        |CBAM Art. 7   |
|`roundtrip_efficiency` (float)         |CSRD Agent — Scope 2 conversion loss         |GHG Protocol  |
|`soc_history[]` (%, 15-min series)     |CSRD Agent — Scope 1 operational boundary    |CSRD ESRS E1-4|
|`grid_curtailment_hrs` (hours/year)    |NIS2 Agent — redispatch event classification |NIS2 Art. 21  |

-----

## Integration Options Proposed

**Option A — API Bridge (fastest)**

- Q-System exports JSON dispatch + telemetry on project completion
- DWS IQ 6 MCP agent ingests via tool call
- No Q-System internals changed
- Estimated PoC: 4–6 weeks

**Option B — Co-Branded Compliance Module**

- Qantic bundles "Compliance Intelligence" section in Q-System project reports
- Single deliverable: revenue projection + regulatory obligation forecast
- White-label or co-brand
- Joint GTM to Nordic BESS developers

**Option C — Referral Only**

- No technical integration
- Mutual warm introductions for relevant customer overlap

-----

## Regulatory Context

BESS operators in EU face:

- **ETS Phase IV**: If co-located with generation assets, each dispatch interval creates allowance obligation
- **CSRD ESRS E1**: Lifecycle carbon intensity of BESS assets must be disclosed; degradation model directly affects reported figures
- **CBAM Art. 7**: Carbon intensity per MWh required for cross-border energy flows
- **EPBD May 2026 transposition**: Building-integrated storage systems (behind-the-meter) fall under energy performance passport requirements — direct DWS IQ 6 construction vertical overlap

-----

## Market Timing

- EPBD transposition deadline: **May 2026** (Finland already ahead)
- ETS Phase IV allocation rules finalized Q4 2025
- Nordic BESS deployment growing: NCC, T2H construction pilots are potential joint customers
- Qantic operates in German market (2024 data baseline) — DWS IQ 6 operates in Finnish/Nordic market — geographic complementarity

-----

## Meeting Prep Checklist

- [ ] Book Calendly slot: https://calendly.com/qantic-t-kalitzky/30min
- [ ] Send technical brief HTML before meeting: `qantic-meeting-brief.html`
- [ ] Prepare Q-System API docs request (do they have a public API spec?)
- [ ] Identify one joint pilot customer candidate from NCC or T2H pipeline
- [ ] Confirm: does Q-System output JSON? What granularity? REST or export?

-----

## Files

|File                                   |Location                               |Description                                |
|---------------------------------------|---------------------------------------|-------------------------------------------|
|`BESS_Modelling.pdf`                   |`F:\Proton\My files\2026\DWSIQ6\`      |Qantic white paper — source material       |
|`qantic-meeting-brief.html`            |`F:\2026\Repos2026\dws6\docs\partners\`|Technical brief for Thomas Kalitzky meeting|
|`2026-03-19-qantic-bess-integration.md`|`F:\2026\Repos2026\dws6\notes\`        |This file                                  |

-----

## LinkedIn Thread

**Risto → Thomas (outreach):**

> "Your BESS revenue modelling white paper is one of the sharpest technical treatments I've seen on this — the degradation-aware vs. no-degradation delta (100% vs 141%) and the aFRR liquidity ceiling case make the modelling gaps immediately legible to both engineers and investors. I'm Risto Päärni, Founder & CEO of Lifetime Oy (Espoo). We build DWS IQ 6 — an MCP+A2A-native multi-agent AI compliance platform covering CBAM, ETS, and CSRD for EU industrial companies. The intersection with your work is precise: your dispatch schedules (FCR, aFRR, intraday, day-ahead) are exactly the input layer our ETS agent needs to compute allowance obligations per MWh throughput. Your cycle count + capacity fade model maps directly to the lifecycle carbon intensity figures required under CSRD for BESS assets. In short — your revenue model produces the operational data our compliance agents need to consume. Feels like a natural conversation. Would you be open to a 20-minute call? I'm also at Ecosummit Berlin on March 25–26 if you're around."

**Thomas → Risto (response):**

> "Hello Risto, thank you for the positive feedback. You are describing an interesting use case. I am looking forward to learn more about your ideas. Would you please book a meeting here: https://calendly.com/qantic-t-kalitzky/30min"

**Risto → Thomas (reply):**

> "Hi Thomas, Thank you — will book via your Calendly now. To make the 30 minutes count: I'll prepare a short technical brief on how DWS IQ 6 consumes BESS operational data (dispatch schedules, cycle counts, SoC history) as input to our ETS and CSRD compliance agents. That way we can go straight to the architecture discussion and assess whether there's a real integration path between Q-System outputs and our agent layer. Looking forward to it."

-----

*© 2026 Lifetime Oy — Confidential*
