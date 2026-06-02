---
description: "Engagement documentation conventions for VIBE Prototyping templates"
applyTo: "templates/**"
---

# VIBE Engagement Documentation Conventions

Standards for engagement documents created during VIBE Prototyping engagements.

## Placeholder Syntax

- Use `{{PLACEHOLDER_NAME}}` for values that must be filled per engagement
- Use UPPER_SNAKE_CASE for placeholder names
- Remove placeholder markers once filled — do not leave `{{}}` in final documents

## Document Updates

- PROJECT-CONTEXT.md is the single source of truth — update it whenever decisions are made
- CHECK-IN-NOTES.md is append-only — never modify previous check-in entries
- selected-concept.md requires customer sign-off before prototyping begins (the Disrupt contract)
- engineering-brief.md requires squad-lead sign-off before Build feature work starts
- solution-design.md tracks architecture decisions with rationale and alternatives

## Writing Style

- Use plain language accessible to non-technical stakeholders
- Lead with impact: state the "so what" before the details
- Tables over prose for structured data
- Use sentiment indicators (👍 😐 👎) in customer feedback tracking
- Frame business value explicitly: reference the "$50K vs $50M" lens

## Cross-References

- Link between documents using relative paths: `[selected concept](selected-concept.md)`
- Reference ADO work items by ID when they exist
- Tag decisions with source (meeting name, transcript, workshop)
