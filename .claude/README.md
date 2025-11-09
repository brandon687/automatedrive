# Claude Code Configuration

This directory contains Claude Code configuration, agents, hooks, and automation scripts.

## Directory Structure

```
.claude/
├── agents/              # AI agents (UI/UX designer, etc.)
├── hooks/               # Automation hooks
├── session-notes.md     # Current session tracking
└── README.md           # This file
```

## Installed Agents

### UI/UX Designer Agent
**Location:** `.claude/agents/development-team/ui-ux-designer/`
**Purpose:** Specialized agent for UI/UX design tasks, component creation, and interface improvements

**Usage:**
```bash
# Invoke the UI/UX designer agent
@ui-ux-designer [your design request]
```

## Automation Hooks

### Project Initialization Hook
**File:** `hooks/project-init.sh`
**Runs:** Automatically when Claude Code starts in this project
**Purpose:**
- Creates session notes file for tracking daily work
- Ensures changelog exists
- Sets up development environment

## Documentation Files

### PROJECT_CHANGELOG.md
**Location:** `../PROJECT_CHANGELOG.md`
**Purpose:** Complete history of all project changes
**Update Frequency:** After each development session
**Contains:**
- Feature additions
- File modifications
- API endpoint changes
- Known issues
- Next steps

### session-notes.md
**Location:** `.claude/session-notes.md`
**Purpose:** Track current session work
**Auto-created:** Yes (by project-init.sh)
**Contains:**
- Tasks for current session
- Changes made today
- Files modified
- Quick notes

## Best Practices

### Starting a New Session
1. Review `PROJECT_CHANGELOG.md` for recent changes
2. Check `.claude/session-notes.md` for today's tasks
3. Update session-notes.md with your goals
4. Begin development

### Ending a Session
1. Update `session-notes.md` with completed work
2. Add new section to `PROJECT_CHANGELOG.md` if significant changes made
3. Commit all changes to version control
4. Update TODO items

### Using Agents
- **UI/UX tasks:** Use the ui-ux-designer agent for design decisions
- **General coding:** Use default Claude Code
- **Complex workflows:** Chain multiple agents together

## Configuration

### Adding New Agents
```bash
npx claude-code-templates@latest --agent=<agent-name> --yes
```

### Adding New Hooks
1. Create script in `.claude/hooks/`
2. Make executable: `chmod +x .claude/hooks/your-hook.sh`
3. Configure in Claude Code settings

## Environment

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **Database:** SQLite (backend/prisma/dev.db)

## Quick Links

- [Project Changelog](../PROJECT_CHANGELOG.md)
- [Session Notes](.claude/session-notes.md)
- [UI/UX Agent](.claude/agents/development-team/ui-ux-designer/)
