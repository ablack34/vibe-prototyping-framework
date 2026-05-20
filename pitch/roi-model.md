# ROI Model — VIBE Delivery Harness

**Purpose:** Anchor the SLT conversation in numbers without pretending the numbers are bulletproof. This is a *defensible framework*, not an audit.

**Framing note:** VIBE Prototyping is the existing Studio 42 AI-first consulting offering. This ROI model measures the impact of **adopting the delivery harness** to scale that offering — not the impact of VIBE itself.

---

## TL;DR

| | Conservative | Realistic | Optimistic |
|---|---|---|---|
| Annual Studio 42 hours saved | 200 | 600 | 1,200 |
| Annual $ saved (Studio 42 time) | **$40K** | **$150K** | **$360K** |
| Annual pipeline lift (deal velocity) | $0 | $250K | $500K |
| **Total annual impact** | **$40K** | **$400K** | **$860K** |

**Bottom line:** The harness has $0 build cost (already built) and ~$7.5K of measurement overhead during adoption. Even in the conservative case, payback is immediate.

---

## Inputs (sanity-check before the meeting)

These are the levers. If your view of any of them differs, edit this file and the numbers update accordingly.

| Input | Conservative | Realistic | Optimistic | Source / assumption |
|-------|--------------|-----------|------------|---------------------|
| VIBE engagements / year | 10 | 15 | 20 | Studio 42 historical run-rate (sanity-check with delivery ops) |
| Hours saved / engagement | 20 | 40 | 60 | [leadership.md](../docs-site/docs/why-vibe/leadership.md) baseline: "20+ hours of manual documentation per engagement" |
| Studio 42 blended rate ($/hr) | 200 | 250 | 300 | Placeholder — replace with actual blended rate before sharing |
| Average VIBE engagement deal size ($) | $5M | $5M | $5M | Studio 42 historical avg (sanity-check) |
| Deal-velocity lift (days earlier close) | 0 | 7 | 14 | Conservative = no claim; realistic = 1 week earlier on harness-delivered engagements |
| % of engagements that convert to deals | n/a | 30% | 50% | Used to attribute pipeline lift |

---

## Scenario 1 — Conservative

**Stance:** Assume the harness only saves Studio 42 internal time on VIBE delivery. No customer impact. No deal-velocity claim.

```
10 engagements/yr × 20 hours saved × $200/hr = $40,000/yr
```

**What this assumes:** The harness is purely an internal productivity tool for the VIBE practice. Customers don't notice. Deals close at the same pace.

**Why this matters:** Even with this floor, the harness covers its measurement overhead in the first engagement. There's no "validate it first" risk to absorb — the harness is built and the engagements are happening anyway.

**What we explicitly don't claim:** Win-rate lift, deal-size lift, customer NPS lift, retention lift.

---

## Scenario 2 — Realistic

**Stance:** Harness saves internal time *and* shortens deal cycles by ~1 week on harness-delivered VIBE engagements.

```
Time saved:
  15 engagements/yr × 40 hours saved × $250/hr = $150,000/yr

Deal-velocity impact:
  15 engagements × 30% conversion = 4.5 deals/yr
  4.5 deals × $5M avg × ~1.1% revenue-lift from 1-week-earlier close = $250,000/yr

Total: $400,000/yr
```

**The 1.1% revenue-lift number explained:** A 1-week-earlier deal close on a $5M engagement, assuming a 12-month average sales cycle, captures roughly 2% additional revenue per deal (week early × 52 weeks/yr × discount factor). We're using 1.1% as a deliberately conservative version of that — half the upside, to avoid over-claiming.

**What this assumes:** Most VIBE engagements use the harness; some customers notice faster turnaround; ~1 in 4 harness-delivered deals close measurably earlier.

**Why this is the "realistic" case:** It assumes the harness works as designed but doesn't transform the business. Studio 42 does what Studio 42 already does, just faster and more consistently.

---

## Scenario 3 — Optimistic

**Stance:** Harness saves significant internal time, shortens deal cycles by ~2 weeks, and enables 25% more VIBE engagements per year (because squads aren't bottlenecked on engineers).

```
Time saved:
  20 engagements/yr × 60 hours saved × $300/hr = $360,000/yr

Deal-velocity impact:
  20 engagements × 50% conversion = 10 deals/yr
  10 deals × $5M avg × ~1% revenue-lift = $500,000/yr

Total: $860,000/yr
```

**What this assumes:** The harness becomes the default way Studio 42 delivers VIBE. Non-engineer squad members drive engagements end-to-end (engineering becomes the bottleneck-buster, not the bottleneck). Customers actively choose Studio 42 because the harness enables faster, more consistent VIBE delivery.

**Why this is "optimistic":** It assumes a behavioral shift across the practice, not just tooling adoption. Treat as a stretch goal, not a forecast.

---

## Sensitivity table

If you don't like the realistic-case rate or volume assumption, this is how the numbers move (rate × volume held to a single scenario each):

### Rate sensitivity (volume = 15 engagements, hours = 40)

| Blended rate | Annual $ saved |
|--------------|----------------|
| $200/hr | $120K |
| $250/hr | $150K |
| $300/hr | $180K |
| $400/hr | $240K |

### Volume sensitivity (rate = $250, hours = 40)

| Engagements/yr | Annual $ saved |
|----------------|----------------|
| 5 | $50K |
| 10 | $100K |
| 15 | $150K |
| 25 | $250K |

### Hours-saved sensitivity (rate = $250, volume = 15)

| Hours saved/engagement | Annual $ saved |
|------------------------|----------------|
| 10 | $37.5K |
| 20 | $75K |
| 40 | $150K |
| 60 | $225K |

---

## What we explicitly do NOT claim

This is here so we don't get blindsided in Q&A. If someone tries to expand the claim, point at this section.

- ❌ **Win-rate lift** — we don't have data correlating harness usage with deal close-rate
- ❌ **Customer satisfaction lift** — no NPS deltas yet (one of the things adoption will measure)
- ❌ **Average deal size lift** — no evidence harness-driven artifact quality drives larger deals
- ❌ **Account retention lift** — out of scope
- ❌ **Replacement of engineering capacity** — engineers still build the prototype; the harness changes *what they receive*, not whether they're needed
- ❌ **VIBE offering improvement** — the harness scales the existing offering; it doesn't change what VIBE delivers

---

## Adoption economics

The 3-engagement adoption period is the *measurement* exercise that turns this model from "assumption" to "data."

| Adoption input | Assumption |
|----------------|------------|
| Engagements covered | 3 (next qualifying VIBE engagements) |
| Adoption duration | 8-12 weeks (sequential with overlap) |
| Incremental delivery cost | $0 (engagements are happening anyway, harness is built) |
| Measurement overhead | ~10 hrs / engagement (tracking time, customer NPS, squad-lead survey) = ~$7.5K total |
| **Adoption period total cost** | **~$7.5K equivalent** (measurement only) |

### Adoption success thresholds

| Metric | Target | Why this threshold |
|--------|--------|--------------------|
| Time-to-first-prototype | < 5 days | Reference: today's manual baseline = 1-2 weeks (per [leadership.md](../docs-site/docs/why-vibe/leadership.md)) |
| Squad-lead would use again | Yes (qualitative) | Tells us whether the harness helps or hinders the squad — the most important signal |
| Customer NPS | ≥ 8 | Standard threshold for "would actively recommend" |
| Harness gaps surfaced | Catalogued | Every adoption engagement should surface things to improve — that's expected, not a failure |

### Adoption decision logic

```
IF 3 of 3 hit  → Formalize harness as standard Studio 42 VIBE tooling
IF 2 of 3 hit  → Formalize harness, prioritize fixes for the failure mode
IF 1 of 3 hits → Identify the success pattern, narrow harness scope to that
IF 0 of 3 hit  → Retire or fundamentally rebuild
```

---

## How to update this file

Edit the input table at the top of "Inputs." All the scenario sections reference those numbers, so updating the inputs and re-computing the math will keep the doc consistent. **Don't change just the totals** — the audit trail matters.

If you need to add a new scenario (e.g., "What if we charged customers for harness-accelerated engagements at a premium?"), add it as Scenario 4 — don't rewrite the existing three.

---

## Source comments

- "20+ hours of manual documentation per engagement" — from [docs-site/docs/why-vibe/leadership.md](../docs-site/docs/why-vibe/leadership.md), "The Problem" section
- "40% of engagement time spent on docs" — same source
- Siemens $19M deal / $140M 5yr consumption — from [docs-site/docs/why-vibe/case-studies.md](../docs-site/docs/why-vibe/case-studies.md) (not used in ROI math; only as context for "what a VIBE engagement can be worth")
- Contoso €12M addressable pain — from [demo/contoso/customer-brief.md](../demo/contoso/customer-brief.md) (illustrative customer-side ROI; not used in Studio 42 ROI math)
- Blended hourly rate ($250) — **placeholder, not sourced**. Replace before sharing externally.
- VIBE engagement volume (15/yr) — **placeholder, not sourced**. Replace before sharing externally.
