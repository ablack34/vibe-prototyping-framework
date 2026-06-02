# Research Summary — Contoso Field Services

> Synthesis of public-web research (`customer-public.md`) and M365 Researcher results (`m365-researcher-results.md`).
> Every fact is tagged with its source: `[public]`, `[m365]`, or `[public+m365]`.
>
> *Demo fixture: would normally be produced by `/vibe-research` Step 5 when both inputs are available.*

## 1. Who Contoso is

Contoso Field Services GmbH is a Munich-headquartered HVAC and industrial-cooling service provider operating in 14 EU countries, with ~3,800 EMEA employees including ~280 field technicians and ~14 dispatchers in a Warsaw control centre `[public]`. Wholly-owned subsidiary of Contoso Industrial Holdings, listed on Deutsche Börse `[public]`. €420M FY2025 group revenue `[public]`. The Studio 42 account team has been engaged with Contoso since September 2024 `[m365]`.

## 2. Why now

- Q1 2026 earnings call disclosed a €1.2M write-down for SLA-breach penalties `[public]` — public confirmation of the pain identified in the customer brief.
- New CIO Anneliese Roth (appointed Q3 2025) has publicly committed to "AI-assisted operations" as her first 90-day priority `[public]`, and the M365 signal confirms a €1.2M FY2026 budget earmarked under her "AI in operations" line item — *our budget if we land this engagement* `[m365]`.
- Carrefour and Lidl renewals (€18M combined ARR) are flagged as the de facto deadline; the Carrefour renewal pitch is on 2026-09-15 `[public+m365]`. If a working prototype with SLA-reduction evidence exists by 2026-08-31, Sandra has signalled she'll use it in that pitch `[m365]`.
- The Studio 42 conversion clause requires customer signature by 2026-08-31 for the engagement fee to credit against the multi-year program `[m365]`. Procurement freeze July-September means conversion paperwork must close by 2026-06-30 `[m365]`.

## 3. Stakeholders

| Person | Role | Stance | Notes |
|---|---|---|---|
| Sandra Holtz | COO, engagement sponsor | Strong advocate | Reputation tied to this working `[public+m365]` |
| Anneliese Roth | CIO | Advocate | "AI in operations" is her first-90-days commitment `[public]`; values impartial vendor evaluation `[m365]` |
| Matthias Köhler | Director Ops Tech | Cautious — managing | Led the failed 2019 Dispatcher 2.0 rebuild `[public+m365]`; will resist anything framed as "replacing dispatch" |
| Pawel Nowak | Warsaw control-centre lead | Skeptic | Worried about dispatcher job impact; the most likely vector for failure narrative if dispatchers feel ignored `[m365]` |
| Helga Brandt | Finance Director | Neutral-positive | Will sign off on conversion if there's a credible plan to reduce the €4.1M penalty line `[m365]` |
| Tomasz Wojcik | Former junior data scientist | (Departed Dec 2025) | Built a random-forest scoring notebook in 2024 that sits on a USB stick in Matthias's drawer; Matthias will share it if asked `[m365]` |

## 4. History the customer won't volunteer

- **2019 "Dispatcher 2.0" failure** — an internal rebuild led by Matthias on .NET 5 collapsed after 18 months because dispatchers refused to adopt it: no offline mode during Warsaw's two power outages in pilot week `[m365]`. **Implication: any future tool must work offline. Frame as "assistive layer on top of the 2008 system", never as "replacing dispatch".**
- **2023 BlueRock Consulting engagement** — 9-month "operations modernisation roadmap" delivered as a 120-page PDF in March 2025. No working code. Sandra: "the experience that made me believe in working software over slides." `[m365]` **Implication: Sandra will not tolerate slideware. The Studio 42 SOW commits to a working prototype `[m365]`.**
- **Tomasz's notebook** — decent feature engineering on technician/work-order fit, never deployed because IT refused to provision a server `[m365]`. **Implication: ask Matthias for the USB stick at the Disrupt Workshop. Could short-circuit our data analysis.**

## 5. Regulatory + competitive context

- **EU F-Gas Regulation (revised, in force Q3 2026)** — refrigerant work requires traceable assignment to certified technicians, penalties per work order `[public]`. **Implication: the "audit trail of why this tech was assigned" requirement is legally binding, not optional.**
- **EU AI Act (in force August 2026)** — any AI system making employment-affecting decisions is high-risk `[public]`. **Implication: position the dispatcher assist as recommend-only (dispatcher always accepts/rejects). Sandra has informally asked us to include EU AI Act positioning in deliverables `[m365]` — costs us nothing, de-risks the conversion pitch.**
- **Engie Solutions** has publicly announced AI-assisted dispatch (pilot, no figures yet) `[public]`. **Implication: Sandra is competitively motivated — she has a private feud with the Engie Solutions COO `[m365]`. "We beat Engie" framing plays well with her but should never be said in front of Anneliese, who values impartial vendor evaluation `[m365]`.**

## 6. Microsoft / AI estate

- Contoso Industrial Holdings has a Microsoft EA covering ~12,000 seats including M365 E5 + Copilot pilot for 200 seats `[public]`.
- One LinkedIn job ad for "Senior Data Engineer (M365 Copilot Studio)" posted Feb 2026 `[public]`. **Implication: Copilot Studio is on the table as a credible form factor for the prototype.**
- No public mention of OpenAI / Anthropic / Google AI / AWS AI services `[public]`. **Implication: Microsoft-stack solutions face no incumbent vendor pressure.**

## 7. Implications for the engagement

1. **Position any AI as "assistive layer on top of the existing 2008 dispatch system"** — never "rebuild" or "replace". Matthias's 2019 scar tissue is the single biggest adoption risk.
2. **Offline tolerance is non-negotiable.** Warsaw lost power twice in 2019 pilot week. Any prototype demo must include or acknowledge offline behaviour.
3. **Frame as recommend-only (EU AI Act).** Dispatcher always accepts/rejects/overrides. This is both a regulatory bound AND a Pawel-adoption strategy.
4. **Make F-Gas audit trail a first-class feature.** It's a legal requirement Sandra and the regulators will both verify.
5. **Invite Pawel to the Disrupt Workshop as a contributor.** If his dispatchers see themselves in the prototype, he becomes an internal advocate. If they don't, he quietly kills adoption.
6. **Anchor success metrics to the €4.1M penalty line + Carrefour renewal pitch (2026-09-15).** Helga will sign off on conversion if those numbers move; Sandra will use the prototype in the Carrefour pitch if it lands by 2026-08-31.
7. **Ask Matthias for Tomasz's notebook at the Disrupt Workshop.** Honour the prior internal work; it's both technically useful AND politically useful.
8. **Hit the 2026-06-30 procurement deadline** to get conversion paperwork through the Q3 procurement freeze window.
9. **Don't trigger the Engie comparison in mixed company.** Sandra: yes. Anneliese: never.

---

## Sources

- `sources/research/customer-public.md` — public web research (Task Researcher, 2026-05-12)
- `sources/research/m365-researcher-results.md` — M365 Copilot Researcher (Priya Raman, 2026-05-13)
- `engagement/contoso-dispatcher-ai/customer-brief.md` — customer's own voice (Sandra Holtz)
- `engagement/contoso-dispatcher-ai/engagement-brief.md` — Studio 42 internal brief
