# Account Team Handover — Tailwind Traders

> Internal Studio 42 intake, completed by the account team. In a real engagement this is the Microsoft Forms export from the `/vibe-questionnaire` account-team intake; for the run-through it's transcribed to Markdown.
>
> *Run-through fixture: drag this into the **Sources** dropzone.*

---

## Section 1: Customer Context

| Question | Answer |
|----------|--------|
| Customer name | Tailwind Traders Ltd. |
| Industry | Retail — outdoor, garden & home goods (omnichannel) |
| Region | UK & Ireland |
| Customer sponsor name and title | Elena Marsh — Director, Digital Customer Experience |
| Customer technical contact | Dev Patel — Head of Reverse Logistics |
| Account team contact (your name) | Tom Bryce — Account Executive, Microsoft UKI |

## Section 2: Deal Context

| Question | Answer |
|----------|--------|
| Deal ID or opportunity reference | OPP-UKI-2026-07731 |
| Expected deal value | £3.2M ACV across 3 years (Year 1: £1.1M) |
| Funding source | Customer-funded prototype; discovery phase funded by the partner investment fund |
| Why is S42 involved? What's the presales ask? | Elena rejected a 6-month "returns transformation" proposal from a systems integrator — too slow, too much consulting, no working software. She wants a tangible AI prototype her returns team can click within ~4 weeks, before committing to a multi-year programme. S42 is the proof-of-value that converts this into a managed AI engagement. |

## Section 3: Problem Space

**What is the customer trying to accomplish?**

Tailwind processes ~19,000 online returns a month (≈18% of online orders) entirely manually — 22 agents in Bristol using a 2012 tool called ReturnDesk. Agents read a free-text reason, pick a reason code, approve/deny the refund, and decide the item's disposition (restock / refurbish / liquidate / recycle). Average refund takes 9 days, 41% of returns are coded "Other" (so there's no usable return analytics), there's no fraud or serial-returner detection (finance estimates £2.3M/yr leakage), and ~30% of items are sent to the wrong disposition. They want an AI **assistant** for agents: suggest the reason code with confidence, flag likely fraud/serial returners, and recommend disposition with an explanation — human stays in control.

**Why now? What's the urgency?**

Returns NPS is -12, their single worst touchpoint, and 28% of returners say they won't shop again — directly threatening the customer-service reputation Tailwind competes on. The Black Friday/Christmas peak is the forcing function: last January the returns queue hit ~40,000 and refunds slipped to three weeks. Peak planning happens in September, so Elena needs board-ready evidence before then.

**What has been tried before?**

- 2021–22: outsourced the returns desk to a 3PL. Cheaper on paper, but CX got worse (scripted agents, no judgement) and they brought it back in-house in 2022.
- 2023: bought a returns-portal SaaS (label-generation + customer self-service). It produces return labels but does **not** classify reasons or detect fraud — "a glorified label printer" in Elena's words.
- 2023: built a Power BI "returns insights" dashboard. Useful for trends but reactive — it reports what already went wrong, it doesn't help the agent in the moment.

**What data does the customer have? (format, volume, sensitivity)**

- Returns history: ~19k/month; they'll share an anonymised CSV export of recent returns (~40 representative rows for the prototype) including the free-text reason and outcomes.
- Product catalogue: ~CSV export, SKU-level with category, price, margin and historical return rate.
- Customers: anonymised CSV with 12-month order/return counts and a finance-flagged serial-returner marker.
- Reason-code taxonomy: maintained as an Excel workbook by Maya's team.
- All exports anonymised by the customer before sharing; classified Internal once anonymised, Confidential in original form.

## Section 4: Engagement Scoping

| Question | Answer |
|----------|--------|
| Requested start date | 2026-06-22 |
| Known risks or blockers | (1) Maya Okafor (returns team lead) is sceptical after the 2023 "smart tool" let-down — adoption risk is real and she's the de facto veto. (2) Fraud/serial-returner flagging is GDPR-sensitive and must be explainable and fair — compliance will scrutinise it. (3) Finance insists refunds stay human-approved; the AI must be assistive only. (4) The reason-code taxonomy is inconsistent and partly tribal knowledge in Maya's head. |
| Is this a $50K problem or a $50M problem? Your honest assessment. | A genuine **multi-million** problem. ~£14M/yr all-in returns cost, with ~£5–6M/yr addressable through better reason-coding, fraud detection, and disposition. Strategic beyond the numbers: returns is Tailwind's worst CX touchpoint, so fixing it protects the service reputation their whole brand is built on. Strong foothold for a broader customer-AI managed programme. |
