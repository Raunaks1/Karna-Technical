-- Adds the Marketing Executive dashboard role.
--
-- Single statement on purpose: ALTER TYPE ... ADD VALUE can refuse to run
-- inside a transaction block on some Postgres hosts. If this file fails to
-- apply, run this one line manually in the SQL Editor, then apply the next
-- migration file (20261008000001_marketing_view_only_policies.sql).
-- No existing rows are changed.
alter type public.dashboard_role add value if not exists 'marketing';
