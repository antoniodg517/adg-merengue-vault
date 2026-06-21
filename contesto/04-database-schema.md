# 04 — Database Schema

> **Document status:** Official reference for Claude Code.
> **Project:** ADG Merengue Vault
> **Platform:** Supabase (PostgreSQL) + Storage + Row Level Security
> **Last updated:** 2026-06-20

This document is the implementation of the model in doc 05. It is written so Claude Code can generate Supabase migrations directly.

---

## 1. Conventions

- Database: **PostgreSQL** (via Supabase).
- Primary keys: `uuid` with `gen_random_uuid()` (pgcrypto / `uuid-ossp`).
- Timestamps: `timestamptz`, default `now()`; `updated_at` maintained by trigger.
- Naming: `snake_case`, plural table names.
- Money: `numeric(12,2)`; currency stored separately as ISO code.
- Enums: native Postgres `ENUM` types (see §2).
- All app data lives in schema `public`.

---

## 2. Enum types

```sql
create type card_type as enum (
  'base', 'parallel', 'insert', 'auto', 'patch', 'patch_auto',
  'relic', 'booklet', 'printing_plate', 'one_of_one', 'other'
);

create type grading_company as enum (
  'psa', 'bgs', 'sgc', 'cgc', 'tag', 'other'
);

create type card_condition as enum (
  'poor', 'fair', 'good', 'very_good', 'excellent', 'near_mint', 'mint'
);

create type acquisition_source as enum (
  'ebay', 'card_show', 'trade', 'private_sale', 'break', 'other'
);

create type ownership_status as enum (
  'pc', 'for_sale', 'for_trade', 'sold'
);

create type wishlist_priority as enum ('low', 'medium', 'high');
```

---

## 3. Table: `cards`

```sql
create table public.cards (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  -- Identification
  player_name          text not null,
  team                 text default 'Real Madrid',
  season               text,
  brand                text,
  product_line         text,
  card_set             text,
  card_number          text,

  -- Classification
  card_type            card_type,

  -- Rarity
  serial_number        integer check (serial_number is null or serial_number >= 1),
  serial_text          text,

  -- Grading
  graded               boolean not null default false,
  grading_company      grading_company,
  grade_value          text,
  certification_number text,
  condition            card_condition,

  -- Acquisition
  purchase_date        date,
  purchase_price       numeric(12,2) check (purchase_price is null or purchase_price >= 0),
  currency             text not null default 'EUR',
  source               acquisition_source,

  -- Value
  estimated_value      numeric(12,2) check (estimated_value is null or estimated_value >= 0),
  last_sale_value      numeric(12,2) check (last_sale_value is null or last_sale_value >= 0),

  -- Collection / status
  ownership_status     ownership_status not null default 'pc',

  -- Media
  front_image_url      text,
  back_image_url       text,
  gallery_images       text[] not null default '{}',

  -- Metadata / flags
  is_rookie            boolean not null default false,
  is_grail             boolean not null default false,
  is_autograph         boolean not null default false,
  is_patch             boolean not null default false,
  is_match_worn        boolean not null default false,
  is_game_worn         boolean not null default false,
  is_one_of_one        boolean not null default false,
  featured             boolean not null default false,
  notes                text,

  -- Grading mutual-exclusivity constraint
  constraint grading_consistency check (
    (graded = true  and grading_company is not null and grade_value is not null and condition is null)
    or
    (graded = false and condition is not null and grading_company is null and grade_value is null and certification_number is null)
    or
    -- allow "unknown/unset" rows during drafting (both unset)
    (graded = false and condition is null and grading_company is null and grade_value is null)
  )
);
```

> **Note on the constraint:** the third branch lets a card be saved before condition is chosen (draft). If you want to force a condition on every ungraded card, drop the third branch. Default behavior in the admin form is to always require either grading data or a condition before publish.

### Trigger: auto-update `updated_at`

```sql
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create trigger trg_cards_updated_at
  before update on public.cards
  for each row execute function public.set_updated_at();
```

### Indexes

```sql
create index idx_cards_player        on public.cards (player_name);
create index idx_cards_team          on public.cards (team);
create index idx_cards_brand         on public.cards (brand);
create index idx_cards_card_type     on public.cards (card_type);
create index idx_cards_ownership     on public.cards (ownership_status);
create index idx_cards_graded        on public.cards (graded);
create index idx_cards_is_grail      on public.cards (is_grail) where is_grail = true;
create index idx_cards_featured      on public.cards (featured) where featured = true;
create index idx_cards_created_at    on public.cards (created_at desc);

-- Full-text search across the descriptive fields
alter table public.cards add column search_tsv tsvector
  generated always as (
    to_tsvector('simple',
      coalesce(player_name,'') || ' ' || coalesce(team,'') || ' ' ||
      coalesce(brand,'') || ' ' || coalesce(product_line,'') || ' ' ||
      coalesce(card_set,'') || ' ' || coalesce(card_number,'') || ' ' ||
      coalesce(season,''))
  ) stored;
create index idx_cards_search on public.cards using gin (search_tsv);
```

---

## 4. Table: `wishlist`

Backs `/wishlist`. Independent of `cards`.

```sql
create table public.wishlist (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  player_name   text not null,
  team          text default 'Real Madrid',
  season        text,
  brand         text,
  product_line  text,
  card_set      text,
  card_type     card_type,
  desired_serial text,             -- e.g. "/25", "1/1"
  priority      wishlist_priority not null default 'medium',
  reference_image_url text,
  notes         text,
  acquired      boolean not null default false,  -- mark when obtained
  sort_order    integer not null default 0
);

create trigger trg_wishlist_updated_at
  before update on public.wishlist
  for each row execute function public.set_updated_at();

create index idx_wishlist_priority on public.wishlist (priority);
create index idx_wishlist_acquired on public.wishlist (acquired);
```

---

## 5. Table: `contact_messages` (optional)

Backs the optional contact form on `/contact`.

```sql
create table public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  message     text not null,
  handled     boolean not null default false
);
```

---

## 6. Statistics

Statistics are computed (not stored) for accuracy. Two options — implement as a Postgres **view** or an **RPC function** consumed by `/statistics` (see doc 07 §6).

### Recommended: SQL RPC `get_collection_stats()`

```sql
create or replace function public.get_collection_stats()
returns json language sql stable as $$
  select json_build_object(
    'total_cards',        (select count(*) from cards where ownership_status <> 'sold'),
    'total_value',        (select coalesce(sum(estimated_value),0) from cards where ownership_status <> 'sold'),
    'average_value',      (select coalesce(avg(estimated_value),0) from cards where ownership_status <> 'sold'),
    'graded_count',       (select count(*) from cards where graded),
    'graded_percent',     (select round(100.0 * count(*) filter (where graded) / nullif(count(*),0), 1) from cards),
    'rookie_count',       (select count(*) from cards where is_rookie),
    'autograph_count',    (select count(*) from cards where is_autograph),
    'patch_count',        (select count(*) from cards where is_patch),
    'one_of_one_count',   (select count(*) from cards where is_one_of_one),
    'grading_distribution',
      (select coalesce(json_object_agg(grading_company, c),'{}') from
        (select grading_company, count(*) c from cards where graded group by grading_company) s),
    'brand_distribution',
      (select coalesce(json_object_agg(coalesce(brand,'Unknown'), c),'{}') from
        (select brand, count(*) c from cards group by brand) s),
    'player_distribution',
      (select coalesce(json_object_agg(player_name, c),'{}') from
        (select player_name, count(*) c from cards group by player_name) s),
    'top_players',
      (select coalesce(json_agg(row_to_json(t)),'[]') from
        (select player_name, count(*) c from cards group by player_name order by c desc limit 10) t),
    'ownership_distribution',
      (select coalesce(json_object_agg(ownership_status, c),'{}') from
        (select ownership_status, count(*) c from cards group by ownership_status) s)
  );
$$;
```

> The public stats endpoint must **not** expose `purchase_price` aggregates. A separate admin-only RPC `get_admin_stats()` can include cost basis and profit/loss.

---

## 7. Row Level Security (RLS)

All tables have RLS **enabled**. Public users get read-only access to display data; only authenticated admin(s) can write.

```sql
alter table public.cards enable row level security;
alter table public.wishlist enable row level security;
alter table public.contact_messages enable row level security;

-- CARDS: public can read everything except (handled at API layer) sensitive money fields.
create policy "cards_public_read"
  on public.cards for select
  to anon, authenticated
  using (true);

create policy "cards_admin_write"
  on public.cards for all
  to authenticated
  using (auth.uid() = (select id from admins))  -- see admin model below
  with check (auth.uid() = (select id from admins));

-- WISHLIST: public read, admin write
create policy "wishlist_public_read"
  on public.wishlist for select to anon, authenticated using (true);
create policy "wishlist_admin_write"
  on public.wishlist for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- CONTACT: anyone can insert; only admin can read.
create policy "contact_public_insert"
  on public.contact_messages for insert to anon, authenticated with check (true);
create policy "contact_admin_read"
  on public.contact_messages for select to authenticated using (public.is_admin());
```

### Admin identification

Since this is a single-owner vault, the simplest robust approach is an allow-list:

```sql
create table public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text
);

create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;
```

Insert the owner's `auth.users` id into `admins` once after first sign-in. Replace the placeholder `(select id from admins)` policy above with `public.is_admin()` consistently.

> **Sensitive financial fields** (`purchase_price`, `source`, `last_sale_value`) are readable at the row level by anon under `cards_public_read`. To hide them from the public, the public API/queries select an explicit column list (a `cards_public` view), OR a column-filtered view is exposed. Recommended: create a `public.cards_public` view excluding cost fields and point anon reads at it (see §8).

---

## 8. Public view (hides cost basis)

```sql
create view public.cards_public as
  select
    id, created_at, updated_at,
    player_name, team, season, brand, product_line, card_set, card_number,
    card_type, serial_number, serial_text,
    graded, grading_company, grade_value, certification_number, condition,
    estimated_value, last_sale_value,     -- value shown; purchase_price hidden
    ownership_status,
    front_image_url, back_image_url, gallery_images,
    is_rookie, is_grail, is_autograph, is_patch, is_match_worn,
    is_game_worn, is_one_of_one, featured, notes
  from public.cards;
```

> Decision flag for Claude Code: by default **hide `purchase_price`, `currency`, `purchase_date`, `source`** from the public; show `estimated_value`/`last_sale_value` only if the owner wants prices public (config toggle — default: hide all prices publicly, show only on `For Sale`/`For Trade`). See doc 08/09 for the privacy toggle.

---

## 9. Storage (summary — full detail in doc 08)

Two buckets:
- `cards` — public read bucket for card images (`front/`, `back/`, `gallery/`).
- `wishlist` — public read bucket for reference images.

Storage RLS: public `SELECT`; `INSERT/UPDATE/DELETE` restricted to admin (`is_admin()`).

---

## 10. Migration order

1. Extensions (`pgcrypto`).
2. Enum types (§2).
3. `set_updated_at()` function.
4. `admins` table + `is_admin()`.
5. `cards` table + trigger + indexes + `search_tsv`.
6. `wishlist`, `contact_messages`.
7. `cards_public` view.
8. `get_collection_stats()` / `get_admin_stats()`.
9. Enable RLS + policies.
10. Storage buckets + storage policies (doc 08).
