-- Rename branches: Beohari -> Gohparu, Gandhidham -> Pithampur (Indore).
-- Employees reference locations by location_id, so they stay linked automatically.
-- Guarded with NOT EXISTS so re-running is a harmless no-op and never
-- violates the unique (name, city, state) constraint.

update public.locations
set name = 'Gohparu'
where name = 'Beohari'
  and city = 'Shahdol'
  and state = 'Madhya Pradesh'
  and not exists (
    select 1 from public.locations
    where name = 'Gohparu'
      and city = 'Shahdol'
      and state = 'Madhya Pradesh'
  );

update public.locations
set name = 'Pithampur (Indore)',
    city = 'Pithampur',
    state = 'Madhya Pradesh'
where name = 'Gandhidham'
  and city = 'Gandhidham'
  and state = 'Gujarat'
  and not exists (
    select 1 from public.locations
    where name = 'Pithampur (Indore)'
      and city = 'Pithampur'
      and state = 'Madhya Pradesh'
  );
