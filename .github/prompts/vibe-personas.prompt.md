---
description: "Generate or refresh personas.md from sources — Josephine-structured persona profiles for Discover (Wk 1)"
agent: "VIBE Discover"
argument-hint: "[engagement=...]"
---

# VIBE Personas

Produce `engagement/{{engagement-kebab}}/personas.md` — one of the three required Discover deliverables. Each persona follows Josephine's Week-1 structure: fictional name, role/key characteristic, high-level description, key needs, key pains, sourced quote(s), and optional user context/device info.

This is **source-first**: read every available source before fabricating any persona detail. Every quote MUST cite a `sources/` file. If no quote can be sourced, mark it explicitly — do not invent quotes.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## Requirements

### Step 1 — Read all sources

Read everything that could yield persona signal:

- `templates/PROJECT-CONTEXT.md` (Section 6 Stakeholders, Section 8 User Personas if filled)
- `templates/customer-brief.md` (the customer's voice — names roles in their language)
- `templates/engagement-brief.md` (S42 view — names key stakeholders)
- Every transcript in `sources/` (look for first-person speakers, named individuals, quoted pains)
- `sources/questionnaire-responses.md` (or equivalent)
- `sources/research/research-summary.md` (industry persona research from Preparation)
- `sources/workshop-notes.md` (captured insights)
- Any prior `engagement/{{engagement-kebab}}/personas.md` (don't overwrite signed-off personas — append/amend instead)

### Step 2 — Identify the persona set

Group sources by speaker / by named role / by JTBD. A typical engagement has **2-3 personas**:

- The **primary user** (the one whose journey the prototype most directly serves)
- The **secondary user(s)** (adjacent roles whose workflow is affected)
- Occasionally a **decision-maker / sponsor** persona (rare — usually they're a stakeholder, not a persona)

Do not invent personas the sources don't support. If only one persona has source backing, produce one persona. Note the gap.

### Step 3 — Draft each persona

Copy `templates/personas.md` to `engagement/{{engagement-kebab}}/personas.md` and fill one H2 block per persona. For each:

- **Fictional name** — pick a realistic name that doesn't match any real customer person. Use the customer's geographic/cultural context (e.g. UK-flavoured for a UK customer)
- **Role / Key characteristic** — exact role title from sources + the one thing that defines them
- **High-level description** — 1-2 sentences in plain language. No consulting-speak.
- **Key needs** — 3-5 bullets. Each grounded in a source.
- **Key pains** — 3-5 bullets. Each grounded in a source.
- **Quote(s)** — at least one direct quote with `source: sources/{file}.md line N` (or transcript timestamp). If no sourced quote exists, write `> _No direct quote yet — sourced from {file}. Add a quote at the next discover meeting._` Never fabricate a quote.
- **User context / device info** — optional but include if sources mention it (e.g. "on a phone in the cab of a van", "at a shared workstation", "between calls")

### Step 4 — Grade each persona

Grade each persona A/B/C using this rubric:

| Grade | Criteria |
|---|---|
| **A** | Sourced quote + key needs + key pains + user context/device info, all tied to a specific `sources/` file |
| **B** | Role + key needs + key pains, sourced from at least one `sources/` file |
| **C** | Role only, OR no source citation, OR no quote available and no follow-up flagged |

Write the grade at the top of each persona's H2 block (using the template's `> **Grade:** X` line).

### Step 5 — Update state.json

Update `state.json.readiness.discover.personas`:

```json
{
  "status": "filled" | "partial" | "empty",
  "grade": "A" | "B" | "C",       // lowest grade across all personas
  "path": "engagement/{{engagement-kebab}}/personas.md",
  "count": <number of personas>,
  "lastUpdated": "<ISO timestamp>"
}
```

If `readiness.discover` does not yet exist in state.json, create it.

### Step 6 — Present and ask for review

Present a 1-line summary per persona, the overall grade, and what would lift any C-graded persona to B. End with one of these directives:

- If all Grade A: `👉 NEXT: Personas are solid. Click "🎯 Draft Problem Statement" to produce the next Discover deliverable.`
- If any Grade B: `👉 NEXT: {persona-name} is at Grade B — to lift to A, get a direct quote and device context at the next discover meeting. Or click "🎯 Draft Problem Statement" to proceed.`
- If any Grade C: `👉 NEXT: {persona-name} is at Grade C — need {missing element}. Drop a transcript or questionnaire into sources/ and re-run /vibe-personas. Discover cannot close until every persona is Grade B+.`

## Notes

- Re-running `/vibe-personas` is safe — signed-off personas (with a non-empty Sign-off row) are preserved as-is; new sources append additional persona blocks or amend non-signed-off ones with date-stamped notes.
- This prompt does NOT modify `PROJECT-CONTEXT.md` Section 8. The agent updates Section 8 to summarise (1 row per persona) and link to this canonical file.
- If the customer themselves wrote personas, drop them in `sources/` and the agent will reformat into this structure with `[customer-authored]` tags.
