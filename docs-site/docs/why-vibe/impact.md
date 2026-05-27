---
sidebar_position: 5
title: What the Harness Changes
---

# What the Harness Changes

The [VIBE delivery harness](/why-vibe/scaling-vibe) transforms a manual, person-dependent process into a **repeatable, AI-assisted engagement model** that any team member can drive.

This page describes the qualitative changes — what gets automated, what changes for the team, and how the harness embeds Hypervelocity Engineering (HVE) patterns at every stage.

:::info Internal economics
ROI scenarios with $ figures and adoption cost analysis live in the [pitch package](https://github.com/ablack34/vibe-prototyping-framework/tree/main/pitch) (internal-only). This page covers the qualitative case.
:::

---

## Before vs. after the harness

### Without the harness

- Every VIBE engagement starts from scratch
- Context scattered across meeting notes, emails, and chat messages
- Only engineers can build prototypes
- Documentation is inconsistent and often incomplete
- Handoff quality varies by team
- The TPM or designer is dependent on the engineer for everything

### With the harness

- Engagement workflow is codified and repeatable
- Context automatically extracted from Teams transcripts and customer documents
- The TPM or designer drives Discover, Disrupt, and Ideate independently
- AI-powered concepts explored across multiple form factors before engineering starts
- Consistent documentation and handoff quality every time
- Engineers get a clear brief instead of interpreting raw requirements

---

## What the TPM or designer can drive solo

<div className="stat-grid">
  <div className="stat-card">
    <div className="stat-number">3</div>
    <div className="stat-label">Phases a TPM can drive without an engineer</div>
  </div>
  <div className="stat-card">
    <div className="stat-number">14</div>
    <div className="stat-label">AI-powered prompts encoding the workflow</div>
  </div>
  <div className="stat-card">
    <div className="stat-number">7</div>
    <div className="stat-label">Specialized agents with defined I/O and quality gates</div>
  </div>
  <div className="stat-card">
    <div className="stat-number">0</div>
    <div className="stat-label">Manual note-taking needed (transcripts do it)</div>
  </div>
</div>

---

## What the harness replaces

| Manual delivery task | Now automated by |
|----------------------|------------------|
| Taking meeting notes | `/vibe-transcript` extracts from Teams recordings |
| Writing discovery questions | `/vibe-questionnaire` generates Microsoft Forms |
| Synthesizing scattered findings | `/vibe-consolidate` reads all sources |
| Brainstorming prototype approaches | `/vibe-ideate` generates multi-form-factor concepts |
| Writing ADO work items | `/vibe-backlog-gen` creates Epics → Features → Stories |
| Producing handoff documentation | `/vibe-handoff` generates the full package |
| "What should I do next?" | `@VIBE Engagement Lead` always knows |

The harness automates the non-creative work so the team can focus on the parts that require empathy, creativity, and domain expertise.

---

## Built on Hypervelocity Engineering (HVE)

The harness is built on **Hypervelocity Engineering** — Microsoft's methodology for AI-augmented delivery at unprecedented speed and quality. HVE patterns are embedded throughout.

### HVE patterns in the harness

<div className="problem-grid">
  <div className="problem-card" style={{borderTopColor: 'var(--s42-gradient-start)'}}>
    <h3>🔄 Task Pipeline</h3>
    <p><strong>HVE pattern:</strong> Research → Plan → Implement → Review</p>
    <p><strong>In the harness:</strong> Engineers use the full HVE task pipeline (<code>/task-research</code> → <code>/task-plan</code> → <code>/task-implement</code> → <code>/task-review</code>) during the Build phase. Every feature is researched, planned, and validated — not just coded.</p>
  </div>
  <div className="problem-card" style={{borderTopColor: 'var(--s42-gradient-end)'}}>
    <h3>🤖 AI Agents as Specialists</h3>
    <p><strong>HVE pattern:</strong> Specialized agents for focused tasks with defined protocols</p>
    <p><strong>In the harness:</strong> 7 custom agents, each with a clear role, defined inputs/outputs, and quality gates. Agents generate documents from sources — the delivery person reviews, not writes.</p>
  </div>
  <div className="problem-card" style={{borderTopColor: '#10b981'}}>
    <h3>📋 Opinionated Prompts</h3>
    <p><strong>HVE pattern:</strong> Codified, reusable workflows that encode best practices</p>
    <p><strong>In the harness:</strong> 14 purpose-built prompts encode the entire VIBE engagement methodology. The TPM or designer executes complex workflows by typing a single command.</p>
  </div>
  <div className="problem-card" style={{borderTopColor: '#f59e0b'}}>
    <h3>📐 Instructions as Guardrails</h3>
    <p><strong>HVE pattern:</strong> Auto-applied coding standards and conventions</p>
    <p><strong>In the harness:</strong> Instruction files automatically enforce engagement documentation conventions, prototype coding standards, and data handling best practices — without manual review.</p>
  </div>
  <div className="problem-card" style={{borderTopColor: '#8b5cf6'}}>
    <h3>📊 Evidence-Based Decisions</h3>
    <p><strong>HVE pattern:</strong> Grounding AI outputs in verified sources</p>
    <p><strong>In the harness:</strong> Every prioritization claim cites a source. Discovery fields are quality-graded (A/B/C). Concept validation checks AI essentiality and data feasibility. Cross-reference validation ensures handoff consistency.</p>
  </div>
  <div className="problem-card" style={{borderTopColor: '#ec4899'}}>
    <h3>🔁 Progressive Refinement</h3>
    <p><strong>HVE pattern:</strong> Iterative improvement with human-in-the-loop validation</p>
    <p><strong>In the harness:</strong> Every document is auto-generated, then reviewed. Handoff package is built section-by-section with approval gates. Check-in feedback loops back into the context automatically.</p>
  </div>
</div>

### Why HVE matters for the harness

> "Without trusted sources that include reliable code, context, and opinionated prompts, agents won't do their best work."
> — Hypervelocity Engineering, Microsoft ISE

Traditional prototyping is **person-dependent** — quality varies by who's on the team. HVE-powered prototyping is **process-dependent** — quality is encoded in the agents, prompts, and validation gates.

The result: **any team member with the harness produces consistent, high-quality engagement artifacts — regardless of prior experience** — because the best practices are built into the tooling, not just tribal knowledge.

---

## See also

- [Scaling VIBE — The Delivery Harness](/why-vibe/scaling-vibe) — what the harness is and why we need it
- [For leadership](/why-vibe/leadership) — the case for adopting the harness as default tooling
- [The 5 phases](/why-vibe/process) — how a VIBE engagement runs end-to-end
