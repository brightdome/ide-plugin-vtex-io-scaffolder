# brightdome-vtex-io-scaffolder

Cursor plugin that scaffolds a complete **VTEX IO Node service** from the
Brightdome boilerplate via a guided interview.

## What it provides

| Asset | Description |
|---|---|
| `/create-vtex-io-service` | Slash command that starts the scaffolding workflow |
| `skills/create-vtex-io-service/SKILL.md` | Full workflow — interview, plan, execute, verify |
| `templates/io-service-base/` | Curated boilerplate (clients, middlewares, events, models, typings, utils, GitHub workflows) |
| `scripts/scaffold.sh` | Bash script that copies + tokenises the template |

## Usage

Type `/create-vtex-io-service` in the Cursor chat, or ask the agent to
"scaffold a new VTEX IO service". The agent will:

1. Run a guided interview (service name, vendor, routes, clients, auth).
2. Show a plan for approval.
3. Copy the boilerplate, apply your tokens, and generate all dynamic files.
4. Verify no placeholders remain and run the lint gate.
5. Print next steps (`vtex link`, branching).

## Requirements

- `jq` must be installed on the machine running the agent (used by `scaffold.sh`).
- `bash` 4+ (ships with all Linux distros; macOS needs `brew install bash`).

## Template structure

```
templates/io-service-base/
  node/
    builders/         example builder
    clients/          JanusClient + ExternalClient examples
    constants/        shared constants
    events/           VTEX event handlers (pruned if usesEvents = false)
    middlewares/      auth, errorHandler, healthCheck, parseJsonBody, setupLogger
    models/           Master Data models (pruned if usesMasterdata = false)
    services/         orchestration layer
    typings/          request + response interfaces
    utils/            shared utilities
    index.ts          service entry point
  docs/README.md
  manifest.json
  service.json
  .github/workflows/  deploy + release pipelines
```
