-- Cleanup: orphaned functions left over from a prior product (no triggers, no tables, no app refs).
DROP FUNCTION IF EXISTS public.slugify(text);
DROP FUNCTION IF EXISTS public.notify_form_submission();
DROP FUNCTION IF EXISTS public.set_study_documents_updated_at();
DROP FUNCTION IF EXISTS public.update_conversation_timestamp();
DROP FUNCTION IF EXISTS public.update_plans_updated_at();
DROP FUNCTION IF EXISTS public.update_saved_canvas_images_updated_at();
