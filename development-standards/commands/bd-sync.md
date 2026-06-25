---
name: bd-sync
description: Rebase the current branch onto a base branch with explicit confirmation.
---

Goal:
- Detect base branch (default `main`, override with argument).
- Show current ahead/behind state relative to the base branch.
- Present the exact sync operation (`git fetch` + `git rebase origin/<base>`).
- Wait for explicit approval before running sync commands.
- If conflicts happen, stop and list conflicted files without auto-resolving.
- On success, report updated branch status.
