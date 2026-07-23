-- Cleanup: remove the singleton deposit_screen_stats table + sync trigger, and
-- compute the bounce rate directly from deposit_screen_views (few rows, negligible cost).

CREATE OR REPLACE FUNCTION public.crm_deposit_screen_bounce_rate()
RETURNS TABLE(
  total_views bigint,
  total_continued bigint,
  total_exited bigint,
  continue_rate numeric,
  bounce_rate numeric,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.is_crm_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  WITH agg AS (
    SELECT
      count(*)::bigint AS v,
      count(*) FILTER (WHERE outcome = 'continued')::bigint AS c,
      count(*) FILTER (WHERE outcome = 'exited')::bigint AS e,
      max(deposit_screen_views.updated_at) AS u
    FROM public.deposit_screen_views
  )
  SELECT
    a.v,
    a.c,
    a.e,
    CASE WHEN a.v > 0 THEN round((a.c::numeric / a.v) * 100, 2) ELSE 0 END,
    CASE WHEN a.v > 0 THEN round(((a.v - a.c)::numeric / a.v) * 100, 2) ELSE 0 END,
    a.u
  FROM agg a;
END;
$function$;

DROP TRIGGER IF EXISTS deposit_screen_stats_sync_trigger ON public.deposit_screen_views;
DROP FUNCTION IF EXISTS public.deposit_screen_stats_sync();
DROP TABLE IF EXISTS public.deposit_screen_stats;
