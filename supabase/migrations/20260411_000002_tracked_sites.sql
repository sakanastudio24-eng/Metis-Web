create table if not exists public.tracked_sites (
  user_id uuid not null references auth.users(id) on delete cascade,
  origin text not null,
  last_route text,
  last_scanned_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, origin)
);

drop trigger if exists set_tracked_sites_updated_at on public.tracked_sites;
create trigger set_tracked_sites_updated_at
before update on public.tracked_sites
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.tracked_sites enable row level security;

drop policy if exists "tracked_sites_select_own" on public.tracked_sites;
create policy "tracked_sites_select_own"
on public.tracked_sites
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "tracked_sites_insert_own" on public.tracked_sites;
create policy "tracked_sites_insert_own"
on public.tracked_sites
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "tracked_sites_update_own" on public.tracked_sites;
create policy "tracked_sites_update_own"
on public.tracked_sites
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
