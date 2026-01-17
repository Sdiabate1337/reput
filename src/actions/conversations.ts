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
import { sendWhatsAppMessage } from '@/lib/twilio'
import { getEstablishmentById } from '@/actions/establishments'
import { checkQuota } from '@/lib/access-control'

// ... existing code ...

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
            // Update client name if provided.
            // Priority Rule:
            // 1. If currently missing (!existing.client_name), always update.
            // 2. If source is MANUAL_SEND, always overwrite (Merchant input > WhatsApp Profile).
            const isManualOverride = params.source === 'MANUAL_SEND'
            const isMissingName = !existing.client_name

            if (params.clientName && (isMissingName || isManualOverride)) {
                await execute(
                    `UPDATE conversations SET client_name = $1 WHERE id = $2`,
                    [params.clientName, existing.id]
                )
                existing.client_name = params.clientName
            }
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
// Toggle AI Status
// ===========================================

export async function toggleConversationAi(conversationId: string, enabled: boolean): Promise<ActionResult> {
    try {
        await execute(
            `UPDATE conversations SET ai_enabled = $1, updated_at = NOW() WHERE id = $2`,
            [enabled, conversationId]
        )
        return { success: true }
    } catch (error) {
        console.error('toggleConversationAi error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Send Manual Reply (User initiated from Dashboard)
// ===========================================

export async function sendManualReply(
    conversationId: string,
    messageContent: string
): Promise<ActionResult> {
    try {
        // 1. Get conversation info
        const conversation = await queryOne<Conversation>(
            'SELECT * FROM conversations WHERE id = $1',
            [conversationId]
        )

        if (!conversation) {
            return { success: false, error: 'Conversation non trouvée' }
        }

        // 2. Disable AI automatically if we reply manually? 
        // US-4.5 implies user must "Take Over" first, or this does it implicitely.
        // Let's force AI disable to be safe.
        await execute(
            `UPDATE conversations SET ai_enabled = false WHERE id = $1`,
            [conversationId]
        )

        // 3. Check Quota
        const estResult = await getEstablishmentById(conversation.establishment_id)
        if (!estResult.success || !estResult.data) {
            return { success: false, error: 'Établissement introuvable' }
        }
        const establishment = estResult.data

        if (!checkQuota(establishment)) {
            return { success: false, error: 'Quota de messages atteint. Passez en Pro.' }
        }

        // 4. Send WhatsApp
        const result = await sendWhatsAppMessage({
            to: conversation.client_phone,
            body: messageContent
        })

        if (!result.success) {
            return { success: false, error: result.error || 'Erreur d\'envoi Twilio' }
        }

        // 5. Increment Quota
        await execute(
            `UPDATE establishments SET outbound_quota_used = outbound_quota_used + 1, updated_at = NOW() WHERE id = $1`,
            [establishment.id]
        )

        // 4. Save to history
        await addMessageToConversation(conversationId, {
            role: 'assistant',
            content: messageContent
        })

        return { success: true }
    } catch (error) {
        console.error('sendManualReply error:', error)
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

// ===========================================
// Close / Archive Conversation
// ===========================================

export async function closeConversation(conversationId: string): Promise<ActionResult> {
    try {
        await execute(
            `UPDATE conversations SET status = 'CLOSED', updated_at = NOW() WHERE id = $1`,
            [conversationId]
        )

        const conversation = await queryOne<Conversation>(
            'SELECT establishment_id FROM conversations WHERE id = $1',
            [conversationId]
        )

        if (conversation) {
            await execute(
                `INSERT INTO events (conversation_id, establishment_id, type, payload)
         VALUES ($1, $2, 'CLOSE', '{}'::jsonb)`,
                [conversationId, conversation.establishment_id]
            )
        }

        return { success: true }
    } catch (error) {
        console.error('closeConversation error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

// ===========================================
// Get Dashboard Stats
// ===========================================

export async function getDashboardStats(establishmentId: string): Promise<ActionResult<{
    total: number
    sentimentCounts: Record<Sentiment, number>
    statusCounts: Record<ConversationStatus, number>
}>> {
    try {
        const stats = await query<{
            sentiment: Sentiment
            status: ConversationStatus
            count: string
        }>(
            `SELECT sentiment, status, COUNT(*) as count 
       FROM conversations 
       WHERE establishment_id = $1 
       GROUP BY sentiment, status`,
            [establishmentId]
        )

        const result = {
            total: 0,
            sentimentCounts: { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0, CRITICAL: 0 },
            statusCounts: { OPEN: 0, NEEDS_ATTENTION: 0, CLOSED: 0, CONVERTED: 0 }
        }

        stats.forEach(row => {
            const count = parseInt(row.count, 10)
            result.total += count
            if (row.sentiment) result.sentimentCounts[row.sentiment] += count
            if (row.status) result.statusCounts[row.status] += count
        })

        return { success: true, data: result }
    } catch (error) {
        console.error('getDashboardStats error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}
