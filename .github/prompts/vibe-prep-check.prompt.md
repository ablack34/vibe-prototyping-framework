---
description: "Preparation-only readiness check. Verifies the Week 0 artifacts are in place so Discover can start cleanly."
agent: "VIBE Engagement Lead"
argument-hint: "[engagement=...]"
---

# VIBE Prep Check

A focused health-check for the **Preparation phase only**. Lighter and faster than `/vibe-doctor`, which spans every phase. Run this when you think you're ready to move Preparation → Discover (or when a teammate just `git pull`ed and wants to know whether they can pick up where you left off).

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## What it checks

| # | Check | Severity if missing |
|---|---|---|
| 1 | `templates/engagement-brief.md` is filled (not just placeholders) | **critical** |
| 2 | `templates/customer-brief.md` is filled (not just placeholders) | **critical** |
| 3 | `sources/research/customer-public.md` exists with cited sources | warn |
| 4 | `sources/research/m365-researcher-prompt.md` was generated | warn |
| 5 | `sources/research/research-summary.md` exists (both research paths complete) | warn |
| 6 | `sources/meeting-templates.md` covers all 7 meetings (not just the old 4 generic templates) | warn |
| 7 | At least one source in `sources/` other than `meeting-templates.md` and `research/` | warn |
| 8 | Prior transcripts processed (if work-iq-mcp is available) | info |
| 9 | `state.json` phase is `preparation` (or `preparation`-complete) | info |

## Output

Report results as a table with three columns (`Check`, `Status`, `Action`). Use:

- ✅ for passing checks
- ⚠️ for warnings (Preparation can ship without these but the engagement is weaker)
- ❌ for critical failures (do not move to Discover)

Example:

```
📍 Contoso Field Services — Dispatcher AI · Phase: preparation · Prep readiness: 6/9

🩺 Prep Check

| Check                            | Status | Action                                                          |
|----------------------------------|--------|-----------------------------------------------------------------|
| engagement-brief.md filled       | ✅     |                                                                 |
| customer-brief.md filled         | ✅     |                                                                 |
| customer-public.md exists        | ✅     | 7 cited sources                                                 |
| m365-researcher-prompt generated | ✅     |                                                                 |
| research-summary.md exists       | ⚠️     | M365 results not pasted back yet — synthesise once they arrive  |
| meeting-templates.md (7 meetings)| ⚠️     | Only the old 4 templates present — run /vibe-schedule           |
| sources/ non-empty               | ✅     | 5 customer docs                                                 |
| prior transcripts processed      | ✅     | 2 transcripts indexed via work-iq                               |
| state.json phase = preparation   | ✅     |                                                                 |

Top fix → run /vibe-schedule (one click; the 4-week schedule unblocks the rest of the engagement)
Next-phase action → click "🔍 Start Discovery" when M365 research lands or you decide to proceed without it.

👉 NEXT: Run /vibe-schedule
```

## Requirements

1. Read `state.json` and the file system in parallel.
2. Run all 9 checks above.
3. If `state.json` and the file system disagree, **silently reconcile** state.json (file system wins) and note it at the bottom.
4. Never modify any file other than `state.json` during the check.
5. Present the results table. Always end with two recommendations (top fix + next-phase action) and a `👉 NEXT:` directive.
6. If everything passes: `✅ Preparation ready. Click "🔍 Start Discovery" to move on.`

## Notes

- This is a read-only check (except for `state.json` reconciliation).
- It's a strict subset of `/vibe-doctor` — if you want the full engagement health check, use that instead.
- A teammate joining mid-engagement can run this safely after `git pull` to know whether Preparation is genuinely complete.
