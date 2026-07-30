-- ============ roles ============
create type public.app_role as enum ('admin','editor','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "admins read roles" on public.user_roles for select to authenticated
  using (public.has_role(auth.uid(),'admin'));

-- ============ profiles ============
create table public.profiles (
  id uuid primary key,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile write" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end; $$;

create or replace function public.grant_bootstrap_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is not null and lower(new.email) = 'vcomsaid@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id,'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
create trigger on_auth_user_created_admin after insert on auth.users
  for each row execute function public.grant_bootstrap_admin();
create trigger on_auth_user_confirmed_admin after update of email_confirmed_at on auth.users
  for each row when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
  execute function public.grant_bootstrap_admin();

-- ============ shared updated_at ============
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- ============ media ============
create table public.media (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  kind text not null default 'image',
  folder text not null default 'general',
  alt_text text,
  width int, height int, size_bytes bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.media to anon;
grant select, insert, update, delete on public.media to authenticated;
grant all on public.media to service_role;
alter table public.media enable row level security;
create policy "media public read" on public.media for select using (true);
create policy "media admin write" on public.media for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger media_touch before update on public.media for each row execute function public.touch_updated_at();

-- ============ categories ============
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  image_url text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select using (is_visible = true);
create policy "categories admin read" on public.categories for select to authenticated
  using (public.has_role(auth.uid(),'admin'));
create policy "categories admin write" on public.categories for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger categories_touch before update on public.categories for each row execute function public.touch_updated_at();

-- ============ prompts ============
create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  prompt_text text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  ai_model text,
  tags text[] not null default '{}',
  preview_image_url text,
  before_image_url text,
  after_image_url text,
  video_url text,
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  is_pro boolean not null default false,
  is_published boolean not null default true,
  rating numeric(2,1) not null default 5.0,
  rating_count int not null default 0,
  view_count int not null default 0,
  copy_count int not null default 0,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.prompts to anon;
grant select, insert, update, delete on public.prompts to authenticated;
grant all on public.prompts to service_role;
alter table public.prompts enable row level security;
create policy "prompts public read" on public.prompts for select using (is_published = true);
create policy "prompts admin read" on public.prompts for select to authenticated
  using (public.has_role(auth.uid(),'admin'));
create policy "prompts admin write" on public.prompts for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger prompts_touch before update on public.prompts for each row execute function public.touch_updated_at();
create index prompts_category_idx on public.prompts(category_id);
create index prompts_sort_idx on public.prompts(sort_order, created_at desc);

-- ============ reviews ============
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  avatar_url text,
  rating int not null default 5,
  body text not null,
  is_approved boolean not null default false,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert on public.reviews to anon;
grant select, insert, update, delete on public.reviews to authenticated;
grant all on public.reviews to service_role;
alter table public.reviews enable row level security;
create policy "reviews public read" on public.reviews for select using (is_approved = true);
create policy "reviews admin read" on public.reviews for select to authenticated
  using (public.has_role(auth.uid(),'admin'));
create policy "reviews public submit" on public.reviews for insert with check (is_approved = false and is_featured = false);
create policy "reviews admin write" on public.reviews for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger reviews_touch before update on public.reviews for each row execute function public.touch_updated_at();

-- ============ homepage sections ============
create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null default 'home',
  section_key text not null,
  label text not null,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.page_sections to anon;
grant select, insert, update, delete on public.page_sections to authenticated;
grant all on public.page_sections to service_role;
alter table public.page_sections enable row level security;
create policy "sections public read" on public.page_sections for select using (is_visible = true);
create policy "sections admin read" on public.page_sections for select to authenticated
  using (public.has_role(auth.uid(),'admin'));
create policy "sections admin write" on public.page_sections for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger sections_touch before update on public.page_sections for each row execute function public.touch_updated_at();

-- ============ navigation ============
create table public.nav_items (
  id uuid primary key default gen_random_uuid(),
  location text not null default 'header',
  label text not null,
  href text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.nav_items to anon;
grant select, insert, update, delete on public.nav_items to authenticated;
grant all on public.nav_items to service_role;
alter table public.nav_items enable row level security;
create policy "nav public read" on public.nav_items for select using (is_visible = true);
create policy "nav admin read" on public.nav_items for select to authenticated
  using (public.has_role(auth.uid(),'admin'));
create policy "nav admin write" on public.nav_items for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger nav_touch before update on public.nav_items for each row execute function public.touch_updated_at();

-- ============ settings ============
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "settings public read" on public.site_settings for select using (true);
create policy "settings admin write" on public.site_settings for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();

-- ============ analytics events ============
create table public.prompt_events (
  id bigserial primary key,
  prompt_id uuid references public.prompts(id) on delete cascade,
  event_type text not null,
  created_at timestamptz not null default now()
);
grant insert on public.prompt_events to anon;
grant select, insert on public.prompt_events to authenticated;
grant all on public.prompt_events to service_role;
alter table public.prompt_events enable row level security;
create policy "events public insert" on public.prompt_events for insert with check (event_type in ('view','copy','share'));
create policy "events admin read" on public.prompt_events for select to authenticated
  using (public.has_role(auth.uid(),'admin'));
create index prompt_events_created_idx on public.prompt_events(created_at desc);

-- ============ counters ============
create or replace function public.increment_prompt_metric(_prompt_id uuid, _metric text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if _metric = 'view' then
    update public.prompts set view_count = view_count + 1 where id = _prompt_id;
  elsif _metric = 'copy' then
    update public.prompts set copy_count = copy_count + 1 where id = _prompt_id;
  else
    return;
  end if;
  insert into public.prompt_events (prompt_id, event_type) values (_prompt_id, _metric);
end; $$;
grant execute on function public.increment_prompt_metric(uuid, text) to anon, authenticated;