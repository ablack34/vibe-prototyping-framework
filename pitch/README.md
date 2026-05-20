# Pitch Package — VIBE Prototyping Framework

Materials for pitching the VIBE Prototyping Framework to leadership.

## What's in here

| File | What it's for | When you use it |
|------|---------------|-----------------|
| [executive-1-pager.md](executive-1-pager.md) | Single-page summary — problem, shift, proof, ask | Pre-read before the meeting; leave-behind after |
| [pitch-deck-outline.md](pitch-deck-outline.md) | 10-slide deck outline with bullets + speaker notes | The actual 10-15 min meeting |
| [roi-model.md](roi-model.md) | Conservative / Realistic / Optimistic ROI scenarios | When someone asks "show me the numbers" |
| [demo-script.md](demo-script.md) | 15-min live demo walkthrough | Follow-up meeting when SLT says "can we see it?" |

## Suggested sequence

1. **48 hours before the meeting** — Send the 1-pager as a pre-read attached to the calendar invite
2. **In the meeting (10-15 min)** — Walk the deck outline (don't read the slides — talk to them)
3. **Q&A** — Have the ROI model open and ready to share
4. **Follow-up** — Offer the 15-min live demo as the next step for anyone who wants to see it work

## Adapting for other audiences

Different rooms need different framing. The core material is the same; the emphasis shifts.

| Audience | Lead with | De-emphasize |
|----------|-----------|--------------|
| **Studio 42 / ISE leadership** (current default) | Differentiation vs. existing prototyping, repeatability, scale | Customer-side ROI math |
| **Microsoft field/sales leadership** | Deal velocity, pipeline impact, win-rate differentiation | Internal Studio 42 operations |
| **A specific customer's exec team** | Their problem statement, prototype-in-weeks-not-months, regulatory urgency | Studio 42 internal mechanics, hourly rates |
| **Squad leads / TPMs** | "You can drive 3 of 5 phases without an engineer" | ROI, ask, pilot framing |

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
- Engagements per year (placeholder: **15** in the realistic scenario)
- Average Studio 42 engagement deal size (placeholder: **$5M**)
- Hours of manual docs per engagement (uses the existing leadership.md figure: **20+ hrs**, scaled to 40 hrs for the realistic case)

Treat the ROI model as a defensible *framework*, not as gospel. The point is to anchor the conversation in numbers, not to win an audit.

## What's deliberately not here

- **Actual PowerPoint .pptx** — the deck outline is in markdown so it's editable in version control. Paste into Studio 42's deck template before presenting.
- **Diagrams as images** — each slide describes what to show; you (or a designer) render them.
- **Loom recording** — recommended as a follow-up if the pilot is approved.
- **Customer-facing variants** — see "Adapting for other audiences" above.

---

Built once, reused across pitches. Improve in place — every fix here helps the next person pitching VIBE.
