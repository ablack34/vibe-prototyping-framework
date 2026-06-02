---
description: "Frame the business value and prioritize use cases for the prototype"
agent: "VIBE Define"
argument-hint: "[engagement=...]"
---

# VIBE Define

Frame the "$50K vs $50M" business value, prioritize use cases, and produce the requirements summary for customer sign-off. This phase is deliberately non-technical — no architecture or tech stack discussion.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists.

## Requirements

1. Follow the VIBE Define agent protocol.
2. Read all discovery outputs:
   - `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md`
   - `engagement/{{engagement-kebab}}/personas.md` (canonical personas)
   - `engagement/{{engagement-kebab}}/problem-statement.md` (canonical formal statement)
   - `engagement/{{engagement-kebab}}/current-state-journey.md` (canonical journey + ranked pain points)
   - `engagement/{{engagement-kebab}}/transcript-analysis.md` (if exists)
   - `engagement/{{engagement-kebab}}/discovery-summary.md` (if exists)
3. If any of the three structured deliverables (personas, problem-statement, current-state-journey) is missing or below Grade B, stop and recommend going back to Discover before proceeding.
4. Guide the user through value framing and use case prioritization. Anchor value framing to the "which results in" line of `problem-statement.md` and prioritization to the "Top pain points (ranked)" of `current-state-journey.md`.
5. Produce `templates/requirements-summary.md` with must/should/could requirements.
6. Get customer sign-off recommendation before moving to Ideate.
