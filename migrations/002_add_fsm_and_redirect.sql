-- ===========================================
-- REVIEWME FSM ARCHITECTURE - Migration 002
-- ===========================================
-- Adds FSM columns to conversations and creates redirect_events table
-- Run: psql $DATABASE_URL -f migrations/002_add_fsm_and_redirect.sql

-- 1. Create redirect_events table (missing from current schema)
-- This tracks when users click the Google review link for analytics and FSM logic
CREATE TABLE IF NOT EXISTS redirect_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    user_agent TEXT,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for redirect_events
CREATE INDEX IF NOT EXISTS idx_redirect_events_conversation ON redirect_events(conversation_id);
CREATE INDEX IF NOT EXISTS idx_redirect_events_establishment ON redirect_events(establishment_id);
CREATE INDEX IF NOT EXISTS idx_redirect_events_created ON redirect_events(created_at DESC);

-- 2. Create FSM state enum for conversation lifecycle
DO $$ BEGIN
    CREATE TYPE conversation_state AS ENUM (
        'INIT',                 -- Scanned QR, waiting for rating
        'FEEDBACK_PENDING',     -- Rated 1-3, waiting for feedback details
        'CONVERSION_PENDING',   -- Rated 4-5, waiting for Google click
        'COMPLETED',            -- Clicked Google review link
        'RESOLVED',             -- Negative feedback received and acknowledged
        'ARCHIVED'              -- Session expired (>24h) or unsubscribed
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 3. Add FSM columns to conversations table
ALTER TABLE conversations
    ADD COLUMN IF NOT EXISTS current_state conversation_state DEFAULT 'INIT',
    ADD COLUMN IF NOT EXISTS last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS reminder_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS reminder_last_sent_at TIMESTAMPTZ;

-- 4. Performance index for watchdog cron job
-- Only indexes active conversations that need processing
CREATE INDEX IF NOT EXISTS idx_conversations_watchdog 
ON conversations(current_state, last_interaction_at) 
WHERE current_state IN ('INIT', 'FEEDBACK_PENDING', 'CONVERSION_PENDING');

-- 5. Backfill existing conversations with appropriate FSM states
-- Maps old status values to new state machine states
UPDATE conversations 
SET 
    current_state = CASE 
        WHEN status = 'CONVERTED' THEN 'COMPLETED'::conversation_state
        WHEN status = 'CLOSED' THEN 'RESOLVED'::conversation_state
        WHEN status = 'NEEDS_ATTENTION' AND sentiment IN ('NEGATIVE', 'CRITICAL') THEN 'FEEDBACK_PENDING'::conversation_state
        WHEN status = 'NEEDS_ATTENTION' AND sentiment = 'POSITIVE' THEN 'CONVERSION_PENDING'::conversation_state
        WHEN status = 'NEEDS_ATTENTION' AND sentiment = 'NEUTRAL' THEN 'FEEDBACK_PENDING'::conversation_state
        WHEN status = 'OPEN' AND sentiment = 'POSITIVE' THEN 'CONVERSION_PENDING'::conversation_state
        ELSE 'INIT'::conversation_state
    END,
    last_interaction_at = COALESCE(updated_at, created_at)
WHERE current_state IS NULL;

-- 6. Add columns to establishments for template customization (if not exists)
ALTER TABLE establishments
    ADD COLUMN IF NOT EXISTS custom_message_reminder_note TEXT,
    ADD COLUMN IF NOT EXISTS custom_message_reminder_feedback TEXT,
    ADD COLUMN IF NOT EXISTS custom_message_reminder_google TEXT;

-- ===========================================
-- Verification Queries (Run manually to verify)
-- ===========================================
-- Check enum was created:
--   SELECT enumlabel FROM pg_enum WHERE enumtypid = 'conversation_state'::regtype;
--
-- Check conversations have new columns:
--   SELECT current_state, reminder_count FROM conversations LIMIT 5;
--
-- Check redirect_events table exists:
--   SELECT COUNT(*) FROM redirect_events;
