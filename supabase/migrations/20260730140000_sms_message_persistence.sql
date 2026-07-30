-- Persist SMS CRM message history + thread/opt-out state across deploys
-- Applied to project mjgwoukwyqwoectxfwqv; kept here for repo parity.

CREATE TABLE IF NOT EXISTS public.sms_messages (
  id text PRIMARY KEY,
  sid text UNIQUE,
  direction text NOT NULL CHECK (direction = ANY (ARRAY['inbound'::text, 'outbound'::text])),
  category_id text,
  contact_phone text NOT NULL,
  phone_digits text NOT NULL,
  "to" text,
  "from" text,
  body text NOT NULL DEFAULT ''::text,
  deliverability text NOT NULL DEFAULT 'queued'::text,
  error_code text,
  error_message text,
  contact_name text,
  status_history jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sms_messages_created_at_idx
  ON public.sms_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS sms_messages_phone_digits_idx
  ON public.sms_messages (phone_digits, created_at DESC);
CREATE INDEX IF NOT EXISTS sms_messages_deliverability_idx
  ON public.sms_messages (deliverability, created_at DESC);
CREATE INDEX IF NOT EXISTS sms_messages_category_idx
  ON public.sms_messages (category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS sms_messages_sid_idx
  ON public.sms_messages (sid);

CREATE TABLE IF NOT EXISTS public.sms_thread_contacts (
  phone text PRIMARY KEY,
  phone_digits text NOT NULL UNIQUE,
  name text,
  message_count integer NOT NULL DEFAULT 0,
  outbound_count integer NOT NULL DEFAULT 0,
  inbound_count integer NOT NULL DEFAULT 0,
  unread_count integer NOT NULL DEFAULT 0,
  last_message_at timestamptz,
  last_direction text,
  last_body text,
  last_deliverability text,
  category_ids text[] NOT NULL DEFAULT '{}'::text[],
  opted_out boolean NOT NULL DEFAULT false,
  opted_out_at timestamptz,
  opted_in_at timestamptz,
  opt_out_keyword text,
  opt_out_source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sms_thread_contacts_last_message_idx
  ON public.sms_thread_contacts (last_message_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS sms_thread_contacts_opted_out_idx
  ON public.sms_thread_contacts (opted_out, last_message_at DESC NULLS LAST);

ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_thread_contacts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.sms_messages FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.sms_thread_contacts FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sms_messages TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sms_thread_contacts TO service_role;
