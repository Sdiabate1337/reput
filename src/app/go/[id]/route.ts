import { NextRequest, NextResponse } from 'next/server'
import { query, execute } from '@/lib/db'
import { headers } from 'next/headers'

// Force dynamic to ensure we catch every hit
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: establishmentId } = await params
    const searchParams = request.nextUrl.searchParams
    const conversationId = searchParams.get('c') // Optional tracking

    // 1. Get Destination Link
    console.log(`[Redirect] Processing ID: ${establishmentId}`)
    const est = await query<{ google_maps_link: string; google_place_id?: string }>(
        `SELECT google_maps_link, google_place_id FROM establishments WHERE id = $1`,
        [establishmentId]
    ).then(rows => rows[0])

    // Generate Smart Review Link
    // Priority 1: If the user explicitly provided a "Review Link" (e.g. g.page/.../review), use it.
    // This allows users to use "Magic Links" that might have better behavior (like pre-filled stars) than the standard Place ID link.
    const rawLink = est?.google_maps_link || ''
    let destination = rawLink || 'https://google.com'

    if (rawLink.includes('/review')) {
        console.log(`[Redirect] Using User Configured Review Link: ${destination}`)
    } else if (est?.google_place_id) {
        destination = `https://search.google.com/local/writereview?placeid=${est.google_place_id}`
        console.log(`[Redirect] Using Smart Review Link from Place ID: ${destination}`)
    } else {
        console.log(`[Redirect] Fallback to Maps Link: '${destination}'`)
    }

    // 2. Async Logging (Fire & Forget logic ideally, but here we await fast insert)
    try {
        const headersList = await headers()
        const userAgent = headersList.get('user-agent') || 'unknown'

        // IP Anonymization (Simple hash or just store null for now to be safe/fast)
        // In proper setup we'd hash: crypto.createHash('sha256').update(ip).digest('hex')

        await execute(
            `INSERT INTO redirect_events (establishment_id, conversation_id, user_agent) VALUES ($1, $2, $3)`,
            [establishmentId, conversationId || null, userAgent]
        )
        console.log(`[Redirect] Logged successfully`)
    } catch (err) {
        console.error("[Redirect] Log error:", err)
        // Don't block redirect on log error
    }

    // 3. Redirect
    return NextResponse.redirect(destination, 307)
}
