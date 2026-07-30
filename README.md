# 물자관리시스템 (Inventory & Supply Management System)

창고·재고·인원·불출·폐기까지 물자의 전체 흐름을 한 화면에서 관리하는 관리자용 웹 애플리케이션입니다.

## 주요 기능

### 📊 대시보드
등록 품목 수, 창고 수, 인원 수, 재산 총수량, 폐기 대기 건수 등 핵심 지표와 재고 부족 경고, 최근 이동 로그를 한눈에 확인

### 📦 재고 현황
- 품목별 / 창고별 보기 전환
- 재산수량 · 보유수량 · 불출수량 · 폐기대기수량 · 과부족수량 표시
- 과부족(보유+불출-재산)이 마이너스면 경고 배지로 표시
- 품목 상세보기에서 창고·선반·박스별로 나뉜 보관 위치와, 현재 불출되어 보유중인 인원 목록까지 확인 가능

### 🏢 창고 관리
- 창고 등록/수정/삭제
- **약도(선반/박스) 관리**: 줄×칸 크기의 선반을 여러 개 등록하고, 어떤 박스에 어떤 품목이 있는지 시각적으로 확인
- 보관 품목의 수량 수정, 위치 수정, **위치 분할**(한 품목을 여러 선반/박스에 나눠 보관), 즉시 불출 처리

### 🔄 불출 현황
- 소속 → 이름 순으로 그룹화된 보유 현황
- 새 불출 등록 (인원·품목·창고·수량·사유 입력)
- 품목을 체크하고 반납 창고를 선택해 반납 처리 → 창고 재고에 자동 반영

### 👥 인원 관리
- 이름 · 소속으로 인원 등록/삭제
- 보유 품목이 있는 인원은 삭제 전 반드시 반납 처리를 거치도록 안전장치 적용

### 🎽 품목 관리
- 명칭 · 계절구분(동계/하계) · 상하의구분 · 사이즈 · 단위 · 재산수량 등록
- 재산 추가 시 입고 창고 지정
- 등록 시 보관 위치(선반·박스)까지 바로 지정 가능

### 🗑️ 폐품 관리
- 폐기 대기 목록 등록(품목·사이즈·수량·사유·창고)
- 폐기 처리 시 재산수량·보유수량에서 자동 차감, 폐기 완료 이력 보관

### 📜 물자 이동 로그
입고 · 재산추가 · 불출 · 반납 · 창고이동 · 위치분할 · 보유수량수정 · 폐기처리 등 모든 수량 변동을 자동 기록, 유형/품목별 검색·필터 지원

### 🔐 관리자 관리
- 이름 등록 방식의 로그인 (여러 관리자가 동시에 사용 가능)
- 모든 활동 로그에 처리자 이름 자동 기록

## 기술 스택

- **React** + **Vite**
- **Supabase** (Postgres 데이터베이스)
- **Tailwind CSS** (유틸리티 클래스 기반 스타일링)
- **lucide-react** (아이콘)
- **IBM Plex Sans KR / IBM Plex Mono** (한글·숫자 전용 폰트)

## 파일 구성

```
index.html                # Vite 진입 HTML
src/
  main.jsx                # React 진입점 (App을 DOM에 마운트)
  App.jsx                 # 애플리케이션 전체 소스
  supabaseClient.js        # Supabase 클라이언트 초기화
  index.css               # Tailwind 진입 스타일시트
supabase/
  schema.sql               # Supabase 테이블/보안정책 생성 스크립트
package.json / vite.config.js / tailwind.config.js / postcss.config.js
.env.example              # Supabase 접속 정보 템플릿
index.jsx                 # (참고용) Claude.ai 아티팩트 전용 단일 파일 버전
```

> `index.jsx`(루트)는 Claude.ai 아티팩트에서 window.storage로 동작하던 이전 버전을 그대로 남겨둔 참고용 파일입니다. 실제 배포에 사용하는 애플리케이션은 `src/App.jsx`이며, 데이터는 아래 안내대로 Supabase에 저장됩니다.

## 시작하기 (로컬 실행)

### 1. Supabase 프로젝트 준비
1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 대시보드 → **SQL Editor** → New query → `supabase/schema.sql` 내용 전체 붙여넣고 **Run**
   (테이블 8개와 보안 정책이 한 번에 생성됩니다)
3. 프로젝트 대시보드 → **Project Settings → API**에서 **Project URL**과 **anon public key** 확인

### 2. 환경변수 설정
```
cp .env.example .env
```
`.env` 파일을 열어 위에서 확인한 값을 채워주세요.
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
```

### 3. 설치 및 실행
```
npm install
npm run dev
```
안내된 주소(기본값 http://localhost:5173)로 접속하면 됩니다.

### 4. 배포
`npm run build`로 빌드한 뒤 Vercel · Netlify 등에 올리면 됩니다. 배포 환경에도 동일한 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 환경변수를 설정해야 합니다.

## 데이터 저장 방식 안내

이 앱은 화면에서 어떤 동작(불출, 반납, 창고 이동 등)을 하든 **변경된 전체 데이터를 Supabase의 각 테이블에 다시 동기화(전체 삭제 후 재입력)하는 방식**으로 저장됩니다. 소규모 내부 관리 도구 기준으로 단순하고 안전하게 동작하도록 만든 방식이며, 데이터量이나 동시 사용자가 크게 늘어난다면 변경분만 반영하는 방식으로 개선하는 것을 권장합니다.

또한 실시간 동기화는 지원하지 않으므로, 다른 관리자가 입력한 내용을 보려면 화면 상단의 **새로고침** 버튼을 눌러야 합니다.

기본 제공되는 Supabase 보안 정책(RLS)은 anon key로 전체 읽기/쓰기를 허용합니다. 내부망 전용으로 쓴다면 문제없지만, 외부에 공개하는 서비스로 운영한다면 Supabase Auth 등을 추가로 연동해 접근을 제한하는 것을 권장합니다.

## 데이터 모델 요약

| 항목 | Supabase 테이블 | 설명 |
|---|---|---|
| `items` | `items` | 품목 (명칭, 사이즈, 단위, 계절/상하의 구분, 재산수량) |
| `warehouses` | `warehouses` | 창고 (이름, 위치) |
| (창고 내 선반) | `shelves` | 창고별 선반 (이름, 줄 수, 칸 수) |
| `stock` | `stock` | 품목별 창고·박스 보유수량 |
| `persons` | `persons` | 인원 (이름, 소속) |
| `holdings` | `holdings` | 인원별 불출 보유 현황 |
| `disposals` | `disposals` | 폐기 대기/완료 목록 |
| `log` | `movement_log` | 전체 물자 이동 이력 |
| `admins` | `admins` | 등록된 관리자 목록 |

