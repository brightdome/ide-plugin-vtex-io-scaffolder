import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

/**
 * Example client extending `JanusClient`. Use this base class whenever the
 * request targets an internal VTEX endpoint (e.g. `/api/...` on the
 * account's `vtexcommercestable.com.br` host).
 *
 * `JanusClient` automatically attaches account, workspace, and auth tokens.
 */
export default class ExampleJanus extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        VtexIdclientAutCookie: context.authToken,
      },
    })
  }

  public async ping(): Promise<{ ok: boolean }> {
    return this.http.get('/api/license-manager/pvt/accounts', {
      metric: 'example-janus-ping',
    })
  }
}
