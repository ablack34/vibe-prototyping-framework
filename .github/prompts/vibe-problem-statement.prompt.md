---
description: "Produce the formal Josephine-structured problem statement — Discover deliverable (Wk 1)"
agent: "VIBE Discover"
argument-hint: "[engagement=...]"
---

# VIBE Problem Statement

Produce `engagement/{{engagement-kebab}}/problem-statement.md` — one of the three required Discover deliverables. The structure is **fixed**: *"I am [target user] / I'm trying to [objective] / But [challenges] / Because [why challenges exist] / which results in [financial or emotional impact]."*

This is the framing the entire Disrupt workshop pivots around. It must sound like the customer, be sourced to evidence, and be customer-signed-off before the workshop.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## Requirements

### Step 1 — Read all sources

- `templates/PROJECT-CONTEXT.md` (especially Section 3 Problem Statement — has the kickoff seed)
- `templates/customer-brief.md` (the customer's voice — language to mirror)
- `engagement/{{engagement-kebab}}/personas.md` (the primary persona is the "I am")
- Every transcript in `sources/` (look for pain quotes, impact mentions, root-cause statements)
- `sources/questionnaire-responses.md` (especially impact / "why does this matter" questions)
- `sources/research/research-summary.md` (industry benchmarks for impact figures)
- Any prior `engagement/{{engagement-kebab}}/problem-statement.md` (preserve signed-off version)

### Step 2 — Identify the primary persona

The "I am" line names the persona whose pain drives the prototype. This should be the **primary persona** from `personas.md`. If there is no clear primary persona, fall back to the persona with the most source backing.

If multiple personas have meaningfully different problem statements, capture the alternates in the `## Variations considered` section of the same file rather than splitting into per-persona files. The canonical filename is always `problem-statement.md` — the state.json schema, doctor checks, Define inputs, and Discover gate all expect that single file.

### Step 3 — Fill all 5 blanks from sources

Copy `templates/problem-statement.md` to `engagement/{{engagement-kebab}}/problem-statement.md`. For each blank:

- **I am [target user]** — name the persona AND their role: "a Contoso emergency-call dispatcher", not just "a user". Source: persona file.
- **I'm trying to [objective]** — the job-to-be-done in active voice. "assign the right technician to each emergency call within SLA". Source: transcripts / questionnaire / persona JTBD.
- **But [challenges]** — the concrete blocker, in plain language. "I can't see which technicians have the parts and skills needed in real time". Source: transcripts / persona pains.
- **Because [why challenges exist]** — the root cause. "our dispatch tool only shows location, and SAP/Excel inventory is updated nightly". Source: PROJECT-CONTEXT.md Section 5 (Current State) / transcripts.
- **Which results in [financial or emotional impact]** — quantified where possible. "30% of jobs require a second visit, costing $1.2M annual overtime and damaging customer trust". Source: questionnaire / transcripts / research-summary.md.

Critical rules:

- **Quote directly when possible** — if the customer said "we get yelled at by customers" in a transcript, use that line with `[quoted from transcript-kickoff.md, 11:42]`
- **No solutioning** — the problem statement describes the problem, not the answer. Don't say "but I don't have an AI dispatcher" — say "but I can't see what's available in real time"
- **No consulting-speak** — "synergies", "leverage", "optimize" — strip them out
- **Quantify the impact when you can** — $X cost, Y% rework, Z minutes per call. If only an emotional impact is sourced (e.g. "customers get angry"), use that and mark it `[emotional impact — no quantified $ figure yet]`

### Step 4 — Fill the Source Evidence table

Every blank must have at least one row in the Source Evidence table citing the file and line/quote. If a blank has no source backing, write `_(no direct source — inferred from PROJECT-CONTEXT.md Section 3)_` and the grade drops to C.

### Step 5 — Capture variations (optional)

If the sources suggest more than one valid framing (e.g. one transcript frames it as a *time* problem, another as a *cost* problem), list the alternatives in the "Variations considered" section. The customer chooses at the workshop.

### Step 6 — Grade the document

| Grade | Criteria |
|---|---|
| **A** | All 5 blanks filled, every blank sourced, impact quantified ($X or Y% or Z minutes) |
| **B** | All 5 blanks filled, every blank sourced, impact may be emotional-only |
| **C** | Any blank empty, OR any blank unsourced, OR generic phrasing ("efficiency opportunity", "scale challenges") |

### Step 7 — Update state.json

Update `state.json.readiness.discover.problemStatementDoc`:

```json
{
  "status": "filled" | "partial" | "empty",
  "grade": "A" | "B" | "C",
  "path": "engagement/{{engagement-kebab}}/problem-statement.md",
  "signedOffBy": null | "<reviewer name>",
  "lastUpdated": "<ISO timestamp>"
}
```

### Step 8 — Present and direct

End with one of:

- If Grade A and signed off: `👉 NEXT: Problem statement is locked. Click "🗺️ Map Current Journey" for the third Discover deliverable.`
- If Grade A but not signed off: `👉 NEXT: Send this to {{sponsor}} for sign-off — it's the framing the Disrupt workshop pivots around. Or click "🗺️ Map Current Journey" to draft the journey in parallel.`
- If Grade B: `👉 NEXT: To lift to Grade A, find a quantified impact figure ($, %, minutes). Check questionnaire responses or transcripts for "costs us / takes us / loses us". Re-run /vibe-problem-statement when you have it.`
- If Grade C: `👉 NEXT: {specific blank} is empty/unsourced. Drop a relevant transcript or questionnaire into sources/ and re-run /vibe-problem-statement. Discover cannot close until this is Grade B+.`

## Notes

- This prompt does NOT modify `PROJECT-CONTEXT.md` Section 3. The agent updates Section 3 to a 1-line summary + link to this canonical file.
- Re-running is safe — signed-off statements (Sign-off row filled) are preserved; new sources can add Variations entries but won't overwrite the signed line.
- If `personas.md` doesn't exist yet, this prompt fails fast with: `👉 NEXT: Run /vibe-personas first — the problem statement is anchored to the primary persona.`
