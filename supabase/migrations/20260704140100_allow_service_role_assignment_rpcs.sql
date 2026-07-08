-- CRM API uses service_role; allow assignment RPCs for service_role as well as CRM admins.
CREATE OR REPLACE FUNCTION public.assign_job(
  p_booking_id uuid,
  p_driver_id uuid,
  p_note text DEFAULT NULL,
  p_enforce_state boolean DEFAULT true
) RETURNS public.job_assignments
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_state text;
  v_rec public.job_assignments;
BEGIN
  IF NOT public.is_crm_admin() AND coalesce(auth.jwt()->>'role', '') <> 'service_role' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF EXISTS (SELECT 1 FROM public.job_assignments
            WHERE booking_id = p_booking_id AND status IN ('offered','accepted')) THEN
    RAISE EXCEPTION 'Booking already has an active assignment';
  END IF;

  IF p_enforce_state THEN
    SELECT upper(trim(location_info->>'state')) INTO v_state
      FROM public.bookings WHERE id = p_booking_id;
    IF v_state IS NULL OR v_state = '' THEN
      RAISE EXCEPTION 'Booking has no state on file; pass p_enforce_state => false to override';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.driver_service_areas
                  WHERE driver_id = p_driver_id AND upper(trim(state)) = v_state) THEN
      RAISE EXCEPTION 'Driver does not service state %', v_state;
    END IF;
  END IF;

  INSERT INTO public.job_assignments (booking_id, driver_id, status, assigned_by, note)
  VALUES (p_booking_id, p_driver_id, 'offered', auth.uid(), p_note)
  RETURNING * INTO v_rec;
  RETURN v_rec;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_job_assignment(p_assignment_id uuid, p_note text DEFAULT NULL)
RETURNS public.job_assignments
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_rec public.job_assignments;
BEGIN
  IF NOT public.is_crm_admin() AND coalesce(auth.jwt()->>'role', '') <> 'service_role' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.job_assignments
    SET status = 'cancelled', note = COALESCE(p_note, note)
    WHERE id = p_assignment_id AND status IN ('offered','accepted')
    RETURNING * INTO v_rec;
  IF NOT FOUND THEN RAISE EXCEPTION 'Assignment not available to cancel'; END IF;
  RETURN v_rec;
END;
$$;
