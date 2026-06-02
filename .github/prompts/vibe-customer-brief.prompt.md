---
description: "Generate or refresh customer-brief.md from sources — the customer's own voice on the problem"
agent: "VIBE Preparation"
argument-hint: "[engagement=...]"
---

# VIBE Customer Brief

Produce `engagement/{{engagement-kebab}}/customer-brief.md` in the customer's voice. Handles three situations: the customer wrote one themselves, the customer hasn't written one (extract from sales artefacts), or more sources have arrived and the brief needs a refresh.

If `engagement/{{engagement-kebab}}/customer-brief.md` doesn't exist yet (e.g. the engagement was scaffolded before this prompt was added), copy `templates/customer-brief.md` to that path first and fill it there. **Never modify `templates/customer-brief.md`** — it's a blank scaffold.

This is one of the two core artifacts of the Preparation phase. It is distinct from `engagement-brief.md` (Studio 42 internal). Together they cover both sides of the engagement worldview before Discover starts.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## Requirements

### Step 1 — Detect what we have

Scan `sources/` for material the customer themselves authored or that captures their voice:

- A pre-existing customer brief or scoping doc
- Discovery questionnaire responses (customer-pre)
- Customer-authored decks, RFPs, vision docs
- Teams transcripts where the customer is speaking (pull via `/vibe-transcript` if needed)
- Customer email exchanges in `sources/`

Categorize each source as `customer-authored`, `customer-quoted`, or `s42-narrated` (the last is third-person about the customer — usable but weaker).

### Step 2 — Choose the path

| Situation | Action |
|---|---|
| Customer wrote a brief and it's in `sources/` | Reformat into our template; flag missing sections; ask the customer to fill the gaps |
| Customer hasn't written one but rich customer-authored/quoted sources exist | Generate the brief in their voice using direct quotes wherever possible; mark every section with `[generated from <source>]` |
| Only s42-narrated content exists | Generate a draft brief and mark it `[DRAFT — needs customer validation]` at the top. Recommend sending it to the customer for sign-off. |

### Step 3 — Write the brief

Fill `engagement/{{engagement-kebab}}/customer-brief.md` following its structure. Critical rules:

- **First-person, plain language.** "We have 280 technicians," not "The customer operates a workforce of 280 technicians."
- **Quote directly when possible.** If the customer said "dispatchers get yelled at by customers" in a transcript, use that line, with `[quoted from transcript-kickoff.md, 11:42]`.
- **Mark assumptions explicitly.** Anything you inferred without direct evidence: `[assumed]`.
- **No solutioning.** The brief is the problem in their words. Solutions live in `selected-concept.md` later.
- **No consulting-speak.** "Synergies", "leverage", "optimize" — strip them out.

### Step 4 — Present and ask for validation

Present the brief and end with one of these directives:

- If `[DRAFT]`: `👉 NEXT: Share this with {{sponsor}} for validation. Once they sign off, drop their edits back into sources/ and rerun /vibe-customer-brief.`
- If gaps exist: `👉 NEXT: Tell me the missing pieces, or send the template to {{sponsor}} to fill in the gaps directly.`
- If complete: `👉 NEXT: Customer brief is solid. Click "🔎 Deep Research" to enrich it with public + M365 research, or "🔍 Start Discovery" if you're ready.`

### Step 5 — Update state.json

Update `readiness.preparation.customerBrief` with both a status and a grade following the rubric:

- `status: filled`, `grade: A` — All sections filled, customer has signed off, quotes are tagged with sources
- `status: filled`, `grade: B` — All sections filled, generated from sources, awaiting customer sign-off
- `status: partial`, `grade: C` — Missing critical sections or only based on s42-narrated material

## Notes

- This prompt does NOT generate `engagement-brief.md`. That's Studio 42 internal; if you need to update it, use the VIBE Preparation agent directly.
- Refreshing is safe — running this prompt again won't overwrite signed-off content; it appends or amends with date-stamped notes.
