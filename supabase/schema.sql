-- 물자관리시스템 Supabase 스키마
-- Supabase 프로젝트 대시보드 > SQL Editor 에서 이 스크립트 전체를 실행하세요.
-- (New query 로 붙여넣고 Run 하면 됩니다. 여러 번 실행해도 안전합니다.)

create table if not exists admins (
  id text primary key,
  name text not null,
  role text not null default 'user',    -- 'admin' | 'user'
  status text not null default 'active' -- 'active' | 'pending'
);

-- 이미 admins 테이블이 있던 경우를 위해 컬럼을 안전하게 추가
alter table admins add column if not exists role text not null default 'user';
alter table admins add column if not exists status text not null default 'active';

create table if not exists warehouses (
  id text primary key,
  name text not null,
  location text default ''
);

create table if not exists shelves (
  id text primary key,
  warehouse_id text not null,
  name text not null,
  rows integer not null,
  cols integer not null
);
create index if not exists idx_shelves_warehouse on shelves(warehouse_id);

create table if not exists items (
  id text primary key,
  name text not null,
  size text default '',
  unit text default '',
  property_qty integer not null default 0,
  season text default '',
  part text default ''
);

create table if not exists stock (
  id text primary key,
  item_id text not null,
  warehouse_id text not null,
  box_id text,
  qty integer not null default 0
);
create index if not exists idx_stock_item on stock(item_id);
create index if not exists idx_stock_warehouse on stock(warehouse_id);

create table if not exists persons (
  id text primary key,
  name text not null,
  dept text not null
);

create table if not exists holdings (
  id text primary key,
  item_id text not null,
  person_id text not null,
  qty integer not null default 0
);
create index if not exists idx_holdings_item on holdings(item_id);
create index if not exists idx_holdings_person on holdings(person_id);

create table if not exists disposals (
  id text primary key,
  item_id text not null,
  item_name text not null,
  size text default '',
  qty integer not null default 0,
  reason text default '',
  warehouse_id text not null,
  warehouse_name text not null,
  status text not null default 'pending',
  created_date timestamptz not null default now(),
  completed_date timestamptz,
  created_by text
);

create table if not exists maintenance (
  id text primary key,
  item_id text not null,
  item_name text not null,
  serial text default '',
  reason text default '',
  status text not null default 'pending', -- pending | in_progress | completed | cancelled
  warehouse_id text,
  warehouse_name text,
  created_date timestamptz not null default now(),
  intake_date timestamptz,
  closed_date timestamptz
);
create index if not exists idx_maintenance_item on maintenance(item_id);
create index if not exists idx_maintenance_status on maintenance(status);

create table if not exists movement_log (
  id text primary key,
  type text not null,
  date timestamptz not null default now(),
  item_name text not null,
  qty integer not null default 0,
  warehouse_name text,
  person_name text,
  detail text,
  actor text
);
create index if not exists idx_log_date on movement_log(date desc);

-- ---------------------------------------------------------------
-- 권한 체크용 함수
-- 현재 로그인한 사용자가 "승인된 관리자(role=admin, status=active)"인지
-- 확인합니다. RLS 정책들에서 반복 사용합니다.
-- ---------------------------------------------------------------
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from admins me
    where me.id = auth.uid()::text
      and me.role = 'admin'
      and me.status = 'active'
  );
$$;

-- 활성 관리자가 한 명도 없는지 확인 (최초 가입자 자동 승인용)
create or replace function no_active_admin_exists()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1 from admins a where a.role = 'admin' and a.status = 'active'
  );
$$;

-- ---------------------------------------------------------------
-- Row Level Security
-- 읽기(조회)는 로그인한 모든 사용자(관리자·일반 사용자)에게 허용하고,
-- 추가/수정/삭제는 "승인된 관리자"만 가능하도록 제한합니다.
-- 이 스크립트는 다시 실행해도 안전하도록 기존 정책을 먼저 지우고 새로 만듭니다.
-- ---------------------------------------------------------------
alter table admins enable row level security;
alter table warehouses enable row level security;
alter table shelves enable row level security;
alter table items enable row level security;
alter table stock enable row level security;
alter table persons enable row level security;
alter table holdings enable row level security;
alter table disposals enable row level security;
alter table maintenance enable row level security;
alter table movement_log enable row level security;

-- 이전 버전의 정책이 남아있다면 모두 제거
drop policy if exists "allow all - admins" on admins;
drop policy if exists "allow all - warehouses" on warehouses;
drop policy if exists "allow all - shelves" on shelves;
drop policy if exists "allow all - items" on items;
drop policy if exists "allow all - stock" on stock;
drop policy if exists "allow all - persons" on persons;
drop policy if exists "allow all - holdings" on holdings;
drop policy if exists "allow all - disposals" on disposals;
drop policy if exists "allow all - maintenance" on maintenance;
drop policy if exists "allow all - movement_log" on movement_log;

drop policy if exists "read - admins" on admins;
drop policy if exists "insert own - admins" on admins;
drop policy if exists "admin update - admins" on admins;
drop policy if exists "admin delete - admins" on admins;

drop policy if exists "authenticated full access - warehouses" on warehouses;
drop policy if exists "authenticated full access - shelves" on shelves;
drop policy if exists "authenticated full access - items" on items;
drop policy if exists "authenticated full access - stock" on stock;
drop policy if exists "authenticated full access - persons" on persons;
drop policy if exists "authenticated full access - holdings" on holdings;
drop policy if exists "authenticated full access - disposals" on disposals;
drop policy if exists "authenticated full access - maintenance" on maintenance;
drop policy if exists "authenticated full access - movement_log" on movement_log;

drop policy if exists "read - warehouses" on warehouses;
drop policy if exists "admin write - warehouses" on warehouses;
drop policy if exists "admin update - warehouses" on warehouses;
drop policy if exists "admin delete - warehouses" on warehouses;

drop policy if exists "read - shelves" on shelves;
drop policy if exists "admin write - shelves" on shelves;
drop policy if exists "admin update - shelves" on shelves;
drop policy if exists "admin delete - shelves" on shelves;

drop policy if exists "read - items" on items;
drop policy if exists "admin write - items" on items;
drop policy if exists "admin update - items" on items;
drop policy if exists "admin delete - items" on items;

drop policy if exists "read - stock" on stock;
drop policy if exists "admin write - stock" on stock;
drop policy if exists "admin update - stock" on stock;
drop policy if exists "admin delete - stock" on stock;

drop policy if exists "read - persons" on persons;
drop policy if exists "admin write - persons" on persons;
drop policy if exists "admin update - persons" on persons;
drop policy if exists "admin delete - persons" on persons;

drop policy if exists "read - holdings" on holdings;
drop policy if exists "admin write - holdings" on holdings;
drop policy if exists "admin update - holdings" on holdings;
drop policy if exists "admin delete - holdings" on holdings;

drop policy if exists "read - disposals" on disposals;
drop policy if exists "admin write - disposals" on disposals;
drop policy if exists "admin update - disposals" on disposals;
drop policy if exists "admin delete - disposals" on disposals;

drop policy if exists "read - maintenance" on maintenance;
drop policy if exists "admin write - maintenance" on maintenance;
drop policy if exists "admin update - maintenance" on maintenance;
drop policy if exists "admin delete - maintenance" on maintenance;

drop policy if exists "read - movement_log" on movement_log;
drop policy if exists "admin write - movement_log" on movement_log;
drop policy if exists "admin update - movement_log" on movement_log;
drop policy if exists "admin delete - movement_log" on movement_log;

-- admins 테이블
-- 조회: 로그인한 누구나
-- 등록: 본인 계정으로만, 그리고 (일반 사용자=즉시 active) 또는
--       (관리자 신청=반드시 pending, 단 활성 관리자가 한 명도 없으면 최초 1명은 즉시 active)
-- 수정/삭제: 승인된 관리자만
create policy "read - admins" on admins for select using (auth.role() = 'authenticated');
create policy "insert own - admins" on admins for insert with check (
  auth.uid()::text = id
  and (
    (role = 'user' and status = 'pending')
    or (role = 'admin' and status = 'active' and no_active_admin_exists())
  )
);
create policy "admin update - admins" on admins for update using (is_admin()) with check (is_admin());
create policy "admin delete - admins" on admins for delete using (is_admin());

-- 나머지 업무 테이블: 조회는 로그인한 누구나, 추가/수정/삭제는 승인된 관리자만
create policy "read - warehouses" on warehouses for select using (auth.role() = 'authenticated');
create policy "admin write - warehouses" on warehouses for insert with check (is_admin());
create policy "admin update - warehouses" on warehouses for update using (is_admin()) with check (is_admin());
create policy "admin delete - warehouses" on warehouses for delete using (is_admin());

create policy "read - shelves" on shelves for select using (auth.role() = 'authenticated');
create policy "admin write - shelves" on shelves for insert with check (is_admin());
create policy "admin update - shelves" on shelves for update using (is_admin()) with check (is_admin());
create policy "admin delete - shelves" on shelves for delete using (is_admin());

create policy "read - items" on items for select using (auth.role() = 'authenticated');
create policy "admin write - items" on items for insert with check (is_admin());
create policy "admin update - items" on items for update using (is_admin()) with check (is_admin());
create policy "admin delete - items" on items for delete using (is_admin());

create policy "read - stock" on stock for select using (auth.role() = 'authenticated');
create policy "admin write - stock" on stock for insert with check (is_admin());
create policy "admin update - stock" on stock for update using (is_admin()) with check (is_admin());
create policy "admin delete - stock" on stock for delete using (is_admin());

create policy "read - persons" on persons for select using (auth.role() = 'authenticated');
create policy "admin write - persons" on persons for insert with check (is_admin());
create policy "admin update - persons" on persons for update using (is_admin()) with check (is_admin());
create policy "admin delete - persons" on persons for delete using (is_admin());

create policy "read - holdings" on holdings for select using (auth.role() = 'authenticated');
create policy "admin write - holdings" on holdings for insert with check (is_admin());
create policy "admin update - holdings" on holdings for update using (is_admin()) with check (is_admin());
create policy "admin delete - holdings" on holdings for delete using (is_admin());

create policy "read - disposals" on disposals for select using (auth.role() = 'authenticated');
create policy "admin write - disposals" on disposals for insert with check (is_admin());
create policy "admin update - disposals" on disposals for update using (is_admin()) with check (is_admin());
create policy "admin delete - disposals" on disposals for delete using (is_admin());

create policy "read - maintenance" on maintenance for select using (auth.role() = 'authenticated');
create policy "admin write - maintenance" on maintenance for insert with check (is_admin());
create policy "admin update - maintenance" on maintenance for update using (is_admin()) with check (is_admin());
create policy "admin delete - maintenance" on maintenance for delete using (is_admin());

create policy "read - movement_log" on movement_log for select using (auth.role() = 'authenticated');
create policy "admin write - movement_log" on movement_log for insert with check (is_admin());
create policy "admin update - movement_log" on movement_log for update using (is_admin()) with check (is_admin());
create policy "admin delete - movement_log" on movement_log for delete using (is_admin());

-- ---------------------------------------------------------------
-- 계정: 아이디(username) · 본인확인 정보(군번 · 생년월일)
-- ---------------------------------------------------------------
-- 로그인 아이디. auth.users 의 email 은 아이디를 hex 로 인코딩한
-- 가짜 주소(u<hex>@jamul.local)라 사람이 읽을 수 없어서 따로 보관합니다.
alter table admins add column if not exists username text;

-- 아이디 중복 방지 (대소문자 구분 없음). username 이 비어있는
-- 예전 계정들은 제외합니다.
create unique index if not exists idx_admins_username_unique
  on admins (lower(username)) where username is not null;

-- 비밀번호 찾기용 본인확인 정보. admins 와 분리해서 보관하고,
-- 본인 또는 승인된 관리자만 조회할 수 있게 합니다.
create table if not exists admin_secrets (
  id text primary key,
  military_id text not null,
  birth_date date not null
);

alter table admin_secrets enable row level security;

drop policy if exists "select own or admin - admin_secrets" on admin_secrets;
drop policy if exists "insert own - admin_secrets" on admin_secrets;
drop policy if exists "update own - admin_secrets" on admin_secrets;

create policy "select own or admin - admin_secrets" on admin_secrets for select
  using (auth.uid()::text = id or is_admin());
create policy "insert own - admin_secrets" on admin_secrets for insert
  with check (auth.uid()::text = id);
create policy "update own - admin_secrets" on admin_secrets for update
  using (auth.uid()::text = id) with check (auth.uid()::text = id);

-- ---------------------------------------------------------------
-- 아이디 -> 가짜 이메일 변환 (앱의 usernameToEmail 과 동일한 규칙)
-- ---------------------------------------------------------------
create or replace function username_to_email(p_username text)
returns text
language sql
immutable
as $$
  select 'u' || encode(convert_to(lower(trim(p_username)), 'UTF8'), 'hex') || '@jamul.local';
$$;

-- ---------------------------------------------------------------
-- 아이디 중복확인
-- 신규 등록 화면은 로그인 전(anon)이라 admins 를 직접 조회할 수 없으므로
-- security definer 함수로 확인합니다. 반환값이 true 면 이미 사용중입니다.
-- p_exclude_id 를 넘기면 그 계정(=본인)은 중복에서 제외합니다.
-- ---------------------------------------------------------------
create or replace function is_username_taken(p_username text, p_exclude_id text default null)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from admins a
    where lower(a.username) = lower(trim(p_username))
      and (p_exclude_id is null or a.id <> p_exclude_id)
  ) or exists (
    select 1 from auth.users u
    where u.email = public.username_to_email(p_username)
      and (p_exclude_id is null or u.id::text <> p_exclude_id)
  );
$$;

revoke all on function is_username_taken(text, text) from public;
grant execute on function is_username_taken(text, text) to anon, authenticated;

-- ---------------------------------------------------------------
-- 내 정보 수정
-- ⚠️ admin_secrets 는 update 가 아니라 upsert 여야 합니다.
--    행이 없는 계정(= 이 기능이 생기기 전에 가입한 계정)에 update 를 하면
--    0건이 갱신되고도 성공으로 응답해서, 저장된 것처럼 보이다가
--    다시 로그인하면 군번·생년월일이 비어있게 됩니다.
-- ---------------------------------------------------------------
create or replace function update_own_profile(
  p_new_username text,
  p_new_email text,
  p_new_name text,
  p_new_military_id text,
  p_new_birth_date date
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_id text := auth.uid()::text;
begin
  if v_id is null then
    return false;
  end if;

  if is_username_taken(p_new_username, v_id) then
    raise exception 'duplicate username' using errcode = '23505';
  end if;

  update admins set name = p_new_name, username = p_new_username where id = v_id;
  if not found then
    return false;
  end if;

  insert into admin_secrets (id, military_id, birth_date)
  values (v_id, p_new_military_id, p_new_birth_date)
  on conflict (id) do update
    set military_id = excluded.military_id,
        birth_date = excluded.birth_date;

  update auth.users set email = p_new_email, updated_at = now() where id = v_id::uuid;

  return true;
end;
$$;

-- ---------------------------------------------------------------
-- 관리자가 다른 계정 정보를 수정 (위와 같은 upsert 수정)
-- ---------------------------------------------------------------
create or replace function admin_update_account(
  p_target_id text,
  p_new_username text,
  p_new_email text,
  p_new_name text,
  p_new_military_id text,
  p_new_birth_date date
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  if not is_admin() then
    return false;
  end if;

  if is_username_taken(p_new_username, p_target_id) then
    raise exception 'duplicate username' using errcode = '23505';
  end if;

  update admins set name = p_new_name, username = p_new_username where id = p_target_id;
  if not found then
    return false;
  end if;

  insert into admin_secrets (id, military_id, birth_date)
  values (p_target_id, p_new_military_id, p_new_birth_date)
  on conflict (id) do update
    set military_id = excluded.military_id,
        birth_date = excluded.birth_date;

  update auth.users set email = p_new_email, updated_at = now() where id = p_target_id::uuid;

  return true;
end;
$$;

-- ---------------------------------------------------------------
-- 비밀번호 찾기: 아이디 · 군번 · 생년월일로 본인 확인 후 재설정
-- (crypt / gen_salt 는 pgcrypto 확장이 필요합니다)
-- ---------------------------------------------------------------
create extension if not exists pgcrypto with schema extensions;

create or replace function verify_and_reset_password(
  p_username text,
  p_military_id text,
  p_birth_date date,
  p_new_password text
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_id text;
begin
  select a.id into v_id
  from admins a
  join admin_secrets s on s.id = a.id
  where a.username = p_username
    and s.military_id = p_military_id
    and s.birth_date = p_birth_date
  limit 1;

  if v_id is null then
    return false;
  end if;

  update auth.users
  set encrypted_password = crypt(p_new_password, gen_salt('bf')),
      updated_at = now()
  where id = v_id::uuid;

  return true;
end;
$$;

-- ---------------------------------------------------------------
-- ⚠️ 꼭 해야 하는 설정: 이메일 인증(Confirm email) 끄기
-- 이 앱은 실제 이메일이 아니라 "이름"으로 가입/로그인하도록 만들어져 있어서,
-- Supabase의 이메일 인증 메일을 절대 받을 수 없습니다. 아래 설정을 꺼두지
-- 않으면 신규 등록 후 로그인이 막힙니다.
--
-- Supabase 대시보드 → Authentication → Sign In / Providers → Email
-- → "Confirm email" 옵션을 OFF로 변경
-- ---------------------------------------------------------------
