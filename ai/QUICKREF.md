# AIDD Quick Reference

Fast reference for AI agents working in this codebase.

## ⚠️ Cardinal Rules

```bash
❌ NEVER: npm run dev, npm start, or ANY long-running commands
❌ NEVER: Mark tasks complete without explicit user approval
❌ NEVER: Put code implementations in task files

✅ ALWAYS: Wait for user approval after execution
✅ ALWAYS: Keep task files as markdown planning docs
✅ ALWAYS: Make code changes in source files, not task files
```

## 📋 Task Status Lifecycle

```
📋 PLANNED        → planning complete
🚧 IN PROGRESS    → executing (task file READ-ONLY)
⏸️ PENDING REVIEW → implementation done, awaiting user verification
✅ COMPLETED      → user verified (only set after approval!)
🚫 CANCELLED      → abandoned

Flow: 📋 → 🚧 → ⏸️ PENDING REVIEW → ✅
                     ↑ WAIT HERE
```

## 🔄 Standard Workflow

1. **Read** `vision.md` first
2. **Plan** task (markdown notes only) → Status: 📋 PLANNED
3. **Present** for approval → **WAIT**
4. **Execute** (task file READ-ONLY, code in source files) → Status: ⏸️ PENDING REVIEW
5. **Report** completion → **WAIT** for user verification
6. **User approves** → Status: ✅ COMPLETED

## 📁 Key Files

| File | Purpose |
|------|---------|
| `vision.md` | Project goals (read first!) |
| `ai/FRAMEWORK.md` | Complete framework docs |
| `ai/rules/execution-workflow.mdc` | Workflow constraints |
| `ai/rules/agent-orchestrator.mdc` | Agent coordination |
| `ai/rules/task-creator.mdc` | Task planning |

## 🎯 Task File Template

```markdown
# ${TaskName} Epic

**Status**: 📋 PLANNED
**Goal**: ${briefGoal}

## Overview
${whyThisMatters}

---

## ${TaskName}
${briefDescription}

**Requirements**:
- Given ${situation}, should ${jobToDo}
- Given ${situation}, should ${jobToDo}
```

## 🚫 Anti-Patterns

```bash
# ❌ DON'T
npm run dev                    # no servers
Status: ✅ COMPLETED            # without approval
# Code in task file            # no implementations in tasks

# ✅ DO  
User should run: npm run dev   # guide, don't execute
Awaiting approval...           # explicit wait
# Implementation notes only    # markdown guidance
```

## 🎭 Agent Roles

When you need specialized expertise, consult:

```
execution-workflow → Core constraints (ALWAYS)
task-creator      → Breaking down complex tasks
productmanager    → User stories, journey maps
tdd               → Test-driven development
ui                → Interface design
stack             → Next.js + React/Redux patterns
javascript        → JS/TS best practices
requirements      → Functional specs
```

## 💡 Progressive Discovery

Don't read everything! Use just-in-time learning:

- Working on Redux? → `ai/rules/frameworks/redux/`
- JavaScript question? → `ai/rules/javascript/`
- Security concern? → `ai/rules/security/`

## ✨ Remember

**Tasks are maps, not the journey.**
- Plan in markdown (writable)
- Execute with task as READ-ONLY reference
- Code in source files
- Set ⏸️ PENDING REVIEW after implementation
- Wait for user verification before ✅ COMPLETED
