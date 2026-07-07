import type { ExampleInput, ExampleOutboundPayload } from '../typings/example'

/**
 * Pure payload transformer. Builders take in domain input and produce the
 * exact shape an external system expects. Keep them free of `ctx`, side
 * effects, and network calls so they remain trivially unit-testable.
 */
export function buildExamplePayload(
  input: ExampleInput
): ExampleOutboundPayload {
  return {
    id: input.id,
    items: input.items.map((item) => ({
      sku: item.sku,
      quantity: item.quantity,
    })),
    metadata: {
      source: 'vtex-io',
      createdAt: new Date().toISOString(),
    },
  }
}
