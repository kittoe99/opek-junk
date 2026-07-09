-- Restrict contractor account creation to CRM-approved driver profiles.

CREATE OR REPLACE FUNCTION public.check_driver_signup_eligibility(p_email text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_driver public.drivers;
BEGIN
  v_email := lower(trim(coalesce(p_email, '')));
  IF v_email = '' THEN
    RETURN jsonb_build_object(
      'eligible', false,
      'reason', 'invalid_email',
      'message', 'Enter a valid email address.'
    );
  END IF;

  SELECT * INTO v_driver
  FROM public.drivers
  WHERE lower(trim(email)) = v_email
  ORDER BY
    CASE status
      WHEN 'approved' THEN 0
      WHEN 'pending' THEN 1
      WHEN 'suspended' THEN 2
      ELSE 3
    END,
    created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'eligible', false,
      'reason', 'not_found',
      'message', 'No approved contractor profile was found for this email. Apply at opekjunkremoval.com/provider-signup or wait for your approval email.'
    );
  END IF;

  IF v_driver.user_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'eligible', false,
      'reason', 'already_linked',
      'message', 'An account already exists for this email. Sign in to the driver app with this address.'
    );
  END IF;

  IF v_driver.status = 'pending' THEN
    RETURN jsonb_build_object(
      'eligible', false,
      'reason', 'pending',
      'message', 'Your application is still under review. You will receive an email when you are approved to create an account.'
    );
  END IF;

  IF v_driver.status = 'suspended' THEN
    RETURN jsonb_build_object(
      'eligible', false,
      'reason', 'suspended',
      'message', 'This contractor profile is suspended. Contact support@opekjunkremoval.com for help.'
    );
  END IF;

  IF v_driver.status <> 'approved' THEN
    RETURN jsonb_build_object(
      'eligible', false,
      'reason', 'not_approved',
      'message', 'This email is not approved for account creation yet.'
    );
  END IF;

  RETURN jsonb_build_object(
    'eligible', true,
    'full_name', v_driver.full_name,
    'phone', v_driver.phone,
    'email', v_driver.email
  );
END;
$$;

REVOKE ALL ON FUNCTION public.check_driver_signup_eligibility(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_driver_signup_eligibility(text) TO anon, authenticated;

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
    AND status = 'approved'
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_id IS NOT NULL THEN
    UPDATE public.drivers
    SET user_id = auth.uid(), updated_at = now()
    WHERE id = v_id;
  END IF;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.register_driver(
  p_full_name text DEFAULT '',
  p_phone text DEFAULT '',
  p_states text[] DEFAULT ARRAY[]::text[]
) RETURNS public.drivers
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_rec public.drivers;
  v_state text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Must be signed in';
  END IF;

  v_email := lower(trim(coalesce(auth.jwt()->>'email', '')));
  IF v_email = '' THEN
    RAISE EXCEPTION 'Email required';
  END IF;

  SELECT * INTO v_rec FROM public.drivers WHERE user_id = auth.uid();
  IF FOUND THEN
    IF trim(p_full_name) <> '' OR trim(p_phone) <> '' THEN
      UPDATE public.drivers SET
        full_name = CASE WHEN trim(p_full_name) <> '' THEN trim(p_full_name) ELSE full_name END,
        phone = CASE WHEN trim(p_phone) <> '' THEN trim(p_phone) ELSE phone END,
        updated_at = now()
      WHERE id = v_rec.id
      RETURNING * INTO v_rec;
    END IF;
  ELSE
    UPDATE public.drivers SET
      user_id = auth.uid(),
      full_name = CASE WHEN trim(p_full_name) <> '' THEN trim(p_full_name) ELSE full_name END,
      phone = CASE WHEN trim(p_phone) <> '' THEN trim(p_phone) ELSE phone END,
      updated_at = now()
    WHERE lower(trim(email)) = v_email
      AND user_id IS NULL
      AND status = 'approved'
    RETURNING * INTO v_rec;
  END IF;

  IF NOT FOUND THEN
    IF public.is_crm_admin() THEN
      RAISE EXCEPTION 'No approved driver profile linked to this account. Use your driver email, not an admin login.';
    END IF;

    RAISE EXCEPTION 'No approved contractor profile found for this email. Use the email from your approval message or contact support@opekjunkremoval.com.';
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

REVOKE ALL ON FUNCTION public.register_driver(text, text, text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_driver(text, text, text[]) TO authenticated;
