-- Allow owners/HR to update their own display name.
-- Role and status stay immutable through this path so a compromised
-- session cannot escalate privileges via the profiles endpoint.

drop policy if exists profiles_update_own on public.profiles;
drop trigger if exists profiles_protect_privileges on public.profiles;
drop function if exists public.protect_profile_privileges();

grant update on public.profiles to authenticated;

create policy profiles_update_own
on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
    or new.status is distinct from old.status then
    raise exception 'Profile role and status cannot be changed here';
  end if;

  return new;
end;
$$;

create trigger profiles_protect_privileges
before update on public.profiles
for each row execute function public.protect_profile_privileges();
