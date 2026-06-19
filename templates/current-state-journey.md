# Current-State User Journey

> **Discover deliverable.** **Auto-generated** by `/vibe-current-journey` from `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` Section 5 (Data Available), `engagement/{{engagement-kebab}}/personas.md`, and your sources. Review and approve.
>
> **How this document gets populated:**
> 1. `@VIBE Discover` fills PROJECT-CONTEXT.md with stakeholders, systems, and current-state context
> 2. `/vibe-current-journey` reads PROJECT-CONTEXT + personas + sources and produces the Mermaid diagram + stages table below
> 3. You review the stages — were any steps missed? Re-run the prompt or hand-edit the table
> 4. Customer reviews at the next check-in (this drives the *future-state* journey the team designs in the Disrupt workshop)

---

## Grading

The agent grades this document **A / B / C**:

- **Grade A (Strong)** — ≥5 stages, every stage has steps + stakeholders + systems/data + pains, Mermaid diagram renders, sourced from transcripts/questionnaires
- **Grade B (Sufficient)** — ≥3 stages with stakeholders/systems/pains identified per stage
- **Grade C (Needs follow-up)** — fewer than 3 stages, or stages missing stakeholders/systems/pains

Discover cannot close until this document is at **Grade B or higher**.

> **Grade:** {{GRADE}}

---

## Key persona

This journey follows **{{PERSONA_NAME}}** ({{PERSONA_ROLE}}). See [`personas.md`](./personas.md) for full persona detail.

> If multiple personas have meaningfully different journeys, create one `current-state-journey-{persona-slug}.md` per persona and link them all from PROJECT-CONTEXT.md Section 8.5.

---

## Visual journey

```mermaid
flowchart LR
    Stage1[{{STAGE_1_NAME}}] --> Stage2[{{STAGE_2_NAME}}]
    Stage2 --> Stage3[{{STAGE_3_NAME}}]
    Stage3 --> Stage4[{{STAGE_4_NAME}}]
    Stage4 --> Stage5[{{STAGE_5_NAME}}]

    classDef painPoint fill:#ffcccc,stroke:#cc0000
    class Stage2,Stage4 painPoint
```

> The agent marks any stage where a pain was identified with the `painPoint` class (rendered red). If no Mermaid can be reasonably auto-generated (e.g. >10 stages or complex branching), the agent omits the diagram and leaves a note: `> _Mermaid diagram skipped — see stages table below; consider a Miro board for visualization._`

---

## Stages table

| # | Stage | Steps the persona takes | Other stakeholders involved | Systems / data touched | Challenges / pains |
|---|---|---|---|---|---|
| 1 | {{STAGE_1_NAME}} | {{STEPS}} | {{STAKEHOLDERS}} | {{SYSTEMS}} | {{PAINS}} |
| 2 | {{STAGE_2_NAME}} | {{STEPS}} | {{STAKEHOLDERS}} | {{SYSTEMS}} | {{PAINS}} |
| 3 | {{STAGE_3_NAME}} | {{STEPS}} | {{STAKEHOLDERS}} | {{SYSTEMS}} | {{PAINS}} |

> Add as many rows as the persona's journey needs. Empty cells are fine — they signal a real gap (e.g. no system involved at this stage). Mark them with `_(none)_` so reviewers can distinguish "no data" from "no involvement".

---

## Source evidence

| Stage | Source file | Line / quote |
|---|---|---|
| 1 | `{{SOURCE_FILE}}` | {{LINE_OR_QUOTE}} |
| 2 | `{{SOURCE_FILE}}` | {{LINE_OR_QUOTE}} |
| 3 | `{{SOURCE_FILE}}` | {{LINE_OR_QUOTE}} |

---

## Top pain points (ranked)

The agent surfaces the highest-impact pains from the table above. These feed directly into the Disrupt workshop's ideation prompts.

1. **{{PAIN_1}}** — happens at stage {{STAGE_N}}, affects {{WHO}}, costs {{IMPACT}}
2. **{{PAIN_2}}** — happens at stage {{STAGE_N}}, affects {{WHO}}, costs {{IMPACT}}
3. **{{PAIN_3}}** — happens at stage {{STAGE_N}}, affects {{WHO}}, costs {{IMPACT}}

---

## Sign-off

| Reviewed by | Role | Date | Signature / approval note |
|---|---|---|---|
| {{REVIEWER_NAME}} | {{REVIEWER_ROLE}} | {{DATE}} | {{SIGNATURE}} |

> Customer sign-off is recommended before the Disrupt workshop — the future-state journey is built by *changing* this one.
