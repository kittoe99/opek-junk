-- Job completions: photo, rating, customer name/signature, and notes.
-- Drivers never write these tables directly; they go through complete_job_with_details().

CREATE TABLE public.job_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_assignment_id uuid NOT NULL REFERENCES public.job_assignments(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  completion_photo_urls text[] NOT NULL DEFAULT '{}',
  rating smallint CHECK (rating >= 1 AND rating <= 5),
  customer_name text NOT NULL DEFAULT '',
  customer_signature_url text,
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX job_completions_one_per_assignment_idx ON public.job_completions(job_assignment_id);
CREATE INDEX job_completions_driver_idx ON public.job_completions(driver_id);

CREATE TRIGGER job_completions_set_updated_at BEFORE UPDATE ON public.job_completions
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- RLS
ALTER TABLE public.job_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Driver reads own completions" ON public.job_completions FOR SELECT TO authenticated
  USING (driver_id = public.current_driver_id() OR public.is_crm_admin());

CREATE POLICY "Admin manages completions" ON public.job_completions FOR ALL TO authenticated
  USING (public.is_crm_admin()) WITH CHECK (public.is_crm_admin());

GRANT SELECT ON public.job_completions TO authenticated;

-- RPC: complete a job with all tracking details (atomic: marks assignment complete + inserts completion)
CREATE OR REPLACE FUNCTION public.complete_job_with_details(
  p_assignment_id uuid,
  p_rating smallint DEFAULT NULL,
  p_customer_name text DEFAULT '',
  p_customer_signature_url text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS public.job_completions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_driver uuid;
  v_completion public.job_completions;
BEGIN
  v_driver := public.current_driver_id();
  IF v_driver IS NULL THEN RAISE EXCEPTION 'Not a registered driver'; END IF;

  UPDATE public.job_assignments
    SET status = 'completed', completed_at = now()
    WHERE id = p_assignment_id AND driver_id = v_driver AND status = 'accepted';
  IF NOT FOUND THEN RAISE EXCEPTION 'Assignment not available to complete'; END IF;

  INSERT INTO public.job_completions (job_assignment_id, driver_id, rating, customer_name, customer_signature_url, notes)
  VALUES (p_assignment_id, v_driver, p_rating, p_customer_name, p_customer_signature_url, COALESCE(p_notes, ''))
  RETURNING * INTO v_completion;

  RETURN v_completion;
END;
$$;
REVOKE ALL ON FUNCTION public.complete_job_with_details(uuid,smallint,text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_job_with_details(uuid,smallint,text,text,text) TO authenticated;

-- RPC: add completion photos (separate step, after completing, in case upload takes time)
CREATE OR REPLACE FUNCTION public.add_completion_photos(
  p_assignment_id uuid,
  p_photo_urls text[]
)
RETURNS public.job_completions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_driver uuid;
  v_completion public.job_completions;
BEGIN
  v_driver := public.current_driver_id();
  IF v_driver IS NULL THEN RAISE EXCEPTION 'Not a registered driver'; END IF;

  UPDATE public.job_completions
    SET completion_photo_urls = array_cat(completion_photo_urls, p_photo_urls)
    WHERE job_assignment_id = p_assignment_id AND driver_id = v_driver
    RETURNING * INTO v_completion;
  IF NOT FOUND THEN RAISE EXCEPTION 'Completion record not found'; END IF;

  RETURN v_completion;
END;
$$;
REVOKE ALL ON FUNCTION public.add_completion_photos(uuid,text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.add_completion_photos(uuid,text[]) TO authenticated;
