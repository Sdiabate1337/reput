import { Pool, PoolClient } from 'pg'

// ===========================================
// PostgreSQL Database Client
// ===========================================

// Connection pool singleton
let pool: Pool | null = null

/**
 * Get the database connection pool
 */
export function getPool(): Pool {
    if (!pool) {
        const connectionString = process.env.DATABASE_URL

        if (!connectionString) {
            throw new Error('DATABASE_URL environment variable is not set')
        }

        pool = new Pool({
            connectionString,
            max: 20, // Maximum number of clients in the pool
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            ssl: process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : false,
        })

        // Log connection errors
        pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err)
        })
    }

    return pool
}

/**
 * Execute a query with automatic connection handling
 */
export async function query<T = unknown>(
    sql: string,
    params?: unknown[]
): Promise<T[]> {
    const pool = getPool()
    const result = await pool.query(sql, params)
    return result.rows as T[]
}

/**
 * Execute a query and return first row only
 */
export async function queryOne<T = unknown>(
    sql: string,
    params?: unknown[]
): Promise<T | null> {
    const rows = await query<T>(sql, params)
    return rows[0] || null
}

/**
 * Execute an insert/update and return affected rows
 */
export async function execute(
    sql: string,
    params?: unknown[]
): Promise<{ rowCount: number }> {
    const pool = getPool()
    const result = await pool.query(sql, params)
    return { rowCount: result.rowCount || 0 }
}

/**
 * Execute multiple queries in a transaction
 */
export async function transaction<T>(
    callback: (client: PoolClient) => Promise<T>
): Promise<T> {
    const pool = getPool()
    const client = await pool.connect()

    try {
        await client.query('BEGIN')
        const result = await callback(client)
        await client.query('COMMIT')
        return result
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

/**
 * Helper to build parameterized queries safely
 */
export function sql(
    strings: TemplateStringsArray,
    ...values: unknown[]
): { text: string; values: unknown[] } {
    let text = ''
    const params: unknown[] = []

    strings.forEach((string, i) => {
        text += string
        if (i < values.length) {
            params.push(values[i])
            text += `$${params.length}`
        }
    })

    return { text, values: params }
}

// ===========================================
// TypeScript Helpers
// ===========================================

export interface DatabaseRow {
    [key: string]: unknown
}

export type QueryResult<T> = T[]
