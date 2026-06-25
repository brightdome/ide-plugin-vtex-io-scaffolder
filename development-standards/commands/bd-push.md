---
name: bd-push
description: Push the current branch safely after an explicit confirmation step.
---

Follow `rules/branch-creation-and-naming.mdc` and `rules/commit-message-and-workflow.mdc`.

Goal:
- Show current branch, tracked remote, and ahead/behind status.
- If no upstream exists, propose `git push -u origin <branch>`.
- Warn and stop on destructive push patterns unless explicitly requested.
- Wait for explicit approval before running `git push`.
- Report the push result and upstream branch state.
