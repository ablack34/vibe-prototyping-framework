# Contoso Field Services — VIBE Demo

A complete fixture engagement you can run end-to-end without a real customer.

> **Scenario:** Contoso Field Services dispatches 280 HVAC technicians across EMEA. Their 2008-era dispatch system causes SLA breaches that cost ~€4M/year in contractual penalties and another ~€6M in lost contract renewals. They want an AI-powered dispatcher assist to reduce SLA breaches and free dispatchers from tedious assignment work.

## What's in here

```
demo/contoso/
├── README.md                          ← you are here
├── customer-brief.md                  one-page customer scenario (for your own context)
├── questionnaire-account-team.md      pre-filled account-team intake responses
├── questionnaire-customer-pre.md      pre-filled customer pre-workshop responses
├── transcript-kickoff.md              fixture Teams meeting transcript (kickoff call)
├── transcript-workshop-1.md           fixture transcript (workshop with the customer)
└── sample-data/
    ├── technicians.csv                25 technicians with skills, location, availability
    ├── sites.csv                      20 customer sites with SLA tiers
    └── work-orders.csv                40 work orders across 4 weeks
```

## How to run the demo

In a fresh engagement repo (created from the template), run this in Copilot Chat:

```
/vibe-demo
```

That single command will:

1. Confirm with you, then copy everything from `demo/contoso/` into `sources/` and `scaffold/data/`
2. Pre-fill `engagement/contoso-dispatcher-ai/PROJECT-CONTEXT.md` with Contoso details
3. Create the `engagement/contoso-dispatcher-ai/` folder
4. Tell you exactly what to run next (`@VIBE Discover`)

From there you follow the normal flow — every phase has real source material to chew on, so you can see Discover → Define → Ideate → Build all the way through.

## What you can demonstrate at each phase

| Phase | What this fixture shows |
|-------|-------------------------|
| **Discover** | `@VIBE Discover` reads the questionnaires + transcripts and produces a populated discovery summary; questionnaire fields auto-fill PROJECT-CONTEXT.md |
| **Define** | `@VIBE Define` frames a clear $50M problem (penalties + lost renewals) and prioritizes use cases like "auto-assign", "SLA risk detection", "EoD comms" |
| **Ideate** | `/vibe-ideate` produces 2-3 form-factor variants — a dispatcher web app, a conversational Copilot Studio bot for technicians, an agentic Foundry agent that auto-routes |
| **Build (web app)** | `/vibe-data-prep` types the three CSVs into typed models the .NET API can serve; `/vibe-prototype-scaffold` wires a dispatcher UI |
| **Build (other form factors)** | `/vibe-deploy` shows the engineer the right Copilot Studio / Foundry Agents / Power Platform path for whichever concept the customer picks |
| **Deliver** | `/vibe-handoff` generates a vision + roadmap + backlog grounded in the fixture content |

## Resetting

If you want to start the demo over, delete the contents of `engagement/`, `sources/`, and `scaffold/data/` (keep the `scaffold/data/README.md`), then re-run `/vibe-demo`.
