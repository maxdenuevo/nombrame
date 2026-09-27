-- nombra.me — schema inicial.
-- NO aplicada todavía: se aplica cuando exista el proyecto de Supabase
-- (supabase db push o MCP apply_migration). Referencia: CLAUDE.md, "Modelo de datos".

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  -- Lo elige la persona y lo ve su pareja. Sin género, rol ni datos del
  -- embarazo: la app no los necesita.
  display_name text,
  -- Tokens de Expo Push (puede haber más de un dispositivo).
  expo_push_tokens text[] not null default '{}',
  -- Push sin el nombre del bebé ("Tienes novedades"): la pantalla bloqueada
  -- la ve cualquiera. El nombre de la pareja no va nunca, esté o no activo.
  push_discreet boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.couples (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null unique default encode(gen_random_bytes(4), 'hex'),
  member_a uuid not null references public.profiles (id) on delete cascade,
  member_b uuid references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  linked_at timestamptz,
  -- Desvincular = soft: la fila queda como historial; sus matches se soft-borran.
  dissolved_at timestamptz,
  check (member_b is null or member_a <> member_b)
);

-- Una sola pareja activa por persona (por columna; join_couple/create_couple
-- refuerzan el caso cruzado a-en-una/b-en-otra).
create unique index couples_one_active_a on public.couples (member_a) where dissolved_at is null;
create unique index couples_one_active_b on public.couples (member_b) where dissolved_at is null;

create table public.names (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  gender text not null check (gender in ('f', 'm', 'x')),
  origin text not null,
  meaning text not null
);

-- Los likes son de la PERSONA, no de la pareja (sin couple_id): así valen para
-- el backfill al vincularse y sobreviven a una desvinculación.
create table public.swipes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  name_id uuid not null references public.names (id) on delete cascade,
  liked boolean not null,
  created_at timestamptz not null default now(),
  primary key (user_id, name_id)
);

create index swipes_by_name on public.swipes (name_id) where liked;

-- Tabla real (no vista): necesitamos suscribirnos con Realtime. Soft delete:
-- deshacer un swipe o desvincular la pareja marca deleted_at, nunca DELETE.
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  name_id uuid not null references public.names (id) on delete cascade,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (couple_id, name_id)
);

create index matches_by_couple on public.matches (couple_id) where deleted_at is null;

-- ---------------------------------------------------------------------------
-- Funciones y triggers (toda la lógica de matches vive acá, nada en el cliente)
-- ---------------------------------------------------------------------------

-- Pareja activa de un usuario (y quién es su pareja).
create or replace function public.active_couple_of(uid uuid)
returns table (couple_id uuid, partner_id uuid)
language sql stable security definer set search_path = public
as $$
  select c.id, case when c.member_a = uid then c.member_b else c.member_a end
  from couples c
  where (c.member_a = uid or c.member_b = uid)
    and c.member_b is not null
    and c.dissolved_at is null
  limit 1;
$$;

-- Perfil automático al registrarse. El nombre del proveedor es solo una
-- sugerencia (puede ser uno que la persona ya no usa): la app pregunta "¿Cómo
-- quieres que te llamemos?" al entrar. Solo el primer nombre: la pareja no
-- necesita el apellido. Apple no lo manda en el token; llega del cliente.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'given_name',
      nullif(split_part(new.raw_user_meta_data ->> 'full_name', ' ', 1), '')
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Un swipe nuevo (o cambiado) crea el match si ambos dieron like; si un like
-- pasa a "paso", el match vivo se revierte (soft delete).
create or replace function public.handle_swipe_change()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_couple uuid;
  v_partner uuid;
begin
  select ac.couple_id, ac.partner_id into v_couple, v_partner
  from active_couple_of(new.user_id) ac;
  if v_couple is null then
    return new;
  end if;

  if new.liked and exists (
    select 1 from swipes s
    where s.user_id = v_partner and s.name_id = new.name_id and s.liked
  ) then
    insert into matches (couple_id, name_id)
    values (v_couple, new.name_id)
    on conflict (couple_id, name_id) do update set deleted_at = null;
  elsif not new.liked then
    update matches set deleted_at = now()
    where couple_id = v_couple and name_id = new.name_id and deleted_at is null;
  end if;

  return new;
end;
$$;

create trigger on_swipe_change
  after insert or update of liked on public.swipes
  for each row execute function public.handle_swipe_change();

-- Deshacer un like que había generado match revierte el match. El push de la
-- pareja respeta una ventana de gracia de ~3–5 s (ver Edge Function) para que
-- un deshacer inmediato no deje un match fantasma.
create or replace function public.handle_swipe_delete()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_couple uuid;
begin
  if old.liked then
    select ac.couple_id into v_couple from active_couple_of(old.user_id) ac;
    if v_couple is not null then
      update matches set deleted_at = now()
      where couple_id = v_couple and name_id = old.name_id and deleted_at is null;
    end if;
  end if;
  return old;
end;
$$;

create trigger on_swipe_delete
  after delete on public.swipes
  for each row execute function public.handle_swipe_delete();

-- Backfill retroactivo: al vincularse, los likes previos de ambos (modo
-- individual o parejas anteriores) generan sus matches de una vez.
create or replace function public.backfill_matches(p_couple uuid)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  insert into matches (couple_id, name_id)
  select c.id, sa.name_id
  from couples c
  join swipes sa on sa.user_id = c.member_a and sa.liked
  join swipes sb on sb.user_id = c.member_b and sb.name_id = sa.name_id and sb.liked
  where c.id = p_couple and c.member_b is not null and c.dissolved_at is null
  on conflict (couple_id, name_id) do update set deleted_at = null;
end;
$$;

-- ---------------------------------------------------------------------------
-- RPCs (la escritura sobre couples pasa solo por acá, no por RLS de tabla)
-- ---------------------------------------------------------------------------

create or replace function public.create_couple()
returns table (id uuid, invite_code text)
language plpgsql security definer set search_path = public
as $$
begin
  if exists (select 1 from active_couple_of(auth.uid()))
     or exists (
       select 1 from couples c
       where c.member_a = auth.uid() and c.dissolved_at is null
     ) then
    raise exception 'already_in_couple';
  end if;

  return query
  insert into couples (member_a) values (auth.uid())
  returning couples.id, couples.invite_code;
end;
$$;

create or replace function public.join_couple(p_invite_code text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  v_couple couples%rowtype;
begin
  if exists (select 1 from active_couple_of(auth.uid()))
     or exists (
       select 1 from couples c
       where c.member_a = auth.uid() and c.dissolved_at is null
     ) then
    raise exception 'already_in_couple';
  end if;

  select * into v_couple
  from couples
  where invite_code = p_invite_code and member_b is null and dissolved_at is null
  for update;

  if not found then
    raise exception 'invalid_code';
  end if;
  if v_couple.member_a = auth.uid() then
    raise exception 'cannot_join_own_couple';
  end if;

  update couples set member_b = auth.uid(), linked_at = now() where id = v_couple.id;
  perform backfill_matches(v_couple.id);
  return v_couple.id;
end;
$$;

create or replace function public.dissolve_couple()
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_couple uuid;
begin
  select c.id into v_couple
  from couples c
  where (c.member_a = auth.uid() or c.member_b = auth.uid()) and c.dissolved_at is null
  limit 1;

  if v_couple is null then
    raise exception 'no_couple';
  end if;

  update couples set dissolved_at = now() where id = v_couple;
  -- Los matches son de la pareja: se van con ella. Los swipes son de cada
  -- persona: se quedan (si se re-vinculan, el backfill los regenera).
  update matches set deleted_at = now() where couple_id = v_couple and deleted_at is null;
end;
$$;

revoke execute on function public.create_couple() from anon;
revoke execute on function public.join_couple(text) from anon;
revoke execute on function public.dissolve_couple() from anon;
revoke execute on function public.backfill_matches(uuid) from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.names enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;

create policy "profiles: own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles: partner" on public.profiles
  for select using (id = (select ac.partner_id from active_couple_of(auth.uid()) ac));
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid());

create policy "couples: members read" on public.couples
  for select using (member_a = auth.uid() or member_b = auth.uid());
-- couples: sin políticas de escritura — todo pasa por los RPCs security definer.

create policy "names: catalog readable" on public.names
  for select to authenticated using (true);

-- Privacidad de swipes: nadie ve los swipes de otra persona, ni su pareja.
-- El match se comunica solo vía la tabla matches.
create policy "swipes: select own" on public.swipes
  for select using (user_id = auth.uid());
create policy "swipes: insert own" on public.swipes
  for insert with check (user_id = auth.uid());
create policy "swipes: update own" on public.swipes
  for update using (user_id = auth.uid());
create policy "swipes: delete own" on public.swipes
  for delete using (user_id = auth.uid());

-- Los miembros ven también los matches soft-borrados: el evento UPDATE de
-- Realtime (soft delete) debe llegarles; el cliente filtra deleted_at.
create policy "matches: couple reads" on public.matches
  for select using (
    exists (
      select 1 from couples c
      where c.id = couple_id and (c.member_a = auth.uid() or c.member_b = auth.uid())
    )
  );
-- matches: sin escritura desde el cliente — solo triggers/funciones.

-- ---------------------------------------------------------------------------
-- Realtime: solo matches (Realtime con moderación, ver CLAUDE.md)
-- ---------------------------------------------------------------------------

alter publication supabase_realtime add table public.matches;
