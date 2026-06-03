# Personas

> **Discover deliverable.** **Auto-generated** by `/vibe-personas` from your sources (transcripts, questionnaires, customer documents, workshop notes) and `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md`. Review and approve — don't fill manually.
>
> **How this document gets populated:**
> 1. `@VIBE Discover` ingests `sources/` and produces `PROJECT-CONTEXT.md` (Section 8 has the inline persona summary)
> 2. `/vibe-personas` reads PROJECT-CONTEXT + sources and produces this file with the full Josephine-style structure
> 3. You review each persona, correct anything wrong, and approve
> 4. Re-run `/vibe-personas` whenever new transcripts or questionnaire responses arrive

---

## How this file is graded

Each persona below is graded **A / B / C** by the agent:

- **Grade A (Strong)** — sourced quote present + key needs + key pains + user context/device info, all tied to a `sources/` file
- **Grade B (Sufficient)** — role + key needs + key pains, sourced from at least one `sources/` file
- **Grade C (Needs follow-up)** — role only, or no source citation, or no quote available

Discover cannot close until **every persona is at Grade B or higher**. The `state.json.readiness.discover.personas` field tracks the lowest grade across all personas (so if one persona is Grade B and two are Grade A, the field is Grade B).

---

## Persona 1: {{PERSONA_NAME}}

> **Grade:** {{GRADE}}
> **Sources read:** {{SOURCE_FILES}}

| Field | Value |
|---|---|
| **Fictional name** | {{PERSONA_NAME}} |
| **Role / Key characteristic** | {{ROLE}} |
| **High-level description** | {{DESCRIPTION}} |

### Key needs

- {{NEED_1}}
- {{NEED_2}}
- {{NEED_3}}

### Key pains

- {{PAIN_1}}
- {{PAIN_2}}
- {{PAIN_3}}

### Quote(s)

> "{{QUOTE_1}}"
>
> — {{PERSONA_NAME}}, source: `{{SOURCE_FILE}}` line {{LINE_NUMBER}}

> _If no direct quote is available from sources, the agent writes:_
> `> _No direct quote yet — sourced from {{SOURCE_FILE}}. Add a quote when you have one._`

### User context / device info (optional)

- **Primary device(s)**: {{DEVICES}}
- **Where they work**: {{ENVIRONMENT}}
- **Time pressure**: {{TIME_PRESSURE}}
- **Other context**: {{OTHER_CONTEXT}}

---

## Persona 2: {{PERSONA_NAME}}

> Repeat the structure above for each persona. Typical engagement has 2-3 personas; ideation may add more.

---

## Sign-off

| Reviewed by | Role | Date | Signature / approval note |
|---|---|---|---|
| {{REVIEWER_NAME}} | {{REVIEWER_ROLE}} | {{DATE}} | {{SIGNATURE}} |

> Customer sign-off is recommended (but not required) before moving to Disrupt. If the customer has not yet reviewed, leave the row blank and add it after the next check-in.
