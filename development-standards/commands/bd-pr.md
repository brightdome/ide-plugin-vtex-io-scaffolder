---
name: bd-pr
description: Prepare and create a pull request from current commits and diff.
---

Goal:
- Read current branch commits since divergence from base branch.
- Draft a PR title and body with summary bullets and a test plan checklist.
- Include task reference footer when a task ID is available.
- Show the exact `gh pr create` command payload before execution.
- Wait for explicit approval before creating the PR.
- Return the created PR URL.
