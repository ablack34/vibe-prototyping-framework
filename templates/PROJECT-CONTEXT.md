# Project Context — {{PROJECT_NAME}}

> **Single source of truth** for the engagement. Update this document throughout the build.
> Created by `/vibe-kickoff` prompt. Maintained by all VIBE agents.

---

## 1. Engagement Overview

| Field | Value |
|-------|-------|
| **Customer** | {{CUSTOMER_NAME}} |
| **Project Name** | {{PROJECT_NAME}} |
| **Engagement Size** | {{ENGAGEMENT_SIZE}} (XS / S / M / L) |
| **Start Date** | {{START_DATE}} |
| **End Date** | {{END_DATE}} |
| **S42 Lead** | {{LEAD_NAME}} |
| **Status** | Discovery |

## 2. Squad

| Role | Name | Availability |
|------|------|-------------|
| Technical Product Manager | {{TPM_NAME}} | Full-time |
| Dev Engineer | {{DEV_NAME}} | Full-time |
| Designer | {{DESIGNER_NAME}} | Part-time |
| Data Scientist | {{DATA_SCIENTIST}} | As needed |
| Architect | {{ARCHITECT}} | As needed |

## 3. Problem Statement

### What problem are we solving?

{{PROBLEM_STATEMENT}}

### Who has this problem?

{{TARGET_USERS}}

### What is the business impact?

> Frame this as: "Are we solving a $50K problem or a $50M problem?"

{{BUSINESS_IMPACT}}

### Current state (how is this handled today?)

{{CURRENT_STATE}}

### What does "great" look like?

{{DESIRED_OUTCOME}}

## 4. Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| IDE | VS Code + GitHub Copilot | Standard rapid-prototyping setup |
| Frontend | React + TypeScript + Vite + Tailwind | SPA served by Azure Static Web Apps |
| Backend | .NET 9 Minimal APIs | Hosted on Azure App Service |
| Data | Customer-provided CSVs/Excel | Anonymized, stored in `/data/` |
| Hosting | Azure (SWA + App Service) | Deployed via GitHub Actions |
| CI/CD | GitHub Actions | Auto-deploy on push to main |

## 5. Data Available

| File | Rows | Description | Key Columns |
|------|------|-------------|-------------|
| {{DATA_FILE_1}} | {{ROW_COUNT}} | {{DESCRIPTION}} | {{KEY_COLUMNS}} |

### How the Data Links Together

{{DATA_RELATIONSHIPS}}

### Data Preparation Notes

{{DATA_PREP_NOTES}}

## 6. Stakeholders

| Name | Role | Authority Tier | Notes |
|------|------|----------------|-------|
| {{STAKEHOLDER_1}} | {{ROLE}} | 1 (Decision-maker) | {{NOTES}} |

### Authority Tiers

- **Tier 1**: Core decision-maker (product owner, project sponsor)
- **Tier 2**: Core contributor (engineers, designers, architects)
- **Tier 3**: Informed stakeholder (adjacent team leads, consultants)
- **Tier 4**: External participant (customers, external reviewers)

## 7. Key Decisions

| # | Decision | Date | Rationale | Source |
|---|----------|------|-----------|--------|
| 1 | {{DECISION}} | {{DATE}} | {{RATIONALE}} | {{SOURCE}} |

## 8. User Personas

### Persona 1: {{PERSONA_NAME}}

- **Role**: {{ROLE}}
- **Goals**: {{GOALS}}
- **Pain points**: {{PAIN_POINTS}}
- **Tech comfort**: {{TECH_LEVEL}}

## 9. Requirements Summary

### Must Have

- {{MUST_HAVE_1}}

### Should Have

- {{SHOULD_HAVE_1}}

### Could Have

- {{COULD_HAVE_1}}

### Constraints

- {{CONSTRAINT_1}}

## 10. Open Questions

| # | Question | Status | Answer |
|---|----------|--------|--------|
| 1 | {{QUESTION}} | Open | — |

## 11. Session Resume Prompt

> Use this prompt to resume context in a new Copilot Chat session:
>
> "I'm working on the {{PROJECT_NAME}} VIBE engagement for {{CUSTOMER_NAME}}.
> Read `templates/PROJECT-CONTEXT.md` for full context. We are currently in the
> {{CURRENT_PHASE}} phase. The engagement tracking directory is at
> `.copilot-tracking/vibe/{{ENGAGEMENT_KEBAB}}/`."
