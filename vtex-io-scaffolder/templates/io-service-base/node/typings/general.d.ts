/**
 * Global ambient declarations shared across the service.
 *
 * `Context` and `State` are declared inside `node/index.ts` (next to the
 * `Service` instantiation) so that adding a new typed field on `State`
 * only requires editing the same file that wires the middlewares.
 */

interface AppSettings {
  vtexCreds?: {
    VTEXToken?: string | null
  }
  [key: string]: unknown
}

interface DocumentResponse {
  Id: string
  Href: string
  DocumentId: string
}

interface IOResponse<T> {
  data: T
  headers: Record<string, unknown>
  status: number
}
