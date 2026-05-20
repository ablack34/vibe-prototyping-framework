# Live Demo Script — VIBE Prototyping Framework

**Audience:** Studio 42 / ISE leadership (follow-up after the main pitch)
**Format:** 15-min live demo on your laptop
**Goal:** Make the framework tangible. Show that "agents do the paperwork" is real, not aspirational.

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
> Their incumbent SI quoted 9 months for a roadmap PDF. The CIO wants something tangible in 4 weeks. That's the engagement.
>
> What I'm going to do is walk this engagement from raw customer brief to engineering-ready prototype concept — in about 12 minutes. I'm not going to skip steps, but I will skip some of the in-between commentary."

**Why this works:** Establishes stakes. €12M, 4-week deadline, beat the incumbent. Anyone in the room understands those numbers.

---

### 2:00-3:30 — Seed the engagement

**Type in Copilot Chat:**
```
/vibe-demo
```

**Wait** for the agent to confirm. When it asks "ok to proceed?" → "yes".

**Say (while it runs):**
> "One command. The agent's copying the Contoso fixture into `sources/` — that's the customer brief I just showed you, two questionnaires, two transcripts, three CSV files. It's also pre-filling `PROJECT-CONTEXT.md` with the customer details and creating the engagement folder structure. This is the equivalent of about 90 minutes of setup that a TPM would normally do by hand before they can even start."

**Show when done:** The `sources/` folder populated, `templates/PROJECT-CONTEXT.md` with Sandra Holtz / Matthias Köhler filled in.

---

### 3:30-6:00 — Run Discover

**Click** the **🔍 Start Discovery** button the agent presents (or type `/vibe-discover`).

**Say (while it runs):**
> "Now the Discover agent is reading every source — the brief, the questionnaires, both Teams transcripts. It's extracting the problem statement, stakeholder map, success metrics, constraints. Watch the quality grading column on the right — every field gets an A/B/C grade based on how strongly the source material supports it. If something's a C, the agent flags it for the TPM to clarify with the customer.
>
> This is the part where TPMs today spend 4-6 hours synthesizing notes. The framework does it in about 90 seconds, and every claim is source-cited so you can verify."

**Show when done:** The generated [`engagement/contoso-dispatcher-ai/PROJECT-CONTEXT.md`](../engagement/) — point at the source citations and the A/B/C grading.

**Pause for questions.** This is usually where someone asks "but does it hallucinate?" — answer: "yes, AI can. That's why every field is graded and source-cited. A C-grade field is a flag for the TPM to ask the customer, not something we trust at face value."

---

### 6:00-9:00 — Run Disrupt + Ideate

**Click** the **🎯 Frame Disruption** button → wait for completion → click **💡 Ideate Concepts**.

**Say (while they run):**
> "Disrupt frames the $50K-vs-$50M question — what's the smallest valuable thing we could build, what's the most ambitious. Generates `requirements-summary.md`.
>
> Then Ideate brainstorms 2-3 prototype concepts across form factors. This is the slide-4 thing from the pitch — we don't default to 'another web dashboard.' Watch what it generates: it'll evaluate web, agentic, conversational, Copilot extension, and low-code paths for the Contoso problem. For dispatch, the answer is probably web + an agent — but the framework forces the explicit consideration."

**Show when done:**
- [`engagement/contoso-dispatcher-ai/requirements-summary.md`](../engagement/) — prioritized use cases
- [`engagement/contoso-dispatcher-ai/ideation-concepts.md`](../engagement/) — the multi-form-factor evaluation
- [`engagement/contoso-dispatcher-ai/selected-concept.md`](../engagement/) — the recommended concept with rationale
- [`engagement/contoso-dispatcher-ai/engineering-brief.md`](../engagement/) — the handoff to the engineer

**Highlight the engineering brief:**
> "This is what changes the Build phase. Today, an engineer joins an engagement and has to interview the TPM to extract what's already in everyone else's heads. Now they get this: validated concept, screen specs, data mapping, success criteria. They start building on Day 1, not Day 3."

---

### 9:00-12:00 — Show Deliver + handoff package

**Show:** Either run `/vibe-handoff` if you have time, or jump to a pre-baked example of `handoff-data.json` from a prior demo run.

**Say:**
> "Final piece. The Deliver phase generates `handoff-data.json` — a single source of truth for the customer handoff. Vision, roadmap, backlog (Epics/Features/Stories), known limitations, demo notes. Every claim cross-references back to its source artifact. If the vision says 'reduce dispatcher decision time from 6 min to 60s,' that traces back to the Sandra Holtz quote in the kickoff transcript.
>
> Today, the handoff is a slide deck the TPM stays up late writing. Tomorrow, it's a validated package that the agent has already checked for consistency before the customer sees it."

---

### 12:00-15:00 — What you just saw + the ask

**Switch to:** A blank chat or a slide

**Say:**
> "What you just saw — Discover, Disrupt, Ideate, engineering brief, handoff package — would normally take a Studio 42 squad somewhere between 5 and 10 working days. We did it in 12 minutes against a fully-formed fixture. Real engagements are messier, obviously — customers don't hand you perfect questionnaires. But the framework does the synthesis work in real time. The squad's job becomes facilitation and judgment, not paperwork.
>
> The ask is the same as in the deck: 3 engagements, 8-12 weeks, three exit criteria. If 2 of 3 hit, I come back recommending default adoption. If they don't, we know cheaply.
>
> Questions?"

---

## Likely questions + answers

### "How do you know the AI is right?"
> "Every field is graded A/B/C based on source support. Every claim cites a source. The TPM reviews — the agent never finalizes anything without human approval. It's faster, not unsupervised."

### "What about hallucinations?"
> "Same answer. Hallucinations happen when AI generates from no source. The framework forces source-grounding. If the source material doesn't support a claim, the field is graded C and flagged for clarification, not invented."

### "Doesn't this slow people down with process?"
> "It's the opposite. The agents *are* the process. You type one command instead of writing the document. The 'process' is one keystroke."

### "What if a TPM hates it?"
> "That's literally one of the pilot exit criteria — 'squad lead would use again.' If TPMs hate it, that's a fail signal and we rebuild or retire."

### "Can the framework handle [specific weird engagement type]?"
> "Honest answer: I don't know yet. That's why the pilot is 3 engagements that *represent the range* of what we do, not 3 easy wins. Help me pick the right 3."

### "What's the maintenance cost?"
> "Roughly equivalent to maintaining any other internal tool — bug fixes, occasional new agent or prompt. Improvements compound: every engagement that uses it surfaces an improvement that helps the next one."

### "Who owns the framework after the pilot?"
> "If we adopt it, that's the next conversation — ideally a part-time owner from Studio 42 ops. Today it's me. I'm not asking for a headcount decision today; I'm asking for permission to gather the data that will inform that decision."

### "Can a customer see we used AI to write their docs?"
> "If they look at the artifacts, yes — they're machine-generated. But they're also reviewed and approved by humans before anything leaves Studio 42. We've been doing this with code for a year; this just extends the pattern to engagement artifacts."

---

## Demo recovery plan

Things that can go wrong and how to recover:

| Problem | Recovery |
|---------|----------|
| Copilot is slow / hangs | "Let me skip ahead — here's what it would have produced" — switch to a pre-baked engagement folder from an earlier demo run |
| Network drops | Same — pre-baked engagement folder. Always have one ready in a sibling directory. |
| Agent gives an unexpected output | "Interesting — let me note that as feedback. The point of pilots is to find exactly this kind of thing." Then keep moving. |
| Someone asks a question you can't answer | "Honest answer: I don't know. Let me find out and follow up." Don't bluff. |
| You realize you forgot to reset state | Apologize quickly, run the reset commands from [README.md](README.md), restart |

**Always have:** A sibling folder named something like `vibe-demo-backup/` with a fully-completed engagement, so you can fall back to showing artifacts if any live command misbehaves.

---

## After the demo

- Send the [executive-1-pager.md](executive-1-pager.md) again as a thank-you note within 4 hours
- Capture any objections raised that aren't in this script and add them to "Likely questions" above
- If someone asks for the deck, send the [pitch-deck-outline.md](pitch-deck-outline.md) — or, better, the rendered PowerPoint if you've built it
- If they say yes to the pilot: schedule a 30-min follow-up within the week to pick the 3 candidate engagements
