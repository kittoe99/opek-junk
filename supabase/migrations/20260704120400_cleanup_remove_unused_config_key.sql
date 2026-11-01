-- Cleanup: remove abandoned agent/sync state key with no code references.
DELETE FROM public.pricing_config WHERE key = 'booking_sync_agent_state';
