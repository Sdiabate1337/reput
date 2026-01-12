-- ===========================================
-- REPUT.AI - Database Schema (PostgreSQL)
-- ===========================================
-- Run this in your PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- 1. USERS (Authentication)
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 2. ESTABLISHMENTS (Clients/Restaurants)
-- ===========================================
CREATE TABLE IF NOT EXISTS establishments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  google_maps_link TEXT,
  
  -- WhatsApp Config
  twilio_number TEXT,
  admin_phone TEXT,
  
  -- Plan & Quota
  plan TEXT DEFAULT 'startup' CHECK (plan IN ('startup', 'pro', 'enterprise')),
  outbound_quota_used INTEGER DEFAULT 0,
  outbound_quota_limit INTEGER DEFAULT 0, -- 0 for startup, 100 for pro
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_establishments_user_id ON establishments(user_id);

-- ===========================================
-- 2. CONVERSATIONS
-- ===========================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  
  -- Client Info
  client_phone TEXT NOT NULL,
  client_name TEXT,
  
  -- Conversation Data
  messages JSONB DEFAULT '[]'::jsonb,
  
  -- AI Analysis
  sentiment TEXT CHECK (sentiment IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'CRITICAL')),
  language TEXT CHECK (language IN ('FR', 'EN', 'AR', 'DARIJA')),
  
  -- Status Management
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'NEEDS_ATTENTION', 'CLOSED', 'CONVERTED')),
  ai_enabled BOOLEAN DEFAULT TRUE,
  
  -- Source Tracking
  source TEXT CHECK (source IN ('QR_SCAN', 'MANUAL_SEND', 'CSV_IMPORT')),
  qr_ref TEXT, -- Reference from QR code (e.g., table number)
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_conversations_establishment ON conversations(establishment_id);
CREATE INDEX IF NOT EXISTS idx_conversations_phone ON conversations(client_phone);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_created ON conversations(created_at DESC);

-- ===========================================
-- 3. EVENTS (Analytics & Audit Trail)
-- ===========================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
  
  -- Event Data
  type TEXT NOT NULL, -- 'MESSAGE_IN', 'MESSAGE_OUT', 'LINK_SENT', 'ALERT_SENT', 'CONVERSION'
  payload JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for event queries
CREATE INDEX IF NOT EXISTS idx_events_conversation ON events(conversation_id);
CREATE INDEX IF NOT EXISTS idx_events_establishment ON events(establishment_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at DESC);

-- ===========================================
-- 4. OUTBOUND_MESSAGES (Tracking sent templates)
-- ===========================================
CREATE TABLE IF NOT EXISTS outbound_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id UUID NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  
  -- Message Details
  phone TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('REVIEW_REQUEST', 'FOLLOW_UP')),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'DELIVERED', 'FAILED')),
  
  -- Twilio Response
  twilio_sid TEXT,
  error_message TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_outbound_establishment ON outbound_messages(establishment_id);

-- ===========================================
-- 5. FUNCTIONS (Helpers)
-- ===========================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER establishments_updated_at
  BEFORE UPDATE ON establishments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- 6. NOTES
-- ===========================================
-- Authorization is handled at the application level (server actions)
-- All queries filter by user_id or establishment_id

-- ===========================================
-- 7. INITIAL DATA (Optional)
-- ===========================================
-- Uncomment to add test data

-- INSERT INTO users (email, password_hash)
-- VALUES ('test@example.com', 'hashed_password_here');

-- INSERT INTO establishments (user_id, name, google_maps_link, plan, outbound_quota_limit)
-- VALUES (
--   (SELECT id FROM users WHERE email = 'test@example.com'),
--   'Test Restaurant',
--   'https://maps.google.com/?cid=123456789',
--   'pro',
--   100
-- );
