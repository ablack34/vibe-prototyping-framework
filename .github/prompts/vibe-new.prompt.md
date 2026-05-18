---
description: "Create a new VIBE engagement workspace from the template"
argument-hint: "customer=... engagement=... [size={XS|S|M|L}]"
---

# VIBE New Engagement

Create a new VIBE Prototyping engagement workspace. This prompt handles everything:

1. Creates a new GitHub repo from the VIBE framework template
2. Clones it locally
3. Installs dependencies
4. Opens the workspace in VS Code
5. Tells you what to do next

## Inputs

- ${input:customer}: (Required) Customer name (e.g., "Contoso").
- ${input:engagement}: (Required) Short engagement name (e.g., "field-scheduling").
- ${input:size:S}: (Optional, defaults to S) Engagement size: XS, S, M, or L.

---

Run the following steps in order. Confirm each step with the user before proceeding.

### Step 1: Confirm Details

Present a summary and ask the user to confirm:

```
New VIBE Engagement:
  Customer:    {{customer}}
  Engagement:  {{engagement}}
  Repo name:   {{customer-kebab}}-{{engagement-kebab}}
  Size:        {{size}}
```

### Step 2: Create Repo from Template

Run in terminal:

```powershell
gh repo create {{customer-kebab}}-{{engagement-kebab}} --template ${env:VIBE_TEMPLATE_REPO ?? 'ablack34/vibe-prototyping-framework'} --private --clone --description "VIBE Prototyping: {{customer}} - {{engagement}}"
```

If this fails because `gh` is not installed or not authenticated, provide step-by-step instructions:
- Install: `winget install GitHub.cli`
- Authenticate: `gh auth login` (select GitHub.com, HTTPS, web browser)

### Step 3: Install Dependencies

```powershell
cd ~/repos/{{customer-kebab}}-{{engagement-kebab}}
cd scaffold/web && npm install && cd ../..
cd scaffold/api && dotnet restore && cd ../..
```

### Step 4: Open Workspace

```powershell
code ~/repos/{{customer-kebab}}-{{engagement-kebab}}
```

### Step 5: Next Steps

Tell the user:

> Your engagement workspace is ready. In the new VS Code window:
>
> 1. Open Copilot Chat (Ctrl+Shift+I) and switch to **Agent mode**
> 2. Type: `/vibe-kickoff customer="{{customer}}" problem="describe the problem" size={{size}}`
> 3. If you have Teams meeting recordings, run `/vibe-transcript` next
> 4. Full guide: see `docs/README.md` or the docs site (link in the root `README.md`)
>
> MCP servers are pre-configured. Click the 🔧 tools icon in Copilot Chat to enable them on first use.
