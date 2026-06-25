# Brightdome Development Standards — Cursor Marketplace

A single-plugin Cursor marketplace that distributes the Brightdome development
standards plugin: engineering rules, skills, and the full `/bd-*` slash-command
catalog for Git workflows, code quality, and documentation.

## Layout

```
.cursor-plugin/marketplace.json     # marketplace index (lists the plugin below)
development-standards/              # the installable plugin
  .cursor-plugin/plugin.json
  commands/                        # /bd-* slash commands
  rules/                           # engineering .mdc rules
  skills/                          # grill-with-docs, localize-company-cursor-rules
  README.md
```

- **Marketplace:** `brightdome-development-standards-marketplace`
- **Plugin:** `brightdome-development-standards`

## Install in Cursor

1. Push this repository to GitHub (see below).
2. In Cursor: **Dashboard → Settings → Plugins → Add marketplace** and paste this
   repository's GitHub URL.
3. Open the Plugins panel in Cursor and install **brightdome-development-standards**
   from the marketplace.

## Publish

This folder is its own git repository. Create an empty GitHub repo and push:

```bash
git remote add origin git@github.com:<org>/cursor-plugin.development-standards.git
git push -u origin main
```

See the plugin's own [README](development-standards/README.md) for the rule and
command catalog.
