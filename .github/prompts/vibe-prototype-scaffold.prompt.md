---
description: "Scaffold a new React + .NET prototype from engagement requirements"
agent: "VIBE Engagement Lead"
argument-hint: "[engagement=...]"
---

# VIBE Prototype Scaffold

Scaffolds a new React + .NET prototype based on the engagement's PROJECT-CONTEXT.md and requirements-summary.md. Generates customer-specific personas, data models, routes, and page shells.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists.

## Requirements

1. Read `templates/PROJECT-CONTEXT.md` and `templates/requirements-summary.md` for context.
2. Read `scaffold/data/README.md` for available data models (if data prep has been done).
3. Customize the scaffold:
   - Update persona definitions in `scaffold/web/src/store.ts` based on identified personas
   - Create page shells in `scaffold/web/src/pages/` for each primary view
   - Update route configuration in `scaffold/web/src/App.tsx` with persona-based navigation
   - Update API endpoints in `scaffold/api/Program.cs` to serve the data models
4. Verify both projects build: `npm run build` (web) and `dotnet build` (api).
5. Present a summary of what was generated and recommend running `start.ps1` to test locally.
