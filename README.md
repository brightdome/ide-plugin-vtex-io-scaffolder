# Brightdome Development Standards — Cursor Marketplace

A single-plugin Cursor marketplace that distributes the Brightdome development
standards plugin: a curated, **stack-agnostic** engineering skill library (TDD,
DDD, debugging, architecture, code review, git workflows, grilling), one always-on
data-safety rule, and the full `/bd-*` slash-command catalog.

The skill library is synthesized from three MIT-licensed upstreams — Matt Pocock's
`skills`, Every's `compound-engineering-plugin`, and Affaan Mustafa's `ECC` — with
overlapping capabilities merged best-of-breed and aligned to Brightdome standards.
See the plugin's [`NOTICE.md`](development-standards/NOTICE.md) for attributions.

## Layout

```
.cursor-plugin/marketplace.json     # marketplace index (lists the plugin below)
development-standards/              # the installable plugin
  .cursor-plugin/plugin.json
  commands/                        # /bd-* slash commands
  rules/                           # only logging-and-data-safety.mdc (always-on)
  skills/                          # the engineering skill library
  NOTICE.md                        # MIT attributions for the upstream sources
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

See the plugin's own [README](development-standards/README.md) for the full skill,
rule, and command catalog and the rule-vs-skill rationale.
