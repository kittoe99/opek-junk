-- Ensure SMS CRM invite allowlist includes the primary admin.
-- Registration is invite-only: only emails in crm_admins may use the SMS CRM.

INSERT INTO public.crm_admins (email) VALUES
  ('kofikittoe35@gmail.com')
ON CONFLICT (email) DO NOTHING;
