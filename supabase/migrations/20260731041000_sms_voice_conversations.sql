-- Persist ElevenLabs ConvAI call transcripts for SMS CRM (later agent history).
-- Applied to project mjgwoukwyqwoectxfwqv; kept here for repo parity.

CREATE TABLE IF NOT EXISTS public.sms_voice_conversations (
  conversation_id text PRIMARY KEY,
  agent_id text,
  call_sid text,
  status text NOT NULL DEFAULT 'pending',
  phone text,
  phone_digits text,
  direction text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_secs integer,
  transcript jsonb NOT NULL DEFAULT '[]'::jsonb,
  analysis jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,
  call_successful text,
  summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sms_voice_conversations_phone_digits_idx
  ON public.sms_voice_conversations (phone_digits, started_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS sms_voice_conversations_started_at_idx
  ON public.sms_voice_conversations (started_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS sms_voice_conversations_agent_id_idx
  ON public.sms_voice_conversations (agent_id, started_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS sms_voice_conversations_call_sid_idx
  ON public.sms_voice_conversations (call_sid)
  WHERE call_sid IS NOT NULL;

ALTER TABLE public.sms_voice_conversations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.sms_voice_conversations FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sms_voice_conversations TO service_role;

COMMENT ON TABLE public.sms_voice_conversations IS
  'ElevenLabs ConvAI call transcripts linked to SMS CRM phones; not injected into agent history yet.';
