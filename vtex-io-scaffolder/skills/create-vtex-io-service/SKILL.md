---
name: create-vtex-io-service
description: Scaffolds a complete VTEX IO Node service (clients, middlewares, services, builders, models, typings, utils, GitHub workflows, optional Master Data + events, optional Jest tests) from a curated boilerplate. Use when the user runs /create-vtex-io-service or asks to bootstrap, scaffold, generate, or create a new VTEX IO service / backend / app.
disable-model-invocation: true
---

# Create VTEX IO Service

Scaffolds a brand-new VTEX IO Node service end-to-end from a curated
boilerplate that ships with this skill (`templates/io-service-base/`),
plus dynamic code generated from a guided interview.

## Trigger

Activate **only** when:

- The user runs the slash command `/create-vtex-io-service`, OR
- The user unambiguously asks to bootstrap, scaffold, generate, or create
  a new VTEX IO Node service / backend / app.

Do not activate for unrelated VTEX work (editing an existing app,
configuring credentials, deploying, etc.).

## Workflow

```
Phase 1: Basics interview
Phase 2: Per-route + per-client loop
Phase 3: Open follow-ups
Phase 4: Present plan -> AWAIT explicit approval
Phase 5: Execute scaffolding
Phase 6: Verify + print next steps
```

Track progress with a todo list. Do not collapse phases. Do not write any
file before Phase 4 approval.

---

## Phase 1 - Basics

Use one `AskQuestion` form. Read `interview.md` for the exact question
scripts. Collect:

- `appVendor`, `appName` (kebab-case)
- `appTitle`, `appDescription`
- `targetDir` (absolute path)
- `authPattern`: `tokenAuth` | `sessionAuth` | `none`
- `usesMasterdata` (boolean)
- `usesEvents` (boolean)
- `extraBuilders` (optional list beyond `node` + `docs`)
- `includeJestTests` (default `true`)
- `runYarnInstall` (default `false`)
- `initGit` (default `false`)

Defaults the agent should always assume unless told otherwise:

- `NODE_BUILDER_VERSION = "6.x"`
- `DOCS_BUILDER_VERSION = "0.x"`
- `APP_VERSION = "0.1.0"`

If the user mentions GraphQL, React, messages, etc. add them as extra
builders.

## Phase 2 - Per-route and per-client loop

Loop until the user signals "done". For each route collect:

| Field | Notes |
|---|---|
| `name` | camelCase identifier used in `service.json` + `index.ts` |
| `methods` | one or more of GET/POST/PATCH/PUT/DELETE |
| `path` | URL pattern, e.g. `/_v/<app>/orders/:orderId` |
| `requiresAuth` | bool; falls back to the global `authPattern` |
| `requiresParams` | bool; if true, wire `sendParamsToState` |
| `requestBodyShape` | JSON sample OR free-text description |
| `responseBodyShape` | JSON sample OR free-text description |
| `serviceName` | optional; if present, scaffold a service file that orchestrates the call |

For each client collect:

| Field | Notes |
|---|---|
| `name` | camelCase |
| `kind` | `janus` (internal VTEX) or `external` (3rd party) |
| `baseUrl` | only when `kind = external` |
| `methods` | list of `{ methodName, httpVerb, path, reqType, respType }` |

Hard rule:

- `kind = janus` -> extends `JanusClient` from `@vtex/api`
- `kind = external` -> extends `ExternalClient` from `@vtex/api`

Never deviate. See `reference.md` for the exact patterns.

## Phase 3 - Open follow-ups

Ask one open question:

> "Anything else this service needs that we have not covered? (cron events,
> extra app settings, environment-driven config, app-specific constants,
> etc.)"

Capture answers verbatim and route them to the right files:

- Cron events -> additional `events/<name>.ts` + entry in `events` block.
- App settings -> `manifest.json` `settingsSchema.properties`.
- Constants -> `node/constants/index.ts`.
- Anything unclear -> stash as a TODO list item in the generated `README.md`.

## Phase 4 - Plan summary and approval

Render a single Markdown summary covering:

1. Resolved token values (vendor, name, title, description, version, builders).
2. Target path tree of every file that will be created.
3. Routes table (name / methods / path / middlewares / service / client).
4. Clients table (name / kind / base URL / methods).
5. Conditional artifacts in/out (masterdata, events, auth pattern, jest).
6. Post-actions (yarn install? git init?).

Then call `AskQuestion` with two options: `Approve` and `Adjust`.

- `Approve` -> proceed to Phase 5.
- `Adjust` -> ask which phase to re-enter (1, 2, or 3) and loop back.

**Do not write any file before approval.**

## Phase 5 - Execute

1. Build the config JSON for `scripts/scaffold.sh`. Shape documented in
   `scripts/README.md`. Required tokens (always populate all):

   ```json
   {
     "APP_VENDOR": "...",
     "APP_NAME": "...",
     "APP_TITLE": "...",
     "APP_DESCRIPTION": "...",
     "APP_VERSION": "0.1.0",
     "NODE_BUILDER_VERSION": "6.x",
     "DOCS_BUILDER_VERSION": "0.x"
   }
   ```

2. Write the config to `/tmp/vtex-io-skill-config.json`.

3. Resolve the scaffolder script path dynamically (the plugin cache hash
   changes on each publish):

   ```bash
   SCAFFOLD_SH=$(find ~/.cursor/plugins/cache/brightdome-marketplace/brightdome-vtex-io-scaffolder -name scaffold.sh 2>/dev/null | head -1)
   ```

4. Run the scaffolder:

   ```bash
   bash "$SCAFFOLD_SH" --config /tmp/vtex-io-skill-config.json
   ```

   The script copies the template, applies token substitution, and prunes
   masterdata/events/unused-auth artifacts.

5. Generate dynamic, interview-driven files directly with the `Write`
   tool (the script intentionally does NOT do this so the agent has full
   control with full context):

   - For each **client**: write `node/clients/<name>.ts` extending the
     correct base class. Update `node/clients/index.ts` to import + expose
     the getter (replace the `/* {{CLIENT_IMPORTS}} */` and
     `/* {{CLIENT_GETTERS}} */` placeholders).
     - **JanusClient hard rules**: every JanusClient constructor MUST
       set `VtexIdclientAutCookie: context.authToken` in `headers`
       (without it, requests run anonymously and VTEX 302s to login,
       surfacing as a 502 to the caller). Also confirm the manifest
       still ships **both** the `{{account}}.vtexcommercestable.com.br`
       and the literal `portal.vtexcommercestable.com.br` outbound
       policies; do not drop either one.
   - For each **route**: write any new middleware under `node/middlewares/`
     and any new service under `node/services/`. Replace the placeholders
     in `node/index.ts` (`{{ROUTE_HANDLER_IMPORTS}}`, `{{ROUTES_BLOCK}}`,
     etc.) and `node/service.json` (`{{SERVICE_JSON_ROUTES}}`).
     - **Default chain**: every route starts with
       `[setupLogger, errorHandler, ...]`. `errorHandler` ships with
       the template - do not omit it.
     - **Body-bearing routes** (any method list including `POST`,
       `PATCH`, or `PUT`) MUST insert `parseJsonBody` immediately after
       `errorHandler`. VTEX IO does not register a body parser by
       default; without `parseJsonBody`, the handler's
       `ctx.state.parsedBody` is undefined.
   - For each **typed request/response shape**: append an interface to
     `node/typings/requestBodies.d.ts` and `node/typings/responseBodies.d.ts`.
   - If `usesEvents` is true: register handlers under
     `{{EVENT_HANDLER_IMPORTS}}` and `{{EVENTS_BLOCK}}` and add matching
     entries to `service.json` (`{{SERVICE_JSON_EVENTS}}`).
   - If `usesMasterdata` is true: wire `configureApp` to the
     `onAppInstalled`, `onSettingsChanged`, and `onAppLinked` events.
   - If `includeJestTests` is true: for every new builder/service/util,
     write a sibling `__tests__/<name>.test.ts` covering success and
     fallback paths. For middlewares write a smoke test asserting state
     mutation + `next()` is called.

6. Remove any remaining placeholder comments (lines containing `{{...}}`)
   from generated files. Empty placeholders should become empty lines or
   be deleted entirely depending on context.

## Phase 6 - Verify + print next steps

1. List the created file tree (e.g. via `find <targetDir> -type f | sort`).
2. Confirm no `{{...}}` placeholders remain (Grep across `targetDir`).
3. **Docs builder check** - if `manifest.json` declares the `docs`
   builder, assert that `<targetDir>/docs/` exists and is non-empty.
   Without it, `vtex link` aborts with
   `Missing docs folder in the project`. The template ships a starter
   `docs/README.md`; if it was deleted, regenerate it before continuing.
4. **Lint gate** - run `yarn lint` in `<targetDir>/node` AND `yarn lint`
   at `<targetDir>` (root). `vtex link` will refuse to link a workspace
   with TypeScript errors. If either command exits non-zero:
   - Print the failing files and error messages.
   - STOP. Do not print the "Next steps" block.
   - Fix the errors (or hand back to the user) and re-run the gate.

5. Print the "Next steps" block:

   ```
   cd <targetDir>/node
   yarn install                          # if not already run
   cd ..
   vtex login <account>
   vtex use <workspace>
   vtex link
   ```

6. Remind the user about branching: created on `develop`; subsequent work
   should branch as `feat/<ticket>`, `fix/<ticket>`, `chore/...`,
   `hotfix/...`.

---

## Files in this skill

| Path | Purpose |
|---|---|
| `SKILL.md` | This file. Workflow and rules. |
| `reference.md` | VTEX IO conventions, JanusClient vs ExternalClient, masterdata pattern, service pattern. Read when generating dynamic files. |
| `interview.md` | Exact `AskQuestion` scripts for each phase. |
| `../../templates/io-service-base/` | Curated boilerplate copied + tokenised by the scaffolder. |
| `../../scripts/scaffold.sh` | Bash copier + token replacer. |
| `../../scripts/README.md` | Scaffolder invocation and config schema. |

## Anti-patterns

- Do not invent new folder names. The canonical structure is:
  `builders/ clients/ constants/ middlewares/ models/ services/ typings/ utils/`.
- Do not edit `templates/io-service-base/` to add per-user code. Add to
  the generated target instead.
- Do not skip Phase 4 approval. Even on a re-run.
- Do not generate code that swallows errors silently. Services must log
  via `logToMasterData` and return a documented fallback.
- Do not deviate from the JanusClient / ExternalClient rule.
- Do not generate a `JanusClient` subclass without
  `VtexIdclientAutCookie: context.authToken` in the constructor's
  `headers`. Without it, the client runs anonymously and the upstream
  VTEX endpoint redirects to login, which surfaces to the caller as an
  opaque 502. The header is mandatory even for "anonymous" routes.
- Do not delete the literal `portal.vtexcommercestable.com.br /api/*`
  outbound-access policy from the manifest. The `{{account}}.*`
  wildcard is not always sufficient for License Manager / portal
  traffic; both forms must coexist.
- Do not ship a service that declares the `docs` builder without a
  `docs/` folder containing at least a `README.md`. `vtex link` aborts
  with `Missing docs folder in the project`.
- Do not declare Phase 5 complete while `yarn lint` (in `node/` or at
  the repo root) reports any error. `vtex link` will refuse to link.
