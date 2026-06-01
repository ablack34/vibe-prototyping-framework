# M365 Researcher Results — Contoso Field Services

> Source: M365 Copilot Researcher. Run: 2026-05-13 by Priya Raman (Studio 42 account team).
>
> **Demo fixture.** All names, dates, emails, and references below are fictional but plausible.
> This file exists so `/vibe-demo` can show the research-synthesis step working without needing an actual M365 Researcher run.

## 1. Account-history timeline

| Date | Touchpoint | Source |
|---|---|---|
| 2024-09-12 | First contact — Priya Raman intro'd to Sandra Holtz via mutual connection at HVAC EMEA 2024 conference | Outlook: thread "Intro — Studio 42 / Contoso" |
| 2024-11-04 | Discovery call with Sandra and Matthias; Studio 42 demoed prior field-services prototype | Teams meeting: "Contoso x S42 — Discovery" (45 min, recording saved) |
| 2025-01-22 | Sandra requested a written proposal for a "dispatcher modernisation discovery" | Outlook: thread "Re: Discovery proposal" |
| 2025-03-14 | Proposal submitted (€80K, 6-week scope); Contoso went silent | OneNote: "Contoso — proposal sent" |
| 2025-06-30 | Sandra reconnected: "BlueRock didn't deliver, can we restart?" | Outlook: thread "Restarting the conversation" |
| 2025-10-08 | New CIO Anneliese Roth invited Studio 42 to pitch as part of her "AI in operations" review | Outlook: thread "AI in operations — vendor short-list" |
| 2026-02-19 | Pitch delivered to Sandra + Anneliese + Matthias; verbal approval for 4-week VIBE | Teams meeting: "Contoso — VIBE pitch" |
| 2026-03-05 | SOW signed; engagement kicks off Q2 2026 | SharePoint: "Contoso — SOW signed.pdf" |

## 2. Previously-attempted projects

- **2019 internal "Dispatcher 2.0" effort** — Matthias led an internal rebuild of the 2008 ASP.NET system in C#/.NET 5. Failed after 18 months for non-technical reasons: dispatchers refused to adopt the new tool because it had no offline mode (Warsaw control centre had two power outages during pilot week). Matthias is sensitive to this; any new tool must work even when the office WiFi drops.
- **2023 BlueRock Consulting engagement** — 9-month "operations modernisation roadmap" delivered as a 120-page PDF in March 2025. No working code, no prototype, no piloting. Sandra openly describes this as "the experience that made me believe in working software over slides."
- **2024 internal data-science skunkworks** — A junior data scientist (Tomasz Wojcik) built a Python Jupyter notebook that scored technician-work-order fit using a random forest. Worked offline on a CSV export. Never deployed because IT refused to provision a server. Tomasz left in 2025-12.

## 3. Internal advocates and detractors

| Person | Stance | Why |
|---|---|---|
| **Sandra Holtz** (COO, sponsor) | Strong advocate | Brought in to modernise operations; her reputation is tied to this working |
| **Anneliese Roth** (CIO) | Advocate | "AI in operations" is her first-90-days commitment to the board |
| **Matthias Köhler** (Dir Ops Tech) | Cautious — managing | Burned by Dispatcher 2.0. Wants offline-tolerant, dispatcher-assistive (not replacement). Tomasz's notebook lives in his memory. |
| **Pawel Nowak** (Warsaw control centre lead, day-to-day dispatcher manager) | Skeptic | Worried about job impact for his 14 dispatchers. Will need handling — invite him to the Disrupt Workshop as a contributor, not a recipient. |
| **Finance director (Helga Brandt)** | Neutral-positive | Cares about the €4.1M penalty line; will sign off if there's a credible plan to reduce it |

## 4. Prior commitments by Studio 42

- **Verbal**: We told Sandra in 2026-02 that the VIBE engagement would deliver a "working prototype, not a roadmap PDF." That language is in the SOW and they will hold us to it.
- **Written (in SOW)**: 4-week timeline, fixed scope (dispatcher-assist concept), €120K fixed fee, conversion option to a 6-month implementation phase at €1.2M if customer signs by 2026-08-31.
- **Outstanding asks from customer**: Sandra asked us informally to include "EU AI Act compliance positioning" in the deliverables. Not in SOW. Worth doing — costs us nothing and de-risks the renewal pitch.

## 5. Sentiment trajectory

Direction over the last 6 months: **strongly positive and accelerating**.

- 2025-10: cautious ("we got burned, prove you're different")
- 2025-12: warming ("good pitch, talking internally")
- 2026-02: enthusiastic ("when can you start?")
- 2026-04: pushing for early kickoff ("can we move the workshop forward by a week?")

Risk: enthusiasm can flip if early demos disappoint. Pawel (control-centre lead) is the most likely vector for "this is going to fail" sentiment if dispatchers don't see themselves in the prototype.

## 6. Pricing / commercial constraints in flight

- **Conversion clause**: VIBE fee credits 100% against the multi-year program if customer signs by 2026-08-31. After that date, no credit. This is the de-facto deadline for "do the demo + secure the verbal commitment."
- **Procurement freeze**: Contoso Industrial Holdings has a Q3 procurement freeze (Jul-Sep) for non-renewal spend. Any conversion paperwork must be signed by 2026-06-30 to clear that window.
- **Budget already allocated**: Anneliese has €1.2M earmarked under her "AI in operations" line item for FY2026. This is *our* budget if we land it. If we don't, it goes to a competing internal data-science hire.

## 7. Things the public web can't see

- The 2019 Dispatcher 2.0 failure is a hidden landmine — never mention "rebuilding the dispatch system" framing; always say "assistive layer on top of the existing system"
- Sandra has a private feud with the Engie Solutions COO (they overlapped at a former employer); "we beat Engie" framing will play well with her but should never be said in front of Anneliese, who values impartial vendor evaluation
- The Carrefour renewal pitch is on 2026-09-15 — if we have a working prototype with SLA-breach reduction evidence by 2026-08-31, Sandra can show it to Carrefour leadership directly
- Tomasz's old random forest notebook is on a USB stick in Matthias's desk drawer. He'll share it if we ask. It's actually decent feature engineering and might short-circuit our data analysis.

---

> **Demo fixture** — pasted in by `/vibe-demo` so the synthesis step has something to chew on.
> A real `/vibe-research` Path B run will replace this file with output from the M365 Copilot Researcher agent.
