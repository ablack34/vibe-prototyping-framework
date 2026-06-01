---
description: "Health check for the engagement — finds missing pieces, broken links, stale state, and tells you the single highest-value next step"
agent: "VIBE Engagement Lead"
argument-hint: "[engagement=...]"
---

# VIBE Doctor

A health check for the engagement. Inspects the file system, validates that the agent-generated artifacts are consistent with the templates, and reports any issues a teammate would otherwise hit at the worst possible moment.

Use this:

- After a `git pull` to see if anyone else's work has moved the engagement forward
- Before a customer demo to make sure nothing is missing
- When `@VIBE Engagement Lead` says you're in a phase that doesn't feel right
- At any time when something feels off

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## What it checks

| Check | What it verifies | Severity if it fails |
|-------|------------------|----------------------|
| Engagement folder exists | `engagement/<name>/` is present and committed | **critical** — nothing else works |
| state.json present | `.copilot-tracking/vibe/<name>/state.json` exists | warn (will be auto-rebuilt) |
| state.json matches reality | Phases recorded in state.json match the files actually present in `engagement/<name>/` | warn (auto-reconcilable) |
| PROJECT-CONTEXT.md populated | Not the empty template; has customer name and problem statement | **critical** for Discover |
| Sources present | `sources/` has at least one file (other than `meeting-templates.md`) | warn for Discover |
| Discovery artifacts | `discovery-summary.md` exists in `engagement/<name>/` if state says Discover is complete | warn |
| Requirements signed off | `templates/requirements-summary.md` is populated and not just placeholders | warn for Define+ |
| Concept selected | `selected-concept.md` exists in `engagement/<name>/` if state says Ideate is complete | warn |
| Engineering brief present | `engineering-brief.md` exists in `engagement/<name>/` if state says Build has started | **critical** for Build |
| Combined PRD fresh (optional) | If `engagement/<name>/prd.md` exists, the embedded source SHAs match the current SHAs of `requirements-summary.md` and `engineering-brief.md` | warn — PRD is stale, re-run `/vibe-prd` |
| Form-factor declared | `selected-concept.md` includes a clear `formFactor` value | warn |
| Data prepped (web-app only) | If form factor is `webapp`, `scaffold/data/` has typed models | warn for web-app Build |
| Scaffold builds (web-app only) | `npm run build` in `scaffold/web/` and `dotnet build` in `scaffold/api/` succeed | warn for web-app Build |
| Deployment URL captured | If `state.json` claims deployment, URL is recorded and reachable | warn for Deliver |
| Check-in log present | `templates/CHECK-IN-NOTES.md` has at least one entry if state claims demos happened | info |
| Handoff data complete | `engagement/<name>/handoff-data.json` has all five sections (vision, roadmap, backlog, limitations, about) if state says Deliver is complete | **critical** for Deliver |
| MCP servers enabled | At least one `mcp_workiq_*`, `mcp_github_*`, `mcp_ado_*`, or `mcp_foundry_*` tool is available | info — point user at `/reference/mcp` |
| Demo fixture markers | If state.json has `demoFixture: contoso`, sources/ contains the expected demo files | info |

## Output format

Report results as a table with three columns (`Check`, `Status`, `Action`). Use:

- ✅ for passing checks
- ⚠️ for warnings (engagement can continue but should be fixed)
- ❌ for critical failures (engagement can't continue without fixing)

End with **two distinct recommendations**:

1. **The single biggest fix** — if any ❌ exists, the next action is to resolve it. If only ⚠️ exist, pick the one closest to the user's current phase.
2. **The next-phase action** — what they would normally do next if everything were healthy.

Example output:

```
📍 Contoso Field Services — Dispatcher AI · Phase: build · Discovery readiness: 9/9 · Sources: 7 files

🩺 Doctor results

| Check                           | Status | Action                                                |
|---------------------------------|--------|-------------------------------------------------------|
| Engagement folder exists        | ✅     |                                                       |
| state.json matches reality      | ⚠️     | discovery-summary.md exists but state says not-started; I'll reconcile |
| PROJECT-CONTEXT.md populated    | ✅     |                                                       |
| Engineering brief present       | ✅     |                                                       |
| Form-factor declared            | ✅     | webapp                                                |
| Data prepped (web-app)          | ❌     | Run /vibe-data-prep — no typed models in scaffold/data/ |
| Scaffold builds                 | ⚠️     | `npm run build` in scaffold/web/ fails: missing dep `recharts` |
| MCP servers enabled             | ✅     | github, workiq, ado all responding                    |

Top fix → run /vibe-data-prep (the build phase can't proceed without typed data models).
Next-phase action → after /vibe-data-prep, run /vibe-prototype-scaffold to generate the dispatcher UI.

I've already reconciled state.json. No other changes made.

👉 NEXT: Run /vibe-data-prep
```

## Requirements

1. Read `state.json` and the file system in parallel.
2. Run every check in the table above. Skip phase-conditional checks if the engagement isn't in that phase yet.
3. If `state.json` and the file system disagree, **silently reconcile state.json** (file system wins) and note it at the bottom.
4. Never modify any file other than `state.json` during the doctor run. The doctor diagnoses; it does not heal.
5. Present the results table. Always end with the two recommendations and a `👉 NEXT:` directive.
6. If nothing is wrong, say so plainly: *"All checks passed. Carry on."*

## Notes

- This prompt is read-only except for the state.json reconciliation. It should never delete files, never re-run agents, never deploy.
- If the engagement has no `state.json` at all (fresh `git pull` from a teammate's repo), the doctor should still work — it builds a fresh state.json from the file system on the fly.
