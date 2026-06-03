---
sidebar_position: 4
title: How to Use VIBE Day-to-Day
---

# How to Use VIBE Day-to-Day in VS Code

This page is the **"what does the UI actually look like"** companion to the conceptual docs. Read it once before your first engagement — it covers the small but critical mechanics that trip up every new facilitator: how to invoke agents, how to read the NEXT directive, and which folder each file lives in.

If you want realistic *output* from each phase, see [What to Expect](/getting-started/walkthrough). This page is about the *interaction*.

:::tip 5-minute orientation
You can follow along live by running `/vibe-demo` in a fresh engagement repo. The Contoso fixture has every artifact pre-populated so you can click through Preparation → Discover → Disrupt → Build → Deliver without a real customer.
:::

---

## The two ways to invoke a VIBE agent

VIBE responds to two distinct inputs in Copilot Chat. Both are typed into the chat input — neither requires opening a file.

| Form | Looks like | What it does | Example |
|------|-----------|-------------|---------|
| **`@VIBE <Agent Name>`** | An `@`-mention | Hands the conversation to an **orchestrator agent** that reads state.json and your filesystem and tells you what to do next | `@VIBE Engagement Lead`, `@VIBE Preparation`, `@VIBE Discover` |
| **`/vibe-<command>`** | A `/`-command | Runs a **specific prompt** that generates or updates a single deliverable | `/vibe-personas`, `/vibe-workshop-record`, `/vibe-storyboard` |

> 📷 **Screenshot needed:** `how-to-use/invocations.png` — Copilot Chat input showing an `@VIBE Engagement Lead` mention being autocompleted, and a second screenshot below showing the `/vibe-` slash command autocomplete dropdown. Side-by-side or stacked.

**Rule of thumb:** start with `@VIBE Engagement Lead` (or the phase agent) when you're not sure what's next. It'll point you at the right `/vibe-*` command via a NEXT directive.

:::warning You must be in Agent mode
VIBE prompts only appear in Copilot Chat **Agent mode**. If you type `/` and don't see `/vibe-*` in the dropdown, click the mode picker at the top of Copilot Chat and switch from Ask or Plan to Agent.
:::

---

## The NEXT directive is your single source of truth

**Every** VIBE agent response ends with a line that starts `👉 NEXT:`. That line is the single most important thing on the screen — it tells you exactly what to do next.

> 📷 **Screenshot needed:** `how-to-use/next-directive.png` — a Copilot Chat response from `@VIBE Discover` ending with a `👉 NEXT:` line **and** the handoff buttons that render below it. Crop wide enough to show both the directive text and the buttons so readers see the relationship.

NEXT directives come in four shapes. Knowing which one you're looking at tells you what to do:

| Directive shape | What it means | What you do |
|-----------------|---------------|-------------|
| `👉 NEXT: Click "🛠 Begin Preparation"` | A **handoff button** renders below the response. The label in quotes matches the button label. | Click the button below the response. |
| `👉 NEXT: Run /vibe-personas ...` | A specific prompt to invoke. | Type or autocomplete the slash command in the Copilot Chat input. |
| `👉 NEXT: Type @VIBE Preparation ...` | An orchestrator agent to invoke. | Type or autocomplete the `@`-mention in the Copilot Chat input. There is **no button** for `@`-mentions. |
| `👉 NEXT: Reply with edits, or say "looks good" to sign off` | A plain conversational reply. | Just type your reply in the chat. No command or mention needed. |

The third case (typed `@`-mention with no button) is the one that catches everyone the first time. If the directive names an `@VIBE` agent and you're hunting for a button, **stop hunting** — type the name into the chat input directly.

:::tip When in doubt, ask the orchestrator
`@VIBE Engagement Lead` works from anywhere. It reads `state.json` + every file in `engagement/<kebab>/` and recommends the single highest-leverage next step. If you've lost the thread, this is the reset button.
:::

---

## The three folders — `templates/`, `sources/`, `engagement/<kebab>/`

This is the #1 source of confusion for new facilitators. Get this mental model right and the rest of the framework clicks into place.

> 📷 **Screenshot needed:** `how-to-use/folder-structure.png` — VS Code Explorer pane (left sidebar) showing `templates/`, `sources/`, and `engagement/contoso-dispatcher-ai/` all expanded one level so the file names are visible. Crop to the Explorer pane only.

### `templates/` — scaffolds the AI reads (never edit by hand)

Templates are markdown skeletons the AI uses as a starting structure when generating a deliverable. They live at the repo root and are shared by every engagement.

**You don't fill these in.** When an agent generates personas, it reads `templates/personas.md` for the structure and writes the *populated* file to `engagement/<kebab>/personas.md`. The template stays untouched.

If you ever catch yourself typing into `templates/personas.md` — stop. You want `engagement/<kebab>/personas.md` instead. The template is a recipe; the engagement file is the dish.

### `sources/` — raw inputs you drop in

`sources/` is the dumping ground for raw customer artifacts before they're synthesized. Drop in:

- Meeting transcripts (`.vtt`, `.md`, or pasted text)
- Customer-authored briefs, RFPs, sales artifacts
- Research output from `/vibe-research` (auto-populated under `sources/research/`)
- Workshop captures from `/vibe-capture` (auto-populated under `sources/workshop/`)
- Anything else you want an agent to read

Agents read `sources/` automatically — you don't have to tell them which file to look at. Dropping a new transcript in `sources/` and re-running `@VIBE Discover` is enough.

:::warning `sources/` is committed by default
The `sources/` folder is **not gitignored**. Anything you drop in there will be committed to the engagement repo and visible to everyone with access. Only add material approved for this private engagement repo. Avoid real customer PII — use anonymized or mock data, and route customer data files through `@VIBE Data Prep` if you're unsure how to handle them.
:::

### `engagement/<kebab>/` — generated deliverables (committed, shared)

Every populated artifact lives here. This folder is what gets committed and shared with your teammates and (selectively) the customer.

| Phase | What lands here |
|-------|----------------|
| Preparation | `PROJECT-CONTEXT.md`, `engagement-brief.md`, `customer-brief.md` |
| Discover | `personas.md`, `problem-statement.md`, `current-state-journey.md`, `discovery-summary.md` |
| Disrupt | `workshop-agenda.md`, `ideation-concepts.md`, `spark-prompts.md`, `workshop-record.md`, `selected-concept.md`, `future-state-journey.md`, `storyboard.md` |
| Build | `engineering-brief.md`, `solution-design.md` |
| Deliver | `handoff-data.json` |

The `<kebab>` part is generated from your `/vibe-kickoff` inputs (e.g. `contoso-dispatcher-ai`).

### `.copilot-tracking/vibe/<kebab>/state.json` — your personal view (gitignored)

A fourth path matters but is gitignored: `state.json` tracks **your personal** view of phase progress, readiness grades, and which sources you've processed. Each teammate has their own. The orchestrator agents read `state.json` + the files in `engagement/<kebab>/` together to figure out what's next *for you*.

You almost never edit `state.json` by hand — but knowing it exists explains why two teammates running `@VIBE Engagement Lead` on the same repo can see slightly different recommendations.

:::tip After any command, check two places
1. The **status banner** at the top of the agent response (it names the active engagement, current phase, and readiness count — so you know which `<kebab>` the agent is operating on).
2. The **`engagement/<kebab>/`** folder in VS Code's Explorer pane — that's where the populated artifact should have appeared. If you don't see it there, the agent didn't write what it claimed (most often because you were in the wrong Copilot mode).
:::

---

## A complete 5-minute demo run

This is the shortest possible end-to-end run. Try it in a fresh engagement repo created from the template.

### 1. Seed the demo fixture

In Copilot Chat (Agent mode), type:

```
/vibe-demo
```

This populates `engagement/contoso-dispatcher-ai/` with the Contoso Field Services fixture and seeds `state.json` so every phase agent has realistic input.

> 📷 **Screenshot needed:** `how-to-use/demo-1-seed.png` — Copilot Chat showing the `/vibe-demo` response with the "files created" summary and the closing NEXT directive.

### 2. Ask the orchestrator what's next

```
@VIBE Engagement Lead
```

It reads `state.json` and tells you the highest-leverage next step.

> 📷 **Screenshot needed:** `how-to-use/demo-2-engagement-lead.png` — Copilot Chat showing the Engagement Lead response with the phase dashboard at the top and a NEXT directive at the bottom.

### 3. Follow the NEXT directive through each phase

From here on, just keep following each NEXT directive — clicking the handoff button when one appears, typing the named `@`-mention when one doesn't. The orchestrator hands off to the phase agent (`@VIBE Preparation` → `@VIBE Discover` → `@VIBE Disrupt` → engineer takes over for Build → `@VIBE Deliver`), each phase agent runs its prompts, and each prompt response ends with the next NEXT.

:::note Demo flow vs real engagement
In the demo fixture most artifacts are pre-seeded, so you'll mostly click through handoffs. In a real engagement, some NEXT directives ask you to type slash commands (`/vibe-personas`, `/vibe-workshop-record`), paste results back from M365 Copilot's Researcher or Spark, or simply reply with approval/edits. The shape of each directive (see the table above) tells you which.
:::

For realistic output from each step see [What to Expect](/getting-started/walkthrough) — same demo, fully transcribed.

---

## Troubleshooting common confusion

Real questions from real first runs.

### "The agent said proceed from VIBE Discover but I just ran VIBE Preparation"

The orchestrator doesn't remember prior chat turns. It derives progress from `state.json` plus the files on disk in `engagement/<kebab>/`. If state.json says Discover is in progress (perhaps from an earlier session or another teammate), it'll suggest proceeding from there.

To get the orchestrator's recommendation back in sync:

1. Re-run `@VIBE Engagement Lead` — it reconciles `state.json` against the actual files in `engagement/<kebab>/` and re-derives "what's next".
2. If the recommendation still seems wrong, run `/vibe-doctor` — it does a deeper health check and surfaces the single highest-value next action.
3. As a last resort, delete `.copilot-tracking/vibe/<kebab>/state.json` (it's per-user and gitignored — your committed work in `engagement/<kebab>/` is safe) and let `@VIBE Engagement Lead` rebuild it from your filesystem.

### "The NEXT directive said `@VIBE Preparation` but there was no button"

`@`-mentions are **typed inputs, not buttons**. Click into the Copilot Chat input, type `@VIBE Preparation`, hit `Enter`. Only the handoff actions named in quotes (e.g. `Click "🛠 Begin Preparation"`) render as buttons — `@`-mentions and `/`-commands are always typed.

### "I typed into `templates/personas.md` and the agent didn't see my edits"

That's expected. Templates are AI scaffolds — agents read them for structure but write *populated* files to `engagement/<kebab>/`. Your edits to a template don't show up anywhere downstream.

Fix: move your edits into `engagement/<kebab>/personas.md`. Or — better — drop the underlying sources (e.g. a transcript) into `sources/` and let the agent regenerate.

### "Nothing happened even though the agent said it did something"

Two common causes:

1. **Wrong Copilot mode** — VIBE only works in Agent mode. Check the mode picker at the top of Copilot Chat and switch from Ask or Plan.
2. **Multiple engagements in one repo** — if you have several `engagement/<kebab>/` folders, the agent may have written to a different one than you expected. Pass `engagement="..."` explicitly on `/vibe-*` prompts to disambiguate, or rely on the orchestrator (which always names the active engagement at the top of its response).

### "The agent ran the post-workshop prompts in the wrong order"

That was a real bug, fixed in PR #14. Post-workshop order is now **strict**: `/vibe-workshop-record` → `/vibe-selected-concept` → `/vibe-future-journey` → `/vibe-storyboard`. If you see the orchestrator suggesting `/vibe-storyboard` before `/vibe-future-journey` on a current version, file an issue.

---

## What to read next

- [Your First Engagement](/getting-started/first-engagement) — full step-by-step for running an engagement from scratch
- [What to Expect](/getting-started/walkthrough) — realistic agent output from each phase, against the same Contoso demo fixture
- [Role Guides](/getting-started/roles) — which surfaces and prompts each role on the squad uses
- [The Five Phases](/phases/preparation) — deep dives on each phase
