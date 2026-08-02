import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Boxes, Warehouse, ArrowLeftRight, Users, Package,
  Trash2, ClipboardList, ShieldCheck, Plus, X, AlertTriangle,
  CheckCircle2, RefreshCw, Search, ChevronDown, ChevronRight,
  UserPlus, LogOut, Pencil, Loader2, Menu, LayoutGrid, Scissors, Wrench
} from 'lucide-react';
import { supabase } from './supabaseClient';

/* ---------------------------------------------------------------
 * 상수 / 유틸
 * ------------------------------------------------------------- */
const LOGO_DATA_URI = 'data:image/jpeg;base64,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';

const uid = (p = 'id') => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
// Supabase Auth는 이메일 기반 로그인만 지원하므로, 관리자 "이름"을 내부적으로만
// 쓰이는 고유한 이메일 형태로 변환해 사용합니다. 실제 메일함과는 무관한 값입니다.
const nameToEmail = (name) => {
  const bytes = new TextEncoder().encode(name.trim());
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  return `u${hex}@jamul.local`;
};
const todayStr = () => new Date().toISOString().slice(0, 10);
const nowIso = () => new Date().toISOString();
const fmtNum = (n) => (Number(n) || 0).toLocaleString('ko-KR');
const itemTag = (it) => {
  if (!it) return '';
  const parts = [it.season, it.part, it.size].filter(Boolean);
  return parts.length ? ` (${parts.join(', ')})` : '';
};
const fmtDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const defaultState = () => ({
  admins: [],
  warehouses: [],
  items: [],
  stock: [],       // { id, itemId, warehouseId, qty }
  persons: [],
  holdings: [],    // { id, itemId, personId, qty }
  disposals: [],   // { id, itemId, itemName, size, qty, reason, warehouseId, warehouseName, status, createdDate, completedDate }
  maintenance: [], // { id, itemId, itemName, serial, reason, status, warehouseId, warehouseName, createdDate, intakeDate, closedDate }
  log: [],
});

const TYPE_LABEL = {
  intake: '입고(신규등록)',
  addProperty: '재산 수정',
  issue: '불출',
  return: '반납',
  transfer: '창고 이동',
  dispose: '폐기 처리',
  adjust: '보유수량 수정',
  split: '위치 분할',
  maintenanceIn: '정비 입고',
  maintenanceDone: '정비 완료',
  maintenanceCancel: '정비 입고 취소',
  issueNew: '신규 재산 불출',
};

function buildCalc(state) {
  const whName = (id) => state.warehouses.find((w) => w.id === id)?.name || '(삭제된 창고)';
  const item = (id) => state.items.find((i) => i.id === id);
  const itemName = (id) => item(id)?.name || '(삭제된 품목)';
  const personName = (id) => state.persons.find((p) => p.id === id)?.name || '(삭제된 인원)';
  const totalStock = (itemId) => state.stock.filter((s) => s.itemId === itemId).reduce((a, b) => a + b.qty, 0);
  const totalHeld = (itemId) => state.holdings.filter((h) => h.itemId === itemId).reduce((a, b) => a + b.qty, 0);
  const stockAt = (itemId, whId) => state.stock.filter((s) => s.itemId === itemId && s.warehouseId === whId).reduce((a, b) => a + b.qty, 0);
  const maintenanceOutQty = (itemId) => state.maintenance.filter((m) => m.itemId === itemId && m.status === 'in_progress').length;
  const maintenanceQty = (itemId) => state.maintenance.filter((m) => m.itemId === itemId && (m.status === 'pending' || m.status === 'in_progress')).length;
  const diff = (it) => totalStock(it.id) + totalHeld(it.id) + maintenanceOutQty(it.id) - it.propertyQty;
  const whStockSum = (whId) => state.stock.filter((s) => s.warehouseId === whId).reduce((a, b) => a + b.qty, 0);
  const pendingDisposal = (itemId) => state.disposals.filter((d) => d.itemId === itemId && d.status === 'pending').reduce((a, b) => a + b.qty, 0);
  const boxLabel = (whId, boxId) => {
    if (!boxId) return '위치 미지정';
    const wh = state.warehouses.find((w) => w.id === whId);
    if (!wh) return '위치 미지정';
    const [shelfId, boxNo] = boxId.split('#');
    const shelf = (wh.shelves || []).find((s) => s.id === shelfId);
    if (!shelf) return '위치 미지정';
    return `${shelf.name} · ${boxNo}번 박스`;
  };
  return { whName, item, itemName, personName, totalStock, totalHeld, stockAt, diff, whStockSum, pendingDisposal, maintenanceQty, boxLabel };
}

function consumeFromRows(stockArr, itemId, warehouseId, qtyNeeded) {
  let remaining = qtyNeeded;
  const result = stockArr.map((s) => {
    if (remaining <= 0) return s;
    if (s.itemId === itemId && s.warehouseId === warehouseId && s.qty > 0) {
      const take = Math.min(s.qty, remaining);
      remaining -= take;
      return { ...s, qty: s.qty - take };
    }
    return s;
  });
  return { stock: result, shortfall: remaining };
}

function warehousesWithStock(state, itemId) {
  const totals = {};
  state.stock.forEach((s) => {
    if (s.itemId === itemId && s.qty > 0) {
      totals[s.warehouseId] = (totals[s.warehouseId] || 0) + s.qty;
    }
  });
  return Object.entries(totals).map(([warehouseId, qty]) => ({ warehouseId, qty }));
}

/* ---------------------------------------------------------------
 * Supabase 데이터 계층
 * 화면/액션 로직은 그대로 두고, 상태를 불러오고(load) 저장하는(save)
 * 부분만 Supabase 테이블과 연결합니다. 저장은 "전체 동기화" 방식으로,
 * 액션이 만든 새 상태(state) 전체를 매번 테이블에 다시 씁니다.
 * (내부 관리 도구 규모에 맞춘 단순한 방식입니다. 데이터/동시 사용자가
 * 많아지면 테이블별로 필요한 행만 insert/update/delete 하는 방식으로
 * 바꾸는 것이 좋습니다.)
 * ------------------------------------------------------------- */
const mapAdminFromDb = (r) => ({ id: r.id, name: r.name, role: r.role || 'user', status: r.status || 'active' });

const mapWarehouseFromDb = (r) => ({ id: r.id, name: r.name, location: r.location || '' });
const mapWarehouseToDb = (w) => ({ id: w.id, name: w.name, location: w.location || '' });

const mapShelfFromDb = (r) => ({ id: r.id, warehouseId: r.warehouse_id, name: r.name, rows: r.rows, cols: r.cols });
const mapShelfToDb = (s, warehouseId) => ({ id: s.id, warehouse_id: warehouseId, name: s.name, rows: s.rows, cols: s.cols });

const mapItemFromDb = (r) => ({ id: r.id, name: r.name, size: r.size || '', unit: r.unit || '', propertyQty: r.property_qty, season: r.season || '', part: r.part || '' });
const mapItemToDb = (it) => ({ id: it.id, name: it.name, size: it.size || '', unit: it.unit || '', property_qty: it.propertyQty, season: it.season || '', part: it.part || '' });

const mapStockFromDb = (r) => ({ id: r.id, itemId: r.item_id, warehouseId: r.warehouse_id, boxId: r.box_id || '', qty: r.qty });
const mapStockToDb = (s) => ({ id: s.id, item_id: s.itemId, warehouse_id: s.warehouseId, box_id: s.boxId || null, qty: s.qty });

const mapPersonFromDb = (r) => ({ id: r.id, name: r.name, dept: r.dept });
const mapPersonToDb = (p) => ({ id: p.id, name: p.name, dept: p.dept });

const mapHoldingFromDb = (r) => ({ id: r.id, itemId: r.item_id, personId: r.person_id, qty: r.qty });
const mapHoldingToDb = (h) => ({ id: h.id, item_id: h.itemId, person_id: h.personId, qty: h.qty });

const mapDisposalFromDb = (r) => ({ id: r.id, itemId: r.item_id, itemName: r.item_name, size: r.size || '', qty: r.qty, reason: r.reason || '', warehouseId: r.warehouse_id, warehouseName: r.warehouse_name, status: r.status, createdDate: r.created_date, completedDate: r.completed_date, createdBy: r.created_by });
const mapDisposalToDb = (d) => ({ id: d.id, item_id: d.itemId, item_name: d.itemName, size: d.size || '', qty: d.qty, reason: d.reason || '', warehouse_id: d.warehouseId, warehouse_name: d.warehouseName, status: d.status, created_date: d.createdDate, completed_date: d.completedDate || null, created_by: d.createdBy || null });

const mapMaintenanceFromDb = (r) => ({ id: r.id, itemId: r.item_id, itemName: r.item_name, serial: r.serial || '', reason: r.reason || '', status: r.status, warehouseId: r.warehouse_id || '', warehouseName: r.warehouse_name || '', createdDate: r.created_date, intakeDate: r.intake_date, closedDate: r.closed_date });
const mapMaintenanceToDb = (m) => ({ id: m.id, item_id: m.itemId, item_name: m.itemName, serial: m.serial || '', reason: m.reason || '', status: m.status, warehouse_id: m.warehouseId || null, warehouse_name: m.warehouseName || null, created_date: m.createdDate, intake_date: m.intakeDate || null, closed_date: m.closedDate || null });

const mapLogFromDb = (r) => ({ id: r.id, type: r.type, date: r.date, itemName: r.item_name, qty: r.qty, warehouseName: r.warehouse_name, personName: r.person_name, detail: r.detail, actor: r.actor });
const mapLogToDb = (l) => ({ id: l.id, type: l.type, date: l.date, item_name: l.itemName, qty: l.qty, warehouse_name: l.warehouseName || null, person_name: l.personName || null, detail: l.detail || null, actor: l.actor || null });

async function loadState() {
  const [
    admins, warehouses, shelves, items, stock, persons, holdings, disposals, maintenance, log,
  ] = await Promise.all([
    supabase.from('admins').select('*'),
    supabase.from('warehouses').select('*'),
    supabase.from('shelves').select('*'),
    supabase.from('items').select('*'),
    supabase.from('stock').select('*'),
    supabase.from('persons').select('*'),
    supabase.from('holdings').select('*'),
    supabase.from('disposals').select('*'),
    supabase.from('maintenance').select('*'),
    supabase.from('movement_log').select('*'),
  ]);
  const firstError = [admins, warehouses, shelves, items, stock, persons, holdings, disposals, maintenance, log]
    .map((r) => r.error).find(Boolean);
  if (firstError) throw firstError;

  const shelvesByWh = {};
  (shelves.data || []).forEach((r) => {
    const s = mapShelfFromDb(r);
    (shelvesByWh[s.warehouseId] = shelvesByWh[s.warehouseId] || []).push({ id: s.id, name: s.name, rows: s.rows, cols: s.cols });
  });

  return {
    admins: (admins.data || []).map(mapAdminFromDb),
    warehouses: (warehouses.data || []).map(mapWarehouseFromDb).map((w) => ({ ...w, shelves: shelvesByWh[w.id] || [] })),
    items: (items.data || []).map(mapItemFromDb),
    stock: (stock.data || []).map(mapStockFromDb),
    persons: (persons.data || []).map(mapPersonFromDb),
    holdings: (holdings.data || []).map(mapHoldingFromDb),
    disposals: (disposals.data || []).map(mapDisposalFromDb),
    maintenance: (maintenance.data || []).map(mapMaintenanceFromDb),
    log: (log.data || []).map(mapLogFromDb),
  };
}

async function syncTable(table, rows) {
  const { error: delErr } = await supabase.from(table).delete().not('id', 'is', null);
  if (delErr) throw delErr;
  if (rows.length > 0) {
    const { error: insErr } = await supabase.from(table).insert(rows);
    if (insErr) throw insErr;
  }
}

async function saveState(state) {
  const flatShelves = [];
  state.warehouses.forEach((w) => {
    (w.shelves || []).forEach((s) => {
      flatShelves.push(mapShelfToDb(s, w.id));
    });
  });
  const warehouseRows = state.warehouses.map(({ shelves, ...w }) => mapWarehouseToDb(w));

  await Promise.all([
    syncTable('warehouses', warehouseRows),
    syncTable('shelves', flatShelves),
    syncTable('items', state.items.map(mapItemToDb)),
    syncTable('stock', state.stock.map(mapStockToDb)),
    syncTable('persons', state.persons.map(mapPersonToDb)),
    syncTable('holdings', state.holdings.map(mapHoldingToDb)),
    syncTable('disposals', state.disposals.map(mapDisposalToDb)),
    syncTable('maintenance', state.maintenance.map(mapMaintenanceToDb)),
    syncTable('movement_log', state.log.map(mapLogToDb)),
  ]);
}

/* ---------------------------------------------------------------
 * 공통 UI 컴포넌트
 * ------------------------------------------------------------- */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
      .jamul-root, .jamul-root * { box-sizing: border-box; }
      .jamul-root {
        --bg: #F2F5F7;
        --surface: #FFFFFF;
        --border: #DEE3E8;
        --ink: #142033;
        --ink-soft: #5B6B7C;
        --sidebar: #0E1826;
        --sidebar-text: #B7C4D1;
        --sidebar-active: #1D3350;
        --accent: #2E6F8E;
        --accent-hover: #24596F;
        --danger: #C23B3B;
        --danger-bg: #FBEAEA;
        --success: #2E9E6E;
        --success-bg: #E7F6EF;
        --warning: #C98A2C;
        --warning-bg: #FBF1E0;
        font-family: 'IBM Plex Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
        color: var(--ink);
        background: var(--bg);
      }
      .jamul-mono { font-family: 'IBM Plex Mono', 'IBM Plex Sans KR', monospace; font-variant-numeric: tabular-nums; }
      .jamul-root table { width: max-content; min-width: 100%; border-collapse: collapse; }
      .jamul-root table th, .jamul-root table td { white-space: nowrap; }
      .jamul-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
      .jamul-ledger-row.status-deficit { border-left: 3px solid var(--danger); }
      .jamul-ledger-row.status-surplus { border-left: 3px solid var(--warning); }
      .jamul-ledger-row { border-left: 3px solid transparent; }
      .jamul-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
      .jamul-scrollbar::-webkit-scrollbar-thumb { background: #C7D0D9; border-radius: 4px; }
      .jamul-btn-primary { background: var(--accent); color: #fff; }
      .jamul-btn-primary:hover { background: var(--accent-hover); }
      .jamul-focus:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
    `}</style>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#F2F5F7' }}>
      <div className="flex items-center gap-2" style={{ color: '#5B6B7C' }}>
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">불러오는 중...</span>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: 'rgba(14,24,38,0.45)' }}
      onClick={onClose}
    >
      <div
        className={`jamul-card w-full ${wide ? 'max-w-2xl' : 'max-w-md'} overflow-y-auto jamul-scrollbar`}
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={16} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ confirmState, setConfirmState }) {
  if (!confirmState) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(14,24,38,0.45)' }}>
      <div className="jamul-card w-full max-w-sm p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--danger-bg)' }}>
            <AlertTriangle size={18} color="var(--danger)" />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{confirmState.message}</p>
            {confirmState.detail && <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>{confirmState.detail}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setConfirmState(null)} className="px-3 py-1.5 rounded-lg text-sm border" style={{ borderColor: 'var(--border)' }}>취소</button>
          <button
            onClick={() => { confirmState.onConfirm(); setConfirmState(null); }}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ background: 'var(--danger)' }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const isDanger = toast.tone === 'danger';
  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm text-white"
      style={{ background: isDanger ? 'var(--danger)' : 'var(--ink)' }}
    >
      {isDanger ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
      {toast.msg}
    </div>
  );
}

function DiffBadge({ value }) {
  if (value < 0) {
    return (
      <span className="jamul-mono inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md" style={{ color: 'var(--danger)', background: 'var(--danger-bg)' }}>
        <AlertTriangle size={11} />{value}
      </span>
    );
  }
  if (value > 0) {
    return (
      <span className="jamul-mono inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md" style={{ color: 'var(--warning)', background: 'var(--warning-bg)' }}>
        +{value}
      </span>
    );
  }
  return (
    <span className="jamul-mono inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md" style={{ color: 'var(--success)', background: 'var(--success-bg)' }}>
      0
    </span>
  );
}

function LocationSelect({ warehouseId, state, value, onChange, excludeBoxId }) {
  const wh = state.warehouses.find((w) => w.id === warehouseId);
  const shelves = wh?.shelves || [];
  if (!warehouseId) {
    return <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>먼저 창고를 선택해주세요.</p>;
  }
  if (shelves.length === 0) {
    return <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>이 창고에는 등록된 선반이 없습니다. 창고 관리에서 약도를 먼저 만들어주세요.</p>;
  }
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
      <option value="">위치 미지정</option>
      {shelves.map((shelf) => (
        <optgroup key={shelf.id} label={shelf.name}>
          {Array.from({ length: shelf.rows * shelf.cols }, (_, i) => i + 1)
            .map((n) => `${shelf.id}#${n}`)
            .filter((boxId) => boxId !== excludeBoxId)
            .map((boxId) => {
              const n = boxId.split('#')[1];
              return <option key={boxId} value={boxId}>{n}번 박스</option>;
            })}
        </optgroup>
      ))}
    </select>
  );
}

/* ---------------------------------------------------------------
 * 사이드바 / 상단바
 * ------------------------------------------------------------- */
const NAV_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { id: 'inventory', label: '재고 현황', icon: Boxes },
  { id: 'warehouses', label: '창고 관리', icon: Warehouse },
  { id: 'issuance', label: '불출 현황', icon: ArrowLeftRight },
  { id: 'persons', label: '인원 관리', icon: Users },
  { id: 'itemsManage', label: '품목 관리', icon: Package },
  { id: 'maintenance', label: '정비 입고', icon: Wrench },
  { id: 'disposal', label: '폐품 관리', icon: Trash2 },
  { id: 'log', label: '물자 이동 로그', icon: ClipboardList },
  { id: 'admins', label: '관리자 관리', icon: ShieldCheck },
];

function Sidebar({ activeTab, setActiveTab, state, calc, collapsed, onToggle, isAdmin }) {
  const deficitCount = state.items.filter((it) => calc.diff(it) < 0).length;
  const pendingDisposalCount = state.disposals.filter((d) => d.status === 'pending').length;
  const pendingMaintenanceCount = state.maintenance.filter((m) => m.status === 'pending').length;
  const pendingAdminCount = state.admins.filter((a) => a.status === 'pending').length;
  const badgeFor = (id) => {
    if (id === 'inventory' && deficitCount > 0) return deficitCount;
    if (id === 'disposal' && pendingDisposalCount > 0) return pendingDisposalCount;
    if (id === 'maintenance' && pendingMaintenanceCount > 0) return pendingMaintenanceCount;
    if (id === 'admins' && pendingAdminCount > 0) return pendingAdminCount;
    return 0;
  };
  const visibleNavItems = NAV_ITEMS.filter((item) => item.id !== 'admins' || isAdmin);
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-56'} shrink-0 flex flex-col transition-all`} style={{ background: 'var(--sidebar)' }}>
      <div className={`px-3 py-5 flex items-center border-b ${collapsed ? 'justify-center' : 'justify-between gap-2'}`} style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        {collapsed ? (
          <button
            onClick={onToggle}
            className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden p-0.5 jamul-focus"
            title="메뉴 펼치기"
          >
            <img src={LOGO_DATA_URI} alt="로고" className="w-full h-full object-contain" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                <img src={LOGO_DATA_URI} alt="로고" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-tight truncate">물자관리시스템</p>
                <p className="text-xs" style={{ color: 'var(--sidebar-text)' }}>통합 재고 관제</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 jamul-focus"
              style={{ background: 'var(--sidebar-active)' }}
              title="메뉴 접기"
            >
              <Menu size={14} color="#fff" />
            </button>
          </>
        )}
      </div>
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto jamul-scrollbar">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          const badge = badgeFor(item.id);
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors jamul-focus ${collapsed ? 'justify-center' : ''}`}
              style={{ background: active ? 'var(--sidebar-active)' : 'transparent', color: active ? '#fff' : 'var(--sidebar-text)' }}
            >
              <Icon size={16} />
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && badge > 0 && (
                <span
                  className="jamul-mono text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: (item.id === 'disposal' || item.id === 'maintenance' || item.id === 'admins') ? 'var(--warning)' : 'var(--danger)', color: '#fff' }}
                >
                  {badge}
                </span>
              )}
              {collapsed && badge > 0 && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: (item.id === 'disposal' || item.id === 'maintenance' || item.id === 'admins') ? 'var(--warning)' : 'var(--danger)' }}
                />
              )}
            </button>
          );
        })}
      </nav>
      {!collapsed && (
        <div className="px-4 py-3 text-xs" style={{ color: 'var(--sidebar-text)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          품목 {state.items.length} · 창고 {state.warehouses.length} · 인원 {state.persons.length}
        </div>
      )}
    </aside>
  );
}

const TAB_TITLES = {
  dashboard: '대시보드', inventory: '재고 현황', warehouses: '창고 관리', issuance: '불출 현황',
  persons: '인원 관리', itemsManage: '품목 관리', maintenance: '정비 입고', disposal: '폐품 관리', log: '물자 이동 로그', admins: '관리자 관리',
};

function Topbar({ activeTab, currentAdmin, isAdmin, saving, onRefresh, onSwitch }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div>
        <h2 className="text-base font-bold" style={{ color: 'var(--ink)' }}>{TAB_TITLES[activeTab]}</h2>
        <p className="text-xs jamul-mono" style={{ color: 'var(--ink-soft)' }}>{todayStr().split('-').join('.')}</p>
      </div>
      <div className="flex items-center gap-3">
        {saving && (
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--ink-soft)' }}>
            <Loader2 size={12} className="animate-spin" />저장 중
          </span>
        )}
        <button onClick={onRefresh} className="p-2 rounded-lg border jamul-focus" style={{ borderColor: 'var(--border)' }} title="새로고침">
          <RefreshCw size={14} />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l" style={{ borderColor: 'var(--border)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent)' }}>
            {currentAdmin ? currentAdmin[0] : '?'}
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{currentAdmin}</span>
          <span
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={{ background: isAdmin ? 'var(--success-bg)' : 'var(--warning-bg)', color: isAdmin ? 'var(--success)' : 'var(--warning)' }}
          >
            {isAdmin ? '관리자' : '일반 사용자'}
          </span>
          <button onClick={onSwitch} className="p-1.5 rounded-lg hover:bg-gray-100" title="관리자 전환">
            <LogOut size={14} style={{ color: 'var(--ink-soft)' }} />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------
 * 로그인 게이트
 * ------------------------------------------------------------- */
function LoginGate({ onLogin, onSignup }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('user'); // 'user' | 'admin'
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError('');
    setNotice('');
    if (!name.trim() || !password) { setError('이름과 비밀번호를 입력해주세요.'); return; }
    if (mode === 'signup' && password !== confirm) { setError('비밀번호가 서로 일치하지 않습니다.'); return; }
    setSubmitting(true);
    const result = mode === 'login' ? await onLogin(name, password) : await onSignup(name, password, role);
    setSubmitting(false);
    if (!result.ok) {
      if (result.pending) setNotice(result.message);
      else setError(result.message);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setNotice('');
    setPassword('');
    setConfirm('');
    setRole('user');
  };

  return (
    <div className="jamul-root min-h-screen w-full flex items-center justify-center p-6">
      <GlobalStyle />
      <div className="jamul-card w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden p-0.5 border" style={{ borderColor: 'var(--border)' }}>
            <img src={LOGO_DATA_URI} alt="로고" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--ink)' }}>물자관리시스템</h1>
            <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>재고 · 창고 · 인원 통합관리</p>
          </div>
        </div>

        <div className="inline-flex rounded-lg border p-0.5 mt-6 mb-5" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => switchMode('login')}
            className="px-4 py-1.5 rounded-md text-sm"
            style={{ background: mode === 'login' ? 'var(--accent)' : 'transparent', color: mode === 'login' ? '#fff' : 'var(--ink-soft)' }}
          >
            로그인
          </button>
          <button
            onClick={() => switchMode('signup')}
            className="px-4 py-1.5 rounded-md text-sm"
            style={{ background: mode === 'signup' ? 'var(--accent)' : 'transparent', color: mode === 'signup' ? '#fff' : 'var(--ink-soft)' }}
          >
            신규 등록
          </button>
        </div>

        <div className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>가입 유형</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => setRole('user')}
                  className="px-3 py-2 rounded-lg text-sm border"
                  style={{ borderColor: role === 'user' ? 'var(--accent)' : 'var(--border)', background: role === 'user' ? 'var(--success-bg)' : 'var(--surface)', color: role === 'user' ? 'var(--accent)' : 'var(--ink-soft)' }}
                >
                  일반 사용자
                </button>
                <button
                  onClick={() => setRole('admin')}
                  className="px-3 py-2 rounded-lg text-sm border"
                  style={{ borderColor: role === 'admin' ? 'var(--accent)' : 'var(--border)', background: role === 'admin' ? 'var(--success-bg)' : 'var(--surface)', color: role === 'admin' ? 'var(--accent)' : 'var(--ink-soft)' }}
                >
                  관리자
                </button>
              </div>
              {role === 'admin' && (
                <p className="text-xs mt-1.5" style={{ color: 'var(--warning)' }}>관리자로 신청하면 기존 관리자의 승인 후 로그인이 가능합니다.</p>
              )}
              {role === 'user' && (
                <p className="text-xs mt-1.5" style={{ color: 'var(--ink-soft)' }}>일반 사용자는 등록 즉시 로그인할 수 있고, 조회만 가능합니다.</p>
              )}
            </div>
          )}
          <div>
            <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>이름</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름 입력"
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && mode === 'login') submit(); }}
              placeholder={mode === 'signup' ? '6자 이상 입력' : '비밀번호 입력'}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>비밀번호 확인</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                placeholder="비밀번호 다시 입력"
                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
          )}

          {error && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>{error}</p>
          )}
          {notice && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>{notice}</p>
          )}

          <button
            onClick={submit}
            disabled={submitting}
            className="jamul-btn-primary w-full rounded-lg py-2.5 text-sm font-medium mt-1"
          >
            {submitting ? '처리 중...' : mode === 'login' ? '로그인' : '등록하고 시작하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
 * 대시보드
 * ------------------------------------------------------------- */
function DashboardView({ state, calc, setActiveTab }) {
  const totalProperty = state.items.reduce((a, b) => a + b.propertyQty, 0);
  const deficitItems = state.items.filter((it) => calc.diff(it) < 0);
  const pendingDisposals = state.disposals.filter((d) => d.status === 'pending');
  const maintenanceActive = state.maintenance.filter((m) => m.status === 'pending' || m.status === 'in_progress');
  const recentLog = [...state.log].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  const heldTotal = state.holdings.reduce((a, b) => a + b.qty, 0);

  const cards = [
    { label: '등록 품목', value: state.items.length, unit: '종' },
    { label: '창고 수', value: state.warehouses.length, unit: '개' },
    { label: '등록 인원', value: state.persons.length, unit: '명' },
    { label: '재산 총수량', value: totalProperty, unit: '개' },
    { label: '현재 불출중', value: heldTotal, unit: '개' },
    { label: '정비입고중', value: maintenanceActive.length, unit: '건', warn: maintenanceActive.length > 0 },
    { label: '폐기 대기', value: pendingDisposals.length, unit: '건', warn: pendingDisposals.length > 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {cards.map((c, i) => (
          <div key={i} className="jamul-card p-4">
            <p className="text-xs mb-1" style={{ color: 'var(--ink-soft)' }}>{c.label}</p>
            <p className="jamul-mono text-2xl font-bold" style={{ color: c.warn ? 'var(--warning)' : 'var(--ink)' }}>
              {fmtNum(c.value)}<span className="text-xs font-normal ml-1">{c.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="jamul-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
              <AlertTriangle size={14} color="var(--danger)" />재고 부족 경고
            </h3>
            <button onClick={() => setActiveTab('inventory')} className="text-xs" style={{ color: 'var(--accent)' }}>전체 보기 →</button>
          </div>
          {deficitItems.length === 0 ? (
            <p className="text-xs py-6 text-center" style={{ color: 'var(--ink-soft)' }}>과부족 없이 정상 관리되고 있습니다.</p>
          ) : (
            <div className="space-y-1.5">
              {deficitItems.slice(0, 6).map((it) => (
                <div key={it.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <span style={{ color: 'var(--ink)' }}>
                    {it.name}{it.size && <span className="text-xs ml-1" style={{ color: 'var(--ink-soft)' }}>({it.size})</span>}
                  </span>
                  <DiffBadge value={calc.diff(it)} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="jamul-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
              <ClipboardList size={14} />최근 이동 로그
            </h3>
            <button onClick={() => setActiveTab('log')} className="text-xs" style={{ color: 'var(--accent)' }}>전체 보기 →</button>
          </div>
          {recentLog.length === 0 ? (
            <p className="text-xs py-6 text-center" style={{ color: 'var(--ink-soft)' }}>아직 기록된 이동 내역이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {recentLog.map((l) => (
                <div key={l.id} className="flex items-center justify-between text-xs py-1.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <span className="font-medium" style={{ color: 'var(--ink)' }}>{TYPE_LABEL[l.type] || l.type}</span>
                    <span className="ml-2" style={{ color: 'var(--ink-soft)' }}>{l.itemName}</span>
                  </div>
                  <span className="jamul-mono" style={{ color: 'var(--ink-soft)' }}>{fmtDate(l.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
 * 재고 현황
 * ------------------------------------------------------------- */
function TransferModal({ itemId, state, calc, actions, onClose }) {
  const item = calc.item(itemId);
  const sources = warehousesWithStock(state, itemId);
  const [fromWh, setFromWh] = useState(sources[0]?.warehouseId || '');
  const [toWh, setToWh] = useState('');
  const [qty, setQty] = useState('');
  const avail = calc.stockAt(itemId, fromWh);

  const submit = async () => {
    const ok = await actions.transferStock({ itemId, fromWarehouseId: fromWh, toWarehouseId: toWh, qty });
    if (ok) onClose();
  };

  return (
    <Modal title={`창고간 이동 · ${item?.name || ''}`} onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>출발 창고</label>
          <select value={fromWh} onChange={(e) => setFromWh(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">선택</option>
            {sources.map((s) => <option key={s.warehouseId} value={s.warehouseId}>{calc.whName(s.warehouseId)} (보유 {fmtNum(s.qty)})</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>도착 창고</label>
          <select value={toWh} onChange={(e) => setToWh(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">선택</option>
            {state.warehouses.filter((w) => w.id !== fromWh).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>수량 (최대 {fmtNum(avail)})</label>
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
        </div>
        <button onClick={submit} className="jamul-btn-primary w-full rounded-lg py-2.5 text-sm font-medium mt-2">이동 처리</button>
      </div>
    </Modal>
  );
}

function InventoryView({ state, calc, actions }) {
  const [view, setView] = useState('item');
  const [search, setSearch] = useState('');
  const [expandedItem, setExpandedItem] = useState(null);
  const [expandedWh, setExpandedWh] = useState(null);
  const [transferItem, setTransferItem] = useState(null);

  const filteredItems = state.items.filter((it) => it.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border p-0.5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <button onClick={() => setView('item')} className="px-3 py-1.5 rounded-md text-sm" style={{ background: view === 'item' ? 'var(--accent)' : 'transparent', color: view === 'item' ? '#fff' : 'var(--ink-soft)' }}>품목별</button>
          <button onClick={() => setView('warehouse')} className="px-3 py-1.5 rounded-md text-sm" style={{ background: view === 'warehouse' ? 'var(--accent)' : 'transparent', color: view === 'warehouse' ? '#fff' : 'var(--ink-soft)' }}>창고별</button>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="품목명 검색" className="pl-8 pr-3 py-2 rounded-lg border text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
        </div>
      </div>

      {view === 'item' ? (
        <div className="jamul-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>
                <th className="px-4 py-3 font-medium"></th>
                <th className="px-4 py-3 font-medium">품목명</th>
                <th className="px-4 py-3 font-medium">계절</th>
                <th className="px-4 py-3 font-medium">상/하의</th>
                <th className="px-4 py-3 font-medium">사이즈</th>
                <th className="px-4 py-3 font-medium">단위</th>
                <th className="px-4 py-3 font-medium text-right">재산수량</th>
                <th className="px-4 py-3 font-medium text-right">보유수량</th>
                <th className="px-4 py-3 font-medium text-right">불출수량</th>
                <th className="px-4 py-3 font-medium text-right">폐기대기</th>
                <th className="px-4 py-3 font-medium text-right">과부족수량</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 && (
                <tr><td colSpan={11} className="px-4 py-8 text-center text-xs" style={{ color: 'var(--ink-soft)' }}>등록된 품목이 없습니다.</td></tr>
              )}
              {filteredItems.map((it) => {
                const stockSum = calc.totalStock(it.id);
                const heldSum = calc.totalHeld(it.id);
                const pendingSum = calc.pendingDisposal(it.id);
                const diff = calc.diff(it);
                const isOpen = expandedItem === it.id;
                const rowsAtWh = state.stock.filter((s) => s.itemId === it.id && s.qty > 0);
                const holdersOfItem = state.holdings.filter((h) => h.itemId === it.id && h.qty > 0);
                return (
                  <React.Fragment key={it.id}>
                    <tr
                      className={`jamul-ledger-row cursor-pointer border-b last:border-0 ${diff < 0 ? 'status-deficit' : diff > 0 ? 'status-surplus' : ''}`}
                      style={{ borderColor: 'var(--border)' }}
                      onClick={() => setExpandedItem(isOpen ? null : it.id)}
                    >
                      <td className="px-4 py-3">{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink)' }}>{it.name}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{it.season || '-'}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{it.part || '-'}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{it.size || '-'}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{it.unit || '-'}</td>
                      <td className="px-4 py-3 text-right jamul-mono">{fmtNum(it.propertyQty)}</td>
                      <td className="px-4 py-3 text-right jamul-mono">{fmtNum(stockSum)}</td>
                      <td className="px-4 py-3 text-right jamul-mono">{fmtNum(heldSum)}</td>
                      <td className="px-4 py-3 text-right jamul-mono" style={{ color: pendingSum > 0 ? 'var(--warning)' : 'var(--ink-soft)' }}>{fmtNum(pendingSum)}</td>
                      <td className="px-4 py-3 text-right"><DiffBadge value={diff} /></td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={11} className="px-4 pb-4 pt-0" style={{ background: '#FAFBFC' }}>
                          <div className="pl-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs font-medium mb-2" style={{ color: 'var(--ink-soft)' }}>창고별 보유 현황</p>
                              {rowsAtWh.length === 0 ? (
                                <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>보관 중인 창고가 없습니다.</p>
                              ) : (
                                <div className="space-y-1.5">
                                  {rowsAtWh.map((s) => (
                                    <div key={s.id} className="flex items-center justify-between text-xs py-1">
                                      <div>
                                        <span style={{ color: 'var(--ink)' }}>{calc.whName(s.warehouseId)}</span>
                                        <p style={{ color: 'var(--ink-soft)' }}>{calc.boxLabel(s.warehouseId, s.boxId)}</p>
                                      </div>
                                      <span className="jamul-mono" style={{ color: 'var(--ink-soft)' }}>{fmtNum(s.qty)}{it.unit}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); setTransferItem(it.id); }}
                                className="mt-3 text-xs px-3 py-1.5 rounded-lg border inline-flex items-center gap-1"
                                style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
                              >
                                <ArrowLeftRight size={12} />창고간 이동
                              </button>
                            </div>
                            <div>
                              <p className="text-xs font-medium mb-2" style={{ color: 'var(--ink-soft)' }}>불출 인원 현황 (보유중)</p>
                              {holdersOfItem.length === 0 ? (
                                <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>현재 불출되어 보유중인 인원이 없습니다.</p>
                              ) : (
                                <div className="space-y-1.5">
                                  {holdersOfItem.map((h) => {
                                    const p = state.persons.find((x) => x.id === h.personId);
                                    return (
                                      <div key={h.id} className="flex items-center justify-between text-xs py-1">
                                        <span style={{ color: 'var(--ink)' }}>{p ? `${p.dept} · ${p.name}` : '(삭제된 인원)'}</span>
                                        <span className="jamul-mono" style={{ color: 'var(--ink-soft)' }}>{fmtNum(h.qty)}{it.unit}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-3">
          {state.warehouses.length === 0 && (
            <div className="jamul-card p-8 text-center text-xs" style={{ color: 'var(--ink-soft)' }}>등록된 창고가 없습니다. 창고 관리에서 먼저 등록해주세요.</div>
          )}
          {state.warehouses.map((wh) => {
            const isOpen = expandedWh === wh.id;
            const rows = state.stock.filter((s) => s.warehouseId === wh.id && s.qty > 0 && calc.itemName(s.itemId).toLowerCase().includes(search.toLowerCase()));
            const sum = state.stock.filter((s) => s.warehouseId === wh.id).reduce((a, b) => a + b.qty, 0);
            return (
              <div key={wh.id} className="jamul-card overflow-hidden">
                <button onClick={() => setExpandedWh(isOpen ? null : wh.id)} className="w-full flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{wh.name}</span>
                    {wh.location && <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>{wh.location}</span>}
                  </div>
                  <span className="jamul-mono text-xs" style={{ color: 'var(--ink-soft)' }}>총 {fmtNum(sum)}개 보관중</span>
                </button>
                {isOpen && (
                  <div className="border-t px-4 py-3" style={{ borderColor: 'var(--border)' }}>
                    {rows.length === 0 ? (
                      <p className="text-xs py-3" style={{ color: 'var(--ink-soft)' }}>보관중인 품목이 없습니다.</p>
                    ) : (
                      <div className="overflow-x-auto jamul-scrollbar">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left" style={{ color: 'var(--ink-soft)' }}>
                            <th className="py-2 font-medium">품목명</th>
                            <th className="py-2 font-medium">계절</th>
                            <th className="py-2 font-medium">상/하의</th>
                            <th className="py-2 font-medium">사이즈</th>
                            <th className="py-2 font-medium">위치</th>
                            <th className="py-2 font-medium text-right">이 창고 보유수량</th>
                            <th className="py-2 font-medium text-right">전체 재산수량</th>
                            <th className="py-2 font-medium text-right">전체 과부족</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((s) => {
                            const it = calc.item(s.itemId);
                            if (!it) return null;
                            return (
                              <tr key={s.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                                <td className="py-2" style={{ color: 'var(--ink)' }}>{it.name}</td>
                                <td className="py-2" style={{ color: 'var(--ink-soft)' }}>{it.season || '-'}</td>
                                <td className="py-2" style={{ color: 'var(--ink-soft)' }}>{it.part || '-'}</td>
                                <td className="py-2" style={{ color: 'var(--ink-soft)' }}>{it.size || '-'}</td>
                                <td className="py-2" style={{ color: 'var(--ink-soft)' }}>{calc.boxLabel(s.warehouseId, s.boxId)}</td>
                                <td className="py-2 text-right jamul-mono">{fmtNum(s.qty)}</td>
                                <td className="py-2 text-right jamul-mono">{fmtNum(it.propertyQty)}</td>
                                <td className="py-2 text-right"><DiffBadge value={calc.diff(it)} /></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {transferItem && (
        <TransferModal itemId={transferItem} state={state} calc={calc} actions={actions} onClose={() => setTransferItem(null)} />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
 * 창고 관리
 * ------------------------------------------------------------- */
function WarehouseIssueModal({ itemId, warehouseId, state, calc, actions, onClose }) {
  const item = calc.item(itemId);
  const [personId, setPersonId] = useState('');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(todayStr());
  const avail = calc.stockAt(itemId, warehouseId);

  const submit = async () => {
    const ok = await actions.issueItem({ personId, itemId, warehouseId, qty, reason, date });
    if (ok) onClose();
  };

  return (
    <Modal title={`불출 · ${item?.name || ''}${itemTag(item)} (${calc.whName(warehouseId)})`} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>현재 보유수량 {fmtNum(avail)}{item?.unit}</p>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>인원</label>
          <select value={personId} onChange={(e) => setPersonId(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">선택</option>
            {state.persons.map((p) => <option key={p.id} value={p.id}>{p.dept} · {p.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>수량 (최대 {fmtNum(avail)})</label>
            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>불출일</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>사유</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="예: 임무 수행용" className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
        </div>
        <button onClick={submit} className="jamul-btn-primary w-full rounded-lg py-2.5 text-sm font-medium mt-2">불출 처리</button>
      </div>
    </Modal>
  );
}

function WarehouseMapModal({ warehouseId, state, calc, actions, setConfirmState, onClose }) {
  const wh = state.warehouses.find((w) => w.id === warehouseId);
  const [shelfName, setShelfName] = useState('');
  const [rows, setRows] = useState('');
  const [cols, setCols] = useState('');

  if (!wh) return null;
  const shelves = wh.shelves || [];

  const submit = async () => {
    await actions.addShelf(warehouseId, shelfName, rows, cols);
    setShelfName(''); setRows(''); setCols('');
  };

  return (
    <Modal title={`약도 관리 · ${wh.name}`} onClose={onClose} wide>
      <div className="space-y-4">
        <div className="jamul-card p-3">
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--ink-soft)' }}>새 선반 추가</p>
          <div className="flex flex-wrap gap-2">
            <input value={shelfName} onChange={(e) => setShelfName(e.target.value)} placeholder="선반 이름 (선택, 예: A선반)" className="flex-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
            <input type="number" value={rows} onChange={(e) => setRows(e.target.value)} placeholder="줄 수" className="w-24 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
            <input type="number" value={cols} onChange={(e) => setCols(e.target.value)} placeholder="칸 수" className="w-24 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
            <button onClick={submit} className="jamul-btn-primary rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-1"><Plus size={14} />추가</button>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--ink-soft)' }}>줄 수 × 칸 수 만큼 박스가 자동으로 생성됩니다. 선반은 여러 개 추가할 수 있습니다.</p>
        </div>

        {shelves.length === 0 ? (
          <p className="text-xs py-6 text-center" style={{ color: 'var(--ink-soft)' }}>등록된 선반이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {shelves.map((shelf) => {
              const boxes = Array.from({ length: shelf.rows * shelf.cols }, (_, i) => i + 1);
              return (
                <div key={shelf.id} className="jamul-card p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                      {shelf.name} <span className="text-xs font-normal" style={{ color: 'var(--ink-soft)' }}>({shelf.rows}줄 × {shelf.cols}칸)</span>
                    </p>
                    <button
                      onClick={() => setConfirmState({
                        message: `'${shelf.name}' 선반을 삭제하시겠습니까?`,
                        detail: '보관중인 품목이 있으면 삭제할 수 없습니다.',
                        onConfirm: () => actions.deleteShelf(warehouseId, shelf.id),
                      })}
                      className="p-1.5 rounded-md hover:bg-gray-100"
                    >
                      <Trash2 size={13} color="var(--danger)" />
                    </button>
                  </div>
                  <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${shelf.cols}, minmax(0,1fr))` }}>
                    {boxes.map((n) => {
                      const boxId = `${shelf.id}#${n}`;
                      const occupants = state.stock.filter((s) => s.boxId === boxId && s.qty > 0);
                      const occupied = occupants.length > 0;
                      return (
                        <div
                          key={n}
                          title={occupied ? occupants.map((o) => `${calc.itemName(o.itemId)} (${fmtNum(o.qty)})`).join(', ') : `${n}번 박스 (비어있음)`}
                          className="rounded-md border text-xs flex items-center justify-center text-center p-1.5"
                          style={{
                            borderColor: occupied ? 'var(--accent)' : 'var(--border)',
                            background: occupied ? 'var(--success-bg)' : 'var(--surface)',
                            color: occupied ? 'var(--success)' : 'var(--ink-soft)',
                            minHeight: '2.5rem',
                          }}
                        >
                          {occupied ? occupants.map((o) => calc.itemName(o.itemId)).join(', ') : n}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

function WarehousesView({ state, calc, actions, setConfirmState }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editLoc, setEditLoc] = useState('');
  const [expandedWh, setExpandedWh] = useState(null);
  const [editingStock, setEditingStock] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [issueTarget, setIssueTarget] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationDraft, setLocationDraft] = useState('');
  const [mapWarehouseId, setMapWarehouseId] = useState(null);
  const [splitTarget, setSplitTarget] = useState(null);
  const [splitBoxId, setSplitBoxId] = useState('');
  const [splitQty, setSplitQty] = useState('');
  const [expandedItemGroup, setExpandedItemGroup] = useState(null);

  const submit = () => { actions.addWarehouse(name, location); setName(''); setLocation(''); };
  const startEdit = (w) => { setEditingId(w.id); setEditName(w.name); setEditLoc(w.location || ''); };
  const saveEdit = () => { actions.updateWarehouse(editingId, { name: editName.trim(), location: editLoc.trim() }); setEditingId(null); };

  const startEditLocation = (s) => { setEditingLocation(s.id); setLocationDraft(s.boxId || ''); };
  const saveEditLocation = async () => {
    await actions.setStockLocation(editingLocation, locationDraft);
    setEditingLocation(null);
  };

  const startEditStock = (s) => { setEditingStock(s.id); setEditQty(String(s.qty)); };
  const saveEditStock = async () => {
    await actions.adjustStock(editingStock, editQty);
    setEditingStock(null);
  };

  const startSplit = (s) => { setSplitTarget(s.id); setSplitBoxId(''); setSplitQty(''); };
  const doSplit = async () => {
    const ok = await actions.splitStock(splitTarget, splitBoxId, splitQty);
    if (ok) setSplitTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="jamul-card p-4">
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--ink)' }}>새 창고 등록</h3>
        <div className="flex flex-wrap gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="창고명" className="flex-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="위치 (선택)" className="flex-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          <button onClick={submit} className="jamul-btn-primary rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-1"><Plus size={14} />등록</button>
        </div>
      </div>

      <div className="jamul-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>
              <th className="px-4 py-3 font-medium"></th>
              <th className="px-4 py-3 font-medium">창고명</th>
              <th className="px-4 py-3 font-medium">위치</th>
              <th className="px-4 py-3 font-medium text-right">보관 수량</th>
              <th className="px-4 py-3 font-medium text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {state.warehouses.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-xs" style={{ color: 'var(--ink-soft)' }}>등록된 창고가 없습니다.</td></tr>
            )}
            {state.warehouses.map((w) => {
              const isOpen = expandedWh === w.id;
              const items = state.stock.filter((s) => s.warehouseId === w.id && s.qty > 0);
              const itemGroups = [];
              const groupIndex = {};
              items.forEach((s) => {
                const it = calc.item(s.itemId);
                if (!it) return;
                if (!groupIndex[it.name]) {
                  groupIndex[it.name] = { name: it.name, itemIds: new Set(), rows: [] };
                  itemGroups.push(groupIndex[it.name]);
                }
                groupIndex[it.name].itemIds.add(s.itemId);
                groupIndex[it.name].rows.push(s);
              });
              return (
                <React.Fragment key={w.id}>
                  <tr className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    {editingId === w.id ? (
                      <>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2"><input value={editName} onChange={(e) => setEditName(e.target.value)} className="border rounded-md px-2 py-1 text-sm w-full" style={{ borderColor: 'var(--border)' }} /></td>
                        <td className="px-4 py-2"><input value={editLoc} onChange={(e) => setEditLoc(e.target.value)} className="border rounded-md px-2 py-1 text-sm w-full" style={{ borderColor: 'var(--border)' }} /></td>
                        <td className="px-4 py-2 text-right jamul-mono">{fmtNum(calc.whStockSum(w.id))}</td>
                        <td className="px-4 py-2 text-right">
                          <button onClick={saveEdit} className="text-xs px-2 py-1 rounded-md mr-1" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>저장</button>
                          <button onClick={() => setEditingId(null)} className="text-xs px-2 py-1 rounded-md" style={{ color: 'var(--ink-soft)' }}>취소</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 cursor-pointer" onClick={() => setExpandedWh(isOpen ? null : w.id)}>
                          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </td>
                        <td className="px-4 py-3 font-medium cursor-pointer" style={{ color: 'var(--ink)' }} onClick={() => setExpandedWh(isOpen ? null : w.id)}>{w.name}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{w.location || '-'}</td>
                        <td className="px-4 py-3 text-right jamul-mono">{fmtNum(calc.whStockSum(w.id))}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setMapWarehouseId(w.id)}
                            className="p-1.5 rounded-md hover:bg-gray-100 mr-1"
                            title="약도 관리"
                          >
                            <LayoutGrid size={13} style={{ color: 'var(--accent)' }} />
                          </button>
                          <button onClick={() => startEdit(w)} className="p-1.5 rounded-md hover:bg-gray-100 mr-1"><Pencil size={13} /></button>
                          <button
                            onClick={() => setConfirmState({
                              message: `'${w.name}' 창고를 삭제하시겠습니까?`,
                              detail: '보관중인 품목이 있으면 삭제할 수 없습니다.',
                              onConfirm: () => actions.deleteWarehouse(w.id),
                            })}
                            className="p-1.5 rounded-md hover:bg-gray-100"
                          >
                            <Trash2 size={13} color="var(--danger)" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={5} className="px-4 pb-4 pt-0" style={{ background: '#FAFBFC' }}>
                        <div className="pl-8 pt-2">
                          <p className="text-xs font-medium mb-2" style={{ color: 'var(--ink-soft)' }}>보관중인 품목</p>
                          {items.length === 0 ? (
                            <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>보관중인 품목이 없습니다.</p>
                          ) : (
                            <div className="space-y-1.5">
                              {itemGroups.map((grp) => {
                                const multi = grp.itemIds.size > 1;
                                const groupKey = `${w.id}:${grp.name}`;
                                const isGroupOpen = expandedItemGroup === groupKey;
                                const rowsToShow = multi ? (isGroupOpen ? grp.rows : []) : grp.rows;
                                return (
                                  <div key={grp.name}>
                                    {multi && (
                                      <button
                                        onClick={() => setExpandedItemGroup(isGroupOpen ? null : groupKey)}
                                        className="w-full flex items-center justify-between py-1.5"
                                      >
                                        <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--ink)' }}>
                                          {isGroupOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                                          {grp.name}
                                          <span className="text-xs font-normal" style={{ color: 'var(--ink-soft)' }}>({grp.itemIds.size}종 사이즈)</span>
                                        </span>
                                        <span className="jamul-mono text-xs" style={{ color: 'var(--ink-soft)' }}>
                                          {fmtNum(grp.rows.reduce((a, b) => a + b.qty, 0))}
                                        </span>
                                      </button>
                                    )}
                              {rowsToShow.map((s) => {
                                const it = calc.item(s.itemId);
                                if (!it) return null;
                                const isEditingThis = editingStock === s.id;
                                const isEditingLocThis = editingLocation === s.id;
                                const isSplitting = splitTarget === s.id;
                                return (
                                  <div key={s.id} className="py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                      <span className="text-sm" style={{ color: 'var(--ink)' }}>{it.name}{itemTag(it)}</span>
                                      {isEditingThis ? (
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="number" value={editQty} onChange={(e) => setEditQty(e.target.value)}
                                            className="w-20 border rounded-md px-2 py-1 text-sm text-right jamul-mono"
                                            style={{ borderColor: 'var(--border)' }} autoFocus
                                          />
                                          <button onClick={saveEditStock} className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>저장</button>
                                          <button onClick={() => setEditingStock(null)} className="text-xs px-2 py-1 rounded-md" style={{ color: 'var(--ink-soft)' }}>취소</button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="jamul-mono" style={{ color: 'var(--ink-soft)' }}>{fmtNum(s.qty)}{it.unit}</span>
                                          <button
                                            onClick={() => startEditStock(s)}
                                            className="text-xs px-2 py-1 rounded-md border inline-flex items-center gap-1"
                                            style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
                                          >
                                            <Pencil size={11} />수정
                                          </button>
                                          <button
                                            onClick={() => setIssueTarget({ itemId: s.itemId, warehouseId: s.warehouseId })}
                                            className="text-xs px-2 py-1 rounded-md border inline-flex items-center gap-1"
                                            style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
                                          >
                                            <ArrowLeftRight size={11} />불출
                                          </button>
                                          {s.qty > 1 && (
                                            <button
                                              onClick={() => startSplit(s)}
                                              className="text-xs px-2 py-1 rounded-md border inline-flex items-center gap-1"
                                              style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
                                            >
                                              <Scissors size={11} />분할
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-1 flex-wrap">
                                      {isEditingLocThis ? (
                                        <>
                                          <div className="flex-1">
                                            <LocationSelect warehouseId={w.id} state={state} value={locationDraft} onChange={setLocationDraft} />
                                          </div>
                                          <button onClick={saveEditLocation} className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>저장</button>
                                          <button onClick={() => setEditingLocation(null)} className="text-xs px-2 py-1 rounded-md" style={{ color: 'var(--ink-soft)' }}>취소</button>
                                        </>
                                      ) : (
                                        <>
                                          <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>위치: {calc.boxLabel(w.id, s.boxId)}</span>
                                          <button
                                            onClick={() => startEditLocation(s)}
                                            className="text-xs px-2 py-1 rounded-md border inline-flex items-center gap-1"
                                            style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
                                          >
                                            <LayoutGrid size={11} />위치 수정
                                          </button>
                                        </>
                                      )}
                                    </div>
                                    {isSplitting && (
                                      <div className="mt-2 p-2 rounded-lg border space-y-2" style={{ borderColor: 'var(--border)', background: '#FAFBFC' }}>
                                        <p className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>
                                          위치 분할 · 현재 {fmtNum(s.qty)}{it.unit} 중 일부를 다른 위치로 나눠 보관
                                        </p>
                                        <LocationSelect warehouseId={w.id} state={state} value={splitBoxId} onChange={setSplitBoxId} excludeBoxId={s.boxId} />
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="number" min={1} max={s.qty - 1} value={splitQty} onChange={(e) => setSplitQty(e.target.value)}
                                            placeholder={`분할 수량 (최대 ${s.qty - 1})`}
                                            className="flex-1 border rounded-md px-2 py-1.5 text-sm jamul-focus"
                                            style={{ borderColor: 'var(--border)' }}
                                          />
                                          <button onClick={doSplit} className="jamul-btn-primary text-xs px-3 py-1.5 rounded-md whitespace-nowrap">분할 확인</button>
                                          <button onClick={() => setSplitTarget(null)} className="text-xs px-2 py-1.5 rounded-md" style={{ color: 'var(--ink-soft)' }}>취소</button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {issueTarget && (
        <WarehouseIssueModal
          itemId={issueTarget.itemId}
          warehouseId={issueTarget.warehouseId}
          state={state}
          calc={calc}
          actions={actions}
          onClose={() => setIssueTarget(null)}
        />
      )}

      {mapWarehouseId && (
        <WarehouseMapModal
          warehouseId={mapWarehouseId}
          state={state}
          calc={calc}
          actions={actions}
          setConfirmState={setConfirmState}
          onClose={() => setMapWarehouseId(null)}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
 * 반납 처리 공용 패널 (불출현황 / 인원삭제 에서 재사용)
 * ------------------------------------------------------------- */
function HoldingsReturnPanel({ holdings, calc, warehouses, onSubmit, submitLabel }) {
  const [checked, setChecked] = useState(() => {
    const m = {}; holdings.forEach((h) => { m[h.id] = true; }); return m;
  });
  const [qtyMap, setQtyMap] = useState(() => {
    const m = {}; holdings.forEach((h) => { m[h.id] = h.qty; }); return m;
  });
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || '');

  if (holdings.length === 0) {
    return <p className="text-xs py-3" style={{ color: 'var(--ink-soft)' }}>현재 보유중인 품목이 없습니다.</p>;
  }

  const submit = () => {
    if (!warehouseId) return;
    const rows = holdings
      .filter((h) => checked[h.id])
      .map((h) => ({ holdingId: h.id, itemId: h.itemId, personId: h.personId, qty: Math.min(Number(qtyMap[h.id]) || 0, h.qty), warehouseId }))
      .filter((r) => r.qty > 0);
    onSubmit(rows);
  };

  return (
    <div>
      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto jamul-scrollbar">
        {holdings.map((h) => {
          const it = calc.item(h.itemId);
          return (
            <div key={h.id} className="flex items-center gap-2 p-2 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
              <input type="checkbox" checked={!!checked[h.id]} onChange={(e) => setChecked({ ...checked, [h.id]: e.target.checked })} />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: 'var(--ink)' }}>{it?.name || '(삭제된 품목)'}{itemTag(it)}</p>
                <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>보유수량 {fmtNum(h.qty)}{it?.unit}</p>
              </div>
              <input
                type="number" min={1} max={h.qty}
                value={qtyMap[h.id]}
                onChange={(e) => setQtyMap({ ...qtyMap, [h.id]: e.target.value })}
                className="w-20 border rounded-md px-2 py-1 text-sm text-right jamul-mono"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
          <option value="">반납할 창고 선택</option>
          {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <button onClick={submit} className="jamul-btn-primary rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap">{submitLabel}</button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
 * 불출 현황
 * ------------------------------------------------------------- */
function IssueModal({ state, calc, actions, onClose }) {
  const [personId, setPersonId] = useState('');
  const [itemId, setItemId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(todayStr());

  const warehouseOptions = itemId ? warehousesWithStock(state, itemId) : [];
  const avail = itemId && warehouseId ? calc.stockAt(itemId, warehouseId) : 0;

  const submit = async () => {
    const ok = await actions.issueItem({ personId, itemId, warehouseId, qty, reason, date });
    if (ok) onClose();
  };

  return (
    <Modal title="새 불출 등록" onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>인원</label>
          <select value={personId} onChange={(e) => setPersonId(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">선택</option>
            {state.persons.map((p) => <option key={p.id} value={p.id}>{p.dept} · {p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>품목</label>
          <select value={itemId} onChange={(e) => { setItemId(e.target.value); setWarehouseId(''); }} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">선택</option>
            {state.items.map((it) => <option key={it.id} value={it.id}>{it.name}{itemTag(it)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>불출할 창고</label>
          <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">선택</option>
            {warehouseOptions.map((s) => <option key={s.warehouseId} value={s.warehouseId}>{calc.whName(s.warehouseId)} (보유 {fmtNum(s.qty)})</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>수량 {warehouseId && `(최대 ${fmtNum(avail)})`}</label>
            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>불출일</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>사유</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="예: 임무 수행용" className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
        </div>
        <button onClick={submit} className="jamul-btn-primary w-full rounded-lg py-2.5 text-sm font-medium mt-2">불출 등록</button>
      </div>
    </Modal>
  );
}

function NewPropertyIssueModal({ state, calc, actions, onClose }) {
  const [personId, setPersonId] = useState('');
  const [itemId, setItemId] = useState('');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(todayStr());

  const submit = async () => {
    const ok = await actions.issueNewProperty({ personId, itemId, qty, reason, date });
    if (ok) onClose();
  };

  return (
    <Modal title="재고 추가 불출 등록" onClose={onClose}>
      <div className="space-y-3">
        <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
          창고 재고를 거치지 않고, 품목의 재산수량을 함께 늘리면서 바로 인원에게 불출합니다. (예: 신규 지급품을 창고 입고 없이 바로 지급하는 경우)
        </p>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>인원</label>
          <select value={personId} onChange={(e) => setPersonId(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">선택</option>
            {state.persons.map((p) => <option key={p.id} value={p.id}>{p.dept} · {p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>품목</label>
          <select value={itemId} onChange={(e) => setItemId(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">선택</option>
            {state.items.map((it) => <option key={it.id} value={it.id}>{it.name}{itemTag(it)}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>수량</label>
            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>불출일</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>사유</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="예: 신규 지급" className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
        </div>
        <button onClick={submit} className="jamul-btn-primary w-full rounded-lg py-2.5 text-sm font-medium mt-2">등록</button>
      </div>
    </Modal>
  );
}

function IssuanceView({ state, calc, actions, showToast }) {
  const [search, setSearch] = useState('');
  const [openDept, setOpenDept] = useState(null);
  const [openPerson, setOpenPerson] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showNewPropIssueModal, setShowNewPropIssueModal] = useState(false);

  const deptMap = {};
  state.persons.forEach((p) => { (deptMap[p.dept] = deptMap[p.dept] || []).push(p); });
  const depts = Object.keys(deptMap).filter((d) =>
    d.toLowerCase().includes(search.toLowerCase()) || deptMap[d].some((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="소속 또는 이름 검색" className="pl-8 pr-3 py-2 rounded-lg border text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowIssueModal(true)} className="jamul-btn-primary rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-1"><Plus size={14} />새 불출 등록</button>
          <button
            onClick={() => setShowNewPropIssueModal(true)}
            className="rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-1 border"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            <Plus size={14} />재고 추가 불출 등록
          </button>
        </div>
      </div>

      {state.persons.length === 0 && (
        <div className="jamul-card p-8 text-center text-xs" style={{ color: 'var(--ink-soft)' }}>등록된 인원이 없습니다. 인원 관리에서 먼저 등록해주세요.</div>
      )}

      <div className="space-y-2">
        {depts.map((dept) => {
          const people = deptMap[dept];
          const deptOpen = openDept === dept;
          const deptTotal = people.reduce((sum, p) => sum + state.holdings.filter((h) => h.personId === p.id).reduce((a, b) => a + b.qty, 0), 0);
          return (
            <div key={dept} className="jamul-card overflow-hidden">
              <button onClick={() => setOpenDept(deptOpen ? null : dept)} className="w-full flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  {deptOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{dept}</span>
                  <span className="text-xs" style={{ color: 'var(--ink-soft)' }}>{people.length}명</span>
                </div>
                <span className="jamul-mono text-xs" style={{ color: 'var(--ink-soft)' }}>보유 {fmtNum(deptTotal)}개</span>
              </button>
              {deptOpen && (
                <div className="border-t divide-y" style={{ borderColor: 'var(--border)' }}>
                  {people.map((p) => {
                    const holdings = state.holdings.filter((h) => h.personId === p.id && h.qty > 0);
                    const personOpen = openPerson === p.id;
                    const personTotal = holdings.reduce((a, b) => a + b.qty, 0);
                    return (
                      <div key={p.id}>
                        <button onClick={() => setOpenPerson(personOpen ? null : p.id)} className="w-full flex items-center justify-between px-4 py-2.5 pl-10">
                          <span className="text-sm" style={{ color: 'var(--ink)' }}>{p.name}</span>
                          <span className="jamul-mono text-xs" style={{ color: 'var(--ink-soft)' }}>{holdings.length}종 · {fmtNum(personTotal)}개</span>
                        </button>
                        {personOpen && (
                          <div className="px-4 pl-10 pb-4">
                            <HoldingsReturnPanel
                              holdings={holdings}
                              calc={calc}
                              warehouses={state.warehouses}
                              submitLabel="반납 완료"
                              onSubmit={async (rows) => {
                                if (rows.length === 0) { showToast('반납할 품목을 선택해주세요.', 'danger'); return; }
                                const rowsWithNames = rows.map((r) => ({ ...r, personName: p.name }));
                                await actions.returnHoldings(rowsWithNames);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showIssueModal && <IssueModal state={state} calc={calc} actions={actions} onClose={() => setShowIssueModal(false)} />}
      {showNewPropIssueModal && <NewPropertyIssueModal state={state} calc={calc} actions={actions} onClose={() => setShowNewPropIssueModal(false)} />}
    </div>
  );
}

/* ---------------------------------------------------------------
 * 인원 관리
 * ------------------------------------------------------------- */
function PersonsView({ state, calc, actions, showToast, setConfirmState }) {
  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const submit = () => { actions.addPerson(name, dept); setName(''); setDept(''); };
  const holdingsOf = (personId) => state.holdings.filter((h) => h.personId === personId && h.qty > 0);

  const requestDelete = (p) => {
    const holdings = holdingsOf(p.id);
    if (holdings.length === 0) {
      setConfirmState({ message: `'${p.name}'님을 삭제하시겠습니까?`, onConfirm: () => actions.deletePerson(p.id) });
    } else {
      setDeleteTarget(p);
    }
  };

  return (
    <div className="space-y-4">
      <div className="jamul-card p-4">
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--ink)' }}>새 인원 등록</h3>
        <div className="flex flex-wrap gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" className="flex-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          <input value={dept} onChange={(e) => setDept(e.target.value)} placeholder="소속" className="flex-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          <button onClick={submit} className="jamul-btn-primary rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-1"><UserPlus size={14} />등록</button>
        </div>
      </div>

      <div className="jamul-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>
              <th className="px-4 py-3 font-medium">이름</th>
              <th className="px-4 py-3 font-medium">소속</th>
              <th className="px-4 py-3 font-medium text-right">보유 품목</th>
              <th className="px-4 py-3 font-medium text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {state.persons.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-xs" style={{ color: 'var(--ink-soft)' }}>등록된 인원이 없습니다.</td></tr>
            )}
            {state.persons.map((p) => {
              const holdings = holdingsOf(p.id);
              const total = holdings.reduce((a, b) => a + b.qty, 0);
              return (
                <tr key={p.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink)' }}>{p.name}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{p.dept}</td>
                  <td className="px-4 py-3 text-right jamul-mono">{holdings.length}종 · {fmtNum(total)}개</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => requestDelete(p)} className="p-1.5 rounded-md hover:bg-gray-100"><Trash2 size={13} color="var(--danger)" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <Modal title={`${deleteTarget.name}님 삭제 - 보유 품목 반납`} onClose={() => setDeleteTarget(null)}>
          <p className="text-xs mb-3" style={{ color: 'var(--ink-soft)' }}>보유중인 모든 품목을 반납해야 삭제할 수 있습니다.</p>
          <HoldingsReturnPanel
            holdings={holdingsOf(deleteTarget.id)}
            calc={calc}
            warehouses={state.warehouses}
            submitLabel="반납 후 삭제"
            onSubmit={async (rows) => {
              if (rows.length === 0) { showToast('반납할 품목을 선택해주세요.', 'danger'); return; }
              const ok = await actions.returnAndDeletePerson(deleteTarget.id, rows);
              if (ok) setDeleteTarget(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
 * 품목 관리
 * ------------------------------------------------------------- */
function CreateItemModal({ state, actions, onClose }) {
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [unit, setUnit] = useState('');
  const [qty, setQty] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [boxId, setBoxId] = useState('');
  const [season, setSeason] = useState('');
  const [part, setPart] = useState('');

  const submit = async () => {
    await actions.addItem({ name, size, unit, propertyQty: qty, warehouseId, boxId, season, part });
    onClose();
  };

  return (
    <Modal title="새 품목 등록" onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>명칭</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>계절 구분</label>
            <select value={season} onChange={(e) => setSeason(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
              <option value="">미지정</option>
              <option value="동계">동계</option>
              <option value="하계">하계</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>상/하의 구분</label>
            <select value={part} onChange={(e) => setPart(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
              <option value="">미지정</option>
              <option value="상의">상의</option>
              <option value="하의">하의</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>사이즈</label>
            <input value={size} onChange={(e) => setSize(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>단위</label>
            <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="예: 개, box" className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>재산 수량</label>
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
        </div>
        {Number(qty) > 0 && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>보관할 창고</label>
              <select value={warehouseId} onChange={(e) => { setWarehouseId(e.target.value); setBoxId(''); }} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
                <option value="">선택</option>
                {state.warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            {warehouseId && (
              <div>
                <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>보관 위치 (선반 · 박스)</label>
                <div className="mt-1">
                  <LocationSelect warehouseId={warehouseId} state={state} value={boxId} onChange={setBoxId} />
                </div>
              </div>
            )}
          </div>
        )}
        <button onClick={submit} className="jamul-btn-primary w-full rounded-lg py-2.5 text-sm font-medium mt-2">등록</button>
      </div>
    </Modal>
  );
}

function AdjustPropertyModal({ itemId, state, calc, actions, onClose }) {
  const item = calc.item(itemId);
  const [delta, setDelta] = useState('');
  const [warehouseId, setWarehouseId] = useState('');

  const submit = async () => {
    await actions.adjustProperty(itemId, delta, warehouseId);
    onClose();
  };

  return (
    <Modal title={`재산 수정 · ${item?.name || ''}`} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>현재 재산수량: {fmtNum(item?.propertyQty || 0)}{item?.unit}</p>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>변경 수량 (늘리려면 양수, 줄이려면 음수)</label>
          <input type="number" value={delta} onChange={(e) => setDelta(e.target.value)} placeholder="예: 5 (증가) 또는 -3 (감소)" className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
        </div>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>대상 창고</label>
          <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">선택</option>
            {state.warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>양수는 선택한 창고에 입고, 음수는 선택한 창고에서 차감됩니다.</p>
        </div>
        <button onClick={submit} className="jamul-btn-primary w-full rounded-lg py-2.5 text-sm font-medium mt-2">수정</button>
      </div>
    </Modal>
  );
}

function ItemsView({ state, calc, actions, setConfirmState }) {
  const [showCreate, setShowCreate] = useState(false);
  const [adjustPropItem, setAdjustPropItem] = useState(null);
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [partFilter, setPartFilter] = useState('all');
  const [expandedGroup, setExpandedGroup] = useState(null);

  const filteredItems = state.items.filter((it) =>
    (seasonFilter === 'all' || it.season === seasonFilter) &&
    (partFilter === 'all' || it.part === partFilter)
  );

  const groups = [];
  const groupIndex = {};
  filteredItems.forEach((it) => {
    if (!groupIndex[it.name]) {
      groupIndex[it.name] = { name: it.name, items: [] };
      groups.push(groupIndex[it.name]);
    }
    groupIndex[it.name].items.push(it);
  });

  const renderItemRow = (it, indent) => (
    <tr key={it.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <td className={`px-4 py-3 ${indent ? 'pl-10' : 'font-medium'}`} style={{ color: indent ? 'var(--ink-soft)' : 'var(--ink)' }}>{it.name}</td>
      <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{it.season || '-'}</td>
      <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{it.part || '-'}</td>
      <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{it.size || '-'}</td>
      <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{it.unit || '-'}</td>
      <td className="px-4 py-3 text-right jamul-mono">{fmtNum(it.propertyQty)}</td>
      <td className="px-4 py-3 text-right jamul-mono" style={{ color: calc.maintenanceQty(it.id) > 0 ? 'var(--warning)' : 'var(--ink-soft)' }}>{fmtNum(calc.maintenanceQty(it.id))}</td>
      <td className="px-4 py-3 text-right"><DiffBadge value={calc.diff(it)} /></td>
      <td className="px-4 py-3 text-right">
        <button onClick={() => setAdjustPropItem(it.id)} className="text-xs px-2.5 py-1.5 rounded-md border inline-flex items-center gap-1 mr-1" style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}>
          <Pencil size={12} />재산 수정
        </button>
        <button
          onClick={() => setConfirmState({
            message: `'${it.name}' 품목을 삭제하시겠습니까?`,
            detail: '보유/불출 수량이 남아있으면 삭제할 수 없습니다.',
            onConfirm: () => actions.deleteItem(it.id),
          })}
          className="p-1.5 rounded-md hover:bg-gray-100"
        >
          <Trash2 size={13} color="var(--danger)" />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <select value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="all">계절 전체</option>
            <option value="동계">동계</option>
            <option value="하계">하계</option>
          </select>
          <select value={partFilter} onChange={(e) => setPartFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="all">상/하의 전체</option>
            <option value="상의">상의</option>
            <option value="하의">하의</option>
          </select>
        </div>
        <button onClick={() => setShowCreate(true)} className="jamul-btn-primary rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-1"><Plus size={14} />새 품목 등록</button>
      </div>

      <div className="jamul-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>
              <th className="px-4 py-3 font-medium">명칭</th>
              <th className="px-4 py-3 font-medium">계절</th>
              <th className="px-4 py-3 font-medium">상/하의</th>
              <th className="px-4 py-3 font-medium">사이즈</th>
              <th className="px-4 py-3 font-medium">단위</th>
              <th className="px-4 py-3 font-medium text-right">재산수량</th>
              <th className="px-4 py-3 font-medium text-right">정비입고</th>
              <th className="px-4 py-3 font-medium text-right">과부족</th>
              <th className="px-4 py-3 font-medium text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {groups.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-xs" style={{ color: 'var(--ink-soft)' }}>등록된 품목이 없습니다.</td></tr>
            )}
            {groups.map((g) => {
              if (g.items.length === 1) {
                return renderItemRow(g.items[0], false);
              }
              const isOpen = expandedGroup === g.name;
              const totalProperty = g.items.reduce((a, b) => a + b.propertyQty, 0);
              const totalMaint = g.items.reduce((a, b) => a + calc.maintenanceQty(b.id), 0);
              return (
                <React.Fragment key={g.name}>
                  <tr
                    className="cursor-pointer border-b last:border-0"
                    style={{ borderColor: 'var(--border)', background: '#FAFBFC' }}
                    onClick={() => setExpandedGroup(isOpen ? null : g.name)}
                  >
                    <td className="px-4 py-3 font-semibold">
                      <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        {g.name}
                        <span className="text-xs font-normal" style={{ color: 'var(--ink-soft)' }}>({g.items.length}종 사이즈)</span>
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>—</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>—</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>—</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>—</td>
                    <td className="px-4 py-3 text-right jamul-mono font-semibold">{fmtNum(totalProperty)}</td>
                    <td className="px-4 py-3 text-right jamul-mono" style={{ color: totalMaint > 0 ? 'var(--warning)' : 'var(--ink-soft)' }}>{fmtNum(totalMaint)}</td>
                    <td className="px-4 py-3 text-right" style={{ color: 'var(--ink-soft)' }}>—</td>
                    <td className="px-4 py-3 text-right" style={{ color: 'var(--ink-soft)' }}>—</td>
                  </tr>
                  {isOpen && g.items.map((it) => renderItemRow(it, true))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {showCreate && <CreateItemModal state={state} actions={actions} onClose={() => setShowCreate(false)} />}
      {adjustPropItem && <AdjustPropertyModal itemId={adjustPropItem} state={state} calc={calc} actions={actions} onClose={() => setAdjustPropItem(null)} />}
    </div>
  );
}

/* ---------------------------------------------------------------
 * 폐품 관리
 * ------------------------------------------------------------- */
function DisposalView({ state, calc, actions, setConfirmState }) {
  const [itemId, setItemId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');

  const selectedItem = calc.item(itemId);
  const pending = state.disposals.filter((d) => d.status === 'pending');
  const completed = state.disposals.filter((d) => d.status === 'completed').sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));

  const submit = () => {
    actions.addDisposalPending({ itemId, size: selectedItem?.size || '', qty, reason, warehouseId });
    setItemId(''); setWarehouseId(''); setQty(''); setReason('');
  };

  return (
    <div className="space-y-4">
      <div className="jamul-card p-4">
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--ink)' }}>폐기 대기 등록</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <select value={itemId} onChange={(e) => { setItemId(e.target.value); setWarehouseId(''); }} className="border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">품목 선택</option>
            {state.items.map((it) => <option key={it.id} value={it.id}>{it.name}{itemTag(it)}</option>)}
          </select>
          <input value={selectedItem?.size || ''} disabled placeholder="사이즈" className="border rounded-lg px-3 py-2 text-sm bg-gray-50" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }} />
          <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">출고 창고</option>
            {itemId && warehousesWithStock(state, itemId).map((s) => <option key={s.warehouseId} value={s.warehouseId}>{calc.whName(s.warehouseId)} (보유 {fmtNum(s.qty)})</option>)}
          </select>
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="수량" className="border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="사유" className="border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
        </div>
        <button onClick={submit} className="jamul-btn-primary mt-3 rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center gap-1"><Plus size={14} />대기 목록에 등록</button>
      </div>

      <div className="jamul-card overflow-x-auto">
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--ink)' }}>폐기 대기 목록 ({pending.length})</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>
              <th className="px-4 py-3 font-medium">품목</th>
              <th className="px-4 py-3 font-medium">사이즈</th>
              <th className="px-4 py-3 font-medium text-right">수량</th>
              <th className="px-4 py-3 font-medium">사유</th>
              <th className="px-4 py-3 font-medium">창고</th>
              <th className="px-4 py-3 font-medium text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {pending.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-xs" style={{ color: 'var(--ink-soft)' }}>폐기 대기중인 품목이 없습니다.</td></tr>
            )}
            {pending.map((d) => (
              <tr key={d.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink)' }}>{d.itemName}</td>
                <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{d.size || '-'}</td>
                <td className="px-4 py-3 text-right jamul-mono">{fmtNum(d.qty)}</td>
                <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{d.reason || '-'}</td>
                <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{d.warehouseName}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setConfirmState({
                      message: '폐기 처리를 진행하시겠습니까?',
                      detail: '재산수량 및 보유수량에서 즉시 차감되며 되돌릴 수 없습니다.',
                      onConfirm: () => actions.completeDisposal(d.id),
                    })}
                    className="text-xs px-2.5 py-1.5 rounded-md mr-1"
                    style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}
                  >
                    폐기 처리
                  </button>
                  <button onClick={() => actions.deleteDisposalPending(d.id)} className="p-1.5 rounded-md hover:bg-gray-100"><X size={13} style={{ color: 'var(--ink-soft)' }} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {completed.length > 0 && (
        <div className="jamul-card overflow-x-auto">
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--ink)' }}>폐기 완료 이력</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>
                <th className="px-4 py-3 font-medium">품목</th>
                <th className="px-4 py-3 font-medium text-right">수량</th>
                <th className="px-4 py-3 font-medium">사유</th>
                <th className="px-4 py-3 font-medium">처리일</th>
              </tr>
            </thead>
            <tbody>
              {completed.map((d) => (
                <tr key={d.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--ink)' }}>{d.itemName}{d.size ? ` (${d.size})` : ''}</td>
                  <td className="px-4 py-3 text-right jamul-mono">{fmtNum(d.qty)}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{d.reason || '-'}</td>
                  <td className="px-4 py-3 jamul-mono text-xs" style={{ color: 'var(--ink-soft)' }}>{fmtDate(d.completedDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
 * 정비 입고
 * ------------------------------------------------------------- */
function IntakeWarehouseModal({ record, state, calc, actions, onClose }) {
  const options = warehousesWithStock(state, record.itemId);
  const [warehouseId, setWarehouseId] = useState(options[0]?.warehouseId || '');

  const submit = async () => {
    const ok = await actions.startMaintenanceIntake(record.id, warehouseId);
    if (ok) onClose();
  };

  return (
    <Modal title={`정비 입고 처리 · ${record.itemName}`} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
          일련번호: {record.serial || '미기재'} · 사유: {record.reason || '-'}
        </p>
        <div>
          <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>반출할 창고</label>
          <select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">선택</option>
            {options.map((o) => <option key={o.warehouseId} value={o.warehouseId}>{calc.whName(o.warehouseId)} (보유 {fmtNum(o.qty)})</option>)}
          </select>
          {options.length === 0 && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>이 품목을 보유중인 창고가 없습니다.</p>}
        </div>
        <button onClick={submit} className="jamul-btn-primary w-full rounded-lg py-2.5 text-sm font-medium mt-2">입고 처리</button>
      </div>
    </Modal>
  );
}

function MaintenanceView({ state, calc, actions, setConfirmState }) {
  const [itemId, setItemId] = useState('');
  const [serial, setSerial] = useState('');
  const [reason, setReason] = useState('');
  const [intakeTarget, setIntakeTarget] = useState(null);

  const pending = state.maintenance.filter((m) => m.status === 'pending');
  const inProgress = state.maintenance.filter((m) => m.status === 'in_progress');

  const submit = () => {
    actions.addMaintenancePending({ itemId, serial, reason });
    setItemId(''); setSerial(''); setReason('');
  };

  const confirmComplete = (m) => {
    setConfirmState({
      message: `'${m.itemName}' 정비완료 처리하시겠습니까?`,
      detail: m.status === 'in_progress' ? `창고 재고(${m.warehouseName})로 반영됩니다.` : '대기 상태에서 바로 완료 처리되며, 재고 변동은 없습니다.',
      onConfirm: () => actions.closeMaintenance(m.id, 'completed'),
    });
  };
  const confirmCancel = (m) => {
    setConfirmState({
      message: `'${m.itemName}' 정비입고를 취소하시겠습니까?`,
      detail: m.status === 'in_progress' ? `창고 재고(${m.warehouseName})로 반영됩니다.` : '대기 목록에서 제거되며, 재고 변동은 없습니다.',
      onConfirm: () => actions.closeMaintenance(m.id, 'cancelled'),
    });
  };

  return (
    <div className="space-y-4">
      <div className="jamul-card p-4">
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--ink)' }}>정비입고 대기 등록</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <select value={itemId} onChange={(e) => setItemId(e.target.value)} className="border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
            <option value="">품목 선택</option>
            {state.items.map((it) => <option key={it.id} value={it.id}>{it.name}{itemTag(it)}</option>)}
          </select>
          <input value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="일련번호" className="border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="사유" className="border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
          <button onClick={submit} className="jamul-btn-primary rounded-lg px-4 py-2 text-sm font-medium inline-flex items-center justify-center gap-1"><Plus size={14} />등록</button>
        </div>
      </div>

      <div className="jamul-card overflow-x-auto">
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--ink)' }}>입고대기 ({pending.length})</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>
              <th className="px-4 py-3 font-medium">품명</th>
              <th className="px-4 py-3 font-medium">일련번호</th>
              <th className="px-4 py-3 font-medium">사유</th>
              <th className="px-4 py-3 font-medium text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {pending.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-xs" style={{ color: 'var(--ink-soft)' }}>입고 대기중인 품목이 없습니다.</td></tr>
            )}
            {pending.map((m) => (
              <tr key={m.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink)' }}>{m.itemName}</td>
                <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{m.serial || '-'}</td>
                <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{m.reason || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setIntakeTarget(m)} className="text-xs px-2.5 py-1.5 rounded-md mr-1 text-white" style={{ background: 'var(--accent)' }}>입고 처리</button>
                  <button onClick={() => confirmComplete(m)} className="text-xs px-2.5 py-1.5 rounded-md border mr-1" style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}>정비완료</button>
                  <button onClick={() => confirmCancel(m)} className="text-xs px-2.5 py-1.5 rounded-md" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>입고취소</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="jamul-card overflow-x-auto">
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--ink)' }}>입고중 ({inProgress.length})</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>
              <th className="px-4 py-3 font-medium">품명</th>
              <th className="px-4 py-3 font-medium">일련번호</th>
              <th className="px-4 py-3 font-medium">사유</th>
              <th className="px-4 py-3 font-medium">입고일</th>
              <th className="px-4 py-3 font-medium text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {inProgress.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-xs" style={{ color: 'var(--ink-soft)' }}>입고중인 품목이 없습니다.</td></tr>
            )}
            {inProgress.map((m) => (
              <tr key={m.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink)' }}>{m.itemName}</td>
                <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{m.serial || '-'}</td>
                <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{m.reason || '-'}</td>
                <td className="px-4 py-3 jamul-mono text-xs" style={{ color: 'var(--ink-soft)' }}>{fmtDate(m.intakeDate)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => confirmComplete(m)} className="text-xs px-2.5 py-1.5 rounded-md border mr-1" style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}>정비완료</button>
                  <button onClick={() => confirmCancel(m)} className="text-xs px-2.5 py-1.5 rounded-md" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>입고취소</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {intakeTarget && (
        <IntakeWarehouseModal record={intakeTarget} state={state} calc={calc} actions={actions} onClose={() => setIntakeTarget(null)} />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
 * 물자 이동 로그
 * ------------------------------------------------------------- */
function LogView({ state }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const rows = [...state.log]
    .filter((l) => typeFilter === 'all' || l.type === typeFilter)
    .filter((l) => (l.itemName || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm jamul-focus" style={{ borderColor: 'var(--border)' }}>
          <option value="all">전체 유형</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="품목명 검색" className="pl-8 pr-3 py-2 rounded-lg border text-sm jamul-focus" style={{ borderColor: 'var(--border)' }} />
        </div>
      </div>

      <div className="jamul-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>
              <th className="px-4 py-3 font-medium">일시</th>
              <th className="px-4 py-3 font-medium">유형</th>
              <th className="px-4 py-3 font-medium">품목</th>
              <th className="px-4 py-3 font-medium text-right">수량</th>
              <th className="px-4 py-3 font-medium">관련 정보</th>
              <th className="px-4 py-3 font-medium">처리자</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-xs" style={{ color: 'var(--ink-soft)' }}>기록이 없습니다.</td></tr>
            )}
            {rows.map((l) => (
              <tr key={l.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <td className="px-4 py-3 jamul-mono text-xs" style={{ color: 'var(--ink-soft)' }}>{fmtDate(l.date)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--accent)' }}>{TYPE_LABEL[l.type] || l.type}</span>
                </td>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink)' }}>{l.itemName}</td>
                <td className="px-4 py-3 text-right jamul-mono">{fmtNum(l.qty)}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--ink-soft)' }}>{[l.warehouseName, l.personName, l.detail].filter(Boolean).join(' · ')}</td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--ink-soft)' }}>{l.actor || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
 * 관리자 관리
 * ------------------------------------------------------------- */
function AdminsView({ state, currentAdmin, adminActions, setConfirmState }) {
  const pending = state.admins.filter((a) => a.status === 'pending');
  const active = state.admins.filter((a) => a.status !== 'pending');

  const confirmDelete = (a) => {
    setConfirmState({
      message: `'${a.name}'님을 삭제하시겠습니까?`,
      detail: '삭제하면 더 이상 로그인할 수 없습니다.',
      onConfirm: () => adminActions.deleteAdmin(a.id),
    });
  };

  return (
    <div className="space-y-4">
      {pending.length > 0 && (
        <div className="jamul-card p-4">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
            <AlertTriangle size={14} color="var(--warning)" />관리자 등록 승인 대기 ({pending.length})
          </h3>
          <div className="space-y-2">
            {pending.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-2 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--ink)' }}>{a.name}</span>
                <div>
                  <button
                    onClick={() => adminActions.approveAdmin(a.id)}
                    className="text-xs px-2.5 py-1.5 rounded-md mr-1 text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    승인
                  </button>
                  <button
                    onClick={() => setConfirmState({
                      message: `'${a.name}'님의 관리자 등록 신청을 거절하시겠습니까?`,
                      onConfirm: () => adminActions.rejectAdmin(a.id),
                    })}
                    className="text-xs px-2.5 py-1.5 rounded-md"
                    style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}
                  >
                    거절
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="jamul-card p-4">
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--ink)' }}>등록된 사용자 ({active.length})</h3>
        <div className="space-y-2">
          {active.map((a) => {
            const isMe = a.name === currentAdmin;
            return (
              <div key={a.id} className="flex items-center justify-between p-2 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent)' }}>{a.name[0]}</span>
                  <span className="text-sm" style={{ color: 'var(--ink)' }}>{a.name}</span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: a.role === 'admin' ? 'var(--success-bg)' : 'var(--warning-bg)', color: a.role === 'admin' ? 'var(--success)' : 'var(--warning)' }}
                  >
                    {a.role === 'admin' ? '관리자' : '일반 사용자'}
                  </span>
                  {isMe && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--border)', color: 'var(--ink-soft)' }}>나</span>}
                </div>
                {!isMe && (
                  <div>
                    <button
                      onClick={() => adminActions.setAdminRole(a.id, a.role === 'admin' ? 'user' : 'admin')}
                      className="text-xs px-2.5 py-1.5 rounded-md border mr-1"
                      style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
                    >
                      {a.role === 'admin' ? '일반 사용자로 변경' : '관리자로 지정'}
                    </button>
                    <button
                      onClick={() => confirmDelete(a)}
                      className="p-1.5 rounded-md hover:bg-gray-100"
                    >
                      <Trash2 size={13} color="var(--danger)" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--ink-soft)' }}>
          새 사용자는 로그인 화면의 <b>신규 등록</b> 탭에서 이름과 비밀번호를 정해 직접 등록합니다. 관리자로 신청하면 이곳에서 승인해야 로그인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
 * App (default export)
 * ------------------------------------------------------------- */
export default function App() {
  const [state, setState] = useState(() => defaultState());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentAdmin, setCurrentAdminState] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [adminReady, setAdminReady] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const showToast = (msg, tone = 'success') => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2800);
  };

  const persist = async (next) => {
    setState(next);
    setSaving(true);
    try {
      await saveState(next);
    } catch (e) {
      console.error('Supabase 저장 실패:', e);
      showToast('저장에 실패했습니다. Supabase 연결을 확인해주세요.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const loaded = await loadState();
      setState(loaded);
      showToast('최신 데이터로 갱신했습니다.');
    } catch (e) {
      console.error('Supabase 갱신 실패:', e);
      showToast('갱신에 실패했습니다.', 'danger');
    }
    setLoading(false);
  };

  const handleSession = async (session) => {
    const user = session?.user || null;
    if (!user) {
      setCurrentAdminState(null);
      setCurrentRole(null);
      setState(defaultState());
      return;
    }
    const name = user.user_metadata?.name || null;
    try {
      const { data: profile, error: profErr } = await supabase.from('admins').select('*').eq('id', user.id).maybeSingle();
      if (profErr || !profile || profile.status !== 'active') {
        await supabase.auth.signOut();
        setCurrentAdminState(null);
        setCurrentRole(null);
        setState(defaultState());
        return;
      }
      setCurrentAdminState(name);
      setCurrentRole(profile.role || 'user');
      const loaded = await loadState();
      setState(loaded);
    } catch (e) {
      console.error('데이터를 불러오지 못했습니다:', e);
      showToast('데이터를 불러오지 못했습니다. Supabase 연결 설정을 확인해주세요.', 'danger');
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) await handleSession(session);
      if (mounted) { setAdminReady(true); setLoading(false); }
    })();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const loginAs = async (name, password) => {
    const trimmed = (name || '').trim();
    if (!trimmed || !password) return { ok: false, message: '이름과 비밀번호를 입력해주세요.' };
    const { data, error } = await supabase.auth.signInWithPassword({ email: nameToEmail(trimmed), password });
    if (error) return { ok: false, message: '이름 또는 비밀번호가 올바르지 않습니다.' };
    const { data: profile } = await supabase.from('admins').select('*').eq('id', data.user.id).maybeSingle();
    if (!profile) {
      await supabase.auth.signOut();
      return { ok: false, message: '계정 정보를 찾을 수 없습니다. 관리자에게 문의해주세요.' };
    }
    if (profile.status === 'pending') {
      await supabase.auth.signOut();
      return { ok: false, pending: true, message: '아직 관리자 승인 대기 중입니다. 승인 후 로그인해주세요.' };
    }
    return { ok: true };
  };

  const signUpAdmin = async (name, password, role) => {
    const trimmed = (name || '').trim();
    if (!trimmed || !password) return { ok: false, message: '이름과 비밀번호를 입력해주세요.' };
    if (password.length < 6) return { ok: false, message: '비밀번호는 6자 이상이어야 합니다.' };
    const wantsAdmin = role === 'admin';
    const noActiveAdmin = !state.admins.some((a) => a.role === 'admin' && a.status === 'active');
    const status = wantsAdmin ? (noActiveAdmin ? 'active' : 'pending') : 'active';
    const { data, error } = await supabase.auth.signUp({
      email: nameToEmail(trimmed),
      password,
      options: { data: { name: trimmed } },
    });
    if (error) {
      const already = /already|registered|exists/i.test(error.message || '');
      return { ok: false, message: already ? '이미 등록된 이름입니다. 로그인해주세요.' : `등록에 실패했습니다: ${error.message}` };
    }
    const userId = data.user?.id;
    if (!userId) return { ok: false, message: '등록에 실패했습니다. 다시 시도해주세요.' };
    const { error: insErr } = await supabase.from('admins').insert({ id: userId, name: trimmed, role: wantsAdmin ? 'admin' : 'user', status });
    if (insErr) {
      return { ok: false, message: `등록에 실패했습니다: ${insErr.message}` };
    }
    if (!data.session) {
      return { ok: false, message: '등록되었습니다. 관리자에게 이메일 인증(Confirm email) 설정을 꺼달라고 요청해주세요.' };
    }
    if (status === 'pending') {
      await supabase.auth.signOut();
      return { ok: false, pending: true, message: '신청이 접수되었습니다. 기존 관리자의 승인 후 등록이 완료됩니다.' };
    }
    return { ok: true };
  };

  const switchAdmin = async () => {
    await supabase.auth.signOut();
  };

  const adminActions = {
    approveAdmin: async (id) => {
      const { error } = await supabase.from('admins').update({ status: 'active' }).eq('id', id);
      if (error) { showToast('승인에 실패했습니다.', 'danger'); return; }
      setState((prev) => ({ ...prev, admins: prev.admins.map((a) => (a.id === id ? { ...a, status: 'active' } : a)) }));
      showToast('관리자 등록을 승인했습니다.');
    },
    rejectAdmin: async (id) => {
      const { error } = await supabase.from('admins').delete().eq('id', id);
      if (error) { showToast('거절 처리에 실패했습니다.', 'danger'); return; }
      setState((prev) => ({ ...prev, admins: prev.admins.filter((a) => a.id !== id) }));
      showToast('관리자 신청을 거절했습니다.');
    },
    setAdminRole: async (id, role) => {
      const { error } = await supabase.from('admins').update({ role }).eq('id', id);
      if (error) { showToast('권한 변경에 실패했습니다.', 'danger'); return; }
      setState((prev) => ({ ...prev, admins: prev.admins.map((a) => (a.id === id ? { ...a, role } : a)) }));
      showToast('권한이 변경되었습니다.');
    },
    deleteAdmin: async (id) => {
      const target = state.admins.find((a) => a.id === id);
      if (!target) return;
      const activeAdminCount = state.admins.filter((a) => a.role === 'admin' && a.status === 'active').length;
      if (target.role === 'admin' && target.status === 'active' && activeAdminCount <= 1) {
        showToast('마지막 남은 관리자는 삭제할 수 없습니다.', 'danger');
        return;
      }
      const { error } = await supabase.from('admins').delete().eq('id', id);
      if (error) { showToast('삭제에 실패했습니다.', 'danger'); return; }
      setState((prev) => ({ ...prev, admins: prev.admins.filter((a) => a.id !== id) }));
      showToast(`'${target.name}'님을 삭제했습니다.`);
    },
  };

  const calc = buildCalc(state);
  const makeLog = (partial) => ({ id: uid('log'), date: nowIso(), actor: currentAdmin, ...partial });

  const actions = {
    addWarehouse: async (name, location) => {
      if (!name.trim()) { showToast('창고 이름을 입력해주세요.', 'danger'); return; }
      const wh = { id: uid('wh'), name: name.trim(), location: (location || '').trim(), shelves: [] };
      await persist({ ...state, warehouses: [...state.warehouses, wh] });
      showToast(`'${wh.name}' 창고가 등록되었습니다.`);
    },
    updateWarehouse: async (id, patch) => {
      await persist({ ...state, warehouses: state.warehouses.map((w) => (w.id === id ? { ...w, ...patch } : w)) });
      showToast('창고 정보가 수정되었습니다.');
    },
    deleteWarehouse: async (id) => {
      const sum = state.stock.filter((s) => s.warehouseId === id).reduce((a, b) => a + b.qty, 0);
      if (sum > 0) { showToast('보관 중인 품목이 있어 삭제할 수 없습니다. 먼저 재고를 이동해주세요.', 'danger'); return; }
      await persist({ ...state, warehouses: state.warehouses.filter((w) => w.id !== id) });
      showToast('창고가 삭제되었습니다.');
    },
    addShelf: async (warehouseId, name, rows, cols) => {
      const r = Number(rows) || 0;
      const c = Number(cols) || 0;
      if (r <= 0 || c <= 0) { showToast('줄 수와 칸 수를 올바르게 입력해주세요.', 'danger'); return; }
      const wh = state.warehouses.find((w) => w.id === warehouseId);
      if (!wh) return;
      const nextNo = (wh.shelves || []).length + 1;
      const shelf = { id: uid('shelf'), name: (name || '').trim() || `선반 ${nextNo}`, rows: r, cols: c };
      const warehouses = state.warehouses.map((w) => (w.id === warehouseId ? { ...w, shelves: [...(w.shelves || []), shelf] } : w));
      await persist({ ...state, warehouses });
      showToast('선반이 추가되었습니다.');
    },
    deleteShelf: async (warehouseId, shelfId) => {
      const inUse = state.stock.some((s) => s.boxId && s.boxId.startsWith(`${shelfId}#`) && s.qty > 0);
      if (inUse) { showToast('해당 선반에 보관중인 품목이 있어 삭제할 수 없습니다.', 'danger'); return; }
      const warehouses = state.warehouses.map((w) => (w.id === warehouseId ? { ...w, shelves: (w.shelves || []).filter((s) => s.id !== shelfId) } : w));
      await persist({ ...state, warehouses });
      showToast('선반이 삭제되었습니다.');
    },
    setStockLocation: async (stockId, boxId) => {
      const row = state.stock.find((s) => s.id === stockId);
      if (!row) { showToast('해당 재고를 찾을 수 없습니다.', 'danger'); return; }
      const stock = state.stock.map((s) => (s.id === stockId ? { ...s, boxId: boxId || '' } : s));
      await persist({ ...state, stock });
      showToast('보관 위치가 수정되었습니다.');
    },
    splitStock: async (stockId, targetBoxId, splitQty) => {
      const row = state.stock.find((s) => s.id === stockId);
      if (!row) { showToast('해당 재고를 찾을 수 없습니다.', 'danger'); return false; }
      const q = Number(splitQty) || 0;
      if (!targetBoxId) { showToast('분할할 위치를 선택해주세요.', 'danger'); return false; }
      if (targetBoxId === row.boxId) { showToast('현재 위치와 다른 위치를 선택해주세요.', 'danger'); return false; }
      if (q <= 0 || q >= row.qty) { showToast('분할 수량은 1개 이상, 현재 수량 미만이어야 합니다.', 'danger'); return false; }
      let stock = state.stock.map((s) => (s.id === stockId ? { ...s, qty: s.qty - q } : s));
      const existingIdx = stock.findIndex((s) => s.itemId === row.itemId && s.warehouseId === row.warehouseId && s.boxId === targetBoxId);
      if (existingIdx >= 0) stock[existingIdx] = { ...stock[existingIdx], qty: stock[existingIdx].qty + q };
      else stock.push({ id: uid('st'), itemId: row.itemId, warehouseId: row.warehouseId, qty: q, boxId: targetBoxId });
      const log = [...state.log, makeLog({ type: 'split', itemName: calc.itemName(row.itemId), qty: q, warehouseName: calc.whName(row.warehouseId), detail: `위치 분할 (${calc.boxLabel(row.warehouseId, row.boxId)} → ${calc.boxLabel(row.warehouseId, targetBoxId)})` })];
      await persist({ ...state, stock, log });
      showToast('위치가 분할되었습니다.');
      return true;
    },
    addItem: async ({ name, size, unit, propertyQty, warehouseId, boxId, season, part }) => {
      const trimmedName = name.trim();
      if (!trimmedName) { showToast('품목명을 입력해주세요.', 'danger'); return; }
      const qty = Number(propertyQty) || 0;
      const item = { id: uid('it'), name: trimmedName, size: (size || '').trim(), unit: (unit || '').trim(), propertyQty: qty, season: season || '', part: part || '' };
      let stock = state.stock;
      let log = state.log;
      if (qty > 0) {
        if (!warehouseId) { showToast('초기 재산수량이 있으면 보관할 창고를 선택해주세요.', 'danger'); return; }
        stock = [...stock, { id: uid('st'), itemId: item.id, warehouseId, qty, boxId: boxId || '' }];
        log = [...log, makeLog({ type: 'intake', itemName: item.name, qty, warehouseName: calc.whName(warehouseId), detail: '품목 신규 등록' })];
      }
      await persist({ ...state, items: [...state.items, item], stock, log });
      showToast(`'${item.name}' 품목이 등록되었습니다.`);
    },
    adjustProperty: async (itemId, delta, warehouseId) => {
      const d = Number(delta);
      if (!d || isNaN(d)) { showToast('변경 수량을 입력해주세요.', 'danger'); return; }
      if (!warehouseId) { showToast('창고를 선택해주세요.', 'danger'); return; }
      const it = calc.item(itemId);
      if (!it) return;
      if (d > 0) {
        const idx = state.stock.findIndex((s) => s.itemId === itemId && s.warehouseId === warehouseId);
        let stock = [...state.stock];
        if (idx >= 0) stock[idx] = { ...stock[idx], qty: stock[idx].qty + d };
        else stock.push({ id: uid('st'), itemId, warehouseId, qty: d, boxId: '' });
        const items = state.items.map((x) => (x.id === itemId ? { ...x, propertyQty: x.propertyQty + d } : x));
        const log = [...state.log, makeLog({ type: 'addProperty', itemName: it.name, qty: d, warehouseName: calc.whName(warehouseId), detail: '재산 수정 (증가)' })];
        await persist({ ...state, items, stock, log });
        showToast('재산 수량이 수정되었습니다.');
      } else {
        const need = Math.abs(d);
        const avail = calc.stockAt(itemId, warehouseId);
        if (need > avail) { showToast('선택한 창고의 보유수량보다 많이 줄일 수 없습니다.', 'danger'); return; }
        const { stock } = consumeFromRows(state.stock, itemId, warehouseId, need);
        const items = state.items.map((x) => (x.id === itemId ? { ...x, propertyQty: Math.max(0, x.propertyQty - need) } : x));
        const log = [...state.log, makeLog({ type: 'addProperty', itemName: it.name, qty: -need, warehouseName: calc.whName(warehouseId), detail: '재산 수정 (감소)' })];
        await persist({ ...state, items, stock, log });
        showToast('재산 수량이 수정되었습니다.');
      }
    },
    deleteItem: async (id) => {
      const stockSum = calc.totalStock(id);
      const heldSum = calc.totalHeld(id);
      const maintSum = calc.maintenanceQty(id);
      if (stockSum > 0 || heldSum > 0 || maintSum > 0) {
        const reasons = [];
        if (stockSum > 0) reasons.push(`창고 보유수량 ${fmtNum(stockSum)}개`);
        if (heldSum > 0) reasons.push(`불출중 ${fmtNum(heldSum)}개`);
        if (maintSum > 0) reasons.push(`정비입고중 ${fmtNum(maintSum)}개`);
        showToast(`${reasons.join(', ')}이(가) 남아있어 삭제할 수 없습니다.`, 'danger');
        return;
      }
      await persist({ ...state, items: state.items.filter((it) => it.id !== id) });
      showToast('품목이 삭제되었습니다.');
    },
    transferStock: async ({ itemId, fromWarehouseId, toWarehouseId, qty }) => {
      const q = Number(qty) || 0;
      if (!fromWarehouseId || !toWarehouseId || fromWarehouseId === toWarehouseId) {
        showToast('출발 창고와 도착 창고를 다르게 선택해주세요.', 'danger'); return false;
      }
      const avail = calc.stockAt(itemId, fromWarehouseId);
      if (q <= 0 || q > avail) { showToast('이동 가능한 수량을 초과했습니다.', 'danger'); return false; }
      const { stock: consumedStock } = consumeFromRows(state.stock, itemId, fromWarehouseId, q);
      let stock = consumedStock;
      const idx = stock.findIndex((s) => s.itemId === itemId && s.warehouseId === toWarehouseId);
      if (idx >= 0) stock[idx] = { ...stock[idx], qty: stock[idx].qty + q };
      else stock.push({ id: uid('st'), itemId, warehouseId: toWarehouseId, qty: q, boxId: '' });
      const log = [...state.log, makeLog({ type: 'transfer', itemName: calc.itemName(itemId), qty: q, warehouseName: `${calc.whName(fromWarehouseId)} → ${calc.whName(toWarehouseId)}`, detail: '창고간 이동' })];
      await persist({ ...state, stock, log });
      showToast('재고가 이동되었습니다.');
      return true;
    },
    adjustStock: async (stockId, newQty) => {
      const q = Number(newQty);
      if (isNaN(q) || q < 0) { showToast('올바른 수량을 입력해주세요.', 'danger'); return; }
      const row = state.stock.find((s) => s.id === stockId);
      if (!row) { showToast('해당 재고를 찾을 수 없습니다.', 'danger'); return; }
      const oldQty = row.qty;
      if (q === oldQty) return;
      const stock = state.stock.map((s) => (s.id === stockId ? { ...s, qty: q } : s));
      const log = [...state.log, makeLog({ type: 'adjust', itemName: calc.itemName(row.itemId), qty: q - oldQty, warehouseName: calc.whName(row.warehouseId), detail: `보유수량 수정 (${fmtNum(oldQty)} → ${fmtNum(q)})` })];
      await persist({ ...state, stock, log });
      showToast('보유수량이 수정되었습니다.');
    },
    addPerson: async (name, dept) => {
      if (!name.trim() || !dept.trim()) { showToast('이름과 소속을 모두 입력해주세요.', 'danger'); return; }
      const p = { id: uid('ps'), name: name.trim(), dept: dept.trim() };
      await persist({ ...state, persons: [...state.persons, p] });
      showToast(`'${p.name}'님이 등록되었습니다.`);
    },
    deletePerson: async (id) => {
      const remaining = state.holdings.filter((h) => h.personId === id && h.qty > 0);
      if (remaining.length > 0) { showToast('반납되지 않은 품목이 있어 삭제할 수 없습니다.', 'danger'); return; }
      const p = state.persons.find((x) => x.id === id);
      await persist({ ...state, persons: state.persons.filter((x) => x.id !== id) });
      showToast(`'${p?.name || ''}'님이 삭제되었습니다.`);
    },
    returnHoldings: async (rows) => {
      if (!rows.length) return;
      let holdings = [...state.holdings];
      let stock = [...state.stock];
      let log = [...state.log];
      rows.forEach((r) => {
        holdings = holdings.map((h) => (h.id === r.holdingId ? { ...h, qty: h.qty - r.qty } : h)).filter((h) => h.qty > 0);
        const idx = stock.findIndex((s) => s.itemId === r.itemId && s.warehouseId === r.warehouseId);
        if (idx >= 0) stock[idx] = { ...stock[idx], qty: stock[idx].qty + r.qty };
        else stock.push({ id: uid('st'), itemId: r.itemId, warehouseId: r.warehouseId, qty: r.qty });
        log.push(makeLog({ type: 'return', itemName: calc.itemName(r.itemId), qty: r.qty, warehouseName: calc.whName(r.warehouseId), personName: r.personName, detail: '반납 처리' }));
      });
      await persist({ ...state, holdings, stock, log });
      showToast('반납 처리가 완료되었습니다.');
    },
    returnAndDeletePerson: async (personId, rows) => {
      let holdings = [...state.holdings];
      let stock = [...state.stock];
      let log = [...state.log];
      const pName = calc.personName(personId);
      rows.forEach((r) => {
        holdings = holdings.map((h) => (h.id === r.holdingId ? { ...h, qty: h.qty - r.qty } : h)).filter((h) => h.qty > 0);
        const idx = stock.findIndex((s) => s.itemId === r.itemId && s.warehouseId === r.warehouseId);
        if (idx >= 0) stock[idx] = { ...stock[idx], qty: stock[idx].qty + r.qty };
        else stock.push({ id: uid('st'), itemId: r.itemId, warehouseId: r.warehouseId, qty: r.qty });
        log.push(makeLog({ type: 'return', itemName: calc.itemName(r.itemId), qty: r.qty, warehouseName: calc.whName(r.warehouseId), personName: pName, detail: '인원 삭제로 인한 반납' }));
      });
      const stillHolding = holdings.some((h) => h.personId === personId && h.qty > 0);
      if (stillHolding) {
        showToast('선택하지 않은 보유 품목이 있어 삭제할 수 없습니다. 모든 품목을 반납해주세요.', 'danger');
        return false;
      }
      const persons = state.persons.filter((p) => p.id !== personId);
      await persist({ ...state, holdings, stock, log, persons });
      showToast('반납 처리 후 인원이 삭제되었습니다.');
      return true;
    },
    issueItem: async ({ personId, itemId, warehouseId, qty, reason, date }) => {
      const q = Number(qty) || 0;
      if (!personId || !itemId || !warehouseId) { showToast('필수 항목을 모두 선택해주세요.', 'danger'); return false; }
      const avail = calc.stockAt(itemId, warehouseId);
      if (q <= 0 || q > avail) { showToast('해당 창고의 보유수량을 초과하여 불출할 수 없습니다.', 'danger'); return false; }
      const { stock } = consumeFromRows(state.stock, itemId, warehouseId, q);
      let holdings = [...state.holdings];
      const existing = holdings.find((h) => h.itemId === itemId && h.personId === personId);
      if (existing) holdings = holdings.map((h) => (h.id === existing.id ? { ...h, qty: h.qty + q } : h));
      else holdings.push({ id: uid('hd'), itemId, personId, qty: q });
      const log = [...state.log, makeLog({ type: 'issue', itemName: calc.itemName(itemId), qty: q, warehouseName: calc.whName(warehouseId), personName: calc.personName(personId), detail: (reason || '').trim() || '-' })];
      await persist({ ...state, stock, holdings, log });
      showToast('불출 처리가 완료되었습니다.');
      return true;
    },
    issueNewProperty: async ({ personId, itemId, qty, reason, date }) => {
      const q = Number(qty) || 0;
      if (!personId || !itemId) { showToast('인원과 품목을 선택해주세요.', 'danger'); return false; }
      if (q <= 0) { showToast('수량을 올바르게 입력해주세요.', 'danger'); return false; }
      const items = state.items.map((it) => (it.id === itemId ? { ...it, propertyQty: it.propertyQty + q } : it));
      let holdings = [...state.holdings];
      const existing = holdings.find((h) => h.itemId === itemId && h.personId === personId);
      if (existing) holdings = holdings.map((h) => (h.id === existing.id ? { ...h, qty: h.qty + q } : h));
      else holdings.push({ id: uid('hd'), itemId, personId, qty: q });
      const log = [...state.log, makeLog({ type: 'issueNew', itemName: calc.itemName(itemId), qty: q, personName: calc.personName(personId), detail: (reason || '').trim() || '재산 신규 취득 후 즉시 불출' })];
      await persist({ ...state, items, holdings, log });
      showToast('재산 증가 및 불출 처리가 완료되었습니다.');
      return true;
    },
    addDisposalPending: async ({ itemId, size, qty, reason, warehouseId }) => {
      const q = Number(qty) || 0;
      if (!itemId || !warehouseId) { showToast('품목과 창고를 선택해주세요.', 'danger'); return; }
      if (q <= 0) { showToast('수량을 올바르게 입력해주세요.', 'danger'); return; }
      const d = { id: uid('dp'), itemId, itemName: calc.itemName(itemId), size: size || '', qty: q, reason: reason || '', warehouseId, warehouseName: calc.whName(warehouseId), status: 'pending', createdDate: nowIso(), createdBy: currentAdmin };
      await persist({ ...state, disposals: [...state.disposals, d] });
      showToast('폐기 대기 목록에 등록되었습니다.');
    },
    deleteDisposalPending: async (id) => {
      await persist({ ...state, disposals: state.disposals.filter((d) => d.id !== id) });
      showToast('폐기 대기 항목이 취소되었습니다.');
    },
    completeDisposal: async (id) => {
      const d = state.disposals.find((x) => x.id === id);
      if (!d) return;
      const avail = calc.stockAt(d.itemId, d.warehouseId);
      if (d.qty > avail) { showToast('창고 보유수량이 부족하여 폐기 처리할 수 없습니다.', 'danger'); return; }
      const { stock } = consumeFromRows(state.stock, d.itemId, d.warehouseId, d.qty);
      const items = state.items.map((it) => (it.id === d.itemId ? { ...it, propertyQty: Math.max(0, it.propertyQty - d.qty) } : it));
      const disposals = state.disposals.map((x) => (x.id === id ? { ...x, status: 'completed', completedDate: nowIso() } : x));
      const log = [...state.log, makeLog({ type: 'dispose', itemName: d.itemName, qty: d.qty, warehouseName: d.warehouseName, detail: d.reason || '-' })];
      await persist({ ...state, stock, items, disposals, log });
      showToast('폐기 처리가 완료되었습니다.');
    },
    addMaintenancePending: async ({ itemId, serial, reason }) => {
      if (!itemId) { showToast('품목을 선택해주세요.', 'danger'); return; }
      const m = {
        id: uid('mt'), itemId, itemName: calc.itemName(itemId),
        serial: (serial || '').trim(), reason: (reason || '').trim(),
        status: 'pending', warehouseId: '', warehouseName: '',
        createdDate: nowIso(), intakeDate: null, closedDate: null,
      };
      await persist({ ...state, maintenance: [...state.maintenance, m] });
      showToast('정비입고 대기 목록에 등록되었습니다.');
    },
    startMaintenanceIntake: async (id, warehouseId) => {
      const m = state.maintenance.find((x) => x.id === id);
      if (!m) return false;
      if (!warehouseId) { showToast('반출할 창고를 선택해주세요.', 'danger'); return false; }
      const avail = calc.stockAt(m.itemId, warehouseId);
      if (avail < 1) { showToast('선택한 창고에 해당 품목 재고가 없습니다.', 'danger'); return false; }
      const { stock } = consumeFromRows(state.stock, m.itemId, warehouseId, 1);
      const maintenance = state.maintenance.map((x) => (x.id === id
        ? { ...x, status: 'in_progress', warehouseId, warehouseName: calc.whName(warehouseId), intakeDate: nowIso() }
        : x));
      const log = [...state.log, makeLog({ type: 'maintenanceIn', itemName: m.itemName, qty: 1, warehouseName: calc.whName(warehouseId), detail: `정비입고 반출 (일련번호: ${m.serial || '미기재'})` })];
      await persist({ ...state, stock, maintenance, log });
      showToast('정비 입고 처리되었습니다.');
      return true;
    },
    closeMaintenance: async (id, outcome) => {
      const m = state.maintenance.find((x) => x.id === id);
      if (!m) return;
      let stock = state.stock;
      let log = state.log;
      const label = outcome === 'completed' ? '정비완료' : '정비입고 취소';
      if (m.status === 'in_progress') {
        const idx = stock.findIndex((s) => s.itemId === m.itemId && s.warehouseId === m.warehouseId);
        stock = [...stock];
        if (idx >= 0) stock[idx] = { ...stock[idx], qty: stock[idx].qty + 1 };
        else stock.push({ id: uid('st'), itemId: m.itemId, warehouseId: m.warehouseId, boxId: '', qty: 1 });
        log = [...log, makeLog({
          type: outcome === 'completed' ? 'maintenanceDone' : 'maintenanceCancel',
          itemName: m.itemName, qty: 1, warehouseName: m.warehouseName,
          detail: `${label} · 창고 반영 (일련번호: ${m.serial || '미기재'})`,
        })];
      } else {
        log = [...log, makeLog({
          type: outcome === 'completed' ? 'maintenanceDone' : 'maintenanceCancel',
          itemName: m.itemName, qty: 1, warehouseName: '-',
          detail: `${label} · 대기 상태에서 처리 (일련번호: ${m.serial || '미기재'})`,
        })];
      }
      const maintenance = state.maintenance.map((x) => (x.id === id ? { ...x, status: outcome, closedDate: nowIso() } : x));
      await persist({ ...state, stock, maintenance, log });
      showToast(outcome === 'completed' ? '정비완료 처리되었습니다.' : '정비입고가 취소되었습니다.');
    },
  };

  if (loading || !adminReady) {
    return <LoadingScreen />;
  }

  if (!currentAdmin) {
    return <LoginGate onLogin={loginAs} onSignup={signUpAdmin} />;
  }

  const isAdmin = currentRole === 'admin';
  const guardedActions = isAdmin ? actions : Object.fromEntries(
    Object.keys(actions).map((key) => [key, async () => {
      showToast('조회 권한만 있습니다. 데이터 변경은 관리자만 가능합니다.', 'danger');
      return false;
    }])
  );
  const safeActiveTab = (activeTab === 'admins' && !isAdmin) ? 'dashboard' : activeTab;

  return (
    <div className="jamul-root flex h-screen w-full overflow-hidden">
      <GlobalStyle />
      <Sidebar
        activeTab={safeActiveTab}
        setActiveTab={setActiveTab}
        state={state}
        calc={calc}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        isAdmin={isAdmin}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar activeTab={safeActiveTab} currentAdmin={currentAdmin} isAdmin={isAdmin} saving={saving} onRefresh={refresh} onSwitch={switchAdmin} />
        <main className="flex-1 overflow-y-auto jamul-scrollbar p-6">
          {safeActiveTab === 'dashboard' && <DashboardView state={state} calc={calc} setActiveTab={setActiveTab} />}
          {safeActiveTab === 'inventory' && <InventoryView state={state} calc={calc} actions={guardedActions} />}
          {safeActiveTab === 'warehouses' && <WarehousesView state={state} calc={calc} actions={guardedActions} setConfirmState={setConfirmState} />}
          {safeActiveTab === 'issuance' && <IssuanceView state={state} calc={calc} actions={guardedActions} showToast={showToast} />}
          {safeActiveTab === 'persons' && <PersonsView state={state} calc={calc} actions={guardedActions} showToast={showToast} setConfirmState={setConfirmState} />}
          {safeActiveTab === 'itemsManage' && <ItemsView state={state} calc={calc} actions={guardedActions} setConfirmState={setConfirmState} />}
          {safeActiveTab === 'maintenance' && <MaintenanceView state={state} calc={calc} actions={guardedActions} setConfirmState={setConfirmState} />}
          {safeActiveTab === 'disposal' && <DisposalView state={state} calc={calc} actions={guardedActions} setConfirmState={setConfirmState} />}
          {safeActiveTab === 'log' && <LogView state={state} />}
          {safeActiveTab === 'admins' && isAdmin && <AdminsView state={state} currentAdmin={currentAdmin} adminActions={adminActions} setConfirmState={setConfirmState} />}
        </main>
      </div>
      <Toast toast={toast} />
      <ConfirmDialog confirmState={confirmState} setConfirmState={setConfirmState} />
    </div>
  );
}
