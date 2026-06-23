# itemCondition JSON-LD 추가 완료 인수인계 문서

작성일: 2026-06-23

## 1. 목표

구글 리치 스니펫 품질 향상을 위해 코인 상세 페이지 Product JSON-LD의
`offers` 블록에 `itemCondition: NewCondition` 필드를 추가한다.

## 2. 현재 상태

**완료 (직접 확인)**

- **`itemCondition` 추가 (커밋 `5e91e2b`)**: `scripts/generate-coin-pages.js`의
  `offers` 블록에 `"itemCondition": "https://schema.org/NewCondition"` 한 줄 추가.
  push 후 `git ls-remote`로 원격 HEAD = `5e91e2b` 확인 완료.
- **GitHub Actions 트리거 완료** (run ID `28013886617`, `completed / success`):
  코인 20개 HTML 페이지 자동 재생성 완료.

**검토 후 보류/제외 결정된 항목**:
- `favicon.ico` 추가 → 최신 브라우저 SVG 지원으로 효과 미미, To-Do에서 제외
- `apple-touch-icon` 추가 → 180×180 PNG 이미지 작업 선행 필요, 보류
- `sku` 추가 → Merchant Center 미연동 상태에서 효과 없음, 보류

## 3. 진행 단계

이번 세션 작업은 모두 완료.

1. ~~(완료) `generate-coin-pages.js` offers 블록에 `itemCondition` 추가~~
2. ~~(완료) 커밋 및 push (`5e91e2b`)~~
3. ~~(완료) GitHub Actions 수동 트리거 및 success 확인~~

## 4. 다음에 진행할 일 (To-Do)

### 🔍 SEO
- 📢 👤 구글 서치 콘솔 데이터 확인 — **2주 후** 순서대로 점검:
  1. 색인 생성 → 페이지: 색인된 페이지 수 확인 (목표: 25개 내외)
  2. "색인되지 않음" 항목 원인 파악 → 🤖 조치
  3. 검색결과 성과: 노출수·클릭수·게재순위 확인
  4. 유입 검색어 보고 title/description 최적화 판단 → 🤖 반영
  5. 리치 결과 탭에서 제품 스니펫 실제 노출 여부 확인
- 🔵 👤 코인 상세페이지 "관련 코인" 섹션 추가 여부 결정 (전환율 관점)
- 📢 👤 네이버 검색 노출 안정화되면 사이트명 변경 진행
- 📢 👤 콘텐츠 마케팅 / 네이버 파워링크 (보류 중)
- 🔵 👤 `coin-detail.html` JSON-LD 정적 전환 여부 결정 (우선순위 낮음)
- 🔵 👤 Organization/LocalBusiness JSON-LD 추가 여부 — 주소 실제 정보 확인 후 진행
- 🔵 👤 `apple-touch-icon` 추가 — 180×180 PNG 이미지 준비 후 진행
- 🔵 👤 `sku` 추가 — Merchant Center 연동 계획 생기면 그때 진행

### 🛍️ 상품 데이터
- ⚪ 👤 서울 본점 주소·전화번호 실제 정보인지 확인
- ⚪ 👤 `contact.html` 지도 「임시 주소」를 실제 주소로 교체
- ⚪ 👤 강남 지점 실재 여부 확인 → 있으면 `footer.js`에 추가
- ⚪ 👤 소셜 미디어 계정 생기면 `footer.js`에 추가

### 🎨 UI/UX
- 🟡 👤 카테고리 배너 디자인 방향 결정 (여러 세션째 보류 중)
- 🟡 👤 뱃지 shimmer 애니메이션 제거 여부 결정 → 🤖 정적 뱃지로 교체

### ⚙️ 기능/인프라
- 해당 없음

### 📋 운영/프로세스
- 🔵 👤 `구매안내` 탭 문구(결제/배송/교환·환불 등) 실제 운영 정책 검토
  → 확정되면 🤖 `shippingDetails` / `hasMerchantReturnPolicy` JSON-LD에 반영

## 5. 참고 사항

- **`itemCondition` 위치**: `generate-coin-pages.js` 181번째 줄 부근,
  `availability` 바로 다음 줄. 정적 페이지(`coin-maple-2026.html` 등)에는
  직접 수동 추가하지 않았으며, Actions 자동 생성분에만 반영됨.
  → `coin-maple-2026.html`은 Actions가 재생성하므로 별도 수동 작업 불필요.
- **favicon.ico 제외 근거**: 최신 브라우저는 SVG favicon 전부 지원.
  IE/구형 브라우저 유입이 Analytics에서 실제로 잡힐 때 재검토하면 됨.
  To-Do에 넣지 않기로 결정.
- **sku 보류 근거**: 구글 쇼핑 탭 노출은 Merchant Center 연동이 필수.
  sku 필드만 넣어도 쇼핑 노출이 되지 않음 — 실제 상품 코드 체계 + 
  Merchant Center 연동 계획이 생길 때 함께 진행하는 것이 맞음.
- **GitHub PAT**: 이번 세션에서 사용. 만료일 미확인 — 다음 push 시
  만료 여부 먼저 확인할 것.
- **GitHub Actions 수동 트리거 방법**:
  ```
  POST /repos/{owner}/{repo}/actions/workflows/300577944/dispatches
  body: {"ref":"main"}
  ```
  204 응답이면 정상 트리거. run ID로 `/actions/runs/{run_id}` 폴링해서 확인.
- **이전 핸드오프**: `2026-06-23-1734-ogimage메타태그완료확인및ToDo정리.md`
