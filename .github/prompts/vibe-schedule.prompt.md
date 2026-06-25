---
description: "Generate the full 4-week meeting schedule (Kickoff → Discover sessions → Disrupt Workshop → Check-ins → Handoff) as copy-paste Outlook invites"
agent: "VIBE Preparation"
argument-hint: "[kickoffDate=YYYY-MM-DD] [workshopDate=YYYY-MM-DD] [engagement=...]"
---

# VIBE Schedule

Produce `sources/meeting-templates.md` with **every meeting the engagement needs**, named, sized, and copy-paste-ready into Outlook. Replaces the older "4 generic templates" approach.

## Inputs

- ${input:kickoffDate}: (Optional) Date of the kickoff meeting (YYYY-MM-DD). If provided, the schedule is laid out with real dates. Otherwise meetings are relative ("Week 1, Day 3").
- ${input:workshopDate}: (Optional) Date of the Disrupt Workshop (Week 2). Most-asked-for by the customer so worth pinning early.
- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists.

## Requirements

### Step 1 — Read context

Read `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` for customer name + sponsor. Read `engagement/{{engagement-kebab}}/engagement-brief.md` for squad roster. Read `engagement/{{engagement-kebab}}/customer-brief.md` for any timing constraints the customer mentioned.

### Step 2 — Produce the 4-week schedule

Generate `sources/meeting-templates.md` containing all seven meetings. Each meeting must include: title, duration, attendees, purpose, ready-to-paste invite body. Use `[VIBE] {{Customer}} — {{Meeting Type}}` for every title.

| Week | Meeting | Duration | Attendees | Purpose |
|---|---|---|---|---|
| 0 | Kickoff | 60 min | Full squad + customer sponsor + technical contact | Intro the squad, review both briefs, align on scope and what success looks like |
| 1 | Discover Working Session 1 | 60 min | TPM + designer + customer sponsor + 1-2 end users | Walk through personas + current-state journey |
| 1 | Discover Working Session 2 | 60 min | TPM + customer sponsor + business owner | Validate the structured problem statement and confirm business impact |
| 2 | **Disrupt Workshop** | 120-180 min | Full squad + customer leadership + 2-4 end users | Vision review, persona review, ideation, future-state journey, live prototyping, next steps |
| 3 | Check-in 1 (V1 demo) | 30 min | Squad + customer sponsor + 1-2 end users | Demo first prototype, capture feedback |
| 3 | Check-in 2 (V2 demo) | 30 min | Squad + customer sponsor + 1-2 end users | Demo iterated prototype, capture feedback |
| 4 | Handoff | 60 min | Full squad + customer leadership | Roadmap + backlog + final share |

### Step 3 — Format each meeting

For each row, produce a fenced block that the user can copy directly into Outlook:

```markdown
### Week 2 — Disrupt Workshop

**Title**: `[VIBE] Tailwind Traders — Disrupt Workshop`
**Duration**: 2-3 hours (block 3 to be safe)
**Date**: 2026-07-01 14:00–17:00 BST   ← omit if no workshopDate provided; use "Week 2" instead
**Attendees**:
- Required: Elena Marsh (sponsor), Dev Patel (tech), 2-4 returns agents
- Required from Studio 42: TPM, engineer, designer
- Optional: Account team lead

**Description** (paste into invite body):
Hi all,

This is the central session of our VIBE engagement. We'll spend the time:
- Reviewing the personas + current-state journey we built in Week 1
- Sketching the future state together
- Generating prototype concepts and picking one to build
- Demonstrating a live mockup before you leave the room

Prep ask: please skim the engineering brief that lands the day before (we'll email it). Come ready to push back on anything that doesn't match your reality.

Outputs you'll see by end of session:
- Future-state user journey
- Storyboard / prototyping brief
- A live Spark or Copilot Studio mockup
- A clear plan for the next 2 weeks
```

### Step 4 — Add scheduling tips

After the table, add a "Scheduling tips" section covering:

- **Always book Disrupt Workshop first.** It's the hardest to coordinate (most attendees, longest, customer-facing) and the rest of the schedule should anchor to it.
- **Block the Check-ins early** even if you don't yet know what you'll demo — calendar discipline matters more in Week 3 than meeting agenda discipline.
- **Travel days** for in-person workshops should be the day before, not the same morning.
- **Customer time zones** — list every attendee's home time zone explicitly so nobody assumes.

### Step 5 — Update state.json

Update `readiness.preparation.meetingSchedule` with both a status and a grade:

- `status: complete`, `grade: A` — all 7 meetings have copy-paste invites AND real dates for at least kickoff + Disrupt Workshop
- `status: complete`, `grade: B` — all 7 meetings drafted with invites but dates are relative ("Week 2")
- `status: partial`, `grade: C` — fewer than 7 meetings drafted, or only the old 4 generic templates exist

Also include `weeks`: a flat map of meeting names to status (e.g. `{ "kickoff": "scheduled", "disrupt-workshop": "draft", ... }`).

### Step 6 — Recommend the next step

End with:

```
👉 NEXT: Copy each invite into Outlook and send. Start with the Disrupt Workshop —
   it's the hardest to coordinate. Then click "🔎 Deep Research" to start the
   research while invites are out.
```

## Notes

- The schedule is suggested, not enforced. Users may collapse or split sessions to suit the customer.
- Re-running this prompt is safe — it appends a date-stamped note to existing meetings rather than overwriting.
- If the workshop date is provided and falls outside week 2, the prompt warns but proceeds.
