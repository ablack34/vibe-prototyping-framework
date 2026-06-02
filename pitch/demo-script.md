# Live Demo Script — VIBE Delivery Harness

**Audience:** Studio 42 / ISE leadership (follow-up after the main pitch)
**Format:** 15-min live demo on your laptop
**Goal:** Make the harness tangible. Show that "agents do the paperwork" is real, not aspirational.

**Framing note:** This demo is *not* selling VIBE — VIBE is Studio 42's existing AI-first consulting offering. This demo shows what changes when a VIBE engagement is delivered through the harness.

---

## Pre-demo checklist (do these 10 min before)

- [ ] Fresh clone of `vibe-prototyping-framework` open in VS Code (no prior engagement state)
- [ ] Copilot Chat open in Agent mode, panel docked right
- [ ] [https://wonderful-flower-0a2a87e03.7.azurestaticapps.net](https://wonderful-flower-0a2a87e03.7.azurestaticapps.net) open in a browser tab
- [ ] [demo/contoso/customer-brief.md](../demo/contoso/customer-brief.md) open in a second VS Code tab
- [ ] Screen at a presentable zoom (Ctrl+= twice from default)
- [ ] Notifications muted, calendar reminders snoozed
- [ ] Phone face-down

If you're presenting remotely, share the VS Code window only — not the full desktop. Less distracting.

---

## The script

### 0:00-2:00 — Frame the scenario

**Show:** [demo/contoso/customer-brief.md](../demo/contoso/customer-brief.md) (the Contoso brief) in VS Code

**Say:**
> "Quick scenario. Contoso Field Services — HVAC company across EMEA, 280 technicians, 14 dispatchers in Warsaw matching ~180 work orders a day to the right tech using a 2008 ASP.NET system. SLA breaches cost them €4M in penalties last year, another €6M in lost renewals. Total addressable pain: roughly €12M annually.
>
> Their incumbent SI quoted 9 months for a roadmap PDF. The CIO wants something tangible in 4 weeks. This is a fairly typical VIBE engagement scenario.
>
> What I'm going to do is run this VIBE engagement through the harness — from raw customer brief to engineering-ready prototype concept — in about 12 minutes. The harness does what we already do, just faster and more consistently."

**Why this works:** Establishes stakes. €12M, 4-week deadline, beat the incumbent — anyone in the room understands those numbers. Positions VIBE as the existing offering and the harness as the accelerator.

---

### 2:00-3:30 — Seed the engagement

**Type in Copilot Chat:**
```
/vibe-demo
```

**Wait** for the agent to confirm. When it asks "ok to proceed?" → "yes".

**Say (while it runs):**
> "One command. The harness is copying the Contoso fixture into `sources/` — the customer brief, two questionnaires, two transcripts, three CSV files. It's also pre-filling `PROJECT-CONTEXT.md` with the customer details and creating the engagement folder structure. This is the equivalent of about 90 minutes of setup that a TPM would normally do by hand before they can even start the engagement."

**Show when done:** The `sources/` folder populated, `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` with Sandra Holtz / Matthias Köhler filled in.

---

### 3:30-6:00 — Run Discover

**Click** the **🔍 Start Discovery** button the agent presents (or type `@VIBE Discover`).

**Say (while it runs):**
> "Now the Discover agent is reading every source — the brief, the questionnaires, both Teams transcripts. It's extracting the problem statement, stakeholder map, success metrics, constraints. Watch the quality grading column on the right — every field gets an A/B/C grade based on how strongly the source material supports it. If something's a C, the agent flags it for the TPM to clarify with the customer.
>
> This is the part where TPMs today spend 4-6 hours synthesizing notes. The harness does it in about 90 seconds, and every claim is source-cited so the TPM can verify. The TPM still owns the output — they just don't write it from scratch."

**Show when done:** The generated [`engagement/contoso-dispatcher-ai/PROJECT-CONTEXT.md`](../engagement/) — point at the source citations and the A/B/C grading.

**Pause for questions.** This is usually where someone asks "but does it hallucinate?" — answer: "yes, AI can. That's why every field is graded and source-cited. A C-grade field is a flag for the TPM to ask the customer, not something we trust at face value."

---

### 6:00-9:00 — Run Define + Ideate

**Click** the **🎯 Frame the Problem** button → wait for completion → click **💡 Ideate Concepts**.

**Say (while they run):**
> "Define frames the $50K-vs-$50M question — what's the smallest valuable thing we could build, what's the most ambitious. Generates `requirements-summary.md`.
>
> Then Ideate brainstorms 2-3 prototype concepts across form factors. This is the consistency thing from slide 4 of the deck — without the harness, our default ideation answer drifts toward 'another web dashboard.' With the harness, every engagement explicitly evaluates web, agentic, conversational, Copilot extension, and low-code paths. For dispatch, the answer is probably web + an agent — but the harness forces the explicit consideration every time, on every engagement."

**Show when done:**
- [`engagement/contoso-dispatcher-ai/requirements-summary.md`](../engagement/) — prioritized use cases
- [`engagement/contoso-dispatcher-ai/ideation-concepts.md`](../engagement/) — the multi-form-factor evaluation
- [`engagement/contoso-dispatcher-ai/selected-concept.md`](../engagement/) — the recommended concept with rationale
- [`engagement/contoso-dispatcher-ai/engineering-brief.md`](../engagement/) — the handoff to the engineer

**Highlight the engineering brief:**
> "This is what changes the Build phase. Today, an engineer joins a VIBE engagement and has to interview the TPM to extract what's already in everyone else's heads. With the harness, they get this on Day 1: validated concept, screen specs, data mapping, success criteria. They start building immediately. Engineer time becomes prototype time."

---

### 9:00-12:00 — Show Deliver + handoff package

**Show:** Either run `/vibe-handoff` if you have time, or jump to a pre-baked example of `handoff-data.json` from a prior demo run.

**Say:**
> "Final piece. The Deliver phase generates `handoff-data.json` — a single source of truth for the customer handoff. Vision, roadmap, backlog (Epics/Features/Stories), known limitations, demo notes. Every claim cross-references back to its source artifact. If the vision says 'reduce dispatcher decision time from 6 min to 60s,' that traces back to the Sandra Holtz quote in the kickoff transcript.
>
> Today, the VIBE handoff is a slide deck the TPM stays up late writing. With the harness, it's a validated package the agents have already checked for consistency before the customer sees it. Same VIBE artifact, lower delivery cost, higher quality floor."

---

### 12:00-15:00 — What you just saw + the ask

**Switch to:** A blank chat or a slide

**Say:**
> "What you just saw — Discover, Define, Ideate, engineering brief, handoff package — is what a Studio 42 team delivers on every VIBE engagement today. Normally it takes somewhere between 5 and 10 working days. The harness did it in 12 minutes against a fully-formed fixture. Real engagements are messier — customers don't hand you perfect questionnaires. But the harness does the synthesis work in real time. The team's job becomes facilitation and judgment, not paperwork.
>
> The ask is the same as in the deck: adopt the harness as default tooling on the next 3 VIBE engagements. After the third, we either formalize it as standard Studio 42 tooling or iterate based on what we learn.
>
> Questions?"

---

## Likely questions + answers

### "How do you know the AI is right?"
> "Every field is graded A/B/C based on source support. Every claim cites a source. The TPM reviews — the harness never finalizes anything without human approval. It's faster, not unsupervised."

### "What about hallucinations?"
> "Same answer. Hallucinations happen when AI generates from no source. The harness forces source-grounding. If the source material doesn't support a claim, the field is graded C and flagged for clarification, not invented."

### "Doesn't this slow people down with process?"
> "It's the opposite. The harness *is* the process. You type one command instead of writing the document. The 'process' is one keystroke."

### "What if a TPM hates it?"
> "That's literally one of the adoption success metrics — 'lead would use again.' If TPMs hate it, that's a fail signal and we rebuild or retire."

### "Can the harness handle [specific weird engagement type]?"
> "Honest answer: I don't know yet. That's why the 3 adoption engagements *represent the range* of what we do, not 3 easy wins. Help me pick the right 3."

### "What's the maintenance cost?"
> "Roughly equivalent to maintaining any other internal tool — bug fixes, occasional new agent or prompt. Improvements compound: every engagement that uses it surfaces an improvement that helps the next one."

### "Who owns the harness after adoption?"
> "If we formalize it, that's the next conversation — ideally a part-time owner from Studio 42 ops. Today it's me. I'm not asking for a headcount decision today; I'm asking for permission to gather the data that will inform that decision."

### "Can a customer see we used AI to write their docs?"
> "If they look at the artifacts, yes — they're machine-generated. But they're also reviewed and approved by humans before anything leaves Studio 42. We've been doing this with code for a year; the harness just extends the pattern to engagement artifacts."

### "Isn't this just rebranding existing prompts?"
> "It's more than prompts — it's prompts + specialized agents + templates + validation gates, wired together into an executable workflow. The point is the integration. The harness is the difference between 'we have some useful prompts' and 'a junior TPM can deliver a Siemens-standard engagement.'"

### "Why not just give the prompts to teams and let them use them as they want?"
> "Optional tooling becomes nobody's tooling. The harness only delivers value when it's the default — that's what makes quality process-dependent instead of person-dependent. That's the whole point of the ask."

---

## Demo recovery plan

Things that can go wrong and how to recover:

| Problem | Recovery |
|---------|----------|
| Copilot is slow / hangs | "Let me skip ahead — here's what the harness would have produced" — switch to a pre-baked engagement folder from an earlier demo run |
| Network drops | Same — pre-baked engagement folder. Always have one ready in a sibling directory. |
| Agent gives an unexpected output | "Interesting — let me note that as feedback. The point of the adoption period is to find exactly this kind of thing." Then keep moving. |
| Someone asks a question you can't answer | "Honest answer: I don't know. Let me find out and follow up." Don't bluff. |
| You realize you forgot to reset state | Apologize quickly, run the reset commands from [README.md](README.md), restart |

**Always have:** A sibling folder named something like `vibe-demo-backup/` with a fully-completed engagement, so you can fall back to showing artifacts if any live command misbehaves.

---

## After the demo

- Send the [executive-1-pager.md](executive-1-pager.md) again as a thank-you note within 4 hours
- Capture any objections raised that aren't in this script and add them to "Likely questions" above
- If someone asks for the deck, send the [pitch-deck-outline.md](pitch-deck-outline.md) — or, better, the rendered PowerPoint if you've built it
- If they approve adoption: schedule a 30-min follow-up within the week to pick the 3 candidate VIBE engagements
