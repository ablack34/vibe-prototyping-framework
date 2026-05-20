# Pitch Deck Outline — VIBE Prototyping Framework

**Audience:** Studio 42 / ISE leadership
**Format:** 10-15 min live presentation, no demo
**Goal:** Approve a 3-engagement pilot

---

## How to use this

This is a **deck outline**, not a finished deck. Each slide has:

- **Title** — what goes at the top
- **What to show** — bullets / visuals for the slide body
- **What to say** — speaker notes (the actual narrative)
- **Time** — target time on this slide

Paste the bullets into Studio 42's deck template. The speaker notes are for *you*, not for the slide.

**Total target: 12 minutes of presenting + 3 minutes Q&A buffer.**

---

## Slide 1 — The shift (1 min)

**Title:** *"Prototyping that scales"*

**What to show:**
- Studio 42 logo / branding
- Subtitle: "Agents do the paperwork. Humans facilitate."
- One line: "A repeatable, AI-powered engagement framework"

**What to say:**
> "I'm going to spend 10 minutes showing you how Studio 42 prototyping changes if we treat the AI as the documenter, not the prototype itself. The ask at the end is small — approve a 3-engagement pilot — but the change in how we work is significant."

**Don't:** Open with a feature list. Open with the outcome.

---

## Slide 2 — Where Studio 42 time goes today (1.5 min)

**Title:** *"The problem isn't the prototypes. It's everything around them."*

**What to show:**
A simple chart or four big numbers:
- **20+ hrs** — manual documentation per engagement
- **40%** — of engagement time spent on docs, not delivery
- **0%** — reuse between engagements
- **1** — person (the engineer) who can build the prototype

**What to say:**
> "We already prototype well — Siemens, Novartis, Coca-Cola Hellenic. The output is good. The cost of producing it is the problem. Roughly 40% of every engagement disappears into meeting notes, discovery write-ups, ideation summaries, handoff decks. None of that compounds. Every new engagement starts from scratch."

**Don't:** Apologize for current quality. The work is good; the cost is wrong.

---

## Slide 3 — What VIBE changes (1.5 min)

**Title:** *"5 phases. 3 of them now run without an engineer."*

**What to show:**
The 5-phase strip with role labels:
```
Discover → Disrupt → Ideate → Build → Deliver
[TPM]     [TPM]     [Anyone] [Engineer] [Anyone]
```
Subtitle: "AI agents do the paperwork. Delivery person facilitates."

**What to say:**
> "The framework codifies our methodology into AI agents that run inside VS Code. The delivery person facilitates workshops and captures sources — transcripts, customer documents, questionnaires. The AI does the synthesis, documentation, ideation, and handoff. 3 of the 5 phases can now run without an engineer in the room — which means engineers spend their time on the prototype, not the paperwork."

**Don't:** Walk every phase in detail. They have the 1-pager for that.

---

## Slide 4 — "But we already prototype" (2.5 min) ⭐ CRITICAL SLIDE

**Title:** *"What's actually different?"*

**What to show:**
Three columns:

| Today | With VIBE |
|-------|-----------|
| Quality varies by who's on the squad | Best practices encoded in agents |
| "Let's build a dashboard" (default form factor) | Multi-form-factor exploration is structural |
| Handoff is a slide deck | Handoff is `handoff-data.json` with source-cited claims |

**What to say:**
> "This is the question I'd ask if I were you. Three things are genuinely different.
> 
> *One — quality is process-dependent, not person-dependent.* A junior TPM with the framework produces the same artifacts as a senior one. The best practices aren't in someone's head anymore — they're in the agents.
> 
> *Two — form-factor exploration is structural.* Today, our default answer is 'another web dashboard.' The framework forces explicit evaluation of agentic, conversational, Copilot extension, and low-code paths every time. We stop building the same prototype shape over and over.
> 
> *Three — the handoff is a machine-readable package, not a deck.* Every claim in the handoff cross-references its source. No more 'the prototype was great but we lost the context.'"

**Don't:** Get defensive about today's work. Frame it as the next iteration of what's already good.

**Anticipate:** "Doesn't this just slow people down with process?" → "It's the opposite — the agents *are* the process. You type one command instead of writing the document."

---

## Slide 5 — Contoso in action (1.5 min)

**Title:** *"This works end-to-end today."*

**What to show:**
- Screenshot of the docs site (or Contoso `customer-brief.md`) showing the €12M scenario
- Inset: list of artifacts the demo produces (`PROJECT-CONTEXT.md`, `requirements-summary.md`, `selected-concept.md`, `engineering-brief.md`, scaffold code, `handoff-data.json`)

**What to say:**
> "There's a Contoso Field Services fixture in the framework — €12M addressable customer pain, three CSV datasets, a 4-week pilot brief. Type `/vibe-demo`, hit enter, and you walk every phase of the framework against a fully-formed scenario. I'm not asking you to take this on faith — anyone in this room can run it in 15 minutes. I'd love to walk you through it after this meeting."

**Don't:** Switch to a live demo. Save it for the follow-up.

---

## Slide 6 — Track record (1 min)

**Title:** *"This codifies what already worked."*

**What to show:**
Three logos with one-line outcomes:
- **Siemens Healthineers** — $19M deal · $140M 5yr consumption · "S42 was instrumental"
- **Coca-Cola Hellenic** — Live workshop prototyping, Athens
- **Novartis** — Synthetic audience personas, AI-native concept testing

**What to say:**
> "Worth being clear: this isn't a speculative bet. The framework codifies patterns from the engagements that already worked — Siemens' high-stakes design discipline, Coca-Cola's live-workshop iteration, Novartis' AI-native concept exploration. We're not inventing new methodology; we're making the existing methodology repeatable and faster."

**Don't:** Overclaim. The deals weren't won *by* the framework — the framework codifies the patterns that won them.

---

## Slide 7 — The economics (1 min)

**Title:** *"Conservative case pays for itself if 1 of 3 pilots succeeds."*

**What to show:**
A simplified version of the ROI table (full version in [roi-model.md](roi-model.md)):

| | Conservative | Realistic | Optimistic |
|---|---|---|---|
| Hours saved / yr | 200 | 600 | 1,200 |
| $ saved / yr | $40K | $150K | $360K |
| Pipeline lift | $0 | $250K | $500K |
| **Total / yr** | **$40K** | **$400K** | **$860K** |

**What to say:**
> "I'm not going to pretend the numbers are bulletproof — they depend on engagement volume and what we count as a deal-velocity lift. The point isn't the exact figure. The point is: even in the conservative case, where we assume no deal-velocity impact at all and just count Studio 42 hours saved, the framework pays for itself if 1 of 3 pilots succeeds. The full math is in the ROI doc — happy to walk through it after."

**Don't:** Defend every assumption from the slide. Refer them to the model.

---

## Slide 8 — What "good" looks like (1.5 min)

**Title:** *"Three squad scenarios after VIBE"*

**What to show:**
Three short scenarios:

> **TPM on a new engagement** — Day 1: kickoff transcript in, `PROJECT-CONTEXT.md` out by lunch. Day 3: validated concept selected. Day 5: engineering brief handed off.

> **Engineer on a Build phase** — Receives a structured brief with screen specs and data mapping, not a verbal "figure it out." Spends Day 1 building, not interviewing.

> **Squad lead at handoff** — `handoff-data.json` validates internally before the customer sees it. Roadmap, backlog, limitations, vision — every claim source-cited.

**What to say:**
> "What does this actually look like in a squad's week? Three short scenarios. The throughline is: more time on the parts that need human judgment, less time on the parts that don't."

**Don't:** Promise speed without quality. Lead with quality, let speed follow.

---

## Slide 9 — The pilot (1.5 min)

**Title:** *"3 engagements. 8-12 weeks. 3 metrics."*

**What to show:**
```
THE ASK
└── Approve a 3-engagement pilot on next qualifying Studio 42 engagements

DURATION
└── 8-12 weeks (sequential with overlap)

COST
└── $0 — engagements are happening anyway

EXIT CRITERIA
├── Time-to-first-prototype < 5 days
├── Customer NPS ≥ 8
└── Squad lead would use again

DECISION POINT
├── 2 of 3 hit → recommend default adoption
└── Otherwise → cheap learning, framework retired or rebuilt
```

**What to say:**
> "Concrete ask: approve a 3-engagement pilot. Three engagements that are happening anyway. Eight to twelve weeks to run them. Three exit criteria, agreed up front, measured at the end. If 2 of 3 hit, I come back recommending default adoption across Studio 42. If they don't, we've spent zero incremental dollars and we know."

**Don't:** Soften the ask. Be specific about what "yes" means.

---

## Slide 10 — Decisions we need from you (1 min)

**Title:** *"What I need today"*

**What to show:**
```
1. ✅  Approve the 3-engagement pilot
2. 🎯  Help me identify the first 3 candidate engagements
3. 📣  Endorse it openly — squad leads need air cover to try it
```

**What to say:**
> "Three things from you. One: approve the pilot. Two: help me pick the first 3 candidate engagements — I want ones that represent the range of what we do, not just easy wins. Three: endorse it openly. Squad leads need to know it's safe to try something new mid-engagement. That's it."

**Don't:** End on a feature recap. End on the explicit ask.

---

## Appendix slides (have ready, don't show unless asked)

- **Architecture overview** — what's in `.github/`, how agents are wired, where state lives
- **The 14 prompts and 7 agents** — list with one-line descriptions (from [docs site reference](../docs-site/docs/reference/prompts.md))
- **HVE alignment** — task pipeline, evidence-based decisions, opinionated prompts (from [impact.md](../docs-site/docs/why-vibe/impact.md))
- **Risk register** — what could go wrong in pilot and how it's mitigated (see [demo-script.md](demo-script.md) Q&A section for objection handlers)
- **Comparison: VIBE vs incumbent SI approach** — 4-week prototype vs 9-month roadmap PDF (from Contoso scenario)

---

## Timing budget

| Slide | Target | Cumulative |
|-------|--------|-----------|
| 1 — The shift | 1:00 | 1:00 |
| 2 — Time today | 1:30 | 2:30 |
| 3 — What changes | 1:30 | 4:00 |
| 4 — Differentiation ⭐ | 2:30 | 6:30 |
| 5 — Contoso | 1:30 | 8:00 |
| 6 — Track record | 1:00 | 9:00 |
| 7 — Economics | 1:00 | 10:00 |
| 8 — What good looks like | 1:30 | 11:30 |
| 9 — The pilot | 1:30 | 13:00 |
| 10 — Decisions | 1:00 | 14:00 |
| Q&A buffer | 1:00 | 15:00 |

If you're tight on time, the cuts in priority order are: slide 8 → slide 6 → slide 5. **Never cut slide 4** — it's the answer to the most likely objection.

---

## Final sanity check before the meeting

- [ ] Numbers in slides 2, 6, 7 sanity-checked against [roi-model.md](roi-model.md) and source docs
- [ ] Demo confirmed runnable (`/vibe-demo` on a fresh clone) in case anyone asks to see it
- [ ] 1-pager sent as pre-read 24-48hrs before
- [ ] Identified 3 candidate engagements so you can answer "which ones?" in the room
- [ ] Practiced slide 4 out loud at least twice
