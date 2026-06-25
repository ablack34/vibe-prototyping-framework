# Engagement Sources

Drop customer-provided materials and captured workshop notes here. The `@VIBE Discover` agent reads everything in this folder as its **first step** before asking any questions.

:::tip Just want to try the framework?
Run `/vibe-demo` in Copilot Chat — it copies the **Tailwind Traders** fixture (customer brief, two questionnaires, two transcripts, four CSVs) into this folder so you can run every phase end-to-end without a real customer. Source: [`demo/tailwind/`](../demo/tailwind/).
:::

## What Goes Here

| Type | Examples | How It Gets Here |
|------|---------|-----------------|
| **Customer documents** | Slide decks, RFPs, process diagrams, strategy docs | Customer shares them — you drop them in |
| **Questionnaire responses** | Pre-workshop questionnaire answers | Export from Microsoft Forms or paste into `questionnaire-responses.md` |
| **Meeting transcripts** | Teams transcript exports for offline analysis | Paste content or save as `transcript-<meeting>.md` |
| **Workshop notes** | Live capture during workshops | Auto-created by `/vibe-capture` prompt |
| **Meeting agendas** | Invite templates for scheduling | Auto-created by `/vibe-kickoff` |
| **Customer data (small)** | CSV/Excel under ~10MB for the prototype | Put under `sources/sample-data/` so `/vibe-data-prep` finds it |

## Supported File Types

Copilot can read: `.md`, `.txt`, `.csv`, `.json`, `.pdf`, `.docx`, `.pptx`, `.xlsx`

> **Best results with plain text or markdown.** Office files (PDF, Word, PowerPoint, Excel) are supported but may not parse perfectly — if accuracy matters, copy key content into a markdown file.
>
> **Keep individual files under 10MB** for best performance. Large datasets that aren't needed for the AI to *read* should go in `scaffold/data/` instead (the engineer wires them in via `/vibe-data-prep`).

## Auto-Generated Files

These are created by the framework prompts:

- `meeting-templates.md` — Meeting invite templates (from `/vibe-kickoff`)
- `workshop-notes.md` — Live workshop capture (from `/vibe-capture`)
- `questionnaire-responses.md` — Customer questionnaire answers (pasted after Forms submission)
