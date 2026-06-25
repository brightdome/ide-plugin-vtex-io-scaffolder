---
name: bd-changelog
description: Draft and append a changelog entry derived from recent Conventional Commits.
---

Goal:
- Gather commits since the latest tag (or configured release boundary).
- Group entries in Keep a Changelog style sections based on Conventional Commit type.
- Show the changelog block that will be appended.
- Wait for explicit approval before writing to changelog files.
- Append and report updated file path(s).
