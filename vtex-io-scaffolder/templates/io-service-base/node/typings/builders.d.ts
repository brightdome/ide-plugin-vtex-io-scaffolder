/**
 * Shared payload shapes used by builders that target external systems.
 */
interface BuilderEnvelope<TPayload> {
  source: string
  createdAt: string
  payload: TPayload
}
