import type { H3Event } from 'h3'

interface D1Result<T> {
  results?: T[]
  success: boolean
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(): Promise<T | null>
  all<T = unknown>(): Promise<D1Result<T>>
  run(): Promise<D1Result<unknown>>
}

interface D1Database {
  prepare(query: string): D1PreparedStatement
}

export const useDb = (event: H3Event): D1Database => {
  const db = (event.context as { cloudflare?: { env?: { DB?: D1Database } } }).cloudflare?.env?.DB

  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudflare D1 binding DB is not configured'
    })
  }

  return db
}
