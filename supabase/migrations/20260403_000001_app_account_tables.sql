create or replace function public.set_metis_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  username text not null unique,
  tier text not null default 'free' check (tier in ('free', 'plus_beta', 'paid')),
  is_beta boolean not null default false,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.onboarding_answers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null,
  primary_goal text not null,
  traffic_band text not null,
  hosting_provider text not null,
  app_type text not null,
  team_size text not null,
  biggest_cost_pain text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_counters (
  user_id uuid primary key references auth.users (id) on delete cascade,
  scans_used integer not null default 0,
  period_start timestamptz not null,
  period_end timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_metis_updated_at();

drop trigger if exists set_onboarding_answers_updated_at on public.onboarding_answers;
create trigger set_onboarding_answers_updated_at
before update on public.onboarding_answers
for each row
execute function public.set_metis_updated_at();

drop trigger if exists set_usage_counters_updated_at on public.usage_counters;
create trigger set_usage_counters_updated_at
before update on public.usage_counters
for each row
execute function public.set_metis_updated_at();

alter table public.profiles enable row level security;
alter table public.onboarding_answers enable row level security;
alter table public.usage_counters enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "onboarding_answers_select_own" on public.onboarding_answers;
create policy "onboarding_answers_select_own"
on public.onboarding_answers
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "onboarding_answers_insert_own" on public.onboarding_answers;
create policy "onboarding_answers_insert_own"
on public.onboarding_answers
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "onboarding_answers_update_own" on public.onboarding_answers;
create policy "onboarding_answers_update_own"
on public.onboarding_answers
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "usage_counters_select_own" on public.usage_counters;
create policy "usage_counters_select_own"
on public.usage_counters
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "usage_counters_insert_own" on public.usage_counters;
create policy "usage_counters_insert_own"
on public.usage_counters
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "usage_counters_update_own" on public.usage_counters;
create policy "usage_counters_update_own"
on public.usage_counters
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
