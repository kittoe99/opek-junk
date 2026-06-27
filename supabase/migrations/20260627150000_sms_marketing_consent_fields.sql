-- Document SMS marketing consent fields stored in customer_info JSONB
-- on Prebooking and bookings records.

COMMENT ON COLUMN public."Prebooking".customer_info IS
  'Customer JSON: name, phone, email, sms_marketing_consent (boolean), sms_marketing_consent_at (ISO timestamp), sms_marketing_consent_text';

COMMENT ON COLUMN public.bookings.customer_info IS
  'Customer JSON: name, phone, email, sms_marketing_consent (boolean), sms_marketing_consent_at (ISO timestamp), sms_marketing_consent_text';

CREATE INDEX IF NOT EXISTS prebooking_sms_consent_at_idx
  ON public."Prebooking" ((customer_info->>'sms_marketing_consent_at'))
  WHERE (customer_info->>'sms_marketing_consent_at') IS NOT NULL
    AND (customer_info->>'sms_marketing_consent_at') <> '';

CREATE INDEX IF NOT EXISTS bookings_sms_consent_at_idx
  ON public.bookings ((customer_info->>'sms_marketing_consent_at'))
  WHERE (customer_info->>'sms_marketing_consent_at') IS NOT NULL
    AND (customer_info->>'sms_marketing_consent_at') <> '';
