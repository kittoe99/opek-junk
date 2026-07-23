-- Driver / contractor model: drivers, state-based geofencing, and job assignments.

-- Shared updated_at trigger helper (search_path pinned).
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 1. Drivers ---------------------------------------------------------------
CREATE TABLE public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  provider_signup_id uuid REFERENCES public.provider_signups(id) ON DELETE SET NULL,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  vehicle_type text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX drivers_user_id_idx ON public.drivers(user_id);
CREATE INDEX drivers_status_idx ON public.drivers(status);
CREATE TRIGGER drivers_set_updated_at BEFORE UPDATE ON public.drivers
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 2. Service areas (geofence by state) -------------------------------------
CREATE TABLE public.driver_service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  state text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (driver_id, state)
);
CREATE INDEX driver_service_areas_state_idx ON public.driver_service_areas(upper(trim(state)));

-- 3. Job assignments -------------------------------------------------------
CREATE TABLE public.job_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  driver_id uuid NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'offered' CHECK (status IN ('offered','accepted','declined','cancelled','completed')),
  assigned_by uuid REFERENCES auth.users(id),
  note text,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX job_assignments_driver_idx ON public.job_assignments(driver_id);
CREATE INDEX job_assignments_booking_idx ON public.job_assignments(booking_id);
CREATE INDEX job_assignments_status_idx ON public.job_assignments(status);
-- Only one active (offered/accepted) assignment per booking.
CREATE UNIQUE INDEX job_assignments_one_active_per_booking
  ON public.job_assignments(booking_id)
  WHERE status IN ('offered','accepted');
CREATE TRIGGER job_assignments_set_updated_at BEFORE UPDATE ON public.job_assignments
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 4. Helper functions (SECURITY DEFINER, bypass RLS to avoid recursion) ----
CREATE OR REPLACE FUNCTION public.current_driver_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.drivers WHERE user_id = auth.uid();
$$;
REVOKE ALL ON FUNCTION public.current_driver_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_driver_id() TO authenticated;

CREATE OR REPLACE FUNCTION public.driver_can_see_booking(p_booking_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.job_assignments ja
    JOIN public.drivers d ON d.id = ja.driver_id
    WHERE ja.booking_id = p_booking_id
      AND d.user_id = auth.uid()
      AND ja.status IN ('offered','accepted','completed')
  );
$$;
REVOKE ALL ON FUNCTION public.driver_can_see_booking(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.driver_can_see_booking(uuid) TO authenticated;

-- 5. RLS -------------------------------------------------------------------
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Driver reads own row" ON public.drivers FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_crm_admin());
CREATE POLICY "Admin manages drivers" ON public.drivers FOR ALL TO authenticated
  USING (public.is_crm_admin()) WITH CHECK (public.is_crm_admin());
GRANT SELECT ON public.drivers TO authenticated;

ALTER TABLE public.driver_service_areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Driver reads own service areas" ON public.driver_service_areas FOR SELECT TO authenticated
  USING (driver_id = public.current_driver_id() OR public.is_crm_admin());
CREATE POLICY "Admin manages service areas" ON public.driver_service_areas FOR ALL TO authenticated
  USING (public.is_crm_admin()) WITH CHECK (public.is_crm_admin());
GRANT SELECT ON public.driver_service_areas TO authenticated;

ALTER TABLE public.job_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Driver reads own assignments" ON public.job_assignments FOR SELECT TO authenticated
  USING (driver_id = public.current_driver_id() OR public.is_crm_admin());
CREATE POLICY "Admin manages assignments" ON public.job_assignments FOR ALL TO authenticated
  USING (public.is_crm_admin()) WITH CHECK (public.is_crm_admin());
GRANT SELECT ON public.job_assignments TO authenticated;
