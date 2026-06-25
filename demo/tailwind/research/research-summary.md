# Research Summary — Tailwind Traders

> Synthesis of public-web research (`customer-public.md`) and M365 Researcher results (`m365-researcher-results.md`).
> Every fact is tagged with its source: `[public]`, `[m365]`, or `[public+m365]`.
>
> *Demo fixture: would normally be produced by `/vibe-research` Step 5 when both inputs are available.*

## 1. Who Tailwind Traders is

Tailwind Traders Ltd. is a Bristol-headquartered omnichannel retailer of outdoor, garden, camping, hiking, and home goods, operating online plus 60 stores across the UK & Ireland `[public]`. The business has ~£480M revenue and ~1.3M online orders/year `[public]`. The Studio 42 / Microsoft account team has been engaged with Tailwind on the returns problem since September 2025 `[m365]`.

## 2. Why now

- Tailwind's online return rate is 18%, or ≈19,000 returns/month, and every return is touched by a human in the Bristol operation `[public+m365]`.
- Average refund cycle time is 9 days against a target of <3 days; returns NPS is −12, and 28% of returners say they won't shop again `[m365]`.
- January peak exposed the scale of the issue: the queue hit ~40,000 returns and refunds slipped to ~3 weeks `[m365]`. September peak planning is the board-evidence deadline before Black Friday/Christmas `[m365]`.
- Finance estimates £2.3M/year leakage from wardrobing and abuse, total returns cost ≈£14M/year, and £5–6M/year addressable through better reason coding, fraud/serial-returner handling, and disposition `[m365]`.
- The tracked opportunity is OPP-UKI-2026-07731 at £3.2M ACV across 3 years, with Year 1 at £1.1M if the prototype converts into implementation `[m365]`.

## 3. Stakeholders

| Person | Role | Stance | Notes |
|---|---|---|---|
| Elena Marsh | Director, Digital Customer Experience, sponsor | Strong advocate | Owns the returns NPS −12 problem and needs board-ready evidence before September `[public+m365]` |
| Claire Donovan | CIO | Advocate | Has FY26 "customer AI" budget; wants an all-Microsoft assistive layer over ReturnDesk `[public+m365]` |
| Dev Patel | Head of Reverse Logistics | Advocate, detail-oriented | Wants disposition recommendations because ~30% of items go to the wrong place today `[public+m365]` |
| Raj Singh | Finance Business Partner | Neutral-positive | Will support if the prototype credibly addresses £2.3M leakage and £5–6M/year addressable value `[m365]` |
| Maya Okafor | Returns Team Lead, Bristol | Sceptical — critical to win | 11-year operational lead; burned by the 2023 portal let-down; de-facto adoption veto for the 22 agents `[m365]` |
| Callum / Priya / Nadia | Returns Agents | Mixed but engaged | Want less manual coding and better flags, but not extra clicks or removal of judgement `[m365]` |

## 4. History the customer won't volunteer

- **2021-22 3PL outsourcing reversal** — cheaper on paper, but CX worsened and returns were brought back in-house `[m365]`. **Implication: don't position the prototype as labour removal; position it as helping Tailwind keep service quality in-house.**
- **2023 returns-portal SaaS disappointment** — prints labels and starts returns, but does not classify reasons, detect abuse, or recommend disposition. Elena calls it "a glorified label printer" `[m365]`. **Implication: the prototype must show decision support, not another intake screen.**
- **2023 Power BI returns insights dashboard** — useful for trends, but backward-looking `[m365]`. **Implication: demonstrate help at the moment the agent reads the customer's note.**
- **Manual serial-returner spreadsheet** — Maya and Callum stopped using it because it was incomplete, risky from a GDPR perspective, and invisible in ReturnDesk `[m365]`. **Implication: fraud/serial-returner suggestions must be explainable, proportionate, and surfaced in workflow.**

## 5. Regulatory + market context

- **UK GDPR / Data Protection Act 2018** — purchase patterns, return history, contact notes, and serial-returner signals are personal data `[public]`. **Implication: fraud flags must be explainable and fair, with human review.**
- **Consumer Rights Act 2015** — refund handling must respect statutory consumer rights, especially for faulty goods `[public]`. **Implication: recommendations cannot become blanket denial automation.**
- **Product safety obligations** — safety-related returns need escalation `[public]`. **Implication: the camping-stove gas-leak example should be a headline demo moment for assistive, explainable escalation.**
- Retail returns are a material industry cost, especially in e-commerce apparel, footwear, outdoor, and bulky home goods `[public]`. **Implication: Tailwind's 18% return rate is plausible and worth attacking, but not unusual enough to make the customer feel singled out.**

## 6. Microsoft / AI estate

- Tailwind has a Microsoft Enterprise Agreement across M365 E5, Azure, and Power Platform `[public]`.
- Claire's FY26 priority is responsible "customer AI" on Microsoft cloud, with no appetite to replace Magento, SAP, or ReturnDesk in the prototype `[public+m365]`.
- Azure AI / Azure OpenAI are credible for free-text reason classification, confidence scoring, explanation generation, and fraud/serial-returner pattern surfacing `[public]`.
- Power Platform is credible for a rapid agent-facing workflow and human approval experience layered over existing systems `[public]`.
- Prototype data will be anonymised CSV exports for returns, products, customers, and reason-code taxonomy; no live system connections are approved `[m365]`.

## 7. Implications for the engagement

1. **Lead with an assistive agent experience, not automation.** Finance requires human approval for every refund; Elena and Maya both want agent judgement preserved.
2. **Make reason-coding-first the safest first win.** It tackles the 41% Other problem, improves analytics, and avoids making fraud the opening move.
3. **Keep fraud/serial-returner detection in scope as a second-step value case.** Raj's £2.3M leakage estimate is too important to ignore, but GDPR and fairness mean it must be explainable and human-reviewed.
4. **Show disposition recommendations alongside reason coding.** Dev needs restock / refurbish / liquidate / recycle guidance because ~30% of items go to the wrong place.
5. **Win Maya early.** She is the adoption veto for the 22 agents; the demo must reduce ambiguity and clicks rather than add process.
6. **Use the safety-return scenario to prove the assistant is responsible.** The camping-stove gas leak should escalate, not disappear into a routine refund path.
7. **Anchor success metrics to 9 days → <3 days, 41% Other → <10%, £2.3M leakage, and £5–6M/year addressable value.** Those are the metrics Elena, Raj, and Claire will take to the board.
8. **Respect the September peak-planning deadline.** The prototype must give Elena board-ready evidence before Black Friday/Christmas planning locks.
9. **Stay all-Microsoft and no-live-connections.** Azure AI, Azure OpenAI, Power Platform, M365, and anonymised CSV exports fit the customer's constraints.

---

## Sources

- `sources/research/customer-public.md` — public web research (Task Researcher, 2026-06-22)
- `sources/research/m365-researcher-results.md` — M365 Copilot Researcher (Tom Bryce, 2026-06-23)
- `engagement/tailwind-returns-ai/customer-brief.md` — customer's own voice (Elena Marsh)
- `engagement/tailwind-returns-ai/engagement-brief.md` — Studio 42 internal brief
