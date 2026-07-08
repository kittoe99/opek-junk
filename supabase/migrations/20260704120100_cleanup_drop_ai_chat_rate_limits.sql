-- Cleanup: ai_chat_rate_limits + check_ai_rate_limit are unused (no references in any Opek app).
DROP FUNCTION IF EXISTS public.check_ai_rate_limit(uuid, integer);
DROP TABLE IF EXISTS public.ai_chat_rate_limits;
