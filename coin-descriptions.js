// =====================================================================
// coin-descriptions.js — 코인 상세페이지 [상품설명] / [상품정보] 탭 데이터
//
// 시트의 description(간략설명)과는 별도로, 상품별 "상세 설명"과 "스펙
// 정보(발행처·순도·중량)"는 이 파일에서 상품명 기준으로 하드코딩 관리한다.
// (2026-06-22 세션 결정: 시트에 스펙 컬럼이 없어 코드 하드코딩 방식 채택)
//
// 매칭 방식: products.js의 IMAGE_MAP과 동일하게 "상품명에 키워드가
// 포함되는지"로 매칭한다(대소문자 무시). 시트의 정확한 전체 상품명을
// 몰라도 안전하게 매칭되고, 상품명이 약간 바뀌어도 깨지지 않는다.
//
// 상품 추가/삭제 시: 이 배열에 항목을 추가/삭제하면 되고
// coin-detail.html / products.js는 건드릴 필요 없다.
//
// ⚠️ specs.verified가 false인 항목은 발행처/순도 등을 확실히 확인하지
// 못한 상태(코인 명칭이 일반적인 정식 발행 시리즈명과 정확히 일치하는지
// 불확실)이므로, 실제 판매 페이지에 노출하기 전에 반드시 실물/공급처
// 기준으로 사실 확인이 필요하다. (footer 실제 사업정보와 동일한 패턴)
// =====================================================================

const COIN_DESCRIPTIONS = [
  {
    keywords: ['2026 메이플', '2026 maple'],
    detail: `캐나다 왕립 조폐국(Royal Canadian Mint)이 발행하는 세계적인 골드 불리온 코인입니다.
순도 99.99%(.9999)의 고순도 금으로 제작되어 불리온 시장에서 가장 신뢰받는 코인 중 하나로 꼽힙니다.
앞면에는 영국 왕실 초상, 뒷면에는 캐나다를 상징하는 단풍잎이 새겨져 있으며,
정교한 보안 마이크로 각인 기술이 적용되어 위변조 방지에도 강점이 있습니다.
높은 순도와 전 세계적인 유동성 덕분에 초보 투자자부터 장기 보유자까지 폭넓게 선호합니다.`,
    specs: { mint: '캐나다 왕립 조폐국 (Royal Canadian Mint)', country: '캐나다', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', verified: true }
  },
  {
    keywords: ['2026 브리타니아', '2026 britannia'],
    detail: `영국 왕립 조폐국(The Royal Mint)이 발행하는 대표 골드 불리온 코인입니다.
2013년부터 순도 99.99%(.9999) 순금으로 제작되며, 영국을 상징하는 여신 '브리타니아'가
디자인의 중심을 이룹니다. 매년 새로운 보안 요소(라티스 백그라운드 등)가 적용되어
위변조 방지 기술이 뛰어난 코인으로 평가받습니다. 오랜 역사와 왕실 조폐국이라는
발행 신뢰도 덕분에 유럽은 물론 전 세계 투자자들에게 꾸준히 인기 있는 상품입니다.`,
    specs: { mint: '영국 왕립 조폐국 (The Royal Mint)', country: '영국', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', verified: true }
  },
  {
    keywords: ['2026 캥거루', '2026 kangaroo'],
    detail: `호주 퍼스 민트(Perth Mint)가 발행하는 골드 불리온 코인으로, 'Australian Kangaroo'
시리즈로도 불립니다. 순도 99.99%(.9999) 순금이며, 매년 새롭게 디자인되는 캥거루
도안이 특징으로 컬렉터들 사이에서도 수집 가치가 높습니다. 퍼스 민트의 엄격한
품질 관리와 정부 보증 덕분에 신뢰도가 높고, 유럽·아시아 시장에서도 활발히 거래됩니다.`,
    specs: { mint: '퍼스 민트 (Perth Mint)', country: '호주', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', verified: true }
  },
  {
    keywords: ['2026 버팔로', '2026 buffalo'],
    detail: `미국 조폐국(United States Mint)이 발행하는 미국 최초의 99.99% 순금 불리온 코인입니다.
1913년 미국 5센트 동전(버팔로 니켈) 디자인을 그대로 계승해 아메리카 들소와
아메리카 원주민 초상이 새겨져 있습니다. 아메리칸 이글과 달리 합금 없이 순금
99.99%로 제작되어, 순도를 중시하는 투자자들에게 특히 선호됩니다.`,
    specs: { mint: '미국 조폐국 (United States Mint)', country: '미국', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', verified: true }
  },
  {
    keywords: ['2026 이글', '2026 eagle'],
    detail: `미국 조폐국이 발행하는 미국의 국가 공식 골드 불리온 코인입니다. 1986년부터 발행되어
온 가장 오래되고 상징적인 코인 중 하나로, 자유의 여신상과 아메리칸 이글(흰머리수리)
디자인이 새겨져 있습니다. 순금이 아닌 22K(91.67%) 합금으로 제작되어 일반 순금
코인보다 표면이 단단하고 마모에 강한 것이 특징이며, 순금 1oz 함량을 기준으로
실제 총 중량은 합금 비율만큼 더 무겁습니다.`,
    specs: { mint: '미국 조폐국 (United States Mint)', country: '미국', purity: '91.67% (22K, 순금 1oz 함량 기준)', weight: '순금 1oz 함량 (총중량 약 33.93g)', verified: true }
  },
  {
    keywords: ['2026 필하모닉', '2026 philharmonic'],
    detail: `오스트리아 민트(Austrian Mint)가 발행하는 유럽에서 가장 거래량이 많은 골드 불리온
코인 중 하나입니다. 빈 필하모닉 오케스트라의 다양한 악기를 형상화한 디자인이
특징으로, 음악과 예술의 도시 빈을 상징합니다. 순도 99.99%(.9999) 순금으로 제작되며,
유럽연합 내에서 부가세 면제 등 거래 편의성이 높아 유럽 투자자들에게 특히 인기가 많습니다.`,
    specs: { mint: '오스트리아 민트 (Austrian Mint)', country: '오스트리아', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', verified: true }
  },
  {
    keywords: ['2026 크루거', '2026 krugerrand'],
    detail: `남아프리카공화국 조폐국(South African Mint)이 1967년부터 발행해온, 세계에서 가장
오래되고 누적 발행량이 많은 골드 불리온 코인입니다. 남아공 초대 대통령 폴 크루거와
스프링복(영양)이 새겨져 있습니다. 이글과 마찬가지로 22K(91.67%) 합금으로 제작되어
내구성이 뛰어나며, 오랜 역사와 압도적인 글로벌 유동성 덕분에 전 세계 불리온
시장의 기준점 역할을 하는 코인입니다.`,
    specs: { mint: '남아공 조폐국 (South African Mint)', country: '남아프리카공화국', purity: '91.67% (22K, 순금 1oz 함량 기준)', weight: '순금 1oz 함량 (총중량 약 33.93g)', verified: true }
  },
  {
    keywords: ['2026 판다', '2026 panda'],
    detail: `중국조폐총공사(China Gold Coin Incorporation)가 발행하는 중국의 대표 골드 불리온
코인입니다. 1982년 첫 발행 이후 자이언트 판다 도안이 매년 새롭게 바뀌는 것이
가장 큰 특징으로, 코인 자체의 투자 가치와 더불어 매년 다른 도안을 모으는 컬렉터들
사이에서도 인기가 높습니다. 순도 99.9% 이상의 높은 순도로 제작됩니다.`,
    specs: { mint: '중국조폐총공사 (China Gold Coin Incorporation)', country: '중국', purity: '99.9% 이상 (.999+) 순금', weight: '1oz (31.1g)', verified: true }
  },
  {
    keywords: ['2026 코뿔소', '2026 rhino'],
    detail: `남아공 조폐국이 발행하는 'Big Five' 시리즈 중 코뿔소를 주제로 한 골드 불리온
코인입니다. 아프리카를 대표하는 5대 동물(빅 파이브)을 매년 순서대로 다루는
시리즈로, 멸종 위기종 보호 메시지를 함께 담고 있어 투자 가치와 의미를 동시에
지닌 코인으로 평가받습니다. 순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { mint: '남아공 조폐국 (South African Mint)', country: '남아프리카공화국', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', verified: true }
  },
  {
    keywords: ['2026 성조지', '2026 세인트조지', '2026 george'],
    detail: `'성 조지와 용(St George and the Dragon)' 도안을 모티프로 한 골드 코인입니다.
용을 물리치는 기사 성 조지의 모습은 유럽 동전 도안 중에서도 가장 오랜 전통을
가진 상징적인 이미지로, 승리와 보호의 의미를 담고 있어 선물용으로도 선호됩니다.`,
    specs: { mint: '발행처 확인 중', country: '확인 중', purity: '확인 중 (실물 기준 확인 필요)', weight: '1oz (31.1g) 추정', verified: false }
  },
  {
    keywords: ['2026 퀸즈라이언', '2026 queens lion'],
    detail: `영국 왕립 조폐국의 '퀸즈 비스트(Queen's Beasts)' 시리즈 중 사자(Lion)를 주제로 한
골드 불리온 코인입니다. 영국 왕실 문장에 등장하는 신화적 동물들을 시리즈로 다루는
이 컬렉션은 정교한 부조 디자인과 왕실 조폐국의 명성으로 컬렉터와 투자자 모두에게
사랑받고 있습니다. 순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { mint: '영국 왕립 조폐국 (The Royal Mint)', country: '영국', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', verified: true }
  },
  {
    keywords: ['2026 라이언이글', '2026 lion eagle'],
    detail: `사자와 독수리, 두 강력한 상징 동물을 함께 담은 디자인의 골드 코인입니다.
힘과 권위를 상징하는 두 동물을 한 코인에 결합한 독특한 구성으로, 일반적인
국가 발행 시리즈와는 차별화된 소장 포인트를 지니고 있습니다.`,
    specs: { mint: '발행처 확인 중', country: '확인 중', purity: '확인 중 (실물 기준 확인 필요)', weight: '1oz (31.1g) 추정', verified: false }
  },
  {
    keywords: ['2026 말띠', '2026 horse', '2026 year of horse'],
    detail: `호주 퍼스 민트의 '루나(Lunar) 시리즈' 중 말의 해(年)를 기념하는 골드 불리온
코인입니다. 12간지를 매년 순서대로 다루는 루나 시리즈는 동양의 띠 문화를
서양식 불리온 코인으로 풀어낸 대표 사례로, 아시아권 투자자와 컬렉터들에게
특히 인기가 높습니다. 순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { mint: '퍼스 민트 (Perth Mint)', country: '호주', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', verified: true }
  },
  {
    keywords: ['2026 네스호', '2026 loch ness'],
    detail: `전설의 괴생물체로 알려진 '네스호의 괴물(Loch Ness Monster)'을 주제로 한
이색 테마 골드 코인입니다. 스코틀랜드의 신비로운 전설을 모티프로 한 독특한
도안으로, 투자 목적뿐 아니라 테마 컬렉션 아이템으로도 소장 가치가 있습니다.`,
    specs: { mint: '발행처 확인 중', country: '확인 중', purity: '확인 중 (실물 기준 확인 필요)', weight: '1oz (31.1g) 추정', verified: false }
  },
  {
    keywords: ['2026 스완', '2026 swan'],
    detail: `호주 퍼스 민트가 발행하는 백조(Swan)를 주제로 한 골드 불리온 코인입니다.
서호주를 상징하는 우아한 백조 도안이 새겨져 있으며, 퍼스 민트의 정교한
부조 기술로 깊이감 있는 디자인을 구현했습니다. 순도 99.99%(.9999) 순금으로
제작되어 호주 발행 코인 특유의 신뢰도를 갖추고 있습니다.`,
    specs: { mint: '퍼스 민트 (Perth Mint)', country: '호주', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', verified: false }
  },
  {
    keywords: ['2026 체코라이언', '2026 czech lion'],
    detail: `체코 조폐국(Czech Mint)이 발행하는 체코 사자(Czech Lion) 골드 불리온 코인입니다.
체코의 국가 문장에 등장하는 쌍꼬리 사자를 모티프로 하며, 정교한 디테일과
유럽 중부 조폐국 특유의 정밀한 타각 기술이 특징입니다. 순도 99.99%(.9999)
순금으로 제작됩니다.`,
    specs: { mint: '체코 조폐국 (Czech Mint)', country: '체코', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', verified: false }
  },
  {
    keywords: ['2026 아웃백', '2026 outback'],
    detail: `호주 퍼스 민트가 발행하는 'Australian Outback' 시리즈 골드 불리온 코인입니다.
호주 내륙(아웃백)의 광활한 자연과 야생동물을 테마로 하며, 매년 새로운 도안으로
발행되어 컬렉터들의 수집 욕구를 자극합니다. 순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { mint: '퍼스 민트 (Perth Mint)', country: '호주', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', verified: true }
  },
  {
    keywords: ['2026 케이브라이언', '2026 cave lion'],
    detail: `선사시대에 서식했던 '케이브라이언(동굴사자)'을 주제로 한 이색 테마 골드 코인입니다.
멸종된 고대 동물을 정교한 부조로 재현해 자연사·고생물학에 관심 있는 컬렉터들
사이에서 특별한 소장 가치를 지닙니다.`,
    specs: { mint: '발행처 확인 중', country: '확인 중', purity: '확인 중 (실물 기준 확인 필요)', weight: '1oz (31.1g) 추정', verified: false }
  },
  {
    keywords: ['2026 로얄드래곤', '2026 royal dragon'],
    detail: `용(Dragon)을 주제로 한 '로얄드래곤' 골드 코인입니다. 동서양을 막론하고 힘과
권위, 길운을 상징하는 용 도안은 꾸준히 인기 있는 테마로, 화려하고 입체적인
부조 디자인이 시각적인 만족도를 더합니다.`,
    specs: { mint: '발행처 확인 중', country: '확인 중', purity: '확인 중 (실물 기준 확인 필요)', weight: '1oz (31.1g) 추정', verified: false }
  },
  {
    keywords: ['2026 브리티시라이언', '2026 british lion'],
    detail: `영국을 상징하는 사자(Lion)를 주제로 한 영국 발행 골드 불리온 코인입니다.
영국 왕실과 깊은 연관이 있는 사자 문장은 힘과 권위의 상징으로 오랫동안
사랑받아온 디자인이며, 영국 조폐국 특유의 섬세한 마감이 돋보입니다.`,
    specs: { mint: '영국 왕립 조폐국 (The Royal Mint) — 확인 중', country: '영국', purity: '99.99% (.9999) 추정 — 확인 필요', weight: '1oz (31.1g) 추정', verified: false }
  },
  {
    keywords: ['2026 세인트조지드래곤', '2026 st george dragon'],
    detail: `'성 조지와 용' 도안을 주제로 한 골드 코인입니다. 용을 물리치는 기사의
모습은 승리와 보호를 상징하는 유럽의 대표적인 전통 도안으로, 묵직한 존재감의
부조 디자인이 특징입니다.`,
    specs: { mint: '발행처 확인 중', country: '확인 중', purity: '확인 중 (실물 기준 확인 필요)', weight: '1oz (31.1g) 추정', verified: false }
  },
  {
    keywords: ['2025 레이디저스티스', '2025 lady justice'],
    detail: `독일 게르마니아 민트(Germania Mint)가 발행하는 '레이디 저스티스(Lady Justice)'
시리즈 골드 코인입니다. 정의의 여신 유스티치아(Justitia)를 형상화한 디자인으로,
공정함과 균형을 상징합니다. 매년 색상·디자인이 조금씩 변형되어 발행되며
순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { mint: '게르마니아 민트 (Germania Mint)', country: '독일', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', verified: true }
  },
];

// 상품명(시트 name 컬럼 값)으로 COIN_DESCRIPTIONS 항목을 찾는다.
// IMAGE_MAP과 동일한 "부분 문자열 포함" 매칭 방식 — products.js의
// getImageForProduct()와 같은 패턴을 따른다.
function getCoinDescription(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  for (const entry of COIN_DESCRIPTIONS) {
    if (entry.keywords.some(k => lower.includes(k))) return entry;
  }
  return null;
}
