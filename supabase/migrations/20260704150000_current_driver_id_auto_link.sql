-- Link CRM-created driver rows to the signed-in auth user by email so accept/decline RPCs work.
CREATE OR REPLACE FUNCTION public.current_driver_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_email text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT id INTO v_id
  FROM public.drivers
  WHERE user_id = auth.uid()
  LIMIT 1;

  IF v_id IS NOT NULL THEN
    RETURN v_id;
  END IF;

  v_email := lower(trim(coalesce(auth.jwt()->>'email', '')));
  IF v_email = '' THEN
    RETURN NULL;
  END IF;

  SELECT id INTO v_id
  FROM public.drivers
  WHERE lower(trim(email)) = v_email
    AND user_id IS NULL
  ORDER BY (status = 'approved') DESC, created_at ASC
  LIMIT 1;

  IF v_id IS NOT NULL THEN
    UPDATE public.drivers
    SET user_id = auth.uid(), updated_at = now()
    WHERE id = v_id;
  END IF;

  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.current_driver_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_driver_id() TO authenticated;
