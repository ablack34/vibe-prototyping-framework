# Solution Design

> **Internal technical document.** **Auto-generated** by the engineer during Design & Develop from the engineering brief produced in Ideate.
>
> **How this document gets populated:**
> 1. `/vibe-ideate` produces an engineering brief with concept, data needs, and suggested technology
> 2. The engineer reviews the brief and produces this solution design
> 3. Architecture, tech stack, data model, and build phases are filled from the brief

---

## Architecture Overview

{{ARCHITECTURE_DESCRIPTION}}

### System Diagram

```
┌────────────────────┐     ┌────────────────────┐
│  Azure Static      │     │  Azure App Service  │
│  Web App (SWA)     │────▶│  .NET 9 API         │
│                    │     │                     │
│  React + Vite      │     │  /api/*             │
│  Tailwind CSS      │     │  CSV Data Loading   │
└────────────────────┘     └────────────────────┘
         │                          │
         ▼                          ▼
    Browser (SPA)           /data/*.csv (in-memory)
```

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | React 19 + TypeScript + Vite | Fast dev loops, team familiarity |
| Styling | Tailwind CSS 4 | Rapid UI, Fluent-inspired tokens |
| State | Zustand + localStorage | No auth backend needed for prototype |
| Data fetching | TanStack React Query | Caching, stale-time config |
| Charts | Recharts | Easy bar/line/radar charts |
| Backend | .NET 9 Minimal APIs | Lightweight, CSV parsing via CsvHelper |
| Hosting | Azure SWA + App Service | Standard prototype hosting |
| IaC | Bicep | Subscription-scope modules |
| CI/CD | GitHub Actions | Auto-deploy on push to main |

## Data Model

### Source Files

| File | Format | Rows | Key Fields |
|------|--------|------|------------|
| {{DATA_FILE}} | CSV | {{ROWS}} | {{FIELDS}} |

### Generated Types

TypeScript interfaces and C# record types are auto-generated from CSV headers using `scaffold/data/scripts/generate-models.ps1`.

## Personas / Views

| Persona | Primary View | Key Features |
|---------|-------------|--------------|
| {{PERSONA}} | {{VIEW}} | {{FEATURES}} |

## Build Phases

### Phase 1: {{PHASE_1_NAME}} (Days {{START}}-{{END}})

**Goal:** {{GOAL}}

**Dependencies:** None (starting point)

**Tasks:**

- [ ] {{TASK_1}}
- [ ] {{TASK_2}}
- [ ] {{TASK_3}}

**Demo-able at end:** {{DEMO_DESCRIPTION}}

**Check-in trigger:** ☐ After this phase

### Phase 2: {{PHASE_2_NAME}} (Days {{START}}-{{END}})

**Goal:** {{GOAL}}

**Dependencies:** Phase 1 complete

**Tasks:**

- [ ] {{TASK_1}}
- [ ] {{TASK_2}}
- [ ] {{TASK_3}}

**Demo-able at end:** {{DEMO_DESCRIPTION}}

**Check-in trigger:** ☐ After this phase

### Phase 3: {{PHASE_3_NAME}} (Days {{START}}-{{END}})

**Goal:** {{GOAL}}

**Dependencies:** Phase 2 complete

**Tasks:**

- [ ] {{TASK_1}}
- [ ] {{TASK_2}}

**Demo-able at end:** {{DEMO_DESCRIPTION}}

**Check-in trigger:** ☐ After this phase

### Phase 4: Polish & Deploy (Days {{START}}-{{END}})

**Tasks:**

- [ ] Bug fixes and edge cases
- [ ] Documentation updates
- [ ] Security quick-check
- [ ] Azure deployment and verification
- [ ] Handoff preparation

## Decision Log

| # | Decision | Alternatives Considered | Rationale | Date |
|---|----------|------------------------|-----------|------|
| 1 | {{DECISION}} | {{ALTERNATIVES}} | {{RATIONALE}} | {{DATE}} |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| {{RISK}} | {{LIKELIHOOD}} | {{IMPACT}} | {{MITIGATION}} |
