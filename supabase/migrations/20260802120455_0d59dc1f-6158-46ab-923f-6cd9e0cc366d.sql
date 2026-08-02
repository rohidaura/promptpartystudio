create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text not null unique,
  role app_role not null default 'admin',
  created_at timestamptz not null default now()
);

grant select on public.admins to authenticated;
grant all on public.admins to service_role;

alter table public.admins enable row level security;

create policy "admins read list" on public.admins
  for select to authenticated
  using (public.has_role(auth.uid(), 'admin') or lower(email) = lower(coalesce(auth.jwt() ->> 'email','')));

create policy "admins manage list" on public.admins
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

insert into public.admins (user_id, email, role)
select id, lower(email), 'admin' from auth.users where lower(email) = 'vcomsaid@gmail.com'
on conflict (email) do nothing;

create or replace function public.claim_admin_access()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt() ->> 'email',''));
  v_listed boolean;
  v_any_admin boolean;
  v_reason text;
begin
  if v_uid is null then
    return jsonb_build_object('isAdmin', false, 'reason', 'no-session');
  end if;

  if exists (select 1 from public.user_roles where user_id = v_uid and role = 'admin') then
    insert into public.admins (user_id, email, role) values (v_uid, v_email, 'admin')
    on conflict (email) do update set user_id = excluded.user_id;
    return jsonb_build_object('isAdmin', true, 'reason', 'role-present', 'email', v_email);
  end if;

  select exists (select 1 from public.admins where email = v_email) into v_listed;
  select exists (select 1 from public.user_roles where role = 'admin') into v_any_admin;

  if v_listed then
    v_reason := 'allowlisted';
  elsif not v_any_admin and not exists (select 1 from public.admins) then
    v_reason := 'bootstrap';
  else
    return jsonb_build_object('isAdmin', false, 'reason', 'not-allowlisted', 'email', v_email);
  end if;

  insert into public.user_roles (user_id, role) values (v_uid, 'admin')
  on conflict (user_id, role) do nothing;

  insert into public.admins (user_id, email, role) values (v_uid, v_email, 'admin')
  on conflict (email) do update set user_id = excluded.user_id;

  return jsonb_build_object('isAdmin', true, 'reason', v_reason, 'email', v_email);
end; $$;

revoke all on function public.claim_admin_access() from public, anon;
grant execute on function public.claim_admin_access() to authenticated;