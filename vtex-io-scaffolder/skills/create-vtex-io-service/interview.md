# Interview Scripts

Exact prompts and `AskQuestion` calls to use during each phase. Adjust
free-text follow-ups as needed, but keep the structured questions stable.

---

## Phase 1: Basics

### 1.1 Identity (free-text follow-up)

Ask in chat (NOT via `AskQuestion`, since these are free-text):

> Let's set up your new VTEX IO service. I need a few basics:
>
> 1. Vendor (e.g. `obramax`, `odp`)
> 2. App name in kebab-case (e.g. `io-orders-service`)
> 3. Title (human-readable, shown in VTEX Admin)
> 4. One-sentence description
> 5. Absolute target folder path where the service should be scaffolded

Wait for all five before moving on.

### 1.2 Structural choices (`AskQuestion`)

```json
[
  {
    "id": "authPattern",
    "prompt": "Which authentication pattern should the service ship with?",
    "options": [
      { "id": "tokenAuth",   "label": "Token validation (io-fulfilment-service style: ?t=<token> + secureCompare)" },
      { "id": "sessionAuth", "label": "VTEX session validation (service-example style: ctx.clients.session)" },
      { "id": "none",        "label": "None - leave a stub I will fill in later" }
    ]
  },
  {
    "id": "usesMasterdata",
    "prompt": "Will this service read/write Master Data?",
    "options": [
      { "id": "yes", "label": "Yes (include models/, mdSchema.ts, and bind configureApp to lifecycle events)" },
      { "id": "no",  "label": "No (skip masterdata scaffolding)" }
    ]
  },
  {
    "id": "usesEvents",
    "prompt": "Will this service handle VTEX events beyond the masterdata bootstrap (e.g. order events, cron, custom events)?",
    "options": [
      { "id": "yes", "label": "Yes" },
      { "id": "no",  "label": "No" }
    ]
  },
  {
    "id": "extraBuilders",
    "prompt": "Beyond `node` and `docs`, do you need any additional VTEX IO builders?",
    "allow_multiple": true,
    "options": [
      { "id": "graphql",  "label": "graphql" },
      { "id": "messages", "label": "messages" },
      { "id": "react",    "label": "react"   },
      { "id": "none",     "label": "None"    }
    ]
  },
  {
    "id": "includeJestTests",
    "prompt": "Generate Jest tests where viable?",
    "options": [
      { "id": "yes", "label": "Yes (recommended)" },
      { "id": "no",  "label": "No" }
    ]
  },
  {
    "id": "postActions",
    "prompt": "After scaffolding, what should I run automatically?",
    "allow_multiple": true,
    "options": [
      { "id": "yarn",  "label": "yarn install inside node/" },
      { "id": "git",   "label": "git init + initial commit on a develop branch" },
      { "id": "none",  "label": "Nothing (I will run things myself)" }
    ]
  }
]
```

---

## Phase 2: Routes and clients loop

Enter a loop. Track everything in a working list the agent maintains.

### 2.1 Route entry-point

For each route, ask in chat:

> Tell me about route #N:
>
> - `name` (camelCase, e.g. `getOrder`)
> - `path` (e.g. `/_v/<app>/orders/:orderId`)
> - HTTP method(s) (GET / POST / PATCH / PUT / DELETE)
> - Brief description of what it does
> - Request body shape (paste JSON sample OR describe fields)
> - Response body shape (paste JSON sample OR describe fields)

Then follow up with `AskQuestion`:

```json
[
  {
    "id": "routeAuth",
    "prompt": "Does this route require authentication?",
    "options": [
      { "id": "default", "label": "Use the global auth pattern from Phase 1" },
      { "id": "none",    "label": "No auth for this route" }
    ]
  },
  {
    "id": "routeParams",
    "prompt": "Does this route have URL params that downstream code needs on ctx.state?",
    "options": [
      { "id": "yes", "label": "Yes (wire sendParamsToState)" },
      { "id": "no",  "label": "No" }
    ]
  },
  {
    "id": "routeService",
    "prompt": "Does this route delegate to a service (recommended) or is the middleware handler enough?",
    "options": [
      { "id": "service", "label": "Generate a services/<name>.service.ts and call it from the middleware" },
      { "id": "inline",  "label": "Keep logic inline in the middleware (simple routes only)" }
    ]
  }
]
```

Then ask: "Add another route?" -> if yes, loop; if no, move to clients.

### 2.2 Client entry-point

For each client, ask in chat:

> Tell me about client #N:
>
> - `name` (camelCase, e.g. `orderSystem`)
> - One-line purpose

Then follow up with `AskQuestion`:

```json
[
  {
    "id": "clientKind",
    "prompt": "Is this client targeting an internal VTEX endpoint or a 3rd-party service?",
    "options": [
      { "id": "janus",    "label": "Internal VTEX (extends JanusClient)" },
      { "id": "external", "label": "3rd-party (extends ExternalClient with a base URL)" }
    ]
  }
]
```

If `external`, ask for `baseUrl` in chat.

Then ask:

> List the methods this client should expose. For each method:
>
> - `methodName` (camelCase)
> - HTTP verb
> - Path (relative to base URL)
> - Request type (or "none")
> - Response type (or "unknown")

Then: "Add another client?" -> loop.

---

## Phase 3: Open follow-ups

Ask in chat:

> Anything else this service needs that we have not covered? Examples:
>
> - Cron / scheduled events
> - Extra app settings the operator should be able to configure (added to manifest.json)
> - Environment-driven config (env vars consumed at runtime)
> - App-specific constants worth exposing under node/constants/
> - Outbound-access policies for hosts beyond `{{account}}.vtexcommercestable.com.br`
>
> Feel free to say "nothing else".

Route answers as documented in `SKILL.md` Phase 3.

---

## Phase 4: Approval

Render the full Markdown summary in chat, then:

```json
[
  {
    "id": "planApproval",
    "prompt": "Ready to scaffold this service?",
    "options": [
      { "id": "approve", "label": "Approve - write all files now" },
      { "id": "adjust",  "label": "Adjust - I want to change something first" }
    ]
  }
]
```

If `adjust`:

```json
[
  {
    "id": "adjustPhase",
    "prompt": "Which part should we revisit?",
    "options": [
      { "id": "phase1", "label": "Basics (vendor, name, auth, masterdata, events, builders, post-actions)" },
      { "id": "phase2", "label": "Routes and/or clients" },
      { "id": "phase3", "label": "Open follow-ups (settings, constants, policies, cron)" }
    ]
  }
]
```

Re-enter the chosen phase. Do not proceed to Phase 5 until the user
selects `approve`.
