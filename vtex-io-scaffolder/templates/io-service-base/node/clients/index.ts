import { IOClients } from '@vtex/api'

import ExampleJanus from './exampleJanus'
import ExampleExternal from './exampleExternal'
/* {{CLIENT_IMPORTS}} */

/**
 * Aggregates every custom client behind `ctx.clients.<name>`. Rule of thumb:
 *
 *   - Internal VTEX endpoints -> extend `JanusClient`.
 *   - External (3rd party) endpoints -> extend `ExternalClient`.
 */
export class Clients extends IOClients {
  public get exampleJanus() {
    return this.getOrSet('exampleJanus', ExampleJanus)
  }

  public get exampleExternal() {
    return this.getOrSet('exampleExternal', ExampleExternal)
  }

  /* {{CLIENT_GETTERS}} */
}
