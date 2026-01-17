// ===========================================
// Database Types for Reput.ai
// ===========================================

export interface Establishment {
    id: string
    user_id: string
    name: string
    google_maps_link: string | null
    google_place_id?: string | null // NEW: For optimized review link (5-star popup)
    twilio_number: string | null
    admin_phone: string | null
    custom_message_neutral?: string
    custom_message_negative?: string
    custom_message_welcome?: string
    custom_message_positive?: string
    plan: 'startup' | 'pro' | 'enterprise'
    whatsapp_onboarding_status: 'PENDING' | 'REQUESTED' | 'CODE_SENT' | 'VERIFYING' | 'ACTIVE' | 'FAILED'
    // Subscription
    subscription_status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED'
    trial_ends_at: string | null // ISO Date
    billing_cycle: 'MONTHLY' | 'YEARLY'
    stripe_customer_id: string | null

    outbound_quota_used: number
    outbound_quota_limit: number
    created_at: string
    updated_at: string
}

export interface Conversation {
    id: string
    establishment_id: string
    client_phone: string
    client_name: string | null
    messages: ConversationMessage[]
    sentiment: Sentiment | null
    language: Language | null
    status: ConversationStatus
    ai_enabled: boolean
    source: ConversationSource
    qr_ref: string | null
    created_at: string
    updated_at: string
}

export interface ConversationMessage {
    role: 'client' | 'assistant'
    content: string
    timestamp: string
}

export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'CRITICAL'
export type Language = 'FR' | 'EN' | 'AR' | 'DARIJA'
export type ConversationStatus = 'OPEN' | 'NEEDS_ATTENTION' | 'CLOSED' | 'CONVERTED'
export type ConversationSource = 'QR_SCAN' | 'MANUAL_SEND' | 'CSV_IMPORT'

export interface Event {
    id: string
    conversation_id: string | null
    establishment_id: string
    type: EventType
    payload: Record<string, unknown>
    created_at: string
}

export type EventType =
    | 'MESSAGE_IN'
    | 'MESSAGE_OUT'
    | 'LINK_SENT'
    | 'ALERT_SENT'
    | 'CONVERSION'
    | 'TAKEOVER'

export interface OutboundMessage {
    id: string
    establishment_id: string
    conversation_id: string | null
    phone: string
    template_type: 'REVIEW_REQUEST' | 'FOLLOW_UP'
    status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED'
    twilio_sid: string | null
    error_message: string | null
    created_at: string
}

// ===========================================
// API Response Types
// ===========================================

export interface ActionResult<T = void> {
    success: boolean
    data?: T
    error?: string
}

export interface PaginatedResult<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
}

// ===========================================
// Analytics Types
// ===========================================

export interface AnalyticsData {
    totalConversations: number
    positive: number
    negative: number
    critical: number
    neutral: number
    satisfactionRate: number
    conversionRate: number
    avgResponseTime: number | null
}

export interface ConversationFilter {
    status?: ConversationStatus
    sentiment?: Sentiment
    source?: ConversationSource
    dateFrom?: string
    dateTo?: string
}
