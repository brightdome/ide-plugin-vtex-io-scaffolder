---
name: bd-commit
description: Stage atomically and create Conventional Commits after lint and tests pass.
---

Follow `rules/commit-message-and-workflow.mdc` strictly.

Goal:
- Inspect the working tree and auto-group hunks into atomic commits.
- If `project-runtime-conventions.mdc` is missing, run `skills/localize-company-cursor-rules/SKILL.md` first to bootstrap runtime commands.
- Run repository lint and test commands; block commit on any failure.
- Propose the staging plan and Conventional Commit message for each commit group.
- Wait for explicit approval before running any `git add` or `git commit`.
- Execute commits in order and stop on first failure.
