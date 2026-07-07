import { runExample } from '../example.service'

jest.mock('../../utils/logging', () => ({
  addPerformanceStats: jest.fn(),
  logToMasterData: jest.fn().mockResolvedValue(undefined),
}))

const { logToMasterData } = jest.requireMock('../../utils/logging') as {
  logToMasterData: jest.Mock
}

function buildContextMock(fetchImpl: jest.Mock): unknown {
  return {
    clients: {
      exampleExternal: {
        fetchSomething: fetchImpl,
      },
    },
  }
}

describe('runExample', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns ok=true with the upstream payload on success', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ id: 'abc', payload: { greeting: 'hi' } })
    const ctx = buildContextMock(fetchMock) as Context

    const result = await runExample(ctx, { id: 'abc', items: [] })

    expect(result).toEqual({
      ok: true,
      data: { id: 'abc', payload: { greeting: 'hi' } },
    })
    expect(fetchMock).toHaveBeenCalledWith('abc')
    expect(logToMasterData).not.toHaveBeenCalled()
  })

  it('returns ok=false fallback and logs when the client throws', async () => {
    const failure = new Error('boom')
    const fetchMock = jest.fn().mockRejectedValue(failure)
    const ctx = buildContextMock(fetchMock) as Context

    const result = await runExample(ctx, { id: 'abc', items: [] })

    expect(result).toEqual({ ok: false, data: null })
    expect(logToMasterData).toHaveBeenCalledWith(
      ctx,
      'example-service-error',
      'abc',
      'warn',
      failure
    )
  })
})
