-- Generic sliding-window rate limit log for public edge functions / API routes.
-- Accessed only with the service role key.

CREATE TABLE IF NOT EXISTS public.edge_rate_limits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  bucket TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS edge_rate_limits_bucket_created_idx
  ON public.edge_rate_limits (bucket, created_at DESC);

ALTER TABLE public.edge_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all client access to edge_rate_limits"
  ON public.edge_rate_limits
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

REVOKE ALL ON TABLE public.edge_rate_limits FROM anon, authenticated;
GRANT ALL ON TABLE public.edge_rate_limits TO service_role;

-- Old rows are only needed for the longest window (24h).
CREATE OR REPLACE FUNCTION public.prune_edge_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.edge_rate_limits WHERE created_at < now() - interval '2 days';
$$;

REVOKE ALL ON FUNCTION public.prune_edge_rate_limits() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.prune_edge_rate_limits() TO service_role;
