-- 물자관리시스템 Supabase 스키마
-- Supabase 프로젝트 대시보드 > SQL Editor 에서 이 스크립트 전체를 실행하세요.
-- (New query 로 붙여넣고 Run 하면 됩니다.)

create table if not exists admins (
  id text primary key,
  name text not null
);

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
-- Row Level Security
-- 이제 관리자는 Supabase Auth(이메일+비밀번호)로 로그인합니다. 그래서
-- anon key로는 아무 데이터도 읽고 쓸 수 없게 막고, 로그인(=authenticated
-- 상태)한 사용자에게만 전체 읽기/쓰기를 허용합니다.
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

-- 이전 버전(익명 전체 허용)의 정책이 남아있다면 제거
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

-- admins 테이블: 이름 목록 조회는 로그인한 누구나 가능,
-- 새 행 추가는 "본인 계정(id)"으로만 가능 (회원가입 직후 자기 자신을 등록)
drop policy if exists "read - admins" on admins;
drop policy if exists "insert own - admins" on admins;
create policy "read - admins" on admins for select using (auth.role() = 'authenticated');
create policy "insert own - admins" on admins for insert with check (auth.uid() = id);

-- 나머지 업무 테이블: 로그인한 관리자에게 전체 읽기/쓰기 허용
drop policy if exists "authenticated full access - warehouses" on warehouses;
drop policy if exists "authenticated full access - shelves" on shelves;
drop policy if exists "authenticated full access - items" on items;
drop policy if exists "authenticated full access - stock" on stock;
drop policy if exists "authenticated full access - persons" on persons;
drop policy if exists "authenticated full access - holdings" on holdings;
drop policy if exists "authenticated full access - disposals" on disposals;
drop policy if exists "authenticated full access - maintenance" on maintenance;
drop policy if exists "authenticated full access - movement_log" on movement_log;

create policy "authenticated full access - warehouses" on warehouses for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access - shelves" on shelves for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access - items" on items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access - stock" on stock for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access - persons" on persons for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access - holdings" on holdings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access - disposals" on disposals for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access - maintenance" on maintenance for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access - movement_log" on movement_log for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------
-- ⚠️ 꼭 해야 하는 설정: 이메일 인증(Confirm email) 끄기
-- 이 앱은 실제 이메일이 아니라 "이름"으로 가입/로그인하도록 만들어져 있어서,
-- Supabase의 이메일 인증 메일을 절대 받을 수 없습니다. 아래 설정을 꺼두지
-- 않으면 신규 등록 후 로그인이 막힙니다.
--
-- Supabase 대시보드 → Authentication → Sign In / Providers → Email
-- → "Confirm email" 옵션을 OFF로 변경
-- ---------------------------------------------------------------
