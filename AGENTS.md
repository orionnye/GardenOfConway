# AI Agent Guidelines

This project uses AI-assisted development with structured guidance in the `ai/` directory.

## Getting Started

**New agents must read these files in order:**

1. **`vision.md`** (project root) - Project goals and constraints
2. **`ai/FRAMEWORK.md`** - Complete framework overview and workflow patterns
3. **`ai/rules/execution-workflow.mdc`** - ⚠️ CRITICAL workflow constraints

These three files provide the foundation for effective agent operation in this codebase.

## Critical Workflow Constraints

Before any work, understand these cardinal rules from `ai/rules/execution-workflow.mdc`:

1. **No persistent terminal commands** - Never run servers (`npm run dev`, etc.)
2. **Wait for approval** - Tasks complete only after explicit user approval
3. **Tasks are maps** - Task files contain markdown guidance, code goes in source files

## Directory Structure

Agents should examine the `ai/*` directory listings to understand the available commands, rules, and workflows.

## Index Files

Each folder in the `ai/` directory contains an `index.md` file that describes the purpose and contents of that folder. Agents can read these index files to learn the function of files in each folder without needing to read every file.

**Important:** The `ai/**/index.md` files are auto-generated from frontmatter. Do not create or edit these files manually—they will be overwritten by the pre-commit hook.

## Progressive Discovery

Agents should only consume the root index until they need subfolder contents. For example:
- If the project is Python, there is no need to read JavaScript-specific folders
- If working on backend logic, frontend UI folders can be skipped
- Only drill into subfolders when the task requires that specific domain knowledge

This approach minimizes context consumption and keeps agent responses focused.

## Vision Document Requirement

**Before creating or running any task, agents must first read the vision document (`vision.md`) in the project root.**

The vision document serves as the source of truth for:
- Project goals and objectives
- Key constraints and non-negotiables
- Architectural decisions and rationale
- User experience principles
- Success criteria

## Conflict Resolution

If any conflicts are detected between a requested task and the vision document, agents must:

1. Stop and identify the specific conflict
2. Explain how the task conflicts with the stated vision
3. Ask the user to clarify how to resolve the conflict before proceeding

Never proceed with a task that contradicts the vision without explicit user approval.
