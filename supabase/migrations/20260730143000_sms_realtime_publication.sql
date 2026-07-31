-- Fan-out SMS CRM changes to app instances via Supabase Realtime
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.sms_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.sms_thread_contacts;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.sms_automation_enrollments;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.sms_messages REPLICA IDENTITY FULL;
ALTER TABLE public.sms_thread_contacts REPLICA IDENTITY FULL;
ALTER TABLE public.sms_automation_enrollments REPLICA IDENTITY FULL;
