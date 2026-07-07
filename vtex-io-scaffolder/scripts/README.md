# scaffold.sh

Copies the `templates/io-service-base/` boilerplate into a target directory,
applies token substitution, and prunes optional artifacts based on a JSON
config file.

## Requirements

- bash 4+
- `jq` (install with `sudo pacman -S jq` on Arch / `sudo apt install jq` on Debian)

## Usage

```bash
bash scaffold.sh --config /path/to/config.json
```

The agent resolves the script path dynamically at runtime:

```bash
SCAFFOLD_SH=$(find ~/.cursor/plugins/cache/brightdome-marketplace/brightdome-vtex-io-scaffolder -name scaffold.sh 2>/dev/null | head -1)
bash "$SCAFFOLD_SH" --config /tmp/vtex-io-skill-config.json
```

## Config schema

```json
{
  "TargetDir": "/absolute/path/to/new-app",
  "Force": false,
  "Tokens": {
    "APP_VENDOR": "obramax",
    "APP_NAME": "io-something-service",
    "APP_TITLE": "Something Service",
    "APP_DESCRIPTION": "Does something useful",
    "APP_VERSION": "0.1.0",
    "NODE_BUILDER_VERSION": "6.x",
    "DOCS_BUILDER_VERSION": "0.x"
  },
  "UsesMasterdata": true,
  "UsesEvents": false,
  "AuthPattern": "tokenAuth",
  "RunYarnInstall": false,
  "InitGit": false,
  "InitialBranch": "develop"
}
```

| Field | Required | Notes |
|---|---|---|
| `TargetDir` | yes | Absolute path where the service will be scaffolded |
| `Force` | no | Overwrite non-empty target directory (default `false`) |
| `Tokens` | yes | Map of `{{TOKEN}}` placeholders to replacement values |
| `UsesMasterdata` | no | Keep `models/` and `mdSchema.ts` (default `false`) |
| `UsesEvents` | no | Keep `events/` folder (default `false`) |
| `AuthPattern` | no | `tokenAuth`, `sessionAuth`, or `none` (default `none`) |
| `RunYarnInstall` | no | Run `yarn install` in `node/` after scaffolding (default `false`) |
| `InitGit` | no | Run `git init` + initial commit (default `false`) |
| `InitialBranch` | no | Branch name for `git init` (default `develop`) |

## Token substitution

The script replaces every `{{TOKEN_NAME}}` placeholder in text files
(`.ts`, `.tsx`, `.js`, `.json`, `.md`, `.yml`, `.yaml`, config dotfiles)
with the value provided in `Tokens`. Binary files are skipped.

The agent writes additional dynamic files (clients, routes, services,
typings) directly via the Write tool after the script completes. The script
intentionally does not generate those so the agent retains full context.
