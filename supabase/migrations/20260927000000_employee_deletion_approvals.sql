-- HR deletion requests with owner approval + soft-delete + restore.
--
-- Flow: HR inserts a row in deletion_requests (employee stays visible).
-- An owner approves (employees.deleted_at is set, row hidden from lists)
-- or rejects. Owners can restore from trash or purge permanently.
-- Hard deletes are owner-only again; employees.deleted_at can only be
-- changed by owners.

alter table public.employees
  add column if not exists deleted_at timestamptz null;

create index if not exists employees_deleted_at_index
  on public.employees (deleted_at);

create table if not exists public.deletion_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  employee_snapshot jsonb not null default '{}'::jsonb,
  requested_by uuid references public.profiles(id) on delete set null,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  constraint deletion_requests_review_consistent check (
    status = 'pending'
    or (status in ('approved', 'rejected') and reviewed_by is not null and reviewed_at is not null)
  )
);

create unique index if not exists deletion_requests_pending_unique
  on public.deletion_requests (employee_id)
  where status = 'pending';

create index if not exists deletion_requests_status_index
  on public.deletion_requests (status);

-- Only owners may change the soft-delete marker (set or clear).
create or replace function public.protect_employee_soft_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.deleted_at is distinct from old.deleted_at
    and not public.is_dashboard_owner() then
    raise exception 'Only owners can move records to trash or restore them';
  end if;

  return new;
end;
$$;

drop trigger if exists employees_protect_soft_delete on public.employees;

create trigger employees_protect_soft_delete
before update on public.employees
for each row execute function public.protect_employee_soft_delete();

-- HR can no longer hard-delete directly; owners keep that right.
drop policy if exists employees_delete_dashboard on public.employees;
drop policy if exists employees_delete_owner on public.employees;

create policy employees_delete_owner
on public.employees
for delete to authenticated
using (public.is_dashboard_owner());

alter table public.deletion_requests enable row level security;

drop policy if exists deletion_requests_select_dashboard on public.deletion_requests;
drop policy if exists deletion_requests_insert_dashboard on public.deletion_requests;
drop policy if exists deletion_requests_update_owner on public.deletion_requests;

-- Any owner/HR can see requests (needed for pending badges and review).
create policy deletion_requests_select_dashboard
on public.deletion_requests
for select to authenticated
using (public.is_dashboard_user());

-- Any owner/HR can request; new rows must be their own pending request.
create policy deletion_requests_insert_dashboard
on public.deletion_requests
for insert to authenticated
with check (
  public.is_dashboard_user()
  and requested_by = auth.uid()
  and status = 'pending'
);

-- Only owners can approve or reject.
create policy deletion_requests_update_owner
on public.deletion_requests
for update to authenticated
using (public.is_dashboard_owner())
with check (public.is_dashboard_owner());

grant usage on schema public to authenticated;
grant select, insert, update on public.deletion_requests to authenticated;
