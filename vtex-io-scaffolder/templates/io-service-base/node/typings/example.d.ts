interface ExampleInput {
  id: string
  items: Array<{
    sku: string
    quantity: number
  }>
}

interface ExampleOutboundPayload {
  id: string
  items: Array<{
    sku: string
    quantity: number
  }>
  metadata: {
    source: string
    createdAt: string
  }
}

interface ExampleResult {
  ok: boolean
  data: unknown
}
