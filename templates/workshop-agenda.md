# Disrupt Workshop Agenda

> **Disrupt deliverable (pre-workshop).** **Auto-generated** by `/vibe-workshop-agenda` from the Discover deliverables, `templates/PROJECT-CONTEXT.md`, and the engagement brief. Review with the facilitator before the workshop — don't fill manually.
>
> **How this document gets populated:**
> 1. Discover closes with `personas.md`, `problem-statement.md`, and `current-state-journey.md` all Grade B+ and signed off
> 2. `/vibe-workshop-agenda` reads those three plus `templates/PROJECT-CONTEXT.md` and produces this run-of-show, anchoring every section to a real input
> 3. The facilitator reviews — adjusts timings, swaps activities for the customer's preferred style, adds any pre-reads
> 4. The customer receives the agenda 48 hours before the workshop (the engagement brief specifies the attendees)

---

## Grading

The agent grades this document **A / B / C**:

- **Grade A (Strong)** — every section references a real Discover deliverable (named persona, ranked pain, system, etc.), timings sum to the booked duration, every attendee has a named role in at least one activity, pre-reads sent ≥48 hours before
- **Grade B (Sufficient)** — every section references a Discover deliverable, timings sum to the booked duration
- **Grade C (Needs follow-up)** — generic agenda, sections don't anchor to real Discover inputs, or timings don't add up

Disrupt cannot start until this document is at **Grade B or higher**.

---

## Workshop metadata

| Field | Value |
|---|---|
| **Customer** | {{CUSTOMER_NAME}} |
| **Engagement** | `engagement/{{engagement-kebab}}/` |
| **Date** | {{WORKSHOP_DATE}} |
| **Duration** | {{DURATION}} (typical: full day) |
| **Format** | {{IN_PERSON_OR_HYBRID_OR_REMOTE}} |
| **Facilitator** | {{FACILITATOR_NAME}} |
| **S42 attendees** | {{S42_ATTENDEES}} |
| **Customer attendees** | {{CUSTOMER_ATTENDEES}} (with roles) |
| **Materials** | {{WHITEBOARD_OR_MIRO_OR_TEAMS}} |

---

## Pre-workshop checklist

- [ ] All three Discover deliverables Grade B+ and customer-signed-off
- [ ] Engagement brief (S42-internal) reviewed
- [ ] Customer brief (customer voice) reviewed
- [ ] Pre-reads sent to attendees ≥48 hours ahead: `personas.md`, `problem-statement.md`, `current-state-journey.md`
- [ ] Live prototyping environment ready (GitHub Spark loaded, Copilot Studio open, sample data in `sources/sample-data/`)
- [ ] Recording/notes plan agreed with the customer

---

## Agenda

> Timings are a starting point. Each section's "facilitator notes" call out where to push if the conversation is going well, and where to cut if you're behind.

### 1. Introductions & Expectations — {{TIME_1}}

| Item | Detail |
|---|---|
| **Lead** | {{FACILITATOR_NAME}} |
| **Anchored to** | Engagement brief (success metrics, scope) |
| **Materials** | One slide: who's in the room + what we're here to leave with |
| **Key questions** | "What does success look like for you by the end of today?" · "What's the one thing that, if we don't decide it today, this workshop has failed?" |
| **Facilitator notes** | Capture expectations on a parking-lot — review against them at the close |

### 2. Review/refine product vision — {{TIME_2}}

| Item | Detail |
|---|---|
| **Lead** | {{LEAD_NAME}} |
| **Anchored to** | `problem-statement.md` (the "I am / I'm trying to / But / Because / which results in" frame) |
| **Materials** | Print or screen-share the problem statement, leave space to mark up |
| **Key questions** | "Does this still feel right?" · "What's missing from the 'But' or 'Because' line?" · "If we changed one thing about the 'which results in' line, what would it be?" |
| **Facilitator notes** | Any edits made here MUST get back to `problem-statement.md` post-workshop (re-run `/vibe-problem-statement` with the workshop notes as a new source) |

### 3. Review/refine objectives & key results — {{TIME_3}}

| Item | Detail |
|---|---|
| **Lead** | {{LEAD_NAME}} |
| **Anchored to** | Engagement brief (success metrics) + customer brief (what "great" looks like) |
| **Materials** | One slide per OKR — objective on top, candidate KRs below |
| **Key questions** | "If we hit this KR, would you sign off the prototype?" · "What's the smallest measurable change that would make this worth doing?" |
| **Facilitator notes** | Park anything that requires data we don't have access to — list under "Open questions" at the close |

### 4. Review personas and research insights — {{TIME_4}}

| Item | Detail |
|---|---|
| **Lead** | {{LEAD_NAME}} |
| **Anchored to** | `personas.md` (one slide per persona) + `sources/research/research-summary.md` if it exists |
| **Materials** | Persona slides with the sourced quote prominent |
| **Key questions** | "Is this how you'd describe {{PRIMARY_PERSONA_NAME}}?" · "Who's missing?" · "Anything in the research that surprised you?" |
| **Facilitator notes** | If a customer attendee IS one of the personas, hand them the slide and ask "what would you change?" |

### 5. Ideation — {{TIME_5}}

| Item | Detail |
|---|---|
| **Lead** | {{LEAD_NAME}} (designer or engineer pairs well here) |
| **Anchored to** | Top 3 ranked pain points from `current-state-journey.md` (the agent inserts them below) |
| **Materials** | Whiteboard or Miro, the form-factor reference card (web / conversational / agentic / Copilot extension / low-code) |
| **Opening prompt** | "We've named these as the Top 3 pains: {{PAIN_1}}, {{PAIN_2}}, {{PAIN_3}}. For each, what could AI do that would actually move the needle?" |
| **Three rules every concept must satisfy** | 1. **AI must be essential** — remove the AI and the concept falls apart. 2. **Must work with mock data** — no live system connections. 3. **Must be feasible with Microsoft tech** — Azure, M365, Power Platform, Copilot Studio, Foundry Agents. |
| **Aim for** | 2-3 concepts on the wall by the end. Customer votes their favourite. The winner becomes `selected-concept.md`. |
| **Facilitator notes** | Don't let one strong voice (theirs or ours) close down the others early. Use silent-write-then-share if the room goes quiet |

### 6. Define future-state journey — {{TIME_6}}

| Item | Detail |
|---|---|
| **Lead** | {{LEAD_NAME}} |
| **Anchored to** | `current-state-journey.md` (the journey we're disrupting) + the selected concept |
| **Materials** | Print the current-state journey LARGE, redraw the stages with sticky notes |
| **Key questions** | "Which stages disappear?" · "Which stages get faster?" · "What new stages does the AI introduce that didn't exist before?" |
| **Facilitator notes** | The output is the basis of `future-state-journey.md` — capture stage-by-stage, including which stages the prototype directly touches |

### 7. Live prototyping — {{TIME_7}}

| Item | Detail |
|---|---|
| **Lead** | {{LEAD_NAME}} (whoever's quickest in Spark/Studio) |
| **Anchored to** | The selected concept + one scene from the future-state journey |
| **Materials** | GitHub Spark, Copilot Studio, sample data |
| **Approach** | Pick the most visceral moment of the future-state journey. Generate a working sketch in Spark while the customer watches. Iterate on the spot. |
| **Outputs captured** | The Spark prompts used go into `spark-prompts.md`. Screenshots/recording go into `sources/workshop/`. |
| **Facilitator notes** | This is the wow-moment of the workshop — protect the time. Cut earlier sections if you're behind |

### 8. Next steps & close — {{TIME_8}}

| Item | Detail |
|---|---|
| **Lead** | {{FACILITATOR_NAME}} |
| **Anchored to** | The expectations captured in section 1 |
| **Materials** | One slide listing: decisions made, things parked, what we owe the customer, what they owe us |
| **Key questions** | "Did we deliver what you asked for in section 1?" · "What's the one thing you'd change about today?" |
| **Facilitator notes** | Confirm dates for the V1 review and the final handoff. Capture everything into the workshop record |

---

## Reference: form factors for ideation

| Form factor | When it fits | Microsoft tech |
|---|---|---|
| **Web app** | Dashboards, portals, workflow tools | React + Azure App Service / SWA |
| **Conversational** | Q&A, guided assistant, voice front-ends | Copilot Studio, Azure OpenAI |
| **Agentic** | Autonomous AI acting on triggers | Foundry Agents, Semantic Kernel |
| **Copilot extension** | Embedded in M365 apps the user already lives in | Copilot extensibility |
| **Low-code** | Business-user workflows, approvals | Power Platform |
| **Data-centric** | AI-powered insight surfaces | Power BI + Copilot, Fabric |

---

## Open questions / parking lot

> Populated during the workshop. Items here either become action items below or get carried into the next engagement.

- {{OPEN_QUESTION_1}}
- {{OPEN_QUESTION_2}}

---

## Action items (captured live)

| # | Owner | Action | Due |
|---|---|---|---|
| 1 | {{OWNER}} | {{ACTION}} | {{DUE}} |
| 2 | {{OWNER}} | {{ACTION}} | {{DUE}} |

---

## Sign-off

| Reviewed by | Role | Date | Signature / approval note |
|---|---|---|---|
| {{FACILITATOR_NAME}} | Facilitator | {{DATE}} | {{SIGNATURE}} |
| {{CUSTOMER_LEAD}} | Customer lead | {{DATE}} | {{SIGNATURE}} (agreed to attend) |

> Customer pre-workshop sign-off confirms attendance, format, and that they've received the pre-reads. The post-workshop record (separate deliverable) captures what was actually decided.
