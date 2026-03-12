create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content_html text not null,
  status text not null check (status in ('draft', 'published')) default 'draft',
  published_date date,
  is_favorite boolean not null default false,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.note_categories (
  note_id uuid not null references public.notes(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (note_id, category_id)
);

create table if not exists public.note_tags (
  note_id uuid not null references public.notes(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (note_id, tag_id)
);

create table if not exists public.footnotes (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes(id) on delete cascade,
  sort_order integer not null,
  mode text not null check (mode in ('text', 'book')),
  book text,
  volume text,
  page text,
  hadith_number text,
  note_text text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_notes_updated_at on public.notes;
create trigger trg_notes_updated_at
before update on public.notes
for each row
execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.notes enable row level security;
alter table public.note_categories enable row level security;
alter table public.note_tags enable row level security;
alter table public.footnotes enable row level security;

drop policy if exists "public can read published notes" on public.notes;
create policy "public can read published notes"
on public.notes for select
using (status = 'published');

drop policy if exists "public can read categories" on public.categories;
create policy "public can read categories"
on public.categories for select
using (true);

drop policy if exists "public can read tags" on public.tags;
create policy "public can read tags"
on public.tags for select
using (true);

drop policy if exists "public can read note_categories" on public.note_categories;
create policy "public can read note_categories"
on public.note_categories for select
using (
  exists (
    select 1 from public.notes n
    where n.id = note_id and n.status = 'published'
  )
);

drop policy if exists "public can read note_tags" on public.note_tags;
create policy "public can read note_tags"
on public.note_tags for select
using (
  exists (
    select 1 from public.notes n
    where n.id = note_id and n.status = 'published'
  )
);

drop policy if exists "public can read footnotes" on public.footnotes;
create policy "public can read footnotes"
on public.footnotes for select
using (
  exists (
    select 1 from public.notes n
    where n.id = note_id and n.status = 'published'
  )
);

drop policy if exists "authenticated full categories" on public.categories;
create policy "authenticated full categories"
on public.categories for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated full tags" on public.tags;
create policy "authenticated full tags"
on public.tags for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated full notes" on public.notes;
create policy "authenticated full notes"
on public.notes for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated full note_categories" on public.note_categories;
create policy "authenticated full note_categories"
on public.note_categories for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated full note_tags" on public.note_tags;
create policy "authenticated full note_tags"
on public.note_tags for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated full footnotes" on public.footnotes;
create policy "authenticated full footnotes"
on public.footnotes for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
