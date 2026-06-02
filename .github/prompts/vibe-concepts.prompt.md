---
description: "Generate 2-3 candidate AI-powered concepts for the Disrupt workshop — pre-workshop preparation"
agent: "VIBE Disrupt"
argument-hint: "[engagement=...]"
---

# VIBE Concepts (Pre-Workshop)

Produce `engagement/{{engagement-kebab}}/ideation-concepts.md` and `engagement/{{engagement-kebab}}/spark-prompts.md` **before** the Disrupt workshop. These are the candidate concepts the customer reacts to in the room — they're a launchpad for co-creation, not the final answer.

This prompt is **re-runnable**: if the customer pushes back ("none of these resonate, try a different angle"), regenerate with new direction. The selected concept that comes out of the workshop is captured by `/vibe-selected-concept` afterwards.

## Inputs

- `${input:engagement}`: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## Prerequisites (block early if missing)

The Discover deliverables anchor every concept. Block with `👉 BLOCKED:` if any are missing or below Grade B:

- `engagement/{{engagement-kebab}}/personas.md` — Grade B+
- `engagement/{{engagement-kebab}}/problem-statement.md` — Grade B+
- `engagement/{{engagement-kebab}}/current-state-journey.md` — Grade B+ (the **Top 3 pains** drive concept priorities)
- `engagement/{{engagement-kebab}}/workshop-agenda.md` — should exist; the workshop agenda's section 5 "Concept Walk-Through" plans for these. Warn if missing but don't block.

## Required Steps

### Step 1 — Read all context

Read everything that anchors the concepts:

- The 3 Discover deliverables above (treat as canonical)
- `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` — for the desired-outcome and data inventory
- `engagement/{{engagement-kebab}}/customer-brief.md` and `engagement/{{engagement-kebab}}/engagement-brief.md` — for the customer's voice and S42 view
- `sources/research/research-summary.md` — if it exists, for industry context
- `engagement/{{engagement-kebab}}/workshop-agenda.md` (if exists) — to know what the customer is expecting to see in the workshop
- Any prior `engagement/{{engagement-kebab}}/ideation-concepts.md` — don't overwrite signed-off concepts; append new variants instead

Summarize the core challenge in **one sentence** (anchored to the formal problem statement and the Top 3 pains) before proceeding. The customer will see this sentence in the workshop intro.

### Step 2 — AI Opportunity Analysis

Before generating concepts, fill in this table inline in the doc:

| Question | Answer |
|----------|--------|
| **Without AI**: What does the user do today? | [current manual process, sourced from current-state-journey.md] |
| **With AI**: What becomes possible that wasn't before? | [new capability] |
| **AI role**: Is AI the core product or an accelerator? | AI-native / AI-enhanced |
| **AI capabilities needed**: What does the concept require? | Classification, generation, extraction, reasoning, conversation, vision, etc. |

If "AI role" is "accelerator" only, push the team to think harder — the framework prefers AI-native concepts where the AI is essential, not decorative.

### Step 3 — Generate 2-3 candidate concepts

Generate **2-3 concepts** across **different form factors**. Use this form-factor menu (lifted from the framework's standard concept library) — concepts can combine multiple factors:

| Form Factor | Examples | Microsoft Tech |
|---|---|---|
| Web app | Dashboard, portal, workflow tool | React + Azure, Power Apps |
| Conversational | Chat assistant, Copilot extension | Copilot Studio, Azure OpenAI, Teams bot |
| Agentic | Autonomous AI agents that act on triggers | Foundry Agents, Semantic Kernel, AutoGen |
| Copilot extension | Embedded in M365 apps the customer already uses | Copilot extensibility, Graph connectors |
| Low-code | Business user builds their own workflows | Power Platform, Power Automate, Dataverse |
| Mixed reality | Spatial visualization for field/industrial | HoloLens, Mesh |
| Data-centric | Insights from data, dashboards, reports | Fabric, Power BI + Copilot |
| Document/workflow | AI processes documents, routes approvals | Document Intelligence, Logic Apps |

**Concept Diversity Rules (enforce all four):**

1. At least one concept should be **conversational or agentic** (not a traditional UI).
2. At least one concept should be something the **customer hasn't already considered** — push their thinking.
3. Concepts should represent **genuinely different approaches**, not variations of the same idea.
4. At least one concept should be **low-complexity** (prototypable in 3-5 days) — gives the customer a safe fallback if appetite is small.

For each concept use this structure:

```markdown
### Concept [A/B/C]: "[Name]"

**Form factor:** [from the menu above]

**One-line pitch:** [What it is in one sentence]

**User experience:**
[2-3 paragraph narrative of what the user sees and does, written as a story.
"When {primary persona name} opens the app at 7am, she sees..."]

**How AI powers it:**
- [Specific AI capability 1 and what it enables]
- [Specific AI capability 2 and what it enables]

**Without AI, this wouldn't work because:**
[Why this concept falls apart without AI — the AI Essentiality check]

**How it works with mock data:**
- What data it needs and format
- How the demo stays convincing with sample data
- What live integrations would replace in production

**Microsoft technology:**
- [Specific Azure/M365 services needed]
- [Azure OpenAI model and usage pattern]

**Prototype complexity:** Low / Medium / High
**Build estimate:** X days of engineering

**Which Top-3 pain does this address?**
[Link to the specific pain in current-state-journey.md — Pain 1, 2, or 3]

**Spark prompt (if applicable):**
> [Ready-to-paste GitHub Spark prompt to quickly visualize this concept]

**Copilot Studio prompt (if conversational):**
> [Ready-to-paste prompt for Copilot Studio to prototype the conversational flow]
```

### Step 4 — Compare concepts

Present a comparison table at the end of `ideation-concepts.md`:

| | Concept A | Concept B | Concept C |
|---|---|---|---|
| **Form factor** | | | |
| **AI depth** | Surface / Core / Native | | |
| **Wow factor** | Low / Medium / High | | |
| **Mock data fit** | Easy / Moderate / Challenging | | |
| **Build complexity** | Low / Medium / High | | |
| **Customer value** | $50K / $500K / $5M+ | | |
| **Pain addressed** | Pain 1 / 2 / 3 | | |

Add a one-paragraph S42 recommendation with rationale. **Make clear this is a recommendation, not a vote.** The customer decides in the workshop. Combinations are allowed (e.g. "Concept B's surface + Concept A's AI core").

### Step 5 — Concept Validation (Quality Gate)

Before saving, validate each concept against this rubric:

| Validation Check | Question | Pass/Fail |
|-----------------|----------|-----------|
| **AI Essentiality** | Remove all AI from this concept. Is it still compelling? If YES → AI is decorative → FAIL |
| **Mock Data Feasibility** | Using ONLY plausible CSV/data files for this domain, can we demonstrate all claimed AI features? |
| **Pain Coverage** | Does this concept address at least one of the Top 3 ranked pains from current-state-journey.md? |
| **Build Estimate Reality** | Count: screens/interactions, data integrations, AI API calls, unique components. Does the day estimate match? |
| **Demo-ability in 30 mins** | Can the engineer demo this in a 30-min check-in? If no, scope is too big. |

If any concept has 2+ FAILs, revise it before saving. If the build estimate is off by >30%, adjust it before presenting.

### Step 6 — Save outputs

Save to `engagement/{{engagement-kebab}}/`:

1. **`ideation-concepts.md`** — full concept descriptions + comparison table + S42 recommendation
2. **`spark-prompts.md`** — extracted Spark and Copilot Studio prompts in a separate file so the TPM/designer can paste them without scrolling through the concept descriptions. Format:

   ```markdown
   ## Concept A — [Name]
   
   ### GitHub Spark Prompt
   > [paste-ready prompt]
   
   ### Copilot Studio Prompt (if applicable)
   > [paste-ready prompt]
   
   ## Concept B — ...
   ```

**Do NOT produce `selected-concept.md` here.** That's the workshop output — `/vibe-selected-concept` writes it after the customer chooses.

### Step 7 — Update state.json

Update `state.json.readiness.disrupt.conceptsBoard`:

```json
{
  "status": "filled" | "partial" | "empty",
  "grade": "A" | "B" | "C",
  "path": "engagement/{{engagement-kebab}}/ideation-concepts.md",
  "conceptCount": <number of concepts generated>,
  "lastUpdated": "<ISO timestamp>"
}
```

Grade rubric (lowest grade across all concepts wins):

| Grade | Criteria |
|---|---|
| **A** | 3 concepts, all pass validation, each addresses a different Top-3 pain, all 4 diversity rules met, Spark prompts paste-ready |
| **B** | 2-3 concepts, all pass validation, at least 3 of 4 diversity rules met |
| **C** | Only 1 viable concept, OR diversity rules failed, OR any concept fails 2+ validation checks |

If `readiness.disrupt` does not yet exist in state.json, create it.

### Step 8 — Present and ask for review

Present:

- One-line summary per concept (name, form factor, pain addressed, complexity)
- Overall grade
- S42's recommended concept and why
- Which concepts the customer is most likely to react strongly to (positive or negative) — useful for the facilitator

End with one of these directives:

- If Grade A or B: `👉 NEXT: Concepts are ready for the workshop. Paste the Spark prompts from spark-prompts.md into spark.github.com BEFORE the workshop so visuals are ready. After the workshop, run /vibe-workshop-record to capture decisions, then /vibe-selected-concept to record which concept (or combination) won.`
- If Grade C: `👉 NEXT: Only {N} viable concept(s) — need more diversity. Try re-running /vibe-concepts with explicit direction (e.g. "more agentic angle" or "low-code form factor"), or accept the gap and proceed knowing the workshop may pivot.`
- If re-run after rejection: `👉 NEXT: New concepts generated based on the rejected direction. Re-share Spark prompts with customer or take them into the next workshop session.`

## Notes

- Re-running `/vibe-concepts` is safe — old concept versions are NOT auto-deleted but a new file replaces the previous draft. If the customer pre-vetted some concepts, mark those concepts with `> _Pre-vetted by {customer name} on {date} — preserve_` and the prompt will preserve them across re-runs.
- This prompt does NOT modify `PROJECT-CONTEXT.md`. It generates fresh concepts grounded in Discover.
- **Mock-data constraint applies to every concept.** No live API connections. If a concept needs live data to be convincing, downgrade it or replace it.
- If the engagement has unique Microsoft tech constraints (e.g. "no Power Platform", "Foundry only"), the squad should drop a note in `sources/constraints.md` and this prompt will respect it.
