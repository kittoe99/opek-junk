-- Enable live job offer updates for the driver app.
-- Without this, Realtime channels on job_assignments never receive events.

alter table public.job_assignments replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'job_assignments'
  ) then
    alter publication supabase_realtime add table public.job_assignments;
  end if;
end $$;
