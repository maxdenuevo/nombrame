-- Decks temáticos de nombres. La membresía es explícita y curada (decisión
-- editorial), nunca derivada de `origin` u otro campo en runtime: las reglas
-- solo se usan al curar el seed. Los decks "agregados" por cada usuario NO
-- viven acá: son preferencia local del cliente (si algún día se sincronizan,
-- será una tabla `user_decks` aparte).

create table public.decks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  -- Fuente del deck cuando es curado desde datos externos
  -- (ej. 'Registro Civil de Chile'). Visible en la UI.
  attribution text,
  -- Orden de la galería de la biblioteca.
  sort_order int not null default 0
);

create table public.deck_names (
  deck_id uuid not null references public.decks (id) on delete cascade,
  name_id uuid not null references public.names (id) on delete cascade,
  -- Posición curada dentro del deck (1 = primero). Null = sin ranking.
  -- Orden de lectura: `order by rank nulls last, name`.
  rank int,
  primary key (deck_id, name_id)
);

create index deck_names_by_deck on public.deck_names (deck_id, rank);

-- Catálogo de solo lectura, mismo patrón que `names` (00001_init.sql).
alter table public.decks enable row level security;
alter table public.deck_names enable row level security;

create policy "decks: catalog readable" on public.decks
  for select to authenticated using (true);

create policy "deck_names: catalog readable" on public.deck_names
  for select to authenticated using (true);
