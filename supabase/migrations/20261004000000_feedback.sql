-- Public customer feedback + ratings. Reviews publish instantly (no approval
-- queue) per product decision. Dashboard roles can still delete entries.
-- Rate limiting is enforced in the server action via ip_hash.

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  company text not null default '' check (char_length(company) <= 120),
  rating smallint not null check (rating between 1 and 5),
  service text not null check (service in (
    'Engineering & Manpower Services',
    'Fire Equipment Sales & Services',
    'Fire & Safety Training',
    'Safety Audit & Compliance',
    'Other'
  )),
  message text not null check (char_length(trim(message)) between 10 and 1000),
  ip_hash text,
  created_at timestamptz not null default timezone('utc', now())
);

create index feedback_created_index on public.feedback (created_at desc);
create index feedback_ip_created_index on public.feedback (ip_hash, created_at desc);

alter table public.feedback enable row level security;

-- Anyone (including anonymous visitors) can submit and read reviews.
create policy feedback_insert_public on public.feedback
for insert to anon, authenticated
with check (true);

create policy feedback_select_public on public.feedback
for select to anon, authenticated
using (true);

-- Owner and HR accounts can remove inappropriate reviews.
create policy feedback_delete_dashboard on public.feedback
for delete to authenticated
using (public.is_dashboard_user());

grant insert, select on public.feedback to anon, authenticated;
grant delete on public.feedback to authenticated;
