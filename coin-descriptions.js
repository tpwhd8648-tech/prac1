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
    detail: `캐나다 왕립 조폐국(Royal Canadian Mint)이 1979년부터 발행하는 세계적인 골드 불리온 코인입니다.\n순도 99.99%(.9999)의 고순도 금으로 제작되어 불리온 시장에서 가장 신뢰받는 코인 중 하나로 꼽힙니다.\n앞면에는 캐나다 예술가 Steven Rosati가 설계한 찰스 3세 국왕의 초상이 새겨져 있으며,\n뒷면에는 캐나다를 상징하는 단풍잎이 담겨 있습니다.\n3가지 보안 요소(방사형 미세 라인, 연도가 새겨진 마이크로 각인 단풍잎 프리비마크,\nBullion DNA™ 위변조 방지 기술)가 적용되어 업계 최고 수준의 위변조 방지력을 갖추고 있습니다.\n높은 순도와 전 세계적인 유동성 덕분에 초보 투자자부터 장기 보유자까지 폭넓게 선호합니다.`,
    specs: { year: '2026', mint: '캐나다 왕립 조폐국 (Royal Canadian Mint)', country: '캐나다', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '30mm', thickness: '2.87mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 브리타니아', '2026 britannia'],
    detail: `영국 왕립 조폐국(The Royal Mint)이 1987년부터 발행하는 대표 골드 불리온 코인입니다.\n2013년부터 순도 99.99%(.9999) 순금으로 제작되며, 영국을 상징하는 여신 '브리타니아'가\n디자인의 중심을 이룹니다. 2021년에는 트라이던트·자물쇠 잠재 이미지, 마이크로 텍스트,\n배경 애니메이션 효과 등 4가지 첨단 보안 요소가 추가되어 위변조 방지 기술이 뛰어난\n코인으로 평가받습니다. 오랜 역사와 왕실 조폐국이라는 발행 신뢰도 덕분에 유럽은 물론\n전 세계 투자자들에게 꾸준히 인기 있는 상품입니다.`,
    specs: { year: '2026', mint: '영국 왕립 조폐국 (The Royal Mint)', country: '영국', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32.69mm', thickness: '2.30mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 캥거루', '2026 kangaroo'],
    detail: `호주 퍼스 민트(Perth Mint)가 1986년부터 발행하는 골드 불리온 코인입니다.\n초기에는 'Australian Gold Nugget'이라는 이름으로 호주 천연금괴 도안을 사용하다가\n1989년부터 캥거루 도안으로 변경했으며, 현재의 'Australian Kangaroo'로 정식 명칭이\n바뀐 것은 2008년입니다. 순도 99.99%(.9999) 순금이며, 매년 새롭게 디자인되는 캥거루\n도안이 특징으로 컬렉터들 사이에서도 수집 가치가 높습니다. 퍼스 민트의 엄격한 품질\n관리와 정부 보증 덕분에 신뢰도가 높고, 유럽·아시아 시장에서도 활발히 거래됩니다.`,
    specs: { year: '2026', mint: '퍼스 민트 (Perth Mint)', country: '호주', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32.6mm', thickness: '2.95mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 버팔로', '2026 buffalo'],
    detail: `미국 조폐국(United States Mint)이 2006년부터 발행하는 미국 최초의 99.99% 순금 불리온 코인입니다.\n1913~1938년까지 통용된 버팔로 니켈(Buffalo Nickel)의 디자인을 계승해,\n아메리카 원주민 초상(앞면)과 아메리카들소(뒷면)가 새겨져 있습니다.\n아메리칸 이글과 달리 합금 없이 순금 99.99%로 제작되어, 순도를 중시하는 투자자들에게\n특히 선호됩니다.`,
    specs: { year: '2026', mint: '미국 조폐국 (United States Mint)', country: '미국', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32.7mm', thickness: '2.95mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 아메리칸이글', '2026 아메리칸 이글', '2026 eagle'],
    detail: `미국 조폐국이 1986년부터 발행하는 미국의 국가 공식 골드 불리온 코인입니다.\n앞면에는 조각가 Augustus Saint-Gaudens가 설계한 레이디 리버티(Lady Liberty) 전신상이,\n뒷면에는 아메리칸 이글(흰머리수리)이 새겨져 있습니다.\n순금이 아닌 22K(91.67%) 합금으로 제작되어 일반 순금 코인보다 표면이 단단하고\n마모에 강한 것이 특징이며, 순금 1oz 함량을 기준으로 실제 총 중량은 합금 비율만큼\n더 무겁습니다.`,
    specs: { year: '2026', mint: '미국 조폐국 (United States Mint)', country: '미국', purity: '91.67% (22K, 순금 1oz 함량 기준)', weight: '순금 1oz 함량 (총중량 약 33.93g)', diameter: '32.7mm', thickness: '2.87mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 필하모닉', '2026 philharmonic'],
    detail: `오스트리아 민트(Austrian Mint)가 1989년부터 발행하는 유럽에서 가장 거래량이 많은 골드 불리온\n코인 중 하나입니다. 빈 필하모닉 오케스트라의 다양한 악기를 형상화한 디자인이\n특징으로, 음악과 예술의 도시 빈을 상징합니다. 순도 99.99%(.9999) 순금으로 제작되며,\n유럽연합 내에서 부가세 면제 등 거래 편의성이 높아 유럽 투자자들에게 특히 인기가 많습니다.`,
    specs: { year: '2026', mint: '오스트리아 민트 (Austrian Mint)', country: '오스트리아', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '37mm', thickness: '2.00mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 크루거', '2026 krugerrand'],
    detail: `남아프리카공화국 조폐국(South African Mint)이 1967년부터 발행해온, 세계 최초의 현대\n골드 불리온 코인입니다. 앞면에는 남아공 공화국 대통령이었던 폴 크루거의 초상이,\n뒷면에는 남아공의 상징 동물인 스프링복(springbok)이 새겨져 있습니다.\n아메리칸이글과 마찬가지로 22K(91.67%) 합금으로 제작되어 내구성이 뛰어나며, 오랜 역사와\n압도적인 글로벌 유동성 덕분에 전 세계 불리온 시장의 기준점 역할을 하는 코인입니다.`,
    specs: { year: '2026', mint: '남아공 조폐국 (South African Mint)', country: '남아프리카공화국', purity: '91.67% (22K, 순금 1oz 함량 기준)', weight: '순금 1oz 함량 (총중량 약 33.93g)', diameter: '32.8mm', thickness: '2.84mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 판다', '2026 panda'],
    detail: `중국조폐총공사(China Gold Coin Incorporation)가 발행하는 중국의 대표 골드 불리온\n코인입니다. 1982년 첫 발행 이후 앞면에는 자이언트 판다 도안이 매년 새롭게 바뀌는 것이 가장 큰 특징으로,\n뒷면에는 베이징 천단(Temple of Heaven)이 새겨져 있습니다.\n코인 자체의 투자 가치와 더불어 매년 다른 도안을 모으는 컬렉터들 사이에서도\n인기가 높습니다. 순도 99.9%(.999) 순금으로 제작됩니다.`,
    specs: { year: '2026', mint: '중국조폐총공사 (China Gold Coin Incorporation)', country: '중국', purity: '99.9% 이상 (.999+) 순금', weight: '30g', diameter: '32mm', thickness: '2.7mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 성조지', '2026 세인트조지', '2026 george'],
    detail: `'성 조지와 용(St George and the Dragon)' 도안을 모티프로 한 골드 코인입니다.\n이 도안은 이탈리아 조각가 Benedetto Pistrucci가 1817년 영국 소버린 금화를 위해\n창작한 이래 200년 넘게 영국 금화를 대표하는 디자인으로 자리잡아 왔습니다.\n용을 물리치는 기사 성 조지의 모습은 승리와 보호의 의미를 담고 있어\n역사적 상징성을 중시하는 컬렉터들에게도 높은 평가를 받습니다.`,
    specs: { year: '2026', mint: '영국 왕립 조폐국 (The Royal Mint)', country: '영국', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32.69mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 퀸즈라이언', '2026 queens lion'],
    detail: `영국 왕립 조폐국의 '로열 튜더 비스트(Royal Tudor Beasts)' 시리즈 중 퀸즈라이언(Queen's Lion)을\n주제로 한 골드 불리온 코인입니다. 헨리 8세와 제3왕비 제인 시모어의 결합을 기념하기 위해\n햄튼 코트 궁전 도개교에 세워진 10개의 문장 수호 동물 석상에서 영감을 얻은 컬렉션으로,\n2022년부터 2026년까지 10종이 순차 발행됩니다. 정교한 부조 디자인과 왕실 조폐국의\n명성으로 컬렉터와 투자자 모두에게 사랑받고 있습니다. 순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { year: '2026', mint: '영국 왕립 조폐국 (The Royal Mint)', country: '영국', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32.69mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 라이언이글', '2026 lion eagle'],
    detail: `영국 왕립 조폐국이 2024년부터 발행하는 영국-미국 우호를 기념하는 골드 불리온 코인입니다.\n영국의 상징인 브리티시 라이언(사자)과 미국의 상징인 아메리칸 이글(흰머리수리)을\n한 코인에 담은 독창적인 구성으로, 아티스트 Jonathan Olliffe가 디자인했습니다.\n두 나라가 공유하는 용기·자유의 가치를 상징하며, 영국과 미국 투자자 모두에게\n호소력 있는 코인으로 주목받고 있습니다. 순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { year: '2026', mint: '영국 왕립 조폐국 (The Royal Mint)', country: '영국', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32.69mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 말띠', '2026 horse', '2026 year of horse'],
    detail: `호주 퍼스 민트의 '루나(Lunar) 시리즈 III' 중 말의 해(年)를 기념하는 골드 불리온\n코인입니다. 12간지를 매년 순서대로 다루는 루나 시리즈는 동양의 띠 문화를\n서양식 불리온 코인으로 풀어낸 대표 사례로, 아시아권 투자자와 컬렉터들에게\n특히 인기가 높습니다. 순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { year: '2026', mint: '퍼스 민트 (Perth Mint)', country: '호주', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32.6mm', thickness: '2.95mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 네스호', '2026 loch ness'],
    detail: `전설의 괴생물체로 알려진 '네스호의 괴물(Loch Ness Monster)'을 주제로 한\n이색 테마 골드 코인입니다. 스코틀랜드의 신비로운 전설을 모티프로 한 독특한\n도안으로, 투자 목적뿐 아니라 테마 컬렉션 아이템으로도 소장 가치가 있습니다.`,
    specs: { year: '2026', mint: '영국 왕립 조폐국 (The Royal Mint)', country: '영국', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32.69mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 스완', '2026 swan'],
    detail: `호주 퍼스 민트가 2017년부터 발행하는 흑조(Black Swan)를 주제로 한 골드 불리온 코인입니다.\n서호주를 상징하는 흑조 도안이 새겨져 있으며, 퍼스 민트의 정교한\n부조 기술로 깊이감 있는 디자인을 구현했습니다. 순도 99.99%(.9999) 순금으로\n제작되어 호주 발행 코인 특유의 신뢰도를 갖추고 있습니다.`,
    specs: { year: '2026', mint: '퍼스 민트 (Perth Mint)', country: '호주', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32.6mm', thickness: '2.95mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 체코라이언', '2026 czech lion'],
    detail: `체코 조폐국(Czech Mint)이 2017년부터 발행하는 체코 사자(Czech Lion) 골드 불리온 코인입니다.\n태평양 섬나라 니우에(Niue)의 법정화폐 면허 하에 발행되며, 체코의 국가 문장에\n등장하는 쌍꼬리 사자를 모티프로 합니다. 낮은 발행 한정 수량과 독특한 디자인으로\n체코는 물론 미국·독일·한국 등 전 세계 투자자들에게 빠르게 인기를 얻은 코인입니다.\n순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { year: '2026', mint: '체코 조폐국 (Czech Mint)', country: '니우에', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '37mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 아웃백', '2026 outback'],
    detail: `호주 퍼스 민트가 발행하는 'Wonders of Australia – The Outback' 시리즈 골드 불리온 코인입니다.\n호주 내륙(아웃백)의 광활한 자연과 딩고, 왈라비, 에뮤 등 야생동물을 테마로 하며,\n대륙 내부의 독특한 생태계를 정교한 부조로 담아냈습니다.\n순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { year: '2026', mint: '퍼스 민트 (Perth Mint)', country: '호주', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32.6mm', thickness: '2.95mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 케이브라이언', '2026 cave lion'],
    detail: `게르마니아 민트(Germania Mint)의 'Megafauna' 시리즈 첫 번째 작품으로,\n빙하기 유럽과 아시아를 지배했던 동굴사자(Cave Lion)를 주제로 한 골드 코인입니다.\n멸종된 고대 거대 동물들을 순차적으로 다루는 이 시리즈는 자연사·고생물학에\n관심 있는 컬렉터들 사이에서 특별한 소장 가치를 지니며, 극히 낮은 한정 발행으로\n희소성이 높습니다.`,
    specs: { year: '2026', mint: '게르마니아 민트 (Germania Mint)', country: '라이베리아', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 로얄드래곤', '2026 royal dragon'],
    detail: `영국 왕립 조폐국의 '로열 튜더 비스트(Royal Tudor Beasts)' 시리즈의 로얄드래곤(Royal Dragon)을\n주제로 한 골드 불리온 코인입니다. 헨리 7세가 보스워스 전투 승리 후 튜더 왕가의\n웨일스 혈통을 상징하기 위해 채택한 로얄드래곤은 500년 이상 웨일스의 상징으로\n이어져 온 강력한 문장 동물입니다. 정교한 부조와 표면 애니메이션 보안 기술이 적용되어 있으며,\n순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { year: '2026', mint: '영국 왕립 조폐국 (The Royal Mint)', country: '영국', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32.69mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2026 브리티시라이언', '2026 british lion'],
    detail: `영국 왕립 조폐국이 2025년부터 발행하는 'British Lion' 골드 불리온 코인입니다.\n'Leo Britannicus'라는 라틴 문구가 새겨진 영국 사자 도안과 함께,\n유니언 플래그(Union Flag)에서 영감을 받은 표면 애니메이션 보안 기술이 적용되어 있습니다.\n용기·보호·권위를 상징하는 영국 왕실의 오랜 문장 동물을 현대적으로 재해석한 코인으로,\n한정 발행으로 희소성이 높습니다. 순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { year: '2026', mint: '영국 왕립 조폐국 (The Royal Mint)', country: '영국', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '32.69mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
  },
  {
    keywords: ['2025 레이디저스티스', '2025 lady justice'],
    detail: `니우에(Niue)에서 발행되고 스코츠데일 민트(Scottsdale Mint)가 제조하는 '레이디 저스티스(Lady Justice)'\n시리즈 골드 코인입니다. 2021년 지브롤터(Gibraltar)에서 시리즈가 시작되었으며,\n2025년판부터 발행국이 니우에로 변경되었습니다. 정의의 여신 유스티치아(Justitia)를\n형상화한 디자인으로, 저울·칼·눈가리개를 통해 공정함과 균형을 상징합니다.\n매년 배경 세부 디자인이 새롭게 변경되어 발행되며, 순도 99.99%(.9999) 순금으로 제작됩니다.`,
    specs: { year: '2025', mint: '스코츠데일 민트 (Scottsdale Mint)', country: '니우에', purity: '99.99% (.9999) 순금', weight: '1oz (31.1g)', diameter: '31.75mm', thickness: '2.4mm', condition: '미사용 (Brilliant Uncirculated)', verified: true }
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
