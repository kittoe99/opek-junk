-- Notify support@opekjunkremoval.com when partial quote/lead prebookings are created.

DROP TRIGGER IF EXISTS send_notification_on_insert ON public."Prebooking";

CREATE TRIGGER send_notification_on_insert
  AFTER INSERT ON public."Prebooking"
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_send_form_notification();
