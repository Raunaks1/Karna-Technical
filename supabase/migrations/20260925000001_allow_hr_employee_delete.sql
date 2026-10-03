drop policy if exists employees_delete_owner on public.employees;
drop policy if exists employees_delete_dashboard on public.employees;

create policy employees_delete_dashboard
on public.employees
for delete to authenticated
using (public.is_dashboard_user());
