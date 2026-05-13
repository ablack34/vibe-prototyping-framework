---
description: "Process Teams meeting transcripts to extract engagement context"
agent: "VIBE Transcript Analyst"
argument-hint: "engagement=... [dateRange=...] [participants=...]"
---

# VIBE Transcript

Process Teams meeting transcripts using work-iq-mcp to extract requirements, decisions, pain points, and business value signals for a VIBE engagement.

## Inputs

- ${input:engagement}: (Required) Engagement name (used to locate tracking directory).
- ${input:dateRange}: (Optional) Date range to search for meetings (e.g., "last 2 weeks").
- ${input:participants}: (Optional) Key participant names to narrow the search.
- ${input:type:discovery}: (Optional, defaults to discovery) Transcript type: `discovery` or `check-in`.

## Requirements

1. Follow the VIBE Transcript Analyst protocol, starting with the data sensitivity notice.
2. Search for meetings matching the engagement context.
3. Extract VIBE-specific signals (problem statements, business value, pain points, feasibility).
4. Save analysis to `.copilot-tracking/vibe/{{engagement-name}}/transcript-analysis.md`.
5. For check-in transcripts, also append findings to `templates/CHECK-IN-NOTES.md`.
