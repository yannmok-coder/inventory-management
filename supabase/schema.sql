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
-- 이 앱은 자체적인 "이름 등록형" 관리자 로그인만 사용하고 Supabase Auth는
-- 사용하지 않으므로, 여기서는 anon key로 전체 읽기/쓰기를 허용하는
-- 정책을 둡니다. 내부망에서만 쓰는 도구라면 문제없지만, 외부에 공개되는
-- 서비스로 배포한다면 Supabase Auth 등을 추가로 연동해 접근을 제한하는
-- 것을 권장합니다.
-- ---------------------------------------------------------------
alter table admins enable row level security;
alter table warehouses enable row level security;
alter table shelves enable row level security;
alter table items enable row level security;
alter table stock enable row level security;
alter table persons enable row level security;
alter table holdings enable row level security;
alter table disposals enable row level security;
alter table movement_log enable row level security;

create policy "allow all - admins" on admins for all using (true) with check (true);
create policy "allow all - warehouses" on warehouses for all using (true) with check (true);
create policy "allow all - shelves" on shelves for all using (true) with check (true);
create policy "allow all - items" on items for all using (true) with check (true);
create policy "allow all - stock" on stock for all using (true) with check (true);
create policy "allow all - persons" on persons for all using (true) with check (true);
create policy "allow all - holdings" on holdings for all using (true) with check (true);
create policy "allow all - disposals" on disposals for all using (true) with check (true);
create policy "allow all - movement_log" on movement_log for all using (true) with check (true);
