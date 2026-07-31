-- AI SMS agent fields for pause + message audit meta
ALTER TABLE public.sms_messages
  ADD COLUMN IF NOT EXISTS meta jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.sms_thread_contacts
  ADD COLUMN IF NOT EXISTS ai_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS ai_paused_at timestamptz;

CREATE INDEX IF NOT EXISTS sms_thread_contacts_ai_paused_idx
  ON public.sms_thread_contacts (ai_paused_at)
  WHERE ai_paused_at IS NOT NULL;
