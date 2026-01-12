'use server'

import { query, queryOne, execute, transaction } from '@/lib/db'
import type {
    Conversation,
    ConversationMessage,
    ActionResult,
    Sentiment,
    Language,
    ConversationStatus,
    ConversationSource
} from '@/types/database'

// ===========================================
// Create or Get Conversation
// ===========================================

export async function getOrCreateConversation(params: {
    establishmentId: string
    clientPhone: string
    clientName?: string
    source: ConversationSource
    qrRef?: string
}): Promise<ActionResult<Conversation>> {
    try {
        // Check for existing open conversation with this phone
        const existing = await queryOne<Conversation>(
            `SELECT * FROM conversations 
       WHERE establishment_id = $1 AND client_phone = $2 AND status != 'CLOSED'
       ORDER BY created_at DESC LIMIT 1`,
            [params.establishmentId, params.clientPhone]
        )

        if (existing) {
            return { success: true, data: existing }
        }

        // Create new conversation
        const newConversation = await queryOne<Conversation>(
            `INSERT INTO conversations 
       (establishment_id, client_phone, client_name, source, qr_ref, messages, status, ai_enabled)
       VALUES ($1, $2, $3, $4, $5, '[]'::jsonb, 'OPEN', true)
       RETURNING *`,
            [
                params.establishmentId,
                params.clientPhone,
                params.clientName || null,
                params.source,
                params.qrRef || null
            ]
        )

        if (!newConversation) {
            return { success: false, error: 'Erreur lors de la création de la conversation' }
        }

        return { success: true, data: newConversation }
    } catch (error) {
        console.error('getOrCreateConversation error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Add Message to Conversation
// ===========================================

export async function addMessageToConversation(
    conversationId: string,
    message: { role: 'client' | 'assistant'; content: string }
): Promise<ActionResult> {
    try {
        const newMessage: ConversationMessage = {
            role: message.role,
            content: message.content,
            timestamp: new Date().toISOString()
        }

        await execute(
            `UPDATE conversations 
       SET messages = messages || $1::jsonb, updated_at = NOW()
       WHERE id = $2`,
            [JSON.stringify([newMessage]), conversationId]
        )

        return { success: true }
    } catch (error) {
        console.error('addMessageToConversation error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Update Conversation Sentiment & Status
// ===========================================

export async function updateConversationAnalysis(
    conversationId: string,
    analysis: {
        sentiment?: Sentiment
        language?: Language
        status?: ConversationStatus
    }
): Promise<ActionResult> {
    try {
        const setClauses: string[] = []
        const values: unknown[] = []
        let paramIndex = 1

        if (analysis.sentiment) {
            setClauses.push(`sentiment = $${paramIndex++}`)
            values.push(analysis.sentiment)
        }
        if (analysis.language) {
            setClauses.push(`language = $${paramIndex++}`)
            values.push(analysis.language)
        }
        if (analysis.status) {
            setClauses.push(`status = $${paramIndex++}`)
            values.push(analysis.status)
        }

        if (setClauses.length === 0) {
            return { success: true }
        }

        setClauses.push(`updated_at = NOW()`)
        values.push(conversationId)

        await execute(
            `UPDATE conversations SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`,
            values
        )

        return { success: true }
    } catch (error) {
        console.error('updateConversationAnalysis error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Get Conversation by ID
// ===========================================

export async function getConversation(id: string): Promise<ActionResult<Conversation>> {
    try {
        const conversation = await queryOne<Conversation>(
            'SELECT * FROM conversations WHERE id = $1',
            [id]
        )

        if (!conversation) {
            return { success: false, error: 'Conversation non trouvée' }
        }

        return { success: true, data: conversation }
    } catch (error) {
        console.error('getConversation error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Get Conversations for Establishment
// ===========================================

export async function getConversationsForEstablishment(params: {
    establishmentId: string
    status?: ConversationStatus
    limit?: number
    offset?: number
}): Promise<ActionResult<{ conversations: Conversation[]; total: number }>> {
    try {
        const limit = params.limit || 20
        const offset = params.offset || 0

        let whereClause = 'WHERE establishment_id = $1'
        const values: unknown[] = [params.establishmentId]
        let paramIndex = 2

        if (params.status) {
            whereClause += ` AND status = $${paramIndex++}`
            values.push(params.status)
        }

        // Get total count
        const countResult = await queryOne<{ count: string }>(
            `SELECT COUNT(*) as count FROM conversations ${whereClause}`,
            values
        )
        const total = parseInt(countResult?.count || '0', 10)

        // Get conversations
        values.push(limit, offset)
        const conversations = await query<Conversation>(
            `SELECT * FROM conversations ${whereClause} 
       ORDER BY updated_at DESC 
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
            values
        )

        return {
            success: true,
            data: { conversations, total }
        }
    } catch (error) {
        console.error('getConversationsForEstablishment error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Disable AI for Conversation (Takeover)
// ===========================================

export async function takeoverConversation(conversationId: string): Promise<ActionResult> {
    try {
        await execute(
            `UPDATE conversations SET ai_enabled = false, updated_at = NOW() WHERE id = $1`,
            [conversationId]
        )

        // Log event
        const conversation = await queryOne<Conversation>(
            'SELECT establishment_id FROM conversations WHERE id = $1',
            [conversationId]
        )

        if (conversation) {
            await execute(
                `INSERT INTO events (conversation_id, establishment_id, type, payload)
         VALUES ($1, $2, 'TAKEOVER', '{}'::jsonb)`,
                [conversationId, conversation.establishment_id]
            )
        }

        return { success: true }
    } catch (error) {
        console.error('takeoverConversation error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Mark Conversation as Converted
// ===========================================

export async function markAsConverted(conversationId: string): Promise<ActionResult> {
    try {
        await execute(
            `UPDATE conversations SET status = 'CONVERTED', updated_at = NOW() WHERE id = $1`,
            [conversationId]
        )

        const conversation = await queryOne<Conversation>(
            'SELECT establishment_id FROM conversations WHERE id = $1',
            [conversationId]
        )

        if (conversation) {
            await execute(
                `INSERT INTO events (conversation_id, establishment_id, type, payload)
         VALUES ($1, $2, 'CONVERSION', '{}'::jsonb)`,
                [conversationId, conversation.establishment_id]
            )
        }

        return { success: true }
    } catch (error) {
        console.error('markAsConverted error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}
