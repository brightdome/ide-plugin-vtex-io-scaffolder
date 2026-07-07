import { isPresent, withTimeout } from '../functions'

describe('withTimeout', () => {
  it('resolves with the promise value when it settles before the timeout', async () => {
    const slowPromise = new Promise<string>((resolve) =>
      setTimeout(() => resolve('done'), 10)
    )

    await expect(withTimeout(slowPromise, 100)).resolves.toBe('done')
  })

  it('rejects with "Timeout exceeded" when the promise is too slow', async () => {
    const slowPromise = new Promise<string>((resolve) =>
      setTimeout(() => resolve('done'), 100)
    )

    await expect(withTimeout(slowPromise, 10)).rejects.toThrow(
      'Timeout exceeded'
    )
  })
})

describe('isPresent', () => {
  it.each([
    ['string', 'value', true],
    ['number zero', 0, true],
    ['empty string', '', true],
    ['false', false, true],
    ['null', null, false],
    ['undefined', undefined, false],
  ])('returns %s for %s', (_label, value, expected) => {
    expect(isPresent(value)).toBe(expected)
  })
})
