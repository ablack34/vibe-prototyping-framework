---
sidebar_position: 1
title: "Phase 1: Preparation (Week 0)"
---

# Phase 1: Preparation (Week 0)

**Who:** Anyone on the team (typically the TPM) · **Duration:** Week 0 (3-5 days before kickoff)

Get the engagement ready to land. Both briefs filled, deep customer research done, all four weeks scheduled, kickoff in the calendar. Preparation is **deliberately non-technical** — its job is to make sure Discover starts from a strong base instead of a blank page.

## How It Works

The Preparation agent uses the same **source-first, gap-fill** pattern as Discover:

1. **Reads `sources/` and `templates/`** — account-team handover, any customer-authored materials, prior transcripts from earlier touchpoints
2. **Drafts both briefs from those sources** — `templates/engagement-brief.md` (Studio 42 internal, commercial context, squad, risks) and `templates/customer-brief.md` (the customer's own voice — their problem, their words)
3. **Kicks off dual-path research** via `/vibe-research`
4. **Generates the full 4-week meeting schedule** via `/vibe-schedule` — including the named Disrupt Workshop
5. **Shows the 7-field Preparation readiness dashboard** — grades each field A/B/C
6. **Only asks about gaps** — no 20-question intake

## Dual-path research

The framework can run public web research itself, but it can't see inside the Microsoft tenant. The Preparation agent therefore runs **two complementary research paths**:

- **Path A — Public web (in-CLI)** — `/vibe-research` delegates to the existing `@Task Researcher` agent, which writes `sources/research/customer-public.md` with cited public sources (annual reports, press, competitor pages, regulatory context).
- **Path B — M365 Researcher (external paste-back)** — `/vibe-research` generates `sources/research/m365-researcher-prompt.md`: a ready-to-paste prompt the user runs inside **M365 Copilot's Researcher agent**. The Researcher pulls signal from your tenant (account-team emails, OneNote, Teams chats, prior SharePoint engagement docs) that no in-CLI agent can see. The user saves the response to `sources/research/m365-researcher-results.md`.
- **Synthesis** — when both inputs exist, the Preparation agent writes `sources/research/research-summary.md` with per-fact source attribution (`[public]`, `[m365]`, `[public+m365]`) and an "Implications for the engagement" section.

The pattern is the same as Spark and Copilot Studio prompts elsewhere in the framework: **we generate the perfect prompt, you run it externally, the output comes back as a source.** See the [MCP reference](../reference/mcp.md#external-agents-prompt-and-paste-pattern) for the rationale.

## Key Commands

| Command | When | What It Does |
|---------|------|-------------|
| `/vibe-kickoff` | Day 0 | Creates the engagement, drafts both briefs, generates the full 4-week schedule |
| `/vibe-customer-brief` | Whenever the customer voice needs updating | Drafts or refreshes `templates/customer-brief.md` from sources |
| `/vibe-research` | After both briefs exist | Dual-path research — public web (auto) plus the M365 paste-back prompt |
| `/vibe-schedule` | After both briefs exist | Regenerates the 4-week schedule (including the named Disrupt Workshop) |
| `@VIBE Preparation` | Anytime during Week 0 | Source-first orchestrator — ingests everything, shows the dashboard, drafts what's missing |
| `/vibe-prep-check` | End of Week 0 | Focused 7-field readiness check before moving to Discover |

## Readiness Dashboard

The engagement lead tracks seven Preparation fields. The gate to **Discover** is **7/7 at Grade B+**:

| Field | What It Answers |
|-------|----------------|
| Engagement brief | Studio 42 commercial context, squad, success metrics, risks — is `engagement-brief.md` real, not placeholder? |
| Customer brief | The problem in the customer's own voice — is `customer-brief.md` real, not placeholder? |
| Customer research | Both Path A (public web) and Path B (M365 tenant) inputs synthesised into `research-summary.md` |
| Meeting schedule | All 7 meetings in `sources/meeting-templates.md` (kickoff, 2× discover, disrupt workshop, 2× check-in, handoff) — and ideally in Outlook |
| Existing docs | At least the basics of what the customer has already shared sit in `sources/` |
| Prior transcripts | Any earlier touchpoints (pre-sales calls, exploratory meetings) processed via `/vibe-transcript` |
| Kickoff complete | The customer-facing kickoff meeting has happened and is logged |

Each field is graded A (strong), B (good enough), or C (placeholder/missing). When all seven are at Grade B+, the engagement is ready to move to Discover — `@VIBE Engagement Lead` will surface the **🚪 Begin Discover** button automatically.

## Two briefs, two audiences

`engagement-brief.md` and `customer-brief.md` look similar but serve different audiences. Both must exist before Discover starts.

| File | Audience | Voice | What it covers |
|---|---|---|---|
| `engagement-brief.md` | Studio 42 internal | Account-lead / TPM | Commercial context, squad, success metrics, risks, sponsor map |
| `customer-brief.md` | Studio 42 squad (read), customer (validate) | The customer's own voice | The problem in their words, who feels it, what "great" looks like, existing investments, constraints, hopes/fears |

Putting the customer's framing in their own words — verbatim where possible — is the single highest-leverage thing you can do before Discover. It stops the squad from quietly substituting its own framing for the customer's.

## Tips

- **Start Preparation 1-2 weeks before the kickoff date.** The 7-meeting schedule needs lead time; the M365 Researcher prompt is best run early so you can re-run it as new tenant signal arrives.
- **Always run both research paths.** Public web is necessary but not sufficient — most of the highest-value signal (who tried this before, who pushed back, the unused notebook in someone's drawer) only exists in the tenant.
- **Treat `customer-brief.md` as a first-person document.** If you find yourself writing about the customer in third person, switch quotes or rewrite — the goal is the customer's voice on the page.
- **Book the Disrupt Workshop first.** It's the hardest meeting to coordinate (most attendees, longest, often in-person). Everything else anchors to it.
- **Don't skip `/vibe-prep-check`** — it's a strict subset of `/vibe-doctor` scoped just to Week 0 and gives you a clear go/no-go before you switch into Discover mode.
