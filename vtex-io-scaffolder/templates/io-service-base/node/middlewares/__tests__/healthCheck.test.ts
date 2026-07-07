import { healthCheck } from '../healthCheck'

describe('healthCheck middleware', () => {
  it('responds with 200 and ok status, then calls next', async () => {
    const ctx = { status: 0, body: undefined } as unknown as Context
    const next = jest.fn().mockResolvedValue(undefined)

    await healthCheck(ctx, next)

    expect(ctx.status).toBe(200)
    expect((ctx as unknown as { body: { status: string } }).body.status).toBe(
      'ok'
    )
    expect(next).toHaveBeenCalledTimes(1)
  })
})
