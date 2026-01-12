import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    // TODO: Implement real auth callback with PostgreSQL
    const requestUrl = new URL(request.url)
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
