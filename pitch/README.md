# Pitch Package — VIBE Delivery Harness

Materials for pitching adoption of **the VIBE delivery harness** to Studio 42 / ISE leadership.

## Framing — read this first

**VIBE Prototyping is what Studio 42 already sells.** It's the AI-first consulting offering — proven on Siemens Healthineers, Coca-Cola Hellenic, Novartis.

This repo is **not** a new offering. It's the **delivery harness** for VIBE — the codified set of AI prompts, agents, and instructions that turn the methodology into a repeatable, AI-assisted workflow. It makes every VIBE engagement faster, more consistent, and accessible to non-engineers.

> **What's a harness?** Analogous to a test harness for code, a *delivery harness* is the codified tooling — agents, prompts, templates, validation gates — that turns a methodology into an executable workflow. The methodology used to live in people's heads. Now it lives in the harness.

The pitch is therefore not "validate a new thing." It's **"adopt this harness to scale our existing AI-first consulting practice without bottlenecking on engineers."**

## What's in here

| File | What it's for | When you use it |
|------|---------------|-----------------|
| [executive-1-pager.md](executive-1-pager.md) | Single-page summary — problem, harness, proof, ask | Pre-read before the meeting; leave-behind after |
| [pitch-deck-outline.md](pitch-deck-outline.md) | 10-slide deck outline with bullets + speaker notes | The actual 10-15 min meeting |
| [roi-model.md](roi-model.md) | Conservative / Realistic / Optimistic ROI scenarios | When someone asks "show me the numbers" |
| [demo-script.md](demo-script.md) | 15-min live demo walkthrough | Follow-up meeting when SLT says "can we see it?" |

## Suggested sequence

1. **48 hours before the meeting** — Send the 1-pager as a pre-read attached to the calendar invite
2. **In the meeting (10-15 min)** — Walk the deck outline (don't read the slides — talk to them)
3. **Q&A** — Have the ROI model open and ready to share
4. **Follow-up** — Offer the 15-min live demo as the next step for anyone who wants to see it work

## The recommended ask

**Adopt the harness as the default tooling on the next 3 VIBE engagements, then formalize across the practice.**

This is *graduated adoption*, not a "validation pilot":
- Cost is zero — the harness is built and the engagements are happening anyway
- The 3 engagements measure adoption mechanics (lead receptiveness, harness gaps, time savings) — not whether VIBE works
- After the 3rd, formalize as standard tooling or iterate based on what we learn

## Buzzwords used (deliberately, not bolted on)

These are Studio 42's existing positioning — the artifacts use them in their natural place, not stapled on:

- **"You just need a +1"** — 1-pager headline, slide 1 subtitle
- **"AI-first consulting"** — slide 1 framing, recurs in economics section

If your room uses other Studio 42 phrases ("hypervelocity," "evidence-based design," etc.), grep and swap them in.

## Adapting for other audiences

Same harness, different framing depending on the room.

| Audience | Lead with | De-emphasize |
|----------|-----------|--------------|
| **Studio 42 / ISE leadership** (current default) | Scale VIBE practice, throughput, non-engineer empowerment | External-customer ROI math |
| **Microsoft field/sales leadership** | Deal velocity, "weeks not months" vs incumbent SIs | Internal Studio 42 operations |
| **A specific customer's exec team** | Their problem, prototype-in-weeks-not-months, regulatory urgency | Studio 42 internal mechanics |
| **TPMs / delivery leads** | "You can drive 3 of 5 phases without an engineer" | ROI, ask, pilot framing |

If you need a different audience version, copy the relevant artifact, rename it (`executive-1-pager-customer.md`), and reframe — the source material is the same.

## Source material these artifacts draw from

| Source | Used in |
|--------|---------|
| [docs-site/docs/why-vibe/leadership.md](../docs-site/docs/why-vibe/leadership.md) | 1-pager spine, deck slides 1-4 |
| [docs-site/docs/why-vibe/case-studies.md](../docs-site/docs/why-vibe/case-studies.md) | Deck slide 6 (Siemens, Coca-Cola) |
| [docs-site/docs/why-vibe/impact.md](../docs-site/docs/why-vibe/impact.md) | Deck slide 2, 1-pager proof column |
| [demo/contoso/customer-brief.md](../demo/contoso/customer-brief.md) | Deck slide 5, demo script, ROI grounding |

If any of those source files change materially, sanity-check the artifacts in this folder before reusing.

## Numbers you should sanity-check before the meeting

The ROI model uses placeholder inputs. If any of these are wildly different from reality, edit [roi-model.md](roi-model.md) before sharing:

- Studio 42 blended hourly rate (placeholder: **$250/hr**)
- VIBE engagements per year (placeholder: **15** in the realistic scenario)
- Average VIBE engagement deal size (placeholder: **$5M**)
- Hours of manual delivery work per engagement (uses [leadership.md](../docs-site/docs/why-vibe/leadership.md) baseline: **20+ hrs**)

Treat the ROI model as a defensible *framework*, not as gospel. The point is to anchor the conversation in numbers, not to win an audit.

## What's deliberately not here

- **Actual PowerPoint .pptx** — the deck outline is in markdown so it's editable in version control. Paste into Studio 42's deck template before presenting.
- **Diagrams as images** — each slide describes what to show; you (or a designer) render them.
- **Loom recording** — recommended as a follow-up if the harness is approved.
- **Customer-facing variants** — see "Adapting for other audiences" above.

---

Built once, reused across pitches. Improve in place — every fix here helps the next person pitching the harness.
