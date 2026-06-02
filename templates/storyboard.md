# Storyboard

> **Disrupt deliverable (flagship).** **Auto-generated** by `/vibe-storyboard` from the selected concept, the future-state journey, and the primary persona. Scene-by-scene visual narrative of the prototype in use.
>
> **This is the contract between Disrupt and Design & Develop.** The engineer reads this storyboard and writes `engineering-brief.md` from it. Get this right and the engineer's first day in D&D is unblocked.
>
> **How this document gets populated:**
> 1. The Disrupt workshop produces `selected-concept.md` and `future-state-journey.md`
> 2. `/vibe-storyboard` reads both plus the primary persona and drafts 4-6 scenes
> 3. The team (often with the customer) reviews the scenes, sketches them on a whiteboard or in Figma, attaches the visuals
> 4. Sign-off captured — engineer can now build from this

---

## Grading

The agent grades this document **A / B / C**:

- **Grade A (Strong)** — 4-6 scenes, each with a sourced caption (quote from persona or workshop), visual attached (link to image/figma/sketch), and a clear arc (character → challenge → solution → impact). Every scene cites the persona pain it addresses
- **Grade B (Sufficient)** — 4-6 scenes with captions and the arc, even if visuals are still placeholders
- **Grade C (Needs follow-up)** — fewer than 4 scenes, or scenes don't form an arc, or no anchor to the persona's actual pains

Design & Develop cannot start until this document is at **Grade B or higher**.

---

## Story setup

| Field | Value |
|---|---|
| **Title** | {{STORYBOARD_TITLE}} (e.g. "Sarah's Better Workday") |
| **Main character** | {{PRIMARY_PERSONA_NAME}} ({{PRIMARY_PERSONA_ROLE}}) — see [`personas.md`](./personas.md) |
| **Concept being demonstrated** | {{CONCEPT_NAME}} — see [`selected-concept.md`](./selected-concept.md) |
| **Form factor** | {{FORM_FACTOR}} (web app / conversational / agentic / copilot-extension / low-code) |
| **Time period of the story** | {{ONE_WORKDAY_OR_ONE_TASK_OR_ONE_WEEK}} |

---

## The arc

Every storyboard tells the same shape of story:

| Stage | Question the scene answers |
|---|---|
| **1. Setup** | Who is {{PRIMARY_PERSONA_NAME}} and what's their world today? |
| **2. Challenge** | What's the pain — the moment things go wrong or get hard? |
| **3. Encounter** | The prototype appears. What does it look like? |
| **4. Solution** | How does the prototype turn the pain into progress? |
| **5. Impact** | What's different at the end? What did {{PRIMARY_PERSONA_NAME}} just save / unlock / avoid? |

Scenes below map to these stages — typically one scene per stage, sometimes two if a stage needs more space.

---

## Scene 1 — {{SCENE_1_TITLE}}

| Field | Value |
|---|---|
| **Arc stage** | Setup |
| **Visual** | {{LINK_OR_DESCRIPTION_OF_SKETCH_OR_SLIDE}} |
| **Caption** | {{ONE_LINE_NARRATION}} |
| **Persona pain addressed** | {{PAIN_FROM_PERSONA_OR_NONE}} |
| **Sourced from** | {{CURRENT_JOURNEY_STAGE_OR_TRANSCRIPT_QUOTE}} |

**Detail (what to draw / show):**

{{SCENE_1_VISUAL_DESCRIPTION}}

**Why this scene exists:** {{SCENE_1_RATIONALE}}

---

## Scene 2 — {{SCENE_2_TITLE}}

| Field | Value |
|---|---|
| **Arc stage** | Challenge |
| **Visual** | {{LINK_OR_DESCRIPTION}} |
| **Caption** | {{ONE_LINE_NARRATION}} |
| **Persona pain addressed** | {{PAIN_FROM_PERSONA}} |
| **Sourced from** | {{CURRENT_JOURNEY_STAGE_OR_QUOTE}} |

**Detail:** {{SCENE_2_VISUAL_DESCRIPTION}}

**Why this scene exists:** {{SCENE_2_RATIONALE}}

---

## Scene 3 — {{SCENE_3_TITLE}}

| Field | Value |
|---|---|
| **Arc stage** | Encounter |
| **Visual** | {{LINK_OR_DESCRIPTION}} |
| **Caption** | {{ONE_LINE_NARRATION}} |
| **Persona pain addressed** | {{PAIN_OR_NEW_OPPORTUNITY}} |
| **Sourced from** | {{SELECTED_CONCEPT_REFERENCE}} |

**Detail:** {{SCENE_3_VISUAL_DESCRIPTION}}

**Why this scene exists:** {{SCENE_3_RATIONALE}}

---

## Scene 4 — {{SCENE_4_TITLE}}

| Field | Value |
|---|---|
| **Arc stage** | Solution |
| **Visual** | {{LINK_OR_DESCRIPTION}} |
| **Caption** | {{ONE_LINE_NARRATION}} |
| **Persona pain addressed** | {{PAIN_RESOLVED}} |
| **Sourced from** | {{FUTURE_JOURNEY_STAGE_OR_SPARK_SCREENSHOT}} |

**Detail:** {{SCENE_4_VISUAL_DESCRIPTION}}

**Why this scene exists:** {{SCENE_4_RATIONALE}}

---

## Scene 5 — {{SCENE_5_TITLE}}

| Field | Value |
|---|---|
| **Arc stage** | Impact |
| **Visual** | {{LINK_OR_DESCRIPTION}} |
| **Caption** | {{ONE_LINE_NARRATION}} (often the most quotable line of the whole storyboard) |
| **Persona pain addressed** | (the change in {{PRIMARY_PERSONA_NAME}}'s day/week — the "after" picture) |
| **Sourced from** | {{OKR_OR_SUCCESS_METRIC_FROM_ENGAGEMENT_BRIEF}} |

**Detail:** {{SCENE_5_VISUAL_DESCRIPTION}}

**Why this scene exists:** {{SCENE_5_RATIONALE}}

---

> Add scenes 6 and 7 below if the arc needs more space. Aim for 4-6 scenes total — fewer and the story is thin, more and the engineer can't hold it in their head.

---

## Source evidence

| Scene | Source | Quote / reference |
|---|---|---|
| 1 | `engagement/{{engagement-kebab}}/personas.md` § {{PERSONA_NAME}} | {{REFERENCE}} |
| 2 | `engagement/{{engagement-kebab}}/current-state-journey.md` § Stage {{N}} | {{REFERENCE}} |
| 3 | `engagement/{{engagement-kebab}}/selected-concept.md` | {{REFERENCE}} |
| 4 | `engagement/{{engagement-kebab}}/future-state-journey.md` § Stage {{N}} | {{REFERENCE}} |
| 5 | `engagement/{{engagement-kebab}}/engagement-brief.md` § Success metrics | {{REFERENCE}} |

---

## What the engineer reads next

After this storyboard is signed off, the engineer:

1. Reads scenes 3 and 4 to understand the core interaction
2. Reads scenes 1 and 2 to understand who they're building for
3. Reads scene 5 to understand the success criterion
4. Runs `/vibe-engineering-brief` (in Design & Develop) to translate this storyboard into the technical PRD half

---

## Sign-off

| Reviewed by | Role | Date | Signature / approval note |
|---|---|---|---|
| {{REVIEWER_NAME}} | {{REVIEWER_ROLE}} | {{DATE}} | {{SIGNATURE}} |
| {{CUSTOMER_LEAD}} | Customer lead | {{DATE}} | {{SIGNATURE}} |

> Customer sign-off is **required** before Design & Develop starts — building from an unsigned storyboard means building the wrong thing.
