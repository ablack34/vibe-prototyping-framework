# Customer Brief — Contoso Field Services

> **The customer's own voice.** Filled by Sandra Holtz, COO of Contoso Field Services, in response to the Studio 42 customer-brief template. Sandra wrote the first draft; Priya from the account team transcribed and lightly edited for flow.
>
> *Demo fixture: `/vibe-demo` seeds this into the engagement so the rest of the framework has the customer's voice to ground every later step.*

---

## Who we are

Contoso Field Services. We're a Munich-headquartered HVAC and industrial-cooling service provider; we keep equipment running for the people who can't afford it to break — grocery chains, data centres, hospitals, large manufacturers. 280 technicians, 14 countries, ~12,000 active service contracts, ~180 work orders a day. We're part of Contoso Industrial Holdings, listed on Deutsche Börse.

**Sponsor**: Sandra Holtz, Chief Operating Officer.

## The problem in our words

Our dispatch process is killing us. We have 14 dispatchers in Warsaw reading work orders, cross-referencing technician skills, calculating drive times in Google Maps on a second monitor, phoning technicians, negotiating assignments, and then panic-rerouting when something slips. They get yelled at by customers all day. Turnover among dispatchers is 38% annual. The system they use was built in 2008 and nobody wants to touch it.

The financial impact is brutal: we paid €4.1M in SLA-breach penalties last year, lost €6.3M in contract renewals over the last two years that were directly blamed on repeat SLA misses, and burned another €1.7M in overtime from last-minute reroutes. Total addressable pain is around €12M a year and growing.

We're not asking you to replace dispatch — we tried that in 2019 and the dispatchers refused to use the new tool because it didn't work offline during a power cut. We need an **assistant** that watches over their shoulder, suggests the best technician for a work order in seconds, explains why, and lets the dispatcher accept, override, or ignore the suggestion.

## Who feels it most

A dispatcher in our Warsaw control centre. Mid-career, knows the technician roster by heart, can recite SLAs from memory, hates being micromanaged. Spends 6 minutes per work order today; we want that to be under 60 seconds. They want to feel **assisted, not replaced**.

## What "great" looks like for us

If, six months after go-live, we can say all of these, we'll call it a success:

- Platinum and Gold SLA breaches are down by **>30%**
- Average dispatcher decision time per work order is under **60 seconds**
- Every assignment has a clear audit trail of *why this technician was picked* — F-Gas regulators will ask
- Dispatchers tell us they feel **relieved**, not threatened
- The Carrefour and Lidl renewals (a combined €18M ARR) close cleanly because we can show the data

## What we've already invested in

| Investment | Role today | Keeping? |
|---|---|---|
| 2008-era ASP.NET dispatch system | Source of truth for work orders, contracts, technicians | **Keep — augment with assistive layer** |
| SAP backend (work-order ingestion, billing) | Upstream of dispatch | Keep |
| Microsoft Enterprise Agreement (M365 E5 + Copilot pilot 200 seats) | Office productivity | Keep, expanding |
| Internal Jupyter notebook scoring technician/work-order fit (built by Tomasz Wojcik, 2024) | Sitting on a USB stick in Matthias's drawer | Use it if you want — it's actually decent feature engineering |
| BlueRock Consulting roadmap PDF (2025) | Doorstop | Replace |

## Constraints we want you to know about

- **Offline tolerance is non-negotiable.** Warsaw lost power twice during the 2019 pilot week. The dispatchers will reject anything that goes blank when the WiFi dips.
- **EU AI Act compliance.** The dispatcher assist must be *recommend-only* — no autonomous assignments. We can't be classified as a high-risk system.
- **EU F-Gas Regulation (in force Q3 2026).** Refrigerant work needs traceable assignment to certified technicians. The audit trail is a legal requirement, not a nice-to-have.
- **GDPR.** Technician location and skill data is personal data; processing needs proper DPAs and retention policy.
- **No live production-system connections in the prototype.** Use the three CSV exports we'll provide (anonymised).
- **Timeline pressure.** Carrefour renewal pitch is on 2026-09-15. If we can show a working prototype with SLA-breach reduction evidence by then, Sandra will use it in the pitch.

## Decision-makers + authority

| Name | Role | Can say yes to | Needs to be informed about |
|---|---|---|---|
| **Sandra Holtz** | COO | Engagement scope, feature trade-offs, go/no-go on conversion to multi-year program | Everything material |
| **Anneliese Roth** | CIO | Tech-architecture decisions, AI vendor selection, the FY2026 €1.2M "AI in operations" budget | Major architecture or vendor choices |
| **Matthias Köhler** | Director, Operations Technology | Integration into the existing dispatch system, technician data access | Anything touching the 2008 codebase or technician privacy |
| **Pawel Nowak** | Warsaw control-centre lead | Dispatcher adoption (de facto veto via his team) | Anything that changes the dispatcher workflow |
| **Helga Brandt** | Finance Director | Budget approvals over €100K, the €4.1M penalty line | The ROI story before any conversion paperwork |

## What we'd love to see from the engagement

What we hope: a working prototype we can actually show our dispatchers — not slides, not a 120-page PDF (we've been there). Enough evidence by end of Week 4 that Sandra can take it to the board with confidence.

What we're afraid of: another vendor turning up with grand AI promises, building something dispatchers won't touch, and leaving us with a write-off. We've been burned twice (2019 internal, 2023 BlueRock). The third try matters.

The thing we don't say out loud: the dispatcher team is exhausted. If you can give them back two hours a day and the audit trail they need for F-Gas, you'll have advocates inside Contoso for years. If you don't, Pawel will quietly kill any rollout.

---

> **For Studio 42**: Cite this document in `engagement-brief.md`. Every claim about the customer's worldview that ends up in our internal docs should trace back to a quote from here, a transcript, or a source document. Don't paraphrase Sandra's voice — quote it.
