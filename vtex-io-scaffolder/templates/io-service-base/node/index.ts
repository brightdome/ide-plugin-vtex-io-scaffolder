import type { ClientsConfig, RecorderState, ServiceContext } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { healthCheck } from './middlewares/healthCheck'
import { setupLogger } from './middlewares/setupLogger'
/* {{AUTH_IMPORT}} */
/* {{ROUTE_HANDLER_IMPORTS}} */
/* {{EVENT_HANDLER_IMPORTS}} */

const TIMEOUT_MS = 10000

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 0,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    appSettings?: AppSettings
    parsedBody?: unknown
    /* {{STATE_FIELDS}} */
  }
}

export default new Service({
  clients,
  routes: {
    healthCheck: method({
      GET: [setupLogger, healthCheck],
      POST: [setupLogger, healthCheck],
    }),
    /* {{ROUTES_BLOCK}} */
  },
  /* {{EVENTS_BLOCK}} */
})
