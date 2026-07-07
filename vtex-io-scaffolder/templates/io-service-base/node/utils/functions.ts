/**
 * Races a promise against a timeout. Rejects with `Error('Timeout exceeded')`
 * if the promise does not settle within `timeoutMs`.
 *
 * Used by every `services/*` function so external calls cannot stall the
 * request beyond a known budget.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeout = new Promise<never>((_resolve, reject) =>
    setTimeout(() => reject(new Error('Timeout exceeded')), timeoutMs)
  )

  return Promise.race([promise, timeout])
}

/**
 * Returns true if the value is non-null and non-undefined. Narrows the type
 * for use in `.filter(isPresent)` chains.
 */
export function isPresent<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
