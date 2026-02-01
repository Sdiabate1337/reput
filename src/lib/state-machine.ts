// ===========================================
// FSM State Machine for Conversations
// ===========================================
// Provides atomic state transitions with validation

import { transaction, execute, queryOne } from '@/lib/db'
import type { ConversationState, Conversation, ActionResult } from '@/types/database'

// Valid state transitions map
export const VALID_TRANSITIONS: Record<ConversationState, ConversationState[]> = {
    'INIT': ['FEEDBACK_PENDING', 'CONVERSION_PENDING', 'ARCHIVED'],
    'FEEDBACK_PENDING': ['RESOLVED', 'ARCHIVED'],
    'CONVERSION_PENDING': ['COMPLETED', 'ARCHIVED'],
    'COMPLETED': [],     // Terminal state
    'RESOLVED': [],      // Terminal state
    'ARCHIVED': []       // Terminal state
}

// Check if a transition is valid
export function isValidTransition(from: ConversationState, to: ConversationState): boolean {
    return VALID_TRANSITIONS[from]?.includes(to) ?? false
}

// Simple state update (non-atomic, for use within existing transactions)
export async function updateConversationState(
    conversationId: string,
    newState: ConversationState,
    additionalUpdates?: Record<string, unknown>
): Promise<ActionResult> {
    try {
        const setClauses = ['current_state = $1', 'last_interaction_at = NOW()']
        const values: unknown[] = [newState]
        let paramIndex = 2

        if (additionalUpdates) {
            for (const [key, value] of Object.entries(additionalUpdates)) {
                setClauses.push(`${key} = $${paramIndex++}`)
                values.push(value)
            }
        }
        values.push(conversationId)

        await execute(
            `UPDATE conversations SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`,
            values
        )

        return { success: true }
    } catch (error) {
        console.error('[FSM] updateConversationState error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'State update failed'
        }
    }
}

// Atomic state transition with optimistic locking
// Ensures the state hasn't changed between read and write
export async function atomicTransition(
    conversationId: string,
    expectedCurrentState: ConversationState,
    newState: ConversationState,
    additionalUpdates?: Record<string, unknown>
): Promise<ActionResult> {
    try {
        // Validate transition
        if (!isValidTransition(expectedCurrentState, newState)) {
            return {
                success: false,
                error: `Invalid transition: ${expectedCurrentState} -> ${newState}`
            }
        }

        const setClauses = ['current_state = $1', 'last_interaction_at = NOW()']
        const values: unknown[] = [newState]
        let paramIndex = 2

        if (additionalUpdates) {
            for (const [key, value] of Object.entries(additionalUpdates)) {
                setClauses.push(`${key} = $${paramIndex++}`)
                values.push(value)
            }
        }

        values.push(conversationId)
        values.push(expectedCurrentState)

        // Optimistic locking: only update if state matches expected
        const result = await execute(
            `UPDATE conversations 
             SET ${setClauses.join(', ')} 
             WHERE id = $${paramIndex} AND current_state = $${paramIndex + 1}`,
            values
        )

        if (result.rowCount === 0) {
            return {
                success: false,
                error: 'State conflict: conversation was modified by another process'
            }
        }

        return { success: true }
    } catch (error) {
        console.error('[FSM] atomicTransition error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Atomic transition failed'
        }
    }
}

// Safe transition with message sending (atomic)
// Rolls back state if message fails
export async function safeTransitionWithMessage(
    conversationId: string,
    expectedCurrentState: ConversationState,
    newState: ConversationState,
    sendMessage: () => Promise<{ success: boolean; error?: string }>,
    additionalUpdates?: Record<string, unknown>
): Promise<ActionResult> {
    try {
        // Validate transition
        if (!isValidTransition(expectedCurrentState, newState)) {
            return {
                success: false,
                error: `Invalid transition: ${expectedCurrentState} -> ${newState}`
            }
        }

        return await transaction(async (client) => {
            // 1. Lock and update state
            const setClauses = ['current_state = $1', 'last_interaction_at = NOW()']
            const values: unknown[] = [newState]
            let paramIndex = 2

            if (additionalUpdates) {
                for (const [key, value] of Object.entries(additionalUpdates)) {
                    setClauses.push(`${key} = $${paramIndex++}`)
                    values.push(value)
                }
            }

            values.push(conversationId)
            values.push(expectedCurrentState)

            const result = await client.query(
                `UPDATE conversations 
                 SET ${setClauses.join(', ')} 
                 WHERE id = $${paramIndex} AND current_state = $${paramIndex + 1}
                 RETURNING id`,
                values
            )

            if (result.rowCount === 0) {
                throw new Error('State conflict or conversation not found')
            }

            // 2. Send message (within transaction)
            const messageResult = await sendMessage()
            if (!messageResult.success) {
                throw new Error(messageResult.error || 'Message send failed')
            }

            return { success: true }
        })
    } catch (error) {
        console.error('[FSM] safeTransitionWithMessage error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Safe transition failed'
        }
    }
}

// Get current state of a conversation
export async function getConversationState(
    conversationId: string
): Promise<ConversationState | null> {
    const result = await queryOne<{ current_state: ConversationState }>(
        'SELECT current_state FROM conversations WHERE id = $1',
        [conversationId]
    )
    return result?.current_state ?? null
}

// Check if conversation is in a terminal state
export function isTerminalState(state: ConversationState): boolean {
    return VALID_TRANSITIONS[state]?.length === 0
}

// Increment reminder count atomically
export async function incrementReminderCount(
    conversationId: string
): Promise<ActionResult<{ newCount: number }>> {
    try {
        const result = await queryOne<{ reminder_count: number }>(
            `UPDATE conversations 
             SET reminder_count = reminder_count + 1, 
                 reminder_last_sent_at = NOW()
             WHERE id = $1 AND reminder_count = 0
             RETURNING reminder_count`,
            [conversationId]
        )

        if (!result) {
            return {
                success: false,
                error: 'Already reminded or conversation not found'
            }
        }

        return { success: true, data: { newCount: result.reminder_count } }
    } catch (error) {
        console.error('[FSM] incrementReminderCount error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to increment reminder'
        }
    }
}
