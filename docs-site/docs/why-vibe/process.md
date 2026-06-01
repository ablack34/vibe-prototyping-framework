---
sidebar_position: 2
title: The VIBE Process
---

# The Six Phases

VIBE Prototyping follows six phases. The first four don't require an engineer — the TPM or designer can drive them.

<div className="phase-grid">
  <div className="phase-card">
    <div className="phase-number">01</div>
    <h3>Preparation</h3>
    <p>Land the engagement well. Draft both briefs, run dual-path customer research, schedule all 4 weeks of meetings — before kickoff.</p>
    <div className="phase-who">👥 Anyone · Week 0 (3-5 days)</div>
  </div>
  <div className="phase-card">
    <div className="phase-number">02</div>
    <h3>Discover</h3>
    <p>Understand the problem through customer research, meeting transcripts, and stakeholder alignment.</p>
    <div className="phase-who">👥 Anyone · 1-3 days</div>
  </div>
  <div className="phase-card">
    <div className="phase-number">03</div>
    <h3>Define</h3>
    <p>Frame the business value, prioritize use cases, and define what success looks like.</p>
    <div className="phase-who">👥 Anyone · 1-2 days</div>
  </div>
  <div className="phase-card">
    <div className="phase-number">04</div>
    <h3>Ideate</h3>
    <p>Brainstorm AI-powered concepts across form factors. Visualize with GitHub Spark prompts.</p>
    <div className="phase-who">👥 Anyone · 1 day</div>
  </div>
  <div className="phase-card">
    <div className="phase-number">05</div>
    <h3>Build</h3>
    <p>Engineer the prototype with real data, deploy to Azure, iterate on customer feedback.</p>
    <div className="phase-who">🔧 Engineer · 5-10 days</div>
  </div>
  <div className="phase-card">
    <div className="phase-number">06</div>
    <h3>Deliver</h3>
    <p>Generate the roadmap, ADO backlog, and handoff package for the customer.</p>
    <div className="phase-who">👥 Anyone · 1-2 days</div>
  </div>
</div>

---

## Week-by-Week Timeline

<div className="timeline">
  <div className="timeline-item">
    <div className="timeline-week">Week 0 — Preparation</div>
    <h3>Land the engagement well before kickoff</h3>
    <p>Draft both briefs (S42-internal commercial context + customer-voice problem statement), run dual-path customer research (public web via Task Researcher + tenant signal via M365 Researcher), and schedule all 7 meetings of the engagement. Preparation is deliberately non-technical — its job is to ensure Discover starts from a strong base.</p>
    <p><strong>Outputs:</strong> engagement-brief.md · customer-brief.md · sources/meeting-templates.md · sources/research/research-summary.md</p>
  </div>
  <div className="timeline-item">
    <div className="timeline-week">Week 1 — Discover</div>
    <h3>Uncover user needs, business goals, and AI opportunities</h3>
    <p>Through <strong>focused</strong> research and stakeholder alignment. Process meeting transcripts, send questionnaires, capture workshop insights. The framework automatically extracts context from Teams recordings.</p>
    <p><strong>Outputs:</strong> Product Vision & Strategy · Personas & User Journey · Filled PROJECT-CONTEXT.md</p>
  </div>
  <div className="timeline-item">
    <div className="timeline-week">Week 1-2 — Define</div>
    <h3>Frame the problem, prioritize use cases, establish success metrics</h3>
    <p>That guide <strong>live</strong> prototyping efforts. Answer the key question: "Are we solving a $50K problem or a $50M problem?"</p>
    <p><strong>Outputs:</strong> Requirements Summary (customer sign-off) · Prioritized use cases</p>
  </div>
  <div className="timeline-item">
    <div className="timeline-week">Week 2 — Ideate</div>
    <h3>Brainstorm AI-powered concepts across form factors</h3>
    <p>Generate 2-3 concepts — web apps, conversational agents, Copilot extensions, agentic solutions. Visualize with GitHub Spark prompts. Select the best approach.</p>
    <p><strong>Outputs:</strong> Concept comparison · Screen narratives · Engineering brief · Spark prompts</p>
  </div>
  <div className="timeline-item">
    <div className="timeline-week">Week 2-3 — Design & Develop</div>
    <h3>Rapidly prototype and iterate AI-powered solutions</h3>
    <p>With cross-functional collaboration. Engineer builds from the engineering brief, iterates based on customer check-in feedback.</p>
    <p><strong>Outputs:</strong> Prototype V1 → V2 → Final Prototype (deployed to Azure)</p>
  </div>
  <div className="timeline-item">
    <div className="timeline-week">Week 3-4 — Deliver</div>
    <h3>Validate the prototype, gather feedback, prepare handoff</h3>
    <p>Generate the product roadmap, ADO backlog (Epics → Features → Stories), prototype limitations, and complete handoff package.</p>
    <p><strong>Outputs:</strong> Product Roadmap · Product Backlog · Handoff Package</p>
  </div>
</div>

---

## Evolved Design Thinking

> "Are we solving a $50,000 problem? Could we be solving a **$50 million** problem?"

<div className="problem-grid">
  <div className="problem-card" style={{borderTopColor: 'var(--s42-gradient-start)'}}>
    <h3>🔍 Problem</h3>
    <p><strong>Find and validate an important problem to solve.</strong> Talk to real users, key experts, and analyze data to identify opportunities that create measurable benefit such as time or cost savings.</p>
  </div>
  <div className="problem-card" style={{borderTopColor: 'var(--s42-gradient-end)'}}>
    <h3>💡 Solution</h3>
    <p><strong>Imagine and validate a revolutionary solution.</strong> Quickly iterate on increasingly refined prototypes. At each iteration, user feedback points towards improvements and real needs.</p>
  </div>
  <div className="problem-card" style={{borderTopColor: '#10b981'}}>
    <h3>🔨 Implement</h3>
    <p><strong>Implement and validate a live prototype.</strong> Integrate user testing feedback into every iteration for critical alignment and high velocity improvement.</p>
  </div>
</div>

---

## Engagement Team

| Role | Source | Responsibility |
|------|--------|---------------|
| Technical Product Manager | Studio 42 | Drives Preparation, Discover, Define, Ideate, Deliver |
| Dev Engineer | Studio 42 | Leads Build phase |
| Designer | Studio 42 | UX research, concept development |
| Data Scientist | EAG | Data analysis, AI model guidance |
| Architect | ISD/EAG | Technical architecture review |
