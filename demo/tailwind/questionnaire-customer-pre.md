# Customer Pre-Workshop Questionnaire — Tailwind Traders

> Pre-filled responses representing what the customer team sent back before the kickoff workshop. Two respondents: the Director, Digital Customer Experience (sponsor) and the Returns Team Lead (front-line user).

---

## Respondent 1: Elena Marsh — Director, Digital Customer Experience

### About You

| Question | Answer |
|----------|--------|
| Your name | Elena Marsh |
| Your role / title | Director, Digital Customer Experience |
| Your department or team | Digital Customer Experience |
| Technical comfort level | Somewhat technical |

### The Problem

**In one sentence, what problem do you most want to solve?**

Our returns experience is eroding customer trust and costing real money — I need an assistive way for agents to classify return reasons accurately, spot risky patterns fairly, and make better disposition decisions without taking refund approval away from humans.

**How is this handled today?**

Every return is touched by a person in the Bristol contact centre. The agent reads the customer's free-text note in ReturnDesk, chooses a reason code from a dropdown, approves or denies the refund, and guesses whether the item should be restocked, refurbished, liquidated, or recycled. The data then flows downstream to SAP and Power BI, but because 41% of returns end up as "Other", the analytics are not good enough to trust.

**What frustrates you most?**

We know returns are our worst touchpoint — 9 days to refund on average, NPS −12, and 28% of returners saying they will not shop again — but the reason data is too messy to tell us what to fix first. Finance also believes we are leaking £2.3M a year through wardrobing and abuse, yet we cannot ask teams to act on black-box fraud flags.

**What does great look like?**

An agent reads the customer's note and sees a suggested reason code with a confidence score, a recommended disposition with a clear reason, and any serial-returner concern explained in plain English. The agent decides; the system assists. That gives us usable return analytics without making the experience feel automated or unfair.

### Impact

| Question | Answer |
|----------|--------|
| Time cost per week | More than 10 hours |
| People affected | 20-100 |
| What happens if nothing changes in 6 months? | We go into Black Friday and Christmas peak with the same manual queue, the same 9-day refund cycle, and no board-ready evidence for September peak planning. Last January the queue hit around 40,000 and refunds slipped to about 3 weeks — I do not want to repeat that. |

### Data & Systems

**What data or systems are relevant?**

- ReturnDesk, our 2012 returns system of record
- Magento for online orders upstream of returns
- SAP for inventory, finance, and refunds downstream
- Microsoft 365, Azure, Power Platform, and Power BI
- Anonymised CSV exports for returns, products, customers, and reason-code taxonomy

**Can you share sample data?**

Yes — anonymised CSVs are available. No live system connections should be needed for the prototype.

### Priorities

**If the prototype could only do ONE thing, what should it be?**

Accurate reason-coding from the customer's free-text note with a confidence score, so we finally get real return analytics instead of the 41% "Other" problem.

**What would make you say yes, this is worth investing in?**

A live demo using our own anonymised data, showing the prototype reading messy customer notes, suggesting the right code and disposition, and explaining its reasoning well enough that Maya's team would actually trust it.

**Anything else?**

This must stay assistive. Finance requires a human to approve every refund, and any serial-returner flagging must be explainable and fair because return history and purchase patterns are personal data under GDPR.

---

## Respondent 2: Maya Okafor — Returns Team Lead, Bristol (11 years)

### About You

| Question | Answer |
|----------|--------|
| Your name | Maya Okafor |
| Your role / title | Returns Team Lead, Bristol |
| Your department or team | Returns / Bristol contact centre |
| Technical comfort level | Non-technical |

### The Problem

**In one sentence, what problem do you most want to solve?**

The team spends too much time trying to translate messy customer notes into ReturnDesk codes and refund decisions, and the system gives them no sensible help when the queue is already hundreds deep.

**How is this handled today?**

An agent opens the return, reads whatever the customer typed, tries to pick a reason code from a dropdown nobody really understands, then decides what should happen to the item. If they think someone might be a serial returner, they have to dig through order history manually. On a bad day that can mean 20 minutes just to work out whether the same person has sent back another pair of muddy boots.

**What frustrates you most?**

The dropdown is the worst bit. The labels do not match how customers write, so agents default to "Other" just to keep the work moving. Then the queue is 600 deep, the warehouse wants a disposition, finance wants us to be careful, and the customer wants their refund yesterday. It is not that the team does not care — the tool makes the right answer hard.

**What does great look like?**

Read the customer's note, suggest the code and the disposition, tell me WHY, and let me decide. If there is a serial-returner concern, show me the pattern in a way I can explain without accusing the customer unfairly.

### Impact

| Question | Answer |
|----------|--------|
| Time cost per week | More than 10 hours |
| People affected | 20-100 |
| What happens in 6 months? | Peak will hit and the queue will swallow us again. Refunds will slow down, the good agents will burn out, and customers who liked the product will remember the painful return instead. |

### Data & Systems

Same as Elena's answer, plus the order-history view agents use when they need to spot repeat return patterns.

### Priorities

**If the prototype could only do ONE thing?**

Read the customer's note and suggest the right reason code. If it can also suggest restock, refurbish, liquidate, or recycle, that is a bonus.

**What would make you say yes?**

If I could put real examples through it in a workshop and the suggestion matched what an experienced agent would choose — with an explanation that makes sense to someone on the floor, not just to a data person.

**Anything else?**

Please do not bolt on one more thing the team has to fight. The last "smart" tool was a glorified label printer; it made a nice demo but did not help us classify reasons, spot regular abusers, or clear the queue any faster.
