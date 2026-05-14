---
description: "Scaffold a new prototype driven by engagement requirements"
agent: "VIBE Engagement Lead"
argument-hint: "[engagement=...]"
---

# VIBE Prototype Scaffold

Scaffolds a prototype that is **shaped by the problem and requirements**, not a generic template. The UI, navigation, and page structure emerge from what was discovered and prioritized — not from a pre-built dashboard pattern.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists.

## Requirements

1. Read these files to understand what needs to be built:
   - `templates/PROJECT-CONTEXT.md` — Problem, personas, desired outcome
   - `templates/requirements-summary.md` — Prioritized requirements with acceptance criteria
   - `templates/solution-design.md` — Architecture and build phases (if exists)
   - `scaffold/data/README.md` — Available data models (if data prep has been done)

2. **Design the UI from the requirements, not from a template.** Before writing any code, produce a brief UI plan:
   - What are the key screens/views the prototype needs? (derived from requirements, not assumed)
   - What is the primary user flow? (derived from personas and use cases)
   - What layout pattern best serves this specific problem? (it might be a dashboard, a wizard, a chat interface, a form, a map view, a timeline — whatever fits)
   - What visual tone suits the customer's context? (enterprise/clinical/consumer/creative)

3. Present the UI plan to the user for confirmation before generating code.

4. Generate only what the requirements call for:
   - Create pages in `scaffold/web/src/pages/` for each planned screen
   - Create components in `scaffold/web/src/components/` for UI patterns specific to this prototype
   - Set up routing in `scaffold/web/src/App.tsx` matching the user flow
   - Wire API endpoints in `scaffold/api/Program.cs` to serve the data the UI needs
   - If multiple user roles exist in the requirements, add a role context — otherwise don't

5. Do NOT include:
   - Pre-built KPI cards or dashboards unless the requirements call for metrics views
   - A sidebar navigation pattern unless it's the right fit for the problem
   - Placeholder content — every element should relate to a requirement
   - A dark theme by default — choose a visual tone that fits the customer's context

6. Verify both projects build: `npm run build` (web) and `dotnet build` (api).
7. Present a summary of what was generated, how it maps to requirements, and recommend running `start.ps1` to test locally.
