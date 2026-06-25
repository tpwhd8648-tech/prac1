// =====================================================================
// coin-data.js — 상품명 ↔ 이미지 매핑(IMAGE_MAP) 전용 공용 파일
//
// products.js에서 분리됨 (2026-06-25). 분리 이유:
//   index.html은 SSG 정적 카드 전환 후 products.js 전체(구글 시트 fetch,
//   카드 렌더링 등)를 로드할 필요가 없어졌지만, 검색 자동완성
//   (getCoinNamesForSearch)에 필요한 IMAGE_MAP만큼은 index.html도
//   여전히 필요했음. 이전에는 이걸 nav.js의 FALLBACK_COIN_NAMES
//   하드코딩 배열로 수동 관리했는데, 상품 추가/삭제 시 깜빡하고 안
//   맞추면 검색 자동완성이 깨지는 버그가 반복됐음(1646 세션 COIN_NAMES
//   불일치 버그가 대표적 사례).
//
//   IMAGE_MAP만 떼어 이 작은 파일로 만들고 index.html에도 로드하면,
//   상품 추가/삭제 시 이 파일 하나만 고치면 coins.html/coin-detail.html/
//   정적 coin-*.html은 물론 index.html 검색 자동완성까지 전부 자동
//   동기화된다 — FALLBACK_COIN_NAMES 같은 수동 동기화 배열이 더 이상
//   필요 없어짐(nav.js에는 fallback 코드만 안전장치로 남겨둠).
//
// products.js는 이 파일을 <script>로 먼저 로드한 뒤 그대로 사용한다
// (products.js에 동일한 이름으로 재선언하지 않음 — 중복 선언 시 문법
// 에러가 나므로 반드시 이 파일을 먼저 로드해야 함. 로드 순서:
// coin-data.js → products.js).
// =====================================================================

// ===== 상품명 → 이미지 파일명 매핑 =====
const IMAGE_MAP = [
  { keywords: ['2026 메이플리프', '2026 메이플 리프', '2026 메이플', '2026 maple'],         file: 'products-maple-2026.png' },
  { keywords: ['2026 브리타니아', '2026 britannia'],                   file: 'products-britannia-2026.png' },
  { keywords: ['2026 캥거루', '2026 kangaroo'],                        file: 'products-kangaroo-2026.png' },
  { keywords: ['2026 버팔로', '2026 buffalo'],                         file: 'products-buffalo-2026.png' },
  { keywords: ['2026 아메리칸이글', '2026 아메리칸 이글', '2026 eagle'],                             file: 'products-eagle-2026.png' },
  { keywords: ['2026 필하모닉', '2026 philharmonic'],                  file: 'products-philharmonic-2026.png' },
  { keywords: ['2026 크루거랜드', '2026 크루거', '2026 krugerrand'],    file: 'products-krugerrand-2026.png' },
  { keywords: ['2026 판다', '2026 panda'],                             file: 'products-panda-2026.png' },
  { keywords: ['2026 성조지', '2026 세인트조지', '2026 george'],       file: 'products-st-george-2026.png' },
  { keywords: ['2026 퀸즈라이언', '2026 queens lion'],                 file: 'products-queens-lion-2026.png' },
  { keywords: ['2026 라이언이글', '2026 lion eagle'],                  file: 'products-lion-eagle-2026.png' },
  { keywords: ['2026 말띠', '2026 horse', '2026 year of horse'],       file: 'products-horse-2026.png' },
  { keywords: ['2026 네스호', '2026 loch ness'],                       file: 'products-loch-ness-2026.png' },
  { keywords: ['2026 스완', '2026 swan'],                              file: 'products-swan-2026.png' },
  { keywords: ['2026 체코라이언', '2026 czech lion'],                  file: 'products-czech-lion-2026.png' },
  { keywords: ['2026 아웃백', '2026 outback'],                         file: 'products-outback-2026.png' },
  { keywords: ['2026 케이브라이언', '2026 cave lion'],                 file: 'products-cave-lion-2026.png' },
  { keywords: ['2026 로얄드래곤', '2026 royal dragon'],                file: 'products-royal-dragon-2026.png' },
  { keywords: ['2026 브리티시라이언', '2026 british lion'],            file: 'products-british-lion-2026.png' },
  { keywords: ['2025 레이디저스티스', '2025 lady justice'],            file: 'products-lady-justice-2025.png' },
];

function getImageForProduct(name) {
  const lower = name.toLowerCase();
  for (const entry of IMAGE_MAP) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return `images/${entry.file}`;
    }
  }
  return null;
}

// ===== 검색 자동완성용 코인명 목록 (nav.js에서 사용) =====
// IMAGE_MAP의 keywords[0]은 항상 "연도 + 코인 정식 한글명" 형태이므로,
// 앞의 연도(4자리 숫자)만 떼면 코인명만 깨끗하게 남는다.
// 상품을 추가/삭제할 때 이 배열을 따로 손댈 필요 없이 IMAGE_MAP만 고치면
// 검색 자동완성도 자동으로 동기화된다 (2026-06-25 COIN_NAMES 수동 동기화
// 누락으로 검색 매칭이 깨졌던 버그의 재발 방지).
function getCoinNamesForSearch() {
  return IMAGE_MAP.map(entry => entry.keywords[0].replace(/^\d{4}\s*/, ''));
}
// nav.js가 로드 순서와 무관하게 안전하게 가져다 쓸 수 있도록 전역에 노출
if (typeof window !== 'undefined') {
  window.getCoinNamesForSearch = getCoinNamesForSearch;
}
