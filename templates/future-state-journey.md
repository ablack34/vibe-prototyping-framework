# Future-State User Journey

> **Disrupt deliverable.** **Auto-generated** by `/vibe-future-journey` from `engagement/{{engagement-kebab}}/current-state-journey.md`, the selected concept, and the storyboard. The journey the persona walks once the prototype exists.
>
> **How this document gets populated:**
> 1. The Disrupt workshop redraws the current-state journey stage by stage — which stages disappear, which get faster, which are new
> 2. `/vibe-future-journey` reads the workshop record, the current-state journey, and the selected concept, and produces this document
> 3. The team reviews the new stages — did anything get dropped that the persona still needs?
> 4. Customer sign-off captured — the engineer uses this plus the storyboard to write the engineering brief

---

## Grading

The agent grades this document **A / B / C**:

- **Grade A (Strong)** — ≥5 stages, every stage shows what's different vs. current-state (faster / removed / new), Mermaid diagram renders, Top 3 improvements tie to the Top 3 pains from current-state, sourced from the workshop record
- **Grade B (Sufficient)** — ≥3 stages with the delta (vs. current-state) named per stage, Top 3 improvements present
- **Grade C (Needs follow-up)** — fewer than 3 stages, or stages don't show what's different vs. current-state

Design & Develop cannot start until this document is at **Grade B or higher**.

---

## Key persona

This journey follows **{{PERSONA_NAME}}** ({{PERSONA_ROLE}}) — the same primary persona as [`current-state-journey.md`](./current-state-journey.md). See [`personas.md`](./personas.md) for full persona detail.

> If the prototype meaningfully changes the journey for more than one persona, create one `future-state-journey-{persona-slug}.md` per persona. Most prototypes serve one primary persona — keep it focused.

---

## Visual journey

```mermaid
flowchart LR
    Stage1[{{STAGE_1_NAME}}] --> Stage2[{{STAGE_2_NAME}}]
    Stage2 --> Stage3[{{STAGE_3_NAME}}]
    Stage3 --> Stage4[{{STAGE_4_NAME}}]
    Stage4 --> Stage5[{{STAGE_5_NAME}}]

    classDef newStage fill:#ccffcc,stroke:#006600
    classDef removedStage fill:#eeeeee,stroke:#999999,stroke-dasharray: 5 5
    class Stage2,Stage4 newStage
```

> Stages marked with the `newStage` class (green) didn't exist in the current-state journey — the prototype introduces them. Stages from current-state that the prototype **removes** are listed in the "What's gone" section below rather than shown as ghosts in the diagram (keeps the picture clean).

---

## Stages table

| # | Stage | Steps the persona takes | Other stakeholders | Systems / data | What's different vs. current-state |
|---|---|---|---|---|---|
| 1 | {{STAGE_1_NAME}} | {{STEPS}} | {{STAKEHOLDERS}} | {{SYSTEMS}} | {{DELTA}} (e.g. "unchanged — same context-setting", "10× faster — Copilot does the lookup", "new — didn't exist before") |
| 2 | {{STAGE_2_NAME}} | {{STEPS}} | {{STAKEHOLDERS}} | {{SYSTEMS}} | {{DELTA}} |
| 3 | {{STAGE_3_NAME}} | {{STEPS}} | {{STAKEHOLDERS}} | {{SYSTEMS}} | {{DELTA}} |

> Add as many rows as the future journey needs. Every row's "What's different" cell must be filled in — if it would be "unchanged" for every stage, the prototype isn't disrupting anything and you should revisit the selected concept.

---

## What's gone

Stages from `current-state-journey.md` that the prototype **removes** entirely:

| Removed stage | Why it goes away | Who benefits |
|---|---|---|
| {{REMOVED_STAGE_1}} | {{REASON}} | {{WHO}} |
| {{REMOVED_STAGE_2}} | {{REASON}} | {{WHO}} |

---

## Top 3 improvements (ranked)

Each improvement maps directly to one of the Top 3 pains in `current-state-journey.md`. The agent surfaces them in the same order — pain #1 → improvement #1.

1. **{{IMPROVEMENT_1}}** — resolves pain "{{PAIN_1}}" at stage {{STAGE_N}}. Measured by {{METRIC}}.
2. **{{IMPROVEMENT_2}}** — resolves pain "{{PAIN_2}}" at stage {{STAGE_N}}. Measured by {{METRIC}}.
3. **{{IMPROVEMENT_3}}** — resolves pain "{{PAIN_3}}" at stage {{STAGE_N}}. Measured by {{METRIC}}.

---

## Source evidence

| Stage | Source | Reference |
|---|---|---|
| 1 | `engagement/{{engagement-kebab}}/workshop-record.md` § Future-state journey | {{REFERENCE}} |
| 2 | `engagement/{{engagement-kebab}}/selected-concept.md` | {{REFERENCE}} |
| 3 | Workshop sticky notes — `sources/workshop/{{date}}-future-state.jpg` | {{REFERENCE}} |

---

## Sign-off

| Reviewed by | Role | Date | Signature / approval note |
|---|---|---|---|
| {{REVIEWER_NAME}} | {{REVIEWER_ROLE}} | {{DATE}} | {{SIGNATURE}} |
| {{CUSTOMER_LEAD}} | Customer lead | {{DATE}} | {{SIGNATURE}} |

> Customer sign-off is **required** before Design & Develop starts — the engineering brief is built on this journey.
