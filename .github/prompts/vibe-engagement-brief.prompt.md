---
description: "Generate or refresh engagement-brief.md from account-team sources — Studio 42's internal pre-engagement scoping view"
agent: "VIBE Preparation"
argument-hint: "[engagement=...]"
---

# VIBE Engagement Brief

Produce `engagement/{{engagement-kebab}}/engagement-brief.md` — the **Studio 42 internal** pre-engagement scoping document: the commercial context, the squad we'll field, and the risks we see. It is the counterpart to `customer-brief.md` (the customer's own voice); both exist and are complementary, not duplicates. This is the headless, web-surface equivalent of what `/vibe-kickoff` drafts and `@VIBE Preparation` refines: read the account-team material and fill the brief, don't ask the user to type it in.

This is **source-first**: read everything the account team handed over before writing any field. Never fabricate. Where the sources don't answer a field — especially squad names, deal values, and dates — mark it `[needs follow-up]` rather than inventing a value.

If `engagement/{{engagement-kebab}}/engagement-brief.md` doesn't exist yet (e.g. the engagement was scaffolded before this prompt was added), copy `templates/engagement-brief.md` to that path first and fill it there. **Never modify `templates/engagement-brief.md`** — it's a blank scaffold.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## Requirements

### Step 1 — Read the account-team material

Scan for the Studio 42 / account-team view of the engagement:

- Account team handover notes, scoping emails, or deal briefings in `sources/`
- Account team intake questionnaire responses (from `/vibe-questionnaire`, dropped in `sources/`)
- Any prior `engagement/{{engagement-kebab}}/engagement-brief.md` (amend it — never discard fields already filled and correct)
- `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` (if present — names, dates, stakeholders, commercial context)
- `engagement/{{engagement-kebab}}/customer-brief.md` (if present — the customer's framing of the problem; the engagement brief is *our* read on the same situation)
- `sources/research/customer-public.md` (if present — public research on the customer's size, market, competitors; informs the value assessment and risks)

### Step 2 — Fill the brief

Fill `engagement/{{engagement-kebab}}/engagement-brief.md` following its structure, grounding every field in a source:

- **Customer Information** — name, industry, region, account contact, customer sponsor, technical contact. Pull from the handover notes / questionnaire / PROJECT-CONTEXT.
- **Engagement Scoping** — requested start, funding source, deal context. These are commercial facts: if the sources don't state them, mark `[needs follow-up]` — never guess a deal value or date.
- **Problem Space** — what the customer is trying to accomplish, why now, what's been tried, what data they have, what success looks like. This is *our* assessment; it may draw on `customer-brief.md` but is written in Studio 42's analytical voice, not first-person customer voice.
- **Studio 42 Assessment** — the value sizing ($50K vs $50M framing), the proposed squad, and the initial risks. Only name squad members the sources actually name; leave unknown rows `[needs follow-up]`. Risks should be real signals from the material (thin data, unclear sponsor, tight timeline), not boilerplate.
- **Go / No-Go Decision** — leave the approver/date blank unless a source records a decision.

### Step 3 — Ground every claim

For any non-obvious field, keep a short source trace (e.g. a trailing `— sources/handover-notes.md`) so the team can see where it came from. Do not invent customer names, deal values, dates, or squad members. If the sources conflict, note the conflict rather than picking silently.

### Step 4 — Present and ask for review

Summarize what you filled: how many sections are grounded, which fields are still `[needs follow-up]`, and the single most useful source to add next to close the biggest gap. End with one directive:

- If the core fields (Customer Information, Problem Space) are filled: `👉 NEXT: Engagement brief is drafted. Click "📝 Customer Brief" to capture the customer's own voice, then "🔎 Deep Research" to enrich both — or "🔍 Start Discovery" once both briefs are solid.`
- If key fields are still open: `👉 NEXT: Engagement brief is drafted but {field(s)} are open. Add {the most useful missing source} (e.g. the account-team handover notes) to sources/ and re-run, or fill them in directly.`

### Step 5 — Update state.json

Update `readiness.preparation.engagementBrief` with both a status and a grade following the rubric:

- `status: filled`, `grade: A` — All sections grounded in sources, squad and commercial context confirmed
- `status: filled`, `grade: B` — All sections filled but some fields generated/assumed or awaiting account-team confirmation
- `status: partial`, `grade: C` — Missing critical sections (no problem space or no account-team material to ground in)

## Notes

- This prompt generates the **Studio 42 internal** brief. It is distinct from `/vibe-customer-brief`, which produces the customer's own voice. Together they cover both sides of the engagement worldview before Discover starts.
- Re-running is safe — already-filled, correct fields are preserved; new sources amend or extend them with date-stamped notes. It never modifies `templates/engagement-brief.md` (the blank scaffold) and never grades a gate — the two briefs are the Preparation readiness gate, but the grade lives in state.json, not in the document.
