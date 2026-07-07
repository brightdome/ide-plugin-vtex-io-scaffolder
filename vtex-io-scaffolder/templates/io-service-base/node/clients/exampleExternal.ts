import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

/**
 * Example client extending `ExternalClient`. Use this base class for any
 * 3rd party API outside the VTEX domain. The constructor receives the full
 * base URL.
 */
export default class ExampleExternal extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('https://api.example.com', context, {
      ...options,
      headers: {
        ...options?.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

  public async fetchSomething(id: string): Promise<{ id: string; payload: unknown }> {
    return this.http.get(`/resources/${id}`, {
      metric: 'example-external-fetch',
    })
  }
}
