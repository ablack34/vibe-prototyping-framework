---
description: "Generate pre-questionnaires for account team intake and customer pre-workshop"
agent: "VIBE Engagement Lead"
argument-hint: "[type={customer|account|both}] [engagement=...]"
---

# VIBE Questionnaire

Generate ready-to-paste prompts that create Microsoft Forms questionnaires.

## How This Works

1. This prompt generates text prompts (one for account team, one for customer)
2. Go to [Microsoft Forms](https://forms.cloud.microsoft.com) and create a new blank form
3. Click **"Draft with Copilot"** (the Copilot icon in the form editor)
4. Paste the generated prompt into the Copilot draft box
5. Copilot generates the form with all sections and questions
6. Review, adjust if needed, then click **"Collect responses"** to get the share link
7. Send the link to the account team or customer
8. When responses arrive, export them to `sources/` in the engagement repo

**Where to create forms:** [forms.cloud.microsoft.com](https://forms.cloud.microsoft.com) → New Form → Draft with Copilot

## Inputs

- ${input:type:both}: (Optional, defaults to both) Which questionnaire: `customer` (pre-workshop), `account` (internal intake), or `both`.
- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists.

## Requirements

1. Read `templates/PROJECT-CONTEXT.md` for the customer name and problem statement.
2. Generate the questionnaire prompts following the templates below.
3. Present each prompt in a fenced code block so the user can copy-paste it directly into M365 Copilot to create the form.
4. After generating, remind the user to send the customer questionnaire 3-5 days before the first workshop.

## Customer Pre-Workshop Questionnaire

Generate a prompt for the M365 Copilot Forms agent using this structure. **You MUST replace all placeholders with real values** from PROJECT-CONTEXT.md before presenting to the user:

- Replace `{{CUSTOMER_NAME}}` with the actual customer name (e.g., "Northwind Traders")
- Replace `{{PROBLEM_AREA}}` with the actual problem statement (e.g., "supply chain visibility")

Do NOT show `{{CUSTOMER_NAME}}` in the output — the user will copy-paste this directly.

```
Create a Microsoft Form called "{{CUSTOMER_NAME}} — Pre-Workshop Questionnaire" with the following:

Form description: "Help us prepare for our upcoming workshop by sharing your perspective. This takes about 5 minutes."

Section 1: "About You"
- "Your name" (short text, required)
- "Your role / title" (short text, required)
- "Your department or team" (short text)
- "How would you describe your technical comfort level?" (choice, required: Non-technical / Somewhat technical / Very technical)

Section 2: "The Problem"
- "In one sentence, what problem do you most want to solve related to {{PROBLEM_AREA}}?" (long text, required)
- "How is this handled today? What tools or processes do you use?" (long text, required)
- "What frustrates you most about the current approach?" (long text)
- "What does 'great' look like if this were solved?" (long text)

Section 3: "Impact"
- "Roughly how much time does this problem cost your team per week?" (choice: Less than 1 hour / 1-5 hours / 5-10 hours / More than 10 hours / Not sure)
- "How many people on your team are affected?" (choice: Just me / 2-5 / 6-20 / 20-100 / 100+)
- "What happens if nothing changes in the next 6 months?" (long text)

Section 4: "Data & Systems"
- "What data or systems are relevant to this problem?" (long text)
- "Can you share sample data files for the workshop? Anonymized is fine." (choice: Yes / Maybe, need to check / No)

Section 5: "Priorities"
- "If the prototype could only do ONE thing, what should it be?" (long text, required)
- "What would make you say 'yes, this is worth investing in'?" (long text)
- "Anything else we should know before the workshop?" (long text)

Make all sections visible. Use the Microsoft brand theme.
```

## Account Team Intake Questionnaire

Generate a prompt for the M365 Copilot Forms agent. **Replace `{{CUSTOMER_NAME}}` with the actual customer name** before presenting to the user:

```
Create a Microsoft Form called "{{CUSTOMER_NAME}} — S42 Engagement Intake" with the following:

Form description: "Internal intake for the S42 delivery squad. Fill this in before handing off the engagement."

Section 1: "Customer Context"
- "Customer name" (short text, required)
- "Industry" (short text, required)
- "Region" (choice: EMEA / NA / APAC / LATAM)
- "Customer sponsor name and title" (short text, required)
- "Customer technical contact" (short text)
- "Account team contact (your name)" (short text, required)

Section 2: "Deal Context"
- "Deal ID or opportunity reference" (short text)
- "Expected deal value" (short text)
- "Funding source" (short text)
- "Why is S42 involved? What's the presales ask?" (long text, required)

Section 3: "Problem Space"
- "What is the customer trying to accomplish?" (long text, required)
- "Why now? What's the urgency?" (long text, required)
- "What has been tried before?" (long text)
- "What data does the customer have? (format, volume, sensitivity)" (long text)

Section 4: "Engagement Scoping"
- "Requested start date" (date)
- "Known risks or blockers" (long text)
- "Is this a $50K problem or a $50M problem? Your honest assessment." (long text, required)

Make all sections visible. Use the Microsoft brand theme.
```

## After Form Responses Arrive

Tell the user:

1. Open Microsoft Forms and go to the form you created
2. Click the **"Responses"** tab at the top
3. Click **"Open in Excel"** to download all responses
4. Save the Excel file to the `sources/` folder in your engagement repo
5. Alternatively, copy key answers and paste them into `sources/questionnaire-responses.md`
6. Run `@VIBE Discover` — the agent will read the responses and auto-fill PROJECT-CONTEXT.md fields

> **Tip:** The discover agent reads everything in `sources/` automatically. Just drop the file there and it will be picked up.
