---
sidebar_position: 2
title: The VIBE Process
---

# The VIBE Phases

VIBE Prototyping follows a structured workflow across multiple phases. The recommended path is **Preparation → Discover → Disrupt → Build → Deliver**. The first three phases don't require an engineer — the TPM or designer can drive them.

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
    <h3>Disrupt</h3>
    <p>The one phase where the customer co-creates with us. Week 2 workshop produces the selected concept, storyboard, and future-state journey — the contract handed to engineering.</p>
    <div className="phase-who">👥 Delivery team + customer · Week 2</div>
  </div>
  <div className="phase-card">
    <div className="phase-number">04</div>
    <h3>Build</h3>
    <p>Engineer the prototype with real data, deploy to Azure, iterate on customer feedback.</p>
    <div className="phase-who">🔧 Engineer · 5-10 days</div>
  </div>
  <div className="phase-card">
    <div className="phase-number">05</div>
    <h3>Deliver</h3>
    <p>Generate the roadmap, ADO backlog, and handoff package for the customer.</p>
    <div className="phase-who">👥 Anyone · 1-2 days</div>
  </div>
</div>

> ⚠️ **Legacy alternative to Disrupt: Define + Ideate.** The original framework split Disrupt's work into two separate phases — `@VIBE Define` (frame business value, prioritize use cases, produce requirements-summary.md) followed by `/vibe-ideate` (brainstorm 2-3 AI-powered concepts and produce an engineering brief in one pass). Both are kept available for engagements that started before Disrupt existed; new engagements should use Disrupt.

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
    <div className="timeline-week">Week 2 — Disrupt</div>
    <h3>Customer co-creation workshop</h3>
    <p>The one phase where the customer is in the room with us. Pre-workshop: draft the agenda and generate 2-3 candidate concepts + Spark prompts. In-workshop: humans co-create. Post-workshop: record the workshop, capture the selected concept, produce the storyboard and future-state journey.</p>
    <p><strong>Outputs:</strong> workshop-agenda.md · ideation-concepts.md · spark-prompts.md · workshop-record.md · selected-concept.md · storyboard.md · future-state-journey.md</p>
    <p><em>Legacy alternative (kept for in-flight engagements):</em> Week 1-2 Define produces requirements-summary.md for customer sign-off, then Week 2 Ideate generates concepts + engineering brief in one pass.</p>
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
