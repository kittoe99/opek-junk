-- Track engagement/bounce rate for the refundable ($1) deposit intro screen.
-- One row per screen view; outcome transitions from 'viewed' -> 'continued' | 'exited'.
-- An aggregate stats row is maintained by a trigger for quick bounce-rate reads.

-- ---------------------------------------------------------------------------
-- 1. Per-view event table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deposit_screen_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text,
  source text,
  deposit_amount numeric,
  outcome text NOT NULL DEFAULT 'viewed'
    CHECK (outcome IN ('viewed', 'continued', 'exited')),
  viewed_at timestamptz NOT NULL DEFAULT now(),
  continued_at timestamptz,
  exited_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS deposit_screen_views_outcome_idx
  ON public.deposit_screen_views (outcome);
CREATE INDEX IF NOT EXISTS deposit_screen_views_viewed_at_idx
  ON public.deposit_screen_views (viewed_at DESC);

ALTER TABLE public.deposit_screen_views ENABLE ROW LEVEL SECURITY;

-- Writes only through SECURITY DEFINER RPCs below; no direct client access.
DROP POLICY IF EXISTS "Deny direct client access to deposit_screen_views" ON public.deposit_screen_views;
CREATE POLICY "Deny direct client access to deposit_screen_views"
  ON public.deposit_screen_views FOR ALL
  USING (false)
  WITH CHECK (false);

REVOKE ALL ON public.deposit_screen_views FROM anon, authenticated;
GRANT SELECT ON public.deposit_screen_views TO service_role;

DROP POLICY IF EXISTS "CRM admin read deposit_screen_views" ON public.deposit_screen_views;
CREATE POLICY "CRM admin read deposit_screen_views"
  ON public.deposit_screen_views FOR SELECT TO authenticated
  USING (public.is_crm_admin());

GRANT SELECT ON public.deposit_screen_views TO authenticated;

-- ---------------------------------------------------------------------------
-- 2. Singleton aggregate stats table (maintained by trigger)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deposit_screen_stats (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  total_views bigint NOT NULL DEFAULT 0,
  total_continued bigint NOT NULL DEFAULT 0,
  total_exited bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.deposit_screen_stats (id) VALUES (true)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.deposit_screen_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny direct client access to deposit_screen_stats" ON public.deposit_screen_stats;
CREATE POLICY "Deny direct client access to deposit_screen_stats"
  ON public.deposit_screen_stats FOR ALL
  USING (false)
  WITH CHECK (false);

REVOKE ALL ON public.deposit_screen_stats FROM anon, authenticated;
GRANT SELECT ON public.deposit_screen_stats TO service_role;

DROP POLICY IF EXISTS "CRM admin read deposit_screen_stats" ON public.deposit_screen_stats;
CREATE POLICY "CRM admin read deposit_screen_stats"
  ON public.deposit_screen_stats FOR SELECT TO authenticated
  USING (public.is_crm_admin());

GRANT SELECT ON public.deposit_screen_stats TO authenticated;

-- ---------------------------------------------------------------------------
-- 3. Trigger: keep the aggregate counters in sync with view rows
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.deposit_screen_stats_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.deposit_screen_stats (id) VALUES (true)
  ON CONFLICT (id) DO NOTHING;

  IF TG_OP = 'INSERT' THEN
    UPDATE public.deposit_screen_stats
    SET total_views = total_views + 1,
        total_continued = total_continued
          + CASE WHEN NEW.outcome = 'continued' THEN 1 ELSE 0 END,
        total_exited = total_exited
          + CASE WHEN NEW.outcome = 'exited' THEN 1 ELSE 0 END,
        updated_at = now()
    WHERE id;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.outcome IS DISTINCT FROM OLD.outcome THEN
    UPDATE public.deposit_screen_stats
    SET total_continued = total_continued
          + CASE WHEN NEW.outcome = 'continued' THEN 1 ELSE 0 END
          - CASE WHEN OLD.outcome = 'continued' THEN 1 ELSE 0 END,
        total_exited = total_exited
          + CASE WHEN NEW.outcome = 'exited' THEN 1 ELSE 0 END
          - CASE WHEN OLD.outcome = 'exited' THEN 1 ELSE 0 END,
        updated_at = now()
    WHERE id;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS deposit_screen_stats_sync_trigger ON public.deposit_screen_views;
CREATE TRIGGER deposit_screen_stats_sync_trigger
  AFTER INSERT OR UPDATE OF outcome ON public.deposit_screen_views
  FOR EACH ROW
  EXECUTE FUNCTION public.deposit_screen_stats_sync();

-- ---------------------------------------------------------------------------
-- 4. Anon-callable tracking RPCs (writes routed through SECURITY DEFINER)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.track_deposit_view(
  p_service_type text DEFAULT NULL,
  p_source text DEFAULT NULL,
  p_deposit_amount numeric DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.deposit_screen_views (service_type, source, deposit_amount)
  VALUES (
    NULLIF(trim(coalesce(p_service_type, '')), ''),
    NULLIF(trim(coalesce(p_source, '')), ''),
    p_deposit_amount
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.track_deposit_view(text, text, numeric) FROM public;
GRANT EXECUTE ON FUNCTION public.track_deposit_view(text, text, numeric) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.track_deposit_outcome(
  p_id uuid,
  p_outcome text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_id IS NULL OR p_outcome IS NULL THEN
    RETURN;
  END IF;

  IF p_outcome NOT IN ('continued', 'exited') THEN
    RETURN;
  END IF;

  UPDATE public.deposit_screen_views
  SET outcome = p_outcome,
      continued_at = CASE WHEN p_outcome = 'continued' THEN now() ELSE continued_at END,
      exited_at = CASE WHEN p_outcome = 'exited' THEN now() ELSE exited_at END,
      updated_at = now()
  WHERE id = p_id
    -- never downgrade a completed 'continued' back to 'exited'
    AND NOT (outcome = 'continued' AND p_outcome = 'exited')
    -- only advance from the initial 'viewed' state (idempotent)
    AND outcome <> p_outcome;
END;
$$;

REVOKE ALL ON FUNCTION public.track_deposit_outcome(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.track_deposit_outcome(uuid, text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Admin bounce-rate reporting function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.crm_deposit_screen_bounce_rate()
RETURNS TABLE (
  total_views bigint,
  total_continued bigint,
  total_exited bigint,
  continue_rate numeric,
  bounce_rate numeric,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_crm_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT
    s.total_views,
    s.total_continued,
    s.total_exited,
    CASE WHEN s.total_views > 0
      THEN round((s.total_continued::numeric / s.total_views) * 100, 2)
      ELSE 0 END AS continue_rate,
    CASE WHEN s.total_views > 0
      THEN round(((s.total_views - s.total_continued)::numeric / s.total_views) * 100, 2)
      ELSE 0 END AS bounce_rate,
    s.updated_at
  FROM public.deposit_screen_stats s
  WHERE s.id;
END;
$$;

REVOKE ALL ON FUNCTION public.crm_deposit_screen_bounce_rate() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_deposit_screen_bounce_rate() TO authenticated, service_role;

COMMENT ON TABLE public.deposit_screen_views IS
  'One row per view of the $1 refundable deposit intro screen. outcome: viewed | continued | exited.';
COMMENT ON TABLE public.deposit_screen_stats IS
  'Singleton aggregate of deposit screen views/continues/exits, maintained by deposit_screen_stats_sync trigger.';
