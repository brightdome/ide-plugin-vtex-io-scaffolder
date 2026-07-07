import { buildExamplePayload } from '../example.builder'

describe('buildExamplePayload', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('maps every item and stamps metadata', () => {
    const result = buildExamplePayload({
      id: 'abc',
      items: [
        { sku: 'sku-1', quantity: 1 },
        { sku: 'sku-2', quantity: 2 },
      ],
    })

    expect(result).toEqual({
      id: 'abc',
      items: [
        { sku: 'sku-1', quantity: 1 },
        { sku: 'sku-2', quantity: 2 },
      ],
      metadata: {
        source: 'vtex-io',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    })
  })

  it('produces an empty items array when input has none', () => {
    const result = buildExamplePayload({ id: 'abc', items: [] })

    expect(result.items).toEqual([])
  })
})
