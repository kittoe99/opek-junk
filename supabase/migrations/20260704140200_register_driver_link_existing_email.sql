-- Link signup to an existing CRM-created driver profile when emails match.
CREATE OR REPLACE FUNCTION public.register_driver(
  p_full_name text DEFAULT '',
  p_phone text DEFAULT '',
  p_states text[] DEFAULT ARRAY[]::text[]
) RETURNS public.drivers
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_email text;
  v_rec public.drivers;
  v_state text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Must be signed in'; END IF;

  v_email := lower(trim(coalesce(auth.jwt()->>'email', '')));
  IF v_email = '' THEN RAISE EXCEPTION 'Email required'; END IF;

  UPDATE public.drivers SET
    user_id = auth.uid(),
    full_name = CASE WHEN trim(p_full_name) <> '' THEN trim(p_full_name) ELSE full_name END,
    phone = CASE WHEN trim(p_phone) <> '' THEN trim(p_phone) ELSE phone END,
    updated_at = now()
  WHERE lower(trim(email)) = v_email AND user_id IS NULL
  RETURNING * INTO v_rec;

  IF NOT FOUND THEN
    INSERT INTO public.drivers (user_id, email, full_name, phone, status)
    VALUES (auth.uid(), v_email, coalesce(nullif(trim(p_full_name), ''), v_email), coalesce(trim(p_phone), ''), 'pending')
    ON CONFLICT (user_id) DO UPDATE SET
      full_name = CASE WHEN trim(p_full_name) <> '' THEN trim(p_full_name) ELSE drivers.full_name END,
      phone = CASE WHEN trim(p_phone) <> '' THEN trim(p_phone) ELSE drivers.phone END,
      updated_at = now()
    RETURNING * INTO v_rec;
  END IF;

  FOREACH v_state IN ARRAY p_states LOOP
    v_state := upper(trim(v_state));
    IF length(v_state) = 2 THEN
      INSERT INTO public.driver_service_areas (driver_id, state)
      VALUES (v_rec.id, v_state)
      ON CONFLICT (driver_id, state) DO NOTHING;
    END IF;
  END LOOP;

  RETURN v_rec;
END;
$$;
