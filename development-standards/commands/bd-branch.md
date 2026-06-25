---
name: bd-branch
description: Propose and create a branch name that follows project branch standards.
---

Follow `rules/branch-creation-and-naming.mdc`.

Goal:
- Propose a branch name from task ID + intent according to naming rules.
- If a task ID is missing, ask for it or derive it from context when possible.
- Show the exact branch command before execution.
- Wait for explicit approval before creating or switching branch.
- Create the branch and report final checked-out branch name.
