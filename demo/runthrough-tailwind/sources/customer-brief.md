# Customer Brief — Tailwind Traders

> **The customer's own voice.** Drafted by Elena Marsh, Director of Digital Customer Experience at Tailwind Traders, in response to the Studio 42 customer-brief template. Elena wrote the first pass; Tom from the account team transcribed and lightly edited for flow.
>
> *Run-through fixture: drag this into the **Sources** dropzone so every later step is grounded in the customer's voice.*

---

## Who we are

Tailwind Traders. We're a Bristol-headquartered outdoor & home retailer — camping, hiking, garden, and home goods — selling online and through 60 stores across the UK and Ireland. About £480M revenue, roughly 1.3M online orders a year. We're proud of our customer service; it's the reason people pick us over the big marketplaces. Which is exactly why the returns mess hurts so much.

**Sponsor**: Elena Marsh, Director of Digital Customer Experience.

## The problem in our words

Returns are eating us alive. Around 18% of every online order comes back — about **19,000 returns a month**, and a human being touches every single one. We have 22 agents in our Bristol contact centre working a tool called ReturnDesk that we bought in 2012. They read the customer's free-text reason, try to pick a reason code from a dropdown, decide whether to approve the refund, and then guess what should happen to the item — put it back on the shelf, send it to refurb, liquidate it, or bin it.

Three things are broken:

1. **It's slow.** Average refund takes **9 days**. Customers chase us. Our returns NPS is **minus 12** — our *worst* touchpoint by a mile, and 28% of people who return something tell us they won't shop with us again.
2. **We're flying blind.** **41% of returns get coded "Other"** because the dropdown is a nightmare and agents are rushed. So we genuinely cannot tell you why people return things. We're guessing.
3. **We're leaking money.** No fraud or serial-returner detection at all. Finance estimates **£2.3M a year** walks out the door in wardrobing and abuse. And because disposition is a manual guess, roughly **30% of items go to the wrong place** — we bin things we could have resold and restock things we should have refurbished.

All-in, returns cost us about **£14M a year**. We think AI could responsibly address **£5–6M** of that.

We are NOT asking you to auto-refund people — finance would have my head. We want an **assistant** for the agents: read the customer's note, suggest the reason code with a confidence score, flag if this looks like fraud or a serial returner, and recommend the disposition with a reason. The agent stays in control.

## Who feels it most

Maya, our returns team lead in Bristol. She's been here eleven years, knows the regulars, can smell a wardrober from the order history. She spends her day firefighting the queue and re-training agents on the reason-code dropdown nobody understands. She's protective of her team and deeply sceptical of "AI" — the last tool we bought was sold as smart and turned out to be a glorified label printer. Win Maya over and the team follows. Lose her and it's dead.

## What "great" looks like for us

Six months after go-live, if we can say all of these, it worked:

- Average refund cycle time down from 9 days to **under 3**
- "Other" reason-coding down from 41% to **under 10%** — so we finally have real return analytics
- Fraud/serial-returner flags surfaced on **>80%** of the cases finance later confirms as abuse
- Returns NPS up from **-12 to positive**
- Maya's team tells us they feel **helped, not watched**

## What we've already invested in

| Investment | Role today | Keeping? |
|---|---|---|
| ReturnDesk (2012 returns-management tool) | System of record for returns | **Keep — augment with an assistive layer** |
| Magento commerce platform | Online orders, upstream of returns | Keep |
| SAP (inventory, finance, refunds) | Downstream of returns | Keep |
| Microsoft Enterprise Agreement (M365 E5, Azure, Power Platform) | Productivity + our internal apps | Keep, expanding |
| A "returns insights" Power BI dashboard built in 2023 | Reactive trend reporting | Useful but backward-looking |
| 18 months with an outsourced 3PL returns desk (2021–22) | Brought back in-house — made CX worse | Gone |

## Constraints we want you to know about

- **Assistive only — no autonomous refunds.** Finance requires a human to approve every refund. The AI recommends; the agent decides.
- **GDPR.** Return history and customer purchase patterns are personal data. Serial-returner flagging especially needs to be explainable and fair — we can't have a black box accusing customers of fraud.
- **All-Microsoft.** Our stack is Azure + Power Platform + M365. Please keep the prototype on Microsoft technology.
- **No live system connections in the prototype.** We'll give you anonymised CSV exports — returns, product catalogue, and customers. Don't wire into ReturnDesk, Magento, or SAP.
- **Explainability is non-negotiable.** Every reason-code and fraud suggestion must show *why*. Agents won't trust a score with no reason, and our compliance team won't sign off a fraud flag we can't justify to a customer.
- **Timeline.** Our Black Friday / Christmas returns peak is the killer — last January the queue hit 40,000 and refunds slipped to three weeks. We do peak planning in **September**. If you can show a working prototype with evidence by then, I'll put it in front of the board.

## Decision-makers + authority

| Name | Role | Can say yes to | Needs to be informed about |
|---|---|---|---|
| **Elena Marsh** | Director, Digital Customer Experience | Engagement scope, feature trade-offs, go/no-go | Everything material |
| **Claire Donovan** | CIO | Architecture, AI tooling, the FY26 "customer AI" budget | Major architecture or tooling choices |
| **Dev Patel** | Head of Reverse Logistics | Disposition logic, warehouse data access, anything touching the physical returns flow | Anything that changes the warehouse process |
| **Raj Singh** | Finance Business Partner | The £2.3M leakage line, refund-policy guardrails | The ROI story and any fraud-flagging approach |
| **Maya Okafor** | Returns Team Lead, Bristol | Team adoption (de facto veto via her team) | Anything that changes the agent workflow |

## What we'd love to see from the engagement

What we hope: something Maya's team can actually click — not a slide deck, not another dashboard. Enough evidence by end of Week 4 that I can take it to Claire and the board ahead of September peak planning.

What we're afraid of: buying another "smart" tool that turns out to be a label printer with a logo. We've been burned — the 3PL in 2021, the returns SaaS in 2023. The team's patience for shiny promises is gone.

The thing we don't say out loud: the contact-centre team is burned out and turnover is climbing. If you give them back the hours they waste fighting the reason-code dropdown and chasing refunds, you'll have champions here for years. If it's one more thing bolted on top, Maya will smile politely and the team will quietly route around it.

---

> **For Studio 42**: Cite this document in `engagement-brief.md`. Every claim about Tailwind's worldview should trace back to a quote here, a transcript, or a source document. Don't paraphrase Elena's voice — quote it.
