-- Marketing Executive: view-only access, except Feedback which every
-- dashboard role (owner, HR, Marketing) can manage like today.
--
-- Login and all reads keep working through is_dashboard_user().
-- Data mutations on employees, locations, and deletion_requests move to the
-- new is_dashboard_editor() (owner + HR), so even direct Supabase API calls
-- cannot bypass the app-level view-only rule.
-- feedback_delete_dashboard intentionally stays on is_dashboard_user().

create or replace function public.is_dashboard_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('owner', 'hr', 'marketing')
      and status = 'active'
  );
$$;

create or replace function public.is_dashboard_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('owner', 'hr')
      and status = 'active'
  );
$$;

-- Employees: inserts/updates require an editor (audit-field checks preserved).
drop policy if exists employees_insert_dashboard on public.employees;
drop policy if exists employees_update_dashboard on public.employees;

create policy employees_insert_dashboard
on public.employees
for insert to authenticated
with check (public.is_dashboard_editor() and created_by = auth.uid());

create policy employees_update_dashboard
on public.employees
for update to authenticated
using (public.is_dashboard_editor())
with check (public.is_dashboard_editor() and updated_by = auth.uid());

-- Locations: all mutations require an editor.
drop policy if exists locations_insert_dashboard on public.locations;
drop policy if exists locations_update_dashboard on public.locations;
drop policy if exists locations_delete_dashboard on public.locations;

create policy locations_insert_dashboard
on public.locations
for insert to authenticated
with check (public.is_dashboard_editor());

create policy locations_update_dashboard
on public.locations
for update to authenticated
using (public.is_dashboard_editor())
with check (public.is_dashboard_editor());

create policy locations_delete_dashboard
on public.locations
for delete to authenticated
using (public.is_dashboard_editor());

-- Deletion requests: only editors can file them (owners still review).
drop policy if exists deletion_requests_insert_dashboard on public.deletion_requests;

create policy deletion_requests_insert_dashboard
on public.deletion_requests
for insert to authenticated
with check (
  public.is_dashboard_editor()
  and requested_by = auth.uid()
  and status = 'pending'
);

-- Feedback deletes stay open to every dashboard role (owner, HR, Marketing).
-- Policy body unchanged; comment updated to record the decision.
drop policy if exists feedback_delete_dashboard on public.feedback;

create policy feedback_delete_dashboard
on public.feedback
for delete to authenticated
using (public.is_dashboard_user());
