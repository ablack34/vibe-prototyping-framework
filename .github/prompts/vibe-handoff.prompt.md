---
description: "Generate the final engagement handoff package"
agent: "VIBE Deliver"
argument-hint: "[engagement=...]"
---

# VIBE Handoff

Generate the complete handoff package for a VIBE Prototyping engagement.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists.

## Requirements

1. Follow the VIBE Deliver agent protocol for generating deliverables.
2. Produce:
   - Product roadmap (Prototype → MVP → Production phases)
   - Filled `templates/PROTOTYPE-LIMITATIONS.md`
   - Consolidated handoff summary
3. Verify all engagement artifacts are complete and consistent.
4. If ADO backlog has not been generated, recommend running `/vibe-backlog-gen` first.
5. Present the handoff package for final review.
