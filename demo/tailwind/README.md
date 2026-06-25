# Tailwind Traders — VIBE Demo

A complete fixture engagement you can run end-to-end without a real customer.

> **Scenario:** Tailwind Traders is a Bristol-based outdoor, garden & home retailer (~£480M revenue, ~1.3M online orders/year). About 18% of online orders come back — ~19,000 returns a month — and a human touches every one, using a 2012 tool called ReturnDesk. Refunds take 9 days, 41% of returns are coded "Other" (so there's no usable analytics), there's no fraud/serial-returner detection (~£2.3M/yr leakage), and item disposition is a manual guess. They want an **assistive** AI for their 22 returns agents: read the customer's note, suggest the reason code with a confidence score, flag likely fraud, and recommend disposition — with a human always in control.

## What's in here

```
demo/tailwind/
├── README.md                          ← you are here
├── customer-brief.md                  one-page customer scenario, in Elena Marsh's voice
├── questionnaire-account-team.md      pre-filled account-team intake responses
├── questionnaire-customer-pre.md      pre-filled customer pre-workshop responses (Elena + Maya)
├── meeting-templates.md               4-week meeting schedule (would come from /vibe-schedule)
├── transcript-kickoff.md              fixture Teams transcript (Week 0 kickoff call)
├── transcript-workshop-1.md           fixture Teams transcript (Discover working session)
├── voice-of-customer.txt              raw survey/review/Teams quotes — the customer's unfiltered voice
├── research/
│   ├── customer-public.md             public-web desk research (Path A — Task Researcher)
│   ├── m365-researcher-prompt.md      paste-back prompt for M365 Copilot Researcher (Path B)
│   ├── m365-researcher-results.md     simulated M365 Researcher response (Path B)
│   └── research-summary.md            synthesis of both paths, with implications
├── discover-outputs/                  reference answer-keys (NOT copied — see note below)
│   ├── personas.md                    Maya Okafor + a front-line returns agent
│   ├── problem-statement.md           Grade-A structured problem statement
│   └── current-state-journey.md       the returns agent's current-state journey
└── sample-data/
    ├── returns.csv                    42 returns with rich free-text reasons (incl. blank/"Other" rows)
    ├── products.csv                   22 products with category, margin and return rate
    ├── customers.csv                  22 customers, incl. 3 flagged serial returners
    └── reason-codes.csv               the reason-code taxonomy (and the "Other" catch-all story)
```

> **Why `discover-outputs/` isn't copied:** those three files are reference answer-keys. The whole point of the demo is watching `@VIBE Discover` generate personas, the problem statement, and the current-state journey *fresh* from the sources. Keep them to check the agent's work against — don't seed them.

## How to run the demo

In a fresh engagement repo (created from the template), run this in Copilot Chat:

```
/vibe-demo
```

That single command will:

1. Confirm with you, then copy the fixture sources from `demo/tailwind/` into `sources/` (questionnaires, transcripts, meeting schedule, `research/`, and `sample-data/`)
2. Copy `customer-brief.md` into both `sources/` and `engagement/tailwind-returns-ai/`
3. Pre-fill `engagement/tailwind-returns-ai/PROJECT-CONTEXT.md` with Tailwind details
4. Mark Preparation complete and tell you exactly what to run next (`@VIBE Discover`)

From there you follow the normal flow — every phase has real source material to chew on, so you can see Discover → Disrupt → Design & Develop all the way through.

## What you can demonstrate at each phase

| Phase | What this fixture shows |
|-------|-------------------------|
| **Discover** | `@VIBE Discover` reads the questionnaires + transcripts and produces a populated PROJECT-CONTEXT plus the three required deliverables (personas, problem-statement, current-state-journey). Check them against the `discover-outputs/` answer-keys. |
| **Disrupt** | `@VIBE Disrupt` walks the workshop sequence — agenda, 2-3 candidate concepts + Spark prompts, workshop record, selected concept, future-state journey, storyboard. The customer picks a concept (e.g. the returns-agent web app, a Copilot Studio bot for agents, or an agentic Foundry reason-coder) and the agent produces the storyboard the engineer builds against. |
| **Design & Develop (web app)** | `/vibe-data-prep` types the CSVs into typed models the .NET API can serve; `/vibe-prototype-scaffold` wires a returns-triage UI that suggests reason codes, flags serial returners, and recommends disposition. |
| **Design & Develop (other form factors)** | `/vibe-deploy` shows the engineer the right Copilot Studio / Foundry Agents / Power Platform path for whichever concept the customer picks. |
| **Deliver** | `/vibe-handoff` generates a vision + roadmap + backlog grounded in the fixture content. |

## What makes the demo land

- **The 41% "Other" moment.** 14 of the 42 rows in `returns.csv` have a blank reason code despite a rich free-text note — exactly the gap the assistant closes by reading the text and suggesting a code with confidence.
- **The three serial returners.** `customers.csv` flags C-1007 (worn boots returned as "too small"), C-1013 (a wardrober), and C-1019 (electronics "faulty" but no fault found) — and the data shows the matching return rows.
- **The safety case (R-50021).** A camping stove returned for a gas leak on first use — the visceral reason the AI stays *assistive*: a human escalates it; an auto-refund bot would have buried it.
- **The legitimate edge case.** "Bought 3 tents to compare, keeping one" (R-50031/R-50032) must *not* be flagged as abuse — a good test of an explainable assistant.

## Resetting

If you want to start the demo over, delete the contents of `engagement/` and `sources/` (and `scaffold/data/` if you ran data-prep, keeping `scaffold/data/README.md`), then re-run `/vibe-demo`.
