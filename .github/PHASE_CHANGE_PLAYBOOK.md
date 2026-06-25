# Phase-Change Playbook

A canonical checklist for changing phases in the VIBE framework — add a deliverable, rename a phase, add or remove a phase, merge phases into one.

Phase changes touch a surprising number of files. The Preparation and Discover slices each surfaced 7+ drift bugs in rubber-duck review that could have been caught earlier. This playbook + the automated checker exist so the next slice doesn't relearn the same lessons.

---

## 1. Run the automated check first

```powershell
node scripts/check-phase-consistency.mjs
```

The script (`scripts/check-phase-consistency.mjs`) catches the mechanical drift bugs that human review tends to miss:

| Check | Catches |
|---|---|
| `prompt-ref` | `/vibe-foo` references pointing at a renamed or deleted prompt |
| `prompt-path` | `vibe-foo.prompt.md` path references that no longer exist |
| `agent-ref` | `@VIBE Foo` references that don't resolve to an agent file |
| `agent-frontmatter` | `agent: VIBE Foo` in prompt frontmatter **OR** in agent `handoffs:` lists pointing at a non-existent agent |
| `sidebar-pos` | `sidebar_position` values in `docs-site/docs/phases/` that aren't unique and contiguous 1..N |
| `sidebar-label` | `label: 'The N Phases'` whose number-word doesn't match the actual phase count |
| `sidebar-items` | `items[]` under "The N Phases" missing, extra, duplicate, or in the wrong order vs `sidebar_position` |
| `schema-load` | (warn) couldn't parse the canonical `state.json` schema in `vibe-engagement-lead.agent.md` |
| `state-path` | (warn) any `state.json.readiness.*` or `phases.*` path in a markdown file that isn't declared in the canonical schema (including hyphenated keys like `phases.design-develop`). Scans every file *except* the schema code block itself |
| `reference-docs` | (warn) an agent, prompt, or template exists on disk but isn't listed in `docs-site/docs/reference/{agents,prompts,templates}.md` |
| `phase-count-prose` | (warn) prose like "the four phases" in `README.md`, `.github/copilot-instructions.md`, or `docs-site/docs/why-vibe/process.md` whose number-word doesn't match the actual phase count |

CI runs the script on every PR via `.github/workflows/phase-consistency.yml`. Errors fail the build; warnings surface drift without blocking. Scanned surfaces: `.github/agents/`, `.github/prompts/`, `.github/instructions/`, `docs-site/docs/`, `docs-site/sidebars.ts`, `templates/`, `demo/`, `pitch/`, `docs/`, `README.md`, `CONTRIBUTING.md`, `.github/copilot-instructions.md`.

When 2+ findings share a target (e.g. 12 stale references to one deleted prompt), the report opens with a **Grouped summary** showing the root cause.

If a check fires on illustrative content (e.g. a `/vibe-future-prompt` example), add the name to the `IGNORE_*` whitelist at the top of the script.

---

## 2. Drift the script can't catch

These checks are prose-level and require human eyes. Walk this list before opening a PR for a phase change:

- **Process diagram phase count** — `README.md` (line ~5), `.github/copilot-instructions.md` (line ~5), `docs-site/docs/why-vibe/process.md`. All three need to match. (The script's `phase-count-prose` check catches mismatched number-words automatically.)
- **Phase ordering in prose** — e.g. "Preparation → Discover → Define → Ideate → Build → Deliver" appears in multiple places.
- **Phase-specific guidance sections** in `vibe-engagement-lead.agent.md` (around line 351+) — each phase has its own block; renames/additions need a matching section.
- **Transition gate language** — gate criteria for moving phase → phase live in both the agent file and the doctor checks. They must agree word-for-word.
- **Backward-compat migration** in `vibe-engagement-lead.agent.md` (around line 151+) — lists past phases by name (`"discover"`, `"define"`, …). Renames/additions need a migration step so old `state.json` files don't break.
- **Demo narration** in `vibe-demo.prompt.md` — the recommended demo flow lists agents in order. Phase changes must be reflected.
- **Numeric consistency** — e.g. `$6M/year` vs `$6.3M over 2 years` (a rubber-duck catch from the Discover slice). Search for currency figures and confirm they agree.
- **Walkthrough story flow** — `docs-site/docs/getting-started/first-engagement.md` and `walkthrough.md` tell a sequential story; check it still makes sense.

---

## 3. Change-type checklists

### Adding a new deliverable to an existing phase

1. **Template** — `templates/<deliverable>.md`
2. **Prompt** — `.github/prompts/vibe-<deliverable>.prompt.md` that produces it
3. **Phase agent** — `.github/agents/vibe-<phase>.agent.md`:
   - Add the deliverable to the Inputs→Outputs table
   - Add a handoff button if it's user-facing
   - Add a step describing when in the flow it runs
4. **Engagement Lead** — `.github/agents/vibe-engagement-lead.agent.md`:
   - Add a field under `readiness.<phase>.*` in the canonical schema (lines ~99–149)
   - Add the field to the readiness dashboard rendering (~line 320+)
   - Update the "Phase-specific guidance" block for that phase (~line 351+)
   - Update the gate language for the next phase transition if this deliverable is required to advance
5. **Doctor** — `.github/prompts/vibe-doctor.prompt.md`: add a check row with severity
6. **Demo** — `.github/prompts/vibe-demo.prompt.md`:
   - File-copy table: add the fixture copy
   - State.json seeding block: pre-grade the new field
   - Narration: mention it in the recommended flow
7. **Demo fixture** — `demo/tailwind/<deliverable-path>` with realistic content
8. **`.github/copilot-instructions.md`**:
   - Source → Document Flow diagram
   - Agent I/O table row for the producing agent
9. **`README.md`** — add to the prompt table if user-facing
10. **Docs site phase page** — `docs-site/docs/phases/<phase>.md`: add to "Required deliverables"
11. **Docs site reference pages**:
    - `docs-site/docs/reference/prompts.md` (under the phase's section)
    - `docs-site/docs/reference/templates.md`
12. **Docs site getting-started** — `docs-site/docs/getting-started/first-engagement.md`: add the step if user-facing
13. **Downstream consumer agent** — if the new deliverable feeds the next phase, update that agent's "Reads" list and "fails fast if missing" check

### Renaming a phase (e.g. `Ideate` → `Disrupt`)

This is text replacement, but every surface matters.

1. Rename `.github/agents/vibe-<oldname>.agent.md` → `vibe-<newname>.agent.md`
2. Rename any `.github/prompts/vibe-<oldname>-*.prompt.md` files
3. Search-replace `@VIBE <Oldname>` → `@VIBE <Newname>` across:
   - `.github/agents/**/*.md`
   - `.github/prompts/**/*.md`
   - `.github/copilot-instructions.md`
   - `README.md`
   - `docs-site/docs/**/*.md`
   - `templates/**/*.md`
   - `demo/**/*.md`
4. Search-replace `phases.<oldname>` → `phases.<newname>` and `readiness.<oldname>` → `readiness.<newname>` in the same files
5. Rename `docs-site/docs/phases/<oldname>.md` → `<newname>.md`; update frontmatter `title:` if needed
6. Update `docs-site/sidebars.ts` items list
7. Add a backward-compat migration step in `vibe-engagement-lead.agent.md` that renames `phases.<oldname>` → `phases.<newname>` and `readiness.<oldname>` → `readiness.<newname>` in old `state.json` files
8. Update the "Phase N: …" heading and section content in `vibe-engagement-lead.agent.md`
9. Re-run `node scripts/check-phase-consistency.mjs` — it will catch any reference you missed

### Adding a new phase

1. Run "Adding a new deliverable" for every deliverable in the new phase
2. Create the new orchestrating agent `.github/agents/vibe-<phase>.agent.md`
3. Update `.github/agents/vibe-engagement-lead.agent.md`:
   - Add `phases.<phase>` block to the canonical schema
   - Add `readiness.<phase>` block to the canonical schema
   - Add a new "Phase N: <Phase>" section
   - Renumber subsequent "Phase N+1: …" sections
   - Add the new phase name to the "past <phase>" lists in the backward-compat migration logic
4. Add `docs-site/docs/phases/<phase>.md` with frontmatter `sidebar_position: N` (renumber later pages if inserting mid-flow)
5. Update `docs-site/sidebars.ts`:
   - Add `'phases/<phase>'` to the items list (in flow order)
   - Update `label: 'The N Phases'` to the new count
6. Update process diagrams:
   - `.github/copilot-instructions.md` (Process diagram + Source → Document Flow + Agent I/O table)
   - `README.md` (Process diagram line + prompt table)
   - `docs-site/docs/why-vibe/process.md` (Process diagram)

### Removing or merging phases

The hardest change. Use rename + remove together.

1. **Decide the backward-compat migration first** — old `state.json` files will have `phases.<removed-phase>`. Either:
   - Drop the field silently (data loss is OK if no actionable state)
   - Map it to a successor phase (e.g. `phases.define` + `phases.ideate` → `phases.disrupt`)
2. Run "Renaming a phase" for the survivor
3. Delete the removed phase's files (agent, prompt(s), template(s), docs page)
4. Renumber `sidebar_position` in every remaining phase doc to stay contiguous starting at 1
5. Update `docs-site/sidebars.ts`:
   - Remove the deleted phase from `items[]`
   - Update `label: 'The N Phases'` to the new count
6. Update process diagrams (README, copilot-instructions, why-vibe/process)
7. Run `node scripts/check-phase-consistency.mjs` — sidebar-pos, sidebar-label, prompt-ref, and agent-ref will catch anything you missed

---

## 4. Touchpoint reference

Files that get touched in nearly every phase change, regardless of type:

| File | What drifts |
|---|---|
| `.github/agents/vibe-engagement-lead.agent.md` | canonical state.json schema, dashboard rendering, phase-specific guidance, gate language, migration logic |
| `.github/copilot-instructions.md` | Process diagram, Source → Document Flow, Agent I/O table |
| `README.md` | Process diagram line, prompt table |
| `docs-site/sidebars.ts` | items[] under "The N Phases", label string |
| `docs-site/docs/phases/*.md` | one file per phase, `sidebar_position` frontmatter |
| `docs-site/docs/reference/{prompts,agents,templates}.md` | phase-scoped tables |
| `docs-site/docs/getting-started/first-engagement.md` | step-by-step walkthrough |
| `docs-site/docs/why-vibe/process.md` | process diagram |
| `.github/prompts/vibe-doctor.prompt.md` | per-deliverable check rows |
| `.github/prompts/vibe-demo.prompt.md` | fixture file-copy table, state.json seeding, recommended demo flow |

---

## 5. Process discipline (proven on Preparation + Discover)

These habits caught real bugs:

1. **Pick the pivotal architectural question and ask the user once** — before writing the full plan. The Discover slice's "required deliverables vs hybrid vs optional" question was decisive; settling it up front saved 4 rounds of plan revision.
2. **Run the consistency script before committing**, not just before opening the PR.
3. **Run a rubber-duck pass on the plan and the implementation** — most slices have 5+ findings; if you get zero, you didn't give it enough context.
4. **Build the docs site locally** before pushing: `cd docs-site; npm run typecheck && npm run build`. Docusaurus is configured with `onBrokenLinks: 'throw'`.
5. **Commit each slice as ONE squash-merge** with a descriptive message and the `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>` trailer.
