/**
 * Request body shapes (one interface per route). Keep this file in sync
 * with the routes registered in `index.ts` and `service.json`.
 */
interface HealthCheckRequest {
  ping?: string
}
